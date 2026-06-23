import React from 'react';
import { Search } from 'lucide-react';

interface BuyingGuideProps {
  onAskClick: () => void;
}

export default function BuyingGuide({ onAskClick }: BuyingGuideProps) {
  return (
    <section id="buying-guide-section" className="max-w-7xl mx-auto px-4 sm:px-12 py-12 select-none">
      
      {/* Visual Header */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 uppercase mb-5 select-none">
        Buying Guide:-
      </h3>

      {/* Styled Horizontal Banner with magnifying search emblem and ASK action matching image */}
      <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 sm:p-7 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
        
        {/* Banner details */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Magnifying Glass Custom Emblemed Badge */}
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-3 border-amber-400 p-0 text-[#0E1F35] flex-shrink-0">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>

          <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            Not sure what formalities required before buying property.
          </h4>
        </div>

        {/* Large prominent RED Ask Button */}
        <button
          onClick={onAskClick}
          className="w-[180px] bg-[#FF0101] hover:bg-red-700 text-white font-extrabold py-3.5 rounded text-base sm:text-lg uppercase tracking-widest cursor-pointer transition-colors shrink-0 shadow-md text-center"
        >
          Ask
        </button>
      </div>

    </section>
  );
}
