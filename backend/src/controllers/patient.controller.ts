import { Request, Response } from 'express';
import { supabase, localStore } from '../config/supabase';
import { logPatientAccess } from '../middleware/audit.middleware';
import { PatientFullRecord } from '../types';

export class PatientController {
  public static async getPatientById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const clinicianId = (req.query.accessed_by as string) || (req.headers['x-staff-id'] as string) || 'Dr. Sharma (ER Trauma)';
    const reason = (req.query.reason as string) || 'Emergency Golden Hour Profile Retrieval';

    try {
      let patientData: PatientFullRecord | null = null;

      // 1. Supabase Check
      if (supabase) {
        const { data, error } = await supabase
          .from('patients')
          .select('*, medical_profiles(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          patientData = data;
        }
      }

      // 2. Local Fallback
      if (!patientData) {
        const patient = localStore.patients.find(p => p.id === id);
        if (patient) {
          const profile = localStore.profiles.get(id);
          patientData = { ...patient, medical_profiles: profile };
        }
      }

      if (!patientData) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }

      // Log access for HIPAA compliance
      await logPatientAccess({
        patient_id: id,
        accessed_by: clinicianId,
        accessor_role: 'ER Doctor',
        access_type: 'EMERGENCY_OVERRIDE',
        reason,
        ip_address: req.ipAddress
      });

      res.json({
        success: true,
        data: patientData
      });
    } catch (error: any) {
      console.error('Error in getPatientById:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  public static async searchPatients(req: Request, res: Response): Promise<void> {
    const query = ((req.query.q as string) || '').trim().toLowerCase();
    if (!query) {
      res.status(400).json({ error: 'Search query parameter (q) is required' });
      return;
    }

    try {
      const results: PatientFullRecord[] = [];

      // Local fallback search (matches phone, emergency code, ABHA, or name)
      for (const p of localStore.patients) {
        const match =
          p.full_name.toLowerCase().includes(query) ||
          p.phone_hash.includes(query) ||
          (p.emergency_code && p.emergency_code.toLowerCase().includes(query)) ||
          (p.national_id_hash && p.national_id_hash.toLowerCase().includes(query));

        if (match) {
          const profile = localStore.profiles.get(p.id);
          results.push({ ...p, medical_profiles: profile });
        }
      }

      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const { phone_hash, email, full_name, date_of_birth, gender, medical_profile } = req.body;

      if (!phone_hash || !full_name) {
        res.status(400).json({ error: 'phone_hash and full_name are required' });
        return;
      }

      const newId = 'pat-' + Math.random().toString(36).substring(2, 9);
      const newPatient = {
        id: newId,
        phone_hash,
        email: email || undefined,
        full_name,
        date_of_birth: date_of_birth || undefined,
        gender: gender || 'Unspecified',
        emergency_code: 'EMG-' + Math.floor(100 + Math.random() * 900),
        created_at: new Date().toISOString()
      };

      localStore.patients.push(newPatient);

      if (medical_profile) {
        const profile = {
          id: 'prof-' + Math.random().toString(36).substring(2, 9),
          patient_id: newId,
          blood_type: medical_profile.blood_type || 'Unknown',
          allergies: medical_profile.allergies || [],
          chronic_conditions: medical_profile.chronic_conditions || [],
          current_medications: medical_profile.current_medications || [],
          emergency_contacts: medical_profile.emergency_contacts || [],
          organ_donor: Boolean(medical_profile.organ_donor),
          resuscitation_preference: medical_profile.resuscitation_preference || 'Full Code',
          notes: medical_profile.notes || '',
          created_at: new Date().toISOString()
        };
        localStore.profiles.set(newId, profile);
      }

      res.status(201).json({
        success: true,
        data: {
          ...newPatient,
          medical_profiles: localStore.profiles.get(newId)
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

