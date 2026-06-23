import React from 'react';
import { ArrowLeft, Star, Heart, FileCheck, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

// Import local generated images
// @ts-ignore
import aboutTeamLeader from '../assets/images/about_team_leader_1779451835753.png';
// @ts-ignore
import aboutLuxuryVilla from '../assets/images/about_luxury_villa_1779451851413.png';
// @ts-ignore
import aboutLegalPartner from '../assets/images/about_legal_partner_1779451870920.png';
// @ts-ignore
import aboutAdvisorWoman from '../assets/images/about_advisor_woman_1779451887664.png';

interface AboutUsProps {
  onBackToHome: () => void;
}

export default function AboutUs({ onBackToHome }: AboutUsProps) {
  return (
    <div className="bg-[#FDFDFD] min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Container to restrict max width */}
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <button 
            onClick={onBackToHome}
            className="group flex items-center gap-3 text-sm font-bold text-[#0E1F35] hover:text-amber-600 transition-colors cursor-pointer"
          >
            <span className="flex items-center justify-center p-2 rounded-full bg-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
              <ArrowLeft className="w-4.5 h-4.5" />
            </span>
            Back to Properties
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wide uppercase">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-700">About Us</span>
          </div>
        </div>

        {/* Main Title Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Core Values & Legacy
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0E1F35] tracking-tight font-serif">
            About Us
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
            Discover the team, company structure, and uncompromising pillars of governance that have made Urban Nest Realty the region's trusted home search partner.
          </p>
        </div>

        {/* Section 1: Team Leader Portrait & Info (Name) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-5 w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] relative overflow-hidden bg-slate-50 border-r border-slate-50">
              <img
                src={aboutTeamLeader}
                alt="Vikram Malhotra - Team Leader"
                className="absolute inset-0 w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#0E1F35]/95 text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Founder & Visionary
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
              <div className="space-y-1">
                <span className="text-amber-600 text-xs font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md">
                  Leadership
                </span>
                <h3 className="text-2.5xl sm:text-3.5xl font-black text-[#0E1F35] tracking-tight pt-1">
                  Vikram Malhotra
                </h3>
              </div>
              <div className="space-y-4 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed font-normal">
                <p>
                  Vikram Malhotra founded Urban Nest Realty in 2021 with a singular objective: to turn the daunting journey of finding a home into an inspiring, seamless experience. With over fifteen years of hand-on expertise in elite residential circles and a deep-seated vision, Vikram brings an unparalleled standard of commitment to our buyers, guiding families safely toward finding their premium dwellings.
                </p>
                <p>
                  Under Vikram's leadership, the company has transformed from a boutique consultancy into a highly trusted digital real-estate platform. He believes that a home is more than just square footage—it is the direct anchor of a family's safety, generational growth, and peaceful well-being.
                </p>
                <p>
                  By integrating real-time market charts, strict regulatory index clearances, and dedicated guidance agents, Vikram continues to build a high-fidelity workspace where trust meets technology.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-[#0E1F35] font-bold text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                  <Trophy className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <span>Curator of Elite Standards since 2021</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Company Profile & Luxury House Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Content Column (Appears left on desktop) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 order-2 lg:order-1 flex flex-col justify-center space-y-5">
              <div className="space-y-1">
                <span className="text-sky-600 text-xs font-black uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-md">
                  Our Directory
                </span>
                <h3 className="text-2.5xl sm:text-3.5xl font-black text-[#0E1F35] tracking-tight pt-1">
                  The Company
                </h3>
              </div>
              <div className="space-y-4 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed font-normal">
                <p>
                  Urban Nest Realty is a premier residential property directory holding premium clearances and direct partnerships with high-tier developers. We focus on curating elite estates, modern luxury villas, and smart workspaces, matching prospective homebuyers with certified high-value real estate. Our platform empowers both buyers and investors through comprehensive real-time trends, pre-cleared legal parameters, and streamlined mortgage planning calculators.
                </p>
                <p>
                  Our database features handpicked premium properties that exhibit superb construction ratings, structural index grades, and exceptional accessibility profiles. We bridge the gap between discerning investors and safe real estate acquisitions with total absolute fidelity.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-[#0E1F35] font-bold text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                  <Star className="w-4.5 h-4.5 text-sky-500" />
                </div>
                <span>Vetted Listings & Seamless Closures</span>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] relative overflow-hidden bg-slate-50 border-l border-slate-50 order-1 lg:order-2">
              <img
                src={aboutLuxuryVilla}
                alt="Modern Luxury Villa Portfolio"
                className="absolute inset-0 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-[#0E1F35]/95 text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Premium Real Estate
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Culture & Commitment Image & Text */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-5 w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] relative overflow-hidden bg-slate-50 border-r border-slate-50">
              <img
                src={aboutLegalPartner}
                alt="Rigorous Compliance Director"
                className="absolute inset-0 w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#0E1F35]/95 text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Compliance & Security
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
              <div className="space-y-1">
                <span className="text-emerald-700 text-xs font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                  Governance
                </span>
                <h3 className="text-2.5xl sm:text-3.5xl font-black text-[#0E1F35] tracking-tight pt-1">
                  Culture & Commitment
                </h3>
              </div>
              <div className="space-y-4 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed font-normal">
                <p>
                  Our organizational culture is anchored in absolute compliance, structural integrity, and long-term buyer security. Every agent in our workspace operates with rigorous discipline, ensuring every listing undergoes continuous validation, title clearings, land registries, and legal compliance checks.
                </p>
                <p>
                  We are committed to delivering risk-free access to prospective properties, guaranteeing that what you see online is exactly what you get when you step foot inside. For our team, every client relationship is built on the foundations of mutual respect, timely response, and lifetime advocacy.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-[#0E1F35] font-bold text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <span>Certified Title Checks & Legal Safety Guarantee</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Professionalism Image & Text */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Content Column (Appears left on desktop) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 order-2 lg:order-1 flex flex-col justify-center space-y-5">
              <div className="space-y-1">
                <span className="text-indigo-600 text-xs font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-md">
                  Excellence
                </span>
                <h3 className="text-2.5xl sm:text-3.5xl font-black text-[#0E1F35] tracking-tight pt-1">
                  Professionalism
                </h3>
              </div>
              <div className="space-y-4 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed font-normal">
                <p>
                  Professionalism is our core signature. Our advisors translate dense housing trends, legal regulations, and transaction papers into simple, easy-to-follow actions. From your first click on our search terminal to signing your property deeds, a dedicated partner is constantly with you ensuring an elevated journey.
                </p>
                <p>
                  We maintain highly selective partnerships, showcasing only properties that meet rigid benchmarks for architectural health, urban planning, and neighborhood security. Our agents undergo continuous legal and customer-centric training to remain the industry's absolute gold standard.
                </p>
                <p>
                  Whatever your real estate goals, we promise to deliver unmatched customer service, exceptional market intelligence, and uncompromised executive support at every milestone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-[#0E1F35] font-bold text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                  <FileCheck className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <span>Personalized Concierge Guidance At Joint Signings</span>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] relative overflow-hidden bg-slate-50 border-l border-slate-50 order-1 lg:order-2">
              <img
                src={aboutAdvisorWoman}
                alt="Expert Advisor Concierge"
                className="absolute inset-0 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-[#0E1F35]/95 text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Expert Consultation
              </div>
            </div>

          </div>
        </div>

        {/* Section 5: Overlapping Rings/Circles Graphic (We Will Get You A Home) */}
        <div className="flex flex-col items-center justify-center pt-10 pb-16 space-y-6">
          <div className="text-center space-y-2">
            <h4 className="text-sm font-extrabold text-amber-700 tracking-widest uppercase">Our Ultimate Brand Promise</h4>
            <p className="text-2xl font-bold text-[#0E1F35] font-serif">A Clear Path To Luxury Living</p>
          </div>
          
          <div className="flex items-center justify-center -space-x-12 sm:-space-x-20 md:-space-x-28 py-6">
            {/* Left Circle - Deep Teal */}
            <div 
              className="w-[140px] h-[140px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] rounded-full bg-[#004C5C] flex flex-col items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 select-none shrink-0"
              style={{ zIndex: 10 }}
            >
              <p className="text-[11px] sm:text-2xl md:text-3.5xl font-black tracking-widest text-center leading-tight">
                WE<br />WILL
              </p>
            </div>

            {/* Middle Circle - Golden / Ochre */}
            <div 
              className="w-[140px] h-[140px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] rounded-full bg-[#B38330]/95 flex flex-col items-center justify-center text-white shadow-2xl hover:scale-[1.03] transition-all duration-300 select-none shrink-0"
              style={{ zIndex: 20 }}
            >
              <p className="text-[11px] sm:text-2xl md:text-3.5xl font-black tracking-widest text-center leading-tight">
                GET<br />YOU
              </p>
            </div>

            {/* Right Circle - Deep Navy */}
            <div 
              className="w-[140px] h-[140px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] rounded-full bg-[#0E1F35]/95 flex flex-col items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 select-none shrink-0"
              style={{ zIndex: 30 }}
            >
              <p className="text-[11px] sm:text-2xl md:text-3.5xl font-black tracking-widest text-center leading-tight">
                A<br />HOME
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

