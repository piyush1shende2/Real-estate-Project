import React, { useState } from 'react';
import { 
  Calculator as CalcIcon, 
  TrendingUp, 
  Building2, 
  BookOpen, 
  ChevronRight, 
  DollarSign, 
  Percent, 
  Calendar,
  Check,
  Star,
  Download,
  Flame,
  CloudSun
} from 'lucide-react';

import HeatMapDashboard from './HeatMapDashboard';
import WeatherFriendlyCities from './WeatherFriendlyCities';

interface InsightCard {
  id: 'calc' | 'price' | 'city' | 'research' | 'heatmap' | 'weather';
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ResearchInsightsProps {
  onCalculatorSelected?: () => void;
}

// MASTER DATABASES FOR INDIAN PROPERTY PRICE TRENDS
const indianCitiesPriceTrends: Record<string, {
  buy: Record<string, { avg: string, growth: string, minLimit: string, maxLimit: string, curve: number[], rangeText: string }>,
  rent: Record<string, { avg: string, growth: string, minLimit: string, maxLimit: string, curve: number[], rangeText: string }>
}> = {
  'Nagpur': {
    buy: {
      apartments: { avg: '₹5.3 K / sq.ft', growth: '9.49%', minLimit: '₹700', maxLimit: '₹14 K', rangeText: '₹700 - ₹14 K', curve: [4200, 4400, 4100, 4300, 4550, 4650, 4500, 4750, 5000, 5300] },
      villas: { avg: '₹7.2 K / sq.ft', growth: '11.20%', minLimit: '₹2.1 K', maxLimit: '₹18 K', rangeText: '₹2.1 K - ₹18 K', curve: [5800, 6000, 5900, 6150, 6400, 6500, 6450, 6800, 7000, 7200] },
      commercial: { avg: '₹9.5 K / sq.ft', growth: '8.10%', minLimit: '₹4.5 K', maxLimit: '₹25 K', rangeText: '₹4.5 K - ₹25 K', curve: [8110, 8300, 8150, 8400, 8600, 8800, 8750, 9100, 9300, 9500] },
      plots: { avg: '₹3.8 K / sq.ft', growth: '14.50%', minLimit: '₹500', maxLimit: '₹9.5 K', rangeText: '₹500 - ₹9.5 K', curve: [2800, 3000, 2900, 3105, 3300, 3450, 3400, 3600, 3700, 3800] }
    },
    rent: {
      apartments: { avg: '₹15 / sq.ft', growth: '6.20%', minLimit: '₹8', maxLimit: '₹25', rangeText: '₹8 - ₹25', curve: [11.5, 12, 11, 13, 13.5, 14, 13.8, 14.5, 14.8, 15.2] },
      villas: { avg: '₹22 / sq.ft', growth: '7.85%', minLimit: '₹12', maxLimit: '₹40', rangeText: '₹12 - ₹40', curve: [17, 18.5, 18, 19.5, 20, 21, 20.5, 21.2, 21.6, 22.1] },
      commercial: { avg: '₹48 / sq.ft', growth: '5.40%', minLimit: '₹25', maxLimit: '₹90', rangeText: '₹25 - ₹90', curve: [41, 43, 42.5, 44, 45, 46.2, 45.8, 46.9, 47.5, 48.2] },
      plots: { avg: '₹4 / sq.ft', growth: '3.10%', minLimit: '₹2', maxLimit: '₹8', rangeText: '₹2 - ₹8', curve: [3.4, 3.6, 3.5, 3.7, 3.8, 3.9, 3.8, 3.9, 3.95, 4.02] }
    }
  },
  'Mumbai': {
    buy: {
      apartments: { avg: '₹24.5 K / sq.ft', growth: '12.35%', minLimit: '₹8.5 K', maxLimit: '₹65 K', rangeText: '₹8.5 K - ₹65 K', curve: [18500, 19800, 19200, 20400, 21200, 22500, 22100, 23400, 24000, 24500] },
      villas: { avg: '₹42.0 K / sq.ft', growth: '15.10%', minLimit: '₹15 K', maxLimit: '₹120 K', rangeText: '₹15 K - ₹120 K', curve: [31000, 33200, 32500, 34100, 36000, 38200, 37505, 39905, 41000, 42000] },
      commercial: { avg: '₹31.2 K / sq.ft', growth: '9.80%', minLimit: '₹12 K', maxLimit: '₹85 K', rangeText: '₹12 K - ₹85 K', curve: [25000, 26400, 25900, 27200, 28100, 29400, 29100, 30200, 30800, 31200] },
      plots: { avg: '₹18.9 K / sq.ft', growth: '18.45%', minLimit: '₹5 K', maxLimit: '₹45 K', rangeText: '₹5 K - ₹45 K', curve: [13200, 14500, 14100, 15300, 16200, 17105, 16900, 18000, 18400, 18900] }
    },
    rent: {
      apartments: { avg: '₹68 / sq.ft', growth: '8.40%', minLimit: '₹35', maxLimit: '₹150', rangeText: '₹35 - ₹150', curve: [51, 55, 53, 58, 60, 63, 62, 65, 66.5, 68] },
      villas: { avg: '₹110 / sq.ft', growth: '10.50%', minLimit: '₹55', maxLimit: '₹280', rangeText: '₹55 - ₹280', curve: [85, 92, 90, 95, 99, 103, 101, 106, 108.5, 110] },
      commercial: { avg: '₹135 / sq.ft', growth: '7.15%', minLimit: '₹70', maxLimit: '₹320', rangeText: '₹70 - ₹320', curve: [110, 118, 115, 122, 125, 129, 127, 131, 133.5, 135] },
      plots: { avg: '₹12 / sq.ft', growth: '4.60%', minLimit: '₹5', maxLimit: '₹25', rangeText: '₹5 - ₹25', curve: [9.1, 9.8, 9.6, 10.2, 10.6, 11.1, 10.9, 11.5, 11.8, 12] }
    }
  },
  'Bengaluru': {
    buy: {
      apartments: { avg: '₹9.2 K / sq.ft', growth: '14.15%', minLimit: '₹3.2 K', maxLimit: '₹24 K', rangeText: '₹3.2 K - ₹24 K', curve: [6800, 7400, 7100, 7650, 8100, 8400, 8250, 8750, 9000, 9200] },
      villas: { avg: '₹16.4 K / sq.ft', growth: '16.80%', minLimit: '₹6.5 K', maxLimit: '₹45 K', rangeText: '₹6.5 K - ₹45 K', curve: [11800, 12900, 12400, 13200, 14100, 14900, 14605, 15500, 16000, 16400] },
      commercial: { avg: '₹14.8 K / sq.ft', growth: '10.25%', minLimit: '₹5.5 K', maxLimit: '₹38 K', rangeText: '₹5.5 K - ₹38 K', curve: [11200, 12000, 11805, 12500, 13100, 13700, 13500, 14200, 14500, 14800] },
      plots: { avg: '₹6.1 K / sq.ft', growth: '21.05%', minLimit: '₹1.5 K', maxLimit: '₹15 K', rangeText: '₹1.5 K - ₹15 K', curve: [4100, 4600, 4400, 4900, 5200, 5600, 5450, 5800, 5950, 6100] }
    },
    rent: {
      apartments: { avg: '₹28 / sq.ft', growth: '11.10%', minLimit: '₹12', maxLimit: '₹60', rangeText: '₹12 - ₹60', curve: [19, 21.5, 20, 23, 24.5, 26, 25.2, 26.8, 27.4, 28] },
      villas: { avg: '₹48 / sq.ft', growth: '12.40%', minLimit: '₹22', maxLimit: '₹110', rangeText: '₹22 - ₹110', curve: [33, 37, 35, 39.5, 41.5, 44, 42.8, 45.5, 46.9, 48] },
      commercial: { avg: '₹75 / sq.ft', growth: '7.80%', minLimit: '₹35', maxLimit: '₹180', rangeText: '₹35 - ₹180', curve: [60, 65, 63.5, 67, 69.5, 71.8, 70.5, 72.9, 74.1, 75] },
      plots: { avg: '₹3 / sq.ft', growth: '2.50%', minLimit: '₹1', maxLimit: '₹6', rangeText: '₹1 - ₹6', curve: [2.4, 2.6, 2.5, 2.7, 2.8, 2.85, 2.8, 2.9, 2.95, 3] }
    }
  },
  'Pune': {
    buy: {
      apartments: { avg: '₹7.6 K / sq.ft', growth: '11.85%', minLimit: '₹2.8 K', maxLimit: '₹18 K', rangeText: '₹2.8 K - ₹18 K', curve: [5700, 6100, 5900, 6300, 6650, 6900, 6750, 7150, 7400, 7600] },
      villas: { avg: '₹12.5 K / sq.ft', growth: '13.40%', minLimit: '₹5 K', maxLimit: '₹32 K', rangeText: '₹5 K - ₹32 K', curve: [9100, 9800, 9550, 10100, 10700, 11200, 11000, 11700, 12100, 12500] },
      commercial: { avg: '₹11.2 K / sq.ft', growth: '8.90%', minLimit: '₹4.8 K', maxLimit: '₹28 K', rangeText: '₹4.8 K - ₹28 K', curve: [8800, 9300, 9150, 9600, 9900, 10250, 10100, 10600, 10950, 11200] },
      plots: { avg: '₹4.9 K / sq.ft', growth: '16.12%', minLimit: '₹800', maxLimit: '₹11 K', rangeText: '₹800 - ₹11 K', curve: [3400, 3800, 3650, 4000, 4250, 4450, 4350, 4600, 4750, 4900] }
    },
    rent: {
      apartments: { avg: '₹21 / sq.ft', growth: '8.15%', minLimit: '₹10', maxLimit: '₹45', rangeText: '₹10 - ₹45', curve: [15.1, 16.5, 15.8, 17.2, 18.1, 19.3, 18.9, 20.1, 20.6, 21] },
      villas: { avg: '₹36 / sq.ft', growth: '9.30%', minLimit: '₹16', maxLimit: '₹75', rangeText: '₹16 - ₹75', curve: [26, 28.5, 27.8, 29.5, 31, 32.8, 32.2, 34.1, 35.2, 36] },
      commercial: { avg: '₹58 / sq.ft', growth: '6.50%', minLimit: '₹28', maxLimit: '₹130', rangeText: '₹28 - ₹130', curve: [47, 50, 49.5, 51.8, 53, 55.1, 54.5, 56.2, 57.1, 58] },
      plots: { avg: '₹2.8 / sq.ft', growth: '4.10%', minLimit: '₹1', maxLimit: '₹5', rangeText: '₹1 - ₹5', curve: [2.1, 2.3, 2.2, 2.4, 2.5, 2.6, 2.55, 2.7, 2.75, 2.8] }
    }
  },
  'Delhi NCR': {
    buy: {
      apartments: { avg: '₹12.8 K / sq.ft', growth: '13.95%', minLimit: '₹3.5 K', maxLimit: '₹35 K', rangeText: '₹3.5 K - ₹35 K', curve: [9200, 10100, 9750, 10500, 11100, 11600, 11400, 12100, 12500, 12800] },
      villas: { avg: '₹21.5 K / sq.ft', growth: '14.80%', minLimit: '₹8.5 K', maxLimit: '₹65 K', rangeText: '₹8.5 K - ₹65 K', curve: [15500, 17000, 16500, 17800, 18800, 19700, 19400, 20550, 21100, 21500] },
      commercial: { avg: '₹18.2 K / sq.ft', growth: '9.15%', minLimit: '₹7.5 K', maxLimit: '₹48 K', rangeText: '₹7.5 K - ₹48 K', curve: [14100, 15100, 14800, 15600, 16250, 16900, 16700, 17450, 17950, 18200] },
      plots: { avg: '₹9.4 K / sq.ft', growth: '19.20%', minLimit: '₹1.8 K', maxLimit: '₹28 K', rangeText: '₹1.8 K - ₹28 K', curve: [6400, 7200, 6900, 7700, 8200, 8750, 8500, 9000, 9250, 9400] }
    },
    rent: {
      apartments: { avg: '₹26 / sq.ft', growth: '9.65%', minLimit: '₹11', maxLimit: '₹55', rangeText: '₹11 - ₹55', curve: [18.8, 20.5, 19.8, 21.4, 22.5, 23.9, 23.4, 24.8, 25.4, 26] },
      villas: { avg: '₹45 / sq.ft', growth: '11.20%', minLimit: '₹18', maxLimit: '₹110', rangeText: '₹18 - ₹110', curve: [32, 35.5, 34.2, 37, 39, 41.5, 40.8, 43, 44.2, 45] },
      commercial: { avg: '₹92 / sq.ft', growth: '7.45%', minLimit: '₹40', maxLimit: '₹220', rangeText: '₹40 - ₹220', curve: [74, 80.5, 78, 83.5, 86, 88.5, 87, 89.8, 91.2, 92] },
      plots: { avg: '₹4.5 / sq.ft', growth: '5.20%', minLimit: '₹1.5', maxLimit: '₹10', rangeText: '₹1.5 - ₹10', curve: [3.3, 3.65, 3.5, 3.85, 4, 4.25, 4.15, 4.35, 4.42, 4.5] }
    }
  }
};

const cityThemeConfig: Record<string, { stroke: string, gradId: string }> = {
  'Nagpur': { stroke: '#0EA5E9', gradId: 'Nagpur' },
  'Mumbai': { stroke: '#8B5CF6', gradId: 'Mumbai' },
  'Bengaluru': { stroke: '#F59E0B', gradId: 'Bengaluru' },
  'Delhi NCR': { stroke: '#EC4899', gradId: 'Delhi' },
  'Pune': { stroke: '#10B981', gradId: 'Pune' }
};

export default function ResearchInsights({ onCalculatorSelected }: ResearchInsightsProps) {
  const [activeWidget, setActiveWidget] = useState<'calc' | 'price' | 'city' | 'research' | 'heatmap' | 'weather' | null>(null);

  // Helper local function to format currency in Indian Rupees beautifully
  const formatIndianRupeesLocal = (val: number): string => {
    const formattedNum = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
    return `₹ ${formattedNum}`;
  };

  // EMI Calculator state variables
  const [loanAmount, setLoanAmount] = useState(5000000); // Default: 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // Default: 8.5% avg in India
  const [loanTerm, setLoanTerm] = useState(20);         // Default: 20 Years

  // City trends selection state (starting with Mumbai instead of New York)
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  // SVG Chart hover states
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Price Trends dynamic state variables
  const [trendType, setTrendType] = useState<'buy' | 'rent'>('buy');
  const [pricesFor, setPricesFor] = useState<'apartments' | 'villas' | 'commercial' | 'plots'>('apartments');
  const [selectedTrendCity, setSelectedTrendCity] = useState<string>('Nagpur');
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isAddingCompare, setIsAddingCompare] = useState(false);
  const [timelinePeriod, setTimelinePeriod] = useState<5 | 3 | 1>(5);

  // Timeline labels
  const allTimelineLabels = [
    'Jul,2021', 'Jan,2022', 'Jul,2022', 'Jan,2023', 'Jul,2023', 
    'Jan,2024', 'Jul,2024', 'Jan,2025', 'Jul,2025', 'Apr,2026'
  ];

  const getTimelineLabels = (): string[] => {
    if (timelinePeriod === 5) {
      return allTimelineLabels;
    } else if (timelinePeriod === 3) {
      return allTimelineLabels.slice(4);
    } else {
      return allTimelineLabels.slice(6);
    }
  };

  const getPointsForCity = (cityName: string): number[] => {
    const cityData = indianCitiesPriceTrends[cityName]?.[trendType]?.[pricesFor];
    if (!cityData) return [];
    const fullCurve = cityData.curve;
    if (timelinePeriod === 5) {
      return fullCurve;
    } else if (timelinePeriod === 3) {
      return fullCurve.slice(4);
    } else {
      return fullCurve.slice(6);
    }
  };

  // Find maximum curve value to correctly bound the Y scale and grid levels
  const getMaximumPriceAcrossSelected = (): number => {
    const list = [selectedTrendCity, ...compareCities];
    let hi = 10;
    list.forEach(c => {
      const vals = getPointsForCity(c);
      vals.forEach(val => {
        if (val > hi) hi = val;
      });
    });
    return Math.ceil(hi * 1.05); // +5% safety margin
  };

  const maxPriceValue = getMaximumPriceAcrossSelected();

  // Helper functions for plotting SVG Price Trend line graph
  const svgWidth = 800;
  const svgHeight = 340;
  const paddingX = 70;
  const paddingY = 40;

  // Level markers for Y axis grid based on maxPriceValue
  const gridLevels = [
    maxPriceValue * 0.2,
    maxPriceValue * 0.4,
    maxPriceValue * 0.6,
    maxPriceValue * 0.8,
    maxPriceValue * 1.0
  ];

  const scaleY = (val: number) => {
    const topY = 25;
    const bottomY = 300;
    const usableHeight = bottomY - topY; // 275
    const ratio = val / (maxPriceValue || 1);
    return bottomY - (ratio * usableHeight);
  };

  const formatGridLabel = (val: number) => {
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)} K`;
    }
    return `₹${val.toFixed(0)}`;
  };

  const getPlottedPoints = (cityName: string): { x: number, y: number, value: number, label: string }[] => {
    const values = getPointsForCity(cityName);
    if (values.length === 0) return [];
    
    const count = values.length;
    const usableWidth = 700; // 770 - 70
    const labelsToUse = getTimelineLabels();

    return values.map((val, idx) => {
      const x = 70 + (idx * (usableWidth / (count - 1 || 1)));
      const y = scaleY(val);
      return { x, y, value: val, label: labelsToUse[idx] || '' };
    });
  };

  const getBezierPath = (points: { x: number, y: number }[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const getAreaPath = (points: { x: number, y: number }[]): string => {
    const linePath = getBezierPath(points);
    if (!linePath) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const baseY = 300; // matching bottom baseline
    return `${linePath} L ${lastPoint.x} ${baseY} L ${firstPoint.x} ${baseY} Z`;
  };

  // Calculate EMI formula
  const r = (interestRate / 12) / 100;
  const n = loanTerm * 12;
  const emiNumerator = r * Math.pow(1 + r, n);
  const emiDenominator = Math.pow(1 + r, n) - 1;
  const monthlyEmi = emiNumerator && emiDenominator ? (loanAmount * (emiNumerator / emiDenominator)) : 0;
  const totalPayment = monthlyEmi * n;
  const totalInterest = totalPayment - loanAmount;

  const cards: InsightCard[] = [
    {
      id: 'calc',
      title: 'Calculator',
      description: 'Calculate all the possible profits and loss',
      icon: <CalcIcon className="w-8 h-8 text-amber-600" />
    },
    {
      id: 'price',
      title: 'Price trends',
      description: 'Find most affordable property at your favourite location',
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
    },
    {
      id: 'city',
      title: 'City Trends',
      description: 'Find top Indian cities with best convenience and facilities',
      icon: <Building2 className="w-8 h-8 text-sky-600" />
    },
    {
      id: 'research',
      title: 'Research',
      description: 'Get the best commercial properties at affordable prize',
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'heatmap',
      title: 'Smart Heat Map',
      description: 'Explore live structural prices, demand hotspots, ROI yields and amenities coverage layers',
      icon: <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
    },
    {
      id: 'weather',
      title: 'Weather Cities',
      description: 'Search comfortable spots or compare custom weather parameters to similar localities',
      icon: <CloudSun className="w-8 h-8 text-[#0EA5E9]" />
    }
  ];

  // Price trends historical data (in Indian Rupees/Sq.Ft)
  const historicalTrends = [
    { year: 2022, price: 7200 },
    { year: 2023, price: 7950 },
    { year: 2024, price: 8800 },
    { year: 2025, price: 9900 },
    { year: 2026, price: 11400 },
  ];

  // City metrics convenience scoring for main Indian Metros
  const cityConvenienceData: Record<string, { metro: number, safety: number, parks: number, hospital: number, priceIndex: string }> = {
    'Nagpur': { metro: 70, safety: 88, parks: 74, hospital: 81, priceIndex: '₹5,300 / sqft' },
    'Mumbai': { metro: 94, safety: 89, parks: 65, hospital: 92, priceIndex: '₹24,500 / sqft' },
    'Delhi NCR': { metro: 96, safety: 72, parks: 78, hospital: 95, priceIndex: '₹12,800 / sqft' },
    'Bengaluru': { metro: 82, safety: 84, parks: 81, hospital: 91, priceIndex: '₹9,200 / sqft' },
    'Pune': { metro: 78, safety: 88, parks: 80, hospital: 85, priceIndex: '₹7,600 / sqft' },
    'Hyderabad': { metro: 85, safety: 86, parks: 72, hospital: 89, priceIndex: '₹6,800 / sqft' },
    'Chennai': { metro: 86, safety: 91, parks: 74, hospital: 96, priceIndex: '₹7,200 / sqft' },
    'Kolkata': { metro: 84, safety: 90, parks: 75, hospital: 83, priceIndex: '₹5,900 / sqft' },
    'Ahmedabad': { metro: 80, safety: 93, parks: 70, hospital: 87, priceIndex: '₹4,800 / sqft' },
  };

  return (
    <section id="research-insights" className="max-w-7xl mx-auto px-4 sm:px-12 py-12">
      {/* Visual Headers */}
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Research and Insights
        </h3>
        <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">
          Explore useful <span className="text-red-500">market Insights</span> here
        </p>
      </div>

      {/* Grid structure matching screenshot precisely */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 xl:gap-7">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              if (card.id === 'calc' && onCalculatorSelected) {
                onCalculatorSelected();
              } else {
                setActiveWidget(card.id);
              }
            }}
            className="bg-slate-50 border border-slate-200/80 hover:bg-white rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-350 shadow-xs hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between min-h-[250px] p-6 lg:p-7 text-center group relative overflow-hidden select-none"
          >
            {/* Top decorative theme accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
              card.id === 'calc' ? 'bg-amber-500/30 group-hover:bg-amber-500' :
              card.id === 'price' ? 'bg-indigo-500/30 group-hover:bg-indigo-500' :
              card.id === 'city' ? 'bg-sky-500/30 group-hover:bg-sky-500' :
              card.id === 'research' ? 'bg-emerald-500/30 group-hover:bg-emerald-500' :
              card.id === 'weather' ? 'bg-cyan-500/30 group-hover:bg-cyan-500' :
              'bg-rose-500/30 group-hover:bg-rose-500'
            }`} />

            {/* Premium tag overlay for Smart Heat Map */}
            {card.id === 'heatmap' && (
              <span className="absolute top-2.5 right-2.5 text-[8.5px] font-black tracking-widest px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 uppercase animate-pulse">
                Hot
              </span>
            )}

            {/* Element graphic center */}
            <div className={`mx-auto p-4 rounded-full transition-all duration-300 w-16 h-16 flex items-center justify-center ${
              card.id === 'calc' ? 'bg-amber-50 group-hover:bg-amber-100/80 border border-amber-100/40' :
              card.id === 'price' ? 'bg-indigo-50 group-hover:bg-indigo-100/80 border border-indigo-100/40' :
              card.id === 'city' ? 'bg-sky-50 group-hover:bg-sky-100/80 border border-sky-100/40' :
              card.id === 'research' ? 'bg-emerald-50 group-hover:bg-emerald-100/80 border border-emerald-100/40' :
              card.id === 'weather' ? 'bg-cyan-50 group-hover:bg-cyan-100/80 border border-cyan-100/40' :
              'bg-rose-50 group-hover:bg-rose-100/80 border border-rose-100/40'
            }`}>
              {card.icon}
            </div>

            {/* Core textual descriptions */}
            <div className="mt-4 flex-1 flex flex-col justify-end">
              <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-amber-700 transition-colors uppercase tracking-wider text-center">
                {card.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-2.5 max-w-[200px] mx-auto text-center">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tool Modal */}
      {activeWidget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 ${
            activeWidget === 'heatmap' || activeWidget === 'weather' ? 'max-w-4xl' : 'max-w-2xl'
          }`}>
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center sticky top-0 z-30 rounded-t-xl">
              <div>
                <span className="bg-amber-500 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                  Urban Nest Premium Utility
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  {activeWidget === 'calc' && 'House Investment calculator'}
                  {activeWidget === 'price' && 'Market Price Trends Indexes'}
                  {activeWidget === 'city' && 'Convenience & Facility Matrix'}
                  {activeWidget === 'research' && 'Strategic Commercial Research'}
                  {activeWidget === 'heatmap' && 'Nagpur Spatial Geo-Heat Maps'}
                  {activeWidget === 'weather' && 'Weather Friendly Cities & Climate Matches'}
                </h3>
              </div>
              <button
                onClick={() => setActiveWidget(null)}
                className="text-white/70 hover:text-white font-bold text-2xl transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Content container based on selected card */}
            <div className="p-6">
              
              {/* CALCULATOR WIDGET */}
              {activeWidget === 'calc' && (
                <div className="space-y-6">
                  {/* Row layout: Inputs on left, Outputs on right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Range controllers */}
                    <div className="space-y-4">
                      {/* Principal amount */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                          <span>LOAN PRINCIPAL</span>
                          <span className="text-amber-600 font-extrabold">{formatIndianRupeesLocal(loanAmount)}</span>
                        </div>
                        <input
                          type="range"
                          min="500000"
                          max="100000000"
                          step="100000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full h-1.5 appearance-none rounded-lg cursor-pointer bg-gray-200 accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>₹ 5 Lakhs</span>
                          <span>₹ 10 Crores</span>
                        </div>
                      </div>

                      {/* Interest Rate */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                          <span>INTEREST RATE (APR)</span>
                          <span className="text-amber-600 font-extrabold">{interestRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="18"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full h-1.5 appearance-none rounded-lg cursor-pointer bg-gray-200 accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>5% p.a.</span>
                          <span>18% p.a.</span>
                        </div>
                      </div>

                      {/* Loan tenure */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                          <span>LOAN TENURE (YEARS)</span>
                          <span className="text-amber-600 font-extrabold">{loanTerm} Years</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full h-1.5 appearance-none rounded-lg cursor-pointer bg-gray-200 accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>1 Yr</span>
                          <span>30 Yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial breakdowns */}
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Monthly EMI</p>
                          <h4 className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                            {formatIndianRupeesLocal(Math.round(monthlyEmi))}/mo
                          </h4>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate-200/60 text-xs text-slate-700">
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Total Repayments:</span>
                            <span className="text-slate-800 font-bold">{formatIndianRupeesLocal(Math.round(totalPayment))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Interest Payable:</span>
                            <span className="text-slate-800 font-bold">{formatIndianRupeesLocal(Math.round(totalInterest))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Principal Borrowed:</span>
                            <span className="text-slate-800 font-bold">{formatIndianRupeesLocal(loanAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive graphic summary */}
                      <div className="mt-5 h-5 bg-gray-250 rounded-full overflow-hidden flex text-white text-[9px] font-bold text-center">
                        <div 
                          style={{ width: `${(loanAmount/totalPayment)*100}%` }} 
                          className="bg-slate-700 flex items-center justify-center transition-all"
                        >
                          Principal
                        </div>
                        <div 
                          style={{ width: `${(totalInterest/totalPayment)*100}%` }} 
                          className="bg-amber-500 flex items-center justify-center transition-all"
                        >
                          Interest
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRICE TRENDS WIDGET */}
              {activeWidget === 'price' && (
                <div className="space-y-6">
                  {/* Outer container matching mock screenshot */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                    
                    {/* Top Row: Buy/Rent toggles & Prices For selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      {/* Buy / Rent pill with signature violet/indigo border */}
                      <div className="bg-gray-100/60 p-1 rounded-full flex items-center w-fit border border-gray-200/50">
                        <button
                          onClick={() => {
                            setTrendType('buy');
                            // Clear comparisons if units shift drastically to avoid bad graphs
                            setCompareCities([]);
                          }}
                          className={`px-8 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                            trendType === 'buy'
                              ? 'bg-white text-indigo-600 border border-indigo-200 shadow-sm'
                              : 'text-gray-500 hover:text-slate-900'
                          }`}
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => {
                            setTrendType('rent');
                            setCompareCities([]);
                          }}
                          className={`px-8 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                            trendType === 'rent'
                              ? 'bg-white text-indigo-600 border border-indigo-200 shadow-sm'
                              : 'text-gray-500 hover:text-slate-900'
                          }`}
                        >
                          Rent
                        </button>
                      </div>

                      {/* Prices For label & Selector dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Prices For</span>
                        <div className="relative">
                          <select
                            value={pricesFor}
                            onChange={(e) => {
                              setPricesFor(e.target.value as any);
                              setCompareCities([]);
                            }}
                            className="bg-transparent hover:bg-slate-50 transition-colors text-xs font-black text-slate-800 pr-8 pl-1 py-1.5 focus:outline-none cursor-pointer border-b-2 border-slate-350"
                          >
                            <option value="apartments">Apartments</option>
                            <option value="villas">Villas</option>
                            <option value="commercial">Commercial Space</option>
                            <option value="plots">Residential Plots</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Header & Summary Info Cards */}
                    <div className="space-y-4">
                      {/* Summary highlight stats block */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200/40">
                        
                        {/* Avg Property Rate Left Segment */}
                        <div className="space-y-1.5 md:border-r md:border-gray-200/80 md:pr-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Property Rate</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl font-black text-slate-900">
                              {indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.avg || "N/A"}
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs border border-emerald-100">
                              ▲ {indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.growth || "N/A"} <span className="text-[9px] font-bold text-slate-400">(Y-o-Y)</span>
                            </span>
                          </div>
                        </div>

                        {/* Price Range Right Segment */}
                        <div className="space-y-1.5 md:pl-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Range</p>
                          <p className="text-xl sm:text-2xl font-black text-[#0E1F35]">
                            {indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.rangeText || "N/A"}
                          </p>
                        </div>

                      </div>

                      {/* Title display header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-800">
                            Showing Trends for:
                          </h4>
                          <select
                            value={selectedTrendCity}
                            onChange={(e) => {
                              const newCity = e.target.value;
                              setSelectedTrendCity(newCity);
                              // Filter out from comparative cities to avoid comparing with itself
                              setCompareCities(prev => prev.filter(c => c !== newCity));
                            }}
                            className="bg-transparent text-indigo-600 font-black text-sm border-b-2 border-indigo-500 pb-0.5 focus:outline-none cursor-pointer hover:text-indigo-700 hover:border-indigo-700 transition-colors"
                          >
                            {Object.keys(indianCitiesPriceTrends).map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Period select timeline view */}
                        <div className="flex items-center gap-1.5 border border-gray-200/80 px-2.5 py-1 rounded-lg bg-white shadow-xs">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Period:</span>
                          <select
                            value={timelinePeriod}
                            onChange={(e) => setTimelinePeriod(Number(e.target.value) as any)}
                            className="bg-transparent text-[10px] font-black text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value={5}>last 5 years</option>
                            <option value={3}>last 3 years</option>
                            <option value={1}>last year</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SVG Interactive Axis Line Graph representation */}
                    <div className="relative bg-slate-900/4 px-2 sm:px-4 py-6 rounded-2xl border border-gray-100 overflow-hidden">
                      {/* Render line graph using responsive container with SVG */}
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[580px] h-[340px] relative">
                          <svg className="w-full h-full" viewBox="0 0 800 340">
                            <defs>
                              {/* Glowing path drop shadows */}
                              <filter id="shadow-nagpur" x="-5%" y="-5%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0EA5E9" floodOpacity="0.4" />
                              </filter>
                              {/* Area fill gradients in matching colors */}
                              <linearGradient id="grad-Nagpur" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.32" />
                                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="grad-Mumbai" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="grad-Bengaluru" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="grad-Delhi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="grad-Pune" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Guidelines behind curves */}
                            {gridLevels.map((lvlValue, index) => {
                              const yPos = scaleY(lvlValue);
                              return (
                                <g key={index}>
                                  {/* Dashed background guide lines */}
                                  <line
                                    x1="70"
                                    y1={yPos}
                                    x2="770"
                                    y2={yPos}
                                    stroke="#E2E8F0"
                                    strokeWidth="1"
                                    strokeDasharray="4 6"
                                  />
                                  {/* Y Axis text label formatted based on scale range */}
                                  <text
                                    x="55"
                                    y={yPos + 4}
                                    className="text-[10px] font-black fill-slate-400 text-right"
                                    textAnchor="end"
                                  >
                                    {formatGridLabel(lvlValue)}
                                  </text>
                                </g>
                              );
                            })}

                            {/* X-Axis coordinate stamps */}
                            {allTimelineLabels.map((lbl, idx) => {
                              const xPos = 70 + idx * (700 / (allTimelineLabels.length - 1 || 1));
                              return (
                                <g key={lbl}>
                                  {/* Thin vertical gridlines */}
                                  <line
                                    x1={xPos}
                                    y1="25"
                                    x2={xPos}
                                    y2="300"
                                    stroke="#F1F5F9"
                                    strokeWidth="1"
                                  />
                                  <text
                                    x={xPos}
                                    y="320"
                                    className="text-[10px] font-bold fill-slate-400"
                                    textAnchor="middle"
                                  >
                                    {lbl}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Solid bottom axis baseline */}
                            <line
                              x1="70"
                              y1="300"
                              x2="770"
                              y2="300"
                              stroke="#CBD5E1"
                              strokeWidth="1.5"
                            />

                            {/* 1. COMPARED CITIES LINES (Drawn behind primary city) */}
                            {compareCities.map((comCity) => {
                              const pathPoints = getPlottedPoints(comCity);
                              const pathD = getBezierPath(pathPoints);
                              const areaD = getAreaPath(pathPoints);
                              const config = cityThemeConfig[comCity] || cityThemeConfig['Pune'];

                              return (
                                <g key={comCity}>
                                  {/* Area fill */}
                                  {areaD && (
                                    <path
                                      d={areaD}
                                      fill={`url(#grad-${config.gradId})`}
                                      className="transition-all duration-300"
                                    />
                                  )}
                                  {/* Core lines */}
                                  {pathD && (
                                    <path
                                      d={pathD}
                                      fill="none"
                                      stroke={config.stroke}
                                      strokeWidth="2.5"
                                      className="transition-all duration-300"
                                    />
                                  )}
                                  {/* Bullet points on coordinates */}
                                  {pathPoints.map((pt, index) => (
                                    <g key={index}>
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                        fill="#FFFFFF"
                                        stroke={config.stroke}
                                        strokeWidth="2.5"
                                        className="cursor-pointer transition-transform hover:scale-150"
                                      />
                                    </g>
                                  ))}
                                </g>
                              );
                            })}

                            {/* 2. PRIMARY CHOSEN CITY LINE (Drawn on top with dynamic shadow glow) */}
                            {(() => {
                              const primaryPoints = getPlottedPoints(selectedTrendCity);
                              const pathD = getBezierPath(primaryPoints);
                              const areaD = getAreaPath(primaryPoints);
                              const config = cityThemeConfig[selectedTrendCity] || cityThemeConfig['Nagpur'];

                              return (
                                <g>
                                  {/* Translucent Area Gradient */}
                                  {areaD && (
                                    <path
                                      d={areaD}
                                      fill={`url(#grad-${config.gradId})`}
                                      className="transition-all duration-300"
                                    />
                                  )}
                                  {/* Solid Stroke Line */}
                                  {pathD && (
                                    <path
                                      d={pathD}
                                      fill="none"
                                      stroke={config.stroke}
                                      strokeWidth="3.5"
                                      filter="url(#shadow-nagpur)"
                                      className="transition-all duration-300"
                                    />
                                  )}
                                  {/* Coordinate plot point guides */}
                                  {primaryPoints.map((pt, index) => {
                                    const yVal = (indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.curve || [])[index] || 0;
                                    const formattedVal = trendType === 'buy' ? `₹ ${(yVal / 1000).toFixed(1)} K` : `₹ ${yVal}`;
                                    
                                    return (
                                      <g key={index} className="group/poi">
                                        <circle
                                          cx={pt.x}
                                          cy={pt.y}
                                          r="5"
                                          fill="#FFFFFF"
                                          stroke={config.stroke}
                                          strokeWidth="3"
                                          className="cursor-pointer transition-transform duration-100 hover:scale-125"
                                        />
                                        {/* Dynamic hover node value tooltip */}
                                        <g className="opacity-0 group-hover/poi:opacity-100 transition-opacity duration-150 pointer-events-none">
                                          <rect
                                            x={pt.x - 45}
                                            y={pt.y - 32}
                                            width="90"
                                            height="22"
                                            rx="4"
                                            fill="#0E1F35"
                                          />
                                          <text
                                            x={pt.x}
                                            y={pt.y - 17}
                                            textAnchor="middle"
                                            className="text-[10px] fill-white font-extrabold"
                                          >
                                            {formattedVal}/sqft
                                          </text>
                                        </g>
                                      </g>
                                    );
                                  })}
                                </g>
                              );
                            })()}
                          </svg>
                        </div>
                      </div>

                      {/* Touch guidelines helper text */}
                      <p className="text-[10px] text-gray-400 font-extrabold text-center mt-3 tracking-wide">
                        💡 Hover over any point on the curves to inspect real-time historical valuations instantly
                      </p>
                    </div>

                    {/* Compare Block Footer (Exactly matching signature compared locality layout) */}
                    <div className="space-y-3 pt-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        LOCALITY ({pricesFor}) TO COMPARE
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Selected Trend City Card */}
                        <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 p-3 rounded-lg flex items-center justify-between min-w-[200px] shrink-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#0ea5e9] shrink-0" />
                              <span className="text-xs font-black text-slate-800">{selectedTrendCity}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium">
                              ▲ {indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.growth || "N/A"} Last Year
                            </p>
                          </div>
                          <div className="text-right pl-4">
                            <span className="text-xs font-black text-slate-900 block">
                              {indianCitiesPriceTrends[selectedTrendCity]?.[trendType]?.[pricesFor]?.avg || "N/A"}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">Avg. rate</span>
                          </div>
                        </div>

                        {/* Comparative Cards dynamically rendered */}
                        {compareCities.map((comCity) => {
                          const config = cityThemeConfig[comCity] || cityThemeConfig['Pune'];
                          const data = indianCitiesPriceTrends[comCity]?.[trendType]?.[pricesFor];
                          return (
                            <div 
                              key={comCity} 
                              className="bg-slate-50 border border-gray-100 p-3 rounded-lg flex items-center justify-between min-w-[200px] relative group/card"
                            >
                              {/* Remove comparison button */}
                              <button
                                onClick={() => setCompareCities(prev => prev.filter(c => c !== comCity))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer"
                                title="Remove comparison"
                              >
                                &times;
                              </button>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span style={{ backgroundColor: config.stroke }} className="w-3 h-3 rounded-full shrink-0" />
                                  <span className="text-xs font-black text-slate-800">{comCity}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium">
                                  ▲ {data?.growth || "0%"} Last Year
                                </p>
                              </div>
                              <div className="text-right pl-4">
                                <span className="text-xs font-black text-slate-900 block">
                                  {data?.avg || "N/A"}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">Avg. rate</span>
                              </div>
                            </div>
                          );
                        })}

                        {/* "+ ADD MORE to compare" Button overlay */}
                        <div className="relative">
                          {isAddingCompare ? (
                            <div className="absolute bottom-12 left-0 bg-white border border-gray-200 shadow-xl rounded-xl z-20 p-2 w-48 text-left">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1.5 border-b border-gray-100">
                                Select Indian City
                              </p>
                              <div className="max-h-40 overflow-y-auto mt-1 space-y-0.5">
                                {Object.keys(indianCitiesPriceTrends)
                                  .filter(c => c !== selectedTrendCity && !compareCities.includes(c))
                                  .map(c => (
                                    <button
                                      key={c}
                                      onClick={() => {
                                        setCompareCities(prev => [...prev, c]);
                                        setIsAddingCompare(false);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded text-xs font-bold transition-all text-slate-700 block"
                                    >
                                      + {c}
                                    </button>
                                  ))}
                                {Object.keys(indianCitiesPriceTrends).filter(c => c !== selectedTrendCity && !compareCities.includes(c)).length === 0 && (
                                  <p className="text-[10px] text-slate-400 font-medium px-2.5 py-2">No more cities available</p>
                                )}
                              </div>
                              <button
                                onClick={() => setIsAddingCompare(false)}
                                className="w-full mt-2 text-center text-[9px] font-extrabold text-slate-400 hover:text-rose-500 uppercase pt-1 border-t border-gray-100 block cursor-pointer"
                              >
                                Close Selection
                              </button>
                            </div>
                          ) : null}

                          <button
                            onClick={() => setIsAddingCompare(true)}
                            className="dashed-add-btn border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-slate-50 transition-all p-3 rounded-lg flex flex-col items-center justify-center min-w-[200px] h-[52px] text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                              + ADD MORE
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">to compare</span>
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* CITY CONVIENCE matrix */}
              {activeWidget === 'city' && (
                <div className="space-y-6">
                  <div className="flex gap-2 flex-wrap pb-2 border-b border-gray-100">
                    {Object.keys(cityConvenienceData).map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                          city === selectedCity 
                            ? 'bg-[#0E1F35] text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  {/* Rating scores list */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <span>Transit & Metro Connectivity</span>
                        <span className="text-slate-800 font-bold">{cityConvenienceData[selectedCity].metro}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cityConvenienceData[selectedCity].metro}%` }} 
                          className="h-full bg-[#b38330] rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <span>Safety Index</span>
                        <span className="text-slate-800 font-bold">{cityConvenienceData[selectedCity].safety}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cityConvenienceData[selectedCity].safety}%` }} 
                          className="h-full bg-slate-800 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <span>Parks & Landscapes</span>
                        <span className="text-slate-800 font-bold">{cityConvenienceData[selectedCity].parks}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cityConvenienceData[selectedCity].parks}%` }} 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <span>Hospital Care access</span>
                        <span className="text-slate-800 font-bold">{cityConvenienceData[selectedCity].hospital}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cityConvenienceData[selectedCity].hospital}%` }} 
                          className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 px-4 py-3 rounded-md flex justify-between items-center mt-6">
                      <span className="text-xs text-amber-800 font-bold uppercase tracking-wide">Average Property Value Index:</span>
                      <span className="text-sm text-slate-900 font-black">{cityConvenienceData[selectedCity].priceIndex}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STRATEGIC RESEARCH */}
              {activeWidget === 'research' && (
                <div className="space-y-6">
                  <div className="border border-gray-100 rounded-lg p-5 shadow-inner bg-slate-50">
                    <span className="text-[10px] bg-red-100 text-red-700 font-black px-2 py-0.5 rounded tracking-wider uppercase">EXCLUSIVE ARTICLE</span>
                    <h4 className="text-sm font-extrabold text-[#0E1F35] mt-1.5 mb-2 leading-tight">
                      Maximizing ROI: Commercial Real Estate Trends 2026-2027
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Commercial layouts in developing outer ring roads have surpassed expectations, demonstrating up to 14.5% year-over-year capitalization gains. Undergoing infrastructure shifts render warehousing and medical-park plazas safe hubs...
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Top 3 Recommended Assets</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded hover:bg-slate-50 transition-colors border-b border-gray-100">
                        <span className="font-bold text-gray-700">1. Tech Corridor Offices</span>
                        <span className="text-emerald-600 font-semibold">+11.2% CAGR</span>
                      </div>
                      <div className="flex justify-between p-2 rounded hover:bg-slate-50 transition-colors border-b border-gray-100">
                        <span className="font-bold text-gray-700">2. Suburban Retail Anchors</span>
                        <span className="text-emerald-600 font-semibold">+8.5% CAGR</span>
                      </div>
                      <div className="flex justify-between p-2 rounded hover:bg-slate-50 transition-colors border-b border-gray-100">
                        <span className="font-bold text-gray-700">3. Transit Hub Multi-Units</span>
                        <span className="text-emerald-600 font-semibold">+13.1% CAGR</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Strategic PDF report has been requested! Support will compile and email it to your inbox.")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Full Research PDF Digest
                  </button>
                </div>
              )}

              {/* SPATIAL HEAT MAPS LAYER */}
              {activeWidget === 'heatmap' && (
                <div className="space-y-4">
                  <HeatMapDashboard />
                </div>
              )}

              {/* WEATHER FRIENDLY CITIES COMFORT ENGINE */}
              {activeWidget === 'weather' && (
                <div className="space-y-4">
                  <WeatherFriendlyCities />
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
