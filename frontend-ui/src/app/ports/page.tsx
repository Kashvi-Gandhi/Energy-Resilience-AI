"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Anchor, Search, Clock, Filter, Loader2 } from "lucide-react";

export default function PortsPage() {
  const [search, setSearch] = useState("");
  const [ports, setPorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPorts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ports");
        const data = await res.json();
        setPorts(data);
      } catch (err) {
        console.error("❌ Refineries database pull broken:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPorts();
  }, []);

  const filteredPorts = ports.filter(p => 
    p.refinery_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Ports" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Terminal & Port Hub Ledger</h1>
            <p className="text-xs text-slate-500 font-medium">Global transshipment capacity tracking and product matrix matching</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search destination node..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="panel-card bg-white overflow-hidden flex-1 flex flex-col justify-start">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Syncing Terminal Infrastructure...</span>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 font-mono">
                    <th className="px-6 py-3">Terminal Complex</th>
                    <th className="px-6 py-3">Geographic Tracking Location</th>
                    <th className="px-6 py-3">Capacity (MPDA)</th>
                    <th className="px-6 py-3 text-right">Crude Array Stream Compatibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredPorts.map((p, i) => (
                    <tr key={p.id || i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <Anchor className="h-3.5 w-3.5 text-slate-400" /> {p.refinery_name}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500 text-[11px]">{p.location}</td>
                      <td className="px-6 py-3.5 text-slate-900 font-bold font-mono">{p.capacity_mpda} MT</td>
                      <td className="px-6 py-3.5 text-right font-mono text-xs text-blue-600 font-semibold">
                        {Array.isArray(p.crude_compatibility) ? p.crude_compatibility.join(" | ") : String(p.crude_compatibility)}
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