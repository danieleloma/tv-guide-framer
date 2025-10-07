# 🎨 Framer Setup Guide for TV Guide Component

## 📋 **Step-by-Step Framer Integration**

### **Step 1: Copy Files to Your Framer Project**

1. **Open your Framer project** in Framer Desktop
2. **Navigate to your project folder** (usually in `~/Documents/Framer/YourProjectName/`)
3. **Copy these files** from the TV Guide repository:

```
From: /Users/danieleloma/tv-guide-framer/components/
To: YourFramerProject/components/

Copy these files:
- TVGuide.tsx
- types.ts  
- time.ts
```

### **Step 2: Add Dependencies to Framer**

1. **In your Framer project folder**, open `package.json`
2. **Add these dependencies** to the `dependencies` section:

```json
{
  "dependencies": {
    "luxon": "^3.4.4",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/luxon": "^3.4.0",
    "@types/react": "^18.2.0"
  }
}
```

3. **Run in terminal** (in your Framer project directory):
   ```bash
   npm install
   ```

### **Step 3: Create Data File**

1. **Copy the sample JSON** to your Framer project:
   ```bash
   cp /Users/danieleloma/tv-guide-framer/public/guide.example.json YourFramerProject/public/guide.json
   ```

2. **Or create your own data** using the conversion script:
   ```bash
   cd /Users/danieleloma/tv-guide-framer
   npx ts-node scripts/excel-to-guide.ts --in ./sample-data.csv --out YourFramerProject/public/guide.json --channelId "your-channel" --defaultRegion "ROA"
   ```

### **Step 4: Use in Framer**

1. **In Framer Desktop**, create a new **Code Component**
2. **Replace the default code** with:

```tsx
import React from 'react';
import TVGuide from './components/TVGuide';

export default function TVGuideComponent() {
  return (
    <TVGuide
      dataURL="/guide.json"
      hourWidthPx={220}
      startHour={5}
      endHour={24}
      pageBg="#0a0a0a"
      cardBg="#1a1a1a"
      cardText="#ffffff"
      activeRegionBg="#6b46c1"
      focusOutline="#6b46c1"
      enableRegionSwitch={true}
      enableTimezoneSwitch={true}
      initialRegion="ROA"
      initialTimezone="WAT"
    />
  );
}
```

### **Step 5: Configure Framer Controls**

In your Code Component, add these **Framer Controls**:

```tsx
import { addPropertyControls, ControlType } from "framer";

// Add this after your component
addPropertyControls(TVGuideComponent, {
  // Data
  dataURL: {
    type: ControlType.String,
    title: "Data URL",
    defaultValue: "/guide.json"
  },
  
  // Layout
  hourWidthPx: {
    type: ControlType.Number,
    title: "Hour Width (px)",
    defaultValue: 220,
    min: 100,
    max: 500
  },
  
  rowHeightPx: {
    type: ControlType.Number,
    title: "Row Height (px)",
    defaultValue: 64,
    min: 40,
    max: 120
  },
  
  startHour: {
    type: ControlType.Number,
    title: "Start Hour",
    defaultValue: 5,
    min: 0,
    max: 23
  },
  
  endHour: {
    type: ControlType.Number,
    title: "End Hour",
    defaultValue: 24,
    min: 1,
    max: 24
  },
  
  // Colors
  pageBg: {
    type: ControlType.Color,
    title: "Page Background",
    defaultValue: "#0a0a0a"
  },
  
  cardBg: {
    type: ControlType.Color,
    title: "Card Background",
    defaultValue: "#1a1a1a"
  },
  
  cardText: {
    type: ControlType.Color,
    title: "Card Text",
    defaultValue: "#ffffff"
  },
  
  activeRegionBg: {
    type: ControlType.Color,
    title: "Active Region Background",
    defaultValue: "#6b46c1"
  },
  
  // Behavior
  enableRegionSwitch: {
    type: ControlType.Boolean,
    title: "Enable Region Switch",
    defaultValue: true
  },
  
  enableTimezoneSwitch: {
    type: ControlType.Boolean,
    title: "Enable Timezone Switch",
    defaultValue: true
  },
  
  highContrast: {
    type: ControlType.Boolean,
    title: "High Contrast Mode",
    defaultValue: false
  }
});
```

## 🎯 **Usage Examples**

### **Single Region (SA only)**
```tsx
<TVGuide
  dataURL="/guide-sa.json"
  enableRegionSwitch={false}
  enableTimezoneSwitch={false}
  initialRegion="SA"
  pageBg="#000000"
  cardBg="#1a1a1a"
/>
```

### **Multi-Region with Custom Styling**
```tsx
<TVGuide
  dataURL="/guide-multi.json"
  hourWidthPx={240}
  pageBg="#0f0f0f"
  cardBg="#2a2a2a"
  cardText="#e0e0e0"
  activeRegionBg="#ff6b6b"
  focusOutline="#ff6b6b"
  cornerRadiusPx={8}
  titleFontSize={16}
  subtitleFontSize={14}
/>
```

## 🔧 **Data Conversion**

### **Convert Excel/CSV to JSON**
```bash
cd /Users/danieleloma/tv-guide-framer
npx ts-node scripts/excel-to-guide.ts \
  --in ./your-guide.xlsx \
  --out YourFramerProject/public/guide.json \
  --channelId "your-channel" \
  --defaultRegion "ROA"
```

### **Expected CSV/Excel Format**
| Column | Description | Example |
|--------|-------------|---------|
| Region | SA, ROA | SA |
| Date | YYYY-MM-DD | 2025-09-29 |
| Start Time | 24h format | 14:30 |
| End Time | 24h format | 15:00 |
| Title | Show name | Sister Wives |
| Season | S1, S10 | S1 |
| Episode | Ep 145 | Ep 145 |

## 🎨 **Customization Options**

### **All Available Props**
- **Layout:** `hourWidthPx`, `rowHeightPx`, `startHour`, `endHour`
- **Colors:** `pageBg`, `cardBg`, `cardText`, `activeRegionBg`, `focusOutline`
- **Typography:** `fontFamily`, `titleFontSize`, `subtitleFontSize`
- **Behavior:** `enableRegionSwitch`, `enableTimezoneSwitch`, `highContrast`
- **Data:** `dataURL`, `dataJSON`, `channelIdFilter`

## 🚀 **Ready to Use!**

Your TV Guide component is now ready to use in Framer with full customization through the property panel!

## 📞 **Need Help?**

- Check the main README.md for detailed documentation
- Test with the sample data first
- Use the conversion script for your own data
- All components are fully typed with TypeScript
