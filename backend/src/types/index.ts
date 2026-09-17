export interface Patient {
  id: string;
  phone_hash: string;
  email?: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  national_id_hash?: string;
  emergency_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface MedicalProfile {
  id: string;
  patient_id: string;
  blood_type: string;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: Medication[];
  emergency_contacts: EmergencyContact[];
  organ_donor: boolean;
  resuscitation_preference: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BiometricRecord {
  id: string;
  patient_id: string;
  biometric_type: 'face_embedding' | 'fingerprint_minutiae' | 'voice_hash';
  biometric_hash: string;
  embedding_vector?: number[];
  confidence_threshold: number;
  created_at?: string;
}

export interface AccessLog {
  id: string;
  patient_id: string | null;
  accessed_by: string;
  accessor_role: 'Paramedic' | 'ER Doctor' | 'Nurse' | 'Patient' | 'Admin';
  access_type: 'EMERGENCY_OVERRIDE' | 'CONSENT_GRANTED' | 'BIOMETRIC_MATCH' | 'MANUAL_LOOKUP';
  reason: string;
  ip_address?: string;
  device_id?: string;
  location_coords?: string;
  timestamp: string;
}

export interface ConsentRecord {
  id: string;
  patient_id: string;
  granted_to: string;
  access_level: 'FULL' | 'EMERGENCY_ONLY' | 'RESTRICTED';
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expires_at?: string;
  created_at?: string;
  revoked_at?: string;
}

export interface PatientFullRecord extends Patient {
  medical_profiles?: MedicalProfile;
}

export interface AITriageResponse {
  triage_level: 'Level 1 - Resuscitation' | 'Level 2 - Emergent' | 'Level 3 - Urgent' | 'Level 4 - Less Urgent';
  severity_color: 'red' | 'amber' | 'yellow' | 'green';
  summary_headline: string;
  critical_warnings: string[];
  recommended_actions: string[];
  contraindicated_drugs: string[];
  generated_at: string;
}

