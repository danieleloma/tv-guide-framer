const XLSX = require('xlsx');
const path = require('path');

// Check the structure of the new SA Excel file
function checkExcelStructure() {
  const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC SA.xlsx';
  
  console.log('=== CHECKING NEW SA EXCEL FILE STRUCTURE ===');
  console.log(`File: ${filePath}`);
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`\nSheet name: ${sheetName}`);
    console.log(`Total rows: ${jsonData.length}`);
    
    // Check first few rows to understand structure
    console.log('\nFirst 10 rows:');
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      console.log(`Row ${i}: [${row.map(cell => typeof cell === 'string' ? `"${cell}"` : cell).join(', ')}]`);
    }
    
    // Check if it follows the new structure (row-based format)
    console.log('\n=== CHECKING FOR NEW STRUCTURE ===');
    const firstRow = jsonData[0];
    if (firstRow && firstRow.length > 0) {
      console.log('First row headers:', firstRow);
      
      // Check if it has the expected column headers
      const expectedHeaders = ['Region', 'Date', 'Start Time', 'End Time', 'Title', 'Season', 'Episode', 'Subtitle', 'Text Color', 'BG Color'];
      const hasExpectedHeaders = expectedHeaders.some(header => 
        firstRow.some(cell => cell && cell.toString().toLowerCase().includes(header.toLowerCase()))
      );
      
      console.log('Has expected headers:', hasExpectedHeaders);
      
      if (hasExpectedHeaders) {
        console.log('✅ File appears to follow the new row-based structure!');
      } else {
        console.log('⚠️  File may still be in the old grid format');
      }
    }
    
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
  }
}

checkExcelStructure();
