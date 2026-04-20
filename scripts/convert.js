#!/usr/bin/env node
/**
 * Unified Excel → TvGuideData converter
 *
 * Auto-detects channel and region from the filename and writes to public/.
 *
 * Usage:
 *   node scripts/convert.js "/path/to/file.xlsx"
 *   node scripts/convert.js "/path/to/file.xlsx" --out "public/custom-name.json"
 *
 * Supported channels (detected from filename):
 *   Zee World SA  → zee-world-sa-<mon><d1>-<d2>-tvguide.json  (SA / CAT only)
 *   Zee World ROA → zee-world-roa-<mon><d1>-<d2>-tvguide.json (ROA / WAT + CAT)
 *   Zee Zonke     → zee-zonke-<mon><d1>-<d2>-tvguide.json
 *   Zee Dunia     → zee-dunia-<mon><d1>-<d2>-tvguide.json
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

// ─── helpers ────────────────────────────────────────────────────────────────

const DAY_MIN  = 24 * 60;
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const TZ_START = { WAT: '05:00', CAT: '06:00', EAT: '06:00' };

const MONTHS = {
  january:'jan', february:'feb', march:'mar', april:'apr',
  may:'may', june:'jun', july:'jul', august:'aug',
  september:'sep', october:'oct', november:'nov', december:'dec',
};

function z2(n) { return String(n).padStart(2,'0'); }
function tToMin(t) { const [h,m]=t.split(':').map(Number); return (h*60+m)%DAY_MIN; }
function minToLabel(m) { const mm=((m%DAY_MIN)+DAY_MIN)%DAY_MIN; return `${z2(Math.floor(mm/60))}:${z2(mm%60)}`; }

function buildSlots(tz) {
  const s = tToMin(TZ_START[tz]);
  let e = s; // wraps full 24 h
  const slots = [];
  for (let m = s; m < s + DAY_MIN; m += 30) slots.push(minToLabel(m));
  return slots;
}

function normalizeTime(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const tot = Math.round(v * DAY_MIN);
    return `${z2(Math.floor(tot/60)%24)}:${z2(tot%60)}`;
  }
  if (v instanceof Date) return `${z2(v.getHours())}:${z2(v.getMinutes())}`;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  return m ? `${z2(Number(m[1]))}:${z2(Number(m[2]))}` : null;
}

function normalizeDate(v) {
  if (v == null || v === '') return null;
  if (v instanceof Date) return v.toISOString().slice(0,10);
  if (typeof v === 'number') {
    const d = new Date(new Date(1900,0,1).getTime() + (v-2)*86400000);
    return d.toISOString().slice(0,10);
  }
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
  const m = String(v).match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function weekday(iso) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(iso+'T12:00:00Z').getUTCDay()];
}

function cleanNum(v) {
  if (!v) return '';
  const m = String(v).trim().match(/(\d+)/);
  return m ? m[1] : '';
}

// ─── filename → channel metadata ────────────────────────────────────────────

function detectChannel(filePath) {
  const name = path.basename(filePath);
  const low  = name.toLowerCase();

  // Channel
  let channel, slug;
  if (/zee.one/i.test(name)) {
    if (/\bsa\b/i.test(name)) { channel = 'zee-one-sa'; }
    else if (/\broa\b/i.test(name)) { channel = 'zee-one-roa'; }
    else { channel = 'zee-one'; }
  } else if (/zee.world/i.test(name)) {
    if (/\bsa\b/i.test(name)) { channel = 'zee-world-sa'; }
    else if (/\broa\b/i.test(name)) { channel = 'zee-world-roa'; }
    else { channel = 'zee-world'; }
  } else if (/zee.zonke/i.test(name)) {
    channel = 'zee-zonke';
  } else if (/dunia/i.test(name)) {
    channel = 'zee-dunia';
  } else {
    channel = 'unknown';
  }

  // Month
  let mon = '';
  for (const [full, abbr] of Object.entries(MONTHS)) {
    if (low.includes(full)) { mon = abbr; break; }
  }

  // Date range  e.g. (13th-19th) or (April 13th - 19th)
  const dateMatch = name.match(/\(\s*(?:[A-Za-z]+\s+)?(\d+)[a-z]*\s*[-–]\s*(\d+)/i);
  const d1 = dateMatch ? dateMatch[1] : '';
  const d2 = dateMatch ? dateMatch[2] : '';

  const datePart = (mon && d1 && d2) ? `${mon}${d1}-${d2}` : '';
  const outName  = datePart ? `${channel}-${datePart}-tvguide.json` : `${channel}-tvguide.json`;

  return { channel, outName };
}

// ─── region / timezone config ────────────────────────────────────────────────

function channelConfig(channel) {
  // Returns { defaultRegion, tzList }
  // tzList controls which timezones we output (null = not present in file)
  if (channel === 'zee-world-sa') return { defaultRegion: 'SA',  tzList: ['CAT'] };
  if (channel === 'zee-world-roa') return { defaultRegion: 'ROA', tzList: ['WAT','CAT'] };
  // Zonke and Dunia: honour Region column; fall back to ROA
  return { defaultRegion: null, tzList: ['WAT','CAT'] };
}

// ─── conversion ──────────────────────────────────────────────────────────────

function convert(inputPath, outputPath) {
  const wb   = XLSX.readFile(inputPath, { cellDates: true });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
  if (!rows.length) { console.error('Empty sheet'); process.exit(1); }

  const hdr = rows[0].map(h => (h||'').toString().trim());
  const col = {
    region:   hdr.indexOf('Region'),
    date:     hdr.indexOf('Date'),
    start:    hdr.indexOf('Start Time'),
    end:      hdr.indexOf('End Time'),
    title:    hdr.indexOf('Title'),
    season:   hdr.indexOf('Season'),
    episode:  hdr.indexOf('Episode'),
    timezone: hdr.indexOf('Timezone'),
  };

  for (const k of ['date','start','end','title']) {
    if (col[k] === -1) { console.error(`Missing column: ${k}`); process.exit(1); }
  }

  const { channel, outName } = detectChannel(inputPath);
  const cfg = channelConfig(channel);

  // Build output skeleton: { regionKey → { tzKey → { dayName → dayObj } } }
  const slotMap  = {};  // tz → slot array
  const schedule = {}; // regionKey → tzKey → { timezone, days: {} }

  function getOrCreateDay(region, tz, iso) {
    if (!schedule[region]) schedule[region] = {};
    if (!schedule[region][tz]) {
      slotMap[tz] = slotMap[tz] || buildSlots(tz);
      schedule[region][tz] = { timezone: tz, days: {} };
    }
    const wd = weekday(iso);
    if (!schedule[region][tz].days[wd]) {
      schedule[region][tz].days[wd] = {
        date: iso, day: wd,
        slots: (slotMap[tz] || buildSlots(tz)).map(t => ({ time: t, shows: [] })),
      };
    }
    return schedule[region][tz].days[wd];
  }

  let placed = 0, skipped = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row.length) continue;

    const iso   = normalizeDate(row[col.date]);
    const title = row[col.title] != null ? String(row[col.title]).trim() : '';
    const start = normalizeTime(row[col.start]);
    const end   = normalizeTime(row[col.end]);

    if (!iso || !title || !start || !end) { skipped++; continue; }

    const regionCell = col.region !== -1 ? row[col.region] : null;
    const region     = cfg.defaultRegion
      || (regionCell ? String(regionCell).trim().toUpperCase() : 'ROA');

    const tzCell = col.timezone !== -1 ? row[col.timezone] : null;
    const tzRaw  = tzCell ? String(tzCell).trim().toUpperCase() : '';
    const tz     = ['WAT','CAT','EAT'].includes(tzRaw)
      ? tzRaw
      : (region === 'SA' ? 'CAT' : 'WAT');

    const day    = getOrCreateDay(region, tz, iso);
    const slots  = slotMap[tz] || buildSlots(tz);
    const idx    = slots.indexOf(start);
    if (idx < 0) { skipped++; continue; }

    const season  = cleanNum(col.season  !== -1 ? row[col.season]  : null);
    const episode = cleanNum(col.episode !== -1 ? row[col.episode] : null);
    const show    = { title, start, end, ...(season && episode ? { season, episode } : {}) };
    day.slots[idx].shows.push(show);
    placed++;
  }

  // ─── assemble final JSON ───────────────────────────────────────────────────

  const tv = {
    window: {
      WAT: { start: '05:00', end: '05:00' },
      CAT: { start: '06:00', end: '06:00' },
      EAT: { start: '06:00', end: '06:00' },
      slotMinutes: 30,
    },
    regions: {},
  };

  for (const [regionKey, tzMap] of Object.entries(schedule)) {
    tv.regions[regionKey] = {
      region: regionKey,
      timezones: {
        WAT: tzMap['WAT'] || null,
        CAT: tzMap['CAT'] || null,
        EAT: tzMap['EAT'] || null,
      },
    };
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(tv, null, 2), 'utf8');

  console.log(`✅ ${outputPath}`);
  console.log(`   Placed ${placed} shows  |  skipped ${skipped} empty rows`);

  // Summary per region/tz
  for (const [reg, tzMap] of Object.entries(schedule)) {
    for (const [tz, sched] of Object.entries(tzMap)) {
      const days = Object.keys(sched.days).join(', ');
      console.log(`   ${reg}/${tz}: ${days}`);
    }
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log([
      'Usage:',
      '  node scripts/convert.js "<path/to/file.xlsx>"',
      '  node scripts/convert.js "<path/to/file.xlsx>" --out "public/custom.json"',
      '',
      'Channels auto-detected from filename:',
      '  Zee World … SA  → zee-world-sa-<mon><d1>-<d2>-tvguide.json',
      '  Zee World … ROA → zee-world-roa-<mon><d1>-<d2>-tvguide.json',
      '  Zee Zonke       → zee-zonke-<mon><d1>-<d2>-tvguide.json',
      '  Zee Dunia       → zee-dunia-<mon><d1>-<d2>-tvguide.json',
    ].join('\n'));
    process.exit(0);
  }

  const inputPath = args[0];
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  let outputPath = '';
  const outIdx = args.indexOf('--out');
  if (outIdx !== -1 && args[outIdx+1]) {
    outputPath = args[outIdx+1];
  } else {
    const { outName } = detectChannel(inputPath);
    outputPath = path.join('public', outName);
  }

  console.log(`Converting: ${path.basename(inputPath)}`);
  convert(inputPath, outputPath);
}

main();
