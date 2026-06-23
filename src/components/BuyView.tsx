import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Building, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  CheckCircle,
  Check,
  Home,
  User,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Star,
  Compass,
  FileCheck,
  Calendar,
  Percent,
  ShieldCheck,
  Layers,
  Heart,
  TrendingUp,
  Award,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  Share2,
  MessageSquare,
  Eye,
  RotateCw,
  X,
  Sparkle,
  Clock,
  Map,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { TabType, PropertyListing } from '../types';
import { dispatchXPAward } from '../lib/gamification';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// @ts-ignore
import plotAerialGrid from '../assets/images/plot_aerial_grid_1779772017773.png';
// @ts-ignore
import shortApartment from '../assets/images/short_apartment_1779773524780.png';
// @ts-ignore
import orangeVilla from '../assets/images/orange_villa_1779450943253.png';
// @ts-ignore
import shortLivingroom from '../assets/images/short_livingroom_1779773542457.png';
// @ts-ignore
import aboutLuxuryVilla from '../assets/images/about_luxury_villa_1779451851413.png';
// @ts-ignore
import panoBedroom from '../assets/images/pano_bedroom_1779773910544.png';
// @ts-ignore
import shortKitchen from '../assets/images/short_kitchen_1779773504811.png';
// @ts-ignore
import shortNewlyTiled from '../assets/images/short_newlytiled_1779773561768.png';
// @ts-ignore
import panoLivingRoom from '../assets/images/pano_living_room_1779773888535.png';
import AdsSection from './AdsSection';
import PannellumViewer from './PannellumViewer';

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

interface BuyViewProps {
  onBackToHome: () => void;
  onPropertyClick: (id: string) => void;
  onTabChange?: (tab: TabType) => void;
}

// Nagpur buy listings mock dataset matching layout with gorgeous, curated Unsplash real estate images
const NAGPUR_BUY_LI_SAMPLES = [
  {
    id: 'nag-1',
    title: '4 BHK Ultra-Flat',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    locality: 'Manish Nagar, Wardha Road',
    areaLabel: 'Manish Nagar',
    city: 'Nagpur',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,450 sqft',
    clearance: 'RERA Approved (PRM-NGP-9029), Water & Electricity Clearances Secured',
    builder: 'Shivangan Builders',
    rating: 4.9,
    reviews: 48,
    possession: 'Ready to Move',
    facing: 'East Facing (Vastu Compliant)',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    amenities: ['Power Backup', 'Covered Parking', 'Modular Kitchen', 'Private Lift Unit']
  },
  {
    id: 'nag-2',
    title: '4 BHK Luxury Vista',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    locality: 'Besa Main Road, New Extension',
    areaLabel: 'Besa',
    city: 'Nagpur',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,250 sqft',
    clearance: 'Corporation NIM Water Line Connected, 100% Tax Completed',
    builder: 'Rachana Constructions',
    rating: 4.8,
    reviews: 32,
    possession: 'Possession in 3 Months',
    facing: 'North Facing',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    amenities: ['CCTV Security', 'Solar Water Heater', 'Rooftop Gymnasium']
  },
  {
    id: 'nag-3',
    title: '4 BHK Royal Penthouse',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    locality: 'Dharampeth Premium Row',
    areaLabel: 'Dharampeth',
    city: 'Nagpur',
    bhk: '4 BHK',
    beds: 4,
    baths: 5,
    balconies: 4,
    area: '2,600 sqft',
    clearance: 'All 30-year ancestral property title papers clear & legally verified',
    builder: 'Sandesh Group',
    rating: 4.9,
    reviews: 64,
    possession: 'Ready to Move',
    facing: 'North-East Dual Facing',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    amenities: ['Rooftop Sitting Area', 'Piped Gas Line', 'Modular Teakwood Closets']
  },
  {
    id: 'nag-4',
    title: '4 BHK Executive Villa-Apartment',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    locality: 'Trimurti Nagar Metro Link',
    areaLabel: 'Trimurti Nagar',
    city: 'Nagpur',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,350 sqft',
    clearance: 'Occupancy Certificate (OC) fully issued by NMC authority',
    builder: 'Jayanti Mansions Group',
    rating: 4.7,
    reviews: 29,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    amenities: ['Children Play Park', 'Rainwater Harvesting', 'Vastu Main Entrance']
  },
  {
    id: 'nag-5',
    title: '4 BHK Majestic Heights',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    locality: 'Somalwada Central Boulevard',
    areaLabel: 'Somalwada',
    city: 'Nagpur',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,500 sqft',
    clearance: 'Noida-Nagpur express access, SBI/HDFC pre-approved for 90% loan eligibility',
    builder: 'SDPL Land Developers',
    rating: 4.9,
    reviews: 51,
    possession: 'Possession in 6 Months',
    facing: 'West Facing',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    amenities: ['Terrace Zen Garden', 'High-speed Capsule Lift', 'Smart Video Door Phone']
  },
  {
    id: 'nag-6',
    title: '4 BHK Grande Seaface Residence',
    price: '₹ 4.25 Cr',
    numericPrice: 42505000,
    locality: 'Bandra West, Carter Road',
    areaLabel: 'Bandra West',
    city: 'Mumbai',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,800 sqft',
    clearance: 'MCGM Clearance & Registry Double-checked, Certified Builtup Area Layout',
    builder: 'Lodha Group',
    rating: 4.9,
    reviews: 45,
    possession: 'Ready to Move',
    facing: 'North Facing',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80',
    amenities: ['Covered Car Slots', '24 Hr Treated Water', 'Gated Compound Desk']
  },
  {
    id: 'nag-7',
    title: '4 BHK Celestial Worli Heights',
    price: '₹ 7.40 Cr',
    numericPrice: 74000000,
    locality: 'Worli Elite Row, South Mumbai',
    areaLabel: 'Worli',
    city: 'Mumbai',
    bhk: '4 BHK',
    beds: 4,
    baths: 5,
    balconies: 4,
    area: '3,100 sqft',
    clearance: 'Fully cleared. All title search reports up to 1990 clear.',
    builder: 'Godrej Properties',
    rating: 4.9,
    reviews: 38,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80',
    amenities: ['Video Intercom Enabled', 'Underground Gas Pipelining', 'Fully Equipped Private Lounge']
  },
  {
    id: 'nag-8',
    title: '4 BHK Silicon Meadows Flat',
    price: '₹ 2.92 Cr',
    numericPrice: 29200000,
    locality: 'Whitefield Tech Link',
    areaLabel: 'Whitefield',
    city: 'Bengaluru',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,380 sqft',
    clearance: 'RERA Approved (PRM-KA-3841), Ready for Spot Registry',
    builder: 'Prestige Group',
    rating: 4.8,
    reviews: 26,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    amenities: ['EV Charging Port Block', 'Kid\'s Activity Hall', 'Power Backup']
  },
  {
    id: 'nag-9',
    title: '4 BHK Imperial Powai Parkside',
    price: '₹ 3.65 Cr',
    numericPrice: 36500000,
    locality: 'Powai Green Field Road',
    areaLabel: 'Powai',
    city: 'Mumbai',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,950 sqft',
    clearance: 'MCGM Municipal OC fully issued. No pending land cess.',
    builder: 'Hiranandani Group',
    rating: 4.9,
    reviews: 57,
    possession: 'Ready to Move',
    facing: 'West Facing',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    amenities: ['Infinity Sky Walkway', 'Concierge Lobby Desk', 'Solar Rooftop Panel Array']
  },
  {
    id: 'nag-10',
    title: '4 BHK Serenade Mansion',
    price: '₹ 3.10 Cr',
    numericPrice: 31000000,
    locality: 'Indiranagar Metro Corridor',
    areaLabel: 'Indiranagar',
    city: 'Bengaluru',
    bhk: '4 BHK',
    beds: 4,
    baths: 5,
    balconies: 3,
    area: '2,700 sqft',
    clearance: 'BBMP mutation records fully updated, No encumbrances',
    builder: 'Sobha Developers',
    rating: 4.7,
    reviews: 40,
    possession: 'Possession in 3 Months',
    facing: 'North-West Facing',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
    amenities: ['Multipurpose Court', 'Intercom Facility', '2 Covered Parking Bays']
  },
  {
    id: 'nag-11',
    title: '4 BHK Heritage Elite Flats',
    price: '₹ 2.78 Cr',
    numericPrice: 27800050,
    locality: 'Koregaon Park Central Area',
    areaLabel: 'Koregaon Park',
    city: 'Pune',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,200 sqft',
    clearance: 'PMC Reg & Water layout certificate fully signed',
    builder: 'Kolte-Patil Developers',
    rating: 4.8,
    reviews: 19,
    possession: 'Possession in 6 Months',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    amenities: ['Water Purifier Plant', 'Pre-installed Modular Chimney', '24x7 Armed Guard Patrol']
  },
  {
    id: 'nag-12',
    title: '4 BHK Baner Hills View',
    price: '₹ 1.70 Cr',
    numericPrice: 17000000,
    locality: 'Baner Expressway Link Layout',
    areaLabel: 'Baner',
    city: 'Pune',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,150 sqft',
    clearance: 'PMC Sanction Letter, Complete Electricity NOC Granted',
    builder: 'Goel Ganga Developments',
    rating: 4.6,
    reviews: 22,
    possession: 'Ready to Move',
    facing: 'North Facing',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
    amenities: ['Society Temple & Park', 'Gymnasium Setup', 'CCTV Coverage']
  },
  {
    id: 'nag-13',
    title: '4 BHK Smart Home Kothrud',
    price: '₹ 2.20 Cr',
    numericPrice: 22000000,
    locality: 'Kothrud Residency Row Zone',
    areaLabel: 'Kothrud',
    city: 'Pune',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,650 sqft',
    clearance: 'Full Structural Safety Certificate, PMC Approved Plots Plan',
    builder: 'Pharande Spaces',
    rating: 4.8,
    reviews: 31,
    possession: 'Ready to Move',
    facing: 'South Facing',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    amenities: ['Smart Keyless Entry', 'Wi-Fi Enabled Club Area', 'Rooftop Yoga Lounge']
  },
  {
    id: 'nag-14',
    title: '4 BHK Royal Koramangala Flat',
    price: '₹ 3.35 Cr',
    numericPrice: 33500000,
    locality: 'Koramangala 3rd Block Row',
    areaLabel: 'Koramangala',
    city: 'Bengaluru',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 4,
    area: '3,000 sqft',
    clearance: '30-Year clear title certificate, State Bank of India Approved Loan Project',
    builder: 'Brigade Group',
    rating: 4.9,
    reviews: 49,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80',
    amenities: ['Italian Marble Flooring', 'Piped Gas', 'Dedicated Servant Quarter']
  },
  {
    id: 'nag-15',
    title: '4 BHK Emerald HSR Enclave',
    price: '₹ 2.80 Cr',
    numericPrice: 28000000,
    locality: 'HSR Layout Sector 3',
    areaLabel: 'HSR Layout',
    city: 'Bengaluru',
    bhk: '4 BHK',
    beds: 4,
    baths: 5,
    balconies: 3,
    area: '3,200 sqft',
    clearance: 'BBMP Environmental Clearance compliance & certified clean documentation',
    builder: 'Puravankara',
    rating: 4.9,
    reviews: 41,
    possession: 'Ready to Move',
    facing: 'Northeast Vastu Compliant',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80',
    amenities: ['Direct Forest Overlook', 'Double Height Grand Lobby', 'Solar Grid Back-feed Facility']
  },
  {
    id: 'nag-16',
    title: '4 BHK Gurugram Golf-View Flat',
    price: '₹ 5.68 Cr',
    numericPrice: 56800000,
    locality: 'Gurugram Golf Course Road, Sector 54',
    areaLabel: 'Gurugram',
    city: 'Delhi NCR',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,100 sqft',
    clearance: 'HRERA Certificate fully obtained. Registry and transfer starting next month.',
    builder: 'DLF Builders',
    rating: 4.5,
    reviews: 15,
    possession: 'Possession in 6 Months',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
    amenities: ['Covered Parking Slot', 'Borewell Water Vetting', 'Dedicated Lift with ARD System']
  },
  {
    id: 'nag-17',
    title: '4 BHK Noida Sector Heights',
    price: '₹ 1.99 Cr',
    numericPrice: 19900000,
    locality: 'Noida Sector 62 Link Road',
    areaLabel: 'Noida',
    city: 'Delhi NCR',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,550 sqft',
    clearance: 'UPRERA Approved (PRM-NOI-1011), Prime location near sector Metro',
    builder: 'Tata Housing',
    rating: 4.8,
    reviews: 34,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=600&q=80',
    amenities: ['Close Proximity to Metro Terminal', 'State-of-the-art Gym Room', 'RO Treated Water Plant Supply']
  },
  {
    id: 'nag-18',
    title: '4 BHK Elite Wakad Flats',
    price: '₹ 1.65 Cr',
    numericPrice: 16500000,
    locality: 'Wakad Express Ring Road',
    areaLabel: 'Wakad',
    city: 'Pune',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,050 sqft',
    clearance: 'Corporation tax fully cleared, building blueprints cleared by PMC authorities',
    builder: 'VTP Realty',
    rating: 4.4,
    reviews: 18,
    possession: 'Ready to Move',
    facing: 'Northeast Facing',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    amenities: ['CCTV Network Security', 'Kid\'s Play Zone Complex', 'Separate Water Tanks']
  },
  {
    id: 'nag-19',
    title: '4 BHK Pinnacle Kunj Palace',
    price: '₹ 4.30 Cr',
    numericPrice: 43000000,
    locality: 'Vasant Kunj Premium Block',
    areaLabel: 'Vasant Kunj',
    city: 'Delhi NCR',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,850 sqft',
    clearance: 'Title-Search Report certified clear for last 30 years by DDA Panel Advocate',
    builder: 'Omaxe Group',
    rating: 4.9,
    reviews: 52,
    possession: 'Ready to Move',
    facing: 'North Facing',
    image: 'https://images.unsplash.com/photo-1598228723793-52759bba2457?auto=format&fit=crop&w=600&q=80',
    amenities: ['Premium Wooden Parquet Bed Decking', 'Centralized Intercom Setup', 'Secure Fire Sprinkler Array']
  },
  {
    id: 'nag-20',
    title: '4 BHK Regent Juhu Plaza',
    price: '₹ 8.50 Cr',
    numericPrice: 85000000,
    locality: 'Juhu Beachside Enclave',
    areaLabel: 'Juhu',
    city: 'Mumbai',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,200 sqft',
    clearance: 'MCGM Coastal Regulation Zone certified, immediate possession',
    builder: 'K Raheja Corp',
    rating: 4.6,
    reviews: 12,
    possession: 'Possession in 3 Months',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    amenities: ['Jogging Track Grid', 'Solar Gated Lampposts', 'Automatic Elevators Setup']
  },
  {
    id: 'nag-21',
    title: '4 BHK Imperial Andheri East',
    price: '₹ 3.15 Cr',
    numericPrice: 31500000,
    locality: 'Andheri East Metro Line Junction',
    areaLabel: 'Andheri East',
    city: 'Mumbai',
    bhk: '4 BHK',
    beds: 4,
    baths: 5,
    balconies: 3,
    area: '2,600 sqft',
    clearance: 'Pre-approved housing credit with HDFC/SBI, Full PMC and BMC NOCs',
    builder: 'K Raheja Corp',
    rating: 4.7,
    reviews: 23,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    amenities: ['Power Backups', 'Terrace Sitting Space', 'Piped Natural Gas System']
  },
  {
    id: 'nag-22',
    title: '4 BHK Meadow Electronic Flat',
    price: '₹ 1.45 Cr',
    numericPrice: 14500000,
    locality: 'Electronic City Phase 1 Lane',
    areaLabel: 'Electronic City',
    city: 'Bengaluru',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,080 sqft',
    clearance: 'BMRDA layout approved plot, registry update files fully verified',
    builder: 'Puravankara',
    rating: 4.5,
    reviews: 31,
    possession: 'Ready to Move',
    facing: 'West Facing',
    image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=600&q=80',
    amenities: ['Pristine Ground Water Access', 'Rooftop Party Space', 'Solar Gated Street Lights']
  },
  {
    id: 'nag-23',
    title: '4 BHK Paradise Hinjawadi Flat',
    price: '₹ 1.55 Cr',
    numericPrice: 15500000,
    locality: 'Hinjawadi IT Hub, Phase 1',
    areaLabel: 'Hinjawadi',
    city: 'Pune',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 2,
    area: '2,150 sqft',
    clearance: 'PMRDA Reg. Clear land holding papers, ready for registry',
    builder: 'VTP Realty',
    rating: 4.4,
    reviews: 14,
    possession: 'Ready to Move',
    facing: 'North Facing',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    amenities: ['24Hr Guard Gate Security Desk', 'Kids Play Zone Sandbox', 'Intercom Network Connected']
  },
  {
    id: 'nag-24',
    title: '4 BHK Sovereign Dwarka Villa',
    price: '₹ 3.95 Cr',
    numericPrice: 39500000,
    locality: 'Dwarka Sector 22, Dwarka Expressway',
    areaLabel: 'Dwarka Expressway',
    city: 'Delhi NCR',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,480 sqft',
    clearance: 'DDA Master Plan compliance obtained and registry certified',
    builder: 'Shapoorji Pallonji',
    rating: 4.8,
    reviews: 25,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80',
    amenities: ['Dedicated Private Electric Charging Berth', 'Terrace Zen Sitouts', 'Automatic Fire Control Line']
  },
  {
    id: 'nag-25',
    title: '4 BHK Landmark Connaught Flat',
    price: '₹ 8.20 Cr',
    numericPrice: 82000000,
    locality: 'Connaught Place Outer Circle',
    areaLabel: 'Connaught Place',
    city: 'Delhi NCR',
    bhk: '4 BHK',
    beds: 4,
    baths: 4,
    balconies: 3,
    area: '2,300 sqft',
    clearance: 'NDMC Approved Heritage-zone compliance double-checked & cleared',
    builder: 'Omaxe Group',
    rating: 4.7,
    reviews: 30,
    possession: 'Ready to Move',
    facing: 'East Facing',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    amenities: ['NMC Sweet Water Connection Grid', 'Multilevel Smart Car Parking', 'High Speed Capsule Lifters']
  }
];

// Enhanced Buy Listings list mapping all properties to rich realistic Indian real-estate attributes to support all 20 categories of filters.
const ENHANCED_BUY_LISTINGS_LIST = NAGPUR_BUY_LI_SAMPLES.map((item, index) => {
  const pCity = item.city;

  // Property types mapping
  let propertyType = 'Apartment';
  if (item.title.toLowerCase().includes('villa')) propertyType = 'Villa';
  else if (item.title.toLowerCase().includes('mansion')) propertyType = 'Villa';
  else if (item.title.toLowerCase().includes('house')) propertyType = 'Independent House';
  else if (item.title.toLowerCase().includes('penthouse')) propertyType = 'Penthouse';
  else if (item.title.toLowerCase().includes('plot') || item.title.toLowerCase().includes('land')) propertyType = 'Plot / Land';
  else if (index % 5 === 4) propertyType = 'Builder Floor';
  else if (index % 6 === 5) propertyType = 'Farmhouse';

  // Specific indexes represent commercial spaces, etc.
  if (index === 8) propertyType = 'Commercial Office';
  if (index === 12) propertyType = 'Commercial Shop';
  if (index === 16) propertyType = 'Commercial Warehouse';

  // Price calculations
  const areas = [1200, 1800, 2400, 3100, 4500, 950, 1400, 2200, 1650, 2800, 3500, 800, 1500, 1900, 2600, 4000, 5200, 1100, 1350, 1750, 2100, 2900, 3300, 4800, 6000];
  const sizeSqft = areas[index % areas.length];
  const priceSqft = Math.round(item.numericPrice / sizeSqft);

  // Landmarks & Pincodes
  const pincodeOptions = ['440015', '440034', '400050', '400018', '560066', '560034', '411001', '411045', '110011', '122002'];
  const pincode = pincodeOptions[(index * 3) % pincodeOptions.length];

  const landmarks: Record<string, string[]> = {
    'Nagpur': ['Manish Nagar Crossing', 'Besa Petrol Pump', 'Dharampeth Metro', 'Trimurti Nagar Corner', 'Somalwada Lake'],
    'Mumbai': ['Carter Road Promenade', 'Worli Sea Link Toll', 'Hiranandani Powai Lake', 'Juhu Chowpatty Garden'],
    'Bengaluru': ['Whitefield IT Park', 'Indiranagar Metro Terminal', 'Koramangala 3rd Block', 'HSR Layout Sector 3 Park'],
    'Pune': ['Koregaon Park lane 5', 'Baner Highway Circle', 'Kothrud Depo Terminal', 'Hinjawadi IT Park Quadrant'],
    'Delhi NCR': ['Golf Course Ext Road', 'Noida Sector 62 Link', 'Vasant Kunj Club', 'Dwarka Sector 22 Market']
  };
  const listLandmarks = landmarks[pCity] || ['Central Park Link'];
  const landmark = listLandmarks[index % listLandmarks.length];

  // BHK Overwrite to cover full configurations
  let bhk = item.bhk;
  let beds = item.beds;
  if (index === 6 || index === 11) { bhk = '1 RK'; beds = 1; }
  else if (index === 5 || index === 13) { bhk = '1 BHK'; beds = 1; }
  else if (index === 7 || index === 18) { bhk = '2 BHK'; beds = 2; }
  else if (index === 9 || index === 21) { bhk = '3 BHK'; beds = 3; }
  else if (index === 15) { bhk = 'Studio apartment'; beds = 1; }
  else if (index === 23) { bhk = 'Duplex'; beds = 5; }

  const statusList = ['Ready to move', 'Under construction', 'New launch', 'Resale'];
  const status = statusList[index % statusList.length];

  const furnishingList = ['Fully furnished', 'Semi furnished', 'Unfurnished'];
  const furnishing = furnishingList[index % furnishingList.length];

  const facingList = ['East', 'West', 'North', 'South'];
  const facingDir = facingList[index % facingList.length];

  const floors = ['Ground floor', 'Middle floor', 'Top floor'];
  const floorType = floors[index % floors.length];
  const totalFloors = 4 + (index * 3) % 25;

  const ownerships = ['Freehold', 'Leasehold', 'Co-operative society'];
  const ownershipType = ownerships[index % ownerships.length];

  const sellerTypes = ['Owner', 'Builder', 'Agent'];
  const sellerType = sellerTypes[index % sellerTypes.length];

  const times = ['today', '3days', 'week', 'month'];
  const postedTime = times[index % times.length];

  const amenitiesGroup = [
    'Parking', 'Lift', 'Security', 'Power backup', 'Water supply', 'Gym', 'Swimming pool', 
    'Clubhouse', 'Garden', 'Children\'s play area', 'CCTV', 'EV charging', 'Internet/WiFi',
    'Smart home', 'Rooftop garden', 'Co-working space', 'Theater', 'Pet park'
  ];
  const amenities = amenitiesGroup.filter((_, i) => (i + index) % 3 === 0 || (i * index) % 4 === 1);

  return {
    ...item,
    bhk,
    beds,
    pincode,
    landmark,
    nearMetro: index % 3 === 0,
    schoolNearby: index % 2 === 0,
    hospitalNearby: index % 3 !== 1,
    radius: 1 + (index * 1.5) % 9, // radius in km (1.0 to 14.5)
    commuteTime: 5 + (index * 4) % 40, // in mins
    propertyType,
    sizeSqft,
    sizeSqm: Math.round(sizeSqft * 0.092903),
    sizeAcres: parseFloat((sizeSqft / 43560).toFixed(4)),
    sizeGuntha: parseFloat((sizeSqft / 1089).toFixed(1)), // guntha = 1089 sqft
    carpetArea: Math.round(sizeSqft * 0.76),
    builtUpArea: Math.round(sizeSqft * 0.88),
    superBuiltUpArea: sizeSqft,
    priceSqft,
    propertyStatus: status,
    possessionYear: index % 4 === 0 ? 'Immediate' : (2026 + (index % 3)).toString(),
    furnishing,
    amenities,
    verifiedListing: index % 4 !== 3,
    builderRating: parseFloat((4.0 + (index % 10) * 0.1).toFixed(1)),
    builderExperience: 4 + (index * 2) % 22,
    propertyAge: index % 4 === 0 ? 'New' : index % 4 === 1 ? '1–5 years' : index % 4 === 2 ? '5–10 years' : '10+ years',
    ownershipType,
    reraApproved: index % 5 !== 4,
    bankApproved: index % 4 !== 3,
    clearTitle: index % 3 !== 2,
    vaastuCompliant: index % 2 === 0,
    cornerProperty: index % 3 === 1,
    floorType,
    totalFloors,
    parkingType: index % 3 === 0 ? 'Bike parking' : index % 3 === 1 ? 'Car parking' : 'Covered parking',
    nearEssentials: index % 2 === 0 ? ['Near schools', 'Near hospitals', 'Near metro'] : ['Near IT park', 'Near market', 'Near airport'],
    investmentTag: index % 4 === 0 ? 'High ROI properties' : index % 4 === 1 ? 'High rental yield' : index % 4 === 2 ? 'Fast appreciation areas' : 'Best for investment',
    aiTag: index % 5 === 0 ? 'Best family homes' : index % 5 === 1 ? 'Best bachelor-friendly' : index % 5 === 2 ? 'Luxury properties' : index % 5 === 3 ? 'Best for retirement' : 'Student-friendly',
    sellerType,
    postedTime,
    availability: index % 2 === 0 ? 'Immediate possession' : 'Available now'
  };
});

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
};

const TARGET_MAP_CITIES = ['Nagpur', 'Mumbai', 'Bengaluru', 'Pune', 'Delhi NCR'];

export default function BuyView({ onBackToHome, onPropertyClick, onTabChange }: BuyViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [localityFilter, setLocalityFilter] = useState<string>('All');
  const [possessionFilter, setPossessionFilter] = useState<string>('All');
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<'All' | 'Apartment' | 'Villa' | 'Builder Floor' | 'Farm House' | 'Studio'>('All');
  const [categoryPage, setCategoryPage] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedIntel, setSelectedIntel] = useState<any | null>(null);

  // States for Geolocation Buy Map
  const [showBuyMapModal, setShowBuyMapModal] = useState<boolean>(false);
  const [activeMapCity, setActiveMapCity] = useState<string>('Nagpur');
  const [selectedMapListing, setSelectedMapListing] = useState<any | null>(null);
  const [useMockupMap, setUseMockupMap] = useState<boolean>(!hasValidKey);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);
  const [mobileModalTab, setMobileModalTab] = useState<'map' | 'info'>('map');

  const getMapBuyResultsWithCoordinates = (city: string): (any & { lat: number; lng: number })[] => {
    const rawListings = buyListingsToUse.filter(item => item.city === city);
    const center = CITY_COORDINATES[city] || { lat: 21.1458, lng: 79.0882 };
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
    if (showBuyMapModal && !selectedMapListing) {
      const r = getMapBuyResultsWithCoordinates(activeMapCity);
      if (r.length > 0) setSelectedMapListing(r[0]);
    }
  }, [showBuyMapModal, activeMapCity]);

  // States for 20 Advanced Filter Categories
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState<boolean>(false);
  const [activeFilterCategoryTab, setActiveFilterCategoryTab] = useState<number>(0);

  // Category 1: Location Filters
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterLocality, setFilterLocality] = useState<string>('All');
  const [filterLandmark, setFilterLandmark] = useState<string>('All');
  const [filterPincode, setFilterPincode] = useState<string>('');
  const [filterNearMetroHighway, setFilterNearMetroHighway] = useState<boolean>(false);
  const [filterSchoolNearby, setFilterSchoolNearby] = useState<boolean>(false);
  const [filterHospitalNearby, setFilterHospitalNearby] = useState<boolean>(false);
  const [filterRadius, setFilterRadius] = useState<string>('All');
  const [filterCommuteTime, setFilterCommuteTime] = useState<number>(60);

  // Category 2: Budget Filters
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(100000000);
  const [filterQuickBudget, setFilterQuickBudget] = useState<string>('All');
  const [filterPricePerSqFt, setFilterPricePerSqFt] = useState<number>(15000);
  const [emiPrincipal, setEmiPrincipal] = useState<number>(4000000);
  const [emiInterest, setEmiInterest] = useState<number>(8.5);
  const [emiTenure, setEmiTenure] = useState<number>(20);

  // Category 3: Property Type
  const [filterPropertyType, setFilterPropertyType] = useState<string>('All');

  // Category 4: BHK Configuration
  const [filterBhk, setFilterBhk] = useState<string>('All');

  // Category 5: Area / Size Filters
  const [filterMinArea, setFilterMinArea] = useState<number>(0);
  const [filterMaxArea, setFilterMaxArea] = useState<number>(10000);
  const [filterAreaUnit, setFilterAreaUnit] = useState<string>('Sq.ft');
  const [filterAreaType, setFilterAreaType] = useState<string>('All');

  // Category 6: Property Status
  const [filterPropertyStatus, setFilterPropertyStatus] = useState<string>('All');
  const [filterPossessionYear, setFilterPossessionYear] = useState<string>('All');

  // Category 7: Furnishing Status
  const [filterFurnishing, setFilterFurnishing] = useState<string>('All');

  // Category 8: Amenities Filters
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);

  // Category 9: Builder / Project Filters
  const [filterBuilderName, setFilterBuilderName] = useState<string>('All');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);
  const [filterMinBuilderRating, setFilterMinBuilderRating] = useState<number>(0);
  const [filterMinBuilderExperience, setFilterMinBuilderExperience] = useState<number>(0);

  // Category 10: Property Age
  const [filterPropertyAge, setFilterPropertyAge] = useState<string>('All');

  // Category 11: Ownership & Legal Filters
  const [filterOwnership, setFilterOwnership] = useState<string>('All');
  const [filterReraApproved, setFilterReraApproved] = useState<boolean>(false);
  const [filterBankApproved, setFilterBankApproved] = useState<boolean>(false);
  const [filterClearTitle, setFilterClearTitle] = useState<boolean>(false);

  // Category 12: Facing & Direction
  const [filterFacing, setFilterFacing] = useState<string>('All');
  const [filterCornerProperty, setFilterCornerProperty] = useState<boolean>(false);
  const [filterVaastuCompliant, setFilterVaastuCompliant] = useState<boolean>(false);

  // Category 13: Floor Filters
  const [filterFloor, setFilterFloor] = useState<string>('All');
  const [filterMinTotalFloors, setFilterMinTotalFloors] = useState<number>(0);

  // Category 14: Parking Filters
  const [filterParkingType, setFilterParkingType] = useState<string>('All');

  // Category 15: Nearby Essentials
  const [filterNearbyEssentials, setFilterNearbyEssentials] = useState<string[]>([]);

  // Category 16: Investment Filters
  const [filterInvestment, setFilterInvestment] = useState<string>('All');

  // Category 17: Smart AI Search Filters
  const [filterSmartAi, setFilterSmartAi] = useState<string>('All');

  // Category 18: Seller Type
  const [filterSellerType, setFilterSellerType] = useState<string>('All');

  // Category 19: Posted Time
  const [filterPostedTime, setFilterPostedTime] = useState<string>('All');

  // Category 20: Availability Filters
  const [filterAvailability, setFilterAvailability] = useState<string>('All');

  // Sync basic quick controls with advanced filters state
  useEffect(() => {
    setFilterCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setFilterLocality(localityFilter);
  }, [localityFilter]);

  // Synchronize Possession selection
  useEffect(() => {
    if (possessionFilter === 'All') {
      setFilterPropertyStatus('All');
    } else if (possessionFilter === 'Ready to Move') {
      setFilterPropertyStatus('Ready to move');
    } else {
      setFilterPropertyStatus('Under construction');
    }
  }, [possessionFilter]);

  // Reset function inside component scope
  const resetAllFilters = () => {
    setFilterCity('All');
    setFilterLocality('All');
    setFilterLandmark('All');
    setFilterPincode('');
    setFilterNearMetroHighway(false);
    setFilterSchoolNearby(false);
    setFilterHospitalNearby(false);
    setFilterRadius('All');
    setFilterCommuteTime(60);

    setFilterMinPrice(0);
    setFilterMaxPrice(100000000);
    setFilterQuickBudget('All');
    setFilterPricePerSqFt(15000);
    setEmiPrincipal(4000000);
    setEmiInterest(8.5);
    setEmiTenure(20);

    setFilterPropertyType('All');
    setFilterBhk('All');

    setFilterMinArea(0);
    setFilterMaxArea(10000);
    setFilterAreaUnit('Sq.ft');
    setFilterAreaType('All');

    setFilterPropertyStatus('All');
    setFilterPossessionYear('All');

    setFilterFurnishing('All');
    setFilterAmenities([]);

    setFilterBuilderName('All');
    setFilterVerifiedOnly(false);
    setFilterMinBuilderRating(0);
    setFilterMinBuilderExperience(0);

    setFilterPropertyAge('All');

    setFilterOwnership('All');
    setFilterReraApproved(false);
    setFilterBankApproved(false);
    setFilterClearTitle(false);

    setFilterFacing('All');
    setFilterCornerProperty(false);
    setFilterVaastuCompliant(false);

    setFilterFloor('All');
    setFilterMinTotalFloors(0);

    setFilterParkingType('All');
    setFilterNearbyEssentials([]);

    setFilterInvestment('All');
    setFilterSmartAi('All');

    setFilterSellerType('All');
    setFilterPostedTime('All');
    setFilterAvailability('All');

    // Reset quick headers
    setSelectedCity('All');
    setLocalityFilter('All');
    setPossessionFilter('All');
    setSelectedTypeCategory('All');
    setSearchQuery('');
  };

  // Calculates current match counts
  const countActiveFilters = useMemo(() => {
    let count = 0;
    if (filterCity !== 'All') count++;
    if (filterLocality !== 'All') count++;
    if (filterLandmark !== 'All') count++;
    if (filterPincode !== '') count++;
    if (filterNearMetroHighway) count++;
    if (filterSchoolNearby) count++;
    if (filterHospitalNearby) count++;
    if (filterRadius !== 'All') count++;
    if (filterCommuteTime !== 60) count++;

    if (filterMinPrice > 0 || filterMaxPrice < 100000000) count++;
    if (filterQuickBudget !== 'All') count++;
    if (filterPricePerSqFt !== 15000) count++;

    if (filterPropertyType !== 'All') count++;
    if (filterBhk !== 'All') count++;

    if (filterMinArea > 0 || filterMaxArea < 10000) count++;
    if (filterAreaUnit !== 'Sq.ft') count++;
    if (filterAreaType !== 'All') count++;

    if (filterPropertyStatus !== 'All') count++;
    if (filterPossessionYear !== 'All') count++;

    if (filterFurnishing !== 'All') count++;
    if (filterAmenities.length > 0) count++;

    if (filterBuilderName !== 'All') count++;
    if (filterVerifiedOnly) count++;
    if (filterMinBuilderRating > 0) count++;
    if (filterMinBuilderExperience > 0) count++;

    if (filterPropertyAge !== 'All') count++;

    if (filterOwnership !== 'All') count++;
    if (filterReraApproved) count++;
    if (filterBankApproved) count++;
    if (filterClearTitle) count++;

    if (filterFacing !== 'All') count++;
    if (filterCornerProperty) count++;
    if (filterVaastuCompliant) count++;

    if (filterFloor !== 'All') count++;
    if (filterMinTotalFloors > 0) count++;

    if (filterParkingType !== 'All') count++;
    if (filterNearbyEssentials.length > 0) count++;

    if (filterInvestment !== 'All') count++;
    if (filterSmartAi !== 'All') count++;

    if (filterSellerType !== 'All') count++;
    if (filterPostedTime !== 'All') count++;
    if (filterAvailability !== 'All') count++;

    return count;
  }, [
    filterCity, filterLocality, filterLandmark, filterPincode, filterNearMetroHighway, filterSchoolNearby, filterHospitalNearby, filterRadius, filterCommuteTime,
    filterMinPrice, filterMaxPrice, filterQuickBudget, filterPricePerSqFt,
    filterPropertyType, filterBhk,
    filterMinArea, filterMaxArea, filterAreaUnit, filterAreaType,
    filterPropertyStatus, filterPossessionYear,
    filterFurnishing, filterAmenities,
    filterBuilderName, filterVerifiedOnly, filterMinBuilderRating, filterMinBuilderExperience,
    filterPropertyAge,
    filterOwnership, filterReraApproved, filterBankApproved, filterClearTitle,
    filterFacing, filterCornerProperty, filterVaastuCompliant,
    filterFloor, filterMinTotalFloors,
    filterParkingType, filterNearbyEssentials,
    filterInvestment, filterSmartAi,
    filterSellerType, filterPostedTime, filterAvailability
  ]);

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

  const tabs: TabType[] = ['Buy', 'Sell', 'Rent', 'Plots', 'PG/Co-Living'];

  // Combine core properties with custom uploaded Buy properties
  const [customBuyListings, setCustomBuyListings] = useState<any[]>([]);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const stored = localStorage.getItem('nest_uploaded_custom_properties_buy');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map(p => ({
              ...p,
              numericPrice: parseInt(p.price.replace(/[^\d]/g, '')) * 100000 || 5000000,
              city: p.location.split(',').pop()?.trim() || 'Nagpur',
              locality: p.location.split(',')[0]?.trim() || 'Manish Nagar',
              areaLabel: p.location.split(',')[0]?.trim() || 'Manish Nagar',
              builder: 'Private Owner',
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
              possessionStatus: 'Immediate Possession'
            }));
            setCustomBuyListings(mapped);
          }
        } else {
          setCustomBuyListings([]);
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

  const buyListingsToUse = useMemo(() => {
    return [...customBuyListings, ...ENHANCED_BUY_LISTINGS_LIST];
  }, [customBuyListings]);

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const isSaving = !prev.includes(id);
      if (isSaving) {
        dispatchXPAward('save_property');
      }
      return isSaving ? [...prev, id] : prev.filter(favId => favId !== id);
    });
  };

  // Extract unique localities for dynamic filtering
  const uniqueLocalities = useMemo(() => {
    const list = buyListingsToUse
      .filter(item => selectedCity === 'All' || item.city === selectedCity)
      .map(item => item.areaLabel);
    return ['All', ...Array.from(new Set(list))];
  }, [selectedCity, buyListingsToUse]);

  // Filter and search logic combined
  const filteredAndSearchedResults = useMemo(() => {
    return buyListingsToUse.filter(item => {
      // 1. Text Search query
      const matchesSearch = searchQuery === '' || 
        item.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 1b. City Filter (synced with selectedCity / filterCity)
      const matchesCity = filterCity === 'All' || item.city === filterCity;
      if (!matchesCity) return false;

      // 2. Locality Filter (synced with localityFilter / filterLocality)
      const matchesLocality = filterLocality === 'All' || item.areaLabel === filterLocality;
      if (!matchesLocality) return false;

      // Location filters
      if (filterLandmark !== 'All' && item.landmark !== filterLandmark) return false;
      if (filterPincode !== '' && !item.pincode.includes(filterPincode)) return false;
      if (filterNearMetroHighway && !item.nearMetro) return false;
      if (filterSchoolNearby && !item.schoolNearby) return false;
      if (filterHospitalNearby && !item.hospitalNearby) return false;
      if (filterRadius !== 'All') {
        const radVal = parseFloat(filterRadius);
        if (item.radius > radVal) return false;
      }
      if (item.commuteTime > filterCommuteTime) return false;

      // Budget Filters
      if (item.numericPrice < filterMinPrice || item.numericPrice > filterMaxPrice) return false;
      if (filterQuickBudget !== 'All') {
        if (filterQuickBudget === 'Under25' && item.numericPrice >= 2500000) return false;
        if (filterQuickBudget === '25to50' && (item.numericPrice < 2500000 || item.numericPrice > 5000000)) return false;
        if (filterQuickBudget === '50to100' && (item.numericPrice < 5000000 || item.numericPrice > 10000000)) return false;
        if (filterQuickBudget === 'Over100' && item.numericPrice < 10000000) return false;
      }
      if (item.priceSqft > filterPricePerSqFt) return false;

      // Property Type
      if (filterPropertyType !== 'All') {
        if (filterPropertyType === 'Commercial') {
          if (!item.propertyType.startsWith('Commercial')) return false;
        } else {
          if (item.propertyType !== filterPropertyType) return false;
        }
      } else {
        // Fallback to selectedTypeCategory (the top visual category cards click)
        let matchesTypeCategory = true;
        if (selectedTypeCategory === 'Apartment') {
          const isVilla = item.title.toLowerCase().includes('villa') || item.title.toLowerCase().includes('mansion') || item.title.toLowerCase().includes('house');
          matchesTypeCategory = !isVilla;
        } else if (selectedTypeCategory === 'Villa') {
          matchesTypeCategory = item.title.toLowerCase().includes('villa') || item.title.toLowerCase().includes('mansion') || item.title.toLowerCase().includes('house') || item.title.toLowerCase().includes('penthouse') || item.title.toLowerCase().includes('row');
        } else if (selectedTypeCategory === 'Builder Floor') {
          matchesTypeCategory = item.title.toLowerCase().includes('flat') || item.title.toLowerCase().includes('floor') || item.title.toLowerCase().includes('heights');
        } else if (selectedTypeCategory === 'Farm House') {
          matchesTypeCategory = item.title.toLowerCase().includes('vista') || item.title.toLowerCase().includes('villa') || item.title.toLowerCase().includes('mansion');
        } else if (selectedTypeCategory === 'Studio') {
          matchesTypeCategory = item.area.includes('2,250') || item.title.toLowerCase().includes('apartment') || item.bhk === '4 BHK';
        }
        if (!matchesTypeCategory) return false;
      }

      // BHK / Room Configuration
      if (filterBhk !== 'All') {
        if (filterBhk === '4+ BHK') {
          const matches = item.bhk.includes('4') || item.bhk.includes('5') || item.bhk.includes('6') || item.beds >= 4;
          if (!matches) return false;
        } else {
          if (item.bhk !== filterBhk) return false;
        }
      }

      // Area / Size Filters
      let sizeValue = item.sizeSqft;
      if (filterAreaUnit === 'Sq.m') sizeValue = item.sizeSqm;
      else if (filterAreaUnit === 'Acres') sizeValue = item.sizeAcres;
      else if (filterAreaUnit === 'Guntha') sizeValue = item.sizeGuntha;

      if (sizeValue < filterMinArea || sizeValue > filterMaxArea) return false;

      if (filterAreaType !== 'All') {
        if (filterAreaType === 'Carpet' && !item.carpetArea) return false;
        if (filterAreaType === 'Built-up' && !item.builtUpArea) return false;
        if (filterAreaType === 'Super built-up' && !item.superBuiltUpArea) return false;
      }

      // Property Status
      if (filterPropertyStatus !== 'All') {
        if (filterPropertyStatus === 'Ready to move' && item.propertyStatus !== 'Ready to move') return false;
        if (filterPropertyStatus === 'Under construction' && item.propertyStatus !== 'Under construction') return false;
        if (filterPropertyStatus === 'New launch' && item.propertyStatus !== 'New launch') return false;
        if (filterPropertyStatus === 'Resale' && item.propertyStatus !== 'Resale') return false;
      }
      if (filterPossessionYear !== 'All' && item.possessionYear !== filterPossessionYear) return false;

      // Furnishing Status
      if (filterFurnishing !== 'All' && item.furnishing !== filterFurnishing) return false;

      // Amenities Filter
      if (filterAmenities.length > 0) {
        const hasAll = filterAmenities.every(am => item.amenities.includes(am));
        if (!hasAll) return false;
      }

      // Builder / Project Filters
      if (filterBuilderName !== 'All' && item.builder !== filterBuilderName) return false;
      if (filterVerifiedOnly && !item.verifiedListing) return false;
      if (item.builderRating < filterMinBuilderRating) return false;
      if (item.builderExperience < filterMinBuilderExperience) return false;

      // Property Age
      if (filterPropertyAge !== 'All' && item.propertyAge !== filterPropertyAge) return false;

      // Ownership & Legal Filters
      if (filterOwnership !== 'All' && item.ownershipType !== filterOwnership) return false;
      if (filterReraApproved && !item.reraApproved) return false;
      if (filterBankApproved && !item.bankApproved) return false;
      if (filterClearTitle && !item.clearTitle) return false;

      // Facing & Direction
      if (filterFacing !== 'All' && !item.facing.startsWith(filterFacing)) return false;
      if (filterCornerProperty && !item.cornerProperty) return false;
      if (filterVaastuCompliant && !item.vaastuCompliant) return false;

      // Floor Filters
      if (filterFloor !== 'All' && item.floorType !== filterFloor) return false;
      if (item.totalFloors < filterMinTotalFloors) return false;

      // Parking Filters
      if (filterParkingType !== 'All' && !item.parkingType.includes(filterParkingType)) return false;

      // Nearby Essentials
      if (filterNearbyEssentials.length > 0) {
        const hasAllEssentials = filterNearbyEssentials.every(es => {
          if (es === 'Near schools') return item.schoolNearby;
          if (es === 'Near hospitals') return item.hospitalNearby;
          if (es === 'Near metro') return item.nearMetro;
          return item.nearEssentials.includes(es);
        });
        if (!hasAllEssentials) return false;
      }

      // Investment Filters
      if (filterInvestment !== 'All' && item.investmentTag !== filterInvestment) return false;

      // Smart AI Search Filters
      if (filterSmartAi !== 'All' && item.aiTag !== filterSmartAi) return false;

      // Seller Type
      if (filterSellerType !== 'All' && item.sellerType !== filterSellerType) return false;

      // Posted Time
      if (filterPostedTime !== 'All' && item.postedTime !== filterPostedTime) return false;

      // Availability Filters
      if (filterAvailability !== 'All' && item.availability !== filterAvailability) return false;

      return true;
    });
  }, [
    searchQuery, filterCity, filterLocality, filterLandmark, filterPincode, filterNearMetroHighway, filterSchoolNearby, filterHospitalNearby, filterRadius, filterCommuteTime,
    filterMinPrice, filterMaxPrice, filterQuickBudget, filterPricePerSqFt,
    filterPropertyType, selectedTypeCategory, filterBhk,
    filterMinArea, filterMaxArea, filterAreaUnit, filterAreaType,
    filterPropertyStatus, filterPossessionYear,
    filterFurnishing, filterAmenities,
    filterBuilderName, filterVerifiedOnly, filterMinBuilderRating, filterMinBuilderExperience,
    filterPropertyAge,
    filterOwnership, filterReraApproved, filterBankApproved, filterClearTitle,
    filterFacing, filterCornerProperty, filterVaastuCompliant,
    filterFloor, filterMinTotalFloors,
    filterParkingType, filterNearbyEssentials,
    filterInvestment, filterSmartAi,
    filterSellerType, filterPostedTime, filterAvailability
  ]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'Buy') {
      if (onTabChange) {
        onTabChange(tab);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 select-none space-y-12 animate-fadeIn bg-[#F9FBFC]">
      
      {/* Back Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#b38330] transition-all uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#b38330]" /> Back to home
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" /> {selectedCity === 'All' ? 'PAN-INDIA' : selectedCity.toUpperCase()} PURCHASING REGISTRY
        </div>
      </div>

      {/* Styled Top Tab Selector Widget & Search Bar exactly honoring the design */}
      <div className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-100">
        {/* Yellowish-gold Tab Header Container */}
        <div className="bg-[#b38330] rounded-t-2xl flex flex-wrap pt-2 px-3">
          {tabs.map((tab) => {
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

        {/* Deep Dark Navy input block */}
        <div className="bg-[#0E1F35] p-6 space-y-4">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <div className="relative w-full flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium residential blocks, RERA numbers, or builder societies..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border-none transition-all shadow-inner"
              />
            </div>
            <button 
              type="button"
              onClick={() => {
                dispatchXPAward('view_property');
                alert(`Active filter view applied. Showing ${filteredAndSearchedResults.length} Nagpur properties. +5 XP awarded!`);
              }}
              className="w-full sm:w-auto bg-[#c0c4cc] hover:bg-white text-slate-950 font-bold uppercase text-xs sm:text-sm px-10 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm border border-slate-300"
            >
              Search
            </button>
          </form>

          {/* Quick Filters Pill Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-white select-none">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter By:
            </span>

            {/* City dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">City</span>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setLocalityFilter('All');
                }}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Cities</option>
                <option value="Nagpur" className="text-slate-900 bg-white font-semibold">Nagpur</option>
                <option value="Mumbai" className="text-slate-900 bg-white font-semibold flex items-center">Mumbai</option>
                <option value="Bengaluru" className="text-slate-900 bg-white font-semibold flex items-center">Bengaluru</option>
                <option value="Pune" className="text-slate-900 bg-white font-semibold flex items-center">Pune</option>
                <option value="Delhi NCR" className="text-slate-900 bg-white font-semibold flex items-center">Delhi NCR</option>
              </select>
            </div>

            {/* Locality dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Sub-Locality</span>
              <select
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                style={{ backgroundColor: '#132640' }}
              >
                {uniqueLocalities.map((loc) => (
                  <option key={loc} value={loc} className="text-slate-900 bg-white">
                    {loc === 'All' 
                      ? (selectedCity === 'All' ? 'All Localities' : `All ${selectedCity} Localities`) 
                      : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Possession dropdown selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">Possession Timeline</span>
              <select
                value={possessionFilter}
                onChange={(e) => setPossessionFilter(e.target.value)}
                className="bg-slate-850 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                style={{ backgroundColor: '#132640' }}
              >
                <option value="All" className="text-slate-900 bg-white">All Timelines</option>
                <option value="Ready to Move" className="text-slate-900 bg-white">Ready to Move</option>
                <option value="Under Construction" className="text-slate-900 bg-white">Under Construction</option>
              </select>
            </div>

            {/* Advanced Filters Button and Clear filters shortcut */}
            <div className="flex items-center gap-3 ml-auto">
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

              {(countActiveFilters > 0 || localityFilter !== 'All' || possessionFilter !== 'All' || selectedCity !== 'All' || searchQuery !== '' || selectedTypeCategory !== 'All') && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-amber-400 hover:text-white text-[11px] font-black underline uppercase cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nagpur Real Estate Stats Dashboard Block inside BuyView to look extremely professional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left select-none">
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-100 text-[#b38330]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Avg. Capital Cost</p>
            <p className="text-base font-black text-slate-800">₹ 3,460 / sqft</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-100 text-[#b38330]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Market Rating</p>
            <p className="text-base font-black text-slate-800">4.9 / 5 Outstanding</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Audited Inventory</p>
            <p className="text-base font-black text-slate-800">100% RERA Vetted</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Active Land Banks</p>
            <p className="text-base font-black text-slate-800">42 verified zones</p>
          </div>
        </div>
      </div>

      {/* Styled Centered Geolocation check-via-map button as requested */}
      <div className="w-full flex justify-center py-4 animate-fadeIn">
        <button
          type="button"
          onClick={() => setShowBuyMapModal(true)}
          className="bg-[#0E1F35] hover:bg-[#b38330] hover:shadow-[#b38330]/20 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-3 border-2 border-[#b38330]/80 group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          <Map className="w-5 h-5 text-amber-500 animate-pulse stroke-[2.5]" />
          <span>Check via Map</span>
        </button>
      </div>

      {showBuyMapModal && (
        <div 
          className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex animate-fadeIn cursor-pointer ${
            isMapFullscreen ? 'items-stretch justify-stretch p-0' : 'items-center justify-center p-4'
          }`}
          onClick={() => {
            setShowBuyMapModal(false);
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
                    Interactive Buying Map & Geolocation Vetting
                  </h3>
                  <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Tap local coordinates to scan residential purchases in Indian Metros</p>
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
                    setShowBuyMapModal(false);
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
                        const cityListings = getMapBuyResultsWithCoordinates(city);
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
                            const cityListings = getMapBuyResultsWithCoordinates(city);
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
                          <rect width="100%" height="100%" fill="url(#grid-buy)" strokeWidth="0" />
                          <defs>
                            <pattern id="grid-buy" width="40" height="40" patternUnits="userSpaceOnUse">
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
                      {getMapBuyResultsWithCoordinates(activeMapCity).slice(0, 6).map((item, index) => {
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
                        defaultCenter={CITY_COORDINATES[activeMapCity] || { lat: 21.1458, lng: 79.0882 }}
                        defaultZoom={12}
                        mapId="DEMO_MAP_ID"
                        className="w-full h-full"
                      >
                        {getMapBuyResultsWithCoordinates(activeMapCity).slice(0, 6).map((item) => {
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
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Vetted Buy Listing
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
                        src={selectedMapListing.image} 
                        alt={selectedMapListing.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#0E1F35] text-white px-3 py-1 rounded-xl text-xs font-black shadow-md border border-white/10 select-none">
                        {selectedMapListing.price}
                      </div>
                    </div>

                    {/* Metadata grids */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
                        <span className="block text-[9px] text-[#b38330] font-mono uppercase font-black">Configuration</span>
                        <strong className="text-slate-800 font-extrabold text-[11px] uppercase">{selectedMapListing.bhk} Suite</strong>
                      </div>
                      <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
                        <span className="block text-[9px] text-emerald-600 font-mono uppercase font-black">Timeline</span>
                        <strong className="text-slate-800 font-extrabold text-[11px] uppercase">{selectedMapListing.possession}</strong>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Local Neighborhood & Vetting Features</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Safe water line checked', 'Clear title deed', 'Secure environment', 'Access to transit'].map((feat, i) => (
                          <span key={i} className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIntel(selectedMapListing);
                        setShowBuyMapModal(false);
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
                    <p className="text-xs font-bold uppercase tracking-wider">No Properties Loaded in This City</p>
                    <p className="text-[10px] mt-1 max-w-[170px] font-medium leading-relaxed">Choose another metropolis to explore premium housing coordinates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apartments, Villas and more categories filter section from user's provided image */}
      <div id="apartments-villas-categories-section" className="space-y-6 text-left max-w-5xl mx-auto select-none mt-6">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#0D1F34] uppercase tracking-tight">
              Apartments, Villas and more
            </h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              id="category-prev-btn"
              onClick={() => setCategoryPage(0)}
              className={`w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-slate-700 ${
                categoryPage === 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:border-slate-350 hover:shadow-sm'
              }`}
              disabled={categoryPage === 0}
            >
              <ChevronLeft className="w-5 h-5 text-slate-800" />
            </button>
            <button
              id="category-next-btn"
              onClick={() => setCategoryPage(1)}
              className={`w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-slate-700 ${
                categoryPage === 1 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:border-slate-350 hover:shadow-sm'
              }`}
              disabled={categoryPage === 1}
            >
              <ChevronRight className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Page 1 Categories */}
          {categoryPage === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              {/* Card 1: Residential Land */}
              <div 
                id="category-card-residential-land"
                onClick={() => {
                  alert("Plot land banks filter requested! Transitioning view to Plots registry...");
                  if (onTabChange) {
                    onTabChange('Plots');
                  } else {
                    handleTabClick('Plots');
                  }
                }}
                className="group relative h-[360px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF9EE] via-[#FFF9EE] to-transparent border border-[#FFE7C4] shadow-xs hover:shadow-md hover:border-[#b38330]/40 transition-all cursor-pointer flex flex-col justify-between p-6"
              >
                <div className="space-y-1 z-10">
                  <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-[#b38330] transition-colors">
                    Residential Land
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    3,200+ Properties
                  </p>
                </div>
                
                {/* Cropped Land Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={plotAerialGrid} 
                    alt="Residential Land" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-orange-100/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Card 2: Residential Apartment */}
              <div 
                id="category-card-residential-apartment"
                onClick={() => {
                  setSelectedTypeCategory(selectedTypeCategory === 'Apartment' ? 'All' : 'Apartment');
                }}
                className={`group relative h-[360px] rounded-3xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between p-6 border ${
                  selectedTypeCategory === 'Apartment' 
                    ? 'bg-[#EBF5FF] border-[#3b82f6] shadow-sm ring-2 ring-blue-500/20' 
                    : 'bg-gradient-to-b from-[#EBF5FF] via-[#EBF5FF] to-transparent border-[#C7E3FF] shadow-xs hover:shadow-md hover:border-blue-400/30'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-blue-700 transition-colors">
                      Residential Apartment
                    </h3>
                    {selectedTypeCategory === 'Apartment' && (
                      <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Filter
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    3,200+ Properties
                  </p>
                </div>
                
                {/* Cropped Apartment Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={shortApartment} 
                    alt="Residential Apartment" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-blue-100/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Card 3: Independent House/ Villa */}
              <div 
                id="category-card-residential-villa"
                onClick={() => {
                  setSelectedTypeCategory(selectedTypeCategory === 'Villa' ? 'All' : 'Villa');
                }}
                className={`group relative h-[360px] rounded-3xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between p-6 border ${
                  selectedTypeCategory === 'Villa' 
                    ? 'bg-[#E6F9F0] border-[#10b981] shadow-sm ring-2 ring-emerald-500/20' 
                    : 'bg-gradient-to-b from-[#E6F9F0] via-[#E6F9F0] to-transparent border-[#C1FFD7] shadow-xs hover:shadow-md hover:border-emerald-400/30'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-emerald-700 transition-colors">
                      Independent House/ Villa
                    </h3>
                    {selectedTypeCategory === 'Villa' && (
                      <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Filter
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    870+ Properties
                  </p>
                </div>
                
                {/* Cropped Villa Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={orangeVilla} 
                    alt="Independent House/ Villa" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-bottom group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-emerald-100/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* Page 2 Categories */}
          {categoryPage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn relative">
              {/* Abs Left Circle Arrow for sliding back */}
              <button
                onClick={() => setCategoryPage(0)}
                className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-slate-700"
                title="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-slate-800" />
              </button>

              {/* Card 4: Builder Floor */}
              <div 
                id="category-card-builder-floor"
                onClick={() => {
                  setSelectedTypeCategory(selectedTypeCategory === 'Builder Floor' ? 'All' : 'Builder Floor');
                }}
                className={`group relative h-[360px] rounded-3xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between p-6 border ${
                  selectedTypeCategory === 'Builder Floor' 
                    ? 'bg-[#FFF9EE] border-amber-500 shadow-sm ring-2 ring-amber-500/20' 
                    : 'bg-gradient-to-b from-[#FFF9EE] via-[#FFF9EE] to-transparent border-[#FFE7C4] shadow-xs hover:shadow-md hover:border-[#b38330]/40'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-[#b38330] transition-colors">
                      Builder Floor
                    </h3>
                    {selectedTypeCategory === 'Builder Floor' && (
                      <span className="bg-amber-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Filter
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    160+ Properties
                  </p>
                </div>
                
                {/* Cropped Builder Floor Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={shortLivingroom} 
                    alt="Builder Floor" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-bottom group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-orange-100/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Card 5: Farm House */}
              <div 
                id="category-card-farm-house"
                onClick={() => {
                  setSelectedTypeCategory(selectedTypeCategory === 'Farm House' ? 'All' : 'Farm House');
                }}
                className={`group relative h-[360px] rounded-3xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between p-6 border ${
                  selectedTypeCategory === 'Farm House' 
                    ? 'bg-[#EBF5FF] border-[#3b82f6] shadow-sm ring-2 ring-blue-500/20' 
                    : 'bg-gradient-to-b from-[#EBF5FF] via-[#EBF5FF] to-transparent border-[#C7E3FF] shadow-xs hover:shadow-md hover:border-blue-400/30'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-blue-700 transition-colors">
                      Farm House
                    </h3>
                    {selectedTypeCategory === 'Farm House' && (
                      <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Filter
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    40+ Properties
                  </p>
                </div>
                
                {/* Cropped Farm House Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={aboutLuxuryVilla} 
                    alt="Farm House" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-blue-100/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Card 6: 1 RK/ Studio Apartment */}
              <div 
                id="category-card-studio-apartment"
                onClick={() => {
                  setSelectedTypeCategory(selectedTypeCategory === 'Studio' ? 'All' : 'Studio');
                }}
                className={`group relative h-[360px] rounded-3xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between p-6 border ${
                  selectedTypeCategory === 'Studio' 
                    ? 'bg-[#E6F9F0] border-[#10b981] shadow-sm ring-2 ring-emerald-500/20' 
                    : 'bg-gradient-to-b from-[#E6F9F0] via-[#E6F9F0] to-transparent border-[#C1FFD7] shadow-xs hover:shadow-md hover:border-emerald-400/30'
                }`}
              >
                <div className="space-y-1 z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-[#0D1F34] leading-tight group-hover:text-emerald-700 transition-colors">
                      1 RK/ Studio Apartment
                    </h3>
                    {selectedTypeCategory === 'Studio' && (
                      <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Filter
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    10+ Properties
                  </p>
                </div>
                
                {/* Cropped Studio Image at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden rounded-b-3xl">
                  <img 
                    src={panoBedroom} 
                    alt="1 RK/ Studio Apartment" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-emerald-100/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* Bullet indicators */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button 
              onClick={() => setCategoryPage(0)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                categoryPage === 0 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
            <button 
              onClick={() => setCategoryPage(1)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                categoryPage === 1 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Popular Properties Title with RED See more button as requested by the user */}
      <div className="space-y-6">
        <div className="flex justify-between items-baseline border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0D1F34] uppercase tracking-tight">
              Polular properties for purchase
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Top modern housing apartments indexed directly with legal water clearance certificate & floor plans.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCity('All');
              setLocalityFilter('All');
              setPossessionFilter('All');
              setSearchQuery('');
              setSelectedTypeCategory('All');
              alert("All filters reset. Displaying all premium vetted pan-India properties.");
            }}
            className="text-[#FF0101] hover:text-red-700 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            See more :-
          </button>
        </div>

        {/* 5 columns of high-fidelity property cards */}
        {filteredAndSearchedResults.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto shadow-xs">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-black text-slate-800">No properties fit current filter parameters</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try typing a different search key or reset the filters layout above to show all listings.</p>
            <button 
              onClick={() => {
                setLocalityFilter('All');
                setPossessionFilter('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-[#0E1F35] hover:bg-[#b38330] text-white text-xs font-black uppercase px-6 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {filteredAndSearchedResults.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedIntel(item)}
                className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-all group relative cursor-pointer"
              >
                {/* Top Image Box */}
                <div className="h-[145px] bg-[#E1E4E8] border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Verified stamp decoration */}
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                  </span>
                  {/* Status / BHK limit tag */}
                  <span className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    {item.bhk}
                  </span>
                </div>

                {/* Body Text Area */}
                <div className="p-4 flex-grow flex flex-col justify-between text-left relative">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-[120px]">
                        {item.locality.split(',')[0]}
                      </h4>
                      <span className="text-[9px] bg-slate-100 text-[#b38330] font-extrabold px-1.5 py-0.5 rounded uppercase font-sans">
                        {item.possession === 'Ready to Move' ? 'Ready' : 'Under C.'}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">
                      {item.price}
                    </p>
                    <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {item.city}
                    </p>
                  </div>

                  {/* Pill Shaped "More Intel" Button at Bottom Right */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIntel(item);
                      }}
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
      </div>

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
              image: shortLivingroom,
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
              className="group relative h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-slate-150 cursor-pointer focus:outline-none transition-all duration-300 hover:-translate-y-1 bg-slate-50 flex flex-col text-left w-full"
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
              <div className="absolute top-4 left-4 right-4 flex items-center gap-2.5 z-10 font-sans">
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
              <div className="absolute bottom-4 left-4 right-4 z-10 text-left font-sans">
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
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
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
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50">
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
          }
        };

        const handlePrevShort = () => {
          if (activeShortIndex > 0) {
            setActiveShortIndex(activeShortIndex - 1);
          }
        };

        const toggleLike = () => {
          const liked = !hasLikedShort[activeShortIndex];
          setHasLikedShort(prev => ({ ...prev, [activeShortIndex]: liked }));
          setShortLikes(prev => ({
            ...prev,
            [activeShortIndex]: prev[activeShortIndex] + (liked ? 1 : -1)
          }));
        };

        const postComment = () => {
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xs select-none">
            {/* Close trigger zone overlay */}
            <div 
              className="absolute inset-0 bg-transparent" 
              onClick={() => setActiveShortIndex(null)}
            />

            <div className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:max-w-md sm:rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border-0 sm:border border-white/5 flex flex-col justify-between p-4 z-10 animate-scaleUp">
              {/* Actual Video tag */}
              <video
                key={activeShort.videoUrl}
                autoPlay
                loop
                playsInline
                muted={shortMuted}
                src={activeShort.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
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

              {/* Upper Section Header Controls */}
              <div className="z-10 flex justify-between items-center w-full">
                <span className="bg-[#b38330] text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-full tracking-widest shadow-md flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white" /> Property Shorts Reels
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

              {/* Right Side Social interactive buttons */}
              <div className="absolute right-4 top-1/3 z-20 flex flex-col items-center gap-5">
                {/* Like hook */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-full bg-black/50 backdrop-blur-xs border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 active:scale-95 text-white ${
                    hasLikedShort[activeShortIndex] ? '!bg-red-600 text-white border-red-500' : ''
                  }`}>
                    <Heart className={`w-5 h-5 ${hasLikedShort[activeShortIndex] ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-white text-[11px] font-black drop-shadow-md">
                    {shortLikes[activeShortIndex]}
                  </span>
                </button>

                {/* Comment switch Drawer */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommentsDrawer(!showCommentsDrawer);
                  }}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-xs border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 active:scale-95 text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-white text-[11px] font-black drop-shadow-md">
                    {shortCommentCount[activeShortIndex]}
                  </span>
                </button>

                {/* Direct Share triggers */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Short link copied to your clipboard! Share it with friends.");
                  }}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-xs border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 text-white">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-white text-[10px] font-black drop-shadow-md">Share</span>
                </button>

                {/* Lead Dispatch agent */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Interlinked short inquiry dispatched to regional agent representing ${activeShort.user}! We will text standard tour slots to your phone.`);
                  }}
                  className="group flex flex-col items-center gap-1 cursor-pointer mt-2"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg text-slate-950">
                    <PhoneCall className="w-5 h-5 font-black shrink-0" />
                  </div>
                  <span className="text-emerald-400 text-[10px] font-extrabold drop-shadow-md">Inquire</span>
                </button>
              </div>

              {/* Bottom Metadata details overlay */}
              <div className="z-10 w-full bg-gradient-to-t from-black/85 to-transparent -mx-4 p-4 pt-10 mt-auto text-left flex flex-col gap-2 pointer-events-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-white/30 overflow-hidden bg-slate-900 flex items-center justify-center">
                    {activeShort.avatarImg ? (
                      <img src={activeShort.avatarImg} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[10px] font-extrabold">{activeShort.avatarText}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-xs flex items-center gap-1">
                      {activeShort.user}
                      {activeShort.verified && (
                        <Check className="w-3.5 h-3.5 text-blue-400 stroke-[3] bg-white rounded-full p-0.5" />
                      )}
                    </h4>
                    <p className="text-[9px] text-slate-350 font-semibold mt-0.5">{activeShort.role}</p>
                  </div>
                </div>

                <p className="text-white font-bold text-xs sm:text-sm leading-snug tracking-tight drop-shadow-md max-w-[85%] mt-1">
                  {activeShort.videoTitle}
                </p>
                <p className="text-[#b38330] font-black text-[10px] sm:text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {activeShort.location}
                </p>
              </div>

              {/* Interactive Slide-out side Comments Box Drawer inside video screen */}
              {showCommentsDrawer && (
                <div className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-slate-900/95 backdrop-blur-md z-30 flex flex-col justify-between border-0 sm:border-l border-white/10 animate-slideLeft text-left text-white p-4">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2.5 mb-3">
                      <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-widest flex items-center gap-1">
                        Comments ({shortCommentCount[activeShortIndex]})
                      </h4>
                      <button 
                        onClick={() => setShowCommentsDrawer(false)}
                        className="text-white/60 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
                      {shortComments[activeShortIndex].length === 0 ? (
                        <p className="text-zinc-500 text-xs py-4 text-center">No comments yet. Start the conversation!</p>
                      ) : (
                        shortComments[activeShortIndex].map((comment, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#0E1F35] border border-white/20 flex items-center justify-center text-[9px] font-black shrink-0 text-white">
                              U{(idx + (activeShortIndex * 2)) % 5 + 1}
                            </div>
                            <div className="bg-white/5 rounded-xl p-2.5 text-xs text-slate-205 flex-grow border border-white/5">
                              <p className="font-extrabold text-slate-400 text-[10px]">User {(idx + 13028) % 1000}</p>
                              <p className="mt-0.5 leading-relaxed font-sans">{comment}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Comment box inputs */}
                  <div className="border-t border-white/10 pt-3 flex gap-2">
                    <input 
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ask query / add comment..."
                      className="w-full bg-white/10 border border-white/15 focus:border-[#b38330]/80 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-400 focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && postComment()}
                    />
                    <button 
                      onClick={postComment}
                      className="bg-[#b38330] hover:bg-amber-600 text-slate-950 px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors shrink-0"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Floating carousel controls specifically designed */}
              <div className="absolute top-1/2 left-2 z-20 -translate-y-1/2">
                {activeShortIndex > 0 && (
                  <button 
                    onClick={handlePrevShort}
                    className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
                  >
                    ‹
                  </button>
                )}
              </div>
              <div className="absolute top-1/2 right-2 z-20 -translate-y-1/2">
                {activeShortIndex < SHORTS_DATA.length - 1 && (
                  <button 
                    onClick={handleNextShort}
                    className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
                  >
                    ›
                  </button>
                )}
              </div>

              {/* Close Button top-right */}
              <button 
                onClick={() => setActiveShortIndex(null)}
                className="absolute top-4 right-16 bg-black/60 hover:bg-black/80 border border-white/10 text-white hover:text-red-400 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-sm font-bold shadow-md z-20"
              >
                &times;
              </button>
            </div>
          </div>
        );
      })()}

      {/* Buyer Legal Help Desk Accordion Panel - Newly Added appealing interactive content for user */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs text-left">
        <div className="bg-[#0E1F35] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded">RERA Advisory Check</span>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">{selectedCity === 'All' ? 'Pan-India' : selectedCity} Home-Buyer Standard Statutory Safety Checklist</h3>
          </div>
          <button 
            onClick={() => alert(`Connecting with ${selectedCity === 'All' ? 'Local' : selectedCity} Property Legal Officer... Please secure property ID first.`)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black uppercase px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Ask Attorney Council
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="space-y-2 pt-4 md:pt-0">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <span className="text-[#b38330]">01.</span>
              <span>Verify Mutation Registry</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              Confirm that the seller holds a clear title in the municipal corporation ({selectedCity === 'All' ? 'MCGM/PMC/NMC/BBMP' : selectedCity === 'Delhi NCR' ? 'NDMC/DDA' : selectedCity}) or local Land layout records before closing token amount.
            </p>
          </div>
          <div className="space-y-2 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <span className="text-[#b38330]">02.</span>
              <span>RERA Compliant Booking</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              Ensure the builder possesses a registered RERA number. All 5 of our curated flats are pre-vetted with certified registration details.
            </p>
          </div>
          <div className="space-y-2 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <span className="text-[#b38330]">03.</span>
              <span>No-Dues certification (NOC)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              Check matching OC (Occupancy Certificate) and CC (Commencement Certificate) documents. Request these easily through the "More Intel" spec drawer.
            </p>
          </div>
        </div>
      </div>

      {/* Experience block containing diagram's right-trending arrow inside text block */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0E1F35] to-[#142944] rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#b38330]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="space-y-3 z-10 text-left">
          <span className="bg-[#b38330]/80 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded">
            Proven Tenure Track
          </span>
          <h2 className="text-xl sm:text-3.5xl font-black tracking-tight leading-none text-white">
            Last 13+ Years Of Real-estate Experience
          </h2>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
            Established on the foundations of trust and statutory compliance. From land litigation screening to RERA approval coordination, we make premium home ownership stress-free. Partner with Central India's top residential developers.
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

      {/* Intel Spec sheet modal/drawer when user requests specified card detail */}
      {selectedIntel && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn cursor-pointer"
          onClick={() => setSelectedIntel(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-150 animate-scaleUp text-left flex flex-col cursor-default font-sans text-slate-900"
          >
            {/* Header */}
            <div className="bg-[#0E1F35] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider block">
                  Property Intel & statutory inspection Specification Sheet
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIntel(null)}
                className="bg-white/10 hover:bg-white/25 text-white/95 hover:text-white p-2 rounded-full cursor-pointer transition-all flex items-center justify-center border border-white/5 active:scale-90"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Spec Panel details - 2 Column Layout to display everything at once */}
            <div className="p-6 md:p-8 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 flex-grow">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-baseline">
                  <div>
                    <h4 className="text-lg font-black text-[#0E1F35] leading-tight-none">{selectedIntel.title}</h4>
                    <p className="text-xs text-slate-500 font-bold">{selectedIntel.locality}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-805 text-xs font-black px-3 py-1 rounded shrink-0">
                    {selectedIntel.price}
                  </span>
                </div>

                {/* Cover Photo in overlay */}
                <div className="h-[140px] md:h-[150px] rounded-xl overflow-hidden shadow-inner border border-slate-100">
                  <img 
                    src={selectedIntel.image} 
                    alt={selectedIntel.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Grid lists */}
                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Config</span>
                    <span className="text-xs font-extrabold text-slate-800">{selectedIntel.bhk} Luxury Suite</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Super Area</span>
                    <span className="text-xs font-extrabold text-slate-850">{selectedIntel.area}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Engineering Builder</span>
                    <span className="text-xs font-extrabold text-[#b38330]">{selectedIntel.builder}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Orientation / Facing</span>
                    <span className="text-xs font-extrabold text-slate-800">{selectedIntel.facing}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Amenities Highlight:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIntel.amenities.map((am: string, i: number) => (
                      <span key={i} className="bg-slate-100 border border-slate-205 text-slate-850 text-[10px] font-bold px-2.5 py-1 rounded">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {/* Virtual 360 tour embed inside detail modal */}
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Interactive Virtual 360° Inspection Room:</span>
                  <div className="h-[210px] rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
                    <PannellumViewer propertyName={selectedIntel.title} propertyId={selectedIntel.id} />
                  </div>
                </div>

                {/* Clearance checklist */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3.5">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Statutory Vetting Clearance</h5>
                      <p className="text-xs font-bold text-emerald-950 mt-1">{selectedIntel.clearance}</p>
                    </div>
                  </div>
                </div>

                {/* Call-to-action */}
                <div className="pt-3 border-t border-gray-100 flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      dispatchXPAward('book_site_visit');
                      alert(`Requested private Advisory Session & quotation for ${selectedIntel.title} at ${selectedIntel.locality}. We will contact you at your registered email soon.`);
                    }}
                    className="w-full bg-[#0E1F35] hover:bg-orange-600 text-white font-extrabold py-3.5 text-xs sm:text-sm uppercase tracking-widest rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" /> Book Site & Legal Consultation
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Overlay Modal (20 Premium Categories) */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl h-[88vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-scaleIn">
            
            {/* Modal Header Bar */}
            <div className="bg-[#0E1F35] text-white px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#b38330]">
                  <SlidersHorizontal className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">Advanced Vetting Systems</h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-bold">Professional Real-Estate Screening Matrix Categories</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#b38330] text-slate-950 text-xs font-black px-4 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse fill-slate-950" />
                  FOUND {filteredAndSearchedResults.length} MATCHES
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  Clear All ({countActiveFilters})
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Modal Body with Multi-tab navigation Split Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left hand Sidebar Category list */}
              <div className="w-1/3 border-r border-slate-100 overflow-y-auto bg-slate-50 select-none shrink-0 custom-scrollbar">
                <div className="p-3 space-y-1.5">
                  {[
                    { id: 0, name: 'Location Filters', desc: 'Select City, sub-locality, nearby transport networks' },
                    { id: 1, name: 'Budget & Finance', desc: 'Min-max limits, rate/sqft range, mortgage builder' },
                    { id: 2, name: 'Property Type', desc: 'Apartment tower, Villa, plots, commercial zones' },
                    { id: 3, name: 'BHK Configurations', desc: 'Studio, RK, 1-4 BHK configurations, luxury Duplex' },
                    { id: 4, name: 'Area & Size Metrics', desc: 'Unit scaling (Sq.ft, Sq.m, Acres, Guntha) & carpet area' },
                    { id: 5, name: 'Property Status', desc: 'Ready possession vs current structural phases' },
                    { id: 6, name: 'Furnishing Status', desc: 'Fully furnished, semi, or unfurnished selection' },
                    { id: 7, name: 'Essential Amenities', desc: 'Elevators, smart clubhouse, power backup grid, EV ports' },
                    { id: 8, name: 'Builders & Projects', desc: 'Builder feedback registry, rating score, years experience' },
                    { id: 9, name: 'Age of Property', desc: 'New launch asset age tenure, vintage luxury' },
                    { id: 10, name: 'Legal & Ownership', desc: 'Freehold holdings, RERA approvals, clear bank loans' },
                    { id: 11, name: 'Facing & Vastu', desc: 'Eight cardinal directions, Vaastu compliant layouts' },
                    { id: 12, name: 'Floor Selection', desc: 'Ground, middle levels, or skyscraper skyline penthouse' },
                    { id: 13, name: 'Vehicle Parking', desc: 'Allocated bike, car, open, or covered spaces' },
                    { id: 14, name: 'Nearby Essentials', desc: 'Commute distance to schools, hospitals & markets' },
                    { id: 15, name: 'Investment Returns', desc: 'ROI yields, low maint, high rental appreciation areas' },
                    { id: 16, name: 'Smart AI Personas', desc: 'Bachelor, retirement, or nuclear family alignment' },
                    { id: 17, name: 'Seller Category', desc: 'Direct owner contact list, licensed broker agents' },
                    { id: 18, name: 'Posted Timeline', desc: 'Recent listings posted today, last week, last month' },
                    { id: 19, name: 'Immediate Possession', desc: 'Keys ready, occupancy certs, ready to occupy' },
                  ].map((cat) => {
                    const isSelected = activeFilterCategoryTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveFilterCategoryTab(cat.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                          isSelected 
                            ? 'bg-[#0E1F35] text-white border-transparent ring-2 ring-amber-500/50' 
                            : 'bg-white text-slate-800 hover:bg-slate-100 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-black tracking-wide uppercase flex items-center justify-between w-full">
                          <span>{cat.name}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#b38330]" />}
                        </span>
                        <span className={`text-[10px] font-bold line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {cat.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right hand Details Panel with custom controls per tab */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8 select-none custom-scrollbar">
                
                {/* Tab 0: Location Filters */}
                {activeFilterCategoryTab === 0 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#b38330]" /> Category 1: Location & Regional Geography
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Specify regional parameters, road access & nearby facilities.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Select City option */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Select Target City</label>
                        <select
                          value={filterCity}
                          onChange={(e) => {
                            setFilterCity(e.target.value);
                            setSelectedCity(e.target.value);
                            setFilterLocality('All');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Indian Cities</option>
                          <option value="Nagpur">Nagpur</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Pune">Pune</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                        </select>
                      </div>

                      {/* Select Landmark option */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Select Landmark Proximity</label>
                        <select
                          value={filterLandmark}
                          onChange={(e) => setFilterLandmark(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Landmarks</option>
                          <option value="Besa Petrol Pump">Besa Petrol Pump (Nagpur)</option>
                          <option value="Manish Nagar Crossing">Manish Nagar Crossing (Nagpur)</option>
                          <option value="Dharampeth Metro">Dharampeth Metro station (Nagpur)</option>
                          <option value="Carter Road Promenade">Carter Road Promenade (Mumbai)</option>
                          <option value="Worli Sea Link Toll">Worli Sea Link Toll (Mumbai)</option>
                          <option value="Whitefield IT Park">Whitefield IT Park (Bengaluru)</option>
                          <option value="Koramangala 3rd Block">Koramangala 3rd Block (Bengaluru)</option>
                          <option value="Koregaon Park lane 5">Koregaon Park lane 5 (Pune)</option>
                          <option value="Golf Course Ext Road">Golf Course Ext Road (Delhi NCR)</option>
                        </select>
                      </div>

                      {/* Sub-locality */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Sub-locality / Zone</label>
                        <select
                          value={filterLocality}
                          onChange={(e) => {
                            setFilterLocality(e.target.value);
                            setLocalityFilter(e.target.value);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          {uniqueLocalities.map(loc => (
                            <option key={loc} value={loc}>{loc === 'All' ? 'All Localities' : loc}</option>
                          ))}
                        </select>
                      </div>

                      {/* Targeted Pincode code */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Target Pincode Code</label>
                        <input
                          type="text"
                          value={filterPincode}
                          onChange={(e) => setFilterPincode(e.target.value)}
                          placeholder="e.g. 440015"
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Commute slider */}
                      <div className="space-y-2 sm:col-span-2 bg-slate-100 p-4 rounded-2xl">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-extrabold text-slate-800">Commute Settle Time Limit</label>
                          <span className="text-xs font-extrabold text-[#b38330]">{filterCommuteTime} Minutes</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="60"
                          step="5"
                          value={filterCommuteTime}
                          onChange={(e) => setFilterCommuteTime(parseInt(e.target.value))}
                          className="w-full accent-[#b38330]"
                        />
                        <p className="text-[10px] text-slate-400 font-bold">Filters properties whose commute time to major highways / local business hubs falls under this limit.</p>
                      </div>

                      {/* Radius search */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Search Radius Range</label>
                        <div className="flex flex-wrap gap-2">
                          {['All', '2 km', '5 km', '10 km'].map((rad) => {
                            const isSelected = filterRadius === rad;
                            return (
                              <button
                                key={rad}
                                type="button"
                                onClick={() => setFilterRadius(rad === 'All' ? 'All' : parseFloat(rad).toString())}
                                className={`text-[10px] sm:text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#b38330] text-slate-950 border-transparent shadow-xs' 
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {rad === 'All' ? 'No Limit' : `Within ${rad}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Proximity toggles */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">Proximity Essentials matching</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={filterNearMetroHighway}
                            onChange={(e) => setFilterNearMetroHighway(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 accent-[#b38330]"
                          />
                          <span className="text-xs font-bold text-slate-800">Near Metro Line / Highway</span>
                        </label>
                        <label className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={filterSchoolNearby}
                            onChange={(e) => setFilterSchoolNearby(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 accent-[#b38330]"
                          />
                          <span className="text-xs font-bold text-slate-800">School Proximity (&lt; 1km)</span>
                        </label>
                        <label className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={filterHospitalNearby}
                            onChange={(e) => setFilterHospitalNearby(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 accent-[#b38330]"
                          />
                          <span className="text-xs font-bold text-slate-800">Hospital/Medical Center Nearby</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 1: Budget Filters */}
                {activeFilterCategoryTab === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#b38330]" /> Category 2: Budget Capacity & Financial Sizing
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Configure pricing thresholds, quick Ranges, dynamic rate sizing, and loan estimates.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Min Budget */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Minimum Budget (₹ Price)</label>
                        <select
                          value={filterMinPrice}
                          onChange={(e) => setFilterMinPrice(parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="0">No Minimum (₹0)</option>
                          <option value="1500000">₹15 Lakhs</option>
                          <option value="2500000">₹25 Lakhs</option>
                          <option value="5000000">₹50 Lakhs</option>
                          <option value="10000000">₹1 Crore</option>
                          <option value="20000000">₹2 Crores</option>
                          <option value="50000000">₹5 Crores</option>
                        </select>
                      </div>

                      {/* Max Budget */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Maximum Budget (₹ Price)</label>
                        <select
                          value={filterMaxPrice}
                          onChange={(e) => setFilterMaxPrice(parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="100000000">No Maximum (₹10+ Cr)</option>
                          <option value="2500000">₹25 Lakhs</option>
                          <option value="5000000">₹50 Lakhs</option>
                          <option value="10000000">₹1 Crore</option>
                          <option value="20000000">₹2 Crores</option>
                          <option value="50000000">₹5 Crores</option>
                        </select>
                      </div>

                      {/* Quick Ranges */}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-extrabold text-slate-600 block">Quick Ranges Presets</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'Under25', text: 'Under ₹25L', min: 0, max: 2500000 },
                            { value: '25to50', text: '₹25L – ₹50L', min: 2500000, max: 5000000 },
                            { value: '50to100', text: '₹50L – ₹1Cr', min: 5000000, max: 10000000 },
                            { value: 'Over100', text: '₹1Cr+', min: 10000000, max: 100000000 }
                          ].map((b) => {
                            const isSelected = filterQuickBudget === b.value;
                            return (
                              <button
                                key={b.value}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setFilterQuickBudget('All');
                                    setFilterMinPrice(0);
                                    setFilterMaxPrice(100000000);
                                  } else {
                                    setFilterQuickBudget(b.value);
                                    setFilterMinPrice(b.min);
                                    setFilterMaxPrice(b.max);
                                  }
                                }}
                                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#b38330] text-slate-950 border-transparent shadow-md' 
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {b.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Price per sq.ft */}
                      <div className="space-y-2 sm:col-span-2 bg-slate-100 p-4 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-extrabold text-slate-700">
                          <span>Max Price Rate / Sq.ft</span>
                          <span className="text-[#b38330]">₹{filterPricePerSqFt.toLocaleString('en-IN')} / sqft</span>
                        </div>
                        <input
                          type="range"
                          min="2000"
                          max="25000"
                          step="500"
                          value={filterPricePerSqFt}
                          onChange={(e) => setFilterPricePerSqFt(parseInt(e.target.value))}
                          className="w-full accent-[#b38330]"
                        />
                      </div>
                    </div>

                    {/* EMI Mortgage Calculator Integration */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
                        <Percent className="w-5 h-5 text-[#b38330]" />
                        <h5 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Interactive Integrated EMI Mortgage Sandbox</h5>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-extrabold text-slate-500">
                            <span>Loan Principal</span>
                            <span className="text-slate-900">₹{(emiPrincipal/100000).toFixed(1)} Lakhs</span>
                          </div>
                          <input
                            type="range"
                            min="1000000"
                            max="30000000"
                            step="500000"
                            value={emiPrincipal}
                            onChange={(e) => setEmiPrincipal(parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-extrabold text-slate-500">
                            <span>Interest Rate (%)</span>
                            <span className="text-slate-900">{emiInterest}%</span>
                          </div>
                          <input
                            type="range"
                            min="6.5"
                            max="15"
                            step="0.1"
                            value={emiInterest}
                            onChange={(e) => setEmiInterest(parseFloat(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-extrabold text-slate-500">
                            <span>Loan Tenure</span>
                            <span className="text-slate-900">{emiTenure} Years</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="1"
                            value={emiTenure}
                            onChange={(e) => setEmiTenure(parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Display Computed Mortgage Estimate */}
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div>
                          <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest block">Estimated Home Loan Mortgage EMI</span>
                          <span className="text-sm sm:text-base font-black text-emerald-950">
                            ₹{Math.round(
                              (emiPrincipal * (emiInterest / 12 / 100) * Math.pow(1 + (emiInterest / 12 / 100), emiTenure * 12)) /
                              (Math.pow(1 + (emiInterest / 12 / 100), emiTenure * 12) - 1)
                            ).toLocaleString('en-IN')} <span className="text-[11px] text-emerald-800 font-bold">/ Month</span>
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-emerald-700 max-w-xs leading-tight">
                          Indicative interest rates calculated dynamically. Connect with HDFC / SBI representatives via our lobby desks.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Property Type */}
                {activeFilterCategoryTab === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#b38330]" /> Category 3: Property Type Category Classification
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Isolate specific residential towers, villas, plots, farmhouse configurations or commercial options.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'All', label: 'All Property Types' },
                        { id: 'Apartment', label: 'Apartment / Flat' },
                        { id: 'Independent House', label: 'Independent House' },
                        { id: 'Villa', label: 'Villa / Bungalow' },
                        { id: 'Plot / Land', label: 'Plot / Land' },
                        { id: 'Builder Floor', label: 'Builder Floor' },
                        { id: 'Penthouse', label: 'Penthouse' },
                        { id: 'Farmhouse', label: 'Farmhouse' },
                        { id: 'Commercial', label: 'Commercial (General)' },
                        { id: 'Commercial Office', label: 'Commercial Office' },
                        { id: 'Commercial Shop', label: 'Commercial Shop' },
                        { id: 'Commercial Warehouse', label: 'Commercial Warehouse' }
                      ].map((t) => {
                        const isSelected = filterPropertyType === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setFilterPropertyType(t.id);
                              if (t.id === 'Apartment' || t.id === 'Villa' || t.id === 'Builder Floor' || t.id === 'Farmhouse' || t.id === 'Studio') {
                                setSelectedTypeCategory(t.id as any);
                              } else {
                                setSelectedTypeCategory('All');
                              }
                            }}
                            className={`p-4 rounded-xl text-xs font-black uppercase text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-amber-500 shadow-md' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: BHK Configurations */}
                {activeFilterCategoryTab === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-[#b38330]" /> Category 4: BHK configurations & Room Sizing
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Refine options of beds, studio spaces or luxury duplex layouts.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'All', label: 'All Configurations' },
                        { id: '1 RK', label: '1 RK Layout' },
                        { id: '1 BHK', label: '1 BHK standard' },
                        { id: '2 BHK', label: '2 BHK standard' },
                        { id: '3 BHK', label: '3 BHK standard' },
                        { id: '4+ BHK', label: '4+ BHK Large suites' },
                        { id: 'Studio apartment', label: 'Studio Apartment' },
                        { id: 'Duplex', label: 'Premium Duplex' }
                      ].map((b) => {
                        const isSelected = filterBhk === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setFilterBhk(b.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-[#b38330] shadow-sm' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 4: Area & Size Metrics */}
                {activeFilterCategoryTab === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#b38330]" /> Category 5: Area / Size Sizing Parameters
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Specify layout sizes, regional units (Maharashtra Guntha, acres) & area type styles.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Metric Unit type selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Unit of Measurement</label>
                        <select
                          value={filterAreaUnit}
                          onChange={(e) => {
                            setFilterAreaUnit(e.target.value);
                            setFilterMinArea(0);
                            setFilterMaxArea(e.target.value === 'Acres' ? 20 : e.target.value === 'Guntha' ? 100 : 10000);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Sq.ft">Square Feet (Sq.ft)</option>
                          <option value="Sq.m">Square Meters (Sq.m)</option>
                          <option value="Acres">Acres (Plots/Farms)</option>
                          <option value="Guntha">Guntha (Maharashtra)</option>
                        </select>
                      </div>

                      {/* Area Sizing classification */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Area Classification Type</label>
                        <select
                          value={filterAreaType}
                          onChange={(e) => setFilterAreaType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Classifications</option>
                          <option value="Carpet">Carpet Area only</option>
                          <option value="Built-up">Built-Up Area</option>
                          <option value="Super built-up">Super Built-Up Area</option>
                        </select>
                      </div>

                      {/* Min Area input code */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Minimum Area Sizing ({filterAreaUnit})</label>
                        <input
                          type="number"
                          value={filterMinArea}
                          onChange={(e) => setFilterMinArea(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Max Area input code */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Maximum Area Sizing ({filterAreaUnit})</label>
                        <input
                          type="number"
                          value={filterMaxArea}
                          onChange={(e) => setFilterMaxArea(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 5: Property Status */}
                {activeFilterCategoryTab === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#b38330]" /> Category 6: Property Status & Timeline Delivery
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Filter under construction projects, upcoming new launch registries or ready homes.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Property Satus Option */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Property Construction Phase</label>
                        <select
                          value={filterPropertyStatus}
                          onChange={(e) => {
                            setFilterPropertyStatus(e.target.value);
                            if (e.target.value === 'Ready to move') setPossessionFilter('Ready to Move');
                            else if (e.target.value === 'Under construction') setPossessionFilter('Under Construction');
                            else setPossessionFilter('All');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All statuses</option>
                          <option value="Ready to move">Ready to Move</option>
                          <option value="Under construction">Under Construction</option>
                          <option value="New launch">New Launch</option>
                          <option value="Resale">Resale</option>
                        </select>
                      </div>

                      {/* Select targeted Possession timeline */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Possession Deadlines</label>
                        <select
                          value={filterPossessionYear}
                          onChange={(e) => setFilterPossessionYear(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">No specific limit</option>
                          <option value="Immediate">Immediate possession</option>
                          <option value="2026">Deliver within 2026</option>
                          <option value="2027">Deliver within 2027</option>
                          <option value="2028">Deliver within 2028+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 6: Furnishing Status */}
                {activeFilterCategoryTab === 6 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#b38330]" /> Category 7: Woodwork & Furnishing Status
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Select degree of pre-installed interiors, wardrobes, and kitchen cabinetry.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['All', 'Fully furnished', 'Semi furnished', 'Unfurnished'].map((fur) => {
                        const isSelected = filterFurnishing === fur;
                        return (
                          <button
                            key={fur}
                            type="button"
                            onClick={() => setFilterFurnishing(fur)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-amber-500 shadow-md' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {fur === 'All' ? 'All furnishing states' : fur.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 7: Essential Amenities */}
                {activeFilterCategoryTab === 7 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#b38330]" /> Category 8: Essential & Luxury Amenities
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Select one or multiple desired complex facilities to enforce in properties.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        'Parking', 'Lift', 'Security', 'Power backup', 'Water supply', 'Gym', 'Swimming pool', 
                        'Clubhouse', 'Garden', 'Children\'s play area', 'CCTV', 'EV charging', 'Internet/WiFi',
                        'Smart home', 'Rooftop garden', 'Co-working space', 'Theater', 'Pet park'
                      ].map((am) => {
                        const isIncluded = filterAmenities.includes(am);
                        return (
                          <button
                            key={am}
                            type="button"
                            onClick={() => {
                              if (isIncluded) {
                                setFilterAmenities(prev => prev.filter(a => a !== am));
                              } else {
                                setFilterAmenities(prev => [...prev, am]);
                              }
                            }}
                            className={`p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between cursor-pointer transition-all ${
                              isIncluded 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-[#b38330] shadow-xs' 
                                : 'bg-white text-slate-700 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            <span>{am}</span>
                            {isIncluded && <Check className="w-4 h-4 text-[#b38330]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 8: Builder & Projects */}
                {activeFilterCategoryTab === 8 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#b38330]" /> Category 9: Builder Portfolio & Developer Experience
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Specify licensed developers, credential ratings, and years in local real estate.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Select Builder list element */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Select Developer Group</label>
                        <select
                          value={filterBuilderName}
                          onChange={(e) => setFilterBuilderName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Builders</option>
                          <option value="Shivangan Builders">Shivangan Builders</option>
                          <option value="Rachana Constructions">Rachana Constructions</option>
                          <option value="Sandesh Group">Sandesh Group</option>
                          <option value="Jayanti Mansions Group">Jayanti Mansions Group</option>
                          <option value="SDPL Land Developers">SDPL Land Developers</option>
                          <option value="Lodha Group">Lodha Group</option>
                          <option value="Omaxe Group">Omaxe Group</option>
                        </select>
                      </div>

                      {/* Verified Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Verification Status</label>
                        <label className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={filterVerifiedOnly}
                            onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                            className="w-4 h-4 text-amber-500 accent-[#b38330]"
                          />
                          <span className="text-xs font-bold text-slate-800">Verified Listings Only (Green Registry Vetted)</span>
                        </label>
                      </div>

                      {/* Builder rating */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Minimum Builder Rating (Stars)</label>
                        <div className="flex gap-2">
                          {[0, 4.0, 4.3, 4.5, 4.7].map((str) => {
                            const isSelected = filterMinBuilderRating === str;
                            return (
                              <button
                                key={str}
                                type="button"
                                onClick={() => setFilterMinBuilderRating(str)}
                                className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#b38330] text-slate-950 border-transparent shadow-xs' 
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {str === 0 ? 'No Limit' : `${str}★ +`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Developer experience history */}
                      <div className="space-y-2 bg-slate-150 p-4 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-extrabold text-slate-750">
                          <span>Minimum Track Record</span>
                          <span className="text-amber-600">{filterMinBuilderExperience} Years in Nagpur / Markets</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="2"
                          value={filterMinBuilderExperience}
                          onChange={(e) => setFilterMinBuilderExperience(parseInt(e.target.value))}
                          className="w-full accent-[#b38330]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 9: Property Age */}
                {activeFilterCategoryTab === 9 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#b38330]" /> Category 10: Age of Property
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Sift properties from brand new launches to older luxury estates.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['All', 'New', '1–5 years', '5–10 years', '10+ years'].map((age) => {
                        const isSelected = filterPropertyAge === age;
                        return (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setFilterPropertyAge(age)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-amber-500 shadow-xs' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {age === 'All' ? 'ANY AGE' : age.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 10: Ownership & Legal */}
                {activeFilterCategoryTab === 10 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#b38330]" /> Category 11: Legal Certifications & Bank Sancation status
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Secure your investment! Filter by RERA board registrations & clean title status.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Select Ownership type */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Select Legal Ownership style</label>
                        <select
                          value={filterOwnership}
                          onChange={(e) => setFilterOwnership(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All ownership styles</option>
                          <option value="Freehold">Freehold land</option>
                          <option value="Leasehold">Leasehold (99 Yrs)</option>
                          <option value="Co-operative society">Co-operative society allocation</option>
                        </select>
                      </div>

                      {/* Legal togglers */}
                      <div className="space-y-3 sm:col-span-2">
                        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Mandatory Vetting Clearance checks</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label className="flex items-center gap-2.5 bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={filterReraApproved}
                              onChange={(e) => setFilterReraApproved(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 accent-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">RERA Approved Listings</span>
                          </label>
                          <label className="flex items-center gap-2.5 bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={filterBankApproved}
                              onChange={(e) => setFilterBankApproved(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 accent-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Bank Home-loan pre-cleared</span>
                          </label>
                          <label className="flex items-center gap-2.5 bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={filterClearTitle}
                              onChange={(e) => setFilterClearTitle(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 accent-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Clear Litigation-Free Title</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 11: Facing & Vastu */}
                {activeFilterCategoryTab === 11 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#b38330]" /> Category 12: Orientation, Sun-arc facing & Vastu compliance
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Align structures with positive Vedic Vastu layout elements.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Cardinal facing directions select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Select Entrance Orientation (Facing)</label>
                        <select
                          value={filterFacing}
                          onChange={(e) => setFilterFacing(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Facings</option>
                          <option value="East">East Entrance</option>
                          <option value="West">West Entrance</option>
                          <option value="North">North Entrance</option>
                          <option value="South">South Entrance</option>
                        </select>
                      </div>

                      {/* Vastu Toggles */}
                      <div className="space-y-3 sm:col-span-2.5 bg-white border border-slate-200 p-4 rounded-2xl flex flex-col gap-2">
                        <span className="text-xs font-extrabold text-slate-700 block">Settle Vedic Vastu alignments</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={filterVaastuCompliant}
                              onChange={(e) => setFilterVaastuCompliant(e.target.checked)}
                              className="w-4 h-4 text-[#b38330] accent-[#b38330]"
                            />
                            <span className="text-xs font-bold text-slate-800">100% Vaastu Compliant Layout</span>
                          </label>
                          <label className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={filterCornerProperty}
                              onChange={(e) => setFilterCornerProperty(e.target.checked)}
                              className="w-4 h-4 text-[#b38330] accent-[#b38330]"
                            />
                            <span className="text-xs font-bold text-slate-800">Corner Property Plot (Double road Access)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 12: Floor Filters */}
                {activeFilterCategoryTab === 12 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#b38330]" /> Category 13: Floor Heights & Block preference
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Specify tower height preferences starting from ground floor villas to sky-level blocks.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Floor position */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-600 block">Choose Block Height positioning</label>
                        <select
                          value={filterFloor}
                          onChange={(e) => setFilterFloor(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="All">All Floor Levels</option>
                          <option value="Ground floor">Ground Floor only</option>
                          <option value="Middle floor">Middle floors</option>
                          <option value="Top floor">Skyscraper Top floors</option>
                        </select>
                      </div>

                      {/* Minimum floors in tower */}
                      <div className="space-y-2 bg-white border border-[#0E1F35]/10 p-4 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-extrabold text-slate-750">
                          <span>Minimum Floors in Tower Project</span>
                          <span className="text-[#b38330] font-black">{filterMinTotalFloors} Floors Minimum</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          step="5"
                          value={filterMinTotalFloors}
                          onChange={(e) => setFilterMinTotalFloors(parseInt(e.target.value))}
                          className="w-full accent-[#0E1F35]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 13: Vehicle Parking */}
                {activeFilterCategoryTab === 13 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-[#b38330]" /> Category 14: Allocated Vehicle Parking
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Filter listings with assigned parking slots.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'All', label: 'All Parking' },
                        { id: 'Bike parking', label: 'Allocated Bike Parking' },
                        { id: 'Car parking', label: 'Allocated Car Parking' },
                        { id: 'Covered parking', label: 'Premium Covered Parking' }
                      ].map((pkg) => {
                        const isSelected = filterParkingType === pkg.id;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setFilterParkingType(pkg.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-[#b38330] shadow-sm' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pkg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 14: Nearby Essentials */}
                {activeFilterCategoryTab === 14 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#b38330]" /> Category 15: Proximity distance to major essentials
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Checklist of closest city terminals, metro blocks to filter.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        'Near schools', 'Near hospitals', 'Near metro', 'Near airport', 'Near IT park', 'Near market'
                      ].map((es) => {
                        const isIncluded = filterNearbyEssentials.includes(es);
                        return (
                          <button
                            key={es}
                            type="button"
                            onClick={() => {
                              if (isIncluded) {
                                setFilterNearbyEssentials(prev => prev.filter(e => e !== es));
                              } else {
                                setFilterNearbyEssentials(prev => [...prev, es]);
                              }
                            }}
                            className={`p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between cursor-pointer transition-all ${
                              isIncluded 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-amber-500' 
                                : 'bg-white text-slate-700 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            <span>{es.toUpperCase()}</span>
                            {isIncluded && <Check className="w-4 h-4 text-[#b38330]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 15: Investment Returns */}
                {activeFilterCategoryTab === 15 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#b38330]" /> Category 16: ROI Yields & Real-Estate Investment Settle metric
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Tailored for wealth asset management. Filter properties based on yield potentials.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'All', label: 'All properties' },
                        { id: 'High ROI properties', label: 'High ROI properties (Nagpur Expressway growth belt)' },
                        { id: 'High rental yield', label: 'High rental yield (Near whitefield/Hinjawadi IT hubs)' },
                        { id: 'Fast appreciation areas', label: 'Fast appreciation zones' },
                        { id: 'Best for investment', label: 'Secured long tenure assets' }
                      ].map((v) => {
                        const isSelected = filterInvestment === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setFilterInvestment(v.id)}
                            className={`p-4 rounded-xl text-xs font-bold text-left border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-[#b38330] shadow-sm' 
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 16: Smart AI Personas */}
                {activeFilterCategoryTab === 16 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#b38330]" /> Category 17: Smart AI Assisted Buyer Persona matches
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Match properties using intelligent neighborhood scoring models.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'All', label: 'No AI match preset' },
                        { id: 'Best family homes', label: 'Nuclear Family Homes (Green, secured societies)' },
                        { id: 'Best bachelor-friendly', label: 'Bachelor Friendly (No restrictions, metro near)' },
                        { id: 'Luxury properties', label: 'High Luxury suites' },
                        { id: 'Best for retirement', label: 'Retirees Settle blocks (Tranquil, medical near)' },
                        { id: 'Student-friendly', label: 'Student Settle blocks (Near universities)' }
                      ].map((ai) => {
                        const isSelected = filterSmartAi === ai.id;
                        return (
                          <button
                            key={ai.id}
                            type="button"
                            onClick={() => setFilterSmartAi(ai.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-amber-500 shadow-md' 
                                : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            {ai.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 17: Seller Category */}
                {activeFilterCategoryTab === 17 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#b38330]" /> Category 18: Seller Categories Vetting
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Filter listings posted directly by individual owners to skip broker transaction commissions.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'All', label: 'All properties matching' },
                        { id: 'Owner', label: 'Owner Hand-posted (Brokerage FREE)' },
                        { id: 'Builder', label: 'Direct Developer Sales' },
                        { id: 'Agent', label: 'Certified Real-Estate Brokers' }
                      ].map((s) => {
                        const isSelected = filterSellerType === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setFilterSellerType(s.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ring-1 ring-[#b38330] shadow-sm' 
                                : 'bg-white text-slate-800 border-slate-205 hover:bg-slate-100'
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 18: Posted Timeline */}
                {activeFilterCategoryTab === 19 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#b38330]" /> Category 19: Registry upload timeline
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Refine properties placed within the last 24 hours up to one month.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'All', label: 'Vetting All timelines' },
                        { id: 'today', label: 'Posted Today (Within 24 Hours)' },
                        { id: '3days', label: 'Within last 72 Hours' },
                        { id: 'week', label: 'Within last 7 Days' },
                        { id: 'month', label: 'Within last 30 Days' }
                      ].map((tm) => {
                        const isSelected = filterPostedTime === tm.id;
                        return (
                          <button
                            key={tm.id}
                            type="button"
                            onClick={() => setFilterPostedTime(tm.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ' 
                                : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            {tm.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 19: Immediate Availability */}
                {activeFilterCategoryTab === 18 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#b38330]" /> Category 20: Possession & Occupancy Certifications (OC) Delivery
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Locate properties where possession keys are instantly available.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'All', label: 'All availabilities' },
                        { id: 'Immediate possession', label: 'Keys Settle Ready (Immediate occupancy)' },
                        { id: 'Available now', label: 'Available within 15 days' }
                      ].map((av) => {
                        const isSelected = filterAvailability === av.id;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setFilterAvailability(av.id)}
                            className={`p-4 rounded-xl text-xs font-black text-center border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-transparent ' 
                                : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            {av.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200 shrink-0 select-none">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {countActiveFilters} active criteria applied to vetting engines
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllFilters();
                    setShowAdvancedFiltersModal(false);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase px-5 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer"
                >
                  Reset & Close
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="bg-[#0E1F35] hover:bg-[#b38330] text-white hover:text-slate-950 text-xs font-black uppercase tracking-wider px-8 py-3 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
