import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Sparkles, Building2, Lock, Landmark, Check } from 'lucide-react';

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
      badge: 'Single Hub Starter',
      price: '₹1.5L',
      period: '/ campaign base',
      desc: 'Perfect for launching single-city product sampling or localized retail verification drives.',
      isPopular: false,
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
      badge: 'Most Popular',
      price: 'Custom',
      period: 'performance-based',
      desc: 'For multi-city campaigns, retail visual activations, and ongoing shelf space audits.',
      isPopular: true,
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

  const escrowGuarantees = [
    { icon: <Lock size={16} className="text-gold" />, label: '100% Escrow Protected', desc: 'Zero unverified agency prepayments' },
    { icon: <Landmark size={16} className="text-gold" />, label: 'Daily Bank Disbursements', desc: 'Same-day payout upon supervisor sign-off' },
    { icon: <Check size={16} className="text-gold" />, label: 'Automated GST Compliance', desc: 'E-invoices and input tax credit generated' }
  ];

  return (
    <div className="relative overflow-hidden bg-[#faf9f6] pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Page Header */}
        <header className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-espresso text-[11px] font-extrabold uppercase tracking-wider mb-4">
            <Sparkles size={12} className="text-gold" />
            <span>Operational Budgets & Transparency</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-espresso tracking-tight leading-tight mt-1 mb-4 font-display">
            Performance-Based Campaign Escrow Pricing
          </h1>
          <p className="text-sm md:text-base text-muted leading-relaxed font-body">
            No fixed agency fees, no hidden management premiums. Fund your campaign escrow, specify target metrics, and release capital only for verified physical outputs.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`bg-white border rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                tier.isPopular 
                  ? 'border-gold/50 shadow-md ring-1 ring-gold/20 relative' 
                  : 'border-espresso/10 hover:border-espresso/20 shadow-2xs'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 right-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-espresso font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs">
                    <Sparkles size={11} />
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                {!tier.isPopular && (
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl font-black text-espresso mb-1 font-display">{tier.name}</h3>
                <p className="text-xs text-muted mb-6 leading-relaxed min-h-[36px]">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl font-black text-espresso font-mono">{tier.price}</span>
                  <span className="text-xs text-muted font-bold">{tier.period}</span>
                </div>
                
                <hr className="border-espresso/5 mb-6" />
                
                <ul className="flex flex-col gap-3.5 text-xs text-espresso/85 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={tier.href} 
                className={`h-12 w-full flex items-center justify-center gap-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer decoration-transparent ${
                  tier.isPopular
                    ? 'bg-espresso hover:bg-muted text-white'
                    : 'bg-linen/60 hover:bg-linen text-espresso border border-espresso/15'
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight size={14} className={tier.isPopular ? "text-gold" : "text-espresso"} />
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantees Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
          {escrowGuarantees.map((item, idx) => (
            <div key={idx} className="bg-white border border-espresso/10 rounded-2xl p-4.5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-espresso">{item.label}</h4>
                <p className="text-[11px] text-muted leading-tight mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust block */}
        <div className="bg-white border border-espresso/10 rounded-3xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-14 h-14 bg-espresso text-gold rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
            <Shield size={26} />
          </div>
          <div>
            <h4 className="text-sm font-black text-espresso mb-1">Escrow Campaign Protections</h4>
            <p className="text-xs text-muted leading-relaxed">
              Budgets are held in custom bank escrows. Funds are released automatically only after campaign promoter logs, geofenced photos, and active GPS operational logs match the criteria set in your project dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
