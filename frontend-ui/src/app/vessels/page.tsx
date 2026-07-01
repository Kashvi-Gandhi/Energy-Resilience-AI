"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Ship, Search, Shield, Anchor, Compass, Filter, ExternalLink } from "lucide-react";

export default function VesselsPage() {
  const [search, setSearch] = useState("");

  const fleet = [
    { name: "MT Ocean Pioneer", type: "Oil Tanker", flag: "Panama", imo: "IMO 9432105", heading: "042° NE", speed: "14.2 kn", status: "CRITICAL RISK", class: "bg-rose-50 text-rose-700 border-rose-200" },
    { name: "MV Sea Horizon", type: "Container Ship", flag: "Singapore", imo: "IMO 9722344", heading: "185° S", speed: "21.0 kn", status: "HIGH RISK", class: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "MT Blue Whale", type: "LNG Carrier", flag: "Marshall Is.", imo: "IMO 9511099", heading: "290° W", speed: "16.5 kn", status: "HIGH RISK", class: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "MV Global Star", type: "Bulk Carrier", flag: "Liberia", imo: "IMO 9388122", heading: "088° E", speed: "12.0 kn", status: "NOMINAL", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "MT Northern Aurora", type: "Crude Oil Tanker", flag: "Norway", imo: "IMO 9644310", heading: "340° NW", speed: "15.1 kn", status: "NOMINAL", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  const filteredFleet = fleet.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Vessels" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Fleet Registry Index</h1>
            <p className="text-xs text-slate-500 font-medium">Global live AIS telemetric monitoring and risk structural classification</p>
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
            <button className="panel-card bg-white px-3 py-1.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:bg-slate-50">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Micro Telemetry Widgets */}
        <div className="grid grid-cols-3 gap-4">
          <div className="panel-card p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Monitored Fleet Assets</span>
              <span className="text-xl font-bold font-mono text-slate-900">1,248 Units</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600"><Ship className="h-4 w-4" /></div>
          </div>
          <div className="panel-card p-4 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Active Danger Conditions</span>
              <span className="text-xl font-bold font-mono text-rose-600">3 Vessels</span>
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

        {/* Master Fleet Ledger */}
        <div className="panel-card bg-white overflow-hidden flex-1">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 font-mono">
                  <th className="px-6 py-3">Vessel Tracking Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Registry Flag</th>
                  <th className="px-6 py-3">True Heading</th>
                  <th className="px-6 py-3">AIS Velocity</th>
                  <th className="px-6 py-3 text-center">Threat Rating</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredFleet.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.imo}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-500 text-[11px]">{v.type}</td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{v.flag}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-500">{v.heading}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-900 font-semibold">{v.speed}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-md font-mono ${v.class}`}>{v.status}</span>
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
        </div>

      </div>
    </div>
  );
}