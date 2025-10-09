/**
 * Convert Excel Sheets to Structured TV Guide JSON
 * 
 * Converts SA and ROA Excel files to the proper JSON format
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

// Helper function to normalize date strings
function normalizeDateString(dateStr) {
  if (!dateStr) return null;
  
  // Handle various date formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateStr}`);
    return null;
  }
  
  return date.toISOString().split('T')[0];
}

// Helper function to normalize time strings
function normalizeTimeString(timeStr) {
  if (!timeStr) return null;
  
  // Handle various time formats
  if (typeof timeStr === 'number') {
    // Excel time as decimal (e.g., 0.25 = 6:00 AM)
    const totalMinutes = Math.round(timeStr * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Handle string formats like "6:00", "06:00", "6:00 AM", etc.
  const timeMatch = timeStr.toString().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const ampm = timeMatch[3];
    
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  return null;
}

// Helper function to convert time to UTC ISO for SA (CAT timezone)
function timeToUTCISO_SA(dateISO, timeStr) {
  const time = normalizeTimeString(timeStr);
  if (!time) return null;
  
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${time}:00+02:00`); // CAT is UTC+2
  return dateTime.toISOString();
}

// Helper function to convert time to UTC ISO for ROA WAT
function timeToUTCISO_ROA_WAT(dateISO, timeStr) {
  const time = normalizeTimeString(timeStr);
  if (!time) return null;
  
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${time}:00+01:00`); // WAT is UTC+1
  return dateTime.toISOString();
}

// Helper function to convert time to UTC ISO for ROA CAT
function timeToUTCISO_ROA_CAT(dateISO, timeStr) {
  const time = normalizeTimeString(timeStr);
  if (!time) return null;
  
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(`${dateISO}T${time}:00+02:00`); // CAT is UTC+2
  return dateTime.toISOString();
}

// Convert SA Excel to JSON
function convertSAExcel(filePath) {
  console.log(`\n📊 Converting SA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Find the header row and data rows
  let headerRowIndex = -1;
  let dataStartIndex = -1;
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row.length > 0) {
      const firstCell = row[0];
      if (typeof firstCell === 'string' && firstCell.toLowerCase().includes('time')) {
        headerRowIndex = i;
        dataStartIndex = i + 1;
        break;
      }
    }
  }
  
  if (headerRowIndex === -1) {
    console.error('Could not find header row with time information');
    return null;
  }
  
  const headers = jsonData[headerRowIndex];
  console.log('Headers:', headers);
  
  // Extract time slots and shows
  const timeSlots = [];
  const shows = [];
  
  for (let i = dataStartIndex; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number' || (typeof timeSlot === 'string' && timeSlot.match(/\d/))) {
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  
  // Generate days starting from Monday
  const monday = getMondayOfCurrentWeek();
  const days = [];
  
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each time slot for this day
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      const timeSlot = timeSlots[timeIndex];
      const showTitle = shows[timeIndex][dayIndex];
      
      if (showTitle && showTitle.trim() !== '') {
        const startTime = normalizeTimeString(timeSlot);
        if (startTime) {
          const startISO = timeToUTCISO_SA(dateISO, timeSlot);
          if (startISO) {
            // Calculate end time (30 minutes later)
            const [hours, minutes] = startTime.split(':').map(Number);
            let endHours = hours;
            let endMinutes = minutes + 30;
            
            if (endMinutes >= 60) {
              endHours += 1;
              endMinutes -= 60;
            }
            
            if (endHours >= 24) {
              endHours -= 24;
              // Handle cross-midnight
              const nextDay = addDays(dateISO, 1);
              const endISO = timeToUTCISO_SA(nextDay, `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`);
              
              daySlots.push({
                startISO,
                endISO,
                title: showTitle.trim(),
                durationMin: 30
              });
            } else {
              const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
              const endISO = timeToUTCISO_SA(dateISO, endTime);
              
              daySlots.push({
                startISO,
                endISO,
                title: showTitle.trim(),
                durationMin: 30
              });
            }
          }
        }
      }
    }
    
    if (daySlots.length > 0) {
      days.push({
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
        days
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
  
  // Find the header row and data rows
  let headerRowIndex = -1;
  let dataStartIndex = -1;
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row.length > 0) {
      const firstCell = row[0];
      if (typeof firstCell === 'string' && firstCell.toLowerCase().includes('time')) {
        headerRowIndex = i;
        dataStartIndex = i + 1;
        break;
      }
    }
  }
  
  if (headerRowIndex === -1) {
    console.error('Could not find header row with time information');
    return null;
  }
  
  const headers = jsonData[headerRowIndex];
  console.log('Headers:', headers);
  
  // Extract time slots and shows
  const timeSlots = [];
  const shows = [];
  
  for (let i = dataStartIndex; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] !== undefined && row[0] !== null) {
      const timeSlot = row[0];
      if (typeof timeSlot === 'number' || (typeof timeSlot === 'string' && timeSlot.match(/\d/))) {
        timeSlots.push(timeSlot);
        shows.push(row.slice(1)); // Get shows for each day
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  
  // Generate days starting from Monday
  const monday = getMondayOfCurrentWeek();
  const days = [];
  
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each time slot for this day
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      const timeSlot = timeSlots[timeIndex];
      const showTitle = shows[timeIndex][dayIndex];
      
      if (showTitle && showTitle.trim() !== '') {
        const startTime = normalizeTimeString(timeSlot);
        if (startTime) {
          // For ROA, we'll use WAT as the base timezone
          const startISO = timeToUTCISO_ROA_WAT(dateISO, timeSlot);
          if (startISO) {
            // Calculate end time (30 minutes later)
            const [hours, minutes] = startTime.split(':').map(Number);
            let endHours = hours;
            let endMinutes = minutes + 30;
            
            if (endMinutes >= 60) {
              endHours += 1;
              endMinutes -= 60;
            }
            
            if (endHours >= 24) {
              endHours -= 24;
              // Handle cross-midnight
              const nextDay = addDays(dateISO, 1);
              const endISO = timeToUTCISO_ROA_WAT(nextDay, `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`);
              
              daySlots.push({
                startISO,
                endISO,
                title: showTitle.trim(),
                durationMin: 30
              });
            } else {
              const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
              const endISO = timeToUTCISO_ROA_WAT(dateISO, endTime);
              
              daySlots.push({
                startISO,
                endISO,
                title: showTitle.trim(),
                durationMin: 30
              });
            }
          }
        }
      }
    }
    
    if (daySlots.length > 0) {
      days.push({
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
        days
      }
    ]
  };
}

// Main conversion function
function convertExcelFiles() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Usage: node convert-excel-structured.js <sa-excel-file> <roa-excel-file>

Example:
  node convert-excel-structured.js "SA_Guide.xlsx" "ROA_Guide.xlsx"

This will convert both Excel files to the proper JSON format
for the TVGuideStructured component.
    `);
    process.exit(1);
  }
  
  const saFile = args[0];
  const roaFile = args[1];
  
  console.log('🚀 Starting Excel to JSON conversion...');
  console.log(`SA File: ${saFile}`);
  console.log(`ROA File: ${roaFile}`);
  
  // Ensure public directory exists
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }
  
  // Convert SA Excel
  let saData = null;
  if (fs.existsSync(saFile)) {
    saData = convertSAExcel(saFile);
    if (saData) {
      fs.writeFileSync('./public/sa-guide-converted.json', JSON.stringify(saData, null, 2));
      console.log('✅ SA guide data written to ./public/sa-guide-converted.json');
      console.log(`   ${saData.regions[0].days.length} days, ${saData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
    }
  } else {
    console.warn(`⚠️  SA file not found: ${saFile}`);
  }
  
  // Convert ROA Excel
  let roaData = null;
  if (fs.existsSync(roaFile)) {
    roaData = convertROAExcel(roaFile);
    if (roaData) {
      fs.writeFileSync('./public/roa-guide-converted.json', JSON.stringify(roaData, null, 2));
      console.log('✅ ROA guide data written to ./public/roa-guide-converted.json');
      console.log(`   ${roaData.regions[0].days.length} days, ${roaData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
    }
  } else {
    console.warn(`⚠️  ROA file not found: ${roaFile}`);
  }
  
  console.log('\n🎯 Conversion Summary:');
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
}

// Run the conversion
convertExcelFiles();
