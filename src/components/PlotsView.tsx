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
  TrendingUp, 
  ChevronDown, 
  Check, 
  Sparkles,
  X, 
  Phone,
  Layers,
  Info,
  DollarSign,
  User,
  Map,
  Grid,
  Minimize2,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../types';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// @ts-ignore
import plotMasterPlan from '../assets/images/plot_master_plan_1779771998473.png';
// @ts-ignore
import plotAerialGrid from '../assets/images/plot_aerial_grid_1779772017773.png';
// @ts-ignore
import plotBoundaryDelineated from '../assets/images/plot_boundary_delineated_1779772037908.png';
// @ts-ignore
import plotGroundMarkers from '../assets/images/plot_ground_markers_1779772058852.png';
// @ts-ignore
import plotGatedTownship from '../assets/images/plot_gated_township_1779772086152.png';
// @ts-ignore
import plotCollCorner from '../assets/images/plot_coll_corner_1779773021907.png';
// @ts-ignore
import plotCollBoundary from '../assets/images/plot_coll_boundary_1779773044285.png';
// @ts-ignore
import plotCollEast from '../assets/images/plot_coll_east_1779773062273.png';
// @ts-ignore
import plotCollBudget from '../assets/images/plot_coll_budget_1779773082146.png';
import AdsSection from './AdsSection';

interface PlotsViewProps {
  onBackToHome: () => void;
  onPropertyClick?: (id: string) => void;
  onTabChange?: (tab: TabType) => void;
}

interface PlotProperty {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  city: string;
  locality: string;
  area: string;
  roadWidth: string;
  facing: string;
  reraStatus: string;
  plotType: 'Residential' | 'Commercial' | 'Gated Township' | 'Industrial' | 'Agricultural';
  boundaryWall: 'Constructed' | 'Not Constructed' | 'Fenced';
  image: string;
  ownerName: string;
  ownerContact: string;
  verified: boolean;
  distanceToHighway: string;
  waterAvailability: string;
  details: string;
  features: string[];
}

// 50+ Premium highly structured Plot listings
const RAW_PLOT_LISTINGS: PlotProperty[] = [
  {
    id: 'plot-1',
    title: '1700 Sq.ft East-Facing Corner Plot',
    price: '₹ 22 Lac',
    numericPrice: 2200000,
    city: 'Ranchi',
    locality: 'Helal Road, Near IT Junction, Ranchee',
    area: '1700/Sq. feet',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: plotMasterPlan,
    ownerName: 'Devashish Mahto',
    ownerContact: '+91 94311 88291',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'Borewell & Panchayat Pipe',
    details: 'Beautiful high altitude residential plot with instant registry. Perfect for duplex construction in quiet suburban green belt.',
    features: ['3-Side Open Plot', '30 Feet Wide Internal Roads', 'Active Streetlights Installed']
  },
  {
    id: 'plot-2',
    title: 'Prime 1700 Sq.ft Green View Plot',
    price: '₹ 22 Lac',
    numericPrice: 2200000,
    city: 'Ranchi',
    locality: 'Kanke Road Ring Avenue, Ranchee',
    area: '1700/Sq. feet',
    roadWidth: '30 Feet',
    facing: 'North-East',
    reraStatus: 'RERA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: plotAerialGrid,
    ownerName: 'Bijay Oraon',
    ownerContact: '+91 70041 22351',
    verified: true,
    distanceToHighway: '500 meters',
    waterAvailability: '24/7 Deep Borewell Supply',
    details: 'Ready to build plot opposite the scenic lake. Fully secure township with private security booth and lush landscaped parameters.',
    features: ['Vastu Compliant Layout', 'Secured Compound Gateway', 'Underground Sewerage System']
  },
  {
    id: 'plot-3',
    title: '1700 Sq.ft Gated Horizon Land',
    price: '₹ 22 Lac',
    numericPrice: 2200000,
    city: 'Ranchi',
    locality: 'Namkum Meadows Industrial Link, Ranchee',
    area: '1700/Sq. feet',
    roadWidth: '50 Feet',
    facing: 'West',
    reraStatus: 'RERA Approved',
    plotType: 'Commercial',
    boundaryWall: 'Not Constructed',
    image: plotBoundaryDelineated,
    ownerName: 'Rajesh Sahay',
    ownerContact: '+91 82103 44552',
    verified: true,
    distanceToHighway: '150 meters',
    waterAvailability: 'Municipal Water Connection',
    details: 'High footfall comercial sector lot right on the four-lane highway connectivity curve. Ideal for showroom, warehouse, or multi-level complex.',
    features: ['Corner Commercial Zoning', 'High Tension Power Access', 'Ample Customer Parking Margins']
  },
  {
    id: 'plot-4',
    title: '1700 Sq.ft Premium Greenfield Avenue',
    price: '₹ 22 Lac',
    numericPrice: 2200000,
    city: 'Ranchi',
    locality: 'Ratu Road Elite Block, Ranchee',
    area: '1700/Sq. feet',
    roadWidth: '35 Feet',
    facing: 'South-East',
    reraStatus: 'Gram Panchayat NOC Cleared',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: plotGroundMarkers,
    ownerName: 'Vikas Swarnkar',
    ownerContact: '+91 91133 80512',
    verified: true,
    distanceToHighway: '2.0 km',
    waterAvailability: 'Submersible Water Line',
    details: 'Peaceful residential locality with premium families settled around. Complete safety index with closed perimeter lines.',
    features: ['Underground Drainage Unit', 'Fruit Trees Planted', 'Clear Title Registry Deed']
  },
  {
    id: 'plot-5',
    title: '1700 Sq.ft Residential Bliss Oasis',
    price: '₹ 22 Lac',
    numericPrice: 2200000,
    city: 'Ranchi',
    locality: 'Tupudana Ring Corridor, Ranchee',
    area: '1700/Sq. feet',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: plotGatedTownship,
    ownerName: 'Sanjay Sharan',
    ownerContact: '+91 94301 99221',
    verified: true,
    distanceToHighway: '800 meters',
    waterAvailability: 'Panchayat Pipeline Service',
    details: 'Very affordable plot inside institutional ring road, perfect for multi-story residential construction or rental yielding rooms.',
    features: ['Starlight View Corner', 'Compost Trench Access', '24 Hours Armed Guard System']
  },
  {
    id: 'plot-6',
    title: 'Wardha Road Highway Touch Plot',
    price: '₹ 38 Lac',
    numericPrice: 3800000,
    city: 'Nagpur',
    locality: 'Chinchbhavan, Near Wardha Road Extension',
    area: '1500 sqft',
    roadWidth: '60 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Milind Deshpande',
    ownerContact: '+91 98812 34451',
    verified: true,
    distanceToHighway: '0 meters (Highway Touch)',
    waterAvailability: 'NMC Connection Available',
    details: 'Prime commercial land with top investment ROI prospects. Surrounded by massive logistics and upcoming commercial plazas.',
    features: ['Premium Highway Exposure', 'Dual Entrance Layout', 'High-tension power compatibility']
  },
  {
    id: 'plot-7',
    title: 'Besa Elite Gated Meadows',
    price: '₹ 28 Lac',
    numericPrice: 2800000,
    city: 'Nagpur',
    locality: 'Besa Central Elite Block',
    area: '1200 sqft',
    roadWidth: '30 Feet',
    facing: 'West',
    reraStatus: 'NMRDA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Suresh Dandige',
    ownerContact: '+91 94221 55601',
    verified: true,
    distanceToHighway: '1.5 km',
    waterAvailability: 'Borewell & Corporation Hybrid',
    details: 'NMRDA fully-sanctioned plots with immediate release. Bank loan approved by SBI, HDFC and ICICI up to 80%.',
    features: ['Children Playing Arena', 'Underground Utility Piping', 'Jogging Track Perimeter']
  },
  {
    id: 'plot-8',
    title: 'Jamtha Sports Boulevard Land',
    price: '₹ 45 Lac',
    numericPrice: 4500000,
    city: 'Nagpur',
    locality: 'Opposite VCA Stadium, Jamtha',
    area: '2400 sqft',
    roadWidth: '40 Feet',
    facing: 'North-East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Not Constructed',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Kishore Jichkar',
    ownerContact: '+91 71224 88390',
    verified: true,
    distanceToHighway: '400 meters',
    waterAvailability: 'Township Central Sump',
    details: 'Massive residential plot ideal for luxury bunglow. Clean titles with fully paid municipal taxes till date.',
    features: ['Corner Plot Advantage', 'Water Drainage Connected', 'Elite Neighbor Elite Row']
  },
  {
    id: 'plot-9',
    title: 'Mihan Tech-Hub Commercial Sector',
    price: '₹ 85 Lac',
    numericPrice: 8500000,
    city: 'Nagpur',
    locality: 'MIHAN SEZ boundary zone',
    area: '5000 sqft',
    roadWidth: '80 Feet',
    facing: 'North',
    reraStatus: 'NMRDA Approved',
    plotType: 'Industrial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vikas Mandlekar',
    ownerContact: '+91 98230 44521',
    verified: true,
    distanceToHighway: '1.0 km',
    waterAvailability: 'MIDC High Pressure Supply',
    details: 'Large industrial/commercial allotment in safe zone. Perfect for corporate warehouses, IT campuses or processing unit assembly blocks.',
    features: ['High capacity sewage lines', 'Heavy container loading ramp', 'Dedicated security towers']
  },
  {
    id: 'plot-10',
    title: 'New Rajendra Nagar VIP Plot',
    price: '₹ 65 Lac',
    numericPrice: 6500000,
    city: 'Raipur',
    locality: 'VIP Lane, New Rajendra Nagar',
    area: '1800 sqft',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Devendra Chandrakar',
    ownerContact: '+91 94060 11211',
    verified: true,
    distanceToHighway: '500 meters',
    waterAvailability: '24/7 NMC Corporation Water',
    details: 'A premium plot inside the VIP elite layout of Raipur. Fully security guarded colony with proper asphalt carpet roads and stormwater drains.',
    features: ['Immediate registration', 'Vastu north-east facing', 'Independent water meter tap']
  },
  {
    id: 'plot-11',
    title: 'Shankar Nagar Elite Residential Plot',
    price: '₹ 95 Lac',
    numericPrice: 9500000,
    city: 'Raipur',
    locality: 'Sector 3 Landmark block, Shankar Nagar',
    area: '2500 sqft',
    roadWidth: '35 Feet',
    facing: 'North',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Kuldeep Singh Sodhi',
    ownerContact: '+91 98931 00392',
    verified: true,
    distanceToHighway: '800 meters',
    waterAvailability: 'Deep Submersible Preinstalled',
    details: 'Extremely rare vacant plot inside well-developed area of Shankar Nagar. Highly premium neighbourhood with close access to schools and organic parks.',
    features: ['Dual water lines', 'Clear 30-years search report', 'Zero society maintenance dues']
  },
  {
    id: 'plot-12',
    title: 'Naya Raipur Smart Gated Greenfield',
    price: '₹ 32 Lac',
    numericPrice: 3200000,
    city: 'Raipur',
    locality: 'Sector 25 Express Green Zone, Naya Raipur',
    area: '1500 sqft',
    roadWidth: '50 Feet',
    facing: 'East',
    reraStatus: 'NRDA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Amitesh Agrawal',
    ownerContact: '+91 70003 44521',
    verified: true,
    distanceToHighway: '200 meters',
    waterAvailability: 'Smart City Automated Grid',
    details: 'Invest in the modern city of Naya Raipur. Gated society plotting with smart lighting, wide roads, underground communication fibers, and massive park views.',
    features: ['Wi-Fi enabled corridor', 'Recycled water gardening tap', 'Anti-earthquake layouts']
  },
  {
    id: 'plot-13',
    title: 'Mowa Prime Commercial Zone Plot',
    price: '₹ 1.25 Cr',
    numericPrice: 12500000,
    city: 'Raipur',
    locality: 'Main Commercial Link Road, Mowa',
    area: '3200 sqft',
    roadWidth: '80 Feet',
    facing: 'South',
    reraStatus: 'TCP Sanctioned',
    plotType: 'Commercial',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Mahendra Dewangan',
    ownerContact: '+91 94255 11220',
    verified: true,
    distanceToHighway: '300 meters',
    waterAvailability: 'Municipal Main Pipeline',
    details: 'Commercial corner plot with massive road frontage. Ideal for clinic, shopping arcade, branch library offices, or premium business centers.',
    features: ['Commercial power rating', 'Storm Drainage Integrated', 'Pre-allocated customer ramp']
  },
  {
    id: 'plot-14',
    title: 'Whitefield Smart IT-Row Plot',
    price: '₹ 2.5 Cr',
    numericPrice: 25000000,
    city: 'Bengaluru',
    locality: 'Whitefield Phase 2 Tech Row',
    area: '3000 sqft',
    roadWidth: '60 Feet',
    facing: 'East',
    reraStatus: 'BBMP B-Khata Verified',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Ranganath Swamy',
    ownerContact: '+91 98440 21453',
    verified: true,
    distanceToHighway: '1.1 km',
    waterAvailability: 'BWSSB water connection active',
    details: 'Highly coveted commercial plot in core Whitefield workspace rows. Perfect for high-density PG models, executive luxury lounges or IT branches.',
    features: ['Dual road entry avenues', 'High load transformer backup', 'Fiber optics underground link']
  },
  {
    id: 'plot-15',
    title: 'Koramangala Green Block Premium Plot',
    price: '₹ 4.8 Cr',
    numericPrice: 48000000,
    city: 'Bengaluru',
    locality: 'Block 4 Avenues, Koramangala',
    area: '4000 sqft',
    roadWidth: '40 Feet',
    facing: 'North-East',
    reraStatus: 'BBMP A-Khata Registered',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Balan Nair',
    ownerContact: '+91 98860 30588',
    verified: true,
    distanceToHighway: '1.8 km',
    waterAvailability: 'BWSSB Cauvery Water Active',
    details: 'A true legacy asset. Prestigious layout nestled inside lush tree-covered residential avenue rows. Fully clean historic ownership records.',
    features: ['Cauvery Water Connection', 'Vastu Shastra compliant', 'Quiet Elite Neighborhood Guard']
  },
  {
    id: 'plot-16',
    title: 'Sarjapur Gated Township Garden Lot',
    price: '₹ 82 Lac',
    numericPrice: 8200000,
    city: 'Bengaluru',
    locality: 'Green Meadows Gated Colony, Sarjapur',
    area: '2400 sqft',
    roadWidth: '30 Feet',
    facing: 'West',
    reraStatus: 'BIAPPA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Muralidhar Rao',
    ownerContact: '+91 98455 01223',
    verified: true,
    distanceToHighway: '2.5 km',
    waterAvailability: 'Township Borewell grid with RO',
    details: 'Beautiful rectangular garden facing plot. Full-fledged clubhouse access included in pricing plans. Ready for immediate bricklaying.',
    features: ['Grand Entrance Archway', 'Piped Natural Gas line ready', 'Central Sewer treatment filter']
  },
  {
    id: 'plot-17',
    title: 'Koregaon Park Riverside Plot',
    price: '₹ 3.1 Cr',
    numericPrice: 31000000,
    city: 'Pune',
    locality: 'Lane 7 Premium Riverside, Koregaon Park',
    area: '3600 sqft',
    roadWidth: '40 Feet',
    facing: 'North',
    reraStatus: 'PMC Approved Clear Title',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Shashank Kulkarni',
    ownerContact: '+91 95455 12580',
    verified: true,
    distanceToHighway: '2.2 km',
    waterAvailability: 'PMC Central Supply Water active',
    details: 'Luxury empty land overlooking peaceful green cover. Ideal for building multi-car garage bungalow or design mansion.',
    features: ['River Breeze Exposure', 'Teak boundary fencing lines', 'CCTV surrounding parameters']
  },
  {
    id: 'plot-18',
    title: 'Hinjenwadi IT-Links Plot Block',
    price: '₹ 1.1 Cr',
    numericPrice: 11000000,
    city: 'Pune',
    locality: 'Phase III Techno Plots, Hinjewadi',
    area: '2400 sqft',
    roadWidth: '50 Feet',
    facing: 'East',
    reraStatus: 'PMRDA Sanctioned',
    plotType: 'Commercial',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vijay Devrukhkar',
    ownerContact: '+91 95451 11224',
    verified: true,
    distanceToHighway: '700 meters',
    waterAvailability: 'MIDC water pipeline supply',
    details: 'Commercial zone allotment with premium layout metrics. Zero legal pending matters. Instant construct status permission.',
    features: ['High-tech CCTV Grid Row', 'Ample container space lines', 'Fitted boundary water filter']
  },
  {
    id: 'plot-19',
    title: 'Wagholi Highway Commercial Plot',
    price: '₹ 55 Lac',
    numericPrice: 5500000,
    city: 'Pune',
    locality: 'Pune-Nagar Highway Crossing, Wagholi',
    area: '1800 sqft',
    roadWidth: '80 Feet',
    facing: 'South',
    reraStatus: 'PMRDA Sanctioned',
    plotType: 'Commercial',
    boundaryWall: 'Not Constructed',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Milind Deore',
    ownerContact: '+91 96231 44556',
    verified: true,
    distanceToHighway: '50 meters (Highway View)',
    waterAvailability: 'Borewell connection active',
    details: 'An absolute investment goldmine. Extremely suitable for shopping hubs, bank storage facilities or premium auto dealerships.',
    features: ['Massive front hoarding permission', 'Dual drainage access valves', 'High load power cables']
  },
  {
    id: 'plot-20',
    title: 'Powai Boulevard Premium Plot',
    price: '₹ 6.2 Cr',
    numericPrice: 62000000,
    city: 'Mumbai',
    locality: 'Powai Boulevard Side Frontage',
    area: '4500 sqft',
    roadWidth: '100 Feet',
    facing: 'West',
    reraStatus: 'MCGM Sanctioned',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vikram Mehta',
    ownerContact: '+91 98201 55923',
    verified: true,
    distanceToHighway: '200 meters',
    waterAvailability: 'MCGM Main Pipeline active',
    details: 'Top caliber commercial land near tech and residential avenues of Mumbai. Ready for ultra-premium multi-level commercial hub projects.',
    features: ['100-Feet Main Road Access', 'Underground electrical grid prefit', 'All BMC NOC papers precleared']
  },
  // Adding remaining 30 items to complete AT LEAST 50 listings
  {
    id: 'plot-21',
    title: 'Ranchi Ring Road Gated Acre',
    price: '₹ 45 Lac',
    numericPrice: 4500000,
    city: 'Ranchi',
    locality: 'Vikas Nagar Peripheral Link, Ranchee',
    area: '2400/Sq. feet',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'Gram Panchayat Verified',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Anil Mahto',
    ownerContact: '+91 94311 00224',
    verified: true,
    distanceToHighway: '900 meters',
    waterAvailability: 'Borewell Line Pre-Fit',
    details: 'Premium empty land inside lush gated residency segment. Instant construction layout approval available.',
    features: ['Walled boundary perimeter', 'Clean title certificate', 'Active security guard']
  },
  {
    id: 'plot-22',
    title: 'Ranchee Landmark Commercial Plot',
    price: '₹ 65 Lac',
    numericPrice: 6500000,
    city: 'Ranchi',
    locality: 'Lalpur Elite Crossing, Ranchee',
    area: '1800/Sq. feet',
    roadWidth: '50 Feet',
    facing: 'North',
    reraStatus: 'Town Planning N-NOC',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Rameshwar Mahto',
    ownerContact: '+91 94311 88512',
    verified: true,
    distanceToHighway: '100 meters',
    waterAvailability: 'Deep bore water pre-installed',
    details: 'Fantastic commercial plot with high capital yield indexes. Located on highly buzzing street link corridor.',
    features: ['High capacity sewage link', 'Three-phase electric connection', 'Ramp pre-allocated']
  },
  {
    id: 'plot-23',
    title: 'Besa Garden City 1700 Sq.ft Corner',
    price: '₹ 32 Lac',
    numericPrice: 3200000,
    city: 'Nagpur',
    locality: 'Besa Heights Gated Ring Road',
    area: '1700/Sq. feet',
    roadWidth: '40 Feet',
    facing: 'North-East',
    reraStatus: 'NMRDA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Arvind Patil',
    ownerContact: '+91 98811 44558',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'Central water supply connection',
    details: 'Corner gated townhouse plot. Beautifully constructed pavement layout with adjacent garden space.',
    features: ['Corner plot advantage', 'Jogging park proximity', '24/7 solar compound light']
  },
  {
    id: 'plot-24',
    title: 'Hingna Industrial Zone Plot',
    price: '₹ 75 Lac',
    numericPrice: 7500000,
    city: 'Nagpur',
    locality: 'Hingna MIDC Main Gate Link',
    area: '4800 sqft',
    roadWidth: '80 Feet',
    facing: 'South',
    reraStatus: 'MIDC Allotted',
    plotType: 'Industrial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Sanjay Kolhe',
    ownerContact: '+91 98503 14522',
    verified: true,
    distanceToHighway: '500 meters',
    waterAvailability: 'MIDC high-capacity line',
    details: 'Pristine industrial zone allotment suited for processing blocks or warehousing layout.',
    features: ['Truck parking terminal', 'High voltage transformer pre-allotted', 'CCTV secure compound']
  },
  {
    id: 'plot-25',
    title: 'Ranchee Tupudana Bypass Greenfield',
    price: '₹ 18 Lac',
    numericPrice: 1800000,
    city: 'Ranchi',
    locality: 'Tupudana Industrial Phase 3, Ranchee',
    area: '1500 sqft',
    roadWidth: '35 Feet',
    facing: 'East',
    reraStatus: 'Gram Panchayat Approval',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Shambhu Mandal',
    ownerContact: '+91 70044 11223',
    verified: true,
    distanceToHighway: '1.5 km',
    waterAvailability: 'Borewell active connection',
    details: 'An excellent budget residential plot near Tupudana bypass corridor. Clear registry titles.',
    features: ['Budget-friendly investment', 'Ready for instant construct', 'Clear NOC reports']
  },
  {
    id: 'plot-26',
    title: 'Sarjapur Smart Green Lot',
    price: '₹ 62 Lac',
    numericPrice: 6200000,
    city: 'Bengaluru',
    locality: 'Sarjapur Road Extension Elite Row',
    area: '1500 sqft',
    roadWidth: '30 Feet',
    facing: 'North',
    reraStatus: 'BIAPPA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Chidananda Murthy',
    ownerContact: '+91 98450 11451',
    verified: true,
    distanceToHighway: '2.0 km',
    waterAvailability: 'Township water filtration prefit',
    details: 'Gated community site with complete asphalt pathways, decorative lights and robust storm-drains.',
    features: ['Clubhouse membership fee waived', 'Security guard post active', 'Lush tree parameters']
  },
  {
    id: 'plot-27',
    title: 'Dharampeth VIP Elite Plot',
    price: '₹ 1.8 Cr',
    numericPrice: 18000000,
    city: 'Nagpur',
    locality: 'Opposite West High Court Road, Dharampeth',
    area: '3200 sqft',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'NMRDA Sanctioned',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Ramkrishna Pande',
    ownerContact: '+91 94220 11442',
    verified: true,
    distanceToHighway: '1.0 km',
    waterAvailability: '24/7 NMC Corporation Lines',
    details: 'Elite vacant space inside top VIP neighborhood block. Ready to build bespoke royal bungalows.',
    features: ['Most premier locality', 'Teak tree assets on plot', 'Triple phase electricity pipeline']
  },
  {
    id: 'plot-28',
    title: 'Ranchee Kanke Road Gated Horizon',
    price: '₹ 35 Lac',
    numericPrice: 3500000,
    city: 'Ranchi',
    locality: 'Kanke Inner Link Ring Road, Ranchee',
    area: '1800 sqft',
    roadWidth: '30 Feet',
    facing: 'South',
    reraStatus: 'RERA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Aditya Sen',
    ownerContact: '+91 80026 11451',
    verified: true,
    distanceToHighway: '1.1 km',
    waterAvailability: 'Submersible water line pre-fit',
    details: 'Serene plot surrounded by scenic hills and green forest views. Secured entrance setup with smart keys.',
    features: ['Excellent scenic view index', '24/7 security patrol', 'Organic compost pits']
  },
  {
    id: 'plot-29',
    title: 'VIP Road Corridor Gated Plot',
    price: '₹ 55 Lac',
    numericPrice: 5500000,
    city: 'Raipur',
    locality: 'VIP Gated Enclave road, Shankar Nagar',
    area: '1800 sqft',
    roadWidth: '40 Feet',
    facing: 'West',
    reraStatus: 'TCP Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vikas Mishra',
    ownerContact: '+91 94252 00192',
    verified: true,
    distanceToHighway: '400 meters',
    waterAvailability: 'NMC water loop active',
    details: 'Luxury gated block plotting in highly safe corporate executive zone. Fully paved standard sidewalk alleys.',
    features: ['High capital appreciation zones', 'Kids game zone access', 'Closed gated fence']
  },
  {
    id: 'plot-30',
    title: 'Hinjewadi Gated Tech Plot',
    price: '₹ 95 Lac',
    numericPrice: 9500000,
    city: 'Pune',
    locality: 'Phase II Smart Gate Enclave, Hinjewadi',
    area: '2000 sqft',
    roadWidth: '35 Feet',
    facing: 'North',
    reraStatus: 'PMRDA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Kishor Patwardhan',
    ownerContact: '+91 91580 11422',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'PMRDA Central water grid line',
    details: 'Sleek tech lifestyle estate compound ready for smart modular villa. High fiber optic and security links.',
    features: ['Automated gate sensors', 'Rainwater collector unit', 'Clubhouse guest suites access']
  },
  {
    id: 'plot-31',
    title: 'Ranchee Helal Road Budget Residential',
    price: '₹ 15 Lac',
    numericPrice: 1500000,
    city: 'Ranchi',
    locality: 'Helal Crossing Inner Road, Ranchee',
    area: '1200 sqft',
    roadWidth: '25 Feet',
    facing: 'East',
    reraStatus: 'Gram Panchayat Approval',
    plotType: 'Residential',
    boundaryWall: 'Not Constructed',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Suraj Kachhap',
    ownerContact: '+91 94303 55191',
    verified: true,
    distanceToHighway: '1.8 km',
    waterAvailability: 'Borewell layout clear',
    details: 'Very affordable plots within Ranchi corporation link line. Fast appreciating pocket near green zone.',
    features: ['Budget tier layout', 'No dynamic sewage fee', 'Separate registry documentation']
  },
  {
    id: 'plot-32',
    title: 'Devendra Nagar Premier Plot',
    price: '₹ 80 Lac',
    numericPrice: 8000000,
    city: 'Raipur',
    locality: 'Sector 5 Main Avenue, Devendra Nagar',
    area: '2000 sqft',
    roadWidth: '40 Feet',
    facing: 'North-West',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Preeti Deshmukh',
    ownerContact: '+91 91118 40223',
    verified: true,
    distanceToHighway: '1.0 km',
    waterAvailability: 'Deep submersible Active prefit',
    details: 'Centrally located premium residential vacant site with immediate layout. Close to premium medical centers and main square.',
    features: ['Asphalt carpet connectivity', 'Underground power layout', 'Cleared taxes history NOC']
  },
  {
    id: 'plot-33',
    title: 'Amlidih Elite Green Acre',
    price: '₹ 45 Lac',
    numericPrice: 4500000,
    city: 'Raipur',
    locality: 'Amlidih Main High-Income Zone, New Rajendra Nagar',
    area: '1800 sqft',
    roadWidth: '30 Feet',
    facing: 'East',
    reraStatus: 'TCP Approved NOC',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Devendra Chandrakar',
    ownerContact: '+91 94060 11211',
    verified: true,
    distanceToHighway: '1.5 km',
    waterAvailability: 'Borewell connection ready',
    details: 'Excellent rectangular shape land. Completely elevated structure with zero flooding history during rainstorm monsoon index.',
    features: ['Flood-free elevation layout', 'Highly secured quiet neighbors', 'Clean boundary wall setup']
  },
  {
    id: 'plot-34',
    title: 'Wagholi Garden Vista Plot',
    price: '₹ 32 Lac',
    numericPrice: 3200000,
    city: 'Pune',
    locality: 'Wagholi Green Meadows link crossing',
    area: '1200 sqft',
    roadWidth: '30 Feet',
    facing: 'North',
    reraStatus: 'PMRDA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Abhijit Gokhale',
    ownerContact: '+91 96231 22354',
    verified: true,
    distanceToHighway: '2.2 km',
    waterAvailability: 'Mula-Mutha grid link prefit',
    details: 'Gated layout plot with highly organized modern facilities. Perfect for sweet home with green courtyard designs.',
    features: ['Gated security guard active', 'Recycled water tap setup', 'Durable tiled pavement blocks']
  },
  {
    id: 'plot-35',
    title: 'Wagholi Highway Commercial Yard',
    price: '₹ 1.5 Cr',
    numericPrice: 15000000,
    city: 'Pune',
    locality: 'Main Pune Nagar highway frontline crossing',
    area: '3600 sqft',
    roadWidth: '80 Feet',
    facing: 'East',
    reraStatus: 'PMRDA Sanctioned',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Abhijit Gokhale',
    ownerContact: '+91 96231 22354',
    verified: true,
    distanceToHighway: '10 meters (Frontline)',
    waterAvailability: 'High flux commercial water pipe',
    details: 'Unbelievable high footfall zone land. Extremely suitable for automobile servicing outlet, high-rise office link or clinic centers.',
    features: ['80-Feet road direct frontage', 'Heavy payload vehicle access ramp', 'Main commercial electric meter line']
  },
  {
    id: 'plot-36',
    title: 'Ranchee Tupudana Smart Green Corner',
    price: '₹ 25 Lac',
    numericPrice: 2500000,
    city: 'Ranchi',
    locality: 'Tupudana Outer Ring Enclave, Ranchee',
    area: '1500 sqft',
    roadWidth: '30 Feet',
    facing: 'West',
    reraStatus: 'RERA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vijay Dewangan Junior',
    ownerContact: '+91 70004 11223',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'Township central pump active',
    details: 'Excellent design corner plot. Ready for modular construction layout. Features highly secure fence boundary lines.',
    features: ['Corner Gated layout', 'Water pipeline preinstalled', 'Asphalt internal paths']
  },
  {
    id: 'plot-37',
    title: 'Electronic City Tech Greenfield Plot',
    price: '₹ 1.4 Cr',
    numericPrice: 14000000,
    city: 'Bengaluru',
    locality: 'Phase II Peripheral IT Grid, Electronic City',
    area: '2400 sqft',
    roadWidth: '40 Feet',
    facing: 'South',
    reraStatus: 'BMRDA Sanctioned BBMP',
    plotType: 'Commercial',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1588720324466-4199fc99b7fc?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Subramanya Sastry',
    ownerContact: '+91 99001 22354',
    verified: true,
    distanceToHighway: '600 meters',
    waterAvailability: 'Cauvery Water Pipeline connection ready',
    details: 'Strategic investment location. Highly compatible with multi-family rental building or executive single rooms due to huge corporate density.',
    features: ['Cauvery Water pipelines', 'RERA compliant titles', 'Separate sewer pipelines precleared']
  },
  {
    id: 'plot-38',
    title: 'Elec City Gated Green Meadows Slot',
    price: '₹ 70 Lac',
    numericPrice: 7000000,
    city: 'Bengaluru',
    locality: 'Gated Meadows Green Block, Electronic City',
    area: '1800 sqft',
    roadWidth: '30 Feet',
    facing: 'North-East',
    reraStatus: 'BMRDA Approved NOC',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Subramanya Sastry',
    ownerContact: '+91 99001 22354',
    verified: true,
    distanceToHighway: '1.5 km',
    waterAvailability: 'Central water sump layout active',
    details: 'A clean and bright rectangular land site inside high profile colony block. Club amenities, sports pitch and children mud pits fully ready.',
    features: ['Excellent neighborhood security', 'Asphalt internal loop paths', 'Fruit orchards surrounding']
  },
  {
    id: 'plot-39',
    title: 'Manish Nagar Crossing High-Capital Lot',
    price: '₹ 62 Lac',
    numericPrice: 6200000,
    city: 'Nagpur',
    locality: 'Manish Nagar Crossing link road',
    area: '1800 sqft',
    roadWidth: '40 Feet',
    facing: 'North',
    reraStatus: 'NMRDA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Nitin Gadkari Senior',
    ownerContact: '+91 71224 88771',
    verified: true,
    distanceToHighway: '300 meters',
    waterAvailability: 'NMC water mains active connection',
    details: 'Highly desirable vacant plot close to prominent metro link station. Extremely secure layout bounds and immediate utility registration.',
    features: ['Storm water drains active', 'LED lights fitted streets', 'NOC cleared ancestral search']
  },
  {
    id: 'plot-40',
    title: 'Kanke Road Ranchee Premium Plot',
    price: '₹ 45 Lac',
    numericPrice: 4500000,
    city: 'Ranchi',
    locality: 'Kanke VIP residential belt, Ranchee',
    area: '1800 sqft',
    roadWidth: '35 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Surendra Nath Shahdeo',
    ownerContact: '+91 94311 22453',
    verified: true,
    distanceToHighway: '800 meters',
    waterAvailability: 'Deep bore water well verified',
    details: 'Centrally located premium vacant block ready for quick masonry layout. Clean ancestry papers and certified master plan NOC.',
    features: ['Vastu complete parameters', '35-feet wide front lane', 'Underground security sewer']
  },
  {
    id: 'plot-41',
    title: 'Raipur TATIBANDH College Link Lot',
    price: '₹ 28 Lac',
    numericPrice: 2800000,
    city: 'Raipur',
    locality: 'Tatibandh Institutional Sector Link road',
    area: '1200 sqft',
    roadWidth: '30 Feet',
    facing: 'West',
    reraStatus: 'TCP Sanctioned NOC',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Satyajit Rathore',
    ownerContact: '+91 98930 22354',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'Borewell connection ready',
    details: 'Highly convenient layout. Suitable for building student pg rooms or private housing plots in premium location.',
    features: ['Excellent road link indicators', 'Separate electricity meter NOC', 'Cleared boundary fence']
  },
  {
    id: 'plot-42',
    title: 'Ranchee Lalpur Elite Commercial Haven',
    price: '₹ 1.8 Cr',
    numericPrice: 18000000,
    city: 'Ranchi',
    locality: 'Main Lalpur Circle Trade links, Ranchee',
    area: '2400 sqft',
    roadWidth: '60 Feet',
    facing: 'North',
    reraStatus: 'Town Planning Cleared',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Sanjay Sharan',
    ownerContact: '+91 94301 99221',
    verified: true,
    distanceToHighway: '100 meters',
    waterAvailability: 'Deep submersible water lines',
    details: 'Premium commercial block with massive return ratios. Placed inside buzzing trade row segments near top colleges.',
    features: ['Premium highway connectivity guides', 'Underground heavy storm link', 'Ramp prebuilt']
  },
  {
    id: 'plot-43',
    title: 'Hingna MIDC Gated Industrial Spot',
    price: '₹ 1.2 Cr',
    numericPrice: 12000000,
    city: 'Nagpur',
    locality: 'Main Hingna Industrial Road Axis',
    area: '4500 sqft',
    roadWidth: '60 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Industrial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Sunil Dandekar',
    ownerContact: '+91 93701 44558',
    verified: true,
    distanceToHighway: '300 meters',
    waterAvailability: 'MIDC continuous water loop active',
    details: 'Heavy industrial classification lot. Best utility features with preallocated boundary wall and ready high-load wiring terminals.',
    features: ['MIDC certified compliance', 'Separate high bandwidth data cable', 'Container unloading ramp']
  },
  {
    id: 'plot-44',
    title: 'Naya Raipur Sector 25 Smart Acre',
    price: '₹ 45 Lac',
    numericPrice: 4500000,
    city: 'Raipur',
    locality: 'Sector 25 Main Boulevard, Naya Raipur',
    area: '1800 sqft',
    roadWidth: '40 Feet',
    facing: 'East',
    reraStatus: 'NRDA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Amitesh Agrawal',
    ownerContact: '+91 70003 44521',
    verified: true,
    distanceToHighway: '100 meters',
    waterAvailability: 'Automated municipal water grid active',
    details: 'Invest in Naya Raipur green space grid. Premium smart layout setup with fiber layout prefit. Safe family zone parameters.',
    features: ['Automated sewer pipes', 'Solar neighborhood lights', 'Asphalt direct paths']
  },
  {
    id: 'plot-45',
    title: 'Ranchee Tupudana Industrial Yard Lot',
    price: '₹ 55 Lac',
    numericPrice: 5500000,
    city: 'Ranchi',
    locality: 'Tupudana Industrial Phase II, Ranchee',
    area: '3200 sqft',
    roadWidth: '50 Feet',
    facing: 'West',
    reraStatus: 'TCP Sanctioned RERA',
    plotType: 'Industrial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Shambhu Mandal',
    ownerContact: '+91 70044 11223',
    verified: true,
    distanceToHighway: '500 meters',
    waterAvailability: 'MIDC Water flow active',
    details: 'Highly compatible layout for light industry workshops, storage decks or logistical centers.',
    features: ['Heavy vehicle loop entry', 'High-tension voltage loop active', 'Cleared title ancestry deeds']
  },
  {
    id: 'plot-46',
    title: 'Pune Wagholi Premium Acre Lot',
    price: '₹ 42 Lac',
    numericPrice: 4200000,
    city: 'Pune',
    locality: 'Wagholi Green Acres sector links',
    area: '1500 sqft',
    roadWidth: '30 Feet',
    facing: 'East',
    reraStatus: 'PMRDA Approved NOC',
    plotType: 'Residential',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Abhijit Gokhale',
    ownerContact: '+91 96231 22354',
    verified: true,
    distanceToHighway: '2.5 km',
    waterAvailability: 'Borewell connection ready',
    details: 'Lush green surroundings overlooking organic valleys. Highly premium family safety indices and quiet neighbor blocks.',
    features: ['Vastu standard configuration', 'Flood-free elevation layout', 'Active neighborhood surveillance']
  },
  {
    id: 'plot-47',
    title: 'Powai Lake Boulevard Side Acre Lot',
    price: '₹ 4.8 Cr',
    numericPrice: 48000000,
    city: 'Mumbai',
    locality: 'Powai Lake Gated Link Crossing',
    area: '3200 sqft',
    roadWidth: '50 Feet',
    facing: 'North-East',
    reraStatus: 'MCGM Sanctioned NOC',
    plotType: 'Commercial',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1444653303775-9b412a2a0104?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Vikram Mehta',
    ownerContact: '+91 98201 55923',
    verified: true,
    distanceToHighway: '400 meters',
    waterAvailability: 'MCGM main pipelineactive link',
    details: 'Luxury premium vacant asset with immediate construction status. Placed right on the core corporate sector frontline.',
    features: ['Underground electrical pipelines', 'RERA compliant titles', 'Ample guest parking guides']
  },
  {
    id: 'plot-48',
    title: 'Sarjapur Luxury Green Enclave Plot',
    price: '₹ 95 Lac',
    numericPrice: 9500000,
    city: 'Bengaluru',
    locality: 'Sarjapur Avenue Green Gated plot Block',
    area: '2400 sqft',
    roadWidth: '40 Feet',
    facing: 'North',
    reraStatus: 'BIAPPA Sanctioned',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Chidananda Murthy',
    ownerContact: '+91 98450 11451',
    verified: true,
    distanceToHighway: '1.2 km',
    waterAvailability: 'Deep submersible drinking RO',
    details: 'Corner plot facing beautiful children play field. Premium residential enclaves with top-level security guards.',
    features: ['Gated security guard active', 'Pre-installed water treatment', 'Closed neighborhood lights']
  },
  {
    id: 'plot-49',
    title: 'Ranchee Lalpur Inner Corner Gated Site',
    price: '₹ 28 Lac',
    numericPrice: 2800000,
    city: 'Ranchi',
    locality: 'Lalpur Elite Sector bypass, Ranchee',
    area: '1200 Sq. feet',
    roadWidth: '30 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Rameshwar Mahto',
    ownerContact: '+91 94311 88512',
    verified: true,
    distanceToHighway: '1.4 km',
    waterAvailability: 'Borewell active lines pre-fit',
    details: 'Beautiful rectangular shape gated townhouse plot link. Fully approved bank appraisal indices.',
    features: ['Gated security guard active', 'Asphalt internal avenues', 'Water pipelines active']
  },
  {
    id: 'plot-50',
    title: 'Besa Central Heights Garden Lot',
    price: '₹ 35 Lac',
    numericPrice: 3500000,
    city: 'Nagpur',
    locality: 'Besa Heights Gated plot block Crossing',
    area: '1500 sqft',
    roadWidth: '30 Feet',
    facing: 'West',
    reraStatus: 'NMRDA Approved NOC',
    plotType: 'Gated Township',
    boundaryWall: 'Fenced',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Arvind Patil',
    ownerContact: '+91 98811 44558',
    verified: true,
    distanceToHighway: '1.0 km',
    waterAvailability: 'Deep bore water well verified',
    details: 'Outstanding plot with absolute quiet landscape layout. Surrounded by luxury gated duplex blocks.',
    features: ['Jogging perimeter parks access', '24/7 solar compound lights', 'Storm water pipelines ready']
  },
  {
    id: 'plot-51',
    title: 'TATIBANDH Institutional Premium Plot',
    price: '₹ 58 Lac',
    numericPrice: 5800000,
    city: 'Raipur',
    locality: 'Tatibandh Institutional Link layout sector',
    area: '2000 sqft',
    roadWidth: '35 Feet',
    facing: 'East',
    reraStatus: 'RERA Approved',
    plotType: 'Residential',
    boundaryWall: 'Constructed',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Lalit Agrawal',
    ownerContact: '+91 98271 22334',
    verified: true,
    distanceToHighway: '900 meters',
    waterAvailability: '24/7 NMC Corporation pipeline',
    details: 'Highly convenient premium plot close to major medical academies. Complete boundary wall structure prebuilt with zero pending dues.',
    features: ['Asphalt network road connectivity', 'Cleared 30-year search title report', 'Vastu North-East Facing']
  }
];

const PLOT_IMAGES = [
  plotMasterPlan,
  plotAerialGrid,
  plotBoundaryDelineated,
  plotGroundMarkers,
  plotGatedTownship
];

const PLOT_LISTINGS: PlotProperty[] = RAW_PLOT_LISTINGS.map((plot, index) => ({
  ...plot,
  image: PLOT_IMAGES[index % PLOT_IMAGES.length]
}));

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Raipur': { lat: 21.2514, lng: 81.6296 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
};

const TARGET_MAP_CITIES = ['Raipur', 'Nagpur', 'Pune', 'Mumbai', 'Bengaluru', 'Ranchi'];

export default function PlotsView({ onBackToHome, onPropertyClick, onTabChange }: PlotsViewProps) {
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // States for Geolocation Plots Map
  const [showPlotsMapModal, setShowPlotsMapModal] = useState<boolean>(false);
  const [activeMapCity, setActiveMapCity] = useState<string>('Raipur');
  const [selectedMapListing, setSelectedMapListing] = useState<any | null>(null);
  const [useMockupMap, setUseMockupMap] = useState<boolean>(!hasValidKey);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);
  const [mobileModalTab, setMobileModalTab] = useState<'map' | 'info'>('map');

  const getMapPlotsResultsWithCoordinates = (city: string): (any & { lat: number; lng: number })[] => {
    const rawListings = PLOT_LISTINGS.filter(item => item.city === city);
    const center = CITY_COORDINATES[city] || { lat: 21.2514, lng: 81.6296 };
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
    if (showPlotsMapModal && !selectedMapListing) {
      const r = getMapPlotsResultsWithCoordinates(activeMapCity);
      if (r.length > 0) setSelectedMapListing(r[0]);
    }
  }, [showPlotsMapModal, activeMapCity]);

  // --- 20 Advanced Filter States ---
  // 1. Location Filters
  const [plotFilterArea, setPlotFilterArea] = useState<string>('');
  const [plotFilterLandmark, setPlotFilterLandmark] = useState<string>('');
  const [plotFilterPincode, setPlotFilterPincode] = useState<string>('');
  const [plotNearHighway, setPlotNearHighway] = useState<boolean>(false);
  const [plotNearMetro, setPlotNearMetro] = useState<boolean>(false);
  const [plotNearAirport, setPlotNearAirport] = useState<boolean>(false);
  const [plotNearIndustrial, setPlotNearIndustrial] = useState<boolean>(false);
  const [plotNearRingRoad, setPlotNearRingRoad] = useState<boolean>(false);
  const [plotDrawArea, setPlotDrawArea] = useState<boolean>(false);
  const [plotBoundaryMap, setPlotBoundaryMap] = useState<boolean>(false);
  const [plotSatelliteView, setPlotSatelliteView] = useState<boolean>(false);

  // 2. Budget Filter & Additional
  const [plotPriceMin, setPlotPriceMin] = useState<number | ''>('');
  const [plotPriceMax, setPlotPriceMax] = useState<number | ''>('');
  const [plotPricePerSqFtMax, setPlotPricePerSqFtMax] = useState<number | ''>('');
  const [plotPricePerAcreMax, setPlotPricePerAcreMax] = useState<number | ''>('');
  const [plotShowEmiEstimate, setPlotShowEmiEstimate] = useState<boolean>(false);
  const [plotQuickRange, setPlotQuickRange] = useState<string>('All');

  // 3. Plot Size Filter
  const [plotSizeMin, setPlotSizeMin] = useState<number | ''>('');
  const [plotSizeMax, setPlotSizeMax] = useState<number | ''>('');
  const [plotSizeUnit, setPlotSizeUnit] = useState<string>('Sq.ft'); // Sq.ft, Sq.yard, Acres, Guntha, Hectare

  // 4. Plot Type
  const [plotTypeSelection, setPlotTypeSelection] = useState<string>('All'); // Residential, Commercial, Agricultural, Industrial, Farm land

  // 5. Ownership Type
  const [plotOwnershipSelection, setPlotOwnershipSelection] = useState<string>('All'); // Freehold, Leasehold, Government lease

  // 6. Legal Approval Filters
  const [plotLegalRera, setPlotLegalRera] = useState<boolean>(false);
  const [plotLegalNa, setPlotLegalNa] = useState<boolean>(false);
  const [plotLegalApprovedLayout, setPlotLegalApprovedLayout] = useState<boolean>(false);
  const [plotLegalClearTitle, setPlotLegalClearTitle] = useState<boolean>(false);
  const [plotLegalBankApproved, setPlotLegalBankApproved] = useState<boolean>(false);
  const [plotLegalRegistryReady, setPlotLegalRegistryReady] = useState<boolean>(false);
  const [plotLegalEncumbranceFree, setPlotLegalEncumbranceFree] = useState<boolean>(false);
  const [plotLegalMutationCompleted, setPlotLegalMutationCompleted] = useState<boolean>(false);

  // 7. Facing Direction
  const [plotFacingDirection, setPlotFacingDirection] = useState<string>('All'); // East, West, North, South

  // 8. Road Access Filters
  const [plotRoadCorner, setPlotRoadCorner] = useState<boolean>(false);
  const [plotRoadMainTouch, setPlotRoadMainTouch] = useState<boolean>(false);
  const [plotRoadInternal, setPlotRoadInternal] = useState<boolean>(false);
  const [plotRoadWidthMax, setPlotRoadWidthMax] = useState<string>('All'); // 'All', '20 ft', '40 ft', 'Highway touch'

  // 9. Boundary & Dimensions
  const [plotHasBoundaryWall, setPlotHasBoundaryWall] = useState<string>('All'); // All, Constructed, Fenced, None
  const [plotFrontageWidthMin, setPlotFrontageWidthMin] = useState<number | ''>('');
  const [plotDimensionsSpec, setPlotDimensionsSpec] = useState<string>('');

  // 10. Nearby Infrastructure
  const [plotNearSchool, setPlotNearSchool] = useState<boolean>(false);
  const [plotNearHospital, setPlotNearHospital] = useState<boolean>(false);
  const [plotNearItPark, setPlotNearItPark] = useState<boolean>(false);

  // 11. Development Status
  const [plotDevelopmentStatus, setPlotDevelopmentStatus] = useState<string>('All'); // Gated layout, Township plot, Developed land, Under development

  // 12. Utilities Availability
  const [plotUtilityWater, setPlotUtilityWater] = useState<boolean>(false);
  const [plotUtilityElectricity, setPlotUtilityElectricity] = useState<boolean>(false);
  const [plotUtilityDrainage, setPlotUtilityDrainage] = useState<boolean>(false);
  const [plotUtilitySewage, setPlotUtilitySewage] = useState<boolean>(false);

  // 13. Investment Filters
  const [plotInvestmentAppreciation, setPlotInvestmentAppreciation] = useState<boolean>(false);
  const [plotInvestmentUpcomingInfra, setPlotInvestmentUpcomingInfra] = useState<boolean>(false);
  const [plotInvestmentHighRoi, setPlotInvestmentHighRoi] = useState<boolean>(false);
  const [plotInvestmentFastDeveloping, setPlotInvestmentFastDeveloping] = useState<boolean>(false);

  // 14. Possession Status
  const [plotPossessionStatus, setPlotPossessionStatus] = useState<string>('All'); // Immediate registry, Ready possession, Under development

  // 15. Seller Type
  const [plotSellerType, setPlotSellerType] = useState<string>('All'); // Owner, Builder, Agent

  // 16. Verified Listings
  const [plotVerifiedDocuments, setPlotVerifiedDocuments] = useState<boolean>(false);
  const [plotVerifiedLocation, setPlotVerifiedLocation] = useState<boolean>(false);
  const [plotVerifiedOwnership, setPlotVerifiedOwnership] = useState<boolean>(false);
  const [plotVerifiedPhotos, setPlotVerifiedPhotos] = useState<boolean>(false);

  // 17. Plot Shape Filters
  const [plotShapeSelection, setPlotShapeSelection] = useState<string>('All'); // Rectangular, Square, Irregular

  // 18. Gated Community Features
  const [plotGatedSecurity, setPlotGatedSecurity] = useState<boolean>(false);
  const [plotGatedCompoundWall, setPlotGatedCompoundWall] = useState<boolean>(false);
  const [plotGatedClubhouse, setPlotGatedClubhouse] = useState<boolean>(false);
  const [plotGatedStreetLights, setPlotGatedStreetLights] = useState<boolean>(false);
  const [plotGatedInternalRoads, setPlotGatedInternalRoads] = useState<boolean>(false);
  const [plotGatedGarden, setPlotGatedGarden] = useState<boolean>(false);

  // 19. Posted Time Filter
  const [plotPostedTime, setPlotPostedTime] = useState<string>('All'); // Today, Last 7 days, Last month

  // 20. AI Smart Filters
  const [plotAiBestInvestment, setPlotAiBestInvestment] = useState<boolean>(false);
  const [plotAiFutureGrowth, setPlotAiFutureGrowth] = useState<boolean>(false);
  const [plotAiHighAppreciation, setPlotAiHighAppreciation] = useState<boolean>(false);
  const [plotAiLowRiskLegal, setPlotAiLowRiskLegal] = useState<boolean>(false);

  // Advanced Filters Modal State
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState<boolean>(false);
  const [activeFilterCategoryTab, setActiveFilterCategoryTab] = useState<number>(0);
  
  // Selected Detail Modal State
  const [selectedPlot, setSelectedPlot] = useState<PlotProperty | null>(null);
  const [showInquirySuccess, setShowInquirySuccess] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [loadingIntel, setLoadingIntel] = useState(false);

  // Active filters count state helper
  const countActivePlotFilters = useMemo(() => {
    let count = 0;
    if (plotFilterArea !== '') count++;
    if (plotFilterLandmark !== '') count++;
    if (plotFilterPincode !== '') count++;
    if (plotNearHighway) count++;
    if (plotNearMetro) count++;
    if (plotNearAirport) count++;
    if (plotNearIndustrial) count++;
    if (plotNearRingRoad) count++;
    if (plotDrawArea) count++;
    if (plotBoundaryMap) count++;
    if (plotSatelliteView) count++;
    if (plotPriceMin !== '') count++;
    if (plotPriceMax !== '') count++;
    if (plotPricePerSqFtMax !== '') count++;
    if (plotPricePerAcreMax !== '') count++;
    if (plotShowEmiEstimate) count++;
    if (plotQuickRange !== 'All') count++;
    if (plotSizeMin !== '') count++;
    if (plotSizeMax !== '') count++;
    if (plotSizeUnit !== 'Sq.ft') count++;
    if (plotTypeSelection !== 'All') count++;
    if (plotOwnershipSelection !== 'All') count++;
    if (plotLegalRera) count++;
    if (plotLegalNa) count++;
    if (plotLegalApprovedLayout) count++;
    if (plotLegalClearTitle) count++;
    if (plotLegalBankApproved) count++;
    if (plotLegalRegistryReady) count++;
    if (plotLegalEncumbranceFree) count++;
    if (plotLegalMutationCompleted) count++;
    if (plotFacingDirection !== 'All') count++;
    if (plotRoadCorner) count++;
    if (plotRoadMainTouch) count++;
    if (plotRoadInternal) count++;
    if (plotRoadWidthMax !== 'All') count++;
    if (plotHasBoundaryWall !== 'All') count++;
    if (plotFrontageWidthMin !== '') count++;
    if (plotDimensionsSpec !== '') count++;
    if (plotNearSchool) count++;
    if (plotNearHospital) count++;
    if (plotNearItPark) count++;
    if (plotDevelopmentStatus !== 'All') count++;
    if (plotUtilityWater) count++;
    if (plotUtilityElectricity) count++;
    if (plotUtilityDrainage) count++;
    if (plotUtilitySewage) count++;
    if (plotInvestmentAppreciation) count++;
    if (plotInvestmentUpcomingInfra) count++;
    if (plotInvestmentHighRoi) count++;
    if (plotInvestmentFastDeveloping) count++;
    if (plotPossessionStatus !== 'All') count++;
    if (plotSellerType !== 'All') count++;
    if (plotVerifiedDocuments) count++;
    if (plotVerifiedLocation) count++;
    if (plotVerifiedOwnership) count++;
    if (plotVerifiedPhotos) count++;
    if (plotShapeSelection !== 'All') count++;
    if (plotGatedSecurity) count++;
    if (plotGatedCompoundWall) count++;
    if (plotGatedClubhouse) count++;
    if (plotGatedStreetLights) count++;
    if (plotGatedInternalRoads) count++;
    if (plotGatedGarden) count++;
    if (plotPostedTime !== 'All') count++;
    if (plotAiBestInvestment) count++;
    if (plotAiFutureGrowth) count++;
    if (plotAiHighAppreciation) count++;
    if (plotAiLowRiskLegal) count++;
    return count;
  }, [
    plotFilterArea, plotFilterLandmark, plotFilterPincode,
    plotNearHighway, plotNearMetro, plotNearAirport, plotNearIndustrial, plotNearRingRoad,
    plotDrawArea, plotBoundaryMap, plotSatelliteView,
    plotPriceMin, plotPriceMax, plotPricePerSqFtMax, plotPricePerAcreMax, plotShowEmiEstimate, plotQuickRange,
    plotSizeMin, plotSizeMax, plotSizeUnit,
    plotTypeSelection, plotOwnershipSelection,
    plotLegalRera, plotLegalNa, plotLegalApprovedLayout, plotLegalClearTitle,
    plotLegalBankApproved, plotLegalRegistryReady, plotLegalEncumbranceFree, plotLegalMutationCompleted,
    plotFacingDirection,
    plotRoadCorner, plotRoadMainTouch, plotRoadInternal, plotRoadWidthMax,
    plotHasBoundaryWall, plotFrontageWidthMin, plotDimensionsSpec,
    plotNearSchool, plotNearHospital, plotNearItPark,
    plotDevelopmentStatus,
    plotUtilityWater, plotUtilityElectricity, plotUtilityDrainage, plotUtilitySewage,
    plotInvestmentAppreciation, plotInvestmentUpcomingInfra, plotInvestmentHighRoi, plotInvestmentFastDeveloping,
    plotPossessionStatus, plotSellerType,
    plotVerifiedDocuments, plotVerifiedLocation, plotVerifiedOwnership, plotVerifiedPhotos,
    plotShapeSelection,
    plotGatedSecurity, plotGatedCompoundWall, plotGatedClubhouse, plotGatedStreetLights, plotGatedInternalRoads, plotGatedGarden,
    plotPostedTime,
    plotAiBestInvestment, plotAiFutureGrowth, plotAiHighAppreciation, plotAiLowRiskLegal
  ]);

  const resetAllPlotFilters = () => {
    setPlotFilterArea('');
    setPlotFilterLandmark('');
    setPlotFilterPincode('');
    setPlotNearHighway(false);
    setPlotNearMetro(false);
    setPlotNearAirport(false);
    setPlotNearIndustrial(false);
    setPlotNearRingRoad(false);
    setPlotDrawArea(false);
    setPlotBoundaryMap(false);
    setPlotSatelliteView(false);

    setPlotPriceMin('');
    setPlotPriceMax('');
    setPlotPricePerSqFtMax('');
    setPlotPricePerAcreMax('');
    setPlotShowEmiEstimate(false);
    setPlotQuickRange('All');

    setPlotSizeMin('');
    setPlotSizeMax('');
    setPlotSizeUnit('Sq.ft');

    setPlotTypeSelection('All');
    setPlotOwnershipSelection('All');

    setPlotLegalRera(false);
    setPlotLegalNa(false);
    setPlotLegalApprovedLayout(false);
    setPlotLegalClearTitle(false);
    setPlotLegalBankApproved(false);
    setPlotLegalRegistryReady(false);
    setPlotLegalEncumbranceFree(false);
    setPlotLegalMutationCompleted(false);

    setPlotFacingDirection('All');

    setPlotRoadCorner(false);
    setPlotRoadMainTouch(false);
    setPlotRoadInternal(false);
    setPlotRoadWidthMax('All');

    setPlotHasBoundaryWall('All');
    setPlotFrontageWidthMin('');
    setPlotDimensionsSpec('');

    setPlotNearSchool(false);
    setPlotNearHospital(false);
    setPlotNearItPark(false);

    setPlotDevelopmentStatus('All');

    setPlotUtilityWater(false);
    setPlotUtilityElectricity(false);
    setPlotUtilityDrainage(false);
    setPlotUtilitySewage(false);

    setPlotInvestmentAppreciation(false);
    setPlotInvestmentUpcomingInfra(false);
    setPlotInvestmentHighRoi(false);
    setPlotInvestmentFastDeveloping(false);

    setPlotPossessionStatus('All');
    setPlotSellerType('All');

    setPlotVerifiedDocuments(false);
    setPlotVerifiedLocation(false);
    setPlotVerifiedOwnership(false);
    setPlotVerifiedPhotos(false);

    setPlotShapeSelection('All');

    setPlotGatedSecurity(false);
    setPlotGatedCompoundWall(false);
    setPlotGatedClubhouse(false);
    setPlotGatedStreetLights(false);
    setPlotGatedInternalRoads(false);
    setPlotGatedGarden(false);

    setPlotPostedTime('All');

    setPlotAiBestInvestment(false);
    setPlotAiFutureGrowth(false);
    setPlotAiHighAppreciation(false);
    setPlotAiLowRiskLegal(false);

    setCityFilter('All');
    setTypeFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSelectedCollection(null);
  };

  // Combine core properties with custom uploaded Plot properties
  const [customPlotListings, setCustomPlotListings] = useState<any[]>([]);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const stored = localStorage.getItem('nest_uploaded_custom_properties_plots');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map(p => ({
              ...p,
              numericPrice: parseInt(p.price.replace(/[^\d]/g, '')) * 100000 || 3500000,
              city: p.location.split(',').pop()?.trim() || 'Nagpur',
              locality: p.location.split(',')[0]?.trim() || 'Wardha Road',
              areaLabel: p.location.split(',')[0]?.trim() || 'Wardha Road',
              builder: 'Landowner Private Group',
              plotType: 'Residential',
              facing: 'East',
              boundaryWallCount: 1,
              gatedCommunity: true,
              reraStatus: 'Registered',
              investmentTag: 'High ROI plot properties',
              aiTag: 'Best appreciation plot',
              locationIndex: 88,
              structuralIndex: 92,
              ageYears: 1,
              carpetArea: p.area,
              superBuiltupArea: p.area,
              possessionStatus: 'Immediate Registration',
              dimensions: '40 x 30 ft',
              plotArea: p.area,
              pricePerSqft: Math.round((parseInt(p.price.replace(/[^\d]/g, '')) * 100000 || 3500000) / (parseInt(p.area.replace(/[^\d]/g, '')) || 1200)),
              plotBorders: 'North Face wider Link'
            }));
            setCustomPlotListings(mapped);
          }
        } else {
          setCustomPlotListings([]);
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

  const plotListingsToUse = useMemo(() => {
    return [...customPlotListings, ...PLOT_LISTINGS];
  }, [customPlotListings, PLOT_LISTINGS]);

  // Filtered Plot properties for dynamic list exploration (All 51 plots!)
  const filteredListings = useMemo(() => {
    return plotListingsToUse.filter(plot => {
      // City search/filter: support standard names and Ranchee lookup
      const matchesCity = cityFilter === 'All' || 
        (cityFilter === 'Ranchi' && (plot.city.toLowerCase() === 'ranchi' || plot.locality.toLowerCase().includes('ranchee'))) ||
        plot.city.toLowerCase() === cityFilter.toLowerCase();
      
      const matchesType = typeFilter === 'All' || plot.plotType === typeFilter;
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        plot.title.toLowerCase().includes(query) ||
        plot.locality.toLowerCase().includes(query) ||
        plot.city.toLowerCase().includes(query) ||
        plot.plotType.toLowerCase().includes(query) ||
        (query === 'ranchee' && plot.locality.toLowerCase().includes('ranchee'));

      // Core price filters
      const matchesMinPrice = minPrice === '' || plot.numericPrice >= minPrice;
      const matchesMaxPrice = maxPrice === '' || plot.numericPrice <= maxPrice;

      // Collection checks
      let matchesCollection = true;
      if (selectedCollection === 'corner') {
        matchesCollection = plot.title.toLowerCase().includes('corner') || plot.features.some(f => f.toLowerCase().includes('corner'));
      } else if (selectedCollection === 'boundary') {
        matchesCollection = plot.boundaryWall === 'Constructed';
      } else if (selectedCollection === 'east') {
        matchesCollection = plot.facing.toLowerCase() === 'east' || plot.facing.toLowerCase().includes('east');
      } else if (selectedCollection === 'budget') {
        matchesCollection = plot.numericPrice <= 3000000;
      }

      // --- 20 Advanced Filter Validations (AND Logical Combination) ---
      
      // 1. Location Filters
      let matchesArea = true;
      if (plotFilterArea) {
        matchesArea = plot.locality.toLowerCase().includes(plotFilterArea.toLowerCase());
      }
      let matchesLandmark = true;
      if (plotFilterLandmark) {
        matchesLandmark = plot.locality.toLowerCase().includes(plotFilterLandmark.toLowerCase()) || 
          plot.title.toLowerCase().includes(plotFilterLandmark.toLowerCase()) ||
          plot.details.toLowerCase().includes(plotFilterLandmark.toLowerCase());
      }
      let matchesPincode = true;
      if (plotFilterPincode) {
        matchesPincode = plot.locality.includes(plotFilterPincode);
      }
      let matchesNearHighway = true;
      if (plotNearHighway) {
        matchesNearHighway = plot.details.toLowerCase().includes('highway') || 
          plot.title.toLowerCase().includes('highway') ||
          plot.distanceToHighway.toLowerCase().includes('highway') ||
          plot.distanceToHighway.toLowerCase().includes('meters') ||
          plot.distanceToHighway.toLowerCase().includes('0 meters') ||
          parseFloat(plot.distanceToHighway) <= 1;
      }
      let matchesNearMetro = true;
      if (plotNearMetro) {
        matchesNearMetro = plot.details.toLowerCase().includes('metro') || 
          plot.title.toLowerCase().includes('metro') ||
          plot.features.some(f => f.toLowerCase().includes('metro'));
      }
      let matchesNearAirport = true;
      if (plotNearAirport) {
        matchesNearAirport = plot.details.toLowerCase().includes('airport') || 
          plot.title.toLowerCase().includes('airport') ||
          plot.features.some(f => f.toLowerCase().includes('airport'));
      }
      let matchesNearIndustrial = true;
      if (plotNearIndustrial) {
        matchesNearIndustrial = plot.plotType === 'Industrial' || 
          plot.details.toLowerCase().includes('industrial') || 
          plot.locality.toLowerCase().includes('industrial') ||
          plot.features.some(f => f.toLowerCase().includes('industrial'));
      }
      let matchesNearRingRoad = true;
      if (plotNearRingRoad) {
        matchesNearRingRoad = plot.locality.toLowerCase().includes('ring') || 
          plot.details.toLowerCase().includes('ring') ||
          plot.features.some(f => f.toLowerCase().includes('ring'));
      }

      // 2. Budget Filter
      let matchesAdvancedPriceMin = true;
      if (plotPriceMin !== '') {
        matchesAdvancedPriceMin = plot.numericPrice >= plotPriceMin;
      }
      let matchesAdvancedPriceMax = true;
      if (plotPriceMax !== '') {
        matchesAdvancedPriceMax = plot.numericPrice <= plotPriceMax;
      }
      let matchesPricePerSqFt = true;
      if (plotPricePerSqFtMax !== '') {
        const numericAreaStr = plot.area.replace(/[^0-9]/g, '');
        const areaVal = parseFloat(numericAreaStr) || 1200;
        const pricePerSqFt = plot.numericPrice / areaVal;
        matchesPricePerSqFt = pricePerSqFt <= plotPricePerSqFtMax;
      }
      let matchesPricePerAcre = true;
      if (plotPricePerAcreMax !== '') {
        matchesPricePerAcre = plot.numericPrice <= plotPricePerAcreMax;
      }

      // 3. Plot Size Filters
      let matchesSize = true;
      const numericAreaStr = plot.area.replace(/[^0-9]/g, '');
      const areaInSqFt = parseFloat(numericAreaStr) || 1500;
      let calculatedAreaInSelectedUnit = areaInSqFt;
      if (plotSizeUnit === 'Sq.yard') {
        calculatedAreaInSelectedUnit = areaInSqFt / 9;
      } else if (plotSizeUnit === 'Acres') {
        calculatedAreaInSelectedUnit = areaInSqFt / 43560;
      } else if (plotSizeUnit === 'Guntha') {
        calculatedAreaInSelectedUnit = areaInSqFt / 1089;
      } else if (plotSizeUnit === 'Hectare') {
        calculatedAreaInSelectedUnit = areaInSqFt / 107639;
      }
      
      if (plotSizeMin !== '') {
        matchesSize = matchesSize && calculatedAreaInSelectedUnit >= plotSizeMin;
      }
      if (plotSizeMax !== '') {
        matchesSize = matchesSize && calculatedAreaInSelectedUnit <= plotSizeMax;
      }

      // 4. Plot Type Selection
      let matchesTypeSelection = true;
      if (plotTypeSelection !== 'All') {
        if (plotTypeSelection === 'Farm land') {
          matchesTypeSelection = plot.plotType === 'Agricultural' || plot.title.toLowerCase().includes('farm') || plot.details.toLowerCase().includes('farm');
        } else {
          matchesTypeSelection = plot.plotType.toLowerCase() === plotTypeSelection.toLowerCase();
        }
      }

      // 5. Ownership Type
      let matchesOwnership = true;
      if (plotOwnershipSelection !== 'All') {
        matchesOwnership = plot.reraStatus.toLowerCase().includes(plotOwnershipSelection.toLowerCase()) || 
          plot.details.toLowerCase().includes(plotOwnershipSelection.toLowerCase()) ||
          (plotOwnershipSelection === 'Freehold' && (plot.verified || plot.reraStatus.includes('A-Khata')));
      }

      // 6. Legal Approvals
      let matchesLegal = true;
      if (plotLegalRera && !(plot.reraStatus.includes('RERA') || plot.title.toLowerCase().includes('rera'))) {
        matchesLegal = false;
      }
      if (plotLegalNa && !(plot.reraStatus.toLowerCase().includes('na') || plot.reraStatus.toLowerCase().includes('nmrda') || plot.details.toLowerCase().includes('na') || plot.details.toLowerCase().includes('non-agricultural'))) {
        matchesLegal = false;
      }
      if (plotLegalApprovedLayout && !plot.reraStatus.includes('Approved') && !plot.reraStatus.includes('Sanctioned') && !plot.reraStatus.includes('Khata')) {
        matchesLegal = false;
      }
      if (plotLegalClearTitle && !plot.verified) {
        matchesLegal = false;
      }
      if (plotLegalBankApproved && !plot.details.toLowerCase().includes('bank') && !plot.details.toLowerCase().includes('loan') && !plot.features.some(f => f.toLowerCase().includes('loan'))) {
        matchesLegal = false;
      }
      if (plotLegalRegistryReady && !plot.details.toLowerCase().includes('registry') && !plot.title.toLowerCase().includes('registry') && !plot.details.toLowerCase().includes('ready')) {
        matchesLegal = false;
      }
      if (plotLegalEncumbranceFree && !plot.features.some(f => f.toLowerCase().includes('clear') || f.toLowerCase().includes('zero')) && !plot.details.toLowerCase().includes('dues')) {
        matchesLegal = false;
      }
      if (plotLegalMutationCompleted && !plot.details.toLowerCase().includes('deed') && !plot.title.toLowerCase().includes('deed') && !plot.verified) {
        matchesLegal = false;
      }

      // 7. Facing Direction
      let matchesFacing = true;
      if (plotFacingDirection !== 'All') {
        matchesFacing = plot.facing.toLowerCase() === plotFacingDirection.toLowerCase() || plot.facing.toLowerCase().includes(plotFacingDirection.toLowerCase());
      }

      // 8. Road Access
      let matchesRoadCorner = true;
      if (plotRoadCorner) {
        matchesRoadCorner = plot.title.toLowerCase().includes('corner') || plot.features.some(f => f.toLowerCase().includes('corner'));
      }
      let matchesRoadMainTouch = true;
      if (plotRoadMainTouch) {
        matchesRoadMainTouch = plot.distanceToHighway.toLowerCase().includes('0 meters') || plot.distanceToHighway.toLowerCase().includes('highway touch') || plot.title.toLowerCase().includes('highway touch') || plot.details.toLowerCase().includes('main road');
      }
      let matchesRoadInternal = true;
      if (plotRoadInternal) {
        matchesRoadInternal = plot.features.some(f => f.toLowerCase().includes('internal road')) || plot.details.toLowerCase().includes('internal');
      }
      let matchesRoadWidthLevel = true;
      if (plotRoadWidthMax !== 'All') {
        const roadWidthNum = parseFloat(plot.roadWidth) || 30;
        if (plotRoadWidthMax === '20 ft') {
          matchesRoadWidthLevel = roadWidthNum >= 20;
        } else if (plotRoadWidthMax === '40 ft') {
          matchesRoadWidthLevel = roadWidthNum >= 40;
        } else if (plotRoadWidthMax === 'Highway touch') {
          matchesRoadWidthLevel = plot.distanceToHighway.toLowerCase().includes('0 meters') || plot.distanceToHighway.toLowerCase().includes('touch');
        }
      }

      // 9. Boundary & Dimensions
      let matchesBoundaryWall = true;
      if (plotHasBoundaryWall !== 'All') {
        matchesBoundaryWall = plot.boundaryWall === plotHasBoundaryWall;
      }
      let matchesFrontage = true;
      if (plotFrontageWidthMin !== '') {
        const roadWidthNum = parseFloat(plot.roadWidth) || 30;
        matchesFrontage = roadWidthNum >= plotFrontageWidthMin;
      }
      let matchesDimensionsSpec = true;
      if (plotDimensionsSpec) {
        matchesDimensionsSpec = plot.details.toLowerCase().includes(plotDimensionsSpec.toLowerCase()) || plot.title.toLowerCase().includes(plotDimensionsSpec.toLowerCase());
      }

      // 10. Nearby Infrastructure
      let matchesNearSchool = true;
      if (plotNearSchool) {
        matchesNearSchool = plot.details.toLowerCase().includes('school') || plot.features.some(f => f.toLowerCase().includes('school')) || plot.details.toLowerCase().includes('academy');
      }
      let matchesNearHospital = true;
      if (plotNearHospital) {
        matchesNearHospital = plot.details.toLowerCase().includes('hospital') || plot.features.some(f => f.toLowerCase().includes('hospital')) || plot.details.toLowerCase().includes('medical');
      }
      let matchesNearItPark = true;
      if (plotNearItPark) {
        matchesNearItPark = plot.details.toLowerCase().includes('it park') || plot.details.toLowerCase().includes('sez') || plot.features.some(f => f.toLowerCase().includes('it')) || plot.title.toLowerCase().includes('it-row');
      }

      // 11. Development Status
      let matchesDevStatus = true;
      if (plotDevelopmentStatus !== 'All') {
        matchesDevStatus = plot.plotType.toLowerCase().includes(plotDevelopmentStatus.toLowerCase()) || 
          plot.details.toLowerCase().includes(plotDevelopmentStatus.toLowerCase()) ||
          (plotDevelopmentStatus === 'Gated layout' && plot.plotType === 'Gated Township') ||
          (plotDevelopmentStatus === 'Developed land' && plot.boundaryWall === 'Constructed');
      }

      // 12. Utilities
      let matchesUtilityWater = true;
      if (plotUtilityWater) {
        matchesUtilityWater = plot.waterAvailability.toLowerCase().includes('borewell') || plot.waterAvailability.toLowerCase().includes('municipal') || plot.waterAvailability.toLowerCase().includes('connection') || plot.waterAvailability.toLowerCase().includes('water');
      }
      let matchesUtilityElectricity = true;
      if (plotUtilityElectricity) {
        matchesUtilityElectricity = plot.details.toLowerCase().includes('electricity') || plot.features.some(f => f.toLowerCase().includes('electricity')) || plot.features.some(f => f.toLowerCase().includes('power'));
      }
      let matchesUtilityDrainage = true;
      if (plotUtilityDrainage) {
        matchesUtilityDrainage = plot.details.toLowerCase().includes('drainage') || plot.features.some(f => f.toLowerCase().includes('drainage'));
      }
      let matchesUtilitySewage = true;
      if (plotUtilitySewage) {
        matchesUtilitySewage = plot.details.toLowerCase().includes('sewage') || plot.features.some(f => f.toLowerCase().includes('sewage'));
      }

      // 13. Investment Filters (High appreciation area, Upcoming infrastructure, High ROI, Fast developing zone)
      let matchesAppreciation = true;
      if (plotInvestmentAppreciation) {
        matchesAppreciation = plot.details.toLowerCase().includes('appreciation') || plot.details.toLowerCase().includes('growth') || plot.details.toLowerCase().includes('premium');
      }
      let matchesUpcomingInfra = true;
      if (plotInvestmentUpcomingInfra) {
        matchesUpcomingInfra = plot.details.toLowerCase().includes('upcoming') || plot.details.toLowerCase().includes('smart city') || plot.details.toLowerCase().includes('metro');
      }
      let matchesHighRoi = true;
      if (plotInvestmentHighRoi) {
        matchesHighRoi = plot.details.toLowerCase().includes('roi') || plot.details.toLowerCase().includes('return') || plot.details.toLowerCase().includes('logistics');
      }
      let matchesFastDeveloping = true;
      if (plotInvestmentFastDeveloping) {
        matchesFastDeveloping = plot.details.toLowerCase().includes('developing') || plot.details.toLowerCase().includes('corridor') || plot.details.toLowerCase().includes('extension');
      }

      // 14. Possession Status
      let matchesPossession = true;
      if (plotPossessionStatus !== 'All') {
        matchesPossession = plot.details.toLowerCase().includes(plotPossessionStatus.toLowerCase()) || plot.title.toLowerCase().includes('ready') || plot.details.toLowerCase().includes('immediate') || plot.details.toLowerCase().includes('possession');
      }

      // 15. Seller Type
      let matchesSeller = true;
      if (plotSellerType !== 'All') {
        if (plotSellerType === 'Owner') {
          matchesSeller = !plot.ownerName.toLowerCase().includes('developer') && !plot.ownerName.toLowerCase().includes('builders');
        } else if (plotSellerType === 'Builder') {
          matchesSeller = plot.ownerName.toLowerCase().includes('builder') || plot.ownerName.toLowerCase().includes('developer') || plot.ownerName.toLowerCase().includes('township');
        } else if (plotSellerType === 'Agent') {
          matchesSeller = plot.ownerName.toLowerCase().includes('mahto') || plot.ownerName.toLowerCase().includes('sodhi');
        }
      }

      // 16. Verified Listings
      let matchesVerifiedDocs = true;
      if (plotVerifiedDocuments) {
        matchesVerifiedDocs = plot.verified || plot.reraStatus.includes('Approved') || plot.reraStatus.includes('Khata');
      }
      let matchesVerifiedLocation = true;
      if (plotVerifiedLocation) {
        matchesVerifiedLocation = plot.verified;
      }
      let matchesVerifiedOwnership = true;
      if (plotVerifiedOwnership) {
        matchesVerifiedOwnership = plot.verified && plot.ownerName.length > 5;
      }
      let matchesVerifiedPhotos = true;
      if (plotVerifiedPhotos) {
        matchesVerifiedPhotos = plot.image !== '';
      }

      // 17. Plot Shape Filters - rectangular vs square vs irregular
      let matchesShape = true;
      if (plotShapeSelection !== 'All') {
        matchesShape = plot.details.toLowerCase().includes(plotShapeSelection.toLowerCase()) || (plotShapeSelection === 'Square' && plot.area.includes('1500')) || (plotShapeSelection === 'Rectangular' && plot.area.includes('1700'));
      }

      // 18. Gated Community Features - Security, Compound wall, Clubhouse, Street lights, Internal roads, Garden
      let matchesGatedSecurity = true;
      if (plotGatedSecurity) {
        matchesGatedSecurity = plot.features.some(f => f.toLowerCase().includes('guard') || f.toLowerCase().includes('security') || f.toLowerCase().includes('secured')) || plot.details.toLowerCase().includes('gated');
      }
      let matchesGatedCompound = true;
      if (plotGatedCompoundWall) {
        matchesGatedCompound = plot.features.some(f => f.toLowerCase().includes('compound') || f.toLowerCase().includes('wall')) || plot.details.toLowerCase().includes('compound') || plot.boundaryWall === 'Constructed';
      }
      let matchesGatedPromoClub = true;
      if (plotGatedClubhouse) {
        matchesGatedPromoClub = plot.features.some(f => f.toLowerCase().includes('club') || f.toLowerCase().includes('jogging') || f.toLowerCase().includes('children')) || plot.details.toLowerCase().includes('township');
      }
      let matchesGatedStreetLights = true;
      if (plotGatedStreetLights) {
        matchesGatedStreetLights = plot.features.some(f => f.toLowerCase().includes('street') || f.toLowerCase().includes('light')) || plot.details.toLowerCase().includes('lighting');
      }
      let matchesGatedInternalRoads = true;
      if (plotGatedInternalRoads) {
        matchesGatedInternalRoads = plot.features.some(f => f.toLowerCase().includes('road') || f.toLowerCase().includes('internal')) || plot.details.toLowerCase().includes('asphalt');
      }
      let matchesGatedGarden = true;
      if (plotGatedGarden) {
        matchesGatedGarden = plot.features.some(f => f.toLowerCase().includes('garden') || f.toLowerCase().includes('tree') || f.toLowerCase().includes('park'));
      }

      // 19. Posted Time
      let matchesPostedTime = true;
      if (plotPostedTime !== 'All') {
        matchesPostedTime = plot.id.includes('1') || plot.id.includes('3') || plot.id.includes('5') || plot.id.includes('7'); // simulate dynamic temporal splits
      }

      // 20. AI Smart Filters:
      // “Best investment plots”, “Future growth areas”, “High appreciation zones”, “Low-risk legal plots”
      let matchesAiSmart = true;
      if (plotAiBestInvestment) {
        matchesAiSmart = plot.numericPrice <= 4000000 && plot.verified;
      }
      if (plotAiFutureGrowth) {
        matchesAiSmart = matchesAiSmart && (plot.details.toLowerCase().includes('upcoming') || plot.distanceToHighway.toLowerCase().includes('km'));
      }
      if (plotAiHighAppreciation) {
        matchesAiSmart = matchesAiSmart && (plot.plotType === 'Commercial' || plot.price.includes('Cr') || plot.numericPrice >= 5000000);
      }
      if (plotAiLowRiskLegal) {
        matchesAiSmart = matchesAiSmart && (plot.verified && plot.reraStatus.includes('RERA'));
      }

      return matchesCity && matchesType && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCollection &&
        matchesArea && matchesLandmark && matchesPincode && matchesNearHighway && matchesNearMetro && matchesNearAirport && matchesNearIndustrial && matchesNearRingRoad &&
        matchesAdvancedPriceMin && matchesAdvancedPriceMax && matchesPricePerSqFt && matchesPricePerAcre &&
        matchesSize && matchesTypeSelection && matchesOwnership && matchesLegal && matchesFacing &&
        matchesRoadCorner && matchesRoadMainTouch && matchesRoadInternal && matchesRoadWidthLevel &&
        matchesBoundaryWall && matchesFrontage && matchesDimensionsSpec &&
        matchesNearSchool && matchesNearHospital && matchesNearItPark && matchesDevStatus &&
        matchesUtilityWater && matchesUtilityElectricity && matchesUtilityDrainage && matchesUtilitySewage &&
        matchesAppreciation && matchesUpcomingInfra && matchesHighRoi && matchesFastDeveloping &&
        matchesPossession && matchesSeller && matchesVerifiedDocs && matchesVerifiedLocation && matchesVerifiedOwnership && matchesVerifiedPhotos &&
        matchesShape && matchesGatedSecurity && matchesGatedCompound && matchesGatedPromoClub && matchesGatedStreetLights && matchesGatedInternalRoads && matchesGatedGarden &&
        matchesPostedTime && matchesAiSmart;
    });
  }, [
    searchQuery, cityFilter, typeFilter, minPrice, maxPrice, selectedCollection,
    plotFilterArea, plotFilterLandmark, plotFilterPincode,
    plotNearHighway, plotNearMetro, plotNearAirport, plotNearIndustrial, plotNearRingRoad,
    plotPriceMin, plotPriceMax, plotPricePerSqFtMax, plotPricePerAcreMax, plotShowEmiEstimate, plotQuickRange,
    plotSizeMin, plotSizeMax, plotSizeUnit,
    plotTypeSelection, plotOwnershipSelection,
    plotLegalRera, plotLegalNa, plotLegalApprovedLayout, plotLegalClearTitle,
    plotLegalBankApproved, plotLegalRegistryReady, plotLegalEncumbranceFree, plotLegalMutationCompleted,
    plotFacingDirection,
    plotRoadCorner, plotRoadMainTouch, plotRoadInternal, plotRoadWidthMax,
    plotHasBoundaryWall, plotFrontageWidthMin, plotDimensionsSpec,
    plotNearSchool, plotNearHospital, plotNearItPark,
    plotDevelopmentStatus,
    plotUtilityWater, plotUtilityElectricity, plotUtilityDrainage, plotUtilitySewage,
    plotInvestmentAppreciation, plotInvestmentUpcomingInfra, plotInvestmentHighRoi, plotInvestmentFastDeveloping,
    plotPossessionStatus, plotSellerType,
    plotVerifiedDocuments, plotVerifiedLocation, plotVerifiedOwnership, plotVerifiedPhotos,
    plotShapeSelection,
    plotGatedSecurity, plotGatedCompoundWall, plotGatedClubhouse, plotGatedStreetLights, plotGatedInternalRoads, plotGatedGarden,
    plotPostedTime,
    plotAiBestInvestment, plotAiFutureGrowth, plotAiHighAppreciation, plotAiLowRiskLegal
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const openPlotDetail = (plot: PlotProperty) => {
    setLoadingIntel(true);
    setTimeout(() => {
      setSelectedPlot(plot);
      setInquiryMessage(`Hi, I am interested in your listing "${plot.title}" in ${plot.locality}. Please send more details.`);
      setLoadingIntel(false);
    }, 400); 
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      alert("Please fill out your name and contact phone number to request Plots More Intel.");
      return;
    }
    setShowInquirySuccess(true);
    setTimeout(() => {
      setShowInquirySuccess(false);
      setSelectedPlot(null);
      setInquiryName('');
      setInquiryPhone('');
    }, 3000);
  };

  // Quick preset price filter change handler
  const setPricePreset = (preset: 'budget' | 'mid' | 'premium' | 'all') => {
    if (preset === 'budget') {
      setMinPrice('');
      setMaxPrice(3000000); // Up to 30 L
    } else if (preset === 'mid') {
      setMinPrice(3000000);
      setMaxPrice(10000000); // 30L to 1 Cr
    } else if (preset === 'premium') {
      setMinPrice(10000000); // 1 Cr+
      setMaxPrice('');
    } else {
      setMinPrice('');
      setMaxPrice('');
    }
  };

  // 5 mockup properties layout as shown on the literal diagram
  const literalMockupPlots = PLOT_LISTINGS.slice(0, 5);

  return (
    <div className="bg-[#F9FBFC] min-h-screen">
      {/* Search Layout Stage (Matches mockup exactly) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-10 font-sans space-y-12">
        
        {/* Back Navigation Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#b38330] transition-all uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#b38330]" /> Back to home
          </button>
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" /> PREMIUM PLOTS INVESTMENT REGISTRY
          </div>
        </div>

        {/* Tab selection gold bar row exactly matching screenshot */}
        <div className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-100">
          <div className="bg-[#b38330] rounded-t-2xl flex flex-wrap pt-2 px-3">
            {(['Buy', 'Sell', 'Rent', 'Plots', 'PG/Co-Living'] as TabType[]).map((tab) => {
              const isSelected = tab === 'Plots';
              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (onTabChange) {
                      onTabChange(tab);
                    }
                  }}
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

          {/* Search Input bar container with Deep Navy background exactly matching screenshot */}
          <div className="bg-[#0E1F35] p-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input Box */}
              <div className="relative w-full flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[2.5]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Locality, Landmark, project or builder"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-4 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Button styled in grey capsule matching screenshot */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#c0c4cc] hover:bg-white text-slate-950 font-bold uppercase text-xs sm:text-sm px-10 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm border border-slate-300"
              >
                Search
              </button>
            </form>

            {/* Quick & Advanced Filters Pill Bar */}
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
                  className="bg-[#132640] border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                >
                  <option value="All" className="text-slate-900 bg-white">All Cities</option>
                  <option value="Ranchi" className="text-slate-900 bg-white font-semibold">Ranchi</option>
                  <option value="Nagpur" className="text-slate-900 bg-white font-semibold">Nagpur</option>
                  <option value="Raipur" className="text-slate-900 bg-white font-semibold">Raipur</option>
                  <option value="Bengaluru" className="text-slate-900 bg-white font-semibold">Bengaluru</option>
                  <option value="Pune" className="text-slate-900 bg-white font-semibold">Pune</option>
                  <option value="Mumbai" className="text-slate-900 bg-white font-semibold">Mumbai</option>
                </select>
              </div>

              {/* Plot Zoning */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Zoning</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#132640] border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                >
                  <option value="All" className="text-slate-900 bg-white">All Zonings</option>
                  <option value="Residential" className="text-slate-900 bg-white">Residential</option>
                  <option value="Commercial" className="text-slate-900 bg-white">Commercial</option>
                  <option value="Gated Township" className="text-slate-900 bg-white">Gated Township</option>
                  <option value="Industrial" className="text-slate-900 bg-white">Industrial</option>
                </select>
              </div>

              {/* Price Preset */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Budget</span>
                <select
                  value={
                    minPrice === '' && maxPrice === 3000000 ? 'budget' :
                    minPrice === 3000000 && maxPrice === 10000000 ? 'mid' :
                    minPrice === 10000000 && maxPrice === '' ? 'premium' : 'all'
                  }
                  onChange={(e) => setPricePreset(e.target.value as any)}
                  className="bg-[#132640] border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-bold"
                >
                  <option value="all" className="text-slate-900 bg-white">All Budgets</option>
                  <option value="budget" className="text-slate-900 bg-white">Under 30 Lacs</option>
                  <option value="mid" className="text-slate-900 bg-white">30L to 1 Cr</option>
                  <option value="premium" className="text-slate-900 bg-white">Above 1 Cr</option>
                </select>
              </div>

              {/* Advanced Filters Button Trigger */}
              <button
                type="button"
                onClick={() => setShowAdvancedFiltersModal(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm cursor-pointer ml-1"
              >
                <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
                <span>Advanced Filters</span>
                {countActivePlotFilters > 0 && (
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white border border-amber-400 select-none animate-bounce">
                    {countActivePlotFilters}
                  </span>
                )}
              </button>

              {/* Reset shortcut */}
              {(cityFilter !== 'All' || typeFilter !== 'All' || minPrice !== '' || maxPrice !== '' || searchQuery !== '' || selectedCollection !== null || countActivePlotFilters > 0) && (
                <button
                  onClick={resetAllPlotFilters}
                  className="text-amber-400 hover:text-white text-[11px] font-black underline uppercase ml-auto animate-fadeIn"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Styled Centered Geolocation check-via-map button as requested */}
        <div className="w-full flex justify-center py-4 animate-fadeIn">
          <button
            type="button"
            onClick={() => setShowPlotsMapModal(true)}
            className="bg-[#0E1F35] hover:bg-[#b38330] hover:shadow-[#b38330]/20 active:scale-95 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-3 border-2 border-[#b38330]/80 group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <Map className="w-5 h-5 text-amber-500 animate-pulse stroke-[2.5]" />
            <span>Check via Map</span>
          </button>
        </div>

        {showPlotsMapModal && (
          <div 
            className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex animate-fadeIn cursor-pointer ${
              isMapFullscreen ? 'items-stretch justify-stretch p-0' : 'items-center justify-center p-4'
            }`}
            onClick={() => {
              setShowPlotsMapModal(false);
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
                      Interactive Plots Map & Geolocation Vetting
                    </h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">Tap local coordinates to scan land & plots registry in verified Indian zones</p>
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
                      setShowPlotsMapModal(false);
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
                          const cityListings = getMapPlotsResultsWithCoordinates(city);
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
                              const cityListings = getMapPlotsResultsWithCoordinates(city);
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
                            <rect width="100%" height="100%" fill="url(#grid-plot-sh)" strokeWidth="0" />
                            <defs>
                              <pattern id="grid-plot-sh" width="40" height="40" patternUnits="userSpaceOnUse">
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
                        {getMapPlotsResultsWithCoordinates(activeMapCity).slice(0, 6).map((item, index) => {
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
                          defaultCenter={CITY_COORDINATES[activeMapCity] || { lat: 21.2514, lng: 81.6296 }}
                          defaultZoom={12}
                          mapId="DEMO_MAP_ID"
                          className="w-full h-full"
                        >
                          {getMapPlotsResultsWithCoordinates(activeMapCity).slice(0, 6).map((item) => {
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
                        className="text-[#b38330] hover:text-[#a37424] font-black flex items-center gap-1 cursor-pointer"
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
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Vetted Land registry
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
                          <span className="block text-[9px] text-[#b38330] font-mono uppercase font-black">Dimensions Area</span>
                          <strong className="text-slate-800 font-extrabold text-[11px] uppercase">{selectedMapListing.area}</strong>
                        </div>
                        <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-left shadow-xs">
                          <span className="block text-[9px] text-emerald-600 font-mono uppercase font-black">Zoning Type</span>
                          <strong className="text-slate-800 font-extrabold text-[11px] uppercase">{selectedMapListing.plotType}</strong>
                        </div>
                      </div>

                      <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Road width & boundary details</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                            Road: {selectedMapListing.roadWidth}
                          </span>
                          <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                            Facing: {selectedMapListing.facing}
                          </span>
                          <span className="bg-slate-100 text-[#0E1F35] text-[9px] font-black px-2.5 py-1 rounded-lg select-none border border-slate-150">
                            Legal: {selectedMapListing.reraStatus}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onPropertyClick(selectedMapListing);
                          setShowPlotsMapModal(false);
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
                      <p className="text-xs font-bold uppercase tracking-wider">No Plots Loaded in This City</p>
                      <p className="text-[10px] mt-1 max-w-[170px] font-medium leading-relaxed">Choose another metropolis to explore premium housing coordinates.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plot Collections showcase section */}
        <section className="pt-4 select-none animate-fadeIn">
          <div className="text-left mb-6">
            <h3 className="text-2xl sm:text-3xl font-normal text-slate-800 tracking-tight">
              Plot <span className="font-extrabold text-[#0E1F35]">Collections</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Exclusive showcase of categorized plots
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                id: 'corner',
                title: 'Corner Plots',
                image: plotCollCorner,
                bgClass: 'bg-indigo-50/50 hover:border-indigo-350',
                activeBorder: 'border-indigo-600 ring-4 ring-indigo-600/10',
                isActive: selectedCollection === 'corner',
                onClick: () => {
                  if (selectedCollection === 'corner') {
                    setSelectedCollection(null);
                  } else {
                    setSelectedCollection('corner');
                    setTimeout(() => {
                      document.getElementById('plots-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              },
              {
                id: 'boundary',
                title: 'Boundary Wall Plots',
                image: plotCollBoundary,
                bgClass: 'bg-pink-50/50 hover:border-pink-350',
                activeBorder: 'border-pink-500 ring-4 ring-pink-500/10',
                isActive: selectedCollection === 'boundary',
                onClick: () => {
                  if (selectedCollection === 'boundary') {
                    setSelectedCollection(null);
                  } else {
                    setSelectedCollection('boundary');
                    setTimeout(() => {
                      document.getElementById('plots-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              },
              {
                id: 'east',
                title: 'East Facing Plots',
                image: plotCollEast,
                bgClass: 'bg-amber-50/50 hover:border-amber-350',
                activeBorder: 'border-amber-500 ring-4 ring-amber-500/10',
                isActive: selectedCollection === 'east',
                onClick: () => {
                  if (selectedCollection === 'east') {
                    setSelectedCollection(null);
                  } else {
                    setSelectedCollection('east');
                    setTimeout(() => {
                      document.getElementById('plots-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              },
              {
                id: 'budget',
                title: 'Below ₹30Lakhs Plots',
                image: plotCollBudget,
                bgClass: 'bg-emerald-50/50 hover:border-emerald-350',
                activeBorder: 'border-emerald-500 ring-4 ring-emerald-500/10',
                isActive: selectedCollection === 'budget',
                onClick: () => {
                  if (selectedCollection === 'budget') {
                    setSelectedCollection(null);
                  } else {
                    setSelectedCollection('budget');
                    setTimeout(() => {
                      document.getElementById('plots-explorer-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              }
            ].map((col) => (
              <button
                key={col.id}
                onClick={col.onClick}
                className={`group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border-2 text-left cursor-pointer focus:outline-none flex flex-col justify-between ${
                  col.isActive 
                    ? col.activeBorder 
                    : `border-slate-100 ${col.bgClass}`
                }`}
              >
                {/* Content Header Text matching layout */}
                <div className="p-4 sm:p-5 z-10 w-full">
                  <h4 className="text-slate-950 font-extrabold text-base sm:text-lg tracking-tight leading-tight max-w-[150px]">
                    {col.title}
                  </h4>
                </div>

                {/* Cover graphic representing plot layout */}
                <div className="h-28 sm:h-32 w-full mt-auto relative overflow-hidden bg-slate-50 border-t border-slate-100">
                  <img 
                    src={col.image} 
                    alt={col.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle fade overlay in bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                {/* Tiny selection badge indicator */}
                {col.isActive && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 p-1 rounded-full text-[10px] font-black shadow-md flex items-center justify-center animate-bounce">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Polular Plots for investment shelf (Direct translation of user uploaded mockup diagram) */}
        <div className="space-y-6 pt-2 select-none mb-12">
          
          {/* Header row exactly matching screenshot */}
          <div className="flex justify-between items-end border-b border-gray-150 pb-3">
            <h3 className="text-xl sm:text-2.5xl font-extrabold text-[#0E1F35] tracking-tight">
              Polular Plots for investment
            </h3>
            
            <button 
              onClick={() => {
                const element = document.getElementById('plots-explorer-anchor');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#b38330] hover:text-[#9c6a1d] font-extrabold text-xs sm:text-sm transition-colors cursor-pointer select-none whitespace-nowrap"
            >
              See more :-
            </button>
          </div>

          {/* 5 Cards matching mockup layout exactly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {literalMockupPlots.map((plot) => (
              <div 
                key={plot.id} 
                className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-colors group relative cursor-pointer font-sans"
                onClick={() => openPlotDetail(plot)}
              >
                {/* Gray Top Placeholder Area representing image or real estate ground */}
                <div className="h-[145px] bg-[#E1E4E8] border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={plot.image} 
                    alt={plot.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Verified tag */}
                  {plot.verified && (
                    <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                      <CheckCircle className="w-2.5 h-2.5 stroke-[3]" /> Title Checked
                    </span>
                  )}
                  {/* Zoning Pill */}
                  <span className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    {plot.plotType}
                  </span>
                </div>
                
                {/* Bottom Text Area matching screenshot layout closely */}
                <div className="p-4 flex flex-col justify-between flex-grow relative text-left bg-transparent">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-[125px]">
                        {plot.locality.split(',')[0]}
                      </h4>
                      <span className="text-[9px] bg-slate-100 text-[#b38330] font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {plot.area} sqft
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                      {plot.title}
                    </h4>
                    <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">{plot.price}</p>
                    <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {plot.city}
                    </p>
                  </div>

                  {/* Pill Shaped "More Intel" Button at Bottom Right as per screenshot */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlotDetail(plot);
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

          {/* Embedded Advertisements Section - Placed after 3 rows of the page */}
          <div className="py-2">
            <AdsSection />
          </div>

          {/* "Last 13+ Years Of Real-estate Experience" block with custom growth arrow as per screenshot */}
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
            
            <div className="z-10 flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 self-end md:self-auto min-w-[120px]">
              <div className="w-12 h-12 bg-[#b38330] rounded-full flex items-center justify-center animate-pulse shadow-md">
                <div className="relative">
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

        {/* Anchor point for the interactive list explorer containing all 50+ properties */}
        <div id="plots-explorer-anchor" className="border-t border-gray-200 pt-10 scroll-mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-100 text-[#9e7025] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
                  Interactive Plot Database Explorer
                </span>
                <span className="text-xs bg-[#0E1F35] text-white font-bold px-2 py-0.5 rounded-full">
                  50+ Total Plots
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E1F35] mt-2 tracking-tight">
                Explore Available Premium Land Parcels ({filteredListings.length} matching found)
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">
                Use top search inputs, quick budgets to slide, slice, and investigate title-checked lands
              </p>
            </div>

            {/* Clear and filter triggers */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowAdvancedFiltersModal(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm cursor-pointer ml-1"
              >
                <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
                <span>Advanced Filters</span>
                {countActivePlotFilters > 0 && (
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white border border-amber-400 select-none animate-bounce">
                    {countActivePlotFilters}
                  </span>
                )}
              </button>
              {(searchQuery || cityFilter !== 'All' || typeFilter !== 'All' || minPrice !== '' || maxPrice !== '' || countActivePlotFilters > 0) && (
                <button
                  onClick={resetAllPlotFilters}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-red-200 cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Interactive Plots Grid of 50+ listings */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-gray-200 max-w-2xl mx-auto">
              <Grid className="w-12 h-12 text-gray-400 mx-auto mb-3 stroke-[1.2]" />
              <p className="text-gray-800 text-base font-bold">No plots fit your current filter parameters</p>
              <p className="text-gray-400 text-xs mt-1.5 mb-5 font-medium">Try resetting your budget slider or searching with broader generic terms.</p>
              <button
                onClick={resetAllPlotFilters}
                className="bg-[#0E1F35] text-white hover:bg-[#b58632] font-extrabold text-xs px-5 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredListings.map((plot) => (
                <div 
                  key={plot.id} 
                  className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden flex flex-col justify-between h-[300px] shadow-xs hover:shadow-md hover:border-[#b38330] transition-colors group relative cursor-pointer font-sans"
                  onClick={() => openPlotDetail(plot)}
                >
                  
                  {/* Aspect Plot Image Box */}
                  <div className="relative h-[145px] shrink-0 bg-[#E1E4E8] overflow-hidden">
                    <img 
                      src={plot.image} 
                      alt={plot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Top badged statuses */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 animate-fadeIn">
                      {plot.verified && (
                        <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                          <CheckCircle className="w-2.5 h-2.5 stroke-[3]" /> Title Checked
                        </span>
                      )}
                    </div>
                    {/* Zoning pill */}
                    <span className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {plot.plotType}
                    </span>
                  </div>

                  {/* Body stats */}
                  <div className="p-4 flex flex-col justify-between flex-grow text-left relative">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-500 truncate max-w-[125px]">
                          {plot.locality.split(',')[0]}
                        </h4>
                        <span className="text-[9px] bg-slate-100 text-[#b38330] font-extrabold px-1.5 py-0.5 rounded uppercase">
                          {plot.area} sqft
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-black text-slate-950 group-hover:text-[#b38330] transition-colors leading-tight line-clamp-1 mt-0.5">
                        {plot.title}
                      </h4>
                      <p className="text-[15px] font-black text-[#0D1F34] mt-0.5">
                        {plot.price}
                      </p>
                      <p className="text-[11px] text-[#b38330] font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {plot.city}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlotDetail(plot);
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

      </div>

      {/* Loading overlay loader while fetching Intel */}
      {loadingIntel && (
        <div className="fixed inset-0 bg-[#0E1F35]/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl py-6 px-10 border border-slate-100 shadow-2xl text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#0E1F35] border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-[#0E1F35] text-xs font-extrabold tracking-wider uppercase">Fetching Land Registry Title indexes...</p>
          </div>
        </div>
      )}

      {/* Modern Detailed Modal View for Plot Intel */}
      {selectedPlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal sticky head */}
            <div className="bg-[#0E1F35] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5.5 h-5.5 text-amber-400" />
                <div>
                  <h3 className="text-md sm:text-lg font-black tracking-tight">{selectedPlot.title}</h3>
                  <p className="text-[10px] text-gray-300 font-semibold uppercase">{selectedPlot.city} Verified Land Registry</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedPlot(null)}
                className="text-white/75 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal scrollable body context */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-grow text-left">
              
              {/* Plot Image overview stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                <div className="rounded-xl overflow-hidden h-48 sm:h-auto min-h-48 bg-slate-100 relative">
                  <img 
                    src={selectedPlot.image} 
                    alt={selectedPlot.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedPlot.verified && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded shadow">
                      VERIFIED INDEPENDENT TITLE
                    </span>
                  )}
                </div>

                {/* Key Plot metrics details */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-700 font-extrabold px-2.5 py-1 rounded tracking-wide uppercase">
                      ZONED: {selectedPlot.plotType}
                    </span>
                    
                    <div className="pt-1.5">
                      <span className="text-gray-400 text-xs font-semibold block">Registry Valuation Cost:</span>
                      <span className="text-2xl font-black text-[#0E1F35]">{selectedPlot.price}</span>
                    </div>

                    <div className="pt-1 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold block">Total Plot Area:</span>
                        <span className="text-gray-800 font-black">{selectedPlot.area} sqft</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block">Facing Vector:</span>
                        <span className="text-gray-800 font-black">{selectedPlot.facing} Direction</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 text-xs flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2 rounded">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[10px]">Title status: {selectedPlot.reraStatus}</span>
                  </div>
                </div>
              </div>

              {/* Specs detailed table */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#0E1F35] border-b border-gray-100 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <Info className="w-4 h-4 text-[#c29b53]" /> Plot Land Specifications
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">Frontage Lane Width:</span>
                    <span className="text-gray-800 font-extrabold">{selectedPlot.roadWidth} asphalt carpet lane</span>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">Boundary Walls:</span>
                    <span className="text-gray-800 font-extrabold">{selectedPlot.boundaryWall}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">Distance to Local Highway:</span>
                    <span className="text-gray-800 font-extrabold">{selectedPlot.distanceToHighway}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">Water Sump Availability:</span>
                    <span className="text-gray-800 font-extrabold">{selectedPlot.waterAvailability}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">Assigned Land Owner:</span>
                    <span className="text-gray-800 font-extrabold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-500" /> {selectedPlot.ownerName}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-gray-400 font-semibold block">NOC Clearance Level:</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> 100% Tax Cleared
                    </span>
                  </div>
                </div>
              </div>

              {/* Rich Narrative text */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block">Verbatim Land Records:</span>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#f3f4f6] p-3 rounded-lg italic border-l-4 border-[#0E1F35]">
                  "{selectedPlot.details}"
                </p>
              </div>

              {/* Custom features bullets */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block">Internal Infra Features:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPlot.features.map((feature, idx) => (
                    <span key={idx} className="bg-amber-500/10 text-[#a67526] text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-500/20">
                      ✔ {feature}
                    </span>
                  ))}
                  <span className="bg-blue-500/10 text-blue-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-blue-500/20">
                    ✔ Ready to Transfer Deed
                  </span>
                  <span className="bg-[#0E1F35]/10 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-slate-500/15">
                    ✔ Bank Appraisal Arranged
                  </span>
                </div>
              </div>

              {/* Inquiry Form box */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <h4 className="text-sm font-extrabold text-[#0E1F35] mb-3 flex items-center gap-1.5 uppercase">
                  <Phone className="w-4 h-4 text-amber-500" /> Request Title Deeds & Owner Verification Intel
                </h4>

                {showInquirySuccess ? (
                  <div className="bg-emerald-50 border border-emerald-250 rounded-lg p-5 text-center text-emerald-800 animate-fadeIn">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-bold">Inquiry Sent Successfully!</p>
                    <p className="text-[11px] text-emerald-600 mt-1">Our land titles attorney specialists have received your query for ID: <strong>{selectedPlot.id}</strong>. We will contact you at <strong>{inquiryPhone}</strong> shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Full Name:</label>
                        <input 
                          type="text" 
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="e.g. Adam Steve"
                          className="w-full bg-white text-xs p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Contact Number:</label>
                        <input 
                          type="text" 
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="e.g. +91 91091 23456"
                          className="w-full bg-white text-xs p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Inquiry Memo Notes:</label>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full bg-white text-xs p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Direct Land Custodian</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{selectedPlot.ownerContact}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 select-none">
                        <a
                          href={`https://api.whatsapp.com/send?phone=919850843447&text=${encodeURIComponent(`Hi, I am interested in your plots listing "${selectedPlot.title}" (${selectedPlot.id}) in ${selectedPlot.locality} RERA zone. Please share the Title Deeds and registered map on WhatsApp.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm border border-emerald-500/10"
                        >
                          <svg className="w-3.5 h-3.5 fill-current animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                          </svg>
                          <span>WhatsApp Desk</span>
                        </a>
                        <button
                          type="submit"
                          className="bg-[#0E1F35] hover:bg-[#b58632] text-white font-extrabold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow-md transition-all cursor-pointer border border-[#0E1F35]"
                        >
                          Submit Intel Request
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Modal Footer sticky close bar */}
            <div className="bg-slate-150 p-4 shrink-0 border-t border-gray-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlot(null)}
                className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-extrabold text-xs px-5 py-2 rounded uppercase tracking-wide cursor-pointer transition-colors"
              >
                Close View
              </button>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#b38330] rounded-xl flex items-center justify-center shadow-md">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Vett-Ready Plot Discovery Engine
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
                      Alpha Matrix
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">
                    Interactive compliance & capability profiling matrix • Nagpur Corridor Edition
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
            <div className="bg-slate-55 border-b border-gray-200 p-2 overflow-x-auto flex gap-1 scrollbar-hide shrink-0">
              {[
                { label: "📍 Location & 💰 Budget", hint: "Corridors, Price indices", index: 0 },
                { label: "📏 Size & 🏗️ Land Type", hint: "Units, Zoning Profile", index: 1 },
                { label: "⚖️ Legal & 🧭 Vastu facing", hint: "RERA approvals, Directional", index: 2 },
                { label: "🛣️ Access & 🏗️ Status", hint: "Road widths, Development", index: 3 },
                { label: "🌟 AI presets & 🏡 Community", hint: "Utility grids, ROI projections", index: 4 }
              ].map((tab) => {
                const isActive = activeFilterCategoryTab === tab.index;
                return (
                  <button
                    key={tab.index}
                    type="button"
                    onClick={() => setActiveFilterCategoryTab(tab.index)}
                    className={`flex flex-col items-start px-4 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer min-w-[130px] sm:min-w-[170px] ${
                      isActive 
                        ? 'bg-[#0E1F35] text-white shadow-md shadow-slate-900/10' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-black tracking-tight">{tab.label}</span>
                    <span className={`text-[9px] mt-0.5 font-medium uppercase tracking-wide tracking-wider mt-0.5 block ${isActive ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold'}`}>
                      {tab.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Center Form Content */}
            <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-grow text-left bg-[#F8FAFC]">
              
              {activeFilterCategoryTab === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Category 1: Location Filters */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#b38330]" /> 1. Location & Geo Corridors
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Area / Locality:</label>
                        <input
                          type="text"
                          value={plotFilterArea}
                          onChange={(e) => setPlotFilterArea(e.target.value)}
                          placeholder="e.g. Helal Road, Besa"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-350 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Landmark Neighbor:</label>
                        <input
                          type="text"
                          value={plotFilterLandmark}
                          onChange={(e) => setPlotFilterLandmark(e.target.value)}
                          placeholder="e.g. IT Junction, VCA Stadium"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-350 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pincode:</label>
                        <input
                          type="text"
                          value={plotFilterPincode}
                          onChange={(e) => setPlotFilterPincode(e.target.value)}
                          placeholder="e.g. 440015"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-355 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                    </div>

                    {/* Proximity Checkboxes */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-2">Smart Corridor Additions:</span>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { id: 'near-hwy', label: 'Near Highway Touch', state: plotNearHighway, setter: setPlotNearHighway },
                          { id: 'near-metro', label: 'Near Upcoming Metro Corridor', state: plotNearMetro, setter: setPlotNearMetro },
                          { id: 'near-air', label: 'Near Airport Expressway', state: plotNearAirport, setter: setPlotNearAirport },
                          { id: 'near-ind', label: 'Near MIDC/Industrial Sector', state: plotNearIndustrial, setter: setPlotNearIndustrial },
                          { id: 'near-ring', label: 'Near outer Ring Road Bypass', state: plotNearRingRoad, setter: setPlotNearRingRoad }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => item.setter(!item.state)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                              item.state 
                                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm' 
                                : 'bg-slate-50 text-slate-705 hover:bg-slate-100 border-slate-205'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.state}
                              readOnly
                              className="accent-amber-900 pointer-events-none"
                            />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Interactive Blueprint Mapping Module */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#b38330]" /> Interactive Gated Perimeter Modellers
                      </span>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase tracking-wider shrink-0">
                        Simulation Mode
                      </span>
                    </h4>

                    {/* Controls Row */}
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPlotDrawArea(!plotDrawArea);
                          if (!plotDrawArea) {
                            setPlotBoundaryMap(false);
                            setPlotSatelliteView(false);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                          plotDrawArea 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                            : 'bg-slate-50 text-indigo-700 hover:bg-indigo-100/50 border-indigo-200/50'
                        }`}
                      >
                        📐 Draw Custom Boundary Search
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPlotBoundaryMap(!plotBoundaryMap);
                          if (!plotBoundaryMap) {
                            setPlotDrawArea(false);
                            setPlotSatelliteView(false);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                          plotBoundaryMap 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                            : 'bg-slate-50 text-emerald-700 hover:bg-emerald-100/50 border-emerald-200/50'
                        }`}
                      >
                        🗺️ Highlight Stone Plot Boundaries
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPlotSatelliteView(!plotSatelliteView);
                          if (!plotSatelliteView) {
                            setPlotDrawArea(false);
                            setPlotBoundaryMap(false);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                          plotSatelliteView 
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                            : 'bg-slate-50 text-amber-700 hover:bg-amber-100/50 border-amber-200/50'
                        }`}
                      >
                        🛰️ Toggle Orthomosaic Satellite Map
                      </button>
                    </div>

                    {/* Interactive Mock Mapping Canvas */}
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center bg-slate-100">
                      {plotSatelliteView ? (
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200')` }}>
                          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xs" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-[#0d1421] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
                      )}

                      {/* Floating Vector Markers */}
                      <div className="z-10 text-center p-4">
                        {plotDrawArea && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="inline-block bg-indigo-500/90 text-white text-[10px] font-black px-3 py-1 rounded shadow-md uppercase tracking-wider animate-pulse">
                              ✍️ BOUNDING GEOMETRY IN PROGRESS...
                            </span>
                            <p className="text-white text-xs font-bold font-mono">Simulated 4.5 Acre selection coordinates generated</p>
                          </div>
                        )}
                        {plotBoundaryMap && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="inline-block bg-emerald-500/95 text-white text-[10px] font-black px-3 py-1 rounded shadow-md uppercase tracking-wider">
                              🟢 Delineated Corner Stones Plotted
                            </span>
                            <p className="text-emerald-300 text-xs font-extrabold font-mono">100% boundary coordinates match Ranchi Land Registrar indices</p>
                          </div>
                        )}
                        {plotSatelliteView && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="inline-block bg-amber-500/95 text-slate-950 text-[10px] font-black px-3 py-1 rounded shadow-md uppercase tracking-wider animate-bounce">
                              🛰️ SATELLITE RADAR MULTISPECTRAL ACTIVE
                            </span>
                            <p className="text-amber-200 text-xs font-bold font-mono">Showing raw organic foliage index & access widths</p>
                          </div>
                        )}
                        {!plotDrawArea && !plotBoundaryMap && !plotSatelliteView && (
                          <div className="space-y-1.5">
                            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-amber-500 animate-pulse">
                              <Map className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-xs font-extrabold uppercase tracking-wide">Spatial Compliance Mapping Engine</p>
                            <p className="text-slate-500 text-[10px] max-w-sm mx-auto font-medium">Toggle custom search bounds, boundary highlights, or orthomosaic satellite mapping to preview layout constraints.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Pricing indices */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#b38330]" /> 2. Dual-Layer Budget Filters
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min Budget (₹):</label>
                        <input
                          type="number"
                          value={plotPriceMin}
                          onChange={(e) => setPlotPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 1000000"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Max Budget (₹):</label>
                        <input
                          type="number"
                          value={plotPriceMax}
                          onChange={(e) => setPlotPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 5000000"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Max Price / Sq.ft Limit:</label>
                        <input
                          type="number"
                          value={plotPricePerSqFtMax}
                          onChange={(e) => setPlotPricePerSqFtMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 1500"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Max Price / Acre Limit:</label>
                        <input
                          type="number"
                          value={plotPricePerAcreMax}
                          onChange={(e) => setPlotPricePerAcreMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 2500000"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                    </div>

                    {/* EMI Calculator */}
                    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[11px] font-black text-[#5e4110] uppercase flex items-center gap-1">
                          🧮 SBI Land Registry Loan EMI Estimator
                        </span>
                        <p className="text-[10px] text-gray-500 font-semibold">Calculate simulated monthly mortgage layout based on SBI land purchase lending benchmarks.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPlotShowEmiEstimate(!plotShowEmiEstimate)}
                        className={`text-xs font-black px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                          plotShowEmiEstimate 
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-205'
                        }`}
                      >
                        {plotShowEmiEstimate ? '🟢 Estimator Tool Hooked' : '⚫ Toggle EMI Calculator'}
                      </button>
                    </div>

                    {plotShowEmiEstimate && (
                      <div className="bg-amber-500/10 p-4 rounded-xl text-xs space-y-1 animate-fadeIn border-l-4 border-amber-500 text-[#4c3408] font-bold">
                        <p className="font-extrabold text-amber-950">Instant Real-Estate Simulation Engine:</p>
                        <p className="font-semibold text-amber-900 leading-snug">Based on <strong>8.4% standard housing mortgage rates</strong>, a plot purchase in रांची corridor evaluated at ₹ 25 Lacs translates to a monthly repayment of roughly <strong>₹ 18,340/mo</strong> spans 15 years.</p>
                      </div>
                    )}

                    {/* Quick Ranges */}
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-2">Quick Budget Ranges Shortcuts:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Under ₹ 10L', min: 0, max: 1000000, id: 'range-1' },
                          { label: '₹ 10L – ₹ 25L', min: 1000000, max: 2500000, id: 'range-2' },
                          { label: '₹ 25L – ₹ 50L', min: 2500000, max: 5000000, id: 'range-3' },
                          { label: '₹ 50L+', min: 5000000, max: 999999999, id: 'range-4' }
                        ].map((range) => {
                          const isSelected = plotPriceMin === range.min && plotPriceMax === range.max;
                          return (
                            <button
                              key={range.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setPlotPriceMin('');
                                  setPlotPriceMax('');
                                } else {
                                  setPlotPriceMin(range.min);
                                  setPlotPriceMax(range.max);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white shadow' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-805'
                              }`}
                            >
                              {range.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFilterCategoryTab === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Category 4: Plot Size Filter */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#b38330]" /> 3. Plot Size Filters
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Minimum Area ({plotSizeUnit}):</label>
                        <input
                          type="number"
                          value={plotSizeMin}
                          onChange={(e) => setPlotSizeMin(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 1000"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Maximum Area ({plotSizeUnit}):</label>
                        <input
                          type="number"
                          value={plotSizeMax}
                          onChange={(e) => setPlotSizeMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 5000"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Region Standard Units:</label>
                        <select
                          value={plotSizeUnit}
                          onChange={(e) => setPlotSizeUnit(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black cursor-pointer"
                        >
                          <option value="Sq.ft">Sq.ft (Standard)</option>
                          <option value="Sq.yard">Sq.yard</option>
                          <option value="Acres">Acres (Corridors)</option>
                          <option value="Guntha" className="text-emerald-700 font-black">Guntha (Maharashtra Standard)</option>
                          <option value="Hectare">Hectare (Agricultural standard)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold italic">• Automatic conversion helps Maharashtra developers isolate layout scales instantly.</p>
                  </div>

                  {/* Category 5: Plot Type / Zoning Profile */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#b38330]" /> 4. Plot Type & Zoning Target
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {['All', 'Residential', 'Commercial', 'Agricultural', 'Industrial', 'Farm land'].map((type) => {
                        const isSelected = plotTypeSelection === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPlotTypeSelection(type)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow-md' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {type} Plots
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 6: Ownership type */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#b38330]" /> 5. Ownership Structural Tenure
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {['All', 'Freehold', 'Leasehold', 'Government lease'].map((owner) => {
                        const isSelected = plotOwnershipSelection === owner;
                        return (
                          <button
                            key={owner}
                            type="button"
                            onClick={() => setPlotOwnershipSelection(owner)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow shadow-slate-900/10' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {owner} Type
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeFilterCategoryTab === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Category 7: Legal Approval Filters (Most Critical Section) */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-500/10 px-3 py-2 rounded-lg uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse animate-duration-1000" /> 6. Critical Legal Approvals & Trust Vetting Index
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'legal-rera', label: 'RERA Approved Code', desc: 'Secure state RERA register check', state: plotLegalRera, setter: setPlotLegalRera },
                        { id: 'legal-na', label: 'NA Plot (Non-Agri)', desc: 'Pre-converted statutory clearance', state: plotLegalNa, setter: setPlotLegalNa },
                        { id: 'legal-layout', label: 'Approved Layout Map', desc: 'NMRDA/BBMP blueprints matched', state: plotLegalApprovedLayout, setter: setPlotLegalApprovedLayout },
                        { id: 'legal-clear', label: '100% Clear Title Search', desc: 'Assigned land registry history vetted', state: plotLegalClearTitle, setter: setPlotLegalClearTitle },
                        { id: 'legal-bank', label: 'Bank Approved Listings', desc: 'Pre-appraised SBI/HDFC housing loan', state: plotLegalBankApproved, setter: setPlotLegalBankApproved },
                        { id: 'legal-ready', label: 'Registry Ready ground', desc: 'Instant transfer deeds available', state: plotLegalRegistryReady, setter: setPlotLegalRegistryReady },
                        { id: 'legal-encumb', label: 'Encumbrance-Free status', desc: 'No pending liens or corporate claims', state: plotLegalEncumbranceFree, setter: setPlotLegalEncumbranceFree },
                        { id: 'legal-mutate', label: 'Mutation Completed status', desc: 'State land record revenue mutation', state: plotLegalMutationCompleted, setter: setPlotLegalMutationCompleted }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => item.setter(!item.state)}
                          className={`p-3 rounded-2xl text-left border flex flex-col justify-between transition-all select-none hover:border-emerald-500/40 cursor-pointer relative ${
                            item.state 
                              ? 'bg-emerald-50/70 border-emerald-500/80 shadow' 
                              : 'bg-slate-50 border-slate-200 text-slate-805'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[11px] sm:text-xs font-black leading-tight">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${item.state ? 'bg-emerald-600 border-white' : 'border-slate-300'}`}>
                              {item.state && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-450 mt-1 leading-snug font-semibold block">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 8: Facing direction */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#b38330]" /> 7. Vastu Directional Profile
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {['All', 'East', 'West', 'North', 'South'].map((fac) => {
                        const isSelected = plotFacingDirection === fac;
                        return (
                          <button
                            key={fac}
                            type="button"
                            onClick={() => setPlotFacingDirection(fac)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {fac === 'All' ? 'Any Direction' : `${fac} Facing Sector`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeFilterCategoryTab === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Category 9: Road Access Filters */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#b38330]" /> 8. Road Access & Frontage Widths
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPlotRoadCorner(!plotRoadCorner)}
                        className={`p-3 rounded-xl border font-black text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                          plotRoadCorner 
                            ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow' 
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        📐 Corner Plot Lot
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">2-Side Open</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlotRoadMainTouch(!plotRoadMainTouch)}
                        className={`p-3 rounded-xl border font-black text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                          plotRoadMainTouch 
                            ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow' 
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        🛣️ Main Road Touch
                        <span className="text-[9px] bg-indigo-500 text-white font-black px-1.5 py-0.5 rounded">Easy Loading</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlotRoadInternal(!plotRoadInternal)}
                        className={`p-3 rounded-xl border font-black text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                          plotRoadInternal 
                            ? 'bg-[#0E1F35] text-white border-[#0E1F35] shadow' 
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        🛤️ Internal Wider Road Link
                        <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.5 rounded">Quiet Rows</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Road Width Category:</span>
                      <div className="flex flex-wrap gap-2">
                        {['All', '20 ft', '40 ft', 'Highway touch'].map((wOpt) => {
                          const isSelected = plotRoadWidthMax === wOpt;
                          return (
                            <button
                              key={wOpt}
                              type="button"
                              onClick={() => setPlotRoadWidthMax(wOpt)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                              }`}
                            >
                              {wOpt === 'All' ? 'Wider Road (Any)' : `${wOpt} Road Width+`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Category 10: Boundary & Dimensions */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#b38330]" /> 9. Boundary Wall & Layout Dimensions
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Boundary Wall State:</label>
                        <select
                          value={plotHasBoundaryWall}
                          onChange={(e) => setPlotHasBoundaryWall(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        >
                          <option value="All">All Boundary Types</option>
                          <option value="Constructed">Constructed Compound Solid Wall</option>
                          <option value="Fenced">Fenced Perimeter Delineation</option>
                          <option value="None">None (Open Ground)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Min Frontage Road Width:</label>
                        <input
                          type="number"
                          value={plotFrontageWidthMin}
                          onChange={(e) => setPlotFrontageWidthMin(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 40"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Length × Breadth (Search):</label>
                        <input
                          type="text"
                          value={plotDimensionsSpec}
                          onChange={(e) => setPlotDimensionsSpec(e.target.value)}
                          placeholder="e.g. 30x50, 40x80"
                          className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-gray-305 focus:outline-none focus:ring-1 focus:ring-amber-500 font-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 11: Nearby Infrastructure & Anchors */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#b38330]" /> 10. Nearby Infrastructure decision-makers
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: 'infra-sch', label: 'Near Central Schools (< 1km)', state: plotNearSchool, setter: setPlotNearSchool },
                        { id: 'infra-hosp', label: 'Near Multi-Speciality Hospitals', state: plotNearHospital, setter: setPlotNearHospital },
                        { id: 'infra-it', label: 'Near SEZ/IT Tech Corridors', state: plotNearItPark, setter: setPlotNearItPark }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => item.setter(!item.state)}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                            item.state 
                              ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-205'
                          }`}
                        >
                          <input type="checkbox" checked={item.state} readOnly className="pointer-events-none" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 12: Development status */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#b38330]" /> 11. Development Land Status
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {['All', 'Gated layout', 'Township plot', 'Developed land', 'Under development'].map((dStatus) => {
                        const isSelected = plotDevelopmentStatus === dStatus;
                        return (
                          <button
                            key={dStatus}
                            type="button"
                            onClick={() => setPlotDevelopmentStatus(dStatus)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0E1F35] text-white border-[#0E1F35]' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {dStatus}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeFilterCategoryTab === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Category 20: AI Smart filters trigger (Standout feature) */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-[#0E1F35]/5 p-5 rounded-2xl border border-amber-500/20 space-y-4 shadow-sm relative">
                    <div className="absolute top-4 right-4 text-amber-500">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="bg-[#0E1F35] text-amber-400 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm shadow-sm inline-block">
                      Artificial Intelligence Insights
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-905 uppercase tracking-tight">
                      20. Advanced AI compliance-driven precomputations
                    </h4>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Toggle active heuristics parameters to query high appreciation ratios and safe dispute-free index mappings.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      {[
                        { id: 'ai-best-inv', label: '🔥 Best investment plots', state: plotAiBestInvestment, setter: setPlotAiBestInvestment },
                        { id: 'ai-fut-grw', label: '🌳 Future growth areas', state: plotAiFutureGrowth, setter: setPlotAiFutureGrowth },
                        { id: 'ai-high-app', label: '📈 High appreciation zones', state: plotAiHighAppreciation, setter: setPlotAiHighAppreciation },
                        { id: 'ai-low-risk', label: '🛡️ Low-risk legal plots', state: plotAiLowRiskLegal, setter: setPlotAiLowRiskLegal }
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => chip.setter(!chip.state)}
                          className={`p-3 rounded-2xl text-left transition-all border block relative select-none shadow-xs cursor-pointer ${
                            chip.state 
                              ? 'bg-[#0E1F35] text-amber-500 border-amber-550 shadow-md ring-2 ring-amber-500/20' 
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black tracking-tight">{chip.label}</span>
                            {chip.state && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 block">Includes telemetry, proximity index matching.</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 14: Grid links */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#b38330]" /> 12. Utilities Grid Linkage
                    </h4>

                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: 'util-wat', label: 'Municipal Water Connection Available', state: plotUtilityWater, setter: setPlotUtilityWater },
                        { id: 'util-ele', label: 'Electricity Grid Lines Active', state: plotUtilityElectricity, setter: setPlotUtilityElectricity },
                        { id: 'util-dra', label: 'Stormwater Drainage Constructed', state: plotUtilityDrainage, setter: setPlotUtilityDrainage },
                        { id: 'util-sew', label: 'Public Central Sewage Link', state: plotUtilitySewage, setter: setPlotUtilitySewage }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => item.setter(!item.state)}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                            item.state 
                              ? 'bg-amber-400 text-slate-950 border-amber-400' 
                              : 'bg-slate-55 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <input type="checkbox" checked={item.state} readOnly className="pointer-events-none opacity-80" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 13, 15, 16, 17, 18, 19: Additional criteria panel */}
                  <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-150 space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E1F35] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#b38330]" /> Miscellaneous Vetting Parameters
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* ROI Appreciation */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Investment Appreciation Profile:</span>
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPlotInvestmentAppreciation(!plotInvestmentAppreciation)}
                            className={`p-2 rounded text-xs text-left font-black border transition-colors cursor-pointer ${plotInvestmentAppreciation ? 'bg-[#0E1F35] text-white border-none' : 'bg-slate-50 border-slate-205'}`}
                          >
                            🚀 {plotInvestmentAppreciation ? 'High Appreciation Tracked' : 'Check Appreciation status'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPlotInvestmentUpcomingInfra(!plotInvestmentUpcomingInfra)}
                            className={`p-2 rounded text-xs text-left font-black border transition-colors cursor-pointer ${plotInvestmentUpcomingInfra ? 'bg-[#0E1F35] text-white border-none' : 'bg-slate-50 border-slate-205'}`}
                          >
                            🛣️ {plotInvestmentUpcomingInfra ? 'Near Upcoming Infra corridor' : 'Check Upcoming Infra proximity'}
                          </button>
                        </div>
                      </div>

                      {/* Possession & Seller */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Seller Type Profile:</span>
                        <select
                          value={plotSellerType}
                          onChange={(e) => setPlotSellerType(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-300 focus:outline-none font-bold"
                        >
                          <option value="All">All Sellers</option>
                          <option value="Owner">Direct Land Owner</option>
                          <option value="Builder">Builder / Developing Agency</option>
                          <option value="Agent">RERA Registered Land Agent</option>
                        </select>

                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 mt-2.5">Possession status:</span>
                        <select
                          value={plotPossessionStatus}
                          onChange={(e) => setPlotPossessionStatus(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-300 focus:outline-none font-bold"
                        >
                          <option value="All">Ready / Under Development</option>
                          <option value="Immediate registry">Deed Registry Ready</option>
                          <option value="Ready possession">Immediate Construction possession</option>
                          <option value="Under development">Under layout development</option>
                        </select>
                      </div>

                      {/* Shape & Verification */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Plot Shape Profile:</span>
                        <select
                          value={plotShapeSelection}
                          onChange={(e) => setPlotShapeSelection(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-300 focus:outline-none font-bold"
                        >
                          <option value="All">Any Geometrical Shape</option>
                          <option value="Rectangular">Rectangular (Ideal standard)</option>
                          <option value="Square">Perfect Square profile</option>
                          <option value="Irregular">Irregular acreage (Cost benefit)</option>
                        </select>

                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 mt-2.5">Posted Time Index:</span>
                        <select
                          value={plotPostedTime}
                          onChange={(e) => setPlotPostedTime(e.target.value)}
                          className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-300 focus:outline-none font-bold"
                        >
                          <option value="All">All listings history</option>
                          <option value="Today">Listed Today</option>
                          <option value="Last 7 days">Last 7 Days</option>
                          <option value="Last month">Last 30 Days</option>
                        </select>
                      </div>
                    </div>

                    {/* Verified Checklist */}
                    <div className="pt-2 border-t border-slate-105">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 font-extrabold">Attributes Verification status:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '✔ Verified Documents index', state: plotVerifiedDocuments, setter: setPlotVerifiedDocuments },
                          { label: '📍 Verified Physical Location coords', state: plotVerifiedLocation, setter: setPlotVerifiedLocation },
                          { label: '👤 Verified Ownership status', state: plotVerifiedOwnership, setter: setPlotVerifiedOwnership },
                          { label: '📷 Ground Photos verified', state: plotVerifiedPhotos, setter: setPlotVerifiedPhotos }
                        ].map((item, id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => item.setter(!item.state)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer ${
                              item.state 
                                ? 'bg-emerald-600 text-white border-none shadow' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gated Community features */}
                    <div className="pt-2 border-t border-slate-105">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 font-extrabold">Internal Township Features:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '👮 24/7 Security Guard Booth', state: plotGatedSecurity, setter: setPlotGatedSecurity },
                          { label: '🧱 Solid Perimeter Compound Wall', state: plotGatedCompoundWall, setter: setPlotGatedCompoundWall },
                          { label: '🏡 Community Club & Play grounds', state: plotGatedClubhouse, setter: setPlotGatedClubhouse },
                          { label: '💡 Street lights installed', state: plotGatedStreetLights, setter: setPlotGatedStreetLights },
                          { label: '🛣️ Asphalt wider internal roads', state: plotGatedInternalRoads, setter: setPlotGatedInternalRoads },
                          { label: '🌳 Landscaped garden arrays', state: plotGatedGarden, setter: setPlotGatedGarden }
                        ].map((item, id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => item.setter(!item.state)}
                            className={`px-3 py-1 text-xs font-black rounded-lg transition-all border cursor-pointer ${
                              item.state 
                                ? 'bg-[#0E1F35] text-amber-500 border-amber-500/50 shadow' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal sticky footer */}
            <div className="bg-slate-100 p-4 sm:p-5 shrink-0 border-t border-gray-200 flex justify-between items-center select-none">
              <button
                type="button"
                onClick={resetAllPlotFilters}
                className="bg-white hover:bg-slate-100 text-[#0E1F35] font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all border border-slate-300 cursor-pointer"
              >
                Clear All Params
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-extrabold whitespace-nowrap hidden sm:block">
                  ({filteredListings.length} matching plots computed)
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="bg-[#0E1F35] hover:bg-[#b38330] hover:text-white text-white font-extrabold text-xs px-8 py-3 rounded-xl uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Apply Parameters & Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
