import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Activity, CheckCircle, ArrowRight, BarChart2, Zap, Lock } from 'lucide-react';

export const metadata = {
  title: "Ziggers Execute | India's On-Ground Marketing Execution Platform",
  description: "The Operating System for Offline Marketing. Book, track, and audit on-ground marketing, product sampling, and retail activation campaigns across India with real-time GPS footprints.",
  alternates: {
    canonical: '/',
  }
};

export default function HomePage() {
  const faqs = [
    {
      q: "What is Ziggers Execute?",
      a: "Ziggers Execute is an on-ground marketing execution platform (the operating system for offline marketing). We provide the digital and physical infrastructure for brands and agencies to deploy product sampling, retail activations, store audits, and promotional campaigns anywhere in India."
    },
    {
      q: "How does Ziggers Execute guarantee field operations quality?",
      a: "Unlike traditional agencies or staffing providers, Ziggers Execute uses real-time GPS auditing, geofenced photo check-ins, and double-key KYC checks (Aadhaar & PAN biometric). Every piece of visual audit data is cryptographically timestamped and geofenced to eliminate fraudulent reporting."
    },
    {
      q: "How does the escrow payment model protect my campaign budget?",
      a: "Campaign payouts are held in a secure escrow account and released only when target parameters (e.g. verified audits, logged hours, completed sampling distributions) are mathematically verified by the platform dashboard."
    }
  ];

  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://execute.ziggers.in/#website",
        "url": "https://execute.ziggers.in/",
        "name": "Ziggers Execute"
      },
      {
        "@type": "FAQPage",
        "@id": "https://execute.ziggers.in/#faq",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <div className="relative overflow-hidden bg-white pt-24 pb-20">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-linen px-4 py-1.5 rounded-full text-xs font-bold text-muted uppercase tracking-wider mb-8">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            Now Live Across 8 Major Metro Hubs
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-espresso tracking-tight leading-tight max-w-4xl mb-6">
            Brands create campaigns. Agencies create ideas. <span className="text-gold">Ziggers Execute makes them happen.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed font-medium">
            The Operating System for Offline Marketing. Deploy retail activations, direct product sampling, and experiential roadshows with real-time GPS tracking and geofenced audits.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-20">
            <Link href="/contact" className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:translate-y-[-1px] text-base decoration-transparent">
              <span>Book Demo & Audit</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/solutions/retail-activation" className="flex items-center justify-center border-1.5 border-espresso/15 hover:border-espresso text-espresso font-bold px-8 py-4 rounded-full transition-all text-base decoration-transparent">
              Explore Solutions
            </Link>
          </div>

          {/* Interactive B2B Dashboard Mockup (Stripe-Style Visualization) */}
          <div className="w-full max-w-5xl bg-espresso rounded-3xl p-4 md:p-6 shadow-strong border border-linen/10 text-left overflow-hidden">
            <div className="flex items-center justify-between border-b border-linen/15 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
                <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-xs font-mono text-linen/40 ml-4">ZIGGERS_EXECUTE_OPS_CONSOLE v1.0.4</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-gold/15 text-gold font-bold px-3 py-1 rounded-md">LIVE MAP VIEW</span>
                <span className="bg-linen/5 text-linen/60 px-3 py-1 rounded-md hidden md:inline">AUDIT_LOG_STREAM</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Map & heatmaps pane */}
              <div className="col-span-2 bg-[#2E2016] rounded-2xl p-4 min-h-[300px] border border-linen/5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: "url('/assets/play-store-listing.png')" }}></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Field Network</h3>
                    <p className="text-xs text-linen/50 mt-0.5">Live GPS coordinate footprints</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-green-500/25 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                      <span className="h-1 w-1 bg-green-400 rounded-full animate-ping"></span> 1,240 Active
                    </span>
                  </div>
                </div>

                {/* Map Mockup pins */}
                <div className="relative h-40 w-full flex items-center justify-center">
                  <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                    <MapPin size={24} className="text-gold animate-bounce" />
                    <span className="text-[9px] font-mono bg-espresso text-white px-1.5 py-0.5 rounded-md border border-linen/10">Chennai Hub</span>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                    <MapPin size={24} className="text-gold animate-bounce" />
                    <span className="text-[9px] font-mono bg-espresso text-white px-1.5 py-0.5 rounded-md border border-linen/10">Mumbai Hub</span>
                  </div>
                  <div className="absolute top-1/2 right-1/2 flex flex-col items-center">
                    <MapPin size={24} className="text-gold animate-bounce" />
                    <span className="text-[9px] font-mono bg-espresso text-white px-1.5 py-0.5 rounded-md border border-linen/10">Bangalore Hub</span>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-2 text-xs text-white">
                  <div className="bg-espresso/50 border border-linen/10 p-2.5 rounded-xl">
                    <span className="text-linen/40 uppercase text-[9px] font-bold block">Compliance</span>
                    <span className="text-sm font-extrabold text-green-400">99.2%</span>
                  </div>
                  <div className="bg-espresso/50 border border-linen/10 p-2.5 rounded-xl">
                    <span className="text-linen/40 uppercase text-[9px] font-bold block">Campaigns</span>
                    <span className="text-sm font-extrabold text-gold">48 Active</span>
                  </div>
                  <div className="bg-espresso/50 border border-linen/10 p-2.5 rounded-xl">
                    <span className="text-linen/40 uppercase text-[9px] font-bold block">Audit Photos</span>
                    <span className="text-sm font-extrabold text-white">12K / hr</span>
                  </div>
                </div>
              </div>

              {/* Log stream pane */}
              <div className="bg-[#2E2016] rounded-2xl p-4 border border-linen/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Audit Log Stream</h3>
                  <p className="text-xs text-linen/50 mt-0.5">Real-time campaigns check-ins</p>
                </div>

                <div className="flex flex-col gap-3 my-4 font-mono text-[10px] text-linen/70">
                  <div className="flex items-start gap-2 bg-espresso/30 p-2 rounded-lg border border-linen/5">
                    <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-bold">Audit Completed</span> - P&G Sampling
                      <span className="block text-linen/40 mt-0.5">OMR Hub, Chennai @ 14:02:11</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-espresso/30 p-2 rounded-lg border border-linen/5">
                    <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-bold">Check-in Verified</span> - ITC Shelf Audit
                      <span className="block text-linen/40 mt-0.5">Phoenix Mall, Bangalore @ 14:01:45</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-espresso/30 p-2 rounded-lg border border-linen/5">
                    <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-bold">GPS Match Confirm</span> - Boat Roadshow
                      <span className="block text-linen/40 mt-0.5">Nariman Point, Mumbai @ 14:00:52</span>
                    </div>
                  </div>
                </div>

                <div className="bg-espresso/50 border border-linen/10 p-3 rounded-xl flex items-center justify-between text-xs text-white">
                  <span>Audit Escrow Wallet</span>
                  <span className="font-extrabold text-gold">₹4,82,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (Why Ziggers) */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-xl mx-auto mb-16 md:mb-24">
            <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Engineered for Scale</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-espresso tracking-tight mt-2">
              Infrastructure to replace the traditional BTL agency
            </h2>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              We replace opaque reporting and manual operations sheets with clean digital verification loops and direct field networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-linen/40 border border-espresso/5 rounded-3xl p-8 hover:bg-linen/60 transition-colors">
              <div className="w-12 h-12 bg-espresso text-gold rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-espresso mb-3">KYC Field Workforce</h3>
              <p className="text-sm text-muted leading-relaxed">
                Every field promoter, auditor, and campaigner completes digital identity checks (Aadhaar & PAN biometrics) to ensure complete operational compliance and accountability.
              </p>
            </div>

            <div className="bg-linen/40 border border-espresso/5 rounded-3xl p-8 hover:bg-linen/60 transition-colors">
              <div className="w-12 h-12 bg-espresso text-gold rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-espresso mb-3">Live GPS Verification</h3>
              <p className="text-sm text-muted leading-relaxed">
                Track footprints, path histories, and check-in timelines directly from the campaigns console. Geofenced visual uploads ensure absolute compliance in real-time.
              </p>
            </div>

            <div className="bg-linen/40 border border-espresso/5 rounded-3xl p-8 hover:bg-linen/60 transition-colors">
              <div className="w-12 h-12 bg-espresso text-gold rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-espresso mb-3">Escrow Budgets protection</h3>
              <p className="text-sm text-muted leading-relaxed">
                Payments are securely locked in escrow beforehand and disbursed to field partners only when audit timelines and targets are mathematically verified on-site.
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise Callout / Trust stats */}
        <section className="bg-light-gray py-20 border-y border-espresso/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-4xl font-extrabold text-espresso">10M+</span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mt-2">Samples Distributed</p>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-espresso">8+</span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mt-2">Major Metro Hubs</p>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-espresso">99.8%</span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mt-2">Audit Compliance</p>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-espresso">15 Min</span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mt-2">Average Dispatch Net</p>
            </div>
          </div>
        </section>

        {/* Home FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold tracking-widest text-gold uppercase">FAQ</span>
            <h2 className="text-3xl font-extrabold text-espresso tracking-tight mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-linen/25 border border-espresso/5 rounded-2xl p-6">
                <h3 className="text-base font-bold text-espresso mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action footer banner */}
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <div className="bg-espresso text-white rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 relative z-10">
              Ready to execute campaigns at scale?
            </h2>
            <p className="text-sm text-linen/75 max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
              Book a live campaigns console walkthrough and see how our real-time GPS tracking and audited field operations deliver offline execution.
            </p>
            <div className="relative z-10 flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all decoration-transparent">
                <span>Request Custom Pilot</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
