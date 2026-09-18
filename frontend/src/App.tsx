import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { HospitalDashboard } from './components/HospitalDashboard';
import { PatientPortal } from './components/PatientPortal';
import { EmergencyHeader } from './components/EmergencyHeader';
import { BiometricScanner } from './components/BiometricScanner';
import { ManualSearch } from './components/ManualSearch';
import { PatientCard } from './components/PatientCard';
import { AITriageSummary } from './components/AITriageSummary';
import { AuditLogModal } from './components/AuditLogModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { ApiService } from './services/api';
import { PatientFullRecord, BiometricMatchResult, AITriageResponse } from './types';
import { ShieldAlert, Scan, Search, AlertCircle, ChevronRight, Zap } from 'lucide-react';

export default function App() {
  // Master Navigation State: 'landing' | 'patient-portal' | 'login' | 'dashboard' | 'emergency-select' | 'biometric' | 'manual' | 'patient' | 'splash' | 'onboarding'
  const [view, setView] = useState<'splash' | 'onboarding' | 'landing' | 'patient-portal' | 'login' | 'dashboard' | 'emergency-select' | 'biometric' | 'manual' | 'patient'>('landing');
  
  // Patient & Clinical State
  const [selectedPatient, setSelectedPatient] = useState<PatientFullRecord | null>(null);
  const [matchData, setMatchData] = useState<BiometricMatchResult | null>(null);
  const [aiTriage, setAiTriage] = useState<AITriageResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // System State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
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
    setView('patient');
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

  // 1. SPLASH SCREEN (2 sec logo + brand) -> Section 2 Screen 1 of App Flow
  if (view === 'splash') {
    return <SplashScreen onFinish={() => setView('onboarding')} />;
  }

  // 2. ONBOARDING (3 Slides with Skip/Next) -> Section 2 Screen 2 of App Flow
  if (view === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => setView('landing')}
        onSkip={() => setView('landing')}
      />
    );
  }

  // 3. PATIENT SELF-REGISTRATION & PROFILE PORTAL -> Complete Patient App Flow
  if (view === 'patient-portal') {
    return (
      <PatientPortal
        onBackToMain={() => setView('landing')}
        onOpenDoctorPortal={() => setView('dashboard')}
      />
    );
  }

  // 4. LANDING PAGE VIEW (Figma Design: Hero + 4 Process Steps + Security Pillars)
  if (view === 'landing') {
    return (
      <LandingPage
        onGoToEmergency={() => setView('emergency-select')}
        onGoToLogin={() => setView('login')}
        onGoToDashboard={() => setView('dashboard')}
        onGoToPatient={() => setView('patient-portal')}
      />
    );
  }

  // 5. SIGN IN / LOGIN PAGE VIEW (Figma Design: Role Selector + Demo Credentials)
  if (view === 'login') {
    return (
      <LoginPage
        onBackToHome={() => setView('landing')}
        onLoginSuccess={() => setView('dashboard')}
      />
    );
  }

  // 6. HOSPITAL ER DASHBOARD VIEW (Figma Design: 5 Tabs, Map, Cases, Reports)
  if (view === 'dashboard') {
    return (
      <>
        <HospitalDashboard
          onGoToEmergency={() => setView('emergency-select')}
          onSelectCasePatient={(patient) => handlePatientIdentified(patient)}
          onLogout={() => setView('landing')}
          onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        />
        <AuditLogModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      </>
    );
  }

  // 7. EMERGENCY MODE VIEWS (Emergency Select, Biometric Scanner, Manual Search, Patient Card)
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F2F2F5] flex flex-col selection:bg-[#DC2626] selection:text-white font-sans">
      {/* Emergency Top Navigation Header */}
      <EmergencyHeader
        onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onReset={() => {
          if (view === 'patient') {
            setView('emergency-select');
          } else {
            setView('landing');
          }
        }}
        isViewingPatient={view === 'patient'}
        backendOnline={backendOnline}
      />

      {/* Main Responsive Emergency Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* Navigation Bar inside Emergency Mode */}
        <div className="flex items-center justify-between pb-4">
          <button
            onClick={() => setView('landing')}
            className="text-xs font-semibold text-[#A0A0B0] hover:text-white flex items-center gap-1 transition"
          >
            ← Exit Emergency to Home
          </button>
          <div className="flex gap-3 text-xs font-semibold">
            <button
              onClick={() => setView('patient-portal')}
              className="text-emerald-400 hover:underline"
            >
              Patient Portal
            </button>
            <span className="text-[#2B2B3E]">|</span>
            <button
              onClick={() => setView('dashboard')}
              className="text-[#3B82F6] hover:underline"
            >
              Hospital Dashboard
            </button>
          </div>
        </div>

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

        {/* 7.1 EMERGENCY SELECT MODE */}
        {view === 'emergency-select' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/90 border border-red-800 text-red-300 text-xs font-bold uppercase tracking-widest animate-pulse">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Active Emergency Protocol
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F2F2F5] tracking-tight">
                Identify Emergency Patient
              </h2>
              <p className="text-sm text-[#A0A0B0] max-w-md mx-auto">
                Golden Hour critical identification: Instant biometric scanning or rapid manual lookup.
              </p>
            </div>

            {/* Massive Emergency Quick-Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Scan Biometrics Button */}
              <button
                onClick={() => setView('biometric')}
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
                onClick={() => setView('manual')}
                className="group relative p-6 sm:p-8 bg-[#12121A] hover:bg-[#1A1A24] rounded-3xl border-2 border-[#2B2B3E] hover:border-[#3B82F6] shadow-2xl transition-all duration-200 transform hover:-translate-y-1 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-200">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Manual Search
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A0B0] mt-1">
                    Emergency fallback lookup by Phone, ABHA ID, or Code.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#A0A0B0] uppercase tracking-wider">
                  <span>Search Registry</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>

            {/* Quick Demo Pre-seed Bar */}
            <div className="max-w-2xl mx-auto pt-4 border-t border-[#1F1F2E] flex flex-wrap items-center justify-center gap-3 text-xs text-[#A0A0B0]">
              <span className="flex items-center gap-1 font-semibold text-[#F2F2F5]">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Demo Emergency Profiles:
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
                    emergency_code: 'EMG-701',
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
                className="px-2.5 py-1 bg-[#12121A] hover:bg-[#1A1A24] border border-[#2B2B3E] rounded-lg text-[#F2F2F5] transition"
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
                    emergency_code: 'EMG-842',
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
                className="px-2.5 py-1 bg-[#12121A] hover:bg-[#1A1A24] border border-[#2B2B3E] rounded-lg text-[#F2F2F5] transition"
              >
                Priya (B+ / Pacemaker)
              </button>
            </div>
          </div>
        )}

        {/* 7.2 BIOMETRIC SCANNER VIEW */}
        {view === 'biometric' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('emergency-select')}
                className="text-xs font-bold text-[#A0A0B0] hover:text-white uppercase tracking-wider"
              >
                ← Return to Mode Selection
              </button>
              <button
                onClick={() => setView('manual')}
                className="text-xs text-[#3B82F6] hover:underline"
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

        {/* 7.3 MANUAL SEARCH VIEW */}
        {view === 'manual' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('emergency-select')}
                className="text-xs font-bold text-[#A0A0B0] hover:text-white uppercase tracking-wider"
              >
                ← Return to Mode Selection
              </button>
              <button
                onClick={() => setView('biometric')}
                className="text-xs text-[#3B82F6] hover:underline"
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

        {/* 7.4 PATIENT EMERGENCY PROFILE & CLAUDE AI TRIAGE */}
        {view === 'patient' && selectedPatient && (
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

      {/* Supabase PostgreSQL Cloud Status Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
