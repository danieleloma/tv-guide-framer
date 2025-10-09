# ✅ SA Excel to JSON Conversion - COMPLETED

## 📦 Deliverables

### 1. **Conversion Script**
**File**: `scripts/sa-excel-to-json.ts`

A complete Node/TypeScript script that converts SA Excel files into `RegionSchedule` JSON format.

### 2. **Documentation**
**File**: `scripts/SA-CONVERSION-README.md`

Comprehensive guide covering:
- Installation instructions
- Usage examples
- Excel file requirements
- Column mapping
- Troubleshooting
- Output format specification

### 3. **Generated JSON**
**File**: `public/sa-region.json`

Successfully generated JSON from your SA Excel file with:
- ✅ **216 shows** across 7 days
- ✅ **48 slots per day** (06:00 to 05:30)
- ✅ **Season & Episode** included when both present
- ✅ **CAT timezone** only (WAT is null)
- ✅ **Mon-Sun structure** with correct dates

---

## 🎯 Success Metrics

| Criterion | Status | Details |
|-----------|--------|---------|
| Uses `cellDates: true` | ✅ | Excel dates parsed correctly |
| Mon → Sun order | ✅ | All 7 days present in order |
| 30-minute slots | ✅ | 48 slots per day (06:00-05:30) |
| CAT window (06:00-06:00) | ✅ | Shows clamped to window |
| No time conversions | ✅ | Times preserved as-is |
| Season/Episode conditional | ✅ | Only included when both exist |
| Terminal tick handling | ✅ | Shows ending at 06:00 included |

---

## 📊 Output Statistics

```
Region: SA
Timezone: CAT only (WAT = null)

Mon (2025-10-06): 31 shows
Tue (2025-10-07): 31 shows
Wed (2025-10-08): 31 shows
Thu (2025-10-09): 31 shows
Fri (2025-10-10): 31 shows
Sat (2025-10-11): 28 shows
Sun (2025-10-12): 33 shows

Total: 216 shows
Slots per day: 48 (06:00 to 05:30)
First slot: 06:00
Last slot: 05:30
```

---

## 🚀 How to Use

### 1. Run the Conversion

```bash
cd /Users/danieleloma/tv-guide-framer

npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"
```

**Expected output**:
```
✅ Wrote SA RegionSchedule → public/sa-region.json
📊 Shows placed: 216
```

### 2. Copy the JSON

```bash
# View the generated JSON
cat public/sa-region.json

# Or copy to clipboard (macOS)
cat public/sa-region.json | pbcopy
```

### 3. Paste into Framer

1. Open your TV Guide component in Framer
2. Find the **`saJson`** property in the right panel
3. Paste the entire JSON content
4. The component will parse and display SA data

### 4. Test in Component

1. Click **"South Africa"** button in the header
2. Verify timezone is forced to **CAT** (WAT hidden)
3. Verify shows appear in the grid aligned to 30-min slots
4. Verify Season/Episode appears on show cards
5. Verify dates match: Mon Oct 6 - Sun Oct 12, 2025

---

## 🔍 JSON Structure

The generated JSON follows this schema:

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
            { "time": "06:00", "shows": [...] },
            { "time": "06:30", "shows": [...] },
            ...
            { "time": "05:30", "shows": [...] }
          ]
        },
        ... // Tue, Wed, Thu, Fri, Sat, Sun
      }
    }
  }
}
```

### Show Item Structure

```json
{
  "title": "Sister Wives",
  "start": "06:00",
  "end": "07:00",
  "season": "S1",      // Only if both season & episode exist
  "episode": "Ep 149"  // Only if both season & episode exist
}
```

---

## 🔧 Technical Features

### Excel Parsing

- **`cellDates: true`**: Accurate date/time parsing
- **Decimal time handling**: Converts Excel decimals (e.g., 0.25 → 06:00)
- **Serial date handling**: Converts Excel dates (e.g., 45936 → 2025-10-06)
- **Day extraction**: Automatically extracts weekday from date

### Time Handling

- **No conversions**: Times preserved exactly as in Excel
- **30-minute alignment**: Shows placed in appropriate slots
- **Midnight crossing**: Handles shows spanning across midnight
- **Window clamping**: Ensures all shows within CAT window (06:00-06:00)

### Data Structure

- **7-day enforcement**: Mon → Sun always present
- **Empty scaffolds**: Missing days filled with empty slot arrays
- **48 slots**: Exactly 06:00 to 05:30 (terminal label omitted)
- **Start-aligned**: Shows placed at their start slot

### Episode Details

- **Conditional inclusion**: Only when both Season & Episode exist
- **Flexible parsing**: Handles "S1", "Season 1", "1", etc.
- **Trimming**: Removes whitespace from values
- **Empty handling**: Treats empty strings as null

---

## ✅ Acceptance Tests - PASSED

### 1. Excel Parsing ✅
- [x] Uses `cellDates: true`
- [x] Produces ISO dates (yyyy-mm-dd)
- [x] Mon → Sun order enforced
- [x] Shows clipped to CAT window (06:00-06:00)
- [x] 48 ticks per day (30-min slots)

### 2. Grid Alignment ✅
- [x] Shows start at correct slot index
- [x] All shows within 06:00-06:00 window
- [x] Terminal slot (05:30-06:00) includes shows ending at 06:00

### 3. Episode Data ✅
- [x] Season & Episode included when both present
- [x] Omitted when either is missing
- [x] No empty/null values in JSON

### 4. No Time Conversions ✅
- [x] Times match Excel exactly (after formatting)
- [x] No timezone offsets applied
- [x] Decimal times converted correctly

### 5. Schema Compliance ✅
- [x] `region` is "SA"
- [x] `timezones.WAT` is null
- [x] `timezones.CAT` exists
- [x] All 7 days present (Mon-Sun)
- [x] Each day has 48 slots
- [x] Dates are ISO format
- [x] Times are HH:MM format

---

## 📝 Sample Output

### Monday, Oct 6, 2025

**First few shows**:

| Time | Title | Duration | Episode |
|------|-------|----------|---------|
| 06:00 | Ringside Rebel | 30 min | S1 • Ep 283 |
| 06:30 | Twist of Fate: New Era | 60 min | S10 • Ep 78 |
| 07:30 | Hidden Intentions | 60 min | S1 • EP 62 |
| 08:30 | Betrayal | 30 min | S1 • EP 276 |
| 09:00 | Secrets | 30 min | S1 • EP 56 |
| 09:30 | Taxi | 30 min | S1 • EP 56 |
| 10:00 | King of Hearts | 60 min | S1 • EP 125 |

**Pattern**: Shows correctly placed in 30-minute slots with proper alignment.

---

## 🎨 How It Appears in Component

When you paste this JSON into the `saJson` prop:

1. **Header**:
   - "South Africa" button becomes available (if was hidden)
   - Clicking it activates SA region
   - Timezone auto-switches to CAT (WAT hidden)

2. **Grid**:
   - 7 rows (Mon-Sun)
   - 48 columns (06:00-05:30)
   - Shows span correct number of slots

3. **Show Cards**:
   ```
   ┌─────────────────────┐
   │ Ringside Rebel      │  ← Title
   │ S1 • Ep 283         │  ← Episode (if both exist)
   │ 06:00 - 06:30       │  ← Time
   └─────────────────────┘
   ```

4. **Interactions**:
   - Hover shows tooltip with full title
   - Cards truncate long titles with ellipsis
   - Time labels at top align with card positions

---

## 🔄 Re-running the Script

Safe to run multiple times:

```bash
# Update the Excel file, then re-run
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/path/to/updated-file.xlsx" \
  --out "public/sa-region.json"
```

The script is **idempotent**: same input → same output.

---

## 🆚 Differences from ROA Script

If you already have a ROA conversion script, here's what's different:

| Feature | ROA | SA |
|---------|-----|-----|
| Timezones | WAT & CAT | CAT only |
| Window (WAT) | 05:00-04:00 | N/A |
| Window (CAT) | 06:00-05:00 | 06:00-06:00 |
| Timezone toggle | Yes | No (forced CAT) |
| Region toggle | Yes | Yes |

**Note**: The SA script outputs the **exact same schema** as ROA, just with `WAT: null`.

---

## 🐛 Troubleshooting

### "Shows placed: 0"

**Possible causes**:
1. Column headers don't match (case-sensitive)
2. Required columns missing (Date, Start Time, End Time, Title)
3. Date/time values invalid

**Fix**: Check the `COL` mapping in the script matches your Excel headers.

### "Date is wrong"

Excel serial dates are handled automatically. If still wrong:
- Verify Excel cells are formatted as Date (not Text)
- Check timezone in Excel (should be local time, not UTC)

### "Times are off by hours"

This means Excel stored times in a different format. The script handles:
- Decimal (0.25 = 06:00)
- Date objects
- Time strings ("6:00", "06:00")

If still wrong, add debug logs in `fmtExcelTime`.

---

## 📁 Files Reference

```
/Users/danieleloma/tv-guide-framer/
├── scripts/
│   ├── sa-excel-to-json.ts          ← Main conversion script
│   └── SA-CONVERSION-README.md      ← Full documentation
├── public/
│   └── sa-region.json               ← Generated output (216 shows)
└── SA-CONVERSION-SUMMARY.md         ← This file
```

---

## ✨ Next Steps

1. **Paste JSON into Framer**: Copy `public/sa-region.json` → `saJson` prop
2. **Test the component**: Click "South Africa" button and verify shows appear
3. **Update weekly**: Re-run script when new Excel files are available
4. **Customize styling**: Use Framer controls to adjust colors, fonts, sizing

---

## 📞 Support

If you encounter issues:

1. Check `scripts/SA-CONVERSION-README.md` for detailed troubleshooting
2. Verify Excel file matches expected format
3. Check browser console for component errors
4. Validate JSON at jsonlint.com

---

## 🎉 Summary

**Script Created**: ✅  
**JSON Generated**: ✅  
**216 Shows Converted**: ✅  
**Schema Compliant**: ✅  
**Ready for Framer**: ✅  

**The SA Excel to JSON conversion is complete and ready to use!**

Simply paste the contents of `public/sa-region.json` into your TV Guide component's `saJson` prop and the South Africa region will be fully functional.



