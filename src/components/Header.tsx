import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  ShieldAlert, 
  ChevronDown, 
  Sparkles, 
  Check, 
  HelpCircle,
  Search,
  Zap,
  Shield,
  Smile,
  Trophy,
  Award,
  Compass,
  MessageSquare,
  Calendar,
  Share2,
  RefreshCw,
  Flame,
  Send,
  Star as StarIcon,
  Crown
} from 'lucide-react';

import {
  getGamificationState,
  saveGamificationState,
  getCurrentLevel,
  getNextLevel,
  awardXPAction,
  checkStreakProgress,
  getFullLeaderboard,
  ACHIEVEMENT_BADGES,
  REFERRAL_TIERS,
  GamificationState,
  LEVEL_THRESHOLDS,
  claimDailyCheckIn
} from '../lib/gamification';


interface HeaderProps {
  onNavClick: (view: 'home' | 'blogs' | 'pricing' | 'login' | 'about' | 'sheets' | 'dashboard') => void;
  currentView: string;
  isLoggedIn: boolean;
  currentUser: { email: string; name?: string; profilePic?: string; roles?: string[] } | null;
  onLogout: () => void;
  onLoginSuccess: (email: string, name?: string, profilePic?: string, roles?: string[]) => void;
}

export default function Header({ onNavClick, currentView, isLoggedIn, currentUser, onLogout, onLoginSuccess }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Gamification states
  const [gamState, setGamState] = useState<GamificationState>(getGamificationState());
  const [gDropdownTab, setGDropdownTab] = useState<'overview' | 'badges' | 'spin' | 'rankings'>('overview');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinWinnerMsg, setSpinWinnerMsg] = useState<string | null>(null);
  
  // Custom interactive user preferences for Match Score (Phase 6)
  const [prefLocation, setPrefLocation] = useState('Pune');
  const [prefBudget, setPrefBudget] = useState(65); // 65 Lacs standard default
  
  // Referral friend form (Phase 5)
  const [refEmail, setRefEmail] = useState('');
  
  // Real-time floating XP points toast popups
  const [floatingXPToast, setFloatingXPToast] = useState<{ visible: boolean; amount: string; txt: string; details?: string } | null>(null);

  // Computed level values for TypeScript type-safety
  const currentLvlThreshold = getCurrentLevel(gamState.xp);
  const nextLvlThreshold = getNextLevel(gamState.xp);
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(th => th.name === currentLvlThreshold.name);
  const currentLevelNumber = currentLevelIndex !== -1 ? currentLevelIndex + 1 : 1;
  const nextLevelXPNeeded = nextLvlThreshold ? nextLvlThreshold.minXP : 999999;

  useEffect(() => {
    // Check and update streak on load/login
    if (isLoggedIn) {
      const streakRes = checkStreakProgress();
      if (streakRes.streakUpdated) {
        setGamState(getGamificationState());
        if (streakRes.bonusClaimed > 0) {
          triggerXPToast(`+${streakRes.bonusClaimed} XP`, `Daily Login Streak Day ${streakRes.newDays}!`, `🔥 Consecutive connection bonuses unlocked!`);
        } else {
          triggerXPToast(`+0 XP`, `Daily Streak Checked: Day ${streakRes.newDays}`, `Keep connecting daily to claim 3-day and 7-day multipliers!`);
        }
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Sync match score location/budget preference to localstorage for other components to access easily
    try {
      localStorage.setItem('urban_nest_pref_location', prefLocation);
      localStorage.setItem('urban_nest_pref_budget', prefBudget.toString());
      // Fire preferences updated event so list views immediately recalculate matches!
      window.dispatchEvent(new CustomEvent('urban_nest_preferences_updated', { detail: { prefLocation, prefBudget } }));
    } catch(err) {
      console.error(err);
    }
  }, [prefLocation, prefBudget]);

  useEffect(() => {
    const handleXPTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: Parameters<typeof awardXPAction>[0]; customAmount?: number }>;
      const { action, customAmount } = customEvent.detail;
      const res = awardXPAction(action, customAmount);
      
      setGamState(getGamificationState());
      
      let actionLabel = "Action Completed";
      if (action === 'view_property') actionLabel = "Viewed Property listing";
      else if (action === 'save_property') actionLabel = "Listing pinned to Favorites";
      else if (action === 'share_property') actionLabel = "Signal Shared to Network";
      else if (action === 'use_calculator') actionLabel = "Mortgage analysis calculated";
      else if (action === 'chat_with_ai') actionLabel = "AI Intelligence consulted";
      else if (action === 'book_site_visit') actionLabel = "Physical visit booked";
      else if (action === 'refer_friend') actionLabel = "Referral dispatch finalized";
      else if (action === 'weekly_challenge') actionLabel = "Weekly Discovery completed";
      else if (action === 'complete_profile') actionLabel = "Digital ID passport completed";
      else if (action === 'spin_wheel_xp') actionLabel = "🎡 Spin Wheel Reward Claimed!";

      let detailString = "Earned point signals added to profile.";
      if (res.levelUpOccurred) {
        detailString = `🎉 LEVEL UP! Unlocked New Rank: ${res.newLevelName}!`;
      } else if (res.badgesUnlocked.length > 0) {
        detailString = `🏆 UNLOCKED BADGE: "${res.badgesUnlocked.join(', ')}"!`;
      }

      triggerXPToast(`+${res.xpAdded} XP`, actionLabel, detailString);
    };

    const handleStateSync = () => {
      setGamState(getGamificationState());
    };

    window.addEventListener('urban_nest_award_xp_trigger', handleXPTrigger);
    window.addEventListener('urban_nest_gamification_updated', handleStateSync);

    return () => {
      window.removeEventListener('urban_nest_award_xp_trigger', handleXPTrigger);
      window.removeEventListener('urban_nest_gamification_updated', handleStateSync);
    };
  }, []);

  const triggerXPToast = (amount: string, txt: string, details?: string) => {
    setFloatingXPToast({ visible: true, amount, txt, details });
    setTimeout(() => {
      setFloatingXPToast(null);
    }, 4500);
  };


  // Hardcoded notifications for realistic, beautiful UI feedback
  const alertsList = [
    { id: 1, title: 'Welcome to Urban Nest!', desc: 'Verify your digital passport rules any time.', time: 'Just now', unread: true },
    { id: 2, title: 'Price cut in Nagpur Center', desc: 'Siddheshwar flats drops ₹5.2 Lacs under value.', time: '2 hrs ago', unread: true },
    { id: 3, title: 'Passport Active Status', desc: 'Secure real estate keys dispatch completed successfully.', time: '1 day ago', unread: false }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    onLoginSuccess(loginForm.email, loginForm.email.split('@')[0], 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
    setShowLoginModal(false);
    setLoginForm({ email: '', password: '' });
  };

  return (
    <>
      <header id="app-header" className="bg-white border-b border-gray-100 py-3 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo and Subtext */}
        <div 
          onClick={() => onNavClick('home')}
          className="flex items-center gap-4 cursor-pointer group"
        >
          {/* Detailed SVG Logo resembling the real brand asset */}
          <div className="w-12 h-12 flex-shrink-0 relative">
            <svg 
              viewBox="0 0 120 220" 
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            >
              {/* Left Top - Deep Teal Hook (#004C5C) */}
              <path 
                d="M 57,5 L 5,35 L 5,95 L 18,87.5 L 18,50 L 57,27.5 Z" 
                fill="#004C5C" 
              />

              {/* Left Bottom Golden Lattice - (#B38330) */}
              {/* Outer Left prong */}
              <path 
                d="M 5,108 L 18,115.5 L 18,185 L 5,192.5 Z" 
                fill="#B38330" 
              />
              {/* Crossing slope 1 */}
              <path 
                d="M 5,108 L 38,127 L 38,141 L 18,129.5 L 18,115.5 Z" 
                fill="#B38330" 
              />
              {/* Crossing slope 2 */}
              <path 
                d="M 18,140 L 38,151.5 L 38,165.5 L 18,154 Z" 
                fill="#B38330" 
              />
              {/* Center Left vertical column */}
              <path 
                d="M 38,80 L 57,91 L 57,215 L 38,204 Z" 
                fill="#B38330" 
              />

              {/* Right Side - Deep Navy (#0E1F35) */}
              {/* Center Right Vertical Column (Spine) */}
              <path 
                d="M 63,5 L 81,15.4 L 81,204.6 L 63,215 Z" 
                fill="#0E1F35" 
              />
              {/* Top Arm of the Right Hook */}
              <path 
                d="M 81,15.4 L 115,35 L 115,80 L 98,70 L 98,45 L 81,35 Z" 
                fill="#0E1F35" 
              />
              {/* Middle Arm of the Right Hook */}
              <path 
                d="M 81,75 L 98,85 L 98,120 L 81,110 Z" 
                fill="#0E1F35" 
              />

              {/* Floating Deep Teal Polygons on Lower Right (#004C5C) */}
              {/* Upper floating block */}
              <path 
                d="M 98,105 L 115,115 L 115,125 L 98,115 Z" 
                fill="#004C5C" 
              />
              {/* Lower floating block */}
              <path 
                d="M 98,135 L 115,125 L 115,165 L 98,175 Z" 
                fill="#004C5C" 
              />
            </svg>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-black m-0 leading-none">
              Urban Nest Realty
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium italic">
              Your all housing needs served at one Place.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-8 text-sm font-semibold text-gray-800">
          <button
            onClick={() => onNavClick('blogs')}
            className={`cursor-pointer hover:text-orange-500 transition-colors ${
              currentView === 'blogs' ? 'text-orange-500 border-b-2 border-orange-500' : ''
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => onNavClick('pricing')}
            className={`cursor-pointer hover:text-orange-500 transition-colors ${
              currentView === 'pricing' ? 'text-orange-500 border-b-2 border-orange-500' : ''
            }`}
          >
            Pricing
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              
              {/* Quick-Access Dashboard Link */}
              <button
                onClick={() => onNavClick('dashboard')}
                className={`py-1.5 px-4 rounded-full border text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                  currentView === 'dashboard'
                    ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow-sm'
                    : 'bg-[#004C5C]/10 text-[#004C5C] hover:bg-[#004C5C]/15 border-[#004C5C]/20'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> My Dashboard
              </button>
              
              {/* Notification Button */}
              <div 
                className="relative"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => setShowNotifications(false)}
              >
                <button
                  type="button"
                  className="p-2 text-slate-600 hover:text-[#004C5C] hover:bg-slate-50 rounded-full transition-all cursor-pointer relative flex items-center justify-center"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 animate-pulse" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown - Liquid Glass Styling */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 glass-panel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl z-50 p-4 text-left animate-fadeIn overflow-hidden">
                    {/* Background Radial Glow Blobs matching UI Kit images */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 glass-glow-orange opacity-40 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 glass-glow-purple opacity-30 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Diagonal Glint sheen overlay */}
                    <div className="glass-gloss-shine absolute inset-0 pointer-events-none" />
                    <div className="glass-gloss-reflection" />
                    
                    {/* Floating cyan tiny active orb indicator top center */}
                    <div className="absolute top-1.5 right-[50%] translate-x-[50%] w-8 h-1 rounded-full bg-cyan-400 opacity-85" />

                    <div className="relative z-10 p-0.5">
                      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3.5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                          <h4 className="text-xs font-black text-cyan-200 uppercase tracking-widest leading-none">Intelligence Feed</h4>
                        </div>
                        <span className="text-[8px] font-black text-white uppercase bg-orange-500/80 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                          3 Signals
                        </span>
                      </div>
                      
                      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5">
                        {alertsList.map(alertItem => (
                          <div 
                            key={alertItem.id} 
                            className={`p-2.5 rounded-2xl transition-all border border-white/5 flex gap-2.5 ${
                              alertItem.unread 
                                ? 'bg-cyan-950/25 border-cyan-500/25 shadow-[0_4px_12px_rgba(6,182,212,0.15)]' 
                                : 'bg-white/[0.01]'
                            } hover:bg-white/[0.08] hover:border-white/10 cursor-pointer`}
                          >
                            <div className="shrink-0 relative">
                              <span className={`flex w-2 h-2 rounded-full mt-1.5 ${
                                alertItem.unread ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse' : 'bg-white/30'
                              }`} />
                            </div>
                            <div>
                              <p className="text-[11px] font-extrabold text-white leading-tight">{alertItem.title}</p>
                              <p className="text-[10px] text-slate-300 leading-snug mt-1">{alertItem.desc}</p>
                              <span className="text-[7.5px] text-slate-400 font-extrabold text-right block mt-1 uppercase tracking-wider">{alertItem.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Quick-Action capsule resembling the UI Kit */}
                      <button 
                        type="button" 
                        onClick={() => alert("Marked all notifications as decoded!")}
                        className="w-full mt-3.5 py-2 bg-cyan-950/50 hover:bg-cyan-900/40 text-[9px] font-black uppercase text-cyan-300 tracking-widest rounded-xl border border-cyan-400/20 text-center cursor-pointer transition-all"
                      >
                        Dismiss All Signals
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown Container */}
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2.5 p-1 pl-3.5 pr-1.5 hover:bg-slate-50 border border-slate-200/60 rounded-full transition-all cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden sm:inline">
                    Hi, {currentUser?.name || 'Explorer'}
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-[#004C5C]/20 shrink-0">
                    <img 
                      src={currentUser?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Options - Premium Gamified Double-Wing Control Deck */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-[500px] glass-panel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] rounded-3xl z-50 p-4 sm:p-5 text-left animate-fadeIn overflow-hidden">
                    {/* Background glows mimicking the colorful light auras */}
                    <div className="absolute -top-16 -left-16 w-36 h-36 glass-glow-cyan opacity-40 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-16 -right-16 w-36 h-36 glass-glow-purple opacity-30 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Gloss gloss reflection streak lines */}
                    <div className="glass-gloss-shine absolute inset-0 pointer-events-none" />
                    <div className="glass-gloss-reflection" />
                    <div className="absolute top-1.5 right-[50%] translate-x-[50%] w-12 h-1 rounded-full bg-cyan-400 opacity-80" />

                    <div className="relative z-10 flex flex-col">
                      
                      {/* User Header Info */}
                      <div className="pb-3.5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                              <img 
                                src={currentUser?.profilePic || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'} 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border border-[#0D1625] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white truncate uppercase tracking-tight leading-none flex items-center gap-1.5">
                              {currentUser?.name || 'Explorer User'} 
                              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                Lvl {currentLevelNumber}
                              </span>
                            </h4>
                            <p className="text-[10px] text-slate-300 truncate font-semibold leading-none mt-1.5 lowercase">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Status Indicator */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs self-start sm:self-auto">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-orange-300 font-black tracking-wide uppercase text-[9px]">
                            {currentLvlThreshold.badgeSymbol} {currentLvlThreshold.name}
                          </span>
                        </div>
                      </div>

                      {/* Tab Selection Bar */}
                      <div className="flex border-b border-white/10 py-2 gap-1 overflow-x-auto select-none no-scrollbar">
                        <button 
                          onClick={() => setGDropdownTab('overview')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            gDropdownTab === 'overview' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          🚀 Engine
                        </button>
                        <button 
                          onClick={() => setGDropdownTab('badges')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            gDropdownTab === 'badges' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          🏆 Badges
                        </button>
                        <button 
                          onClick={() => setGDropdownTab('spin')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            gDropdownTab === 'spin' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          🎡 Spin
                        </button>
                        <button 
                          onClick={() => setGDropdownTab('rankings')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            gDropdownTab === 'rankings' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          📊 Stats
                        </button>
                      </div>

                      {/* Tab Content 1: Overview and Streaks */}
                      {gDropdownTab === 'overview' && (
                        <div className="py-3 space-y-3.5">
                          {/* XP and Levels Progress */}
                          <div>
                            <div className="flex justify-between items-end mb-1 text-[10px]">
                              <span className="text-slate-300 font-bold uppercase tracking-tight">XP Progress Tracker</span>
                              <span className="text-cyan-300 font-extrabold">{gamState.xp} / {nextLevelXPNeeded} XP</span>
                            </div>
                            <div className="w-full bg-slate-900/60 rounded-full h-2 border border-white/5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-amber-500 h-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-500"
                                style={{ width: `${Math.min(100, (gamState.xp / nextLevelXPNeeded) * 100)}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium mt-1">
                              Gather {nextLevelXPNeeded > gamState.xp ? nextLevelXPNeeded - gamState.xp : 0} more XP to reach level {currentLevelNumber + 1}!
                            </p>
                          </div>

                          {/* Streak System (Phase 7) */}
                          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">Streak Calendar ({gamState.streakDays} Days)</span>
                              </div>
                              <span className="text-[9px] text-amber-400 font-bold">Claim rewards daily!</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                                const active = gamState.streakDays >= day;
                                return (
                                  <div key={day} className={`p-1 rounded-lg border transition-all text-[8.5px] ${
                                    active 
                                      ? 'bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/30 text-orange-200' 
                                      : 'bg-slate-950/40 border-white/5 text-slate-500'
                                  }`}>
                                    <div className="font-extrabold truncate">D{day}</div>
                                    <div className="text-[12px] mt-0.5">{active ? '🔥' : '🔒'}</div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Streak interactive claim button */}
                            {(() => {
                              const todayStr = new Date().toISOString().split('T')[0];
                              const claimedToday = gamState.lastClaimedXPDate === todayStr;
                              return (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const res = claimDailyCheckIn();
                                    setGamState(getGamificationState());
                                    if (res.success) {
                                      alert(res.message);
                                    } else {
                                      alert(`Oops: ${res.message}`);
                                    }
                                  }}
                                  disabled={claimedToday}
                                  className={`w-full mt-2.5 py-1.5 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all cursor-pointer block border text-center ${
                                    claimedToday
                                      ? 'bg-slate-800/40 border-white/5 text-slate-500'
                                      : 'bg-orange-600/30 hover:bg-orange-600/50 border-orange-500/40 text-orange-100'
                                  }`}
                                >
                                  {claimedToday ? 'Checked-In Today ✅' : 'Claim Daily Check-In Bonus 🔥'}
                                </button>
                              );
                            })()}
                          </div>

                          {/* Property Discovery Challenge (Phase 4) */}
                          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3 relative overflow-hidden">
                            <span className="absolute -top-3 -right-3 text-[36px] opacity-10 filter blur-xs pointer-events-none">🧭</span>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">Weekly Discovery Quest</span>
                              <span className="text-[9px] text-cyan-300 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/10">Quest XP: +200 XP</span>
                            </div>
                            <p className="text-[9.5px] text-slate-300 font-bold">Explore 10 new properties this week</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-cyan-400 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(100, (gamState.weeklyTargetCount / 10) * 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-white font-black shrink-0">{gamState.weeklyTargetCount} / 10</span>
                            </div>
                            
                            {/* Quest completed claim block */}
                            {gamState.weeklyTargetCount >= 10 ? (
                              <button 
                                onClick={() => {
                                  awardXPAction('weekly_challenge');
                                  // Update explored count back to 0 just for loop fun
                                  const localState = getGamificationState();
                                  localState.weeklyTargetCount = 0;
                                  saveGamificationState(localState);
                                  setGamState(getGamificationState());
                                }}
                                className="w-full mt-2 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 hover:opacity-90 font-black rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                🏆 Claim Reward +200 XP Now!
                              </button>
                            ) : (
                              <div className="mt-2 text-[8.5px] text-slate-400 italic">
                                Action trigger: Open home listings, buy listings or pg pages to increment progress!
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab Content 2: Achievement Badges and Referrals */}
                      {gDropdownTab === 'badges' && (
                        <div className="py-3.5 space-y-3.5">
                          {/* Badges List (Phase 3) */}
                          <div>
                            <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 block mb-2">Achievement Badges Checkpoint</span>
                            <div className="grid grid-cols-5 gap-2 text-center">
                              {ACHIEVEMENT_BADGES.map((badge) => {
                                const isUnlocked = gamState.badges.includes(badge.id);
                                return (
                                  <div 
                                    key={badge.id} 
                                    className="group relative cursor-pointer"
                                    onClick={() => alert(`Badge: ${badge.title}\nGoal: ${badge.description}\nReward: +${badge.xpReward} XP`)}
                                  >
                                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg shadow-inner transition-all duration-300 ${
                                      isUnlocked 
                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-300 scale-100' 
                                        : 'bg-white/[0.04] border border-white/5 opacity-55 saturate-0'
                                    }`}>
                                      {badge.icon}
                                    </div>
                                    <div className="text-[8px] font-extrabold text-slate-300 mt-1 truncate max-w-[50px] mx-auto">
                                      {badge.title.split(' ')[0]}
                                    </div>
                                    {/* Tooltip for desktop */}
                                    <div className="absolute bottom-11 left-1.5 translate-x-[-40%] bg-slate-950 text-white text-[9px] px-2 py-1 rounded-lg border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50 w-36 text-center leading-normal shadow-2xl">
                                      <div className="font-bold text-amber-400 mb-0.5">{badge.title}</div>
                                      <div>{badge.description}</div>
                                      <div className="font-black text-[8px] mt-1 uppercase text-cyan-300">Reward: +{badge.xpReward} XP</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Referral Gamification Mode (Phase 5) */}
                          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">Referral League System</span>
                              <span className="text-[8.5px] text-amber-400 font-extrabold uppercase">Bronze / Silver / Gold</span>
                            </div>
                            <p className="text-[9.5px] text-slate-300 font-bold mb-2">Claim +250 XP per registered profile friend!</p>
                            
                            <div className="flex gap-1.5 mb-2.5">
                              <input 
                                type="email"
                                value={refEmail}
                                onChange={(e) => setRefEmail(e.target.value)}
                                placeholder="Enter friend email..."
                                className="flex-1 py-1 px-2.5 rounded-xl text-[10px] text-white placeholder-slate-400/80 focus:outline-none bg-slate-950 border border-white/10"
                              />
                              <button 
                                onClick={() => {
                                  if (!refEmail || !refEmail.includes('@')) {
                                    alert('Please enter a valid email address!');
                                    return;
                                  }
                                  awardXPAction('refer_friend');
                                  // Update referral stats
                                  const localS = getGamificationState();
                                  localS.referralsCount = (localS.referralsCount || 0) + 1;
                                  saveGamificationState(localS);
                                  setGamState(getGamificationState());
                                  setRefEmail('');
                                }}
                                className="px-3 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-black rounded-xl text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                Invite
                              </button>
                            </div>

                            {/* Referral Milestones Progress */}
                            <div className="flex items-center justify-between text-[9px] border-t border-white/5 pt-2">
                              <div className="flex items-center gap-1">
                                <span className={gamState.referralsCount >= 1 ? 'text-[12px] opacity-100' : 'text-[12px] opacity-20'}>🥉</span>
                                <span className={gamState.referralsCount >= 5 ? 'text-[12px] opacity-100' : 'text-[12px] opacity-20'}>🥈</span>
                                <span className={gamState.referralsCount >= 10 ? 'text-[12px] opacity-100' : 'text-[12px] opacity-20'}>🥇</span>
                              </div>
                              <div className="text-right">
                                <span className="font-extrabold text-slate-300">Referrals Counts: </span>
                                <span className="text-cyan-400 font-black">{gamState.referralsCount || 0} Friends</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 3: Spin Wheel Game */}
                      {gDropdownTab === 'spin' && (
                        <div className="py-3 flex flex-col items-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 self-start">Phase 8: Active Spin Wheel</span>
                          
                          {/* Spin wheel visual layout using pure CSS gradient sectors */}
                          <div className="relative w-33 h-33 rounded-full border-4 border-slate-700 bg-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden flex items-center justify-center transition-transform duration-[2000s] ease-out select-none"
                            style={{ 
                              transform: `rotate(${spinDeg}deg)`, 
                              transition: isSpinning ? 'transform 2.2s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none' 
                            }}
                          >
                            {/* Inner circle split */}
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#06b6d4_0deg_72deg,#3b82f6_72deg_144deg,#10b981_144deg_216deg,#f59e0b_216deg_288deg,#ec4899_288deg_360deg)] opacity-70" />
                            
                            {/* Text labels on sectors */}
                            <div className="absolute text-[8px] font-black text-white transform -rotate-90 translate-y-[-40px]">Report</div>
                            <div className="absolute text-[8px] font-black text-white transform rotate-18 translate-y-[40px]">+50 XP</div>
                            <div className="absolute text-[8px] font-black text-white transform rotate-162 translate-x-[-35px] translate-y-[10px]">Pass</div>
                            <div className="absolute text-[8px] font-black text-white transform -rotate-18 translate-x-[35px] translate-y-[-10px]">+100 XP</div>
                            <div className="absolute text-[8px] font-black text-white transform rotate-90 translate-y-[-35px] text-amber-300">Consult</div>
                          </div>
                          
                          {/* Pin Arrow Indicator strictly placed */}
                          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-red-500 z-20 -mt-2 mb-2" />

                          {spinWinnerMsg && (
                            <div className="bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 text-[10px] font-black tracking-wide px-3 py-1.5 rounded-xl uppercase text-center mb-3 animate-bounce">
                              🎁 Received: {spinWinnerMsg}!
                            </div>
                          )}

                          <button
                            type="button"
                            disabled={isSpinning}
                            onClick={() => {
                              if (isSpinning) return;
                              setIsSpinning(true);
                              setSpinWinnerMsg(null);
                              
                              // Pick a target angle: 360 * 5 rotations + random sector bounds
                              const extraDeg = Math.floor(Math.random() * 360);
                              const targetDeg = spinDeg + 720 + extraDeg;
                              setSpinDeg(targetDeg);

                              // Outcomes list
                              const rewards = [
                                "Free Consultation session",
                                "100 XP Level Boost",
                                "Priority Site Visit Pass",
                                "50 XP Level Boost",
                                "Premium Street Report"
                              ];
                              
                              // Determine winning sector index based on final angle (normalizing under 360)
                              const finalAngleUnder360 = (extraDeg) % 360;
                              const index = Math.floor(finalAngleUnder360 / 72); // 5 sectors of 72 degrees each
                              const winningReward = rewards[index % 5];

                              setTimeout(() => {
                                setIsSpinning(false);
                                setSpinWinnerMsg(winningReward);
                                
                                // Record the award
                                if (winningReward.includes("100 XP")) {
                                  awardXPAction('chat_with_ai', 100);
                                  setGamState(getGamificationState());
                                } else if (winningReward.includes("50 XP")) {
                                  awardXPAction('chat_with_ai', 50);
                                  setGamState(getGamificationState());
                                } else {
                                  // Non-XP rewards are logged in notification feeds!
                                  triggerXPToast("🎡 Prize Won", winningReward, "Enjoy your exclusive premium explorer privilege.");
                                }
                              }, 2200);
                            }}
                            className="px-6 py-2 glass-button-cyan rounded-xl text-white font-black text-[10px] uppercase tracking-widest cursor-pointer disabled:opacity-40"
                          >
                            {isSpinning ? '🎡 Orbiting...' : '🎰 Spin the Wheel!'}
                          </button>
                        </div>
                      )}

                      {/* Tab Content 4: Leaderboard and Location Preference (Phase 6, 9) */}
                      {gDropdownTab === 'rankings' && (
                        <div className="py-3 space-y-3">
                          {/* Match preferences (Phase 6) */}
                          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3 text-xs">
                            <span className="text-[9px] font-black text-white uppercase tracking-wider block mb-2">🎯 Set Match Score Preference</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] font-extrabold uppercase text-slate-400 block mb-1">Target Area</label>
                                <select 
                                  value={prefLocation}
                                  onChange={(e) => setPrefLocation(e.target.value)}
                                  className="w-full text-[10px] font-bold text-white bg-slate-950 border border-white/10 rounded-lg p-1"
                                >
                                  <option value="Pune">Pune Center</option>
                                  <option value="Nagpur">Nagpur West</option>
                                  <option value="Baner">Baner Prime</option>
                                  <option value="Kharadi">Kharadi Tech</option>
                                  <option value="Hinjewadi">Hinjewadi IT</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[8px] font-extrabold uppercase text-slate-400 block mb-1">Max Budget</label>
                                <select 
                                  value={prefBudget}
                                  onChange={(e) => setPrefBudget(parseInt(e.target.value))}
                                  className="w-full text-[10px] font-bold text-white bg-slate-950 border border-white/10 rounded-lg p-1"
                                >
                                  <option value="30">₹ 30 Lacs</option>
                                  <option value="50">₹ 50 Lacs</option>
                                  <option value="75">₹ 75 Lacs</option>
                                  <option value="120">₹ 1.2 Crore</option>
                                  <option value="250">₹ 2.5 Crore</option>
                                </select>
                              </div>
                            </div>
                            <span className="text-[8px] text-amber-500/90 font-extrabold uppercase tracking-wide block mt-2 text-center">
                              Active: Location {prefLocation} under {prefBudget}L
                            </span>
                          </div>

                          {/* Leaderboard list (Phase 9) */}
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Top housing Pioneers Leaderboard</span>
                            <div className="bg-slate-950/60 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden max-h-[140px] overflow-y-auto no-scrollbar">
                              {getFullLeaderboard(gamState.xp, currentUser?.name || 'Explorer User', currentUser?.profilePic || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix')
                                .map((usr) => (
                                  <div 
                                    key={usr.rank + '_' + usr.name} 
                                    className={`flex items-center justify-between p-2 text-[10px] transition-all ${
                                      usr.isCurrentUser 
                                        ? 'bg-cyan-500/10 border-l-2 border-cyan-400 font-extrabold' 
                                        : 'hover:bg-white/[0.02]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-4.5 font-bold text-slate-500 text-center">
                                        {usr.rank === 1 ? '🥇' : usr.rank === 2 ? '🥈' : usr.rank === 3 ? '🥉' : usr.rank}
                                      </span>
                                      <img 
                                        src={usr.avatar} 
                                        alt="Avatar" 
                                        className="w-5.5 h-5.5 rounded-full object-cover border border-white/10" 
                                      />
                                      <span className="truncate text-slate-200">{usr.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="text-[8px] text-slate-400 font-semibold">{usr.role}</span>
                                      <span className="text-cyan-300 font-black">{usr.xp} XP</span>
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standard Navigation Links & Sign Out Action Area */}
                      <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            onNavClick('dashboard');
                            setShowDropdown(false);
                          }}
                          className="text-[10px] font-black uppercase text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Trophy className="w-3.5 h-3.5" /> My Dashboard
                        </button>

                        <button
                          onClick={() => {
                            onNavClick('login');
                            setShowDropdown(false);
                          }}
                          className="text-[10px] font-black uppercase text-[#06b6d4] hover:underline flex items-center gap-1"
                        >
                          <User className="w-3.5 h-3.5" /> Passport Edit
                        </button>

                        <button
                          onClick={() => {
                            onLogout();
                            setShowDropdown(false);
                          }}
                          className="py-1 px-3 bg-rose-950/20 text-rose-300 hover:bg-rose-900/30 border border-rose-500/20 rounded-xl text-[9px] uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <LogOut className="w-3" /> system Sign out
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <button
              onClick={() => onNavClick('login')}
              className={`cursor-pointer px-5 py-2 rounded-md transition-all text-xs tracking-wider ${
                currentView === 'login'
                  ? 'bg-orange-500 text-white font-extrabold shadow-md'
                  : 'bg-slate-900 text-white hover:bg-orange-500 hover:text-white'
              }`}
            >
              Login/Signup
            </button>
          )}
        </nav>
      </header>

      {/* Login / Sign Up Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white relative">
              <h3 className="text-lg font-bold tracking-wide">
                {isSignUp ? 'Create your Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {isSignUp ? 'Join the Urban Nest Realty residential community today' : 'Access your dashboard, search logs & guides'}
              </p>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {isSignUp && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="terms" required className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <label htmlFor="terms" className="text-xs text-gray-500 select-none">
                    I accept the terms & residential agreements
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors text-sm uppercase tracking-wide mt-4"
              >
                {isSignUp ? 'Sign Up' : 'Log In'}
              </button>

              <div className="text-center pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  {isSignUp 
                    ? 'Already have an account? Log In' 
                    : "Don't have an account yet? Create one"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real-time floating XP points toast popups (Aesthetic masterpiece of feedback!) */}
      {floatingXPToast?.visible && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-950/95 border border-cyan-400/40 shadow-[0_20px_50px_rgba(6,182,212,0.3)] animate-fadeIn max-w-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-amber-500 flex items-center justify-center text-slate-900 font-extrabold text-xs shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            {floatingXPToast.amount}
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-black uppercase text-cyan-300 tracking-wider leading-none">
              {floatingXPToast.txt}
            </h5>
            {floatingXPToast.details && (
              <p className="text-[10px] text-slate-200 mt-1 font-bold leading-normal">
                {floatingXPToast.details}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

