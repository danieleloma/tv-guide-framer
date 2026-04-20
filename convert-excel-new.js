const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const excelPath = '/Users/danieleloma/Downloads/Channel TV Guide/Zee Zonke November 2025 FPC (24 - 30 Nov) Edited.xlsx';
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

console.log('Converting Excel file to TV Guide JSON format...');
console.log('Total rows:', jsonData.length);

// Helper function to get day name from date string
function getDayName(dateStr) {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

// Helper function to parse time string (HH:MM) to minutes
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') {
    // Excel time as fraction of day
    const totalMinutes = timeStr * 24 * 60;
    return Math.round(totalMinutes);
  }
  const [hours, minutes] = timeStr.toString().split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to format minutes to time string (HH:MM)
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Generate all 30-minute slots for a timezone window
function generateSlots(windowStart, windowEnd) {
  const slots = [];
  const startMinutes = timeToMinutes(windowStart);
  let endMinutes = timeToMinutes(windowEnd);
  
  // Handle next-day end time
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  
  let current = startMinutes;
  while (current < endMinutes) {
    slots.push(minutesToTime(current % (24 * 60)));
    current += 30;
  }
  
  return slots;
}

// Process the data
const showsByRegion = {};

jsonData.forEach((row) => {
  // Map Excel columns to variables
  // Note: Excel has "CAT" in Region column, but this should be mapped to "SA" region
  const excelRegion = row.Region || 'CAT';
  const timezone = row.Timezone || 'CAT';
  const date = row.Date;
  const startTime = row['Start Time'];
  const endTime = row['End Time'];
  const title = row.Title;
  const season = row.Season;
  const episode = row.Episode;
  const textColor = row['Text Color'] || '#FFFFFF';
  const bgColor = row['BG Color'] || '#1A1A1A';
  
  if (!date || !title || !startTime || !endTime) {
    console.warn('Skipping row with missing data:', row);
    return;
  }
  
  // Map CAT region to SA (South Africa)
  // According to types, regions should be "SA" or "ROA"
  const region = excelRegion === 'CAT' ? 'SA' : excelRegion;
  
  // Normalize time strings
  const startTimeStr = typeof startTime === 'number' 
    ? minutesToTime(Math.round(startTime * 24 * 60))
    : startTime.toString().trim();
  const endTimeStr = typeof endTime === 'number'
    ? minutesToTime(Math.round(endTime * 24 * 60))
    : endTime.toString().trim();
  
  // Normalize date string
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  
  // Initialize nested structure
  if (!showsByRegion[region]) {
    showsByRegion[region] = {};
  }
  if (!showsByRegion[region][timezone]) {
    showsByRegion[region][timezone] = {};
  }
  if (!showsByRegion[region][timezone][dateStr]) {
    showsByRegion[region][timezone][dateStr] = [];
  }
  
  // Create show object
  const show = {
    title: title.toString().trim(),
    start: startTimeStr,
    end: endTimeStr
  };
  
  // Add season and episode if both exist
  if (season && episode) {
    show.season = season.toString();
    show.episode = episode.toString();
  }
  
  // Add colors if present
  if (textColor) show.textColor = textColor.toString();
  if (bgColor) show.bgColor = bgColor.toString();
  
  showsByRegion[region][timezone][dateStr].push(show);
});

// Build the JSON structure matching the expected format
const output = {
  window: {
    WAT: {
      start: "05:00",
      end: "05:00"
    },
    CAT: {
      start: "06:00",
      end: "05:00"
    },
    slotMinutes: 30
  },
  regions: {}
};

// Process each region
Object.keys(showsByRegion).forEach(region => {
  output.regions[region] = {
    region: region,
    timezones: {}
  };
  
  // Process each timezone
  Object.keys(showsByRegion[region]).forEach(timezone => {
    const windowStart = output.window[timezone]?.start || "06:00";
    const windowEnd = output.window[timezone]?.end || "05:00";
    
    const timezoneData = {
      timezone: timezone,
      days: {}
    };
    
    // Get all unique dates and sort them
    const dates = Object.keys(showsByRegion[region][timezone]).sort();
    
    // Process each date
    dates.forEach(dateStr => {
      const dayName = getDayName(dateStr);
      const shows = showsByRegion[region][timezone][dateStr];
      
      // Generate all slots for the day based on window
      const slots = generateSlots(windowStart, windowEnd);
      
      // Initialize slots structure
      const daySlots = slots.map(time => ({
        time: time,
        shows: []
      }));
      
      // Place shows in appropriate slots
      shows.forEach(show => {
        const showStartMinutes = timeToMinutes(show.start);
        let showEndMinutes = timeToMinutes(show.end);
        
        // Handle overnight shows
        if (showEndMinutes <= showStartMinutes) {
          showEndMinutes += 24 * 60;
        }
        
        // Find all slots that overlap with this show
        daySlots.forEach(slot => {
          const slotTimeMinutes = timeToMinutes(slot.time);
          const slotEndMinutes = slotTimeMinutes + 30;
          
          // Normalize slot times to handle window wrapping
          const windowStartMinutes = timeToMinutes(windowStart);
          let windowEndMinutes = timeToMinutes(windowEnd);
          if (windowEndMinutes <= windowStartMinutes) {
            windowEndMinutes += 24 * 60;
          }
          
          // Check if show overlaps with this slot
          let overlaps = false;
          
          // Normalize show times relative to window
          let showStartNorm = showStartMinutes;
          let showEndNorm = showEndMinutes;
          
          // If show crosses midnight, handle it
          if (showEndMinutes > 24 * 60) {
            showEndNorm = showEndMinutes;
          }
          
          // Check overlap: slot overlaps if it intersects with show interval
          if (showEndNorm > showStartNorm) {
            // Normal case: show doesn't cross midnight
            overlaps = slotTimeMinutes < showEndNorm && slotEndMinutes > showStartNorm;
          } else {
            // Overnight show
            overlaps = slotTimeMinutes < showEndNorm || slotEndMinutes > showStartNorm;
          }
          
          if (overlaps) {
            // Check if this show is already in the slot (avoid duplicates)
            const exists = slot.shows.some(s => 
              s.title === show.title && 
              s.start === show.start && 
              s.end === show.end
            );
            if (!exists) {
              slot.shows.push({ ...show });
            }
          }
        });
      });
      
      timezoneData.days[dayName] = {
        date: dateStr,
        day: dayName,
        slots: daySlots
      };
    });
    
    output.regions[region].timezones[timezone] = timezoneData;
  });
});

// Write the output file
const outputPath = './public/zee-zonke-november-2025.json';
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('✅ Conversion completed!');
console.log(`Output file: ${outputPath}`);
console.log(`Regions: ${Object.keys(output.regions).join(', ')}`);

Object.keys(output.regions).forEach(region => {
  Object.keys(output.regions[region].timezones).forEach(timezone => {
    const days = Object.keys(output.regions[region].timezones[timezone].days);
    console.log(`  ${region}/${timezone}: ${days.length} days`);
    days.forEach(day => {
      const dayData = output.regions[region].timezones[timezone].days[day];
      const totalShows = dayData.slots.reduce((sum, slot) => sum + slot.shows.length, 0);
      console.log(`    ${day} (${dayData.date}): ${dayData.slots.length} slots, ${totalShows} show entries`);
    });
  });
});

// Validate structure
console.log('\n📋 Validation:');
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
Object.keys(output.regions).forEach(region => {
  Object.keys(output.regions[region].timezones).forEach(timezone => {
    const days = Object.keys(output.regions[region].timezones[timezone].days);
    const missingDays = weekdays.filter(d => !days.includes(d));
    if (missingDays.length > 0) {
      console.warn(`  ⚠️  ${region}/${timezone}: Missing days: ${missingDays.join(', ')}`);
    } else {
      console.log(`  ✅ ${region}/${timezone}: All 7 days present`);
    }
  });
});


