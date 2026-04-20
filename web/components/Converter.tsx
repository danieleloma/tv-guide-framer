"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Copy, X, Loader2, Tv2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ConvertResult {
  json: string;
  outputName: string;
  placed: number;
  skipped: number;
  channelInfo: {
    channel: string;
    label: string;
    region: string | null;
    timezones: string[];
  };
  summary: Array<{ region: string; tz: string; days: string[] }>;
}

const CHANNEL_COLORS: Record<string, string> = {
  "zee-one-sa": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "zee-one-roa": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "zee-world-sa": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "zee-world-roa": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "zee-zonke": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "zee-dunia": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function Converter() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "converting" | "done" | "error">("idle");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.match(/\.xlsx?$/i)) {
      setError("Only .xlsx files are supported.");
      setStatus("error");
      return;
    }
    setFile(f);
    setResult(null);
    setError("");
    setStatus("idle");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const convert = async () => {
    if (!file) return;
    setStatus("converting");
    setResult(null);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Conversion failed");
      setResult(data as ConvertResult);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  const channelColor =
    result ? (CHANNEL_COLORS[result.channelInfo.channel] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20") : "";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Tv2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">TV Guide Converter</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Excel → JSON for Framer components</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Upload Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Upload Schedule</CardTitle>
              <CardDescription>
                Supports Zee World SA/ROA, Zee Zonke, and Zee Dunia — channel and output filename are auto-detected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 cursor-pointer transition-colors",
                  dragging
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-zinc-600 bg-zinc-800/40"
                    : "border-zinc-700 bg-zinc-800/20 hover:border-zinc-600 hover:bg-zinc-800/40"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={onInputChange}
                />

                {file ? (
                  <>
                    <div className="p-3 rounded-full bg-zinc-700">
                      <FileSpreadsheet className="w-6 h-6 text-zinc-300" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm text-zinc-200">{file.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB — click or drag to replace
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-zinc-800">
                      <Upload className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">Drop your .xlsx file here</p>
                      <p className="text-xs text-zinc-500 mt-0.5">or click to browse</p>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={convert}
                  disabled={!file || status === "converting"}
                  className="flex-1"
                >
                  {status === "converting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Converting…
                    </>
                  ) : (
                    "Convert to JSON"
                  )}
                </Button>
                {(file || result) && (
                  <Button variant="ghost" size="icon" onClick={reset} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {status === "error" && (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive-foreground">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {status === "done" && result && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <CardTitle className="text-base">Conversion Complete</CardTitle>
                  </div>
                  <Badge
                    className={cn("border text-xs font-medium", channelColor)}
                  >
                    {result.channelInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-zinc-800 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{result.placed}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Shows placed</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-400">{result.skipped}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Empty rows</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-300">{result.summary.length}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Region/TZ pairs</p>
                  </div>
                </div>

                {/* Region summary */}
                <div className="space-y-2">
                  {result.summary.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                        {s.region}/{s.tz}
                      </span>
                      <span>{s.days.join(", ")}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-zinc-800" />

                {/* Output filename */}
                <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="font-mono text-sm text-zinc-300 flex-1 truncate">{result.outputName}</span>
                </div>

                {/* JSON preview */}
                <div className="rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                    <span className="text-xs text-zinc-500">JSON preview</span>
                    <span className="text-xs text-zinc-600">
                      {(new TextEncoder().encode(result.json).length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <pre className="p-3 text-xs text-zinc-400 overflow-auto max-h-56 leading-relaxed">
                    {result.json.slice(0, 2000)}{result.json.length > 2000 ? "\n…" : ""}
                  </pre>
                </div>

                {/* Download / Copy */}
                <div className="flex gap-3">
                  <Button onClick={download} className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Download {result.outputName}
                  </Button>
                  <Button onClick={copy} variant="outline" className="gap-2 border-zinc-700 hover:bg-zinc-800">
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy JSON"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Channel reference */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-400 font-medium">Supported channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Zee One SA", desc: "SA · CAT only", color: CHANNEL_COLORS["zee-one-sa"] },
                  { label: "Zee One ROA", desc: "ROA · WAT + CAT", color: CHANNEL_COLORS["zee-one-roa"] },
                  { label: "Zee World SA", desc: "SA · CAT only", color: CHANNEL_COLORS["zee-world-sa"] },
                  { label: "Zee World ROA", desc: "ROA · WAT + CAT", color: CHANNEL_COLORS["zee-world-roa"] },
                  { label: "Zee Zonke", desc: "ROA · from Region column", color: CHANNEL_COLORS["zee-zonke"] },
                  { label: "Zee Dunia", desc: "ROA · from Region column", color: CHANNEL_COLORS["zee-dunia"] },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded-full border text-xs font-medium", c.color)}>
                      {c.label}
                    </span>
                    <span className="text-zinc-600">{c.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
