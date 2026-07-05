// "use client";

// import React from "react";
// import { Ship, AlertCircle, Radio, GitFork, Anchor, TrendingUp, TrendingDown } from "lucide-react";

// interface OperationalMetricsProps {
//   data: any;
// }

// export default function OperationalMetrics({ data }: OperationalMetricsProps) {
//   // Check if a tactical reroute has been triggered by the backend agent
//   const rerouteActive = data?.logistics_mitigation?.reroute_triggered || false;

//   // Baseline data metrics mirroring an enterprise maritime situational desk
//   const metrics = [
//     {
//       title: "Total Vessels",
//       value: "1,248",
//       change: "+8.5%",
//       isUp: true,
//       icon: Ship,
//       iconColor: "text-slate-700 bg-slate-100 border-slate-200",
//     },
//     {
//       title: "High Risk Alerts",
//       value: rerouteActive ? "24" : "23",
//       change: rerouteActive ? "+32.1%" : "+27.0%",
//       isUp: true,
//       icon: AlertCircle,
//       iconColor: rerouteActive ? "text-rose-600 bg-rose-50 border-rose-200" : "text-amber-600 bg-amber-50 border-amber-200",
//     },
//     {
//       title: "Active Incidents",
//       value: rerouteActive ? "18" : "17",
//       change: "+13.0%",
//       isUp: true,
//       icon: Radio,
//       iconColor: "text-slate-700 bg-slate-100 border-slate-200",
//     },
//     {
//       title: "At Risk Routes",
//       value: rerouteActive ? "10" : "9",
//       change: rerouteActive ? "+11.2%" : "+5.0%",
//       isUp: true,
//       icon: GitFork,
//       iconColor: "text-slate-700 bg-slate-100 border-slate-200",
//     },
//     {
//       title: "Monitored Ports",
//       value: "86",
//       change: "+4.1%",
//       isUp: true,
//       icon: Anchor,
//       iconColor: "text-slate-700 bg-slate-100 border-slate-200",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-5 gap-4 w-full select-none">
//       {metrics.map((item, idx) => {
//         const Icon = item.icon;
//         return (
//           <div key={idx} className="panel-card p-4 flex items-center justify-between bg-white">
//             <div className="space-y-1">
//               <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block font-mono">
//                 {item.title}
//               </span>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
//                   {item.value}
//                 </span>
//                 <span className={`text-[10px] font-semibold flex items-center gap-0.5 font-mono ${
//                   item.isUp ? "text-emerald-600" : "text-rose-600"
//                 }`}>
//                   {item.isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
//                   {item.change}
//                 </span>
//               </div>
//               <span className="text-[9px] text-slate-400 block font-sans">vs last 7 days</span>
//             </div>

//             <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${item.iconColor}`}>
//               <Icon className="h-4 w-4" />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }










"use client";

import React from "react";

interface OperationalMetricsProps {
  vessels: any[];
  threats: any[];
  simulationData: any;
}

export default function OperationalMetrics({ 
  vessels = [], 
  threats = [],
  simulationData 
}: OperationalMetricsProps) {
  
  const rerouteActive = simulationData?.logistics_mitigation?.reroute_triggered || false;

  // DYNAMIC COMPUTATION FROM LIVE DATABASE FIELDS
  const totalVesselsCount = vessels.length;
  const totalThreatsCount = threats.length;

  // Derive "High Risk Areas" based on distinct locations from active threat objects
  const uniqueRiskLocations = new Set(
    threats.map((t) => t.location || t.region).filter(Boolean)
  );
  const totalRiskAreas = uniqueRiskLocations.size || (totalThreatsCount > 0 ? Math.ceil(totalThreatsCount / 3) : 0);

  // Derive "Incidents" from threats flagged as active or high severity
  const totalIncidents = threats.filter((t) => 
    t.severity?.toLowerCase() === "high" || t.status?.toLowerCase() === "active"
  ).length || totalThreatsCount;

  // Derive "Watch Areas" dynamically from your tracked vessels unique route destinations
  const uniqueDestinations = new Set(
    vessels.map((v) => v.destination).filter(Boolean)
  );
  const totalWatchAreas = uniqueDestinations.size || 4;

  const metrics = [
    {
      title: "Vessels Tracked",
      value: totalVesselsCount.toLocaleString(),
      change: "+12%",
      isUp: true,
      subtext: "vs yesterday",
      valueColor: "text-cyan-400",
      glowBorder: "border-cyan-500/20 hover:border-cyan-500/40",
    },
    {
      title: "Threats Detected",
      value: totalThreatsCount.toLocaleString(),
      change: "+27%",
      isUp: true,
      subtext: "vs yesterday",
      valueColor: totalThreatsCount > 0 ? "text-rose-400 animate-pulse" : "text-orange-500",
      glowBorder: totalThreatsCount > 0 ? "border-rose-500/30" : "border-slate-800",
    },
    {
      title: "High Risk Areas",
      value: totalRiskAreas.toLocaleString(),
      change: "+20%",
      isUp: true,
      subtext: "vs yesterday",
      valueColor: "text-orange-400",
      glowBorder: "border-slate-800/80",
    },
    {
      title: "Incidents (24H)",
      value: totalIncidents.toLocaleString(),
      change: "-5%",
      isUp: false,
      subtext: "vs yesterday",
      valueColor: "text-cyan-400",
      glowBorder: "border-slate-800/80",
    },
    {
      title: "Watch Areas",
      value: totalWatchAreas.toLocaleString(),
      change: "active monitoring",
      isUp: null,
      subtext: "",
      valueColor: "text-cyan-400",
      glowBorder: "border-slate-800/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full select-none">
      {metrics.map((item, idx) => {
        const imageSlug = item.title.toLowerCase().replace(/\s+/g, "-");
        const imagePath = `/icons/${imageSlug}.png`;

        return (
          <div 
            key={idx} 
            className={`bg-[#060b13]/60 border p-4 flex items-center gap-4 transition-all duration-200 ${item.glowBorder}`}
          >
            {/* LEFT SIDE: Custom Icon Image */}
            <div className="shrink-0 flex items-center justify-center bg-slate-950/40 p-1.5 border border-slate-800/40 rounded">
              <img 
                src={imagePath} 
                alt=""
                className="h-7 w-7 object-contain opacity-90"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.3';
                }}
              />
            </div>

            {/* RIGHT SIDE: Dynamic Readout values */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-medium tracking-widest uppercase text-slate-400 block font-mono">
                {item.title}
              </span>
              
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-2xl font-bold tracking-tight font-mono ${item.valueColor}`}>
                  {item.value}
                </span>
              </div>
              
              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono">
                {item.isUp !== null ? (
                  <>
                    <span className={item.isUp ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                      {item.change}
                    </span>
                    <span className="text-slate-500 text-[9px] font-sans">
                      {item.subtext}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 font-sans text-[9px] lowercase tracking-wide">
                    {item.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}