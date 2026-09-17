import React from 'react';
import { Sparkles, AlertOctagon, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { AITriageResponse } from '../types';

interface AITriageSummaryProps {
  triage: AITriageResponse;
}

export const AITriageSummary: React.FC<AITriageSummaryProps> = ({ triage }) => {
  const getBadgeStyle = (level: string) => {
    if (level.includes('Level 1')) {
      return 'bg-red-600 border-red-500 text-white';
    } else if (level.includes('Level 2')) {
      return 'bg-amber-600 border-amber-500 text-white';
    } else if (level.includes('Level 3')) {
      return 'bg-yellow-600 border-yellow-500 text-slate-900 font-black';
    }
    return 'bg-emerald-600 border-emerald-500 text-white';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border-2 border-indigo-500/80 shadow-2xl space-y-4 backdrop-blur">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              CLAUDE MEDICAL TRIAGE INTELLIGENCE
            </h3>
            <p className="text-[11px] text-indigo-300">
              Emergency Golden Hour Clinical Decision Protocol
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs uppercase px-3 py-1 rounded-lg border font-bold shadow ${getBadgeStyle(triage.triage_level)}`}>
            {triage.triage_level}
          </span>
        </div>
      </div>

      {/* One-Line Headline */}
      <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-800/60 text-sm font-semibold text-indigo-200">
        <span className="text-white font-bold">SYNOPSIS: </span>
        {triage.summary_headline}
      </div>

      {/* Grid: Contraindicated Drugs + Immediate Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contraindicated Medications Warning */}
        <div className="bg-red-950/60 rounded-xl p-4 border border-red-700/80 space-y-2">
          <div className="flex items-center gap-2 text-red-300">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              STRICTLY CONTRAINDICATED DRUGS
            </h4>
          </div>

          <div className="space-y-1.5">
            {triage.contraindicated_drugs.map((drug, idx) => (
              <div
                key={idx}
                className="text-xs bg-red-900/60 text-red-100 font-bold px-2.5 py-1.5 rounded-lg border border-red-800 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                {drug}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Emergency Actions */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              RECOMMENDED PARAMEDIC ACTIONS
            </h4>
          </div>

          <div className="space-y-2">
            {triage.recommended_actions.map((act, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-4 h-4 bg-emerald-950 border border-emerald-700/80 text-emerald-400 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Warnings */}
      {triage.critical_warnings && triage.critical_warnings.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-300">
          <span className="font-bold text-amber-400">Clinical Flags:</span>
          {triage.critical_warnings.map((warn, idx) => (
            <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {warn}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

