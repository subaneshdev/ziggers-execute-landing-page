/**
 * Ziggers Campaign Execution Readiness Engine
 * 
 * Evaluates real physical dependencies before a campaign can go live.
 * Output is strictly categorical (READY, AT_RISK, BLOCKED, PENDING_INFORMATION).
 * Never generates arbitrary readiness percentages.
 */

export const READINESS_STATUSES = {
  READY: 'READY',
  AT_RISK: 'AT_RISK',
  BLOCKED: 'BLOCKED',
  PENDING_INFORMATION: 'PENDING_INFORMATION'
};

/**
 * Evaluates overall operational readiness across 5 critical dependencies
 * @param {Object} context 
 * @returns {Object} Categorical readiness report with explicit blockers
 */
export function evaluateCampaignReadiness(context = {}) {
  const {
    isVenuePermissionApproved = false,
    permissionDetails = 'Mall NOC pending',
    isMinimumStaffConfirmed = false,
    staffCount = 0,
    requiredStaff = 10,
    isSupervisorAssigned = false,
    isMaterialsDelivered = false,
    materialsStatus = 'In Transit',
    areCriticalWorkOrdersAccepted = false
  } = context;

  const blockers = [];
  const warnings = [];

  // 1. Venue Permissions Check (Critical Blocker)
  if (!isVenuePermissionApproved) {
    blockers.push({
      type: 'VENUE_PERMISSION',
      severity: 'CRITICAL',
      message: `Venue operational clearance required: ${permissionDetails}.`
    });
  }

  // 2. Staffing Confirmation Check
  if (!isMinimumStaffConfirmed || staffCount < requiredStaff) {
    blockers.push({
      type: 'STAFFING',
      severity: 'HIGH',
      message: `Staffing shortfall: ${staffCount}/${requiredStaff} promoters confirmed.`
    });
  }

  // 3. Supervisor Assignment Check
  if (!isSupervisorAssigned) {
    warnings.push({
      type: 'SUPERVISOR',
      severity: 'MEDIUM',
      message: 'On-site field operations supervisor has not been assigned.'
    });
  }

  // 4. Critical Materials Delivery Check
  if (!isMaterialsDelivered) {
    blockers.push({
      type: 'MATERIALS_LOGISTICS',
      severity: 'CRITICAL',
      message: `Critical campaign materials not yet delivered to venue: ${materialsStatus}.`
    });
  }

  // 5. Work Orders Acceptance Check
  if (!areCriticalWorkOrdersAccepted) {
    warnings.push({
      type: 'WORK_ORDERS',
      severity: 'HIGH',
      message: 'One or more vendor Work Orders are awaiting vendor formal acceptance.'
    });
  }

  // Determine Categorical Status
  let status = READINESS_STATUSES.READY;
  if (blockers.some(b => b.severity === 'CRITICAL')) {
    status = READINESS_STATUSES.BLOCKED;
  } else if (blockers.length > 0 || warnings.some(w => w.severity === 'HIGH')) {
    status = READINESS_STATUSES.AT_RISK;
  } else if (warnings.length > 0) {
    status = READINESS_STATUSES.PENDING_INFORMATION;
  }

  return {
    status,
    isExecutable: status === READINESS_STATUSES.READY,
    blockersCount: blockers.length,
    warningsCount: warnings.length,
    blockers,
    warnings,
    summaryText: status === READINESS_STATUSES.READY 
      ? 'All physical dependencies confirmed. Campaign cleared for live execution.' 
      : `${blockers.length} critical blocker(s) require operational resolution.`,
    checkedAt: new Date().toISOString()
  };
}
