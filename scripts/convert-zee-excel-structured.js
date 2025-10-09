/**
 * Convert Zee World Excel to Structured TV Guide JSON
 * 
 * Converts your existing Zee World Excel file to the proper JSON format
 * that matches the TVGuideStructured component framework.
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

// Helper function to convert time to UTC ISO for ROA CAT
function timeToUTCISO_ROA_CAT(dateISO, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${timeStr}:00+02:00`); // CAT is UTC+2
  
  if (isNaN(dateTime.getTime())) {
    console.warn(`Invalid date/time: ${dateISO}T${timeStr}:00+02:00`);
    return null;
  }
  
  return dateTime.toISOString();
}

// Convert Zee World Excel to structured JSON
function convertZeeWorldExcel(filePath) {
  console.log(`\n📊 Converting Zee World Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Extract the data structure
  const headers = jsonData[0];
  const dayHeaders = jsonData[1]; // Days row
  const timeSlots = [];
  const shows = [];
  
  // Process each row starting from row 2 (index 2)
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number') {
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  
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
      
      if (showTitle && showTitle.trim() !== '') {
        const startTime = decimalToTime(timeSlot);
        const endTime = decimalToTime(timeSlot + 0.5); // 30-minute slots
        
        // Convert to UTC (CAT is UTC+2)
        const startISO = timeToUTCISO_SA(dateISO, startTime);
        const endISO = timeToUTCISO_SA(dateISO, endTime);
        
        daySlots.push({
          startISO,
          endISO,
          title: showTitle.trim(),
          durationMin: 30
        });
      }
    }
    
    if (daySlots.length > 0) {
      saDays.push({
        dateISO,
        slots: daySlots
      });
    }
  }
  
  // Generate ROA data (WAT timezone, 5:00 AM - 4:00 AM next day)
  const roaDays = [];
  
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each time slot for this day
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      const timeSlot = timeSlots[timeIndex];
      const showTitle = shows[timeIndex][dayIndex];
      
      if (showTitle && showTitle.trim() !== '') {
        // For ROA, adjust the time by 1 hour earlier (WAT vs CAT)
        const adjustedTimeSlot = timeSlot - (1/24); // 1 hour earlier
        const startTime = decimalToTime(adjustedTimeSlot);
        const endTime = decimalToTime(adjustedTimeSlot + 0.5); // 30-minute slots
        
        // Convert to UTC (WAT is UTC+1)
        const startISO = timeToUTCISO_ROA_WAT(dateISO, startTime);
        const endISO = timeToUTCISO_ROA_WAT(dateISO, endTime);
        
        daySlots.push({
          startISO,
          endISO,
          title: showTitle.trim(),
          durationMin: 30
        });
      }
    }
    
    if (daySlots.length > 0) {
      roaDays.push({
        dateISO,
        slots: daySlots
      });
    }
  }
  
  // Create SA data structure
  const saData = {
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
  
  // Create ROA data structure
  const roaData = {
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
  
  return { saData, roaData };
}

// Convert SA Excel to JSON
function convertSAExcel(filePath) {
  console.log(`\n📊 Converting SA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Extract the data structure
  const headers = jsonData[0];
  const dayHeaders = jsonData[1]; // Days row
  const timeSlots = [];
  const shows = [];
  
  // Process each row starting from row 2 (index 2)
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number') {
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  
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
    
    if (daySlots.length > 0) {
      saDays.push({
        dateISO,
        slots: daySlots
      });
    }
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

// Convert ROA Excel to JSON
function convertROAExcel(filePath) {
  console.log(`\n📊 Converting ROA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Extract the data structure
  const headers = jsonData[0];
  const dayHeaders = jsonData[1]; // Days row
  const timeSlots = [];
  const shows = [];
  
  // Process each row starting from row 2 (index 2)
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number') {
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  
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
    
    if (daySlots.length > 0) {
      roaDays.push({
        dateISO,
        slots: daySlots
      });
    }
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
function convertZeeWorldFiles() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Usage: node convert-zee-excel-structured.js <sa-excel-file> <roa-excel-file>

Example:
  node convert-zee-excel-structured.js "Zee World OCTOBER 25 FPC SA.xlsx" "Zee World OCTOBER 25 FPC ROA.xlsx"

This will convert both Zee World Excel files to the proper JSON format
for the TVGuideStructured component.
    `);
    process.exit(1);
  }
  
  const saFile = args[0];
  const roaFile = args[1];
  
  console.log('🚀 Starting Zee World Excel to JSON conversion...');
  console.log(`SA File: ${saFile}`);
  console.log(`ROA File: ${roaFile}`);
  
  // Ensure public directory exists
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }
  
  // Convert SA file
  let saData = null;
  if (fs.existsSync(saFile)) {
    saData = convertSAExcel(saFile);
    if (saData) {
      fs.writeFileSync('./public/sa-guide-converted.json', JSON.stringify(saData, null, 2));
      console.log('✅ SA guide data written to ./public/sa-guide-converted.json');
    }
  } else {
    console.warn(`⚠️  SA file not found: ${saFile}`);
  }
  
  // Convert ROA file
  let roaData = null;
  if (fs.existsSync(roaFile)) {
    roaData = convertROAExcel(roaFile);
    if (roaData) {
      fs.writeFileSync('./public/roa-guide-converted.json', JSON.stringify(roaData, null, 2));
      console.log('✅ ROA guide data written to ./public/roa-guide-converted.json');
    }
  } else {
    console.warn(`⚠️  ROA file not found: ${roaFile}`);
  }
  
  console.log('\n📊 Conversion Summary:');
  if (saData) {
    console.log(`SA: ${saData.regions[0].days.length} days, ${saData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
  }
  if (roaData) {
    console.log(`ROA: ${roaData.regions[0].days.length} days, ${roaData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
  }
  
  console.log('\n📅 Week starts from:', getMondayOfCurrentWeek());
  console.log('📅 Week ends on:', addDays(getMondayOfCurrentWeek(), 6));
  
  console.log('\n🎨 Time Structures:');
  console.log('SA: CAT timezone, 6:00 AM - 5:30 AM next day, 30-min intervals');
  console.log('ROA WAT: 5:00 AM - 4:00 AM next day, 30-min intervals');
  console.log('ROA CAT: 6:00 AM - 5:00 AM next day, 30-min intervals');
  
  console.log('\n✅ Conversion completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the JSON content from sa-guide-converted.json');
  console.log('2. Paste it into the "SA Data JSON" field in Framer');
  console.log('3. Copy the JSON content from roa-guide-converted.json');
  console.log('4. Paste it into the "ROA Data JSON" field in Framer');
  console.log('\n🎯 The component will automatically handle:');
  console.log('- SA region: Only shows CAT timezone');
  console.log('- ROA region: Shows WAT and CAT timezone switcher');
  console.log('- Proper time positioning for each region/timezone');
  console.log('- Cross-midnight slot handling');
}

// Run the conversion
convertZeeWorldFiles();
