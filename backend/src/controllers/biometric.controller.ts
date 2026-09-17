import { Request, Response } from 'express';
import { BiometricService } from '../services/biometric.service';
import { logPatientAccess } from '../middleware/audit.middleware';

export class BiometricController {
  public static async emergencyIdentify(req: Request, res: Response): Promise<void> {
    try {
      const { biometricData, type, staffId, location } = req.body;

      if (!biometricData) {
        res.status(400).json({ error: 'biometricData is required' });
        return;
      }

      // 1. Identify patient instantly (< 500ms)
      const matchResult = await BiometricService.identify(
        undefined,
        biometricData,
        (type as any) || 'face_embedding'
      );

      if (!matchResult.matched || !matchResult.patient) {
        res.status(404).json({
          status: 'NOT_FOUND',
          message: 'No biometric match found',
          candidate_matches: matchResult.candidate_matches || []
        });
        return;
      }

      const patient = matchResult.patient;
      const profile = patient.medical_profiles;

      // 2. Generate AI emergency triage summary if medical profile is present
      let aiSummary = null;
      if (profile) {
        const { AIService } = await import('../services/ai.service');
        aiSummary = await AIService.generateTriageSummary(patient, profile, `Emergency triage at ${location || 'Ambulance'}`);
      }

      // 3. Log access with reason, staffId, location, timestamp
      await logPatientAccess({
        patient_id: patient.id,
        accessed_by: staffId || 'Paramedic Staff',
        accessor_role: 'Paramedic',
        access_type: 'EMERGENCY_OVERRIDE',
        reason: 'Golden Hour Emergency Mode Activation',
        location_coords: location || '12.9716 N, 77.5946 E',
        ip_address: req.ipAddress
      });

      // 4. Return composite response matching Prompt 2 specification
      res.json({
        status: 'SUCCESS',
        patient: {
          id: patient.id,
          full_name: patient.full_name,
          phone_hash: patient.phone_hash,
          emergency_code: patient.emergency_code,
          national_id_hash: patient.national_id_hash
        },
        medicalProfile: profile || null,
        aiSummary,
        consentLevel: 'EMERGENCY_OVERRIDE'
      });
    } catch (error: any) {
      console.error('Emergency identification failed:', error);
      res.status(500).json({ error: error.message || 'Internal emergency identification error' });
    }
  }

  public static async identify(req: Request, res: Response): Promise<void> {
    try {
      const { vector, biometric_hash, biometric_type, accessed_by, reason } = req.body;

      if (!vector && !biometric_hash) {
        res.status(400).json({
          error: 'Either vector (embedding array) or biometric_hash must be provided'
        });
        return;
      }

      const matchResult = await BiometricService.identify(vector, biometric_hash, biometric_type);

      // If a patient was successfully matched, record HIPAA access log
      if (matchResult.matched && matchResult.patient_id) {
        await logPatientAccess({
          patient_id: matchResult.patient_id,
          accessed_by: accessed_by || 'Paramedic Unit 108',
          accessor_role: 'Paramedic',
          access_type: 'BIOMETRIC_MATCH',
          reason: reason || 'Rapid emergency identification in Golden Hour',
          ip_address: req.ipAddress
        });
      }

      res.json({
        success: true,
        ...matchResult
      });
    } catch (error: any) {
      console.error('Biometric identification error:', error);
      res.status(500).json({ error: error.message || 'Biometric matching failed' });
    }
  }
}

