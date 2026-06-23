import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Heart, 
  Eye, 
  Scale, 
  TrendingUp, 
  Bot, 
  Bell, 
  Trophy, 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Flame, 
  Sparkles, 
  Check, 
  RotateCcw, 
  MapPin, 
  ArrowUpRight, 
  Send,
  HelpCircle,
  Clock,
  Coins,
  ShieldCheck,
  Building,
  KeyRound,
  Users,
  Search,
  DollarSign
} from 'lucide-react';

import { PropertyListing } from '../types';
import { 
  getGamificationState, 
  saveGamificationState, 
  getCurrentLevel, 
  getNextLevel,
  awardXPAction,
  claimDailyCheckIn,
  LEVEL_THRESHOLDS,
  ACHIEVEMENT_BADGES,
  GamificationState
} from '../lib/gamification';

// Curated listings for dashboard integrations
const NAGPUR_PROPERTIES: PropertyListing[] = [
  {
    id: 'b1',
    title: 'Emerald Luxury Suite',
    location: 'Sadar, Nagpur',
    price: '₹ 85 Lac',
    type: 'Buy',
    bhk: '3 BHK',
    area: '1,840 sqft',
    features: ['Swimming Pool', 'Security Council', '2 Covered Garages', 'Near Sadar Metro'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b2',
    title: 'The Golden Crest Villa',
    location: 'Wardha Road, Nagpur',
    price: '₹ 1.50 Cr',
    type: 'Buy',
    bhk: '4 BHK',
    area: '3,200 sqft',
    features: ['Garden View', 'Jacuzzi Spa', 'Modular Kitchen', 'RERA Registered'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b3',
    title: 'Godrej Anandam Premium Flat',
    location: 'Ganeshpeth, Nagpur',
    price: '₹ 1.20 Cr',
    type: 'Buy',
    bhk: '3 BHK',
    area: '1,650 sqft',
    features: ['Luxury Clubhouse', '100% Power Backup', 'Nagpur Center Locality'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b4',
    title: 'Shiv Kailasa Majestic Residence',
    location: 'Mihan, Nagpur',
    price: '₹ 65 Lac',
    type: 'Buy',
    bhk: '2 BHK',
    area: '1,200 sqft',
    features: ['IT Hub proximity', 'Swimming Pool', 'Premium Gym Access'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'r1',
    title: 'Medical Square Comfy Flat',
    location: 'Dhantoli, Nagpur',
    price: '₹ 18,000 / mo',
    type: 'Rent',
    bhk: '2 BHK',
    area: '1,100 sqft',
    features: ['Furnished', 'Near Medical Square Metro', 'Gym Access'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'r2',
    title: 'Skyview Penthouse Suite',
    location: 'Manish Nagar, Nagpur',
    price: '₹ 32,000 / mo',
    type: 'Rent',
    bhk: '3 BHK',
    area: '2,150 sqft',
    features: ['Rooftop access', '24/7 Security Patrol', 'Private Elevator Lobby'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80'
  }
];

interface UserDashboardViewProps {
  onBackToHome: () => void;
  currentUser: { email: string; name?: string; profilePic?: string; roles?: string[] } | null;
  onLogout: () => void;
}

export default function UserDashboardView({ onBackToHome, currentUser, onLogout }: UserDashboardViewProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'recent' | 'compare' | 'investment' | 'ai' | 'notifications' | 'rewards'>('profile');
  
  // Gamification & XP System State
  const [gamState, setGamState] = useState<GamificationState>(getGamificationState());
  const [spinDeg, setSpinDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser?.name || 'Nagpur Explorer');
  const [profileOccupation, setProfileOccupation] = useState('Professional Consultant');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileCity, setProfileCity] = useState('Nagpur');
  const [isSavedMsg, setIsSavedMsg] = useState(false);

  // Property Comparison states
  const [comparePropA, setComparePropA] = useState<string>('b1');
  const [comparePropB, setComparePropB] = useState<string>('b2');

  // Investment Tracker States
  const [investmentAmt, setInvestmentAmt] = useState<number>(5000000); // 50 Lacs
  const [appreciationRate, setAppreciationRate] = useState<number>(7.5); // 7.5% YoY
  const [rentalYield, setRentalYield] = useState<number>(3.2); // 3.2% yield

  // AI Assistant Chat Terminal States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    { sender: 'assistant', text: 'Hello! I am your Nagpur Urban AI Assistant. Ask me anything about local plot layouts, RERA compliance, or projected ROI trends!', time: '10:00 AM' }
  ]);

  // Notifications state
  const [notifList, setNotifList] = useState([
    { id: 1, title: 'RERA Compliance Notification', desc: 'Prestige Acres Plot Layout Wardha Road RERA inspection clearance uploaded.', time: '10 mins ago', isRead: false },
    { id: 2, title: 'Price Alert Update', desc: 'Shiv Kailasa Majestic Residence in Mihan matched your budget parameters.', time: '2 hrs ago', isRead: false },
    { id: 3, title: 'System Login Multiplier Active', desc: 'Daily Login Streak checked. Streak status multiplier x1.2 active!', time: '1 day ago', isRead: true }
  ]);

  // Saved/pinned properties keys saved in localstorage
  const [savedPropIds, setSavedPropIds] = useState<string[]>(['b1', 'b3', 'r1']);
  // Recently viewed properties simulated in session
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['b2', 'b4', 'r2']);

  // Sync state values on load
  useEffect(() => {
    const cachedSaved = localStorage.getItem('urban_nest_saved_properties');
    if (cachedSaved) {
      try {
        setSavedPropIds(JSON.parse(cachedSaved));
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('urban_nest_saved_properties', JSON.stringify(savedPropIds));
    }
  }, []);

  const updateSavedInStorage = (newList: string[]) => {
    setSavedPropIds(newList);
    localStorage.setItem('urban_nest_saved_properties', JSON.stringify(newList));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedMsg(true);
    awardXPAction('complete_profile');
    setGamState(getGamificationState());
    setTimeout(() => setIsSavedMsg(false), 4000);
  };

  // Gamification formulas for Level UI
  const currentLevelInfo = getCurrentLevel(gamState.xp);
  const nextLevelInfo = getNextLevel(gamState.xp);
  const levelIndex = LEVEL_THRESHOLDS.findIndex(th => th.name === currentLevelInfo.name);
  const currentLvlNum = levelIndex !== -1 ? levelIndex + 1 : 1;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXP : 999999;

  // Render Left sidebar options
  const sideMenus = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Properties', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> },
    { id: 'recent', label: 'Recently Viewed', icon: <Eye className="w-4 h-4 text-cyan-500" /> },
    { id: 'compare', label: 'Property Comparison', icon: <Scale className="w-4 h-4 text-emerald-500" /> },
    { id: 'investment', label: 'Investment Tracker', icon: <TrendingUp className="w-4 h-4 text-amber-500" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-4 h-4 text-indigo-500" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4 text-amber-600" /> },
    { id: 'rewards', label: 'Rewards / XP', icon: <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" /> }
  ] as const;

  return (
    <div className="bg-[#FAFDFE] min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4 select-none">
        <button 
          onClick={onBackToHome}
          className="group flex items-center gap-3 text-sm font-black text-[#0E1F35] hover:text-amber-600 transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center p-2.5 rounded-2xl bg-white border border-gray-200 shadow-xs group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:text-amber-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Return to Properties Home
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-gray-200/50">
            Secure Member Hub • Nagpur
          </span>
          <button 
            onClick={onLogout}
            className="text-[10px] sm:text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 px-4 py-1.5 rounded-full transition-all cursor-pointer uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Active Card Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SIDEBAR MENU NAVIGATION (12 cols on mobile, 4 on lg) */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                <img 
                  src={currentUser?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold shadow-xs">
                ✓
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#0E1F35] font-sans tracking-tight">
                {profileName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">{currentUser?.email}</p>
              <span className="inline-block mt-1 bg-amber-50 text-amber-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-200/40">
                Level {currentLvlNum} • {currentLevelInfo.name}
              </span>
            </div>
          </div>

          {/* Navigation Sidebar Lists */}
          <nav className="flex flex-col gap-1 text-left">
            {sideMenus.map(menu => {
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveTab(menu.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#0E1F35] text-white shadow-sm' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {menu.icon}
                    <span>{menu.label}</span>
                  </div>
                  {menu.id === 'notifications' && notifList.filter(n => !n.isRead).length > 0 && (
                    <span className="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                      {notifList.filter(n => !n.isRead).length}
                    </span>
                  )}
                  {menu.id === 'rewards' && (
                    <span className="text-amber-500 font-extrabold text-[10px]">
                      {gamState.xp} XP
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Block inside Sidebar to look super professional */}
          <div className="bg-[#0E1F35]/[0.02] border border-gray-200/60 rounded-2xl p-4 text-left select-none">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#B38330]">
              Nagpur Portfolio Metrics
            </span>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">SAVED</span>
                <span className="text-lg font-black text-[#0E1F35]">{savedPropIds.length} Listings</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">MATCHED</span>
                <span className="text-lg font-black text-emerald-600">92% Index</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAIL WORKSPACE CARD (8 COLS) */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs min-h-[580px] flex flex-col justify-between">
          
          {/* TAB 1: MY PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 text-left">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  My Profile & Credentials
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Manage your real estate registry details and export your certified digital ID passport card.
                </p>
              </div>

              {isSavedMsg && (
                <div className="bg-emerald-55 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-bold text-left animate-fadeIn">
                  ✓ Profile settings saved securely! Earned <strong>+100 XP</strong> for digital complete protocol!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#004C5C]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Secure Security Email</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || 'member@nagpurnest.com'} 
                    disabled
                    className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-gray-200 bg-slate-100 cursor-not-allowed text-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Primary Phone Contact</label>
                  <input 
                    type="text" 
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white/90 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Occupation Domain</label>
                  <input 
                    type="text" 
                    value={profileOccupation}
                    onChange={(e) => setProfileOccupation(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white/90 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Real Estate Region</label>
                  <select 
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-gray-200 bg-slate-50 focus:outline-none"
                  >
                    <option value="Nagpur">Nagpur Metro, Maharashtra</option>
                    <option value="Dhantoli">Dhantoli / Sadar Zone</option>
                    <option value="Mihan">Mihan IT Precinct</option>
                    <option value="Wardha">Wardha Corridor Layout</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Access Clearance Roles</label>
                  <div className="flex gap-1.5 flex-wrap pt-1.5 select-none">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/50">
                      🏠 Buyer Member
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200">
                      🔑 Investor Status
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => {
                      alert(`Cryptographical Passport Digital ID Export successful for ${profileName}! File saved in system logs.`);
                      awardXPAction('completion_challenge_badge' as any, 50);
                      setGamState(getGamificationState());
                    }}
                    className="text-xs font-black uppercase text-[#004C5C] hover:underline flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Export Certified Digital ID
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#0E1F35] hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wide px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Save Options
                  </button>
                </div>
              </form>

              {/* Verified Badge Graphics */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden text-left border border-white/5 shadow-md select-none mt-4">
                <div className="absolute right-4 top-4 text-4xl opacity-12 filter blur-[0.5px]">🛡️</div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  RERA Registered Passport Verified
                </h4>
                <p className="text-[11px] text-slate-300 font-semibold max-w-md mt-1 leading-normal">
                  Your profile registration status is cryptographically integrated under registration node <strong>NAG-42527-U</strong>. Site broker inspections are unlocked automatically!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SAVED PROPERTIES */}
          {activeTab === 'saved' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Saved Properties
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Properties pinned to your dashboard database. Track listing status or initiate direct broker communications.
                </p>
              </div>

              {savedPropIds.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-350">
                  <Heart className="w-10 h-10 mx-auto text-gray-350 mb-2" />
                  <p className="text-gray-500 text-sm font-semibold">Your favorites list is empty</p>
                  <p className="text-gray-400 text-xs mt-1">Start bookmarking Nagpur center hotpicks inside listings pages!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {NAGPUR_PROPERTIES.filter(p => savedPropIds.includes(p.id)).map(listing => (
                    <div 
                      key={listing.id} 
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col group hover:shadow-md transition-shadow relative"
                    >
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="h-32 w-full object-cover"
                      />
                      <button 
                        onClick={() => {
                          const newer = savedPropIds.filter(id => id !== listing.id);
                          updateSavedInStorage(newer);
                        }}
                        className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer shadow-xs"
                        title="Remove from Saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-snug">
                              {listing.title}
                            </h4>
                            <span className="text-xs font-extrabold text-[#B38330] shrink-0">{listing.price}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-semibold mt-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{listing.location}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-bold">
                            {listing.bhk || listing.area} • {listing.area}
                          </span>
                          <button 
                            onClick={() => alert(`Direct connection initiated for ${listing.title}! Nagpur broker has been auto-assigned. Check notifications.`)}
                            className="bg-[#0E1F35] hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Meet Agent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENTLY VIEWED */}
          {activeTab === 'recent' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Recently Viewed
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  History trace containing Nagpur real estate listings you recently evaluated. Lock matching listings directly.
                </p>
              </div>

              <div className="space-y-3.5">
                {NAGPUR_PROPERTIES.filter(p => recentlyViewedIds.includes(p.id)).map(listing => (
                  <div 
                    key={listing.id} 
                    className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{listing.title}</h4>
                        <div className="flex items-center gap-1 text-gray-400 text-[11px] font-semibold mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{listing.location}</span>
                        </div>
                        <span className="inline-block mt-1 bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          {listing.bhk || 'Layout Plot'} • {listing.area}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 self-end sm:self-auto uppercase tracking-wide">
                      <span className="text-xs font-black text-[#0D1F34]">{listing.price}</span>
                      <button 
                        onClick={() => {
                          const pinnedAlready = savedPropIds.includes(listing.id);
                          if (pinnedAlready) {
                            alert('This property is already in your Saved listings!');
                          } else {
                            updateSavedInStorage([...savedPropIds, listing.id]);
                            alert('Pinned successfully into Saved Properties!');
                          }
                        }}
                        className="p-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer"
                        title="Add to Favorites"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Clear History control */}
              <div className="pt-4 border-t border-gray-150 flex justify-end">
                <button 
                  onClick={() => {
                    setRecentlyViewedIds([]);
                    alert("History cleared successfully!");
                  }}
                  className="text-[10px] font-black uppercase text-[#B38330] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear History Stack
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROPERTY COMPARISON */}
          {activeTab === 'compare' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Property Comparison Console
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Select two local properties to analyze pricing, metrics, dimensions, and specialized layout factors side-by-side.
                </p>
              </div>

              {/* Selector Bar */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-150">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Property A</label>
                  <select 
                    value={comparePropA}
                    onChange={(e) => setComparePropA(e.target.value)}
                    className="w-full text-xs font-black py-2 px-3 rounded-lg bg-white border border-gray-200 focus:outline-none"
                  >
                    {NAGPUR_PROPERTIES.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === comparePropB}>{p.title} ({p.location})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Property B</label>
                  <select 
                    value={comparePropB}
                    onChange={(e) => setComparePropB(e.target.value)}
                    className="w-full text-xs font-black py-2 px-3 rounded-lg bg-white border border-gray-200 focus:outline-none"
                  >
                    {NAGPUR_PROPERTIES.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === comparePropA}>{p.title} ({p.location})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Grid visualizer block */}
              {(() => {
                const propA = NAGPUR_PROPERTIES.find(p => p.id === comparePropA);
                const propB = NAGPUR_PROPERTIES.find(p => p.id === comparePropB);
                if (!propA || !propB) return null;
                return (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-[#0E1F35] text-white">
                          <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Parameter</th>
                          <th className="p-3.5 font-black uppercase tracking-wider text-[10px] w-5/12">{propA.title}</th>
                          <th className="p-3.5 font-black uppercase tracking-wider text-[10px] w-5/12">{propB.title}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 font-semibold text-slate-700">
                        <tr>
                          <td className="p-3 bg-slate-50 font-black text-slate-900">Locality</td>
                          <td className="p-3">{propA.location}</td>
                          <td className="p-3">{propB.location}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-slate-50 font-black text-slate-900">Valuation Price</td>
                          <td className="p-3 text-emerald-800 font-extrabold">{propA.price}</td>
                          <td className="p-3 text-emerald-800 font-extrabold">{propB.price}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-slate-50 font-black text-slate-900">Dimension Area</td>
                          <td className="p-3">{propA.area}</td>
                          <td className="p-3">{propB.area}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-slate-50 font-black text-slate-900">Rooms Configuration</td>
                          <td className="p-3">{propA.bhk || "Independent Layout"}</td>
                          <td className="p-3">{propB.bhk || "Independent Layout"}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-slate-50 font-black text-slate-900">Premium Amenities</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {propA.features.map(f => (
                                <span key={f} className="bg-slate-100 text-[10px] px-2 py-0.5 rounded text-slate-600">• {f}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {propB.features.map(f => (
                                <span key={f} className="bg-slate-100 text-[10px] px-2 py-0.5 rounded text-slate-600">• {f}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              <button 
                onClick={() => {
                  alert("Full-deck Nagpur Comparison PDF report compiled. Open print properties or check rewards progress.");
                  awardXPAction('complete_profile', 30);
                  setGamState(getGamificationState());
                }}
                className="w-full bg-[#0E1F35] hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer text-center font-sans"
              >
                📊 Compile Analytical Report (+30 XP)
              </button>
            </div>
          )}

          {/* TAB 5: INVESTMENT TRACKER */}
          {activeTab === 'investment' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Investment Tracker & Yield Assessor
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Simulate property values, compound yearly expansion metrics, and assess your Nagpur rental return index.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-gray-200">
                
                {/* Sliders Input Column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-600">Simulated Investment</span>
                      <span className="font-black text-[#0E1F35]">₹ {(investmentAmt / 100000).toFixed(0)} Lakhs</span>
                    </div>
                    <input 
                      type="range" 
                      min="2000000" 
                      max="20000000" 
                      step="50000" 
                      value={investmentAmt} 
                      onChange={(e) => setInvestmentAmt(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004C5C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-600">Capital Appreciation (YoY %)</span>
                      <span className="font-black text-emerald-700">{appreciationRate}% YoY</span>
                    </div>
                    <input 
                      type="range" 
                      min="3.0" 
                      max="15.0" 
                      step="0.1" 
                      value={appreciationRate} 
                      onChange={(e) => setAppreciationRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-600">Expected Rental Yield (%)</span>
                      <span className="font-black text-indigo-700">{rentalYield}% Annual</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.5" 
                      max="6.0" 
                      step="0.1" 
                      value={rentalYield} 
                      onChange={(e) => setRentalYield(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Calculation Outputs Column */}
                {(() => {
                  const estRentalIncomeMonthly = Math.round((investmentAmt * (rentalYield / 100)) / 12);
                  const estCompoundAppreciationYr5 = Math.round(investmentAmt * Math.pow(1 + (appreciationRate / 100), 5));
                  const estimatedNetROI = appreciationRate + rentalYield;
                  return (
                    <div className="bg-[#0E1F35] text-white p-5 rounded-2xl flex flex-col justify-between border border-white/5 shadow-md">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#B38330]">
                          Yield Projections • Nagpur
                        </span>
                        <div className="mt-3.5 space-y-3 font-semibold">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[11px] text-slate-300">Est. Monthly Rent:</span>
                            <span className="text-sm font-black text-white">₹ {estRentalIncomeMonthly.toLocaleString('en-IN')} / mo</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[11px] text-slate-300">Projected Value (Yr 5):</span>
                            <span className="text-sm font-black text-emerald-400">₹ {(estCompoundAppreciationYr5 / 100000).toFixed(1)} Lakhs</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-300">Total Net Yield (ROI):</span>
                            <span className="text-sm font-black text-cyan-300">~{estimatedNetROI.toFixed(1)} % p.a.</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          alert(`Investment simulation locked with estimated portfolio yield of ${estimatedNetROI.toFixed(1)}% YoY.`);
                          awardXPAction('use_calculator');
                          setGamState(getGamificationState());
                        }}
                        className="mt-5 w-full py-2 bg-white/10 hover:bg-white/15 text-[10px] uppercase tracking-wider font-extrabold text-white rounded-lg cursor-pointer border border-white/10 text-center transition-all"
                      >
                        📊 Lock Portfolio Plan (+50 XP)
                      </button>
                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {/* TAB 6: AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="space-y-6 text-left flex flex-col flex-grow select-none">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Nagpur Urban AI Companion
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Ask questions about RERA codes, NIT layout approvals, current Wardha Road corridors, and pricing stats.
                </p>
              </div>

              {/* Chat messages layout */}
              <div className="bg-slate-50 border border-gray-250/30 rounded-2xl p-4 h-[280px] overflow-y-auto space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-[80%] rounded-2xl text-[12px] font-semibold ${
                      msg.sender === 'user' 
                        ? 'bg-[#0E1F35] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-gray-200'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] mt-1 block text-right ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Selector */}
              <div className="flex gap-2 py-0.5 overflow-x-auto select-none font-bold">
                {[
                  "Is Sadar RERA compliant?",
                  "Mihan ROI growth trends", 
                  "Compare Rent vs Buy Nagpur"
                ].map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setChatInput(p);
                    }}
                    className="shrink-0 bg-white hover:bg-slate-50 border border-gray-200/80 px-3 py-1.5 rounded-full text-[10px] text-slate-700 cursor-pointer"
                  >
                    💡 {p}
                  </button>
                ))}
              </div>

              {/* Message Dispatch Bar */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Send trigger
                      if (!chatInput.trim()) return;
                      const uMsg = chatInput;
                      setChatMessages(prev => [...prev, { sender: 'user', text: uMsg, time: 'Now' }]);
                      setChatInput('');
                      
                      // Auto AI response mock
                      setTimeout(() => {
                        let resp = "Excellent query. Nagpur residential projects are currently showing average appreciation trends between 6.5% and 9% in Ganeshpeth and Mihan IT hubs. The RERA registrations keep buyers secure.";
                        if (uMsg.toLowerCase().includes('sadar')) {
                          resp = "Sadar Nagpur area is historically mature with elite, premium rates ranging from ₹7,000 to ₹11,000 per sqft. Most complexes here carry full NIT and structural clearance guarantees.";
                        } else if (uMsg.toLowerCase().includes('mihan')) {
                          resp = "Mihan IT belt is Nagpur's primary high-growth segment. With rapid developer absorption limits, rental yield stands exceptionally high at 3.6% average.";
                        }
                        setChatMessages(prev => [...prev, { sender: 'assistant', text: resp, time: 'Now' }]);
                        awardXPAction('chat_with_ai');
                        setGamState(getGamificationState());
                      }, 1000);
                    }
                  }}
                  placeholder="Ask Nagpur AI something..."
                  className="flex-grow text-xs px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E1F35]"
                />
                <button 
                  onClick={() => {
                    if (!chatInput.trim()) return;
                    const uMsg = chatInput;
                    setChatMessages(prev => [...prev, { sender: 'user', text: uMsg, time: 'Now' }]);
                    setChatInput('');
                    
                    setTimeout(() => {
                      let resp = "Welcome to Nagpur Urban Nest's AI helper. Our real-estate data structures guarantee high fidelity. Ask about our listings directly.";
                      if (uMsg.toLowerCase().includes('sadar')) {
                        resp = "Sadar contains several properties like the Emerald Luxury Suite priced around ₹85 Lac carrying extensive features.";
                      }
                      setChatMessages(prev => [...prev, { sender: 'assistant', text: resp, time: 'Now' }]);
                      awardXPAction('chat_with_ai');
                      setGamState(getGamificationState());
                    }, 1000);
                  }}
                  className="bg-[#0E1F35] hover:bg-amber-600 p-2.5 text-white rounded-xl cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 text-left select-none">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Notification Center
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Track dynamic system signals, premium discount updates, and RERA verification clearances.
                </p>
              </div>

              <div className="space-y-3">
                {notifList.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-colors flex gap-3 items-start ${
                      !n.isRead 
                        ? 'bg-amber-500/[0.02] border-amber-550/20 shadow-xs' 
                        : 'bg-white border-gray-150'
                    }`}
                  >
                    <span className="p-2 bg-slate-100 rounded-xl mt-0.5 shrink-0">
                      <Bell className={`w-3.5 h-3.5 ${!n.isRead ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
                    </span>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{n.title}</h4>
                        <span className="text-[9px] text-gray-400 font-bold block whitespace-nowrap uppercase tracking-wider">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-1">{n.desc}</p>
                      
                      {!n.isRead && (
                        <button 
                          onClick={() => {
                            setNotifList(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
                          }}
                          className="mt-2 text-[9px] font-black uppercase text-amber-700 hover:underline cursor-pointer"
                        >
                          Mark as read ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-150 flex justify-between">
                <button 
                  onClick={() => {
                    setNotifList(prev => prev.map(item => ({ ...item, isRead: true })));
                    alert("All signals successfully decoded and cleared!");
                  }}
                  className="text-xs font-black uppercase text-[#004C5C] hover:underline cursor-pointer"
                >
                  Mark All Read
                </button>
                <button 
                  onClick={() => {
                    setNotifList([]);
                    alert("Cleared all alert signals!");
                  }}
                  className="text-xs font-black uppercase text-rose-700 hover:underline cursor-pointer"
                >
                  Clear All Alerts
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: REWARDS / XP */}
          {activeTab === 'rewards' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                  Rewards & Gamification Protocol
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Track cumulative XP progress, check-in daily to build multipliers, and pull fortune prizes on our spin wheel.
                </p>
              </div>

              {/* Progress and Streaks Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
                
                {/* Level progress info */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-2xl">🏆</div>
                  <span className="text-[9px] font-black tracking-widest text-[#B38330] uppercase">
                    Level Status
                  </span>
                  <h3 className="text-2xl font-black font-sans text-white mt-1.5">
                    Level {currentLvlNum}
                  </h3>
                  <p className="text-[11px] text-slate-350 font-semibold whitespace-nowrap truncate">{currentLevelInfo.badgeSymbol} {currentLevelInfo.name}</p>

                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                      <span>XP: {gamState.xp}</span>
                      <span>Target: {xpNeeded} XP</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (gamState.xp / xpNeeded) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Streak Multipliers */}
                <div className="bg-[#FAFDFE] rounded-2xl p-5 border border-gray-200">
                  <span className="text-[9px] font-black tracking-widest text-[#B38330] uppercase">
                    Daily Streak System
                  </span>
                  <div className="flex justify-between items-center mt-1.5">
                    <h3 className="text-xl font-black text-[#0E1F35]">
                      {gamState.streakDays} Days Active
                    </h3>
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold leading-tight mt-1">
                    Check-in daily on your passport console. 3-day and 7-day login streaks unlock 1.5x and 2x XP multipliers!
                  </p>

                  <button 
                    onClick={() => {
                      const res = claimDailyCheckIn();
                      setGamState(getGamificationState());
                      alert(res.message);
                    }}
                    className="mt-3.5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0E1F35] text-[10px] uppercase font-black tracking-wider rounded-xl transition-all block text-center border border-gray-250 cursor-pointer"
                  >
                    Claim Today Check-In Bonus 🔥
                  </button>
                </div>
              </div>

              {/* Spin the Wheel Action Area */}
              <div className="bg-slate-50 border border-gray-200 rounded-3xl p-5 text-center flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-[#0E1F35] tracking-widest mb-3 self-start">
                  🎡 Member Fortune Spin Wheel
                </span>

                <div 
                  className="w-28 h-28 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center relative overflow-hidden transition-transform duration-2000 ease-out shadow-md"
                  style={{ 
                    transform: `rotate(${spinDeg}deg)`, 
                    transition: isSpinning ? 'transform 2.2s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none' 
                  }}
                >
                  {/* Wheel sectors color background */}
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#06b6d4_0deg_72deg,#3b82f6_72deg_144deg,#10b981_144deg_216deg,#f59e0b_216deg_288deg,#ec4899_288deg_360deg)] opacity-70" />
                  <div className="absolute text-[8px] font-black text-white transform -rotate-90 translate-y-[-30px]">Report</div>
                  <div className="absolute text-[8px] font-black text-white transform rotate-18 translate-y-[30px]">+50 XP</div>
                  <div className="absolute text-[8px] font-black text-white transform rotate-162 translate-x-[-25px]">Pass</div>
                  <div className="absolute text-[8px] font-black text-white transform -rotate-18 translate-x-[25px]">+100 XP</div>
                  <div className="absolute text-[8px] font-black text-white transform rotate-90 translate-y-[-25px] text-amber-300">Consult</div>
                </div>

                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-rose-500 z-10 -mt-2.5 mb-2.5" />

                {spinResult && (
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/50 mb-3 animate-bounce">
                    🎁 Reward Received: {spinResult}!
                  </p>
                )}

                <button 
                  disabled={isSpinning}
                  onClick={() => {
                    if (isSpinning) return;
                    setIsSpinning(true);
                    setSpinResult(null);
                    const spinAngle = Math.floor(Math.random() * 360);
                    const finalDeg = spinDeg + 720 + spinAngle;
                    setSpinDeg(finalDeg);

                    const prizes = ["Free Consultation Session", "100 XP Boost", "Priority Site Visit Pass", "50 XP Bonus", "Premium street valuation report"];
                    const winningVal = prizes[Math.floor((spinAngle % 360) / 72) % 5];

                    setTimeout(() => {
                      setIsSpinning(false);
                      setSpinResult(winningVal);
                      if (winningVal.includes("XP")) {
                        const amt = winningVal.includes("100") ? 100 : 50;
                        awardXPAction('chat_with_ai', amt);
                        setGamState(getGamificationState());
                      } else {
                        // Reward unlocked
                        awardXPAction('chat_with_ai', 10);
                        setGamState(getGamificationState());
                      }
                    }, 2200);
                  }}
                  className="bg-[#0E1F35] hover:bg-amber-600 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-wider px-6 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {isSpinning ? '🎡 Spin in progress...' : '🎰 Spin for Rewards!'}
                </button>
              </div>

              {/* Achievements Badges List Grid */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5">
                <span className="text-[10px] font-black uppercase text-[#0E1F35] tracking-widest block mb-3.5">
                  Unlocked Member Badges Protocol
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {ACHIEVEMENT_BADGES.map(badge => {
                    const unlocked = gamState.badges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          unlocked 
                            ? 'bg-gradient-to-tr from-amber-500/5 to-orange-500/5 border-amber-200' 
                            : 'bg-slate-50 border-gray-200/50 opacity-50 saturate-0'
                        }`}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <h4 className="text-[11px] font-black text-slate-800 truncate leading-none">{badge.title}</h4>
                        <span className="text-[8px] text-gray-400 font-extrabold block mt-1 uppercase tracking-wider">
                          {unlocked ? 'CLAIMED ✅' : 'LOCKED 🔒'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Common Support Capsule (Static) */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-2.5 text-xs text-gray-500 font-semibold text-left">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Session active since: <strong>June 17, 2026</strong></span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => alert(`Connecting with elite real-estate advisor for ${profileName}...`)}
                className="bg-slate-150 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                📞 Live Call Broker
              </button>
              <button 
                onClick={onBackToHome}
                className="bg-[#004C5C]/10 hover:bg-[#004C5C]/15 text-[#004C5C] text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Explore Listings
              </button>
            </div>
          </div>

        </main>

      </div>

    </div>
  );
}
