import React, { useState } from 'react';
import { Search, Phone, FileDigit, User, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/api';
import { PatientFullRecord } from '../types';

interface ManualSearchProps {
  onPatientSelected: (patient: PatientFullRecord) => void;
  onError: (msg: string) => void;
}

export const ManualSearch: React.FC<ManualSearchProps> = ({
  onPatientSelected,
  onError,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PatientFullRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await ApiService.searchPatients(query.trim());
      setResults(data);
      if (data.length === 0) {
        onError('No records matched your search query.');
      }
    } catch (err: any) {
      onError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-400" />
        <h2 className="text-base font-bold text-white tracking-wide">
          MANUAL EMERGENCY FALLBACK SEARCH
        </h2>
      </div>

      <p className="text-xs text-slate-300">
        If biometrics cannot be captured (facial trauma, low illumination, or mask), search via Mobile Number, ABHA ID, Emergency Code (e.g. EMG-701), or Name.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search phone (e.g. 9876543210), ABHA, or Name..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 shadow"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results Section */}
      {hasSearched && results.length > 0 && (
        <div className="mt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Matching Patient Records ({results.length})
          </span>
          <div className="divide-y divide-slate-700/60 border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50">
            {results.map(patient => (
              <div
                key={patient.id}
                onClick={() => onPatientSelected(patient)}
                className="p-3.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-blue-400 transition text-sm">
                      {patient.full_name}
                    </span>
                    <span className="text-xs bg-red-950 text-red-300 border border-red-800/40 px-1.5 py-0.5 rounded font-mono font-bold">
                      {patient.medical_profiles?.blood_type || 'Unknown'}
                    </span>
                    {patient.emergency_code && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                        {patient.emergency_code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                    <span>Phone: {patient.phone_hash}</span>
                    <span>•</span>
                    <span>ABHA: {patient.national_id_hash || 'Verified'}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

