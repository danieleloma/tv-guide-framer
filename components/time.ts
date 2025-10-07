/**
 * Timezone Utilities
 * 
 * Handles timezone conversion and time scale generation for the TV Guide.
 * Uses Luxon for robust timezone handling across different regions.
 */

import { DateTime } from 'luxon';
import { TimezoneCode, TimeTick } from './types';

/**
 * Maps timezone codes to IANA timezone identifiers
 * Used by Luxon for accurate timezone conversion
 */
export const TIMEZONE_MAP: Record<TimezoneCode, string> = {
  WAT: 'Africa/Lagos',      // West Africa Time
  CAT: 'Africa/Johannesburg', // Central Africa Time  
  EST: 'America/New_York'   // Eastern Standard Time
};

/**
 * Converts a UTC ISO string to a specific timezone
 * @param isoUTC - ISO string in UTC
 * @param tzCode - Target timezone code
 * @returns DateTime object in the target timezone
 */
export function toTZ(isoUTC: string, tzCode: TimezoneCode): DateTime {
  const ianaTz = TIMEZONE_MAP[tzCode];
  return DateTime.fromISO(isoUTC, { zone: 'utc' }).setZone(ianaTz);
}

/**
 * Converts a local time to UTC ISO string
 * @param localTime - Local time string (e.g., "14:30")
 * @param date - Date string (e.g., "2025-09-29")
 * @param tzCode - Source timezone code
 * @returns UTC ISO string
 */
export function localToUTC(localTime: string, date: string, tzCode: TimezoneCode): string {
  const ianaTz = TIMEZONE_MAP[tzCode];
  const localDateTime = DateTime.fromISO(`${date}T${localTime}`, { zone: ianaTz });
  const utcISO = localDateTime.toUTC().toISO();
  if (!utcISO) {
    throw new Error(`Failed to convert ${localTime} on ${date} in ${tzCode} to UTC`);
  }
  return utcISO;
}

/**
 * Formats time for display in the selected timezone
 * @param isoUTC - UTC ISO string
 * @param tzCode - Display timezone
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(isoUTC: string, tzCode: TimezoneCode): string {
  const formatted = toTZ(isoUTC, tzCode).toFormat('HH:mm');
  if (!formatted) {
    throw new Error(`Failed to format time ${isoUTC} in ${tzCode}`);
  }
  return formatted;
}

/**
 * Formats date for display in the selected timezone
 * @param isoUTC - UTC ISO string
 * @param tzCode - Display timezone
 * @returns Formatted date string (e.g., "Mon 29 Sep")
 */
export function formatDate(isoUTC: string, tzCode: TimezoneCode): string {
  const formatted = toTZ(isoUTC, tzCode).toFormat('ccc dd MMM');
  if (!formatted) {
    throw new Error(`Failed to format date ${isoUTC} in ${tzCode}`);
  }
  return formatted;
}

/**
 * Gets the hour and minute from a UTC ISO string in a specific timezone
 * @param isoUTC - UTC ISO string
 * @param tzCode - Target timezone
 * @returns Object with hour and minute
 */
export function getTimeInTZ(isoUTC: string, tzCode: TimezoneCode): { hour: number; minute: number } {
  const dt = toTZ(isoUTC, tzCode);
  return {
    hour: dt.hour,
    minute: dt.minute
  };
}

/**
 * Generates time ticks for the horizontal axis
 * @param startHour - Starting hour (e.g., 5)
 * @param endHour - Ending hour (e.g., 24)
 * @param hourWidthPx - Width in pixels per hour
 * @param tzCode - Timezone for display
 * @returns Array of time ticks with positions
 */
export function generateTimeTicks(
  startHour: number,
  endHour: number,
  hourWidthPx: number,
  tzCode: TimezoneCode
): TimeTick[] {
  const ticks: TimeTick[] = [];
  const ianaTz = TIMEZONE_MAP[tzCode];
  
  // Use today's date as reference for time display
  const today = DateTime.now().setZone(ianaTz);
  const baseDate = today.toISODate();
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Full hour tick
    const fullHourTime = DateTime.fromISO(`${baseDate}T${hour.toString().padStart(2, '0')}:00`, { zone: ianaTz });
    ticks.push({
      hour,
      minute: 0,
      label: fullHourTime.toFormat('HH:mm'),
      xPosition: (hour - startHour) * hourWidthPx,
      isMajor: true
    });
    
    // Half hour tick (if not the last hour)
    if (hour < endHour - 1) {
      const halfHourTime = DateTime.fromISO(`${baseDate}T${hour.toString().padStart(2, '0')}:30`, { zone: ianaTz });
      ticks.push({
        hour,
        minute: 30,
        label: halfHourTime.toFormat('HH:mm'),
        xPosition: (hour - startHour) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  return ticks;
}

/**
 * Calculates the pixel position for a given time
 * @param isoUTC - UTC ISO string
 * @param tzCode - Display timezone
 * @param startHour - Starting hour of the grid
 * @param hourWidthPx - Width in pixels per hour
 * @returns Pixel position from left edge
 */
export function getTimePosition(
  isoUTC: string,
  tzCode: TimezoneCode,
  startHour: number,
  hourWidthPx: number
): number {
  const { hour, minute } = getTimeInTZ(isoUTC, tzCode);
  const totalMinutes = (hour - startHour) * 60 + minute;
  return (totalMinutes / 60) * hourWidthPx;
}

/**
 * Calculates the width in pixels for a time duration
 * @param durationMin - Duration in minutes
 * @param hourWidthPx - Width in pixels per hour
 * @returns Width in pixels
 */
export function getDurationWidth(durationMin: number, hourWidthPx: number): number {
  return (durationMin / 60) * hourWidthPx;
}

/**
 * Parses a time string and normalizes it
 * Handles various formats like "7:0", "07:00", "7:00"
 * @param timeStr - Time string to parse
 * @returns Normalized time string (HH:mm format)
 */
export function normalizeTimeString(timeStr: string): string {
  if (!timeStr) return '';
  
  // Remove any whitespace
  const clean = timeStr.trim();
  
  // Handle formats like "7:0", "7:00", "07:0", "07:00"
  const parts = clean.split(':');
  if (parts.length === 2) {
    const hour = parts[0].padStart(2, '0');
    const minute = parts[1].padStart(2, '0');
    return `${hour}:${minute}`;
  }
  
  // Handle formats like "700", "0700"
  if (clean.length === 3 || clean.length === 4) {
    const padded = clean.padStart(4, '0');
    return `${padded.slice(0, 2)}:${padded.slice(2)}`;
  }
  
  return clean;
}

/**
 * Parses a date string and normalizes it to ISO format
 * Handles formats like "2025-09-29", "29/09/2025", "29-09-2025"
 * @param dateStr - Date string to parse
 * @returns ISO date string (YYYY-MM-DD)
 */
export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return '';
  
  const clean = dateStr.trim();
  
  // Already in ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  
  // Handle DD/MM/YYYY or DD-MM-YYYY
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return clean;
}

/**
 * Checks if a time slot crosses midnight
 * @param startISO - Start time in UTC
 * @param endISO - End time in UTC
 * @returns True if the slot crosses midnight
 */
export function isCrossMidnight(startISO: string, endISO: string): boolean {
  const start = DateTime.fromISO(startISO);
  const end = DateTime.fromISO(endISO);
  
  // If end is before start, it crosses midnight
  return end < start;
}

/**
 * Splits a cross-midnight slot into two parts
 * @param slot - The slot to split
 * @param tzCode - Timezone for calculations
 * @returns Array of two slots (today remainder + next day spill)
 */
export function splitCrossMidnightSlot(slot: any, tzCode: TimezoneCode): any[] {
  const start = DateTime.fromISO(slot.startISO);
  const end = DateTime.fromISO(slot.endISO);
  
  // Find midnight in the timezone
  const ianaTz = TIMEZONE_MAP[tzCode];
  const startInTz = start.setZone(ianaTz);
  const midnight = startInTz.plus({ days: 1 }).startOf('day');
  const midnightUTC = midnight.toUTC();
  
  // Create first part (today remainder)
  const firstPart = {
    ...slot,
    endISO: midnightUTC.toISO()
  };
  
  // Create second part (next day spill)
  const secondPart = {
    ...slot,
    startISO: midnightUTC.toISO(),
    endISO: slot.endISO
  };
  
  return [firstPart, secondPart];
}
