import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, Home, Building, Plus, Landmark, Sparkles, Mic, MicOff, KeyRound, Users, DollarSign, HelpCircle } from 'lucide-react';
import { TabType, PropertyListing } from '../types';

// Import our custom generated hero image
// @ts-ignore
import heroImg1 from '../assets/images/home_hero_1779448691029.png';
// @ts-ignore
import orangeVillaImg from '../assets/images/orange_villa_1779450943253.png';

const HERO_SLIDES = [
  {
    image: orangeVillaImg,
    title: 'Heritage Clay-Roof Mansion',
    subtitle: 'Classic sub-tropical architecture with spacious compound walls.',
    dialogue: (
      <>
        Don't wait to buy <span className="text-[#FF0101] font-black">REAL ESTATE</span>,<br />
        Buy <span className="text-[#FF0101] font-black">REAL ESTATE</span> and wait.
      </>
    )
  },
  {
    image: heroImg1,
    title: 'Modern White Villa',
    subtitle: 'Pristine architectural masterpiece with spacious private gardens.',
    dialogue: (
      <>
        <span className="text-[#FF0101] font-black">HOME</span> is where your <span className="text-[#FF0101] font-black">STORY</span><br />
        begins.
      </>
    )
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=60',
    title: 'Executive Suburban Residence',
    subtitle: 'Close to prominent tech hubs and educational institutions.',
    dialogue: (
      <>
        The best investment on <span className="text-[#0E1F35] font-black">EARTH</span> is<br />
        <span className="text-[#FF0101] font-black">HOME</span> itself.
      </>
    )
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=60',
    title: 'Sunset Estate',
    subtitle: 'Expansive family pool deck, outdoor kitchen, and high ceilings.',
    dialogue: (
      <>
        Your aspiration of <span className="text-[#0E1F35] font-black">LAND</span> is<br />
        the key to <span className="text-[#FF0101] font-black">HOME</span> ownership.
      </>
    )
  }
];

const MOCK_PROPERTIES: PropertyListing[] = [
  // Buy Listings
  {
    id: 'b1',
    title: 'Emerald Luxury Suite',
    location: 'Sadar, Nagpur',
    price: '₹ 85 Lac',
    type: 'Buy',
    bhk: '3 BHK',
    area: '1,840 sqft',
    features: ['Swimming Pool', 'Security Council', '2 Covered Garages', 'Near Sadar Metro'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b2',
    title: 'The Golden Crest Villa',
    location: 'Wardha Road, Nagpur',
    price: '₹ 1.50 Cr',
    type: 'Buy',
    bhk: '4 BHK',
    area: '3,200 sqft',
    features: ['Garden View', 'Jacuzzi Spa', 'Modular Kitchen', 'RERA Registered'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b3',
    title: 'Godrej Anandam Premium Flat',
    location: 'Ganeshpeth, Nagpur',
    price: '₹ 1.20 Cr',
    type: 'Buy',
    bhk: '3 BHK',
    area: '1,650 sqft',
    features: ['Luxury Clubhouse', '100% Power Backup', 'Nagpur Center Locality'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b4',
    title: 'Shiv Kailasa Majestic Residence',
    location: 'Mihan, Nagpur',
    price: '₹ 65 Lac',
    type: 'Buy',
    bhk: '2 BHK',
    area: '1,200 sqft',
    features: ['IT Hub proximity', 'Swimming Pool', 'Premium Gym Access'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80'
  },

  // Sell - listings the user can pretend to contact to list
  {
    id: 's1',
    title: 'Nagpur Estate Valuer & Brokerage',
    location: 'Ramdaspeth, Nagpur',
    price: 'Top Market Valuation',
    type: 'Sell',
    area: 'Any size',
    features: ['Professional Appraisal', 'HD Drone Listing Photography', 'Premium Advertisement Network'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 's2',
    title: 'Rapid Resale Home Platform',
    location: 'Dharampeth, Nagpur',
    price: 'Highest Valued Estimator',
    type: 'Sell',
    area: 'Resale Units',
    features: ['Immediate Cash Buyers', 'Land Registry Verification Help', 'Clear Property Title check'],
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=500&q=80'
  },

  // Rent Listings
  {
    id: 'r1',
    title: 'Urban Cozy Apartment',
    location: 'Dhantoli, Nagpur',
    price: '₹ 18,000 / mo',
    type: 'Rent',
    bhk: '2 BHK',
    area: '1,100 sqft',
    features: ['Furnished', 'Near Medical Square Metro', 'Gym Access'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'r2',
    title: 'Skyview Penthouse Suite',
    location: 'Manish Nagar, Nagpur',
    price: '₹ 32,000 / mo',
    type: 'Rent',
    bhk: '3 BHK',
    area: '2,150 sqft',
    features: ['Rooftop access', '24/7 Security Patrol', 'Private Elevator Lobby'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'r3',
    title: 'Modern Executive Studio Flat',
    location: 'Pratap Nagar, Nagpur',
    price: '₹ 10,500 / mo',
    type: 'Rent',
    bhk: '1 BHK',
    area: '650 sqft',
    features: ['Semi-furnished', 'Corporation Water Supply', 'Quiet Residential Lane'],
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=500&q=80'
  },

  // Plots Listings
  {
    id: 'p1',
    title: 'Prestige Acres Plot Layout',
    location: 'Wardha Road Corridor, Nagpur',
    price: '₹ 45 Lac',
    type: 'Plots',
    area: '4,500 sqft plot',
    features: ['NIT Sanctioned Land', 'Corner Location', 'Electricity Trunk Connections Set'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p2',
    title: 'Lakeside Premium Residential Plot',
    location: 'Besa Gated Township, Nagpur',
    price: '₹ 62 Lac',
    type: 'Plots',
    area: '6,000 sqft plot',
    features: ['Tar Road Facing', 'Immediate Spot Registry', 'High Loading Soil Checked'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p3',
    title: 'Commercial Land Overlay',
    location: 'Kamptee Road Industrial Belt, Nagpur',
    price: '₹ 1.85 Cr',
    type: 'Plots',
    area: '12,000 sqft Plot',
    features: ['Industrial Zone Approved', 'Heavy Transport Access', 'Clear Legal Pedigree Title'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
  },

  // PG/Co-Living
  {
    id: 'pg1',
    title: 'Stanza Living Executive PG',
    location: 'Gayatri Nagar IT Park, Nagpur',
    price: '₹ 8,500 / mo',
    type: 'PG/Co-Living',
    bhk: 'Single Space',
    area: 'Private Room',
    features: ['1 Gbps Fiber WiFi', 'Daily Homecooked Meals included', 'Regular Vacuum & Laundry Services'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pg2',
    title: 'Zolo Stay Elite Co-Living Space',
    location: 'Shankar Nagar, Nagpur',
    price: '₹ 6,200 / mo',
    type: 'PG/Co-Living',
    bhk: 'Shared Space',
    area: 'Double Sharing',
    features: ['Centrally Air-Conditioned', 'Interactive Lounge / Games Room', 'Biometric Automated Entry'],
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80'
  }
];

interface HeroProps {
  onPropertyClick: (id: string) => void;
  onBuySelected?: () => void;
  onSellSelected?: () => void;
  onRentSelected?: () => void;
  onPlotsSelected?: () => void;
  onPgSelected?: () => void;
  initialTab?: TabType | null;
  onTabSelect?: () => void;
}

export default function Hero({ onPropertyClick, onBuySelected, onSellSelected, onRentSelected, onPlotsSelected, onPgSelected, initialTab, onTabSelect }: HeroProps) {
  const [activeTab, setActiveTab] = useState<TabType | null>(initialTab || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery((prev) => (prev ? prev + ' ' : '') + transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error in Hero:", event.error);
        setIsListening(false);
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
      alert("🎙️ Speech Recognition is not supported on this browser. Try Google Chrome! 🌐");
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
        console.warn("Speech session conflict in Hero, creating dynamic instance:", e);
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-IN';
          rec.onstart = () => setIsListening(true);
          rec.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) setSearchQuery((prev) => (prev ? prev + ' ' : '') + transcript);
          };
          rec.onerror = (event: any) => {
            setIsListening(false);
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchResults, setSearchResults] = useState<PropertyListing[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const renderGroupedSection = (
    title: string,
    category: TabType,
    icon: React.ReactNode,
    bgClass: string,
    borderClass: string,
    textClass: string
  ) => {
    const catProperties = MOCK_PROPERTIES.filter(p => {
      if (category === 'Buy') return p.type === 'Buy';
      if (category === 'Sell') return p.type === 'Sell';
      if (category === 'Rent') return p.type === 'Rent';
      if (category === 'Plots') return p.type === 'Plots';
      if (category === 'PG/Co-Living') return p.type === 'PG/Co-Living';
      return false;
    });
    const query = searchQuery.toLowerCase().trim();
    
    const directMatches = catProperties.filter(p => {
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        (p.bhk && p.bhk.toLowerCase().includes(query)) ||
        p.features.some(f => f.toLowerCase().includes(query)) ||
        p.price.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    });

    const displayListings = directMatches.length > 0 ? directMatches : catProperties;
    const isDirectMatch = directMatches.length > 0;

    return (
      <div className={`rounded-3xl border ${borderClass} ${bgClass} p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md text-left`}>
        {/* Subtle Background Watermark or pattern accent */}
        <div className="absolute -top-10 -right-10 text-[#0E1F35] opacity-[0.03] pointer-events-none w-32 h-32 flex items-center justify-center">
          {icon}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-white shadow-xs border ${borderClass} ${textClass} flex items-center justify-center shrink-0`}>
              {icon}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0E1F35] font-sans">
                {title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mt-0.5">
                {category === 'Buy' && "Premium RERA-certified homes, high-end villas & luxury apartments."}
                {category === 'Sell' && "Instant Nagpur housing valuations, drone listings syndication & appraiser consults."}
                {category === 'Rent' && "Fully-furnished flats and modular independent houses on flexible term rents."}
                {category === 'Plots' && "NIT-approved layouts, boundary-fenced residential plots, ready-to-construct."}
                {category === 'PG/Co-Living' && "Modern student housing & professional co-living flats near academic/IT centers."}
              </p>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full ${
              isDirectMatch 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200/60'
            }`}>
              {isDirectMatch ? '🎯 Direct Match Found' : '✨ Curated Nagpur Hotpicks'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing) => (
            <div 
              key={listing.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group h-full"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => onPropertyClick(listing.id)}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#0E1F35] text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded">
                  {listing.type === 'PG/Co-Living' ? 'PG & Co-Living' : listing.type}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#0D1F34] text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                  {listing.price}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-1">
                  <h4 
                    className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-amber-600 transition-colors leading-snug cursor-pointer line-clamp-1"
                    onClick={() => onPropertyClick(listing.id)}
                  >
                    {listing.title}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {listing.bhk && (
                      <span className="bg-slate-100 text-slate-700 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded">
                        {listing.bhk}
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-700 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded">
                      {listing.area}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="grid gap-1 flex-grow pr-2">
                    <div className="flex flex-wrap gap-y-0.5 gap-x-1.5">
                      {listing.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[9px] text-gray-400 font-bold max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
                          • {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (category === 'Sell') {
                        alert(`Request initiated for ${listing.title} resale listing inspection in Nagpur! Our local valuer will schedule a physical visit.`);
                      } else {
                        alert(`Inquiry successfully logged for ${listing.title}! An executive from Nagpur Urban Nest team will call you back shortly.`);
                      }
                    }}
                    className="bg-[#0E1F35] hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors shrink-0"
                  >
                    {category === 'Sell' ? 'Sell Now' : 'Inquire'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setActiveTab(initialTab || null);
    if (initialTab && initialTab !== 'Buy') {
      setHasSearched(false);
    }
  }, [initialTab]);

  const tabs: TabType[] = ['Buy', 'Sell', 'Rent', 'Plots', 'PG/Co-Living'];

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'Buy': return 'Search for Locality, Landmark, project or builder to Buy...';
      case 'Sell': return 'Enter your locality or society code to request immediate valuer visit...';
      case 'Rent': return 'Search for rental apartments, studio flats, or penthouses near you...';
      case 'Plots': return 'Search for industrial plots, residential land, or greenfield zones...';
      case 'PG/Co-Living': return 'Search for paying guest accommodations, single rooms, or double sharing...';
      default: return 'Search for physical properties, land plots or co-living spaces...';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Filter listings based on category and optional text
    const query = searchQuery.toLowerCase().trim();
    const filtered = MOCK_PROPERTIES.filter(prop => {
      // Must match active tab type if one is selected
      if (activeTab && prop.type !== activeTab) return false;
      // If there's a search term, filter text too
      if (query !== '') {
        return (
          prop.title.toLowerCase().includes(query) ||
          prop.location.toLowerCase().includes(query) ||
          prop.features.some(f => f.toLowerCase().includes(query))
        );
      }
      return true;
    });
    
    setSearchResults(filtered);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section id="hero" className="relative bg-white pb-12">
      {/* Search Widget overlayed style on Top of Image Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 pt-6">
        
        {/* Search Layout Group */}
        <div className="w-full max-w-3xl mx-auto mb-10 shadow-lg select-none">
          {/* Tabs row (Golden Brown Header) */}
          <div className="bg-[#b38330] rounded-t-lg flex flex-wrap pt-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Buy') {
                    if (onBuySelected) {
                      onBuySelected();
                    } else {
                      setActiveTab('Buy');
                    }
                  } else if (tab === 'Sell') {
                    if (onSellSelected) {
                      onSellSelected();
                    } else {
                      setActiveTab('Sell');
                    }
                  } else if (tab === 'Rent') {
                    if (onRentSelected) {
                      onRentSelected();
                    } else {
                      setActiveTab('Rent');
                    }
                  } else if (tab === 'Plots') {
                    if (onPlotsSelected) {
                      onPlotsSelected();
                    } else {
                      setActiveTab('Plots');
                    }
                  } else if (tab === 'PG/Co-Living') {
                    if (onPgSelected) {
                      onPgSelected();
                    } else {
                      setActiveTab('PG/Co-Living');
                    }
                  } else {
                    setActiveTab(tab);
                    if (onTabSelect) {
                      onTabSelect();
                    }
                  }
                  setHasSearched(false);
                }}
                className={`px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all rounded-t-md mx-0.5 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-[#0E1F35] text-white' 
                    : 'text-white/90 hover:bg-[#a67526]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input bar (Deep Navy Background) */}
          <form 
            onSubmit={handleSearch} 
            className="bg-[#0E1F35] p-4 rounded-b-lg flex flex-col sm:flex-row gap-3 items-center"
          >
            <div className="relative w-full flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isListening ? "Listening... Speak now 🎙️" : getPlaceholder()}
                className="w-full bg-white text-gray-900 placeholder-gray-400 pl-11 pr-12 py-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium border-none"
              />
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-[#0E1F35] hover:bg-slate-100'
                }`}
                title={isListening ? "Listening... Tap to stop" : "Voice Search (Speech to Text)"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#0E1F35] font-bold px-8 py-3 rounded text-xs sm:text-sm transition-colors cursor-pointer uppercase tracking-wider flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Hero Banner Image Box */}
        {activeTab === 'Buy' ? (
          <div className="space-y-12 select-none animate-fadeIn bg-white pt-2">
            
            {/* Header row: "Polular properties for purchase" & "See more :-" */}
            <div className="flex justify-between items-end border-b border-gray-150 pb-3">
              <h3 className="text-xl sm:text-2.5xl font-extrabold text-[#0E1F35] tracking-tight">
                Polular properties for purchase
              </h3>
              
              <button 
                onClick={() => {
                  alert("Opening all registered property registries in Nagpur...");
                  setHasSearched(true);
                  setSearchResults(MOCK_PROPERTIES.filter(p => p.type === 'Buy'));
                }}
                className="text-[#FF0101] hover:text-red-700 font-extrabold text-base sm:text-xl transition-colors cursor-pointer select-none whitespace-nowrap"
              >
                See more :-
              </button>
            </div>

            {/* 5 identical Cards matching the layout exactly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((cardIdx) => (
                <div 
                  key={cardIdx} 
                  className="bg-white border border-gray-300 rounded-3xl overflow-hidden flex flex-col justify-between h-[290px] shadow-xs hover:shadow-md hover:border-slate-400 transition-all group"
                >
                  {/* Gray Top Placeholder Area representing image */}
                  <div className="h-[145px] bg-[#D8DBDF] border-b border-gray-300 flex items-center justify-center relative">
                    <Building className="w-9 h-9 text-gray-500 stroke-[1.5]" />
                  </div>
                  
                  {/* Bottom Text Area */}
                  <div className="p-4 flex flex-col justify-between flex-grow relative text-left">
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors">4 BHK Flat</h4>
                      <p className="text-sm font-black text-[#0D1F34]">₹ 85 Lac</p>
                      <p className="text-xs text-gray-400 font-bold">Nagpur</p>
                    </div>

                    {/* Pill Shaped "More Intel" Button at Bottom Right */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() => {
                          alert("More Intel: Verified 4 BHK premium plot index in Nagpur with full water clearance.");
                          onPropertyClick('b2');
                        }}
                        className="bg-[#0E1F35] hover:bg-red-650 hover:scale-105 active:scale-95 text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                      >
                        More Intel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* "Last 13+ Years Of Real-estate Experience" block with custom growth arrow */}
            <div className="bg-slate-50 border border-gray-150 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
              <div className="flex items-center gap-6">
                <div className="text-left space-y-1.5">
                  <h4 className="text-2xl sm:text-4.5xl font-black text-[#0D1F34] leading-[1.12] tracking-tight">
                    Last 13+ Years Of<br />
                    Real-estate Experience
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-extrabold tracking-wider uppercase">
                    Trusted by 10,000+ happy homeowners across Central India
                  </p>
                </div>
              </div>

              {/* outlined chevron/arrow matching diagram perfectly */}
              <div className="shrink-0 bg-white border border-gray-250 p-4 rounded-xl shadow-xs">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-20 h-20 text-[#0D1F34]" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="20" y1="80" x2="80" y2="20" />
                  <polyline points="50,20 80,20 80,50" />
                  <line x1="5" y1="95" x2="20" y2="80" />
                </svg>
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[450px]">
            {/* Left Main Side: Active Image Hero Banner */}
            <div 
              onClick={() => onPropertyClick(`slide-${currentSlide}`)}
              className="lg:col-span-8 relative h-[280px] lg:h-full rounded-2xl overflow-hidden shadow-md group bg-[#F5F7FA] cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Pulsing Interactivity Badge */}
              <div className="absolute top-4 right-4 bg-orange-500/90 text-white font-extrabold text-[10px] tracking-wider uppercase py-1.5 px-3 rounded shadow-md z-10 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Click for Specs & Details
              </div>

              {/* Background Slides with Hardware Accelerated GPU Faded Carousel */}
              {HERO_SLIDES.map((slide, idx) => (
                <img
                  key={idx}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[300ms] ease-out ${
                    idx === currentSlide 
                      ? 'opacity-85 scale-100 z-0' 
                      : 'opacity-0 scale-[0.98] -z-10 pointer-events-none'
                  } group-hover:scale-[1.01] will-change-[opacity,transform]`}
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              ))}

              {/* Shading/Tint of original layout design tuned to make Navy & Red text pop perfectly */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent pointer-events-none z-1" />

              {/* Large dynamic dialogue overlay matching exactly the provided visual identity */}
              <div className="absolute left-6 sm:left-12 lg:left-16 top-[40%] -translate-y-1/2 max-w-md sm:max-w-2xl select-none text-left z-10 transition-all duration-300">
                <h1 
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-5.5xl font-black tracking-tight text-[#0E1F35] leading-[1.12]"
                  style={{ textShadow: '0 1px 3px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.4)' }}
                >
                  {HERO_SLIDES[currentSlide].dialogue}
                </h1>
              </div>

              {/* Slide caption detail over image (optional info tag in screen corner) */}
              <div className="absolute bottom-4 left-4 bg-[#0E1F35]/75 backdrop-blur-xs py-1.5 px-3 rounded text-white max-w-xs hidden md:block z-10">
                <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#b38330]">{HERO_SLIDES[currentSlide].title}</h4>
                <p className="text-[9px] text-gray-200 mt-0.5">{HERO_SLIDES[currentSlide].subtitle}</p>
              </div>

              {/* Horizontal Slide Indicators & Navigation Arrows Unit (Bottom Right) */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-6 right-6 sm:right-12 lg:right-16 z-10 flex items-center gap-4 sm:gap-6 bg-black/20 backdrop-blur-xs py-1.5 px-3 sm:px-4 rounded-lg select-none"
              >
                {/* Slide Page Indicators */}
                <div className="flex gap-1.5 sm:gap-2 items-center">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      className={`h-1 transition-all duration-[400ms] cursor-pointer rounded-full ${
                        idx === currentSlide ? 'w-16 bg-white shadow-xs' : 'w-10 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Separator line */}
                <div className="h-4 w-px bg-white/25 hidden sm:block" />

                {/* Navigation Arrows */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="bg-transparent hover:bg-white/10 text-white p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="bg-transparent hover:bg-white/10 text-white p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Stack: Interactive Secondary Gallery Images */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 h-[140px] sm:h-[180px] lg:h-full">
              {[1, 2].map((offset) => {
                const targetIdx = (currentSlide + offset) % HERO_SLIDES.length;
                const slide = HERO_SLIDES[targetIdx];
                return (
                  <div
                    key={targetIdx}
                    onClick={() => setCurrentSlide(targetIdx)}
                    className="relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 group transition-all duration-300 border border-gray-150"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[500ms] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Contrast Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/15 to-transparent pointer-events-none" />
                    
                    {/* floating details */}
                    <div className="absolute bottom-3 left-4 right-4 text-left pointer-events-none">
                      <span className="inline-block bg-[#b38330] text-slate-950 font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm mb-1.5">
                        Interactive Preview
                      </span>
                      <h4 className="text-[11px] sm:text-xs font-black text-white tracking-tight leading-tight truncate">
                        {slide.title}
                      </h4>
                      <p className="text-[9px] text-gray-300 tracking-normal truncate mt-0.5 opacity-90">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Interactive Show/Hide search listings panels with all 5 sections involved */}
        {hasSearched && (
          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 animate-fadeIn space-y-8 select-none">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-5">
              <div>
                <span className="bg-[#b38330] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                  Unified Search Console • Nagpur
                </span>
                <h2 className="text-xl sm:text-2.5xl font-black text-[#0E1F35] mt-2 font-sans tracking-tight">
                  Search Results & Specialized Portals
                </h2>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  {searchQuery ? `Displaying real-time records filtered by "${searchQuery}"` : "Displaying entire available Nagpur property landscape"}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setHasSearched(false);
                    setSearchQuery('');
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer font-sans"
                >
                  Clear & Close Search
                </button>
              </div>
            </div>

            {/* Render the 5 sections as customized by user request */}
            <div className="space-y-12">
              {/* SECTION 1: IF YOU WANT TO BUY */}
              {renderGroupedSection(
                "If you want to buy",
                "Buy",
                <Home className="w-6 h-6 stroke-[2]" />,
                "bg-[#0E1F35]/[0.01]",
                "border-slate-200",
                "text-[#0E1F35]"
              )}

              {/* SECTION 2: IF YOU WANT TO SELL */}
              {renderGroupedSection(
                "If you want to sell",
                "Sell",
                <DollarSign className="w-6 h-6 stroke-[2]" />,
                "bg-amber-500/[0.01]",
                "border-amber-200/50",
                "text-[#b38330]"
              )}

              {/* SECTION 3: IF YOU WANT TO RENT */}
              {renderGroupedSection(
                "If you want to rent",
                "Rent",
                <KeyRound className="w-6 h-6 stroke-[2]" />,
                "bg-slate-100/[0.01]",
                "border-slate-200",
                "text-slate-700"
              )}

              {/* SECTION 4: IF YOU ARE LOOKING FOR PLOTS */}
              {renderGroupedSection(
                "If you are looking for plots",
                "Plots",
                <Landmark className="w-6 h-6 stroke-[2]" />,
                "bg-emerald-500/[0.01]",
                "border-emerald-200/32",
                "text-emerald-700"
              )}

              {/* SECTION 5: IF YOU ARE LOOKING FOR PG/CO-LIVING */}
              {renderGroupedSection(
                "If you are looking for PG/Co-living",
                "PG/Co-Living",
                <Users className="w-6 h-6 stroke-[2]" />,
                "bg-indigo-500/[0.01]",
                "border-indigo-200/32",
                "text-indigo-700"
              )}
            </div>

            {/* Bottom Support Information Indicator */}
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mt-8">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-slate-150 rounded-full text-slate-500 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">Didn't find what you are looking for?</h4>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Let our specialist property scouts locate a matched layout for you inside Nagpur.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Initiating Live Assistant Call with Nagpur Realty Agent...")}
                className="bg-[#0E1F35] hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full transition-all cursor-pointer"
              >
                📞 Speak with Broker
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
