const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('/Users/danieleloma/Downloads/Channel TV Guide/Zee World NOVEMBER 25 FPC ROA (24 -30 Nov) Edited.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('=== EXCEL FILE STRUCTURE ===');
console.log('Sheet name:', sheetName);
console.log('Total rows:', jsonData.length);
console.log('\nFirst 10 rows:');
jsonData.slice(0, 10).forEach((row, i) => {
  console.log(`Row ${i}:`, row);
});


