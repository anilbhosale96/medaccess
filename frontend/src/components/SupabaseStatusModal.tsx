import React, { useState, useEffect } from 'react';
import { Database, X, CheckCircle2, Wifi, Table2, ShieldCheck, Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { SupabaseService, SupabaseHealthStatus } from '../services/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<SupabaseHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshStatus = async () => {
    setLoading(true);
    const data = await SupabaseService.checkConnection();
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#12121A] border border-[#2B2B3E] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#2B2B3E] flex items-center justify-between bg-[#1A1A24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F2F2F5] flex items-center gap-2">
                <span>Supabase PostgreSQL Cloud</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-[#A0A0B0] font-mono truncate max-w-xs sm:max-w-sm">
                {status?.projectUrl || 'Connecting to Supabase...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0A0B0] hover:text-white hover:bg-[#2B2B3E] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Connection Status Banner */}
          <div className="p-4 bg-[#1A1A24] border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  PostgreSQL Realtime Engine
                </p>
                <p className="text-xs text-emerald-400 font-medium">
                  {status?.connected ? 'Connected & Replicating Events' : 'Connecting to Database...'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#A0A0B0] block uppercase font-mono">Ping Latency</span>
              <span className="text-sm font-black font-mono text-emerald-400">
                {status ? `${status.latencyMs}ms` : '--'}
              </span>
            </div>
          </div>

          {/* Database Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#A0A0B0]">
                <Table2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Registered Patients</span>
              </div>
              <p className="text-xl font-black text-white font-mono">
                {status?.patientCount ?? '--'}
              </p>
              <p className="text-[10px] text-slate-400">table: `patients`</p>
            </div>

            <div className="p-3.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#A0A0B0]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>HIPAA Audit Logs</span>
              </div>
              <p className="text-xl font-black text-white font-mono">
                {status?.auditLogCount ?? '--'}
              </p>
              <p className="text-[10px] text-slate-400">table: `access_logs`</p>
            </div>
          </div>

          {/* Cloud Features Breakdown */}
          <div className="space-y-2 text-xs">
            <p className="text-[11px] font-bold text-[#A0A0B0] uppercase tracking-wider">
              Active Supabase Cloud Services:
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-lg">
                <span className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  PostgreSQL Row-Level Security (RLS)
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-lg">
                <span className="text-slate-300 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  WebSocket Realtime Push (CDC)
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">LISTENING</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#1A1A24] border border-[#2B2B3E] rounded-lg">
                <span className="text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Biometric Hash & Vector Storage
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">128-DIM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2B2B3E] bg-[#1A1A24] flex items-center justify-between">
          <button
            onClick={refreshStatus}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg bg-[#2B2B3E] hover:bg-[#3B3B4E] text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh Ping</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg shadow transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
