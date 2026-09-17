import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';
import { Patient, MedicalProfile, BiometricRecord, AccessLog } from '../types';

let supabaseInstance: SupabaseClient | null = null;

if (ENV.IS_SUPABASE_CONFIGURED) {
  try {
    supabaseInstance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });
    console.log('✅ Supabase Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase, falling back to local emergency store:', err);
  }
} else {
  console.log('ℹ️ Supabase credentials not detected. Running with Local High-Performance Emergency Mock Store.');
}

export const supabase = supabaseInstance;

// -------------------------------------------------------------
// Seeded In-Memory Store (Zero-config development & offline resilience)
// -------------------------------------------------------------

export interface SeedData {
  patients: Patient[];
  profiles: Map<string, MedicalProfile>;
  biometrics: BiometricRecord[];
  accessLogs: AccessLog[];
}

// Generate a sample 128-dimensional vector embedding for deterministic matching
function generateMockVector(seed: number): number[] {
  const vector: number[] = [];
  for (let i = 0; i < 128; i++) {
    vector.push(Math.sin(seed + i * 0.1));
  }
  return vector;
}

export const localStore: SeedData = {
  patients: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      phone_hash: '9876543210',
      email: 'aravind.sharma@example.com',
      full_name: 'Aravind Sharma',
      date_of_birth: '1985-04-12',
      gender: 'Male',
      national_id_hash: 'ABHA-91-2847-1928',
      emergency_code: 'EMG-701',
      created_at: new Date().toISOString()
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      phone_hash: '9123456780',
      email: 'priya.patel@example.com',
      full_name: 'Priya Patel',
      date_of_birth: '1968-11-23',
      gender: 'Female',
      national_id_hash: 'ABHA-91-5918-2039',
      emergency_code: 'EMG-842',
      created_at: new Date().toISOString()
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      phone_hash: '9988776655',
      email: 'ananya.verma@example.com',
      full_name: 'Ananya Verma',
      date_of_birth: '2014-08-15',
      gender: 'Female',
      national_id_hash: 'ABHA-91-7719-3829',
      emergency_code: 'EMG-305',
      created_at: new Date().toISOString()
    }
  ],

  profiles: new Map<string, MedicalProfile>([
    [
      'a1111111-1111-1111-1111-111111111111',
      {
        id: 'prof-1',
        patient_id: 'a1111111-1111-1111-1111-111111111111',
        blood_type: 'O-',
        allergies: ['Penicillin', 'Sulfa Drugs', 'Latex'],
        chronic_conditions: ['Type 1 Diabetes Mellitus', 'Hypertension'],
        current_medications: [
          { name: 'Insulin Glargine', dosage: '24 units', frequency: 'Nightly at bedtime' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily morning' }
        ],
        emergency_contacts: [
          { name: 'Pooja Sharma', relation: 'Spouse', phone: '+91 98765 43211' },
          { name: 'Dr. Vivek Rao', relation: 'Primary Endocrinologist', phone: '+91 94444 12345' }
        ],
        organ_donor: true,
        resuscitation_preference: 'Full Code',
        notes: 'High hypoglycemic risk if fasting. Carry glucose gel immediately.'
      }
    ],
    [
      'b2222222-2222-2222-2222-222222222222',
      {
        id: 'prof-2',
        patient_id: 'b2222222-2222-2222-2222-222222222222',
        blood_type: 'B+',
        allergies: ['Aspirin', 'NSAIDs', 'Contrast Dye (Iodine)'],
        chronic_conditions: ['Atrial Fibrillation', 'Dual-Chamber Pacemaker (2023)', 'Chronic Kidney Disease Stage 2'],
        current_medications: [
          { name: 'Warfarin (Coumadin)', dosage: '5mg', frequency: 'Once daily evening' },
          { name: 'Metoprolol Succinate', dosage: '50mg', frequency: 'Once daily morning' }
        ],
        emergency_contacts: [
          { name: 'Rahul Patel', relation: 'Son', phone: '+91 91234 56789' },
          { name: 'Apollo Cardiac ER', relation: 'ER Center Hotline', phone: '+91 44 2829 0200' }
        ],
        organ_donor: false,
        resuscitation_preference: 'Full Code',
        notes: 'Pacemaker implanted in left upper chest. NO MRI without electrophysiology clearance. High bleeding risk.'
      }
    ],
    [
      'c3333333-3333-3333-3333-333333333333',
      {
        id: 'prof-3',
        patient_id: 'c3333333-3333-3333-3333-333333333333',
        blood_type: 'A+',
        allergies: ['Peanuts (Anaphylaxis)', 'Amoxicillin', 'Tree Nuts'],
        chronic_conditions: ['Severe Persistent Asthma', 'Pediatric Eczema'],
        current_medications: [
          { name: 'Albuterol Sulfate Inhaler', dosage: '90mcg (2 puffs)', frequency: 'As needed for bronchospasm' },
          { name: 'EpiPen Jr Auto-Injector', dosage: '0.15mg', frequency: 'Immediate for severe allergic reaction' },
          { name: 'Fluticasone Propionate', dosage: '110mcg', frequency: 'Daily controller' }
        ],
        emergency_contacts: [
          { name: 'Sunita Verma', relation: 'Mother', phone: '+91 99887 76655' },
          { name: 'Dr. Meenakshi', relation: 'Pediatrician', phone: '+91 98111 22334' }
        ],
        organ_donor: true,
        resuscitation_preference: 'Full Code',
        notes: 'Severe peanut anaphylaxis. Immediate epinephrine intramuscular injection required on exposure.'
      }
    ]
  ]),

  biometrics: [
    {
      id: 'bio-1',
      patient_id: 'a1111111-1111-1111-1111-111111111111',
      biometric_type: 'face_embedding',
      biometric_hash: 'face_hash_aravind_sharma_sample_token_001',
      embedding_vector: generateMockVector(1.23),
      confidence_threshold: 0.85
    },
    {
      id: 'bio-2',
      patient_id: 'b2222222-2222-2222-2222-222222222222',
      biometric_type: 'face_embedding',
      biometric_hash: 'face_hash_priya_patel_sample_token_002',
      embedding_vector: generateMockVector(4.56),
      confidence_threshold: 0.85
    },
    {
      id: 'bio-3',
      patient_id: 'c3333333-3333-3333-3333-333333333333',
      biometric_type: 'face_embedding',
      biometric_hash: 'face_hash_ananya_verma_sample_token_003',
      embedding_vector: generateMockVector(7.89),
      confidence_threshold: 0.85
    }
  ],

  accessLogs: [
    {
      id: 'log-init-01',
      patient_id: 'a1111111-1111-1111-1111-111111111111',
      accessed_by: 'Paramedic Unit 108',
      accessor_role: 'Paramedic',
      access_type: 'BIOMETRIC_MATCH',
      reason: 'Golden Hour Emergency Response Trauma Assessment',
      ip_address: '127.0.0.1',
      device_id: 'FIELD-TABLET-01',
      location_coords: '12.9716 N, 77.5946 E',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

