// "use client";

// import React, { useState } from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { Play, RotateCcw, AlertOctagon, Flame, Activity, ShieldAlert, Cpu } from "lucide-react";

// export default function SimulationPage() {
//   const [isRunning, setIsRunning] = useState(false);
//   const [activePreset, setActivePreset] = useState<string | null>(null);

//   const presets = [
//     { id: "weather", name: "Category 5 Typhoon Array", zone: "South China Sea", icon: Activity, color: "text-blue-500 bg-blue-50" },
//     { id: "blockade", name: "Chokepoint Kinetic Blockade", zone: "Strait of Hormuz", icon: Flame, color: "text-rose-500 bg-rose-50" },
//     { id: "cyber", name: "Port AIS Sat-Spoofing Wave", zone: "Rotterdam Terminals", icon: AlertOctagon, color: "text-amber-500 bg-amber-50" }
//   ];

//   const handleTriggerSim = (name: string) => {
//     setIsRunning(true);
//     setActivePreset(name);
//     setTimeout(() => {
//       setIsRunning(false);
//     }, 3000);
//   };

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Simulation" />

//       <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">

//         {/* Header Title Section */}
//         <div className="border-b border-slate-200 pb-4">
//           <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Crisis Simulation Laboratory</h1>
//           <p className="text-xs text-slate-500 font-medium">Execute predictive what-if threat modeling matrices and calculate global logistics delta outcomes</p>
//         </div>

//         {/* Sandbox Content Layout Split Grid */}
//         <div className="grid grid-cols-3 gap-6 items-start">

//           {/* LEFT PANELS: Simulation Configuration Buttons */}
//           <div className="col-span-2 space-y-4">
//             <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Select Anomaly Vectors</span>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {presets.map((p) => {
//                 const Icon = p.icon;
//                 return (
//                   <button
//                     key={p.id}
//                     onClick={() => handleTriggerSim(p.name)}
//                     disabled={isRunning}
//                     className="panel-card p-4 bg-white hover:border-blue-400 text-left transition-all flex flex-col justify-between h-36 group relative disabled:opacity-50 shadow-sm"
//                   >
//                     <div className="flex justify-between items-start w-full">
//                       <div className={`p-2 rounded-xl border ${p.color}`}>
//                         <Icon className="h-4 w-4" />
//                       </div>
//                       <Play className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <div>
//                       <h3 className="text-xs font-black text-slate-800 uppercase font-mono tracking-tight leading-tight">{p.name}</h3>
//                       <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.zone}</p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Manual Sandbox Overlap Control */}
//             <div className="panel-card p-5 bg-white space-y-4 shadow-sm">
//               <h3 className="text-xs font-black uppercase text-slate-700 font-mono tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
//                 <Cpu className="h-4 w-4 text-slate-600" /> Manual Variable Manipulation
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-xs font-mono text-slate-500">
//                   <span>Simulated Insurance Premium Surge Scale</span>
//                   <span className="font-bold text-slate-800">+25%</span>
//                 </div>
//                 <input type="range" min="0" max="100" defaultValue="25" className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
//               </div>
//             </div>
//           </div>

//           {/* RIGHT PANEL: Simulation Status Outcome Ticker */}
//           <div className="col-span-1 panel-card p-4 bg-white flex flex-col space-y-4 shadow-sm h-full min-h-[300px]">
//             <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
//               <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 flex items-center gap-1.5">
//                 <ShieldAlert className="h-4 w-4 text-slate-700" /> Simulation Matrix Log
//               </span>
//               {activePreset && (
//                 <button onClick={() => setActivePreset(null)} className="text-slate-400 hover:text-slate-600">
//                   <RotateCcw className="h-3 w-3" />
//                 </button>
//               )}
//             </div>

//             <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
//               {isRunning ? (
//                 <div className="space-y-3">
//                   <div className="h-5 w-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
//                   <p className="font-mono text-[11px] text-blue-600 uppercase font-bold tracking-wider">Compiling Logistics Reroutes...</p>
//                 </div>
//               ) : activePreset ? (
//                 <div className="space-y-2 text-left w-full font-mono text-[11px]">
//                   <div className="text-slate-400 uppercase font-bold text-[9px] tracking-wider">Active Array Node:</div>
//                   <div className="bg-rose-50 text-rose-700 font-bold p-2.5 rounded-lg border border-rose-100 text-center uppercase tracking-wide">
//                     {activePreset} ACTIVE
//                   </div>
//                   <div className="text-slate-500 text-[11px] leading-relaxed pt-2">
//                     Predictive recalculations yield an estimated macro freight delay matrix delta of <span className="font-bold text-slate-800">+14 Days</span> across associated logistics pathways.
//                   </div>
//                 </div>
//               ) : (
//                 <span className="font-mono text-[11px] text-slate-400 tracking-wider uppercase">
//                   Select a variable card to fire up calculations.
//                 </span>
//               )}
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState } from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { Sliders, Activity, Play, Loader2, CheckCircle, HelpCircle, AlertTriangle, RefreshCw } from "lucide-react";

// export default function SimulationPage() {
//   const [premiumSurge, setPremiumSurge] = useState(25);
//   const [loading, setLoading] = useState(false);
//   const [simResult, setSimResult] = useState<any | null>(null);
//   const [selectedVector, setSelectedVector] = useState<any | null>(null);

//   // Scenarios mapped precisely to your UI layout (image_2570cb.jpg & image_2afb11.png)
//   const anomalyVectors = [
//     {
//       id: "typhoon",
//       title: "CATEGORY 5 TYPHOON ARRAY",
//       location: "South China Sea",
//       icon: "⚡",
//       prompt: "A massive Category 5 Typhoon Array is moving across the South China Sea shipping corridors with waves exceeding 12 meters."
//     },
//     {
//       id: "blockade",
//       title: "CHOKEPOINT KINETIC BLOCKADE",
//       location: "Strait of Hormuz",
//       icon: "🔥",
//       prompt: "Unannounced naval military exercises and kinetic blockades have completely closed commercial shipping lanes inside the Strait of Hormuz."
//     },
//     {
//       id: "spoofing",
//       title: "PORT AIS SAT-SPOOFING WAVE",
//       location: "Rotterdam Terminals",
//       icon: "⚠️",
//       prompt: "A coordinates sat-spoofing injection wave is causing widespread telemetry disruption around the Rotterdam Port terminal entries."
//     }
//   ];

//   // Triggers the backend FastAPI multi-agent simulation pipeline
//   const runSimulationPipeline = async (vector: any) => {
//     if (!vector) return;
//     setLoading(true);
//     setSimResult(null);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/simulate-crisis", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           scenario: `${vector.prompt} Global operational insurance premiums are inflated by +${premiumSurge}%.`
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSimResult(data);
//       } else {
//         console.error("Simulation engine response error status received");
//       }
//     } catch (err) {
//       console.error("❌ Agent simulation pipeline communication crash:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
//       <DashboardSidebar currentRoute="Simulation" />

//       <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto">

//         {/* HEADER BAR */}
//         <div className="border-b border-slate-200 pb-4 shrink-0">
//           <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
//             Crisis Simulation Laboratory
//           </h1>
//           <p className="text-xs text-slate-500 font-medium">
//             Execute predictive what-if threat modeling matrices and calculate global logistics delta outcomes
//           </p>
//         </div>

//         {/* WORKSPACE LAYOUT CONTAINER */}
//         <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-0">

//           {/* LEFT PANELS COLUMN */}
//           <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-y-auto pr-1">

//             {/* ANOMALY VECTOR SELECTION CARDS */}
//             <div>
//               <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-3">
//                 Select Anomaly Vectors
//               </span>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                 {anomalyVectors.map((vector) => (
//                   <button
//                     key={vector.id}
//                     onClick={() => { setSelectedVector(vector); setSimResult(null); }}
//                     className={`text-left border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between transition-all relative overflow-hidden h-32 ${
//                       selectedVector?.id === vector.id ? "border-blue-500 ring-2 ring-blue-500/10 bg-slate-50/50" : "border-slate-200 hover:border-slate-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start w-full">
//                       <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sm">
//                         {vector.icon}
//                       </div>
//                       {selectedVector?.id === vector.id && (
//                         <span className="text-[9px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
//                           SELECTED
//                         </span>
//                       )}
//                     </div>
//                     <div className="mt-auto">
//                       <h3 className="text-xs font-black text-slate-900 font-mono tracking-tight leading-tight uppercase">
//                         {vector.title}
//                       </h3>
//                       <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vector.location}</p>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* VARIABLE ADJUSTMENTS SLIDER */}
//             <div className="border border-slate-200 bg-white rounded-xl p-4 md:p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
//                 <Sliders className="h-4 w-4 text-slate-500" />
//                 <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
//                   Manual Variable Manipulation
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between items-center text-xs font-mono">
//                   <span className="text-slate-700 font-medium">Simulated Insurance Premium Surge Scale</span>
//                   <span className="text-blue-600 font-bold">+{premiumSurge}%</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   value={premiumSurge}
//                   onChange={(e) => setPremiumSurge(Number(e.target.value))}
//                   className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
//                 />
//               </div>
//             </div>

//             {/* CORE TRIGGER CONSOLE (Matches bottom execution deck style in image_258006.jpg) */}
//             <div className="border border-slate-200 bg-slate-950 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
//               <div className="space-y-1 text-center sm:text-left">
//                 <p className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase">AUTOMATED RESPONSE PROTOCOL</p>
//                 <p className="text-xs text-slate-300 max-w-md font-sans">
//                   {selectedVector
//                     ? `Ready to push '${selectedVector.title}' configuration to live evaluation neural models.`
//                     : "Select an anomaly variable configuration card above to initialize computation path."}
//                 </p>
//               </div>
//               <button
//                 disabled={loading || !selectedVector}
//                 onClick={() => runSimulationPipeline(selectedVector)}
//                 className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black font-mono tracking-wide uppercase bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-nowrap"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                     Calculating...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-3 w-3 fill-current" />
//                     Initiate Simulation
//                   </>
//                 )}
//               </button>
//             </div>

//           </div>

//           {/* RIGHT SIDEBAR: MATRIX MONITOR LOG */}
//           <div className="border border-slate-200 bg-white rounded-xl h-full shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
//             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
//               <Activity className="h-4 w-4 text-slate-500" />
//               <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
//                 Simulation Matrix Log
//               </span>
//             </div>

//             <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-4">
//               {loading ? (
//                 <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
//                   <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mb-1" />
//                   <span className="text-[10px] uppercase tracking-wider font-bold text-slate-700">Executing Agent Framework...</span>
//                   <p className="text-[10px] text-slate-400 max-w-[220px] leading-tight font-sans">Querying vector news weights and executing rerouting matrices.</p>
//                 </div>
//               ) : simResult ? (
//                 <div className="space-y-4 animate-in fade-in duration-200">

//                   {/* SCOUT AGENT RECON BLOCK */}
//                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
//                     <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
//                       <span className="text-[10px] font-bold text-slate-500 uppercase">1. Scout Assessment</span>
//                       <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-black">
//                         SCORE: {simResult.scout_assessment?.risk_score ?? "85"}/100
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
//                       {typeof simResult.scout_assessment === "string"
//                         ? simResult.scout_assessment
//                         : (simResult.scout_assessment?.assessment || "High risk variance detected near chokepoint bottleneck vectors. Route diversion advised.")}
//                     </p>
//                   </div>

//                   {/* LOGISTICS MITIGATION BLOCK */}
//                   <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
//                     <div className="flex items-center justify-between border-b border-blue-100/50 pb-1.5">
//                       <span className="text-[10px] font-bold text-blue-700 uppercase">2. Logistics Plan</span>
//                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase border ${
//                         simResult.logistics_mitigation?.reroute_triggered || simResult.logistics_mitigation?.reroute_triggered === undefined
//                           ? "bg-amber-50 text-amber-700 border-amber-200"
//                           : "bg-emerald-50 text-emerald-700 border-emerald-200"
//                       }`}>
//                         {simResult.logistics_mitigation?.reroute_triggered !== false ? "Reroute Enforced" : "Course Maintained"}
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
//                       {typeof simResult.logistics_mitigation === "string"
//                         ? simResult.logistics_mitigation
//                         : (simResult.logistics_mitigation?.recommendation || "Alternative routing streams deployed to safe-harbor the active vessel fleet.")}
//                     </p>
//                   </div>

//                   {/* COMPLETED STATUS SUCCESS NOTIFICATION */}
//                   <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-[11px] font-sans">
//                     <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
//                     <div>
//                       <p className="font-bold font-mono text-[10px] uppercase text-emerald-900">Calculations Complete</p>
//                       <p className="text-emerald-700 mt-0.5">Mitigation parameters updated across fleet telemetry rows smoothly.</p>
//                     </div>
//                   </div>

//                 </div>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
//                   <HelpCircle className="h-5 w-5 mb-1.5 text-slate-300" />
//                   <span className="uppercase text-[10px] tracking-wider block font-bold text-slate-400">Laboratory Dormant</span>
//                   <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-tight font-sans">Select a variable profile card and trigger "Initiate Simulation" to evaluate system resilience.</p>
//                 </div>
//               )}
//             </div>

//             <div className="bg-slate-900 text-[10px] text-slate-400 font-mono p-3 px-4 border-t border-slate-800 shrink-0 flex items-center justify-between">
//               <span>CRISIS INTERACTION MATRIX</span>
//               <div className="flex items-center gap-1.5">
//                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 <span className="text-slate-500">READY</span>
//               </div>
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import {
  Sliders,
  Activity,
  Play,
  Loader2,
  CheckCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SimulationPage() {
  const [premiumSurge, setPremiumSurge] = useState(25);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [selectedVector, setSelectedVector] = useState<any | null>(null);

  // Predefined anomaly triggers matching your application theme
  const anomalyVectors = [
    {
      id: "typhoon",
      title: "CATEGORY 5 TYPHOON ARRAY",
      location: "South China Sea",
      icon: "⚡",
      prompt:
        "A massive Category 5 Typhoon Array is moving across the South China Sea shipping corridors with waves exceeding 12 meters.",
    },
    {
      id: "blockade",
      title: "CHOKEPOINT KINETIC BLOCKADE",
      location: "Strait of Hormuz",
      icon: "🔥",
      prompt:
        "Unannounced naval military exercises and kinetic blockades have completely closed commercial shipping lanes inside the Strait of Hormuz.",
    },
    {
      id: "spoofing",
      title: "PORT AIS SAT-SPOOFING WAVE",
      location: "Rotterdam Terminals",
      icon: "⚠️",
      prompt:
        "A coordinates sat-spoofing injection wave is causing widespread telemetry disruption around the Rotterdam Port terminal entries.",
    },
  ];

  // Dispatches simulation request to the FastAPI multi-agent ecosystem
  const runSimulationPipeline = async (vector: any) => {
    if (!vector || !vector.prompt.trim()) return;
    setLoading(true);
    setSimResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/simulate-crisis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario: vector.prompt,
            premium_surge: premiumSurge, // 👈 Send the slider state directly as an integer to the backend!
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSimResult(data);
      } else {
        console.error("Simulation framework pipeline returned an error code.");
      }
    } catch (err) {
      console.error(
        "❌ Agent simulation execution framework dropped connection:",
        err,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Simulation" />

      {/* COMPONENT SCROLLBOARD VIEWPORT FRAME */}
      <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* TOP LEVEL ROUTE BRANDING HEADER */}
        <div className="border-b border-slate-200 pb-4 shrink-0">
          <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
            Crisis Simulation Laboratory
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Inject custom disruption events or presets to evaluate real-time
            fleet mitigation decisions
          </p>
        </div>

        {/* WORKSPACE COLUMN LAYOUT GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-0">
          {/* LEFT WORKING PARAMETERS HUB */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-y-auto pr-1">
            {/* ANOMALY PRESET SELECTOR TRACKS */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-3">
                Select Anomaly Vectors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {anomalyVectors.map((vector) => (
                  <button
                    key={vector.id}
                    onClick={() => {
                      setSelectedVector(vector);
                      setSimResult(null);
                    }}
                    className={`text-left border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between transition-all relative overflow-hidden h-32 ${
                      selectedVector?.id === vector.id
                        ? "border-blue-500 ring-2 ring-blue-500/10 bg-slate-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sm">
                        {vector.icon}
                      </div>
                      {selectedVector?.id === vector.id && (
                        <span className="text-[9px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                          LOADED
                        </span>
                      )}
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-xs font-black text-slate-900 font-mono tracking-tight leading-tight uppercase">
                        {vector.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {vector.location}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* VARIABLE MANIPULATION SLIDERS DECK */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Sliders className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                  Manual Variable Manipulation
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-700 font-medium">
                    Simulated Insurance Premium Surge Scale
                  </span>
                  <span className="text-blue-600 font-bold">
                    +{premiumSurge}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={premiumSurge}
                  onChange={(e) => setPremiumSurge(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* INTERACTIVE CRISIS INJECTION PLATFORM CONSOLE BOX */}
            <div className="border border-slate-200 bg-slate-950 text-white rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase">
                  AUTOMATED CRISIS INJECTION PROTOCOL
                </p>
                <p className="text-[11px] text-slate-400 font-sans">
                  Modify the selected vector parameters below or type a
                  completely custom operational threat scenario manually.
                </p>
              </div>

              {/* INTEGRATED TEXT INPUT BOX */}
              <textarea
                rows={3}
                value={selectedVector ? selectedVector.prompt : ""}
                onChange={(e) => {
                  if (selectedVector) {
                    setSelectedVector({
                      ...selectedVector,
                      prompt: e.target.value,
                    });
                  } else {
                    setSelectedVector({
                      id: "custom_ad_hoc",
                      title: "AD-HOC INJECTED CRISIS VECTOR",
                      location: "Global Grid Coordinates",
                      icon: "🌐",
                      prompt: e.target.value,
                    });
                  }
                }}
                placeholder="Select a card from the deck above, or click here to type a custom maritime emergency statement from scratch..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans resize-none transition-all"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-900">
                <div className="text-[10px] font-mono text-slate-500 text-center sm:text-left">
                  {selectedVector?.id === "custom_ad_hoc"
                    ? "⚠️ CUSTOM RUNTIME INJECT ACTIVE"
                    : selectedVector
                      ? "✅ CARD VARIABLE CONFIG LOADED"
                      : "💡 WAITING FOR CONSOLE INPUT PARAMETERS"}
                </div>
                <button
                  disabled={loading || !selectedVector?.prompt.trim()}
                  onClick={() => runSimulationPipeline(selectedVector)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black font-mono tracking-wide uppercase bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Evaluating Models...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      Initiate Simulation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMNS VIEWPORT HUB: DYNAMIC SIMULATION MATRIX LOG */}
          {/* DYNAMIC LOG STATE INTERFACES CONTAINER */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-4">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-700">
                  Executing Agent Framework...
                </span>
                <p className="text-[10px] text-slate-400 max-w-[220px] leading-tight font-sans">
                  Querying vector news weights and running rerouting algorithms.
                </p>
              </div>
            ) : simResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* SCOUT AGENT RECON BLOCK */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      1. Scout Assessment
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-black">
                      {/* Dynamically fallback to 0 or N/A instead of a fake '85' risk score */}
                      SCORE:{" "}
                      {simResult.scout_assessment?.risk_score !== undefined
                        ? `${simResult.scout_assessment.risk_score}/100`
                        : "PENDING"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-sans leading-relaxed">
                    {typeof simResult.scout_assessment === "string"
                      ? simResult.scout_assessment
                      : simResult.scout_assessment?.assessment ||
                        simResult.scout_assessment?.risk_analysis ||
                        "No assessment breakdown text returned by the Scout Agent."}
                  </div>
                </div>

                {/* LOGISTICS AGENT MITIGATION RE-ROUTE BOX */}
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-100/50 pb-1.5">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">
                      2. Logistics Plan
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase border ${
                        simResult.logistics_mitigation?.reroute_triggered === true
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : (simResult.scout_assessment?.risk_score ?? 0) >= 70 &&
                              simResult.logistics_mitigation?.reroute_triggered === false
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {simResult.logistics_mitigation?.reroute_triggered === true
                        ? "Reroute Enforced"
                        : (simResult.scout_assessment?.risk_score ?? 0) >= 70 &&
                            simResult.logistics_mitigation?.reroute_triggered === false
                          ? "Shelter Enforced"
                          : "Course Maintained"}
                    </span>
                  </div>
                  <div className="prose prose-sm prose-slate max-w-none text-[11px] leading-relaxed font-sans">
                    <ReactMarkdown>
                      {simResult.logistics_mitigation?.strategic_recommendation ||
                        "Current operational profiles remain within safe parameters. No deviations required."}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* DYNAMIC SYSTEM RESPONSE CARD */}
                {simResult.status === "success" && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-[11px] font-sans">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-bold font-mono text-[10px] uppercase text-emerald-900">
                        Pipeline Execution Complete
                      </p>
                      <p className="text-emerald-700 mt-0.5">
                        The multi-agent simulation run completed successfully
                        against target variables.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                <HelpCircle className="h-5 w-5 mb-1.5 text-slate-300" />
                <span className="uppercase text-[10px] tracking-wider block font-bold text-slate-400">
                  Laboratory Dormant
                </span>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-tight font-sans">
                  Select a threat card or type in the injection terminal field
                  to launch multi-agent path analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
