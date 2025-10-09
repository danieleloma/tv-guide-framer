# SA Excel to JSON Conversion Script

## 📋 Overview

This script converts a South Africa (SA) Excel file into a `RegionSchedule` JSON object that can be pasted directly into the `saJson` prop of the TV Guide component.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/danieleloma/tv-guide-framer
npm install -D typescript ts-node @types/node xlsx
```

### 2. Run the Script

```bash
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"
```

> **Note**: Update the `--in` path to match your actual Excel file location.

### 3. Use the Output

The script will create `public/sa-region.json`. Copy its contents and paste into the **`saJson`** prop in Framer.

---

## 📊 Excel File Requirements

### Required Columns

Your SA Excel file must have these column headers (case-sensitive):

| Column | Description | Example |
|--------|-------------|---------|
| `Date` | Date (day is extracted from this) | `2025-10-06` or Excel serial (45936) |
| `Start Time` | Start time | `06:00`, `0.25` (Excel decimal), or Date |
| `End Time` | End time | `07:00`, `0.2917` (Excel decimal), or Date |
| `Title` | Show title | `Sister Wives` |

### Optional Columns

| Column | Description | Example |
|--------|-------------|---------|
| `Season` | Season number | `S1`, `Season 1`, `1` |
| `Episode` | Episode number | `Ep 149`, `Episode 149`, `149` |
| `Region` | Region code (ignored, forced to SA) | `SA` |
| `Timezone` | Timezone (ignored, forced to CAT) | `CAT` |

> **Important**: Season and Episode must **both** be present for them to appear in the JSON. If either is missing, both are omitted.

---

## ⚙️ Configuration

### Time Window

SA uses the **CAT timezone** with a **24-hour cycle**:
- **Start**: `06:00` (6:00 AM)
- **End**: `06:00` (next day, 6:00 AM)
- **Slot labels**: `06:00, 06:30, 07:00, ..., 05:00, 05:30` (48 slots)

### Week Structure

The script enforces **7 days in order**: Mon → Tue → Wed → Thu → Fri → Sat → Sun

- If your Excel is missing a day, an empty scaffold is created.
- If dates are out of order, they're normalized to sequential Mon-Sun.

---

## 📝 Column Mapping

If your Excel headers are different, edit the `COL` object in the script:

```typescript
const COL = {
  region: "Region",         // Optional, ignored
  timezone: "Timezone",     // Optional, ignored
  date: "Date",             // "Date", "Program Date", etc. (day is extracted from this)
  title: "Title",           // "Title", "Show Name", "Program", etc.
  start: "Start Time",      // "Start Time", "Start", "Time", etc.
  end: "End Time",          // "End Time", "End", "Finish", etc.
  season: "Season",         // "Season", "S", "Season #", etc.
  episode: "Episode",       // "Episode", "Ep", "Episode #", etc.
} as const;
```

---

## 📤 Output Format

The script produces a `RegionSchedule` object:

```json
{
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
            }
            // ... 48 slots total (06:00 to 05:30)
          ]
        },
        "Tue": { /* ... */ },
        "Wed": { /* ... */ },
        "Thu": { /* ... */ },
        "Fri": { /* ... */ },
        "Sat": { /* ... */ },
        "Sun": { /* ... */ }
      }
    }
  }
}
```

### Key Points:
- **WAT is always `null`** (SA only uses CAT)
- **7 days present** (Mon-Sun)
- **48 slot labels** per day (06:00-05:30)
- **Shows placed at start slot** (aligned by start time)
- **Season/Episode included only when both present**

---

## ✅ Validation Checklist

After running the script, verify:

- [ ] Output file exists at specified path
- [ ] JSON is valid (no syntax errors)
- [ ] `region` is `"SA"`
- [ ] `timezones.WAT` is `null`
- [ ] `timezones.CAT` exists
- [ ] All 7 days present (Mon-Sun)
- [ ] Each day has 48 slots (06:00-05:30)
- [ ] Shows have `title`, `start`, `end`
- [ ] Shows with both Season & Episode have those fields
- [ ] Shows missing either Season or Episode omit both
- [ ] Dates are ISO format (yyyy-mm-dd)
- [ ] Times are 24-hour format (HH:MM)

---

## 🔧 Troubleshooting

### Script Error: "Missing --in path"

**Problem**: No input file specified.

**Fix**:
```bash
npx ts-node scripts/sa-excel-to-json.ts --in "/path/to/your/excel.xlsx"
```

### Script Error: "Cannot find module 'xlsx'"

**Problem**: Dependencies not installed.

**Fix**:
```bash
npm install -D xlsx typescript ts-node @types/node
```

### Output Has Wrong Headers

**Problem**: Excel column names don't match script expectations.

**Fix**: Edit the `COL` mapping in the script to match your headers.

### Times Are Wrong

**Problem**: Excel stores times as decimals or dates.

**Fix**: The script uses `cellDates: true` to handle this automatically. If still wrong, check that:
1. Excel cells are formatted as Time or Date
2. Not custom text that looks like time

### Shows Missing from Output

**Problem**: Shows not appearing in JSON.

**Possible causes**:
1. Missing required fields (Day, Date, Title, Start, End)
2. Times outside CAT window (06:00-06:00)
3. Invalid time format

**Debug**: Add console.log in the script:
```typescript
console.log('Row:', { day, title, start, end });
```

### Dates Are Wrong

**Problem**: Dates don't match expected week.

**Fix**: The script uses dates from Excel. If some days are missing dates, it synthesizes sequential dates. Check your Excel has dates for all days.

---

## 🎯 Usage in Framer

### Step 1: Copy JSON

```bash
# After running the script
cat public/sa-region.json | pbcopy  # macOS
# Or manually open and copy the file contents
```

### Step 2: Paste into Framer

1. Select your TV Guide component in Framer
2. Find the **`saJson`** property in the right panel
3. Paste the entire JSON content
4. The component will parse and display SA data

### Step 3: Enable SA Region

1. Click the **South Africa** button in the component header
2. Verify shows appear in the grid
3. Verify timezone is forced to **CAT** (WAT should be hidden)

---

## 📐 Technical Details

### Slot Calculation

Shows are placed into 30-minute slots based on their start time:

```typescript
// Example: Show starts at 06:15
// Window start: 06:00
// Offset: 15 minutes
// Slot index: floor(15 / 30) = 0
// Placed in slot "06:00"
```

### Spanning

Shows span multiple slots based on duration:

```typescript
// Example: Show runs 06:15-07:45 (90 minutes)
// Start slot: 06:00 (index 0)
// End slot: 08:00 (index 4)
// Span: 4 slots (06:00, 06:30, 07:00, 07:30)
```

### Terminal Tick Handling

Shows ending exactly at the window end (06:00) are included:

```typescript
// Show: 05:00-06:00
// Last slot: 05:30 (index 47)
// Span: 1 slot (05:30-06:00)
// ✅ Included (renders in final interval)
```

### No Time Conversions

The script does **zero timezone math**:
- Times from Excel → formatted as-is to "HH:MM"
- No UTC conversions
- No timezone offsets
- What you see in Excel is what appears in JSON

---

## 🔄 Re-running the Script

You can run the script multiple times safely:
- Output file is overwritten
- No side effects
- Idempotent (same input → same output)

```bash
# Example: Update after editing Excel
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA_UPDATED.xlsx" \
  --out "public/sa-region.json"
```

---

## 📞 Support

If you encounter issues:

1. **Check console output**: Script logs errors with details
2. **Verify Excel format**: Ensure headers match expected names
3. **Check file paths**: Use absolute paths for reliability
4. **Validate JSON**: Use a JSON validator (e.g., jsonlint.com)
5. **Test with sample data**: Create a minimal Excel with 1-2 rows

---

## ✨ Features

- ✅ Uses `cellDates: true` for accurate date/time parsing
- ✅ No time conversions (preserves Excel times as-is)
- ✅ 30-minute slot alignment
- ✅ CAT window: 06:00-06:00 (48 slots ending at 05:30)
- ✅ Enforces Mon-Sun week structure
- ✅ Auto-generates missing day scaffolds
- ✅ Conditional Season/Episode (only when both present)
- ✅ Handles shows crossing midnight
- ✅ Clamps shows to window boundaries
- ✅ Zero external dependencies (pure Node + xlsx)

---

## 📄 Example Command

```bash
# Full example with absolute paths
npx ts-node /Users/danieleloma/tv-guide-framer/scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "/Users/danieleloma/tv-guide-framer/public/sa-region.json"
```

**Expected output**:
```
✅ Wrote SA RegionSchedule → /Users/danieleloma/tv-guide-framer/public/sa-region.json
📊 Shows placed: 328
```

---

**Script ready to use! Run the command above to convert your SA Excel file.**

