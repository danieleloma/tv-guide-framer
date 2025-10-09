const fs = require('fs');
const path = require('path');

// Create a clean, copyable version of the SA JSON data
function createSACopy() {
  const inputPath = path.join(__dirname, '../public/sa-guide-complete.json');
  const outputPath = path.join(__dirname, '../public/sa-guide-copy-ready.json');
  
  try {
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Clean up the data and ensure proper structure
    const cleanedData = {
      metadata: {
        channelId: "zee-world-sa",
        generatedAt: new Date().toISOString(),
        defaultRegion: "SA",
        defaultTimezone: "CAT"
      },
      regions: [
        {
          code: "SA",
          label: "South Africa",
          timezones: ["CAT"],
          days: data.regions[0].days.map(day => ({
            dateISO: day.dateISO,
            slots: day.slots
              .filter(slot => slot.startISO && slot.endISO && slot.title)
              .map(slot => ({
                startISO: slot.startISO,
                endISO: slot.endISO,
                title: slot.title,
                durationMin: slot.durationMin || 30
              }))
          }))
        }
      ]
    };
    
    // Write the cleaned data
    fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));
    
    console.log('✅ Clean SA JSON created!');
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`📊 Total days: ${cleanedData.regions[0].days.length}`);
    console.log(`📺 Total slots: ${cleanedData.regions[0].days.reduce((sum, day) => sum + day.slots.length, 0)}`);
    
    // Show sample data
    if (cleanedData.regions[0].days.length > 0) {
      const firstDay = cleanedData.regions[0].days[0];
      console.log(`\n📋 Sample data for ${firstDay.dateISO}:`);
      firstDay.slots.slice(0, 5).forEach(slot => {
        const startTime = slot.startISO.split('T')[1].substring(0, 5);
        const endTime = slot.endISO.split('T')[1].substring(0, 5);
        console.log(`  ${startTime}-${endTime}: ${slot.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating SA copy:', error.message);
  }
}

createSACopy();
