"use client";
import React, { useState, useEffect } from 'react';
import { 
  Radio, Layers, MapPin, Users, Target, ShieldCheck, ArrowRight, 
  Sparkles, RefreshCw, CheckCircle2, AlertCircle, QrCode, Download, 
  ExternalLink, BarChart2, Clock, DollarSign, Activity, Play, 
  Database, Share2, Smartphone, Cpu, Check, Copy, ChevronRight, Zap, Filter
} from 'lucide-react';

export default function SignalSyncDashboard({ onDeployCampaign, onLogAction, campaigns: initialPlatformCampaigns = [] }) {
  // Navigation Subtabs
  const [activeSubTab, setActiveSubTab] = useState('overview'); 
  // 'overview', 'sources', 'digitalInsights', 'contextMatching', 'recommendations', 'comparison', 'telemetry', 'crm', 'ml'

  // Providers & Campaigns State
  const [providers, setProviders] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  
  // Platform (Ziggers Execute) Campaigns vs Meta Connected Campaigns
  const [platformCampaigns, setPlatformCampaigns] = useState(initialPlatformCampaigns);
  const [metaCampaigns, setMetaCampaigns] = useState([]);
  const [selectedSourceType, setSelectedSourceType] = useState('PLATFORM'); // 'PLATFORM' or 'META'
  
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [insights, setInsights] = useState(null);
  const [syncAnalysis, setSyncAnalysis] = useState(null);
  
  // Controls & Loading State
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [budgetVal, setBudgetVal] = useState(250000);
  const [durationDays, setDurationDays] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(null);

  // Telemetry & Consents State
  const [telemetryEvents, setTelemetryEvents] = useState([]);
  const [consentedLeads, setConsentedLeads] = useState([]);
  const [mlSummary, setMlSummary] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Initial Load: Fetch Providers, Platform Campaigns, Meta Campaigns and auto-adapt
  useEffect(() => {
    initSignalSync();
    fetchProviders();
    fetchTelemetry();
    fetchConsents();
    fetchMlSummary();
  }, []);

  // Sync if prop campaigns change
  useEffect(() => {
    if (initialPlatformCampaigns && initialPlatformCampaigns.length > 0) {
      setPlatformCampaigns(initialPlatformCampaigns);
      if (!selectedCampaign) {
        handleCampaignSelect(initialPlatformCampaigns[0], 'PLATFORM');
      }
    }
  }, [initialPlatformCampaigns]);

  const initSignalSync = async () => {
    setIsLoading(true);
    try {
      let currentPlatformCamps = initialPlatformCampaigns;
      
      // If no platform campaigns passed via props, fetch from API
      if (!currentPlatformCamps || currentPlatformCamps.length === 0) {
        try {
          const res = await fetch('/api/campaigns');
          const data = await res.json();
          if (data.success && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
            currentPlatformCamps = data.campaigns;
            setPlatformCampaigns(data.campaigns);
          }
        } catch (e) {
          console.warn('Failed loading platform campaigns for Signal Sync:', e.message);
        }
      }

      // Fetch Meta connected campaigns
      let currentMetaCamps = [];
      try {
        const res = await fetch('/api/signal-providers/meta/campaigns');
        const data = await res.json();
        if (data.success && Array.isArray(data.campaigns)) {
          currentMetaCamps = data.campaigns;
          setMetaCampaigns(data.campaigns);
          if (data.selectedAccountId) setSelectedAccountId(data.selectedAccountId);
        }
      } catch (e) {
        console.warn('Failed loading meta campaigns for Signal Sync:', e.message);
      }

      // Intelligently select active campaign (prioritize user's active platform campaign)
      if (currentPlatformCamps && currentPlatformCamps.length > 0) {
        const activeCamp = currentPlatformCamps[0];
        setSelectedSourceType('PLATFORM');
        setSelectedCampaignId(activeCamp.id || activeCamp.campaign_id);
        setSelectedCampaign(activeCamp);
        if (activeCamp.city) setSelectedCity(activeCamp.city);
        const bVal = parseInt(String(activeCamp.spend || activeCamp.totalBudget || activeCamp.guaranteed_payout || 250000).replace(/[^0-9]/g, ''), 10) || 250000;
        setBudgetVal(bVal);
        await runAnalysis(activeCamp, { city: activeCamp.city, budget: bVal });
      } else if (currentMetaCamps && currentMetaCamps.length > 0) {
        const activeCamp = currentMetaCamps[0];
        setSelectedSourceType('META');
        setSelectedCampaignId(activeCamp.campaignId);
        setSelectedCampaign(activeCamp);
        const bVal = activeCamp.spend || 250000;
        setBudgetVal(bVal);
        await runAnalysis(activeCamp, { budget: bVal });
      }
    } catch (err) {
      console.error('Signal Sync init error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/signal-providers');
      const data = await res.json();
      if (data.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
      }
    } catch (e) {
      console.warn('Providers fetch error:', e.message);
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/signal-events');
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setTelemetryEvents(data.events);
      }
    } catch (e) {
      console.warn('Telemetry fetch error:', e.message);
    }
  };

  const fetchConsents = async () => {
    try {
      const res = await fetch('/api/first-party/consent');
      const data = await res.json();
      if (data.success && Array.isArray(data.consents)) {
        setConsentedLeads(data.consents);
      }
    } catch (e) {
      console.warn('Consents fetch error:', e.message);
    }
  };

  const fetchMlSummary = async () => {
    try {
      const res = await fetch('/api/ml/feedback');
      const data = await res.json();
      if (data.success) {
        setMlSummary(data);
      }
    } catch (e) {
      console.warn('ML summary fetch error:', e.message);
    }
  };

  const runAnalysis = async (targetCampaign, overrides = {}) => {
    if (!targetCampaign) return;
    setIsLoading(true);
    try {
      const cityToUse = overrides.city || selectedCity || targetCampaign.city || 'Chennai';
      const rawBudgetToUse = overrides.budget || budgetVal || targetCampaign.budgetInr || targetCampaign.budget || targetCampaign.spend || targetCampaign.guaranteed_payout || 75000;
      const budgetToUse = parseInt(String(rawBudgetToUse).replace(/[^0-9]/g, ''), 10) || 75000;
      const daysToUse = overrides.durationDays || durationDays || 3;

      const res = await fetch('/api/signal-sync/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign: targetCampaign,
          campaignId: targetCampaign.id || targetCampaign.campaign_id || targetCampaign.campaignId,
          campaignName: targetCampaign.name || targetCampaign.title,
          brand: targetCampaign.brand || targetCampaign.brand_name,
          objective: targetCampaign.objective || targetCampaign.campaign_type,
          city: cityToUse,
          budgetInr: budgetToUse,
          durationDays: daysToUse
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyncAnalysis(data);
        setInsights(data.digitalProfile);
      }
    } catch (e) {
      console.error('Analysis fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignSelect = (camp, type = null) => {
    const srcType = type || (camp.accountId ? 'META' : 'PLATFORM');
    setSelectedSourceType(srcType);
    setSelectedCampaignId(camp.id || camp.campaign_id || camp.campaignId);
    setSelectedCampaign(camp);
    const city = camp.city || selectedCity;
    const rawCampBudget = camp.budgetInr || camp.budget || camp.spend || camp.totalBudget || camp.guaranteed_payout || 75000;
    const bVal = parseInt(String(rawCampBudget).replace(/[^0-9]/g, ''), 10) || 75000;
    setBudgetVal(bVal);
    runAnalysis(camp, { city, budget: bVal });
  };

  const handleDeployToExecute = async () => {
    if (!syncAnalysis?.recommendation) return;
    setIsDeploying(true);
    try {
      const res = await fetch('/api/campaign/from-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executionPayload: syncAnalysis.recommendation.executionPayload
        })
      });
      const data = await res.json();
      if (data.success) {
        setDeploymentSuccess(data.campaign);
        if (onLogAction) {
          onLogAction('SIGNAL_SYNC_DEPLOYED', `Deployed "${data.campaign.name}" from Meta Signal Sync.`);
        }
        if (onDeployCampaign) {
          onDeployCampaign(data.campaign);
        }
      }
    } catch (e) {
      console.error('Deployment error:', e.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportConsents = (format = 'CSV') => {
    if (format === 'CSV') {
      window.open('/api/first-party/consent?format=CSV', '_blank');
    } else {
      window.open('/api/first-party/consent?format=META_CAPI', '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-espresso text-white p-6 sm:p-7 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gold text-espresso flex items-center justify-center font-black text-sm shadow-xs">
                <Radio size={18} />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest block">
                  Enterprise Adtech & Spatial Intelligence
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ziggers Signal Sync
                </h1>
              </div>
            </div>
            <p className="text-xs text-linen/70 mt-2 max-w-2xl leading-relaxed">
              Connect advertiser-authorized digital campaign intelligence with physical real-world activation.
              Translates aggregate Meta performance signals into high-precision H3 spatial targeting, staffing, and QR attribution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-right font-mono">
              <span className="text-[9px] text-linen/60 uppercase block">Privacy Standard</span>
              <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 justify-end">
                <ShieldCheck size={13} />
                <span>Zero Individual Tracking</span>
              </span>
            </div>
            <button
              onClick={() => runAnalysis(selectedCampaign)}
              disabled={isLoading}
              className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? 'Recalibrating...' : 'Sync Active Campaign'}</span>
            </button>
          </div>
        </div>

        {/* Campaign Intelligence Anchor Selector Bar */}
        <div className="mt-5 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-gold uppercase tracking-wider">
              <Target size={15} className="text-gold animate-pulse" />
              <span>Target Campaign:</span>
            </span>

            {/* Campaign Selection Dropdown */}
            <div className="relative min-w-[280px] sm:min-w-[360px]">
              <select
                value={selectedCampaignId || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const foundPlat = platformCampaigns.find(c => (c.id === id || c.campaign_id === id));
                  if (foundPlat) {
                    handleCampaignSelect(foundPlat, 'PLATFORM');
                    return;
                  }
                  const foundMeta = metaCampaigns.find(c => c.campaignId === id);
                  if (foundMeta) {
                    handleCampaignSelect(foundMeta, 'META');
                  }
                }}
                className="w-full bg-[#1c1917] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gold/40 shadow-xs cursor-pointer pr-8 focus:outline-none focus:border-gold"
              >
                {platformCampaigns.length > 0 && (
                  <optgroup label="⚡ Active Platform Campaigns (Ziggers Execute)">
                    {platformCampaigns.map(c => (
                      <option key={c.id || c.campaign_id} value={c.id || c.campaign_id}>
                        {c.name || c.title} — {c.brand || 'Enterprise'} ({c.stage || 'Live'})
                      </option>
                    ))}
                  </optgroup>
                )}
                {metaCampaigns.length > 0 && (
                  <optgroup label="📡 Connected Ad Accounts (Meta Ads Sandbox)">
                    {metaCampaigns.map(c => (
                      <option key={c.campaignId} value={c.campaignId}>
                        {c.name} — {c.brand || 'Meta Ad'}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Dynamic Campaign Meta Badges */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="bg-white/10 text-white font-bold px-2.5 py-1 rounded-lg border border-white/10">
                Brand: <strong className="text-gold font-sans">{selectedCampaign?.brand || selectedCampaign?.brand_name || syncAnalysis?.digitalProfile?.brand || 'Brand'}</strong>
              </span>
              <span className="bg-white/10 text-linen/90 px-2.5 py-1 rounded-lg border border-white/10">
                {selectedCampaign?.objective || selectedCampaign?.campaign_type || syncAnalysis?.digitalProfile?.objective || 'Sampling'}
              </span>
              <span className="bg-white/10 text-linen/90 px-2.5 py-1 rounded-lg border border-white/10">
                📍 {selectedCity}
              </span>
              <span className="bg-green-500/20 text-green-300 font-bold px-2.5 py-1 rounded-lg border border-green-500/30">
                {selectedSourceType === 'PLATFORM' ? '● Live Platform Campaign' : '● Connected Meta Stream'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-linen/60 hidden lg:inline-block">
              {platformCampaigns.length} Platform • {metaCampaigns.length} Meta
            </span>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-bold mt-6 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Signal Flywheel', icon: <Share2 size={13} /> },
            { id: 'sources', label: '2. Signal Sources (Meta)', icon: <Database size={13} /> },
            { id: 'digitalInsights', label: '3. Digital Audience Insights', icon: <BarChart2 size={13} /> },
            { id: 'contextMatching', label: '4. Offline Context Matching', icon: <Layers size={13} /> },
            { id: 'recommendations', label: '5. Location Recommendations', icon: <MapPin size={13} /> },
            { id: 'comparison', label: '6. Digital vs Offline', icon: <Activity size={13} /> },
            { id: 'telemetry', label: '7. Live Execution & QR Attribution', icon: <QrCode size={13} /> },
            { id: 'crm', label: '8. First-Party CRM & CAPI', icon: <Smartphone size={13} /> },
            { id: 'ml', label: '9. ML Calibration Loop', icon: <Cpu size={13} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-gold text-espresso font-extrabold shadow-sm'
                  : 'text-linen/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SIGNAL FLYWHEEL OVERVIEW */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Visual Interactive Flywheel */}
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-espresso uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  The Closed-Loop Digital-to-Physical Signal Flywheel
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  How advertiser-authorized digital campaign data fuels real-world activation, captures consented first-party data, and trains predictive models.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-linen/50 text-espresso px-3 py-1 rounded-full border border-espresso/10">
                End-to-End Flywheel Active
              </span>
            </div>

            {/* Stepper Pipeline Diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 text-center text-xs">
              {[
                { step: '1', title: 'Meta Ads', sub: 'Aggregate Insights', color: 'border-blue-300 bg-blue-50/50 text-blue-950' },
                { step: '2', title: 'Digital Profile', sub: 'Demographics & Time', color: 'border-amber-300 bg-amber-50/50 text-amber-950' },
                { step: '3', title: 'H3 Context', sub: 'POI & Footfall Match', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-950' },
                { step: '4', title: 'Recommendation', sub: 'Staffing & Timing', color: 'border-purple-300 bg-purple-50/50 text-purple-950' },
                { step: '5', title: 'Ziggers Execute', sub: 'Promoters Dispatched', color: 'border-gold bg-gold/10 text-espresso font-bold' },
                { step: '6', title: 'QR Interaction', sub: 'Attributed Scans', color: 'border-orange-300 bg-orange-50/50 text-orange-950' },
                { step: '7', title: '1st-Party CRM', sub: 'Consented Opt-In', color: 'border-teal-300 bg-teal-50/50 text-teal-950' },
                { step: '8', title: 'ML Learning', sub: 'Model Calibration', color: 'border-rose-300 bg-rose-50/50 text-rose-950' },
              ].map((node, i) => (
                <div key={i} className={`p-3 rounded-2xl border ${node.color} flex flex-col justify-between space-y-1.5 relative min-h-[90px]`}>
                  <span className="w-5 h-5 rounded-full bg-espresso text-gold text-[10px] font-black mx-auto flex items-center justify-center font-mono">
                    {node.step}
                  </span>
                  <span className="font-extrabold text-[11px] block leading-tight px-0.5">{node.title}</span>
                  <span className="text-[10px] text-muted block leading-tight px-0.5">{node.sub}</span>
                </div>
              ))}
            </div>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-linen/20 border border-espresso/10 space-y-2">
                <span className="text-[10px] font-mono font-bold text-muted uppercase block">Active Digital Anchor</span>
                <h4 className="text-sm font-extrabold text-espresso truncate">
                  {syncAnalysis?.digitalProfile?.campaign_name || selectedCampaign?.name || 'Active Campaign'}
                </h4>
                <p className="text-xs text-muted">
                  Objective: <strong className="text-espresso">{syncAnalysis?.digitalProfile?.objective || selectedCampaign?.objective || 'Product Sampling'}</strong> • Top Cohort: <strong className="text-espresso">{syncAnalysis?.digitalProfile?.top_age_ranges?.[0]?.range || '20–35'} ({syncAnalysis?.digitalProfile?.brand || selectedCampaign?.brand || 'Brand'})</strong>
                </p>
                <button 
                  onClick={() => setActiveSubTab('digitalInsights')}
                  className="text-xs font-bold text-espresso flex items-center gap-1 hover:text-gold pt-1 cursor-pointer"
                >
                  <span>Inspect Digital Breakdown</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-linen/20 border border-espresso/10 space-y-2">
                <span className="text-[10px] font-mono font-bold text-muted uppercase block">Top Matched Location</span>
                <h4 className="text-sm font-extrabold text-espresso">
                  {syncAnalysis?.contextMatches?.topLocation?.locationName || 'OMR IT Corridor & Tidel Park'}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded font-mono">
                    Match: {syncAnalysis?.contextMatches?.topLocation?.offlineContextScore || 91}/100
                  </span>
                  <span className="text-xs text-muted font-mono">
                    Est. Audience: {syncAnalysis?.contextMatches?.topLocation?.metrics?.estimatedRelevantAudience?.toLocaleString() || '72,400'}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveSubTab('recommendations')}
                  className="text-xs font-bold text-espresso flex items-center gap-1 hover:text-gold pt-1 cursor-pointer"
                >
                  <span>View Full Recommendation</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-espresso text-white space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-gold uppercase block">Instant Activation Bridge</span>
                <p className="text-xs text-linen/70 leading-relaxed">
                  Deploy verified {syncAnalysis?.recommendation?.recommendedPromoterCount || 12} promoters directly into Ziggers Execute.
                </p>
                <button
                  onClick={handleDeployToExecute}
                  disabled={isDeploying}
                  className="w-full bg-gold hover:bg-gold/90 text-espresso font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Play size={13} />
                  <span>{isDeploying ? 'Deploying to Console...' : '1-Click Launch into Ziggers Execute'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deployment Feedback Banner */}
          {deploymentSuccess && (
            <div className="p-5 bg-green-50 border border-green-300 rounded-2xl flex items-center justify-between gap-4 text-xs animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-green-700 flex-shrink-0" />
                <div>
                  <h4 className="font-extrabold text-green-950 text-sm">
                    Campaign Live in Ziggers Execute: "{deploymentSuccess.name}"
                  </h4>
                  <span className="text-green-800">
                    Assigned {deploymentSuccess.workers} Promoters in {deploymentSuccess.location} • H3 Zone {deploymentSuccess.qrAttribution?.h3Cell} • Live QR Code Generated.
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setActiveSubTab('telemetry')}
                className="bg-green-800 hover:bg-green-900 text-white font-bold px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer"
              >
                Track Live Telemetry →
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SIGNAL SOURCES (META / GOOGLE / TIKTOK) */}
      {/* ========================================================================= */}
      {activeSubTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Providers Matrix & Campaign Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                  Connected Digital Signal Providers
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Authorized digital advertising connections. We only retrieve aggregate, non-personal campaign performance breakdowns.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {providers.map(p => (
                  <div 
                    key={p.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      p.isConnected 
                        ? 'bg-linen/25 border-gold/40 shadow-xs' 
                        : 'bg-linen/10 border-espresso/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-black text-espresso">{p.name}</strong>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        p.isConnected 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-linen text-muted border-espresso/10'
                      }`}>
                        {p.isConnected ? (p.isSandbox ? '● Sandbox Authorized' : '● Connected') : 'Available'}
                      </span>
                    </div>

                    {p.isConnected ? (
                      <div className="mt-3 space-y-1.5 text-xs font-mono">
                        <div className="text-muted text-[11px]">Account: <strong className="text-espresso">{p.accountName}</strong></div>
                        <div className="text-muted text-[11px]">Campaigns Available: <strong className="text-espresso">{p.campaignsAvailable}</strong></div>
                        <div className="text-muted text-[11px]">Last Sync: <span className="text-espresso">{p.lastSync}</span></div>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <span className="text-[10px] text-muted block">Direct API connector available for OAuth authorization.</span>
                        <button className="w-full text-xs font-bold bg-linen/50 hover:bg-linen text-espresso py-1.5 rounded-lg border border-espresso/10 cursor-pointer">
                          Connect Account
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Campaigns Table */}
            {platformCampaigns.length > 0 && (
              <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider flex items-center gap-2">
                      <Zap size={16} className="text-gold" />
                      <span>Active Platform Campaigns (Ziggers Execute)</span>
                    </h3>
                    <span className="text-xs text-muted">Select an active campaign from your workspace to translate and synchronize digital audience signals.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200">
                    {platformCampaigns.length} Active Campaigns
                  </span>
                </div>

                <div className="space-y-2.5">
                  {platformCampaigns.map(camp => {
                    const campId = camp.id || camp.campaign_id;
                    const isSelected = selectedCampaignId === campId && selectedSourceType === 'PLATFORM';
                    return (
                      <div 
                        key={campId}
                        onClick={() => handleCampaignSelect(camp, 'PLATFORM')}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected 
                            ? 'bg-gold/15 border-gold shadow-xs ring-1 ring-gold/40' 
                            : 'bg-linen/15 border-espresso/10 hover:border-gold/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-gold' : 'bg-green-600'}`} />
                            <strong className="text-xs font-extrabold text-espresso">{camp.name || camp.title}</strong>
                            <span className="text-[9px] font-mono font-bold text-espresso uppercase bg-white px-2 py-0.5 rounded border border-espresso/10">
                              {camp.brand || camp.brand_name || 'Brand'}
                            </span>
                            <span className="text-[9px] font-mono text-muted uppercase bg-linen px-1.5 py-0.5 rounded">
                              {camp.objective || camp.campaign_type || 'Sampling'}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted">
                            Location: <strong className="text-espresso">{camp.location || camp.location_name || `${camp.city || 'Chennai'} Hub`}</strong> • Workers: <span className="text-espresso font-medium">{camp.workers || 10}</span> • Schedule: <span className="text-espresso font-medium">{camp.schedule || 'Active'}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                          <div className="text-right">
                            <span className="text-[9px] text-muted uppercase block">Budget</span>
                            <strong className="text-espresso">{camp.spend || camp.totalBudget || `₹${(camp.guaranteed_payout || 75000).toLocaleString('en-IN')}`}</strong>
                          </div>
                          <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected ? 'bg-espresso text-gold shadow-xs' : 'bg-linen text-espresso hover:bg-gold'
                          }`}>
                            {isSelected ? '✓ Syncing' : 'Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Connected Meta Ad Accounts Campaigns Table */}
            <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider flex items-center gap-2">
                    <Database size={16} className="text-gold" />
                    <span>Connected Ad Account Campaigns (Meta Graph API / Sandbox)</span>
                  </h3>
                  <span className="text-xs text-muted">Select an authorized ad account stream to model aggregate digital performance cohorts.</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-muted bg-linen px-2.5 py-1 rounded">
                  {metaCampaigns.length} Ad Campaigns
                </span>
              </div>

              <div className="space-y-2.5">
                {metaCampaigns.map(camp => {
                  const isSelected = selectedCampaignId === camp.campaignId && selectedSourceType === 'META';
                  return (
                    <div 
                      key={camp.campaignId}
                      onClick={() => handleCampaignSelect(camp, 'META')}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-gold/15 border-gold shadow-xs ring-1 ring-gold/40' 
                          : 'bg-linen/15 border-espresso/10 hover:border-gold/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-espresso/30'}`} />
                          <strong className="text-xs font-extrabold text-espresso">{camp.name}</strong>
                          <span className="text-[9px] font-mono text-muted uppercase bg-white px-1.5 py-0.5 rounded border border-espresso/10">
                            {camp.brand || 'Meta Ad'}
                          </span>
                          <span className="text-[9px] font-mono text-muted uppercase bg-linen px-1.5 py-0.5 rounded">
                            {camp.objective}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted">
                          Context: <strong className="text-espresso">{camp.topAudienceContext || 'Audience Cohort'}</strong> • Top Region: <span className="text-espresso font-medium">{camp.topGeography || 'Chennai'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] text-muted uppercase block">Spend</span>
                          <strong className="text-espresso">₹{camp.spend?.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-muted uppercase block">CPA</span>
                          <strong className="text-green-700">₹{camp.cpa}</strong>
                        </div>
                        <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected ? 'bg-espresso text-gold shadow-xs' : 'bg-linen text-espresso hover:bg-gold'
                        }`}>
                          {isSelected ? '✓ Syncing' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Provider Connection Configuration */}
          <div className="space-y-6">
            <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                Target Activation Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">Target Metro Hub</label>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setSelectedCity(newCity);
                      runAnalysis(selectedCampaign, { city: newCity });
                    }}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 font-bold text-espresso"
                  >
                    <option value="Chennai">Chennai Metro Hub</option>
                    <option value="Bangalore">Bangalore Tech Hub</option>
                    <option value="Mumbai">Mumbai Financial Hub</option>
                    <option value="Hyderabad">Hyderabad Corridor</option>
                    <option value="Delhi NCR">Delhi NCR Central</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">Campaign Budget (₹ INR)</label>
                  <input 
                    type="number"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(Number(e.target.value))}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 font-mono font-bold text-espresso"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">Duration (Days)</label>
                  <select 
                    value={durationDays} 
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 font-bold text-espresso"
                  >
                    <option value={1}>1 Day Activation</option>
                    <option value={3}>3 Days (Weekend Push)</option>
                    <option value={7}>7 Days (Full Sprint)</option>
                    <option value={14}>14 Days (Two Weeks)</option>
                  </select>
                </div>

                <button
                  onClick={() => runAnalysis(selectedCampaign, { budget: budgetVal, durationDays, city: selectedCity })}
                  disabled={isLoading}
                  className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Sparkles size={14} className="text-gold" />
                </button>
              </div>
            </div>

            {/* Privacy Guarantee Panel */}
            <div className="bg-linen/25 border border-espresso/10 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-espresso font-extrabold text-[11px] uppercase tracking-wider">
                <ShieldCheck size={16} className="text-green-700" />
                <span>Strict Aggregation Guarantee</span>
              </div>
              <p className="text-muted leading-relaxed text-[11px]">
                Ziggers processes only authorized aggregate breakdowns (age buckets, gender share, metro region, hourly curves). No individual Meta user IDs, profiles, or cookies are ever ingested or queried.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DIGITAL AUDIENCE INSIGHTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'digitalInsights' && syncAnalysis?.digitalProfile && (
        <div className="space-y-6">
          
          {/* Top Performance Summary Matrix */}
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-0.5 rounded-full uppercase">
                  Digital Performance Summary
                </span>
                <h3 className="text-lg font-black text-espresso mt-1.5">
                  {syncAnalysis.digitalProfile.campaign_name}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[9px] text-muted uppercase block">Total Spend</span>
                  <strong className="text-espresso text-sm">₹{syncAnalysis.digitalProfile.performance_metrics?.spend?.toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-muted uppercase block">Total Reach</span>
                  <strong className="text-espresso text-sm">{syncAnalysis.digitalProfile.performance_metrics?.reach?.toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-muted uppercase block">Digital CPA</span>
                  <strong className="text-green-700 text-sm">₹{syncAnalysis.digitalProfile.performance_metrics?.cpa?.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Best Performing Audience Cohort Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-bold">Top Age Range</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.digitalProfile.top_age_ranges?.[0]?.range || '18–24'}
                </strong>
                <span className="text-[10px] text-green-700 font-mono block">Top Performing</span>
              </div>

              <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-bold">Top Gender</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.digitalProfile.top_genders?.[0]?.gender || 'All'}
                </strong>
                <span className="text-[10px] text-muted font-mono block">Balanced Split</span>
              </div>

              <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-bold">Top Geography</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.digitalProfile.top_geographies?.[0]?.location || 'Chennai'}
                </strong>
                <span className="text-[10px] text-muted font-mono block truncate">
                  {syncAnalysis.digitalProfile.top_geographies?.[0]?.region || 'South Zone'}
                </span>
              </div>

              <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-bold">Best Performing Time</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.digitalProfile.top_time_windows?.[0]?.time_window || '18:00–22:00'}
                </strong>
                <span className="text-[10px] text-gold font-mono block font-bold">Peak Evening CVR</span>
              </div>

              <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-bold">CTR</span>
                <strong className="text-base font-black text-espresso font-mono">
                  {(syncAnalysis.digitalProfile.performance_metrics?.ctr * 100).toFixed(1)}%
                </strong>
                <span className="text-[10px] text-muted block">Above Benchmark</span>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-1">
                <span className="text-[9px] text-green-800 uppercase block font-bold">Conversion Rate</span>
                <strong className="text-base font-black text-green-700 font-mono">
                  {syncAnalysis.digitalProfile.performance_metrics?.conversion_rate}%
                </strong>
                <span className="text-[10px] text-green-800 font-bold block">Trial / Leads</span>
              </div>
            </div>

            {/* Granular Breakdown Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Age Breakdowns */}
              <div className="p-4 bg-white border border-espresso/10 rounded-2xl space-y-3 text-xs">
                <h4 className="font-extrabold text-espresso uppercase tracking-wider text-[11px]">
                  Age Breakdown & Performance Score
                </h4>
                <div className="space-y-2 font-mono">
                  {syncAnalysis.digitalProfile.top_age_ranges.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-linen/20">
                      <span className="font-bold text-espresso">{a.range} yrs</span>
                      <div className="flex items-center gap-3 text-muted">
                        <span>Share: {a.share_pct}%</span>
                        <strong className="text-green-700">Score: {Math.round(a.performance_score * 100)}/100</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Breakdown */}
              <div className="p-4 bg-white border border-espresso/10 rounded-2xl space-y-3 text-xs">
                <h4 className="font-extrabold text-espresso uppercase tracking-wider text-[11px]">
                  Top Metro Regions
                </h4>
                <div className="space-y-2 font-mono">
                  {syncAnalysis.digitalProfile.top_geographies.map((geo, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-linen/20">
                      <span className="font-bold text-espresso truncate max-w-[150px]">{geo.region}</span>
                      <strong className="text-green-700">Score: {Math.round(geo.performance_score * 100)}/100</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diurnal Time Breakdown */}
              <div className="p-4 bg-white border border-espresso/10 rounded-2xl space-y-3 text-xs">
                <h4 className="font-extrabold text-espresso uppercase tracking-wider text-[11px]">
                  Hourly Diurnal Performance
                </h4>
                <div className="space-y-2 font-mono">
                  {syncAnalysis.digitalProfile.top_time_windows.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-linen/20">
                      <span className="font-bold text-espresso">{t.time_window}</span>
                      <strong className="text-gold font-bold">Score: {Math.round(t.performance_score * 100)}/100</strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Normalized Digital Signal Profile JSON Preview */}
            <div className="p-4 bg-[#0c0a09] text-white rounded-2xl border border-[#292524] space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-[#292524] pb-2 text-[#a8a29e]">
                <span className="font-mono text-[10px] font-bold text-gold uppercase">
                  Normalized Digital Signal Profile (Ziggers Internal Schema)
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(syncAnalysis.digitalProfile, null, 2), 'profileJson')}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  {copiedField === 'profileJson' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  <span>{copiedField === 'profileJson' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-[#78716c] overflow-x-auto p-1 max-h-48">
                {JSON.stringify(syncAnalysis.digitalProfile, null, 2)}
              </pre>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OFFLINE CONTEXT MATCHING (H3 SPATIAL CLUSTERS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'contextMatching' && syncAnalysis?.contextMatches && (
        <div className="space-y-6">
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                  H3 Spatial Cluster Offline Context Matching
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Multi-factor algorithmic alignment evaluating Age distributions, Fitness/POI vectors, Diurnal footfall, and Commercial affluence.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200">
                {syncAnalysis.contextMatches.evaluatedLocationsCount} Clusters Evaluated
              </span>
            </div>

            {/* Ranked Candidate Location Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {syncAnalysis.contextMatches.rankedLocations.map((loc) => (
                <div 
                  key={loc.rank}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    loc.rank === 1 
                      ? 'bg-gold/15 border-gold shadow-sm' 
                      : 'bg-linen/20 border-espresso/10 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                        loc.rank === 1 ? 'bg-espresso text-gold' : 'bg-espresso/10 text-espresso'
                      }`}>
                        #{loc.rank}
                      </span>
                      <strong className="text-sm font-extrabold text-espresso truncate">{loc.locationName}</strong>
                    </div>
                    <span className="text-xs font-black text-espresso bg-white px-2.5 py-1 rounded-lg border border-espresso/10 font-mono">
                      {loc.offlineContextScore}/100
                    </span>
                  </div>

                  {/* Subscores Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-white/80 p-2 rounded-lg border border-espresso/5">
                      <span className="text-[9px] text-muted uppercase block">Age Match</span>
                      <strong className="text-espresso">{loc.subScores?.ageMatch}/100</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-espresso/5">
                      <span className="text-[9px] text-muted uppercase block">Audience Affinity</span>
                      <strong className="text-green-700">{(loc.subScores?.interestAffinity !== undefined ? loc.subScores?.interestAffinity : loc.subScores?.fitnessAffinity) || 92}/100</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-espresso/5">
                      <span className="text-[9px] text-muted uppercase block">Footfall Score</span>
                      <strong className="text-espresso">{loc.subScores?.footfall}/100</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-espresso/5">
                      <span className="text-[9px] text-muted uppercase block">Time Match</span>
                      <strong className="text-gold font-bold">{loc.subScores?.timeMatch}/100</strong>
                    </div>
                  </div>

                  {/* Physical Audience Projections */}
                  <div className="pt-2 border-t border-espresso/10 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-muted">
                      <span>Relevant Audience:</span>
                      <strong className="text-espresso">{loc.metrics?.estimatedRelevantAudience?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Expected Interactions:</span>
                      <strong className="text-espresso">{loc.metrics?.expectedInteractions?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Confidence Level:</span>
                      <span className="text-green-700 font-bold">{loc.metrics?.confidenceLevel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LOCATION RECOMMENDATIONS & STAFFING */}
      {/* ========================================================================= */}
      {activeSubTab === 'recommendations' && syncAnalysis?.recommendation && (
        <div className="space-y-6">
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-0.5 rounded-full uppercase">
                  Ziggers Campaign Recommendation Blueprint
                </span>
                <h3 className="text-lg font-black text-espresso mt-1.5">
                  {syncAnalysis.recommendation.campaignTitle}
                </h3>
              </div>

              <button
                onClick={handleDeployToExecute}
                disabled={isDeploying}
                className="bg-espresso hover:bg-muted text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Play size={14} className="text-gold" />
                <span>{isDeploying ? 'Deploying...' : 'Approve & Launch Campaign'}</span>
              </button>
            </div>

            {/* Recommendation Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans font-bold">Recommended Promoters</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.recommendation.recommendedPromoterCount} Promoters
                </strong>
                <span className="text-[10px] text-muted block">+{syncAnalysis.recommendation.recommendedSupervisorCount} Lead</span>
              </div>

              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans font-bold">Campaign Duration</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.recommendation.recommendedDurationDays} Days
                </strong>
                <span className="text-[10px] text-muted block">{syncAnalysis.recommendation.shiftHours} hrs/shift</span>
              </div>

              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans font-bold">Optimal Shift Window</span>
                <strong className="text-base font-black text-espresso truncate block">
                  {syncAnalysis.recommendation.recommendedTimeWindow}
                </strong>
                <span className="text-[10px] text-gold font-bold block">Diurnal Peak</span>
              </div>

              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans font-bold">Physical Exposure</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.recommendation.estimatedPhysicalExposure?.toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px] text-muted block">Direct Impression</span>
              </div>

              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans font-bold">Expected Handouts</span>
                <strong className="text-base font-black text-espresso">
                  {syncAnalysis.recommendation.expectedSamples?.toLocaleString('en-IN') || syncAnalysis.recommendation.expectedInteractions?.toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px] text-green-700 font-bold block">Target Conversions</span>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-1">
                <span className="text-[9px] text-green-800 uppercase block font-sans font-bold">Expected CPL / CPS</span>
                <strong className="text-base font-black text-green-700">
                  {syncAnalysis.recommendation.expectedCpl}
                </strong>
                <span className="text-[10px] text-green-800 block">Unit Cost Estimate</span>
              </div>
            </div>

            {/* Explainable "Why this recommendation?" Section */}
            <div className="p-6 bg-linen/30 border border-espresso/10 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 border-b border-espresso/10 pb-2">
                <Activity size={16} className="text-gold" />
                <h4 className="text-xs font-black text-espresso uppercase tracking-wider">
                  Transparent Algorithmic Rationale ("Why this recommendation?")
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {syncAnalysis.recommendation.explainability?.reasons?.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-espresso/5">
                    <CheckCircle2 size={14} className="text-green-700 flex-shrink-0 mt-0.5" />
                    <span className="text-espresso font-medium leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DIGITAL VS OFFLINE COMPARISON */}
      {/* ========================================================================= */}
      {activeSubTab === 'comparison' && syncAnalysis?.digitalVsOffline && (
        <div className="space-y-6">
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-espresso/10 pb-3">
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                Digital Performance Signals vs Real-World Activation Translation
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Understand how authorized online audience response translates into high-impact physical field activation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-espresso/15 text-[10px] uppercase font-bold text-muted bg-linen/30">
                    <th className="p-3.5">Signal Vector</th>
                    <th className="p-3.5">Digital Campaign Signal (Meta)</th>
                    <th className="p-3.5">Offline Physical Activation Recommendation (Ziggers)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 font-mono">
                  {syncAnalysis.digitalVsOffline.metrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-linen/20 transition-colors">
                      <td className="p-3.5 font-sans font-extrabold text-espresso">{row.signal}</td>
                      <td className="p-3.5 text-muted font-medium bg-linen/10">{row.digital}</td>
                      <td className="p-3.5 text-espresso font-bold bg-gold/5">{row.offline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: LIVE EXECUTION & QR ATTRIBUTION TELEMETRY */}
      {/* ========================================================================= */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Real-Time Event Stream */}
            <div className="lg:col-span-2 bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-gold" />
                  <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                    Live Ziggers Signal Event Stream
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full border border-green-200">
                  ● Telemetry Stream Active
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {telemetryEvents.map(ev => (
                  <div key={ev.signal_event_id} className="p-3.5 rounded-xl border border-espresso/10 bg-linen/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-gold transition-colors font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-espresso text-gold text-[9px] font-bold">
                          {ev.event_type}
                        </span>
                        <strong className="text-espresso font-sans text-xs">{ev.promoter_name}</strong>
                      </div>
                      <span className="text-[10px] text-muted block font-sans">
                        H3 Cell: <span className="font-mono text-espresso">{ev.geo_cell}</span> • Type: {ev.interaction_type}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted whitespace-nowrap bg-white px-2 py-1 rounded border border-espresso/5">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: QR Code Attribution Hierarchy */}
            <div className="space-y-6">
              <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-espresso/10 pb-3">
                  <QrCode size={18} className="text-gold" />
                  <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                    6-Tier QR Attribution Hierarchy
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 1: Brand</span>
                    <strong className="text-espresso font-sans">{syncAnalysis?.digitalProfile?.brand || selectedCampaign?.brand || 'Brand'}</strong>
                  </div>
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 2: Campaign</span>
                    <strong className="text-espresso">{syncAnalysis?.digitalProfile?.campaign_id || selectedCampaign?.id || 'camp_sig_01'}</strong>
                  </div>
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 3: Physical Location</span>
                    <strong className="text-espresso font-sans">{syncAnalysis?.contextMatches?.topLocation?.locationName || selectedCampaign?.location || 'Central Hub'}</strong>
                  </div>
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 4: H3 Zone Index</span>
                    <strong className="text-gold">{syncAnalysis?.contextMatches?.topLocation?.h3CenterCell || '892f254f177ffff'}</strong>
                  </div>
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 5: Promoter</span>
                    <strong className="text-espresso font-sans">Promoter 482 (Vikas R.)</strong>
                  </div>
                  <div className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5">
                    <span className="text-[9px] text-muted uppercase block">Level 6: Activation Creative Format</span>
                    <strong className="text-espresso font-sans">{(syncAnalysis?.digitalProfile?.objective || selectedCampaign?.objective || '').includes('Sampling') ? 'EXPERIENTIAL_SAMPLE_UNIT_V1' : 'DIGITAL_VOUCHER_INTERACTION_V1'}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: FIRST-PARTY CRM & META CAPI EXPORT */}
      {/* ========================================================================= */}
      {activeSubTab === 'crm' && (
        <div className="space-y-6">
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                  Consented First-Party Audience Journey & CRM Export
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Physical activations generate explicit, GDPR/DPDP-compliant opt-in leads. Export to Brand CRM or Meta-approved Offline Conversions API.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportConsents('CSV')}
                  className="bg-espresso hover:bg-muted text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={13} />
                  <span>Export CRM (.CSV)</span>
                </button>
                <button
                  onClick={() => handleExportConsents('META_CAPI')}
                  className="bg-gold hover:bg-gold/90 text-espresso text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Share2 size={13} />
                  <span>Meta CAPI Payload</span>
                </button>
              </div>
            </div>

            {/* Consented Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-espresso/15 text-[10px] uppercase font-bold text-muted bg-linen/30">
                    <th className="p-3">Consent ID</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Purpose Specification</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">QR Attribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 font-mono">
                  {consentedLeads.map((c) => (
                    <tr key={c.consentId} className="hover:bg-linen/20 transition-colors">
                      <td className="p-3 font-bold text-espresso">{c.consentId}</td>
                      <td className="p-3 font-sans font-bold text-espresso">{c.brandName}</td>
                      <td className="p-3 text-muted text-[11px] font-sans truncate max-w-[200px]">{c.purpose}</td>
                      <td className="p-3 text-muted">{new Date(c.consentTimestamp).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200 text-[10px] font-bold">
                          ✓ {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-gold text-[11px]">{c.qrCodeId || 'qr_direct'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: ML CALIBRATION LOOP */}
      {/* ========================================================================= */}
      {activeSubTab === 'ml' && (
        <div className="space-y-6">
          <div className="bg-white border border-espresso/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-0.5 rounded-full uppercase">
                  Continuous Feedback Architecture
                </span>
                <h3 className="text-lg font-black text-espresso mt-1.5">
                  ML Model Calibration & Ground-Truth Moat
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200">
                Model Version: {mlSummary?.modelVersion || 'v1.2 (Active)'}
              </span>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans">Mean Forecast Accuracy</span>
                <strong className="text-xl font-black text-green-700">{mlSummary?.meanAccuracy || '94.2%'}</strong>
                <span className="text-[10px] text-muted block">Cross-Validated</span>
              </div>
              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans">Mean Error (MAPE)</span>
                <strong className="text-xl font-black text-espresso">{mlSummary?.mape || '5.8%'}</strong>
                <span className="text-[10px] text-muted block">Low Variance</span>
              </div>
              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans">Verified Observations</span>
                <strong className="text-xl font-black text-gold">{mlSummary?.verifiedObservationsCount ?? mlSummary?.totalTrainedObservations ?? 0}</strong>
                <span className="text-[10px] text-muted block">Ground-Truth Samples</span>
              </div>
              <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl space-y-1">
                <span className="text-[9px] text-muted uppercase block font-sans">Adaptive Engine</span>
                <strong className="text-sm font-black text-espresso block mt-1">Hierarchical Bayesian</strong>
                <span className="text-[10px] text-green-700 font-bold block">Active Learning Loop</span>
              </div>
            </div>

            {/* Recent Calibration Samples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-espresso uppercase tracking-wider">
                Recent Prediction vs Actual Calibration Records
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {(mlSummary?.recentFeedback || []).map(f => (
                  <div key={f.id} className="p-4 bg-linen/15 border border-espresso/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-0.5 font-sans">
                      <strong className="text-espresso block">{f.locationName}</strong>
                      <span className="text-[10px] text-muted font-mono">H3 Cell: {f.h3Cell} • Model: {f.modelVersion}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-[11px] text-right">
                      <div>
                        <span className="text-[9px] text-muted uppercase block">Predicted Reach</span>
                        <span className="text-espresso font-bold">{f.predicted.reach.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted uppercase block">Actual Reach</span>
                        <span className="text-espresso font-bold">{f.actual.reach.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted uppercase block">Error %</span>
                        <span className={`font-bold ${f.errors.reachPct > 0 ? 'text-green-700' : 'text-amber-700'}`}>
                          {f.errors.reachPct > 0 ? `+${f.errors.reachPct}%` : `${f.errors.reachPct}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
