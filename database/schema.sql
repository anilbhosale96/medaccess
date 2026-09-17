-- =========================================================
-- MEDACCESS: Smart Emergency Patient Information System
-- Database Schema for Supabase (PostgreSQL)
-- Problem Statement: MHT07 - Smart India Hackathon 2026
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_hash TEXT NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    national_id_hash TEXT, -- ABHA or National ID hash
    emergency_code VARCHAR(10) UNIQUE, -- Rapid alphanumeric fallback code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MEDICAL PROFILES TABLE
CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    blood_type VARCHAR(5) NOT NULL, -- e.g., O+, O-, A+, AB-
    allergies TEXT[] DEFAULT '{}', -- e.g., {'Penicillin', 'Latex', 'Peanuts'}
    chronic_conditions TEXT[] DEFAULT '{}', -- e.g., {'Type 1 Diabetes', 'Hypertension', 'Asthma'}
    current_medications JSONB DEFAULT '[]'::JSONB, -- Array of {name, dosage, frequency}
    emergency_contacts JSONB DEFAULT '[]'::JSONB, -- Array of {name, relation, phone}
    organ_donor BOOLEAN DEFAULT false,
    resuscitation_preference VARCHAR(50) DEFAULT 'Full Code', -- DNR, DNI, Full Code
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BIOMETRIC DATA TABLE
CREATE TABLE IF NOT EXISTS biometric_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    biometric_type VARCHAR(50) NOT NULL, -- 'face_embedding', 'fingerprint_minutiae', 'voice_hash'
    biometric_hash TEXT NOT NULL,
    embedding_vector REAL[] DEFAULT NULL, -- 128 or 512-dimensional float vector for cosine matching
    confidence_threshold REAL DEFAULT 0.85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ACCESS LOGS TABLE (STRICT HIPAA / ABDM COMPLIANCE REQUIREMENT)
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    accessed_by TEXT NOT NULL, -- Clinician / Paramedic ID or Name
    accessor_role VARCHAR(50) NOT NULL, -- 'Paramedic', 'ER Doctor', 'Nurse', 'Patient'
    access_type VARCHAR(50) NOT NULL, -- 'EMERGENCY_OVERRIDE', 'CONSENT_GRANTED', 'BIOMETRIC_MATCH'
    reason TEXT NOT NULL, -- e.g. 'Trauma Code Red Golden Hour Lookup'
    ip_address TEXT,
    device_id TEXT,
    location_coords TEXT, -- GPS Coordinates of ambulance/ER
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONSENT RECORDS TABLE (PATIENT DATA PRIVACY CONTROL)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    granted_to TEXT NOT NULL, -- Hospital ID / Responder Organization
    access_level VARCHAR(50) NOT NULL DEFAULT 'EMERGENCY_ONLY', -- 'FULL', 'EMERGENCY_ONLY', 'RESTRICTED'
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'REVOKED', 'EXPIRED'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_patient_phone ON patients(phone_hash);
CREATE INDEX IF NOT EXISTS idx_patient_code ON patients(emergency_code);
CREATE INDEX IF NOT EXISTS idx_medical_profile_patient ON medical_profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_biometric_patient ON biometric_data(patient_id);
CREATE INDEX IF NOT EXISTS idx_biometric_type ON biometric_data(biometric_type);
CREATE INDEX IF NOT EXISTS idx_access_logs_patient ON access_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_consent_patient ON consent_records(patient_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Allow authenticated medical staff / emergency bypass service role full operational access
CREATE POLICY "Emergency responders can read patient essentials"
    ON patients FOR SELECT
    USING (true);

CREATE POLICY "Emergency responders can read medical profiles"
    ON medical_profiles FOR SELECT
    USING (true);

CREATE POLICY "Access logs can be inserted by any authenticated or emergency worker"
    ON access_logs FOR INSERT
    WITH CHECK (true);

-- 8. AUTOMATIC AUDIT TRIGGER FUNCTION (Prompt 11 Requirement)
CREATE OR REPLACE FUNCTION log_patient_data_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO access_logs (
        patient_id,
        accessed_by,
        accessor_role,
        access_type,
        reason,
        ip_address,
        timestamp
    ) VALUES (
        COALESCE(NEW.patient_id, NEW.id, OLD.patient_id, OLD.id),
        current_user,
        'SYSTEM_TRIGGER',
        TG_OP,
        'Auto audit logged data modification on ' || TG_TABLE_NAME,
        inet_client_addr()::TEXT,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger to medical profiles
DROP TRIGGER IF EXISTS trg_audit_medical_profiles ON medical_profiles;
CREATE TRIGGER trg_audit_medical_profiles
    AFTER INSERT OR UPDATE OR DELETE ON medical_profiles
    FOR EACH ROW EXECUTE FUNCTION log_patient_data_change();


