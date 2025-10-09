/**
 * Aesthetic TV Guide Framer Component
 * 
 * Features:
 * - Time on vertical axis, days on horizontal axis
 * - 30-minute interval blocks
 * - Dynamic timezone and region switching
 * - WAT: 5am-4am, CAT: 6am-5am (23-hour cycles)
 * - Aesthetic dark theme with golden accents
 * - Manual JSON data input field
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
    // JSON input field
    roaDataJSON?: string

    // Layout
    hourHeightPx?: number
    dayWidthPx?: number
    cornerRadiusPx?: number
    gridLineColor?: string
    headerHeightPx?: number
    timeColumnWidthPx?: number

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
    timeColumnBg?: string
    activeRegionBg?: string
    activeTimezoneBg?: string
    accentColor?: string

    // Behavior
    enableRegionSwitch?: boolean
    enableTimezoneSwitch?: boolean
    initialRegion?: string
    initialTimezone?: string
    showCurrentDay?: boolean
    showTimeIndicator?: boolean

    // Time range
    showTimeLabels?: boolean
}

// Helper function to generate time ticks for WAT (5:00 AM - 4:00 AM next day)
function generateWATTimeTicks(hourHeightPx: number) {
    const ticks = []
    const halfHourHeight = hourHeightPx / 2

    // 5:00 AM to 11:30 PM (same day)
    for (let hour = 5; hour <= 23; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            yPosition: (hour - 5) * hourHeightPx,
            isMajor: true,
        })

        if (hour < 23) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                yPosition: (hour - 5) * hourHeightPx + halfHourHeight,
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
            yPosition: (hour + 19) * hourHeightPx,
            isMajor: true,
        })

        if (hour < 4) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                yPosition: (hour + 19) * hourHeightPx + halfHourHeight,
                isMajor: false,
            })
        }
    }

    return ticks
}

// Helper function to generate time ticks for CAT (6:00 AM - 5:00 AM next day)
function generateCATTimeTicks(hourHeightPx: number) {
    const ticks = []
    const halfHourHeight = hourHeightPx / 2

    // 6:00 AM to 11:30 PM (same day)
    for (let hour = 6; hour <= 23; hour++) {
        ticks.push({
            hour,
            minute: 0,
            label: `${hour.toString().padStart(2, "0")}:00`,
            yPosition: (hour - 6) * hourHeightPx,
            isMajor: true,
        })

        if (hour < 23) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                yPosition: (hour - 6) * hourHeightPx + halfHourHeight,
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
            yPosition: (hour + 18) * hourHeightPx,
            isMajor: true,
        })

        if (hour < 5) {
            ticks.push({
                hour,
                minute: 30,
                label: `${hour.toString().padStart(2, "0")}:30`,
                yPosition: (hour + 18) * hourHeightPx + halfHourHeight,
                isMajor: false,
            })
        }
    }

    return ticks
}

export default function TVGuideAesthetic(props: TVGuideProps) {
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
        const hourHeight = props.hourHeightPx || 60

        if (currentTimezone === "WAT") {
            return generateWATTimeTicks(hourHeight)
        } else if (currentTimezone === "CAT") {
            return generateCATTimeTicks(hourHeight)
        }

        return generateWATTimeTicks(hourHeight) // fallback
    }, [currentTimezone, props.hourHeightPx])

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
                    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
                    color: "#ffffff",
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
                    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
                    color: "#ffffff",
                    fontFamily: props.fontFamily || "system-ui, -apple-system, sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", marginBottom: "8px" }}>No data available</div>
                    <div style={{ fontSize: "14px", opacity: 0.7 }}>Please provide ROA JSON data</div>
                </div>
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
                background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
                color: props.cardText || "#ffffff",
                fontFamily: props.fontFamily || "system-ui, -apple-system, sans-serif",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Background Pattern */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
                    `,
                    pointerEvents: "none",
                }}
            />

            {/* Header Controls */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                    background: "rgba(15, 15, 35, 0.95)",
                    backdropFilter: "blur(10px)",
                    height: props.headerHeightPx || 80,
                    minHeight: props.headerHeightPx || 80,
                    position: "relative",
                    zIndex: 10,
                }}
            >
                {/* Region Display */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <div
                        style={{
                            padding: "12px 24px",
                            border: "none",
                            borderRadius: `${props.cornerRadiusPx || 12}px`,
                            background: `linear-gradient(135deg, ${props.accentColor || "#FFD700"} 0%, #FFA500 100%)`,
                            color: "#000000",
                            fontSize: props.titleFontSize || 16,
                            fontWeight: 700,
                            boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
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
                            gap: "8px",
                            marginLeft: "auto",
                        }}
                    >
                        {["WAT", "CAT"].map((tz) => (
                            <button
                                key={tz}
                                onClick={() => setCurrentTimezone(tz)}
                                style={{
                                    padding: "10px 20px",
                                    border: `2px solid ${currentTimezone === tz ? props.accentColor || "#FFD700" : "rgba(255, 215, 0, 0.3)"}`,
                                    borderRadius: `${props.cornerRadiusPx || 8}px`,
                                    background: currentTimezone === tz
                                        ? `linear-gradient(135deg, ${props.activeTimezoneBg || "#FFD700"} 0%, #FFA500 100%)`
                                        : "transparent",
                                    color: currentTimezone === tz ? "#000000" : props.cardText || "#ffffff",
                                    cursor: "pointer",
                                    fontSize: props.subtitleFontSize || 14,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease",
                                    boxShadow: currentTimezone === tz ? "0 4px 15px rgba(255, 215, 0, 0.3)" : "none",
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
                {/* Time Column */}
                <div
                    style={{
                        width: props.timeColumnWidthPx || 100,
                        background: "rgba(15, 15, 35, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRight: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                        display: "flex",
                        flexDirection: "column",
                        position: "sticky",
                        left: 0,
                        zIndex: 20,
                    }}
                >
                    <div
                        style={{
                            padding: "16px 12px",
                            borderBottom: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                            fontSize: props.dayFontSize || 14,
                            fontWeight: 700,
                            textAlign: "center",
                            background: `linear-gradient(135deg, ${props.accentColor || "#FFD700"} 0%, #FFA500 100%)`,
                            color: "#000000",
                        }}
                    >
                        {currentTimezone}
                    </div>
                    {timeTicks.map((tick, index) => (
                        <div
                            key={index}
                            style={{
                                height: tick.isMajor ? props.hourHeightPx || 60 : (props.hourHeightPx || 60) / 2,
                                padding: "8px 12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: props.timeFontSize || 12,
                                fontWeight: tick.isMajor ? 600 : 400,
                                color: tick.isMajor ? props.cardText || "#ffffff" : "rgba(255, 255, 255, 0.7)",
                                borderBottom: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.1)"}`,
                            }}
                        >
                            {tick.label}
                        </div>
                    ))}
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
                    {/* Day Header */}
                    <div
                        style={{
                            display: "flex",
                            background: "rgba(15, 15, 35, 0.95)",
                            backdropFilter: "blur(10px)",
                            borderBottom: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            minWidth: "max-content",
                        }}
                    >
                        {filteredDays.map((day, dayIndex) => {
                            const isCurrentDay = props.showCurrentDay && day.dateISO === currentDate
                            return (
                                <div
                                    key={`${day.dateISO}-${day.timezone}`}
                                    style={{
                                        width: props.dayWidthPx || 200,
                                        padding: "16px 12px",
                                        textAlign: "center",
                                        fontSize: props.dayFontSize || 14,
                                        fontWeight: 600,
                                        borderRight: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                                        background: isCurrentDay
                                            ? `linear-gradient(135deg, ${props.activeRegionBg || "#FFD700"} 0%, #FFA500 100%)`
                                            : "transparent",
                                        color: isCurrentDay ? "#000000" : props.cardText || "#ffffff",
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

                    {/* Program Grid */}
                    <div
                        style={{
                            position: "relative",
                            minWidth: "max-content",
                        }}
                    >
                        {/* Grid Lines for Visual Alignment */}
                        {timeTicks.map((tick, tickIndex) => (
                            <div
                                key={`grid-${tickIndex}`}
                                style={{
                                    position: "absolute",
                                    top: tick.yPosition,
                                    left: 0,
                                    right: 0,
                                    height: "1px",
                                    backgroundColor: props.gridLineColor || "rgba(255, 215, 0, 0.1)",
                                    opacity: tick.isMajor ? 0.3 : 0.1,
                                    zIndex: 1,
                                }}
                            />
                        ))}

                        {/* Current Time Indicator */}
                        {props.showTimeIndicator && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 0, // You can calculate this based on current time
                                    height: "2px",
                                    background: `linear-gradient(90deg, ${props.accentColor || "#FFD700"} 0%, #FFA500 100%)`,
                                    zIndex: 5,
                                    boxShadow: `0 0 10px ${props.accentColor || "#FFD700"}`,
                                }}
                            />
                        )}

                        {/* Show Slots */}
                        {filteredDays.map((day, dayIndex) => {
                            const dayLeft = dayIndex * (props.dayWidthPx || 200)

                            return (
                                <div
                                    key={`${day.dateISO}-${day.timezone}`}
                                    style={{
                                        position: "absolute",
                                        left: dayLeft,
                                        top: 0,
                                        width: props.dayWidthPx || 200,
                                        height: timeTicks.length * (props.hourHeightPx || 60) / 2,
                                        borderRight: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                                    }}
                                >
                                    {day.slots.map((slot, slotIndex) => {
                                        const startTime = new Date(slot.startISO)
                                        const endTime = new Date(slot.endISO || slot.startISO)
                                        const startHour = startTime.getUTCHours()
                                        const startMinute = startTime.getUTCMinutes()
                                        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes

                                        // Calculate position based on timezone
                                        let top = 0
                                        if (currentTimezone === "WAT") {
                                            // WAT: 5:00 AM - 4:00 AM next day
                                            if (startHour >= 5) {
                                                top = (((startHour - 5) * 60 + startMinute) * (props.hourHeightPx || 60)) / 60
                                            } else {
                                                top = (((startHour + 19) * 60 + startMinute) * (props.hourHeightPx || 60)) / 60
                                            }
                                        } else if (currentTimezone === "CAT") {
                                            // CAT: 6:00 AM - 5:00 AM next day
                                            if (startHour >= 6) {
                                                top = (((startHour - 6) * 60 + startMinute) * (props.hourHeightPx || 60)) / 60
                                            } else {
                                                top = (((startHour + 18) * 60 + startMinute) * (props.hourHeightPx || 60)) / 60
                                            }
                                        }

                                        // Calculate height based on duration
                                        const height = (duration * (props.hourHeightPx || 60)) / 60

                                        return (
                                            <div
                                                key={slotIndex}
                                                style={{
                                                    position: "absolute",
                                                    top: top + 2,
                                                    left: 4,
                                                    right: 4,
                                                    height: Math.max(30, height - 4),
                                                    background: `linear-gradient(135deg, ${slot.bgColor || props.cardBg || "rgba(26, 26, 46, 0.9)"} 0%, rgba(22, 33, 62, 0.9) 100%)`,
                                                    color: slot.textColor || props.cardText || "#ffffff",
                                                    borderRadius: `${props.cornerRadiusPx || 8}px`,
                                                    padding: "8px 12px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                    border: `1px solid ${props.gridLineColor || "rgba(255, 215, 0, 0.2)"}`,
                                                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                                                    zIndex: 10,
                                                    overflow: "hidden",
                                                    backdropFilter: "blur(5px)",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.4)"
                                                    e.currentTarget.style.borderColor = props.accentColor || "#FFD700"
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)"
                                                    e.currentTarget.style.borderColor = props.gridLineColor || "rgba(255, 215, 0, 0.2)"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: props.titleFontSize || 12,
                                                        fontWeight: 700,
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
                                                            fontSize: props.subtitleFontSize || 10,
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
                                                        fontSize: props.timeFontSize || 9,
                                                        opacity: 0.6,
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {startTime.toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        timeZone: "UTC",
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
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
addPropertyControls(TVGuideAesthetic, {
    // JSON input field
    roaDataJSON: {
        type: ControlType.String,
        title: "ROA Data JSON",
        description: "Paste your JSON data here for ROA region (WAT and CAT timezones)",
    },

    // Layout
    hourHeightPx: {
        type: ControlType.Number,
        title: "Hour Height (px)",
        defaultValue: 60,
        min: 30,
        max: 120,
    },
    dayWidthPx: {
        type: ControlType.Number,
        title: "Day Width (px)",
        defaultValue: 200,
        min: 150,
        max: 300,
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
        defaultValue: "rgba(255, 215, 0, 0.2)",
    },
    headerHeightPx: {
        type: ControlType.Number,
        title: "Header Height (px)",
        defaultValue: 80,
        min: 60,
        max: 120,
    },
    timeColumnWidthPx: {
        type: ControlType.Number,
        title: "Time Column Width (px)",
        defaultValue: 100,
        min: 80,
        max: 150,
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
        defaultValue: 12,
        min: 8,
        max: 20,
    },
    subtitleFontSize: {
        type: ControlType.Number,
        title: "Subtitle Font Size",
        defaultValue: 10,
        min: 6,
        max: 16,
    },
    timeFontSize: {
        type: ControlType.Number,
        title: "Time Font Size",
        defaultValue: 12,
        min: 8,
        max: 18,
    },
    dayFontSize: {
        type: ControlType.Number,
        title: "Day Font Size",
        defaultValue: 14,
        min: 10,
        max: 22,
    },

    // Colors
    pageBg: {
        type: ControlType.Color,
        title: "Page Background",
        defaultValue: "#0f0f23",
    },
    cardBg: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "rgba(26, 26, 46, 0.9)",
    },
    cardText: {
        type: ControlType.Color,
        title: "Card Text",
        defaultValue: "#ffffff",
    },
    headerBg: {
        type: ControlType.Color,
        title: "Header Background",
        defaultValue: "rgba(15, 15, 35, 0.95)",
    },
    timeColumnBg: {
        type: ControlType.Color,
        title: "Time Column Background",
        defaultValue: "rgba(15, 15, 35, 0.95)",
    },
    activeRegionBg: {
        type: ControlType.Color,
        title: "Active Region Background",
        defaultValue: "#FFD700",
    },
    activeTimezoneBg: {
        type: ControlType.Color,
        title: "Active Timezone Background",
        defaultValue: "#FFD700",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#FFD700",
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
    showCurrentDay: {
        type: ControlType.Boolean,
        title: "Show Current Day",
        defaultValue: true,
    },
    showTimeIndicator: {
        type: ControlType.Boolean,
        title: "Show Time Indicator",
        defaultValue: true,
    },

    // Time range
    showTimeLabels: {
        type: ControlType.Boolean,
        title: "Show Time Labels",
        defaultValue: true,
    },
})


