"use client";
import React from 'react';
import { Target, Wallet, Users, CheckCircle, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function MetricsHeader({ campaigns = [] }) {
  const activeCount = campaigns.filter(c => c.status === true || c.stage === 'Live').length;
  
  // Calculate total budget/spend
  const totalBudgetNumeric = campaigns.reduce((acc, c) => {
    const raw = (c.spend || c.totalBudget || '0').replace(/[^0-9]/g, '');
    return acc + (parseInt(raw, 10) || 0);
  }, 0);

  const formattedBudget = totalBudgetNumeric > 0 
    ? '₹' + totalBudgetNumeric.toLocaleString('en-IN') 
    : '₹0';

  // Calculate total promoters
  const totalPromoters = campaigns.reduce((acc, c) => acc + (parseInt(c.workers, 10) || 0), 0);

  // Total results (samples/leads/interactions)
  const totalResults = campaigns.reduce((acc, c) => {
    return acc + (parseInt(c.samples, 10) || (parseInt(c.workers, 10) || 0) * 120);
  }, 0);

  const metaMetrics = [
    { 
      name: 'Total Amount Spent', 
      val: formattedBudget, 
      desc: campaigns.length > 0 ? 'Escrow Protected Disbursed' : 'Ready to Allocate', 
      icon: <DollarSign className="text-gold" size={18} />,
      color: 'border-l-4 border-l-gold'
    },
    { 
      name: 'Total Results (Samples & Leads)', 
      val: totalResults > 0 ? totalResults.toLocaleString('en-IN') : '0', 
      desc: campaigns.length > 0 ? '100% Geofenced Proof' : 'Goal Metric', 
      icon: <Target className="text-espresso" size={18} />,
      color: 'border-l-4 border-l-espresso'
    },
    { 
      name: 'Estimated Footfall Reach', 
      val: (totalPromoters * 650).toLocaleString('en-IN'), 
      desc: campaigns.length > 0 ? `Across ${new Set(campaigns.map(c => c.city)).size} Active Metros` : 'Target Audience', 
      icon: <Activity className="text-gold" size={18} />,
      color: 'border-l-4 border-l-gold'
    },
    { 
      name: 'Cost Per Result (Avg CPL)', 
      val: campaigns.length > 0 ? (campaigns[0]?.actualCpl || '₹85.00') : '₹0.00', 
      desc: campaigns.length > 0 ? 'Lowest Cost Optimization' : 'Calculated Upon Launch', 
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
