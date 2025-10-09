/**
 * Convert ZeeWorld ROA Excel file to JSON format (Time Fixed Version)
 * 
 * This script converts the ROA Excel file to JSON format that aligns with the Framer component.
 * - NO UTC conversion (uses local time as-is)
 * - Maintains WAT and CAT timezone structure
 * - Ensures all 7 days (Monday to Sunday) are included
 * - Correctly maps Excel dates to the required week (2025-10-06 to 2025-10-12)
 * - FIXES the time conversion to show 05:00-06:00 instead of 00:00-01:00
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Helper function to convert Excel serial date to ISO date
function excelSerialToISO(serialDate) {
  // Excel serial date starts from 1900-01-01, but Excel incorrectly treats 1900 as a leap year
  const excelEpoch = new Date(1900, 0, 1);
  const date = new Date(excelEpoch.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000);
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

// Helper function to create local ISO string (NO UTC conversion)
function createLocalISO(dateISO, timeString) {
  // For ROA, we'll use the local time as-is without UTC conversion
  // This creates a local timestamp that matches the Excel data exactly
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
  
  // Get headers from first row
  const headers = jsonData[0];
  console.log('Headers:', headers);
  
  // Process data rows (skip header row)
  const dataRows = jsonData.slice(1);
  console.log(`Processing ${dataRows.length} data rows`);
  
  // Map Excel dates to target week dates
  // Excel has 2025-10-05 to 2025-10-11, but we want 2025-10-06 to 2025-10-12
  const dateMapping = {
    '2025-10-05': '2025-10-06', // Sunday -> Monday
    '2025-10-06': '2025-10-07', // Monday -> Tuesday
    '2025-10-07': '2025-10-08', // Tuesday -> Wednesday
    '2025-10-08': '2025-10-09', // Wednesday -> Thursday
    '2025-10-09': '2025-10-10', // Thursday -> Friday
    '2025-10-10': '2025-10-11', // Friday -> Saturday
    '2025-10-11': '2025-10-12'  // Saturday -> Sunday
  };
  
  // Group data by mapped date and timezone
  const groupedData = {};
  
  for (const row of dataRows) {
    if (row.length < 11) continue; // Skip incomplete rows
    
    const region = row[0];
    const dateSerial = row[1];
    const startTimeDecimal = row[2];
    const endTimeDecimal = row[3];
    const title = row[4];
    const season = row[5];
    const episode = row[6];
    const subtitle = row[7];
    const textColor = row[8];
    const bgColor = row[9];
    const timezone = row[10];
    
    // Skip if not ROA region
    if (region !== 'ROA') continue;
    
    // Skip if no title
    if (!title) continue;
    
    // Convert Excel serial date to ISO date
    const excelDateISO = excelSerialToISO(dateSerial);
    
    // Map to target week date
    const targetDateISO = dateMapping[excelDateISO];
    if (!targetDateISO) {
      console.log(`Skipping date ${excelDateISO} - not in target week`);
      continue;
    }
    
    // Convert decimal times to HH:MM format
    const startTime = decimalToTime(startTimeDecimal);
    const endTime = decimalToTime(endTimeDecimal);
    
    // Debug: Log the first few shows to verify time conversion
    if (title === 'Sister Wives' && targetDateISO === '2025-10-06') {
      console.log(`\n🔍 Debug - First Sister Wives show:`);
      console.log(`  Excel Date: ${excelDateISO} -> Target Date: ${targetDateISO}`);
      console.log(`  Start Decimal: ${startTimeDecimal} -> ${startTime}`);
      console.log(`  End Decimal: ${endTimeDecimal} -> ${endTime}`);
      console.log(`  Timezone: ${timezone}`);
    }
    
    // Create unique key for date and timezone
    const key = `${targetDateISO}_${timezone}`;
    
    if (!groupedData[key]) {
      groupedData[key] = {
        dateISO: targetDateISO,
        timezone,
        slots: []
      };
    }
    
    // Add slot data with local time (NO UTC conversion)
    const slot = {
      startISO: createLocalISO(targetDateISO, startTime),
      endISO: createLocalISO(targetDateISO, endTime),
      title: normalizeShowTitle(title),
      durationMin: 30
    };
    
    // Add optional fields if they exist
    if (season) slot.season = season;
    if (episode) slot.episode = episode;
    if (subtitle) slot.subtitle = subtitle;
    if (textColor) slot.textColor = textColor;
    if (bgColor) slot.bgColor = bgColor;
    
    groupedData[key].slots.push(slot);
  }
  
  console.log(`Found data for ${Object.keys(groupedData).length} date-timezone combinations`);
  
  // Create days array for the week (Monday to Sunday) - ensure all 7 days
  const weekDays = [
    '2025-10-06', // Monday
    '2025-10-07', // Tuesday
    '2025-10-08', // Wednesday
    '2025-10-09', // Thursday
    '2025-10-10', // Friday
    '2025-10-11', // Saturday
    '2025-10-12'  // Sunday
  ];
  
  console.log('Target week days (Monday to Sunday):', weekDays);
  
  // Build the final data structure - ensure all 7 days are included
  const roaDays = [];
  
  for (const dateISO of weekDays) {
    const daySlots = [];
    
    // Get slots for both WAT and CAT timezones for this date
    const watKey = `${dateISO}_WAT`;
    const catKey = `${dateISO}_CAT`;
    
    if (groupedData[watKey]) {
      daySlots.push(...groupedData[watKey].slots);
    }
    
    if (groupedData[catKey]) {
      daySlots.push(...groupedData[catKey].slots);
    }
    
    // Sort slots by start time
    daySlots.sort((a, b) => a.startISO.localeCompare(b.startISO));
    
    // Always add the day, even if no slots (for complete week structure)
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
function convertROAFile() {
  const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
  
  try {
    console.log('🚀 Starting ROA Excel to JSON conversion (Time Fixed Version)...');
    
    // Convert the Excel file
    const roaData = convertROAExcel(filePath);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../public/roa-guide-time-fixed.json');
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
    
    // Show first and last shows
    console.log('\n🎬 First and Last Shows:');
    const allSlots = roaData.regions[0].days.flatMap(day => day.slots);
    if (allSlots.length > 0) {
      const firstShow = allSlots[0];
      const lastShow = allSlots[allSlots.length - 1];
      
      console.log(`First show: ${firstShow.title} - ${firstShow.startISO} to ${firstShow.endISO}`);
      console.log(`Last show: ${lastShow.title} - ${lastShow.startISO} to ${lastShow.endISO}`);
    }
    
    // Create a smaller copy for easy copying into Framer
    const copyData = {
      ...roaData,
      regions: roaData.regions.map(region => ({
        ...region,
        days: region.days.map(day => ({
          ...day,
          slots: day.slots.slice(0, 10) // Limit to first 10 shows per day for easier copying
        }))
      }))
    };
    
    const copyPath = path.join(__dirname, '../public/roa-guide-copy-time-fixed.json');
    fs.writeFileSync(copyPath, JSON.stringify(copyData, null, 2));
    console.log(`📋 Copy file created: ${copyPath} (limited to 10 shows per day for easy copying)`);
    
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


