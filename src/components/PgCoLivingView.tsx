import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowLeft, 
  CheckCircle, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  FileCheck, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  ChevronDown, 
  Check, 
  X, 
  Phone,
  Layers,
  Info,
  DollarSign,
  User,
  Activity,
  ArrowUpRight,
  Sparkles,
  Utensils,
  Wifi,
  Tv,
  Airplay,
  Coffee,
  HeartPlus,
  Map,
  Minimize2,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../types';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// @ts-ignore
import collGuys from '../assets/images/coll_guys_1779772734998.png';
// @ts-ignore
import collGirls from '../assets/images/coll_girls_1779772757024.png';
// @ts-ignore
import collFood from '../assets/images/coll_food_1779772774704.png';
// @ts-ignore
import collPrivate from '../assets/images/coll_private_1779772796024.png';
import AdsSection from './AdsSection';

interface PgCoLivingViewProps {
  onBackToHome: () => void;
  onPropertyClick?: (id: string) => void;
  onTabChange?: (tab: TabType) => void;
}

export interface PgListing {
  id: string;
  title: string;
  roomType: '1 RK' | 'Single Bed Room' | 'Double Sharing' | 'Triple Sharing' | 'Premium Suite';
  price: string;
  numericPrice: number;
  city: string;
  locality: string;
  genderPreference: 'Unisex' | 'Girls Only' | 'Boys Only';
  deposit: string;
  image: string;
  features: string[];
  ownerName: string;
  ownerContact: string;
  verified: boolean;
  mealsIncluded: boolean;
  mealsFrequency: string;
  gatedSecurity: boolean;
  gateTimings: string;
  wifiSpeed: string;
  details: string;
}

// 51 Highly curated and structured PG/Co-Living properties
const PG_LISTINGS: PgListing[] = [
  {
    id: 'pg-1',
    title: 'Comfort 1RK Suite Kolkata Central',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Salt Lake Sector V, near Metro Core',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    features: ['Attached Washroom', '1 Gbps WiFi', 'Daily Veg/Non-Veg Meals', 'Gym & Lounge'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '10:30 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Elegant, premium 1RK studio unit fully tailored for young tech professionals. Excellent lighting and immediate room service.'
  },
  {
    id: 'pg-2',
    title: 'Salt Lake Elite Unisex Pro Space',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Karunamoyee Block, Sector II, Salt Lake',
    genderPreference: 'Unisex',
    deposit: '₹ 12,000',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    features: ['Ac & Power backup', 'Laundromat Facility', 'Individual Desk Room', 'Biometric Lock'],
    ownerName: 'Debolina Sen',
    ownerContact: '+91 82401 22910',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Highly clean corporate paying guest setup right in Salt Lake. Double security parameters and organic cafeteria service.'
  },
  {
    id: 'pg-3',
    title: 'Saraswati Girls PG near AIIMS Raipur',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Raipur',
    locality: 'Tatibandh, opposite AIIMS Campus Link',
    genderPreference: 'Girls Only',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    features: ['24/7 Female Warden', 'RO Pure Water Grid', 'Study Room Access', 'In-house Nurse Line'],
    ownerName: 'Preeti Chandrakar',
    ownerContact: '+91 94060 22319',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '10:00 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Zero stress girls pg with absolute home-vibe setup. Extremely close to academic gates with strict camera surveillance guidelines.'
  },
  {
    id: 'pg-4',
    title: 'Techno-Row Elite Co-Living Space',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'New Town Action Area I, Tech Corridor',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Modern Fitness deck', 'Smart TV Installed', 'Rooftop Cafe Pro', 'All Utility Bills Paid'],
    ownerName: 'Ranajit Bhattacharya',
    ownerContact: '+91 94331 44520',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: 'No Curfew',
    wifiSpeed: '500 Mbps',
    details: 'Next-gen co-living experience. High bandwidth wifi included. Weekly events and high comfort layouts.'
  },
  {
    id: 'pg-5',
    title: 'Koramangala Executive Double Sharing',
    roomType: 'Double Sharing',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Bengaluru',
    locality: 'Block 3 VIP Lane, Koramangala',
    genderPreference: 'Boys Only',
    deposit: '₹ 30,000',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    features: ['Attached Balcony', 'High Pressure Geyser', 'E-Gaming Lounge', 'Weekly Room Deep-Clean'],
    ownerName: 'Balan Kesavan',
    ownerContact: '+91 98450 22134',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast only',
    gatedSecurity: true,
    gateTimings: '11:30 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Fitted with luxury spring mattresses and custom working desks. Located inside high-security green sector.'
  },
  {
    id: 'pg-6',
    title: 'VIP Road Girls PG Hub',
    roomType: '1 RK',
    price: '₹ 9k / Month',
    numericPrice: 9000,
    city: 'Raipur',
    locality: 'VIP Corridor, Shankar Nagar, Raipur',
    genderPreference: 'Girls Only',
    deposit: '₹ 9,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['CCTV active row', 'Inbuilt Wooden Almirah', 'Common Kitchen access', 'Washing Machine'],
    ownerName: 'Sushma Diwan',
    ownerContact: '+91 91118 44520',
    verified: true,
    mealsIncluded: false,
    mealsFrequency: 'Unavailable',
    gatedSecurity: true,
    gateTimings: '09:30 PM strict curfew',
    wifiSpeed: '100 Mbps',
    details: 'Extremely secure and low-budget girls pg on the VIP avenue. Highly peaceful garden view veranda.'
  },
  {
    id: 'pg-7',
    title: 'Hindpiri Executive PG Ranchi',
    roomType: 'Single Bed Room',
    price: '₹ 8k / Month',
    numericPrice: 8000,
    city: 'Ranchi',
    locality: 'Hindpiri Main Bypass Roads, Ranchee',
    genderPreference: 'Boys Only',
    deposit: '₹ 8,000',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Comfort Bedding', 'Power Sump System', 'Bike Parking Row', 'Low Maintain Charges'],
    ownerName: 'Devashish Mahto',
    ownerContact: '+91 94311 88291',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Lunch & Dinner',
    gatedSecurity: false,
    gateTimings: '10:00 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Spacious independent singles pg designed for scholars near coaching systems. Pure vegetarian mess facility.'
  },
  {
    id: 'pg-8',
    title: 'Salt Lake Sector V Tech Cabin',
    roomType: 'Double Sharing',
    price: '₹ 10k / Month',
    numericPrice: 10000,
    city: 'Kolkata',
    locality: 'Salt Lake GP Block Sector V',
    genderPreference: 'Unisex',
    deposit: '₹ 20,000',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80',
    features: ['Premium workstation', 'Mini Fridge In-Room', 'All AC Rooms', 'Dry Clean Assist'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '400 Mbps',
    details: 'Dynamic, premium co-living space with dual sharing plans. Highly active networking and social community.'
  },
  {
    id: 'pg-9',
    title: 'Ratu Road Scholars Haven',
    roomType: 'Single Bed Room',
    price: '₹ 7.5k / Month',
    numericPrice: 7500,
    city: 'Ranchi',
    locality: 'Hehal, near IT Crossing, Ranchee',
    genderPreference: 'Boys Only',
    deposit: '₹ 5,000',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    features: ['Purified drinking water', 'Individual Study table', 'High Ventilation window', 'Induction cooker'],
    ownerName: 'Bijay Oraon',
    ownerContact: '+91 70041 22351',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '2 Meals/day',
    gatedSecurity: true,
    gateTimings: '10:15 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Budget-friendly boys PG inside peaceful garden backyard. Low density colony with minimal traffic noises.'
  },
  {
    id: 'pg-10',
    title: 'Wardha Road Tech-Elite Co-Living',
    roomType: 'Premium Suite',
    price: '₹ 14k / Month',
    numericPrice: 14000,
    city: 'Nagpur',
    locality: 'Chinchbhavan, Wardha Road',
    genderPreference: 'Unisex',
    deposit: '₹ 28,005',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    features: ['Smart digital locks', 'Personal washing unit', 'Gaming Zone access', 'Induction Pantry desk'],
    ownerName: 'Milind Deshpande',
    ownerContact: '+91 98812 34451',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '350 Mbps',
    details: 'Luxury studio suite optimized for executive designers. Modern smart architecture and ultra-high speed internet bandwidth.'
  },
  {
    id: 'pg-11',
    title: 'Gariahat Girls Mansion Kolkata',
    roomType: 'Single Bed Room',
    price: '₹ 11k / Month',
    numericPrice: 11000,
    city: 'Kolkata',
    locality: 'Dhakuria, Gariahat South Crossing',
    genderPreference: 'Girls Only',
    deposit: '₹ 22,000',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    features: ['In-house cook active', 'Spacious roof terrace', 'Personal storage safe', '24Hours power back'],
    ownerName: 'Debolina Sen',
    ownerContact: '+91 82401 22910',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:45 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Beautifully traditional yet fully modernized South Kolkata girls residence. Full meal index and highly helpful warden staff.'
  },
  {
    id: 'pg-12',
    title: 'Besa Central Heights Sharing PG',
    roomType: 'Double Sharing',
    price: '₹ 8.5k / Month',
    numericPrice: 8500,
    city: 'Nagpur',
    locality: 'Besa Gated Ring Road Enclave, Nagpur',
    genderPreference: 'Unisex',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Gym Membership free', 'Fully furnished lounge', 'CCTV secure gate', 'Washing machine access'],
    ownerName: 'Suresh Dandige',
    ownerContact: '+91 94221 55601',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Fitted out with smart interior designs. Low-density residential area near massive public parks.'
  },
  {
    id: 'pg-13',
    title: 'Ranchi VIP Kanke Road PG',
    roomType: 'Premium Suite',
    price: '₹ 15k / Month',
    numericPrice: 15000,
    city: 'Ranchi',
    locality: 'Kanke Road, opposite VIP Lake entrance',
    genderPreference: 'Unisex',
    deposit: '₹ 30,000',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    features: ['Balcony overlook Lake', 'Luxury memory foam', 'Biometric Entry', 'Smart TV Installed'],
    ownerName: 'Aditya Sen',
    ownerContact: '+91 80026 11451',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Custom dinner',
    gatedSecurity: true,
    gateTimings: 'No Curfew',
    wifiSpeed: '300 Mbps',
    details: 'Indulge in premium living right over Kanke Lake view lanes. Housekeeping staff on call and dedicated visitor logic room.'
  },
  {
    id: 'pg-14',
    title: 'Shankar Nagar Boys PG Raipur',
    roomType: 'Double Sharing',
    price: '₹ 7k / Month',
    numericPrice: 7000,
    city: 'Raipur',
    locality: 'Sector 3 Commercial Hub, Shankar Nagar',
    genderPreference: 'Boys Only',
    deposit: '₹ 7,000',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    features: ['Cooler for summer', 'Continuous fresh water', '2-wheeler storage lock', 'Common fridge access'],
    ownerName: 'Kuldeep Singh Sodhi',
    ownerContact: '+91 98931 00392',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Dinner only',
    gatedSecurity: false,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Very nominal price boys PG right in the center of Raipur. Walking proximity to shopping avenues and public transit lanes.'
  },
  {
    id: 'pg-15',
    title: 'Hinjewadi Elite IT-Professional PG',
    roomType: '1 RK',
    price: '₹ 13k / Month',
    numericPrice: 13000,
    city: 'Pune',
    locality: 'Phase II Smart Gate Enclave, Hinjewadi',
    genderPreference: 'Unisex',
    deposit: '₹ 25,000',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    features: ['Custom modular setup', 'Power Backup system', 'Unlimited laundry cycle', 'CCTV on entrance'],
    ownerName: 'Vijay Devrukhkar',
    ownerContact: '+91 95451 11224',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:30 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Smart space for techies in Pune. Peaceful neighborhood structure, low internal maintenance, preinstalled router nodes.'
  },
  // Adding remaining 36 mock properties to hit at least 50 listings
  {
    id: 'pg-16',
    title: 'Salt Lake Sector III Girls Nest',
    roomType: 'Triple Sharing',
    price: '₹ 6.5k / Month',
    numericPrice: 6500,
    city: 'Kolkata',
    locality: 'Salt Lake Block GD, Sector III',
    genderPreference: 'Girls Only',
    deposit: '₹ 6,500',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Highly secure parameters', 'Separate locker trunks', 'Homestyle pure food', 'Warden support Desk'],
    ownerName: 'Debolina Sen',
    ownerContact: '+91 82401 22910',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:30 PM strict curfew',
    wifiSpeed: '100 Mbps',
    details: 'Great community and budget friendly shared pg for girl students. Very close to local tutorial junctions and transport rows.'
  },
  {
    id: 'pg-17',
    title: 'Whitefield Smart IT-Row Co-Living',
    roomType: 'Single Bed Room',
    price: '₹ 14.5k / Month',
    numericPrice: 14500,
    city: 'Bengaluru',
    locality: 'Phase 2 Tech Row, Whitefield',
    genderPreference: 'Unisex',
    deposit: '₹ 30,000',
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812f4c?auto=format&fit=crop&w=600&q=80',
    features: ['Smart LED Smart TV', 'Inbuilt desk space', 'Cafetaria with Buffet', 'Gym & Table Tennis'],
    ownerName: 'Ranganath Swamy',
    ownerContact: '+91 98440 21453',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '400 Mbps',
    details: 'Elegant Single Occupancy with high privacy standards in the center of Whitefield Tech Loop sector.'
  },
  {
    id: 'pg-18',
    title: 'Kharadi Elite Shared Suite Pune',
    roomType: 'Double Sharing',
    price: '₹ 9.5k / Month',
    numericPrice: 9500,
    city: 'Pune',
    locality: 'Kharadi Outer Corridor Bypass',
    genderPreference: 'Unisex',
    deposit: '₹ 15,000',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['AC Installed', 'Individual storage cabinet', 'Ironing table row', 'Attached dry washroom'],
    ownerName: 'Vijay Devrukhkar',
    ownerContact: '+91 95451 11224',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Sophisticated shared room setups near EON IT Park gates. Zero setup friction, instant digital registration process.'
  },
  {
    id: 'pg-19',
    title: 'Namkum Meadows Co-Living Ranchi',
    roomType: 'Double Sharing',
    price: '₹ 6.5k / Month',
    numericPrice: 6500,
    city: 'Ranchi',
    locality: 'Meadows Industrial bypass, Ranchee',
    genderPreference: 'Girls Only',
    deposit: '₹ 6,500',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    features: ['Warden guidance desk', 'Water cooler filter', 'Power backups grid', 'Study lobby access'],
    ownerName: 'Sanjay Sharan',
    ownerContact: '+91 94301 99221',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:00 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Beautiful green surrounding region. Completely walled boundary and low rental index.'
  },
  {
    id: 'pg-20',
    title: 'Tatibandh Standard Boys PG Raipur',
    roomType: 'Triple Sharing',
    price: '₹ 5.5k / Month',
    numericPrice: 5500,
    city: 'Raipur',
    locality: 'AIIMS hospital rear line, Tatibandh',
    genderPreference: 'Boys Only',
    deposit: '₹ 5,000',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    features: ['Geyser access', 'Attached toilet', 'Bicycle storage deck', 'Unlimited filtered RO'],
    ownerName: 'Mahendra Verma',
    ownerContact: '+91 98271 27811',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Lunch & Dinner',
    gatedSecurity: false,
    gateTimings: '10:30 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Pocket-friendly boys shared pg mostly chosen by students of health academies. Daily cleaning services.'
  },
  {
    id: 'pg-21',
    title: 'Salt Lake AC Deluxe Unisex 1RK',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Sector I FD Block, Salt Lake',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    features: ['Top level AC unit', 'High density fiber wifi', 'Biometric Locks', 'Enclosed parking slot'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Luxury 1RK studio spaces. Soundproofing doors, ambient ceiling profiles, high corporate aesthetics.'
  },
  {
    id: 'pg-22',
    title: 'MIHAN SEZ Executive PG Nagpur',
    roomType: 'Single Bed Room',
    price: '₹ 11.5k / Month',
    numericPrice: 11500,
    city: 'Nagpur',
    locality: 'MIHAN SEZ main sector link road',
    genderPreference: 'Unisex',
    deposit: '₹ 20,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    features: ['Individual smart workspace', 'Microwave & Oven pantry', 'Premium spring bed', 'Active gym club'],
    ownerName: 'Vikas Mandlekar',
    ownerContact: '+91 98230 44521',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '300 Mbps',
    details: 'Pristine, state-of-the-art single room co-living suites for IT techies. Minimalist modular styling guidelines.'
  },
  {
    id: 'pg-23',
    title: 'Koregaon Park Riverside Girls Suite',
    roomType: 'Premium Suite',
    price: '₹ 18k / Month',
    numericPrice: 18000,
    city: 'Pune',
    locality: 'Lane 7 Premium Riverside, Koregaon Park',
    genderPreference: 'Girls Only',
    deposit: '₹ 40,000',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Lawn view balcony', 'Automatic washing center', 'Buffet dining table', '24Hours concierge support'],
    ownerName: 'Shashank Kulkarni',
    ownerContact: '+91 95455 12580',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Ultra-luxurious premium residential suite. Green, noise-free surrounding lane of Koregaon Park.'
  },
  {
    id: 'pg-24',
    title: 'Salt Lake Block HA Modern PG',
    roomType: 'Double Sharing',
    price: '₹ 9.5k / Month',
    numericPrice: 9500,
    city: 'Kolkata',
    locality: 'HA Block Sector II, Salt Lake City',
    genderPreference: 'Unisex',
    deposit: '₹ 15,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    features: ['CCTV coverage lobby', 'Common workspace lounge', 'Kitchenette with induction', 'Individual wardrobes'],
    ownerName: 'Ranajit Bhattacharya',
    ownerContact: '+91 94331 44520',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Extremely well-connected block close to Salt Lake central shopping areas and bus stands.'
  },
  {
    id: 'pg-25',
    title: 'Ratu Road Elite Girls Sanctuary',
    roomType: 'Double Sharing',
    price: '₹ 8.5k / Month',
    numericPrice: 8500,
    city: 'Ranchi',
    locality: 'Elite Block Road, Ratu Road, Ranchee',
    genderPreference: 'Girls Only',
    deposit: '₹ 8,500',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    features: ['Fingerprint safety gate', 'RO drinking plant', 'Clean linen service', 'Warden support staff'],
    ownerName: 'Vikas Swarnkar',
    ownerContact: '+91 91133 80512',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:00 PM strict curfew',
    wifiSpeed: '100 Mbps',
    details: 'A clean, highly monitored boarding setup for female college scholars and corporate trainees.'
  },
  {
    id: 'pg-26',
    title: 'Besa Heights Gated Smart PG',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Nagpur',
    locality: 'Besa Crossing link road, Nagpur',
    genderPreference: 'Unisex',
    deposit: '₹ 20,000',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    features: ['Attached smart washroom', 'Laundromat service', 'Personal key card entry', 'CCTV on entrance corridors'],
    ownerName: 'Bijay Oraon',
    ownerContact: '+91 70041 22351',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Ready to occupy premium 1 RK co-living suite. Located near Wardha Road corridor junctions.'
  },
  {
    id: 'pg-27',
    title: 'New Rajendra Nagar Prime Boys PG',
    roomType: 'Single Bed Room',
    price: '₹ 9.5k / Month',
    numericPrice: 9500,
    city: 'Raipur',
    locality: 'VIP Lane, New Rajendra Nagar, Raipur',
    genderPreference: 'Boys Only',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['AC Installed rooms', 'High pressure geyser line', 'Inbuilt desk console', 'Mineral Water Purifier'],
    ownerName: 'Devendra Chandrakar',
    ownerContact: '+91 94060 11211',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Elite single occupancy boys PG inside VIP enclave of Raipur. Safe car/bike parking area.'
  },
  {
    id: 'pg-28',
    title: 'Koramangala Block 4 Girls Sanctuary',
    roomType: 'Single Bed Room',
    price: '₹ 15k / Month',
    numericPrice: 15000,
    city: 'Bengaluru',
    locality: 'Block 4 Avenues, Koramangala',
    genderPreference: 'Girls Only',
    deposit: '₹ 45,000',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80',
    features: ['Elite residential warden', 'Personal small balcony', 'RO water and solar water', 'Fiber optic wifi active'],
    ownerName: 'Balan Nair',
    ownerContact: '+91 98860 30588',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '10:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Quiet private residential street. Surrounded by legacy architecture and beautiful parks.'
  },
  {
    id: 'pg-29',
    title: 'Salt Lake High-Rise Sector V Studio',
    roomType: 'Premium Suite',
    price: '₹ 16k / Month',
    numericPrice: 16000,
    city: 'Kolkata',
    locality: 'Salt Lake Electronic Complex Block V',
    genderPreference: 'Unisex',
    deposit: '₹ 32,000',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    features: ['Skyline balcony view', 'Modern fitness lounge access', 'Smart workspace node', 'Personal mini kitchenette'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Buffet Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '450 Mbps',
    details: 'Luxury studio PG overlooking Kolkata IT skyline. Fully independent, biometric access.'
  },
  {
    id: 'pg-30',
    title: 'Amlidih Elite Living PG Raipur',
    roomType: 'Single Bed Room',
    price: '₹ 8.5k / Month',
    numericPrice: 8500,
    city: 'Raipur',
    locality: 'Amlidih High-Income Zone, Raipur',
    genderPreference: 'Unisex',
    deposit: '₹ 8,500',
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812f4c?auto=format&fit=crop&w=600&q=80',
    features: ['Attached Bathroom', 'Continuous water sump', 'Geyser installed', 'Wardrobe & Study deck'],
    ownerName: 'Girish Agrawal',
    ownerContact: '+91 77142 99081',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Lunch & Dinner',
    gatedSecurity: false,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Freshly repainted vacant units transformed to Single Bed PG cabins. Well-ventilated spaces.'
  },
  {
    id: 'pg-31',
    title: 'Salt Lake Sector I Corner 1RK',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Sector I Near City Centre Mall, Salt Lake',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    features: ['City Centre metro walkable', 'AC & fridge inside room', 'Independent electric sub-meter', 'Homestyle meals'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Extremely premier locality with high security parameters. Ideal for tech professionals.'
  },
  {
    id: 'pg-32',
    title: 'Jamtha Sports Boulevard PG',
    roomType: 'Triple Sharing',
    price: '₹ 6k / Month',
    numericPrice: 6000,
    city: 'Nagpur',
    locality: 'Opposite VCA Stadium Entrance, Jamtha',
    genderPreference: 'Boys Only',
    deposit: '₹ 6,000',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    features: ['Sports pitch access', 'Common cooler system', 'Ample lawn perimeter', 'Filtered water supply'],
    ownerName: 'Kishore Jichkar',
    ownerContact: '+91 71224 88390',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '2 Meals/day',
    gatedSecurity: false,
    gateTimings: '10:30 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Very affordable shared PG for boys. Clean space and massive garden lawns around.'
  },
  {
    id: 'pg-33',
    title: 'Electronic City Tech Greenfield PG',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Bengaluru',
    locality: 'Phase II Peripheral IT Grid, Electronic City',
    genderPreference: 'Unisex',
    deposit: '₹ 20,000',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    features: ['Working study bay', 'Buffet dining hall', 'AC & Power backup units', 'Free bike washing station'],
    ownerName: 'Subramanya Sastry',
    ownerContact: '+91 99001 22354',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:30 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'High security tech co-living system right behind major corporate rows of Electronic City.'
  },
  {
    id: 'pg-34',
    title: 'Pune Wagholi Comfort Girls PG',
    roomType: 'Double Sharing',
    price: '₹ 7.5k / Month',
    numericPrice: 7500,
    city: 'Pune',
    locality: 'Wagholi Green Meadows corridor',
    genderPreference: 'Girls Only',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Personal secure cabinets', 'RO pure drinking water', 'High speed fiber active', 'Helpful inhouse cook'],
    ownerName: 'Abhijit Gokhale',
    ownerContact: '+91 96231 22354',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:30 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Humble girls PG inside clean green residential enclave. Complete security surveillance.'
  },
  {
    id: 'pg-35',
    title: 'Salt Lake Sector V Unisex 1RK Luxury',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Sector V GP Block near Technopolis',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    features: ['Daily professional cleaning', '1 Gbps routers in-room', 'Biometric login system', 'Gym and terrace cafe'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Custom Dinner',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '500 Mbps',
    details: 'Premium, corporate style co-living room. Enjoy highly functional spaces with zero upkeep chores.'
  },
  {
    id: 'pg-36',
    title: 'Sriram Boys PG Near Science College Ranchi',
    roomType: 'Double Sharing',
    price: '₹ 6.2k / Month',
    numericPrice: 6200,
    city: 'Ranchi',
    locality: 'Bariatu main avenue links, Ranchee',
    genderPreference: 'Boys Only',
    deposit: '₹ 5,000',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    features: ['Clean water supply', 'Continuous Power line', 'High speed unlimited wifi', 'Self cooking pantry access'],
    ownerName: 'Sanjay Sharan',
    ownerContact: '+91 94301 99221',
    verified: true,
    mealsIncluded: false,
    mealsFrequency: 'Unavailable',
    gatedSecurity: false,
    gateTimings: '10:30 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Budget-friendly student boarding house with study facilities. Easy public transport connectivity.'
  },
  {
    id: 'pg-37',
    title: 'Lalpur Elite Crossing Boys Hostel Ranchi',
    roomType: 'Triple Sharing',
    price: '₹ 5.8k / Month',
    numericPrice: 5800,
    city: 'Ranchi',
    locality: 'Lalpur Circle Bypass corridor, Ranchee',
    genderPreference: 'Boys Only',
    deposit: '₹ 5,000',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    features: ['Triple Sharing beds', 'High volume sub-mersible', 'Self-cook induction deck', 'Active ward lines'],
    ownerName: 'Rameshwar Mahto',
    ownerContact: '+91 94311 88512',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '2 Meals/day',
    gatedSecurity: false,
    gateTimings: '10:00 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Perfect setup close to Ranchi educational squares and premier coaching classes.'
  },
  {
    id: 'pg-38',
    title: 'Devendra Nagar AIIMS Link PG Raipur',
    roomType: 'Single Bed Room',
    price: '₹ 9k / Month',
    numericPrice: 9000,
    city: 'Raipur',
    locality: 'Sector 5 Main Road, Devendra Nagar, Raipur',
    genderPreference: 'Boys Only',
    deposit: '₹ 9,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    features: ['Attached washroom', 'Lobby security cameras', 'Washing machines pre-allotted', 'Purity RO active'],
    ownerName: 'Preeti Deshmukh',
    ownerContact: '+91 91118 40223',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Centrally located premium boys boarding setup. Secure compound lanes and active water supply.'
  },
  {
    id: 'pg-39',
    title: 'Koramangala Block 3 Smart Unisex Suite',
    roomType: 'Premium Suite',
    price: '₹ 17.5k / Month',
    numericPrice: 17500,
    city: 'Bengaluru',
    locality: 'Block 3 VIP Enclave, Koramangala',
    genderPreference: 'Unisex',
    deposit: '₹ 40,000',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    features: ['Luxury leather recliners', 'Fibre 500Mbps wifi', 'Personal microwave nook', 'Smart lock system active'],
    ownerName: 'Balan Kesavan',
    ownerContact: '+91 98450 22134',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '500 Mbps',
    details: 'High profile custom studio PG. Beautiful natural lighting and private access elevator.'
  },
  {
    id: 'pg-40',
    title: 'Hingna MIDC Industrial Zone Boys PG',
    roomType: 'Triple Sharing',
    price: '₹ 5.2k / Month',
    numericPrice: 5200,
    city: 'Nagpur',
    locality: 'Hingna MIDC Main Gate Link, Nagpur',
    genderPreference: 'Boys Only',
    deposit: '₹ 4,000',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    features: ['Very spacious compound', 'Bicycle storage sheds', 'Independent water pipelines', 'Cooler active lines'],
    ownerName: 'Sanjay Kolhe',
    ownerContact: '+91 98503 14522',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Dinner only',
    gatedSecurity: false,
    gateTimings: '10:30 PM curfew',
    wifiSpeed: '100 Mbps',
    details: 'Standard economical boarding setup suitable for apprentices and trainees working in Hingna MIDC sector.'
  },
  {
    id: 'pg-41',
    title: 'Dharampeth VIP Elite Boys PG Nagpur',
    roomType: 'Single Bed Room',
    price: '₹ 8.5k / Month',
    numericPrice: 8500,
    city: 'Nagpur',
    locality: 'Opposite West High Court, Dharampeth',
    genderPreference: 'Boys Only',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    features: ['Most premier neighborhood', 'Continuous NMC water tap', 'High speed unlimited wifi', 'Geyser preinstalled'],
    ownerName: 'Ramkrishna Pande',
    ownerContact: '+91 94220 11442',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Centrally located elite PG close to premium eateries, cafes and books shops in Dharampeth Nagpur.'
  },
  {
    id: 'pg-42',
    title: 'Salt Lake 1RK Unisex Standard Suite',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Sector I HA Block, Salt Lake',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    features: ['Attached restroom balcony', '300 Mbps unlimited wifi', 'Homestyle lunch dinner', 'Automatic washing access'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Enjoy excellent high contrast studio room units. Biometric security door locks and professional cleaning.'
  },
  {
    id: 'pg-43',
    title: 'Naya Raipur Sector 25 Smart Gated PG',
    roomType: 'Double Sharing',
    price: '₹ 7.8k / Month',
    numericPrice: 7800,
    city: 'Raipur',
    locality: 'Sector 25 Express Green Zone, Naya Raipur',
    genderPreference: 'Unisex',
    deposit: '₹ 10,000',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Smart automated sewer', 'Wi-Fi enabled central lobby', 'Inbuilt furniture sets', 'Recycled water garden yard'],
    ownerName: 'Amitesh Agrawal',
    ownerContact: '+91 70003 44521',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '200 Mbps',
    details: 'Live inside Raipur new smart sector. Eco-friendly parameters with smart street lighting and super high safety INDEX.'
  },
  {
    id: 'pg-44',
    title: 'Whitefield Gated Meadows Co-Living Bengaluru',
    roomType: 'Double Sharing',
    price: '₹ 11k / Month',
    numericPrice: 11000,
    city: 'Bengaluru',
    locality: 'Green Meadows Colony, Whitefield',
    genderPreference: 'Unisex',
    deposit: '₹ 25,000',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Buffet dining mess room', 'Security guards active', 'Clubhouse indoor games', 'All maintenance covered'],
    ownerName: 'Muralidhar Rao',
    ownerContact: '+91 98455 01223',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '11:30 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Outstanding double occupancy PG with premium interiors. Full-fledged dining hall with pure delicious meals.'
  },
  {
    id: 'pg-45',
    title: 'Wagholi Highway Commercial Boys PG Pune',
    roomType: 'Single Bed Room',
    price: '₹ 8.2k / Month',
    numericPrice: 8200,
    city: 'Pune',
    locality: 'Pune Nagar highway crossing, Wagholi',
    genderPreference: 'Boys Only',
    deposit: '₹ 8,000',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    features: ['AC Installed active', 'High capacity router line', 'Instant hot water lines', 'Two wheeler parking slot'],
    ownerName: 'Milind Deore',
    ownerContact: '+91 96231 44556',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Easy commute to Pune tech rows. Economic single rooms with regular disinfection layouts.'
  },
  {
    id: 'pg-46',
    title: 'Koramangala Green Block Premium Girls PG',
    roomType: 'Premium Suite',
    price: '₹ 16.5k / Month',
    numericPrice: 16500,
    city: 'Bengaluru',
    locality: 'Block 4 Avenues, Koramangala',
    genderPreference: 'Girls Only',
    deposit: '₹ 35,000',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    features: ['Cauvery drinking water', 'Individual smart locker', 'Homely organic veggies diet', 'Concierge caretaker active'],
    ownerName: 'Balan Nair',
    ownerContact: '+91 98860 30588',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '10:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Prestigious elite colony boarding for girls. Highly serene parameters and immediate customer support.'
  },
  {
    id: 'pg-47',
    title: 'Powai Boulevard Premium Unisex PG Mumbai',
    roomType: 'Premium Suite',
    price: '₹ 18k / Month',
    numericPrice: 18000,
    city: 'Mumbai',
    locality: 'Powai Boulevard side frontage, Mumbai',
    genderPreference: 'Unisex',
    deposit: '₹ 45,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    features: ['Fully automated biometric', '500 Mbps high flux routers', 'Personal microwave mini-bar', 'Full security concierge'],
    ownerName: 'Vikram Mehta',
    ownerContact: '+91 98201 55923',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast buffet included',
    gatedSecurity: true,
    gateTimings: 'No curfew',
    wifiSpeed: '500 Mbps',
    details: 'Luxurious private suites in central Powai. Excellent standard connectivity to executive avenues.'
  },
  {
    id: 'pg-48',
    title: 'Salt Lake 1RK Unisex Smart Studio',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'GD Block Sector III salt lake city',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    features: ['Attached washroom & balcony', 'Biometric modern locks', 'Unlimited high-speed routers', 'Cafetaria inside building'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '250 Mbps',
    details: 'Tailor-made co-living rooms featuring smart workstations and premium memory foam mattresses.'
  },
  {
    id: 'pg-49',
    title: 'Namkum Meadows Girls PG Ranchi',
    roomType: 'Single Bed Room',
    price: '₹ 7.8k / Month',
    numericPrice: 7800,
    city: 'Ranchi',
    locality: 'Meadows Corridor Link Road, Ranchee',
    genderPreference: 'Girls Only',
    deposit: '₹ 7,000',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    features: ['Fully gated fence', 'Purified mineral intake', 'Daily sanitizing lobby', 'Warden guard desk'],
    ownerName: 'Sanjay Sharan',
    ownerContact: '+91 94301 99221',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: '3 Meals/day',
    gatedSecurity: true,
    gateTimings: '09:00 PM strict curfew',
    wifiSpeed: '100 Mbps',
    details: 'Safe, secure residential PG for girl scholars with regular hot homestyle meals.'
  },
  {
    id: 'pg-50',
    title: 'Salt Lake Sector V Unisex 1RK Elite',
    roomType: '1 RK',
    price: '₹ 12k / Month',
    numericPrice: 12000,
    city: 'Kolkata',
    locality: 'Ring Avenue Salt Lake Sector V',
    genderPreference: 'Unisex',
    deposit: '₹ 24,000',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    features: ['AC Comfort preinstalled', 'Gym membership included', '300 Mbps wifi router', 'Dry cleaning facility'],
    ownerName: 'Subir Mukherjee',
    ownerContact: '+91 98305 11204',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '300 Mbps',
    details: 'Top caliber luxury 1 RK studio block near tech park. Experience hassle-free executive standard co-living.'
  },
  {
    id: 'pg-51',
    title: 'Tatibandh College AIIMS Corner PG Raipur',
    roomType: 'Double Sharing',
    price: '₹ 6.8k / Month',
    numericPrice: 6800,
    city: 'Raipur',
    locality: 'AIIMS college link Bypass road, Raipur',
    genderPreference: 'Unisex',
    deposit: '₹ 6,000',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    features: ['Water purification prefit', 'Attached terrace balcony', 'Independent electric meters', 'Close parking yard'],
    ownerName: 'Lalit Agrawal',
    ownerContact: '+91 98271 22334',
    verified: true,
    mealsIncluded: true,
    mealsFrequency: 'Breakfast & Dinner',
    gatedSecurity: true,
    gateTimings: '11:00 PM curfew',
    wifiSpeed: '150 Mbps',
    details: 'Very central location near AIIMS campus. Low density colony with zero traffic noises, optimal for studying scholars.'
  }
];

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Raipur': { lat: 21.2514, lng: 81.6296 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
};

const TARGET_MAP_CITIES = ['Kolkata', 'Raipur', 'Ranchi', 'Nagpur', 'Pune', 'Bengaluru'];

export default function PgCoLivingView({ onBackToHome, onPropertyClick, onTabChange }: PgCoLivingViewProps) {
  // Navigation & Search / Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [mealsFilter, setMealsFilter] = useState('All'); // 'Yes', 'No', 'All'
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  // Advanced filters modal visualization states
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false);
  const [activeFilterCategoryTab, setActiveFilterCategoryTab] = useState(0);

  // States for Geolocation PG Map
  const [showPgMapModal, setShowPgMapModal] = useState<boolean>(false);
  const [activeMapCity, setActiveMapCity] = useState<string>('Kolkata');
  const [selectedMapListing, setSelectedMapListing] = useState<any | null>(null);
  const [useMockupMap, setUseMockupMap] = useState<boolean>(!hasValidKey);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);
  const [mobileModalTab, setMobileModalTab] = useState<'map' | 'info'>('map');

  const getMapPgResultsWithCoordinates = (city: string): (any & { lat: number; lng: number })[] => {
    const rawListings = [...PG_LISTINGS].filter(item => item.city === city);
    const center = CITY_COORDINATES[city] || { lat: 22.5726, lng: 88.3639 };
    const offsets = [
      { dLat: 0.009, dLng: -0.013 },
      { dLat: -0.014, dLng: 0.012 },
      { dLat: 0.016, dLng: 0.014 },
      { dLat: -0.008, dLng: -0.015 },
      { dLat: 0.012, dLng: -0.007 },
      { dLat: -0.004, dLng: 0.009 },
    ];
    return rawListings.map((r, i) => {
      const offset = offsets[i % offsets.length];
      return {
        ...r,
        lat: center.lat + offset.dLat,
        lng: center.lng + offset.dLng,
      };
    });
  };

  useEffect(() => {
    if (showPgMapModal && !selectedMapListing) {
      const r = getMapPgResultsWithCoordinates(activeMapCity);
      if (r.length > 0) setSelectedMapListing(r[0]);
    }
  }, [showPgMapModal, activeMapCity]);

  // 1. Location Filters
  const [pgLocality, setPgLocality] = useState('');
  const [pgLandmark, setPgLandmark] = useState('');
  const [pgNearCollege, setPgNearCollege] = useState(false);
  const [pgNearOfficeArea, setPgNearOfficeArea] = useState(false);
  const [pgNearMetroBusStop, setPgNearMetroBusStop] = useState(false);
  const [pgCommuteTimeSearch, setPgCommuteTimeSearch] = useState('All');
  const [pgNearbyWorkplaceFilter, setPgNearbyWorkplaceFilter] = useState('All');
  const [pgRadiusSearch, setPgRadiusSearch] = useState('All');

  // 3. Deposit Filter
  const [pgSecurityDepositMax, setPgSecurityDepositMax] = useState<number | ''>('');
  const [pgZeroDeposit, setPgZeroDeposit] = useState(false);

  // 4. Room Sharing Type Multi-Check
  const [pgRoomSharingSingle, setPgRoomSharingSingle] = useState(false);
  const [pgRoomSharingDouble, setPgRoomSharingDouble] = useState(false);
  const [pgRoomSharingTriple, setPgRoomSharingTriple] = useState(false);
  const [pgRoomSharingDormitory, setPgRoomSharingDormitory] = useState(false);

  // 6. Occupancy Type
  const [pgOccupancyType, setPgOccupancyType] = useState('All');

  // 7. Furnishing Filters
  const [pgFurnishBed, setPgFurnishBed] = useState(false);
  const [pgFurnishMattress, setPgFurnishMattress] = useState(false);
  const [pgFurnishWardrobe, setPgFurnishWardrobe] = useState(false);
  const [pgFurnishStudyTable, setPgFurnishStudyTable] = useState(false);
  const [pgFurnishAC, setPgFurnishAC] = useState(false);
  const [pgFurnishFan, setPgFurnishFan] = useState(false);
  const [pgFurnishGeyser, setPgFurnishGeyser] = useState(false);
  const [pgFurnishSmartTv, setPgFurnishSmartTv] = useState(false);
  const [pgFurnishBalcony, setPgFurnishBalcony] = useState(false);
  const [pgFurnishAttachedBathroom, setPgFurnishAttachedBathroom] = useState(false);

  // 8. Food Availability
  const [pgFoodIncluded, setPgFoodIncluded] = useState(false);
  const [pgFoodVegOnly, setPgFoodVegOnly] = useState(false);
  const [pgFoodNonVegAllowed, setPgFoodNonVegAllowed] = useState(false);
  const [pgFoodBreakfast, setPgFoodBreakfast] = useState(false);
  const [pgFoodLunch, setPgFoodLunch] = useState(false);
  const [pgFoodDinner, setPgFoodDinner] = useState(false);

  // 9. Bathroom Type
  const [pgBathroomAttached, setPgBathroomAttached] = useState(false);
  const [pgBathroomShared, setPgBathroomShared] = useState(false);

  // 10. WiFi & Work Setup
  const [pgWifiHighSpeed, setPgWifiHighSpeed] = useState(false);
  const [pgWifiWorkspace, setPgWifiWorkspace] = useState(false);
  const [pgWifiStudyRoom, setPgWifiStudyRoom] = useState(false);
  const [pgWifiBackupElectricity, setPgWifiBackupElectricity] = useState(false);

  // 11. Amenities Filter
  const [pgAmenityLaundry, setPgAmenityLaundry] = useState(false);
  const [pgAmenityHousekeeping, setPgAmenityHousekeeping] = useState(false);
  const [pgAmenityPowerBackup, setPgAmenityPowerBackup] = useState(false);
  const [pgAmenityCctv, setPgAmenityCctv] = useState(false);
  const [pgAmenitySecurityGuard, setPgAmenitySecurityGuard] = useState(false);
  const [pgAmenityWaterSupply, setPgAmenityWaterSupply] = useState(false);
  const [pgAmenityGym, setPgAmenityGym] = useState(false);
  const [pgAmenityCommonLounge, setPgAmenityCommonLounge] = useState(false);
  const [pgAmenityGamingZone, setPgAmenityGamingZone] = useState(false);
  const [pgAmenityTerrace, setPgAmenityTerrace] = useState(false);
  const [pgAmenityCafeteria, setPgAmenityCafeteria] = useState(false);

  // 12. Safety Filters
  const [pgSafetyBiometric, setPgSafetyBiometric] = useState(false);
  const [pgSafetyCurfewTiming, setPgSafetyCurfewTiming] = useState('All');

  // 13. Availability Filter
  const [pgAvailableNow, setPgAvailableNow] = useState(false);
  const [pgMoveInDate, setPgMoveInDate] = useState('');

  // 14. Lease Duration
  const [pgLeaseShortTerm, setPgLeaseShortTerm] = useState(false);
  const [pgLeaseMonthly, setPgLeaseMonthly] = useState(false);
  const [pgLeaseLongTerm, setPgLeaseLongTerm] = useState(false);
  const [pgLeaseFlexible, setPgLeaseFlexible] = useState(false);

  // 15. Curfew & Rules
  const [pgRuleNoCurfew, setPgRuleNoCurfew] = useState(false);
  const [pgRuleVisitorAllowed, setPgRuleVisitorAllowed] = useState(false);
  const [pgRuleSmokingAllowed, setPgRuleSmokingAllowed] = useState(false);
  const [pgRuleDrinkingAllowed, setPgRuleDrinkingAllowed] = useState(false);

  // 16. Nearby Essentials
  const [pgNearEssMarket, setPgNearEssMarket] = useState(false);
  const [pgNearEssHospital, setPgNearEssHospital] = useState(false);
  const [pgNearEssGym, setPgNearEssGym] = useState(false);

  // 17. Pet-Friendly Filter
  const [pgPetsAllowed, setPgPetsAllowed] = useState(false);
  const [pgNoPets, setPgNoPets] = useState(false);

  // 18. Verified Listings
  const [pgVerifOwner, setPgVerifOwner] = useState(false);
  const [pgVerifPg, setPgVerifPg] = useState(false);
  const [pgVerifPhotos, setPgVerifPhotos] = useState(false);
  const [pgVerifAmenities, setPgVerifAmenities] = useState(false);

  // 19. Owner / Managed By
  const [pgManagedBy, setPgManagedBy] = useState('All');

  // 20. Posted Time
  const [pgPostedTime, setPgPostedTime] = useState('All');

  // 21. AI Smart Filters (Very Important)
  const [pgAiBestForStudents, setPgAiBestForStudents] = useState(false);
  const [pgAiBestForWorkers, setPgAiBestForWorkers] = useState(false);
  const [pgAiBestForGirls, setPgAiBestForGirls] = useState(false);
  const [pgAiQuietEnvironment, setPgAiQuietEnvironment] = useState(false);
  const [pgAiBudgetFriendly, setPgAiBudgetFriendly] = useState(false);

  // 22. Lifestyle Filters
  const [pgLifeCommunityEvents, setPgLifeCommunityEvents] = useState(false);
  const [pgLifeNetworking, setPgLifeNetworking] = useState(false);
  const [pgLifeStartupFriendly, setPgLifeStartupFriendly] = useState(false);
  const [pgLifeFitness, setPgLifeFitness] = useState(false);

  // 23. Included Charges
  const [pgChargeElectricity, setPgChargeElectricity] = useState(false);
  const [pgChargeWater, setPgChargeWater] = useState(false);
  const [pgChargeMaintenance, setPgChargeMaintenance] = useState(false);
  const [pgChargeWifi, setPgChargeWifi] = useState(false);

  // 24. Roommate Preferences
  const [pgRoommateNonSmoker, setPgRoommateNonSmoker] = useState(false);
  const [pgRoommateStudent, setPgRoommateStudent] = useState(false);
  const [pgRoommateWorkingProf, setPgRoommateWorkingProf] = useState(false);

  // Calculate active filters count
  const countActivePgFilters = useMemo(() => {
    let count = 0;
    if (pgLocality) count++;
    if (pgLandmark) count++;
    if (pgNearCollege) count++;
    if (pgNearOfficeArea) count++;
    if (pgNearMetroBusStop) count++;
    if (pgCommuteTimeSearch !== 'All') count++;
    if (pgNearbyWorkplaceFilter !== 'All') count++;
    if (pgRadiusSearch !== 'All') count++;
    if (pgSecurityDepositMax !== '') count++;
    if (pgZeroDeposit) count++;
    if (pgRoomSharingSingle) count++;
    if (pgRoomSharingDouble) count++;
    if (pgRoomSharingTriple) count++;
    if (pgRoomSharingDormitory) count++;
    if (pgOccupancyType !== 'All') count++;
    if (pgFurnishBed) count++;
    if (pgFurnishMattress) count++;
    if (pgFurnishWardrobe) count++;
    if (pgFurnishStudyTable) count++;
    if (pgFurnishAC) count++;
    if (pgFurnishFan) count++;
    if (pgFurnishGeyser) count++;
    if (pgFurnishSmartTv) count++;
    if (pgFurnishBalcony) count++;
    if (pgFurnishAttachedBathroom) count++;
    if (pgFoodIncluded) count++;
    if (pgFoodVegOnly) count++;
    if (pgFoodNonVegAllowed) count++;
    if (pgFoodBreakfast) count++;
    if (pgFoodLunch) count++;
    if (pgFoodDinner) count++;
    if (pgBathroomAttached) count++;
    if (pgBathroomShared) count++;
    if (pgWifiHighSpeed) count++;
    if (pgWifiWorkspace) count++;
    if (pgWifiStudyRoom) count++;
    if (pgWifiBackupElectricity) count++;
    if (pgAmenityLaundry) count++;
    if (pgAmenityHousekeeping) count++;
    if (pgAmenityPowerBackup) count++;
    if (pgAmenityCctv) count++;
    if (pgAmenitySecurityGuard) count++;
    if (pgAmenityWaterSupply) count++;
    if (pgAmenityGym) count++;
    if (pgAmenityCommonLounge) count++;
    if (pgAmenityGamingZone) count++;
    if (pgAmenityTerrace) count++;
    if (pgAmenityCafeteria) count++;
    if (pgSafetyBiometric) count++;
    if (pgSafetyCurfewTiming !== 'All') count++;
    if (pgAvailableNow) count++;
    if (pgMoveInDate) count++;
    if (pgLeaseShortTerm) count++;
    if (pgLeaseMonthly) count++;
    if (pgLeaseLongTerm) count++;
    if (pgLeaseFlexible) count++;
    if (pgRuleNoCurfew) count++;
    if (pgRuleVisitorAllowed) count++;
    if (pgRuleSmokingAllowed) count++;
    if (pgRuleDrinkingAllowed) count++;
    if (pgNearEssMarket) count++;
    if (pgNearEssHospital) count++;
    if (pgNearEssGym) count++;
    if (pgPetsAllowed) count++;
    if (pgNoPets) count++;
    if (pgVerifOwner) count++;
    if (pgVerifPg) count++;
    if (pgVerifPhotos) count++;
    if (pgVerifAmenities) count++;
    if (pgManagedBy !== 'All') count++;
    if (pgPostedTime !== 'All') count++;
    if (pgAiBestForStudents) count++;
    if (pgAiBestForWorkers) count++;
    if (pgAiBestForGirls) count++;
    if (pgAiQuietEnvironment) count++;
    if (pgAiBudgetFriendly) count++;
    if (pgLifeCommunityEvents) count++;
    if (pgLifeNetworking) count++;
    if (pgLifeStartupFriendly) count++;
    if (pgLifeFitness) count++;
    if (pgChargeElectricity) count++;
    if (pgChargeWater) count++;
    if (pgChargeMaintenance) count++;
    if (pgChargeWifi) count++;
    if (pgRoommateNonSmoker) count++;
    if (pgRoommateStudent) count++;
    if (pgRoommateWorkingProf) count++;
    return count;
  }, [
    pgLocality, pgLandmark, pgNearCollege, pgNearOfficeArea, pgNearMetroBusStop,
    pgCommuteTimeSearch, pgNearbyWorkplaceFilter, pgRadiusSearch, pgSecurityDepositMax,
    pgZeroDeposit, pgRoomSharingSingle, pgRoomSharingDouble, pgRoomSharingTriple,
    pgRoomSharingDormitory, pgOccupancyType, pgFurnishBed, pgFurnishMattress,
    pgFurnishWardrobe, pgFurnishStudyTable, pgFurnishAC, pgFurnishFan, pgFurnishGeyser,
    pgFurnishSmartTv, pgFurnishBalcony, pgFurnishAttachedBathroom, pgFoodIncluded,
    pgFoodVegOnly, pgFoodNonVegAllowed, pgFoodBreakfast, pgFoodLunch, pgFoodDinner,
    pgBathroomAttached, pgBathroomShared, pgWifiHighSpeed, pgWifiWorkspace,
    pgWifiStudyRoom, pgWifiBackupElectricity, pgAmenityLaundry, pgAmenityHousekeeping,
    pgAmenityPowerBackup, pgAmenityCctv, pgAmenitySecurityGuard, pgAmenityWaterSupply,
    pgAmenityGym, pgAmenityCommonLounge, pgAmenityGamingZone, pgAmenityTerrace,
    pgAmenityCafeteria, pgSafetyBiometric, pgSafetyCurfewTiming, pgAvailableNow,
    pgMoveInDate, pgLeaseShortTerm, pgLeaseMonthly, pgLeaseLongTerm, pgLeaseFlexible,
    pgRuleNoCurfew, pgRuleVisitorAllowed, pgRuleSmokingAllowed, pgRuleDrinkingAllowed,
    pgNearEssMarket, pgNearEssHospital, pgNearEssGym, pgPetsAllowed, pgNoPets,
    pgVerifOwner, pgVerifPg, pgVerifPhotos, pgVerifAmenities, pgManagedBy, pgPostedTime,
    pgAiBestForStudents, pgAiBestForWorkers, pgAiBestForGirls, pgAiQuietEnvironment,
    pgAiBudgetFriendly, pgLifeCommunityEvents, pgLifeNetworking, pgLifeStartupFriendly,
    pgLifeFitness, pgChargeElectricity, pgChargeWater, pgChargeMaintenance, pgChargeWifi,
    pgRoommateNonSmoker, pgRoommateStudent, pgRoommateWorkingProf
  ]);

  const resetAllPgFilters = () => {
    // Standard filters
    setCityFilter('All');
    setRoomTypeFilter('All');
    setGenderFilter('All');
    setMealsFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    
    // Advanced location
    setPgLocality('');
    setPgLandmark('');
    setPgNearCollege(false);
    setPgNearOfficeArea(false);
    setPgNearMetroBusStop(false);
    setPgCommuteTimeSearch('All');
    setPgNearbyWorkplaceFilter('All');
    setPgRadiusSearch('All');

    // Deposit
    setPgSecurityDepositMax('');
    setPgZeroDeposit(false);

    // Sharing type
    setPgRoomSharingSingle(false);
    setPgRoomSharingDouble(false);
    setPgRoomSharingTriple(false);
    setPgRoomSharingDormitory(false);

    // Occupancy
    setPgOccupancyType('All');

    // Furnishing
    setPgFurnishBed(false);
    setPgFurnishMattress(false);
    setPgFurnishWardrobe(false);
    setPgFurnishStudyTable(false);
    setPgFurnishAC(false);
    setPgFurnishFan(false);
    setPgFurnishGeyser(false);
    setPgFurnishSmartTv(false);
    setPgFurnishBalcony(false);
    setPgFurnishAttachedBathroom(false);

    // Food
    setPgFoodIncluded(false);
    setPgFoodVegOnly(false);
    setPgFoodNonVegAllowed(false);
    setPgFoodBreakfast(false);
    setPgFoodLunch(false);
    setPgFoodDinner(false);

    // Bathroom type
    setPgBathroomAttached(false);
    setPgBathroomShared(false);

    // WiFi
    setPgWifiHighSpeed(false);
    setPgWifiWorkspace(false);
    setPgWifiStudyRoom(false);
    setPgWifiBackupElectricity(false);

    // Amenities
    setPgAmenityLaundry(false);
    setPgAmenityHousekeeping(false);
    setPgAmenityPowerBackup(false);
    setPgAmenityCctv(false);
    setPgAmenitySecurityGuard(false);
    setPgAmenityWaterSupply(false);
    setPgAmenityGym(false);
    setPgAmenityCommonLounge(false);
    setPgAmenityGamingZone(false);
    setPgAmenityTerrace(false);
    setPgAmenityCafeteria(false);

    // Safety
    setPgSafetyBiometric(false);
    setPgSafetyCurfewTiming('All');

    // Availability
    setPgAvailableNow(false);
    setPgMoveInDate('');

    // Lease
    setPgLeaseShortTerm(false);
    setPgLeaseMonthly(false);
    setPgLeaseLongTerm(false);
    setPgLeaseFlexible(false);

    // Rules
    setPgRuleNoCurfew(false);
    setPgRuleVisitorAllowed(false);
    setPgRuleSmokingAllowed(false);
    setPgRuleDrinkingAllowed(false);

    // Nearby Essentials
    setPgNearEssMarket(false);
    setPgNearEssHospital(false);
    setPgNearEssGym(false);

    // Pet friendly
    setPgPetsAllowed(false);
    setPgNoPets(false);

    // Verified
    setPgVerifOwner(false);
    setPgVerifPg(false);
    setPgVerifPhotos(false);
    setPgVerifAmenities(false);

    // Managed by
    setPgManagedBy('All');

    // Posted time
    setPgPostedTime('All');

    // AI
    setPgAiBestForStudents(false);
    setPgAiBestForWorkers(false);
    setPgAiBestForGirls(false);
    setPgAiQuietEnvironment(false);
    setPgAiBudgetFriendly(false);

    // Lifestyle
    setPgLifeCommunityEvents(false);
    setPgLifeNetworking(false);
    setPgLifeStartupFriendly(false);
    setPgLifeFitness(false);

    // Included charges
    setPgChargeElectricity(false);
    setPgChargeWater(false);
    setPgChargeMaintenance(false);
    setPgChargeWifi(false);

    // Roommate preferences
    setPgRoommateNonSmoker(false);
    setPgRoommateStudent(false);
    setPgRoommateWorkingProf(false);
  };
  
  // Selected Detail Modal State
  const [selectedPg, setSelectedPg] = useState<PgListing | null>(null);
  const [showInquirySuccess, setShowInquirySuccess] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Combine core properties with custom uploaded PG properties
  const [customPgListings, setCustomPgListings] = useState<any[]>([]);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const stored = localStorage.getItem('nest_uploaded_custom_properties_pg/co-living');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map(p => ({
              ...p,
              numericPrice: parseInt(p.price.replace(/[^\d]/g, '')) || 8500,
              city: p.location.split(',').pop()?.trim() || 'Nagpur',
              locality: p.location.split(',')[0]?.trim() || 'Dharampeth',
              areaLabel: p.location.split(',')[0]?.trim() || 'Dharampeth',
              builder: 'Hostel Landlord Ltd',
              roomType: 'Double Sharing',
              genderPreference: 'Co-ed',
              mealsIncluded: true,
              managedBy: 'Nest Broker',
              status: 'Ready to move',
              sizeSqft: parseInt(p.area.replace(/[^\d]/g, '')) || 250,
              bhkVal: 1,
              ageYears: 1,
              possessionDays: 0,
              gatedCommunity: true,
              reraStatus: 'Registered',
              commuteTimeMins: 5,
              features: ['Wi-Fi Included', 'Laundry Facility', 'Purified Water', 'Power Backup'],
              amenities: ['Power Backup', 'Water Source', 'Security'],
              investmentTag: 'Budget Friendly',
              aiTag: 'Best student PG',
              locationIndex: 90,
              structuralIndex: 94,
              carpetArea: p.area,
              superBuiltupArea: p.area,
              possessionStatus: 'Ready and Open'
            }));
            setCustomPgListings(mapped);
          }
        } else {
          setCustomPgListings([]);
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

  const pgListingsToUse = useMemo(() => {
    return [...customPgListings, ...PG_LISTINGS];
  }, [customPgListings]);

  // Tab change inside PgCoLivingView
  const handleTabClick = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Filtered PG / Co-living records based on user selection
  const filteredListings = useMemo(() => {
    return pgListingsToUse.filter(pg => {
      // City lookup compatibility: standard "Kolkata" or misspelled checks
      const matchesCity = cityFilter === 'All' || 
        (cityFilter === 'Kolkata' && (pg.city.toLowerCase() === 'kolkata' || pg.locality.toLowerCase().includes('kolkata'))) ||
        pg.city.toLowerCase() === cityFilter.toLowerCase();
      
      const matchesRoomType = roomTypeFilter === 'All' || pg.roomType === roomTypeFilter;
      const matchesGender = genderFilter === 'All' || pg.genderPreference === genderFilter;

      let matchesMeals = true;
      if (mealsFilter === 'Yes') matchesMeals = pg.mealsIncluded;
      if (mealsFilter === 'No') matchesMeals = !pg.mealsIncluded;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        pg.title.toLowerCase().includes(query) ||
        pg.locality.toLowerCase().includes(query) ||
        pg.city.toLowerCase().includes(query) ||
        pg.roomType.toLowerCase().includes(query) ||
        pg.genderPreference.toLowerCase().includes(query);

      const matchesMinPrice = minPrice === '' || pg.numericPrice >= minPrice;
      const matchesMaxPrice = maxPrice === '' || pg.numericPrice <= maxPrice;

      // 1. Locality & Landmark
      const matchesLocality = !pgLocality.trim() || pg.locality.toLowerCase().includes(pgLocality.trim().toLowerCase()) || pg.title.toLowerCase().includes(pgLocality.trim().toLowerCase());
      const matchesLandmark = !pgLandmark.trim() || pg.locality.toLowerCase().includes(pgLandmark.trim().toLowerCase()) || pg.details.toLowerCase().includes(pgLandmark.trim().toLowerCase()) || pg.title.toLowerCase().includes(pgLandmark.trim().toLowerCase());
      
      // Near academic institutions (Near college / VNIT / medical college)
      const isAcad = pg.locality.toLowerCase().includes('college') || pg.locality.toLowerCase().includes('university') || pg.locality.toLowerCase().includes('vnit') || pg.locality.toLowerCase().includes('aiims') || pg.locality.toLowerCase().includes('iit') || pg.details.toLowerCase().includes('college') || pg.details.toLowerCase().includes('vnit') || pg.details.toLowerCase().includes('campus') || pg.details.toLowerCase().includes('student') || pg.title.toLowerCase().includes('college') || pg.title.toLowerCase().includes('vnit');
      const matchesNearCollege = !pgNearCollege || isAcad;

      // Near office areas / MIHAN
      const isOffice = pg.locality.toLowerCase().includes('office') || pg.locality.toLowerCase().includes('sector') || pg.locality.toLowerCase().includes('tech') || pg.locality.toLowerCase().includes('it ') || pg.locality.toLowerCase().includes('mihan') || pg.details.toLowerCase().includes('it park') || pg.details.toLowerCase().includes('corp') || pg.details.toLowerCase().includes('office') || pg.details.toLowerCase().includes('mihan') || pg.details.toLowerCase().includes('professional') || pg.title.toLowerCase().includes('mihan') || pg.title.toLowerCase().includes('tech');
      const matchesNearOfficeArea = !pgNearOfficeArea || isOffice;

      // Near metro/bus stop
      const isMetro = pg.locality.toLowerCase().includes('metro') || pg.locality.toLowerCase().includes('bus') || pg.locality.toLowerCase().includes('station') || pg.details.toLowerCase().includes('metro') || pg.details.toLowerCase().includes('bus') || pg.details.toLowerCase().includes('transit');
      const matchesNearMetroBusStop = !pgNearMetroBusStop || isMetro;

      // Commute time search
      let matchesCommute = true;
      if (pgCommuteTimeSearch !== 'All') {
        const hasCommute = pg.details.toLowerCase().includes('minute') || pg.details.toLowerCase().includes('min ') || pg.details.toLowerCase().includes('walk') || pg.details.toLowerCase().includes('near') || pg.locality.toLowerCase().includes('near');
        if (pgCommuteTimeSearch === 'Within 10 mins') {
          matchesCommute = hasCommute && (pg.details.toLowerCase().includes('5 min') || pg.details.toLowerCase().includes('10 min') || pg.locality.toLowerCase().includes('opposite'));
        } else if (pgCommuteTimeSearch === 'Within 20 mins') {
          matchesCommute = hasCommute && (pg.details.toLowerCase().includes('15 min') || pg.details.toLowerCase().includes('20 min') || pg.details.toLowerCase().includes('5 min') || pg.details.toLowerCase().includes('10 min'));
        }
      }

      // Nearby workplace filter (MIHAN, VNIT, medical college, etc.)
      let matchesWorkplace = true;
      if (pgNearbyWorkplaceFilter !== 'All') {
        const wp = pgNearbyWorkplaceFilter.toLowerCase();
        matchesWorkplace = pg.locality.toLowerCase().includes(wp) || pg.details.toLowerCase().includes(wp) || pg.title.toLowerCase().includes(wp);
      }

      // Radius search
      let matchesRadius = true;
      if (pgRadiusSearch !== 'All') {
        const hasDist = pg.details.toLowerCase().includes('km') || pg.details.toLowerCase().includes('walk') || pg.locality.toLowerCase().includes('opposite') || pg.details.toLowerCase().includes('near');
        if (pgRadiusSearch === 'Within 1 km') {
          matchesRadius = hasDist && (pg.details.toLowerCase().includes('0.') || pg.details.toLowerCase().includes('500m') || pg.details.toLowerCase().includes('100m') || pg.locality.toLowerCase().includes('opposite'));
        } else if (pgRadiusSearch === 'Within 3 km') {
          matchesRadius = hasDist;
        }
      }

      // Security deposit
      let matchesDeposit = true;
      const depositVal = pg.deposit ? parseInt(pg.deposit.replace(/[^0-9]/g, ''), 10) || 0 : 0;
      if (pgSecurityDepositMax !== '') {
        matchesDeposit = depositVal <= pgSecurityDepositMax;
      }
      if (pgZeroDeposit) {
        matchesDeposit = depositVal === 0 || pg.deposit.toLowerCase().includes('zero') || pg.deposit.toLowerCase().includes('no deposit') || depositVal <= 3000;
      }

      // Room Sharing Type Multi-Check
      let matchesSharing = true;
      const offersSingle = pg.roomType === 'Single Bed Room' || pg.roomType === '1 RK' || pg.roomType === 'Premium Suite' || pg.details.toLowerCase().includes('single');
      const offersDouble = pg.roomType === 'Double Sharing' || pg.details.toLowerCase().includes('double') || pg.details.toLowerCase().includes('twin');
      const offersTriple = pg.roomType === 'Triple Sharing' || pg.details.toLowerCase().includes('triple') || pg.details.toLowerCase().includes('three');
      const offersDormitory = pg.roomType === 'Triple Sharing' || pg.details.toLowerCase().includes('dorm') || pg.details.toLowerCase().includes('hostel');

      if (pgRoomSharingSingle || pgRoomSharingDouble || pgRoomSharingTriple || pgRoomSharingDormitory) {
        matchesSharing = (pgRoomSharingSingle && offersSingle) ||
                         (pgRoomSharingDouble && offersDouble) ||
                         (pgRoomSharingTriple && offersTriple) ||
                         (pgRoomSharingDormitory && offersDormitory);
      }

      // Occupancy Type
      let matchesOccupancy = true;
      if (pgOccupancyType !== 'All') {
        const detailsLower = pg.details.toLowerCase();
        if (pgOccupancyType === 'Students') {
          matchesOccupancy = detailsLower.includes('student') || detailsLower.includes('scholar') || detailsLower.includes('college') || detailsLower.includes('acad') || detailsLower.includes('vnit') || detailsLower.includes('aiims');
        } else if (pgOccupancyType === 'Working professionals') {
          matchesOccupancy = detailsLower.includes('professional') || detailsLower.includes('work') || detailsLower.includes('corporate') || detailsLower.includes('office') || detailsLower.includes('tech');
        } else if (pgOccupancyType === 'Families') {
          matchesOccupancy = detailsLower.includes('family') || detailsLower.includes('unisex') || detailsLower.includes('couple');
        }
      }

      // Furnishing Filters
      const featuresLower = pg.features.map(f => f.toLowerCase());
      const descLower = pg.details.toLowerCase();

      const hasBed = featuresLower.some(f => f.includes('bed') || f.includes('room') || f.includes('suite')) || descLower.includes('bed') || pg.roomType.includes('Bed');
      const hasMattress = descLower.includes('mattress') || descLower.includes('comfort') || descLower.includes('bed') || featuresLower.some(f => f.includes('bed'));
      const hasWardrobe = descLower.includes('wardrobe') || descLower.includes('cupboard') || descLower.includes('locker') || featuresLower.some(f => f.includes('wardrobe') || f.includes('locker'));
      const hasStudyTable = featuresLower.some(f => f.includes('desk') || f.includes('table') || f.includes('study')) || descLower.includes('desk') || descLower.includes('table') || descLower.includes('study');
      const hasAC = featuresLower.some(f => f.includes('ac') || f.includes('aircon') || f.includes('conditioning')) || descLower.includes('ac ') || descLower.includes('air cond') || descLower.includes('air-cond') || pg.features.join(' ').toUpperCase().includes('AC');
      const hasFan = descLower.includes('fan') || descLower.includes('ventilation') || hasAC;
      const hasGeyser = descLower.includes('geyser') || descLower.includes('hot water') || featuresLower.some(f => f.includes('geyser') || f.includes('washroom'));
      const hasSmartTv = descLower.includes('tv') || descLower.includes('television') || descLower.includes('smart tv') || featuresLower.some(f => f.includes('tv') || f.includes('television'));
      const hasBalcony = descLower.includes('balcony') || descLower.includes('terrace') || descLower.includes('view') || featuresLower.some(f => f.includes('balcony') || f.includes('terrace'));
      const hasAttachedBathroom = featuresLower.some(f => f.includes('attached') || f.includes('washroom') || f.includes('bathroom') || f.includes('private washroom')) || descLower.includes('attached') || descLower.includes('washroom');

      const matchesFurnishing = (!pgFurnishBed || hasBed) &&
                                (!pgFurnishMattress || hasMattress) &&
                                (!pgFurnishWardrobe || hasWardrobe) &&
                                (!pgFurnishStudyTable || hasStudyTable) &&
                                (!pgFurnishAC || hasAC) &&
                                (!pgFurnishFan || hasFan) &&
                                (!pgFurnishGeyser || hasGeyser) &&
                                (!pgFurnishSmartTv || hasSmartTv) &&
                                (!pgFurnishBalcony || hasBalcony) &&
                                (!pgFurnishAttachedBathroom || hasAttachedBathroom);

      // Food Availability
      const pgMealsFeat = pg.features.join(' ').toLowerCase();
      const servesVegOnly = descLower.includes('veg only') || descLower.includes('pure veg') || descLower.includes('saraswati') || pg.title.toLowerCase().includes('saraswati');
      const servesNonVeg = descLower.includes('non-veg') || pgMealsFeat.includes('non-veg') || descLower.includes('veg/non-veg') || pgMealsFeat.includes('veg/non-veg');
      const breakfastInc = pgMealsFeat.includes('breakfast') || descLower.includes('breakfast') || pg.mealsFrequency.toLowerCase().includes('breakfast') || pg.mealsFrequency.toLowerCase().includes('meals');
      const lunchInc = descLower.includes('lunch') || pg.mealsFrequency.toLowerCase().includes('3 meals') || pg.mealsFrequency.toLowerCase().includes('meals');
      const dinnerInc = pgMealsFeat.includes('dinner') || descLower.includes('dinner') || pg.mealsFrequency.toLowerCase().includes('dinner') || pg.mealsFrequency.toLowerCase().includes('meals');

      const matchesFood = (!pgFoodIncluded || pg.mealsIncluded) &&
                          (!pgFoodVegOnly || (pg.mealsIncluded && servesVegOnly)) &&
                          (!pgFoodNonVegAllowed || servesNonVeg) &&
                          (!pgFoodBreakfast || breakfastInc) &&
                          (!pgFoodLunch || lunchInc) &&
                          (!pgFoodDinner || dinnerInc);

      // Bathroom Type
      const matchesBathroom = (!pgBathroomAttached || hasAttachedBathroom) &&
                              (!pgBathroomShared || !hasAttachedBathroom);

      // WiFi & Work Setup
      const speedMbps = pg.wifiSpeed ? parseInt(pg.wifiSpeed.replace(/[^0-9]/g, ''), 10) || 0 : 0;
      const isHighWifi = speedMbps >= 100 || pg.features.join(' ').toLowerCase().includes('1 gbps') || descLower.includes('high speed wifi');
      
      const matchesWork = (!pgWifiHighSpeed || isHighWifi) &&
                          (!pgWifiWorkspace || hasStudyTable) &&
                          (!pgWifiStudyRoom || descLower.includes('study room') || descLower.includes('lounge') || featuresLower.some(f => f.includes('study') || f.includes('lounge'))) &&
                          (!pgWifiBackupElectricity || featuresLower.some(f => f.includes('power') || f.includes('backup')) || descLower.includes('power backup') || descLower.includes('electricity'));

      // Amenities Filter
      const hasLaundry = featuresLower.some(f => f.includes('laundry') || f.includes('laundromat') || f.includes('machine')) || descLower.includes('laundry') || descLower.includes('washing machine');
      const hasHousekeeping = descLower.includes('housekeeping') || descLower.includes('cleaning') || descLower.includes('service') || featuresLower.some(f => f.includes('housekeeping') || f.includes('cleaning'));
      const hasPowerBackup = featuresLower.some(f => f.includes('power') || f.includes('backup')) || descLower.includes('power backup') || descLower.includes('generator');
      const hasCctv = featuresLower.some(f => f.includes('cctv') || f.includes('camera') || f.includes('secure')) || descLower.includes('cctv') || descLower.includes('camera') || descLower.includes('security check');
      const hasSecurityGuard = pg.gatedSecurity || descLower.includes('guard') || descLower.includes('warden') || descLower.includes('security');
      const hasWaterSupply = descLower.includes('water') || featuresLower.some(f => f.includes('water')) || descLower.includes('ro');
      
      const hasGym = featuresLower.some(f => f.includes('gym') || f.includes('fitness')) || descLower.includes('gym') || descLower.includes('fitness');
      const hasLounge = featuresLower.some(f => f.includes('lounge') || f.includes('common')) || descLower.includes('lounge') || descLower.includes('common room');
      const hasGaming = descLower.includes('game') || descLower.includes('gaming') || descLower.includes('recreation') || descLower.includes('playstation');
      const hasTerrace = descLower.includes('terrace') || descLower.includes('rooftop');
      const hasCafeteria = descLower.includes('cafeteria') || descLower.includes('canteen') || descLower.includes('mess') || descLower.includes('kitchen') || pg.mealsIncluded;

      const matchesAmenities = (!pgAmenityLaundry || hasLaundry) &&
                               (!pgAmenityHousekeeping || hasHousekeeping) &&
                               (!pgAmenityPowerBackup || hasPowerBackup) &&
                               (!pgAmenityCctv || hasCctv) &&
                               (!pgAmenitySecurityGuard || hasSecurityGuard) &&
                               (!pgAmenityWaterSupply || hasWaterSupply) &&
                               (!pgAmenityGym || hasGym) &&
                               (!pgAmenityCommonLounge || hasLounge) &&
                               (!pgAmenityGamingZone || hasGaming) &&
                               (!pgAmenityTerrace || hasTerrace) &&
                               (!pgAmenityCafeteria || hasCafeteria);

      // Safety Filters
      const hasBiometric = descLower.includes('biometric') || descLower.includes('smart key') || descLower.includes('mesh card') || featuresLower.some(f => f.includes('biometric'));
      let matchesSafetyCurfew = true;
      if (pgSafetyCurfewTiming !== 'All') {
        if (pgSafetyCurfewTiming === 'No curfew') {
          matchesSafetyCurfew = pg.gateTimings.toLowerCase().includes('no curfew') || pg.gateTimings.toLowerCase().includes('24/7') || pg.gateTimings.toLowerCase().includes('flexible');
        } else {
          matchesSafetyCurfew = pg.gateTimings.toLowerCase().includes('curfew') || pg.gateTimings.toLowerCase().includes('pm');
        }
      }

      const matchesSafety = (!pgSafetyBiometric || hasBiometric) && matchesSafetyCurfew;

      // Availability Filter
      const isAvailNow = !descLower.includes('full') && !descLower.includes('sold out') && !descLower.includes('occupied') && !descLower.includes('next month');
      const matchesAvailability = !pgAvailableNow || isAvailNow;

      // Lease Duration
      const shortTerm = descLower.includes('short stay') || descLower.includes('short-term') || descLower.includes('daily') || descLower.includes('monthly') || descLower.includes('weekly') || descLower.includes('flexible');
      const monthlySt = descLower.includes('monthly') || descLower.includes('flexible') || !descLower.includes('1 year min') || !descLower.includes('11 month min');
      const longTerm = descLower.includes('long term') || descLower.includes('1 year') || descLower.includes('11 month') || !shortTerm;
      const flexLease = descLower.includes('flexible') || descLower.includes('no lock-in') || descLower.includes('month-to-month');

      const matchesLease = (!pgLeaseShortTerm || shortTerm) &&
                           (!pgLeaseMonthly || monthlySt) &&
                           (!pgLeaseLongTerm || longTerm) &&
                           (!pgLeaseFlexible || flexLease);

      // Curfew & Rules
      const rulesNoCurfew = pg.gateTimings.toLowerCase().includes('no curfew') || pg.gateTimings.toLowerCase().includes('24/7') || pg.gateTimings.toLowerCase().includes('flexible');
      const visitorAllowed = descLower.includes('visitor') || descLower.includes('guest allowed') || !descLower.includes('no visitor') || !descLower.includes('no guests');
      const smoking = descLower.includes('smoking area') || descLower.includes('smoke allowed');
      const drinking = descLower.includes('drinking allowed') || descLower.includes('alcohol allowed') || !descLower.includes('no alcohol');

      const matchesRules = (!pgRuleNoCurfew || rulesNoCurfew) &&
                           (!pgRuleVisitorAllowed || visitorAllowed) &&
                           (!pgRuleSmokingAllowed || smoking) &&
                           (!pgRuleDrinkingAllowed || drinking);

      // Nearby Essentials (Market, Hospital, Gym)
      const nearMarket = descLower.includes('market') || descLower.includes('mall') || descLower.includes('shopping') || descLower.includes('bazaar');
      const nearHospital = descLower.includes('hospital') || descLower.includes('clinic') || descLower.includes('medical') || pg.locality.toLowerCase().includes('aiims');
      const nearGym = hasGym || descLower.includes('fitness center') || descLower.includes('workout');

      const matchesNearbyEss = (!pgNearEssMarket || nearMarket) &&
                              (!pgNearEssHospital || nearHospital) &&
                              (!pgNearEssGym || nearGym);

      // Pet Friendly
      const petsAllowed = descLower.includes('pets allowed') || descLower.includes('pet friendly') || descLower.includes('dog') || descLower.includes('cat');
      const matchesPets = (!pgPetsAllowed || petsAllowed) &&
                          (!pgNoPets || !petsAllowed);

      // Verified Listings
      const matchesVerified = (!pgVerifOwner || pg.verified) &&
                             (!pgVerifPg || pg.verified) &&
                             (!pgVerifPhotos || pg.verified) &&
                             (!pgVerifAmenities || pg.verified);

      // Owner / Managed by
      const isOwnerManaged = !descLower.includes('brand') && !descLower.includes('stanza') || pg.ownerName.split(' ').length <= 3;
      const isProfessionalCorpo = descLower.includes('brand') || descLower.includes('stanza') || descLower.includes('colive') || descLower.includes('zolo') || descLower.includes('corporate managed');
      let matchesManaged = true;
      if (pgManagedBy === 'Owner') {
        matchesManaged = isOwnerManaged;
      } else if (pgManagedBy === 'Professional Brand') {
        matchesManaged = isProfessionalCorpo;
      }

      // AI Smart Filters
      const isBestStudent = isAcad || pg.roomType.includes('Sharing') || descLower.includes('student') || descLower.includes('study') || pg.numericPrice <= 8000;
      const isBestWorker = isOffice || isHighWifi || descLower.includes('professional') || descLower.includes('quiet') || hasStudyTable;
      const isBestGirls = pg.genderPreference === 'Girls Only' || pg.features.join(' ').toLowerCase().includes('warden') || descLower.includes('female');
      const isQuietEnv = descLower.includes('quiet') || descLower.includes('calm') || descLower.includes('silence') || descLower.includes('peace') || descLower.includes('residential colony');
      const isBudgetFriendly = pg.numericPrice < 8000 || descLower.includes('budget') || descLower.includes('affordable');

      const matchesAi = (!pgAiBestForStudents || isBestStudent) &&
                        (!pgAiBestForWorkers || isBestWorker) &&
                        (!pgAiBestForGirls || isBestGirls) &&
                        (!pgAiQuietEnvironment || isQuietEnv) &&
                        (!pgAiBudgetFriendly || isBudgetFriendly);

      // Lifestyle Filters
      const hasEvents = descLower.includes('event') || descLower.includes('community') || descLower.includes('gather') || descLower.includes('social') || descLower.includes('networking');
      const hasNet = descLower.includes('network') || descLower.includes('meetup') || descLower.includes('connect');
      const hasStartup = descLower.includes('startup') || descLower.includes('entrepreneur') || descLower.includes('founder') || isHighWifi;
      const hasLifeFit = hasGym || descLower.includes('yoga') || descLower.includes('sports');

      const matchesLifestyle = (!pgLifeCommunityEvents || hasEvents) &&
                               (!pgLifeNetworking || hasNet) &&
                               (!pgLifeStartupFriendly || hasStartup) &&
                               (!pgLifeFitness || hasLifeFit);

      // Included Charges
      const isElecInc = descLower.includes('electricity included') || descLower.includes('bills included') || descLower.includes('power included');
      const isWaterInc = descLower.includes('water supply included') || descLower.includes('bills included') || descLower.includes('ro water');
      const isMaintInc = descLower.includes('maintenance included') || descLower.includes('no maintenance') || descLower.includes('free maintenance');
      const isWifiInc = isHighWifi || descLower.includes('wifi included') || descLower.includes('internet included') || descLower.includes('free wifi');

      const matchesCharges = (!pgChargeElectricity || isElecInc) &&
                             (!pgChargeWater || isWaterInc) &&
                             (!pgChargeMaintenance || isMaintInc) &&
                             (!pgChargeWifi || isWifiInc);

      // Roommate Preferences
      const prefNonSmoker = descLower.includes('non-smoker') || descLower.includes('no smoking') || !smoking;
      const prefStudent = descLower.includes('student') || isAcad;
      const prefWorkingProf = descLower.includes('professional') || isOffice;

      const matchesRoommates = (!pgRoommateNonSmoker || prefNonSmoker) &&
                               (!pgRoommateStudent || prefStudent) &&
                               (!pgRoommateWorkingProf || prefWorkingProf);

      return matchesCity && matchesRoomType && matchesGender && matchesMeals && matchesSearch && matchesMinPrice && matchesMaxPrice &&
             matchesLocality && matchesLandmark && matchesNearCollege && matchesNearOfficeArea && matchesNearMetroBusStop &&
             matchesCommute && matchesWorkplace && matchesRadius && matchesDeposit && matchesSharing && matchesOccupancy &&
             matchesFurnishing && matchesFood && matchesBathroom && matchesWork && matchesAmenities && matchesSafety &&
             matchesAvailability && matchesLease && matchesRules && matchesNearbyEss && matchesPets && matchesVerified &&
             matchesManaged && matchesAi && matchesLifestyle && matchesCharges && matchesRoommates;
    });
  }, [
    searchQuery, cityFilter, roomTypeFilter, genderFilter, mealsFilter, minPrice, maxPrice,
    pgLocality, pgLandmark, pgNearCollege, pgNearOfficeArea, pgNearMetroBusStop,
    pgCommuteTimeSearch, pgNearbyWorkplaceFilter, pgRadiusSearch, pgSecurityDepositMax,
    pgZeroDeposit, pgRoomSharingSingle, pgRoomSharingDouble, pgRoomSharingTriple,
    pgRoomSharingDormitory, pgOccupancyType, pgFurnishBed, pgFurnishMattress,
    pgFurnishWardrobe, pgFurnishStudyTable, pgFurnishAC, pgFurnishFan, pgFurnishGeyser,
    pgFurnishSmartTv, pgFurnishBalcony, pgFurnishAttachedBathroom, pgFoodIncluded,
    pgFoodVegOnly, pgFoodNonVegAllowed, pgFoodBreakfast, pgFoodLunch, pgFoodDinner,
    pgBathroomAttached, pgBathroomShared, pgWifiHighSpeed, pgWifiWorkspace,
    pgWifiStudyRoom, pgWifiBackupElectricity, pgAmenityLaundry, pgAmenityHousekeeping,
    pgAmenityPowerBackup, pgAmenityCctv, pgAmenitySecurityGuard, pgAmenityWaterSupply,
    pgAmenityGym, pgAmenityCommonLounge, pgAmenityGamingZone, pgAmenityTerrace,
    pgAmenityCafeteria, pgSafetyBiometric, pgSafetyCurfewTiming, pgAvailableNow,
    pgMoveInDate, pgLeaseShortTerm, pgLeaseMonthly, pgLeaseLongTerm, pgLeaseFlexible,
    pgRuleNoCurfew, pgRuleVisitorAllowed, pgRuleSmokingAllowed, pgRuleDrinkingAllowed,
    pgNearEssMarket, pgNearEssHospital, pgNearEssGym, pgPetsAllowed, pgNoPets,
    pgVerifOwner, pgVerifPg, pgVerifPhotos, pgVerifAmenities, pgManagedBy, pgPostedTime,
    pgAiBestForStudents, pgAiBestForWorkers, pgAiBestForGirls, pgAiQuietEnvironment,
    pgAiBudgetFriendly, pgLifeCommunityEvents, pgLifeNetworking, pgLifeStartupFriendly,
    pgLifeFitness, pgChargeElectricity, pgChargeWater, pgChargeMaintenance, pgChargeWifi,
    pgRoommateNonSmoker, pgRoommateStudent, pgRoommateWorkingProf
  ]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      alert('Please fill out name and contact phone number.');
      return;
    }
    setShowInquirySuccess(true);
    setTimeout(() => {
      setShowInquirySuccess(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  // Render 5 Popular PGs precisely as seen in the mockup
  const popularFive = useMemo(() => {
    return pgListingsToUse.slice(0, 5);
  }, [pgListingsToUse]);

  return (
    <div className="bg-[#F9FBFC] min-h-screen selection:bg-amber-100 selection:text-amber-900 pb-16">
      
      {/* Search Layout Stage (Matches mockup exactly) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 font-sans space-y-12">
        
        {/* Back and Breadcrumb line */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#b38330] transition-all uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#b38330]" /> Back to home
          </button>
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" /> PREMIUM PG/CO-LIVING EXPLORER
          </div>
        </div>

        {/* Tab selection gold bar row exactly matching screenshot */}
        <div className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-100">
          <div className="bg-[#b38330] rounded-t-2xl flex flex-wrap pt-2 px-3">
            {(['Buy', 'Sell', 'Rent', 'Plots', 'PG/Co-Living'] as TabType[]).map((tab) => {
              const isSelected = tab === 'PG/Co-Living';
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

          {/* Search bar inside the custom container precisely matching the header of the screenshot */}
          <div className="bg-[#0E1F35] p-6 space-y-4 shadow-lg">
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="relative w-full flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
                <input
                  type="text"
                  value={searchQuery}
                  aria-label="Search locality or PG builder"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for locality, landmark, project or builder in Kolkata, Raipur..."
                  className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border-none transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#c0c4cc] hover:bg-white text-slate-950 font-bold uppercase text-xs sm:text-sm px-10 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm border border-slate-300"
              >
                Search
              </button>
            </form>

            {/* Quick Filters Pill Bar matching BuyView */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-white select-none">
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter By:
              </span>

              {/* City dropdown selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">City</span>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                  style={{ backgroundColor: '#132640' }}
                >
                  <option value="All" className="text-slate-900 bg-white">All Cities</option>
                  <option value="Kolkata" className="text-slate-900 bg-white">Kolkata</option>
                  <option value="Raipur" className="text-slate-900 bg-white">Raipur</option>
                  <option value="Ranchi" className="text-slate-900 bg-white">Ranchi</option>
                  <option value="Nagpur" className="text-slate-900 bg-white">Nagpur</option>
                  <option value="Pune" className="text-slate-900 bg-white">Pune</option>
                  <option value="Bengaluru" className="text-slate-900 bg-white">Bengaluru</option>
                </select>
              </div>

              {/* Room Setup */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Room Setup</span>
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                  style={{ backgroundColor: '#132640' }}
                >
                  <option value="All" className="text-slate-900 bg-white">All Layouts</option>
                  <option value="1 RK" className="text-slate-900 bg-white">1 RK Studio</option>
                  <option value="Single Bed Room" className="text-slate-900 bg-white">Single Room</option>
                  <option value="Double Sharing" className="text-slate-900 bg-white">Double Sharing</option>
                  <option value="Triple Sharing" className="text-slate-900 bg-white">Triple Sharing</option>
                  <option value="Premium Suite" className="text-slate-900 bg-white">Premium Suite</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Gender</span>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                  style={{ backgroundColor: '#132640' }}
                >
                  <option value="All" className="text-slate-900 bg-white">No Preference</option>
                  <option value="Girls Only" className="text-slate-900 bg-white">Girls Only</option>
                  <option value="Boys Only" className="text-slate-900 bg-white">Boys Only</option>
                  <option value="Unisex" className="text-slate-900 bg-white">Unisex</option>
                </select>
              </div>

              {/* Diet/Meals */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Meals</span>
                <select
                  value={mealsFilter}
                  onChange={(e) => setMealsFilter(e.target.value)}
                  className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                  style={{ backgroundColor: '#132640' }}
                >
                  <option value="All" className="text-slate-900 bg-white">Any Diet</option>
                  <option value="Yes" className="text-slate-900 bg-white font-semibold">Meals Included</option>
                  <option value="No" className="text-slate-900 bg-white font-semibold">No Meals</option>
                </select>
              </div>

              {/* Max Price Selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Max budget</span>
                <select
                  value={maxPrice === '' ? 'All' : maxPrice.toString()}
                  onChange={(e) => setMaxPrice(e.target.value === 'All' ? '' : Number(e.target.value))}
                  className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                  style={{ backgroundColor: '#132640' }}
                >
                  <option value="All" className="text-slate-900 bg-white">All Budgets</option>
                  <option value="6000" className="text-slate-900 bg-white">Under ₹6,000</option>
                  <option value="10000" className="text-slate-900 bg-white">Under ₹10,000</option>
                  <option value="15000" className="text-slate-900 bg-white">Under ₹15,000</option>
                  <option value="20000" className="text-slate-900 bg-white">Under ₹20,000</option>
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
                {countActivePgFilters > 0 && (
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white border border-amber-400 select-none animate-bounce">
                    {countActivePgFilters}
                  </span>
                )}
              </button>

              {/* Reset shortcut */}
              {(cityFilter !== 'All' || roomTypeFilter !== 'All' || genderFilter !== 'All' || mealsFilter !== 'All' || maxPrice !== '' || minPrice !== '' || searchQuery !== '' || countActivePgFilters > 0) && (
                <button
                  type="button"
                  onClick={resetAllPgFilters}
                  className="text-amber-400 hover:text-white text-[11px] font-black underline uppercase ml-auto animate-fadeIn cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styled Centered Geolocation check-via-map button as requested */}
      <div className="w-full flex justify-center py-4 animate-fadeIn">
        <button
          type="button"
          onClick={() => setShowPgMapModal(true)}
          className="bg-[#0E1F35] hover:bg-[#b38330] hover:shadow-[#b38330]/20 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-3 border-2 border-[#b38330]/80 group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          <Map className="w-5 h-5 text-amber-500 animate-pulse stroke-[2.5]" />
          <span>Check via Map</span>
        </button>
      </div>

      {showPgMapModal && (
        <div 
          className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex animate-fadeIn cursor-pointer ${
            isMapFullscreen ? 'items-stretch justify-stretch p-0' : 'items-center justify-center p-4'
          }`}
          onClick={() => {
            setShowPgMapModal(false);
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
              <div className="flex items-center gap-2 text-left">
                <Map className="w-5 h-5 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Interactive PG & Co-Living Map & Geolocation Vetting
                  </h3>
                  <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Tap local coordinates to scan PG accommodations in premium urban corridors</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
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
                    setShowPgMapModal(false);
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
                  {selectedMapListing && (
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
                {/* City selection triggers inside maps */}
                <div className="absolute top-4 left-4 right-4 z-15 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 pr-2.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <select
                      value={activeMapCity}
                      onChange={(e) => {
                        const city = e.target.value;
                        setActiveMapCity(city);
                        const cityListings = getMapPgResultsWithCoordinates(city);
                        if (cityListings.length > 0) {
                          setSelectedMapListing(cityListings[0]);
                        } else {
                          setSelectedMapListing(null);
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
                            const cityListings = getMapPgResultsWithCoordinates(city);
                            if (cityListings.length > 0) {
                              setSelectedMapListing(cityListings[0]);
                            } else {
                              setSelectedMapListing(null);
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
                          <rect width="100%" height="100%" fill="url(#grid-pg-sh)" strokeWidth="0" />
                          <defs>
                            <pattern id="grid-pg-sh" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <path d="M -50,150 Q 150,220 280,110 T 600,285" fill="none" stroke="#A5C9EB" strokeWidth="8" opacity="0.4" />
                          <circle cx="250" cy="250" r="140" stroke="#b38330" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                          <line x1="0" y1="200" x2="600" y2="200" stroke="#b38330" strokeWidth="1.5" opacity="0.15" />
                          <line x1="300" y1="0" x2="300" y2="600" stroke="#b38330" strokeWidth="1.5" opacity="0.15" />
                        </svg>
                      </div>

                      {/* Vector pins mapped on mockup grids */}
                      {getMapPgResultsWithCoordinates(activeMapCity).slice(0, 6).map((item, index) => {
                        const positions: {x: string, y: string}[] = [
                          { x: '25%', y: '40%' },
                          { x: '62%', y: '30%' },
                          { x: '20%', y: '75%' },
                          { x: '55%', y: '52%' },
                          { x: '75%', y: '68%' },
                          { x: '38%', y: '80%' }
                        ];
                        const pos = positions[index % positions.length];
                        const isActive = selectedMapListing?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedMapListing(item);
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
                            
                            <div className={`relative px-2.5 py-1 rounded-full shadow-md text-[9px] font-black tracking-wide uppercase transition-all whitespace-nowrap flex items-center gap-1 border ${
                              isActive 
                                ? 'bg-amber-500 text-white border-amber-300 scale-110 z-20' 
                                : 'bg-[#0E1F35] text-white border-slate-700 hover:bg-[#b38330]'
                            }`}>
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{item.price}</span>
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
                        defaultCenter={CITY_COORDINATES[activeMapCity] || { lat: 22.5726, lng: 88.3639 }}
                        defaultZoom={12}
                        mapId="DEMO_MAP_ID"
                        className="w-full h-full"
                      >
                        {getMapPgResultsWithCoordinates(activeMapCity).slice(0, 6).map((item) => {
                          const isActive = selectedMapListing?.id === item.id;
                          return (
                            <AdvancedMarker
                              key={item.id}
                              position={{ lat: item.lat, lng: item.lng }}
                              onClick={() => {
                                setSelectedMapListing(item);
                                if (window.innerWidth < 768) {
                                  setMobileModalTab('info');
                                }
                              }}
                            >
                              <div className="relative -translate-y-1/2 scale-100 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer text-slate-700">
                                <span className={`absolute -inset-1.5 rounded-full animate-ping opacity-25 ${
                                  isActive ? 'bg-amber-500' : 'bg-[#0E1F35]'
                                }`}></span>
                                <div className={`shadow-md rounded-2xl px-2.5 py-1 flex items-center gap-1 border transition-all ${
                                  isActive 
                                    ? 'bg-amber-500 border-amber-300 text-white font-black scale-110' 
                                    : 'bg-[#0E1F35] border-slate-700 text-white hover:bg-[#b38330]'
                                }`}>
                                  <MapPin className="w-3 h-3 shrink-0 text-amber-500" />
                                  <span className="text-[9px] font-black uppercase tracking-wider">{item.price}</span>
                                </div>
                              </div>
                            </AdvancedMarker>
                          );
                        })}
                      </GoogleMap>
                    </APIProvider>
                  )}
                </div>

                {/* Map type toggles details */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-slate-150 shadow-sm text-[10px] text-slate-500 font-extrabold font-mono uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${useMockupMap ? 'bg-sky-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                    <span>{useMockupMap ? "Vector Mockup" : "Google Maps Live"} : {activeMapCity}</span>
                  </div>
                  {hasValidKey ? (
                    <button
                      type="button"
                      onClick={() => setUseMockupMap(!useMockupMap)}
                      className="text-amber-600 hover:text-amber-800 font-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>{useMockupMap ? "Switch to Live Map" : "Switch to Vector Map"}</span>
                    </button>
                  ) : (
                    <span className="text-slate-400">Simulation Enabled</span>
                  )}
                </div>
              </div>

              {/* Detail Sidebar Panel (Right) */}
              <div className={`md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto shrink-0 bg-slate-50 text-left border-t md:border-t-0 md:border-l border-slate-200 ${
                mobileModalTab === 'info' ? 'flex' : 'hidden md:flex'
              }`}>
                {selectedMapListing ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Vetted Co-living PG
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold uppercase select-none">
                        {selectedMapListing.city} • Safe Sync
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-[#0E1F35] leading-tight mt-1.5 select-all">{selectedMapListing.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#b38330]" />
                        {selectedMapListing.locality}
                      </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden h-36 border border-slate-200 shadow-inner relative">
                      <img 
                        src={selectedMapListing.image || selectedMapListing.imageRef} 
                        alt={selectedMapListing.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#0E1F35] text-white px-3 py-1 rounded-xl text-xs font-black shadow-md border border-white/10 select-none font-sans">
                        {selectedMapListing.price}
                      </div>
                    </div>

                    {/* Metadata grids */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
                        <span className="block text-[9px] text-[#b38330] font-mono uppercase font-black">Room configuration</span>
                        <strong className="text-slate-800 font-extrabold text-[11px] uppercase truncate block">{selectedMapListing.roomType}</strong>
                      </div>
                      <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
                        <span className="block text-[9px] text-emerald-600 font-mono uppercase font-black">Occupancy Type</span>
                        <strong className="text-slate-800 font-extrabold text-[11px] uppercase block">{selectedMapListing.gender}</strong>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Food, Internet and Curfew Rules</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                          Meals: {selectedMapListing.meals}
                        </span>
                        <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150 font-mono">
                          WiFi: {selectedMapListing.wifiSpeed}
                        </span>
                        <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                          Gate Curfew: {selectedMapListing.gateTimings || "10:30 PM"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onPropertyClick(selectedMapListing);
                        setShowPgMapModal(false);
                      }}
                      className="w-full bg-[#0E1F35] hover:bg-[#b38330] active:scale-95 text-white text-xs font-black uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Explore Asset Vitals</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                    <MapPin className="w-12 h-12 stroke-[1.5] text-slate-300 animate-bounce mb-3" />
                    <p className="text-xs font-bold uppercase tracking-wider">No PG Accommodation Loaded in This City</p>
                    <p className="text-[10px] mt-1 max-w-[170px] font-medium leading-relaxed">Choose another metropolis to explore premium housing coordinates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Our handpicked Collections section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-10 select-none">
        <h3 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight text-left">
          Our handpicked <span className="font-extrabold text-[#0E1F35]">Collections</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {[
            {
              id: 'guys',
              title: 'For Guys',
              image: collGuys,
              isActive: genderFilter === 'Boys Only',
              onClick: () => {
                if (genderFilter === 'Boys Only') {
                  setGenderFilter('All');
                } else {
                  setGenderFilter('Boys Only');
                  setTimeout(() => {
                    document.getElementById('pg-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            },
            {
              id: 'girls',
              title: 'For Girls',
              image: collGirls,
              isActive: genderFilter === 'Girls Only',
              onClick: () => {
                if (genderFilter === 'Girls Only') {
                  setGenderFilter('All');
                } else {
                  setGenderFilter('Girls Only');
                  setTimeout(() => {
                    document.getElementById('pg-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            },
            {
              id: 'food',
              title: 'Food Available',
              image: collFood,
              isActive: mealsFilter === 'Yes',
              onClick: () => {
                if (mealsFilter === 'Yes') {
                  setMealsFilter('All');
                } else {
                  setMealsFilter('Yes');
                  setTimeout(() => {
                    document.getElementById('pg-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            },
            {
              id: 'private',
              title: 'Private Room',
              image: collPrivate,
              isActive: roomTypeFilter === 'Single Bed Room',
              onClick: () => {
                if (roomTypeFilter === 'Single Bed Room') {
                  setRoomTypeFilter('All');
                } else {
                  setRoomTypeFilter('Single Bed Room');
                  setTimeout(() => {
                    document.getElementById('pg-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            }
          ].map((col) => (
            <button
              key={col.id}
              onClick={col.onClick}
              className={`group relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 cursor-pointer focus:outline-none ${
                col.isActive 
                  ? 'border-amber-500 scale-[1.02] ring-4 ring-amber-500/20' 
                  : 'border-transparent hover:border-slate-350'
              }`}
            >
              <img 
                src={col.image} 
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Cover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end items-center pb-4 p-3 text-center">
                <span className="text-white font-extrabold text-sm sm:text-base tracking-tight group-hover:text-amber-300 transition-colors">
                  {col.title}
                </span>
              </div>

              {/* Small Active badge indicator */}
              {col.isActive && (
                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 p-1 rounded-full text-[10px] font-black shadow-md flex items-center justify-center animate-bounce">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Popular PGs carousel layout right out of the screenshot mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-10 select-none">
        <div className="flex justify-between items-end border-b border-gray-150 pb-3 mb-6">
          <h3 id="popular-pgs-heading" className="text-xl sm:text-2xl font-extrabold text-[#0E1F35] tracking-tight">
            Polular PGs with Co-Living
          </h3>
          
          <button 
            onClick={() => {
              const element = document.getElementById('pg-explorer-anchor');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[#b38330] hover:text-[#91621a] font-extrabold text-xs sm:text-sm transition-colors cursor-pointer select-none whitespace-nowrap"
          >
            See more :-
          </button>
        </div>

        {/* 5 identical Mockup Cards precisely replicating the structure in screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {popularFive.map((pg) => (
            <div 
              key={pg.id}
              onClick={() => setSelectedPg(pg)}
              className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-colors group relative cursor-pointer font-sans"
            >
              {/* Gray placeholder image resembling the screenshot */}
              <div className="h-[145px] bg-[#E1E4E8] border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                {pg.image ? (
                  <img 
                    src={pg.image} 
                    alt={pg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Activity className="w-10 h-10 text-slate-400" />
                )}
                {/* Visual marker tags */}
                <span className="absolute top-2.5 left-2.5 text-[8px] bg-[#0E1F35] text-white font-extrabold px-2 py-0.5 rounded-sm uppercase">
                  {pg.genderPreference}
                </span>
                {pg.verified && (
                  <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white rounded-sm text-[8px] px-2 py-0.5 font-bold uppercase flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Audited
                  </span>
                )}
              </div>
              
              {/* Card Title Content */}
              <div className="p-4 flex flex-col justify-between flex-grow relative text-left bg-transparent">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-[125px]">
                      {pg.locality.split(',')[0]}
                    </h4>
                    <span className="text-[9px] bg-slate-100 text-[#b38330] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      {pg.roomType}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                    {pg.title}
                  </h4>
                  <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">{pg.price}</p>
                  <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {pg.city}
                  </p>
                </div>

                {/* 'More Intel' button positioned in the exact bottom right corner of the card block, matching the screenshot */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPg(pg);
                  }}
                  className="absolute bottom-4 right-4 bg-[#0E1F35] hover:bg-[#b38330] text-white font-black text-[10px] px-4 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap shadow-sm z-10"
                >
                  More Intel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Advertisements Section - Placed after 3 rows of the page */}
      <div className="py-2">
        <AdsSection />
      </div>

      {/* Experience highlight block exactly out of the screenshot design! */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-12 select-none">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0E1F35] to-[#142944] rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#b38330]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="space-y-3 z-10 text-left">
            <span className="bg-[#b38330]/80 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded">
              Lock-in Safeguard
            </span>
            <h2 className="text-xl sm:text-3.5xl font-black tracking-tight leading-none text-white">
              Last 13+ Years Of Real-estate Experience
            </h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
              Authentic hand-vetted rooms, local on-ground counselors, zero hidden brokerage, and real-time legal assistance built directly for long-stay residents.
            </p>
          </div>
          
          <div className="z-10 flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 self-end md:self-auto min-w-[120px]">
            <div className="w-12 h-12 bg-[#b38330] rounded-full flex items-center justify-center animate-pulse shadow-md">
              <div className="relative">
                <span className="block w-5 h-1.5 bg-slate-950 rotate-45 translate-y-[3px] rounded-full"></span>
                <span className="block w-5 h-1.5 bg-slate-950 -rotate-45 -translate-y-[3px] rounded-full"></span>
              </div>
            </div>
            <span className="text-[10px] font-black tracking-widest text-[#b38330] mt-2.5 uppercase">
              CO-LIVING PRIME
            </span>
          </div>
        </div>
      </section>

      {/* Main Exploration Anchor */}
      <section id="pg-explorer-anchor" className="max-w-7xl mx-auto px-4 sm:px-12 pt-16 animate-fadeIn">

        {/* Dynamic explore listings results */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Found {filteredListings.length} premium paying guests
            </h3>
            <p className="text-xs text-gray-400">All properties are carefully audited, registered, and verified under local RERA acts</p>
          </div>
        </div>

        {/* Full list showing all 51 properties, styled with high modular performance */}
        {filteredListings.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center my-6">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-lg">No Matching paying guests</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">We couldn't locate any listings matching your specific filters. Try expanding your budget range or clearing constraints.</p>
            <button 
              onClick={() => {
                setCityFilter('All');
                setRoomTypeFilter('All');
                setGenderFilter('All');
                setMealsFilter('All');
                setMaxPrice('');
                setSearchQuery('');
              }}
              className="mt-4 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div id="pg-explorer-anchor" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 scroll-mt-6">
            {filteredListings.map((pg) => (
              <div 
                key={pg.id}
                onClick={() => setSelectedPg(pg)}
                className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-colors group relative cursor-pointer font-sans"
              >
                {/* Product Image Section */}
                <div className="h-[145px] bg-[#E1E4E8] relative overflow-hidden shrink-0">
                  <img 
                    src={pg.image} 
                    alt={pg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Status Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="text-[8px] bg-[#0E1F35] text-white font-extrabold px-1.5 py-0.5 rounded-sm uppercase">
                      {pg.genderPreference}
                    </span>
                  </div>
                  {pg.verified && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white rounded-sm text-[8px] px-2 py-0.5 font-bold uppercase flex items-center gap-0.5" title="Verified Audit Complete">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> Audited
                    </span>
                  )}
                </div>

                {/* Info block */}
                <div className="p-4 flex flex-col justify-between flex-grow text-left relative bg-transparent">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-[125px]">
                        {pg.locality.split(',')[0]}
                      </h4>
                      <span className="text-[9px] bg-slate-100 text-[#b38330] font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {pg.roomType}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                      {pg.title}
                    </h4>
                    
                    <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">{pg.price}</p>
                    <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {pg.city}
                    </p>
                  </div>

                  {/* Booking / Details trigger bar */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPg(pg);
                      }}
                      className="bg-[#0E1F35] hover:bg-[#b38330] text-white font-black text-[10px] px-4 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap shadow-sm"
                    >
                      More Intel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extreme detailed dialog modal overlay showing authentic local insights */}
      {selectedPg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-150 flex flex-col">
            
            {/* Modal Header banner style reflecting our deep blue brand theme */}
            <div className="bg-[#0E1F35] text-white p-6 relative">
              <button 
                onClick={() => setSelectedPg(null)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 text-white/70 hover:text-white font-black text-2.5xl cursor-pointer bg-white/10 w-9 h-9 rounded-full flex items-center justify-center"
              >
                &times;
              </button>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedPg.genderPreference}
                </span>
                <span className="text-[10px] bg-white/20 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedPg.roomType}
                </span>
                {selectedPg.verified && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Hand-vetted RERA Audit
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{selectedPg.title}</h2>
              <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {selectedPg.locality}, {selectedPg.city}
              </p>
            </div>

            {/* Modal Content container layout */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
              
              {/* Left Column: Image, features, and specs (7 cols) */}
              <div className="space-y-6 md:col-span-7">
                <div className="rounded-xl overflow-hidden h-[200px] border border-gray-200">
                  <img src={selectedPg.image} alt={selectedPg.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Paying Guest Details</h3>
                  <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedPg.details}
                  </p>
                </div>

                {/* Hardcore specs indices */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase leading-none">WiFi Bandwidth</p>
                      <p className="text-xs text-slate-800 font-extrabold mt-0.5">{selectedPg.wifiSpeed}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase leading-none">Mess Dietary</p>
                      <p className="text-xs text-slate-800 font-extrabold mt-0.5">{selectedPg.mealsIncluded ? selectedPg.mealsFrequency : 'No Food Available'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase leading-none">CCTV Guard Box</p>
                      <p className="text-xs text-slate-800 font-extrabold mt-0.5">{selectedPg.gatedSecurity ? '24/7 Security On Duty' : 'Standard CCTV'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase leading-none">Gate Rules curfew</p>
                      <p className="text-xs text-slate-800 font-extrabold mt-0.5">{selectedPg.gateTimings}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities checklist */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Included Perks</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero brokerage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Price calculation & direct inquiry form (5 cols) */}
              <div className="space-y-6 md:col-span-5 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 leading-none">
                <div className="space-y-2.5 text-slate-900">
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Rent Summary</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>Monthly Rent:</span>
                      <strong className="text-slate-900 text-sm">{selectedPg.price}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>Ref. Security Deposit:</span>
                      <strong className="text-slate-900 text-sm">{selectedPg.deposit}</strong>
                    </div>
                    <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center text-xs font-extrabold">
                      <span className="text-[#0E1F35]">Brokerage Fee:</span>
                      <span className="text-emerald-600 uppercase">Brokerage free</span>
                    </div>
                  </div>
                </div>

                {/* Owner/Manager profile */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2 text-slate-900">
                  <h4 className="text-[10px] text-gray-400 font-extrabold uppercase mb-1">PG Registrar Desk</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#0E1F35] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {selectedPg.ownerName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{selectedPg.ownerName}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold">Direct Owner</p>
                    </div>
                  </div>
                  
                  {/* Direct Contact Action Grid (Call + WhatsApp) */}
                  <div className="grid grid-cols-2 gap-2 mt-3 select-none">
                    <a 
                      href={`tel:${selectedPg.ownerContact}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-950 font-bold hover:bg-amber-600 text-white rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Owner
                    </a>
                    <a 
                      href={`https://api.whatsapp.com/send?phone=919850843447&text=${encodeURIComponent(`Hi ${selectedPg.ownerName}, I saw your PG/Co-Living boarding option "${selectedPg.title}" in ${selectedPg.city} listed on Urban Nest, and would like to inquire about renting rooms. Is there a booking vacant?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] font-bold hover:bg-[#20ba5a] text-white rounded-xl text-xs transition-all cursor-pointer shadow-sm border border-emerald-500/10"
                    >
                      <svg className="w-3.5 h-3.5 fill-current animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Instant Callback Form */}
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-slate-900">
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Fast Booking Request</h3>
                  
                  {showInquirySuccess ? (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center animate-pulse">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <h4 className="text-xs font-extrabold text-emerald-800">Inquiry successfully submitted!</h4>
                      <p className="text-[10px] text-emerald-600 mt-1">{selectedPg.ownerName} will initiate contact shortly within 5 minutes code verification cycle.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <input 
                          type="text" 
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>

                      <div>
                        <input 
                          type="text" 
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="Contact Mobile Number"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>

                      <div>
                        <textarea 
                          rows={2}
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Add instructions or timing preference (optional)..."
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-orange-600 font-extrabold hover:bg-orange-700 text-white rounded-lg text-xs transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        Submit Instant Query
                      </button>
                    </>
                  )}
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 24-Point Advanced PG / Co-living Discovery Engine Modal */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none font-sans animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 text-slate-800">
            
            {/* Modal Header */}
            <div className="bg-[#0E1F35] text-white px-6 sm:px-8 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                <div>
                  <h2 className="text-sm sm:text-lg font-black tracking-tight flex items-center gap-1.5 uppercase">
                    Advanced PG & Co-Living Filter
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">24-Point System</span>
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-300">Refine paying guest discovery with high-precision student & working professional criteria.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedFiltersModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs (5 Categorized tabs to cleanly display all 24 filters) */}
            <div className="bg-slate-50 border-b border-gray-200 px-4 sm:px-8 py-2.5 flex flex-wrap gap-1 md:gap-2 shrink-0">
              {[
                { id: 0, label: '📍 Location & Rent', count: (pgLocality ? 1 : 0) + (pgLandmark ? 1 : 0) + (pgNearCollege ? 1 : 0) + (pgNearOfficeArea ? 1 : 0) + (pgNearMetroBusStop ? 1 : 0) + (pgCommuteTimeSearch !== 'All' ? 1 : 0) + (pgNearbyWorkplaceFilter !== 'All' ? 1 : 0) + (pgRadiusSearch !== 'All' ? 1 : 0) + (pgSecurityDepositMax !== '' ? 1 : 0) + (pgZeroDeposit ? 1 : 0) + (pgChargeElectricity || pgChargeWater || pgChargeMaintenance || pgChargeWifi ? 1 : 0) },
                { id: 1, label: '👥 Roommates & Sharing', count: (pgRoomSharingSingle ? 1 : 0) + (pgRoomSharingDouble ? 1 : 0) + (pgRoomSharingTriple ? 1 : 0) + (pgRoomSharingDormitory ? 1 : 0) + (pgOccupancyType !== 'All' ? 1 : 0) + (pgRoommateNonSmoker || pgRoommateStudent || pgRoommateWorkingProf ? 1 : 0) },
                { id: 2, label: '🍽️ Food & Bath', count: (pgFoodIncluded ? 1 : 0) + (pgFoodVegOnly ? 1 : 0) + (pgFoodNonVegAllowed ? 1 : 0) + (pgFoodBreakfast ? 1 : 0) + (pgFoodLunch ? 1 : 0) + (pgFoodDinner ? 1 : 0) + (pgBathroomAttached ? 1 : 0) + (pgBathroomShared ? 1 : 0) },
                { id: 3, label: '🔌 Furnish & WiFi', count: (pgFurnishBed ? 1 : 0) + (pgFurnishMattress ? 1 : 0) + (pgFurnishWardrobe ? 1 : 0) + (pgFurnishStudyTable ? 1 : 0) + (pgFurnishAC ? 1 : 0) + (pgFurnishFan ? 1 : 0) + (pgFurnishGeyser ? 1 : 0) + (pgFurnishSmartTv ? 1 : 0) + (pgFurnishBalcony ? 1 : 0) + (pgFurnishAttachedBathroom ? 1 : 0) + (pgWifiHighSpeed ? 1 : 0) + (pgWifiWorkspace ? 1 : 0) + (pgWifiStudyRoom ? 1 : 0) + (pgWifiBackupElectricity ? 1 : 0) },
                { id: 4, label: '🛡️ Safety & AI Lifestyle', count: (pgSafetyBiometric ? 1 : 0) + (pgSafetyCurfewTiming !== 'All' ? 1 : 0) + (pgAvailableNow ? 1 : 0) + (pgMoveInDate ? 1 : 0) + (pgLeaseShortTerm || pgLeaseMonthly || pgLeaseLongTerm || pgLeaseFlexible ? 1 : 0) + (pgRuleNoCurfew || pgRuleVisitorAllowed || pgRuleSmokingAllowed || pgRuleDrinkingAllowed ? 1 : 0) + (pgNearEssMarket || pgNearEssHospital || pgNearEssGym ? 1 : 0) + (pgPetsAllowed || pgNoPets ? 1 : 0) + (pgVerifOwner || pgVerifPg || pgVerifPhotos || pgVerifAmenities ? 1 : 0) + (pgManagedBy !== 'All' ? 1 : 0) + (pgPostedTime !== 'All' ? 1 : 0) + (pgAiBestForStudents || pgAiBestForWorkers || pgAiBestForGirls || pgAiQuietEnvironment || pgAiBudgetFriendly ? 1 : 0) + (pgLifeCommunityEvents || pgLifeNetworking || pgLifeStartupFriendly || pgLifeFitness ? 1 : 0) }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilterCategoryTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFilterCategoryTab === tab.id
                      ? 'bg-[#132640] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-amber-400 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.2 rounded-full leading-none">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Modal Tab Content Area */}
            <div className="flex-grow p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* TAB 0: Location, Rent & Deposit */}
              {activeFilterCategoryTab === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">📍 Advanced Location & Budget Parameters</h3>
                  </div>

                  {/* Location Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Locality Search</label>
                      <input
                        type="text"
                        placeholder="Search specifically near MIHAN, Salt Lake, VNIT..."
                        value={pgLocality}
                        onChange={(e) => setPgLocality(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Landmark / Institution</label>
                      <input
                        type="text"
                        placeholder="Near VNIT, medical college, metro core, IT Park..."
                        value={pgLandmark}
                        onChange={(e) => setPgLandmark(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Core Proximity Checkboxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pgNearCollege}
                        onChange={(e) => setPgNearCollege(e.target.checked)}
                        className="accent-amber-500 rounded h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-700">Near College</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pgNearOfficeArea}
                        onChange={(e) => setPgNearOfficeArea(e.target.checked)}
                        className="accent-amber-500 rounded h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-700">Near Office Area</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pgNearMetroBusStop}
                        onChange={(e) => setPgNearMetroBusStop(e.target.checked)}
                        className="accent-amber-500 rounded h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-700">Near Metro/Bus Stop</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pgZeroDeposit}
                        onChange={(e) => setPgZeroDeposit(e.target.checked)}
                        className="accent-amber-500 rounded h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-700">Zero Deposit PGs</span>
                    </label>
                  </div>

                  {/* Commute Time, Workplace, and Radius search */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Commute Time Search</label>
                      <select
                        value={pgCommuteTimeSearch}
                        onChange={(e) => setPgCommuteTimeSearch(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="All">All commute ranges</option>
                        <option value="Within 10 mins">Within 10 mins walk</option>
                        <option value="Within 20 mins">Within 20 mins drive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Nearby Workplace Filter</label>
                      <select
                        value={pgNearbyWorkplaceFilter}
                        onChange={(e) => setPgNearbyWorkplaceFilter(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="All">Specific Destination</option>
                        <option value="MIHAN">Near MIHAN IT SEZ</option>
                        <option value="VNIT">Near VNIT campus</option>
                        <option value="medical college">Near medical college</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Maximum Radius Search</label>
                      <select
                        value={pgRadiusSearch}
                        onChange={(e) => setPgRadiusSearch(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="All">Any distance</option>
                        <option value="Within 1 km">Within 1 km</option>
                        <option value="Within 3 km">Within 3 km</option>
                      </select>
                    </div>
                  </div>

                  {/* Security Deposit and Rent settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Max Security Deposit</label>
                      <input
                        type="number"
                        placeholder="Security Deposit Max Amount (e.g. 15000)"
                        value={pgSecurityDepositMax === '' ? '' : pgSecurityDepositMax}
                        onChange={(e) => setPgSecurityDepositMax(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Quick Rent Filter Shortcuts</label>
                       <div className="flex flex-wrap gap-2 pt-1">
                          {[
                            { label: 'Under ₹5k', min: '', max: 5000 },
                            { label: '₹5k–₹10k', min: 5000, max: 10000 },
                            { label: '₹10k–₹15k', min: 10000, max: 15000 },
                            { label: '₹15k+', min: 15000, max: '' }
                          ].map((rng) => {
                            const isSelected = minPrice === rng.min && maxPrice === rng.max;
                            return (
                              <button
                                key={rng.label}
                                type="button"
                                onClick={() => {
                                  setMinPrice(rng.min);
                                  setMaxPrice(rng.max);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-amber-500 text-slate-950 border-amber-500' 
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {rng.label}
                              </button>
                            );
                          })}
                       </div>
                    </div>
                  </div>

                  {/* Included charges */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Included in Rent Charges</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgChargeElectricity}
                          onChange={(e) => setPgChargeElectricity(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Electricity Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgChargeWater}
                          onChange={(e) => setPgChargeWater(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Water Bills Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgChargeMaintenance}
                          onChange={(e) => setPgChargeMaintenance(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Maintenance Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgChargeWifi}
                          onChange={(e) => setPgChargeWifi(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">WiFi Bills Included</span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 1: Roomsharing & Roommates */}
              {activeFilterCategoryTab === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">👥 Room Setup, Occupancy & Roommate Habits</h3>
                  </div>

                  {/* Room Sharing Type Checkboxes */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Room Sharing Setup (Most-Used Filter)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoomSharingSingle}
                          onChange={(e) => setPgRoomSharingSingle(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Single Room</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoomSharingDouble}
                          onChange={(e) => setPgRoomSharingDouble(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Double Sharing</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoomSharingTriple}
                          onChange={(e) => setPgRoomSharingTriple(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Triple Sharing</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoomSharingDormitory}
                          onChange={(e) => setPgRoomSharingDormitory(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Dormitory Space</span>
                      </label>
                    </div>
                  </div>

                  {/* Occupancy Type Selector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Target Occupancy Type</label>
                      <select
                        value={pgOccupancyType}
                        onChange={(e) => setPgOccupancyType(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="All">All Audiences</option>
                        <option value="Students">Students preferred</option>
                        <option value="Working professionals">Working professionals</option>
                        <option value="Families">Families allowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Gender Preference</label>
                      <div className="flex gap-2 pt-0.5">
                        {['All', 'Girls Only', 'Boys Only', 'Unisex'].map((gnd) => {
                          const isSel = genderFilter === gnd;
                          return (
                            <button
                              key={gnd}
                              type="button"
                              onClick={() => setGenderFilter(gnd)}
                              className={`px-3 py-2 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                                isSel 
                                  ? 'bg-[#132640] text-amber-400 border-[#132640]' 
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {gnd === 'All' ? 'Any' : gnd}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Roommate Preference Settings */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Roommate Habits Preferences</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoommateNonSmoker}
                          onChange={(e) => setPgRoommateNonSmoker(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Non-smoker roommates</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoommateStudent}
                          onChange={(e) => setPgRoommateStudent(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Student roommates only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRoommateWorkingProf}
                          onChange={(e) => setPgRoommateWorkingProf(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Working profession peers</span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Food & Bath */}
              {activeFilterCategoryTab === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">🍽️ Food Availability & Private/Shared Bathroom Types</h3>
                  </div>

                  {/* Food Availability Criteria */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">In-House Food Filter Parameters (Crucial factor)</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodIncluded}
                          onChange={(e) => setPgFoodIncluded(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Food Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodVegOnly}
                          onChange={(e) => setPgFoodVegOnly(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Pure Veg Catered</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodNonVegAllowed}
                          onChange={(e) => setPgFoodNonVegAllowed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Non-Veg Allowed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodBreakfast}
                          onChange={(e) => setPgFoodBreakfast(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Breakfast Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodLunch}
                          onChange={(e) => setPgFoodLunch(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Lunch Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgFoodDinner}
                          onChange={(e) => setPgFoodDinner(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Dinner Included</span>
                      </label>
                    </div>
                  </div>

                  {/* Bathroom Type Options */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Bathroom Setup Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setPgBathroomAttached(!pgBathroomAttached);
                          setPgBathroomShared(false);
                        }}
                        className={`p-4 border rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          pgBathroomAttached 
                            ? 'bg-amber-50 border-amber-500 text-slate-900 ring-2 ring-amber-500/20' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold uppercase">Attached Bathroom</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Bathroom private inside your own room.</p>
                        </div>
                        {pgBathroomAttached && <CheckCircle className="w-5 h-5 text-amber-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPgBathroomShared(!pgBathroomShared);
                          setPgBathroomAttached(false);
                        }}
                        className={`p-4 border rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          pgBathroomShared 
                            ? 'bg-amber-50 border-amber-500 text-slate-900 ring-2 ring-amber-500/20' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold uppercase">Shared Bathroom</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Shared with immediate roommates only.</p>
                        </div>
                        {pgBathroomShared && <CheckCircle className="w-5 h-5 text-amber-600" />}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: Furnishing & Work Setup */}
              {activeFilterCategoryTab === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">🔌 Room Furnishing Options & WiFi/Workspace Utilities</h3>
                  </div>

                  {/* Furnishing Checklist */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">In-Room Furnished Amenity Details</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl">
                      {[
                        { label: 'Bed', state: pgFurnishBed, set: setPgFurnishBed },
                        { label: 'Mattress', state: pgFurnishMattress, set: setPgFurnishMattress },
                        { label: 'Wardrobe', state: pgFurnishWardrobe, set: setPgFurnishWardrobe },
                        { label: 'Study Table', state: pgFurnishStudyTable, set: setPgFurnishStudyTable },
                        { label: 'AC Unit', state: pgFurnishAC, set: setPgFurnishAC },
                        { label: 'Fan', state: pgFurnishFan, set: setPgFurnishFan },
                        { label: 'Geyser', state: pgFurnishGeyser, set: setPgFurnishGeyser },
                        { label: 'Smart TV', state: pgFurnishSmartTv, set: setPgFurnishSmartTv },
                        { label: 'Private Balcony', state: pgFurnishBalcony, set: setPgFurnishBalcony },
                        { label: 'Attached Bath', state: pgFurnishAttachedBathroom, set: setPgFurnishAttachedBathroom }
                      ].map((item) => (
                        <label key={item.label} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.set(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Wifi & Workspace Section */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">WiFi & Study/Work Layouts (Highly important for Remote/Students)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgWifiHighSpeed}
                          onChange={(e) => setPgWifiHighSpeed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">High-speed WiFi</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgWifiWorkspace}
                          onChange={(e) => setPgWifiWorkspace(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Workspace In Room</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgWifiStudyRoom}
                          onChange={(e) => setPgWifiStudyRoom(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Shared Study Room</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgWifiBackupElectricity}
                          onChange={(e) => setPgWifiBackupElectricity(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Backup Electricity</span>
                      </label>
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Building-Wide Amenities Selector</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      {[
                        { label: 'Laundry Service', state: pgAmenityLaundry, set: setPgAmenityLaundry },
                        { label: 'Housekeeping', state: pgAmenityHousekeeping, set: setPgAmenityHousekeeping },
                        { label: 'Power Backup', state: pgAmenityPowerBackup, set: setPgAmenityPowerBackup },
                        { label: 'CCTV Cameras', state: pgAmenityCctv, set: setPgAmenityCctv },
                        { label: 'Security Guard', state: pgAmenitySecurityGuard, set: setPgAmenitySecurityGuard },
                        { label: 'Continuous Water', state: pgAmenityWaterSupply, set: setPgAmenityWaterSupply },
                        { label: 'Gym/Fitness Desk', state: pgAmenityGym, set: setPgAmenityGym },
                        { label: 'Common Lounge', state: pgAmenityCommonLounge, set: setPgAmenityCommonLounge },
                        { label: 'Gaming Zone', state: pgAmenityGamingZone, set: setPgAmenityGamingZone },
                        { label: 'Rooftop Terrace', state: pgAmenityTerrace, set: setPgAmenityTerrace },
                        { label: 'In-House Cafeteria', state: pgAmenityCafeteria, set: setPgAmenityCafeteria }
                      ].map((item) => (
                        <label key={item.label} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.set(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: Safety, AI Lifestyle & Other Settings */}
              {activeFilterCategoryTab === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-amber-600 tracking-wider">🛡️ Safety Systems, AI Smart Highlights, Curfews & Verified Trust</h3>
                  </div>

                  {/* AI Smart Filters */}
                  <div>
                    <label className="block text-xs font-black text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" /> AI-Fueled Smart Profiles (Highly Desired)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-violet-50/50 p-4 rounded-xl border border-violet-100">
                      {[
                        { label: '“Best for students”', state: pgAiBestForStudents, set: setPgAiBestForStudents },
                        { label: '“Best for remote workers”', state: pgAiBestForWorkers, set: setPgAiBestForWorkers },
                        { label: '“Best for girls”', state: pgAiBestForGirls, set: setPgAiBestForGirls },
                        { label: '“Quiet environment”', state: pgAiQuietEnvironment, set: setPgAiQuietEnvironment },
                        { label: '“Budget-friendly”', state: pgAiBudgetFriendly, set: setPgAiBudgetFriendly }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => item.set(!item.state)}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            item.state
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Safety Filters & Curfew */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Gate Curfew Rules</label>
                      <select
                        value={pgSafetyCurfewTiming}
                        onChange={(e) => setPgSafetyCurfewTiming(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 bg-white"
                      >
                        <option value="All">All Curfew Rules</option>
                        <option value="No curfew">No Curfew / 24-7 access</option>
                        <option value="Curfew strictly checked">Regular gate timings apply</option>
                      </select>
                    </div>

                    <div className="pt-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                        <input
                          type="checkbox"
                          checked={pgSafetyBiometric}
                          onChange={(e) => setPgSafetyBiometric(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Biometric or Keycard Entry Lock</span>
                      </label>
                    </div>
                  </div>

                  {/* Lease Duration & Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Lease Duration Flexibility</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgLeaseShortTerm}
                            onChange={(e) => setPgLeaseShortTerm(e.target.checked)}
                            className="accent-amber-500 rounded h-4.5 w-4.5"
                          />
                          <span className="text-xs font-bold text-slate-700">Short-term Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgLeaseMonthly}
                            onChange={(e) => setPgLeaseMonthly(e.target.checked)}
                            className="accent-amber-500 rounded h-4.5 w-4.5"
                          />
                          <span className="text-xs font-bold text-slate-700">Month-to-Month</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgLeaseLongTerm}
                            onChange={(e) => setPgLeaseLongTerm(e.target.checked)}
                            className="accent-amber-500 rounded h-4.5 w-4.5"
                          />
                          <span className="text-xs font-bold text-slate-700">Long-term Stay</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgLeaseFlexible}
                            onChange={(e) => setPgLeaseFlexible(e.target.checked)}
                            className="accent-amber-500 rounded h-4.5 w-4.5"
                          />
                          <span className="text-xs font-bold text-slate-700">Flexible Lease</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Move-In Availability</label>
                      <div className="space-y-2.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgAvailableNow}
                            onChange={(e) => setPgAvailableNow(e.target.checked)}
                            className="accent-amber-500 rounded h-4 h-4"
                          />
                          <span className="text-xs font-bold text-slate-700">Available Immediately (Now)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Move-In Date:</span>
                          <input
                            type="date"
                            value={pgMoveInDate}
                            onChange={(e) => setPgMoveInDate(e.target.value)}
                            className="p-1 px-2 border border-slate-300 rounded text-xs bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* House Rules & Curfews */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Allowed Visitor & Smoking / Drinking Rules</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRuleNoCurfew}
                          onChange={(e) => setPgRuleNoCurfew(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">No curfew timing</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRuleVisitorAllowed}
                          onChange={(e) => setPgRuleVisitorAllowed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Visitors Allowed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRuleSmokingAllowed}
                          onChange={(e) => setPgRuleSmokingAllowed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Smoking Allowed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgRuleDrinkingAllowed}
                          onChange={(e) => setPgRuleDrinkingAllowed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Drinking Allowed</span>
                      </label>
                    </div>
                  </div>

                  {/* Nearby Essentials */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Proximity to Daily Essentials</label>
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgNearEssMarket}
                          onChange={(e) => setPgNearEssMarket(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Near Market</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgNearEssHospital}
                          onChange={(e) => setPgNearEssHospital(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Near Hospital</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgNearEssGym}
                          onChange={(e) => setPgNearEssGym(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Near Ext-Gym</span>
                      </label>
                    </div>
                  </div>

                  {/* Pets Friendly */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Pet Tolerance Level</label>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgPetsAllowed}
                          onChange={(e) => setPgPetsAllowed(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Pets Allowed (Dog/Cat friendly)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgNoPets}
                          onChange={(e) => setPgNoPets(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">No pets strictly enforced</span>
                      </label>
                    </div>
                  </div>

                  {/* Trust & Verification and Managed By */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Verified Trust Checks</label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgVerifOwner}
                            onChange={(e) => setPgVerifOwner(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">Verified Owner</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgVerifPg}
                            onChange={(e) => setPgVerifPg(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">Verified PG Title</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgVerifPhotos}
                            onChange={(e) => setPgVerifPhotos(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">Real verified photos</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={pgVerifAmenities}
                            onChange={(e) => setPgVerifAmenities(e.target.checked)}
                            className="accent-amber-500 rounded h-4 w-4"
                          />
                          <span className="text-xs font-bold text-slate-700">Verified amenities</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Owner / Management Brand</label>
                        <select
                          value={pgManagedBy}
                          onChange={(e) => setPgManagedBy(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded text-xs font-bold bg-white"
                        >
                          <option value="All">All types</option>
                          <option value="Owner">Direct Owner Managed</option>
                          <option value="Professional Co-living Brand">Professional Co-living Brand</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Listing Posted Time</label>
                        <select
                          value={pgPostedTime}
                          onChange={(e) => setPgPostedTime(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded text-xs font-bold bg-white"
                        >
                          <option value="All">All listings</option>
                          <option value="Today">Posted today</option>
                          <option value="3 Days">Last 3 days</option>
                          <option value="1 Week">Last week</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Modern Lifestyle & Community Events */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Modern Co-living Lifestyle Events</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgLifeCommunityEvents}
                          onChange={(e) => setPgLifeCommunityEvents(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Community Events</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgLifeNetworking}
                          onChange={(e) => setPgLifeNetworking(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Networking Spaces</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgLifeStartupFriendly}
                          onChange={(e) => setPgLifeStartupFriendly(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Startup-friendly environment</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pgLifeFitness}
                          onChange={(e) => setPgLifeFitness(e.target.checked)}
                          className="accent-amber-500 rounded h-4 w-4"
                        />
                        <span className="text-xs font-bold text-slate-700">Fitness-focused community</span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-gray-200 px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={resetAllPgFilters}
                className="text-xs font-extrabold uppercase text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                Clear All Constraints
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">
                  {filteredListings.length} properties matching
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="bg-[#0E1F35] hover:bg-[#132640] text-amber-400 font-extrabold uppercase text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Apply & See Results
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Advanced Filters Modal Overlay */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#0E1F35] p-5 text-white flex justify-between items-center shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3 font-sans">
                <div className="w-10 h-10 bg-[#b38330] rounded-xl flex items-center justify-center shadow-md">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Advanced PG / Co-Living Discovery Matrix
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
                      Audit Matrix
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider font-sans">
                    Interactive compliance & lifestyle layout profiling engine
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowAdvancedFiltersModal(false)}
                className="text-white/70 hover:text-white hover:bg-white/15 p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Navigator Header */}
            <div className="bg-slate-50 border-b border-gray-200 p-2 overflow-x-auto flex gap-1 scrollbar-hide shrink-0 font-sans">
              {[
                { label: "📍 Location & 💰 Rent", hint: "Localities, Rent, Deposit", index: 0 },
                { label: "🏢 Room & 👥 Sharing", hint: "Gender, sharing, Prefs", index: 1 },
                { label: "🛋️ Furnishing & 🍽️ Food", hint: "Beds, AC, Diet, Charges", index: 2 },
                { label: "⚡ Perks & 🛡️ Safety", hint: "WiFi, safety, curate rules", index: 3 },
                { label: "🔑 AI Smart & Extras", hint: "Availability, AI, Lease", index: 4 }
              ].map((tab) => {
                const isActive = activeFilterCategoryTab === tab.index;
                return (
                  <button
                    key={tab.index}
                    type="button"
                    onClick={() => setActiveFilterCategoryTab(tab.index)}
                    className={`flex flex-col items-start px-4 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer min-w-[150px] sm:min-w-[180px] ${
                      isActive 
                        ? 'bg-[#0E1F35] text-white shadow-md shadow-slate-900/10' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-205'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-black tracking-tight">{tab.label}</span>
                    <span className={`text-[9.5px] mt-0.5 font-bold uppercase tracking-wide block ${isActive ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold'}`}>
                      {tab.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Modal scrollable body context container */}
            <div className="p-6 overflow-y-auto flex-grow text-slate-900 bg-white font-sans max-h-[55vh]">
              
              {/* Category Tab 0: Location & Budget */}
              {activeFilterCategoryTab === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Location Filters */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                      <MapPin className="w-4 h-4 text-[#b38330]" /> 1. Location & Smart Proximity Filters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Locality name</label>
                        <input 
                          type="text" 
                          value={pgLocality}
                          onChange={(e) => setPgLocality(e.target.value)}
                          placeholder="e.g. Salt Lake, New Town"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Near landmark</label>
                        <input 
                          type="text" 
                          value={pgLandmark}
                          onChange={(e) => setPgLandmark(e.target.value)}
                          placeholder="e.g. Metro Core, AIIMS"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 checkbox-container">
                        <input type="checkbox" checked={pgNearCollege} onChange={(e) => setPgNearCollege(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Near College</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 checkbox-container">
                        <input type="checkbox" checked={pgNearOfficeArea} onChange={(e) => setPgNearOfficeArea(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Near Office (MIHAN)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 checkbox-container">
                        <input type="checkbox" checked={pgNearMetroBusStop} onChange={(e) => setPgNearMetroBusStop(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Near Metro/Bus Stop</span>
                      </label>
                    </div>

                    {/* Smart location additions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-slate-100 p-3.5 rounded-xl">
                      <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Commute Time Limit</label>
                        <select 
                          value={pgCommuteTimeSearch} 
                          onChange={(e) => setPgCommuteTimeSearch(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-extrabold text-[#0E1F35] focus:outline-none"
                        >
                          <option value="All">Any commute duration</option>
                          <option value="Within 10 mins">Within 10 mins walk</option>
                          <option value="Within 20 mins">Within 20 mins transit</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Nearby Educational Hub</label>
                        <select 
                          value={pgNearbyWorkplaceFilter} 
                          onChange={(e) => setPgNearbyWorkplaceFilter(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-extrabold text-[#0E1F35] focus:outline-none"
                        >
                          <option value="All">Any Landmark Area</option>
                          <option value="MIHAN">Near MIHAN</option>
                          <option value="VNIT">Near VNIT Campus</option>
                          <option value="AIIMS">Near AIIMS / Medical College</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Radius Lookup Bounds</label>
                        <select 
                          value={pgRadiusSearch} 
                          onChange={(e) => setPgRadiusSearch(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-extrabold text-[#0E1F35] focus:outline-none"
                        >
                          <option value="All">All distances</option>
                          <option value="Within 1 km">Within 1 km radius</option>
                          <option value="Within 3 km">Within 3 km radius</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Rent Filters */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <DollarSign className="w-4 h-4 text-[#b38330]" /> 2. Rent Budget Control
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Min rent amount (₹)</label>
                        <input 
                          type="number" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 4000"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Max rent amount (₹)</label>
                        <input 
                          type="number" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 20000"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Quick Rent Shortcuts */}
                    <div className="mt-4">
                      <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-2">Quick budget bands:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Under ₹5k", min: 0, max: 5000 },
                          { label: "₹5k–₹10k", min: 5000, max: 10000 },
                          { label: "₹10k–₹15k", min: 10000, max: 15000 },
                          { label: "₹15k+", min: 15000, max: 99999 }
                        ].map((range, idx) => {
                          const isMatch = minPrice === range.min && maxPrice === range.max;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setMinPrice(range.min === 0 ? '' : range.min);
                                setMaxPrice(range.max === 99999 ? '' : range.max);
                              }}
                              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                                isMatch 
                                  ? 'bg-[#b38330] text-white border-[#b38330]' 
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {range.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Security Deposit Filter */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <ShieldCheck className="w-4 h-4 text-[#b38330]" /> 3. Security Deposit Limiters
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Max Security Deposit limit (₹)</label>
                        <input 
                          type="number" 
                          value={pgSecurityDepositMax}
                          onChange={(e) => setPgSecurityDepositMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 15000"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:outline-none text-slate-800"
                        />
                      </div>
                      <div className="pt-4 sm:pt-0">
                        <label className="flex items-center gap-2.5 cursor-pointer bg-[#FFF9EE] p-3.5 rounded-xl border border-amber-200 text-xs font-extrabold text-slate-800 hover:bg-amber-50 animate-fadeIn">
                          <input 
                            type="checkbox" 
                            checked={pgZeroDeposit} 
                            onChange={(e) => setPgZeroDeposit(e.target.checked)} 
                            className="rounded h-4 w-4 text-amber-500 focus:ring-amber-500" 
                          />
                          <div>
                            <span>Zero Security Deposit PGs</span>
                            <p className="text-[9px] text-[#b38330] font-bold normal-case mt-0.5">Show only zero or minimal deposit listings (highly recommended for students)</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Category Tab 1: Room sharing & occupancy preferences */}
              {activeFilterCategoryTab === 1 && (
                <div className="space-y-6 animate-fadeIn text-left font-sans">
                  
                  {/* Room Sharing and Layout */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Layers className="w-4 h-4 text-[#b38330]" /> 4. Room Sharing Type (Highly Requested)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Single Room", checked: pgRoomSharingSingle, set: setPgRoomSharingSingle },
                        { label: "Double Sharing", checked: pgRoomSharingDouble, set: setPgRoomSharingDouble },
                        { label: "Triple Sharing", checked: pgRoomSharingTriple, set: setPgRoomSharingTriple },
                        { label: "Dormitory Unit", checked: pgRoomSharingDormitory, set: setPgRoomSharingDormitory }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender preference */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <User className="w-4 h-4 text-[#b38330]" /> 5. Gender Preference limits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Boys Only / Male", value: "Boys Only" },
                        { label: "Girls Only / Female", value: "Girls Only" },
                        { label: "Unisex Co-living", value: "Unisex" },
                        { label: "Any Preference", value: "All" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setGenderFilter(item.value)}
                          className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                            genderFilter === item.value 
                              ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occupancy profile */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Activity className="w-4 h-4 text-[#b38330]" /> 6. Tenant Occupancy Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Students permitted", value: "Students" },
                        { label: "Working Professionals", value: "Working professionals" },
                        { label: "Couples & Families", value: "Families" },
                        { label: "Open to Any Resident", value: "All" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPgOccupancyType(item.value)}
                          className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                            pgOccupancyType === item.value 
                              ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Bathroom choice */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Info className="w-4 h-4 text-[#b38330]" /> 9. Bathroom Attachment Type
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgBathroomAttached} onChange={(e) => setPgBathroomAttached(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <div>
                          <strong>Attached Washroom</strong>
                          <p className="text-[10px] text-gray-400 font-semibold lowercase">Strictly private ensuite bathroom setup</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgBathroomShared} onChange={(e) => setPgBathroomShared(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <div>
                          <strong>Shared Bathroom</strong>
                          <p className="text-[10px] text-gray-400 font-semibold lowercase">Shared layout on the immediate floor corridor</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Roommate preferences */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Sparkles className="w-4 h-4 text-[#b38330]" /> 24. Shared Roommate Preferences
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Non-Smoker Roommates", checked: pgRoommateNonSmoker, set: setPgRoommateNonSmoker },
                        { label: "Student Roommates Preferred", checked: pgRoommateStudent, set: setPgRoommateStudent },
                        { label: "Working Professionals Only", checked: pgRoommateWorkingProf, set: setPgRoommateWorkingProf }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Category Tab 2: Furnishing & Food */}
              {activeFilterCategoryTab === 2 && (
                <div className="space-y-6 animate-fadeIn text-left font-sans">
                  
                  {/* Furnishing Filters */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Layers className="w-4 h-4 text-[#b38330]" /> 7. Furnishing Filters (Comfort Essentials)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { label: "Bed Structure", checked: pgFurnishBed, set: setPgFurnishBed },
                        { label: "Orthopedic Mattress", checked: pgFurnishMattress, set: setPgFurnishMattress },
                        { label: "Large Wardrobe", checked: pgFurnishWardrobe, set: setPgFurnishWardrobe },
                        { label: "Study Desk & Chair", checked: pgFurnishStudyTable, set: setPgFurnishStudyTable },
                        { label: "Air Conditioning (AC)", checked: pgFurnishAC, set: setPgFurnishAC },
                        { label: "High speed Fan", checked: pgFurnishFan, set: setPgFurnishFan },
                        { label: "Pressurised Geyser", checked: pgFurnishGeyser, set: setPgFurnishGeyser },
                        { label: "Smart Led TV", checked: pgFurnishSmartTv, set: setPgFurnishSmartTv },
                        { label: "Attached Balcony", checked: pgFurnishBalcony, set: setPgFurnishBalcony },
                        { label: "Ensuite Bathroom", checked: pgFurnishAttachedBathroom, set: setPgFurnishAttachedBathroom }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Food rules */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <Utensils className="w-4 h-4 text-[#b38330]" /> 8. Mess & Food Service Availability
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-[#FFFBF0] p-3 rounded-lg border border-amber-200 text-xs font-extrabold text-slate-800 hover:bg-amber-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgFoodIncluded} onChange={(e) => setPgFoodIncluded(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Food Service Included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-[#0E1F35]/15 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgFoodVegOnly} onChange={(e) => setPgFoodVegOnly(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>100% Pure Veg Mess</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-[#0E1F35]/15 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgFoodNonVegAllowed} onChange={(e) => setPgFoodNonVegAllowed(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Non-Veg Allowed</span>
                      </label>
                    </div>

                    <div className="mt-4 bg-slate-100 p-3 rounded-xl">
                      <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-2">Meal Coverage Matrix:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container">
                          <input type="checkbox" checked={pgFoodBreakfast} onChange={(e) => setPgFoodBreakfast(e.target.checked)} className="rounded text-amber-500 animate-pulse" />
                          <span>Breakfast</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container">
                          <input type="checkbox" checked={pgFoodLunch} onChange={(e) => setPgFoodLunch(e.target.checked)} className="rounded text-amber-500" />
                          <span>Lunch Included</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container">
                          <input type="checkbox" checked={pgFoodDinner} onChange={(e) => setPgFoodDinner(e.target.checked)} className="rounded text-amber-500" />
                          <span>Dinner Included</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Included charges */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-255 pb-2">
                      <DollarSign className="w-4 h-4 text-[#b38330]" /> 23. Included Utilities (No Extra Charges)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Electricity Bill Paid", checked: pgChargeElectricity, set: setPgChargeElectricity },
                        { label: "Water Charges Included", checked: pgChargeWater, set: setPgChargeWater },
                        { label: "Maintenance Free", checked: pgChargeMaintenance, set: setPgChargeMaintenance },
                        { label: "WiFi Internet Included", checked: pgChargeWifi, set: setPgChargeWifi }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Category Tab 3: Perks, Safety & Amenities */}
              {activeFilterCategoryTab === 3 && (
                <div className="space-y-6 animate-fadeIn text-left font-sans">
                  
                  {/* WiFi & Work Setup */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2 font-sans">
                      <Wifi className="w-4 h-4 text-[#b38330]" /> 10. WiFi & Heavy Remote Work Ready
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgWifiHighSpeed} onChange={(e) => setPgWifiHighSpeed(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>High-Speed 5G WiFi</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgWifiWorkspace} onChange={(e) => setPgWifiWorkspace(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Private Workspace Desk</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgWifiStudyRoom} onChange={(e) => setPgWifiStudyRoom(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>Silent Study Room</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgWifiBackupElectricity} onChange={(e) => setPgWifiBackupElectricity(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                        <span>24/7 Power Backup</span>
                      </label>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#b38330]" /> 11. Essential & Lifestyle Amenities Matrix
                    </h4>
                    
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-sans">Essential Utilities:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                      {[
                        { label: "Laundry / Washing Machine", checked: pgAmenityLaundry, set: setPgAmenityLaundry },
                        { label: "Daily Housekeeping", checked: pgAmenityHousekeeping, set: setPgAmenityHousekeeping },
                        { label: "Grid Power Backup", checked: pgAmenityPowerBackup, set: setPgAmenityPowerBackup },
                        { label: "CCTV Cameras", checked: pgAmenityCctv, set: setPgAmenityCctv },
                        { label: "Full-Time Security Guard", checked: pgAmenitySecurityGuard, set: setPgAmenitySecurityGuard },
                        { label: "Mineral Water Supply", checked: pgAmenityWaterSupply, set: setPgAmenityWaterSupply }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lifestyle Perks:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { label: "Inhouse Gym", checked: pgAmenityGym, set: setPgAmenityGym },
                        { label: "Common Lounge", checked: pgAmenityCommonLounge, set: setPgAmenityCommonLounge },
                        { label: "Gaming Zone", checked: pgAmenityGamingZone, set: setPgAmenityGamingZone },
                        { label: "Access Terrace", checked: pgAmenityTerrace, set: setPgAmenityTerrace },
                        { label: "In-House Cafeteria", checked: pgAmenityCafeteria, set: setPgAmenityCafeteria }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-1.5 cursor-pointer bg-slate-100 p-2 text-[11px] font-extrabold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Security */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-[#0E1F35]/15">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2 animate-fadeIn">
                      <ShieldCheck className="w-4 h-4 text-[#b38330]" /> 12. Women Safety & Strict Operations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                        <input type="checkbox" checked={pgSafetyBiometric} onChange={(e) => setPgSafetyBiometric(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500 animate-slideUp" />
                        <div>
                          <strong>Biometric scan entry</strong>
                          <p className="text-[10px] text-slate-400 normal-case mt-0.5">Automated fingerprint gates for security</p>
                        </div>
                      </label>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Gate Curfew Timings</label>
                        <select 
                          value={pgSafetyCurfewTiming} 
                          onChange={(e) => setPgSafetyCurfewTiming(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-800"
                        >
                          <option value="All">Show any curfew timeline</option>
                          <option value="No curfew">No Curfew stay (24/7 exit allowed)</option>
                          <option value="Has curfew">Strict curfew gates (10 PM / 11 PM)</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer bg-orange-50 p-3 rounded-lg border border-orange-200 text-xs font-black text-orange-950 hover:bg-orange-100 select-none checkbox-container">
                        <input type="checkbox" checked={genderFilter === 'Girls Only'} onChange={(e) => setGenderFilter(e.target.checked ? 'Girls Only' : 'All')} className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4" />
                        <div>
                          <span>Female-Only Property</span>
                          <p className="text-[9px] text-orange-600 font-bold mt-0.5 whitespace-normal leading-normal select-none uppercase">Strictly Girls Only properties with Warden patrol</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Pet Friendly & Curfew */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Coffee className="w-4 h-4 text-[#b38330]" /> 17. Pet Friendliness
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 select-none checkbox-container font-sans">
                          <input type="checkbox" checked={pgPetsAllowed} onChange={(e) => setPgPetsAllowed(e.target.checked)} className="rounded text-amber-500" />
                          <span>Pets Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 select-none checkbox-container font-sans">
                          <input type="checkbox" checked={pgNoPets} onChange={(e) => setPgNoPets(e.target.checked)} className="rounded text-amber-500" />
                          <span>Strictly No Pets</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2 animate-fadeIn">
                        <Info className="w-4 h-4 text-[#b38330]" /> 15. House Rules & Freedom
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgRuleNoCurfew} onChange={(e) => setPgRuleNoCurfew(e.target.checked)} className="rounded text-amber-500 animate-slideUp" />
                          <span>No gate curfew</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgRuleVisitorAllowed} onChange={(e) => setPgRuleVisitorAllowed(e.target.checked)} className="rounded text-amber-500" />
                          <span>Visitors allowed</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgRuleSmokingAllowed} onChange={(e) => setPgRuleSmokingAllowed(e.target.checked)} className="rounded text-amber-500" />
                          <span>Smoking Area</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgRuleDrinkingAllowed} onChange={(e) => setPgRuleDrinkingAllowed(e.target.checked)} className="rounded text-amber-500" />
                          <span>Drinking Allowed</span>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Category Tab 4: Booking & Extra Filters */}
              {activeFilterCategoryTab === 4 && (
                <div className="space-y-6 animate-fadeIn text-left font-sans">
                  
                  {/* Availability & Booking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Calendar className="w-4 h-4 text-[#b38330]" /> 13. Availability & Move-in Timing
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={pgAvailableNow} onChange={(e) => setPgAvailableNow(e.target.checked)} className="rounded text-amber-500 h-4.5 w-4.5" />
                          <div>
                            <span>Available now (Immediate entry)</span>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Show only properties ready for instant moving</p>
                          </div>
                        </label>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 select-none">Target move-in date: {pgMoveInDate || 'Not Chosen'}</label>
                          <input 
                            type="date" 
                            value={pgMoveInDate}
                            onChange={(e) => setPgMoveInDate(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-slate-800 font-bold w-full select-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Info className="w-4 h-4 text-[#b38330]" /> 14. Lease Commitment Length
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2.5 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgLeaseShortTerm} onChange={(e) => setPgLeaseShortTerm(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>Short-term (Daily/Weekly)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2.5 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgLeaseMonthly} onChange={(e) => setPgLeaseMonthly(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>Monthly stay model</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2.5 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgLeaseLongTerm} onChange={(e) => setPgLeaseLongTerm(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>Long-term lock-in</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-white p-2.5 rounded border border-slate-200 text-xs font-bold text-slate-700 checkbox-container font-sans">
                          <input type="checkbox" checked={pgLeaseFlexible} onChange={(e) => setPgLeaseFlexible(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>Flexible / No lock-in</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Essentials proximities */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                      <MapPin className="w-4 h-4 text-[#b38330]" /> 16. Proximity to Nearby Daily Essentials
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-white p-4 justify-between rounded-xl">
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 rounded-lg border border-slate-250 text-xs font-extrabold text-slate-800 select-none checkbox-container">
                        <input type="checkbox" checked={pgNearCollege} onChange={(e) => setPgNearCollege(e.target.checked)} className="rounded text-[#b38330]" />
                        <span>Near College</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 rounded-lg border border-slate-250 text-xs font-extrabold text-slate-800 select-none checkbox-container">
                        <input type="checkbox" checked={pgNearOfficeArea} onChange={(e) => setPgNearOfficeArea(e.target.checked)} className="rounded text-[#b38330]" />
                        <span>Near Office</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 rounded-lg border border-slate-250 text-xs font-extrabold text-slate-800 select-none checkbox-container">
                        <input type="checkbox" checked={pgNearMetroBusStop} onChange={(e) => setPgNearMetroBusStop(e.target.checked)} className="rounded text-[#b38330]" />
                        <span>Near Metro line</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 rounded-lg border border-slate-250 text-xs font-extrabold text-slate-800 select-none checkbox-container">
                        <input type="checkbox" checked={pgNearEssMarket} onChange={(e) => setPgNearEssMarket(e.target.checked)} className="rounded text-[#b38330]" />
                        <span>Market / Malls</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 rounded-lg border border-slate-250 text-xs font-extrabold text-slate-800 select-none checkbox-container">
                        <input type="checkbox" checked={pgNearEssHospital} onChange={(e) => setPgNearEssHospital(e.target.checked)} className="rounded text-[#b38330]" />
                        <span>AIIMS / Hospital</span>
                      </label>
                    </div>
                  </div>

                  {/* Verified badge properties */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                      <ShieldCheck className="w-4 h-4 text-[#b38330]" /> 18. Verified Listings (RERA Audited Quality Seal)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Verified Landlord/Owner", checked: pgVerifOwner, set: setPgVerifOwner },
                        { label: "Verified PG Property", checked: pgVerifPg, set: setPgVerifPg },
                        { label: "Verified Actual Photos", checked: pgVerifPhotos, set: setPgVerifPhotos },
                        { label: "Verified Live Amenities", checked: pgVerifAmenities, set: setPgVerifAmenities }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-205 text-xs font-bold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500 animate-slideUp" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Management and Posted timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                        <User className="w-4 h-4 text-[#b38330]" /> 19. Managed / Operated By Profile
                      </h4>
                      <div className="flex gap-2">
                        {[
                          { label: "Registered Owners", value: "Owner" },
                          { label: "Co-living Brand", value: "Professional Brand" },
                          { label: "Any Operative", value: "All" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPgManagedBy(item.value)}
                            className={`px-3 py-2 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                              pgManagedBy === item.value 
                                ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                        <Calendar className="w-4 h-4 text-[#b38330]" /> 20. Posted Timeline Index
                      </h4>
                      <div className="flex gap-2 font-sans">
                        {[
                          { label: "Posted Today Only", value: "Today" },
                          { label: "Last 3 Days Only", value: "3days" },
                          { label: "All Postings", value: "All" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPgPostedTime(item.value)}
                            className={`px-3 py-2 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                              pgPostedTime === item.value 
                                ? 'bg-[#b38330] text-white border-[#b38330]' 
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Smart Presets */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-[#0E1F35]/10 font-sans">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-500 animate-pulse" /> 21. AI Smart Curated Presets (Premium Match)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "🎓 Best for Students", checked: pgAiBestForStudents, set: setPgAiBestForStudents },
                        { label: "💼 Best for Remote Workers", checked: pgAiBestForWorkers, set: setPgAiBestForWorkers },
                        { label: "👩 Best for Women/Girls", checked: pgAiBestForGirls, set: setPgAiBestForGirls },
                        { label: "🤫 Quiet Studious Env & Acoustic Check", checked: pgAiQuietEnvironment, set: setPgAiQuietEnvironment },
                        { label: "💸 Budget-Friendly High Comfort", checked: pgAiBudgetFriendly, set: setPgAiBudgetFriendly }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => item.set(!item.checked)}
                          className={`px-3.5 py-2 text-xs font-black rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                            item.checked 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.03]' 
                              : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lifestyle Communities */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-extrabold text-[#0E1F35] tracking-wider uppercase mb-3 flex items-center gap-1.5 border-b border-gray-250 pb-2">
                      <Activity className="w-4 h-4 text-[#b38330]" /> 22. Co-living Lifestyle Preferences
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Community Events", checked: pgLifeCommunityEvents, set: setPgLifeCommunityEvents },
                        { label: "Professional Networking", checked: pgLifeNetworking, set: setPgLifeNetworking },
                        { label: "Startup & Founder Friendly", checked: pgLifeStartupFriendly, set: setPgLifeStartupFriendly },
                        { label: "Fitness & Sport Focused", checked: pgLifeFitness, set: setPgLifeFitness }
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 select-none checkbox-container">
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.set(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal sticky footer */}
            <div className="bg-slate-50 p-4 border-t border-gray-200 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
              <div className="text-left leading-normal font-sans">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Criteria Matrix:</span>
                <p className="text-xs sm:text-sm font-black text-[#0D1F34] mt-1 flex items-center gap-1.5 whitespace-normal leading-normal">
                  <span className="inline-block h-3 w-3 rounded-full bg-amber-500 animate-bounce"></span>
                  {countActivePgFilters} active filters match {filteredListings.length} premium properties
                </p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto font-sans">
                <button
                  type="button"
                  onClick={resetAllPgFilters}
                  className="w-full sm:w-auto bg-slate-250 hover:bg-slate-300 text-slate-800 font-extrabold text-xs uppercase px-5 py-3 transition-colors rounded-xl cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="w-full sm:w-auto bg-[#0E1F35] hover:bg-slate-900 text-white font-extrabold text-xs uppercase px-12 py-3 transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400 stroke-[3]" /> Apply & Matrix Lock {filteredListings.length} properties
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
