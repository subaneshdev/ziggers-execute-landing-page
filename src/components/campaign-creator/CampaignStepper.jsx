"use client";
import React from 'react';
import { Check } from 'lucide-react';

export default function CampaignStepper({ currentStep, steps, onStepClick }) {
  return (
    <div className="w-full">
      {/* Desktop Stepper Bar */}
      <div className="hidden lg:flex items-center justify-between relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-espresso/10 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-gold -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick && onStepClick(stepNum)}
              disabled={stepNum > currentStep + 1}
              className={`relative z-10 flex flex-col items-center group cursor-pointer disabled:cursor-not-allowed transition-all ${
                isCurrent ? 'scale-105' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-gold text-espresso border-2 border-gold'
                    : isCurrent
                    ? 'bg-espresso text-gold border-2 border-gold ring-4 ring-gold/20'
                    : 'bg-white text-muted border-2 border-espresso/15 group-hover:border-espresso/40'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNum}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-bold tracking-tight whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-espresso font-extrabold'
                    : isCompleted
                    ? 'text-espresso/80'
                    : 'text-muted'
                }`}
              >
                {step.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Stepper */}
      <div className="lg:hidden flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Step {currentStep} of {steps.length}
          </span>
          <h2 className="text-sm font-black text-espresso tracking-tight">
            {steps[currentStep - 1]?.name}
          </h2>
        </div>
        <div className="w-32 bg-espresso/10 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gold h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
