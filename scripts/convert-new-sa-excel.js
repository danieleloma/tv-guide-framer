const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Helper function to get Monday of current week
function getMondayOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + 1);
  return monday.toISOString().split('T')[0];
}

// Helper function to add days to a date
function addDays(dateISO, days) {
  const date = new Date(dateISO);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Helper function to convert time to UTC ISO for SA (CAT timezone)
function timeToUTCISO_SA(dateISO, timeStr) {
  try {
    // CAT is UTC+2, so we subtract 2 hours to get UTC
    const dateTime = new Date(`${dateISO}T${timeStr}:00`);
    if (isNaN(dateTime.getTime())) {
      console.log(`Invalid date/time: ${dateISO}T${timeStr}:00`);
      return null;
    }
    dateTime.setHours(dateTime.getHours() - 2); // Convert CAT to UTC
    return dateTime.toISOString();
  } catch (error) {
    console.log(`Error converting time: ${error.message}`);
    return null;
  }
}

// Helper function to normalize show title
function normalizeShowTitle(title) {
  if (!title) return '';
  if (typeof title === 'string') return title.trim();
  if (typeof title === 'number') return title.toString();
  return String(title).trim();
}

// Convert new SA Excel to JSON
function convertNewSAExcel(filePath) {
  console.log(`\n📊 Converting new SA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Log the structure to understand the format
  console.log('\n=== EXCEL FILE STRUCTURE ===');
  console.log('Headers:', jsonData[0]);
  if (jsonData.length > 1) {
    console.log('First data row:', jsonData[1]);
  }
  if (jsonData.length > 2) {
    console.log('Second data row:', jsonData[2]);
  }
  
  // Generate SA data (CAT timezone, 6:00 AM - 5:30 AM next day)
  const monday = getMondayOfCurrentWeek();
  const saDays = [];
  
  // Process each day of the week
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dateISO = addDays(monday, dayIndex);
    const daySlots = [];
    
    // Process each row of data (skip header row)
    for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
      const row = jsonData[rowIndex];
      if (!row || row.length === 0) continue;
      
      // Extract data from the row
      const region = normalizeShowTitle(row[0]);
      const date = normalizeShowTitle(row[1]);
      const startTime = normalizeShowTitle(row[2]);
      const endTime = normalizeShowTitle(row[3]);
      const title = normalizeShowTitle(row[4]);
      const season = normalizeShowTitle(row[5]);
      const episode = normalizeShowTitle(row[6]);
      const subtitle = normalizeShowTitle(row[7]);
      const textColor = normalizeShowTitle(row[8]);
      const bgColor = normalizeShowTitle(row[9]);
      
      // Skip if no title
      if (!title || title === '') continue;
      
      // Validate required fields
      if (!startTime || !endTime) {
        console.log(`Skipping row ${rowIndex}: missing start/end time`);
        continue;
      }
      
      // Convert times to UTC ISO
      const startISO = timeToUTCISO_SA(dateISO, startTime);
      const endISO = timeToUTCISO_SA(dateISO, endTime);
      
      if (startISO && endISO) {
        // Calculate duration in minutes
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);
        const durationMin = Math.round((endDate - startDate) / (1000 * 60));
        
        // Create slot object
        const slot = {
          startISO,
          endISO,
          title,
          durationMin
        };
        
        // Add optional fields if present
        if (season && season !== '') slot.season = season;
        if (episode && episode !== '') slot.episode = episode;
        if (subtitle && subtitle !== '') slot.subtitle = subtitle;
        if (textColor && textColor !== '') slot.textColor = textColor;
        if (bgColor && bgColor !== '') slot.bgColor = bgColor;
        
        daySlots.push(slot);
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

// Main conversion function
function convertNewSAFile() {
  const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC SA.xlsx';
  
  try {
    console.log('🚀 Starting conversion of new SA Excel file...');
    
    const saData = convertNewSAExcel(filePath);
    
    // Save to file
    const outputPath = '/Users/danieleloma/tv-guide-framer/public/sa-guide-new.json';
    fs.writeFileSync(outputPath, JSON.stringify(saData, null, 2));
    
    console.log(`\n✅ Conversion completed successfully!`);
    console.log(`📁 Output saved to: ${outputPath}`);
    console.log(`📊 Generated ${saData.regions[0].days.length} days with ${saData.regions[0].days.reduce((total, day) => total + day.slots.length, 0)} total slots`);
    
    // Display summary
    saData.regions[0].days.forEach(day => {
      console.log(`📅 ${day.dateISO}: ${day.slots.length} slots`);
    });
    
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    console.error(error.stack);
  }
}

// Run the conversion
convertNewSAFile();