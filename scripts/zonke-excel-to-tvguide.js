#!/usr/bin/env node

/**
 * Zonke Excel → TvGuideData (Framer TVGuideFinal shape)
 *
 * Supports headers:
 *   Region, Date, Start Time, End Time, Title, Season, Episode, Subtitle, Text Color, BG Color, Timezone
 *
 * Usage:
 *   node scripts/zonke-excel-to-tvguide.js --in "/path/file.xlsx" --out "public/zee-zonke.json"
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DAY_MIN = 24 * 60;
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const TZ_START = { WAT: '05:00', CAT: '06:00', EAT: '06:00' };

function z2(n) { return String(n).padStart(2, '0'); }
function tToMin(t) { const [h,m] = t.split(':').map(Number); return (h*60 + m) % DAY_MIN; }
function minToLabel(m) { const mm = ((m % DAY_MIN)+DAY_MIN)%DAY_MIN; return `${z2(Math.floor(mm/60))}:${z2(mm%60)}`; }

function buildTicks(tz) {
  const start = TZ_START[tz] || '06:00';
  const end = start; // terminal next-day tick
  const step = 30;
  const s = tToMin(start); let e = tToMin(end); if (e <= s) e += DAY_MIN;
  const ticks = [];
  for (let m = s; m <= e; m += step) ticks.push(minToLabel(m));
  return ticks; // includes terminal label
}

function normalizeTimeCell(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const total = Math.round(v * DAY_MIN);
    const h = Math.floor(total/60) % 24; const m = total % 60;
    return `${z2(h)}:${z2(m)}`;
  }
  if (v instanceof Date) {
    return `${z2(v.getHours())}:${z2(v.getMinutes())}`;
  }
  const s = String(v).trim();
  const parsed = new Date(`1970-01-01T${s.replace(' ', '')}`);
  if (!isNaN(parsed.getTime())) return `${z2(parsed.getHours())}:${z2(parsed.getMinutes())}`;
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) return `${z2(Number(m[1]))}:${z2(Number(m[2]))}`;
  return null;
}

function normalizeDateISO(v) {
  if (v == null || v === '') return null;
  if (v instanceof Date) return v.toISOString().slice(0,10);
  if (typeof v === 'number') {
    const excelEpoch = new Date(1900, 0, 1);
    const d = new Date(excelEpoch.getTime() + (v - 2) * 86400000);
    return d.toISOString().slice(0,10);
  }
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
  const m = String(v).match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function weekdayFromISO(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  const idx = d.getUTCDay(); // 0..6 Sun..Sat
  const map = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return map[idx];
}

function emptyDay(dateISO, tz) {
  const ticks = buildTicks(tz).slice(0, -1); // slot labels only
  return { date: dateISO, day: weekdayFromISO(dateISO), slots: ticks.map(t => ({ time: t, shows: [] })) };
}

function ensureTzSchedule(tv, region, tz, dateSeeds) {
  if (!tv.regions[region]) tv.regions[region] = { region, timezones: { WAT: null, CAT: null, EAT: null } };
  if (!tv.regions[region].timezones[tz]) {
    // Build 7 days scaffold using provided seeds or synthesize consecutive dates starting from earliest
    const seeds = Object.assign({}, dateSeeds);
    let earliest = Object.values(seeds).filter(Boolean).sort()[0];
    if (!earliest) {
      // default: Monday of current week
      const base = new Date();
      const delta = (base.getUTCDay() + 6) % 7; // Mon=0
      base.setUTCDate(base.getUTCDate() - delta);
      earliest = base.toISOString().slice(0,10);
    }
    const start = new Date(earliest + 'T00:00:00Z');
    const days = {};
    WEEKDAYS.forEach((wd, i) => {
      const d = new Date(start); d.setUTCDate(d.getUTCDate() + i);
      const iso = d.toISOString().slice(0,10);
      days[wd] = emptyDay(iso, tz);
    });
    tv.regions[region].timezones[tz] = { timezone: tz, days };
  }
}

function placeShow(tzSched, tz, dateISO, title, startLabel, endLabel, season, episode) {
  const dayName = weekdayFromISO(dateISO);
  const day = tzSched.days[dayName];
  if (!day) return;

  // clamp and map into window coordinates relative to tz start
  const ws = tToMin(TZ_START[tz]);
  let ss = tToMin(startLabel);
  let se = tToMin(endLabel);
  if (se <= ss) se += DAY_MIN; // cross-midnight
  let we = tToMin(TZ_START[tz]); if (we <= ws) we += DAY_MIN; // terminal next-day
  const startOff = ((ss - ws + DAY_MIN) % DAY_MIN);
  const endOff = ((se - ws + DAY_MIN) % DAY_MIN) || DAY_MIN;
  if (endOff <= 0 || endOff <= startOff) return;

  const startIdx = Math.floor(startOff / 30);
  const endIdx = Math.ceil(endOff / 30);
  const idx = Math.min(Math.max(startIdx, 0), day.slots.length - 1);

  const show = { title, start: startLabel, end: endLabel };
  if (season && episode) { show.season = season; show.episode = episode; }
  day.slots[idx].shows.push(show);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let input = '', output = '';
  let forceRegion = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--in' && args[i+1]) { input = args[i+1]; i++; }
    else if (args[i] === '--out' && args[i+1]) { output = args[i+1]; i++; }
    else if (args[i] === '--force-region' && args[i+1]) { forceRegion = String(args[i+1]).toUpperCase(); i++; }
  }
  if (!input || !output) {
    console.error('Usage: node scripts/zonke-excel-to-tvguide.js --in "/path/file.xlsx" --out "public/out.json"');
    process.exit(1);
  }
  return { input, output, forceRegion };
}

function main() {
  const { input, output, forceRegion } = parseArgs();
  console.log('🚀 Zonke Excel → TvGuideData');
  console.log('📥', input);
  console.log('📤', output);

  const wb = XLSX.readFile(input, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
  if (!rows.length) {
    console.error('❌ Empty sheet');
    process.exit(1);
  }

  // Header mapping by name
  const header = rows[0].map(h => (h || '').toString().trim());
  const idx = {
    region: header.indexOf('Region'),
    date: header.indexOf('Date'),
    start: header.indexOf('Start Time'),
    end: header.indexOf('End Time'),
    title: header.indexOf('Title'),
    season: header.indexOf('Season'),
    episode: header.indexOf('Episode'),
    timezone: header.indexOf('Timezone'),
  };

  const required = ['date','start','end','title'];
  for (const k of required) {
    if (idx[k] === -1) {
      console.error(`❌ Missing required header: ${k}`);
      process.exit(1);
    }
  }

  const tv = {
    window: {
      WAT: { start: '05:00', end: '05:00' },
      CAT: { start: '06:00', end: '06:00' },
      EAT: { start: '06:00', end: '06:00' },
      slotMinutes: 30,
    },
    regions: {}
  };

  // Seed dates per weekday per region/tz encountered
  const dateSeeds = { SA: { WAT: {}, CAT: {}, EAT: {} }, ROA: { WAT: {}, CAT: {}, EAT: {} } };

  let placed = 0; let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]; if (!row || !row.length) continue;
    const regionCell = idx.region !== -1 ? row[idx.region] : null;
    // Default to SA when Region is missing; allow override via --force-region
    let region = (regionCell && String(regionCell).trim()) || 'SA';
    if (forceRegion === 'SA' || forceRegion === 'ROA') region = forceRegion;
    const tzCell = idx.timezone !== -1 ? row[idx.timezone] : null;
    const tzRaw = tzCell ? String(tzCell).trim().toUpperCase() : (region === 'SA' ? 'CAT' : 'WAT');
    const tz = ['WAT','CAT','EAT'].includes(tzRaw) ? tzRaw : (region === 'SA' ? 'CAT' : 'WAT');

    const dateISO = normalizeDateISO(row[idx.date]);
    const title = row[idx.title] != null ? String(row[idx.title]).trim() : '';
    const start = normalizeTimeCell(row[idx.start]);
    const end = normalizeTimeCell(row[idx.end]);
    const season = idx.season !== -1 ? (row[idx.season] ? String(row[idx.season]).trim() : '') : '';
    const episode = idx.episode !== -1 ? (row[idx.episode] ? String(row[idx.episode]).trim() : '') : '';

    if (!dateISO || !title || !start || !end) { skipped++; continue; }

    const wd = weekdayFromISO(dateISO);
    dateSeeds[region][tz][wd] = dateISO;
    ensureTzSchedule(tv, region, tz, dateSeeds[region][tz]);
    const tzSched = tv.regions[region].timezones[tz];

    placeShow(tzSched, tz, dateISO, title, start, end, season, episode);
    placed++;
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(tv, null, 2), 'utf8');
  console.log(`✅ Wrote TvGuideData to ${output}`);
  console.log(`📊 Placed ${placed} shows, skipped ${skipped}`);
}

if (require.main === module) {
  main();
}


