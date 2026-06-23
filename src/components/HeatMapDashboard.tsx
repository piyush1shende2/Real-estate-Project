import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Percent, 
  MapPin, 
  Building2, 
  Navigation, 
  Sparkles, 
  Search, 
  Compass, 
  Plus, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Heart,
  ExternalLink,
  DollarSign,
  SlidersHorizontal
} from 'lucide-react';
import { awardXPAction } from '../lib/gamification';
import { INITIAL_ALL_CITIES_SECTOR_DATA, SectorDetails } from '../data/heatmapCitiesData';

export default function HeatMapDashboard() {
  // Active city tab layer
  const [selectedCity, setSelectedCity] = useState<string>('Nagpur');

  // Master reactive sector data state mapping all cities to support simulations
  const [allCitiesSectorData, setAllCitiesSectorData] = useState<Record<string, Record<string, SectorDetails>>>(
    INITIAL_ALL_CITIES_SECTOR_DATA
  );

  // Active mode of the heat map metrics
  const [activeMode, setActiveMode] = useState<'price' | 'demand' | 'yield' | 'growth' | 'amenities'>('price');
  
  // Selected area for detailed inspection (automatically synced to selected city)
  const [selectedSectorId, setSelectedSectorId] = useState<string>('mihan');

  // Budget slider planning state
  const [plannedBudget, setPlannedBudget] = useState<number>(8000); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper config to retrieve dynamic budget bounds suited per city
  const getBudgetBoundsForCity = (city: string) => {
    switch (city) {
      case 'Mumbai':
        return { min: 10000, max: 60000, step: 1000, defaultVal: 22000 };
      case 'Bengaluru':
        return { min: 5000, max: 20000, step: 500, defaultVal: 10000 };
      case 'Pune':
        return { min: 5000, max: 20000, step: 500, defaultVal: 8000 };
      case 'Delhi NCR':
        return { min: 5000, max: 45000, step: 1000, defaultVal: 12000 };
      case 'Nagpur':
      default:
        return { min: 3500, max: 15000, step: 250, defaultVal: 7500 };
    }
  };

  // Sync state when active City is shifted
  useEffect(() => {
    const bounds = getBudgetBoundsForCity(selectedCity);
    setPlannedBudget(bounds.defaultVal);

    const citySectors = allCitiesSectorData[selectedCity] || {};
    const firstSectorId = Object.keys(citySectors)[0];
    if (firstSectorId) {
      setSelectedSectorId(firstSectorId);
    }
  }, [selectedCity]);

  // Current active city's data
  const sectorData: Record<string, SectorDetails> = allCitiesSectorData[selectedCity] || {};
  const selectedSector = sectorData[selectedSectorId] || (Object.values(sectorData) as SectorDetails[])[0];

  // Dynamic relative property price color scale (handles Nagpur/Mumbai ranges dynamically)
  const getDynamicPriceColor = (price: number) => {
    const sectors = Object.values(sectorData) as SectorDetails[];
    if (sectors.length === 0) return 'rgba(16, 185, 129, 0.7)';
    const prices = sectors.map(s => s.pricePerSqft);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    const ratio = range > 0 ? (price - minPrice) / range : 0.5;
    
    if (ratio >= 0.70) return 'rgba(239, 68, 68, 0.78)';  // High range -> Red hotspot
    if (ratio >= 0.35) return 'rgba(245, 158, 11, 0.75)'; // Mid range -> Yellow
    return 'rgba(16, 185, 129, 0.75)';                    // Low range -> Green budget
  };

  // Standard color scaling formulas
  const getDemandColor = (inqs: number) => {
    if (inqs >= 400) return 'rgba(239, 68, 68, 0.78)';
    if (inqs >= 200) return 'rgba(245, 158, 11, 0.75)';
    return 'rgba(16, 185, 129, 0.75)';
  };

  const getYieldColor = (yieldVal: number) => {
    if (yieldVal >= 6.5) return 'rgba(239, 68, 68, 0.78)';
    if (yieldVal >= 4.0) return 'rgba(245, 158, 11, 0.75)';
    return 'rgba(16, 185, 129, 0.75)';
  };

  const getGrowthColor = (growth: 'Low' | 'Medium' | 'High') => {
    if (growth === 'High') return 'rgba(239, 68, 68, 0.78)';
    if (growth === 'Medium') return 'rgba(245, 158, 11, 0.75)';
    return 'rgba(16, 185, 129, 0.75)';
  };

  const getAmenitiesColor = (score: number) => {
    if (score >= 90) return 'rgba(239, 68, 68, 0.78)';
    if (score >= 65) return 'rgba(245, 158, 11, 0.75)';
    return 'rgba(16, 185, 129, 0.75)';
  };

  const getSectorColor = (sector: SectorDetails) => {
    switch(activeMode) {
      case 'price':
        return getDynamicPriceColor(sector.pricePerSqft);
      case 'demand':
        return getDemandColor(sector.inquiries);
      case 'yield':
        return getYieldColor(sector.rentalYield);
      case 'growth':
        return getGrowthColor(sector.growthPotential);
      case 'amenities':
        return getAmenitiesColor(sector.amenitiesScore);
      default:
        return 'rgba(148, 163, 184, 0.5)';
    }
  };

  // Trigger simulated interactive user events
  const handleSimulateAction = (type: 'visit' | 'inquiry' | 'save') => {
    if (!selectedSector) return;

    // Award XP points through standard gamification engine
    awardXPAction('view_property', 25);
    window.dispatchEvent(new Event('urban_nest_gamification_updated'));

    let addedValue = 0;
    let desc = '';

    if (type === 'visit') {
      addedValue = 45;
      desc = `📍 Scheduled Site Visit in ${selectedSector.name}! +45 demand units added to grid.`;
    } else if (type === 'inquiry') {
      addedValue = 30;
      desc = `📞 Logged Instant Inquiry for ${selectedSector.name}! +30 demand units generated.`;
    } else {
      addedValue = 15;
      desc = `❤️ Added ${selectedSector.name} listing to Saved Collection! +15 demand units recorded.`;
    }

    setAllCitiesSectorData(prev => ({
      ...prev,
      [selectedCity]: {
        ...prev[selectedCity],
        [selectedSectorId]: {
          ...prev[selectedCity][selectedSectorId],
          inquiries: prev[selectedCity][selectedSectorId].inquiries + addedValue
        }
      }
    }));

    setSuccessMessage(`${desc} Earned +25 XP Career Points!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  // Sync matching sectors lists under budget slider targets
  const sectorList = Object.values(sectorData) as SectorDetails[];
  const budgetMatches = sectorList.filter(s => s.pricePerSqft <= plannedBudget);
  const activeBounds = getBudgetBoundsForCity(selectedCity);

  return (
    <div id="heatmap-analytics-root" className="space-y-6 select-none animate-fadeIn">
      
      {/* City Switcher Pill Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1 text-left">
          <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider font-mono">
            🌍 Global Spatial Select
          </span>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Active City Inspection Layer</h4>
          <p className="text-[10px] text-slate-450 font-medium leading-normal">
            Switch cities to dynamically re-render real-time geographic hotspots and local growth indicators.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Nagpur', 'Mumbai', 'Bengaluru', 'Pune', 'Delhi NCR'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCity === city
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-102 font-black'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedCity === city ? 'bg-amber-400 animate-ping' : 'bg-slate-300'}`} />
                {city}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {successMessage && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-4 shadow-lg border border-emerald-400 flex items-center justify-between gap-3 animate-slideIn">
          <div className="flex items-center gap-2.5 text-left">
            <Sparkles className="w-5 h-5 fill-white/20 text-white shrink-0" />
            <span className="text-[11.5px] font-black uppercase tracking-wider">{successMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSuccessMessage(null)}
            className="text-white font-extrabold text-sm hover:opacity-80 px-2 shrink-0"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid: Analytical modes and Investment description */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Modes selecting panel */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3.5 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#004C5C] bg-teal-55/70 px-2.5 py-1 rounded-full border border-teal-200 inline-block">
              🗺️ 5-in-1 Spatial Analytics
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Select Heat Map Metrics Layer</h4>
              <p className="text-[10px] text-slate-400 font-bold leading-normal">
                Observe the live visual mapping of {selectedCity} real estate parameters. Deeply analyze pricing, demand density, rental yields, growth, and schools coverage.
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="space-y-2 pt-1">
              
              {/* Mode 1: Price Heat Map */}
              <button
                type="button"
                onClick={() => setActiveMode('price')}
                className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 text-left cursor-pointer ${
                  activeMode === 'price'
                    ? 'bg-amber-500/[0.04] border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 ${activeMode === 'price' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider">1. Property Price Heat Map</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">BUDGET LAYER</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                    Evaluates average property acquisition cost. Green indicates municipal budget rates, Red denotes prestigious premium sectors.
                  </p>
                  <div className="flex gap-2.5 items-center mt-1.5 border-t border-slate-100 pt-1.5 text-[8px] font-extrabold uppercase text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Budget Friendly</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Moderate</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Premium High-end</span>
                  </div>
                </div>
              </button>

              {/* Mode 2: Demand Heat map */}
              <button
                type="button"
                onClick={() => setActiveMode('demand')}
                className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 text-left cursor-pointer ${
                  activeMode === 'demand'
                    ? 'bg-amber-500/[0.04] border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 ${activeMode === 'demand' ? 'bg-red-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider">2. Hot Demand Heat Map</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase tracking-widest">TRENDING</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                    Maps searches, saved lists, site visits & inquiry counts. High active inquiries (400+) show up as boiling Red hotspots.
                  </p>
                  <div className="flex gap-2.5 items-center mt-1.5 border-t border-slate-100 pt-1.5 text-[8px] font-extrabold uppercase text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cold (50 Inq)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Steady (200 Inq)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Boiling (400+ Inq)</span>
                  </div>
                </div>
              </button>

              {/* Mode 3: Rental Yield Heat map */}
              <button
                type="button"
                onClick={() => setActiveMode('yield')}
                className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 text-left cursor-pointer ${
                  activeMode === 'yield'
                    ? 'bg-amber-500/[0.04] border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 ${activeMode === 'yield' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider">3. Investor Rental Yield %</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-widest">ROI TRACKER</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                    Identifies high-rental-yield zones (6.5%+ for IT tech areas like SEZs), Yellow is moderate, Green is stable long-term cash flow.
                  </p>
                  <div className="flex gap-2.5 items-center mt-1.5 border-t border-slate-100 pt-1.5 text-[8px] font-extrabold uppercase text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> under 4.0% (Stable)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 4% - 6% (Moderate)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 6.5%+ (High Yield)</span>
                  </div>
                </div>
              </button>

              {/* Mode 4: Future Growth Heat map */}
              <button
                type="button"
                onClick={() => setActiveMode('growth')}
                className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 text-left cursor-pointer ${
                  activeMode === 'growth'
                    ? 'bg-amber-500/[0.04] border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 ${activeMode === 'growth' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider">4. Future Growth Potential</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-widest">DEVELOPMENT</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                    Weighs incoming developments (Metro link extensions, Smart City commands, highway access). High hotspots represent imminent booms.
                  </p>
                  <div className="flex gap-2.5 items-center mt-1.5 border-t border-slate-100 pt-1.5 text-[8px] font-extrabold uppercase text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Stable (Low)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Growing (Medium)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Hotspot (High Build)</span>
                  </div>
                </div>
              </button>

              {/* Mode 5: Amenities Heat map */}
              <button
                type="button"
                onClick={() => setActiveMode('amenities')}
                className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 text-left cursor-pointer ${
                  activeMode === 'amenities'
                    ? 'bg-amber-500/[0.04] border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 ${activeMode === 'amenities' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider">5. Connectivity & Amenities Score</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 uppercase tracking-widest">INFRASTRUCTURE</span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                    Evaluates accessibility of healthcare, elite academies, transit terminals, and environmental parks. Top dense clusters in Red.
                  </p>
                  <div className="flex gap-2.5 items-center mt-1.5 border-t border-slate-100 pt-1.5 text-[8px] font-extrabold uppercase text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Emerging Area</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 65+ Score (Sufficient)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 90+ Score (Premium)</span>
                  </div>
                </div>
              </button>

            </div>

          </div>

          {/* Investment Planner Budget Widget */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-white/10 space-y-3.5 text-left mt-4 shadow-md">
            <div>
              <span className="text-[8.5px] font-black tracking-widest text-amber-400 block uppercase flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> STRATEGIC SECTOR RECOMMENDER
              </span>
              <h5 className="text-[11.5px] text-slate-200 font-extrabold tracking-tight mt-0.5">Adjust Budget Planner (₹ / sqft)</h5>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-300 font-bold">
                <span>Maximum Entry Target</span>
                <span className="text-amber-300">₹ {plannedBudget.toLocaleString()}/sqft max</span>
              </div>
              <input 
                type="range" 
                min={activeBounds.min} 
                max={activeBounds.max} 
                step={activeBounds.step}
                value={plannedBudget} 
                onChange={(e) => setPlannedBudget(Number(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>₹ {activeBounds.min.toLocaleString()}</span>
                <span>₹ {activeBounds.max.toLocaleString()}</span>
              </div>
            </div>

            {/* Recommendations result */}
            <div className="bg-slate-950/70 rounded-xl p-2.5 border border-white/5 space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-teal-400 font-black block">Matching sectors in {selectedCity} ({budgetMatches.length}):</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {budgetMatches.length > 0 ? (
                  budgetMatches.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSectorId(s.id)}
                      className={`px-2 py-0.5 border rounded text-[9.5px] font-extrabold uppercase transition-all ${
                        selectedSectorId === s.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/20 hover:border-teal-400/50'
                      }`}
                    >
                      {s.name} (₹{Math.round(s.pricePerSqft/100)/10}k)
                    </button>
                  ))
                ) : (
                  <span className="text-[9px] text-rose-355 font-semibold leading-normal block">
                    No sectors available within this limit. Slide budget higher for {selectedCity} listings (e.g., above ₹ {activeBounds.defaultVal.toLocaleString()}).
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Interactive Map View & Detail Card Inspection */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* MAP STAGE CARD */}
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 text-white relative flex flex-col justify-between shadow-xl">
            
            <div className="flex justify-between items-center z-10">
              <div className="space-y-0.5 text-left">
                <span className="text-[8.5px] font-black text-amber-400 uppercase tracking-widest block">
                  📍 GEO-DIRECTIVE MATRIX INFRASTRUCTURE
                </span>
                <h5 className="text-[12px] font-extrabold uppercase text-slate-100 tracking-wide flex items-center gap-1.5 select-none">
                  {selectedCity} Hotspot Zones (Live Layer: <span className="text-teal-400 underline font-mono select-none">{activeMode}</span>)
                </h5>
              </div>
              <div className="text-[8px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold">
                PROD_NET_V2: SYNCED
              </div>
            </div>

            {/* Render Map using premium blueprint responsive SVG */}
            <div className="my-4 relative bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center p-2">
              
              {/* Background blueprint grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
              
              <svg 
                viewBox="0 0 450 400" 
                className="w-full h-auto max-h-[340px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Geometrical segments */}
                {sectorList.map((sector) => {
                  const isSelected = selectedSectorId === sector.id;
                  const activeColor = getSectorColor(sector);
                  
                  return (
                    <g key={sector.id} className="cursor-pointer group">
                      {/* Interactive map Polygon */}
                      <polygon
                        points={sector.coordinates}
                        fill={activeColor}
                        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={isSelected ? '2.5' : '1'}
                        className="transition-all duration-300 hover:opacity-90 hover:stroke-amber-400 hover:scale-101 animate-fadeIn"
                        onClick={() => setSelectedSectorId(sector.id)}
                      >
                        <title>{sector.name} Layer Information (Click to Inspect)</title>
                      </polygon>

                      {/* Display Glow underlay for chosen polygon */}
                      {isSelected && (
                        <polygon
                          points={sector.coordinates}
                          fill="transparent"
                          stroke="rgba(245, 158, 11, 0.4)"
                          strokeWidth="6"
                          className="animate-pulse pointer-events-none"
                        />
                      )}

                      {/* Sector name overlay label in center of poly */}
                      <rect
                        x={sector.centerText.x - 44}
                        y={sector.centerText.y - 12}
                        width={88}
                        height={20}
                        rx={5}
                        fill="rgba(15, 23, 42, 0.82)"
                        stroke={isSelected ? '#f59e0b' : 'rgba(255,255,255,0.05)'}
                        strokeWidth="0.5"
                        pointerEvents="none"
                      />
                      <text
                        x={sector.centerText.x}
                        y={sector.centerText.y + 1}
                        textAnchor="middle"
                        fill={isSelected ? '#f59e0b' : '#f8fafc'}
                        fontSize="7.5"
                        fontWeight="900"
                        letterSpacing="0.02em"
                        pointerEvents="none"
                        className="uppercase font-mono tracking-tight"
                      >
                        {sector.name.length > 13 ? sector.name.substring(0, 11) + '..' : sector.name}
                      </text>
                    </g>
                  );
                })}

                {/* compass visual element */}
                <g transform="translate(410, 40)" className="opacity-90 select-none">
                  <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="#ef4444" strokeWidth="1.5" />
                  <polygon points="0,-12 -4,-4 4,-4" fill="#ef4444" />
                  <text x="0" y="-18" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                  <text x="0" y="3" fill="#94a3b8" fontSize="6.5" fontWeight="black" textAnchor="middle" opacity="0.8" className="font-mono">
                    {selectedCity.split(' ')[0].substring(0, 6).toUpperCase()}
                  </text>
                </g>
                
              </svg>
            </div>

            {/* Instruction footnote inside the map card */}
            <div className="flex justify-between items-center text-[8px] text-slate-400 border-t border-slate-900 pt-3 relative z-10 select-none text-left">
              <span className="flex items-center gap-1.5 leading-normal">
                <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                Click geographical segments directly on the map structure to retrieve detailed analytics & simulate data.
              </span>
              <span className="text-amber-500 font-extrabold uppercase shrink-0">INVESTMENT READY</span>
            </div>

          </div>

          {/* INSPECTOR PANEL DETAILS */}
          {selectedSector ? (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md text-left space-y-4">
              
              {/* Header description */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> ACTIVE SECTOR INQUIRY PORTAL
                  </span>
                  <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                    {selectedSector.name} ({selectedCity}) Sector Breakdown
                  </h5>
                </div>
                <span className="bg-slate-100 text-slate-700 font-mono font-black text-[9px] px-2 py-0.5 rounded-md uppercase border border-slate-200/30">
                  SECT_ID: {selectedSector.id}
                </span>
              </div>

              {/* Core statistics cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* Avg Rates */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center select-none shadow-2xs">
                  <span className="text-[8px] text-slate-400 font-black tracking-widest uppercase block mb-1">Average sqft price</span>
                  <span className="text-xs font-black text-rose-650 font-mono">₹ {selectedSector.pricePerSqft.toLocaleString()}</span>
                  <span className="text-[7.5px] text-slate-400 font-extrabold block mt-0.5">Relative City Scale</span>
                </div>

                {/* Inquiries */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center select-none shadow-2xs">
                  <span className="text-[8px] text-slate-400 font-black tracking-widest uppercase block mb-1">Demand Inquiries</span>
                  <span className="text-xs font-black text-[#004C5C] font-mono">{selectedSector.inquiries} units</span>
                  <span className="text-[7.5px] text-slate-400 font-extrabold block mt-0.5">Trending Inquiries</span>
                </div>

                {/* Rental Yield % */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center select-none shadow-2xs">
                  <span className="text-[8px] text-slate-400 font-black tracking-widest uppercase block mb-1">Rental Yield %</span>
                  <span className="text-xs font-black text-amber-600 font-mono">{selectedSector.rentalYield} % p.a.</span>
                  <span className="text-[7.5px] text-slate-400 font-extrabold block mt-0.5">ROI Index Range</span>
                </div>

                {/* Future Growth */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center select-none shadow-2xs">
                  <span className="text-[8px] text-slate-400 font-black tracking-widest uppercase block mb-1">Growth Potential</span>
                  <span className={`text-[9.5px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full inline-block mt-0.5 font-mono ${
                    selectedSector.growthPotential === 'High' 
                      ? 'bg-rose-100 text-rose-700' 
                      : selectedSector.growthPotential === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedSector.growthPotential}
                  </span>
                  <span className="text-[7.5px] text-slate-400 font-extrabold block mt-1">Infrastructure Boost</span>
                </div>

              </div>

              {/* Narrative description */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-150">
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Sector Overview & Investment Benefit</span>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                  {selectedSector.description}
                </p>
              </div>

              {/* Growth projects list & Amenity breakout list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Growth Projects */}
                <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 select-none">
                    🚀 Major Civic Growth Drivers:
                  </span>
                  <ul className="space-y-1.5 pl-1.5 list-none">
                    {selectedSector.growthDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[9.5px] text-slate-600 font-bold leading-normal">
                        <span className="text-amber-500 mt-0.5 shrink-0">⚡</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Amenity Score Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">
                    <span>🏢 Infrastructure Coverage ({selectedSector.amenitiesScore}/100)</span>
                    <span className="text-purple-650 font-mono font-black">{selectedSector.amenitiesScore} pts</span>
                  </div>
                  
                  {/* Amenity details strip */}
                  <div className="grid grid-cols-5 gap-1 pt-1 text-center select-none">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] block">🏫</span>
                      <span className="text-[9px] font-black font-mono text-slate-700">{selectedSector.amenityCounts.schools}</span>
                      <span className="text-[6px] text-slate-400 font-extrabold block">Schools</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] block">🏥</span>
                      <span className="text-[9px] font-black font-mono text-slate-700">{selectedSector.amenityCounts.hospitals}</span>
                      <span className="text-[6px] text-slate-400 font-extrabold block">Hosp</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] block">🛍️</span>
                      <span className="text-[9px] font-black font-mono text-slate-700">{selectedSector.amenityCounts.malls}</span>
                      <span className="text-[6px] text-slate-400 font-extrabold block">Malls</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] block">🚇</span>
                      <span className="text-[9px] font-black font-mono text-slate-700">{selectedSector.amenityCounts.metroStations}</span>
                      <span className="text-[6px] text-slate-400 font-extrabold block">Metro</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] block">🏡</span>
                      <span className="text-[9px] font-black font-mono text-slate-700">{selectedSector.amenityCounts.parks}</span>
                      <span className="text-[6px] text-slate-400 font-extrabold block">Parks</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive actions for this sector (simulate and unlock rewards) */}
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/60 text-left space-y-3.5 mt-2.5">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[9px] font-black uppercase text-[#0E1F35] tracking-tight">🎯 DEMAND MATRIX SIMULATORS</span>
                  <span className="text-[8px] bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5 font-black uppercase tracking-wider font-mono">
                    +25 XP Rewardable Action
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-450 font-bold leading-normal">
                  As real-estate hunters browse and schedule site-visits, local real-time inquiries grow. Simulate interactive user events to witness heat charts shift density instantly!
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSimulateAction('save')}
                    className="py-2.5 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-black rounded-xl text-[9px] uppercase tracking-wider transition-all h-[36px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10 shrink-0" />
                    <span>Save Location</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateAction('inquiry')}
                    className="py-2.5 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-black rounded-xl text-[9px] uppercase tracking-wider transition-all h-[36px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Log Inquiry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateAction('visit')}
                    className="py-2.5 px-3.5 bg-[#004C5C] hover:bg-[#064E6B] text-white font-black rounded-xl text-[9px] uppercase tracking-wider transition-all h-[36px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-bounce" />
                    <span>Book Site-Visit</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md text-center">
              <p className="text-xs text-slate-400 font-bold">Please select a sector on the map overlay to view breakdown.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
