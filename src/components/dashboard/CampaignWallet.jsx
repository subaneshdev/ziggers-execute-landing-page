"use client";
import React, { useState } from 'react';
import { 
  Wallet, DollarSign, CheckCircle2, ShieldCheck, ArrowRight, 
  Sparkles, Lock, RefreshCw, AlertCircle, FileText, Download, Zap, Plus
} from 'lucide-react';

export default function CampaignWallet({ campaigns = [], onLogAction, onCreateClick }) {
  const activeCampaign = campaigns[0] || null;

  const totalSpend = campaigns.reduce((acc, c) => {
    const raw = (c.spend || c.totalBudget || '0').replace(/[^0-9]/g, '');
    return acc + (parseInt(raw, 10) || 0);
  }, 0);

  const totalWorkersCount = campaigns.reduce((acc, c) => acc + (parseInt(c.workers, 10) || 0), 0);

  const [payoutsReleased, setPayoutsReleased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReleaseEscrowPayouts = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPayoutsReleased(true);
      if (onLogAction && activeCampaign) {
        onLogAction('ESCROW_PAYOUT_DISBURSED', `Disbursed ₹${Math.round(totalSpend * 0.7).toLocaleString('en-IN')} verified worker & supervisor wages directly to bank accounts after 100% attendance and supervisor audit approval.`);
      }
      setIsProcessing(false);
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
            Ziggers holds campaign budget in verified escrow and releases daily wages to promoters & supervisors only after 100% geofenced attendance and proof photo approval.
          </p>
        </div>

        {activeCampaign && totalSpend > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReleaseEscrowPayouts}
              disabled={payoutsReleased || isProcessing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                payoutsReleased
                  ? 'bg-green-700 text-white cursor-not-allowed'
                  : 'bg-gold hover:bg-gold/90 text-espresso'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Processing Disbursement...
                </>
              ) : payoutsReleased ? (
                <>
                  <CheckCircle2 size={14} /> Payouts Disbursed via UPI
                </>
              ) : (
                <>
                  <Zap size={14} /> Approve & Disburse Escrow Wager
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {activeCampaign && totalSpend > 0 ? (
        <div className="space-y-6">
          {/* Escrow Balance Banner */}
          <div className="bg-espresso text-white rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider bg-gold/20 px-2.5 py-0.5 rounded border border-gold/30">
                  Escrow Lock ID: ESC-2026-ZG
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1.5">{activeCampaign.name}</h3>
                <p className="text-xs text-linen/70 mt-0.5 font-medium">Brand: {activeCampaign.brand || 'Enterprise Partner'}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-linen/70 uppercase block font-mono">Total Budget Locked</span>
                <strong className="text-3xl font-extrabold text-gold font-mono">₹{totalSpend.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Escrow Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Promoter Wage Pool (60%)</span>
                <strong className="text-white text-base block mt-1">₹{Math.round(totalSpend * 0.6).toLocaleString('en-IN')}</strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">{totalWorkersCount} Verified Staff</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Supervisor Lead Fee (10%)</span>
                <strong className="text-white text-base block mt-1">₹{Math.round(totalSpend * 0.1).toLocaleString('en-IN')}</strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">Audited Shift Leads</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Ziggers OS Fee (8%)</span>
                <strong className="text-white text-base block mt-1">₹{Math.round(totalSpend * 0.08).toLocaleString('en-IN')}</strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">Software & GPS Telemetry</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Escrow Reserve (22%)</span>
                <strong className="text-green-400 text-base block mt-1">₹{Math.round(totalSpend * 0.22).toLocaleString('en-IN')}</strong>
                <span className="text-[9px] text-green-400/80 block mt-0.5">Instant Refundable</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <Wallet size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Escrow Accounts Active
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Deploy your first campaign to allocate campaign budgets into protected escrow wallets with automated UPI wage disbursements.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Lock Escrow Budget</span>
          </button>
        </div>
      )}

    </div>
  );
}
