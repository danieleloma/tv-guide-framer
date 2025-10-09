/**
 * TV Guide TypeScript Types
 * 
 * Strict JSON schema for TV guide data structure
 * Supports SA (CAT only) and ROA (WAT + CAT) regions
 * 7-day schedule with 30-minute time slots
 */

// Core region and timezone types
export type Region = "SA" | "ROA";
export type Tz = "WAT" | "CAT";

// 7-day fixed order (Mon → Sun). No other days permitted.
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Time labels are 30-min ticks within the allowed window (strings, e.g. "05:00", "05:30", ...)
export type TimeLabel = `${string}:${"00"|"30"}`;

// Core show item stored at the leaf level (per day + tz + region)
export interface ShowItem {
  title: string;
  start: TimeLabel; // inclusive
  end: TimeLabel;   // exclusive; same-day or next-day within allowed 24h cycle only
  season?: string;   // only present if both season & episode exist
  episode?: string;  // only present if both season & episode exist
  meta?: Record<string, any>; // e.g., rating, genre
}

// Buckets per 30-min slot
export interface SlotBucket {
  time: TimeLabel;        // e.g., "05:00"
  shows: ShowItem[];      // zero or more items starting at this slot
}

export interface DaySchedule {
  date: string;           // ISO date for that day, e.g., "2025-10-06"
  day: Weekday;           // must match the date's weekday
  slots: SlotBucket[];    // ordered low→high within the window
}

export interface TzSchedule {
  timezone: Tz;
  days: Record<Weekday, DaySchedule>;
}

export interface RegionSchedule {
  region: Region;
  timezones: Record<Tz, TzSchedule | null>; // null if unused (e.g., SA only CAT)
}

export interface TvGuideData {
  window: {
    // FIX: end is the SAME clock time next day (24h length)
    // - WAT: 05:00 → 05:00 (next day) = 24h = 48 intervals
    // - CAT: 06:00 → 06:00 (next day) = 24h = 48 intervals
    WAT: { start: "05:00"; end: "05:00" };
    CAT: { start: "06:00"; end: "06:00" };
    slotMinutes: 30;
  };
  regions: Record<Region, RegionSchedule>;
}

// Component props types
export interface TVGuideProps {
  dataSource: "static" | "remote";
  region: Region;
  timezone: Tz;
  visibleRegions: { SA: boolean; ROA: boolean };
  visibleTimezones: { WAT: boolean; CAT: boolean };
  staticData?: TvGuideData;
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
  rowGap: number;
  colGap: number;
}

// Utility types for Excel parsing
export interface ExcelRow {
  region: string;
  timezone: string;
  day: string;
  date: Date | string;
  start: string | Date;
  end: string | Date;
  title: string;
  [key: string]: any;
}

// Column mapping for Excel headers
export interface ColumnMapping {
  region: string;
  timezone: string;
  day: string;
  date: string;
  start: string;
  end: string;
  title: string;
}
