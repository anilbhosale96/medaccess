import React from 'react';
import { 
  Zap, 
  QrCode, 
  FileText, 
  Activity, 
  Users, 
  Lock, 
  Shield, 
  AlertCircle, 
  FileSpreadsheet, 
  ArrowRight, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface LandingPageProps {
  onGoToEmergency: () => void;
  onGoToLogin: () => void;
  onGoToDashboard: () => void;
  onGoToPatient: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToEmergency,
  onGoToLogin,
  onGoToDashboard,
  onGoToPatient,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 font-sans">SEPS</span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-medium">
                Smart Emergency Patient System
              </span>
            </div>
          </div>

          {/* Right Action Links */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onGoToPatient}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
            >
              Patient Portal
            </button>
            <button
              onClick={onGoToLogin}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-2.5 py-1.5"
            >
              Login
            </button>
            <button
              onClick={onGoToEmergency}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Access</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Figma Design: Clinical Dark Navy) */}
      <section className="bg-[#0B1E38] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-left space-y-6 relative z-10">
          {/* Hackathon Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Smart India Hackathon 2026</span>
          </div>

          {/* Headline with Light Blue Accent */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl">
            Critical patient information{' '}
            <span className="text-[#38BDF8] block sm:inline">
              when every second matters.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            Securely access essential medical information during emergencies and help healthcare professionals make faster, safer decisions in the Golden Hour.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onGoToEmergency}
              className="px-5 sm:px-6 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-xl hover:shadow-red-600/30 transition flex items-center gap-2 text-sm sm:text-base group"
            >
              <AlertCircle className="w-5 h-5 text-white" />
              <span>Emergency Access</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onGoToDashboard}
              className="px-5 sm:px-6 py-3.5 bg-slate-800/90 hover:bg-slate-750 text-slate-100 font-bold rounded-xl border border-slate-700 shadow-md hover:border-slate-500 transition text-sm sm:text-base"
            >
              Doctor / Hospital ER
            </button>

            <button
              onClick={onGoToPatient}
              className="px-5 sm:px-6 py-3.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-xl border border-emerald-500 shadow-md transition text-sm sm:text-base"
            >
              Patient Self-Registration
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step Process Cards (Figma Design) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition text-center space-y-3 relative group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400 block">Step 1</span>
            <h3 className="text-base font-bold text-slate-900">Identify Patient</h3>
            <p className="text-xs text-slate-500">Face, QR, ID, or NFC</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition text-center space-y-3 relative group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400 block">Step 2</span>
            <h3 className="text-base font-bold text-slate-900">Access Information</h3>
            <p className="text-xs text-slate-500">Critical medical data</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition text-center space-y-3 relative group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400 block">Step 3</span>
            <h3 className="text-base font-bold text-slate-900">Respond Faster</h3>
            <p className="text-xs text-slate-500">Informed decisions</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition text-center space-y-3 relative group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400 block">Step 4</span>
            <h3 className="text-base font-bold text-slate-900">Coordinate Care</h3>
            <p className="text-xs text-slate-500">Hospital & doctor</p>
          </div>
        </div>
      </section>

      {/* Security by Design Section (Figma Design) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center space-y-10 border-t border-slate-200/80">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Built for trust and safety
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Security by design
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Security 1 */}
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Secure Access</h4>
            <p className="text-xs text-slate-500">Role-based authentication</p>
          </div>

          {/* Security 2 */}
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Permission Control</h4>
            <p className="text-xs text-slate-500">Level-based data access</p>
          </div>

          {/* Security 3 */}
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Emergency-First</h4>
            <p className="text-xs text-slate-500">Optimised for speed</p>
          </div>

          {/* Security 4 */}
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Audit Logging</h4>
            <p className="text-xs text-slate-500">Every access recorded</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>SEPS · Smart Emergency Patient System · Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
};
