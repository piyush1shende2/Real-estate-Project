import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Trash2, ArrowRight, Settings, RotateCcw, ShieldAlert, Cpu, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dispatchXPAward } from '../lib/gamification';
import { getPersonalizedGreetingContext, trackAction, getConsent } from '../lib/vts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Connection and browser diagnostics states
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor connection changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Bot settings and cache states
  const [showSettings, setShowSettings] = useState(false);
  const [persona, setPersona] = useState<'professional' | 'friendly' | 'precise'>('professional');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Speech to Text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Nagpur real estate is set in Indian location, using en-IN maximizes accuracy

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? prev + ' ' : '') + transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setResetSuccessMessage("🎙️ Microphone access denied! Please authorize microphone permission in browser. 🔐");
          setTimeout(() => setResetSuccessMessage(null), 5000);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Clean up safely
        }
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResetSuccessMessage("🎙️ Speech Recognition is not supported on this browser. Try Google Chrome! 🌐");
      setTimeout(() => setResetSuccessMessage(null), 5000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Speech session conflict, creating dynamic instance:", e);
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-IN';
          rec.onstart = () => setIsListening(true);
          rec.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) setInputValue((prev) => (prev ? prev + ' ' : '') + transcript);
          };
          rec.onerror = (event: any) => {
            setIsListening(false);
            if (event.error === 'not-allowed') {
              setResetSuccessMessage("🎙️ Microphone access denied! Please authorize mic permission. 🔐");
              setTimeout(() => setResetSuccessMessage(null), 5000);
            }
          };
          rec.onend = () => setIsListening(false);
          recognitionRef.current = rec;
          rec.start();
        } catch (err) {
          console.error("Failed to recover speech instance:", err);
        }
      }
    }
  };

  // Load history and settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('nestbot_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.persona) setPersona(parsed.persona);
        if (typeof parsed.temperature === 'number') setTemperature(parsed.temperature);
      }

      const saved = localStorage.getItem('nestbot_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Welcoming message with optional personalization context if consent accepted
        const interest = getPersonalizedGreetingContext();
        let welcomeText = "Namaste! 🙏 I am NestBot, your AI Real Estate Advisor. How can I help you navigate Nagpur properties, investments, RERA checks, or calculate your home finances today?";
        if (interest) {
          welcomeText = `Namaste! 🙏 Welcome back to Urban Nest! I see you were interested in properties matching details like: "${interest}". Would you like me to find similar premium listings in Nagpur or verify their RERA eligibility today? 🏡✨`;
        }

        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: welcomeText,
            timestamp: new Date()
          }
        ]);
      }
    } catch (e) {
      console.error("Failed to load chat history/settings", e);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nestbot_settings', JSON.stringify({ persona, temperature }));
  }, [persona, temperature]);

  // Save history to localStorage and update Admin Dashboard live streams
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('nestbot_chat_history', JSON.stringify(messages));

      try {
        const storedSessions = localStorage.getItem('nest_chatbot_sessions');
        let sessions = storedSessions ? JSON.parse(storedSessions) : [];
        
        // Only log to the admin panel if there is active dialog past the default welcome note
        const hasInteractiveContent = messages.length > 1;
        if (hasInteractiveContent) {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          const index = sessions.findIndex((s: any) => s.id === 'active_session');
          const sessionObj = {
            id: 'active_session',
            name: 'Live Chat (Website Visitor)',
            persona,
            messagesCount: messages.length,
            lastUpdated: formattedDate,
            messages: messages.map(m => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date(m.timestamp).toISOString()
            }))
          };

          if (index >= 0) {
            sessions[index] = sessionObj;
          } else {
            sessions.unshift(sessionObj);
          }
          localStorage.setItem('nest_chatbot_sessions', JSON.stringify(sessions));
        }
      } catch (err) {
        console.warn('Could not sync chat session with Admin Workspace:', err);
      }
    }
  }, [messages, persona]);

  // Scroll to bottom when messages or open state changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInputValue('');
    }

    const newUserMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    // Award XP for chatting with AI (gamification Phase 1)
    dispatchXPAward('chat_with_ai');
    trackAction('AI Chat Search', `User queried NestBot: "${text}"`);

    // If browser is detected as offline, handle offline response immediately without remote payload
    if (!isOnline) {
      setTimeout(() => {
        const offlineResponse: Message = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: "⚠️ Internet Disconnected: You appear to be offline. NestBot is unable to query the AI Model. However, you can still use our local Home Loan, Rent vs Buy, ROI, and Capital Gain calculators in the top tabs entirely offline!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, offlineResponse]);
      }, 600);
      return;
    }

    setIsLoading(true);

    try {
      const payloadMessages = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: payloadMessages,
          persona,
          temperature,
          interestsDetail: getPersonalizedGreetingContext()
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error status');
      }

      const data = await res.json();
      
      const newBotMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.reply || "I'm sorry, I am having trouble retrieving details right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chatbot connection failure:", error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: "🔌 Connectivity Issue: We couldn't reach the NestBot server. Please: \n1. Double-check your local or cellular Wi-Fi. \n2. In local development, verify your Node server is running on port 3000. \n3. Ensure GEMINI_API_KEY is configured in your project parameters! \n(Calculators inside the app tabs remain 100% usable offline)",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Chat history cleared! Welcome back. How can I assist you in your Nagpur home search or dynamic calculations now?",
        timestamp: new Date()
      }
    ]);
    localStorage.removeItem('nestbot_chat_history');
    
    // Trigger temporary visual toast banner for clear
    setResetSuccessMessage("Chat conversation history has been cleared! ✨");
    setTimeout(() => {
      setResetSuccessMessage(null);
    }, 4000);
  };

  const handleFullReset = () => {
    // Clear local states immediately
    setPersona('professional');
    setTemperature(0.7);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "System successfully reset! Conversational history, personalized preferences, and local systems cookies/cache have been wiped clean. How can I assist you with Nagpur real estate now?",
        timestamp: new Date()
      }
    ]);

    // Complete cache storage purging
    localStorage.removeItem('nestbot_chat_history');
    localStorage.removeItem('nestbot_settings');
    localStorage.removeItem('workspace_access_token');
    localStorage.removeItem('workspace_token_timestamp');
    localStorage.removeItem('workspace_google_user');

    // Trigger a temporary visual confirmation toast banner
    setResetSuccessMessage("All chatbot settings, conversations, and systems cache successfully wiped clean! ✨");
    setTimeout(() => {
      setResetSuccessMessage(null);
    }, 5000);

    setShowSettings(false);
  };

  const quickPrompts = [
    "Recommend direct owner rentals",
    "How does the Home Loan calculator work?",
    "Explain the RERA title checklist?",
    "What is Urban Nest Realty?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div 
        id="ai-chatbot-btn-container"
        className={`fixed bottom-[92px] right-6 z-40 select-none font-sans transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <button
          id="ai-chatbot-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer border border-[#0E1F35]/15 flex items-center justify-center relative bg-[#0E1F35] hover:bg-[#b38330]"
          aria-label="AI Real Estate Assistant"
        >
          <div className="relative text-white">
            <Bot className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
        </button>
      </div>

      {/* Slide-out Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Elegant Translucent Backdrop covering the whole viewport */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-50 cursor-pointer"
            />

            {/* Slide-out Full-height Right Side Panel */}
            <motion.div
              id="ai-chatbot-panel"
              initial={{ x: '100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col font-sans border-l border-slate-100 sm:rounded-l-[32px] overflow-hidden text-[#0E1F35]"
            >
              {/* Close Button on top right */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0E1F35] transition-colors cursor-pointer z-50"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Chat Session Content (scrollable) */}
              <div className="flex-grow overflow-y-auto px-6 sm:px-10 pt-20 pb-6 flex flex-col justify-between min-h-0">
                
                {/* 1. Header Logo Visual inside scrolling content */}
                {!showSettings && (
                  <div className="flex flex-col items-start gap-1 pb-2 animate-fadeIn shrink-0">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center select-none shadow-md mb-2 border border-slate-100 p-2.5">
                      <svg 
                        viewBox="0 0 120 220" 
                        className="w-full h-full"
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
                  </div>
                )}

                {/* Reset or Settings Success Toast Banner */}
                {resetSuccessMessage && (
                  <div className="mb-4 bg-emerald-500 text-slate-950 text-[11px] font-extrabold tracking-wide px-4 py-3 rounded-xl flex items-center gap-1.5 animate-pulse text-left select-none shrink-0">
                    <span>✨</span>
                    <span>{resetSuccessMessage}</span>
                  </div>
                )}

                {showSettings ? (
                  /* Settings / Advisor config Panel */
                  <div className="space-y-6 flex-grow overflow-y-auto pr-1 animate-fadeIn text-[#0E1F35]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0E1F35]">Advisor configurations</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Nestbot AI Persona & Settings</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSettings(false)}
                        className="text-[10px] font-black uppercase tracking-wider text-[#b38330] hover:text-[#0E1F35] py-1 px-3 bg-amber-500/10 border border-[#b38330]/20 rounded-xl cursor-pointer transition-colors"
                      >
                        Back to Chat
                      </button>
                    </div>

                    {/* Advisor Persona CHOICE */}
                    <div className="space-y-2 text-left">
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400">
                        Advisor Tone & Language Style
                      </label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPersona('professional')}
                          className={`w-full p-4.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-center gap-1 ${
                            persona === 'professional'
                              ? 'bg-amber-500/10 border-[#b38330] text-[#0E1F35] ring-1 ring-[#b38330]/20'
                              : 'bg-slate-50 border-slate-150 text-slate-600 hover:text-[#0E1F35] hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black tracking-tight text-[#0E1F35] flex items-center gap-1.5">
                            💼 Professional Advisor
                          </span>
                          <span className="text-[10px] opacity-75 leading-relaxed font-semibold">
                            Detailed real-estate analysis, RERA criteria checks, and finance logic.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPersona('friendly')}
                          className={`w-full p-4.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-center gap-1 ${
                            persona === 'friendly'
                              ? 'bg-amber-500/10 border-[#b38330] text-[#0E1F35] ring-1 ring-[#b38330]/20'
                              : 'bg-slate-50 border-slate-150 text-slate-600 hover:text-[#0E1F35] hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black tracking-tight text-[#0E1F35] flex items-center gap-1.5">
                            🤝 Friendly & Enthusiastic
                          </span>
                          <span className="text-[10px] opacity-75 leading-relaxed font-semibold">
                            Warm and cheerful guide language. Highly welcoming for first-time buyers.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPersona('precise')}
                          className={`w-full p-4.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-center gap-1 ${
                            persona === 'precise'
                              ? 'bg-amber-500/10 border-[#b38330] text-[#0E1F35] ring-1 ring-[#b38330]/20'
                              : 'bg-slate-50 border-slate-150 text-slate-600 hover:text-[#0E1F35] hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black tracking-tight text-[#0E1F35] flex items-center gap-1.5">
                            ⚡ Precise & Crisp
                          </span>
                          <span className="text-[10px] opacity-75 leading-relaxed font-semibold">
                            Straightforward facts and minimal commentary to keep decisions crisp.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Model Temp slider */}
                    <div className="space-y-2 text-left pb-4 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                          Model Creativity Level
                        </label>
                        <span className="text-[9px] font-mono text-[#b38330] font-black bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {temperature === 0.2 ? '0.2 (Focused)' : temperature === 0.7 ? '0.7 (Balanced)' : '1.2 (Creative)'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.2"
                        step="0.5"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-[#b38330] focus:outline-none"
                      />
                      <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase tracking-widest px-0.5">
                        <span>Focused</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    {/* Connection Status and Wipe cache */}
                    <div className="space-y-3 pt-2 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                          System Diagnostic status
                        </label>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wide flex items-center gap-1 leading-none ${
                          isOnline 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                          {isOnline ? 'Active Connection' : 'Checking connection'}
                        </span>
                      </div>

                      <div className="bg-rose-50/50 rounded-2xl p-4.5 border border-rose-100 space-y-3.5">
                        <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-rose-800">Dangerous Actions</h4>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="block text-xs font-black text-rose-900 leading-tight">Clear logs</span>
                            <span className="block text-[9.5px] text-rose-600 mt-0.5 leading-tight">Erase conversation history from this browser cache.</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleClear}
                            className="py-1.5 px-3 bg-white border border-rose-200 hover:bg-rose-105 hover:border-rose-300 text-rose-600 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors shrink-0"
                          >
                            Clear Chat
                          </button>
                        </div>
                        <div className="h-px bg-rose-200/40" />
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="block text-xs font-black text-rose-900 leading-tight">Complete Wipe</span>
                            <span className="block text-[9.5px] text-rose-600 mt-0.5 leading-tight">Purge personalized parameters, logs and cloud tokens.</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleFullReset}
                            className="py-1.5 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors shrink-0 shadow-xs"
                          >
                            Full Wipe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard interactive message logs block */
                  <div className="flex-grow flex flex-col justify-end min-h-0">
                    <div className="space-y-4 overflow-y-auto pr-1 flex-grow mb-4 scroll-smooth">
                      {messages.map((msg) => {
                        const isBot = msg.role === 'assistant';
                        return (
                          <div 
                            key={msg.id}
                            className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-sm sm:text-[15px] leading-relaxed relative ${
                                isBot 
                                  ? 'bg-[#F4F7FE] text-slate-800 rounded-tl-none font-bold text-left border border-slate-100' 
                                  : 'bg-[#0E1F35] text-white rounded-tr-none font-bold text-left shadow-sm'
                              }`}
                            >
                              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                              <div className="flex justify-between items-center mt-2.5 opacity-50 select-none text-[8.5px] sm:text-[9.5px] font-sans">
                                <span className="font-extrabold tracking-wider uppercase">{isBot ? 'Nestbot' : 'You'}</span>
                                <span>
                                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isLoading && (
                        <div className="flex gap-3 justify-start animate-pulse">
                          <div className="bg-[#F4F7FE] text-[#0E1F35]/70 max-w-[80%] rounded-2xl rounded-tl-none px-5 py-3.5 text-xs leading-none flex items-center gap-1.5 border border-slate-100">
                            <span className="font-extrabold uppercase tracking-widest text-[9px]">Analyzing</span>
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E1F35] animate-bounce delay-75"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E1F35] animate-bounce delay-150"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E1F35] animate-bounce delay-300"></span>
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick topic buttons formatted exactly like the requested image */}
                    {messages.length <= 1 && !isLoading && (
                      <div className="pt-4 pb-2 select-none border-t border-slate-100 text-left shrink-0">
                        <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider mb-2.5">Suggested Questions</span>
                        <div className="flex flex-wrap gap-2">
                          {quickPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(prompt)}
                              className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0E1F35] border border-slate-200 hover:border-[#0E1F35]/40 rounded-full px-4.5 py-2 cursor-pointer transition-all font-semibold shadow-xs"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bot footer inputs aligned beautifully */}
              {!showSettings ? (
                <div className="bg-white border-t border-slate-100 px-6 sm:px-10 py-5 shrink-0 z-10">
                  <div className="flex items-center justify-between mb-3 px-1 select-none">
                    <button
                      type="button"
                      onClick={() => setShowSettings(true)}
                      className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 hover:text-[#b38330] flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Configure Settings & Tone</span>
                    </button>
                    {messages.length > 1 && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3 h-3 stroke-[2.5]" />
                        <span>Clear History</span>
                      </button>
                    )}
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      required={!isListening}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isListening ? "Listening... Speak or ask Nestbot 🎙️" : "Type a message or real estate query..."}
                      disabled={isLoading}
                      className="w-full bg-[#f1f4fb] focus:bg-white border border-[#f1f4fb] focus:border-[#E0E7FF] focus:ring-1 focus:ring-[#EEF2FF] rounded-2xl py-3.5 pl-4 pr-24 text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50 font-medium transition-all"
                    />
                    <div className="absolute right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        disabled={isLoading}
                        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                          isListening 
                            ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0E1F35]'
                        }`}
                        title={isListening ? "Listening... Tap to stop" : "Use Voice Input (Speech to Text)"}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || (!inputValue.trim() && !isListening)}
                        className="p-2 rounded-xl bg-[#0E1F35] text-white hover:bg-[#b38330] disabled:opacity-20 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 border-t border-slate-100 px-6 sm:px-10 py-5 shrink-0 text-center text-[10px] font-black text-slate-400 select-none uppercase tracking-widest">
                  Settings Mode • Systems Configurations Live
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
