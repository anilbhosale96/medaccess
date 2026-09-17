import { Request, Response, NextFunction } from 'express';
import { supabase, localStore } from '../config/supabase';
import { AccessLog } from '../types';

export async function logPatientAccess(logData: {
  patient_id: string | null;
  accessed_by?: string;
  accessor_role?: AccessLog['accessor_role'];
  access_type?: AccessLog['access_type'];
  reason?: string;
  ip_address?: string;
  device_id?: string;
  location_coords?: string;
}) {
  const newLog: AccessLog = {
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    patient_id: logData.patient_id,
    accessed_by: logData.accessed_by || 'Emergency Responder (Unit 108)',
    accessor_role: logData.accessor_role || 'Paramedic',
    access_type: logData.access_type || 'EMERGENCY_OVERRIDE',
    reason: logData.reason || 'Emergency patient identification & Golden Hour triage',
    ip_address: logData.ip_address || '127.0.0.1',
    device_id: logData.device_id || 'PARAMEDIC-AMB-DEVICE-01',
    location_coords: logData.location_coords || '12.9716 N, 77.5946 E',
    timestamp: new Date().toISOString()
  };

  // 1. Try Supabase
  if (supabase) {
    try {
      await supabase.from('access_logs').insert([
        {
          patient_id: newLog.patient_id,
          accessed_by: newLog.accessed_by,
          accessor_role: newLog.accessor_role,
          access_type: newLog.access_type,
          reason: newLog.reason,
          ip_address: newLog.ip_address,
          device_id: newLog.device_id,
          location_coords: newLog.location_coords,
          timestamp: newLog.timestamp
        }
      ]);
      return newLog;
    } catch (err) {
      console.warn('Could not write audit log to Supabase:', err);
    }
  }

  // 2. Append to local audit store
  localStore.accessLogs.unshift(newLog);
  if (localStore.accessLogs.length > 50) {
    localStore.accessLogs.pop();
  }

  return newLog;
}

export function auditLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  // Capture request IP
  req.ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  next();
}

declare global {
  namespace Express {
    interface Request {
      ipAddress?: string;
    }
  }
}

