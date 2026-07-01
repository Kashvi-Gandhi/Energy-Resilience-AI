"use client";

import React from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { GitFork, ShieldAlert, Clock, Shuffle, Compass, ArrowRight } from "lucide-react";

export default function RoutesPage() {
  const routesData = [
    { name: "Strait of Hormuz Bypass", corridor: "Persian Gulf → Indian Ocean", status: "STANDBY READY", statusClass: "bg-blue-50 text-blue-700 border-blue-200", delay: "+48 Hours", distance: "+450 NM", riskReduction: "92% Threat Avoidance" },
    { name: "Cape of Good Hope Diversion", corridor: "Suez Canal Transit Shift", status: "ACTIVE ROUTING", statusClass: "bg-rose-50 text-rose-700 border-rose-200", delay: "+10-12 Days", distance: "+3,500 NM", riskReduction: "100% Red Sea Risk Elimination" },
    { name: "Lombok Strait Alternate", corridor: "Malacca Congestion Corridor", status: "NOMINAL MONITOR", statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200", delay: "+3.5 Days", distance: "+820 NM", riskReduction: "65% GPS Spoofing Mitigation" }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Routes" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Transit Corridor Network</h1>
          <p className="text-xs text-slate-500 font-medium">Strategic contingency path mapping and automated risk-avoidance modeling matrices</p>
        </div>

        {/* Tactical Strategy Core Layout */}
        <div className="grid grid-cols-3 gap-6 items-start">
          
          {/* Left Column Strategy Cards Grid */}
          <div className="col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Available Mitigating Alternatives</span>
            
            {routesData.map((route, i) => (
              <div key={i} className="panel-card p-5 bg-white flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-900 font-mono tracking-tight">{route.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{route.corridor}</p>
                  </div>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md font-mono ${route.statusClass}`}>{route.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1"><Clock className="h-3 w-3" /> Schedule Impact</div>
                    <div className="font-bold text-slate-800 mt-1">{route.delay}</div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1"><Compass className="h-3 w-3" /> Extra Distance</div>
                    <div className="font-bold text-slate-800 mt-1">{route.distance}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1"><ShieldAlert className="h-3 w-3" /> Vector Safety</div>
                    <div className="font-bold text-emerald-600 mt-1">{route.riskReduction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column Engine Rules Summary Panel */}
          <div className="col-span-1 panel-card p-4 bg-white flex flex-col space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Shuffle className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">Automation Settings</span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When dynamic regional tracking threat ratings step above risk tier <span className="font-bold text-slate-800 font-mono">80/100</span>, the engine auto-recommends alternative route nodes.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-mono text-[11px]">Auto-Reroute Assets</span>
                <span className="font-bold text-emerald-600 text-[11px]">ENABLED</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-mono text-[11px]">Insurance Compliance</span>
                <span className="font-bold text-slate-700 text-[11px]">SECURED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}