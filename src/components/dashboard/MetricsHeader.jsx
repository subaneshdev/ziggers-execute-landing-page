"use client";
import React from 'react';
import { Target, Wallet, Users, CheckCircle } from 'lucide-react';

export default function MetricsHeader() {
  const stats = [
    { name: 'Active Campaigns', val: '4 Active', desc: 'Running in 3 hubs', icon: <Target className="text-gold" size={20} /> },
    { name: 'Escrow Account', val: '₹4,82,500', desc: 'Funds secured', icon: <Wallet className="text-gold" size={20} /> },
    { name: 'Total Reach (Interactions)', val: '1,24,800', desc: 'Verified on-ground logs', icon: <Users className="text-gold" size={20} /> },
    { name: 'Audit Compliance', val: '99.8%', desc: 'GPS & geofence matched', icon: <CheckCircle className="text-gold" size={20} /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block">{stat.name}</span>
            <span className="text-2xl font-extrabold text-espresso mt-1 block">{stat.val}</span>
            <span className="text-[10px] text-muted/80 mt-0.5 block">{stat.desc}</span>
          </div>
          <div className="w-10 h-10 bg-linen/30 rounded-xl flex items-center justify-center">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
