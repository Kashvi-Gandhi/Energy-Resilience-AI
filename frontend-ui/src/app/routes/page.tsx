"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Clock, ShieldAlert, Compass, Shuffle, Loader2 } from "lucide-react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    async function fetchRoutes() {
      let loaded = false;
      try {
        const res = await fetch("http://127.0.0.1:8000/api/routes");
        if (res.ok) {
          const data = await res.json();
          const clean = Array.isArray(data) ? data : [];
          if (clean.length > 0) { setRoutes(clean); loaded = true; }
        }
      } catch (err) {
        console.warn("⚠️ Backend routes unreachable, using Supabase direct.");
      }

      if (!loaded && SUPABASE_URL && SUPABASE_KEY) {
        try {
          const res = await fetch(
            `${SUPABASE_URL}/rest/v1/supply_routes?select=id,route_name,risk_score`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
          );
          if (res.ok) {
            const data = await res.json();
            setRoutes(Array.isArray(data) ? data : []);
          }
        } catch (e) { console.error("❌ Supabase routes fallback failed:", e); }
      }

      setLoading(false);
    }
    fetchRoutes();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Routes" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Transit Corridor Network</h1>
          <p className="text-xs text-slate-500 font-medium">Strategic contingency path mapping live-synced with Supabase Risk Engines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Available Mitigating Alternatives</span>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-12 bg-white rounded-xl border border-slate-200">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Loading Corridors...</span>
              </div>
            ) : (
              routes.map((route, i) => (
                <div key={route.id || i} className="panel-card p-5 bg-white flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-900 font-mono tracking-tight">{route.route_name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Geometry Vector Data Stream Attached</p>
                    </div>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md font-mono ${
                      route.risk_score > 75 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      RISK FACTOR: {route.risk_score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1"><ShieldAlert className="h-3 w-3" /> System Evaluation</div>
                      <div className="font-bold text-slate-800 mt-1">{route.risk_score > 75 ? "High Hazard Zone" : "Nominal Security Clear"}</div>
                    </div>
                    <div className="border-l border-slate-200">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1"><Compass className="h-3 w-3" /> Route Hash</div>
                      <div className="font-bold text-slate-500 mt-1 truncate max-w-[120px] mx-auto text-[10px]">{route.id}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="col-span-1 panel-card p-4 bg-white flex flex-col space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Shuffle className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">Automation Controls</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When dynamic regional tracking threat ratings cross above risk tier <span className="font-bold text-slate-800 font-mono">80/100</span>, the RAG agent triggers automated mitigation flags.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}