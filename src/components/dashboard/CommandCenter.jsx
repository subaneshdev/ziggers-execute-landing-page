"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Users, AlertTriangle, TrendingUp, Sparkles, Package, Clock, RefreshCw, UserX, CheckCircle, ShieldAlert, ArrowRight, Activity, Terminal, Database, Zap } from 'lucide-react';

export default function CommandCenter({ campaigns = [], systemLogs = [], onApplyAiOptimization, onRefreshCampaigns }) {
  const [pulse, setPulse] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setPulse(prev => !prev), 2500);
    return () => clearInterval(timer);
  }, []);

  const totalWorkers = campaigns.reduce((acc, c) => acc + (parseInt(c.workers, 10) || 0), 0);
  const activeCount = campaigns.filter(c => c.status === true || c.stage === 'Live').length;
  const activeCampaign = campaigns[0] || null;

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      if (onApplyAiOptimization) onApplyAiOptimization();
      setIsOptimizing(false);
    }, 800);
  };

  const handleSeedLiveTelemetry = async () => {
    if (!activeCampaign) return;
    setIsSeeding(true);
    try {
      const res = await fetch('/api/telemetry/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: activeCampaign.id,
          campaignTitle: activeCampaign.name,
          city: activeCampaign.city || 'Chennai',
          headcount: activeCampaign.workers || 10
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Live Telemetry Seeded into Supabase!\n\n${data.message}`);
        if (onRefreshCampaigns) onRefreshCampaigns();
      }
    } catch (err) {
      console.error('Failed to seed telemetry:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <aside className="w-80 border-l border-espresso/10 bg-white text-espresso flex flex-col h-full overflow-hidden flex-shrink-0 hidden xl:flex font-sans">
      {/* Header */}
      <div className="p-4 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${pulse ? 'scale-125' : ''}`}></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">Live Telemetry Stream</h3>
        </div>
        <span className="text-[10px] bg-gold/15 text-espresso font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-gold/20">
          <Activity size={10} className="text-gold" /> LIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Live Workforce Headcount Status Bar */}
        <div className="bg-linen/25 border border-espresso/10 p-3.5 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">👷 Headcount Telemetry</span>
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="p-2 bg-white rounded-xl border border-espresso/10">
              <span className="text-xs font-bold text-espresso block">{totalWorkers}</span>
              <span className="text-[8px] text-muted">Deployed</span>
            </div>
            <div className="p-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <span className="text-xs font-bold block">{totalWorkers > 0 ? totalWorkers : 0}</span>
              <span className="text-[8px]">GPS Active</span>
            </div>
            <div className="p-2 bg-white text-espresso rounded-xl border border-espresso/10">
              <span className="text-xs font-bold block text-gold">{activeCount}</span>
              <span className="text-[8px] text-muted">Active Hubs</span>
            </div>
          </div>

          {campaigns.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <button 
                onClick={handleSeedLiveTelemetry}
                disabled={isSeeding}
                className="w-full bg-gold hover:bg-gold/90 text-espresso font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Zap size={13} className="text-espresso" />
                <span>{isSeeding ? 'Seeding Supabase DB...' : '⚡ Insert Live Telemetry to Supabase'}</span>
              </button>

              <button 
                onClick={handleRunOptimization}
                disabled={isOptimizing}
                className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles size={13} className="text-gold" />
                <span>{isOptimizing ? 'Rebalancing Waves...' : 'Trigger AI Wave Rebalance'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Hubs Roster */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Active Metro Hub Status</span>
          {campaigns.length > 0 ? (
            <div className="space-y-2">
              {campaigns.map((c) => (
                <div key={c.id} className="p-3 bg-white border border-espresso/10 rounded-2xl space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <strong className="text-espresso font-bold block text-xs">{c.city} • {c.name}</strong>
                    <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                      HEALTH: {c.health || 100}%
                    </span>
                  </div>
                  <div className="text-[10px] text-muted flex justify-between font-mono">
                    <span>Staff: <strong className="text-espresso">{c.workers} Verified</strong></span>
                    <span>Attendance: <strong className="text-green-700">{c.attendance || '100%'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-linen/20 border border-dashed border-espresso/10 rounded-2xl text-center text-muted text-[11px]">
              No active hubs. Launch a campaign to monitor live telemetry.
            </div>
          )}
        </div>

        {/* Real-time System Audit Ledger */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block flex items-center gap-1">
            <Terminal size={11} /> Real-Time Event Stream
          </span>

          <div className="bg-espresso text-green-400 p-3.5 rounded-2xl font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto border border-black shadow-inner">
            <div className="text-linen/50 border-b border-white/10 pb-1">
              [EDGE_RUNTIME] Connected to Supabase
            </div>
            {systemLogs.length > 0 ? (
              systemLogs.map(log => (
                <div key={log.id} className="leading-tight">
                  <span className="text-gold">[{log.time}]</span> <span className="text-white font-bold">{log.action}:</span> {log.details}
                </div>
              ))
            ) : (
              <div className="text-linen/50 italic">
                System telemetry listening. Zero dummy alerts active.
              </div>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
