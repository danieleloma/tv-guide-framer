# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project does

Converts weekly TV schedule Excel files (`.xlsx`) into structured JSON files consumed by a Framer TV guide component. The component displays a 7-day, 30-minute-slot grid for Zee World, Zee One, Zee Zonke, and Zee Dunia channels across two regions (SA and ROA) and multiple timezones (CAT, WAT, EAT).

## Running conversions

### Unified CLI (preferred)

```bash
node scripts/convert.js "TV Schedules/Zee World/April/Zee World APRIL 2026 FPC SA (April 13th - 19th) Edited.xlsx"
node scripts/convert.js "path/to/file.xlsx" --out "public/custom-name.json"
```

Channel, region, and output filename are auto-detected from the Excel filename. Output always goes to `public/`.

### Web UI

```bash
cd web && npm run dev   # runs on http://localhost:3333
```

Upload an `.xlsx` file via drag-and-drop; download or copy the resulting JSON.

## Channel detection rules (scripts/convert.js and web/lib/convert.ts)

Both files share identical detection logic — keep them in sync when adding channels.

| Filename contains | Channel slug | Region | Timezones |
|---|---|---|---|
| `Zee One` + `SA` | `zee-one-sa` | SA | CAT |
| `Zee One` + `ROA` | `zee-one-roa` | ROA | WAT + CAT |
| `Zee World` + `SA` | `zee-world-sa` | SA | CAT |
| `Zee World` + `ROA` | `zee-world-roa` | ROA | WAT + CAT |
| `Zee Zonke` | `zee-zonke` | from Region column | WAT + CAT |
| `Dunia` | `zee-dunia` | from Region column | WAT + CAT + EAT |

`Zee One` must be tested before `Zee World` in the if-chain (substring overlap).

Output filename pattern: `public/<channel-slug>-<mon><d1>-<d2>-tvguide.json`  
e.g. `public/zee-world-sa-apr13-19-tvguide.json`

## JSON output format

```json
{
  "window": {
    "WAT": { "start": "05:00", "end": "05:00" },
    "CAT": { "start": "06:00", "end": "06:00" },
    "EAT": { "start": "06:00", "end": "06:00" },
    "slotMinutes": 30
  },
  "regions": {
    "SA": {
      "region": "SA",
      "timezones": {
        "WAT": null,
        "CAT": { "timezone": "CAT", "days": { "Mon": { "date": "YYYY-MM-DD", "day": "Mon", "slots": [...] } } },
        "EAT": null
      }
    }
  }
}
```

- Each slot: `{ "time": "HH:MM", "shows": [{ "title", "start", "end", "season"?, "episode"? }] }`
- Empty slots must be present with `"shows": []`
- Shows spanning multiple 30-min slots appear only at the start slot

## Excel input format

| Region | Date | Start Time | End Time | Title | Season | Episode | Subtitle | Text Color | BG Color | Timezone |

- `Date`: `YYYY-MM-DD` — `Start/End Time`: `HH:MM` — `Timezone`: `WAT`, `CAT`, or `EAT`
- Source files live in `TV Schedules/<Channel>/<Month>/`

## Architecture

```
scripts/convert.js          # Unified CLI converter — the canonical conversion tool
web/                        # Next.js 14 + shadcn web UI (localhost:3333)
  app/api/convert/route.ts  # POST endpoint: receives .xlsx, returns JSON
  lib/convert.ts            # Conversion logic (TypeScript port of scripts/convert.js)
  components/Converter.tsx  # Full-page upload/convert/download UI

components/TVGuideZeeWorld.tsx  # Self-contained Framer component (data embedded inline)
app/                            # Reference TypeScript implementation (not compiled/used in prod)
public/                         # Output JSON files fetched by the Framer component at runtime
TV Schedules/                   # Source Excel files organised by channel and month
```

The `app/` TypeScript is a reference implementation only — not compiled or deployed. `components/TVGuideZeeWorld.tsx` is what runs in Framer and can either embed data inline or fetch from `public/` JSON files.

## Key implementation detail

Date → weekday conversion must use UTC noon to avoid timezone-offset bugs:

```js
function normDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()];
}
```

## Adding a new channel

1. Add detection in `scripts/convert.js` `detectChannel()` — before any channel it could be confused with
2. Mirror the same block in `web/lib/convert.ts` `detectChannel()`
3. Add a colour entry in `web/components/Converter.tsx` `CHANNEL_COLORS`
4. Add a row to the reference card in `Converter.tsx`
