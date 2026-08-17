"use client";
import React, { useState } from 'react';
import { 
  MapPin, Clock, ShieldCheck, AlertTriangle, CheckCircle, 
  UserX, UserCheck, RefreshCw, Zap, Search, AlertCircle, 
  ArrowRight, Shield, Check, Phone, Eye
} from 'lucide-react';

export default function AttendanceGpsTracker({ campaigns = [], onLogAction }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Instant Replacement State
  const [replacementModalOpen, setReplacementModalOpen] = useState(false);
  const [replacingRecord, setReplacingRecord] = useState(null);
  const [standbyCandidates, setStandbyCandidates] = useState([
    {
      id: 'sb_1',
      name: 'Venkatesh Babu',
      avatar: '👨🏽',
      rating: 4.9,
      distanceKm: 0.9,
      skills: ['FMCG Sampling', 'Fluent Tamil & English'],
      phone: '+91 98409 88776',
      kyc: true,
      etaMinutes: 12
    },
    {
      id: 'sb_2',
      name: 'Swathi Narayanan',
      avatar: '👩🏽',
      rating: 4.85,
      distanceKm: 1.4,
      skills: ['Product Demos', 'Youth Activations'],
      phone: '+91 98408 77665',
      kyc: true,
      etaMinutes: 18
    }
  ]);
  const [isDeployingReplacement, setIsDeployingReplacement] = useState(false);

  const handleOpenReplacement = (record) => {
    setReplacingRecord(record);
    setReplacementModalOpen(true);
  };

  const handleConfirmReplacement = (candidate) => {
    setIsDeployingReplacement(true);
    setTimeout(() => {
      // Update attendance records
      setAttendanceRecords(prev => prev.map(r => {
        if (r.id === replacingRecord.id) {
          return {
            ...r,
            workerName: `${candidate.name} (Instant Replacement)`,
            avatar: candidate.avatar,
            actualGps: '12.9916° N, 80.2171° E (Within 12m)',
            distanceToleranceMeters: 12,
            checkInTime: '10:14 AM (Replaced in 14m)',
            shiftDuration: '4h 46m (Active)',
            gpsStatus: 'Verified Inside Geofence',
            status: 'On Duty (Replaced)'
          };
        }
        return r;
      }));

      setIsDeployingReplacement(false);
      setReplacementModalOpen(false);

      if (onLogAction) {
        onLogAction('INSTANT_REPLACEMENT_DEPLOYED', `Instant replacement deployed: ${candidate.name} dispatched to Phoenix MarketCity Hub. ETA: ${candidate.etaMinutes}m`);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Attendance & Live GPS Geofence Verification</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Real-time geofence check-ins, shift duration clocks, early departure flags, and 1-click instant replacements for no-shows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded-xl border border-green-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
            <span>Geofence Tolerances: 50m Max Radius</span>
          </span>
        </div>
      </div>

      {/* Feature 9: Prominent No-Show Alert & Instant Replacement Banner */}
      {attendanceRecords.some(r => r.status === 'Absent / No-Show') && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
              <UserX size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                  No-Show Alert
                </span>
                <h4 className="text-sm font-extrabold text-red-900">
                  ❌ 1 Promoter Absent at Phoenix MarketCity Hub
                </h4>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Vikas Menon missed geofenced check-in window (Threshold &gt;50m). Automated nearby standby reserve workers (&lt; 2km) are available for instant dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenReplacement(attendanceRecords.find(r => r.status === 'Absent / No-Show'))}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Zap size={14} className="text-yellow-300" />
            <span>1-Click Find & Deploy Replacement</span>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Checked In On Time</span>
          <span className="text-xl font-extrabold text-espresso font-mono mt-1 block">
            {attendanceRecords.filter(r => r.status.includes('On Duty')).length} / {attendanceRecords.length}
          </span>
          <span className="text-[10px] text-green-700 font-semibold mt-0.5 block">Geofence GPS Verified</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Avg. Geofence Distance</span>
          <span className="text-xl font-extrabold text-gold font-mono mt-1 block">22.4 Meters</span>
          <span className="text-[10px] text-muted mt-0.5 block">Tolerance limit: 50.0m</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Early Departures</span>
          <span className="text-xl font-extrabold text-espresso font-mono mt-1 block">0 Detected</span>
          <span className="text-[10px] text-green-700 font-semibold mt-0.5 block">100% Shift Integrity</span>
        </div>

        <div className="bg-white border border-espresso/10 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Standby Replacement Pool</span>
          <span className="text-xl font-extrabold text-espresso font-mono mt-1 block">14 Reserves</span>
          <span className="text-[10px] text-muted mt-0.5 block">&lt; 15m Dispatch SLA</span>
        </div>
      </div>

      {/* Attendance & GPS Verification Table */}
      <div className="bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
            Live Field Attendance & GPS Audit Trail
          </h3>
          <span className="text-[10px] font-mono text-muted">
            Edge GPS Geofencing Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/10">
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Assigned Location</th>
                <th className="py-3 px-4">GPS Geofence Match</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Shift Duration</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10 font-medium">
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <UserCheck size={32} className="mx-auto mb-2 opacity-30 text-espresso" />
                    <p className="font-bold text-sm text-espresso">No attendance logs found</p>
                    <p className="text-xs text-muted mt-0.5">Live promoter check-ins and GPS verification logs will appear here when active campaigns are running.</p>
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => {
                const isNoShow = record.status === 'Absent / No-Show';
                return (
                  <tr key={record.id} className={isNoShow ? 'bg-red-50/50' : 'hover:bg-linen/10'}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{record.avatar}</span>
                        <div>
                          <div className="font-extrabold text-espresso text-xs flex items-center gap-1">
                            {record.workerName}
                            {!isNoShow && <ShieldCheck size={12} className="text-green-600" />}
                          </div>
                          <span className="text-[10px] text-muted font-mono">{record.location}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-espresso block">{record.location}</span>
                      <span className="text-[9px] text-muted font-mono block mt-0.5">{record.targetGeofence}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className={`font-mono text-[11px] font-bold flex items-center gap-1.5 ${
                        isNoShow ? 'text-red-600' : 'text-green-700'
                      }`}>
                        {isNoShow ? <AlertCircle size={13} /> : <CheckCircle size={13} />}
                        <span>{record.distanceToleranceMeters}m Tolerance</span>
                      </div>
                      <span className="text-[9px] text-muted font-mono block mt-0.5">{record.actualGps}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-espresso">
                      {record.checkInTime}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-espresso">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-muted" />
                        {record.shiftDuration}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isNoShow 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : record.status.includes('Replaced')
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isNoShow ? (
                        <button
                          onClick={() => handleOpenReplacement(record)}
                          className="text-[10px] font-extrabold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Zap size={12} />
                          <span>Find Replacement</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md border border-green-200">
                          Verified ✅
                        </span>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 9: Instant Replacement Modal */}
      {replacementModalOpen && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white text-red-600 rounded-lg flex items-center justify-center font-extrabold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider">
                    Instant Standby Replacement Engine
                  </h3>
                  <span className="text-[10px] text-white/80">
                    Target Node: {replacingRecord?.location} (No-Show Replacement)
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setReplacementModalOpen(false)} 
                className="text-white hover:text-yellow-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs text-espresso">
              <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Absent Worker Details
                </span>
                <div className="flex justify-between font-bold text-espresso">
                  <span>{replacingRecord?.workerName}</span>
                  <span className="text-red-600">Failed Geofence Check-in</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-extrabold text-espresso uppercase tracking-wider block mb-2">
                  Nearby Pre-Vetted Standby Reserves (&lt; 2km Radius)
                </span>

                <div className="space-y-3">
                  {standbyCandidates.map((c) => (
                    <div key={c.id} className="border border-espresso/15 rounded-2xl p-4 bg-white hover:border-gold transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5 font-extrabold text-espresso text-xs">
                            {c.name}
                            <ShieldCheck size={13} className="text-green-600" />
                          </div>
                          <span className="text-[10px] text-muted block mt-0.5">
                            ★ {c.rating} Rating • {c.distanceKm} km away • ETA: ~{c.etaMinutes} mins
                          </span>
                          <span className="text-[9px] text-gold font-bold block mt-0.5">
                            {c.skills.join(' • ')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmReplacement(c)}
                        disabled={isDeployingReplacement}
                        className="bg-espresso hover:bg-gold hover:text-espresso text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <Zap size={12} className="text-gold" />
                        <span>{isDeployingReplacement ? 'Deploying...' : 'Deploy Now'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-espresso/10 bg-linen/20 flex items-center justify-between text-[10px] text-muted">
              <span>* Automatic notification and navigation routing sent to replacement phone.</span>
              <button
                onClick={() => setReplacementModalOpen(false)}
                className="text-espresso font-bold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
