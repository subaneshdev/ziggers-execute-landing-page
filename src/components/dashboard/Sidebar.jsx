"use client";
import React from 'react';
import { LayoutDashboard, Compass, Layers, Wallet, BarChart3, Settings, HelpCircle, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', name: 'Ads Manager', icon: <Layers size={18} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'wallet', name: 'Escrow Wallet', icon: <Wallet size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside className="w-64 bg-espresso text-white min-h-screen flex flex-col justify-between border-r border-linen/10">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-linen/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-espresso rounded-lg flex items-center justify-center font-bold text-lg">
            Z
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white leading-none">Ziggers</h1>
            <span className="text-[9px] font-bold tracking-widest text-gold uppercase mt-1 block">Console</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-gold text-espresso shadow-md' 
                  : 'text-linen/70 hover:bg-linen/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-linen/10 text-xs text-linen/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
          <span>API Connected</span>
        </div>
        <p>© {new Date().getFullYear()} Ziggers Execute</p>
      </div>
    </aside>
  );
}
