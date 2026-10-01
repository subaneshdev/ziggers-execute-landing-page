"use client";

import React, { useState, useEffect } from 'react';
import { 
  Database, ShieldCheck, AlertCircle, CheckCircle2, 
  ExternalLink, RefreshCw, Filter, Layers, Info, MapPin, Train, Building2, 
  Clock, ShieldAlert, FileText, ArrowRight, BookOpen, CheckSquare, 
  RotateCcw, Eye, HelpCircle, X, Search, Sparkles
} from 'lucide-react';

export default function DataLibraryDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataSources, setDataSources] = useState([]);
  const [batches, setBatches] = useState([]);
  const [totals, setTotals] = useState({ sourcesCount: 0, marketCount: 0, transitCount: 0, venueCount: 0 });
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [marketDetail, setMarketDetail] = useState(null);
  const [transitDetail, setTransitDetail] = useState(null);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('playbooks'); // default to playbooks!
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Playbook Decision Layer State
  const [playbooks, setPlaybooks] = useState([]);
  const [playbookFamilies, setPlaybookFamilies] = useState([]);
  const [evidenceSources, setEvidenceSources] = useState([]);
  const [playbookSummary, setPlaybookSummary] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedReviewFilter, setSelectedReviewFilter] = useState('All');
  const [playbookSearch, setPlaybookSearch] = useState('');
  const [activePlaybook, setActivePlaybook] = useState(null);
  const [playbookHistory, setPlaybookHistory] = useState([]);
  const [reviewerName, setReviewerName] = useState('Operations Lead');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const [previewBrief, setPreviewBrief] = useState({
    brand: 'Tata Motors',
    productOrService: 'Passenger Car SUV',
    subcategory: 'family car',
    objective: 'Completed qualified test drives',
    city: 'Chennai'
  });
  const [previewResult, setPreviewResult] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. External data summary
      const summaryRes = await fetch('/api/data-library?action=summary');
      const summary = await summaryRes.json();
      if (summary.success) {
        setDataSources(summary.sources || []);
        setTotals(summary.totals || {});
        setPlaybookSummary(summary.playbookSummary || null);
      }

      // 2. Playbooks list
      const pbRes = await fetch('/api/data-library?action=playbooks');
      const pbData = await pbRes.json();
      if (pbData.success) {
        setPlaybooks(pbData.playbooks || []);
      }

      // 3. Playbook Families
      const famRes = await fetch('/api/data-library?action=playbook_families');
      const famData = await famRes.json();
      if (famData.success) {
        setPlaybookFamilies(famData.families || []);
      }

      // 4. Playbook Evidence Sources
      const srcRes = await fetch('/api/data-library?action=playbook_sources');
      const srcData = await srcRes.json();
      if (srcData.success) {
        setEvidenceSources(srcData.sources || []);
      }

      // 5. External batches
      const batchesRes = await fetch('/api/data-library?action=batches');
      const batchesData = await batchesRes.json();
      if (batchesData.success) {
        setBatches(batchesData.batches || []);
      }

      // Initial context
      fetchMarketContext(selectedState);
      fetchTransitContext('Chennai');
      fetchVenues();
    } catch (err) {
      console.warn('Notice loading data library:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaybookDetail = async (id) => {
    try {
      const res = await fetch(`/api/data-library?action=playbook_detail&id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success && data.playbook) {
        setActivePlaybook(data.playbook);
        fetchPlaybookHistory(id);
      }
    } catch (e) {
      console.warn('Error fetching playbook detail:', e.message);
    }
  };

  const fetchPlaybookHistory = async (id) => {
    try {
      const res = await fetch(`/api/data-library?action=playbook_history&id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success) {
        setPlaybookHistory(data.history || []);
      }
    } catch (e) {
      console.warn('Error fetching history:', e.message);
    }
  };

  const handleUpdateStatus = async (newStatus, isPublished = false) => {
    if (!activePlaybook) return;
    setReviewActionLoading(true);
    try {
      const res = await fetch('/api/data-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_playbook_status',
          playbookId: activePlaybook.id,
          version: activePlaybook.version,
          newStatus,
          reviewerName: reviewerName.trim() || 'Operations Lead',
          reviewNotes: reviewNotes.trim() || `Status updated to ${newStatus}`,
          isPublished
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchPlaybookDetail(activePlaybook.id);
        fetchData();
        setReviewNotes('');
      }
    } catch (e) {
      console.warn('Status update error:', e.message);
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleRestoreAudit = async (editId) => {
    setReviewActionLoading(true);
    try {
      const res = await fetch('/api/data-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restore_playbook',
          editId,
          restoredBy: reviewerName.trim() || 'Admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        if (activePlaybook) fetchPlaybookDetail(activePlaybook.id);
        fetchData();
      }
    } catch (e) {
      console.warn('Restore error:', e.message);
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleRunPlaybookReimport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/data-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import_playbooks' })
      });
      const data = await res.json();
      setImportResult(data);
      fetchData();
    } catch (err) {
      setImportResult({ success: false, error: err.message });
    } finally {
      setImporting(false);
    }
  };

  const handleRunPreview = async () => {
    setPreviewLoading(true);
    try {
      const query = new URLSearchParams({
        action: 'playbook_preview',
        brand: previewBrief.brand,
        product: previewBrief.productOrService,
        subcategory: previewBrief.subcategory,
        objective: previewBrief.objective,
        city: previewBrief.city
      }).toString();

      const res = await fetch(`/api/data-library?${query}`);
      const data = await res.json();
      if (data.success) {
        setPreviewResult(data.recommendation);
      }
    } catch (e) {
      console.warn('Preview error:', e.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const fetchMarketContext = async (stateName) => {
    try {
      const res = await fetch(`/api/data-library?action=market&state=${encodeURIComponent(stateName)}`);
      const data = await res.json();
      if (data.success) {
        setMarketDetail(data.marketContext);
      }
    } catch (e) {
      console.warn('Market fetch error:', e.message);
    }
  };

  const fetchTransitContext = async (city) => {
    try {
      const res = await fetch(`/api/data-library?action=transit&city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success) {
        setTransitDetail(data.transitContext);
      }
    } catch (e) {
      console.warn('Transit fetch error:', e.message);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch('/api/data-library?action=venues');
      const data = await res.json();
      if (data.success) {
        setVenues(data.venues || []);
      }
    } catch (e) {
      console.warn('Venues fetch error:', e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered playbooks
  const filteredPlaybooks = playbooks.filter((p) => {
    if (selectedFamily !== 'All' && p.family !== selectedFamily) return false;
    if (selectedReviewFilter === 'DRAFT' && p.is_published === 1) return false;
    if (selectedReviewFilter === 'PUBLISHED' && p.is_published !== 1) return false;
    if (playbookSearch.trim()) {
      const q = playbookSearch.toLowerCase();
      const match = p.id.toLowerCase().includes(q) ||
                    p.name.toLowerCase().includes(q) ||
                    p.objective.toLowerCase().includes(q) ||
                    p.buyer_need.toLowerCase().includes(q) ||
                    p.family.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-gold uppercase px-2.5 py-0.5 bg-gold/10 rounded-full border border-gold/20">
              Operations Decision Library · v2
            </span>
            <span className="text-[10px] font-bold text-muted font-mono">
              41 Playbooks · 15 Families · 13 Evidence Sources
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight">
            Campaign Decision Playbooks & Data Library
          </h2>
          <p className="text-xs text-muted leading-relaxed max-w-2xl mt-1">
            Database-stored, versioned decision logic for product-specific campaigns (family car, luxury car, everyday sarees, bridal sarees, B2B SaaS, broadband). Replaces generic mall assumptions with structured, feasibility-checked recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl border border-espresso/15 bg-white text-xs font-bold text-espresso hover:bg-linen/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleRunPlaybookReimport}
            disabled={importing}
            className="h-10 px-4 rounded-xl bg-espresso text-white text-xs font-extrabold hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {importing ? (
              <>
                <RefreshCw size={13} className="animate-spin text-gold" />
                <span>Re-verifying...</span>
              </>
            ) : (
              <>
                <BookOpen size={13} className="text-gold" />
                <span>Re-import Playbook v2</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Re-import Alert Result */}
      {importResult && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
          importResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {importResult.success ? <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" /> : <AlertCircle size={16} className="text-red-700 shrink-0 mt-0.5" />}
          <div className="space-y-1">
            <div className="font-bold">{importResult.message || importResult.error}</div>
            {importResult.summary && (
              <div className="font-mono text-[11px] opacity-80">
                Batch: {importResult.summary.batchId} | Playbooks: {importResult.summary.playbooks?.accepted} accepted, {importResult.summary.playbooks?.unchanged} unchanged (Preserved Admin Edits: {importResult.summary.playbooks?.preservedAdminEdits})
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4 Primary Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Product Playbooks</span>
            <BookOpen size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{playbookSummary?.playbooksCount || 41}</div>
          <p className="text-[10px] text-muted mt-1">41 discrete product activation archetypes</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Operations Review</span>
            <Layers size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">
            {playbookSummary?.publishedCount || 0} <span className="text-xs text-muted font-normal">/ {playbookSummary?.draftCount || 41} Drafts</span>
          </div>
          <p className="text-[10px] text-muted mt-1">Drafts require operations review to publish</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Evidence Sources</span>
            <ShieldCheck size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{playbookSummary?.sourcesCount || 13}</div>
          <p className="text-[10px] text-muted mt-1">13 external references [S01–S13] registered</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Planning Families</span>
            <Filter size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{playbookSummary?.familiesCount || 15}</div>
          <p className="text-[10px] text-muted mt-1">15 multi-industry planning families</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-espresso/10 pb-2 overflow-x-auto">
        {[
          { id: 'playbooks', label: `Decision Playbooks (${playbooks.length || 41})`, icon: <BookOpen size={13} /> },
          { id: 'preview', label: 'Draft Preview Sandbox', icon: <Eye size={13} /> },
          { id: 'evidence_sources', label: `Evidence Sources (${evidenceSources.length || 13})`, icon: <ShieldCheck size={13} /> },
          { id: 'sources', label: `External Sources (${dataSources.length || 9})`, icon: <Database size={13} /> },
          { id: 'market', label: `State Spending Context (${totals.marketCount || 74})`, icon: <Layers size={13} /> },
          { id: 'transit', label: 'Transit Flows', icon: <Train size={13} /> },
          { id: 'venues', label: 'Campus Directory', icon: <Building2 size={13} /> },
          { id: 'batches', label: 'Audit Batches', icon: <Clock size={13} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-espresso text-white shadow-xs'
                : 'bg-white text-espresso/70 hover:bg-linen/40 border border-espresso/10'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-gold' : 'text-muted'}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DECISION PLAYBOOKS EXPLORER */}
      {activeTab === 'playbooks' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Family Dropdown */}
              <div className="flex items-center gap-1.5 bg-linen/30 border border-espresso/10 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-[11px] font-black uppercase text-muted">Family:</span>
                <select
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  className="bg-transparent font-bold text-espresso focus:outline-hidden cursor-pointer"
                >
                  <option value="All">All 15 Families</option>
                  {playbookFamilies.map(f => (
                    <option key={f.family_id} value={f.name}>{f.name} ({f.playbooks_count || 0})</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-linen/30 border border-espresso/10 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-[11px] font-black uppercase text-muted">Status:</span>
                <select
                  value={selectedReviewFilter}
                  onChange={(e) => setSelectedReviewFilter(e.target.value)}
                  className="bg-transparent font-bold text-espresso focus:outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="DRAFT">Draft for Operations Review</option>
                  <option value="PUBLISHED">Published Only</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search playbooks..."
                value={playbookSearch}
                onChange={(e) => setPlaybookSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-linen/20 border border-espresso/10 rounded-xl text-xs text-espresso placeholder:text-muted focus:outline-hidden focus:border-gold"
              />
            </div>
          </div>

          {/* Playbooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaybooks.map((p) => {
              const isPub = p.is_published === 1;
              return (
                <div
                  key={p.id}
                  className="bg-white border border-espresso/10 hover:border-gold/50 transition-all rounded-2xl p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-black uppercase text-gold px-2 py-0.5 bg-gold/10 rounded-md">
                        {p.id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isPub ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isPub ? 'Published' : 'Draft for Review'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-espresso text-sm leading-snug mb-1">
                      {p.name}
                    </h3>
                    <div className="text-[11px] font-bold text-muted mb-2">
                      Family: <span className="text-espresso">{p.family}</span>
                    </div>

                    <div className="space-y-2 text-xs border-t border-espresso/5 pt-2.5 mt-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Primary Objective</span>
                        <p className="text-espresso font-medium text-[11px] mt-0.5">{p.objective}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Buyer Need</span>
                        <p className="text-muted text-[11px] mt-0.5 line-clamp-2">{p.buyer_need}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Bottleneck</span>
                        <p className="text-amber-800 text-[11px] font-mono mt-0.5 line-clamp-1">{p.bottleneck}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-espresso/5 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted">v{p.version || '2.0-draft'}</span>
                    <button
                      onClick={() => fetchPlaybookDetail(p.id)}
                      className="h-8 px-3 rounded-lg bg-linen/50 hover:bg-espresso hover:text-white transition-colors text-[11px] font-bold text-espresso flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Inspect & Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPlaybooks.length === 0 && (
            <div className="p-8 text-center bg-white border border-espresso/10 rounded-2xl text-xs text-muted">
              No playbooks match the selected filters.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DRAFT PREVIEW SANDBOX */}
      {activeTab === 'preview' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Administrator Draft Preview
              </span>
              <span className="text-xs text-muted font-mono">Simulates Decision Layer Output</span>
            </div>
            <h3 className="text-base font-black text-espresso">Interactive Playbook Recommendation Sandbox</h3>
            <p className="text-xs text-muted leading-relaxed">
              Test how different products, buyer needs, and objectives branch into specific playbooks (e.g. Family Car vs Luxury Car, Everyday vs Bridal Sarees, B2B SaaS, Broadband).
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-muted text-[11px]">Quick Journey Presets:</span>
            {[
              { label: 'Family Car (AUTO01)', b: 'Tata Motors', p: 'Passenger Car SUV', o: 'Completed qualified test drives' },
              { label: 'Luxury Car (AUTO02)', b: 'Mercedes Benz', p: 'Luxury Car Sedan', o: 'Qualified private appointments' },
              { label: 'Everyday Sarees (FASH01)', b: 'Nalli', p: 'Everyday cotton sarees', o: 'Product trials & direct purchases' },
              { label: 'Bridal Sarees (FASH02)', b: 'Sundari Silks', p: 'Bridal Kanjeevaram wedding saree', o: 'Bridal occasion consultation' },
              { label: 'B2B SaaS (B2B01)', b: 'Freshworks', p: 'B2B SaaS CRM workflow', o: 'Qualified attended evaluations' },
              { label: 'Broadband (TEL01)', b: 'Airtel', p: 'Fiber broadband connection', o: 'Completed serviceable installations' },
              { label: 'Unknown Category (Clarify)', b: 'UnknownTech', p: 'Quantum Teleportation Module', o: 'Awareness' }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPreviewBrief({
                    brand: preset.b,
                    productOrService: preset.p,
                    subcategory: preset.p,
                    objective: preset.o,
                    city: 'Chennai'
                  });
                }}
                className="px-2.5 py-1 bg-linen/40 hover:bg-linen/80 rounded-lg border border-espresso/10 text-[11px] font-bold text-espresso transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Interactive Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-linen/20 rounded-2xl border border-espresso/10">
            <div>
              <label className="text-[10px] font-black uppercase text-muted block mb-1">Brand Name</label>
              <input
                type="text"
                value={previewBrief.brand}
                onChange={(e) => setPreviewBrief({ ...previewBrief, brand: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-espresso/15 rounded-xl text-xs text-espresso"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-muted block mb-1">Product / Subcategory</label>
              <input
                type="text"
                value={previewBrief.productOrService}
                onChange={(e) => setPreviewBrief({ ...previewBrief, productOrService: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-espresso/15 rounded-xl text-xs text-espresso"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-muted block mb-1">Primary Objective</label>
              <input
                type="text"
                value={previewBrief.objective}
                onChange={(e) => setPreviewBrief({ ...previewBrief, objective: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-espresso/15 rounded-xl text-xs text-espresso"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunPreview}
                disabled={previewLoading}
                className="w-full h-8.5 px-4 bg-espresso text-white rounded-xl text-xs font-extrabold hover:bg-muted transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {previewLoading ? <RefreshCw size={12} className="animate-spin text-gold" /> : <Sparkles size={12} className="text-gold" />}
                <span>Generate Recommendations</span>
              </button>
            </div>
          </div>

          {/* Preview Results Display */}
          {previewResult && (
            <div className="space-y-4 pt-2">
              {previewResult.status === 'NEEDS_CLARIFICATION' ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <HelpCircle size={16} />
                    <span>Non-Generic Guarantee: Discrimination Clarification Triggered</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    {previewResult.clarificationQuestion}
                  </p>
                  <div className="space-y-1 text-xs">
                    {previewResult.clarificationOptions?.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 text-amber-900">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 bg-amber-200/60 rounded">Option {i + 1}</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-700 italic">
                    {previewResult.provisionalNotice}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-linen/30 border border-espresso/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-gold font-bold">{previewResult.playbookId} · {previewResult.family}</div>
                      <div className="font-extrabold text-espresso text-sm">{previewResult.playbookName}</div>
                      <div className="text-muted text-[11px] mt-0.5">Objective: {previewResult.objective}</div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-muted">
                      <div>Evidence: <strong className="text-espresso">Authored Hypothesis</strong></div>
                      <div>Options Returned: <strong className="text-espresso">{previewResult.optionsCount}</strong></div>
                    </div>
                  </div>

                  {/* 3 Meaningfully Different Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {previewResult.options?.map((opt, idx) => (
                      <div key={idx} className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-black uppercase text-gold px-2 py-0.5 bg-gold/10 rounded">
                              {opt.tierName}
                            </span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              opt.venueRecommendation.feasibilityStatus === 'READY_TO_COMPARE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : opt.venueRecommendation.feasibilityStatus === 'EXCLUDED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {opt.venueRecommendation.feasibilityStatus}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-espresso text-xs mb-1">{opt.activityName}</h4>
                          <p className="text-[11px] text-muted leading-relaxed mb-3">{opt.whyThisActivationFits}</p>

                          <div className="space-y-2 text-[11px] border-t border-espresso/5 pt-2">
                            <div>
                              <span className="font-bold text-espresso block">Suggested Venue Type:</span>
                              <span className="text-muted">{opt.venueRecommendation.venueType}</span>
                            </div>

                            {opt.venueRecommendation.missingInformation?.length > 0 && (
                              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900">
                                <strong>Missing Checks:</strong> {opt.venueRecommendation.missingInformation.join('; ')}
                              </div>
                            )}

                            <div>
                              <span className="font-bold text-espresso block">Bottleneck / Constraint:</span>
                              <span className="text-amber-800 font-mono text-[10px]">{opt.requiredCapabilities.mainCapacityConstraint}</span>
                            </div>

                            <div>
                              <span className="font-bold text-espresso block">Follow-up Ownership:</span>
                              <span className="text-muted text-[10px]">{opt.followUpOwnership}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-muted bg-linen/30 p-2 rounded-xl border border-espresso/5 mt-3">
                          <strong>Tradeoff:</strong> {opt.tradeoffsVersusAlternatives}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLAYBOOK EVIDENCE SOURCES [S01-S13] */}
      {activeTab === 'evidence_sources' && (
        <div className="space-y-4">
          <div className="bg-linen/30 border border-espresso/10 p-4 rounded-2xl text-xs text-muted">
            <strong className="text-espresso">Evidence Discipline Guarantee:</strong> External citations support ONLY the explicitly stated practice or data use. They do not validate conversion benchmarks, venue footfall, or the entire playbook.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceSources.map((src) => (
              <div key={src.source_id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-gold px-2.5 py-0.5 bg-gold/10 rounded-md">
                    {src.source_id}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-gold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div>
                  <h4 className="font-extrabold text-espresso text-sm">{src.title}</h4>
                  <div className="text-[11px] font-bold text-muted">Publisher: <span className="text-espresso">{src.publisher}</span></div>
                </div>

                <div className="space-y-2 text-xs border-t border-espresso/5 pt-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block mb-0.5">What this supports</span>
                    <p className="text-[11px] text-emerald-950 leading-relaxed">{src.supports}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-0.5">What this DOES NOT support</span>
                    <p className="text-[11px] text-amber-950 leading-relaxed">{src.does_not_support}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXTERNAL DATA SOURCES CATALOGUE (9) */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((src) => {
              const isIncluded = src.status.includes('included');
              return (
                <div key={src.source_id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] font-mono font-black uppercase text-gold px-2 py-0.5 bg-gold/10 rounded-md">
                        {src.source_id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isIncluded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-linen text-muted border border-espresso/10'
                      }`}>
                        {isIncluded ? 'CONNECTED & INCLUDED' : src.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-espresso text-sm leading-snug mb-1">
                      {src.publisher}
                    </h3>
                    <div className="text-[11px] font-mono text-muted mb-3">Period: {src.data_period}</div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-muted">Kind:</span>{' '}
                        <span className="text-espresso font-medium">{src.kind}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-muted">Allowed Use:</span>{' '}
                        <span className="text-espresso font-medium">{src.allowed_use}</span>
                      </div>
                      <div className="text-[11px] text-muted italic">
                        Restriction: {src.restriction}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-espresso/5 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted">Verified 1 Oct 2026</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-gold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Source Link</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: STATE CONSUMPTION CONTEXT */}
      {activeTab === 'market' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-espresso">MoSPI Household Consumption Expenditure (HCES 2023-24)</h3>
              <p className="text-xs text-muted leading-relaxed">
                Official monthly per capita consumption expenditure (MPCE) for rural and urban sectors across 36 States/UTs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">Select State/UT:</span>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  fetchMarketContext(e.target.value);
                }}
                className="h-9 px-3 rounded-xl border border-espresso/15 bg-white text-xs font-bold text-espresso cursor-pointer"
              >
                {['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Delhi', 'Haryana', 'Kerala', 'Telangana', 'West Bengal', 'All India'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {marketDetail ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-linen/20 border border-espresso/10">
                <div className="text-[10px] font-black uppercase tracking-wider text-muted mb-1">Rural Sector MPCE</div>
                <div className="text-2xl font-black text-espresso font-mono">
                  ₹{marketDetail.rural?.value?.toLocaleString('en-IN') || 'N/A'}
                </div>
                <div className="text-xs text-muted mt-2">
                  Source: MoSPI Table 2D (Survey period: 2023-24)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-linen/20 border border-espresso/10">
                <div className="text-[10px] font-black uppercase tracking-wider text-muted mb-1">Urban Sector MPCE</div>
                <div className="text-2xl font-black text-espresso font-mono">
                  ₹{marketDetail.urban?.value?.toLocaleString('en-IN') || 'N/A'}
                </div>
                <div className="text-xs text-muted mt-2">
                  Source: MoSPI Table 2D (Survey period: 2023-24)
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted">Loading consumption details...</div>
          )}
        </div>
      )}

      {/* TAB 6: TRANSIT PASSENGER FLOWS */}
      {activeTab === 'transit' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">Chennai Metro (CMRL) Network Monthly Passenger Flows</h3>
            <p className="text-xs text-muted leading-relaxed">
              Official monthly network passenger counts reported by CMRL press releases. Stored as city transit context (never substituted for stall footfall).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {transitDetail?.records?.map((r, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-linen/20 border border-espresso/10">
                <div className="text-[10px] font-black uppercase tracking-wider text-muted">{r.month}</div>
                <div className="text-lg font-black text-espresso font-mono mt-1">
                  {r.value?.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-muted">passengers (network total)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CAMPUS DIRECTORY */}
      {activeTab === 'venues' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">NIRF Verified Institution Directory</h3>
            <p className="text-xs text-muted leading-relaxed">
              Official NIRF 2024 institutional listings. Permission is strictly NOT_CONFIRMED and footfall is stored as NULL until on-site calibration.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-espresso/10 bg-linen/20 font-bold text-muted">
                <tr>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Footfall</th>
                  <th className="py-2.5 px-3">Student Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {venues.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 px-3 font-bold text-espresso">{v.name}</td>
                    <td className="py-3 px-3 text-muted">{v.city}</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {v.permissionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted font-mono italic">
                      {v.footfall === null ? 'Not Measured (NULL)' : v.footfall}
                    </td>
                    <td className="py-3 px-3 text-muted font-mono italic">
                      {v.studentCount === null ? 'Not Measured (NULL)' : v.studentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: IMPORT AUDIT BATCHES */}
      {activeTab === 'batches' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">Audit Trail & Import Batches</h3>
            <p className="text-xs text-muted leading-relaxed">
              Every data ingestion creates an immutable batch record tracking processed, accepted, unchanged, and rejected records.
            </p>
          </div>

          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl border border-espresso/10 bg-linen/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-espresso">{b.id}</span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      {b.review_status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted">
                    Source: <strong className="text-espresso">{b.source_publisher || b.source_id}</strong> | Version: {b.package_version || '1.0'}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                  <div>Processed: <strong className="text-espresso">{b.records_processed}</strong></div>
                  <div>Accepted: <strong className="text-emerald-700">{b.records_accepted}</strong></div>
                  <div>Unchanged: <strong className="text-muted">{b.records_unchanged}</strong></div>
                  <div>Rejected: <strong className="text-red-700">{b.records_rejected}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYBOOK DETAIL & OPERATIONS REVIEW MODAL */}
      {activePlaybook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-espresso/15 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-espresso/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-black text-gold px-2 py-0.5 bg-gold/10 rounded">
                    {activePlaybook.id}
                  </span>
                  <span className="text-xs font-bold text-muted font-mono">{activePlaybook.family}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    activePlaybook.is_published === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activePlaybook.is_published === 1 ? 'PUBLISHED' : activePlaybook.review_status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-espresso">{activePlaybook.name}</h3>
                <p className="text-xs text-muted mt-0.5">Objective: <strong className="text-espresso">{activePlaybook.objective}</strong></p>
              </div>

              <button
                onClick={() => setActivePlaybook(null)}
                className="p-2 rounded-xl hover:bg-linen/50 text-muted hover:text-espresso transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Core Blueprint Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-linen/20 border border-espresso/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Stated Buyer Need</span>
                <p className="text-espresso leading-relaxed">{activePlaybook.buyer_need}</p>
              </div>

              <div className="p-4 rounded-2xl bg-linen/20 border border-espresso/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Recommended Format</span>
                <p className="text-espresso leading-relaxed">{activePlaybook.format}</p>
              </div>
            </div>

            {/* Questions That Change The Plan */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-espresso flex items-center gap-1.5">
                <HelpCircle size={14} className="text-gold" />
                <span>Questions That Change The Plan</span>
              </h4>
              <div className="space-y-1.5 bg-linen/10 p-3.5 rounded-2xl border border-espresso/10">
                {activePlaybook.ask?.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-muted">
                    <span className="font-mono text-gold font-bold">Q{i + 1}.</span>
                    <span className="text-espresso">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Sequence */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-espresso">Operating Sequence</h4>
              <div className="space-y-1.5">
                {activePlaybook.sequence?.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-linen/20 border border-espresso/5">
                    <span className="font-mono text-[10px] font-black text-gold px-1.5 py-0.5 bg-gold/10 rounded">
                      Step {i + 1}
                    </span>
                    <span className="text-espresso">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations & Avoid Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-extrabold text-espresso">Candidate Venue Settings</h4>
                <div className="space-y-1.5">
                  {activePlaybook.locations?.map((loc, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-espresso/10 bg-white">
                      <div className="font-bold text-espresso">{loc[0]}</div>
                      <div className="text-[11px] text-muted mt-0.5">{loc[1]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-espresso text-red-900">Avoid Rules (Negative Gates)</h4>
                <div className="space-y-1.5">
                  {activePlaybook.avoid?.map((rule, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-red-200 bg-red-50/50 text-red-900 text-[11px]">
                      • {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Constraints & Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-linen/20 border border-espresso/10">
                <span className="text-[10px] font-black uppercase text-muted block mb-1">Primary Bottleneck</span>
                <span className="text-amber-800 font-mono text-[11px]">{activePlaybook.bottleneck}</span>
              </div>

              <div className="p-3 rounded-xl bg-linen/20 border border-espresso/10">
                <span className="text-[10px] font-black uppercase text-muted block mb-1">Primary Outcome</span>
                <span className="text-espresso font-medium text-[11px]">{activePlaybook.outcomes?.[0] || 'Enquiries'}</span>
              </div>

              <div className="p-3 rounded-xl bg-linen/20 border border-espresso/10">
                <span className="text-[10px] font-black uppercase text-muted block mb-1">Follow-Up Owner</span>
                <span className="text-espresso text-[11px]">{activePlaybook.followup}</span>
              </div>
            </div>

            {/* Linked Evidence Sources */}
            {activePlaybook.evidenceSources?.length > 0 && (
              <div className="space-y-2 text-xs border-t border-espresso/10 pt-4">
                <h4 className="font-extrabold text-espresso">Linked Evidence Citations</h4>
                <div className="space-y-2">
                  {activePlaybook.evidenceSources.map(s => (
                    <div key={s.source_id} className="p-3 rounded-xl border border-espresso/10 bg-linen/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-espresso">{s.source_id} · {s.publisher}: {s.title}</span>
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-[10px] text-gold hover:underline flex items-center gap-0.5">
                          <span>Link</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="text-[11px] text-emerald-800 mb-0.5"><strong>Supports:</strong> {s.supports}</div>
                      <div className="text-[11px] text-amber-800"><strong>Does not support:</strong> {s.does_not_support}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPERATIONS REVIEW & PUBLISH ACTION BAR */}
            <div className="border-t border-espresso/10 pt-5 space-y-4">
              <h4 className="font-extrabold text-espresso text-sm flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-gold" />
                <span>Operations Review & Publishing Console</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-muted block mb-1">Reviewer Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-linen/20 border border-espresso/15 rounded-xl text-xs text-espresso font-medium"
                    placeholder="e.g. Operations Director"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-muted block mb-1">Review Notes / Rationale</label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-linen/20 border border-espresso/15 rounded-xl text-xs text-espresso"
                    placeholder="e.g. Verified local dealership test-drive protocols for Chennai"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleUpdateStatus('OPERATIONS_REVIEWED', false)}
                  disabled={reviewActionLoading}
                  className="px-4 py-2 rounded-xl bg-linen/60 hover:bg-linen border border-espresso/15 text-xs font-bold text-espresso transition-colors cursor-pointer disabled:opacity-50"
                >
                  Mark as Reviewed (Draft)
                </button>

                <button
                  onClick={() => handleUpdateStatus('PUBLISHED', true)}
                  disabled={reviewActionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <CheckSquare size={13} />
                  <span>Publish to Production Recommendations</span>
                </button>
              </div>

              {/* Version Audit History & Rollback */}
              {playbookHistory.length > 0 && (
                <div className="border-t border-espresso/10 pt-4 space-y-2 text-xs">
                  <h5 className="font-bold text-espresso">Audit History & Rollback Log</h5>
                  <div className="space-y-1.5">
                    {playbookHistory.map(h => (
                      <div key={h.id} className="p-2 rounded-xl bg-linen/20 border border-espresso/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-espresso">{h.edited_by}:</span> {h.change_summary}
                          <span className="text-[10px] text-muted block">{new Date(h.created_at).toLocaleString()}</span>
                        </div>
                        {h.change_type !== 'RESTORE' && (
                          <button
                            onClick={() => handleRestoreAudit(h.id)}
                            disabled={reviewActionLoading}
                            className="px-2.5 py-1 bg-white hover:bg-linen rounded-lg border border-espresso/10 text-[10px] font-bold text-espresso flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <RotateCcw size={10} />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
