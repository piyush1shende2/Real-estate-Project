import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldAlert, Check, X, Shield, Lock } from 'lucide-react';
import { getConsent, setConsent, trackAction } from '../lib/vts';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [consentStatus, setConsentStatus] = useState<'Accepted' | 'Rejected' | 'Pending'>('Pending');

  useEffect(() => {
    const current = getConsent();
    setConsentStatus(current);
    
    // Every time the website reloads, pop up the consent banner after precisely 10 seconds (10000 ms)
    const timer = setTimeout(() => {
      setShow(true);
      // Track that the privacy banner was displayed
      trackAction('Privacy Banner Displayed', 'User loaded page and centered banner automatically displayed after 10s');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleAction = (status: 'Accepted' | 'Rejected') => {
    setConsent(status);
    setConsentStatus(status);
    setShow(false);
    
    // Track consent action
    trackAction('Consent Preference Saved', `User chose ${status} cookies`);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none font-sans">
          <motion.div
            id="cookie-consent-container"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
            className="w-full max-w-md"
          >
            <div className="bg-[#0E1F35] text-white border border-slate-700/80 p-6 rounded-[28px] shadow-2xl space-y-4 text-left relative overflow-hidden backdrop-blur-md">
              
              {/* Visual ambient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-3.5 relative">
                <div className="p-2.5 bg-amber-400/10 rounded-2xl text-amber-400 shrink-0 border border-amber-400/20">
                  <Cookie className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    🍪 Cookie Intelligence Consent
                  </h3>
                  <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
                    We leverage a secure Visitor Tracking System (VTS) to tailor our Nagpur housing advisory intelligence.
                  </p>
                </div>
              </div>

              {/* Visual comparison of Accept vs Reject */}
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 space-y-2 text-[10px]">
                <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-200 uppercase tracking-wide">If You Click "Accept"</span>
                    <p className="text-slate-400 font-medium leading-normal">
                      Logs your 2-BHK/villa viewings, search budgets, and local preferences under a persistent <code className="text-amber-400 font-mono text-[9px]">visitor_id</code>. Enables personalized chat greetings with direct property recommendations when returning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-200 uppercase tracking-wide">If You Click "Reject"</span>
                    <p className="text-slate-400 font-medium leading-normal">
                      Strictly essential cookies only. Tracking is anonymized per reload—no persistent search journey linking. Chatbot acts as a generic, first-time advisor under temporary session variables.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                <button
                  id="reject-cookies-btn"
                  type="button"
                  onClick={() => handleAction('Rejected')}
                  className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs font-black uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer border border-slate-750 flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                
                <button
                  id="accept-cookies-btn"
                  type="button"
                  onClick={() => handleAction('Accepted')}
                  className="w-full bg-[#B38330] hover:bg-[#c9953b] text-white text-xs font-black uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>
              </div>

              <div className="text-[8px] text-slate-550 font-mono text-center flex items-center justify-center gap-1.5 pt-0.5">
                <ShieldAlert className="w-3 h-3 text-teal-600" />
                <span>Complies with Nagpur RERA Real Estate Privacy Codes</span>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
