"use client";
import React, { useState } from 'react';
import { 
  Layers, Users, Building2, UserCheck, Check, Edit3, ArrowRight, Target, 
  ShieldCheck, Sparkles, Wrench, Package, Truck, Volume2, Printer, Camera, QrCode, FileText 
} from 'lucide-react';
import { 
  PARTNER_CATEGORIES, 
  FULFILLMENT_MODES, 
  generateActivationRequirements 
} from '@/lib/ecosystem/btlTaxonomy';
import PartnerMatchModal from '../ui/PartnerMatchModal';
import ExistingVendorModal from '../ui/ExistingVendorModal';

export default function Step6ActivationRequirements({ draft, onUpdate }) {
  const {
    brand = 'Brand',
    brandIndustry = 'Retail',
    brandProductLine = 'Product',
    objective = 'Product Sampling',
    locations = [],
    activationPlan = null,
    activationRequirements = null
  } = draft;

  // Initialize or load categorized activation requirements
  const [requirements, setRequirements] = useState(() => {
    if (Array.isArray(activationRequirements) && activationRequirements.length > 0) {
      return activationRequirements;
    }
    return generateActivationRequirements({
      activationPlan,
      objective,
      brandCategory: brandIndustry,
      productLine: brandProductLine,
      brandName: brand,
      locationsCount: locations.length || 1,
      city: locations[0]?.city || 'Chennai'
    });
  });

  const [activePartnerModalReq, setActivePartnerModalReq] = useState(null);
  const [activeVendorModalReq, setActiveVendorModalReq] = useState(null);

  const updateRequirements = (newReqs) => {
    setRequirements(newReqs);
    onUpdate({ activationRequirements: newReqs });
  };

  const handleSetFulfillment = (reqId, mode) => {
    const target = requirements.find(r => r.id === reqId);
    if (mode === FULFILLMENT_MODES.ZIGGERS_PARTNER) {
      setActivePartnerModalReq(target);
      return;
    }
    if (mode === FULFILLMENT_MODES.EXISTING_VENDOR) {
      setActiveVendorModalReq(target);
      return;
    }

    const updated = requirements.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          fulfillmentMode: mode,
          attachedPartner: null,
          attachedVendor: null
        };
      }
      return r;
    });
    updateRequirements(updated);
  };

  const handlePartnerSelected = (partnerData) => {
    if (!activePartnerModalReq) return;
    const updated = requirements.map(r => {
      if (r.id === activePartnerModalReq.id) {
        return {
          ...r,
          fulfillmentMode: FULFILLMENT_MODES.ZIGGERS_PARTNER,
          attachedPartner: partnerData,
          attachedVendor: null
        };
      }
      return r;
    });
    updateRequirements(updated);
    setActivePartnerModalReq(null);
  };

  const handleVendorSaved = (vendorData) => {
    if (!activeVendorModalReq) return;
    const updated = requirements.map(c => {
      if (c.id === activeVendorModalReq.id) {
        return {
          ...c,
          fulfillmentMode: FULFILLMENT_MODES.EXISTING_VENDOR,
          attachedVendor: vendorData,
          attachedPartner: null
        };
      }
      return c;
    });
    updateRequirements(updated);
    setActiveVendorModalReq(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 6 • Activation Requirements
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          What is needed to execute it?
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Requirements are generated specifically for your approved activation: <strong className="text-espresso">{activationPlan?.activationName || 'Campaign Activation'}</strong>.
        </p>
      </div>

      {/* Requirements List */}
      <div className="space-y-5">
        {requirements.map((req, idx) => {
          const currentMode = req.fulfillmentMode || req.suggestedFulfillment || FULFILLMENT_MODES.CLIENT_HANDLES;

          return (
            <div
              key={req.id || idx}
              className="p-6 bg-white border border-espresso/15 rounded-3xl shadow-xs space-y-5 hover:shadow-sm transition-all"
            >
              {/* Category, Title & Specific Requirement */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                      {req.reqCategory}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-espresso font-serif">
                    {req.title}
                  </h4>
                  <div className="inline-block px-3.5 py-1 bg-linen/30 text-espresso rounded-xl text-xs font-bold border border-espresso/10">
                    Requirement: {req.requirementText}
                  </div>
                  <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                    {req.desc}
                  </p>
                </div>

                {/* Attached Partner / Vendor Badge */}
                {req.attachedPartner && (
                  <span className="text-[11px] font-mono font-bold text-green-800 bg-green-50 border border-green-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 self-start shadow-2xs">
                    <ShieldCheck size={14} className="text-green-600" />
                    <span>Partner: {req.attachedPartner.partnerName}</span>
                  </span>
                )}
                {req.attachedVendor && (
                  <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 self-start shadow-2xs">
                    <Building2 size={14} className="text-blue-600" />
                    <span>Vendor: {req.attachedVendor.vendorName}</span>
                  </span>
                )}
              </div>

              {/* Deliverables Checklist */}
              {req.deliverables && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {req.deliverables.map((deliv, dIdx) => (
                    <span key={dIdx} className="px-3 py-1 bg-linen/25 border border-espresso/10 text-espresso rounded-lg text-xs font-semibold">
                      ✓ {deliv}
                    </span>
                  ))}
                </div>
              )}

              {/* Who will manage this selector */}
              <div className="pt-4 border-t border-espresso/10 space-y-2.5">
                <span className="text-xs font-bold text-espresso uppercase tracking-wider block">
                  Who will manage this deliverable?
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  {/* Option 1: Brand / Agency / Business Owner */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.CLIENT_HANDLES)}
                    className={`min-h-[52px] p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.CLIENT_HANDLES
                        ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold/40'
                        : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                    }`}
                  >
                    <UserCheck size={16} />
                    <span className="text-xs leading-tight">Brand Will Manage</span>
                  </button>

                  {/* Option 2: Use Ziggers Execute (Only for direct services) */}
                  {req.canZiggersExecute ? (
                    <button
                      type="button"
                      onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.ZIGGERS_EXECUTE)}
                      className={`min-h-[52px] p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        currentMode === FULFILLMENT_MODES.ZIGGERS_EXECUTE
                          ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold/40'
                          : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                      }`}
                    >
                      <ShieldCheck size={16} className="text-gold" />
                      <span className="text-xs leading-tight">Use Ziggers Execute</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.EXISTING_VENDOR)}
                      className={`min-h-[52px] p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        currentMode === FULFILLMENT_MODES.EXISTING_VENDOR
                          ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold/40'
                          : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                      }`}
                    >
                      <Building2 size={16} />
                      <span className="text-xs leading-tight">
                        {req.attachedVendor ? 'Edit Vendor' : 'Existing Agency'}
                      </span>
                    </button>
                  )}

                  {/* Option 3: Find a Ziggers Partner */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.ZIGGERS_PARTNER)}
                    className={`min-h-[52px] p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.ZIGGERS_PARTNER
                        ? 'bg-espresso text-gold border-espresso shadow-xs ring-2 ring-gold/60'
                        : 'bg-gold/10 border-gold/40 text-espresso hover:bg-gold/20'
                    }`}
                  >
                    <Sparkles size={16} className="text-gold" />
                    <span className="text-xs leading-tight">
                      {req.attachedPartner ? 'Change Partner' : 'Find a Partner'}
                    </span>
                  </button>

                  {/* Option 4: Not Required */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.NOT_REQUIRED)}
                    className={`min-h-[52px] p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.NOT_REQUIRED
                        ? 'bg-muted/30 text-muted border-espresso/20 line-through'
                        : 'bg-linen/10 border-espresso/10 text-muted hover:bg-linen/30'
                    }`}
                  >
                    <span className="text-xs leading-tight">Not Required</span>
                  </button>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Partner Matching Modal */}
      <PartnerMatchModal
        isOpen={Boolean(activePartnerModalReq)}
        onClose={() => setActivePartnerModalReq(null)}
        requirement={activePartnerModalReq}
        city={locations[0]?.city || 'Chennai'}
        onSelectPartner={handlePartnerSelected}
      />

      {/* Existing Vendor Modal */}
      <ExistingVendorModal
        isOpen={Boolean(activeVendorModalReq)}
        onClose={() => setActiveVendorModalReq(null)}
        requirement={activeVendorModalReq}
        onSaveVendor={handleVendorSaved}
      />

    </div>
  );
}
