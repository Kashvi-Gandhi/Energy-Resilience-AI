"use client";

import React from "react";
import { ShieldAlert, Info } from "lucide-react";

interface VesselsTableProps {
  data: any;
}

export default function VesselsTable({ data }: VesselsTableProps) {
  const rerouteActive = data?.logistics_mitigation?.reroute_triggered || false;

  // Mock array mirroring the exact vessel telemetry in the target UI reference
  const baseVessels = [
    {
      name: "MT Ocean Pioneer",
      type: "Oil Tanker",
      location: "Gulf of Oman",
      route: "Kuwait → Singapore",
      riskScore: rerouteActive ? 94 : 89,
      badge: "CRITICAL",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      eta: "Jun 8, 14:30",
    },
    {
      name: "MV Sea Horizon",
      type: "Container Ship",
      location: "Bab-el-Mandeb",
      route: "Jeddah → Rotterdam",
      riskScore: rerouteActive ? 82 : 76,
      badge: "HIGH",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      eta: "Jun 10, 09:15",
    },
    {
      name: "MT Blue Whale",
      type: "Oil Tanker",
      location: "Gulf of Aden",
      route: "Dubai → Suez",
      riskScore: rerouteActive ? 85 : 82,
      badge: "HIGH",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      eta: "Jun 9, 22:45",
    },
    {
      name: "MV Global Star",
      type: "Container Ship",
      location: "Malacca Strait",
      route: "Shanghai → Mumbai",
      riskScore: 68,
      badge: "MEDIUM",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      eta: "Jun 12, 11:00",
    }
  ];

  return (
    <div className="panel-card bg-white overflow-hidden select-none flex flex-col">
      
      {/* Table Title Panel Row */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            Vessels At Geopolitical Risk Matrix
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
          <Info className="h-3 w-3" /> Live AIS Core Sync
        </span>
      </div>

      {/* Grid Table Block Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30 font-mono">
              <th className="px-6 py-3 font-semibold">Vessel Name</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Current Location</th>
              <th className="px-6 py-3 font-semibold">Transit Route Corridor</th>
              <th className="px-6 py-3 font-semibold text-center">Risk Score</th>
              <th className="px-6 py-3 font-semibold text-center">Status</th>
              <th className="px-6 py-3 font-semibold">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
            {baseVessels.map((vessel, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-3.5 font-bold text-slate-900">{vessel.name}</td>
                <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">{vessel.type}</td>
                <td className="px-6 py-3.5 text-slate-600 font-medium">{vessel.location}</td>
                <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">{vessel.route}</td>
                <td className="px-6 py-3.5 text-center">
                  <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    vessel.riskScore >= 85 ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"
                  }`}>
                    {vessel.riskScore}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-md font-mono ${vessel.badgeClass}`}>
                    {vessel.badge}
                  </span>
                </td>
                <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">{vessel.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}