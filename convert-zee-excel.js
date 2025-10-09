const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC SA.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Converting Zee World Excel file...');

// Extract the data
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

// Convert decimal hours to time strings
function decimalToTime(decimal) {
  const totalMinutes = Math.round(decimal * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert Excel date to ISO date
function excelDateToISO(excelDate) {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

// Generate the guide JSON
const guideJSON = {
  metadata: {
    channelId: "zee-world",
    generatedAt: new Date().toISOString(),
    defaultRegion: "SA",
    defaultTimezone: "CAT"
  },
  regions: [
    {
      code: "SA",
      label: "South Africa",
      timezones: ["CAT"],
      days: []
    }
  ]
};

// Process each day
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const startDate = new Date(2025, 9, 27); // October 27, 2025 (Monday)

for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
  const dayName = dayNames[dayIndex];
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + dayIndex);
  const dateISO = date.toISOString().split('T')[0];
  
  const daySlots = [];
  
  // Process each time slot for this day
  for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
    const timeSlot = timeSlots[timeIndex];
    const showTitle = shows[timeIndex][dayIndex];
    
    if (showTitle && showTitle.trim() !== '') {
      const startTime = decimalToTime(timeSlot);
      const endTime = decimalToTime(timeSlot + 0.5); // Assume 30-minute slots
      
      console.log(`Processing: ${showTitle.trim()} at ${startTime} on ${dateISO}`);
      
      // Convert to UTC (CAT is UTC+2)
      const startDateTime = new Date(`${dateISO}T${startTime}:00`);
      if (isNaN(startDateTime.getTime())) {
        console.log(`Invalid start date: ${dateISO}T${startTime}:00`);
        continue;
      }
      startDateTime.setHours(startDateTime.getHours() - 2); // Convert CAT to UTC
      
      const endDateTime = new Date(`${dateISO}T${endTime}:00`);
      if (isNaN(endDateTime.getTime())) {
        console.log(`Invalid end date: ${dateISO}T${endTime}:00`);
        continue;
      }
      endDateTime.setHours(endDateTime.getHours() - 2); // Convert CAT to UTC
      
      daySlots.push({
        startISO: startDateTime.toISOString(),
        endISO: endDateTime.toISOString(),
        title: showTitle.trim(),
        durationMin: 30
      });
    }
  }
  
  if (daySlots.length > 0) {
    guideJSON.regions[0].days.push({
      dateISO: dateISO,
      slots: daySlots
    });
  }
}

// Write the output file
fs.writeFileSync('./public/zee-world-guide.json', JSON.stringify(guideJSON, null, 2));

console.log('✅ Conversion completed!');
console.log(`Generated guide for ${guideJSON.regions[0].days.length} days`);
guideJSON.regions[0].days.forEach(day => {
  console.log(`  - ${day.dateISO}: ${day.slots.length} shows`);
});

// Clean up
fs.unlinkSync('./check-excel.js');
fs.unlinkSync('./convert-zee-excel.js');
