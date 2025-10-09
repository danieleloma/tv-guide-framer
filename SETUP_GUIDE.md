# TV Guide System Setup Guide

## 🎉 Conversion Complete!

Your Excel files have been successfully converted to JSON format:

- **SA Data**: `public/sa-guide-converted.json` (570 slots, 7 days)
- **ROA Data**: `public/roa-guide-converted.json` (454 slots, 7 days)

## 📋 Next Steps for Framer

### 1. Copy the Component
Copy the entire content of `components/TVGuideFinal.tsx` into Framer as a new Code Component.

### 2. Add Your Data
1. Open `public/sa-guide-converted.json` and copy all the content
2. In Framer, paste it into the **"SA Data JSON"** field
3. Open `public/roa-guide-converted.json` and copy all the content  
4. In Framer, paste it into the **"ROA Data JSON"** field

### 3. Customize (Optional)
Use the Framer controls to customize:
- **Layout**: Hour width, row height, corner radius, spacing
- **Typography**: Font family, title size, subtitle size, time size, day size
- **Colors**: Page background, card background, text colors, active states
- **Behavior**: Region switching, timezone switching, current day highlighting

## 🎯 How It Works

### Time Structures
- **SA (CAT)**: 6:00 AM - 5:30 AM next day, 30-minute intervals
- **ROA WAT**: 5:00 AM - 4:00 AM next day, 30-minute intervals
- **ROA CAT**: 6:00 AM - 5:00 AM next day, 30-minute intervals

### Region Behavior
- **SA Region**: Only shows CAT timezone (no timezone switcher)
- **ROA Region**: Shows WAT and CAT timezone switcher
- **Week Starting**: Automatically starts from Monday of current week
- **Current Day**: Highlights the current day automatically

### Horizontal Scrolling
- **Sticky Elements**: Day column and time header stay visible while scrolling
- **Smooth Scrolling**: Horizontal scroll with proper time positioning
- **Responsive**: Adjusts to different screen sizes

## 🔧 Technical Details

### Data Format
The JSON follows this structure:
```json
{
  "metadata": {
    "channelId": "zee-world-sa",
    "generatedAt": "2025-10-07T13:07:47.339Z",
    "defaultRegion": "SA",
    "defaultTimezone": "CAT"
  },
  "regions": [
    {
      "code": "SA",
      "label": "South Africa", 
      "timezones": ["CAT"],
      "days": [
        {
          "dateISO": "2025-10-06",
          "slots": [
            {
              "startISO": "2025-10-06T04:00:00.000Z",
              "endISO": "2025-10-06T16:00:00.000Z",
              "title": "Ringside Rebel S1 EP 278",
              "durationMin": 30
            }
          ]
        }
      ]
    }
  ]
}
```

### Time Conversion
- All times are stored in UTC ISO format
- Component automatically converts to local timezone for display
- Handles cross-midnight slots properly
- 30-minute intervals for all shows

## 🚀 Ready to Use!

Your TV Guide component is now ready for Framer. The system will automatically:
- Handle region switching between SA and ROA
- Show appropriate timezone controls
- Position shows correctly based on time
- Highlight the current day
- Provide smooth horizontal scrolling

## 📞 Support

If you need to update the data:
1. Run the conversion script again with new Excel files
2. Copy the new JSON data into Framer
3. The component will automatically update

The system is designed to be flexible and can handle different Excel formats with minor script adjustments.
