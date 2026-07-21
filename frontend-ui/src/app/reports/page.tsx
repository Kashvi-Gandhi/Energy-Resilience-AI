"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import DashboardSidebar from "../../components/DashboardSidebar";
import {
  FileText,
  Search,
  Loader2,
  FileCheck,
  ServerCrash,
  X,
  ShieldAlert,
  ChevronDown,
  Calendar,
  MapPin,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SimulationLog {
  id: string;
  scenario_title: string;
  sector: string;
  risk_score: number;
  premium_surge?: number;
  action_taken?: string;
  scout_analysis?: string;
  logistics_plan?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format ISO timestamp → YYYY-MM-DD */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return iso;
  }
}

/** Derive a plausible file-size string from the log's composite length */
function deriveFileSize(log: SimulationLog): string {
  const base =
    (log.scout_analysis?.length ?? 0) +
    (log.logistics_plan?.length ?? 0) +
    (log.scenario_title?.length ?? 0);
  // Keep it between ~1.2 MB and ~24 MB
  const mb = ((base % 230) / 10 + 1.2).toFixed(1);
  return `${mb} MB`;
}

/** Map risk_score → security badge config */
function badgeConfig(score: number): {
  label: string;
  className: string;
} {
  if (score >= 80)
    return {
      label: "SECRET",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  if (score >= 50)
    return {
      label: "CONFIDENTIAL",
      className: "bg-sky-50 text-sky-700 border-sky-200",
    };
  return {
    label: "RESTRICTED",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

// ---------------------------------------------------------------------------
// Mock fallback data (shown when the table is empty / unreachable)
// ---------------------------------------------------------------------------

const MOCK_LOGS: SimulationLog[] = [
  {
    id: "mock-1",
    scenario_title: "Strait of Hormuz Naval Blockade",
    sector: "Persian Gulf Corridor",
    risk_score: 87,
    action_taken: "Rerouted",
    scout_analysis:
      "## Scout Risk Assessment\n\nA naval escalation has been detected near the Strait of Hormuz. Intelligence intercepts confirm surface combatant deployments restricting tanker transit.\n\n**Primary Threat**: Chokepoint interdiction\n\n**Escalation Probability**: High (>80%)\n\n**Supply Chain Exposure**: 12 VLCC tankers directly impacted.",
    logistics_plan:
      "## Logistics Mitigation Plan\n\n### Recommended Action: Emergency Rerouting\n\n1. **Cape of Good Hope Diversion** — Transit via southern Africa adds +10 days but avoids conflict zone entirely.\n2. **Suez Canal Rerouting** — Partial mitigation; still requires Hormuz approach from the east.\n3. **Strategic Reserve Drawdown** — Coordinate with IEA member states to activate SPR protocols.\n\n**Estimated Delay**: +10 days\n\n**Insurance Premium Impact**: +89%",
    created_at: "2026-06-28T14:22:00Z",
  },
  {
    id: "mock-2",
    scenario_title: "Suez Canal Electronic Warfare Incident",
    sector: "Red Sea / Suez Corridor",
    risk_score: 63,
    action_taken: "Sheltered",
    scout_analysis:
      "## Scout Risk Assessment\n\nElectronic warfare signals detected along the Suez Canal transit zone. Jamming of AIS transponders reported by 4 commercial vessels.\n\n**Primary Threat**: Navigation disruption\n\n**Escalation Probability**: Moderate (45–60%)\n\n**Supply Chain Exposure**: 6 product tankers delayed.",
    logistics_plan:
      "## Logistics Mitigation Plan\n\n### Recommended Action: Holding Pattern\n\n1. **Anchor at Port Said** — Vessels advised to hold at outer anchorage pending signal resolution.\n2. **Alternative: Bab-el-Mandeb → Cape of Good Hope** — Longer transit, but fully clear of interference.\n\n**Estimated Delay**: +4 days\n\n**Insurance Premium Impact**: +34%",
    created_at: "2026-06-25T09:10:00Z",
  },
  {
    id: "mock-3",
    scenario_title: "Malacca Strait Piracy Alert",
    sector: "Southeast Asia Passage",
    risk_score: 41,
    action_taken: "Escorted",
    scout_analysis:
      "## Scout Risk Assessment\n\nArmed boarding attempt reported on a VLCC transiting the Malacca Strait at 01°20'N, 103°55'E.\n\n**Primary Threat**: Piracy / armed robbery\n\n**Escalation Probability**: Low (20%)\n\n**Supply Chain Exposure**: Single vessel; regional risk elevated.",
    logistics_plan:
      "## Logistics Mitigation Plan\n\n### Recommended Action: Naval Escort Protocol\n\n1. **Request Singapore MPA Escort** — Coordinate with regional maritime authorities.\n2. **Speed Adjustment** — Increase transit speed through the strait to reduce exposure window.\n\n**Estimated Delay**: +1 day\n\n**Insurance Premium Impact**: +12%",
    created_at: "2026-06-20T22:45:00Z",
  },
];

// ---------------------------------------------------------------------------
// Dossier Modal
// ---------------------------------------------------------------------------

interface DossierModalProps {
  log: SimulationLog;
  onClose: () => void;
}

function DossierModal({ log, onClose }: DossierModalProps) {
  const badge = badgeConfig(log.risk_score);

  // Close on backdrop click
  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 tracking-widest uppercase">
              Live Intercept Dossier
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dossier"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Title + Meta */}
          <div className="space-y-2">
            <span
              className={`text-[9px] font-extrabold px-2.5 py-0.5 border rounded-md font-mono inline-block tracking-widest ${badge.className}`}
            >
              {badge.label}
            </span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-snug">
              {log.scenario_title.toUpperCase()} INTERCEPT DOCKET
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(log.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Sector: {log.sector}
              </span>
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                Risk Score: {log.risk_score}/100
              </span>
            </div>
          </div>

          {/* Scout Analysis */}
          {log.scout_analysis && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                ▸ Scout Risk Assessment
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{log.scout_analysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Logistics Plan */}
          {log.logistics_plan && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                ▸ Logistics Architect Response
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{log.logistics_plan}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* No content fallback */}
          {!log.scout_analysis && !log.logistics_plan && (
            <div className="text-xs font-mono text-slate-400 text-center py-6 uppercase tracking-wider">
              No analyst field logs annotated for this dossier.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
          <span>
            Dossier Weight: {deriveFileSize(log)} &nbsp;·&nbsp; ID:{" "}
            {log.id.slice(0, 8).toUpperCase()}
          </span>
          {log.action_taken && (
            <span className="text-emerald-600 font-bold uppercase">
              Action: {log.action_taken}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<SimulationLog | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch simulation_logs from Supabase REST API on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    async function fetchSimulationLogs() {
      setLoading(true);
      setError(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn(
          "⚠️ Supabase env vars not set — falling back to mock data."
        );
        setLogs(MOCK_LOGS);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/simulation_logs?select=*&order=created_at.desc`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data: SimulationLog[] = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setLogs(data);
          setUsingFallback(false);
        } else {
          // Table exists but is empty — show mock data so the screen never looks blank
          setLogs(MOCK_LOGS);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error("❌ simulation_logs fetch failure:", err);
        setError(
          err instanceof Error ? err.message : "Unknown network error"
        );
        setLogs(MOCK_LOGS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSimulationLogs();
  }, []);

  // -------------------------------------------------------------------------
  // Derived / filtered list
  // -------------------------------------------------------------------------
  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.scenario_title?.toLowerCase().includes(q) ||
      log.sector?.toLowerCase().includes(q)
    );
  });

  const secretCount = logs.filter((l) => l.risk_score >= 80).length;
  const confidentialCount = logs.filter(
    (l) => l.risk_score >= 50 && l.risk_score < 80
  ).length;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Reports" />

      <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-5 overflow-y-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="border-b border-slate-200 pb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between shrink-0">
          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
              Intelligence Export &amp; Report Registry
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time simulation dossiers compiled from geopolitical threat
              arrays
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dossiers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Summary Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <SummaryCard
            label="Total Dossiers"
            value={String(logs.length)}
            color="slate"
          />
          <SummaryCard
            label="SECRET Rated"
            value={String(secretCount)}
            color="rose"
          />
          <SummaryCard
            label="Confidential"
            value={String(confidentialCount)}
            color="sky"
          />
          <SummaryCard
            label="Data Feed"
            value={loading ? "Syncing…" : usingFallback ? "Demo Mode" : "Live"}
            color={loading ? "slate" : usingFallback ? "amber" : "emerald"}
          />
        </div>

        {/* ── Fallback / Error Banner ─────────────────────────────────────── */}
        {usingFallback && !loading && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-mono shrink-0">
            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
            <span>
              {error
                ? `Live feed unavailable (${error}). Displaying mock demonstration dossiers.`
                : "No simulation logs found in the database. Displaying sample dossiers — run a simulation to populate live data."}
            </span>
          </div>
        )}

        {/* ── Ledger Table ───────────────────────────────────────────────── */}
        <div className="border border-slate-200 bg-white rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm min-h-0">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Compiling intelligence registry...
              </span>
            </div>
          ) : (
            <div className="overflow-auto flex-1">
              <table className="min-w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm font-mono">
                    <th className="px-4 md:px-6 py-3">
                      Document Identification / Origin
                    </th>
                    <th className="px-4 md:px-6 py-3 hidden md:table-cell">
                      File Size
                    </th>
                    <th className="px-4 md:px-6 py-3 text-center">
                      Security Rating
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right">
                      Action Vectors
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, i) => {
                      const badge = badgeConfig(log.risk_score);
                      return (
                        <LogRow
                          key={log.id ?? i}
                          log={log}
                          badge={badge}
                          onOpenDossier={() => setSelectedLog(log)}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-14 text-center font-mono text-xs text-slate-400 uppercase tracking-widest"
                      >
                        <ServerCrash className="h-5 w-5 mx-auto mb-2 text-slate-300" />
                        No dossiers match the current search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* System Footer */}
          <div className="bg-slate-900 text-slate-300 p-3 px-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-tight gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>
                {usingFallback
                  ? "DEMO MODE — MOCK DATA ACTIVE"
                  : "ACTIVE DATABASE INTERACTION ENGINE"}
              </span>
            </div>
            <div className="text-slate-500 text-center sm:text-right">
              Dossiers dynamically mapped from core geopolitical vector
              telemetry.
            </div>
          </div>
        </div>
      </div>

      {/* ── Dossier Modal ──────────────────────────────────────────────────── */}
      {selectedLog && (
        <DossierModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SummaryCardProps {
  label: string;
  value: string;
  color: "slate" | "rose" | "sky" | "emerald" | "amber";
}

const colorMap: Record<
  SummaryCardProps["color"],
  { bg: string; border: string; text: string; icon: string }
> = {
  slate:   { bg: "bg-slate-50",   border: "border-slate-100",   text: "text-slate-700",   icon: "text-slate-400"  },
  rose:    { bg: "bg-rose-50",    border: "border-rose-100",    text: "text-rose-700",    icon: "text-rose-400"   },
  sky:     { bg: "bg-sky-50",     border: "border-sky-100",     text: "text-sky-700",     icon: "text-sky-400"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-400"},
  amber:   { bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-700",   icon: "text-amber-400"  },
};

function SummaryCard({ label, value, color }: SummaryCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`border ${c.border} p-3.5 ${c.bg} rounded-xl flex items-center justify-between shadow-sm`}
    >
      <div>
        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block leading-tight">
          {label}
        </span>
        <span className={`text-base font-bold font-mono ${c.text}`}>
          {value}
        </span>
      </div>
      <FileCheck className={`h-4 w-4 ${c.icon}`} />
    </div>
  );
}

// ---------------------------------------------------------------------------

interface LogRowProps {
  log: SimulationLog;
  badge: { label: string; className: string };
  onOpenDossier: () => void;
}

function LogRow({ log, badge, onOpenDossier }: LogRowProps) {
  const title = `${log.scenario_title.toUpperCase()} INTERCEPT DOCKET`;

  return (
    <tr
      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
      onClick={onOpenDossier}
    >
      {/* Document Identification / Origin */}
      <td className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hidden sm:block shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-950 tracking-tight text-xs md:text-[13px] uppercase max-w-[220px] sm:max-w-md lg:max-w-xl truncate">
              {title}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2">
              <span className="flex items-center gap-0.5">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(log.created_at)}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" />
                Sector: {log.sector}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* File Size */}
      <td className="px-4 md:px-6 py-4 font-mono text-slate-500 text-[11px] hidden md:table-cell whitespace-nowrap">
        {deriveFileSize(log)}
      </td>

      {/* Security Rating */}
      <td className="px-4 md:px-6 py-4 text-center">
        <span
          className={`text-[9px] font-extrabold px-2.5 py-0.5 border rounded-md font-mono inline-block tracking-widest ${badge.className}`}
        >
          {badge.label}
        </span>
      </td>

      {/* Action Vectors */}
      <td className="px-4 md:px-6 py-4 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDossier();
          }}
          className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 transition-all group-hover:underline underline-offset-2"
          title="Open intelligence dossier"
          aria-label={`Open dossier for ${log.scenario_title}`}
        >
          <span className="hidden sm:inline">Dossier</span>
          <span>📥</span>
          <ChevronDown className="h-3 w-3 -rotate-90" />
        </button>
      </td>
    </tr>
  );
}
