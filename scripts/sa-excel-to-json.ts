// SA Excel -> RegionSchedule JSON (CAT only)
// Usage:
//   ts-node scripts/sa-excel-to-json.ts \
//     --in "/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
//     --out "public/sa-region.json"

import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

type Weekday = "Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun";
type TimeLabel = `${string}:${"00"|"30"}`;
type Tz = "CAT";
type Region = "SA";

interface ShowItem {
  title: string;
  start: TimeLabel; // inclusive
  end: TimeLabel;   // exclusive or terminal tick
  season?: string;  // present only if both exist
  episode?: string;
  meta?: Record<string, any>;
}

interface SlotBucket {
  time: TimeLabel; // 06:00, 06:30, ... 05:30
  shows: ShowItem[];
}

interface DaySchedule {
  date: string;  // ISO yyyy-mm-dd
  day: Weekday;  // Mon..Sun
  slots: SlotBucket[];
}

interface TzSchedule {
  timezone: Tz;
  days: Record<Weekday, DaySchedule>;
}

interface RegionSchedule {
  region: Region;
  timezones: { WAT: null; CAT: TzSchedule };
}

// ---------- CONFIG ----------
const SLOT_MIN = 30;
const WINDOW = { start: "06:00", end: "06:00" }; // 24h window; we will output slots 06:00..05:30

// Adjust these to match your sheet headers exactly
const COL = {
  region: "Region",         // optional in SA sheet (ignored/forced to SA)
  timezone: "Timezone",     // optional in SA sheet (ignored/forced to CAT)
  date: "Date",             // Excel date (we'll extract day from this)
  title: "Title",
  start: "Start Time",      // "Start Time" in SA sheet
  end: "End Time",          // "End Time" in SA sheet
  season: "Season",         // optional
  episode: "Episode",       // optional
} as const;

// ---------- HELPERS ----------
const DAY = 24 * 60;
const ORDER: Weekday[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function z2(n: number) { return n.toString().padStart(2, "0"); }
function tToMin(t: string) { const [h,m] = t.split(":").map(Number); return (h*60 + m) % DAY; }
function minToLabel(m: number): TimeLabel {
  const mm = ((m % DAY)+DAY)%DAY;
  return `${z2(Math.floor(mm/60))}:${z2(mm%60)}` as TimeLabel;
}

/** Build labels including terminal tick, then drop it for slot labels */
function buildSlotLabels(start: string, end: string, step = SLOT_MIN): TimeLabel[] {
  const s = tToMin(start);
  let e = tToMin(end);
  if (e <= s) e += DAY; // next-day
  const ticks: string[] = [];
  for (let m = s; m <= e; m += step) ticks.push(minToLabel(m));
  // slots start at each tick except the final terminal label
  return ticks.slice(0, -1) as TimeLabel[]; // 48 labels: 06:00..05:30
}

function fmtExcelTime(v: any): TimeLabel | null {
  if (v == null || v === "") return null;
  
  // Handle Excel decimal time (e.g., 0.25 = 6:00 AM)
  if (typeof v === 'number') {
    const totalMinutes = Math.round(v * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${z2(hours)}:${z2(minutes)}` as TimeLabel;
  }
  
  // With cellDates: true, times may be Date; also allow string "6:00" etc.
  let d: Date;
  if (v instanceof Date) d = v;
  else {
    const s = String(v).trim();
    // Handle "6:00", "06:00", "6:00 AM" etc.
    const parsed = new Date(`1970-01-01T${s.replace(" ", "")}`);
    d = isNaN(parsed.getTime()) ? new Date(`1970-01-01 ${s}`) : parsed;
  }
  if (isNaN(d.getTime())) return null;
  return `${z2(d.getHours())}:${z2(d.getMinutes())}` as TimeLabel;
}

function fmtExcelDateISO(v: any): string | null {
  if (v == null || v === "") return null;
  
  // Handle Excel serial date (e.g., 45936 = 2025-10-06)
  if (typeof v === 'number') {
    // Excel epoch: January 1, 1900 (with leap year bug adjustment)
    const excelEpoch = new Date(1900, 0, 1);
    const d = new Date(excelEpoch.getTime() + (v - 2) * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }
  
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0,10);
}

function normDayName(v: any): Weekday | null {
  if (!v) return null;
  const s = String(v).slice(0,3).toLowerCase(); // "Mon".."Sun"
  const map: Record<string, Weekday> = { mon:"Mon", tue:"Tue", wed:"Wed", thu:"Thu", fri:"Fri", sat:"Sat", sun:"Sun" };
  return map[s] ?? null;
}

function getDayFromDate(v: any): Weekday | null {
  if (v == null || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return null;
  const dayIdx = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const weekdays: Weekday[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[dayIdx];
}

function nonEmpty(v: any) { const s = String(v ?? "").trim(); return s.length ? s : null; }

// ---------- MAIN ----------
function main() {
  const inIdx = process.argv.indexOf("--in");
  const outIdx = process.argv.indexOf("--out");
  const inPath = inIdx > -1 ? process.argv[inIdx+1] : null;
  const outPath = outIdx > -1 ? process.argv[outIdx+1] : "public/sa-region.json";
  if (!inPath) {
    console.error("Missing --in path to SA Excel file");
    process.exit(1);
  }

  const wb = XLSX.readFile(inPath, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: false, defval: "" });

  // Build empty CAT scaffold for 7 days
  const slotLabels = buildSlotLabels(WINDOW.start, WINDOW.end, SLOT_MIN);
  const emptyDay = (dateISO: string, day: Weekday): DaySchedule => ({
    date: dateISO,
    day,
    slots: slotLabels.map(t => ({ time: t, shows: [] })),
  });

  // Pre-seed days using first valid date found; fall back to monotonic sequence if needed
  // Collect by weekday → dateISO
  const dayDates = new Map<Weekday, string>();

  // First pass: find any date per weekday (extract day from date)
  for (const r of rows) {
    const dISO = fmtExcelDateISO(r[COL.date]);
    const dName = getDayFromDate(r[COL.date]);
    if (dISO && dName && !dayDates.has(dName)) dayDates.set(dName, dISO);
  }
  // If some missing, synthesize in order using the earliest found
  if (dayDates.size) {
    // align to Mon..Sun order: find the earliest date among collected, then map sequentially
    const knownDates = [...dayDates.values()].sort();
    const startISO = knownDates[0];
    const start = new Date(startISO + "T00:00:00Z");
    ORDER.forEach((wd, idx) => {
      if (!dayDates.has(wd)) {
        const d = new Date(start);
        d.setUTCDate(d.getUTCDate() + idx);
        dayDates.set(wd, d.toISOString().slice(0,10));
      }
    });
  } else {
    // No dates at all—just synthesize a week starting Monday of current week (stable)
    const base = new Date();
    const delta = (base.getUTCDay() + 6) % 7; // convert Sun=0..Sat=6 → Mon=0..Sun=6
    base.setUTCDate(base.getUTCDate() - delta);
    ORDER.forEach((wd, idx) => {
      const d = new Date(base);
      d.setUTCDate(d.getUTCDate() + idx);
      dayDates.set(wd, d.toISOString().slice(0,10));
    });
  }

  // Build day scaffolds
  const tzSchedule: TzSchedule = {
    timezone: "CAT",
    days: ORDER.reduce((acc, wd) => {
      acc[wd] = emptyDay(dayDates.get(wd)!, wd);
      return acc;
    }, {} as Record<Weekday, DaySchedule>),
  };

  // Second pass: place shows into slot buckets (no conversions)
  for (const r of rows) {
    const day = getDayFromDate(r[COL.date]); // Extract day from date
    const dateISO = fmtExcelDateISO(r[COL.date]);
    const title = nonEmpty(r[COL.title]);
    const start = fmtExcelTime(r[COL.start]);
    const end = fmtExcelTime(r[COL.end]);
    if (!day || !title || !start || !end) continue;

    // Optional episode details
    const season = nonEmpty(r[COL.season]);
    const episode = nonEmpty(r[COL.episode]);

    // Ensure date for this day (prefer sheet date if present)
    if (dateISO) tzSchedule.days[day].date = dateISO;

    // Clamp to CAT window 06:00→06:00; keep shows ending at terminal tick
    const ws = tToMin(WINDOW.start);
    let ss = tToMin(start); let se = tToMin(end);
    if (se <= ss) se += DAY; // across midnight
    let we = tToMin(WINDOW.end); if (we <= ws) we += DAY;

    // Normalize show to window space [0, 1440]
    const startOff = ((ss - ws + DAY) % DAY);
    const endOff = Math.min(((se - ws + DAY) % DAY) || DAY, DAY); // allow terminal
    if (endOff <= 0 || endOff <= startOff) continue; // outside or zero

    // Convert to slot indexes
    const startIdx = Math.floor(startOff / SLOT_MIN);
    const endIdx = Math.ceil(endOff / SLOT_MIN);
    const span = Math.max(0, endIdx - startIdx);
    if (span <= 0) continue;

    const show: ShowItem = {
      title,
      start, end,
      ...(season && episode ? { season, episode } : {}),
    };

    // Place at start slot (align by start)
    const daySlots = tzSchedule.days[day].slots;
    const idx = Math.min(Math.max(startIdx, 0), daySlots.length - 1);
    daySlots[idx].shows.push(show);
  }

  const regionSchedule: RegionSchedule = {
    region: "SA",
    timezones: {
      WAT: null,
      CAT: tzSchedule,
    },
  };

  const json = JSON.stringify(regionSchedule, null, 2);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, "utf8");
  console.log(`✅ Wrote SA RegionSchedule → ${outPath}`);
  console.log(`📊 Shows placed: ${Object.values(tzSchedule.days).reduce((sum, day) => sum + day.slots.reduce((s, slot) => s + slot.shows.length, 0), 0)}`);
}

main();
