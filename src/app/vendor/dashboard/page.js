'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('RFQS');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Vendor Partner Operating Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                KYC: Verified Partner
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manage enterprise RFQs, submitted quotes, active on-ground work orders, and milestone disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/onboarding"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              Update Rate Cards & Coverage
            </Link>
          </div>
        </div>

        {/* Financial & Milestone Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Work Orders</span>
            <div className="text-2xl font-bold text-white mt-1">0 Active</div>
            <span className="text-xs text-slate-400 mt-1 block">0 awaiting on-ground QA</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open RFQs in City</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">0 Open RFQs</div>
            <span className="text-xs text-slate-400 mt-1 block">Chennai Region</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Escrow Held for Work Orders</span>
            <div className="text-2xl font-bold text-white mt-1">₹0.00</div>
            <span className="text-xs text-emerald-400 mt-1 block">100% Guaranteed Settlement</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Campaigns</span>
            <div className="text-2xl font-bold text-white mt-1">0 Completed</div>
            <span className="text-xs text-slate-400 mt-1 block">Rating: Unrated (New Partner)</span>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            {['RFQS', 'WORK_ORDERS', 'SETTLEMENTS'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'RFQS' ? 'Open RFQs (0)' : tab === 'WORK_ORDERS' ? 'Work Orders (0)' : 'Milestone Settlements (0)'}
              </button>
            ))}
          </div>

          {/* Honest Empty State */}
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl text-slate-400 mx-auto mb-4">
              📭
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Active {activeTab.replace('_', ' ')} Available</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              When brands create and approve operational campaign requirements matching your services and geographic coverage, RFQs will appear here in real-time.
            </p>
            <Link
              href="/vendor/onboarding"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Verify Service Categories & Rate Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
