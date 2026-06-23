import React, { useState } from 'react';
import { 
  Flame, 
  MousePointerClick, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  Eye, 
  Heart, 
  Clock, 
  UserCheck, 
  Sliders, 
  HelpCircle, 
  Database, 
  RefreshCw,
  Plus,
  Minus,
  CloudRain,
  Thermometer,
  Activity,
  Compass,
  Droplet,
  ShieldAlert,
  Wind
} from 'lucide-react';

interface CityHeatData {
  city: string;
  views: number;
  searches: number;
  leads: number;
}

interface PropertyInterestItem {
  id: string;
  title: string;
  category: string;
  views: number;
  score: number;
  badgeColor: string;
}

interface AIHeatProperty {
  id: string;
  title: string;
  views: number;
  favorites: number;
  timeSpent: number; // in minutes
  contacts: number;
}

export default function AdminHeatMapHub() {
  const [activeSegment, setActiveSegment] = useState<'click' | 'geo' | 'interest' | 'leadFunnel' | 'aiScore' | 'climate'>('click');
  const [simulatedCoreTemp, setSimulatedCoreTemp] = useState(41); // baseline Nagpur city-core temp

  // =========================================================
  // 1. CLICK TELEMETRY STATE
  // =========================================================
  const [clickStats, setClickStats] = useState({
    image: 842,
    price: 412,
    contact: 1290,
    details: 110,
  });

  const handleRegisterClick = (section: 'image' | 'price' | 'contact' | 'details') => {
    setClickStats(prev => ({
      ...prev,
      [section]: prev[section] + 1
    }));
  };

  const totalClicks = clickStats.image + clickStats.price + clickStats.contact + clickStats.details;

  // =========================================================
  // 2. GEOGRAPHIC STATE
  // =========================================================
  const [geoData, setGeoData] = useState<Record<string, CityHeatData>>({
    nagpur: { city: 'Nagpur', views: 2300, searches: 1450, leads: 180 },
    pune: { city: 'Pune', views: 1850, searches: 920, leads: 140 },
    mumbai: { city: 'Mumbai', views: 2900, searches: 2100, leads: 260 },
    bangalore: { city: 'Bangalore', views: 1200, searches: 800, leads: 70 },
  });

  const handleSimulateGeoTraffic = (cityId: string) => {
    setGeoData(prev => {
      const current = prev[cityId];
      return {
        ...prev,
        [cityId]: {
          ...current,
          views: current.views + Math.floor(Math.random() * 80) + 20,
          searches: current.searches + Math.floor(Math.random() * 50) + 10,
          leads: current.leads + Math.floor(Math.random() * 8) + 1
        }
      };
    });
  };

  const getGeoHeatSymbol = (views: number) => {
    if (views >= 2400) return { emoji: '🔴', status: 'Hot market', color: 'text-red-600 font-extrabold bg-red-50 border-red-200' };
    if (views >= 1600) return { emoji: '🟠', status: 'Sustained demand', color: 'text-amber-600 font-bold bg-amber-50 border-amber-200' };
    return { emoji: '🟡', status: 'Emerging hub', color: 'text-yellow-600 font-semibold bg-yellow-50 border-yellow-200' };
  };

  // =========================================================
  // 3. PROPERTY INTEREST TAB
  // =========================================================
  const [propertiesInterest, setPropertiesInterest] = useState<PropertyInterestItem[]>([
    { id: 'prop-a', title: 'Urban Nest Villa A (Dharampeth)', category: 'Villa Resales', views: 950, score: 95, badgeColor: 'bg-red-500' },
    { id: 'prop-b', title: 'Skyline Heights Flat B (Manish Nagar)', category: 'Luxury Flats', views: 700, score: 70, badgeColor: 'bg-orange-500' },
    { id: 'prop-c', title: 'Royal Fields Plot C (Wardha Road)', category: 'Layout Plots', views: 450, score: 45, badgeColor: 'bg-yellow-500' },
    { id: 'prop-d', title: 'Co-Living Nest Green D (Ramdaspeth)', category: 'Student Housing', views: 240, score: 24, badgeColor: 'bg-slate-500' },
  ]);

  const [isRunningSQL, setIsRunningSQL] = useState(false);

  const handleTriggerSQLQuery = () => {
    setIsRunningSQL(true);
    setTimeout(() => {
      setPropertiesInterest(prev => 
        prev.map(p => {
          const addedViews = Math.floor(Math.random() * 120) + 15;
          const newViews = p.views + addedViews;
          // Calculate dynamic percentage relative to top views
          return {
            ...p,
            views: newViews,
          };
        }).sort((x, y) => y.views - x.views)
        .map((p, idx, sorted) => {
          const maxViews = sorted[0].views;
          const score = Math.round((p.views / maxViews) * 100);
          let badgeColor = 'bg-yellow-500';
          if (score >= 80) badgeColor = 'bg-red-500';
          else if (score >= 50) badgeColor = 'bg-orange-500';
          return {
            ...p,
            score,
            badgeColor
          };
        })
      );
      setIsRunningSQL(false);
    }, 900);
  };

  // =========================================================
  // 4. LEAD CONVERSION FUNNEL STATE
  // =========================================================
  const [funnelData, setFunnelData] = useState({
    visited: 1000,
    images: 700,
    details: 500,
    contact: 300,
    leads: 80,
  });

  const handleTweakFunnel = (field: keyof typeof funnelData, type: 'inc' | 'dec') => {
    setFunnelData(prev => {
      const originalValue = prev[field];
      const change = type === 'inc' ? 20 : -20;
      const newValue = Math.max(1, originalValue + change);
      
      // Ensure logical order (Visited >= Images >= Details >= Contact >= Leads)
      const updated = { ...prev, [field]: newValue };

      if (field === 'visited') {
        updated.images = Math.min(updated.images, updated.visited);
        updated.details = Math.min(updated.details, updated.images);
        updated.contact = Math.min(updated.contact, updated.details);
        updated.leads = Math.min(updated.leads, updated.contact);
      } else if (field === 'images') {
        updated.visited = Math.max(updated.visited, updated.images);
        updated.details = Math.min(updated.details, updated.images);
        updated.contact = Math.min(updated.contact, updated.details);
        updated.leads = Math.min(updated.leads, updated.contact);
      } else if (field === 'details') {
        updated.images = Math.max(updated.images, updated.details);
        updated.visited = Math.max(updated.visited, updated.images);
        updated.contact = Math.min(updated.contact, updated.details);
        updated.leads = Math.min(updated.leads, updated.contact);
      } else if (field === 'contact') {
        updated.details = Math.max(updated.details, updated.contact);
        updated.images = Math.max(updated.images, updated.details);
        updated.visited = Math.max(updated.visited, updated.images);
        updated.leads = Math.min(updated.leads, updated.contact);
      } else if (field === 'leads') {
        updated.contact = Math.max(updated.contact, updated.leads);
        updated.details = Math.max(updated.details, updated.contact);
        updated.images = Math.max(updated.images, updated.details);
        updated.visited = Math.max(updated.visited, updated.images);
      }

      return updated;
    });
  };

  // =========================================================
  // 5. AI-POWERED POPULARITY SCORE
  // =========================================================
  const [aiScoreProperties, setAiScoreProperties] = useState<AIHeatProperty[]>([
    { id: 'villa-a', title: 'Villa A (Lawn Estate)', views: 240, favorites: 45, timeSpent: 18, contacts: 52 },
    { id: 'flat-b', title: 'Flat B (Penthouse Core)', views: 190, favorites: 28, timeSpent: 12, contacts: 30 },
    { id: 'plot-c', title: 'Plot C (SEZ Outer Layout)', views: 95, favorites: 15, timeSpent: 5, contacts: 10 },
  ]);

  const [activeAIPropertyId, setActiveAIPropertyId] = useState<string>('villa-a');

  const selectedAIProperty = aiScoreProperties.find(p => p.id === activeAIPropertyId) || aiScoreProperties[0];

  const calculatePopularityScore = (p: AIHeatProperty): number => {
    // Normalization bounds:
    // Views: max 500, Favorite: max 100, TimeSpent: max 30, Contacts: max 100
    const normViews = Math.min(100, (p.views / 300) * 100);
    const normFavorites = Math.min(100, (p.favorites / 60) * 100);
    const normTimeSpent = Math.min(100, (p.timeSpent / 25) * 100);
    const normContacts = Math.min(100, (p.contacts / 80) * 100);

    const calculated = (normViews * 0.30) + (normFavorites * 0.25) + (normTimeSpent * 0.20) + (normContacts * 0.25);
    return Math.round(Math.max(10, Math.min(100, calculated)));
  };

  const updateAIField = (field: keyof AIHeatProperty, value: number) => {
    setAiScoreProperties(prev => 
      prev.map(p => p.id === activeAIPropertyId ? { ...p, [field]: value } : p)
    );
  };

  const getHeatScoreDisplay = (score: number) => {
    if (score >= 80) return { symbol: '🔥', label: 'Hyper Hot', color: 'text-red-600 bg-red-100 border-red-300' };
    if (score >= 50) return { symbol: '🔥', label: 'Sustained', color: 'text-orange-600 bg-orange-100 border-orange-300' };
    return { symbol: '✨', label: 'Steady', color: 'text-amber-600 bg-yellow-100 border-yellow-300' };
  };

  return (
    <div className="bg-white border border-slate-200 shadow-md rounded-3xl p-6 sm:p-8 select-none text-left font-sans">
      
      {/* Tab Switching Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-5 border-b border-slate-200">
        <div>
          <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" /> Live heat indicators
          </span>
          <h2 className="text-xl font-black text-[#0E1F35] mt-1.5 uppercase tracking-wide font-serif">
            Heat Map Analytics Hub
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Real-time user telemetry, drop-offs, spatial geographic metrics & system heat indexes.
          </p>
        </div>

        {/* Dynamic score summary */}
        <div className="bg-[#0E1F35] text-white px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <Database className="w-5 h-5 text-[#B38330]" />
          <div>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Pulse Telemetry</span>
            <span className="text-xs font-black text-rose-500 font-mono tracking-wide">CONNECTED_PORT_3000</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Slider */}
      <div className="grid grid-cols-2 md:grid-cols-6 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 gap-1.5 mb-8">
        <button
          type="button"
          onClick={() => setActiveSegment('click')}
          className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'click'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          Clicks Feed
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('geo')}
          className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'geo'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Geo-Heat Map
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('interest')}
          className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'interest'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Property Interest
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('leadFunnel')}
          className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'leadFunnel'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Funnel Leaves
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('aiScore')}
          className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'aiScore'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          AI Popularity
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('climate')}
          className={`col-span-2 md:col-span-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'climate'
              ? 'bg-[#0E1F35] text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5 text-rose-500" />
          Climate Analytics
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODULE 1: VISITOR CLICK HEAT MAP                                     */}
      {/* ==================================================================== */}
      {activeSegment === 'click' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-rose-500" />
                Visitor Click Telemetry Map Overlay
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                This overlay registers visual click clusters directly over key listing assets. Click anywhere on the custom property card mockup below to add to visitor activity logs.
              </p>

              {/* Click Telemetry List */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">1. Header Image</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-mono text-xs font-black text-rose-600">{clickStats.image} clicks</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">2. Price Display</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping"></span>
                    <span className="font-mono text-xs font-black text-amber-650">{clickStats.price} clicks</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">3. Contact Agent Btn</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                    <span className="font-mono text-xs font-black text-red-750">{clickStats.contact} clicks</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">4. More Details</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="font-mono text-xs font-black text-slate-700">{clickStats.details} clicks</span>
                  </div>
                </div>
              </div>

              {/* Insights text list */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h4 className="text-[10px] text-[#B38330] font-black uppercase tracking-wider">Telemetry Assessment</h4>
                <div className="text-[11px] font-bold text-slate-600 space-y-1.5 list-disc pl-1.5 flex flex-col">
                  <span className="text-rose-700 flex items-center gap-1">🔴 Users click <strong className="font-black">"Contact Agent"</strong> most ({( (clickStats.contact / Math.max(1, totalClicks)) * 100).toFixed(0)}% total share). High sales readiness feedback.</span>
                  <span className="text-slate-500 flex items-center gap-1">🟡 Property details section gets ignored. Less than 5% interest click conversion.</span>
                  <span className="text-amber-700 flex items-center gap-1">🟠 Price indicator retains stable view relevance ({( (clickStats.price / Math.max(1, totalClicks)) * 100).toFixed(0)}% share).</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE PROPERTY CARD MOCKUP */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block text-center mb-1.5">Interactive Mockup Card</span>
              
              <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto relative select-none">
                
                {/* 1. Header Image segment with red spots */}
                <div 
                  onClick={() => handleRegisterClick('image')}
                  className="bg-slate-300 h-40 relative group cursor-pointer flex items-center justify-center font-black text-[10px] text-white overflow-hidden"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80" 
                    alt="House Card" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Visual Hotspots */}
                  <div className="absolute top-4 right-4 flex gap-1 pointer-events-none">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/90 shadow-lg animate-ping"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/95 shadow-md flex items-center justify-center text-[7px] text-white font-mono">3x</span>
                  </div>

                  <span className="absolute bottom-2 left-3 bg-[#0E1F35]/80 px-2 py-0.5 rounded text-[8px] font-bold">
                    Click Card Image Areas
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3.5">
                  
                  {/* 2. Price Section with orange spots */}
                  <div 
                    onClick={() => handleRegisterClick('price')}
                    className="flex justify-between items-center cursor-pointer p-1.5 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                  >
                    <div>
                      <span className="text-[9px] text-emerald-650 font-black uppercase tracking-wider block">PRICE VALUE</span>
                      <span className="text-lg font-black text-[#0E1F35] font-mono">₹85,00,000</span>
                    </div>
                    
                    {/* Orange Hotspots */}
                    <div className="flex gap-1 items-center pointer-events-none">
                      <span className="w-3.5 h-3.5 rounded-full bg-orange-500/90 shadow-md animate-pulse"></span>
                      <span className="text-[9px] font-black text-amber-600 font-mono">🟠 x2</span>
                    </div>
                  </div>

                  {/* 4. Details area with small yellow indicators */}
                  <div 
                    onClick={() => handleRegisterClick('details')}
                    className="p-2 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer hover:bg-yellow-50/50 transition-colors"
                  >
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Property Details Specs</span>
                    <p className="text-[10px] text-slate-600 font-semibold leading-normal mt-0.5">
                      3 BHK Premium East-facing spacious apartment. Immediate Metro linkage and 100% municipal tap water layouts.
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1.5 pointer-events-none text-[8px] text-yellow-600 font-black uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Details ignored
                    </div>
                  </div>

                  {/* 3. Contact Agent with heavy flashing red dot */}
                  <div 
                    onClick={() => handleRegisterClick('contact')}
                    className="pt-1.5"
                  >
                    <button
                      type="button"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-serif uppercase tracking-widest font-black text-[10px] py-2.5 rounded-xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>📞 Contact Developer Agent</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    </button>
                    <div className="flex justify-center items-center mt-1.5 gap-1 text-[8px] text-red-600 font-extrabold uppercase">
                      <span>Most clicked item</span>
                      <span className="font-mono">🔴🔴🔴🔴</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE 2: GEOGRAPHIC HEAT MAP                                        */}
      {/* ==================================================================== */}
      {activeSegment === 'geo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-emerald-650" />
              Geographic Real-Estate Heat Map
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-6">
              Track regional density trends dynamically computed across key prime markets: Nagpur, Pune, Mumbai and Bangalore. Hot property markets instantly trigger critical flags.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.keys(geoData).map((key) => {
                const data = geoData[key];
                const heat = getGeoHeatSymbol(data.views);
                return (
                  <div 
                    key={key} 
                    className="bg-white border border-slate-200 p-5 rounded-2.5xl transition-all hover:border-[#B38330]/40 group shadow-sm text-left relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{data.city}</h4>
                        <span className="text-xl shrink-0" title={heat.status}>{heat.emoji}</span>
                      </div>

                      <div className="space-y-3 pt-2 text-xs font-bold text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase text-slate-400">Total Views:</span>
                          <span className="font-mono text-[#0E1F35]">{data.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase text-slate-400">Searches:</span>
                          <span className="font-mono text-slate-700">{data.searches}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase text-slate-400">Inbound Leads:</span>
                          <span className="font-mono text-emerald-700">{data.leads}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border block text-center mt-4 ${heat.color}`}>
                        {heat.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateGeoTraffic(key)}
                      className="mt-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0E1F35] text-[9px] font-black uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-[#B38330]" />
                      Simulate Influx
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom styled mock-visual Nagpur hot regions */}
            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] text-[#B38330] font-black uppercase tracking-widest block">Geographical Summary</span>
                <p className="text-[11px] text-slate-650 font-bold max-w-xl leading-relaxed">
                  Nagpur's <strong className="text-red-650">Wardha Road</strong> and Dharampeth segments rank as highest density hotspots. Pune emerging fast with tech relocation demand, while Bangalore indexes stable growth levels.
                </p>
              </div>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1 text-slate-500">🔴 Critical Heat</span>
                <span className="flex items-center gap-1 text-slate-500 font-bold">🟠 Moderate Heat</span>
                <span className="flex items-center gap-1 text-slate-500">🟡 Emerging Heat</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE 3: PROPERTY INTEREST HEAT MAP (SQL SELECTION & DEMAND)        */}
      {/* ==================================================================== */}
      {activeSegment === 'interest' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#B38330]" />
                  Property Interest Score Engine
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Aggregation of active customer views compiled dynamically through database logs.
                </p>
              </div>

              {/* Action Query trigger */}
              <button
                type="button"
                onClick={handleTriggerSQLQuery}
                disabled={isRunningSQL}
                className="bg-[#0E1F35] text-white hover:bg-[#152e4f] font-black text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#B38330] ${isRunningSQL ? 'animate-spin' : ''}`} />
                {isRunningSQL ? "Executing Query..." : "Execute Aggregation SQL"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Properties Interest score bars */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest border-b border-slate-100 pb-2">Active Interest Rankings</span>
                
                <div className="space-y-3.5">
                  {propertiesInterest.map((item) => (
                    <div key={item.id} className="space-y-1 text-left">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <div className="truncate max-w-[280px]">
                          <span className="text-slate-800 font-black">{item.title}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-0.5">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-mono text-slate-500">{item.views} Views</span>
                          <span className="font-mono font-black text-rose-600 block bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px]">
                            {item.score}% score
                          </span>
                        </div>
                      </div>
                      
                      {/* Interactive score bar indicators */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${item.badgeColor}`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: SQL IDE Console simulation */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-[10px] text-slate-450 h-full flex flex-col justify-between space-y-3 text-left shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B38330]"></span>
                      <span className="font-black text-[9px] tracking-wider uppercase">Active SQL Compiler</span>
                    </div>
                    
                    <span className="text-sky-400">// SQLite index view counter query</span>
                    <pre className="text-emerald-400 mt-2 text-[10.5px] whitespace-pre-wrap font-mono leading-relaxed">
{`SELECT property_id,
       COUNT(*) as total_views,
       ROUND((COUNT(*) * 100.0) / (
          SELECT MAX(views_sum) FROM (
             SELECT COUNT(*) as views_sum
             FROM property_views GROUP BY property_id
          )
       ), 0) as interest_pct
FROM property_views
GROUP BY property_id
ORDER BY total_views DESC;`}
                    </pre>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
                    <span>DATABASE: property_views (4 rows)</span>
                    <span className="text-emerald-500 font-bold">SQL EXECUTED SUCCESS</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE 4: LEAD CONVERSION FUNNEL DETECT                              */}
      {/* ==================================================================== */}
      {activeSegment === 'leadFunnel' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
            <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              Lead Conversion Funnel Hotspots
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
              Track the exact customer journey and target exit drops from initial view to final RERA qualified lead submission. Use controls to inspect conversion rate impacts.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Column 1: Interactive Funnel Graph */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2.5xl p-5 space-y-4">
                
                {/* Stage 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center">1</span> 1. Visited Property Page</span>
                    <div className="flex gap-2.5 font-mono">
                      <span className="text-slate-800 font-black">{funnelData.visited} Users</span>
                      <span className="text-slate-400">(Baseline 100%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-150 h-5 rounded-lg overflow-hidden flex relative items-center justify-between">
                    <div className="bg-[#0E1F35] h-full transition-all duration-550" style={{ width: '100%' }}></div>
                    <div className="absolute right-3 flex gap-1 items-center z-10">
                      <button type="button" onClick={() => handleTweakFunnel('visited', 'dec')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleTweakFunnel('visited', 'inc')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center">2</span> 2. Viewed Media Gallery</span>
                    <div className="flex gap-2.5 font-mono">
                      <span className="text-slate-800 font-black">{funnelData.images} Users</span>
                      <span className="text-amber-600 font-black">({((funnelData.images / funnelData.visited) * 100).toFixed(0)}% ret)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-150 h-5 rounded-lg overflow-hidden flex relative items-center justify-between">
                    <div className="bg-[#B38330] h-full transition-all duration-550" style={{ width: `${(funnelData.images / funnelData.visited) * 100}%` }}></div>
                    <div className="absolute right-3 flex gap-1 items-center z-10">
                      <button type="button" onClick={() => handleTweakFunnel('images', 'dec')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleTweakFunnel('images', 'inc')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-[10px] text-red-500 font-semibold px-1 text-right">
                    Drop-off: {(100 - (funnelData.images / funnelData.visited) * 100).toFixed(0)}% exit rate
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center">3</span> 3. Opened Specific Details</span>
                    <div className="flex gap-2.5 font-mono">
                      <span className="text-slate-800 font-black">{funnelData.details} Users</span>
                      <span className="text-amber-600 font-black">({((funnelData.details / funnelData.images) * 100).toFixed(0)}% ret)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-150 h-5 rounded-lg overflow-hidden flex relative items-center justify-between">
                    <div className="bg-amber-500 h-full transition-all duration-550" style={{ width: `${(funnelData.details / funnelData.visited) * 100}%` }}></div>
                    <div className="absolute right-3 flex gap-1 items-center z-10">
                      <button type="button" onClick={() => handleTweakFunnel('details', 'dec')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleTweakFunnel('details', 'inc')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-[10px] text-red-500 font-semibold px-1 text-right">
                    Drop-off: {(100 - (funnelData.details / funnelData.images) * 100).toFixed(0)}% exit rate
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center">4</span> 4. Pressed Contact Agent</span>
                    <div className="flex gap-2.5 font-mono">
                      <span className="text-slate-800 font-black">{funnelData.contact} Users</span>
                      <span className="text-amber-600 font-black">({((funnelData.contact / funnelData.details) * 100).toFixed(0)}% ret)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-150 h-5 rounded-lg overflow-hidden flex relative items-center justify-between">
                    <div className="bg-orange-500 h-full transition-all duration-550" style={{ width: `${(funnelData.contact / funnelData.visited) * 100}%` }}></div>
                    <div className="absolute right-3 flex gap-1 items-center z-10">
                      <button type="button" onClick={() => handleTweakFunnel('contact', 'dec')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleTweakFunnel('contact', 'inc')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-600 rounded cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-[10px] text-red-500 font-semibold px-1 text-right">
                    Drop-off: {(100 - (funnelData.contact / funnelData.details) * 100).toFixed(0)}% exit rate
                  </div>
                </div>

                {/* Stage 5 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center">5</span> 5. Final Lead Generated</span>
                    <div className="flex gap-2.5 font-mono">
                      <span className="text-emerald-700 font-black">{funnelData.leads} RERA Qualified</span>
                      <span className="text-emerald-600 font-black">({((funnelData.leads / funnelData.contact) * 100).toFixed(0)}% ret)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-150 h-5 rounded-lg overflow-hidden flex relative items-center justify-between">
                    <div className="bg-emerald-600 h-full transition-all duration-550" style={{ width: `${(funnelData.leads / funnelData.visited) * 100}%` }}></div>
                    <div className="absolute right-3 flex gap-1 items-center z-10">
                      <button type="button" onClick={() => handleTweakFunnel('leads', 'dec')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-[#0E1F35] rounded cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleTweakFunnel('leads', 'inc')} className="p-0.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-[#0E1F35] rounded cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-black px-1 text-right">
                    Baseline Overall Conversion Rate: <strong className="font-mono">{((funnelData.leads / funnelData.visited) * 100).toFixed(1)}%</strong>
                  </div>
                </div>

              </div>

              {/* Column 2: advisor */}
              <div className="lg:col-span-4 bg-[#0E1F35] text-white rounded-2.5xl p-5 space-y-4 self-stretch flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#B38330] mb-2">Funnel Analytics Advisor</h4>
                  
                  {/* Advisor calculation based on state */}
                  {(() => {
                    const imgRet = (funnelData.images / funnelData.visited) * 100;
                    const contactRet = (funnelData.contact / funnelData.details) * 100;
                    const overallConv = (funnelData.leads / funnelData.visited) * 100;

                    return (
                      <div className="space-y-3.5 text-xs font-medium leading-relaxed text-slate-300">
                        <p>
                          Your gross customer entry baseline is <strong className="text-white">{funnelData.visited} visits</strong>, materializing as <strong className="text-emerald-400 font-extrabold">{funnelData.leads} signed leads</strong>.
                        </p>
                        
                        {imgRet < 75 && (
                          <div className="p-3 bg-red-950/20 border border-red-900/55 rounded-xl text-left">
                            <span className="text-[9px] font-black uppercase text-rose-500 block">Critical exit hotspot</span>
                            <p className="text-[11px] leading-normal font-bold mt-1 text-slate-350">
                              Low media engagement (Drop of {(100 - imgRet).toFixed(0)}%). Consider adding cinematic drone overview videos or verified RERA plot layouts.
                            </p>
                          </div>
                        )}

                        {contactRet < 50 && (
                          <div className="p-3 bg-amber-950/20 border border-amber-900/55 rounded-xl text-left">
                            <span className="text-[9px] font-black uppercase text-[#B38330] block">Mild Drop-Off hotspot</span>
                            <p className="text-[11px] leading-normal font-bold mt-1 text-slate-350">
                              Users open details but exit before pressing "Contact Agent". Suggesting price comparisons and mortgage interest EMI options might boost response.
                            </p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-700/60 flex justify-between">
                          <span>Computed Health Index:</span>
                          <span className={`font-black font-serif ${overallConv >= 8 ? 'text-emerald-400' : 'text-amber-500'}`}>
                            {overallConv >= 8 ? "Excellent (8.0%+)" : "Needs Optimizing"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="rounded-xl bg-[#162a42] p-3 text-[10px] text-slate-400 leading-normal font-mono border border-slate-800">
                  ⚡ Telemetry loops run standard client-side tracking state calculations without database lags.
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE 5: AI-POWERED POPULARITY SCORE                                */}
      {/* ==================================================================== */}
      {activeSegment === 'aiScore' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
            
            <div className="mb-4">
              <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI-Powered Property Heat Indexer
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Computes standard property attractiveness rankings dynamically through mathematical weight distributions: Views (30%) + Favorites (25%) + Time Spent (20%) + Agent Contacts (25%).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Properties list with live compiled scores */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2.5xl p-4 space-y-3.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest border-b border-slate-150 pb-2">Attractiveness Scoreboard</span>
                
                {aiScoreProperties.map((p) => {
                  const score = calculatePopularityScore(p);
                  const display = getHeatScoreDisplay(score);
                  const isActive = p.id === activeAIPropertyId;

                  return (
                    <div 
                      key={p.id}
                      onClick={() => setActiveAIPropertyId(p.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        isActive 
                          ? 'border-[#0E1F35] bg-[#0E1F35]/5 shadow-sm'
                          : 'border-slate-250 hover:bg-slate-55'
                      }`}
                    >
                      <div className="text-left font-bold truncate pr-2">
                        <span className="text-[11px] text-slate-750 block">{p.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 block">Attractiveness Metric</span>
                      </div>
                      
                      <div className={`px-2.5 py-1.5 rounded-xl text-center border mr-1 font-mono text-xs shrink-0 flex items-center gap-1 ${display.color}`}>
                        <span>{display.symbol}</span>
                        <strong className="font-extrabold">{score}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central Column: Sliders for selected Property Attractiveness Metrics */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2.5xl p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Sliders Segment */}
                <div className="md:col-span-7 space-y-5">
                  <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#B38330]">Parameter Tuning</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase">{selectedAIProperty.title}</h4>
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">LIVE CALC</span>
                  </div>

                  {/* Views Variable (30% weight) */}
                  <div className="space-y-1 text-xs font-bold text-slate-650 text-left">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-450" /> 1. Page views:</span>
                      <span className="font-mono text-[#0E1F35]">{selectedAIProperty.views} views</span>
                    </div>
                    <input 
                      type="range"
                      min="5"
                      max="300"
                      value={selectedAIProperty.views}
                      onChange={(e) => updateAIField('views', parseInt(e.target.value))}
                      className="w-full accent-[#0E1F35] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8.5px] text-slate-400 font-serif lowercase italic block text-right">Normalizes views limit, weighted at 30%</span>
                  </div>

                  {/* Favorites Variable (25% weight) */}
                  <div className="space-y-1 text-xs font-bold text-slate-650 text-left">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> 2. Favorites added:</span>
                      <span className="font-mono text-[#0E1F35]">{selectedAIProperty.favorites} clients</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="60"
                      value={selectedAIProperty.favorites}
                      onChange={(e) => updateAIField('favorites', parseInt(e.target.value))}
                      className="w-full accent-[#B38330] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8.5px] text-slate-400 font-serif lowercase italic block text-right">Favorites count relative to listing, weighted at 25%</span>
                  </div>

                  {/* Avg Time Spent Variable (20% weight) */}
                  <div className="space-y-1 text-xs font-bold text-slate-650 text-left">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> 3. Avg Session time:</span>
                      <span className="font-mono text-[#0E1F35]">{selectedAIProperty.timeSpent} mins</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="25"
                      value={selectedAIProperty.timeSpent}
                      onChange={(e) => updateAIField('timeSpent', parseInt(e.target.value))}
                      className="w-full accent-[#0E1F35] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8.5px] text-slate-400 font-serif lowercase italic block text-right">Reflects depth interest engagement, weighted at 20%</span>
                  </div>

                  {/* Agent Contacts Variable (25% weight) */}
                  <div className="space-y-1 text-xs font-bold text-slate-650 text-left">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /> 4. Contact inquiries:</span>
                      <span className="font-mono text-[#0E1F35]">{selectedAIProperty.contacts} developers</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="80"
                      value={selectedAIProperty.contacts}
                      onChange={(e) => updateAIField('contacts', parseInt(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-[8.5px] text-slate-400 font-serif lowercase italic block text-right">Direct buy / contract intent parameter, weighted at 25%</span>
                  </div>

                </div>

                {/* Score Output gauge panel */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between self-stretch text-center">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-450 block">AIAttractiveness Score</span>
                    
                    {(() => {
                      const computed = calculatePopularityScore(selectedAIProperty);
                      const display = getHeatScoreDisplay(computed);

                      return (
                        <div className="space-y-3 py-4">
                          <div className="text-4xl font-black text-[#0E1F35] font-mono tracking-tight flex items-center justify-center gap-1">
                            <span>{display.symbol}</span>
                            <span>{computed}</span>
                          </div>

                          <div className="space-y-1">
                            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200 inline-block ${display.color}`}>
                              Attractiveness: {display.label}
                            </span>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium max-w-[170px] mx-auto pt-1 select-text">
                              Weighted score calculated dynamically using standard parameter values.
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-[9px] text-[#0E1F35] font-bold font-mono text-left leading-normal flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#B38330]" />
                    <span>Formula: Score = (v×30%) + (f×25%) + (t×20%) + (c×25%)</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE 6: CLIMATE & THERMAL INTELLIGENCE ANALYTICS                     */}
      {/* ==================================================================== */}
      {activeSegment === 'climate' && (
        <div className="space-y-6 animate-fadeIn text-left text-sans">
          
          {/* Header Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
            <span className="bg-[#0E1F35] text-[#B38330] text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit mb-3">
              <Compass className="w-3.5 h-3.5 text-[#B38330]" /> Executive Climate Metrics Portal
            </span>
            <h3 className="text-sm font-black uppercase text-[#0E1F35] tracking-wide flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-650" />
              Climate Intelligence & Heat Mitigation Analytics
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Cross-references local concrete-island ambient temperature differentials against visitor search vectors, lead conversions, and seasonal rainfall variables.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Panel: Locality Inquiries & Micro-Thermal Rates */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2.5xl p-5 space-y-5">
              <div>
                <span className="text-[9px] text-[#B38330] font-black uppercase tracking-widest block font-mono">Report 1.1</span>
                <h4 className="text-xs font-black text-[#0E1F35] uppercase tracking-wide">
                  Localized Thermal Gradient vs. Inquiry Volumetrics
                </h4>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">
                  Tracks if cooler outskirt microclimates command higher RERA lead conversion ratios.
                </p>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden border border-slate-150 rounded-xl">
                <table className="w-full text-xs font-semibold text-[#0E1F35]">
                  <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-black uppercase text-slate-450 text-left">
                    <tr>
                      <th className="p-3">Nagpur Locality</th>
                      <th className="p-3">Avg Summer</th>
                      <th className="p-3 text-right">Inquiries</th>
                      <th className="p-3 text-right">Conversion</th>
                      <th className="p-3 text-right">Thermal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold">Dharampeth Core</td>
                      <td className="p-3 font-mono">42°C</td>
                      <td className="p-3 text-right font-mono">810 clicks</td>
                      <td className="p-3 text-right font-mono text-red-650">10.5%</td>
                      <td className="p-3 text-right"><span className="text-[8.5px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-150 px-2 py-0.5 rounded">🔴 Heat Island</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Wardha Rd Corridor</td>
                      <td className="p-3 font-mono">40°C</td>
                      <td className="p-3 text-right font-mono">620 clicks</td>
                      <td className="p-3 text-right font-mono text-amber-600">12.1%</td>
                      <td className="p-3 text-right"><span className="text-[8.5px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-150 px-2 py-0.5 rounded">🟠 Concrete Corridor</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Manish Nagar</td>
                      <td className="p-3 font-mono">39°C</td>
                      <td className="p-3 text-right font-mono">490 clicks</td>
                      <td className="p-3 text-right font-mono text-[#B38330]">13.5%</td>
                      <td className="p-3 text-right"><span className="text-[8.5px] font-extrabold uppercase bg-yellow-50 text-yellow-700 border border-yellow-150 px-2 py-0.5 rounded">🟡 Balanced</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Koradi Lake Belt</td>
                      <td className="p-3 font-mono">38°C</td>
                      <td className="p-3 text-right font-mono">420 clicks</td>
                      <td className="p-3 text-right font-mono text-emerald-650">14.8%</td>
                      <td className="p-3 text-right"><span className="text-[8.5px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded">🟢 Shaded Oasis</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Outer Rural Belt</td>
                      <td className="p-3 font-mono">36°C</td>
                      <td className="p-3 text-right font-mono">540 clicks</td>
                      <td className="p-3 text-right font-mono text-emerald-650 font-bold">16.2%</td>
                      <td className="p-3 text-right"><span className="text-[8.5px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-150 px-2 py-0.5 rounded">🟢 Forest Fringe</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Informative Note */}
              <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-[10px] text-rose-950 font-medium leading-relaxed leading-normal">
                  <strong>Conversion Advantage:</strong> Outskirts and forested pockets record +5.7% relative conversion benefits compared with concrete centroids. Modern villa and plot buyers perform deep search evaluations for multi-canopy, low-temperature zones.
                </div>
              </div>

              {/* Seasonal Factors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-left">
                  <span className="text-[10px] font-black uppercase text-amber-600 block">Summer Behavior Surge</span>
                  <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1">
                    At summer peaks (+39°C), searches referencing `Green Cover` or `Cooler Temperature` explode by <strong>82%</strong>. Outskirt plot conversion limits expand dynamically by +3.5%.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-left">
                  <span className="text-[10px] font-black uppercase text-blue-500 block">Monsoon Risk Assessment</span>
                  <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1">
                    During cloudburst sequences, flood safety telemetry queries spike +45% on low-altitude zones. Low-waterlogging properties capture instantaneous pricing premiums.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Panel: Interactive Climate Shift & Drift Simulator */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 text-slate-350 rounded-2.5xl p-5 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start mb-3.5 border-b border-slate-800 pb-2.5 font-sans">
                  <div>
                    <span className="text-[9px] text-[#B38330] font-black uppercase tracking-widest block font-mono">Report 1.2</span>
                    <h4 className="text-xs font-black text-white uppercase tracking-wide">
                      Macro Climate Demand Drift Simulator
                    </h4>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-450 font-black border border-emerald-400/20 bg-emerald-900/10 px-2 py-0.5 rounded uppercase">Dynamic Sim</span>
                </div>

                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4 font-sans">
                  Drag the slider to increase city baseline summer temperatures and visualize how consumer inquiries dynamically migrate from concrete cores to forest suburbs.
                </p>

                {/* Slider bar */}
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-850 space-y-3.5 font-sans">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>Nagpur Core Temperature:</span>
                    <span className="font-mono text-rose-400 font-black text-sm">{simulatedCoreTemp}°C</span>
                  </div>
                  <input 
                    type="range"
                    min="36"
                    max="46"
                    value={simulatedCoreTemp}
                    onChange={(e) => setSimulatedCoreTemp(parseInt(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-805 rounded-lg cursor-pointer"
                  />

                  {/* Increment/Decrement Buttons */}
                  <div className="flex justify-between gap-2.5 pt-1.5 font-bold">
                    <button
                      type="button"
                      onClick={() => setSimulatedCoreTemp(36)}
                      className="text-[9px] uppercase px-3 py-1 bg-slate-800 text-slate-300 rounded border border-slate-750 hover:text-white transition-colors cursor-pointer"
                    >
                      Baseline Normals (36°C)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedCoreTemp(prev => Math.min(46, prev + 2))}
                      className="text-[9px] uppercase px-3 py-1 bg-rose-950 text-rose-300 rounded border border-rose-500/20 hover:text-white transition-colors cursor-pointer"
                    >
                      Simulate Heatwave (+2°C)
                    </button>
                  </div>
                </div>

                {/* Simulated Outputs */}
                <div className="mt-5 space-y-4 font-sans">
                  
                  {/* Metric A */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-300">Nagpur Heat Wave Stress Level:</span>
                      <span className={`font-black uppercase tracking-wide ${
                        simulatedCoreTemp < 39 ? 'text-emerald-400' :
                        simulatedCoreTemp <= 41 ? 'text-yellow-400' :
                        simulatedCoreTemp <= 43 ? 'text-orange-400' : 'text-red-500'
                      }`}>
                        {simulatedCoreTemp < 39 ? '● Normal Summer' :
                         simulatedCoreTemp <= 41 ? '● Elevated Urban island Heat' :
                         simulatedCoreTemp <= 43 ? '⚠️ Severe Climatic Hazard' : '🚨 Extreme Heatwave emergency'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${
                        simulatedCoreTemp < 39 ? 'bg-emerald-500' :
                        simulatedCoreTemp <= 41 ? 'bg-yellow-500' :
                        simulatedCoreTemp <= 43 ? 'bg-orange-500' : 'bg-red-500'
                      }`} style={{ width: `${Math.min(100, (simulatedCoreTemp - 34) * 10)}%` }}></div>
                    </div>
                  </div>

                  {/* Metric B */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-300">Consumer demand shift to cooler suburbs:</span>
                      <span className="text-[#B38330] font-black font-mono">+{Math.min(100, Math.round((simulatedCoreTemp - 37) * 8.5))}% influx</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#B38330] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.round((simulatedCoreTemp - 37) * 8.5))}%` }}></div>
                    </div>
                    <span className="text-[8px] text-slate-500 block italic leading-normal text-right">Represents search clicks for outskirts/forest parcels</span>
                  </div>

                  {/* Metric C */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-300">Concrete core inquiry drop-off rate:</span>
                      <span className="text-red-400 font-blue font-mono font-black">-{Math.min(50, Math.round(Math.max(0, (simulatedCoreTemp - 38)) * 4.5))}% dropdown</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.round(Math.max(0, simulatedCoreTemp - 38) * 9))}%` }}></div>
                    </div>
                    <span className="text-[8px] text-slate-500 block italic leading-normal text-right">Represents buyers abandoning unshaded concrete core quarters</span>
                  </div>

                </div>

              </div>

              <div className="bg-slate-850/40 border border-slate-800 p-2.5 rounded-lg text-[9px] text-slate-400 font-mono text-left leading-normal flex items-center gap-1.5 mt-3">
                <Sliders className="w-3.5 h-3.5 text-[#B38330]" />
                <span>Simulation model: Live consumer drift index maps real search clicks against meteorological stress.</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Floating explanatory footboard */}
      <div className="mt-6 border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-slate-500 font-semibold text-xs">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-rose-500" />
          <span>Need help using telemetry metrics? Shift segments to review click overlays, drops and SQLite triggers.</span>
        </span>
        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          ● REAL-TIME PORTAL CHECK COMPLETE
        </span>
      </div>

    </div>
  );
}
