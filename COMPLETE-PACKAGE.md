# 📦 Complete TV Guide Package for Framer

## 🎯 **Everything You Need**

---

## 📄 **1. Framer Component Code**

### **File Location**:
```
/Users/danieleloma/tv-guide-framer/components/TVGuideFinal.tsx
```

### **File Size**: 31KB (1,011 lines)

### **Features**:
- ✅ **Google Fonts Integration** (10 fonts: Inter, Roboto, DM Sans, Poppins, Lato, Space Grotesk, Open Sans, Nunito Sans, Work Sans, Montserrat)
- ✅ **Episode Details** (Season & Episode display between title and time)
- ✅ **Runtime Region/Timezone Switching** (Left: SA/ROA, Right: WAT/CAT)
- ✅ **Terminal Label Removed** (WAT ends at 04:30, CAT ends at 05:30)
- ✅ **Smart Availability** (SA hidden until data exists, auto-forces CAT)
- ✅ **Comprehensive Theming** (16 color controls + layout controls)
- ✅ **Accessibility** (Focus states, ARIA labels, keyboard navigation)
- ✅ **Sticky Headers** (Day column and time row stay visible)
- ✅ **Horizontal Scrolling** with responsive grid

### **How to Copy**:

**Option 1: From Terminal**
```bash
cat /Users/danieleloma/tv-guide-framer/components/TVGuideFinal.tsx
```

**Option 2: From Finder**
1. Navigate to: `/Users/danieleloma/tv-guide-framer/components/`
2. Open `TVGuideFinal.tsx`
3. Select All (Cmd+A)
4. Copy (Cmd+C)

**Option 3: Direct Read**
The complete component code was shared earlier (1,011 lines starting with the imports and ending with `addPropertyControls`)

---

## 📊 **2. JSON Data Files**

### **ROA Data (Main Data)**

**File Location**:
```
/Users/danieleloma/tv-guide-framer/public/tv-guide.json
```

**File Size**: 169KB (~6,250 lines)

**Contains**:
- ✅ **307 total shows**
- ✅ **ROA WAT**: 169 shows (Monday-Sunday)
- ✅ **ROA CAT**: 138 shows (Monday-Sunday)
- ✅ **SA CAT**: Empty slots (ready for data)
- ✅ **30-minute time slots**
- ✅ **24-hour windows** (WAT: 05:00-05:00, CAT: 06:00-06:00)

**Data Structure**:
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
        "CAT": { /* SA CAT data */ }
      }
    },
    "ROA": {
      "region": "ROA",
      "timezones": {
        "WAT": { /* 169 shows */ },
        "CAT": { /* 138 shows */ }
      }
    }
  }
}
```

**How to Copy**:
```bash
cat /Users/danieleloma/tv-guide-framer/public/tv-guide.json
```

### **SA Sample Data (Optional)**

**File Location**:
```
/Users/danieleloma/tv-guide-framer/public/sa-guide-sample.json
```

**File Size**: 17KB (~636 lines)

**Contains**: Sample SA data for testing the SA region toggle

**How to Copy**:
```bash
cat /Users/danieleloma/tv-guide-framer/public/sa-guide-sample.json
```

---

## 🚀 **3. How to Use in Framer**

### **Step 1: Add the Component**

1. **Open Framer**
2. Go to **Assets** → **Code**
3. Click **"+ New Code File"**
4. Name it `TVGuideFinal`
5. **Paste the entire component code** (1,011 lines)
6. Save

### **Step 2: Add the Component to Canvas**

1. Find `TVGuideFinal` in your **Components** panel
2. **Drag it onto your canvas**
3. Resize to desired size (recommended: full screen)

### **Step 3: Configure Data**

In the **Properties Panel**, you'll see grouped controls:

#### **📊 Data Section**
```
Data Source: static
SA JSON Data: [Text Area] ← Optional (for SA region)
ROA JSON Data: [Text Area] ← PASTE tv-guide.json here
```

**To add ROA data**:
1. Open `/Users/danieleloma/tv-guide-framer/public/tv-guide.json`
2. Select All (Cmd+A)
3. Copy (Cmd+C)
4. Paste into **"ROA JSON Data"** field in Framer

#### **🎛️ Toggles Section**
```
Region: ROA
Timezone: WAT
```

#### **📐 Layout Section**
```
Cell Width: 120
Cell Height: 56
Border Radius: 4
Row Gap: 8
Column Gap: 2
```

#### **🎨 Typography Section (Google Fonts)**
```
Font Family: Inter (or choose from 10 options)
Font Size: 14
Font Weight: 400
```

#### **🎨 Colors Section** (16 controls)
```
Text Color: #ffffff
Page Background: #000000
Grid Background: #111111
Day Header Background: #111111
Day Header Text: #ffffff
Time Header Background: #1a1a1a
Time Header Text: #ffffff
Card Background: #1a1a1a
Card Text: #ffffff
Card Border: #333333
Card Hover Background: #2a2a2a
Card Hover Text: #ffffff
Card Focus Ring: #6b46c1
Divider Color: #333333
```

#### **🎛️ User Controls Section**
```
Show User Controls: true
```

### **Step 4: Test Runtime Controls**

Once configured, users can:
- **Click "Rest of Africa"** to switch to ROA region
- **Click "WAT" or "CAT"** to switch timezones
- **Scroll horizontally** to see all time slots
- **Hover over shows** to see tooltips
- **View episode details** (when available)

---

## 📋 **4. Quick Copy Commands**

### **Copy Component Code to Clipboard** (macOS):
```bash
cat /Users/danieleloma/tv-guide-framer/components/TVGuideFinal.tsx | pbcopy
```

### **Copy ROA JSON Data to Clipboard** (macOS):
```bash
cat /Users/danieleloma/tv-guide-framer/public/tv-guide.json | pbcopy
```

### **Copy SA Sample Data to Clipboard** (macOS):
```bash
cat /Users/danieleloma/tv-guide-framer/public/sa-guide-sample.json | pbcopy
```

### **View File Locations**:
```bash
ls -lh /Users/danieleloma/tv-guide-framer/components/TVGuideFinal.tsx
ls -lh /Users/danieleloma/tv-guide-framer/public/tv-guide.json
ls -lh /Users/danieleloma/tv-guide-framer/public/sa-guide-sample.json
```

---

## 🎨 **5. Component Features Overview**

### **Header Layout**
```
┌─────────────────────────────────────────────────────────┐
│  [South Africa] [Rest of Africa]    [WAT] [CAT]         │ ← Segmented buttons
└─────────────────────────────────────────────────────────┘
      ↑ Left: Region                    ↑ Right: Timezone
```

### **Grid Layout**
```
┌────────┬───────────────────────────────────────────────┐
│  CAT   │ 06:00 │ 06:30 │ 07:00 │ ... │ 05:00 │ 05:30 │ ← Time header (no terminal)
├────────┼───────────────────────────────────────────────┤
│ Mon    │       Show Block 1        │  Show Block 2   │
│ Oct 6  │ Title                     │  Title          │
│        │ Season 1 • Episode 5      │  8:00-9:00 AM   │ ← Episode line (conditional)
│        │ 7:00 AM–8:00 AM           │                 │
├────────┼───────────────────────────────────────────────┤
│ Tue    │                                              │
│ Oct 7  │  [Shows...]                                  │
├────────┼───────────────────────────────────────────────┤
│  ...   │                                              │
└────────┴───────────────────────────────────────────────┘
  ↑              ↑
Sticky Day   Horizontal Scroll →
```

### **Show Card Structure**
```
With Episodes:               Without Episodes:
┌─────────────────────┐     ┌─────────────────────┐
│ Show Title          │     │ Show Title          │
│ Season 1 • Ep 5     │     │ 5:00 AM–6:00 AM     │
│ 5:00 AM–6:00 AM     │     └─────────────────────┘
└─────────────────────┘
```

---

## 📊 **6. Data Statistics**

### **Current tv-guide.json**:
- **Total Shows**: 307
- **ROA WAT**: 169 shows
- **ROA CAT**: 138 shows
- **SA CAT**: 0 shows (empty, ready for data)
- **Days**: 7 (Monday to Sunday)
- **Time Slots**: 48 per day (30-minute intervals)
- **Windows**: 
  - WAT: 05:00 → 04:30 (visible header ends at 04:30)
  - CAT: 06:00 → 05:30 (visible header ends at 05:30)

---

## 🔧 **7. Customization Options**

### **Change Colors** (Live Preview):
```typescript
// Dark Theme (default)
pageBg: '#000000'
cardBg: '#1a1a1a'
textColor: '#ffffff'

// Light Theme (example)
pageBg: '#ffffff'
cardBg: '#f5f5f5'
textColor: '#000000'

// Custom Theme (example)
pageBg: '#1e1e2e'
cardBg: '#313244'
textColor: '#cdd6f4'
```

### **Change Google Font**:
```
Font Family Dropdown:
- Inter (default, modern)
- Roboto (Google's signature)
- DM Sans (geometric)
- Poppins (rounded)
- Lato (humanist)
- Space Grotesk (futuristic)
- Open Sans (web-optimized)
- Nunito Sans (friendly)
- Work Sans (professional)
- Montserrat (elegant)
```

### **Adjust Layout**:
```
Cell Width: 60-300px (default: 120)
Cell Height: 40-120px (default: 56)
Border Radius: 0-20px (default: 4)
Font Size: 10-24px (default: 14)
```

---

## 📁 **8. File Structure**

```
tv-guide-framer/
├── components/
│   └── TVGuideFinal.tsx (31KB) ← FRAMER COMPONENT
├── public/
│   ├── tv-guide.json (169KB) ← ROA DATA (307 shows)
│   └── sa-guide-sample.json (17KB) ← SA SAMPLE DATA
├── scripts/
│   └── excel-to-json-simple.ts ← Excel converter
└── README files (documentation)
```

---

## ✅ **9. Final Checklist**

Before using in Framer, ensure you have:

- [ ] **Component Code** copied (1,011 lines from TVGuideFinal.tsx)
- [ ] **ROA JSON Data** copied (from tv-guide.json)
- [ ] **Created Code Component** in Framer
- [ ] **Pasted component code** into Framer
- [ ] **Added component to canvas**
- [ ] **Pasted JSON data** into "ROA JSON Data" field
- [ ] **Configured initial region/timezone** (ROA/WAT recommended)
- [ ] **Tested runtime controls** (region/timezone switching)
- [ ] **Verified show cards** display correctly
- [ ] **Checked episode details** appear (when available)

---

## 🎉 **You're Ready!**

Everything you need is in these locations:

**Component**: `/Users/danieleloma/tv-guide-framer/components/TVGuideFinal.tsx`
**Data**: `/Users/danieleloma/tv-guide-framer/public/tv-guide.json`

Copy both into Framer and you'll have a fully functional, production-ready TV Guide with:
- ✅ 307 shows across 7 days
- ✅ Google Fonts
- ✅ Episode details
- ✅ Runtime switching
- ✅ Beautiful theming
- ✅ Perfect accessibility

**Happy building! 🚀**
