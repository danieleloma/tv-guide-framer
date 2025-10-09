# Selected States - Visual Guide

## 🎨 **Before & After Comparison**

---

## 📊 **BEFORE: No Visual Distinction**

### **Problem**:
Users couldn't easily tell which region or timezone was active. All buttons looked similar.

```
Header (Old):
┌───────────────────────────────────────────────────────────────┐
│  [ South Africa ]  [ Rest of Africa ]       [ WAT ]  [ CAT ]  │
└───────────────────────────────────────────────────────────────┘
     ↑ Which one is active? Hard to tell!
```

---

## ✨ **AFTER: Clear Visual Indicators**

### **Solution**:
Active buttons now have distinct styling with background, shadow, and border changes.

```
Header (New):
┌───────────────────────────────────────────────────────────────┐
│  [ South Africa ]  ╔═══════════════════╗       ╔═════╗  [CAT] │
│                    ║ Rest of Africa    ║       ║ WAT ║        │
│                    ╚═══════════════════╝       ╚═════╝        │
└───────────────────────────────────────────────────────────────┘
         ↑                    ↑                       ↑
    Inactive             Active ROA              Active WAT
```

---

## 🎯 **Button States Detailed**

### **1. Inactive State**
```
┌─────────────────────┐
│   South Africa      │
└─────────────────────┘

Properties:
• Background: transparent
• Border: 1px solid #333333 (dividerColor)
• Text: #ffffff (textColor)
• Shadow: none
```

### **2. Active State**
```
╔═════════════════════╗
║   South Africa      ║
╚═════════════════════╝
    ↑ Purple ring

Properties:
• Background: #1a1a1a (cardBg)
• Border: none
• Text: #ffffff (cardText)
• Shadow: 0 0 0 1px rgba(107, 70, 193, 0.35)
```

### **3. Hover State (Inactive)**
```
┌─────────────────────┐
│   South Africa      │ ← Subtle highlight
└─────────────────────┘

Properties:
• Background: rgba(255, 255, 255, 0.06)
• Border: 1px solid #333333
• Text: #ffffff
• Transition: 0.15s ease
```

### **4. Focus State (Keyboard)**
```
╔═════════════════════╗
║   South Africa      ║
╚═════════════════════╝
    ↑ Focus ring

Properties:
• Outline: 2px solid #6b46c1 (cardFocusRing)
• Outline offset: 2px
• Box shadow: 0 0 0 2px rgba(107, 70, 193, 0.45)
```

---

## 🔄 **State Transitions**

### **Scenario 1: Switching Regions**

#### **Initial: ROA Active**
```
┌─────────────────────────────────────────────────────────────┐
│  [ South Africa ]  ╔═══════════════════╗      [ WAT ] [CAT] │
│                    ║ Rest of Africa    ║                    │
│                    ╚═══════════════════╝                    │
└─────────────────────────────────────────────────────────────┘
```

#### **User Clicks "South Africa"**
```
          ↓ Click
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════╗  [ Rest of Africa ]           ╔═════╗    │
│  ║ South Africa  ║                                ║ CAT ║    │
│  ╚═══════════════╝                                ╚═════╝    │
└─────────────────────────────────────────────────────────────┘
     ↑ Now active                                  ↑ Auto-forced
```

**Changes**:
1. ✅ SA button → Active state (highlighted)
2. ✅ ROA button → Inactive state (normal)
3. ✅ CAT button → Auto-forced active
4. ✅ WAT button → Hidden (SA doesn't support WAT)

---

### **Scenario 2: Switching Timezones**

#### **Initial: WAT Active**
```
┌─────────────────────────────────────────────────────────────┐
│  [ SA ]  ╔═════╗                         ╔═════╗  [ CAT ]   │
│          ║ ROA ║                         ║ WAT ║            │
│          ╚═════╝                         ╚═════╝            │
└─────────────────────────────────────────────────────────────┘
```

#### **User Clicks "CAT"**
```
          ↓ Click
┌─────────────────────────────────────────────────────────────┐
│  [ SA ]  ╔═════╗                         [ WAT ]  ╔═════╗   │
│          ║ ROA ║                                  ║ CAT ║   │
│          ╚═════╝                                  ╚═════╝   │
└─────────────────────────────────────────────────────────────┘
                                                       ↑ Now active
```

**Changes**:
1. ✅ CAT button → Active state (highlighted)
2. ✅ WAT button → Inactive state (normal)
3. ✅ ROA remains active (no change)

---

## 📱 **Responsive Behavior**

### **Desktop View** (Wide):
```
┌───────────────────────────────────────────────────────────────────────┐
│  [ South Africa ]  ╔══════════════════╗    ╔═════╗  [ CAT ]          │
│                    ║ Rest of Africa   ║    ║ WAT ║                   │
│                    ╚══════════════════╝    ╚═════╝                   │
└───────────────────────────────────────────────────────────────────────┘
   ↑ Left-aligned              ↑ Right-aligned
```

### **Tablet/Mobile View** (Narrow):
```
┌─────────────────────────────────────────────┐
│ [SA] ╔═════╗      ╔═════╗ [CAT]            │
│      ║ ROA ║      ║ WAT ║                  │
│      ╚═════╝      ╚═════╝                  │
└─────────────────────────────────────────────┘
  ↑ Shorter labels, same active states
```

---

## 🎨 **Color Variations**

### **Default Theme** (Dark):
```
Active Button:
╔═════════════════════╗
║   Rest of Africa    ║
╚═════════════════════╝

Background: #1a1a1a (dark gray)
Text: #ffffff (white)
Shadow: rgba(107, 70, 193, 0.35) (purple)
```

### **Custom Theme** (Light - Example):
```
Active Button:
╔═════════════════════╗
║   Rest of Africa    ║
╚═════════════════════╝

Background: #e0e7ff (light purple)
Text: #312e81 (dark purple)
Shadow: rgba(79, 70, 229, 0.35) (indigo)
```

**To Customize**: Change **Card Background** and **Card Text** colors in Framer properties panel.

---

## 🔍 **Interactive States Matrix**

| Button State | Background | Border | Text Color | Shadow | Cursor |
|--------------|------------|--------|------------|--------|--------|
| **Inactive** | transparent | 1px #333333 | #ffffff | none | pointer |
| **Active** | #1a1a1a | none | #ffffff | 0 0 0 1px purple | pointer |
| **Hover (Inactive)** | rgba(255,255,255,0.06) | 1px #333333 | #ffffff | none | pointer |
| **Focus** | (current) | (current) | (current) | 0 0 0 2px purple | pointer |
| **Disabled** | transparent | 1px #333333 | #ffffff | none | not-allowed |

---

## 🎯 **Real-World Examples**

### **Example 1: TV Guide for Rest of Africa (WAT)**
```
╔══════════════════════════════════════════════════════════════╗
║  Header                                                      ║
╠══════════════════════════════════════════════════════════════╣
║  [ South Africa ]  ╔════════════════╗    ╔═══╗  [ CAT ]     ║
║                    ║ Rest of Africa ║    ║WAT║              ║
║                    ╚════════════════╝    ╚═══╝              ║
╠══════════════════════════════════════════════════════════════╣
║  Days/Times Grid                                             ║
║  Monday - Sunday with WAT timezone shows                     ║
╚══════════════════════════════════════════════════════════════╝
```

### **Example 2: TV Guide for South Africa (CAT)**
```
╔══════════════════════════════════════════════════════════════╗
║  Header                                                      ║
╠══════════════════════════════════════════════════════════════╣
║  ╔═══════════════╗  [ Rest of Africa ]        ╔═══╗         ║
║  ║ South Africa  ║                            ║CAT║         ║
║  ╚═══════════════╝                            ╚═══╝         ║
╠══════════════════════════════════════════════════════════════╣
║  Days/Times Grid                                             ║
║  Monday - Sunday with CAT timezone shows only                ║
╚══════════════════════════════════════════════════════════════╝
   ↑ WAT not available for SA
```

---

## 🎬 **Animation Flow**

### **Button Click Animation** (150ms):

```
Frame 1 (0ms):
[ Button ]  ← Inactive state

Frame 2 (50ms):
┌──────────┐
│  Button  │ ← Transition begins
└──────────┘

Frame 3 (100ms):
╔══════════╗
║  Button  ║ ← Background fills
╚══════════╝

Frame 4 (150ms):
╔══════════╗
║  Button  ║ ← Active state complete
╚══════════╝    with shadow
```

### **Prop Change Animation** (Instant):

```
Designer changes Region prop in Framer
         ↓
Component re-renders (< 16ms)
         ↓
New active state appears immediately
```

---

## 🧪 **Testing Scenarios**

### **Test 1: Click ROA Button**
```
BEFORE:
[ SA ]  [ ROA ]       [ WAT ]  [ CAT ]

AFTER:
[ SA ]  ╔═════╗       [ WAT ]  [ CAT ]
        ║ ROA ║
        ╚═════╝

✅ ROA highlighted
✅ SA not highlighted
```

### **Test 2: Click SA Button**
```
BEFORE:
[ SA ]  ╔═════╗       ╔═════╗  [ CAT ]
        ║ ROA ║       ║ WAT ║
        ╚═════╝       ╚═════╝

AFTER:
╔════╗  [ ROA ]              ╔═════╗
║ SA ║                       ║ CAT ║
╚════╝                       ╚═════╝

✅ SA highlighted
✅ ROA not highlighted
✅ CAT auto-forced
✅ WAT hidden
```

### **Test 3: Designer Changes Timezone Prop**
```
Designer sets timezone="CAT" in Framer panel
         ↓
RESULT:
[ SA ]  ╔═════╗       [ WAT ]  ╔═════╗
        ║ ROA ║                ║ CAT ║
        ╚═════╝                ╚═════╝

✅ CAT highlighted immediately
✅ WAT not highlighted
```

---

## ♿ **Accessibility Features**

### **Screen Reader Announcements**:

**When clicking ROA button**:
```
"Rest of Africa, tab, selected"
```

**When clicking WAT button**:
```
"WAT, tab, selected"
```

**When navigating with keyboard**:
```
Tab → Focus moves to next button
Shift+Tab → Focus moves to previous button
Enter/Space → Activates focused button
```

### **ARIA Attributes**:
```html
<button
  role="tab"               ← Indicates tab control
  aria-selected="true"     ← Announces selection state
  data-active="true"       ← Visual styling hook
>
  Rest of Africa
</button>
```

---

## 🎯 **Summary**

### **Visual Improvements**:
- ✅ **Clear active state** with background fill
- ✅ **Subtle purple ring** for emphasis
- ✅ **Smooth transitions** (150ms ease)
- ✅ **Focus indicators** for keyboard users
- ✅ **Hover effects** for better UX

### **Accessibility Improvements**:
- ✅ **ARIA attributes** for screen readers
- ✅ **Keyboard navigation** support
- ✅ **Focus-visible** styles
- ✅ **Role and selection** announcements

### **Functionality**:
- ✅ **Syncs with props** (designer changes)
- ✅ **Updates on clicks** (user interaction)
- ✅ **Respects availability** rules
- ✅ **No breaking changes** to existing features

---

**🎨 The selected states feature makes the TV Guide interface more intuitive and accessible!**




