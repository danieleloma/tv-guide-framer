# Troubleshooting Selected States

## 🔍 **Common Issues & Fixes**

---

## ✅ **Fixes Applied**

### **Issue 1: Infinite Loop in useEffect**
**Problem**: Using `activeRegion` and `activeTimezone` in dependency arrays caused unnecessary re-renders.

**Fixed**:
```typescript
// BEFORE (could cause loops):
useEffect(() => {
  if (props.region !== activeRegion) {
    setActiveRegion(props.region);
  }
}, [props.region, activeRegion]); // ❌ activeRegion causes loop

// AFTER (clean):
useEffect(() => {
  setActiveRegion(props.region);
}, [props.region]); // ✅ Only props.region
```

### **Issue 2: Props Object in Dependencies**
**Problem**: Using entire `props` object in dependency array triggers on every prop change.

**Fixed**:
```typescript
// BEFORE (too broad):
useEffect(() => {
  if (activeRegion === "SA" && !saAvailable && roaAvailable) {
    setActiveRegion("ROA");
    props.onChangeRegion?.("ROA");
  }
}, [activeRegion, saAvailable, roaAvailable, props]); // ❌ Entire props object

// AFTER (specific):
useEffect(() => {
  if (activeRegion === "SA" && !saAvailable && roaAvailable) {
    setActiveRegion("ROA");
    props.onChangeRegion?.("ROA");
  }
}, [activeRegion, saAvailable, roaAvailable, props.onChangeRegion]); // ✅ Specific callback
```

---

## 🐛 **What to Check**

### **1. Are the buttons showing at all?**

**Expected**: You should see region and timezone buttons in the header.

**If not visible**:
- ✅ Check that JSON data is loaded
- ✅ Check `saAvailable` and `roaAvailable` in console
- ✅ Verify `showUserControls` prop is not set to `false`

### **2. Are the active states showing?**

**Expected**: Active buttons should have:
- Dark background (`cardBg`)
- Purple shadow ring
- No border

**If not showing**:
- ✅ Check browser console for errors
- ✅ Verify `activeRegion` and `activeTimezone` state values
- ✅ Check that `cardBg` and `cardText` props have valid colors

### **3. Do buttons respond to clicks?**

**Expected**: Clicking a button should:
- Highlight that button
- De-highlight other buttons in the group
- Update the grid data

**If not responding**:
- ✅ Check browser console for JavaScript errors
- ✅ Verify onClick handlers are firing (add console.log)
- ✅ Check that data exists for the selected region/timezone

### **4. Do selections sync with Framer props?**

**Expected**: Changing Region or Timezone in Framer properties should update button highlights.

**If not syncing**:
- ✅ Check that props are actually changing in Framer
- ✅ Verify useEffect hooks are running (add console.log)
- ✅ Check React DevTools to see state updates

---

## 🔬 **Debugging Steps**

### **Step 1: Add Console Logs**

Add these logs to the component to track state:

```typescript
// After state declarations
console.log('🔵 Active Region:', activeRegion);
console.log('🔵 Active Timezone:', activeTimezone);
console.log('🔵 Props Region:', props.region);
console.log('🔵 Props Timezone:', props.timezone);
console.log('🔵 SA Available:', saAvailable);
console.log('🔵 ROA Available:', roaAvailable);
```

### **Step 2: Check Button Rendering**

Verify buttons are rendering with correct attributes:

```typescript
// In region button
console.log('🟢 SA Button - Active:', activeRegion === 'SA');
console.log('🟢 SA Button - Available:', saAvailable);

// In timezone button
console.log('🟡 WAT Button - Active:', activeTimezone === 'WAT');
console.log('🟡 CAT Button - Active:', activeTimezone === 'CAT');
```

### **Step 3: Check Click Handlers**

Verify clicks are firing:

```typescript
onClick={() => {
  console.log('🔴 Clicked ROA button');
  setActiveRegion('ROA');
  props.onChangeRegion?.('ROA');
}}
```

### **Step 4: Inspect Styles**

Check computed styles in browser DevTools:
1. Open DevTools (F12)
2. Select a button element
3. Check computed styles:
   - `background-color` should be `#1a1a1a` when active
   - `border` should be `none` when active
   - `box-shadow` should show purple ring when active

---

## 🎯 **Expected Behavior**

### **Scenario 1: Initial Load**
```
Props: region="ROA", timezone="WAT"
         ↓
State: activeRegion="ROA", activeTimezone="WAT"
         ↓
Buttons:
  - SA: Inactive (if available)
  - ROA: Active ✓
  - WAT: Active ✓
  - CAT: Inactive
```

### **Scenario 2: Click SA Button**
```
User clicks "South Africa"
         ↓
onClick fires → setActiveRegion("SA")
         ↓
useEffect detects SA → setActiveTimezone("CAT")
         ↓
State: activeRegion="SA", activeTimezone="CAT"
         ↓
Buttons:
  - SA: Active ✓
  - ROA: Inactive
  - WAT: Hidden (SA doesn't support WAT)
  - CAT: Active ✓
```

### **Scenario 3: Designer Changes Props**
```
Designer sets timezone="CAT" in Framer
         ↓
useEffect([props.timezone]) fires
         ↓
setActiveTimezone("CAT")
         ↓
State: activeTimezone="CAT"
         ↓
Buttons:
  - WAT: Inactive
  - CAT: Active ✓
```

---

## 🚨 **Known Issues & Workarounds**

### **Issue: Buttons Not Highlighting**

**Symptoms**:
- Buttons render but don't show active state
- All buttons look the same

**Possible Causes**:
1. CSS not applied
2. Theme colors not set
3. State not updating

**Fix**:
```typescript
// Check if styles are being applied
const buttonStyle = {
  backgroundColor: activeRegion === 'ROA' ? props.cardBg : 'transparent',
  // Add fallback
  backgroundColor: activeRegion === 'ROA' 
    ? (props.cardBg || '#1a1a1a') 
    : 'transparent',
};
```

### **Issue: Infinite Re-renders**

**Symptoms**:
- Console shows rapid repeated logs
- Browser becomes slow/unresponsive
- "Maximum update depth exceeded" error

**Possible Causes**:
1. Dependency array issues in useEffect
2. Props changing on every render

**Fix**: ✅ Already fixed in latest version

### **Issue: Props Not Syncing**

**Symptoms**:
- Changing props in Framer doesn't update button highlights
- Buttons show wrong selection

**Possible Causes**:
1. useEffect not running
2. Props not actually changing
3. State not updating

**Fix**:
```typescript
// Ensure clean dependency array
useEffect(() => {
  setActiveRegion(props.region);
}, [props.region]); // Only props.region, nothing else
```

---

## 🔧 **Manual Testing Checklist**

### **Visual Tests**:
- [ ] Inactive buttons have transparent background
- [ ] Active buttons have dark background
- [ ] Active buttons have purple shadow ring
- [ ] Active buttons have no border
- [ ] Hover shows subtle highlight on inactive buttons
- [ ] Focus shows purple outline (keyboard navigation)

### **Interaction Tests**:
- [ ] Clicking ROA highlights ROA
- [ ] Clicking SA highlights SA and forces CAT
- [ ] Clicking WAT highlights WAT (when ROA active)
- [ ] Clicking CAT highlights CAT
- [ ] Only one region button active at a time
- [ ] Only one timezone button active at a time

### **Props Sync Tests**:
- [ ] Changing Region prop updates highlights
- [ ] Changing Timezone prop updates highlights
- [ ] Changes happen immediately (no delay)
- [ ] No console errors during prop changes

### **Availability Tests**:
- [ ] SA button hidden when no SA data
- [ ] SA button visible when SA data exists
- [ ] WAT hidden when SA active
- [ ] Both WAT/CAT visible when ROA active

---

## 📊 **State Inspection**

### **Using React DevTools**:
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Find `TVGuideFinal` component
4. Check hooks:
   - `State: activeRegion` should match selected region
   - `State: activeTimezone` should match selected timezone
5. Watch values update when clicking buttons

### **Browser Console**:
```javascript
// Check active region
console.log(document.querySelector('[data-active="true"]'));

// Check ARIA selected
console.log(document.querySelector('[aria-selected="true"]'));

// Check computed styles
const btn = document.querySelector('[data-active="true"]');
console.log(window.getComputedStyle(btn).backgroundColor);
```

---

## 💡 **Quick Fixes**

### **If buttons don't highlight**:
```typescript
// Add fallback colors
backgroundColor: activeRegion === 'ROA' 
  ? (props.cardBg || '#1a1a1a') 
  : 'transparent'
```

### **If clicks don't work**:
```typescript
// Add pointer-events
style={{ pointerEvents: 'auto', ...otherStyles }}
```

### **If props don't sync**:
```typescript
// Force re-render with key
<button key={`region-${props.region}`} ...>
```

---

## 📞 **What Information to Provide**

If the issue persists, please provide:

1. **Browser Console Output**:
   - Any errors (red text)
   - State values (from console.logs)

2. **Behavior Description**:
   - What you expect to happen
   - What actually happens
   - When it happens (on load, on click, on prop change)

3. **Screenshots** (if possible):
   - Button appearance
   - Browser DevTools showing computed styles
   - React DevTools showing component state

4. **Environment**:
   - Browser (Chrome, Firefox, Safari, etc.)
   - Framer version
   - Any console errors

---

## ✅ **Verification**

The implementation should work if:
1. ✅ useEffect dependencies are correct (fixed)
2. ✅ State updates on prop changes (fixed)
3. ✅ Click handlers update state
4. ✅ Styles reflect state
5. ✅ No infinite loops (fixed)

**All fixes have been applied to the component!**

If you're still experiencing issues, please describe specifically what's not working (e.g., "buttons don't highlight when clicked", "SA button doesn't force CAT", etc.) and I'll help debug further.





