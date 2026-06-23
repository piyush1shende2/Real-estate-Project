import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AdsSection() {
  const [showLiveAd, setShowLiveAd] = useState(false);

  return (
    <section id="ads-section" className="max-w-7xl mx-auto px-4 sm:px-12 py-6">
      
      {/* Box layout matching screenshot precisely */}
      <div className="relative border-2 border-slate-700 bg-gray-50 rounded overflow-hidden select-none">
        
        {!showLiveAd ? (
          /* Wireframe Crossing Lines as drawn in screenshot */
          <div className="h-44 sm:h-56 relative flex items-center justify-center overflow-hidden">
            
            {/* Diagonal SVG Cross lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#E2E8F0" strokeWidth="2" />
              <line x1="0" y1="100%" x2="100%" y2="0" stroke="#E2E8F0" strokeWidth="2" />
              {/* Outer border of main graphic inside */}
              <rect x="1%" y="2%" width="98%" height="96%" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Title exact letters */}
            <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.2em] text-slate-700 relative z-2 text-center select-none uppercase">
              ADs SECTION
            </h1>

            {/* Switch interactive element */}
            <button
              onClick={() => setShowLiveAd(true)}
              className="absolute bottom-3 right-3 bg-slate-900 hover:bg-orange-500 text-white font-extrabold text-[10px] tracking-widest px-3 py-1.5 rounded uppercase flex items-center gap-1 cursor-pointer transition-all shadow"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" /> View Live Ads
            </button>
          </div>
        ) : (
          /* Real interactive rotating residential advertisement */
          <div className="h-44 sm:h-56 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center p-6 sm:p-10 relative">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-orange-500 text-slate-900 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded tracking-widest">
                EXCLUSIVE DIRECT
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Get 1 year of Maintenance FREE at Sunset Villas!
              </h3>
              <p className="text-xs text-slate-300 max-w-lg">
                Exclusive partner offer for first-time buyers on Urban Nest Realty registering this week. Move-in ready penthouses and boutique plots with fast developer clearance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 shrink-0">
              <button 
                onClick={() => alert("Offer code NEST-FREE1YR activated on your session!")}
                className="bg-orange-500 hover:bg-orange-600 font-bold px-6 py-2.5 rounded text-xs uppercase text-slate-950 tracking-wider cursor-pointer transition-colors"
              >
                Claim Offer
              </button>
              <button
                onClick={() => setShowLiveAd(false)}
                className="bg-white/10 hover:bg-white/20 font-bold px-4 py-2.5 rounded text-xs uppercase text-white tracking-wider cursor-pointer transition-colors"
              >
                Show Wireframe
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Headline exact lyrics under wireframe from image */}
      <p className="text-xs sm:text-sm font-bold text-gray-900 mt-5 leading-relaxed text-left">
        Lorem ipsum dolor sit amet consectetur. Fringilla adipiscing dui turpis eget blandit ipsum eleifend congue mi. Dolor venenatis scelerisque id nulla risus tristique quis morbi. Dictumst et sed ullamcorper amet lectus et. Leo elementum orci in nunc turpis.
      </p>

    </section>
  );
}
