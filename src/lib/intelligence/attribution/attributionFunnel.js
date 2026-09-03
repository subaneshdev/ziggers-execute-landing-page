/**
 * Ziggers Intelligence - Physical-to-Digital Attribution Funnel
 * Models multi-stage digital conversion tracking from offline touchpoints:
 * Physical Sample/Interaction -> QR Scan -> Landing Page Visit -> Lead/Signup -> Activated Customer
 */

/**
 * Calculate multi-stage attribution metrics with zero division protection
 * @param {Object} params
 * @returns {Object}
 */
export function calculateAttributionFunnel(params) {
  const {
    physicalInteractions = 5000,
    samplesDistributed = 4800,
    qrScanRate = 0.15,
    landingSuccessRate = 0.60,
    signupRate = 0.30,
    activationRate = 0.40,
    campaignCost = 150000
  } = params;

  const totalInteractions = Math.max(0, Number(physicalInteractions) || 0);
  const totalSamples = Math.max(0, Number(samplesDistributed) || 0);
  const cost = Math.max(0, Number(campaignCost) || 0);

  // Stage 1: QR Scans from physical packaging or promoter displays
  const totalScans = Math.round(totalSamples * Math.min(1.0, Math.max(0.01, qrScanRate)));
  const uniqueScans = Math.round(totalScans * 0.85);
  const repeatScans = Math.max(0, totalScans - uniqueScans);

  // Stage 2: Successful Landing Visits
  const landingVisits = Math.round(uniqueScans * Math.min(1.0, Math.max(0.05, landingSuccessRate)));

  // Stage 3: Signups / Leads
  const signups = Math.round(landingVisits * Math.min(1.0, Math.max(0.02, signupRate)));

  // Stage 4: Activated Paying Customers
  const activatedCustomers = Math.round(signups * Math.min(1.0, Math.max(0.05, activationRate)));

  // Unit Economics (Zero Division Protected)
  const costPerScan = totalScans > 0 ? parseFloat((cost / totalScans).toFixed(2)) : null;
  const costPerVisit = landingVisits > 0 ? parseFloat((cost / landingVisits).toFixed(2)) : null;
  const costPerSignup = signups > 0 ? parseFloat((cost / signups).toFixed(2)) : null;
  const cac = activatedCustomers > 0 ? parseFloat((cost / activatedCustomers).toFixed(2)) : null;

  return {
    funnel: {
      physicalInteractions: totalInteractions,
      samplesDistributed: totalSamples,
      totalScans,
      uniqueScans,
      repeatScans,
      landingVisits,
      signups,
      activatedCustomers
    },
    conversionRates: {
      scanRatePct: parseFloat((qrScanRate * 100).toFixed(1)),
      landingSuccessRatePct: parseFloat((landingSuccessRate * 100).toFixed(1)),
      signupRatePct: parseFloat((signupRate * 100).toFixed(1)),
      activationRatePct: parseFloat((activationRate * 100).toFixed(1)),
      overallFunnelConversionPct: totalSamples > 0 ? parseFloat(((activatedCustomers / totalSamples) * 100).toFixed(2)) : 0
    },
    unitEconomics: {
      costPerScan: costPerScan !== null ? `₹${costPerScan.toLocaleString('en-IN')}` : 'N/A',
      costPerVisit: costPerVisit !== null ? `₹${costPerVisit.toLocaleString('en-IN')}` : 'N/A',
      costPerSignup: costPerSignup !== null ? `₹${costPerSignup.toLocaleString('en-IN')}` : 'N/A',
      cac: cac !== null ? `₹${cac.toLocaleString('en-IN')}` : null,
      cacFormatted: cac !== null ? `₹${cac.toLocaleString('en-IN')}` : 'N/A (0 Activated Customers)',
      cacNumeric: cac
    }
  };
}
