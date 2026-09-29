import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, Zap, Globe, Building2, Users, ShieldCheck, Sparkles } from 'lucide-react';

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
      icon: <Building2 size={20} className="text-gold" />,
      badge: 'BTL & Media Agencies',
      desc: 'For creative, advertising, and experiential marketing agencies looking for turn-key execution infrastructure.',
      benefits: [
        'Plug Ziggers Execute into your client pitches with live simulation previews',
        'Transparent client dashboards with white-labeled verified reports',
        'Dedicated account operations coordinators across Chennai, Bangalore & Mumbai',
        'Volume-based escrow pricing discounts and priority deployment slots'
      ],
      cta: 'Join Agency Partner Program',
      href: '/contact'
    },
    {
      name: 'Field Operations Partners',
      icon: <Users size={20} className="text-gold" />,
      badge: 'Local Manpower & Logistics',
      desc: 'For local logistics providers, regional manpower networks, and verified field coordinators.',
      benefits: [
        'Continuous campaign contracts across primary and secondary metro hubs',
        'Guaranteed same-day bank disbursements via escrow payout waterfalls',
        'Operational control apps with biometric KYC checkouts and live geofencing',
        'Direct connection to major national FMCG, retail, and tech enterprise brands'
      ],
      cta: 'Join Field Operations Network',
      href: '/vendor/onboarding'
    }
  ];

  const steps = [
    { step: '01', title: 'KYC & GST Verification', desc: 'Submit business registration, GSTIN, and active operations hub credentials.' },
    { step: '02', title: 'Hub Integration', desc: 'Connect to our geofenced dispatch network and configure localized promoter pools.' },
    { step: '03', title: 'Live Campaign Dispatch', desc: 'Receive audited work orders with guaranteed bank escrow payment settlements.' }
  ];

  return (
    <div className="relative overflow-hidden bg-[#faf9f6] pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-espresso text-[11px] font-extrabold uppercase tracking-wider mb-4">
            <Sparkles size={12} className="text-gold" />
            <span>Collaboration Ecosystem</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-espresso tracking-tight leading-tight mt-1 mb-4 font-display">
            Scale Offline Execution Together
          </h1>
          <p className="text-sm md:text-base text-muted leading-relaxed font-body">
            Partner with India&apos;s on-ground marketing execution platform. Leverage real-time GPS tracking, biometric verification, and bank escrow infrastructure to scale campaigns seamlessly.
          </p>
        </header>

        {/* Partners Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {programs.map((prog) => (
            <div 
              key={prog.name} 
              className="bg-white border border-espresso/10 rounded-3xl p-8 flex flex-col justify-between hover:border-gold/40 hover:shadow-md transition-all duration-200 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linen border border-espresso/5 flex items-center justify-center">
                    {prog.icon}
                  </div>
                  <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider px-2.5 py-1 bg-gold/10 rounded-full border border-gold/20">
                    {prog.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-espresso mb-2 font-display">{prog.name}</h3>
                <p className="text-xs text-muted mb-6 leading-relaxed min-h-[36px]">{prog.desc}</p>
                
                <hr className="border-espresso/5 mb-6" />
                
                <ul className="flex flex-col gap-3.5 text-xs text-espresso/85 mb-8">
                  {prog.benefits.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={prog.href} 
                className="h-12 w-full flex items-center justify-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold rounded-xl text-xs shadow-xs transition-all decoration-transparent"
              >
                <span>{prog.cta}</span>
                <ArrowRight size={14} className="text-gold" />
              </Link>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto bg-white border border-espresso/10 rounded-3xl p-8 md:p-10 shadow-2xs">
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-[10px] font-black uppercase tracking-wider text-gold">Onboarding Roadmap</span>
            <h3 className="text-lg font-black text-espresso mt-1 font-display">How Partners Get Activated</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div key={st.step} className="p-4 rounded-2xl bg-linen/25 border border-espresso/5 flex flex-col gap-2">
                <span className="text-xs font-mono font-black text-gold">{st.step}</span>
                <h4 className="text-xs font-bold text-espresso">{st.title}</h4>
                <p className="text-[11px] text-muted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
