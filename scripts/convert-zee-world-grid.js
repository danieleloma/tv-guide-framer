/**
 * Convert Zee World Grid Format Excel to JSON
 * Handles the specific grid layout with timezones and days
 */

const XLSX = require('xlsx');
const fs = require('fs');

function convertZeeWorldGrid(filePath) {
  console.log(`\n📊 Converting Zee World Grid Format: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Found ${jsonData.length} rows in sheet: ${sheetName}`);
  
  // Analyze the structure
  console.log(`\n=== GRID STRUCTURE ANALYSIS ===`);
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const row = jsonData[i];
    console.log(`Row ${i + 1}:`, row);
  }
  
  // Extract timezone headers (Row 2)
  const timezoneRow = jsonData[1];
  const timezones = [timezoneRow[0], timezoneRow[1]].filter(tz => tz && tz.trim());
  console.log(`\nTimezones found:`, timezones);
  
  // Extract day headers (Row 2, columns 2-8)
  const dayHeaders = timezoneRow.slice(2, 9);
  console.log(`Day headers:`, dayHeaders);
  
  // Extract dates (Row 3, columns 2-8)
  const dateRow = jsonData[2];
  const dates = [];
  for (let i = 2; i < 9; i++) {
    if (dateRow[i]) {
      let dateISO;
      if (dateRow[i] instanceof Date) {
        dateISO = dateRow[i].toISOString().split('T')[0];
      } else if (typeof dateRow[i] === 'string') {
        const dateMatch = dateRow[i].match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          dateISO = dateMatch[1];
        }
      }
      dates.push(dateISO);
    }
  }
  console.log(`Dates found:`, dates);
  
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
      
      if (!dayDate || !showTitle || showTitle.trim() === '') continue;
      
      // Process WAT timezone
      if (watTime) {
        const startTime = decimalToTime(watTime);
        const endTime = calculateEndTime(startTime, 30); // 30-minute slots
        
        if (validateWATTime(startTime)) {
          processedData.push({
            region: 'ROA',
            dateISO: dayDate,
            timezone: 'WAT',
            startISO: `${dayDate}T${startTime}:00`,
            endISO: `${dayDate}T${endTime}:00`,
            title: parseShowTitle(showTitle),
            season: parseSeason(showTitle),
            episode: parseEpisode(showTitle),
            subtitle: '',
            textColor: '#FFFFFF',
            bgColor: '#1A1A1A',
            durationMin: 30
          });
        }
      }
      
      // Process CAT timezone
      if (catTime) {
        const startTime = decimalToTime(catTime);
        const endTime = calculateEndTime(startTime, 30); // 30-minute slots
        
        if (validateCATTime(startTime)) {
          processedData.push({
            region: 'ROA',
            dateISO: dayDate,
            timezone: 'CAT',
            startISO: `${dayDate}T${startTime}:00`,
            endISO: `${dayDate}T${endTime}:00`,
            title: parseShowTitle(showTitle),
            season: parseSeason(showTitle),
            episode: parseEpisode(showTitle),
            subtitle: '',
            textColor: '#FFFFFF',
            bgColor: '#1A1A1A',
            durationMin: 30
          });
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
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/zee-world-roa-converted.json';
  fs.writeFileSync(outputPath, JSON.stringify(guideData, null, 2));
  
  console.log(`\n✅ Zee World ROA guide data saved to: ${outputPath}`);
  console.log(`📊 Total day-timezone combinations: ${days.length}`);
  console.log(`📊 Total slots: ${days.reduce((sum, day) => sum + day.slots.length, 0)}`);
  
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
  if (!showText) return '';
  
  // Extract title (everything before season/episode info)
  const text = showText.toString().trim();
  
  // Handle patterns like "Sister Wives S1 Ep 142"
  const match = text.match(/^(.+?)\s+(S\d+\s+Ep?\s*\d+)/i);
  if (match) {
    return match[1].trim();
  }
  
  // Handle patterns like "Radhe Mohan S3 EP 68"
  const match2 = text.match(/^(.+?)\s+(S\d+\s+EP\s*\d+)/i);
  if (match2) {
    return match2[1].trim();
  }
  
  // If no pattern matches, return the whole text
  return text;
}

function parseSeason(showText) {
  if (!showText) return '';
  
  const text = showText.toString().trim();
  const match = text.match(/S(\d+)/i);
  return match ? `S${match[1]}` : '';
}

function parseEpisode(showText) {
  if (!showText) return '';
  
  const text = showText.toString().trim();
  const match = text.match(/Ep?\s*(\d+)/i);
  return match ? `Ep ${match[1]}` : '';
}

// Run the conversion
const filePath = '/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC ROA.xlsx';
convertZeeWorldGrid(filePath);


