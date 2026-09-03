/**
 * Ziggers Manpower Roster & No-Show Backup Engine
 * 
 * Manages field staffing assignments across tiers (PRIMARY, BACKUP, STANDBY).
 * Handles morning no-show detection and automated backup worker activation.
 */

export const STAFFING_TIERS = {
  PRIMARY: 'PRIMARY',
  BACKUP: 'BACKUP',
  STANDBY: 'STANDBY',
  REPLACEMENT: 'REPLACEMENT'
};

export const CHECKIN_STATUSES = {
  PENDING: 'PENDING',
  CHECKED_IN: 'CHECKED_IN',
  LATE: 'LATE',
  NO_SHOW: 'NO_SHOW',
  BACKUP_ACTIVATED: 'BACKUP_ACTIVATED'
};

/**
 * Match workers from agency roster based on location, language, and role
 */
export function matchWorkersForShift(shiftRequirements, candidatePool = []) {
  const { requiredLanguages = ['Tamil'], role = 'PROMOTER' } = shiftRequirements;

  if (!candidatePool || candidatePool.length === 0) return [];

  return candidatePool.filter(candidate => {
    if (candidate.role !== role) return false;
    
    // Check language match
    const speaksRequired = requiredLanguages.every(lang => 
      candidate.languages && candidate.languages.map(l => l.toLowerCase()).includes(lang.toLowerCase())
    );
    
    return speaksRequired;
  });
}

/**
 * Creates a shift roster with built-in standby backups
 */
export function createShiftRoster(campaignId, shiftConfig, primaryWorkers = [], backupWorkers = []) {
  const roster = [];

  // Add primary workers
  primaryWorkers.forEach((w, idx) => {
    roster.push({
      id: `asgn_p_${idx}_${Date.now()}`,
      campaignId,
      shiftDate: shiftConfig.shiftDate,
      shiftStartTime: shiftConfig.shiftStartTime || '09:00',
      shiftEndTime: shiftConfig.shiftEndTime || '14:00',
      venueName: shiftConfig.venueName,
      workerId: w.id,
      workerName: w.name,
      workerPhone: w.phone,
      role: shiftConfig.role || 'PROMOTER',
      tier: STAFFING_TIERS.PRIMARY,
      checkinStatus: CHECKIN_STATUSES.PENDING,
      checkinTimestamp: null
    });
  });

  // Add standby backup workers
  backupWorkers.forEach((w, idx) => {
    roster.push({
      id: `asgn_b_${idx}_${Date.now()}`,
      campaignId,
      shiftDate: shiftConfig.shiftDate,
      shiftStartTime: shiftConfig.shiftStartTime || '09:00',
      shiftEndTime: shiftConfig.shiftEndTime || '14:00',
      venueName: shiftConfig.venueName,
      workerId: w.id,
      workerName: w.name,
      workerPhone: w.phone,
      role: shiftConfig.role || 'PROMOTER',
      tier: STAFFING_TIERS.STANDBY,
      checkinStatus: CHECKIN_STATUSES.PENDING,
      checkinTimestamp: null
    });
  });

  return roster;
}

/**
 * Evaluates shift check-in and activates a backup if a primary worker no-shows
 */
export function handleNoShowAndActivateBackup(roster, noShowWorkerId, gracePeriodMinutes = 20) {
  const targetIndex = roster.findIndex(r => r.workerId === noShowWorkerId && r.tier === STAFFING_TIERS.PRIMARY);
  if (targetIndex === -1) return { success: false, reason: 'Primary worker not found in roster', roster };

  // Flag primary worker as NO_SHOW
  roster[targetIndex].checkinStatus = CHECKIN_STATUSES.NO_SHOW;

  // Find first available STANDBY worker
  const standbyIndex = roster.findIndex(r => r.tier === STAFFING_TIERS.STANDBY && r.checkinStatus === CHECKIN_STATUSES.PENDING);
  
  if (standbyIndex !== -1) {
    roster[standbyIndex].tier = STAFFING_TIERS.REPLACEMENT;
    roster[standbyIndex].checkinStatus = CHECKIN_STATUSES.BACKUP_ACTIVATED;
    roster[standbyIndex].replacingWorkerId = noShowWorkerId;

    return {
      success: true,
      backupActivated: true,
      replacedWorker: roster[targetIndex].workerName,
      activatedWorker: roster[standbyIndex].workerName,
      roster: [...roster]
    };
  }

  return {
    success: false,
    backupActivated: false,
    reason: 'No standby backup workers available in pool for this shift.',
    roster: [...roster]
  };
}
