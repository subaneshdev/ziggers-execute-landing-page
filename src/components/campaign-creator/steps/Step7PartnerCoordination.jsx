"use client";
import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Star, Clock, Check, Building2, 
  ArrowRight, UserCheck, MessageSquare, Plus, FileText, CheckCircle2 
} from 'lucide-react';
import { 
  VERIFIED_PARTNER_DIRECTORY, 
  PARTNER_CATEGORIES, 
  FULFILLMENT_MODES 
} from '@/lib/ecosystem/btlTaxonomy';
import PartnerMatchModal from '../ui/PartnerMatchModal';

export default function Step7PartnerCoordination({ draft, onUpdate, onJumpToStep }) {
  const {
    locations = [],
    activationRequirements = []
  } = draft;

  const targetCity = locations[0]?.city || 'Chennai';

  // Filter requirements that need a Ziggers Partner
  const partnerReqs = activationRequirements.filter(
    r => r.fulfillmentMode === FULFILLMENT_MODES.ZIGGERS_PARTNER
  );

  const [activeReqModal, setActiveReqModal] = useState(null);

  const handlePartnerAssigned = (partnerData) => {
    if (!activeReqModal) return;
    const updated = activationRequirements.map(r => {
      if (r.id === activeReqModal.id) {
        return {
          ...r,
          fulfillmentMode: FULFILLMENT_MODES.ZIGGERS_PARTNER,
          attachedPartner: partnerData
        };
      }
      return r;
    });
    onUpdate({ activationRequirements: updated });
    setActiveReqModal(null);
  };

  const handleSwitchToClientHandle = (reqId) => {
    const updated = activationRequirements.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          fulfillmentMode: FULFILLMENT_MODES.CLIENT_HANDLES,
          attachedPartner: null,
          attachedVendor: null
        };
      }
      return r;
    });
    onUpdate({ activationRequirements: updated });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 7 • Partner & Vendor Coordination
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Verified BTL Partner Network Matching
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Review requirements requiring specialized vendors in <strong className="text-espresso">{targetCity}</strong>. Compare verified partners, view turnaround SLAs, and assign deliverables.
        </p>
      </div>

      {partnerReqs.length === 0 ? (
        <div className="bg-white border border-espresso/15 rounded-3xl p-10 text-center space-y-4 font-sans shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-linen/40 text-espresso flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} className="text-gold" />
          </div>
          <div className="space-y-1">
            <strong className="text-base font-black text-espresso block font-serif">
              No External Partner Requirements Selected
            </strong>
            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              All campaign requirements are currently handled internally by your team or directly through Ziggers Execute.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(6)}
            className="h-11 px-6 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Review Step 6 Requirements
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-espresso uppercase tracking-wider">
              Specialist Deliverables Assigned to Partner Network ({partnerReqs.length})
            </span>
            <span className="text-[10px] font-mono text-muted">Target City: {targetCity}</span>
          </div>

          <div className="space-y-4">
            {partnerReqs.map((req) => {
              const matchedDirectory = VERIFIED_PARTNER_DIRECTORY.filter(p => 
                p.category === req.category && 
                (p.city === targetCity || (p.supportedCities && p.supportedCities.includes(targetCity)))
              );

              const assigned = req.attachedPartner;

              return (
                <div
                  key={req.id}
                  className="bg-white border border-espresso/15 rounded-3xl p-6 shadow-xs space-y-5 hover:shadow-sm transition-all"
                >
                  {/* Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                        {req.reqCategory}
                      </span>
                      <h4 className="text-base font-black text-espresso font-serif">
                        {req.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        Scope: {req.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSwitchToClientHandle(req.id)}
                      className="text-xs font-bold text-muted hover:text-espresso underline cursor-pointer shrink-0 self-start"
                    >
                      Change to &quot;We Will Handle&quot;
                    </button>
                  </div>

                  {/* Deliverables List */}
                  {req.deliverables && (
                    <div className="flex flex-wrap gap-1.5">
                      {req.deliverables.map((deliv, dIdx) => (
                        <span key={dIdx} className="px-2.5 py-1 bg-linen/20 border border-espresso/10 text-espresso rounded-lg text-[10px] font-semibold">
                          • {deliv}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Assigned Partner Details or Match Action */}
                  <div className="p-4 bg-linen/20 rounded-2xl border border-espresso/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {assigned ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                            <ShieldCheck size={11} /> Verified Partner Assigned
                          </span>
                          <strong className="text-xs font-bold text-espresso">{assigned.partnerName}</strong>
                        </div>
                        <div className="text-[11px] text-muted flex items-center gap-2">
                          <span>📍 {assigned.city}</span>
                          <span>•</span>
                          <span>👤 {assigned.contactPerson}</span>
                          <span>•</span>
                          <span>⭐ {assigned.rating} / 5.0</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-espresso block">
                          {matchedDirectory.length} Verified Partners Available in {targetCity}
                        </strong>
                        <span className="text-[11px] text-muted">
                          Select a partner or request instant quotes with SLA guarantees.
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveReqModal(req)}
                      className="px-5 py-2 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Sparkles size={13} className="text-gold" />
                      <span>{assigned ? 'Change Partner' : 'Select Partner'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Partner Match Modal */}
      <PartnerMatchModal
        isOpen={Boolean(activeReqModal)}
        onClose={() => setActiveReqModal(null)}
        requirement={activeReqModal}
        city={targetCity}
        onSelectPartner={handlePartnerAssigned}
      />

    </div>
  );
}
