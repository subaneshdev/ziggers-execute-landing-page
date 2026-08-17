"use client";
import React, { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, Upload, MapPin, Calculator, 
  Calendar, ShieldCheck, FileText, Image as ImageIcon, Video, 
  User, Phone, Sparkles, AlertCircle, Clock, DollarSign, Users, Briefcase, Zap,
  Target, Sliders, Layers, Award, Building, School, ShoppingBag, Eye, TrendingUp
} from 'lucide-react';

export default function CampaignCreator({ onClose, onPublish }) {
  const [step, setStep] = useState(1);

  // Form Data State
  const [formData, setFormData] = useState({
    name: 'T. Nagar Store Launch & Product Sampling',
    brand: 'Artisan Cafe & Bakery',
    objective: 'Sampling',
    targetArea: 'T. Nagar & Ranganathan Street',
    city: 'Chennai',
    radiusKm: 3,
    ageRange: [18, 35],
    gender: 'All',
    secCategory: 'SEC A/B (Mid-High Income)',
    occupationSegment: 'IT & Tech Software Engineers',
    lifeStage: 'Young Single / Gen-Z (18-24)',
    promoterLanguage: 'Multi-Lingual Metro Promoters (English + Regional)',
    shoppingHabit: 'Quick-Commerce & E-Commerce Shoppers',
    selectedInterests: ['Foodies & Coffee Lovers', 'College & Student Youth', 'Fashion & Shopping'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    shiftTiming: 'Evening Prime (04:00 PM - 09:00 PM)',
    peopleType: 'Energetic Brand Promoters & Sampling Specialists',
    workersRequired: 15,
    budget: 35000,
    instructions: 'Engage shoppers near high-street entries. Hand out sample iced coffee vouchers with live phone OTP lead capture.',
    briefingFile: 'T_Nagar_Activation_Brief.pdf',
  });

  // Meta/FB-style 11 Campaign Objectives
  const objectives = [
    { id: 'Sampling', title: 'Product Sampling', desc: 'Distribute FMCG, beverage, or food trials with instant photo evidence.', icon: '🥤', category: 'Conversions' },
    { id: 'Store opening', title: 'Store Opening Launch', desc: 'Drive neighborhood foot traffic and queue hype for new retail outlets.', icon: '🎉', category: 'Awareness' },
    { id: 'Brand awareness', title: 'High-Traffic Visibility', desc: 'Maximize on-ground brand presence in high-density metro hubs.', icon: '📢', category: 'Awareness' },
    { id: 'Lead generation', title: 'Lead & Contact Capture', desc: 'Capture verified names, phone numbers, and survey responses via OTP.', icon: '📋', category: 'Leads' },
    { id: 'Product promotion', title: 'SKU Demo & Promotion', desc: 'Promote new product lines with live demos and branded merchandise.', icon: '🏷️', category: 'Consideration' },
    { id: 'App downloads', title: 'App Installs & Onboarding', desc: 'Guided app installs, promo code redemptions, and user onboarding.', icon: '📱', category: 'App Growth' },
    { id: 'Flyer distribution', title: 'Geofenced Pamphlets', desc: 'Hand-to-hand coupon and flyer distribution within strict 50m radius.', icon: '📄', category: 'Awareness' },
    { id: 'Event promotion', title: 'Event & Fest Buzz', desc: 'Promote college expos, marathons, concerts, and regional trade shows.', icon: '🎟️', category: 'Awareness' },
    { id: 'Survey', title: 'Market Intelligence', desc: 'Collect structured consumer feedback and competitor price intelligence.', icon: '📊', category: 'Research' },
    { id: 'Sales promotion', title: 'On-Field Sales Drives', desc: 'Direct merchant onboarding, discount distribution, and instant sales.', icon: '🛍️', category: 'Conversions' },
    { id: 'On-ground activation', title: 'Experiential Kiosks', desc: 'Pop-up booths, mascot engagement, flash mobs, and interactive setups.', icon: '🎪', category: 'Experiential' }
  ];

  // Hyper-Local POI & Demographic Database (e.g. T. Nagar, Velachery, OMR, Indiranagar, Bandra, etc.)
  const geoIntelligenceDb = {
    'T. Nagar & Ranganathan Street': {
      city: 'Chennai',
      secRating: 'SEC A/B (Mid-to-High Household Income ₹55k–₹1.4L/mo)',
      footfallDaily: '95,000+ Footfall/Day',
      matchScore: 98,
      schoolsAndColleges: ['Loyola College (1.8 km)', 'Sacred Heart Matriculation', 'MOP Vaishnav College'],
      mallsAndHighStreets: ['Express Avenue Mall', 'Ranganathan St Arcades', 'Saravana Stores Hub'],
      economicProfile: 'High Footfall Commercial Arcade, Dense Retail Shoppers & Youth',
      peakHours: '04:30 PM – 09:00 PM (Peak Shopping Hours)',
      recommendedPromoters: 15
    },
    'OMR IT Corridor & Tidel Park': {
      city: 'Chennai',
      secRating: 'SEC A/A+ (IT Professionals & Tech Executives ₹75k–₹2.5L/mo)',
      footfallDaily: '70,000+ Tech Professionals/Day',
      matchScore: 96,
      schoolsAndColleges: ['Sathyabama University', 'SSN College of Engineering', 'Hindustan University'],
      mallsAndHighStreets: ['RMZ Millenia Tech Park', 'Vivira Mall', 'OMR Food Street Hub'],
      economicProfile: 'Tech Park Campus, High Disposable Income, D2C & FinTech Ideal',
      peakHours: '08:30 AM – 10:30 AM (Entry) & 05:30 PM – 08:00 PM (Exit)',
      recommendedPromoters: 20
    },
    'Velachery & Phoenix MarketCity': {
      city: 'Chennai',
      secRating: 'SEC A/B (Young Professionals, College Youth & Families)',
      footfallDaily: '80,000+ Shoppers/Day',
      matchScore: 95,
      schoolsAndColleges: ['IIT Madras (3.2 km)', 'Guru Nanak College', 'AMET Campus'],
      mallsAndHighStreets: ['Phoenix Marketcity Mall', 'Grand Square Mall', 'Velachery Main Rd Corridor'],
      economicProfile: 'Premium Mall Arcade, Moviegoers, Weekend Family Crowds',
      peakHours: '01:00 PM – 09:30 PM (Weekend High Density)',
      recommendedPromoters: 18
    },
    'Anna Nagar Commercial Hub': {
      city: 'Chennai',
      secRating: 'SEC A+ (Upper Residential & High Street Boutique Buyers)',
      footfallDaily: '55,000+ Footfall/Day',
      matchScore: 94,
      schoolsAndColleges: ['SBOA School', 'Anna Adarsh College for Women', 'Valliammal College'],
      mallsAndHighStreets: ['VR Chennai Mall', '2nd Avenue High Street', 'Shanti Colony Food Strip'],
      economicProfile: 'Affluent Residential Pocket, Premium D2C & Gourmet Dining Focus',
      peakHours: '05:00 PM – 09:30 PM',
      recommendedPromoters: 12
    },
    'Indiranagar & 100ft Road': {
      city: 'Bangalore',
      secRating: 'SEC A+ (Tech Founders, Urban Youth & Lifestyle Consumers)',
      footfallDaily: '65,000+ Footfall/Day',
      matchScore: 97,
      schoolsAndColleges: ['National Public School', 'Ebenezer International', 'New Horizon'],
      mallsAndHighStreets: ['100ft Road High Street', '12th Main Food Hub', 'CMH Road Arcades'],
      economicProfile: 'Bangalore Pub & Craft Beverage Hub, Premium Lifestyle & App Downloads',
      peakHours: '12:30 PM – 03:00 PM & 06:30 PM – 10:00 PM',
      recommendedPromoters: 16
    },
    'Koramangala 80ft Road Corridor': {
      city: 'Bangalore',
      secRating: 'SEC A/B (Startup Employees, College Students & Foodies)',
      footfallDaily: '75,000+ Footfall/Day',
      matchScore: 96,
      schoolsAndColleges: ['Christ University', 'Jyoti Nivas College', 'St. John’s Campus'],
      mallsAndHighStreets: ['Nexus Koramangala Mall', '80ft Road Food Street', 'Forum Mall Strip'],
      economicProfile: 'Dense Student & Startup Corridor, High Engagement for Beverage & Apps',
      peakHours: '11:00 AM – 09:00 PM',
      recommendedPromoters: 20
    },
    'Bandra Bandstand & Linking Road': {
      city: 'Mumbai',
      secRating: 'SEC A+ (Bollywood, Fashion & Elite Urban Shoppers)',
      footfallDaily: '90,000+ Footfall/Day',
      matchScore: 97,
      schoolsAndColleges: ['St. Andrew’s College', 'Rizvi College', 'National College Bandra'],
      mallsAndHighStreets: ['Linking Road Shopping Strip', 'Hill Road Boutique Arcades', 'Carter Road Promenade'],
      economicProfile: 'High Fashion & Luxury Retail Hub, Influencer & Sampling High Response',
      peakHours: '04:00 PM – 09:30 PM',
      recommendedPromoters: 18
    }
  };

  const currentGeoInfo = geoIntelligenceDb[formData.targetArea] || geoIntelligenceDb['T. Nagar & Ranganathan Street'];

  // Interest Categories for FB-style Audience Targeting
  const interestOptions = [
    'Foodies & Coffee Lovers',
    'College & Student Youth',
    'Fashion & Shopping',
    'Fitness & Wellness',
    'Tech & IT Professionals',
    'Young Families & Parents',
    'Auto & Mobility',
    'D2C Brand Enthusiasts',
    'Music & Festival Outings'
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.selectedInterests.includes(interest);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter(i => i !== interest) };
      } else {
        return { ...prev, selectedInterests: [...prev.selectedInterests, interest] };
      }
    });
  };

  // Dynamic Meta Ads-Style Audience Calculation Engine
  const calculateOutcome = (data) => {
    const numBudget = parseInt(data.budget, 10) || 35000;
    const numWorkers = parseInt(data.workersRequired, 10) || 15;
    const radius = parseInt(data.radiusKm, 10) || 3;
    const geo = geoIntelligenceDb[data.targetArea] || geoIntelligenceDb['T. Nagar & Ranganathan Street'];

    // 1. Base Gross Footfall Pool in Selected Area Node & Radius
    const rawFootfallBase = parseInt((geo.footfallDaily || '80000').replace(/[^0-9]/g, ''), 10) || 80000;
    const radiusMultiplier = 1 + (radius - 1) * 0.25; // 1km = 1.0x, 3km = 1.5x, 5km = 2.0x, 10km = 3.25x
    const grossFootfallPool = Math.round(rawFootfallBase * radiusMultiplier);

    // 2. Demographic Filters (Age, Gender, SEC, Occupation, Life Stage, Interests)
    const ageSpan = Math.max(5, (data.ageRange[1] - data.ageRange[0]));
    const ageRatio = Math.min(1.0, ageSpan / 45);

    const genderRatio = data.gender === 'All' ? 1.0 : 0.49;

    let secRatio = 0.55;
    if (data.secCategory.includes('SEC A+')) secRatio = 0.18;
    else if (data.secCategory.includes('SEC A/B')) secRatio = 0.52;
    else secRatio = 0.85;

    const interestCount = data.selectedInterests ? data.selectedInterests.length : 3;
    const interestSpecificity = Math.max(0.20, 1.0 - (interestCount * 0.05));

    // Addressable Targeted Consumer Audience Match
    const targetedAudienceMatch = Math.round(grossFootfallPool * ageRatio * genderRatio * secRatio * interestSpecificity);

    // 3. Physical Promoter Execution Capacity
    const shiftHours = data.shiftTiming.includes('Full Day') ? 8 : 5;
    const hourlyEngagementsPerPromoter = 42;
    const maxPhysicalCapacity = numWorkers * shiftHours * hourlyEngagementsPerPromoter;

    const estimatedEngagements = Math.min(maxPhysicalCapacity, Math.max(200, Math.round(targetedAudienceMatch * 0.35)));

    // Conversion rate to Verified Leads
    let conversionRate = 0.14;
    if (data.objective === 'Lead generation') conversionRate = 0.26;
    if (data.objective === 'App downloads') conversionRate = 0.18;
    if (data.objective === 'Store opening') conversionRate = 0.22;
    if (data.objective === 'Flyer distribution') conversionRate = 0.08;

    const estimatedLeads = Math.round(estimatedEngagements * conversionRate);
    const costPerLead = estimatedLeads > 0 ? Math.round(numBudget / estimatedLeads) : 0;
    const costPerEngagement = estimatedEngagements > 0 ? Math.round(numBudget / estimatedEngagements) : 0;

    let reachGauge = 'Optimal Target';
    let reachGaugeColor = 'text-green-700 bg-green-100 border-green-300';
    if (targetedAudienceMatch < 10000) {
      reachGauge = 'Too Narrow / Specific';
      reachGaugeColor = 'text-amber-800 bg-amber-100 border-amber-300';
    } else if (targetedAudienceMatch > 160000) {
      reachGauge = 'Broad Mass Reach';
      reachGaugeColor = 'text-blue-800 bg-blue-100 border-blue-300';
    }

    const workerDailyPayoutRate = 800;
    const workerPayoutTotal = numWorkers * workerDailyPayoutRate;
    const platformEscrowFee = Math.round(numBudget * 0.10);
    const logisticsAudit = Math.max(0, numBudget - workerPayoutTotal - platformEscrowFee);

    return {
      grossFootfallPool: `${grossFootfallPool.toLocaleString('en-IN')} Footfall/Day`,
      targetedAudienceMatch: targetedAudienceMatch.toLocaleString('en-IN'),
      estimatedReach: `${(targetedAudienceMatch * 2.5).toLocaleString('en-IN')} Impressions`,
      estimatedInteractions: `${estimatedEngagements.toLocaleString('en-IN')} Engagements`,
      estimatedLeads: `${estimatedLeads.toLocaleString('en-IN')} Verified Leads`,
      costPerLead: `₹${costPerLead}`,
      costPerEngagement: `₹${costPerEngagement}`,
      reachGauge,
      reachGaugeColor,
      workerPayout: `₹${workerPayoutTotal.toLocaleString('en-IN')}`,
      platformFee: `₹${platformEscrowFee.toLocaleString('en-IN')}`,
      logisticsAudit: `₹${logisticsAudit.toLocaleString('en-IN')}`,
      totalCost: `₹${numBudget.toLocaleString('en-IN')}`
    };
  };

  const outcome = calculateOutcome(formData);

  const handleLaunch = () => {
    onPublish({
      name: formData.name,
      brand: formData.brand,
      objective: formData.objective,
      city: currentGeoInfo.city || 'Chennai',
      budget: `₹${parseInt(formData.budget).toLocaleString('en-IN')}`,
      workers: formData.workersRequired,
      locations: 1,
      targetCpl: outcome.costPerLead,
      actualCpl: outcome.costPerLead,
      status: true,
      stage: 'Live'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/70 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white text-espresso border border-espresso/15 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh] font-sans">
        
        {/* Top Header — Meta Ads Manager Style */}
        <div className="p-4 px-6 border-b border-espresso/10 flex items-center justify-between bg-espresso text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold text-espresso flex items-center justify-center font-black text-sm shadow-md">
              Z
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30 uppercase">
                  Meta Ads Style Console
                </span>
                <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">
                  Campaign Studio
                </h2>
              </div>
              <p className="text-[11px] text-linen/70 mt-0.5">
                Demographic & Geofence Intelligence Engine for Offline Deployments
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 1 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              1. Objective
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 2 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              2. Demographics & Interests
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 3 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              3. Geofence & POI Intelligence
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 4 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              4. Launch
            </span>
          </div>

          <button onClick={onClose} className="text-linen/70 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Main 2-Column Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow overflow-y-auto">
          
          {/* Left Main Form Column (8 cols) */}
          <div className="lg:col-span-8 p-6 space-y-6 text-xs text-espresso border-b lg:border-b-0 lg:border-r border-espresso/10">
            
            {/* STEP 1: Campaign Objective & Core Details */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 1: Campaign Objective Setup
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Select your core marketing outcome. Ziggers configures promoter briefings, geofence parameters, and lead capture methods to match your goal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                      placeholder="e.g. T. Nagar Store Launch & Product Sampling"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Business / Brand Name *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                      placeholder="e.g. Artisan Cafe, D2C Beverage, Fashion Brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                    Choose Primary Objective (Structured Meta Ads Categories) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {objectives.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, objective: obj.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          formData.objective === obj.id
                            ? 'border-gold bg-gold/15 text-espresso ring-2 ring-gold/40 shadow-xs font-bold'
                            : 'border-espresso/10 bg-white text-muted hover:border-gold hover:text-espresso'
                        }`}
                      >
                        <span className="text-2xl p-2 rounded-xl bg-linen/50 shrink-0">{obj.icon}</span>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-xs text-espresso">{obj.title}</h4>
                            <span className="text-[8px] font-mono font-bold bg-espresso/5 px-1.5 py-0.5 rounded text-muted">
                              {obj.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted leading-relaxed">{obj.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Demographics & Target Audience Profile (FB Ads Ergonomics) */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 2: Target Demographics & Interest Affinity
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Configure target consumer demographics. Ziggers uses this profile to select promoter profiles and recommend high-density venue POIs.
                  </p>
                </div>

                {/* Age & Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Age Range Slider */}
                  <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted">
                      <span className="flex items-center gap-1"><Users size={12} className="text-gold" /> Target Age Bracket</span>
                      <span className="text-espresso font-mono font-extrabold">{formData.ageRange[0]} – {formData.ageRange[1]} Years</span>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="range"
                        min="16"
                        max="60"
                        value={formData.ageRange[1]}
                        onChange={(e) => setFormData({ ...formData, ageRange: [formData.ageRange[0], parseInt(e.target.value)] })}
                        className="w-full accent-gold cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted">
                      <span>16 (Youth/Gen-Z)</span>
                      <span>35 (Working Pros)</span>
                      <span>60+ (Senior)</span>
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      Gender Targeting
                    </span>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['All', 'Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            formData.gender === g
                              ? 'bg-espresso text-white border-espresso shadow-xs'
                              : 'bg-linen/20 text-espresso border-espresso/15 hover:border-gold'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* SEC Economic Classification */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Economic SEC Bracket (Purchasing Power & Household Income) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'SEC A+ (Ultra-High Income > ₹1.5L/mo)', name: 'SEC A+ Ultra-High', desc: 'Luxury, Premium D2C, High Ticket > ₹1.5L/mo' },
                      { id: 'SEC A/B (Mid-High Income ₹55k–₹1.4L/mo)', name: 'SEC A/B Mid-to-High', desc: 'Working Pros, College Youth ₹55k–₹1.4L/mo' },
                      { id: 'SEC B/C (Mass Market)', name: 'SEC B/C Mass Market', desc: 'General Trade, Daily Essentials & Retail' }
                    ].map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, secCategory: sec.id })}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.secCategory === sec.id
                            ? 'border-gold bg-gold/15 text-espresso font-bold ring-2 ring-gold/30'
                            : 'border-espresso/10 bg-white text-muted hover:border-gold'
                        }`}
                      >
                        <h5 className="font-extrabold text-xs text-espresso">{sec.name}</h5>
                        <p className="text-[9px] text-muted mt-1 leading-tight">{sec.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occupation & Persona Segment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Occupation & Professional Persona *
                    </label>
                    <select
                      value={formData.occupationSegment}
                      onChange={(e) => setFormData({ ...formData, occupationSegment: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="College & Campus Students">College & Campus Students</option>
                      <option value="IT & Tech Software Engineers">IT & Tech Software Engineers</option>
                      <option value="Corporate Executives & Office Workers">Corporate Executives & Office Workers</option>
                      <option value="Homemakers & Household Buyers">Homemakers & Household Buyers</option>
                      <option value="Business Owners & Entrepreneurs">Business Owners & Entrepreneurs</option>
                      <option value="Retail & Gig Economy Workers">Retail & Gig Economy Workers</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Household Life Stage *
                    </label>
                    <select
                      value={formData.lifeStage}
                      onChange={(e) => setFormData({ ...formData, lifeStage: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="Young Single / Gen-Z (18-24)">Young Single / Gen-Z (18-24)</option>
                      <option value="Newlyweds & Young Couples (25-32)">Newlyweds & Young Couples (25-32)</option>
                      <option value="Parents with Toddlers / School Kids">Parents with Toddlers / School Kids</option>
                      <option value="Parents with Teens / College Kids">Parents with Teens / College Kids</option>
                      <option value="Joint & Senior Household">Joint & Senior Household</option>
                    </select>
                  </div>
                </div>

                {/* Shopping Habits & Promoter Language Matching */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Consumer Shopping & Tech Habit
                    </label>
                    <select
                      value={formData.shoppingHabit}
                      onChange={(e) => setFormData({ ...formData, shoppingHabit: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="Quick-Commerce & E-Commerce Shoppers">Quick-Commerce (Zepto/Blinkit/Swiggy Buyers)</option>
                      <option value="High-Street & Weekend Mall Shoppers">High-Street & Weekend Mall Shoppers</option>
                      <option value="Fitness & Organic Lifestyle Buyers">Fitness & Organic Lifestyle Buyers</option>
                      <option value="iOS / iPhone Heavy Users (> ₹50k Devices)">iOS / iPhone Heavy Users (&gt; ₹50k Devices)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Promoter Spoken Language Requirement
                    </label>
                    <select
                      value={formData.promoterLanguage}
                      onChange={(e) => setFormData({ ...formData, promoterLanguage: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="Multi-Lingual Metro Promoters (English + Regional)">Multi-Lingual Metro Promoters (English + Regional)</option>
                      <option value="Fluent English & Corporate Presentable">Fluent English & Corporate Presentable</option>
                      <option value="Regional Tamil / Kannada / Telugu / Hindi Native">Regional Native Dialect Specialists</option>
                    </select>
                  </div>
                </div>

                {/* Audience Interest Affinities */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Detailed Consumer Interest & Affinity Pills (Meta Ads Style)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Foodies & Coffee Lovers',
                      'College & Student Youth',
                      'Fashion & Shopping',
                      'Fitness & Wellness',
                      'Tech & IT Professionals',
                      'Young Families & Parents',
                      'Auto & Mobility',
                      'D2C Brand Enthusiasts',
                      'Music & Festival Outings',
                      'Gaming & Esports',
                      'FinTech & Crypto Users',
                      'Gourmet & Specialty Dining',
                      'Beauty & Personal Care'
                    ].map((interest) => {
                      const selected = formData.selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            selected
                              ? 'bg-gold text-espresso border-gold shadow-2xs font-extrabold'
                              : 'bg-white text-espresso border-espresso/15 hover:border-gold'
                          }`}
                        >
                          {selected ? '✓ ' : '+ '}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: Hyper-Local Geofence & POI Intelligence Mapping (T. Nagar, OMR, etc.) */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 3: Geofence & POI Infrastructure Intelligence
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Map your target area to view nearby schools, malls, economic ratings, and peak engagement hours.
                  </p>
                </div>

                {/* Target Area Dropdown & Radius */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Select Target Area / Hotspot Node *
                    </label>
                    <select
                      value={formData.targetArea}
                      onChange={(e) => setFormData({ ...formData, targetArea: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso font-extrabold focus:outline-none focus:border-gold"
                    >
                      {Object.keys(geoIntelligenceDb).map((area) => (
                        <option key={area} value={area}>
                          📍 {area} ({geoIntelligenceDb[area].city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                      <span>Geofence Radius Limit</span>
                      <span className="text-gold font-mono font-extrabold">{formData.radiusKm} KM Radius</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.radiusKm}
                      onChange={(e) => setFormData({ ...formData, radiusKm: parseInt(e.target.value) })}
                      className="w-full accent-gold cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Hyper-Local POI & Demographic Intelligence Dashboard Card */}
                <div className="bg-espresso text-white rounded-3xl p-5 space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gold" size={18} />
                      <h3 className="font-extrabold text-sm text-white">
                        POI Intelligence: {formData.targetArea}
                      </h3>
                    </div>
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {currentGeoInfo.matchScore}% Audience Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    
                    {/* Schools & Colleges */}
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <School size={12} /> Nearby Schools & Colleges
                      </span>
                      <ul className="text-[11px] text-linen/90 space-y-1 pt-1 font-medium">
                        {currentGeoInfo.schoolsAndColleges.map((s, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-gold">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Malls & Shopping Streets */}
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag size={12} /> Malls & High Streets
                      </span>
                      <ul className="text-[11px] text-linen/90 space-y-1 pt-1 font-medium">
                        {currentGeoInfo.mallsAndHighStreets.map((m, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-gold">•</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Economic Rating & Footfall */}
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 sm:col-span-2 lg:col-span-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Building size={12} /> Economic Profile & Peak Hours
                      </span>
                      <p className="text-[10px] text-linen/80 leading-relaxed pt-1">
                        {currentGeoInfo.secRating}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-gold font-bold">
                        <span>🔥 {currentGeoInfo.footfallDaily}</span>
                        <span>⏰ {currentGeoInfo.peakHours.split(' (')[0]}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Shift Timing & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Recommended Shift Timing
                    </label>
                    <select
                      value={formData.shiftTiming}
                      onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2 text-xs text-espresso font-semibold"
                    >
                      <option value="Evening Prime (04:00 PM - 09:00 PM)">Evening Prime (04:00 PM - 09:00 PM)</option>
                      <option value="Lunch Rush (11:30 AM - 03:00 PM)">Lunch Rush (11:30 AM - 03:00 PM)</option>
                      <option value="Full Day (10:00 AM - 06:00 PM)">Full Day (10:00 AM - 06:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Field Promoter Brief & Guidelines
                    </label>
                    <input
                      type="text"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2 text-xs text-espresso"
                      placeholder="e.g. Hand out sample drink vouchers and capture phone OTP..."
                    />
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4: Staffing, Budget & Instant Dispatch */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 4: Promoter Staffing, Budget & Verification Rules
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Configure promoter headcount, campaign budget, and biometric GPS verification rules.
                  </p>
                </div>

                {/* Promoters Required & Budget Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                      <span>Promoter Headcount Required</span>
                      <span className="text-gold font-mono font-extrabold">{formData.workersRequired} Promoters</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={formData.workersRequired}
                      onChange={(e) => setFormData({ ...formData, workersRequired: parseInt(e.target.value) })}
                      className="w-full accent-gold cursor-pointer mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Total Campaign Budget *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted text-xs">₹</span>
                      <input
                        type="number"
                        step="5000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 35000 })}
                        className="w-full bg-white border border-espresso/15 rounded-xl pl-8 pr-3 py-2 text-xs font-extrabold text-espresso font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Audit & Security Guarantees */}
                <div className="bg-white border border-espresso/10 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-bold text-espresso uppercase tracking-wider block flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-600" /> Automated Execution & Audit Protocol
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-muted font-medium">
                    <div className="p-2.5 bg-linen/20 rounded-xl border border-espresso/5 flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span> GPS 50m Radius Geofencing
                    </div>
                    <div className="p-2.5 bg-linen/20 rounded-xl border border-espresso/5 flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span> Watermarked Photos & Videos
                    </div>
                    <div className="p-2.5 bg-linen/20 rounded-xl border border-espresso/5 flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span> Instant Standby Replacements
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Meta-Style Live Forecast & Estimate Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-linen/20 space-y-5 text-xs text-espresso flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Audience Reach Gauge Header */}
              <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                    <Target size={12} className="text-gold" /> Audience Reach Gauge
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${outcome.reachGaugeColor}`}>
                    {outcome.reachGauge}
                  </span>
                </div>

                {/* Meter Visual */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-linen/60 rounded-full overflow-hidden flex">
                    <div className="w-1/4 bg-yellow-400"></div>
                    <div className="w-2/4 bg-green-500"></div>
                    <div className="w-1/4 bg-blue-500"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-muted">
                    <span>Specific</span>
                    <span className="text-green-700 font-bold">Optimal Target</span>
                    <span>Broad Mass</span>
                  </div>
                </div>

                {/* Target Audience Numbers Box */}
                <div className="pt-2 border-t border-espresso/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] text-muted font-mono uppercase block font-bold">Matched Audience Pool</span>
                    <strong className="text-espresso font-mono text-sm font-black">{outcome.targetedAudienceMatch} Consumers</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-muted font-mono uppercase block font-bold">Daily Footfall</span>
                    <span className="text-[10px] text-gold font-mono font-bold">{outcome.grossFootfallPool.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Target Summary Specs */}
              <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs space-y-2 font-medium">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block border-b border-espresso/10 pb-1.5">
                  Targeting Summary
                </span>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted">Target Area:</span>
                    <span className="font-bold text-espresso">{formData.targetArea.split(' &')[0]} ({formData.radiusKm}km)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Age Bracket:</span>
                    <span className="font-bold font-mono">{formData.ageRange[0]} – {formData.ageRange[1]} Yrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Gender:</span>
                    <span className="font-bold">{formData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">SEC Category:</span>
                    <span className="font-bold text-gold text-[10px]">{formData.secCategory.split(' (')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Persona:</span>
                    <span className="font-bold text-espresso text-[10px]">{formData.occupationSegment.split(' &')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Life Stage:</span>
                    <span className="font-bold text-espresso text-[10px]">{formData.lifeStage.split(' /')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Interests Selected:</span>
                    <span className="font-bold font-mono text-gold text-[10px]">{formData.selectedInterests.length} Categories</span>
                  </div>
                </div>
              </div>

              {/* Algorithmic Estimate Yield */}
              <div className="bg-espresso text-white p-4 rounded-2xl shadow-md space-y-3 border border-white/10">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles size={12} /> Projected Campaign Yield
                </span>

                <div className="space-y-2 font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Est. Engagements:</span>
                    <strong className="text-white text-xs">{outcome.estimatedInteractions}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Est. Verified Leads:</span>
                    <strong className="text-gold text-xs">{outcome.estimatedLeads}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Cost-Per-Lead (CPL):</span>
                    <strong className="text-green-400 text-xs">{outcome.costPerLead}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Total Budget Card */}
            <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-muted uppercase block">Total Escrow Budget</span>
                <span className="text-lg font-extrabold text-espresso font-mono">{outcome.totalCost}</span>
              </div>
              <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                Escrow Protected
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Footer Navigation Bar */}
        <div className="p-4 px-6 border-t border-espresso/10 bg-linen/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 bg-white hover:bg-linen text-espresso font-bold px-4 py-2 rounded-xl text-xs border border-espresso/15 cursor-pointer shadow-2xs transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm ml-auto transition-all"
            >
              Next Step <ArrowRight size={14} className="text-gold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-espresso font-black px-7 py-3 rounded-xl text-xs cursor-pointer shadow-lg ml-auto uppercase tracking-wider transition-all transform hover:scale-102"
            >
              <Zap size={16} />
              <span>🚀 Deploy Campaign</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
