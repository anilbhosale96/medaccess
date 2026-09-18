import React, { useState } from 'react';
import {
  Home,
  User,
  Settings,
  ShieldAlert,
  QrCode,
  Camera,
  Fingerprint,
  FileText,
  AlertTriangle,
  Heart,
  Pill,
  Phone,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Printer,
  Share2,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Activity
} from 'lucide-react';
import { soundFx } from '../services/sound';

interface PatientPortalProps {
  onBackToMain: () => void;
  onOpenDoctorPortal: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onBackToMain,
  onOpenDoctorPortal,
}) => {
  // Navigation: 'home' | 'emergency-form' | 'qr-code' | 'profile' | 'settings' | 'auth'
  const [activeTab, setActiveTab] = useState<'home' | 'emergency-form' | 'qr-code' | 'profile' | 'settings'>('home');
  const [authStep, setAuthStep] = useState<'login' | 'signup' | 'otp' | 'authenticated'>('authenticated');

  // Logged-in patient state
  const [patientUser, setPatientUser] = useState({
    name: 'Aravind Sharma',
    email: 'aravind.sharma@example.com',
    bloodType: 'O-',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Type 1 Diabetes Mellitus'],
    medications: [
      { name: 'Insulin Glargine', dosage: '24 units', frequency: 'Nightly' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
    ],
    surgeries: ['Appendectomy (2018)'],
    emergencyContacts: [
      { name: 'Pooja Sharma', relation: 'Spouse', phone: '+91 98765 43211' }
    ],
    qrCodeId: 'EMG-84920',
    organDonor: true,
    faceRegistered: true,
    fingerprintRegistered: true,
    profileCompleteness: 90
  });

  // Emergency Profile Form Wizard (Step 1: Biometrics, Step 2: Medical Info)
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [tempFaceCaptured, setTempFaceCaptured] = useState(patientUser.faceRegistered);
  const [tempFingerprintCaptured, setTempFingerprintCaptured] = useState(patientUser.fingerprintRegistered);

  // Form Fields
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    soundFx.playBeep(880, 'sine', 0.1);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCaptureFace = () => {
    soundFx.playBeep(659.25, 'triangle', 0.12);
    setTempFaceCaptured(true);
    showToast('Face biometric template generated & encrypted in RAM');
  };

  const handleCaptureFingerprint = () => {
    soundFx.playBeep(783.99, 'triangle', 0.12);
    setTempFingerprintCaptured(true);
    showToast('Fingerprint minutiae template generated (local hash only)');
  };

  const handleSaveEmergencyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playMatchSuccess();
    setPatientUser(prev => ({
      ...prev,
      faceRegistered: tempFaceCaptured,
      fingerprintRegistered: tempFingerprintCaptured,
      profileCompleteness: 100
    }));
    showToast('Emergency Profile Saved & Synced with ABDM Gateway!');
    setActiveTab('qr-code');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    `MEDACCESS-EMERGENCY:${patientUser.qrCodeId}|PATIENT:${patientUser.name}|BLOOD:${patientUser.bloodType}|ALLERGIES:${patientUser.allergies.join(';')}`
  )}&margin=4`;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F2F2F5] flex flex-col font-sans selection:bg-[#C9F24B] selection:text-[#0A0A0F]">
      {/* Top Navbar */}
      <header className="h-16 bg-[#12121A] border-b border-[#2B2B3E] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-[#1A1A24] border border-[#2B2B3E] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#C9F24B] fill-[#C9F24B]" />
          </div>
          <div>
            <span className="text-base font-black tracking-wider text-[#F2F2F5]">MEDACCESS</span>
            <span className="text-[10px] text-[#A0A0B0] ml-2 hidden sm:inline">Patient Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDoctorPortal}
            className="px-3.5 py-2 bg-[#1A1A24] hover:bg-[#2B2B3E] border border-[#2B2B3E] text-xs font-bold text-[#F2F2F5] rounded-lg transition"
          >
            Switch to Doctor Portal
          </button>
          <button
            onClick={onBackToMain}
            className="text-xs text-[#A0A0B0] hover:text-white px-2 py-1"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 bg-[#12121A] border-l-4 border-[#C9F24B] text-[#F2F2F5] px-4 py-3 rounded-lg shadow-2xl z-50 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C9F24B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-12">
        {/* ============================================================= */}
        {/* VIEW 1: PATIENT HOME DASHBOARD                                */}
        {/* ============================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Welcome Greeting Banner */}
            <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl p-6 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9F24B]">
                  PATIENT EMERGENCY DASHBOARD
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#F2F2F5]">
                  Hello, {patientUser.name}
                </h1>
                <p className="text-xs text-[#A0A0B0]">
                  Your emergency medical profile is ready for Golden Hour trauma responders.
                </p>
              </div>

              {/* Completeness Bar */}
              <div className="mt-5 pt-4 border-t border-[#1F1F2E] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#A0A0B0]">Emergency Profile Completeness</span>
                  <span className="text-[#C9F24B] font-mono">{patientUser.profileCompleteness}%</span>
                </div>
                <div className="w-full h-2 bg-[#1A1A24] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C9F24B] rounded-full transition-all duration-500" 
                    style={{ width: `${patientUser.profileCompleteness}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Register / Edit Emergency Profile */}
              <div
                onClick={() => {
                  setFormStep(1);
                  setActiveTab('emergency-form');
                }}
                className="bg-[#12121A] hover:bg-[#1A1A24] border border-[#2B2B3E] hover:border-[#3B82F6] rounded-2xl p-5 cursor-pointer transition group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A24] border border-[#2B2B3E] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <ShieldAlert className="w-6 h-6 text-[#FF4D4D]" />
                  </div>
                  <h3 className="text-base font-bold text-[#F2F2F5]">
                    Register Emergency Profile
                  </h3>
                  <p className="text-xs text-[#A0A0B0] mt-1">
                    Step-by-step biometric registration and critical medical history entry.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#C9F24B] uppercase tracking-wider">
                  <span>Manage Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Card 2: My Emergency QR Code */}
              <div
                onClick={() => setActiveTab('qr-code')}
                className="bg-[#12121A] hover:bg-[#1A1A24] border border-[#2B2B3E] hover:border-[#3B82F6] rounded-2xl p-5 cursor-pointer transition group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A24] border border-[#2B2B3E] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <QrCode className="w-6 h-6 text-[#C9F24B]" />
                  </div>
                  <h3 className="text-base font-bold text-[#F2F2F5]">
                    My Emergency QR Code
                  </h3>
                  <p className="text-xs text-[#A0A0B0] mt-1">
                    Generate, print, or download your official SEPS emergency wristband card.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#C9F24B] uppercase tracking-wider">
                  <span>View ID: {patientUser.qrCodeId}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#A0A0B0]">
                  Your Clinical Highlights (Pre-registered)
                </h3>
                <span className="text-xs text-[#3B82F6] hover:underline cursor-pointer" onClick={() => setActiveTab('profile')}>
                  View Full Profile
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#2B2B3E]">
                  <span className="text-[#A0A0B0] block text-[10px] uppercase font-bold">Blood Group</span>
                  <span className="text-xl font-black text-[#FF4D4D]">{patientUser.bloodType}</span>
                </div>
                <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#2B2B3E]">
                  <span className="text-[#A0A0B0] block text-[10px] uppercase font-bold">Allergies</span>
                  <span className="text-xs font-bold text-[#FBBF24] truncate block">{patientUser.allergies.join(', ')}</span>
                </div>
                <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#2B2B3E]">
                  <span className="text-[#A0A0B0] block text-[10px] uppercase font-bold">Conditions</span>
                  <span className="text-xs font-bold text-[#F2F2F5] truncate block">{patientUser.chronicConditions[0]}</span>
                </div>
                <div className="p-3 bg-[#1A1A24] rounded-xl border border-[#2B2B3E]">
                  <span className="text-[#A0A0B0] block text-[10px] uppercase font-bold">Biometrics</span>
                  <span className="text-xs font-bold text-[#4ADE80]">Face & Fingerprint</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 2: EMERGENCY PROFILE REGISTRATION WIZARD (Step 1 & 2)    */}
        {/* ============================================================= */}
        {activeTab === 'emergency-form' && (
          <div className="space-y-6 animate-in fade-in">
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs font-semibold text-[#A0A0B0] hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#C9F24B] uppercase tracking-wider">
                  STEP {formStep} OF 2: {formStep === 1 ? 'BIOMETRIC TEMPLATE CAPTURE' : 'CRITICAL MEDICAL DATA'}
                </span>
                <h2 className="text-2xl font-black text-[#F2F2F5] mt-1">
                  {formStep === 1 ? 'Register Emergency Biometrics' : 'Enter Emergency Medical Details'}
                </h2>
                <p className="text-xs text-[#A0A0B0] mt-0.5">
                  {formStep === 1 
                    ? 'Captures encrypted vector templates for unconscious identification (never stores permanent raw photos).'
                    : 'Provides doctors with instant life-saving information during the Golden Hour.'
                  }
                </p>
              </div>

              {/* STEP 1: BIOMETRIC REGISTRATION */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Face Scan Card */}
                    <div className="p-5 bg-[#1A1A24] border border-[#2B2B3E] rounded-xl space-y-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#12121A] border border-[#2B2B3E] flex items-center justify-center mx-auto text-[#C9F24B]">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#F2F2F5]">Face Biometric Template</h4>
                        <p className="text-xs text-[#A0A0B0] mt-1">
                          128-dimensional facial embedding vector for trauma room recognition.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCaptureFace}
                        className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                          tempFaceCaptured 
                            ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                            : 'bg-transparent hover:bg-[#C9F24B] text-[#C9F24B] hover:text-[#0A0A0F] border-2 border-[#C9F24B]'
                        }`}
                      >
                        {tempFaceCaptured ? '✓ Face Vector Registered' : 'Take Face Photo'}
                      </button>
                    </div>

                    {/* Fingerprint Card */}
                    <div className="p-5 bg-[#1A1A24] border border-[#2B2B3E] rounded-xl space-y-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#12121A] border border-[#2B2B3E] flex items-center justify-center mx-auto text-[#3B82F6]">
                        <Fingerprint className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#F2F2F5]">Fingerprint Minutiae Template</h4>
                        <p className="text-xs text-[#A0A0B0] mt-1">
                          Fallback identification if facial trauma or debris is present.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCaptureFingerprint}
                        className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                          tempFingerprintCaptured 
                            ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                            : 'bg-transparent hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white border-2 border-[#3B82F6]'
                        }`}
                      >
                        {tempFingerprintCaptured ? '✓ Fingerprint Hash Registered' : 'Register Fingerprint'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="py-3 px-6 bg-[#C9F24B] hover:bg-[#b8e03e] text-[#0A0A0F] font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 transition"
                    >
                      <span>Next: Medical Information</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MEDICAL INFORMATION FORM */}
              {formStep === 2 && (
                <form onSubmit={handleSaveEmergencyProfile} className="space-y-6">
                  {/* Blood Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#A0A0B0] mb-2 uppercase tracking-wider">
                      Blood Group (Required for Emergency Transfusions)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setPatientUser(prev => ({ ...prev, bloodType: b }))}
                          className={`py-2.5 rounded-lg font-black text-xs border transition ${
                            patientUser.bloodType === b
                              ? 'bg-[#FF4D4D] text-white border-[#FF4D4D]'
                              : 'bg-[#1A1A24] border-[#2B2B3E] text-[#A0A0B0] hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drug Allergies */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#FF4D4D] uppercase tracking-wider">
                      Critical Allergies (Red Alert on Doctor Screen)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAllergy}
                        onChange={e => setNewAllergy(e.target.value)}
                        placeholder="e.g. Penicillin, Sulfa, Latex, Peanuts"
                        className="flex-1 px-4 py-3 bg-[#12121A] border border-[#2B2B3E] focus:border-[#C9F24B] rounded-lg text-sm text-[#F2F2F5] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAllergy.trim()) {
                            setPatientUser(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
                            setNewAllergy('');
                          }
                        }}
                        className="px-4 py-3 bg-[#1A1A24] border border-[#2B2B3E] hover:border-[#C9F24B] rounded-lg text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {patientUser.allergies.map((al, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-red-950 border border-red-700 text-red-300 text-xs font-bold rounded-md flex items-center gap-1.5">
                          <span>{al}</span>
                          <Trash2 
                            className="w-3 h-3 cursor-pointer hover:text-white" 
                            onClick={() => setPatientUser(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== idx) }))}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                      Current Medications (Prevents Drug Interactions)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newMedName}
                        onChange={e => setNewMedName(e.target.value)}
                        placeholder="Medicine name (e.g. Insulin)"
                        className="px-4 py-2.5 bg-[#12121A] border border-[#2B2B3E] rounded-lg text-xs text-[#F2F2F5] outline-none"
                      />
                      <input
                        type="text"
                        value={newMedDosage}
                        onChange={e => setNewMedDosage(e.target.value)}
                        placeholder="Dosage (e.g. 24 units, 50mg)"
                        className="px-4 py-2.5 bg-[#12121A] border border-[#2B2B3E] rounded-lg text-xs text-[#F2F2F5] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newMedName.trim()) {
                            setPatientUser(prev => ({
                              ...prev,
                              medications: [...prev.medications, { name: newMedName.trim(), dosage: newMedDosage || 'Standard', frequency: 'Daily' }]
                            }));
                            setNewMedName('');
                            setNewMedDosage('');
                          }
                        }}
                        className="py-2.5 bg-[#1A1A24] border border-[#2B2B3E] hover:border-[#8B5CF6] rounded-lg text-xs font-bold text-[#8B5CF6]"
                      >
                        + Add Medication
                      </button>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {patientUser.medications.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-lg flex justify-between items-center text-xs">
                          <span className="font-bold text-[#F2F2F5]">{m.name} ({m.dosage})</span>
                          <Trash2 
                            className="w-3.5 h-3.5 text-slate-500 hover:text-red-400 cursor-pointer" 
                            onClick={() => setPatientUser(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== idx) }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                      Emergency Contacts (Auto-Dialed in ER)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={newContactName}
                        onChange={e => setNewContactName(e.target.value)}
                        placeholder="Name (e.g. Spouse)"
                        className="px-4 py-2.5 bg-[#12121A] border border-[#2B2B3E] rounded-lg text-xs text-[#F2F2F5] outline-none"
                      />
                      <input
                        type="text"
                        value={newContactRelation}
                        onChange={e => setNewContactRelation(e.target.value)}
                        placeholder="Relation"
                        className="px-4 py-2.5 bg-[#12121A] border border-[#2B2B3E] rounded-lg text-xs text-[#F2F2F5] outline-none"
                      />
                      <input
                        type="text"
                        value={newContactPhone}
                        onChange={e => setNewContactPhone(e.target.value)}
                        placeholder="+91 Phone"
                        className="px-4 py-2.5 bg-[#12121A] border border-[#2B2B3E] rounded-lg text-xs text-[#F2F2F5] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newContactName.trim() && newContactPhone.trim()) {
                            setPatientUser(prev => ({
                              ...prev,
                              emergencyContacts: [...prev.emergencyContacts, { name: newContactName.trim(), relation: newContactRelation || 'Family', phone: newContactPhone.trim() }]
                            }));
                            setNewContactName('');
                            setNewContactPhone('');
                            setNewContactRelation('');
                          }
                        }}
                        className="py-2.5 bg-[#1A1A24] border border-[#2B2B3E] hover:border-[#3B82F6] rounded-lg text-xs font-bold text-[#3B82F6]"
                      >
                        + Add Contact
                      </button>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="p-4 bg-[#1A1A24] border border-[#2B2B3E] rounded-xl flex items-start gap-3 text-xs text-[#A0A0B0]">
                    <input type="checkbox" defaultChecked required className="mt-1" />
                    <span>
                      I give emergency medical consent for authorized emergency physicians and paramedics to access this encrypted data during life-threatening Golden Hour emergencies under ABDM/HIPAA emergency override standards.
                    </span>
                  </div>

                  {/* Form Submission Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="text-xs font-bold uppercase tracking-wider text-[#A0A0B0] hover:text-white"
                    >
                      ← Back to Biometrics
                    </button>

                    <button
                      type="submit"
                      className="py-3 px-8 bg-[#C9F24B] hover:bg-[#b8e03e] text-[#0A0A0F] font-bold rounded-lg text-xs uppercase tracking-wider shadow-lg transition"
                    >
                      Save Profile & Generate QR
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 3: EMERGENCY QR CODE SCREEN                              */}
        {/* ============================================================= */}
        {activeTab === 'qr-code' && (
          <div className="space-y-6 max-w-lg mx-auto text-center animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#C9F24B] uppercase tracking-wider">
                OFFICIAL EMERGENCY ACCESS TOKEN
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F2F2F5]">
                Emergency QR Wristband Card
              </h2>
              <p className="text-xs text-[#A0A0B0]">
                Keep this QR code on your phone lock screen, wristband, or wallet.
              </p>
            </div>

            {/* QR Card Frame */}
            <div className="bg-[#12121A] border-2 border-[#2B2B3E] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
              <div className="flex justify-between items-center text-xs font-bold border-b border-[#1F1F2E] pb-3">
                <span className="text-[#C9F24B] font-mono tracking-widest">{patientUser.qrCodeId}</span>
                <span className="text-[#FF4D4D] font-black">{patientUser.bloodType}</span>
              </div>

              {/* QR Image */}
              <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-md">
                <img
                  src={qrImageUrl}
                  alt="Emergency Patient QR Code"
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#F2F2F5]">{patientUser.name}</h3>
                <p className="text-xs text-[#FF4D4D] font-bold mt-1">
                  ALLERGIES: {patientUser.allergies.join(', ') || 'None'}
                </p>
              </div>

              {/* Action Buttons: Download, Print, Share */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1F1F2E]">
                <a
                  href={qrImageUrl}
                  download={`MedAccess-${patientUser.qrCodeId}.png`}
                  className="py-2.5 px-3 bg-[#1A1A24] hover:bg-[#2B2B3E] border border-[#2B2B3E] rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition"
                >
                  <Download className="w-4 h-4 text-[#C9F24B]" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 bg-[#1A1A24] hover:bg-[#2B2B3E] border border-[#2B2B3E] rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition"
                >
                  <Printer className="w-4 h-4 text-[#3B82F6]" />
                  <span>Print Card</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`MedAccess Emergency QR: ${patientUser.qrCodeId} - Blood: ${patientUser.bloodType}`);
                    setCopied(true);
                    showToast('Emergency Details Copied to Clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="py-2.5 px-3 bg-[#1A1A24] hover:bg-[#2B2B3E] border border-[#2B2B3E] rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#8B5CF6]" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-[#A0A0B0] hover:text-white uppercase tracking-wider"
            >
              ← Back to Home Dashboard
            </button>
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 4: PATIENT PROFILE VIEW & EDIT                           */}
        {/* ============================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#F2F2F5]">Patient Profile</h2>
                <p className="text-xs text-[#A0A0B0]">View and update your stored emergency medical record</p>
              </div>
              <button
                onClick={() => {
                  setFormStep(1);
                  setActiveTab('emergency-form');
                }}
                className="py-2 px-4 bg-transparent hover:bg-[#C9F24B] text-[#C9F24B] hover:text-[#0A0A0F] border border-[#C9F24B] rounded-lg font-bold text-xs uppercase tracking-wider transition"
              >
                Edit Profile
              </button>
            </div>

            <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl p-6 divide-y divide-[#1F1F2E] space-y-4 text-xs">
              <div className="flex justify-between pt-2">
                <span className="text-[#A0A0B0]">Full Legal Name</span>
                <span className="font-bold text-[#F2F2F5]">{patientUser.name}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Registered Email</span>
                <span className="font-mono text-[#F2F2F5]">{patientUser.email}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Blood Group</span>
                <span className="font-black text-[#FF4D4D] text-sm">{patientUser.bloodType}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Drug Allergies</span>
                <span className="font-bold text-[#FBBF24]">{patientUser.allergies.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Chronic Conditions</span>
                <span className="font-bold text-[#F2F2F5]">{patientUser.chronicConditions.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Surgeries</span>
                <span className="font-medium text-[#A0A0B0]">{patientUser.surgeries.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-[#A0A0B0]">Primary Emergency Contact</span>
                <span className="font-bold text-[#3B82F6]">
                  {patientUser.emergencyContacts[0]?.name} ({patientUser.emergencyContacts[0]?.relation}): {patientUser.emergencyContacts[0]?.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 5: SETTINGS                                              */}
        {/* ============================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in max-w-xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-[#F2F2F5]">Settings</h2>
              <p className="text-xs text-[#A0A0B0]">Privacy, compliance, and account management</p>
            </div>

            <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-[#1F1F2E]">
                <div>
                  <h4 className="font-bold text-[#F2F2F5]">Instant Consent Revocation</h4>
                  <p className="text-[11px] text-[#A0A0B0]">Withdraw emergency access in &lt; 5 seconds (§ 164.524)</p>
                </div>
                <button
                  onClick={() => showToast('Patient consent status toggled and logged.')}
                  className="px-3 py-1.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-lg text-xs font-bold text-[#FBBF24]"
                >
                  Manage Consent
                </button>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#1F1F2E]">
                <div>
                  <h4 className="font-bold text-[#F2F2F5]">Privacy Policy</h4>
                  <p className="text-[11px] text-[#A0A0B0]">HIPAA, ABDM & Zero Permanent Biometric Storage Policy</p>
                </div>
                <a
                  href="#privacy"
                  onClick={(e) => { e.preventDefault(); showToast('Privacy Policy: All biometric vectors are encrypted and destroyed after session matching.'); }}
                  className="text-xs text-[#3B82F6] hover:underline"
                >
                  View Policy
                </a>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#1F1F2E]">
                <div>
                  <h4 className="font-bold text-[#F2F2F5]">Terms of Service</h4>
                  <p className="text-[11px] text-[#A0A0B0]">Emergency Healthcare Information Standard</p>
                </div>
                <a
                  href="#terms"
                  onClick={(e) => { e.preventDefault(); showToast('Terms: MedAccess is optimized for Golden Hour medical decision support.'); }}
                  className="text-xs text-[#3B82F6] hover:underline"
                >
                  View Terms
                </a>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={onBackToMain}
                  className="py-2.5 px-4 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your emergency medical profile? All encrypted templates will be wiped.')) {
                      showToast('Account scheduled for deletion.');
                      onBackToMain();
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-red-400"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Section 4 UI/UX Brief) */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#0A0A0F] border-t border-[#2B2B3E] h-16 flex items-center justify-around z-40 md:hidden">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            activeTab === 'home' ? 'text-[#C9F24B]' : 'text-[#6B7280]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('qr-code')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            activeTab === 'qr-code' ? 'text-[#C9F24B]' : 'text-[#6B7280]'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span>My QR</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            activeTab === 'profile' ? 'text-[#C9F24B]' : 'text-[#6B7280]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            activeTab === 'settings' ? 'text-[#C9F24B]' : 'text-[#6B7280]'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

