/**
 * Ziggers Intelligence - Multi-Signal Verification & Anti-Spoofing Engine
 * 
 * Assesses multiple independent ground signals:
 * 1. GPS Radial Distance & GPS Accuracy Circle
 * 2. Hardware Mock Location Sensor Flags
 * 3. Kinematic Velocity / Anti-Teleportation Bounds
 * 4. Supervisor Spot-Check Confirmation
 * 5. Photographic Proof & Camera Telemetry
 * 
 * Returns qualitative confidence: LOW, MEDIUM, HIGH (Never false 99.7% percentages).
 */

import { calculateHaversineDistanceMeters } from '../geo/h3Engine.js';
import { CONFIDENCE_LEVELS } from '../provenance.js';

export const GEOFENCE_POLICIES = {
  defaultAllowedRadiusMeters: 50,
  maxAccuracyToleranceCapMeters: 20,
  maxAcceptableGpsAccuracyMeters: 50,
  maxRealisticHumanVelocityKmh: 120
};

/**
 * Validate on-ground check-in location with multi-signal confidence
 * @param {Object} checkinData
 * @returns {Object} Multi-signal verification report
 */
export function validateGeofenceCheckin(checkinData) {
  const {
    targetLat,
    targetLng,
    actualLat,
    actualLng,
    gpsAccuracyMeters = 8,
    allowedRadiusMeters = GEOFENCE_POLICIES.defaultAllowedRadiusMeters,
    lastCheckinTime = null,
    lastCheckinLat = null,
    lastCheckinLng = null,
    isMockGpsDetected = false,
    hasPhotoSubmitted = false,
    isSupervisorConfirmed = false
  } = checkinData;

  const signals = [];
  const flags = [];

  // 1. Hardware Mock Location Flag Check
  if (isMockGpsDetected) {
    flags.push('Mock GPS provider or location emulation detected');
    return {
      isWithinGeofence: false,
      verificationStatus: 'REJECTED_MOCK_LOCATION',
      verificationConfidence: CONFIDENCE_LEVELS.LOW,
      distanceMeters: null,
      signals,
      flags,
      reason: 'Anti-spoofing sensor detected mock GPS provider or location emulation.',
      riskScore: 99
    };
  }

  // 2. Maximum Acceptable GPS Accuracy Check
  const accuracy = Math.max(1, Number(gpsAccuracyMeters) || 10);
  if (accuracy > GEOFENCE_POLICIES.maxAcceptableGpsAccuracyMeters) {
    flags.push(`GPS accuracy degraded (${accuracy}m > ${GEOFENCE_POLICIES.maxAcceptableGpsAccuracyMeters}m)`);
    return {
      isWithinGeofence: false,
      verificationStatus: 'REJECTED_LOW_ACCURACY_DRIFT',
      verificationConfidence: CONFIDENCE_LEVELS.LOW,
      distanceMeters: null,
      signals,
      flags,
      reason: `GPS accuracy circle of ${accuracy}m exceeds maximum threshold (${GEOFENCE_POLICIES.maxAcceptableGpsAccuracyMeters}m).`,
      riskScore: 75,
      requiresRetry: true
    };
  }

  // 3. Distance Calculation
  const distanceMeters = calculateHaversineDistanceMeters(targetLat, targetLng, actualLat, actualLng);
  const accuracyTolerance = Math.min(accuracy, GEOFENCE_POLICIES.maxAccuracyToleranceCapMeters);
  const effectiveAllowedRadius = allowedRadiusMeters + accuracyTolerance;
  const isInside = distanceMeters <= effectiveAllowedRadius;

  if (isInside) {
    signals.push(`GPS within geofence (${Math.round(distanceMeters)}m <= ${Math.round(effectiveAllowedRadius)}m)`);
  } else {
    flags.push(`GPS outside geofence (${Math.round(distanceMeters)}m > ${Math.round(effectiveAllowedRadius)}m)`);
  }

  // 4. Kinematic Velocity Anomaly Detection (Anti-Teleportation)
  let velocityKmh = 0;
  if (lastCheckinTime && lastCheckinLat !== null && lastCheckinLng !== null) {
    const elapsedHours = Math.max(0.001, (Date.now() - new Date(lastCheckinTime).getTime()) / (1000 * 60 * 60));
    const distFromLastMeters = calculateHaversineDistanceMeters(lastCheckinLat, lastCheckinLng, actualLat, actualLng);
    velocityKmh = (distFromLastMeters / 1000) / elapsedHours;

    if (velocityKmh > GEOFENCE_POLICIES.maxRealisticHumanVelocityKmh) {
      flags.push(`Impossible kinematic travel velocity detected: ${Math.round(velocityKmh)} km/h`);
      return {
        isWithinGeofence: false,
        verificationStatus: 'FLAGGED_TELEPORTATION_ANOMALY',
        verificationConfidence: CONFIDENCE_LEVELS.LOW,
        distanceMeters: Math.round(distanceMeters),
        velocityKmh: Math.round(velocityKmh),
        signals,
        flags,
        reason: `Physical impossibility detected: worker moved at ${Math.round(velocityKmh)} km/h between check-ins.`,
        riskScore: 92
      };
    }
  }

  if (hasPhotoSubmitted) {
    signals.push('Photographic proof submitted');
  } else {
    flags.push('No on-site photo submitted');
  }

  if (isSupervisorConfirmed) {
    signals.push('Supervisor verified on site');
  } else {
    flags.push('Supervisor on-site confirmation pending');
  }

  // Multi-Signal Confidence Determination
  let verificationConfidence = CONFIDENCE_LEVELS.LOW;
  if (isInside && hasPhotoSubmitted && isSupervisorConfirmed) {
    verificationConfidence = CONFIDENCE_LEVELS.HIGH;
  } else if (isInside && (hasPhotoSubmitted || isSupervisorConfirmed)) {
    verificationConfidence = CONFIDENCE_LEVELS.MODERATE;
  }

  return {
    isWithinGeofence: isInside,
    verificationStatus: isInside ? (verificationConfidence === CONFIDENCE_LEVELS.HIGH ? 'VERIFIED_HIGH_CONFIDENCE' : 'VERIFIED_PROVISIONAL') : 'REJECTED_OUTSIDE_GEOFENCE',
    verificationConfidence,
    distanceMeters: Math.round(distanceMeters),
    effectiveAllowedRadius: Math.round(effectiveAllowedRadius),
    accuracyTolerance: Math.round(accuracyTolerance),
    gpsAccuracy: Math.round(accuracy),
    signals,
    flags,
    riskScore: isInside ? (verificationConfidence === CONFIDENCE_LEVELS.HIGH ? 5 : 25) : 80,
    reason: isInside 
      ? `Promoter within ${Math.round(distanceMeters)}m. Multi-signal confidence: ${verificationConfidence}.`
      : `Promoter is ${Math.round(distanceMeters)}m away, exceeding ${Math.round(effectiveAllowedRadius)}m allowance.`
  };
}
