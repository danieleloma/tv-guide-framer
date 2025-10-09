/**
 * Detailed Excel Analysis - Check specific issues mentioned by user
 */

const XLSX = require('xlsx');

function detailedExcelAnalysis(filePath) {
  console.log(`\n🔍 Detailed analysis of Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Read raw data to check actual content
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  
  console.log(`\n=== RAW DATA INSPECTION ===`);
  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${rawData.length}`);
  
  // Check first few rows in detail
  console.log(`\n=== FIRST 10 ROWS DETAILED ===`);
  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i];
    console.log(`\nRow ${i + 1}:`);
    console.log(`  Length: ${row.length} columns`);
    console.log(`  Content:`, row);
    
    // Check for empty cells
    const emptyCells = [];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === null || row[j] === undefined || row[j] === '') {
        emptyCells.push(j);
      }
    }
    if (emptyCells.length > 0) {
      console.log(`  Empty cells at positions: ${emptyCells.join(', ')}`);
    }
  }
  
  // Check header row specifically
  console.log(`\n=== HEADER ROW ANALYSIS ===`);
  const headerRow = rawData[0];
  console.log(`Header row length: ${headerRow.length}`);
  console.log(`Header content:`, headerRow);
  
  // Check if there are extra columns beyond the expected 11
  if (headerRow.length > 11) {
    console.log(`⚠️  Extra columns found beyond the expected 11`);
    console.log(`Columns 12+:`, headerRow.slice(11));
  }
  
  // Check second row (first data row) specifically
  console.log(`\n=== FIRST DATA ROW ANALYSIS ===`);
  const firstDataRow = rawData[1];
  console.log(`First data row length: ${firstDataRow.length}`);
  console.log(`First data row content:`, firstDataRow);
  
  // Parse the date from the first data row
  if (firstDataRow[1]) {
    const dateValue = firstDataRow[1];
    console.log(`\nDate value type: ${typeof dateValue}`);
    console.log(`Date value: ${dateValue}`);
    
    if (typeof dateValue === 'number') {
      // Excel serial date
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
      const dateISO = date.toISOString().split('T')[0];
      console.log(`Converted date: ${dateISO}`);
      console.log(`Day of week: ${date.toLocaleDateString('en-US', { weekday: 'long' })}`);
    } else if (typeof dateValue === 'string') {
      console.log(`Date string: ${dateValue}`);
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        const dateISO = date.toISOString().split('T')[0];
        console.log(`Parsed date: ${dateISO}`);
        console.log(`Day of week: ${date.toLocaleDateString('en-US', { weekday: 'long' })}`);
      }
    }
  }
  
  // Check for missing fields issue
  console.log(`\n=== MISSING FIELDS ANALYSIS ===`);
  const expectedFields = ['Region', 'Date', 'Start Time', 'End Time', 'Title', 'Season', 'Episode', 'Subtitle', 'Text Color', 'BG Color', 'Timezone'];
  
  let missingFieldsCount = 0;
  let totalRowsWithMissingFields = 0;
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    let rowMissingFields = 0;
    
    for (let j = 0; j < Math.min(11, row.length); j++) {
      const value = row[j];
      if (value === null || value === undefined || value === '') {
        rowMissingFields++;
        missingFieldsCount++;
      }
    }
    
    if (rowMissingFields > 0) {
      totalRowsWithMissingFields++;
      if (totalRowsWithMissingFields <= 5) { // Show first 5 rows with missing fields
        console.log(`Row ${i + 1} missing ${rowMissingFields} fields:`, row.slice(0, 11));
      }
    }
  }
  
  console.log(`\nTotal rows with missing fields: ${totalRowsWithMissingFields}`);
  console.log(`Total missing field instances: ${missingFieldsCount}`);
  
  // Check date range more carefully
  console.log(`\n=== DATE RANGE ANALYSIS ===`);
  const dates = new Set();
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (row[1]) {
      const dateValue = row[1];
      let dateISO;
      
      if (typeof dateValue === 'number') {
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
        dateISO = date.toISOString().split('T')[0];
      } else if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          dateISO = date.toISOString().split('T')[0];
        }
      }
      
      if (dateISO) {
        dates.add(dateISO);
      }
    }
  }
  
  const sortedDates = Array.from(dates).sort();
  console.log(`Unique dates found: ${sortedDates.length}`);
  console.log(`Date range: ${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`);
  
  if (sortedDates.length > 0) {
    const firstDate = new Date(sortedDates[0]);
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    console.log(`First date day: ${firstDate.toLocaleDateString('en-US', { weekday: 'long' })}`);
    console.log(`Last date day: ${lastDate.toLocaleDateString('en-US', { weekday: 'long' })}`);
  }
  
  // Check for extra columns issue
  console.log(`\n=== COLUMN COUNT ANALYSIS ===`);
  const columnCounts = {};
  for (let i = 0; i < rawData.length; i++) {
    const rowLength = rawData[i].length;
    columnCounts[rowLength] = (columnCounts[rowLength] || 0) + 1;
  }
  
  console.log(`Column count distribution:`);
  Object.keys(columnCounts).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
    console.log(`  ${count} columns: ${columnCounts[count]} rows`);
  });
  
  return {
    totalRows: rawData.length,
    headerRow: headerRow,
    firstDataRow: firstDataRow,
    dates: sortedDates,
    missingFieldsCount,
    totalRowsWithMissingFields
  };
}

// Run the detailed analysis
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025.xlsx';
detailedExcelAnalysis(filePath);


