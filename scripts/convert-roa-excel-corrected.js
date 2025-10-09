const XLSX = require('xlsx');
const fs = require('fs');

// Helper function to convert Excel serial date to ISO date string
function excelDateToISO(excelDate) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

// Helper function to convert decimal time to HH:MM format
function decimalToTime(decimal) {
  const totalMinutes = Math.round(decimal * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to create ISO string with original timezone (no UTC conversion)
function createLocalISO(dateISO, time, timezone) {
  // Create the datetime string in the original timezone
  const dateTimeStr = `${dateISO}T${time}:00`;
  
  // Add timezone offset to the string
  let timezoneOffset = '';
  if (timezone === 'WAT') {
    timezoneOffset = '+01:00'; // WAT is UTC+1
  } else if (timezone === 'CAT') {
    timezoneOffset = '+02:00'; // CAT is UTC+2
  }
  
  return `${dateTimeStr}${timezoneOffset}`;
}

// Helper function to get Monday of current week
function getMondayOfCurrentWeek() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Main conversion function
function convertROAExcelCorrected() {
  console.log('🚀 Starting ROA Excel to JSON conversion (Corrected Version)...');
  
  const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
  console.log('📊 Reading Excel file:', filePath);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`📋 Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Skip header row
  const dataRows = jsonData.slice(1);
  console.log(`📊 Processing ${dataRows.length} data rows`);
  
  // Group data by date and timezone
  const groupedData = {};
  
  dataRows.forEach((row, index) => {
    if (row.length < 11) {
      return; // Skip incomplete rows silently
    }
    
    const [region, date, startTime, endTime, title, season, episode, subtitle, textColor, bgColor, timezone] = row;
    
    // Skip if essential data is missing
    if (!region || !date || startTime === undefined || endTime === undefined || !title || !timezone) {
      return;
    }
    
    // Convert Excel date to ISO
    const dateISO = excelDateToISO(date);
    
    // Convert decimal times to HH:MM
    const startTimeStr = decimalToTime(startTime);
    const endTimeStr = decimalToTime(endTime);
    
    // Create unique key for date and timezone
    const key = `${dateISO}_${timezone}`;
    
    if (!groupedData[key]) {
      groupedData[key] = {
        dateISO,
        timezone,
        slots: []
      };
    }
    
    // Create slot object with original timezone (no UTC conversion)
    const slot = {
      startISO: createLocalISO(dateISO, startTimeStr, timezone),
      endISO: createLocalISO(dateISO, endTimeStr, timezone),
      title: title.trim(),
      durationMin: Math.round((endTime - startTime) * 24 * 60)
    };
    
    // Add season and episode if available
    if (season && episode) {
      slot.subtitle = `${season} ${episode}`.trim();
    }
    
    // Add colors if available and not default
    if (textColor && textColor !== '#FFFFFF') {
      slot.textColor = textColor;
    }
    if (bgColor && bgColor !== '#1A1A1A') {
      slot.bgColor = bgColor;
    }
    
    groupedData[key].slots.push(slot);
  });
  
  console.log(`📊 Grouped data into ${Object.keys(groupedData).length} date-timezone combinations`);
  
  // Convert to the required JSON structure
  const monday = getMondayOfCurrentWeek();
  console.log('📅 Week starts from:', monday);
  
  // Create days array for the week (Monday to Sunday)
  const days = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(currentDate.getDate() + i);
    const dateISO = currentDate.toISOString().split('T')[0];
    
    console.log(`📅 Processing ${dayNames[i]} (${dateISO})`);
    
    // Find slots for this date
    const daySlots = [];
    
    // Look for both WAT and CAT timezone data for this date
    const watKey = `${dateISO}_WAT`;
    const catKey = `${dateISO}_CAT`;
    
    if (groupedData[watKey]) {
      daySlots.push(...groupedData[watKey].slots);
      console.log(`  📺 Found ${groupedData[watKey].slots.length} WAT slots`);
    }
    
    if (groupedData[catKey]) {
      daySlots.push(...groupedData[catKey].slots);
      console.log(`  📺 Found ${groupedData[catKey].slots.length} CAT slots`);
    }
    
    // Sort slots by start time
    daySlots.sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
    
    if (daySlots.length > 0) {
      days.push({
        dateISO,
        slots: daySlots
      });
      console.log(`  ✅ Added ${daySlots.length} total slots for ${dayNames[i]}`);
    } else {
      console.log(`  ⚠️  No slots found for ${dayNames[i]}`);
    }
  }
  
  // Create the final JSON structure
  const result = {
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
        days: days
      }
    ]
  };
  
  // Write to file
  const outputPath = './public/roa-guide-corrected.json';
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  
  console.log('\n✅ Conversion completed successfully!');
  console.log(`📁 Output saved to: ${outputPath}`);
  console.log(`📊 Total days: ${days.length}`);
  console.log(`📺 Total slots: ${days.reduce((sum, day) => sum + day.slots.length, 0)}`);
  
  // Display summary
  console.log('\n📋 Summary by day:');
  days.forEach((day, index) => {
    const dayName = dayNames[index];
    console.log(`  ${dayName} (${day.dateISO}): ${day.slots.length} slots`);
  });
  
  // Show sample of first few slots to verify format
  console.log('\n🔍 Sample slots (first 5):');
  if (days.length > 0 && days[0].slots.length > 0) {
    days[0].slots.slice(0, 5).forEach((slot, index) => {
      console.log(`  ${index + 1}. ${slot.title} - ${slot.startISO} to ${slot.endISO}`);
    });
  }
  
  return result;
}

// Run the conversion
convertROAExcelCorrected();


