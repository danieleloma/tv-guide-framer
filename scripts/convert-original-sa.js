const XLSX = require('xlsx');
const path = require('path');

// Convert the original SA Excel file to JSON
function convertOriginalSA() {
  const filePath = '/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC SA.xlsx';
  
  console.log('=== CONVERTING ORIGINAL SA EXCEL FILE ===');
  console.log(`File: ${filePath}`);
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`\nSheet name: ${sheetName}`);
    console.log(`Total rows: ${jsonData.length}`);
    
    // Extract the data structure
    const headers = jsonData[0];
    const dayHeaders = jsonData[1]; // Days row
    const dateRow = jsonData[2]; // Excel serial dates
    const timeSlots = [];
    const shows = [];
    
    // Process each row starting from row 3
    for (let i = 3; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[0] !== undefined && row[0] !== null) {
        const timeSlot = row[0];
        if (typeof timeSlot === 'number') {
          timeSlots.push(timeSlot);
          shows.push(row.slice(1)); // Get shows for each day
        }
      }
    }
    
    console.log(`\nFound ${timeSlots.length} time slots`);
    
    // Convert decimal time to HH:MM format
    function decimalToTime(decimal) {
      const totalMinutes = Math.round(decimal * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Convert Excel serial date to ISO date
    function excelDateToISO(excelDate) {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    
    // Convert time to UTC ISO for SA (CAT timezone, UTC+2)
    function timeToUTCISO(dateISO, timeStr) {
      try {
        const dateTime = new Date(`${dateISO}T${timeStr}:00`);
        // Convert CAT (UTC+2) to UTC by subtracting 2 hours
        dateTime.setHours(dateTime.getHours() - 2);
        return dateTime.toISOString();
      } catch (error) {
        console.error(`Error converting time ${timeStr} on ${dateISO}:`, error.message);
        return null;
      }
    }
    
    // Generate SA data (CAT timezone, 6:00 AM - 5:30 AM next day)
    const monday = new Date('2025-10-06'); // Monday of the current week
    const saDays = [];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dateISO = excelDateToISO(dateRow[dayIndex + 1]); // +1 because first column is time
      const daySlots = [];
      
      // Process each time slot for this day
      for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
        const timeSlot = timeSlots[timeIndex];
        const showTitle = shows[timeIndex][dayIndex];
        
        if (showTitle && showTitle.trim() !== '') {
          const startTime = decimalToTime(timeSlot);
          const endTime = decimalToTime(timeSlot + 0.5); // 30-minute slots
          
          // Convert to UTC (CAT is UTC+2)
          const startISO = timeToUTCISO(dateISO, startTime);
          const endISO = timeToUTCISO(dateISO, endTime);
          
          if (startISO && endISO) {
            daySlots.push({
              startISO,
              endISO,
              title: showTitle.trim(),
              durationMin: 30
            });
          }
        }
      }
      
      if (daySlots.length > 0) {
        saDays.push({
          dateISO,
          slots: daySlots.sort((a, b) => new Date(a.startISO) - new Date(b.startISO))
        });
      }
    }
    
    const saGuideData = {
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
    
    // Write to file
    const fs = require('fs');
    const outputPath = path.join(__dirname, '../public/sa-guide-complete.json');
    fs.writeFileSync(outputPath, JSON.stringify(saGuideData, null, 2));
    
    console.log(`\n✅ Conversion completed!`);
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`📊 Total days: ${saDays.length}`);
    console.log(`📺 Total slots: ${saDays.reduce((sum, day) => sum + day.slots.length, 0)}`);
    
    // Show sample data
    if (saDays.length > 0) {
      console.log(`\n📋 Sample data for ${saDays[0].dateISO}:`);
      saDays[0].slots.slice(0, 5).forEach(slot => {
        const startTime = slot.startISO.split('T')[1].substring(0, 5);
        const endTime = slot.endISO.split('T')[1].substring(0, 5);
        console.log(`  ${startTime}-${endTime}: ${slot.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error converting Excel file:', error.message);
  }
}

convertOriginalSA();
