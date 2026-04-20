const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const excelPath = '/Users/danieleloma/Downloads/Channel TV Guide/Zee Zonke November 2025 FPC (24 - 30 Nov) Edited.xlsx';
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Converting Zee Zonke Excel file...');
console.log('Total rows:', jsonData.length);

// Get headers (first row)
const headers = jsonData[0];
const dataRows = jsonData.slice(1);

// Helper function to parse time string (HH:MM) to minutes
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to format minutes to time string (HH:MM)
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper function to get day name from date
function getDayName(dateStr) {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

// Helper function to generate all 30-minute slots for a day
function generateSlots(startTime, endTime) {
  const slots = [];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  let current = startMinutes;
  
  while (current < endMinutes || (endMinutes < startMinutes && current < 24 * 60)) {
    slots.push(minutesToTime(current));
    current += 30;
    if (current >= 24 * 60 && endMinutes < startMinutes) {
      // Handle overnight shows
      break;
    }
  }
  return slots;
}

// Process the data
const showsByRegion = {};

dataRows.forEach((row, index) => {
  if (!row || row.length < headers.length) return;
  
  const region = row[0] || 'SA';
  const date = row[1];
  const startTime = row[2];
  const endTime = row[3];
  const title = row[4];
  const season = row[5];
  const episode = row[6];
  const subtitle = row[7];
  const textColor = row[8];
  const bgColor = row[9];
  const timezone = row[10] || 'CAT';
  
  if (!date || !title || !startTime || !endTime) return;
  
  if (!showsByRegion[region]) {
    showsByRegion[region] = {};
  }
  if (!showsByRegion[region][timezone]) {
    showsByRegion[region][timezone] = {};
  }
  if (!showsByRegion[region][timezone][date]) {
    showsByRegion[region][timezone][date] = [];
  }
  
  const show = {
    title: title.trim(),
    start: startTime,
    end: endTime
  };
  
  if (season) show.season = season.toString();
  if (episode) show.episode = episode.toString();
  if (subtitle) show.subtitle = subtitle.toString();
  if (textColor) show.textColor = textColor;
  if (bgColor) show.bgColor = bgColor;
  
  showsByRegion[region][timezone][date].push(show);
});

// Build the JSON structure
const output = {
  window: {
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
    const timezoneData = {
      timezone: timezone,
      days: {}
    };
    
    // Determine window times for this timezone
    let minStart = 24 * 60;
    let maxEnd = 0;
    
    // First pass: find min start and max end times
    Object.keys(showsByRegion[region][timezone]).forEach(date => {
      showsByRegion[region][timezone][date].forEach(show => {
        const start = timeToMinutes(show.start);
        const end = timeToMinutes(show.end);
        minStart = Math.min(minStart, start);
        if (end < start) {
          // Overnight show
          maxEnd = Math.max(maxEnd, end + 24 * 60);
        } else {
          maxEnd = Math.max(maxEnd, end);
        }
      });
    });
    
    // Set window for this timezone
    if (!output.window[timezone]) {
      output.window[timezone] = {
        start: minutesToTime(minStart),
        end: minutesToTime(maxEnd % (24 * 60))
      };
    }
    
    // Process each date
    Object.keys(showsByRegion[region][timezone]).sort().forEach(date => {
      const dayName = getDayName(date);
      const shows = showsByRegion[region][timezone][date];
      
      // Generate all slots for the day
      const windowStart = output.window[timezone].start;
      const windowEnd = output.window[timezone].end;
      const slots = generateSlots(windowStart, windowEnd);
      
      // Initialize slots structure
      const daySlots = slots.map(time => ({
        time: time,
        shows: []
      }));
      
      // Place shows in appropriate slots
      shows.forEach(show => {
        const showStart = timeToMinutes(show.start);
        const showEnd = timeToMinutes(show.end);
        
        // Find all slots that overlap with this show
        daySlots.forEach(slot => {
          const slotTime = timeToMinutes(slot.time);
          const slotEnd = slotTime + 30;
          
          // Check if show overlaps with this slot
          let overlaps = false;
          if (showEnd < showStart) {
            // Overnight show
            overlaps = slotTime < showEnd || slotTime >= showStart;
          } else {
            overlaps = slotTime < showEnd && slotEnd > showStart;
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
        date: date,
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
  });
});

