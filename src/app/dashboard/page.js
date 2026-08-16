"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MetricsHeader from '../../components/dashboard/MetricsHeader';
import AdsManagerTable from '../../components/dashboard/AdsManagerTable';
import CampaignCreator from '../../components/dashboard/CampaignCreator';
import CommandCenter from '../../components/dashboard/CommandCenter';
import LiveCampaignDashboard from '../../components/dashboard/LiveCampaignDashboard';
import LocationHiring from '../../components/dashboard/LocationHiring';
import DeploymentBoard from '../../components/dashboard/DeploymentBoard';
import AttendanceGpsTracker from '../../components/dashboard/AttendanceGpsTracker';
import ProofCenter from '../../components/dashboard/ProofCenter';
import SupervisorManager from '../../components/dashboard/SupervisorManager';
import CampaignCommunication from '../../components/dashboard/CampaignCommunication';
import TargetsAndLeads from '../../components/dashboard/TargetsAndLeads';
import CampaignWallet from '../../components/dashboard/CampaignWallet';
import InvoiceBilling from '../../components/dashboard/InvoiceBilling';
import AgencyClientManager from '../../components/dashboard/AgencyClientManager';
import CampaignReportGenerator from '../../components/dashboard/CampaignReportGenerator';
import AiCampaignPlanner from '../../components/dashboard/AiCampaignPlanner';

import { 
  Layers, Activity, ShieldCheck, MapPin, Users, Cpu, 
  Calendar as CalendarIcon, Key, Plus, RefreshCw, Eye, Camera,
  UserCheck, MessageSquare, Target, Wallet, FileText, FileCheck, Compass,
  LogOut, User, Sparkles
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isClientPortal, setIsClientPortal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);

  // Fetch live campaigns from Supabase Edge API
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.success && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const addSystemLog = (action, details) => {
    const newLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      details,
      type: 'success'
    };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handlePublishCampaign = async (newCampaign) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns(prev => [data.campaign, ...prev]);
        addSystemLog('CAMPAIGN_DEPLOYED', `Deployed "${data.campaign.name}" to ${data.campaign.city} hub.`);
      }
    } catch (err) {
      console.error('Failed to publish campaign:', err);
    }
    setIsCreatorOpen(false);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: updatedStatus, stage: updatedStatus ? 'Live' : 'Paused' } : c));
    try {
      await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: updatedStatus, stage: updatedStatus ? 'Live' : 'Paused' }),
      });
      addSystemLog('STATUS_CHANGED', `Campaign ${id} toggled to ${updatedStatus ? 'LIVE' : 'PAUSED'}.`);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteCampaign = async (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      addSystemLog('CAMPAIGN_ARCHIVED', `Campaign ${id} archived from console.`);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  const handleApplyAiOptimization = () => {
    if (campaigns.length === 0) return;
    const updated = campaigns.map(c => ({
      ...c,
      attendance: '99%',
      health: 100,
      actualCpl: '₹88',
      healthBreakdown: { staffing: 100, attendance: 100, inventory: 98, kpiProgress: 96, proof: 100, budget: 95 }
    }));
    setCampaigns(updated);
    addSystemLog('AI_OPTIMIZE', 'AI Wave Optimization balanced promoter attendance and inventory velocity.');
  };

  const { user, profile, signOut, loginAsDemo } = useAuth();

  return (
    <div className="flex bg-[#faf9f6] min-h-screen text-espresso font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-grow flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-espresso/10 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && <Layers className="text-gold" size={18} />}
            {activeTab === 'liveDashboard' && <Activity className="text-gold" size={18} />}
            {activeTab === 'locationHiring' && <Compass className="text-gold" size={18} />}
            {activeTab === 'deployment' && <Users className="text-gold" size={18} />}
            {activeTab === 'attendance' && <MapPin className="text-gold" size={18} />}
            {activeTab === 'proof' && <Camera className="text-gold" size={18} />}
            {activeTab === 'supervisors' && <UserCheck className="text-gold" size={18} />}
            {activeTab === 'communication' && <MessageSquare className="text-gold" size={18} />}
            {activeTab === 'targetsLeads' && <Target className="text-gold" size={18} />}
            {activeTab === 'wallet' && <Wallet className="text-gold" size={18} />}
            {activeTab === 'billing' && <FileText className="text-gold" size={18} />}
            {activeTab === 'agency' && <Eye className="text-gold" size={18} />}
            {activeTab === 'reports' && <FileCheck className="text-gold" size={18} />}
            {activeTab === 'aiPlanner' && <Cpu className="text-gold" size={18} />}
            
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                {isClientPortal ? 'Brand Client Portal' : `Campaigns Manager / ${activeTab.toUpperCase()}`}
              </h2>
              <span className="text-[10px] bg-gold/15 text-espresso font-bold px-2.5 py-0.5 rounded-full border border-gold/20">
                Supabase Auth Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-muted">
            <button 
              onClick={fetchCampaigns}
              title="Refresh Edge Data"
              className="p-1.5 rounded-lg border border-espresso/10 hover:border-gold text-espresso hover:text-gold transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button 
              onClick={() => setIsCreatorOpen(true)}
              className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white text-[11px] font-extrabold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus size={14} className="text-gold" />
              <span>Create Campaign</span>
            </button>

            <div className="h-4 w-[1px] bg-espresso/10"></div>
            
            <button 
              onClick={() => {
                setIsClientPortal(!isClientPortal);
                if (!isClientPortal) setActiveTab('agency');
              }}
              className="text-[10px] font-bold text-espresso bg-linen/50 hover:bg-linen px-3 py-1.5 rounded-xl border border-espresso/10 hover:border-gold cursor-pointer transition-colors"
            >
              {isClientPortal ? '👁️ Brand View Active' : 'Switch Brand View'}
            </button>

            <div className="h-4 w-[1px] bg-espresso/10"></div>

            {/* Auth Profile Badge */}
            {user ? (
              <div className="flex items-center gap-2 bg-linen/40 border border-espresso/10 px-2.5 py-1 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-gold text-espresso text-[10px] font-mono font-bold flex items-center justify-center">
                  {(profile?.full_name || user.email || 'Z')[0].toUpperCase()}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <span className="block text-[10px] font-bold text-espresso">{profile?.full_name || user.email?.split('@')[0]}</span>
                  <span className="block text-[8px] text-muted">{profile?.company || 'Brand Partner'}</span>
                </div>
                <button
                  onClick={signOut}
                  title="Sign out"
                  className="text-muted hover:text-red-600 p-1 transition-colors cursor-pointer"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-[10px] font-bold text-espresso bg-white border border-espresso/20 px-3 py-1.5 rounded-xl hover:border-gold"
              >
                Sign In
              </a>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main workspace scroll pane */}
          <main className="flex-1 p-6 overflow-y-auto w-full">
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in duration-200">
                <MetricsHeader campaigns={campaigns} />
                <AdsManagerTable 
                  onCreateClick={() => setIsCreatorOpen(true)} 
                  campaigns={campaigns}
                  onToggleStatus={handleToggleStatus}
                  onDeleteCampaign={handleDeleteCampaign}
                  isLoading={isLoading}
                />
              </div>
            )}

            {activeTab === 'liveDashboard' && (
              <LiveCampaignDashboard campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'locationHiring' && (
              <LocationHiring campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'deployment' && (
              <DeploymentBoard campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'attendance' && (
              <AttendanceGpsTracker campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'proof' && (
              <ProofCenter campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'supervisors' && (
              <SupervisorManager campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'communication' && (
              <CampaignCommunication campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'targetsLeads' && (
              <TargetsAndLeads campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'wallet' && (
              <CampaignWallet campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'billing' && (
              <InvoiceBilling campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'agency' && (
              <AgencyClientManager 
                campaigns={campaigns}
                isClientPortal={isClientPortal} 
                setIsClientPortal={setIsClientPortal} 
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'reports' && (
              <CampaignReportGenerator campaigns={campaigns} onLogAction={addSystemLog} />
            )}

            {activeTab === 'aiPlanner' && (
              <AiCampaignPlanner 
                onDeployDraft={(draft) => {
                  handlePublishCampaign({ 
                    name: draft.name, 
                    objective: draft.objective, 
                    workers: draft.headcount || 12, 
                    budget: draft.budget,
                    city: draft.cities?.[0] || 'Chennai',
                    targetCpl: draft.metrics?.estimatedCpl || '₹100',
                    actualCpl: draft.metrics?.estimatedCpl || '₹95'
                  });
                  setActiveTab('dashboard');
                }}
              />
            )}
          </main>

          {/* Command Center Sidebar (Visible on main Dashboard tab) */}
          {activeTab === 'dashboard' && (
            <CommandCenter 
              campaigns={campaigns}
              systemLogs={systemLogs}
              onApplyAiOptimization={handleApplyAiOptimization} 
            />
          )}

        </div>

      </div>

      {/* Campaign Creator Modal Popup */}
      {isCreatorOpen && (
        <CampaignCreator 
          onClose={() => setIsCreatorOpen(false)} 
          onPublish={handlePublishCampaign} 
        />
      )}

    </div>
  );
}
