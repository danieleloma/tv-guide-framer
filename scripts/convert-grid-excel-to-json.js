/**
 * Convert grid-format Excel file to JSON with proper timezone separation
 * Handles the specific grid layout with WAT/CAT timezones and day columns
 */

const XLSX = require('xlsx');
const fs = require('fs');

function convertGridExcelToJSON(filePath) {
  console.log(`\n📊 Converting grid Excel file to JSON: ${filePath}`);
  
  // Read with cellDates: true to get actual date objects
  const workbook = XLSX.readFile(filePath, { 
    cellDates: true,
    cellNF: false,
    cellStyles: false
  });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: null,
    raw: false
  });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Parse the grid structure
  // Row 2: ['WAT', 'CAT', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  // Row 3: [null, null, '29-Sep', '30-Sep', '1-Oct', '1-Oct', '2-Oct', '3-Oct', '4-Oct']
  // Row 4+: [time1, time2, show1, show2, show3, show4, show5, show6, show7]
  
  const timezoneHeaders = jsonData[1]; // WAT, CAT, Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const dateHeaders = jsonData[2]; // null, null, dates...
  const timeSlots = [];
  const shows = [];
  
  console.log('Timezone headers:', timezoneHeaders);
  console.log('Date headers:', dateHeaders);
  
  // Extract time slots and shows (starting from row 3, index 3)
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] && row[1]) { // Has both WAT and CAT times
      const watTime = row[0];
      const catTime = row[1];
      
      // Parse time strings like "5:00:00"
      const watTimeObj = parseTimeString(watTime);
      const catTimeObj = parseTimeString(catTime);
      
      if (watTimeObj && catTimeObj) {
        timeSlots.push({
          wat: watTimeObj,
          cat: catTimeObj
        });
        
        // Get shows for each day (columns 2-8)
        const dayShows = [];
        for (let dayIndex = 2; dayIndex < 9; dayIndex++) {
          const showTitle = row[dayIndex];
          dayShows.push(showTitle || '');
        }
        shows.push(dayShows);
      }
    }
  }
  
  console.log(`Found ${timeSlots.length} time slots`);
  console.log('Sample time slots:', timeSlots.slice(0, 5));
  console.log('Sample shows:', shows.slice(0, 3));
  
  // Parse dates from headers
  const weekDates = [];
  for (let i = 2; i < 9; i++) {
    const dateStr = dateHeaders[i];
    if (dateStr) {
      const dateObj = parseDateString(dateStr);
      if (dateObj) {
        weekDates.push(dateObj);
      }
    }
  }
  
  console.log('Week dates:', weekDates);
  
  // Generate WAT data (5:00 AM - 4:00 AM next day)
  const watDays = generateTimezoneDays('WAT', weekDates, timeSlots, shows, 5, 4);
  
  // Generate CAT data (6:00 AM - 5:00 AM next day)
  const catDays = generateTimezoneDays('CAT', weekDates, timeSlots, shows, 6, 5);
  
  // Create ROA data structure
  const roaData = {
    "metadata": {
      "channelId": "zee-world-roa",
      "generatedAt": new Date().toISOString(),
      "defaultRegion": "ROA",
      "defaultTimezone": "WAT"
    },
    "regions": [
      {
        "code": "ROA",
        "label": "Rest of Africa",
        "timezones": ["WAT", "CAT"],
        "days": [...watDays, ...catDays]
      }
    ]
  };
  
  // Save to file
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/roa-guide-grid-converted.json';
  fs.writeFileSync(outputPath, JSON.stringify(roaData, null, 2));
  
  console.log(`\n✅ ROA guide data saved to: ${outputPath}`);
  console.log(`📊 Structure: ${roaData.regions[0].days.length} day-timezone combinations`);
  console.log(`📊 WAT days: ${watDays.length}`);
  console.log(`📊 CAT days: ${catDays.length}`);
  
  // Calculate total slots
  const totalSlots = roaData.regions[0].days.reduce((sum, day) => sum + day.slots.length, 0);
  console.log(`📊 Total slots: ${totalSlots}`);
  
  return roaData;
}

function parseTimeString(timeStr) {
  if (typeof timeStr === 'string') {
    const match = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        second: parseInt(match[3])
      };
    }
  }
  return null;
}

function parseDateString(dateStr) {
  if (typeof dateStr === 'string') {
    // Handle formats like "29-Sep", "1-Oct"
    const match = dateStr.match(/(\d{1,2})-([A-Za-z]{3})/);
    if (match) {
      const day = parseInt(match[1]);
      const monthStr = match[2];
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const month = monthMap[monthStr];
      if (month !== undefined) {
        // Assume year 2025
        const date = new Date(2025, month, day);
        return date.toISOString().split('T')[0];
      }
    }
  }
  return null;
}

function generateTimezoneDays(timezone, weekDates, timeSlots, shows, startHour, endHour) {
  const days = [];
  
  weekDates.forEach((dateISO, dayIndex) => {
    const slots = [];
    
    // Process each time slot
    timeSlots.forEach((timeSlot, timeIndex) => {
      const showTitle = shows[timeIndex][dayIndex];
      
      if (showTitle && showTitle.trim() !== '') {
        const time = timezone === 'WAT' ? timeSlot.wat : timeSlot.cat;
        
        // Create start time
        const startISO = `${dateISO}T${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`;
        
        // Calculate end time (next slot or same time + 1 hour)
        let endTime;
        if (timeIndex < timeSlots.length - 1) {
          const nextTimeSlot = timeSlots[timeIndex + 1];
          endTime = timezone === 'WAT' ? nextTimeSlot.wat : nextTimeSlot.cat;
        } else {
          // Last slot - assume 1 hour duration
          endTime = {
            hour: (time.hour + 1) % 24,
            minute: time.minute
          };
        }
        
        // Handle cross-midnight
        let endDateISO = dateISO;
        if (endTime.hour < time.hour) {
          // Crossed midnight
          const endDate = new Date(dateISO);
          endDate.setDate(endDate.getDate() + 1);
          endDateISO = endDate.toISOString().split('T')[0];
        }
        
        const endISO = `${endDateISO}T${endTime.hour.toString().padStart(2, '0')}:${endTime.minute.toString().padStart(2, '0')}:00`;
        
        // Parse show title and episode info
        const { title, season, episode } = parseShowTitle(showTitle);
        
        slots.push({
          startISO,
          endISO,
          title,
          season,
          episode,
          subtitle: "",
          textColor: "#FFFFFF",
          bgColor: "#1A1A1A",
          durationMin: calculateDuration(startISO, endISO)
        });
      }
    });
    
    if (slots.length > 0) {
      days.push({
        dateISO,
        timezone,
        slots
      });
    }
  });
  
  return days;
}

function parseShowTitle(showTitle) {
  // Parse titles like "Sister Wives S1 Ep 142" or "Radhe Mohan S3 EP 68"
  const match = showTitle.match(/^(.+?)\s+(S\d+)\s+(EP|Ep)\s+(\d+)$/i);
  if (match) {
    return {
      title: match[1].trim(),
      season: match[2],
      episode: `${match[3]} ${match[4]}`
    };
  }
  
  // Fallback for other formats
  return {
    title: showTitle.trim(),
    season: "",
    episode: ""
  };
}

function calculateDuration(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  return Math.round((end - start) / (1000 * 60)); // minutes
}

// Run the conversion
const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC ROA.xlsx';
convertGridExcelToJSON(filePath);


