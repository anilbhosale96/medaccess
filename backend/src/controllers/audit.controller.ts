import { Request, Response } from 'express';
import { supabase, localStore } from '../config/supabase';
import { logPatientAccess } from '../middleware/audit.middleware';

export class AuditController {
  public static async getRecentLogs(req: Request, res: Response): Promise<void> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('access_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (!error && data) {
          res.json({ success: true, count: data.length, data });
          return;
        }
      }

      res.json({
        success: true,
        count: localStore.accessLogs.length,
        data: localStore.accessLogs
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async recordLog(req: Request, res: Response): Promise<void> {
    try {
      const { patient_id, accessed_by, accessor_role, access_type, reason, location_coords, device_id } = req.body;

      const log = await logPatientAccess({
        patient_id: patient_id || null,
        accessed_by,
        accessor_role,
        access_type,
        reason,
        location_coords,
        device_id,
        ip_address: req.ipAddress
      });

      res.status(201).json({
        success: true,
        data: log
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

