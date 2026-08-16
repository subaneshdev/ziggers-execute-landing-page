"use client";
import React, { useState } from 'react';
import { 
  MapPin, Users, Filter, Star, CheckCircle, ShieldCheck, 
  Search, Sliders, Zap, Award, Sparkles, Compass, Clock, 
  Send, Check, UserCheck, AlertCircle, ArrowRight
} from 'lucide-react';

export default function LocationHiring({ campaigns = [], onLogAction }) {
  const [mode, setMode] = useState('geo'); // 'geo' or 'bulk'
  const [selectedHub, setSelectedHub] = useState('OMR IT Corridor Hub, Chennai');
  const [radiusKm, setRadiusKm] = useState(3);
  const [requiredHeadcount, setRequiredHeadcount] = useState(15);
  const [selectedDate, setSelectedDate] = useState('2026-08-20');
  const [shiftTime, setShiftTime] = useState('Full Day (10:00 AM - 06:00 PM)');
  
  // Filters
  const [filterRating, setFilterRating] = useState('all'); // 'all', '4.8+', '4.5+'
  const [filterLanguage, setFilterLanguage] = useState('all'); // 'all', 'Tamil', 'English', 'Hindi'
  const [filterGender, setFilterGender] = useState('all');
  const [filterKycOnly, setFilterKycOnly] = useState(true);
  const [invitedWorkerIds, setInvitedWorkerIds] = useState(new Set());

  // Bulk Hiring State
  const [bulkCity, setBulkCity] = useState('Chennai');
  const [bulkTargetWorkers, setBulkTargetWorkers] = useState(100);
  const [bulkRole, setBulkRole] = useState('Brand Promoters & Sampling Staff');
  const [bulkLocations, setBulkLocations] = useState([
    { name: 'OMR IT Corridor & Tidel Park', count: 20, status: 'Matching' },
    { name: 'Anna Nagar Commercial High Street', count: 25, status: 'Matching' },
    { name: 'Velachery & Phoenix MarketCity Hub', count: 20, status: 'Matching' },
    { name: 'Tambaram & Chromepet Metros', count: 20, status: 'Matching' },
    { name: 'T. Nagar & Usman Road Retail Arcades', count: 15, status: 'Matching' }
  ]);
  const [bulkDispatched, setBulkDispatched] = useState(false);

  // Available Workers Dataset
  const workersPool = [
    {
      id: 'w1',
      name: 'Rohit Sharma',
      avatar: '👨🏽',
      rating: 4.9,
      completedJobs: 42,
      distanceKm: 1.2,
      skills: ['Product Pitching', 'FMCG Sampling', 'Crowd Interaction'],
      languages: ['English', 'Tamil', 'Hindi'],
      gender: 'Male',
      kyc: true,
      experience: '2+ Years (Sampling & Roadshows)',
      availableToday: true,
      lastCheckin: 'Loyola College Activation'
    },
    {
      id: 'w2',
      name: 'Meera Nair',
      avatar: '👩🏽',
      rating: 4.95,
      completedJobs: 58,
      distanceKm: 0.8,
      skills: ['Lead Generation', 'App Onboarding', 'Customer Engagement'],
      languages: ['English', 'Tamil', 'Malayalam'],
      gender: 'Female',
      kyc: true,
      experience: '3 Years (Retail Activations)',
      availableToday: true,
      lastCheckin: 'Nexus Vijaya Mall'
    },
    {
      id: 'w3',
      name: 'Karthik Raja',
      avatar: '👨🏽',
      rating: 4.85,
      completedJobs: 36,
      distanceKm: 2.1,
      skills: ['FMCG Sampling', 'Crowd Handling', 'Product Demos'],
      languages: ['Tamil', 'English'],
      gender: 'Male',
      kyc: true,
      experience: '1.5 Years (Campus Activations)',
      availableToday: true,
      lastCheckin: 'OMR Metro Station'
    },
    {
      id: 'w4',
      name: 'Pooja Sundaram',
      avatar: '👩🏽',
      rating: 4.9,
      completedJobs: 51,
      distanceKm: 1.5,
      skills: ['Beauty & Cosmetics', 'Brand Ambassador', 'Lead Gen'],
      languages: ['English', 'Tamil', 'Hindi', 'Telugu'],
      gender: 'Female',
      kyc: true,
      experience: '2.5 Years (Mall & Retail Activations)',
      availableToday: true,
      lastCheckin: 'Express Avenue Mall'
    },
    {
      id: 'w5',
      name: 'Aravind Swamy',
      avatar: '👨🏽',
      rating: 4.75,
      completedJobs: 29,
      distanceKm: 2.7,
      skills: ['Retail Audits', 'Merchandising', 'Stock Count'],
      languages: ['Tamil', 'English', 'Hindi'],
      gender: 'Male',
      kyc: true,
      experience: '2 Years (Supermarket Audits)',
      availableToday: true,
      lastCheckin: 'Spencer Plaza'
    },
    {
      id: 'w6',
      name: 'Divya Krishnan',
      avatar: '👩🏽',
      rating: 4.88,
      completedJobs: 44,
      distanceKm: 1.9,
      skills: ['Sampling', 'QR Lead Capture', 'Emcee Assistant'],
      languages: ['English', 'Tamil'],
      gender: 'Female',
      kyc: true,
      experience: '2 Years (Concerts & Youth Festivals)',
      availableToday: true,
      lastCheckin: 'IIT Madras Shaastra'
    }
  ];

  const filteredWorkers = workersPool.filter(w => {
    if (w.distanceKm > radiusKm) return false;
    if (filterKycOnly && !w.kyc) return false;
    if (filterRating === '4.8+' && w.rating < 4.8) return false;
    if (filterRating === '4.9+' && w.rating < 4.9) return false;
    if (filterLanguage !== 'all' && !w.languages.includes(filterLanguage)) return false;
    if (filterGender !== 'all' && w.gender !== filterGender) return false;
    return true;
  });

  const handleInviteWorker = (worker) => {
    setInvitedWorkerIds(prev => new Set([...prev, worker.id]));
    if (onLogAction) {
      onLogAction('WORKER_INVITED', `Dispatched instant wave invite to ${worker.name} (${worker.distanceKm}km away) for ${selectedHub}`);
    }
  };

  const handleInviteAll = () => {
    const ids = filteredWorkers.map(w => w.id);
    setInvitedWorkerIds(new Set(ids));
    if (onLogAction) {
      onLogAction('BATCH_DISPATCH', `Dispatched ${filteredWorkers.length} geofenced wave invitations in ${radiusKm}km radius around ${selectedHub}`);
    }
  };

  const handleTriggerBulkHiring = () => {
    setBulkDispatched(true);
    if (onLogAction) {
      onLogAction('BULK_HEADCOUNT_DEPLOYED', `Deployed 100 promoters across 5 Chennai hub locations. Automated matching wave active.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Location-Based & Bulk Workforce Hiring</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Discover and bulk-deploy verified on-ground promoters by exact location coordinates, geofence radius, and KYC validation.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-linen/40 p-1 rounded-xl border border-espresso/10 text-xs font-bold">
          <button
            onClick={() => setMode('geo')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'geo' ? 'bg-espresso text-white shadow-sm' : 'text-espresso hover:text-gold'
            }`}
          >
            <Compass size={14} />
            <span>1. Geo-Radius Hiring</span>
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'bulk' ? 'bg-gold text-espresso font-extrabold shadow-sm' : 'text-espresso hover:text-gold'
            }`}
          >
            <Zap size={14} />
            <span>2. Bulk 100+ Dispatch</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Geo-Radius Location Hiring */}
      {mode === 'geo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Location & Radius Configuration */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-5 space-y-4 h-fit shadow-xs">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-gold" /> Geofence Targeting
              </span>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                Active Pool
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-espresso uppercase tracking-wider block mb-1">
                  Target Activation Hub / Location *
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-gold text-espresso"
                >
                  <option value="OMR IT Corridor Hub, Chennai">OMR IT Corridor Hub, Chennai</option>
                  <option value="Indiranagar 100ft Road, Bangalore">Indiranagar 100ft Road, Bangalore</option>
                  <option value="Bandra Kurla Complex (BKC), Mumbai">Bandra Kurla Complex (BKC), Mumbai</option>
                  <option value="Connaught Place Central Hub, Delhi NCR">Connaught Place Central Hub, Delhi NCR</option>
                  <option value="Phoenix MarketCity & Velachery Hub">Phoenix MarketCity & Velachery Hub</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span className="text-espresso uppercase tracking-wider">Hiring Radius Distance</span>
                  <span className="text-gold font-mono">{radiusKm} KM Radius</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-muted font-mono mt-0.5">
                  <span>1 KM (Ultra Local)</span>
                  <span>5 KM (Metro Zone)</span>
                  <span>15 KM (Wide Hub)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-espresso uppercase tracking-wider block mb-1">
                    Promoters Needed
                  </label>
                  <input
                    type="number"
                    value={requiredHeadcount}
                    onChange={(e) => setRequiredHeadcount(parseInt(e.target.value) || 1)}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-espresso uppercase tracking-wider block mb-1">
                    Date Required
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="pt-2 border-t border-espresso/10 space-y-2.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block flex items-center gap-1">
                  <Filter size={11} /> Fine-Grained Worker Filters
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-muted font-bold block mb-0.5">Min Rating</label>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-lg px-2 py-1 text-[11px]"
                    >
                      <option value="all">All Ratings (4.0+)</option>
                      <option value="4.8+">★ 4.8+ Star Rated</option>
                      <option value="4.9+">★ 4.9+ Top Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-muted font-bold block mb-0.5">Language</label>
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-lg px-2 py-1 text-[11px]"
                    >
                      <option value="all">All Languages</option>
                      <option value="Tamil">Tamil Fluent</option>
                      <option value="English">English Fluent</option>
                      <option value="Hindi">Hindi Fluent</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-linen/20 p-2 rounded-xl">
                  <span className="text-[10px] font-bold text-espresso flex items-center gap-1">
                    <ShieldCheck size={13} className="text-green-600" /> Biometric Aadhaar KYC Only
                  </span>
                  <input
                    type="checkbox"
                    checked={filterKycOnly}
                    onChange={(e) => setFilterKycOnly(e.target.checked)}
                    className="accent-gold cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleInviteAll}
                className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Zap size={14} className="text-gold" />
                <span>Instant Batch Invite ({filteredWorkers.length} Matches)</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Available Workers Discovery Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-espresso tracking-tight">
                  Available Verified Workers Nearby ({filteredWorkers.length} Promoters)
                </h3>
                <p className="text-[11px] text-muted">
                  Within {radiusKm}km of {selectedHub} • 100% Aadhaar & Face Matched
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-gold/15 text-espresso px-2.5 py-1 rounded-full">
                {invitedWorkerIds.size} / {requiredHeadcount} Invited
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkers.map((worker) => {
                const isInvited = invitedWorkerIds.has(worker.id);
                return (
                  <div 
                    key={worker.id}
                    className={`bg-white border rounded-2xl p-4.5 shadow-xs transition-all flex flex-col justify-between ${
                      isInvited ? 'border-green-400 bg-green-50/20 ring-1 ring-green-300' : 'border-espresso/10 hover:border-gold'
                    }`}
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-linen/40 rounded-xl flex items-center justify-center text-xl">
                            {worker.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-espresso text-xs">{worker.name}</h4>
                              {worker.kyc && (
                                <span title="Biometric Aadhaar KYC Verified">
                                  <ShieldCheck size={13} className="text-green-600" />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted font-medium">{worker.experience}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-espresso font-mono">
                            <Star size={12} className="text-gold fill-gold" />
                            <span>{worker.rating}</span>
                          </div>
                          <span className="text-[9px] text-muted font-mono">{worker.completedJobs} Jobs</span>
                        </div>
                      </div>

                      {/* Distance & Last Activation */}
                      <div className="my-3 bg-linen/20 p-2.5 rounded-xl text-[10px] flex items-center justify-between text-muted font-mono">
                        <span className="flex items-center gap-1 text-espresso font-bold">
                          <MapPin size={11} className="text-gold" /> {worker.distanceKm} km away
                        </span>
                        <span>Recent: {worker.lastCheckin}</span>
                      </div>

                      {/* Skills & Languages */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-linen/30 text-espresso text-[9px] font-bold px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-muted">
                          🗣️ <span className="font-semibold text-espresso">{worker.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => handleInviteWorker(worker)}
                      disabled={isInvited}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isInvited 
                          ? 'bg-green-600 text-white font-extrabold cursor-default' 
                          : 'bg-gold hover:bg-gold/90 text-espresso'
                      }`}
                    >
                      {isInvited ? (
                        <>
                          <Check size={13} />
                          <span>Invite Sent • Awaiting Acceptance</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Direct Invite (₹800/shift)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: Bulk 100+ Hiring Engine */}
      {mode === 'bulk' && (
        <div className="space-y-6">
          <div className="bg-espresso text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="max-w-2xl space-y-2 relative z-10">
              <span className="bg-gold text-espresso font-mono font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Enterprise B2B Bulk Dispatch
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">
                "Need 100 promoters across Chennai tomorrow."
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Agencies don't want to hire 50 people individually. Ziggers handles the entire pipeline: Campaign → Locations → Headcount allocation → Matching Wave Engine → Instant Selection & Deployment.
              </p>
            </div>

            {/* Quick Bulk Builder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 relative z-10 text-xs">
              <div>
                <label className="text-white/60 text-[10px] font-bold uppercase block mb-1">Target Metro</label>
                <select 
                  value={bulkCity} 
                  onChange={(e) => setBulkCity(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Chennai" className="text-black">Chennai Metro (8 Hubs)</option>
                  <option value="Bangalore" className="text-black">Bangalore Metro (12 Hubs)</option>
                  <option value="Mumbai" className="text-black">Mumbai & MMR (14 Hubs)</option>
                  <option value="Delhi NCR" className="text-black">Delhi NCR (15 Hubs)</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 text-[10px] font-bold uppercase block mb-1">Total Headcount</label>
                <input 
                  type="number" 
                  value={bulkTargetWorkers} 
                  onChange={(e) => setBulkTargetWorkers(parseInt(e.target.value) || 100)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-extrabold font-mono"
                />
              </div>

              <div>
                <label className="text-white/60 text-[10px] font-bold uppercase block mb-1">Required Role</label>
                <input 
                  type="text" 
                  value={bulkRole} 
                  onChange={(e) => setBulkRole(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleTriggerBulkHiring}
                  className="w-full bg-gold hover:bg-gold/90 text-espresso font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Zap size={14} />
                  <span>{bulkDispatched ? 'Wave 1 Dispatched ✅' : 'Execute Bulk 100 Match'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Multi-Location Allocation Table */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                  Automated Multi-Location Allocation Matrix
                </h3>
                <p className="text-xs text-muted">
                  Auto-divided across key footfall corridors with standby replacement reserves.
                </p>
              </div>
              <span className="text-xs font-mono font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Total: {bulkLocations.reduce((a, b) => a + b.count, 0)} Headcount Allocated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/20">
                    <th className="py-3 px-4">Location Corridor</th>
                    <th className="py-3 px-4">Allocated Promoters</th>
                    <th className="py-3 px-4">Standby Pool</th>
                    <th className="py-3 px-4">Wave Matching Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 font-medium">
                  {bulkLocations.map((loc, idx) => (
                    <tr key={idx} className="hover:bg-linen/10">
                      <td className="py-3.5 px-4 font-bold text-espresso flex items-center gap-2">
                        <MapPin size={13} className="text-gold" />
                        {loc.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-espresso">
                        {loc.count} Promoters
                      </td>
                      <td className="py-3.5 px-4 text-muted font-mono">
                        + {Math.round(loc.count * 0.2)} Standby Reserves
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${
                          bulkDispatched 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {bulkDispatched ? '● 100% Filled & Confirmed' : '○ Matching Wave 1 Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button className="text-[10px] font-bold text-espresso bg-linen/40 hover:bg-gold hover:text-espresso px-2.5 py-1 rounded-lg border border-espresso/10 transition-colors">
                          View Roster
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
