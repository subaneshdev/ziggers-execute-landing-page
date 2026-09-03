'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    legalBusinessName: '',
    tradeName: '',
    businessType: 'PVT_LTD',
    gstin: '',
    pan: '',
    msmeRegistrationNo: '',
    contactEmail: '',
    contactPhone: '',
    addressLine1: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    categories: ['MANPOWER', 'PRINTING'],
    serviceableCities: ['Chennai']
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCategoryToggle = (cat) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Partner Application Submitted</h2>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Status: Under Verification Review
          </div>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Thank you, <span className="text-white font-medium">{formData.legalBusinessName || 'Partner'}</span>. Your GSTIN ({formData.gstin || 'Provided'}) and business KYC documents have been queued for compliance verification.
          </p>
          <Link
            href="/vendor/dashboard"
            className="block w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center transition"
          >
            Go to Vendor Partner Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Ziggers Supply Partner Network</span>
            <h1 className="text-2xl font-bold text-white mt-1">Vendor Partner Onboarding & KYC</h1>
          </div>
          <Link href="/vendor" className="text-xs text-slate-400 hover:text-slate-200">
            ← Back to Portal
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
          {/* Section 1: Business Identity */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
              Legal Entity & Business Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Legal Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Print & Media Pvt Ltd"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  value={formData.legalBusinessName}
                  onChange={e => setFormData({ ...formData, legalBusinessName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Business Constitution *</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  value={formData.businessType}
                  onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="PVT_LTD">Private Limited (Pvt Ltd)</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="PARTNERSHIP">Partnership Firm</option>
                  <option value="PROPRIETORSHIP">Sole Proprietorship</option>
                  <option value="INDIVIDUAL_FREELANCER">Individual / Contractor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  placeholder="33AAAAA0000A1Z5"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                  value={formData.gstin}
                  onChange={e => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company PAN *</label>
                <input
                  type="text"
                  required
                  placeholder="ABCDE1234F"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                  value={formData.pan}
                  onChange={e => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Capabilities */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
              Execution Capabilities & Service Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'MANPOWER', label: 'Field Manpower & Promoters', icon: '👥' },
                { id: 'PRINTING', label: 'Printing & POSM Materials', icon: '🖨️' },
                { id: 'FABRICATION', label: 'Stall & Kiosk Fabrication', icon: '🎪' },
                { id: 'LOGISTICS', label: '3PL & Warehouse Logistics', icon: '🚚' },
                { id: 'AV_PRODUCTION', label: 'Sound, Stage & AV Rental', icon: '🔊' },
                { id: 'VENUE_PERMISSION', label: 'Liaison & Police NOCs', icon: '🏛️' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition flex flex-col gap-1.5 ${
                    formData.categories.includes(cat.id)
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Bank Settlement Details */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">3</span>
              Bank Account for Escrow Settlement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="As per bank records"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  value={formData.bankAccountHolder}
                  onChange={e => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Bank Account Number *</label>
                <input
                  type="password"
                  required
                  placeholder="000000000000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                  value={formData.bankAccountNumber}
                  onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="HDFC0001234"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                  value={formData.bankIfscCode}
                  onChange={e => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Operating City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Bangalore"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Official verification will be processed within 24-48 business hours.
            </span>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
            >
              Submit Partner KYC →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
