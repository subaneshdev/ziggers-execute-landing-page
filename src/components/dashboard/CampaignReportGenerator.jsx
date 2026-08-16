"use client";
import React, { useState } from 'react';
import { 
  FileCheck, Download, Printer, Share2, CheckCircle2, 
  MapPin, Users, Clock, Target, Camera, Video, DollarSign, 
  Sparkles, Award, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function CampaignReportGenerator({ campaigns = [], onLogAction }) {
  const [selectedReport, setSelectedReport] = useState('coke_college_2026');

  // Report Summary Data as specified in Feature 17
  const reportData = {
    campaignName: 'Coca-Cola Mega College Activation 2026',
    brand: 'Coca-Cola India',
    agency: 'Mindshare BTL & Media',
    dateRange: 'August 20 – 25, 2026',
    status: 'Campaign Completed ✅',
    
    // Deployment Section
    deployment: {
      totalWorkers: 125,
      supervisors: 12,
      locationsCount: 18,
      durationDays: 5,
      metroHubs: 'Chennai, Bangalore, Hyderabad'
    },

    // Execution Section
    execution: {
      attendanceRate: '96.4%',
      workingHours: '2,450 Hours',
      locationsCompleted: 18,
      geofenceAccuracy: '99.8%',
      noShowReplacements: '4 Dispatched in < 15m'
    },

    // Engagement Section
    engagement: {
      interactions: '24,820',
      samplesDistributed: '12,450',
      leadsCollected: '4,200',
      qrScans: '8,900',
      appDownloads: '2,150'
    },

    // Proof Section
    proof: {
      photosVerified: '1,280 Photos',
      videosVerified: '186 Videos',
      gpsWatermarks: '100% Cryptographically Tagged',
      auditApprovalRate: '99.2%'
    },

    // Financials Section
    financials: {
      workerPayouts: '₹7,50,000',
      supervisorCosts: '₹1,20,000',
      platformCharges: '₹65,000',
      totalSpend: '₹9,35,000',
      effectiveCpl: '₹37.60'
    }
  };

  const handlePrintReport = () => {
    if (onLogAction) {
      onLogAction('CAMPAIGN_REPORT_DOWNLOADED', `Generated and downloaded official branded PDF report for "${reportData.campaignName}"`);
    }
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Automated Campaign Completion Report
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Automatically compiles on-ground deployment, execution telemetry, engagement numbers, geotagged proof media, and financial ledgers into an exportable branded client PDF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Download Branded PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Branded Report Container */}
      <div className="bg-white border border-espresso/10 rounded-3xl shadow-sm overflow-hidden p-6 md:p-10 space-y-8">
        
        {/* Report Top Banner */}
        <div className="bg-espresso text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-green-500 text-black font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} /> {reportData.status}
              </span>
              <span className="text-[10px] text-gold font-mono font-bold">
                AUDITED REPORT ID: ZG-RPT-2026-88
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {reportData.campaignName}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-medium pt-1">
              <span>Brand: <strong className="text-white font-extrabold">{reportData.brand}</strong></span>
              <span>•</span>
              <span>Agency: <strong className="text-white font-extrabold">{reportData.agency}</strong></span>
              <span>•</span>
              <span>Dates: <strong className="text-white font-extrabold">{reportData.dateRange}</strong></span>
            </div>
          </div>

          <div className="text-right relative z-10 font-mono">
            <span className="text-[10px] text-white/60 uppercase block font-bold">Overall Effective CPL</span>
            <span className="text-3xl font-extrabold text-gold">{reportData.financials.effectiveCpl}</span>
            <span className="text-[10px] text-green-400 block mt-0.5">38% below industry benchmark</span>
          </div>
        </div>

        {/* 4 Core Metric Pillars Grid - As detailed in Feature 17 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1: Deployment */}
          <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
              <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-gold" /> Deployment
              </span>
              <span className="text-[10px] font-mono text-muted font-bold">5 Days</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Verified Workers:</span>
                <strong className="text-espresso font-extrabold">{reportData.deployment.totalWorkers}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Field Supervisors:</span>
                <strong className="text-espresso font-extrabold">{reportData.deployment.supervisors}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Locations Covered:</span>
                <strong className="text-espresso font-extrabold">{reportData.deployment.locationsCount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Active Metros:</span>
                <strong className="text-espresso font-bold">{reportData.deployment.metroHubs.split(',')[0]}</strong>
              </div>
            </div>
          </div>

          {/* Pillar 2: Execution */}
          <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
              <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-green-600" /> Execution
              </span>
              <span className="text-[10px] font-mono text-green-700 font-bold">{reportData.execution.attendanceRate}</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Attendance Score:</span>
                <strong className="text-green-700 font-extrabold">{reportData.execution.attendanceRate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Work Hours:</span>
                <strong className="text-espresso font-extrabold">{reportData.execution.workingHours}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Completed Hubs:</span>
                <strong className="text-espresso font-extrabold">{reportData.execution.locationsCompleted} / 18</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Geofence Match:</span>
                <strong className="text-espresso font-bold">{reportData.execution.geofenceAccuracy}</strong>
              </div>
            </div>
          </div>

          {/* Pillar 3: Engagement */}
          <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
              <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-gold" /> Engagement
              </span>
              <span className="text-[10px] font-mono text-gold font-bold">24k+ Total</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Interactions:</span>
                <strong className="text-espresso font-extrabold">{reportData.engagement.interactions}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Samples Distributed:</span>
                <strong className="text-gold font-extrabold">{reportData.engagement.samplesDistributed}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Leads Captured:</span>
                <strong className="text-green-700 font-extrabold">{reportData.engagement.leadsCollected}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Contest QR Scans:</span>
                <strong className="text-espresso font-bold">{reportData.engagement.qrScans}</strong>
              </div>
            </div>
          </div>

          {/* Pillar 4: Proof & Media */}
          <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
              <span className="text-xs font-extrabold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-purple-600" /> Audit Proof
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold">100% Verified</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Geotagged Photos:</span>
                <strong className="text-espresso font-extrabold">{reportData.proof.photosVerified}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Short Videos:</span>
                <strong className="text-espresso font-extrabold">{reportData.proof.videosVerified}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">GPS Stamping:</span>
                <strong className="text-green-700 font-bold">Cryptographic</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Audit Approval:</span>
                <strong className="text-espresso font-bold">{reportData.proof.auditApprovalRate}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Financial Payout Summary Section */}
        <div className="bg-espresso text-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <DollarSign size={14} /> Campaign Payout & Financial Settlement Statement
            </h4>
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">
              Settled via Escrow
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Promoter Wage Payouts</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">{reportData.financials.workerPayouts}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Supervisor Logistics</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">{reportData.financials.supervisorCosts}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Platform Software Fees</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">{reportData.financials.platformCharges}</span>
            </div>

            <div className="bg-gold/20 p-3 rounded-xl border border-gold/40">
              <span className="text-[10px] text-gold block font-bold">Total Settled Spend</span>
              <span className="text-base font-extrabold text-gold mt-0.5 block">{reportData.financials.totalSpend}</span>
            </div>
          </div>
        </div>

        {/* Footer Brand Endorsement */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-espresso/10 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <ShieldCheck size={16} className="text-green-600 shrink-0" />
            <span>Certified campaign audit report generated by Ziggers Execute Campaign Operating System.</span>
          </div>

          <button
            onClick={handlePrintReport}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer size={13} className="text-gold" />
            <span>Print Branded Executive PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
