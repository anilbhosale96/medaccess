import { PatientFullRecord, BiometricMatchResult, AITriageResponse, AccessLog } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const ApiService = {
  /**
   * Health Check
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Identify Patient by Biometric Hash or Vector
   */
  async identifyBiometric(payload: {
    biometric_hash?: string;
    vector?: number[];
    biometric_type?: string;
    accessed_by?: string;
    reason?: string;
  }): Promise<BiometricMatchResult> {
    const res = await fetch(`${API_BASE}/biometrics/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Biometric identification failed: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Manual Search by Phone, Emergency Code, or Name
   */
  async searchPatients(query: string): Promise<PatientFullRecord[]> {
    const res = await fetch(`${API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Search failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data || [];
  },

  /**
   * Fetch Single Patient by ID
   */
  async getPatientById(id: string, accessedBy?: string): Promise<PatientFullRecord> {
    const url = `${API_BASE}/patients/${id}${accessedBy ? `?accessed_by=${encodeURIComponent(accessedBy)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch patient: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * Request Claude-powered AI Emergency Triage Summary
   */
  async getAITriageSummary(patientId: string, context?: string): Promise<AITriageResponse> {
    const res = await fetch(`${API_BASE}/ai/triage-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, incident_context: context })
    });

    if (!res.ok) {
      throw new Error(`AI triage generation failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * Retrieve HIPAA Access Logs
   */
  async getAuditLogs(): Promise<AccessLog[]> {
    const res = await fetch(`${API_BASE}/audit/logs`);
    if (!res.ok) {
      throw new Error(`Failed to load audit logs`);
    }
    const data = await res.json();
    return data.data || [];
  },

  /**
   * Record HIPAA Access
   */
  async recordLog(log: Partial<AccessLog>): Promise<void> {
    await fetch(`${API_BASE}/log-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
  }
};

