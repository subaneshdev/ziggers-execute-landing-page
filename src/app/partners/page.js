import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, Zap, Globe } from 'lucide-react';

export const metadata = {
  title: 'Partner Program | Ziggers Execute',
  description: 'Become a certified field operations or creative agency partner. Monetize campaigns, optimize local logistics, and leverage verified execution infrastructure in India.',
  alternates: {
    canonical: '/partners',
  }
};

export default function PartnersPage() {
  const programs = [
    {
      name: 'Agency Partners',
      desc: 'For creative, advertising, and BTL marketing agencies looking for execution infrastructure.',
      benefits: [
        'Plug Ziggers Execute into your client pitches',
        'Transparent client dashboards with white-labeled reports',
        'Dedicated account operations coordinators',
        'Volume-based escrow pricing discounts'
      ]
    },
    {
      name: 'Field Operations Partners',
      desc: 'For local logistics providers, regional networks, and local manpower controllers.',
      benefits: [
        'Continuous campaign contracts across metro hubs',
        'Guaranteed same-day bank disbursements via escrow',
        'Operational control apps with biometric KYC checkouts',
        'Direct connection to major national enterprise brands'
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <header className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Collaboration Ecosystem</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
            Scale Offline Execution Together
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Partner with India\'s on-ground marketing execution platform. Leverage our real-time GPS tracking and KYC-verified workforce infrastructure to scale campaigns.
          </p>
        </header>

        {/* Partners Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {programs.map((prog) => (
            <div key={prog.name} className="bg-linen/25 border border-espresso/5 rounded-3xl p-8 flex flex-col justify-between hover:bg-linen/40 transition-colors">
              <div>
                <h3 className="text-lg font-extrabold text-espresso mb-2">{prog.name}</h3>
                <p className="text-xs text-muted mb-6 leading-relaxed">{prog.desc}</p>
                <hr className="border-espresso/5 mb-8" />
                <ul className="flex flex-col gap-4 text-xs text-espresso/80 mb-8">
                  {prog.benefits.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="flex items-center justify-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold py-3.5 rounded-full text-sm shadow-md transition-all decoration-transparent">
                <span>Join Partner Program</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
