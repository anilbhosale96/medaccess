import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  LayoutDashboard,
  Users,
  ClipboardList,
  Building2,
  Bell,
  BarChart3,
  FileText,
  LogOut,
  Search,
  AlertTriangle,
  Activity,
  Bed,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PatientFullRecord } from '../types';

interface HospitalDashboardProps {
  onGoToEmergency: () => void;
  onSelectCasePatient: (patient: PatientFullRecord) => void;
  onLogout: () => void;
  onOpenAuditLogs: () => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  onGoToEmergency,
  onSelectCasePatient,
  onLogout,
  onOpenAuditLogs,
}) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample incoming emergency cases directly from the Figma design (Image 5)
  const emergencyCases = [
    {
      caseId: 'CASE-2026-00421',
      patientName: 'Arjun Sharma',
      age: 34,
      blood: 'O+',
      emergencyType: 'Road Accident',
      priority: 'CRITICAL',
      priorityColor: 'bg-red-50 text-red-600 border-red-200',
      eta: '9 min',
      status: 'INCOMING',
      statusColor: 'bg-red-50 text-red-600 border-red-200',
      patientData: {
        id: 'a1111111-1111-1111-1111-111111111111',
        phone_hash: '9876543210',
        full_name: 'Arjun Sharma',
        date_of_birth: '1992-04-12',
        gender: 'Male',
        national_id_hash: 'ABHA-91-2847-1928',
        emergency_code: 'EMG-701',
        medical_profiles: {
          id: 'prof-arjun',
          patient_id: 'a1111111-1111-1111-1111-111111111111',
          blood_type: 'O+',
          allergies: ['Penicillin', 'Sulfa Drugs'],
          chronic_conditions: ['Type 1 Diabetes'],
          current_medications: [
            { name: 'Insulin Glargine', dosage: '24 units', frequency: 'Nightly' }
          ],
          emergency_contacts: [
            { name: 'Pooja Sharma', relation: 'Spouse', phone: '+91 98765 43211' }
          ],
          organ_donor: true,
          resuscitation_preference: 'Full Code',
          notes: 'High-impact collision trauma. Suspected internal hemorrhage.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00418',
      patientName: 'Meera Pillai',
      age: 58,
      blood: 'A+',
      emergencyType: 'Cardiac Emergency',
      priority: 'HIGH',
      priorityColor: 'bg-amber-50 text-amber-600 border-amber-200',
      eta: '4 min',
      status: 'ARRIVED',
      statusColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      patientData: {
        id: 'b2222222-2222-2222-2222-222222222222',
        phone_hash: '9123456780',
        full_name: 'Meera Pillai',
        date_of_birth: '1968-11-23',
        gender: 'Female',
        national_id_hash: 'ABHA-91-5918-2039',
        emergency_code: 'EMG-842',
        medical_profiles: {
          id: 'prof-meera',
          patient_id: 'b2222222-2222-2222-2222-222222222222',
          blood_type: 'A+',
          allergies: ['Aspirin', 'Contrast Dye'],
          chronic_conditions: ['Dual-Chamber Pacemaker', 'Atrial Fibrillation'],
          current_medications: [
            { name: 'Warfarin', dosage: '5mg', frequency: 'Daily' }
          ],
          emergency_contacts: [
            { name: 'Rahul Pillai', relation: 'Son', phone: '+91 91234 56789' }
          ],
          organ_donor: false,
          resuscitation_preference: 'Full Code',
          notes: 'Pacemaker implanted left chest. NO MRI. Acute STEMI symptoms.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00415',
      patientName: 'Karan Malhotra',
      age: 27,
      blood: 'B+',
      emergencyType: 'Trauma',
      priority: 'MODERATE',
      priorityColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      eta: 'Arrived',
      status: 'UNDER TREATMENT',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200',
      patientData: {
        id: 'c3333333-3333-3333-3333-333333333333',
        phone_hash: '9988776655',
        full_name: 'Karan Malhotra',
        date_of_birth: '1999-08-15',
        gender: 'Male',
        national_id_hash: 'ABHA-91-7719-3829',
        emergency_code: 'EMG-305',
        medical_profiles: {
          id: 'prof-karan',
          patient_id: 'c3333333-3333-3333-3333-333333333333',
          blood_type: 'B+',
          allergies: ['Peanuts', 'Amoxicillin'],
          chronic_conditions: ['Severe Asthma'],
          current_medications: [
            { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'PRN' }
          ],
          emergency_contacts: [
            { name: 'Sunita Malhotra', relation: 'Mother', phone: '+91 99887 76655' }
          ],
          organ_donor: true,
          resuscitation_preference: 'Full Code',
          notes: 'Blunt thoracic trauma with secondary acute bronchospasm.'
        }
      } as PatientFullRecord
    }
  ];

  const filteredCases = emergencyCases.filter(c => 
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Left Sidebar (Figma Dark Navy Design) */}
      <aside className="w-64 bg-[#0B1528] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center space-x-3 border-b border-slate-800/80">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider">SEPS</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                EMERGENCY SYSTEM
              </p>
            </div>
          </div>

          {/* Quick Emergency Mode Button in Sidebar */}
          <div className="p-4">
            <button
              onClick={onGoToEmergency}
              className="w-full py-2.5 px-3.5 bg-slate-900/90 hover:bg-red-950/80 border border-slate-700 hover:border-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-2.5 transition shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Emergency Mode</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={onGoToEmergency}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Emergency Access</span>
            </button>

            <button
              onClick={() => setActiveNav('patients')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Users className="w-4 h-4" />
              <span>Patients</span>
            </button>

            <button
              onClick={() => setActiveNav('cases')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Emergency Cases</span>
            </button>

            <button
              onClick={() => setActiveNav('hospitals')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Building2 className="w-4 h-4" />
              <span>Hospitals</span>
            </button>

            <button
              onClick={() => setActiveNav('notifications')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                2
              </span>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={onOpenAuditLogs}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-700">
              C
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">CityCare Staff</p>
              <p className="text-[11px] text-slate-400 truncate">Hospital</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Search Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search patients, case IDs..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ER Live Stream Active</span>
            </div>
            <button
              onClick={onGoToEmergency}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Mode</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Hospital Header Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                HOSPITAL DASHBOARD
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  CityCare Emergency Hospital
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Emergency Department · Real-time overview
              </p>
            </div>
          </div>

          {/* 4 Stat Metric Cards (Figma Design: Image 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Emergencies */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Active Emergencies</span>
                <p className="text-3xl font-black text-[#EF4444] mt-1 tracking-tight">08</p>
              </div>
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Incoming Patients */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Incoming Patients</span>
                <p className="text-3xl font-black text-[#F59E0B] mt-1 tracking-tight">03</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Available Beds */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Available Beds</span>
                <p className="text-3xl font-black text-[#10B981] mt-1 tracking-tight">12</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Bed className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Cases Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Cases Today</span>
                <p className="text-3xl font-black text-[#2563EB] mt-1 tracking-tight">47</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Emergency Cases Table Section (Figma Design: Image 5) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Emergency Cases</h3>
              <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">CASE ID</th>
                    <th className="py-3.5 px-5">PATIENT</th>
                    <th className="py-3.5 px-5">EMERGENCY TYPE</th>
                    <th className="py-3.5 px-5">PRIORITY</th>
                    <th className="py-3.5 px-5">ETA</th>
                    <th className="py-3.5 px-5">STATUS</th>
                    <th className="py-3.5 px-5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCases.map(item => (
                    <tr key={item.caseId} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-5 font-mono font-medium text-slate-500">
                        {item.caseId}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">{item.patientName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Age {item.age} · {item.blood}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        {item.emergencyType}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.priorityColor}`}>
                          ● {item.priority}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 font-mono">
                        {item.eta}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => onSelectCasePatient(item.patientData)}
                          className="px-3.5 py-1.5 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-500 hover:border-blue-600 rounded-lg font-bold text-xs transition shadow-xs"
                        >
                          Open Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
