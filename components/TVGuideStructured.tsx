/**
 * Structured TV Guide Framer Component
 * 
 * Handles specific time structures for SA and ROA regions:
 * - SA: CAT timezone, 6:00 AM - 5:30 AM next day, 30-min intervals
 * - ROA: WAT (5:00 AM - 4:00 AM) and CAT (6:00 AM - 5:00 AM), 30-min intervals
 * - Separate JSON inputs for SA and ROA data
 * - Starts from Monday of current week, adjusts based on uploaded data
 */

import React, { useState, useEffect, useMemo } from 'react';
import { addPropertyControls, ControlType } from "framer";

// Types
interface Slot {
  startISO: string;
  endISO: string;
  title: string;
  season?: string;
  episode?: string;
  subtitle?: string;
  textColor?: string;
  bgColor?: string;
  durationMin?: number;
}

interface Day {
  dateISO: string;
  slots: Slot[];
}

interface Region {
  code: string;
  label: string;
  timezones: string[];
  days: Day[];
}

interface GuideData {
  metadata: {
    channelId: string;
    generatedAt: string;
    defaultRegion: string;
    defaultTimezone: string;
  };
  regions: Region[];
}

interface TVGuideProps {
  // Separate JSON inputs for SA and ROA
  saDataJSON?: string;
  roaDataJSON?: string;
  
  // Layout
  hourWidthPx?: number;
  rowHeightPx?: number;
  cornerRadiusPx?: number;
  gridLineColor?: string;
  headerHeightPx?: number;
  dayColumnWidthPx?: number;
  
  // Typography
  fontFamily?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
  timeFontSize?: number;
  dayFontSize?: number;
  
  // Colors
  pageBg?: string;
  cardBg?: string;
  cardText?: string;
  headerBg?: string;
  dayColumnBg?: string;
  activeRegionBg?: string;
  activeTimezoneBg?: string;
  focusOutline?: string;
  
  // Behavior
  enableRegionSwitch?: boolean;
  enableTimezoneSwitch?: boolean;
  initialRegion?: string;
  initialTimezone?: string;
  highContrast?: boolean;
  showCurrentDay?: boolean;
  
  // Time range
  showTimeLabels?: boolean;
}

// Helper function to get Monday of current week
function getMondayOfCurrentWeek(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split('T')[0];
}

// Helper function to generate time ticks for SA (6:00 AM - 5:30 AM next day)
function generateSATimeTicks(hourWidthPx: number) {
  const ticks = [];
  
  // 6:00 AM to 11:30 PM (same day)
  for (let hour = 6; hour <= 23; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour - 6) * hourWidthPx,
      isMajor: true
    });
    
    if (hour < 23) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour - 6) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  // 12:00 AM to 5:30 AM (next day)
  for (let hour = 0; hour <= 5; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour + 18) * hourWidthPx, // 18 = 24 - 6
      isMajor: true
    });
    
    if (hour < 5) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour + 18) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    } else {
      // 5:30 AM (last tick)
      ticks.push({
        hour: 5,
        minute: 30,
        label: "05:30",
        xPosition: (5 + 18) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  return ticks;
}

// Helper function to generate time ticks for ROA WAT (5:00 AM - 4:00 AM next day)
function generateROAWATTimeTicks(hourWidthPx: number) {
  const ticks = [];
  
  // 5:00 AM to 11:30 PM (same day)
  for (let hour = 5; hour <= 23; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour - 5) * hourWidthPx,
      isMajor: true
    });
    
    if (hour < 23) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour - 5) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  // 12:00 AM to 4:00 AM (next day)
  for (let hour = 0; hour <= 4; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour + 19) * hourWidthPx, // 19 = 24 - 5
      isMajor: true
    });
    
    if (hour < 4) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour + 19) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  return ticks;
}

// Helper function to generate time ticks for ROA CAT (6:00 AM - 5:00 AM next day)
function generateROACATTimeTicks(hourWidthPx: number) {
  const ticks = [];
  
  // 6:00 AM to 11:30 PM (same day)
  for (let hour = 6; hour <= 23; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour - 6) * hourWidthPx,
      isMajor: true
    });
    
    if (hour < 23) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour - 6) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  // 12:00 AM to 5:00 AM (next day)
  for (let hour = 0; hour <= 5; hour++) {
    ticks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour + 18) * hourWidthPx, // 18 = 24 - 6
      isMajor: true
    });
    
    if (hour < 5) {
      ticks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour + 18) * hourWidthPx + hourWidthPx / 2,
        isMajor: false
      });
    }
  }
  
  return ticks;
}

export default function TVGuideStructured(props: TVGuideProps) {
  const [saData, setSaData] = useState<GuideData | null>(null);
  const [roaData, setRoaData] = useState<GuideData | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string>(props.initialRegion || "SA");
  const [currentTimezone, setCurrentTimezone] = useState<string>(props.initialTimezone || "CAT");
  const [loading, setLoading] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Load SA data
  useEffect(() => {
    if (props.saDataJSON) {
      try {
        const jsonData = JSON.parse(props.saDataJSON);
        setSaData(jsonData);
      } catch (error) {
        console.error('Error parsing SA JSON data:', error);
      }
    }
  }, [props.saDataJSON]);

  // Load ROA data
  useEffect(() => {
    if (props.roaDataJSON) {
      try {
        const jsonData = JSON.parse(props.roaDataJSON);
        setRoaData(jsonData);
      } catch (error) {
        console.error('Error parsing ROA JSON data:', error);
      }
    }
  }, [props.roaDataJSON]);

  // Combine data from both sources
  const combinedData = useMemo(() => {
    const regions: Region[] = [];
    
    if (saData) {
      const saRegion = saData.regions.find(r => r.code === "SA");
      if (saRegion) {
        regions.push({
          ...saRegion,
          timezones: ["CAT"] // SA only has CAT
        });
      }
    }
    
    if (roaData) {
      const roaRegion = roaData.regions.find(r => r.code === "ROA");
      if (roaRegion) {
        regions.push({
          ...roaRegion,
          timezones: ["WAT", "CAT"] // ROA has both WAT and CAT
        });
      }
    }
    
    return {
      metadata: {
        channelId: "combined-guide",
        generatedAt: new Date().toISOString(),
        defaultRegion: regions.length > 0 ? regions[0].code : "SA",
        defaultTimezone: "CAT"
      },
      regions
    };
  }, [saData, roaData]);

  // Get current region data
  const currentRegionData = combinedData.regions.find(r => r.code === currentRegion);
  const availableTimezones = currentRegionData?.timezones || [];

  // Generate time ticks based on region and timezone
  const timeTicks = useMemo(() => {
    const hourWidth = props.hourWidthPx || 220;
    
    if (currentRegion === "SA") {
      return generateSATimeTicks(hourWidth);
    } else if (currentRegion === "ROA") {
      if (currentTimezone === "WAT") {
        return generateROAWATTimeTicks(hourWidth);
      } else if (currentTimezone === "CAT") {
        return generateROACATTimeTicks(hourWidth);
      }
    }
    
    return generateSATimeTicks(hourWidth); // fallback
  }, [currentRegion, currentTimezone, props.hourWidthPx]);

  // Get current day for highlighting
  const currentDate = new Date().toISOString().split('T')[0];

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg || '#000000',
        color: props.cardText || '#ffffff',
        fontFamily: props.fontFamily || 'system-ui, -apple-system, sans-serif'
      }}>
        Loading TV Guide...
      </div>
    );
  }

  if (!currentRegionData || combinedData.regions.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.pageBg || '#000000',
        color: props.cardText || '#ffffff',
        fontFamily: props.fontFamily || 'system-ui, -apple-system, sans-serif'
      }}>
        No data available. Please provide SA and/or ROA JSON data.
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: props.pageBg || '#000000',
      color: props.cardText || '#ffffff',
      fontFamily: props.fontFamily || 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
        backgroundColor: props.headerBg || '#111111',
        height: props.headerHeightPx || 60,
        minHeight: props.headerHeightPx || 60
      }}>
        {/* Region Switcher */}
        {props.enableRegionSwitch && combinedData.regions.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {combinedData.regions.map(region => (
              <button
                key={region.code}
                onClick={() => {
                  setCurrentRegion(region.code);
                  setCurrentTimezone(region.timezones[0]);
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: `${props.cornerRadiusPx || 6}px`,
                  backgroundColor: currentRegion === region.code 
                    ? (props.activeRegionBg || '#6b46c1')
                    : 'transparent',
                  color: props.cardText || '#ffffff',
                  cursor: 'pointer',
                  fontSize: props.titleFontSize || 14,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  border: currentRegion === region.code ? 'none' : `1px solid ${props.gridLineColor || '#1a1a1a'}`
                }}
              >
                {region.label}
              </button>
            ))}
          </div>
        )}

        {/* Timezone Switcher */}
        {props.enableTimezoneSwitch && availableTimezones.length > 1 && (
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            {availableTimezones.map(tz => (
              <button
                key={tz}
                onClick={() => setCurrentTimezone(tz)}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
                  borderRadius: `${props.cornerRadiusPx || 4}px`,
                  backgroundColor: currentTimezone === tz 
                    ? (props.activeTimezoneBg || '#6b46c1')
                    : 'transparent',
                  color: props.cardText || '#ffffff',
                  cursor: 'pointer',
                  fontSize: props.subtitleFontSize || 12,
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                {tz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Day Column */}
        <div style={{
          width: props.dayColumnWidthPx || 120,
          backgroundColor: props.dayColumnBg || '#111111',
          borderRight: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          left: 0,
          zIndex: 20
        }}>
          <div style={{
            padding: '12px',
            borderBottom: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
            fontSize: props.dayFontSize || 14,
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {currentTimezone}
          </div>
          {currentRegionData.days.map((day, index) => {
            const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate;
            return (
              <div
                key={day.dateISO}
                style={{
                  padding: '12px',
                  borderBottom: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
                  fontSize: props.dayFontSize || 12,
                  height: props.rowHeightPx || 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCurrentDay ? (props.activeRegionBg || '#6b46c1') : 'transparent',
                  color: isCurrentDay ? '#ffffff' : (props.cardText || '#ffffff'),
                  fontWeight: isCurrentDay ? 600 : 400
                }}
              >
                {new Date(day.dateISO).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </div>
            );
          })}
        </div>

        {/* Grid Area */}
        <div 
          style={{ flex: 1, overflow: 'auto' }}
          onScroll={handleScroll}
        >
          {/* Time Header */}
          {props.showTimeLabels && (
            <div style={{
              display: 'flex',
              backgroundColor: props.headerBg || '#111111',
              borderBottom: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              {currentRegionData.days.map((day, dayIndex) => (
                <div key={day.dateISO} style={{ display: 'flex' }}>
                  {timeTicks.map((tick, index) => (
                    <div
                      key={`${dayIndex}-${index}`}
                      style={{
                        width: tick.isMajor ? (props.hourWidthPx || 220) : (props.hourWidthPx || 220) / 2,
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontSize: props.timeFontSize || 12,
                        fontWeight: tick.isMajor ? 600 : 400,
                        borderRight: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
                        opacity: tick.isMajor ? 1 : 0.7
                      }}
                    >
                      {tick.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Program Grid */}
          {currentRegionData.days.map((day, dayIndex) => {
            const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate;
            return (
              <div
                key={day.dateISO}
                style={{
                  display: 'flex',
                  height: props.rowHeightPx || 64,
                  borderBottom: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
                  position: 'relative',
                  backgroundColor: isCurrentDay ? 'rgba(107, 70, 193, 0.1)' : 'transparent'
                }}
              >
                {day.slots.map((slot, slotIndex) => {
                  const startTime = new Date(slot.startISO);
                  const endTime = new Date(slot.endISO || slot.startISO);
                  const startHour = startTime.getUTCHours();
                  const startMinute = startTime.getUTCMinutes();
                  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
                  
                  // Calculate position based on region and timezone
                  let left = 0;
                  if (currentRegion === "SA") {
                    // SA: 6:00 AM - 5:30 AM next day
                    if (startHour >= 6) {
                      left = ((startHour - 6) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                    } else {
                      left = ((startHour + 18) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                    }
                  } else if (currentRegion === "ROA") {
                    if (currentTimezone === "WAT") {
                      // ROA WAT: 5:00 AM - 4:00 AM next day
                      if (startHour >= 5) {
                        left = ((startHour - 5) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                      } else {
                        left = ((startHour + 19) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                      }
                    } else if (currentTimezone === "CAT") {
                      // ROA CAT: 6:00 AM - 5:00 AM next day
                      if (startHour >= 6) {
                        left = ((startHour - 6) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                      } else {
                        left = ((startHour + 18) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
                      }
                    }
                  }
                  
                  const width = Math.max(180, duration * (props.hourWidthPx || 220) / 60);

                  return (
                    <div
                      key={slotIndex}
                      style={{
                        position: 'absolute',
                        left: left + 4,
                        top: 4,
                        bottom: 4,
                        width: width - 8,
                        backgroundColor: slot.bgColor || (props.cardBg || '#1a1a1a'),
                        color: slot.textColor || (props.cardText || '#ffffff'),
                        borderRadius: `${props.cornerRadiusPx || 8}px`,
                        padding: '8px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: props.highContrast ? '2px solid #ffffff' : '1px solid transparent',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div style={{
                        fontSize: props.titleFontSize || 14,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {slot.title}
                      </div>
                      {(slot.subtitle || (slot.season && slot.episode)) && (
                        <div style={{
                          fontSize: props.subtitleFontSize || 12,
                          opacity: 0.8,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {slot.subtitle || `${slot.season} ${slot.episode}`}
                        </div>
                      )}
                      <div style={{
                        fontSize: props.timeFontSize || 10,
                        opacity: 0.6,
                        marginTop: '2px'
                      }}>
                        {startTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })} - {endTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Framer property controls
addPropertyControls(TVGuideStructured, {
  // Separate JSON inputs for SA and ROA
  saDataJSON: {
    type: ControlType.String,
    title: "SA Data JSON",
    description: "JSON data for South Africa region (CAT timezone, 6:00 AM - 5:30 AM)"
  },
  roaDataJSON: {
    type: ControlType.String,
    title: "ROA Data JSON",
    description: "JSON data for Rest of Africa region (WAT: 5:00 AM - 4:00 AM, CAT: 6:00 AM - 5:00 AM)"
  },
  
  // Layout
  hourWidthPx: {
    type: ControlType.Number,
    title: "Hour Width (px)",
    defaultValue: 220,
    min: 100,
    max: 500
  },
  rowHeightPx: {
    type: ControlType.Number,
    title: "Row Height (px)",
    defaultValue: 64,
    min: 40,
    max: 120
  },
  cornerRadiusPx: {
    type: ControlType.Number,
    title: "Corner Radius (px)",
    defaultValue: 8,
    min: 0,
    max: 20
  },
  gridLineColor: {
    type: ControlType.Color,
    title: "Grid Line Color",
    defaultValue: "#1a1a1a"
  },
  headerHeightPx: {
    type: ControlType.Number,
    title: "Header Height (px)",
    defaultValue: 60,
    min: 40,
    max: 100
  },
  dayColumnWidthPx: {
    type: ControlType.Number,
    title: "Day Column Width (px)",
    defaultValue: 120,
    min: 80,
    max: 200
  },
  
  // Typography
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "system-ui, -apple-system, sans-serif"
  },
  titleFontSize: {
    type: ControlType.Number,
    title: "Title Font Size",
    defaultValue: 14,
    min: 10,
    max: 24
  },
  subtitleFontSize: {
    type: ControlType.Number,
    title: "Subtitle Font Size",
    defaultValue: 12,
    min: 8,
    max: 20
  },
  timeFontSize: {
    type: ControlType.Number,
    title: "Time Font Size",
    defaultValue: 10,
    min: 8,
    max: 16
  },
  dayFontSize: {
    type: ControlType.Number,
    title: "Day Font Size",
    defaultValue: 12,
    min: 8,
    max: 20
  },
  
  // Colors
  pageBg: {
    type: ControlType.Color,
    title: "Page Background",
    defaultValue: "#000000"
  },
  cardBg: {
    type: ControlType.Color,
    title: "Card Background",
    defaultValue: "#1a1a1a"
  },
  cardText: {
    type: ControlType.Color,
    title: "Card Text",
    defaultValue: "#ffffff"
  },
  headerBg: {
    type: ControlType.Color,
    title: "Header Background",
    defaultValue: "#111111"
  },
  dayColumnBg: {
    type: ControlType.Color,
    title: "Day Column Background",
    defaultValue: "#111111"
  },
  activeRegionBg: {
    type: ControlType.Color,
    title: "Active Region Background",
    defaultValue: "#6b46c1"
  },
  activeTimezoneBg: {
    type: ControlType.Color,
    title: "Active Timezone Background",
    defaultValue: "#6b46c1"
  },
  focusOutline: {
    type: ControlType.Color,
    title: "Focus Outline",
    defaultValue: "#ffffff"
  },
  
  // Behavior
  enableRegionSwitch: {
    type: ControlType.Boolean,
    title: "Enable Region Switch",
    defaultValue: true
  },
  enableTimezoneSwitch: {
    type: ControlType.Boolean,
    title: "Enable Timezone Switch",
    defaultValue: true
  },
  initialRegion: {
    type: ControlType.String,
    title: "Initial Region",
    defaultValue: "SA"
  },
  initialTimezone: {
    type: ControlType.String,
    title: "Initial Timezone",
    defaultValue: "CAT"
  },
  highContrast: {
    type: ControlType.Boolean,
    title: "High Contrast",
    defaultValue: false
  },
  showCurrentDay: {
    type: ControlType.Boolean,
    title: "Show Current Day",
    defaultValue: true
  },
  
  // Time range
  showTimeLabels: {
    type: ControlType.Boolean,
    title: "Show Time Labels",
    defaultValue: true
  }
});
