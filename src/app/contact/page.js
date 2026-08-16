import React from 'react';
import { Mail, Phone } from 'lucide-react';
import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Request Enterprise Demo & Pilot | Ziggers Execute',
  description: 'Connect with Ziggers Execute. Submit your marketing, sampling, or retail activation brief and coordinate campaign setups with our operations heads.',
  alternates: {
    canonical: '/contact',
  }
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Info Side */}
          <div>
            <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Deploy Operations</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-espresso tracking-tight leading-tight mt-2 mb-6">
              Launch Your Audited On-Ground Campaign
            </h1>
            <p className="text-base text-muted leading-relaxed mb-8">
              Submit your retail activation, product sampling, or visual audit campaign brief. Our regional operations team will coordinate feasibility checks, escrow budget setups, and promoter dispatches.
            </p>

            <div className="flex flex-col gap-6 text-sm text-espresso">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linen/50 border border-espresso/5 rounded-xl flex items-center justify-center text-gold">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs text-muted font-bold block">Email Campaign Briefs</span>
                  <a href="mailto:ops@ziggers.in" className="font-extrabold text-espresso hover:text-gold transition-colors decoration-transparent">ops@ziggers.in</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linen/50 border border-espresso/5 rounded-xl flex items-center justify-center text-gold">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs text-muted font-bold block">Call Operations Head</span>
                  <span className="font-extrabold">+91 (Chennai Hub operations)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <ContactForm />

        </div>
      </div>
    </div>
  );
}
