import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const metadata = {
  title: 'Campaign Pricing | Ziggers Execute',
  description: 'Performance-based, secure escrow pricing models for brand activations, product sampling, and retail visual audits across India. Zero payment delay guarantees.',
  alternates: {
    canonical: '/pricing',
  }
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Pilot Campaign',
      price: '₹1.5L',
      period: '/ campaign base',
      desc: 'Perfect for launching single-city product sampling or local store audits.',
      features: [
        'Single City Operations Hub Access',
        'Up to 2,000 Sample Handover Logs',
        'Real-time GPS Tracking Console',
        'Geofenced Audit Photo Verification',
        'Basic Dashboard Reporting PDF'
      ],
      cta: 'Book Custom Pilot',
      href: '/contact'
    },
    {
      name: 'Scale Execution',
      price: 'Custom',
      period: 'performance-based',
      desc: 'For multi-city campaigns, retail visual activations, and ongoing shelf space audits.',
      features: [
        '8 Metro Operations Hub Access',
        'Unlimited Product Sampling Logs',
        'Planogram Audit API Integration',
        'Custom Standby Dispatch Net (10-Min)',
        'Biometric Aadhaar KYC Field Audits',
        'Custom Campaign Dashboard Console'
      ],
      cta: 'Request Enterprise Proposal',
      href: '/contact'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <header className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Operational Budgets</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
            Performance-Based Campaign Escrow Pricing
          </h1>
          <p className="text-base text-muted leading-relaxed">
            No fixed agency fees, no hidden management premiums. Fund your campaign escrow, specify target metrics, and pay only for verified physical outputs.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-linen/25 border border-espresso/5 rounded-3xl p-8 flex flex-col justify-between hover:bg-linen/40 transition-colors">
              <div>
                <h3 className="text-lg font-extrabold text-espresso mb-1">{tier.name}</h3>
                <p className="text-xs text-muted mb-6">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-espresso">{tier.price}</span>
                  <span className="text-xs text-muted font-bold">{tier.period}</span>
                </div>
                <hr className="border-espresso/5 mb-8" />
                <ul className="flex flex-col gap-4 text-xs text-espresso/80 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={tier.href} className="flex items-center justify-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold py-3.5 rounded-full text-sm shadow-md transition-all decoration-transparent">
                <span>{tier.cta}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust block */}
        <div className="bg-light-gray border border-espresso/5 rounded-3xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 bg-espresso text-gold rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-espresso mb-1">Escrow Campaign Protections</h4>
            <p className="text-xs text-muted leading-relaxed">
              Budgets are held in custom bank escrows. Funds are released automatically only after campaign promoter logs, geofenced photos, and active GPS operational logs match the criteria set in your project dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
