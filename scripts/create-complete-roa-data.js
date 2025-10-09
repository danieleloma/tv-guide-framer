/**
 * Create complete ROA data with proper show distribution across all days
 * Fixes all positioning and width issues
 */

const fs = require('fs');

function createCompleteROAData() {
  console.log(`\n🔧 Creating complete ROA data with proper show distribution`);
  
  // Sample shows for all days
  const showTemplates = [
    { title: "Sister Wives", season: "S1", episodes: ["Ep 149", "Ep 150", "Ep 151", "Ep 152", "Ep 153", "Ep 154", "Ep 155"] },
    { title: "Radhe Mohan", season: "S4", episodes: ["EP 7", "EP 8", "EP 9", "EP 10", "EP 11", "EP 12", "EP 13"] },
    { title: "Twist of Fate: New Era", season: "S10", episodes: ["EP 34", "EP 35", "EP 36", "EP 37", "EP 38", "EP 39", "EP 40"] },
    { title: "Hearts Crossed", season: "S1", episodes: ["Ep 16", "Ep 17", "Ep 18", "Ep 19", "Ep 20", "Ep 21", "Ep 22"] },
    { title: "This Is Fate", season: "S7", episodes: ["Ep 97", "Ep 98", "Ep 99", "Ep 100", "Ep 101", "Ep 102", "Ep 103"] },
    { title: "Kel...", season: "S3", episodes: ["E 1", "E 2", "E 3", "E 4", "E 5", "E 6", "E 7"] },
    { title: "Morning Show", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Afternoon Drama", season: "S2", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Evening News", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] },
    { title: "Late Night Show", season: "S1", episodes: ["Ep 1", "Ep 2", "Ep 3", "Ep 4", "Ep 5", "Ep 6", "Ep 7"] }
  ];

  const dates = [
    "2025-10-06", // Monday
    "2025-10-07", // Tuesday
    "2025-10-08", // Wednesday
    "2025-10-09", // Thursday
    "2025-10-10", // Friday
    "2025-10-11", // Saturday
    "2025-10-12"  // Sunday
  ];

  // Generate WAT time slots (5:00 AM - 4:00 AM next day)
  function generateWATSlots(dateISO, dayIndex) {
    const slots = [];
    
    // Morning shows (5:00 AM - 12:00 PM)
    for (let i = 0; i < 5; i++) {
      const hour = 5 + i;
      const show = showTemplates[i];
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
    for (let i = 5; i < 8; i++) {
      const hour = 12 + (i - 5);
      const show = showTemplates[i];
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
    for (let i = 8; i < 10; i++) {
      const hour = 18 + (i - 8);
      const show = showTemplates[i];
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
    
    // Late night shows (12:00 AM - 4:00 AM next day)
    const nextDate = new Date(dateISO);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateISO = nextDate.toISOString().split('T')[0];
    
    for (let i = 0; i < 4; i++) {
      const hour = i;
      const show = showTemplates[i];
      const episode = show.episodes[dayIndex];
      
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
    
    return slots;
  }

  // Generate CAT time slots (6:00 AM - 5:00 AM next day)
  function generateCATSlots(dateISO, dayIndex) {
    const slots = [];
    
    // Morning shows (6:00 AM - 12:00 PM)
    for (let i = 0; i < 5; i++) {
      const hour = 6 + i;
      const show = showTemplates[i];
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
    for (let i = 5; i < 8; i++) {
      const hour = 12 + (i - 5);
      const show = showTemplates[i];
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
    for (let i = 8; i < 10; i++) {
      const hour = 18 + (i - 8);
      const show = showTemplates[i];
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
    
    // Late night shows (12:00 AM - 5:00 AM next day)
    const nextDate = new Date(dateISO);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateISO = nextDate.toISOString().split('T')[0];
    
    for (let i = 0; i < 5; i++) {
      const hour = i;
      const show = showTemplates[i];
      const episode = show.episodes[dayIndex];
      
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
    
    return slots;
  }

  // Create complete data structure
  const roaData = {
    "metadata": {
      "channelId": "zee-world-roa",
      "generatedAt": new Date().toISOString(),
      "defaultRegion": "ROA",
      "defaultTimezone": "WAT"
    },
    "regions": [
      {
        "code": "ROA",
        "label": "Rest of Africa",
        "timezones": ["WAT", "CAT"],
        "days": []
      }
    ]
  };

  // Generate days for each date and timezone
  dates.forEach((dateISO, dayIndex) => {
    // WAT day
    roaData.regions[0].days.push({
      dateISO: dateISO,
      timezone: "WAT",
      slots: generateWATSlots(dateISO, dayIndex)
    });

    // CAT day
    roaData.regions[0].days.push({
      dateISO: dateISO,
      timezone: "CAT",
      slots: generateCATSlots(dateISO, dayIndex)
    });
  });

  // Save to file
  const outputPath = '/Users/danieleloma/tv-guide-framer/public/roa-guide-complete.json';
  fs.writeFileSync(outputPath, JSON.stringify(roaData, null, 2));

  console.log(`\n✅ Complete ROA data saved to: ${outputPath}`);
  console.log(`📊 Structure: ${roaData.regions[0].days.length} day-timezone combinations`);
  console.log(`📊 WAT days: ${roaData.regions[0].days.filter(d => d.timezone === 'WAT').length}`);
  console.log(`📊 CAT days: ${roaData.regions[0].days.filter(d => d.timezone === 'CAT').length}`);
  
  // Calculate total slots
  const totalSlots = roaData.regions[0].days.reduce((sum, day) => sum + day.slots.length, 0);
  console.log(`📊 Total slots: ${totalSlots}`);
  
  // Show sample slots for first day
  const firstDay = roaData.regions[0].days[0];
  console.log(`\n📺 Sample slots for ${firstDay.dateISO} (${firstDay.timezone}):`);
  firstDay.slots.slice(0, 5).forEach((slot, index) => {
    console.log(`  ${index + 1}. ${slot.title} (${slot.season} ${slot.episode}) - ${slot.startISO} to ${slot.endISO}`);
  });

  return roaData;
}

// Run the creation
createCompleteROAData();


