# 🚀 SA Conversion Quick Start

## TL;DR

Convert your SA Excel file to JSON and paste it into Framer.

---

## Step 1: Run the Script

```bash
cd /Users/danieleloma/tv-guide-framer

npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_SA (6th-12th October, 2025).xlsx" \
  --out "public/sa-region.json"
```

**Adjust the `--in` path** to match your actual SA Excel file location.

---

## Step 2: Check the Output

You should see:

```
✅ Wrote SA RegionSchedule → public/sa-region.json
📊 Total shows processed: 168
```

(The number will vary based on your data)

---

## Step 3: Copy the JSON

```bash
# Open the file in your default editor
open public/sa-region.json

# Or display in terminal
cat public/sa-region.json
```

**Copy the entire contents** (Cmd+A, Cmd+C).

---

## Step 4: Paste into Framer

1. Open your Framer project
2. Select the **TVGuide** component
3. Find the **"SA Data JSON"** property in the right panel
4. **Paste** the JSON you copied
5. Press **Enter** or click away to apply

---

## Step 5: Verify

The **South Africa** region toggle should now:
- ✅ Appear in the header (if it was hidden before)
- ✅ Show CAT timezone only (no WAT option)
- ✅ Display your SA TV guide data when selected

---

## What the Script Does

✅ Reads your SA Excel file (with `cellDates: true`)  
✅ Creates 48 time slots (06:00 → 05:30) for CAT timezone  
✅ Builds a complete 7-day schedule (Mon → Sun)  
✅ Includes Season/Episode only when both are present  
✅ Handles midnight wraparound automatically  
✅ Outputs valid `RegionSchedule` JSON  

---

## Expected Excel Structure

Your Excel should have these columns:

| Day | Date | Title | Start | End | Season | Episode |
|-----|------|-------|-------|-----|--------|---------|
| Mon | 2025-10-06 | Sister Wives | 06:00 | 07:00 | S1 | Ep 149 |
| Mon | 2025-10-06 | Radhe Mohan | 07:00 | 07:30 | S2 | Ep 201 |
| ... | ... | ... | ... | ... | ... | ... |

**Optional columns**: Region, Timezone (ignored for SA)

---

## Troubleshooting

### "Missing --in path to SA Excel file"

Add the `--in` argument:

```bash
npx ts-node scripts/sa-excel-to-json.ts --in "/path/to/your/file.xlsx"
```

### "Cannot find module 'xlsx'"

Install dependencies:

```bash
npm install -D typescript ts-node @types/node xlsx
```

### No Shows Appearing in Framer

1. Check that the JSON was pasted correctly
2. Verify the Excel has the required columns (Day, Date, Title, Start, End)
3. Check browser console for errors
4. Ensure times are in CAT window (06:00 → 06:00)

### SA Button Not Appearing

1. Verify the JSON was pasted into the **"SA Data JSON"** prop (not ROA)
2. Check that the JSON is valid (no syntax errors)
3. Look for JavaScript errors in browser console

---

## Output Format Preview

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
    },
    "ROA": {
      "region": "ROA",
      "timezones": { "WAT": null, "CAT": null }
    }
  }
}
```

**Structure**: Full `TvGuideData` object with window configuration and both regions (SA populated, ROA empty stub).

---

## Full Documentation

For complete details, see: **[README-SA-CONVERSION.md](./scripts/README-SA-CONVERSION.md)**

---

## Next Steps

After pasting the SA JSON:

1. ✅ Click the **"South Africa"** toggle in the component
2. ✅ Verify the CAT timezone shows correctly
3. ✅ Check that shows display at the correct times
4. ✅ Confirm season/episode details appear (if present in Excel)
5. ✅ Test switching between SA and ROA regions

---

## Need Help?

If you encounter issues, check:

1. **Console output** when running the script
2. **Browser console** for JavaScript errors
3. **JSON validity** (paste into [jsonlint.com](https://jsonlint.com))
4. **Excel column headers** match the expected format
5. **[Full troubleshooting guide](./scripts/README-SA-CONVERSION.md#troubleshooting)**

---

**That's it!** Your SA TV guide should now be working in Framer. 🎉

