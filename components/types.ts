/**
 * TV Guide Data Models
 * 
 * This file defines the normalized JSON schema for TV guide data.
 * All Excel/CSV data is converted to this format for consumption by the TVGuide component.
 */

export type TimezoneCode = 'WAT' | 'CAT' | 'EST';

export interface GuideJSON {
  metadata: {
    channelId: string;          // e.g., "zee-world" (site/channel id)
    generatedAt: string;        // ISO timestamp
    defaultRegion: string;      // e.g., "ROA"
    defaultTimezone?: TimezoneCode;
  };
  regions: Region[];            // e.g., ["SA","ROA"] or just ["SA"] per site
}

export interface Region {
  code: string;                 // "SA" | "ROA" | etc.
  label: string;                // "South Africa", "Rest of Africa"
  // If defined, only show these timezones for this region; if omitted, fall back to global defaults
  timezones?: TimezoneCode[]; 
  days: Day[];
}

export interface Day {
  // Calendar date for the day column header (local date in the region's "primary" tz)
  dateISO: string;              // e.g., "2025-09-29"
  slots: Slot[];                // list of shows in chronological order
}

export interface Slot {
  startISO: string;             // ISO in UTC (required)
  endISO?: string;              // ISO in UTC (optional; if absent, compute from duration)
  durationMin?: number;         // optional helper if endISO absent
  title: string;                // "Sister Wives"
  season?: string;              // "S1"
  episode?: string;             // "Ep 145"
  // For display variants (optional)
  subtitle?: string;            // free text (e.g., "S10 EP 31")
  // Visual overrides (optional)
  textColor?: string;           // hex or rgb
  bgColor?: string;             
}

/**
 * TVGuide Component Props
 * 
 * All styling and behavior is configurable via props to make the component
 * fully customizable for different channel sites and design requirements.
 */
export interface TVGuideProps {
  // Data
  dataJSON?: string;                 // paste JSON directly
  dataURL?: string;                  // fetch JSON from URL (same-origin)
  channelIdFilter?: string;          // optional filter if file contains multiple channels

  // Layout
  hourWidthPx?: number;              // px width per hour column (default 220)
  minSlotWidthPx?: number;           // minimum card width (default 180)
  rowHeightPx?: number;              // default 64
  columnGapPx?: number;              // gap between time columns
  rowGapPx?: number;                 // gap between rows
  stickyHeaderHeightPx?: number;     // 56
  stickyRegionBarHeightPx?: number;  // 40
  cornerRadiusPx?: number;           // 12

  // Typography
  fontFamily?: string;               // CSS font-family
  titleFontSize?: number;            // 14
  subtitleFontSize?: number;         // 12
  headerFontSize?: number;           // 12

  // Colors
  pageBg?: string;                   // overall background
  gridLineColor?: string;
  timeHeaderBg?: string;
  timeHeaderText?: string;
  dayHeaderBg?: string;
  dayHeaderText?: string;
  regionTabBg?: string;
  regionTabText?: string;
  activeRegionBg?: string;
  activeRegionText?: string;
  cardBg?: string;                   // default card background
  cardText?: string;                 // default card text
  focusOutline?: string;             // keyboard focus outline

  // Behavior
  enableRegionSwitch?: boolean;      // default true if >1 region
  enableTimezoneSwitch?: boolean;    // true for ROA; false for SA
  allowedTimezones?: TimezoneCode[]; // fallback if region config missing
  initialTimezone?: TimezoneCode;
  initialRegion?: string;            // SA or ROA
  startHour?: number;                // 5
  endHour?: number;                  // 24
  
  // Accessibility
  highContrast?: boolean;
}

/**
 * Internal component state
 */
export interface TVGuideState {
  region: string;
  timezone: TimezoneCode;
  scrollLeft: number;
  focusedCardId: string | null;
  data: GuideJSON | null;
  loading: boolean;
  error: string | null;
}

/**
 * Time slot with computed display properties
 */
export interface DisplaySlot extends Slot {
  // Computed display properties
  displayStart: string;          // formatted time in selected timezone
  displayEnd: string;
  xPosition: number;             // pixel position from left
  width: number;                 // pixel width
  dayIndex: number;              // which day row this belongs to
  isCrossMidnight: boolean;      // spans across midnight
  splitSlots?: DisplaySlot[];    // if cross-midnight, contains split parts
}

/**
 * Time tick for the horizontal axis
 */
export interface TimeTick {
  hour: number;
  minute: number;
  label: string;                 // "5:00", "5:30", etc.
  xPosition: number;             // pixel position
  isMajor: boolean;              // full hour vs half hour
}

/**
 * Excel/CSV input row structure
 * Used by the conversion script to parse spreadsheet data
 */
export interface ExcelRow {
  region?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  durationMin?: number;
  localTZ?: string;
  title?: string;
  season?: string;
  episode?: string;
  subtitle?: string;
  textColor?: string;
  bgColor?: string;
}
