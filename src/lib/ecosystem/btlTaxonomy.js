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
 * OBJECTIVE-DRIVEN ACTIVATION PLANNER (TOP 3 PLANS ENGINE)
 * Generates the top 3 distinct, tailored activation concepts for any campaign objective and brand
 */
export function generateTopObjectiveActivationPlans({
  objective = 'Product Sampling',
  brandName = 'Brand',
  brandCategory = 'Retail',
  productLine = 'Consumer Product',
  audienceName = 'Target Audience',
  ageRange = [20, 35],
  environments = [],
  city = 'Chennai'
}) {
  const allContext = `${brandCategory} ${productLine} ${brandName}`.toLowerCase();
  const isAuto = allContext.includes('auto') || allContext.includes('motorcycle') || allContext.includes('bike') || allContext.includes('scooter') || allContext.includes('car') || allContext.includes('vehicle');
  const isTech = allContext.includes('tech') || allContext.includes('saas') || allContext.includes('software') || allContext.includes('app') || allContext.includes('cloud') || allContext.includes('crm');
  const isFood = allContext.includes('food') || allContext.includes('beverage') || allContext.includes('qsr') || allContext.includes('fmcg') || allContext.includes('coffee') || allContext.includes('snack') || allContext.includes('tea');
  const isFashion = allContext.includes('fashion') || allContext.includes('apparel') || allContext.includes('lifestyle') || allContext.includes('saree') || allContext.includes('clothing') || allContext.includes('shoe');

  const objLower = (objective || '').toLowerCase();
  const envSlice = (environments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Commercial Hubs • Shopping Malls • Tech Parks';

  // 1. BRAND AWARENESS & VISIBILITY
  if (objLower.includes('awareness') || objLower.includes('visibility') || objLower.includes('reach')) {
    return [
      {
        id: 'plan_1',
        badge: '★ Recommended #1: Flagship Experience Hub',
        conceptType: 'Flagship Experiential Hub',
        activationName: isAuto 
          ? `${brandName} Performance Showcase & Biker Experience Pod` 
          : (isFood ? `${brandName} Flavor Immersion & Sensory Experience Lounge` : `${brandName} High-Impact Brand Experience Zone`),
        objective: 'Brand Awareness & High-Visibility Reach',
        strategicFocus: 'Pedestrian Reach • Visual Dwell Time • Social Content UGC',
        whyThisActivationFits: `Maximizes brand visual impact across high-dwell pedestrian environments in ${city}. Focuses on immersive branding, 20-second elevator pitches, and shareable photo opportunities to build top-of-mind affinity with ${audienceName}.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: envSlice,
        suitabilityScore: 96,
        projectedThroughput: '800–1,200 high-dwell consumer engagements per shift',
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
      },
      {
        id: 'plan_2',
        badge: '⚡ Option #2: High-Velocity Pop-Up & Street Team',
        conceptType: 'Mobile Pop-Up & Street Team',
        activationName: `${brandName} Metro Transit & Street Sprint Team`,
        objective: 'Brand Awareness & Rapid Footfall Exposure',
        strategicFocus: 'High Volume Reach • Rapid Engagement • Multi-Node Coverage',
        whyThisActivationFits: `Deploys agile, high-energy brand ambassadors across prime transit stations, pedestrian bridges, and high-traffic intersections in ${city} for rapid mass visibility.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Metro Stations • High Street Junctions • College Commercial Strips',
        suitabilityScore: 92,
        projectedThroughput: '1,800–2,500 passing consumer touchpoints per shift',
        executionFlow: [
          '1. Dispatch agile 2-person mobile teams equipped with branded apparel and eye-catching props',
          '2. Synchronize start times with peak morning and evening transit rush hours',
          '3. Deliver 10-second memorable brand hooks and distribute premium visual lookbooks',
          '4. Direct pedestrians to nearby flagship retail stores or digital experience portals',
          '5. Track real-time distribution rate and street corridor footfall velocity',
          '6. Capture verified geotagged photo proof across all dispatched street nodes'
        ]
      },
      {
        id: 'plan_3',
        badge: '🎯 Option #3: Co-Working & Corporate Atrium Takeover',
        conceptType: 'Corporate & Community Takeover',
        activationName: `${brandName} Executive Corporate Lounge & Atrium Showcase`,
        objective: 'Targeted High-SEC Awareness & Professional Word-of-Mouth',
        strategicFocus: 'Qualified SEC A/B Reach • High Dwell Discussion • Influencer Discovery',
        whyThisActivationFits: `Places the brand directly inside tier-1 corporate tech parks and premium co-working spaces in ${city}, capturing salaried decision-makers during lunch hours and coffee breaks.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Tech Park Atriums • Co-Working Lounges • Executive Food Courts',
        suitabilityScore: 89,
        projectedThroughput: '600–900 corporate professional conversations per shift',
        executionFlow: [
          '1. Fabricate sleek, minimalist corporate display kiosk in office cafeteria / atrium',
          '2. Staff with articulate brand specialists trained on executive product value',
          '3. Host lunchtime interactive product discovery sessions with exclusive perks',
          '4. Facilitate digital business card exchange and priority corporate discount codes',
          '5. Gather qualitative executive feedback and sentiment metrics'
        ]
      }
    ];
  }

  // 2. PRODUCT SAMPLING
  if (objLower.includes('sampling') || objLower.includes('taste') || objLower.includes('sample')) {
    return [
      {
        id: 'plan_1',
        badge: '★ Recommended #1: Flagship Experiential Sampling Kiosk',
        conceptType: 'Flagship Experiential Sampling Kiosk',
        activationName: isFood
          ? `${brandName} Fresh Flavor Taste & Sampling Kiosk`
          : (isAuto ? `${brandName} Hands-On Touch & Ergonomics Trial Pod` : `${brandName} Experiential Product Sampling & Trial Kiosk`),
        objective: 'Direct Consumer Product Sampling & First-Hand Trial',
        strategicFocus: 'Sample Units Distributed • Audience Relevance • Taste Verification',
        whyThisActivationFits: `Puts physical samples directly into the hands of ${audienceName}. Eliminates trial friction and captures genuine consumer taste reaction and instant purchase interest in ${city}.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: envSlice,
        suitabilityScore: 96,
        projectedThroughput: '1,200–1,600 verified product samples distributed per shift',
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
      },
      {
        id: 'plan_2',
        badge: '⚡ Option #2: High-Velocity Flash Chilled Sampling Team',
        conceptType: 'Mobile Chilled Backpack / Street Team',
        activationName: `${brandName} High-Velocity Mobile Sampling Blitz`,
        objective: 'Mass Trial Velocity & High-Density Distribution',
        strategicFocus: 'Speed of Handout • Mass Trial • Heat/Peak Hour Targeting',
        whyThisActivationFits: `Promoters equipped with branded dispensers distribute rapid trial units during peak afternoon heat or evening rush, maximizing total trial reach across ${city}.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Transit Interchanges • College Gates • Sports Turfs • High Street Sidewalks',
        suitabilityScore: 93,
        projectedThroughput: '2,000–2,800 sample units distributed per shift',
        executionFlow: [
          '1. Equip field promoters with ergonomic branded distribution packs and stock',
          '2. Position mobile pairs at high-density footfall bottleneck gates',
          '3. Provide rapid 5-second product introduction and sample handover',
          '4. Direct consumers via quick QR scan on packaging for digital feedback',
          '5. Restock via mobile supply runner every 90 minutes',
          '6. Log batch serialization and hourly distribution tally'
        ]
      },
      {
        id: 'plan_3',
        badge: '🎯 Option #3: Storefront & Supermarket Sampling Bar',
        conceptType: 'Retailer Point-of-Sale Conversion Bar',
        activationName: `${brandName} Point-of-Sale Taste & Instant Purchase Bar`,
        objective: 'Immediate Retail Shelf Off-Take & Basket Conversion',
        strategicFocus: 'Trial-to-Buy Conversion • Immediate Supermarket Sales • Retailer Goodwill',
        whyThisActivationFits: `Stations the sampling counter immediately outside or inside partner supermarket chains and modern trade stores in ${city} to turn trial into instant cart additions.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Supermarkets • Hypermarket Entrances • Mall Grocery Zones',
        suitabilityScore: 90,
        projectedThroughput: '700–1,000 samples with 35%+ immediate retail purchase rate',
        executionFlow: [
          '1. Set up licensed sampling station at aisle-end or store entrance',
          '2. Offer freshly served sample to shoppers entering the grocery aisle',
          '3. Provide instant ₹20–₹50 immediate checkout coupon with multi-pack purchase',
          '4. Coordinate with store inventory manager to ensure shelf stock replenishment',
          '5. Track daily register sales uplift vs non-activation baseline'
        ]
      }
    ];
  }

  // 3. PRODUCT TRIAL / TEST RIDE / DEMO
  if (objLower.includes('trial') || objLower.includes('demo') || objLower.includes('test drive') || objLower.includes('test ride')) {
    return [
      {
        id: 'plan_1',
        badge: '★ Recommended #1: Flagship Test & Track Experience Pod',
        conceptType: 'Dedicated Test Track & Experience Pod',
        activationName: isAuto
          ? `${brandName} Dynamic Test Ride & Track Experience Pod`
          : `${brandName} Interactive Product Demonstration Zone`,
        objective: 'Hands-On Product Trial & High-Intent Conversion',
        strategicFocus: 'Qualified Test Rides/Trials • Lead Capture • Direct Conversion',
        whyThisActivationFits: `Enables ${audienceName} to experience real performance, ergonomics, and value propositions first-hand in ${city}. Direct trial experience drives high consideration into showroom bookings.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: envSlice,
        suitabilityScore: 96,
        projectedThroughput: '150–250 assisted deep product trials / rides per shift',
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
      },
      {
        id: 'plan_2',
        badge: '⚡ Option #2: Corporate Park Pop-Up Test Hub',
        conceptType: 'Corporate Tech Park Trial Pop-Up',
        activationName: `${brandName} Workplace Commuter Test-Ride Drive`,
        objective: 'Salaried Professional Test Conversion',
        strategicFocus: 'Corporate Upgrades • EMI Consultations • Easy Campus Trials',
        whyThisActivationFits: `Brings test vehicles and demo units directly into corporate campus parking zones and tech park promenades in ${city}, letting salaried commuters test during work hours.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'IT SEZ Campuses • Financial Hubs • Corporate Parking Plazas',
        suitabilityScore: 92,
        projectedThroughput: '180–300 corporate test drives with on-spot finance approvals',
        executionFlow: [
          '1. Secure campus permission and designate safe test-loop perimeter',
          '2. Deploy corporate facilitators and digital loan finance consultants',
          '3. Offer express 10-minute test rides during lunch and evening break hours',
          '4. Provide instant corporate exchange bonus calculations',
          '5. Schedule doorstep home delivery for interested buyers'
        ]
      },
      {
        id: 'plan_3',
        badge: '🎯 Option #3: Weekend Enthusiast Pit-Stop Meet',
        conceptType: 'Community Breakfast Pit-Stop & Meet',
        activationName: `${brandName} Weekend Highway Biker Pit-Stop & Test Ride`,
        objective: 'Community Advocacy & Experiential Demonstration',
        strategicFocus: 'Enthusiast Engagement • Route Testing • Community Word-of-Mouth',
        whyThisActivationFits: `Captures active enthusiasts at weekend highway rest stops and breakfast cafes in ${city}, converting lifestyle riders into verified brand advocates.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Biker Cafes • Highway Fuel Plazas • Scenic Boulevard Turnoffs',
        suitabilityScore: 89,
        projectedThroughput: '200+ enthusiast test runs with high social media sharing',
        executionFlow: [
          '1. Host branded pit-stop tent with complimentary coffee and chain lube check',
          '2. Invite riders to take the flagship model on a designated 5km highway stretch',
          '3. Capture professional photo of rider with bike for instant WhatsApp delivery',
          '4. Distribute limited-edition enthusiast merchandise and dealership vouchers'
        ]
      }
    ];
  }

  // 4. LEAD GENERATION & CUSTOMER ACQUISITION
  if (objLower.includes('lead') || objLower.includes('acquisition') || objLower.includes('sign-up') || objLower.includes('install')) {
    return [
      {
        id: 'plan_1',
        badge: '★ Recommended #1: Consultation Lounge & Acquisition Pod',
        conceptType: 'Consultation Lounge & On-Spot Sign-Up Pod',
        activationName: isTech
          ? `${brandName} Corporate B2B Lead Gen & Workflow Consultation Hub`
          : `${brandName} Direct Customer Acquisition & Lead Capture Booth`,
        objective: 'High-Intent Customer Acquisition & Lead Capture',
        strategicFocus: 'Verified Leads • Cost Per Lead (CPL) • Immediate Sign-Ups',
        whyThisActivationFits: `Engages qualified business decision makers and aspirational consumers. Collects verified contact details and schedules follow-up demos with minimal customer drop-off in ${city}.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: envSlice,
        suitabilityScore: 96,
        projectedThroughput: '180–320 OTP-verified qualified leads per shift',
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
      },
      {
        id: 'plan_2',
        badge: '⚡ Option #2: Transit & Metro Rapid Install Kiosk',
        conceptType: 'Rapid Digital App Install Kiosk',
        activationName: `${brandName} High-Traffic Metro App Install Station`,
        objective: 'Fast App Downloads & First Transaction Onboarding',
        strategicFocus: 'CPA Efficiency • Verified First Order • App Store Conversion',
        whyThisActivationFits: `Positions dedicated digital promoters at metro concourses to guide commuters through on-spot app download and first transactional interaction.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'Metro Ticketing Concourses • Suburban Railway Hubs • Bus Terminals',
        suitabilityScore: 92,
        projectedThroughput: '400–650 verified app installs and registrations per shift',
        executionFlow: [
          '1. Set up illuminated banner station with dedicated QR code download badges',
          '2. Assist users with quick 60-second app installation and OTP sign-up',
          '3. Unlock instant ₹100 first-order wallet credit or free welcome gift',
          '4. Verify install via server-to-server referral attribution webhook',
          '5. Monitor live install velocity and fraud prevention device checks'
        ]
      },
      {
        id: 'plan_3',
        badge: '🎯 Option #3: Co-Working Founder Lunch & Demo Desk',
        conceptType: 'Startup Incubator & Founder Desk',
        activationName: `${brandName} Incubator Demo Desk & Founder Credits Drive`,
        objective: 'B2B Founder Lead Capture & Workflow Trials',
        strategicFocus: 'High LTV Leads • Direct Founder Conversations • Free Tier Upgrades',
        whyThisActivationFits: `Hosts a dedicated solution advisory desk in top startup hubs, offering live architecture reviews and customized pricing for growing businesses.`,
        targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
        recommendedLocations: 'WeWork • 91springboard • Startup Incubators • Tech Cafes',
        suitabilityScore: 89,
        projectedThroughput: '80–140 high-value B2B founder leads per shift',
        executionFlow: [
          '1. Reserve lounge desk in partner co-working center during community lunch',
          '2. Deliver free 1-on-1 workflow optimization audits to startup operators',
          '3. Issue exclusive $1,000 equivalent platform credits with corporate email sign-up',
          '4. Schedule automated follow-up product consultation with account executive'
        ]
      }
    ];
  }

  // 5. SALES & CONVERSION / ENGAGEMENT DEFAULT
  return [
    {
      id: 'plan_1',
      badge: '★ Recommended #1: Interactive Promotional Gantry & Kiosk',
      conceptType: 'Promotional Gantry & Interactive Kiosk',
      activationName: `${brandName} Direct Consumer Engagement & Conversion Drive`,
      objective: 'Consumer Engagement, Direct Conversion & Sales Uplift',
      strategicFocus: 'Customer Interactions • Voucher Redemptions • Sales Velocity',
      whyThisActivationFits: `Creates high-energy interactive touchpoints that educate ${audienceName}, drive impulse purchasing, and reward on-ground engagement in ${city}.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: envSlice,
      suitabilityScore: 96,
      projectedThroughput: '900–1,400 consumer interactions with 25%+ voucher utilization',
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
    },
    {
      id: 'plan_2',
      badge: '⚡ Option #2: High-Street Flash Sales Team',
      conceptType: 'High-Street Flash Activation',
      activationName: `${brandName} Commercial High-Street Flash Sales Sprint`,
      objective: 'Rapid Volume Engagement & Local Retail Traffic',
      strategicFocus: 'Store Footfall Redirection • Instant Purchases • Street Buzz',
      whyThisActivationFits: `Operates directly along prime commercial high streets to redirect active shoppers into nearby partner stores with exclusive flash deals.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: 'Commercial High Streets • Market Squares • Fashion Boulevards',
      suitabilityScore: 91,
      projectedThroughput: '1,500–2,200 street consumer touches per shift',
      executionFlow: [
        '1. Position dynamic promoters along shopping corridor sidewalk nodes',
        '2. Announce limited-time hourly flash discounts for local retail outlets',
        '3. Hand out time-stamped golden tickets redeemable within 60 minutes',
        '4. Monitor in-store redemptions with participating retail cashiers',
        '5. Track instantaneous footfall conversion rate'
      ]
    },
    {
      id: 'plan_3',
      badge: '🎯 Option #3: Weekend Mall Atrium Festival Booth',
      conceptType: 'Weekend Mall Plaza Experience',
      activationName: `${brandName} Weekend Mall Atrium Experience & Gift Station`,
      objective: 'Weekend Family & Youth Engagement',
      strategicFocus: 'Family Dwell Time • Social Contests • Gift with Purchase',
      whyThisActivationFits: `Leverages high weekend mall footfall with entertaining gamification and instant gift-with-purchase rewards to drive peak weekend transaction volume.`,
      targetAudienceSummary: `${audienceName} (Age ${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: 'Shopping Mall Main Atriums • Cinema Plazas • Food Courts',
      suitabilityScore: 89,
      projectedThroughput: '1,100–1,800 mall visitor interactions per shift',
      executionFlow: [
        '1. Install branded prize-drop or interactive digital game booth in mall atrium',
        '2. Invite shoppers with store receipts to play for instant branded merchandise',
        '3. Capture consented contact info and distribute high-value coupon booklets',
        '4. Maintain continuous crowd energy with professional promoter host',
        '5. Log daily sales verified through mall tenant participation'
      ]
    }
  ];
}

/**
 * Backward-compatible single-plan helper
 */
export function generateObjectiveActivationPlan(params = {}) {
  const topPlans = generateTopObjectiveActivationPlans(params);
  if (params.btlFormat) {
    const match = topPlans.find(p => p.activationName.toLowerCase().includes(params.btlFormat.toLowerCase()) || p.id === params.btlFormat);
    if (match) return match;
  }
  return topPlans[0];
}

/**
 * ACTIVATION REQUIREMENTS GENERATOR
 * Decomposes an approved activation plan into structured, categorized requirements
 * dynamically optimized for the specific product line, brand industry, and venue context.
 */
export function generateActivationRequirements({
  activationPlan,
  objective = 'Product Sampling',
  brandCategory = 'Retail',
  productLine = 'Consumer Product',
  brandName = 'Brand',
  locationsCount = 1,
  city = 'Chennai',
  locationName = '',
  venueType = ''
} = {}) {
  const locationText = `${activationPlan?.activationName || ''} ${activationPlan?.environments?.join(' ') || ''} ${locationName || ''} ${venueType || ''}`.toLowerCase();
  const text = `${brandCategory} ${productLine} ${brandName} ${objective} ${locationText}`.toLowerCase();

  const isTechSaas = text.includes('saas') || text.includes('software') || text.includes('crm') || text.includes('cloud') || text.includes('b2b') || text.includes('developer') || text.includes('api') || text.includes('zoho') || text.includes('freshworks') || text.includes('salesforce') || text.includes('it & tech') || text.includes('tech park') || text.includes('corporate') || text.includes('rmz') || text.includes('tidel') || text.includes('merchant onboarding') || text.includes('lead generation');
  const isFintech = text.includes('fintech') || text.includes('finance') || text.includes('banking') || text.includes('credit card') || text.includes('payment') || text.includes('upi') || text.includes('cred') || text.includes('paytm') || text.includes('phonepe') || text.includes('insurance') || text.includes('wealth');
  const isFoodBeverage = text.includes('food') || text.includes('beverage') || text.includes('drink') || text.includes('qsr') || text.includes('snack') || text.includes('red bull') || text.includes('coffee') || text.includes('tea') || text.includes('juice') || text.includes('grocery') || text.includes('packaged food') || text.includes('marina') || text.includes('beach') || text.includes('ranganathan') || text.includes('sampling');
  const isFashionLifestyle = text.includes('fashion') || text.includes('footwear') || text.includes('shoe') || text.includes('sneaker') || text.includes('apparel') || text.includes('clothing') || text.includes('nike') || text.includes('adidas') || text.includes('puma') || text.includes('streetwear') || text.includes('luxury') || text.includes('eyewear') || text.includes('watch');
  const isEducationEdtech = text.includes('education') || text.includes('edtech') || text.includes('coaching') || text.includes('test prep') || text.includes('allen') || text.includes('byju') || text.includes('unacademy') || text.includes('jee') || text.includes('neet') || text.includes('upskill') || text.includes('course') || text.includes('university') || text.includes('college');
  const isAuto = text.includes('auto') || text.includes('motorcycle') || text.includes('bike') || text.includes('car') || text.includes('vehicle') || text.includes('ev') || text.includes('ola electric') || text.includes('ather') || text.includes('royal enfield');
  const isBeauty = text.includes('beauty') || text.includes('cosmetic') || text.includes('skincare') || text.includes('makeup') || text.includes('haircare') || text.includes('personal care') || text.includes('nykaa') || text.includes('dermatology');

  // 1. Props & Physical Setup
  let propsSetup = {
    title: 'Modular Product Showcase & Interactive Demonstration Counter',
    requirementText: 'Modular Branded Display Pod + Product Shelving + Tension Fabric Backdrop',
    desc: 'Lightweight modular counter with internal storage, product display shelving with integrated LED under-shelf lighting, and 8x6 ft tension fabric backdrop.',
    deliverables: ['Modular Display Pod', 'Integrated Product Shelving', '8x6 ft Fabric Backdrop'],
    estimatedCost: '₹20,000 – ₹48,000'
  };

  if (isTechSaas) {
    propsSetup = {
      title: 'Corporate Podium, Literature Racks & Digital Display Screens',
      requirementText: 'Corporate Podium + Literature Racks + Digital Display Screens',
      desc: 'Executive corporate podium with internal cable ducting, tiered literature racks for product one-pagers, and high-resolution digital display screens for indoor tech parks and corporate atriums.',
      deliverables: ['Executive Corporate Podium', 'Tiered Literature Racks', 'High-Definition Digital Display Screens'],
      estimatedCost: '₹18,000 – ₹42,000'
    };
  } else if (isFintech) {
    propsSetup = {
      title: 'Secure Verification Kiosk & Customer Desk',
      requirementText: 'Compact Security Podium + Pull-Up Privacy Backdrop + Document Folders',
      desc: 'PCI-compliant compact customer onboarding podium, professional anti-glare branded backdrop, document privacy screening folders, and sanitizing accessories for SEZ & metro transit hubs.',
      deliverables: ['Secure Onboarding Counter', 'Anti-Glare Pull-Up Backdrop', 'Document Security Clipboards'],
      estimatedCost: '₹15,000 – ₹38,000'
    };
  } else if (isFoodBeverage) {
    propsSetup = {
      title: 'Hygienic Sampling Counter, Tasting Bar & Waste Stations',
      requirementText: 'Branded Modular Tasting Bar + Drip Trays + Segregated Waste Bins',
      desc: 'Food-grade sanitized sampling presentation counter, spill-resistant stainless steel drip trays, branded front-lit counter panel, and color-coded recycling & trash segregation stations.',
      deliverables: ['Food-Grade Tasting Counter', 'Spill Drip Trays', 'Wet & Dry Waste Disposal Bins'],
      estimatedCost: '₹20,000 – ₹45,000'
    };
  } else if (isFashionLifestyle) {
    propsSetup = {
      title: 'Elevated Product Plinths, Trial Lounge & Full-Length Mirror',
      requirementText: '3x Matte Display Plinths + Cushioned Trial Bench + Full-Length LED Mirror',
      desc: 'Architectural matte-black product presentation pedestals, comfortable cushioned trial bench for shoe/outfit try-ons, frameless studio-lit full-length mirror, and premium branded fabric backdrop.',
      deliverables: ['3x Product Plinths (Varying Heights)', 'Cushioned Trial Bench', 'Studio LED Full-Length Mirror', 'Luxury Fabric Backdrop'],
      estimatedCost: '₹28,000 – ₹65,000'
    };
  } else if (isEducationEdtech) {
    propsSetup = {
      title: 'Academic Counseling Booth, Brochure Showcase & Seating Pod',
      requirementText: 'Counseling Desk + 3 Attendee Consultation Chairs + Tiered Brochure Rack',
      desc: 'Professional academic counseling desk, comfortable discussion chairs for student-parent consultations, tiered acrylic brochure display rack, and backdrop highlighting student success ranks and faculty credentials.',
      deliverables: ['Academic Counseling Counter', '3 Consultation Chairs', 'Tiered Brochure Stand', 'Hall of Fame Ranker Backdrop'],
      estimatedCost: '₹16,000 – ₹38,000'
    };
  } else if (isAuto) {
    propsSetup = {
      title: 'Vehicle Display Ramp, Safety Barriers & Registration Desk',
      requirementText: 'Heavy-Duty Vehicle Showcase Ramp + Test-Ride Registration Desk + Safety Stanchions',
      desc: 'Load-bearing steel vehicle display ramp with under-chassis illumination, weather-resistant test-ride waiver registration desk, and chrome safety stanchions with branded velvet/webbing ropes.',
      deliverables: ['Vehicle Display Steel Ramp', 'Test-Ride Registration Desk', 'Safety Stanchions & Flags'],
      estimatedCost: '₹35,000 – ₹85,000'
    };
  } else if (isBeauty) {
    propsSetup = {
      title: 'Vanity Makeover Station, Swatch Bar & Hollywood Mirror',
      requirementText: 'Illuminated Vanity Consultation Counter + High Bar Stool + Swatch Display Trays',
      desc: 'Clean acrylic makeup and skincare consultation counter, Hollywood-style 12-bulb dimmable vanity mirror, hydraulic high chair for express application demos, and hygienic product tester trays.',
      deliverables: ['Vanity Consultation Counter', 'Hollywood LED Dimmable Mirror', 'Hydraulic Makeover Chair', 'Acrylic Tester Trays'],
      estimatedCost: '₹24,000 – ₹55,000'
    };
  }

  // 2. Equipment & Audio/Visual
  let equipmentSetup = {
    title: 'Interactive Display Stand, Ambient Audio & Surge-Protected Power Hub',
    requirementText: 'Interactive Display Stand / Kiosk + Surge-Protected Power Hub',
    desc: 'Environment-adaptive display setup with surge-protected multi-socket power hub, optional weather-resistant canopy for outdoor setups or slimline kiosk totem for indoor malls.',
    deliverables: ['Display Totem / Canopy Unit', 'Industrial Surge Power Strip', 'Cable Concealment Ramps'],
    estimatedCost: '₹8,000 – ₹20,000'
  };

  if (isTechSaas) {
    equipmentSetup = {
      title: 'Ergonomic Lead Capture Kiosk, High-Speed WiFi Dongle & Tablet Mounts',
      requirementText: 'Ergonomic Lead Capture Kiosk + High-Speed WiFi Dongle + Tablet Mounts',
      desc: 'Dual secured touchscreen tablet mounts with high-speed commercial WiFi dongle and multi-device rapid charging station (Indoor setup, no outdoor gazebo canopy or loud PA sound system).',
      deliverables: ['Ergonomic Lead Capture Kiosk', 'High-Speed WiFi Dongle & Router', 'Dual Anti-Theft Tablet Mounts'],
      estimatedCost: '₹10,000 – ₹22,000'
    };
  } else if (isFintech) {
    equipmentSetup = {
      title: 'Dynamic QR Scanner Pedestal, Biometric Terminal & Power Station',
      requirementText: 'Heavy-Duty QR Scanner Pedestal + POS Biometric KYC Terminal + Power Station',
      desc: 'Eye-level illuminated dynamic QR scanner stand for frictionless app downloads, approved handheld biometric fingerprint/e-KYC scanner, and portable high-capacity power station.',
      deliverables: ['Dynamic QR Scanner Pedestal', 'Biometric e-KYC Terminal Stand', 'All-Day Portable Power Battery'],
      estimatedCost: '₹12,000 – ₹25,000'
    };
  } else if (isFoodBeverage) {
    equipmentSetup = {
      title: 'Weather-Resistant Gazebo Canopy, Ice Coolers / Chilling Units & High-Decibel Audio',
      requirementText: 'Weather-Resistant Gazebo Canopy + Ice Coolers / Chilling Units + High-Decibel Audio',
      desc: 'Heavy-duty all-weather 10x10 waterproof gazebo canopy tent, commercial roto-molded ice chillers maintaining strict 4°C serving temperature, and high-decibel audio/PA microphone for street activations.',
      deliverables: ['Weather-Resistant Gazebo Canopy', 'Commercial Ice Coolers / Chilling Units', 'High-Decibel Audio & PA Sound System', 'Power Hub'],
      estimatedCost: '₹12,000 – ₹26,000'
    };
  } else if (isFashionLifestyle) {
    equipmentSetup = {
      title: 'Warm Spot Accent Lighting, Digital Lookbook Screen & Ambient Sound',
      requirementText: 'Warm Studio Spot Lighting Rig + 43" Vertical Digital Lookbook + Ambient Speaker',
      desc: 'High-CRI warm LED spotlighting to highlight garment textures and footwear craftsmanship, a 43-inch vertical digital lookbook screen playing runway visuals, and a low-volume ambient acoustic speaker (Indoor luxury feel, no loud PA blasters).',
      deliverables: ['High-CRI Warm LED Spotlights', '43" Commercial Vertical Display Totem', 'Low-Decibel Ambient Sound Bar'],
      estimatedCost: '₹15,000 – ₹35,000'
    };
  } else if (isEducationEdtech) {
    equipmentSetup = {
      title: 'Diagnostic Test Tablets, Soft Ring Lighting & Silent Power Station',
      requirementText: '2x Test-Taking Tablets + Soft LED Ring Lighting + Portable Power Station',
      desc: 'Touchscreen tablets configured for 5-minute scholarship diagnostic quizzes and instant rank evaluation, soft flattering LED lighting for video testimonials, and silent power station.',
      deliverables: ['2x Diagnostic Quiz Tablets', 'Soft Ring Lighting Kit', 'Silent Power Station'],
      estimatedCost: '₹9,000 – ₹20,000'
    };
  } else if (isAuto) {
    equipmentSetup = {
      title: 'Test-Ride Helmet Cams, Outdoor PA Sound & EV Charger Setup',
      requirementText: 'Helmet Cams & Sanitized Liners + Outdoor PA Sound + Heavy-Duty Power Board',
      desc: 'Rider action cameras with sanitized helmet liners, wireless PA announcer system for launch announcements, and high-voltage portable EV charging extension.',
      deliverables: ['Helmet Cams & Sanitized Liners', 'High-Gain Outdoor PA System', 'Heavy-Duty Power Extension & Charger'],
      estimatedCost: '₹18,000 – ₹42,000'
    };
  } else if (isBeauty) {
    equipmentSetup = {
      title: 'Skin Analysis Scanner, 18" Ring Light & Mini Skincare Fridge',
      requirementText: 'Digital Derma Skin Moisture Scanner + 18" Ring Light + Skincare Refrigerator',
      desc: 'Handheld optical skin hydration & porosity diagnostic scanner for personalized shade/skincare matching, 18-inch bi-color ring light for flawless shade evaluation, and silent mini skincare fridge for cooling serums.',
      deliverables: ['Digital Skin Diagnostic Scanner', '18" Bi-Color Studio Ring Light', 'Thermoelectric Skincare Fridge'],
      estimatedCost: '₹14,000 – ₹30,000'
    };
  }

  // 3. Product Inventory / Supplies
  let inventorySetup = {
    title: 'Product Demonstration Units & Catalogs',
    requirementText: 'Display Product Units + Functional Demonstration Kits + Spec Catalogs',
    desc: 'Display product units, functional test demonstration kits, and detailed specification brochures.',
    deliverables: ['Display Product Units', 'Functional Demo Kits', 'Product Specification Catalogs'],
    estimatedCost: 'Client In-Kind Inventory'
  };

  if (isTechSaas) {
    inventorySetup = {
      title: 'VIP Founder Credit Cards, Trial Vouchers & Solution Briefs',
      requirementText: '500 Premium Metal/PVC VIP Founder Credit Cards + 250 Feature Spec Books',
      desc: 'Exclusive founder credit vouchers with unique activation codes for trial onboarding, enterprise ROI one-pagers, and security compliance whitepaper handouts.',
      deliverables: ['VIP Trial Voucher Cards with Unique Keys', 'Enterprise Feature One-Pagers', 'Lead Capture Velocity Log'],
      estimatedCost: 'Client In-Kind Collateral'
    };
  } else if (isFintech) {
    inventorySetup = {
      title: 'Physical Welcome Kits, Scratch Rewards & Cardholders',
      requirementText: '1,000 Scratch-and-Win Reward Cards + 300 RFID Blocking Sleeves',
      desc: 'Engaging physical scratch cards with cashback/voucher incentives on immediate KYC completion, RFID-blocking card protector sleeves, and onboarding guide leaflets.',
      deliverables: ['Incentive Scratch Reward Cards', 'RFID Card Sleeves', 'App Activation Leaflets'],
      estimatedCost: 'Client In-Kind Supplies'
    };
  } else if (isFoodBeverage) {
    inventorySetup = {
      title: 'Chilled Product Inventory & Food-Grade Tasting Supplies',
      requirementText: 'Chilled Product Units + 2,000 Eco-Friendly Tasting Cups + Tongs & Napkins',
      desc: 'Fresh temperature-controlled sealed batch units, food-safe biodegradable 60ml tasting cups, serving tongs, sanitizing wipes, and hygienic disposable gloves.',
      deliverables: ['Chilled Product Inventory Units', 'Biodegradable Tasting Cups', 'Hygienic Serving Kit & Gloves', 'Stock Velocity Tracker'],
      estimatedCost: 'Client In-Kind Inventory'
    };
  } else if (isFashionLifestyle) {
    inventorySetup = {
      title: 'Size-Run Display Inventory, Shoehorns & Try-On Supplies',
      requirementText: 'Curated Size-Run Stock Units + Disposable Trial Socks + Branded Shoehorns',
      desc: 'Full display size run across key colorways, hygienic disposable try-on socks, premium branded metal shoehorns, and anti-static garment dust covers.',
      deliverables: ['Size Run Display Units', 'Hygienic Try-On Socks & Shoehorns', 'Lookbook Catalogs'],
      estimatedCost: 'Client In-Kind Inventory'
    };
  } else if (isEducationEdtech) {
    inventorySetup = {
      title: 'Sample Mock Test Booklets, Formula Cheat Sheets & Prospectus',
      requirementText: '1,000 Subject Formula Cheat-Sheets + 500 Mock Test Papers + 250 Prospectus Books',
      desc: 'High-value physical revision formula booklets, previous year question analysis sheets, scholarship exam application forms, and official course prospectus.',
      deliverables: ['Formula Quick-Revision Booklets', 'Sample Mock Test Papers', 'Official Academic Prospectus'],
      estimatedCost: 'Client In-Kind Material'
    };
  } else if (isAuto) {
    inventorySetup = {
      title: 'Demonstration Vehicles, Riding Gear & Spec Sheets',
      requirementText: '2x Test-Ride Demonstration Vehicles + ISI Helmets + Technical Brochure Packs',
      desc: 'Clean, fully-fueled/charged test vehicles, sanitized ISI/DOT-certified riding jackets and helmets across sizes, and laminated technical specification brochures.',
      deliverables: ['Demonstration Test-Drive Vehicles', 'Sanitized Safety Riding Gear', 'Technical Spec Sheets'],
      estimatedCost: 'Client In-Kind Fleet'
    };
  } else if (isBeauty) {
    inventorySetup = {
      title: 'Hygienic Swatch Testers, Sachet Samples & Applicators',
      requirementText: '1,500 Individual Product Foil Sachets + 500 Disposable Spatulas & Wipes',
      desc: 'Sealed unit-dose product sample sachets, disposable cotton pads, biodegradable applicator wands, and alcohol-free makeup remover wipes.',
      deliverables: ['Unit-Dose Trial Sachets', 'Hygienic Disposable Applicator Kit', 'Sanitizing Cleanser Bottles'],
      estimatedCost: 'Client In-Kind Inventory'
    };
  }

  // 4. Creative & Branding
  let creativeBranding = {
    title: 'Key Visuals, Standees, Flyers & Uniforms',
    requirementText: isTechSaas 
      ? '3 Fabric Tension Banners + 500 Product Overview Cards + Team Polo Shirts'
      : isFashionLifestyle
      ? 'Architectural Fabric Lightbox Graphics + Lookbooks + Stylist Aprons'
      : '4 Roll-up Standees + 1,000 Flyers + Branded T-Shirts',
    desc: 'High-resolution graphic design files, star-flex vinyl standees, promotional discount handouts, and branded promoter polo t-shirts.',
    canZiggersExecute: false,
    suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
    deliverables: ['Key Visual Vector Files', '4 Roll-up Standees', '1,000 Printed Flyers', 'Branded T-Shirts'],
    estimatedCost: '₹15,000 – ₹32,000'
  };

  // 5. Training & Briefing
  let trainingSetup = {
    title: 'Standardized 20-Sec Script & Digital Briefing',
    requirementText: isTechSaas
      ? 'B2B Elevator Pitch Script + Product FAQ Deck + Objection Handling Module'
      : isFintech
      ? 'RBI Compliance Pitch + KYC Security Protocol Guide + Digital Quiz'
      : isFoodBeverage
      ? 'Food Safety Standards + Allergen Guidance + 10-Sec Taste Prompt'
      : isFashionLifestyle
      ? 'Styling Consultation Script + Fabric USP Cards + Fit Advice Guide'
      : isEducationEdtech
      ? 'Academic Counseling Guide + Syllabus Highlights + Scholarship Exam FAQs'
      : 'Pitch Script PDF + Product FAQ Deck + Pre-Shift Test',
    desc: 'Structured 20-second consumer pitch script, handling common product FAQs, objection responses, and mandatory pre-shift digital onboarding module.',
    canZiggersExecute: true,
    suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_EXECUTE,
    deliverables: ['Pitch Script PDF', 'FAQ Flashcard Deck', 'Ziggers Digital Briefing Module'],
    estimatedCost: 'Included in Ziggers Execute'
  };

  // 6. Technology & Lead Capture
  let technologySetup = {
    title: isTechSaas 
      ? 'Self-Serve Lead Capture & Instant Onboarding Portal'
      : isFintech
      ? 'Instant App Download Dynamic QR & Biometric KYC Portal'
      : 'Dynamic QR Vouchers & Lead Collection Portal',
    requirementText: isTechSaas
      ? 'Tablet Lead Form + Instant Calendar Booking + SMS Link-Drop'
      : isFintech
      ? 'Dynamic QR Standee + Instant Cashback SMS Engine + OTP Verification'
      : 'Dynamic QR Standee + Instant SMS Voucher System',
    desc: 'Custom branded QR code standee allowing consumers to scan for instant discount vouchers, app downloads, and OTP-verified feedback.',
    canZiggersExecute: isTechSaas || isFintech,
    suggestedFulfillment: (isTechSaas || isFintech) ? FULFILLMENT_MODES.ZIGGERS_EXECUTE : FULFILLMENT_MODES.ZIGGERS_PARTNER,
    deliverables: ['Dynamic QR Code Standee', 'Instant SMS Voucher Engine', 'Real-time Lead Dashboard'],
    estimatedCost: '₹5,000 – ₹12,000'
  };

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
      title: propsSetup.title,
      requirementText: propsSetup.requirementText,
      desc: propsSetup.desc,
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: propsSetup.deliverables,
      estimatedCost: propsSetup.estimatedCost
    },
    {
      id: 'REQ_EQUIPMENT',
      reqCategory: '3. Equipment & Audio/Visual',
      title: equipmentSetup.title,
      requirementText: equipmentSetup.requirementText,
      desc: equipmentSetup.desc,
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: equipmentSetup.deliverables,
      estimatedCost: equipmentSetup.estimatedCost
    },
    {
      id: 'REQ_CREATIVE_BRANDING',
      reqCategory: '4. Creative & Branding',
      title: creativeBranding.title,
      requirementText: creativeBranding.requirementText,
      desc: creativeBranding.desc,
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
      deliverables: creativeBranding.deliverables,
      estimatedCost: creativeBranding.estimatedCost
    },
    {
      id: 'REQ_PRODUCT_INVENTORY',
      reqCategory: '5. Product / Inventory',
      title: inventorySetup.title,
      requirementText: inventorySetup.requirementText,
      desc: inventorySetup.desc,
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.CLIENT_HANDLES,
      deliverables: inventorySetup.deliverables,
      estimatedCost: inventorySetup.estimatedCost
    },
    {
      id: 'REQ_LOGISTICS',
      reqCategory: '6. Logistics & Transport',
      title: 'Material Transportation & Venue Delivery',
      requirementText: isTechSaas ? 'Equipment Hand-Carry Transit & Secure Vault Pack' : 'Venue Transport Vehicle & Material Loading/Unloading',
      desc: isTechSaas
        ? 'Direct secure courier or verified promoter transit of locked tablet enclosures, Wi-Fi router, and promotional collateral.'
        : 'Safe transit of fabricated booth components, printed standees, and stock inventory from warehouse to venue with morning setup delivery.',
      canZiggersExecute: false,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_PARTNER,
      deliverables: ['Venue Transport Vehicle', 'Safe Morning Unloading', 'End-of-Day Material Return'],
      estimatedCost: '₹6,000 – ₹15,000'
    },
    {
      id: 'REQ_TRAINING',
      reqCategory: '7. Training & Briefing',
      title: trainingSetup.title,
      requirementText: trainingSetup.requirementText,
      desc: trainingSetup.desc,
      canZiggersExecute: true,
      suggestedFulfillment: FULFILLMENT_MODES.ZIGGERS_EXECUTE,
      deliverables: trainingSetup.deliverables,
      estimatedCost: 'Included in Ziggers Execute'
    },
    {
      id: 'REQ_TECHNOLOGY',
      reqCategory: '8. Technology & Lead Capture',
      title: technologySetup.title,
      requirementText: technologySetup.requirementText,
      desc: technologySetup.desc,
      canZiggersExecute: technologySetup.canZiggersExecute,
      suggestedFulfillment: technologySetup.suggestedFulfillment,
      deliverables: technologySetup.deliverables,
      estimatedCost: '₹5,000 – ₹12,000'
    },
    {
      id: 'REQ_PERMISSIONS',
      reqCategory: '9. Permissions & Clearances',
      title: 'Venue NOC & Activity Clearances',
      requirementText: isTechSaas 
        ? 'Tech Park / SEZ Management Gate Passes & Atrium NOC'
        : 'Mall / College / Venue Entry Clearances & NOCs',
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
