/**
 * Detailed examination of the ROA Excel file to find Sunday data
 */

const XLSX = require('xlsx');

function examineExcelDetailed(filePath) {
  console.log(`\n🔍 Detailed examination of Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`\n=== EXCEL FILE STRUCTURE ===`);
  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${jsonData.length}`);
  
  // Get headers from first row
  const headers = jsonData[0];
  console.log('Headers:', headers);
  
  // Process data rows (skip header row)
  const dataRows = jsonData.slice(1);
  console.log(`\nProcessing ${dataRows.length} data rows`);
  
  // Group by date to see all dates
  const dateGroups = {};
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (row.length < 10) continue;
    
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
    
    if (region !== 'ROA') continue;
    
    // Convert Excel serial date to ISO date
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (dateSerial - 2) * 24 * 60 * 60 * 1000);
    const dateISO = date.toISOString().split('T')[0];
    
    if (!dateGroups[dateISO]) {
      dateGroups[dateISO] = [];
    }
    
    dateGroups[dateISO].push({
      row: i + 2, // +2 because we skipped header and arrays are 0-indexed
      dateSerial,
      dateISO,
      startTimeDecimal,
      endTimeDecimal,
      title,
      season,
      episode,
      timezone
    });
  }
  
  // Display all dates found
  console.log(`\n=== ALL DATES FOUND ===`);
  const sortedDates = Object.keys(dateGroups).sort();
  sortedDates.forEach(dateISO => {
    const dayName = new Date(dateISO).toLocaleDateString('en-US', { weekday: 'long' });
    const count = dateGroups[dateISO].length;
    console.log(`${dateISO} (${dayName}): ${count} shows`);
  });
  
  // Show detailed data for each date
  sortedDates.forEach(dateISO => {
    const dayName = new Date(dateISO).toLocaleDateString('en-US', { weekday: 'long' });
    console.log(`\n=== ${dateISO} (${dayName}) ===`);
    
    const shows = dateGroups[dateISO];
    shows.slice(0, 10).forEach((show, index) => {
      console.log(`${index + 1}. Row ${show.row}: ${show.title} (${show.season} ${show.episode}) - ${show.timezone} - Start: ${show.startTimeDecimal}, End: ${show.endTimeDecimal}`);
    });
    
    if (shows.length > 10) {
      console.log(`... and ${shows.length - 10} more shows`);
    }
  });
  
  // Check specifically for Sunday 2025-10-12
  const sundayData = dateGroups['2025-10-12'];
  if (sundayData) {
    console.log(`\n=== SUNDAY 2025-10-12 DETAILS ===`);
    console.log(`Found ${sundayData.length} shows for Sunday`);
    sundayData.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.season} ${show.episode}) - ${show.timezone} - ${show.startTimeDecimal} to ${show.endTimeDecimal}`);
    });
  } else {
    console.log(`\n=== NO SUNDAY DATA FOUND ===`);
    console.log('Sunday 2025-10-12 has no shows in the Excel file');
  }
  
  // Show Excel serial date range
  const allDateSerials = Object.values(dateGroups).flat().map(show => show.dateSerial);
  const minDate = Math.min(...allDateSerials);
  const maxDate = Math.max(...allDateSerials);
  
  console.log(`\n=== DATE RANGE ===`);
  console.log(`Excel serial dates: ${minDate} to ${maxDate}`);
  console.log(`Date range: ${new Date((minDate - 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} to ${new Date((maxDate - 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
}

// Run the examination
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx';
examineExcelDetailed(filePath);


