import React, { useState } from 'react';
import { 
  GraduationCap, 
  HeartHandshake, 
  Trees, 
  SquarePlay, 
  Truck,
  HeartPulse,
  Info
} from 'lucide-react';

interface LocalityFocusItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  redHighlight: boolean;
  idealRadius: string;
  checklist: string[];
  description: string;
}

export default function NeedsSection() {
  const [selectedFocus, setSelectedFocus] = useState<string | null>('Education');

  const focusItems: LocalityFocusItem[] = [
    {
      id: 'Education',
      label: 'Education',
      icon: <GraduationCap className="w-14 h-14 stroke-[1.2] text-slate-800" />,
      redHighlight: false,
      idealRadius: 'Under 1.5 miles (3 km)',
      checklist: ['Pre-schools & Kindergartens', 'Primary & High Schools', 'Safe pedestrian pathways & bike corridors'],
      description: 'Having highly rated schools in close proximity drastically enhances long-term property valuation and saves hours of daily commute time for families.'
    },
    {
      id: 'Health-Care',
      label: 'Health-Care',
      icon: <HeartPulse className="w-14 h-14 stroke-[1.2] text-slate-800" />,
      redHighlight: false,
      idealRadius: 'Under 3 miles (5 km)',
      checklist: ['24/7 Trauma Emergency Care', 'Pediatric Clinics', 'Highly stocked pharmacies with delivery logistics'],
      description: 'Quick healthcare response times provide peace of mind, especially for elderly residents or emergency situations, reducing stress on premium households.'
    },
    {
      id: 'Green Space',
      label: 'Green Space',
      icon: <Trees className="w-14 h-14 stroke-[1.2] text-slate-800" />,
      redHighlight: false,
      idealRadius: 'Under 10 minutes walk',
      checklist: ['Manicured children parks', 'Pet-friendly designated areas', 'Jogging, workout facilities & clean lakes'],
      description: 'Green spaces encourage clean air corridors, elevate psychological health, and act as a social gathering framework for neighborhood community networks.'
    },
    {
      id: 'Parking Space',
      label: 'Parking Space',
      icon: (
        <div className="w-14 h-14 border-[3px] border-slate-800 rounded-full flex items-center justify-center font-black text-2xl text-slate-800 select-none">
          P
        </div>
      ),
      redHighlight: false,
      idealRadius: 'On-site or reserved within building boundary',
      checklist: ['Covered basement garage spaces', 'EV charging station grids', 'Clear visitor street parking allocations'],
      description: 'Secure, dedicated parking shields vehicles from environment hazards and prevents legal parking disputes or high garage/association leasing fee plans.'
    },
    {
      id: 'Transport',
      label: 'Transport',
      icon: <Truck className="w-14 h-14 stroke-[1.2] text-slate-800" />,
      redHighlight: false,
      idealRadius: 'Within 10-15 mins walking radius',
      checklist: ['Metro Stations / rapid rail linkups', 'Dedicated highway feeder exits', 'Bus transit network connection bays'],
      description: 'Reliable public and private transit routes keep your household connected to city commercial centers, expanding career and recreation options.'
    }
  ];

  return (
    <section id="needs-section" className="max-w-7xl mx-auto px-4 sm:px-12 py-12">
      
      {/* Visual Header */}
      <h2 className="text-2xl sm:text-4.5xl font-extrabold tracking-tight text-slate-950 text-left mb-6 select-none">
        We Understand your needs.
      </h2>

      {/* Large Grey Outer Container */}
      <div className="bg-[#E7E7E7] rounded-xl p-6 sm:p-10 select-none border border-slate-200 shadow-sm">
        
        {/* Prominent Red Banner Header inside box */}
        <div className="text-center mb-10">
          <h3 className="text-rose-600 font-extrabold text-xl sm:text-3xl tracking-tight leading-tight uppercase select-none">
            Whenever getting into a new
          </h3>
          <h3 className="text-rose-600 font-extrabold text-xl sm:text-3xl tracking-tight leading-tight uppercase select-none">
            Locality always focus on
          </h3>
        </div>

        {/* 5 Icons Row Grid structure precisely following layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 justify-items-center mb-8">
          {focusItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFocus(item.id)}
              className={`flex flex-col items-center gap-3 group cursor-pointer transition-all ${
                selectedFocus === item.id ? 'scale-105' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Graphic Icon shape */}
              <div className={`p-4 bg-white/70 rounded-2xl group-hover:bg-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center w-24 h-24 ${
                selectedFocus === item.id ? 'ring-2 ring-orange-500 bg-white shadow-md' : 'border border-slate-100'
              }`}>
                {item.icon}
              </div>

              {/* Title label underneath graphic */}
              <span className={`text-xs sm:text-sm font-bold tracking-tight text-slate-800 transition-colors uppercase ${
                selectedFocus === item.id ? 'text-amber-800 underline underline-offset-4' : 'group-hover:text-amber-700'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Card showing checklist parameters */}
        {selectedFocus && (
          <div className="bg-white rounded-lg p-5 border border-slate-200/50 mt-6 animate-fadeIn shadow-sm">
            {focusItems.filter(f => f.id === selectedFocus).map((curr) => (
              <div key={curr.id} className="flex flex-col md:flex-row gap-6 justify-between">
                
                {/* Left block Info */}
                <div className="space-y-3 flex-grow md:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#b38330]/20 text-[#916a24] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Evaluation Parameter
                    </span>
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Ideal Range: {curr.idealRadius}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 border-b border-gray-100 pb-1 uppercase tracking-wide">
                    {curr.label}
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    {curr.description}
                  </p>
                </div>

                {/* Right block checklist */}
                <div className="bg-slate-50 rounded-md p-4 min-w-[280px] border border-slate-100 flex flex-col justify-center">
                  <h5 className="text-[10px] font-black tracking-widest text-[#0E1F35] uppercase mb-2.5">
                    Essential checklist items:
                  </h5>
                  <div className="space-y-2 text-xs">
                    {curr.checklist.map((check, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-slate-700 font-bold max-w-xs">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </section>
  );
}
