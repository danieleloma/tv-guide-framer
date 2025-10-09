/**
 * Convert Google Sheets ROA data to JSON
 * This version handles Google Sheets date format properly
 */

const XLSX = require('xlsx');
const fs = require('fs');

function convertGoogleSheetsROA(filePath) {
  console.log(`\n📊 Converting Google Sheets ROA file: ${filePath}`);
  
  // Read Google Sheets file with proper date handling
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
  
  // Check first few rows to understand the format
  console.log(`\n=== FIRST 5 ROWS ANALYSIS ===`);
  for (let i = 0; i < Math.min(5, jsonData.length); i++) {
    const row = jsonData[i];
    console.log(`Row ${i + 1}:`, row);
  }
  
  // Process data
  const processedData = [];
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row.length < 11) continue;
    
    const region = row[0];
    const dateValue = row[1];
    const startTimeDecimal = row[2];
    const endTimeDecimal = row[3];
    const title = row[4];
    const season = row[5];
    const episode = row[6];
    const subtitle = row[7];
    const textColor = row[8];
    const bgColor = row[9];
    const timezone = row[10];
    
    // Skip if required fields are missing
    if (!region || !dateValue || startTimeDecimal === undefined || endTimeDecimal === undefined || !title || !timezone) {
      continue;
    }
    
    // Handle date - Google Sheets dates can be in various formats
    let dateISO;
    if (dateValue instanceof Date) {
      dateISO = dateValue.toISOString().split('T')[0];
    } else if (typeof dateValue === 'string') {
      // Try to parse string dates like "2025-10-06"
      const dateMatch = dateValue.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        dateISO = dateMatch[1];
      } else {
        // Try parsing as regular date string
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
          dateISO = parsedDate.toISOString().split('T')[0];
        }
      }
    } else if (typeof dateValue === 'number') {
      // Handle Google Sheets serial date (different from Excel)
      // Google Sheets uses 1899-12-30 as epoch, Excel uses 1900-01-01
      const googleSheetsEpoch = new Date(1899, 11, 30); // December 30, 1899
      const date = new Date(googleSheetsEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      dateISO = date.toISOString().split('T')[0];
    }
    
    if (!dateISO) {
      console.log(`⚠️  Could not parse date: ${dateValue} (type: ${typeof dateValue})`);
      continue;
    }
    
    // Convert decimal times to HH:MM format
    const startTime = decimalToTime(startTimeDecimal);
    const endTime = decimalToTime(endTimeDecimal);
    
    // Construct local ISO strings (without 'Z')
    const startISO = `${dateISO}T${startTime}:00`;
    const endISO = `${dateISO}T${endTime}:00`;
    
    processedData.push({
      region,
      dateISO,
      startISO,
      endISO,
      title,
      season,
      episode,
      subtitle: subtitle || '',
      textColor,
      bgColor,
      timezone,
      startTimeDecimal,
      endTimeDecimal
    });
  }
  
  console.log(`\nProcessed ${processedData.length} valid rows`);
  
  // Show sample of processed data
  console.log(`\n=== SAMPLE PROCESSED DATA ===`);
  for (let i = 0; i < Math.min(5, processedData.length); i++) {
    const item = processedData[i];
    console.log(`Row ${i + 1}: ${item.dateISO} ${item.startISO} ${item.title} (${item.timezone})`);
  }
  
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
      durationMin: Math.round((item.endTimeDecimal - item.startTimeDecimal) * 24 * 60)
    });
  });
  
  // Convert to GuideJSON format
  const days = Object.values(groupedData).map(group => ({
    dateISO: group.dateISO,
    slots: group.slots
  }));
  
  // Sort days by date
  days.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  
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
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/roa-guide-google-sheets.json';
  fs.writeFileSync(outputPath, JSON.stringify(guideData, null, 2));
  
  console.log(`\n✅ ROA guide data saved to: ${outputPath}`);
  console.log(`📊 Total days: ${days.length}`);
  console.log(`📊 Total slots: ${days.reduce((sum, day) => sum + day.slots.length, 0)}`);
  
  // Show date range
  if (days.length > 0) {
    const firstDate = days[0].dateISO;
    const lastDate = days[days.length - 1].dateISO;
    console.log(`📅 Date range: ${firstDate} to ${lastDate}`);
    
    // Check if it's a complete Monday-to-Sunday week
    const firstDay = new Date(firstDate).getDay();
    const lastDay = new Date(lastDate).getDay();
    console.log(`📅 First day: ${new Date(firstDate).toLocaleDateString('en-US', { weekday: 'long' })}`);
    console.log(`📅 Last day: ${new Date(lastDate).toLocaleDateString('en-US', { weekday: 'long' })}`);
    
    if (firstDay === 1 && lastDay === 0) {
      console.log('✅ Complete Monday-to-Sunday week!');
    } else {
      console.log('⚠️  Not a complete Monday-to-Sunday week');
    }
  }
  
  return guideData;
}

function decimalToTime(decimal) {
  const totalMinutes = Math.round(decimal * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Run the conversion
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025.xlsx';
convertGoogleSheetsROA(filePath);


