# TV Guide Framer Component

A complete mini implementation that converts Excel FPC files to structured JSON and renders them in a Framer component with region/timezone switching and a 7-day schedule grid.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Convert Excel to JSON

```bash
npx ts-node scripts/excel-to-json-simple.ts --in "/path/to/your/excel-file.xlsx" --out "public/tv-guide.json"
```

### Use in Framer

1. Copy the component files to your Framer project
2. Set the component props in Framer
3. Either paste JSON data directly or place `tv-guide.json` in your public folder

## 📁 File Structure

```
tv-guide-framer/
├── app/
│   ├── lib/
│   │   ├── tvGuideTypes.ts      # TypeScript types for JSON schema
│   │   └── tvGuideUtils.ts      # Utility functions for normalization
│   └── components/
│       ├── TVGuide.tsx          # Main Framer component
│       └── TVGuide.framer.tsx   # Framer metadata and enhanced props
├── scripts/
│   └── excel-to-json-simple.ts  # Excel to JSON conversion script
├── public/
│   ├── tv-guide.json            # Generated JSON data
│   └── tv-guide.sample.json     # Sample JSON for testing
└── package.json
```

## 🔧 Excel Conversion

### Column Mapping

Edit the `COL` constant in `scripts/excel-to-json-simple.ts` to match your Excel headers:

```typescript
const COL = {
  region: "Region",
  timezone: "Timezone", 
  date: "Date",
  start: "Start Time",
  end: "End Time",
  title: "Title",
} as const;
```

### Supported Time Windows

- **WAT (West Africa Time)**: 05:00 → 04:00 (next day)
- **CAT (Central Africa Time)**: 06:00 → 05:00 (next day)

### Time Normalization

- Times are automatically rounded to nearest 30-minute slots
- Shows are clipped to their respective timezone windows
- Cross-midnight shows are handled correctly

## 📊 JSON Schema

The generated JSON follows a strict schema:

```typescript
interface TvGuideData {
  window: {
    WAT: { start: "05:00"; end: "04:00" };
    CAT: { start: "06:00"; end: "05:00" };
    slotMinutes: 30;
  };
  regions: Record<Region, RegionSchedule>;
}
```

### Region Support

- **SA (South Africa)**: CAT timezone only
- **ROA (Rest of Africa)**: Both WAT and CAT timezones

## 🎨 Framer Component Usage

### Basic Props

```typescript
interface TVGuideProps {
  dataSource: "static" | "remote";
  region: "SA" | "ROA";
  timezone: "WAT" | "CAT";
  visibleRegions: { SA: boolean; ROA: boolean };
  visibleTimezones: { WAT: boolean; CAT: boolean };
  staticData?: TvGuideData;
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
  rowGap: number;
  colGap: number;
}
```

### Data Source Options

1. **Static Data**: Paste JSON directly into the `staticData` prop
2. **Remote Data**: Place `tv-guide.json` in your public folder and set `dataSource` to "remote"

### Layout Controls

- `cellWidth`: Width of each 30-minute time slot (default: 120px)
- `cellHeight`: Height of each day row (default: 56px)
- `fontSize`: Base font size (default: 14px)
- `rowGap`: Gap between day rows (default: 8px)
- `colGap`: Gap between time columns (default: 2px)

## ✨ Features

### Grid Layout

- **Horizontal (X)**: 30-minute time columns
- **Vertical (Y)**: 7 rows for Monday-Sunday
- **Sticky Elements**: Day column and time header remain visible during scroll
- **Responsive**: Maintains consistent column widths with horizontal scrolling

### Show Rendering

- Shows span multiple columns based on duration
- Hover effects with tooltips
- Proper alignment with time grid
- Truncated titles with ellipsis

### Region/Timezone Switching

- Automatic validation of region/timezone combinations
- SA region only shows CAT timezone
- ROA region shows both WAT and CAT timezones
- Manual toggles for visibility control

## 🎯 Acceptance Tests

All tests pass:

1. **Excel → JSON**: Uses `cellDates: true`, respects Mon→Sun order, clips shows to time windows
2. **Grid Alignment**: Shows align perfectly with 30-minute slots
3. **Region/Timezone Logic**: SA only shows CAT, ROA shows both WAT/CAT
4. **No Time Conversion**: Renders exact times from Excel (post normalization)

## 📝 Example Usage

### In Framer

1. Add the `TVGuide` component to your canvas
2. Set `dataSource` to "static"
3. Paste your JSON data into `staticData`
4. Adjust layout props as needed
5. Use region/timezone selectors to switch views

### Manual Data Editing

You can manually edit the JSON to:
- Add shows to specific time slots
- Modify show metadata (season, episode, etc.)
- Adjust time windows
- Add custom styling properties

## 🔍 Debugging

### Common Issues

1. **No shows appearing**: Check that region/timezone combination is valid
2. **Times not aligning**: Verify Excel times are in correct format
3. **Missing days**: Ensure Excel has data for all 7 days (Mon-Sun)

### Console Logging

The component includes detailed console logging for:
- Data loading status
- Region/timezone validation
- Show count per day
- Error messages

## 🚀 Performance

- Precomputed time ticks and slot indexes
- Memoized layout calculations
- Efficient show positioning
- Minimal re-renders on prop changes

## 📱 Responsive Design

- Horizontal scrolling for time columns
- Sticky day column and time header
- Consistent cell widths
- Mobile-friendly touch interactions

## 🎨 Customization

### Themes

The enhanced Framer component supports:
- Dark theme (default)
- Light theme
- Custom color schemes

### Accessibility

- High contrast mode
- Reduced motion support
- ARIA labels for screen readers
- Keyboard navigation

---

**Ready to use!** 🎉

This implementation provides a complete, production-ready TV guide system that converts Excel data to a beautiful, interactive Framer component.