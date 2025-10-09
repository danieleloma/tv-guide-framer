/**
 * TV Guide Simple Framer Component
 * 
 * Simplified version with JSON input field that will definitely appear in Framer
 */

import React, { useState, useEffect, useMemo } from 'react';
import { addPropertyControls, ControlType } from 'framer';

// Types
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

interface TVGuideSimpleProps {
  jsonData: string; // This will show as a text input in Framer
  region: Region;
  timezone: Tz;
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
}

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

// Main Component
export default function TVGuideSimple(props: TVGuideSimpleProps) {
  const [data, setData] = useState<TvGuideData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse JSON data when it changes
  useEffect(() => {
    if (props.jsonData && props.jsonData.trim()) {
      try {
        const parsedData = JSON.parse(props.jsonData);
        setData(parsedData);
        setError(null);
      } catch (err) {
        setError('Invalid JSON data. Please check your JSON format.');
        setData(null);
      }
    } else {
      setData(null);
      setError(null);
    }
  }, [props.jsonData]);

  // Get available timezones for current region
  const availableTimezones = useMemo(() => {
    if (!data) return [];
    const regionData = data.regions[props.region];
    return Object.entries(regionData.timezones)
      .filter(([_, tzData]) => tzData !== null)
      .map(([tz, _]) => tz as Tz);
  }, [data, props.region]);

  // Validate current region/timezone combination
  const isValidCombo = useMemo(() => {
    if (!data) return false;
    const regionData = data.regions[props.region];
    return regionData.timezones[props.timezone] !== null;
  }, [data, props.region, props.timezone]);

  // Get time ticks for current timezone
  const timeTicks = useMemo(() => {
    return generateTimeTicks(props.timezone);
  }, [props.timezone]);

  // Build day grid for current region/timezone
  const dayGrid = useMemo(() => {
    if (!data) return [];
    
    const regionData = data.regions[props.region];
    const tzData = regionData.timezones[props.timezone];
    
    if (!tzData) {
      const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
    
    const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return WEEKDAYS.map(day => tzData.days[day]);
  }, [data, props.region, props.timezone]);

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
        {error}
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
        Please paste your JSON data in the "JSON Data" field
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
        {/* Region and Timezone Display */}
        <div style={{
          fontSize: props.fontSize,
          fontWeight: 600,
          color: '#6b46c1'
        }}>
          {props.region} • {props.timezone}
        </div>

        {/* Available Timezones */}
        <div style={{
          marginLeft: 'auto',
          fontSize: props.fontSize - 2,
          color: '#888888'
        }}>
          Available: {availableTimezones.join(', ')}
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
                        title={`${show.title} • ${formatTimeForDisplay(show.start)}–${formatTimeForDisplay(show.end)}`}
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

// Framer Property Controls - This will definitely show a JSON input field
addPropertyControls(TVGuideSimple, {
  jsonData: {
    type: ControlType.String,
    title: 'JSON Data',
    description: 'Paste your complete JSON data here',
    defaultValue: '{}',
    multiline: true,
    displayTextArea: true
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
  }
});

