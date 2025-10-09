/**
 * Debug TV Guide Framer Component
 * 
 * This component includes debug information to identify why TV show data isn't displaying.
 * Copy this entire component into Framer as a new Code Component.
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

export default function TVGuideDebug(props: TVGuideProps) {
  const [saData, setSaData] = useState<GuideData | null>(null);
  const [roaData, setRoaData] = useState<GuideData | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string>(props.initialRegion || "SA");
  const [currentTimezone, setCurrentTimezone] = useState<string>(props.initialTimezone || "CAT");
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Load SA data
  useEffect(() => {
    if (props.saDataJSON) {
      try {
        const jsonData = JSON.parse(props.saDataJSON);
        setSaData(jsonData);
        setDebugInfo(prev => prev + `\n✅ SA Data loaded: ${jsonData.regions?.[0]?.days?.length || 0} days`);
      } catch (error) {
        console.error('Error parsing SA JSON data:', error);
        setDebugInfo(prev => prev + `\n❌ SA Data error: ${error}`);
      }
    } else {
      setDebugInfo(prev => prev + `\n⚠️ No SA Data provided`);
    }
  }, [props.saDataJSON]);

  // Load ROA data
  useEffect(() => {
    if (props.roaDataJSON) {
      try {
        const jsonData = JSON.parse(props.roaDataJSON);
        setRoaData(jsonData);
        setDebugInfo(prev => prev + `\n✅ ROA Data loaded: ${jsonData.regions?.[0]?.days?.length || 0} days`);
      } catch (error) {
        console.error('Error parsing ROA JSON data:', error);
        setDebugInfo(prev => prev + `\n❌ ROA Data error: ${error}`);
      }
    } else {
      setDebugInfo(prev => prev + `\n⚠️ No ROA Data provided`);
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
        setDebugInfo(prev => prev + `\n✅ SA Region found: ${saRegion.days.length} days`);
      } else {
        setDebugInfo(prev => prev + `\n❌ SA Region not found in data`);
      }
    }
    
    if (roaData) {
      const roaRegion = roaData.regions.find(r => r.code === "ROA");
      if (roaRegion) {
        regions.push({
          ...roaRegion,
          timezones: ["WAT", "CAT"] // ROA has both WAT and CAT
        });
        setDebugInfo(prev => prev + `\n✅ ROA Region found: ${roaRegion.days.length} days`);
      } else {
        setDebugInfo(prev => prev + `\n❌ ROA Region not found in data`);
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

  // Get current day for highlighting
  const currentDate = new Date().toISOString().split('T')[0];

  // Debug current region data
  useEffect(() => {
    if (currentRegionData) {
      setDebugInfo(prev => prev + `\n✅ Current Region: ${currentRegion} (${currentRegionData.days.length} days)`);
      currentRegionData.days.forEach((day, index) => {
        setDebugInfo(prev => prev + `\n  Day ${index + 1}: ${day.dateISO} (${day.slots.length} slots)`);
        if (day.slots.length > 0) {
          setDebugInfo(prev => prev + `\n    First show: ${day.slots[0].title}`);
        }
      });
    } else {
      setDebugInfo(prev => prev + `\n❌ No current region data found for: ${currentRegion}`);
    }
  }, [currentRegionData, currentRegion]);

  if (!currentRegionData || combinedData.regions.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: props.pageBg || '#000000',
        color: props.cardText || '#ffffff',
        fontFamily: props.fontFamily || 'system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}>
        <h2>Debug Information</h2>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          fontSize: '12px', 
          backgroundColor: '#111111', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          flex: 1
        }}>
          {debugInfo}
        </pre>
        <div style={{ marginTop: '20px' }}>
          <p>No data available. Please provide SA and/or ROA JSON data.</p>
          <p>SA Data Length: {props.saDataJSON?.length || 0} characters</p>
          <p>ROA Data Length: {props.roaDataJSON?.length || 0} characters</p>
        </div>
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
      {/* Debug Panel */}
      <div style={{
        backgroundColor: '#111111',
        padding: '10px',
        borderBottom: '1px solid #333',
        fontSize: '12px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <strong>Debug Info:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {debugInfo}
        </pre>
      </div>

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
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  ({day.slots.length} shows)
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid Area */}
        <div 
          style={{ 
            flex: 1, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Program Grid */}
          <div style={{
            display: 'flex',
            minWidth: 'max-content'
          }}>
            {currentRegionData.days.map((day, dayIndex) => {
              const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate;
              return (
                <div
                  key={day.dateISO}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '800px', // Fixed width for debugging
                    borderRight: `1px solid ${props.gridLineColor || '#1a1a1a'}`,
                    position: 'relative',
                    backgroundColor: isCurrentDay ? 'rgba(107, 70, 193, 0.1)' : 'transparent',
                    minHeight: '400px'
                  }}
                >
                  {/* Debug info for each day */}
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#222',
                    color: '#fff',
                    fontSize: '10px',
                    borderBottom: '1px solid #333'
                  }}>
                    {day.dateISO} - {day.slots.length} shows
                  </div>
                  
                  {day.slots.map((slot, slotIndex) => {
                    const startTime = new Date(slot.startISO);
                    const endTime = new Date(slot.endISO || slot.startISO);
                    const startHour = startTime.getUTCHours();
                    const startMinute = startTime.getUTCMinutes();
                    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
                    
                    // Simple positioning for debugging
                    const left = (startHour * 30) + (startMinute * 0.5); // 30px per hour
                    const width = Math.max(120, duration * 0.5); // 0.5px per minute

                    return (
                      <div
                        key={slotIndex}
                        style={{
                          position: 'absolute',
                          left: left + 4,
                          top: 20 + (slotIndex * 60), // Stack vertically for debugging
                          width: width - 8,
                          height: 50,
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
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          zIndex: 10
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
    </div>
  );
}

// Framer property controls
addPropertyControls(TVGuideDebug, {
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
