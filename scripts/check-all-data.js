const XLSX = require('xlsx');

// Check all data in the Excel file to understand the structure
function checkAllData() {
  const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC SA.xlsx';
  
  console.log('=== CHECKING ALL DATA IN EXCEL FILE ===');
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`Total rows: ${jsonData.length}`);
    
    // Check first 20 rows to see the structure
    console.log('\n=== FIRST 20 ROWS ===');
    for (let i = 0; i < Math.min(20, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        console.log(`Row ${i}: [${row.map(cell => {
          if (cell === null || cell === undefined) return 'null';
          if (typeof cell === 'string') return `"${cell}"`;
          return cell;
        }).join(', ')}]`);
      }
    }
    
    // Look for rows with actual data (non-empty cells)
    console.log('\n=== ROWS WITH DATA ===');
    let dataRowCount = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        const nonEmptyCells = row.filter(cell => cell !== null && cell !== undefined && cell !== '');
        if (nonEmptyCells.length >= 3) { // At least 3 non-empty cells
          dataRowCount++;
          if (dataRowCount <= 10) {
            console.log(`Row ${i}: [${row.map(cell => {
              if (cell === null || cell === undefined) return 'null';
              if (typeof cell === 'string') return `"${cell}"`;
              return cell;
            }).join(', ')}]`);
          }
        }
      }
    }
    
    console.log(`\nTotal rows with data: ${dataRowCount}`);
    
    // Check if there are any rows that look like show data
    console.log('\n=== POTENTIAL SHOW DATA ROWS ===');
    let showRowCount = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        // Check if row has a title (4th column) and time data
        const title = row[4];
        const startTime = row[2];
        const endTime = row[3];
        
        if (title && typeof title === 'string' && title.trim() !== '' && 
            (typeof startTime === 'number' || typeof endTime === 'number')) {
          showRowCount++;
          if (showRowCount <= 10) {
            console.log(`Row ${i}: Title="${title}", Start=${startTime}, End=${endTime}`);
          }
        }
      }
    }
    
    console.log(`\nTotal potential show data rows: ${showRowCount}`);
    
  } catch (error) {
    console.error('Error checking Excel file:', error.message);
  }
}

checkAllData();
