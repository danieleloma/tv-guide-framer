#!/usr/bin/env ts-node

/**
 * Excel/CSV to TV Guide JSON Converter
 * 
 * Converts Excel (.xlsx) or CSV files containing TV guide data into the normalized
 * JSON format required by the TVGuide Framer component.
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { GuideJSON, Region, Day, Slot, TimezoneCode, ExcelRow } from '../components/types';
import { normalizeTimeString, normalizeDateString, localToUTC } from '../components/time';

interface ConversionOptions {
  inputFile: string;
  outputFile: string;
  channelId: string;
  defaultRegion: string;
  defaultTimezone?: string;
}

/**
 * Parses command line arguments
 */
function parseArgs(): ConversionOptions {
  const args = process.argv.slice(2);
  const options: Partial<ConversionOptions> = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--in':
        options.inputFile = value;
        break;
      case '--out':
        options.outputFile = value;
        break;
      case '--channelId':
        options.channelId = value;
        break;
      case '--defaultRegion':
        options.defaultRegion = value;
        break;
      case '--defaultTimezone':
        options.defaultTimezone = value;
        break;
    }
  }
  
  if (!options.inputFile || !options.outputFile || !options.channelId || !options.defaultRegion) {
    console.error('Usage: ts-node excel-to-guide.ts --in <input> --out <output> --channelId <id> --defaultRegion <region> [--defaultTimezone <tz>]');
    process.exit(1);
  }
  
  return options as ConversionOptions;
}

/**
 * Reads and parses Excel/CSV file
 */
function readSpreadsheet(filePath: string): ExcelRow[] {
  const ext = path.extname(filePath).toLowerCase();
  let workbook: XLSX.WorkBook;
  
  if (ext === '.csv') {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    workbook = XLSX.read(csvContent, { 
      type: 'string',
      cellDates: false,
      cellNF: false,
      cellText: false
    });
  } else if (ext === '.xlsx' || ext === '.xls') {
    workbook = XLSX.readFile(filePath, {
      cellDates: false,
      cellNF: false,
      cellText: false
    });
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .csv, .xlsx, or .xls`);
  }
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (jsonData.length < 2) {
    throw new Error('Spreadsheet must have at least a header row and one data row');
  }

  const headers = (jsonData[0] as string[]).map(h => h?.toString().toLowerCase().trim() || '');
  const rows: ExcelRow[] = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    const rowData: ExcelRow = {};

    headers.forEach((header, index) => {
      const value = row[index];
      if (value !== undefined && value !== null && value !== '') {
        switch (header) {
          case 'region':
            rowData.region = value.toString().trim().toUpperCase();
            break;
          case 'date':
            if (typeof value === 'number') {
              const excelDate = new Date((value - 25569) * 86400 * 1000);
              rowData.date = excelDate.toISOString().split('T')[0];
            } else {
              rowData.date = normalizeDateString(value.toString());
            }
            break;
          case 'start time':
          case 'starttime':
            rowData.startTime = normalizeTimeString(value.toString());
            break;
          case 'end time':
          case 'endtime':
            rowData.endTime = normalizeTimeString(value.toString());
            break;
          case 'duration (min)':
          case 'duration':
          case 'durationmin':
            rowData.durationMin = parseInt(value.toString());
            break;
          case 'local tz':
          case 'localtz':
          case 'timezone':
            rowData.localTZ = value.toString().trim().toUpperCase();
            break;
          case 'title':
            rowData.title = value.toString().trim();
            break;
          case 'season':
            rowData.season = value.toString().trim();
            break;
          case 'episode':
            rowData.episode = value.toString().trim();
            break;
          case 'subtitle':
            rowData.subtitle = value.toString().trim();
            break;
          case 'text color':
          case 'textcolor':
            rowData.textColor = value.toString().trim();
            break;
          case 'bg color':
          case 'bgcolor':
          case 'background color':
            rowData.bgColor = value.toString().trim();
            break;
        }
      }
    });

    if (rowData.region && rowData.date && rowData.startTime && rowData.title) {
      rows.push(rowData);
    }
  }

  return rows;
}

/**
 * Converts Excel rows to normalized GuideJSON
 */
function convertToGuideJSON(rows: ExcelRow[], options: ConversionOptions): GuideJSON {
  const regions = new Map<string, Region>();
  const defaultTZ: TimezoneCode = (options.defaultTimezone as TimezoneCode) || 'CAT';

  rows.forEach(row => {
    const regionCode = row.region!;
    const date = row.date!;
    const startTime = row.startTime!;
    const localTZ = (row.localTZ as TimezoneCode) || defaultTZ;

    const startISO = localToUTC(startTime, date, localTZ);

    let endISO: string;
    if (row.endTime) {
      endISO = localToUTC(row.endTime, date, localTZ);
    } else if (row.durationMin) {
      const start = DateTime.fromISO(startISO);
      const end = start.plus({ minutes: row.durationMin });
      endISO = end.toISO()!;
    } else {
      const start = DateTime.fromISO(startISO);
      const end = start.plus({ minutes: 30 });
      endISO = end.toISO()!;
    }

    const slot: Slot = {
      startISO,
      endISO,
      title: row.title!,
      season: row.season,
      episode: row.episode,
      subtitle: row.subtitle,
      textColor: row.textColor,
      bgColor: row.bgColor
    };

    if (!row.endTime && row.durationMin) {
      slot.durationMin = row.durationMin;
    }

    if (!regions.has(regionCode)) {
      regions.set(regionCode, {
        code: regionCode,
        label: getRegionLabel(regionCode),
        timezones: getRegionTimezones(regionCode),
        days: []
      });
    }

    const region = regions.get(regionCode)!;
    let day = region.days.find(d => d.dateISO === date);
    if (!day) {
      day = {
        dateISO: date,
        slots: []
      };
      region.days.push(day);
    }

    day.slots.push(slot);
  });

  regions.forEach(region => {
    region.days.forEach(day => {
      day.slots.sort((a, b) => a.startISO.localeCompare(b.startISO));
    });
    region.days.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  });

  return {
    metadata: {
      channelId: options.channelId,
      generatedAt: DateTime.now().toISO()!,
      defaultRegion: options.defaultRegion,
      defaultTimezone: defaultTZ
    },
    regions: Array.from(regions.values())
  };
}

function getRegionLabel(regionCode: string): string {
  const labels: Record<string, string> = {
    'SA': 'South Africa',
    'ROA': 'Rest of Africa',
    'NA': 'North America',
    'EU': 'Europe',
    'AS': 'Asia'
  };
  return labels[regionCode] || regionCode;
}

function getRegionTimezones(regionCode: string): TimezoneCode[] {
  const timezoneMap: Record<string, TimezoneCode[]> = {
    'SA': ['CAT'],
    'ROA': ['WAT', 'CAT', 'EST'],
    'NA': ['EST'],
    'EU': ['CAT'],
    'AS': ['CAT']
  };
  return timezoneMap[regionCode] || ['CAT'];
}

/**
 * Main conversion function
 */
async function main() {
  try {
    const options = parseArgs();
    
    console.log(`Reading spreadsheet: ${options.inputFile}`);
    
    // Read and parse the actual Excel file
    const rows = readSpreadsheet(options.inputFile);
    console.log(`Found ${rows.length} valid rows`);
    
    // Convert to GuideJSON
    const guideJSON = convertToGuideJSON(rows, options);
    
    // Ensure output directory exists
    const outputDir = path.dirname(options.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write output file
    fs.writeFileSync(options.outputFile, JSON.stringify(guideJSON, null, 2));
    console.log(`Guide JSON written to: ${options.outputFile}`);
    console.log('✅ Conversion completed successfully!');
    
  } catch (error) {
    console.error('Conversion failed:', error);
    process.exit(1);
  }
}

// Run the conversion if this script is executed directly
if (require.main === module) {
  main();
}
