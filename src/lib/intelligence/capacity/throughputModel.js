/**
 * Ziggers Intelligence - Objective Throughput Model
 * Real-world physical promoter engagement limits across offline activation formats.
 */

export const OBJECTIVE_THROUGHPUT_RATES = {
  'Product Sampling': {
    minPerHour: 30,
    expectedPerHour: 42,
    maxPerHour: 55,
    description: 'High-speed physical hand-to-hand product sampling with quick pitch'
  },
  'Lead Generation': {
    minPerHour: 15,
    expectedPerHour: 22,
    maxPerHour: 30,
    description: 'Form filling, contact capture, OTP verification, and detailed qualification'
  },
  'App Downloads': {
    minPerHour: 10,
    expectedPerHour: 16,
    maxPerHour: 22,
    description: 'Guided QR scan, app store install, onboarding, and first in-app action'
  },
  'Store Visits': {
    minPerHour: 20,
    expectedPerHour: 30,
    maxPerHour: 40,
    description: 'Voucher distribution, store guidance, and directional footfall drive'
  },
  'Retail Activation & POSM': {
    minPerHour: 20,
    expectedPerHour: 28,
    maxPerHour: 38,
    description: 'Shelf share audit, merchandising, and end-cap customer demo'
  },
  'Merchant Onboarding Drive': {
    minPerHour: 6,
    expectedPerHour: 9,
    maxPerHour: 14,
    description: 'Store-to-store merchant acquisition, KYC collection, and QR kit deployment'
  },
  'Flyer Distribution': {
    minPerHour: 60,
    expectedPerHour: 75,
    maxPerHour: 95,
    description: 'Fast-paced informational leaflet and pamphlet distribution'
  },
  'Default': {
    minPerHour: 25,
    expectedPerHour: 35,
    maxPerHour: 45,
    description: 'Standard brand interaction and audience engagement'
  }
};

/**
 * Get throughput configuration for an objective
 */
export function getThroughputConfig(objective = 'Product Sampling') {
  return OBJECTIVE_THROUGHPUT_RATES[objective] || OBJECTIVE_THROUGHPUT_RATES.Default;
}
