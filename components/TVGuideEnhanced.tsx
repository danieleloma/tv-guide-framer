/**
 * TV Guide Enhanced Framer Component
 * 
 * Advanced version with Google Fonts integration and comprehensive styling controls
 * Features: Google Fonts, full theming, smart toggles, CSS variables
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

interface ThemeProps {
  // Layout
  radius: number;
  rowGap: number;
  colGap: number;

  // Typography
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: number;

  // Text Colors
  textColor: string;

  // Backgrounds
  pageBg: string;
  gridBg: string;
  dayHeaderBg: string;
  dayHeaderText: string;
  timeHeaderBg: string;
  timeHeaderText: string;

  // Cards (Show blocks)
  cardBg: string;
  cardText: string;
  cardBorder: string;
  cardHoverBg: string;
  cardHoverText: string;
  cardFocusRing: string;

  // Dividers
  dividerColor: string;
}

interface TVGuideEnhancedProps {
  // Data
  dataSource: "static" | "remote";
  saJson: string;
  roaJson: string;
  
  // Toggles
  region: Region;
  timezone: Tz;
  visibleRegions: { SA: boolean; ROA: boolean };
  visibleTimezones: { WAT: boolean; CAT: boolean };
  
  // Layout
  cellWidth: number;
  cellHeight: number;
  
  // Theme
  theme: ThemeProps;
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
  const ticks: TimeLabel[] = [];
  
  if (timezone === 'WAT') {
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
export default function TVGuideEnhanced(props: TVGuideEnhancedProps) {
  const [saData, setSaData] = useState<TvGuideData | null>(null);
  const [roaData, setRoaData] = useState<TvGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Get current data based on selected region
  const currentData = useMemo(() => {
    if (props.region === 'SA') return saData;
    if (props.region === 'ROA') return roaData;
    return null;
  }, [props.region, saData, roaData]);

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
    const regionData = currentData.regions[props.region];
    return Object.entries(regionData.timezones)
      .filter(([_, tzData]) => tzData !== null)
      .map(([tz, _]) => tz as Tz);
  }, [currentData, props.region]);

  // Validate current region/timezone combination
  const isValidCombo = useMemo(() => {
    if (!currentData) return false;
    const regionData = currentData.regions[props.region];
    return regionData.timezones[props.timezone] !== null;
  }, [currentData, props.region, props.timezone]);

  // Get time ticks for current timezone
  const timeTicks = useMemo(() => {
    return generateTimeTicks(props.timezone);
  }, [props.timezone]);

  // Build day grid for current region/timezone
  const dayGrid = useMemo(() => {
    if (!currentData) return [];
    
    const regionData = currentData.regions[props.region];
    const tzData = regionData.timezones[props.timezone];
    
    if (!tzData) {
      return WEEKDAYS.map((day, index) => {
        const baseDate = new Date('2025-10-06'); // Monday
        baseDate.setDate(baseDate.getDate() + index);
        const dateStr = baseDate.toISOString().split('T')[0];
        
        return {
          date: dateStr,
          day: day,
          slots: generateTimeTicks(props.timezone).map(time => ({ time, shows: [] }))
        };
      });
    }
    
    return WEEKDAYS.map(day => tzData.days[day]);
  }, [currentData, props.region, props.timezone]);

  // CSS Variables for theming
  const styleVars: React.CSSProperties = {
    ["--tv-radius" as any]: `${props.theme.radius}px`,
    ["--tv-row-gap" as any]: `${props.theme.rowGap}px`,
    ["--tv-col-gap" as any]: `${props.theme.colGap}px`,
    ["--tv-font-size" as any]: `${props.theme.fontSize}px`,
    ["--tv-font-weight" as any]: props.theme.fontWeight,
    ["--tv-text" as any]: props.theme.textColor,
    ["--tv-page-bg" as any]: props.theme.pageBg,
    ["--tv-grid-bg" as any]: props.theme.gridBg,
    ["--tv-day-bg" as any]: props.theme.dayHeaderBg,
    ["--tv-day-text" as any]: props.theme.dayHeaderText,
    ["--tv-time-bg" as any]: props.theme.timeHeaderBg,
    ["--tv-time-text" as any]: props.theme.timeHeaderText,
    ["--tv-card-bg" as any]: props.theme.cardBg,
    ["--tv-card-text" as any]: props.theme.cardText,
    ["--tv-card-border" as any]: props.theme.cardBorder,
    ["--tv-card-hover-bg" as any]: props.theme.cardHoverBg,
    ["--tv-card-hover-text" as any]: props.theme.cardHoverText,
    ["--tv-card-focus-ring" as any]: props.theme.cardFocusRing,
    ["--tv-divider" as any]: props.theme.dividerColor,
  };

  // Render loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.theme.pageBg,
        color: props.theme.textColor,
        fontSize: props.theme.fontSize,
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
        backgroundColor: props.theme.pageBg,
        color: '#ff6b6b',
        fontSize: props.theme.fontSize,
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
        backgroundColor: props.theme.pageBg,
        color: props.theme.textColor,
        fontSize: props.theme.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '16px', fontSize: props.theme.fontSize + 4, fontWeight: 600 }}>
          No Data Available
        </div>
        <div style={{ opacity: 0.7 }}>
          {props.region === 'SA' ? 'Please add SA JSON data' : 'Please add ROA JSON data'}
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
        backgroundColor: props.theme.pageBg,
        color: '#ff6b6b',
        fontSize: props.theme.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Invalid region/timezone combination: {props.region}/{props.timezone}
      </div>
    );
  }

  return (
    <>
      {/* Google Fonts CSS */}
      <style>{googleFontsCSS[props.theme.fontFamily]}</style>
      
      <div 
        className="tv-guide-font"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: props.theme.pageBg,
          color: props.theme.textColor,
          fontSize: props.theme.fontSize,
          fontWeight: props.theme.fontWeight,
          overflow: 'hidden',
          ...styleVars
        }}
      >
        {/* Top Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: props.theme.timeHeaderBg,
          borderBottom: `1px solid ${props.theme.dividerColor}`,
          gap: '16px',
          flexShrink: 0
        }}>
          {/* Region Selector */}
          {props.visibleRegions.SA && props.visibleRegions.ROA && availableRegions.length > 1 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {availableRegions.map(region => {
                const isAvailable = region === 'SA' ? !!saData : !!roaData;
                const isSelected = props.region === region;
                
                return (
                  <button
                    key={region}
                    disabled={!isAvailable}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: `${props.theme.radius}px`,
                      backgroundColor: isSelected ? '#6b46c1' : 'transparent',
                      color: isSelected ? '#ffffff' : props.theme.textColor,
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      fontSize: props.theme.fontSize,
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      opacity: isAvailable ? 1 : 0.5,
                      border: isSelected ? 'none' : `1px solid ${props.theme.dividerColor}`
                    }}
                    title={!isAvailable ? `${region} data not available` : `Switch to ${region}`}
                  >
                    {region === 'SA' ? 'South Africa' : 'Rest of Africa'}
                  </button>
                );
              })}
            </div>
          )}

          {/* Timezone Selector */}
          {availableTimezones.length > 1 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {availableTimezones.map(tz => (
                <button
                  key={tz}
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${props.theme.dividerColor}`,
                    borderRadius: `${props.theme.radius}px`,
                    backgroundColor: props.timezone === tz ? '#6b46c1' : 'transparent',
                    color: props.timezone === tz ? '#ffffff' : props.theme.textColor,
                    cursor: 'pointer',
                    fontSize: props.theme.fontSize - 2,
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tz}
                </button>
              ))}
            </div>
          )}

          {/* Current Selection Display */}
          <div style={{
            marginLeft: 'auto',
            fontSize: props.theme.fontSize - 2,
            opacity: 0.7
          }}>
            {props.region} • {props.timezone}
          </div>
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
            backgroundColor: props.theme.dayHeaderBg,
            borderRight: `1px solid ${props.theme.dividerColor}`,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            {/* Timezone Header */}
            <div style={{
              padding: '12px',
              borderBottom: `1px solid ${props.theme.dividerColor}`,
              fontSize: props.theme.fontSize,
              fontWeight: 600,
              textAlign: 'center',
              backgroundColor: props.theme.timeHeaderBg,
              color: props.theme.timeHeaderText
            }}>
              {props.timezone}
            </div>

            {/* Day Labels */}
            {dayGrid.map((day, index) => (
              <div
                key={day.date}
                style={{
                  padding: '12px',
                  borderBottom: `1px solid ${props.theme.dividerColor}`,
                  fontSize: props.theme.fontSize - 2,
                  height: props.cellHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: index % 2 === 0 ? props.theme.dayHeaderBg : props.theme.gridBg,
                  color: props.theme.dayHeaderText
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
            {/* Time Header (Sticky) */}
            <div style={{
              display: 'flex',
              backgroundColor: props.theme.timeHeaderBg,
              borderBottom: `1px solid ${props.theme.dividerColor}`,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              minWidth: 'max-content'
            }}>
              {timeTicks.map((time, index) => (
                <div
                  key={time}
                  style={{
                    width: props.cellWidth,
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontSize: props.theme.fontSize - 2,
                    fontWeight: time.endsWith(':00') ? 600 : 400,
                    borderRight: `1px solid ${props.theme.dividerColor}`,
                    opacity: time.endsWith(':00') ? 1 : 0.7,
                    backgroundColor: index % 2 === 0 ? props.theme.timeHeaderBg : props.theme.gridBg,
                    color: props.theme.timeHeaderText
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
                    borderBottom: `1px solid ${props.theme.dividerColor}`,
                    position: 'relative',
                    backgroundColor: dayIndex % 2 === 0 ? props.theme.gridBg : props.theme.pageBg
                  }}
                >
                  {/* Grid Lines */}
                  {timeTicks.map((time, timeIndex) => (
                    <div
                      key={`grid-${timeIndex}`}
                      style={{
                        position: 'absolute',
                        left: timeIndex * props.cellWidth,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: props.theme.dividerColor,
                        opacity: 0.3
                      }}
                    />
                  ))}

                  {/* Show Blocks */}
                  {day.slots.map((slot, slotIndex) => {
                    const startSlotIndex = findSlotIndex(slot.time, props.timezone);
                    
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
                            backgroundColor: props.theme.cardBg,
                            color: props.theme.cardText,
                            borderRadius: `${props.theme.radius}px`,
                            padding: '8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: `1px solid ${props.theme.cardBorder}`,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            overflow: 'hidden'
                          }}
                          title={`${show.title} • ${formatTimeForDisplay(show.start)}–${formatTimeForDisplay(show.end)}`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.backgroundColor = props.theme.cardHoverBg;
                            e.currentTarget.style.color = props.theme.cardHoverText;
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.backgroundColor = props.theme.cardBg;
                            e.currentTarget.style.color = props.theme.cardText;
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = `2px solid ${props.theme.cardFocusRing}`;
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
                              fontSize: props.theme.fontSize,
                              fontWeight: 600,
                              lineHeight: 1.2,
                              marginBottom: '2px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {show.title}
                          </div>

                          {/* Show Meta */}
                          {(show.meta?.episode || show.meta?.season) && (
                            <div
                              style={{
                                fontSize: props.theme.fontSize - 2,
                                opacity: 0.8,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {show.meta.season} {show.meta.episode}
                            </div>
                          )}

                          {/* Time */}
                          <div
                            style={{
                              fontSize: props.theme.fontSize - 3,
                              opacity: 0.6,
                              marginTop: '2px'
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
addPropertyControls(TVGuideEnhanced, {
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
  visibleRegions: {
    type: ControlType.Object,
    title: 'Visible Regions',
    controls: {
      SA: {
        type: ControlType.Boolean,
        title: 'SA',
        defaultValue: true
      },
      ROA: {
        type: ControlType.Boolean,
        title: 'ROA',
        defaultValue: true
      }
    },
    group: 'Toggles'
  },
  visibleTimezones: {
    type: ControlType.Object,
    title: 'Visible Timezones',
    controls: {
      WAT: {
        type: ControlType.Boolean,
        title: 'WAT',
        defaultValue: true
      },
      CAT: {
        type: ControlType.Boolean,
        title: 'CAT',
        defaultValue: true
      }
    },
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

  // Typography Section (Google Fonts)
  theme: {
    type: ControlType.Object,
    title: 'Theme',
    controls: {
      fontFamily: {
        type: ControlType.Enum,
        title: 'Font Family',
        options: ['Inter', 'Roboto', 'DMSans', 'Poppins', 'Lato', 'SpaceGrotesk', 'OpenSans', 'NunitoSans', 'WorkSans', 'Montserrat'],
        defaultValue: 'Inter'
      },
      fontSize: {
        type: ControlType.Number,
        title: 'Font Size',
        defaultValue: 14,
        min: 10,
        max: 24
      },
      fontWeight: {
        type: ControlType.Number,
        title: 'Font Weight',
        defaultValue: 400,
        min: 300,
        max: 700
      },
      textColor: {
        type: ControlType.Color,
        title: 'Text Color',
        defaultValue: '#ffffff'
      }
    },
    group: 'Typography'
  },

  // Color Palette Section
  theme_pageBg: {
    type: ControlType.Color,
    title: 'Page Background',
    defaultValue: '#000000',
    group: 'Colors'
  },
  theme_gridBg: {
    type: ControlType.Color,
    title: 'Grid Background',
    defaultValue: '#111111',
    group: 'Colors'
  },
  theme_dayHeaderBg: {
    type: ControlType.Color,
    title: 'Day Header Background',
    defaultValue: '#111111',
    group: 'Colors'
  },
  theme_dayHeaderText: {
    type: ControlType.Color,
    title: 'Day Header Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  theme_timeHeaderBg: {
    type: ControlType.Color,
    title: 'Time Header Background',
    defaultValue: '#1a1a1a',
    group: 'Colors'
  },
  theme_timeHeaderText: {
    type: ControlType.Color,
    title: 'Time Header Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  theme_cardBg: {
    type: ControlType.Color,
    title: 'Card Background',
    defaultValue: '#1a1a1a',
    group: 'Colors'
  },
  theme_cardText: {
    type: ControlType.Color,
    title: 'Card Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  theme_cardBorder: {
    type: ControlType.Color,
    title: 'Card Border',
    defaultValue: '#333333',
    group: 'Colors'
  },
  theme_cardHoverBg: {
    type: ControlType.Color,
    title: 'Card Hover Background',
    defaultValue: '#2a2a2a',
    group: 'Colors'
  },
  theme_cardHoverText: {
    type: ControlType.Color,
    title: 'Card Hover Text',
    defaultValue: '#ffffff',
    group: 'Colors'
  },
  theme_cardFocusRing: {
    type: ControlType.Color,
    title: 'Card Focus Ring',
    defaultValue: '#6b46c1',
    group: 'Colors'
  },
  theme_dividerColor: {
    type: ControlType.Color,
    title: 'Divider Color',
    defaultValue: '#333333',
    group: 'Colors'
  },

  // Layout Theme Section
  theme_radius: {
    type: ControlType.Number,
    title: 'Border Radius',
    defaultValue: 4,
    min: 0,
    max: 20,
    group: 'Layout Theme'
  },
  theme_rowGap: {
    type: ControlType.Number,
    title: 'Row Gap',
    defaultValue: 8,
    min: 0,
    max: 20,
    group: 'Layout Theme'
  },
  theme_colGap: {
    type: ControlType.Number,
    title: 'Column Gap',
    defaultValue: 2,
    min: 0,
    max: 10,
    group: 'Layout Theme'
  }
});

