import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { 
  MapPin, 
  Thermometer, 
  ShieldAlert, 
  Waves, 
  Droplet, 
  Trees, 
  Compass, 
  BookOpen, 
  Activity, 
  Sparkles, 
  AlertTriangle,
  CloudRain,
  Volume2,
  Wind,
  Info,
  ChevronRight,
  School,
  HeartPulse,
  Flame,
  TrendingDown
} from 'lucide-react';

export interface PropertyDetail {
  id: string;
  title: string;
  location: string;
  locationDetailed: string;
  price: string;
  type: string;
  propertyId: string;
  status: string;
  area: string;
  beds: number | string;
  baths: number | string;
  image: string;
  descriptionParagraphs: string[];
  amenities: string[];
}

interface PropertyDetailViewProps {
  property: PropertyDetail;
  onBackToHome: () => void;
}

export interface ClimateData {
  name: string;
  temp: number;
  subtext: string;
  aqi: number;
  aqiLabel: string;
  aqiColor: string;
  rainfall: number;
  greenCover: number;
  noiseLevel: number; // in dB
  waterAccess: number;
  floodRisk: number;
  overallScore: number;
  localTemps: { area: string; temp: number }[];
  schools: { name: string; dist: string; rating: string }[];
  hospitals: { name: string; dist: string; specialty: string }[];
}

export function getLocalityClimateData(locationStr: string): ClimateData {
  const loc = (locationStr || '').toLowerCase();
  
  if (loc.includes('dharampeth')) {
    return {
      name: 'Dharampeth Elite Zone',
      temp: 42,
      subtext: 'Older dense canopy zone, premium cooling buffer effects',
      aqi: 72,
      aqiLabel: 'Good-Moderate (72)',
      aqiColor: 'text-amber-600 bg-amber-50 border-amber-200',
      rainfall: 1100,
      greenCover: 78,
      noiseLevel: 62,
      waterAccess: 95,
      floodRisk: 10,
      overallScore: 8.5,
      localTemps: [
        { area: 'Dharampeth Core Market', temp: 42 },
        { area: 'Gokulpeth Canopy Zone', temp: 40 },
        { area: 'Ramdaspeth Residential Link', temp: 41 },
        { area: 'WHC Avenue green space', temp: 39 }, // Cooler due to massive structural trees
      ],
      schools: [
        { name: 'Dharampeth Public School', dist: '0.4 km', rating: '4.8/5' },
        { name: 'Saraswati Girls High School', dist: '1.1 km', rating: '4.6/5' },
        { name: 'Ramlal Technology Institute', dist: '1.5 km', rating: '4.5/5' }
      ],
      hospitals: [
        { name: 'Sengupta Critical Hospital', dist: '0.6 km', specialty: 'General & Trauma care' },
        { name: 'Mure Memorial Hospital', dist: '1.2 km', specialty: 'Multi-specialty emergency' },
        { name: 'Dharampeth Childrens Clinic', dist: '1.8 km', specialty: 'Pediatrics department' }
      ]
    };
  } else if (loc.includes('wardha') || loc.includes('besa') || loc.includes('somalwada') || loc.includes('piyush')) {
    return {
      name: 'Wardha Road Development Corridor',
      temp: 40,
      subtext: 'High commercial integration, open layouts, modern corridors',
      aqi: 82,
      aqiLabel: 'Moderate (82)',
      aqiColor: 'text-amber-700 bg-amber-50 border-orange-200',
      rainfall: 1050,
      greenCover: 62,
      noiseLevel: 68,
      waterAccess: 88,
      floodRisk: 15,
      overallScore: 7.9,
      localTemps: [
        { area: 'Wardha Road Outer Freeway', temp: 41 },
        { area: 'Besa Residential Blocks', temp: 40 },
        { area: 'Somalwada Metro Link', temp: 39 },
        { area: 'MIHAN SEZ Afforested Border', temp: 37 }, // Cooler due to systematic plantations
      ],
      schools: [
        { name: 'Sandipani School (Wardha)', dist: '0.9 km', rating: '4.8/5' },
        { name: 'St. Vincent Pallotti Academy', dist: '1.6. km', rating: '4.7/5' },
        { name: 'School of Scholars Nagpur', dist: '2.4 km', rating: '4.5/5' }
      ],
      hospitals: [
        { name: 'Narayana Multispeciality Hospital', dist: '1.1 km', specialty: 'Cardiac & General surgery' },
        { name: 'Orion Advanced Critical Center', dist: '2.0 km', specialty: 'Neurology focus' },
        { name: 'AIIMS Nagpur Extension Clinic', dist: '3.5 km', specialty: 'Tertiary healthcare' }
      ]
    };
  } else if (loc.includes('manish nagar')) {
    return {
      name: 'Manish Nagar High-Density Block',
      temp: 41,
      subtext: 'Dense layout, high concrete build ratio',
      aqi: 92,
      aqiLabel: 'Hazardous for Sensitive Groups (92)',
      aqiColor: 'text-rose-600 bg-red-50 border-red-200',
      rainfall: 1080,
      greenCover: 46,
      noiseLevel: 75,
      waterAccess: 82,
      floodRisk: 35, // Low-lying pockets near railway line
      overallScore: 7.1,
      localTemps: [
        { area: 'Manish Nagar Crossing High Rise', temp: 43 }, // High heat island effect!
        { area: 'Sambhaji Nagar Block A', temp: 41 },
        { area: 'Beltarodi Connection Rd', temp: 40 },
        { area: 'Railway Double Line Canopy', temp: 39 },
      ],
      schools: [
        { name: 'Center Point School (Manish Nagar)', dist: '1.2 km', rating: '4.9/5' },
        { name: 'Royal Heritage Global School', dist: '1.8 km', rating: '4.4/5' },
        { name: 'Little Flowers Primary Academy', dist: '0.5 km', rating: '4.5/5' }
      ],
      hospitals: [
        { name: 'Kunal Multispecialty Center', dist: '0.8 km', specialty: 'Comprehensive ICU' },
        { name: 'Suretech Cardio Care', dist: '2.1 km', specialty: 'Cardiovascular expert group' },
        { name: 'Sanjeevani Clinic & Diagnostics', dist: '0.3 km', specialty: 'Primary consulting' }
      ]
    };
  } else {
    // Default / Koradi / Rural Belt / Outskirts
    return {
      name: 'Khapri-Koradi Outer Green Belt',
      temp: 36,
      subtext: 'Lush thermal absorption zones, dense agro-canopies',
      aqi: 42,
      aqiLabel: 'Good & Healthy (42)',
      aqiColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      rainfall: 1160,
      greenCover: 88,
      noiseLevel: 44,
      waterAccess: 80, // Tanker connection dependent
      floodRisk: 5,
      overallScore: 8.8,
      localTemps: [
        { area: 'Outer Ring Road Plantation Belt', temp: 36 },
        { area: 'Koradi Lake Cool Shore', temp: 34 }, // Lakefront microclimate cooling
        { area: 'Rural Agro Holdings', temp: 35 },
        { area: 'Gokuldham Green Estate', temp: 36 },
      ],
      schools: [
        { name: 'Bhavans Vidya Mandir (Ashti)', dist: '2.5 km', rating: '4.9/5' },
        { name: 'Podar International Outer Campus', dist: '3.1 km', rating: '4.6/5' },
        { name: 'Greenfields Agro Public Academy', dist: '1.2 km', rating: '4.4/5' }
      ],
      hospitals: [
        { name: 'Alexia Critical Hospital', dist: '2.6 km', specialty: 'Emergency trauma desk' },
        { name: 'Primary Rural Health Centre Koradi', dist: '1.5 km', specialty: 'Outpatient treatment' },
        { name: 'Radhakrishna Charitable Trust Hospital', dist: '4.0 km', specialty: 'Low cost care' }
      ]
    };
  }
}

export default function PropertyDetailView({ property, onBackToHome }: PropertyDetailViewProps) {
  const [localityTab, setLocalityTab] = useState<'climate' | 'thermalMap' | 'institutions'>('climate');
  const climate = getLocalityClimateData(property.location);

  // Split amenities into three columns as shown in the screenshot
  const colSize = Math.ceil(property.amenities.length / 3);
  const col1 = property.amenities.slice(0, colSize);
  const col2 = property.amenities.slice(colSize, colSize * 2);
  const col3 = property.amenities.slice(colSize * 2);

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-12 max-w-7xl mx-auto animate-fadeIn select-none">
      {/* Breadcrumbs & Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-8 gap-4">
        
        {/* Title and Subtitle with a vertical orange accent line */}
        <div className="border-l-4 border-[#FFA500] pl-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {property.title}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            {property.location}
          </p>
        </div>

        {/* Breadcrumb links */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-400 select-none">
          <button 
            onClick={onBackToHome}
            className="hover:text-amber-700 hover:underline transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button 
            onClick={onBackToHome}
            className="hover:text-amber-700 hover:underline transition-colors cursor-pointer"
          >
            Properties
          </button>
          <span>/</span>
          <span className="text-slate-800">{property.title}</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image and Quick Summary */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Main Property Image with high visual craft */}
          <div className="relative rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-[280px] sm:h-[360px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Summary Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Quick Summary
              </h2>
              {/* Short horizontal orange underline */}
              <div className="w-16 h-1 bg-[#FFA500] mt-1.5" />
            </div>

            {/* Spec list */}
            <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Property ID:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.propertyId}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Location:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.locationDetailed}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Property Type:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.type}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Status:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500 uppercase tracking-wide">{property.status}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Area:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.area}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Beds:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.beds}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Baths:</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-500">{property.baths}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Price Range:</span>
                <span className="font-extrabold text-xs sm:text-sm text-orange-600">{property.price}</span>
              </div>
              {/* Climate integration for comparisons */}
              <div className="flex justify-between py-3 bg-rose-50/40 px-2 rounded-lg border border-rose-100/60 mt-1">
                <span className="font-extrabold text-xs sm:text-sm text-rose-950 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Locality Weather:
                </span>
                <span className="font-black text-xs sm:text-sm text-rose-700 font-mono">{climate.overallScore}/10 Score</span>
              </div>
              <div className="flex justify-between py-3 px-2">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Avg Summer Temp:</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-600 font-mono">{climate.temp}°C</span>
              </div>
              <div className="flex justify-between py-3 px-2">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Air Quality Indicator:</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-600">{climate.aqi <= 50 ? '🟢 Good' : climate.aqi <= 80 ? '🟡 Moderate' : '🟠 Sensitive'} ({climate.aqi} AQI)</span>
              </div>
              <div className="flex justify-between py-3 px-2">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">Green Canopy Cover:</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-600">{climate.greenCover >= 70 ? '🌲 High' : '🌱 Moderate'} ({climate.greenCover}%)</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 select-none">
              <button
                onClick={() => alert(`Inquiry submitted for ${property.title}! An agent will contact you shortly.`)}
                className="w-full bg-[#0E1F35] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow cursor-pointer text-center block"
              >
                Inquire About Property
              </button>
              
              <a
                href={`https://api.whatsapp.com/send?phone=919850843447&text=${encodeURIComponent(`Hi, I saw your premium property listing "${property.title}" (ID: ${property.propertyId}) listed for ${property.price} on Urban Nest. I would like to ask some questions and schedule a virtual tour. Is it still available?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[11px] uppercase tracking-wider py-3.5 rounded-xl transition-all shadow cursor-pointer text-center flex items-center justify-center gap-1.5 border border-emerald-500/15"
              >
                <svg className="w-4 h-4 fill-current animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                </svg>
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Property Description and Amenities */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Property Description */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Property Description
              </h2>
              {/* Short horizontal orange underline */}
              <div className="w-16 h-1 bg-[#FFA500] mt-1.5" />
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed text-slate-600">
              {property.descriptionParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Amenities
              </h2>
              {/* Short horizontal orange underline */}
              <div className="w-16 h-1 bg-[#FFA500] mt-1.5" />
            </div>

            {/* List with clean layout split into responsive three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-2 text-xs sm:text-sm font-semibold text-slate-800 pt-2">
              {/* Column 1 */}
              <ul className="space-y-2.5">
                {col1.map((amenity, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-extrabold shrink-0">—</span>
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>

              {/* Column 2 */}
              <ul className="space-y-2.5">
                {col2.map((amenity, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-extrabold shrink-0">—</span>
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>

              {/* Column 3 */}
              <ul className="space-y-2.5">
                {col3.map((amenity, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-extrabold shrink-0">—</span>
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* 🌍 LOCALITY CLIMATE INTELLIGENCE & INFRA CONSOLE */}
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 select-none text-left font-sans">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <span className="bg-[#0E1F35] text-[#B38330] text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#B38330]" /> Green & Climate Intelligence
            </span>
            <h2 className="text-xl font-black text-[#0E1F35] mt-1.5 uppercase tracking-wide font-serif">
              Locality Environment & Climate Index
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Verify temperature drops, AQI hazards, water viability, nearby schools, and medical assets for <span className="text-[#B38330]">{climate.name}</span>.
            </p>
          </div>

          {/* Environmental Health Score badge */}
          <div className="bg-[#0E1F35] text-white px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="bg-emerald-900/30 p-1.5 rounded-lg border border-emerald-500/20">
              <Compass className="w-5 h-5 text-[#B38330]" />
            </div>
            <div>
              <span className="text-[9px] text-[#B38330] font-black uppercase tracking-wider block">Health & Climate Index</span>
              <span className="text-sm font-black text-white font-mono tracking-wide">{climate.overallScore}/10 Overall</span>
            </div>
          </div>
        </div>

        {/* Console Nav Bar */}
        <div className="grid grid-cols-3 bg-white border border-slate-200 rounded-2xl p-1 gap-1 mb-8 max-w-lg">
          <button
            type="button"
            onClick={() => setLocalityTab('climate')}
            className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              localityTab === 'climate'
                ? 'bg-[#0E1F35] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Climate Stats
          </button>

          <button
            type="button"
            onClick={() => setLocalityTab('thermalMap')}
            className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              localityTab === 'thermalMap'
                ? 'bg-[#0E1F35] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Thermal Heat Map
          </button>

          <button
            type="button"
            onClick={() => setLocalityTab('institutions')}
            className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              localityTab === 'institutions'
                ? 'bg-[#0E1F35] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Social Assets
          </button>
        </div>

        {/* ======================= TAB A: CLIMATE CORE METRICS ======================= */}
        {localityTab === 'climate' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Air & AQI Card */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-600 block w-fit">
                  <Wind className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-550 font-mono">Real-Time Sensor</span>
              </div>
              <h3 className="text-[11px] text-slate-450 font-black uppercase tracking-widest block">Air Quality Index</h3>
              <span className="text-2xl font-black text-[#0E1F35] font-mono mt-1 block">{climate.aqi} AQI</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border rounded-full mt-2.5 inline-block ${climate.aqiColor}`}>
                {climate.aqiLabel}
              </span>
              <p className="text-[11px] text-slate-500 font-bold leading-normal mt-3">
                PM2.5 particulate levels tracked via civic sensing nodes. {climate.aqi <= 50 ? 'Pristine respiratory atmosphere.' : 'Moderate concentrations present.'}
              </p>
            </div>

            {/* Precipitation & Greenery */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2.5 bg-[#B38330]/10 rounded-xl border border-[#B38330]/20 text-[#B38330] block w-fit col-span-1">
                  <Droplet className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-550 font-mono">Civic Rainfall</span>
              </div>
              <h3 className="text-[11px] text-slate-450 font-black uppercase tracking-widest block">Precipitation & Cover</h3>
              <span className="text-2xl font-black text-[#0E1F35] font-mono mt-1 block">{climate.rainfall} mm/year</span>
              <div className="mt-3.5 space-y-2">
                <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                  <span>Green Canopy Focus</span>
                  <span>{climate.greenCover}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#B38330]. h-full rounded-full transition-all duration-700" style={{ width: `${climate.greenCover}%` }}></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-normal mt-3">
                Precipitation fuels natural vegetation buffers. Older canopy foliage lowers surface radiation substantially.
              </p>
            </div>

            {/* Micro Infrastructures Health Gauge */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 block w-fit">
                  <Waves className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-550 font-mono">Infrastructure</span>
              </div>
              <h3 className="text-[11px] text-slate-450 font-black uppercase tracking-widest block">Water & Flood Safety</h3>
              <div className="grid grid-cols-2 gap-3.5 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Flood Risk</span>
                  <span className={`text-sm font-black font-mono ${climate.floodRisk < 15 ? 'text-emerald-650' : 'text-amber-600'}`}>{climate.floodRisk}% Avg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tap Integrity</span>
                  <span className="text-sm font-black text-[#0E1F35] font-mono">{climate.waterAccess}% Potable</span>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Ground Noise Level: <span className="font-mono text-[#0E1F35]">{climate.noiseLevel} dB (Clean)</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================= TAB B: MICRO-THERMAL MAP DATA ======================= */}
        {localityTab === 'thermalMap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 animate-fadeIn bg-white border border-slate-200 rounded-2.5xl p-5 sm:p-6 text-left">
            
            {/* Interactive map visualization block */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-500 animate-pulse" /> Microclimatic Summer Thermal Drift Overlay
              </h3>
              <p className="text-xs text-slate-650 leading-relaxed font-bold">
                Heavy concrete structures and asphalt corridors create thermal high pockets (Heat Island effect). Buyers searching for plots or villas frequently select outer bands which register <strong>3°C to 5°C cooler temperatures</strong>.
              </p>

              {/* Layout Map Representation */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                <span className="text-[9px] text-[#B38330] font-black uppercase tracking-widest block">Local Comparison Thermal Indexes</span>
                
                <div className="space-y-3">
                  {climate.localTemps.map((tempItem, idx) => {
                    const isCore = tempItem.temp >= 41;
                    return (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 flex justify-between items-center shadow-xs">
                        <div>
                          <span className="text-xs font-black text-slate-800">{tempItem.area}</span>
                          <span className="text-[9px] text-slate-400 block font-semibold">{isCore ? '🔴 High urban surface heat concentration' : '🟢 Cooler shaded park/lakefront parcel'}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`w-2.5 h-2.5 rounded-full ${isCore ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${isCore ? 'text-red-700 bg-red-50 font-bold' : 'text-emerald-700 bg-emerald-50'}`}>{tempItem.temp}°C</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scientific Breakdown Sidebar */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 space-y-4 font-mono text-xs">
              <div>
                <span className="bg-red-950/40 border border-red-500/20 text-rose-400 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit mb-3">
                  <Flame className="w-3 h-3 text-rose-500 animate-pulse" /> Summer Heat Analysis
                </span>
                <p className="leading-relaxed font-semibold text-slate-350 text-[11px]">
                  Unlike uniform weather feeds, our microclimatic maps calculate ground-sensor readings factoring in trees, building densities, and concrete ratios.
                </p>

                <div className="mt-4 border-t border-slate-800 pt-4 space-y-2.5 text-[11px] text-slate-350 font-bold">
                  <div className="flex justify-between font-mono">
                    <span>Average Summer Gradient:</span>
                    <span className="text-[#B38330] font-bold">{climate.temp}°C Avg</span>
                  </div>
                  <div className="flex justify-between font-mono font-bold">
                    <span>Peak Heat Island Mitigation:</span>
                    <span className="text-emerald-400">-{ (43 - climate.temp) > 0 ? (43 - climate.temp) : 0 }°C cooling benefit</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Environmental Cover:</span>
                    <span className="text-slate-250 font-bold">{climate.greenCover >= 70 ? 'Optimal Shading' : 'Moderate Shading'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate- translation-all text-slate-400 leading-normal font-semibold">
                ℹ️ Plot buyers see immediate long-term RERA value appreciation with trees and low radiation.
              </div>
            </div>

          </div>
        )}

        {/* ======================= TAB C: SOCIAL ASSETS (SCHOOLS, HOSPITALS) ======================= */}
        {localityTab === 'institutions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Schools & Academics */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-5">
              <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-1.5 mb-4 pb-2 border-b border-slate-100">
                <School className="w-4 h-4 text-slate-650" /> Nearby Educational Institutions
              </h4>
              <div className="space-y-3">
                {climate.schools.map((school, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
                    <div>
                      <span className="text-xs font-black text-[#0E1F35] block">{school.name}</span>
                      <span className="text-[9px] text-[#B38330] font-extrabold uppercase select-none">Nagpur CBSE / State Board</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block font-mono">{school.dist}</span>
                      <span className="text-[9px] text-slate-450 block font-bold font-mono">Rating: {school.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Infrastructure */}
            <div className="bg-white border border-slate-200 rounded-2.5xl p-5">
              <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-1.5 mb-4 pb-2 border-b border-slate-100">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" /> Nearby Health & Hospital Centers
              </h4>
              <div className="space-y-3">
                {climate.hospitals.map((hosp, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
                    <div>
                      <span className="text-xs font-black text-[#0E1F35] block">{hosp.name}</span>
                      <span className="text-[9px] text-slate-400 block font-semibold">{hosp.specialty}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block font-mono">{hosp.dist}</span>
                      <span className="text-[9px] text-emerald-650 block font-bold uppercase tracking-wider">Emergency Care</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Direct back button at bottom */}
      <div className="mt-12 pt-6 border-t border-gray-100 flex justify-start">
        <button 
          onClick={onBackToHome}
          className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 flex items-center gap-2 cursor-pointer transition-colors"
        >
          ← Back to All Properties
        </button>
      </div>
    </div>
  );
}
