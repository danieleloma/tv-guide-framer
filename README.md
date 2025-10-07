# 📺 TV Guide Framer Component

A fully customizable, horizontally scrollable TV guide component for Framer with Excel/CSV data ingestion support.

## ✨ Features

- **Multi-region & Timezone Support**: Handle different regions (SA, ROA) with timezone switching (WAT, CAT, EST)
- **Horizontal Scrolling**: Smooth scrolling with virtualized rendering for performance
- **Excel/CSV Integration**: Convert spreadsheet data to normalized JSON format
- **Fully Customizable**: All styling, colors, fonts, and behavior configurable via props
- **Accessibility**: Keyboard navigation, ARIA labels, high contrast mode
- **Cross-midnight Handling**: Automatically splits shows that span midnight
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Convert Excel/CSV Data

```bash
# Convert Excel file to JSON
npx ts-node scripts/excel-to-guide.ts --in ./data/guide.xlsx --out ./public/guide.json --channelId "zee-world" --defaultRegion "ROA"

# Convert CSV file to JSON
npx ts-node scripts/excel-to-guide.ts --in ./data/guide.csv --out ./public/guide.json --channelId "zee-world" --defaultRegion "SA"
```

### 3. Use in Framer

Copy the `TVGuide` component to your Framer project and configure the props:

```tsx
<TVGuide
  dataURL="/guide.json"
  hourWidthPx={220}
  startHour={5}
  endHour={24}
  pageBg="#0a0a0a"
  cardBg="#1a1a1a"
  cardText="#ffffff"
  enableRegionSwitch={true}
  enableTimezoneSwitch={true}
/>
```

## 📊 Data Format

### Excel/CSV Input

Your spreadsheet should have these columns (case-insensitive):

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| Region | Region code | SA, ROA | ✅ |
| Date | Date in YYYY-MM-DD or DD/MM/YYYY | 2025-09-29 | ✅ |
| Start Time | 24-hour format | 14:30, 7:00 | ✅ |
| End Time | 24-hour format | 15:00, 7:30 | ⚠️ |
| Duration (min) | Duration in minutes | 30, 60 | ⚠️ |
| Local TZ | Timezone code | CAT, WAT, EST | ❌ |
| Title | Show title | Sister Wives | ✅ |
| Season | Season number | S1, S10 | ❌ |
| Episode | Episode number | Ep 145, EP 68 | ❌ |
| Subtitle | Custom subtitle | S10 EP 31 | ❌ |
| Text Color | Hex color | #ffffff | ❌ |
| BG Color | Hex color | #111216 | ❌ |

**Note**: Either `End Time` or `Duration (min)` is required.

## 🎯 Usage Examples

### Single Region Site (SA only)

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

### Multi-Region Site (SA + ROA)

```tsx
<TVGuide
  dataURL="/guide-multi.json"
  enableRegionSwitch={true}
  enableTimezoneSwitch={true}
  initialRegion="ROA"
  initialTimezone="WAT"
  hourWidthPx={240}
  startHour={6}
  endHour={23}
/>
```

### Custom Styling

```tsx
<TVGuide
  dataJSON={jsonString}
  fontFamily="Inter, sans-serif"
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

## 🔧 CLI Usage

Convert your own Excel/CSV files using the CLI script:

```bash
# Convert Excel file
npx ts-node scripts/excel-to-guide.ts \
  --in ./your-guide.xlsx \
  --out ./public/guide.json \
  --channelId "your-channel" \
  --defaultRegion "ROA"

# Convert CSV file  
npx ts-node scripts/excel-to-guide.ts \
  --in ./your-guide.csv \
  --out ./public/guide.json \
  --channelId "your-channel" \
  --defaultRegion "SA"
```

## 🌍 Timezone Rules

- **SA (South Africa):** Only CAT timezone - timezone switcher hidden
- **ROA (Rest of Africa):** WAT, CAT, EST timezone switcher shown
- **Other regions:** Configurable via `allowedTimezones` prop

## 📱 Responsive Design

- **Desktop:** Full feature set with all controls visible
- **Mobile:** Optimized layout with smaller fonts and touch-friendly controls
- **Tablet:** Balanced layout with appropriate sizing

## 🔒 Security & Validation

- **Input validation:** Comprehensive data structure validation
- **Error handling:** Graceful fallbacks for missing or invalid data
- **Type safety:** Full TypeScript coverage with strict mode
- **Sanitization:** Proper handling of user input and file uploads

## 📚 Documentation

- ✅ **README.md** - Complete usage guide and examples
- ✅ **TypeScript types** - Full type definitions with JSDoc
- ✅ **Inline comments** - Detailed code documentation
- ✅ **Example data** - Sample JSON for testing
- ✅ **CLI help** - Command-line usage instructions

## 🎉 Ready for Production

The TV Guide system is **production-ready** and can be immediately integrated into Framer projects. All components are:

- ✅ **Fully typed** with TypeScript
- ✅ **Well documented** with examples
- ✅ **Accessibility compliant** with WCAG guidelines
- ✅ **Performance optimized** for large datasets
- ✅ **Mobile responsive** for all devices
- ✅ **Error resilient** with comprehensive validation

**Next Steps:**
1. Copy components to your Framer project
2. Install dependencies
3. Test with your Excel/CSV data
4. Configure props in Framer
5. Deploy and enjoy! 🚀
