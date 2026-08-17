"use client";
import React, { useState } from 'react';
import { 
  Users, ShieldCheck, MapPin, CheckCircle, AlertTriangle, 
  Send, FileText, Upload, RefreshCw, Zap, MessageSquare, 
  Check, Phone, AlertCircle, ArrowRight, UserCheck, Plus
} from 'lucide-react';

export default function SupervisorManager({ campaigns = [], onLogAction, onCreateClick }) {
  // Derive supervisor desk dynamically from campaigns
  const supervisors = campaigns.map((c, idx) => ({
    id: `sup_${idx + 1}`,
    name: c.manager || `Supervisor ${idx + 1}`,
    role: 'Field Operations Lead',
    avatar: '👨🏽',
    phone: '+91 98401 23456',
    assignedHubs: [c.city ? `${c.city} Metro Hub` : 'Central Hub'],
    promotersCount: c.workers || 10,
    presentPromoters: c.workers || 10,
    rating: 4.9,
    activeShift: '10:00 AM - 06:00 PM',
    status: 'Active On Ground',
    managedCampaign: c.name
  }));

  const [selectedSupervisorId, setSelectedSupervisorId] = useState(supervisors[0]?.id || 'sup_1');
  const [instructionText, setInstructionText] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationText, setEscalationText] = useState('');

  // Workers under current supervisor
  const [supervisorWorkers, setSupervisorWorkers] = useState([]);
  const currentSupervisor = supervisors.find(s => s.id === selectedSupervisorId) || supervisors[0];

  const handleSendInstructions = (e) => {
    e.preventDefault();
    if (!instructionText.trim()) return;
    if (onLogAction && currentSupervisor) {
      onLogAction('SUPERVISOR_BROADCAST', `Supervisor ${currentSupervisor.name} broadcasted to all field promoters: "${instructionText}"`);
    }
    setInstructionText('');
    alert(`Instruction broadcast sent to all assigned promoters.`);
  };

  const handleSubmitSupervisorReport = (e) => {
    e.preventDefault();
    setIsReportSubmitted(true);
    if (onLogAction && currentSupervisor) {
      onLogAction('SUPERVISOR_REPORT_FILED', `Daily Field Report filed by ${currentSupervisor.name}: "${reportNotes || 'All checkpoints verified. Stock replenished.'}"`);
    }
  };

  const handleEscalateIssue = (e) => {
    e.preventDefault();
    if (onLogAction && currentSupervisor) {
      onLogAction('ISSUE_ESCALATED', `URGENT Field Issue escalated by ${currentSupervisor.name} to Agency Campaign Manager: "${escalationText}"`);
    }
    setEscalationText('');
    setEscalationOpen(false);
    alert('Issue escalated to Agency Campaign Operations Center.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Supervisor Management Desk
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Hierarchy: Promotion Agency → Campaign Manager → Field Supervisors → Ziggers.
          </p>
        </div>

        {supervisors.length > 0 && (
          <button
            onClick={() => setEscalationOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
          >
            <AlertTriangle size={15} />
            <span>Escalate Field Issue</span>
          </button>
        )}
      </div>

      {supervisors.length > 0 ? (
        <>
          {/* Supervisor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supervisors.map((sup) => (
              <div
                key={sup.id}
                onClick={() => setSelectedSupervisorId(sup.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  selectedSupervisorId === sup.id
                    ? 'border-gold shadow-md ring-2 ring-gold/30'
                    : 'border-espresso/10 hover:border-gold/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-linen/50 rounded-xl">{sup.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-espresso">{sup.name}</h3>
                        <span className="text-[10px] font-bold text-espresso bg-gold/20 px-1.5 py-0.5 rounded border border-gold/30">
                          ★ {sup.rating}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{sup.role}</p>
                      <p className="text-[11px] font-mono text-espresso mt-0.5">{sup.phone}</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    {sup.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-espresso/5 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-muted block font-sans">ASSIGNED LOCATIONS</span>
                    <strong className="text-espresso block truncate">{sup.assignedHubs.join(', ')}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-muted block font-sans">ASSIGNED PROMOTERS</span>
                    <strong className="text-gold font-extrabold">{sup.presentPromoters} / {sup.promotersCount} On-Field</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Roster & Comms Desk */}
          {currentSupervisor && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Roster (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-espresso/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-espresso">
                      ASSIGNED TEAM ROSTER ({currentSupervisor.name.toUpperCase()})
                    </h3>
                    <p className="text-[11px] text-muted">
                      Mark attendance, verify GPS, track sampling quota, and approve daily wage disbursement.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-linen/50 px-2.5 py-1 rounded-lg border border-espresso/10">
                    {supervisorWorkers.filter(w => w.workApproved).length} / {supervisorWorkers.length} Approved
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase">
                        <th className="py-2.5 px-3">Worker</th>
                        <th className="py-2.5 px-3">Location Node</th>
                        <th className="py-2.5 px-3">Attendance & GPS</th>
                        <th className="py-2.5 px-3">Samples Logged</th>
                        <th className="py-2.5 px-3 text-right">Wage Approval</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-espresso/5 text-xs font-medium">
                      {supervisorWorkers.length > 0 ? (
                        supervisorWorkers.map((w) => (
                          <tr key={w.id} className="hover:bg-linen/20">
                            <td className="py-3 px-3">
                              <span className="font-extrabold text-espresso">{w.name}</span>
                              <span className="text-[10px] text-muted block font-mono">{w.phone}</span>
                            </td>
                            <td className="py-3 px-3 text-espresso">{w.location}</td>
                            <td className="py-3 px-3">
                              <span className="text-green-700 font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> {w.status}
                              </span>
                              <span className="text-[9px] text-muted font-mono">{w.checkinTime} • {w.gpsAccuracy}</span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-espresso">{w.samplesLogged} units</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleToggleApproveWork(w.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  w.workApproved
                                    ? 'bg-green-700 text-white'
                                    : 'bg-linen text-espresso hover:bg-gold'
                                }`}
                              >
                                {w.workApproved ? '✓ Wage Approved' : 'Approve Shift'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-muted">
                            <UserCheck size={28} className="mx-auto mb-1.5 opacity-30 text-espresso" />
                            <p className="font-bold text-xs text-espresso">No team members assigned</p>
                            <p className="text-[11px] text-muted">Promoter assignments for this supervisor node will appear here.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comms & Shift Report (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-espresso/10 p-5 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-xs text-espresso uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-gold" /> Broadcast Instructions
                  </h4>
                  <form onSubmit={handleSendInstructions} className="space-y-2">
                    <textarea
                      rows={3}
                      value={instructionText}
                      onChange={(e) => setInstructionText(e.target.value)}
                      placeholder="e.g. Move sampling booth closer to main gate. Heavy footfall expected at 1 PM."
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-3 text-xs focus:outline-none focus:border-gold"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-espresso hover:bg-muted text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send size={13} className="text-gold" /> Send Broadcast Notice
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <ShieldCheck size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Field Supervisors Deployed
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Deploy your first campaign to assign senior field operation supervisors to geofenced hub nodes.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Deploy Supervisors</span>
          </button>
        </div>
      )}

    </div>
  );
}
