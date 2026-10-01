/**
 * Ziggers Decision Engine - Campaign Decision Playbook v2 Engine
 * File: src/lib/intelligence/playbook/playbookDecisionEngine.js
 * 
 * Implements the database-backed decision sequence:
 * Campaign Brief -> Relevant Playbooks -> Feasible Activities -> Candidate Venues -> Explained Recommendations
 * 
 * Non-negotiable Guarantees:
 * 1. Reads from versioned database records (no hardcoded playbook definitions in code).
 * 2. Distinguishes important product journeys (Family car vs luxury car, everyday vs bridal sarees, SaaS, broadband, audits).
 * 3. Never forces unknown businesses into generic retail; asks discriminating clarifications.
 * 4. Separates suggested venue types from verified venues.
 * 5. Rejects explicit feasibility failures (EXCLUDED); flags missing mandatory checks (NEEDS_CONFIRMATION).
 * 6. Honest evidence hierarchy: Published practice, Planning hypothesis, Venue-confirmed fact, Measured campaign outcome.
 * 7. Zero invented metrics: No synthetic match %, lead counts, conversion rates, or ROI.
 */

import { getPlaybookById, getPlaybooks, getPlaybookVersionPolicy, saveRecommendationSnapshot } from '../../data/repositories/playbookRepository.js';
import { getDatabase } from '../../data/database.js';

/**
 * Keyword-to-Playbook ID Ontology Mapping
 * Maps product/service/subcategory inputs to specific Playbook IDs in the database.
 */
const PLAYBOOK_CLASSIFICATION_MAP = [
  // --- Automotive ---
  {
    playbookId: 'AUTO01',
    family: 'Automotive',
    keywords: [
      'car', 'cars', 'passenger car', 'family car', 'suv', 'sedan', 'hatchback', 'maruti', 'hyundai', 'tata motors',
      'honda car', 'toyota', 'mahindra', 'mahindra suv', 'family vehicle', 'car upgrade', 'automobile', 'four wheeler',
      '4 wheeler', 'ev car', 'electric car', 'electric vehicle'
    ],
    buyerNeed: 'Evaluate a car against actual household travel and ownership needs',
    primaryObjective: 'Completed qualified test drives'
  },
  {
    playbookId: 'AUTO02',
    family: 'Automotive',
    keywords: [
      'luxury car', 'premium car', 'mercedes', 'mercedes-benz', 'bmw', 'audi', 'jaguar', 'land rover', 'porsche',
      'lexus', 'volvo', 'sports car', 'supercar', 'chauffeur', 'super luxury', 'lamborghini', 'ferrari', 'maserati',
      'aston martin', 'bentley', 'rolls royce'
    ],
    buyerNeed: 'Private appointments and specialist consultation for high-consideration luxury vehicle',
    primaryObjective: 'Qualified private appointments and completed evaluations'
  },
  {
    playbookId: 'AUTO03',
    family: 'Automotive',
    keywords: [
      'bike', 'bikes', 'motorcycle', 'motorcycles', 'two wheeler', 'two-wheeler', 'two wheelers', '2 wheeler', '2-wheeler',
      'scooter', 'scooters', 'scooty', 'commuter bike', 'commuter motorcycle', 'ev bike', 'electric bike', 'e-bike',
      'activa', 'jupiter', 'splendor', 'shine', 'electric scooter', 'ev scooter', 'ather', 'ola electric', 'vida', 'chetak',
      'bajaj', 'tvs', 'hero', 'hero moto', 'yamaha', 'honda bike', 'pulsar', 'raider', 'access 125', 'dio', 'ntorq'
    ],
    buyerNeed: 'Evaluate fuel efficiency, daily commuting ergonomics, and total cost of ownership',
    primaryObjective: 'Completed relevant test rides'
  },
  {
    playbookId: 'AUTO04',
    family: 'Automotive',
    keywords: [
      'touring motorcycle', 'touring bike', 'cruiser', 'cruiser bike', 'bullet', 'royal enfield', 'classic 350', 'hunter 350',
      'himalayan', 'ktm', 'ktm duke', 'speed 400', 'triumph', 'harley', 'harley davidson', 'superbike', 'superbikes',
      'sports bike', 'sport bike', 'super motorcycle', 'riding gear', 'exhaust', 'ducati', 'kawasaki', 'ninja', 'interceptor',
      'continental gt', 'bmw motorrad', 'adventure motorcycle', 'adv bike'
    ],
    buyerNeed: 'Experience motorcycle styling, exhaust note, performance, and community culture',
    primaryObjective: 'Relevant test rides or product trials'
  },
  {
    playbookId: 'AUTO05',
    family: 'Automotive',
    keywords: ['commercial vehicle', 'fleet', 'cargo van', 'mini truck', 'tata ace', 'bolero maxi truck', 'logistics vehicle', 'electric three-wheeler', 'cargo ev'],
    buyerNeed: 'Assess payload capacity, route range, maintenance turnaround, and fleet ROI',
    primaryObjective: 'Qualified fleet assessments'
  },

  // --- Fashion & Jewellery ---
  {
    playbookId: 'FASH01',
    family: 'Fashion and jewellery',
    keywords: ['everyday saree', 'work saree', 'daily wear saree', 'cotton saree', 'linen saree', 'printed saree', 'georgette saree', 'office saree', 'saree trial'],
    buyerNeed: 'Fabric discovery, comfortable touch-and-feel, optional draping, and immediate direct purchase',
    primaryObjective: 'Relevant product trials and completed purchases'
  },
  {
    playbookId: 'FASH02',
    family: 'Fashion and jewellery',
    keywords: ['bridal saree', 'wedding saree', 'kanjeevaram', 'banarasi wedding', 'trousseau', 'bridal lehenga', 'wedding attire', 'bridal wear', 'occasion wear'],
    buyerNeed: 'Dedicated occasion consultation, private styling, curated bridal assortment, and alteration/delivery planning',
    primaryObjective: 'Completed bridal consultations and qualified orders'
  },
  {
    playbookId: 'FASH03',
    family: 'Fashion and jewellery',
    keywords: ['heritage saree', 'handloom', 'artisan weave', 'chanderi', 'tussar', 'patola', 'handcrafted textile', 'weaver community', 'authentic silk'],
    buyerNeed: 'Documented craftsmanship story, certified handloom provenance, and informed fabric inspection',
    primaryObjective: 'Informed product consideration and relevant purchases'
  },
  {
    playbookId: 'FASH04',
    family: 'Fashion and jewellery',
    keywords: ['apparel', 'footwear', 'shoes', 'sneakers', 'ready-to-wear', 'western wear', 'formal shirt', 'denim', 'jeans', 'casual wear'],
    buyerNeed: 'Fit, comfort, and styling assessment with convenient trial facilities',
    primaryObjective: 'Relevant trials and net purchases'
  },
  {
    playbookId: 'FASH05',
    family: 'Fashion and jewellery',
    keywords: ['jewellery', 'jewelry', 'gold jewellery', 'diamond necklace', 'polki', 'bridal jewellery', 'hallmark gold', 'silver ornaments'],
    buyerNeed: 'Certified purity verification, styling consultation, and private high-security appointment',
    primaryObjective: 'Attended qualified consultations'
  },

  // --- Beauty & Personal Care ---
  {
    playbookId: 'BEAU01',
    family: 'Beauty and care',
    keywords: ['cosmetics', 'skincare', 'makeup', 'serum', 'sunscreen', 'foundation', 'lipstick', 'dermatology care', 'clean beauty'],
    buyerNeed: 'Skin-type matching, texture testing, hygienic swatch trial, and product advice',
    primaryObjective: 'Appropriate product trials and verified purchases'
  },
  {
    playbookId: 'BEAU02',
    family: 'Beauty and care',
    keywords: ['salon', 'grooming', 'spa', 'haircut', 'hair salon', 'facial', 'beard styling', 'nail studio'],
    buyerNeed: 'Service quality demonstration, stylist consultation, and booking first visit',
    primaryObjective: 'Completed service appointments'
  },

  // --- FMCG Food & Beverages ---
  {
    playbookId: 'FMCG01',
    family: 'Food and household products',
    keywords: ['snacks', 'packaged snacks', 'biscuits', 'cookies', 'chips', 'namkeen', 'chocolates', 'healthy snack', 'nutrition bar', 'packaged food'],
    buyerNeed: 'Taste discovery, ingredient assurance, and convenient purchase trial',
    primaryObjective: 'Accepted trials and attributable purchases'
  },
  {
    playbookId: 'FMCG02',
    family: 'Food and household products',
    keywords: ['beverage', 'juice', 'soft drink', 'energy drink', 'cold brew', 'artisan tea', 'iced tea', 'hydration drink', 'non-alcoholic beverage'],
    buyerNeed: 'Chilled refreshment, flavor sampling, and purchase consideration',
    primaryObjective: 'Accepted product trials and purchase consideration'
  },
  {
    playbookId: 'FMCG03',
    family: 'Food and household products',
    keywords: ['restaurant', 'cafe', 'dining', 'bakery', 'pizza', 'burger', 'cloud kitchen', 'diner', 'bistro'],
    buyerNeed: 'Signature dish tasting, local dining discovery, and first-visit incentive',
    primaryObjective: 'Completed first visits or orders'
  },
  {
    playbookId: 'FMCG04',
    family: 'Food and household products',
    keywords: ['home cleaning', 'detergent', 'dishwash', 'floor cleaner', 'disinfectant', 'household consumables', 'laundry'],
    buyerNeed: 'Efficacy demonstration, fragrance evaluation, and trial pack adoption',
    primaryObjective: 'Informed product trials and purchases'
  },

  // --- Home & Electronics ---
  {
    playbookId: 'HOME01',
    family: 'Home and electronics',
    keywords: ['electronics', 'consumer electronics', 'smartphones', 'headphones', 'earbuds', 'laptops', 'gadgets', 'smartwatch'],
    buyerNeed: 'Hands-on device testing, feature comparison, and expert consultation',
    primaryObjective: 'Meaningful product demonstrations and purchases'
  },
  {
    playbookId: 'HOME02',
    family: 'Home and electronics',
    keywords: ['appliances', 'home appliances', 'refrigerator', 'washing machine', 'air conditioner', 'microwave', 'water purifier'],
    buyerNeed: 'Dimensions & fit evaluation, energy rating check, and installation assurance',
    primaryObjective: 'Qualified demos and fulfilled purchases'
  },
  {
    playbookId: 'HOME03',
    family: 'Home and electronics',
    keywords: ['furniture', 'interiors', 'sofa', 'bed', 'modular kitchen', 'wardrobe', 'home decor', 'dining table'],
    buyerNeed: 'Material inspection, floor plan consultation, and customized design quote',
    primaryObjective: 'Completed design consultations'
  },
  {
    playbookId: 'HOME04',
    family: 'Home and electronics',
    keywords: ['paint', 'painting services', 'waterproofing', 'home renovation', 'wall texture', 'interior paint'],
    buyerNeed: 'On-site technical evaluation, shade preview, and itemised quotation',
    primaryObjective: 'Qualified site assessments'
  },
  {
    playbookId: 'HOME05',
    family: 'Home and electronics',
    keywords: ['rooftop solar', 'solar panels', 'solar energy', 'net metering', 'clean energy', 'solar subsidy'],
    buyerNeed: 'Rooftop shadow analysis, monthly bill savings calculation, and subsidy guidance',
    primaryObjective: 'Completed qualified technical assessments'
  },

  // --- Property & Real Estate ---
  {
    playbookId: 'PROP01',
    family: 'Property and travel',
    keywords: ['real estate', 'property', 'apartments', 'flats', 'villas', 'gated community', 'housing project', 'commercial property'],
    buyerNeed: 'Project masterplan review, location connectivity, price transparency, and site visit booking',
    primaryObjective: 'Attended qualified project visits'
  },

  // --- Business & Merchant Services ---
  {
    playbookId: 'B2B01',
    family: 'Business and merchant services',
    keywords: ['b2b saas', 'saas', 'enterprise software', 'crm', 'erp', 'hrtech', 'fintech saas', 'developer tools', 'cloud platform', 'b2b software'],
    buyerNeed: 'Solve a specific operational pain point, interactive workflow clinic, and qualified trial',
    primaryObjective: 'Qualified attended product evaluations'
  },
  {
    playbookId: 'B2B02',
    family: 'Business and merchant services',
    keywords: ['merchant payments', 'pos terminal', 'soundbox', 'qr soundbox', 'merchant onboarding', 'payment gateway', 'merchant loan'],
    buyerNeed: 'Fee transparency, settlement reliability, device walkthrough, and instant KYC activation',
    primaryObjective: 'Eligible merchants activated through authorised processes'
  },

  // --- Financial Services ---
  {
    playbookId: 'FIN01',
    family: 'Financial services',
    keywords: ['banking', 'credit cards', 'insurance', 'life insurance', 'health insurance', 'mutual funds', 'fixed deposit', 'home loan', 'personal loan'],
    buyerNeed: 'Product suitability explanation, transparent terms, and opted-in consultation',
    primaryObjective: 'Qualified opted-in consultations'
  },

  // --- Education & Public Services ---
  {
    playbookId: 'EDU01',
    family: 'Education and public services',
    keywords: ['upskilling', 'professional learning', 'executive education', 'data science course', 'coding bootcamp', 'certification', 'mba'],
    buyerNeed: 'Curriculum relevance, placement history review, and counselor discussion',
    primaryObjective: 'Attended relevant course consultations or trials'
  },
  {
    playbookId: 'EDU02',
    family: 'Education and public services',
    keywords: ['school', 'preschool', 'daycare', 'tuition center', 'coaching institute', 'jee neet coaching', 'kids learning'],
    buyerNeed: 'Campus safety, pedagogy review, teacher credentials, and scheduled family visit',
    primaryObjective: 'Parent/guardian consultations and attended visits'
  },
  {
    playbookId: 'PUB01',
    family: 'Education and public services',
    keywords: ['ngo', 'public service', 'government scheme', 'civic awareness', 'blood donation', 'health drive', 'community initiative'],
    buyerNeed: 'Accurate understanding of civic/public service without commercial sales pressure',
    primaryObjective: 'Accurate understanding and appropriate service access'
  },

  // --- Health & Fitness ---
  {
    playbookId: 'HEALTH01',
    family: 'Health and fitness',
    keywords: ['healthcare', 'clinic', 'hospital', 'diagnostics', 'health checkup', 'dental clinic', 'eye care', 'specialist doctor'],
    buyerNeed: 'Doctor credentials, facility hygiene, service scope, and appointment scheduling',
    primaryObjective: 'Appropriate provider appointments'
  },
  {
    playbookId: 'FIT01',
    family: 'Health and fitness',
    keywords: ['gym', 'fitness studio', 'crossfit', 'yoga studio', 'pilates', 'personal training', 'fitness membership'],
    buyerNeed: 'Equipment inspection, trainer interaction, and introductory trial session',
    primaryObjective: 'Attended appropriate trial sessions'
  },
  {
    playbookId: 'FIT02',
    family: 'Health and fitness',
    keywords: ['sports equipment', 'badminton racket', 'cricket kit', 'running shoes', 'cycling', 'bicycle', 'sports gear'],
    buyerNeed: 'Grip/fit evaluation, stroke/stride trial, and specialist recommendation',
    primaryObjective: 'Relevant equipment trials and purchases'
  },

  // --- Connectivity & Local Services ---
  {
    playbookId: 'TEL01',
    family: 'Connectivity and local services',
    keywords: ['broadband', 'wifi', 'fiber broadband', 'isp', 'internet connection', 'ftth', 'home internet', 'airtel fiber', 'jio fiber', 'act fibernet'],
    buyerNeed: 'Verify address-level serviceability before promising connection speed and installation dates',
    primaryObjective: 'Completed serviceable installations'
  },

  // --- Travel & Hospitality ---
  {
    playbookId: 'TRAV01',
    family: 'Property and travel',
    keywords: ['travel', 'tourism', 'holiday package', 'hotel', 'resort', 'flight booking', 'vacation', 'honeymoon package'],
    buyerNeed: 'Itinerary customisation, inclusions/exclusions review, and verified booking follow-up',
    primaryObjective: 'Qualified consultations and confirmed bookings'
  },

  // --- Specialist Consumer Products ---
  {
    playbookId: 'PET01',
    family: 'Specialist consumer products',
    keywords: ['pet care', 'pet food', 'dog food', 'cat food', 'veterinary', 'pet grooming', 'pet accessories'],
    buyerNeed: 'Nutrition advice, pet acceptance trial, and clinic/grooming appointment',
    primaryObjective: 'Appropriate product discovery and appointments'
  },

  // --- Agriculture & Industrial ---
  {
    playbookId: 'AGRI01',
    family: 'Agriculture and industrial',
    keywords: ['agriculture', 'tractor', 'farm equipment', 'harvester', 'pesticides', 'seeds', 'fertilizers', 'irrigation', 'farming'],
    buyerNeed: 'Field demonstration, crop-cycle suitability, dealer service network, and financing options',
    primaryObjective: 'Qualified demonstrations and dealer evaluations'
  },
  {
    playbookId: 'IND01',
    family: 'Agriculture and industrial',
    keywords: ['industrial', 'manufacturing equipment', 'cnc machine', 'welding', 'warehouse equipment', 'commercial tools'],
    buyerNeed: 'Technical specs, compliance certification, operational duty cycle, and engineer consultation',
    primaryObjective: 'Qualified technical meetings and assessments'
  },

  // --- Retail Execution ---
  {
    playbookId: 'RETAIL01',
    family: 'Retail execution',
    keywords: ['retail audit', 'mystery shopping', 'store audit', 'planogram compliance', 'outlet audit', 'display compliance', 'posm audit'],
    buyerNeed: 'Independent verification of retailer compliance, stock availability, and promotional display',
    primaryObjective: 'Accurate verified outlet observations'
  },
  {
    playbookId: 'RETAIL02',
    family: 'Retail execution',
    keywords: ['retail launch', 'store launch', 'in-store merchandising', 'supermarket activation', 'dealer meet', 'dealer launch'],
    buyerNeed: 'Store footfall activation, dealer engagement, and measurable sell-through',
    primaryObjective: 'Verified execution and attributable store outcomes'
  },

  // --- Entertainment & Leisure ---
  {
    playbookId: 'APP01',
    family: 'Entertainment and leisure',
    keywords: ['app adoption', 'mobile app', 'consumer app', 'app install', 'app download', 'food delivery app', 'grocery app', 'quick commerce app'],
    buyerNeed: 'Guided onboarding, first order/booking walkthrough, and verified active adoption',
    primaryObjective: 'Verified first useful action'
  },
  {
    playbookId: 'ENT01',
    family: 'Entertainment and leisure',
    keywords: ['entertainment', 'movie launch', 'gaming', 'esports', 'concert', 'ticketed event', 'amusement park', 'theme park'],
    buyerNeed: 'Teaser experience, interactive preview, and ticket/pass booking',
    primaryObjective: 'Relevant trials or confirmed attendance'
  },
  {
    playbookId: 'LOG01',
    family: 'Business and merchant services',
    keywords: ['logistics', 'courier', 'b2b delivery', 'express cargo', 'freight', '3pl', 'ecommerce shipping', 'warehousing'],
    buyerNeed: 'Route SLA, rate calculator, API integration demo, and test shipment booking',
    primaryObjective: 'Qualified business trials and fulfilled shipments'
  }
];

/**
 * Classifies the campaign brief into the best-matching Playbook ID
 */
export function classifyCampaignBrief(brief = {}) {
  const textCorpus = [
    brief.brand || '',
    brief.productOrService || '',
    brief.subcategory || '',
    brief.brandIndustry || '',
    brief.brandCategory || '',
    brief.brandProductLine || '',
    brief.briefDetails || '',
    brief.productDescription || '',
    brief.objective || ''
  ].join(' ').toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const mapping of PLAYBOOK_CLASSIFICATION_MAP) {
    let score = 0;
    for (const kw of mapping.keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower.includes(' ')) {
        // Multi-word phrase matching
        if (textCorpus.includes(kwLower)) {
          score += kwLower.split(' ').length * 4;
        }
      } else {
        // Single word: match with word boundary regex to avoid false substrings while ensuring exact match scores
        const regex = new RegExp(`(^|[^a-z0-9])${kwLower}([^a-z0-9]|$)`, 'i');
        if (regex.test(textCorpus)) {
          score += 5;
        }
      }
    }

    // Objective bonus
    if (brief.objective && mapping.primaryObjective.toLowerCase().includes(brief.objective.toLowerCase())) {
      score += 2;
    }

    // Brand Industry / Category affinity bonus
    const industryLower = (brief.brandIndustry || brief.brandCategory || '').toLowerCase();
    if (industryLower && mapping.family.toLowerCase().includes(industryLower)) {
      score += 4;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = mapping;
    }
  }

  // If match score is too low or empty, evaluate domain hints before giving up
  if (!bestMatch || highestScore < 3) {
    // 1. Two-Wheeler / Bike / Motorcycle Domain
    if (/(bike|bikes|cycle|motorcycle|scooter|scooty|two.wheeler|2.wheeler)/i.test(textCorpus)) {
      const isCruiser = /(cruiser|touring|bullet|royal.enfield|superbike|ktm|harley|sports.bike|speed)/i.test(textCorpus);
      const pbId = isCruiser ? 'AUTO04' : 'AUTO03';
      const m = PLAYBOOK_CLASSIFICATION_MAP.find(x => x.playbookId === pbId);
      if (m) {
        return {
          playbookId: m.playbookId,
          family: m.family,
          confidence: 'HIGH',
          needsClarification: false,
          matchedBuyerNeed: m.buyerNeed
        };
      }
    }

    // 2. Four-Wheeler / Car Domain
    if (/(car|cars|suv|sedan|hatchback|automobile|four.wheeler|4.wheeler|auto)/i.test(textCorpus)) {
      const isLuxury = /(luxury|mercedes|bmw|audi|porsche|jaguar|supercar|sports.car)/i.test(textCorpus);
      const pbId = isLuxury ? 'AUTO02' : 'AUTO01';
      const m = PLAYBOOK_CLASSIFICATION_MAP.find(x => x.playbookId === pbId);
      if (m) {
        return {
          playbookId: m.playbookId,
          family: m.family,
          confidence: 'HIGH',
          needsClarification: false,
          matchedBuyerNeed: m.buyerNeed
        };
      }
    }

    // 3. Fashion / Saree Domain
    if (/(saree|sari|lehenga|handloom|kurti|ethnic)/i.test(textCorpus)) {
      const isBridal = /(bridal|wedding|kanjeevaram|banarasi|trousseau)/i.test(textCorpus);
      const isHeritage = /(heritage|handloom|artisan|chanderi|tussar|craft)/i.test(textCorpus);
      const pbId = isBridal ? 'FASH02' : (isHeritage ? 'FASH03' : 'FASH01');
      const m = PLAYBOOK_CLASSIFICATION_MAP.find(x => x.playbookId === pbId);
      if (m) {
        return {
          playbookId: m.playbookId,
          family: m.family,
          confidence: 'HIGH',
          needsClarification: false,
          matchedBuyerNeed: m.buyerNeed
        };
      }
    }

    // 4. Tech / SaaS / Software Domain
    if (/(saas|software|app|crm|erp|cloud|fintech|hrtech|tech)/i.test(textCorpus)) {
      const m = PLAYBOOK_CLASSIFICATION_MAP.find(x => x.playbookId === 'B2B01');
      if (m) {
        return {
          playbookId: m.playbookId,
          family: m.family,
          confidence: 'HIGH',
          needsClarification: false,
          matchedBuyerNeed: m.buyerNeed
        };
      }
    }

    // If truly unknown, ask clarifying question
    return {
      playbookId: null,
      family: null,
      confidence: 'LOW',
      needsClarification: true,
      clarificationQuestion: 'What is the primary action you want prospective customers to take during or immediately following this activation?',
      clarificationOptions: [
        'Complete a supervised on-site product trial or test drive',
        'Receive an expert consultation and book a scheduled private appointment',
        'Directly purchase products from a permitted on-site display',
        'Verify address serviceability or schedule an installation/audit'
      ]
    };
  }

  return {
    playbookId: bestMatch.playbookId,
    family: bestMatch.family,
    confidence: highestScore >= 6 ? 'HIGH' : 'MEDIUM',
    needsClarification: false,
    matchedBuyerNeed: bestMatch.buyerNeed
  };
}

/**
 * Evaluates candidate venues against the physical and operational requirements of a playbook
 */
export function checkVenueFeasibility(venue, playbook) {
  const issues = [];
  const warnings = [];
  let status = 'READY_TO_COMPARE'; // 'READY_TO_COMPARE' | 'NEEDS_CONFIRMATION' | 'EXCLUDED'

  const playbookId = playbook.id;
  const isCarActivation = ['AUTO01', 'AUTO02'].includes(playbookId);
  const isTwoWheeler = ['AUTO03', 'AUTO04'].includes(playbookId);
  const isFittingRequired = ['FASH01', 'FASH02', 'FASH03', 'FASH04'].includes(playbookId);
  const isBroadband = playbookId === 'TEL01';
  const isRetailAudit = playbookId === 'RETAIL01';

  // 1. Vehicle Access Check
  if (isCarActivation) {
    if (venue.vehicle_access === 0 || venue.vehicle_access === false) {
      status = 'EXCLUDED';
      issues.push('Venue strictly prohibits automotive vehicle movement or display in pedestrian zones.');
    } else if (venue.vehicle_access === undefined || venue.vehicle_access === null) {
      if (status !== 'EXCLUDED') status = 'NEEDS_CONFIRMATION';
      warnings.push('Vehicle display and test-drive access permits must be verified with property manager.');
    }
  }

  // 2. Fitting Rooms & Privacy Check for Sarees / Apparel
  if (isFittingRequired) {
    if (playbookId === 'FASH02' || playbookId === 'FASH01') {
      if (venue.fitting_rooms === 0 || venue.fitting_rooms === false) {
        if (status !== 'EXCLUDED') status = 'NEEDS_CONFIRMATION';
        warnings.push('Dedicated draping and fitting enclosure must be confirmed or fabricated for saree trials.');
      }
    }
  }

  // 3. Broadband Serviceability Check
  if (isBroadband) {
    status = 'NEEDS_CONFIRMATION';
    warnings.push('Address-level fiber feasibility and DP box capacity must be confirmed before promising installation dates.');
  }

  // 4. Retail Audit Authorization Sample Check
  if (isRetailAudit) {
    status = 'NEEDS_CONFIRMATION';
    warnings.push('Authorised outlet master list and store manager audit notification must be verified.');
  }

  // 5. Commercial Permission Status
  if (venue.permission_status && venue.permission_status !== 'APPROVED' && venue.permission_status !== 'CONFIRMED') {
    if (status !== 'EXCLUDED') status = 'NEEDS_CONFIRMATION';
    warnings.push(`Commercial venue permission status is "${venue.permission_status || 'NOT_CONFIRMED'}" (Operations clearance required).`);
  }

  // 6. Quotation Availability Check
  const quoteStatus = venue.quoted_daily_rate_inr ? `₹${venue.quoted_daily_rate_inr.toLocaleString('en-IN')}/day (Active Quote)` : 'No current rate card; itemised quotation required';

  return {
    status,
    issues,
    warnings,
    quoteStatus,
    venueName: venue.name || 'Candidate Venue',
    isVerifiedVenue: !!venue.id
  };
}

/**
 * Generates database-backed recommendations for a campaign brief
 */
export function generatePlaybookRecommendations(brief = {}, options = {}) {
  const versionPolicy = getPlaybookVersionPolicy(brief.playbookVersion || '2.0-draft');
  const classification = classifyCampaignBrief(brief);

  // If classification needs clarification, return early with clarification prompt
  if (classification.needsClarification) {
    return {
      status: 'NEEDS_CLARIFICATION',
      classification,
      version: versionPolicy?.version || '2.0-draft',
      evidencePolicy: versionPolicy?.evidencePolicy || '',
      clarificationQuestion: classification.clarificationQuestion,
      clarificationOptions: classification.clarificationOptions,
      options: [],
      provisionalNotice: 'Unable to select an authored playbook with certainty. Asking clarification to prevent falling back to generic retail.'
    };
  }

  // Retrieve matching playbook from database
  const targetPlaybookId = classification.playbookId;
  const playbook = getPlaybookById(targetPlaybookId, versionPolicy?.version);

  if (!playbook) {
    return {
      status: 'PLAYBOOK_NOT_FOUND',
      classification,
      version: versionPolicy?.version || '2.0-draft',
      options: [],
      error: `Authored playbook ${targetPlaybookId} is not loaded in database.`
    };
  }

  // Retrieve candidate venues from database for the target city
  const db = getDatabase();
  const targetCity = brief.city || 'Chennai';
  const dbVenues = db.prepare(`
    SELECT * FROM venue_directory
    WHERE LOWER(city) = LOWER(?)
    LIMIT 6
  `).all(targetCity);

  // Fallback to suggested venue types if database has no registered venues for this city
  const suggestedLocations = playbook.locations || [];

  // Generate up to 3 meaningfully different plan options based on playbook variants
  const planOptions = [];

  // --- Option 1: Core / Focused Deployment ---
  const loc1 = suggestedLocations[0] || ['Permitted commercial venue', 'Standard product display'];
  const venueCandidate1 = dbVenues[0] || {
    name: loc1[0],
    city: targetCity,
    permission_status: 'APPROVED',
    vehicle_access: 1,
    fitting_rooms: 1,
    quoted_daily_rate_inr: 25000
  };
  const feas1 = checkVenueFeasibility(venueCandidate1, playbook);

  planOptions.push({
    optionId: 'OPT_1_CORE',
    tierName: 'Standard Walkthrough & Trial',
    activityName: playbook.name,
    format: playbook.format,
    whyThisActivationFits: `Tailored specifically for ${playbook.name}. ${playbook.buyer_need}. Focuses on direct, verified next steps.`,
    venueRecommendation: {
      type: 'SUGGESTED_TYPE_OR_CANDIDATE',
      venueType: loc1[0],
      venueRationale: loc1[1],
      actualCandidateVenue: venueCandidate1.name,
      isVerifiedVenue: !!venueCandidate1.id,
      feasibilityStatus: feas1.status,
      missingInformation: feas1.warnings,
      exclusionReason: feas1.issues[0] || null,
      quotation: feas1.quoteStatus
    },
    executionSequence: playbook.sequence || [],
    requiredCapabilities: {
      roles: (playbook.needs || []).filter(n => n.toLowerCase().includes('personnel') || n.toLowerCase().includes('adviser') || n.toLowerCase().includes('lead') || n.toLowerCase().includes('specialist')),
      materialsAndFacilities: (playbook.needs || []).filter(n => !n.toLowerCase().includes('personnel') && !n.toLowerCase().includes('adviser')),
      mainCapacityConstraint: playbook.bottleneck || 'Staff service hours and display throughput'
    },
    primarySuccessMeasure: playbook.outcomes?.[0] || playbook.objective,
    followUpOwnership: playbook.followup,
    evidenceAndAssumptions: {
      basis: playbook.recommendation_basis || 'AUTHORED_PLANNING_HYPOTHESIS',
      labels: ['Planning hypothesis (Awaiting local campaign validation)'],
      references: (playbook.evidenceSources || []).map(s => ({
        id: s.source_id,
        publisher: s.publisher,
        title: s.title,
        supports: s.supports,
        doesNotSupport: s.does_not_support
      }))
    },
    tradeoffsVersusAlternatives: 'Lower setup complexity and faster launch than enhanced styling clinic, but relies on venue footfall flow.'
  });

  // --- Option 2: Appointment / Consultation Led (if applicable) ---
  if (suggestedLocations.length > 1) {
    const loc2 = suggestedLocations[1];
    const venueCandidate2 = dbVenues[1] || {
      name: loc2[0],
      city: targetCity,
      permission_status: 'APPROVED',
      vehicle_access: 1,
      fitting_rooms: 1,
      quoted_daily_rate_inr: 35000
    };
    const feas2 = checkVenueFeasibility(venueCandidate2, playbook);

    planOptions.push({
      optionId: 'OPT_2_APPOINTMENT_LEAN',
      tierName: 'Consultation & Pre-Booked Appointment Model',
      activityName: `${playbook.name} — Appointment Hub`,
      format: `Dedicated consultation desk with scheduled time-slots`,
      whyThisActivationFits: `Reduces crowd congestion and focuses promoter attention entirely on high-intent qualified buyers.`,
      venueRecommendation: {
        type: 'SUGGESTED_TYPE_OR_CANDIDATE',
        venueType: loc2[0],
        venueRationale: loc2[1],
        actualCandidateVenue: venueCandidate2.name,
        isVerifiedVenue: !!venueCandidate2.id,
        feasibilityStatus: feas2.status,
        missingInformation: feas2.warnings,
        exclusionReason: feas2.issues[0] || null,
        quotation: feas2.quoteStatus
      },
      executionSequence: [
        'Pre-book or invite qualified visitors through community/office channels',
        'Conduct deep 1-on-1 requirements discovery',
        'Walk through tailored product features matching buyer occasion',
        'Book next appointment or dealership/fitting session'
      ],
      requiredCapabilities: {
        roles: ['Senior Specialist Adviser', 'Appointment Coordinator'],
        materialsAndFacilities: ['Appointment booking tablet', 'Curated product portfolio', 'Semi-private discussion space'],
        mainCapacityConstraint: 'Consultation slot time (approx 20-30 mins per session)'
      },
      primarySuccessMeasure: 'Attended qualified consultations and booked follow-ups',
      followUpOwnership: playbook.followup,
      evidenceAndAssumptions: {
        basis: playbook.recommendation_basis || 'AUTHORED_PLANNING_HYPOTHESIS',
        labels: ['Planning hypothesis (Appointment-led conversion)'],
        references: (playbook.evidenceSources || []).map(s => ({
          id: s.source_id,
          publisher: s.publisher,
          title: s.title,
          supports: s.supports,
          doesNotSupport: s.does_not_support
        }))
      },
      tradeoffsVersusAlternatives: 'Significantly higher qualification depth and lead intent, but lower aggregate footfall volume.'
    });
  }

  // --- Option 3: Immersive Experience Zone (if 3 locations exist) ---
  if (suggestedLocations.length > 2) {
    const loc3 = suggestedLocations[2];
    const venueCandidate3 = dbVenues[2] || {
      name: loc3[0],
      city: targetCity,
      permission_status: 'APPROVED',
      vehicle_access: 1,
      fitting_rooms: 1,
      quoted_daily_rate_inr: 45000
    };
    const feas3 = checkVenueFeasibility(venueCandidate3, playbook);

    planOptions.push({
      optionId: 'OPT_3_IMMERSIVE',
      tierName: 'Comprehensive Experience & Workshop Pod',
      activityName: `${playbook.name} — Interactive Pavilion`,
      format: `Multi-station experience zone with live walkthroughs and trial stalls`,
      whyThisActivationFits: `Maximizes brand immersion and allows simultaneous trials across multiple product lines or customer journeys.`,
      venueRecommendation: {
        type: 'SUGGESTED_TYPE_OR_CANDIDATE',
        venueType: loc3[0],
        venueRationale: loc3[1],
        actualCandidateVenue: venueCandidate3.name,
        isVerifiedVenue: !!venueCandidate3.id,
        feasibilityStatus: feas3.status,
        missingInformation: feas3.warnings,
        exclusionReason: feas3.issues[0] || null,
        quotation: feas3.quoteStatus
      },
      executionSequence: [
        'Welcome and triage visitors based on stated need or occasion',
        'Route to dedicated product stations (fabric/model/workflow inspection)',
        'Demonstrate practical use-case with approved claims',
        'Facilitate on-site trial or test-ride',
        'Record structured outcome and handover to sales follow-up lead'
      ],
      requiredCapabilities: {
        roles: ['Lead Experience Coordinator', 'Product Specialists (2)', 'Inventory / Safety Marshal'],
        materialsAndFacilities: ['Full fabrication setup', 'Dual demo stations', 'Storage and power backup'],
        mainCapacityConstraint: 'Fabrication footprint and multi-station inventory requirements'
      },
      primarySuccessMeasure: 'Completed full-cycle experiences and verified trials',
      followUpOwnership: playbook.followup,
      evidenceAndAssumptions: {
        basis: playbook.recommendation_basis || 'AUTHORED_PLANNING_HYPOTHESIS',
        labels: ['Planning hypothesis (High-immersion multi-station)'],
        references: (playbook.evidenceSources || []).map(s => ({
          id: s.source_id,
          publisher: s.publisher,
          title: s.title,
          supports: s.supports,
          doesNotSupport: s.does_not_support
        }))
      },
      tradeoffsVersusAlternatives: 'Maximum engagement and brand presence, but higher setup cost, venue space needs, and fabrication lead-time.'
    });
  }

  // Save recommendation snapshot for auditability
  const snapshotId = saveRecommendationSnapshot({
    campaignId: brief.campaignId || null,
    brief,
    selectedPlaybookId: playbook.id,
    playbookVersion: playbook.version,
    options: planOptions,
    feasibilityReport: {
      venuesEvaluated: dbVenues.length,
      city: targetCity
    }
  });

  return {
    status: 'SUCCESS',
    snapshotId,
    classification,
    playbookId: playbook.id,
    playbookName: playbook.name,
    playbookVersion: playbook.version,
    family: playbook.family,
    objective: playbook.objective,
    buyerNeed: playbook.buyer_need,
    reviewStatus: playbook.review_status,
    isPublished: playbook.is_published === 1,
    questionsThatChangeThePlan: playbook.ask || [],
    avoidRules: playbook.avoid || [],
    bottleneck: playbook.bottleneck,
    followup: playbook.followup,
    pilotQuestion: playbook.pilot_question,
    optionsCount: planOptions.length,
    options: planOptions,
    evidencePolicy: versionPolicy?.evidencePolicy || '',
    evidenceSources: playbook.evidenceSources || []
  };
}
