import * as XLSX from "xlsx";
import path from "path";

const DAY_MIN = 24 * 60;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TZ_START: Record<string, string> = {
  WAT: "05:00",
  CAT: "06:00",
  EAT: "06:00",
};

const MONTHS: Record<string, string> = {
  january: "jan", february: "feb", march: "mar", april: "apr",
  may: "may", june: "jun", july: "jul", august: "aug",
  september: "sep", october: "oct", november: "nov", december: "dec",
};

function z2(n: number) { return String(n).padStart(2, "0"); }
function tToMin(t: string) { const [h, m] = t.split(":").map(Number); return (h * 60 + m) % DAY_MIN; }
function minToLabel(m: number) { const mm = ((m % DAY_MIN) + DAY_MIN) % DAY_MIN; return `${z2(Math.floor(mm / 60))}:${z2(mm % 60)}`; }

function buildSlots(tz: string): string[] {
  const s = tToMin(TZ_START[tz] ?? "06:00");
  const slots: string[] = [];
  for (let m = s; m < s + DAY_MIN; m += 30) slots.push(minToLabel(m));
  return slots;
}

function normalizeTime(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    const tot = Math.round(v * DAY_MIN);
    return `${z2(Math.floor(tot / 60) % 24)}:${z2(tot % 60)}`;
  }
  if (v instanceof Date) return `${z2(v.getHours())}:${z2(v.getMinutes())}`;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  return m ? `${z2(Number(m[1]))}:${z2(Number(m[2]))}` : null;
}

function normalizeDate(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number") {
    const d = new Date(new Date(1900, 0, 1).getTime() + (v - 2) * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const d = new Date(String(v));
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  const m = String(v).match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function weekday(iso: string): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(iso + "T12:00:00Z").getUTCDay()
  ];
}

function cleanNum(v: unknown): string {
  if (!v) return "";
  const m = String(v).trim().match(/(\d+)/);
  return m ? m[1] : "";
}

export interface ChannelInfo {
  channel: string;
  outName: string;
  label: string;
  region: string | null;
  timezones: string[];
}

export function detectChannel(filename: string): ChannelInfo {
  const name = path.basename(filename);
  const low = name.toLowerCase();

  let channel: string;
  let label: string;
  let defaultRegion: string | null;
  let tzList: string[];

  if (/zee.one/i.test(name)) {
    if (/\bsa\b/i.test(name)) {
      channel = "zee-one-sa"; label = "Zee One SA";
      defaultRegion = "SA"; tzList = ["CAT"];
    } else if (/\broa\b/i.test(name)) {
      channel = "zee-one-roa"; label = "Zee One ROA";
      defaultRegion = "ROA"; tzList = ["WAT", "CAT"];
    } else {
      channel = "zee-one"; label = "Zee One";
      defaultRegion = null; tzList = ["WAT", "CAT"];
    }
  } else if (/zee.world/i.test(name)) {
    if (/\bsa\b/i.test(name)) {
      channel = "zee-world-sa"; label = "Zee World SA";
      defaultRegion = "SA"; tzList = ["CAT"];
    } else if (/\broa\b/i.test(name)) {
      channel = "zee-world-roa"; label = "Zee World ROA";
      defaultRegion = "ROA"; tzList = ["WAT", "CAT"];
    } else {
      channel = "zee-world"; label = "Zee World";
      defaultRegion = null; tzList = ["WAT", "CAT"];
    }
  } else if (/zee.zonke/i.test(name)) {
    channel = "zee-zonke"; label = "Zee Zonke";
    defaultRegion = null; tzList = ["WAT", "CAT"];
  } else if (/dunia/i.test(name)) {
    channel = "zee-dunia"; label = "Zee Dunia";
    defaultRegion = null; tzList = ["WAT", "CAT", "EAT"];
  } else {
    channel = "unknown"; label = "Unknown Channel";
    defaultRegion = null; tzList = ["WAT", "CAT"];
  }

  let mon = "";
  for (const [full, abbr] of Object.entries(MONTHS)) {
    if (low.includes(full)) { mon = abbr; break; }
  }

  const dateMatch = name.match(/\(\s*(?:[A-Za-z]+\s+)?(\d+)[a-z]*\s*[-–]\s*(\d+)/i);
  const d1 = dateMatch ? dateMatch[1] : "";
  const d2 = dateMatch ? dateMatch[2] : "";
  const datePart = mon && d1 && d2 ? `${mon}${d1}-${d2}` : "";
  const outName = datePart ? `${channel}-${datePart}-tvguide.json` : `${channel}-tvguide.json`;

  return { channel, outName, label, region: defaultRegion, timezones: tzList };
}

export interface ConvertResult {
  json: string;
  outputName: string;
  placed: number;
  skipped: number;
  channelInfo: ChannelInfo;
  summary: Array<{ region: string; tz: string; days: string[] }>;
}

export function convertBuffer(buffer: Buffer, filename: string): ConvertResult {
  const channelInfo = detectChannel(filename);

  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    raw: false,
  });

  if (!rows.length) throw new Error("Empty sheet");

  const hdr = (rows[0] as unknown[]).map((h) => (h ? String(h) : "").trim());
  const col: Record<string, number> = {
    region: hdr.indexOf("Region"),
    date: hdr.indexOf("Date"),
    start: hdr.indexOf("Start Time"),
    end: hdr.indexOf("End Time"),
    title: hdr.indexOf("Title"),
    season: hdr.indexOf("Season"),
    episode: hdr.indexOf("Episode"),
    timezone: hdr.indexOf("Timezone"),
  };

  for (const k of ["date", "start", "end", "title"]) {
    if (col[k] === -1) throw new Error(`Missing required column: ${k}`);
  }

  const slotCache: Record<string, string[]> = {};
  const schedule: Record<string, Record<string, { timezone: string; days: Record<string, { date: string; day: string; slots: { time: string; shows: unknown[] }[] }> }>> = {};

  function getOrCreateDay(region: string, tz: string, iso: string) {
    if (!schedule[region]) schedule[region] = {};
    if (!schedule[region][tz]) {
      slotCache[tz] = slotCache[tz] ?? buildSlots(tz);
      schedule[region][tz] = { timezone: tz, days: {} };
    }
    const wd = weekday(iso);
    if (!schedule[region][tz].days[wd]) {
      schedule[region][tz].days[wd] = {
        date: iso,
        day: wd,
        slots: slotCache[tz].map((t) => ({ time: t, shows: [] })),
      };
    }
    return schedule[region][tz].days[wd];
  }

  let placed = 0;
  let skipped = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] as unknown[];
    if (!row || !row.length) continue;

    const iso = normalizeDate(row[col.date]);
    const title = row[col.title] != null ? String(row[col.title]).trim() : "";
    const start = normalizeTime(row[col.start]);
    const end = normalizeTime(row[col.end]);

    if (!iso || !title || !start || !end) { skipped++; continue; }

    const regionCell = col.region !== -1 ? row[col.region] : null;
    const region =
      channelInfo.region ??
      (regionCell ? String(regionCell).trim().toUpperCase() : "ROA");

    const tzCell = col.timezone !== -1 ? row[col.timezone] : null;
    const tzRaw = tzCell ? String(tzCell).trim().toUpperCase() : "";
    const tz = ["WAT", "CAT", "EAT"].includes(tzRaw)
      ? tzRaw
      : region === "SA" ? "CAT" : "WAT";

    const day = getOrCreateDay(region, tz, iso);
    const slots = slotCache[tz] ?? buildSlots(tz);
    const idx = slots.indexOf(start);
    if (idx < 0) { skipped++; continue; }

    const season = cleanNum(col.season !== -1 ? row[col.season] : null);
    const episode = cleanNum(col.episode !== -1 ? row[col.episode] : null);
    const show: Record<string, unknown> = { title, start, end };
    if (season && episode) { show.season = season; show.episode = episode; }
    day.slots[idx].shows.push(show);
    placed++;
  }

  // Assemble final JSON
  const tv: Record<string, unknown> = {
    window: {
      WAT: { start: "05:00", end: "05:00" },
      CAT: { start: "06:00", end: "06:00" },
      EAT: { start: "06:00", end: "06:00" },
      slotMinutes: 30,
    },
    regions: {} as Record<string, unknown>,
  };

  const summary: ConvertResult["summary"] = [];

  for (const [regionKey, tzMap] of Object.entries(schedule)) {
    (tv.regions as Record<string, unknown>)[regionKey] = {
      region: regionKey,
      timezones: {
        WAT: tzMap["WAT"] ?? null,
        CAT: tzMap["CAT"] ?? null,
        EAT: tzMap["EAT"] ?? null,
      },
    };
    for (const [tz, sched] of Object.entries(tzMap)) {
      summary.push({ region: regionKey, tz, days: Object.keys(sched.days) });
    }
  }

  return {
    json: JSON.stringify(tv, null, 2),
    outputName: channelInfo.outName,
    placed,
    skipped,
    channelInfo,
    summary,
  };
}
