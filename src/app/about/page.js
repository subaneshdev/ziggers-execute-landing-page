import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldAlert, Settings, Network } from 'lucide-react';

export const metadata = {
  title: 'About Infrastructure & Tech | Ziggers Execute',
  description: 'Learn about the technology and operational networks behind Ziggers Execute. The operating system that drives offline campaign execution and retail merchandising across India.',
  alternates: {
    canonical: '/about',
  }
};

export default function AboutPage() {
  const pillars = [
    {
      title: 'Digital Routing & Dispatches',
      desc: 'Our matching engines connect campaigns to background-checked local field teams in under 15 minutes, routing personnel based on distance and performance history.',
      icon: <Network size={20} />
    },
    {
      title: 'Verification & Geofencing',
      desc: 'Tamper-proof metadata checks block camera-roll uploads. Promoters upload live geofenced photo logs directly on location to verify display installations or sampling handovers.',
      icon: <Settings size={20} />
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <header className="mb-16">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Technology & Infrastructure</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
            The Infrastructure Behind Offline Marketing Execution
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            We believe offline marketing campaigns should be backed by the same precision, reliability, and real-time verification as digital advertising. Ziggers Execute builds the operational engines to make on-ground activations transparent and scalable.
          </p>
        </header>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {pillars.map((pil) => (
            <div key={pil.title} className="bg-linen/25 border border-espresso/5 rounded-3xl p-8 hover:bg-linen/40 transition-colors">
              <div className="w-10 h-10 bg-espresso text-gold rounded-xl flex items-center justify-center mb-6 shadow-sm">
                {pil.icon}
              </div>
              <h3 className="text-lg font-extrabold text-espresso mb-3">{pil.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{pil.desc}</p>
            </div>
          ))}
        </div>

        {/* Corporate Trust Block */}
        <div className="bg-linen/30 border border-espresso/5 rounded-3xl p-8 mb-16">
          <h2 className="text-xl font-extrabold text-espresso mb-4">Corporate Governance</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Ziggers Execute is a specialized enterprise vertical operated under Ziggers. We partner with creative agencies, logistics providers, and corporate clients to manage retail campaigns under clear compliance, background checkouts, and escrow deposit safety.
          </p>
          <div className="flex gap-4">
            <span className="text-xs font-bold text-espresso bg-linen px-3.5 py-1.5 rounded-full border border-espresso/5">Parent Company: Ziggers</span>
            <span className="text-xs font-bold text-espresso bg-linen px-3.5 py-1.5 rounded-full border border-espresso/5">Venture division: Unfounded</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-espresso text-white rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 relative z-10">Deploy audited on-ground operations</h3>
          <p className="text-xs text-linen/70 max-w-md mx-auto mb-6 relative z-10 leading-normal">
            Discuss your retail and sampling campaign requirements with our operations heads.
          </p>
          <div className="relative z-10 flex gap-4 justify-center">
            <Link href="/contact" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-6 py-3 rounded-full text-sm decoration-transparent">
              <span>Contact Operations Head</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
