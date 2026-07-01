"use client";

import React from "react";
import { AlertTriangle, Ship, ShieldCheck, Flame, Calendar, MapPin } from "lucide-react";

interface ScoutAssessment {
  risk_score: number;
  primary_threat: string;
  target_route_id: string | null;
}

interface LogisticsMitigation {
  reroute_triggered: boolean;
  affected_vessels: string[];
  strategic_recommendation: string;
}

interface InsightCardProps {
  scout: ScoutAssessment;
  logistics: LogisticsMitigation;
}

export default function InsightCard({ scout, logistics }: InsightCardProps) {
  const isHighRisk = scout.risk_score >= 70;

  // Tailor badge colors based on threat levels calculated dynamically
  const getSeverityStyles = (score: number) => {
    if (score >= 75) return { border: "border-red-500/30", bg: "bg-red-950/40", text: "text-red-400", badge: "bg-red-500/20 text-red-400 border-red-500/40" };
    if (score >= 40) return { border: "border-amber-500/30", bg: "bg-amber-950/30", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
    return { border: "border-emerald-500/30", bg: "bg-emerald-950/20", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
  };

  const style = getSeverityStyles(scout.risk_score);

  return (
    <div className={`w-full max-h-[320px] overflow-y-auto pointer-events-auto bg-slate-900/95 backdrop-blur-md border ${style.border} rounded-xl p-5 shadow-2xl transition-all duration-300 grid grid-cols-1 md:grid-cols-3 gap-6`}>
      
      {/* Column 1: Scout Critical Metrics */}
      <div className="flex flex-col justify-between border-r border-slate-800 pr-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-400" /> Intelligence Assessment
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
              SCORE: {scout.risk_score}/100
            </span>
          </div>
          <h3 className={`text-lg font-bold tracking-tight ${style.text} mb-1`}>
            {isHighRisk ? "Critical Disruption Alert" : "Operational Buffer Normal"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
            {scout.primary_threat}
          </p>
        </div>
        
        {scout.target_route_id && (
          <div className="text-[10px] font-mono text-slate-500 mt-2 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-500" /> Sector ID: {scout.target_route_id.substring(0, 8)}...
          </div>
        )}
      </div>

      {/* Column 2: Logistics Action Routing Status */}
      <div className="flex flex-col justify-between border-r border-slate-800 pr-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <Ship className="h-4 w-4 text-blue-400" /> Tactical Diversions
          </span>
          
          {logistics.reroute_triggered ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>+10 Days Transit Alteration Enforced</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Target Fleet Intercepts ({logistics.affected_vessels.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto pr-1">
                  {logistics.affected_vessels.length > 0 ? (
                    logistics.affected_vessels.map((vessel, index) => (
                      <span key={index} className="text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                        {vessel}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No active tankers tracked in this corridor grid.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center h-full">
              <ShieldCheck className="h-10 w-10 text-emerald-500/60 mb-2" />
              <p className="text-xs font-medium text-emerald-400">Routes Unchanged</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Fleet processing along standard corridors.</p>
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Strategic Sovereign Directive */}
      <div className="flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Calendar className="h-4 w-4 text-emerald-400" /> Sovereign Directive
          </span>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 max-h-[160px] overflow-y-auto">
            <p className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
              {logistics.strategic_recommendation}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}