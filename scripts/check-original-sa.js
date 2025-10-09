const XLSX = require('xlsx');

// Check the original SA Excel file
function checkOriginalSA() {
  const filePath = '/Users/danieleloma/Downloads/Zee World OCTOBER 25 FPC SA.xlsx';
  
  console.log('=== CHECKING ORIGINAL SA EXCEL FILE ===');
  console.log(`File: ${filePath}`);
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`\nSheet name: ${sheetName}`);
    console.log(`Total rows: ${jsonData.length}`);
    
    // Check first 10 rows
    console.log('\nFirst 10 rows:');
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        console.log(`Row ${i}: [${row.map(cell => {
          if (cell === null || cell === undefined) return 'null';
          if (typeof cell === 'string') return `"${cell}"`;
          return cell;
        }).join(', ')}]`);
      }
    }
    
    // Count rows with data
    let dataRowCount = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        const nonEmptyCells = row.filter(cell => cell !== null && cell !== undefined && cell !== '');
        if (nonEmptyCells.length >= 3) {
          dataRowCount++;
        }
      }
    }
    
    console.log(`\nTotal rows with data: ${dataRowCount}`);
    
  } catch (error) {
    console.error('Error reading original SA file:', error.message);
  }
}

checkOriginalSA();
