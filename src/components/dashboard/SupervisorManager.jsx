"use client";
import React, { useState } from 'react';
import { 
  Users, ShieldCheck, MapPin, CheckCircle, AlertTriangle, 
  Send, FileText, Upload, RefreshCw, Zap, MessageSquare, 
  Check, Phone, AlertCircle, ArrowRight
} from 'lucide-react';

export default function SupervisorManager({ campaigns = [], onLogAction }) {
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('sup_1');
  const [instructionText, setInstructionText] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationText, setEscalationText] = useState('');

  // Field Supervisors Dataset
  const supervisors = [
    {
      id: 'sup_1',
      name: 'Kumar Swaminathan',
      role: 'Senior Field Supervisor',
      avatar: '👨🏽',
      phone: '+91 98401 23456',
      assignedHubs: ['Loyola College', 'SRM University', 'Velachery Hub'],
      promotersCount: 14,
      presentPromoters: 13,
      rating: 4.95,
      activeShift: '10:00 AM - 06:00 PM',
      status: 'Active On Ground',
      managedCampaign: 'Coca-Cola College Activation'
    },
    {
      id: 'sup_2',
      name: 'Prakash Rao',
      role: 'Area Operations Lead',
      avatar: '👨🏽',
      phone: '+91 98405 56789',
      assignedHubs: ['MCC College, Tambaram', 'Anna University, Guindy'],
      promotersCount: 12,
      presentPromoters: 12,
      rating: 4.9,
      activeShift: '10:00 AM - 06:00 PM',
      status: 'Active On Ground',
      managedCampaign: 'Coca-Cola College Activation'
    }
  ];

  // Workers under current supervisor
  const [supervisorWorkers, setSupervisorWorkers] = useState([
    {
      id: 'sw_1',
      name: 'Rohit Sharma',
      avatar: '👨🏽',
      location: 'Loyola College Gate 1',
      attendance: 'Present (GPS Verified)',
      workApproved: true,
      samplesDistributed: 110,
      targetQuota: 120,
      phone: '+91 98401 12345'
    },
    {
      id: 'sw_2',
      name: 'Meera Nair',
      avatar: '👩🏽',
      location: 'Loyola College Cafeteria',
      attendance: 'Present (GPS Verified)',
      workApproved: true,
      samplesDistributed: 75,
      targetQuota: 80,
      phone: '+91 98402 23456'
    },
    {
      id: 'sw_3',
      name: 'Aravind Swamy',
      avatar: '👨🏽',
      location: 'SRM University Tech Park',
      attendance: 'Present (GPS Verified)',
      workApproved: false,
      samplesDistributed: 130,
      targetQuota: 150,
      phone: '+91 98405 56780'
    },
    {
      id: 'sw_4',
      name: 'Vikas Menon',
      avatar: '👨🏽',
      location: 'Velachery Hub',
      attendance: 'Absent (Replaced by Venkatesh Babu)',
      workApproved: true,
      samplesDistributed: 85,
      targetQuota: 100,
      phone: '+91 98409 88776'
    }
  ]);

  const currentSupervisor = supervisors.find(s => s.id === selectedSupervisorId) || supervisors[0];

  const handleToggleApproveWork = (id) => {
    setSupervisorWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const updated = !w.workApproved;
        if (onLogAction) {
          onLogAction('SUPERVISOR_WORK_APPROVAL', `Supervisor ${currentSupervisor.name} ${updated ? 'APPROVED' : 'REVOKED'} shift payout for ${w.name}`);
        }
        return { ...w, workApproved: updated };
      }
      return w;
    }));
  };

  const handleSendInstructions = (e) => {
    e.preventDefault();
    if (!instructionText.trim()) return;
    if (onLogAction) {
      onLogAction('SUPERVISOR_BROADCAST', `Supervisor ${currentSupervisor.name} broadcasted to all field promoters: "${instructionText}"`);
    }
    setInstructionText('');
    alert(`Instruction broadcast sent to all ${supervisorWorkers.length} assigned promoters.`);
  };

  const handleSubmitSupervisorReport = (e) => {
    e.preventDefault();
    setIsReportSubmitted(true);
    if (onLogAction) {
      onLogAction('SUPERVISOR_REPORT_FILED', `Daily Field Report filed by ${currentSupervisor.name}: "${reportNotes || 'All checkpoints verified. Stock replenished.'}"`);
    }
  };

  const handleEscalateIssue = (e) => {
    e.preventDefault();
    if (onLogAction) {
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
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Supervisor Management Desk</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Hierarchy: Promotion Agency → Campaign Manager → Field Supervisors → Ziggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEscalationOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <AlertTriangle size={13} />
            <span>Escalate Field Issue</span>
          </button>
        </div>
      </div>

      {/* Supervisors Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supervisors.map((sup) => (
          <div
            key={sup.id}
            onClick={() => setSelectedSupervisorId(sup.id)}
            className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
              selectedSupervisorId === sup.id ? 'border-gold bg-linen/10 ring-2 ring-gold/40' : 'border-espresso/10 hover:border-espresso/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{sup.avatar}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-espresso text-sm">{sup.name}</h3>
                    <span className="bg-gold/20 text-espresso text-[9px] font-bold px-2 py-0.5 rounded-full">
                      ★ {sup.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted font-medium">{sup.role}</span>
                  <span className="text-[10px] text-muted font-mono block mt-0.5">{sup.phone}</span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                ● {sup.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-espresso/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] text-muted uppercase font-bold block">Assigned Locations</span>
                <span className="font-bold text-espresso">{sup.assignedHubs.join(', ')}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-muted uppercase font-bold block">Assigned Promoters</span>
                <span className="font-extrabold text-gold font-mono">{sup.presentPromoters} / {sup.promotersCount} On-Field</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supervisor Control Panel for Selected Supervisor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Assigned Workers Roster & Work Approvals */}
        <div className="lg:col-span-2 bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                Assigned Team Roster ({currentSupervisor.name})
              </h3>
              <p className="text-[10px] text-muted">
                Mark attendance, verify GPS, track sampling quota, and approve daily wage disbursement.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white text-espresso px-2.5 py-1 rounded-lg border border-espresso/10">
              {supervisorWorkers.filter(w => w.workApproved).length} / {supervisorWorkers.length} Approved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/10">
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-4">Location Node</th>
                  <th className="py-3 px-4">Attendance & GPS</th>
                  <th className="py-3 px-4">Samples Logged</th>
                  <th className="py-3 px-4 text-right">Wage Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10 font-medium">
                {supervisorWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-linen/10">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{w.avatar}</span>
                        <div>
                          <strong className="text-espresso font-extrabold block text-xs">{w.name}</strong>
                          <span className="text-[9px] text-muted font-mono">{w.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-espresso">
                      {w.location}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md ${
                        w.attendance.includes('Present') ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {w.attendance}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-espresso">
                      {w.samplesDistributed} / {w.targetQuota}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleApproveWork(w.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ml-auto ${
                          w.workApproved 
                            ? 'bg-green-600 text-white shadow-xs' 
                            : 'bg-linen/40 text-espresso hover:bg-gold border border-espresso/10'
                        }`}
                      >
                        <Check size={11} />
                        <span>{w.workApproved ? 'Wage Approved ✅' : 'Approve Payout'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Instructions Broadcast & Shift Reporting */}
        <div className="space-y-6">
          
          {/* Send Broadcast Instructions to Team */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-extrabold text-espresso uppercase tracking-wider block flex items-center gap-1.5">
              <MessageSquare size={13} className="text-gold" /> Broadcast Instructions
            </span>
            <p className="text-[10px] text-muted">
              Sends an instant high-priority notification to all {supervisorWorkers.length} assigned promoters on-ground.
            </p>

            <form onSubmit={handleSendInstructions} className="space-y-2">
              <textarea
                rows={3}
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                placeholder="e.g. Move sampling booth closer to college library gate. Heavy student rush expected at 1 PM."
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-2.5 text-xs text-espresso focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Send size={12} className="text-gold" />
                <span>Send Broadcast Notice</span>
              </button>
            </form>
          </div>

          {/* Daily Supervisor Shift Report */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-extrabold text-espresso uppercase tracking-wider block flex items-center gap-1.5">
              <FileText size={13} className="text-gold" /> Field Shift Report
            </span>

            <form onSubmit={handleSubmitSupervisorReport} className="space-y-2 text-xs">
              <textarea
                rows={3}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Submit end-of-shift notes, product stock consumed, and college authority permissions status..."
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-2.5 text-xs text-espresso focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-espresso font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Upload size={12} />
                <span>{isReportSubmitted ? 'Report Filed ✅' : 'Submit Field Report'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Escalation Modal */}
      {escalationOpen && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold">
                <AlertTriangle size={18} />
                <h3 className="text-sm uppercase tracking-wider">Escalate Urgent Field Issue</h3>
              </div>
              <button onClick={() => setEscalationOpen(false)} className="text-muted hover:text-espresso font-bold">✕</button>
            </div>

            <p className="text-muted leading-relaxed">
              This triggers an immediate emergency alert to the Agency Campaign Manager and Operations Dispatch Desk.
            </p>

            <textarea
              rows={3}
              value={escalationText}
              onChange={(e) => setEscalationText(e.target.value)}
              placeholder="Describe emergency (e.g. Rain storm at college quadrangle, canopy damaged, need emergency logistics support)..."
              className="w-full bg-linen/30 border border-espresso/15 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEscalationOpen(false)} className="px-4 py-2 font-bold text-muted">Cancel</button>
              <button
                onClick={handleEscalateIssue}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle size={13} />
                <span>Dispatch Emergency Escalation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
