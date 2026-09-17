import React from 'react';
import { ShieldAlert, Activity, FileText, ArrowLeft } from 'lucide-react';

interface EmergencyHeaderProps {
  onOpenAuditLogs: () => void;
  onReset: () => void;
  isViewingPatient: boolean;
  backendOnline: boolean;
}

export const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({
  onOpenAuditLogs,
  onReset,
  isViewingPatient,
  backendOnline,
}) => {
  return (
    <header className="bg-emergency-700 text-white shadow-xl sticky top-0 z-40 border-b-2 border-emergency-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isViewingPatient && (
            <button
              onClick={onReset}
              className="p-2 bg-emergency-800 hover:bg-emergency-900 rounded-lg text-white font-semibold flex items-center gap-1 transition"
              title="Return to Emergency Scan"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/10 rounded-md backdrop-blur">
              <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase">
                  MEDACCESS
                </h1>
                <span className="bg-emergency-900 px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wider border border-red-400/40">
                  GOLDEN HOUR
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                Emergency Patient Identification System
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/20 border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span className="text-xs text-slate-100">
              {backendOnline ? 'CONNECTED' : 'STANDALONE'}
            </span>
          </div>

          {/* Audit Logs Button */}
          <button
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/40 rounded-lg text-xs font-bold border border-white/20 transition"
            title="View HIPAA Access Logs"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">HIPAA Logs</span>
          </button>
        </div>
      </div>
    </header>
  );
};

