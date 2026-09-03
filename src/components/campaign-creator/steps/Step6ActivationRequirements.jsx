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
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 6 • Activation Requirements
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          What is needed to execute it?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Requirements are generated specifically for your approved activation: <strong className="text-espresso">{activationPlan?.activationName || 'Campaign Activation'}</strong>.
        </p>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {requirements.map((req, idx) => {
          const currentMode = req.fulfillmentMode || req.suggestedFulfillment || FULFILLMENT_MODES.CLIENT_HANDLES;

          return (
            <div
              key={req.id || idx}
              className="p-5 bg-white border border-espresso/15 rounded-3xl shadow-xs space-y-4"
            >
              {/* Category, Title & Specific Requirement */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                    {req.reqCategory}
                  </span>
                  <h4 className="text-sm font-black text-espresso font-serif">
                    {req.title}
                  </h4>
                  <div className="inline-block px-3 py-1 bg-linen/40 text-espresso rounded-xl text-xs font-bold border border-espresso/10">
                    Requirement: {req.requirementText}
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {req.desc}
                  </p>
                </div>

                {/* Attached Partner / Vendor Badge */}
                {req.attachedPartner && (
                  <span className="text-[10px] font-mono font-bold text-green-800 bg-green-50 border border-green-300 px-3 py-1 rounded-xl flex items-center gap-1 shrink-0 self-start">
                    <ShieldCheck size={12} className="text-green-600" />
                    <span>Partner: {req.attachedPartner.partnerName}</span>
                  </span>
                )}
                {req.attachedVendor && (
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-300 px-3 py-1 rounded-xl flex items-center gap-1 shrink-0 self-start">
                    <Building2 size={12} className="text-blue-600" />
                    <span>Vendor: {req.attachedVendor.vendorName}</span>
                  </span>
                )}
              </div>

              {/* Deliverables Checklist */}
              {req.deliverables && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {req.deliverables.map((deliv, dIdx) => (
                    <span key={dIdx} className="px-2.5 py-1 bg-linen/20 border border-espresso/10 text-espresso rounded-lg text-[10px] font-semibold">
                      ✓ {deliv}
                    </span>
                  ))}
                </div>
              )}

              {/* Who will manage this selector */}
              <div className="pt-3 border-t border-espresso/10 space-y-2">
                <span className="text-[10px] font-bold text-espresso uppercase tracking-wider block">
                  Who will manage this?
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  
                  {/* Option 1: Brand / Agency / Business Owner */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.CLIENT_HANDLES)}
                    className={`p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.CLIENT_HANDLES
                        ? 'bg-espresso text-gold border-espresso shadow-xs'
                        : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                    }`}
                  >
                    <UserCheck size={15} />
                    <span className="text-[11px] leading-tight">Brand / Agency Will Manage</span>
                  </button>

                  {/* Option 2: Use Ziggers Execute (Only for direct services) */}
                  {req.canZiggersExecute ? (
                    <button
                      type="button"
                      onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.ZIGGERS_EXECUTE)}
                      className={`p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        currentMode === FULFILLMENT_MODES.ZIGGERS_EXECUTE
                          ? 'bg-espresso text-gold border-espresso shadow-xs'
                          : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                      }`}
                    >
                      <ShieldCheck size={15} className="text-gold" />
                      <span className="text-[11px] leading-tight">Use Ziggers Execute</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.EXISTING_VENDOR)}
                      className={`p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        currentMode === FULFILLMENT_MODES.EXISTING_VENDOR
                          ? 'bg-espresso text-gold border-espresso shadow-xs'
                          : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                      }`}
                    >
                      <Building2 size={15} />
                      <span className="text-[11px] leading-tight">
                        {req.attachedVendor ? 'Edit Vendor' : 'Existing Agency / Vendor'}
                      </span>
                    </button>
                  )}

                  {/* Option 3: Find a Ziggers Partner */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.ZIGGERS_PARTNER)}
                    className={`p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.ZIGGERS_PARTNER
                        ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold'
                        : 'bg-gold/10 border-gold/40 text-espresso hover:bg-gold/20'
                    }`}
                  >
                    <Sparkles size={15} className="text-gold" />
                    <span className="text-[11px] leading-tight">
                      {req.attachedPartner ? 'Change Partner' : 'Find a Ziggers Partner'}
                    </span>
                  </button>

                  {/* Option 4: Not Required */}
                  <button
                    type="button"
                    onClick={() => handleSetFulfillment(req.id, FULFILLMENT_MODES.NOT_REQUIRED)}
                    className={`p-3 rounded-2xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      currentMode === FULFILLMENT_MODES.NOT_REQUIRED
                        ? 'bg-muted/40 text-espresso border-espresso/30 line-through'
                        : 'bg-linen/10 border-espresso/10 text-muted hover:bg-linen/30'
                    }`}
                  >
                    <span className="text-[11px] leading-tight">Not Required</span>
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
