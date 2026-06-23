import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Check, User, Phone, MapPin, Award, Briefcase, ArrowRight, ChevronRight, Sparkles, Download, ArrowLeft, Building2, Landmark, CheckCircle, ShieldCheck, Calendar, Trash2, Camera, Upload, Smile, Globe, DollarSign, Trophy, Calculator } from 'lucide-react';

// @ts-ignore
import buyerImg from '../assets/images/buyer_role_preview_1780481203454.png';
import { getGamificationState, getCurrentLevel, dispatchXPAward, GamificationState, ACHIEVEMENT_BADGES, claimDailyCheckIn, simulateNextDayCheckIn, awardXPAction } from '../lib/gamification';
import HeatMapDashboard from './HeatMapDashboard';

// @ts-ignore
import sellerImg from '../assets/images/seller_role_preview_1780481218561.png';
// @ts-ignore
import agentImg from '../assets/images/agent_role_preview_1780481233800.png';
// @ts-ignore
import builderImg from '../assets/images/builder_role_preview_1780481247510.png';
// @ts-ignore
import vendorImg from '../assets/images/vendor_role_preview_1780481612541.png';
// @ts-ignore
import guestImg from '../assets/images/customer_portrait_1779448713685.png';

interface LoginViewProps {
  onBackToHome: () => void;
  onAdminClick: () => void;
  onLoginSuccess: (email: string, name?: string, profilePic?: string, roles?: string[]) => void;
}

export default function LoginView({ onBackToHome, onAdminClick, onLoginSuccess }: LoginViewProps) {
  // Signup State
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Profile Setup State
  const [showProfileSetup, setShowProfileSetup] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('urban_nest_user_profile') !== null;
    }
    return false;
  });
  const [setupStep, setSetupStep] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('urban_nest_user_profile') !== null ? 3 : 1;
    }
    return 1;
  }); // 1: Persona, 2: Profile Form, 3: Digital ID Card
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [registeredConfirmPassword, setRegisteredConfirmPassword] = useState('');
  const [showRegisteredPassword, setShowRegisteredPassword] = useState(false);

  // Setup Fields - Shared Common Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Nagpur');

  // Extended Persona Common Fields
  const [dob, setDob] = useState('');
  const [altEmail, setAltEmail] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('Salaried Professional');
  const [gender, setGender] = useState('Prefer not to say');
  const [selectedAvatar, setSelectedAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver'); // Default 3D clay rendering character
  const [lockedAvatarInfo, setLockedAvatarInfo] = useState<any | null>(null);
  const [profilePic, setProfilePic] = useState(''); // Live captured snapshot or file upload content URL
  const [cameraActive, setCameraActive] = useState(false);

  // Gamification tracking for dynamic lock of avatars
  const [gamState, setGamState] = useState<GamificationState>(() => getGamificationState());

  useEffect(() => {
    const handleUpdate = () => {
      setGamState(getGamificationState());
    };
    window.addEventListener('urban_nest_gamification_updated', handleUpdate);
    window.addEventListener('urban_nest_award_xp_trigger', handleUpdate);
    return () => {
      window.removeEventListener('urban_nest_gamification_updated', handleUpdate);
      window.removeEventListener('urban_nest_award_xp_trigger', handleUpdate);
    };
  }, []);

  // References for live webcam device operation
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Make sure to stop camera capture streaming if user quits or unmounts Component
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Multi-Persona Setup
  const [selectedPersonas, setSelectedPersonas] = useState<('buyer' | 'seller' | 'agent' | 'builder' | 'vendor' | 'guest')[]>(['buyer']);

  // Specific role parameters
  const [buyerBudget, setBuyerBudget] = useState('₹40L - ₹80L');
  const [buyerMinPrice, setBuyerMinPrice] = useState('₹20 Lakhs');
  const [buyerMaxPrice, setBuyerMaxPrice] = useState('₹80 Lakhs');
  const [buyerFundingSource, setBuyerFundingSource] = useState('Bank Loan/Mortgage');
  const [buyerTimeline, setBuyerTimeline] = useState('Immediate (under 30 days)');
  const [buyerPropertyType, setBuyerPropertyType] = useState<'land' | 'house' | 'flat'>('flat');

  // Land / Plot specifics
  const [landPlotArea, setLandPlotArea] = useState('1200 Sq. Feet');
  const [landZoning, setLandZoning] = useState('Residential');
  const [landRoadWidth, setLandRoadWidth] = useState('30 Feet');
  const [landBoundaryWall, setLandBoundaryWall] = useState('Yes');
  const [landLegalStatus, setLandLegalStatus] = useState<string[]>(['Clear Title', 'RERA approved']);

  // House / Villa specifics
  const [houseArea, setHouseArea] = useState('1800 Sq. Feet');
  const [houseBhk, setHouseBhk] = useState('3 BHK');
  const [houseFloors, setHouseFloors] = useState('2 Floors');
  const [houseConstructionStatus, setHouseConstructionStatus] = useState('Ready to Move');
  const [houseParking, setHouseParking] = useState('Yes');
  const [houseGarden, setHouseGarden] = useState('Yes');
  const [houseExpansion, setHouseExpansion] = useState('No');

  // Flat / Apartment specifics
  const [flatArea, setFlatArea] = useState('1400 Sq. Feet');
  const [flatBhk, setFlatBhk] = useState('2 BHK');
  const [flatFloorLevel, setFlatFloorLevel] = useState('Higher floor');
  const [flatConstructionStatus, setFlatConstructionStatus] = useState('Ready to Move');
  const [flatAge, setFlatAge] = useState('New');
  const [flatGated, setFlatGated] = useState('Yes');
  const [flatSecurity, setFlatSecurity] = useState('Yes');
  const [flatPowerBackup, setFlatPowerBackup] = useState('Yes');

  const [buyerLocationIntent, setBuyerLocationIntent] = useState('Within 5 km of my current location');
  const [buyerLifestyleTags, setBuyerLifestyleTags] = useState<string[]>(['Close to Metro', 'Gated Community']);
  const [buyerRawIntent, setBuyerRawIntent] = useState('');

  // Tenant / Renting specific parameters
  const [buyerSubMode, setBuyerSubMode] = useState<'buy' | 'rent'>('buy'); // Controls if they are a real estate purchaser or tenant
  const [rentMinPrice, setRentMinPrice] = useState('₹15,000');
  const [rentMaxPrice, setRentMaxPrice] = useState('₹40,000');
  const [rentSecurityDepositCap, setRentSecurityDepositCap] = useState('₹1 Lakh');
  const [rentLeaseDuration, setRentLeaseDuration] = useState('1 Year');
  const [rentMoveInDate, setRentMoveInDate] = useState('Immediate');
  const [rentPropertyType, setRentPropertyType] = useState<'flat' | 'house' | 'land'>('flat');

  // Tenant Flat specs
  const [rentFlatBhk, setRentFlatBhk] = useState('2 BHK');
  const [rentFlatFloorLevel, setRentFlatFloorLevel] = useState('Higher floor');
  const [rentFlatFurnishing, setRentFlatFurnishing] = useState('Semi-Furnished');
  const [rentFlatAmenities, setRentFlatAmenities] = useState<string[]>(['Gated security', 'Power backup']);

  // Tenant House specs
  const [rentHouseFloors, setRentHouseFloors] = useState('1 Floor');
  const [rentHouseGarden, setRentHouseGarden] = useState('Yes');
  const [rentHouseFurnishing, setRentHouseFurnishing] = useState('Semi-Furnished');
  const [rentHouseAmenities, setRentHouseAmenities] = useState<string[]>(['Private parking', 'Water storage tank']);

  // Tenant Land/Plot specs
  const [rentLandArea, setRentLandArea] = useState('1200 Sq. Ft');
  const [rentLandAmenities, setRentLandAmenities] = useState<string[]>(['Road approach width']);
  const [rentLandCommercialUse, setRentLandCommercialUse] = useState('Commercial storage');

  // Tenant Lifestyle Preferences
  const [rentPetOwnership, setRentPetOwnership] = useState('No');
  const [rentPetType, setRentPetType] = useState('');
  const [rentDietaryConstraint, setRentDietaryConstraint] = useState('Family preferred');
  const [rentParkingTwoWheeler, setRentParkingTwoWheeler] = useState('1');
  const [rentParkingFourWheeler, setRentParkingFourWheeler] = useState('1');
  const [rentSmokingPolicy, setRentSmokingPolicy] = useState('No');

  const [sellerPrice, setSellerPrice] = useState('₹50L - ₹1.2Cr');
  
  // Real Estate Owner / Seller Trust Layer States
  const [sellerPersona, setSellerPersona] = useState<'owner' | 'agent' | 'pmc'>('owner');
  const [sellerKycType, setSellerKycType] = useState('Aadhaar Card');
  const [sellerKycFile, setSellerKycFile] = useState<string | null>(null);
  const [sellerKycFileName, setSellerKycFileName] = useState('');
  const [sellerPayoutType, setSellerPayoutType] = useState<'bank' | 'upi'>('upi');
  const [sellerPayoutBank, setSellerPayoutBank] = useState('');
  const [sellerPayoutIfsc, setSellerPayoutIfsc] = useState('');
  const [sellerPayoutUpi, setSellerPayoutUpi] = useState('');

  // General Rental Terms & Rules for Owner Listings
  const [sellerPrefTenants, setSellerPrefTenants] = useState<string[]>(['Families Allowed']);
  const [sellerPetPolicy, setSellerPetPolicy] = useState<'Allowed' | 'Not Allowed'>('Not Allowed');
  const [sellerSmokingPolicy, setSellerSmokingPolicy] = useState<'Allowed' | 'Not Allowed'>('Not Allowed');
  const [sellerDietaryPref, setSellerDietaryPref] = useState<'Veg Only' | 'No Restrictions'>('No Restrictions');
  const [sellerLeaseDuration, setSellerLeaseDuration] = useState('11 Months');

  // Dynamic Property Listing Matrix State (Current being configured)
  const [activeSellerPropType, setActiveSellerPropType] = useState<'flat' | 'land' | 'house'>('flat');
  
  // Flat listing matrix state
  const [sellerFlatRent, setSellerFlatRent] = useState('₹25,000');
  const [sellerFlatMaintenance, setSellerFlatMaintenance] = useState('₹3,000');
  const [sellerFlatMaintenanceType, setSellerFlatMaintenanceType] = useState<'Fixed' | 'Per-Sq-Ft'>('Fixed');
  const [sellerFlatDeposit, setSellerFlatDeposit] = useState('₹1,00,000');
  const [sellerFlatCarpetArea, setSellerFlatCarpetArea] = useState('1100 Sq. Ft');
  const [sellerFlatSuperArea, setSellerFlatSuperArea] = useState('1450 Sq. Ft');
  const [sellerFlatFloorNum, setSellerFlatFloorNum] = useState('5th');
  const [sellerFlatTotalFloors, setSellerFlatTotalFloors] = useState('12');
  const [sellerFlatFurnishing, setSellerFlatFurnishing] = useState('Semi-Furnished');
  const [sellerFlatChecklist, setSellerFlatChecklist] = useState<string[]>(['ACs', 'Modular Kitchen']);
  const [sellerFlatWaterSource, setSellerFlatWaterSource] = useState('Municipal');
  const [sellerFlatPowerBackup, setSellerFlatPowerBackup] = useState('100% capacity');
  const [sellerFlatLiftAccess, setSellerFlatLiftAccess] = useState('Yes, Dual Lift');

  // Plot/Land listing matrix state
  const [sellerPlotLease, setSellerPlotLease] = useState('₹50,000');
  const [sellerPlotDeposit, setSellerPlotDeposit] = useState('₹2,00,000');
  const [sellerPlotTax, setSellerPlotTax] = useState('Paid by landlord');
  const [sellerPlotArea, setSellerPlotArea] = useState('2400 Sq. Ft');
  const [sellerPlotBoundary, setSellerPlotBoundary] = useState('Yes');
  const [sellerPlotGate, setSellerPlotGate] = useState('Yes');
  const [sellerPlotWater, setSellerPlotWater] = useState('Yes');
  const [sellerPlotElectricity, setSellerPlotElectricity] = useState('Yes');
  const [sellerPlotRoadWidth, setSellerPlotRoadWidth] = useState('30 Feet');

  // House/Villa listing matrix state
  const [sellerHouseRent, setSellerHouseRent] = useState('₹65,000');
  const [sellerHouseMaintenance, setSellerHouseMaintenance] = useState('₹5,000');
  const [sellerHouseDeposit, setSellerHouseDeposit] = useState('₹2,50,000');
  const [sellerHouseBuiltup, setSellerHouseBuiltup] = useState('3200 Sq. Ft');
  const [sellerHousePlotArea, setSellerHousePlotArea] = useState('1800 Sq. Ft');
  const [sellerHouseFloors, setSellerHouseFloors] = useState('2 Storeys');
  const [sellerHouseFurnishing, setSellerHouseFurnishing] = useState('Fully Furnished');
  const [sellerHouseBathrooms, setSellerHouseBathrooms] = useState('4');
  const [sellerHouseKitchen, setSellerHouseKitchen] = useState('Premium modular');
  const [sellerHouseWaterTank, setSellerHouseWaterTank] = useState('5000 Litres');
  const [sellerHouseParking, setSellerHouseParking] = useState('2 Dedicated Slots');
  const [sellerHouseGardenTerrace, setSellerHouseGardenTerrace] = useState('Yes (Private Garden & Terraces)');

  // Formatted Array of uploaded listings for the database/ID Card
  const [sellerProperties, setSellerProperties] = useState<any[]>([
    {
      id: 'prop-1',
      type: 'flat',
      rent: '₹25,000/mo',
      maintenance: '₹3,000 (Fixed)',
      deposit: '₹1,00,000',
      specs: 'Flat: 1100-1450 sqft, 5th Floor, Semi-Furnished, Municipal water, Lift, AC'
    }
  ]);

  const [agentRera, setAgentRera] = useState('');
  const [agentCompany, setAgentCompany] = useState('');
  const [agentExp, setAgentExp] = useState('2');

  // Broker / Agent Legal Compliance & Credentials
  const [agentCertified, setAgentCertified] = useState<boolean>(true);
  const [agentCertFile, setAgentCertFile] = useState<string | null>(null);
  const [agentCertFileName, setAgentCertFileName] = useState('');
  const [agentCorpPersona, setAgentCorpPersona] = useState<string>('Individual Agent');
  const [agentPan, setAgentPan] = useState('');
  const [agentGst, setAgentGst] = useState('');

  // Geographical Jurisdiction & Expertise
  const [agentCities, setAgentCities] = useState('Nagpur, Mumbai, Pune');
  const [agentLocalities, setAgentLocalities] = useState('Dharampeth, Manish Nagar, Shivaji Nagar');
  const [agentOfficeAddress, setAgentOfficeAddress] = useState('Metro Chambers, Block D, Nagpur (MS)');

  // Specialization Matrix
  const [agentSpecialties, setAgentSpecialties] = useState<string[]>(['Flats / Apartments']);
  const [agentAssetFocus, setAgentAssetFocus] = useState<string[]>(['Resale / Secondary Market', 'New Launches / Developer Sales']);
  const [agentTransactionTypes, setAgentTransactionTypes] = useState<string[]>(['Rentals / Leasing']);
  const [agentBudgetTiers, setAgentBudgetTiers] = useState<string[]>(['Mid-Segment Luxury']);

  // Marketplace Trust & Commercials
  const [agentBrokerage, setAgentBrokerage] = useState('2% on Sales, 1 Month Rent on Leases');
  const [agentPastVolume, setAgentPastVolume] = useState('34,000 Sq. Ft (12 Deals closed)');
  const [agentLanguages, setAgentLanguages] = useState<string[]>(['English', 'Hindi', 'Marathi']);

  const [builderRera, setBuilderRera] = useState('');
  const [builderCompany, setBuilderCompany] = useState('');
  const [builderExp, setBuilderExp] = useState('3');

  // Developer Legal & Corporate Identifiers
  const [builderPan, setBuilderPan] = useState('');
  const [builderCin, setBuilderCin] = useState('');
  const [builderGst, setBuilderGst] = useState('');
  const [builderEscrowBank, setBuilderEscrowBank] = useState('HDFC RERA Special Project Escrow - A/C 5020008471254 (IFSC: HDFC0000012)');

  // Double-Sided Operational Strategy (Buy vs. Build)
  const [builderStrategy, setBuilderStrategy] = useState<string>('Raw Land Build-Out (Greenfield)');
  const [builderTargetAssets, setBuilderTargetAssets] = useState<string[]>(['Raw residential/commercial zones']);
  const [builderMinPlotSize, setBuilderMinPlotSize] = useState('1,200 Sq. Mtr');
  const [builderMaxPlotSize, setBuilderMaxPlotSize] = useState('25,000 Sq. Mtr');
  const [builderTotalLayoutCapability, setBuilderTotalLayoutCapability] = useState('15 Acres');
  const [builderLocalityFocus, setBuilderLocalityFocus] = useState<string[]>(['Outlying suburban growth corridors']);
  const [builderFinancialModes, setBuilderFinancialModes] = useState<string[]>(['Direct corporate land purchases', 'Joint Development Agreements (JDA)']);

  // The "Build-Out" Persona & Output Capacity
  const [builderClassifications, setBuilderClassifications] = useState<string[]>(['Residential Societies']);
  const [builderConstructionTier, setBuilderConstructionTier] = useState<string>('Mid-tier Townships');
  const [builderProjectPipeline, setBuilderProjectPipeline] = useState('Urban Horizon Towers, 2 & 3 BHK Premium Flats, Handover: Dec 2028');

  // Developer Track Record & Trust Metrics
  const [builderDeliveredFootprint, setBuilderDeliveredFootprint] = useState('1.4 Million Sq. Ft / 950+ Units.');
  const [builderWarrantyClause, setBuilderWarrantyClause] = useState<boolean>(true);

  const [vendorCategory, setVendorCategory] = useState('Interior & Decor');
  const [vendorCompany, setVendorCompany] = useState('');
  const [vendorExp, setVendorExp] = useState('2');

  // Vendor Basic & Professional Identity
  const [vendorType, setVendorType] = useState('Registered Service Agency');
  const [vendorWhatsapp, setVendorWhatsapp] = useState('');
  const [vendorLogo, setVendorLogo] = useState('');

  // Service Category, Specialization Skills & Scale Focus
  const [vendorSkills, setVendorSkills] = useState<string[]>(['Space planning', '3D visualization', 'Modular kitchens']);
  const [vendorScaleFocus, setVendorScaleFocus] = useState<string[]>(['Premium', 'Luxury']);

  // Service Coverage & Operating Logistics
  const [vendorCities, setVendorCities] = useState('Nagpur');
  const [vendorNeighborhoods, setVendorNeighborhoods] = useState('Dharampeth, Ramdaspeth, Shankar Nagar');
  const [vendorWorkingHours, setVendorWorkingHours] = useState('9:00 AM to 7:00 PM');
  const [vendorOffDays, setVendorOffDays] = useState<string[]>(['Sunday']);
  const [vendorEmergency, setVendorEmergency] = useState<boolean>(true);

  // Pricing & Payout Matrix
  const [vendorPricingBasis, setVendorPricingBasis] = useState('Per-Square-Foot Rate');
  const [vendorMinFee, setVendorMinFee] = useState('₹500 Visit Fee');

  // Verification & Trust Quality Layer
  const [vendorNationalId, setVendorNationalId] = useState('');
  const [vendorLicense, setVendorLicense] = useState('');
  const [vendorPortfolio, setVendorPortfolio] = useState<string[]>([
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=450&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=450&auto=format&fit=crop&q=60'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeHubTab, setActiveHubTab] = useState<'achievements' | 'leaderboard' | 'heatmap'>('achievements');
  const [digitalIdDetails, setDigitalIdDetails] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urban_nest_user_profile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (digitalIdDetails) {
      localStorage.setItem('urban_nest_user_profile', JSON.stringify(digitalIdDetails));
    } else {
      localStorage.removeItem('urban_nest_user_profile');
    }
  }, [digitalIdDetails]);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI state for dual options
  const [activeCard, setActiveCard] = useState<'signup' | 'login' | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('login_active_card_preset');
      if (saved === 'login' || saved === 'signup') {
        sessionStorage.removeItem('login_active_card_preset');
        return saved;
      }
    }
    return 'signup';
  });

  // Feedback Notification Banner State
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerFeedback = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
      triggerFeedback('Please populate all sign up credentials.', 'error');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      triggerFeedback('Passwords do not match.', 'error');
      return;
    }
    triggerFeedback(`Credentials pre-registered! Setting up your Real Estate Digital ID...`, 'success');
    setRegisteredEmail(signupEmail);
    setRegisteredPassword(signupPassword);
    setRegisteredConfirmPassword(signupConfirmPassword);
    
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setShowProfileSetup(true);
    setSetupStep(1);
  };

  const handleProfileSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      triggerFeedback('Please enter your full name and phone number to build your ID.', 'error');
      return;
    }
    if (!registeredEmail) {
      triggerFeedback('An email address is required for your identity credentials.', 'error');
      return;
    }
    if (!registeredPassword) {
      triggerFeedback('Please provide a secure password under Primary Common Details.', 'error');
      return;
    }
    if (registeredPassword !== registeredConfirmPassword) {
      triggerFeedback('Confirm password must match the chosen password under Primary Common Details.', 'error');
      return;
    }
    
    // Check validation of individual selected roles
    if (selectedPersonas.includes('agent')) {
      if (!agentRera) {
        triggerFeedback('Please provide a valid RERA registration code for your Agent license.', 'error');
        return;
      }
      if (!agentCompany) {
        triggerFeedback('Please provide your affiliated company / agency name for the Agent role.', 'error');
        return;
      }
    }

    if (selectedPersonas.includes('builder')) {
      if (!builderRera) {
        triggerFeedback('Please provide a valid RERA registration code for your Builder license.', 'error');
        return;
      }
      if (!builderCompany) {
        triggerFeedback('Please provide your corporate development firm name for the Builder role.', 'error');
        return;
      }
    }

    if (selectedPersonas.includes('vendor')) {
      if (!vendorCompany) {
        triggerFeedback('Please provide your supply or decoration company name for the Vendor role.', 'error');
        return;
      }
    }

    setIsGenerating(true);
    triggerFeedback('Verifying RERA database & issuing secure Urban Nest ID...', 'info');

    setTimeout(() => {
      const generatedId = `UNR-${Math.floor(100000 + Math.random() * 900000)}`;
      setDigitalIdDetails({
        id: generatedId,
        name: fullName,
        phone: phone,
        email: registeredEmail || 'user@urbannestrealty.com',
        roles: selectedPersonas,
        city: city,
        
        // Save new extended biographics
        dob,
        altEmail,
        altPhone,
        address,
        occupation,
        gender,
        selectedAvatar,
        profilePic,
        
        // Save role-specific details
        buyerSubMode,
        buyerBudget: `${buyerMinPrice} - ${buyerMaxPrice}`,
        buyerMinPrice,
        buyerMaxPrice,
        buyerFundingSource,
        buyerTimeline,
        buyerPropertyType,
        landPlotArea,
        landZoning,
        landRoadWidth,
        landBoundaryWall,
        landLegalStatus,
        houseArea,
        houseBhk,
        houseFloors,
        houseConstructionStatus,
        houseParking,
        houseGarden,
        houseExpansion,
        flatArea,
        flatBhk,
        flatFloorLevel,
        flatConstructionStatus,
        flatAge,
        flatGated,
        flatSecurity,
        flatPowerBackup,
        buyerLocationIntent,
        buyerLifestyleTags,
        buyerRawIntent,

        // Save Renting specifics
        rentMinPrice,
        rentMaxPrice,
        rentSecurityDepositCap,
        rentLeaseDuration,
        rentMoveInDate,
        rentPropertyType,
        rentFlatBhk,
        rentFlatFloorLevel,
        rentFlatFurnishing,
        rentFlatAmenities,
        rentHouseFloors,
        rentHouseGarden,
        rentHouseFurnishing,
        rentHouseAmenities,
        rentLandArea,
        rentLandAmenities,
        rentLandCommercialUse,
        rentPetOwnership,
        rentPetType,
        rentDietaryConstraint,
        rentParkingTwoWheeler,
        rentParkingFourWheeler,
        rentSmokingPolicy,

        sellerPrice,
        sellerPersona,
        sellerKycType,
        sellerKycFileName,
        sellerPayoutType,
        sellerPayoutBank,
        sellerPayoutIfsc,
        sellerPayoutUpi,
        sellerPrefTenants,
        sellerPetPolicy,
        sellerSmokingPolicy,
        sellerDietaryPref,
        sellerLeaseDuration,
        sellerProperties,
        agentRera,
        agentCompany,
        agentExp,
        agentCertified,
        agentCertFile,
        agentCertFileName,
        agentCorpPersona,
        agentPan,
        agentGst,
        agentCities,
        agentLocalities,
        agentOfficeAddress,
        agentSpecialties,
        agentAssetFocus,
        agentTransactionTypes,
        agentBudgetTiers,
        agentBrokerage,
        agentPastVolume,
        agentLanguages,
        builderRera,
        builderCompany,
        builderExp,
        builderPan,
        builderCin,
        builderGst,
        builderEscrowBank,
        builderStrategy,
        builderTargetAssets,
        builderMinPlotSize,
        builderMaxPlotSize,
        builderTotalLayoutCapability,
        builderLocalityFocus,
        builderFinancialModes,
        builderClassifications,
        builderConstructionTier,
        builderProjectPipeline,
        builderDeliveredFootprint,
        builderWarrantyClause,
        vendorCategory,
        vendorCompany,
        vendorExp,
        vendorType,
        vendorWhatsapp,
        vendorLogo,
        vendorSkills,
        vendorScaleFocus,
        vendorCities,
        vendorNeighborhoods,
        vendorWorkingHours,
        vendorOffDays,
        vendorEmergency,
        vendorPricingBasis,
        vendorMinFee,
        vendorNationalId,
        vendorLicense,
        vendorPortfolio,
        
        dateCreated: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      });
      setIsGenerating(false);
      setSetupStep(3);
      triggerFeedback('Your Unified Urban Nest Real Estate Digital ID Card has been generated successfully! 🎉', 'success');
    }, 1800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerFeedback('Please populate all login credentials.', 'error');
      return;
    }

    if (registeredEmail && loginEmail.toLowerCase() === registeredEmail.toLowerCase()) {
      if (loginPassword !== registeredPassword) {
        triggerFeedback('Password incorrect. Please try again with the password you registered.', 'error');
        return;
      }
    }

    triggerFeedback(`Core login verified for ${loginEmail}! Welcome back.`, 'success');
    
    const isRegisteredUser = registeredEmail && loginEmail.toLowerCase() === registeredEmail.toLowerCase();
    const dispName = isRegisteredUser && fullName ? fullName : loginEmail.split('@')[0];
    const dispPic = isRegisteredUser && (profilePic || selectedAvatar) ? (profilePic || selectedAvatar) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
    const dispRoles = isRegisteredUser ? selectedPersonas : ['buyer'];

    setLoginEmail('');
    setLoginPassword('');
    onLoginSuccess(loginEmail, dispName, dispPic, dispRoles);
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' }
      });
      streamRef.current = stream;
      // Small timeout to let the reference bind correctly to the newly mounted video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
      }, 300);
      triggerFeedback('Camera access granted! Align your face inside the frame.', 'info');
    } catch (err) {
      console.error(err);
      triggerFeedback('Camera initialization failed. Please upload a profile picture from your files, or ensure camera permission is enabled.', 'error');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 400, 400);
          const dataUrl = canvas.toDataURL('image/png');
          setProfilePic(dataUrl);
          stopCamera();
          triggerFeedback('Webcam snapshot captured successfully! 📸', 'success');
        }
      } catch (e) {
        console.error(e);
        triggerFeedback('Failed to freeze snapshot frame.', 'error');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerFeedback('File too large. Please select an image under 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        triggerFeedback('Custom Profile Photo attached and verified! 🎉', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLogin = (platform: string) => {
    triggerFeedback(`Initiating OAuth redirection with ${platform}...`, 'info');
  };

  return (
    <div id="login-signup-view" className="bg-[#F3F4F6] min-h-[calc(100vh-180px)] py-12 px-4 sm:px-12 flex flex-col justify-between select-none">
      
      {/* Toast Notice Banner */}
      {feedbackMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn max-w-sm w-full px-4">
          <div className={`p-4 rounded-lg shadow-xl text-center text-xs font-bold uppercase tracking-wider text-white ${
            feedbackMsg.type === 'success' ? 'bg-[#0E1F35] border-l-4 border-emerald-500' :
            feedbackMsg.type === 'error' ? 'bg-rose-700 border-l-4 border-red-500' : 'bg-amber-600 border-l-4 border-[#0E1F35]'
          }`}>
            {feedbackMsg.text}
          </div>
        </div>
      )}

      {showProfileSetup ? (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-500 overflow-hidden min-h-[550px] animate-fadeIn">
          {/* Wizard progress header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#064E6B] fill-[#064E6B] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#064E6B] tracking-wider">Step {setupStep} of 3</span>
              </div>
              <h2 className="text-[#0E1F35] text-2xl font-black uppercase tracking-tight mt-1">Real Estate Identity Setup</h2>
              <p className="text-xs text-slate-500 font-medium">Configure your profile attributes to gain immediate access privileges</p>
            </div>

            {setupStep < 3 && (
              <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3.5 rounded-full border border-slate-100 select-none">
                <div className="flex gap-1.5 items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${setupStep >= 1 ? 'bg-[#064E6B] text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Role</span>
                </div>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <div className="flex gap-1.5 items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${setupStep >= 2 ? 'bg-[#064E6B] text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Form</span>
                </div>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <div className="flex gap-1.5 items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${setupStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">ID Issue</span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 1: SELECT PERSONA */}
          {setupStep === 1 && (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#0E1F35]">Choose your Real Estate Account Role(s)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">You are welcome to select multiple active roles at once to construct a unified digital ID passport.</p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-teal-50 text-[#004C5C] px-3 py-1.5 rounded-full border border-teal-100 self-start sm:self-center">
                    Selected: {selectedPersonas.includes('guest') ? 'Guest Mode' : `${selectedPersonas.length} / 5`}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Buyer */}
                  <div 
                    onClick={() => {
                      const role = 'buyer';
                      const current = selectedPersonas.filter(r => r !== 'guest');
                      if (current.includes(role)) {
                        if (current.length > 1) {
                          setSelectedPersonas(current.filter(r => r !== role));
                        } else {
                          triggerFeedback('You must select at least one role to construct your Real Estate identity!', 'info');
                        }
                      } else {
                        setSelectedPersonas([...current, role]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('buyer') ? 'border-[#064E6B] bg-[#064E6B]/5 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={buyerImg} 
                        alt="Individual Buyer / Tenant" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('buyer') && (
                        <div className="absolute inset-0 bg-[#064E6B]/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-[#064E6B]">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('buyer') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-[#064E6B] text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Add</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Individual Buyer / Tenant</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Looking to buy, rent, invest in premium residential houses, plots or PG rooms.</p>
                  </div>

                  {/* Seller */}
                  <div 
                    onClick={() => {
                      const role = 'seller';
                      const current = selectedPersonas.filter(r => r !== 'guest');
                      if (current.includes(role)) {
                        if (current.length > 1) {
                          setSelectedPersonas(current.filter(r => r !== role));
                        } else {
                          triggerFeedback('You must select at least one role to construct your Real Estate identity!', 'info');
                        }
                      } else {
                        setSelectedPersonas([...current, role]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('seller') ? 'border-emerald-600 bg-emerald-50 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={sellerImg} 
                        alt="Property Owner / Host" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('seller') && (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-emerald-600">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('seller') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Add</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Property Owner / Host</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Looking to list and sell holdings, residential homes, layout plots, or PG units.</p>
                  </div>

                  {/* Agent */}
                  <div 
                    onClick={() => {
                      const role = 'agent';
                      const current = selectedPersonas.filter(r => r !== 'guest');
                      if (current.includes(role)) {
                        if (current.length > 1) {
                          setSelectedPersonas(current.filter(r => r !== role));
                        } else {
                          triggerFeedback('You must select at least one role to construct your Real Estate identity!', 'info');
                        }
                      } else {
                        setSelectedPersonas([...current, role]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('agent') ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={agentImg} 
                        alt="Certified Broker / Agent" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('agent') && (
                        <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-indigo-600">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('agent') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-indigo-600 text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Add</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Certified Broker / Agent</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Representing clients professionally with mandatory RERA authorization records.</p>
                  </div>

                  {/* Builder */}
                  <div 
                    onClick={() => {
                      const role = 'builder';
                      const current = selectedPersonas.filter(r => r !== 'guest');
                      if (current.includes(role)) {
                        if (current.length > 1) {
                          setSelectedPersonas(current.filter(r => r !== role));
                        } else {
                          triggerFeedback('You must select at least one role to construct your Real Estate identity!', 'info');
                        }
                      } else {
                        setSelectedPersonas([...current, role]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('builder') ? 'border-amber-600 bg-amber-50 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={builderImg} 
                        alt="Developer / Builder" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('builder') && (
                        <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-amber-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('builder') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-amber-600 text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Add</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Developer / Builder</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Developing massive housing, commercial structures, townships, and projects.</p>
                  </div>

                  {/* Vendor */}
                  <div 
                    onClick={() => {
                      const role = 'vendor';
                      const current = selectedPersonas.filter(r => r !== 'guest');
                      if (current.includes(role)) {
                        if (current.length > 1) {
                          setSelectedPersonas(current.filter(r => r !== role));
                        } else {
                          triggerFeedback('You must select at least one role to construct your Real Estate identity!', 'info');
                        }
                      } else {
                        setSelectedPersonas([...current, role]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('vendor') ? 'border-orange-600 bg-orange-50 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={vendorImg} 
                        alt="Service Vendor / Supplier" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('vendor') && (
                        <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-orange-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('vendor') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-orange-600 text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Add</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Service Vendor / Supplier</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Looking to sell products and services related to real estate.</p>
                  </div>

                  {/* Guest / Explorer */}
                  <div 
                    onClick={() => {
                      setSelectedPersonas(['guest']);
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${selectedPersonas.includes('guest') ? 'border-teal-600 bg-teal-50 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2 relative flex items-center justify-center">
                      <img 
                        src={guestImg} 
                        alt="Not Sure / Guest Explorer" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {selectedPersonas.includes('guest') && (
                        <div className="absolute inset-0 bg-teal-500/10 flex items-center justify-center backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-xl bg-slate-100 text-teal-600">
                        <Smile className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedPersonas.includes('guest') ? (
                          <div className="px-2.5 py-0.5 text-[9px] font-extrabold bg-teal-600 text-white rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">Click to Select</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-[#0E1F35] text-sm mt-1">Not Sure / Just a Guest</h4>
                    <p className="text-[11px] text-slate-500 font-medium font-semibold">Want to explore the Urban Nest Realty platform with no active transactional demands.</p>
                  </div>

                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6 font-semibold">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowProfileSetup(false);
                    setSetupStep(1);
                  }}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Cancel Sign Up
                </button>
                <button 
                  type="button" 
                  onClick={() => setSetupStep(2)}
                  className="flex items-center gap-1.5 py-3 px-6 bg-[#0E1F35] hover:bg-[#064E6B] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  Continue Form <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE DETAILS FORM */}
          {setupStep === 2 && (
            <form onSubmit={handleProfileSetupSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-6 text-left">
                
                {/* Visual Header describing multi-role status */}
                 <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#064E6B] animate-pulse"></span>
                      <h3 className="text-xs font-black uppercase text-[#0E1F35] tracking-wider">Multi-Role Identity Form Integration</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {selectedPersonas.includes('guest') ? (
                        <>You've selected <span className="font-extrabold text-[#064E6B]">Guest / Explorer mode</span>. Please provide your basic primary contact and identity details below to instantly generate your guest access credentials.</>
                      ) : (
                        <>Please provide the requested data below. You've selected <span className="font-extrabold text-[#064E6B]">{selectedPersonas.length} role(s)</span>. First, fill in your common identification details, then specify the specialized data asked for each of your selected profiles.</>
                      )}
                    </p>
                  </div>

                  {/* Horizontal Role Identity Images Previews */}
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">My Selected Active Identities To Configure:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {selectedPersonas.includes('buyer') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={buyerImg} alt="Buyer" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[#064E6B] font-extrabold text-[8px] uppercase tracking-wider block">Role 1 of {selectedPersonas.length}</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Buyer / Tenant</span>
                          </div>
                        </div>
                      )}
                      {selectedPersonas.includes('seller') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={sellerImg} alt="Seller" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-emerald-600 font-extrabold text-[8px] uppercase tracking-wider block">Role 2 of {selectedPersonas.length}</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Owner / Seller</span>
                          </div>
                        </div>
                      )}
                      {selectedPersonas.includes('agent') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={agentImg} alt="Agent" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-indigo-600 font-extrabold text-[8px] uppercase tracking-wider block">Role 3 of {selectedPersonas.length}</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Broker / Agent</span>
                          </div>
                        </div>
                      )}
                      {selectedPersonas.includes('builder') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={builderImg} alt="Builder" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-amber-600 font-extrabold text-[8px] uppercase tracking-wider block">Role 4 of {selectedPersonas.length}</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Developer / Builder</span>
                          </div>
                        </div>
                      )}
                      {selectedPersonas.includes('vendor') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={vendorImg} alt="Vendor" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-orange-600 font-extrabold text-[8px] uppercase tracking-wider block">Role 5 of {selectedPersonas.length}</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Vendor / Supply</span>
                          </div>
                        </div>
                      )}
                      {selectedPersonas.includes('guest') && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                            <img src={guestImg} alt="Guest" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-teal-600 font-extrabold text-[8px] uppercase tracking-wider block">Role 1 of 1</span>
                            <span className="text-[10px] font-black text-[#0D1F34] block truncate">Guest Explorer</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AREA A: COMMON DATA */}
                <div className="border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 bg-slate-50/40 relative shadow-inner space-y-6">
                  <div className="absolute -top-3.5 left-6 bg-[#0E1F35] text-white text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full border border-white/25 shadow-sm">
                    1. Primary Common Details
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">Shared across all selected real estate roles</p>

                  {/* Core Credentials Info */}
                  <div className="bg-white/80 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#0E1F35]/70 tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Identity & Contact Credentials
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Full Name</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Piyush Shende"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Login Email ID Verification */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Login Email ID</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            required 
                            value={registeredEmail}
                            onChange={(e) => setRegisteredEmail(e.target.value)}
                            placeholder="e.g. atg.piyushshende@gmail.com"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Primary Phone</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            required 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Password Review */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Login Password</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all bg-white">
                          <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type={showRegisteredPassword ? "text" : "password"} 
                            required 
                            value={registeredPassword}
                            onChange={(e) => setRegisteredPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisteredPassword(!showRegisteredPassword)}
                            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            {showRegisteredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password Review */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block pl-1">Confirm Password</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type={showRegisteredPassword ? "text" : "password"} 
                            required 
                            value={registeredConfirmPassword}
                            onChange={(e) => setRegisteredConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Preferred City */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Associated Town / City</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-transparent text-slate-800 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none appearance-none"
                          >
                            <option value="Nagpur">Nagpur (Core Hub)</option>
                            <option value="Raipur">Raipur (Regional Hub)</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Pune">Pune</option>
                            <option value="Mumbai">Mumbai</option>
                          </select>
                        </div>
                      </div>

                      {/* Alternative Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Alternative Email address</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={altEmail}
                            onChange={(e) => setAltEmail(e.target.value)}
                            placeholder="e.g. alternate@gmail.com"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Alternative Contact Number */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Alternative Contact Number</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            value={altPhone}
                            onChange={(e) => setAltPhone(e.target.value)}
                            placeholder="e.g. +91 91234 56789"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Biographics */}
                  <div className="bg-white/80 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#0E1F35]/70 tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Biographics & Demographic Parameters
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Date of Birth</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input 
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-transparent text-slate-800 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Gender Selector */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Gender</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-transparent text-slate-800 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none appearance-none"
                          >
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Occupation Selector */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Occupation</label>
                        <div className="relative bg-white rounded-xl flex items-center border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all">
                          <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select 
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full bg-transparent text-slate-800 font-semibold pl-10.5 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none appearance-none"
                          >
                            <option value="Salaried Professional">Salaried Professional</option>
                            <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                            <option value="Self-Employed Specialist">Self-Employed Specialist</option>
                            <option value="Student / Researcher">Student Research Guild</option>
                            <option value="Retired Officer">Retired Officer</option>
                            <option value="Civil Services Officer">Civil Services Officer</option>
                            <option value="Homemaker">Homemaker / Home Director</option>
                            <option value="Other Custom Service">Other Custom Services</option>
                          </select>
                        </div>
                      </div>

                      {/* Residential Address Details */}
                      <div className="col-span-1 md:col-span-3 space-y-1.5">
                        <label className="text-slate-600 text-[10px] font-bold uppercase tracking-wider block pl-1">Full Residential Address Reference</label>
                        <div className="relative bg-white rounded-xl flex items-start border border-slate-200 focus-within:ring-2 focus-within:ring-[#0E1F35]/15 transition-all p-2">
                          <MapPin className="w-4 h-4 text-slate-400 mr-2 mt-1.5" />
                          <textarea 
                            required
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Provide your door number, block, society name, road/locality, and pin code reference..."
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold text-xs sm:text-sm focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Presentation Compartment- Selecting customized animated gif or live snapshot */}
                  <div className="bg-white/90 rounded-2.5xl p-5 border border-slate-200/60 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-[#0E1F35] tracking-widest flex items-center gap-1.5">
                          <Smile className="w-4 h-4 text-[#064E6B]" /> Identity Portrait Presentation
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Choose your favourite animated mascot gif or capture a custom face picture with your webcam</p>
                      </div>
                      {/* Badge indicator */}
                      <span className="text-[9px] px-2.5 py-1 bg-cyan-50 text-cyan-800 font-black tracking-wide rounded-full border border-cyan-100 self-start">
                        {profilePic ? 'Custom Photo Active' : '3D Cartoon Mascot Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* LEFT: 15 PREMIUM 3D CARTOON AVATARS */}
                      <div className="lg:col-span-7 space-y-3">
                        <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">
                          A. Choose Your 3D Clay Mascot Avatar (15 Premium Options)
                        </label>
                        
                        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5">
                          {[
                            { id: '1', title: 'Orange Tee Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver', bg: 'bg-orange-100/80 border-orange-300/40', reqLevel: 1, reqXP: 0 },
                            { id: '2', title: 'Blue Shirt Girl', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka', bg: 'bg-blue-100/80 border-blue-300/40', reqLevel: 1, reqXP: 0 },
                            { id: '3', title: 'Yellow Plaid Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack', bg: 'bg-amber-100/80 border-amber-300/40', reqLevel: 1, reqXP: 0 },
                            { id: '4', title: 'Striped Glasses Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna', bg: 'bg-purple-100/80 border-purple-300/40', reqLevel: 1, reqXP: 0 },
                            { id: '5', title: 'Curly Afro Hoodie Girl', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe', bg: 'bg-rose-100/80 border-rose-300/40', reqLevel: 1, reqXP: 0 },
                            { id: '6', title: 'Bald Beard Olive Polo Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo', bg: 'bg-emerald-100/80 border-emerald-300/40', reqLevel: 2, reqXP: 500 },
                            { id: '7', title: 'Red Long Hair Girl', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lilly', bg: 'bg-orange-50 border-orange-200/40', reqLevel: 2, reqXP: 750 },
                            { id: '8', title: 'Dark Curly Hair Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo', bg: 'bg-amber-50 border-amber-200/40', reqLevel: 2, reqXP: 1000 },
                            { id: '9', title: 'Black Hair Glasses Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', bg: 'bg-sky-100/80 border-sky-300/40', reqLevel: 3, reqXP: 1500 },
                            { id: '10', title: 'Blue Tee Brown Hair Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max', bg: 'bg-cyan-100/80 border-cyan-300/40', reqLevel: 3, reqXP: 2000 },
                            { id: '11', title: 'Slick Back Hair Denim Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie', bg: 'bg-teal-50 border-teal-200/40', reqLevel: 3, reqXP: 2500 },
                            { id: '12', title: 'Curly Ponytail Red Top Female', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella', bg: 'bg-pink-100/80 border-pink-300/40', reqLevel: 4, reqXP: 3000 },
                            { id: '13', title: 'Purple Hoodie Star Girl', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy', bg: 'bg-violet-100/80 border-violet-300/40', reqLevel: 4, reqXP: 3500 },
                            { id: '14', title: 'Pink Jacket Creative Guy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Toby', bg: 'bg-fuchsia-100/80 border-fuchsia-300/40', reqLevel: 4, reqXP: 4000 },
                            { id: '15', title: 'Yellow Beanie Developer', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam', bg: 'bg-yellow-105/80 border-yellow-300/40', reqLevel: 5, reqXP: 5000 }
                          ].map((av) => {
                            const isUnlocked = gamState.xp >= av.reqXP;
                            const isChosen = selectedAvatar === av.url && !profilePic && isUnlocked;
                            return (
                              <div 
                                key={av.id}
                                onClick={() => {
                                  if (!isUnlocked) {
                                    setLockedAvatarInfo(av);
                                    triggerFeedback(`🔒 "${av.title}" is locked until Level ${av.reqLevel} (${av.reqXP} XP)! Complete actions in Nagpur's premium panel to unlock.`, 'error');
                                    return;
                                  }
                                  setSelectedAvatar(av.url);
                                  setProfilePic(''); // Select avatar resets custom profile photo
                                  setLockedAvatarInfo(null);
                                  triggerFeedback(`3D Hero Avatar: "${av.title}" selected!`, 'info');
                                }}
                                className={`group relative aspect-square rounded-full overflow-hidden cursor-pointer border-2 transition-all p-0 flex items-center justify-center ${
                                  !isUnlocked 
                                    ? 'bg-slate-100 border-slate-300/40 opacity-70 grayscale hover:opacity-90 hover:grayscale-0' 
                                    : av.bg
                                } ${
                                  isChosen 
                                    ? 'border-[#004C5C] scale-110 shadow-[0_4px_12px_rgba(0,76,92,0.3)] ring-2 ring-[#004C5C]/20 z-10' 
                                    : 'border-slate-200 hover:border-slate-300 hover:scale-105'
                                }`}
                                title={av.title}
                              >
                                <img 
                                  src={av.url} 
                                  alt={av.title}
                                  className={`w-full h-full object-contain rounded-full select-none ${!isUnlocked ? 'filter blur-[1px]' : ''}`}
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                                {!isUnlocked && (
                                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-all group-hover:bg-slate-950/20">
                                    <div className="bg-slate-950/80 text-white p-1 sm:p-1.5 rounded-full shadow-md">
                                      <Lock className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />
                                    </div>
                                  </div>
                                )}
                                {isChosen && isUnlocked && (
                                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center font-bold">
                                    <div className="bg-[#004C5C] text-white p-1 rounded-full shadow-md animate-scaleIn">
                                      <Check className="w-3.5 h-3.5 stroke-[4.5]" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Interactive Lock Details Context Panel with Instant Tasks Progress */}
                        {lockedAvatarInfo && (
                          <div className="p-3.5 bg-gradient-to-r from-amber-50/70 to-orange-50/70 border border-amber-200 rounded-xl space-y-2 animate-fadeIn mt-2">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-2">
                                <span className="text-lg">🔒</span>
                                <div>
                                  <h5 className="text-[11px] font-black uppercase text-amber-950 tracking-wider">Mascot Locked: {lockedAvatarInfo.title}</h5>
                                  <p className="text-[10px] text-amber-900 font-bold">Unlocks at Level {lockedAvatarInfo.reqLevel} (requires {lockedAvatarInfo.reqXP} XP progress milestone).</p>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setLockedAvatarInfo(null)}
                                className="text-amber-700 hover:text-amber-950 font-black text-xs px-1.5 py-0.5 rounded hover:bg-amber-100"
                              >
                                ✕
                              </button>
                            </div>
                            
                            <div className="space-y-1 pl-7 pt-1">
                              <div className="flex justify-between items-center text-[9px] mb-1">
                                <span className="text-amber-900 font-bold">Your Current Profile Progress:</span>
                                <span className="font-extrabold text-amber-800">{gamState.xp} / {lockedAvatarInfo.reqXP} XP</span>
                              </div>
                              <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-orange-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, (gamState.xp / lockedAvatarInfo.reqXP) * 100)}%` }}
                                />
                              </div>
                            </div>

                            <p className="text-[9px] text-amber-900/85 pl-7 italic font-semibold">
                              💡 tip: Earn XP instantly! Complete tasks like chatting with NestBot AI, using our mortgage tool, or exploring property listings in the main interface. Here are quick actions you can trigger to obtain progress points immediately:
                            </p>

                            <div className="grid grid-cols-3 gap-1.5 pl-7">
                              <button
                                type="button"
                                onClick={() => {
                                  dispatchXPAward('chat_with_ai');
                                  triggerFeedback('NestBot interaction simulation performed! You earned +10 XP!', 'success');
                                }}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md border border-amber-300 font-black text-[8px] uppercase tracking-wider text-center transition-all truncate"
                              >
                                AI Chat (+10 XP)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  dispatchXPAward('use_calculator');
                                  triggerFeedback('Home mortgage calculator simulation performed! You earned +15 XP!', 'success');
                                }}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md border border-amber-300 font-black text-[8px] uppercase tracking-wider text-center transition-all truncate"
                              >
                                Calculator (+15 XP)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  dispatchXPAward('view_property');
                                  triggerFeedback('Instant Nagpur Property Discovery simulation performed! You earned +5 XP!', 'success');
                                }}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md border border-amber-300 font-black text-[8px] uppercase tracking-wider text-center transition-all truncate"
                              >
                                View Listing (+5 XP)
                              </button>
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 font-bold pl-0.5">Clicking any portrait assigns it immediately to your ID layout and matches your dynamic profile widget style.</p>
                      </div>

                      {/* RIGHT: PHOTO SNAPSHOT CAPTURE OR DEVICE UPLOAD */}
                      <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-5 flex flex-col justify-between">
                        <div>
                          <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">
                            B. Set Custom Profile Picture (Webcam / File)
                          </label>
                          <p className="text-[10.5px] font-semibold text-slate-400 mt-1 leading-snug">
                            Provide your custom photo to accredit your passport.
                          </p>
                        </div>

                        {/* Stream Frame Block / Upload Preview */}
                        <div className="mt-2.5">
                          {cameraActive ? (
                            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-indigo-500 text-center p-2">
                              <video 
                                ref={videoRef}
                                className="w-full h-32 object-cover rounded-xl bg-black"
                                playsInline
                                muted
                              />
                              <div className="flex gap-2 mt-2 w-full">
                                <button
                                  type="button"
                                  onClick={capturePhoto}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                                >
                                  <Camera className="w-3.5 h-3.5" /> Shoot Snapshot
                                </button>
                                <button
                                  type="button"
                                  onClick={stopCamera}
                                  className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg transition-all"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-150 relative">
                              {/* Preview Frame */}
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative flex items-center justify-center flex-shrink-0 animate-fadeIn">
                                {profilePic ? (
                                  <img 
                                    src={profilePic} 
                                    alt="Uploaded profile photo"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-center p-1 text-slate-400 flex flex-col items-center">
                                    <Smile className="w-5 h-5 mb-0.5 opacity-60" />
                                    <span className="text-[8px] uppercase font-bold tracking-tight">Preview</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-grow space-y-1.5">
                                <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wide block">Device Integrations:</span>
                                
                                <div className="flex flex-wrap gap-2">
                                  {/* Custom Webcam button */}
                                  <button
                                    type="button"
                                    onClick={startCamera}
                                    className="bg-[#0E1F35] hover:bg-[#064E6B] text-white text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                  >
                                    <Camera className="w-3 h-3" /> Live Camera
                                  </button>

                                  {/* Custom File Upload block */}
                                  <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all">
                                    <Upload className="w-3 h-3" /> Upload file
                                    <input 
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                    />
                                  </label>

                                  {/* Clear Trigger */}
                                  {profilePic && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProfilePic('');
                                        triggerFeedback('Cleared custom picture. Restoring Mascot avatar preset.', 'info');
                                      }}
                                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg text-[9.5px] font-black uppercase transition-all"
                                      title="Reset photo"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>

                </div>

                {/* AREA B: ROLE SPECIFIC DATA */}
                {!selectedPersonas.includes('guest') ? (
                  <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full">
                      2. Role-Specific Details Required
                    </span>
                    <hr className="grow border-slate-200" />
                  </div>

                  <div className="space-y-4">
                    {/* Buyer Role Data Card */}
                    {selectedPersonas.includes('buyer') && (
                      <div className="border border-[#064E6B]/20 bg-[#064E6B]/5 rounded-3xl p-5 relative overflow-hidden transition-all">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-[#064E6B]/5 rounded-full pointer-events-none -mr-4 -mt-4 flex items-center justify-center text-[#064E6B]/15">
                          <User className="w-12 h-12" />
                        </div>
                        <div className="flex items-center gap-2 mb-3.5">
                          <span className="w-6 h-6 rounded-lg bg-[#064E6B] text-white text-xs font-black flex items-center justify-center">🏠</span>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wide text-[#0E1F35]">Individual Buyer / Renting Profile Details</h4>
                            <p className="text-[10px] text-slate-500 font-bold">Specify your goals to receive automated property matches and Digital ID credentials</p>
                          </div>
                        </div>

                        {/* Role Visual Banner */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-[#064E6B]/10 relative group shadow-sm bg-white">
                          <img 
                            src={buyerImg} 
                            alt="Individual Buyer / Tenant" 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                            <span className="bg-[#064E6B] text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">ACTIVE FORM: BUYER / TENANT</span>
                          </div>
                        </div>

                        {/* Interactive toggle between Purchasing and Renting */}
                        <div className="flex bg-[#0E1F35]/10 p-1 rounded-xl mb-4 max-w-sm border border-[#0E1F35]/15 select-none">
                          <button
                            type="button"
                            onClick={() => setBuyerSubMode('buy')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[10.5px] font-black uppercase tracking-wider cursor-pointer transition-all ${buyerSubMode === 'buy' ? 'bg-[#0E1F35] text-white shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            <span>🏠</span> I Want To Buy
                          </button>
                          <button
                            type="button"
                            onClick={() => setBuyerSubMode('rent')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[10.5px] font-black uppercase tracking-wider cursor-pointer transition-all ${buyerSubMode === 'rent' ? 'bg-[#0E1F35] text-white shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            <span>🔑</span> I Want To Rent
                          </button>
                        </div>

                        {buyerSubMode === 'buy' ? (
                          <div className="space-y-5">
                            {/* 1. Budget and Funding */}
                            <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3">
                              <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide border-b border-slate-100 pb-1.5">1. Budget & Acquisition Plan</h5>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {/* Overall Budget Range: Min to Max */}
                              <div className="space-y-1.5">
                                <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Minimum Price</label>
                                <select 
                                  value={buyerMinPrice}
                                  onChange={(e) => setBuyerMinPrice(e.target.value)}
                                  className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                >
                                  <option value="₹10 Lakhs">₹10 Lakhs</option>
                                  <option value="₹20 Lakhs">₹20 Lakhs</option>
                                  <option value="₹30 Lakhs">₹30 Lakhs</option>
                                  <option value="₹40 Lakhs">₹40 Lakhs</option>
                                  <option value="₹50 Lakhs">₹50 Lakhs</option>
                                  <option value="₹75 Lakhs">₹75 Lakhs</option>
                                  <option value="₹1 Crore">₹1 Crore</option>
                                  <option value="₹1.5 Crores">₹1.5 Crores</option>
                                  <option value="₹2 Crores">₹2 Crores</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Maximum Price</label>
                                <select 
                                  value={buyerMaxPrice}
                                  onChange={(e) => setBuyerMaxPrice(e.target.value)}
                                  className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                >
                                  <option value="₹30 Lakhs">₹30 Lakhs</option>
                                  <option value="₹50 Lakhs">₹50 Lakhs</option>
                                  <option value="₹80 Lakhs">₹80 Lakhs</option>
                                  <option value="₹1 Crore">₹1 Crore</option>
                                  <option value="₹1.2 Crores">₹1.2 Crores</option>
                                  <option value="₹1.5 Crores">₹1.5 Crores</option>
                                  <option value="₹2 Crores">₹2 Crores</option>
                                  <option value="₹3 Crores">₹3 Crores</option>
                                  <option value="₹5 Crores">₹5 Crores</option>
                                  <option value="₹10 Crores">₹10 Crores</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                              {/* Funding Source Selector */}
                              <div className="space-y-1.5">
                                <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1 font-bold">Funding Source</label>
                                <select 
                                  value={buyerFundingSource}
                                  onChange={(e) => setBuyerFundingSource(e.target.value)}
                                  className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                >
                                  <option value="Cash">All Cash Outlay</option>
                                  <option value="Bank Loan/Mortgage">Bank Loan / Mortgage</option>
                                  <option value="Pre-approved Loan status">Pre-approved Loan status</option>
                                </select>
                              </div>

                              {/* Timeline to Buy */}
                              <div className="space-y-1.5">
                                <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1 font-bold">Timeline to Buy</label>
                                <select 
                                  value={buyerTimeline}
                                  onChange={(e) => setBuyerTimeline(e.target.value)}
                                  className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                >
                                  <option value="Immediate (under 30 days)">Immediate (under 30 days)</option>
                                  <option value="Mid-term (1-3 months)">Mid-term (1-3 months)</option>
                                  <option value="Exploring (3+ months)">Exploring (3+ months)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* 2. Property Specific Selection Tabs */}
                          <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                              <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide">2. Property Type Specs</h5>
                              
                              {/* Segmented control for Property Type */}
                              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                {([
                                  { id: 'land', label: 'Plot / Land' },
                                  { id: 'house', label: 'House / Villa' },
                                  { id: 'flat', label: 'Flat / Apt' }
                                ] as const).map((tab) => (
                                  <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setBuyerPropertyType(tab.id)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                                      buyerPropertyType === tab.id 
                                        ? 'bg-[#064E6B] text-white shadow-xs' 
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* CONDITIONAL SUBFORM CHANNELS */}
                            {buyerPropertyType === 'land' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Land Plot Area */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Plot Area (Sq. Yards/Feet/Acres)</label>
                                    <input 
                                      type="text" 
                                      value={landPlotArea} 
                                      onChange={(e) => setLandPlotArea(e.target.value)}
                                      placeholder="e.g. 1500 Sq. Yards"
                                      className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    />
                                  </div>

                                  {/* Zoning Type */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Zoning Type</label>
                                    <select 
                                      value={landZoning} 
                                      onChange={(e) => setLandZoning(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="Residential">Residential zoning</option>
                                      <option value="Commercial">Commercial zoning</option>
                                      <option value="Agricultural">Agricultural zoning</option>
                                    </select>
                                  </div>

                                  {/* Facing road width */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Road Width Facing Plot</label>
                                    <input 
                                      type="text" 
                                      value={landRoadWidth} 
                                      onChange={(e) => setLandRoadWidth(e.target.value)}
                                      placeholder="e.g. 30 Feet or 40 Feet"
                                      className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    />
                                  </div>

                                  {/* Boundary wall present? */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Boundary Wall Present?</label>
                                    <select 
                                      value={landBoundaryWall} 
                                      onChange={(e) => setLandBoundaryWall(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="Yes">Yes (Fully Secure)</option>
                                      <option value="No">No Boundary</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Checklist: Clear Title, NA status, RERA approved */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[9.5px] font-black uppercase tracking-wider block pl-0.5">Legal / Status Requirements</label>
                                  <div className="flex flex-wrap gap-2.5">
                                    {['Clear Title', 'NA (Non-Agricultural) status', 'RERA approved'].map((status) => {
                                      const isChecked = landLegalStatus.includes(status);
                                      return (
                                        <button
                                          key={status}
                                          type="button"
                                          onClick={() => {
                                            if (isChecked) {
                                              setLandLegalStatus(landLegalStatus.filter(s => s !== status));
                                            } else {
                                              setLandLegalStatus([...landLegalStatus, status]);
                                            }
                                          }}
                                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                            isChecked 
                                              ? 'bg-slate-900 border-slate-900 text-white' 
                                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                          }`}
                                        >
                                          {isChecked ? '✓' : '+'} {status}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {buyerPropertyType === 'house' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Built-up Area & Plot Area */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Built-up Area & Plot Area</label>
                                    <input 
                                      type="text" 
                                      value={houseArea} 
                                      onChange={(e) => setHouseArea(e.target.value)}
                                      placeholder="e.g. 1800 BUA / 1500 Plot"
                                      className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    />
                                  </div>

                                  {/* BHK Layout */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">BHK Configuration Target</label>
                                    <select 
                                      value={houseBhk} 
                                      onChange={(e) => setHouseBhk(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="2 BHK">2 BHK Configuration</option>
                                      <option value="3 BHK">3 BHK Configuration</option>
                                      <option value="4 BHK">4 BHK Configuration</option>
                                      <option value="5 BHK+">5 BHK+ Ultimate Premium</option>
                                    </select>
                                  </div>

                                  {/* Number of floors */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Number of Floors</label>
                                    <input 
                                      type="text" 
                                      value={houseFloors} 
                                      onChange={(e) => setHouseFloors(e.target.value)}
                                      placeholder="e.g. Ground + 1, Ground + 2"
                                      className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    />
                                  </div>

                                  {/* Construction status */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Construction Status</label>
                                    <select 
                                      value={houseConstructionStatus} 
                                      onChange={(e) => setHouseConstructionStatus(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="Ready to Move">Ready to Move</option>
                                      <option value="Under Construction">Under Construction</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Booleans: Independent parking, private garden, expansion potential */}
                                <div className="space-y-2 bg-[#064E6B]/5 p-3 rounded-xl border border-[#064E6B]/10">
                                  <span className="text-[9px] font-black text-[#0E1F35] uppercase tracking-wide block">Key Villa Preferences</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Parking Space</span>
                                      <select value={houseParking} onChange={(e) => setHouseParking(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">Independent</option>
                                        <option value="No">No Preference</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Private Garden</span>
                                      <select value={houseGarden} onChange={(e) => setHouseGarden(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">Required</option>
                                        <option value="No">Optional</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Expansion Potential</span>
                                      <select value={houseExpansion} onChange={(e) => setHouseExpansion(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">Yes (Add floors)</option>
                                        <option value="No">No requirement</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {buyerPropertyType === 'flat' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Area */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Super Built-up / Carpet Area</label>
                                    <input 
                                      type="text" 
                                      value={flatArea} 
                                      onChange={(e) => setFlatArea(e.target.value)}
                                      placeholder="e.g. 1400 Sq. Feet (Super)"
                                      className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    />
                                  </div>

                                  {/* BHK */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">BHK Configuration</label>
                                    <select 
                                      value={flatBhk} 
                                      onChange={(e) => setFlatBhk(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="1 BHK">1 BHK Layout</option>
                                      <option value="2 BHK">2 BHK Layout</option>
                                      <option value="3 BHK">3 BHK Layout</option>
                                      <option value="4 BHK">4 BHK Penthouse/Premium</option>
                                    </select>
                                  </div>

                                  {/* Floor level */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Preferred Floor Level</label>
                                    <select 
                                      value={flatFloorLevel} 
                                      onChange={(e) => setFlatFloorLevel(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="Lower floor">Lower floor (Ground/1st/2nd)</option>
                                      <option value="Higher floor">Higher floor (Scenic views)</option>
                                      <option value="Penthouse">Highest Floor / Penthouse</option>
                                      <option value="No Preference">No Floor Preference</option>
                                    </select>
                                  </div>

                                  {/* Construction status */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Construction Status</label>
                                    <select 
                                      value={flatConstructionStatus} 
                                      onChange={(e) => setFlatConstructionStatus(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="Ready to Move">Ready with O.C. (Ready to Move)</option>
                                      <option value="Under Construction">Under Construction</option>
                                    </select>
                                  </div>

                                  {/* Age of property */}
                                  <div className="space-y-1">
                                    <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Age of Property</label>
                                    <select 
                                      value={flatAge} 
                                      onChange={(e) => setFlatAge(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                    >
                                      <option value="New">Brand New / Launch</option>
                                      <option value="Resale">Resale Property</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Booleans: Gated, multi-tier security, power backup */}
                                <div className="space-y-2 bg-[#064E6B]/5 p-3 rounded-xl border border-[#064E6B]/10">
                                  <span className="text-[9px] font-black text-[#0E1F35] uppercase tracking-wide block">Essentials Check</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Gated Community</span>
                                      <select value={flatGated} onChange={(e) => setFlatGated(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">Mandatory</option>
                                        <option value="No">No preference</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Multi Security</span>
                                      <select value={flatSecurity} onChange={(e) => setFlatSecurity(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">Yes (Intercom)</option>
                                        <option value="No">Basic security</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] text-slate-500 font-bold block text-center">Power Backup</span>
                                      <select value={flatPowerBackup} onChange={(e) => setFlatPowerBackup(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#064E6B]">
                                        <option value="Yes">100% Backup</option>
                                        <option value="No">No backup needed</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 3. Location, Lifestyle Tags & Dream Property NLP */}
                          <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3">
                            <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide border-b border-slate-100 pb-1.5">3. Location & Lifestyle Preferences</h5>
                            
                            {/* Location Intent */}
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Location Intent / Target Radius</label>
                              <input 
                                type="text"
                                value={buyerLocationIntent}
                                onChange={(e) => setBuyerLocationIntent(e.target.value)}
                                placeholder="e.g. Within 5 km of my current location, Wardha Road, Civil Lines"
                                className="w-full bg-white text-slate-800 font-semibold px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                              />
                            </div>

                            {/* Lifestyle Tag Selection Chips */}
                            <div className="space-y-1.5 pt-1">
                              <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Lifestyle Preference Tags</label>
                              <div className="flex flex-wrap gap-1.5">
                                {['Close to Metro', 'Pet Friendly', 'High ROI Area', 'Gated Community', 'Quiet Neighborhood'].map((tag) => {
                                  const isSelected = buyerLifestyleTags.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => {
                                        if (isSelected) {
                                          setBuyerLifestyleTags(buyerLifestyleTags.filter(t => t !== tag));
                                        } else {
                                          setBuyerLifestyleTags([...buyerLifestyleTags, tag]);
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-[10.5px] font-black cursor-pointer uppercase tracking-tight transition-all border ${
                                        isSelected 
                                          ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {tag}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Raw Intent NLP Box */}
                            <div className="space-y-1.5 pt-1">
                              <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Describe your dream property in your own words</label>
                              <textarea 
                                value={buyerRawIntent}
                                onChange={(e) => setBuyerRawIntent(e.target.value)}
                                rows={2}
                                placeholder="e.g. A gorgeous garden-facing 3 BHK duplex flat with high ceilings, plenty of morning sunlight, near a local school or park..."
                                className="w-full bg-white text-slate-800 font-medium p-3 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none placeholder-slate-400"
                              />
                            </div>
                          </div>
                        </div>
                        ) : (
                          // RENTING SPECIFIC DETAILS BLOCK
                          <div className="space-y-5 animate-fadeIn">
                            {/* 1. Rental Budget and Duration */}
                            <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3">
                              <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide border-b border-slate-100 pb-1.5">1. Budget & Lease Terms</h5>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Monthly Rent range */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Monthly Rent Budget (Min - Max)</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <select
                                      value={rentMinPrice}
                                      onChange={(e) => setRentMinPrice(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                    >
                                      <option value="₹5,000">₹5,000/mo</option>
                                      <option value="₹10,000">₹10,000/mo</option>
                                      <option value="₹15,000">₹15,000/mo</option>
                                      <option value="₹25,000">₹25,000/mo</option>
                                      <option value="₹40,000">₹40,000/mo</option>
                                      <option value="₹60,000">₹60,000/mo</option>
                                      <option value="₹1,00,000+">₹1,00,000+/mo</option>
                                    </select>
                                    <select
                                      value={rentMaxPrice}
                                      onChange={(e) => setRentMaxPrice(e.target.value)}
                                      className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                    >
                                      <option value="₹15,000">₹15,000/mo</option>
                                      <option value="₹25,000">₹25,000/mo</option>
                                      <option value="₹40,000">₹40,000/mo</option>
                                      <option value="₹60,000">₹60,000/mo</option>
                                      <option value="₹80,000">₹80,000/mo</option>
                                      <option value="₹1,00,000">₹1,00,000/mo</option>
                                      <option value="₹2,00,000">₹2,00,000/mo</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Security Deposit Cap */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Max Upfront Deposit Cap</label>
                                  <select
                                    value={rentSecurityDepositCap}
                                    onChange={(e) => setRentSecurityDepositCap(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="₹25,000">₹25,000</option>
                                    <option value="₹50,000">₹50,000</option>
                                    <option value="₹1 Lakh">₹1 Lakh</option>
                                    <option value="₹2 Lakhs">₹2 Lakhs</option>
                                    <option value="₹5 Lakhs">₹5 Lakhs</option>
                                    <option value="No Cap">No Upfront Cap</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                {/* Lease Duration */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1 font-bold">Preferred Lease Period</label>
                                  <select
                                    value={rentLeaseDuration}
                                    onChange={(e) => setRentLeaseDuration(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="6 Months">6 Months</option>
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Years">2 Years</option>
                                    <option value="3+ Years">3+ Years</option>
                                  </select>
                                </div>

                                {/* Move-In Date */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1 font-bold">Planned Move-In Date</label>
                                  <select
                                    value={rentMoveInDate}
                                    onChange={(e) => setRentMoveInDate(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 15 Days">Within 15 Days</option>
                                    <option value="1 Month+">1 Month+</option>
                                    <option value="Flexible">Flexible</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* 2. Rental Custom Property specs */}
                            <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                                <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide">2. Space & Dwelling Configuration</h5>
                                
                                {/* Rent property type toggle */}
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                  {([
                                    { id: 'flat', label: 'Flat / Apt' },
                                    { id: 'house', label: 'House / Villa' },
                                    { id: 'land', label: 'Plot / Land Lease' }
                                  ] as const).map((tab) => (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => setRentPropertyType(tab.id)}
                                      className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                                        rentPropertyType === tab.id 
                                          ? 'bg-[#064E6B] text-white shadow-xs' 
                                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* CONDITIONAL SPEC CHANNELS */}
                              {rentPropertyType === 'flat' && (
                                <div className="space-y-3.5 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">BHK Configuration</label>
                                      <select
                                        value={rentFlatBhk}
                                        onChange={(e) => setRentFlatBhk(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="1 BHK">1 BHK</option>
                                        <option value="2 BHK">2 BHK</option>
                                        <option value="3 BHK">3 BHK</option>
                                        <option value="4+ BHK">4+ BHK</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Floor Level Preference</label>
                                      <select
                                        value={rentFlatFloorLevel}
                                        onChange={(e) => setRentFlatFloorLevel(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="Ground floor">Ground Floor Only</option>
                                        <option value="Lower floor">Lower Floor (1-4)</option>
                                        <option value="Higher floor">Higher Floor (5+)</option>
                                        <option value="Penthouse">Penthouse</option>
                                        <option value="Any floor">No Floor Preference</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Furnishing Status</label>
                                      <select
                                        value={rentFlatFurnishing}
                                        onChange={(e) => setRentFlatFurnishing(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="Fully Furnished">Fully Furnished</option>
                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                        <option value="Unfurnished">Unfurnished</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Flat Amenities */}
                                  <div className="space-y-1.5">
                                    <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Amenities</label>
                                    <div className="flex flex-wrap gap-1.5">
                                      {['Lift', 'Gated security', 'Power backup', 'Gym', 'Pool'].map((amenity) => {
                                        const isSelected = rentFlatAmenities.includes(amenity);
                                        return (
                                          <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => {
                                              if (isSelected) {
                                                setRentFlatAmenities(rentFlatAmenities.filter(a => a !== amenity));
                                              } else {
                                                setRentFlatAmenities([...rentFlatAmenities, amenity]);
                                              }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black cursor-pointer uppercase transition-all border ${
                                              isSelected 
                                                ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {amenity}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                                    <span className="text-slate-400">⚠️</span>
                                    <span>Commercial Use: N/A (Strictly residential rules apply)</span>
                                  </div>
                                </div>
                              )}

                              {rentPropertyType === 'house' && (
                                <div className="space-y-3.5 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Number of Floors</label>
                                      <select
                                        value={rentHouseFloors}
                                        onChange={(e) => setRentHouseFloors(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="1 Floor">Single Floor (Independent)</option>
                                        <option value="2 Floors">Duplex (2 Floors)</option>
                                        <option value="3+ Floors">Triplex+ (3+ Floors)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Private compound/garden</label>
                                      <select
                                        value={rentHouseGarden}
                                        onChange={(e) => setRentHouseGarden(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="Yes">Yes (Private lawn/garden)</option>
                                        <option value="No">No preference/Not required</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Furnishing Status</label>
                                      <select
                                        value={rentHouseFurnishing}
                                        onChange={(e) => setRentHouseFurnishing(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="Fully Furnished">Fully Furnished</option>
                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                        <option value="Unfurnished">Unfurnished</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* House Amenities */}
                                  <div className="space-y-1.5">
                                    <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Amenities</label>
                                    <div className="flex flex-wrap gap-1.5">
                                      {['Private parking', 'Water storage tank', 'Pet space'].map((amenity) => {
                                        const isSelected = rentHouseAmenities.includes(amenity);
                                        return (
                                          <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => {
                                              if (isSelected) {
                                                setRentHouseAmenities(rentHouseAmenities.filter(a => a !== amenity));
                                              } else {
                                                setRentHouseAmenities([...rentHouseAmenities, amenity]);
                                              }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black cursor-pointer uppercase transition-all border ${
                                              isSelected 
                                                ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {amenity}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                                    <span className="text-slate-400">⚠️</span>
                                    <span>Commercial Use: N/A (Strictly residential rules apply)</span>
                                  </div>
                                </div>
                              )}

                              {rentPropertyType === 'land' && (
                                <div className="space-y-3.5 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Plot Area (Sq. Ft / Sq. Yards)</label>
                                      <input 
                                        type="text" 
                                        value={rentLandArea} 
                                        onChange={(e) => setRentLandArea(e.target.value)}
                                        placeholder="e.g. 1200 Sq. Ft"
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-slate-600 text-[10px] font-bold block pl-0.5">Intended Use (Commercial)</label>
                                      <select
                                        value={rentLandCommercialUse}
                                        onChange={(e) => setRentLandCommercialUse(e.target.value)}
                                        className="w-full bg-white text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#064E6B] focus:outline-none"
                                      >
                                        <option value="Commercial storage">Commercial storage</option>
                                        <option value="Parking slot block">Vehicle Parking Plot</option>
                                        <option value="Cloud Kitchen">Cloud Kitchen Hub</option>
                                        <option value="Agri Farming">Eco Farming / Agriculture</option>
                                        <option value="Industrial warehouse">Industrial Workshop</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Land Amenities */}
                                  <div className="space-y-1.5">
                                    <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Lease Infrastructure / Amenities</label>
                                    <div className="flex flex-wrap gap-1.5">
                                      {['Fencing/Boundary wall', 'Road approach width'].map((amenity) => {
                                        const isSelected = rentLandAmenities.includes(amenity);
                                        return (
                                          <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => {
                                              if (isSelected) {
                                                setRentLandAmenities(rentLandAmenities.filter(a => a !== amenity));
                                              } else {
                                                setRentLandAmenities([...rentLandAmenities, amenity]);
                                              }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black cursor-pointer uppercase transition-all border ${
                                              isSelected 
                                                ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {amenity}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                                    <span className="text-yellow-600 font-bold">🌾</span>
                                    <span>Furnishing Status: N/A (Typically vacant or paved land plot)</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 3. Renting Constraints & Cohesiveness */}
                            <div className="bg-white/60 p-4 rounded-2xl border border-[#064E6B]/10 space-y-3.5">
                              <h5 className="text-[11px] font-black text-[#0E1F35] uppercase tracking-wide border-b border-slate-100 pb-1.5">3. Domestic & Dietary Constraints</h5>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Pet Ownership toggle */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Pet Ownership Status</label>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setRentPetOwnership('Yes')}
                                      className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center ${
                                        rentPetOwnership === 'Yes' 
                                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs' 
                                          : 'bg-white border-slate-200 text-slate-600'
                                      }`}
                                    >
                                      🐶 Yes, Has Pets
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRentPetOwnership('No');
                                        setRentPetType('');
                                      }}
                                      className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center ${
                                        rentPetOwnership === 'No' 
                                          ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-xs' 
                                          : 'bg-white border-slate-200 text-slate-600'
                                      }`}
                                    >
                                      ❌ No Pets
                                    </button>
                                  </div>

                                  {rentPetOwnership === 'Yes' && (
                                    <input
                                      type="text"
                                      value={rentPetType}
                                      onChange={(e) => setRentPetType(e.target.value)}
                                      placeholder="Specify pet details (e.g. Cat, small size)"
                                      className="w-full bg-white text-slate-800 font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] focus:ring-1 focus:ring-[#064E6B] focus:outline-none placeholder-slate-400 mt-1 animate-fadeIn"
                                    />
                                  )}
                                </div>

                                {/* Dietary/Lifestyle Constraints */}
                                <div className="space-y-1.5">
                                  <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Dietary / Tenant Constraints</label>
                                  <select
                                    value={rentDietaryConstraint}
                                    onChange={(e) => setRentDietaryConstraint(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="Family preferred">Family Preferred</option>
                                    <option value="Bachelors allowed">Bachelors Allowed</option>
                                    <option value="Vegetarian-only">Vegetarian-Only Tenant</option>
                                    <option value="No restrictions">No Lifestyle Preference</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1.5">
                                {/* Parking slots: 2 wheelers */}
                                <div className="space-y-1">
                                  <label className="text-slate-600 text-[10px] font-semibold block pl-0.5">2-Wheeler Parking</label>
                                  <select
                                    value={rentParkingTwoWheeler}
                                    onChange={(e) => setRentParkingTwoWheeler(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="0">None</option>
                                    <option value="1">1 Slot</option>
                                    <option value="2">2 Slots</option>
                                    <option value="3+">3+ Slots</option>
                                  </select>
                                </div>

                                {/* Parking slots: 4 wheelers */}
                                <div className="space-y-1">
                                  <label className="text-slate-600 text-[10px] font-semibold block pl-0.5">4-Wheeler Parking</label>
                                  <select
                                    value={rentParkingFourWheeler}
                                    onChange={(e) => setRentParkingFourWheeler(e.target.value)}
                                    className="w-full bg-white text-slate-800 font-bold px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#064E6B]"
                                  >
                                    <option value="0">None</option>
                                    <option value="1">1 Slot</option>
                                    <option value="2">2 Slots</option>
                                    <option value="3+">3+ Slots</option>
                                  </select>
                                </div>

                                {/* Smoking policy */}
                                <div className="space-y-1">
                                  <label className="text-slate-600 text-[10px] font-semibold block pl-0.5">Indoor Smoking Allowed</label>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setRentSmokingPolicy('Yes')}
                                      className={`flex-1 py-1 px-1 rounded-lg text-[9.5px] font-black uppercase tracking-wider border cursor-pointer text-center ${
                                        rentSmokingPolicy === 'Yes' 
                                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs' 
                                          : 'bg-white border-slate-200 text-slate-600'
                                      }`}
                                    >
                                      💨 Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRentSmokingPolicy('No')}
                                      className={`flex-1 py-1 px-1 rounded-lg text-[9.5px] font-black uppercase tracking-wider border cursor-pointer text-center ${
                                        rentSmokingPolicy === 'No' 
                                          ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-xs' 
                                          : 'bg-white border-slate-200 text-slate-600'
                                      }`}
                                    >
                                      🚫 No
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedPersonas.includes('seller') && (
                      <div className="border border-emerald-600/20 bg-emerald-500/5 rounded-3xl p-5 relative overflow-hidden transition-all space-y-4">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-600/5 rounded-full pointer-events-none -mr-4 -mt-4 flex items-center justify-center text-emerald-600/15">
                          <Landmark className="w-12 h-12" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">🔑</span>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wide text-emerald-800">Property Owner / Seller Profile Details</h4>
                            <p className="text-[10px] text-slate-500 font-bold font-semibold">Verify identity, setup rental agreements, and organize property specifications</p>
                          </div>
                        </div>

                        {/* Role Visual Banner */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-emerald-600/10 relative group shadow-sm bg-white">
                          <img 
                            src={sellerImg} 
                            alt="Property Owner / Host" 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                            <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">ACTIVE FORM: PROPERTY OWNER</span>
                          </div>
                        </div>

                        {/* Dropdown Fields & Target Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Listing Target Price Scope</label>
                            <select 
                              value={sellerPrice}
                              onChange={(e) => setSellerPrice(e.target.value)}
                              className="w-full bg-white text-slate-800 font-bold px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            >
                              <option value="Under ₹25L">Under ₹25 Lakhs</option>
                              <option value="₹25L - ₹50L">₹25L - ₹50 Lakhs</option>
                              <option value="₹50L - ₹1.2Cr">₹50L - ₹1.2 Crores (Standard)</option>
                              <option value="₹1.2Cr+">Above ₹1.2 Crores</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Listing Persona Mode</label>
                            <select 
                              value={sellerPersona}
                              onChange={(e) => setSellerPersona(e.target.value as any)}
                              className="w-full bg-white text-slate-800 font-bold px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            >
                              <option value="owner">Direct Owner (Primary Deed Holder)</option>
                              <option value="agent">Authorized Agent (Rera Endorsed)</option>
                              <option value="pmc">Property Management Company (PMC)</option>
                            </select>
                          </div>

                          {/* 1. Owner Identity & Verification (Trust Layer) */}
                          <div className="sm:col-span-2 space-y-1.5 border-t border-emerald-600/10 pt-3">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🛡️</span>
                              <span className="text-slate-700 text-[10.5px] font-black uppercase tracking-wider">Owner Identity & Verification (Trust Layer)</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                              <div className="space-y-1">
                                <label className="text-slate-500 text-[9px] font-black uppercase tracking-wider block pl-0.5">KYC Document Type</label>
                                <select 
                                  value={sellerKycType}
                                  onChange={(e) => setSellerKycType(e.target.value)}
                                  className="w-full bg-slate-50 text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                >
                                  <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                                  <option value="PAN Card">PAN Card (Income Tax)</option>
                                  <option value="Passport">Passport</option>
                                  <option value="Corporate License">Corporate License</option>
                                </select>
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-slate-500 text-[9px] font-black uppercase tracking-wider block pl-0.5">Upload Identity Proof / Corporate registration</label>
                                <div className="relative border border-dashed border-emerald-300 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] transition-all rounded-xl p-2 flex items-center justify-center cursor-pointer min-h-[38px]">
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setSellerKycFileName(file.name);
                                        setSellerKycFile('attached');
                                        triggerFeedback(`Identity doc ${file.name} attached securely!`, 'success');
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">
                                      {sellerKycFileName ? `✓ ${sellerKycFileName}` : "Select / Drag ID Document"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payout Details */}
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-slate-600 text-[10px] font-black uppercase tracking-wider block pl-1">Escrow Payout Routing (Rental Distribution / Booking Fees)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                              <div className="flex flex-col justify-center space-y-1">
                                <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">Routing Path</span>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setSellerPayoutType('upi')}
                                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center transition-all ${
                                      sellerPayoutType === 'upi' 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    UPI ID
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSellerPayoutType('bank')}
                                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center transition-all ${
                                      sellerPayoutType === 'bank' 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Bank Route
                                  </button>
                                </div>
                              </div>

                              {sellerPayoutType === 'upi' ? (
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">UPI Virtual Address (VPA)</label>
                                  <input 
                                    type="text" 
                                    value={sellerPayoutUpi}
                                    onChange={(e) => setSellerPayoutUpi(e.target.value)}
                                    placeholder="e.g. payoutaddress@upi"
                                    className="w-full bg-slate-50 text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">Bank Name & A/c</label>
                                    <input 
                                      type="text" 
                                      value={sellerPayoutBank}
                                      onChange={(e) => setSellerPayoutBank(e.target.value)}
                                      placeholder="e.g. ICICI - A/c 5020104..."
                                      className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">IFSC Routing Code</label>
                                    <input 
                                      type="text" 
                                      value={sellerPayoutIfsc}
                                      onChange={(e) => setSellerPayoutIfsc(e.target.value)}
                                      placeholder="e.g. ICIC0000104"
                                      className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 2. General Rental Terms & Rules */}
                          <div className="sm:col-span-2 border-t border-emerald-600/10 pt-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-[#004C5C] text-xs">📋</span>
                              <h5 className="text-[10px] font-black uppercase text-emerald-950 tracking-wider">General Rental Terms & Policies</h5>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                              <div className="space-y-2">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Preferred Tenant Types</label>
                                <div className="flex flex-wrap gap-1.5">
                                  {['Families Allowed', 'Bachelors Welcome', 'Corporate Leases Only'].map((tenantType) => {
                                    const isSelected = sellerPrefTenants.includes(tenantType);
                                    return (
                                      <button
                                        key={tenantType}
                                        type="button"
                                        onClick={() => {
                                          if (isSelected) {
                                            setSellerPrefTenants(sellerPrefTenants.filter(t => t !== tenantType));
                                          } else {
                                            setSellerPrefTenants([...sellerPrefTenants, tenantType]);
                                          }
                                        }}
                                        className={`py-1 px-2 rounded-lg text-[8.5px] font-bold border transition-all cursor-pointer ${
                                          isSelected 
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-black' 
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {isSelected ? '✓ ' : '＋ '} {tenantType}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Standard Lease Duration</label>
                                <select
                                  value={sellerLeaseDuration}
                                  onChange={(e) => setSellerLeaseDuration(e.target.value)}
                                  className="w-full bg-white text-slate-800 font-bold px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                >
                                  <option value="11 Months">11 Months Lock-In</option>
                                  <option value="1 Year">1 Year Lock-In</option>
                                  <option value="Long-term 2+ Years">Long-term (2+ Years)</option>
                                  <option value="Long-term 3+ Years">Long-term (3+ Years)</option>
                                </select>
                              </div>

                              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-50">
                                {/* Pet Policy */}
                                <div className="space-y-1">
                                  <span className="text-slate-500 text-[8.5px] font-black block pl-0.5 uppercase">Pet Policy Rules</span>
                                  <div className="flex gap-1 bg-slate-150 p-0.5 rounded-lg border border-slate-200">
                                    {['Allowed', 'Not Allowed'].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setSellerPetPolicy(opt as any)}
                                        className={`flex-1 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider cursor-pointer text-center transition-all ${
                                          sellerPetPolicy === opt 
                                            ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                                            : 'text-slate-500 hover:text-slate-800 bg-white'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Smoking Policy */}
                                <div className="space-y-1">
                                  <span className="text-slate-500 text-[8.5px] font-black block pl-0.5 uppercase">Smoking Rules</span>
                                  <div className="flex gap-1 bg-slate-150 p-0.5 rounded-lg border border-slate-200">
                                    {['Allowed', 'Not Allowed'].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setSellerSmokingPolicy(opt as any)}
                                        className={`flex-1 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider cursor-pointer text-center transition-all ${
                                          sellerSmokingPolicy === opt 
                                            ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                                            : 'text-slate-500 hover:text-slate-800 bg-white'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Dietary restraints */}
                                <div className="space-y-1">
                                  <span className="text-slate-500 text-[8.5px] font-black block pl-0.5 uppercase">Dietary Preferences</span>
                                  <div className="flex gap-1 bg-slate-150 p-0.5 rounded-lg border border-slate-200">
                                    {['Veg Only', 'No Restrictions'].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setSellerDietaryPref(opt as any)}
                                        className={`flex-1 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider cursor-pointer text-center transition-all ${
                                          sellerDietaryPref === opt 
                                            ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                                            : 'text-slate-500 hover:text-slate-800 bg-white'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. The Dynamic Asset Listing Matrix */}
                          <div className="sm:col-span-2 border-t border-emerald-600/10 pt-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#0E1F35] text-xs">🏢</span>
                                <h5 className="text-[10px] font-black uppercase text-emerald-950 tracking-wider">Dynamic Asset Listing Matrix</h5>
                              </div>
                              <span className="text-[7.5px] bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded font-black uppercase tracking-widest leading-none">Category Morphing UI</span>
                            </div>

                            <p className="text-[10px] text-slate-500 font-bold leading-normal">
                              Select a property category to dynamically lock-in targeted parameters, and register it to your active assets array.
                            </p>

                            {/* Category Selection Tabs */}
                            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                              {(['flat', 'land', 'house'] as const).map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setActiveSellerPropType(type)}
                                  className={`flex-1 py-1.5 text-center text-[9.5px] font-black uppercase tracking-wider rounded-lg border-none cursor-pointer transition-all ${
                                    activeSellerPropType === type 
                                      ? 'bg-[#0E1F35] text-white shadow-sm font-black' 
                                      : 'text-slate-500 hover:text-slate-800 bg-transparent'
                                  }`}
                                >
                                  {type === 'flat' ? '🏢 Apartment' : type === 'land' ? '🏜️ Plot/Land' : '🏡 House/Villa'}
                                </button>
                              ))}
                            </div>

                            {/* Morphing Fields Interface */}
                            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 space-y-3 shadow-2xs">
                              {activeSellerPropType === 'flat' && (
                                <div className="space-y-3 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Monthly Rent</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatRent} 
                                        onChange={(e) => setSellerFlatRent(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">expected Security Deposit</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatDeposit} 
                                        onChange={(e) => setSellerFlatDeposit(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Maintenance Charges</span>
                                      <div className="flex gap-1">
                                        <input 
                                          type="text" 
                                          value={sellerFlatMaintenance} 
                                          onChange={(e) => setSellerFlatMaintenance(e.target.value)}
                                          className="w-2/3 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-850"
                                        />
                                        <select
                                          value={sellerFlatMaintenanceType}
                                          onChange={(e) => setSellerFlatMaintenanceType(e.target.value as any)}
                                          className="w-1/3 bg-slate-100 border-none rounded text-[8.5px] font-black uppercase"
                                        >
                                          <option value="Fixed">Fixed</option>
                                          <option value="Per-Sq-Ft">SFT</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Carpet Area</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatCarpetArea} 
                                        onChange={(e) => setSellerFlatCarpetArea(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Super Built-up</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatSuperArea} 
                                        onChange={(e) => setSellerFlatSuperArea(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Floor Number</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatFloorNum} 
                                        onChange={(e) => setSellerFlatFloorNum(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Total Floors</span>
                                      <input 
                                        type="text" 
                                        value={sellerFlatTotalFloors} 
                                        onChange={(e) => setSellerFlatTotalFloors(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-500 block">Furnishing Status & Checklist</span>
                                      <div className="flex gap-1.5 mb-2 bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                                        {['Fully', 'Semi', 'Unfurnished'].map((opt) => (
                                          <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setSellerFlatFurnishing(opt)}
                                            className={`flex-1 py-1 text-[8.5px] font-black border-none rounded transition-all cursor-pointer ${
                                              sellerFlatFurnishing === opt ? 'bg-[#0E1F35] text-white shadow-xs' : 'text-slate-500 bg-white'
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-1">
                                        {['ACs', 'Wardrobes', 'Geysers', 'Modular Kitchen'].map((item) => {
                                          const isChecked = sellerFlatChecklist.includes(item);
                                          return (
                                            <button
                                              type="button"
                                              key={item}
                                              onClick={() => {
                                                if (isChecked) {
                                                  setSellerFlatChecklist(sellerFlatChecklist.filter(i => i !== item));
                                                } else {
                                                  setSellerFlatChecklist([...sellerFlatChecklist, item]);
                                                }
                                              }}
                                              className={`py-0.5 px-1.5 rounded text-[8px] border transition-all cursor-pointer ${
                                                isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                                              }`}
                                            >
                                              {isChecked ? '✓ ' : '＋ '} {item}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Utilities & Infrastructure</span>
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Water</span>
                                          <input 
                                            type="text" 
                                            value={sellerFlatWaterSource} 
                                            onChange={(e) => setSellerFlatWaterSource(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700"
                                          />
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Backup</span>
                                          <input 
                                            type="text" 
                                            value={sellerFlatPowerBackup} 
                                            onChange={(e) => setSellerFlatPowerBackup(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700 font-sans"
                                          />
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Lift Access</span>
                                          <input 
                                            type="text" 
                                            value={sellerFlatLiftAccess} 
                                            onChange={(e) => setSellerFlatLiftAccess(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeSellerPropType === 'land' && (
                                <div className="space-y-3 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Monthly Lease Amount</span>
                                      <input 
                                        type="text" 
                                        value={sellerPlotLease} 
                                        onChange={(e) => setSellerPlotLease(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Expected Security Deposit</span>
                                      <input 
                                        type="text" 
                                        value={sellerPlotDeposit} 
                                        onChange={(e) => setSellerPlotDeposit(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Tax Compliance Details</span>
                                      <input 
                                        type="text" 
                                        value={sellerPlotTax} 
                                        onChange={(e) => setSellerPlotTax(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-1 col-span-2">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Plot Area (Sq. Ft / Yards)</span>
                                      <input 
                                        type="text" 
                                        value={sellerPlotArea} 
                                        onChange={(e) => setSellerPlotArea(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black text-slate-400 block uppercase">Boundary Wall</span>
                                      <div className="flex gap-1">
                                        {['Yes', 'No'].map((opt) => (
                                          <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setSellerPlotBoundary(opt)}
                                            className={`flex-1 py-1 text-[9px] font-black rounded cursor-pointer transition-all ${
                                              sellerPlotBoundary === opt ? 'bg-[#0E1F35] text-white' : 'bg-slate-100 text-slate-500'
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black text-slate-400 block uppercase">Gated lock setup</span>
                                      <div className="flex gap-1">
                                        {['Yes', 'No'].map((opt) => (
                                          <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setSellerPlotGate(opt)}
                                            className={`flex-1 py-1 text-[9px] font-black rounded cursor-pointer transition-all ${
                                              sellerPlotGate === opt ? 'bg-[#0E1F35] text-white' : 'bg-slate-100 text-slate-500'
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-1 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col justify-center items-center text-center">
                                      <span className="text-[8.5px] font-black uppercase text-[#0E1F35]">Furnishing Fit-Outs</span>
                                      <p className="text-[9.5px] text-slate-400 font-bold italic">N/A - Vacant / Paved plot of land</p>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Utilities & Infrastructure</span>
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Water Conn.</span>
                                          <div className="flex gap-1 justify-center mt-1">
                                            {['Yes', 'No'].map((opt) => (
                                              <button
                                                type="button"
                                                key={opt}
                                                onClick={() => setSellerPlotWater(opt)}
                                                className={`px-1 rounded text-[8px] font-black cursor-pointer ${
                                                  sellerPlotWater === opt ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                                                }`}
                                              >
                                                {opt}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Electricity</span>
                                          <div className="flex gap-1 justify-center mt-1">
                                            {['Yes', 'No'].map((opt) => (
                                              <button
                                                type="button"
                                                key={opt}
                                                onClick={() => setSellerPlotElectricity(opt)}
                                                className={`px-1 rounded text-[8px] font-black cursor-pointer ${
                                                  sellerPlotElectricity === opt ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                                                }`}
                                              >
                                                {opt}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-black uppercase">Approach Rd</span>
                                          <input 
                                            type="text" 
                                            value={sellerPlotRoadWidth} 
                                            onChange={(e) => setSellerPlotRoadWidth(e.target.value)}
                                            className="w-full bg-transparent text-center text-[9px] font-bold text-slate-700 leading-none mt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeSellerPropType === 'house' && (
                                <div className="space-y-3 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Monthly Rent</span>
                                      <input 
                                        type="text" 
                                        value={sellerHouseRent} 
                                        onChange={(e) => setSellerHouseRent(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Expected Deposit</span>
                                      <input 
                                        type="text" 
                                        value={sellerHouseDeposit} 
                                        onChange={(e) => setSellerHouseDeposit(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Maintenance Charges</span>
                                      <input 
                                        type="text" 
                                        value={sellerHouseMaintenance} 
                                        onChange={(e) => setSellerHouseMaintenance(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Built-up Area</span>
                                      <input 
                                        type="text" 
                                        value={sellerHouseBuiltup} 
                                        onChange={(e) => setSellerHouseBuiltup(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Total Plot/Ground Area</span>
                                      <input 
                                        type="text" 
                                        value={sellerHousePlotArea} 
                                        onChange={(e) => setSellerHousePlotArea(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Number of Storeys</span>
                                      <input 
                                        type="text" 
                                        value={sellerHouseFloors} 
                                        onChange={(e) => setSellerHouseFloors(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-50 pt-2.5">
                                    <div className="space-y-2">
                                      <span className="text-[8px] font-black uppercase text-slate-500 block">Furnishing & Interior fits</span>
                                      <div className="flex gap-1.5 p-0.5 bg-slate-50 rounded-lg border border-slate-100">
                                        {['Fully Furnished', 'Semi Furnished', 'Unfurnished'].map((opt) => (
                                          <button
                                            type="button"
                                            key={opt}
                                            onClick={() => setSellerHouseFurnishing(opt)}
                                            className={`flex-1 py-1 text-[8.5px] font-black border-none rounded transition-all cursor-pointer ${
                                              sellerHouseFurnishing === opt ? 'bg-[#0E1F35] text-white shadow-xs' : 'text-slate-500 bg-white'
                                            }`}
                                          >
                                            {opt.split(' ')[0]}
                                          </button>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-50 pt-2">
                                        <div className="flex flex-col">
                                          <span className="text-[7.5px] text-slate-400 font-bold uppercase">Bathrooms Count</span>
                                          <input 
                                            type="text" 
                                            value={sellerHouseBathrooms} 
                                            onChange={(e) => setSellerHouseBathrooms(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded p-1 text-center text-xs text-slate-800 font-extrabold"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[7.5px] text-slate-400 font-bold uppercase">Modular Kitchen setup</span>
                                          <input 
                                            type="text" 
                                            value={sellerHouseKitchen} 
                                            onChange={(e) => setSellerHouseKitchen(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded p-1 text-center text-[10px] text-slate-850 font-bold"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[8.5px] font-black uppercase text-slate-500 block">Infrastructure & Parking</span>
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Water Tank Cap</span>
                                          <input 
                                            type="text" 
                                            value={sellerHouseWaterTank} 
                                            onChange={(e) => setSellerHouseWaterTank(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700"
                                          />
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Parking Slots</span>
                                          <input 
                                            type="text" 
                                            value={sellerHouseParking} 
                                            onChange={(e) => setSellerHouseParking(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700 font-sans"
                                          />
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                                          <span className="text-[7.5px] text-slate-400 block font-bold uppercase">Lawn / Terrace</span>
                                          <input 
                                            type="text" 
                                            value={sellerHouseGardenTerrace} 
                                            onChange={(e) => setSellerHouseGardenTerrace(e.target.value)}
                                            className="w-full bg-transparent text-center text-[10px] font-bold text-slate-700"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    let itemSummary = '';
                                    let rentValue = '';
                                    let mntValue = '';
                                    let depValue = '';
                                    if (activeSellerPropType === 'flat') {
                                      rentValue = sellerFlatRent;
                                      mntValue = `${sellerFlatMaintenance} (${sellerFlatMaintenanceType})`;
                                      depValue = sellerFlatDeposit;
                                      itemSummary = `Flat: SFT ${sellerFlatCarpetArea}/${sellerFlatSuperArea}, lvl ${sellerFlatFloorNum}/${sellerFlatTotalFloors}, Furnish: ${sellerFlatFurnishing}, Items: ${sellerFlatChecklist.join(', ') || 'None'}, Water: ${sellerFlatWaterSource}, Lift: ${sellerFlatLiftAccess}`;
                                    } else if (activeSellerPropType === 'land') {
                                      rentValue = `${sellerPlotLease} (Lease)`;
                                      mntValue = sellerPlotTax;
                                      depValue = sellerPlotDeposit;
                                      itemSummary = `Plot/Land: size ${sellerPlotArea}, Boundary: ${sellerPlotBoundary}, Gate: ${sellerPlotGate}, Approach: ${sellerPlotRoadWidth}, Utilities: Water-${sellerPlotWater}, Power-${sellerPlotElectricity}`;
                                    } else {
                                      rentValue = sellerHouseRent;
                                      mntValue = sellerHouseMaintenance;
                                      depValue = sellerHouseDeposit;
                                      itemSummary = `House/Villa: Built-up ${sellerHouseBuiltup}, Ground ${sellerHousePlotArea}, ${sellerHouseFloors}, ${sellerHouseFurnishing}, Bathrooms: ${sellerHouseBathrooms}, Tank: ${sellerHouseWaterTank}, Parking: ${sellerHouseParking}, Terrace-Lawn: ${sellerHouseGardenTerrace}`;
                                    }

                                    const newProp = {
                                      id: `prop-${Date.now()}`,
                                      type: activeSellerPropType,
                                      rent: rentValue.startsWith('₹') ? rentValue : `₹${rentValue}`,
                                      maintenance: mntValue,
                                      deposit: depValue.startsWith('₹') ? depValue : `₹${depValue}`,
                                      specs: itemSummary
                                    };

                                    setSellerProperties([...sellerProperties, newProp]);
                                    triggerFeedback(`Inserted ${activeSellerPropType.toUpperCase()} asset into active listing matrix queue!`, 'success');
                                  }}
                                  className="flex items-center gap-1 py-1.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer border-none"
                                >
                                  <span>➕ Register Property to Asset Matrix</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Render Added Properties Pool */}
                          {sellerProperties.length > 0 && (
                            <div className="sm:col-span-2 space-y-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block pl-1">Registered Queue Listings ({sellerProperties.length})</span>
                              <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                {sellerProperties.map((prop) => (
                                  <div key={prop.id} className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex justify-between items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[8px] uppercase font-black px-1 leading-none rounded bg-emerald-50 text-emerald-800 tracking-wider">
                                          {prop.type === 'flat' ? '🏢 Apartment' : prop.type === 'land' ? '🏜️ Plot' : '🏡 Villa'}
                                        </span>
                                        <span className="text-[10px] font-black text-emerald-700">{prop.rent}</span>
                                      </div>
                                      <p className="text-[8px] text-slate-400 font-bold">
                                        Deposit: <span className="text-slate-600 font-extrabold">{prop.deposit}</span> | Maintenance: <span className="text-slate-600 font-extrabold">{prop.maintenance}</span>
                                      </p>
                                      <p className="text-[8.5px] text-slate-600 font-mono truncate leading-tight" title={prop.specs}>{prop.specs}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSellerProperties(sellerProperties.filter(p => p.id !== prop.id));
                                        triggerFeedback('Removed listing.', 'info');
                                      }}
                                      className="text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 p-1.5 rounded-lg border-none cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Agent Role Data Card */}
                    {selectedPersonas.includes('agent') && (
                      <div className="border border-indigo-600/20 bg-indigo-500/5 rounded-3xl p-5 relative overflow-hidden transition-all space-y-4">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-600/5 rounded-full pointer-events-none -mr-4 -mt-4 flex items-center justify-center text-indigo-600/15">
                          <Award className="w-12 h-12" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">🔑</span>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wide text-indigo-800">Certified Broker / Agent Profile Details</h4>
                            <p className="text-[10px] text-slate-500 font-bold">Verify legal compliance, showcase operational coordinates, and target specs matches</p>
                          </div>
                        </div>

                        {/* Role Visual Banner */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-indigo-600/10 relative group shadow-sm bg-white">
                          <img 
                            src={agentImg} 
                            alt="Certified Broker / Agent" 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-905/60 to-transparent flex items-end p-3">
                            <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">ACTIVE FORM: BROKER / AGENT</span>
                          </div>
                        </div>

                        {/* 1. Legal Compliance & Credentials (The Verification Layer) */}
                        <div className="space-y-2 border-t border-indigo-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-950 text-[10.5px] font-black uppercase tracking-wider">1. Legal Compliance & Credentials</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">RERA License ID (Indian Markets)</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-indigo-600">
                                <Award className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text" 
                                  required 
                                  value={agentRera}
                                  onChange={(e) => setAgentRera(e.target.value)}
                                  placeholder="MHARERA-A512004245"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Agency / Company Affiliation</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-indigo-600">
                                <Building2 className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text" 
                                  required 
                                  value={agentCompany}
                                  onChange={(e) => setAgentCompany(e.target.value)}
                                  placeholder="Prime Realtors Ltd"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Corporate Persona Mode</label>
                              <select 
                                value={agentCorpPersona}
                                onChange={(e) => setAgentCorpPersona(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 font-bold px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 h-[32px]"
                              >
                                <option value="Individual Agent">Individual Agent (Sole Trader)</option>
                                <option value="Proprietorship Firm">Proprietorship Firm</option>
                                <option value="Brokerage Agency (LLP/Pvt Ltd)">Brokerage Agency (LLP/Pvt Ltd)</option>
                              </select>
                            </div>

                            {/* Verification status and Proof file upload */}
                            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-2.5 mt-1">
                              <div className="space-y-1">
                                <span className="text-slate-500 text-[8.5px] font-black block pl-0.5 uppercase">Training & Exams Licensing</span>
                                <button
                                  type="button"
                                  onClick={() => setAgentCertified(!agentCertified)}
                                  className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                                    agentCertified 
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold' 
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {agentCertified ? '✓ Passed State Licensing' : '✗ Uncertified Draft Mode'}
                                </button>
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <span className="text-slate-500 text-[8.5px] font-black block pl-0.5 uppercase">Mandatory Licensing Certification Proof</span>
                                <div className="relative border border-dashed border-indigo-300 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] transition-all rounded-lg p-1.5 flex items-center justify-center cursor-pointer min-h-[32px]">
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setAgentCertFileName(file.name);
                                        setAgentCertFile('attached');
                                        triggerFeedback(`License Proof ${file.name} uploaded!`, 'success');
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-1.5 text-indigo-700">
                                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[280px]">
                                      {agentCertFileName ? `✓ Verified: ${agentCertFileName}` : "Upload Government License / Certificate Copy PDF"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tax Info Row */}
                            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-2.5">
                              <div className="space-y-1">
                                <label className="text-slate-500 text-[9px] font-black uppercase tracking-wider block pl-0.5">Permanent Account Number (PAN Card No.)</label>
                                <input 
                                  type="text" 
                                  value={agentPan}
                                  onChange={(e) => setAgentPan(e.target.value)}
                                  placeholder="e.g. ABCDE1234F"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-500 text-[9px] font-black uppercase tracking-wider block pl-0.5">GST Registration Identification Number (GSTIN)</label>
                                <input 
                                  type="text" 
                                  value={agentGst}
                                  onChange={(e) => setAgentGst(e.target.value)}
                                  placeholder="e.g. 27ABCDE1234F1Z5 (Required for commission thresholds)"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Geographical Jurisdiction & Expertise */}
                        <div className="space-y-2 border-t border-indigo-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-950 text-[10.5px] font-black uppercase tracking-wider">2. Geographical Jurisdiction & Expertise</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1 col-span-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Primary Operating Cities</label>
                              <input 
                                type="text"
                                value={agentCities}
                                onChange={(e) => setAgentCities(e.target.value)}
                                placeholder="e.g. Mumbai, Pune, Nagpur"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>
                            
                            <div className="space-y-1 col-span-2">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Micro-Market Localities & Target Pin Codes</label>
                              <input 
                                type="text"
                                value={agentLocalities}
                                onChange={(e) => setAgentLocalities(e.target.value)}
                                placeholder="e.g. Dharampeth, Kora Road, Shivaji Nagar"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Physical storefront or corporate Office Address</label>
                              <input 
                                type="text"
                                value={agentOfficeAddress}
                                onChange={(e) => setAgentOfficeAddress(e.target.value)}
                                placeholder="e.g. Metro Chambers, Block D, Nagpur (MS)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Specialization Matrix (The Matchmaking Rules) */}
                        <div className="space-y-2 border-t border-indigo-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-950 text-[10.5px] font-black uppercase tracking-wider">3. Specialization Matrix (The Matchmaking Rules)</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-3.5 shadow-xs">
                            {/* Row 1: Feature Segment */}
                            <div>
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Asset Focus (Selectable Options)</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Plots / Land', 'Flats / Apartments', 'Independent Houses / Villas', 'Commercial Spaces'].map((item) => {
                                  const isSelected = agentSpecialties.includes(item);
                                  return (
                                    <button
                                      type="button"
                                      key={item}
                                      onClick={() => {
                                        if (isSelected) {
                                          setAgentSpecialties(agentSpecialties.filter(x => x !== item));
                                        } else {
                                          setAgentSpecialties([...agentSpecialties, item]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {item}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Row 2: Asset Market Focus */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5 font-sans">Market Stage Specialization Focus</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Resale / Secondary Market', 'New Launches / Developer Sales'].map((item) => {
                                  const isSelected = agentAssetFocus.includes(item);
                                  return (
                                    <button
                                      type="button"
                                      key={item}
                                      onClick={() => {
                                        if (isSelected) {
                                          setAgentAssetFocus(agentAssetFocus.filter(x => x !== item));
                                        } else {
                                          setAgentAssetFocus([...agentAssetFocus, item]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-605 bg-indigo-600 border-indigo-600 text-white shadow-xs font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {item}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Row 3: Transaction Type */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Transaction Type Capability</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Rentals / Leasing', 'Sales / Outright Purchase'].map((item) => {
                                  const isSelected = agentTransactionTypes.includes(item);
                                  return (
                                    <button
                                      type="button"
                                      key={item}
                                      onClick={() => {
                                        if (isSelected) {
                                          setAgentTransactionTypes(agentTransactionTypes.filter(x => x !== item));
                                        } else {
                                          setAgentTransactionTypes([...agentTransactionTypes, item]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {item}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Row 4: Budget Tier Focus */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Target Budget Scale Focus</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Affordable Housing', 'Mid-Segment Luxury', 'Ultra-High-Net-Worth (UHNW) Luxury'].map((item) => {
                                  const isSelected = agentBudgetTiers.includes(item);
                                  return (
                                    <button
                                      type="button"
                                      key={item}
                                      onClick={() => {
                                        if (isSelected) {
                                          setAgentBudgetTiers(agentBudgetTiers.filter(x => x !== item));
                                        } else {
                                          setAgentBudgetTiers([...agentBudgetTiers, item]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {item}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. Marketplace Trust & Commercials */}
                        <div className="space-y-2 border-t border-indigo-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-950 text-[10.5px] font-black uppercase tracking-wider">4. Marketplace Trust & Commercials</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs animate-fadeIn">
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 text-slate-550">Commission Transparency Details</label>
                              <input 
                                type="text"
                                value={agentBrokerage}
                                onChange={(e) => setAgentBrokerage(e.target.value)}
                                placeholder="e.g. 2% on Sales, 1 Month Rent on Leases"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 text-slate-550">Experience Metric (Years)</label>
                              <input 
                                type="number"
                                min="1"
                                max="50"
                                value={agentExp}
                                onChange={(e) => setAgentExp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 text-slate-550">Past transacted Deals / Volume (12 Mo)</label>
                              <input 
                                type="text"
                                value={agentPastVolume}
                                onChange={(e) => setAgentPastVolume(e.target.value)}
                                placeholder="e.g. e.g. 34,000 Sq. Ft (12 Deals closed)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="sm:col-span-3 border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9.2px] font-black block pl-0.5 uppercase mb-1.5">Language Capabilities</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali', 'Kannada'].map((lang) => {
                                  const isSelected = agentLanguages.includes(lang);
                                  return (
                                    <button
                                      type="button"
                                      key={lang}
                                      onClick={() => {
                                        if (isSelected) {
                                          setAgentLanguages(agentLanguages.filter(l => l !== lang));
                                        } else {
                                          setAgentLanguages([...agentLanguages, lang]);
                                        }
                                      }}
                                      className={`py-1 px-2.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {lang}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Builder Role Data Card */}
                    {selectedPersonas.includes('builder') && (
                      <div className="border border-amber-600/20 bg-amber-500/5 rounded-3xl p-5 relative overflow-hidden transition-all">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-amber-600/5 rounded-full pointer-events-none -mr-4 -mt-4 flex items-center justify-center text-amber-600/15">
                          <Building2 className="w-12 h-12" />
                        </div>
                        <div className="flex items-center gap-2 mb-3.5">
                          <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-black flex items-center justify-center">🏗️</span>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wide text-amber-800">Developer / Builder Profile Details</h4>
                            <p className="text-[10px] text-slate-500 font-bold">License details for initiating township developments</p>
                          </div>
                        </div>

                        {/* Role Visual Banner */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-amber-600/10 relative group shadow-sm bg-white">
                          <img 
                            src={builderImg} 
                            alt="Developer / Builder" 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                            <span className="bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">ACTIVE FORM: DEVELOPER / BUILDER</span>
                          </div>
                        </div>

                        <div className="space-y-4 border-t border-amber-600/10 pt-3">
                          {/* 1. Corporate Identity & Legal Compliance */}
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-950 text-[10.5px] font-black uppercase tracking-wider">1. Corporate Identity & Legal Compliance (The Trust Architecture)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Development Company Legal Registered Name</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-amber-600">
                                <Building2 className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text" 
                                  required 
                                  value={builderCompany}
                                  onChange={(e) => setBuilderCompany(e.target.value)}
                                  placeholder="e.g. Apex Infrastructure Pvt. Ltd. (LLP / Co)"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">RERA Developer Promoter ID</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-amber-600">
                                <Award className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text" 
                                  required 
                                  value={builderRera}
                                  onChange={(e) => setBuilderRera(e.target.value)}
                                  placeholder="e.g. MHARERA-P5120002410"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Company PAN Card Number</label>
                              <input 
                                type="text"
                                value={builderPan}
                                onChange={(e) => setBuilderPan(e.target.value)}
                                placeholder="e.g. AAACA1234H"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Corporate Identification Number (CIN)</label>
                              <input 
                                type="text"
                                value={builderCin}
                                onChange={(e) => setBuilderCin(e.target.value)}
                                placeholder="e.g. U45200MH2024PTC123456"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Company GSTIN Number</label>
                              <input 
                                type="text"
                                value={builderGst}
                                onChange={(e) => setBuilderGst(e.target.value)}
                                placeholder="e.g. 27AAACA1234H1Z1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2 border-t border-slate-100 pt-2.5">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 flex items-center gap-1 text-amber-900">
                                <Landmark className="w-3.5 h-3.5" /> Project-Specific RERA Escrow Account Details (Fund Preservation)
                              </label>
                              <input 
                                type="text"
                                required
                                value={builderEscrowBank}
                                onChange={(e) => setBuilderEscrowBank(e.target.value)}
                                placeholder="e.g. HDFC Bank Special Escrow - A/C 5020008471254 (IFSC: HDFC0000012)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Double-Sided Operational Strategy (Buy vs. Build) */}
                        <div className="space-y-4 border-t border-amber-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-950 text-[10.5px] font-black uppercase tracking-wider">2. Double-Sided Operational Strategy (Buy vs. Build)</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-3.5 shadow-xs">
                            <div>
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Primary Growth Strategy Layer</span>
                              <div className="flex gap-2">
                                {[
                                  'Buy & Renovate (Brownfield Development)',
                                  'Raw Land Build-Out (Greenfield Development)'
                                ].map((strat) => (
                                  <button
                                    type="button"
                                    key={strat}
                                    onClick={() => setBuilderStrategy(strat)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer text-center transition-all ${
                                      builderStrategy === strat 
                                        ? 'bg-amber-600 border-amber-600 text-white shadow-xs' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {strat}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Specific Target Assets checkboxes */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Strategic Target Assets Focus</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                  'Dilapidated housing societies seeking self-redevelopment',
                                  'Old independent bungalows/villas',
                                  'Distressed commercial properties',
                                  'Agricultural land awaiting non-agricultural conversion',
                                  'Raw residential/commercial zones',
                                  'Large sub-divided layouts'
                                ].map((asset) => {
                                  const isSelected = builderTargetAssets.includes(asset);
                                  return (
                                    <button
                                      type="button"
                                      key={asset}
                                      onClick={() => {
                                        if (isSelected) {
                                          setBuilderTargetAssets(builderTargetAssets.filter(x => x !== asset));
                                        } else {
                                          setBuilderTargetAssets([...builderTargetAssets, asset]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border text-left transition-all cursor-pointer truncate ${
                                        isSelected 
                                          ? 'bg-amber-600 border-amber-600 text-white font-black shadow-xs' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {asset}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Preferred Deal Scale Parameters */}
                            <div className="border-t border-slate-100 pt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Min Plot Footprint</label>
                                <input 
                                  type="text"
                                  value={builderMinPlotSize}
                                  onChange={(e) => setBuilderMinPlotSize(e.target.value)}
                                  placeholder="e.g. 1,000 Sq. Mtr"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Max Plot Footprint</label>
                                <input 
                                  type="text"
                                  value={builderMaxPlotSize}
                                  onChange={(e) => setBuilderMaxPlotSize(e.target.value)}
                                  placeholder="e.g. 20,000 Sq. Mtr"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Acres Layout Scope</label>
                                <input 
                                  type="text"
                                  value={builderTotalLayoutCapability}
                                  onChange={(e) => setBuilderTotalLayoutCapability(e.target.value)}
                                  placeholder="e.g. 15 Acres"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            {/* Locality Focus & Financial mode split columns */}
                            <div className="border-t border-slate-100 pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">Acreage Locality Focus</span>
                                <div className="space-y-1">
                                  {[
                                    'Established urban micro-markets (FSI vertical expansion)',
                                    'Outlying suburban growth corridors',
                                    'Upcoming highway bypass points'
                                  ].map((loc) => {
                                    const isSelected = builderLocalityFocus.includes(loc);
                                    return (
                                      <button
                                        type="button"
                                        key={loc}
                                        onClick={() => {
                                          if (isSelected) {
                                            setBuilderLocalityFocus(builderLocalityFocus.filter(x => x !== loc));
                                          } else {
                                            setBuilderLocalityFocus([...builderLocalityFocus, loc]);
                                          }
                                        }}
                                        className={`w-full py-1.5 px-2.5 rounded-lg text-[9px] font-semibold border text-left transition-all truncate cursor-pointer block ${
                                          isSelected 
                                            ? 'bg-amber-600 border-amber-600 text-white font-bold' 
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {isSelected ? '✓ ' : '＋ '} {loc}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase">Financial Structuring Strategy</span>
                                <div className="space-y-1">
                                  {[
                                    'Outright acquisition cash buy',
                                    'Joint Development Agreements (JDA)',
                                    'Direct corporate land purchases',
                                    'Structural partnerships with government authorities'
                                  ].map((mode) => {
                                    const isSelected = builderFinancialModes.includes(mode);
                                    return (
                                      <button
                                        type="button"
                                        key={mode}
                                        onClick={() => {
                                          if (isSelected) {
                                            setBuilderFinancialModes(builderFinancialModes.filter(x => x !== mode));
                                          } else {
                                            setBuilderFinancialModes([...builderFinancialModes, mode]);
                                          }
                                        }}
                                        className={`w-full py-1.5 px-2.5 rounded-lg text-[9px] font-semibold border text-left transition-all truncate cursor-pointer block ${
                                          isSelected 
                                            ? 'bg-amber-600 border-amber-600 text-white font-bold' 
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {isSelected ? '✓ ' : '＋ '} {mode}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. The "Build-Out" Persona & Output Capacity */}
                        <div className="space-y-4 border-t border-amber-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-950 text-[10.5px] font-black uppercase tracking-wider">3. The "Build-Out" Persona & Output Capacity</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-3 shadow-xs">
                            <div>
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Enterprise Classification Types</span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Residential Societies', 'Commercial Tech Parks', 'Mixed-Use spaces', 'Plotted Gated Communities'].map((clas) => {
                                  const isSelected = builderClassifications.includes(clas);
                                  return (
                                    <button
                                      type="button"
                                      key={clas}
                                      onClick={() => {
                                        if (isSelected) {
                                          setBuilderClassifications(builderClassifications.filter(x => x !== clas));
                                        } else {
                                          setBuilderClassifications([...builderClassifications, clas]);
                                        }
                                      }}
                                      className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-amber-600 border-amber-600 text-white font-black' 
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '＋ '} {clas}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Construction Tier Focus</span>
                              <div className="flex gap-2">
                                {['Affordable Mass Housing', 'Mid-tier Townships', 'Ultra-Luxury High-Rises'].map((tier) => (
                                  <button
                                    type="button"
                                    key={tier}
                                    onClick={() => setBuilderConstructionTier(tier)}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                                      builderConstructionTier === tier 
                                        ? 'bg-amber-600 border-amber-600 text-white font-black' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {tier}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-2.5">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 mb-1">Active Under-Construction Project Pipeline</label>
                              <input 
                                type="text"
                                value={builderProjectPipeline}
                                onChange={(e) => setBuilderProjectPipeline(e.target.value)}
                                placeholder="e.g. Horizon Towers (2/3 BHK flats), Handover Timeline Dec 2028"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 4. Developer Track Record & Trust Metrics */}
                        <div className="space-y-4 border-t border-amber-600/10 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-950 text-[10.5px] font-black uppercase tracking-wider">4. Developer Track Record & Trust Metrics</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Years Active as Registered Builder</label>
                              <input 
                                type="number" 
                                min="1"
                                max="50"
                                value={builderExp}
                                onChange={(e) => setBuilderExp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Total Successfully Delivered Area Footprint</label>
                              <input 
                                type="text"
                                value={builderDeliveredFootprint}
                                onChange={(e) => setBuilderDeliveredFootprint(e.target.value)}
                                placeholder="e.g. 1.4 Million Sq. Ft / 950+ Units"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="sm:col-span-2 border-t border-slate-100 pt-2.5">
                              <div className="flex items-center justify-between bg-amber-500/[0.03] p-2.5 rounded-xl border border-amber-600/10">
                                <div>
                                  <span className="text-amber-900 block text-[9.5px] font-black uppercase">Standard Structural Defects Warranty Clause Compliance</span>
                                  <span className="text-[8.5px] text-slate-500 font-semibold block leading-tight">MahaRERA/Governing Law Section 14(3) 5-Year Free Fixes Framework</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setBuilderWarrantyClause(!builderWarrantyClause)}
                                  className={`py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider border cursor-pointer text-center transition-all ${
                                    builderWarrantyClause 
                                      ? 'bg-amber-600 border-amber-600 text-white shadow-xs' 
                                      : 'bg-slate-100 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  {builderWarrantyClause ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}
                                </button>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  )}

                    {/* Vendor Role Data Card */}
                    {selectedPersonas.includes('vendor') && (
                      <div className="border border-orange-600/20 bg-orange-500/5 rounded-3xl p-5 relative overflow-hidden transition-all space-y-6 text-left">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/5 rounded-full pointer-events-none -mr-4 -mt-4 flex items-center justify-center text-orange-600/15">
                          <Briefcase className="w-12 h-12" />
                        </div>
                        
                        <div className="flex items-center gap-2 pb-3 border-b border-orange-250/20">
                          <span className="w-8 h-8 rounded-xl bg-orange-600 text-white text-sm font-black flex items-center justify-center">💼</span>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wide text-orange-950">Service Vendor & Supply Partner setup</h4>
                            <p className="text-[10px] text-slate-500 font-bold">Configure dispatch coverage geofence, specialization matrix, and legal credentials.</p>
                          </div>
                        </div>

                        {/* Role Visual Banner */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-orange-600/10 relative group shadow-sm bg-white">
                          <img 
                            src={vendorImg} 
                            alt="Service Vendor / Supplier" 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                            <span className="bg-orange-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">ACTIVE FORM: SERVICE VENDOR</span>
                          </div>
                        </div>

                        {/* SECTION 1: Basic Information & Professional Identity */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">1</span>
                            <span className="text-orange-950 text-[10.5px] font-black uppercase tracking-wider">Basic Information & Professional Identity</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Vendor Type / Business Structure</label>
                              <select 
                                value={vendorType}
                                onChange={(e) => setVendorType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-650"
                              >
                                <option value="Independent Contractor (Individual)">Independent Contractor (Individual)</option>
                                <option value="Registered Service Agency">Registered Service Agency</option>
                                <option value="Registered Service Company (LLP/Pvt Ltd)">Registered Service Company (LLP/Pvt Ltd)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Primary Contact / WhatsApp Number</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-orange-650">
                                <Phone className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text" 
                                  required 
                                  value={vendorWhatsapp}
                                  onChange={(e) => setVendorWhatsapp(e.target.value)}
                                  placeholder="e.g. +91 98200 45678 (WhatsApp Dispatch Ready)"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Supplier Brand Name / Entity Name</label>
                              <input 
                                type="text"
                                required
                                value={vendorCompany}
                                onChange={(e) => setVendorCompany(e.target.value)}
                                placeholder="e.g. Royal Decorators & Turnkey Interiors"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-850"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-2 pt-1 border-t border-slate-100">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Profile Photo or Registered Logo URL</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={vendorLogo}
                                  onChange={(e) => setVendorLogo(e.target.value)}
                                  placeholder="e.g. https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                                {vendorLogo && (
                                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                                    <img src={vendorLogo} alt="Logo preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://media.giphy.com/media/l41YcGT5ShJa0MvEk/giphy.gif" }} />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[8px] font-black text-slate-400 uppercase">Preset Trust Avatars:</span>
                                {[
                                  { name: '👤 Male Pro', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60' },
                                  { name: '👤 Female Pro', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=60' },
                                  { name: '🏢 Agency Seal', url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=120&auto=format&fit=crop&q=60' },
                                  { name: '✨ Tech Logo', url: 'https://images.unsplash.com/photo-1549923058-aa3441a27e6a?w=120&auto=format&fit=crop&q=60' }
                                ].map((pre) => (
                                  <button
                                    type="button"
                                    key={pre.name}
                                    onClick={() => setVendorLogo(pre.url)}
                                    className={`py-0.5 px-1.5 rounded text-[8px] font-black border transition-all cursor-pointer ${
                                      vendorLogo === pre.url ? 'bg-orange-600 text-white border-orange-650' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {pre.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: Service Category & Specialization Matrix */}
                        <div className="space-y-4 border-t border-orange-600/10 pt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">2</span>
                            <span className="text-orange-950 text-[10.5px] font-black uppercase tracking-wider">Service Category & Specialization Matrix</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-3 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Primary Skill Category</label>
                                <select 
                                  value={vendorCategory}
                                  onChange={(e) => {
                                    setVendorCategory(e.target.value);
                                    // Reset default skills & scales according to map
                                    const defaultMap: Record<string, { skills: string[]; scales: string[] }> = {
                                      'Painting': { skills: ['Interior painting', 'Exterior painting'], scales: ['Residential'] },
                                      'Plumbing': { skills: ['General repairs', 'Sanitary installations'], scales: ['Residential', 'Maintenance'] },
                                      'Electrician': { skills: ['Wiring', 'Appliance repair'], scales: ['Maintenance'] },
                                      'Interior Design': { skills: ['Space planning', '3D visualization'], scales: ['Premium', 'Luxury'] },
                                      'Carpentry & Others': { skills: ['Custom furniture', 'Door/window fixes'], scales: ['Maintenance', 'Assembly'] }
                                    };
                                    const match = defaultMap[e.target.value];
                                    if (match) {
                                      setVendorSkills(match.skills);
                                      setVendorScaleFocus(match.scales);
                                    }
                                  }}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                                >
                                  <option value="Painting">🎨 Painting</option>
                                  <option value="Plumbing">🚰 Plumbing</option>
                                  <option value="Electrician">⚡ Electrician</option>
                                  <option value="Interior Design">📐 Interior Design</option>
                                  <option value="Carpentry & Others">🔨 Carpentry & Others</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Professional Licensing Experience</label>
                                <input 
                                  type="number" 
                                  min="1"
                                  value={vendorExp}
                                  onChange={(e) => setVendorExp(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Render selectable list of specific skills matching selected Category */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-550 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Selectable Skills Matching Specialization Matrix</span>
                              <div className="flex flex-wrap gap-1.5">
                                {(() => {
                                  const list = {
                                    'Painting': ['Interior painting', 'Exterior painting', 'Waterproofing', 'Texture walls', 'Polishing'],
                                    'Plumbing': ['General repairs', 'Sanitary installations', 'Leak detection', 'Drainage clearing'],
                                    'Electrician': ['Wiring', 'Inverter installation', 'Appliance repair', 'Light fixtures', 'Short circuit fixes'],
                                    'Interior Design': ['Space planning', '3D visualization', 'Modular kitchens', 'Wardrobe work', 'Full turnkey'],
                                    'Carpentry & Others': ['Custom furniture', 'Door/window fixes', 'Lock repair', 'False ceilings', 'Maintenance', 'Assembly']
                                  }[vendorCategory] || [];

                                  return list.map((skill) => {
                                    const active = vendorSkills.includes(skill);
                                    return (
                                      <button
                                        type="button"
                                        key={skill}
                                        onClick={() => {
                                          if (active) {
                                            setVendorSkills(vendorSkills.filter(s => s !== skill));
                                          } else {
                                            setVendorSkills([...vendorSkills, skill]);
                                          }
                                        }}
                                        className={`py-1.5 px-2.5 rounded-lg text-[9px] font-bold border cursor-pointer transition-all ${
                                          active ? 'bg-orange-600 border-orange-600 text-white font-black' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {active ? '✓ ' : '＋ '} {skill}
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            </div>

                            {/* Scale Focus matching selected Category */}
                            <div className="border-t border-slate-100 pt-2.5">
                              <span className="text-slate-550 text-[9px] font-black block pl-0.5 uppercase mb-1.5">Scale Focus (Scale Targets)</span>
                              <div className="flex flex-wrap gap-1.5">
                                {(() => {
                                  const scales = {
                                    'Painting': ['Residential', 'Commercial'],
                                    'Plumbing': ['Residential', 'Maintenance'],
                                    'Electrician': ['Maintenance', 'Commercial'],
                                    'Interior Design': ['Premium', 'Luxury', 'Budget'],
                                    'Carpentry & Others': ['Maintenance', 'Assembly']
                                  }[vendorCategory] || [];

                                  return scales.map((scale) => {
                                    const active = vendorScaleFocus.includes(scale);
                                    return (
                                      <button
                                        type="button"
                                        key={scale}
                                        onClick={() => {
                                          if (active) {
                                            setVendorScaleFocus(vendorScaleFocus.filter(s => s !== scale));
                                          } else {
                                            setVendorScaleFocus([...vendorScaleFocus, scale]);
                                          }
                                        }}
                                        className={`py-1 px-2 rounded-md text-[9px] font-black uppercase tracking-wide border cursor-pointer transition-all ${
                                          active ? 'bg-amber-600 border-amber-600 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {active ? '✓ ' : '＋ '} {scale}
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: Service Coverage & Operating Logistics */}
                        <div className="space-y-4 border-t border-orange-600/10 pt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">3</span>
                            <span className="text-orange-950 text-[10.5px] font-black uppercase tracking-wider">Service Coverage & Operating Logistics (Geofence)</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-3.5 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Operational Base City</label>
                                <input 
                                  type="text"
                                  required
                                  value={vendorCities}
                                  onChange={(e) => setVendorCities(e.target.value)}
                                  placeholder="e.g. Nagpur"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Working Daily Hours Window</label>
                                <select
                                  value={vendorWorkingHours}
                                  onChange={(e) => setVendorWorkingHours(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                                >
                                  <option value="9:00 AM to 7:00 PM">9:00 AM to 7:00 PM (Standard General Shift)</option>
                                  <option value="8:00 AM to 8:00 PM">8:00 AM to 8:00 PM (Extended General Shift)</option>
                                  <option value="10:00 AM to 6:00 PM">10:00 AM to 6:00 PM (Commercial Complex Shift)</option>
                                  <option value="24/7 Hours">24/7 round the clock (Full Dispatch)</option>
                                </select>
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Serving Neighborhoods / Pin Codes (Tag Multiselect)</label>
                                <input 
                                  type="text"
                                  required
                                  value={vendorNeighborhoods}
                                  onChange={(e) => setVendorNeighborhoods(e.target.value)}
                                  placeholder="e.g. Dharampeth, Ramdaspeth, Sadar, Bajaj Nagar, Pratap Nagar"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-805"
                                />
                                <div className="flex gap-1.5 flex-wrap pt-0.5">
                                  {['Dharampeth', 'Ramdaspeth', 'Pratap Nagar', 'Sadar', 'Warsa Road'].map((nbh) => {
                                    const includes = vendorNeighborhoods.includes(nbh);
                                    return (
                                      <button
                                        type="button"
                                        key={nbh}
                                        onClick={() => {
                                          if (includes) {
                                            setVendorNeighborhoods(vendorNeighborhoods.split(', ').filter(x => x !== nbh).join(', '));
                                          } else {
                                            setVendorNeighborhoods(vendorNeighborhoods ? `${vendorNeighborhoods}, ${nbh}` : nbh);
                                          }
                                        }}
                                        className={`py-0.5 px-2 rounded-full text-[8.5px] font-bold border transition-all cursor-pointer ${
                                          includes ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                        }`}
                                      >
                                        {includes ? '✓' : '＋'} {nbh}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                                <span className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 mb-1.5">Weekly Rest Off-day Selection</span>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                    const isSelected = vendorOffDays.includes(day);
                                    return (
                                      <button
                                        type="button"
                                        key={day}
                                        onClick={() => {
                                          if (isSelected) {
                                            setVendorOffDays(vendorOffDays.filter(d => d !== day));
                                          } else {
                                            setVendorOffDays([...vendorOffDays, day]);
                                          }
                                        }}
                                        className={`py-1 rounded text-[8.5px] font-bold text-center border transition-all cursor-pointer ${
                                          isSelected ? 'bg-orange-600 border-orange-600 text-white font-black shadow-xs' : 'bg-slate-50 border-slate-250 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {day.substring(0, 3)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                                <div className="flex items-center justify-between bg-orange-500/[0.03] p-2.5 rounded-xl border border-orange-600/10">
                                  <div>
                                    <span className="text-orange-950 block text-[9.5px] font-black uppercase">Emergency 24/7 Call-Out Availability</span>
                                    <span className="text-[8.5px] text-slate-500 font-semibold block leading-tight">Accept rapid dispatch notifications for water leaks, short-circuits, or lockouts.</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setVendorEmergency(!vendorEmergency)}
                                    className={`py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                                      vendorEmergency 
                                        ? 'bg-orange-600 border-orange-650 text-white shadow-xs' 
                                        : 'bg-slate-105 border-slate-201 text-slate-600'
                                    }`}
                                  >
                                    {vendorEmergency ? '✓ EMERGENCY ACTIVE' : '✗ REGULAR HOURS ONLY'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: Pricing & Payout Matrix */}
                        <div className="space-y-4 border-t border-orange-600/10 pt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">4</span>
                            <span className="text-orange-950 text-[10.5px] font-black uppercase tracking-wider font-sans">Pricing & Payout Matrix</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Baseline Pricing Metric</label>
                              <select
                                value={vendorPricingBasis}
                                onChange={(e) => setVendorPricingBasis(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-804 focus:outline-none"
                              >
                                <option value="Hourly Rate">Hourly Rate basis pricing</option>
                                <option value="Per-Square-Foot Rate">Per-Square-Foot Rate (standard construction/painting)</option>
                                <option value="Flat Inspection/Visiting Fee">Flat Inspection/Visiting Fee</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Minimum Visiting / Consultation Fee</label>
                              <div className="relative bg-slate-50 rounded-lg flex items-center border border-slate-200 focus-within:ring-1 focus-within:ring-orange-650">
                                <DollarSign className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
                                <input 
                                  type="text"
                                  required
                                  value={vendorMinFee}
                                  onChange={(e) => setVendorMinFee(e.target.value)}
                                  placeholder="e.g. ₹499 (credited offset against repair work)"
                                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-bold pl-8.5 pr-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 5: Verification & Trust Layer */}
                        <div className="space-y-4 border-t border-orange-600/10 pt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">5</span>
                            <span className="text-orange-950 text-[10.5px] font-black uppercase tracking-wider">Verification & Trust Layer (Quality Control)</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-2xl border border-slate-150 space-y-4 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 flex items-center gap-1 text-orange-900">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Identity & Background Verification (National ID)
                                </label>
                                <input 
                                  type="text"
                                  required
                                  value={vendorNationalId}
                                  onChange={(e) => setVendorNationalId(e.target.value)}
                                  placeholder="e.g. Aadhaar Card Link / ID NO: 4529 1042 XXXX"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5">Certifications & Licensing IDs</label>
                                <input 
                                  type="text"
                                  value={vendorLicense}
                                  onChange={(e) => setVendorLicense(e.target.value)}
                                  placeholder="e.g. Municipal Board Electrician / Plumber Lic: CG-E-904"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3">
                              <span className="text-slate-600 text-[9px] font-black uppercase tracking-wider block pl-0.5 mb-2">Portfolio Project Showcases (Before & After Live Captures)</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {vendorPortfolio.map((url, idx) => (
                                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex flex-col">
                                    <div className="h-28 overflow-hidden bg-slate-100 relative">
                                      <img src={url} alt={`Portfolio case ${idx + 1}`} className="w-full h-full object-cover" />
                                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black uppercase rounded shadow">
                                        Project {idx === 0 ? 'Before & After #1' : 'Featured Handover #2'}
                                      </span>
                                    </div>
                                    <div className="p-2 flex gap-1 items-center">
                                      <input 
                                        type="text" 
                                        value={url}
                                        onChange={(e) => {
                                          const copy = [...vendorPortfolio];
                                          copy[idx] = e.target.value;
                                          setVendorPortfolio(copy);
                                        }}
                                        className="w-full bg-slate-50/50 border border-slate-200 text-[9px] font-semibold text-slate-705 p-1 rounded focus:outline-none"
                                        placeholder="Customize Portfolio Image Link URL..."
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 justify-end pt-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVendorPortfolio([
                                      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=450',
                                      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=450'
                                    ]);
                                  }}
                                  className="text-[8.5px] font-black text-orange-700 uppercase tracking-wider bg-orange-50 shrink-0 border border-orange-100 px-2 py-1 rounded-md cursor-pointer hover:bg-orange-100"
                                >
                                  Reset to Premium Stock Presets
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              ) : (
                  <div className="bg-[#004C5C]/5 p-6 rounded-3xl border border-[#004C5C]/15 flex flex-col items-center text-center gap-3 shadow-xs">
                    <span className="p-3.5 rounded-2xl bg-teal-100/60 text-[#004C5C]">
                      <Smile className="w-8 h-8 animate-bounce" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-[#0E1F35] uppercase tracking-wider">No Transactional Role Form Information Required</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1.5 font-semibold leading-relaxed">
                        As a Guest explorer, you don't need to specify budget ranges, structural defects warranty declarations, or regulatory registrations. Provide only primary contact details above to generate your secure digital real estate identification badge!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6 font-semibold">
                <button 
                  type="button" 
                  onClick={() => setSetupStep(1)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Role Selection
                </button>
                <button 
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 py-3.5 px-6 bg-[#064E6B] hover:bg-[#0E1F35] disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Issuing Consolidated ID...
                    </>
                  ) : (
                    <>
                      Generate Multi-Role ID <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: DIGITAL REAL ESTATE ID CARD DISPLAY */}
          {setupStep === 3 && digitalIdDetails && (
            <div className="space-y-6 flex-grow flex flex-col justify-between items-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-2.5 animate-bounce">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-[#0E1F35] uppercase tracking-wide">ID Card Generated successfully!</h3>
                <p className="text-[11px] text-slate-500 font-bold max-w-sm mx-auto mt-1">
                  Your legal credentials and specialized status are now cryptographically linked. Please keep this digital representation safe.
                </p>
              </div>

              {/* Dual Column Layout: Left Column (Passport ID card) & Right Column (Achievements dashboard) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl px-4 items-start mt-2">
                
                {/* Column 1: Passport ID Representation */}
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest text-center flex items-center gap-1 select-none">
                    🛡️ Verified Real Estate Digital ID Card
                  </div>
                  
                  {/* Digital ID Card Aspect Canvas */}
                  <div className="w-full bg-gradient-to-tr from-[#0E1F35] via-[#092B45] to-[#043C53] rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-white/10 flex flex-col justify-between min-h-[250px] select-text">
                {/* Subtle logo vector trace bg */}
                <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-5 pointer-events-none">
                  <svg viewBox="0 0 120 220" className="w-full h-full fill-white">
                    <path d="M 63,5 L 81,15.4 L 81,204.6 L 63,215 Z" />
                    <path d="M 81,15.4 L 115,35 L 115,80 L 98,70 L 98,45 L 81,35 Z" />
                  </svg>
                </div>

                {/* Card Top: Banner & verified badge */}
                <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-4 text-left">
                  <div>
                    <h4 className="text-sm font-black tracking-wider uppercase m-0 leading-none">URBAN NEST REALTY</h4>
                    <span className="text-[9px] text-[#B38330] font-black uppercase tracking-widest mt-1.5 block">RESIDENTIAL CO-NETWORK</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 select-none text-right">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                      RERA VERIFIED
                    </span>
                    <span className="text-[8px] font-mono text-white/40">{digitalIdDetails.id}</span>
                  </div>
                </div>

                {/* Card Middle: Profile Details */}
                <div className="flex-grow flex flex-col-reverse sm:grid sm:grid-cols-12 gap-4 sm:gap-3 pb-4">
                  {/* Persona Badge Indicator & Name */}
                  <div className="w-full sm:col-span-8 space-y-2.5 text-left">
                    <div>
                      <span className="text-[8px] uppercase font-black text-white/50 tracking-widest block">AUTHORISED SPECIALIST</span>
                      <span className="text-base font-black tracking-tight block mt-0.5 text-white/95">{digitalIdDetails.name}</span>
                    </div>

                    <div>
                      <span className="text-[7px] uppercase font-black text-white/40 block mb-1">PERSONA ROLE(S)</span>
                      <div className="flex flex-wrap gap-1">
                        {digitalIdDetails.roles && digitalIdDetails.roles.map((r: string) => (
                          <span key={r} className="text-[8px] uppercase font-black bg-white/10 text-white px-2 py-0.5 rounded-md leading-none border border-white/5">
                            {r === 'buyer' && '🏠 Buyer'}
                            {r === 'seller' && '🔑 Seller'}
                            {r === 'agent' && '👔 Agent'}
                            {r === 'builder' && '🏗️ Builder'}
                            {r === 'vendor' && '💼 Vendor'}
                            {r === 'guest' && '🌍 Guest'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Common Demographics Block */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[8.5px] bg-black/25 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white/40 block text-[6px] uppercase font-black">CITY LOCATION</span>
                        <span className="font-extrabold text-white/90">{digitalIdDetails.city}</span>
                      </div>
                      {digitalIdDetails.dob && (
                        <div>
                          <span className="text-white/40 block text-[6px] uppercase font-black">DATE OF BIRTH</span>
                          <span className="font-bold text-white/90">{digitalIdDetails.dob}</span>
                        </div>
                      )}
                      {digitalIdDetails.gender && (
                        <div>
                          <span className="text-white/40 block text-[6px] uppercase font-black">GENDER Identity</span>
                          <span className="font-bold text-white/90">{digitalIdDetails.gender}</span>
                        </div>
                      )}
                      {digitalIdDetails.occupation && (
                        <div className="col-span-2">
                          <span className="text-white/40 block text-[6px] uppercase font-black">OCCUPATION Profile</span>
                          <span className="font-bold text-teal-300 truncate block max-w-[210px]">{digitalIdDetails.occupation}</span>
                        </div>
                      )}
                      {digitalIdDetails.altEmail && (
                        <div className="col-span-2">
                          <span className="text-white/40 block text-[6px] uppercase font-black">SECURE ALTERNATIVE EMAIL</span>
                          <span className="font-medium text-white/80 truncate block max-w-[210px]">{digitalIdDetails.altEmail}</span>
                        </div>
                      )}
                      {digitalIdDetails.altPhone && (
                        <div className="col-span-2">
                          <span className="text-white/40 block text-[6px] uppercase font-black">ALT CONTACT</span>
                          <span className="font-bold text-[#E5AA3C]">{digitalIdDetails.altPhone}</span>
                        </div>
                      )}
                      {digitalIdDetails.address && (
                        <div className="col-span-2 text-white/70 leading-tight border-t border-white/5 pt-1 mt-0.5">
                          <span className="text-white/40 block text-[6px] uppercase font-black">STREET ADDRESS REF</span>
                          <span className="text-[7.5px] block font-medium max-w-[215px] truncate" title={digitalIdDetails.address}>{digitalIdDetails.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Affiliations list */}
                    <div className="text-[10px] space-y-1.5 mt-2 border-t border-white/5 pt-1.5">
                      {digitalIdDetails.roles && digitalIdDetails.roles.includes('agent') && digitalIdDetails.agentCompany && (
                        <div className="leading-tight">
                          <span className="text-[7px] uppercase font-black text-white/45 block">AGENT AGENCY</span>
                          <span className="font-semibold text-white/90 truncate block max-w-[220px]">
                            {digitalIdDetails.agentCompany} ({digitalIdDetails.agentExp} Yrs Exp)
                          </span>
                        </div>
                      )}
                      {digitalIdDetails.roles && digitalIdDetails.roles.includes('builder') && digitalIdDetails.builderCompany && (
                        <div className="leading-tight">
                          <span className="text-[7px] uppercase font-black text-white/45 block">DEVELOPMENT FIRM</span>
                          <span className="font-semibold text-white/90 truncate block max-w-[220px]">
                            {digitalIdDetails.builderCompany} ({digitalIdDetails.builderExp} Yrs Exp)
                          </span>
                        </div>
                      )}
                      {digitalIdDetails.roles && digitalIdDetails.roles.includes('vendor') && digitalIdDetails.vendorCompany && (
                        <div className="leading-tight">
                          <span className="text-[7px] uppercase font-black text-white/45 block">VENDOR CO</span>
                          <span className="font-semibold text-white/90 truncate block max-w-[220px]">
                            {digitalIdDetails.vendorCompany} ({digitalIdDetails.vendorExp} Yrs Exp)
                          </span>
                        </div>
                      )}
                      {digitalIdDetails.roles && digitalIdDetails.roles.includes('guest') && (
                        <div className="leading-tight">
                          <span className="text-[7px] uppercase font-black text-white/45 block">MEMBERSHIP CLASS</span>
                          <span className="font-semibold text-teal-300 font-sans">
                            🌍 Free Guest Explorer Mode
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Digital Portrait + Barcode & QR Stamp Column */}
                  <div className="w-full sm:col-span-4 flex flex-row sm:flex-col justify-between items-center sm:items-end border-b sm:border-b-0 sm:border-l border-white/10 pb-4 sm:pb-0 sm:pl-3">
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-4 w-auto sm:w-full">
                      {/* Interactive Visual Portrait Frame */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-slate-950 flex items-center justify-center">
                        {digitalIdDetails.profilePic ? (
                          <img 
                            src={digitalIdDetails.profilePic} 
                            alt="Specialist verified photo"
                            className="w-full h-full object-cover animate-fadeIn"
                          />
                        ) : (
                          <img 
                            src={digitalIdDetails.selectedAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver"} 
                            alt="Mascot Avatar representation"
                            className="w-full h-full object-contain p-1"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute inset-0 border border-amber-500/20 rounded-xl pointer-events-none" />
                        <span className="absolute bottom-0 inset-x-0 text-center bg-black/40 text-[5px] text-white/70 font-black tracking-widest uppercase">
                          PORTRAIT
                        </span>
                      </div>
 
                      {/* Cryptographic QR */}
                      <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-inner select-none flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                          <path d="M0 0h30v30H0zm40 0h10v10H40zm20 0h10v20H60zm20 0h20v20H80zM0 40h10v10H0zm20 0h10v20H20zm30 0h10v10H50zm30 0h10v10H80zm-40 20h10v10H40zm30 0h30v30H70zM0 70h30v30H0zm40 10h10v20H40zm20 0h10v10H60z" />
                          <path d="M10 10h10v10H10zm0 70h10v10H10zm70 0h10v10H80z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end mt-2 sm:mt-0">
                      <span className="text-[7px] uppercase font-black text-white/40 block">ISSUE DATE</span>
                      <span className="text-[9px] font-mono font-bold text-white/90">{digitalIdDetails.dateCreated}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Disclaimer or RERA ID */}
                <div className="border-t border-white/10 pt-2 flex flex-col gap-1 text-[8px] font-mono text-white/50 select-none text-left">
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('agent') && digitalIdDetails.agentRera && (
                    <div className="flex justify-between">
                      <span>AGENT RERA:</span>
                      <span className="text-[#B38330] font-bold">{digitalIdDetails.agentRera}</span>
                    </div>
                  )}
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('builder') && digitalIdDetails.builderRera && (
                    <div className="flex justify-between">
                      <span>DEVELOPER RERA:</span>
                      <span className="text-amber-400 font-bold">{digitalIdDetails.builderRera}</span>
                    </div>
                  )}
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('vendor') && digitalIdDetails.vendorCategory && (
                    <div className="flex justify-between">
                      <span>VENDOR CATEGORY:</span>
                      <span className="text-orange-400 font-bold">{digitalIdDetails.vendorCategory}</span>
                    </div>
                  )}
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('buyer') && (
                    <div className="space-y-1 text-slate-300 text-[8px] border-t border-b border-white/5 py-1.5 my-1 bg-white/[0.01] p-1.5 rounded-xl">
                      {digitalIdDetails.buyerSubMode === 'rent' ? (
                        <>
                          <div className="flex justify-between border-b border-white/5 pb-1 select-none">
                            <span className="text-[7px] font-black tracking-wider text-slate-400 uppercase">🔑 Renting Profile Specs</span>
                            <span className="text-[7px] font-mono text-teal-300 font-black uppercase">Active Tenant Query</span>
                          </div>
                          
                          <div className="flex justify-between mt-1">
                            <span className="text-slate-400">Monthly Rent:</span>
                            <span className="text-teal-300 font-bold">{digitalIdDetails.rentMinPrice} - {digitalIdDetails.rentMaxPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Deposit Cap:</span>
                            <span className="text-white font-semibold">{digitalIdDetails.rentSecurityDepositCap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Lease Term:</span>
                            <span className="text-amber-300 font-semibold">{digitalIdDetails.rentLeaseDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Move-In Timeframe:</span>
                            <span className="text-teal-300 font-bold">{digitalIdDetails.rentMoveInDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Prop Segment:</span>
                            <span className="text-[#00E5FF] font-bold uppercase">{digitalIdDetails.rentPropertyType}</span>
                          </div>

                          {digitalIdDetails.rentPropertyType === 'flat' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>BHK:</span> <span className="text-white font-bold">{digitalIdDetails.rentFlatBhk || '2 BHK'}</span></div>
                              <div className="flex justify-between"><span>Floor Preference:</span> <span className="text-white font-medium">{digitalIdDetails.rentFlatFloorLevel || 'Higher floor'}</span></div>
                              <div className="flex justify-between"><span>Furnishing:</span> <span className="text-white font-medium">{digitalIdDetails.rentFlatFurnishing || 'Semi-Furnished'}</span></div>
                              <div className="flex justify-between"><span>Amenities:</span> <span className="text-teal-300 truncate max-w-[120px]" title={digitalIdDetails.rentFlatAmenities?.join(', ')}>{digitalIdDetails.rentFlatAmenities?.join(', ') || 'None Selected'}</span></div>
                            </div>
                          )}

                          {digitalIdDetails.rentPropertyType === 'house' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>Floors Layout:</span> <span className="text-white font-bold">{digitalIdDetails.rentHouseFloors || '1 Floor'}</span></div>
                              <div className="flex justify-between"><span>Private Garden:</span> <span className="text-white font-medium">{digitalIdDetails.rentHouseGarden || 'Yes'}</span></div>
                              <div className="flex justify-between"><span>Furnishing:</span> <span className="text-white font-medium">{digitalIdDetails.rentHouseFurnishing || 'Semi-Furnished'}</span></div>
                              <div className="flex justify-between"><span>Amenities:</span> <span className="text-teal-300 truncate max-w-[120px]" title={digitalIdDetails.rentHouseAmenities?.join(', ')}>{digitalIdDetails.rentHouseAmenities?.join(', ') || 'None Selected'}</span></div>
                            </div>
                          )}

                          {digitalIdDetails.rentPropertyType === 'land' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>Plot Area Range:</span> <span className="text-white font-bold">{digitalIdDetails.rentLandArea || '1200 Sq. Ft'}</span></div>
                              <div className="flex justify-between"><span>Commercial Use:</span> <span className="text-white font-medium truncate max-w-[120px]" title={digitalIdDetails.rentLandCommercialUse}>{digitalIdDetails.rentLandCommercialUse}</span></div>
                              <div className="flex justify-between"><span>Amenities:</span> <span className="text-teal-300 truncate max-w-[120px]" title={digitalIdDetails.rentLandAmenities?.join(', ')}>{digitalIdDetails.rentLandAmenities?.join(', ') || 'None Selected'}</span></div>
                            </div>
                          )}

                          <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                            <div className="flex justify-between"><span>Pet Ownership:</span> <span className="text-white font-bold">{digitalIdDetails.rentPetOwnership || 'No'} {digitalIdDetails.rentPetType ? `(${digitalIdDetails.rentPetType})` : ''}</span></div>
                            <div className="flex justify-between"><span>Lifestyle Rules:</span> <span className="text-amber-300 font-medium">{digitalIdDetails.rentDietaryConstraint || 'Family preferred'}</span></div>
                            <div className="flex justify-between"><span>Smoking Rules:</span> <span className="text-white font-medium">Indoor smoking: {digitalIdDetails.rentSmokingPolicy || 'No'}</span></div>
                            <div className="flex justify-between text-teal-300"><span>Parking Slots:</span> <span>Two: {digitalIdDetails.rentParkingTwoWheeler || '0'} | Four: {digitalIdDetails.rentParkingFourWheeler || '0'}</span></div>
                          </div>

                          <div className="text-[7.5px] mt-1.5 space-y-0.5">
                            <div className="text-slate-400 font-black uppercase tracking-wider text-[6.5px]">Location Target Area:</div>
                            <div className="text-white truncate font-semibold bg-white/5 px-2 py-1 rounded border border-white/5" title={digitalIdDetails.buyerLocationIntent}>{digitalIdDetails.buyerLocationIntent}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between border-b border-white/5 pb-1 select-none">
                            <span className="text-[7px] font-black tracking-wider text-slate-400 uppercase">🏠 Buyer Profile Specs</span>
                            <span className="text-[7px] font-mono text-[#00E5FF] font-black uppercase">Active Query</span>
                          </div>
                          
                          <div className="flex justify-between mt-1">
                            <span className="text-slate-400">Budget Range:</span>
                            <span className="text-teal-300 font-bold">{digitalIdDetails.buyerBudget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Funding Plan:</span>
                            <span className="text-white font-semibold">{digitalIdDetails.buyerFundingSource}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Timeline:</span>
                            <span className="text-amber-300 font-semibold">{digitalIdDetails.buyerTimeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Prop Segment:</span>
                            <span className="text-[#00E5FF] font-bold uppercase">{digitalIdDetails.buyerPropertyType}</span>
                          </div>
                          
                          {digitalIdDetails.buyerPropertyType === 'land' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>Plot Area:</span> <span className="text-white font-bold">{digitalIdDetails.landPlotArea}</span></div>
                              <div className="flex justify-between"><span>Zoning:</span> <span className="text-white font-medium">{digitalIdDetails.landZoning}</span></div>
                              <div className="flex justify-between"><span>Road Width:</span> <span className="text-white font-medium">{digitalIdDetails.landRoadWidth}</span></div>
                              <div className="flex justify-between"><span>Boundary:</span> <span className="text-white font-medium">{digitalIdDetails.landBoundaryWall}</span></div>
                              <div className="flex justify-between"><span>Legal Status:</span> <span className="text-teal-300 truncate max-w-[120px]" title={digitalIdDetails.landLegalStatus?.join(', ')}>{digitalIdDetails.landLegalStatus?.join(', ') || 'None Selected'}</span></div>
                            </div>
                          )}
                          {digitalIdDetails.buyerPropertyType === 'house' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>Builtup & Plot:</span> <span className="text-white font-bold">{digitalIdDetails.houseArea}</span></div>
                              <div className="flex justify-between"><span>BHK layout:</span> <span className="text-white font-medium">{digitalIdDetails.houseBhk} ({digitalIdDetails.houseFloors})</span></div>
                              <div className="flex justify-between"><span>Constr Status:</span> <span className="text-white font-medium">{digitalIdDetails.houseConstructionStatus}</span></div>
                              <div className="flex justify-between"><span>Features:</span> <span className="text-teal-300 font-medium">Park:{digitalIdDetails.houseParking} | Garden:{digitalIdDetails.houseGarden} | Expand:{digitalIdDetails.houseExpansion}</span></div>
                            </div>
                          )}
                          {digitalIdDetails.buyerPropertyType === 'flat' && (
                            <div className="bg-white/5 p-1.5 rounded-lg text-[7px] space-y-0.5 mt-1 border border-white/5">
                              <div className="flex justify-between"><span>SBA / Carpet:</span> <span className="text-white font-bold">{digitalIdDetails.flatArea}</span></div>
                              <div className="flex justify-between"><span>BHK Layout:</span> <span className="text-white font-medium">{digitalIdDetails.flatBhk} ({digitalIdDetails.flatFloorLevel})</span></div>
                              <div className="flex justify-between"><span>Constr/Age:</span> <span className="text-white font-medium">{digitalIdDetails.flatConstructionStatus} ({digitalIdDetails.flatAge})</span></div>
                              <div className="flex justify-between"><span>Essentials:</span> <span className="text-teal-300 font-medium font-bold">Gated:{digitalIdDetails.flatGated} | Security:{digitalIdDetails.flatSecurity} | Backup:{digitalIdDetails.flatPowerBackup}</span></div>
                            </div>
                          )}

                          <div className="text-[7.5px] mt-1.5 space-y-0.5">
                            <div className="text-slate-400 font-black uppercase tracking-wider text-[6.5px]">Location Target Area:</div>
                            <div className="text-white truncate font-semibold bg-white/5 px-2 py-1 rounded border border-white/5" title={digitalIdDetails.buyerLocationIntent}>{digitalIdDetails.buyerLocationIntent}</div>
                          </div>

                          {digitalIdDetails.buyerLifestyleTags && digitalIdDetails.buyerLifestyleTags.length > 0 && (
                            <div className="pt-1">
                              <div className="text-slate-400 font-black uppercase tracking-wider text-[6.5px] mb-1">Lifestyle Preference Tags:</div>
                              <div className="flex flex-wrap gap-1">
                                {digitalIdDetails.buyerLifestyleTags.map((tag: string) => (
                                  <span key={tag} className="bg-teal-500/10 text-teal-300 text-[6.5px] font-black px-1.5 py-0.5 rounded-full border border-teal-500/20">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {digitalIdDetails.buyerRawIntent && (
                            <div className="text-[7.5px] mt-1.5 p-1.5 rounded-lg bg-teal-500/[0.04] border border-teal-500/10 max-h-[50px] overflow-y-auto leading-relaxed scrollbar-thin">
                              <span className="text-slate-400 block font-black uppercase tracking-wider text-[6.5px] mb-0.5">Dream Property Intent Description:</span>
                              <span className="text-teal-100 font-medium italic">{`"${digitalIdDetails.buyerRawIntent}"`}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('seller') && (
                    <div className="border-t border-white/10 pt-2.5 mt-2 space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[6.5px] uppercase font-black tracking-wider">Listing Persona Role:</span>
                        <span className="text-emerald-400 text-[8px] font-black uppercase">
                          {digitalIdDetails.sellerPersona === 'owner' ? '👤 Direct Owner' : digitalIdDetails.sellerPersona === 'agent' ? '💼 Authorized Agent' : '🏬 PMC Partner'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[7.5px]">
                        <span className="text-slate-400 text-[6.5px] uppercase font-black tracking-wider">KYC Trust Proof:</span>
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          🛡️ {digitalIdDetails.sellerKycType || 'Aadhaar'} 
                          <span className="text-[#96F0FF] text-[6.5px] font-normal truncate max-w-[80px]">
                            ({digitalIdDetails.sellerKycFileName || 'Default File Verified'})
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[7.5px]">
                        <span className="text-slate-400 text-[6.5px] uppercase font-black tracking-wider">Payout Escrow Path:</span>
                        <span className="text-slate-300 font-mono font-bold">
                          {digitalIdDetails.sellerPayoutType === 'upi' 
                            ? `UPI: ${digitalIdDetails.sellerPayoutUpi || 'escrow@ybl'}` 
                            : `BANK: ${digitalIdDetails.sellerPayoutBank || 'Demo A/c'} (IFSC: ${digitalIdDetails.sellerPayoutIfsc || 'Demo IFSC'})`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 text-[7px] leading-tight">
                        <div>
                          <span className="text-slate-400 block text-[5.5px] font-black uppercase tracking-widest text-[#9BD0F5]">Policy rules & lease:</span>
                          <span className="text-slate-300 block font-semibold text-[6.5px]">Lease: {digitalIdDetails.sellerLeaseDuration || '11 Months'}</span>
                          <span className="text-slate-405 text-[6px] font-medium text-slate-400 block truncate">
                            {digitalIdDetails.sellerPrefTenants && digitalIdDetails.sellerPrefTenants.length > 0 
                              ? `Prefers: ${digitalIdDetails.sellerPrefTenants.join(', ')}` 
                              : 'Tenant target: Open'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[5.5px] font-black uppercase tracking-widest text-[#9BD0F5]">No-Go Guidelines:</span>
                          <span className="text-slate-300 block font-medium text-[6.2px]">🐈 Pets: {digitalIdDetails.sellerPetPolicy || 'Allowed'}</span>
                          <span className="text-slate-300 block font-medium text-[6.2px]">🥗 Food: {digitalIdDetails.sellerDietaryPref || 'No Restrictions'}</span>
                        </div>
                      </div>

                      {/* Display registered asset matrix properties if present */}
                      {digitalIdDetails.sellerProperties && digitalIdDetails.sellerProperties.length > 0 ? (
                        <div className="space-y-1">
                          <span className="text-slate-400 block text-[6.5px] font-black uppercase tracking-widest">Active Matrix Listings ({digitalIdDetails.sellerProperties.length}):</span>
                          <div className="space-y-1 max-h-[85px] overflow-y-auto scrollbar-thin">
                            {digitalIdDetails.sellerProperties.map((prop: any, idx: number) => (
                              <div key={prop.id || idx} className="bg-white/5 p-1 rounded border border-white/5 text-[6.5px] leading-tight flex justify-between items-center gap-1.5 text-white">
                                <div className="min-w-0 flex-1">
                                  <div className="flex justify-between font-bold text-emerald-300 mb-0.5">
                                    <span className="uppercase tracking-wider">{prop.type === 'flat' ? '🏢 Flat' : prop.type === 'land' ? '🏜️ Land' : '🏡 Villa'}</span>
                                    <span>{prop.rent}</span>
                                  </div>
                                  <p className="text-slate-400 text-[6px] font-semibold truncate leading-none mb-0.5">Dep: {prop.deposit} | Maint: {prop.maintenance}</p>
                                  <p className="text-slate-300 font-mono text-[5.8px] leading-tight truncate">{prop.specs}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-[7.5px] border-t border-white/5 pt-1.5">
                          <span className="text-slate-400 text-[6.5px] uppercase font-black tracking-wider">Target Budget Scale:</span>
                          <span className="text-emerald-400 font-bold">{digitalIdDetails.sellerPrice}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('agent') && (
                    <div className="border-t border-white/10 pt-2.5 mt-2 space-y-2 text-left text-[7.5px] leading-tight">
                      
                      {/* Section 1: Verification & Compliance */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-[7px]">
                          <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[6px]">1. Legal & Regulatory Status</span>
                          <span className={`px-1 rounded text-[5.5px] font-black uppercase text-white ${digitalIdDetails.agentCertified ? 'bg-emerald-600' : 'bg-rose-500'}`}>
                            {digitalIdDetails.agentCertified ? '🛡️ CERTIFIED AGENT' : 'UNVERIFIED DRAFT'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-0.5 text-slate-300">
                          <div><span className="text-slate-500 block text-[5px] uppercase font-bold">RERA Reg ID:</span><span className="font-mono text-amber-200 font-bold">{digitalIdDetails.agentRera || 'None'}</span></div>
                          <div><span className="text-slate-500 block text-[5px] uppercase font-bold">Persona Type:</span><span className="font-bold">{digitalIdDetails.agentCorpPersona || 'Individual'}</span></div>
                          <div><span className="text-slate-500 block text-[5px] uppercase font-bold">PAN Tax ID:</span><span className="font-mono uppercase text-slate-350">{digitalIdDetails.agentPan || 'PENDING'}</span></div>
                          <div><span className="text-slate-500 block text-[5px] uppercase font-bold">GSTIN ID:</span><span className="font-mono uppercase text-slate-350">{digitalIdDetails.agentGst || 'PENDING'}</span></div>
                        </div>
                      </div>

                      {/* Section 2: Geographical Coordinates */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#96F0FF] font-extrabold uppercase tracking-widest text-[6px] block">2. Geo-Jurisdiction Coverage</span>
                        <div className="text-slate-300 space-y-0.5">
                          <p><span className="text-slate-500 font-bold uppercase text-[5px]">Macro Cities:</span> {digitalIdDetails.agentCities || 'NA'}</p>
                          <p><span className="text-slate-500 font-bold uppercase text-[5px]">Micro Localities:</span> {digitalIdDetails.agentLocalities || 'NA'}</p>
                          <p className="truncate"><span className="text-slate-500 font-bold uppercase text-[5px]">Storefront Office:</span> {digitalIdDetails.agentOfficeAddress || 'NA'}</p>
                        </div>
                      </div>

                      {/* Section 3: Specialization Matchmaking Matrix */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#9BD0F5] font-extrabold uppercase tracking-widest text-[6px] block">3. Specialization Matrix Match Rules</span>
                        <div className="grid grid-cols-2 gap-1 text-[7px] text-slate-350 leading-tight">
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Segments:</span>
                            <span className="text-white block font-semibold truncate">
                              {digitalIdDetails.agentSpecialties ? digitalIdDetails.agentSpecialties.join(', ') : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Asset Stages:</span>
                            <span className="text-white block font-semibold truncate">
                              {digitalIdDetails.agentAssetFocus ? digitalIdDetails.agentAssetFocus.join(', ') : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">TX Types:</span>
                            <span className="text-white block font-semibold truncate">
                              {digitalIdDetails.agentTransactionTypes ? digitalIdDetails.agentTransactionTypes.join(', ') : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Budget scale:</span>
                            <span className="text-white block font-semibold truncate">
                              {digitalIdDetails.agentBudgetTiers ? digitalIdDetails.agentBudgetTiers.join(', ') : 'None'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Commercial Trust Indicators */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[6px] block">4. Trust Indicators & Commercials</span>
                        <div className="text-slate-350 grid grid-cols-2 gap-1">
                          <div><span className="text-slate-500 text-[5px] uppercase block">Transparency Fee:</span><span className="text-emerald-300 font-bold text-[7px]">{digitalIdDetails.agentBrokerage || 'None'}</span></div>
                          <div><span className="text-slate-500 text-[5px] uppercase block">Experience years:</span><span className="text-white font-bold">{digitalIdDetails.agentExp || '2'} Yrs Active</span></div>
                          <div><span className="text-slate-500 text-[5px] uppercase block">Transacted deal volume:</span><span className="text-white truncate block">{digitalIdDetails.agentPastVolume || '34K Sqft'}</span></div>
                          <div><span className="text-slate-500 text-[5px] uppercase block">Communication:</span><span className="text-white truncate block">{digitalIdDetails.agentLanguages ? digitalIdDetails.agentLanguages.join(', ') : 'English, Hindi'}</span></div>
                        </div>
                      </div>

                    </div>
                  )}

                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('builder') && (
                    <div className="border-t border-white/10 pt-2.5 mt-2 space-y-2 text-left text-[7.5px] leading-tight">
                      
                      {/* Section 1: Verification & Compliance */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-[7px]">
                          <span className="text-amber-500 font-extrabold uppercase tracking-widest text-[6px]">1. Institutional & Corporate Compliance</span>
                          <span className="px-1 rounded text-[5.5px] font-black uppercase text-white bg-amber-600">
                            🏗️ RERA REGISTERED PROMOTER
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-0.5 text-slate-300">
                          <div className="col-span-2">
                            <span className="text-slate-550 text-[5px] uppercase font-bold">RERA Promoter ID:</span>
                            <span className="font-mono text-amber-200 font-bold block">{digitalIdDetails.builderRera || 'PENDING'}</span>
                          </div>
                          <div><span className="text-slate-550 block text-[5px] uppercase font-bold">Company PAN:</span><span className="font-mono uppercase text-slate-300">{digitalIdDetails.builderPan || 'VERIFIED'}</span></div>
                          <div><span className="text-slate-550 block text-[5px] uppercase font-bold">Company GSTIN:</span><span className="font-mono uppercase text-slate-300">{digitalIdDetails.builderGst || 'VERIFIED'}</span></div>
                          <div className="col-span-2"><span className="text-slate-555 block text-[5px] uppercase font-bold">Corporate ID (CIN):</span><span className="font-mono text-slate-300">{digitalIdDetails.builderCin || 'PENDING'}</span></div>
                          <div className="col-span-2 border-t border-white/5 pt-1 mt-0.5">
                            <span className="text-slate-500 text-[5px] uppercase font-bold block text-amber-200">RERA Escrow Account (Fund Preservation):</span>
                            <span className="text-slate-300 text-[6.5px] font-semibold">{digitalIdDetails.builderEscrowBank || 'HDFC Special Trust Escrow'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Operational Strategy */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#96F0FF] font-extrabold uppercase tracking-widest text-[6px] block">2. Growth & Land Acquisition Strategy</span>
                        <div className="text-slate-300 space-y-1">
                          <p><span className="text-slate-500 font-bold uppercase text-[5.2px]">Strategy Mode:</span> <span className="font-bold text-white uppercase">{digitalIdDetails.builderStrategy || 'Greenfield'}</span></p>
                          <p><span className="text-slate-500 font-bold uppercase text-[5.2px]">Target Assets:</span> {digitalIdDetails.builderTargetAssets ? digitalIdDetails.builderTargetAssets.join(', ') : 'Raw Residential/Commercial'}</p>
                          <div className="grid grid-cols-3 gap-1">
                            <div><span className="text-slate-500 block text-[5px] uppercase">Min Scale:</span><span className="text-slate-200 font-bold">{digitalIdDetails.builderMinPlotSize || '1.2k Sqm'}</span></div>
                            <div><span className="text-slate-500 block text-[5px] uppercase">Max Scale:</span><span className="text-slate-200 font-bold">{digitalIdDetails.builderMaxPlotSize || '25k Sqm'}</span></div>
                            <div><span className="text-slate-500 block text-[5px] uppercase">Acreage:</span><span className="text-slate-200 font-bold">{digitalIdDetails.builderTotalLayoutCapability || '15 Acres'}</span></div>
                          </div>
                          <p className="truncate"><span className="text-slate-500 font-bold uppercase text-[5.2px]">Locality Focus:</span> {digitalIdDetails.builderLocalityFocus ? digitalIdDetails.builderLocalityFocus.join(', ') : 'Outlying Suburban corridors'}</p>
                          <p className="truncate text-amber-300"><span className="text-slate-500 font-bold uppercase text-[5.2px]">Financing Mode:</span> {digitalIdDetails.builderFinancialModes ? digitalIdDetails.builderFinancialModes.join(', ') : 'Direct Corporate Land purchases, JDA Joint Development'}</p>
                        </div>
                      </div>

                      {/* Section 3: Build-Out Output Capacity */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#9BD0F5] font-extrabold uppercase tracking-widest text-[6px] block">3. Launch Build-Out Output Matrix</span>
                        <div className="grid grid-cols-2 gap-1 text-[7px] text-slate-350 leading-tight">
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Classification focus:</span>
                            <span className="text-white font-bold">{digitalIdDetails.builderClassifications ? digitalIdDetails.builderClassifications.join(', ') : 'Residential Societies'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Construction Tier:</span>
                            <span className="text-amber-300 font-extrabold">{digitalIdDetails.builderConstructionTier || 'Mid-tier Townships'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Experience years:</span>
                            <span className="text-slate-200 font-bold">{digitalIdDetails.builderExp || '3'} Years Active</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Live Project Development Pipeline:</span>
                            <span className="text-slate-200 italic truncate block leading-normal">{digitalIdDetails.builderProjectPipeline || 'Horizon Towers (2 & 3 BHK)'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Developer Track Record */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[6px] block">4. Trust Metrics & Defects Warranty</span>
                        <div className="text-slate-300 space-y-0.5">
                           <p><span className="text-slate-500 font-bold uppercase text-[5.2px]">Delivered Area:</span> <span className="text-white font-mono font-bold">{digitalIdDetails.builderDeliveredFootprint || '1.4M Sq Ft'}</span></p>
                           <p className="text-emerald-300 text-[6.5px] font-black uppercase tracking-wide flex items-center gap-1 mt-0.5">
                             🛡️ {digitalIdDetails.builderWarrantyClause ? 'MahaRERA Section 14(3) 5-Year Defects Warranty Compliant' : 'Structural Defects Warranty Declared'}
                           </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('vendor') && (
                    <div className="border-t border-white/10 pt-2.5 mt-2 space-y-2 text-left text-[7.5px] leading-tight">
                      
                      {/* Section 1: Basic Information & Professional Identity */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-[7px]">
                          <span className="text-orange-400 font-extrabold uppercase tracking-widest text-[6px]">1. Basic Info & Brand Identity</span>
                          <span className="px-1.5 py-0.5 rounded text-[5px] font-black uppercase text-white bg-orange-600">
                            💼 VERIFIED PROVIDER
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-1 text-slate-300">
                          <div className="col-span-2">
                            <span className="text-slate-500 text-[5px] uppercase font-bold">Brand / Entity Name:</span>
                            <span className="font-bold text-white block text-[9px]">{digitalIdDetails.vendorCompany || 'Independent Specialist'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-bold">Business Structure:</span>
                            <span className="font-semibold text-slate-200">{digitalIdDetails.vendorType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-bold">WhatsApp Dispatch Contact:</span>
                            <span className="font-mono text-emerald-400 font-bold">{digitalIdDetails.vendorWhatsapp || 'Available upon bookings'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Service Category & Specialization Matrix */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#96F0FF] font-extrabold uppercase tracking-widest text-[6px] block">2. Category & Specialization Matrix</span>
                        <div className="text-slate-300 space-y-1 pt-0.5">
                          <p>
                            <span className="text-slate-500 font-bold uppercase text-[5px] block">Primary Skill Area:</span>
                            <span className="text-white font-bold text-[8px]">{digitalIdDetails.vendorCategory} ({digitalIdDetails.vendorExp} Years Experience)</span>
                          </p>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-bold">Admitted Matrix Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {digitalIdDetails.vendorSkills && digitalIdDetails.vendorSkills.map((s: string) => (
                                <span key={s} className="px-1 bg-white/10 text-white rounded text-[5.5px] font-bold">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-555 block text-[5px] uppercase font-bold">Matrix Scale Focus:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {digitalIdDetails.vendorScaleFocus && digitalIdDetails.vendorScaleFocus.map((sc: string) => (
                                <span key={sc} className="px-1 bg-orange-600/20 text-orange-300 rounded text-[5px] font-black uppercase tracking-wider">{sc}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Service Coverage & Operating Geofence */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-[#9BD0F5] font-extrabold uppercase tracking-widest text-[6px] block">3. Service Coverage & Logistics Geofence</span>
                        <div className="grid grid-cols-2 gap-1 text-[7px] text-slate-350 leading-tight">
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">HQ Base City:</span>
                            <span className="text-white font-bold">{digitalIdDetails.vendorCities}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Weekly Holiday Off-days:</span>
                            <span className="text-orange-300 font-bold uppercase">{digitalIdDetails.vendorOffDays ? digitalIdDetails.vendorOffDays.join(', ') : 'None'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[5px] uppercase font-semibold">Geofenced Neighborhoods:</span>
                            <span className="text-slate-200 block truncate">{digitalIdDetails.vendorNeighborhoods}</span>
                          </div>
                          <div className="col-span-2 border-t border-white/5 pt-1 mt-0.5 flex justify-between items-center">
                            <div>
                              <span className="text-slate-550 block text-[5px] uppercase font-semibold">Standard Working Hours:</span>
                              <span className="text-slate-300">{digitalIdDetails.vendorWorkingHours}</span>
                            </div>
                            <span className={`px-1 rounded text-[5px] font-black uppercase ${
                              digitalIdDetails.vendorEmergency ? 'bg-orange-500/20 text-orange-400 border border-orange-500/35' : 'bg-white/5 text-slate-400'
                            }`}>
                              {digitalIdDetails.vendorEmergency ? '⚡ 24/7 Emergency Dispatch Ready' : '⏳ Office Hours Only'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Budget & Pricing Payout Matrix */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[6px] block">4. Economic Baseline & Visiting Minimums</span>
                        <div className="grid grid-cols-2 gap-1 text-[7.5px] text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase">PRICING BASIS:</span>
                            <span className="font-bold text-white uppercase">{digitalIdDetails.vendorPricingBasis}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[5px] uppercase">BASE VISIT FEE:</span>
                            <span className="text-orange-400 font-bold">{digitalIdDetails.vendorMinFee}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Trust and Verification Documents */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-[7px]">
                          <span className="text-emerald-400 font-extrabold uppercase tracking-widest text-[6px]">5. Verified Documents & Showcases</span>
                          <span className="text-[5.5px] text-emerald-400 font-black">✓ BACKGROUND CHECK PASSED</span>
                        </div>
                        <div className="text-slate-350 space-y-1 pt-0.5">
                           <div className="flex justify-between text-[6.5px]">
                             <div><span className="text-slate-500 text-[5px] uppercase font-bold block">NATIONAL ID (PAN/AADHAAR):</span><span className="font-mono text-slate-200">{digitalIdDetails.vendorNationalId || 'VERIFIED ONBOARDING DOC'}</span></div>
                             <div><span className="text-slate-500 text-[5px] uppercase font-bold block text-right">ACCREDITATIONS:</span><span className="text-slate-200 block text-right">{digitalIdDetails.vendorLicense || 'Govt Registered'}</span></div>
                           </div>
                           
                           {/* Small thumbnail gallery of portfolio real designs */}
                           {digitalIdDetails.vendorPortfolio && digitalIdDetails.vendorPortfolio.length > 0 && (
                             <div className="pt-1.5 space-y-1">
                               <span className="text-[5.5px] font-bold text-slate-500 uppercase tracking-widest block">Quality Work Portfolio Previews:</span>
                               <div className="grid grid-cols-3 gap-1">
                                 {digitalIdDetails.vendorPortfolio.slice(0, 3).map((url: string, pi: number) => (
                                   <div key={pi} className="h-7 rounded border border-white/10 overflow-hidden bg-slate-900">
                                     <img src={url} alt="Pass portfolio preview" className="w-full h-full object-cover" />
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>

                    </div>
                  )}

                  {digitalIdDetails.roles && digitalIdDetails.roles.includes('guest') && (
                    <div className="border-t border-white/10 pt-2.5 mt-2 space-y-2 text-left text-[7.5px] leading-tight animate-fadeIn">
                      
                      {/* Section 1: Basic Information & Professional Identity */}
                      <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-[7px]">
                          <span className="text-teal-400 font-extrabold uppercase tracking-widest text-[6px]">1. Platform Access Status</span>
                          <span className="px-1.5 py-0.5 rounded text-[5px] font-black uppercase text-white bg-teal-600">
                            🌍 EXPLORER STATUS
                          </span>
                        </div>
                        <div className="pt-1 text-slate-300 space-y-1">
                          <p className="font-semibold text-slate-200">
                            You are registered as a Guest Explorer! You can visit listed premium residentials, houses, co-living flats, layouts, and plots across all covered zones.
                          </p>
                          <div className="text-[6.5px] text-slate-400 border-t border-white/5 pt-1.5 mt-1">
                            * Want to participate in transactions? Click the settings tab at any time to add professional roles (Buyer, Seller, Agent, Builder, or Vendor) to your passport identity.
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  <div className="flex justify-between text-white/30 text-[7px] border-t border-white/5 pt-1 mt-0.5">
                    <span>UNR PORTAL ID PASSPORT</span>
                    <span>SECURE CREDENTIALS ACCREDITED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Passport Achievements & Quest Badges Hub */}
            <div className="w-full bg-white border border-slate-200/80 shadow-xl rounded-3xl p-6 space-y-5 flex flex-col hover:border-slate-300 transition-all text-left">
              
              {/* Header Title with level and badge count info */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 animate-pulse">
                    <Trophy className="w-5 h-5 fill-amber-300 stroke-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#0E1F35] uppercase tracking-wide">
                      {activeHubTab === 'achievements' ? 'Passport Achievements' : activeHubTab === 'leaderboard' ? 'Global Leaderboard' : 'Real-Time Spatial Heat Maps'}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {activeHubTab === 'achievements' 
                        ? 'Earn badges & unlock exclusive avatars' 
                        : activeHubTab === 'leaderboard' 
                        ? 'Top 10 players ranked by accumulated experience points'
                        : 'Explore prices, yields, future growth and school amenities'}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-100/50 text-amber-800 border border-amber-200/60 rounded-full px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 select-none">
                  👑 {getCurrentLevel(gamState.xp).name}
                </div>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex bg-slate-100/85 p-1 rounded-2xl border border-slate-200/60 select-none">
                <button
                  type="button"
                  onClick={() => setActiveHubTab('achievements')}
                  className={`flex-grow py-2 text-[10px] font-extrabold uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeHubTab === 'achievements'
                      ? 'bg-white text-[#0E1F35] shadow-xs border border-slate-200/10'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🎖️ Quests
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHubTab('leaderboard')}
                  className={`flex-grow py-2 text-[10px] font-extrabold uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeHubTab === 'leaderboard'
                      ? 'bg-white text-[#0E1F35] shadow-xs border border-slate-200/10'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🏆 Leaderboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHubTab('heatmap');
                    awardXPAction('view_property', 15);
                    window.dispatchEvent(new Event('urban_nest_gamification_updated'));
                  }}
                  className={`flex-grow py-2 text-[10px] font-extrabold uppercase tracking-wider text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeHubTab === 'heatmap'
                      ? 'bg-white text-orange-600 shadow-xs border border-amber-200/30'
                      : 'text-slate-550 hover:text-slate-700'
                  }`}
                >
                  🗺️ Heat Maps
                </button>
              </div>

              {activeHubTab === 'achievements' ? (
                <>
                  {/* Progress Bar of game rewards */}
                  {(() => {
                    const completedCount = ACHIEVEMENT_BADGES.filter(b => gamState.badges.includes(b.id)).length;
                    const percentage = Math.round((completedCount / ACHIEVEMENT_BADGES.length) * 100);
                    return (
                      <div className="bg-slate-50/55 rounded-2xl p-3 border border-slate-100/80 space-y-2 select-none">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-[#0E1F35] uppercase tracking-wide text-[10px]">BADGES CHALLENGE PROGRESS</span>
                          <span className="font-black text-teal-600 font-mono text-[11px]">{completedCount} / {ACHIEVEMENT_BADGES.length} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden border border-slate-300/30">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-450 font-extrabold uppercase tracking-wide">
                          <span>Total Gamification Score</span>
                          <span className="text-teal-600 font-black">{gamState.xp} XP Accumulated</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Daily Check-In & Streak Rewards Panel */}
                  <div className="bg-gradient-to-r from-slate-900 via-[#0a1e35] to-[#0d2a45] rounded-3xl p-5 text-white shadow-md relative overflow-hidden border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <div>
                          <h5 className="text-[12px] font-black uppercase tracking-wider text-orange-400">Daily Connection Check-In</h5>
                          <p className="text-[10px] text-slate-300 font-bold">Earn and stack consecutive check-in bonuses!</p>
                        </div>
                      </div>
                      <div className="bg-orange-500/20 text-orange-300 border border-orange-500/35 rounded-full px-3 py-1 text-[10px] font-black uppercase select-none font-mono">
                        {gamState.streakDays} Day-Streak
                      </div>
                    </div>

                    {/* 7-Day Grid */}
                    <div className="grid grid-cols-7 gap-1.5 text-center py-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                        // Check if checked in on or past this day in current streak
                        const isCompleted = gamState.streakDays >= dayNum;
                        const isNextToClaim = gamState.streakDays + 1 === dayNum && gamState.lastClaimedXPDate !== new Date().toISOString().split('T')[0];
                        const isTodayJustClaimed = gamState.streakDays === dayNum && gamState.lastClaimedXPDate === new Date().toISOString().split('T')[0];
                        
                        // Streak multiplier display
                        let rewardLabel = "+50 XP";
                        if (dayNum === 2) rewardLabel = "+75 XP";
                        else if (dayNum === 3) rewardLabel = "+100 XP";
                        else if (dayNum === 4) rewardLabel = "+125 XP";
                        else if (dayNum === 5) rewardLabel = "+150 XP";
                        else if (dayNum === 6) rewardLabel = "+200 XP";
                        else if (dayNum === 7) rewardLabel = "+300 XP";

                        return (
                          <div 
                            key={dayNum} 
                            className={`p-2 rounded-xl border flex flex-col items-center justify-between transition-all text-center min-h-[64px] select-none ${
                              isCompleted || isTodayJustClaimed
                                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/5'
                                : isNextToClaim
                                  ? 'bg-amber-500/20 border-teal-400/60 text-amber-300 animate-pulse ring-1 ring-amber-400/20'
                                  : 'bg-slate-950/45 border-white/5 text-slate-500'
                            }`}
                          >
                            <span className="text-[8px] font-black tracking-widest uppercase opacity-85">Day {dayNum}</span>
                            <span className="text-base my-0.5">
                              {isCompleted || isTodayJustClaimed ? '✅' : dayNum === 7 ? '👑' : '🔥'}
                            </span>
                            <span className="text-[8px] font-black font-mono leading-none truncate w-full">
                              {rewardLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Interactive Claim / Simulation Row */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      {(() => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const claimedToday = gamState.lastClaimedXPDate === todayStr;
                        
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              const result = claimDailyCheckIn();
                              setGamState(getGamificationState());
                              if (result.success) {
                                triggerFeedback(result.message, "success");
                                if (result.badgesUnlocked.length > 0) {
                                  setTimeout(() => {
                                    triggerFeedback(`🎉 Badge Unlocked: ${result.badgesUnlocked.join(', ')}!`, "success");
                                  }, 1200);
                                }
                              } else {
                                triggerFeedback(result.message, "success");
                              }
                            }}
                            disabled={claimedToday}
                            className={`flex-grow py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
                              claimedToday
                                ? 'bg-slate-800 border border-slate-750 text-slate-500 cursor-not-allowed select-none'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border border-orange-400 text-white shadow-md active:scale-95'
                            }`}
                          >
                            {claimedToday ? 'Checked-In Today ✅' : 'Claim Daily Check-In Bonus 🔥'}
                          </button>
                        );
                      })()}

                      <button
                        type="button"
                        onClick={() => {
                          const result = simulateNextDayCheckIn();
                          setGamState(getGamificationState());
                          triggerFeedback(result.message, "success");
                        }}
                        className="py-2.5 px-4 border border-dashed border-sky-400/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all h-[40px] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        🚀 Fast-Forward 1 Day
                      </button>
                    </div>
                  </div>

                  {/* Badges Challenge Items Scroll list Grid */}
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                    {ACHIEVEMENT_BADGES.map((badge) => {
                      const isUnlocked = gamState.badges.includes(badge.id);
                      const currentValue = badge.currentValue(gamState);
                      const targetValue = badge.targetValue;
                      const progressPercentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
                      
                      return (
                        <div 
                          key={badge.id} 
                          className={`p-3 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                            isUnlocked 
                              ? 'bg-emerald-500/[0.02] border-emerald-500/15 hover:border-emerald-500/35 shadow-xs' 
                              : 'bg-slate-50/40 border-slate-200/50 opacity-85'
                          }`}
                        >
                          {/* Badge Icon circle */}
                          <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-lg font-black shadow-inner transition-all duration-300 ${
                            isUnlocked 
                              ? `bg-gradient-to-br ${badge.colorClass} text-white shadow-md shadow-amber-500/10 scale-100` 
                              : 'bg-slate-100 text-slate-400 border border-slate-200/30'
                          }`}>
                            {badge.icon}
                          </div>

                          {/* Badge Body description */}
                          <div className="flex-grow space-y-1 text-left min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <span className={`text-[12px] font-extrabold truncate ${isUnlocked ? 'text-slate-800' : 'text-slate-500 font-medium'}`}>
                                {badge.title}
                              </span>
                              <span className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                                isUnlocked 
                                  ? 'bg-emerald-100 text-emerald-700 font-black' 
                                  : 'bg-slate-100 text-slate-400 font-bold'
                              }`}>
                                {isUnlocked ? 'Earned' : `+${badge.xpReward} XP`}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-450 font-bold leading-normal">
                              {badge.description}
                            </p>
                            
                            {/* Progress bar inside badge item */}
                            <div className="flex items-center gap-2 pt-1">
                              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${isUnlocked ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-300'}`}
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-black text-slate-500 font-mono truncate shrink-0">
                                {currentValue} / {targetValue}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Simulation center to sync and trigger searches & calculators */}
                  <div className="bg-slate-50 border border-slate-200/55 p-3 rounded-2xl space-y-2 text-left">
                    <span className="text-[9px] font-black uppercase text-[#064E6B] block tracking-widest">🎯 Instant Action Simulator</span>
                    <p className="text-[9.5px] text-slate-400 font-bold leading-relaxed">
                      Perform real explorer activities directly or use simulation buttons to test badge updates and sync.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          // Perform award action
                          const res = awardXPAction('view_property');
                          setGamState(getGamificationState());
                          if (res.badgesUnlocked.length > 0) {
                            triggerFeedback(`🎉 Achievement Unlocked: ${res.badgesUnlocked.join(', ')}! +XP Bonus awarded!`, "success");
                          } else {
                            triggerFeedback(`🔍 Simulated Search Completed! +${res.xpAdded} XP Added. Explorer badge progress updated.`, "success");
                          }
                        }}
                        className="py-2 px-2.5 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20 border border-teal-500/15 hover:border-teal-500/35 text-[#004C5C] font-black rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>🔍 Simulate Search</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Perform award action
                          const res = awardXPAction('use_calculator');
                          setGamState(getGamificationState());
                          if (res.badgesUnlocked.length > 0) {
                            triggerFeedback(`🎉 Achievement Unlocked: ${res.badgesUnlocked.join(', ')}! +XP Bonus awarded!`, "success");
                          } else {
                            triggerFeedback(`🧮 Calculator Usage Simulated! +${res.xpAdded} XP Added. Calculator Trial progress updated.`, "success");
                          }
                        }}
                        className="py-2 px-2.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/15 hover:border-amber-500/35 text-amber-700 font-black rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>🧮 Simulate Calc</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : activeHubTab === 'leaderboard' ? (
                /* Leaderboard Tab Content */
                <div className="space-y-4 flex flex-col text-left">
                  {/* Leaderboard Header description */}
                  <div className="bg-gradient-to-br from-[#0a1e35] via-[#0d2a45] to-[#113a5d] rounded-2xl p-4 border border-white/10 text-white flex justify-between items-center select-none shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="space-y-1 z-10">
                      <span className="text-[8.5px] font-black tracking-widest text-amber-400 uppercase block">👑 Nagpur Elite Realty League</span>
                      <h5 className="text-[11.5px] font-extrabold text-slate-100 tracking-tight leading-normal max-w-[210px] sm:max-w-xs">
                        Ranks dynamically update as you accumulate experience points (XP) of your achievements!
                      </h5>
                    </div>
                    <Trophy className="w-10 h-10 text-amber-400 fill-amber-400/20 stroke-amber-400 shrink-0 opacity-95 relative z-10" />
                  </div>

                  {/* List of ranks (Top 10) */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {(() => {
                      const dummyUsers = [
                        { name: "Devendra Fadnavis", role: "Nagpur Elite Investor", xp: 2450, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
                        { name: "Pranab Nagpurkar", role: "Premium RERA Builder", xp: 1850, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" },
                        { name: "Meera Deshmukh", role: "Commercial Land Banker", xp: 1420, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" },
                        { name: "Aditya Joshi", role: "Dharampeth Villa Collector", xp: 1100, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120" },
                        { name: "Amit Shahane", role: "Nagpur Smart Agent", xp: 850, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120" },
                        { name: "Rohit Kalmegh", role: "Mihan Techie Buyer", xp: 620, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120" },
                        { name: "Priya Wardhan", role: "Sadar Housing Specialist", xp: 450, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" },
                        { name: "Arjun Agnihotri", role: "Ramdaspeth Penthouse Buyer", xp: 300, avatar: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=120" },
                        { name: "Snehel Kulkarni", role: "Wathoda Land Developer", xp: 150, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" }
                      ];

                      const currentUserName = digitalIdDetails?.name || fullName || registeredEmail.split('@')[0] || "You (Explorer)";
                      const currentUserPic = digitalIdDetails?.profilePic || profilePic || selectedAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120";
                      
                      const allLeaders: Array<{
                        name: string;
                        role: string;
                        xp: number;
                        avatar: string;
                        isCurrentUser?: boolean;
                      }> = [
                        ...dummyUsers.map(u => ({ ...u, isCurrentUser: false })),
                        {
                          name: currentUserName,
                          role: "You (Active Explorer)",
                          xp: gamState.xp,
                          avatar: currentUserPic,
                          isCurrentUser: true,
                        }
                      ];

                      // Sort by XP descending
                      allLeaders.sort((a, b) => b.xp - a.xp);

                      // Slice to Top 10
                      const topTen = allLeaders.slice(0, 10);

                      return topTen.map((player, index) => {
                        const rank = index + 1;
                        let rankBadge = `${rank}`;
                        let rankBg = "bg-slate-50 border-slate-200 text-slate-500";
                        
                        if (rank === 1) {
                          rankBadge = "🥇";
                          rankBg = "bg-amber-50 border-amber-200 text-amber-700 scale-102 font-black text-xs";
                        } else if (rank === 2) {
                          rankBadge = "🥈";
                          rankBg = "bg-slate-100 border-slate-300 text-slate-600 scale-101 font-black text-xs";
                        } else if (rank === 3) {
                          rankBadge = "🥉";
                          rankBg = "bg-emerald-50 border-emerald-200 text-emerald-800 scale-101 font-black text-xs";
                        }

                        return (
                          <div 
                            key={player.name + "_" + player.xp + "_" + rank}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 select-none relative ${
                              player.isCurrentUser 
                                ? 'bg-amber-500/[0.04] border-amber-500/35 ring-1 ring-amber-500/10 shadow-sm overflow-hidden' 
                                : 'bg-slate-50/40 border-slate-200/50 hover:border-slate-300/80 hover:bg-slate-50/70'
                            }`}
                          >
                            {/* Current user gold banner effect */}
                            {player.isCurrentUser && (
                              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
                                YOU
                              </div>
                            )}

                            {/* Left part: Rank, Avatar, Information */}
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Rank indicator circle */}
                              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${rankBg}`}>
                                {rankBadge}
                              </div>

                              {/* Avatar image */}
                              <img 
                                src={player.avatar} 
                                referrerPolicy="no-referrer"
                                alt={player.name}
                                className="w-8.5 h-8.5 rounded-xl object-cover shrink-0 border border-slate-200"
                              />

                              {/* Player names & status */}
                              <div className="min-w-0">
                                <h6 className={`text-[12px] font-extrabold truncate ${player.isCurrentUser ? 'text-slate-900 font-extrabold' : 'text-slate-800'}`}>
                                  {player.name}
                                </h6>
                                <p className="text-[9.5px] font-medium text-slate-400 truncate">
                                  {player.role}
                                </p>
                              </div>
                            </div>

                            {/* Right part: XP tags */}
                            <div className="text-right shrink-0">
                              <span className={`text-[11px] font-black font-mono px-2 py-1 rounded-lg ${
                                player.isCurrentUser 
                                  ? 'bg-amber-105 text-amber-800 border border-amber-200' 
                                  : 'bg-slate-100 border border-slate-250/25 text-slate-600'
                              }`}>
                                {player.xp} XP
                              </span>
                            </div>

                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Competitive stimulation simulation block */}
                  <div className="bg-amber-500/[0.03] border border-amber-250/30 p-3.5 rounded-2xl text-left space-y-2">
                    <span className="text-[9px] font-black uppercase text-amber-700 tracking-widest flex items-center gap-1 select-none">
                      ⚡ REAL-TIME RANKING BOOSTER
                    </span>
                    <p className="text-[9.5px] text-slate-500 font-bold leading-normal">
                      Rise up the rankings instantly by triggering the real-time booster to increase your total XP!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const res = awardXPAction('chat_with_ai', 20);
                        setGamState(getGamificationState());
                        triggerFeedback("🔥 Competition Booster Activated! +20 XP awarded! Climb the leaderboards in real-time.", "success");
                      }}
                      className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 border border-amber-400 hover:border-amber-500 text-white font-black rounded-xl text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>🔥 Boost My XP (+20 XP Points)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <HeatMapDashboard />
              )}

            </div>

          </div>

              {/* Action Controls */}
              <div className="flex flex-wrap gap-4 w-full justify-center font-bold">
                <button 
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 py-3 px-5 border border-slate-300 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Print / Save ID
                </button>
                <button 
                  type="button"
                  id="nav-to-login-signup-preset-btn"
                  onClick={() => {
                    setShowProfileSetup(false);
                    setDigitalIdDetails(null);
                    setSetupStep(1);
                    setActiveCard('login');
                  }}
                  className="flex items-center gap-1.5 py-3 px-5 border border-amber-600/35 hover:border-amber-600 text-amber-700 bg-amber-500/5 hover:bg-amber-500/10 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer font-sans"
                >
                  🔐 Login/Signup Page
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const emailParam = digitalIdDetails?.email || registeredEmail || 'user@example.com';
                    const nameParam = digitalIdDetails?.name || fullName || emailParam.split('@')[0];
                    const picParam = digitalIdDetails?.profilePic || profilePic || selectedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                    const rolesParam = digitalIdDetails?.roles || selectedPersonas || ['guest'];
                    onLoginSuccess(emailParam, nameParam, picParam, rolesParam);
                    onBackToHome();
                  }}
                  className="flex items-center gap-1.5 py-3 px-6 bg-[#004C5C] hover:bg-[#064E6B] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Proceed to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Admin Quick Entry Key */}
          <div className="max-w-6xl w-full mx-auto mb-8 bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xs font-black uppercase text-[#0E1F35] tracking-wider">Access privileges</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-1">If you hold staff credentials, access the secure system dashboard directly.</p>
            </div>
            <button
              type="button"
              onClick={onAdminClick}
              className="bg-slate-900 hover:bg-[#064E6B] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow hover:scale-[1.02] active:scale-[0.98]"
            >
              🛡️ I am admin
            </button>
          </div>

          {/* Grid of Dual layout signup and login */}
          <div className="w-full max-w-6xl mx-auto flex-grow flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 w-full">
              
              {/* ======================================================= */}
              {/* SIGN UP CARD (LEFT SIDE)                                */}
              {/* ======================================================= */}
              <div 
                onClick={() => {
                  if (activeCard !== 'signup') {
                    setActiveCard('signup');
                  }
                }}
                className={`relative bg-[#D9DCDB] rounded-[2.5rem] p-8 sm:p-11 shadow-md border border-gray-200/40 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
                  activeCard === 'signup' 
                    ? 'ring-4 ring-[#064E6B] shadow-xl scale-[1.01] z-20' 
                    : 'cursor-pointer hover:shadow-lg hover:scale-[1.005] z-10'
                }`}
              >
                {/* Overlay if not active */}
                {activeCard !== 'signup' && (
                  <div className="absolute inset-0 z-30 bg-[#D9DCDB]/60 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center select-none group transition-all duration-500">
                    <div className="transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#064E6B]/10 flex items-center justify-center text-[#064E6B] mb-4 shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-[#0E1F35] tracking-tight uppercase">Sign Up</h3>
                      <p className="text-xs text-[#064E6B]/80 mt-1 font-bold tracking-wide uppercase">New Member Registration</p>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-500 pointer-events-none bg-gradient-to-b from-[#0E1F35]/5 via-transparent to-[#0E1F35]/10">
                      <span className="text-2xl sm:text-3xl font-black text-[#064E6B] tracking-tight drop-shadow-xs bg-white/45 px-6 py-3.5 rounded-full border border-white/60 shadow-xs">
                        "i am new commer"
                      </span>
                      <span className="mt-4 bg-[#0E1F35] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-md">
                        Click to Begin
                      </span>
                    </div>
                  </div>
                )}

                {/* Inner Content */}
                <div className={`transition-all duration-500 flex flex-col justify-between h-full ${
                  activeCard !== 'signup' ? 'blur-[1.5px] pointer-events-none opacity-40' : ''
                }`}>
                  {activeCard === 'signup' && (
                    <div className="flex justify-end mb-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCard(null);
                        }}
                        className="text-[10px] text-slate-600 hover:text-[#064E6B] font-extrabold uppercase tracking-wider flex items-center gap-1 bg-white/80 py-1 px-3 rounded-full hover:bg-white shadow-xs cursor-pointer transition-colors"
                      >
                        ← Change options
                      </button>
                    </div>
                  )}
                
                  <form onSubmit={handleSignupSubmit} className="space-y-6 text-left">
                    <h2 className="text-[#064E6B] text-3xl font-bold tracking-tight text-center mb-8">
                      Sign up
                    </h2>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[#0E1F35] text-xs font-extrabold block pl-1 tracking-wide uppercase">
                        Email
                      </label>
                      <div className="relative w-full bg-white rounded-full flex items-center shadow-sm">
                        <div className="absolute left-4.5 text-[#0E1F35]/70">
                          <Mail className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-12 pr-5 py-3.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#0E1F35]/30"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[#0E1F35] text-xs font-extrabold block pl-1 tracking-wide uppercase">
                        Password
                      </label>
                      <div className="relative w-full bg-white rounded-full flex items-center shadow-sm">
                        <div className="absolute left-4.5 text-[#0E1F35]/70">
                          <Lock className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-12 pr-12 py-3.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#0E1F35]/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-4.5 text-[#0E1F35]/70 hover:text-[#064E6B] transition-colors cursor-pointer"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[#0E1F35] text-xs font-extrabold block pl-1 tracking-wide uppercase">
                        Confirm password
                      </label>
                      <div className="bg-white rounded-full flex items-center shadow-sm">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold px-5 py-3.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#0E1F35]/30"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-[#064E6B] hover:bg-[#043C53] text-white font-extrabold text-xs sm:text-sm rounded-full tracking-widest uppercase transition-all shadow hover:shadow-md cursor-pointer mt-8 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Sign up
                    </button>

                    {/* OR Divider */}
                    <div className="text-center py-1 select-none">
                      <span className="text-[#0E1F35] text-xs font-black tracking-widest">-OR-</span>
                    </div>

                    {/* Sign up with Google */}
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-[#064E6B] rounded-full hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.81-4.53-5.84-4.53z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign up with google</span>
                    </button>
                  </form>

                  {/* Account Switch footer link */}
                  <div className="text-center pt-8 border-t border-[#0E1F35]/20 mt-6 text-xs text-slate-700 font-bold">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCard('login');
                      }}
                      className="text-[#064E6B] hover:underline font-extrabold cursor-pointer"
                    >
                      Log In here!
                    </button>
                  </div>
                </div>

              </div>

              {/* ======================================================= */}
              {/* LOG IN CARD (RIGHT SIDE)                                */}
              {/* ======================================================= */}
              <div 
                onClick={() => {
                  if (activeCard !== 'login') {
                    setActiveCard('login');
                  }
                }}
                className={`relative bg-[#D9DCDB] rounded-[2.5rem] p-8 sm:p-11 shadow-md border border-gray-200/40 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
                  activeCard === 'login' 
                    ? 'ring-4 ring-[#064E6B] shadow-xl scale-[1.01] z-20' 
                    : 'cursor-pointer hover:shadow-lg hover:scale-[1.005] z-10'
                }`}
              >
                {/* Overlay if not active */}
                {activeCard !== 'login' && (
                  <div className="absolute inset-0 z-30 bg-[#D9DCDB]/65 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center select-none group transition-all duration-500">
                    <div className="transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#064E6B]/10 flex items-center justify-center text-[#064E6B] mb-4 shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-[#0E1F35] tracking-tight uppercase">Log In</h3>
                      <p className="text-xs text-[#064E6B]/80 mt-1 font-bold tracking-wide uppercase font-sans">Returning Workspace User</p>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-500 pointer-events-none bg-gradient-to-b from-[#0E1F35]/5 via-transparent to-[#0E1F35]/10">
                      <span className="text-2xl sm:text-3xl font-black text-[#064E6B] tracking-tight drop-shadow-xs bg-white/45 px-6 py-3.5 rounded-full border border-white/60 shadow-xs">
                        "we know each other"
                      </span>
                      <span className="mt-4 bg-[#0E1F35] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-md">
                        Click to Log in
                      </span>
                    </div>
                  </div>
                )}

                {/* Inner Content */}
                <div className={`transition-all duration-500 flex flex-col justify-between h-full ${
                  activeCard !== 'login' ? 'blur-[1.5px] pointer-events-none opacity-40' : ''
                }`}>
                  {activeCard === 'login' && (
                    <div className="flex justify-end mb-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCard(null);
                        }}
                        className="text-[10px] text-slate-600 hover:text-[#064E6B] font-extrabold uppercase tracking-wider flex items-center gap-1 bg-white/80 py-1 px-3 rounded-full hover:bg-white shadow-xs cursor-pointer transition-colors"
                      >
                        ← Change options
                      </button>
                    </div>
                  )}
                
                  <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
                    <h2 className="text-[#064E6B] text-3xl font-bold tracking-tight text-center mb-8">
                      Log in
                    </h2>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[#0E1F35] text-xs font-extrabold block pl-1 tracking-wide uppercase">
                        Email
                      </label>
                      <div className="relative w-full bg-white rounded-full flex items-center shadow-sm">
                        <div className="absolute left-4.5 text-[#0E1F35]/70">
                          <Mail className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-12 pr-5 py-3.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#0E1F35]/30"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[#0E1F35] text-xs font-extrabold block pl-1 tracking-wide uppercase">
                        Password
                      </label>
                      <div className="relative w-full bg-white rounded-full flex items-center shadow-sm">
                        <div className="absolute left-4.5 text-[#0E1F35]/70">
                          <Lock className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-semibold pl-12 pr-12 py-3.5 rounded-full text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#0E1F35]/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4.5 text-[#0E1F35]/70 hover:text-[#064E6B] transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Extra row: Remember me & Forgot Password */}
                    <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#0E1F35] px-1 font-extrabold">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-[#0E1F35]/40 text-[#064E6B] focus:ring-[#0E1F35]/45 w-3.5 h-3.5"
                        />
                        <span>Remember me</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => triggerFeedback('Password restoration link dispatched to your device profile!', 'info')}
                        className="hover:underline hover:text-[#064E6B]"
                      >
                        Forgot your password
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-[#064E6B] hover:bg-[#043C53] text-white font-extrabold text-xs sm:text-sm rounded-full tracking-widest uppercase transition-all shadow hover:shadow-md cursor-pointer mt-8 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Log in
                    </button>

                    {/* OR Divider */}
                    <div className="text-center py-1 select-none">
                      <span className="text-[#0E1F35] text-xs font-black tracking-widest">-OR-</span>
                    </div>

                    {/* Log in with Google */}
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-[#064E6B] rounded-full hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.81-4.53-5.84-4.53z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Log in with google</span>
                    </button>
                  </form>

                  {/* Account Switch footer link */}
                  <div className="text-center pt-8 border-t border-[#0E1F35]/20 mt-6 text-xs text-slate-700 font-bold">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCard('signup');
                      }}
                      className="text-[#064E6B] hover:underline font-extrabold cursor-pointer"
                    >
                      Register here!
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </>
      )}

      {/* Under Section Footer Notes with matching design layout of screenshot */}
      <div className="max-w-6xl mx-auto w-full mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 select-none border-t border-slate-300">
        
        {/* Left decoration: Experience statement + Custom House/Angle Arrow symbol */}
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h4 className="text-xl sm:text-2.5xl font-black text-[#0E1F35] tracking-tight leading-none uppercase">
              Last 13+ Years Of
            </h4>
            <span className="text-lg sm:text-xl font-bold text-[#0E1F35] tracking-tight mt-1 inline-block uppercase">
              Real-estate Experience
            </span>
          </div>

          {/* SVG Custom Upward Caret/House silhouette arrow representing image */}
          <div className="w-14 h-14 relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#0E1F35] stroke-current stroke-[4]" fill="none">
              {/* High pitched roofline pointing up and right */}
              <line x1="10" y1="90" x2="10" y2="20" />
              <line x1="10" y1="20" x2="80" y2="20" />
              {/* Diagonal connecting pointer line */}
              <path d="M 20 80 L 80 20 M 60 20 L 80 20 L 80 40" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right decoration: T & C applies in red bold print */}
        <div className="shrink-0">
          <span className="text-[#FF0101] text-3xl sm:text-4xl font-extrabold uppercase tracking-widest block">
            T & C applies
          </span>
        </div>

      </div>

    </div>
  );
}
