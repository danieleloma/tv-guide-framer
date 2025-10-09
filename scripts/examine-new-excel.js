/**
 * Examine the new Excel file structure
 */

const XLSX = require('xlsx');

function examineNewExcel(filePath) {
  console.log(`\n🔍 Examining new Excel file: ${filePath}`);
  
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
  
  console.log(`\n=== EXCEL FILE STRUCTURE ===`);
  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${jsonData.length}`);
  
  // Check headers
  const headers = jsonData[0];
  console.log(`\nHeaders:`, headers);
  
  // Check first 10 data rows
  console.log(`\n=== FIRST 10 DATA ROWS ===`);
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const row = jsonData[i];
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
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    if (row.length < 11) {
      invalidRows++;
      continue;
    }
    
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
    
    // Validate required fields
    if (!region || !dateValue || startTimeDecimal === undefined || endTimeDecimal === undefined || !title || !timezone) {
      invalidRows++;
      continue;
    }
    
    validRows++;
    
    // Collect unique values
    analysis.regions.add(region);
    analysis.timezones.add(timezone);
    analysis.showTitles.add(title);
    
    // Convert date to ISO
    if (dateValue instanceof Date) {
      const dateISO = dateValue.toISOString().split('T')[0];
      analysis.dates.add(dateISO);
    } else if (typeof dateValue === 'string') {
      const dateMatch = dateValue.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        analysis.dates.add(dateMatch[1]);
      }
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
  
  // Check date range
  console.log(`\n=== DATE RANGE ANALYSIS ===`);
  const sortedDates = Array.from(analysis.dates).sort();
  if (sortedDates.length > 0) {
    console.log(`Date range: ${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`);
    console.log(`Total days: ${sortedDates.length}`);
    
    // Check if it's a complete week (Monday to Sunday)
    const firstDate = new Date(sortedDates[0]);
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    console.log(`First date day: ${firstDate.toLocaleDateString('en-US', { weekday: 'long' })}`);
    console.log(`Last date day: ${lastDate.toLocaleDateString('en-US', { weekday: 'long' })}`);
    
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    console.log(`Days span: ${daysDiff + 1} days`);
    
    if (daysDiff === 6 && firstDate.getDay() === 1) {
      console.log('✅ Complete week from Monday to Sunday');
    } else {
      console.log('⚠️  Not a complete Monday-to-Sunday week');
    }
  }
  
  return {
    totalRows: jsonData.length,
    validRows,
    invalidRows,
    analysis,
    headers
  };
}

// Run the examination
const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC ROA.xlsx';
examineNewExcel(filePath);


