import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  Wind, 
  Compass, 
  MapPin, 
  Thermometer, 
  Trees, 
  Activity, 
  Search, 
  Sliders, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Heart
} from 'lucide-react';

export interface LocalityWeather {
  cityName: string;
  localityName: string;
  avgTemp: number; // in Celsius
  humidity: number; // %
  greenCover: number; // %
  aqi: number; // Air quality index
  comfortLevel: 'Alpine Crisp' | 'Pleasantly Cool' | 'Moderate Balanced' | 'Tropical Humid' | 'Warm Dry';
  comfortFeatures: string[];
  recommendedSpots: string[];
  scenicRating: number; // 1 to 5 stars
  description: string;
}

export const LOCALITY_WEATHER_DB: LocalityWeather[] = [
  {
    cityName: 'Bengaluru',
    localityName: 'Indiranagar',
    avgTemp: 23,
    humidity: 52,
    greenCover: 48,
    aqi: 48,
    comfortLevel: 'Pleasantly Cool',
    comfortFeatures: ['Canopy Shaded Avenues', 'Mild Year-Round Temperatures', 'Cool Evening Zephyrs'],
    recommendedSpots: ['Defence Colony Canopy Walk', 'Indiranagar Club Reserve', '100 Ft Rd Tree Lane'],
    scenicRating: 5,
    description: 'An idyllic setting featuring lush evergreen tree-lined lanes, providing constant sun shading and cooling breezes even in summer.'
  },
  {
    cityName: 'Bengaluru',
    localityName: 'Jayanagar',
    avgTemp: 22,
    humidity: 55,
    greenCover: 65,
    aqi: 42,
    comfortLevel: 'Pleasantly Cool',
    comfortFeatures: ['Dense Old Banyan Linings', 'Abundant Recreational Grounds', 'Highly Oxygenated Airflow'],
    recommendedSpots: ['Ranadheera Kanteerava Park', 'Madhavan Park Walking Track', 'Shastri Nagar Greenbelt'],
    scenicRating: 5,
    description: 'Boasts an incredible layout with extensive micro-parks, ancient heritage banyans, and outstanding oxygen density.'
  },
  {
    cityName: 'Pune',
    localityName: 'Koregaon Park',
    avgTemp: 24,
    humidity: 48,
    greenCover: 60,
    aqi: 58,
    comfortLevel: 'Pleasantly Cool',
    comfortFeatures: ['Riverfront Breeze Corridor', 'Sublime Tree Canopies', 'Low Humid Suffocation'],
    recommendedSpots: ['Osho Teerth Zen Park', 'Lane 5 Green Escape Lane', 'Mula-Mutha River Promenade'],
    scenicRating: 5,
    description: 'Renowned for its vast canopy coverage and pleasant micro-wind streams triggered by proximity to the riverways.'
  },
  {
    cityName: 'Pune',
    localityName: 'Baner',
    avgTemp: 26,
    humidity: 45,
    greenCover: 42,
    aqi: 64,
    comfortLevel: 'Moderate Balanced',
    comfortFeatures: ['Hilltop Downwinds', 'Low Pollutant Density', 'High Daytime Sunlit Balance'],
    recommendedSpots: ['Baner Hill Trekking Trail', 'Balewadi Biotech High-street Park', 'Pashan Lake Shoreline'],
    scenicRating: 4,
    description: 'Blessed with delightful hill-slope winds and a dry, sunny environment making it extremely active and highly dynamic.'
  },
  {
    cityName: 'Shimla',
    localityName: 'Mall Road',
    avgTemp: 14,
    humidity: 60,
    greenCover: 85,
    aqi: 18,
    comfortLevel: 'Alpine Crisp',
    comfortFeatures: ['Bracing Mountain Altitude', 'No Vehicle Emissions (Pedestrian Only)', 'Pristine Pine-Capped Winds'],
    recommendedSpots: ['Ridge Pedestrian Plaza', 'Jakhoo Pine Forest Trail', 'Prospect Hill Peak Viewpoint'],
    scenicRating: 5,
    description: 'A genuine high-altitude mountain climate. Completely car-free, pristine pine scents, and chilling mountain drafts.'
  },
  {
    cityName: 'Ooty',
    localityName: 'Rose Garden Belt',
    avgTemp: 16,
    humidity: 68,
    greenCover: 90,
    aqi: 22,
    comfortLevel: 'Alpine Crisp',
    comfortFeatures: ['Mist Shrouded Tea Valleys', 'Highly Refreshing Eucalypt Air', 'Crisp Constant Mountain Chill'],
    recommendedSpots: ['Government Botanical Walks', 'Ooty Lake Shoreline Woods', 'Doddabetta Summit Peak'],
    scenicRating: 5,
    description: 'Constant cool tea estate winds, lingering evening fog, and heavy forest cover creating a natural outdoor thermostat.'
  },
  {
    cityName: 'Mumbai',
    localityName: 'Bandra West (Carter Road)',
    avgTemp: 28,
    humidity: 78,
    greenCover: 20,
    aqi: 72,
    comfortLevel: 'Tropical Humid',
    comfortFeatures: ['Constant Rich Sea-Breezes', 'Sunset Coastal Cool-down', 'Refreshing Open Sea-Vistas'],
    recommendedSpots: ['Carter Road Sunset Promenade', 'Bandstand Sea Walkway', 'Joggers Park Sea Shore'],
    scenicRating: 4,
    description: 'Swept by rich maritime currents from the Arabian Sea, creating high humidity but consistent, refreshing salt-sprayed evening winds.'
  },
  {
    cityName: 'Mumbai',
    localityName: 'Thane (Pokhran Road)',
    avgTemp: 27,
    humidity: 75,
    greenCover: 45,
    aqi: 80,
    comfortLevel: 'Moderate Balanced',
    comfortFeatures: ['Yeoor Hills Mountain Winds', 'Lake Microclimates', 'Dense Foliage Shade Coverage'],
    recommendedSpots: ['Upvan Lake Walking Loop', 'Yeoor Hills Forest Buffer Trail', 'Pokhran Botanical Park'],
    scenicRating: 4,
    description: 'Encircled by the pristine Yeoor hills, allowing cooler down-valley drafts to lower ambient temperatures compared to downtown.'
  },
  {
    cityName: 'Nagpur',
    localityName: 'Dharampeth',
    avgTemp: 31,
    humidity: 32,
    greenCover: 35,
    aqi: 74,
    comfortLevel: 'Warm Dry',
    comfortFeatures: ['Low Humidity Stuffiness', 'Warm Dry Sunbeams', 'Very Serene Winter Comforts'],
    recommendedSpots: ['Ambazari Lake Forest Trail', 'Sadar Cantonment Boulevards', 'Gokulpeth Walkway Corridor'],
    scenicRating: 4,
    description: 'Known for its dry, pleasant evenings and clean air. Provides fantastic sun-kissed warmth without sticking humidity.'
  },
  {
    cityName: 'Nagpur',
    localityName: 'MIHAN SEZ Layouts',
    avgTemp: 32,
    humidity: 28,
    greenCover: 40,
    aqi: 52,
    comfortLevel: 'Warm Dry',
    comfortFeatures: ['Wide Open High Wind Corridors', 'Exquisite Dust-Free SEZ Buffers', 'Stellar Open Lake Vistas'],
    recommendedSpots: ['MIHAN Mega Lake View Park', 'AIIMS Nagpur Botanical Gardens', 'SEZ Wide Boulevard Walks'],
    scenicRating: 4,
    description: 'Excellent open landscape layouts which promote heavy horizontal wind-tunnel drafts to maintain refreshing natural convective cooling.'
  },
  {
    cityName: 'Delhi NCR',
    localityName: 'Vasant Kunj Ridges',
    avgTemp: 29,
    humidity: 42,
    greenCover: 55,
    aqi: 120,
    comfortLevel: 'Warm Dry',
    comfortFeatures: ['Dense South Ridge Scrub Forests', 'Ample Open Lung Spaces', 'High Seasonal Climatic Variety'],
    recommendedSpots: ['Sanjay Van Forest Eco Walkways', 'Vasant Kunj Central Botanical Park', 'Aravalli Biodiversity Trail'],
    scenicRating: 4,
    description: 'Seated right next to the massive South Delhi scrub forests which filter dust, producing cleaner, cooler breeze compared to central districts.'
  },
  {
    cityName: 'Kochi',
    localityName: 'Fort Kochi',
    avgTemp: 27,
    humidity: 82,
    greenCover: 50,
    aqi: 32,
    comfortLevel: 'Tropical Humid',
    comfortFeatures: ['Arabian Sea Maritime Airflow', 'Historical Shaded Trees', 'Gentle Backwater Refreshers'],
    recommendedSpots: ['Fort Kochi Beach Walkways', 'Vasco Da Gama Vintage Squares', 'Chinese Fishing Net Estuary'],
    scenicRating: 5,
    description: 'Highly tropical, humid coastal settlement blessed with stunning ocean crosswinds, beautiful shaded rain-trees, and top tier Air Quality index.'
  }
];

export default function WeatherFriendlyCities() {
  const [activeTab, setActiveTab] = useState<'explore' | 'compare'>('explore');

  // Explore state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComfort, setSelectedComfort] = useState<string>('ALL');

  // Input state for Custom User City Comparison
  const [userCity, setUserCity] = useState('My Current City');
  const [userLocality, setUserLocality] = useState('My Locality');
  const [userTemp, setUserTemp] = useState(26); // Deg C
  const [userHumidity, setUserHumidity] = useState(55); // %
  const [userGreenCover, setUserGreenCover] = useState(30); // %
  const [userAqi, setUserAqi] = useState(85); // AQI index

  // Filtered list of weather friendly spots
  const filteredSpots = useMemo(() => {
    return LOCALITY_WEATHER_DB.filter(spot => {
      const matchSearch = 
        spot.cityName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        spot.localityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.comfortLevel.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchComfort = selectedComfort === 'ALL' || spot.comfortLevel === selectedComfort;
      
      return matchSearch && matchComfort;
    });
  }, [searchQuery, selectedComfort]);

  // Compute Similar Climatic Match suggestions
  const climateMatches = useMemo(() => {
    return LOCALITY_WEATHER_DB.map(spot => {
      // Euclidean distance with specific weights normalized:
      // Weight: Temp: 0.35, Humidity: 0.25, GreenCover: 0.20, AQI: 0.20
      const tempDiff = Math.abs(userTemp - spot.avgTemp) / 35; // typical max range span 35C
      const humDiff = Math.abs(userHumidity - spot.humidity) / 100;
      const greenDiff = Math.abs(userGreenCover - spot.greenCover) / 100;
      const aqiDiff = Math.abs(userAqi - spot.aqi) / 250; // typical scale range 250

      const weightedDistance = (0.35 * tempDiff) + (0.25 * humDiff) + (0.20 * greenDiff) + (0.20 * aqiDiff);
      
      // Calculate match percent
      const matchPercent = Math.max(0, Math.min(100, Math.round((1 - weightedDistance) * 100)));

      return {
        ...spot,
        matchPercent,
        tempDiff: spot.avgTemp - userTemp,
        aqiDiff: spot.aqi - userAqi
      };
    }).sort((a, b) => b.matchPercent - a.matchPercent);
  }, [userTemp, userHumidity, userGreenCover, userAqi]);

  const comfortTags = ['ALL', 'Alpine Crisp', 'Pleasantly Cool', 'Moderate Balanced', 'Tropical Humid', 'Warm Dry'];

  return (
    <div id="weather-comfort-root" className="space-y-6 text-left animate-fadeIn">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-[#0E1F35] to-teal-905 p-6 rounded-3xl text-white border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-40 h-40 animate-spin-slow rotate-12" />
        </div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            🌦️ Climatic Comfort Navigation Index
          </span>
          <h4 className="text-lg font-black uppercase tracking-tight pt-1">Weather Friendly Cities & Localities</h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
            Real estate is not just concrete; it is climate, comfort, and breathing spaces. Explore localities sorted by microclimate comfort, high green canopy levels, low AQI scores, and serene wind tunnels.
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'explore'
              ? 'border-[#0EA5E9] text-gray-900 font-extrabold'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore Climates & Spots</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'compare'
              ? 'border-[#0EA5E9] text-gray-900 font-extrabold'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span>Climatic Match Comparer</span>
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute ml-52 mt-[-5px]" />
        </button>
      </div>

      {/* TAB 1: EXPLORE LOCATIONS BY COMFORT AND VERIFIED PLACES */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, locality or status..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all shadow-2xs"
              />
            </div>

            {/* Comfort Filter Pill Buttons */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {comfortTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedComfort(tag)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedComfort === tag
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.length > 0 ? (
              filteredSpots.map((spot) => {
                const isExcellentAqi = spot.aqi < 50;
                const isHot = spot.avgTemp > 30;
                return (
                  <div 
                    key={`${spot.cityName}-${spot.localityName}`} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Name Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-wider text-[#004C5C] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {spot.cityName}
                          </span>
                          <h5 className="text-[13px] font-black tracking-tight text-slate-800 uppercase mt-1">
                            {spot.localityName}
                          </h5>
                        </div>
                        
                        {/* Comfort Status tag */}
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          spot.comfortLevel === 'Alpine Crisp' ? 'bg-cyan-100 text-cyan-800' :
                          spot.comfortLevel === 'Pleasantly Cool' ? 'bg-emerald-100 text-emerald-800' :
                          spot.comfortLevel === 'Moderate Balanced' ? 'bg-blue-105 text-blue-800' :
                          spot.comfortLevel === 'Tropical Humid' ? 'bg-amber-100 text-amber-800' :
                          'bg-orange-100 text-orange-850'
                        }`}>
                          {spot.comfortLevel}
                        </span>
                      </div>

                      {/* Brief parameters stats */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 text-center">
                          <span className="text-[7.5px] font-extrabold text-slate-400 block uppercase">Temperature</span>
                          <span className="text-xs font-black text-slate-700 font-mono mt-0.5 block flex items-center justify-center gap-0.5">
                            <Thermometer className="w-3 h-3 text-rose-500" />
                            {spot.avgTemp}°C
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 text-center">
                          <span className="text-[7.5px] font-extrabold text-slate-400 block uppercase">Canopy Cover</span>
                          <span className="text-xs font-black text-slate-700 font-mono mt-0.5 block flex items-center justify-center gap-0.5">
                            <Trees className="w-3 h-3 text-emerald-500" />
                            {spot.greenCover}%
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 text-center">
                          <span className="text-[7.5px] font-extrabold text-slate-400 block uppercase">AQI Index</span>
                          <span className={`text-xs font-black font-mono mt-0.5 block ${isExcellentAqi ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {spot.aqi} {isExcellentAqi ? '✓' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Description phrase */}
                      <p className="text-[10px] text-slate-550 font-semibold leading-relaxed pt-1 select-none">
                        {spot.description}
                      </p>

                      {/* Microclimatic features tags list */}
                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <span className="text-[8px] font-black uppercase text-slate-405 block">Microclimate Benefits:</span>
                        <div className="flex flex-wrap gap-1 leading-normal">
                          {spot.comfortFeatures.map((feat, i) => (
                            <span key={i} className="text-[8px] font-extrabold bg-slate-50 text-slate-600 border border-slate-205/60 rounded px-1.5 py-0.5">
                              • {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Best Local Relax Spots list */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[8px] font-black uppercase text-slate-405 block flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Climatic Walking/Relax Spots:
                        </span>
                        <div className="space-y-1">
                          {spot.recommendedSpots.map((place, i) => (
                            <div key={i} className="bg-slate-50/70 py-1 px-2 border-l-2 border-indigo-500 rounded-r flex justify-between items-center text-[9px] font-extrabold text-slate-705">
                              <span>🏡 {place}</span>
                              <span className="text-[7.5px] text-indigo-600 uppercase font-black tracking-wider">VERIFIED PLACE</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Scenic Stars Rating and CTA */}
                    <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-slate-100">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={`text-[10px] ${idx < spot.scenicRating ? 'text-amber-400' : 'text-gray-200'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-[8px] text-slate-400 font-bold ml-1">scenic index</span>
                      </div>
                      <span className="text-[8px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                        VIEW CLIMATE DETAILS <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                <p className="text-xs font-bold font-mono">No city or comforting spots found matching "{searchQuery}" in categories.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedComfort('ALL'); }}
                  className="bg-slate-900 text-white font-extrabold uppercase px-3 py-1.5 text-[9px] rounded-lg cursor-pointer"
                >
                  Reset parameters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLIMATIC COMPARATIVE MATCH SUGGESTION ENGINE */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Input Slider Box (left 5 cols) */}
            <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-3xl p-5 border border-slate-800 font-sans space-y-5 shadow-lg">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[8px] text-amber-400 font-extrabold uppercase tracking-widest block flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-amber-500" /> CLIMATIC PROFILER INPUT
                </span>
                <h5 className="text-xs font-black uppercase tracking-tight text-white mt-0.5">Type Your Current Environment Conditions</h5>
              </div>

              {/* Textual parameters inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8.5px] font-extrabold uppercase text-slate-400 block">CURRENT CITY NAME</label>
                  <input
                    type="text"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs font-bold rounded-lg p-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Nagpur"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8.5px] font-extrabold uppercase text-slate-400 block">LOCALITY OR SUBURB</label>
                  <input
                    type="text"
                    value={userLocality}
                    onChange={(e) => setUserLocality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs font-bold rounded-lg p-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Wardha Road"
                  />
                </div>
              </div>

              {/* Range sliders */}
              <div className="space-y-4 pt-1 text-left">
                {/* Temp */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300 font-bold">
                    <span>Average Temperature</span>
                    <span className="text-amber-300">{userTemp} °C</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="45" 
                    value={userTemp} 
                    onChange={(e) => setUserTemp(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>5°C Chill</span>
                    <span>45°C Peak Heat</span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300 font-bold">
                    <span>Humidity Level</span>
                    <span className="text-[#00EAFF]">{userHumidity} %</span>
                  </div>
                  <input 
                    type="range" 
                    min="15" 
                    max="95" 
                    value={userHumidity} 
                    onChange={(e) => setUserHumidity(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>15% Dry desert</span>
                    <span>95% Coastal wet</span>
                  </div>
                </div>

                {/* Green Canopy Cover */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300 font-bold">
                    <span>Green Canopy Forest Cover</span>
                    <span className="text-emerald-400">{userGreenCover} %</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="95" 
                    value={userGreenCover} 
                    onChange={(e) => setUserGreenCover(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>5% Concrete city</span>
                    <span>95% Evergreen wood</span>
                  </div>
                </div>

                {/* AQI Index */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300 font-bold">
                    <span>Air Quality Index (AQI)</span>
                    <span className={`px-1.5 py-0.5 rounded font-black text-[9px] ${
                      userAqi < 50 ? 'bg-emerald-500/20 text-emerald-400' :
                      userAqi < 100 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-rose-400'
                    }`}>{userAqi} AQI</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="300" 
                    value={userAqi} 
                    onChange={(e) => setUserAqi(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>10 Mountain Fresh</span>
                    <span>300 Dense Smog</span>
                  </div>
                </div>
              </div>

              {/* Explanatory notes */}
              <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl text-[9px] text-slate-400 leading-normal flex items-start gap-2 select-none text-left">
                <Compass className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  The similarity index utilizes a weighted-distance statistical modeling algorithm (Temperature 35%, Humidity 25%, Forestry Canopy 20%, particulate AQI 20%) to match your ideal or current comfort preferences to verified Indian microclimates.
                </span>
              </div>
            </div>

            {/* Results comparative list (right 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                  🎯 RECOMMENDED BEST GEOGRAPHIC CLIMATIC MATCHES
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-100">
                  Calculated Live
                </span>
              </div>

              <div className="space-y-3">
                {climateMatches.slice(0, 4).map((match, index) => {
                  const isTopMatch = index === 0 && match.matchPercent >= 80;
                  return (
                    <div 
                      key={match.localityName}
                      className={`border rounded-2xl p-4.5 bg-white text-left transition-all hover:translate-x-1 duration-300 relative overflow-hidden ${
                        isTopMatch 
                          ? 'border-emerald-500 ring-1 ring-emerald-500/10 shadow-md'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Top Match Glimmer badge */}
                      {isTopMatch && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white font-black text-[8.5px] uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1.5 shadow-sm">
                          <CheckCircle className="w-3 h-3" /> BEST WEATHER MATCH
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-[#004C5C] uppercase bg-teal-50 border border-teal-150 px-2.5 py-0.5 rounded">
                              {match.cityName}
                            </span>
                            <span className="text-xs font-black text-slate-800 uppercase">
                              {match.localityName}
                            </span>
                          </div>
                          
                          <p className="text-[9.5px] text-slate-500 font-bold select-none max-w-md">
                            {match.description}
                          </p>
                        </div>

                        {/* Match Progress Ring or count */}
                        <div className="text-right shrink-0">
                          <span className={`text-[15px] font-black font-mono block ${
                            match.matchPercent >= 85 ? 'text-emerald-600' :
                            match.matchPercent >= 70 ? 'text-amber-500' :
                            'text-slate-500'
                          }`}>
                            {match.matchPercent} %
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">Match index</span>
                        </div>
                      </div>

                      {/* Matching comparison metrics bars */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-[10px] select-none text-slate-650">
                        {/* Temp comparative */}
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <span className="text-[7px] text-slate-400 font-extrabold uppercase block leading-normal">Temperature compare</span>
                          <span className="font-extrabold text-slate-800 block">
                            {match.avgTemp} °C{' '}
                            <span className={`text-[8px] font-bold ${match.tempDiff > 0 ? 'text-rose-500' : 'text-blue-500'}`}>
                              ({match.tempDiff > 0 ? `+${match.tempDiff}` : match.tempDiff}°C)
                            </span>
                          </span>
                        </div>

                        {/* Canopy comparative */}
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <span className="text-[7px] text-slate-400 font-extrabold uppercase block leading-normal">Forest Cover compare</span>
                          <span className="font-extrabold text-slate-800 block">
                            {match.greenCover} %{' '}
                            <span className="text-[8.5px] font-bold text-slate-400">
                              (vs {userGreenCover}%)
                            </span>
                          </span>
                        </div>

                        {/* Humidity compare */}
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <span className="text-[7px] text-slate-400 font-extrabold uppercase block leading-normal">Humidity compare</span>
                          <span className="font-extrabold text-slate-800 block">
                            {match.humidity} %{' '}
                            <span className="text-[8.5px] font-bold text-slate-400">
                              (vs {userHumidity}%)
                            </span>
                          </span>
                        </div>

                        {/* AQI compare */}
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <span className="text-[7px] text-slate-400 font-extrabold uppercase block leading-normal">AQI Compare</span>
                          <span className="font-extrabold text-slate-800 block">
                            {match.aqi} AQI{' '}
                            <span className={`text-[8px] font-bold ${match.aqiDiff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              ({match.aqiDiff > 0 ? `+${match.aqiDiff}` : match.aqiDiff})
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Best local recommendation banner */}
                      <div className="mt-3 bg-slate-50 border border-slate-205/65 rounded-xl p-2.5 flex items-center justify-between text-[9px] font-extrabold text-slate-650">
                        <span>💡 Local comfort feature: <strong className="text-slate-800">{match.comfortFeatures[0]}</strong></span>
                        <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 uppercase text-[8px] font-black px-1.5 py-0.5 rounded">
                          Comfort Rating: {match.scenicRating}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative alert about dynamic sync */}
              <div className="bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-r-2xl p-4 text-xs font-bold space-y-1 flex items-start gap-2.5 text-left select-none leading-relaxed">
                <Activity className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="uppercase text-[9.5px] font-black block">Real-time matching active</span>
                  <span>
                    Try adjusting the Ambient parameters on the left slider (e.g. drop the Temperature to 15°C or raise Green Canopy to 80%) to see the matching engine suggestions dynamically re-rank alpine clean destinations like <strong>Ooty (Rose Garden Belt)</strong> or <strong>Shimla (Mall Road)</strong> in real-time!
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
