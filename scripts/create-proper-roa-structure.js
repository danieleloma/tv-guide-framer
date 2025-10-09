/**
 * Create proper ROA data structure for Framer component
 * Fixes all the issues: timezone separation, day structure, time alignment, 24-hour cycle
 */

const fs = require('fs');

function createProperROAStructure() {
  console.log(`\n🔧 Creating proper ROA data structure with timezone separation`);
  
  // Create separate day structures for WAT and CAT timezones
  const roaData = {
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
          // Monday 2025-10-06 - WAT (5:00 AM - 4:00 AM next day)
          {
            "dateISO": "2025-10-06",
            "timezone": "WAT",
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
                "title": "Kel...",
                "season": "S3",
                "episode": "E...",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T11:00:00",
                "endISO": "2025-10-06T12:00:00",
                "title": "Show 7",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T12:00:00",
                "endISO": "2025-10-06T13:00:00",
                "title": "Show 8",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T13:00:00",
                "endISO": "2025-10-06T14:00:00",
                "title": "Show 9",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T14:00:00",
                "endISO": "2025-10-06T15:00:00",
                "title": "Show 10",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T15:00:00",
                "endISO": "2025-10-06T16:00:00",
                "title": "Show 11",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T16:00:00",
                "endISO": "2025-10-06T17:00:00",
                "title": "Show 12",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T17:00:00",
                "endISO": "2025-10-06T18:00:00",
                "title": "Show 13",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T18:00:00",
                "endISO": "2025-10-06T19:00:00",
                "title": "Show 14",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T19:00:00",
                "endISO": "2025-10-06T20:00:00",
                "title": "Show 15",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T20:00:00",
                "endISO": "2025-10-06T21:00:00",
                "title": "Show 16",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T21:00:00",
                "endISO": "2025-10-06T22:00:00",
                "title": "Show 17",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T22:00:00",
                "endISO": "2025-10-06T23:00:00",
                "title": "Show 18",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T23:00:00",
                "endISO": "2025-10-07T00:00:00",
                "title": "Show 19",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T00:00:00",
                "endISO": "2025-10-07T01:00:00",
                "title": "Show 20",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T01:00:00",
                "endISO": "2025-10-07T02:00:00",
                "title": "Show 21",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T02:00:00",
                "endISO": "2025-10-07T03:00:00",
                "title": "Show 22",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T03:00:00",
                "endISO": "2025-10-07T04:00:00",
                "title": "Show 23",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          // Monday 2025-10-06 - CAT (6:00 AM - 5:00 AM next day)
          {
            "dateISO": "2025-10-06",
            "timezone": "CAT",
            "slots": [
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
                "startISO": "2025-10-06T10:00:00",
                "endISO": "2025-10-06T11:00:00",
                "title": "This Is Fate",
                "season": "S7",
                "episode": "Ep 97",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T11:00:00",
                "endISO": "2025-10-06T12:00:00",
                "title": "Kel...",
                "season": "S3",
                "episode": "E...",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T12:00:00",
                "endISO": "2025-10-06T13:00:00",
                "title": "Show 7",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T13:00:00",
                "endISO": "2025-10-06T14:00:00",
                "title": "Show 8",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T14:00:00",
                "endISO": "2025-10-06T15:00:00",
                "title": "Show 9",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T15:00:00",
                "endISO": "2025-10-06T16:00:00",
                "title": "Show 10",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T16:00:00",
                "endISO": "2025-10-06T17:00:00",
                "title": "Show 11",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T17:00:00",
                "endISO": "2025-10-06T18:00:00",
                "title": "Show 12",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T18:00:00",
                "endISO": "2025-10-06T19:00:00",
                "title": "Show 13",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T19:00:00",
                "endISO": "2025-10-06T20:00:00",
                "title": "Show 14",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T20:00:00",
                "endISO": "2025-10-06T21:00:00",
                "title": "Show 15",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T21:00:00",
                "endISO": "2025-10-06T22:00:00",
                "title": "Show 16",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T22:00:00",
                "endISO": "2025-10-06T23:00:00",
                "title": "Show 17",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-06T23:00:00",
                "endISO": "2025-10-07T00:00:00",
                "title": "Show 18",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T00:00:00",
                "endISO": "2025-10-07T01:00:00",
                "title": "Show 19",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T01:00:00",
                "endISO": "2025-10-07T02:00:00",
                "title": "Show 20",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T02:00:00",
                "endISO": "2025-10-07T03:00:00",
                "title": "Show 21",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T03:00:00",
                "endISO": "2025-10-07T04:00:00",
                "title": "Show 22",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              },
              {
                "startISO": "2025-10-07T04:00:00",
                "endISO": "2025-10-07T05:00:00",
                "title": "Show 23",
                "season": "S1",
                "episode": "Ep 1",
                "subtitle": "",
                "textColor": "#FFFFFF",
                "bgColor": "#1A1A1A",
                "durationMin": 60
              }
            ]
          },
          // Tuesday 2025-10-07 - WAT
          {
            "dateISO": "2025-10-07",
            "timezone": "WAT",
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
          // Tuesday 2025-10-07 - CAT
          {
            "dateISO": "2025-10-07",
            "timezone": "CAT",
            "slots": [
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
          // Wednesday 2025-10-08 - WAT
          {
            "dateISO": "2025-10-08",
            "timezone": "WAT",
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
          // Wednesday 2025-10-08 - CAT
          {
            "dateISO": "2025-10-08",
            "timezone": "CAT",
            "slots": [
              {
                "startISO": "2025-10-08T06:00:00",
                "endISO": "2025-10-08T07:00:00",
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
          // Thursday 2025-10-09 - WAT
          {
            "dateISO": "2025-10-09",
            "timezone": "WAT",
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
          // Thursday 2025-10-09 - CAT
          {
            "dateISO": "2025-10-09",
            "timezone": "CAT",
            "slots": [
              {
                "startISO": "2025-10-09T06:00:00",
                "endISO": "2025-10-09T07:00:00",
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
          // Friday 2025-10-10 - WAT
          {
            "dateISO": "2025-10-10",
            "timezone": "WAT",
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
          // Friday 2025-10-10 - CAT
          {
            "dateISO": "2025-10-10",
            "timezone": "CAT",
            "slots": [
              {
                "startISO": "2025-10-10T06:00:00",
                "endISO": "2025-10-10T07:00:00",
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
          // Saturday 2025-10-11 - WAT
          {
            "dateISO": "2025-10-11",
            "timezone": "WAT",
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
          // Saturday 2025-10-11 - CAT
          {
            "dateISO": "2025-10-11",
            "timezone": "CAT",
            "slots": [
              {
                "startISO": "2025-10-11T06:00:00",
                "endISO": "2025-10-11T07:00:00",
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
          // Sunday 2025-10-12 - WAT
          {
            "dateISO": "2025-10-12",
            "timezone": "WAT",
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
          },
          // Sunday 2025-10-12 - CAT
          {
            "dateISO": "2025-10-12",
            "timezone": "CAT",
            "slots": [
              {
                "startISO": "2025-10-12T06:00:00",
                "endISO": "2025-10-12T07:00:00",
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
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/roa-guide-fixed-structure.json';
  fs.writeFileSync(outputPath, JSON.stringify(roaData, null, 2));
  
  console.log(`\n✅ Fixed ROA data structure saved to: ${outputPath}`);
  console.log(`📊 Structure: ${roaData.regions[0].days.length} day-timezone combinations`);
  console.log(`📊 WAT days: ${roaData.regions[0].days.filter(d => d.timezone === 'WAT').length}`);
  console.log(`📊 CAT days: ${roaData.regions[0].days.filter(d => d.timezone === 'CAT').length}`);
  
  // Calculate total slots
  const totalSlots = roaData.regions[0].days.reduce((sum, day) => sum + day.slots.length, 0);
  console.log(`📊 Total slots: ${totalSlots}`);
  
  return roaData;
}

// Run the creation
createProperROAStructure();


