# TV Guide Component Updates

## ✅ Changes Made

### 1. **Added EAT Timezone Support**
- **Type Update**: Added `"EAT"` to the `Tz` type
- **Window Configuration**: EAT uses the same time window as CAT (06:00-06:00)
- **Time Ticks**: EAT generates 48 slots from 06:00 to 05:30
- **Timezone Options**: EAT is now available for ROA region
- **Property Controls**: EAT added to timezone enum options

### 2. **Added General Channel JSON Input**
- **New Prop**: `generalJson: string` - Third JSON input field for general channel data
- **State Management**: Added `generalData` state variable
- **Data Parsing**: General JSON is parsed and stored separately
- **Fallback Logic**: General data is used as fallback when region-specific data is not available
- **Property Control**: New "General Channel JSON" input in Data section

### 3. **Added Header Visibility Toggle**
- **New Prop**: `showHeader?: boolean` - Controls header visibility
- **Default**: `true` (header visible by default)
- **Conditional Rendering**: Header with region/timezone buttons only renders when `showHeader !== false`
- **Property Control**: New "Show Header" toggle in User Controls section
- **Use Case**: Allows hiding header for channels without multiple regions/timezones

---

## 📝 Updated Type Definitions

### Timezone Type
```typescript
// Before
type Tz = "WAT" | "CAT";

// After
type Tz = "WAT" | "CAT" | "EAT";
```

### Props Interface
```typescript
interface TVGuideFinalProps {
  // Data
  dataSource: "static" | "remote";
  saJson: string;
  roaJson: string;
  generalJson: string;  // NEW
  
  // ... other props
  
  // User Controls
  showUserControls?: boolean;
  showHeader?: boolean;  // NEW
  onChangeRegion?: (region: Region) => void;
  onChangeTimezone?: (timezone: Tz) => void;
}
```

### Window Configuration
```typescript
interface TvGuideData {
  window: {
    WAT: { start: "05:00"; end: "04:00" };
    CAT: { start: "06:00"; end: "05:00" };
    EAT: { start: "06:00"; end: "05:00" };  // NEW
    slotMinutes: 30;
  };
  regions: Record<Region, RegionSchedule>;
}
```

---

## 🎯 Usage Examples

### Example 1: Channel with Multiple Regions
```tsx
<TVGuideFinal
  saJson={saData}
  roaJson={roaData}
  generalJson="{}"
  showHeader={true}
  region="ROA"
  timezone="WAT"
  // ... other props
/>
```

### Example 2: General Channel (No Regions)
```tsx
<TVGuideFinal
  saJson="{}"
  roaJson="{}"
  generalJson={channelData}
  showHeader={false}  // Hide header
  region="ROA"
  timezone="EAT"
  // ... other props
/>
```

### Example 3: EAT Timezone Usage
```tsx
<TVGuideFinal
  roaJson={eastAfricaData}
  timezone="EAT"
  showHeader={true}
  // ... other props
/>
```

---

## 🔧 Framer Property Controls

### Data Section
- **SA JSON Data** - South Africa region data
- **ROA JSON Data** - Rest of Africa region data
- **General Channel JSON** ← NEW - General channel data (no region)

### Toggles Section
- **Region** - SA | ROA
- **Timezone** - WAT | CAT | EAT ← EAT added

### User Controls Section
- **Show User Controls** - Show runtime toggles
- **Show Header** ← NEW - Show/hide header area

---

## 📊 Data Priority Logic

The component now uses this priority for data selection:

1. **Region-specific data first**:
   - If `region="SA"` and `saJson` has data → use SA data
   - If `region="ROA"` and `roaJson` has data → use ROA data

2. **Fallback to general data**:
   - If region-specific data is not available → use `generalJson` data

3. **Show "No Data" message**:
   - If all JSON inputs are empty

---

## 🕐 Timezone Window Details

| Timezone | Start Time | End Time (Next Day) | Total Slots | Label Range |
|----------|-----------|---------------------|-------------|-------------|
| WAT | 05:00 | 05:00 | 48 | 05:00 - 04:30 |
| CAT | 06:00 | 06:00 | 48 | 06:00 - 05:30 |
| EAT | 06:00 | 06:00 | 48 | 06:00 - 05:30 |

**Note**: EAT and CAT share the same time window configuration.

---

## ✅ Backward Compatibility

All changes are **fully backward compatible**:

- ✅ Existing props work unchanged
- ✅ `showHeader` defaults to `true` (header visible)
- ✅ `generalJson` defaults to `"{}"`
- ✅ No breaking changes to data structure
- ✅ Existing SA/ROA JSON inputs work as before

---

## 🎨 Visual Behavior

### With Header Visible (`showHeader={true}`)
```
┌─────────────────────────────────────────────┐
│ [South Africa] [Rest of Africa]  [WAT] [CAT] [EAT] │ ← Header
├─────────────────────────────────────────────┤
│                                             │
│           TV Guide Grid                     │
│                                             │
└─────────────────────────────────────────────┘
```

### With Header Hidden (`showHeader={false}`)
```
┌─────────────────────────────────────────────┐
│                                             │
│           TV Guide Grid                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🚀 Use Cases

### Use Case 1: Multi-Region Channel (e.g., Zee World)
- ✅ Use `saJson` for South Africa
- ✅ Use `roaJson` for Rest of Africa
- ✅ Set `showHeader={true}` to allow region switching
- ✅ Users can toggle between SA/ROA and WAT/CAT/EAT

### Use Case 2: Single Region Channel (e.g., Local Station)
- ✅ Use `generalJson` for channel data
- ✅ Set `showHeader={false}` to hide unnecessary toggles
- ✅ Set default `timezone="EAT"` if in East Africa
- ✅ Cleaner UI without region/timezone buttons

### Use Case 3: East Africa Focused Channel
- ✅ Use `roaJson` with EAT timezone data
- ✅ Set `timezone="EAT"` as default
- ✅ Set `showHeader={true}` if multiple timezones needed
- ✅ EAT appears as an option alongside WAT/CAT

---

## 🧪 Testing Checklist

- [ ] EAT timezone generates correct time slots (06:00-05:30)
- [ ] General JSON data loads and displays correctly
- [ ] Header hides when `showHeader={false}`
- [ ] Header shows when `showHeader={true}` or undefined
- [ ] EAT option appears in timezone dropdown
- [ ] General data is used when no region data available
- [ ] Region data takes priority over general data
- [ ] All existing functionality works unchanged
- [ ] Property controls appear correctly in Framer
- [ ] No console errors or warnings

---

## 📄 Files Modified

- **`components/TVGuideFinal.tsx`**
  - Added EAT timezone type
  - Added generalJson prop
  - Added showHeader prop
  - Updated timezone options
  - Updated data selection logic
  - Added conditional header rendering
  - Updated property controls

---

## 🔄 Migration Guide

### For Existing Implementations
No changes required! All existing code works as-is.

### To Use New Features

**Add EAT Timezone:**
```tsx
// Just select EAT from the timezone dropdown
timezone="EAT"
```

**Add General Channel Data:**
```tsx
generalJson={yourGeneralChannelData}
```

**Hide Header:**
```tsx
showHeader={false}
```

---

## 💡 Tips

1. **For channels without regions**: Set `showHeader={false}` and use `generalJson`
2. **For East African channels**: Use `timezone="EAT"` as default
3. **For multi-region channels**: Keep `showHeader={true}` and use `saJson`/`roaJson`
4. **Data structure**: General JSON follows the same `TvGuideData` schema as SA/ROA

---

**All updates completed successfully!** ✅

No breaking changes. All existing functionality preserved.




