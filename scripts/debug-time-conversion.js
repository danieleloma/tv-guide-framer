/**
 * Debug time conversion to understand the decimal time format
 */

const XLSX = require('xlsx');

function debugTimeConversion(filePath) {
  console.log(`\n🔍 Debugging time conversion: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Helper function to convert decimal time to HH:MM format
  function decimalToTime(decimal) {
    const totalMinutes = Math.round(decimal * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Helper function to convert Excel serial date to ISO date
  function excelSerialToISO(serialDate) {
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  console.log(`\n=== TIME CONVERSION DEBUG ===`);
  
  // Check first few rows to understand the time format
  for (let i = 1; i < Math.min(20, jsonData.length); i++) {
    const row = jsonData[i];
    if (row && row.length >= 11) {
      const region = row[0];
      const dateSerial = row[1];
      const startTimeDecimal = row[2];
      const endTimeDecimal = row[3];
      const title = row[4];
      const timezone = row[10];
      
      if (region === 'ROA' && title) {
        const dateISO = excelSerialToISO(dateSerial);
        const startTime = decimalToTime(startTimeDecimal);
        const endTime = decimalToTime(endTimeDecimal);
        
        console.log(`Row ${i}: ${title}`);
        console.log(`  Date: ${dateISO}`);
        console.log(`  Start Decimal: ${startTimeDecimal} -> ${startTime}`);
        console.log(`  End Decimal: ${endTimeDecimal} -> ${endTime}`);
        console.log(`  Timezone: ${timezone}`);
        console.log('');
        
        // Stop after showing first few examples
        if (i >= 10) break;
      }
    }
  }
  
  // Check for Sunday data (2025-10-12)
  console.log(`\n=== CHECKING FOR SUNDAY DATA (2025-10-12) ===`);
  let sundayCount = 0;
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row.length >= 11) {
      const region = row[0];
      const dateSerial = row[1];
      const title = row[4];
      
      if (region === 'ROA' && title) {
        const dateISO = excelSerialToISO(dateSerial);
        
        if (dateISO === '2025-10-12') {
          sundayCount++;
          const startTimeDecimal = row[2];
          const endTimeDecimal = row[3];
          const timezone = row[10];
          const startTime = decimalToTime(startTimeDecimal);
          const endTime = decimalToTime(endTimeDecimal);
          
          console.log(`Sunday show ${sundayCount}: ${title}`);
          console.log(`  Start: ${startTime}, End: ${endTime}, Timezone: ${timezone}`);
        }
      }
    }
  }
  
  if (sundayCount === 0) {
    console.log('No Sunday data found in Excel file');
  } else {
    console.log(`Found ${sundayCount} shows for Sunday (2025-10-12)`);
  }
  
  // Check the exact first and last shows as mentioned by user
  console.log(`\n=== VERIFYING FIRST AND LAST SHOWS ===`);
  
  // Find first show (should be ROA, 2025-10-06, 5:00, 6:00, Sister Wives, WAT)
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row.length >= 11) {
      const region = row[0];
      const dateSerial = row[1];
      const startTimeDecimal = row[2];
      const endTimeDecimal = row[3];
      const title = row[4];
      const timezone = row[10];
      
      if (region === 'ROA' && title === 'Sister Wives') {
        const dateISO = excelSerialToISO(dateSerial);
        const startTime = decimalToTime(startTimeDecimal);
        const endTime = decimalToTime(endTimeDecimal);
        
        console.log(`First Sister Wives show at row ${i}:`);
        console.log(`  Region: ${region}`);
        console.log(`  Date: ${dateISO}`);
        console.log(`  Start Decimal: ${startTimeDecimal} -> ${startTime}`);
        console.log(`  End Decimal: ${endTimeDecimal} -> ${endTime}`);
        console.log(`  Title: ${title}`);
        console.log(`  Timezone: ${timezone}`);
        break;
      }
    }
  }
  
  // Find last show (should be ROA, 2025-10-12, 5:00, 6:00, Hidden Intentions, CAT)
  for (let i = jsonData.length - 1; i >= 1; i--) {
    const row = jsonData[i];
    if (row && row.length >= 11) {
      const region = row[0];
      const dateSerial = row[1];
      const startTimeDecimal = row[2];
      const endTimeDecimal = row[3];
      const title = row[4];
      const timezone = row[10];
      
      if (region === 'ROA' && title === 'Hidden Intentions') {
        const dateISO = excelSerialToISO(dateSerial);
        const startTime = decimalToTime(startTimeDecimal);
        const endTime = decimalToTime(endTimeDecimal);
        
        console.log(`Last Hidden Intentions show at row ${i}:`);
        console.log(`  Region: ${region}`);
        console.log(`  Date: ${dateISO}`);
        console.log(`  Start Decimal: ${startTimeDecimal} -> ${startTime}`);
        console.log(`  End Decimal: ${endTimeDecimal} -> ${endTime}`);
        console.log(`  Title: ${title}`);
        console.log(`  Timezone: ${timezone}`);
        break;
      }
    }
  }
}

// Run the debug
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
debugTimeConversion(filePath);


