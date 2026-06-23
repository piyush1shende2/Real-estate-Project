import React from 'react';
import { Smartphone, Play, Apple, Globe, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onAboutClick?: () => void;
}

export default function Footer({ onAboutClick }: FooterProps) {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-[#E7E7E7] py-8 px-6 sm:px-12 border-t border-gray-200 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: IOS/Android Badge buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          {/* iOS Download badge */}
          <button
            onClick={() => alert('Urban Nest Realty iOS app is coming soon on the App Store!')}
            className="w-full sm:w-auto bg-white border border-gray-300 hover:border-gray-500 text-slate-800 rounded px-4 py-2.5 flex items-center justify-center gap-2.5 transition-all text-xs font-bold cursor-pointer uppercase shadow-xs shrink-0"
          >
            <Apple className="w-5 h-5 text-black shrink-0" />
            <span>App For ios</span>
          </button>

          {/* Android Download badge */}
          <button
            onClick={() => alert('Urban Nest Realty Android app is coming soon on Google Play Store!')}
            className="w-full sm:w-auto bg-white border border-gray-300 hover:border-gray-500 text-slate-800 rounded px-4 py-2.5 flex items-center justify-center gap-2.5 transition-all text-xs font-bold cursor-pointer uppercase shadow-xs shrink-0"
          >
            {/* Simple Android Logo or Play-store play element */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-green-600 shrink-0 fill-current"
            >
              <path d="M17.523 15.3l1.815 3.144a.9.9 0 01-1.556.9l-1.83-3.17a9.387 9.387 0 01-7.89-.007L4.22 19.344a.9.9 0 01-1.554-.9l1.814-3.14A9.43 9.43 0 012 8.35h20a9.423 9.423 0 01-4.477 6.95zM7 11.5a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <span>App For Android</span>
          </button>
        </div>

        {/* Right Side: Links (Careers, About Us, Language) */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-gray-800 w-full md:w-auto">
          <button 
            onClick={() => alert("Urban Nest Realty Careers center: We are hiring frontend and real-estate analysts! Send your deck to careers@urbannestrealty.fake")} 
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            Careers
          </button>
          
          <button 
            onClick={onAboutClick} 
            className="hover:text-[#0E1F35] hover:underline transition-colors cursor-pointer"
          >
            About Us
          </button>

          <button 
            onClick={() => alert("Languages supported: English (US), French, Spanish. Auto-detection enabled.")} 
            className="hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-gray-500" /> Language
          </button>
        </div>

      </div>

      {/* Under Footer Regulatory Rights notes */}
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider gap-2">
        <span>© 2026 URBAN NEST REALTY INC. All rights reserved.</span>
        <button 
          onClick={scrollUp}
          className="hover:text-slate-800 transition-colors flex items-center gap-1 text-[9px] cursor-pointer"
        >
          Back To Top ↑
        </button>
      </div>
    </footer>
  );
}
