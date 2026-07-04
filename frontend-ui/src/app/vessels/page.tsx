"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Ship, Search, Shield, Compass, Filter, ExternalLink, Loader2 } from "lucide-react";

export default function VesselsPage() {
  const [search, setSearch] = useState("");
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFleet() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/vessels");
        const data = await res.json();
        setFleet(data);
      } catch (err) {
        console.error("❌ Failed to stream live fleet mapping:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFleet();
  }, []);

  const filteredFleet = fleet.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) || 
    v.cargo_type?.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic metrics computed straight from the Supabase collection
  const criticalCount = fleet.filter(v => v.status?.toLowerCase().includes("critical")).length;

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Vessels" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Fleet Registry Index</h1>
            <p className="text-xs text-slate-500 font-medium">Global live AIS telemetric monitoring directly synchronized with Supabase</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search vessel or class..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Real-time Counter Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="panel-card p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Tracked Fleet Assets</span>
              <span className="text-xl font-bold font-mono text-slate-900">{fleet.length} Units</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600"><Ship className="h-4 w-4" /></div>
          </div>
          <div className="panel-card p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Active Danger Conditions</span>
              <span className="text-xl font-bold font-mono text-rose-600">{criticalCount} Vessels</span>
            </div>
            <div className="p-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-600"><Shield className="h-4 w-4" /></div>
          </div>
          <div className="panel-card p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Avg Fleet Operational Speed</span>
              <span className="text-xl font-bold font-mono text-slate-900">15.8 Knots</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600"><Compass className="h-4 w-4" /></div>
          </div>
        </div>

        {/* Live Database Data Ledger View */}
        <div className="panel-card bg-white overflow-hidden flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Querying Relational Supabase Ledger...</span>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 font-mono">
                    <th className="px-6 py-3">Vessel Tracking Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Assigned Route Corridor</th>
                    <th className="px-6 py-3">Destination Hub</th>
                    <th className="px-6 py-3 text-center">Threat Rating</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredFleet.map((v, i) => (
                    <tr key={v.id || i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-900">{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">LAT: {v.current_lat} | LON: {v.current_lon}</div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500 text-[11px]">{v.cargo_type}</td>
                      <td className="px-6 py-3.5 text-slate-600 font-medium">
                        {v.supply_routes?.route_name || "Direct Unrouted Channel"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500">
                        {v.refineries?.refinery_name || "Awaiting Orders"}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-md font-mono ${
                          v.status?.toLowerCase().includes("critical") 
                            ? "bg-rose-50 text-rose-700 border-rose-200" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>{v.status}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                          Dossier <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}