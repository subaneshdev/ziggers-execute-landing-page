/**
 * Ziggers Unified Campaign Scheduling Engine
 * File: src/lib/intelligence/schedule/scheduleEngine.js
 * 
 * Authoritative, timezone-aware scheduling calculations, validation,
 * and day composition (weekday vs. weekend) for physical BTL activations.
 * 
 * Non-negotiable Guarantees:
 * 1. Inclusive calendar day calculation: start date through end date inclusive.
 * 2. Timezone safety: operates with explicit IANA timezone (default Asia/Kolkata).
 * 3. Exact decimal shift duration and total campaign hours.
 * 4. Zero native Node dependencies: safe for both Node.js server and React browser runtimes.
 */

export const SCHEDULE_CONFIG_LIMITS = {
  minCampaignDays: 1,
  maxCampaignDays: 60,
  minShiftHours: 2,
  maxShiftHours: 12,
  defaultTimezone: 'Asia/Kolkata',
  defaultDailyStartTime: '16:00',
  defaultDailyEndTime: '21:00'
};

/**
 * Normalizes time string (e.g. "16:00", "4:00 PM", "04:00 PM") to 24h "HH:mm"
 */
export function normalizeTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const trimmed = timeStr.trim();
  
  // Check 24-hour format HH:mm or HH:mm:ss or H:mm
  const match24 = trimmed.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?$/);
  if (match24) {
    const hours = match24[1].padStart(2, '0');
    const minutes = match24[2];
    return `${hours}:${minutes}`;
  }

  // Check 12-hour format "h:mm AM/PM" or "hh:mmAM/PM" or "h:mm:ss AM/PM"
  const match12 = trimmed.match(/^(\d{1,2}):([0-5][0-9])(?::([0-5][0-9]))?\s*(AM|PM|am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const meridiem = match12[3].toUpperCase();
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return null;
}

/**
 * Formats 24h "HH:mm" string into 12h display e.g. "4:00 PM"
 */
export function formatTimeDisplay(timeStr) {
  const norm = normalizeTimeString(timeStr);
  if (!norm) return timeStr || 'N/A';
  const [hStr, mStr] = norm.split(':');
  const h = parseInt(hStr, 10);
  const meridiem = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${meridiem}`;
}

/**
 * Formats ISO "YYYY-MM-DD" string into readable display e.g. "15 Oct 2026"
 */
export function formatDateDisplay(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(Date.UTC(year, month, day));
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Returns current date in target IANA timezone as "YYYY-MM-DD"
 */
export function getTodayDateString(timezone = SCHEDULE_CONFIG_LIMITS.defaultTimezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch (_) {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Validates ISO date string YYYY-MM-DD with strict calendar days (e.g. rejects Feb 31)
 */
function isValidIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && (date.getUTCMonth() + 1) === m && date.getUTCDate() === d;
}

/**
 * Validates timezone identifier
 */
function isValidTimezone(tz) {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Authoritative Server & Client Schedule Validation
 * @param {Object} schedule
 * @param {Object} options - { allowPastDates: boolean, maxCampaignDays: number }
 * @returns {{ isValid: boolean, errors: string[], normalized: Object|null }}
 */
export function validateCampaignSchedule(schedule = {}, options = {}) {
  const errors = [];
  const {
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime,
    timezone = SCHEDULE_CONFIG_LIMITS.defaultTimezone
  } = schedule;

  const {
    allowPastDates = false,
    maxCampaignDays = SCHEDULE_CONFIG_LIMITS.maxCampaignDays,
    minShiftHours = SCHEDULE_CONFIG_LIMITS.minShiftHours,
    maxShiftHours = SCHEDULE_CONFIG_LIMITS.maxShiftHours
  } = options;

  // 1. Start Date Check
  if (!startDate || String(startDate).trim() === '') {
    errors.push('Campaign start date is required.');
  } else if (!isValidIsoDate(startDate)) {
    errors.push('Campaign start date must be a valid calendar date in YYYY-MM-DD format.');
  }

  // 2. End Date Check
  if (!endDate || String(endDate).trim() === '') {
    errors.push('Campaign end date is required.');
  } else if (!isValidIsoDate(endDate)) {
    errors.push('Campaign end date must be a valid calendar date in YYYY-MM-DD format.');
  }

  // 3. Timezone Check
  const effectiveTz = timezone || SCHEDULE_CONFIG_LIMITS.defaultTimezone;
  if (!isValidTimezone(effectiveTz)) {
    errors.push(`Invalid or unsupported time zone: ${timezone}`);
  }

  // 4. Chronological & Past Date Checks (if dates are valid)
  if (isValidIsoDate(startDate) && isValidIsoDate(endDate)) {
    if (endDate < startDate) {
      errors.push('End date cannot be before start date.');
    }

    if (!allowPastDates) {
      const today = getTodayDateString(effectiveTz);
      if (startDate < today) {
        errors.push('Campaign date cannot be in the past.');
      }
    }
  }

  // 5. Daily Start Time Check
  const normStartTime = normalizeTimeString(dailyStartTime);
  if (!dailyStartTime || String(dailyStartTime).trim() === '') {
    errors.push('Daily start time is required.');
  } else if (!normStartTime) {
    errors.push('Invalid daily start time format.');
  }

  // 6. Daily End Time Check
  const normEndTime = normalizeTimeString(dailyEndTime);
  if (!dailyEndTime || String(dailyEndTime).trim() === '') {
    errors.push('Daily end time is required.');
  } else if (!normEndTime) {
    errors.push('Invalid daily end time format.');
  }

  // 7. Time Logic & Shift Duration Checks
  let hoursPerDay = null;
  if (normStartTime && normEndTime) {
    const [sH, sM] = normStartTime.split(':').map(Number);
    const [eH, eM] = normEndTime.split(':').map(Number);
    const startMinutes = sH * 60 + sM;
    const endMinutes = eH * 60 + eM;

    if (endMinutes === startMinutes) {
      errors.push('Daily end time must be after daily start time.');
    } else if (endMinutes < startMinutes) {
      errors.push('Daily end time must be after daily start time. Overnight campaigns are not supported.');
    } else {
      hoursPerDay = parseFloat(((endMinutes - startMinutes) / 60).toFixed(2));
      if (hoursPerDay < minShiftHours) {
        errors.push(`Daily shift must be at least ${minShiftHours} hours.`);
      }
      if (hoursPerDay > maxShiftHours) {
        errors.push(`Daily shift cannot exceed ${maxShiftHours} hours.`);
      }
    }
  }

  // 8. Duration Check
  let campaignDays = null;
  if (isValidIsoDate(startDate) && isValidIsoDate(endDate) && endDate >= startDate) {
    const [y1, m1, d1] = startDate.split('-').map(Number);
    const [y2, m2, d2] = endDate.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    // Inclusive calendar day count
    campaignDays = Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1;

    if (campaignDays > maxCampaignDays) {
      errors.push(`Campaign duration exceeds the allowed maximum of ${maxCampaignDays} days.`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      normalized: null
    };
  }

  const metrics = calculateScheduleMetrics({
    startDate,
    endDate,
    dailyStartTime: normStartTime,
    dailyEndTime: normEndTime,
    timezone: effectiveTz
  });

  return {
    isValid: true,
    errors: [],
    normalized: metrics
  };
}

/**
 * Calculates complete schedule metrics including day composition (weekday vs weekend)
 * @param {Object} schedule - validated schedule with startDate, endDate, dailyStartTime, dailyEndTime, timezone
 * @returns {Object}
 */
export function calculateScheduleMetrics(schedule = {}) {
  const {
    startDate,
    endDate,
    dailyStartTime = SCHEDULE_CONFIG_LIMITS.defaultDailyStartTime,
    dailyEndTime = SCHEDULE_CONFIG_LIMITS.defaultDailyEndTime,
    timezone = SCHEDULE_CONFIG_LIMITS.defaultTimezone
  } = schedule;

  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    return {
      startDate: startDate || null,
      endDate: endDate || null,
      dailyStartTime,
      dailyEndTime,
      timezone,
      campaignDays: 0,
      hoursPerDay: 0,
      totalCampaignHours: 0,
      weekdayCount: 0,
      weekendCount: 0,
      scheduleStatus: 'INVALID'
    };
  }

  const normStartTime = normalizeTimeString(dailyStartTime) || SCHEDULE_CONFIG_LIMITS.defaultDailyStartTime;
  const normEndTime = normalizeTimeString(dailyEndTime) || SCHEDULE_CONFIG_LIMITS.defaultDailyEndTime;

  const [sH, sM] = normStartTime.split(':').map(Number);
  const [eH, eM] = normEndTime.split(':').map(Number);
  const startMinutes = sH * 60 + sM;
  const endMinutes = eH * 60 + eM;
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const hoursPerDay = parseFloat((durationMinutes / 60).toFixed(2));

  const [y1, m1, d1] = startDate.split('-').map(Number);
  const [y2, m2, d2] = endDate.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  
  // Inclusive calendar days: start through end
  const campaignDays = Math.max(1, Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1);
  const totalCampaignHours = parseFloat((campaignDays * hoursPerDay).toFixed(2));

  // Count weekdays (Mon-Fri) and weekends (Sat-Sun)
  let weekdayCount = 0;
  let weekendCount = 0;
  const curr = new Date(utc1);

  for (let i = 0; i < campaignDays; i++) {
    const dayOfWeek = curr.getUTCDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendCount++;
    } else {
      weekdayCount++;
    }
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  const startFormatted = formatDateDisplay(startDate);
  const endFormatted = formatDateDisplay(endDate);
  const scheduleDisplay = startDate === endDate 
    ? startFormatted 
    : `${startFormatted} – ${endFormatted}`;

  const dailyTimingDisplay = `${formatTimeDisplay(normStartTime)} – ${formatTimeDisplay(normEndTime)}`;

  return {
    startDate,
    endDate,
    dailyStartTime: normStartTime,
    dailyEndTime: normEndTime,
    timezone,
    campaignDays,
    hoursPerDay,
    totalCampaignHours,
    startHour: sH,
    startMinute: sM,
    endHour: eH,
    endMinute: eM,
    weekdayCount,
    weekendCount,
    weekdayRatio: campaignDays > 0 ? parseFloat((weekdayCount / campaignDays).toFixed(2)) : 0,
    weekendRatio: campaignDays > 0 ? parseFloat((weekendCount / campaignDays).toFixed(2)) : 0,
    dominantDayType: weekendCount > weekdayCount ? 'WEEKEND' : 'WEEKDAY',
    isWeekendOnly: weekdayCount === 0 && weekendCount > 0,
    isWeekdayOnly: weekendCount === 0 && weekdayCount > 0,
    scheduleDisplay,
    dailyTimingDisplay,
    scheduleStatus: 'CONFIRMED'
  };
}

/**
 * Creates default initial schedule (e.g. upcoming weekend or next 3 days)
 */
export function getDefaultSchedule(daysAhead = 7, durationDays = 3) {
  const tz = SCHEDULE_CONFIG_LIMITS.defaultTimezone;
  const todayStr = getTodayDateString(tz);
  const [y, m, d] = todayStr.split('-').map(Number);
  
  const start = new Date(Date.UTC(y, m - 1, d + daysAhead));
  const end = new Date(Date.UTC(y, m - 1, d + daysAhead + (durationDays - 1)));

  const startIso = start.toISOString().slice(0, 10);
  const endIso = end.toISOString().slice(0, 10);

  return calculateScheduleMetrics({
    startDate: startIso,
    endDate: endIso,
    dailyStartTime: SCHEDULE_CONFIG_LIMITS.defaultDailyStartTime,
    dailyEndTime: SCHEDULE_CONFIG_LIMITS.defaultDailyEndTime,
    timezone: tz
  });
}
