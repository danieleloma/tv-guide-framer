const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC SA.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('=== EXCEL FILE STRUCTURE ===');
console.log('Sheet name:', sheetName);
console.log('Total rows:', jsonData.length);
console.log('Headers:', jsonData[0]);
console.log('\nFirst few data rows:');
jsonData.slice(1, 5).forEach((row, i) => {
  console.log(`Row ${i+1}:`, row);
});
