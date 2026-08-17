"use client";
import React, { useState } from 'react';
import { 
  Wallet, DollarSign, CheckCircle2, ShieldCheck, ArrowRight, 
  Sparkles, Lock, RefreshCw, AlertCircle, FileText, Download, Zap
} from 'lucide-react';

export default function CampaignWallet({ campaigns = [], onLogAction }) {
  // Campaign Budget & Escrow Breakdown as specified in Feature 14
  const [walletData, setWalletData] = useState({
    campaignName: 'Coca-Cola College Activation',
    brand: 'Coca-Cola India',
    campaignBudget: 200000,
    workerWages: 120000,
    supervisorCost: 20000,
    platformFee: 15000,
    remainingEscrow: 45000,
    payoutsReleased: false,
    verifiedWorkersCount: 20,
    approvedSupervisorsCount: 2
  });

  const [payoutLogs, setPayoutLogs] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleReleaseEscrowPayouts = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setWalletData(prev => ({ ...prev, payoutsReleased: true }));
      setPayoutLogs(prev => prev.map(p => ({
        ...p,
        status: 'Disbursed via IMPS/UPI (UTR #89201948291)',
      })));
      setIsProcessing(false);

      if (onLogAction) {
        onLogAction('ESCROW_PAYOUT_DISBURSED', `Disbursed ₹1,40,000 verified worker & supervisor wages directly to bank accounts after 100% attendance and supervisor audit approval.`);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Campaign Escrow Wallet & Wage Disbursements
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Funds are locked in digital escrow and released dynamically to workers only after attendance, milestone completion, and supervisor approval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReleaseEscrowPayouts}
            disabled={walletData.payoutsReleased || isProcessing}
            className={`font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              walletData.payoutsReleased 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-gold hover:bg-gold/90 text-espresso'
            }`}
          >
            <Zap size={14} />
            <span>
              {isProcessing ? 'Processing IMPS Payouts...' : 
               walletData.payoutsReleased ? 'Wages Disbursed ✅' : 'Release Audited Wages (1-Click)'}
            </span>
          </button>
        </div>
      </div>

      {/* Feature 14: Escrow Budget Ledger Cards */}
      <div className="bg-espresso text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
              Active Campaign Escrow Ledger
            </span>
            <h3 className="text-xl font-extrabold mt-0.5">{walletData.campaignName}</h3>
            <span className="text-xs text-white/70">Client: {walletData.brand}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/60 uppercase font-bold block">Total Campaign Budget</span>
            <span className="text-3xl font-extrabold text-gold font-mono">
              ₹{walletData.campaignBudget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 4-Item Breakdown as specifically given in Feature 14 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-white/60 uppercase font-bold block">Worker Wages</span>
            <span className="text-lg font-extrabold text-white mt-1 block">
              ₹{walletData.workerWages.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-green-400 font-sans mt-0.5 block">20 Promoters • ₹800/shift</span>
          </div>

          <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-white/60 uppercase font-bold block">Supervisor Fees</span>
            <span className="text-lg font-extrabold text-white mt-1 block">
              ₹{walletData.supervisorCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-green-400 font-sans mt-0.5 block">2 Field Operations Leads</span>
          </div>

          <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-white/60 uppercase font-bold block">Platform Fee (7.5%)</span>
            <span className="text-lg font-extrabold text-white mt-1 block">
              ₹{walletData.platformFee.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-white/60 font-sans mt-0.5 block">Automated AI Orchestration</span>
          </div>

          <div className="bg-gold/20 border border-gold/40 p-4 rounded-2xl">
            <span className="text-[10px] text-gold uppercase font-bold block">Remaining Escrow Wallet</span>
            <span className="text-lg font-extrabold text-gold mt-1 block">
              ₹{walletData.remainingEscrow.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-white/80 font-sans mt-0.5 block">Refundable / Next Milestone</span>
          </div>
        </div>

        {/* 3 Verification Conditions Banner */}
        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400" />
            <span className="font-bold text-white">Three-Tier Disbursement Rule:</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> 1. Attendance GPS Match
            </span>
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> 2. Shift Milestone Completion
            </span>
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> 3. Supervisor Work Approval
            </span>
          </div>
        </div>
      </div>

      {/* Wage Disbursement Audit Ledger */}
      <div className="bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
            Worker Payout & Bank Disbursement Registry
          </h3>
          <span className="text-[10px] font-mono text-muted">
            Instant IMPS / UPI Direct Bank Route
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/10">
                <th className="py-3 px-4">Recipient Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Bank / UPI Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Audit Condition Check</th>
                <th className="py-3 px-4 text-right">Disbursement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10 font-medium">
              {payoutLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <Wallet size={32} className="mx-auto mb-2 opacity-30 text-espresso" />
                    <p className="font-bold text-sm text-espresso">No payout disbursements recorded</p>
                    <p className="text-xs text-muted mt-0.5">Escrow wage allocations and bank payout transactions will be logged here automatically.</p>
                  </td>
                </tr>
              ) : (
                payoutLogs.map((p) => (
                <tr key={p.id} className="hover:bg-linen/10">
                  <td className="py-3.5 px-4 font-bold text-espresso">
                    {p.recipient}
                  </td>
                  <td className="py-3.5 px-4 text-muted">
                    {p.role}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-espresso">
                    {p.bankRef}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-espresso text-sm">
                    {p.amount}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 font-mono font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 size={10} /> 100% Conditions Met
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      walletData.payoutsReleased 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
