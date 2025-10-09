/**
 * Examine ROA Excel file structure
 */

const XLSX = require('xlsx');

function examineROAExcel(filePath) {
  console.log(`\n🔍 Examining ROA Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`\n=== EXCEL FILE STRUCTURE ===`);
  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${jsonData.length}`);
  
  // Show first 10 rows to understand structure
  console.log(`\nFirst 10 rows:`);
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const row = jsonData[i];
    console.log(`Row ${i}:`, row);
  }
  
  // Look for time-related data
  console.log(`\n=== SEARCHING FOR TIME DATA ===`);
  for (let i = 0; i < Math.min(20, jsonData.length); i++) {
    const row = jsonData[i];
    if (row && row.length > 0) {
      // Check if first column contains numbers (potential time slots)
      if (typeof row[0] === 'number' && row[0] > 0 && row[0] < 1) {
        console.log(`Found potential time slot at row ${i}:`, row[0]);
      }
      // Check for time-like strings
      if (typeof row[0] === 'string' && (row[0].includes(':') || row[0].includes('AM') || row[0].includes('PM'))) {
        console.log(`Found potential time string at row ${i}:`, row[0]);
      }
    }
  }
  
  // Look for show titles
  console.log(`\n=== SEARCHING FOR SHOW TITLES ===`);
  for (let i = 0; i < Math.min(20, jsonData.length); i++) {
    const row = jsonData[i];
    if (row && row.length > 1) {
      for (let j = 1; j < Math.min(8, row.length); j++) {
        if (row[j] && typeof row[j] === 'string' && row[j].length > 5) {
          console.log(`Found potential show title at row ${i}, col ${j}:`, row[j]);
        }
      }
    }
  }
}

// Run the examination
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
examineROAExcel(filePath);


