/**
 * Convert ZeeWorld ROA Excel file to JSON format
 * 
 * This script converts the ROA Excel file to JSON format that aligns with the Framer component.
 * - No UTC conversion (uses local time as-is)
 * - Maintains WAT and CAT timezone structure
 * - Ensures all 7 days (Monday to Sunday) are included
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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

// Helper function to convert decimal time to HH:MM format
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

// Helper function to create local ISO string (no UTC conversion)
function createLocalISO(dateISO, timeString, timezone) {
  // For ROA, we'll use the local time as-is without UTC conversion
  // WAT is UTC+1, CAT is UTC+2, but we'll keep the local time
  return `${dateISO}T${timeString}:00`;
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
  
  // Generate ROA data for both WAT and CAT timezones
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
        
        // Create local ISO strings (no UTC conversion)
        const startISO = createLocalISO(dateISO, startTime, 'WAT');
        const endISO = createLocalISO(dateISO, endTime, 'WAT');
        
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
function convertROAFile() {
  const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
  
  try {
    console.log('🚀 Starting ROA Excel to JSON conversion...');
    
    // Convert the Excel file
    const roaData = convertROAExcel(filePath);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../public/roa-guide-converted.json');
    fs.writeFileSync(outputPath, JSON.stringify(roaData, null, 2));
    
    console.log(`\n✅ Conversion completed successfully!`);
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`📊 Generated data for ${roaData.regions[0].days.length} days`);
    console.log(`📺 Total slots: ${roaData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)}`);
    
    // Display summary
    console.log('\n📋 Summary:');
    roaData.regions[0].days.forEach((day, index) => {
      const dayName = new Date(day.dateISO).toLocaleDateString('en-US', { weekday: 'long' });
      console.log(`  ${dayName} (${day.dateISO}): ${day.slots.length} shows`);
    });
    
    return roaData;
    
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    throw error;
  }
}

// Run the conversion
if (require.main === module) {
  convertROAFile();
}

module.exports = { convertROAFile, convertROAExcel };


