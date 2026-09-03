"use client";
import React, { useState } from 'react';
import { 
  X, Check, Sparkles, Star, ShieldCheck, Clock, MapPin, 
  ArrowRight, Phone, Send, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { VERIFIED_PARTNER_DIRECTORY, PARTNER_CATEGORIES } from '@/lib/ecosystem/btlTaxonomy';

export default function PartnerMatchModal({ 
  isOpen, 
  onClose, 
  requirement, 
  city = 'Chennai', 
  onSelectPartner 
}) {
  if (!isOpen || !requirement) return null;

  const category = PARTNER_CATEGORIES[requirement.category] || {
    title: 'Specialist Partner',
    icon: '🤝',
    description: 'Verified BTL ecosystem provider.'
  };

  const matchedPartners = VERIFIED_PARTNER_DIRECTORY.filter(p => 
    p.category === requirement.category && 
    (p.city === city || (p.supportedCities && p.supportedCities.includes(city)))
  );

  const [selectedPartnerId, setSelectedPartnerId] = useState(matchedPartners[0]?.id || null);
  const [customBrief, setCustomBrief] = useState('');

  const handleConfirm = () => {
    const chosen = matchedPartners.find(p => p.id === selectedPartnerId) || matchedPartners[0] || {
      id: 'CUSTOM_MATCH_REQUEST',
      name: `Ziggers Verified ${category.title} Partner`,
      rating: 4.9,
      city
    };

    onSelectPartner({
      partnerId: chosen.id,
      partnerName: chosen.name,
      category: requirement.category,
      city: chosen.city || city,
      contactPerson: chosen.contactPerson || 'Ziggers Partner Desk',
      rating: chosen.rating || 4.9,
      customBrief
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-espresso/15 rounded-3xl max-w-2xl w-full shadow-2xl p-5 sm:p-7 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-espresso text-gold flex items-center justify-center text-lg shadow-xs">
              {category.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                  Ziggers Partner Network Matching
                </span>
                <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                  <ShieldCheck size={11} />
                  <span>Verified BTL Partner</span>
                </span>
              </div>
              <h3 className="text-base font-black text-espresso tracking-tight font-serif">
                {requirement.title}
              </h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-muted hover:text-espresso hover:bg-linen/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Requirement Context Box */}
        <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-espresso">Scope of Work:</span>
            <span className="font-mono text-[11px] text-gold bg-espresso px-2 py-0.5 rounded-md">
              Target City: {city}
            </span>
          </div>
          <p className="text-muted leading-relaxed">
            {requirement.desc}
          </p>

          {requirement.requiredDeliverables && (
            <div className="pt-2 border-t border-espresso/10 space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase block">Key Deliverables:</span>
              <div className="flex flex-wrap gap-1.5">
                {requirement.requiredDeliverables.map((deliv, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-espresso/10 text-espresso rounded-md text-[10px] font-semibold">
                    ✓ {deliv}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Matched Verified Partners List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-espresso uppercase tracking-wider">
              Matched Verified Partners in {city} ({matchedPartners.length})
            </h4>
            <span className="text-[10px] font-mono text-muted">
              Estimated Budget: {requirement.estimatedBudgetRange || 'Standard Market Rates'}
            </span>
          </div>

          {matchedPartners.length === 0 ? (
            <div className="p-5 text-center bg-linen/20 border border-espresso/10 rounded-2xl space-y-1 text-xs">
              <Sparkles size={20} className="mx-auto text-gold" />
              <strong className="text-espresso block">Ziggers Partner Match Engine</strong>
              <p className="text-muted text-[11px]">
                We will match this requirement with a verified {category.title} partner in {city} within 2 business hours.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {matchedPartners.map((partner) => {
                const isSelected = selectedPartnerId === partner.id;
                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40' 
                        : 'bg-white border-espresso/10 hover:border-gold/50 text-espresso'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black block">{partner.name}</strong>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            isSelected ? 'bg-linen/20 text-gold' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span>{partner.rating} ({partner.reviewsCount} jobs)</span>
                          </span>
                        </div>

                        <div className={`text-[11px] flex items-center gap-2 ${isSelected ? 'text-linen/70' : 'text-muted'}`}>
                          <span>📍 {partner.city}</span>
                          <span>•</span>
                          <span>⚡ {partner.turnaroundDays} Day SLA</span>
                          <span>•</span>
                          <span>👤 {partner.contactPerson}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {partner.specialties.map(spec => (
                            <span key={spec} className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                              isSelected ? 'bg-linen/10 text-gold' : 'bg-linen/40 text-espresso'
                            }`}>
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-gold border-gold text-espresso' : 'border-espresso/20 bg-white text-transparent'
                        }`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Instructions / Deliverable Notes */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-espresso block">
            Custom Deliverable Notes & Instructions <span className="text-muted font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={customBrief}
            onChange={(e) => setCustomBrief(e.target.value)}
            placeholder="e.g. Dimensions must be 10x8ft, delivery required on Friday morning before 8 AM..."
            className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-3 text-xs text-espresso placeholder:text-muted/50 focus:outline-none focus:border-gold font-medium"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-espresso/10">
          <span className="text-[11px] text-muted">
            Partner billing and SLA coordination are tracked inside your Ziggers campaign.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-espresso/15 text-xs font-bold text-espresso hover:bg-linen/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Confirm Partner</span>
              <ArrowRight size={14} className="text-gold" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
