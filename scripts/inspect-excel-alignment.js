/**
 * Inspect Excel sheet to confirm alignment with Framer component requirements
 */

const XLSX = require('xlsx');

function inspectExcelAlignment(filePath) {
  console.log(`\n🔍 Inspecting Excel file for Framer component alignment: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`\n=== EXCEL FILE STRUCTURE ===`);
  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${jsonData.length}`);
  
  // Check headers
  const headers = jsonData[0];
  console.log(`\nHeaders:`, headers);
  
  // Expected headers for Framer component alignment
  const expectedHeaders = [
    'Region', 'Date', 'Start Time', 'End Time', 'Title', 
    'Season', 'Episode', 'Subtitle', 'Text Color', 'BG Color', 'Timezone'
  ];
  
  console.log(`\n=== HEADER ALIGNMENT CHECK ===`);
  console.log('Expected headers:', expectedHeaders);
  console.log('Actual headers:', headers);
  
  let headerAlignment = true;
  expectedHeaders.forEach((expected, index) => {
    const actual = headers[index];
    if (expected !== actual) {
      console.log(`❌ Header mismatch at column ${index + 1}: Expected "${expected}", got "${actual}"`);
      headerAlignment = false;
    }
  });
  
  if (headerAlignment) {
    console.log('✅ Headers align perfectly with Framer component requirements!');
  }
  
  // Check data format
  console.log(`\n=== DATA FORMAT ANALYSIS ===`);
  
  const dataRows = jsonData.slice(1);
  console.log(`Found ${dataRows.length} data rows`);
  
  // Sample first 10 rows
  console.log(`\nFirst 10 data rows:`);
  for (let i = 0; i < Math.min(10, dataRows.length); i++) {
    const row = dataRows[i];
    console.log(`Row ${i + 1}:`, row);
  }
  
  // Analyze data types and formats
  console.log(`\n=== DATA TYPE ANALYSIS ===`);
  
  const analysis = {
    regions: new Set(),
    timezones: new Set(),
    dates: new Set(),
    timeFormats: new Set(),
    showTitles: new Set()
  };
  
  let validRows = 0;
  let invalidRows = 0;
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    
    if (row.length < 11) {
      invalidRows++;
      continue;
    }
    
    const region = row[0];
    const dateSerial = row[1];
    const startTimeDecimal = row[2];
    const endTimeDecimal = row[3];
    const title = row[4];
    const season = row[5];
    const episode = row[6];
    const subtitle = row[7];
    const textColor = row[8];
    const bgColor = row[9];
    const timezone = row[10];
    
    // Validate required fields
    if (!region || !dateSerial || startTimeDecimal === undefined || endTimeDecimal === undefined || !title || !timezone) {
      invalidRows++;
      continue;
    }
    
    validRows++;
    
    // Collect unique values
    analysis.regions.add(region);
    analysis.timezones.add(timezone);
    analysis.showTitles.add(title);
    
    // Convert Excel serial date to ISO
    if (typeof dateSerial === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch.getTime() + (dateSerial - 2) * 24 * 60 * 60 * 1000);
      const dateISO = date.toISOString().split('T')[0];
      analysis.dates.add(dateISO);
    }
    
    // Check time format
    if (typeof startTimeDecimal === 'number') {
      analysis.timeFormats.add(typeof startTimeDecimal);
    }
  }
  
  console.log(`Valid rows: ${validRows}`);
  console.log(`Invalid rows: ${invalidRows}`);
  
  console.log(`\nUnique regions:`, Array.from(analysis.regions));
  console.log(`Unique timezones:`, Array.from(analysis.timezones));
  console.log(`Unique dates:`, Array.from(analysis.dates).sort());
  console.log(`Time formats:`, Array.from(analysis.timeFormats));
  console.log(`Sample show titles:`, Array.from(analysis.showTitles).slice(0, 5));
  
  // Check time range compliance
  console.log(`\n=== TIME RANGE COMPLIANCE CHECK ===`);
  
  const timeRanges = {
    SA: { min: 0.25, max: 0.229167 }, // 6:00 AM - 5:30 AM next day
    ROA_WAT: { min: 0.208333, max: 0.166667 }, // 5:00 AM - 4:00 AM next day
    ROA_CAT: { min: 0.25, max: 0.208333 } // 6:00 AM - 5:00 AM next day
  };
  
  const timeCompliance = {
    SA: { valid: 0, invalid: 0 },
    ROA_WAT: { valid: 0, invalid: 0 },
    ROA_CAT: { valid: 0, invalid: 0 }
  };
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (row.length < 11) continue;
    
    const region = row[0];
    const startTimeDecimal = row[2];
    const timezone = row[10];
    
    if (typeof startTimeDecimal !== 'number') continue;
    
    let isValid = false;
    
    if (region === 'SA' && timezone === 'CAT') {
      isValid = startTimeDecimal >= timeRanges.SA.min || startTimeDecimal <= timeRanges.SA.max;
      if (isValid) timeCompliance.SA.valid++;
      else timeCompliance.SA.invalid++;
    } else if (region === 'ROA') {
      if (timezone === 'WAT') {
        isValid = startTimeDecimal >= timeRanges.ROA_WAT.min || startTimeDecimal <= timeRanges.ROA_WAT.max;
        if (isValid) timeCompliance.ROA_WAT.valid++;
        else timeCompliance.ROA_WAT.invalid++;
      } else if (timezone === 'CAT') {
        isValid = startTimeDecimal >= timeRanges.ROA_CAT.min || startTimeDecimal <= timeRanges.ROA_CAT.max;
        if (isValid) timeCompliance.ROA_CAT.valid++;
        else timeCompliance.ROA_CAT.invalid++;
      }
    }
  }
  
  console.log('Time range compliance:');
  Object.keys(timeCompliance).forEach(key => {
    const { valid, invalid } = timeCompliance[key];
    const total = valid + invalid;
    const percentage = total > 0 ? (valid / total * 100).toFixed(1) : 0;
    console.log(`  ${key}: ${valid}/${total} (${percentage}%) compliant`);
  });
  
  // Check date range
  console.log(`\n=== DATE RANGE CHECK ===`);
  const sortedDates = Array.from(analysis.dates).sort();
  if (sortedDates.length > 0) {
    console.log(`Date range: ${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`);
    console.log(`Total days: ${sortedDates.length}`);
    
    // Check if it's a complete week (Monday to Sunday)
    const firstDate = new Date(sortedDates[0]);
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    
    console.log(`Days span: ${daysDiff + 1} days`);
    
    if (daysDiff === 6 && firstDate.getDay() === 1) {
      console.log('✅ Complete week from Monday to Sunday');
    } else {
      console.log('⚠️  Not a complete Monday-to-Sunday week');
    }
  }
  
  // Final alignment assessment
  console.log(`\n=== FINAL ALIGNMENT ASSESSMENT ===`);
  
  const alignmentScore = {
    headers: headerAlignment ? 100 : 0,
    dataFormat: validRows > 0 ? (validRows / (validRows + invalidRows) * 100) : 0,
    timeCompliance: 0,
    dateRange: sortedDates.length === 7 ? 100 : (sortedDates.length / 7 * 100)
  };
  
  // Calculate overall time compliance
  const totalValidTimes = Object.values(timeCompliance).reduce((sum, item) => sum + item.valid, 0);
  const totalTimes = Object.values(timeCompliance).reduce((sum, item) => sum + item.valid + item.invalid, 0);
  alignmentScore.timeCompliance = totalTimes > 0 ? (totalValidTimes / totalTimes * 100) : 0;
  
  const overallScore = Object.values(alignmentScore).reduce((sum, score) => sum + score, 0) / Object.keys(alignmentScore).length;
  
  console.log(`Alignment scores:`);
  console.log(`  Headers: ${alignmentScore.headers.toFixed(1)}%`);
  console.log(`  Data Format: ${alignmentScore.dataFormat.toFixed(1)}%`);
  console.log(`  Time Compliance: ${alignmentScore.timeCompliance.toFixed(1)}%`);
  console.log(`  Date Range: ${alignmentScore.dateRange.toFixed(1)}%`);
  console.log(`\nOverall Alignment Score: ${overallScore.toFixed(1)}%`);
  
  if (overallScore >= 90) {
    console.log('🎉 EXCELLENT! Your Excel sheet aligns perfectly with the Framer component!');
  } else if (overallScore >= 75) {
    console.log('✅ GOOD! Your Excel sheet mostly aligns with the Framer component.');
  } else if (overallScore >= 50) {
    console.log('⚠️  FAIR! Your Excel sheet needs some adjustments for optimal alignment.');
  } else {
    console.log('❌ POOR! Your Excel sheet needs significant changes to align with the Framer component.');
  }
  
  return {
    overallScore,
    alignmentScore,
    analysis,
    timeCompliance
  };
}

// Run the inspection
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025.xlsx';
inspectExcelAlignment(filePath);
