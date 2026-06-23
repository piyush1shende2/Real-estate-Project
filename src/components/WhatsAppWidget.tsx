import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send,
  Sparkles,
  CheckCheck,
  User,
  Clock,
  ShieldCheck,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface WhatsAppWidgetProps {
  defaultMessage?: string;
}

export default function WhatsAppWidget({ defaultMessage = '' }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<'support' | 'sales' | 'plots' | 'landlord'>('support');
  const [userName, setUserName] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [customQuery, setCustomQuery] = useState('');
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [isSent, setIsSent] = useState(false);

  // Predefined contact numbers for localized support channels
  const AGENT_CONTACTS = {
    support: {
      name: 'Aditya Sen',
      role: 'Global Support & Leasing Lead',
      phone: '919850843447',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      status: 'Active (Within 3 mins response)',
      hello: 'Hi! Let me help you find your dream residential space today.'
    },
    sales: {
      name: 'Kshitiz Verma',
      role: 'Metros Investment Broker',
      phone: '919850843447',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      status: 'Online (Expert Broker)',
      hello: 'Namaste! Are you looking to buy premium flats, villas or multiplex suites?'
    },
    plots: {
      name: 'Radhika Nair',
      role: 'Attorney Real Estate Consultant',
      phone: '919850843447',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      status: 'Ready (Plot Deeds Expert)',
      hello: 'Hello! I can guide you through direct ownership registries, legal clearance, or layout maps.'
    },
    landlord: {
      name: 'Meena Golhar',
      role: 'PG & Co-Living Manager',
      phone: '919850843447',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      status: 'Online (Hostel Checkins)',
      hello: 'Hi there! Looking for affordable, single/sharing student PGs or working spaces?'
    }
  };

  useEffect(() => {
    if (defaultMessage) {
      setCustomQuery(defaultMessage);
      setIsOpen(true);
    }
  }, [defaultMessage]);

  const activeAgent = AGENT_CONTACTS[selectedAgent] || AGENT_CONTACTS.support;

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    const greeting = userName ? `Hi, my name is ${userName}. ` : "Hi, ";
    const cityText = cityFilter !== 'All' ? `I am looking for property options in "${cityFilter}". ` : "";
    const coreQuery = customQuery.trim() || `I am interested in learning more about available listings on your real estate portal!`;
    const fullText = `${greeting}${cityText}${coreQuery}`;

    // Log the interaction inside localStorage to display on the staff / admin console
    try {
      const stored = localStorage.getItem('nest_whatsapp_chats');
      const list = stored ? JSON.parse(stored) : [];
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      list.unshift({
        id: `WA-${Math.floor(1000 + Math.random() * 9000)}`,
        name: userName || 'Anonymous Client',
        city: cityFilter,
        message: customQuery || 'General portal chat',
        agent: activeAgent.name,
        agentRole: activeAgent.role,
        timestamp: formattedDate
      });
      localStorage.setItem('nest_whatsapp_chats', JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage log failed:', err);
    }

    const encodedText = encodeURIComponent(fullText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${activeAgent.phone}&text=${encodedText}`;

    // Gracefully guide redirection in 1.2 seconds to simulate active transmission
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setIsSent(false);
      setIsOpen(false);
      setShowNotificationBadge(false);
    }, 1200);
  };

  return (
    <div id="whatsapp-integration-fixed-scope" className="fixed bottom-6 right-6 z-40 font-sans select-none">
      
      {/* Floating pulsing button trigger */}
      <div className="relative">
        {showNotificationBadge && !isOpen && (
          <span className="absolute -top-1.5 -right-1 z-20 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black justify-center items-center text-white">1</span>
          </span>
        )}
        
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (showNotificationBadge) {
              setShowNotificationBadge(false);
            }
          }}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer border flex items-center justify-center ${
            isOpen 
              ? 'bg-[#128C7E] hover:bg-[#075e54] border-emerald-500/20 text-white' 
              : 'bg-[#25D366] hover:bg-[#20ba5a] hover:scale-105 border-white/20 text-white'
          }`}
          aria-label="WhatsApp Support Console"
        >
          {/* Custom SVG Official WhatsApp Logo representation */}
          <svg className="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
          </svg>
        </button>
      </div>

      {/* Main Interactive Support Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 sm:absolute sm:bottom-18 sm:right-0 sm:left-auto sm:w-[380px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between animate-scaleUp text-white max-h-[calc(100vh-120px)]">
          
          {/* Chat Window Brand Header */}
          <div className="bg-[#075e54] p-5 relative flex items-center justify-between border-b border-white/5 rounded-t-3xl">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></span>
                <img 
                  src={activeAgent.avatar} 
                  alt={activeAgent.name} 
                  className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm"
                />
              </div>
              <div className="text-left leading-tight">
                <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{activeAgent.name}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[10px] text-emerald-100 opacity-90">{activeAgent.role}</p>
                <div className="flex items-center gap-1 text-[9px] text-emerald-200 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{activeAgent.status}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer border border-white/5"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Department Routing Selector */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Department Channel :</span>
            
            <div className="flex gap-1">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="support">Leasing/Support</option>
                <option value="sales">Metros Investment</option>
                <option value="plots">Title & Plot Registry</option>
                <option value="landlord">PG Manager</option>
              </select>
            </div>
          </div>

          {/* Scrollable Container Wrapper */}
          <div className="flex-grow overflow-y-auto scrollbar-thin">

            {/* Active Conversation body simulating typing / hello */}
            <div className="bg-slate-900 p-4 min-h-[140px] max-h-[170px] overflow-y-auto space-y-3.5 text-left text-xs text-slate-350">
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 text-[11px] leading-relaxed relative">
                <span className="absolute -left-1.5 top-3.5 w-3 h-3 bg-slate-950/60 rotate-45 border-l border-b border-slate-850"></span>
                <p className="text-teal-400 font-extrabold uppercase font-mono text-[9px] tracking-wide mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Agent Console</span>
                </p>
                {activeAgent.hello}
              </div>

              <div className="text-[10px] text-slate-500 font-semibold pl-1 font-mono">
                Selected Direct Channel: <strong className="text-slate-300">+{activeAgent.phone}</strong>
              </div>

              {isSent && (
                <div className="bg-emerald-500/10 border border-emerald-400/20 p-2.5 rounded-xl flex items-center gap-2 text-[10px] text-emerald-300 animate-fadeIn justify-center">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dispatching details... Redirecting to WhatsApp app</span>
                </div>
              )}
            </div>

            {/* Core Interactive Inquiry Submission Form */}
            <form onSubmit={handleWhatsAppRedirect} className="p-4 bg-slate-950 border-t border-slate-850 space-y-3 flex-shrink-0 text-left">
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adam Steve"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-8.5 pr-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">City Filter</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                  >
                    <option value="All">All Cities</option>
                    <option value="Raipur">Raipur</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Preferred Channel</label>
                  <span className="block bg-slate-900 border border-slate-800 text-slate-300 text-xs py-2 px-2.5 rounded-xl font-bold">
                    📱 WhatsApp Web/App
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Tell us what you are looking for</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. I want to inspect land plots near Nagpur, or inquire about rental PGs..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSent}
                className="w-full bg-[#128C7E] hover:bg-[#075e54] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-emerald-200" />
                <span>Start Instant Chat</span>
              </button>
            </form>

            {/* Footer branding */}
            <div className="bg-slate-950 py-2.5 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono leading-none flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>Encrypted Direct API Port Directives</span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
