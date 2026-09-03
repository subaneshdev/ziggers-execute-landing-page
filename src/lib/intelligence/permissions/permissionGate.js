/**
 * Ziggers Operational Permission & Regulatory Feasibility Gate
 * 
 * Enforces operational compliance before campaign execution can be authorized.
 * A campaign cannot dispatch workers if permissions are REQUIRED, REQUESTED, or UNKNOWN.
 */

export const PERMISSION_TYPES = {
  MALL_MANAGEMENT: 'MALL_MANAGEMENT',
  PROPERTY_OWNER: 'PROPERTY_OWNER',
  MUNICIPAL: 'MUNICIPAL',
  POLICE: 'POLICE',
  RWA: 'RWA',
  COLLEGE_ADMINISTRATION: 'COLLEGE_ADMINISTRATION',
  EVENT_ORGANIZER: 'EVENT_ORGANIZER',
  OTHER: 'OTHER'
};

export const PERMISSION_STATUSES = {
  NOT_REQUIRED: 'NOT_REQUIRED',
  UNKNOWN: 'UNKNOWN',
  REQUIRED: 'REQUIRED',
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

/**
 * Assesses location type to determine mandatory permissions
 * @param {string} locationType e.g., 'MALL', 'COMMERCIAL_STREET', 'TRANSIT_HUB', 'COLLEGE_CAMPUS', 'TECH_PARK'
 * @returns {Array} List of required permission types and guidance
 */
export function assessPermissionRequirements(locationType = 'COMMERCIAL_STREET') {
  const normType = String(locationType).toUpperCase().replace(/\s+/g, '_');
  
  switch (normType) {
    case 'MALL':
    case 'SHOPPING_MALL':
      return [
        {
          type: PERMISSION_TYPES.MALL_MANAGEMENT,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Mall Operations / Marketing Management approval required for indoor kiosks or entrance sampling.',
          authority: 'Mall Property Management'
        }
      ];
    case 'COLLEGE_CAMPUS':
    case 'UNIVERSITY':
      return [
        {
          type: PERMISSION_TYPES.COLLEGE_ADMINISTRATION,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Dean / Student Affairs permission required for on-campus student activations.',
          authority: 'University Administration'
        }
      ];
    case 'TECH_PARK':
    case 'IT_PARK':
      return [
        {
          type: PERMISSION_TYPES.PROPERTY_OWNER,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Tech Park Facilities & Security approval required for common cafeteria/lobby areas.',
          authority: 'Tech Park Estate Office'
        }
      ];
    case 'COMMERCIAL_STREET':
    case 'TRANSIT_HUB':
    case 'METRO_STATION':
      return [
        {
          type: PERMISSION_TYPES.MUNICIPAL,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Local Municipal Corporation clearance for public pedestrian right-of-way distribution.',
          authority: 'Municipal Corporation'
        },
        {
          type: PERMISSION_TYPES.POLICE,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Local Police Station NOC for public crowd gathering and stationary installations.',
          authority: 'Traffic / Law & Order Police'
        }
      ];
    case 'RESIDENTIAL_RWA':
    case 'APARTMENT_COMPLEX':
      return [
        {
          type: PERMISSION_TYPES.RWA,
          status: PERMISSION_STATUSES.REQUIRED,
          description: 'Resident Welfare Association / Society Committee clearance required for club house or entry gate.',
          authority: 'RWA Management Committee'
        }
      ];
    default:
      return [
        {
          type: PERMISSION_TYPES.OTHER,
          status: PERMISSION_STATUSES.UNKNOWN,
          description: 'Feasibility check required for location permissions.',
          authority: 'Local Authority'
        }
      ];
  }
}

/**
 * Validates whether a campaign is cleared for operational dispatch
 * @param {Array} permissionsList
 * @returns {Object} Feasibility result
 */
export function validateDispatchFeasibility(permissionsList = []) {
  if (!permissionsList || permissionsList.length === 0) {
    return {
      canDispatch: false,
      dispatchStatus: 'BLOCKED_UNKNOWN_PERMISSIONS',
      warning: 'Operational clearance required: No permissions verified for target venue.',
      pendingRequirements: ['Conduct venue permissions assessment']
    };
  }

  const blocking = permissionsList.filter(p => 
    p.status === PERMISSION_STATUSES.REQUIRED || 
    p.status === PERMISSION_STATUSES.REQUESTED || 
    p.status === PERMISSION_STATUSES.UNKNOWN ||
    p.status === PERMISSION_STATUSES.REJECTED ||
    p.status === PERMISSION_STATUSES.EXPIRED
  );

  if (blocking.length > 0) {
    return {
      canDispatch: false,
      dispatchStatus: 'OPERATIONAL_CLEARANCE_REQUIRED',
      warning: `Operational clearance required: ${blocking.length} permission item(s) pending or unapproved.`,
      pendingRequirements: blocking.map(b => `${b.type}: ${b.status}`)
    };
  }

  return {
    canDispatch: true,
    dispatchStatus: 'CLEARED_FOR_DISPATCH',
    warning: null,
    pendingRequirements: []
  };
}
