import React from 'react';
import { X, Printer, ShieldCheck, Heart, AlertTriangle, QrCode } from 'lucide-react';
import { PatientFullRecord } from '../types';

interface EmergencyWristbandModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientFullRecord;
}

export const EmergencyWristbandModal: React.FC<EmergencyWristbandModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  if (!isOpen) return null;

  const profile = patient.medical_profiles;
  const qrData = `SEPS-PATIENT-ID:${patient.emergency_code || patient.id}|BLOOD:${profile?.blood_type || 'UNK'}|ALLERGIES:${profile?.allergies.join(';') || 'NONE'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&margin=4`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-black tracking-wider uppercase">
              OFFICIAL EMERGENCY QR WRISTBAND & CARD
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wristband Card View (Printable) */}
        <div className="p-6 space-y-6">
          <div id="printable-wristband" className="border-4 border-red-600 rounded-2xl p-5 bg-gradient-to-r from-red-50 to-white shadow-md relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex justify-between items-start border-b-2 border-red-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                    SEPS EMERGENCY ID
                  </span>
                  <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded">
                    GOLDEN HOUR WRISTBAND
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {patient.full_name}
                </h2>
                <p className="text-xs font-mono text-slate-600">
                  ID: {patient.emergency_code || 'SEPS-20481'} · DOB: {patient.date_of_birth || '1992-03-12'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">BLOOD</span>
                <span className="text-3xl font-black text-red-700 tracking-tight">
                  {profile?.blood_type || 'O+'}
                </span>
              </div>
            </div>

            {/* Middle: QR Code + Critical Clinical Alerts */}
            <div className="py-4 flex flex-col sm:flex-row items-center gap-5">
              <div className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-sm shrink-0">
                <img
                  src={qrUrl}
                  alt="Emergency Patient QR Code"
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="flex-1 space-y-2 text-xs">
                {profile?.allergies && profile.allergies.length > 0 && (
                  <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-red-900">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      CRITICAL ALLERGY ALERT:
                    </span>
                    <span className="font-semibold">{profile.allergies.join(', ')}</span>
                  </div>
                )}

                {profile?.chronic_conditions && profile.chronic_conditions.length > 0 && (
                  <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900">
                    <span className="font-bold">CONDITIONS: </span>
                    <span>{profile.chronic_conditions.join(', ')}</span>
                  </div>
                )}

                <div className="text-[11px] text-slate-600 pt-1">
                  <span>Emergency Direct Dial: </span>
                  <span className="font-bold font-mono text-slate-900">
                    {profile?.emergency_contacts?.[0]?.phone || '+91 98765 43211'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="border-t border-red-200 pt-2 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>SCAN INSTRUCTIONS: ANY STANDARD OR SEPS RESCUE CAMERA</span>
              <span>HIPAA / ABDM PROTECTED</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hospital-grade thermal printer ready</span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold transition"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Wristband / Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

