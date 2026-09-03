"use client";
import React, { useState } from 'react';
import { 
  MessageSquare, Send, Bell, AlertTriangle, Users, 
  ShieldCheck, Phone, CheckCheck, Sparkles, Megaphone, 
  Radio, Clock, AlertCircle, Plus, X
} from 'lucide-react';

export default function CampaignCommunication({ campaigns = [], onLogAction, onCreateClick }) {
  const activeCampaign = campaigns[0] || null;
  const [activeChannel, setActiveChannel] = useState('agency_supervisors');
  const [messageInput, setMessageInput] = useState('');
  const [emergencyAlertOpen, setEmergencyAlertOpen] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const campaignTitle = activeCampaign ? (activeCampaign.name || activeCampaign.title || 'Brand Campaign') : '';
  const campaignCity = activeCampaign?.city || 'Metro';

  // Initial messages state derived from campaign
  const initialMessages = activeCampaign ? {
    agency_supervisors: [
      {
        id: 'm1',
        sender: 'Campaign Dispatch Desk',
        role: 'Operations Lead',
        text: `Welcome team! Campaign "${campaignTitle}" is active. All promotional materials delivered to ${campaignCity} hubs.`,
        time: '09:00 AM',
        isAgency: true
      }
    ],
    supervisor_ziggers: [
      {
        id: 'm2',
        sender: 'Field Supervisor',
        role: 'Operations Lead',
        text: `Reminder: Greet customers enthusiastically for "${campaignTitle}". Capture verified QR scans & OTP leads.`,
        time: '09:30 AM',
        isAgency: false
      }
    ],
    agency_all_ziggers: [
      {
        id: 'm3',
        sender: 'Ziggers Official Broadcast Desk',
        role: 'System Broadcast',
        text: `SHIFT REMINDER: Shift hours conclude on schedule. Please take your check-out selfie and log final sampling counters.`,
        time: '04:00 PM',
        isAgency: true
      }
    ]
  } : { agency_supervisors: [], supervisor_ziggers: [], agency_all_ziggers: [] };

  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: 'm_' + Date.now().toString(36),
      sender: 'Agency Operations Desk',
      role: 'Campaign Manager',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgency: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    if (onLogAction) {
      onLogAction('DISPATCH_MESSAGE_SENT', `Sent dispatch message in ${activeChannel}: "${messageInput}"`);
    }

    setMessageInput('');
  };

  const handleSendEmergencyAlert = (e) => {
    e.preventDefault();
    if (!emergencyText.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      const alertMsg = {
        id: 'em_' + Date.now().toString(36),
        sender: '🚨 EMERGENCY OPS DESK',
        role: 'Priority Alert',
        text: emergencyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAgency: true,
        isEmergency: true
      };

      setMessages(prev => ({
        agency_supervisors: [...(prev.agency_supervisors || []), alertMsg],
        supervisor_ziggers: [...(prev.supervisor_ziggers || []), alertMsg],
        agency_all_ziggers: [...(prev.agency_all_ziggers || []), alertMsg]
      }));

      if (onLogAction) {
        onLogAction('EMERGENCY_BROADCAST_TRIGGERED', `Emergency alert broadcasted: "${emergencyText}"`);
      }

      setIsBroadcasting(false);
      setBroadcastSent(true);
      setTimeout(() => {
        setBroadcastSent(false);
        setEmergencyAlertOpen(false);
        setEmergencyText('');
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Campaign Communication Hub
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Structured multi-channel dispatch feeds with instant shift reminders & emergency broadcasts.
          </p>
        </div>

        {activeCampaign && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmergencyAlertOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-sm cursor-pointer transition-all"
            >
              <Megaphone size={15} />
              <span>Emergency Broadcast Alert</span>
            </button>
          </div>
        )}
      </div>

      {activeCampaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Channel Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block px-1">
                Campaign Channels
              </span>

              {[
                { id: 'agency_supervisors', title: 'Agency ↔ Supervisors', desc: 'Ops Leads & Field Supervisors', icon: '🟢' },
                { id: 'supervisor_ziggers', title: 'Supervisors ↔ Ziggers', desc: 'On-field coordination & guidance', icon: '🟡' },
                { id: 'agency_all_ziggers', title: 'Agency Broadcast Feed', desc: `All ${activeCampaign.workers || 10} promoters on campaign`, icon: '🔴' }
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeChannel === ch.id
                      ? 'bg-espresso text-white border-espresso shadow-xs'
                      : 'bg-linen/20 border-espresso/10 hover:border-gold text-espresso'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs">{ch.title}</h4>
                    <p className="text-[10px] opacity-75">{ch.desc}</p>
                  </div>
                  <span className="text-xs">{ch.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Feed (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-espresso/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between min-h-[450px]">
            
            {/* Feed Header */}
            <div className="p-4 bg-linen/30 border-b border-espresso/10 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs text-espresso uppercase tracking-wider">
                  {activeChannel.replace(/_/g, ' ').toUpperCase()} CHANNEL
                </h3>
                <span className="text-[10px] text-muted font-mono">Campaign: {activeCampaign.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                Edge Realtime Sync Active
              </span>
            </div>

            {/* Messages Feed List */}
            <div className="p-4 space-y-3 overflow-y-auto flex-grow max-h-[350px]">
              {(messages[activeChannel] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isAgency ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-md text-xs space-y-1 shadow-2xs ${
                    msg.isEmergency
                      ? 'bg-red-700 text-white border-2 border-red-400'
                      : msg.isAgency
                        ? 'bg-espresso text-white rounded-br-none'
                        : 'bg-linen/40 text-espresso rounded-bl-none border border-espresso/10'
                  }`}>
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1 text-[10px] opacity-80">
                      <span className="font-extrabold">{msg.sender}</span>
                      <span className="font-mono">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed pt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-espresso/10 bg-linen/10 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type campaign message or instruction..."
                className="flex-grow bg-white border border-espresso/15 rounded-xl px-4 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
              />
              <button
                type="submit"
                className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send size={13} className="text-gold" /> Send
              </button>
            </form>

          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <MessageSquare size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Campaign Broadcast Channels Active
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Deploy a campaign to automatically open multi-channel dispatch feeds and field team broadcast channels.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Open Comms Hub</span>
          </button>
        </div>
      )}

      {/* Emergency Broadcast Modal */}
      {emergencyAlertOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-500 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={20} />
                <h3 className="text-base font-black uppercase tracking-tight">Emergency Field Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyAlertOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted">
              This message will be instantly broadcasted with high-priority push notifications to all <strong>Supervisors</strong> and <strong>Field Promoters</strong> across all {campaignCity} hub locations.
            </p>

            <form onSubmit={handleSendEmergencyAlert} className="space-y-4">
              <textarea
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                placeholder="e.g. Immediate weather alert: Please pause outdoor sampling and move inventory inside the venue canopy..."
                rows={4}
                required
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-3 text-xs text-espresso focus:outline-none focus:border-red-500 font-medium"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEmergencyAlertOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:text-espresso border border-espresso/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting || broadcastSent || !emergencyText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Megaphone size={14} />
                  <span>{broadcastSent ? 'Broadcast Dispatched!' : isBroadcasting ? 'Broadcasting...' : 'Trigger Priority Alert'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
