import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Heart, Code, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Careers | Ziggers Execute',
  description: 'Join the team building India\'s Operating System for Offline Marketing. Explore engineering, operations, and campaigns management roles.',
  alternates: {
    canonical: '/careers',
  }
};

export default function CareersPage() {
  const roles = [
    {
      title: 'City Operations Coordinator',
      location: 'Chennai Hub (On-Site)',
      desc: 'Coordinate local promoter matches, inventory distribution, and quality audits across campaigns.'
    },
    {
      title: 'Senior Frontend Engineer',
      location: 'Bangalore Hub (Hybrid)',
      desc: 'Build real-time GPS tracking components, dashboard data visualizers, and geofencing verification tools.'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <header className="mb-16">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Join the Operations Team</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
            Build the Future of Offline Campaign Execution
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            We are building the logistics, matching, and auditing engines to make on-ground operations predictable and transparent. Join a team combining code with physical operations execution.
          </p>
        </header>

        {/* Roles List */}
        <section className="mb-20">
          <h2 className="text-2xl font-extrabold text-espresso mb-8">Active Opportunities</h2>
          <div className="flex flex-col gap-6 max-w-3xl">
            {roles.map((role) => (
              <div key={role.title} className="bg-linen/25 border border-espresso/5 rounded-2xl p-6 hover:bg-linen/40 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-base font-extrabold text-espresso mb-1">{role.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gold font-bold uppercase tracking-wider mb-2">
                    <MapPin size={12} />
                    <span>{role.location}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{role.desc}</p>
                </div>
                <Link href="/contact" className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-md transition-all decoration-transparent">
                  <span>Apply Now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
