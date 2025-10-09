/**
 * Create Framer-compatible JSON for ROA data
 * Simplified structure that works directly in Framer
 */

const fs = require('fs');

function createFramerCompatibleJSON() {
  console.log(`\n📱 Creating Framer-compatible JSON for ROA data`);
  
  // Simple, flat structure that Framer can handle
  const framerData = {
    "metadata": {
      "channelId": "zee-world-roa",
      "generatedAt": new Date().toISOString(),
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
                "startISO": "2025-10-06T05:00:00",
                "endISO": "2025-10-06T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 149",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T06:00:00",
                "endISO": "2025-10-06T07:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 149",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T06:00:00",
                "endISO": "2025-10-06T07:00:00",
                "title": "Radhe Mohan",
                "season": "S4",
                "episode": "EP 7",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T07:00:00",
                "endISO": "2025-10-06T08:00:00",
                "title": "Radhe Mohan",
                "season": "S4",
                "episode": "EP 7",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T07:00:00",
                "endISO": "2025-10-06T08:00:00",
                "title": "Twist of Fate: New Era",
                "season": "S10",
                "episode": "EP 34",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T08:00:00",
                "endISO": "2025-10-06T09:00:00",
                "title": "Twist of Fate: New Era",
                "season": "S10",
                "episode": "EP 34",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T08:00:00",
                "endISO": "2025-10-06T09:00:00",
                "title": "Hearts Crossed",
                "season": "S1",
                "episode": "Ep 16",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T09:00:00",
                "endISO": "2025-10-06T10:00:00",
                "title": "Hearts Crossed",
                "season": "S1",
                "episode": "Ep 16",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T09:00:00",
                "endISO": "2025-10-06T10:00:00",
                "title": "This Is Fate",
                "season": "S7",
                "episode": "Ep 97",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T10:00:00",
                "endISO": "2025-10-06T11:00:00",
                "title": "This Is Fate",
                "season": "S7",
                "episode": "Ep 97",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-07",
            "slots": [
              {
                "startISO": "2025-10-07T05:00:00",
                "endISO": "2025-10-07T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 150",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T06:00:00",
                "endISO": "2025-10-07T07:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 150",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T06:00:00",
                "endISO": "2025-10-07T07:00:00",
                "title": "Radhe Mohan",
                "season": "S4",
                "episode": "EP 8",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T07:00:00",
                "endISO": "2025-10-07T08:00:00",
                "title": "Radhe Mohan",
                "season": "S4",
                "episode": "EP 8",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-08",
            "slots": [
              {
                "startISO": "2025-10-08T05:00:00",
                "endISO": "2025-10-08T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 151",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-09",
            "slots": [
              {
                "startISO": "2025-10-09T05:00:00",
                "endISO": "2025-10-09T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 152",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-10",
            "slots": [
              {
                "startISO": "2025-10-10T05:00:00",
                "endISO": "2025-10-10T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 153",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-11",
            "slots": [
              {
                "startISO": "2025-10-11T05:00:00",
                "endISO": "2025-10-11T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 154",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          {
            "dateISO": "2025-10-12",
            "slots": [
              {
                "startISO": "2025-10-12T05:00:00",
                "endISO": "2025-10-12T06:00:00",
                "title": "Sister Wives",
                "season": "S1",
                "episode": "Ep 155",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          }
        ]
      }
    ]
  };
  
  // Save to file
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/roa-guide-framer-ready.json';
  fs.writeFileSync(outputPath, JSON.stringify(framerData, null, 2));
  
  console.log(`\n✅ Framer-compatible JSON saved to: ${outputPath}`);
  console.log(`📊 Structure: ${framerData.regions[0].days.length} days with sample slots`);
  
  // Also create a string version for easy copying
  const jsonString = JSON.stringify(framerData, null, 2);
  console.log(`\n📋 JSON String Length: ${jsonString.length} characters`);
  
  return framerData;
}

// Run the creation
createFramerCompatibleJSON();


