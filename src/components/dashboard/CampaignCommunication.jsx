"use client";
import React, { useState } from 'react';
import { 
  MessageSquare, Send, Bell, AlertTriangle, Users, 
  ShieldCheck, Phone, CheckCheck, Sparkles, Megaphone, 
  Radio, Clock, AlertCircle
} from 'lucide-react';

export default function CampaignCommunication({ campaigns = [], onLogAction }) {
  const [activeChannel, setActiveChannel] = useState('agency_supervisors'); // 'agency_supervisors', 'supervisor_ziggers', 'agency_all_ziggers'
  const [messageInput, setMessageInput] = useState('');
  const [emergencyAlertOpen, setEmergencyAlertOpen] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');

  // Channel Messages Store
  const [messages, setMessages] = useState({
    agency_supervisors: [
      {
        id: 'm1',
        sender: 'Campaign Manager (Agency)',
        role: 'Agency Ops Lead',
        text: 'Welcome team! Today is Day 1 of Coca-Cola College Activation. All ice boxes and sample stocks are delivered to the 4 campuses.',
        time: '08:30 AM',
        isAgency: true
      },
      {
        id: 'm2',
        sender: 'Kumar Swaminathan (Supervisor)',
        role: 'Field Supervisor - Loyola & SRM',
        text: 'Received! 19 promoters checked in at Loyola and SRM. Branding standees erected and cold cans loaded.',
        time: '09:48 AM',
        isAgency: false
      },
      {
        id: 'm3',
        sender: 'Prakash Rao (Supervisor)',
        role: 'Field Supervisor - MCC & Anna Univ',
        text: 'All 15 promoters on site at MCC and Anna University. Starting sampling rounds at 10 AM sharp.',
        time: '09:52 AM',
        isAgency: false
      }
    ],
    supervisor_ziggers: [
      {
        id: 'm4',
        sender: 'Kumar Swaminathan (Supervisor)',
        role: 'Field Supervisor',
        text: 'Reminder: Greet students with "Try the all-new Coca-Cola Zero!". Ensure you capture QR code scans for all merchandise giveaways.',
        time: '09:55 AM',
        isAgency: false
      },
      {
        id: 'm5',
        sender: 'Rohit Sharma (Zigger)',
        role: 'Brand Promoter',
        text: 'Understood Kumar sir! High crowd around sports ground. We are pacing 40 cans per hour.',
        time: '10:15 AM',
        isAgency: false
      }
    ],
    agency_all_ziggers: [
      {
        id: 'm6',
        sender: 'Ziggers Official Broadcast Desk',
        role: 'System Announcement',
        text: '📢 SHIFT REMINDER: Full day shifts conclude at 06:00 PM. Please take your check-out selfie and ensure all leftover cans are securely stored.',
        time: '04:00 PM',
        isAgency: true
      }
    ]
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now().toString(36),
      sender: activeChannel === 'agency_supervisors' ? 'Campaign Manager (Agency)' : 
              activeChannel === 'supervisor_ziggers' ? 'Supervisor Lead' : 'Agency Broadcast Desk',
      role: 'Operations Desk',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgency: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...prev[activeChannel], newMsg]
    }));

    if (onLogAction) {
      onLogAction('CAMPAIGN_COMMUNICATION', `Sent message on [${activeChannel.toUpperCase()}]: "${messageInput}"`);
    }

    setMessageInput('');
  };

  const handleSendEmergencyAlert = (e) => {
    e.preventDefault();
    if (!emergencyText.trim()) return;

    const alertMsg = {
      id: 'em_' + Date.now().toString(36),
      sender: '⚠️ EMERGENCY AGENCY BROADCAST',
      role: 'HIGH PRIORITY PUSH',
      text: `🚨 URGENT ALERT: ${emergencyText}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency: true
    };

    setMessages(prev => ({
      ...prev,
      agency_all_ziggers: [...prev.agency_all_ziggers, alertMsg],
      agency_supervisors: [...prev.agency_supervisors, alertMsg]
    }));

    if (onLogAction) {
      onLogAction('EMERGENCY_BROADCAST_DISPATCHED', `Sent high-priority audio & push alert to all field staff: "${emergencyText}"`);
    }

    setEmergencyText('');
    setEmergencyAlertOpen(false);
    alert('High-priority emergency push alert dispatched to all active field phones.');
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
            Replaces messy WhatsApp groups. Structured multi-channel dispatch feeds with instant shift reminders & emergency broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyAlertOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Megaphone size={14} className="text-yellow-300 animate-pulse" />
            <span>Emergency Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Main Communication Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden min-h-[560px]">
        
        {/* Left Col: Channel Switcher */}
        <div className="p-4 border-r border-espresso/10 bg-linen/10 space-y-3">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Campaign Channels
          </span>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => setActiveChannel('agency_supervisors')}
              className={`w-full text-left p-3 rounded-xl transition-all flex flex-col cursor-pointer ${
                activeChannel === 'agency_supervisors'
                  ? 'bg-espresso text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-linen/40 text-espresso border border-espresso/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">Agency ↔ Supervisors</span>
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
              </div>
              <span className={`text-[10px] mt-0.5 ${activeChannel === 'agency_supervisors' ? 'text-white/70' : 'text-muted'}`}>
                Ops Leads & Field Supervisors
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('supervisor_ziggers')}
              className={`w-full text-left p-3 rounded-xl transition-all flex flex-col cursor-pointer ${
                activeChannel === 'supervisor_ziggers'
                  ? 'bg-espresso text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-linen/40 text-espresso border border-espresso/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">Supervisors ↔ Ziggers</span>
                <span className="h-2 w-2 rounded-full bg-gold"></span>
              </div>
              <span className={`text-[10px] mt-0.5 ${activeChannel === 'supervisor_ziggers' ? 'text-white/70' : 'text-muted'}`}>
                On-field coordination & guidance
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('agency_all_ziggers')}
              className={`w-full text-left p-3 rounded-xl transition-all flex flex-col cursor-pointer ${
                activeChannel === 'agency_all_ziggers'
                  ? 'bg-espresso text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-linen/40 text-espresso border border-espresso/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">Agency Broadcast Feed</span>
                <span className="h-2 w-2 rounded-full bg-red-400"></span>
              </div>
              <span className={`text-[10px] mt-0.5 ${activeChannel === 'agency_all_ziggers' ? 'text-white/70' : 'text-muted'}`}>
                All 20 promoters on campaign
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-espresso/10 space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
              Automated Push Triggers
            </span>
            <div className="p-2.5 bg-white rounded-xl border border-espresso/10 text-[10px] text-muted space-y-1">
              <div className="text-espresso font-bold flex items-center gap-1">
                <Clock size={11} className="text-gold" /> Auto Shift Reminders
              </div>
              <p>Sent 60m & 15m before reporting time with GPS directions.</p>
            </div>
          </div>
        </div>

        {/* Right 3 Cols: Message Thread & Composer */}
        <div className="lg:col-span-3 flex flex-col justify-between p-4 md:p-6 bg-linen/5">
          
          {/* Channel Header */}
          <div className="flex items-center justify-between border-b border-espresso/10 pb-3 mb-4 bg-white/80 p-3 rounded-xl border">
            <div>
              <h3 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                {activeChannel === 'agency_supervisors' && 'Agency Operations ↔ Field Supervisors'}
                {activeChannel === 'supervisor_ziggers' && 'Supervisor Direct Field Dispatch (Loyola & MCC)'}
                {activeChannel === 'agency_all_ziggers' && 'All-Hands Campaign Broadcast Channel'}
              </h3>
              <span className="text-[10px] text-muted font-medium">
                Campaign: Coca-Cola College Activation • Verified Cryptographic Log
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Edge Realtime Sync Active
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 max-h-[380px]">
            {messages[activeChannel]?.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl max-w-xl text-xs shadow-2xs space-y-1 ${
                  msg.isEmergency 
                    ? 'bg-red-100 border border-red-300 text-red-950 font-bold ml-auto' 
                    : msg.isAgency
                    ? 'bg-espresso text-white ml-auto'
                    : 'bg-white border border-espresso/10 text-espresso mr-auto'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-80 gap-3">
                  <span className="font-bold">{msg.sender}</span>
                  <span className="font-mono">{msg.time}</span>
                </div>
                <p className="leading-relaxed font-medium">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-espresso/10 bg-white p-2 rounded-2xl border">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type campaign message or instruction..."
              className="flex-grow bg-transparent px-3 py-2 text-xs text-espresso focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send size={13} className="text-gold" />
              <span>Send</span>
            </button>
          </form>

        </div>

      </div>

      {/* Emergency Alert Modal */}
      {emergencyAlertOpen && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold">
                <Megaphone size={20} />
                <h3 className="text-sm uppercase tracking-wider">Broadcast Emergency Push Alert</h3>
              </div>
              <button onClick={() => setEmergencyAlertOpen(false)} className="text-muted hover:text-espresso font-bold">✕</button>
            </div>

            <p className="text-muted leading-relaxed">
              Broadcasts an urgent full-screen push notification and audio alert to all 20 active promoters and supervisors on field.
            </p>

            <textarea
              rows={3}
              value={emergencyText}
              onChange={(e) => setEmergencyText(e.target.value)}
              placeholder="e.g. Extreme weather warning in Chennai. Cease outdoor quadrangle sampling immediately and move setup inside university auditorium."
              className="w-full bg-linen/30 border border-espresso/15 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 font-medium"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEmergencyAlertOpen(false)} className="px-4 py-2 font-bold text-muted">Cancel</button>
              <button
                onClick={handleSendEmergencyAlert}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <AlertCircle size={14} />
                <span>Send Immediate Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
