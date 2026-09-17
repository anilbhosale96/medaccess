import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { localStore } from '../config/supabase';

export class AIController {
  public static async getTriageSummary(req: Request, res: Response): Promise<void> {
    try {
      const { patient_id, incident_context } = req.body;

      if (!patient_id) {
        res.status(400).json({ error: 'patient_id is required' });
        return;
      }

      const patient = localStore.patients.find(p => p.id === patient_id);
      const profile = localStore.profiles.get(patient_id);

      if (!patient || !profile) {
        res.status(404).json({ error: 'Patient or medical profile not found for AI summarization' });
        return;
      }

      const triageSummary = await AIService.generateTriageSummary(patient, profile, incident_context);

      res.json({
        success: true,
        data: triageSummary
      });
    } catch (error: any) {
      console.error('AI Triage error:', error);
      res.status(500).json({ error: error.message || 'AI summarization failed' });
    }
  }
}

