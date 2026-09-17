-- =========================================================
-- MEDACCESS: Seed Data for Testing & Demo
-- =========================================================

-- Patient 1: Critical Diabetic with Severe Penicillin Allergy
INSERT INTO patients (id, phone_hash, email, full_name, date_of_birth, gender, national_id_hash, emergency_code)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'sha256_9876543210',
    'aravind.sharma@example.com',
    'Aravind Sharma',
    '1985-04-12',
    'Male',
    'ABHA_91_2847_1928_4819',
    'EMG-701'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO medical_profiles (patient_id, blood_type, allergies, chronic_conditions, current_medications, emergency_contacts, organ_donor, resuscitation_preference, notes)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'O-',
    ARRAY['Penicillin', 'Sulfa Drugs', 'Latex'],
    ARRAY['Type 1 Diabetes Mellitus', 'Hypertension'],
    '[
        {"name": "Insulin Glargine", "dosage": "24 units", "frequency": "Nightly at bedtime"},
        {"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily with meals"},
        {"name": "Lisinopril", "dosage": "10mg", "frequency": "Once daily morning"}
    ]'::JSONB,
    '[
        {"name": "Pooja Sharma", "relation": "Spouse", "phone": "+91 98765 43211"},
        {"name": "Dr. Vivek Rao", "relation": "Primary Endocrinologist", "phone": "+91 94444 12345"}
    ]'::JSONB,
    true,
    'Full Code',
    'High hypoglycemic risk if fasting. Carry glucose gel.'
) ON CONFLICT DO NOTHING;

-- Patient 2: Cardiac Patient with Pacemaker & Anticoagulant Therapy
INSERT INTO patients (id, phone_hash, email, full_name, date_of_birth, gender, national_id_hash, emergency_code)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'sha256_9123456780',
    'priya.patel@example.com',
    'Priya Patel',
    '1968-11-23',
    'Female',
    'ABHA_91_5918_2039_1102',
    'EMG-842'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO medical_profiles (patient_id, blood_type, allergies, chronic_conditions, current_medications, emergency_contacts, organ_donor, resuscitation_preference, notes)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'B+',
    ARRAY['Aspirin', 'NSAIDs', 'Contrast Dye (Iodine)'],
    ARRAY['Atrial Fibrillation', 'Dual-Chamber Pacemaker implanted 2023', 'Chronic Kidney Disease Stage 2'],
    '[
        {"name": "Warfarin (Coumadin)", "dosage": "5mg", "frequency": "Once daily evening"},
        {"name": "Metoprolol Succinate", "dosage": "50mg", "frequency": "Once daily morning"}
    ]'::JSONB,
    '[
        {"name": "Rahul Patel", "relation": "Son", "phone": "+91 91234 56789"},
        {"name": "Apollo Cardiac Unit", "relation": "Hospital ER Hotline", "phone": "+91 44 2829 0200"}
    ]'::JSONB,
    false,
    'Full Code',
    'Pacemaker implanted in left chest. NO MRI without electrophysiology clearance. Bleeding risk on Warfarin.'
) ON CONFLICT DO NOTHING;

-- Patient 3: Pediatric Asthma Patient with Food & Drug Allergies
INSERT INTO patients (id, phone_hash, email, full_name, date_of_birth, gender, national_id_hash, emergency_code)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'sha256_9988776655',
    'ananya.verma@example.com',
    'Ananya Verma',
    '2014-08-15',
    'Female',
    'ABHA_91_7719_3829_9910',
    'EMG-305'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO medical_profiles (patient_id, blood_type, allergies, chronic_conditions, current_medications, emergency_contacts, organ_donor, resuscitation_preference, notes)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'A+',
    ARRAY['Peanuts (Anaphylaxis)', 'Amoxicillin', 'Tree Nuts'],
    ARRAY['Severe Persistent Asthma', 'Eczema'],
    '[
        {"name": "Albuterol Sulfate Inhaler", "dosage": "90mcg (2 puffs)", "frequency": "As needed for bronchospasm"},
        {"name": "EpiPen Auto-Injector", "dosage": "0.15mg", "frequency": "Immediate for severe allergic reaction"},
        {"name": "Fluticasone Propionate", "dosage": "110mcg", "frequency": "Daily controller"}
    ]'::JSONB,
    '[
        {"name": "Sunita Verma", "relation": "Mother", "phone": "+91 99887 76655"},
        {"name": "Dr. Meenakshi (Pediatrician)", "relation": "Doctor", "phone": "+91 98111 22334"}
    ]'::JSONB,
    true,
    'Full Code',
    'Severe peanut anaphylaxis. Keep EpiPen accessible.'
) ON CONFLICT DO NOTHING;

-- Sample HIPAA Access Log
INSERT INTO access_logs (patient_id, accessed_by, accessor_role, access_type, reason, ip_address, device_id, location_coords)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Paramedic Rajan (Unit 108-A)',
    'Paramedic',
    'BIOMETRIC_MATCH',
    'Road accident emergency trauma lookup',
    '192.168.1.45',
    'PARAMEDIC-TAB-IND-42',
    '12.9716 N, 77.5946 E'
);

