/**
 * TV Guide Final Framer Component
 * 
 * Production-ready version with Google Fonts and comprehensive theming
 * Simplified theme structure for better Framer compatibility
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { addPropertyControls, ControlType } from 'framer';

// Types
type Region = "SA" | "ROA";
type Tz = "WAT" | "CAT";
type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TimeLabel = `${string}:${"00"|"30"}`;
type FontFamily = "Inter" | "Roboto" | "DMSans" | "Poppins" | "Lato" | "SpaceGrotesk" | "OpenSans" | "NunitoSans" | "WorkSans" | "Montserrat";

interface ShowItem {
  title: string;
  start: TimeLabel;
  end: TimeLabel;
  season?: string;   // only present if both season & episode exist
  episode?: string;  // only present if both season & episode exist
  meta?: Record<string, any>;
}

interface SlotBucket {
  time: TimeLabel;
  shows: ShowItem[];
}

interface DaySchedule {
  date: string;
  day: Weekday;
  slots: SlotBucket[];
}

interface TzSchedule {
  timezone: Tz;
  days: Record<Weekday, DaySchedule>;
}

interface RegionSchedule {
  region: Region;
  timezones: Record<Tz, TzSchedule | null>;
}

interface TvGuideData {
  window: {
    WAT: { start: "05:00"; end: "04:00" };
    CAT: { start: "06:00"; end: "05:00" };
    slotMinutes: 30;
  };
  regions: Record<Region, RegionSchedule>;
}

interface TVGuideFinalProps {
  // Data
  dataSource: "static" | "remote";
  saJson: string;
  roaJson: string;
  
  // Toggles (Initial defaults)
  region: Region;
  timezone: Tz;
  
  // Layout
  cellWidth: number;
  cellHeight: number;
  
  // Google Fonts
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: number;
  
  // Colors
  textColor: string;
  pageBg: string;
  gridBg: string;
  dayHeaderBg: string;
  dayHeaderText: string;
  timeHeaderBg: string;
  timeHeaderText: string;
  cardBg: string;
  cardText: string;
  cardBorder: string;
  cardHoverBg: string;
  cardHoverText: string;
  cardFocusRing: string;
  dividerColor: string;
  
  // Layout Theme
  radius: number;
  rowGap: number;
  colGap: number;
  
  // User Controls
  showUserControls?: boolean;
  onChangeRegion?: (region: Region) => void;
  onChangeTimezone?: (timezone: Tz) => void;
}

// Google Fonts CSS imports (inline styles)
const googleFontsCSS = {
  Inter: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  `,
  Roboto: `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Roboto', system-ui, -apple-system, sans-serif; }
  `,
  DMSans: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; }
  `,
  Poppins: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Poppins', system-ui, -apple-system, sans-serif; }
  `,
  Lato: `
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
    .tv-guide-font { font-family: 'Lato', system-ui, -apple-system, sans-serif; }
  `,
  SpaceGrotesk: `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif; }
  `,
  OpenSans: `
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Open Sans', system-ui, -apple-system, sans-serif; }
  `,
  NunitoSans: `
    @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif; }
  `,
  WorkSans: `
    @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Work Sans', system-ui, -apple-system, sans-serif; }
  `,
  Montserrat: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    .tv-guide-font { font-family: 'Montserrat', system-ui, -apple-system, sans-serif; }
  `
};

// Constants
const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Utility Functions
function generateTimeTicks(timezone: Tz): TimeLabel[] {
  // Build ticks from [start, end) where end is same time next day (24h)
  // WAT: 05:00 → 05:00 (next day) = 24 hours = 48 intervals (49 labels)
  // CAT: 06:00 → 06:00 (next day) = 24 hours = 48 intervals (49 labels)
  
  const DAY = 24 * 60; // minutes in a day
  const step = 30;
  
  const startLabel = timezone === 'WAT' ? '05:00' : '06:00';
  const endLabel = startLabel; // same time next day
  
  const tToMin = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return (h * 60 + m) % DAY;
  };
  
  const s = tToMin(startLabel);
  let e = tToMin(endLabel);
  if (e <= s) e += DAY; // next-day boundary
  
  const ticks: TimeLabel[] = [];
  for (let m = s; m <= e; m += step) { // include terminal tick label
    const mm = m % DAY;
    const hh = Math.floor(mm / 60).toString().padStart(2, "0");
    const mi = (mm % 60).toString().padStart(2, "0");
    ticks.push(`${hh}:${mi}` as TimeLabel);
  }
  
  return ticks;
}

function timeToMinutes(time: TimeLabel): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateSlotSpan(start: TimeLabel, end: TimeLabel): number {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  
  return Math.ceil(durationMinutes / 30);
}

function findSlotIndex(time: TimeLabel, timezone: Tz): number {
  const ticks = generateTimeTicks(timezone);
  return ticks.findIndex(tick => tick === time);
}

function formatTimeForDisplay(time: TimeLabel): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDateForDisplay(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function parseJsonData(jsonString: string): TvGuideData | null {
  if (!jsonString || jsonString.trim() === '{}' || !jsonString.trim()) {
    return null;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON data:', error);
    return null;
  }
}

// Main Component
export default function TVGuideFinal(props: TVGuideFinalProps) {
  const [saData, setSaData] = useState<TvGuideData | null>(null);
  const [roaData, setRoaData] = useState<TvGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for runtime user controls (derived from designer props)
  const [activeRegion, setActiveRegion] = useState<Region>(props.region);
  const [activeTimezone, setActiveTimezone] = useState<Tz>(props.timezone);

  // Sync local state when props change (for Framer panel updates)
  useEffect(() => {
    setActiveRegion(props.region);
  }, [props.region]);

  useEffect(() => {
    setActiveTimezone(props.timezone);
  }, [props.timezone]);

  // Parse JSON data when it changes
  useEffect(() => {
    setSaData(parseJsonData(props.saJson));
  }, [props.saJson]);

  useEffect(() => {
    setRoaData(parseJsonData(props.roaJson));
  }, [props.roaJson]);

  // Load remote data if needed
  useEffect(() => {
    if (props.dataSource === 'remote') {
      loadRemoteData();
    }
  }, [props.dataSource]);

  // Availability checks
  const saAvailable = Boolean(saData);
  const roaAvailable = Boolean(roaData);

  // Timezone options based on region
  const tzOptionsForSA: Array<"CAT"> = ["CAT"];
  const tzOptionsForROA: Array<"WAT"|"CAT"> = ["WAT", "CAT"];

  // Auto-correct region if SA is selected but not available
  useEffect(() => {
    if (activeRegion === "SA" && !saAvailable && roaAvailable) {
      setActiveRegion("ROA");
      props.onChangeRegion?.("ROA");
    }
  }, [activeRegion, saAvailable, roaAvailable, props.onChangeRegion]);

  // Force CAT when SA is active
  useEffect(() => {
    if (activeRegion === "SA" && activeTimezone !== "CAT") {
      setActiveTimezone("CAT");
      props.onChangeTimezone?.("CAT");
    }
  }, [activeRegion, activeTimezone, props.onChangeTimezone]);

  const loadRemoteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [saResponse, roaResponse] = await Promise.all([
        fetch('/sa-guide.json'),
        fetch('/roa-guide.json')
      ]);
      
      if (saResponse.ok) {
        const saJsonData = await saResponse.json();
        setSaData(saJsonData);
      }
      
      if (roaResponse.ok) {
        const roaJsonData = await roaResponse.json();
        setRoaData(roaJsonData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current data based on active region
  const currentData = useMemo(() => {
    if (activeRegion === 'SA') return saData;
    if (activeRegion === 'ROA') return roaData;
    return null;
  }, [activeRegion, saData, roaData]);

  // Get available regions (only show regions that have data)
  const availableRegions = useMemo(() => {
    const regions: Region[] = [];
    if (saData) regions.push('SA');
    if (roaData) regions.push('ROA');
    return regions;
  }, [saData, roaData]);

  // Get available timezones for current region
  const availableTimezones = useMemo(() => {
    if (!currentData) return [];
    const regionData = currentData.regions[activeRegion];
    return Object.entries(regionData.timezones)
      .filter(([_, tzData]) => tzData !== null)
      .map(([tz, _]) => tz as Tz);
  }, [currentData, activeRegion]);

  // Validate current region/timezone combination
  const isValidCombo = useMemo(() => {
    if (!currentData) return false;
    const regionData = currentData.regions[activeRegion];
    return regionData.timezones[activeTimezone] !== null;
  }, [currentData, activeRegion, activeTimezone]);

  // Get time ticks for current timezone
  const timeTicks = useMemo(() => {
    return generateTimeTicks(activeTimezone);
  }, [activeTimezone]);

  // Get header labels (without terminal label)
  const headerLabels = useMemo(() => {
    return timeTicks.slice(0, -1); // Drop the final label (05:00 WAT / 06:00 CAT)
  }, [timeTicks]);

  // Get interval count for grid columns (unchanged - still 48 intervals)
  const intervalCount = timeTicks.length - 1; // 48 intervals

  // Build day grid for current region/timezone
  const dayGrid = useMemo(() => {
    if (!currentData) return [];
    
    const regionData = currentData.regions[activeRegion];
    const tzData = regionData.timezones[activeTimezone];
    
    if (!tzData) {
      return WEEKDAYS.map((day, index) => {
        const baseDate = new Date('2025-10-06'); // Monday
        baseDate.setDate(baseDate.getDate() + index);
        const dateStr = baseDate.toISOString().split('T')[0];
        
        return {
          date: dateStr,
          day: day,
          slots: generateTimeTicks(activeTimezone).map(time => ({ time, shows: [] }))
        };
      });
    }
    
    return WEEKDAYS.map(day => tzData.days[day]);
  }, [currentData, activeRegion, activeTimezone]);

  // Render loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg,
        color: props.textColor,
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Loading TV Guide...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg,
        color: '#ff6b6b',
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        Error: {error}
      </div>
    );
  }

  // Render no data state
  if (!currentData) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg,
        color: props.textColor,
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '16px', fontSize: props.fontSize + 4, fontWeight: 600 }}>
          No Data Available
        </div>
        <div style={{ opacity: 0.7 }}>
          {activeRegion === 'SA' ? 'Please add SA JSON data' : 'Please add ROA JSON data'}
        </div>
      </div>
    );
  }

  // Render invalid combo state
  if (!isValidCombo) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg,
        color: '#ff6b6b',
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Invalid region/timezone combination: {activeRegion}/{activeTimezone}
      </div>
    );
  }

  return (
    <>
      {/* Google Fonts CSS */}
      <style>{googleFontsCSS[props.fontFamily]}</style>
      
      <div 
        className="tv-guide-font"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: props.pageBg,
          color: props.textColor,
          fontSize: props.fontSize,
          fontWeight: props.fontWeight,
          overflow: 'hidden'
        }}
      >
        {/* Header with segmented buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: props.timeHeaderBg,
          borderBottom: `1px solid ${props.dividerColor}`,
          flexShrink: 0
        }}>
          {/* LEFT: Region segmented buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {saAvailable && (
              <button
                role="tab"
                aria-selected={activeRegion === 'SA'}
                data-active={activeRegion === 'SA'}
                style={{
                  appearance: 'none',
                  border: activeRegion === 'SA' ? 'none' : `1px solid ${props.dividerColor}`,
                  backgroundColor: activeRegion === 'SA' ? props.cardBg : 'transparent',
                  color: activeRegion === 'SA' ? props.cardText : props.textColor,
                  padding: '8px 14px',
                  borderRadius: `${props.radius}px`,
                  fontSize: props.fontSize,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeRegion === 'SA' ? '0 0 0 1px rgba(107, 70, 193, 0.35)' : 'none'
                }}
                onClick={() => {
                  setActiveRegion('SA');
                  setActiveTimezone('CAT'); // Force CAT for SA
                  props.onChangeRegion?.('SA');
                  props.onChangeTimezone?.('CAT');
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `2px solid ${props.cardFocusRing}`;
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                title="South Africa"
              >
                South Africa
              </button>
            )}
            {roaAvailable && (
              <button
                role="tab"
                aria-selected={activeRegion === 'ROA'}
                data-active={activeRegion === 'ROA'}
                style={{
                  appearance: 'none',
                  border: activeRegion === 'ROA' ? 'none' : `1px solid ${props.dividerColor}`,
                  backgroundColor: activeRegion === 'ROA' ? props.cardBg : 'transparent',
                  color: activeRegion === 'ROA' ? props.cardText : props.textColor,
                  padding: '8px 14px',
                  borderRadius: `${props.radius}px`,
                  fontSize: props.fontSize,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeRegion === 'ROA' ? '0 0 0 1px rgba(107, 70, 193, 0.35)' : 'none'
                }}
                onClick={() => {
                  setActiveRegion('ROA');
                  props.onChangeRegion?.('ROA');
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `2px solid ${props.cardFocusRing}`;
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                title="Rest of Africa"
              >
                Rest of Africa
              </button>
            )}
          </div>

          {/* RIGHT: Timezone segmented buttons */}
          {props.showUserControls !== false && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {(activeRegion === 'ROA' ? tzOptionsForROA : tzOptionsForSA).map((tz) => (
                <button
                  key={tz}
                  role="tab"
                  aria-selected={activeTimezone === tz}
                  data-active={activeTimezone === tz}
                  style={{
                    appearance: 'none',
                    border: activeTimezone === tz ? 'none' : `1px solid ${props.dividerColor}`,
                    backgroundColor: activeTimezone === tz ? props.cardBg : 'transparent',
                    color: activeTimezone === tz ? props.cardText : props.textColor,
                    padding: '8px 14px',
                    borderRadius: `${props.radius}px`,
                    fontSize: props.fontSize,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: activeTimezone === tz ? '0 0 0 1px rgba(107, 70, 193, 0.35)' : 'none'
                  }}
                  onClick={() => {
                    setActiveTimezone(tz);
                    props.onChangeTimezone?.(tz);
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${props.cardFocusRing}`;
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                  title={tz}
                >
                  {tz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid Container */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Day Column (Sticky) */}
          <div style={{
            width: '120px',
            backgroundColor: props.dayHeaderBg,
            borderRight: `1px solid ${props.dividerColor}`,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            {/* Timezone Header */}
            <div style={{
              padding: '12px',
              borderBottom: `1px solid ${props.dividerColor}`,
              fontSize: props.fontSize,
              fontWeight: 600,
              textAlign: 'center',
              backgroundColor: props.timeHeaderBg,
              color: props.timeHeaderText
            }}>
              {activeTimezone}
            </div>

            {/* Day Labels */}
            {dayGrid.map((day, index) => (
              <div
                key={day.date}
                style={{
                  padding: '12px',
                  borderBottom: `1px solid ${props.dividerColor}`,
                  fontSize: props.fontSize - 2,
                  height: props.cellHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: index % 2 === 0 ? props.dayHeaderBg : props.gridBg,
                  color: props.dayHeaderText
                }}
              >
                {formatDateForDisplay(day.date)}
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Time Header (Sticky) - Without terminal label */}
            <div style={{
              display: 'flex',
              backgroundColor: props.timeHeaderBg,
              borderBottom: `1px solid ${props.dividerColor}`,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              minWidth: 'max-content'
            }}>
              {headerLabels.map((time, index) => (
                <div
                  key={time}
                  style={{
                    width: props.cellWidth,
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontSize: props.fontSize - 2,
                    fontWeight: time.endsWith(':00') ? 600 : 400,
                    borderRight: `1px solid ${props.dividerColor}`,
                    opacity: time.endsWith(':00') ? 1 : 0.7,
                    backgroundColor: index % 2 === 0 ? props.timeHeaderBg : props.gridBg,
                    color: props.timeHeaderText
                  }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Program Grid */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'max-content'
            }}>
              {dayGrid.map((day, dayIndex) => (
                <div
                  key={day.date}
                  style={{
                    display: 'flex',
                    height: props.cellHeight,
                    borderBottom: `1px solid ${props.dividerColor}`,
                    position: 'relative',
                    backgroundColor: dayIndex % 2 === 0 ? props.gridBg : props.pageBg
                  }}
                >
                  {/* Grid Lines */}
                  {headerLabels.map((time, timeIndex) => (
                    <div
                      key={`grid-${timeIndex}`}
                      style={{
                        position: 'absolute',
                        left: timeIndex * props.cellWidth,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: props.dividerColor,
                        opacity: 0.3
                      }}
                    />
                  ))}

                  {/* Show Blocks - Placement uses full timeTicks (including terminal) for accurate positioning */}
                  {day.slots.map((slot, slotIndex) => {
                    const startSlotIndex = findSlotIndex(slot.time, activeTimezone);
                    
                    return slot.shows.map((show, showIndex) => {
                      const span = calculateSlotSpan(show.start, show.end);
                      const left = startSlotIndex * props.cellWidth + 2;
                      const width = span * props.cellWidth - 4;

                      return (
                        <div
                          key={`${slotIndex}-${showIndex}`}
                          style={{
                            position: 'absolute',
                            left: left,
                            top: 4,
                            height: props.cellHeight - 8,
                            width: Math.max(60, width),
                            backgroundColor: props.cardBg,
                            color: props.cardText,
                            borderRadius: `${props.radius}px`,
                            padding: '8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: `1px solid ${props.cardBorder}`,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            overflow: 'hidden'
                          }}
                          title={`${show.title} • ${formatTimeForDisplay(show.start)}–${formatTimeForDisplay(show.end)}`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.backgroundColor = props.cardHoverBg;
                            e.currentTarget.style.color = props.cardHoverText;
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.backgroundColor = props.cardBg;
                            e.currentTarget.style.color = props.cardText;
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = `2px solid ${props.cardFocusRing}`;
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                          tabIndex={0}
                        >
                          {/* Show Title */}
                          <div
                            style={{
                              fontSize: props.fontSize,
                              fontWeight: 600,
                              lineHeight: 1.25,
                              marginBottom: '6px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {show.title}
                          </div>

                          {/* Episode Line (only when both season and episode exist) */}
                          {show.season && show.episode && (
                            <div
                              style={{
                                fontSize: props.fontSize - 2,
                                opacity: 0.85,
                                lineHeight: 1.2,
                                marginBottom: '6px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              aria-label="Episode detail"
                            >
                              Season {show.season} • Episode {show.episode}
                            </div>
                          )}

                          {/* Time */}
                          <div
                            style={{
                              fontSize: props.fontSize - 3,
                              opacity: 0.75,
                              lineHeight: 1.2
                            }}
                          >
                            {formatTimeForDisplay(show.start)}–{formatTimeForDisplay(show.end)}
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Framer Property Controls with grouped sections
addPropertyControls(TVGuideFinal, {
  // Data Section
  dataSource: {
    type: ControlType.Enum,
    title: 'Data Source',
    options: ['static', 'remote'],
    defaultValue: 'static',
    group: 'Data'
  },
  saJson: {
    type: ControlType.String,
    title: 'SA JSON Data',
    description: 'JSON data for South Africa region',
    defaultValue: '{}',
    multiline: true,
    displayTextArea: true,
    group: 'Data'
  },
  roaJson: {
    type: ControlType.String,
    title: 'ROA JSON Data',
    description: 'JSON data for Rest of Africa region',
    defaultValue: '{}',
    multiline: true,
    displayTextArea: true,
    group: 'Data'
  },

  // Toggles Section
  region: {
    type: ControlType.Enum,
    title: 'Region',
    options: ['SA', 'ROA'],
    defaultValue: 'ROA',
    group: 'Toggles'
  },
  timezone: {
    type: ControlType.Enum,
    title: 'Timezone',
    options: ['WAT', 'CAT'],
    defaultValue: 'WAT',
    group: 'Toggles'
  },

  // Layout Section
  cellWidth: {
    type: ControlType.Number,
    title: 'Cell Width',
    defaultValue: 120,
    min: 60,
    max: 300,
    group: 'Layout'
  },
  cellHeight: {
    type: ControlType.Number,
    title: 'Cell Height',
    defaultValue: 56,
    min: 40,
    max: 120,
    group: 'Layout'
  },
  radius: {
    type: ControlType.Number,
    title: 'Border Radius',
    defaultValue: 4,
    min: 0,
    max: 20,
    group: 'Layout'
  },
  rowGap: {
    type: ControlType.Number,
    title: 'Row Gap',
    defaultValue: 8,
    min: 0,
    max: 20,
    group: 'Layout'
  },
  colGap: {
    type: ControlType.Number,
    title: 'Column Gap',
    defaultValue: 2,
    min: 0,
    max: 10,
    group: 'Layout'
  },

  // Typography Section (Google Fonts)
  fontFamily: {
    type: ControlType.Enum,
    title: 'Font Family',
    options: ['Inter', 'Roboto', 'DMSans', 'Poppins', 'Lato', 'SpaceGrotesk', 'OpenSans', 'NunitoSans', 'WorkSans', 'Montserrat'],
    defaultValue: 'Inter',
    group: 'Typography'
  },
  fontSize: {
    type: ControlType.Number,
    title: 'Font Size',
    defaultValue: 14,
    min: 10,
    max: 24,
    group: 'Typography'
  },
  fontWeight: {
    type: ControlType.Number,
    title: 'Font Weight',
    defaultValue: 400,
    min: 300,
    max: 700,
    group: 'Typography'
  },

  // Color Palette Section
  textColor: {
    type: ControlType.Color,
    title: 'Text Color',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  pageBg: {
    type: ControlType.Color,
    title: 'Page Background',
    defaultValue: '#000000',
    group: 'Colors'
  },
  gridBg: {
    type: ControlType.Color,
    title: 'Grid Background',
    defaultValue: '#111111',
    group: 'Colors'
  },
  dayHeaderBg: {
    type: ControlType.Color,
    title: 'Day Header Background',
    defaultValue: '#111111',
    group: 'Colors'
  },
  dayHeaderText: {
    type: ControlType.Color,
    title: 'Day Header Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  timeHeaderBg: {
    type: ControlType.Color,
    title: 'Time Header Background',
    defaultValue: '#1a1a1a',
    group: 'Colors'
  },
  timeHeaderText: {
    type: ControlType.Color,
    title: 'Time Header Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  cardBg: {
    type: ControlType.Color,
    title: 'Card Background',
    defaultValue: '#1a1a1a',
    group: 'Colors'
  },
  cardText: {
    type: ControlType.Color,
    title: 'Card Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  cardBorder: {
    type: ControlType.Color,
    title: 'Card Border',
    defaultValue: '#333333',
    group: 'Colors'
  },
  cardHoverBg: {
    type: ControlType.Color,
    title: 'Card Hover Background',
    defaultValue: '#2a2a2a',
    group: 'Colors'
  },
  cardHoverText: {
    type: ControlType.Color,
    title: 'Card Hover Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  cardFocusRing: {
    type: ControlType.Color,
    title: 'Card Focus Ring',
    defaultValue: '#6b46c1',
    group: 'Colors'
  },
  dividerColor: {
    type: ControlType.Color,
    title: 'Divider Color',
    defaultValue: '#333333',
    group: 'Colors'
  },

  // User Controls Section
  showUserControls: {
    type: ControlType.Boolean,
    title: 'Show User Controls',
    description: 'Show runtime region/timezone toggle buttons',
    defaultValue: true,
    group: 'User Controls'
  }
});