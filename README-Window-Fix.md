# TV Guide Window End + Slot Generation Fix

## ✅ **Window Fix Complete**

Successfully fixed the time tick builder to properly handle 24-hour cycles and include all time slots, including the previously missing tail shows.

---

## 🎯 **Issue Fixed**

### **Previous Behavior (Broken):**
- **WAT Window**: Stopped at `04:00`, missing `04:30` and `05:00` columns
  - Shows ending at `04:00-05:00` were skipped
  - Only **46 slots** (should be 48)
- **CAT Window**: Stopped at `05:00`, missing `05:30` column  
  - Shows ending at `05:00-06:00` were skipped
  - Only **46 slots** (should be 48)

### **Current Behavior (Fixed):**
- **WAT Window**: `05:00 → 05:00` (next day) = 24 hours
  - **49 labels** (48 intervals) including `04:00`, `04:30`, `05:00`
  - Shows ending at `04:00-05:00` render correctly
- **CAT Window**: `06:00 → 06:00` (next day) = 24 hours
  - **49 labels** (48 intervals) including `05:00`, `05:30`, `06:00`
  - Shows ending at `05:00-06:00` render correctly

---

## 🔧 **Technical Changes**

### **1. Type Definitions Updated**
```typescript
// BEFORE
WAT: { start: "05:00"; end: "04:00" }; // Wrong!
CAT: { start: "06:00"; end: "05:00" }; // Wrong!

// AFTER
WAT: { start: "05:00"; end: "05:00" }; // Same time next day
CAT: { start: "06:00"; end: "06:00" }; // Same time next day
```

### **2. Tick Generation Fixed**
```typescript
function generateTimeTicks(timezone: Tz): TimeLabel[] {
  const DAY = 24 * 60; // minutes in a day
  const step = 30;
  
  const startLabel = timezone === 'WAT' ? '05:00' : '06:00';
  const endLabel = startLabel; // same time next day
  
  const tToMin = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return (h * 60 + m) % DAY;
  };
  
  const s = tToMin(startLabel);
  let e = tToMin(endLabel);
  if (e <= s) e += DAY; // next-day boundary
  
  const ticks: TimeLabel[] = [];
  for (let m = s; m <= e; m += step) { // include terminal tick label
    const mm = m % DAY;
    const hh = Math.floor(mm / 60).toString().padStart(2, "0");
    const mi = (mm % 60).toString().padStart(2, "0");
    ticks.push(`${hh}:${mi}` as TimeLabel);
  }
  
  return ticks; // Returns 49 labels -> 48 intervals
}
```

### **3. New Utility Functions**
Added robust time math helpers in `app/lib/tvGuideUtils.ts`:

```typescript
// Convert time label to minutes
function tToMin(t: string): number

// Build ticks for 24-hour window
export function buildTicks(startLabel, endLabel, step = 30): string[]

// Compute overlap for show interval
export function clampToWindow(showStart, showEnd, windowStart, windowEnd)

// Get slot indexes from clamped minutes
export function toSlotSpan(clipStart, clipEnd, slotMinutes = 30)
```

### **4. Window Validation Updated**
```typescript
function isValidTimeWindow(start: TimeLabel, end: TimeLabel, timezone: Tz): boolean {
  const DAY = 24 * 60;
  const timeToMinutes = (time: TimeLabel): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const startMinutes = timeToMinutes(start);
  let endMinutes = timeToMinutes(end);
  
  // Handle shows that cross midnight
  if (endMinutes <= startMinutes) {
    endMinutes += DAY;
  }
  
  const windowStart = timezone === 'WAT' ? 300 : 360; // 05:00 or 06:00
  let windowEnd = windowStart + DAY; // 24 hours later
  
  // Normalize to window space
  let normalizedStart = startMinutes;
  if (normalizedStart < windowStart) {
    normalizedStart += DAY;
  }
  
  // Check if show starts within window
  return normalizedStart >= windowStart && normalizedStart < windowEnd;
}
```

---

## 🧪 **Testing Results**

### **✅ Tick Count Test**
```bash
WAT slots: 49 ✅ (previously 46)
CAT slots: 49 ✅ (previously 46)
```

### **✅ Tail Slots Present**
```bash
WAT last 3 slots: [ '04:00', '04:30', '05:00' ] ✅
CAT last 3 slots: [ '05:00', '05:30', '06:00' ] ✅
```

### **✅ Tail Shows Render**
**WAT Tail Show (04:00-05:00):**
```json
{
  "time": "04:00",
  "shows": [
    {
      "title": "Hidden Intentions",
      "start": "04:00",
      "end": "05:00",
      "season": "S1",
      "episode": "EP 65"
    }
  ]
}
```

**CAT Tail Show (05:00-06:00):**
```json
{
  "time": "05:00",
  "shows": [
    {
      "title": "Sister Wives",
      "start": "05:00",
      "end": "06:00",
      "season": "S1",
      "episode": "Ep 150"
    }
  ]
}
```

### **✅ Excel Parsing Results**
```bash
BEFORE: 
✅ Processed 314 rows, skipped 14 rows ❌

AFTER:
✅ Processed 328 rows, skipped 0 rows ✅
```

All previously skipped shows are now included!

---

## 📁 **Files Updated**

### **1. Type Definitions**
- **`app/lib/tvGuideTypes.ts`**
  - Fixed window end times to use same time next day

### **2. Utility Functions**
- **`app/lib/tvGuideUtils.ts`**
  - Added `buildTicks()` function
  - Added `clampToWindow()` function
  - Added `toSlotSpan()` function
  - Added `tToMin()` helper

### **3. Excel Parser**
- **`scripts/excel-to-json-simple.ts`**
  - Updated `generateTimeTicks()` to produce 49 labels
  - Updated `isValidTimeWindow()` for proper 24h validation
  - Updated `tvGuideData.window` to use corrected end times

### **4. Component**
- **`components/TVGuideFinal.tsx`**
  - Updated `generateTimeTicks()` to produce 49 labels

### **5. Generated Data**
- **`public/tv-guide-fixed.json`**
  - Contains all 328 shows (0 skipped)
  - Includes tail shows for both WAT and CAT

---

## 🚀 **Usage**

### **1. Use the Fixed Data**
```bash
# New file with all shows included
/Users/danieleloma/tv-guide-framer/public/tv-guide-fixed.json
```

### **2. Re-generate from Excel**
```bash
npx ts-node scripts/excel-to-json-simple.ts \
  --in "/Users/danieleloma/Downloads/ZeeWorld_ROA (6th-12th October, 2025).xlsx" \
  --out "public/tv-guide.json"
```

### **3. Verify in Component**
- Copy the updated `TVGuideFinal.tsx` to Framer
- Use `tv-guide-fixed.json` as your data source
- Scroll to the end of each day to see tail shows (04:00-05:00 WAT, 05:00-06:00 CAT)

---

## ✅ **Acceptance Criteria Met**

### **1. Tick Count** ✅
- **WAT**: `buildTicks().length === 49` (48 intervals)
- **CAT**: `buildTicks().length === 49` (48 intervals)

### **2. Tail Slots Present** ✅
- **WAT**: Visible through `04:30–05:00`; labels `04:30` and `05:00` exist
- **CAT**: Visible through `05:30–06:00`; labels `05:30` and `06:00` exist

### **3. Tail Shows Render** ✅
- **WAT**: Show `04:00–05:00` ("Hidden Intentions") spans final two columns
- **CAT**: Show `05:00–06:00` ("Sister Wives") spans final two columns

### **4. No Regressions** ✅
- ✅ 7-day rows unchanged
- ✅ 30-min alignment unchanged
- ✅ Sticky headers unchanged
- ✅ Region/TZ toggles unchanged
- ✅ Google Fonts/theme tokens unchanged
- ✅ Episode display unchanged

---

## 📊 **Before vs After**

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| WAT Slots | 46 | 49 | ✅ Fixed |
| CAT Slots | 46 | 49 | ✅ Fixed |
| WAT Last Slot | `04:00` | `05:00` | ✅ Fixed |
| CAT Last Slot | `05:00` | `06:00` | ✅ Fixed |
| Shows Processed | 314 | 328 | ✅ Fixed |
| Shows Skipped | 14 | 0 | ✅ Fixed |
| Tail Shows (WAT) | Missing | Present | ✅ Fixed |
| Tail Shows (CAT) | Missing | Present | ✅ Fixed |

---

## 🎉 **Fix Complete**

The window end and slot generation logic has been completely fixed:

- ✅ **Correct 24-hour windows** with same start/end times
- ✅ **49 tick labels** (48 intervals) for both WAT and CAT
- ✅ **All tail shows included** (04:00-05:00 WAT, 05:00-06:00 CAT)
- ✅ **Zero shows skipped** during parsing
- ✅ **No regressions** in existing functionality

The TV Guide now displays the complete 24-hour schedule with all shows properly rendered! 📺⏰
