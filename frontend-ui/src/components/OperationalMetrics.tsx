"use client";

import React from "react";
import { Ship, AlertCircle, Radio, GitFork, Anchor, TrendingUp, TrendingDown } from "lucide-react";

interface OperationalMetricsProps {
  data: any;
}

export default function OperationalMetrics({ data }: OperationalMetricsProps) {
  // Check if a tactical reroute has been triggered by the backend agent
  const rerouteActive = data?.logistics_mitigation?.reroute_triggered || false;

  // Baseline data metrics mirroring an enterprise maritime situational desk
  const metrics = [
    {
      title: "Total Vessels",
      value: "1,248",
      change: "+8.5%",
      isUp: true,
      icon: Ship,
      iconColor: "text-slate-700 bg-slate-100 border-slate-200",
    },
    {
      title: "High Risk Alerts",
      value: rerouteActive ? "24" : "23",
      change: rerouteActive ? "+32.1%" : "+27.0%",
      isUp: true,
      icon: AlertCircle,
      iconColor: rerouteActive ? "text-rose-600 bg-rose-50 border-rose-200" : "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Active Incidents",
      value: rerouteActive ? "18" : "17",
      change: "+13.0%",
      isUp: true,
      icon: Radio,
      iconColor: "text-slate-700 bg-slate-100 border-slate-200",
    },
    {
      title: "At Risk Routes",
      value: rerouteActive ? "10" : "9",
      change: rerouteActive ? "+11.2%" : "+5.0%",
      isUp: true,
      icon: GitFork,
      iconColor: "text-slate-700 bg-slate-100 border-slate-200",
    },
    {
      title: "Monitored Ports",
      value: "86",
      change: "+4.1%",
      isUp: true,
      icon: Anchor,
      iconColor: "text-slate-700 bg-slate-100 border-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 w-full select-none">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="panel-card p-4 flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block font-mono">
                {item.title}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                  {item.value}
                </span>
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 font-mono ${
                  item.isUp ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {item.isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {item.change}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 block font-sans">vs last 7 days</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${item.iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}