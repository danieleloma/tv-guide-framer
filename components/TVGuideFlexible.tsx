/**
 * Flexible TV Guide Framer Component
 * 
 * A comprehensive TV Guide component that adapts to different channel websites:
 * - Multi-region support (SA, ROA, etc.)
 * - Dynamic timezone switching (WAT, CAT, EST)
 * - Single or multi-region channels
 * - Horizontal scrolling with sticky elements
 * - Full customization options
 * - Auto-adjusts to current day
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
  dataJSON?: string;
  dataURL?: string;
  channelIdFilter?: string;
  
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
  startHour?: number;
  endHour?: number;
  showTimeLabels?: boolean;
}

// Sample data structure
const sampleData: GuideData = {
  metadata: {
    channelId: "zee-world",
    generatedAt: "2025-10-07T12:01:48.246Z",
    defaultRegion: "SA",
    defaultTimezone: "CAT"
  },
  regions: [
    {
      code: "SA",
      label: "South Africa",
      timezones: ["CAT"],
      days: [
        {
          dateISO: "2025-10-26",
          slots: [
            {
              startISO: "2025-10-26T05:00:00.000Z",
              endISO: "2025-10-26T05:30:00.000Z",
              title: "Ringside Rebel S1 EP 278",
              durationMin: 30
            },
            {
              startISO: "2025-10-26T05:30:00.000Z",
              endISO: "2025-10-26T06:00:00.000Z",
              title: "Twist of Fate: New Era S10 EP73",
              durationMin: 30
            }
          ]
        },
        {
          dateISO: "2025-10-27",
          slots: [
            {
              startISO: "2025-10-27T05:00:00.000Z",
              endISO: "2025-10-27T05:30:00.000Z",
              title: "Ringside Rebel S1 EP 279",
              durationMin: 30
            }
          ]
        }
      ]
    },
    {
      code: "ROA",
      label: "Rest of Africa",
      timezones: ["WAT", "CAT", "EST"],
      days: [
        {
          dateISO: "2025-10-26",
          slots: [
            {
              startISO: "2025-10-26T05:30:00.000Z",
              endISO: "2025-10-26T06:00:00.000Z",
              title: "Radhe Mohan S3 EP 68",
              subtitle: "S3 EP 68",
              bgColor: "#111216",
              durationMin: 30
            }
          ]
        }
      ]
    }
  ]
};

export default function TVGuideFlexible(props: TVGuideProps) {
  const [data, setData] = useState<GuideData>(sampleData);
  const [currentRegion, setCurrentRegion] = useState<string>(props.initialRegion || data.metadata.defaultRegion);
  const [currentTimezone, setCurrentTimezone] = useState<string>(props.initialTimezone || data.metadata.defaultTimezone);
  const [loading, setLoading] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Load data from URL or JSON
  useEffect(() => {
    if (props.dataURL) {
      setLoading(true);
      fetch(props.dataURL)
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
          setCurrentRegion(jsonData.metadata.defaultRegion);
          setCurrentTimezone(jsonData.metadata.defaultTimezone);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading data:', error);
          setLoading(false);
        });
    } else if (props.dataJSON) {
      try {
        const jsonData = JSON.parse(props.dataJSON);
        setData(jsonData);
        setCurrentRegion(jsonData.metadata.defaultRegion);
        setCurrentTimezone(jsonData.metadata.defaultTimezone);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    }
  }, [props.dataURL, props.dataJSON]);

  // Filter data by channel ID if specified
  const filteredData = useMemo(() => {
    if (props.channelIdFilter && data.metadata.channelId !== props.channelIdFilter) {
      return { ...data, regions: [] };
    }
    return data;
  }, [data, props.channelIdFilter]);

  // Get current region data
  const currentRegionData = filteredData.regions.find(r => r.code === currentRegion);
  const availableTimezones = currentRegionData?.timezones || [];

  // Generate time ticks
  const timeTicks = useMemo(() => {
    const ticks = [];
    const startHour = props.startHour || 5;
    const endHour = props.endHour || 23;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      ticks.push({
        hour,
        minute: 0,
        label: `${hour.toString().padStart(2, '0')}:00`,
        xPosition: (hour - startHour) * (props.hourWidthPx || 220),
        isMajor: true
      });
      
      if (hour < endHour) {
        ticks.push({
          hour,
          minute: 30,
          label: `${hour.toString().padStart(2, '0')}:30`,
          xPosition: (hour - startHour) * (props.hourWidthPx || 220) + (props.hourWidthPx || 220) / 2,
          isMajor: false
        });
      }
    }
    return ticks;
  }, [props.startHour, props.endHour, props.hourWidthPx]);

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

  if (!currentRegionData) {
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
        No data available for the selected region.
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
        {props.enableRegionSwitch && filteredData.regions.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {filteredData.regions.map(region => (
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
                  
                  const left = ((startHour - (props.startHour || 5)) * 60 + startMinute) * (props.hourWidthPx || 220) / 60;
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
addPropertyControls(TVGuideFlexible, {
  dataJSON: {
    type: ControlType.String,
    title: "Data JSON",
    description: "JSON data as string (paste your guide data here)"
  },
  dataURL: {
    type: ControlType.String,
    title: "Data URL",
    description: "URL to fetch guide data from"
  },
  channelIdFilter: {
    type: ControlType.String,
    title: "Channel ID Filter",
    description: "Filter data by channel ID"
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
  startHour: {
    type: ControlType.Number,
    title: "Start Hour",
    defaultValue: 5,
    min: 0,
    max: 23
  },
  endHour: {
    type: ControlType.Number,
    title: "End Hour",
    defaultValue: 23,
    min: 0,
    max: 23
  },
  showTimeLabels: {
    type: ControlType.Boolean,
    title: "Show Time Labels",
    defaultValue: true
  }
});
