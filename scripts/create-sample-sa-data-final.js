/**
 * Create sample SA data matching the ROA structure
 */

const fs = require('fs');

function createSampleSAData() {
  console.log(`\n🔧 Creating sample SA data to match ROA structure`);
  
  // Sample shows for SA
  const showTemplates = [
    { title: "Morning Show SA", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Afternoon Drama SA", season: "S2", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Evening News SA", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Late Night SA", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Weekend Special SA", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] }
  ];

  // Use the same dates as ROA for consistency
  const dates = [
    "2025-09-28", // Sunday
    "2025-09-29", // Monday  
    "2025-09-30", // Tuesday
    "2025-10-01", // Wednesday
    "2025-10-02", // Thursday
    "2025-10-03", // Friday
    "2025-10-04"  // Saturday
  ];

  // Generate SA time slots (6:00 AM - 5:30 AM next day)
  function generateSASlots(dateISO, dayIndex) {
    const slots = [];
    
    // Morning shows (6:00 AM - 12:00 PM)
    for (let i = 0; i < 5; i++) {
      const hour = 6 + i;
      const show = showTemplates[i % showTemplates.length];
      const episode = show.episodes[dayIndex];
      
      slots.push({
        startISO: `${dateISO}T${hour.toString().padStart(2, '0')}:00:00`,
        endISO: `${dateISO}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        title: show.title,
        season: show.season,
        episode: episode,
        subtitle: "",
        textColor: "#FFFFFF",
        bgColor: "#1A1A1A",
        durationMin: 60
      });
    }
    
    // Afternoon shows (12:00 PM - 6:00 PM)
    for (let i = 0; i < 5; i++) {
      const hour = 12 + i;
      const show = showTemplates[i % showTemplates.length];
      const episode = show.episodes[dayIndex];
      
      slots.push({
        startISO: `${dateISO}T${hour.toString().padStart(2, '0')}:00:00`,
        endISO: `${dateISO}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        title: show.title,
        season: show.season,
        episode: episode,
        subtitle: "",
        textColor: "#FFFFFF",
        bgColor: "#1A1A1A",
        durationMin: 60
      });
    }
    
    // Evening shows (6:00 PM - 12:00 AM)
    for (let i = 0; i < 5; i++) {
      const hour = 18 + i;
      const show = showTemplates[i % showTemplates.length];
      const episode = show.episodes[dayIndex];
      
      slots.push({
        startISO: `${dateISO}T${hour.toString().padStart(2, '0')}:00:00`,
        endISO: `${dateISO}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        title: show.title,
        season: show.season,
        episode: episode,
        subtitle: "",
        textColor: "#FFFFFF",
        bgColor: "#1A1A1A",
        durationMin: 60
      });
    }
    
    // Late night shows (12:00 AM - 5:30 AM next day)
    const nextDate = new Date(dateISO);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateISO = nextDate.toISOString().split('T')[0];
    
    for (let i = 0; i < 5; i++) {
      const hour = i;
      const show = showTemplates[i % showTemplates.length];
      const episode = show.episodes[dayIndex];
      
      if (i === 4) {
        // Last slot ends at 5:30 AM
        slots.push({
          startISO: `${nextDateISO}T05:00:00`,
          endISO: `${nextDateISO}T05:30:00`,
          title: show.title,
          season: show.season,
          episode: episode,
          subtitle: "",
          textColor: "#FFFFFF",
          bgColor: "#1A1A1A",
          durationMin: 30
        });
      } else {
        slots.push({
          startISO: `${nextDateISO}T${hour.toString().padStart(2, '0')}:00:00`,
          endISO: `${nextDateISO}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
          title: show.title,
          season: show.season,
          episode: episode,
          subtitle: "",
          textColor: "#FFFFFF",
          bgColor: "#1A1A1A",
          durationMin: 60
        });
      }
    }
    
    return slots;
  }

  // Create SA data structure
  const saData = {
    "metadata": {
      "channelId": "zee-world-sa",
      "generatedAt": new Date().toISOString(),
      "defaultRegion": "SA",
      "defaultTimezone": "CAT"
    },
    "regions": [
      {
        "code": "SA",
        "label": "South Africa",
        "timezones": ["CAT"],
        "days": []
      }
    ]
  };

  // Generate days for each date
  dates.forEach((dateISO, dayIndex) => {
    saData.regions[0].days.push({
      dateISO: dateISO,
      timezone: "CAT",
      slots: generateSASlots(dateISO, dayIndex)
    });
  });

  // Save to file
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/sa-guide-sample-final.json';
  fs.writeFileSync(outputPath, JSON.stringify(saData, null, 2));

  console.log(`\n✅ Sample SA data saved to: ${outputPath}`);
  console.log(`📊 Structure: ${saData.regions[0].days.length} days`);
  
  // Calculate total slots
  const totalSlots = saData.regions[0].days.reduce((sum, day) => sum + day.slots.length, 0);
  console.log(`📊 Total slots: ${totalSlots}`);
  
  // Show sample slots for first day
  const firstDay = saData.regions[0].days[0];
  console.log(`\n📺 Sample slots for ${firstDay.dateISO} (${firstDay.timezone}):`);
  firstDay.slots.slice(0, 5).forEach((slot, index) => {
    console.log(`  ${index + 1}. ${slot.title} (${slot.season} ${slot.episode}) - ${slot.startISO} to ${slot.endISO}`);
  });

  return saData;
}

// Run the creation
createSampleSAData();


