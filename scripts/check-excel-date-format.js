/**
 * Check Excel date format - investigate why dates are being read as serial numbers
 */

const XLSX = require('xlsx');

function checkExcelDateFormat(filePath) {
  console.log(`\n🔍 Checking Excel date format: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Read with different options to see how dates are interpreted
  console.log(`\n=== READING WITH DEFAULT OPTIONS ===`);
  const defaultData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  console.log(`First data row date: ${defaultData[1][1]} (type: ${typeof defaultData[1][1]})`);
  
  console.log(`\n=== READING WITH DATE STRING OPTIONS ===`);
  const stringData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1, 
    defval: null,
    dateNF: 'yyyy-mm-dd'
  });
  console.log(`First data row date: ${stringData[1][1]} (type: ${typeof stringData[1][1]})`);
  
  console.log(`\n=== READING WITH RAW CELL VALUES ===`);
  // Check the raw cell value
  const cellAddress = XLSX.utils.encode_cell({ r: 1, c: 1 }); // Row 2, Column B (Date column)
  const cell = worksheet[cellAddress];
  if (cell) {
    console.log(`Raw cell value: ${cell.v}`);
    console.log(`Raw cell type: ${cell.t}`);
    console.log(`Raw cell format: ${cell.z || 'none'}`);
  }
  
  // Try to read as CSV to see if that preserves date format
  console.log(`\n=== TRYING CSV CONVERSION ===`);
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  const csvLines = csvData.split('\n');
  console.log(`CSV header: ${csvLines[0]}`);
  console.log(`CSV first data row: ${csvLines[1]}`);
  
  // Check multiple date cells
  console.log(`\n=== CHECKING MULTIPLE DATE CELLS ===`);
  for (let row = 1; row < Math.min(10, defaultData.length); row++) {
    const dateValue = defaultData[row][1];
    if (dateValue) {
      console.log(`Row ${row + 1} date: ${dateValue} (type: ${typeof dateValue})`);
      
      if (typeof dateValue === 'number') {
        // Convert Excel serial date to actual date
        const excelEpoch = new Date(1900, 0, 1);
        const actualDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
        const dateISO = actualDate.toISOString().split('T')[0];
        console.log(`  Converted to: ${dateISO}`);
      }
    }
  }
  
  // Try to force date reading
  console.log(`\n=== TRYING TO FORCE DATE READING ===`);
  const workbook2 = XLSX.readFile(filePath, { cellDates: true });
  const worksheet2 = workbook2.Sheets[sheetName];
  const dateData = XLSX.utils.sheet_to_json(worksheet2, { header: 1, defval: null });
  console.log(`First data row date with cellDates: ${dateData[1][1]} (type: ${typeof dateData[1][1]})`);
  
  return {
    defaultFormat: defaultData[1][1],
    stringFormat: stringData[1][1],
    cellDatesFormat: dateData[1][1]
  };
}

// Run the check
const filePath = '/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025.xlsx';
checkExcelDateFormat(filePath);


