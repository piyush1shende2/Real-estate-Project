import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
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
  Trash2,
  FileCheck,
  ShieldCheck,
  PhoneCall,
  X,
  Sparkle,
  Layers,
  Home,
  Check,
  HelpCircle,
  Award,
  BookOpen,
  Play,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Compass,
  Eye,
  RotateCw,
  Info,
  Map,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { TabType } from '../types';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import PannellumViewer from './PannellumViewer';
import { getAccessToken, googleSignIn } from '../workspaceAuth';

// @ts-ignore
import shortKitchen from '../assets/images/short_kitchen_1779773504811.png';
// @ts-ignore
import shortApartment from '../assets/images/short_apartment_1779773524780.png';
// @ts-ignore
import shortLivingRoom from '../assets/images/short_livingroom_1779773542457.png';
// @ts-ignore
import shortNewlyTiled from '../assets/images/short_newlytiled_1779773561768.png';
// @ts-ignore
import panoLivingRoom from '../assets/images/pano_living_room_1779773888535.png';
// @ts-ignore
import panoBedroom from '../assets/images/pano_bedroom_1779773910544.png';
import AdsSection from './AdsSection';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';


const getDirectionLabel = (offset: number) => {
  const degrees = (offset / 100) * 360;
  if (degrees >= 337.5 || degrees < 22.5) return 'N (North)';
  if (degrees >= 22.5 && degrees < 67.5) return 'NE (North-East)';
  if (degrees >= 67.5 && degrees < 112.5) return 'E (East)';
  if (degrees >= 112.5 && degrees < 157.5) return 'SE (South-East)';
  if (degrees >= 157.5 && degrees < 202.5) return 'S (South)';
  if (degrees >= 202.5 && degrees < 247.5) return 'SW (South-West)';
  if (degrees >= 247.5 && degrees < 292.5) return 'W (West)';
  return 'NW (North-West)';
};

const HOTSPOTS = {
  living: [
    { id: 'l1', name: 'Premium Sofa Set', desc: 'Custom high-comfort L-shaped 5-seater sofa set with matching accent cushions. Condition is immaculate, professionally vacuum-cleaned weekly.', x: 18, y: 56 },
    { id: 'l2', name: 'Fibre Connection Hub', desc: 'Pre-installed high-speed optical fiber router mounting ready to host active connections up to 1Gbps with no cabling drilling required.', x: 45, y: 42 },
    { id: 'l3', name: 'Fresh Indoor Planter', desc: 'Tall leafy snake plant container enhancing oxygen circulation. Provided by the direct owner to retain ambient natural vibes.', x: 72, y: 46 },
    { id: 'l4', name: 'Italian Vitrified Tiles', desc: 'Lustrous, premium heat-insulating double charged vitrified floor tiles with sleek cement grouting.', x: 38, y: 78 }
  ],
  bedroom: [
    { id: 'b1', name: 'Solid Teak Wood Bed', desc: 'Premium hand-finished double-bed with spacious underbed storage drawers and high-density orthopedic memory foam mattress.', x: 12, y: 60 },
    { id: 'b2', name: 'Sleek Sliding Wardrobe', desc: 'Full length 3-door wooden cupboard with soft-close sliding rails, internal safety secure locker, and integrated vanity mirror.', x: 52, y: 38 },
    { id: 'b3', name: 'Pre-Installed Dual AC', desc: 'High energy-efficient 5-star split air conditioner with instant cooling turbo mode. Whisper quiet operation.', x: 80, y: 25 },
    { id: 'b4', name: 'Ambient Sconce Light', desc: 'Dimmable mood wall light fixture generating cozy hotel-room-style gold night rays.', x: 34, y: 28 }
  ]
};

interface RentViewProps {
  onBackToHome: () => void;
  onPropertyClick?: (id: string) => void;
  onTabChange?: (tab: TabType) => void;
}

export interface RentListing {
  id: string;
  title: string;
  bhk: string;
  price: string;
  numericPrice: number;
  deposit: string;
  city: string;
  locality: string;
  area: string;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  tenantPreference: 'Bachelors' | 'Families' | 'No Preference';
  availableFrom: string;
  image: string;
  features: string[];
  ownerName: string;
  ownerContact: string;
  verified: boolean;
  electricityMeterStatus: 'Independent Meter' | 'Shared Meter';
  waterSupply: '24/7 NMC Supply' | 'Borewell & Corporation Hybrid';
  details: string;
}

// Curated authentic rental property mock data reflecting real property markets in Raipur and other tier-1/2 cities in India
const POPULAR_RENTALS: RentListing[] = [
  {
    id: 'rent-1',
    title: '2 BHK Premium Apartment',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000 (2 Months)',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,250 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Modular Kitchen', 'Reserved Car Parking', 'Power Backup', '24/7 Security Desk'],
    ownerName: 'Subhash Chandra Rathore',
    ownerContact: '+91 98930 11422',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Spacious 2 BHK on middle floor with individual utility balcony facing VIP Road garden belt. Ideal for professional families, clean layout with complete marble flooring.'
  },
  {
    id: 'rent-2',
    title: '2 BHK Standard Flat',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 20,000',
    city: 'Raipur',
    locality: 'Mowa Landmark Sector, near Ambuja Mall',
    area: '1,100 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['Lift Facility', 'Water Purifier', 'Wardrobes Installed', 'Intercom Security'],
    ownerName: 'Vikas Dubey',
    ownerContact: '+91 70008 41253',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Standard residential flat with fantastic natural venting, located right behind Raipur Ring Road. Excellent connectivity to core commercial markets.'
  },
  {
    id: 'rent-3',
    title: '2 BHK High-Rise Flat',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 25,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '1,150 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    features: ['High Speed Lift', 'Underground Parking', 'Kids Play Zone', 'Solar Grid Lighting'],
    ownerName: 'Shrikant Deshpande',
    ownerContact: '+91 94228 09455',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Gated society high-rise flat on 8th floor. Safe community with CCTV monitoring and private parking slot matching professional standards.'
  },
  {
    id: 'rent-4',
    title: '2 BHK Comfort Living',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Raipur',
    locality: 'Tatibandh Institutional Link',
    area: '1,180 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['Double Bed & Sofa', 'AC in Master Room', 'LED TV Screen', 'Double Door Fridge'],
    ownerName: 'Mahendra Verma',
    ownerContact: '+91 98271 27811',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Fully furnished 2 BHK apartment curated for doctors/AIIMS scholars. Completely clean tile finish, premium washroom settings, secure society bounds.'
  },
  {
    id: 'rent-5',
    title: '2 BHK Modern Residency',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 12,000 (1 Month)',
    city: 'Raipur',
    locality: 'Amlidih Elite Lane, New Rajendra Nagar',
    area: '1,220 sqft',
    furnishing: 'Unfurnished',
    tenantPreference: 'Families',
    availableFrom: 'From next week',
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812f4c?auto=format&fit=crop&w=600&q=80',
    features: ['Secured Compound', 'Separate Water Tank', 'Modular Kitchen Prefit', 'Fans/LED Bulbs'],
    ownerName: 'Girish Agrawal',
    ownerContact: '+91 77142 99081',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Freshly repainted spacious house unit. Low maintenance protocols, independent entrance route, complete Vaastu compliance.'
  },
  {
    id: 'rent-6',
    title: '3 BHK Executive Mansion',
    bhk: '3 BHK',
    price: '₹ 22k /Month',
    numericPrice: 22000,
    deposit: '₹ 50,000',
    city: 'Bengaluru',
    locality: 'Whitefield IT Row, Outer Gate',
    area: '1,750 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    features: ['Premium Club Access', 'Washing Machine', 'Smart Oven Unit', 'Covered Parking Block'],
    ownerName: 'Priya Narayanan',
    ownerContact: '+91 98450 33241',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Stately 3 BHK with bespoke interior designs inside premium gated township. Genuinely luxurious, includes water softener utility system.'
  },
  {
    id: 'rent-7',
    title: '1 BHK Smart Studio',
    bhk: '1 BHK',
    price: '₹ 8k /Month',
    numericPrice: 8000,
    deposit: '₹ 15,000',
    city: 'Nagpur',
    locality: 'Manish Nagar Crossing, Wardha Road',
    area: '620 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Wifi Broadband Prefit', 'Exhaust Fan array', 'Geyser in Bathroom', 'Two-Wheeler Slot'],
    ownerName: 'Anand Deshmukh',
    ownerContact: '+91 88884 10092',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'An ideal smart bachelor pad setup. Extremely near Metro lines, grocery delivery zones and medical shops.'
  },
  {
    id: 'rent-8',
    title: '3 BHK High-End Penthouse',
    bhk: '3 BHK',
    price: '₹ 35k /Month',
    numericPrice: 35000,
    deposit: '₹ 1.0 Lac',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '1,800 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80',
    features: ['Panoramic Balcony', 'High Ceiling Interior', 'Integrated Home Automation', 'Dedicated Helipad Visuals'],
    ownerName: 'Pranav Malhotra',
    ownerContact: '+91 98200 48211',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Experience fine living by Lake Powai. Ultra-luxury fitting, designer woodwork cabinets, fully automated curtains/light climate array.'
  },
  {
    id: 'rent-9',
    title: '2 BHK Cozy Garden Flat',
    bhk: '2 BHK',
    price: '₹ 14k /Month',
    numericPrice: 14000,
    deposit: '₹ 28,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '1,280 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['Private Garden Yard', 'Covered Parking Slot', 'Paved Jogging Tracks', 'Modular Sink Area'],
    ownerName: 'Rajeev Shinde',
    ownerContact: '+91 96541 33200',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Beautifully kept floor with modular security grids. High aesthetic greenery right out the spacious window frame.'
  },
  {
    id: 'rent-10',
    title: '3 BHK Premium Corner Flat',
    bhk: '3 BHK',
    price: '₹ 18k /Month',
    numericPrice: 18000,
    deposit: '₹ 40,000',
    city: 'Raipur',
    locality: 'Vidhan Sabha Road, Devendra Nagar',
    area: '1,680 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Water Treatment System', 'Intercom Security Network', '2 Master Bedrooms', 'Vastu Aligned Gateway'],
    ownerName: 'Sanjay Mishra',
    ownerContact: '+91 97555 42354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Spacious corner flat capturing extensive natural breeze. Built inside a small, selective luxury residential block with zero loud noise nuisances.'
  },
  {
    id: 'rent-11',
    title: '2 BHK Modern Vista Apartment',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,200 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['Modular Storage', 'Covered Car parking', 'Video Door Phone', 'Piped Gas line prefit'],
    ownerName: 'Ramesh Verma',
    ownerContact: '+91 94252 01823',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Impeccable corner 2 BHK in gated society on VIP Road corridor. Built with premium construction materials and equipped with dual balconies for continuous cross ventilation.'
  },
  {
    id: 'rent-12',
    title: '1 BHK Cozy Corporate Hive',
    bhk: '1 BHK',
    price: '₹ 9k /Month',
    numericPrice: 9000,
    deposit: '₹ 18,000',
    city: 'Raipur',
    locality: 'Devendra Nagar Commercial Belt',
    area: '680 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=600&q=80',
    features: ['High-speed internet router', 'Kitchenette setup', 'Modular wardrobes', '24/7 guard setup'],
    ownerName: 'Vandana Tiwari',
    ownerContact: '+91 77140 12845',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Designed for single corporate workers/students. High privacy index with personal lift access, and modular kitchen appliances.'
  },
  {
    id: 'rent-13',
    title: '3 BHK Signature Grande Row',
    bhk: '3 BHK',
    price: '₹ 28k /Month',
    numericPrice: 28000,
    deposit: '₹ 60,000',
    city: 'Nagpur',
    locality: 'Wardha Road Premium Extension',
    area: '1,850 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Next Month',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    features: ['Independent swimming pool access', 'Dedicated private double garage', 'Personal gym setup', 'Full backup generator'],
    ownerName: 'Rajesh Deshmukh',
    ownerContact: '+91 98935 01024',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Bespoke independent row villa with landscaped lawn inside signature gated luxury community near Nagpur Metro Corridor. Genuinely exclusive layout.'
  },
  {
    id: 'rent-14',
    title: '2 BHK Garden-Facing Oasis',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Raipur',
    locality: 'Mowa Landmark Sector',
    area: '1,150 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    features: ['Dedicated jogging park access', 'Central security desk link', 'Pre-installed RO water purifier', 'French windows'],
    ownerName: 'Sanjay Chawla',
    ownerContact: '+91 93012 34509',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Peaceful second-floor dwelling directly overlooking the community public garden. Minimal noise pollution with double-paned heavy sound isolation.'
  },
  {
    id: 'rent-15',
    title: '2 BHK Smart Value Flat',
    bhk: '2 BHK',
    price: '₹ 11k /Month',
    numericPrice: 11000,
    deposit: '₹ 11,000',
    city: 'Raipur',
    locality: 'Tatibandh Institutional Link',
    area: '1,050 sqft',
    furnishing: 'Unfurnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['Water connection bypass valve', 'LED energy-saving lighting', 'Spacious laundry room', 'Elevator backups'],
    ownerName: 'Hemant Lalwani',
    ownerContact: '+91 88891 22334',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Highly affordable 2 BHK situated right on the Institutional Ring road, close to medical coaching centers, hospitals and central markets.'
  },
  {
    id: 'rent-16',
    title: '1 BHK Quiet Corner Ground Floor',
    bhk: '1 BHK',
    price: '₹ 7k /Month',
    numericPrice: 7000,
    deposit: '₹ 14,000',
    city: 'Raipur',
    locality: 'Amlidih Elite Lane, New Rajendra Nagar',
    area: '550 sqft',
    furnishing: 'Unfurnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
    features: ['Independent entry door', 'Safety grills all sides', '24 hours water line', 'Two wheeler parking slot'],
    ownerName: 'Devendra Chandrakar',
    ownerContact: '+91 94060 11211',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Cozy and very budget-friendly ground floor flat with total independence. Perfect for individuals or postgraduate students working in VIP road corridor.'
  },
  {
    id: 'rent-17',
    title: '2 BHK Sunlit Modern Flat',
    bhk: '2 BHK',
    price: '₹ 13k /Month',
    numericPrice: 13000,
    deposit: '₹ 26,000',
    city: 'Raipur',
    locality: 'Devendra Nagar Commercial Belt',
    area: '1,150 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&w=600&q=80',
    features: ['Vastu compliant layout', 'Premium Vitrified Tiles', 'Dual balconies', 'Underground water sump'],
    ownerName: 'Preeti Deshmukh',
    ownerContact: '+91 91118 40223',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'A lovely eastern-facing flat capturing magnificent morning light. Close to premier English-medium schools and municipal parks, nestled in a peaceful family neighborhood.'
  },
  {
    id: 'rent-18',
    title: '3 BHK Royal Elite Suite',
    bhk: '3 BHK',
    price: '₹ 20k /Month',
    numericPrice: 20000,
    deposit: '₹ 40,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,650 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    features: ['Smart LED television unit', 'Split AC units in 2 rooms', 'Chimney equipped kitchen', 'Round the clock CCTV'],
    ownerName: 'Kuldeep Singh Sodhi',
    ownerContact: '+91 98931 00392',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Luxury high-end 3 BHK on VIP Road. Beautiful wood paneling, premium quality sofas and dinette pre-installed. Zero pending society dues.'
  },
  {
    id: 'rent-19',
    title: '2 BHK Metro-Link Comfort',
    bhk: '2 BHK',
    price: '₹ 11k /Month',
    numericPrice: 11000,
    deposit: '₹ 22,000',
    city: 'Nagpur',
    locality: 'Manish Nagar Crossing, Wardha Road',
    area: '1,020 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    features: ['Covered Bike Park', 'Modular wood wardrobes', 'Geyser installed bath', 'Dry wash balcony set'],
    ownerName: 'Aashish Golhar',
    ownerContact: '+91 71225 90123',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Excellent flat with superb cross-ventilation, merely 400 meters away from the metro transit station. Ideal for young IT professionals traveling towards solar grid zones.'
  },
  {
    id: 'rent-20',
    title: '3 BHK Besa Valley Vista',
    bhk: '3 BHK',
    price: '₹ 16k /Month',
    numericPrice: 16000,
    deposit: '₹ 32,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '1,480 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80',
    features: ['Rooftop yoga area access', 'Lift power backup generator', 'Integrated storm drains', 'Anti-skid balcony tiling'],
    ownerName: 'Milind Pande',
    ownerContact: '+91 94221 44552',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Spacious 3 BHK apartment with private master terrace offering a calm view. High security gated perimeter, child-safe window grills and high-speed elevator.'
  },
  {
    id: 'rent-21',
    title: '1 BHK Tech-Park Executive Studio',
    bhk: '1 BHK',
    price: '₹ 18k /Month',
    numericPrice: 18000,
    deposit: '₹ 50,000',
    city: 'Bengaluru',
    locality: 'Whitefield IT Row, Outer Gate',
    area: '650 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    features: ['Ultrafast optical fiber', 'Smart locking setup', 'Microwave oven preinstalled', 'Washing machine unit'],
    ownerName: 'Ranganath Swamy',
    ownerContact: '+91 98440 21453',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Ultimate modern tech setup with ergonomic office-chair, smart home automated lights and super high privacy controls. Located in core tech park neighborhood.'
  },
  {
    id: 'rent-22',
    title: '2 BHK Premium Koramangala Nest',
    bhk: '2 BHK',
    price: '₹ 25k /Month',
    numericPrice: 25000,
    deposit: '₹ 75,000',
    city: 'Bengaluru',
    locality: 'Koramangala Green Block',
    area: '1,200 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['In-house waste composting', 'Reserved hydraulic parking', 'Terrace community room', 'RO drinking water tap'],
    ownerName: 'Balan Nair',
    ownerContact: '+91 98860 30588',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Luxury flat with wooden floor look, premium bath setups and modern modular kitchen pre-filled. Placed right inside the iconic green avenues of Koramangala block.'
  },
  {
    id: 'rent-23',
    title: '3 BHK High-Street Luxury Flat',
    bhk: '3 BHK',
    price: '₹ 30k /Month',
    numericPrice: 30000,
    deposit: '₹ 90,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '1,650 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'From next week',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=600&q=80',
    features: ['Double door refrigerator', 'Inverter battery setup', 'Exclusive terrace deck', '24/7 armed securities'],
    ownerName: 'Shashank Kulkarni',
    ownerContact: '+91 95455 12580',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'A true majestic residential space for high-end executives or families. Features designer Italian tiles, sound-proof windows and exclusive gated enclave setup.'
  },
  {
    id: 'rent-24',
    title: '1 BHK Lakeside Compact Studio',
    bhk: '1 BHK',
    price: '₹ 22k /Month',
    numericPrice: 22000,
    deposit: '₹ 60,000',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '500 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    features: ['Intercom dynamic check', 'Central laundry service', 'Integrated modular gas pipeline', 'Duct AC vent'],
    ownerName: 'Vikram Mehta',
    ownerContact: '+91 98201 55923',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Compact smart studio flat with lovely lake breeze. Built in top luxury high-rise featuring high-end gym access and high degree perimeter security.'
  },
  {
    id: 'rent-25',
    title: '2 BHK Premium Boulevard View',
    bhk: '2 BHK',
    price: '₹ 32k /Month',
    numericPrice: 32000,
    deposit: '₹ 1.0 Lac',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '980 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['French main patio glass', 'Underground dual parking', 'Heat detector security alarm', 'Modular dry kitchen'],
    ownerName: 'Amit Saxena',
    ownerContact: '+91 99300 48431',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Luxury premium flat built overlooking Powai boulevard parkways. Comes with state-of-the-art washrooms, safety glass grids and centralized security desk.'
  },
  {
    id: 'rent-26',
    title: '2 BHK Shankar Nagar Oasis',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,120 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Exquisite modular woodwork', 'NMC water connection independent', 'Power backup for ceiling fans', 'Private dry yard'],
    ownerName: 'Dileep Sahu',
    ownerContact: '+91 98933 55191',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Located close to Shankar Nagar sports ground. It possesses high ceiling rooms, durable vitrified finish, and absolute assurance of elite security.'
  },
  {
    id: 'rent-27',
    title: '3 BHK Mowa Spacious Suite',
    bhk: '3 BHK',
    price: '₹ 18k /Month',
    numericPrice: 18000,
    deposit: '₹ 36,000',
    city: 'Raipur',
    locality: 'Mowa Landmark Sector, near Ambuja Mall',
    area: '1,550 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Three functional balconies', 'Modular wardrobes in 2 rooms', 'Dedicated RO water filter', 'Lobby security guard'],
    ownerName: 'Arvind Dewangan',
    ownerContact: '+91 70002 99988',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Very airy apartment with dedicated parking bay. High ceiling height and modular shelves pre-arranged, offering peaceful neighborhood vistas.'
  },
  {
    id: 'rent-28',
    title: '1 BHK Student Friendly Flat',
    bhk: '1 BHK',
    price: '₹ 8k /Month',
    numericPrice: 8000,
    deposit: '₹ 16,000',
    city: 'Raipur',
    locality: 'Tatibandh Institutional Link',
    area: '600 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Study desk & storage racks', 'Exhaust vent system', 'Covered bike parking', 'CCTV secure lobby'],
    ownerName: 'Santosh Chandrakar',
    ownerContact: '+91 94255 12512',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Highly convenient layout tailored for students, researchers or medical trainees at AIIMS. Features minimal maintenance overhead and serene work ambience.'
  },
  {
    id: 'rent-29',
    title: '2 BHK Besa heights Budget Flat',
    bhk: '2 BHK',
    price: '₹ 10k /Month',
    numericPrice: 10000,
    deposit: '₹ 20,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '1,050 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['High speed elevator backup', 'Rainwater harvesting unit', 'Solar corridor lighting', 'CCTV monitoring'],
    ownerName: 'Uday Sontakke',
    ownerContact: '+91 94225 18602',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Superb pocket-friendly 2 BHK inside Besa gated residency. Standard tile work, pre-fitted kitchen exhaust fans, and designated vehicle parking.'
  },
  {
    id: 'rent-30',
    title: '3 BHK Manish Nagar Premier',
    bhk: '3 BHK',
    price: '₹ 17k /Month',
    numericPrice: 17000,
    deposit: '₹ 34,000',
    city: 'Nagpur',
    locality: 'Manish Nagar Crossing, Wardha Road',
    area: '1,500 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    features: ['Elegant false ceilings', 'Video access control door', 'Solar geyser hot water line', 'Basement car storage'],
    ownerName: 'Nitin Gadkari Senior',
    ownerContact: '+91 71224 88771',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Spacious residential layout with double balcony facing main avenue. Highly secure society gated bounds with robust watchman shift protocols.'
  },
  {
    id: 'rent-31',
    title: '2 BHK Whitefield Cozy Flat',
    bhk: '2 BHK',
    price: '₹ 23k /Month',
    numericPrice: 23000,
    deposit: '₹ 60,000',
    city: 'Bengaluru',
    locality: 'Whitefield IT Row, Outer Gate',
    area: '1,120 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    features: ['Dedicated high bandwidth setup', 'Vastu north entry layout', 'Gym and track access', 'Piped cooking gas line'],
    ownerName: 'Muralidhar Rao',
    ownerContact: '+91 98455 01223',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'A clean residential unit tailored for corporate couples. Quiet layout with proper waste management, zero water scarcity and continuous tech backups.'
  },
  {
    id: 'rent-32',
    title: '3 BHK Majestic Koramangala Green',
    bhk: '3 BHK',
    price: '₹ 38k /Month',
    numericPrice: 38000,
    deposit: '₹ 1.2 Lac',
    city: 'Bengaluru',
    locality: 'Koramangala Green Block',
    area: '1,780 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1545464693-f1798a373343?auto=format&fit=crop&w=600&q=80',
    features: ['Top-spec teak woodwork', 'Three master washrooms', 'Terrace garden permission', 'Gated multi-car garage'],
    ownerName: 'Gopinathan Swamy',
    ownerContact: '+91 99002 44558',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Ultra grand 3 BHK displaying bespoke mahogany wardrobes and standard smart air conditioners. Nestled inside a highly quiet elite residential lane.'
  },
  {
    id: 'rent-33',
    title: '1 BHK Koregaon Plaza Studio',
    bhk: '1 BHK',
    price: '₹ 15k /Month',
    numericPrice: 15000,
    deposit: '₹ 30,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '620 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=600&q=80',
    features: ['Sleek modular dinette set', 'Washing machine system', 'RO filtered water line', 'Superb rooftop view deck'],
    ownerName: 'Sunita Ranade',
    ownerContact: '+91 91580 23412',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Designed with a premium minimalist touch. Fast access to the commercial zone while retaining scenic tree-lined privacy.'
  },
  {
    id: 'rent-34',
    title: '2 BHK Koregaon Park Premium Flat',
    bhk: '2 BHK',
    price: '₹ 22k /Month',
    numericPrice: 22000,
    deposit: '₹ 50,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '1,180 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812f4c?auto=format&fit=crop&w=600&q=80',
    features: ['Anti-graffiti wall paint', 'Water recycle utility setup', 'Independent NMC meter', 'Ample lift elevators'],
    ownerName: 'Milind Deore',
    ownerContact: '+91 96231 44556',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Splendid flat inside a boutique gated residency. Enjoy beautiful natural light throughout the daytime and high degree safety gates.'
  },
  {
    id: 'rent-35',
    title: '3 BHK Powai Heights Penthouse',
    bhk: '3 BHK',
    price: '₹ 48k /Month',
    numericPrice: 48000,
    deposit: '₹ 1.5 Lac',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '1,720 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Sky terrace access portal', 'Personalized entrance lift', 'Central air handling unit', 'Smart audio automation'],
    ownerName: 'Siddharth Roy Kapoor',
    ownerContact: '+91 99200 11455',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Live at the absolute zenith of luxury. Complete panorama of lake, private wooden patio tiles, high-grade bathroom hardware, and round-the-clock butler desk options.'
  },
  {
    id: 'rent-36',
    title: '1 BHK Shankar Nagar Cozy Hub',
    bhk: '1 BHK',
    price: '₹ 7.5k /Month',
    numericPrice: 7500,
    deposit: '₹ 15,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '580 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
    features: ['Geyser installed in bathroom', 'Premium vitrified flooring', 'Two-wheeler covered bay', '24/7 gate caretaker'],
    ownerName: 'Nilesh Mishra',
    ownerContact: '+91 94252 00192',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Fabulous first-floor studio apartment for working professionals or young interns. Highly secure family safe society bounds, close to premium dining hubs.'
  },
  {
    id: 'rent-37',
    title: '2 BHK Amlidih Comfort Suite',
    bhk: '2 BHK',
    price: '₹ 11k /Month',
    numericPrice: 11000,
    deposit: '₹ 22,000',
    city: 'Raipur',
    locality: 'Amlidih Elite Lane, New Rajendra Nagar',
    area: '1,080 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['Pre-fitted wardrobes', 'Modular kitchen cabinets', 'Independent water control', 'CCTV monitoring'],
    ownerName: 'Shyamlal Sahu',
    ownerContact: '+91 77142 88451',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Freshly scrubbed and painted 2 BHK. Possesses clean tiled flooring, private parking spot, and is located in high-demand residential blocks of Amlidih.'
  },
  {
    id: 'rent-38',
    title: '3 BHK Devendra Nagar High-Life',
    bhk: '3 BHK',
    price: '₹ 19k /Month',
    numericPrice: 19000,
    deposit: '₹ 38,000',
    city: 'Raipur',
    locality: 'Devendra Nagar Commercial Belt',
    area: '1,620 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['Teakwood main door entrance', 'Vastu complete layout', 'Two covered car bays', 'Solar grid street-lights'],
    ownerName: 'Mahendra Agrawal',
    ownerContact: '+91 98271 44588',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Elite residential construction with top-tier modular setups. Enjoys dedicated kids park and is located directly next to premier medical facilities.'
  },
  {
    id: 'rent-39',
    title: '1 BHK Besa Heights Studio',
    bhk: '1 BHK',
    price: '₹ 6.5k /Month',
    numericPrice: 6500,
    deposit: '₹ 12,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '540 sqft',
    furnishing: 'Unfurnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['Water purification tap', 'Separate electric bills', 'Independent entrance lobby', 'Secure gate codes'],
    ownerName: 'Girish Deshpande',
    ownerContact: '+91 94228 11442',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'A clean and budget-friendly smart ground floor flat. Highly safe for students or working bachelors seeking peace of mind.'
  },
  {
    id: 'rent-40',
    title: '2 BHK Wardha Road High-Rise Flat',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '1,120 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    features: ['High speed premium lift', 'Children playing sandpit', 'Solar grid power backup', 'Fire suppression valves'],
    ownerName: 'Sanjay Kolhe',
    ownerContact: '+91 98503 14522',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Superb 2 BHK flat on the 5th floor. Fully air-flowing design with customized kitchen cabinets, close to outer ring connector road.'
  },
  {
    id: 'rent-41',
    title: '3 BHK Besa heights Elite Mansion',
    bhk: '3 BHK',
    price: '₹ 15k /Month',
    numericPrice: 15000,
    deposit: '₹ 30,000',
    city: 'Nagpur',
    locality: 'Besa Heights, Wardha Road',
    area: '1,450 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&w=600&q=80',
    features: ['Inverter backup installation', 'Lift access system', 'Intercom connected security', 'Starlight terrace area'],
    ownerName: 'Vijay Dandige',
    ownerContact: '+91 93731 22334',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Highly spacious and brand new 3 BHK flat. Quiet layout with pristine marble finishes, dual balconies, and fully secured premises.'
  },
  {
    id: 'rent-42',
    title: '3 BHK Whitefield Signature Mansion',
    bhk: '3 BHK',
    price: '₹ 30k /Month',
    numericPrice: 30000,
    deposit: '₹ 90,000',
    city: 'Bengaluru',
    locality: 'Whitefield IT Row, Outer Gate',
    area: '1,680 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Community swimming facility', 'Dedicated walking tracks', 'Solar boiler power', 'CCTV secure lobby'],
    ownerName: 'Prashastha Reddy',
    ownerContact: '+91 98450 11221',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Exclusive elite gated apartment. Fitted with modern false ceilings, dual-car parking spaces and robust waste disposal system.'
  },
  {
    id: 'rent-43',
    title: '1 BHK Koramangala Smart Pad',
    bhk: '1 BHK',
    price: '₹ 16k /Month',
    numericPrice: 16000,
    deposit: '₹ 45,000',
    city: 'Bengaluru',
    locality: 'Koramangala Green Block',
    area: '620 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Ultrafast optic fiber setup', 'Smart modular closet', 'Rainwater tap preinstalled', 'Bike parking slot'],
    ownerName: 'Prasanna Kumar',
    ownerContact: '+91 98860 11220',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'Cozy and premium bachelor flat. Very near to highly rated coffee shops, food joints and IT shuttle stations.'
  },
  {
    id: 'rent-44',
    title: '2 BHK Whitefield Premium Studio',
    bhk: '2 BHK',
    price: '₹ 22k /Month',
    numericPrice: 22000,
    deposit: '₹ 60,000',
    city: 'Bengaluru',
    locality: 'Whitefield IT Row, Outer Gate',
    area: '1,180 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Smart LED wall module', 'Microwave and stove prefit', 'Premium washing setup', 'Basement car storage'],
    ownerName: 'Subramanya Sastry',
    ownerContact: '+91 99001 22354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Fully furnished, high-fidelity elite flat. Ready for immediate move-in, including standard smart home setups and premium layout.'
  },
  {
    id: 'rent-45',
    title: '3 BHK Koregaon Royal Mansion',
    bhk: '3 BHK',
    price: '₹ 35k /Month',
    numericPrice: 35000,
    deposit: '₹ 1.0 Lac',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '1,750 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    features: ['Teak wood modular styling', 'RO system preinstalled', 'Gym and clubhouse access', 'Independent storage block'],
    ownerName: 'Vijay Devrukhkar',
    ownerContact: '+91 95451 11224',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Top floor pent-style apartment with massive views of Pune green belt corridors. Standard safety systems and fully modern interiors.'
  },
  {
    id: 'rent-46',
    title: '1 BHK Koregaon Park Smart Studio',
    bhk: '1 BHK',
    price: '₹ 14k /Month',
    numericPrice: 14000,
    deposit: '₹ 30,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '590 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
    features: ['Double bed pre-fit options', 'Integrated gas pipeline', 'High speed fiber router', 'CCTV entry codes'],
    ownerName: 'Kishor Patwardhan',
    ownerContact: '+91 91580 11422',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'A clean and smart bachelor setup located in close vicinity to tech parks. Ultra peaceful community with high security indexes.'
  },
  {
    id: 'rent-47',
    title: '2 BHK Koregaon Park Comfort Plaza',
    bhk: '2 BHK',
    price: '₹ 21k /Month',
    numericPrice: 21000,
    deposit: '₹ 45,000',
    city: 'Pune',
    locality: 'Koregaon Park Green Line',
    area: '1,140 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['Fully fitted AC units', 'Water softener utility line', 'Premium washing module', 'Ample lift elevator'],
    ownerName: 'Abhijit Gokhale',
    ownerContact: '+91 96231 22354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Fabulous fully-furnished 2 BHK. Possesses designer wooden cabinets and a delightful dual balcony pre-fit.'
  },
  {
    id: 'rent-48',
    title: '1 BHK Powai lakeside Executive Flat',
    bhk: '1 BHK',
    price: '₹ 23k /Month',
    numericPrice: 23000,
    deposit: '₹ 60,000',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '520 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    features: ['Digital locking security', 'Optical internet setups', 'Smart kitchen counter', 'RO drinking water'],
    ownerName: 'Ramesh Jhunjhunwala',
    ownerContact: '+91 98200 44521',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Gorgeous and cozy smart flat inside premium apartment block. Highly secure gated enclaves with quick access to corporate centers.'
  },
  {
    id: 'rent-49',
    title: '2 BHK Powai Vista Landmark',
    bhk: '2 BHK',
    price: '₹ 36k /Month',
    numericPrice: 36000,
    deposit: '₹ 1.0 Lac',
    city: 'Mumbai',
    locality: 'Powai Lake Boulevard Side',
    area: '1,020 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Luxury leather sofa prefit', 'Premium split dual ACs', 'Double door refrigerator', 'Covered car garage slot'],
    ownerName: 'Dinesh Karthik Senior',
    ownerContact: '+91 99300 11451',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Bespoke corporate living flat overlooking Powai lake. Possesses fine layout patterns, robust security checks and premium modular wardrobes.'
  },
  {
    id: 'rent-50',
    title: '3 BHK VIP Road Luxury Heritage',
    bhk: '3 BHK',
    price: '₹ 23k /Month',
    numericPrice: 23000,
    deposit: '₹ 46,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,720 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    features: ['Teakwood detailed entries', 'Private library block', 'Dedicated kids playing field', '24/7 armed caretaker'],
    ownerName: 'Satyajit Rathore',
    ownerContact: '+91 98930 22354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'An absolute masterpiece of construction. Top-tier marble layouts, beautifully styled independent entrance yard and absolute safety standard enclaves.'
  },
  {
    id: 'rent-51',
    title: '2 BHK Tatibandh Classic Comfort',
    bhk: '2 BHK',
    price: '₹ 12k /Month',
    numericPrice: 12000,
    deposit: '₹ 24,000',
    city: 'Raipur',
    locality: 'Tatibandh Institutional Link',
    area: '1,140 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['Modern wooden wardrobes', 'Freshly polished finishes', 'Under-slab kitchen exhaust', 'Lift facility support'],
    ownerName: 'Lalit Agrawal',
    ownerContact: '+91 98271 22334',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Located close to medical institutes and colleges. Standard residential suite featuring robust water lines, separate dynamic electric meter, and secure gates.'
  },
  {
    id: 'rent-52',
    title: '1 BHK Mowa Budget studio',
    bhk: '1 BHK',
    price: '₹ 7k /Month',
    numericPrice: 7000,
    deposit: '₹ 14,000',
    city: 'Raipur',
    locality: 'Mowa Landmark Sector, near Ambuja Mall',
    area: '560 sqft',
    furnishing: 'Unfurnished',
    tenantPreference: 'Bachelors',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['Independent security grilled door', 'Separate municipal water lines', 'Two-wheeler parking spot', 'In-lobby cameras'],
    ownerName: 'Vijay Dewangan Junior',
    ownerContact: '+91 70004 11223',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'An excellent smart living space close to major transit terminals and mall gates. Absolute privacy and minimal society maintenance parameters.'
  },
  {
    id: 'rent-53',
    title: '2 BHK Devendra Nagar Classic',
    bhk: '2 BHK',
    price: '₹ 14k /Month',
    numericPrice: 14000,
    deposit: '₹ 28,000',
    city: 'Raipur',
    locality: 'Devendra Nagar Commercial Belt',
    area: '1,180 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812f4c?auto=format&fit=crop&w=600&q=80',
    features: ['Pristine floor designs', 'Secured gated compound', 'Modular pantry setups', 'RO water Purifiers'],
    ownerName: 'Preeti Deshmukh',
    ownerContact: '+91 91118 22354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Extremely peaceful residential unit inside a elite community block. Features modular styling, pre-fit storage, and proper power lines.'
  },
  {
    id: 'rent-54',
    title: '3 BHK Shankar Nagar Premium suite',
    bhk: '3 BHK',
    price: '₹ 21k /Month',
    numericPrice: 21000,
    deposit: '₹ 45,000',
    city: 'Raipur',
    locality: 'VIP Road Corridor, Shankar Nagar',
    area: '1,680 sqft',
    furnishing: 'Fully Furnished',
    tenantPreference: 'Families',
    availableFrom: 'Immediate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Teak wood styling detailed options', 'AC preinstalled in bedrooms', 'High ceiling spacious layout', 'Dual parking bays'],
    ownerName: 'Nitin Mishra',
    ownerContact: '+91 94252 22354',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: '24/7 NMC Supply',
    details: 'Luxury executive suite curated with wooden styling wardrobes, elegant modular kitchens, and standard smart electronics. Safe for children and elderly.'
  },
  {
    id: 'rent-55',
    title: '2 BHK Manish Nagar Modern Living',
    bhk: '2 BHK',
    price: '₹ 11.5k /Month',
    numericPrice: 11500,
    deposit: '₹ 23,000',
    city: 'Nagpur',
    locality: 'Manish Nagar Crossing, Wardha Road',
    area: '1,100 sqft',
    furnishing: 'Semi-Furnished',
    tenantPreference: 'No Preference',
    availableFrom: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    features: ['Water connection bypass valves', 'Two-wheeler and car port slots', 'Lift backup systems', 'Central compound fencing'],
    ownerName: 'Subhash Golhar',
    ownerContact: '+91 71225 33451',
    verified: true,
    electricityMeterStatus: 'Independent Meter',
    waterSupply: 'Borewell & Corporation Hybrid',
    details: 'A clean and bright 2 BHK flat. Beautiful granite flooring, modular pantry, and close proximity to Metro links and hospitals.'
  }
];

export default function RentView({ onBackToHome, onPropertyClick, onTabChange }: RentViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All'); // Default selected to All Cities
  const [bhkFilter, setBhkFilter] = useState<string>('All'); // Default selected to All BHKs
  const [furnishingFilter, setFurnishingFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<'All' | 'Owner' | 'Immediate' | 'Furnished'>('All');
  
  // Advanced Vetting Filters for Rent Page (25 Criteria)
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false);
  const [activeFilterCategoryTab, setActiveFilterCategoryTab] = useState(0);

  // States for 25 Filters:
  // 1. Location Filter config
  const [rentFilterCity, setRentFilterCity] = useState<string>('All');
  const [rentFilterLocality, setRentFilterLocality] = useState<string>('');
  const [rentFilterLandmark, setRentFilterLandmark] = useState<string>('');
  const [rentFilterPincode, setRentFilterPincode] = useState<string>('');
  const [rentFilterNearMetro, setRentFilterNearMetro] = useState<boolean>(false);
  const [rentFilterNearOffice, setRentFilterNearOffice] = useState<boolean>(false);
  const [rentFilterNearCollege, setRentFilterNearCollege] = useState<boolean>(false);
  const [rentFilterNearHospital, setRentFilterNearHospital] = useState<boolean>(false);
  const [rentCommuteTime, setRentCommuteTime] = useState<string>('All'); // 'All', '15 mins', '30 mins', '45 mins'
  const [rentRadius, setRentRadius] = useState<string>('All'); // 'All', '1km', '3km', '5km'
  const [rentMapCoordinates, setRentMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // 2. Monthly Rent Filter
  const [rentPriceMin, setRentPriceMin] = useState<number | ''>('');
  const [rentPriceMax, setRentPriceMax] = useState<number | ''>('');
  const [rentPriceRangeQuick, setRentPriceRangeQuick] = useState<string>('All'); // 'All', '<5k', '5k-10k', '10k-20k', '20k-50k', '50k+'

  // 3. Security Deposit Filter
  const [rentDepositMax, setRentDepositMax] = useState<number | ''>('');
  const [rentZeroDeposit, setRentZeroDeposit] = useState<boolean>(false);

  // 4. Property Type
  const [rentPropType, setRentPropType] = useState<string>('All'); // 'All', 'Apartment', 'Independent House', 'Villa', 'Builder floor', 'PG', 'Hostel', 'Studio apartment'

  // 5. BHK / Room Type
  const [rentBhkType, setRentBhkType] = useState<string>('All'); // 'All', '1 RK', '1 BHK', '2 BHK', '3 BHK', 'Shared room', 'Private room'

  // 6. Furnishing Status
  const [rentFurnishing, setRentFurnishing] = useState<string>('All'); // 'All', 'Fully furnished', 'Semi furnished', 'Unfurnished'
  const [rentFurnishingAc, setRentFurnishingAc] = useState<boolean>(false);
  const [rentFurnishingWm, setRentFurnishingWm] = useState<boolean>(false);
  const [rentFurnishingFridge, setRentFurnishingFridge] = useState<boolean>(false);
  const [rentFurnishingBed, setRentFurnishingBed] = useState<boolean>(false);

  // 7. Tenant Preference
  const [rentTenantPref, setRentTenantPref] = useState<string>('All'); // 'All', 'Family', 'Bachelors', 'Students', 'Working professionals'

  // 8. Gender Preference (PG/Shared)
  const [rentGenderPref, setRentGenderPref] = useState<string>('All'); // 'All', 'Male', 'Female', 'Any'

  // 9. Availability Filter
  const [rentAvailability, setRentAvailability] = useState<string>('All'); // 'All', 'Available now', 'Available next month'
  const [rentMoveInDate, setRentMoveInDate] = useState<string>('');

  // 10. Lease Duration
  const [rentLeaseDuration, setRentLeaseDuration] = useState<string>('All'); // 'All', 'Short-term', 'Long-term', 'Flexible lease'

  // 11. Amenities Filter
  const [rentEssentialAmenities, setRentEssentialAmenities] = useState<string[]>([]); // 'Parking', 'Lift', 'Security', 'WiFi', 'Power backup', 'Water supply'
  const [rentLifestyleAmenities, setRentLifestyleAmenities] = useState<string[]>([]); // 'Gym', 'Swimming pool', 'Clubhouse', 'Study room', 'Laundry'

  // 12. Pet-Friendly Filter
  const [rentPetFriendly, setRentPetFriendly] = useState<string>('All'); // 'All', 'Pets allowed', 'No pets'

  // 13. Parking Filters
  const [rentParkingChecked, setRentParkingChecked] = useState<string[]>([]); // 'Bike parking', 'Car parking', 'Covered parking'

  // 14. Bathroom Filters
  const [rentBathroomType, setRentBathroomType] = useState<string>('All'); // 'All', 'Attached Bathroom', 'Shared Bathroom'
  const [rentBathroomCount, setRentBathroomCount] = useState<string>('All'); // 'All', '1', '2', '3+'

  // 15. Property Age
  const [rentPropAge, setRentPropAge] = useState<string>('All'); // 'All', 'New', '0-5 years', '5-10 years', '10+ years'

  // 16. Facing & Vaastu
  const [rentFacingVastu, setRentFacingVastu] = useState<string[]>([]); // 'East facing', 'West facing', 'Vaastu compliant'

  // 17. Verified Listings
  const [rentVerifiedFilters, setRentVerifiedFilters] = useState<string[]>([]); // 'Verified owner', 'Verified property', 'Verified photos'

  // 18. Owner / Agent Filter
  const [rentPostedBy, setRentPostedBy] = useState<string>('All'); // 'All', 'Owner', 'Agent', 'Builder'

  // 19. Posted Time Filter
  const [rentPostedTime, setRentPostedTime] = useState<string>('All'); // 'All', 'Posted today', 'Last 3 days', 'Last week'

  // 20. Nearby Essentials
  const [rentNearbyEssentials, setRentNearbyEssentials] = useState<string[]>([]); // 'Near metro', 'Near bus stop', 'Near office', 'Near college', 'Near market', 'Near hospital'

  // 21. AI Smart Filters
  const [rentAiSmartFilter, setRentAiSmartFilter] = useState<string>('All'); // 'All', 'Best for students', 'Best for families', 'Best for professionals', 'Low commute time', 'Affordable with amenities'

  // 22. Budget Insights Calculator values
  const [rentSalaryInput, setRentSalaryInput] = useState<number | ''>('');
  const [rentExtraExpenses, setRentExtraExpenses] = useState<number | ''>('');
  const [rentElectricityInc, setRentElectricityInc] = useState<boolean>(false);
  const [rentMaintenanceInc, setRentMaintenanceInc] = useState<boolean>(false);

  // 23. Food Preferences (PG/Hostels)
  const [rentFoodPreference, setRentFoodPreference] = useState<string>('All'); // 'All', 'Food included', 'Veg only', 'Non-veg allowed'

  // 24. Room Sharing Config (PG/Hostels)
  const [rentRoomSharing, setRentRoomSharing] = useState<string>('All'); // 'All', 'Single occupancy', 'Double sharing', 'Triple sharing'

  // 25. Internet & Work From Home parameters
  const [rentWfhAmenities, setRentWfhAmenities] = useState<string[]>([]); // 'High-speed WiFi', 'Workspace', 'Study table', 'Backup electricity'

  // Special simulated automation states for interactive feel
  const [autoDetectingLoc, setAutoDetectingLoc] = useState<boolean>(false);
  const [uploadedRentDrafts, setUploadedRentDrafts] = useState<{name: string, size: string}[]>([]);
  const [rentAiAdvisorRunning, setRentAiAdvisorRunning] = useState<boolean>(false);
  const [rentAiAdvisorVerdict, setRentAiAdvisorVerdict] = useState<string>('');

  const countActiveRentFilters = useMemo(() => {
    let count = 0;
    if (rentFilterCity !== 'All') count++;
    if (rentFilterLocality !== '') count++;
    if (rentFilterLandmark !== '') count++;
    if (rentFilterPincode !== '') count++;
    if (rentFilterNearMetro) count++;
    if (rentFilterNearOffice) count++;
    if (rentFilterNearCollege) count++;
    if (rentFilterNearHospital) count++;
    if (rentCommuteTime !== 'All') count++;
    if (rentRadius !== 'All') count++;
    if (rentMapCoordinates !== null) count++;
    if (rentPriceMin !== '' || rentPriceMax !== '') count++;
    if (rentPriceRangeQuick !== 'All') count++;
    if (rentDepositMax !== '') count++;
    if (rentZeroDeposit) count++;
    if (rentPropType !== 'All') count++;
    if (rentBhkType !== 'All') count++;
    if (rentFurnishing !== 'All') count++;
    if (rentFurnishingAc || rentFurnishingWm || rentFurnishingFridge || rentFurnishingBed) count++;
    if (rentTenantPref !== 'All') count++;
    if (rentGenderPref !== 'All') count++;
    if (rentAvailability !== 'All') count++;
    if (rentMoveInDate !== '') count++;
    if (rentLeaseDuration !== 'All') count++;
    if (rentEssentialAmenities.length > 0) count++;
    if (rentLifestyleAmenities.length > 0) count++;
    if (rentPetFriendly !== 'All') count++;
    if (rentParkingChecked.length > 0) count++;
    if (rentBathroomType !== 'All') count++;
    if (rentBathroomCount !== 'All') count++;
    if (rentPropAge !== 'All') count++;
    if (rentFacingVastu.length > 0) count++;
    if (rentVerifiedFilters.length > 0) count++;
    if (rentPostedBy !== 'All') count++;
    if (rentPostedTime !== 'All') count++;
    if (rentNearbyEssentials.length > 0) count++;
    if (rentAiSmartFilter !== 'All') count++;
    if (rentSalaryInput !== '') count++;
    if (rentExtraExpenses !== '') count++;
    if (rentElectricityInc || rentMaintenanceInc) count++;
    if (rentFoodPreference !== 'All') count++;
    if (rentRoomSharing !== 'All') count++;
    if (rentWfhAmenities.length > 0) count++;
    return count;
  }, [
    rentFilterCity, rentFilterLocality, rentFilterLandmark, rentFilterPincode,
    rentFilterNearMetro, rentFilterNearOffice, rentFilterNearCollege, rentFilterNearHospital,
    rentCommuteTime, rentRadius, rentMapCoordinates, rentPriceMin, rentPriceMax, rentPriceRangeQuick,
    rentDepositMax, rentZeroDeposit, rentPropType, rentBhkType, rentFurnishing,
    rentFurnishingAc, rentFurnishingWm, rentFurnishingFridge, rentFurnishingBed,
    rentTenantPref, rentGenderPref, rentAvailability, rentMoveInDate, rentLeaseDuration,
    rentEssentialAmenities, rentLifestyleAmenities, rentPetFriendly, rentParkingChecked,
    rentBathroomType, rentBathroomCount,
    rentPropAge, rentFacingVastu, rentVerifiedFilters,
    rentPostedBy, rentPostedTime, rentNearbyEssentials, rentAiSmartFilter,
    rentSalaryInput, rentExtraExpenses, rentElectricityInc, rentMaintenanceInc,
    rentFoodPreference, rentRoomSharing, rentWfhAmenities
  ]);

  const resetAllRentFilters = () => {
    setRentFilterCity('All');
    setRentFilterLocality('');
    setRentFilterLandmark('');
    setRentFilterPincode('');
    setRentFilterNearMetro(false);
    setRentFilterNearOffice(false);
    setRentFilterNearCollege(false);
    setRentFilterNearHospital(false);
    setRentCommuteTime('All');
    setRentRadius('All');
    setRentMapCoordinates(null);
    setRentPriceMin('');
    setRentPriceMax('');
    setRentPriceRangeQuick('All');
    setRentDepositMax('');
    setRentZeroDeposit(false);
    setRentPropType('All');
    setRentBhkType('All');
    setRentFurnishing('All');
    setRentFurnishingAc(false);
    setRentFurnishingWm(false);
    setRentFurnishingFridge(false);
    setRentFurnishingBed(false);
    setRentTenantPref('All');
    setRentGenderPref('All');
    setRentAvailability('All');
    setRentMoveInDate('');
    setRentLeaseDuration('All');
    setRentEssentialAmenities([]);
    setRentLifestyleAmenities([]);
    setRentPetFriendly('All');
    setRentParkingChecked([]);
    setRentBathroomType('All');
    setRentBathroomCount('All');
    setRentPropAge('All');
    setRentFacingVastu([]);
    setRentVerifiedFilters([]);
    setRentPostedBy('All');
    setRentPostedTime('All');
    setRentNearbyEssentials([]);
    setRentAiSmartFilter('All');
    setRentSalaryInput('');
    setRentExtraExpenses('');
    setRentElectricityInc(false);
    setRentMaintenanceInc(false);
    setRentFoodPreference('All');
    setRentRoomSharing('All');
    setRentWfhAmenities([]);
    setRentAiAdvisorVerdict('');
    setUploadedRentDrafts([]);
  };
  
  // Custom Registration / Lead Generation for Renting
  const [showRentPostingForm, setShowRentPostingForm] = useState(false);
  const [rentPostStatus, setRentPostStatus] = useState<'idle' | 'success'>('idle');
  const [postingLoader, setPostingLoader] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [sheetsSuccess, setSheetsSuccess] = useState<boolean>(false);
  const [rentFormData, setRentFormData] = useState({
    tenantName: '',
    phone: '',
    requiredBhk: '2 BHK',
    targetCity: 'Raipur',
    preferredLocality: '',
    maxBudget: '12000',
    moveInUrgency: 'Immediate'
  });

  // Selected Rental for detailed specifications modal
  const [selectedRental, setSelectedRental] = useState<RentListing | null>(null);
  const [negotiationDispatched, setNegotiationDispatched] = useState(false);

  // Interactive Housing Shorts states
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);
  const [shortMuted, setShortMuted] = useState<boolean>(true);
  const [shortLikes, setShortLikes] = useState<Record<number, number>>({ 0: 124, 1: 342, 2: 95, 3: 201 });
  const [hasLikedShort, setHasLikedShort] = useState<Record<number, boolean>>({});
  const [shortCommentCount, setShortCommentCount] = useState<Record<number, number>>({ 0: 7, 1: 18, 2: 5, 3: 11 });
  const [shortComments, setShortComments] = useState<Record<number, string[]>>({
    0: ['Stunning design!', 'Is the cylinder gas line pre-fit?', 'Are student bachelors allowed?', 'Absolutely loved the modern chimney setup!', 'Wait is this in VIP road area?', 'Can we schedule a visit tomorrow?', 'Super cost-effective solution!'],
    1: ['Beautiful exterior tower work', 'Om Shiv Kailasa is absolute luxury', 'Metro line distance?', 'Safe campus for family?', 'Is car parking covered?', 'Are pets allowed here?', 'Is this verified by the RERA board?'],
    2: ['Cozy living setup indeed!', 'Besa area is top-tier', 'Safe compound rules?', 'Are bachelors accepted?', 'Inverter backup active?'],
    3: ['Genuinely pristine tile look', 'Kitchen woodwork fits so well', 'Any negotiation margins?', 'Location check please?', 'Very clean floor design!']
  });
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [showRentMapModal, setShowRentMapModal] = useState<boolean>(false);
  const [useMockupMap, setUseMockupMap] = useState<boolean>(!hasValidKey);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);
  const [mobileModalTab, setMobileModalTab] = useState<'map' | 'info'>('map');
  
  // Combine core properties with custom uploaded Rent properties
  const [customRentListings, setCustomRentListings] = useState<any[]>([]);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const stored = localStorage.getItem('nest_uploaded_custom_properties_rent');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map(p => ({
              ...p,
              numericPrice: parseInt(p.price.replace(/[^\d]/g, '')) * 1000 || 25000,
              city: p.location.split(',').pop()?.trim() || 'Nagpur',
              locality: p.location.split(',')[0]?.trim() || 'Manish Nagar',
              areaLabel: p.location.split(',')[0]?.trim() || 'Manish Nagar',
              builder: 'Private Landlord',
              status: 'Ready to move',
              sizeSqft: parseInt(p.area.replace(/[^\d]/g, '')) || 1200,
              bhkVal: parseInt(p.bhk?.replace(/[^\d]/g, '')) || 2,
              ageYears: 2,
              possessionDays: 0,
              gatedCommunity: true,
              reraStatus: 'Registered',
              commuteTimeMins: 10,
              amenities: ['Power Backup', 'Water Source', 'Security'],
              investmentTag: 'High ROI properties',
              aiTag: 'Best family homes',
              locationIndex: 85,
              structuralIndex: 90,
              carpetArea: p.area,
              superBuiltupArea: p.area,
              possessionStatus: 'Immediate Possession',
              rent: p.price,
              securityDeposit: '3 Months Rent',
              preferredTenants: 'Any (Family/Bachelors)',
              furnishing: 'Semi-Furnished',
              postedBy: 'Owner'
            }));
            setCustomRentListings(mapped);
          }
        } else {
          setCustomRentListings([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadCustom();
    window.addEventListener('propertiesChanged', loadCustom);
    return () => {
      window.removeEventListener('propertiesChanged', loadCustom);
    };
  }, []);

  const rentListingsToUse = useMemo(() => {
    return [...customRentListings, ...POPULAR_RENTALS];
  }, [customRentListings]);

  // 12 Cities expanded to 18 high fidelity smart cities/metros mapping system
  const TARGET_MAP_CITIES = [
    'Raipur', 'Nagpur', 'Pune', 'Mumbai', 'Bengaluru',
    'Delhi NCR', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
    'Jaipur', 'Bhopal', 'Indore', 'Noida', 'Gurugram',
    'Chandigarh', 'Lucknow', 'Kochi'
  ];

  const [activeMapCity, setActiveMapCity] = useState<string>('Raipur');

  const getMapRentals = (city: string): RentListing[] => {
    const queryCity = city.toLowerCase() === 'delhi ncr' ? 'delhi' : city.toLowerCase();
    const existing = rentListingsToUse.filter(r => r.city.toLowerCase() === queryCity || (queryCity === 'delhi' && r.city.toLowerCase() === 'delhi ncr'));
    if (existing.length > 0) {
      return existing;
    }
    
    // Dynamic ultra high fidelity rendering of localized mock coordinate nodes for regional coverage
    const localizedLocalities: Record<string, string[]> = {
      'Delhi': ['Connaught Place Elite Lane', 'Hauz Khas Village View', 'Greater Kailash Block-C', 'Rajouri Garden Ring Road', 'Saket Premium Enclave', 'Dwarka Sector-12 Hub'],
      'Delhi NCR': ['Delhi Connaught Place Elite Lane', 'Gurgaon Cyber City Drive', 'Noida Sector-62 Tech Enclave', 'Greater Kailash Block-C', 'Saket Premium Gate Side', 'Dwarka Sector-12 Residentials'],
      'Hyderabad': ['Gachibowli Tech Corridor', 'Jubilee Hills VIP Boulevard', 'Banjara Hills Ridge', 'HITEC City Smart Hub', 'Kondapur Botanica Row', 'Secunderabad Club Link'],
      'Chennai': ['Adyar Coastal Walkway', 'Nungambakkam Boulevard', 'Anna Nagar Regal Enclave', 'OMR IT Corridor', 'Velachery Lake Residence', 'Mylapore Cultural Ring'],
      'Kolkata': ['Salt Lake Sector-V Premium', 'New Town Eco-Park Enclave', 'Alipore Mansion Sector', 'Ballygunge Central Park', 'Park Street Club Boulevard', 'Dum Dum Metro Line'],
      'Ahmedabad': ['Satellite VIP Crossing', 'C G Road Boulevard', 'Sardar Patel Ring Road', 'Vastrapur Lake Enclave', 'Bopal Eco Residence', 'Bodakdev Premium Enclave'],
      'Jaipur': ['Malviya Nagar Plaza', 'Vaishali Nagar Greens', 'C-Scheme Heritage Block', 'Mansarovar Metro Corridor', 'Jagatpura Boulevard', 'Raja Park Civic Circle'],
      'Bhopal': ['Arera Colony Vista Desk', 'MP Nagar Business Enclave', 'Kolar Road Hills Side', 'Bairagarh Lake Boulevard', 'Ayodhya Bypass Green Enclave', 'Shyamla Hills Premium'],
      'Indore': ['Vijay Nagar Square Desk', 'Palasia Regal Link', 'Rajendra Nagar Bypass', 'Super Corridor Smart Hub', 'Bhanwarkuan Square', 'LIG Colony Gate'],
      'Noida': ['Sector 62 IT Block', 'Sector 157 Express Way', 'Sector 18 Market Link', 'Sector 15 Metro Hub', 'Greater Noida Link', 'Sector 50 Greens'],
      'Gurugram': ['DLF Phase 3 cyber City', 'Golf Course Road Boulevard', 'Sohna Road Vista', 'Udyog Vihar IT Center', 'Sector 56 Metro Crossing', 'MG Road Central Strip'],
      'Chandigarh': ['Sector 17 Plaza Walk', 'Sector 35-C Greens', 'Sukhna Lake Boulevard', 'Mohali Phase 7 Link', 'Panchkula Sector 11', 'Sector 22 Market Row'],
      'Lucknow': ['Hazratganj Gentry Lane', 'Gomti Nagar Premium Side', 'Alambagh High Road', 'Indira Nagar Segment', 'Jankipuram Extension', 'Aashiana Residential Gird'],
      'Kochi': ['Marine Drive Coastal Link', 'Kakkanad Infopark Zone', 'Edappally Bypass Square', 'Vyttila Hub Boulevard', 'Fort Kochi Heritage Row', 'MG Road Transit Strip']
    };

    const localities = localizedLocalities[city] || ['Central Boulevard Ring', 'Green View Enclave', 'Civic Center Lane', 'Metro Corridor Segment', 'Lake Vista Boulevard', 'Smart City Avenue'];
    
    const ownerNames = ['Rakesh Sharma', 'Aditya Verma', 'Sunita Reddy', 'Ananya Sen', 'Vikram Patel', 'Rajesh Joshi'];
    const ownerContacts = ['+91 91765 43210', '+91 99887 76655', '+91 91234 56789', '+91 98900 11223', '+91 97654 32109', '+91 94450 11223'];
    const sampleImages = [
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80'
    ];

    return localities.map((loc, index) => {
      const bhkOptions = ['1 BHK', '2 BHK', '3 BHK'];
      const bhk = bhkOptions[index % bhkOptions.length];
      const rentPrices = { '1 BHK': 11000, '2 BHK': 19000, '3 BHK': 31000 };
      const basePrice = rentPrices[bhk as keyof typeof rentPrices] + (index * 1200);
      
      return {
        id: `rent-${city.toLowerCase().slice(0, 3).replace(/[^a-z]/g, '')}-${100 + index}`,
        title: `${bhk} ${city} ${loc.split(' ')[0]} Luxury Living`,
        bhk: bhk,
        price: `₹ ${(basePrice / 1000).toFixed(1)}k /Month`,
        numericPrice: basePrice,
        deposit: `₹ ${(basePrice * 2 / 1000).toFixed(1)}k`,
        city: city,
        locality: loc,
        area: `${550 + (index * 260)} sqft`,
        furnishing: (index % 2 === 0 ? 'Fully Furnished' : 'Semi-Furnished') as 'Fully Furnished' | 'Semi-Furnished',
        tenantPreference: (index % 3 === 0 ? 'Bachelors' : 'Families') as 'Bachelors' | 'Families',
        availableFrom: 'Immediate',
        image: sampleImages[index % sampleImages.length],
        features: ['Premium wooden wardrobes', 'Freshly polished finishes', 'Pure RO safety water', 'Under-slab kitchen exhaust system'],
        ownerName: ownerNames[index % ownerNames.length],
        ownerContact: ownerContacts[index % ownerContacts.length],
        details: `Premium quality high demand standard ${bhk} accommodation located in core residential zone of ${city} with swift highway transit linkage and standard amenities setup.`,
        verified: true,
        electricityMeterStatus: 'Independent Meter' as 'Independent Meter',
        waterSupply: '24/7 NMC Supply' as '24/7 NMC Supply'
      };
    });
  };

  const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Raipur': { lat: 21.2514, lng: 81.6296 },
    'Nagpur': { lat: 21.1458, lng: 79.0882 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Bhopal': { lat: 23.2599, lng: 77.4126 },
    'Indore': { lat: 22.7196, lng: 75.8577 },
    'Noida': { lat: 28.5355, lng: 77.3910 },
    'Gurugram': { lat: 28.4595, lng: 77.0266 },
    'Chandigarh': { lat: 30.7333, lng: 76.7794 },
    'Lucknow': { lat: 26.8467, lng: 80.9462 },
    'Kochi': { lat: 9.9312, lng: 76.2673 }
  };

  const getMapRentalsWithCoordinates = (city: string): (RentListing & { lat: number; lng: number })[] => {
    const rawRentals = getMapRentals(city);
    const center = CITY_COORDINATES[city] || { lat: 21.2514, lng: 81.6296 };
    const offsets = [
      { dLat: 0.009, dLng: -0.013 },
      { dLat: -0.014, dLng: 0.012 },
      { dLat: 0.016, dLng: 0.014 },
      { dLat: -0.008, dLng: -0.015 },
      { dLat: 0.012, dLng: -0.007 },
      { dLat: -0.004, dLng: 0.009 },
    ];
    return rawRentals.map((r, i) => {
      const offset = offsets[i % offsets.length];
      return {
        ...r,
        lat: center.lat + offset.dLat,
        lng: center.lng + offset.dLng
      };
    });
  };

  const [selectedMapRental, setSelectedMapRental] = useState<RentListing | null>(null);

  // Initialize selected map rental once showRentMapModal triggers or activeMapCity initiates
  useEffect(() => {
    if (showRentMapModal && !selectedMapRental) {
      const r = getMapRentalsWithCoordinates(activeMapCity);
      if (r.length > 0) setSelectedMapRental(r[0]);
    }
  }, [showRentMapModal, activeMapCity]);

  // Interactive 360° Virtual Property View states
  const [panoOffset, setPanoOffset] = useState<number>(50); // percentage (0 to 100)
  const [isPanoDragging, setIsPanoDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartOffset = useRef<number>(50);
  const [panoActiveScene, setPanoActiveScene] = useState<'living' | 'bedroom'>('living');
  const [panoAutoRotate, setPanoAutoRotate] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<{ id: string; name: string; desc: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!panoAutoRotate || isPanoDragging) return;
    const interval = setInterval(() => {
      setPanoOffset(prev => {
        let next = prev + 0.08;
        if (next > 100) next = 0;
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [panoAutoRotate, isPanoDragging]);

  // Filter listings dynamically based on parameters and search text
  const filteredRentals = useMemo(() => {
    return rentListingsToUse.filter(rent => {
      // 1. Search Query Match
      const matchesSearch = searchQuery === '' || 
        rent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. City Filter match (Synchronized between basic dropdown and advanced filter tab)
      const currentCity = selectedCity !== 'All' ? selectedCity : rentFilterCity;
      const matchesCity = currentCity === 'All' || rent.city.toLowerCase() === currentCity.toLowerCase();

      // 3. BHK Filter match (Synchronized)
      const currentBhk = bhkFilter !== 'All' ? bhkFilter : rentBhkType;
      const matchesBhk = currentBhk === 'All' || rent.bhk === currentBhk || rent.title.toLowerCase().includes(currentBhk.toLowerCase());

      // 4. Furnishing Filter match (Synchronized)
      const currentFurnishing = furnishingFilter !== 'All' ? furnishingFilter : rentFurnishing;
      let matchesFurnishing = currentFurnishing === 'All' || rent.furnishing.toLowerCase() === currentFurnishing.toLowerCase() || (currentFurnishing === 'Fully Furnished' && rent.furnishing === 'Fully Furnished');

      // Check furnishing optionals if specified
      if (rentFurnishingAc && !rent.features.some(f => f.toLowerCase().includes('ac') || f.toLowerCase().includes('air conditioner'))) matchesFurnishing = false;
      if (rentFurnishingWm && !rent.features.some(f => f.toLowerCase().includes('washing') || f.toLowerCase().includes('mach'))) matchesFurnishing = false;
      if (rentFurnishingFridge && !rent.features.some(f => f.toLowerCase().includes('fridge') || f.toLowerCase().includes('refriger'))) matchesFurnishing = false;
      if (rentFurnishingBed && !rent.features.some(f => f.toLowerCase().includes('bed') || f.toLowerCase().includes('sofa'))) matchesFurnishing = false;

      // 5. Price Filter match
      let matchesPrice = true;
      if (priceRange !== 'All') {
        if (priceRange === '< 10k') {
          matchesPrice = rent.numericPrice < 10000;
        } else if (priceRange === '10k - 15k') {
          matchesPrice = rent.numericPrice >= 10000 && rent.numericPrice <= 15000;
        } else if (priceRange === '> 15k') {
          matchesPrice = rent.numericPrice > 15000;
        }
      }

      // Advanced direct min/max rent input filters
      if (rentPriceMin !== '' && rent.numericPrice < Number(rentPriceMin)) {
        matchesPrice = false;
      }
      if (rentPriceMax !== '' && rent.numericPrice > Number(rentPriceMax)) {
        matchesPrice = false;
      }
      if (rentPriceRangeQuick !== 'All') {
        const p = rent.numericPrice;
        if (rentPriceRangeQuick === '<5k' && p >= 5000) matchesPrice = false;
        else if (rentPriceRangeQuick === '5k-10k' && (p < 5000 || p > 10000)) matchesPrice = false;
        else if (rentPriceRangeQuick === '10k-20k' && (p < 10000 || p > 20000)) matchesPrice = false;
        else if (rentPriceRangeQuick === '20k-50k' && (p < 20000 || p > 50000)) matchesPrice = false;
        else if (rentPriceRangeQuick === '50k+' && p < 50000) matchesPrice = false;
      }

      // 6. Quick Filters match from primary interactive cards
      let matchesQuick = true;
      if (selectedQuickFilter === 'Owner') {
        matchesQuick = rent.verified;
      } else if (selectedQuickFilter === 'Immediate') {
        matchesQuick = rent.availableFrom === 'Immediate' || rent.availableFrom === 'Ready to Move';
      } else if (selectedQuickFilter === 'Furnished') {
        matchesQuick = rent.furnishing === 'Fully Furnished' || rent.furnishing === 'Semi-Furnished';
      }

      // ADVANCED 25 CRITERIA FILTERS:
      // Locality
      if (rentFilterLocality !== '' && !rent.locality.toLowerCase().includes(rentFilterLocality.toLowerCase())) {
        matchesQuick = false;
      }
      // Landmark
      if (rentFilterLandmark !== '' && !rent.locality.toLowerCase().includes(rentFilterLandmark.toLowerCase()) && !rent.details.toLowerCase().includes(rentFilterLandmark.toLowerCase())) {
        matchesQuick = false;
      }
      // Near Proximities (Metro, Office, College, Hospital)
      const detailStr = rent.details.toLowerCase() + " " + rent.locality.toLowerCase() + " " + rent.title.toLowerCase() + " " + rent.features.join(" ").toLowerCase();
      if (rentFilterNearMetro && !detailStr.includes('metro') && !detailStr.includes('transit')) {
        matchesQuick = false;
      }
      if (rentFilterNearOffice && !detailStr.includes('office') && !detailStr.includes('mihan') && !detailStr.includes('it row') && !detailStr.includes('it park') && !detailStr.includes('corporate')) {
        matchesQuick = false;
      }
      if (rentFilterNearCollege && !detailStr.includes('college') && !detailStr.includes('institute') && !detailStr.includes('stud') && !detailStr.includes('university')) {
        matchesQuick = false;
      }
      if (rentFilterNearHospital && !detailStr.includes('hospital') && !detailStr.includes('medical') && !detailStr.includes('aiims') && !detailStr.includes('clinic')) {
        matchesQuick = false;
      }

      // Smart radius query simulator
      if (rentRadius !== 'All') {
        // Besa Heights, Manish Nagar etc inside Nagpur are calculated close (simulate perfect match)
        if (rentRadius === '1km' && !detailStr.includes('crossing') && !detailStr.includes('near')) {
          // let simple match pass so map interactions are rich
        }
      }

      // Security Deposit (including Zero deposit option)
      if (rentZeroDeposit) {
        const depositText = rent.deposit.toLowerCase();
        if (!depositText.includes('zero') && !depositText.includes('0') && !depositText.includes('no deposit') && rent.numericPrice > 10000) {
          matchesQuick = false;
        }
      } else if (rentDepositMax !== '') {
        const parsedDeposit = parseFloat(rent.deposit.replace(/[^0-9.]/g, '')) || (rent.numericPrice * 2);
        if (parsedDeposit > Number(rentDepositMax)) {
          matchesQuick = false;
        }
      }

      // Property Type
      if (rentPropType !== 'All') {
        const isPg = rentPropType === 'PG' || rentPropType === 'Hostel';
        if (isPg && !detailStr.includes('pg') && !detailStr.includes('hostel') && !detailStr.includes('studio') && !detailStr.includes('bachelor')) {
          matchesQuick = false;
        } else if (!isPg && rentPropType === 'Studio apartment' && !detailStr.includes('studio') && !detailStr.includes('1 bhk') && !detailStr.includes('1 rk')) {
          matchesQuick = false;
        } else if (!isPg && rentPropType === 'Villa' && !detailStr.includes('villa') && !detailStr.includes('mansion') && !detailStr.includes('independent')) {
          matchesQuick = false;
        } else if (!isPg && rentPropType === 'Apartment' && !detailStr.includes('apartment') && !detailStr.includes('flat') && !detailStr.includes('residency')) {
          matchesQuick = false;
        } else if (!isPg && !detailStr.includes(rentPropType.toLowerCase())) {
          // relaxed constraint to keep list populated
        }
      }

      // Tenant Preference
      if (rentTenantPref !== 'All') {
        if (rentTenantPref === 'Family' && rent.tenantPreference === 'Bachelors') {
          matchesQuick = false;
        } else if (rentTenantPref === 'Bachelors' && rent.tenantPreference === 'Families') {
          matchesQuick = false;
        } else if (rentTenantPref === 'Students' && !detailStr.includes('stud') && !detailStr.includes('bachelor') && rent.tenantPreference === 'Families') {
          matchesQuick = false;
        } else if (rentTenantPref === 'Working professionals' && !detailStr.includes('professional') && !detailStr.includes('corporate') && rent.tenantPreference === 'Families' && rent.numericPrice < 10000) {
          matchesQuick = false;
        }
      }

      // Gender Preference
      if (rentGenderPref !== 'All' && rentGenderPref !== 'Any') {
        if (!detailStr.includes(rentGenderPref.toLowerCase()) && !detailStr.includes('bachelor') && !detailStr.includes('no preference')) {
          // pass-through to avoid empty results but filter when matching keyword exists
        }
      }

      // Availability check
      if (rentAvailability !== 'All') {
        if (rentAvailability === 'Available now' && rent.availableFrom !== 'Immediate' && rent.availableFrom !== 'Ready to Move') {
          matchesQuick = false;
        } else if (rentAvailability === 'Available next month' && rent.availableFrom === 'Immediate') {
          // matches both, immediate is also available next month!
        }
      }

      // Lease Duration
      if (rentLeaseDuration !== 'All') {
        if (rentLeaseDuration === 'Short-term' && detailStr.includes('long-term only')) {
          matchesQuick = false;
        }
      }

      // Amenities filter (Modular checks)
      for (const amenity of rentEssentialAmenities) {
        const amLower = amenity.toLowerCase();
        const hasAmenity = rent.features.some(f => f.toLowerCase().includes(amLower)) || detailStr.includes(amLower);
        if (!hasAmenity) {
          matchesQuick = false;
          break;
        }
      }
      for (const amenity of rentLifestyleAmenities) {
        const amLower = amenity.toLowerCase();
        const hasAmenity = rent.features.some(f => f.toLowerCase().includes(amLower)) || detailStr.includes(amLower);
        if (!hasAmenity) {
          matchesQuick = false;
          break;
        }
      }

      // Pet Friendly
      if (rentPetFriendly === 'Pets allowed') {
        if (detailStr.includes('no pets') || detailStr.includes('pets not allowed')) {
          matchesQuick = false;
        }
      }

      // Parking Filters
      for (const prk of rentParkingChecked) {
        if (prk === 'Bike parking' && !detailStr.includes('bike') && !detailStr.includes('parking') && !detailStr.includes('two wheeler')) {
          matchesQuick = false;
        }
        if (prk === 'Car parking' && !detailStr.includes('car') && !detailStr.includes('parking') && !detailStr.includes('garage')) {
          matchesQuick = false;
        }
        if (prk === 'Covered parking' && !detailStr.includes('covered') && !detailStr.includes('basement') && !detailStr.includes('garage')) {
          matchesQuick = false;
        }
      }

      // Facing / Vastu
      for (const fac of rentFacingVastu) {
        const facLower = fac.toLowerCase();
        if (facLower.includes('vastu') && !detailStr.includes('vastu') && !detailStr.includes('vaastu')) {
          matchesQuick = false;
        } else if (facLower.includes('east') && !detailStr.includes('east') && !detailStr.includes('morning')) {
          matchesQuick = false;
        }
      }

      // Verified listings
      for (const ver of rentVerifiedFilters) {
        if (!rent.verified) {
          matchesQuick = false;
        }
      }

      // Owner listings filter
      if (rentPostedBy === 'Owner' && !rent.verified) {
        // Owners listings correspond to verified direct connections
        matchesQuick = false;
      }

      // AI Smart filters
      if (rentAiSmartFilter !== 'All') {
        if (rentAiSmartFilter === 'Best for students') {
          const passes = rent.tenantPreference === 'Bachelors' || rent.numericPrice <= 12000 || detailStr.includes('student') || detailStr.includes('college');
          if (!passes) matchesQuick = false;
        } else if (rentAiSmartFilter === 'Best for families') {
          const passes = rent.tenantPreference === 'Families' || rent.numericPrice >= 12000 || detailStr.includes('family');
          if (!passes) matchesQuick = false;
        } else if (rentAiSmartFilter === 'Best for professionals') {
          const passes = detailStr.includes('professional') || detailStr.includes('it row') || detailStr.includes('office') || rent.locality.toLowerCase().includes('it') || rent.numericPrice >= 11000;
          if (!passes) matchesQuick = false;
        } else if (rentAiSmartFilter === 'Low commute time') {
          const passes = detailStr.includes('metro') || detailStr.includes('crossing') || detailStr.includes('link') || detailStr.includes('gate') || detailStr.includes('boulevard');
          if (!passes) matchesQuick = false;
        } else if (rentAiSmartFilter === 'Affordable with amenities') {
          const passes = rent.numericPrice <= 14000 && rent.features.length >= 3;
          if (!passes) matchesQuick = false;
        }
      }

      // Nearby Essentials
      for (const ess of rentNearbyEssentials) {
        const essLower = ess.toLowerCase();
        if (essLower.includes('metro') && !detailStr.includes('metro')) matchesQuick = false;
        if (essLower.includes('college') && !detailStr.includes('college') && !detailStr.includes('aiims') && !detailStr.includes('institute')) matchesQuick = false;
        if (essLower.includes('hospital') && !detailStr.includes('hospital') && !detailStr.includes('medical')) matchesQuick = false;
        if (essLower.includes('market') && !detailStr.includes('market') && !detailStr.includes('mall') && !detailStr.includes('shops')) matchesQuick = false;
      }

      // Food preferences
      if (rentFoodPreference !== 'All') {
        if (rentFoodPreference === 'Veg only' && detailStr.includes('non-veg allowed')) matchesQuick = false;
      }

      // Room shared parameters
      if (rentRoomSharing !== 'All') {
        if (rentRoomSharing === 'Single occupancy' && detailStr.includes('double') && !detailStr.includes('independent')) matchesQuick = false;
      }

      // Internet & Work from Home
      for (const wfh of rentWfhAmenities) {
        const wLower = wfh.toLowerCase();
        if (wLower.includes('wifi') && !detailStr.includes('wifi') && !detailStr.includes('internet') && !detailStr.includes('fiber')) matchesQuick = false;
        if (wLower.includes('workspace') && !detailStr.includes('desk') && !detailStr.includes('workspace') && !detailStr.includes('table')) matchesQuick = false;
      }

      return matchesSearch && matchesCity && matchesBhk && matchesFurnishing && matchesPrice && matchesQuick;
    });
  }, [
    searchQuery, selectedCity, bhkFilter, furnishingFilter, priceRange, selectedQuickFilter,
    rentFilterCity, rentFilterLocality, rentFilterLandmark, rentFilterPincode,
    rentFilterNearMetro, rentFilterNearOffice, rentFilterNearCollege, rentFilterNearHospital,
    rentCommuteTime, rentRadius, rentPriceMin, rentPriceMax, rentPriceRangeQuick,
    rentDepositMax, rentZeroDeposit, rentPropType, rentBhkType, rentFurnishing,
    rentFurnishingAc, rentFurnishingWm, rentFurnishingFridge, rentFurnishingBed,
    rentTenantPref, rentGenderPref, rentAvailability, rentMoveInDate, rentLeaseDuration,
    rentEssentialAmenities, rentLifestyleAmenities, rentPetFriendly, rentParkingChecked,
    rentPropAge, rentFacingVastu, rentVerifiedFilters,
    rentPostedBy, rentPostedTime, rentNearbyEssentials, rentAiSmartFilter,
    rentFoodPreference, rentRoomSharing, rentWfhAmenities
  ]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'Rent') {
      if (onTabChange) {
        onTabChange(tab);
      }
    }
  };

  const handleRentPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingLoader(true);
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
        console.error("Google Sheets authentication error for renting:", authErr);
      }
    }

    if (token) {
      try {
        const spreadsheetId = '1N4yT8snirbYUM0Qo8gUb81dv0N_eytOlXfZEKWhIXYc';
        
        // Try multiple tabs in case the user has 'Register Tenant Request ' (trailing space),
        // 'Register Tenant Request' (standard), or 'Register Tetant Request' (typo) in their spreadsheet.
        const rangesToTry = [
          'REGISTER TENANT REQUEST',
          'REGISTER TENANT REQUEST ',
          'register Tenant request',
          'register Tenant request ',
          'register tenant request',
          'register tenant request ',
          'Register Tenant Request',
          'Register Tenant Request ',
          'Register Tetant Request'
        ];
        
        let appendSuccess = false;
        let lastErrorMsg = '';
        
        for (const targetRange of rangesToTry) {
          try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetRange)}:append?valueInputOption=USER_ENTERED`;
            
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
                    rentFormData.tenantName,
                    rentFormData.phone,
                    rentFormData.maxBudget,
                    rentFormData.targetCity,
                    rentFormData.requiredBhk,
                    rentFormData.preferredLocality,
                    rentFormData.moveInUrgency
                  ]
                ]
              })
            });

            if (response.ok) {
              appendSuccess = true;
              break;
            } else {
              const errBody = await response.json().catch(() => ({}));
              lastErrorMsg = errBody?.error?.message || `Server error code ${response.status}`;
            }
          } catch (fetchErr: any) {
            lastErrorMsg = fetchErr?.message || String(fetchErr);
          }
        }

        if (!appendSuccess) {
          throw new Error(lastErrorMsg || "Could not find or write to any of the target sheet tabs.");
        }

        setSheetsSuccess(true);
      } catch (err: any) {
        console.error("Failed to sync listing to Google Sheet:", err);
        setSheetsError(`Google Sheet submission failed: ${err.message}`);
      }
    } else {
      console.warn("Submitting locally - Google Sheets authentication missing.");
    }

    setTimeout(() => {
      setPostingLoader(false);
      setRentPostStatus('success');
    }, 1500);
  };

  const resetRentForm = () => {
    setRentFormData({
      tenantName: '',
      phone: '',
      requiredBhk: '2 BHK',
      targetCity: 'Raipur',
      preferredLocality: '',
      maxBudget: '12000',
      moveInUrgency: 'Immediate'
    });
    setRentPostStatus('idle');
    setShowRentPostingForm(false);
    setSheetsError(null);
    setSheetsSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 select-none space-y-12 animate-fadeIn bg-[#F9FBFC]">
      
      {/* Back to Home Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#b38330] transition-all uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#b38330]" /> Back to home
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 tracking-widest uppercase">
          <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> GUARANTEED RENT DEALS
        </div>
      </div>

      {/* Yellow/Gold Tab Header Container matching mockup layout */}
      <div className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-100">
        
        {/* Golden-brown active background tab list */}
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

        {/* Deep Navy Search Input bar representing the mockup layout */}
        <div className="bg-[#0E1F35] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Locality, Landmark, project or builder in Raipur or nearby"
                className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border-none transition-all shadow-inner"
              />
            </div>
            <button 
              type="button"
              onClick={() => alert(`Showing properties in Raipur matching search filters. Found ${filteredRentals.length} available options.`)}
              className="w-full sm:w-auto bg-[#c0c4cc] hover:bg-white text-slate-950 font-bold uppercase text-xs sm:text-sm px-10 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm border border-slate-300"
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
                <option value="Raipur" className="text-slate-900 bg-white font-semibold">Raipur</option>
                <option value="Nagpur" className="text-slate-900 bg-white font-semibold">Nagpur</option>
                <option value="Bengaluru" className="text-slate-900 bg-white font-semibold">Bengaluru</option>
                <option value="Pune" className="text-slate-900 bg-white font-semibold">Pune</option>
                <option value="Mumbai" className="text-slate-900 bg-white font-semibold">Mumbai</option>
              </select>
            </div>

            {/* BHK select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Configuration</span>
              <select
                value={bhkFilter}
                onChange={(e) => setBhkFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All BHKs</option>
                <option value="1 BHK" className="text-slate-900 bg-white">1 BHK</option>
                <option value="2 BHK" className="text-slate-900 bg-white">2 BHK Only</option>
                <option value="3 BHK" className="text-slate-900 bg-white">3 BHK</option>
              </select>
            </div>

            {/* Furnishing select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Furnishing</span>
              <select
                value={furnishingFilter}
                onChange={(e) => setFurnishingFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Types</option>
                <option value="Fully Furnished" className="text-slate-900 bg-white">Fully Furnished</option>
                <option value="Semi-Furnished" className="text-slate-900 bg-white">Semi-Furnished</option>
                <option value="Unfurnished" className="text-slate-900 bg-white">Unfurnished</option>
              </select>
            </div>

            {/* Price list */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Rent Cost</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Budgets</option>
                <option value="< 10k" className="text-slate-900 bg-white">Under ₹10k/mo</option>
                <option value="10k - 15k" className="text-slate-900 bg-white">₹10k - ₹15k/mo</option>
                <option value="> 15k" className="text-slate-900 bg-white">Over ₹15k/mo</option>
              </select>
            </div>

            {/* Advanced Filters Trigger Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFiltersModal(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm cursor-pointer ml-1"
            >
              <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
              <span>Advanced Filters</span>
              {countActiveRentFilters > 0 && (
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white border border-amber-400 select-none animate-bounce">
                  {countActiveRentFilters}
                </span>
              )}
            </button>

            {/* Reset Filters shortcut */}
            {(selectedCity !== 'All' || bhkFilter !== 'All' || furnishingFilter !== 'All' || priceRange !== 'All' || searchQuery !== '' || selectedQuickFilter !== 'All' || countActiveRentFilters > 0) && (
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setBhkFilter('All');
                  setFurnishingFilter('All');
                  setPriceRange('All');
                  setSearchQuery('');
                  setSelectedQuickFilter('All');
                  resetAllRentFilters();
                }}
                className="text-amber-400 hover:text-white text-[11px] font-black underline uppercase ml-auto animate-fadeIn flex items-center gap-1 hover:no-underline"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Quick Filter Cards based on Provided Images */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
        
        {/* Card 1: Owner Properties */}
        <button
          id="btn-filter-owner"
          type="button"
          onClick={() => setSelectedQuickFilter(selectedQuickFilter === 'Owner' ? 'All' : 'Owner')}
          className={`relative w-full h-[160px] sm:h-[180px] rounded-2xl overflow-hidden shadow-sm group transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 text-left ${
            selectedQuickFilter === 'Owner' ? 'border-[#b38330]' : 'border-transparent'
          }`}
        >
          <img 
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80" 
            alt="Owner Properties"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          
          {selectedQuickFilter === 'Owner' && (
            <div id="badge-filter-owner" className="absolute top-3 right-3 bg-[#b38330] text-white rounded-full p-1 shadow-md animate-fadeIn z-10 border border-white/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full flex flex-col justify-end">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">730</span>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight mt-1 drop-shadow-md">Owner Properties</span>
            <span className="text-xs font-bold text-white/90 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore <ArrowRight className="w-3.5 h-3.5 text-[#b38330]" />
            </span>
          </div>
        </button>

        {/* Card 2: Immediately Available */}
        <button
          id="btn-filter-immediate"
          type="button"
          onClick={() => setSelectedQuickFilter(selectedQuickFilter === 'Immediate' ? 'All' : 'Immediate')}
          className={`relative w-full h-[160px] sm:h-[180px] rounded-2xl overflow-hidden shadow-sm group transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 text-left ${
            selectedQuickFilter === 'Immediate' ? 'border-[#b38330]' : 'border-transparent'
          }`}
        >
          <img 
            src={shortKitchen} 
            alt="Immediately Available"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          
          {selectedQuickFilter === 'Immediate' && (
            <div id="badge-filter-immediate" className="absolute top-3 right-3 bg-[#b38330] text-white rounded-full p-1 shadow-md animate-fadeIn z-10 border border-white/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full flex flex-col justify-end">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">1666</span>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight mt-1 drop-shadow-md">Immediately Available</span>
            <span className="text-xs font-bold text-white/90 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore <ArrowRight className="w-3.5 h-3.5 text-[#b38330]" />
            </span>
          </div>
        </button>

        {/* Card 3: Furnished Properties */}
        <button
          id="btn-filter-furnished"
          type="button"
          onClick={() => setSelectedQuickFilter(selectedQuickFilter === 'Furnished' ? 'All' : 'Furnished')}
          className={`relative w-full h-[160px] sm:h-[180px] rounded-2xl overflow-hidden shadow-sm group transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 text-left ${
            selectedQuickFilter === 'Furnished' ? 'border-[#b38330]' : 'border-transparent'
          }`}
        >
          <img 
            src={shortLivingRoom} 
            alt="Furnished Properties"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          
          {selectedQuickFilter === 'Furnished' && (
            <div id="badge-filter-furnished" className="absolute top-3 right-3 bg-[#b38330] text-white rounded-full p-1 shadow-md animate-fadeIn z-10 border border-white/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full flex flex-col justify-end">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">378</span>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight mt-1 drop-shadow-md">Furnished Properties</span>
            <span className="text-xs font-bold text-white/90 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore <ArrowRight className="w-3.5 h-3.5 text-[#b38330]" />
            </span>
          </div>
        </button>

      </div>

      {/* Styled Centered Geolocation check-via-map button as requested */}
      <div className="w-full flex justify-center py-6 animate-fadeIn">
        <button
          type="button"
          onClick={() => setShowRentMapModal(true)}
          className="bg-[#0E1F35] hover:bg-[#b38330] hover:shadow-[#b38330]/20 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-3 border-2 border-[#b38330]/80 group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          <Map className="w-5 h-5 text-amber-500 animate-pulse stroke-[2.5]" />
          <span>Check via Map</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Dynamic Filter Controls & list of Rental Properties */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section banner: "Polular Properties for Rent" and red "See more :-" exactly matching layout */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#0E1F35] tracking-tight">
                Polular Properties for Rent
              </h3>
              <span className="bg-[#b38330]/10 text-[#b38330] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded self-start sm:self-center">
                ● Raipur Exclusives Included
              </span>
            </div>
            
            <button 
              onClick={() => {
                setSelectedCity('All');
                setBhkFilter('All');
                setFurnishingFilter('All');
                setPriceRange('All');
                setSearchQuery('');
                alert("Filters cleared! Showing all registered pan-India rental list. Feel free to narrow matches.");
              }}
              className="text-[#FF0101] hover:text-red-700 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              See more :-
            </button>
          </div>



          {/* List of active Properties for Rent */}
          {filteredRentals.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 animate-pulse">No Active Raipur/City Matches</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't locate specific rental listings under those criteria. Try expanding the BHK filters or setting city options to 'All Cities' to see extensive options!
              </p>
              <button 
                onClick={() => {
                  setSelectedCity('All');
                  setBhkFilter('All');
                }}
                className="bg-slate-900 hover:bg-[#b38330] text-white font-extrabold text-xs px-5 py-2.5 rounded uppercase transition-colors"
              >
                Reset Core Parameters
              </button>
            </div>
          ) : (
            /* Flexible grid responsive container matching the structural cards design exactly */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredRentals.map((rental) => (
                <div 
                  key={rental.id}
                  className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-all group relative"
                >
                  {/* Top Image Box */}
                  <div className="h-[145px] bg-[#E1E4E8] border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                    {rental.image ? (
                      <img 
                        src={rental.image} 
                        alt={rental.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Building className="w-9 h-9 text-gray-500 stroke-[1.5]" />
                    )}
                    {/* Verified stamp decoration */}
                    {rental.verified && (
                      <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                      </span>
                    )}
                    {/* Tenant guidelines tag */}
                    <span className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {rental.tenantPreference}
                    </span>
                  </div>

                  {/* Body Text Area */}
                  <div className="p-4 flex-grow flex flex-col justify-between text-left relative">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-2/3">
                          {rental.locality.split(',')[0]}
                        </h4>
                        <span className="text-[9px] bg-slate-100 text-slate-800 font-extrabold px-1.5 py-0.5 rounded capitalize">
                          {rental.furnishing.split('-')[0]}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                        {rental.bhk}
                      </h4>
                      <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">
                        {rental.price}
                      </p>
                      <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {rental.city}
                      </p>
                    </div>

                    {/* Pill Shaped "More Intel" Button at Bottom Right exactly like standard */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <button
                        onClick={() => setSelectedRental(rental)}
                        className="bg-[#0E1F35] hover:bg-[#b38330] active:scale-95 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        More Intel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Core static asset: "Last 13+ Years of Real-estate Experience" box with high-fidelity growth arrow as sketched */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0E1F35] to-[#142944] rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#b38330]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="space-y-3 z-10 text-left">
              <span className="bg-[#b38330]/80 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded">
                Credibility Standard
              </span>
              <h2 className="text-xl sm:text-3.5xl font-black tracking-tight leading-none text-white">
                Last 13+ Years Of Real-estate Experience
              </h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
                Since 2013, our team has cleared over 4,500 rental leases in Raipur and Nagpur. We double-check electric meter arrears, past water taxation status and immediate flat registry keys before handovers.
              </p>
            </div>
            
            {/* Built visual arrow sign as sketched in the uploaded image */}
            <div className="z-10 flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 self-end md:self-auto min-w-[120px]">
              <div className="w-12 h-12 bg-[#b38330] rounded-full flex items-center justify-center animate-pulse shadow-md">
                <div className="relative">
                  {/* Upward pointing arrow sign resembling the drawn stroke */}
                  <span className="block w-5 h-1.5 bg-slate-950 rotate-45 translate-y-[3px] rounded-full"></span>
                  <span className="block w-5 h-1.5 bg-slate-950 -rotate-45 -translate-y-[3px] rounded-full"></span>
                </div>
              </div>
              <span className="text-[10px] font-black tracking-widest text-[#b38330] mt-2.5 uppercase">
                Leasing Leader
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Tenant Search Requirements Box & Quick Agreement dispatch utility */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border-2 border-[#b38330] rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-16 -mt-16"></div>
            
            <div className="space-y-4 relative z-10 text-left">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-[#b38330]">
                <FileCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#0E1F35] tracking-tight uppercase">
                  Register tenant request
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Are you seeking a high-quality rental flat in Raipur? Register your requested budget and let our matching server instantly notify 80+ certified gated owners directory.
                </p>
              </div>

              {!showRentPostingForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowRentPostingForm(true);
                    setRentPostStatus('idle');
                  }}
                  className="w-full bg-[#0E1F35] hover:bg-[#b38330] text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Register Requirement <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRentPostingForm(false)}
                  className="w-full bg-slate-100 text-slate-700 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel Placement Form
                </button>
              )}
            </div>
          </div>

          {/* Interactive requirement booking form */}
          {showRentPostingForm && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md transition-all animate-fadeIn">
              {rentPostStatus === 'success' ? (
                <div className="text-center space-y-5 py-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-200">
                    <CheckCircle className="w-8 h-8 fill-emerald-100" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#0E1F35] text-base font-black">Requirements Registered</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">
                      Your query for <strong>{rentFormData.requiredBhk}</strong> in <strong>{rentFormData.targetCity}</strong> has been indexed properly.
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50/50 rounded-xl p-4 text-left border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-semibold">
                    <div className="flex items-center gap-2 mb-1.5 text-emerald-800 font-bold uppercase text-[9px] tracking-wide">
                      <Sparkle className="w-3.5 h-3.5" /> Direct Owner Match Found
                    </div>
                    Awesome selection! Your budget of ₹{rentFormData.maxBudget}/month matches beautifully with 12 owners on VIP Road. Check your SMS for contact logs.
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCity(rentFormData.targetCity);
                        setBhkFilter(rentFormData.requiredBhk);
                        setRentPostStatus('idle');
                        setShowRentPostingForm(false);
                      }}
                      className="flex-grow bg-[#0E1F35] text-white py-2.5 rounded-lg text-xs font-black uppercase"
                    >
                      Browse Options
                    </button>
                    <button
                      type="button"
                      onClick={resetRentForm}
                      className="border border-slate-300 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-slate-50"
                    >
                      Close Form
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRentPostSubmit} className="space-y-4 text-left">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Tenant Details
                    </h4>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={rentFormData.tenantName}
                      onChange={(e) => setRentFormData({...rentFormData, tenantName: e.target.value})}
                      placeholder="e.g. Rahul Sharma"
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
                        value={rentFormData.phone}
                        onChange={(e) => setRentFormData({...rentFormData, phone: e.target.value})}
                        placeholder="10-digit primary"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#b38330] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Max Monthly Budget
                      </label>
                      <input 
                        type="number" 
                        required
                        value={rentFormData.maxBudget}
                        onChange={(e) => setRentFormData({...rentFormData, maxBudget: e.target.value})}
                        placeholder="e.g. 12000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#b38330] font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Target City
                      </label>
                      <select 
                        value={rentFormData.targetCity}
                        onChange={(e) => setRentFormData({...rentFormData, targetCity: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <option value="Raipur">Raipur</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                        Required BHK
                      </label>
                      <select 
                        value={rentFormData.requiredBhk}
                        onChange={(e) => setRentFormData({...rentFormData, requiredBhk: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <option value="1 BHK">1 BHK Studio</option>
                        <option value="2 BHK">2 BHK Family Flat</option>
                        <option value="3 BHK">3 BHK Suite</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                      Preferred Locality / Sector
                    </label>
                    <input 
                      type="text" 
                      required
                      value={rentFormData.preferredLocality}
                      onChange={(e) => setRentFormData({...rentFormData, preferredLocality: e.target.value})}
                      placeholder="e.g. VIP Road or Mowa"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#b38330] font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={postingLoader}
                    className="w-full bg-[#b38330] hover:bg-[#a67526] disabled:bg-slate-300 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer mt-4"
                  >
                    {postingLoader ? 'Matching registered owners...' : 'Submit Rental Query'}
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

          {/* Legal checklists box */}
          <div className="bg-[#0E1F35] text-white p-6 rounded-3xl space-y-4 text-left">
            <span className="bg-[#b38330] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded">
              Lease Compliance
            </span>
            <h4 className="text-sm font-bold tracking-tight">
              Tenant Onboarding & Gated Security Verifications
            </h4>
            <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#b38330] shrink-0 mt-0.5" />
                <span>Zero brokerage direct owner agreements indexed and stamped on ₹100 e-registration portals.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#b38330] shrink-0 mt-0.5" />
                <span>Immediate police clearance e-filing coordinated via digital state portal in Raipur & Nagpur.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#b38330] shrink-0 mt-0.5" />
                <span>Water meter verification protocols ensuring zero pending dues of former occupants.</span>
              </div>
            </div>
            <button 
              onClick={() => alert("Launching Standard Draft Rent Agreement Creator. Ready templates available.")}
              className="mt-2 w-full text-center bg-white/5 hover:bg-white/15 border border-white/10 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors"
            >
              Draft Rent Agreement (PDF)
            </button>
          </div>

        </div>

      </div>

      {/* Keyboard Hook to handle up/down arrows inside shorts player */}
      {(() => {
        useEffect(() => {
          if (activeShortIndex === null) return;
          
          const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (activeShortIndex > 0) {
                setActiveShortIndex(activeShortIndex - 1);
                setShowCommentsDrawer(false);
              }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (activeShortIndex < 3) {
                setActiveShortIndex(activeShortIndex + 1);
                setShowCommentsDrawer(false);
              }
            }
          };
          
          window.addEventListener('keydown', handleKeyDown);
          return () => {
            window.removeEventListener('keydown', handleKeyDown);
          };
        }, [activeShortIndex]);
        return null;
      })()}

      {/* Embedded Advertisements Section - Placed after 3 rows of the page */}
      <AdsSection />

      {/* Housing Shorts Section mimicking the provided screenshot in visual format */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left select-none animate-fadeIn">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Housing Shorts <span className="text-[#b38330]">✨</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            The best properties in this locality
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              id: 0,
              user: 'SAGAR TINKH...',
              role: 'Owner',
              avatarText: 'ST',
              image: shortKitchen,
              videoTitle: '2 BHK Independe...',
              location: 'New Diamond Nagar,...',
            },
            {
              id: 1,
              user: 'Ravinder Mek...',
              role: 'Housing Expert ...',
              avatarText: 'RM',
              image: shortApartment,
              videoTitle: '2 BHK Apartment',
              location: 'Om Shiv Kailasa, Mih...',
            },
            {
              id: 2,
              user: 'Ashish Gupta',
              role: 'Housing Prime A...',
              avatarText: 'AG',
              avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
              image: shortLivingRoom,
              videoTitle: '2 BHK Apartment',
              location: 'Besa society, Manew...',
            },
            {
              id: 3,
              user: 'Rrrealtors',
              role: 'Housing Expert ...',
              avatarText: 'R',
              image: shortNewlyTiled,
              videoTitle: '3 BHK Apartment',
              location: 'RRshankar, East Sha...',
            }
          ].map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveShortIndex(index);
                setShortMuted(false); 
              }}
              className="group relative h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-slate-150 cursor-pointer focus:outline-none transition-all duration-300 hover:-translate-y-1 bg-slate-50 flex flex-col text-left"
            >
              {/* Main Teaser Image represent property room */}
              <img 
                src={item.image} 
                alt={`${item.videoTitle} short`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Cover Black Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 flex flex-col justify-between p-4" />

              {/* Top User Badge info Overlay inside card */}
              <div className="absolute top-4 left-4 right-4 flex items-center gap-2.5 z-10">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full border-2 border-pink-500 bg-[#0E1F35] overflow-hidden flex items-center justify-center">
                    {item.avatarImg ? (
                      <img src={item.avatarImg} alt="avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white text-[10px] font-black">{item.avatarText}</span>
                    )}
                  </div>
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="text-white text-[11px] font-black truncate drop-shadow-md">
                    {item.user}
                  </h4>
                  <p className="text-[9px] text-white/80 font-bold drop-shadow-xs truncate lowercase capitalize">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Play symbol button in the center container */}
              <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-xs flex items-center justify-center shadow-lg border border-white/10">
                  <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom text overlay info: BHK name & Locality info */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                <h5 className="text-white font-extrabold text-xs sm:text-sm leading-tight truncate">
                  {item.videoTitle}
                </h5>
                <p className="text-white/85 font-medium text-[10px] sm:text-xs truncate mt-0.5">
                  {item.location}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Live 360° Property View Section */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left select-none mt-10 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Interactive 360° Room Tour <span className="text-emerald-600 animate-pulse">● Live Condition</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Look around the real condition of properties before scheduling a visit. Drag the room to rotate!
            </p>
          </div>
          
          {/* Quick Scene Selectors */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rouned-xl self-start sm:self-auto rounded-xl">
            <button
              onClick={() => {
                setPanoActiveScene('living');
                setActiveHotspot(null);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                panoActiveScene === 'living' 
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Living Room
            </button>
            <button
              onClick={() => {
                setPanoActiveScene('bedroom');
                setActiveHotspot(null);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                panoActiveScene === 'bedroom' 
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Master Bedroom
            </button>
          </div>
        </div>

        {/* The 360 viewer canvas container */}
        <div className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col justify-end">
          
          {/* Dynamic Panoramic background */}
          <div 
            className="absolute inset-0 select-none cursor-grab active:cursor-grabbing transition-all duration-75"
            style={{
              backgroundImage: `url(${panoActiveScene === 'living' ? panoLivingRoom : panoBedroom})`,
              backgroundSize: 'cover',
              backgroundPosition: `${panoOffset}% center`,
              backgroundRepeat: 'no-repeat',
            }}
            onMouseDown={(e) => {
              setIsPanoDragging(true);
              dragStartX.current = e.clientX;
              dragStartOffset.current = panoOffset;
            }}
            onMouseMove={(e) => {
              if (!isPanoDragging) return;
              const deltaX = e.clientX - dragStartX.current;
              const sensitivity = 0.08; 
              let newOffset = dragStartOffset.current - (deltaX * sensitivity);
              if (newOffset > 100) newOffset -= 100;
              if (newOffset < 0) newOffset += 100;
              setPanoOffset(newOffset);
            }}
            onMouseUp={() => setIsPanoDragging(false)}
            onMouseLeave={() => setIsPanoDragging(false)}
            onTouchStart={(e) => {
              if (e.touches.length === 0) return;
              setIsPanoDragging(true);
              dragStartX.current = e.touches[0].clientX;
              dragStartOffset.current = panoOffset;
            }}
            onTouchMove={(e) => {
              if (!isPanoDragging || e.touches.length === 0) return;
              const deltaX = e.touches[0].clientX - dragStartX.current;
              const sensitivity = 0.12; 
              let newOffset = dragStartOffset.current - (deltaX * sensitivity);
              if (newOffset > 100) newOffset -= 100;
              if (newOffset < 0) newOffset += 100;
              setPanoOffset(newOffset);
            }}
            onTouchEnd={() => setIsPanoDragging(false)}
          />

          {/* Compass overlay in upper left to show relative direction */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <Compass 
              className="w-4 h-4 text-emerald-400" 
              style={{ transform: `rotate(${(panoOffset / 100) * 360}deg)` }}
            />
            <span>Direction: {Math.round((panoOffset / 100) * 360)}° {getDirectionLabel(panoOffset)}</span>
          </div>

          {/* Interactive hotspot dots floating over the background based on panorama position offset */}
          {HOTSPOTS[panoActiveScene].map((hotspot) => {
            let relativePosition = hotspot.x - panoOffset;
            
            if (relativePosition > 50) relativePosition -= 100;
            if (relativePosition < -50) relativePosition += 100;

            const isVisible = Math.abs(relativePosition) < 35;
            if (!isVisible) return null;

            const leftPercent = 50 + (relativePosition * 2.5); // centered at 50%

            return (
              <button
                key={hotspot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(hotspot);
                }}
                className="absolute z-10 p-2 text-white bg-slate-900/90 border border-[#b38330] rounded-full shadow-lg group flex items-center gap-2 hover:bg-[#b38330] hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer max-w-sm"
                style={{
                  left: `${leftPercent}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center animate-ping absolute -inset-0.5 opacity-40" />
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-[10px] font-extrabold pr-1 tracking-tight truncate max-w-[100px] sm:max-w-none">
                  {hotspot.name}
                </span>
              </button>
            );
          })}

          {/* Hotspot details overlay popup card */}
          {activeHotspot && (
            <div className="absolute top-16 right-4 left-4 sm:left-auto sm:w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white z-20 animate-fadeIn space-y-2 pointer-events-auto shadow-xl">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Checked Spot
                </span>
                <button 
                  onClick={() => setActiveHotspot(null)}
                  className="text-white/60 hover:text-white p-0.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-extrabold text-sm text-slate-50">{activeHotspot.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{activeHotspot.desc}</p>
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-white/5 p-1 px-2 rounded-md">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified physical status: Pristine Condition</span>
              </div>
            </div>
          )}

          {/* Controls Bar Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-auto">
            {/* Auto-rotation Switch */}
            <button
              onClick={() => setPanoAutoRotate(!panoAutoRotate)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border shadow-md transition-all cursor-pointer ${
                panoAutoRotate 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${panoAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              {panoAutoRotate ? 'Auto-Panning' : 'Paused Panning'}
            </button>

            {/* Drag helper tooltip */}
            <span className="text-white/80 text-[10px] font-black uppercase bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10 hidden md:inline-flex items-center gap-1">
              ↔ Drag to rotate room fully
            </span>

            {/* Quick calibration reset */}
            <button
              onClick={() => setPanoOffset(50)}
              className="px-3.5 py-2 bg-black/60 text-white hover:bg-black/80 border border-white/10 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Center View
            </button>
          </div>
        </div>

        {/* Legend / Perks summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-55 p-4 rounded-2xl border border-slate-100 bg-slate-50">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] text-slate-400 font-black uppercase">Viewing Mode</span>
            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-500" /> Digital Gyroscope
            </p>
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-[10px] text-slate-400 font-black uppercase">Room Integrity</span>
            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Physical-Verified
            </p>
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-[10px] text-slate-400 font-black uppercase">Captured On</span>
            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-500" /> Live: Today 10:15 AM
            </p>
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-[10px] text-slate-400 font-black uppercase">Inspection Tool</span>
            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <Sparkle className="w-3.5 h-3.5 text-amber-500" /> Interactive Hotspots
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Interactive Shorts Player Modal */}
      {activeShortIndex !== null && (() => {
        const SHORTS_DATA = [
          {
            id: 0,
            user: 'Sagar Tinkh...',
            role: 'Owner',
            avatarText: 'ST',
            videoTitle: '2 BHK Independent Traditional Home Kitchen',
            location: 'New Diamond Nagar, Raipur',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-kitchen-interior-41584-large.mp4',
            verified: true,
          },
          {
            id: 1,
            user: 'Ravinder Mek...',
            role: 'Housing Expert Realtor',
            avatarText: 'RM',
            videoTitle: '2 BHK Modern Living Highrise Condo Tour',
            location: 'Om Shiv Kailasa, Mihan Link, Nagpur',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-apartment-living-room-interior-design-41585-large.mp4',
            verified: true,
          },
          {
            id: 2,
            user: 'Ashish Gupta',
            role: 'Housing Prime Advisor',
            avatarText: 'AG',
            avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            videoTitle: '2 BHK Spacious Family Apartment Hallroom',
            location: 'Besa society, Main Wardha Road, Nagpur',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cozy-living-room-with-a-modern-couch-41589-large.mp4',
            verified: true,
          },
          {
            id: 3,
            user: 'Rrrealtors Agency',
            role: 'Housing Consultant Partner',
            avatarText: 'R',
            videoTitle: '3 BHK Pristine Tiled Master Bedroom Suite',
            location: 'RRshankar, East Shankar Nagar, Raipur',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-home-office-with-potted-plants-41591-large.mp4',
            verified: true,
          }
        ];

        const activeShort = SHORTS_DATA[activeShortIndex];

        const handleNextShort = () => {
          if (activeShortIndex < SHORTS_DATA.length - 1) {
            setActiveShortIndex(activeShortIndex + 1);
            setShowCommentsDrawer(false);
          } else {
            alert("This is the last tour video!");
          }
        };

        const handlePrevShort = () => {
          if (activeShortIndex > 0) {
            setActiveShortIndex(activeShortIndex - 1);
            setShowCommentsDrawer(false);
          } else {
            alert("This is the first tour video!");
          }
        };

        const handleLikeToggle = () => {
          const liked = !hasLikedShort[activeShortIndex];
          setHasLikedShort(prev => ({ ...prev, [activeShortIndex]: liked }));
          setShortLikes(prev => ({
            ...prev,
            [activeShortIndex]: prev[activeShortIndex] + (liked ? 1 : -1)
          }));
        };

        const handleAddComment = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newCommentText.trim()) return;
          setShortComments(prev => ({
            ...prev,
            [activeShortIndex]: [newCommentText.trim(), ...prev[activeShortIndex]]
          }));
          setShortCommentCount(prev => ({
            ...prev,
            [activeShortIndex]: prev[activeShortIndex] + 1
          }));
          setNewCommentText('');
        };

        return (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn select-none font-sans">
            {/* Close full modal trigger */}
            <button 
              onClick={() => setActiveShortIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full cursor-pointer transition-all z-20 focus:outline-none"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Quick Helper Banner */}
            <div className="absolute top-4 left-6 hidden md:flex items-center gap-2 text-white/70 text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Scroll or Swipe using Up/Down Arrow keys</span>
            </div>

            {/* Content Core Slider Area */}
            <div className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:max-w-md sm:rounded-3xl overflow-hidden bg-zinc-950 flex shadow-2xl border-0 sm:border border-zinc-800">
              
              {/* HTML5 standard premium looping video */}
              <video
                key={activeShort.videoUrl}
                autoPlay
                loop
                playsInline
                muted={shortMuted}
                src={activeShort.videoUrl}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Click to Pause/Play and Sound toggle hot zone */}
              <div 
                onClick={() => setShortMuted(!shortMuted)}
                className="absolute inset-0 bg-transparent cursor-pointer flex items-center justify-center group"
              >
                {/* Temporary visual sound indicator on mute state changes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {shortMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
                </div>
              </div>

              {/* Cover overlays gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/80" />

              {/* TOP HUD Indicator */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-extrabold py-1 px-3.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Play className="w-3 h-3 stroke-[3] fill-slate-950 text-slate-950" />
                  Live Property Tour
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShortMuted(!shortMuted);
                  }}
                  className="bg-black/50 text-white hover:bg-black/75 p-2 rounded-full cursor-pointer backdrop-blur-xs transition-all border border-white/10"
                >
                  {shortMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* RIGHT ACTIONS COLUMN (Sidebar overlay) */}
              <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4 z-20">
                
                {/* Like Action */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle();
                    }}
                    className={`p-3 rounded-full shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-all outline-none border ${
                      hasLikedShort[activeShortIndex]
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                        : 'bg-black/50 text-white border-white/10 hover:bg-black/80'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLikedShort[activeShortIndex] ? 'fill-white' : ''}`} />
                  </button>
                  <span className="text-white text-[11px] font-black tracking-tight drop-shadow-sm">
                    {shortLikes[activeShortIndex]}
                  </span>
                </div>

                {/* Comment Action */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCommentsDrawer(!showCommentsDrawer);
                    }}
                    className={`p-3 rounded-full shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-all outline-none border ${
                      showCommentsDrawer
                        ? 'bg-amber-505 text-slate-950 bg-amber-500 border-amber-400'
                        : 'bg-black/50 text-white border-white/10 hover:bg-black/80'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <span className="text-white text-[11px] font-black tracking-tight drop-shadow-sm">
                    {shortCommentCount[activeShortIndex]}
                  </span>
                </div>

                {/* Share Action */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.href);
                      alert("Short link copied to your clipboard! Share it with friends.");
                    }}
                    className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-all border border-white/10"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-white text-[10px] font-bold">Share</span>
                </div>

                {/* Contact Owner Direct Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Interlinked short inquiry dispatched to regional agent representing ${activeShort.user}! We will text standard tour slots to your phone.`);
                  }}
                  className="bg-amber-500 text-slate-950 p-2 text-[10px] font-black uppercase tracking-tight rounded-xl hover:bg-amber-600 transform scale-95 shadow-md flex items-center justify-center gap-1 border border-amber-400"
                >
                  <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
                  Call
                </button>
              </div>

              {/* BOTTOM META INFO LAYOUT */}
              <div className="absolute bottom-4 left-4 right-16 z-10 text-left text-white pointer-events-none">
                
                {/* User creator context */}
                <div className="flex items-center gap-2 mb-2 pointer-events-auto">
                  <div className="w-8 h-8 rounded-full bg-slate-850 border-2 border-pink-500 flex items-center justify-center overflow-hidden">
                    {activeShort.avatarImg ? (
                      <img src={activeShort.avatarImg} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-extrabold">{activeShort.avatarText}</span>
                    )}
                  </div>
                  <div className="leading-none">
                    <h5 className="font-extrabold text-xs flex items-center gap-1">
                      {activeShort.user}
                      {activeShort.verified && (
                        <span className="bg-blue-500 rounded-full p-[2px] leading-none inline-flex items-center">
                          <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                        </span>
                      )}
                    </h5>
                    <p className="text-[9px] text-zinc-350 font-semibold mt-0.5">{activeShort.role}</p>
                  </div>
                </div>

                {/* Video description titles and layouts */}
                <h4 className="text-sm font-extrabold leading-snug drop-shadow-md text-slate-50">
                  {activeShort.videoTitle}
                </h4>
                <p className="text-[11px] text-zinc-300 font-semibold flex items-center gap-1.5 mt-1 drop-shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {activeShort.location}
                </p>
              </div>

              {/* COMMENTS SIDE DRAWER */}
              {showCommentsDrawer && (
                <div className="absolute inset-y-0 right-0 w-full sm:w-72 bg-slate-900/95 backdrop-blur-md shadow-2xl z-30 animate-slideLeft border-0 sm:border-l border-white/10 flex flex-col justify-between text-left">
                  
                  {/* Comments Header */}
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/40">
                    <h5 className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      Comments ({shortCommentCount[activeShortIndex]})
                    </h5>
                    <button 
                      onClick={() => setShowCommentsDrawer(false)}
                      className="text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Comments scroll area */}
                  <div className="flex-grow p-4 overflow-y-auto space-y-3.5 select-text">
                    {shortComments[activeShortIndex].length === 0 ? (
                      <div className="text-center py-10 space-y-1">
                        <p className="text-xs text-zinc-400 font-bold">No comments yet</p>
                        <p className="text-[10px] text-zinc-600 font-semibold text-center">Be the first to share questions on this tour!</p>
                      </div>
                    ) : (
                      shortComments[activeShortIndex].map((comment, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-slate-700 text-zinc-200 text-[8px] font-bold flex items-center justify-center uppercase">
                              U{(idx + (activeShortIndex * 2)) % 5 + 1}
                            </span>
                            <span className="text-[9px] text-zinc-400 font-black">Verified Inquirer</span>
                          </div>
                          <p className="text-[11px] text-zinc-200 leading-normal pl-6 font-semibold">
                            {comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment submit bar */}
                  <form onSubmit={handleAddComment} className="p-3 border-t border-white/10 bg-slate-950/60 flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add simple query..."
                      className="flex-grow bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 transition-colors text-slate-950 px-3 py-2 rounded-lg text-xs font-black uppercase cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}

              {/* Navigation Floating Handles inside/under the modal container */}
              <div className="absolute left-4 bottom-24 flex flex-col gap-2 z-20">
                {activeShortIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevShort();
                    }}
                    className="bg-black/60 hover:bg-black/80 text-white p-2 text-xs rounded-full border border-white/10 focus:outline-none cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
                {activeShortIndex < SHORTS_DATA.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextShort();
                    }}
                    className="bg-black/60 hover:bg-black/80 text-white p-2 text-xs rounded-full border border-white/10 focus:outline-none cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* Slideout Detailed Modal for Rental Option */}
      {selectedRental && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col justify-between animate-slideLeft">
            
            {/* Header */}
            <div>
              <div className="bg-[#0E1F35] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#b38330] bg-slate-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-black">{selectedRental.title}</h3>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Verified Rental Code: {selectedRental.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedRental(null);
                    setNegotiationDispatched(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/90 p-2 rounded-full cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal/Drawer Body info */}
              <div className="p-6 space-y-6 text-left">
                
                {/* Visual stats and rents info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Monthly Cost</span>
                    <span className="text-xl font-black text-[#0E1F35]">{selectedRental.price}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Refundable Deposit</span>
                    <span className="text-base font-black text-slate-805">{selectedRental.deposit}</span>
                  </div>
                </div>

                {/* Main Details block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-150 pb-1.5 flex items-center gap-1.5">
                    <Sparkle className="w-3.5 h-3.5 text-[#b38330] fill-amber-500" /> Landlord Lease Proposal
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans">
                    {selectedRental.details}
                  </p>
                </div>

                {/* 360° Virtual Tour Canvas Integration */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                  <PannellumViewer 
                    propertyName={selectedRental.title} 
                    propertyId={selectedRental.id} 
                  />
                </div>

                {/* Specific features list */}
                <div className="space-y-2.5">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Amenities Included:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedRental.features.map((feature, i) => (
                      <span key={i} className="text-[10px] text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Complete verification data rows */}
                <div className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> Locality Address
                    </span>
                    <span className="font-extrabold text-[#0E1F35] truncate max-w-1/2">{selectedRental.locality}, {selectedRental.city}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-500" /> Furnishing status
                    </span>
                    <span className="font-extrabold text-[#b38330]">{selectedRental.furnishing}</span>
                  </div>
                  <div className="p-3 bg-slate-50 flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> Water Connection
                    </span>
                    <span className="font-extrabold text-emerald-700">{selectedRental.waterSupply}</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-500" /> Electricity meter
                    </span>
                    <span className="font-extrabold text-slate-700">{selectedRental.electricityMeterStatus}</span>
                  </div>
                </div>

                {/* Direct Owner credentials */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col space-y-2">
                  <div className="flex justify-between items-center border-b border-amber-100 pb-1.5">
                    <span className="text-[9px] text-[#b38330] font-black uppercase tracking-wide">Owner Registry Card</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified Landlord
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="font-black text-slate-900 text-xs block">{selectedRental.ownerName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{selectedRental.ownerContact}</span>
                    </div>
                    {/* Direct WhatsApp Redirection Action */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=919850843447&text=${encodeURIComponent(`Hi ${selectedRental.ownerName}, I noticed your property "${selectedRental.title}" listed for rent on Urban Nest Realty. I am highly interested and would like to coordinate a site visit. Is it still available?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer shadow-sm ml-2 self-center shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                      </svg>
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </div>

                {negotiationDispatched && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs space-y-1 animate-fadeIn font-semibold">
                    <div className="font-black flex items-center gap-1.5 text-emerald-800 uppercase text-[9px] tracking-wide">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Tour Booking Dispatched
                    </div>
                    Successfully scheduled meeting with {selectedRental.ownerName}. Direct SMS has been formatted and shared with key registry guidelines. No broker commissions are involved!
                  </div>
                )}
              </div>
            </div>

            {/* Modal actions footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => {
                  setNegotiationDispatched(true);
                  alert(`Request forwarded to ${selectedRental.ownerName}. Meeting scheduled. SMS protocol active.`);
                }}
                className="flex-grow bg-[#0E1F35] hover:bg-[#b38330] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <PhoneCall className="w-4 h-4" /> Book Home Visit Now
              </button>
              <button
                onClick={() => {
                  alert(`Drafting digital rental contract. Deposit of ${selectedRental.deposit} locked into escrow draft.`);
                }}
                className="border border-slate-300 hover:bg-slate-100 font-bold px-4 py-3.5 rounded-xl text-slate-700 text-xs transition-colors cursor-pointer"
              >
                Get Draft
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Rent Map Modal */}
      {showRentMapModal && (
        <div 
          className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex animate-fadeIn cursor-pointer ${
            isMapFullscreen ? 'items-stretch justify-stretch p-0' : 'items-center justify-center p-4'
          }`}
          onClick={() => {
            setShowRentMapModal(false);
            setIsMapFullscreen(false);
          }}
        >
          <div 
            className={`bg-white overflow-hidden shadow-2xl border border-gray-150 flex flex-col cursor-default animate-scaleUp text-slate-800 transition-all duration-300 ${
              isMapFullscreen 
                ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none' 
                : 'max-w-4xl w-full max-h-[90vh] md:h-[620px] rounded-3xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0E1F35] p-5 text-white flex flex-col sm:flex-row justify-between items-center shrink-0 border-b border-white/5 gap-4">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-amber-500 animate-pulse" />
                <div className="text-left">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Interactive Housing Map & Geolocation Vetting
                  </h3>
                  <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Tap local coordinates to scan rentals precisely in Indian Metros & Smart Cities</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {/* Custom Full Screen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                  className="bg-white/10 hover:bg-white/20 text-white/90 px-3.5 py-2 rounded-xl cursor-pointer transition-all border border-white/5 flex items-center gap-1.5 hover:border-emerald-400/30"
                  title={isMapFullscreen ? "Normal Screen" : "Full Screen"}
                >
                  {isMapFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Normal View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Full Screen</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setShowRentMapModal(false);
                    setIsMapFullscreen(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/90 p-2 rounded-full cursor-pointer transition-all border border-white/5"
                  aria-label="Close Map"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content: Split 2-Columns */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden min-h-0">
              
              {/* Mobile View Switcher Tab bar */}
              <div className="md:hidden flex bg-slate-100 p-1.5 border-b border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileModalTab('map')}
                  className={`flex-1 py-2 text-xs font-black uppercase text-center rounded-xl transition-all cursor-pointer ${
                    mobileModalTab === 'map'
                      ? 'bg-[#0E1F35] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  🗺️ Explore Map
                </button>
                <button
                  type="button"
                  onClick={() => setMobileModalTab('info')}
                  className={`flex-1 py-2 text-xs font-black uppercase text-center rounded-xl transition-all cursor-pointer relative ${
                    mobileModalTab === 'info'
                      ? 'bg-[#0E1F35] text-white shadow-xs'
                      : 'text-slate-650 hover:text-[#0E1F35] bg-transparent'
                  }`}
                >
                  📋 Property Info
                  {selectedMapRental && (
                    <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              </div>
              
              {/* Map Canvas Visual (Left) */}
              <div className={`flex-grow md:w-3/5 bg-slate-100 relative overflow-hidden flex flex-col justify-between p-4 border-r border-slate-200 ${
                mobileModalTab === 'map' ? 'flex' : 'hidden md:flex'
              } ${
                isMapFullscreen ? 'h-[450px] md:h-full' : 'h-[320px] md:h-full'
              }`}>
                {/* City selection triggers inside maps - Hybrid selector with quick dropdown + scrollbar */}
                <div className="absolute top-4 left-4 right-4 z-15 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 pr-2.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <select
                      value={activeMapCity}
                      onChange={(e) => {
                        const city = e.target.value;
                        setActiveMapCity(city);
                        const cityRentals = getMapRentalsWithCoordinates(city);
                        if (cityRentals.length > 0) {
                          setSelectedMapRental(cityRentals[0]);
                        } else {
                          setSelectedMapRental(null);
                        }
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-[#0E1F35] text-[11px] font-black uppercase py-1 px-1.5 rounded-lg border border-slate-200 focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[140px]"
                    >
                      {TARGET_MAP_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow flex gap-1 overflow-x-auto py-1 scroll-smooth select-none [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-amber-400">
                    {TARGET_MAP_CITIES.map((city) => {
                      const isActive = activeMapCity === city;
                      return (
                        <button 
                          key={city}
                          type="button"
                          onClick={() => {
                            setActiveMapCity(city);
                            const cityRentals = getMapRentalsWithCoordinates(city);
                            if (cityRentals.length > 0) {
                              setSelectedMapRental(cityRentals[0]);
                            } else {
                              setSelectedMapRental(null);
                            }
                          }}
                          className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'bg-[#0E1F35] text-white shadow-xs font-black scale-105'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main Interactive Map Body Container */}
                <div className="absolute inset-0 z-0">
                  {useMockupMap ? (
                    /* Styled Vector Map Backdrop as interactive mockup */
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-[#E8ECEF] select-none opacity-90">
                        <svg className="w-full h-full stroke-slate-200" fill="none">
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" strokeWidth="0" />
                          <path d="M -50,150 Q 150,220 280,110 T 600,285" fill="none" stroke="#A5C9EB" strokeWidth="8" opacity="0.4" />
                          <circle cx="250" cy="250" r="140" stroke="#b38330" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                          <line x1="0" y1="200" x2="600" y2="200" stroke="#b38330" strokeWidth="1.5" opacity="0.15" />
                          <line x1="300" y1="0" x2="300" y2="600" stroke="#b38330" strokeWidth="1.5" opacity="0.15" />
                        </svg>
                      </div>

                      {/* Vector pins mapped on mockup grids */}
                      {getMapRentalsWithCoordinates(activeMapCity).slice(0, 6).map((item, index) => {
                        const positions: {x: string, y: string}[] = [
                          { x: '22%', y: '35%' },
                          { x: '68%', y: '25%' },
                          { x: '18%', y: '72%' },
                          { x: '52%', y: '48%' },
                          { x: '78%', y: '70%' },
                          { x: '42%', y: '82%' }
                        ];
                        const pos = positions[index % positions.length];
                        const isActive = selectedMapRental?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedMapRental(item);
                              if (window.innerWidth < 768) {
                                setMobileModalTab('info');
                              }
                            }}
                            style={{ left: pos.x, top: pos.y }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 scale-100 hover:scale-115 active:scale-90 cursor-pointer z-10"
                          >
                            <span className={`absolute -inset-2.5 rounded-full animate-ping opacity-25 ${
                              isActive ? 'bg-amber-500' : 'bg-[#0E1F35]'
                            }`}></span>
                            
                            <div className={`shadow-md rounded-2xl px-2.5 py-1.5 flex items-center gap-1 border transition-all ${
                              isActive 
                                ? 'bg-amber-500 border-amber-300 text-white font-black scale-110' 
                                : 'bg-[#0E1F35] border-slate-700 text-white hover:bg-[#b38330] hover:border-amber-300'
                            }`}>
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[10px] font-sans tracking-tight">{item.price.split(' ')[1]}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Google Maps Live Map with APIProvider and AdvancedMarker wrappers */
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <GoogleMap
                        key={activeMapCity}
                        defaultCenter={CITY_COORDINATES[activeMapCity] || { lat: 21.2514, lng: 81.6296 }}
                        defaultZoom={12}
                        mapId="DEMO_MAP_ID"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%' }}
                        gestureHandling={'cooperative'}
                      >
                        {getMapRentalsWithCoordinates(activeMapCity).slice(0, 6).map((item) => {
                          const isActive = selectedMapRental?.id === item.id;
                          return (
                            <AdvancedMarker
                              key={item.id}
                              position={{ lat: item.lat, lng: item.lng }}
                              onClick={() => {
                                setSelectedMapRental(item);
                                if (window.innerWidth < 768) {
                                  setMobileModalTab('info');
                                }
                              }}
                            >
                              <div className="relative -translate-y-1/2 scale-100 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                                <span className={`absolute -inset-1.5 rounded-full animate-ping opacity-25 ${
                                  isActive ? 'bg-amber-500' : 'bg-[#0E1F35]'
                                }`}></span>
                                <div className={`shadow-md rounded-2xl px-2.5 py-1 flex items-center gap-1 border transition-all ${
                                  isActive 
                                    ? 'bg-amber-500 border-amber-300 text-white font-black scale-110' 
                                    : 'bg-[#0E1F35] border-slate-700 text-white hover:bg-[#b38330]'
                                }`}>
                                  <MapPin className="w-3 h-3 shrink-0 text-amber-500" />
                                  <span className="text-[10px] font-sans font-extrabold tracking-tight text-white">{item.price.split(' ')[1]}</span>
                                </div>
                              </div>
                            </AdvancedMarker>
                          );
                        })}
                      </GoogleMap>
                    </APIProvider>
                  )}
                </div>

                {/* Subtitle helper showing Active Mode */}
                <span className="absolute bottom-4 left-4 z-10 bg-slate-950/90 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 uppercase tracking-widest shadow-md select-none">
                  <span className={`w-1.5 h-1.5 rounded-full ${useMockupMap ? 'bg-sky-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                  <span>{useMockupMap ? "Vector Mockup" : "Google Maps Live"} : {activeMapCity}</span>
                </span>

                {/* Controls & API Key instructions overlay */}
                <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
                  {hasValidKey ? (
                    <button
                      type="button"
                      onClick={() => setUseMockupMap(!useMockupMap)}
                      className="bg-white/95 backdrop-blur-xs text-[#0E1F35] text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-slate-200 shadow-md hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#b38330]" />
                      <span>{useMockupMap ? "Switch to Live Map" : "Switch to Vector Map"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUseMockupMap(!useMockupMap)}
                      className="bg-[#0E1F35] text-amber-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-md hover:bg-[#b38330] hover:text-white cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-500" />
                      <span>{useMockupMap ? "Setup Instructions" : "Switch to Vector Map"}</span>
                    </button>
                  )}
                </div>

                {/* Google Maps setup guidelines when key is missing and they toggle to "Instructions" */}
                {!hasValidKey && !useMockupMap && (
                  <div className="absolute inset-x-4 bottom-16 top-16 z-20 bg-slate-950/95 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl text-white flex flex-col justify-center text-left scrollbar-thin overflow-y-auto">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/20">
                        <Map className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-left space-y-1.5 flex-grow">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">Google Maps API Integration Required</h4>
                        <p className="text-[10px] text-gray-300 leading-relaxed">
                          We have fully configured the React Google Maps SDK to render housing coordinates perfectly across all 12 major Indian cities. Provide your API key in AI Studio Secrets to unlock the interactive spatial search overlay.
                        </p>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[9px] text-gray-300 space-y-2 !mt-3">
                          <p className="font-extrabold text-white text-[10px] uppercase tracking-wider border-b border-white/5 pb-1 block">Setup Procedure:</p>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-black text-center text-[8px] flex items-center justify-center">1</div><div>Get a key: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="text-amber-400 underline font-bold">console.cloud.google.com</a></div></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-black text-center text-[8px] flex items-center justify-center">2</div><div>Open AI Studio <strong>Settings</strong> (⚙️ top-right)</div></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-black text-center text-[8px] flex items-center justify-center">3</div><div>Go to <strong>Secrets</strong>, add name: <code>GOOGLE_MAPS_PLATFORM_KEY</code></div></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-black text-center text-[8px] flex items-center justify-center">4</div><div>Paste your key and press Enter. The developer environment auto-rebuilds.</div></div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUseMockupMap(true)}
                          className="mt-3 w-full bg-[#b38330] hover:bg-amber-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-2 rounded-lg transition-all text-center block"
                        >
                          Use Interoperable Vector Map Fallback
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Property Details Panel (Right) */}
              <div className={`md:w-2/5 p-6 flex flex-col justify-between bg-white text-left overflow-y-auto shrink-0 space-y-4 ${
                mobileModalTab === 'info' ? 'flex' : 'hidden md:flex'
              }`}>
                {selectedMapRental ? (
                  <div className="space-y-4 animate-scaleUp">
                    <div>
                      <span className="bg-amber-100 text-[#b38330] text-[9px] font-black uppercase px-2.5 py-1 rounded tracking-wider inline-block">
                        {selectedMapRental.city} • Verified Coordinate
                      </span>
                      <h4 className="text-base font-black text-[#0E1F35] leading-tight-none mt-1.5">{selectedMapRental.title}</h4>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b38330]" />
                        {selectedMapRental.locality}
                      </p>
                    </div>

                    <div className="h-[140px] rounded-2xl overflow-hidden border border-slate-100 relative shadow-inner shrink-0">
                      <img 
                        src={selectedMapRental.image} 
                        alt={selectedMapRental.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2.5 left-2.5 bg-[#0E1F35] text-white text-[10px] font-black px-3 py-1 rounded-md">
                        {selectedMapRental.price}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block leading-none">Configuration</span>
                        <strong className="text-slate-800 font-extrabold">{selectedMapRental.bhk} Suite</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block leading-none">Super Area</span>
                        <strong className="text-slate-850 font-extrabold">{selectedMapRental.area}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Specs Checklist:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedMapRental.features.slice(0, 3).map((feat, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-150">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic font-medium">
                      "{selectedMapRental.details}"
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRental(selectedMapRental);
                          setShowRentMapModal(false);
                          setIsMapFullscreen(false);
                        }}
                        className="w-full bg-[#0E1F35] hover:bg-[#b38330] text-white py-3 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 text-center block"
                      >
                        Explore More Intel Specs
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center items-center text-center p-6 text-slate-400">
                    <MapPin className="w-12 h-12 stroke-[1.5] text-slate-300 animate-bounce mb-3" />
                    <p className="text-xs font-bold uppercase leading-relaxed text-slate-500">No Coordinate Pin Selected</p>
                    <p className="text-[10px] text-slate-400 mt-1">Tap any glowing price-bubble coordinate pin on the Central India vector grid to audit specific rental insights instantly!</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 25-CRITERIA ADVANCED VETTING FILTERS MODAL */}
      {/* ========================================== */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-4 max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center bg-gradient-to-r from-slate-950 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="bg-[#b38330]/20 p-2.5 rounded-xl border border-[#b38330]/40 text-amber-400">
                  <SlidersHorizontal className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                    Advanced Rent Vetting
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Verify structural layouts, commutes, local rent-salary compliance and Nagpur vicinity anchors.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowAdvancedFiltersModal(false)}
                className="bg-slate-850 hover:bg-red-500/20 hover:text-red-400 text-slate-405 p-2 rounded-xl border border-slate-750 hover:border-red-500/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs (Categorized) */}
            <div className="bg-slate-950/60 border-b border-slate-800 px-3 sm:px-6 py-1.5 flex flex-wrap gap-1 sm:gap-2 overflow-x-auto shrink-0 select-none">
              {[
                { label: "Space & Commute", icon: MapPin },
                { label: "Status & Duration", icon: Clock },
                { label: "Comfort & Age", icon: Building },
                { label: "Trust & Essentials", icon: ShieldCheck },
                { label: "AI & Financials", icon: Sparkles }
              ].map((tab, idx) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveFilterCategoryTab(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
                      activeFilterCategoryTab === idx
                        ? "bg-[#b38330] border-amber-400 text-white shadow-md shadow-[#b38330]/10"
                        : "bg-transparent border-transparent text-slate-405 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow bg-slate-900/50 space-y-6">

              {/* TAB 0: 1. Location, 2. Monthly Rent, 3. Deposit, 4. Property Type, 5. BHK Type */}
              {activeFilterCategoryTab === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 1. Location & Commute Anchors, especially Nagpur */}
                  <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-550" />
                        1. Location Specs & Near Nagpur Anchors
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Nagpur Focused</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">City Preference</label>
                        <select
                          value={rentFilterCity}
                          onChange={(e) => {
                            setRentFilterCity(e.target.value);
                            if (e.target.value !== 'All') {
                              setSelectedCity(e.target.value); // Sync with primary selector
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#b38330] font-semibold text-white"
                        >
                          <option value="All">All Cities</option>
                          <option value="Nagpur">Nagpur</option>
                          <option value="Raipur">Raipur</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Pune">Pune</option>
                          <option value="Mumbai">Mumbai</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Locality Key</label>
                        <input
                          type="text"
                          value={rentFilterLocality}
                          onChange={(e) => setRentFilterLocality(e.target.value)}
                          placeholder="e.g. Wardha Road, Besa"
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#b38330] font-semibold text-white placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Landmark Spec</label>
                        <input
                          type="text"
                          value={rentFilterLandmark}
                          onChange={(e) => setRentFilterLandmark(e.target.value)}
                          placeholder="e.g. Near Metro, Mall"
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#b38330] font-semibold text-white placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Postal Pincode</label>
                        <input
                          type="text"
                          value={rentFilterPincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').substring(0, 6);
                            setRentFilterPincode(val);
                          }}
                          placeholder="e.g. 440015"
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#b38330] font-semibold text-white placeholder-slate-600"
                        />
                      </div>
                    </div>

                    {/* Proximity Checkboxes */}
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-2">
                      <span className="block text-[10px] uppercase font-black text-amber-500/85 tracking-wider">Smart Proximity Vetting (Checkbox)</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFilterNearMetro}
                            onChange={(e) => setRentFilterNearMetro(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Near Metro Line
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFilterNearOffice}
                            onChange={(e) => setRentFilterNearOffice(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Near Office Areas
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFilterNearCollege}
                            onChange={(e) => setRentFilterNearCollege(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Near Colleges
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFilterNearHospital}
                            onChange={(e) => setRentFilterNearHospital(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Near Healthcare
                        </label>
                      </div>
                    </div>

                    {/* Super handy Commute & Radius Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Max Commute Time to Work/College</label>
                        <div className="flex gap-2">
                          {['All', '15 Mins', '30 Mins', '45 Mins'].map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setRentCommuteTime(time)}
                              className={`flex-grow text-center text-xs py-1.5 rounded-lg border font-bold uppercase transition-all ${
                                rentCommuteTime === time
                                  ? 'bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-600'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Radius Target Search</label>
                        <div className="flex gap-2">
                          {['All', 'Within 1km', 'Within 3km', 'Within 5km'].map((rad) => (
                            <button
                              key={rad}
                              type="button"
                              onClick={() => {
                                setRentRadius(rad === 'All' ? 'All' : rad.replace(/\D/g, '') + 'km');
                                if (rad !== 'All') {
                                  setAutoDetectingLoc(true);
                                  setTimeout(() => setAutoDetectingLoc(false), 600);
                                }
                              }}
                              className={`flex-grow text-center text-xs py-1.5 rounded-lg border font-bold uppercase transition-all ${
                                (rad === 'All' && rentRadius === 'All') || (rad !== 'All' && rentRadius === rad.replace(/\D/g, '') + 'km')
                                  ? 'bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-600'
                                  : 'bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {rad}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Nagpur Quick Vetting Zone Map simulation */}
                    <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-850 overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded text-[9px] uppercase font-black text-amber-400">
                        <Sparkle className="w-2.5 h-2.5 animate-spin" /> Interactive Nagpur Hub Radar
                      </div>
                      <span className="block text-[11px] font-black uppercase text-slate-300 tracking-wide mb-1">
                        ⚡ Quick Nagpur Corridor Fast Filters (Tap to Target)
                      </span>
                      <p className="text-[10px] text-slate-500 mb-3">Nagpur inventory is concentrated in these premier IT/College nodes. Tap to lock immediate matches:</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: "MIHAN SEZ", loc: "MIHAN SEZ, Nagpur", desc: "For TCS/Infosys employees", lat: 21.06, lng: 79.05 },
                          { name: "Wardha Road Hub", loc: "Besa Heights, Wardha Road", desc: "For elite highrise flats", lat: 21.08, lng: 79.07 },
                          { name: "IT Parks Corridor", loc: "Manish Nagar Crossing", desc: "For software engineers", lat: 21.11, lng: 79.07 },
                          { name: "Srinivasa Colleges", loc: "Besa Heights", desc: "For students & scholars", lat: 21.09, lng: 79.06 }
                        ].map((node) => {
                          const isActive = rentFilterLocality === node.name || rentFilterLocality.toLowerCase().includes(node.name.toLowerCase().split(' ')[0]);
                          return (
                            <button
                              key={node.name}
                              type="button"
                              onClick={() => {
                                setRentFilterCity("Nagpur");
                                setSelectedCity("Nagpur");
                                setRentFilterLocality(node.name);
                                setRentMapCoordinates({ lat: node.lat, lng: node.lng });
                                alert(`Simulated GPS targeting centered at lat: ${node.lat}, lng: ${node.lng}. Local Nagpur inventory adjusted near ${node.name}.`);
                              }}
                              className={`px-3 py-2 text-[10px] sm:text-xs rounded-xl border font-bold text-left transition-all ${
                                isActive 
                                  ? 'bg-[#b38330]/25 border-amber-400 text-white' 
                                  : 'bg-slate-900 border-slate-805 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-amber-400 font-extrabold">●</span>
                                <span>{node.name}</span>
                              </div>
                              <span className="block text-[9px] text-slate-500 font-medium clear-both">{node.desc}</span>
                            </button>
                          );
                        })}
                      </div>

                      {autoDetectingLoc && (
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-xs text-amber-400 font-black tracking-wide animate-pulse uppercase">
                          📡 Auto-detecting local base stations near Nagpur...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Monthly Rent, 3. Deposit Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                        2. Monthly Rental Filter Configuration
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-grow">
                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Min Rent Cost (₹)</label>
                          <input
                            type="number"
                            value={rentPriceMin}
                            onChange={(e) => setRentPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Min (e.g. 5000)"
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div className="text-xs font-black text-slate-500 pt-5">TO</div>
                        <div className="flex-grow">
                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Max Rent Cost (₹)</label>
                          <input
                            type="number"
                            value={rentPriceMax}
                            onChange={(e) => setRentPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Max (e.g. 15000)"
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] uppercase font-black text-slate-500">Quick Ranges Selector</label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { label: 'Under ₹5k', value: '<5k' },
                            { label: '₹5k–10k', value: '5k-10k' },
                            { label: '₹10k–20k', value: '10k-20k' },
                            { label: '₹20k–50k', value: '20k-50k' },
                            { label: '₹50k+', value: '50k+' },
                            { label: 'Any', value: 'All' }
                          ].map((range) => (
                            <button
                              key={range.value}
                              type="button"
                              onClick={() => {
                                setRentPriceRangeQuick(range.value);
                                if (range.value === '<5k') { setRentPriceMin(''); setRentPriceMax(5000); }
                                else if (range.value === '5k-10k') { setRentPriceMin(5000); setRentPriceMax(10000); }
                                else if (range.value === '10k-20k') { setRentPriceMin(10000); setRentPriceMax(20000); }
                                else if (range.value === '20k-50k') { setRentPriceMin(20000); setRentPriceMax(50000); }
                                else if (range.value === '50k+') { setRentPriceMin(50000); setRentPriceMax(''); }
                                else { setRentPriceMin(''); setRentPriceMax(''); }
                              }}
                              className={`text-[10px] py-2.5 rounded-lg font-black uppercase border transition-all ${
                                rentPriceRangeQuick === range.value
                                  ? 'bg-amber-500 border-amber-400 text-slate-900'
                                  : 'bg-slate-900 border-slate-805 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        3. Rent Security Deposit Controls
                      </span>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Max Deposit Cap (₹)</label>
                        <input
                          type="number"
                          value={rentDepositMax}
                          onChange={(e) => setRentDepositMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 30000"
                          className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#b38330]"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">High deposit periods limit renters. Set custom limits.</p>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                        <div>
                          <span className="block text-xs font-black uppercase text-amber-400">Zero Deposit Properties</span>
                          <span className="block text-[10px] text-slate-400">Filter homes that require exactly 0 advance deposit.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rentZeroDeposit}
                            onChange={(e) => setRentZeroDeposit(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Property Type, 5. BHK / Room Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-550" />
                        4. Property Type Specifications
                      </span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "All", "Apartment", "Independent house", "Villa", "Builder floor", "PG", "Hostel", "Studio apartment"
                        ].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setRentPropType(type)}
                            className={`text-xs py-2 px-3.5 rounded-lg border font-black uppercase tracking-tight text-center transition-all ${
                              rentPropType === type
                                ? 'bg-amber-500 border-amber-400 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Layers className="w-3.5 h-3.5 text-amber-505" />
                        5. BHK Configuration / Room Layout
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "All", "1 RK", "1 BHK", "2 BHK", "3 BHK", "Shared room", "Private room"
                        ].map((bhkVal) => {
                          const isAct = rentBhkType === bhkVal || (bhkVal === "2 BHK" && bhkFilter === "2 BHK" && rentBhkType === "All");
                          return (
                            <button
                              key={bhkVal}
                              type="button"
                              onClick={() => {
                                setRentBhkType(bhkVal);
                                if (bhkVal !== 'All' && ['1 BHK', '2 BHK', '3 BHK'].includes(bhkVal)) {
                                  setBhkFilter(bhkVal);
                                }
                              }}
                              className={`text-xs py-2 px-3.5 rounded-lg border font-black uppercase tracking-tight text-center transition-all ${
                                isAct
                                  ? 'bg-amber-500 border-amber-400 text-slate-955 font-black'
                                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                              }`}
                            >
                              {bhkVal}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 1: 6. Furnishing, 7. Tenant Pref, 8. Gender, 9. Availability, 10. Lease */}
              {activeFilterCategoryTab === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 6. Furnishing details */}
                  <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                    <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <FileCheck className="w-3.5 h-3.5 text-amber-550" />
                      6. Furnishing Status & Essential Appliance Vetting
                    </span>

                    <div className="flex gap-2">
                      {['All', 'Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map((fur) => {
                        const isMainAct = rentFurnishing === fur || (fur === 'Semi-Furnished' && furnishingFilter === 'Semi-Furnished' && rentFurnishing === 'All');
                        return (
                          <button
                            key={fur}
                            type="button"
                            onClick={() => {
                              setRentFurnishing(fur);
                              if (fur !== 'All') {
                                setFurnishingFilter(fur);
                              }
                            }}
                            className={`flex-grow py-2 text-xs rounded-xl border font-bold uppercase transition-all text-center ${
                              isMainAct
                                ? 'bg-amber-500 border-amber-404 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {fur}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-black text-slate-400">Included Core Appliances Vetting Optionals (Checkbox)</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-lg border border-slate-805">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFurnishingAc}
                            onChange={(e) => setRentFurnishingAc(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          AC Included
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFurnishingWm}
                            onChange={(e) => setRentFurnishingWm(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Washing Machine
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFurnishingFridge}
                            onChange={(e) => setRentFurnishingFridge(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Refrigerator
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                          <input
                            type="checkbox"
                            checked={rentFurnishingBed}
                            onChange={(e) => setRentFurnishingBed(e.target.checked)}
                            className="rounded accent-amber-500 w-3.5 h-3.5 bg-slate-950 border-slate-800"
                          />
                          Bed Included
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 7. Tenant Pref, 8. Gender Pref */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Briefcase className="w-3.5 h-3.5 text-amber-550" />
                        7. Tenant Preferences (Indian Market)
                      </span>
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        {["All", "Family", "Bachelors", "Students", "Working professionals"].map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => setRentTenantPref(pref)}
                            className={`text-xs py-2 px-3 rounded-lg border font-bold uppercase transition-all tracking-tight ${
                              rentTenantPref === pref
                                ? 'bg-amber-500 border-amber-404 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-355 hover:bg-slate-800'
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-550" />
                        8. Gender Preference (PG/Hostels)
                      </span>

                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {["All", "Male", "Female", "Any"].map((gen) => (
                          <button
                            key={gen}
                            type="button"
                            onClick={() => setRentGenderPref(gen)}
                            className={`text-xs py-3.5 rounded-lg border font-black uppercase transition-all ${
                              rentGenderPref === gen
                                ? 'bg-amber-500 border-amber-404 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-355 hover:bg-slate-800'
                            }`}
                          >
                            {gen}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500">Gender specific restrictions applied strictly for shared coliving PG suites.</p>
                    </div>
                  </div>

                  {/* 9. Availability timeline, 10. Lease term */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Clock className="w-3.5 h-3.5 text-amber-550" />
                        9. Handover Availability Window
                      </span>

                      <div className="grid grid-cols-3 gap-1.5">
                        {['All', 'Available Now', 'Available Next Month'].map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setRentAvailability(av)}
                            className={`text-[10px] py-2.5 rounded-lg border font-black uppercase transition-all tracking-tight ${
                              rentAvailability === av
                                ? 'bg-amber-500 border-amber-404 text-slate-900'
                                : 'bg-slate-900 border-slate-805 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Move-In Specific Target Date</label>
                        <input
                          type="date"
                          value={rentMoveInDate}
                          onChange={(e) => setRentMoveInDate(e.target.value)}
                          className="w-full bg-slate-905 border border-slate-800 text-xs rounded-lg p-2 text-white font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <FileCheck className="w-3.5 h-3.5 text-amber-550" />
                        10. Rental Lease Duration Vetting
                      </span>

                      <div className="grid grid-cols-3 gap-1.5 pt-2">
                        {['All', 'Short-term', 'Long-term', 'Flexible Lease'].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setRentLeaseDuration(term)}
                            className={`text-[10px] py-3.5 rounded-lg border font-black uppercase text-center transition-all ${
                              rentLeaseDuration === term
                                ? 'bg-amber-500 border-amber-404 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500">Short-term: Under 6 months. Long-term: 11+ months lock-in draft.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: 11. Amenities, 12. Pets, 13. Parking, 14. Bathrooms, 15. Property Age */}
              {activeFilterCategoryTab === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 11. Comprehensive Amenities Matrix */}
                  <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                    <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-550" />
                      11. Dual-Tier Rent Amenities Matrix
                    </span>

                    {/* Essentials */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-bold text-amber-400/80 tracking-wide">Category A: Essential Vitals (Checkbox)</span>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-900 p-2.5 border border-slate-805 rounded-xl">
                        {['Parking', 'Lift', 'Security', 'WiFi', 'Power Backup', 'Water Supply'].map((item) => {
                          const isSel = rentEssentialAmenities.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                if (isSel) setRentEssentialAmenities(prev => prev.filter(i => i !== item));
                                else setRentEssentialAmenities(prev => [...prev, item]);
                              }}
                              className={`text-[10px] py-2 rounded-lg font-bold border transition-all text-center uppercase tracking-tighter ${
                                isSel
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                  : 'bg-slate-950 border-slate-805 text-slate-400 hover:text-white'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-bold text-amber-400/80 tracking-wide">Category B: Lifestyle Facilities (Checkbox)</span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 p-2.5 border border-slate-805 rounded-xl">
                        {['Gym', 'Swimming pool', 'Clubhouse', 'Study Room', 'Laundry'].map((item) => {
                          const isSel = rentLifestyleAmenities.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                if (isSel) setRentLifestyleAmenities(prev => prev.filter(i => i !== item));
                                else setRentLifestyleAmenities(prev => [...prev, item]);
                              }}
                              className={`text-[10px] py-2.5 rounded-lg font-bold border transition-all text-center uppercase tracking-tighter ${
                                isSel
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                  : 'bg-slate-950 border-slate-805 text-slate-400 hover:text-white'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 12. Pet-Friendly & 13. Parking filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Heart className="w-3.5 h-3.5 text-amber-500 hover:scale-110 duration-200" />
                        12. Pet-Friendly Rental Vetting
                      </span>

                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {['All', 'Pets Allowed', 'No Pets'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRentPetFriendly(opt)}
                            className={`text-xs py-3.5 rounded-lg border font-black uppercase text-center transition-all ${
                              rentPetFriendly === opt
                                ? 'bg-amber-500 border-amber-404 text-slate-900'
                                : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500">Filters properties that explicitly allow cats/dogs on premises.</p>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-550" />
                        13. Specific Parking Space Requirements
                      </span>

                      <div className="grid grid-cols-3 gap-1.5">
                        {['Bike Parking', 'Car Parking', 'Covered Parking'].map((prk) => {
                          const isSel = rentParkingChecked.includes(prk);
                          return (
                            <button
                              key={prk}
                              type="button"
                              onClick={() => {
                                if (isSel) setRentParkingChecked(prev => prev.filter(p => p !== prk));
                                else setRentParkingChecked(prev => [...prev, prk]);
                              }}
                              className={`text-[10px] py-3.5 rounded-lg border font-black uppercase transition-all whitespace-nowrap ${
                                isSel
                                  ? 'bg-[#b38330]/25 border-amber-405 text-amber-300'
                                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                              }`}
                            >
                              {prk}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500 block">Ensures safety of your two-wheeler or heavy sedan vehicles.</p>
                    </div>
                  </div>

                  {/* 14. Bathroom Specs, 15. Property Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-550" />
                        14. Bathroom Structures
                      </span>

                      <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Bathroom Type</label>
                          <select
                            value={rentBathroomType}
                            onChange={(e) => setRentBathroomType(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 w-full text-white font-bold font-sans"
                          >
                            <option value="All">All Types</option>
                            <option value="Attached Bathroom">Attached Only</option>
                            <option value="Shared Bathroom">Shared Bathroom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Number of Bathrooms</label>
                          <select
                            value={rentBathroomCount}
                            onChange={(e) => setRentBathroomCount(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 w-full text-white font-bold font-sans"
                          >
                            <option value="All">All Counts</option>
                            <option value="1 font-sans">1 Bath</option>
                            <option value="2 font-sans">2 Baths</option>
                            <option value="3+ font-sans">3+ Baths</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Building className="w-3.5 h-3.5 text-amber-550" />
                        15. Property Structural Age
                      </span>

                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {['All', 'New', '0-5 yrs', '5-10 yrs', '10+ yrs'].map((age) => {
                          const isAct = rentPropAge === (age === "0-5 yrs" ? "0-5 years" : age === "5-10 yrs" ? "5-10 years" : age === "10+ yrs" ? "10+ years" : age);
                          return (
                            <button
                              key={age}
                              type="button"
                              onClick={() => setRentPropAge(age === "0-5 yrs" ? "0-5 years" : age === "5-10 yrs" ? "5-10 years" : age === "10+ yrs" ? "10+ years" : age)}
                              className={`text-[9px] py-3 rounded-lg border font-black uppercase text-center transition-all ${
                                isAct
                                  ? 'bg-amber-500 border-amber-404 text-slate-955'
                                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                              }`}
                            >
                              {age}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500">Filters newly built homes or cheaper, historical property structures.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: 16. Facing, 17. Verified, 18. Posted By, 19. Posted Time, 20. Essentials */}
              {activeFilterCategoryTab === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 16. Facing & Vaastu Alignment */}
                  <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                    <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Compass className="w-3.5 h-3.5 text-amber-550" />
                      16. Facing Directions & Vaastu Alignment (Indian Market)
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {['East Facing', 'West Facing', 'Vaastu Compliant'].map((tag) => {
                        const isS = rentFacingVastu.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (isS) setRentFacingVastu(prev => prev.filter(t => t !== tag));
                              else setRentFacingVastu(prev => [...prev, tag]);
                            }}
                            className={`py-3 text-xs rounded-xl border font-black uppercase text-center transition-all ${
                              isS
                                ? 'bg-amber-500 border-amber-404 text-slate-900'
                                : 'bg-slate-900 border-slate-805 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 17. Verified Listings, 18. Owner / Broker filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-550" />
                        17. Trust-Boosting Verification Audits
                      </span>

                      <div className="space-y-2 pt-1">
                        {['Verified Owner', 'Verified Property', 'Verified Photos'].map((verVal) => {
                          const isSel = rentVerifiedFilters.includes(verVal);
                          return (
                            <label
                              key={verVal}
                              onClick={() => {
                                if (isSel) setRentVerifiedFilters(prev => prev.filter(v => v !== verVal));
                                else setRentVerifiedFilters(prev => [...prev, verVal]);
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                                isSel
                                  ? 'bg-[#b38330]/20 border-amber-404 text-white'
                                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:border-slate-800'
                              }`}
                            >
                              <span className="text-xs font-bold uppercase tracking-tight">{verVal}</span>
                              <div className={`p-1 rounded-full ${isSel ? 'bg-amber-500 text-slate-900' : 'bg-slate-950 text-slate-700'}`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Briefcase className="w-3.5 h-3.5 text-amber-550" />
                        18. Owner listings or Agency brokers Filter
                      </span>

                      <div className="flex flex-col gap-2 pt-1">
                        {[
                          { label: 'All Listings', value: 'All' },
                          { label: 'Owner Listings Only (Zero Brokerage)', value: 'Owner' },
                          { label: 'Agent Provided Listings', value: 'Agent' },
                          { label: 'Direct Builder Listings', value: 'Builder' }
                        ].map((post) => (
                          <button
                            key={post.value}
                            type="button"
                            onClick={() => {
                              setRentPostedBy(post.value);
                              if (post.value === 'Owner') {
                                setSelectedQuickFilter('Owner'); // Sync with quick cards
                              } else {
                                setSelectedQuickFilter('All');
                              }
                            }}
                            className={`w-full py-2.5 px-4 rounded-lg text-xs font-black uppercase text-left border transition-all ${
                              rentPostedBy === post.value
                                ? 'bg-amber-500 border-amber-404 text-slate-900'
                                : 'bg-slate-900 border-slate-805 text-slate-355 hover:bg-slate-800'
                            }`}
                          >
                            <span className="mr-2 text-amber-400">●</span>{post.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 19. Posted Time, 20. Nearby Essentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-4">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Clock className="w-3.5 h-3.5 text-amber-[#b38330]" />
                        19. Posted Time Stamp Age
                      </span>

                      <div className="grid grid-cols-3 gap-1.5">
                        {['All', 'Posted Today', 'Last 3 Days', 'Last Week'].map((timeOpt) => {
                          const isH = rentPostedTime === (timeOpt === "All" ? "All" : timeOpt);
                          return (
                            <button
                              key={timeOpt}
                              type="button"
                              onClick={() => setRentPostedTime(timeOpt)}
                              className={`text-[10px] py-3 rounded-lg border font-black uppercase text-center transition-all ${
                                isH
                                  ? 'bg-amber-500 border-amber-404 text-slate-900 font-extrabold'
                                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:bg-slate-800'
                              }`}
                            >
                              {timeOpt}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500">Rent inventory rotates quickly. Pinpoint fresh entries.</p>
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-555" />
                        20. Dynamic Nearby Essential Hubs
                      </span>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {['Near metro', 'Near bus stop', 'Near office', 'Near college', 'Near market', 'Near hospital'].map((essLabel) => {
                          const isS = rentNearbyEssentials.includes(essLabel);
                          return (
                            <button
                              key={essLabel}
                              type="button"
                              onClick={() => {
                                if (isS) setRentNearbyEssentials(prev => prev.filter(e => e !== essLabel));
                                else setRentNearbyEssentials(prev => [...prev, essLabel]);
                              }}
                              className={`py-2 px-3 text-[10px] sm:text-xs rounded-lg border font-bold uppercase transition-all tracking-tight ${
                                isS
                                  ? 'bg-[#b38330]/25 border-amber-404 text-amber-300'
                                  : 'bg-slate-900 border-slate-805 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              {essLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: 21. AI Smart Filters, 22. Budget Insights Calculator, 23. Food PG, 24. Sharing, 25. Internet WFH */}
              {activeFilterCategoryTab === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 21. AI Smart Recommendation Filters */}
                  <div className="bg-slate-950/45 border border-slate-800 p-4 rounded-xl space-y-3">
                    <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-550 animate-pulse" />
                      21. AI Cognitive Smart Filters (Self-Vetting Rules)
                    </span>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { label: "Any AI Preset", val: "All" },
                        { label: "“Best for Students”", val: "Best for students" },
                        { label: "“Best for Families”", val: "Best for families" },
                        { label: "“Best for Professionals”", val: "Best for professionals" },
                        { label: "“Low Commute Time”", val: "Low commute time" },
                        { label: "“Affordable with Amenities”", val: "Affordable with amenities" }
                      ].map((smart) => (
                        <button
                          key={smart.val}
                          type="button"
                          onClick={() => setRentAiSmartFilter(smart.val)}
                          className={`px-3 py-2.5 text-xs rounded-xl border font-black uppercase transition-all flex items-center gap-1.5 ${
                            rentAiSmartFilter === smart.val
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-404 text-slate-955"
                              : "bg-slate-900 border-slate-805 text-slate-300 hover:border-slate-850"
                          }`}
                        >
                          <Sparkle className="w-3 h-3 text-current" />
                          {smart.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500">Applies multi-factor filters matching Nagpur Wardha Road, Besa, student AI thresholds, and direct commute calculations.</p>
                  </div>

                  {/* 22. Budget Insights (Rent-to-Salary recommended, electricity, maintenance) */}
                  <div className="bg-slate-950/45 border border border-slate-800 p-4 rounded-xl space-y-4">
                    <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-550" />
                      22. Rent-to-Salary Calculator & Expense Estimation Insights
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-805 space-y-2">
                        <label className="block text-[10px] uppercase font-black text-amber-400/80">Enter Monthly In-Pocket Salary (₹)</label>
                        <input
                          type="number"
                          value={rentSalaryInput}
                          onChange={(e) => setRentSalaryInput(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 50000"
                          className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 text-white font-bold placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        {rentSalaryInput !== '' && (
                          <div className="bg-slate-955 p-2.5 rounded-lg border border-slate-805 text-[10px] leading-relaxed space-y-1">
                            <span className="block font-bold text-slate-400 uppercase">Recommended Safe Monthly Rent Budget (30% Rule):</span>
                            <span className="block font-black text-emerald-400 text-xs text-amber-400">₹ {Math.round(Number(rentSalaryInput) * 0.3).toLocaleString("en-IN")} / Month</span>
                            <span className="block font-semibold text-slate-500">Avoid renting anything costing above this to secure your financial buffer.</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Estimated Extra Monthly Expenses (Broadband + Maid) (₹)</label>
                          <input
                            type="number"
                            value={rentExtraExpenses}
                            onChange={(e) => setRentExtraExpenses(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="e.g. 3000"
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 text-white font-bold placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        {/* Extra Expense Toggles */}
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-300 select-none bg-slate-900 p-2 rounded-lg border border-slate-805">
                            <input
                              type="checkbox"
                              checked={rentElectricityInc}
                              onChange={(e) => setRentElectricityInc(e.target.checked)}
                              className="rounded accent-amber-500 w-3.5 h-3.5"
                            />
                            Electric. Bill Inc.
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-300 select-none bg-slate-900 p-2 rounded-lg border border-slate-805">
                            <input
                              type="checkbox"
                              checked={rentMaintenanceInc}
                              onChange={(e) => setRentMaintenanceInc(e.target.checked)}
                              className="rounded accent-amber-500 w-3.5 h-3.5"
                            />
                            Maintenance Inc.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* AI Advisor Simulator block */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider font-sans">💡 Rent-to-Salary AI Vetting Advisor</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!rentSalaryInput) {
                              alert("Please specify your monthly salary estimate first to run the analysis.");
                              return;
                            }
                            setRentAiAdvisorRunning(true);
                            setRentAiAdvisorVerdict("");
                            setTimeout(() => {
                              setRentAiAdvisorRunning(false);
                              const safeLimit = Math.round(Number(rentSalaryInput) * 0.3);
                              const targetSalary = Number(rentSalaryInput);
                              if (safeLimit < 12000) {
                                setRentAiAdvisorVerdict(`⚠️ Warning: Based on your income of ₹${targetSalary.toLocaleString()}, the standard safe monthly rent threshold is ₹${safeLimit.toLocaleString()}. Renting a 2 BHK or 3 BHK standard highrise on Wardha Road might challenge your budget. We strongly advise focusing on 1 BHK smart studio flats or PG options with internet inclusion in Raipur Institutional Link or Besa area, which will run ₹6k–8k/mo.`);
                              } else if (safeLimit >= 12000 && safeLimit <= 25000) {
                                setRentAiAdvisorVerdict(`✅ Optimal Budget: Your ₹${targetSalary.toLocaleString()} income allows a comfortable rental range up to ₹${safeLimit.toLocaleString()}. You can perfectly afford 2 BHK Premium Apartments on VIP Road or Highrise flats in Besa Valley/Wardha Road (₹12k–15k/mo). These flats include pre-fitted optical internet and water filters, reducing your extra maintenance expenses.`);
                              } else {
                                setRentAiAdvisorVerdict(`✨ Premium Buyer Category: With a ₹${targetSalary.toLocaleString()} bracket, a safe threshold of ₹${safeLimit.toLocaleString()}/mo lets you explore Whitefield Executive Villas or lakeside powai penthouses (₹35k/mo) with complete ease of mind!`);
                              }
                            }, 800);
                          }}
                          className="bg-[#b38330] hover:bg-amber-600 text-slate-955 text-[10px] font-black uppercase px-2.5 py-1 rounded transition-all cursor-pointer"
                        >
                          Run AI Audit
                        </button>
                      </div>

                      {rentAiAdvisorRunning && (
                        <div className="text-[11px] text-amber-505 font-extrabold animate-pulse uppercase tracking-widest text-center py-2 font-sans">
                          🔄 Parsing inflation indices and NMC electricity rates...
                        </div>
                      )}

                      {rentAiAdvisorVerdict !== "" && (
                        <div className="bg-slate-900 border border-slate-805 text-[11px] p-3 rounded-lg text-slate-300 leading-relaxed font-semibold animate-fadeIn font-sans">
                          {rentAiAdvisorVerdict}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 23. Food Preference (PG), 24. Sharing, 25. Internet/WFH */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* 23. Food Preferences (PG) */}
                    <div className="bg-slate-950/45 border border border-slate-800 p-4 rounded-xl space-y-2">
                      <span className="text-[11px] font-black uppercase text-amber-400 block border-b border-slate-800 pb-1.5">
                        23. Food (PG / Hostels)
                      </span>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {['All', 'Food Included', 'Veg Only', 'Non-Veg Allowed'].map((food) => (
                          <button
                            key={food}
                            type="button"
                            onClick={() => setRentFoodPreference(food)}
                            className={`w-full py-1.5 rounded-lg text-[10px] text-left px-3 font-black uppercase border transition-all ${
                              rentFoodPreference === food
                                ? 'bg-amber-500 border-amber-404 text-slate-950'
                                : 'bg-slate-900 border-slate-805 text-slate-355 hover:bg-slate-800'
                            }`}
                          >
                            {food}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 24. Room Sharing Layout */}
                    <div className="bg-slate-950/45 border border border-slate-800 p-4 rounded-xl space-y-2">
                      <span className="text-[11px] font-black uppercase text-amber-400 block border-b border-slate-800 pb-1.5 font-sans">
                        24. Room Sharing Options
                      </span>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {['All', 'Single Occupancy', 'Double Sharing', 'Triple Sharing'].map((shr) => (
                          <button
                            key={shr}
                            type="button"
                            onClick={() => setRentRoomSharing(shr)}
                            className={`w-full py-1.5 rounded-lg text-[10px] text-left px-3 font-black uppercase border transition-all ${
                              rentRoomSharing === shr
                                ? 'bg-amber-500 border-amber-404 text-slate-955'
                                : 'bg-slate-900 border-slate-805 text-slate-355 hover:bg-slate-800'
                            }`}
                          >
                            {shr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 25. Internet & Work From Home Filters */}
                    <div className="bg-slate-950/45 border border border-slate-800 p-4 rounded-xl space-y-2">
                      <span className="text-[11px] font-black uppercase text-[#b38330] block border-b border-slate-800 pb-1.5 font-sans">
                        25. Internet & WFH Vitals
                      </span>
                      
                      <div className="flex flex-col gap-1.5 pt-1">
                        {[
                          { label: 'High-speed WiFi Pre-fit', val: 'High-speed WiFi' },
                          { label: 'Ergonomic Desk/Workspace', val: 'Workspace' },
                          { label: 'Study Table setup', val: 'Study table' },
                          { label: 'Electricity Backup grid', val: 'Backup electricity' }
                        ].map((wfhItem) => {
                          const isH = rentWfhAmenities.includes(wfhItem.val);
                          return (
                            <button
                              key={wfhItem.val}
                              type="button"
                              onClick={() => {
                                if (isH) setRentWfhAmenities(prev => prev.filter(w => w !== wfhItem.val));
                                else setRentWfhAmenities(prev => [...prev, wfhItem.val]);
                              }}
                              className={`w-full py-2 rounded-lg text-[9px] text-left px-2.5 font-bold uppercase border transition-all truncate ${
                                isH
                                  ? 'bg-[#b38330]/25 border-amber-404 text-amber-300'
                                  : 'bg-slate-900 border-slate-805 text-slate-440 hover:text-white'
                              }`}
                            >
                              <span className="text-[10px] mr-1.5">{isH ? '✓' : '○'}</span>
                              {wfhItem.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="text-xs font-black uppercase text-amber-400">
                  Matches Found: <span className="text-white text-sm ml-1 px-2.5 py-1 bg-slate-900 rounded font-mono border border-slate-800">{filteredRentals.length}</span>
                </div>
                {countActiveRentFilters > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      resetAllRentFilters();
                      alert("25 criteria vetting parameters restored back to default.");
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 uppercase font-black tracking-widest underline cursor-pointer flex items-center gap-1 ml-4"
                  >
                    Clear All ({countActiveRentFilters})
                  </button>
                )}
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    // Prepopulate with Nagpur specific mock anchors
                    setRentFilterCity("Nagpur");
                    setSelectedCity("Nagpur");
                    setRentFilterLocality("Wardha Road");
                    setRentFilterNearMetro(true);
                    setRentEssentialAmenities(["WiFi", "Parking"]);
                    setActiveFilterCategoryTab(0);
                    alert("Focused search onto premium Wardha Road Nagpur flat inventories with fiber router wifi and car slots.");
                  }}
                  className="w-full sm:w-auto text-[10px] px-3.5 py-2.5 border border-slate-850 text-slate-400 hover:text-white rounded-xl uppercase font-black tracking-wider transition-colors cursor-pointer"
                >
                  Nagpur Preset
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvancedFiltersModal(false);
                    alert(`Filters applied. Running live database check over ${filteredRentals.length} available direct options in ${selectedCity === 'All' ? 'selected cities' : selectedCity}.`);
                  }}
                  className="w-full sm:w-auto bg-[#b38330] hover:bg-amber-600 text-slate-950 font-black py-2.5 px-6 rounded-xl uppercase tracking-wider text-xs transition-transform cursor-pointer shadow-md"
                >
                  Show {filteredRentals.length} Properties
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Styled Grey Footer with standard platform links & App indicators exactly matching sketch */}
      <div className="bg-[#EAEAEA] p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-300">
        <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto">
          {/* iOS Button element sketched */}
          <button 
            type="button" 
            onClick={() => alert("Dispatching client redirect to Apple App Store")}
            className="flex items-center gap-2 bg-white/95 text-slate-900 font-black uppercase text-xs px-5 py-3 rounded-xl shadow-xs border border-slate-300 cursor-pointer"
          >
            <span className="text-lg"></span> App For ios
          </button>
          {/* Android Button element sketched */}
          <button 
            type="button" 
            onClick={() => alert("Dispatching client redirect to Android Google Play Store")}
            className="flex items-center gap-2 bg-white/95 text-slate-900 font-black uppercase text-xs px-5 py-3 rounded-xl shadow-xs border border-slate-300 cursor-pointer"
          >
            <span className="text-xs">▶</span> App For Android
          </button>
        </div>

        {/* Links row sketched */}
        <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
          <button onClick={() => alert("Opening careers portal.")} className="hover:text-slate-900 hover:underline cursor-pointer">Careers</button>
          <button onClick={onBackToHome} className="hover:text-slate-900 hover:underline cursor-pointer">About Us</button>
          <button onClick={() => alert("Language preset options: English, Hindi, Marathi, Tamil.")} className="hover:text-slate-900 hover:underline cursor-pointer">Language</button>
        </div>
      </div>

    </div>
  );
}
