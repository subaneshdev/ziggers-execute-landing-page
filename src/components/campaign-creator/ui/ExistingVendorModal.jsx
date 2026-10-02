"use client";
import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, FileText, Check, ArrowRight } from 'lucide-react';

export default function ExistingVendorModal({ isOpen, onClose, requirement, onSaveVendor }) {
  const [vendorName, setVendorName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  if (!isOpen || !requirement) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    onSaveVendor({
      vendorName: vendorName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      category: requirement.category
    });
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Existing vendor details" className="fixed inset-0 bg-espresso/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-espresso/15 rounded-3xl max-w-lg w-full shadow-2xl p-5 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-espresso text-gold flex items-center justify-center shadow-xs">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Existing Agency / Vendor Coordination
              </span>
              <h3 className="text-base font-black text-espresso tracking-tight font-serif">
                {requirement.title}
              </h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} aria-label="Close dialog"
            className="p-1.5 rounded-xl text-muted hover:text-espresso hover:bg-linen/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Provide your existing vendor&apos;s details so our field coordinators can synchronize delivery schedules and venue access directly on-ground.
        </p>

        {/* Vendor Form */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-espresso block">
              Agency / Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. Acme Fabrications Pvt Ltd, Ogilvy Studio"
              className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-espresso block">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-espresso block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-espresso block">Email Address <span className="text-muted font-normal">(Optional)</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@vendor.com"
              className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-espresso block">Delivery Instructions / Material Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Vendor will deliver booth setup to venue on Friday 7:00 AM directly..."
              className="w-full bg-linen/25 border border-espresso/15 rounded-xl p-3 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-espresso/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-espresso/15 text-xs font-bold text-espresso hover:bg-linen/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-espresso hover:bg-muted text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check size={13} className="text-gold" />
              <span>Attach Vendor</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
