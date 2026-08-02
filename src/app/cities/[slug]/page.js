import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MapPin, Compass, Briefcase, Zap } from 'lucide-react';

const CITIES_DATA = {
  'chennai': {
    title: 'On-Ground Marketing Execution Hub Chennai | Ziggers Execute',
    desc: 'B2B offline marketing and campaign execution platform in Chennai. Deploy verified product sampling, retail activations, and roadshows in OMR, ECR, Mylapore, and T. Nagar.',
    cityName: 'Chennai',
    region: 'Tamil Nadu',
    h1: 'Chennai On-Ground Marketing & Campaign Execution Hub',
    intro: 'Scale your offline brand activations, instore merchandising, and product sampling across Chennai. We connect you with KYC-verified field campaigners, real-time GPS tracking, and complete operations support.',
    localities: ['T. Nagar Hub', 'OMR & ECR Tech Corridor', 'Mylapore Trade Cluster', 'Velachery & Adyar Retail Centers'],
    stats: [
      { val: '1,200+', label: 'Verified Chennai Promoters' },
      { val: '99.6%', label: 'Local Compliance Rate' },
      { val: '15 Mins', label: 'Field Matching Net' }
    ],
    features: [
      { title: 'Chennai-Wide Sampling Network', desc: 'Deploy direct product trials at tech parks, supermarkets, and premium residential spaces.' },
      { title: 'Local Merchandising Audits', desc: 'Audit visual displays and inventory levels across general trade and modern store shelves.' }
    ]
  },
  'bangalore': {
    title: 'On-Ground Marketing Execution Hub Bangalore | Ziggers Execute',
    desc: 'B2B field operations and campaign execution in Bangalore. Verified product sampling, retail activations, and merchant onboarding in Whitefield, Indiranagar, and Koramangala.',
    cityName: 'Bangalore',
    region: 'Karnataka',
    h1: 'Bangalore On-Ground Marketing & Campaign Execution Hub',
    intro: 'Execute high-impact on-ground campaigns, van roadshows, and retail audits in Bangalore. Direct access to background-checked field teams and real-time GPS operational monitoring.',
    localities: ['Indiranagar & Koramangala Retail', 'Whitefield & Electronic City Tech Parks', 'Jayanagar Hub', 'Outer Ring Road Corporate Corridors'],
    stats: [
      { val: '1,500+', label: 'Verified Bangalore Campaigners' },
      { val: '99.4%', label: 'Compliance Performance' },
      { val: '10 Mins', label: 'Average standby net' }
    ],
    features: [
      { title: 'Tech Corridor Sampling', desc: 'Distribute physical product trials to tech professionals in high-density office zones.' },
      { title: 'Merchant Onboarding Pipelines', desc: 'Scale merchant audits, QR code placements, and app download activations.' }
    ]
  },
  'mumbai': {
    title: 'On-Ground Marketing Execution Hub Mumbai | Ziggers Execute',
    desc: 'B2B campaign execution and retail activation platform in Mumbai. Deploy audited sampling, experiential marketing, and field audits in Nariman Point, Bandra, and Andheri.',
    cityName: 'Mumbai',
    region: 'Maharashtra',
    h1: 'Mumbai On-Ground Marketing & Campaign Execution Hub',
    intro: 'Deploy verified field marketing promoters, shelf auditors, and van roadshows across Mumbai. Instant GPS proof-of-work reporting and escrow payment safety.',
    localities: ['Bandra & Andheri Retail Hubs', 'Colaba & Nariman Point Commercial Hubs', 'Lower Parel Corporate Centers', 'Thane & Navi Mumbai Corridors'],
    stats: [
      { val: '1,800+', label: 'Verified Mumbai Promoters' },
      { val: '99.7%', label: 'Field Audit Compliance' },
      { val: '15 Mins', label: 'Average matching speed' }
    ],
    features: [
      { title: 'High-Density Product Sampling', desc: 'Reach massive audiences at train terminals, shopping centers, and corporate districts.' },
      { title: 'Visual Merchandising Audits', desc: 'Track display compliance and stock availability in modern retail chains.' }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: 'chennai' },
    { slug: 'bangalore' },
    { slug: 'mumbai' }
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = CITIES_DATA[slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.desc,
    alternates: {
      canonical: `/cities/${slug}`,
    }
  };
}

export default async function CityHubPageRoute({ params }) {
  const { slug } = await params;
  const data = CITIES_DATA[slug];
  if (!data) return null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "name": data.cityName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.cityName,
          "addressRegion": data.region,
          "addressCountry": "India"
        }
      },
      {
        "@type": "Service",
        "name": data.h1,
        "description": data.desc,
        "areaServed": data.cityName,
        "provider": {
          "@type": "Organization",
          "name": "Ziggers Execute",
          "url": "https://execute.ziggers.in"
        }
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
            <span className="text-espresso">Cities</span>
            <span>/</span>
            <span className="text-gold">{data.cityName}</span>
          </nav>

          <header className="mb-16">
            <span className="text-xs font-extrabold tracking-widest text-gold uppercase">{data.cityName} Operations Hub</span>
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

          {/* Localities Section */}
          <div className="bg-linen/10 border border-espresso/5 rounded-3xl p-8 mb-16">
            <h2 className="text-lg font-bold text-espresso mb-4">Chennai Active Execution Clusters</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.localities.map((loc) => (
                <div key={loc} className="flex items-center gap-2 text-sm text-espresso font-semibold">
                  <MapPin size={16} className="text-gold" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features body */}
          <div className="flex flex-col gap-12 mb-20">
            {data.features.map((feat) => (
              <div key={feat.title} className="border-l-2 border-gold pl-6">
                <h3 className="text-base font-extrabold text-espresso mb-2">{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed max-w-3xl">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-espresso text-white rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 relative z-10">Deploy campaign in {data.cityName}</h3>
            <p className="text-xs text-linen/70 max-w-md mx-auto mb-6 relative z-10 leading-normal">
              Book a live walkthrough with our {data.cityName} operations team and launch your campaign pilot.
            </p>
            <div className="relative z-10 flex gap-4 justify-center">
              <Link href="/contact" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-6 py-3 rounded-full text-sm decoration-transparent">
                <span>Request {data.cityName} Hub Pilot</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
