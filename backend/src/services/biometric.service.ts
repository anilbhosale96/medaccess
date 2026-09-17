import { supabase, localStore } from '../config/supabase';
import { BiometricRecord, PatientFullRecord } from '../types';

export interface MatchResult {
  matched: boolean;
  patient_id?: string;
  patient?: PatientFullRecord;
  confidence: number;
  biometric_type: string;
  duration_ms: number;
  method: 'vector_cosine' | 'hash_lookup' | 'fuzzy_fallback';
  candidate_matches?: Array<{ patient_id: string; confidence: number; name: string }>;
}

export class BiometricService {
  /**
   * Calculates cosine similarity between two float vectors
   */
  public static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Performs high-speed biometric identification
   * Target: < 500ms
   */
  public static async identify(
    queryVector?: number[],
    biometricHash?: string,
    biometricType: 'face_embedding' | 'fingerprint_minutiae' | 'voice_hash' = 'face_embedding'
  ): Promise<MatchResult> {
    const startTime = performance.now();

    // 1. If Supabase is available and connected
    if (supabase) {
      try {
        if (biometricHash) {
          const { data, error } = await supabase
            .from('biometric_data')
            .select('patient_id, confidence_threshold')
            .eq('biometric_hash', biometricHash)
            .limit(1)
            .single();

          if (!error && data) {
            const patientData = await this.fetchPatientFromDb(data.patient_id);
            const duration = Math.round(performance.now() - startTime);
            return {
              matched: true,
              patient_id: data.patient_id,
              patient: patientData,
              confidence: 0.98,
              biometric_type: biometricType,
              duration_ms: duration,
              method: 'hash_lookup'
            };
          }
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local biometric store:', err);
      }
    }

    // 2. High-speed local store evaluation
    let bestMatch: BiometricRecord | null = null;
    let highestSimilarity = -1;
    const candidates: Array<{ patient_id: string; confidence: number; name: string }> = [];

    for (const record of localStore.biometrics) {
      let similarity = 0;

      if (biometricHash && record.biometric_hash === biometricHash) {
        similarity = 0.99;
      } else if (queryVector && record.embedding_vector) {
        similarity = this.calculateCosineSimilarity(queryVector, record.embedding_vector);
      }

      const patient = localStore.patients.find(p => p.id === record.patient_id);
      if (patient && similarity > 0.4) {
        candidates.push({
          patient_id: record.patient_id,
          confidence: Math.round(similarity * 100) / 100,
          name: patient.full_name
        });
      }

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = record;
      }
    }

    const duration = Math.round(performance.now() - startTime);

    if (bestMatch && highestSimilarity >= 0.75) {
      const patient = localStore.patients.find(p => p.id === bestMatch!.patient_id);
      const profile = localStore.profiles.get(bestMatch.patient_id);

      return {
        matched: true,
        patient_id: bestMatch.patient_id,
        patient: patient ? { ...patient, medical_profiles: profile } : undefined,
        confidence: Math.round(highestSimilarity * 100) / 100,
        biometric_type: biometricType,
        duration_ms: duration,
        method: 'vector_cosine',
        candidate_matches: candidates.sort((a, b) => b.confidence - a.confidence)
      };
    }

    return {
      matched: false,
      confidence: highestSimilarity > 0 ? Math.round(highestSimilarity * 100) / 100 : 0,
      biometric_type: biometricType,
      duration_ms: duration,
      method: 'fuzzy_fallback',
      candidate_matches: candidates.sort((a, b) => b.confidence - a.confidence)
    };
  }

  private static async fetchPatientFromDb(patientId: string): Promise<PatientFullRecord | undefined> {
    if (!supabase) return undefined;
    const { data } = await supabase
      .from('patients')
      .select('*, medical_profiles(*)')
      .eq('id', patientId)
      .single();
    return data || undefined;
  }
}

