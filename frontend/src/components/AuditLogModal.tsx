import React, { useEffect, useState } from 'react';
import { X, Shield, FileText, Clock, MapPin, Laptop, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/api';
import { AccessLog } from '../types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                HIPAA / ABDM COMPLIANCE AUDIT TRAIL
              </h3>
              <p className="text-xs text-slate-400">
                Tamper-Evident Medical Record Access Logs (30+ Day Retention Requirement)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading verified access trail...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No access logs recorded yet.
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{log.accessed_by}</span>
                    <span className="bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded font-mono text-[10px]">
                      {log.accessor_role}
                    </span>
                    <span className="bg-red-950 text-red-300 border border-red-800/50 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                      {log.access_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-slate-300 font-medium bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-semibold">Reason:</span> {log.reason}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Device: {log.device_id || 'Browser/Tablet'}</span>
                  </span>
                  <span>•</span>
                  <span>IP: {log.ip_address || '127.0.0.1'}</span>
                  {log.location_coords && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{log.location_coords}</span>
                      </span>
                    </>
                  )}
                  {log.patient_id && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-500">
                        Patient ID: {log.patient_id.substring(0, 8)}...
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
          <span>Enforcing HIPAA § 164.312(b) Audit Controls</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};

