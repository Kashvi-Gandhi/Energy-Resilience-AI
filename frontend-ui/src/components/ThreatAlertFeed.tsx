"use client";

import React, { useState } from "react";
import { Radio, AlertTriangle, ShieldAlert, Navigation, Loader2 } from "lucide-react";

interface ThreatFeedProps {
  onSimulate: (scenario: string) => Promise<void>;
  isLoading: boolean;
}

export default function ThreatAlertFeed({ onSimulate, isLoading }: ThreatFeedProps) {
  const [customInput, setCustomInput] = useState("");

  const scenarios = [
    {
      title: "Hormuz Naval Drill Activity",
      badge: "HIGH",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      indicatorClass: "bg-rose-500",
      time: "2 min ago",
      text: "Unannounced naval military exercises have closed down two major commercial shipping lanes inside the Strait of Hormuz.",
    },
    {
      title: "Bab-el-Mandeb Drone Threat",
      badge: "MEDIUM",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      indicatorClass: "bg-amber-500",
      time: "15 min ago",
      text: "Security operations confirm regional military factions have deployed sea-drones and anti-ship missile cells along the coastal shelf of the Bab-el-Mandeb Strait.",
    },
    {
      title: "Malacca Strait Spoofing",
      badge: "HIGH",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      indicatorClass: "bg-rose-500",
      time: "32 min ago",
      text: "Electronic warfare monitors have confirmed massive, systematic GPS signal spoofing and AIS manipulation targeting commercial shipping lanes inside the Malacca Strait.",
    }
  ];

  return (
    <div className="flex flex-col h-full min-h-[520px] justify-between space-y-4 select-none">
      
      {/* Dynamic Active Stream Panel Head */}
      <div className="panel-card p-4 bg-white flex flex-col space-y-3 flex-1">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Live Threat Intercepts
          </span>
          <span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">View All</span>
        </div>

        {/* Incidents Stream List */}
        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {scenarios.map((item, index) => (
            <button
              key={index}
              disabled={isLoading}
              onClick={() => onSimulate(item.text)}
              className="w-full text-left p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group flex flex-col gap-1.5 disabled:opacity-50 relative bg-white"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.indicatorClass}`} />
                  <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors font-sans leading-tight">
                    {item.title}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded font-mono ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 pl-3.5">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Action Entry Sandbox Component Card */}
      <div className="panel-card p-4 bg-white flex flex-col space-y-3 h-[220px] shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2 border-b border-slate-100 pb-2">
          <Navigation className="h-3.5 w-3.5 text-emerald-500" /> Custom Crisis Sandbox
        </span>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Input custom intelligence vectors or maritime disruption parameters..."
          className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-sans"
        />
        <button
          onClick={() => { if (customInput.trim()) onSimulate(customInput); }}
          disabled={isLoading || !customInput.trim()}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 tracking-wide uppercase font-mono border border-slate-800 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
              Processing...
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5" />
              Execute Tactical Simulation
            </>
          )}
        </button>
      </div>

    </div>
  );
}