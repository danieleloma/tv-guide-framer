#!/usr/bin/env ts-node

/**
 * Excel to JSON TV Guide Converter (Simple Version)
 * 
 * Converts Excel FPC files to structured JSON for TV guide rendering
 * 
 * Installation:
 *   npm install xlsx zod ts-node @types/node
 * 
 * Usage:
 *   ts-node scripts/excel-to-json-simple.ts --in "/path/to/file.xlsx" --out "public/tv-guide.json"
 * 
 * Column Mapping:
 *   Edit the COL constant below to match your Excel headers
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

// Column header mapping - EDIT THIS TO MATCH YOUR EXCEL HEADERS
const COL = {
  region: "Region",
  timezone: "Timezone", 
  date: "Date",
  start: "Start Time",
  end: "End Time",
  title: "Title",
  season: "Season",   // NEW
  episode: "Episode", // NEW
} as const;

// Types
type Region = "SA" | "ROA";
type Tz = "WAT" | "CAT";
type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TimeLabel = `${string}:${"00"|"30"}`;

interface ShowItem {
  title: string;
  start: TimeLabel;
  end: TimeLabel;
  season?: string;   // only present if both season & episode exist
  episode?: string;  // only present if both season & episode exist
  meta?: Record<string, any>;
}

interface SlotBucket {
  time: TimeLabel;
  shows: ShowItem[];
}

interface DaySchedule {
  date: string;
  day: Weekday;
  slots: SlotBucket[];
}

interface TzSchedule {
  timezone: Tz;
  days: Record<Weekday, DaySchedule>;
}

interface RegionSchedule {
  region: Region;
  timezones: Record<Tz, TzSchedule | null>;
}

interface TvGuideData {
  window: {
    WAT: { start: "05:00"; end: "05:00" };
    CAT: { start: "06:00"; end: "06:00" };
    slotMinutes: 30;
  };
  regions: Record<Region, RegionSchedule>;
}

interface ExcelRow {
  region: string;
  timezone: string;
  day: string;
  date: Date | string;
  start: string | Date;
  end: string | Date;
  title: string;
  season?: string | number;
  episode?: string | number;
  [key: string]: any;
}

// Validation schemas
const WeekdaySchema = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const RegionSchema = z.enum(["SA", "ROA"]);
const TzSchema = z.enum(["WAT", "CAT"]);

function parseArgs(): { input: string; output: string } {
  const args = process.argv.slice(2);
  let input = '';
  let output = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--in' && args[i + 1]) {
      input = args[i + 1];
      i++; // skip next arg
    } else if (args[i] === '--out' && args[i + 1]) {
      output = args[i + 1];
      i++; // skip next arg
    }
  }

  if (!input || !output) {
    console.error('Usage: ts-node scripts/excel-to-json-simple.ts --in "/path/to/file.xlsx" --out "public/tv-guide.json"');
    process.exit(1);
  }

  return { input, output };
}

function normalizeTime(time: string | Date): TimeLabel {
  let timeStr: string;
  
  if (time instanceof Date) {
    // Format Date object to HH:MM
    timeStr = time.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    timeStr = time.toString().trim();
  }

  // Round to nearest 30-minute slot
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const roundedMinutes = Math.round(totalMinutes / 30) * 30;
  
  const roundedHours = Math.floor(roundedMinutes / 60) % 24;
  const roundedMins = roundedMinutes % 60;
  
  return `${roundedHours.toString().padStart(2, '0')}:${roundedMins.toString().padStart(2, '0')}` as TimeLabel;
}

function normalizeDay(dayStr: string): Weekday {
  const dayMap: Record<string, Weekday> = {
    'monday': 'Mon',
    'tuesday': 'Tue',
    'wednesday': 'Wed',
    'thursday': 'Thu',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun',
    'mon': 'Mon',
    'tue': 'Tue',
    'wed': 'Wed', 
    'thu': 'Thu',
    'fri': 'Fri',
    'sat': 'Sat',
    'sun': 'Sun'
  };

  const normalized = dayStr.toLowerCase().trim();
  return dayMap[normalized] || 'Mon'; // fallback to Monday
}

function asEpisodeValue(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function generateTimeTicks(timezone: Tz): TimeLabel[] {
  // Use buildTicks helper for proper 24-hour window
  // WAT: 05:00 → 05:00 (next day) = 24 hours = 48 intervals (49 labels)
  // CAT: 06:00 → 06:00 (next day) = 24 hours = 48 intervals (49 labels)
  
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
  
  return ticks;
}

function createEmptyDaySchedule(date: string, timezone: Tz): DaySchedule {
  const dateObj = new Date(date);
  const weekday = normalizeDay(dateObj.toLocaleDateString('en-US', { weekday: 'long' }));
  const ticks = generateTimeTicks(timezone);
  
  return {
    date,
    day: weekday,
    slots: ticks.map(time => ({ time, shows: [] }))
  };
}

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
  let windowEnd = windowStart + DAY; // 24 hours later (same time next day)
  
  // Normalize show start to window space
  let normalizedStart = startMinutes;
  if (normalizedStart < windowStart) {
    normalizedStart += DAY;
  }
  
  // Normalize show end to window space
  let normalizedEnd = endMinutes;
  if (normalizedEnd < windowStart) {
    normalizedEnd += DAY;
  }
  
  // Check if show starts within window
  return normalizedStart >= windowStart && normalizedStart < windowEnd;
}

function parseExcelFile(filePath: string): ExcelRow[] {
  console.log(`📖 Reading Excel file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  console.log(`📊 Found sheet: ${sheetName}`);
  
  // Convert to JSON with headers
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length < 2) {
    throw new Error('Excel file must have at least a header row and one data row');
  }

  const headers = jsonData[0] as string[];
  const rows = jsonData.slice(1) as any[][];
  
  console.log(`📋 Headers found: ${headers.join(', ')}`);
  console.log(`📊 Data rows: ${rows.length}`);
  
  // Map headers to our expected columns
  const headerMap: Record<string, number> = {};
  Object.entries(COL).forEach(([key, expectedHeader]) => {
    const index = headers.findIndex(h => h?.toString().trim() === expectedHeader);
    if (index === -1) {
      console.warn(`⚠️  Column "${expectedHeader}" not found in Excel headers`);
    } else {
      headerMap[key] = index;
    }
  });

  // Convert rows to ExcelRow objects
  const excelRows: ExcelRow[] = rows.map((row, index) => {
    const excelRow: ExcelRow = {
      region: row[headerMap.region]?.toString() || '',
      timezone: row[headerMap.timezone]?.toString() || '',
      day: '', // Will be extracted from date
      date: row[headerMap.date] || '',
      start: row[headerMap.start] || '',
      end: row[headerMap.end] || '',
      title: row[headerMap.title]?.toString() || '',
      season: row[headerMap.season],
      episode: row[headerMap.episode],
    };

    // Add any additional columns as meta data
    Object.keys(headerMap).forEach(key => {
      if (!['region', 'timezone', 'day', 'date', 'start', 'end', 'title', 'season', 'episode'].includes(key)) {
        const colIndex = headerMap[key];
        if (colIndex !== undefined && row[colIndex] !== undefined) {
          excelRow[key] = row[colIndex];
        }
      }
    });

    return excelRow;
  }).filter(row => row.title.trim()); // Filter out empty rows

  console.log(`✅ Parsed ${excelRows.length} valid rows`);
  return excelRows;
}

function convertToTvGuideData(excelRows: ExcelRow[]): TvGuideData {
  console.log('🔄 Converting Excel data to TV Guide structure...');
  
  const tvGuideData: TvGuideData = {
    window: {
      WAT: { start: "05:00", end: "05:00" },
      CAT: { start: "06:00", end: "06:00" },
      slotMinutes: 30
    },
    regions: {
      SA: {
        region: "SA",
        timezones: {
          WAT: null,
          CAT: {
            timezone: "CAT",
            days: {
              Mon: createEmptyDaySchedule('2025-10-06', 'CAT'),
              Tue: createEmptyDaySchedule('2025-10-07', 'CAT'),
              Wed: createEmptyDaySchedule('2025-10-08', 'CAT'),
              Thu: createEmptyDaySchedule('2025-10-09', 'CAT'),
              Fri: createEmptyDaySchedule('2025-10-10', 'CAT'),
              Sat: createEmptyDaySchedule('2025-10-11', 'CAT'),
              Sun: createEmptyDaySchedule('2025-10-12', 'CAT'),
            }
          }
        }
      },
      ROA: {
        region: "ROA", 
        timezones: {
          WAT: {
            timezone: "WAT",
            days: {
              Mon: createEmptyDaySchedule('2025-10-06', 'WAT'),
              Tue: createEmptyDaySchedule('2025-10-07', 'WAT'),
              Wed: createEmptyDaySchedule('2025-10-08', 'WAT'),
              Thu: createEmptyDaySchedule('2025-10-09', 'WAT'),
              Fri: createEmptyDaySchedule('2025-10-10', 'WAT'),
              Sat: createEmptyDaySchedule('2025-10-11', 'WAT'),
              Sun: createEmptyDaySchedule('2025-10-12', 'WAT'),
            }
          },
          CAT: {
            timezone: "CAT",
            days: {
              Mon: createEmptyDaySchedule('2025-10-06', 'CAT'),
              Tue: createEmptyDaySchedule('2025-10-07', 'CAT'),
              Wed: createEmptyDaySchedule('2025-10-08', 'CAT'),
              Thu: createEmptyDaySchedule('2025-10-09', 'CAT'),
              Fri: createEmptyDaySchedule('2025-10-10', 'CAT'),
              Sat: createEmptyDaySchedule('2025-10-11', 'CAT'),
              Sun: createEmptyDaySchedule('2025-10-12', 'CAT'),
            }
          }
        }
      }
    }
  };

  // Process each Excel row
  let processedCount = 0;
  let skippedCount = 0;

  excelRows.forEach((row, index) => {
    try {
      // Validate and normalize data
      const region = row.region.trim().toUpperCase() as Region;
      const timezone = row.timezone.trim().toUpperCase() as Tz;
      const title = row.title.trim();
      
      if (!RegionSchema.safeParse(region).success) {
        console.warn(`⚠️  Row ${index + 1}: Invalid region "${region}", skipping`);
        skippedCount++;
        return;
      }
      
      if (!TzSchema.safeParse(timezone).success) {
        console.warn(`⚠️  Row ${index + 1}: Invalid timezone "${timezone}", skipping`);
        skippedCount++;
        return;
      }

      // Handle date and extract day
      let dateStr: string;
      let dateObj: Date;
      
      if (row.date instanceof Date) {
        dateObj = row.date;
        dateStr = dateObj.toISOString().split('T')[0];
      } else {
        dateStr = row.date.toString().trim();
        dateObj = new Date(dateStr);
      }
      
      // Extract day from date
      const day = normalizeDay(dateObj.toLocaleDateString('en-US', { weekday: 'long' }));

      // Normalize times
      const start = normalizeTime(row.start);
      const end = normalizeTime(row.end);
      
      // Validate time window
      if (!isValidTimeWindow(start, end, timezone)) {
        console.warn(`⚠️  Row ${index + 1}: Time "${start}-${end}" outside ${timezone} window, skipping`);
        skippedCount++;
        return;
      }

      // Parse season and episode
      const seasonVal = asEpisodeValue(row.season);
      const episodeVal = asEpisodeValue(row.episode);

      // Create show item
      const showItem: ShowItem = {
        title,
        start,
        end,
        // Only include season/episode if both are present
        ...(seasonVal && episodeVal ? { season: seasonVal, episode: episodeVal } : {}),
        meta: {}
      };

      // Add any additional meta data
      Object.keys(row).forEach(key => {
        if (!['region', 'timezone', 'day', 'date', 'start', 'end', 'title', 'season', 'episode'].includes(key)) {
          showItem.meta![key] = row[key];
        }
      });

      // Add to appropriate slot
      const regionSchedule = tvGuideData.regions[region];
      const tzSchedule = regionSchedule.timezones[timezone];
      
      if (!tzSchedule) {
        console.warn(`⚠️  Row ${index + 1}: ${region} does not support ${timezone}, skipping`);
        skippedCount++;
        return;
      }

      const daySchedule = tzSchedule.days[day];
      const slot = daySchedule.slots.find(s => s.time === start);
      
      if (slot) {
        slot.shows.push(showItem);
        processedCount++;
      } else {
        console.warn(`⚠️  Row ${index + 1}: No slot found for time "${start}"`);
        skippedCount++;
      }

    } catch (error) {
      console.warn(`⚠️  Row ${index + 1}: Error processing row:`, error);
      skippedCount++;
    }
  });

  console.log(`✅ Processed ${processedCount} rows, skipped ${skippedCount} rows`);
  return tvGuideData;
}

function main() {
  try {
    const { input, output } = parseArgs();
    
    console.log('🚀 Starting Excel to JSON conversion...');
    console.log(`📥 Input: ${input}`);
    console.log(`📤 Output: ${output}`);
    
    // Parse Excel file
    const excelRows = parseExcelFile(input);
    
    // Convert to TV Guide structure
    const tvGuideData = convertToTvGuideData(excelRows);
    
    // Ensure output directory exists
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write JSON file
    fs.writeFileSync(output, JSON.stringify(tvGuideData, null, 2));
    
    console.log(`✅ Successfully converted Excel to JSON!`);
    console.log(`📊 Regions: ${Object.keys(tvGuideData.regions).join(', ')}`);
    console.log(`📊 Timezones: WAT, CAT`);
    console.log(`📊 Days: Mon-Sun`);
    
    // Show summary stats
    Object.entries(tvGuideData.regions).forEach(([regionKey, regionData]) => {
      const region = regionKey as Region;
      console.log(`\n📺 ${region} Region:`);
      
      Object.entries(regionData.timezones).forEach(([tzKey, tzData]) => {
        const tz = tzKey as Tz;
        if (tzData) {
          const totalShows = Object.values(tzData.days).reduce((sum, day) => 
            sum + day.slots.reduce((daySum, slot) => daySum + slot.shows.length, 0), 0);
          console.log(`  ${tz}: ${totalShows} shows across 7 days`);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { parseExcelFile, convertToTvGuideData, normalizeTime, normalizeDay };
