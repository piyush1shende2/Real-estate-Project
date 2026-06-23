import { PropertyDetail } from '../components/PropertyDetailView';

export const PROPERTY_DETAILS_MAP: Record<string, PropertyDetail> = {
  // Heritage Clay-Roof Mansion - Link to Adhiraj Capital City
  'slide-0': {
    id: 'slide-0',
    title: 'Adhiraj Capital City',
    location: 'Navi Mumbai, 410 2016',
    locationDetailed: 'Navi Mumbai 410 216',
    price: '₹1.5 Cr - ₹4.2 Cr',
    type: 'House',
    propertyId: '10042',
    status: 'Sale',
    area: '340m²',
    beds: 4,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', // Beautiful interior
    descriptionParagraphs: [
      'The finest thought-through specifications for a life of unparalleled space, comfort, and convenience. Featuring cross-ventilation in all residences, premium vitrified tile flooring, separate wardrobe areas in bedrooms, and double height sun decks with French windows.',
      'Enjoy superior granite countertops with stainless steel sinks, chrome-plated bathroom fittings, and the finest sanitaryware. Adhiraj The Capital Tower offers a vision of magnificent urban living in Kharghar, one of Navi Mumbai’s largest lifestyle developments.'
    ],
    amenities: [
      'Tower Lounge',
      'Toddlers\' Play Area',
      'Jogging Track',
      'Yoga & Meditation Courtyard',
      'Covered Pathway',
      'Tea Lounge',
      'Cricket Ground',
      'Community Space',
      'Skating Bowl',
      'Indoor Games',
      'Cafe Seating',
      'Futsal Court',
      'Teens\' Corner',
      'Co-working Space'
    ]
  },
  // Modern White Villa
  'slide-1': {
    id: 'slide-1',
    title: 'Prestige Aura Residences',
    location: 'Whitefield, Bengaluru, 560 066',
    locationDetailed: 'Whitefield Road, Bengaluru 560 066',
    price: '₹3.8 Cr - ₹7.5 Cr',
    type: 'Villa',
    propertyId: '10043',
    status: 'Sale',
    area: '420m²',
    beds: 5,
    baths: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'An architectural masterpiece designed for those who appreciate fine luxury. Seamlessly combining avant-garde design aesthetics with functional utility, Prestige Aura offers customizable layouts, triple-height visual voids, and fully automated automation grids.',
      'Indulge in hand-selected Italian marble flooring, zero-noise plumbing arrays, custom kitchen fittings, and fully thermal-insulated double-glazed facade panels. Each villa features a private micro-climate lawn and private sun-decks overlooking state-of-the-art golf fields.'
    ],
    amenities: [
      'Private Swimming Pool',
      'Integrated Smart Home IO',
      'Solar Panel Energy Grid',
      '24/7 Elite Security Force',
      'Custom Wine Cellar Lounge',
      'Bespoke Health Gym',
      'Tennis Courts',
      'EV Supercharging Slots',
      'Concierge Housekeeping',
      'Children Creative Sandbox'
    ]
  },
  // Executive Suburban Residence
  'slide-2': {
    id: 'slide-2',
    title: 'DLF Kings Court Penthouse',
    location: 'Greater Kailash II, New Delhi, 110048',
    locationDetailed: 'Greater Kailash-II, New Delhi 110 048',
    price: '₹12.0 Cr - ₹18.0 Cr',
    type: 'Penthouse',
    propertyId: '10044',
    status: 'Sale',
    area: '280m²',
    beds: 3,
    baths: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'This super-premium sky mansion represents the pinnacle of capital-city living, overlooking the lush green canopy of South Delhi parks. Equipped with direct private elevator entry, individual security guard foyers, and a towering master lobby.',
      'Designed in accordance with global elite standards, featuring modular sub-zero refrigeration nodes, acoustic paneling, customized solar curtains, and high-efficiency heat pumps. Perfectly secure, double-enclave structure located within close walking range of primary healthcare centers and diplomatic complexes.'
    ],
    amenities: [
      'Private High-Speed Elevator',
      'Bespoke Skydeck Lounge',
      'Sub-Zero Luxury Appliances',
      'Multi-Stage Security Gates',
      'Purified VRF Intake Units',
      'Heated Plunge Pool',
      'Attendant Valet Services',
      'Executive Dining Room',
      'Private Library Chambers'
    ]
  },
  // Sunset Estate
  'slide-3': {
    id: 'slide-3',
    title: 'Lodha Belmondo Golf Estates',
    location: 'Gahunje Road, Pune, 412 101',
    locationDetailed: 'Mumbai-Pune Expressway Sector, Gahunje 412 101',
    price: '₹2.2 Cr - ₹5.4 Cr',
    type: 'Mansion',
    propertyId: '10045',
    status: 'Rent',
    area: '510m²',
    beds: 5,
    baths: 6,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'Immersive luxury sprawling over manicured riverside links, Gahunje Lodha Hills presents an exclusive low-density compound environment. With grand, hand-finished mahogany doors, master-level double-height corridors, and clear sunrise exposure.',
      'Constructed with top-of-line earthquake resistant material layers and premium double-coated weather proofing. Enjoy direct golf cart transit links, secure fully-fenced perimeter grids, 100% generator power back-up, and on-premises high pressure supply systems.'
    ],
    amenities: [
      '9-Hole Professional Golf Range',
      'Private Infinity Blue Pool',
      'Jogging & Cycling Corridors',
      'Premium Club Dining Deck',
      'Thermal Insulated Facades',
      'Multistage Gate Control',
      'Lobby Concierge Desk',
      'Kids Multi-Play Pavilion'
    ]
  },

  // Fallback map mapping for the standard layout MOCK_PROPERTIES
  'b1': {
    id: 'b1',
    title: 'Emerald Luxury Suite',
    location: 'Park Street, Downtown',
    locationDetailed: 'Park Street Cross, Downtown Central 100 001',
    price: '$720,000',
    type: 'Apartment',
    propertyId: '10051',
    status: 'Buy',
    area: '170m² (1,840 sqft)',
    beds: '3 BHK',
    baths: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'An impeccably detailed urban apartment designed for convenience and sleek modern comfort right in the heart of downtown. Highlighted by large bay windows that filter natural afternoon radiation and cross-ventilated bedroom units.',
      'Complete with direct intercom linkups, premium vitrified tile bathroom suites, and pre-installed fiber broadband infrastructure.'
    ],
    amenities: ['Swimming Pool', 'Security', '2 Garages', 'Gym Access', 'Intercom system', 'Broadband Fiber']
  },
  'b2': {
    id: 'b2',
    title: 'The Golden Crest Villa',
    location: 'Beverly Meadows',
    locationDetailed: 'Beverly Meadows Hills, High Crest Sector 302 021',
    price: '$1,350,000',
    type: 'Villa',
    propertyId: '10052',
    status: 'Buy',
    area: '297m² (3,200 sqft)',
    beds: '4 BHK',
    baths: 4,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'An extravagant family mansion built into high-altitude Meadows, offering spectacular unobstructed morning mountain sun views.',
      'Features full basement garages, premium double-glazed French doors, separate kitchen configurations, and pre-wired smart heat grids.'
    ],
    amenities: ['Mountain View', 'Jacuzzi', 'Modular Kitchen', 'EV Ready Garage', '24/7 Gate Patrol', 'Lawn Sprinklers']
  },
  'r1': {
    id: 'r1',
    title: 'Urban Cozy Apartment',
    location: 'Broad Street, Sector 42',
    locationDetailed: 'Broad Street Diagonal, Near Central Metro, Sector 42',
    price: '$2,100 / mo',
    type: 'Apartment',
    propertyId: '10053',
    status: 'Rent',
    area: '102m² (1,100 sqft)',
    beds: '2 BHK',
    baths: 2,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'A warm, beautifully furnished metropolitan apartment within a minute walk of Sector 42’s transit connection hubs.',
      'Features high-quality modular kitchen layouts, solid stone wall panels, on-demand high-pressure water fixtures, and community backup generators.'
    ],
    amenities: ['Furnished', 'Near Metro Station', 'Gym Access', 'High-Speed Elevators', 'CCTV Monitor Vigilance', 'RO Water Filter Unit']
  },
  'r2': {
    id: 'r2',
    title: 'Skyview Penthouse',
    location: 'Ninth Avenue Skyline',
    locationDetailed: 'Ninth Avenue, Sector 15 Skyline, Plaza Tower D',
    price: '$4,200 / mo',
    type: 'Penthouse',
    propertyId: '10054',
    status: 'Rent',
    area: '200m² (2,150 sqft)',
    beds: '3 BHK',
    baths: 3,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'An expansive, double-level sky residence offering panoramic views of the city skyline. Outfitted with private key elevator access.',
      'Designed with spacious structural balconies, triple layer noise-canceling glass partitions, and pre-installed integrated cooling duct networks.'
    ],
    amenities: ['Rooftop access', 'Concierge Service', 'Private Elevator', 'Acoustic Glass Walls', 'Dual Parking Bay', 'Water Softening Station']
  },
  'p1': {
    id: 'p1',
    title: 'Prestige Acres Plot',
    location: 'North Green Meadows Estate',
    locationDetailed: 'Plot 42-B, Green Meadows Sector, National Highway Side',
    price: '$180,000',
    type: 'Plot',
    propertyId: '10055',
    status: 'Buy',
    area: '418m² (4,500 sqft)',
    beds: 'N/A',
    baths: 'N/A',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'A pristine parcel of residential green zone land, cleared and primed for building foundation layouts. Boasts fully legal titles.',
      'Enjoys direct wide-road frontage connections, state-certified water channel links, on-grid electricity trunk lines, and immediate neighborhood street lamps.'
    ],
    amenities: ['Road Facing', 'Corner Property', 'Water Supply Verified', 'Legal Title Checked', 'Gated Sector boundary', 'Fast Fiber trunk links']
  },
  'p2': {
    id: 'p2',
    title: 'Lakeside Residential Zone',
    location: 'Lake Breeze Township',
    locationDetailed: 'Zone 5 Lakeside, Lake Breeze Gated Township',
    price: '$290,000',
    type: 'Plot',
    propertyId: '10056',
    status: 'Buy',
    area: '557m² (6,000 sqft)',
    beds: 'N/A',
    baths: 'N/A',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'Enjoy direct lakefront vistas from this cleared premium plot location inside the highly desirable Lake Breeze Township.',
      'Underwent full architectural soil checks, offering guaranteed clear legal title certificates and direct access to state transit roads.'
    ],
    amenities: ['Lake Facing', 'Clear Title', 'Ready for Construction', 'High load soil checked', 'Lakeside Jogging path', 'Community Club Privilege']
  },
  'pg1': {
    id: 'pg1',
    title: 'Stanza Living Executive PG',
    location: 'Near Tech Park Alpha',
    locationDetailed: 'Executive Street, H-4, Sector 7, Outer Road Block',
    price: '$250 / mo',
    type: 'PG Room',
    propertyId: '10057',
    status: 'Rent',
    area: '25m² (Private Room)',
    beds: 'Single Unit',
    baths: 1,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'Highly professional executive paying guest single room designed for tech specialists and junior developers.',
      'Rent includes fully cooked healthy regional menus daily (3 meals), high-speed multi-AP WiFi lanes, laundry grids, and room vacuum services.'
    ],
    amenities: ['WiFi 1Gbps', 'Daily Meals', 'Housekeeping Included', 'AC Climate Control', 'Power Inverter Backup', 'Drinking Water Dispenser']
  },
  'pg2': {
    id: 'pg2',
    title: 'Hive Premium Co-Living',
    location: 'Downtown Academic Center',
    locationDetailed: 'Block C-12, Main College Avenue, Sector 3',
    price: '$180 / mo',
    type: 'Co-Living Space',
    propertyId: '10058',
    status: 'Rent',
    area: '45m² (Shared)',
    beds: 'Double Sharing',
    baths: 2,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'Bustling, vibrant co-living enclave ideal for university students and social network professionals.',
      'Enriched with spacious communal rec spaces, biometric access systems, complete laundry areas, and centralized air conditioning.'
    ],
    amenities: ['Air-Conditioned', 'Lounge / Games Area', 'Biometric Entry', 'Shared Laundry Unit', 'Kitchen access privilege', 'High speed router setup']
  }
};

/**
 * Generates or retrieves a full PropertyDetail object for any listing dynamically
 */
export function getPropertyDetail(id: string, customListing?: any): PropertyDetail {
  if (PROPERTY_DETAILS_MAP[id]) {
    return PROPERTY_DETAILS_MAP[id];
  }

  // Fallback generator for search result properties not explicitly registered
  return {
    id: id,
    title: customListing?.title || 'Premium Property Listing',
    location: customListing?.location || 'Downtown Sector',
    locationDetailed: customListing?.location || 'Downtown Sector Main Road',
    price: customListing?.price || 'Market Valuation',
    type: customListing?.type || 'Property',
    propertyId: `10${Math.floor(100 + Math.random() * 900)}`,
    status: customListing?.type === 'Rent' || customListing?.type === 'PG/Co-Living' ? 'Rent' : 'Sale',
    area: customListing?.area || '150m²',
    beds: customListing?.bhk || '3 BHK',
    baths: 3,
    image: customListing?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    descriptionParagraphs: [
      'The finest thought-through specifications for a life of unparalleled space, comfort, and convenience. Designed with modern architecture and premium fixtures.',
      'An outstanding opportunity in a high-demand prime locality, boasting clean legal clearance documents, 24/7 security watch, and continuous water connections.'
    ],
    amenities: customListing?.features || [
      'Tower Lounge',
      'Toddlers\' Play Area',
      'Jogging Track',
      'Yoga & Meditation Courtyard',
      'Covered Pathway',
      'Tea Lounge',
      'Cricket Ground',
      'Community Space',
      'Skating Bowl',
      'Indoor Games'
    ]
  };
}
