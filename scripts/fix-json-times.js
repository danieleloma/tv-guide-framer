const fs = require('fs');

// Read the generated JSON file
const jsonPath = './public/roa-guide-final-fix.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('🔧 Fixing time format in JSON...');

// Fix the time format for each slot
data.regions[0].days.forEach((day, dayIndex) => {
  console.log(`📅 Fixing day ${dayIndex + 1}: ${day.dateISO}`);
  
  day.slots.forEach((slot, slotIndex) => {
    // Parse the current ISO string
    const startDate = new Date(slot.startISO);
    const endDate = new Date(slot.endISO);
    
    // Get the timezone from the original string
    const timezoneMatch = slot.startISO.match(/([+-]\d{2}:\d{2})$/);
    const timezone = timezoneMatch ? timezoneMatch[1] : '+00:00';
    
    // Create new ISO strings with correct time
    const dateISO = day.dateISO;
    const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Fix the ISO strings
    slot.startISO = `${dateISO}T${startTime}:00${timezone}`;
    slot.endISO = `${dateISO}T${endTime}:00${timezone}`;
    
    if (slotIndex < 3) {
      console.log(`  📺 ${slot.title}: ${slot.startISO} to ${slot.endISO}`);
    }
  });
});

// Write the fixed JSON
const outputPath = './public/roa-guide-fixed-final.json';
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✅ Fixed JSON saved to: ${outputPath}`);

// Show sample of first few slots
console.log('\n🔍 Sample of fixed slots:');
data.regions[0].days[0].slots.slice(0, 5).forEach((slot, index) => {
  console.log(`  ${index + 1}. ${slot.title} - ${slot.startISO} to ${slot.endISO}`);
});


