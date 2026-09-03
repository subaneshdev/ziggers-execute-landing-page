/**
 * Ziggers Intelligence - 24-Hour Time Distribution & Hourly Footfall Profiles
 * Models hourly commercial pedestrian traffic curves across commercial, tech park,
 * educational, residential, and transit nodes.
 */

// Normalized 24-hour baseline footfall curves (sums to ~1.0 per day)
export const HOURLY_PROFILES = {
  // Commercial High Streets & Shopping Malls (peaks in evening 4 PM - 9 PM)
  commercial_high_street: {
    6: 0.01, 7: 0.02, 8: 0.03, 9: 0.04, 10: 0.06, 11: 0.07,
    12: 0.08, 13: 0.07, 14: 0.06, 15: 0.07, 16: 0.09, 17: 0.11,
    18: 0.12, 19: 0.10, 20: 0.05, 21: 0.01, 22: 0.01, 23: 0.00
  },
  // IT Corridors & Tech Parks (peaks around lunch 12 PM - 2 PM and evening exit 5 PM - 7 PM)
  tech_park_corridor: {
    6: 0.00, 7: 0.02, 8: 0.08, 9: 0.14, 10: 0.09, 11: 0.06,
    12: 0.11, 13: 0.10, 14: 0.05, 15: 0.05, 16: 0.07, 17: 0.10,
    18: 0.08, 19: 0.03, 20: 0.01, 21: 0.01, 22: 0.00, 23: 0.00
  },
  // College Campuses & Youth Zones (peaks 11 AM - 5 PM)
  campus_youth_hub: {
    6: 0.00, 7: 0.02, 8: 0.07, 9: 0.10, 10: 0.09, 11: 0.09,
    12: 0.12, 13: 0.11, 14: 0.09, 15: 0.10, 16: 0.09, 17: 0.06,
    18: 0.03, 19: 0.02, 20: 0.01, 21: 0.00, 22: 0.00, 23: 0.00
  },
  // Transit Junctions & Metro Hubs (dual morning 8-10 AM & evening 5-9 PM commuter surges)
  transit_hub: {
    6: 0.02, 7: 0.05, 8: 0.12, 9: 0.13, 10: 0.07, 11: 0.05,
    12: 0.05, 13: 0.05, 14: 0.05, 15: 0.06, 16: 0.08, 17: 0.11,
    18: 0.10, 19: 0.05, 20: 0.01, 21: 0.00, 22: 0.00, 23: 0.00
  }
};

/**
 * Get active footfall exposure fraction during campaign operating hours
 * @param {string} locationType 
 * @param {number} startHour - e.g. 16 (4:00 PM)
 * @param {number} durationHours - e.g. 5 (till 9:00 PM)
 * @returns {{ activeHourFraction: number, hourlyDistribution: Object, peakHour: number }}
 */
export function calculateTimeWindowExposure(locationType = 'commercial', startHour = 16, durationHours = 5) {
  let profile = HOURLY_PROFILES.commercial_high_street;
  const lType = (locationType || '').toLowerCase();

  if (lType.includes('tech') || lType.includes('office') || lType.includes('tidel')) {
    profile = HOURLY_PROFILES.tech_park_corridor;
  } else if (lType.includes('college') || lType.includes('campus') || lType.includes('student')) {
    profile = HOURLY_PROFILES.campus_youth_hub;
  } else if (lType.includes('commercial') || lType.includes('mall') || lType.includes('high street') || lType.includes('market')) {
    profile = HOURLY_PROFILES.commercial_high_street;
  } else if (lType.includes('transit') || lType.includes('metro') || lType.includes('station')) {
    profile = HOURLY_PROFILES.transit_hub;
  }

  const sHour = Math.max(6, Math.min(22, Number(startHour) || 16));
  const dHours = Math.max(1, Math.min(14, Number(durationHours) || 5));
  const endHour = Math.min(23, sHour + dHours);

  let activeHourFraction = 0;
  let maxHourVal = -1;
  let peakHour = sHour;

  for (let h = sHour; h < endHour; h++) {
    const fraction = profile[h] || 0.04;
    activeHourFraction += fraction;
    if (fraction > maxHourVal) {
      maxHourVal = fraction;
      peakHour = h;
    }
  }

  return {
    activeHourFraction: parseFloat(Math.min(1.0, activeHourFraction).toFixed(4)),
    hourlyProfileMap: profile,
    operatingWindow: `${sHour % 12 || 12}:00 ${sHour >= 12 ? 'PM' : 'AM'} – ${endHour % 12 || 12}:00 ${endHour >= 12 ? 'PM' : 'AM'}`,
    peakHour: `${peakHour % 12 || 12}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`
  };
}
