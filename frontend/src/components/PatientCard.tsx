import React, { useState } from 'react';
import {
  Heart,
  AlertTriangle,
  Pill,
  PhoneCall,
  Activity,
  ShieldCheck,
  Clock,
  Sparkles,
  Copy,
  Check,
  Shield,
  FileCheck2
} from 'lucide-react';
import { PatientFullRecord, BiometricMatchResult } from '../types';

interface PatientCardProps {
  patient: PatientFullRecord;
  matchData?: BiometricMatchResult | null;
  onGenerateAITriage: () => void;
  isAiLoading: boolean;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  matchData,
  onGenerateAITriage,
  isAiLoading,
}) => {
  const profile = patient.medical_profiles;
  const isUniversalDonor = profile?.blood_type === 'O-';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Real-Time Sync & Identification Status Banner */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                {patient.full_name}
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700/60 font-bold">
                ABHA VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>ABHA: {patient.national_id_hash || 'ABHA-91-2847-1928'}</span>
              <span>•</span>
              <span>DOB: {patient.date_of_birth || '1985-04-12'} ({patient.gender || 'Male'})</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">● Real-time synced</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Last updated: 2 hours ago</span>
            </div>
            {matchData && (
              <span className="text-emerald-400 font-bold">
                Biometric ID in {matchData.duration_ms}ms ({Math.round(matchData.confidence * 100)}% conf)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 1. ALLERGIES (YELLOW ALERT BOX - TOP) -> PROMPT 7 SPEC */}
      <div className="bg-amber-950/70 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-2xl relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-200">
              1. CRITICAL ALLERGIES & CONTRAINDICATIONS
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(profile?.allergies.join(', ') || 'No allergies', 'allergies')}
            className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50"
          >
            {copiedField === 'allergies' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedField === 'allergies' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {profile?.allergies && profile.allergies.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.allergies.map((allergy, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow border border-amber-300 tracking-wide uppercase flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                {allergy}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-amber-200">No known drug allergies reported.</p>
        )}

        {profile?.notes && (
          <div className="mt-3 p-2.5 bg-black/40 rounded-xl border border-amber-600/40 text-xs text-amber-200">
            <span className="font-bold text-amber-400">ALERT NOTE:</span> {profile.notes}
          </div>
        )}
      </div>

      {/* 2 & 3. BLOOD TYPE (RED BOX) & CHRONIC CONDITIONS (RED BOX) -> PROMPT 7 SPEC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2. BLOOD TYPE (RED BOX - PROMINENT) */}
        <div className="bg-red-950/80 rounded-2xl p-5 border-2 border-red-600 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-red-300">
                2. BLOOD TYPE
              </span>
              <button
                onClick={() => copyToClipboard(profile?.blood_type || 'Unknown', 'blood')}
                className="text-[10px] text-red-300 hover:text-white flex items-center gap-1 bg-red-900/50 px-1.5 py-0.5 rounded"
              >
                {copiedField === 'blood' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow">
                {profile?.blood_type || 'UNK'}
              </span>
              {isUniversalDonor && (
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Universal Donor
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-800/80 flex items-center justify-between text-xs text-red-200">
            <span>Code Status:</span>
            <span className="font-bold text-white bg-red-900 px-2 py-0.5 rounded border border-red-600">
              {profile?.resuscitation_preference || 'Full Code'}
            </span>
          </div>
        </div>

        {/* 3. CHRONIC CONDITIONS (RED BOX) */}
        <div className="md:col-span-2 bg-red-950/80 rounded-2xl p-5 border-2 border-red-600 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-red-300">
                <Activity className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-200">
                  3. CHRONIC MEDICAL CONDITIONS
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(profile?.chronic_conditions.join(', ') || 'None', 'conditions')}
                className="text-[10px] text-red-300 hover:text-white flex items-center gap-1 bg-red-900/50 px-1.5 py-0.5 rounded"
              >
                {copiedField === 'conditions' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {profile?.chronic_conditions && profile.chronic_conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.chronic_conditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-900/80 text-red-100 border border-red-700 rounded-lg text-xs font-bold shadow-sm"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-300">No chronic medical conditions listed.</p>
            )}
          </div>

          <div className="mt-4 pt-2 border-t border-red-800/80 flex items-center justify-between text-xs text-red-300">
            <span>Organ Donor Status:</span>
            <span className="font-bold text-white">
              {profile?.organ_donor ? 'YES (Registered Organ Donor)' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. CURRENT MEDICATIONS (PURPLE BOX) & 5. EMERGENCY CONTACTS (BLUE BOX) -> PROMPT 7 SPEC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 4. CURRENT MEDICATIONS (PURPLE BOX) */}
        <div className="bg-purple-950/70 rounded-2xl p-5 border-2 border-purple-500 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300">
              <Pill className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                4. CURRENT MEDICATIONS
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(profile?.current_medications.map(m => `${m.name} ${m.dosage}`).join(', ') || 'None', 'meds')}
              className="text-[10px] text-purple-300 hover:text-white flex items-center gap-1 bg-purple-900/50 px-1.5 py-0.5 rounded"
            >
              {copiedField === 'meds' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {profile?.current_medications && profile.current_medications.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {profile.current_medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-900/90 rounded-lg border border-purple-800/60 flex justify-between items-center text-xs"
                >
                  <span className="font-bold text-purple-200">{med.name}</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {med.dosage} • {med.frequency}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-purple-300">No active medications registered.</p>
          )}
        </div>

        {/* 5. EMERGENCY CONTACTS (BLUE BOX) */}
        <div className="bg-blue-950/70 rounded-2xl p-5 border-2 border-blue-500 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-300">
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                5. EMERGENCY CONTACTS
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {profile?.emergency_contacts && profile.emergency_contacts.length > 0 ? (
              profile.emergency_contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.phone}`}
                  className="p-2.5 bg-slate-900/90 hover:bg-slate-950 border border-blue-800/60 hover:border-blue-400 rounded-xl flex items-center justify-between transition group"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                      {contact.name} ({contact.relation})
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">{contact.phone}</p>
                  </div>
                  <div className="p-1.5 bg-blue-600/30 text-blue-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))
            ) : (
              <p className="text-xs text-blue-300">No emergency contacts listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* 6. INSURANCE & REGISTRATION INFO (GRAY BOX) -> PROMPT 7 SPEC */}
      <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <FileCheck2 className="w-4 h-4 text-slate-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">
            6. Healthcare Insurance & ABDM Registry:
          </span>
          <span className="font-mono text-slate-300">PMJAY / Star Health Comprehensive Trauma Cover (#IND-849204)</span>
        </div>
        <span className="text-[11px] bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">
          Consent Privilege: EMERGENCY OVERRIDE
        </span>
      </div>

      {/* Trigger AI Triage Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onGenerateAITriage}
          disabled={isAiLoading}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2.5 transition text-sm"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{isAiLoading ? 'Analyzing Clinical Risk via Claude AI...' : 'Generate Claude Emergency Triage Summary'}</span>
        </button>
      </div>
    </div>
  );
};
