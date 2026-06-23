import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  FileCheck,
  FolderLock,
  Scale,
  Files,
  Stamp,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout
} from '../workspaceAuth';

interface FormalitiesStep {
  id: string;
  stepNumber: number;
  title: string;
  shortDesc: string;
  details: string;
  icon: React.ReactNode;
}

interface AskViewProps {
  onBackToHome: () => void;
}

export default function AskView({ onBackToHome }: AskViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    message: '',
    agreeNewsletter: true
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [sheetsSuccess, setSheetsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setSheetsError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
      }
    } catch (err: any) {
      console.error(err);
      setSheetsError(err?.message || "Google Authentication failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    's-1': false,
    's-2': false,
    's-3': false,
    's-4': false,
    's-5': false,
  });

  const steps: FormalitiesStep[] = [
    {
      id: 's-1',
      stepNumber: 1,
      title: 'Title Deed Verification',
      shortDesc: 'Confirming pristine property owner status.',
      details: 'Obtain historical deeds tracing ownership back 30 years. Inspect for legal inheritance codes, gift transfers, or absolute title partitions of the sellers.',
      icon: <FileCheck className="w-5 h-5 text-amber-600" />
    },
    {
      id: 's-2',
      stepNumber: 2,
      title: 'Search for Encumbrance Certificate',
      shortDesc: 'Ensure no existing bank mortgages or liability liens.',
      details: 'Apply at the municipal sub-registrar headquarters. This certificate proves the property carries zero outstanding secondary financial debt plans or mortgages.',
      icon: <FolderLock className="w-5 h-5 text-amber-600" />
    },
    {
      id: 's-3',
      stepNumber: 3,
      title: 'RERA Registration Verification',
      shortDesc: 'Validate town planning legal authorization.',
      details: 'Check if the developer project is duly filed under RERA guidelines. Unregistered major structures are prone to regulatory stops or demolition alerts.',
      icon: <Scale className="w-5 h-5 text-amber-600" />
    },
    {
      id: 's-4',
      stepNumber: 4,
      title: 'Draft Sale Agreement & Conveyance',
      shortDesc: 'Lay down payment timelines & possession terms.',
      details: 'Work with a qualified real estate lawyer. Expressly define penalty clauses for developer delays, complete specifications list, and down payments.',
      icon: <Files className="w-5 h-5 text-amber-600" />
    },
    {
      id: 's-5',
      stepNumber: 5,
      title: 'Stamp Duty payment & Registration',
      shortDesc: 'Pay regional tax to record title transfer.',
      details: 'Coordinate regional stamp duty papers. Submit deeds to the regional sub-registrar to officially transfer the municipal plot index into your legal custody.',
      icon: <Stamp className="w-5 h-5 text-amber-600" />
    }
  ];

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your Name, Email, and Message before sending.");
      return;
    }

    setSheetsError(null);
    setSheetsSuccess(false);

    let token = getAccessToken();
    if (!token) {
      try {
        const result = await googleSignIn();
        if (result) {
          token = result.accessToken;
          setGoogleUser(result.user);
        }
      } catch (authErr: any) {
        console.error("Google Sheets authentication error:", authErr);
      }
    }

    if (token) {
      try {
        const spreadsheetId = '1N4yT8snirbYUM0Qo8gUb81dv0N_eytOlXfZEKWhIXYc';
        const range = 'contact us'; // target sheet tab name
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            values: [
              [
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), // Indian Standard Time / Timestamp
                formData.name,
                formData.number || "Not Provided",
                formData.email,
                formData.message,
                formData.agreeNewsletter ? "Yes" : "No"
              ]
            ]
          })
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Server error code ${response.status}`);
        }

        setSheetsSuccess(true);
      } catch (err: any) {
        console.error("Failed to sync to Google Sheet:", err);
        setSheetsError(`Google Sheet submission failed: ${err.message}.`);
      }
    } else {
      console.warn("Submitting locally - Google Sheets authentication missing.");
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        number: '',
        email: '',
        message: '',
        agreeNewsletter: true
      });
      // Do not clear sheetsSuccess and sheetsError immediately to let the user see them
    }, 5000);
  };

  const faqs = [
    // Nagpur property questions
    {
      q: "How many properties are available for sale in Nagpur?",
      a: "There are currently over 4,500+ residential and commercial properties listed for sale in Nagpur across popular areas like Manish Nagar, Besa, Wardha Road, and Dharampeth."
    },
    {
      q: "How many properties are available for rent in Nagpur?",
      a: "Over 2,200+ properties of varying types including standard 1 BHK, spacious 2 BHK, 3 BHK apartments, and modern commercial offices are cataloged in our system for monthly rent."
    },
    {
      q: "What is the average price per sq.ft for a property in Nagpur?",
      a: "The average rate ranges between ₹3,800 to ₹7,500 per sq.ft, depending highly on the locality (e.g. from more affordable options in Hingna and Hudkeshwar to premium clusters in Dharampeth and Ramdaspeth)."
    },
    {
      q: "What is the year on year trend for property rates in Nagpur?",
      a: "Nagpur real estate has witnessed a steady year-on-year appreciation of approximately 6% to 10%, driven mainly by extensive infrastructure growth, Metro transit expansions, and the expanding MIHAN SEZ logistics hubs."
    },
    {
      q: "What are the top projects in Nagpur?",
      a: "Some of the premier township residential developments in Nagpur include Godrej Anandam, Mahindra Bloomdale, Vrindavan Township, Pyramids City, and key projects near Wardha Road."
    },
    // General formalities questions
    {
      q: "What formalities are critical before purchasing a property in Navi Mumbai?",
      a: "It is essential to secure the 30-year registered Title Deed chain, request an official Encumbrance Certificate (EC) from the sub-registrar office, and cross-examine the project's unique RERA registration registry numbers to ensure legal clearance."
    },
    {
      q: "What is RERA and what protection does it give me?",
      a: "RERA represents the Real Estate Regulatory Authority. It is a strict municipal and state mandate ensuring absolute project timeline deliveries, escrow ledger transparency, builder accountability, and predefined penalty rates for completion delays."
    },
    {
      q: "What is the recommended budget allocation for secondary stamp registration charges?",
      a: "Depending on state guidelines, set aside 5% to 7% of your total property valuation for stamp duty, plus standard sub-registrar handling fees (approx. 1% or fixed capped fees) to safely capture title ownership."
    },
    {
      q: "Are standard rental agreements chemically notarized or digitally registered?",
      a: "Residential rent alignments under 11 months can be quickly signed on certified stamp papers. Lengthier lease covenants require official digital registration on federal portal directories to enforce tenant-owner rights."
    }
  ];

  const displayedFaqs = showAllFaqs ? faqs : faqs.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 select-none space-y-12">
      
      {/* Back navigation bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-500 transition-colors uppercase cursor-pointer"
        >
          <Home className="w-4 h-4" /> Back to Home
        </button>
        <span className="text-xs font-black text-gray-400 tracking-widest uppercase">
          Urban Nest Consult System
        </span>
      </div>

      {/* SECTION: Contact US Form (Faithfully match screenshot layout) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-6 gap-3">
          <div className="border-l-4 border-amber-500 pl-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              Contact US
            </h2>
          </div>
          {/* Breadcrumbs matching layout */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold select-none">
            <button 
              onClick={onBackToHome}
              className="text-gray-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-350">/</span>
            <span className="text-slate-800 font-extrabold">Contact</span>
          </div>
        </div>

        {/* Subtitle intro paragraph */}
        <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed mb-8 max-w-4xl">
          We're here to help you with all your real estate needs! Whether you're looking to buy your dream home, sell your property, or have questions about the market, our team is ready to assist you.
        </p>

        {/* Main Two-Column Layout (Form vs Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form fields column */}
          <div className="lg:col-span-8">
            {formSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-xl flex flex-col items-center text-center gap-3"
              >
                <CheckCircle2 className="w-14 h-14 text-emerald-600 animate-bounce" />
                <h4 className="text-lg font-black">Message Sent Successfully!</h4>
                <p className="text-xs font-semibold max-w-md">
                  Thank you for reaching out to us. One of our dedicated experts from Kharghar property branch will register your request and call you shortly.
                </p>
                <button
                  onClick={onBackToHome}
                  className="mt-2 text-xs font-black text-emerald-700 bg-white border border-emerald-200 px-4 py-2 rounded-md hover:bg-emerald-50"
                >
                  Return to Home
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name and Number on first row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white border border-gray-300 text-slate-800 text-xs sm:text-sm font-semibold rounded px-4 py-3 focus:outline-none focus:border-amber-500 w-full placeholder-gray-400"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Your Number"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="bg-white border border-gray-300 text-slate-800 text-xs sm:text-sm font-semibold rounded px-4 py-3 focus:outline-none focus:border-amber-500 w-full placeholder-gray-400"
                  />
                </div>

                {/* Email row */}
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white border border-gray-300 text-slate-800 text-xs sm:text-sm font-semibold rounded px-4 py-3 focus:outline-none focus:border-amber-500 w-full placeholder-gray-400"
                    required
                  />
                </div>

                {/* Message row */}
                <div>
                  <textarea 
                    rows={6}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-white border border-gray-300 text-slate-800 text-xs sm:text-sm font-semibold rounded px-4 py-3 focus:outline-none focus:border-amber-500 w-full placeholder-gray-400 resize-none"
                    required
                  />
                </div>

                {/* Checkbox row */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input 
                    type="checkbox" 
                    id="agreeNewsletter"
                    checked={formData.agreeNewsletter}
                    onChange={(e) => setFormData({...formData, agreeNewsletter: e.target.checked})}
                    className="mt-1 accent-[#0E1F35]"
                  />
                  <label htmlFor="agreeNewsletter" className="text-[11px] sm:text-xs font-bold text-slate-700 leading-snug cursor-pointer select-none">
                    I Signup to receive promotional, transactional notification on sms, mails and whatsapp messages.
                  </label>
                </div>

                {/* Centered Send Button at bottom */}
                <div className="pt-4 flex flex-col items-center gap-2">
                  <button
                    type="submit"
                    className="bg-black hover:bg-orange-600 hover:shadow-md text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-10 py-3.5 rounded transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                  {sheetsSuccess && (
                    <p className="text-[11px] font-bold text-emerald-600 animate-pulse">
                      ✓ Message synchronized in real-time to "contact us" sheet.
                    </p>
                  )}
                  {sheetsError && (
                    <p className="text-[11px] font-bold text-rose-500">
                      ⚠️ Status: {sheetsError}
                    </p>
                  )}
                </div>

              </form>
            )}
          </div>

          {/* Sidebar/contact elements */}
          <div className="lg:col-span-4 space-y-8 pl-0 lg:pl-6 pt-2">
            
            {/* Say Hello Section */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center text-slate-800 bg-slate-50 shrink-0">
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#0D1F34]">Say Hello</h4>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  Email. <span className="text-slate-800 font-extrabold select-all">info@ghar-lelo.com</span>
                </p>
              </div>
            </div>

            {/* Find us in Section */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center text-slate-800 bg-slate-50 shrink-0">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#0D1F34]">Find us in</h4>
                <p className="text-xs sm:text-sm font-bold text-gray-500 leading-relaxed">
                  Kharghar,<br />Navi Mumbai.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SECTION: Interactive, High-Performance FAQ Accordion */}
      <div className="space-y-0 rounded-2xl border border-gray-250 overflow-hidden bg-white shadow-xs max-w-4xl mx-auto">
        {/* Styled header container matching screenshot */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2.5 select-none">
          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
            ✨
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-[#0D1F34]">
            FAQs about Nagpur
          </h3>
        </div>

        <div className="divide-y divide-gray-150 px-4 sm:px-6 select-none bg-white">
          {displayedFaqs.map((faq) => {
            const isOpen = activeFaq === faq.q;
            return (
              <div key={faq.q} className="py-4 hover:bg-slate-50/20 transition-colors px-2">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.q)}
                  className="w-full flex justify-between items-center text-left py-1 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-700 pr-4">
                    {faq.q}
                  </span>
                  <span className="shrink-0 p-0.5 text-slate-400 font-bold text-xs">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </span>
                </button>

                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pt-3 pb-1" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-500 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100/80">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle FAQs matching screenshot style */}
        <div className="flex justify-center py-4 bg-white border-t border-gray-50">
          <button
            onClick={() => setShowAllFaqs(!showAllFaqs)}
            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer select-none"
          >
            {showAllFaqs ? 'See Less' : 'See More'}
          </button>
        </div>
      </div>

      {/* SECTION: Steps Checklist representing verification guidelines */}
      <div className="bg-[#0E1F35] text-white p-6 sm:p-10 rounded-xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Formalities Timeline Checklist</span>
            <h4 className="text-xl sm:text-2xl font-extrabold mt-1">Property Purchase Legal Clearances</h4>
          </div>
          
          {/* Completion metrics */}
          <div className="shrink-0 flex items-center gap-4 bg-white/5 border border-white/10 px-5.5 py-2.5 rounded-lg">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Workflow Completed</p>
              <p className="text-sm font-extrabold text-amber-400">{completedCount} of {steps.length} steps ({progressPercent}%)</p>
            </div>
            <div className="w-10 h-10 rounded-full border-3 border-white/10 flex items-center justify-center relative overflow-hidden">
              <div 
                style={{ height: `${progressPercent}%` }} 
                className="absolute bottom-0 w-full bg-amber-400/20 transition-all duration-500" 
              />
              <span className="text-xs font-black text-amber-400 z-1">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Steps list timeline */}
        <div className="space-y-4">
          {steps.map((stp) => {
            const isChecked = checkedSteps[stp.id];
            return (
              <div 
                key={stp.id}
                onClick={() => setCheckedSteps(prev => ({ ...prev, [stp.id]: !prev[stp.id] }))}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  isChecked 
                    ? 'bg-amber-400/10 border-amber-400/40' 
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Circle icon label */}
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {stp.icon}
                  </div>

                  <div>
                    <h5 className={`text-sm font-black flex items-center gap-2 ${
                      isChecked ? 'text-amber-300 line-through' : 'text-white'
                    }`}>
                      Stage {stp.stepNumber}: {stp.title}
                    </h5>
                    <p className="text-xs text-gray-300 mt-1">{stp.shortDesc}</p>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-xl leading-relaxed">{stp.details}</p>
                  </div>
                </div>

                {/* Actions checkbox */}
                <button
                  type="button"
                  onClick={(e) => toggleCheck(stp.id, e)}
                  className={`shrink-0 px-4 py-2 text-[10px] font-bold uppercase rounded tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-amber-400 text-slate-900 font-extrabold' 
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {isChecked ? '✓ Verified' : 'Mark Verified'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400 italic font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            Disclaimer: Urban Nest Realty recommends verifying municipal codes with direct regulatory attorneys.
          </span>
          <button
            onClick={() => alert("Urban Nest Realty support advisor has been requested. We will reach you within 2 business hours.")}
            className="bg-amber-400 hover:bg-amber-500 font-black text-slate-900 text-xs px-6 py-3 rounded-lg uppercase tracking-wider scroll-smooth transition-colors flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center"
          >
            Get Attorney Call Assist <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
