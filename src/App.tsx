import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResearchInsights from './components/ResearchInsights';
import AdsSection from './components/AdsSection';
import StatsSection from './components/StatsSection';
import NeedsSection from './components/NeedsSection';
import TestimonialSection from './components/TestimonialSection';
import BuyingGuide from './components/BuyingGuide';
import Footer from './components/Footer';
import LoginView from './components/LoginView';
import AboutUs from './components/AboutUs';
import CalculatorView from './components/CalculatorView';
import PropertyDetailView from './components/PropertyDetailView';
import AskView from './components/AskView';
import BuyView from './components/BuyView';
import SellView from './components/SellView';
import RentView from './components/RentView';
import PlotsView from './components/PlotsView';
import PgCoLivingView from './components/PgCoLivingView';
import SheetsView from './components/SheetsView';
import UserDashboardView from './components/UserDashboardView';
import WhatsAppWidget from './components/WhatsAppWidget';
import AIChatbot from './components/AIChatbot';
import AdminView from './components/AdminView';
import CookieBanner from './components/CookieBanner';
import { trackAction } from './lib/vts';
import { getPropertyDetail } from './data/propertyDetailsData';
import { dispatchXPAward } from './lib/gamification';
import { BookOpen, HelpCircle, Check, DollarSign, Star, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import { TabType } from './types';

export default function App() {
  const [currentOverlay, setCurrentOverlay] = useState<'none' | 'blogs' | 'pricing' | 'login' | 'about' | 'calculator' | 'ask' | 'buy' | 'sell' | 'rent' | 'plots' | 'pgcoliving' | 'sheets' | 'admin' | 'dashboard'>('none');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [heroInitialTab, setHeroInitialTab] = useState<TabType | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string; profilePic?: string; roles?: string[] } | null>(null);

  // VTS Page View Initial Tracker and Logout-Refresh Handler
  useEffect(() => {
    trackAction('Page Opened', 'User landed on Nagpur Urban Nest dashboard console');
    
    // Check if user just logged out and page refreshed
    if (typeof window !== 'undefined' && sessionStorage.getItem('open_login_after_refresh') === 'true') {
      sessionStorage.removeItem('open_login_after_refresh');
      setCurrentOverlay('login');
    }
  }, []);

  const handleLoginSuccess = (email: string, name?: string, profilePic?: string, roles?: string[]) => {
    setIsLoggedIn(true);
    setCurrentUser({ email, name, profilePic, roles });
    setCurrentOverlay('dashboard');
    trackAction('User Login', `User logged in with email: ${email}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentOverlay('none');
    trackAction('User Logout', 'User clicked sign out');
    
    // Store flag in sessionStorage to trigger opening login page on reload
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('open_login_after_refresh', 'true');
      // Set the active login card preset to 'login' for immediate re-login
      sessionStorage.setItem('login_active_card_preset', 'login');
    }
    
    // Refresh the website
    window.location.reload();
  };

  const handleNavClick = (view: 'home' | 'blogs' | 'pricing' | 'login' | 'about' | 'calculator' | 'ask' | 'buy' | 'sell' | 'rent' | 'plots' | 'pgcoliving' | 'sheets' | 'dashboard') => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedPropertyId(null);
    if (view === 'home') {
      setCurrentOverlay('none');
    } else {
      setCurrentOverlay(view);
    }
    trackAction('Navigation Triggered', `User opened view: ${view}`);
  };

  const handleTabChangeGlobal = (tab: TabType) => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedPropertyId(null);
    if (tab === 'Buy') {
      setCurrentOverlay('buy');
    } else if (tab === 'Sell') {
      setCurrentOverlay('sell');
    } else if (tab === 'Rent') {
      setCurrentOverlay('rent');
    } else if (tab === 'Plots') {
      setCurrentOverlay('plots');
    } else if (tab === 'PG/Co-Living') {
      setCurrentOverlay('pgcoliving');
    } else {
      setHeroInitialTab(tab);
      setCurrentOverlay('none');
    }
    trackAction('Tab Overlay Switched', `User switched to property classification: ${tab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth flex flex-col justify-between">
      {/* Top Banner Header */}
      <Header 
        onNavClick={handleNavClick} 
        currentView={currentOverlay} 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Main Container */}
      <main className="flex-grow">
        {selectedPropertyId ? (
          <PropertyDetailView 
            property={getPropertyDetail(selectedPropertyId)} 
            onBackToHome={() => setSelectedPropertyId(null)} 
          />
        ) : currentOverlay === 'login' ? (
          <LoginView 
            onBackToHome={() => setCurrentOverlay('none')} 
            onAdminClick={() => setCurrentOverlay('admin')} 
            onLoginSuccess={handleLoginSuccess}
          />
        ) : currentOverlay === 'admin' ? (
          <AdminView onBackToHome={() => setCurrentOverlay('login')} />
        ) : currentOverlay === 'about' ? (
          <AboutUs onBackToHome={() => setCurrentOverlay('none')} />
        ) : currentOverlay === 'calculator' ? (
          <CalculatorView onBackToHome={() => setCurrentOverlay('none')} />
        ) : currentOverlay === 'ask' ? (
          <AskView onBackToHome={() => setCurrentOverlay('none')} />
        ) : currentOverlay === 'buy' ? (
          <BuyView 
            onBackToHome={() => setCurrentOverlay('none')} 
            onPropertyClick={(id) => {
              window.scrollTo({ top: 0, behavior: 'auto' });
              setSelectedPropertyId(id);
              dispatchXPAward('view_property');
              try {
                const prop = getPropertyDetail(id);
                if (prop) {
                  const desc = `${prop.title} in ${prop.location} (${prop.beds ? prop.beds + ' BHK ' : ''}${prop.price})`;
                  trackAction('Property Viewed', desc);
                } else {
                  trackAction('Property Viewed', `ID: ${id}`);
                }
              } catch (_) {
                trackAction('Property Viewed', `ID: ${id}`);
              }
            }}
            onTabChange={handleTabChangeGlobal}
          />
        ) : currentOverlay === 'sell' ? (
          <SellView 
            onBackToHome={() => setCurrentOverlay('none')}
            onTabChange={handleTabChangeGlobal}
          />
        ) : currentOverlay === 'rent' ? (
          <RentView
            onBackToHome={() => setCurrentOverlay('none')}
            onTabChange={handleTabChangeGlobal}
          />
        ) : currentOverlay === 'plots' ? (
          <PlotsView
            onBackToHome={() => setCurrentOverlay('none')}
            onTabChange={handleTabChangeGlobal}
          />
        ) : currentOverlay === 'pgcoliving' ? (
          <PgCoLivingView
            onBackToHome={() => setCurrentOverlay('none')}
            onTabChange={handleTabChangeGlobal}
          />
        ) : currentOverlay === 'sheets' ? (
          <SheetsView
            onBackToHome={() => setCurrentOverlay('none')}
          />
        ) : currentOverlay === 'dashboard' ? (
          <UserDashboardView 
            onBackToHome={() => setCurrentOverlay('none')}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          /* Core Home Page layout matching the layout of the screenshot */
          <div className="bg-white">
            <Hero 
              onPropertyClick={(id) => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setSelectedPropertyId(id);
                dispatchXPAward('view_property');
                try {
                  const prop = getPropertyDetail(id);
                  if (prop) {
                    const desc = `${prop.title} in ${prop.location} (${prop.beds ? prop.beds + ' BHK ' : ''}${prop.price})`;
                    trackAction('Property Viewed', desc);
                  } else {
                    trackAction('Property Viewed', `ID: ${id}`);
                  }
                } catch (_) {
                  trackAction('Property Viewed', `ID: ${id}`);
                }
              }}
              onBuySelected={() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setCurrentOverlay('buy');
                trackAction('Category Selected', 'Buy Listings tab');
              }}
              onSellSelected={() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setCurrentOverlay('sell');
                trackAction('Category Selected', 'Sell Listings tab');
              }}
              onRentSelected={() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setCurrentOverlay('rent');
                trackAction('Category Selected', 'Rent Listings tab');
              }}
              onPlotsSelected={() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setCurrentOverlay('plots');
                trackAction('Category Selected', 'Plots Listings tab');
              }}
              onPgSelected={() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setCurrentOverlay('pgcoliving');
                trackAction('Category Selected', 'Paying Guest and Co-Living tab');
              }}
              initialTab={heroInitialTab}
              onTabSelect={() => {
                setHeroInitialTab(null);
              }}
            />
            
            <ResearchInsights onCalculatorSelected={() => handleNavClick('calculator')} />
            
            <AdsSection />
            
            <StatsSection />
            
            <NeedsSection />
            
            <TestimonialSection />
            
            <BuyingGuide onAskClick={() => handleNavClick('ask')} />
          </div>
        )}
      </main>

      {/* Footer app buttons and references */}
      <Footer onAboutClick={() => handleNavClick('about')} />

      {/* Dynamic Modal Overlay for Blogs View */}
      {currentOverlay === 'blogs' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-gray-100">
            {/* Overlay Header */}
            <div className="bg-[#0E1F35] p-6 text-white flex justify-between items-center sticky top-0 z-30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-xl font-bold">Urban Nest Realty Blogs</h3>
                  <p className="text-xs text-slate-300">Tips, local analysis, and reviews from real-estate experts</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentOverlay('none')}
                className="text-white/70 hover:text-white font-bold text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Blogs content */}
            <div className="p-6 sm:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Blog Card 1 */}
                <div className="bg-slate-50 rounded-lg overflow-hidden border border-gray-100 flex flex-col justify-between p-4 shadow-sm">
                  <span className="text-[9px] bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded uppercase self-start">PG/Co-Living Guides</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2 mb-2">How to Choose a PG: Female Resident Proximity Analysis</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Evaluating why proximity of paying guest locations to technical sectors improves safety and saves commute times...</p>
                  <button 
                    onClick={() => alert("Article 'Female PG Proximity' is compiling! Available shortly.")}
                    className="mt-4 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer self-start"
                  >
                    Read article →
                  </button>
                </div>

                {/* Blog Card 2 */}
                <div className="bg-slate-50 rounded-lg overflow-hidden border border-gray-100 flex flex-col justify-between p-4 shadow-sm">
                  <span className="text-[9px] bg-blue-100 text-blue-600 font-extrabold px-2 py-0.5 rounded uppercase self-start">Legal Guides</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2 mb-2">A Complete Checklist for Buying a Plot in 2026</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">What document indexes to request from local sub-registrars and how to verify Rera registry status code...</p>
                  <button 
                    onClick={() => alert("Article 'Plot Buying Checklist' is compiling! Available shortly.")}
                    className="mt-4 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer self-start"
                  >
                    Read article →
                  </button>
                </div>

                {/* Blog Card 3 */}
                <div className="bg-slate-50 rounded-lg overflow-hidden border border-gray-100 flex flex-col justify-between p-4 shadow-sm">
                  <span className="text-[9px] bg-emerald-100 text-emerald-600 font-extrabold px-2 py-0.5 rounded uppercase self-start">Market Insights</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2 mb-2">Suburban Green Space Real Estate Valuation Gains</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Analyzing why properties within 10-minutes path to parks and public health spaces exhibit exponential growth rate indexes...</p>
                  <button 
                    onClick={() => alert("Article 'Green Space Gains' is compiling! Available shortly.")}
                    className="mt-4 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer self-start"
                  >
                    Read article →
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Modal Overlay for Pricing View */}
      {currentOverlay === 'pricing' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-gray-100">
            {/* Overlay Header */}
            <div className="bg-[#0E1F35] p-6 text-white flex justify-between items-center sticky top-0 z-30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-xl font-bold">Urban Nest Realty pricing plans</h3>
                  <p className="text-xs text-slate-300">Simple, upfront rates for landlords, tenants, and developers</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentOverlay('none')}
                className="text-white/70 hover:text-white font-bold text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Pricing tiers */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Free Plan */}
                <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-slate-800">Standard Searcher</h4>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">For basic home hunters</p>
                    <div className="mt-4 mb-5">
                      <span className="text-3xl font-black text-[#0E1F35]">$0</span>
                      <span className="text-xs text-gray-400 font-bold"> / Free forever</span>
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Browse Buy, Rent, PG listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Access Mortgage EMI calculator</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setCurrentOverlay('none')}
                    className="w-full bg-slate-900 text-white font-bold py-2 rounded text-xs uppercase mt-6 cursor-pointer hover:bg-slate-800"
                  >
                    Get Started
                  </button>
                </div>

                {/* Tenant Premium Plan */}
                <div className="border-2 border-orange-400 bg-orange-50/20 rounded-xl p-5 shadow-md flex flex-col justify-between relative">
                  <div className="absolute -top-3 right-4 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                    MOST POPULAR
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-slate-800">Prime Resident Guide</h4>
                    <p className="text-[11px] text-orange-600 font-bold mt-1">For swift local searchers</p>
                    <div className="mt-4 mb-5">
                      <span className="text-3xl font-black text-[#0E1F35]">$29</span>
                      <span className="text-xs text-gray-400 font-bold"> / One-time payment</span>
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Instant direct phone access to landlords</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Pre-compiled lease agreements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Low density area email alerts</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => alert("Prime Resident tier payment is ready to model! Proceeding shortly.")}
                    className="w-full bg-orange-600 text-white font-bold py-2 rounded text-xs uppercase mt-6 cursor-pointer hover:bg-orange-700"
                  >
                    Select Plan
                  </button>
                </div>

                {/* Developer/Investor Plan */}
                <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-slate-800">Strategic Investor</h4>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">For serious land developers</p>
                    <div className="mt-4 mb-5">
                      <span className="text-3xl font-black text-[#0E1F35]">$199</span>
                      <span className="text-xs text-gray-400 font-bold"> / billed yearly</span>
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Detailed historical Price Trends data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">2 Complete Attorney Title checks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-gray-600">Rera approval filing assistance</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => alert("Investor system package payment ready to model! Contact billing@urbannestrealty.fake")}
                    className="w-full bg-slate-900 text-white font-bold py-2 rounded text-xs uppercase mt-6 cursor-pointer hover:bg-slate-800"
                  >
                    Unlock Plan
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive WhatsApp Support Console */}
      <WhatsAppWidget />

      {/* Floating Interactive AI Chatbot Advisor */}
      <AIChatbot />

      {/* Cookie / VTS Consent Banner */}
      <CookieBanner />

    </div>
  );
}
