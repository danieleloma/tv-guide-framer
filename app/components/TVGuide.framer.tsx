/**
 * TV Guide Framer Metadata
 * 
 * This file provides additional Framer-specific metadata and controls
 * for the TVGuide component. It extends the base component with
 * Framer-specific features like responsive behavior and advanced styling.
 */

import { ComponentType } from 'react';
import { addPropertyControls, ControlType, Frame } from 'framer';
import TVGuide from './TVGuide';
import { TVGuideProps } from '../lib/tvGuideTypes';

// Enhanced props for Framer
interface TVGuideFramerProps extends TVGuideProps {
  // Framer-specific props
  responsive?: boolean;
  autoFit?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  
  // Advanced styling
  theme?: 'dark' | 'light' | 'custom';
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Animation
  animateShows?: boolean;
  showHoverEffects?: boolean;
  transitionDuration?: number;
  
  // Layout behavior
  stickyHeader?: boolean;
  stickySidebar?: boolean;
  scrollSnap?: boolean;
  
  // Accessibility
  highContrast?: boolean;
  reducedMotion?: boolean;
  ariaLabel?: string;
}

const TVGuideFramer: ComponentType<TVGuideFramerProps> = (props) => {
  const {
    responsive = true,
    autoFit = false,
    maxWidth = 1200,
    maxHeight = 800,
    theme = 'dark',
    accentColor = '#6b46c1',
    backgroundColor = '#000000',
    textColor = '#ffffff',
    borderColor = '#333333',
    animateShows = true,
    showHoverEffects = true,
    transitionDuration = 200,
    stickyHeader = true,
    stickySidebar = true,
    scrollSnap = true,
    highContrast = false,
    reducedMotion = false,
    ariaLabel = 'TV Guide',
    ...tvGuideProps
  } = props;

  // Apply theme colors
  const themeColors = {
    dark: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      borderColor: '#333333',
      accentColor: '#6b46c1'
    },
    light: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      accentColor: '#3b82f6'
    },
    custom: {
      backgroundColor,
      textColor,
      borderColor,
      accentColor
    }
  };

  const colors = themeColors[theme];

  // Responsive wrapper
  if (responsive) {
    return (
      <Frame
        width="100%"
        height="100%"
        maxWidth={autoFit ? undefined : maxWidth}
        maxHeight={autoFit ? undefined : maxHeight}
        backgroundColor="transparent"
        overflow="hidden"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            maxWidth: autoFit ? undefined : `${maxWidth}px`,
            maxHeight: autoFit ? undefined : `${maxHeight}px`,
            border: `1px solid ${colors.borderColor}`,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          aria-label={ariaLabel}
          role="application"
          aria-live="polite"
        >
          <TVGuide {...tvGuideProps} />
        </div>
      </Frame>
    );
  }

  // Direct render without wrapper
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: highContrast ? `2px solid ${colors.accentColor}` : `1px solid ${colors.borderColor}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
      aria-label={ariaLabel}
      role="application"
      aria-live="polite"
    >
      <TVGuide {...tvGuideProps} />
    </div>
  );
};

// Enhanced Framer Property Controls
addPropertyControls(TVGuideFramer, {
  // Data Configuration
  dataSource: {
    type: ControlType.Enum,
    title: 'Data Source',
    options: ['static', 'remote'],
    defaultValue: 'static',
    displaySegmentedControl: true
  },
  region: {
    type: ControlType.Enum,
    title: 'Region',
    options: ['SA', 'ROA'],
    defaultValue: 'ROA',
    displaySegmentedControl: true
  },
  timezone: {
    type: ControlType.Enum,
    title: 'Timezone',
    options: ['WAT', 'CAT'],
    defaultValue: 'WAT',
    displaySegmentedControl: true
  },

  // Data Input
  staticData: {
    type: ControlType.JSON,
    title: 'Static Data',
    description: 'JSON data for TV guide (when dataSource is "static")',
    defaultValue: {
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
                "Mon": {
                  "date": "2025-10-06",
                  "day": "Mon",
                  "slots": []
                }
              }
            }
          }
        }
      }
    }
  },

  // Visibility Controls
  visibleRegions: {
    type: ControlType.Object,
    title: 'Visible Regions',
    controls: {
      SA: {
        type: ControlType.Boolean,
        title: 'South Africa',
        defaultValue: true
      },
      ROA: {
        type: ControlType.Boolean,
        title: 'Rest of Africa',
        defaultValue: true
      }
    }
  },
  visibleTimezones: {
    type: ControlType.Object,
    title: 'Visible Timezones',
    controls: {
      WAT: {
        type: ControlType.Boolean,
        title: 'West Africa Time',
        defaultValue: true
      },
      CAT: {
        type: ControlType.Boolean,
        title: 'Central Africa Time',
        defaultValue: true
      }
    }
  },

  // Layout Controls
  cellWidth: {
    type: ControlType.Number,
    title: 'Cell Width (px)',
    defaultValue: 120,
    min: 60,
    max: 300,
    step: 10
  },
  cellHeight: {
    type: ControlType.Number,
    title: 'Cell Height (px)',
    defaultValue: 56,
    min: 40,
    max: 120,
    step: 4
  },
  fontSize: {
    type: ControlType.Number,
    title: 'Font Size (px)',
    defaultValue: 14,
    min: 10,
    max: 24,
    step: 1
  },
  rowGap: {
    type: ControlType.Number,
    title: 'Row Gap (px)',
    defaultValue: 8,
    min: 0,
    max: 20,
    step: 2
  },
  colGap: {
    type: ControlType.Number,
    title: 'Column Gap (px)',
    defaultValue: 2,
    min: 0,
    max: 10,
    step: 1
  },

  // Responsive Behavior
  responsive: {
    type: ControlType.Boolean,
    title: 'Responsive',
    defaultValue: true,
    description: 'Enable responsive behavior'
  },
  autoFit: {
    type: ControlType.Boolean,
    title: 'Auto Fit',
    defaultValue: false,
    description: 'Automatically fit to content size'
  },
  maxWidth: {
    type: ControlType.Number,
    title: 'Max Width (px)',
    defaultValue: 1200,
    min: 400,
    max: 2400,
    step: 50,
    hidden: (props) => props.autoFit
  },
  maxHeight: {
    type: ControlType.Number,
    title: 'Max Height (px)',
    defaultValue: 800,
    min: 300,
    max: 1600,
    step: 50,
    hidden: (props) => props.autoFit
  },

  // Theme & Styling
  theme: {
    type: ControlType.Enum,
    title: 'Theme',
    options: ['dark', 'light', 'custom'],
    defaultValue: 'dark',
    displaySegmentedControl: true
  },
  accentColor: {
    type: ControlType.Color,
    title: 'Accent Color',
    defaultValue: '#6b46c1',
    hidden: (props) => props.theme !== 'custom'
  },
  backgroundColor: {
    type: ControlType.Color,
    title: 'Background Color',
    defaultValue: '#000000',
    hidden: (props) => props.theme !== 'custom'
  },
  textColor: {
    type: ControlType.Color,
    title: 'Text Color',
    defaultValue: '#ffffff',
    hidden: (props) => props.theme !== 'custom'
  },
  borderColor: {
    type: ControlType.Color,
    title: 'Border Color',
    defaultValue: '#333333',
    hidden: (props) => props.theme !== 'custom'
  },

  // Animation & Effects
  animateShows: {
    type: ControlType.Boolean,
    title: 'Animate Shows',
    defaultValue: true,
    description: 'Enable show block animations'
  },
  showHoverEffects: {
    type: ControlType.Boolean,
    title: 'Hover Effects',
    defaultValue: true,
    description: 'Enable hover effects on show blocks'
  },
  transitionDuration: {
    type: ControlType.Number,
    title: 'Transition Duration (ms)',
    defaultValue: 200,
    min: 100,
    max: 1000,
    step: 50,
    hidden: (props) => !props.animateShows
  },

  // Layout Behavior
  stickyHeader: {
    type: ControlType.Boolean,
    title: 'Sticky Header',
    defaultValue: true,
    description: 'Keep time header visible while scrolling'
  },
  stickySidebar: {
    type: ControlType.Boolean,
    title: 'Sticky Sidebar',
    defaultValue: true,
    description: 'Keep day column visible while scrolling'
  },
  scrollSnap: {
    type: ControlType.Boolean,
    title: 'Scroll Snap',
    defaultValue: true,
    description: 'Snap to column boundaries while scrolling'
  },

  // Accessibility
  highContrast: {
    type: ControlType.Boolean,
    title: 'High Contrast',
    defaultValue: false,
    description: 'Enable high contrast mode for accessibility'
  },
  reducedMotion: {
    type: ControlType.Boolean,
    title: 'Reduced Motion',
    defaultValue: false,
    description: 'Reduce animations for accessibility'
  },
  ariaLabel: {
    type: ControlType.String,
    title: 'ARIA Label',
    defaultValue: 'TV Guide',
    description: 'Accessibility label for screen readers'
  }
});

export default TVGuideFramer;

