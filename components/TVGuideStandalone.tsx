/**
 * TV Guide Standalone Framer Component
 * 
 * A self-contained TV guide component with all dependencies included
 * No external imports required - ready to copy directly into Framer
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { addPropertyControls, ControlType } from 'framer';

// Types (included inline)
type Region = "SA" | "ROA";
type Tz = "WAT" | "CAT";
type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TimeLabel = `${string}:${"00"|"30"}`;

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

interface TVGuideProps {
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

// Constants
const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Utility Functions (included inline)
function generateTimeTicks(timezone: Tz): TimeLabel[] {
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

function timeToMinutes(time: TimeLabel): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateSlotSpan(start: TimeLabel, end: TimeLabel): number {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours
  }
  
  return Math.ceil(durationMinutes / 30);
}

function findSlotIndex(time: TimeLabel, timezone: Tz): number {
  const ticks = generateTimeTicks(timezone);
  return ticks.findIndex(tick => tick === time);
}

function getShowStartSlot(show: ShowItem, timezone: Tz): number {
  return findSlotIndex(show.start, timezone);
}

function getShowSlotSpan(show: ShowItem): number {
  return calculateSlotSpan(show.start, show.end);
}

function getAvailableTimezones(data: TvGuideData, region: Region): Tz[] {
  const regionData = data.regions[region];
  return Object.entries(regionData.timezones)
    .filter(([_, tzData]) => tzData !== null)
    .map(([tz, _]) => tz as Tz);
}

function isValidRegionTimezone(data: TvGuideData, region: Region, timezone: Tz): boolean {
  const regionData = data.regions[region];
  return regionData.timezones[timezone] !== null;
}

function buildDayGrid(data: TvGuideData, region: Region, timezone: Tz): DaySchedule[] {
  const regionData = data.regions[region];
  const tzData = regionData.timezones[timezone];
  
  if (!tzData) {
    return WEEKDAYS.map((day, index) => {
      const baseDate = new Date('2025-10-06'); // Monday
      baseDate.setDate(baseDate.getDate() + index);
      const dateStr = baseDate.toISOString().split('T')[0];
      
      return {
        date: dateStr,
        day: day,
        slots: generateTimeTicks(timezone).map(time => ({ time, shows: [] }))
      };
    });
  }
  
  return WEEKDAYS.map(day => tzData.days[day]);
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

function createShowTooltip(show: ShowItem): string {
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

// Main Component
export default function TVGuideStandalone(props: TVGuideProps) {
  const [data, setData] = useState<TvGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data based on dataSource
  useEffect(() => {
    if (props.dataSource === 'static' && props.staticData) {
      setData(props.staticData);
      setError(null);
    } else if (props.dataSource === 'remote') {
      loadRemoteData();
    }
  }, [props.dataSource, props.staticData]);

  const loadRemoteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/tv-guide.json');
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available timezones for current region
  const availableTimezones = useMemo(() => {
    if (!data) return [];
    return getAvailableTimezones(data, props.region);
  }, [data, props.region]);

  // Validate current region/timezone combination
  const isValidCombo = useMemo(() => {
    if (!data) return false;
    return isValidRegionTimezone(data, props.region, props.timezone);
  }, [data, props.region, props.timezone]);

  // Get time ticks for current timezone
  const timeTicks = useMemo(() => {
    return generateTimeTicks(props.timezone);
  }, [props.timezone]);

  // Build day grid for current region/timezone
  const dayGrid = useMemo(() => {
    if (!data) return [];
    return buildDayGrid(data, props.region, props.timezone);
  }, [data, props.region, props.timezone]);

  // Handle region change
  const handleRegionChange = useCallback((newRegion: Region) => {
    if (data) {
      const availableTz = getAvailableTimezones(data, newRegion);
      if (availableTz.length > 0) {
        // Auto-select first available timezone for new region
        // This would need to be handled by parent component in real usage
      }
    }
  }, [data]);

  // Handle timezone change
  const handleTimezoneChange = useCallback((newTimezone: Tz) => {
    // This would need to be handled by parent component in real usage
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        color: '#ffffff',
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
        backgroundColor: '#000000',
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
  if (!data) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        No data available. Please provide JSON data.
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
        backgroundColor: '#000000',
        color: '#ff6b6b',
        fontSize: props.fontSize,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Invalid region/timezone combination: {props.region}/{props.timezone}
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#111111',
        borderBottom: '1px solid #333333',
        gap: '16px',
        flexShrink: 0
      }}>
        {/* Region Selector */}
        {props.visibleRegions.SA && props.visibleRegions.ROA && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['SA', 'ROA'] as Region[]).map(region => (
              <button
                key={region}
                onClick={() => handleRegionChange(region)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: props.region === region ? '#6b46c1' : 'transparent',
                  color: props.region === region ? '#ffffff' : '#cccccc',
                  cursor: 'pointer',
                  fontSize: props.fontSize,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  border: props.region === region ? 'none' : '1px solid #333333'
                }}
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {/* Timezone Selector */}
        {availableTimezones.length > 1 && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {availableTimezones.map(tz => (
              <button
                key={tz}
                onClick={() => handleTimezoneChange(tz)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  backgroundColor: props.timezone === tz ? '#6b46c1' : 'transparent',
                  color: props.timezone === tz ? '#ffffff' : '#cccccc',
                  cursor: 'pointer',
                  fontSize: props.fontSize - 2,
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
          fontSize: props.fontSize - 2,
          color: '#888888'
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
          backgroundColor: '#111111',
          borderRight: '1px solid #333333',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Timezone Header */}
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #333333',
            fontSize: props.fontSize,
            fontWeight: 600,
            textAlign: 'center',
            backgroundColor: '#1a1a1a'
          }}>
            {props.timezone}
          </div>

          {/* Day Labels */}
          {dayGrid.map((day, index) => (
            <div
              key={day.date}
              style={{
                padding: '12px',
                borderBottom: '1px solid #333333',
                fontSize: props.fontSize - 2,
                height: props.cellHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: index % 2 === 0 ? '#111111' : '#0f0f0f'
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
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333333',
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
                  fontSize: props.fontSize - 2,
                  fontWeight: time.endsWith(':00') ? 600 : 400,
                  borderRight: '1px solid #333333',
                  opacity: time.endsWith(':00') ? 1 : 0.7,
                  backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#161616'
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
                  borderBottom: '1px solid #333333',
                  position: 'relative',
                  backgroundColor: dayIndex % 2 === 0 ? '#0a0a0a' : '#080808'
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
                      backgroundColor: '#333333',
                      opacity: 0.3
                    }}
                  />
                ))}

                {/* Show Blocks */}
                {day.slots.map((slot, slotIndex) => {
                  const startSlotIndex = getShowStartSlot({ start: slot.time } as ShowItem, props.timezone);
                  
                  return slot.shows.map((show, showIndex) => {
                    const span = getShowSlotSpan(show);
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
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: '1px solid #333333',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          overflow: 'hidden'
                        }}
                        title={createShowTooltip(show)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                        }}
                      >
                        {/* Show Title */}
                        <div
                          style={{
                            fontSize: props.fontSize,
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
                              fontSize: props.fontSize - 2,
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
                            fontSize: props.fontSize - 3,
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
  );
}

// Framer Property Controls
addPropertyControls(TVGuideStandalone, {
  dataSource: {
    type: ControlType.Enum,
    title: 'Data Source',
    options: ['static', 'remote'],
    defaultValue: 'static'
  },
  region: {
    type: ControlType.Enum,
    title: 'Region',
    options: ['SA', 'ROA'],
    defaultValue: 'ROA'
  },
  timezone: {
    type: ControlType.Enum,
    title: 'Timezone',
    options: ['WAT', 'CAT'],
    defaultValue: 'WAT'
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
    }
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
    }
  },
  staticData: {
    type: ControlType.JSON,
    title: 'Static Data',
    description: 'JSON data for TV guide (when dataSource is "static")'
  },
  cellWidth: {
    type: ControlType.Number,
    title: 'Cell Width',
    defaultValue: 120,
    min: 60,
    max: 300
  },
  cellHeight: {
    type: ControlType.Number,
    title: 'Cell Height',
    defaultValue: 56,
    min: 40,
    max: 120
  },
  fontSize: {
    type: ControlType.Number,
    title: 'Font Size',
    defaultValue: 14,
    min: 10,
    max: 24
  },
  rowGap: {
    type: ControlType.Number,
    title: 'Row Gap',
    defaultValue: 8,
    min: 0,
    max: 20
  },
  colGap: {
    type: ControlType.Number,
    title: 'Column Gap',
    defaultValue: 2,
    min: 0,
    max: 10
  }
});

