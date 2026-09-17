import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Stethoscope, Building2 } from 'lucide-react';

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (userRole: string, userName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('rahul.verma@citycare.in');
  const [password, setPassword] = useState('DEMO123');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'responder' | 'staff'>('responder');

  const demoAccounts = [
    {
      initial: 'E',
      role: 'Emergency Responder',
      sub: 'Paramedic — Rahul Verma',
      email: 'rahul.verma@citycare.in',
      bgColor: 'bg-slate-100 text-slate-800'
    },
    {
      initial: 'D',
      role: 'Doctor',
      sub: 'Dr. Ananya Mehta, CityCare',
      email: 'ananya.mehta@citycare.in',
      bgColor: 'bg-blue-100 text-blue-800'
    },
    {
      initial: 'H',
      role: 'Hospital Staff',
      sub: 'CityCare Emergency Hospital',
      email: 'staff@citycare.in',
      bgColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword('DEMO123');
    onLoginSuccess(acc.role, acc.sub);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(activeTab === 'responder' ? 'Emergency Responder' : 'Hospital Staff', email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Back to Home Link */}
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Title */}
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Access your emergency healthcare dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email / Employee ID
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hospital.in"
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center"
            >
              Sign In
            </button>
          </form>

          {/* Role Filter Tabs (Figma Design) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('responder')}
              className={`py-2 text-xs font-bold rounded-lg border transition ${
                activeTab === 'responder'
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Emergency Responder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`py-2 text-xs font-bold rounded-lg border transition ${
                activeTab === 'staff'
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Hospital Staff
            </button>
          </div>

          {/* Demo Accounts Card (Figma Design) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
            <span className="text-[11px] font-black text-slate-600 tracking-wider uppercase block">
              DEMO ACCOUNTS (PASSWORD: DEMO123)
            </span>

            <div className="space-y-2">
              {demoAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectDemo(acc)}
                  className="p-2.5 bg-white hover:bg-blue-50/60 border border-slate-200/80 rounded-xl flex items-center gap-3 cursor-pointer transition group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${acc.bgColor}`}>
                    {acc.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {acc.role}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{acc.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
