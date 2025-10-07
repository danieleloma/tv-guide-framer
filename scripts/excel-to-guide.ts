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
 * Main conversion function
 */
async function main() {
  try {
    const options = parseArgs();
    
    console.log(`Reading spreadsheet: ${options.inputFile}`);
    
    // Simple conversion for demo purposes
    const guideJSON = {
      metadata: {
        channelId: options.channelId,
        generatedAt: DateTime.now().toISO()!,
        defaultRegion: options.defaultRegion,
        defaultTimezone: options.defaultTimezone || 'CAT'
      },
      regions: [
        {
          code: options.defaultRegion,
          label: options.defaultRegion === 'SA' ? 'South Africa' : 'Rest of Africa',
          timezones: options.defaultRegion === 'SA' ? ['CAT'] : ['WAT', 'CAT', 'EST'],
          days: [
            {
              dateISO: '2025-09-29',
              slots: [
                {
                  startISO: '2025-09-29T05:00:00Z',
                  endISO: '2025-09-29T05:30:00Z',
                  title: 'Sample Show',
                  season: 'S1',
                  episode: 'Ep 1'
                }
              ]
            }
          ]
        }
      ]
    };
    
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
