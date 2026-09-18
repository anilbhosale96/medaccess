import { PatientFullRecord, BiometricMatchResult, AITriageResponse, AccessLog } from '../types';

const CLOUD_API_BASE = 'https://medaccess-1qse.vercel.app/api/v1';
const LOCAL_API_BASE = 'http://localhost:3000/api/v1';

// Automatically detect the optimal API backend
function resolveInitialApiBase(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return CLOUD_API_BASE;
    }
  }
  return LOCAL_API_BASE;
}

let activeApiBase = resolveInitialApiBase();

export const ApiService = {
  /**
   * Returns current active backend endpoint and cloud status
   */
  getBackendInfo() {
    return {
      url: activeApiBase,
      isCloud: activeApiBase.includes('vercel.app') || activeApiBase.startsWith('https://'),
      label: activeApiBase.includes('vercel.app') ? 'MedAccess Cloud API (Vercel + Supabase)' : 'Local Express API'
    };
  },

  /**
   * Health Check with Automatic Cloud Failover
   */
  async checkHealth(): Promise<boolean> {
    // 1. Try active URL
    try {
      const healthUrl = `${activeApiBase.replace('/api/v1', '')}/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return true;
      }
    } catch {
      // Current active base failed to respond
    }

    // 2. If currently pointing to localhost, auto-failover to live Cloud backend!
    if (activeApiBase !== CLOUD_API_BASE) {
      try {
        const cloudHealthUrl = `${CLOUD_API_BASE.replace('/api/v1', '')}/health`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const cloudRes = await fetch(cloudHealthUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (cloudRes.ok) {
          console.log('⚡ MedAccess Auto-Connected to Live Cloud Backend:', CLOUD_API_BASE);
          activeApiBase = CLOUD_API_BASE;
          return true;
        }
      } catch {
        // Cloud unreachable
      }
    }

    return false;
  },

  /**
   * Identify Patient by Biometric Hash or Vector (< 500ms target)
   */
  async identifyBiometric(payload: {
    biometric_hash?: string;
    vector?: number[];
    biometric_type?: string;
    accessed_by?: string;
    reason?: string;
  }): Promise<BiometricMatchResult> {
    try {
      const res = await fetch(`${activeApiBase}/biometrics/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Biometric identification failed: ${res.statusText}`);
      }
      return res.json();
    } catch (err) {
      // Auto-fallback to cloud backend if local failed
      if (activeApiBase !== CLOUD_API_BASE) {
        activeApiBase = CLOUD_API_BASE;
        const fallbackRes = await fetch(`${CLOUD_API_BASE}/biometrics/identify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (fallbackRes.ok) return fallbackRes.json();
      }
      throw err;
    }
  },

  /**
   * Search Patients by Phone, Emergency Code, or Name
   */
  async searchPatients(query: string = ''): Promise<PatientFullRecord[]> {
    try {
      const res = await fetch(`${activeApiBase}/patients/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      if (activeApiBase !== CLOUD_API_BASE) {
        activeApiBase = CLOUD_API_BASE;
        const fallbackRes = await fetch(`${CLOUD_API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          return data.data || [];
        }
      }
      throw err;
    }
  },

  /**
   * Fetch Single Patient by ID
   */
  async getPatientById(id: string, accessedBy?: string): Promise<PatientFullRecord> {
    const url = `${activeApiBase}/patients/${id}${accessedBy ? `?accessed_by=${encodeURIComponent(accessedBy)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch patient: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * Register a New Patient (Self-Registration)
   */
  async createPatient(payload: {
    phone_hash: string;
    full_name: string;
    email?: string;
    date_of_birth?: string;
    gender?: string;
    medical_profile?: any;
  }): Promise<PatientFullRecord> {
    const res = await fetch(`${activeApiBase}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Patient registration failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * Request Claude-powered AI Emergency Triage Summary
   */
  async getAITriageSummary(patientId: string, context?: string): Promise<AITriageResponse> {
    const res = await fetch(`${activeApiBase}/ai/triage-summary`, {
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
    const res = await fetch(`${activeApiBase}/audit/logs`);
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
    await fetch(`${activeApiBase}/log-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
  }
};

