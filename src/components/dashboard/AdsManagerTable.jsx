"use client";
import React, { useState } from 'react';
import { 
  Play, Pause, RefreshCw, Trash2, Search, Filter, Plus, 
  Sparkles, FileText, CheckSquare, Layers, MapPin, Users,
  BarChart, DollarSign, Activity, AlertCircle, ArrowUpRight,
  Copy, Edit3, Download, Sliders, Calendar, ChevronDown, Check, Eye
} from 'lucide-react';

export default function AdsManagerTable({ 
  onCreateClick, 
  campaigns = [], 
  onToggleStatus, 
  onDeleteCampaign,
  isLoading = false 
}) {
  const [activeMetaTab, setActiveMetaTab] = useState('campaigns'); // 'campaigns', 'adsets', 'ads'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [selectedColumnPreset, setSelectedColumnPreset] = useState('Performance');
  const [selectedBriefCampaign, setSelectedBriefCampaign] = useState(null);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.city?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (deliveryFilter === 'All') return true;
    if (deliveryFilter === 'Active') return c.status === true || c.stage === 'Live';
    if (deliveryFilter === 'Off') return c.status === false || c.stage === 'Paused';
    if (deliveryFilter === c.objective) return true;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCampaigns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCampaigns.map(c => c.id)));
    }
  };

  const toggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Aggregated Ziggers metrics
  const totalSpendNumeric = campaigns.reduce((acc, c) => {
    const raw = (c.spend || c.totalBudget || '0').replace(/[^0-9]/g, '');
    return acc + (parseInt(raw, 10) || 0);
  }, 0);

  const totalWorkers = campaigns.reduce((acc, c) => acc + (parseInt(c.workers, 10) || 0), 0);

  return (
    <div className="bg-white text-espresso rounded-2xl border border-espresso/15 shadow-sm overflow-hidden flex flex-col font-sans">
      
      {/* Top Header */}
      <div className="bg-espresso text-white px-5 py-3 border-b border-espresso/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gold text-espresso flex items-center justify-center font-black text-xs shadow-xs">
              Z
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">Campaigns Manager</span>
          </div>
          <span className="text-linen/40">•</span>
          <div className="flex items-center gap-1.5 text-linen font-semibold bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-white/60">Account:</span>
            <span className="text-gold font-extrabold">All Brands & Small Businesses</span>
            <ChevronDown size={12} className="text-linen/60" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Picker Preset */}
          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 text-linen font-medium cursor-pointer transition-colors">
            <Calendar size={13} className="text-gold" />
            <span className="text-xs font-semibold">{dateRange}</span>
            <ChevronDown size={12} className="text-linen/60" />
          </div>

          <button
            onClick={() => setSelectedIds(new Set())}
            title="Discard Drafts / Clear Selection"
            className="text-[11px] font-bold text-linen/70 hover:text-white px-2 py-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3-Tier Hierarchy Tab Navigation */}
      <div className="flex items-center border-b border-espresso/10 bg-linen/20 px-4 text-xs font-bold">
        {[
          { id: 'campaigns', label: 'Campaigns', count: campaigns.length, icon: <Layers size={14} /> },
          { id: 'adsets', label: 'Ad Sets (Geofences & Staffing)', count: campaigns.reduce((a, b) => a + (parseInt(b.locations) || 1), 0), icon: <MapPin size={14} /> },
          { id: 'ads', label: 'Ads (Promoters & Briefs)', count: totalWorkers, icon: <Users size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMetaTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer ${
              activeMetaTab === tab.id
                ? 'border-gold text-espresso bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-muted hover:text-espresso hover:bg-white/50'
            }`}
          >
            <span className={activeMetaTab === tab.id ? 'text-gold' : 'text-muted'}>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeMetaTab === tab.id ? 'bg-gold/20 text-espresso font-bold' : 'bg-espresso/10 text-muted'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Action Toolbar */}
      <div className="p-4 bg-white border-b border-espresso/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer text-xs"
          >
            <Plus size={15} className="text-gold" />
            <span>Create Campaign</span>
          </button>

          {selectedIds.size > 0 && (
            <>
              <button className="flex items-center gap-1 bg-linen/50 hover:bg-linen text-espresso font-bold px-3 py-2 rounded-xl border border-espresso/10 transition-colors cursor-pointer text-xs">
                <Copy size={13} />
                <span>Duplicate</span>
              </button>
              <button 
                onClick={() => {
                  selectedIds.forEach(id => onDeleteCampaign && onDeleteCampaign(id));
                  setSelectedIds(new Set());
                }}
                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer text-xs"
              >
                <Trash2 size={13} />
                <span>Delete ({selectedIds.size})</span>
              </button>
            </>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by campaign, brand, or hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-linen/30 border border-espresso/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-espresso focus:outline-none focus:border-gold w-48 md:w-64 placeholder-muted"
            />
          </div>
        </div>

        {/* Right Filter & Columns Presets */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="bg-linen/30 border border-espresso/10 rounded-xl px-3 py-1.5 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
          >
            <option value="All">Delivery: All</option>
            <option value="Active">Active Only</option>
            <option value="Off">Inactive / Off</option>
            <option value="Sampling">Product Sampling</option>
            <option value="Retail Activation">Retail Activation</option>
            <option value="Lead Generation">Lead Generation</option>
          </select>

          {/* Columns Preset */}
          <div className="flex items-center gap-1 bg-linen/30 border border-espresso/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-espresso">
            <Sliders size={12} className="text-gold" />
            <span>Columns: {selectedColumnPreset}</span>
          </div>
        </div>
      </div>

      {/* Meta Data Table View */}
      <div className="overflow-x-auto min-h-[320px]">
        {filteredCampaigns.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-linen/30 border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredCampaigns.length && filteredCampaigns.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-gold rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-16 text-center">On / Off</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Bid Strategy</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Results</th>
                <th className="py-3 px-4">Reach / Footfall</th>
                <th className="py-3 px-4">Cost per Result</th>
                <th className="py-3 px-4">Amount Spent</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/5 font-medium text-xs">
              {filteredCampaigns.map((c) => {
                const isChecked = selectedIds.has(c.id);
                const isLive = c.status === true || c.stage === 'Live';
                return (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-linen/20 transition-colors ${isChecked ? 'bg-gold/10' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(c.id)}
                        className="accent-gold rounded cursor-pointer"
                      />
                    </td>

                    {/* On/Off Switch */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onToggleStatus && onToggleStatus(c.id, isLive)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer inline-flex items-center p-0.5 ${
                          isLive ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                        title={isLive ? 'Campaign is Active. Click to turn Off.' : 'Campaign is Off. Click to turn On.'}
                      >
                        <span 
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-150 ${
                            isLive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Delivery Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-2 h-2 rounded-full ${
                          isLive ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
                        }`}></span>
                        <span className={isLive ? 'text-green-700 font-bold' : 'text-muted'}>
                          {isLive ? 'Active' : 'Off'}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted block mt-0.5">
                        {c.attendance || '100%'} GPS Matched
                      </span>
                    </td>

                    {/* Campaign Name & Brand */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 group">
                        <span className="font-extrabold text-espresso group-hover:text-gold cursor-pointer">
                          {c.name}
                        </span>
                        <Edit3 size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-muted block mt-0.5">
                        Brand: <strong className="text-espresso">{c.brand || 'Direct Brand'}</strong> • {c.city || 'Chennai'}
                      </span>
                    </td>

                    {/* Bid Strategy */}
                    <td className="py-3.5 px-4 text-muted font-mono text-[11px]">
                      Lowest Cost (Escrow)
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-mono font-bold text-espresso">
                      <div>{c.spend || c.totalBudget || '₹50,000'}</div>
                      <span className="text-[9px] text-muted font-sans">Daily / Escrow</span>
                    </td>

                    {/* Results */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-extrabold text-espresso">
                        {c.samples ? `${c.samples} Samples` : c.leads ? `${c.leads} Leads` : `${(parseInt(c.workers) || 10) * 120} Interactions`}
                      </div>
                      <span className="text-[9px] text-green-700 font-sans font-bold">100% Verified</span>
                    </td>

                    {/* Reach / Footfall */}
                    <td className="py-3.5 px-4 font-mono text-espresso">
                      {(parseInt(c.workers) || 10) * 650} Footfalls
                    </td>

                    {/* Cost per Result */}
                    <td className="py-3.5 px-4 font-mono font-bold text-green-700">
                      {c.actualCpl || '₹85.00'}
                    </td>

                    {/* Amount Spent */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-espresso">
                      {c.spend || '₹1,20,000'}
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 text-muted text-[11px] font-mono whitespace-nowrap">
                      Aug 20 – Aug 25
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedBriefCampaign(c)}
                          className="px-2.5 py-1 bg-espresso hover:bg-muted text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          title="View Setup Parameters"
                        >
                          View Brief
                        </button>
                        <button
                          onClick={() => onDeleteCampaign && onDeleteCampaign(c.id)}
                          className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Archive Campaign"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Clean Zero-State */
          <div className="py-16 px-6 text-center bg-white flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-inner">
              <Layers size={26} />
            </div>

            <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
              {searchQuery || deliveryFilter !== 'All' 
                ? 'No Campaigns Match Your Active Filters' 
                : 'No Campaigns Running'}
            </h3>

            <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
              {searchQuery || deliveryFilter !== 'All'
                ? 'Try resetting your search query or switching delivery status filters.'
                : 'Whether you are a local small business launching a 2-day store flyer activation or a national enterprise deploying 500 promoters, launch in 3 minutes like running a Meta Ad.'}
            </p>

            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus size={16} className="text-gold" />
              <span>Create Your First Campaign</span>
            </button>
          </div>
        )}
      </div>

      {/* Table Footer Summary Bar */}
      <div className="bg-linen/30 border-t border-espresso/10 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-muted">
        <div className="flex items-center gap-4">
          <span>Results: <strong className="text-espresso">{filteredCampaigns.length} Campaigns</strong></span>
          <span>•</span>
          <span>Total Headcount: <strong className="text-espresso">{totalWorkers} Promoters</strong></span>
          <span>•</span>
          <span>Total Footfall Reach: <strong className="text-espresso">{(totalWorkers * 650).toLocaleString('en-IN')}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span>Total Budget / Escrow:</span>
          <span className="text-sm font-extrabold text-espresso">
            ₹{totalSpendNumeric.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Operational Brief Modal */}
      {selectedBriefCampaign && (
        <div className="fixed inset-0 bg-espresso/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-espresso/15 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in duration-150 text-xs text-espresso">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">Campaign Parameters</h3>
                <span className="text-[10px] text-muted">{selectedBriefCampaign.name}</span>
              </div>
              <button onClick={() => setSelectedBriefCampaign(null)} className="text-muted hover:text-espresso font-bold p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-espresso/5 pb-1">
                <span className="text-muted">Brand Account:</span>
                <strong className="text-espresso">{selectedBriefCampaign.brand || 'Enterprise / Local Brand'}</strong>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1">
                <span className="text-muted">Objective:</span>
                <strong className="text-gold font-bold">{selectedBriefCampaign.objective}</strong>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1">
                <span className="text-muted">Metro & Location:</span>
                <strong className="text-espresso">{selectedBriefCampaign.city}</strong>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1">
                <span className="text-muted">Budget Escrow:</span>
                <strong className="text-green-700 font-mono">{selectedBriefCampaign.spend || selectedBriefCampaign.totalBudget}</strong>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1">
                <span className="text-muted">Promoters Allocated:</span>
                <strong className="text-espresso font-mono">{selectedBriefCampaign.workers} Verified Promoters</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedBriefCampaign(null)}
              className="w-full bg-espresso hover:bg-muted text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Brief
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
