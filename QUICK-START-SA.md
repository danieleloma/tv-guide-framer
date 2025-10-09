# 🚀 Quick Start: SA Region JSON

## ✅ Already Done

The SA JSON has been generated and is ready to use!

**File**: `/Users/danieleloma/tv-guide-framer/public/sa-region.json`  
**Shows**: 216 shows across 7 days (Mon Oct 6 - Sun Oct 12, 2025)  
**Format**: `RegionSchedule` compatible with TV Guide component

---

## 📋 Copy & Paste Into Framer

### Step 1: Copy the JSON

**Option A - Terminal** (macOS):
```bash
cat /Users/danieleloma/tv-guide-framer/public/sa-region.json | pbcopy
```

**Option B - File Explorer**:
1. Open `/Users/danieleloma/tv-guide-framer/public/sa-region.json`
2. Select all (Cmd+A)
3. Copy (Cmd+C)

### Step 2: Paste Into Framer

1. Open your Framer project
2. Select the **TV Guide** component
3. In the right panel, find the **`saJson`** property
4. Paste the JSON (Cmd+V)
5. ✅ Done!

---

## 🧪 Test It Works

### 1. Visual Check
- [ ] "South Africa" button appears in the header (left side)
- [ ] Clicking "South Africa" highlights the button
- [ ] Timezone shows only "CAT" (WAT is hidden)
- [ ] Grid shows 7 rows (Mon-Sun)

### 2. Show Cards
- [ ] Cards appear in the grid
- [ ] Show titles are visible
- [ ] Season & Episode appear (e.g., "S1 • Ep 283")
- [ ] Time range appears at bottom (e.g., "06:00 - 06:30")

### 3. Interactions
- [ ] Hover shows full title tooltip
- [ ] Cards span correct number of time slots
- [ ] Grid scrolls horizontally
- [ ] Day column stays fixed on scroll

### 4. Data Verification
- [ ] First show: "Ringside Rebel" at 06:00 on Monday
- [ ] Dates: Oct 6 (Mon) through Oct 12 (Sun), 2025
- [ ] Time range: 06:00 AM - 05:30 AM (next day)

---

## 🔄 Update Weekly

When you receive a new SA Excel file:

```bash
# Navigate to project
cd /Users/danieleloma/tv-guide-framer

# Run conversion (update the file path)
npx ts-node scripts/sa-excel-to-json.ts \
  --in "/Users/danieleloma/Downloads/NEW_SA_FILE.xlsx" \
  --out "public/sa-region.json"

# Copy to clipboard
cat public/sa-region.json | pbcopy

# Paste into Framer's saJson prop
```

---

## 📊 What's In The JSON

```json
{
  "region": "SA",
  "timezones": {
    "WAT": null,              ← SA doesn't use WAT
    "CAT": {                  ← Only CAT timezone
      "timezone": "CAT",
      "days": {
        "Mon": { ... },       ← 31 shows
        "Tue": { ... },       ← 31 shows
        "Wed": { ... },       ← 31 shows
        "Thu": { ... },       ← 31 shows
        "Fri": { ... },       ← 31 shows
        "Sat": { ... },       ← 28 shows
        "Sun": { ... }        ← 33 shows
      }
    }
  }
}
```

**Total**: 216 shows, 48 time slots per day (06:00-05:30)

---

## 🎨 Customize in Framer

After pasting the JSON, you can customize:

### Layout
- **Hour Width**: Adjust column width
- **Row Height**: Adjust row height
- **Corner Radius**: Round card corners
- **Grid Line Color**: Change divider color

### Typography
- **Font Family**: Choose from Google Fonts
- **Font Size**: Adjust text size
- **Font Weight**: Make text bold/light

### Colors
- **Page Background**: Overall background
- **Card Background**: Show card color
- **Card Text**: Text color
- **Header Background**: Top bar color
- **Active Button Background**: Selected button color

---

## ⚙️ Advanced: Auto-Select SA

If you want SA selected by default:

1. In Framer, select the component
2. Set **`region`** prop to `"SA"`
3. Set **`timezone`** prop to `"CAT"`
4. The component will load SA data on mount

---

## 🐛 Troubleshooting

### "South Africa button doesn't appear"

**Cause**: `saJson` prop is empty or invalid.

**Fix**:
1. Verify you pasted the entire JSON
2. Check for copy/paste truncation
3. Validate JSON at jsonlint.com
4. Re-paste from `public/sa-region.json`

### "No shows appear when clicking SA"

**Cause**: JSON structure doesn't match expected schema.

**Fix**:
1. Check browser console for errors
2. Verify JSON starts with `{ "region": "SA", ...`
3. Re-run the conversion script

### "Shows in wrong time slots"

**Cause**: Time window mismatch or incorrect time parsing.

**Fix**:
1. Verify component expects CAT window (06:00-06:00)
2. Check that times in JSON are "HH:MM" format (24-hour)
3. Re-run conversion with latest script

### "Episode details missing"

**Cause**: Excel missing Season or Episode values.

**Fix**: Episode details only show when **both** Season AND Episode are present in the Excel file. If one is missing, neither appears.

---

## 📁 File Location

**Generated JSON**: `/Users/danieleloma/tv-guide-framer/public/sa-region.json`

**View it**:
```bash
# Full content
cat /Users/danieleloma/tv-guide-framer/public/sa-region.json

# First 50 lines
head -50 /Users/danieleloma/tv-guide-framer/public/sa-region.json

# Statistics
wc -l /Users/danieleloma/tv-guide-framer/public/sa-region.json
du -h /Users/danieleloma/tv-guide-framer/public/sa-region.json
```

---

## ✨ Example Show Card

After pasting, each show will render like this:

```
┌─────────────────────────┐
│ Twist of Fate: New Era  │ ← Title (14px, bold)
│ S10 • Ep 78             │ ← Episode (12px, 85% opacity)
│ 06:30 - 07:30           │ ← Time (10px, 60% opacity)
└─────────────────────────┘
```

**Styling**:
- Dark background (#1a1a1a)
- White text (#ffffff)
- Rounded corners (8px)
- Hover effect (slight lift)
- Truncated titles (ellipsis)

---

## 🎯 Next Steps

1. ✅ Paste JSON into Framer → `saJson` prop
2. 🧪 Test SA region selection
3. 🎨 Customize colors/fonts to match brand
4. 📱 Preview on different screen sizes
5. 🚀 Publish or share with team

---

## 📞 Need Help?

- **Full docs**: See `scripts/SA-CONVERSION-README.md`
- **Summary**: See `SA-CONVERSION-SUMMARY.md`
- **Troubleshooting**: Check browser console for errors
- **Script**: `scripts/sa-excel-to-json.ts`

---

**Your SA region data is ready to use!** 🎉

Simply paste `public/sa-region.json` into Framer's `saJson` prop and you're good to go.

