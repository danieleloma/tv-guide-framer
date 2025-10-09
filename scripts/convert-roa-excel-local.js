/**
 * Convert ZeeWorld ROA Excel file to JSON format (Local Time Version)
 * 
 * This script converts the ROA Excel file to JSON format that aligns with the Framer component.
 * - NO UTC conversion (uses local time as-is)
 * - Maintains WAT and CAT timezone structure
 * - Ensures all 7 days (Monday to Sunday) are included
 * - Handles the standard row-based Excel format
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
  
  // Group data by date and timezone
  const groupedData = {};
  
  for (const row of dataRows) {
    if (row.length < 10) continue; // Skip incomplete rows
    
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
    
    // Convert Excel serial date to ISO date
    const dateISO = excelSerialToISO(dateSerial);
    
    // Convert decimal times to HH:MM format
    const startTime = decimalToTime(startTimeDecimal);
    const endTime = decimalToTime(endTimeDecimal);
    
    // Create unique key for date and timezone
    const key = `${dateISO}_${timezone}`;
    
    if (!groupedData[key]) {
      groupedData[key] = {
        dateISO,
        timezone,
        slots: []
      };
    }
    
    // Add slot data with local time (NO UTC conversion)
    const slot = {
      startISO: createLocalISO(dateISO, startTime),
      endISO: createLocalISO(dateISO, endTime),
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
  
  // Get all unique dates and sort them
  const uniqueDates = [...new Set(Object.values(groupedData).map(item => item.dateISO))].sort();
  console.log('Unique dates in Excel:', uniqueDates);
  
  // Create days array for the week (Monday to Sunday) - ensure all 7 days
  const monday = getMondayOfCurrentWeek();
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const dateISO = addDays(monday, i);
    weekDays.push(dateISO);
  }
  
  console.log('Week days (Monday to Sunday):', weekDays);
  
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
    console.log('🚀 Starting ROA Excel to JSON conversion (Local Time)...');
    
    // Convert the Excel file
    const roaData = convertROAExcel(filePath);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../public/roa-guide-local.json');
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
    
    const copyPath = path.join(__dirname, '../public/roa-guide-copy-local.json');
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


