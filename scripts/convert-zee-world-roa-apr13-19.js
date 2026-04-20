const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('TV Schedules/Zee World/April/Zee World APRIL 2026 FPC ROA (13th-19th) Edited.xlsx', { cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

console.log('📊 Processing', rows.length, 'rows...');

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function normDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
}

function parseTime(val) {
  if (!val) return null;
  const match = String(val).trim().match(/^(\d{1,2}):(\d{2})/);
  return match ? match[1].padStart(2, '0') + ':' + match[2] : null;
}

function cleanNum(val) {
  if (!val) return null;
  const match = String(val).trim().match(/(\d+)/);
  return match ? match[1] : null;
}

// WAT slots: 05:00 to 04:30 next day
const watSlots = [];
for (let h = 5; h < 24; h++) {
  watSlots.push(h.toString().padStart(2, '0') + ':00');
  watSlots.push(h.toString().padStart(2, '0') + ':30');
}
for (let h = 0; h < 5; h++) {
  watSlots.push(h.toString().padStart(2, '0') + ':00');
  watSlots.push(h.toString().padStart(2, '0') + ':30');
}

// CAT slots: 06:00 to 05:30 next day
const catSlots = [];
for (let h = 6; h < 24; h++) {
  catSlots.push(h.toString().padStart(2, '0') + ':00');
  catSlots.push(h.toString().padStart(2, '0') + ':30');
}
for (let h = 0; h < 6; h++) {
  catSlots.push(h.toString().padStart(2, '0') + ':00');
  catSlots.push(h.toString().padStart(2, '0') + ':30');
}

// Collect dates per day
const dayDates = new Map();
for (const r of rows) {
  if (r['Date']) {
    const day = normDay(r['Date']);
    if (!dayDates.has(day)) dayDates.set(day, r['Date']);
  }
}

// Initialize WAT and CAT days
const watDays = {};
const catDays = {};
WEEKDAYS.forEach(day => {
  watDays[day] = {
    date: dayDates.get(day) || '',
    day,
    slots: watSlots.map(t => ({ time: t, shows: [] }))
  };
  catDays[day] = {
    date: dayDates.get(day) || '',
    day,
    slots: catSlots.map(t => ({ time: t, shows: [] }))
  };
});

let watPlaced = 0;
let catPlaced = 0;

for (const r of rows) {
  const title = r['Title']?.trim();
  const start = parseTime(r['Start Time']);
  const end = parseTime(r['End Time']);
  const timezone = r['Timezone']?.trim();
  const dateStr = r['Date'];

  if (!dateStr || !title || !start || !end) continue;

  const day = normDay(dateStr);
  const season = cleanNum(r['Season']);
  const episode = cleanNum(r['Episode']);

  const show = {
    title,
    start,
    end,
    ...(season && episode ? { season, episode } : {})
  };

  if (timezone === 'WAT') {
    const slotIdx = watSlots.indexOf(start);
    if (slotIdx >= 0 && watDays[day]) {
      watDays[day].slots[slotIdx].shows.push(show);
      watPlaced++;
    }
  } else if (timezone === 'CAT') {
    const slotIdx = catSlots.indexOf(start);
    if (slotIdx >= 0 && catDays[day]) {
      catDays[day].slots[slotIdx].shows.push(show);
      catPlaced++;
    }
  }
}

const tvGuideData = {
  window: {
    WAT: { start: '05:00', end: '05:00' },
    CAT: { start: '06:00', end: '06:00' },
    EAT: { start: '06:00', end: '06:00' },
    slotMinutes: 30
  },
  regions: {
    ROA: {
      region: 'ROA',
      timezones: {
        WAT: {
          timezone: 'WAT',
          days: watDays
        },
        CAT: {
          timezone: 'CAT',
          days: catDays
        },
        EAT: null
      }
    }
  }
};

const outputPath = 'public/zee-world-roa-apr13-19-tvguide.json';
fs.writeFileSync(outputPath, JSON.stringify(tvGuideData, null, 2), 'utf8');

console.log('✅ Done!');
console.log('📁 Output:', outputPath);
console.log('📊 WAT shows placed:', watPlaced);
console.log('📊 CAT shows placed:', catPlaced);
console.log('📅 Days:', [...dayDates.entries()].map(([d, dt]) => `${d} (${dt})`).join(', '));
