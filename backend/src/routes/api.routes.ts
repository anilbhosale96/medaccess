import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { BiometricController } from '../controllers/biometric.controller';
import { AIController } from '../controllers/ai.controller';
import { AuditController } from '../controllers/audit.controller';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MedAccess Backend Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Patient Endpoints
router.get('/patients/search', PatientController.searchPatients);
router.get('/patients/:id', PatientController.getPatientById);
router.post('/patients', PatientController.createPatient);

// Biometric Identification (< 500ms target)
router.post('/biometrics/identify', BiometricController.identify);
router.post('/auth/emergency-identify', BiometricController.emergencyIdentify);

// AI Emergency Triage (Claude Powered)
router.post('/ai/triage-summary', AIController.getTriageSummary);
router.post('/ai/summary', AIController.getTriageSummary); // Alias for Prompt 5 compatibility

// HIPAA Compliance Audit Logs
router.get('/audit/logs', AuditController.getRecentLogs);
router.post('/log-access', AuditController.recordLog);

export default router;

