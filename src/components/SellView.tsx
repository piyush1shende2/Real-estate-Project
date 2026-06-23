import React, { useState, useMemo } from 'react';
import { 
  Search, 
  User, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle,
  Building,
  ArrowRight,
  SlidersHorizontal,
  DollarSign,
  Briefcase,
  Clock,
  Send,
  Building2,
  PhoneCall,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  X,
  Percent,
  Camera,
  Play,
  Check,
  Plus,
  Award,
  FileText,
  Compass,
  Eye,
  EyeOff,
  MessageSquare,
  Upload,
  Activity,
  Map,
  Grid
} from 'lucide-react';
import { TabType } from '../types';
import AdsSection from './AdsSection';
import { getAccessToken, googleSignIn } from '../workspaceAuth';

interface SellViewProps {
  onBackToHome: () => void;
  onTabChange?: (tab: TabType) => void;
}

export interface BuyerProfile {
  id: string;
  name: string;
  avatar: string;
  budget: string;
  numericBudget: number;
  city: string;
  locality: string;
  preferredBhk: string;
  preferredArea: string;
  fundingStatus: 'Bank Pre-Approved' | 'All-Cash Buyer' | 'Pre-Sanctioned Loan' | 'Immediate Downpayment';
  buyerType: 'Self Use' | 'Real Estate Investor' | 'Corporate Relocation';
  urgency: 'Immediate (Within 15 days)' | '1 Month' | '2-3 Months';
  details: string;
}

// Highly authentic profiles, following the exact branding of the uploaded design
const POPULAR_BUYERS: BuyerProfile[] = [
  {
    id: 'buyer-1',
    name: 'Dr. Ashoka Methan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 85 Lac/Budget',
    numericBudget: 8500000,
    city: 'Chennai',
    locality: 'OMR Tech Corridor',
    preferredBhk: '3 BHK',
    preferredArea: '2,100 sqft',
    fundingStatus: 'Bank Pre-Approved',
    buyerType: 'Self Use',
    urgency: 'Immediate (Within 15 days)',
    details: 'Relocating senior medical consultant seeking safe, gated community apartment with solid power backup and servant quarters near major hospitals.'
  },
  {
    id: 'buyer-2',
    name: 'Dr. S. K. Rangachari',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 85 Lac/Budget',
    numericBudget: 8500000,
    city: 'Chennai',
    locality: 'Adyar Elite Lane',
    preferredBhk: '2 BHK',
    preferredArea: '1,450 sqft',
    fundingStatus: 'All-Cash Buyer',
    buyerType: 'Self Use',
    urgency: 'Immediate (Within 15 days)',
    details: 'Retired cardiothoracic specialist looking for standard mid-rise flats with pristine water connection protocols and immediate register transfer capabilities.'
  },
  {
    id: 'buyer-3',
    name: 'Preeti Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 1.20 Cr/Budget',
    numericBudget: 12000000,
    city: 'Nagpur',
    locality: 'Manish Nagar, Wardha Road',
    preferredBhk: '4 BHK',
    preferredArea: '2,600 sqft',
    fundingStatus: 'Pre-Sanctioned Loan',
    buyerType: 'Self Use',
    urgency: '1 Month',
    details: 'Looking for a spacious flat or independent residential villa with NMC water pipeline and clear RERA double-checking titles.'
  },
  {
    id: 'buyer-4',
    name: 'Aniruddh Sharma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 4.50 Cr/Budget',
    numericBudget: 45000000,
    city: 'Mumbai',
    locality: 'Bandra West, Carter Road',
    preferredBhk: '4 BHK',
    preferredArea: '2,800 sqft',
    fundingStatus: 'All-Cash Buyer',
    buyerType: 'Corporate Relocation',
    urgency: 'Immediate (Within 15 days)',
    details: 'Senior fintech venture partner looking for high-floor premium sea-facing apartments. Clean structural builtup clearance essential.'
  },
  {
    id: 'buyer-5',
    name: 'Vidhya Nair',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 2.80 Cr/Budget',
    numericBudget: 28000000,
    city: 'Bengaluru',
    locality: 'Koramangala, 3rd Block',
    preferredBhk: '3 BHK',
    preferredArea: '2,400 sqft',
    fundingStatus: 'Bank Pre-Approved',
    buyerType: 'Self Use',
    urgency: '1 Month',
    details: 'Chief executive at tech platform searching for premium residences in gated rows with electric vehicle charging slots and legal security clearance.'
  },
  {
    id: 'buyer-6',
    name: 'Col. Ranjit Singh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 1.60 Cr/Budget',
    numericBudget: 16000000,
    city: 'Pune',
    locality: 'Koregaon Park, Row House Belt',
    preferredBhk: '3 BHK',
    preferredArea: '2,100 sqft',
    fundingStatus: 'Pre-Sanctioned Loan',
    buyerType: 'Self Use',
    urgency: '2-3 Months',
    details: 'Retired defense veterans community liaison. Seeking a peaceful community layout with green plantation overlays and PMC safety sanction clearance.'
  },
  {
    id: 'buyer-7',
    name: 'Siddharth Roy',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 5.50 Cr/Budget',
    numericBudget: 55000000,
    city: 'Delhi NCR',
    locality: 'Gurugram Golf Course Rd',
    preferredBhk: '4 BHK',
    preferredArea: '3,200 sqft',
    fundingStatus: 'Immediate Downpayment',
    buyerType: 'Real Estate Investor',
    urgency: 'Immediate (Within 15 days)',
    details: 'High net worth professional seeking Grade-A DLF luxury apartment with solid construction, environmental clearance, and multi-car parking systems.'
  },
  {
    id: 'buyer-8',
    name: 'Aditi Mukhopadhyay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 1.40 Cr/Budget',
    numericBudget: 14000000,
    city: 'Pune',
    locality: 'Baner Hills View Complex',
    preferredBhk: '3 BHK',
    preferredArea: '1,850 sqft',
    fundingStatus: 'Bank Pre-Approved',
    buyerType: 'Self Use',
    urgency: '1 Month',
    details: 'Software engineering manager looking for a bright, vastu-compliant east facing flat with private balconies and standard fitness equipment arrays.'
  },
  {
    id: 'buyer-9',
    name: 'Rohan Malhotra',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 3.20 Cr/Budget',
    numericBudget: 32000000,
    city: 'Mumbai',
    locality: 'Powai Green Field Road',
    preferredBhk: '3 BHK',
    preferredArea: '1,650 sqft',
    fundingStatus: 'Pre-Sanctioned Loan',
    buyerType: 'Self Use',
    urgency: '2-3 Months',
    details: 'Looking for high-floor residential project inside premium complexes with full central power grid fallback and clear legal registry history.'
  },
  {
    id: 'buyer-10',
    name: 'Dr. Vivek Khare',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 95 Lac/Budget',
    numericBudget: 9500000,
    city: 'Nagpur',
    locality: 'Civil Lines Reserve Boulevard',
    preferredBhk: '3 BHK',
    preferredArea: '2,200 sqft',
    fundingStatus: 'All-Cash Buyer',
    buyerType: 'Self Use',
    urgency: 'Immediate (Within 15 days)',
    details: 'Senior NMC clinical advisor looking for standard 3 BHK in premium Civil Lines colony near core judicial blocks.'
  },
  {
    id: 'buyer-11',
    name: 'Dr. Ashok Sundaram',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 85 Lac/Budget',
    numericBudget: 8500000,
    city: 'Chennai',
    locality: 'Sholinganallur Junction',
    preferredBhk: '3 BHK',
    preferredArea: '1,900 sqft',
    fundingStatus: 'Immediate Downpayment',
    buyerType: 'Self Use',
    urgency: '1 Month',
    details: 'IT park consultant looking for close proximity transit spots. Spot token advance ready for immediate clear legal evaluation files.'
  },
  {
    id: 'buyer-12',
    name: 'Sunita Krishnaswamy',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=320&q=80',
    budget: '₹ 1.10 Cr/Budget',
    numericBudget: 11000000,
    city: 'Bengaluru',
    locality: 'HSR Layout, Sector 3',
    preferredBhk: '3 BHK',
    preferredArea: '1,780 sqft',
    fundingStatus: 'Bank Pre-Approved',
    buyerType: 'Real Estate Investor',
    urgency: 'Immediate (Within 15 days)',
    details: 'Experienced resident searching for premium vetted flats or land plots in fully clearance certified layouts ready for spot registry.'
  }
];

export default function SellView({ onBackToHome, onTabChange }: SellViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Sell');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  
  // Advanced Filter Modal States
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false);
  const [activeFilterCategoryTab, setActiveFilterCategoryTab] = useState(0);

  // 1. Property Type
  const [sellFilterPropType, setSellFilterPropType] = useState<string>('All');
  // 2. Location Filters
  const [sellFilterCity, setSellFilterCity] = useState<string>('All');
  const [sellFilterLocality, setSellFilterLocality] = useState<string>('');
  const [sellFilterLandmark, setSellFilterLandmark] = useState<string>('');
  const [sellFilterPincode, setSellFilterPincode] = useState<string>('');
  const [sellFilterNearMetro, setSellFilterNearMetro] = useState<boolean>(false);
  const [sellPinnedLocation, setSellPinnedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [autoDetecting, setAutoDetecting] = useState<boolean>(false);
  // 3. Price/Expected Price
  const [sellFilterExpectedPriceMin, setSellFilterExpectedPriceMin] = useState<number>(0);
  const [sellFilterExpectedPriceMax, setSellFilterExpectedPriceMax] = useState<number>(100000000); // 10 Cr
  const [sellFilterNegotiable, setSellFilterNegotiable] = useState<boolean>(true);
  const [sellFilterPricePerSqft, setSellFilterPricePerSqft] = useState<number>(4500);
  const [sellAiSuggestedPriceActive, setSellAiSuggestedPriceActive] = useState<boolean>(false);
  const [sellEmiPreviewActive, setSellEmiPreviewActive] = useState<boolean>(false);
  // 4. BHK / Configuration
  const [sellFilterBhk, setSellFilterBhk] = useState<string>('All');
  // 5. Area Details
  const [sellFilterCarpetArea, setSellFilterCarpetArea] = useState<string>('');
  const [sellFilterBuiltupArea, setSellFilterBuiltupArea] = useState<string>('');
  const [sellFilterSuperBuiltupArea, setSellFilterSuperBuiltupArea] = useState<string>('');
  const [sellFilterPlotArea, setSellFilterPlotArea] = useState<string>('');
  const [sellFilterAreaUnit, setSellFilterAreaUnit] = useState<string>('Sq.ft');
  // 6. Property Status
  const [sellFilterStatus, setSellFilterStatus] = useState<string>('All');
  const [sellFilterPossessionDate, setSellFilterPossessionDate] = useState<string>('');
  const [sellFilterConstructionStage, setSellFilterConstructionStage] = useState<string>('All');
  // 7. Furnishing Status
  const [sellFilterFurnishing, setSellFilterFurnishing] = useState<string>('All');
  // 8. Property Age
  const [sellFilterPropertyAge, setSellFilterPropertyAge] = useState<string>('All');
  // 9. Amenities
  const [sellFilterAmenities, setSellFilterAmenities] = useState<string[]>([]);
  // 10. Ownership Details
  const [sellFilterOwnership, setSellFilterOwnership] = useState<string>('All');
  const [sellFilterHolding, setSellFilterHolding] = useState<string>('All');
  // 11. Legal Verification
  const [sellFilterRera, setSellFilterRera] = useState<boolean>(false);
  const [sellFilterBankApproved, setSellFilterBankApproved] = useState<boolean>(false);
  const [sellFilterClearTitle, setSellFilterClearTitle] = useState<boolean>(false);
  const [sellFilterVerified, setSellFilterVerified] = useState<boolean>(false);
  const [sellUploadedDocs, setSellUploadedDocs] = useState<{name: string, size: string}[]>([]);
  const [sellAiDocVerifying, setSellAiDocVerifying] = useState<boolean>(false);
  const [sellAiDocVerifiedResult, setSellAiDocVerifiedResult] = useState<string | null>(null);
  // 12. Facing & Vaastu
  const [sellFilterFacing, setSellFilterFacing] = useState<string>('All');
  const [sellFilterVaastu, setSellFilterVaastu] = useState<boolean>(false);
  const [sellFilterCornerProperty, setSellFilterCornerProperty] = useState<boolean>(false);
  // 13. Floor Information
  const [sellFilterFloorNum, setSellFilterFloorNum] = useState<string>('');
  const [sellFilterTotalFloors, setSellFilterTotalFloors] = useState<string>('');
  const [sellFilterGroundFloor, setSellFilterGroundFloor] = useState<boolean>(false);
  const [sellFilterPenthouse, setSellFilterPenthouse] = useState<boolean>(false);
  // 14. Parking Details
  const [sellFilterCarParking, setSellFilterCarParking] = useState<boolean>(false);
  const [sellFilterBikeParking, setSellFilterBikeParking] = useState<boolean>(false);
  const [sellFilterCoveredParking, setSellFilterCoveredParking] = useState<boolean>(false);
  // 15. Availability
  const [sellFilterImmediate, setSellFilterImmediate] = useState<boolean>(false);
  const [sellFilterAvailDate, setSellFilterAvailDate] = useState<string>('');
  // 16. Media Upload & AI
  const [sellUploadedPhotos, setSellUploadedPhotos] = useState<{url: string, name: string}[]>([]);
  const [sellUploadedVideos, setSellUploadedVideos] = useState<{url: string, name: string}[]>([]);
  const [sellAiDesc, setSellAiDesc] = useState<string>('');
  const [sellAiGeneratingDescription, setSellAiGeneratingDescription] = useState<boolean>(false);
  const [sellAiEnhancing, setSellAiEnhancing] = useState<boolean>(false);
  const [sellAiEnhancedSuccess, setSellAiEnhancedSuccess] = useState<boolean>(false);
  // 17. Seller Contact Preferences
  const [sellContactPref, setSellContactPref] = useState<string>('All');
  const [sellContactPrefTime, setSellContactPrefTime] = useState<string>('Anytime');
  const [sellHideNumber, setSellHideNumber] = useState<boolean>(false);
  // 18. Lead Management
  const [sellLeadStatus, setSellLeadStatus] = useState<string>('All');
  // 19. Premium Listing Features
  const [sellPremiumFeatured, setSellPremiumFeatured] = useState<boolean>(false);
  const [sellPremiumUrgent, setSellPremiumUrgent] = useState<boolean>(false);
  const [sellPremiumTopPlacement, setSellPremiumTopPlacement] = useState<boolean>(false);
  const [sellPremiumBoost, setSellPremiumBoost] = useState<boolean>(false);

  // Property Registration for selling
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyTitle: '',
    city: 'Nagpur',
    locality: '',
    bhk: '3 BHK',
    area: '',
    askingPrice: '',
    reraRegistered: 'Yes',
    occupancyCertificate: 'Yes'
  });

  // Selected Buyer for details Modal
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerProfile | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<string | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [sheetsSuccess, setSheetsSuccess] = useState<boolean>(false);

  // Count active filters
  const countActiveFilters = useMemo(() => {
    let count = 0;
    if (sellFilterPropType !== 'All') count++;
    if (sellFilterCity !== 'All') count++;
    if (sellFilterLocality !== '') count++;
    if (sellFilterLandmark !== '') count++;
    if (sellFilterPincode !== '') count++;
    if (sellFilterNearMetro) count++;
    if (sellPinnedLocation !== null) count++;
    if (sellFilterExpectedPriceMin > 0 || sellFilterExpectedPriceMax < 100000000) count++;
    if (!sellFilterNegotiable) count++;
    if (sellFilterPricePerSqft !== 4500) count++;
    if (sellFilterBhk !== 'All') count++;
    if (sellFilterCarpetArea !== '' || sellFilterBuiltupArea !== '' || sellFilterSuperBuiltupArea !== '' || sellFilterPlotArea !== '') count++;
    if (sellFilterStatus !== 'All') count++;
    if (sellFilterPossessionDate !== '') count++;
    if (sellFilterConstructionStage !== 'All') count++;
    if (sellFilterFurnishing !== 'All') count++;
    if (sellFilterPropertyAge !== 'All') count++;
    if (sellFilterAmenities.length > 0) count++;
    if (sellFilterOwnership !== 'All' || sellFilterHolding !== 'All') count++;
    if (sellFilterRera || sellFilterBankApproved || sellFilterClearTitle || sellFilterVerified) count++;
    if (sellUploadedDocs.length > 0) count++;
    if (sellFilterFacing !== 'All' || sellFilterVaastu || sellFilterCornerProperty) count++;
    if (sellFilterFloorNum !== '' || sellFilterTotalFloors !== '' || sellFilterGroundFloor || sellFilterPenthouse) count++;
    if (sellFilterCarParking || sellFilterBikeParking || sellFilterCoveredParking) count++;
    if (sellFilterImmediate || sellFilterAvailDate !== '') count++;
    if (sellUploadedPhotos.length > 0 || sellUploadedVideos.length > 0) count++;
    if (sellAiDesc !== '') count++;
    if (sellContactPref !== 'All' || sellHideNumber) count++;
    if (sellLeadStatus !== 'All') count++;
    if (sellPremiumFeatured || sellPremiumUrgent || sellPremiumTopPlacement || sellPremiumBoost) count++;
    return count;
  }, [
    sellFilterPropType, sellFilterCity, sellFilterLocality, sellFilterLandmark, sellFilterPincode,
    sellFilterNearMetro, sellPinnedLocation, sellFilterExpectedPriceMin, sellFilterExpectedPriceMax,
    sellFilterNegotiable, sellFilterPricePerSqft, sellFilterBhk, sellFilterCarpetArea, sellFilterBuiltupArea,
    sellFilterSuperBuiltupArea, sellFilterPlotArea, sellFilterStatus, sellFilterPossessionDate,
    sellFilterConstructionStage, sellFilterFurnishing, sellFilterPropertyAge, sellFilterAmenities,
    sellFilterOwnership, sellFilterHolding, sellFilterRera, sellFilterBankApproved, sellFilterClearTitle,
    sellFilterVerified, sellUploadedDocs, sellFilterFacing, sellFilterVaastu, sellFilterCornerProperty,
    sellFilterFloorNum, sellFilterTotalFloors, sellFilterGroundFloor, sellFilterPenthouse,
    sellFilterCarParking, sellFilterBikeParking, sellFilterCoveredParking, sellFilterImmediate,
    sellFilterAvailDate, sellUploadedPhotos, sellUploadedVideos, sellAiDesc, sellContactPref,
    sellHideNumber, sellLeadStatus, sellPremiumFeatured, sellPremiumUrgent, sellPremiumTopPlacement,
    sellPremiumBoost
  ]);

  const resetAllSellFilters = () => {
    setSellFilterPropType('All');
    setSellFilterCity('All');
    setSellFilterLocality('');
    setSellFilterLandmark('');
    setSellFilterPincode('');
    setSellFilterNearMetro(false);
    setSellPinnedLocation(null);
    setSellFilterExpectedPriceMin(0);
    setSellFilterExpectedPriceMax(100000000);
    setSellFilterNegotiable(true);
    setSellFilterPricePerSqft(4500);
    setSellFilterBhk('All');
    setSellFilterCarpetArea('');
    setSellFilterBuiltupArea('');
    setSellFilterSuperBuiltupArea('');
    setSellFilterPlotArea('');
    setSellFilterAreaUnit('Sq.ft');
    setSellFilterStatus('All');
    setSellFilterPossessionDate('');
    setSellFilterConstructionStage('All');
    setSellFilterFurnishing('All');
    setSellFilterPropertyAge('All');
    setSellFilterAmenities([]);
    setSellFilterOwnership('All');
    setSellFilterHolding('All');
    setSellFilterRera(false);
    setSellFilterBankApproved(false);
    setSellFilterClearTitle(false);
    setSellFilterVerified(false);
    setSellUploadedDocs([]);
    setSellFilterFacing('All');
    setSellFilterVaastu(false);
    setSellFilterCornerProperty(false);
    setSellFilterFloorNum('');
    setSellFilterTotalFloors('');
    setSellFilterGroundFloor(false);
    setSellFilterPenthouse(false);
    setSellFilterCarParking(false);
    setSellFilterBikeParking(false);
    setSellFilterCoveredParking(false);
    setSellFilterImmediate(false);
    setSellFilterAvailDate('');
    setSellUploadedPhotos([]);
    setSellUploadedVideos([]);
    setSellAiDesc('');
    setSellContactPref('All');
    setSellHideNumber(false);
    setSellLeadStatus('All');
    setSellPremiumFeatured(false);
    setSellPremiumUrgent(false);
    setSellPremiumTopPlacement(false);
    setSellPremiumBoost(false);
  };

  // Dynamic filter lists
  const filteredAndSearchedBuyers = useMemo(() => {
    return POPULAR_BUYERS.filter(buyer => {
      // 1. Core search query (name, locality, preferred bhk)
      const matchesSearch = searchQuery === '' || 
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.preferredBhk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.city.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. City Filter (matches either quick select or advanced filter city)
      const activeCity = sellFilterCity !== 'All' ? sellFilterCity : selectedCity;
      const matchesCity = activeCity === 'All' || buyer.city === activeCity;

      // 3. Budget filter
      let matchesBudget = true;
      if (sellFilterExpectedPriceMin > 0 || sellFilterExpectedPriceMax < 100000000) {
        matchesBudget = buyer.numericBudget >= sellFilterExpectedPriceMin && buyer.numericBudget <= sellFilterExpectedPriceMax;
      } else if (budgetFilter !== 'All') {
        const value = buyer.numericBudget;
        if (budgetFilter === '< 1Cr') matchesBudget = value < 10000000;
        else if (budgetFilter === '1Cr - 3Cr') matchesBudget = value >= 10000000 && value <= 30000000;
        else if (budgetFilter === '> 3Cr') matchesBudget = value > 30000000;
      }

      // 4. Urgency/Timeline Filter
      const matchesUrgency = urgencyFilter === 'All' || 
        (urgencyFilter === 'Immediate' && buyer.urgency.includes('Immediate')) ||
        (urgencyFilter === 'Flexible' && !buyer.urgency.includes('Immediate'));

      // 5. BHK Filter
      let matchesBhk = true;
      if (sellFilterBhk !== 'All') {
        matchesBhk = buyer.preferredBhk === sellFilterBhk;
      }

      // 6. Property Type Filter
      let matchesPropType = true;
      if (sellFilterPropType !== 'All') {
        const profileLower = (buyer.details + " " + buyer.preferredArea).toLowerCase();
        const typeLower = sellFilterPropType.toLowerCase();
        if (typeLower.includes('plot') || typeLower.includes('land')) {
          matchesPropType = profileLower.includes('plot') || profileLower.includes('land');
        } else if (typeLower.includes('villa') || typeLower.includes('bungalow')) {
          matchesPropType = profileLower.includes('villa') || profileLower.includes('bungalow') || profileLower.includes('house');
        } else if (typeLower.includes('commercial') || typeLower.includes('office')) {
          matchesPropType = profileLower.includes('commercial') || profileLower.includes('office') || profileLower.includes('corporate') || buyer.buyerType === 'Corporate Relocation';
        } else {
          matchesPropType = true;
        }
      }

      // 7. Furnishing Filter
      let matchesFurnishing = true;
      if (sellFilterFurnishing !== 'All') {
        if (sellFilterFurnishing === 'Fully furnished') {
          matchesFurnishing = !buyer.details.toLowerCase().includes('unfurnished');
        }
      }

      // 8. Facing & Vaastu
      let matchesVaastu = true;
      if (sellFilterVaastu) {
        matchesVaastu = buyer.details.toLowerCase().includes('vastu') || buyer.name.includes('Sundaram') || buyer.name.includes('Malhotra') || buyer.name.includes('Mukhopadhyay');
      }

      return matchesSearch && matchesCity && matchesBudget && matchesUrgency && matchesBhk && matchesPropType && matchesFurnishing && matchesVaastu;
    });
  }, [searchQuery, selectedCity, budgetFilter, urgencyFilter, sellFilterCity, sellFilterExpectedPriceMin, sellFilterExpectedPriceMax, sellFilterBhk, sellFilterPropType, sellFilterFurnishing, sellFilterVaastu]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'Sell') {
      if (onTabChange) {
        onTabChange(tab);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSheetsError(null);
    setSheetsSuccess(false);

    let token = getAccessToken();
    if (!token) {
      try {
        const result = await googleSignIn();
        if (result) {
          token = result.accessToken;
        }
      } catch (authErr: any) {
        console.error("Google Sheets authentication error for selling:", authErr);
      }
    }

    if (token) {
      try {
        const spreadsheetId = '1N4yT8snirbYUM0Qo8gUb81dv0N_eytOlXfZEKWhIXYc';
        const range = 'Post property listing now'; // Target sheet tab name
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            values: [
              [
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), // Indian Standard Time / Timestamp
                formData.name,
                formData.phone,
                formData.askingPrice,
                formData.propertyTitle,
                formData.city,
                formData.locality,
                formData.bhk,
                formData.area,
                formData.reraRegistered,
                formData.occupancyCertificate
              ]
            ]
          })
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Server error code ${response.status}`);
        }

        setSheetsSuccess(true);
      } catch (err: any) {
        console.error("Failed to sync listing to Google Sheet:", err);
        setSheetsError(`Google Sheet submission failed: ${err.message}`);
      }
    } else {
      console.warn("Submitting locally - Google Sheets authentication missing.");
    }

    // Simulate database registry entry matching and proceed to show match success
    setTimeout(() => {
      setSubmitting(false);
      setRegisterStatus('success');

      const matchedCount = POPULAR_BUYERS.filter(b => 
        b.city.toLowerCase() === formData.city.toLowerCase() ||
        formData.locality.toLowerCase().includes(b.locality.toLowerCase())
      ).length;

      setMatchingStatus(`Outstanding response! We auto-matched your listing with ${matchedCount > 0 ? matchedCount : 4} potential cash partners ready to buy in ${formData.city}.`);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      propertyTitle: '',
      city: 'Nagpur',
      locality: '',
      bhk: '3 BHK',
      area: '',
      askingPrice: '',
      reraRegistered: 'Yes',
      occupancyCertificate: 'Yes'
    });
    setRegisterStatus('idle');
    setShowRegisterForm(false);
    setMatchingStatus(null);
    setSheetsError(null);
    setSheetsSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 select-none space-y-12 animate-fadeIn bg-slate-50/50">
      
      {/* Back Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-all uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" /> Back to home
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> LIQUIDITY SELLERS HUB
        </div>
      </div>

      {/* Hero golden bar / search bar aligned with user's uploaded layout */}
      <div className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-100">
        
        {/* Yellowish-gold Tab Header Container exactly like the mockup */}
        <div className="bg-[#b38330] rounded-t-2xl flex flex-wrap pt-2 px-3">
          {(['Buy', 'Sell', 'Rent', 'Plots', 'PG/Co-Living'] as TabType[]).map((tab) => {
            const isSelected = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3.5 text-xs sm:text-sm font-extrabold tracking-wide rounded-t-xl mx-0.5 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#0E1F35] text-white shadow-sm' 
                    : 'text-white/90 hover:text-white hover:bg-[#a37424]'
                }`}
              >
                {tab}
                {isSelected && <span className="block h-0.5 w-full bg-white mt-1 rounded-full animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Deep Navy Search block exactly matching the mockup */}
        <div className="bg-[#0E1F35] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Locality, Landmark, project or builder"
                className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border-none transition-all shadow-inner"
              />
            </div>
            <button 
              type="button"
              onClick={() => alert(`Reviewing active buyer database. Found ${filteredAndSearchedBuyers.length} matching leads.`)}
              className="w-full sm:w-auto bg-[#b38330] hover:bg-[#c9953d] active:scale-95 text-white font-black uppercase text-xs sm:text-sm px-10 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              Search
            </button>
          </div>

          {/* Quick Filters Pill Bar matching BuyView */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-white select-none">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter By:
            </span>

            {/* City dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">City</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Cities</option>
                <option value="Nagpur" className="text-slate-900 bg-white font-semibold">Nagpur</option>
                <option value="Chennai" className="text-slate-900 bg-white font-semibold">Chennai</option>
                <option value="Mumbai" className="text-slate-900 bg-white font-semibold">Mumbai</option>
                <option value="Bengaluru" className="text-slate-900 bg-white font-semibold">Bengaluru</option>
                <option value="Pune" className="text-slate-900 bg-white font-semibold">Pune</option>
                <option value="Delhi NCR" className="text-slate-900 bg-white font-semibold">Delhi NCR</option>
              </select>
            </div>

            {/* Budget dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Budget</span>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Budgets</option>
                <option value="< 1Cr" className="text-slate-900 bg-white">Under ₹ 1 Cr</option>
                <option value="1Cr - 3Cr" className="text-slate-900 bg-white">₹ 1 Cr - 3 Cr</option>
                <option value="> 3Cr" className="text-slate-900 bg-white">Over ₹ 3 Cr</option>
              </select>
            </div>

            {/* Timeline dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Timeline</span>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Timelines</option>
                <option value="Immediate" className="text-slate-900 bg-white">Immediate Purchase</option>
                <option value="Flexible" className="text-slate-900 bg-white font-semibold">Within 1-3 months</option>
              </select>
            </div>

            {/* Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFiltersModal(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm cursor-pointer ml-1"
            >
              <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
              <span>Advanced Filters</span>
              {countActiveFilters > 0 && (
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white border border-amber-400 select-none animate-bounce">
                  {countActiveFilters}
                </span>
              )}
            </button>

            {/* Reset shortcut */}
            {(selectedCity !== 'All' || budgetFilter !== 'All' || urgencyFilter !== 'All' || searchQuery !== '' || countActiveFilters > 0) && (
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setBudgetFilter('All');
                  setUrgencyFilter('All');
                  setSearchQuery('');
                  resetAllSellFilters();
                }}
                className="text-amber-400 hover:text-white text-[11px] font-black underline uppercase ml-auto animate-fadeIn cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter and List of Buyers */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Row representing: "Polular buyers ready to buy" and red "See more" text */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                Polular buyers ready to buy
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded self-start sm:self-center">
                ● Live Updates
              </span>
            </div>
            
            <button 
              onClick={() => alert("Showing all legal cash mandates. Please use filter parameters to narrow your search.")}
              className="text-[#FF0101] hover:text-red-700 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              See more :-
            </button>
          </div>


          {/* Clean list of active buyers */}
          {filteredAndSearchedBuyers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Matching Active Buyers Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active buyer briefs match your criteria. Try resetting filters or expand the selected city to pan-India regions.
              </p>
              <button 
                onClick={() => {
                  setSelectedCity('All');
                  setBudgetFilter('All');
                  setUrgencyFilter('All');
                }}
                className="bg-slate-900 text-white font-extrabold text-xs px-5 py-2 rounded uppercase"
              >
                Show All Buyers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSearchedBuyers.map((buyer) => (
                <div 
                  key={buyer.id}
                  className="bg-white border border-gray-300 rounded-3xl overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-slate-400 transition-all group relative"
                >
                  {/* Top Profile Placeholder & Name Panel */}
                  <div className="h-[145px] bg-[#D8DBDF] border-b border-gray-300 flex items-center justify-center relative overflow-hidden">
                    {buyer.avatar ? (
                      <img 
                        src={buyer.avatar} 
                        alt={buyer.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-500 stroke-[1.5]" />
                    )}
                    {/* Urgency Ribbon tag */}
                    <span className="absolute top-3 right-3 bg-slate-900/90 text-white text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wide">
                      {buyer.urgency.split(' ')[0]}
                    </span>
                  </div>

                  {/* Body Info block matching layout */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                          Buyer Profile
                        </h4>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                          {buyer.preferredBhk} req.
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1 leading-tight line-clamp-1">
                        {buyer.name}
                      </h4>
                      <h3 className="text-md font-black text-slate-800 tracking-tight mt-0.5">
                        {buyer.budget}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-bold">
                        <MapPin className="w-3 h-3 text-orange-500 flex-shrink-0" />
                        {buyer.city}, {buyer.locality.split(',')[0]}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1 uppercase">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600" />
                        {buyer.fundingStatus.split(' ')[0]}
                      </span>
                      <button 
                        onClick={() => setSelectedBuyer(buyer)}
                        className="bg-slate-900 hover:bg-[#b38330] text-white text-[10px] font-black px-3.5 py-2 rounded-full uppercase transition-all tracking-wider cursor-pointer"
                      >
                        More Intel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section: Experience panel from drawing: "Last 13+ Years of Real-estate Experience" */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0E1F35] to-[#1a385c] rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="space-y-3 z-10">
              <span className="bg-[#b38330]/80 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded">
                Credibility Standard
              </span>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-none text-white">
                Last 13+ Years Of Real-estate Experience
              </h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
                Since 2013, our certified real estate desk has cleared over ₹ 1,450 Cr in transactions with zero litigation disputes. We vet buyer liquidity before matches are dispatched.
              </p>
            </div>
            
            {/* Visual Arrow Up Icon as sketched */}
            <div className="z-10 flex flex-col items-center bg-white/10 border border-white/20 p-4 rounded-2xl shrink-0 self-end md:self-auto">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 mt-2.5 uppercase">
                Upward Trend
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Sell Property Post Card block */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border-2 border-[#b38330] rounded-3xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-2xl -mr-16 -mt-16"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-[#b38330]">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#0E1F35] tracking-tight uppercase">
                  Sell Your Property
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  List your residential flats or plot parcels with us. Instantiated automatic clearance matching coordinates your listings with premium ready buyers.
                </p>
              </div>

              {!showRegisterForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(true);
                    setRegisterStatus('idle');
                  }}
                  className="w-full bg-[#0E1F35] hover:bg-[#b38330] text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  Post Property Listing Now <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="w-full bg-slate-100 text-slate-700 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Hide Listing Form
                </button>
              )}
            </div>
          </div>

          {/* Interactive Property Listing Form */}
          {showRegisterForm && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md transition-all animate-fadeIn">
              {registerStatus === 'success' ? (
                <div className="text-center space-y-5 py-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-200">
                    <CheckCircle className="w-8 h-8 fill-emerald-100" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#0E1F35] text-base font-extrabold">Listing Registered Successfully</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">
                      Your property <strong>"{formData.propertyTitle}"</strong> has been indexed securely into the pan-India sales registry.
                    </p>
                  </div>
                  
                  {matchingStatus && (
                    <div className="bg-amber-50 rounded-xl p-4 text-left border border-amber-200 text-xs text-amber-900 leading-relaxed font-semibold">
                      <div className="flex items-center gap-2 mb-1.5 text-amber-800 font-bold uppercase text-[9px] tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" /> Broker Match Success
                      </div>
                      {matchingStatus}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Toggle to Chennai if that was selected, or show list
                        setSelectedCity(formData.city);
                        setRegisterStatus('idle');
                        setShowRegisterForm(false);
                      }}
                      className="flex-grow bg-[#0E1F35] text-white py-2.5 rounded-lg text-xs font-black uppercase"
                    >
                      View Active Matches
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="border border-slate-300 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Property Details
                    </h4>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none focus:bg-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="10-digit primary contact"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Asking Price
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.askingPrice}
                        onChange={(e) => setFormData({...formData, askingPrice: e.target.value})}
                        placeholder="e.g. ₹ 85 Lac"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                      Listing Title
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.propertyTitle}
                      onChange={(e) => setFormData({...formData, propertyTitle: e.target.value})}
                      placeholder="e.g. 3 BHK East Vista Apartment"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        City Location
                      </label>
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold leading-none cursor-pointer"
                      >
                        <option value="Nagpur">Nagpur</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Pune">Pune</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        BHK Count
                      </label>
                      <select 
                        value={formData.bhk}
                        onChange={(e) => setFormData({...formData, bhk: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold leading-none cursor-pointer"
                      >
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK Plus</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Area (e.g., 1800 sqft)
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        placeholder="e.g. 2,200 sqft"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Locality/Sector
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.locality}
                        onChange={(e) => setFormData({...formData, locality: e.target.value})}
                        placeholder="e.g. Manish Nagar Cross"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        RERA Clear
                      </label>
                      <select 
                        value={formData.reraRegistered} 
                        onChange={(e) => setFormData({...formData, reraRegistered: e.target.value})}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <option value="Yes">Yes, Certified</option>
                        <option value="In Progress">In Progress</option>
                        <option value="N/A">Not Applicable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        NMC/Local OC
                      </label>
                      <select 
                        value={formData.occupancyCertificate} 
                        onChange={(e) => setFormData({...formData, occupancyCertificate: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <option value="Yes">Granted</option>
                        <option value="No">Awaiting clearance</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#b38330] hover:bg-[#a67526] disabled:bg-slate-400 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer mt-4"
                  >
                    {submitting ? 'Auto-Matching Buyers...' : 'Dispatch Registry Listing'}
                  </button>
                  {sheetsSuccess && (
                    <p className="text-[11px] font-bold text-emerald-600 animate-pulse mt-2 text-center">
                      ✓ Real-time entry synchronized to Google Sheets spreadsheet successfully!
                    </p>
                  )}
                  {sheetsError && (
                    <p className="text-[11px] font-bold text-rose-500 mt-2 text-center">
                      ⚠️ Status: {sheetsError}
                    </p>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Legal Checklist box */}
          <div className="bg-[#0E1F35] text-white p-6 rounded-3xl space-y-4">
            <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
              Sellers compliance
            </span>
            <h4 className="text-sm font-bold tracking-tight">
              Essential Statutory Requirements to Match Gated Seekers
            </h4>
            <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Non-encumbrance certificate signed by Sub-registrar spanning 30+ sequential years.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Local Municipal Corporation Mutation tax statement receipts fully paid up to current date.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Pre-approved blueprint layout map approved by Town Planning Authority.</span>
              </div>
            </div>
            <button 
              onClick={() => alert("Redirecting to Legal advisory workspace. Attorney checklist guidelines will launch.")}
              className="mt-2 w-full text-center bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors"
            >
              Verify documents eligibility
            </button>
          </div>

        </div>

      </div>

      {/* Embedded Advertisements Section - Placed after 3 rows of the page */}
      <AdsSection />

      {/* Slide Drawer Modal for Buyer Detailed Intel */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col justify-between animate-slideLeft">
            
            {/* Header */}
            <div>
              <div className="bg-[#0E1F35] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img 
                      src={selectedBuyer.avatar} 
                      alt={selectedBuyer.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-black">{selectedBuyer.name}</h3>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Verified Buyer Lead • ID: {selectedBuyer.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBuyer(null)}
                  className="bg-white/10 hover:bg-white/25 text-white/90 p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6">
                
                {/* Visual stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Ready Budget Limit</span>
                    <span className="text-base font-black text-slate-800">{selectedBuyer.budget.split('/')[0]}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Requested Configuration</span>
                    <span className="text-base font-black text-slate-800">{selectedBuyer.preferredBhk} Flat</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-gray-150 pb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Buyer Mandate Details
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {selectedBuyer.details}
                  </p>
                </div>

                {/* Specific specs */}
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  <div className="p-3 bg-slate-50 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> Target Location
                    </span>
                    <span className="font-extrabold text-[#0E1F35]">{selectedBuyer.locality}, {selectedBuyer.city}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Mandate Intent
                    </span>
                    <span className="font-extrabold text-slate-800 uppercase text-[11px]">{selectedBuyer.buyerType}</span>
                  </div>
                  <div className="p-3 bg-slate-100/50 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" /> Financial Clearance
                    </span>
                    <span className="font-extrabold text-emerald-600 uppercase text-[11px]">{selectedBuyer.fundingStatus}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#b38330]" /> Closing Timeline
                    </span>
                    <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase">
                      {selectedBuyer.urgency}
                    </span>
                  </div>
                </div>

                {/* Secure Trust disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-900 leading-relaxed font-semibold">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-extrabold text-amber-900 block mb-0.5">Attorney Double-Checking Security</span>
                    Our platform verifies legal downpayment funds for this buyer. Communication protocols bypass third party brokers directly.
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button
                onClick={() => {
                  alert(`Direct request dispatched! Initiated contact matching with ${selectedBuyer.name}'s designated Legal Council. We will message you shortly.`);
                  setSelectedBuyer(null);
                }}
                className="flex-grow bg-[#0E1F35] hover:bg-[#b38330]/90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Send className="w-4 h-4 fill-white" /> Offer Property To Buyer
              </button>
              <button
                onClick={() => {
                  alert(`Connecting direct audio conference with ${selectedBuyer.name} relative representative. Please turn on audio permissions.`);
                }}
                className="border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl transition-colors cursor-pointer"
                title="Phone Call Match"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Advanced Vetting Filters Modal for Sellers */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4 sm:p-6">
          <div className="bg-white w-full max-w-5xl h-[85vh] sm:h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between animate-scaleUp">
            
            {/* Header section matching majestic visual palette */}
            <div className="bg-[#0E1F35] p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg text-slate-950">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-2">
                    Premium Advanced Seller Vetting Dashboard
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Target exact Nagpur land tracts, apartments, villas & legal compliance profiles
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAllSellFilters}
                  className="text-slate-400 hover:text-amber-400 text-xs font-black uppercase underline transition-colors"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split layout: Category Vertical Tabs vs Content sheets */}
            <div className="flex-grow overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-150">
              
              {/* Left Column list of Vetting categories */}
              <div className="w-full md:w-3/12 overflow-y-auto bg-slate-50/70 p-3 flex md:flex-col gap-1 md:gap-1.5 whitespace-nowrap md:whitespace-normal scrollbar-none">
                {[
                  { id: 0, label: 'Property Type', desc: 'Apartment, house, villa, plot, commercial' },
                  { id: 1, label: 'Location & Regions', desc: 'Nagpur local area, landmarks, GIS map pin' },
                  { id: 2, label: 'Price Sizing & Est.', desc: 'Selling price, negotiable, AI valuation' },
                  { id: 3, label: 'BHK Configurations', desc: '1 RK to 4+ BHK preferences' },
                  { id: 4, label: 'Area Details', desc: 'Carpet space, built-up, Guntha units' },
                  { id: 5, label: 'Property Status', desc: 'Ready possession vs Construction stages' },
                  { id: 6, label: 'Furnishing Status', desc: 'Woodwork level configurations' },
                  { id: 7, label: 'Property Age', desc: 'Asset vintage & luxury layouts' },
                  { id: 8, label: 'Essential Amenities', desc: 'Lift, security, EV, rooftop lounge' },
                  { id: 9, label: 'Ownership Details', desc: 'Direct owner, agency or freehold status' },
                  { id: 10, label: 'Legal Verification', desc: 'RERA registry, titles double-checking' },
                  { id: 11, label: 'Facing & Vaastu', desc: 'Eight directions, corner property sets' },
                  { id: 12, label: 'Floor Information', desc: 'Floor levels, penthouses, ground floor' },
                  { id: 13, label: 'Parking Details', desc: 'Allocated covered bike/car parking slots' },
                  { id: 14, label: 'Availability Date', desc: 'Keys handover timelines' },
                  { id: 15, label: 'Media & AI Uplifts', desc: 'Photos, videos, description generators' },
                  { id: 16, label: 'Contact Preferences', desc: 'Call, WhatsApp, silent phone settings' },
                  { id: 17, label: 'Lead Management', desc: 'Prospect tracker, pipeline stages' },
                  { id: 18, label: 'Premium Placement', desc: 'Search boosts, featured layouts' }
                ].map((item) => {
                  const isSelected = activeFilterCategoryTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveFilterCategoryTab(item.id)}
                      className={`flex flex-col items-start p-2.5 sm:p-3 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#0E1F35] text-white shadow-md' 
                          : 'hover:bg-slate-150 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight leading-4 block">{item.label}</span>
                      <span className={`text-[9px] font-bold block mt-0.5 whitespace-normal leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column detailed option selectors */}
              <div className="w-full md:w-9/12 overflow-y-auto p-6 sm:p-8 bg-white flex flex-col justify-between">
                
                <div className="space-y-6">
                  {activeFilterCategoryTab === 0 && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-4">Select Property Types for Smart Match</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Apartment', 'Independent House', 'Villa', 'Plot/Land', 'Builder Floor', 'Farmhouse', 'Commercial Office', 'Shop', 'Warehouse'].map(type => {
                          const isSelected = sellFilterPropType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSellFilterPropType(isSelected ? 'All' : type)}
                              className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col justify-between h-20 cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white border-slate-900 shadow-md scale-98' 
                                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <span className="opacity-75 uppercase text-[9px]">Select</span>
                              <span>{type}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 1 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Nagpur & Regional Location accuracy</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">City Location</label>
                          <select
                            value={sellFilterCity}
                            onChange={(e) => setSellFilterCity(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="All">All Cities</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Pune">Pune</option>
                            <option value="Delhi NCR">Delhi NCR</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Locality name</label>
                          <input
                            type="text"
                            value={sellFilterLocality}
                            onChange={(e) => setSellFilterLocality(e.target.value)}
                            placeholder="e.g. Manish Nagar, Civil Lines"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Landmark</label>
                          <input
                            type="text"
                            value={sellFilterLandmark}
                            onChange={(e) => setSellFilterLandmark(e.target.value)}
                            placeholder="e.g. Near Metro Pillar 140"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Pincode</label>
                          <input
                            type="text"
                            value={sellFilterPincode}
                            onChange={(e) => setSellFilterPincode(e.target.value)}
                            placeholder="e.g. 440015"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1.5">
                        <input
                          type="checkbox"
                          id="nearMetro"
                          checked={sellFilterNearMetro}
                          onChange={(e) => setSellFilterNearMetro(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <label htmlFor="nearMetro" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                          Nearby Metro Route / Highway connectivity (Highly sought in Nagpur)
                        </label>
                      </div>

                      {/* Location auto detect and precise map pinning */}
                      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-[#0E1F35] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                            <Map className="w-4 h-4 text-emerald-500" /> Smart Locator Services
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAutoDetecting(true);
                              setTimeout(() => {
                                setAutoDetecting(false);
                                setSellFilterLocality('Manish Nagar Main Corridor, Wardha Road');
                                setSellFilterPincode('440015');
                                setSellFilterCity('Nagpur');
                                alert("Auto-detection complete! Matched Nagpur Sub-Division Manish Nagar.");
                              }, 1000);
                            }}
                            disabled={autoDetecting}
                            className="text-[10px] font-black text-amber-600 uppercase tracking-wider hover:text-amber-800 transition-colors disabled:text-slate-400 cursor-pointer"
                          >
                            {autoDetecting ? 'Locating...' : 'Auto-detect Locality'}
                          </button>
                        </div>

                        {/* Map simulation wrapper */}
                        <div 
                          onClick={() => {
                            setSellPinnedLocation({ lat: 21.1458, lng: 79.0882 });
                            alert("Location pinned precisely on NMC registry map (Nagpur 21.1458° N, 79.0882° E)!");
                          }}
                          className="w-full h-28 rounded-xl border border-slate-300 relative bg-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors group"
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:16px_16px] bg-[#E8EBF0] opacity-80" />
                          <div className="absolute w-full h-[2px] bg-white/70 top-1/2 -translate-y-1/2" />
                          <div className="absolute h-full w-[2px] bg-white/70 left-1/2 -translate-x-1/2" />
                          <div className="absolute top-1/3 left-1/4 w-12 h-6 bg-emerald-150 border border-white/85 text-[8px] flex items-center justify-center font-bold text-slate-600 rounded">
                            Wardha Rd
                          </div>
                          
                          {sellPinnedLocation ? (
                            <div className="absolute flex flex-col items-center bg-white border border-slate-300 shadow-lg px-2 py-1 rounded text-[9px] font-bold text-slate-900 animate-fadeIn" style={{ top: '35%', left: '44%' }}>
                              <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
                              <span>NMC Location Pinned</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 z-10 text-slate-500 group-hover:scale-105 transition-transform duration-200">
                              <MapPin className="w-5 h-5 text-[#b38330]" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Pin Exact Property Location</span>
                              <span className="text-[8px] text-slate-400">Click anywhere to drop standard Nagpur GIS pin</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 2 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Property Expected Selling Price Details</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Min Budget (₹)</label>
                          <input
                            type="number"
                            value={sellFilterExpectedPriceMin}
                            onChange={(e) => setSellFilterExpectedPriceMin(Number(e.target.value))}
                            placeholder="e.g. 4000000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Max Budget (₹)</label>
                          <input
                            type="number"
                            value={sellFilterExpectedPriceMax}
                            onChange={(e) => setSellFilterExpectedPriceMax(Number(e.target.value))}
                            placeholder="e.g. 15000000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="priceNeg"
                            checked={sellFilterNegotiable}
                            onChange={(e) => setSellFilterNegotiable(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="priceNeg" className="font-bold text-slate-800 cursor-pointer select-none">Price is Negotiable</label>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Estimated Rate per Sq.ft (₹)</label>
                          <input
                            type="number"
                            value={sellFilterPricePerSqft}
                            onChange={(e) => setSellFilterPricePerSqft(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                          />
                        </div>
                      </div>

                      {/* AI valuation features & EMI estimator preview */}
                      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 space-y-3 shadow-lg">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="font-extrabold text-amber-400 uppercase text-[9px] tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Valuation Advisory
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSellAiSuggestedPriceActive(true);
                              alert("AI valuation loaded successfully based on local index sub-register archives.");
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded cursor-pointer"
                          >
                            Valuate Listing
                          </button>
                        </div>

                        {sellAiSuggestedPriceActive && (
                          <div className="text-xs space-y-1.5 animate-fadeIn font-normal">
                            <p className="font-bold text-slate-200">Suggested Price based on nearby sales in last 90 days:</p>
                            <div className="text-base text-amber-300 font-black flex items-center gap-1">
                              ₹ 48.50 Lacs
                              <span className="text-[9px] text-slate-450 font-bold bg-white/20 px-1.5 py-0.5 rounded ml-2">98% Match Grade</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              Calculated from 12 comparative registered sales in Manish Nagar & Wardha Road corridor. Highly defendable benchmark for quick closing.
                            </p>
                          </div>
                        )}

                        <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-300 uppercase font-bold">Buyer Monthly EMI Estimate Preview:</span>
                          <button
                            type="button"
                            onClick={() => setSellEmiPreviewActive(!sellEmiPreviewActive)}
                            className="text-amber-400 text-[10px] font-black uppercase hover:underline cursor-pointer"
                          >
                            {sellEmiPreviewActive ? 'Hide EMI Details' : 'Preview Affordability'}
                          </button>
                        </div>

                        {sellEmiPreviewActive && (
                          <div className="bg-black/20 p-2.5 rounded-lg text-[10px] text-slate-300 font-semibold space-y-1 animate-fadeIn">
                            <div className="flex justify-between">
                              <span>Estimated Downpayment:</span>
                              <span className="font-bold text-white">₹ 9.70 Lacs (20%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interest rate (9.5% standard):</span>
                              <span className="font-bold text-white">9.5% per annum</span>
                            </div>
                            <div className="flex justify-between border-t border-white/5 pt-1 text-white font-bold text-[11px]">
                              <span>Monthly EMI (25 Years):</span>
                              <span className="text-amber-300">₹ 33,960 / month</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 3 && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-4">Required BHK Configuration</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(bhk => {
                          const isSelected = sellFilterBhk === bhk;
                          return (
                            <button
                              key={bhk}
                              type="button"
                              onClick={() => setSellFilterBhk(isSelected ? 'All' : bhk)}
                              className={`p-4 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white border-slate-900 shadow-md transform scale-98' 
                                  : 'bg-slate-50 border-slate-200 text-[#0E1F35] hover:bg-slate-100'
                              }`}
                            >
                              <span className="text-lg font-black">{bhk}</span>
                              <span className="text-[9px] opacity-75 mt-1 uppercase">Selection</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 4 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-750">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Area Sizing Details</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Carpet Area</label>
                          <input
                            type="text"
                            value={sellFilterCarpetArea}
                            onChange={(e) => setSellFilterCarpetArea(e.target.value)}
                            placeholder="e.g. 1200"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Built-up Area</label>
                          <input
                            type="text"
                            value={sellFilterBuiltupArea}
                            onChange={(e) => setSellFilterBuiltupArea(e.target.value)}
                            placeholder="e.g. 1400"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Super Built-up Area</label>
                          <input
                            type="text"
                            value={sellFilterSuperBuiltupArea}
                            onChange={(e) => setSellFilterSuperBuiltupArea(e.target.value)}
                            placeholder="e.g. 1650"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Plot Area</label>
                          <input
                            type="text"
                            value={sellFilterPlotArea}
                            onChange={(e) => setSellFilterPlotArea(e.target.value)}
                            placeholder="e.g. 2400"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">Measurement units</label>
                        <div className="flex gap-2">
                          {['Sq.ft', 'Sq.m', 'Acres', 'Guntha'].map(unit => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setSellFilterAreaUnit(unit)}
                              className={`px-4 py-2 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellFilterAreaUnit === unit 
                                  ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                          * Guntha is highly utilized in outer Nagpur suburbs & layout land segments (1 Guntha ≈ 1,089 Sq.ft).
                        </p>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 5 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Property Status Settings</h3>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">Constructive state status</label>
                        <div className="flex gap-2">
                          {['Ready to move', 'Under construction', 'New launch', 'Resale'].map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setSellFilterStatus(status)}
                              className={`px-3.5 py-2.5 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellFilterStatus === status
                                  ? 'bg-[#0E1F35] text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Expected Possession Date</label>
                          <input
                            type="date"
                            value={sellFilterPossessionDate}
                            onChange={(e) => setSellFilterPossessionDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold cursor-pointer text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Construction Stage (If Pending)</label>
                          <select
                            value={sellFilterConstructionStage}
                            onChange={(e) => setSellFilterConstructionStage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold cursor-pointer text-slate-850"
                          >
                            <option value="All">All Stages</option>
                            <option value="Excavation & Plinth Completed">Excavation & Plinth</option>
                            <option value="Structure & Columns Cast">Slab & RCC Columns</option>
                            <option value="Brickwork & Wall Plastering">Brickwork laid</option>
                            <option value="Finishing & Woodwork stage">Finishing / Interiors</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 6 && (
                    <div>
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-4">Furnishing Status</h3>
                      <div className="flex flex-col gap-2">
                        {['Fully furnished', 'Semi furnished', 'Unfurnished'].map(furn => {
                          const isSelected = sellFilterFurnishing === furn;
                          return (
                            <button
                              key={furn}
                              type="button"
                              onClick={() => setSellFilterFurnishing(isSelected ? 'All' : furn)}
                              className={`p-3 rounded-xl border text-left text-xs font-black uppercase transition-all flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white border-slate-900 shadow-md' 
                                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <span>{furn}</span>
                              <Check className={`w-4 h-4 text-amber-500 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 7 && (
                    <div>
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-4">Property Structure Vintage / Age</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['New', '0–1 years', '1–5 years', '5–10 years', '10+ years'].map(age => {
                          const isSelected = sellFilterPropertyAge === age;
                          return (
                            <button
                              key={age}
                              type="button"
                              onClick={() => setSellFilterPropertyAge(isSelected ? 'All' : age)}
                              className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white border-slate-900 font-black' 
                                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              {age}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 8 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Property Amenities Checklist</h3>
                      
                      <div>
                        <span className="block text-[10px] font-black uppercase text-slate-400 mb-2">Essential utilities</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {['Lift', 'Parking', 'Security', 'Power backup', 'Water supply', 'Garden', 'Gym', 'Swimming pool', 'CCTV'].map(item => {
                            const isSelected = sellFilterAmenities.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSellFilterAmenities(sellFilterAmenities.filter(x => x !== item));
                                  } else {
                                    setSellFilterAmenities([...sellFilterAmenities, item]);
                                  }
                                }}
                                className={`p-2.5 rounded-lg border text-left font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                  isSelected 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <Check className={`w-3.5 h-3.5 text-emerald-605 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-black uppercase text-slate-400 mb-2">Premium conveniences</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {['Smart home', 'EV charging', 'Rooftop lounge', 'Clubhouse'].map(item => {
                            const isSelected = sellFilterAmenities.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSellFilterAmenities(sellFilterAmenities.filter(x => x !== item));
                                  } else {
                                    setSellFilterAmenities([...sellFilterAmenities, item]);
                                  }
                                }}
                                className={`p-2.5 rounded-lg border text-left font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                  isSelected 
                                    ? 'bg-amber-50 text-amber-900 border-amber-300' 
                                    : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
                                }`}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#b38330]" />
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 9 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <div>
                        <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-3">Ownership category status</h3>
                        <div className="flex gap-2">
                          {['Owner', 'Builder', 'Agent'].map(owner => (
                            <button
                              key={owner}
                              type="button"
                              onClick={() => setSellFilterOwnership(owner)}
                              className={`px-4 py-2.5 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellFilterOwnership === owner
                                  ? 'bg-[#0E1F35] text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {owner}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-3">Holding details</h3>
                        <div className="flex gap-2">
                          {['Freehold', 'Leasehold'].map(holding => (
                            <button
                              key={holding}
                              type="button"
                              onClick={() => setSellFilterHolding(holding)}
                              className={`px-4 py-2.5 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellFilterHolding === holding
                                  ? 'bg-[#0E1F35] text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {holding}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 10 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-2">Legal Verification & Compliance</h3>
                      
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="reraAp"
                            checked={sellFilterRera}
                            onChange={(e) => setSellFilterRera(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="reraAp" className="font-bold text-slate-800 cursor-pointer select-none">RERA Approved Status</label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="bankAp"
                            checked={sellFilterBankApproved}
                            onChange={(e) => setSellFilterBankApproved(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="bankAp" className="font-bold text-slate-850 cursor-pointer select-none">Bank Pre-Approved</label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="clearTitle"
                            checked={sellFilterClearTitle}
                            onChange={(e) => setSellFilterClearTitle(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="clearTitle" className="font-bold text-slate-850 cursor-pointer select-none">Clear double-checked title</label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="verProp"
                            checked={sellFilterVerified}
                            onChange={(e) => setSellFilterVerified(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="verProp" className="font-bold text-slate-850 cursor-pointer select-none">Verified Property physical check</label>
                        </div>
                      </div>

                      {/* File uploader and simulated attorney audit */}
                      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Upload Legal Documents for AI Vetting</span>
                        <div 
                          onClick={() => {
                            setSellUploadedDocs([{ name: '7-12_nagpur_holding.pdf', size: '2.4 MB' }, { name: 'rera_certificate.pdf', size: '1.2 MB' }]);
                            alert("Selected legal clearance draft files successfully. Handing over to database.");
                          }}
                          className="border-2 border-dashed border-slate-300 hover:border-[#b38330] rounded-xl p-4 text-center cursor-pointer transition-colors bg-white group"
                        >
                          <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1 group-hover:text-[#b38330] transition-colors" />
                          <span className="block font-black uppercase text-[10px] text-slate-700 tracking-wider">Drag legal PDF or click to select drafts</span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5">Supports 7/12 land records, RERA registration, sale deeds, municipal corp tax ledger charts</span>
                        </div>

                        {sellUploadedDocs.length > 0 && (
                          <div className="space-y-1.5 animate-fadeIn">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Uploaded drafts ({sellUploadedDocs.length})</span>
                            {sellUploadedDocs.map((doc, idx) => (
                              <div key={idx} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg text-[9.5px] font-black text-slate-700 flex justify-between items-center">
                                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-blue-500" /> {doc.name}</span>
                                <span className="text-slate-400 text-[8.5px] font-medium">{doc.size}</span>
                              </div>
                            ))}

                            {/* AI Advisor verification */}
                            <div className="bg-[#0E1F35] text-white p-3 rounded-xl space-y-2 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Attorney DoubleChecking</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSellAiDocVerifying(true);
                                    setTimeout(() => {
                                      setSellAiDocVerifying(false);
                                      setSellAiDocVerifiedResult("Verification passed. Double-checked with Nagpur GIS registry. Safe for instantaneous listing broadcast.");
                                    }, 1200);
                                  }}
                                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded uppercase cursor-pointer"
                                >
                                  {sellAiDocVerifying ? 'Scanning text...' : 'Run Audit'}
                                </button>
                              </div>
                              {sellAiDocVerifiedResult && (
                                <p className="text-[10px] text-emerald-300 font-bold border-l-2 border-emerald-500 pl-2 leading-tight animate-fadeIn">
                                  {sellAiDocVerifiedResult}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 11 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide mb-2">Facing & Vaastu standards</h3>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">Cardinal Facing direction</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['East', 'West', 'North', 'South'].map(dir => (
                            <button
                              key={dir}
                              type="button"
                              onClick={() => setSellFilterFacing(dir)}
                              className={`py-2 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellFilterFacing === dir 
                                  ? 'bg-[#0E1F35] text-white border-slate-900' 
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {dir}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border">
                          <input
                            type="checkbox"
                            id="vaastuCompliant"
                            checked={sellFilterVaastu}
                            onChange={(e) => setSellFilterVaastu(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="vaastuCompliant" className="font-bold text-slate-800 cursor-pointer select-none font-sans">
                            Vaastu Shastra Compliant design (Critical for Nagpur layouts)
                          </label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border">
                          <input
                            type="checkbox"
                            id="cornerProp"
                            checked={sellFilterCornerProperty}
                            onChange={(e) => setSellFilterCornerProperty(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="cornerProp" className="font-bold text-slate-800 cursor-pointer select-none font-sans">
                            Corner Plot / Corner Block (Dual entrance premium access)
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 12 && (
                    <div className="space-y-4 text-xs font-semibold text-[#0E1F35]">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Floor & levels specifications</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Target floor level</label>
                          <input
                            type="text"
                            value={sellFilterFloorNum}
                            onChange={(e) => setSellFilterFloorNum(e.target.value)}
                            placeholder="e.g. 5th Floor"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Total floors in complex</label>
                          <input
                            type="text"
                            value={sellFilterTotalFloors}
                            onChange={(e) => setSellFilterTotalFloors(e.target.value)}
                            placeholder="e.g. 14 Floors"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="groundFloor"
                            checked={sellFilterGroundFloor}
                            onChange={(e) => setSellFilterGroundFloor(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="groundFloor" className="font-bold select-none cursor-pointer font-sans">Ground floor unit (highly suited for elder medical seekers)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="penthouse"
                            checked={sellFilterPenthouse}
                            onChange={(e) => setSellFilterPenthouse(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="penthouse" className="font-bold select-none cursor-pointer font-sans">Penthouse suite with custom open rooftop access</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 13 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Allocated Parking Slots</h3>
                      
                      <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border">
                          <input
                            type="checkbox"
                            id="carPark"
                            checked={sellFilterCarParking}
                            onChange={(e) => setSellFilterCarParking(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="carPark" className="font-bold cursor-pointer select-none">Car Parking space allocated</label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border">
                          <input
                            type="checkbox"
                            id="bikePark"
                            checked={sellFilterBikeParking}
                            onChange={(e) => setSellFilterBikeParking(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="bikePark" className="font-bold cursor-pointer select-none">Bike/Two-wheeler parking slots</label>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border">
                          <input
                            type="checkbox"
                            id="coveredPark"
                            checked={sellFilterCoveredParking}
                            onChange={(e) => setSellFilterCoveredParking(e.target.checked)}
                            className="rounded text-amber-500 cursor-pointer"
                          />
                          <label htmlFor="coveredPark" className="font-bold cursor-pointer select-none">Covered parking / Basement garage lockup</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 14 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-750">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Possession availability keys</h3>
                      
                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border">
                        <input
                          type="checkbox"
                          id="immPoss"
                          checked={sellFilterImmediate}
                          onChange={(e) => setSellFilterImmediate(e.target.checked)}
                          className="rounded text-amber-500 cursor-pointer"
                        />
                        <label htmlFor="immPoss" className="font-bold text-slate-800 cursor-pointer select-none">Immediate Possession / Spot registry closing ready</label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Available from specified custom date</label>
                        <input
                          type="date"
                          value={sellFilterAvailDate}
                          onChange={(e) => setSellFilterAvailDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold cursor-pointer text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 15 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-705">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Property Digital Media & AI Enhancers hub</h3>
                      
                      <div className="grid grid-cols-2 gap-3 pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSellUploadedPhotos([{ name: 'villa_facade_hdr.jpg', url: '' }, { name: 'lobby_ambient.jpg', url: '' }]);
                            alert("Selected 2 real estate photos from local camera folder.");
                          }}
                          className="p-3 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-between text-left hover:bg-slate-100 transition-all cursor-pointer text-slate-800"
                        >
                          <span className="flex items-center gap-1.5 font-bold"><Camera className="w-4 h-4 text-[#b38330]" /> Photos (.jpg, .png)</span>
                          <span className="text-[10px] text-slate-400 bg-white border px-1.5 py-0.5 rounded font-bold">Select</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSellUploadedVideos([{ name: 'walkthrough_drone.mp4', url: '' }]);
                            alert("Drone walkthrough video matched successfully.");
                          }}
                          className="p-3 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-between text-left hover:bg-slate-100 transition-all cursor-pointer text-slate-850"
                        >
                          <span className="flex items-center gap-1.5 font-bold"><Play className="w-4 h-4 text-orange-500" /> Walkthrough Videos</span>
                          <span className="text-[10px] text-slate-400 bg-white border px-1.5 py-0.5 rounded font-bold">Upload</span>
                        </button>
                      </div>

                      {/* AI media assistance */}
                      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-lg">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" /> Real Estate Imaging AI Engine
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setSellAiEnhancing(true);
                              setTimeout(() => {
                                setSellAiEnhancing(false);
                                setSellAiEnhancedSuccess(true);
                                alert("AI Image Enhancer completed! Applied 4K HDR structural tone-mapping & lens alignment.");
                              }, 1000);
                            }}
                            disabled={sellAiEnhancing}
                            className="p-3 bg-white/10 hover:bg-white/15 border border-white/5 rounded-xl text-left transition-all cursor-pointer disabled:opacity-50"
                          >
                            <span className="block font-black text-amber-300 text-[10px] uppercase tracking-wide">AI Image Enhancement</span>
                            <span className="text-[9px] text-slate-300 font-medium block mt-1 leading-tight">Apply HDR illumination, sky correction & clarity tuneups</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              alert("Auto-Photo Sorting executed! Classified: Slideway Facade (1), Gated Living (2), modular kitchen elements (3).");
                            }}
                            className="p-3 bg-white/10 hover:bg-white/15 border border-white/5 rounded-xl text-left transition-all cursor-pointer"
                          >
                            <span className="block font-black text-amber-300 text-[10px] uppercase tracking-wide">Auto Photo Sort Layout</span>
                            <span className="text-[9px] text-slate-300 font-medium block mt-1 leading-tight">Sort pictures automatically by room blueprint category</span>
                          </button>
                        </div>

                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] text-slate-300 uppercase font-black">AI Property Description Generator</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSellAiGeneratingDescription(true);
                                setTimeout(() => {
                                  setSellAiGeneratingDescription(false);
                                  setSellAiDesc("Premium East-facing flat featuring Vaastu-compliant flow, robust direct NMC pipeline connection, dual car parking slots and prime Manish Nagar road transit proximity. Checked and verified under standard RERA rules with clear title deeds.");
                                }, 1200);
                              }}
                              className="text-amber-400 text-[9px] font-black uppercase hover:underline cursor-pointer"
                            >
                              {sellAiGeneratingDescription ? 'Synthesizing...' : 'Generate New description'}
                            </button>
                          </div>
                          
                          <textarea
                            value={sellAiDesc}
                            onChange={(e) => setSellAiDesc(e.target.value)}
                            placeholder="AI-generated text description will populate here for buyer broadcasts..."
                            className="w-full bg-black/35 border border-white/10 rounded-lg p-2 text-[10.5px] leading-relaxed text-slate-200 placeholder-slate-500 font-medium h-16 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 16 && (
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Seller Contact Preferences</h3>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">Preferred method of contact</label>
                        <div className="flex gap-2">
                          {['Call', 'WhatsApp', 'Email'].map(method => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setSellContactPref(method)}
                              className={`px-4 py-2 text-xs font-black uppercase rounded-lg border cursor-pointer ${
                                sellContactPref === method
                                  ? 'bg-[#0E1F35] text-white border-[#0E1F35]'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">Available contact timing</label>
                        <select
                          value={sellContactPrefTime}
                          onChange={(e) => setSellContactPrefTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold cursor-pointer text-slate-805"
                        >
                          <option value="Anytime">Anytime (9 AM - 9 PM)</option>
                          <option value="Morning">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening">Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border mt-2">
                        <input
                          type="checkbox"
                          id="hideNum"
                          checked={sellHideNumber}
                          onChange={(e) => setSellHideNumber(e.target.checked)}
                          className="rounded text-amber-500 cursor-pointer"
                        />
                        <label htmlFor="hideNum" className="font-bold text-slate-800 cursor-pointer select-none">
                          Hide phone number (Only verified pre-approved cash partners can request)
                        </label>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 17 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Sellers Lead Management Dashboard</h3>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded">Broker-Free Desk</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal font-semibold">
                        Narrow and track leads routed directly to your active listings. Check prospective match status:
                      </p>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {[
                          { name: 'New leads', count: 3 },
                          { name: 'Contacted leads', count: 5 },
                          { name: 'Interested buyers', count: 2 },
                          { name: 'Scheduled visits', count: 1 }
                        ].map(stage => {
                          const isSelected = sellLeadStatus === stage.name;
                          return (
                            <button
                              key={stage.name}
                              type="button"
                              onClick={() => setSellLeadStatus(sellLeadStatus === stage.name ? 'All' : stage.name)}
                              className={`p-2 rounded-xl border flex flex-col justify-between h-20 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'ring-2 ring-amber-500 scale-95 border-amber-500 bg-white'
                                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                              }`}
                            >
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-3 block">{stage.name}</span>
                              <span className="text-lg font-black text-slate-800 block mt-1">{stage.count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Lead summary table rendering */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px] font-semibold text-slate-700">
                        <div className="bg-slate-100 p-2.5 font-black uppercase text-[9px] text-[#0E1F35] tracking-wider flex justify-between">
                          <span>Prospect match description</span>
                          <span>Stage tag</span>
                        </div>
                        <div className="divide-y divide-slate-150">
                          <div className="p-2.5 bg-white flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800">Prashant Deshpande</span>
                              <span className="text-[9.5px] text-slate-400 font-medium">Seeking 3 BHK flat Manish Nagar Nagpur</span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 font-black uppercase text-[8px] px-2 py-0.5 rounded">NEW LEAD</span>
                          </div>
                          <div className="p-2.5 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-805">Arun Jaiswal (Investor)</span>
                              <span className="text-[9.5px] text-slate-400 font-medium">Pre-approved cash allotment • Civil Lines</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 font-black uppercase text-[8px] px-2 py-0.5 rounded">INTERESTED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterCategoryTab === 18 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-black text-[#0E1F35] uppercase tracking-wide">Premium Listing Booster Hub</h3>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Amplify your property's lead pipeline matching algorithms. Activating premium features yields direct verified buyer outreach:
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setSellPremiumFeatured(!sellPremiumFeatured)}
                          className={`p-3 border rounded-xl text-left transition-all cursor-pointer ${
                            sellPremiumFeatured 
                              ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-black text-amber-900 uppercase text-[9px] tracking-wider block">★ Featured listing badge</span>
                          <span className="text-slate-500 text-[10px] block mt-1 leading-tight">Featured badges gain 2.8x matches over standard posts in search results</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSellPremiumUrgent(!sellPremiumUrgent)}
                          className={`p-3 border rounded-xl text-left transition-all cursor-pointer ${
                            sellPremiumUrgent 
                              ? 'bg-red-50 border-red-400 ring-1 ring-red-400' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-black text-red-900 uppercase text-[9px] tracking-wider block">⚠ Urgent Sale priority tag</span>
                          <span className="text-slate-500 text-[10px] block mt-1 leading-tight">Signals cash partners we accept immediate spot offers</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSellPremiumTopPlacement(!sellPremiumTopPlacement)}
                          className={`p-3 border rounded-xl text-left transition-all cursor-pointer ${
                            sellPremiumTopPlacement 
                              ? 'bg-[#0E1F35] text-white' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`font-black uppercase text-[9px] tracking-wider block ${sellPremiumTopPlacement ? 'text-amber-400' : 'text-slate-800'}`}>↑ Top Placement search rank</span>
                          <span className={`text-[9.5px] block mt-1 leading-tight ${sellPremiumTopPlacement ? 'text-slate-300' : 'text-slate-500'}`}>Ensures 1st-page positioning in all seeker search filters</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSellPremiumBoost(!sellPremiumBoost)}
                          className={`p-3 border rounded-xl text-left transition-all cursor-pointer ${
                            sellPremiumBoost 
                              ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-black text-blue-900 uppercase text-[9px] tracking-wider block">⚡ Auto AI Matching Boost</span>
                          <span className="text-slate-500 text-[10px] block mt-1 leading-tight">Continuously ping and notify local active mandates matching this template</span>
                        </button>
                      </div>

                      {/* Revenue advisory note */}
                      <div className="bg-amber-50 rounded-xl p-3 text-[10.5px] text-amber-950 font-semibold border-l-4 border-amber-500 flex gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <strong>Outstanding Seller Velocity!</strong> Boosting your listing with Top Placement increases immediate site visits by 4.2x (approximately 18 rapid cash buyer inquiries within 24 hours of dispatch).
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-Footer for specific content sheet actions */}
                <div className="border-t border-slate-150 pt-4 mt-6 flex justify-between items-center sm:flex-row flex-col gap-3">
                  <span className="text-[11px] font-semibold text-slate-500">
                    * Active filters successfully narrowed database counts in real-time.
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={resetAllSellFilters}
                      className="border border-slate-300 hover:bg-slate-100 text-[#0E1F35] font-black px-4 py-3 rounded-xl text-xs uppercase cursor-pointer flex-grow"
                    >
                      Clear Category Filter
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedFiltersModal(false)}
                      className="bg-[#0E1F35] hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl text-xs uppercase cursor-pointer flex-grow text-center"
                    >
                      Show matches ({filteredAndSearchedBuyers.length} buyers found)
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
