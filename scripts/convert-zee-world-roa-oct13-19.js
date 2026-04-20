const XLSX = require('xlsx');
const fs = require('fs');

// Read Excel file
const wb = XLSX.readFile('/Users/danieleloma/Downloads/Channel TV Guide/Zee World OCTOBER 25 FPC ROA (13th - 19th).xlsx', { cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

console.log('📊 Processing', rows.length, 'rows...');

// Helper functions
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function normDay(dateStr) {
  const d = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

function parseTime(val) {
  if (!val) return null;
  const s = String(val).trim();
  const match = s.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    return match[1].padStart(2, '0') + ':' + match[2];
  }
  return null;
}

function cleanSeasonEpisode(val) {
  if (!val) return null;
  const s = String(val).trim().toUpperCase();
  // Extract numbers from formats like 'S4', 'EP15', '4', etc.
  const match = s.match(/(\d+)/);
  return match ? match[1] : null;
}

// Build empty schedules for both timezones
const watSlots = [];
for (let h = 5; h < 24; h++) {
  watSlots.push(h.toString().padStart(2, '0') + ':00');
  watSlots.push(h.toString().padStart(2, '0') + ':30');
}
for (let h = 0; h < 4; h++) {
  watSlots.push(h.toString().padStart(2, '0') + ':00');
  watSlots.push(h.toString().padStart(2, '0') + ':30');
}
watSlots.push('04:00');
watSlots.push('04:30');

const catSlots = [];
for (let h = 6; h < 24; h++) {
  catSlots.push(h.toString().padStart(2, '0') + ':00');
  catSlots.push(h.toString().padStart(2, '0') + ':30');
}
for (let h = 0; h < 5; h++) {
  catSlots.push(h.toString().padStart(2, '0') + ':00');
  catSlots.push(h.toString().padStart(2, '0') + ':30');
}
catSlots.push('05:30');

// Get dates for each day
const dayDates = new Map();
for (const r of rows) {
  const dateStr = r['Date'];
  if (dateStr) {
    const day = normDay(dateStr);
    if (!dayDates.has(day)) {
      dayDates.set(day, dateStr);
    }
  }
}

// Initialize WAT and CAT schedules
const watDays = {};
const catDays = {};
WEEKDAYS.forEach(day => {
  watDays[day] = {
    date: dayDates.get(day) || '2025-10-13',
    day: day,
    slots: watSlots.map(t => ({ time: t, shows: [] }))
  };
  catDays[day] = {
    date: dayDates.get(day) || '2025-10-13',
    day: day,
    slots: catSlots.map(t => ({ time: t, shows: [] }))
  };
});

// Place shows
let watPlaced = 0;
let catPlaced = 0;

for (const r of rows) {
  const dateStr = r['Date'];
  const title = r['Title']?.trim();
  const start = parseTime(r['Start Time']);
  const end = parseTime(r['End Time']);
  const timezone = r['Timezone']?.trim();
  const season = cleanSeasonEpisode(r['Season']);
  const episode = cleanSeasonEpisode(r['Episode']);
  
  if (!dateStr || !title || !start || !end || !timezone) continue;
  
  const day = normDay(dateStr);
  
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

// Build final structure
const tvGuideData = {
  window: {
    WAT: { start: '05:00', end: '04:00' },
    CAT: { start: '06:00', end: '05:00' },
    EAT: { start: '06:00', end: '05:00' },
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

// Write output
const outputPath = 'public/zee-world-roa-oct13-19.json';
fs.writeFileSync(outputPath, JSON.stringify(tvGuideData, null, 2), 'utf8');

console.log('✅ Conversion complete!');
console.log('📁 Output:', outputPath);
console.log('📊 WAT shows placed:', watPlaced);
console.log('📊 CAT shows placed:', catPlaced);
console.log('📅 Days covered:', [...dayDates.keys()].join(', '));
console.log('🕐 Timezones: WAT, CAT');



