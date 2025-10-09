/**
 * TV Guide Utility Functions
 * 
 * Pure functions for:
 * - Normalizing rows to 30-minute slots
 * - Bucketing shows by slot without time conversion
 * - Building 7-day x 30-min grid for given region + timezone
 */

import { 
  TvGuideData, 
  Region, 
  Tz, 
  Weekday, 
  TimeLabel, 
  ShowItem, 
  DaySchedule,
  ExcelRow 
} from './tvGuideTypes';

// 7-day order for consistent rendering
export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Constants for time math
const DAY = 24 * 60; // minutes in a day

/**
 * Convert time label "HH:MM" to minutes
 */
function tToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h * 60 + m) % DAY;
}

/**
 * Build ticks from [start, end) where end may be same time next day.
 * Returns 49 labels for 24-hour window (48 intervals)
 */
export function buildTicks(startLabel: string, endLabel: string, step = 30): string[] {
  const s = tToMin(startLabel);
  let e = tToMin(endLabel);
  if (e <= s) e += DAY; // next-day boundary
  
  const ticks: string[] = [];
  for (let m = s; m <= e; m += step) { // include terminal tick label
    const mm = m % DAY;
    const hh = Math.floor(mm / 60).toString().padStart(2, "0");
    const mi = (mm % 60).toString().padStart(2, "0");
    ticks.push(`${hh}:${mi}`);
  }
  // ticks are labels; visible intervals are pairs [ticks[i], ticks[i+1])
  // This yields 49 labels -> 48 intervals for 24h/30m.
  return ticks;
}

/**
 * Compute overlap (in minutes offset from window start) for a show interval.
 */
export function clampToWindow(
  showStart: string,
  showEnd: string,
  windowStart: string,
  windowEnd: string
) {
  const ws = tToMin(windowStart);
  let we = tToMin(windowEnd);
  if (we <= ws) we += DAY; // next day
  
  // show may cross midnight:
  let ss = tToMin(showStart);
  let se = tToMin(showEnd);
  if (se <= ss) se += DAY;

  // Normalize to window space [0, windowLen)
  const windowLen = we - ws; // 1440 for 24h
  const startOff = ((ss - ws + DAY) % DAY);
  const endOffRaw = ((se - ws + DAY) % DAY) + (se - ss >= DAY ? DAY : 0);
  const endOff = Math.min(endOffRaw, windowLen);

  const clipStart = Math.max(0, startOff);
  const clipEnd = Math.max(clipStart, Math.min(endOff, windowLen));

  return { clipStart, clipEnd, windowLen };
}

/**
 * Slot indexes from clamped minutes.
 */
export function toSlotSpan(clipStart: number, clipEnd: number, slotMinutes = 30) {
  const startIdx = Math.floor(clipStart / slotMinutes);
  const endIdx = Math.ceil(clipEnd / slotMinutes);
  const span = Math.max(0, endIdx - startIdx);
  return { startIdx, span };
}

/**
 * Normalize a time string to the nearest 30-minute slot
 */
export function normalizeToSlot(time: string | Date): TimeLabel {
  let timeStr: string;
  
  if (time instanceof Date) {
    timeStr = time.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    timeStr = time.toString().trim();
  }

  // Parse time and round to nearest 30-minute slot
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const roundedMinutes = Math.round(totalMinutes / 30) * 30;
  
  const roundedHours = Math.floor(roundedMinutes / 60) % 24;
  const roundedMins = roundedMinutes % 60;
  
  return `${roundedHours.toString().padStart(2, '0')}:${roundedMins.toString().padStart(2, '0')}` as TimeLabel;
}

/**
 * Generate time ticks for a given timezone window
 */
export function generateTimeTicks(timezone: Tz): TimeLabel[] {
  const ticks: TimeLabel[] = [];
  
  if (timezone === 'WAT') {
    // WAT: 05:00 → 04:00 (next day) = 23 hours = 46 slots
    for (let hour = 5; hour <= 23; hour++) {
      ticks.push(`${hour.toString().padStart(2, '0')}:00` as TimeLabel);
      ticks.push(`${hour.toString().padStart(2, '0')}:30` as TimeLabel);
    }
    for (let hour = 0; hour <= 4; hour++) {
      ticks.push(`${hour.toString().padStart(2, '0')}:00` as TimeLabel);
      if (hour < 4) {
        ticks.push(`${hour.toString().padStart(2, '0')}:30` as TimeLabel);
      }
    }
  } else if (timezone === 'CAT') {
    // CAT: 06:00 → 05:00 (next day) = 23 hours = 46 slots  
    for (let hour = 6; hour <= 23; hour++) {
      ticks.push(`${hour.toString().padStart(2, '0')}:00` as TimeLabel);
      ticks.push(`${hour.toString().padStart(2, '0')}:30` as TimeLabel);
    }
    for (let hour = 0; hour <= 5; hour++) {
      ticks.push(`${hour.toString().padStart(2, '0')}:00` as TimeLabel);
      if (hour < 5) {
        ticks.push(`${hour.toString().padStart(2, '0')}:30` as TimeLabel);
      }
    }
  }
  
  return ticks;
}

/**
 * Convert time string to minutes for calculations
 */
export function timeToMinutes(time: TimeLabel): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes back to time string
 */
export function minutesToTime(minutes: number): TimeLabel {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}` as TimeLabel;
}

/**
 * Calculate the number of 30-minute slots a show spans
 */
export function calculateSlotSpan(start: TimeLabel, end: TimeLabel): number {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  // Handle next-day shows
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours
  }
  
  return Math.ceil(durationMinutes / 30);
}

/**
 * Find the slot index for a given time
 */
export function findSlotIndex(time: TimeLabel, timezone: Tz): number {
  const ticks = generateTimeTicks(timezone);
  return ticks.findIndex(tick => tick === time);
}

/**
 * Get the start slot index for a show
 */
export function getShowStartSlot(show: ShowItem, timezone: Tz): number {
  return findSlotIndex(show.start, timezone);
}

/**
 * Get the span (number of slots) for a show
 */
export function getShowSlotSpan(show: ShowItem): number {
  return calculateSlotSpan(show.start, show.end);
}

/**
 * Check if a time is within the valid window for a timezone
 */
export function isValidTimeWindow(start: TimeLabel, end: TimeLabel, timezone: Tz): boolean {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  if (timezone === 'WAT') {
    // WAT: 05:00 (300) to 04:00 (240) next day
    return startMinutes >= 300 || endMinutes <= 240;
  } else {
    // CAT: 06:00 (360) to 05:00 (300) next day  
    return startMinutes >= 360 || endMinutes <= 300;
  }
}

/**
 * Create an empty day schedule for a given date and timezone
 */
export function createEmptyDaySchedule(date: string, timezone: Tz): DaySchedule {
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }) as Weekday;
  const ticks = generateTimeTicks(timezone);
  
  return {
    date,
    day: weekday,
    slots: ticks.map(time => ({ time, shows: [] }))
  };
}

/**
 * Build a 7-day grid for a given region and timezone
 */
export function buildDayGrid(
  data: TvGuideData, 
  region: Region, 
  timezone: Tz
): DaySchedule[] {
  const regionData = data.regions[region];
  const tzData = regionData.timezones[timezone];
  
  if (!tzData) {
    // Return empty grid if timezone not available for this region
    return WEEKDAYS.map((day, index) => {
      const baseDate = new Date('2025-10-06'); // Monday
      baseDate.setDate(baseDate.getDate() + index);
      const dateStr = baseDate.toISOString().split('T')[0];
      return createEmptyDaySchedule(dateStr, timezone);
    });
  }
  
  // Return days in Monday-Sunday order
  return WEEKDAYS.map(day => tzData.days[day]);
}

/**
 * Get all shows for a specific day and timezone
 */
export function getShowsForDay(
  data: TvGuideData,
  region: Region,
  timezone: Tz,
  day: Weekday
): ShowItem[] {
  const regionData = data.regions[region];
  const tzData = regionData.timezones[timezone];
  
  if (!tzData) {
    return [];
  }
  
  const daySchedule = tzData.days[day];
  return daySchedule.slots.flatMap(slot => slot.shows);
}

/**
 * Get the total number of shows across all days for a region/timezone
 */
export function getTotalShowsCount(
  data: TvGuideData,
  region: Region,
  timezone: Tz
): number {
  const regionData = data.regions[region];
  const tzData = regionData.timezones[timezone];
  
  if (!tzData) {
    return 0;
  }
  
  return Object.values(tzData.days).reduce((total, day) => {
    return total + day.slots.reduce((dayTotal, slot) => {
      return dayTotal + slot.shows.length;
    }, 0);
  }, 0);
}

/**
 * Get available timezones for a region
 */
export function getAvailableTimezones(data: TvGuideData, region: Region): Tz[] {
  const regionData = data.regions[region];
  return Object.entries(regionData.timezones)
    .filter(([_, tzData]) => tzData !== null)
    .map(([tz, _]) => tz as Tz);
}

/**
 * Check if a region/timezone combination is valid
 */
export function isValidRegionTimezone(
  data: TvGuideData,
  region: Region,
  timezone: Tz
): boolean {
  const regionData = data.regions[region];
  return regionData.timezones[timezone] !== null;
}

/**
 * Format time for display (adds AM/PM)
 */
export function formatTimeForDisplay(time: TimeLabel): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Create a tooltip text for a show
 */
export function createShowTooltip(show: ShowItem): string {
  const startTime = formatTimeForDisplay(show.start);
  const endTime = formatTimeForDisplay(show.end);
  
  let tooltip = `${show.title} • ${startTime}–${endTime}`;
  
  if (show.meta?.episode) {
    tooltip += ` • ${show.meta.episode}`;
  }
  
  if (show.meta?.season) {
    tooltip += ` • ${show.meta.season}`;
  }
  
  return tooltip;
}

/**
 * Calculate grid dimensions for a timezone
 */
export function calculateGridDimensions(timezone: Tz) {
  const ticks = generateTimeTicks(timezone);
  return {
    totalSlots: ticks.length,
    hours: timezone === 'WAT' ? 23 : 23, // Both are 23-hour windows
    minutes: 0 // Both start and end at :00
  };
}

/**
 * Memoized function to get time ticks for a timezone
 */
const timeTicksCache = new Map<Tz, TimeLabel[]>();

export function getTimeTicks(timezone: Tz): TimeLabel[] {
  if (!timeTicksCache.has(timezone)) {
    timeTicksCache.set(timezone, generateTimeTicks(timezone));
  }
  return timeTicksCache.get(timezone)!;
}

/**
 * Clear the time ticks cache (useful for testing)
 */
export function clearTimeTicksCache(): void {
  timeTicksCache.clear();
}

