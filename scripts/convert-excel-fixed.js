/**
 * Fixed Excel to JSON Converter
 * 
 * Properly interprets the Excel structure and converts to the correct JSON format
 * with all 7 days and correct show titles/times.
 */

const XLSX = require('xlsx');
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

// Helper function to convert decimal hours to time string
function decimalToTime(decimal) {
  const totalMinutes = Math.round(decimal * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to normalize show title
function normalizeShowTitle(title) {
  if (!title) return '';
  if (typeof title === 'string') return title.trim();
  if (typeof title === 'number') return title.toString();
  return String(title).trim();
}

// Helper function to convert time to UTC ISO for SA (CAT timezone)
function timeToUTCISO_SA(dateISO, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${timeStr}:00+02:00`); // CAT is UTC+2
  
  if (isNaN(dateTime.getTime())) {
    console.warn(`Invalid date/time: ${dateISO}T${timeStr}:00+02:00`);
    return null;
  }
  
  return dateTime.toISOString();
}

// Helper function to convert time to UTC ISO for ROA WAT
function timeToUTCISO_ROA_WAT(dateISO, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${timeStr}:00+01:00`); // WAT is UTC+1
  
  if (isNaN(dateTime.getTime())) {
    console.warn(`Invalid date/time: ${dateISO}T${timeStr}:00+01:00`);
    return null;
  }
  
  return dateTime.toISOString();
}

// Convert SA Excel to JSON with proper structure
function convertSAExcelFixed(filePath) {
  console.log(`\n📊 Converting SA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Find the data structure - look for time slots and shows
  const timeSlots = [];
  const shows = [];
  
  // Process each row starting from row 2 (index 2) to find time slots and shows
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number' && timeSlot >= 0 && timeSlot <= 1) {
        // This is a time slot (decimal hours)
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  console.log(`First few time slots:`, timeSlots.slice(0, 5));
  console.log(`First few shows:`, shows.slice(0, 3));
  
  // Generate SA data (CAT timezone, 6:00 AM - 5:30 AM next day)
  const monday = getMondayOfCurrentWeek();
  const saDays = [];
  
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each time slot for this day
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      const timeSlot = timeSlots[timeIndex];
      const showTitle = shows[timeIndex][dayIndex];
      
      const normalizedTitle = normalizeShowTitle(showTitle);
      if (normalizedTitle && normalizedTitle !== '') {
        const startTime = decimalToTime(timeSlot);
        const endTime = decimalToTime(timeSlot + 0.5); // 30-minute slots
        
        // Convert to UTC (CAT is UTC+2)
        const startISO = timeToUTCISO_SA(dateISO, startTime);
        const endISO = timeToUTCISO_SA(dateISO, endTime);
        
        if (startISO && endISO) {
          daySlots.push({
            startISO,
            endISO,
            title: normalizedTitle,
            durationMin: 30
          });
        }
      }
    }
    
    saDays.push({
      dateISO,
      slots: daySlots
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
        days: saDays
      }
    ]
  };
}

// Convert ROA Excel to JSON with proper structure
function convertROAExcelFixed(filePath) {
  console.log(`\n📊 Converting ROA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Find the data structure - look for time slots and shows
  const timeSlots = [];
  const shows = [];
  
  // Process each row starting from row 2 (index 2) to find time slots and shows
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number' && timeSlot >= 0 && timeSlot <= 1) {
        // This is a time slot (decimal hours)
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  console.log(`First few time slots:`, timeSlots.slice(0, 5));
  console.log(`First few shows:`, shows.slice(0, 3));
  
  // Generate ROA data (WAT timezone, 5:00 AM - 4:00 AM next day)
  const monday = getMondayOfCurrentWeek();
  const roaDays = [];
  
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each time slot for this day
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      const timeSlot = timeSlots[timeIndex];
      const showTitle = shows[timeIndex][dayIndex];
      
      const normalizedTitle = normalizeShowTitle(showTitle);
      if (normalizedTitle && normalizedTitle !== '') {
        const startTime = decimalToTime(timeSlot);
        const endTime = decimalToTime(timeSlot + 0.5); // 30-minute slots
        
        // Convert to UTC (WAT is UTC+1)
        const startISO = timeToUTCISO_ROA_WAT(dateISO, startTime);
        const endISO = timeToUTCISO_ROA_WAT(dateISO, endTime);
        
        if (startISO && endISO) {
          daySlots.push({
            startISO,
            endISO,
            title: normalizedTitle,
            durationMin: 30
          });
        }
      }
    }
    
    roaDays.push({
      dateISO,
      slots: daySlots
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
        days: roaDays
      }
    ]
  };
}

// Main conversion function
function convertExcelFilesFixed() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Usage: node convert-excel-fixed.js <sa-excel-file> <roa-excel-file>

Example:
  node convert-excel-fixed.js "Zee World OCTOBER 25 FPC SA.xlsx" "Zee World OCTOBER 25 FPC ROA.xlsx"

This will convert both Excel files to the proper JSON format
with all 7 days and correct show titles/times.
    `);
    process.exit(1);
  }
  
  const saFile = args[0];
  const roaFile = args[1];
  
  console.log('🚀 Starting Fixed Excel to JSON conversion...');
  console.log(`SA File: ${saFile}`);
  console.log(`ROA File: ${roaFile}`);
  
  // Ensure public directory exists
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }
  
  // Convert SA file
  let saData = null;
  if (fs.existsSync(saFile)) {
    saData = convertSAExcelFixed(saFile);
    if (saData) {
      fs.writeFileSync('./public/sa-guide-fixed.json', JSON.stringify(saData, null, 2));
      console.log('✅ SA guide data written to ./public/sa-guide-fixed.json');
    }
  } else {
    console.warn(`⚠️  SA file not found: ${saFile}`);
  }
  
  // Convert ROA file
  let roaData = null;
  if (fs.existsSync(roaFile)) {
    roaData = convertROAExcelFixed(roaFile);
    if (roaData) {
      fs.writeFileSync('./public/roa-guide-fixed.json', JSON.stringify(roaData, null, 2));
      console.log('✅ ROA guide data written to ./public/roa-guide-fixed.json');
    }
  } else {
    console.warn(`⚠️  ROA file not found: ${roaFile}`);
  }
  
  console.log('\n📊 Conversion Summary:');
  if (saData) {
    console.log(`SA: ${saData.regions[0].days.length} days, ${saData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
    console.log(`SA Day 1 slots: ${saData.regions[0].days[0].slots.length}`);
    console.log(`SA Day 1 first show: ${saData.regions[0].days[0].slots[0]?.title || 'None'}`);
    console.log(`SA Day 1 last show: ${saData.regions[0].days[0].slots[saData.regions[0].days[0].slots.length - 1]?.title || 'None'}`);
  }
  if (roaData) {
    console.log(`ROA: ${roaData.regions[0].days.length} days, ${roaData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
    console.log(`ROA Day 1 slots: ${roaData.regions[0].days[0].slots.length}`);
    console.log(`ROA Day 1 first show: ${roaData.regions[0].days[0].slots[0]?.title || 'None'}`);
    console.log(`ROA Day 1 last show: ${roaData.regions[0].days[0].slots[roaData.regions[0].days[0].slots.length - 1]?.title || 'None'}`);
  }
  
  console.log('\n📅 Week starts from:', getMondayOfCurrentWeek());
  console.log('📅 Week ends on:', addDays(getMondayOfCurrentWeek(), 6));
  
  console.log('\n🎨 Time Structures:');
  console.log('SA: CAT timezone, 6:00 AM - 5:30 AM next day, 30-min intervals');
  console.log('ROA WAT: 5:00 AM - 4:00 AM next day, 30-min intervals');
  console.log('ROA CAT: 6:00 AM - 5:00 AM next day, 30-min intervals');
  
  console.log('\n✅ Fixed conversion completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the JSON content from sa-guide-fixed.json');
  console.log('2. Paste it into the "SA Data JSON" field in Framer');
  console.log('3. Copy the JSON content from roa-guide-fixed.json');
  console.log('4. Paste it into the "ROA Data JSON" field in Framer');
}

// Run the conversion
convertExcelFilesFixed();
