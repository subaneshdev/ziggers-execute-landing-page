"use client";
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [campaignType, setCampaignType] = useState('Product Sampling Trial');
  const [targetCities, setTargetCities] = useState('Chennai, Bangalore, Mumbai');
  const [briefDetails, setBriefDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          campaignType,
          targetCities,
          briefDetails
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit brief. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to Supabase Edge Function.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-linen/25 border border-espresso/5 rounded-3xl p-8 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-espresso">Brief Transmitted to Edge Console</h2>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Your campaign requirements have been saved to Supabase and routed to our regional operations coordinators. We will reach out with a feasibility audit within 2 hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setName('');
            setCompany('');
            setEmail('');
            setBriefDetails('');
          }}
          className="bg-espresso text-white font-bold px-6 py-2.5 rounded-full text-xs hover:bg-muted transition-colors cursor-pointer"
        >
          Submit Another Brief
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linen/25 border border-espresso/5 rounded-3xl p-8">
      <h2 className="text-lg font-extrabold text-espresso mb-6">Submit Campaign Brief</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-espresso uppercase text-[10px]">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Aditya Nair" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso text-xs" 
              required 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-espresso uppercase text-[10px]">Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. FMCG Brand Ltd" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso text-xs" 
              required 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-espresso uppercase text-[10px]">Work Email</label>
          <input 
            type="email" 
            placeholder="aditya@brand.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso text-xs" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-espresso uppercase text-[10px]">Campaign Type</label>
          <select 
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value)}
            className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso text-xs" 
            required
          >
            <option>Product Sampling Trial</option>
            <option>Retail Store Audit / POSM</option>
            <option>Experiential Van Roadshow</option>
            <option>Fintech Merchant Acquisition</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-espresso uppercase text-[10px]">Target Cities</label>
          <input 
            type="text" 
            placeholder="Chennai, Bangalore, Mumbai" 
            value={targetCities}
            onChange={(e) => setTargetCities(e.target.value)}
            className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso text-xs" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-espresso uppercase text-[10px]">Campaign Brief Details</label>
          <textarea 
            rows="4" 
            placeholder="Describe your target headcount, timeline, and audit check parameters..." 
            value={briefDetails}
            onChange={(e) => setBriefDetails(e.target.value)}
            className="bg-white border border-espresso/10 rounded-xl p-4 focus:outline-none focus:border-gold text-espresso text-xs" 
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center justify-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold py-3.5 rounded-full shadow-md transition-all mt-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Transmitting Brief to Edge...</span>
            </>
          ) : (
            <>
              <span>Submit Campaign Brief</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
