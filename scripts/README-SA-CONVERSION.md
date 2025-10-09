# SA Excel to JSON Conversion Script

## Purpose

Converts a **South Africa (SA)** TV guide Excel file into a **`RegionSchedule`** JSON object that can be pasted directly into the `saJson` prop of the TVGuide component.

---

## Features

✅ **CAT timezone only** (06:00 → 06:00 next day)  
✅ **48 slot labels** (06:00, 06:30, ..., 05:30) – terminal label (06:00) excluded  
✅ **7-day structure** (Mon → Sun) with auto-scaffolding for missing days  
✅ **Season/Episode inclusion** only when both fields are present  
✅ **No time conversions** – uses `cellDates: true` and formats to "HH:MM"  
✅ **Midnight wraparound handling** – shows spanning midnight are correctly placed  

---

## Installation

```bash
# Install dependencies (if not already installed)
npm install -D typescript ts-node @types/node xlsx
```

---

## Usage

### Basic Command

```bash
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/path/to/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"
```

### Parameters

- `--in`: **Required**. Path to the SA Excel file.
- `--out`: **Optional**. Output JSON file path. Default: `public/sa-region.json`

### Example

```bash
# Convert SA Excel from Downloads
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"
```

---

## Excel Column Mapping

The script expects these column headers (adjust `COL` object in the script if different):

| Column Header | Purpose | Required | Notes |
|--------------|---------|----------|-------|
| `Region` | Region code | Optional | Ignored (forced to "SA") |
| `Timezone` | Timezone | Optional | Ignored (forced to "CAT") |
| `Day` | Day of week | **Yes** | Mon/Tue/Wed/... (or Monday/Tuesday/...) |
| `Date` | ISO date | **Yes** | 2025-10-06, 2025-10-07, etc. |
| `Title` | Show title | **Yes** | e.g., "Sister Wives" |
| `Start` | Start time | **Yes** | 06:00, 6:00 AM, or Excel time |
| `End` | End time | **Yes** | 07:00, 7:00 AM, or Excel time |
| `Season` | Season number | Optional | e.g., "S1", "1", "Season 1" |
| `Episode` | Episode number | Optional | e.g., "Ep 149", "149", "Episode 149" |

**Important**: Season and Episode are **only included in JSON if both are present** for a row.

---

## Output Format

The script generates a **`TvGuideData`** object (compatible with the component):

```json
{
  "window": {
    "WAT": { "start": "05:00", "end": "04:00" },
    "CAT": { "start": "06:00", "end": "05:00" },
    "slotMinutes": 30
  },
  "regions": {
    "SA": {
      "region": "SA",
      "timezones": {
        "WAT": null,
        "CAT": {
          "timezone": "CAT",
          "days": {
            "Mon": {
              "date": "2025-10-06",
              "day": "Mon",
              "slots": [
                {
                  "time": "06:00",
                  "shows": [
                    {
                      "title": "Sister Wives",
                      "start": "06:00",
                      "end": "07:00",
                      "season": "S1",
                      "episode": "Ep 149"
                    }
                  ]
                },
                {
                  "time": "06:30",
                  "shows": []
                },
                ...
                {
                  "time": "05:30",
                  "shows": []
                }
              ]
            },
            "Tue": { ... },
            "Wed": { ... },
            "Thu": { ... },
            "Fri": { ... },
            "Sat": { ... },
            "Sun": { ... }
          }
        }
      }
    },
    "ROA": {
      "region": "ROA",
      "timezones": { "WAT": null, "CAT": null }
    }
  }
}
```

**Note**: The `ROA` region is included with null timezones to maintain the expected structure. This allows the SA data to work seamlessly with the component's data expectations.

---

## How to Use the Output

1. **Run the conversion script** (see Usage above)
2. **Open** `public/sa-region.json` in your editor
3. **Copy the entire JSON content**
4. **Paste** into the `saJson` prop in Framer:
   - Select your TVGuide component
   - Find the "SA Data JSON" property
   - Paste the JSON

---

## Time Window Logic

### CAT Window: 06:00 → 06:00 (next day)

- **Slot labels**: 06:00, 06:30, 07:00, ..., 05:00, 05:30 (**48 labels**)
- **Terminal tick**: 06:00 (next day) is NOT included in slot labels
- **Last interval**: 05:30 → 06:00 (shows ending at 06:00 are included)

### Show Placement

Shows are placed in slots based on their **start time**:

```
Show: 06:00 - 06:30  → Slot: 06:00 (span: 1)
Show: 06:00 - 07:00  → Slot: 06:00 (span: 2)
Show: 05:00 - 06:00  → Slot: 05:00 (span: 2, includes terminal)
Show: 05:30 - 06:00  → Slot: 05:30 (span: 1, includes terminal)
```

### Midnight Wraparound

Shows that cross midnight are automatically handled:

```
Show: 23:30 - 00:30  → Placed correctly across days
Show: 05:30 - 06:00  → Last slot, includes terminal tick
```

---

## Day Scaffolding

The script ensures all 7 days (Mon → Sun) are present:

1. **If dates exist in Excel**: Uses those dates
2. **If some days missing**: Synthesizes sequential dates from the earliest found
3. **If no dates at all**: Creates a week starting from the current Monday

This ensures the component always receives a complete 7-day structure.

---

## Episode Data Handling

Season and Episode are **only included** when **both** are present:

```javascript
// Row has both Season AND Episode
{
  "title": "Sister Wives",
  "start": "06:00",
  "end": "07:00",
  "season": "S1",      // ✅ Included
  "episode": "Ep 149"  // ✅ Included
}

// Row has only Season (no Episode)
{
  "title": "Sister Wives",
  "start": "06:00",
  "end": "07:00"
  // ❌ Season/Episode omitted
}

// Row has only Episode (no Season)
{
  "title": "Sister Wives",
  "start": "06:00",
  "end": "07:00"
  // ❌ Season/Episode omitted
}
```

---

## Troubleshooting

### Error: "Missing --in path to SA Excel file"

**Solution**: Provide the `--in` argument with the Excel file path:

```bash
npx ts-node scripts/sa-excel-to-json.ts --in "/path/to/file.xlsx"
```

### Error: "Cannot find module 'xlsx'"

**Solution**: Install dependencies:

```bash
npm install -D xlsx
```

### Shows Not Appearing

**Possible causes**:
1. Missing required columns (Day, Date, Title, Start, End)
2. Invalid time format
3. Show outside CAT window (06:00 → 06:00)

**Debug**: Check the console output for the number of shows processed.

### Wrong Dates

**Solution**: Ensure the Excel `Date` column contains valid dates (2025-10-06 format or Excel date values). With `cellDates: true`, Excel dates are automatically parsed.

### Season/Episode Not Showing

**Check**: Both Season AND Episode columns must have values. If only one is present, both are omitted from the JSON.

---

## Column Mapping Customization

If your Excel has different column headers, edit the `COL` object in the script:

```typescript
const COL = {
  region: "Region",         // Change to match your header
  timezone: "Timezone",     // Change to match your header
  day: "Day",               // Change to match your header
  date: "Date",             // Change to match your header
  title: "Title",           // Change to match your header
  start: "Start",           // Change to match your header (e.g., "Start Time")
  end: "End",               // Change to match your header (e.g., "End Time")
  season: "Season",         // Change to match your header
  episode: "Episode",       // Change to match your header
} as const;
```

---

## Technical Details

### Dependencies

- **SheetJS (`xlsx`)**: Excel file parsing with `cellDates: true`
- **Node.js `fs` and `path`**: File system operations
- **TypeScript**: Type-safe implementation

### Algorithm

1. **Read Excel** with `cellDates: true` (no manual date parsing)
2. **Build 48 slot labels** (06:00 → 05:30)
3. **Create empty day scaffolds** for Mon → Sun
4. **Parse rows**:
   - Normalize day names (Mon/Monday → Mon)
   - Format times to "HH:MM" 24-hour
   - Format dates to ISO (yyyy-mm-dd)
   - Include season/episode only if both present
5. **Place shows** into slots based on start time
6. **Handle midnight wraparound** automatically
7. **Write JSON** to output file

### Time Handling

- **No conversions**: Times are used exactly as they appear in Excel
- **Format**: 24-hour "HH:MM" strings (e.g., "06:00", "23:30")
- **Slot alignment**: Shows placed at the slot matching their start time
- **Span calculation**: Duration determines how many slots the show occupies

---

## Acceptance Criteria

✅ Uses `cellDates: true` when reading Excel  
✅ Outputs exactly 48 slot labels (06:00 → 05:30)  
✅ Terminal tick (06:00) excluded from labels but shows ending at 06:00 are included  
✅ All 7 days (Mon → Sun) present with proper scaffolding  
✅ Season/Episode only included when both exist  
✅ No time conversions (format to "HH:MM" only)  
✅ Midnight wraparound handled correctly  
✅ Valid `RegionSchedule` JSON for SA region  

---

## Output Statistics

The script prints:
- ✅ Output file path
- 📊 Total number of shows processed

Example:
```
✅ Wrote SA RegionSchedule → public/sa-region.json
📊 Total shows processed: 168
```

---

## Next Steps

After running this script:

1. ✅ Verify `public/sa-region.json` was created
2. ✅ Open the file and check the structure
3. ✅ Copy the entire JSON content
4. ✅ Paste into the `saJson` prop in Framer
5. ✅ The SA region toggle should now appear and work

---

## Related Files

- **Component**: `components/TVGuideFinal.tsx`
- **ROA conversion script**: `scripts/excel-to-json-simple.ts`
- **Types**: Inline in this script (matches component schema)

