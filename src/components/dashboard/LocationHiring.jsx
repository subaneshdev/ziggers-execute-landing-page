"use client";
import React, { useState } from 'react';
import { 
  MapPin, Users, Filter, Star, CheckCircle, ShieldCheck, 
  Search, Sliders, Zap, Award, Sparkles, Compass, Clock, 
  Send, Check, UserCheck, AlertCircle, ArrowRight, Plus
} from 'lucide-react';

export default function LocationHiring({ campaigns = [], onLogAction, onCreateClick }) {
  const activeCampaign = campaigns[0] || null;

  const [mode, setMode] = useState('geo'); // 'geo' or 'bulk'
  const [selectedHub, setSelectedHub] = useState(activeCampaign ? `${activeCampaign.city || 'Chennai'} Metro Hub` : 'OMR IT Corridor Hub, Chennai');
  const [radiusKm, setRadiusKm] = useState(3);
  const [requiredHeadcount, setRequiredHeadcount] = useState(activeCampaign ? (activeCampaign.workers || 15) : 15);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filters
  const [filterRating, setFilterRating] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterKycOnly, setFilterKycOnly] = useState(true);
  const [invitedWorkerIds, setInvitedWorkerIds] = useState(new Set());

  // Bulk Hiring State
  const [bulkCity, setBulkCity] = useState(activeCampaign ? (activeCampaign.city || 'Chennai') : 'Chennai');
  const [bulkTargetWorkers, setBulkTargetWorkers] = useState(100);
  const [bulkDispatched, setBulkDispatched] = useState(false);

  // Dynamic candidate generation based on active campaigns
  const workersPool = activeCampaign ? Array.from({ length: Math.min(12, (activeCampaign.workers || 10) * 2) }).map((_, idx) => ({
    id: `w_${idx + 1}`,
    name: `Verified Promoter ${idx + 1}`,
    avatar: idx % 2 === 0 ? '👨🏽' : '👩🏽',
    rating: (4.8 + (idx % 3) * 0.05).toFixed(2),
    completedJobs: 25 + idx * 7,
    distanceKm: (0.5 + idx * 0.4).toFixed(1),
    skills: ['Product Pitching', 'Sampling', 'Lead Generation'],
    languages: ['English', activeCampaign.city === 'Chennai' ? 'Tamil' : activeCampaign.city === 'Bangalore' ? 'Kannada' : 'Hindi'],
    gender: idx % 2 === 0 ? 'Male' : 'Female',
    kyc: true,
    experience: '2+ Years Field Experience',
    availableToday: true,
    lastCheckin: `${activeCampaign.city || 'Metro'} Geofence Node`
  })) : [];

  const filteredWorkers = workersPool.filter(w => {
    if (filterKycOnly && !w.kyc) return false;
    if (filterRating === '4.8+' && parseFloat(w.rating) < 4.8) return false;
    if (filterLanguage !== 'all' && !w.languages.includes(filterLanguage)) return false;
    return true;
  });

  const handleInviteWorker = (id, name) => {
    const next = new Set(invitedWorkerIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      if (onLogAction) {
        onLogAction('WORKER_INVITED', `Directly invited promoter ${name} for ${selectedHub} shift.`);
      }
    }
    setInvitedWorkerIds(next);
  };

  const handleBatchInvite = () => {
    const allIds = filteredWorkers.map(w => w.id);
    setInvitedWorkerIds(new Set(allIds));
    if (onLogAction) {
      onLogAction('BATCH_WORKERS_INVITED', `Batch dispatched invitations to ${filteredWorkers.length} promoters in ${selectedHub} geofence.`);
    }
    alert(`Dispatched batch shift invitations to ${filteredWorkers.length} verified promoters.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Location-Based & Bulk Workforce Hiring
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Discover and bulk-deploy verified on-ground promoters by exact location coordinates, geofence radius, and KYC validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('geo')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'geo' ? 'bg-espresso text-white shadow-xs' : 'bg-linen/40 text-espresso hover:bg-linen/70'
            }`}
          >
            <Compass size={14} className="text-gold" />
            <span>1. Geo-Radius Hiring</span>
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'bulk' ? 'bg-espresso text-white shadow-xs' : 'bg-linen/40 text-espresso hover:bg-linen/70'
            }`}
          >
            <Zap size={14} className="text-gold" />
            <span>2. Bulk 100+ Dispatch</span>
          </button>
        </div>
      </div>

      {activeCampaign ? (
        <>
          {mode === 'geo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column — Targeting Controls (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-espresso/10 p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                    <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders size={14} className="text-gold" /> Geofence Targeting
                    </span>
                    <span className="text-[9px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Active Pool
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Target Activation Hub / Location *
                    </label>
                    <input
                      type="text"
                      value={selectedHub}
                      onChange={(e) => setSelectedHub(e.target.value)}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2 text-xs font-bold text-espresso focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1">
                      <span>HIRING RADIUS DISTANCE</span>
                      <span className="text-gold font-mono font-extrabold">{radiusKm} KM Radius</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                      className="w-full accent-gold cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Promoters Needed
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={requiredHeadcount}
                        onChange={(e) => setRequiredHeadcount(parseInt(e.target.value) || 1)}
                        className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Date Required
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso"
                      />
                    </div>
                  </div>

                  {/* Worker Filters */}
                  <div className="pt-3 border-t border-espresso/10 space-y-3">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                      Fine-Grained Worker Filters
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] text-muted block mb-0.5 font-bold">Min Rating</span>
                        <select
                          value={filterRating}
                          onChange={(e) => setFilterRating(e.target.value)}
                          className="w-full bg-white border border-espresso/15 rounded-lg text-xs p-1.5 font-semibold text-espresso"
                        >
                          <option value="all">All Ratings (4.0+)</option>
                          <option value="4.8+">★ 4.8 & Above</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[9px] text-muted block mb-0.5 font-bold">Language</span>
                        <select
                          value={filterLanguage}
                          onChange={(e) => setFilterLanguage(e.target.value)}
                          className="w-full bg-white border border-espresso/15 rounded-lg text-xs p-1.5 font-semibold text-espresso"
                        >
                          <option value="all">All Languages</option>
                          <option value="English">English</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-espresso font-medium cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={filterKycOnly}
                        onChange={(e) => setFilterKycOnly(e.target.checked)}
                        className="accent-gold rounded cursor-pointer"
                      />
                      <span>Biometric Aadhaar KYC Only</span>
                      <ShieldCheck size={14} className="text-green-700 ml-auto" />
                    </label>
                  </div>

                  <button
                    onClick={handleBatchInvite}
                    className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Zap size={14} className="text-gold" />
                    <span>Instant Batch Invite ({filteredWorkers.length} Matches)</span>
                  </button>
                </div>
              </div>

              {/* Right Column — Worker Pool Roster (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white border border-espresso/10 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-espresso">
                      Available Verified Workers Nearby ({filteredWorkers.length} Promoters)
                    </h3>
                    <p className="text-xs text-muted">
                      Within {radiusKm}km of {selectedHub} • 100% Aadhaar & Face Matched
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold bg-gold/20 text-espresso px-3 py-1 rounded-xl border border-gold/30">
                    {invitedWorkerIds.size} / {requiredHeadcount} Invited
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWorkers.map((w) => {
                    const isInvited = invitedWorkerIds.has(w.id);
                    return (
                      <div
                        key={w.id}
                        className={`bg-white border rounded-2xl p-4 shadow-xs transition-all space-y-3 flex flex-col justify-between ${
                          isInvited ? 'border-gold bg-gold/5 ring-2 ring-gold/30' : 'border-espresso/10 hover:border-espresso/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl p-1 bg-linen/50 rounded-xl">{w.avatar}</span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-extrabold text-sm text-espresso">{w.name}</h4>
                                  <CheckCircle size={13} className="text-green-600" />
                                </div>
                                <span className="text-[10px] text-muted block font-medium">{w.experience}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-extrabold text-espresso bg-gold/20 px-2 py-0.5 rounded border border-gold/30 font-mono">
                                ★ {w.rating}
                              </span>
                              <span className="text-[9px] text-muted block font-mono mt-0.5">{w.completedJobs} Jobs</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-espresso/5 flex items-center justify-between text-[11px] font-mono text-muted">
                            <span className="flex items-center gap-1"><MapPin size={11} className="text-gold" /> {w.distanceKm} km away</span>
                            <span>Recent: {w.lastCheckin}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {w.skills.map((s, sIdx) => (
                              <span key={sIdx} className="text-[9px] font-bold bg-linen/50 text-espresso px-2 py-0.5 rounded border border-espresso/10">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleInviteWorker(w.id, w.name)}
                          className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isInvited
                              ? 'bg-green-700 text-white'
                              : 'bg-gold hover:bg-gold/90 text-espresso'
                          }`}
                        >
                          {isInvited ? (
                            <>
                              <Check size={14} /> Invite Sent (₹800/shift)
                            </>
                          ) : (
                            <>
                              <Send size={13} /> Direct Invite (₹800/shift)
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

          {mode === 'bulk' && (
            <div className="bg-white border border-espresso/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider bg-gold/20 px-2.5 py-0.5 rounded border border-gold/30">
                    Enterprise Bulk Dispatch Engine
                  </span>
                  <h3 className="text-xl font-extrabold text-espresso mt-1">
                    Bulk 100+ On-Ground Promoter Recruitment ({bulkCity})
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Instantly broadcast shift invitations to verified talent pools across high-density metro hubs.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setBulkDispatched(true);
                    if (onLogAction) {
                      onLogAction('BULK_DISPATCH_TRIGGERED', `Dispatched bulk recruitment invitations for 100 promoters in ${bulkCity}`);
                    }
                    alert(`Dispatched 100+ shift recruitment notices across ${bulkCity} metro hubs!`);
                  }}
                  disabled={bulkDispatched}
                  className={`px-6 py-3 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all ${
                    bulkDispatched ? 'bg-green-700 text-white' : 'bg-gold hover:bg-gold/90 text-espresso'
                  }`}
                >
                  {bulkDispatched ? '✓ Bulk Dispatch Active (100 Staff Notified)' : '🚀 Trigger Bulk 100+ Recruitment'}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <Compass size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Workforce Hiring Campaigns Active
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Deploy your first campaign to activate geofenced promoter discovery, bulk hiring, and instant shift invitations.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Hire Staff</span>
          </button>
        </div>
      )}

    </div>
  );
}
