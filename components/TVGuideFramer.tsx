/**
 * TV Guide Framer Component - Optimized for Framer
 * 
 * A simplified version of the TV Guide component specifically designed
 * for easy integration with Framer's Code Component system.
 */

import React, { useState, useEffect } from 'react';
import { addPropertyControls, ControlType } from "framer";

// Simplified types for Framer
interface TVGuideProps {
  dataURL?: string;
  dataJSON?: string;
  hourWidthPx?: number;
  rowHeightPx?: number;
  startHour?: number;
  endHour?: number;
  pageBg?: string;
  cardBg?: string;
  cardText?: string;
  activeRegionBg?: string;
  focusOutline?: string;
  enableRegionSwitch?: boolean;
  enableTimezoneSwitch?: boolean;
  initialRegion?: string;
  initialTimezone?: string;
  highContrast?: boolean;
  fontFamily?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
}

// Sample data for demonstration
const sampleData = {
  metadata: {
    channelId: "zee-world",
    generatedAt: "2025-10-07T09:00:00Z",
    defaultRegion: "ROA",
    defaultTimezone: "CAT"
  },
  regions: [
    {
      code: "SA",
      label: "South Africa",
      timezones: ["CAT"],
      days: [
        {
          dateISO: "2025-09-29",
          slots: [
            {
              startISO: "2025-09-29T05:00:00Z",
              endISO: "2025-09-29T05:30:00Z",
              title: "Sister Wives",
              season: "S1",
              episode: "Ep 142"
            },
            {
              startISO: "2025-09-29T05:30:00Z",
              endISO: "2025-09-29T06:00:00Z",
              title: "Radhe Mohan",
              season: "S3",
              episode: "Ep 68"
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
          dateISO: "2025-09-29",
          slots: [
            {
              startISO: "2025-09-29T05:30:00Z",
              endISO: "2025-09-29T06:00:00Z",
              title: "Radhe Mohan",
              season: "S3",
              episode: "Ep 68",
              subtitle: "S3 EP 68",
              bgColor: "#111216"
            }
          ]
        }
      ]
    }
  ]
};

export default function TVGuideFramer(props: TVGuideProps) {
  const [data, setData] = useState(sampleData);
  const [currentRegion, setCurrentRegion] = useState(props.initialRegion || "ROA");
  const [currentTimezone, setCurrentTimezone] = useState(props.initialTimezone || "WAT");
  const [loading, setLoading] = useState(false);

  // Load data from URL or JSON
  useEffect(() => {
    if (props.dataURL) {
      setLoading(true);
      fetch(props.dataURL)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load data:', error);
          setLoading(false);
        });
    } else if (props.dataJSON) {
      try {
        const parsedData = JSON.parse(props.dataJSON);
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    }
  }, [props.dataURL, props.dataJSON]);

  const currentRegionData = data.regions.find(r => r.code === currentRegion);
  const availableTimezones = currentRegionData?.timezones || ['WAT', 'CAT', 'EST'];

  // Generate time ticks
  const generateTimeTicks = () => {
    const ticks = [];
    const startHour = props.startHour || 5;
    const endHour = props.endHour || 24;
    const hourWidth = props.hourWidthPx || 220;

    for (let hour = startHour; hour < endHour; hour++) {
      ticks.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        xPosition: (hour - startHour) * hourWidth,
        isMajor: true
      });
      
      if (hour < endHour - 1) {
        ticks.push({
          hour,
          label: `${hour.toString().padStart(2, '0')}:30`,
          xPosition: (hour - startHour) * hourWidth + hourWidth / 2,
          isMajor: false
        });
      }
    }
    return ticks;
  };

  const timeTicks = generateTimeTicks();

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.pageBg || '#0a0a0a',
        color: props.cardText || '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: props.fontFamily || 'system-ui, sans-serif'
      }}>
        Loading TV Guide...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: props.pageBg || '#0a0a0a',
      color: props.cardText || '#ffffff',
      fontFamily: props.fontFamily || 'system-ui, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Region Tabs */}
        {props.enableRegionSwitch && data.regions.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {data.regions.map(region => (
              <button
                key={region.code}
                onClick={() => setCurrentRegion(region.code)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: currentRegion === region.code 
                    ? (props.activeRegionBg || '#6b46c1')
                    : 'transparent',
                  color: props.cardText || '#ffffff',
                  cursor: 'pointer',
                  fontSize: props.titleFontSize || 14
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
                  padding: '4px 8px',
                  border: '1px solid #1a1a1a',
                  borderRadius: '4px',
                  backgroundColor: currentTimezone === tz 
                    ? (props.activeRegionBg || '#6b46c1')
                    : 'transparent',
                  color: props.cardText || '#ffffff',
                  cursor: 'pointer',
                  fontSize: 12
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
          width: '120px',
          backgroundColor: '#111111',
          borderRight: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          left: 0,
          zIndex: 20
        }}>
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #1a1a1a',
            fontSize: props.titleFontSize || 14,
            fontWeight: 600
          }}>
            {currentTimezone}
          </div>
          {currentRegionData?.days.map((day, index) => (
            <div
              key={day.dateISO}
              style={{
                padding: '12px',
                borderBottom: '1px solid #1a1a1a',
                fontSize: props.subtitleFontSize || 12,
                height: props.rowHeightPx || 64,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {new Date(day.dateISO).toLocaleDateString('en-US', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </div>
          ))}
        </div>

        {/* Grid Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Time Header */}
          <div style={{
            display: 'flex',
            backgroundColor: '#111111',
            borderBottom: '1px solid #1a1a1a',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            {currentRegionData?.days.map((day, dayIndex) => (
              <div key={day.dateISO} style={{ display: 'flex' }}>
                {timeTicks.map((tick, index) => (
                  <div
                    key={`${dayIndex}-${index}`}
                    style={{
                      width: tick.isMajor ? (props.hourWidthPx || 220) : (props.hourWidthPx || 220) / 2,
                      padding: '12px 8px',
                      textAlign: 'center',
                      fontSize: props.subtitleFontSize || 12,
                      fontWeight: tick.isMajor ? 600 : 400,
                      borderRight: '1px solid #1a1a1a',
                      opacity: tick.isMajor ? 1 : 0.7
                    }}
                  >
                    {tick.label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Program Grid */}
          {currentRegionData?.days.map((day, dayIndex) => (
            <div
              key={day.dateISO}
              style={{
                display: 'flex',
                height: props.rowHeightPx || 64,
                borderBottom: '1px solid #1a1a1a',
                position: 'relative'
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
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: props.highContrast ? '2px solid #ffffff' : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
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
                      fontSize: 10,
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
          ))}
        </div>
      </div>
    </div>
  );
}

// Framer Controls
addPropertyControls(TVGuideFramer, {
  // Data
  dataURL: {
    type: ControlType.String,
    title: "Data URL",
    defaultValue: "/guide.json",
    placeholder: "/path/to/guide.json"
  },
  
  dataJSON: {
    type: ControlType.String,
    title: "Data JSON",
    defaultValue: "",
    placeholder: "Paste JSON data here"
  },
  
  // Layout
  hourWidthPx: {
    type: ControlType.Number,
    title: "Hour Width (px)",
    defaultValue: 220,
    min: 100,
    max: 500,
    step: 10
  },
  
  rowHeightPx: {
    type: ControlType.Number,
    title: "Row Height (px)",
    defaultValue: 64,
    min: 40,
    max: 120,
    step: 4
  },
  
  startHour: {
    type: ControlType.Number,
    title: "Start Hour",
    defaultValue: 5,
    min: 0,
    max: 23,
    step: 1
  },
  
  endHour: {
    type: ControlType.Number,
    title: "End Hour",
    defaultValue: 24,
    min: 1,
    max: 24,
    step: 1
  },
  
  // Colors
  pageBg: {
    type: ControlType.Color,
    title: "Page Background",
    defaultValue: "#0a0a0a"
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
  
  activeRegionBg: {
    type: ControlType.Color,
    title: "Active Region Background",
    defaultValue: "#6b46c1"
  },
  
  focusOutline: {
    type: ControlType.Color,
    title: "Focus Outline",
    defaultValue: "#6b46c1"
  },
  
  // Typography
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "system-ui, sans-serif",
    placeholder: "Inter, sans-serif"
  },
  
  titleFontSize: {
    type: ControlType.Number,
    title: "Title Font Size",
    defaultValue: 14,
    min: 10,
    max: 24,
    step: 1
  },
  
  subtitleFontSize: {
    type: ControlType.Number,
    title: "Subtitle Font Size",
    defaultValue: 12,
    min: 8,
    max: 20,
    step: 1
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
    defaultValue: "ROA",
    placeholder: "SA or ROA"
  },
  
  initialTimezone: {
    type: ControlType.String,
    title: "Initial Timezone",
    defaultValue: "WAT",
    placeholder: "WAT, CAT, or EST"
  },
  
  highContrast: {
    type: ControlType.Boolean,
    title: "High Contrast Mode",
    defaultValue: false
  }
});
