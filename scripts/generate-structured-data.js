/**
 * Generate Structured TV Guide Data
 * 
 * Creates sample data that matches the specific time structures:
 * - SA: CAT timezone, 6:00 AM - 5:30 AM next day, 30-min intervals
 * - ROA: WAT (5:00 AM - 4:00 AM) and CAT (6:00 AM - 5:00 AM), 30-min intervals
 * - Starts from Monday of current week
 */

const fs = require('fs');

// Helper function to get Monday of current week
function getMondayOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split('T')[0];
}

// Helper function to add days to a date
function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Helper function to create time slots for SA (6:00 AM - 5:30 AM next day)
function createSASlots(dateISO) {
  const slots = [];
  const shows = [
    "Ringside Rebel S1 EP 278",
    "Twist of Fate: New Era S10 EP73",
    "Hidden Intentions S1 EP 57",
    "Betrayal S1 EP 271",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep120",
    "Radhe Mohan: First Name of Love S4 Ep56",
    "Twist of Fate: New Era S10 EP73",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep121",
    "Mehek S2 Ep57",
    "Married Again S1 Ep10",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Betrayal S1 EP 272",
    "King of Hearts S1 Ep121",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Hidden Intentions S1 EP 58",
    "Betrayal S1 EP 272",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Married Again S1 Ep10",
    "Mehek S2 Ep57",
    "Ringside Rebel S1 EP 280",
    "Twist of Fate: New Era S10 EP75",
    "Hidden Intentions S1 EP 59",
    "Betrayal S1 EP 273",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep122",
    "Radhe Mohan: First Name of Love S4 Ep58",
    "Twist of Fate: New Era S10 EP75",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep123",
    "Mehek S2 Ep58",
    "Married Again S1 Ep11",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Betrayal S1 EP 274",
    "King of Hearts S1 Ep123",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Hidden Intentions S1 EP 60",
    "Betrayal S1 EP 274",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Married Again S1 Ep11",
    "Mehek S2 Ep58"
  ];

  let showIndex = 0;

  // 6:00 AM to 11:30 PM (same day)
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(`${dateISO}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+02:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  // 12:00 AM to 5:30 AM (next day)
  for (let hour = 0; hour <= 5; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 5 && minute === 30) break; // Stop at 5:30 AM
      
      const nextDay = addDays(dateISO, 1);
      const startTime = new Date(`${nextDay}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+02:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  return slots;
}

// Helper function to create time slots for ROA WAT (5:00 AM - 4:00 AM next day)
function createROAWATSlots(dateISO) {
  const slots = [];
  const shows = [
    "Radhe Mohan S3 EP 68",
    "Twist of Fate: New Era S10 EP73",
    "Hidden Intentions S1 EP 57",
    "Betrayal S1 EP 271",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep120",
    "Radhe Mohan: First Name of Love S4 Ep56",
    "Twist of Fate: New Era S10 EP73",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep121",
    "Mehek S2 Ep57",
    "Married Again S1 Ep10",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Betrayal S1 EP 272",
    "King of Hearts S1 Ep121",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Hidden Intentions S1 EP 58",
    "Betrayal S1 EP 272",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Married Again S1 Ep10",
    "Mehek S2 Ep57",
    "Ringside Rebel S1 EP 280",
    "Twist of Fate: New Era S10 EP75",
    "Hidden Intentions S1 EP 59",
    "Betrayal S1 EP 273",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep122",
    "Radhe Mohan: First Name of Love S4 Ep58",
    "Twist of Fate: New Era S10 EP75",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep123",
    "Mehek S2 Ep58",
    "Married Again S1 Ep11",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Betrayal S1 EP 274",
    "King of Hearts S1 Ep123",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Hidden Intentions S1 EP 60",
    "Betrayal S1 EP 274",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Married Again S1 Ep11",
    "Mehek S2 Ep58"
  ];

  let showIndex = 0;

  // 5:00 AM to 11:30 PM (same day)
  for (let hour = 5; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(`${dateISO}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+01:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  // 12:00 AM to 4:00 AM (next day)
  for (let hour = 0; hour <= 4; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const nextDay = addDays(dateISO, 1);
      const startTime = new Date(`${nextDay}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+01:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  return slots;
}

// Helper function to create time slots for ROA CAT (6:00 AM - 5:00 AM next day)
function createROACATSlots(dateISO) {
  const slots = [];
  const shows = [
    "Radhe Mohan S3 EP 68",
    "Twist of Fate: New Era S10 EP73",
    "Hidden Intentions S1 EP 57",
    "Betrayal S1 EP 271",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep120",
    "Radhe Mohan: First Name of Love S4 Ep56",
    "Twist of Fate: New Era S10 EP73",
    "Secrets S1 EP 51",
    "Taxi S1 EP 51",
    "King of Hearts S1 Ep121",
    "Mehek S2 Ep57",
    "Married Again S1 Ep10",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Betrayal S1 EP 272",
    "King of Hearts S1 Ep121",
    "Ringside Rebel S1 EP 279",
    "Radhe Mohan: First Name of Love S4 Ep57",
    "Twist of Fate: New Era S10 EP74",
    "Hidden Intentions S1 EP 58",
    "Betrayal S1 EP 272",
    "Secrets S1 EP 52",
    "Taxi S1 EP 52",
    "Married Again S1 Ep10",
    "Mehek S2 Ep57",
    "Ringside Rebel S1 EP 280",
    "Twist of Fate: New Era S10 EP75",
    "Hidden Intentions S1 EP 59",
    "Betrayal S1 EP 273",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep122",
    "Radhe Mohan: First Name of Love S4 Ep58",
    "Twist of Fate: New Era S10 EP75",
    "Secrets S1 EP 53",
    "Taxi S1 EP 53",
    "King of Hearts S1 Ep123",
    "Mehek S2 Ep58",
    "Married Again S1 Ep11",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Betrayal S1 EP 274",
    "King of Hearts S1 Ep123",
    "Ringside Rebel S1 EP 281",
    "Radhe Mohan: First Name of Love S4 Ep59",
    "Twist of Fate: New Era S10 EP76",
    "Hidden Intentions S1 EP 60",
    "Betrayal S1 EP 274",
    "Secrets S1 EP 54",
    "Taxi S1 EP 54",
    "Married Again S1 Ep11",
    "Mehek S2 Ep58"
  ];

  let showIndex = 0;

  // 6:00 AM to 11:30 PM (same day)
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(`${dateISO}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+02:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  // 12:00 AM to 5:00 AM (next day)
  for (let hour = 0; hour <= 5; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 5 && minute === 30) break; // Stop at 5:00 AM (no 5:30)
      
      const nextDay = addDays(dateISO, 1);
      const startTime = new Date(`${nextDay}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+02:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        title: shows[showIndex % shows.length],
        durationMin: 30
      });
      showIndex++;
    }
  }

  return slots;
}

// Generate SA data
function generateSAData() {
  const monday = getMondayOfCurrentWeek();
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const dateISO = addDays(monday, i);
    days.push({
      dateISO,
      slots: createSASlots(dateISO)
    });
  }
  
  return {
    metadata: {
      channelId: "zee-world-sa",
      generatedAt: new Date().toISOString(),
      defaultRegion: "SA",
      defaultTimezone: "CAT"
    },
    regions: [
      {
        code: "SA",
        label: "South Africa",
        timezones: ["CAT"],
        days
      }
    ]
  };
}

// Generate ROA data
function generateROAData() {
  const monday = getMondayOfCurrentWeek();
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const dateISO = addDays(monday, i);
    days.push({
      dateISO,
      slots: createROAWATSlots(dateISO) // Using WAT as base, CAT will be calculated
    });
  }
  
  return {
    metadata: {
      channelId: "zee-world-roa",
      generatedAt: new Date().toISOString(),
      defaultRegion: "ROA",
      defaultTimezone: "WAT"
    },
    regions: [
      {
        code: "ROA",
        label: "Rest of Africa",
        timezones: ["WAT", "CAT"],
        days
      }
    ]
  };
}

// Generate and save the data
console.log('Generating structured TV guide data...');

const saData = generateSAData();
const roaData = generateROAData();

// Ensure public directory exists
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

// Write SA data
fs.writeFileSync('./public/sa-guide.json', JSON.stringify(saData, null, 2));
console.log('✅ SA guide data written to ./public/sa-guide.json');

// Write ROA data
fs.writeFileSync('./public/roa-guide.json', JSON.stringify(roaData, null, 2));
console.log('✅ ROA guide data written to ./public/roa-guide.json');

console.log('\n📊 Data Summary:');
console.log(`SA: ${saData.regions[0].days.length} days, ${saData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
console.log(`ROA: ${roaData.regions[0].days.length} days, ${roaData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);

console.log('\n🎯 Time Structures:');
console.log('SA: CAT timezone, 6:00 AM - 5:30 AM next day, 30-min intervals');
console.log('ROA WAT: 5:00 AM - 4:00 AM next day, 30-min intervals');
console.log('ROA CAT: 6:00 AM - 5:00 AM next day, 30-min intervals');

const monday = getMondayOfCurrentWeek();
console.log('\n📅 Week starts from:', monday);
console.log('📅 Week ends on:', addDays(monday, 6));
