import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart2, ShieldCheck, Database, MapPin } from 'lucide-react';

const SOLUTIONS_DATA = {
  'product-sampling': {
    title: 'Product Sampling Solutions | Ziggers Execute',
    desc: 'Direct-to-consumer physical trial pipelines with verified GPS audits and high-speed field operations to scale product sampling campaigns anywhere in India.',
    eyebrow: 'Direct-To-Consumer Pipeline',
    h1: 'On-Demand Product Sampling Infrastructure',
    intro: 'Eliminate wasted budget and untracked sample distributions. Ziggers Execute provides a verified, audited, and tech-driven platform to seed your physical products directly into target consumer hands across India.',
    stats: [
      { val: '99.8%', label: 'Delivery Handover Rate' },
      { val: '24 Hours', label: 'Average Campaign Dispatch' },
      { val: '100% Verified', label: 'GPS Photo Audited Logs' }
    ],
    bodyParts: [
      {
        h2: 'Geofenced Campaign Distribution Control',
        p: 'Our execution platform utilizes geofenced mobile check-ins that verify promoters are physically active within exact campaign parameters. Promoters upload audited photos for every target handover, generating instant visual logs of product sampling.'
      },
      {
        h2: 'Compliant & Background-Checked Promoters',
        p: 'We don\'t use unverified agencies or temp staff. Every sampling campaigner completes Aadhaar biometric KYC and PAN checkouts, ensuring brand compliance, professional representations, and maximum consumer trust.'
      }
    ],
    faqs: [
      { q: "How do you verify samples actually reach target consumers?", a: "Each promotional campaigner is tracked via live GPS. Handover receipts, consumer photo confirmations (if consented), and geofenced store logs are uploaded instantly, eliminating leakage." },
      { q: "What metro cities are active for sampling?", a: "We cover Chennai, Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Coimbatore, and Madurai with direct warehouse and logistics integrations." }
    ]
  },
  'retail-activation': {
    title: 'Retail Activation & Merchandising | Ziggers Execute',
    desc: 'B2B in-store activation platform. Real-time visual audits, POSM installations, and shelf space audits across modern and general trade retail stores in India.',
    eyebrow: 'Shelf Intelligence & Visibility',
    h1: 'Automated Retail Activations & Visual Audits',
    intro: 'Ensure your brand is positioned perfectly. Manage POSM deployments, in-store activations, and shelf audits with instant photo verification and real-time compliance tracking.',
    stats: [
      { val: '15 Mins', label: 'Audit Upload Speed' },
      { val: '98.5%', label: 'Planogram Compliance' },
      { val: '4.9 ★', label: 'Audit Partner Rating' }
    ],
    bodyParts: [
      {
        h2: 'In-Store Verification Loop',
        p: 'Track your field marketing compliance with real-time photographs. Field auditors deploy to target general or modern trade outlets, execute planogram compliance checks, and upload high-res images directly to the operations console.'
      },
      {
        h2: 'Fast POSM Deployment Pipelines',
        p: 'Deploy temporary displays, banners, and standees at scale. Our centralized matching system coordinates local logistics and matches installers in minutes, backed by secure escrow releases once compliance photos are verified.'
      }
    ],
    faqs: [
      { q: "How do you ensure audit pictures are real and recent?", a: "All uploads must be captured natively inside the Ziggers Execute app, which blocks camera-roll uploads and checks the photo metadata against geofenced coordinates." },
      { q: "Do you support both modern trade and general trade stores?", a: "Yes. Our networks serve supermarket chains, hypermarkets, mall counters, and local kirana stores across all active cities." }
    ]
  },
  'roadshows-and-events': {
    title: 'Experiential Roadshows & Events | Ziggers Execute',
    desc: 'Deploy mobile activation campaigns, van campaigns, and experiential roadshows anywhere in India. GPS tracking, operations management, and verified promoters.',
    eyebrow: 'High-Impact Brand Campaigns',
    h1: 'On-Ground Experiential Roadshow Infrastructure',
    intro: 'Build high-impact physical campaigns that drive real results. Ziggers Execute provides the logistical infrastructure, vehicle tracking, and promoter dispatch to execute roadshows smoothly.',
    stats: [
      { val: '100% Tracking', label: 'GPS Van Live Tracking' },
      { val: '24/7 Console', label: 'Campaign Control Center' },
      { val: '8 Metro Hubs', label: 'Local Operations Support' }
    ],
    bodyParts: [
      {
        h2: 'Real-time GPS Fleet Monitoring',
        p: 'Every promotional vehicle and van is equipped with live tracking integrations. Monitor routes, dwell times, and campaign interactions in real-time on our administrative dashboard.'
      },
      {
        h2: 'End-to-End On-Ground Operations',
        p: 'We manage local municipal compliance, local logistics matching, and staff coordination, so your trade and marketing heads can focus on creative strategies and campaign targets.'
      }
    ],
    faqs: [
      { q: "How do you handle local municipal permissions for roadshows?", a: "Our city operations hubs coordinate with local municipal corporations and agencies to secure compliance permits, transit logs, and approvals." },
      { q: "Can we track audience interactions dynamically?", a: "Yes. Campaigners log interaction metrics, lead registrations, and sample handovers inside our operations app, feeding data directly to your dashboard." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: 'product-sampling' },
    { slug: 'retail-activation' },
    { slug: 'roadshows-and-events' }
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = SOLUTIONS_DATA[slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.desc,
    alternates: {
      canonical: `/solutions/${slug}`,
    }
  };
}

export default async function SolutionPageRoute({ params }) {
  const { slug } = await params;
  const data = SOLUTIONS_DATA[slug];
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
            <span className="text-espresso">Solutions</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 relative z-10">Get a custom deployment pilot</h3>
            <p className="text-xs text-linen/70 max-w-md mx-auto mb-6 relative z-10 leading-normal">
              Book a live walk-through with our operations team and launch your dynamic {data.eyebrow.toLowerCase()} campaign.
            </p>
            <div className="relative z-10 flex gap-4 justify-center">
              <Link href="/contact" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-6 py-3 rounded-full text-sm decoration-transparent">
                <span>Book Deployment Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
