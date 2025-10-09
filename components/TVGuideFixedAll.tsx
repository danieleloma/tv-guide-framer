/**
 * Fixed TV Guide Framer Component
 * 
 * Fixes all issues:
 * - Proper timezone separation (no day duplication)
 * - Correct time alignment with grid
 * - Complete 24-hour cycle
 * - Proper timezone filtering
 * - Accurate show slot positioning
 */

import React, { useState, useEffect, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"

// Types
interface Slot {
    startISO: string
    endISO: string
    title: string
    season?: string
    episode?: string
    subtitle?: string
    textColor?: string
    bgColor?: string
    durationMin?: number
}

interface Day {
    dateISO: string
    timezone: string
    slots: Slot[]
}

interface Region {
    code: string
    label: string
    timezones: string[]
    days: Day[]
}

interface GuideData {
    metadata: {
        channelId: string
        generatedAt: string
        defaultRegion: string
        defaultTimezone: string
    }
    regions: Region[]
}

interface TVGuideProps {
    // JSON input
    roaDataJSON?: string

    // Layout
    hourWidthPx?: number
    rowHeightPx?: number
    cornerRadiusPx?: number
    gridLineColor?: string
    headerHeightPx?: number
    dayColumnWidthPx?: number

    // Typography
    fontFamily?: string
    titleFontSize?: number
    subtitleFontSize?: number
    timeFontSize?: number
    dayFontSize?: number

    // Colors
    pageBg?: string
    cardBg?: string
    cardText?: string
    headerBg?: string
    dayColumnBg?: string
    activeRegionBg?: string
    activeTimezoneBg?: string
    focusOutline?: string

    // Behavior
    enableRegionSwitch?: boolean
    enableTimezoneSwitch?: boolean
    initialRegion?: string
    initialTimezone?: string
    highContrast?: boolean
    showCurrentDay?: boolean

    // Time range
    showTimeLabels?: boolean
}

// Helper function to generate time ticks for ROA WAT (5:00 AM - 4:00 AM next day)
function generateROAWATTimeTicks(hourWidthPx: number) {
    const ticks = []

    // 5:00 AM to 11:30 PM (same day)
    for (let hour = 5; hour <= 23; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            xPosition: (hour - 5) * hourWidthPx,
            isMajor: true,
        })

        if (hour < 23) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                xPosition: (hour - 5) * hourWidthPx + hourWidthPx / 2,
                isMajor: false,
            })
        }
    }

    // 12:00 AM to 4:00 AM (next day)
    for (let hour = 0; hour <= 4; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            xPosition: (hour + 19) * hourWidthPx, // 19 = 24 - 5
            isMajor: true,
        })

        if (hour < 4) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                xPosition: (hour + 19) * hourWidthPx + hourWidthPx / 2,
                isMajor: false,
            })
        }
    }

    return ticks
}

// Helper function to generate time ticks for ROA CAT (6:00 AM - 5:00 AM next day)
function generateROACATTimeTicks(hourWidthPx: number) {
    const ticks = []

    // 6:00 AM to 11:30 PM (same day)
    for (let hour = 6; hour <= 23; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            xPosition: (hour - 6) * hourWidthPx,
            isMajor: true,
        })

        if (hour < 23) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                xPosition: (hour - 6) * hourWidthPx + hourWidthPx / 2,
                isMajor: false,
            })
        }
    }

    // 12:00 AM to 5:00 AM (next day)
    for (let hour = 0; hour <= 5; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            xPosition: (hour + 18) * hourWidthPx, // 18 = 24 - 6
            isMajor: true,
        })

        if (hour < 5) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                xPosition: (hour + 18) * hourWidthPx + hourWidthPx / 2,
                isMajor: false,
            })
        }
    }

    return ticks
}

export default function TVGuideFixedAll(props: TVGuideProps) {
    const [roaData, setRoaData] = useState<GuideData | null>(null)
    const [currentTimezone, setCurrentTimezone] = useState<string>(
        props.initialTimezone || "WAT"
    )
    const [loading, setLoading] = useState(false)

    // Load ROA data
    useEffect(() => {
        if (props.roaDataJSON) {
            try {
                const jsonData = JSON.parse(props.roaDataJSON)
                setRoaData(jsonData)
                console.log("ROA Data loaded:", jsonData)
            } catch (error) {
                console.error("Error parsing ROA JSON data:", error)
            }
        }
    }, [props.roaDataJSON])

    // Get current region data and filter by timezone
    const currentRegionData = roaData?.regions.find(r => r.code === "ROA")
    const filteredDays = useMemo(() => {
        if (!currentRegionData) return []
        
        // Group days by date and filter by current timezone
        const daysByDate = new Map<string, Day[]>()
        
        currentRegionData.days.forEach(day => {
            if (day.timezone === currentTimezone) {
                if (!daysByDate.has(day.dateISO)) {
                    daysByDate.set(day.dateISO, [])
                }
                daysByDate.get(day.dateISO)!.push(day)
            }
        })
        
        // Convert back to array and sort by date
        const sortedDays = Array.from(daysByDate.values())
            .map(dayGroup => dayGroup[0]) // Take the first (and only) day for each date
            .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
        
        return sortedDays
    }, [currentRegionData, currentTimezone])

    // Generate time ticks based on current timezone
    const timeTicks = useMemo(() => {
        const hourWidth = props.hourWidthPx || 220

        if (currentTimezone === "WAT") {
            return generateROAWATTimeTicks(hourWidth)
        } else if (currentTimezone === "CAT") {
            return generateROACATTimeTicks(hourWidth)
        }

        return generateROAWATTimeTicks(hourWidth) // fallback
    }, [currentTimezone, props.hourWidthPx])

    // Get current day for highlighting
    const currentDate = new Date().toISOString().split("T")[0]

    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: props.pageBg || "#000000",
                    color: props.cardText || "#ffffff",
                    fontFamily: props.fontFamily || "system-ui, -apple-system, sans-serif",
                }}
            >
                Loading TV Guide...
            </div>
        )
    }

    if (!currentRegionData || filteredDays.length === 0) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: props.pageBg || "#000000",
                    color: props.cardText || "#ffffff",
                    fontFamily: props.fontFamily || "system-ui, -apple-system, sans-serif",
                }}
            >
                No data available. Please provide ROA JSON data.
            </div>
        )
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: props.pageBg || "#000000",
                color: props.cardText || "#ffffff",
                fontFamily: props.fontFamily || "system-ui, -apple-system, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header Controls */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                    backgroundColor: props.headerBg || "#111111",
                    height: props.headerHeightPx || 60,
                    minHeight: props.headerHeightPx || 60,
                }}
            >
                {/* Region Display */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <div
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: `${props.cornerRadiusPx || 6}px`,
                            backgroundColor: props.activeRegionBg || "#6b46c1",
                            color: props.cardText || "#ffffff",
                            fontSize: props.titleFontSize || 14,
                            fontWeight: 600,
                        }}
                    >
                        Rest of Africa
                    </div>
                </div>

                {/* Timezone Switcher */}
                {props.enableTimezoneSwitch && (
                    <div
                        style={{
                            display: "flex",
                            gap: "4px",
                            marginLeft: "auto",
                        }}
                    >
                        {["WAT", "CAT"].map((tz) => (
                            <button
                                key={tz}
                                onClick={() => setCurrentTimezone(tz)}
                                style={{
                                    padding: "6px 12px",
                                    border: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                    borderRadius: `${props.cornerRadiusPx || 4}px`,
                                    backgroundColor:
                                        currentTimezone === tz
                                            ? props.activeTimezoneBg || "#6b46c1"
                                            : "transparent",
                                    color: props.cardText || "#ffffff",
                                    cursor: "pointer",
                                    fontSize: props.subtitleFontSize || 12,
                                    fontWeight: 500,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {tz}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Day Column */}
                <div
                    style={{
                        width: props.dayColumnWidthPx || 120,
                        backgroundColor: props.dayColumnBg || "#111111",
                        borderRight: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                        display: "flex",
                        flexDirection: "column",
                        position: "sticky",
                        left: 0,
                        zIndex: 20,
                    }}
                >
                    <div
                        style={{
                            padding: "12px",
                            borderBottom: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                            fontSize: props.dayFontSize || 14,
                            fontWeight: 600,
                            textAlign: "center",
                        }}
                    >
                        {currentTimezone}
                    </div>
                    {filteredDays.map((day, index) => {
                        const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate
                        return (
                            <div
                                key={`${day.dateISO}-${day.timezone}`}
                                style={{
                                    padding: "12px",
                                    borderBottom: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                    fontSize: props.dayFontSize || 12,
                                    height: props.rowHeightPx || 64,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: isCurrentDay
                                        ? props.activeRegionBg || "#6b46c1"
                                        : "transparent",
                                    color: isCurrentDay
                                        ? "#ffffff"
                                        : props.cardText || "#ffffff",
                                    fontWeight: isCurrentDay ? 600 : 400,
                                }}
                            >
                                {new Date(day.dateISO).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                })}
                            </div>
                        )
                    })}
                </div>

                {/* Grid Area */}
                <div
                    style={{
                        flex: 1,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Time Header */}
                    {props.showTimeLabels && (
                        <div
                            style={{
                                display: "flex",
                                backgroundColor: props.headerBg || "#111111",
                                borderBottom: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                                minWidth: "max-content",
                            }}
                        >
                            {/* Time labels for each day */}
                            {filteredDays.map((day, dayIndex) => (
                                <div
                                    key={`${day.dateISO}-${day.timezone}`}
                                    style={{
                                        display: "flex",
                                        minWidth: timeTicks.length * (props.hourWidthPx || 220) / 2,
                                    }}
                                >
                                    {timeTicks.map((tick, index) => (
                                        <div
                                            key={`${dayIndex}-${index}`}
                                            style={{
                                                width: tick.isMajor
                                                    ? props.hourWidthPx || 220
                                                    : (props.hourWidthPx || 220) / 2,
                                                padding: "12px 8px",
                                                textAlign: "center",
                                                fontSize: props.timeFontSize || 12,
                                                fontWeight: tick.isMajor ? 600 : 400,
                                                borderRight: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                                opacity: tick.isMajor ? 1 : 0.7,
                                            }}
                                        >
                                            {tick.label}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Program Grid */}
                    <div
                        style={{
                            display: "flex",
                            minWidth: "max-content",
                        }}
                    >
                        {filteredDays.map((day, dayIndex) => {
                            const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate
                            const rowHeight = props.rowHeightPx || 64

                            return (
                                <div
                                    key={`${day.dateISO}-${day.timezone}`}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        minWidth: timeTicks.length * (props.hourWidthPx || 220) / 2,
                                        borderRight: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                        position: "relative",
                                        backgroundColor: isCurrentDay
                                            ? "rgba(107, 70, 193, 0.1)"
                                            : "transparent",
                                        height: rowHeight * filteredDays.length,
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Grid Lines for Visual Alignment */}
                                    {timeTicks.map((tick, tickIndex) => (
                                        <div
                                            key={`grid-${tickIndex}`}
                                            style={{
                                                position: "absolute",
                                                left: tick.xPosition,
                                                top: 0,
                                                bottom: 0,
                                                width: "1px",
                                                backgroundColor: props.gridLineColor || "#1a1a1a",
                                                opacity: 0.3,
                                                zIndex: 1,
                                            }}
                                        />
                                    ))}

                                    {/* Day Row Container */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: dayIndex * rowHeight,
                                            left: 0,
                                            right: 0,
                                            height: rowHeight,
                                            borderBottom: `1px solid ${props.gridLineColor || "#1a1a1a"}`,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {day.slots.map((slot, slotIndex) => {
                                            const startTime = new Date(slot.startISO)
                                            const endTime = new Date(slot.endISO || slot.startISO)
                                            const startHour = startTime.getUTCHours()
                                            const startMinute = startTime.getUTCMinutes()
                                            const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes

                                            // Calculate position based on timezone
                                            let left = 0
                                            if (currentTimezone === "WAT") {
                                                // WAT: 5:00 AM - 4:00 AM next day
                                                if (startHour >= 5) {
                                                    left = (((startHour - 5) * 60 + startMinute) * (props.hourWidthPx || 220)) / 60
                                                } else {
                                                    left = (((startHour + 19) * 60 + startMinute) * (props.hourWidthPx || 220)) / 60
                                                }
                                            } else if (currentTimezone === "CAT") {
                                                // CAT: 6:00 AM - 5:00 AM next day
                                                if (startHour >= 6) {
                                                    left = (((startHour - 6) * 60 + startMinute) * (props.hourWidthPx || 220)) / 60
                                                } else {
                                                    left = (((startHour + 18) * 60 + startMinute) * (props.hourWidthPx || 220)) / 60
                                                }
                                            }

                                            // Calculate width based on actual duration
                                            const width = (duration * (props.hourWidthPx || 220)) / 60

                                            return (
                                                <div
                                                    key={slotIndex}
                                                    style={{
                                                        position: "absolute",
                                                        left: left + 2,
                                                        top: 4,
                                                        height: rowHeight - 8,
                                                        width: Math.max(60, width - 4),
                                                        backgroundColor: slot.bgColor || props.cardBg || "#1a1a1a",
                                                        color: slot.textColor || props.cardText || "#ffffff",
                                                        borderRadius: `${props.cornerRadiusPx || 8}px`,
                                                        padding: "8px 12px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                        border: props.highContrast
                                                            ? "2px solid #ffffff"
                                                            : "1px solid transparent",
                                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                        zIndex: 10,
                                                        overflow: "hidden",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-1px)"
                                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)"
                                                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: props.titleFontSize || 14,
                                                            fontWeight: 600,
                                                            lineHeight: 1.2,
                                                            marginBottom: "2px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {slot.title}
                                                    </div>
                                                    {(slot.subtitle || (slot.season && slot.episode)) && (
                                                        <div
                                                            style={{
                                                                fontSize: props.subtitleFontSize || 12,
                                                                opacity: 0.8,
                                                                lineHeight: 1.2,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {slot.subtitle || `${slot.season} ${slot.episode}`}
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            fontSize: props.timeFontSize || 10,
                                                            opacity: 0.6,
                                                            marginTop: "2px",
                                                        }}
                                                    >
                                                        {startTime.toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            timeZone: "UTC",
                                                        })}{" "}
                                                        -{" "}
                                                        {endTime.toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            timeZone: "UTC",
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Framer property controls
addPropertyControls(TVGuideFixedAll, {
    // JSON input
    roaDataJSON: {
        type: ControlType.String,
        title: "ROA Data JSON",
        description: "JSON data for Rest of Africa region (WAT and CAT timezones)",
    },

    // Layout
    hourWidthPx: {
        type: ControlType.Number,
        title: "Hour Width (px)",
        defaultValue: 220,
        min: 100,
        max: 500,
    },
    rowHeightPx: {
        type: ControlType.Number,
        title: "Row Height (px)",
        defaultValue: 64,
        min: 40,
        max: 120,
    },
    cornerRadiusPx: {
        type: ControlType.Number,
        title: "Corner Radius (px)",
        defaultValue: 8,
        min: 0,
        max: 20,
    },
    gridLineColor: {
        type: ControlType.Color,
        title: "Grid Line Color",
        defaultValue: "#1a1a1a",
    },
    headerHeightPx: {
        type: ControlType.Number,
        title: "Header Height (px)",
        defaultValue: 60,
        min: 40,
        max: 100,
    },
    dayColumnWidthPx: {
        type: ControlType.Number,
        title: "Day Column Width (px)",
        defaultValue: 120,
        min: 80,
        max: 200,
    },

    // Typography
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "system-ui, -apple-system, sans-serif",
    },
    titleFontSize: {
        type: ControlType.Number,
        title: "Title Font Size",
        defaultValue: 14,
        min: 10,
        max: 24,
    },
    subtitleFontSize: {
        type: ControlType.Number,
        title: "Subtitle Font Size",
        defaultValue: 12,
        min: 8,
        max: 20,
    },
    timeFontSize: {
        type: ControlType.Number,
        title: "Time Font Size",
        defaultValue: 10,
        min: 8,
        max: 16,
    },
    dayFontSize: {
        type: ControlType.Number,
        title: "Day Font Size",
        defaultValue: 12,
        min: 8,
        max: 20,
    },

    // Colors
    pageBg: {
        type: ControlType.Color,
        title: "Page Background",
        defaultValue: "#000000",
    },
    cardBg: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#1a1a1a",
    },
    cardText: {
        type: ControlType.Color,
        title: "Card Text",
        defaultValue: "#ffffff",
    },
    headerBg: {
        type: ControlType.Color,
        title: "Header Background",
        defaultValue: "#111111",
    },
    dayColumnBg: {
        type: ControlType.Color,
        title: "Day Column Background",
        defaultValue: "#111111",
    },
    activeRegionBg: {
        type: ControlType.Color,
        title: "Active Region Background",
        defaultValue: "#6b46c1",
    },
    activeTimezoneBg: {
        type: ControlType.Color,
        title: "Active Timezone Background",
        defaultValue: "#6b46c1",
    },
    focusOutline: {
        type: ControlType.Color,
        title: "Focus Outline",
        defaultValue: "#ffffff",
    },

    // Behavior
    enableRegionSwitch: {
        type: ControlType.Boolean,
        title: "Enable Region Switch",
        defaultValue: false,
    },
    enableTimezoneSwitch: {
        type: ControlType.Boolean,
        title: "Enable Timezone Switch",
        defaultValue: true,
    },
    initialRegion: {
        type: ControlType.String,
        title: "Initial Region",
        defaultValue: "ROA",
    },
    initialTimezone: {
        type: ControlType.String,
        title: "Initial Timezone",
        defaultValue: "WAT",
    },
    highContrast: {
        type: ControlType.Boolean,
        title: "High Contrast",
        defaultValue: false,
    },
    showCurrentDay: {
        type: ControlType.Boolean,
        title: "Show Current Day",
        defaultValue: true,
    },

    // Time range
    showTimeLabels: {
        type: ControlType.Boolean,
        title: "Show Time Labels",
        defaultValue: true,
    },
})