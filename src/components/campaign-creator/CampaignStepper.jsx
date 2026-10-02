"use client";
import React from 'react';
export default function CampaignStepper({ currentStep, steps, onStepClick }) {
  return (
    <nav aria-label="Campaign setup progress" className="space-y-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="font-semibold">Step {currentStep} of {steps.length} <span className="text-muted font-normal">· {currentStep <= 3 ? 'Define your campaign' : currentStep <= 5 ? 'Choose your audience and places' : currentStep <= 8 ? 'Organize execution' : 'Review your campaign'}</span></p>
        <span className="shrink-0 text-muted">{Math.round(currentStep / steps.length * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-espresso/10 overflow-hidden" aria-hidden="true">
        <div className="h-full bg-gold transition-all" style={{ width: `${currentStep / steps.length * 100}%` }} />
      </div>
      <ol className="flex xl:grid xl:grid-cols-10 gap-2 overflow-x-auto xl:overflow-visible pb-2 snap-x">
        {steps.map((step, index) => {
          const number = index + 1;
          return (
            <li key={step.id} className="shrink-0 min-w-0 snap-start">
              <button type="button" aria-current={number === currentStep ? 'step' : undefined}
                onClick={() => onStepClick?.(number)}
                className={`min-h-11 xl:min-h-16 xl:w-full rounded-xl px-3 xl:px-2 py-2 text-sm xl:text-xs font-semibold transition-colors ${number === currentStep ? 'bg-espresso text-white' : 'bg-linen/40 text-muted hover:bg-linen'}`}>
                <span className="mr-2 xl:mr-0 xl:block xl:mb-1 opacity-70">{number.toString().padStart(2, '0')}</span>{step.name.replace(/^\d+\. /, '')}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
