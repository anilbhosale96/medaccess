import { createClient } from '@supabase/supabase-js';
import { PatientFullRecord, AccessLog } from '../types';

// Supabase project credentials with resilient fallback
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://svmqyjevjqojrnvqukth.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bXF5amV2anFvanJudnF1a3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzYwMzIsImV4cCI6MjEwNTIxMjAzMn0.qkUTeD7IKJJRrz_0mGZldJP78EQmoxZ0lNP9x5Q6SVM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export interface SupabaseHealthStatus {
  connected: boolean;
  projectUrl: string;
  latencyMs: number;
  patientCount: number;
  auditLogCount: number;
  realtimeStatus: 'SUBSCRIBED' | 'CONNECTING' | 'DISCONNECTED';
}

export const SupabaseService = {
  /**
   * Health check and live stats query directly against Supabase PostgreSQL
   */
  async checkConnection(): Promise<SupabaseHealthStatus> {
    const start = performance.now();
    try {
      const [{ count: pCount, error: pErr }, { count: lCount, error: lErr }] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('access_logs').select('*', { count: 'exact', head: true })
      ]);

      const latencyMs = Math.round(performance.now() - start);

      if (pErr && lErr) {
        return {
          connected: false,
          projectUrl: SUPABASE_URL,
          latencyMs,
          patientCount: 0,
          auditLogCount: 0,
          realtimeStatus: 'DISCONNECTED'
        };
      }

      return {
        connected: true,
        projectUrl: SUPABASE_URL,
        latencyMs,
        patientCount: pCount || 0,
        auditLogCount: lCount || 0,
        realtimeStatus: 'SUBSCRIBED'
      };
    } catch {
      return {
        connected: false,
        projectUrl: SUPABASE_URL,
        latencyMs: Math.round(performance.now() - start),
        patientCount: 0,
        auditLogCount: 0,
        realtimeStatus: 'DISCONNECTED'
      };
    }
  },

  /**
   * Directly fetch all patients with their nested medical profiles
   */
  async getPatients(query: string = ''): Promise<PatientFullRecord[]> {
    try {
      let q = supabase
        .from('patients')
        .select(`
          id,
          phone_hash,
          email,
          full_name,
          date_of_birth,
          gender,
          national_id_hash,
          emergency_code,
          created_at,
          medical_profiles (*)
        `);

      if (query.trim()) {
        q = q.or(`full_name.ilike.%${query}%,emergency_code.ilike.%${query}%,phone_hash.ilike.%${query}%`);
      }

      const { data, error } = await q.order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data as unknown as PatientFullRecord[];
    } catch (err) {
      console.warn('Supabase client patient fetch error:', err);
      return [];
    }
  },

  /**
   * Fetch live HIPAA access logs
   */
  async getRecentAccessLogs(limit: number = 25): Promise<AccessLog[]> {
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data as unknown as AccessLog[];
    } catch (err) {
      console.warn('Supabase logs fetch error:', err);
      return [];
    }
  },

  /**
   * Subscribe to live Realtime audit logs
   */
  subscribeToLogs(onNewLog: (log: AccessLog) => void) {
    const channel = supabase
      .channel('public:access_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'access_logs' },
        payload => {
          if (payload.new) {
            onNewLog(payload.new as AccessLog);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Register patient and medical profile directly into Supabase
   */
  async registerPatient(payload: {
    fullName: string;
    phone: string;
    email?: string;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: any[];
    emergencyContacts?: any[];
  }): Promise<PatientFullRecord | null> {
    try {
      const phoneClean = payload.phone.replace(/[^0-9]/g, '');
      const emergencyCode = 'EMG-' + Math.floor(100 + Math.random() * 900);

      // 1. Check if patient already exists
      const { data: existing } = await supabase
        .from('patients')
        .select('*, medical_profiles(*)')
        .eq('phone_hash', phoneClean)
        .limit(1)
        .maybeSingle();

      if (existing) {
        return existing as unknown as PatientFullRecord;
      }

      // 2. Insert patient
      const { data: patient, error: pErr } = await supabase
        .from('patients')
        .insert([{
          phone_hash: phoneClean,
          full_name: payload.fullName,
          email: payload.email || null,
          gender: 'Unspecified',
          emergency_code: emergencyCode
        }])
        .select()
        .single();

      if (pErr || !patient) {
        console.warn('Supabase patient insert error:', pErr);
        return null;
      }

      // 3. Insert medical profile
      const { data: profile } = await supabase
        .from('medical_profiles')
        .insert([{
          patient_id: patient.id,
          blood_type: payload.bloodType || 'O+',
          allergies: payload.allergies || [],
          chronic_conditions: payload.chronicConditions || [],
          current_medications: payload.medications || [],
          emergency_contacts: payload.emergencyContacts || [],
          organ_donor: false,
          resuscitation_preference: 'Full Code',
          notes: 'Registered via MedAccess Citizen Portal'
        }])
        .select()
        .single();

      return {
        ...patient,
        medical_profiles: profile
      } as unknown as PatientFullRecord;
    } catch (err) {
      console.warn('Supabase direct registration error:', err);
      return null;
    }
  },

  /**
   * Find patient by phone or email
   */
  async findPatient(identifier: string): Promise<PatientFullRecord | null> {
    try {
      const clean = identifier.replace(/[^0-9]/g, '');
      let q = supabase.from('patients').select('*, medical_profiles(*)');
      if (identifier.includes('@')) {
        q = q.eq('email', identifier.trim());
      } else if (clean.length >= 8) {
        q = q.eq('phone_hash', clean);
      } else {
        q = q.or(`emergency_code.eq.${identifier.trim()},full_name.ilike.%${identifier.trim()}%`);
      }

      const { data, error } = await q.limit(1).maybeSingle();
      if (error || !data) return null;
      return data as unknown as PatientFullRecord;
    } catch {
      return null;
    }
  },

  /**
   * Subscribe to live Realtime patient registrations / updates
   */
  subscribeToPatients(onPatientChange: (patient: any) => void) {
    const channel = supabase
      .channel('public:patients')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        payload => {
          if (payload.new) {
            onPatientChange(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

