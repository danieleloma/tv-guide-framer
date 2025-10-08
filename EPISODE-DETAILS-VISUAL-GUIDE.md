# Episode Details - Visual Guide

## 🎨 **How Episode Details Appear**

---

## 📺 **Card Layout Structure**

### **With Episode Details** (Season AND Episode present)
```
╔═══════════════════════════════════════════╗
║ ┌───────────────────────────────────────┐ ║
║ │ The Bold and the Beautiful            │ ║ ← Title (fontSize, bold)
║ └───────────────────────────────────────┘ ║
║                                           ║
║ ┌───────────────────────────────────────┐ ║
║ │ Season 35 • Episode 8740              │ ║ ← Episode (fontSize-2, 85% opacity)
║ └───────────────────────────────────────┘ ║
║                                           ║
║ ┌───────────────────────────────────────┐ ║
║ │ 9:00 AM–9:30 AM                       │ ║ ← Time (fontSize-3, 75% opacity)
║ └───────────────────────────────────────┘ ║
╚═══════════════════════════════════════════╝
```

### **Without Episode Details** (Missing Season OR Episode)
```
╔═══════════════════════════════════════════╗
║ ┌───────────────────────────────────────┐ ║
║ │ Morning News                          │ ║ ← Title (fontSize, bold)
║ └───────────────────────────────────────┘ ║
║                                           ║
║ ┌───────────────────────────────────────┐ ║
║ │ 5:00 AM–6:00 AM                       │ ║ ← Time (fontSize-3, 75% opacity)
║ └───────────────────────────────────────┘ ║
╚═══════════════════════════════════════════╝
```

---

## 🎯 **Real-World Examples**

### **Example 1: Drama Series with Episodes**
```
Excel Data:
Title: "The Bold and the Beautiful"
Season: "35"
Episode: "8740"
Start: 09:00
End: 09:30

↓

Card Display:
┌─────────────────────────────────────────┐
│ The Bold and the Beautiful              │ ← 14px, 600 weight
│ Season 35 • Episode 8740                │ ← 12px, 85% opacity
│ 9:00 AM–9:30 AM                         │ ← 11px, 75% opacity
└─────────────────────────────────────────┘
```

### **Example 2: News Program (No Episodes)**
```
Excel Data:
Title: "Morning News Bulletin"
Season: (empty)
Episode: (empty)
Start: 05:00
End: 06:00

↓

Card Display:
┌─────────────────────────────────────────┐
│ Morning News Bulletin                   │ ← 14px, 600 weight
│ 5:00 AM–6:00 AM                         │ ← 11px, 75% opacity
└─────────────────────────────────────────┘
```

### **Example 3: Movie (Only Season, No Episode)**
```
Excel Data:
Title: "Hollywood Movie"
Season: "2024"
Episode: (empty)
Start: 20:00
End: 22:00

↓

Card Display:
┌─────────────────────────────────────────┐
│ Hollywood Movie                         │ ← 14px, 600 weight
│ 8:00 PM–10:00 PM                        │ ← 11px, 75% opacity
└─────────────────────────────────────────┘
                                           ↑ No episode line (missing episode)
```

### **Example 4: Reality Show with Episodes**
```
Excel Data:
Title: "Survivor"
Season: "45"
Episode: "12"
Start: 19:00
End: 20:00

↓

Card Display:
┌─────────────────────────────────────────┐
│ Survivor                                │ ← 14px, 600 weight
│ Season 45 • Episode 12                  │ ← 12px, 85% opacity
│ 7:00 PM–8:00 PM                         │ ← 11px, 75% opacity
└─────────────────────────────────────────┘
```

---

## 📊 **Grid View with Mixed Content**

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ 05:00               │ 06:00               │ 07:00               │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ Morning Show        │ Breakfast Program   │ Drama Series        │
│ Season 5 • Ep 120   │ 6:00 AM–7:00 AM     │ Season 2 • Ep 10    │
│ 5:00 AM–6:00 AM     │                     │ 7:00 AM–8:00 AM     │
└─────────────────────┴─────────────────────┴─────────────────────┘
     ↑                      ↑                      ↑
  Has episodes        No episodes            Has episodes
```

---

## 🎨 **Styling Breakdown**

### **Typography Hierarchy**:
```css
Title Line:
  font-size: 14px (default fontSize)
  font-weight: 600
  opacity: 1.0
  line-height: 1.25
  margin-bottom: 6px

Episode Line:
  font-size: 12px (fontSize - 2)
  font-weight: 400 (normal)
  opacity: 0.85
  line-height: 1.2
  margin-bottom: 6px

Time Line:
  font-size: 11px (fontSize - 3)
  font-weight: 400 (normal)
  opacity: 0.75
  line-height: 1.2
```

### **Visual Weight Distribution**:
```
Title:   ████████████ (100% opacity, bold)
Episode: ██████████   (85% opacity, regular)
Time:    ████████     (75% opacity, regular)
```

---

## 🔍 **Hover States**

### **Default State**:
```
┌─────────────────────────────────────────┐
│ Show Title                              │
│ Season 1 • Episode 5                    │
│ 5:00 AM–6:00 AM                         │
└─────────────────────────────────────────┘
Background: #1a1a1a
Text: #ffffff
```

### **Hover State**:
```
┌─────────────────────────────────────────┐
│ Show Title                              │  ↑ Lifted shadow
│ Season 1 • Episode 5                    │  ↑ Slight elevation
│ 5:00 AM–6:00 AM                         │
└─────────────────────────────────────────┘
Background: #2a2a2a (lighter)
Text: #ffffff
Transform: translateY(-1px)
Shadow: 0 4px 12px rgba(0, 0, 0, 0.4)
```

### **Tooltip on Hover**:
```
╔═════════════════════════════════════════════════╗
║ Show Title • 5:00 AM–6:00 AM                    ║
╚═════════════════════════════════════════════════╝
        ↑
┌─────────────────────────────────────────┐
│ Show Title                              │
│ Season 1 • Episode 5                    │
│ 5:00 AM–6:00 AM                         │
└─────────────────────────────────────────┘
```

---

## 📱 **Responsive Behavior**

### **Wide Cells (cellWidth: 180px)**:
```
┌─────────────────────────────────────────────────┐
│ The Bold and the Beautiful                      │
│ Season 35 • Episode 8740                        │
│ 9:00 AM–9:30 AM                                 │
└─────────────────────────────────────────────────┘
        All text visible, no truncation
```

### **Narrow Cells (cellWidth: 80px)**:
```
┌─────────────────────┐
│ The Bold and the... │  ← Ellipsis on title
│ Season 35 • Epi...  │  ← Ellipsis on episode
│ 9:00 AM–9:30 AM     │
└─────────────────────┘
     Text overflow handled gracefully
```

---

## 🎯 **Accessibility**

### **ARIA Label**:
```html
<div aria-label="Episode detail">
  Season 35 • Episode 8740
</div>
```

### **Screen Reader Output**:
```
"The Bold and the Beautiful"
"Episode detail: Season 35, Episode 8740"
"9:00 AM to 9:30 AM"
```

---

## 📋 **Excel to Display Mapping**

| Excel Season | Excel Episode | Display Result                    |
|--------------|---------------|-----------------------------------|
| `1`          | `5`           | "Season 1 • Episode 5"            |
| `35`         | `8740`        | "Season 35 • Episode 8740"        |
| `2`          | `10`          | "Season 2 • Episode 10"           |
| `(empty)`    | `5`           | *(no episode line)*               |
| `1`          | `(empty)`     | *(no episode line)*               |
| `(empty)`    | `(empty)`     | *(no episode line)*               |
| `""`         | `5`           | *(no episode line)*               |
| `1`          | `""`          | *(no episode line)*               |

**Key Rule**: Episode line appears **ONLY** when **BOTH** Season **AND** Episode have values.

---

## 🎉 **Production Examples**

### **Morning Block**:
```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 05:00                │ 06:00                │ 07:00                │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ Early News           │ Morning Show         │ Breakfast TV         │
│ 5:00 AM–6:00 AM      │ Season 10 • Ep 45    │ 7:00 AM–8:00 AM      │
│                      │ 6:00 AM–7:00 AM      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

### **Prime Time Block**:
```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 19:00                │ 20:00                │ 21:00                │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ Evening News         │ Drama Series         │ Late Night Show      │
│ 7:00 PM–8:00 PM      │ Season 5 • Ep 23     │ Season 15 • Ep 200   │
│                      │ 8:00 PM–9:00 PM      │ 9:00 PM–10:00 PM     │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

### **Late Night Block**:
```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 23:00                │ 00:00                │ 01:00                │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ Talk Show            │ Late Movie           │ Overnight News       │
│ Season 8 • Ep 142    │ 12:00 AM–2:00 AM     │ 1:00 AM–2:00 AM      │
│ 11:00 PM–12:00 AM    │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

---

## ✅ **Quality Checklist**

- ✅ **Title always visible** (first line)
- ✅ **Episode line conditional** (only when both fields exist)
- ✅ **Time always visible** (last line)
- ✅ **No blank lines** (episode line omitted when missing data)
- ✅ **Proper hierarchy** (title → episode → time)
- ✅ **Text overflow handled** (ellipsis for long content)
- ✅ **Accessibility** (ARIA labels for screen readers)
- ✅ **Hover effects** (visual feedback on interaction)
- ✅ **Consistent spacing** (6px margins between lines)

---

**🎨 The episode details are beautifully integrated into the TV Guide design!**
