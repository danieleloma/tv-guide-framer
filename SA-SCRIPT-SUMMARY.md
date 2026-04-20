# ✅ SA Excel to JSON Conversion Script — Complete

## 📦 What Was Created

### 1. **Main Script**
**File**: `scripts/sa-excel-to-json.ts`

A TypeScript script that converts SA Excel files into `RegionSchedule` JSON for the TVGuide component.

**Key Features**:
- ✅ Uses SheetJS with `cellDates: true`
- ✅ No time conversions (format to "HH:MM" only)
- ✅ CAT timezone window: 06:00 → 06:00 (next day)
- ✅ 48 slot labels: 06:00, 06:30, ..., 05:30 (terminal 06:00 excluded)
- ✅ 7-day structure (Mon → Sun) with auto-scaffolding
- ✅ Season/Episode included only when both present
- ✅ Midnight wraparound handling
- ✅ CLI with `--in` and `--out` flags

### 2. **Documentation**
**File**: `scripts/README-SA-CONVERSION.md`

Comprehensive documentation covering:
- Installation and usage
- Excel column mapping
- Output format
- Time window logic
- Day scaffolding
- Episode data handling
- Troubleshooting
- Technical details

### 3. **Quick Start Guide**
**File**: `SA-CONVERSION-QUICKSTART.md`

Step-by-step guide for users:
- Simple 5-step process
- Copy-paste friendly commands
- Visual output examples
- Common issues and fixes

---

## 🚀 How to Use

### Basic Usage

```bash
# Navigate to project
cd /Users/danieleloma/tv-guide-framer

# Run conversion (adjust --in path)
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"

# Copy output to clipboard (macOS)
cat public/sa-region.json | pbcopy

# Paste into Framer "SA Data JSON" prop
```

---

## 📋 Excel Requirements

Your SA Excel file should have:

| Column | Required | Example | Notes |
|--------|----------|---------|-------|
| Day | ✅ Yes | Mon, Tue, Monday | Normalized to 3-letter |
| Date | ✅ Yes | 2025-10-06 | ISO or Excel date |
| Title | ✅ Yes | Sister Wives | Show name |
| Start | ✅ Yes | 06:00, 6:00 AM | Any format |
| End | ✅ Yes | 07:00, 7:00 AM | Any format |
| Season | ❌ Optional | S1, Season 1 | Only if Episode also present |
| Episode | ❌ Optional | Ep 149, 149 | Only if Season also present |
| Region | ❌ Optional | SA | Ignored (forced to SA) |
| Timezone | ❌ Optional | CAT | Ignored (forced to CAT) |

---

## 📊 Output Structure

The script generates:

```json
{
  "region": "SA",
  "timezones": {
    "WAT": null,
    "CAT": {
      "timezone": "CAT",
      "days": {
        "Mon": { "date": "2025-10-06", "day": "Mon", "slots": [48 items] },
        "Tue": { "date": "2025-10-07", "day": "Tue", "slots": [48 items] },
        "Wed": { "date": "2025-10-08", "day": "Wed", "slots": [48 items] },
        "Thu": { "date": "2025-10-09", "day": "Thu", "slots": [48 items] },
        "Fri": { "date": "2025-10-10", "day": "Fri", "slots": [48 items] },
        "Sat": { "date": "2025-10-11", "day": "Sat", "slots": [48 items] },
        "Sun": { "date": "2025-10-12", "day": "Sun", "slots": [48 items] }
      }
    }
  }
}
```

Each slot:
```json
{
  "time": "06:00",
  "shows": [
    {
      "title": "Sister Wives",
      "start": "06:00",
      "end": "07:00",
      "season": "S1",    // Only if both season AND episode exist
      "episode": "Ep 149"
    }
  ]
}
```

---

## ✅ Acceptance Criteria

All requirements met:

✅ Uses `cellDates: true` when reading Excel  
✅ No time conversions (format to "HH:MM" 24-hour only)  
✅ CAT window: 06:00 → 06:00 (next day)  
✅ Slot labels: 06:00, 06:30, ..., 05:30 (48 total)  
✅ Terminal tick (06:00) excluded from labels  
✅ Shows ending at 06:00 still included (last interval 05:30-06:00)  
✅ 7 days (Mon → Sun) with auto-scaffolding  
✅ Season/Episode only when both present  
✅ Midnight wraparound handled  
✅ Valid `RegionSchedule` JSON  
✅ CLI with `--in` and `--out` flags  
✅ No changes to other files/logic  

---

## 🎯 What This Enables

After running this script and pasting the JSON into Framer:

1. **SA Region Toggle Appears** (if it was hidden due to no data)
2. **Clicking "South Africa"**:
   - Highlights SA button
   - Forces CAT timezone
   - Hides WAT toggle (SA doesn't support WAT)
   - Displays SA TV guide data
3. **Complete 7-Day Grid**:
   - Mon → Sun schedule
   - 06:00 → 05:30 time slots
   - Correct show placement
   - Episode details (when available)

---

## 🔧 Customization

### Change Column Headers

Edit the `COL` object in the script:

```typescript
const COL = {
  region: "Region",      // Change to match your header
  timezone: "Timezone",  // Change to match your header
  day: "Day",            // Change to match your header
  date: "Date",          // Change to match your header
  title: "Title",        // Change to match your header
  start: "Start Time",   // 👈 Example: if your header is "Start Time"
  end: "End Time",       // 👈 Example: if your header is "End Time"
  season: "Season",      // Change to match your header
  episode: "Episode",    // Change to match your header
} as const;
```

### Change Output Path

Use the `--out` flag:

```bash
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/path/to/file.xlsx" \
  --out "custom/path/sa-data.json"
```

---

## 🐛 Common Issues

### Script Errors

| Error | Solution |
|-------|----------|
| "Missing --in path" | Add `--in "/path/to/file.xlsx"` |
| "Cannot find module 'xlsx'" | Run `npm install -D xlsx` |
| "No such file or directory" | Check the `--in` path is correct |

### Data Issues

| Issue | Check |
|-------|-------|
| No shows processed | Verify required columns exist (Day, Date, Title, Start, End) |
| Wrong dates | Ensure Date column has valid dates |
| Missing episodes | Both Season AND Episode must exist for inclusion |
| Shows outside window | Times must be within CAT window (06:00-06:00) |

### Framer Issues

| Issue | Solution |
|-------|---------|
| SA button not appearing | Verify JSON pasted into "SA Data JSON" prop |
| Shows not displaying | Check browser console for errors |
| Wrong times | Ensure Excel times are correct |
| No episode details | Check both Season AND Episode exist in Excel |

---

## 📚 Related Files

- **Component**: `components/TVGuideFinal.tsx` (consumes the JSON)
- **ROA Script**: `scripts/excel-to-json-simple.ts` (similar script for ROA)
- **Full Docs**: `scripts/README-SA-CONVERSION.md`
- **Quick Start**: `SA-CONVERSION-QUICKSTART.md`
- **Troubleshooting**: `TROUBLESHOOTING-SELECTED-STATES.md`

---

## 🔄 Workflow

```
┌─────────────────────┐
│  SA Excel File      │
│  (Downloads)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  sa-excel-to-json   │
│  (This Script)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  sa-region.json     │
│  (public/)          │
└──────────┬──────────┘
           │
           ▼ (copy/paste)
┌─────────────────────┐
│  Framer Component   │
│  "SA Data JSON"     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Live TV Guide      │
│  with SA Region     │
└─────────────────────┘
```

---

## 🎉 Summary

The SA conversion script is **complete and ready to use**. It:

1. ✅ Converts SA Excel to valid `RegionSchedule` JSON
2. ✅ Follows all specified requirements
3. ✅ Includes comprehensive documentation
4. ✅ Provides clear usage instructions
5. ✅ Handles edge cases (midnight, missing days, optional episodes)
6. ✅ No changes to existing code or schemas
7. ✅ Matches component expectations exactly

**Next Step**: Run the script with your SA Excel file and paste the output into Framer!

---

## 📞 Need Help?

1. **Quick Start**: `SA-CONVERSION-QUICKSTART.md`
2. **Full Docs**: `scripts/README-SA-CONVERSION.md`
3. **Troubleshooting**: Check console output, verify Excel structure, check browser console

---

**Script Status**: ✅ **COMPLETE & TESTED**  
**Ready to use**: ✅ **YES**  
**Breaking changes**: ❌ **NONE**






