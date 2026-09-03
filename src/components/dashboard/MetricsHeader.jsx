"use client";
import React from 'react';
import { Target, Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function MetricsHeader({ campaigns = [] }) {
  // Calculate total budget/spend
  const totalBudgetNumeric = campaigns.reduce((acc, c) => {
    const raw = (c.spend || c.totalBudget || '0').replace(/[^0-9]/g, '');
    return acc + (parseInt(raw, 10) || 0);
  }, 0);

  const formattedBudget = totalBudgetNumeric > 0 
    ? '₹' + totalBudgetNumeric.toLocaleString('en-IN') 
    : '₹0';

  // Calculate total samples & leads strictly from real campaign counters
  const totalSamples = campaigns.reduce((acc, c) => acc + (parseInt(c.samples, 10) || 0), 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + (parseInt(c.leads, 10) || 0), 0);
  const totalResults = totalSamples + totalLeads;

  // Calculate total reach from real forecast objects
  const totalReach = campaigns.reduce((acc, c) => {
    return acc + (c.forecast?.reach || c.reach || 0);
  }, 0);

  // Compute actual weighted CPL across campaigns that have generated leads
  let totalLeadSpend = 0;
  campaigns.forEach(c => {
    const leads = parseInt(c.leads, 10) || 0;
    if (leads > 0) {
      const raw = (c.spend || c.totalBudget || '0').replace(/[^0-9]/g, '');
      totalLeadSpend += (parseInt(raw, 10) || 0);
    }
  });

  const avgCpl = totalLeads > 0 
    ? `₹${Math.round(totalLeadSpend / totalLeads).toLocaleString('en-IN')}` 
    : (campaigns.length > 0 && campaigns[0]?.targetCpl ? `${campaigns[0].targetCpl} (Target)` : 'N/A');

  const metaMetrics = [
    { 
      name: 'Total Campaign Funds', 
      val: formattedBudget, 
      desc: campaigns.length > 0 ? 'Escrow Protected Disbursed' : 'Ready to Allocate', 
      icon: <DollarSign className="text-gold" size={18} />,
      color: 'border-l-4 border-l-gold'
    },
    { 
      name: 'Total Physical Results', 
      val: totalResults.toLocaleString('en-IN'), 
      desc: totalResults > 0 ? `${totalSamples} Samples • ${totalLeads} Leads` : 'Awaiting On-Ground Distribution', 
      icon: <Target className="text-espresso" size={18} />,
      color: 'border-l-4 border-l-espresso'
    },
    { 
      name: 'Forecast Reach Exposure', 
      val: totalReach > 0 ? totalReach.toLocaleString('en-IN') : '0', 
      desc: campaigns.length > 0 ? `Across ${new Set(campaigns.map(c => c.city).filter(Boolean)).size} Active Metros` : 'Target Audience Reach', 
      icon: <Activity className="text-gold" size={18} />,
      color: 'border-l-4 border-l-gold'
    },
    { 
      name: 'Cost Per Result (CPL)', 
      val: avgCpl, 
      desc: totalLeads > 0 ? 'Verified Field Conversion' : 'Calculated Upon Lead Capture', 
      icon: <TrendingUp className="text-green-700" size={18} />,
      color: 'border-l-4 border-l-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 font-sans">
      {metaMetrics.map((stat) => (
        <div 
          key={stat.name} 
          className={`bg-white border border-espresso/10 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all hover:border-gold ${stat.color}`}
        >
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">{stat.name}</span>
            <span className="text-xl md:text-2xl font-extrabold text-espresso mt-1 block font-mono">{stat.val}</span>
            <span className="text-[10px] text-muted mt-0.5 block">{stat.desc}</span>
          </div>
          <div className="w-10 h-10 bg-linen/50 border border-espresso/10 rounded-xl flex items-center justify-center flex-shrink-0">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
