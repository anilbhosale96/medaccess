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
  ArrowRight,
  QrCode,
  Hash,
  Wifi,
  Stethoscope,
  Pill,
  Heart,
  FileCheck2,
  ChevronRight,
  Filter,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Send,
  Check
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
  // Navigation tabs matching Figma: 'dashboard' | 'emergency-access' | 'patients' | 'cases' | 'hospitals' | 'reports'
  const [activeNav, setActiveNav] = useState<'dashboard' | 'emergency-access' | 'patients' | 'cases' | 'hospitals' | 'reports'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientIdInput, setPatientIdInput] = useState('SEPS-20481');
  const [notifiedHospital, setNotifiedHospital] = useState<string | null>(null);

  // Active cases matching Figma
  const emergencyCases = [
    {
      caseId: 'CASE-2026-00421',
      patientName: 'Arjun Sharma',
      age: 34,
      blood: 'O+',
      date: '03 Sep 2026',
      emergencyType: 'Road Accident',
      priority: 'CRITICAL',
      priorityColor: 'bg-red-50 text-red-600 border-red-200',
      hospital: 'CityCare Emergency...',
      eta: '9 min',
      status: 'ACTIVE',
      statusColor: 'bg-red-50 text-red-600 border-red-200',
      patientData: {
        id: 'a1111111-1111-1111-1111-111111111111',
        phone_hash: '9876543210',
        full_name: 'Arjun Sharma',
        date_of_birth: '1992-03-12',
        gender: 'Male',
        national_id_hash: 'ABHA-91-2847-1928',
        emergency_code: 'SEPS-20481',
        medical_profiles: {
          id: 'prof-arjun',
          patient_id: 'a1111111-1111-1111-1111-111111111111',
          blood_type: 'O+',
          allergies: ['Penicillin (SEVERE · Anaphylaxis)', 'NSAIDs (MODERATE)'],
          chronic_conditions: ['Type 1 Diabetes (Insulin Dependent)'],
          current_medications: [
            { name: 'Insulin Glargine', dosage: '24 units', frequency: 'Nightly' },
            { name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'PRN' }
          ],
          emergency_contacts: [
            { name: 'Pooja Sharma', relation: 'Spouse', phone: '+91 98765 43211' }
          ],
          organ_donor: true,
          resuscitation_preference: 'Full Code',
          notes: 'Patient is insulin dependent. Monitor blood glucose carefully. Avoid fasting.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00418',
      patientName: 'Meera Pillai',
      age: 58,
      blood: 'A+',
      date: '03 Sep 2026',
      emergencyType: 'Cardiac Emergency',
      priority: 'HIGH',
      priorityColor: 'bg-amber-50 text-amber-600 border-amber-200',
      hospital: 'CityCare Emergency...',
      eta: '4 min',
      status: 'UNDER TREATMENT',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      patientData: {
        id: 'b2222222-2222-2222-2222-222222222222',
        phone_hash: '9123456780',
        full_name: 'Meera Pillai',
        date_of_birth: '1968-11-23',
        gender: 'Female',
        national_id_hash: 'ABHA-91-5918-2039',
        emergency_code: 'SEPS-84201',
        medical_profiles: {
          id: 'prof-meera',
          patient_id: 'b2222222-2222-2222-2222-222222222222',
          blood_type: 'A+',
          allergies: ['Aspirin', 'Contrast Dye'],
          chronic_conditions: ['Dual-Chamber Pacemaker (2023)', 'Atrial Fibrillation'],
          current_medications: [
            { name: 'Warfarin', dosage: '5mg', frequency: 'Daily' }
          ],
          emergency_contacts: [
            { name: 'Rahul Pillai', relation: 'Son', phone: '+91 91234 56789' }
          ],
          organ_donor: false,
          resuscitation_preference: 'Full Code',
          notes: 'Pacemaker in left chest. STRICTLY NO MRI. High bleeding risk on Warfarin.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00415',
      patientName: 'Karan Malhotra',
      age: 27,
      blood: 'B+',
      date: '02 Sep 2026',
      emergencyType: 'Trauma',
      priority: 'MODERATE',
      priorityColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      hospital: 'MetroLife Hospital',
      eta: 'Arrived',
      status: 'COMPLETED',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      patientData: {
        id: 'c3333333-3333-3333-3333-333333333333',
        phone_hash: '9988776655',
        full_name: 'Karan Malhotra',
        date_of_birth: '1999-08-15',
        gender: 'Male',
        national_id_hash: 'ABHA-91-7719-3829',
        emergency_code: 'SEPS-30519',
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
          notes: 'Blunt thoracic trauma. Keep epinephrine ready.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00410',
      patientName: 'Sunita Rao',
      age: 49,
      blood: 'O-',
      date: '02 Sep 2026',
      emergencyType: 'Respiratory Emergency',
      priority: 'HIGH',
      priorityColor: 'bg-amber-50 text-amber-600 border-amber-200',
      hospital: 'CityCare Emergency...',
      eta: 'Arrived',
      status: 'COMPLETED',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      patientData: {
        id: 'd4444444-4444-4444-4444-444444444444',
        phone_hash: '9444411122',
        full_name: 'Sunita Rao',
        date_of_birth: '1977-01-10',
        gender: 'Female',
        national_id_hash: 'ABHA-91-1184-9021',
        emergency_code: 'SEPS-41092',
        medical_profiles: {
          id: 'prof-sunita',
          patient_id: 'd4444444-4444-4444-4444-444444444444',
          blood_type: 'O-',
          allergies: ['Latex'],
          chronic_conditions: ['COPD Stage 2'],
          current_medications: [
            { name: 'Tiotropium', dosage: '18mcg', frequency: 'Daily' }
          ],
          emergency_contacts: [
            { name: 'Anil Rao', relation: 'Husband', phone: '+91 94444 11123' }
          ],
          organ_donor: true,
          resuscitation_preference: 'Full Code',
          notes: 'Acute COPD exacerbation.'
        }
      } as PatientFullRecord
    },
    {
      caseId: 'CASE-2026-00404',
      patientName: 'Dev Khanna',
      age: 62,
      blood: 'AB+',
      date: '01 Sep 2026',
      emergencyType: 'Unconscious Patient',
      priority: 'CRITICAL',
      priorityColor: 'bg-red-50 text-red-600 border-red-200',
      hospital: 'Sunrise Medical Ce...',
      eta: 'Arrived',
      status: 'COMPLETED',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      patientData: {
        id: 'e5555555-5555-5555-5555-555555555555',
        phone_hash: '9777788899',
        full_name: 'Dev Khanna',
        date_of_birth: '1964-07-04',
        gender: 'Male',
        national_id_hash: 'ABHA-91-9921-3810',
        emergency_code: 'SEPS-40488',
        medical_profiles: {
          id: 'prof-dev',
          patient_id: 'e5555555-5555-5555-5555-555555555555',
          blood_type: 'AB+',
          allergies: ['Penicillin'],
          chronic_conditions: ['Hypertension', 'Previous CVA Stroke (2021)'],
          current_medications: [
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Daily' }
          ],
          emergency_contacts: [
            { name: 'Simran Khanna', relation: 'Daughter', phone: '+91 97777 88890' }
          ],
          organ_donor: false,
          resuscitation_preference: 'Full Code',
          notes: 'Unconscious collapse. Suspected acute ischemic stroke.'
        }
      } as PatientFullRecord
    }
  ];

  const handleNotifyHospital = (hospitalName: string) => {
    setNotifiedHospital(hospitalName);
    setTimeout(() => setNotifiedHospital(null), 3000);
  };

  const handleAccessById = () => {
    const matched = emergencyCases.find(c => c.patientData.emergency_code === patientIdInput || c.caseId === patientIdInput);
    if (matched) {
      onSelectCasePatient(matched.patientData);
    } else {
      onSelectCasePatient(emergencyCases[0].patientData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* 1. Left Sidebar (Matching Figma Design) */}
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

          {/* Navigation Links (Figma Tabs) */}
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
              onClick={() => setActiveNav('emergency-access')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'emergency-access'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Emergency Access</span>
            </button>

            <button
              onClick={() => setActiveNav('patients')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'patients'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patients</span>
            </button>

            <button
              onClick={() => setActiveNav('cases')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'cases'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Emergency Cases</span>
            </button>

            <button
              onClick={() => setActiveNav('hospitals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'hospitals'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospitals</span>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'reports'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
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

        {/* Profile Card & Sign Out */}
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

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ER Live</span>
            </div>
            <button
              onClick={onGoToEmergency}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Access</span>
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: DASHBOARD (Figma Image 5) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'dashboard' && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
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

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">Active Emergencies</span>
                  <p className="text-3xl font-black text-[#EF4444] mt-1 tracking-tight">08</p>
                </div>
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">Incoming Patients</span>
                  <p className="text-3xl font-black text-[#F59E0B] mt-1 tracking-tight">03</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">Available Beds</span>
                  <p className="text-3xl font-black text-[#10B981] mt-1 tracking-tight">12</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <Bed className="w-6 h-6" />
                </div>
              </div>

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

            {/* Emergency Cases Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Emergency Cases</h3>
                <span onClick={() => setActiveNav('cases')} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
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
                    {emergencyCases.slice(0, 3).map(item => (
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
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: EMERGENCY ACCESS / IDENTIFY PATIENT (Figma Image 1) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'emergency-access' && (
          <main className="p-6 sm:p-8 max-w-3xl w-full mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Identify Patient
              </h2>
              <p className="text-xs text-slate-500">
                Use one of the methods below to access emergency patient information
              </p>
            </div>

            <div className="space-y-4">
              {/* Card 1: Scan QR Code (Recommended) */}
              <div 
                onClick={onGoToEmergency}
                className="bg-white hover:bg-blue-50/40 border-2 border-emerald-400/80 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Scan QR Code
                      </h3>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fastest access — scan the patient's SEPS emergency QR card or wristband
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition" />
              </div>

              {/* Card 2: Enter Emergency Patient ID */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">
                    #
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Enter Emergency Patient ID
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={patientIdInput}
                    onChange={e => setPatientIdInput(e.target.value)}
                    placeholder="e.g. SEPS-20481"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                  <button
                    onClick={handleAccessById}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    Access
                  </button>
                </div>
              </div>

              {/* Card 3: Search Patient */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <Search className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Search Patient
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name, phone, or emergency ID"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                  <button
                    onClick={handleAccessById}
                    className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-blue-600 text-blue-600 font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Card 4: NFC Tap (Hardware Unavailable) */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">NFC Tap</h4>
                    <p className="text-xs text-slate-400">
                      Place device near patient NFC tag (hardware required)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                  Unavailable
                </span>
              </div>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: PATIENTS DETAIL PROFILE (Figma Image 2 - Arjun Sharma) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'patients' && (
          <main className="p-6 sm:p-8 space-y-5 max-w-6xl w-full mx-auto">
            {/* Top Red Patient Emergency Header */}
            <div className="bg-[#DC2626] text-white rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Arjun Sharma</h2>
                <p className="text-xs text-red-100 mt-0.5 font-medium">
                  34 yrs · Male · ID: SEPS-20481
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-900/80 border border-red-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                  Blood Group: O+
                </span>
                <span className="bg-red-900/80 border border-red-700 px-3 py-1 rounded-lg text-xs font-bold">
                  Organ Donor: Yes
                </span>
              </div>
            </div>

            {/* Critical Allergy Banners (Figma Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 text-red-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>ALLERGY ALERT — Penicillin</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Severity: <span className="font-bold text-red-700">SEVERE</span> · Anaphylaxis, severe rash
                </p>
              </div>

              <div className="p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 text-red-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>ALLERGY ALERT — NSAIDs</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Severity: <span className="font-bold text-amber-700">MODERATE</span> · Gastrointestinal distress, bronchospasm
                </p>
              </div>
            </div>

            {/* Insulin Dependency Banner (Figma Image 2) */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center gap-2 text-amber-900">
              <Activity className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Patient is insulin dependent: </span>
                <span className="text-slate-700">Monitor blood glucose. Avoid fasting. Carry insulin.</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-6 text-xs font-bold text-slate-500">
              <span className="pb-3 border-b-2 border-blue-600 text-blue-600 cursor-pointer">Overview</span>
              <span className="pb-3 hover:text-slate-900 cursor-pointer">Vitals</span>
              <span className="pb-3 hover:text-slate-900 cursor-pointer">Medical History</span>
              <span className="pb-3 hover:text-slate-900 cursor-pointer">Medications</span>
              <span className="pb-3 hover:text-slate-900 cursor-pointer">Contacts</span>
            </div>

            {/* Overview Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: 4 Cards + Conditions */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
                    <Heart className="w-4 h-4 text-red-500 mx-auto" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">BLOOD GROUP</span>
                    <p className="text-xl font-black text-red-600">O+</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ALLERGIES</span>
                    <p className="text-sm font-black text-slate-900">Penicillin</p>
                    <span className="text-[10px] text-slate-400">+1 more</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
                    <Stethoscope className="w-4 h-4 text-red-500 mx-auto" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">CONDITIONS</span>
                    <p className="text-sm font-black text-slate-900">Type 1 DM</p>
                    <span className="text-[10px] text-slate-400">Asthma</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
                    <Pill className="w-4 h-4 text-blue-500 mx-auto" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">MEDICATIONS</span>
                    <p className="text-sm font-black text-slate-900">Insulin</p>
                    <span className="text-[10px] text-slate-400">Salbutamol</span>
                  </div>
                </div>

                {/* Medical Conditions Detail */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>Medical Conditions</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          CRITICAL
                        </span>
                        <span className="font-bold text-slate-900">Type 1 Diabetes</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Insulin dependent. Monitor blood glucose carefully.
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                      active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Col: Patient Details Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Patient Details</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs space-y-2 pt-1">
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Name</span>
                    <span className="font-bold text-slate-900">Arjun Sharma</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Date of Birth</span>
                    <span className="font-semibold text-slate-800">12 March 1992</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Age</span>
                    <span className="font-semibold text-slate-800">34 years</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Gender</span>
                    <span className="font-semibold text-slate-800">Male</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Blood Group</span>
                    <span className="font-bold text-red-600">O+</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Height / Weight</span>
                    <span className="font-semibold text-slate-800">175 cm / 72 kg</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">City</span>
                    <span className="font-semibold text-slate-800">New Delhi</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: EMERGENCY CASE HISTORY (Figma Image 4) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'cases' && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Emergency Case History
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  All emergency cases across all responders and hospitals
                </p>
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-5">CASE ID</th>
                      <th className="py-3.5 px-5">PATIENT</th>
                      <th className="py-3.5 px-5">DATE</th>
                      <th className="py-3.5 px-5">TYPE</th>
                      <th className="py-3.5 px-5">PRIORITY</th>
                      <th className="py-3.5 px-5">HOSPITAL</th>
                      <th className="py-3.5 px-5">STATUS</th>
                      <th className="py-3.5 px-5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {emergencyCases.map(item => (
                      <tr key={item.caseId} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-5 font-mono font-medium text-slate-500">
                          {item.caseId}
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-900">
                          {item.patientName}
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {item.date}
                        </td>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {item.emergencyType}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.priorityColor}`}>
                            ● {item.priority}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {item.hospital}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                            ● {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => onSelectCasePatient(item.patientData)}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
                5 cases shown
              </div>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 5: HOSPITALS & SIMULATED MAP (Figma Image 3) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'hospitals' && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Hospital Coordination
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a hospital to notify and request emergency assistance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simulated Map View (Figma Image 3) */}
              <div className="lg:col-span-2 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative min-h-[420px] flex flex-col justify-between p-6 shadow-inner bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-white/90 border border-slate-200 text-slate-600 px-3 py-1 rounded-full shadow-xs">
                    Simulated Map · New Delhi
                  </span>
                </div>

                {/* Simulated Pins */}
                <div className="relative h-64 w-full">
                  {/* Patient Location Ambulance Pin */}
                  <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-blue-200 animate-pulse mx-auto">
                      🚑
                    </div>
                    <span className="text-[10px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                      Patient Location
                    </span>
                  </div>

                  {/* CityCare Hospital Pin */}
                  <div className="absolute right-1/3 top-1/4 text-center">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ring-4 ring-emerald-100 mx-auto">
                      H
                    </div>
                    <span className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded shadow mt-1 inline-block">
                      CityCare
                    </span>
                  </div>

                  {/* MetroLife Hospital Pin */}
                  <div className="absolute right-1/4 top-2/3 text-center">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ring-4 ring-amber-100 mx-auto">
                      H
                    </div>
                    <span className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded shadow mt-1 inline-block">
                      MetroLife
                    </span>
                  </div>

                  {/* Sunrise Medical Pin */}
                  <div className="absolute right-12 bottom-4 text-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ring-4 ring-red-100 mx-auto">
                      H
                    </div>
                    <span className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded shadow mt-1 inline-block">
                      Sunrise
                    </span>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="bg-white/95 border border-slate-200 rounded-xl p-3 w-36 shadow-sm text-[11px] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Limited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Full</span>
                  </div>
                </div>
              </div>

              {/* Nearby Hospitals List (Figma Image 3) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nearby Hospitals
                </h3>

                {/* Hospital 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">CityCare Emergency Hospital</h4>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● AVAILABLE
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>📍 3.2 km</span>
                    <span>⏱ 9 min</span>
                    <span>🛏 12 beds</span>
                  </div>
                  <button
                    onClick={() => handleNotifyHospital('CityCare Emergency Hospital')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    {notifiedHospital === 'CityCare Emergency Hospital' ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Hospital Notified!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Notify Hospital</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hospital 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">MetroLife Hospital</h4>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      ● LIMITED
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>📍 5.8 km</span>
                    <span>⏱ 15 min</span>
                    <span>🛏 4 beds</span>
                  </div>
                  <button
                    onClick={() => handleNotifyHospital('MetroLife Hospital')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    {notifiedHospital === 'MetroLife Hospital' ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Hospital Notified!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Notify Hospital</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hospital 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 opacity-80">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">Sunrise Medical Center</h4>
                    <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                      ● FULL
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>📍 8.1 km</span>
                    <span>⏱ 22 min</span>
                    <span>🛏 0 beds</span>
                  </div>
                  <p className="text-xs text-red-600 font-medium">No capacity available</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 6: REPORTS / ADMIN DASHBOARD (Figma Image 5) */}
        {/* ------------------------------------------------------------- */}
        {activeNav === 'reports' && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SYSTEM ADMINISTRATION
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Platform-wide overview · 03 Sep 2026
                </p>
              </div>
              <button
                onClick={onOpenAuditLogs}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <FileText className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            </div>

            {/* 6 Metrics Grid (Figma Image 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Registered Patients</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">14,827</p>
                  <span className="text-[10px] text-emerald-600 font-bold">+124 this month</span>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Active Emergencies</span>
                  <p className="text-2xl font-black text-red-600 mt-1">8</p>
                  <span className="text-[10px] text-slate-400">Right now</span>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Hospitals Connected</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">47</p>
                  <span className="text-[10px] text-slate-400">Across 3 cities</span>
                </div>
                <Building2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Emergency Responders</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">312</p>
                  <span className="text-[10px] text-slate-400">On duty</span>
                </div>
                <ShieldAlert className="w-8 h-8 text-slate-400" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Cases Today</span>
                  <p className="text-2xl font-black text-amber-500 mt-1">47</p>
                  <span className="text-[10px] text-slate-400">All types</span>
                </div>
                <Activity className="w-8 h-8 text-amber-400" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Avg Response Time</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">4.2 min</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Improving</span>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Charts (Figma Image 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Emergency Cases by Type</h3>
                <div className="h-44 flex items-end gap-4 pt-4 px-2 border-b border-slate-200">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '140px' }} />
                    <span className="text-[10px] text-slate-500 font-medium">Accident</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '90px' }} />
                    <span className="text-[10px] text-slate-500 font-medium">Cardiac</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '60px' }} />
                    <span className="text-[10px] text-slate-500 font-medium">Trauma</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '50px' }} />
                    <span className="text-[10px] text-slate-500 font-medium">Asthma</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '30px' }} />
                    <span className="text-[10px] text-slate-500 font-medium">Other</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Cases by Priority</h3>
                <div className="h-44 flex items-center justify-around">
                  <div className="relative w-32 h-32 rounded-full border-[16px] border-red-500 border-r-amber-500 border-b-yellow-400 border-l-emerald-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-700">47 Total</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span>Critical (35%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>High (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span>Moderate (20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Low (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};
