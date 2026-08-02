"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MetricsHeader from '../../components/dashboard/MetricsHeader';
import AdsManagerTable from '../../components/dashboard/AdsManagerTable';
import CampaignCreator from '../../components/dashboard/CampaignCreator';
import { Layers, Activity, Wallet, Settings as SettingsIcon } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Trigger campaign simulation append
  const handlePublishCampaign = (newCampaign) => {
    // Simulated event notification / reload triggers
    console.log("New Campaign Published to Escrow Ledger: ", newCampaign);
  };

  return (
    <div className="flex bg-light-gray min-h-screen text-espresso">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-espresso/10 py-5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && <Layers className="text-gold" size={20} />}
            {activeTab === 'analytics' && <Activity className="text-gold" size={20} />}
            {activeTab === 'wallet' && <Wallet className="text-gold" size={20} />}
            {activeTab === 'settings' && <SettingsIcon className="text-gold" size={20} />}
            <h2 className="text-sm font-extrabold text-espresso capitalize">
              {activeTab === 'dashboard' ? 'Ads Manager Workspace' : `${activeTab} Controls`}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-muted">
            <span>Account ID: ACT_ZIG_82412</span>
            <div className="h-4 w-[1px] bg-espresso/10"></div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-espresso">Live Operations Node</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-200">
              <MetricsHeader />
              <AdsManagerTable onCreateClick={() => setIsCreatorOpen(true)} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white border border-espresso/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-200 text-center py-20">
              <Activity className="text-gold mx-auto mb-4" size={48} />
              <h3 className="text-lg font-extrabold text-espresso">Real-Time Performance Analytics</h3>
              <p className="text-xs text-muted max-w-md mx-auto mt-2 leading-relaxed">
                Connect your campaign dashboard to view attendance geofences, sample distribution heatmaps, and cost-per-result logs across active cities.
              </p>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white border border-espresso/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-200 text-center py-20">
              <Wallet className="text-gold mx-auto mb-4" size={48} />
              <h3 className="text-lg font-extrabold text-espresso">Escrow Funding & Payroll Ledger</h3>
              <p className="text-xs text-muted max-w-md mx-auto mt-2 leading-relaxed">
                Fund local campaign wallets, track pending worker invoice milestones, and configure automated UPI wage disbursements.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-espresso/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-200 text-center py-20">
              <SettingsIcon className="text-gold mx-auto mb-4" size={48} />
              <h3 className="text-lg font-extrabold text-espresso">Workspace Configurations</h3>
              <p className="text-xs text-muted max-w-md mx-auto mt-2 leading-relaxed">
                Configure corporate API webhooks, manage partner organization permissions, and set biometric Aadhaar KYC threshold levels.
              </p>
            </div>
          )}
        </main>

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
