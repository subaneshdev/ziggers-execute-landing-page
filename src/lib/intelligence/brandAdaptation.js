/**
 * Ziggers Intelligence - Dynamic Brand & Campaign Profile Adapter
 * Automatically customizes audience, interests, behaviors, environments, and activation plans
 * for ANY brand, product, and industry. Eliminates static hardcoded defaults.
 */

import { classifyBrandUniversal, TOP_LEVEL_INDUSTRIES } from './brandTaxonomy.js';
import { generateObjectiveActivationPlan, generateActivationRequirements } from '../ecosystem/btlTaxonomy.js';

export { classifyBrandUniversal };

export const INDUSTRY_METRIC_PROFILES = {
  AUTOMOTIVE: {
    interests: ['motorcycling', 'car enthusiasts', 'road trips & touring', 'test rides & track days', 'engine performance', 'riding gear & safety', 'vehicle modifications', 'electric mobility'],
    behaviours: ['Attends weekend highway group rides', 'Auto expo & showroom visitor', 'Follows automotive vloggers', 'Actively evaluating vehicle upgrade', 'Motorcycle / car club member'],
    defaultAudienceName: 'Motorcycle & Automotive Enthusiasts',
    defaultOccupation: 'Young Professionals & Auto Enthusiasts',
    ageRange: [20, 35],
    environments: [
      {
        environment: 'Automotive Dealership Corridors & High Streets',
        whyExists: 'Concentrated automotive shoppers comparing models, test rides, and festive booking offers.',
        relevanceScore: 96,
        footfallQuality: 'High-Intent Vehicle Buyers',
        dwellTime: '45–90 mins',
        activationFormat: 'Vehicle Display Pod & Assisted Test-Ride Track'
      },
      {
        environment: 'Biker Cafes, Highway Rest Stops & Drive-Ins',
        whyExists: 'Active motorcycle riders and weekend highway drivers passionate about automotive culture.',
        relevanceScore: 92,
        footfallQuality: 'Riding Community & Enthusiasts',
        dwellTime: '45–75 mins',
        activationFormat: 'Pit-Stop Showcase & Rider Community Lounge'
      },
      {
        environment: 'Tech Parks & Corporate Hubs (Parking & Promenades)',
        whyExists: 'Working professionals seeking daily commuter upgrades and premium two-wheelers.',
        relevanceScore: 88,
        footfallQuality: 'Salaried Corporate Commuters',
        dwellTime: '20–40 mins',
        activationFormat: 'Corporate Test-Ride Booking Kiosk'
      }
    ]
  },
  TECHNOLOGY: {
    interests: ['tech & gadgets', 'software & saas', 'ai & automation', 'cloud computing', 'coding & developer tools', 'startups & founders', 'product management', 'cybersecurity'],
    behaviours: ['Tech park / IT corridor employee', 'Early adopter of digital apps', 'Attends tech webinars & hackathons', 'Active SaaS software evaluator', 'Subscribes to tech newsletters'],
    defaultAudienceName: 'Tech Professionals, Developers & Founders',
    defaultOccupation: 'Software Engineers, Founders & IT Decision Makers',
    ageRange: [22, 40],
    environments: [
      {
        environment: 'Tier-1 IT Tech Parks & SEZ Campuses',
        whyExists: 'Thousands of software engineers, team leads, and IT decision-makers with corporate purchasing power.',
        relevanceScore: 96,
        footfallQuality: 'Tech Professionals & Decision Makers',
        dwellTime: '30–60 mins',
        activationFormat: 'Atrium Interactive Demo Pod & Workflow Consultation Booth'
      },
      {
        environment: 'Co-Working Spaces & Startup Hubs',
        whyExists: 'High concentration of founders, freelance developers, and agile startup teams.',
        relevanceScore: 92,
        footfallQuality: 'Founders & Tech Teams',
        dwellTime: '45–90 mins',
        activationFormat: 'Lounge Area Product Experience Showcase'
      },
      {
        environment: 'Business District Metro Stations & Transit Nodes',
        whyExists: 'Commuters traveling directly to and from corporate headquarters during peak rush hours.',
        relevanceScore: 86,
        footfallQuality: 'Daily Corporate Commuters',
        dwellTime: '15–30 mins',
        activationFormat: 'Transit Concourse Information Kiosk & App Download Station'
      }
    ]
  },
  FOOD_AND_DINING: {
    interests: ['foodies & dining', 'artisan coffee & cafes', 'gourmet cooking', 'street food & night markets', 'baking & desserts', 'craft beverages', 'healthy dining', 'recipe discovery'],
    behaviours: ['Frequent restaurant diner (2+ times/week)', 'Power user of food delivery apps', 'Attends weekend food festivals', 'Explores new cafe openings', 'Active Yelp / Zomato reviewer'],
    defaultAudienceName: 'Foodies, Coffee Enthusiasts & Urban Diners',
    defaultOccupation: 'Working Professionals, Food Lovers & Families',
    ageRange: [18, 40],
    environments: [
      {
        environment: 'Shopping Mall Food Courts & Dining Squares',
        whyExists: 'High-density consumer traffic during lunch and dinner hours seeking culinary experiences and taste discovery.',
        relevanceScore: 96,
        footfallQuality: 'High Volume Dining Audience',
        dwellTime: '30–60 mins',
        activationFormat: 'Dedicated Taste Sampling Counter & Flavor Experience Booth'
      },
      {
        environment: 'Prominent High-Street Commercial & Cafe Boulevards',
        whyExists: 'Evening and weekend social footfall exploring dining, snacks, and lifestyle brands.',
        relevanceScore: 92,
        footfallQuality: 'Social & Leisure Diners',
        dwellTime: '45–90 mins',
        activationFormat: 'Sidewalk Pop-Up Kiosk & Voucher Distribution'
      },
      {
        environment: 'Corporate Tech Parks & Office Dining Zones',
        whyExists: 'Dense working professional populations during peak lunch hours (12:30–2:30 PM).',
        relevanceScore: 89,
        footfallQuality: 'High Disposable Income Professionals',
        dwellTime: '20–45 mins',
        activationFormat: 'Lunch-Hour Quick Sampling Pod'
      }
    ]
  },
  BEVERAGES: {
    interests: ['beverages & refreshments', 'artisan coffee & tea', 'healthy juices & smoothies', 'energy & functional drinks', 'craft beverages', 'hydration & fitness'],
    behaviours: ['Daily RTD beverage consumer', 'Regular cafe & beverage kiosk visitor', 'Seeks new flavour trials', 'Health-conscious ingredient checker'],
    defaultAudienceName: 'Beverage Consumers & Active Urbanites',
    defaultOccupation: 'Students, Young Professionals & Active Adults',
    ageRange: [18, 35],
    environments: [
      {
        environment: 'Commercial High Streets & Metro Stations',
        whyExists: 'High commuter transit footfall seeking on-the-go refreshment and hydration.',
        relevanceScore: 95,
        footfallQuality: 'On-the-go Consumers',
        dwellTime: '15–30 mins',
        activationFormat: 'Chilled Sampling Kiosk & Trial Dispensers'
      },
      {
        environment: 'Colleges & University Campuses',
        whyExists: 'Concentrated youth demographic seeking quick energy and refreshing drinks.',
        relevanceScore: 92,
        footfallQuality: 'Youth & Student Base',
        dwellTime: '30–60 mins',
        activationFormat: 'Campus Activity Pod & Can Trial Booth'
      },
      {
        environment: 'Shopping Mall Promenades & Food Courts',
        whyExists: 'Shoppers looking for thirst-quenching refreshments during shopping trips.',
        relevanceScore: 88,
        footfallQuality: 'Leisure Shoppers',
        dwellTime: '30–60 mins',
        activationFormat: 'Chilled Sampling Station & Brand Display'
      }
    ]
  },
  FASHION_AND_LIFESTYLE: {
    interests: ['fashion & apparel', 'streetwear & sneakers', 'luxury accessories', 'sustainable style', 'designer clothing', 'jewelry & watches', 'seasonal trends', 'footwear'],
    behaviours: ['Frequent shopping mall visitor', 'Active online fashion shopper', 'Follows lifestyle influencers', 'Visits flagship retail boutiques', 'Impulse apparel shopper'],
    defaultAudienceName: 'Fashion-Forward Shoppers & Style Enthusiasts',
    defaultOccupation: 'Urban Professionals, Creatives & Students',
    ageRange: [18, 35],
    environments: [
      {
        environment: 'Flagship Shopping Malls & Fashion Corridors',
        whyExists: 'High-intent shoppers actively browsing apparel, footwear, and lifestyle accessories.',
        relevanceScore: 96,
        footfallQuality: 'High Intent Retail Shoppers',
        dwellTime: '60–120 mins',
        activationFormat: 'Central Atrium Fashion Display & Style Consultation Booth'
      },
      {
        environment: 'Prime High-Street Retail Boulevards',
        whyExists: 'Footfall with strong fashion consideration and peer shopping dynamics.',
        relevanceScore: 92,
        footfallQuality: 'Urban Lifestyle Shoppers',
        dwellTime: '45–90 mins',
        activationFormat: 'Storefront Pop-Up & Seasonal Lookbook Showcase'
      },
      {
        environment: 'University Campuses & Youth Commercial Zones',
        whyExists: 'Trendsetting youth and college students seeking accessible, on-trend apparel.',
        relevanceScore: 88,
        footfallQuality: 'Youth Trendsetters',
        dwellTime: '30–60 mins',
        activationFormat: 'College Festival Pop-Up & Social Media UGC Booth'
      }
    ]
  },
  BEAUTY_AND_PERSONAL_CARE: {
    interests: ['skincare & beauty', 'organic cosmetics', 'haircare & styling', 'salon & spa wellness', 'dermatology & clean beauty', 'fragrances & perfumes', 'self-care routines'],
    behaviours: ['Samples beauty & cosmetic products', 'Watches skincare routine tutorials', 'Regular salon & spa client', 'Purchases premium personal care brands'],
    defaultAudienceName: 'Beauty, Skincare & Grooming Consumers',
    defaultOccupation: 'Working Professionals, College Students & Homemakers',
    ageRange: [18, 40],
    environments: [
      {
        environment: 'Shopping Malls & Department Store Beauty Squares',
        whyExists: 'Beauty and skincare consumers open to personal touch, trial application, and consultations.',
        relevanceScore: 96,
        footfallQuality: 'High Dwell Beauty Shoppers',
        dwellTime: '45–90 mins',
        activationFormat: 'Vanity Skin Consultation Counter & Sample Discovery Bar'
      },
      {
        environment: 'High-Street Salons, Spas & Wellness Corridors',
        whyExists: 'Consumers actively investing in personal grooming and aesthetic self-care.',
        relevanceScore: 91,
        footfallQuality: 'Self-Care Oriented Demographic',
        dwellTime: '30–60 mins',
        activationFormat: 'Complimentary Skin Analysis & Mini-Trial Pod'
      }
    ]
  },
  FITNESS_AND_SPORTS: {
    interests: ['fitness & gym', 'running & marathons', 'sports & athletics', 'sports turf games', 'healthy living & nutrition', 'crossfit & functional training', 'badminton & football'],
    behaviours: ['Gym visitor (3+ times/week)', 'Regular marathon & 10K runner', 'Sports club / turf member', 'Consumes protein & sports nutrition', 'Active weekend cyclist'],
    defaultAudienceName: 'Fitness Enthusiasts & Active Athletes',
    defaultOccupation: 'Fitness Enthusiasts, Sports Participants & Health-Conscious Adults',
    ageRange: [18, 38],
    environments: [
      {
        environment: 'Premium Fitness Centers, Gyms & CrossFit Arenas',
        whyExists: 'Active consumers seeking workout performance, hydration, and fitness apparel.',
        relevanceScore: 96,
        footfallQuality: 'High Energy Sports Audience',
        dwellTime: '45–75 mins',
        activationFormat: 'Workout Refreshment & Product Demo Station'
      },
      {
        environment: 'Sports Complexes, Turfs & Badminton Arenas',
        whyExists: 'Weekend and evening athletes engaging in competitive team sports.',
        relevanceScore: 90,
        footfallQuality: 'Community Athletes',
        dwellTime: '60–120 mins',
        activationFormat: 'Field-Side Hydration & Trial Booth'
      }
    ]
  },
  FINANCE: {
    interests: ['personal finance & investing', 'stock market & mutual funds', 'fintech & payments', 'credit cards & rewards', 'wealth management', 'banking apps'],
    behaviours: ['High digital transaction frequency', 'Credit card & loyalty point maximizer', 'Active investor on trading apps', 'Salaried corporate professional'],
    defaultAudienceName: 'Salaried Professionals & Investors',
    defaultOccupation: 'Corporate Executives, Business Owners & Salaried Employees',
    ageRange: [24, 45],
    environments: [
      {
        environment: 'Corporate Business Hubs & Financial Districts',
        whyExists: 'Concentration of high-earning salaried professionals evaluating financial instruments and cards.',
        relevanceScore: 95,
        footfallQuality: 'High Net-Worth Professionals',
        dwellTime: '20–45 mins',
        activationFormat: 'Consultation Lounge & On-Spot Digital Card Approval Kiosk'
      },
      {
        environment: 'Metro Transit Junctions & Airport Terminals',
        whyExists: 'Frequent business travelers receptive to premium credit card rewards and financial perks.',
        relevanceScore: 91,
        footfallQuality: 'Business Travelers',
        dwellTime: '20–45 mins',
        activationFormat: 'Express Airport Card / Finance Kiosk'
      }
    ]
  },
  EDUCATION: {
    interests: ['higher education', 'upskilling & certifications', 'study abroad', 'college lifestyle', 'career development', 'edtech & online courses'],
    behaviours: ['College campus student', 'Enrolled in online certification', 'Attends career fairs & webinars', 'Active library & study cafe visitor'],
    defaultAudienceName: 'Students, Career Aspirants & Lifelong Learners',
    defaultOccupation: 'College Students, Job Seekers & Upskilling Professionals',
    ageRange: [16, 28],
    environments: [
      {
        environment: 'University Campuses & College Clusters',
        whyExists: 'High-density youth student population looking for educational guidance, courses, and tools.',
        relevanceScore: 96,
        footfallQuality: 'Student Demographic',
        dwellTime: '30–60 mins',
        activationFormat: 'Campus Career Discovery Booth & Free Aptitude Test Kiosk'
      },
      {
        environment: 'Student Coaching Hubs & Library Corridors',
        whyExists: 'Dedicated students preparing for competitive exams and professional careers.',
        relevanceScore: 92,
        footfallQuality: 'Serious Aspirants',
        dwellTime: '30–60 mins',
        activationFormat: 'Admissions Counseling Pod & Free Mock Test Distribution'
      }
    ]
  },
  RETAIL_AND_ECOMMERCE: {
    interests: ['online shopping', 'lifestyle goods', 'home & living', 'bargain hunting & sales', 'brand discovery', 'quick commerce', 'product unboxings'],
    behaviours: ['High frequency e-commerce buyer', 'Follows brand flash sales & launches', 'Explores pop-up retail kiosks', 'Loyalty rewards member'],
    defaultAudienceName: 'Urban Consumers & Modern Household Shoppers',
    defaultOccupation: 'Working Professionals, Homemakers & Families',
    ageRange: [20, 45],
    environments: [
      {
        environment: 'High-Street Commercial Promenades & Retail Hubs',
        whyExists: 'Broad pedestrian footfall with high dwell time across commercial retail and entertainment.',
        relevanceScore: 93,
        footfallQuality: 'Diverse Commercial Footfall',
        dwellTime: '30–60 mins',
        activationFormat: 'Interactive Brand Activation Booth & Product Showcase'
      },
      {
        environment: 'Premier Shopping Malls & Lifestyle Centers',
        whyExists: 'Family and young professional footfall with disposable spending capacity.',
        relevanceScore: 90,
        footfallQuality: 'High Value Shoppers',
        dwellTime: '45–90 mins',
        activationFormat: 'Atrium Display & Experiential Engagement Zone'
      }
    ]
  }
};

/**
 * Resolves an industry key from text string
 */
export function resolveIndustryKey(str = '') {
  const text = (str || '').toLowerCase();
  const hasWord = (regex) => regex.test(text);

  if (hasWord(/\b(auto|motorcycle|motorcycles|bike|bikes|car|cars|two-wheeler|yamaha|enfield|ktm|honda|tvs|hero|bajaj|ather|ola)\b/i)) {
    return 'AUTOMOTIVE';
  }
  if (hasWord(/\b(energy drink|energy drinks|red bull|redbull|monster energy|sting energy|celsius)\b/i)) {
    return 'BEVERAGES';
  }
  if (hasWord(/\b(coffee|starbucks|tea|cold brew|latte|cafe|cafes|brewery|bakery|restaurant|restaurants|food|dining|snack|snacks|burger|burgers|pizza|pizzas|zomato|swiggy|mcdonald|kfc)\b/i)) {
    return 'FOOD_AND_DINING';
  }
  if (hasWord(/\b(shoe|shoes|sneaker|sneakers|footwear|nike|adidas|puma|apparel|clothing|fashion|shirt|shirts|jean|jeans|dress|dresses|wear|zara|h&m|levi|levis)\b/i)) {
    return 'FASHION_AND_LIFESTYLE';
  }
  if (hasWord(/\b(skin|skincare|beauty|cosmetic|cosmetics|makeup|hair|haircare|serum|lotion|perfume|fragrance|nykaa|loreal|lakme|salon|spa)\b/i)) {
    return 'BEAUTY_AND_PERSONAL_CARE';
  }
  if (hasWord(/\b(gym|gyms|fitness|workout|workouts|crossfit|athletics|cult\.?fit|gold'?s gym|marathon)\b/i)) {
    return 'FITNESS_AND_SPORTS';
  }
  if (hasWord(/\b(tech|software|saas|cloud|artificial intelligence|\bai\b|crm|\bapp\b|\bapps\b|developer|developers|zoho|slack|microsoft|google|apple|hubspot)\b/i)) {
    return 'TECHNOLOGY';
  }
  if (hasWord(/\b(bank|banking|invest|investing|investment|credit card|credit cards|loan|loans|fintech|payment|payments|upi|wealth|hdfc|icici|zerodha|groww)\b/i)) {
    return 'FINANCE';
  }
  if (hasWord(/\b(education|college|colleges|school|schools|course|courses|academy|learn|learning|upskill|byju|unacademy|exam|exams)\b/i)) {
    return 'EDUCATION';
  }
  if (hasWord(/\b(beverage|beverages|juice|juices|soda|cola|drink|drinks)\b/i)) {
    return 'BEVERAGES';
  }
  return 'RETAIL_AND_ECOMMERCE';
}

/**
 * Customizes entire campaign profile dynamically for ANY brand, product, and objective
 */
export function adaptCampaignProfile({
  brandName = '',
  productOrService = '',
  objective = 'Brand Awareness',
  city = 'Chennai',
  existingDraft = {}
}) {
  const brandTrimmed = (brandName || '').trim();
  const productTrimmed = (productOrService || '').trim();

  // If both empty, return clean generic template
  if (!brandTrimmed && !productTrimmed) {
    return {
      brandCategory: 'Retail',
      brandSubcategory: 'D2C Consumer Products & Lifestyle',
      brandProductLine: '',
      brandPricePositioning: 'Mid-Market',
      audienceName: 'Primary Target Audience',
      occupation: 'Working Professionals & Urban Consumers',
      ageRange: [20, 35],
      gender: 'All',
      selectedInterests: ['lifestyle & retail', 'brand discovery', 'shopping'],
      behaviours: ['Regular high-street & mall shoppers', 'Digital brand followers'],
      suggestedEnvironments: INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE.environments,
      recommendedEnvironments: INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE.environments,
      locations: [{
        id: 'loc_1',
        name: `${city || 'Chennai'} Central Commercial Hub`,
        city: city || 'Chennai',
        lat: 13.0827,
        lng: 80.2707,
        radiusKm: 3.0,
        radiusText: '3 km radius',
        analyzed: false
      }]
    };
  }

  // 1. Run Universal Taxonomy Classification
  const classification = classifyBrandUniversal({
    brandName: brandTrimmed,
    desc: productTrimmed
  });

  const indKey = resolveIndustryKey(`${classification.industry} ${classification.subcategory} ${brandTrimmed} ${productTrimmed}`);
  const profile = INDUSTRY_METRIC_PROFILES[indKey] || INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE;
  const isGenericMatch = classification.specificityScore <= 82;
  const primaryAudience = (!isGenericMatch && classification.audiences?.primary) ? classification.audiences.primary : {};

  // 2. Derive tailored audience & interests
  const audienceName = primaryAudience.name || profile.defaultAudienceName;
  const occupation = (primaryAudience.occupations && primaryAudience.occupations[0]) 
    ? primaryAudience.occupations.slice(0, 2).join(' & ') 
    : profile.defaultOccupation;
  const ageRange = primaryAudience.ageRange || profile.ageRange;
  const selectedInterests = (primaryAudience.interests && primaryAudience.interests.length > 0 && !isGenericMatch)
    ? primaryAudience.interests.slice(0, 6)
    : profile.interests.slice(0, 5);
  const behaviours = (primaryAudience.behaviours && primaryAudience.behaviours.length > 0 && !isGenericMatch)
    ? primaryAudience.behaviours.slice(0, 4)
    : profile.behaviours.slice(0, 4);

  // 3. Derive tailored environments
  const suggestedEnvironments = (primaryAudience.environments && primaryAudience.environments.length > 0 && !isGenericMatch)
    ? primaryAudience.environments
    : profile.environments;

  const resolvedIndustry = !isGenericMatch ? classification.industry : (indKey.charAt(0) + indKey.slice(1).toLowerCase().replace(/_/g, ' '));

  // 4. Derive objective activation plan
  const activationPlan = generateObjectiveActivationPlan({
    objective,
    brandName: brandTrimmed || 'Brand',
    brandCategory: resolvedIndustry,
    productLine: productTrimmed || classification.productCategory,
    audienceName,
    ageRange,
    environments: suggestedEnvironments,
    city
  });

  const requirements = generateActivationRequirements({
    activationPlan,
    objective,
    brandCategory: resolvedIndustry,
    productLine: productTrimmed || classification.productCategory,
    brandName: brandTrimmed || 'Brand',
    locationsCount: existingDraft.locations?.length || 1,
    city
  });

  return {
    brandCategory: resolvedIndustry,
    brandSubcategory: !isGenericMatch ? classification.subcategory : `${resolvedIndustry} Activation`,
    brandProductLine: productTrimmed || classification.productCategory,
    brandPricePositioning: classification.pricePositioning,
    audienceName,
    occupation,
    ageRange,
    gender: primaryAudience.gender || 'All',
    selectedInterests,
    behaviours,
    suggestedEnvironments,
    recommendedEnvironments: suggestedEnvironments,
    activationPlan,
    btlFormat: activationPlan.activationName,
    activationRequirements: requirements,
    locations: (existingDraft.locations && existingDraft.locations.length > 0 && existingDraft.locations[0]?.name && !existingDraft.locations[0]?.name.includes('Fitness Hub'))
      ? existingDraft.locations
      : [{
          id: 'loc_1',
          name: `${city || 'Chennai'} Central Commercial Hub`,
          city: city || 'Chennai',
          lat: 13.0827,
          lng: 80.2707,
          radiusKm: 3.0,
          radiusText: '3 km radius',
          analyzed: false
        }]
  };
}
