# TV Guide Enhanced Framer Component

## 🎯 **Advanced TV Guide Component with Google Fonts & Theming**

This is the **production-ready** version of the TV Guide component with comprehensive styling controls, Google Fonts integration, and smart region/timezone toggles.

---

## 📁 **Files Overview**

### **Main Component**
- **`TVGuideFinal.tsx`** - The enhanced component with all features
- **`TVGuideEnhanced.tsx`** - Alternative version with nested theme object
- **`TVGuideSimple.tsx`** - Basic version for simple use cases

### **Sample Data**
- **`public/tv-guide.json`** - Your converted ROA data (307 shows)
- **`public/sa-guide-sample.json`** - Sample SA data for testing

---

## 🚀 **Quick Start**

### **1. Copy the Component**
Copy the entire code from `TVGuideFinal.tsx` into your Framer component.

### **2. Set Up Data**
In the Framer component panel, you'll see grouped controls:

```
📊 Data
├── Data Source: static
├── SA JSON Data: [Text Area] ← Paste SA data here
└── ROA JSON Data: [Text Area] ← Paste ROA data here

🎛️ Toggles  
├── Region: ROA
└── Timezone: WAT

📐 Layout
├── Cell Width: 120
├── Cell Height: 56
├── Border Radius: 4
├── Row Gap: 8
└── Column Gap: 2

🎨 Typography (Google Fonts)
├── Font Family: Inter ← Choose from 10 Google Fonts
├── Font Size: 14
└── Font Weight: 400

🎨 Colors
├── Text Color: #ffffff
├── Page Background: #000000
├── Grid Background: #111111
├── Day Header Background: #111111
├── Day Header Text: #ffffff
├── Time Header Background: #1a1a1a
├── Time Header Text: #ffffff
├── Card Background: #1a1a1a
├── Card Text: #ffffff
├── Card Border: #333333
├── Card Hover Background: #2a2a2a
├── Card Hover Text: #ffffff
├── Card Focus Ring: #6b46c1
└── Divider Color: #333333
```

### **3. Paste Your Data**
- **ROA JSON Data**: Copy from `/public/tv-guide.json`
- **SA JSON Data**: Copy from `/public/sa-guide-sample.json` (or your own SA data)

---

## ✨ **Key Features**

### **🎨 Google Fonts Integration**
- **10 Popular Fonts**: Inter, Roboto, DM Sans, Poppins, Lato, Space Grotesk, Open Sans, Nunito Sans, Work Sans, Montserrat
- **Dynamic Loading**: Fonts load via Google Fonts CDN
- **Live Preview**: Font changes apply immediately in Framer

### **🎛️ Smart Toggles**
- **SA Hidden by Default**: SA region only appears when SA JSON data is provided
- **Tooltips**: Hover over disabled options to see why they're unavailable
- **Auto-Selection**: Automatically selects available regions/timezones

### **🎨 Comprehensive Theming**
- **Live Color Updates**: All colors update instantly in Framer
- **CSS Variables**: Uses CSS custom properties for optimal performance
- **Accessibility**: Focus rings, hover states, and keyboard navigation

### **📱 Responsive Design**
- **Sticky Headers**: Day column and time header stay visible while scrolling
- **Horizontal Scroll**: Smooth scrolling across time slots
- **Consistent Layout**: Perfect alignment with 30-minute slots

---

## 🎯 **Google Fonts Usage**

### **Available Fonts**
```typescript
type FontFamily = 
  | "Inter"        // Modern, clean
  | "Roboto"       // Google's signature font
  | "DMSans"       // Geometric, friendly
  | "Poppins"      // Rounded, approachable
  | "Lato"         // Humanist, versatile
  | "SpaceGrotesk" // Futuristic, tech
  | "OpenSans"     // Web-optimized
  | "NunitoSans"   // Rounded, playful
  | "WorkSans"     // Professional
  | "Montserrat"   // Elegant, display
```

### **Font Loading**
Fonts are loaded via Google Fonts CDN:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

---

## 🎨 **Theming System**

### **Color Palette**
The component supports a complete color system:

```typescript
interface ColorPalette {
  // Text & Backgrounds
  textColor: string;        // Primary text color
  pageBg: string;          // Main background
  gridBg: string;          // Grid background
  
  // Headers
  dayHeaderBg: string;     // Day column background
  dayHeaderText: string;   // Day column text
  timeHeaderBg: string;    // Time row background
  timeHeaderText: string;  // Time row text
  
  // Show Cards
  cardBg: string;          // Card background
  cardText: string;        // Card text
  cardBorder: string;      // Card border
  cardHoverBg: string;     // Hover background
  cardHoverText: string;   // Hover text
  cardFocusRing: string;   // Focus ring (accessibility)
  
  // UI Elements
  dividerColor: string;    // Grid lines, borders
}
```

### **Layout Controls**
```typescript
interface LayoutControls {
  cellWidth: number;       // Width of time slots (60-300px)
  cellHeight: number;      // Height of day rows (40-120px)
  radius: number;          // Border radius (0-20px)
  rowGap: number;          // Gap between rows (0-20px)
  colGap: number;          // Gap between columns (0-10px)
}
```

---

## 🔄 **Smart Toggle Logic**

### **Region Visibility**
```typescript
// SA region only appears when SA JSON data exists
const availableRegions = useMemo(() => {
  const regions: Region[] = [];
  if (saData) regions.push('SA');    // Only if data exists
  if (roaData) regions.push('ROA');  // Only if data exists
  return regions;
}, [saData, roaData]);
```

### **Timezone Availability**
```typescript
// Only show timezones that have data for current region
const availableTimezones = useMemo(() => {
  if (!currentData) return [];
  const regionData = currentData.regions[props.region];
  return Object.entries(regionData.timezones)
    .filter(([_, tzData]) => tzData !== null)  // Filter out null timezones
    .map(([tz, _]) => tz as Tz);
}, [currentData, props.region]);
```

### **Disabled State Handling**
```typescript
// Show tooltip for unavailable options
<button
  disabled={!isAvailable}
  title={!isAvailable ? `${region} data not available` : `Switch to ${region}`}
  style={{
    opacity: isAvailable ? 1 : 0.5,
    cursor: isAvailable ? 'pointer' : 'not-allowed'
  }}
>
```

---

## 🧪 **Testing Scenarios**

### **✅ Google Font Application**
1. Change `Font Family` from "Inter" to "Poppins"
2. Verify font changes across entire component instantly
3. Check that font weights respect the chosen family's range

### **✅ Color & Layout Live Updates**
1. Change `Page Background` from black to dark blue
2. Adjust `Border Radius` from 4 to 12
3. Verify all changes apply immediately without refresh

### **✅ Toggle Logic**
1. Start with only ROA data → SA button should be hidden
2. Add SA JSON data → SA button should appear
3. Switch regions → timezone options should update
4. Hover over disabled options → tooltips should appear

### **✅ Accessibility**
1. Tab through show cards → focus rings should appear
2. Focus ring color should match `Card Focus Ring` setting
3. All interactive elements should be keyboard accessible

---

## 📊 **Data Structure**

### **ROA Data (Your Excel Conversion)**
```json
{
  "window": {
    "WAT": { "start": "05:00", "end": "04:00" },
    "CAT": { "start": "06:00", "end": "05:00" },
    "slotMinutes": 30
  },
  "regions": {
    "ROA": {
      "region": "ROA",
      "timezones": {
        "WAT": { /* 169 shows */ },
        "CAT": { /* 138 shows */ }
      }
    }
  }
}
```

### **SA Data (Sample)**
```json
{
  "regions": {
    "SA": {
      "region": "SA", 
      "timezones": {
        "WAT": null,           // SA doesn't use WAT
        "CAT": { /* shows */ } // SA only uses CAT
      }
    }
  }
}
```

---

## 🚀 **Performance Optimizations**

### **Memoized Calculations**
```typescript
// Expensive calculations are memoized
const timeTicks = useMemo(() => generateTimeTicks(props.timezone), [props.timezone]);
const dayGrid = useMemo(() => buildDayGrid(data, region, timezone), [data, region, timezone]);
```

### **CSS Variables**
```typescript
// Theme values applied via CSS custom properties
const styleVars: React.CSSProperties = {
  ["--tv-radius" as any]: `${props.radius}px`,
  ["--tv-font-size" as any]: `${props.fontSize}px`,
  ["--tv-card-bg" as any]: props.cardBg,
  // ... more variables
};
```

### **Font Loading**
- Only the selected Google Font is loaded
- Fonts load asynchronously without blocking render
- Fallback fonts ensure text is always visible

---

## 🎯 **Best Practices**

### **Data Management**
1. **Keep JSON files small** - Use sample data for testing
2. **Validate JSON** - Component shows errors for invalid data
3. **Region-specific data** - SA and ROA can have different timezone support

### **Styling**
1. **Start with defaults** - All controls have sensible defaults
2. **Test color combinations** - Ensure sufficient contrast
3. **Use consistent spacing** - Row/column gaps should be proportional

### **Accessibility**
1. **Test keyboard navigation** - Tab through all interactive elements
2. **Verify focus rings** - Should be visible and properly colored
3. **Check color contrast** - Text should be readable on backgrounds

---

## 🔧 **Troubleshooting**

### **Fonts Not Loading**
- Check internet connection (Google Fonts requires internet)
- Verify font name is spelled correctly
- Try a different font to isolate the issue

### **Colors Not Updating**
- Ensure you're using the `TVGuideFinal` component
- Check that color values are valid hex codes
- Refresh the Framer preview

### **Toggles Not Working**
- Verify JSON data is valid (check console for errors)
- Ensure region/timezone combinations are supported
- Check that data structure matches expected format

### **Performance Issues**
- Reduce JSON data size for testing
- Lower cell count (smaller cellWidth/cellHeight)
- Use simpler fonts (Inter, Roboto) for better performance

---

## 📈 **Next Steps**

1. **Custom Themes**: Create preset color combinations
2. **Animation**: Add smooth transitions between regions
3. **Export**: Generate static images of the TV guide
4. **Print**: Add print-friendly styling options
5. **Mobile**: Optimize for mobile viewing

---

**🎉 Your enhanced TV Guide component is ready for production use!**

