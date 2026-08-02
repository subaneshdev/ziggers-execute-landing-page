"use client";
import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Copy, Trash2, Search, Filter, Plus, ChevronDown } from 'lucide-react';

export default function AdsManagerTable({ onCreateClick }) {
  const [activeSubTab, setActiveSubTab] = useState('campaigns');
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Simulated initial state
  const [campaigns, setCampaigns] = useState([
    { id: 'c1', name: 'Product Sampling - PepsiCo OMR Hub', objective: 'Product Sampling', status: true, delivery: 'Active', budget: '₹1,50,000', results: '5,200 samples', reach: '18,500', cost: '₹28.8', spent: '₹1,49,760' },
    { id: 'c2', name: 'Planogram Audit - ITC General Trade', objective: 'Store Audit', status: true, delivery: 'Active', budget: '₹60,000', results: '520 stores', reach: '1,500', cost: '₹115.3', spent: '₹59,956' },
    { id: 'c3', name: 'Experiential Roadshow - Boat Mumbai', objective: 'Roadshow', status: false, delivery: 'Paused', budget: '₹3,00,000', results: '12 hubs touched', reach: '42,000', cost: '₹250.0', spent: '₹3,00,000' }
  ]);

  const [adsets, setAdsets] = useState([
    { id: 'as1', name: 'OMR Tech Parks (Chennai) - Canopy Set', status: true, delivery: 'Active', budget: '₹75,000', results: '2,800 samples', reach: '9,200', cost: '₹26.7', spent: '₹74,760' },
    { id: 'as2', name: 'E-City Hypermarkets (Bangalore) - Booths Set', status: true, delivery: 'Active', budget: '₹75,000', results: '2,400 samples', reach: '9,300', cost: '₹31.2', spent: '₹75,000' },
    { id: 'as3', name: 'Bandra Retail Corridor (Mumbai) - Visual Audits', status: false, delivery: 'Paused', budget: '₹60,000', results: '520 stores', reach: '1,500', cost: '₹115.3', spent: '₹59,956' }
  ]);

  const [ads, setAds] = useState([
    { id: 'a1', name: 'Promoter Aadhaar KYC #045 (Anjali Kumar)', status: true, delivery: 'Active', budget: 'Workforce Escrow', results: '420 handovers', reach: '1,200', cost: '₹22.0', spent: '₹9,240' },
    { id: 'a2', name: 'Promoter Aadhaar KYC #082 (Rohan Dev)', status: true, delivery: 'Active', budget: 'Workforce Escrow', results: '380 handovers', reach: '1,100', cost: '₹24.0', spent: '₹9,120' },
    { id: 'a3', name: 'Planogram Installer #012 (Karthik R)', status: false, delivery: 'Paused', budget: 'Workforce Escrow', results: '45 display panels', reach: '45', cost: '₹200.0', spent: '₹9,000' }
  ]);

  // Toggle handlers
  const handleStatusToggle = (id, level) => {
    if (level === 'campaign') {
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: !c.status, delivery: !c.status ? 'Active' : 'Paused' } : c));
    } else if (level === 'adset') {
      setAdsets(adsets.map(a => a.id === id ? { ...a, status: !a.status, delivery: !a.status ? 'Active' : 'Paused' } : a));
    } else {
      setAds(ads.map(ad => ad.id === id ? { ...ad, status: !ad.status, delivery: !ad.status ? 'Active' : 'Paused' } : ad));
    }
  };

  const handleSelectAll = (checked, list) => {
    if (checked) {
      setSelectedItems(list.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getCurrentList = () => {
    if (activeSubTab === 'campaigns') return campaigns;
    if (activeSubTab === 'adsets') return adsets;
    return ads;
  };

  const handleDuplicate = () => {
    if (selectedItems.length === 0) return;
    const currentList = getCurrentList();
    const itemsToDuplicate = currentList.filter(item => selectedItems.includes(item.id));
    
    const duplicated = itemsToDuplicate.map(item => ({
      ...item,
      id: Math.random().toString(),
      name: `${item.name} (Copy)`
    }));

    if (activeSubTab === 'campaigns') setCampaigns([...campaigns, ...duplicated]);
    else if (activeSubTab === 'adsets') setAdsets([...adsets, ...duplicated]);
    else setAds([...ads, ...duplicated]);

    setSelectedItems([]);
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    if (activeSubTab === 'campaigns') setCampaigns(campaigns.filter(c => !selectedItems.includes(c.id)));
    else if (activeSubTab === 'adsets') setAdsets(adsets.filter(a => !selectedItems.includes(a.id)));
    else setAds(ads.filter(ad => !selectedItems.includes(ad.id)));
    setSelectedItems([]);
  };

  return (
    <div className="bg-white border border-espresso/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* 1. Meta-Style Action Toolbars */}
      <div className="p-4 border-b border-espresso/10 bg-light-gray flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Create</span>
          </button>
          
          <button 
            onClick={handleDuplicate}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-1 border border-espresso/15 hover:bg-white text-espresso font-bold px-3 py-2 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>

          <button 
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-1 border border-red-200 text-red-600 hover:bg-red-50 font-bold px-3 py-2 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="bg-white border border-espresso/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold w-60"
            />
          </div>
          <button className="flex items-center gap-1 border border-espresso/10 bg-white px-3 py-2 rounded-lg text-xs font-semibold text-espresso cursor-pointer">
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 2. Meta Three-Level Tabs */}
      <div className="flex border-b border-espresso/10 bg-light-gray">
        {[
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'adsets', label: 'Ad Sets (Locations)' },
          { id: 'ads', label: 'Ads (Field Deployments)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setSelectedItems([]);
            }}
            className={`px-6 py-3.5 text-xs font-bold border-r border-espresso/10 transition-colors cursor-pointer ${
              activeSubTab === tab.id 
                ? 'bg-white text-espresso border-b-2 border-b-gold' 
                : 'text-muted hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Metrics Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-gray/60 border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox"
                  checked={selectedItems.length === getCurrentList().length && getCurrentList().length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked, getCurrentList())}
                  className="rounded border-espresso/10 text-gold focus:ring-gold"
                />
              </th>
              <th className="p-4 w-16">On/Off</th>
              <th className="p-4">{activeSubTab === 'campaigns' ? 'Campaign Name' : activeSubTab === 'adsets' ? 'Ad Set Name' : 'Field Deploy Agent'}</th>
              <th className="p-4">Delivery</th>
              <th className="p-4">Budget Escrow</th>
              <th className="p-4">Results</th>
              <th className="p-4">Reach</th>
              <th className="p-4">Cost per Result</th>
              <th className="p-4">Amount Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5 text-xs">
            {getCurrentList().map((item) => (
              <tr 
                key={item.id} 
                className={`hover:bg-linen/20 transition-colors ${selectedItems.includes(item.id) ? 'bg-linen/10' : ''}`}
              >
                <td className="p-4 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-espresso/10 text-gold focus:ring-gold"
                  />
                </td>
                <td className="p-4">
                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => handleStatusToggle(item.id, activeSubTab === 'campaigns' ? 'campaign' : activeSubTab === 'adsets' ? 'adset' : 'ad')}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${item.status ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label="Toggle status"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${item.status ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </button>
                </td>
                <td className="p-4 font-bold text-espresso">{item.name}</td>
                <td className="p-4">
                  <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${item.status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="font-semibold">{item.delivery}</span>
                </td>
                <td className="p-4 font-semibold">{item.budget}</td>
                <td className="p-4 font-semibold text-espresso">{item.results}</td>
                <td className="p-4 text-muted">{item.reach}</td>
                <td className="p-4 font-semibold">{item.cost}</td>
                <td className="p-4 font-bold text-espresso">{item.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
