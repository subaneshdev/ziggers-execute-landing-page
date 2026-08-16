"use client";
import React from 'react';
import { 
  Layers, MapPin, Users, ShieldCheck, Camera, UserCheck, 
  MessageSquare, Target, Wallet, FileText, Eye, FileCheck, 
  Cpu, Activity, Zap, Compass, BarChart2, ChevronRight, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, profile, signOut } = useAuth();
  const menuSections = [
    {
      title: 'Campaign Management',
      items: [
        { id: 'dashboard', name: 'Campaigns Manager', icon: <Layers size={15} /> },
        { id: 'liveDashboard', name: 'Live Multi-Location', icon: <Activity size={15} /> },
        { id: 'locationHiring', name: 'Geofence & Bulk Hiring', icon: <Compass size={15} /> },
        { id: 'deployment', name: 'Deployment Board', icon: <Users size={15} /> },
        { id: 'attendance', name: 'Attendance & Live GPS', icon: <MapPin size={15} /> },
        { id: 'proof', name: 'Proof Center (Photos/Vids)', icon: <Camera size={15} /> },
      ]
    },
    {
      title: 'Field Operations & Comms',
      items: [
        { id: 'supervisors', name: 'Supervisor Desk', icon: <UserCheck size={15} /> },
        { id: 'communication', name: 'Campaign Dispatch Feed', icon: <MessageSquare size={15} /> },
        { id: 'targetsLeads', name: 'Targets & Field Leads', icon: <Target size={15} /> },
      ]
    },
    {
      title: 'Billing, Payouts & Reports',
      items: [
        { id: 'wallet', name: 'Campaign Wallet (Escrow)', icon: <Wallet size={15} /> },
        { id: 'billing', name: 'Invoices & GST Billing', icon: <FileText size={15} /> },
        { id: 'agency', name: 'Brand Client Portal', icon: <Eye size={15} /> },
        { id: 'reports', name: 'Automated Reports (PDF)', icon: <FileCheck size={15} /> },
        { id: 'aiPlanner', name: 'AI Campaign Simulator', icon: <Cpu size={15} /> },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-espresso text-white min-h-screen flex flex-col justify-between border-r border-linen/10 flex-shrink-0 font-sans">
      <div className="overflow-y-auto">
        {/* Brand Header */}
        <div className="p-4 border-b border-linen/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gold text-espresso rounded-xl flex items-center justify-center font-black text-base shadow-sm">
              Z
            </div>
            <div>
              <h1 className="font-extrabold text-xs tracking-tight text-white leading-tight">ZIGGERS EXECUTE</h1>
              <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">Campaigns Manager</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Grouped */}
        <nav className="p-2.5 space-y-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              <span className="text-[9px] font-extrabold tracking-wider text-linen/40 uppercase px-3 py-1 block">
                {section.title}
              </span>
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gold text-espresso shadow-sm font-extrabold' 
                        : 'text-linen/70 hover:bg-linen/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? 'text-espresso' : 'text-gold'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-espresso"></span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Status Bar & User Profile */}
      <div className="p-3 border-t border-linen/10 bg-black/30 flex flex-col gap-2.5">
        {user && (
          <div className="flex items-center justify-between p-2 bg-espresso/60 rounded-xl border border-linen/10">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-lg bg-gold text-espresso font-bold text-xs flex items-center justify-center font-mono shrink-0">
                {(profile?.full_name || user.email || 'Z')[0].toUpperCase()}
              </div>
              <div className="truncate text-left">
                <span className="block text-[11px] font-bold text-white truncate leading-tight">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="block text-[9px] text-gold truncate">
                  {profile?.company || 'Brand Partner'}
                </span>
              </div>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 text-linen/50 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[9px] text-linen/40 px-1 font-mono">
          <div className="flex items-center gap-1.5 text-green-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping"></span>
            <span>OS Engine Active</span>
          </div>
          <span>v1.2</span>
        </div>
      </div>
    </aside>
  );
}
