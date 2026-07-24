// "use client";

// import React, { useState } from "react";
// import dynamic from "next/dynamic";
// import DashboardSidebar from "../components/DashboardSidebar";
// import OperationalMetrics from "../components/OperationalMetrics";
// import ThreatAlertFeed from "../components/ThreatAlertFeed";
// import VesselsTable from "../components/VesselsTable";
// import InsightCard from "../components/InsightCard";

// const InteractiveMap = dynamic(() => import("../components/InteractiveMap"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2">
//       <div className="h-4 w-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
//       <span className="font-mono text-[10px] tracking-wider uppercase">Loading GIS Tracking Array...</span>
//     </div>
//   ),
// });

// export default function GlobalDashboard() {
//   const [loading, setLoading] = useState(false);
//   const [simulationData, setSimulationData] = useState<any>(null);

//   const handleRunSimulation = async (scenario: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/simulate-crisis", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scenario }),
//       });

//       const data = await response.json();
//       if (data.status === "success") {
//         setSimulationData(data);
//       }
//     } catch (error) {
//       console.error("Simulation connection failure:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const rerouteActive = simulationData?.logistics_mitigation?.reroute_triggered || false;

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">

//       {/* COLUMN 1: Fixed Navigation Bar */}
//       <DashboardSidebar currentRoute="Overview" />

//       {/* COLUMN 2: Scrollable Data Desk Workspace */}
//       <div className="flex-1 h-full flex flex-col overflow-y-auto p-6 space-y-6">

//         {/* Top Control Bar Header */}
//         <div className="flex justify-between items-center border-b border-slate-200 pb-4 shrink-0">
//           <div>
//             <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
//               Maritime Geopolitical Risk Dashboard
//             </h1>
//             <p className="text-xs text-slate-500 font-medium">
//               AI-Powered Threat Intelligence & Supply Chain Resilience
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className={`h-2 w-2 rounded-full ${rerouteActive ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
//             <div className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-600 uppercase tracking-wider">
//               System Matrix: {rerouteActive ? "TACTICAL_DIVERSION" : "NOMINAL_MONITORING"}
//             </div>
//           </div>
//         </div>

//         {/* Five-Grid Metrics Component */}
//         <OperationalMetrics data={simulationData} />

//         {/* 🛠️ FIX HERE: Changed from grid items-stretch to a clean flexible workspace array */}
//         <div className="flex flex-col lg:flex-row gap-6 w-full items-start">

//           {/* Main Map Box - Explicitly sized to avoid vertical stretch conflicts */}
//           <div className="w-full lg:w-2/3 panel-card flex flex-col overflow-hidden h-[540px] shrink-0">
//             <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
//               <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600">
//                 Live Shipping Lane Analysis Arena
//               </span>
//               {rerouteActive && (
//                 <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
//                   ⚠️ Alternate Corridor Active
//                 </span>
//               )}
//             </div>
//             <div className="flex-1 w-full relative z-0">
//               <InteractiveMap rerouteTriggered={rerouteActive} />
//             </div>
//           </div>

//           {/* Right Threat Interactive Feed - Inherits identical height constraints perfectly */}
//           <div className="w-full lg:w-1/3 h-[540px] shrink-0">
//             <ThreatAlertFeed onSimulate={handleRunSimulation} isLoading={loading} />
//           </div>

//         </div>

//         {/* Dynamic Generative AI Intercept Card Layout */}
//         {simulationData && (
//           <div className="w-full transition-all duration-300">
//             <InsightCard
//               scout={simulationData.scout_assessment}
//               logistics={simulationData.logistics_mitigation}
//             />
//           </div>
//         )}

//         {/* Bottom Matrix Ledger Table - Completely separated from the column layout elements above */}
//         <div className="w-full pt-2">
//           <VesselsTable data={simulationData} />
//         </div>

//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../components/DashboardSidebar";
// import {
//   Ship,
//   AlertTriangle,
//   Activity,
//   GitFork,
//   Anchor,
//   Play,
//   Loader2,
//   Radio,
//   MapPin,
//   CheckCircle2,
//   ArrowUpRight,
// } from "lucide-react";
// import dynamic from "next/dynamic";

// export default function OverviewDashboard() {
//   // Database States
//   const [vessels, setVessels] = useState<any[]>([]);
//   const [threats, setThreats] = useState<any[]>([]);
//   const [routesCount, setRoutesCount] = useState(0);
//   const [portsCount, setPortsCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Simulation UI States
//   const [scenarioText, setScenarioText] = useState("");
//   const [simulating, setSimulating] = useState(false);
//   const [simResult, setSimResult] = useState<any>(null);

//   const InteractiveMap = dynamic(() => import("../components/InteractiveMap"), {
//     ssr: false,
//     loading: () => (
//       <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 font-mono text-xs uppercase">
//         <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//         <span>Loading GIS Tracking Array...</span>
//       </div>
//     ),
//   });

//   useEffect(() => {
//     async function bootstrapDashboardData() {
//       try {
//         const [vesselsRes, threatsRes, routesRes, portsRes] = await Promise.all([
//           fetch("http://127.0.0.1:8000/api/vessels"),
//           fetch("http://127.0.0.1:8000/api/threats"),
//           fetch("http://127.0.0.1:8000/api/routes"),
//           fetch("http://127.0.0.1:8000/api/ports"),
//         ]);

//         const [vesselsData, threatsData, routesData, portsData] = await Promise.all([
//           vesselsRes.ok ? vesselsRes.json() : [],
//           threatsRes.ok ? threatsRes.json() : [],
//           routesRes.ok ? routesRes.json() : [],
//           portsRes.ok ? portsRes.json() : [],
//         ]);

//         setVessels(Array.isArray(vesselsData) ? vesselsData : []);
//         setThreats(Array.isArray(threatsData) ? threatsData : []);
//         setRoutesCount(Array.isArray(routesData) ? routesData.length : 0);
//         setPortsCount(Array.isArray(portsData) ? portsData.length : 0);
//       } catch (err) {
//         console.error("❌ Core system synchronization link failed:", err);
//         setVessels([]);
//         setThreats([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     bootstrapDashboardData();
//   }, []);

//   const totalVesselsCount = Array.isArray(vessels) ? vessels.length : 0;
//   const highRiskAlertsCount = Array.isArray(vessels)
//     ? vessels.filter(
//         (v: any) =>
//           v.status?.toLowerCase().includes("critical") ||
//           v.status?.toLowerCase().includes("risk") ||
//           v.status?.toLowerCase().includes("high"),
//       ).length
//     : 0;

//   const handleRunSimulation = async () => {
//     if (!scenarioText.trim()) return;
//     setSimulating(true);
//     setSimResult(null);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/simulate-crisis", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scenario: scenarioText }),
//       });
//       const data = await response.json();
//       setSimResult(data);
//     } catch (error) {
//       console.error("❌ Agent simulation execution failure:", error);
//     } finally {
//       setSimulating(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Overview" />

//       <div className="flex-1 h-full flex flex-col p-8 space-y-8 overflow-y-auto">
//         {/* Top Header Banner Row */}
//         <div className="border-b border-slate-200 pb-4 flex justify-between items-center shrink-0">
//           <div>
//             <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase font-mono">
//               Maritime Geopolitical Risk Dashboard
//             </h1>
//             <p className="text-sm text-slate-500 font-medium mt-1">
//               AI-Powered Threat Intelligence & Supply Chain Resilience Engines
//             </p>
//           </div>
//           <div className="flex items-center gap-2.5 font-mono text-xs">
//             <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-slate-400 font-bold uppercase tracking-wider">
//               System Matrix: Live Database Connected
//             </span>
//           </div>
//         </div>

//         {/* 📊 Dynamic Metrics Matrix Row */}
//         <div className="grid grid-cols-5 gap-5 shrink-0">
//           <div className="panel-card p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
//             <div>
//               <span className="text-xs font-bold text-slate-400 font-mono uppercase block tracking-wider">
//                 Total Vessels
//               </span>
//               <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-300" /> : totalVesselsCount}
//               </span>
//               <span className="text-xs font-mono text-emerald-600 block mt-1">
//                 Live AIS Fleet
//               </span>
//             </div>
//             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
//               <Ship className="h-5 w-5" />
//             </div>
//           </div>

//           <div className="panel-card p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
//             <div>
//               <span className="text-xs font-bold text-slate-400 font-mono uppercase block tracking-wider">
//                 High Risk Alerts
//               </span>
//               <span className="text-2xl font-black font-mono text-rose-600 mt-1 block">
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-300" /> : highRiskAlertsCount}
//               </span>
//               <span className="text-xs font-mono text-rose-400 block mt-1">
//                 Routing Target Vectors
//               </span>
//             </div>
//             <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-600">
//               <AlertTriangle className="h-5 w-5" />
//             </div>
//           </div>

//           <div className="panel-card p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
//             <div>
//               <span className="text-xs font-bold text-slate-400 font-mono uppercase block tracking-wider">
//                 Active Incidents
//               </span>
//               <span className="text-2xl font-black font-mono text-amber-600 mt-1 block">
//                 {loading ? "..." : (Array.isArray(threats) ? threats.length : 0)}
//               </span>
//               <span className="text-xs font-mono text-amber-500 block mt-1">
//                 Geopolitical Feed
//               </span>
//             </div>
//             <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
//               <Activity className="h-5 w-5" />
//             </div>
//           </div>

//           <div className="panel-card p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
//             <div>
//               <span className="text-xs font-bold text-slate-400 font-mono uppercase block tracking-wider">
//                 At Risk Routes
//               </span>
//               <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
//                 {loading ? "..." : routesCount}
//               </span>
//               <span className="text-xs font-mono text-slate-400 block mt-1">
//                 Monitored Corridors
//               </span>
//             </div>
//             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
//               <GitFork className="h-5 w-5" />
//             </div>
//           </div>

//           <div className="panel-card p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
//             <div>
//               <span className="text-xs font-bold text-slate-400 font-mono uppercase block tracking-wider">
//                 Monitored Ports
//               </span>
//               <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
//                 {loading ? "..." : portsCount}
//               </span>
//               <span className="text-xs font-mono text-slate-400 block mt-1">
//                 Refinery Nodes
//               </span>
//             </div>
//             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
//               <Anchor className="h-5 w-5" />
//             </div>
//           </div>
//         </div>

//         {/* 🗺️ Main Balanced Grid Workspace */}
//         <div className="grid grid-cols-3 gap-6 items-start">
//           {/* LEFT COLUMN: Map Canvas & Risk Matrix Table */}
//           <div className="col-span-2 space-y-6">
//             {/* Dynamic Map Visualizer */}
//             <div className="panel-card bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[380px] flex flex-col">
//               <div className="p-4 border-b border-slate-100 bg-slate-50/50 font-mono text-xs font-black text-slate-700 uppercase tracking-wider">
//                 Dynamic AIS Vector Tracking Map Area
//               </div>
//               <div className="flex-1 w-full relative z-0 border-t border-slate-100">
//                 <InteractiveMap
//                   rerouteTriggered={simResult?.logistics_mitigation?.reroute_triggered || false}
//                 />
//               </div>
//             </div>

//             {/* Vessels Risk Ledger Matrix Table */}
//             <div className="panel-card bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-start">
//               <div className="p-4 border-b border-slate-100 bg-slate-50/50 font-mono text-xs font-black text-slate-700 uppercase tracking-wider flex justify-between items-center">
//                 <span>Vessels At Geopolitical Risk Matrix</span>
//                 <a
//                   href="/vessels"
//                   className="text-xs font-bold text-blue-600 hover:text-blue-800 font-mono tracking-tight uppercase flex items-center gap-0.5"
//                 >
//                   Full Registry <ArrowUpRight className="h-3.5 w-3.5" />
//                 </a>
//               </div>
//               <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20 font-mono">
//                       <th className="px-5 py-3">Vessel Tracking Name</th>
//                       <th className="px-5 py-3">Type</th>
//                       <th className="px-5 py-3">Assigned Route Corridor</th>
//                       <th className="px-5 py-3 text-center">Threat Rating</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
//                     {loading ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="text-center py-6 font-mono text-slate-400 uppercase tracking-wider"
//                         >
//                           <Loader2 className="h-4 w-4 animate-spin inline mr-2 text-blue-600" />{" "}
//                           Connecting to Fleet Registry Ledger...
//                         </td>
//                       </tr>
//                     ) : !Array.isArray(vessels) || vessels.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="text-center py-6 font-mono text-slate-400 uppercase"
//                         >
//                           No active vessel telemetry assets mapped
//                         </td>
//                       </tr>
//                     ) : (
//                       vessels.slice(0, 5).map((v, i) => (
//                         <tr key={v.id || i} className="hover:bg-slate-50/60 transition-colors">
//                           <td className="px-5 py-3.5">
//                             <div className="font-bold text-slate-900 text-sm">{v.name}</div>
//                             <div className="text-[11px] text-slate-400 font-mono mt-0.5">
//                               LAT: {v.current_lat} | LON: {v.current_lon}
//                             </div>
//                           </td>
//                           <td className="px-5 py-3.5 font-mono text-slate-500">
//                             {v.cargo_type}
//                           </td>
//                           <td className="px-5 py-3.5 text-slate-600 font-medium">
//                             {v.supply_routes?.route_name || "Direct Channel Passage"}
//                           </td>
//                           <td className="px-5 py-3.5 text-center">
//                             <span
//                               className={`text-[10px] font-extrabold px-2.5 py-1 border rounded-md font-mono uppercase tracking-wide ${
//                                 v.status?.toLowerCase().includes("critical") ||
//                                 v.status?.toLowerCase().includes("danger")
//                                   ? "bg-rose-50 text-rose-700 border-rose-200"
//                                   : "bg-emerald-50 text-emerald-700 border-emerald-200"
//                               }`}
//                             >
//                               {v.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Live Threats Panel + Sandbox Widget */}
//           <div className="col-span-1 flex flex-col space-y-6">
//             {/* Live Threat Intercepts Panel */}
//             <div className="panel-card bg-white border border-slate-200 p-5 flex flex-col h-[340px] shadow-sm rounded-xl">
//               <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
//                 <span className="text-xs font-black font-mono uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
//                   <Radio className="h-4 w-4 text-rose-500 animate-pulse" /> Live Threat Intercepts
//                 </span>
//                 <a
//                   href="/threats"
//                   className="text-xs font-bold text-blue-600 hover:text-blue-800 font-mono tracking-tight uppercase flex items-center gap-0.5"
//                 >
//                   View All <ArrowUpRight className="h-3.5 w-3.5" />
//                 </a>
//               </div>

//               <div className="flex-1 overflow-y-auto space-y-3.5 pt-3 pr-0.5">
//                 {loading ? (
//                   <div className="h-full flex flex-col items-center justify-center text-slate-300 font-mono text-xs uppercase gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin text-blue-600" /> Querying Feeds...
//                   </div>
//                 ) : !Array.isArray(threats) || threats.length === 0 ? (
//                   <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs uppercase">
//                     No intelligence alerts logged
//                   </div>
//                 ) : (
//                   threats.map((threat, index) => (
//                     <div
//                       key={threat.id || index}
//                       className="p-3.5 border border-slate-100 bg-slate-50/60 rounded-xl space-y-1.5 transition-all hover:border-slate-200"
//                     >
//                       <div className="flex justify-between items-start gap-2">
//                         <h4 className="font-bold text-sm text-slate-900 font-mono uppercase tracking-tight leading-tight">
//                           {threat.title}
//                         </h4>
//                         <span className="text-[10px] font-extrabold font-mono px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded shrink-0">
//                           {threat.supply_routes?.risk_score || 50}
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-600 leading-relaxed font-sans">
//                         {threat.content}
//                       </p>
//                       <div className="text-[10px] font-mono text-slate-400 pt-0.5 flex items-center gap-1">
//                         <MapPin className="h-3 w-3" /> Corridor:{" "}
//                         {threat.supply_routes?.route_name || "Global Tracking Zone"}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Custom Crisis Sandbox */}
//             <div className="panel-card p-5 bg-white flex flex-col space-y-4 shadow-sm border border-slate-200 rounded-xl">
//               <h3 className="text-sm font-black uppercase text-slate-700 font-mono tracking-wider flex items-center gap-2">
//                 <Play className="h-4 w-4 text-emerald-500" /> Custom Crisis Sandbox
//               </h3>

//               <div className="flex flex-col gap-4 w-full">
//                 <textarea
//                   value={scenarioText}
//                   onChange={(e) => setScenarioText(e.target.value)}
//                   placeholder="Input custom intelligence vectors or maritime disruption parameters..."
//                   className="w-full h-24 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none font-sans"
//                 />

//                 <button
//                   onClick={handleRunSimulation}
//                   disabled={simulating || !scenarioText.trim()}
//                   className="w-full bg-slate-900 text-white font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
//                 >
//                   {simulating ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" /> Orchestrating Strategic Agents...
//                     </>
//                   ) : (
//                     <>Execute Tactical Simulation</>
//                   )}
//                 </button>

//                 {simResult && (
//                   <div className="w-full bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 shadow-md">
//                     <div className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1.5">
//                       <CheckCircle2 className="h-3.5 w-3.5" /> Payload Compiled
//                     </div>
//                     <div className="space-y-1 text-xs">
//                       <div>
//                         <span className="text-slate-500">Risk Score:</span>{" "}
//                         <span className="text-amber-400 font-bold text-sm">
//                           {simResult.scout_assessment?.risk_score ?? 50}/100
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-slate-500">Action:</span>{" "}
//                         <span className="text-rose-400 font-bold">
//                           {simResult.logistics_mitigation?.reroute_triggered
//                             ? "REROUTED"
//                             : "NOMINAL"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, Radio } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import OperationalMetrics from "../components/OperationalMetrics";
import ThreatAlertFeed from "../components/ThreatAlertFeed";
import InsightCard from "../components/InsightCard";

/**
 * Dynamic Import: InteractiveMap Component
 * Disables SSR to prevent Leaflet hydration errors in Next.js
 * Displays tactical loading spinner during map initialization
 */
const InteractiveMap = dynamic(() => import("../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-3 font-mono text-xs uppercase tracking-widest border border-slate-900">
      <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
      <span>SYNCING GIS TRACKING ARRAY...</span>
    </div>
  ),
});

/**
 * GlobalDashboard Component
 *
 * Main command center dashboard for maritime geopolitical risk monitoring
 * Features:
 * - Real-time vessel tracking from /api/vessels endpoint
 * - Threat intelligence feed from /api/threats endpoint
 * - Interactive map visualization with crisis rerouting simulation
 * - Multi-agent AI crisis simulation orchestration
 *
 * IMPORTANT: Only fetches from VALID backend endpoints to eliminate 404 errors:
 * ✅ /api/vessels
 * ✅ /api/threats
 * ✅ /api/simulate-crisis (POST)
 *
 * REMOVED (non-existent endpoints):
 * ❌ /api/risk-areas
 * ❌ /api/incidents
 * ❌ /api/watch-areas
 */
export default function GlobalDashboard() {
  // Simulation State Management
  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  // Core Database Streams (Valid Endpoints Only)
  const [vesselsData, setVesselsData] = useState<any[]>([]);
  const [threatsData, setThreatsData] = useState<any[]>([]);

  /**
   * Database Telemetry Synchronization Effect
   * Fetches live operational data from backend FastAPI endpoints
   * Implements robust error handling and array fallback guards
   * Triggers on mount and when simulation state changes
   */
  // useEffect(() => {
  //   async function pullDatabaseTelemetry() {
  //     // STREAM 1: Fetch live vessels from validated endpoint
  //     try {
  //       const res = await fetch("http://127.0.0.1:8000/api/vessels");
  //       if (res.ok) {
  //         const payload = await res.json();
  //         // Defensive array normalization: handles both direct arrays and nested data structures
  //         setVesselsData(Array.isArray(payload) ? payload : (payload.data || []));
  //       } else {
  //         console.warn(`⚠️ Vessels endpoint returned status ${res.status}`);
  //         setVesselsData([]);
  //       }
  //     } catch (err) {
  //       console.error("❌ Database sync failed for vessels:", err);
  //       setVesselsData([]);
  //     }

  //     // STREAM 2: Fetch live threats from validated endpoint
  //     try {
  //       const res = await fetch("http://127.0.0.1:8000/api/threats");
  //       if (res.ok) {
  //         const payload = await res.json();
  //         // Defensive array normalization: handles both direct arrays and nested data structures
  //         setThreatsData(Array.isArray(payload) ? payload : (payload.data || []));
  //       } else {
  //         console.warn(`⚠️ Threats endpoint returned status ${res.status}`);
  //         setThreatsData([]);
  //       }
  //     } catch (err) {
  //       console.error("❌ Database sync failed for threats:", err);
  //       setThreatsData([]);
  //     }
  //   }

  //   pullDatabaseTelemetry();
  // }, [simulationData]);

  useEffect(() => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    async function fetchFromSupabaseDirect() {
      if (!SUPABASE_URL || !SUPABASE_KEY) return;
      const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/vessels?select=*`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setVesselsData(data);
        }
      } catch (e) { /* silent */ }

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/active_threats?select=*`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setThreatsData(data);
        }
      } catch (e) { /* silent */ }
    }

    async function pullDatabaseTelemetry() {
      let vesselsLoaded = false;
      let threatsLoaded = false;

      // Try backend first
      try {
        const res = await fetch("http://127.0.0.1:8000/api/vessels");
        if (res.ok) {
          const payload = await res.json();
          const cleanArray = Array.isArray(payload)
            ? payload
            : payload.data || payload.vessels || [];
          if (cleanArray.length > 0) {
            setVesselsData(cleanArray);
            vesselsLoaded = true;
          }
        }
      } catch (err) {
        console.warn("⚠️ Backend vessels unreachable, falling back to Supabase direct.");
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/threats");
        if (res.ok) {
          const payload = await res.json();
          const cleanArray = Array.isArray(payload)
            ? payload
            : payload.data || payload.threats || [];
          if (cleanArray.length > 0) {
            setThreatsData(cleanArray);
            threatsLoaded = true;
          }
        }
      } catch (err) {
        console.warn("⚠️ Backend threats unreachable, falling back to Supabase direct.");
      }

      // If either stream failed, query Supabase directly
      if (!vesselsLoaded || !threatsLoaded) {
        await fetchFromSupabaseDirect();
      }
    }

    pullDatabaseTelemetry();
  }, [simulationData]);
  /**
   * Simulation Orchestration Handler
   * Triggers multi-agent AI crisis response simulation via backend
   * Coordinates Scout Agent and Logistics Architect Agent workflows
   *
   * @param scenario - User-provided geopolitical scenario text input
   */
  const handleRunSimulation = async (scenario: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/simulate-crisis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario }),
        },
      );

      if (!response.ok) {
        console.error(`❌ Simulation API returned status ${response.status}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        setSimulationData(data);
      } else {
        console.warn(
          "⚠️ Simulation completed but returned non-success status:",
          data,
        );
      }
    } catch (error) {
      console.error("❌ Simulation engine connection failure:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derive reroute state from simulation logistics mitigation response
  const rerouteActive =
    simulationData?.logistics_mitigation?.reroute_triggered || false;

  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden antialiased text-slate-100 font-sans">
      {/* LEFT SIDEBAR: Navigation Panel */}
      <DashboardSidebar currentRoute="Overview" />

      {/* MAIN CONTENT AREA: Scrollable Dashboard Workspace */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* HEADER: System Status Bar */}
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-500 font-mono font-bold mb-1">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>SECURE DATA LAYER // LIVE DATABASE LINK</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Tactical Command Overview
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${rerouteActive ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`}
            />
            <div className="text-[10px] font-mono font-bold bg-slate-900/80 border border-slate-800 px-3 py-2 rounded text-slate-300 uppercase tracking-wider">
              MATRIX STATE:{" "}
              {rerouteActive ? "CRISIS_REROUTING_ACTIVE" : "NOMINAL_MONITORING"}
            </div>
          </div>
        </div>

        {/* OPERATIONAL METRICS GRID: 5-Column HUD Display */}
        <OperationalMetrics
          vessels={vesselsData}
          threats={threatsData}
          simulationData={simulationData}
        />

        {/* PRIMARY WORKSPACE: Map + Threat Feed Layout */}
        <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
          {/* LEFT PANEL: Interactive Geographic Map Canvas */}
          <div
            className={`w-full xl:w-2/3 bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-lg flex flex-col overflow-hidden h-[560px] shrink-0 transition-all duration-300 ${
              rerouteActive
                ? "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                : ""
            }`}
          >
            <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950">
              <span className="text-[11px] font-bold uppercase tracking-widest font-mono text-slate-400">
                Live Vector Shipping Corridor Map Array
              </span>
            </div>
            <div className="flex-1 w-full relative z-0">
              <InteractiveMap rerouteTriggered={rerouteActive} />
            </div>
          </div>

          {/* RIGHT PANEL: Threat Intelligence Feed + Simulation Sandbox */}
          <div className="w-full xl:w-1/3 h-[560px] shrink-0 bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-lg overflow-hidden">
            <ThreatAlertFeed
              onSimulate={handleRunSimulation}
              isLoading={loading}
            />
          </div>
        </div>

        {/* CONDITIONAL RENDER: AI Agent Insights Card */}
        {simulationData && (
          <div className="w-full transition-all duration-300">
            <InsightCard
              scout={simulationData.scout_assessment}
              logistics={simulationData.logistics_mitigation}
            />
          </div>
        )}
      </div>
    </div>
  );
}




// everything is working fine.
// except we need to refine the dossier that is downloaded on the laptop (reports and threats details)

// add the news page for next version of project