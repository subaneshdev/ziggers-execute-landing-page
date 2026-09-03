/**
 * Ziggers Intelligence - Demographic Matcher
 * Implements continuous proportional age interpolation across non-aligned census bins
 * and neutral gender availability calculations.
 */

// Census standard demographic bins with boundary ranges
export const CENSUS_AGE_BINS = [
  { key: '18-24', min: 18, max: 24, span: 7 },
  { key: '25-34', min: 25, max: 34, span: 10 },
  { key: '35-44', min: 35, max: 44, span: 10 },
  { key: '45-54', min: 45, max: 54, span: 10 },
  { key: '55-64', min: 55, max: 64, span: 10 },
  { key: '65+',   min: 65, max: 80, span: 16 }
];

/**
 * Calculate dynamic demographic age eligibility ratio (R_age)
 * Proportionally interpolates overlapping fractions across demographic bins.
 * @param {number} ageMin - e.g. 18
 * @param {number} ageMax - e.g. 34
 * @param {Object} ageDistribution - e.g. { '18-24': 0.22, '25-34': 0.34, ... }
 * @returns {{ ageEligibilityRatio: number, binContributions: Object }}
 */
export function calculateAgeEligibility(ageMin = 18, ageMax = 35, ageDistribution = {}) {
  // Clamp boundaries
  const targetMin = Math.max(18, Math.min(80, Number(ageMin) || 18));
  const targetMax = Math.max(targetMin, Math.min(80, Number(ageMax) || 35));

  if (targetMin <= 18 && targetMax >= 65) {
    return {
      ageEligibilityRatio: 1.0,
      binContributions: { all: 1.0 }
    };
  }

  let totalAgeEligibility = 0;
  const binContributions = {};

  CENSUS_AGE_BINS.forEach(bin => {
    const binShare = ageDistribution[bin.key] || 0.166;
    
    // Check overlap interval between [targetMin, targetMax] and [bin.min, bin.max]
    const overlapMin = Math.max(targetMin, bin.min);
    const overlapMax = Math.min(targetMax, bin.max);

    if (overlapMax >= overlapMin) {
      const overlapYears = (overlapMax - overlapMin) + 1;
      const binTotalYears = (bin.max - bin.min) + 1;
      const proportionalFraction = Math.min(1.0, overlapYears / binTotalYears);
      
      const contribution = binShare * proportionalFraction;
      totalAgeEligibility += contribution;
      binContributions[bin.key] = parseFloat(contribution.toFixed(4));
    } else {
      binContributions[bin.key] = 0;
    }
  });

  // Clamp ratio between 0.05 and 1.0
  const ageEligibilityRatio = Math.max(0.05, Math.min(1.0, parseFloat(totalAgeEligibility.toFixed(4))));

  return {
    ageEligibilityRatio,
    binContributions,
    targetRange: `${targetMin}–${targetMax} Years`
  };
}

/**
 * Calculate Gender Availability
 * Gender selection adjusts audience availability without arbitrarily penalizing match quality.
 * @param {string} gender - 'All' | 'Male' | 'Female'
 * @param {Object} genderDistribution - { male: 0.51, female: 0.49 }
 * @returns {{ genderAvailabilityRatio: number, genderLabel: string }}
 */
export function calculateGenderAvailability(gender = 'All', genderDistribution = { male: 0.51, female: 0.49 }) {
  const normGender = (gender || 'All').trim().toLowerCase();
  
  if (normGender === 'male') {
    return {
      genderAvailabilityRatio: genderDistribution.male || 0.51,
      genderLabel: 'Targeting Male Demographics'
    };
  }
  
  if (normGender === 'female') {
    return {
      genderAvailabilityRatio: genderDistribution.female || 0.49,
      genderLabel: 'Targeting Female Demographics'
    };
  }

  return {
    genderAvailabilityRatio: 1.0,
    genderLabel: 'All Genders (100% Available)'
  };
}
