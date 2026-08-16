"use client";
import React, { useState } from 'react';
import { 
  Users, MapPin, Clock, ShieldCheck, CheckCircle2, AlertCircle, 
  Send, FileText, Phone, Eye, Check, RefreshCw, Sparkles, 
  UserCheck, ExternalLink, Calendar, Video
} from 'lucide-react';

export default function DeploymentBoard({ campaigns = [], onLogAction }) {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeBriefingModalWorker, setActiveBriefingModalWorker] = useState(null);
  const [understoodWorkers, setUnderstoodWorkers] = useState(new Set(['dep_1', 'dep_2']));

  // Deployment staff roster
  const [roster, setRoster] = useState([
    {
      id: 'dep_1',
      workerName: 'Rohit Sharma',
      avatar: '👨🏽',
      phone: '+91 98401 12345',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Brand Promoter',
      location: 'Loyola College, Nungambakkam',
      gpsCoords: '13.0631° N, 80.2341° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Kumar Swaminathan (+91 98401 23456)',
      dressCode: 'Red Coca-Cola Polo T-Shirt + Blue Jeans + White Sneakers',
      target: '120 Product Samples / Day',
      status: 'Confirmed & Briefed',
      briefingAcknowledged: true
    },
    {
      id: 'dep_2',
      workerName: 'Meera Nair',
      avatar: '👩🏽',
      phone: '+91 98402 23456',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Lead Generation Specialist',
      location: 'Loyola College, Nungambakkam',
      gpsCoords: '13.0631° N, 80.2341° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Kumar Swaminathan (+91 98401 23456)',
      dressCode: 'Red Coca-Cola Polo T-Shirt + Blue Jeans',
      target: '80 QR Registrations / Day',
      status: 'Confirmed & Briefed',
      briefingAcknowledged: true
    },
    {
      id: 'dep_3',
      workerName: 'Karthik Raja',
      avatar: '👨🏽',
      phone: '+91 98403 34567',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Brand Promoter',
      location: 'MCC College, Tambaram',
      gpsCoords: '12.9229° N, 80.1275° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Prakash Rao (+91 98405 56789)',
      dressCode: 'Red Coca-Cola Polo + Jeans',
      target: '100 Samples / Day',
      status: 'Briefing Sent (Pending Acknowledgment)',
      briefingAcknowledged: false
    },
    {
      id: 'dep_4',
      workerName: 'Pooja Sundaram',
      avatar: '👩🏽',
      phone: '+91 98404 45678',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Brand Promoter',
      location: 'MCC College, Tambaram',
      gpsCoords: '12.9229° N, 80.1275° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Prakash Rao (+91 98405 56789)',
      dressCode: 'Red Coca-Cola Polo + Jeans',
      target: '100 Samples / Day',
      status: 'Briefing Sent (Pending Acknowledgment)',
      briefingAcknowledged: false
    },
    {
      id: 'dep_5',
      workerName: 'Aravind Swamy',
      avatar: '👨🏽',
      phone: '+91 98405 56780',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Brand Promoter',
      location: 'SRM University, Kattankulathur',
      gpsCoords: '12.8230° N, 80.0450° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Kumar Swaminathan (+91 98401 23456)',
      dressCode: 'Red Coca-Cola Polo + Jeans',
      target: '150 Samples / Day',
      status: 'Confirmed & Briefed',
      briefingAcknowledged: true
    },
    {
      id: 'dep_6',
      workerName: 'Divya Krishnan',
      avatar: '👩🏽',
      phone: '+91 98406 67891',
      campaignName: 'Coca-Cola College Activation',
      brand: 'Coca-Cola',
      role: 'Brand Promoter',
      location: 'Anna University, Guindy',
      gpsCoords: '13.0102° N, 80.2354° E',
      shift: '10:00 AM - 06:00 PM',
      supervisor: 'Prakash Rao (+91 98405 56789)',
      dressCode: 'Red Coca-Cola Polo + Jeans',
      target: '120 Samples / Day',
      status: 'Confirmed & Briefed',
      briefingAcknowledged: true
    }
  ]);

  const locations = ['All', 'Loyola College, Nungambakkam', 'MCC College, Tambaram', 'SRM University, Kattankulathur', 'Anna University, Guindy'];

  const filteredRoster = selectedLocation === 'All' 
    ? roster 
    : roster.filter(r => r.location === selectedLocation);

  const handleAcknowledgeBriefing = (workerId) => {
    setUnderstoodWorkers(prev => new Set([...prev, workerId]));
    setRoster(prev => prev.map(r => r.id === workerId ? { ...r, status: 'Confirmed & Briefed', briefingAcknowledged: true } : r));
    if (onLogAction) {
      const worker = roster.find(r => r.id === workerId);
      onLogAction('BRIEFING_ACKNOWLEDGED', `Worker ${worker?.workerName} confirmed briefing & accepted assignment for ${worker?.location}`);
    }
    setActiveBriefingModalWorker(null);
  };

  const handleSendAllBriefings = () => {
    setRoster(prev => prev.map(r => ({ ...r, status: 'Confirmed & Briefed', briefingAcknowledged: true })));
    setUnderstoodWorkers(new Set(roster.map(r => r.id)));
    if (onLogAction) {
      onLogAction('DISPATCH_BROADCAST', `Dispatched reporting coordinates, dress code, supervisor details to all ${roster.length} deployed staff`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Worker Deployment Board</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Assign workers to locations, shifts, and supervisors. Dispatch dress codes, briefings, and track digital acknowledgments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendAllBriefings}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send size={14} className="text-gold" />
            <span>Broadcast Briefings & Coordinates</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Deployed Staff</span>
          <span className="text-xl font-extrabold text-espresso font-mono mt-1 block">{roster.length} Promoters</span>
          <span className="text-[10px] text-green-700 font-semibold mt-0.5 block">100% Biometric KYC Verified</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Briefing Acknowledged</span>
          <span className="text-xl font-extrabold text-green-700 font-mono mt-1 block">
            {roster.filter(r => r.briefingAcknowledged || understoodWorkers.has(r.id)).length} / {roster.length}
          </span>
          <span className="text-[10px] text-muted mt-0.5 block">"I Understand" Confirmed</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Active Locations</span>
          <span className="text-xl font-extrabold text-espresso font-mono mt-1 block">4 College Hubs</span>
          <span className="text-[10px] text-muted mt-0.5 block">Chennai Metro District</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Assigned Supervisors</span>
          <span className="text-xl font-extrabold text-gold font-mono mt-1 block">2 Field Leads</span>
          <span className="text-[10px] text-muted mt-0.5 block">Kumar S. & Prakash R.</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap">Filter Location:</span>
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedLocation === loc 
                ? 'bg-espresso text-white shadow-xs' 
                : 'bg-white border border-espresso/10 text-espresso hover:border-gold'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Deployment Matrix Table */}
      <div className="bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
            Live Deployment & Shift Assignments
          </h3>
          <span className="text-[10px] font-mono text-muted">
            Showing {filteredRoster.length} Assigned Workers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/10">
                <th className="py-3 px-4">Worker / Contact</th>
                <th className="py-3 px-4">Assigned Location & GPS</th>
                <th className="py-3 px-4">Shift Timing</th>
                <th className="py-3 px-4">Assigned Supervisor</th>
                <th className="py-3 px-4">Dress Code & Target</th>
                <th className="py-3 px-4">Worker Status</th>
                <th className="py-3 px-4 text-right">Briefing Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10 font-medium">
              {filteredRoster.map((item) => {
                const isAcknowledged = item.briefingAcknowledged || understoodWorkers.has(item.id);
                return (
                  <tr key={item.id} className="hover:bg-linen/10">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.avatar}</span>
                        <div>
                          <div className="font-extrabold text-espresso text-xs flex items-center gap-1">
                            {item.workerName}
                            <ShieldCheck size={12} className="text-green-600" />
                          </div>
                          <span className="text-[10px] text-muted font-mono">{item.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-espresso flex items-center gap-1">
                        <MapPin size={12} className="text-gold" />
                        {item.location}
                      </div>
                      <span className="text-[9px] text-muted font-mono block mt-0.5">{item.gpsCoords}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-espresso">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-muted" />
                        {item.shift}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-espresso block">{item.supervisor.split(' (')[0]}</span>
                      <span className="text-[9px] text-muted font-mono">{item.supervisor.split(' (')[1]?.replace(')', '')}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] text-espresso block line-clamp-1 font-semibold">{item.dressCode}</span>
                      <span className="text-[9px] text-gold font-bold block mt-0.5">🎯 {item.target}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isAcknowledged 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {isAcknowledged ? '● Briefing Confirmed' : '○ Briefing Pending'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveBriefingModalWorker(item)}
                        className="text-[10px] font-bold bg-white border border-espresso/15 hover:border-gold text-espresso px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={11} />
                        <span>View Briefing Card</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 11: Worker Briefing Modal Simulation */}
      {activeBriefingModalWorker && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-espresso text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-gold text-espresso rounded-lg flex items-center justify-center font-bold text-xs">
                  Z
                </span>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold">
                    Zigger Mobile Briefing Screen
                  </h3>
                  <span className="text-[10px] text-white/70">Candidate: {activeBriefingModalWorker.workerName}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveBriefingModalWorker(null)} 
                className="text-white hover:text-gold text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Briefing Card Body */}
            <div className="p-6 space-y-4 text-xs text-espresso">
              <div className="border border-espresso/10 rounded-2xl p-4 bg-linen/20 space-y-2.5">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                  Official Campaign Brief
                </span>
                
                <div className="space-y-1.5 font-medium">
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Brand / Client:</span>
                    <strong className="text-espresso font-extrabold">{activeBriefingModalWorker.brand} India</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Campaign:</span>
                    <strong className="text-espresso">{activeBriefingModalWorker.campaignName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Reporting Location:</span>
                    <strong className="text-espresso">{activeBriefingModalWorker.location}</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Shift Timings:</span>
                    <strong className="text-espresso font-mono">{activeBriefingModalWorker.shift}</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Role:</span>
                    <strong className="text-espresso">{activeBriefingModalWorker.role}</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Dress Code:</span>
                    <strong className="text-espresso text-right max-w-[240px]">{activeBriefingModalWorker.dressCode}</strong>
                  </div>
                  <div className="flex justify-between border-b border-espresso/10 pb-1">
                    <span className="text-muted">Shift Target:</span>
                    <strong className="text-gold font-bold">{activeBriefingModalWorker.target}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Reporting Supervisor:</span>
                    <strong className="text-espresso">{activeBriefingModalWorker.supervisor}</strong>
                  </div>
                </div>
              </div>

              {/* Briefing Video / Guidelines */}
              <div className="bg-linen/30 border border-espresso/10 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 text-espresso rounded-xl flex items-center justify-center flex-shrink-0">
                  <Video size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-espresso block">2-Min Mandatory Training Video</span>
                  <span className="text-[10px] text-muted block">Sampling etiquette, greeting lines & safety protocols</span>
                </div>
              </div>
            </div>

            {/* Accept Job Button */}
            <div className="p-5 border-t border-espresso/10 bg-linen/10 flex items-center justify-between">
              <span className="text-[10px] text-muted">
                * By accepting, you confirm GPS check-in at reporting location.
              </span>
              <button
                onClick={() => handleAcknowledgeBriefing(activeBriefingModalWorker.id)}
                className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check size={14} />
                <span>I Understand & Accept Job</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
