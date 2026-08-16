"use client";
import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, FileText, Plus, Award, Users, Trash2, Video, CheckSquare } from 'lucide-react';

export default function TrainingManager({ onLogAction }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'workers'
  const [modules, setModules] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('PDF & Video Guide');
  const [newDuration, setNewDuration] = useState('5 mins');
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newMod = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      duration: newDuration,
      created_at: new Date().toLocaleDateString()
    };

    setModules(prev => [...prev, newMod]);
    if (onLogAction) onLogAction('TRAINING_CREATED', `Added training module: ${newTitle}`);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleGenerateAiTraining = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const generated = [
        { id: Date.now() + 1, title: 'Module 1: Brand Pitch & Voice Architecture', type: 'Interactive Audio Script', duration: '6 mins', created_at: 'AI Generated' },
        { id: Date.now() + 2, title: 'Module 2: Geofenced Check-In & Biometric Liveness Protocol', type: 'Mobile Simulation', duration: '4 mins', created_at: 'AI Generated' },
        { id: Date.now() + 3, title: 'Module 3: POSM Merchandising & Shelf Share Standards', type: 'Visual Guide & Photo Quiz', duration: '5 mins', created_at: 'AI Generated' },
        { id: Date.now() + 4, title: 'Module 4: Customer Objection Handling & Lead Capture', type: 'Roleplay Video', duration: '8 mins', created_at: 'AI Generated' }
      ];
      setModules(prev => [...prev, ...generated]);
      setAiGenerating(false);
      if (onLogAction) onLogAction('AI_TRAINING_GENERATED', 'AI generated 4 standard activation training modules.');
    }, 1000);
  };

  const handleDeleteModule = (id) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">Worker Training & Certification Engine</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Build interactive brand pitch modules, set compliance quizzes, and certify promoters before wave dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleGenerateAiTraining}
            disabled={aiGenerating}
            className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{aiGenerating ? 'Synthesizing Modules...' : '✨ Generate Training with AI'}</span>
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-espresso hover:bg-muted text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {/* Certification Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-espresso/10 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-muted uppercase block">Active Course Modules</span>
          <span className="text-2xl font-extrabold text-espresso mt-1 block">{modules.length}</span>
        </div>
        <div className="bg-white border border-espresso/10 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-muted uppercase block">Certified Promoters</span>
          <span className="text-2xl font-extrabold text-green-600 mt-1 block">{workersList.filter(w => w.status === 'certified').length}</span>
        </div>
        <div className="bg-white border border-espresso/10 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-muted uppercase block">Pass Mark Threshold</span>
          <span className="text-2xl font-extrabold text-espresso mt-1 block">85%</span>
        </div>
        <div className="bg-white border border-espresso/10 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-muted uppercase block">Verification Mode</span>
          <span className="text-2xl font-extrabold text-gold mt-1 block">Auto-Sync</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-espresso/10 pb-3">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-espresso text-white' : 'text-muted hover:text-espresso'}`}
        >
          Training Modules ({modules.length})
        </button>
        <button 
          onClick={() => setActiveTab('workers')} 
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'workers' ? 'bg-espresso text-white' : 'text-muted hover:text-espresso'}`}
        >
          Certification Roster ({workersList.length})
        </button>
      </div>

      {/* Main Tab content */}
      {activeTab === 'overview' ? (
        <div>
          {modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod) => (
                <div key={mod.id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-espresso/25 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <strong className="text-sm font-extrabold text-espresso block">{mod.title}</strong>
                      <button 
                        onClick={() => handleDeleteModule(mod.id)} 
                        className="text-muted hover:text-red-600 p-1 cursor-pointer"
                        title="Remove Module"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="bg-linen/40 px-2 py-0.5 rounded text-[11px] font-semibold">{mod.type}</span>
                      <span>Duration: {mod.duration}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-espresso/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-muted">{mod.created_at}</span>
                    <span className="text-green-700 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle size={12} /> Ready for Promoters
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-espresso/15 p-8">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-3">
                <BookOpen size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider mb-1">
                No Training Modules Created
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto mb-5 leading-relaxed">
                Dummy course records have been removed. Add your brand-specific pitch decks or click &quot;Generate Training with AI&quot; to auto-create standard offline activation modules.
              </p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={handleGenerateAiTraining}
                  className="bg-gold text-espresso font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer hover:bg-gold/90 transition-all"
                >
                  ✨ Auto-Generate with AI
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-espresso text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer hover:bg-muted transition-all"
                >
                  + Add Custom Module
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-espresso/10 rounded-2xl p-6 text-center">
          <Users size={32} className="mx-auto text-gold mb-3" />
          <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider mb-1">
            Certification Roster Sync
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Promoters who accept campaign waves will automatically take training on their Ziggers mobile terminal and their test scores will stream live here.
          </p>
        </div>
      )}

      {/* Add Module Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-espresso/10 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">Add Training Module</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted font-bold text-sm cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-espresso uppercase text-[10px]">Module Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Sampling Pitch Script & Objection Handling"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-espresso uppercase text-[10px]">Format</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                  >
                    <option>PDF & Video Guide</option>
                    <option>Interactive Script Audio</option>
                    <option>App Geofence Simulation</option>
                    <option>Do’s & Don’ts Checklist</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-espresso uppercase text-[10px]">Estimated Duration</label>
                  <input 
                    type="text"
                    placeholder="e.g. 6 mins"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-espresso text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-linen/50 text-espresso font-bold py-2.5 rounded-xl cursor-pointer hover:bg-linen/80"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-espresso hover:bg-muted text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
