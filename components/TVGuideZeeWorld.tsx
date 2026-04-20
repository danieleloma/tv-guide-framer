/**
 * TV Guide Framer Component - Zee World Data
 * 
 * A TV Guide component with your actual Zee World data embedded
 */

import React, { useState, useEffect } from 'react';
import { addPropertyControls, ControlType } from "framer";

// Your actual Zee World data
const zeeWorldData = {
  "metadata": {
    "channelId": "zee-world",
    "generatedAt": "2025-10-07T12:01:48.246Z",
    "defaultRegion": "SA",
    "defaultTimezone": "CAT"
  },
  "regions": [
    {
      "code": "SA",
      "label": "South Africa",
      "timezones": ["CAT"],
      "days": [
        {
          "dateISO": "2025-10-26",
          "slots": [
            {
              "startISO": "2025-10-26T05:00:00.000Z",
              "endISO": "2025-10-26T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 278",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T05:30:00.000Z",
              "endISO": "2025-10-26T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP73",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T06:30:00.000Z",
              "endISO": "2025-10-26T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T07:30:00.000Z",
              "endISO": "2025-10-26T08:00:00.000Z",
              "title": "Betrayal S1 EP 271",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T08:00:00.000Z",
              "endISO": "2025-10-26T08:30:00.000Z",
              "title": "Secrets S1 EP 51",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T08:30:00.000Z",
              "endISO": "2025-10-26T09:00:00.000Z",
              "title": "Taxi S1 EP 51",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T10:00:00.000Z",
              "endISO": "2025-10-26T10:30:00.000Z",
              "title": "King of Hearts S1 Ep120",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T11:00:00.000Z",
              "endISO": "2025-10-26T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T12:00:00.000Z",
              "endISO": "2025-10-26T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP73",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T13:00:00.000Z",
              "endISO": "2025-10-26T13:30:00.000Z",
              "title": "Secrets S1 EP 51",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-27",
          "slots": [
            {
              "startISO": "2025-10-27T05:00:00.000Z",
              "endISO": "2025-10-27T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 279",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T05:30:00.000Z",
              "endISO": "2025-10-27T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP74",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T06:30:00.000Z",
              "endISO": "2025-10-27T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 58",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T07:30:00.000Z",
              "endISO": "2025-10-27T08:00:00.000Z",
              "title": "Betrayal S1 EP 272",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T08:00:00.000Z",
              "endISO": "2025-10-27T08:30:00.000Z",
              "title": "Secrets S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T08:30:00.000Z",
              "endISO": "2025-10-27T09:00:00.000Z",
              "title": "Taxi S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T10:00:00.000Z",
              "endISO": "2025-10-27T10:30:00.000Z",
              "title": "King of Hearts S1 Ep121",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T11:00:00.000Z",
              "endISO": "2025-10-27T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T12:00:00.000Z",
              "endISO": "2025-10-27T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP74",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T13:00:00.000Z",
              "endISO": "2025-10-27T13:30:00.000Z",
              "title": "Secrets S1 EP 52",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-28",
          "slots": [
            {
              "startISO": "2025-10-28T05:00:00.000Z",
              "endISO": "2025-10-28T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 280",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T05:30:00.000Z",
              "endISO": "2025-10-28T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T06:30:00.000Z",
              "endISO": "2025-10-28T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 59",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T07:30:00.000Z",
              "endISO": "2025-10-28T08:00:00.000Z",
              "title": "Betrayal S1 EP 273",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T08:00:00.000Z",
              "endISO": "2025-10-28T08:30:00.000Z",
              "title": "Secrets S1 EP 53",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T08:30:00.000Z",
              "endISO": "2025-10-28T09:00:00.000Z",
              "title": "Taxi S1 EP 53",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T10:00:00.000Z",
              "endISO": "2025-10-28T10:30:00.000Z",
              "title": "King of Hearts S1 Ep122",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T11:00:00.000Z",
              "endISO": "2025-10-28T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep58",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T12:00:00.000Z",
              "endISO": "2025-10-28T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T13:00:00.000Z",
              "endISO": "2025-10-28T13:30:00.000Z",
              "title": "Secrets S1 EP 53",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-29",
          "slots": [
            {
              "startISO": "2025-10-29T05:00:00.000Z",
              "endISO": "2025-10-29T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 281",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T05:30:00.000Z",
              "endISO": "2025-10-29T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP76",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T06:30:00.000Z",
              "endISO": "2025-10-29T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 60",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T07:30:00.000Z",
              "endISO": "2025-10-29T08:00:00.000Z",
              "title": "Betrayal S1 EP 274",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T08:00:00.000Z",
              "endISO": "2025-10-29T08:30:00.000Z",
              "title": "Secrets S1 EP 54",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T08:30:00.000Z",
              "endISO": "2025-10-29T09:00:00.000Z",
              "title": "Taxi S1 EP 54",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T10:00:00.000Z",
              "endISO": "2025-10-29T10:30:00.000Z",
              "title": "King of Hearts S1 Ep123",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T11:00:00.000Z",
              "endISO": "2025-10-29T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep59",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T12:00:00.000Z",
              "endISO": "2025-10-29T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP76",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T13:00:00.000Z",
              "endISO": "2025-10-29T13:30:00.000Z",
              "title": "Secrets S1 EP 54",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-30",
          "slots": [
            {
              "startISO": "2025-10-30T05:00:00.000Z",
              "endISO": "2025-10-30T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 282",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T05:30:00.000Z",
              "endISO": "2025-10-30T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP77",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T06:30:00.000Z",
              "endISO": "2025-10-30T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T07:30:00.000Z",
              "endISO": "2025-10-30T08:00:00.000Z",
              "title": "Betrayal S1 EP 275",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T08:00:00.000Z",
              "endISO": "2025-10-30T08:30:00.000Z",
              "title": "Secrets S1 EP 55",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T08:30:00.000Z",
              "endISO": "2025-10-30T09:00:00.000Z",
              "title": "Taxi S1 EP 55",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T10:00:00.000Z",
              "endISO": "2025-10-30T10:30:00.000Z",
              "title": "King of Hearts S1 Ep124",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T11:00:00.000Z",
              "endISO": "2025-10-30T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep60",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T12:00:00.000Z",
              "endISO": "2025-10-30T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP77",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T13:00:00.000Z",
              "endISO": "2025-10-30T13:30:00.000Z",
              "title": "Secrets S1 EP 55",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-31",
          "slots": [
            {
              "startISO": "2025-10-31T05:00:00.000Z",
              "endISO": "2025-10-31T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 283",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T05:30:00.000Z",
              "endISO": "2025-10-31T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP78",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T06:30:00.000Z",
              "endISO": "2025-10-31T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T07:30:00.000Z",
              "endISO": "2025-10-31T08:00:00.000Z",
              "title": "Betrayal S1 EP 276",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T08:00:00.000Z",
              "endISO": "2025-10-31T08:30:00.000Z",
              "title": "Secrets S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T08:30:00.000Z",
              "endISO": "2025-10-31T09:00:00.000Z",
              "title": "Taxi S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T10:00:00.000Z",
              "endISO": "2025-10-31T10:30:00.000Z",
              "title": "King of Hearts S1 Ep125",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T11:00:00.000Z",
              "endISO": "2025-10-31T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T12:00:00.000Z",
              "endISO": "2025-10-31T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP78",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T13:00:00.000Z",
              "endISO": "2025-10-31T13:30:00.000Z",
              "title": "Secrets S1 EP 56",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-11-01",
          "slots": [
            {
              "startISO": "2025-11-01T05:00:00.000Z",
              "endISO": "2025-11-01T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 284",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T05:30:00.000Z",
              "endISO": "2025-11-01T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP79",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T06:30:00.000Z",
              "endISO": "2025-11-01T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 63",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T07:30:00.000Z",
              "endISO": "2025-11-01T08:00:00.000Z",
              "title": "Betrayal S1 EP 277",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T08:00:00.000Z",
              "endISO": "2025-11-01T08:30:00.000Z",
              "title": "Secrets S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T08:30:00.000Z",
              "endISO": "2025-11-01T09:00:00.000Z",
              "title": "Taxi S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T10:00:00.000Z",
              "endISO": "2025-11-01T10:30:00.000Z",
              "title": "King of Hearts S1 Ep126",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T11:00:00.000Z",
              "endISO": "2025-11-01T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep62",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T12:00:00.000Z",
              "endISO": "2025-11-01T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP79",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T13:00:00.000Z",
              "endISO": "2025-11-01T13:30:00.000Z",
              "title": "Secrets S1 EP 57",
              "durationMin": 30
            }
          ]
        }
      ]
    }
  ]
};

// Simplified types for Framer
interface TVGuideProps {
  hourWidthPx?: number;
  rowHeightPx?: number;
  startHour?: number;
  endHour?: number;
  pageBg?: string;
  cardBg?: string;
  cardText?: string;
  activeRegionBg?: string;
  focusOutline?: string;
  highContrast?: boolean;
  fontFamily?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
}

export default function TVGuideZeeWorld(props: TVGuideProps) {
  const [currentTimezone, setCurrentTimezone] = useState("CAT");

  // Get current region data
  const currentRegionData = zeeWorldData.regions[0]; // SA region
  const availableTimezones = currentRegionData?.timezones || [];

  // Generate time ticks
  const timeTicks: Array<{ hour: number; minute: number; label: string; xPosition: number; isMajor: boolean }> = [];
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
          Zee World TV Guide - {currentRegionData?.label}
        </h2>

        {/* Timezone Switcher */}
        {availableTimezones.length > 1 && (
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
addPropertyControls(TVGuideZeeWorld, {
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
