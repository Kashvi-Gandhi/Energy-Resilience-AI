"use client";

import React, { useState, useEffect, useCallback } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import {
  Server,
  Database,
  BrainCircuit,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  Info,
  ExternalLink,
  Shield,
  Activity,
  Sliders,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ConnectionStatus {
  status: "checking" | "online" | "offline";
  latency?: number;
  detail?: string;
}

interface DbCounts {
  vessels: number | null;
  threats: number | null;
  ports: number | null;
  routes: number | null;
  simulation_logs: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function maskKey(key: string): string {
  if (!key || key.length < 12) return "••••••••••••";
  return key.slice(0, 6) + "••••••••••••" + key.slice(-4);
}

function StatusDot({ status }: { status: ConnectionStatus["status"] }) {
  if (status === "checking")
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />;
  if (status === "online")
    return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
  return <XCircle className="h-3.5 w-3.5 text-rose-500" />;
}

function StatusBadge({ status }: { status: ConnectionStatus["status"] }) {
  const cfg = {
    checking: "bg-slate-100 text-slate-500 border-slate-200",
    online: "bg-emerald-50 text-emerald-700 border-emerald-200",
    offline: "bg-rose-50 text-rose-700 border-rose-200",
  }[status];
  return (
    <span className={`text-[9px] font-extrabold font-mono px-2 py-0.5 border rounded-md tracking-widest uppercase ${cfg}`}>
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <span className="text-[11px] font-black text-slate-700 font-mono uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const BACKEND_URL = "http://127.0.0.1:8000";

  // Connection states
  const [backendStatus, setBackendStatus] = useState<ConnectionStatus>({ status: "checking" });
  const [supabaseStatus, setSupabaseStatus] = useState<ConnectionStatus>({ status: "checking" });
  const [geminiStatus, setGeminiStatus] = useState<ConnectionStatus>({ status: "checking" });

  // DB table counts
  const [dbCounts, setDbCounts] = useState<DbCounts>({
    vessels: null,
    threats: null,
    ports: null,
    routes: null,
    simulation_logs: null,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Simulation defaults (read from localStorage, persisted across sessions)
  const [defaultPremiumSurge, setDefaultPremiumSurge] = useState(25);
  const [defaultSector, setDefaultSector] = useState("Strait of Hormuz Corridor");
  const [savedMsg, setSavedMsg] = useState(false);

  // ---------------------------------------------------------------------------
  // Load saved simulation defaults from localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const surge = localStorage.getItem("sim_default_premium_surge");
    const sector = localStorage.getItem("sim_default_sector");
    if (surge) setDefaultPremiumSurge(Number(surge));
    if (sector) setDefaultSector(sector);
  }, []);

  // ---------------------------------------------------------------------------
  // Check backend health
  // ---------------------------------------------------------------------------
  const checkBackend = useCallback(async () => {
    setBackendStatus({ status: "checking" });
    const t0 = Date.now();
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
      const latency = Date.now() - t0;
      if (res.ok) {
        setBackendStatus({ status: "online", latency, detail: "FastAPI engine responding" });
      } else {
        setBackendStatus({ status: "offline", detail: `HTTP ${res.status}` });
      }
    } catch {
      setBackendStatus({ status: "offline", detail: "Connection refused — start uvicorn" });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Check Supabase connectivity
  // ---------------------------------------------------------------------------
  const checkSupabase = useCallback(async () => {
    setSupabaseStatus({ status: "checking" });
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setSupabaseStatus({ status: "offline", detail: "Missing env vars" });
      return;
    }
    const t0 = Date.now();
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ports?select=id&limit=1`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      const latency = Date.now() - t0;
      if (res.ok) {
        setSupabaseStatus({ status: "online", latency, detail: "PostgREST responding" });
      } else {
        setSupabaseStatus({ status: "offline", detail: `HTTP ${res.status}` });
      }
    } catch {
      setSupabaseStatus({ status: "offline", detail: "Network error" });
    }
  }, [SUPABASE_URL, SUPABASE_KEY]);

  // ---------------------------------------------------------------------------
  // Check Gemini via backend proxy
  // ---------------------------------------------------------------------------
  const checkGemini = useCallback(async () => {
    setGeminiStatus({ status: "checking" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        // If backend is up, Gemini key is loaded (backend won't start without it)
        setGeminiStatus({ status: "online", detail: "API key loaded in backend" });
      } else {
        setGeminiStatus({ status: "offline", detail: "Backend not reachable" });
      }
    } catch {
      setGeminiStatus({ status: "offline", detail: "Backend not reachable" });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch DB row counts directly from Supabase
  // ---------------------------------------------------------------------------
  const fetchDbCounts = useCallback(async () => {
    setCountsLoading(true);
    if (!SUPABASE_URL || !SUPABASE_KEY) { setCountsLoading(false); return; }

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "count=exact",
    };

    const tables: (keyof DbCounts)[] = ["vessels", "active_threats", "ports", "supply_routes", "simulation_logs"];
    const endpoints: Record<keyof DbCounts, string> = {
      vessels: "vessels",
      threats: "active_threats",
      ports: "ports",
      routes: "supply_routes",
      simulation_logs: "simulation_logs",
    };

    const results: Partial<DbCounts> = {};

    await Promise.all(
      (["vessels", "threats", "ports", "routes", "simulation_logs"] as (keyof DbCounts)[]).map(async (key) => {
        try {
          const res = await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoints[key]}?select=id&limit=1`,
            { headers }
          );
          // Supabase returns count in Content-Range header: "0-0/42"
          const range = res.headers.get("content-range");
          const count = range ? parseInt(range.split("/")[1], 10) : null;
          results[key] = isNaN(count as number) ? null : count;
        } catch {
          results[key] = null;
        }
      })
    );

    setDbCounts((prev) => ({ ...prev, ...results }));
    setCountsLoading(false);
  }, [SUPABASE_URL, SUPABASE_KEY]);

  // Run all checks on mount
  useEffect(() => {
    checkBackend();
    checkSupabase();
    checkGemini();
    fetchDbCounts();
  }, [checkBackend, checkSupabase, checkGemini, fetchDbCounts]);

  // ---------------------------------------------------------------------------
  // Save simulation defaults
  // ---------------------------------------------------------------------------
  function saveSimDefaults() {
    localStorage.setItem("sim_default_premium_surge", String(defaultPremiumSurge));
    localStorage.setItem("sim_default_sector", defaultSector);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  }

  // ---------------------------------------------------------------------------
  // Re-check all
  // ---------------------------------------------------------------------------
  function recheckAll() {
    checkBackend();
    checkSupabase();
    checkGemini();
    fetchDbCounts();
  }

  // ---------------------------------------------------------------------------
  // DB count rows config
  // ---------------------------------------------------------------------------
  const dbRows: { label: string; key: keyof DbCounts; color: string }[] = [
    { label: "Vessels", key: "vessels", color: "text-cyan-600" },
    { label: "Active Threats", key: "threats", color: "text-rose-600" },
    { label: "Ports", key: "ports", color: "text-amber-600" },
    { label: "Supply Routes", key: "routes", color: "text-blue-600" },
    { label: "Simulation Logs", key: "simulation_logs", color: "text-emerald-600" },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Settings" />

      <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-5 overflow-y-auto">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex items-end justify-between shrink-0">
          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
              Settings Command Desk
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              System diagnostics, connection health, and operational defaults
            </p>
          </div>
          <button
            onClick={recheckAll}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold font-mono border border-slate-200 bg-white hover:bg-slate-50 rounded-xl shadow-sm transition-colors text-slate-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recheck All
          </button>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── 1. API Connection Status ── */}
          <Section icon={Server} title="API Connection Status">
            <div className="space-y-4">

              {/* Backend */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <StatusDot status={backendStatus.status} />
                  <div>
                    <div className="text-xs font-bold text-slate-800 font-mono">FastAPI Backend</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {BACKEND_URL}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={backendStatus.status} />
                  {backendStatus.latency && (
                    <div className="text-[9px] text-slate-400 font-mono mt-1">
                      {backendStatus.latency}ms
                    </div>
                  )}
                  {backendStatus.detail && (
                    <div className="text-[9px] text-slate-500 mt-0.5 max-w-[140px] text-right">
                      {backendStatus.detail}
                    </div>
                  )}
                </div>
              </div>

              {/* Supabase */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <StatusDot status={supabaseStatus.status} />
                  <div>
                    <div className="text-xs font-bold text-slate-800 font-mono">Supabase PostgREST</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-[180px] truncate">
                      {SUPABASE_URL || "Not configured"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={supabaseStatus.status} />
                  {supabaseStatus.latency && (
                    <div className="text-[9px] text-slate-400 font-mono mt-1">
                      {supabaseStatus.latency}ms
                    </div>
                  )}
                </div>
              </div>

              {/* Gemini */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <StatusDot status={geminiStatus.status} />
                  <div>
                    <div className="text-xs font-bold text-slate-800 font-mono">Gemini AI (via Backend)</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      gemini-2.5-flash · gemini-embedding-001
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={geminiStatus.status} />
                  {geminiStatus.detail && (
                    <div className="text-[9px] text-slate-500 mt-1 max-w-[140px] text-right">
                      {geminiStatus.detail}
                    </div>
                  )}
                </div>
              </div>

              {/* API Docs link */}
              {backendStatus.status === "online" && (
                <a
                  href={`${BACKEND_URL}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] font-mono text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open FastAPI Swagger Docs
                </a>
              )}
            </div>
          </Section>

          {/* ── 2. Database Health ── */}
          <Section icon={Database} title="Database Health / Row Counts">
            <div className="space-y-3">
              {dbRows.map(({ label, key, color }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="text-xs text-slate-600 font-medium">{label}</span>
                  <span className={`text-sm font-black font-mono ${color}`}>
                    {countsLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-300 inline" />
                    ) : dbCounts[key] !== null ? (
                      dbCounts[key]?.toLocaleString()
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </span>
                </div>
              ))}

              <button
                onClick={fetchDbCounts}
                disabled={countsLoading}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-[11px] font-mono font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${countsLoading ? "animate-spin" : ""}`} />
                Refresh Counts
              </button>
            </div>
          </Section>

          {/* ── 3. Simulation Defaults ── */}
          <Section icon={Sliders} title="Simulation Defaults">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  Default Premium Surge Scale
                </label>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">Insurance Premium Surge</span>
                  <span className="text-blue-600 font-bold">+{defaultPremiumSurge}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={defaultPremiumSurge}
                  onChange={(e) => setDefaultPremiumSurge(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  Default Sector Label
                </label>
                <input
                  type="text"
                  value={defaultSector}
                  onChange={(e) => setDefaultSector(e.target.value)}
                  placeholder="e.g. Strait of Hormuz Corridor"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono shadow-sm"
                />
                <p className="text-[10px] text-slate-400 font-sans">
                  Written to <code className="font-mono bg-slate-100 px-1 rounded">simulation_logs.sector</code> on each run.
                </p>
              </div>

              <button
                onClick={saveSimDefaults}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-black font-mono uppercase tracking-wide rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                {savedMsg ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Saved to Local Storage
                  </>
                ) : (
                  <>
                    <Settings className="h-3.5 w-3.5" />
                    Save Defaults
                  </>
                )}
              </button>
            </div>
          </Section>

          {/* ── 4. Credential Info ── */}
          <Section icon={Shield} title="Credential Overview">
            <div className="space-y-3">
              {[
                { label: "Supabase URL", value: SUPABASE_URL || "Not set", mono: true },
                { label: "Supabase Anon Key", value: SUPABASE_KEY ? maskKey(SUPABASE_KEY) : "Not set", mono: true },
                { label: "Gemini API Key", value: "Stored in backend .env (not exposed)", mono: false },
                { label: "Backend URL", value: BACKEND_URL, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                    {label}
                  </span>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] text-slate-700 truncate">
                    <span className={mono ? "font-mono" : "font-sans"}>{value}</span>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 font-sans pt-1">
                Keys are read from <code className="font-mono bg-slate-100 px-1 rounded">.env</code> and never sent to third parties.
              </p>
            </div>
          </Section>

        </div>

        {/* ── 5. About / System Info ── */}
        <Section icon={Info} title="System Information">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Frontend", value: "Next.js 14", sub: "React + Tailwind CSS" },
              { label: "Backend", value: "FastAPI", sub: "Python 3.11 + Uvicorn" },
              { label: "AI Layer", value: "Gemini 2.5", sub: "Flash + Embeddings" },
              { label: "Database", value: "Supabase", sub: "PostgreSQL + pgvector" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">{label}</div>
                <div className="text-sm font-black text-slate-900 font-mono">{value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-sans">{sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <a
              href={`${BACKEND_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-blue-600 hover:text-blue-800 border border-blue-100 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Activity className="h-3 w-3" /> FastAPI Swagger UI
            </a>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 hover:text-emerald-800 border border-emerald-100 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Database className="h-3 w-3" /> Supabase Dashboard
            </a>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-purple-600 hover:text-purple-800 border border-purple-100 bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <BrainCircuit className="h-3 w-3" /> Google AI Studio
            </a>
          </div>
        </Section>

      </div>
    </div>
  );
}
