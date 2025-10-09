const XLSX = require('xlsx');

// Analyze the Excel data to understand the structure better
function analyzeExcelData() {
  const filePath = '/Users/danieleloma/Downloads/Copy of Zee World OCTOBER 25 FPC SA.xlsx';
  
  console.log('=== ANALYZING EXCEL DATA ===');
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`Total rows: ${jsonData.length}`);
    
    // Find the header row
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row.length > 0 && row[0] === 'Region') {
        headerRowIndex = i;
        break;
      }
    }
    
    if (headerRowIndex === -1) {
      console.log('❌ No header row found');
      return;
    }
    
    console.log(`Header row at index: ${headerRowIndex}`);
    
    // Analyze all data rows
    const regionCounts = {};
    const dateCounts = {};
    const sampleRows = [];
    
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0 && row[0]) {
        const region = row[0];
        const date = row[1];
        const title = row[4];
        
        if (region) {
          regionCounts[region] = (regionCounts[region] || 0) + 1;
        }
        
        if (date) {
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        }
        
        if (sampleRows.length < 10) {
          sampleRows.push({
            row: i,
            region: region,
            date: date,
            title: title,
            fullRow: row
          });
        }
      }
    }
    
    console.log('\n=== REGION COUNTS ===');
    Object.entries(regionCounts).forEach(([region, count]) => {
      console.log(`${region}: ${count} rows`);
    });
    
    console.log('\n=== DATE COUNTS ===');
    Object.entries(dateCounts).forEach(([date, count]) => {
      console.log(`${date}: ${count} rows`);
    });
    
    console.log('\n=== SAMPLE ROWS ===');
    sampleRows.forEach(sample => {
      console.log(`Row ${sample.row}: Region=${sample.region}, Date=${sample.date}, Title=${sample.title}`);
    });
    
    // Check if this is actually a SA file or if it contains ROA data
    console.log('\n=== FILE ANALYSIS ===');
    if (regionCounts['SA'] > 0) {
      console.log(`✅ Found ${regionCounts['SA']} SA rows`);
    } else {
      console.log('❌ No SA rows found');
    }
    
    if (regionCounts['ROA'] > 0) {
      console.log(`⚠️  Found ${regionCounts['ROA']} ROA rows (this might be a ROA file)`);
    }
    
  } catch (error) {
    console.error('Error analyzing Excel file:', error.message);
  }
}

analyzeExcelData();
