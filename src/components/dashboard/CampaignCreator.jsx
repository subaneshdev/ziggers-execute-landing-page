"use client";
import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

export default function CampaignCreator({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'New Sampling Campaign',
    objective: 'Product Sampling',
    budget: '120000',
    geography: 'Chennai Hub',
    headcount: '15'
  });

  const objectives = [
    { id: 'Product Sampling', title: 'Product Sampling', desc: 'Distribute physical samples with verified handover photo logs' },
    { id: 'Retail Activation', title: 'Retail Activation', desc: 'Deploy POSM materials and execute in-store planogram audits' },
    { id: 'Roadshows & Events', title: 'Roadshows & Events', desc: 'Mobile experiential van activations with real-time GPS tracking' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePublishClick = () => {
    onPublish({
      name: formData.name,
      objective: formData.objective,
      budget: `₹${parseInt(formData.budget).toLocaleString('en-IN')}`,
      geography: formData.geography,
      headcount: formData.headcount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-espresso/10 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-espresso">Create New Offline Campaign</h2>
            <span className="text-[10px] text-muted font-bold block uppercase tracking-wider mt-0.5">Step {step} of 3</span>
          </div>
          <button onClick={onClose} className="text-espresso hover:text-gold p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 flex-grow overflow-y-auto max-h-[400px]">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Choose Campaign Objective</h3>
              <div className="flex flex-col gap-2">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => handleInputChange('objective', obj.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-start cursor-pointer ${
                      formData.objective === obj.id 
                        ? 'border-gold bg-linen/25 shadow-sm' 
                        : 'border-espresso/10 hover:border-espresso/35'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-espresso block">{obj.title}</span>
                      <p className="text-[11px] text-muted leading-normal mt-1">{obj.desc}</p>
                    </div>
                    {formData.objective === obj.id && (
                      <div className="h-5 w-5 bg-gold text-espresso rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Campaign Name & Geography</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-espresso uppercase">Campaign Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-espresso uppercase">Select Geography Hub</label>
                  <select
                    value={formData.geography}
                    onChange={(e) => handleInputChange('geography', e.target.value)}
                    className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso"
                  >
                    <option>Chennai Hub</option>
                    <option>Bangalore Hub</option>
                    <option>Mumbai Hub</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Escrow Budget & Workforce allocation</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-espresso uppercase">Campaign Escrow Budget (INR)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso font-semibold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-espresso uppercase">Promoter Headcount Required</label>
                  <input
                    type="number"
                    value={formData.headcount}
                    onChange={(e) => handleInputChange('headcount', e.target.value)}
                    className="bg-white border border-espresso/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-espresso"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-espresso/10 bg-light-gray flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="text-xs font-bold text-espresso/70 hover:text-espresso disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Back
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-espresso hover:bg-muted text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-sm cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handlePublishClick}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-sm cursor-pointer"
            >
              Publish Campaign
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
