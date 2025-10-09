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

// Helper function to convert time to UTC ISO string for ROA
function timeToUTCISO(dateISO, time, timezone) {
  let offsetHours = 0;
  
  if (timezone === 'WAT') {
    offsetHours = 1; // WAT is UTC+1
  } else if (timezone === 'CAT') {
    offsetHours = 2; // CAT is UTC+2
  }
  
  const dateTime = new Date(`${dateISO}T${time}:00`);
  if (isNaN(dateTime.getTime())) {
    console.log(`Invalid date: ${dateISO}T${time}:00`);
    return null;
  }
  
  // Convert to UTC by subtracting the timezone offset
  dateTime.setHours(dateTime.getHours() - offsetHours);
  
  return dateTime.toISOString();
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
function convertROAExcel() {
  console.log('🚀 Starting ROA Excel to JSON conversion...');
  
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
      console.log(`⚠️  Skipping incomplete row ${index + 2}:`, row);
      return;
    }
    
    const [region, date, startTime, endTime, title, season, episode, subtitle, textColor, bgColor, timezone] = row;
    
    // Skip if essential data is missing
    if (!region || !date || startTime === undefined || endTime === undefined || !title || !timezone) {
      console.log(`⚠️  Skipping row ${index + 2} - missing essential data:`, row);
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
    
    // Create slot object
    const slot = {
      startISO: timeToUTCISO(dateISO, startTimeStr, timezone),
      endISO: timeToUTCISO(dateISO, endTimeStr, timezone),
      title: title.trim(),
      durationMin: Math.round((endTime - startTime) * 24 * 60)
    };
    
    // Add season and episode if available
    if (season && episode) {
      slot.subtitle = `${season} ${episode}`.trim();
    }
    
    // Add colors if available
    if (textColor && textColor !== '#FFFFFF') {
      slot.textColor = textColor;
    }
    if (bgColor && bgColor !== '#1A1A1A') {
      slot.bgColor = bgColor;
    }
    
    if (slot.startISO && slot.endISO) {
      groupedData[key].slots.push(slot);
    } else {
      console.log(`⚠️  Skipping slot with invalid times:`, slot);
    }
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
  const outputPath = './public/roa-guide-new.json';
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
  
  return result;
}

// Run the conversion
convertROAExcel();