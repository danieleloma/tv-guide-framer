/**
 * TV Guide Framer Component - Fixed Horizontal Layout
 * 
 * A TV Guide component that displays all days horizontally in a scrollable grid
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
              startISO: "2025-10-26T05:00:00Z",
              endISO: "2025-10-26T05:30:00Z",
              title: "Ringside Rebel S1 EP 278",
              durationMin: 30
            },
            {
              startISO: "2025-10-26T05:30:00Z",
              endISO: "2025-10-26T06:00:00Z",
              title: "Twist of Fate: New Era S10 EP73",
              durationMin: 30
            },
            {
              startISO: "2025-10-26T06:00:00Z",
              endISO: "2025-10-26T06:30:00Z",
              title: "Hidden Intentions S1 EP 57",
              durationMin: 30
            }
          ]
        },
        {
          dateISO: "2025-10-27",
          slots: [
            {
              startISO: "2025-10-27T05:00:00Z",
              endISO: "2025-10-27T05:30:00Z",
              title: "Ringside Rebel S1 EP 279",
              durationMin: 30
            },
            {
              startISO: "2025-10-27T05:30:00Z",
              endISO: "2025-10-27T06:00:00Z",
              title: "Twist of Fate: New Era S10 EP74",
              durationMin: 30
            }
          ]
        },
        {
          dateISO: "2025-10-28",
          slots: [
            {
              startISO: "2025-10-28T05:00:00Z",
              endISO: "2025-10-28T05:30:00Z",
              title: "Ringside Rebel S1 EP 280",
              durationMin: 30
            }
          ]
        }
      ]
    }
  ]
};

export default function TVGuideFramerFixed(props: TVGuideProps) {
  const [data, setData] = useState(sampleData);
  const [currentRegion, setCurrentRegion] = useState(props.initialRegion || "SA");
  const [currentTimezone, setCurrentTimezone] = useState(props.initialTimezone || "CAT");
  const [loading, setLoading] = useState(false);

  // Load data from URL or JSON
  useEffect(() => {
    if (props.dataURL) {
      setLoading(true);
      fetch(props.dataURL)
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
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
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    }
  }, [props.dataURL, props.dataJSON]);

  // Get current region data
  const currentRegionData = data.regions.find(r => r.code === currentRegion);
  const availableTimezones = currentRegionData?.timezones || [];

  // Generate time ticks
  const timeTicks = [];
  const startHour = props.startHour || 5;
  const endHour = props.endHour || 23;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    timeTicks.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
      xPosition: (hour - startHour) * (props.hourWidthPx || 220),
      isMajor: true
    });
    
    if (hour < endHour) {
      timeTicks.push({
        hour,
        minute: 30,
        label: `${hour.toString().padStart(2, '0')}:30`,
        xPosition: (hour - startHour) * (props.hourWidthPx || 220) + (props.hourWidthPx || 220) / 2,
        isMajor: false
      });
    }
  }

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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #1a1a1a',
        backgroundColor: '#111111'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: props.titleFontSize || 18,
          fontWeight: 600
        }}>
          TV Guide - {currentRegionData?.label}
        </h2>

        {/* Region Switcher */}
        {props.enableRegionSwitch && data.regions.length > 1 && (
          <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
            {data.regions.map(region => (
              <button
                key={region.code}
                onClick={() => setCurrentRegion(region.code)}
                style={{
                  padding: '6px 12px',
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

// Framer property controls
addPropertyControls(TVGuideFramerFixed, {
  dataURL: {
    type: ControlType.String,
    title: "Data URL",
    description: "URL to fetch guide data from"
  },
  dataJSON: {
    type: ControlType.String,
    title: "Data JSON",
    description: "JSON data as string (paste your guide data here)"
  },
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
  activeRegionBg: {
    type: ControlType.Color,
    title: "Active Region BG",
    defaultValue: "#6b46c1"
  },
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
  }
});
