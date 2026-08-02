import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart2, ShieldCheck, Factory, Store, Shield } from 'lucide-react';

const INDUSTRIES_DATA = {
  'fmcg-and-d2c': {
    title: 'FMCG & D2C Offline Marketing Execution | Ziggers Execute',
    desc: 'B2B field marketing platform for FMCG and D2C brands. Deploy direct-to-consumer sampling campaigns, modern trade activations, and product seeding.',
    eyebrow: 'Fast-Moving Consumer Goods & D2C',
    h1: 'High-Speed Offline Execution for FMCG & D2C',
    intro: 'Seed your products directly into target households and trade stores. We provide the operational network and GPS-verified audits to scale direct sampling and in-store activations across India.',
    stats: [
      { val: '1.2 Mins', label: 'Average Consumer Handover Log' },
      { val: '99.5%', label: 'Campaign Handover Compliance' },
      { val: '8 Metros', label: 'Local Logistics Presence' }
    ],
    bodyParts: [
      {
        h2: 'Direct-to-Consumer Trial Pipeline',
        p: 'Deploy verified sampling campaigns outside supermarkets, retail centers, high-traffic tech parks, and residential neighborhoods. Track campaigner coordinates, check-ins, and target handovers in real-time.'
      },
      {
        h2: 'High-Impact Brand Activations',
        p: 'Scale experiential roadshows, van campaigns, and interactive mall setups. Ziggers Execute manages promoters matching, visual compliance audits, and local operations permits, keeping campaigns compliant.'
      }
    ],
    faqs: [
      { q: "How do you control leakage and waste in FMCG sampling?", a: "All product handovers are registered in the campaigners' app. Geofenced photo audits and timestamps verify exact distribution events." },
      { q: "Do you provide temperature-controlled storage?", a: "Yes. For dairy, cold brews, or food brands, we coordinate with local cold chain storage hubs in Chennai, Bangalore, and Mumbai." }
    ]
  },
  'retail-and-fashion': {
    title: 'Retail & Fashion Visual Audits & Activation | Ziggers Execute',
    desc: 'Real-time shelf intelligence, POSM audits, and visual merchandising campaigns for retail and fashion brands across India.',
    eyebrow: 'Visual Merchandising & Shelf Audits',
    h1: 'Shelf-Space Intelligence & Merchandising Compliance',
    intro: 'Ensure your brand displays are deployed perfectly. Manage POSM installation audits, planogram checks, and competitor shelf space audits with instant photo verification.',
    stats: [
      { val: '98.5%', label: 'Planogram Accuracy' },
      { val: '4.9 ★', label: 'Merchandiser Field Rating' },
      { val: '15 Mins', label: 'Audit Upload Speed' }
    ],
    bodyParts: [
      {
        h2: 'In-Store Auditing & Visual Controls',
        p: 'Field teams deploy directly to target modern trade outlets and general trade shops. They complete audits, count competitor stock displays, and upload geofenced, tamper-proof images directly to your console.'
      },
      {
        h2: 'Rapid Display & POSM Deployments',
        p: 'Deploy temporary pop-up displays, banners, standees, and signage at scale. Installers log proof-of-work images, with payout disbursements held in secure escrow until compliance is verified.'
      }
    ],
    faqs: [
      { q: "How do you prevent auditors from uploading old gallery images?", a: "The Ziggers Execute app requires native camera capture and validates the photo timestamp against GPS logs." },
      { q: "What store types do you audit?", a: "Supermarkets, hypermarkets, apparel brand stores, multi-brand lifestyle outlets, and local cosmetic shops." }
    ]
  },
  'tech-and-finance': {
    title: 'Merchant Onboarding & App Activation | Ziggers Execute',
    desc: 'B2B field operations for tech, fintech, and digital brands. Scale merchant onboarding, app download campaigns, and QR placements across major cities.',
    eyebrow: 'Fintech & App User Acquisition',
    h1: 'Merchant Acquisition & On-Ground App Activations',
    intro: 'Deploy verified field agents to onboard merchant shops, place QR code standees, and drive local app downloads. Backed by real-time GPS tracking and performance audit loops.',
    stats: [
      { val: '100% KYC', label: 'KYC Verified Field Agents' },
      { val: '8 City Hubs', label: 'On-Ground Network Presence' },
      { val: '₹0 Delays', label: 'Escrow Instant Payouts' }
    ],
    bodyParts: [
      {
        h2: 'Verified Merchant Onboarding Pipelines',
        p: 'Deploy field agents to onboard stores, audit merchant business details, place signage, and activate accounts. Track footprints and routes in real-time.'
      },
      {
        h2: 'On-Ground App Download Campaigns',
        p: 'Launch activation campaigns inside malls, high-traffic tech parks, and trade clusters. Promoters guide users to download and register, logging verification data directly to your CRM.'
      }
    ],
    faqs: [
      { q: "Are onboarding agents trained for financial compliance?", a: "Yes. All agents complete KYC verification and are certified on compliance checklists prior to field deployment." },
      { q: "Can we integrate with our onboarding API?", a: "Yes. We support custom webhooks and API integrations to sync onboarding outcomes directly to your dashboard." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: 'fmcg-and-d2c' },
    { slug: 'retail-and-fashion' },
    { slug: 'tech-and-finance' }
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = INDUSTRIES_DATA[slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.desc,
    alternates: {
      canonical: `/industries/${slug}`,
    }
  };
}

export default async function IndustryPageRoute({ params }) {
  const { slug } = await params;
  const data = INDUSTRIES_DATA[slug];
  if (!data) return null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": data.h1,
        "description": data.desc,
        "provider": {
          "@type": "Organization",
          "name": "Ziggers Execute",
          "url": "https://execute.ziggers.in"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(faq => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="relative overflow-hidden bg-white pt-32 pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-gold transition-colors decoration-transparent text-muted">Home</Link>
            <span>/</span>
            <span className="text-espresso">Industries</span>
            <span>/</span>
            <span className="text-gold">{data.h1.split(' ')[0]}</span>
          </nav>

          <header className="mb-16">
            <span className="text-xs font-extrabold tracking-widest text-gold uppercase">{data.eyebrow}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
              {data.h1}
            </h1>
            <p className="text-lg text-muted max-w-3xl leading-relaxed">
              {data.intro}
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-linen/30 border border-espresso/5 rounded-3xl p-8 mb-16 text-center">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <span className="text-3xl font-extrabold text-espresso block">{stat.val}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted mt-2 block">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Features body */}
          <div className="flex flex-col gap-12 mb-20">
            {data.bodyParts.map((part) => (
              <div key={part.h2} className="border-l-2 border-gold pl-6">
                <h2 className="text-xl font-extrabold text-espresso mb-3">{part.h2}</h2>
                <p className="text-sm text-muted leading-relaxed max-w-3xl">{part.p}</p>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <section className="mb-20">
            <h2 className="text-2xl font-extrabold text-espresso mb-8">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-6">
              {data.faqs.map((faq, index) => (
                <div key={index} className="bg-linen/20 border border-espresso/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-espresso mb-2">{faq.q}</h3>
                  <p className="text-xs text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="bg-espresso text-white rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 relative z-10">Scale your brand activation</h3>
            <p className="text-xs text-linen/70 max-w-md mx-auto mb-6 relative z-10 leading-normal">
              Book a live walkthrough with our operations team and launch your dynamic B2B campaign.
            </p>
            <div className="relative z-10 flex gap-4 justify-center">
              <Link href="/contact" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-6 py-3 rounded-full text-sm decoration-transparent">
                <span>Book Operations Walkthrough</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
