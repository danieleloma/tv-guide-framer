/**
 * Convert Zee World Grid Format Excel to JSON - Corrected Version
 * Handles the specific grid layout with proper date and time parsing
 */

const XLSX = require('xlsx');
const fs = require('fs');

function convertZeeWorldCorrected(filePath) {
  console.log(`\n📊 Converting Zee World Grid Format (Corrected): ${filePath}`);
  
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Extract timezone headers (Row 2)
  const timezoneRow = jsonData[1];
  const timezones = [timezoneRow[0], timezoneRow[1]].filter(tz => tz && tz.trim());
  console.log(`\nTimezones found:`, timezones);
  
  // Extract dates (Row 3, columns 2-8) and adjust to October 6-12, 2025
  const dateRow = jsonData[2];
  const baseDate = new Date('2025-10-06'); // Monday, October 6, 2025
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  console.log(`Adjusted dates (Mon-Sun):`, dates);
  
  // Process show data starting from row 4
  const processedData = [];
  
  for (let rowIndex = 3; rowIndex < jsonData.length; rowIndex++) {
    const row = jsonData[rowIndex];
    if (!row || row.length < 9) continue;
    
    // Get time slots for both timezones
    const watTime = row[0];
    const catTime = row[1];
    
    if (!watTime && !catTime) continue;
    
    // Process each day
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayDate = dates[dayIndex];
      const showTitle = row[dayIndex + 2];
      
      if (!dayDate || !showTitle || showTitle.trim() === '' || showTitle === 'Mon' || showTitle === 'Tue' || showTitle === 'Wed' || showTitle === 'Thu' || showTitle === 'Fri' || showTitle === 'Sat' || showTitle === 'Sun') continue;
      
      // Process WAT timezone
      if (watTime) {
        const startTime = decimalToTime(watTime);
        const endTime = calculateEndTime(startTime, 30); // 30-minute slots
        
        if (validateWATTime(startTime)) {
          const parsedShow = parseShowTitle(showTitle);
          if (parsedShow.title) {
            processedData.push({
              region: 'ROA',
              dateISO: dayDate,
              timezone: 'WAT',
              startISO: `${dayDate}T${startTime}:00`,
              endISO: `${dayDate}T${endTime}:00`,
              title: parsedShow.title,
              season: parsedShow.season,
              episode: parsedShow.episode,
              subtitle: '',
              textColor: '#FFFFFF',
              bgColor: '#1A1A1A',
              durationMin: 30
            });
          }
        }
      }
      
      // Process CAT timezone
      if (catTime) {
        const startTime = decimalToTime(catTime);
        const endTime = calculateEndTime(startTime, 30); // 30-minute slots
        
        if (validateCATTime(startTime)) {
          const parsedShow = parseShowTitle(showTitle);
          if (parsedShow.title) {
            processedData.push({
              region: 'ROA',
              dateISO: dayDate,
              timezone: 'CAT',
              startISO: `${dayDate}T${startTime}:00`,
              endISO: `${dayDate}T${endTime}:00`,
              title: parsedShow.title,
              season: parsedShow.season,
              episode: parsedShow.episode,
              subtitle: '',
              textColor: '#FFFFFF',
              bgColor: '#1A1A1A',
              durationMin: 30
            });
          }
        }
      }
    }
  }
  
  console.log(`\nProcessed ${processedData.length} show slots`);
  
  // Group by date and timezone
  const groupedData = {};
  
  processedData.forEach(item => {
    const key = `${item.dateISO}-${item.timezone}`;
    if (!groupedData[key]) {
      groupedData[key] = {
        dateISO: item.dateISO,
        timezone: item.timezone,
        slots: []
      };
    }
    
    groupedData[key].slots.push({
      startISO: item.startISO,
      endISO: item.endISO,
      title: item.title,
      season: item.season,
      episode: item.episode,
      subtitle: item.subtitle,
      textColor: item.textColor,
      bgColor: item.bgColor,
      durationMin: item.durationMin
    });
  });
  
  // Convert to GuideJSON format
  const days = Object.values(groupedData).map(group => ({
    dateISO: group.dateISO,
    timezone: group.timezone,
    slots: group.slots.sort((a, b) => a.startISO.localeCompare(b.startISO))
  }));
  
  // Sort days by date and timezone
  days.sort((a, b) => {
    if (a.dateISO !== b.dateISO) {
      return a.dateISO.localeCompare(b.dateISO);
    }
    return a.timezone.localeCompare(b.timezone);
  });
  
  const guideData = {
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
  
  // Save to file
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/zee-world-roa-final.json';
  fs.writeFileSync(outputPath, JSON.stringify(guideData, null, 2));
  
  console.log(`\n✅ Zee World ROA guide data saved to: ${outputPath}`);
  console.log(`📊 Total day-timezone combinations: ${days.length}`);
  console.log(`📊 Total slots: ${days.reduce((sum, day) => sum + day.slots.length, 0)}`);
  
  // Show timezone distribution
  const watDays = days.filter(d => d.timezone === 'WAT').length;
  const catDays = days.filter(d => d.timezone === 'CAT').length;
  console.log(`📊 WAT days: ${watDays}, CAT days: ${catDays}`);
  
  // Show sample data
  if (days.length > 0) {
    console.log(`\n📺 Sample slots for first day:`);
    const firstDay = days[0];
    firstDay.slots.slice(0, 5).forEach((slot, index) => {
      console.log(`  ${index + 1}. ${slot.title} (${slot.season} ${slot.episode}) - ${slot.startISO} to ${slot.endISO}`);
    });
  }
  
  return guideData;
}

function decimalToTime(decimal) {
  if (typeof decimal === 'number') {
    const totalMinutes = Math.round(decimal * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Handle Date objects (Google Sheets serial dates)
  if (decimal instanceof Date) {
    const hours = decimal.getHours();
    const minutes = decimal.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return '00:00';
}

function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

function validateWATTime(time) {
  const [hours] = time.split(':').map(Number);
  // WAT: 5:00 AM - 4:00 AM next day
  return hours >= 5 || hours <= 4;
}

function validateCATTime(time) {
  const [hours] = time.split(':').map(Number);
  // CAT: 6:00 AM - 5:00 AM next day
  return hours >= 6 || hours <= 5;
}

function parseShowTitle(showText) {
  if (!showText) return { title: '', season: '', episode: '' };
  
  const text = showText.toString().trim();
  
  // Handle patterns like "Sister Wives S1 Ep 142"
  const match = text.match(/^(.+?)\s+(S\d+\s+Ep?\s*\d+)/i);
  if (match) {
    return {
      title: match[1].trim(),
      season: `S${match[2].match(/S(\d+)/i)[1]}`,
      episode: `Ep ${match[2].match(/Ep?\s*(\d+)/i)[1]}`
    };
  }
  
  // Handle patterns like "Radhe Mohan S3 EP 68"
  const match2 = text.match(/^(.+?)\s+(S\d+\s+EP\s*\d+)/i);
  if (match2) {
    return {
      title: match2[1].trim(),
      season: `S${match2[2].match(/S(\d+)/i)[1]}`,
      episode: `Ep ${match2[2].match(/EP\s*(\d+)/i)[1]}`
    };
  }
  
  // Handle patterns like "Kelloggs Superstar Quiz Show S3 Ep 1"
  const match3 = text.match(/^(.+?)\s+(S\d+\s+Ep\s*\d+)/i);
  if (match3) {
    return {
      title: match3[1].trim(),
      season: `S${match3[2].match(/S(\d+)/i)[1]}`,
      episode: `Ep ${match3[2].match(/Ep\s*(\d+)/i)[1]}`
    };
  }
  
  // If no pattern matches, return the whole text as title
  return {
    title: text,
    season: '',
    episode: ''
  };
}

// Run the conversion
const filePath = '/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC ROA.xlsx';
convertZeeWorldCorrected(filePath);


