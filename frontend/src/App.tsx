import React, { useState, useEffect } from 'react';
import { EmergencyHeader } from './components/EmergencyHeader';
import { BiometricScanner } from './components/BiometricScanner';
import { ManualSearch } from './components/ManualSearch';
import { PatientCard } from './components/PatientCard';
import { AITriageSummary } from './components/AITriageSummary';
import { AuditLogModal } from './components/AuditLogModal';
import { ApiService } from './services/api';
import { PatientFullRecord, BiometricMatchResult, AITriageResponse } from './types';
import { ShieldAlert, Scan, Search, AlertCircle, Sparkles, ChevronRight, Activity, Zap } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'select' | 'biometric' | 'manual' | 'patient'>('select');
  const [selectedPatient, setSelectedPatient] = useState<PatientFullRecord | null>(null);
  const [matchData, setMatchData] = useState<BiometricMatchResult | null>(null);
  const [aiTriage, setAiTriage] = useState<AITriageResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial Backend Health Ping
  useEffect(() => {
    const ping = async () => {
      const isOnline = await ApiService.checkHealth();
      setBackendOnline(isOnline);
    };
    ping();
    const interval = setInterval(ping, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePatientIdentified = async (
    patient: PatientFullRecord,
    matchInfo?: BiometricMatchResult
  ) => {
    setSelectedPatient(patient);
    setMatchData(matchInfo || null);
    setAiTriage(null);
    setMode('patient');
    setErrorMessage(null);

    // Automatically trigger AI Triage summary upon emergency patient identification
    handleGenerateAiTriage(patient.id);
  };

  const handleGenerateAiTriage = async (patientId?: string) => {
    const id = patientId || selectedPatient?.id;
    if (!id) return;

    setIsAiLoading(true);
    try {
      const summary = await ApiService.getAITriageSummary(
        id,
        'Road accident patient in Golden Hour ambulance transport'
      );
      setAiTriage(summary);
    } catch (err: any) {
      console.warn('AI triage error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPatient(null);
    setMatchData(null);
    setAiTriage(null);
    setMode('select');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Emergency Top Navigation Header */}
      <EmergencyHeader
        onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        onReset={handleReset}
        isViewingPatient={mode === 'patient'}
        backendOnline={backendOnline}
      />

      {/* Main Responsive Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-950/80 border border-red-700 rounded-xl text-xs sm:text-sm text-red-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white text-xs font-bold uppercase tracking-wider px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. SELECT MODE (Main Emergency Landing Dashboard) */}
        {mode === 'select' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/90 border border-red-800 text-red-300 text-xs font-bold uppercase tracking-widest animate-pulse">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Active Emergency Protocol
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Identify Emergency Patient
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                First 60 minutes determine patient survival. Instant biometric lookup or rapid manual search under Golden Hour protocols.
              </p>
            </div>

            {/* Massive Emergency Quick-Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Scan Biometrics Button */}
              <button
                onClick={() => setMode('biometric')}
                className="group relative p-6 sm:p-8 bg-gradient-to-br from-blue-700 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 rounded-3xl border-2 border-blue-500 shadow-2xl transition-all duration-200 transform hover:-translate-y-1 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-200">
                    <Scan className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Scan Biometrics
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 mt-1">
                    Instant facial recognition and vector matching in &lt; 500ms.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <span>Launch Scanner</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>

              {/* Manual Fallback Search Button */}
              <button
                onClick={() => setMode('manual')}
                className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-3xl border-2 border-slate-700 hover:border-slate-500 shadow-2xl transition-all duration-200 transform hover:-translate-y-1 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-200">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Manual Search
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Emergency fallback lookup by Phone, ABHA ID, or Code.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span>Search Registry</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>

            {/* Quick Demo Pre-seed Bar */}
            <div className="max-w-2xl mx-auto pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Demo Golden Hour Profiles:
              </span>
              <button
                onClick={() => handlePatientIdentified(
                  {
                    id: 'a1111111-1111-1111-1111-111111111111',
                    phone_hash: '9876543210',
                    full_name: 'Aravind Sharma',
                    date_of_birth: '1985-04-12',
                    gender: 'Male',
                    national_id_hash: 'ABHA-91-2847-1928',
                    medical_profiles: {
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
                        { name: 'Pooja Sharma', relation: 'Spouse', phone: '+91 98765 43211' }
                      ],
                      organ_donor: true,
                      resuscitation_preference: 'Full Code',
                      notes: 'High hypoglycemic risk if fasting. Carry glucose gel immediately.'
                    }
                  },
                  {
                    matched: true,
                    patient_id: 'a1111111-1111-1111-1111-111111111111',
                    confidence: 0.99,
                    biometric_type: 'face_embedding',
                    duration_ms: 18,
                    method: 'vector_cosine'
                  }
                )}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 transition"
              >
                Aravind (O- / Diabetic)
              </button>
              <button
                onClick={() => handlePatientIdentified(
                  {
                    id: 'b2222222-2222-2222-2222-222222222222',
                    phone_hash: '9123456780',
                    full_name: 'Priya Patel',
                    date_of_birth: '1968-11-23',
                    gender: 'Female',
                    national_id_hash: 'ABHA-91-5918-2039',
                    medical_profiles: {
                      id: 'prof-2',
                      patient_id: 'b2222222-2222-2222-2222-222222222222',
                      blood_type: 'B+',
                      allergies: ['Aspirin', 'NSAIDs', 'Contrast Dye (Iodine)'],
                      chronic_conditions: ['Atrial Fibrillation', 'Dual-Chamber Pacemaker', 'Chronic Kidney Disease'],
                      current_medications: [
                        { name: 'Warfarin (Coumadin)', dosage: '5mg', frequency: 'Once daily evening' },
                        { name: 'Metoprolol Succinate', dosage: '50mg', frequency: 'Once daily morning' }
                      ],
                      emergency_contacts: [
                        { name: 'Rahul Patel', relation: 'Son', phone: '+91 91234 56789' }
                      ],
                      organ_donor: false,
                      resuscitation_preference: 'Full Code',
                      notes: 'Pacemaker in left chest. NO MRI. High bleeding risk on Warfarin.'
                    }
                  },
                  {
                    matched: true,
                    patient_id: 'b2222222-2222-2222-2222-222222222222',
                    confidence: 0.98,
                    biometric_type: 'face_embedding',
                    duration_ms: 22,
                    method: 'vector_cosine'
                  }
                )}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 transition"
              >
                Priya (B+ / Pacemaker)
              </button>
            </div>
          </div>
        )}

        {/* 2. BIOMETRIC SCANNER VIEW */}
        {mode === 'biometric' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMode('select')}
                className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
              >
                ← Return to Mode Selection
              </button>
              <button
                onClick={() => setMode('manual')}
                className="text-xs text-blue-400 hover:underline"
              >
                Switch to Manual Search
              </button>
            </div>
            <BiometricScanner
              onPatientIdentified={handlePatientIdentified}
              onError={msg => setErrorMessage(msg)}
            />
          </div>
        )}

        {/* 3. MANUAL SEARCH VIEW */}
        {mode === 'manual' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMode('select')}
                className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
              >
                ← Return to Mode Selection
              </button>
              <button
                onClick={() => setMode('biometric')}
                className="text-xs text-blue-400 hover:underline"
              >
                Switch to Biometric Scanner
              </button>
            </div>
            <ManualSearch
              onPatientSelected={patient => handlePatientIdentified(patient)}
              onError={msg => setErrorMessage(msg)}
            />
          </div>
        )}

        {/* 4. PATIENT EMERGENCY CARD & CLAUDE AI TRIAGE */}
        {mode === 'patient' && selectedPatient && (
          <div className="space-y-5 pb-8">
            <PatientCard
              patient={selectedPatient}
              matchData={matchData}
              onGenerateAITriage={() => handleGenerateAiTriage()}
              isAiLoading={isAiLoading}
            />

            {/* Render Claude AI Emergency Insights */}
            {aiTriage && <AITriageSummary triage={aiTriage} />}
          </div>
        )}
      </main>

      {/* HIPAA Compliance Audit Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}

