import React, { useState, useEffect, useMemo } from 'react';

// Types
interface Slot {
  startISO: string;
  endISO: string;
  title: string;
  durationMin: number;
  subtitle?: string;
  textColor?: string;
  bgColor?: string;
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

interface GuideJSON {
  metadata: {
    channelId: string;
    generatedAt: string;
    defaultRegion: string;
    defaultTimezone: string;
  };
  regions: Region[];
}

interface TVGuideProps {
  width?: number;
  height?: number;
  hourWidthPx?: number;
  rowHeightPx?: number;
  showCurrentDay?: boolean;
  currentDayColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  gridBgColor?: string;
  gridTextColor?: string;
  cardBgColor?: string;
  cardTextColor?: string;
  cardBorderRadius?: number;
  cardPadding?: number;
  timezoneSwitcherBgColor?: string;
  timezoneSwitcherTextColor?: string;
  regionSwitcherBgColor?: string;
  regionSwitcherTextColor?: string;
  selectedRegionBgColor?: string;
  selectedTimezoneBgColor?: string;
}

// Embedded ROA Data
const roaData: GuideJSON = {
  "metadata": {
    "channelId": "zee-world-roa",
    "generatedAt": "2025-10-07T19:46:07.551Z",
    "defaultRegion": "ROA",
    "defaultTimezone": "WAT"
  },
  "regions": [
    {
      "code": "ROA",
      "label": "Rest of Africa",
      "timezones": [
        "WAT",
        "CAT"
      ],
      "days": [
        {
          "dateISO": "2025-10-06",
          "slots": [
            {
              "startISO": "2025-10-06T00:00:00+01:00",
              "endISO": "2025-10-06T01:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-06T00:00:00+02:00",
              "endISO": "2025-10-06T01:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 150"
            },
            {
              "startISO": "2025-10-06T01:00:00+01:00",
              "endISO": "2025-10-06T02:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-06T01:00:00+02:00",
              "endISO": "2025-10-06T02:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-06T02:00:00+01:00",
              "endISO": "2025-10-06T03:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-06T02:00:00+02:00",
              "endISO": "2025-10-06T03:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-06T03:00:00+01:00",
              "endISO": "2025-10-06T04:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-06T03:00:00+02:00",
              "endISO": "2025-10-06T04:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 98"
            },
            {
              "startISO": "2025-10-06T04:00:00+01:00",
              "endISO": "2025-10-06T05:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 98"
            },
            {
              "startISO": "2025-10-06T04:00:00+01:00",
              "endISO": "2025-10-06T05:00:00+01:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 64"
            },
            {
              "startISO": "2025-10-06T05:00:00+01:00",
              "endISO": "2025-10-06T06:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 Ep 149"
            },
            {
              "startISO": "2025-10-06T05:00:00+02:00",
              "endISO": "2025-10-06T06:00:00+02:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 64"
            },
            {
              "startISO": "2025-10-06T06:00:00+01:00",
              "endISO": "2025-10-06T07:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 7"
            },
            {
              "startISO": "2025-10-06T06:00:00+02:00",
              "endISO": "2025-10-06T07:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 Ep 149"
            },
            {
              "startISO": "2025-10-06T07:00:00+01:00",
              "endISO": "2025-10-06T08:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 34"
            },
            {
              "startISO": "2025-10-06T07:00:00+02:00",
              "endISO": "2025-10-06T08:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 7"
            },
            {
              "startISO": "2025-10-06T08:00:00+01:00",
              "endISO": "2025-10-06T09:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 Ep 16"
            },
            {
              "startISO": "2025-10-06T08:00:00+02:00",
              "endISO": "2025-10-06T09:00:00+02:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 34"
            },
            {
              "startISO": "2025-10-06T09:00:00+01:00",
              "endISO": "2025-10-06T10:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 Ep 97"
            },
            {
              "startISO": "2025-10-06T09:00:00+02:00",
              "endISO": "2025-10-06T10:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 Ep 16"
            },
            {
              "startISO": "2025-10-06T10:00:00+01:00",
              "endISO": "2025-10-06T10:00:00+01:00",
              "title": "Kelloggs Superstar Quiz Show",
              "durationMin": 0,
              "subtitle": "S3 Ep 8"
            },
            {
              "startISO": "2025-10-06T10:00:00+02:00",
              "endISO": "2025-10-06T10:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 0,
              "subtitle": "S7 Ep 97"
            },
            {
              "startISO": "2025-10-06T11:00:00+01:00",
              "endISO": "2025-10-06T11:00:00+01:00",
              "title": "King of Hearts",
              "durationMin": 0,
              "subtitle": "S1 EP 82"
            },
            {
              "startISO": "2025-10-06T11:00:00+02:00",
              "endISO": "2025-10-06T11:00:00+02:00",
              "title": "Kelloggs Superstar Quiz Show",
              "durationMin": 0,
              "subtitle": "S3 Ep 8"
            },
            {
              "startISO": "2025-10-06T12:00:00+01:00",
              "endISO": "2025-10-06T13:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 7"
            },
            {
              "startISO": "2025-10-06T12:00:00+02:00",
              "endISO": "2025-10-06T13:00:00+02:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 82"
            },
            {
              "startISO": "2025-10-06T13:00:00+01:00",
              "endISO": "2025-10-06T14:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 34"
            },
            {
              "startISO": "2025-10-06T13:00:00+02:00",
              "endISO": "2025-10-06T14:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 7"
            },
            {
              "startISO": "2025-10-06T14:00:00+01:00",
              "endISO": "2025-10-06T15:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 34"
            },
            {
              "startISO": "2025-10-06T14:00:00+02:00",
              "endISO": "2025-10-06T15:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 16"
            },
            {
              "startISO": "2025-10-06T15:00:00+01:00",
              "endISO": "2025-10-06T16:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 16"
            },
            {
              "startISO": "2025-10-06T15:00:00+02:00",
              "endISO": "2025-10-06T16:00:00+02:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 83"
            },
            {
              "startISO": "2025-10-06T16:00:00+01:00",
              "endISO": "2025-10-06T17:00:00+01:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 83"
            },
            {
              "startISO": "2025-10-06T16:00:00+01:00",
              "endISO": "2025-10-06T17:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 150"
            },
            {
              "startISO": "2025-10-06T17:00:00+01:00",
              "endISO": "2025-10-06T17:00:00+01:00",
              "title": "Mehek",
              "durationMin": 0,
              "subtitle": "S2 EP 37"
            },
            {
              "startISO": "2025-10-06T17:00:00+02:00",
              "endISO": "2025-10-06T18:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 150"
            },
            {
              "startISO": "2025-10-06T18:00:00+01:00",
              "endISO": "2025-10-06T19:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-06T18:00:00+02:00",
              "endISO": "2025-10-06T19:00:00+02:00",
              "title": "Mehek",
              "durationMin": 60,
              "subtitle": "S2 EP 37"
            },
            {
              "startISO": "2025-10-06T19:00:00+01:00",
              "endISO": "2025-10-06T20:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-06T19:00:00+02:00",
              "endISO": "2025-10-06T20:00:00+02:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-06T20:00:00+01:00",
              "endISO": "2025-10-06T21:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-06T20:00:00+02:00",
              "endISO": "2025-10-06T21:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-06T21:00:00+01:00",
              "endISO": "2025-10-06T22:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-06T21:00:00+02:00",
              "endISO": "2025-10-06T22:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 98"
            },
            {
              "startISO": "2025-10-06T22:00:00+01:00",
              "endISO": "2025-10-06T23:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 98"
            },
            {
              "startISO": "2025-10-06T22:00:00+02:00",
              "endISO": "2025-10-06T23:00:00+02:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 64"
            },
            {
              "startISO": "2025-10-06T23:00:00+01:00",
              "endISO": "2025-10-06T00:00:00+01:00",
              "title": "Hidden Intentions",
              "durationMin": -1380,
              "subtitle": "S1 EP 64"
            },
            {
              "startISO": "2025-10-06T23:00:00+01:00",
              "endISO": "2025-10-06T00:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": -1380,
              "subtitle": "S1 EP 150"
            }
          ]
        },
        {
          "dateISO": "2025-10-07",
          "slots": [
            {
              "startISO": "2025-10-07T00:00:00+01:00",
              "endISO": "2025-10-07T01:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 9"
            },
            {
              "startISO": "2025-10-07T00:00:00+02:00",
              "endISO": "2025-10-07T01:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 151"
            },
            {
              "startISO": "2025-10-07T01:00:00+01:00",
              "endISO": "2025-10-07T02:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 36"
            },
            {
              "startISO": "2025-10-07T01:00:00+02:00",
              "endISO": "2025-10-07T02:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 9"
            },
            {
              "startISO": "2025-10-07T02:00:00+01:00",
              "endISO": "2025-10-07T03:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 36"
            },
            {
              "startISO": "2025-10-07T02:00:00+02:00",
              "endISO": "2025-10-07T03:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 18"
            },
            {
              "startISO": "2025-10-07T03:00:00+01:00",
              "endISO": "2025-10-07T04:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 18"
            },
            {
              "startISO": "2025-10-07T03:00:00+02:00",
              "endISO": "2025-10-07T04:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 99"
            },
            {
              "startISO": "2025-10-07T04:00:00+01:00",
              "endISO": "2025-10-07T05:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 99"
            },
            {
              "startISO": "2025-10-07T04:00:00+01:00",
              "endISO": "2025-10-07T05:00:00+01:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 65"
            },
            {
              "startISO": "2025-10-07T05:00:00+01:00",
              "endISO": "2025-10-07T06:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 Ep 150"
            },
            {
              "startISO": "2025-10-07T05:00:00+02:00",
              "endISO": "2025-10-07T06:00:00+02:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 65"
            },
            {
              "startISO": "2025-10-07T06:00:00+01:00",
              "endISO": "2025-10-07T07:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-07T06:00:00+02:00",
              "endISO": "2025-10-07T07:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 Ep 150"
            },
            {
              "startISO": "2025-10-07T07:00:00+01:00",
              "endISO": "2025-10-07T08:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-07T07:00:00+02:00",
              "endISO": "2025-10-07T08:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-07T08:00:00+01:00",
              "endISO": "2025-10-07T09:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 Ep 17"
            },
            {
              "startISO": "2025-10-07T08:00:00+02:00",
              "endISO": "2025-10-07T09:00:00+02:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-07T09:00:00+01:00",
              "endISO": "2025-10-07T10:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 Ep 98"
            },
            {
              "startISO": "2025-10-07T09:00:00+02:00",
              "endISO": "2025-10-07T10:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 Ep 17"
            },
            {
              "startISO": "2025-10-07T10:00:00+01:00",
              "endISO": "2025-10-07T10:00:00+01:00",
              "title": "Kelloggs Superstar Quiz Show",
              "durationMin": 0,
              "subtitle": "S3 Ep 9"
            },
            {
              "startISO": "2025-10-07T10:00:00+02:00",
              "endISO": "2025-10-07T10:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 0,
              "subtitle": "S7 Ep 98"
            },
            {
              "startISO": "2025-10-07T11:00:00+01:00",
              "endISO": "2025-10-07T11:00:00+01:00",
              "title": "King of Hearts",
              "durationMin": 0,
              "subtitle": "S1 EP 83"
            },
            {
              "startISO": "2025-10-07T11:00:00+02:00",
              "endISO": "2025-10-07T11:00:00+02:00",
              "title": "Kelloggs Superstar Quiz Show",
              "durationMin": 0,
              "subtitle": "S3 Ep 9"
            },
            {
              "startISO": "2025-10-07T12:00:00+01:00",
              "endISO": "2025-10-07T13:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-07T12:00:00+02:00",
              "endISO": "2025-10-07T13:00:00+02:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 83"
            },
            {
              "startISO": "2025-10-07T13:00:00+01:00",
              "endISO": "2025-10-07T14:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-07T13:00:00+02:00",
              "endISO": "2025-10-07T14:00:00+02:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 8"
            },
            {
              "startISO": "2025-10-07T14:00:00+01:00",
              "endISO": "2025-10-07T15:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 35"
            },
            {
              "startISO": "2025-10-07T14:00:00+02:00",
              "endISO": "2025-10-07T15:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-07T15:00:00+01:00",
              "endISO": "2025-10-07T16:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 17"
            },
            {
              "startISO": "2025-10-07T15:00:00+02:00",
              "endISO": "2025-10-07T16:00:00+02:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 84"
            },
            {
              "startISO": "2025-10-07T16:00:00+01:00",
              "endISO": "2025-10-07T17:00:00+01:00",
              "title": "King of Hearts",
              "durationMin": 60,
              "subtitle": "S1 EP 84"
            },
            {
              "startISO": "2025-10-07T16:00:00+01:00",
              "endISO": "2025-10-07T17:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 151"
            },
            {
              "startISO": "2025-10-07T17:00:00+01:00",
              "endISO": "2025-10-07T17:00:00+01:00",
              "title": "Mehek",
              "durationMin": 0,
              "subtitle": "S2 EP 38"
            },
            {
              "startISO": "2025-10-07T17:00:00+02:00",
              "endISO": "2025-10-07T18:00:00+02:00",
              "title": "Sister Wives",
              "durationMin": 60,
              "subtitle": "S1 EP 151"
            },
            {
              "startISO": "2025-10-07T18:00:00+01:00",
              "endISO": "2025-10-07T19:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 9"
            },
            {
              "startISO": "2025-10-07T18:00:00+02:00",
              "endISO": "2025-10-07T19:00:00+02:00",
              "title": "Mehek",
              "durationMin": 60,
              "subtitle": "S2 EP 38"
            },
            {
              "startISO": "2025-10-07T19:00:00+01:00",
              "endISO": "2025-10-07T20:00:00+01:00",
              "title": "Radhe Mohan",
              "durationMin": 60,
              "subtitle": "S4 EP 9"
            },
            {
              "startISO": "2025-10-07T19:00:00+02:00",
              "endISO": "2025-10-07T20:00:00+02:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 36"
            },
            {
              "startISO": "2025-10-07T20:00:00+01:00",
              "endISO": "2025-10-07T21:00:00+01:00",
              "title": "Twist of Fate: New Era",
              "durationMin": 60,
              "subtitle": "S10 EP 36"
            },
            {
              "startISO": "2025-10-07T20:00:00+02:00",
              "endISO": "2025-10-07T21:00:00+02:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 18"
            },
            {
              "startISO": "2025-10-07T21:00:00+01:00",
              "endISO": "2025-10-07T22:00:00+01:00",
              "title": "Hearts Crossed",
              "durationMin": 60,
              "subtitle": "S1 EP 18"
            },
            {
              "startISO": "2025-10-07T21:00:00+02:00",
              "endISO": "2025-10-07T22:00:00+02:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 99"
            },
            {
              "startISO": "2025-10-07T22:00:00+01:00",
              "endISO": "2025-10-07T23:00:00+01:00",
              "title": "This Is Fate",
              "durationMin": 60,
              "subtitle": "S7 EP 99"
            },
            {
              "startISO": "2025-10-07T22:00:00+02:00",
              "endISO": "2025-10-07T23:00:00+02:00",
              "title": "Hidden Intentions",
              "durationMin": 60,
              "subtitle": "S1 EP 65"
            },
            {
              "startISO": "2025-10-07T23:00:00+01:00",
              "endISO": "2025-10-07T00:00:00+01:00",
              "title": "Hidden Intentions",
              "durationMin": -1380,
              "subtitle": "S1 EP 65"
            },
            {
              "startISO": "2025-10-07T23:00:00+01:00",
              "endISO": "2025-10-07T00:00:00+01:00",
              "title": "Sister Wives",
              "durationMin": -1380,
              "subtitle": "S1 EP 151"
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to parse timezone from ISO string
function getTimezoneFromISO(isoString: string): string {
  const match = isoString.match(/([+-]\d{2}:\d{2})$/);
  return match ? match[1] : '+00:00';
}

// Helper function to format time from ISO string
function formatTimeFromISO(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper function to format date
function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  
  return `${dayName}, ${month} ${day}`;
}

// Helper function to get current day
function getCurrentDay(): string {
  return new Date().toISOString().split('T')[0];
}

// Main component
export default function TVGuideWorking(props: TVGuideProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('ROA');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('WAT');
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  
  // Use embedded data
  const currentData = roaData;
  const currentRegion = currentData?.regions.find(r => r.code === selectedRegion);
  
  // Update timezone when region changes
  useEffect(() => {
    if (currentRegion) {
      const defaultTimezone = currentRegion.timezones[0];
      setSelectedTimezone(defaultTimezone);
    }
  }, [selectedRegion, currentRegion]);
  
  // Generate time ticks (5:00 AM to 4:00 AM next day for WAT, 6:00 AM to 5:00 AM for CAT)
  const timeTicks = useMemo(() => {
    if (!currentRegion) return [];
    
    const ticks = [];
    const startHour = selectedTimezone === 'WAT' ? 5 : 6;
    const endHour = selectedTimezone === 'WAT' ? 28 : 29; // 4 AM next day = 28 hours, 5 AM next day = 29 hours
    
    for (let hour = startHour; hour < endHour; hour++) {
      const displayHour = hour % 24;
      const isMajor = displayHour % 2 === 0;
      
      ticks.push({
        hour: displayHour,
        minute: 0,
        label: `${displayHour.toString().padStart(2, '0')}:00`,
        xPosition: (hour - startHour) * (props.hourWidthPx || 220),
        isMajor
      });
    }
    
    return ticks;
  }, [currentRegion, selectedTimezone, props.hourWidthPx]);
  
  // Get current day
  const currentDay = getCurrentDay();
  
  if (!currentData || !currentRegion) {
    return (
      <div style={{
        width: props.width || 1200,
        height: props.height || 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.gridBgColor || '#1a1a1a',
        color: props.gridTextColor || '#ffffff',
        fontSize: '16px'
      }}>
        No data available
      </div>
    );
  }
  
  return (
    <div style={{
      width: props.width || 1200,
      height: props.height || 600,
      backgroundColor: props.gridBgColor || '#1a1a1a',
      color: props.gridTextColor || '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Region Switcher */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: props.headerBgColor || '#2a2a2a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['ROA'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedRegion === region 
                  ? (props.selectedRegionBgColor || '#6366f1')
                  : (props.regionSwitcherBgColor || '#3a3a3a'),
                color: selectedRegion === region 
                  ? '#ffffff'
                  : (props.regionSwitcherTextColor || '#ffffff'),
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {region === 'ROA' ? 'Rest of Africa' : region}
            </button>
          ))}
        </div>
        
        {/* Timezone Switcher - Only show for ROA */}
        {selectedRegion === 'ROA' && (
          <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
            {currentRegion.timezones.map(timezone => (
              <button
                key={timezone}
                onClick={() => setSelectedTimezone(timezone)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedTimezone === timezone 
                    ? (props.selectedTimezoneBgColor || '#10b981')
                    : (props.timezoneSwitcherBgColor || '#3a3a3a'),
                  color: selectedTimezone === timezone 
                    ? '#ffffff'
                    : (props.timezoneSwitcherTextColor || '#ffffff'),
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {timezone}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Day Column */}
        <div style={{
          width: 120,
          backgroundColor: props.headerBgColor || '#2a2a2a',
          borderRight: '1px solid #444',
          position: 'sticky',
          left: 0,
          zIndex: 10
        }}>
          {currentRegion.days.map((day, index) => {
            const isCurrentDay = day.dateISO === currentDay;
            return (
              <div
                key={day.dateISO}
                style={{
                  height: props.rowHeightPx || 64,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  backgroundColor: isCurrentDay && props.showCurrentDay 
                    ? (props.currentDayColor || '#1e40af')
                    : 'transparent',
                  borderBottom: '1px solid #444',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {formatDate(day.dateISO)}
              </div>
            );
          })}
        </div>
        
        {/* Program Grid */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative'
        }}>
          {/* Time Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            height: 40,
            backgroundColor: props.headerBgColor || '#2a2a2a',
            borderBottom: '1px solid #444',
            display: 'flex',
            alignItems: 'center',
            zIndex: 5
          }}>
            {timeTicks.map((tick, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: tick.xPosition,
                  width: props.hourWidthPx || 220,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: tick.isMajor ? '12px' : '10px',
                  fontWeight: tick.isMajor ? '600' : '400',
                  color: props.headerTextColor || '#ffffff',
                  borderRight: '1px solid #444'
                }}
              >
                {tick.label}
              </div>
            ))}
          </div>
          
          {/* Program Rows */}
          <div style={{ position: 'relative' }}>
            {currentRegion.days.map((day, dayIndex) => (
              <div
                key={day.dateISO}
                style={{
                  height: props.rowHeightPx || 64,
                  position: 'relative',
                  borderBottom: '1px solid #333',
                  display: 'flex'
                }}
              >
                {/* Grid Lines */}
                {timeTicks.map((tick, tickIndex) => (
                  <div
                    key={tickIndex}
                    style={{
                      position: 'absolute',
                      left: tick.xPosition,
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      backgroundColor: '#333',
                      zIndex: 1
                    }}
                  />
                ))}
                
                {/* Show Slots */}
                {day.slots
                  .filter(slot => {
                    const slotTimezone = getTimezoneFromISO(slot.startISO);
                    const expectedTimezone = selectedTimezone === 'WAT' ? '+01:00' : '+02:00';
                    return slotTimezone === expectedTimezone;
                  })
                  .map((slot, slotIndex) => {
                    const startTime = new Date(slot.startISO);
                    const endTime = new Date(slot.endISO);
                    
                    // Calculate position based on time
                    const startHour = startTime.getHours();
                    const startMinute = startTime.getMinutes();
                    const totalStartMinutes = startHour * 60 + startMinute;
                    
                    // Adjust for timezone start time
                    const timezoneStartMinutes = selectedTimezone === 'WAT' ? 5 * 60 : 6 * 60; // 5:00 AM or 6:00 AM
                    const adjustedStartMinutes = totalStartMinutes - timezoneStartMinutes;
                    
                    const left = Math.max(0, adjustedStartMinutes * (props.hourWidthPx || 220) / 60);
                    const duration = slot.durationMin;
                    const width = Math.max(60, duration * (props.hourWidthPx || 220) / 60 - 4);
                    
                    return (
                      <div
                        key={slotIndex}
                        style={{
                          position: 'absolute',
                          left: left + 2,
                          top: 4,
                          width: width,
                          height: (props.rowHeightPx || 64) - 8,
                          backgroundColor: slot.bgColor || props.cardBgColor || '#4f46e5',
                          color: slot.textColor || props.cardTextColor || '#ffffff',
                          borderRadius: props.cardBorderRadius || 4,
                          padding: props.cardPadding || 8,
                          fontSize: '11px',
                          fontWeight: '500',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          zIndex: 10,
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        title={`${slot.title} - ${formatTimeFromISO(slot.startISO)} to ${formatTimeFromISO(slot.endISO)}`}
                      >
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          marginBottom: '2px',
                          lineHeight: '1.2'
                        }}>
                          {slot.title}
                        </div>
                        {slot.subtitle && (
                          <div style={{
                            fontSize: '9px',
                            opacity: 0.8,
                            lineHeight: '1.2'
                          }}>
                            {slot.subtitle}
                          </div>
                        )}
                        <div style={{
                          fontSize: '8px',
                          opacity: 0.7,
                          marginTop: '2px'
                        }}>
                          {formatTimeFromISO(slot.startISO)} - {formatTimeFromISO(slot.endISO)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


