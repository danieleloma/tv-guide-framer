/**
 * TV Guide Component for ROA (Rest of Africa) - Complete Version
 * 
 * This component ensures all 7 days (Monday to Sunday) are displayed horizontally
 * and uses the converted ROA JSON data with local time (no UTC conversion)
 */

import React, { useState, useEffect } from 'react';

// ROA Data (converted from Excel with local time)
const roaData = {
  "metadata": {
    "channelId": "zee-world-roa",
    "generatedAt": "2025-10-07T20:20:54.991Z",
    "defaultRegion": "ROA",
    "defaultTimezone": "WAT"
  },
  "regions": [
    {
      "code": "ROA",
      "label": "Rest of Africa",
      "timezones": ["WAT", "CAT"],
      "days": [
        {
          "dateISO": "2025-10-06",
          "slots": [
            {
              "startISO": "2025-10-06T00:00:00",
              "endISO": "2025-10-06T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 9",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T00:00:00",
              "endISO": "2025-10-06T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 151",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T01:00:00",
              "endISO": "2025-10-06T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 36",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T01:00:00",
              "endISO": "2025-10-06T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 9",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T02:00:00",
              "endISO": "2025-10-06T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 36",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T02:00:00",
              "endISO": "2025-10-06T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 18",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T03:00:00",
              "endISO": "2025-10-06T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 18",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T03:00:00",
              "endISO": "2025-10-06T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 99",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T04:00:00",
              "endISO": "2025-10-06T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 99",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-06T04:00:00",
              "endISO": "2025-10-06T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 65",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-07",
          "slots": [
            {
              "startISO": "2025-10-07T00:00:00",
              "endISO": "2025-10-07T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 10",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T00:00:00",
              "endISO": "2025-10-07T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 152",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T01:00:00",
              "endISO": "2025-10-07T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 37",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T01:00:00",
              "endISO": "2025-10-07T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 10",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T02:00:00",
              "endISO": "2025-10-07T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 37",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T02:00:00",
              "endISO": "2025-10-07T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 19",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T03:00:00",
              "endISO": "2025-10-07T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 19",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T03:00:00",
              "endISO": "2025-10-07T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 100",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T04:00:00",
              "endISO": "2025-10-07T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 100",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-07T04:00:00",
              "endISO": "2025-10-07T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 66",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-08",
          "slots": [
            {
              "startISO": "2025-10-08T00:00:00",
              "endISO": "2025-10-08T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 11",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T00:00:00",
              "endISO": "2025-10-08T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 153",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T01:00:00",
              "endISO": "2025-10-08T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 38",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T01:00:00",
              "endISO": "2025-10-08T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 11",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T02:00:00",
              "endISO": "2025-10-08T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 38",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T02:00:00",
              "endISO": "2025-10-08T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 20",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T03:00:00",
              "endISO": "2025-10-08T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 20",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T03:00:00",
              "endISO": "2025-10-08T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 101",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T04:00:00",
              "endISO": "2025-10-08T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 101",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-08T04:00:00",
              "endISO": "2025-10-08T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 67",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-09",
          "slots": [
            {
              "startISO": "2025-10-09T00:00:00",
              "endISO": "2025-10-09T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 12",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T00:00:00",
              "endISO": "2025-10-09T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 154",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T01:00:00",
              "endISO": "2025-10-09T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 39",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T01:00:00",
              "endISO": "2025-10-09T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 12",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T02:00:00",
              "endISO": "2025-10-09T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 39",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T02:00:00",
              "endISO": "2025-10-09T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 21",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T03:00:00",
              "endISO": "2025-10-09T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 21",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T03:00:00",
              "endISO": "2025-10-09T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 102",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T04:00:00",
              "endISO": "2025-10-09T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 102",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-09T04:00:00",
              "endISO": "2025-10-09T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 68",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-10",
          "slots": [
            {
              "startISO": "2025-10-10T00:00:00",
              "endISO": "2025-10-10T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 13",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T00:00:00",
              "endISO": "2025-10-10T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 155",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T01:00:00",
              "endISO": "2025-10-10T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 39",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T01:00:00",
              "endISO": "2025-10-10T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 13",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T02:00:00",
              "endISO": "2025-10-10T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 39",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T02:00:00",
              "endISO": "2025-10-10T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 22",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T03:00:00",
              "endISO": "2025-10-10T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 22",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T03:00:00",
              "endISO": "2025-10-10T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 103",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T04:00:00",
              "endISO": "2025-10-10T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 103",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-10T04:00:00",
              "endISO": "2025-10-10T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 69",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-11",
          "slots": [
            {
              "startISO": "2025-10-11T00:00:00",
              "endISO": "2025-10-11T01:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 14",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T00:00:00",
              "endISO": "2025-10-11T01:00:00",
              "title": "Sister Wives",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 156",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T01:00:00",
              "endISO": "2025-10-11T02:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 40",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T01:00:00",
              "endISO": "2025-10-11T02:00:00",
              "title": "Radhe Mohan",
              "durationMin": 30,
              "season": "S4",
              "episode": "EP 14",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T02:00:00",
              "endISO": "2025-10-11T03:00:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 30,
              "season": "S10",
              "episode": "EP 40",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T02:00:00",
              "endISO": "2025-10-11T03:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 23",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T03:00:00",
              "endISO": "2025-10-11T04:00:00",
              "title": "Hearts Crossed",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 23",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T03:00:00",
              "endISO": "2025-10-11T04:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 104",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T04:00:00",
              "endISO": "2025-10-11T05:00:00",
              "title": "This Is Fate",
              "durationMin": 30,
              "season": "S7",
              "episode": "EP 104",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            },
            {
              "startISO": "2025-10-11T04:00:00",
              "endISO": "2025-10-11T05:00:00",
              "title": "Hidden Intentions",
              "durationMin": 30,
              "season": "S1",
              "episode": "EP 70",
              "textColor": "#FFFFFF",
              "bgColor": "#1A1A1A"
            }
          ]
        },
        {
          "dateISO": "2025-10-12",
          "slots": []
        }
      ]
    }
  ]
};

// Helper function to format time
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Helper function to format date
function formatDate(dateISO) {
  const date = new Date(dateISO);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Helper function to get time from ISO string
function getTimeFromISO(isoString) {
  return isoString.split('T')[1].split(':').slice(0, 2).join(':');
}

// Helper function to calculate slot position and width
function calculateSlotPosition(slot, dayStartTime = '00:00', slotWidth = 60) {
  const startTime = getTimeFromISO(slot.startISO);
  const endTime = getTimeFromISO(slot.endISO);
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const [dayStartHour, dayStartMin] = dayStartTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const dayStartMinutes = dayStartHour * 60 + dayStartMin;
  
  const left = ((startMinutes - dayStartMinutes) / 30) * slotWidth;
  const width = ((endMinutes - startMinutes) / 30) * slotWidth;
  
  return { left, width };
}

export default function TVGuideROAComplete() {
  const [selectedTimezone, setSelectedTimezone] = useState('WAT');
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const currentRegion = roaData.regions[0];
  const currentDays = currentRegion.days;
  
  // Generate time ticks for the day (00:00 to 23:30 in 30-minute intervals)
  const timeTicks = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      timeTicks.push({
        time: timeString,
        displayTime: formatTime(timeString),
        isMajor: min === 0
      });
    }
  }
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #333',
        backgroundColor: '#1a1a1a'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Zee World TV Guide - ROA
        </h1>
        
        {/* Timezone Switcher */}
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>Timezone:</label>
          <select 
            value={selectedTimezone} 
            onChange={(e) => setSelectedTimezone(e.target.value)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px'
            }}
          >
            <option value="WAT">WAT (West Africa Time)</option>
            <option value="CAT">CAT (Central Africa Time)</option>
          </select>
        </div>
      </div>
      
      {/* TV Guide Content */}
      <div style={{
        display: 'flex',
        height: 'calc(100% - 100px)',
        overflow: 'auto'
      }}>
        {/* Time Column */}
        <div style={{
          width: '80px',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
          position: 'sticky',
          left: 0,
          zIndex: 10
        }}>
          {/* Time Header */}
          <div style={{
            height: '60px',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2a2a2a',
            fontWeight: 'bold'
          }}>
            Time
          </div>
          
          {/* Time Ticks */}
          {timeTicks.map((tick, index) => (
            <div
              key={index}
              style={{
                height: '30px',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: tick.isMajor ? '12px' : '10px',
                color: tick.isMajor ? '#fff' : '#888',
                fontWeight: tick.isMajor ? 'bold' : 'normal'
              }}
            >
              {tick.isMajor ? tick.displayTime : ''}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div style={{
          display: 'flex',
          minWidth: 'max-content',
          flex: 1
        }}>
          {currentDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              style={{
                width: '200px',
                minWidth: '200px',
                borderRight: '1px solid #333',
                position: 'relative'
              }}
            >
              {/* Day Header */}
              <div style={{
                height: '60px',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2a2a2a',
                fontWeight: 'bold',
                position: 'sticky',
                top: 0,
                zIndex: 5
              }}>
                {formatDate(day.dateISO)}
              </div>
              
              {/* Program Grid */}
              <div style={{
                position: 'relative',
                height: `${timeTicks.length * 30}px`
              }}>
                {/* Grid Lines */}
                {timeTicks.map((tick, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      top: `${index * 30}px`,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: '#333',
                      zIndex: 1
                    }}
                  />
                ))}
                
                {/* Show Slots */}
                {day.slots.map((slot, slotIndex) => {
                  const { left, width } = calculateSlotPosition(slot, '00:00', 200);
                  
                  return (
                    <div
                      key={slotIndex}
                      style={{
                        position: 'absolute',
                        top: `${left}px`,
                        left: '2px',
                        width: `${Math.max(60, width - 4)}px`,
                        height: '28px',
                        backgroundColor: slot.bgColor || '#1a1a1a',
                        color: slot.textColor || '#ffffff',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '10px',
                        overflow: 'hidden',
                        zIndex: 10,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                      title={`${slot.title} - ${formatTime(getTimeFromISO(slot.startISO))} to ${formatTime(getTimeFromISO(slot.endISO))}`}
                    >
                      <div style={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {slot.title}
                      </div>
                      {(slot.season || slot.episode) && (
                        <div style={{
                          fontSize: '8px',
                          color: '#ccc',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {slot.season} {slot.episode}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


