"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck, MapPin, CheckCircle, ArrowRight, BarChart2, Lock,
  Play, Search, Bell, ChevronDown, Plus, MoreVertical, Home, Megaphone, Users,
  BarChart3, CreditCard, Settings, Target, DollarSign, Cpu, Activity, Zap, X
} from 'lucide-react';

export default function HomePage() {
  const videoRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted and playsinline properties directly on the DOM element for browser autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    if (video.paused && video.readyState === 0) {
      video.load();
    }

    const playVideo = () => {
      if (video && video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Autoplay policy prevented playback without interaction
          });
        }
      }
    };

    // Immediate attempt
    playVideo();

    // Event listeners on the video element for when data is ready
    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);
    video.addEventListener('canplaythrough', playVideo);

    // Fallback interaction triggers in case of strict autoplay restrictions
    const handleUserInteraction = () => {
      playVideo();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    window.addEventListener('click', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('canplaythrough', playVideo);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  const campaignObjectives = [
    { icon: '📢', title: 'Brand Awareness', desc: 'High-visibility on-ground presence in metro hubs.' },
    { icon: '🏷️', title: 'Product Promotion', desc: 'New SKU launches with branded demos.' },
    { icon: '🎉', title: 'Store Opening', desc: 'Drive queues for new outlets.' },
    { icon: '🥤', title: 'Sampling', desc: 'Distribute trial packs with photo proof.' },
    { icon: '📄', title: 'Flyer Distribution', desc: 'Hand-to-hand pamphlet delivery.' },
    { icon: '📋', title: 'Lead Generation', desc: 'Capture verified phone numbers.' },
    { icon: '🎟️', title: 'Event Promotion', desc: 'Promote concerts, fests, and expos.' },
    { icon: '📱', title: 'App Downloads', desc: 'Guided installs and onboarding.' },
    { icon: '📊', title: 'Market Survey', desc: 'Consumer feedback and intelligence.' },
    { icon: '🛍️', title: 'Sales Promotion', desc: 'Direct on-field sales drives.' },
    { icon: '🎪', title: 'On-Ground Activation', desc: 'Kiosks, flash mobs, roadshows.' },
  ];

  const customerTiers = [
    {
      badge: '🟢',
      tier: 'Small Businesses',
      tagline: 'Self-Serve in 2 Mins',
      persona: 'Restaurant, Local Gym, Boutique, Clinic',
      quote: '"I have ₹10,000. I want 5 people outside my restaurant this Saturday."',
      desc: 'No minimum contracts or agency retainers. Pick your store radius, set a daily budget, and launch instant flyer distribution or sampling.',
      action: 'Launch Local Campaign'
    },
    {
      badge: '🔵',
      tier: 'Growing D2C Brands',
      tagline: 'Scalable Execution',
      persona: 'Beverage, FMCG, Fintech, Startups',
      quote: '"I want 100 promoters across Chennai for a product sampling campaign."',
      desc: 'Deploy multi-location sampling across colleges, tech parks, and high streets with 50m GPS geofencing and real-time lead capture.',
      action: 'Scale Multi-City Campaign'
    },
    {
      badge: '🟣',
      tier: 'Agencies & Enterprise',
      tagline: 'Power User Console',
      persona: 'BTL Agencies, Experiential Marketers, National Brands',
      quote: '"I have 15 campaigns and need 500 workers across 8 metros this month."',
      desc: 'Advanced campaign portfolios, field supervisor hierarchies, automated GST invoicing, and branded PDF audit exports.',
      action: 'Open Agency Desk'
    }
  ];

  const faqs = [
    {
      q: "How does Ziggers work like Meta Ads for the physical world?",
      a: "Meta Ads lets anyone launch an online campaign with clicks. Ziggers lets anyone launch an offline campaign. You choose your objective (Sampling, Store Opening, Flyers, Leads), set your target radius, pick your date/time, set your budget, and click 'Launch Campaign'. Ziggers automatically matches, briefs, and deploys verified workers with GPS tracking and photo proof."
    },
    {
      q: "Do I need to hire or manage individual workers?",
      a: "No. The brand buys an offline campaign outcome. Ziggers automatically finds workers → assigns them → briefs them → verifies GPS location → tracks attendance → collects proof → processes payment. You simply watch the live campaign dashboard."
    },
    {
      q: "Can small businesses run small budget campaigns?",
      a: "Yes! A neighborhood restaurant or boutique can launch an activation with as little as ₹5,000 to ₹10,000 for a weekend flyer or sampling drive. There are no agency minimums or hidden fees."
    },
    {
      q: "How is proof and attendance verified?",
      a: "Every worker checks in through our mobile terminal within a strict 50m geofenced tolerance radius. All activity photos are stamped with cryptographic watermarks (Worker Name + GPS Lat/Long + Timestamp + Campaign Node)."
    }
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Premium SaaS with Video Background         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-white">

        {/* Background Video — Chennai city streets, muted autoplay loop */}
        <video
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.defaultMuted = true;
              el.muted = true;
              el.setAttribute('muted', '');
              el.setAttribute('playsinline', '');
              el.setAttribute('webkit-playsinline', 'true');
            }
          }}
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            v.muted = true;
            v.defaultMuted = true;
            v.play().catch(() => {});
          }}
          onCanPlay={(e) => {
            const v = e.currentTarget;
            v.muted = true;
            v.defaultMuted = true;
            v.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none"
          style={{ minHeight: '100%' }}
        />

        {/* Translucent overlay for text readability */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.50) 40%, rgba(255,255,255,0.85) 85%, #FFFFFF 100%)'
          }}
        />

        {/* Decorative dot grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-[2]" />

        {/* Hero Content */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-linen border border-espresso/10 px-4 py-1.5 rounded-full text-xs font-bold text-muted uppercase tracking-wider mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            Offline campaigns, finally made simple ✨
          </motion.div>

          {/* Headline — Instrument Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-hero-serif text-4xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-espresso max-w-4xl mb-6"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Launch{' '}
            <span style={{ fontStyle: 'italic' }}>Offline Campaigns</span>
            <br />
            Like You Launch Meta Ads
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted max-w-[680px] mb-10 leading-relaxed font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Choose your location, set your budget, deploy verified people, and track your campaign live. Ziggers takes care of the offline execution — whether you&apos;re a small restaurant, D2C brand, or enterprise agency.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap mb-16 md:mb-20"
          >
            <Link href="/dashboard" className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:translate-y-[-1px] text-base decoration-transparent">
              <span>Launch Campaign Console</span>
              <ArrowRight size={18} className="text-gold" />
            </Link>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-2 border-1.5 border-espresso/15 hover:border-espresso text-espresso font-bold px-8 py-4 rounded-full transition-all text-base cursor-pointer bg-white/60 backdrop-blur-xs hover:bg-white"
            >
              <Play size={14} className="fill-espresso" />
              <span>See how it works</span>
            </button>
          </motion.div>

          {/* Video Demo Modal */}
          {isVideoModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
              <div className="relative w-full max-w-4xl bg-espresso rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-xs font-mono text-linen/70 ml-2">Traffic on Chennai City Streets — Offline Happens Here</span>
                  </div>
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="aspect-video w-full bg-black">
                  <video
                    src="/hero-bg.mp4"
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-espresso flex items-center justify-between text-xs text-linen/80">
                  <span>Authentic On-Ground Chennai Activation Footage</span>
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="bg-gold text-espresso font-bold px-4 py-1.5 rounded-xl cursor-pointer hover:bg-gold/90"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Frosted Glass Dashboard Preview ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-5xl"
          >
            <div
              className="rounded-2xl overflow-hidden p-3 md:p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 25px 80px -12px rgba(61, 43, 31, 0.10), 0 0 0 1px rgba(61, 43, 31, 0.06)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div className="bg-white rounded-xl border border-espresso/10 overflow-hidden flex flex-col text-[11px] select-none pointer-events-none" style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-espresso/10 bg-linen/30">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-espresso text-gold flex items-center justify-center font-bold text-[10px]">Z</div>
                    <span className="font-semibold text-espresso">Ziggers Campaigns</span>
                    <ChevronDown className="w-3 h-3 text-muted" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-white border border-espresso/10 px-3 py-1 rounded-md text-muted w-56 justify-between">
                    <div className="flex items-center gap-1.5">
                      <Search className="w-3 h-3" />
                      <span className="text-[10px]">Search campaigns...</span>
                    </div>
                    <kbd className="text-[9px] bg-linen border border-espresso/10 px-1 rounded font-mono text-muted">⌘K</kbd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-gold text-espresso px-2.5 py-1 rounded-full text-[10px] font-bold">Create Campaign</span>
                    <Bell className="w-3.5 h-3.5 text-muted" />
                    <div className="w-6 h-6 rounded-full bg-linen border border-espresso/10 text-[9px] font-bold text-espresso flex items-center justify-center">SC</div>
                  </div>
                </div>

                {/* Body: sidebar + main */}
                <div className="flex min-h-[320px]">

                  {/* Sidebar */}
                  <aside className="w-40 border-r border-espresso/10 p-3 hidden sm:block bg-white shrink-0">
                    <div className="space-y-0.5 text-[10px]">
                      {[
                        { label: 'Home', icon: Home, active: false },
                        { label: 'Campaigns', icon: Megaphone, active: true },
                        { label: 'Workers', icon: Users, active: false },
                        { label: 'Locations', icon: MapPin, active: false },
                        { label: 'Analytics', icon: BarChart3, active: false },
                        { label: 'Payments', icon: CreditCard, active: false },
                        { label: 'Settings', icon: Settings, active: false },
                      ].map(item => (
                        <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${item.active ? 'bg-linen text-espresso font-semibold' : 'text-muted'}`}>
                          <item.icon className="w-3 h-3" />
                          <span>{item.label}</span>
                          {item.active && <span className="w-1.5 h-1.5 rounded-full bg-gold ml-auto" />}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-espresso/10 space-y-0.5 text-[10px]">
                      <span className="text-[9px] uppercase font-bold text-muted px-2 block tracking-wider">Manage</span>
                      {['My Campaigns', 'Saved Audiences', 'Reports', 'Team'].map(item => (
                        <div key={item} className="px-2 py-1.5 text-muted">{item}</div>
                      ))}
                    </div>
                  </aside>

                  {/* Main Content */}
                  <main className="flex-1 bg-light-gray/30 p-4 space-y-3 overflow-hidden">
                    <div>
                      <p className="text-[13px] font-semibold text-espresso">Good morning, Subanesh</p>
                      <p className="text-[10px] text-muted">Here&apos;s what&apos;s happening with your campaigns.</p>
                    </div>

                    {/* Action pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-gold text-espresso px-2.5 py-1 rounded-full text-[10px] font-bold">Create Campaign</span>
                      {['Hire Ziggers', 'Add Location', 'View Reports'].map(l => (
                        <span key={l} className="bg-white border border-espresso/10 text-espresso px-2.5 py-1 rounded-full text-[10px] font-medium">{l}</span>
                      ))}
                      <span className="text-[10px] text-muted ml-1">+ Customize</span>
                    </div>

                    {/* Two cards */}
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Campaign Performance */}
                      <div className="flex-1 basis-0 bg-white border border-espresso/10 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-espresso">Campaign Performance</span>
                          <span className="text-[9px] bg-gold/15 text-gold font-bold px-1.5 py-0.5 rounded">Live</span>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-espresso" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>18,420</div>
                          <span className="text-[10px] text-muted">Estimated interactions</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px]">
                          <span className="text-muted">Today <span className="text-green-600 font-semibold">+2,840</span></span>
                          <span className="text-muted">Workers <span className="text-espresso font-semibold">124</span></span>
                          <span className="text-muted">Locations <span className="text-espresso font-semibold">18</span></span>
                        </div>
                        {/* SVG chart — cubic Bézier */}
                        <div className="h-14 w-full">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 70" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#C4A052" stopOpacity="0.20" />
                                <stop offset="100%" stopColor="#C4A052" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0,55 C 30,50 60,58 100,38 C 140,18 170,42 210,28 C 250,14 290,32 340,12 C 365,4 385,16 400,10 L 400,70 L 0,70 Z" fill="url(#goldGrad)" />
                            <path d="M 0,55 C 30,50 60,58 100,38 C 140,18 170,42 210,28 C 250,14 290,32 340,12 C 365,4 385,16 400,10" fill="none" stroke="#C4A052" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      {/* Active Campaigns */}
                      <div className="flex-1 basis-0 bg-white border border-espresso/10 rounded-xl p-3.5 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-espresso">Active Campaigns</span>
                          <div className="flex items-center gap-1.5 text-muted"><Plus className="w-3 h-3" /><MoreVertical className="w-3 h-3" /></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          {[
                            { name: 'Summer Sampling', loc: '12 locations', status: 'Live', color: 'text-gold bg-gold/10' },
                            { name: 'Store Launch', loc: '5 locations', status: 'Live', color: 'text-gold bg-gold/10' },
                            { name: 'College Activation', loc: '8 locations', status: 'Scheduled', color: 'text-amber-600 bg-amber-50' },
                          ].map(c => (
                            <div key={c.name} className="flex items-center justify-between py-2.5 text-[11px]">
                              <div>
                                <div className="font-medium text-espresso">{c.name}</div>
                                <div className="text-[9px] text-muted">{c.loc}</div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${c.color}`}>{c.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Create Campaign mini-card */}
                      <div className="hidden lg:flex flex-col rounded-xl p-3.5 bg-white border border-espresso/10" style={{ width: '190px', flexShrink: 0 }}>
                        <span className="text-[10px] font-semibold text-espresso mb-2">Create Campaign</span>
                        <div className="space-y-2 flex-1 text-[9px]">
                          {[
                            { label: 'Objective', value: 'Brand Awareness' },
                            { label: 'Location', value: 'Chennai · 5 km' },
                            { label: 'Workers', value: '25 Ziggers' },
                            { label: 'Budget', value: '₹25,000' },
                          ].map(f => (
                            <div key={f.label}>
                              <span className="block font-medium text-muted uppercase tracking-wider" style={{ fontSize: '8px' }}>{f.label}</span>
                              <div className="px-2 py-1.5 rounded-md bg-linen/60 border border-espresso/5 text-espresso font-medium text-[10px]">{f.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 w-full py-1.5 rounded-md text-center font-bold text-[10px] bg-gold text-espresso">
                          🚀 Launch Campaign
                        </div>
                      </div>
                    </div>

                    {/* Activity table */}
                    <div className="bg-white border border-espresso/10 rounded-xl p-3 space-y-2">
                      <span className="text-[10px] font-semibold text-espresso">Recent Campaign Activity</span>
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr className="text-muted border-b border-espresso/10 text-[9px] uppercase tracking-wider">
                            <th className="pb-1.5 font-medium">Campaign</th>
                            <th className="pb-1.5 font-medium">Location</th>
                            <th className="pb-1.5 font-medium">Ziggers</th>
                            <th className="pb-1.5 font-medium">Reach</th>
                            <th className="pb-1.5 text-right font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { campaign: 'Summer Sampling', location: 'OMR, Chennai', ziggers: '24', reach: '4,820', status: 'Live', sClass: 'text-gold bg-gold/10' },
                            { campaign: 'Store Launch', location: 'Anna Nagar', ziggers: '12', reach: '2,140', status: 'Completed', sClass: 'text-green-700 bg-green-50' },
                            { campaign: 'College Activation', location: 'Velachery', ziggers: '18', reach: '3,620', status: 'Live', sClass: 'text-gold bg-gold/10' },
                            { campaign: 'Product Launch', location: 'T Nagar', ziggers: '10', reach: '1,890', status: 'Completed', sClass: 'text-green-700 bg-green-50' },
                          ].map(r => (
                            <tr key={r.campaign} className="border-b border-espresso/5">
                              <td className="py-1.5 font-medium text-espresso">{r.campaign}</td>
                              <td className="py-1.5 text-muted">{r.location}</td>
                              <td className="py-1.5 font-medium text-espresso">{r.ziggers}</td>
                              <td className="py-1.5 font-medium text-espresso">{r.reach}</td>
                              <td className="py-1.5 text-right"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${r.sClass}`}>{r.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BELOW: All original Ziggers content sections               */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* 11 CAMPAIGN OBJECTIVES */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-espresso/5">
        <div className="text-center max-w-xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Campaign Objectives</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-espresso tracking-tight mt-2">
            11 Ways to Run Physical Advertising
          </h2>
          <p className="text-sm text-muted mt-4 leading-relaxed">
            Choose your goal. Set your geofence. Click launch. Ziggers handles the rest — from finding workers to collecting proof.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {campaignObjectives.map((obj) => (
            <div key={obj.title} className="bg-linen/40 border border-espresso/5 rounded-2xl p-6 hover:bg-linen/60 hover:border-gold/40 transition-all hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{obj.icon}</div>
              <h3 className="text-sm font-extrabold text-espresso">{obj.title}</h3>
              <p className="text-xs text-muted leading-relaxed mt-1">{obj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE THREE CUSTOMER TIERS */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-espresso/5">
        <div className="text-center max-w-xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-extrabold tracking-widest text-gold uppercase">Demand Side Strategy</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-espresso tracking-tight mt-2">
            Built for Three Customer Levels
          </h2>
          <p className="text-sm text-muted mt-4 leading-relaxed">
            You don&apos;t need to hire an agency or manage individual freelancers. Launch self-serve campaigns regardless of scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerTiers.map((tier, idx) => (
            <div key={idx} className="bg-white border border-espresso/5 hover:border-gold/40 rounded-3xl p-8 shadow-soft transition-all flex flex-col justify-between hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-linen px-3 py-1 rounded-full text-espresso">{tier.badge} {tier.tagline}</span>
                  <span className="text-xs font-extrabold text-gold font-mono">0{idx+1}</span>
                </div>
                <h3 className="text-xl font-extrabold text-espresso tracking-tight">{tier.tier}</h3>
                <span className="text-[11px] font-bold text-muted block">{tier.persona}</span>
                <div className="p-4 bg-linen/50 rounded-2xl border border-espresso/5 italic text-xs text-espresso font-medium leading-relaxed">
                  {tier.quote}
                </div>
                <p className="text-xs text-muted leading-relaxed">{tier.desc}</p>
              </div>
              <div className="pt-6">
                <Link href="/dashboard" className="w-full bg-espresso hover:bg-gold hover:text-espresso text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors decoration-transparent">
                  <span>{tier.action}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TWO-SIDED MARKETPLACE ABSTRACTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-espresso/5">
        <div className="bg-espresso text-white rounded-3xl p-8 md:p-12 border border-linen/10 shadow-strong">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-extrabold tracking-widest text-gold uppercase">Marketplace Abstraction</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              The Brand Buys an Offline Campaign Outcome
            </h2>
            <p className="text-xs text-linen/70 leading-relaxed font-medium">
              Ziggers creates the algorithmic bridge between physical demand and verified on-ground talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-black/20 p-6 rounded-2xl border border-linen/10 space-y-3">
              <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block">DEMAND</span>
              <h4 className="text-sm font-extrabold text-white">Brands, Stores & Agencies</h4>
              <ul className="text-xs text-linen/70 space-y-2 font-medium">
                <li>• Local Restaurants & Small Shops</li>
                <li>• D2C Beverage & Beauty Brands</li>
                <li>• Startups & App Onboarding</li>
                <li>• Real Estate & Political Campaigns</li>
                <li>• BTL Agencies (Power Users)</li>
              </ul>
            </div>

            <div className="bg-gold text-espresso p-6 rounded-2xl text-center space-y-3 shadow-strong">
              <div className="w-10 h-10 rounded-full bg-espresso text-gold flex items-center justify-center font-black mx-auto text-lg">Z</div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">ZIGGERS EXECUTE OS</h3>
              <p className="text-[11px] text-espresso/90 leading-tight font-bold">
                Finds Ziggers → Assigns → Briefs → Verifies GPS → Tracks → Collects Proof → Pays
              </p>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border border-linen/10 space-y-3">
              <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-wider block">SUPPLY</span>
              <h4 className="text-sm font-extrabold text-white">Verified On-Ground Talent</h4>
              <ul className="text-xs text-linen/70 space-y-2 font-medium">
                <li>• Brand Promoters & Samplers</li>
                <li>• Flyer & Pamphlet Distributors</li>
                <li>• Event Staff, Hosts & Volunteers</li>
                <li>• App Onboarding & Sales Reps</li>
                <li>• Field Survey & Audit Crew</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ZIGGERS — Feature cards */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-espresso/5">
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
            <h3 className="text-lg font-extrabold text-espresso mb-3">Escrow Budget Protection</h3>
            <p className="text-sm text-muted leading-relaxed">
              Payments are securely locked in escrow beforehand and disbursed to field partners only when audit timelines and targets are mathematically verified on-site.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Trust Stats */}
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

      {/* FAQ */}
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

      {/* Call to Action Footer */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-espresso text-white rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 relative z-10">
            Ready to launch your offline campaign?
          </h2>
          <p className="text-sm text-linen/75 max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
            From a ₹10,000 weekend flyer activation to a nationwide multi-city sampling rollout — launch in 3 minutes with verified GPS proof.
          </p>
          <div className="relative z-10 flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard" className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all decoration-transparent">
              <span>Launch First Campaign</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
