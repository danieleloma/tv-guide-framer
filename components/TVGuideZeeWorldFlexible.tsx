/**
 * Zee World TV Guide - Flexible Component with Real Data
 * 
 * This component includes your actual Zee World data and demonstrates
 * the flexible TV Guide system for multi-region channels.
 */

import React, { useState, useEffect, useMemo } from 'react';
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
            },
            {
              "startISO": "2025-10-26T13:30:00.000Z",
              "endISO": "2025-10-26T14:00:00.000Z",
              "title": "Taxi S1 EP 51",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T14:00:00.000Z",
              "endISO": "2025-10-26T14:30:00.000Z",
              "title": "King of Hearts S1 Ep121",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T15:00:00.000Z",
              "endISO": "2025-10-26T15:30:00.000Z",
              "title": "Mehek S2 Ep57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T16:00:00.000Z",
              "endISO": "2025-10-26T16:30:00.000Z",
              "title": "Married Again S1 Ep10",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T17:00:00.000Z",
              "endISO": "2025-10-26T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 279",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T17:30:00.000Z",
              "endISO": "2025-10-26T18:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T18:30:00.000Z",
              "endISO": "2025-10-26T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP74",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T19:30:00.000Z",
              "endISO": "2025-10-26T20:00:00.000Z",
              "title": "Secrets S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T20:00:00.000Z",
              "endISO": "2025-10-26T20:30:00.000Z",
              "title": "Taxi S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T20:30:00.000Z",
              "endISO": "2025-10-26T21:00:00.000Z",
              "title": "Betrayal S1 EP 272",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T22:00:00.000Z",
              "endISO": "2025-10-26T22:30:00.000Z",
              "title": "King of Hearts S1 Ep121",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T23:00:00.000Z",
              "endISO": "2025-10-26T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 279",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T23:30:00.000Z",
              "endISO": "2025-10-27T00:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep57",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-27",
          "slots": [
            {
              "startISO": "2025-10-27T00:30:00.000Z",
              "endISO": "2025-10-27T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP74",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T01:30:00.000Z",
              "endISO": "2025-10-27T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 58",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T02:30:00.000Z",
              "endISO": "2025-10-27T03:00:00.000Z",
              "title": "Betrayal S1 EP 272",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T03:00:00.000Z",
              "endISO": "2025-10-27T03:30:00.000Z",
              "title": "Secrets S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T03:30:00.000Z",
              "endISO": "2025-10-27T04:00:00.000Z",
              "title": "Taxi S1 EP 52",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T04:00:00.000Z",
              "endISO": "2025-10-27T04:30:00.000Z",
              "title": "Married Again S1 Ep10",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T05:00:00.000Z",
              "endISO": "2025-10-27T05:30:00.000Z",
              "title": "Mehek S2 Ep57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T05:00:00.000Z",
              "endISO": "2025-10-27T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 283",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T05:30:00.000Z",
              "endISO": "2025-10-27T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP78",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T06:30:00.000Z",
              "endISO": "2025-10-27T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T07:30:00.000Z",
              "endISO": "2025-10-27T08:00:00.000Z",
              "title": "Betrayal S1 EP 276",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T08:00:00.000Z",
              "endISO": "2025-10-27T08:30:00.000Z",
              "title": "Secrets S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T08:30:00.000Z",
              "endISO": "2025-10-27T09:00:00.000Z",
              "title": "Taxi S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T10:00:00.000Z",
              "endISO": "2025-10-27T10:30:00.000Z",
              "title": "King of Hearts S1 Ep125",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T11:00:00.000Z",
              "endISO": "2025-10-27T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T12:00:00.000Z",
              "endISO": "2025-10-27T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP78",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T13:00:00.000Z",
              "endISO": "2025-10-27T13:30:00.000Z",
              "title": "Secrets S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T13:30:00.000Z",
              "endISO": "2025-10-27T14:00:00.000Z",
              "title": "Taxi S1 EP 56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T14:00:00.000Z",
              "endISO": "2025-10-27T14:30:00.000Z",
              "title": "King of Hearts S1 Ep126",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T15:00:00.000Z",
              "endISO": "2025-10-27T15:30:00.000Z",
              "title": "Mehek S2 Ep62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T16:00:00.000Z",
              "endISO": "2025-10-27T16:30:00.000Z",
              "title": "Married Again S1 Ep15",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T17:00:00.000Z",
              "endISO": "2025-10-27T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 284",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T17:30:00.000Z",
              "endISO": "2025-10-27T18:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T18:30:00.000Z",
              "endISO": "2025-10-27T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP79",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T19:30:00.000Z",
              "endISO": "2025-10-27T20:00:00.000Z",
              "title": "Secrets S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T20:00:00.000Z",
              "endISO": "2025-10-27T20:30:00.000Z",
              "title": "Taxi S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T20:30:00.000Z",
              "endISO": "2025-10-27T21:00:00.000Z",
              "title": "Betrayal S1 EP 277",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T22:00:00.000Z",
              "endISO": "2025-10-27T22:30:00.000Z",
              "title": "King of Hearts S1 Ep126",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T23:00:00.000Z",
              "endISO": "2025-10-27T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 284",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-27T23:30:00.000Z",
              "endISO": "2025-10-28T00:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep62",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-28",
          "slots": [
            {
              "startISO": "2025-10-28T00:30:00.000Z",
              "endISO": "2025-10-28T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP79",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T01:30:00.000Z",
              "endISO": "2025-10-28T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 63",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T02:30:00.000Z",
              "endISO": "2025-10-28T03:00:00.000Z",
              "title": "Betrayal S1 EP 277",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T03:00:00.000Z",
              "endISO": "2025-10-28T03:30:00.000Z",
              "title": "Secrets S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T03:30:00.000Z",
              "endISO": "2025-10-28T04:00:00.000Z",
              "title": "Taxi S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T04:00:00.000Z",
              "endISO": "2025-10-28T04:30:00.000Z",
              "title": "Married Again S1 Ep15",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T05:00:00.000Z",
              "endISO": "2025-10-28T05:30:00.000Z",
              "title": "Mehek S2 Ep62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T05:00:00.000Z",
              "endISO": "2025-10-28T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 288",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T05:30:00.000Z",
              "endISO": "2025-10-28T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP83",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T06:30:00.000Z",
              "endISO": "2025-10-28T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T07:30:00.000Z",
              "endISO": "2025-10-28T08:00:00.000Z",
              "title": "Betrayal S1 EP 281",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T08:00:00.000Z",
              "endISO": "2025-10-28T08:30:00.000Z",
              "title": "Secrets S1 EP 61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T08:30:00.000Z",
              "endISO": "2025-10-28T09:00:00.000Z",
              "title": "Taxi S1 EP 61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T10:00:00.000Z",
              "endISO": "2025-10-28T10:30:00.000Z",
              "title": "King of Hearts S1 Ep130",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T11:00:00.000Z",
              "endISO": "2025-10-28T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep66",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T12:00:00.000Z",
              "endISO": "2025-10-28T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP83",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T13:00:00.000Z",
              "endISO": "2025-10-28T13:30:00.000Z",
              "title": "Secrets S1 EP 61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T13:30:00.000Z",
              "endISO": "2025-10-28T14:00:00.000Z",
              "title": "Taxi S1 EP 61",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T14:00:00.000Z",
              "endISO": "2025-10-28T14:30:00.000Z",
              "title": "King of Hearts S1 Ep131",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T15:00:00.000Z",
              "endISO": "2025-10-28T15:30:00.000Z",
              "title": "Mehek S2 Ep67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T16:00:00.000Z",
              "endISO": "2025-10-28T16:30:00.000Z",
              "title": "Married Again S1 Ep20",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T17:00:00.000Z",
              "endISO": "2025-10-28T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 289",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T17:30:00.000Z",
              "endISO": "2025-10-28T18:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T18:30:00.000Z",
              "endISO": "2025-10-28T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP84",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T19:30:00.000Z",
              "endISO": "2025-10-28T20:00:00.000Z",
              "title": "Secrets S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T20:00:00.000Z",
              "endISO": "2025-10-28T20:30:00.000Z",
              "title": "Taxi S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T20:30:00.000Z",
              "endISO": "2025-10-28T21:00:00.000Z",
              "title": "Betrayal S1 EP 282",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T22:00:00.000Z",
              "endISO": "2025-10-28T22:30:00.000Z",
              "title": "King of Hearts S1 Ep131",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T23:00:00.000Z",
              "endISO": "2025-10-28T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 289",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-28T23:30:00.000Z",
              "endISO": "2025-10-29T00:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep67",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-29",
          "slots": [
            {
              "startISO": "2025-10-29T00:30:00.000Z",
              "endISO": "2025-10-29T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP84",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T01:30:00.000Z",
              "endISO": "2025-10-29T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 68",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T02:30:00.000Z",
              "endISO": "2025-10-29T03:00:00.000Z",
              "title": "Betrayal S1 EP 282",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T03:00:00.000Z",
              "endISO": "2025-10-29T03:30:00.000Z",
              "title": "Secrets S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T03:30:00.000Z",
              "endISO": "2025-10-29T04:00:00.000Z",
              "title": "Taxi S1 EP 62",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T04:00:00.000Z",
              "endISO": "2025-10-29T04:30:00.000Z",
              "title": "Married Again S1 Ep20",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T05:00:00.000Z",
              "endISO": "2025-10-29T05:30:00.000Z",
              "title": "Mehek S2 Ep67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T05:00:00.000Z",
              "endISO": "2025-10-29T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 293",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T05:30:00.000Z",
              "endISO": "2025-10-29T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP88",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T06:30:00.000Z",
              "endISO": "2025-10-29T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T07:30:00.000Z",
              "endISO": "2025-10-29T08:00:00.000Z",
              "title": "Betrayal S1 EP 286",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T08:00:00.000Z",
              "endISO": "2025-10-29T08:30:00.000Z",
              "title": "Secrets S1 EP 66",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T08:30:00.000Z",
              "endISO": "2025-10-29T09:00:00.000Z",
              "title": "Taxi S1 EP 66",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T10:00:00.000Z",
              "endISO": "2025-10-29T10:30:00.000Z",
              "title": "King of Hearts S1 Ep135",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T11:00:00.000Z",
              "endISO": "2025-10-29T11:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep71",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T12:00:00.000Z",
              "endISO": "2025-10-29T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP88",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T13:00:00.000Z",
              "endISO": "2025-10-29T13:30:00.000Z",
              "title": "Secrets S1 EP 66",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T13:30:00.000Z",
              "endISO": "2025-10-29T14:00:00.000Z",
              "title": "Taxi S1 EP 66",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T14:00:00.000Z",
              "endISO": "2025-10-29T14:30:00.000Z",
              "title": "King of Hearts S1 Ep136",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T15:00:00.000Z",
              "endISO": "2025-10-29T15:30:00.000Z",
              "title": "Mehek S2 Ep72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T16:00:00.000Z",
              "endISO": "2025-10-29T16:30:00.000Z",
              "title": "Married Again S1 Ep25",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T17:00:00.000Z",
              "endISO": "2025-10-29T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 294",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T17:30:00.000Z",
              "endISO": "2025-10-29T18:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T18:30:00.000Z",
              "endISO": "2025-10-29T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP89",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T19:30:00.000Z",
              "endISO": "2025-10-29T20:00:00.000Z",
              "title": "Secrets S1 EP 67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T20:00:00.000Z",
              "endISO": "2025-10-29T20:30:00.000Z",
              "title": "Taxi S1 EP 67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T20:30:00.000Z",
              "endISO": "2025-10-29T21:00:00.000Z",
              "title": "Betrayal S1 EP 287",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T22:00:00.000Z",
              "endISO": "2025-10-29T22:30:00.000Z",
              "title": "King of Hearts S1 Ep136",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T23:00:00.000Z",
              "endISO": "2025-10-29T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 294",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-29T23:30:00.000Z",
              "endISO": "2025-10-30T00:00:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep72",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-30",
          "slots": [
            {
              "startISO": "2025-10-30T00:30:00.000Z",
              "endISO": "2025-10-30T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP89",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T01:30:00.000Z",
              "endISO": "2025-10-30T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 73",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T02:30:00.000Z",
              "endISO": "2025-10-30T03:00:00.000Z",
              "title": "Betrayal S1 EP 287",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T03:00:00.000Z",
              "endISO": "2025-10-30T03:30:00.000Z",
              "title": "Secrets S1 EP 67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T03:30:00.000Z",
              "endISO": "2025-10-30T04:00:00.000Z",
              "title": "Taxi S1 EP 67",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T04:00:00.000Z",
              "endISO": "2025-10-30T04:30:00.000Z",
              "title": "Married Again S1 Ep25",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T05:00:00.000Z",
              "endISO": "2025-10-30T05:30:00.000Z",
              "title": "Mehek S2 Ep72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T05:00:00.000Z",
              "endISO": "2025-10-30T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 298",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T05:30:00.000Z",
              "endISO": "2025-10-30T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP93",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T06:30:00.000Z",
              "endISO": "2025-10-30T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 77",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T07:30:00.000Z",
              "endISO": "2025-10-30T08:00:00.000Z",
              "title": "Betrayal S1 EP 291",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T08:00:00.000Z",
              "endISO": "2025-10-30T08:30:00.000Z",
              "title": "Secrets S1 EP 71",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T08:30:00.000Z",
              "endISO": "2025-10-30T09:00:00.000Z",
              "title": "Taxi S1 EP 71",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T10:00:00.000Z",
              "endISO": "2025-10-30T10:30:00.000Z",
              "title": "King of Hearts S1 Ep140",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T11:00:00.000Z",
              "endISO": "2025-10-30T11:30:00.000Z",
              "title": "Jagriti Empowered S1 Ep3",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T12:00:00.000Z",
              "endISO": "2025-10-30T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP93",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T13:00:00.000Z",
              "endISO": "2025-10-30T13:30:00.000Z",
              "title": "Secrets S1 EP 71",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T13:30:00.000Z",
              "endISO": "2025-10-30T14:00:00.000Z",
              "title": "Taxi S1 EP 71",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T14:00:00.000Z",
              "endISO": "2025-10-30T14:30:00.000Z",
              "title": "King of Hearts S1 Ep141",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T15:00:00.000Z",
              "endISO": "2025-10-30T15:30:00.000Z",
              "title": "Mehek S2 Ep77",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T16:00:00.000Z",
              "endISO": "2025-10-30T16:30:00.000Z",
              "title": "Married Again S1 Ep30",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T17:00:00.000Z",
              "endISO": "2025-10-30T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 299",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T17:30:00.000Z",
              "endISO": "2025-10-30T18:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep4",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T18:30:00.000Z",
              "endISO": "2025-10-30T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP94",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T19:30:00.000Z",
              "endISO": "2025-10-30T20:00:00.000Z",
              "title": "Secrets S1 EP 72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T20:00:00.000Z",
              "endISO": "2025-10-30T20:30:00.000Z",
              "title": "Taxi S1 EP 72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T20:30:00.000Z",
              "endISO": "2025-10-30T21:00:00.000Z",
              "title": "Betrayal S1 EP 292",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T22:00:00.000Z",
              "endISO": "2025-10-30T22:30:00.000Z",
              "title": "King of Hearts S1 Ep141",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T23:00:00.000Z",
              "endISO": "2025-10-30T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 299",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-30T23:30:00.000Z",
              "endISO": "2025-10-31T00:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep4",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-10-31",
          "slots": [
            {
              "startISO": "2025-10-31T00:30:00.000Z",
              "endISO": "2025-10-31T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP94",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T01:30:00.000Z",
              "endISO": "2025-10-31T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 78",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T02:30:00.000Z",
              "endISO": "2025-10-31T03:00:00.000Z",
              "title": "Betrayal S1 EP 292",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T03:00:00.000Z",
              "endISO": "2025-10-31T03:30:00.000Z",
              "title": "Secrets S1 EP 72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T03:30:00.000Z",
              "endISO": "2025-10-31T04:00:00.000Z",
              "title": "Taxi S1 EP 72",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T04:00:00.000Z",
              "endISO": "2025-10-31T04:30:00.000Z",
              "title": "Married Again S1 Ep30",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T05:00:00.000Z",
              "endISO": "2025-10-31T05:30:00.000Z",
              "title": "Mehek S2 Ep77",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T05:00:00.000Z",
              "endISO": "2025-10-31T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 302",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T05:30:00.000Z",
              "endISO": "2025-10-31T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP97",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T06:30:00.000Z",
              "endISO": "2025-10-31T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 81",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T07:30:00.000Z",
              "endISO": "2025-10-31T08:00:00.000Z",
              "title": "Marriage For Duty S1 Ep3",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T08:00:00.000Z",
              "endISO": "2025-10-31T08:30:00.000Z",
              "title": "Secrets S1 EP 75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T08:30:00.000Z",
              "endISO": "2025-10-31T09:00:00.000Z",
              "title": "Taxi S1 EP 75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T10:00:00.000Z",
              "endISO": "2025-10-31T10:30:00.000Z",
              "title": "King of Hearts S1 Ep144",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T11:00:00.000Z",
              "endISO": "2025-10-31T11:30:00.000Z",
              "title": "Jagriti Empowered S1 Ep7",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T12:00:00.000Z",
              "endISO": "2025-10-31T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP97",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T13:00:00.000Z",
              "endISO": "2025-10-31T13:30:00.000Z",
              "title": "Secrets S1 EP 75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T13:30:00.000Z",
              "endISO": "2025-10-31T14:00:00.000Z",
              "title": "Taxi S1 EP 75",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T14:00:00.000Z",
              "endISO": "2025-10-31T14:30:00.000Z",
              "title": "King of Hearts S1 Ep145",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T15:00:00.000Z",
              "endISO": "2025-10-31T15:30:00.000Z",
              "title": "Mehek S2 Ep81",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T16:00:00.000Z",
              "endISO": "2025-10-31T16:30:00.000Z",
              "title": "Married Again S1 Ep34",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T17:00:00.000Z",
              "endISO": "2025-10-31T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 303",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T17:30:00.000Z",
              "endISO": "2025-10-31T18:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep8",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T18:30:00.000Z",
              "endISO": "2025-10-31T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP98",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T19:30:00.000Z",
              "endISO": "2025-10-31T20:00:00.000Z",
              "title": "Secrets S1 EP 76",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T20:00:00.000Z",
              "endISO": "2025-10-31T20:30:00.000Z",
              "title": "Taxi S1 EP 76",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T20:30:00.000Z",
              "endISO": "2025-10-31T21:00:00.000Z",
              "title": "Marriage For Duty S1 Ep4",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T22:00:00.000Z",
              "endISO": "2025-10-31T22:30:00.000Z",
              "title": "King of Hearts S1 Ep145",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T23:00:00.000Z",
              "endISO": "2025-10-31T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 303",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-31T23:30:00.000Z",
              "endISO": "2025-11-01T00:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep8",
              "durationMin": 30
            }
          ]
        },
        {
          "dateISO": "2025-11-01",
          "slots": [
            {
              "startISO": "2025-11-01T00:30:00.000Z",
              "endISO": "2025-11-01T01:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP98",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T01:30:00.000Z",
              "endISO": "2025-11-01T02:00:00.000Z",
              "title": "Hidden Intentions S1 EP 82",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T02:30:00.000Z",
              "endISO": "2025-11-01T03:00:00.000Z",
              "title": "Marriage For Duty S1 Ep4",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T03:00:00.000Z",
              "endISO": "2025-11-01T03:30:00.000Z",
              "title": "Secrets S1 EP 76",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T03:30:00.000Z",
              "endISO": "2025-11-01T04:00:00.000Z",
              "title": "Taxi S1 EP 76",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T04:00:00.000Z",
              "endISO": "2025-11-01T04:30:00.000Z",
              "title": "Married Again S1 Ep34",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T05:00:00.000Z",
              "endISO": "2025-11-01T05:30:00.000Z",
              "title": "Mehek S2 Ep81",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T05:00:00.000Z",
              "endISO": "2025-11-01T05:30:00.000Z",
              "title": "Ringside Rebel S1 EP 307",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T05:30:00.000Z",
              "endISO": "2025-11-01T06:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP102",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T06:30:00.000Z",
              "endISO": "2025-11-01T07:00:00.000Z",
              "title": "Hidden Intentions S1 EP 86",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T07:30:00.000Z",
              "endISO": "2025-11-01T08:00:00.000Z",
              "title": "Marriage For Duty S1 Ep8",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T08:00:00.000Z",
              "endISO": "2025-11-01T08:30:00.000Z",
              "title": "Secrets S1 EP 80",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T08:30:00.000Z",
              "endISO": "2025-11-01T09:00:00.000Z",
              "title": "Taxi S1 EP 80",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T10:00:00.000Z",
              "endISO": "2025-11-01T10:30:00.000Z",
              "title": "King of Hearts S1 Ep149",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T11:00:00.000Z",
              "endISO": "2025-11-01T11:30:00.000Z",
              "title": "Jagriti Empowered S1 Ep12",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T12:00:00.000Z",
              "endISO": "2025-11-01T12:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP102",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T13:00:00.000Z",
              "endISO": "2025-11-01T13:30:00.000Z",
              "title": "Secrets S1 EP 80",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T13:30:00.000Z",
              "endISO": "2025-11-01T14:00:00.000Z",
              "title": "Taxi S1 EP 80",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T14:00:00.000Z",
              "endISO": "2025-11-01T14:30:00.000Z",
              "title": "King of Hearts S1 Ep150",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T15:00:00.000Z",
              "endISO": "2025-11-01T15:30:00.000Z",
              "title": "Mehek S2 Ep86",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T16:00:00.000Z",
              "endISO": "2025-11-01T16:30:00.000Z",
              "title": "Married Again S1 Ep39",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T17:00:00.000Z",
              "endISO": "2025-11-01T17:30:00.000Z",
              "title": "Ringside Rebel S1 EP 308",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T17:30:00.000Z",
              "endISO": "2025-11-01T18:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep13",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T18:30:00.000Z",
              "endISO": "2025-11-01T19:00:00.000Z",
              "title": "Twist of Fate: New Era S10 EP103",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T19:30:00.000Z",
              "endISO": "2025-11-01T20:00:00.000Z",
              "title": "Secrets S1 EP 81",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T20:00:00.000Z",
              "endISO": "2025-11-01T20:30:00.000Z",
              "title": "Taxi S1 EP 81",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T20:30:00.000Z",
              "endISO": "2025-11-01T21:00:00.000Z",
              "title": "Marriage For Duty S1 Ep9",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T22:00:00.000Z",
              "endISO": "2025-11-01T22:30:00.000Z",
              "title": "King of Hearts S1 Ep150",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T23:00:00.000Z",
              "endISO": "2025-11-01T23:30:00.000Z",
              "title": "Ringside Rebel S1 EP 308",
              "durationMin": 30
            },
            {
              "startISO": "2025-11-01T23:30:00.000Z",
              "endISO": "2025-11-02T00:00:00.000Z",
              "title": "Jagriti Empowered S1 Ep13",
              "durationMin": 30
            }
          ]
        }
      ]
    },
    {
      "code": "ROA",
      "label": "Rest of Africa",
      "timezones": ["WAT", "CAT", "EST"],
      "days": [
        {
          "dateISO": "2025-10-26",
          "slots": [
            {
              "startISO": "2025-10-26T05:30:00.000Z",
              "endISO": "2025-10-26T06:00:00.000Z",
              "title": "Radhe Mohan S3 EP 68",
              "subtitle": "S3 EP 68",
              "bgColor": "#111216",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T06:00:00.000Z",
              "endISO": "2025-10-26T06:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP73",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T07:00:00.000Z",
              "endISO": "2025-10-26T07:30:00.000Z",
              "title": "Hidden Intentions S1 EP 57",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T08:00:00.000Z",
              "endISO": "2025-10-26T08:30:00.000Z",
              "title": "Betrayal S1 EP 271",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T09:00:00.000Z",
              "endISO": "2025-10-26T09:30:00.000Z",
              "title": "Secrets S1 EP 51",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T09:30:00.000Z",
              "endISO": "2025-10-26T10:00:00.000Z",
              "title": "Taxi S1 EP 51",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T11:00:00.000Z",
              "endISO": "2025-10-26T11:30:00.000Z",
              "title": "King of Hearts S1 Ep120",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T12:00:00.000Z",
              "endISO": "2025-10-26T12:30:00.000Z",
              "title": "Radhe Mohan: First Name of Love S4 Ep56",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T13:00:00.000Z",
              "endISO": "2025-10-26T13:30:00.000Z",
              "title": "Twist of Fate: New Era S10 EP73",
              "durationMin": 30
            },
            {
              "startISO": "2025-10-26T14:00:00.000Z",
              "endISO": "2025-10-26T14:30:00.000Z",
              "title": "Secrets S1 EP 51",
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

export default function TVGuideZeeWorldFlexible(props: TVGuideProps) {
  const [currentRegion, setCurrentRegion] = useState<string>(props.initialRegion || zeeWorldData.metadata.defaultRegion);
  const [currentTimezone, setCurrentTimezone] = useState<string>(props.initialTimezone || zeeWorldData.metadata.defaultTimezone);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get current region data
  const currentRegionData = zeeWorldData.regions.find(r => r.code === currentRegion);
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
        {props.enableRegionSwitch && zeeWorldData.regions.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {zeeWorldData.regions.map(region => (
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
addPropertyControls(TVGuideZeeWorldFlexible, {
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
