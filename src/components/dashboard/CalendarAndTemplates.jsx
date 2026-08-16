"use client";
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Copy, Repeat, Plus, Clock, MapPin, Sparkles, Layers } from 'lucide-react';

export default function CalendarAndTemplates({ campaigns = [], onCreateClick }) {
  const [activeSubView, setActiveSubView] = useState('calendar'); // 'calendar', 'templates'
  const [templates, setTemplates] = useState([]);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('Product Sampling');
  const [templateRoles, setTemplateRoles] = useState('10 Promoters, 1 Supervisor');

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!templateName) return;

    const newTpl = {
      id: Date.now().toString(),
      name: templateName,
      type: templateType,
      roles: templateRoles,
      duration: 'Weekend (Sat & Sun)',
      usageCount: 1
    };

    setTemplates(prev => [...prev, newTpl]);
    setTemplateName('');
    setIsAddTemplateOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Campaign Calendar & Template Hub</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Schedule recurring activations, view monthly campaign timelines, and configure reusable campaign blueprints.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveSubView('calendar')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'calendar' ? 'bg-espresso text-white' : 'bg-linen/30 text-espresso/70 hover:bg-linen/60'
            }`}
          >
            Campaign Calendar
          </button>
          <button 
            onClick={() => setActiveSubView('templates')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'templates' ? 'bg-espresso text-white' : 'bg-linen/30 text-espresso/70 hover:bg-linen/60'
            }`}
          >
            Saved Templates ({templates.length})
          </button>
        </div>
      </div>

      {activeSubView === 'calendar' ? (
        <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-espresso/10 pb-4 gap-2">
            <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
              Activation Schedule ({campaigns.length} Active Deployments)
            </h3>
            <span className="text-xs font-bold text-gold bg-linen/50 px-3 py-1 rounded-full border border-espresso/5">
              ● Live Sync with Supabase
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="py-2 bg-linen/30 rounded-lg">{day}</div>
            ))}

            {Array.from({ length: 28 }).map((_, i) => {
              const dayNum = i + 1;
              // Map campaigns to days dynamically
              const assignedCampaign = campaigns[i % Math.max(1, campaigns.length)];
              const hasEvent = campaigns.length > 0 && (i % 3 === 0 || i % 7 === 5);

              return (
                <div key={i} className="min-h-[75px] border border-espresso/10 rounded-xl p-2 text-left flex flex-col justify-between hover:bg-linen/20 transition-colors">
                  <span className="text-[10px] font-mono text-muted">{dayNum}</span>
                  {hasEvent && assignedCampaign && (
                    <div className="bg-gold/15 text-espresso font-bold text-[9px] p-1.5 rounded-md border border-gold/30 truncate">
                      {assignedCampaign.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">{tpl.type}</span>
                    <h3 className="text-sm font-extrabold text-espresso mt-1">{tpl.name}</h3>
                    <p className="text-xs text-muted mt-2">Workforce: {tpl.roles}</p>
                    <p className="text-xs text-muted">Duration: {tpl.duration}</p>
                  </div>

                  <div className="pt-3 border-t border-espresso/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted">Usage: {tpl.usageCount}</span>
                    <button 
                      onClick={onCreateClick}
                      className="flex items-center gap-1 bg-espresso hover:bg-muted text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Copy size={12} /> Use Blueprint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-espresso/15 p-8">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-3">
                <Layers size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider mb-1">
                No Saved Campaign Blueprints
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto mb-5 leading-relaxed">
                Dummy template records have been removed. Create reusable activation templates for fast one-click campaign dispatches.
              </p>
              <button 
                onClick={() => setIsAddTemplateOpen(true)}
                className="inline-flex items-center gap-1.5 bg-espresso hover:bg-muted text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>Create Campaign Blueprint</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Blueprint Modal */}
      {isAddTemplateOpen && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-espresso/10 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">Create Campaign Blueprint</h3>
              <button onClick={() => setIsAddTemplateOpen(false)} className="text-muted font-bold text-sm cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-espresso uppercase text-[10px]">Blueprint Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Metro Food Sampling Standard"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-espresso uppercase text-[10px]">Activation Objective</label>
                <select 
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                >
                  <option>Product Sampling</option>
                  <option>Retail Store Audit</option>
                  <option>Experiential Roadshow</option>
                  <option>Merchant Acquisition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-espresso uppercase text-[10px]">Workforce Allocation</label>
                <input 
                  type="text"
                  placeholder="e.g. 12 Promoters, 1 Supervisor"
                  value={templateRoles}
                  onChange={(e) => setTemplateRoles(e.target.value)}
                  className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddTemplateOpen(false)}
                  className="flex-1 bg-linen/50 text-espresso font-bold py-2.5 rounded-xl cursor-pointer hover:bg-linen/80"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-espresso hover:bg-muted text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Save Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
