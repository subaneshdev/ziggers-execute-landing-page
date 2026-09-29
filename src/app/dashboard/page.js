"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import ModelEvaluationDashboard from '../../components/dashboard/ModelEvaluationDashboard';
import LocationAnalytics from '../../components/dashboard/LocationAnalytics';
import CalendarAndTemplates from '../../components/dashboard/CalendarAndTemplates';
import TrainingManager from '../../components/dashboard/TrainingManager';
import IntegrationsAndAudit from '../../components/dashboard/IntegrationsAndAudit';
import SignalSyncDashboard from '../../components/dashboard/SignalSyncDashboard';

import { 
  Layers, Activity, ShieldCheck, MapPin, Users, Cpu, 
  Calendar as CalendarIcon, Key, Plus, RefreshCw, Eye, Camera,
  UserCheck, MessageSquare, Target, Wallet, FileText, FileCheck, Compass,
  LogOut, User, Sparkles, Building, Loader2, Radio
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, organization, loading: authLoading, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isClientPortal, setIsClientPortal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);

  // Route protection: redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
      console.warn('Notice loading campaigns:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

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
        body: JSON.stringify({
          ...newCampaign,
          brand: newCampaign.brand || organization?.name || profile?.company || 'Enterprise Client'
        }),
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
    setCampaigns(prev => prev.map(c => (c.id === id || c.campaign_id === id) ? { ...c, status: updatedStatus, stage: updatedStatus ? 'Live' : 'Paused' } : c));
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
    setCampaigns(prev => prev.filter(c => c.id !== id && c.campaign_id !== id));
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      addSystemLog('CAMPAIGN_ARCHIVED', `Campaign ${id} archived from console.`);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  const handleApplyAiOptimization = () => {
    if (campaigns.length === 0) return;
    fetchCampaigns();
    addSystemLog('AI_OPTIMIZE', 'Triggered intelligence model sync against live geofences.');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <span className="text-xs font-bold text-muted">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex bg-[#faf9f6] min-h-screen text-espresso font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-grow flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-espresso/10 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeTab === 'signalSync' && <Radio className="text-gold" size={18} />}
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
            {activeTab === 'modelEval' && <ShieldCheck className="text-gold" size={18} />}
            {activeTab === 'analytics' && <Compass className="text-gold" size={18} />}
            {activeTab === 'calendar' && <CalendarIcon className="text-gold" size={18} />}
            {activeTab === 'training' && <BookOpenIcon size={18} className="text-gold" />}
            {activeTab === 'audit' && <Key size={18} className="text-gold" />}
            
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold text-espresso uppercase tracking-[-0.02em]">
                {isClientPortal ? 'Brand Client Portal' : `Campaigns Manager / ${activeTab === 'signalSync' ? 'SIGNAL SYNC (META ADS)' : activeTab.toUpperCase()}`}
              </h2>
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
              onClick={() => router.push('/campaigns/new')}
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
              {isClientPortal ? (
                <span className="inline-flex items-center gap-1.5"><Eye size={12} className="text-gold" /> Brand View Active</span>
              ) : (
                <span className="inline-flex items-center gap-1.5"><Eye size={12} className="text-muted" /> Switch Brand View</span>
              )}
            </button>

            <div className="h-4 w-[1px] bg-espresso/10"></div>

            {/* Auth Profile Badge */}
            <div className="flex items-center gap-2 bg-linen/40 border border-espresso/10 px-2.5 py-1 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-gold text-espresso text-[10px] font-mono font-bold flex items-center justify-center">
                {(profile?.full_name || user.email || 'Z')[0].toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="block text-[10px] font-bold text-espresso">{profile?.full_name || user.email?.split('@')[0]}</span>
                <span className="block text-[8px] text-muted">{organization?.name || profile?.company || 'Organization'}</span>
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="text-muted hover:text-red-600 p-1 transition-colors cursor-pointer"
              >
                <LogOut size={12} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main workspace scroll pane */}
          <main className="flex-1 p-6 overflow-y-auto w-full">
            {activeTab === 'signalSync' && (
              <SignalSyncDashboard 
                campaigns={campaigns}
                onDeployCampaign={(newCampaign) => {
                  setCampaigns(prev => [newCampaign, ...prev]);
                  addSystemLog('SIGNAL_SYNC_LAUNCH', `Launched "${newCampaign.name}" directly into live execution.`);
                  setActiveTab('dashboard');
                }}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in duration-200">
                <MetricsHeader campaigns={campaigns} />
                <AdsManagerTable 
                  onCreateClick={() => router.push('/campaigns/new')} 
                  campaigns={campaigns}
                  onToggleStatus={handleToggleStatus}
                  onDeleteCampaign={handleDeleteCampaign}
                  isLoading={isLoading}
                />
              </div>
            )}

            {activeTab === 'liveDashboard' && (
              <LiveCampaignDashboard 
                campaigns={campaigns} 
                onCreateClick={() => router.push('/campaigns/new')}
              />
            )}

            {activeTab === 'locationHiring' && (
              <LocationHiring 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'deployment' && (
              <DeploymentBoard 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceGpsTracker 
                campaigns={campaigns}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'proof' && (
              <ProofCenter 
                campaigns={campaigns}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'supervisors' && (
              <SupervisorManager 
                campaigns={campaigns}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'communication' && (
              <CampaignCommunication 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'targetsLeads' && (
              <TargetsAndLeads 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'wallet' && (
              <CampaignWallet 
                campaigns={campaigns}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'billing' && (
              <InvoiceBilling 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'agency' && (
              <AgencyClientManager 
                campaigns={campaigns}
                onCreateClick={() => router.push('/campaigns/new')}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'reports' && (
              <CampaignReportGenerator 
                campaigns={campaigns}
                onLogAction={addSystemLog}
              />
            )}

            {activeTab === 'aiPlanner' && (
              <AiCampaignPlanner 
                onPlanApproved={(newPlan) => {
                  handlePublishCampaign(newPlan);
                  setActiveTab('dashboard');
                }}
              />
            )}

            {activeTab === 'modelEval' && (
              <ModelEvaluationDashboard />
            )}

            {activeTab === 'analytics' && (
              <LocationAnalytics campaigns={campaigns} />
            )}

            {activeTab === 'calendar' && (
              <CalendarAndTemplates 
                campaigns={campaigns} 
                onCreateClick={() => setIsCreatorOpen(true)}
              />
            )}

            {activeTab === 'training' && (
              <TrainingManager onLogAction={addSystemLog} />
            )}

            {activeTab === 'audit' && (
              <IntegrationsAndAudit />
            )}
          </main>

          {/* Right Live Command Center Feed */}
          <CommandCenter 
            campaigns={campaigns} 
            onRunOptimization={handleApplyAiOptimization}
            logs={systemLogs}
          />
        </div>

      </div>

      {/* Campaign Creation Modal */}
      {isCreatorOpen && (
        <CampaignCreator 
          isOpen={isCreatorOpen} 
          onClose={() => setIsCreatorOpen(false)} 
          onPublish={handlePublishCampaign}
        />
      )}

    </div>
  );
}

function BookOpenIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
