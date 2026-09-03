import Link from 'next/link';

export const metadata = {
  title: 'Vendor Partner Ecosystem | Ziggers Execute',
  description: 'Join the premier offline execution partner network for brand sampling, printing, fabrication, and field manpower across India.'
};

export default function VendorLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          Ziggers Supply-Side Partner Portal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Execute Enterprise Campaigns. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Guaranteed Milestones, Zero Guesswork.
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connect your agency, printing press, fabrication workshop, or staffing firm to verified B2B offline campaigns in your city.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/vendor/onboarding"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 text-center"
          >
            Register as Execution Partner
          </Link>
          <Link
            href="/vendor/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold transition text-center"
          >
            Vendor Partner Login →
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center text-white mb-12">Supported Physical Execution Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-4">
              👥
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Manpower & Staffing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Promoters, Brand Ambassadors, Supervisors, Emcees, and multilingual field personnel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-4">
              🖨️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Printing & POSM</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vinyl, Sunboard, Standees, Pamphlets, Leaflets, POS displays, and product packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-4">
              🎪
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Stall & Kiosk Fabrication</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modular canopies, custom mall kiosks, retail demo structures, and exhibition booths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
