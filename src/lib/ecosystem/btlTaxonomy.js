/**
 * ZIGGERS BTL & EXPERIENTIAL CAMPAIGN ECOSYSTEM TAXONOMY
 * Comprehensive 12 Partner Categories, 75+ BTL Activity Formats, Objective-Driven Activation Planning Engine, and Requirement Decomposition
 */

export const PARTNER_CATEGORIES = {
  CREATIVE_AND_MARKETING_AGENCIES: {
    id: 'CREATIVE_AND_MARKETING_AGENCIES',
    title: 'Creative & Marketing Agencies',
    icon: '🎨',
    description: 'Campaign concepts, key visual design, copywriting, motion graphics, and digital marketing support.',
    services: [
      'Campaign concept development',
      'Creative strategy',
      'Key visual design',
      'Campaign branding',
      'Poster design',
      'Social media creatives',
      'Video production',
      'Photography',
      'Motion graphics',
      'Copywriting',
      'Campaign messaging',
      'Digital campaign support',
      'Influencer campaigns',
      'Content creation'
    ]
  },
  BTL_ACTIVATION_AND_EVENT_AGENCIES: {
    id: 'BTL_ACTIVATION_AND_EVENT_AGENCIES',
    title: 'BTL Activation & Event Agencies',
    icon: '🎪',
    description: 'On-ground activations, mall/college activations, roadshows, and experiential event production.',
    services: [
      'Brand activations',
      'Experiential marketing',
      'Product launches',
      'Mall activations',
      'College activations',
      'Roadshows',
      'Corporate activations',
      'Retail activations',
      'Sampling campaigns',
      'Consumer engagement activities',
      'Event production',
      'On-ground event management'
    ]
  },
  FABRICATION_AND_PRODUCTION_PARTNERS: {
    id: 'FABRICATION_AND_PRODUCTION_PARTNERS',
    title: 'Fabrication & Production Partners',
    icon: '🔨',
    description: 'Custom kiosks, experience zones, sampling counters, exhibition booths, and pop-up installations.',
    services: [
      'Custom kiosks',
      'Booth fabrication',
      'Experience zones',
      'Product display units',
      'Sampling counters',
      'Exhibition stalls',
      'Brand installations',
      'Pop-up structures',
      'LED installations',
      'Interactive structures',
      'Custom props'
    ]
  },
  PRINTING_AND_BRANDING_PARTNERS: {
    id: 'PRINTING_AND_BRANDING_PARTNERS',
    title: 'Printing & Branding Partners',
    icon: '🖨️',
    description: 'Banners, standees, backdrops, vinyl branding, POSM, vehicle wraps, flyers, and uniforms.',
    services: [
      'Banners',
      'Standees',
      'Backdrops',
      'Posters',
      'Vinyl printing',
      'Floor graphics',
      'Vehicle branding',
      'Window branding',
      'POS materials',
      'Brochures',
      'Flyers',
      'Product inserts',
      'Branded uniforms'
    ]
  },
  EVENT_EQUIPMENT_AND_RENTAL_PARTNERS: {
    id: 'EVENT_EQUIPMENT_AND_RENTAL_PARTNERS',
    title: 'Event Equipment & Rental Partners',
    icon: '⚡',
    description: 'Canopies, tents, stages, LED displays, sound systems, lighting, power backup, and AV rentals.',
    services: [
      'Tables',
      'Chairs',
      'Canopies',
      'Tents',
      'Stage setup',
      'LED screens',
      'TVs',
      'Sound systems',
      'Lighting',
      'Generators',
      'Power backup',
      'Projectors',
      'Gaming equipment',
      'Interactive displays'
    ]
  },
  STAFFING_AND_MANPOWER: {
    id: 'STAFFING_AND_MANPOWER',
    title: 'Staffing & Manpower (Ziggers Core)',
    icon: '👥',
    description: 'On-demand brand promoters, sampling staff, sales promoters, emcees, hosts, and field supervisors.',
    services: [
      'Brand promoters',
      'Brand ambassadors',
      'Sampling staff',
      'Sales promoters',
      'Event staff',
      'Registration staff',
      'Hosts',
      'Emcees',
      'Product demonstrators',
      'Setup crew',
      'Supervisors',
      'Team leaders',
      'Merchandisers',
      'Auditors',
      'Mystery shoppers'
    ],
    hasDirectZiggersCapability: true
  },
  SPECIALIST_TALENT_PARTNERS: {
    id: 'SPECIALIST_TALENT_PARTNERS',
    title: 'Specialist Talent Partners',
    icon: '⭐',
    description: 'Professional trainers, makeup artists, fitness coaches, DJs, musicians, performers, and celebrity hosts.',
    services: [
      'Professional trainers',
      'Product trainers',
      'Makeup artists',
      'Fitness coaches',
      'Sports coaches',
      'DJs',
      'Musicians',
      'Performers',
      'Hosts',
      'Anchors',
      'Celebrity appearances',
      'Subject matter experts'
    ]
  },
  LOGISTICS_AND_OPERATIONS_PARTNERS: {
    id: 'LOGISTICS_AND_OPERATIONS_PARTNERS',
    title: 'Logistics & Operations Partners',
    icon: '🚚',
    description: 'Product transport, asset movement, warehousing, temporary storage, and last-mile delivery.',
    services: [
      'Product transportation',
      'Asset transportation',
      'Equipment delivery',
      'Warehousing',
      'Temporary storage',
      'Installation logistics',
      'Last-mile delivery',
      'Reverse logistics',
      'Event material movement'
    ]
  },
  FOOD_AND_BEVERAGE_PARTNERS: {
    id: 'FOOD_AND_BEVERAGE_PARTNERS',
    title: 'Food & Beverage Partners',
    icon: '🍔',
    description: 'Catering, food trucks, beverage stations, sampling support, pop-up kitchens, and serving gear.',
    services: [
      'Catering',
      'Food trucks',
      'Beverage stations',
      'Sampling support',
      'Pop-up kitchens',
      'Bar setup where legally permitted',
      'Food preparation staff',
      'Serving equipment'
    ]
  },
  TECHNOLOGY_AND_ENGAGEMENT_PARTNERS: {
    id: 'TECHNOLOGY_AND_ENGAGEMENT_PARTNERS',
    title: 'Technology & Engagement Partners',
    icon: '📱',
    description: 'QR registration, lead capture, microsites, AR/VR experiences, digital kiosks, and gamification.',
    services: [
      'QR registration',
      'Lead capture',
      'Microsites',
      'Campaign landing pages',
      'AR experiences',
      'VR experiences',
      'Interactive games',
      'Digital kiosks',
      'Touchscreen installations',
      'RFID / NFC engagement',
      'Contest systems',
      'Gamification'
    ]
  },
  MEDIA_AND_DOCUMENTATION_PARTNERS: {
    id: 'MEDIA_AND_DOCUMENTATION_PARTNERS',
    title: 'Media & Documentation Partners',
    icon: '📸',
    description: 'Event photography, high-definition videography, drone coverage, live streaming, and aftermovies.',
    services: [
      'Campaign photography',
      'Videography',
      'Drone coverage where permitted',
      'Live streaming',
      'Social media coverage',
      'UGC capture',
      'Event documentation',
      'Aftermovie production'
    ]
  },
  INFLUENCER_AND_CREATOR_PARTNERS: {
    id: 'INFLUENCER_AND_CREATOR_PARTNERS',
    title: 'Influencer & Creator Partners',
    icon: '📣',
    description: 'Local creators, campus ambassadors, UGC creators, micro/macro influencers, and event hosts.',
    services: [
      'Local influencers',
      'Campus creators',
      'UGC creators',
      'Micro influencers',
      'Macro influencers',
      'Event hosts',
      'Content amplification'
    ]
  }
};

/**
 * Complete BTL Activity Library (75+ Formats)
 */
export const BTL_ACTIVITY_LIBRARY = [
  { id: 'PRODUCT_SAMPLING', name: 'Product Sampling', cluster: 'Sampling & Trial', defaultComponents: ['Physical Setup', 'Workforce', 'Product Inventory', 'Training', 'Branding'] },
  { id: 'PRODUCT_DEMO', name: 'Product Demonstration', cluster: 'Sampling & Trial', defaultComponents: ['Physical Setup', 'Workforce', 'Training', 'Technology'] },
  { id: 'PRODUCT_TRIAL', name: 'Product Trial', cluster: 'Sampling & Trial', defaultComponents: ['Physical Setup', 'Workforce', 'Inventory'] },
  { id: 'PRODUCT_LAUNCH', name: 'Product Launch', cluster: 'Experiential & Events', defaultComponents: ['Creative', 'Fabrication', 'Workforce', 'Media', 'Equipment'] },
  { id: 'ROADSHOW', name: 'Roadshow', cluster: 'Mobile & Transit', defaultComponents: ['Logistics', 'Vehicle Branding', 'Workforce', 'Equipment'] },
  { id: 'MALL_ACTIVATION', name: 'Mall Activation', cluster: 'Experiential & Retail', defaultComponents: ['Fabrication', 'Branding', 'Workforce', 'Technology', 'Media'] },
  { id: 'COLLEGE_ACTIVATION', name: 'College Activation', cluster: 'Youth & Campus', defaultComponents: ['Branding', 'Workforce', 'Equipment', 'Gamification'] },
  { id: 'CAMPUS_AMBASSADOR', name: 'Campus Ambassador Campaign', cluster: 'Youth & Campus', defaultComponents: ['Workforce', 'Creative', 'Technology'] },
  { id: 'CORPORATE_ACTIVATION', name: 'Corporate Activation', cluster: 'Workplace & B2B', defaultComponents: ['Booth Setup', 'Workforce', 'Lead Capture', 'Branding'] },
  { id: 'OFFICE_PARK_ACTIVATION', name: 'Office Park Activation', cluster: 'Workplace & B2B', defaultComponents: ['Kiosk Setup', 'Workforce', 'Branding'] },
  { id: 'RETAIL_ACTIVATION', name: 'Retail Activation', cluster: 'Retail & POSM', defaultComponents: ['POSM', 'Workforce', 'Merchandising'] },
  { id: 'INSTORE_PROMOTION', name: 'In-store Promotion', cluster: 'Retail & POSM', defaultComponents: ['POSM', 'Promoters', 'Discount Vouchers'] },
  { id: 'POS_ACTIVATION', name: 'Point of Sale Activation', cluster: 'Retail & POSM', defaultComponents: ['POSM Gantry', 'Promoters'] },
  { id: 'HIGH_STREET_ACTIVATION', name: 'High Street Activation', cluster: 'Experiential & Retail', defaultComponents: ['Pop-up Pod', 'Promoters', 'Branding'] },
  { id: 'MARKET_ACTIVATION', name: 'Market Activation', cluster: 'Experiential & Retail', defaultComponents: ['Kiosk', 'Promoters', 'Flyers'] },
  { id: 'APARTMENT_ACTIVATION', name: 'Apartment / Gated Community Activation', cluster: 'Residential', defaultComponents: ['Canopy', 'Promoters', 'Lead Capture', 'Sampling'] },
  { id: 'RESIDENTIAL_ROADSHOW', name: 'Residential Roadshow', cluster: 'Residential', defaultComponents: ['Mobile Van', 'Promoters', 'Sound System'] },
  { id: 'FB_SAMPLING', name: 'Food & Beverage Sampling', cluster: 'Sampling & Trial', defaultComponents: ['Chillers', 'Sampling Counter', 'Cups/Napkins', 'Promoters'] },
  { id: 'EXPERIENCE_ZONE', name: 'Experience Zone', cluster: 'Experiential & Events', defaultComponents: ['Fabrication', 'Interactive Tech', 'Workforce', 'Media'] },
  { id: 'POPUP_STORE', name: 'Pop-up Store', cluster: 'Experiential & Retail', defaultComponents: ['Retail Setup', 'Inventory POS', 'Staffing', 'Branding'] },
  { id: 'POPUP_EVENT', name: 'Pop-up Event', cluster: 'Experiential & Events', defaultComponents: ['Event Setup', 'Audio/Visual', 'Staffing'] },
  { id: 'BRAND_KIOSK', name: 'Brand Kiosk', cluster: 'Fabrication & Kiosks', defaultComponents: ['Kiosk Fabrication', 'Branding', 'Promoters'] },
  { id: 'INTERACTIVE_INSTALLATION', name: 'Interactive Installation', cluster: 'Technology & Engagement', defaultComponents: ['Hardware/LED', 'Software', 'Promoters'] },
  { id: 'GAMIFICATION_ACTIVATION', name: 'Gamification Activation', cluster: 'Technology & Engagement', defaultComponents: ['Touchscreen / Game Setup', 'Promoters', 'Prizes'] },
  { id: 'SPIN_THE_WHEEL', name: 'Spin-the-Wheel Campaign', cluster: 'Technology & Engagement', defaultComponents: ['Wheel Prop', 'Promoters', 'Reward Merchandise'] },
  { id: 'CONTEST_ACTIVATION', name: 'Contest Activation', cluster: 'Technology & Engagement', defaultComponents: ['Contest App', 'Promoters', 'Collateral'] },
  { id: 'QR_DIGITAL_ENGAGEMENT', name: 'QR / Digital Engagement', cluster: 'Technology & Engagement', defaultComponents: ['QR Standees', 'Promoters', 'Landing Page'] },
  { id: 'LEAD_GEN_ACTIVATION', name: 'Lead Generation Activation', cluster: 'Corporate & Direct', defaultComponents: ['Tablets/Forms', 'Trained Staff', 'Branded Booth'] },
  { id: 'DATA_COLLECTION', name: 'Data Collection Campaign', cluster: 'Corporate & Direct', defaultComponents: ['Auditors', 'Tablets', 'Questionnaires'] },
  { id: 'CUSTOMER_ACQUISITION', name: 'Customer Acquisition Campaign', cluster: 'Corporate & Direct', defaultComponents: ['Sales Promoters', 'Collateral', 'Incentives'] },
  { id: 'TEST_DRIVE_RIDE', name: 'Test Drive / Test Ride Campaign', cluster: 'Automotive & Mobility', defaultComponents: ['Test Track / Booth', 'Vehicles', 'Safety Gear', 'Rider Promoters'] },
  { id: 'DEMO_TOUR', name: 'Product Demonstration Tour', cluster: 'Mobile & Transit', defaultComponents: ['Tour Van', 'Demonstrator Staff', 'AV Equipment'] },
  { id: 'RETAIL_AUDIT', name: 'Retail Audit', cluster: 'Trade & Audits', defaultComponents: ['Ziggers Mystery Auditors', 'GPS App'] },
  { id: 'MYSTERY_SHOPPING', name: 'Mystery Shopping', cluster: 'Trade & Audits', defaultComponents: ['Mystery Shoppers', 'Reporting Portal'] },
  { id: 'MERCHANDISING_CAMPAIGN', name: 'Merchandising Campaign', cluster: 'Trade & Audits', defaultComponents: ['Merchandisers', 'POSM Kits'] },
  { id: 'STORE_LAUNCH', name: 'Store Launch', cluster: 'Retail & POSM', defaultComponents: ['Inauguration Setup', 'Promoters', 'Media', 'Celebrity/DJ'] },
  { id: 'DEALER_ACTIVATION', name: 'Dealer Activation', cluster: 'Trade & Channel', defaultComponents: ['Dealer Meet Setup', 'Gifts', 'Hostesses'] },
  { id: 'CHANNEL_PARTNER_ACTIVATION', name: 'Channel Partner Activation', cluster: 'Trade & Channel', defaultComponents: ['Exhibition Setup', 'Corporate Gifts'] },
  { id: 'TRADE_ACTIVATION', name: 'Trade Activation', cluster: 'Trade & Channel', defaultComponents: ['Trade Booth', 'Sales Staff'] },
  { id: 'DISTRIBUTOR_ENGAGEMENT', name: 'Distributor Engagement', cluster: 'Trade & Channel', defaultComponents: ['Conference Setup', 'Collateral'] },
  { id: 'CORPORATE_EVENT', name: 'Corporate Event', cluster: 'Corporate & B2B', defaultComponents: ['Stage/AV', 'Catering', 'Hostesses', 'Media'] },
  { id: 'CONFERENCE', name: 'Conference', cluster: 'Corporate & B2B', defaultComponents: ['Registration Desk', 'AV', 'Photographers'] },
  { id: 'EXHIBITION', name: 'Exhibition', cluster: 'Exhibitions & Trade Shows', defaultComponents: ['Stall Fabrication', 'Branding', 'Staff'] },
  { id: 'TRADE_SHOW', name: 'Trade Show', cluster: 'Exhibitions & Trade Shows', defaultComponents: ['Custom Stall', 'Hostesses', 'Lead App'] },
  { id: 'BRAND_EXPERIENCE_EVENT', name: 'Brand Experience Event', cluster: 'Experiential & Events', defaultComponents: ['Custom Decor', 'Lighting', 'Sound', 'Workforce'] },
  { id: 'MUSIC_EVENT_ACTIVATION', name: 'Music Event Activation', cluster: 'Entertainment & Nightlife', defaultComponents: ['Festival Pod', 'Lighting', 'Promoters', 'Sampling'] },
  { id: 'SPORTS_EVENT_ACTIVATION', name: 'Sports Event Activation', cluster: 'Sports & Fitness', defaultComponents: ['Turf Canopy', 'Energy Sampling', 'Promoters'] },
  { id: 'MARATHON_ACTIVATION', name: 'Marathon Activation', cluster: 'Sports & Fitness', defaultComponents: ['Cheer Squad', 'Hydration Stations', 'Promoters'] },
  { id: 'FESTIVAL_ACTIVATION', name: 'Festival Activation', cluster: 'Experiential & Events', defaultComponents: ['Festive Decor', 'Promoters', 'Sampling'] },
  { id: 'COMMUNITY_ACTIVATION', name: 'Community Activation', cluster: 'Residential', defaultComponents: ['Park Setup', 'Promoters', 'Engagements'] },
  { id: 'INFLUENCER_MEETUP', name: 'Influencer Meet-up', cluster: 'Influencer & Content', defaultComponents: ['Photo Booth', 'Catering', 'Media Crew', 'Gifting'] },
  { id: 'CREATOR_EVENT', name: 'Creator Event', cluster: 'Influencer & Content', defaultComponents: ['Lighting Stage', 'Video Crew', 'Hosts'] },
  { id: 'CAMPUS_FEST_ACTIVATION', name: 'Campus Fest Activation', cluster: 'Youth & Campus', defaultComponents: ['Fest Stall', 'Sound', 'Games', 'Promoters'] },
  { id: 'GAMING_ESPORTS_ACTIVATION', name: 'Gaming / Esports Activation', cluster: 'Gaming & Tech', defaultComponents: ['Gaming Rigs/Consoles', 'LED Displays', 'Promoters'] },
  { id: 'NIGHTLIFE_ACTIVATION', name: 'Nightlife Activation', cluster: 'Entertainment & Nightlife', defaultComponents: ['Bar Branding', 'Promoters', 'Photographers'] },
  { id: 'TRAVEL_HUB_ACTIVATION', name: 'Travel Hub Activation', cluster: 'Mobile & Transit', defaultComponents: ['Transit Kiosk', 'Promoters', 'Flyers'] },
  { id: 'TRANSIT_ACTIVATION', name: 'Transit Activation', cluster: 'Mobile & Transit', defaultComponents: ['Metro Platform Kiosk', 'Promoters'] },
  { id: 'AIRPORT_ACTIVATION', name: 'Airport Activation', cluster: 'Mobile & Transit', defaultComponents: ['Lounge Display', 'Trained Hostesses'] },
  { id: 'CINEMA_ACTIVATION', name: 'Cinema Activation', cluster: 'Entertainment & Nightlife', defaultComponents: ['Lobby Standees', 'Sampling Trays', 'Promoters'] },
  { id: 'GUERRILLA_ACTIVATION', name: 'Outdoor Guerrilla Activation', cluster: 'Street & Guerrilla', defaultComponents: ['Mobile Street Team', 'Props', 'Video Drone'] },
  { id: 'STREET_TEAM', name: 'Street Team Campaign', cluster: 'Street & Guerrilla', defaultComponents: ['Branded Uniforms', 'Promoters', 'Flyers'] },
  { id: 'FLASH_MOB', name: 'Flash Mob / Performance Activation', cluster: 'Street & Guerrilla', defaultComponents: ['Choreographer', 'Dancers', 'Video Crew'] },
  { id: 'VEHICLE_MOBILE_ACTIVATION', name: 'Vehicle / Mobile Activation', cluster: 'Mobile & Transit', defaultComponents: ['Wrapped Vehicle', 'Driver/Crew', 'Sound'] },
  { id: 'BRANDED_VAN_ROADSHOW', name: 'Branded Van Roadshow', cluster: 'Mobile & Transit', defaultComponents: ['Fabricated Van', 'Promoters', 'Sampling Stock'] },
  { id: 'AUTO_RICKSHAW_CAMPAIGN', name: 'Auto Rickshaw Campaign', cluster: 'Mobile & Transit', defaultComponents: ['Rickshaw Hood Wraps', 'Route Logistics'] },
  { id: 'HYPERLOCAL_MARKET', name: 'Hyperlocal Market Activation', cluster: 'Retail & POSM', defaultComponents: ['Street Kiosk', 'Promoters', 'Bilingual Staff'] },
  { id: 'DOOR_TO_DOOR', name: 'Door-to-Door Product Introduction', cluster: 'Residential', defaultComponents: ['Canvassers', 'Sample Kits', 'ID Cards'] },
  { id: 'COUPON_DISTRIBUTION', name: 'Coupon Distribution', cluster: 'Sampling & Trial', defaultComponents: ['Promoters', 'Vouchers', 'Flyers'] },
  { id: 'FLYER_DISTRIBUTION', name: 'Flyer Distribution', cluster: 'Sampling & Trial', defaultComponents: ['Promoters', 'Printed Collateral'] },
  { id: 'LOYALTY_ENROLLMENT', name: 'Loyalty Program Enrollment', cluster: 'Corporate & Direct', defaultComponents: ['Tablets', 'Registration Staff'] },
  { id: 'REFERRAL_CAMPAIGN', name: 'Referral Campaign Activation', cluster: 'Corporate & Direct', defaultComponents: ['Promoters', 'QR Cards'] },
  { id: 'CSR_COMMUNITY', name: 'CSR / Community Engagement Activation', cluster: 'Community & Social', defaultComponents: ['Community Kits', 'Volunteers/Staff', 'Media'] },
  { id: 'SUSTAINABILITY_RECYCLING', name: 'Sustainability / Recycling Activation', cluster: 'Community & Social', defaultComponents: ['Collection Bins', 'Promoters', 'Gifts'] },
  { id: 'SURVEY_CONSUMER_RESEARCH', name: 'Survey & Consumer Research Activation', cluster: 'Trade & Audits', defaultComponents: ['Survey Promoters', 'Digital Forms', 'Incentives'] },
  { id: 'FEEDBACK_COLLECTION', name: 'Feedback Collection Campaign', cluster: 'Trade & Audits', defaultComponents: ['Auditors', 'Tablets'] }
];

export const FULFILLMENT_MODES = {
  CLIENT_HANDLES: 'CLIENT_HANDLES',
  EXISTING_VENDOR: 'EXISTING_VENDOR',
  ZIGGERS_PARTNER: 'ZIGGERS_PARTNER',
  ZIGGERS_EXECUTE: 'ZIGGERS_EXECUTE',
  NOT_REQUIRED: 'NOT_REQUIRED'
};

/**
 * OBJECTIVE-DRIVEN ACTIVATION PLANNER
 * Determines what activation is required to achieve the selected campaign objective
 */
export function generateObjectiveActivationPlan({
  objective = 'Product Sampling',
  btlFormat = '',
  brandName = 'Brand',
  brandCategory = 'Retail',
  productLine = 'Consumer Product',
  audienceName = 'Target Audience',
  ageRange = [20, 35],
  environments = [],
  city = 'Chennai'
}) {
  const isAuto = brandCategory.toLowerCase().includes('auto') || brandCategory.toLowerCase().includes('motorcycle');
  const isTech = brandCategory.toLowerCase().includes('tech') || brandCategory.toLowerCase().includes('saas') || brandCategory.toLowerCase().includes('software');
  const isFood = brandCategory.toLowerCase().includes('food') || brandCategory.toLowerCase().includes('beverage') || brandCategory.toLowerCase().includes('qsr') || brandCategory.toLowerCase().includes('fmcg');

  const objLower = objective.toLowerCase();

  // 1. BRAND AWARENESS
  if (objLower.includes('awareness') || objLower.includes('visibility') || objLower.includes('reach')) {
    const activationName = isAuto 
      ? `${brandName} Performance Showcase & Biker Experience Pod` 
      : `${brandName} High-Impact Brand Experience Zone`;
    return {
      activationName: btlFormat || activationName,
      objective: 'Brand Awareness & High-Visibility Reach',
      strategicFocus: 'Pedestrian Reach • Visual Dwell Time • Social Content UGC',
      whyThisActivationFits: `Maximizes brand visual impact across high-dwell pedestrian environments in ${city}. Focuses on immersive branding, 20-second elevator pitches, and shareable photo opportunities to build top-of-mind affinity with ${audienceName}.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Shopping Malls • High Streets • Colleges',
      executionFlow: [
        '1. Set up high-visibility branded experience zone and illuminated backdrops',
        '2. Deploy Ziggers verified brand promoters and team supervisor',
        '3. Engage passing footfall with compelling 20-second brand stories',
        '4. Direct interested consumers to interactive display pods & photo moments',
        '5. Issue dynamic QR codes for digital contest entry & social sharing',
        '6. Monitor pedestrian engagement throughput and dwell velocity',
        '7. Capture GPS-stamped photo proof and promoter attendance telemetry',
        '8. Synthesize end-of-day reach and interaction performance dashboard'
      ]
    };
  }

  // 2. PRODUCT SAMPLING
  if (objLower.includes('sampling') || objLower.includes('taste') || objLower.includes('sample')) {
    const activationName = isFood
      ? `${brandName} Fresh Flavor Taste & Sampling Kiosk`
      : `${brandName} Product Sampling & Trial Kiosk`;
    return {
      activationName: btlFormat || activationName,
      objective: 'Direct Consumer Product Sampling & First-Hand Trial',
      strategicFocus: 'Sample Units Distributed • Audience Relevance • Taste Verification',
      whyThisActivationFits: `Puts physical samples directly into the hands of ${audienceName}. Eliminates trial friction and captures genuine consumer taste reaction and instant purchase interest in ${city}.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Colleges • Food Courts • Gyms • Tech Parks',
      executionFlow: [
        '1. Position hygienic sampling counter with branded POSM dispensers',
        '2. Check in trained sampling crew with biometric / GPS geofencing',
        '3. Approach target demographic with structured product trial invitations',
        '4. Administer product samples with hygiene compliance and napkins/cups',
        '5. Prompt consumers to scan QR for instant discount vouchers on retail packs',
        '6. Log real-time sample distribution counts and stock velocity',
        '7. Capture watermarked photo proof and sample batch accountability',
        '8. Generate daily sampling conversion and audience feedback report'
      ]
    };
  }

  // 3. PRODUCT TRIAL / TEST RIDE / DEMO
  if (objLower.includes('trial') || objLower.includes('demo') || objLower.includes('test drive') || objLower.includes('test ride')) {
    const activationName = isAuto
      ? `${brandName} Dynamic Test Ride & Track Experience Pod`
      : `${brandName} Interactive Product Demonstration Zone`;
    return {
      activationName: btlFormat || activationName,
      objective: 'Hands-On Product Trial & High-Intent Conversion',
      strategicFocus: 'Qualified Test Rides/Trials • Lead Capture • Direct Conversion',
      whyThisActivationFits: `Enables ${audienceName} to experience real performance, ergonomics, and value propositions first-hand. Direct trial experience drives high consideration into showroom bookings.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Dealership Corridors • Biker Cafes • Highway Hubs',
      executionFlow: [
        '1. Set up test-ride / demonstration registration lounge and safety barrier track',
        '2. Deploy certified product demonstrators and safety marshals',
        '3. Qualify prospective buyers and verify driving license credentials',
        '4. Conduct guided product demonstration and assisted vehicle test ride',
        '5. Capture test feedback and issue on-spot dealership booking incentives',
        '6. Record digital test-ride telemetry and prospective buyer contact details',
        '7. Collect GPS-tagged photo evidence of customer handover',
        '8. Deliver verified high-intent leads to regional sales team'
      ]
    };
  }

  // 4. LEAD GENERATION
  if (objLower.includes('lead') || objLower.includes('acquisition') || objLower.includes('sign-up') || objLower.includes('install')) {
    const activationName = isTech
      ? `${brandName} Corporate B2B Lead Gen & Workflow Consultation Hub`
      : `${brandName} Direct Customer Acquisition & Lead Capture Booth`;
    return {
      activationName: btlFormat || activationName,
      objective: 'High-Intent Customer Acquisition & Lead Capture',
      strategicFocus: 'Verified Leads • Cost Per Lead (CPL) • Immediate Sign-Ups',
      whyThisActivationFits: `Engages qualified business decision makers and aspirational consumers. Collects verified contact details and schedules follow-up demos with minimal customer drop-off.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'IT Parks • Co-Working Hubs • Business Summits',
      executionFlow: [
        '1. Set up professional consultation lounge with tablet registration pods',
        '2. Deploy articulate sales promoters trained on product value propositions',
        '3. Engage passing professionals with targeted problem-solving pitch',
        '4. Conduct 2-minute live interactive software/product demonstration',
        '5. Capture OTP-verified lead details with instant cloud credits voucher',
        '6. Track real-time cost-per-lead (CPL) and hourly conversion velocity',
        '7. Authenticate verified lead entries against fraud prevention checks',
        '8. Push verified leads directly to client CRM with full attribution report'
      ]
    };
  }

  // 5. SALES & CONVERSION / ENGAGEMENT DEFAULT
  return {
    activationName: btlFormat || `${brandName} Direct Consumer Engagement & Conversion Drive`,
    objective: 'Consumer Engagement, Direct Conversion & Sales Uplift',
    strategicFocus: 'Customer Interactions • Voucher Redemptions • Sales Velocity',
    whyThisActivationFits: `Creates high-energy interactive touchpoints that educate ${audienceName}, drive impulse purchasing, and reward on-ground engagement.`,
    targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
    recommendedLocations: (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Retail High Streets • Malls • Commercial Hubs',
    executionFlow: [
      '1. Erect branded interactive kiosk and promotional gantry',
      '2. Deploy energetic promoters and team supervisor',
      '3. Initiate consumer conversations with interactive games / spin-the-wheel',
      '4. Distribute product brochures, promotional flyers, and discount vouchers',
      '5. Facilitate on-spot merchant purchases and digital QR redemptions',
      '6. Monitor hourly interaction counts and voucher utilization rates',
      '7. Collect geotagged execution photos and promoter attendance logs',
      '8. Compile end-of-campaign ROI and retail sales uplift report'
    ]
  };
}

/**
 * ACTIVATION REQUIREMENTS GENERATOR
 * Decomposes an approved activation plan into structured, categorized requirements
 */
export function generateActivationRequirements({
  activationPlan,
  objective = 'Product Sampling',
  brandCategory = 'Retail',
  productLine = 'Consumer Product',
  brandName = 'Brand',
  locationsCount = 1,
  city = 'Chennai'
}) {
  const isAuto = brandCategory.toLowerCase().includes('auto') || brandCategory.toLowerCase().includes('motorcycle');
  const isFood = brandCategory.toLowerCase().includes('food') || brandCategory.toLowerCase().includes('beverage') || brandCategory.toLowerCase().includes('qsr') || brandCategory.toLowerCase().includes('fmcg');
  const isTech = brandCategory.toLowerCase().includes('tech') || brandCategory.toLowerCase().includes('saas') || brandCategory.toLowerCase().includes('software');

  return [
    {
      id: 'REQ_WORKFORCE',
      reqCategory: '1. Workforce',
      title: 'On-Ground Promoters & Field Supervisors',
      requirementText: `${locationsCount * 4} Trained Brand Promoters + ${Math.max(1, Math.ceil(locationsCount * 4 / 10))} Field Supervisor`,
      desc: 'Ziggers certified brand promoters and field supervisor with GPS check-in compliance, standardized dress code, and active interaction logging.',
      canZiggersExecute: true,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_EXECUTE,
      deliverables: ['Trained Promoters', 'Field Supervisors', 'Biometric / GPS Check-In Tracking'],
      estimatedCost: 'Calculated via Ziggers Workforce Waterfall'
    },
    {
      id: 'REQ_PROPS_SETUP',
      reqCategory: '2. Props & Physical Setup',
      title: 'Sampling Counter, Booth & Backdrops',
      requirementText: isAuto ? 'Vehicle Display Ramp & Registration Pod' : 'Branded Sampling Counter & Backdrops',
      desc: isAuto
        ? 'Heavy-duty steel vehicle display ramp, test-ride registration desk, safety flags, and barrier structures.'
        : 'Modular portable sampling counter, 8x6 ft sturdy backdrop frame, and product presentation shelves.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['Sampling Counter / Ramp', 'Steel/Wood Backdrop Frame', 'Lighting & Display Pods'],
      estimatedCost: '₹25,000 – ₹60,000'
    },
    {
      id: 'REQ_EQUIPMENT',
      reqCategory: '3. Equipment & Audio/Visual',
      title: 'Canopy Tent, Audio Sound System & Power Backup',
      requirementText: '10x10 Gazebo Canopy + PA Sound System + Power Hub',
      desc: 'All-weather waterproof canopy tent, high-clarity wireless PA mic and speaker system, and portable power extension hub.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['10x10 Gazebo Tent', 'Portable PA Speaker & Wireless Mic', 'Power Hub'],
      estimatedCost: '₹8,000 – ₹18,000'
    },
    {
      id: 'REQ_CREATIVE_BRANDING',
      reqCategory: '4. Creative & Branding',
      title: 'Key Visuals, Standees, Flyers & Uniforms',
      requirementText: '4 Roll-up Standees + 1,000 Flyers + Branded T-Shirts',
      desc: 'High-resolution graphic design files, star-flex vinyl standees, promotional discount handouts, and branded promoter polo t-shirts.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
      deliverables: ['Key Visual Vector Files', '4 Roll-up Standees', '1,000 Printed Flyers', 'Branded T-Shirts'],
      estimatedCost: '₹15,000 – ₹32,000'
    },
    {
      id: 'REQ_PRODUCT_INVENTORY',
      reqCategory: '5. Product / Inventory',
      title: 'Product Stock Units & Sampling Supplies',
      requirementText: isFood ? 'Chilled Product Units + Tasting Cups + Bins' : 'Product Demonstration Units + Catalogs',
      desc: isFood
        ? 'Fresh sealed product inventory batch, food-grade sampling cups, presentation trays, and hygienic disposal bins.'
        : 'Display product units, functional test demonstration kits, and detailed specification brochures.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
      deliverables: ['Inventory Stock Batch', 'Tasting Accessories / Demo Units', 'Stock Velocity Sheet'],
      estimatedCost: 'Client In-Kind Inventory'
    },
    {
      id: 'REQ_LOGISTICS',
      reqCategory: '6. Logistics & Transport',
      title: 'Material Transportation & Venue Delivery',
      requirementText: 'Venue Transport Vehicle & Material Loading/Unloading',
      desc: 'Safe transit of fabricated booth components, printed standees, and stock inventory from warehouse to venue with morning setup delivery.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['Venue Transport Vehicle', 'Safe Morning Unloading', 'End-of-Day Material Return'],
      estimatedCost: '₹6,000 – ₹15,000'
    },
    {
      id: 'REQ_TRAINING',
      reqCategory: '7. Training & Briefing',
      title: 'Standardized 20-Sec Script & Digital Briefing',
      requirementText: 'Pitch Script PDF + Product FAQ Deck + Pre-Shift Test',
      desc: 'Structured 20-second consumer pitch script, handling common product FAQs, objection responses, and mandatory pre-shift digital onboarding module.',
      canZiggersExecute: true,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_EXECUTE,
      deliverables: ['Pitch Script PDF', 'FAQ Flashcard Deck', 'Ziggers Digital Briefing Module'],
      estimatedCost: 'Included in Ziggers Execute'
    },
    {
      id: 'REQ_TECHNOLOGY',
      reqCategory: '8. Technology & Lead Capture',
      title: 'Dynamic QR Vouchers & Lead Collection Portal',
      requirementText: 'Dynamic QR Standee + Instant SMS Voucher System',
      desc: 'Custom branded QR code standee allowing consumers to scan for instant discount vouchers, app downloads, and OTP-verified feedback.',
      canZiggersExecute: isTech,
      suggestedFulfillment: isTech ? FULFILLMENT_MODES.ZIGGERS_EXECUTE : FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['Dynamic QR Code Standee', 'Instant SMS Voucher Engine', 'Real-time Lead Dashboard'],
      estimatedCost: '₹5,000 – ₹12,000'
    },
    {
      id: 'REQ_PERMISSIONS',
      reqCategory: '9. Permissions & Clearances',
      title: 'Venue NOC & Activity Clearances',
      requirementText: 'Mall / College / Venue Entry Clearances & NOCs',
      desc: 'Obtaining venue management permission letter, gate passes, electrical load approvals, and local municipal/police permissions where statutory.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
      deliverables: ['Venue Permission Letter / NOC', 'Promoter Gate Passes', 'Power Connection Approval'],
      estimatedCost: 'As applicable per venue'
    },
    {
      id: 'REQ_DOCUMENTATION',
      reqCategory: '10. Documentation & Media',
      title: 'Photography, Video Reels & Aftermovie',
      requirementText: '50+ High-Res Photos + 2 Social Reels + Recap Video',
      desc: 'Professional on-ground DSLR photography capturing consumer interactions, 9:16 vertical video reels for social media, and 60-second campaign recap.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['50+ Edited High-Res Photos', '2 Vertical Social Reels', '60-Sec Campaign Recap Video'],
      estimatedCost: '₹15,000 – ₹30,000'
    }
  ];
}

/**
 * Verified Indian BTL Partners Network Directory
 */
export const VERIFIED_PARTNER_DIRECTORY = [
  // Creative & Marketing
  {
    id: 'PARTNER_CRT_01',
    name: 'PixelCraft Creative Labs',
    category: PARTNER_CATEGORIES.CREATIVE_AND_MARKETING_AGENCIES.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Hyderabad'],
    rating: 4.9,
    reviewsCount: 42,
    turnaroundDays: 3,
    budgetTier: '₹15,000 – ₹35,000',
    specialties: ['BTL Key Visuals', 'Booth Vector Art', 'Social Reels'],
    contactPerson: 'Arun V.',
    verified: true
  },
  {
    id: 'PARTNER_CRT_02',
    name: 'BrandAxis Media & Design',
    category: PARTNER_CATEGORIES.CREATIVE_AND_MARKETING_AGENCIES.id,
    city: 'Bengaluru',
    supportedCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai'],
    rating: 4.8,
    reviewsCount: 68,
    turnaroundDays: 2,
    budgetTier: '₹20,000 – ₹45,000',
    specialties: ['Experiential Visuals', 'Campaign Packaging', 'Motion Graphics'],
    contactPerson: 'Pooja Sharma',
    verified: true
  },
  // Fabrication & Production
  {
    id: 'PARTNER_FAB_01',
    name: 'Apex Expo & Booth Fabricators',
    category: PARTNER_CATEGORIES.FABRICATION_AND_PRODUCTION_PARTNERS.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Coimbatore'],
    rating: 4.9,
    reviewsCount: 84,
    turnaroundDays: 4,
    budgetTier: '₹30,000 – ₹75,000',
    specialties: ['Custom Kiosks', 'Sampling Bars', 'Automotive Ramps', 'LED Backdrops'],
    contactPerson: 'Karthik Raja',
    verified: true
  },
  {
    id: 'PARTNER_FAB_02',
    name: 'Vanguard Production Works',
    category: PARTNER_CATEGORIES.FABRICATION_AND_PRODUCTION_PARTNERS.id,
    city: 'Bengaluru',
    supportedCities: ['Bengaluru', 'Hyderabad', 'Pune'],
    rating: 4.7,
    reviewsCount: 56,
    turnaroundDays: 5,
    budgetTier: '₹35,000 – ₹90,000',
    specialties: ['Mall Experience Zones', 'Stall Fabrication', 'Interactive Pods'],
    contactPerson: 'Deepak Nair',
    verified: true
  },
  // Printing & Branding
  {
    id: 'PARTNER_PRN_01',
    name: 'ColorPrint Pro Media',
    category: PARTNER_CATEGORIES.PRINTING_AND_BRANDING_PARTNERS.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Hyderabad'],
    rating: 4.9,
    reviewsCount: 112,
    turnaroundDays: 1,
    budgetTier: '₹10,000 – ₹25,000',
    specialties: ['Same-Day Vinyl', 'Star Flex Standees', 'Screen Printed T-shirts'],
    contactPerson: 'Suresh Kumar',
    verified: true
  },
  // Equipment & Rentals
  {
    id: 'PARTNER_EQP_01',
    name: 'SoundWave & Staging Solutions',
    category: PARTNER_CATEGORIES.EVENT_EQUIPMENT_AND_RENTAL_PARTNERS.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Hyderabad'],
    rating: 4.8,
    reviewsCount: 76,
    turnaroundDays: 1,
    budgetTier: '₹8,000 – ₹20,000',
    specialties: ['Outdoor Gazebos', 'JBL Sound Systems', 'Silent Generators'],
    contactPerson: 'Manoj Pillai',
    verified: true
  },
  // Media & Documentation
  {
    id: 'PARTNER_MED_01',
    name: 'LensFocus Event Media',
    category: PARTNER_CATEGORIES.MEDIA_AND_DOCUMENTATION_PARTNERS.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai'],
    rating: 4.9,
    reviewsCount: 51,
    turnaroundDays: 2,
    budgetTier: '₹15,000 – ₹30,000',
    specialties: ['DSLR Event Photos', '4K Drone Coverage', 'Viral Vertical Reels'],
    contactPerson: 'Vikram S.',
    verified: true
  },
  // Logistics
  {
    id: 'PARTNER_LOG_01',
    name: 'FastTrack Event Freight',
    category: PARTNER_CATEGORIES.LOGISTICS_AND_OPERATIONS_PARTNERS.id,
    city: 'Chennai',
    supportedCities: ['Chennai', 'Bengaluru', 'Hyderabad', 'Delhi NCR', 'Mumbai'],
    rating: 4.8,
    reviewsCount: 93,
    turnaroundDays: 1,
    budgetTier: '₹6,000 – ₹15,000',
    specialties: ['Last-Mile Venue Delivery', 'Weekend Event Moves', 'Reverse Logistics'],
    contactPerson: 'Ramesh Reddy',
    verified: true
  }
];
