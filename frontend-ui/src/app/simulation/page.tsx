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














"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { ShieldAlert, Ship, Sliders, Activity, Play, Loader2, CheckCircle, HelpCircle } from "lucide-react";

export default function SimulationPage() {
  const [premiumSurge, setPremiumSurge] = useState(25);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [activeVector, setActiveVector] = useState<string | null>(null);

  // Core scenarios mapped directly out of your UI design options
  const anomalyVectors = [
    {
      id: "typhoon",
      title: "CATEGORY 5 TYPHOON ARRAY",
      location: "South China Sea",
      icon: "⚡",
      prompt: "A massive Category 5 Typhoon Array is moving across the South China Sea shipping corridors with waves exceeding 12 meters."
    },
    {
      id: "blockade",
      title: "CHOKEPOINT KINETIC BLOCKADE",
      location: "Strait of Hormuz",
      icon: "🔥",
      prompt: "Unannounced naval military exercises and kinetic blockades have completely closed commercial shipping lanes inside the Strait of Hormuz."
    },
    {
      id: "spoofing",
      title: "PORT AIS SAT-SPOOFING WAVE",
      location: "Rotterdam Terminals",
      icon: "⚠️",
      prompt: "A coordinates sat-spoofing injection wave is causing widespread telemetry disruption around the Rotterdam Port terminal entries."
    }
  ];

  // Triggers the backend FastAPI multi-agent simulator pipeline
  const runSimulation = async (vector: typeof anomalyVectors[0]) => {
    setLoading(true);
    setActiveVector(vector.id);
    setSimResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/simulate-crisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: `${vector.prompt} Global operational insurance premiums are inflated by +${premiumSurge}%.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSimResult(data);
      } else {
        console.error("Simulation response failed");
      }
    } catch (err) {
      console.error("❌ Agent simulation pipeline communication crash:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Simulation" />

      {/* VIEWPORT CONTROLLER FRAME */}
      <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto">
        
        {/* HEADER BRANDING BANNER */}
        <div className="border-b border-slate-200 pb-4 shrink-0">
          <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
            Crisis Simulation Laboratory
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Execute predictive what-if threat modeling matrices and calculate global logistics delta outcomes
          </p>
        </div>

        {/* WORKSPACE LAYOUT: Flexes column-wise on mobile, splits into clean desktop windows */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-0">
          
          {/* LEFT WORKING CONTROLS DECK (Takes 2 blocks on laptop sizes) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-y-auto pr-1">
            
            {/* ANOMALY VECTORS DECK SECTOR */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-3">
                Select Anomaly Vectors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {anomalyVectors.map((vector) => (
                  <div 
                    key={vector.id}
                    className={`border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden ${
                      activeVector === vector.id ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">
                          {vector.icon}
                        </div>
                        <button 
                          disabled={loading}
                          onClick={() => runSimulation(vector)}
                          className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <Play className="h-3 w-3 fill-current" />
                        </button>
                      </div>
                      <h3 className="text-xs font-black text-slate-900 font-mono tracking-tight leading-tight uppercase">
                        {vector.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vector.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLIDERS METRIC INTERFACES BLOCK */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Sliders className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                  Manual Variable Manipulation
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-700 font-medium">Simulated Insurance Premium Surge Scale</span>
                  <span className="text-blue-600 font-bold">+{premiumSurge}%</span>
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

          </div>

          {/* SIMULATION MONITOR LOG (Right column, snaps nicely on layout grids) */}
          <div className="border border-slate-200 bg-white rounded-xl h-full shadow-sm flex flex-col overflow-hidden min-h-[350px] lg:min-h-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
              <Activity className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                Simulation Matrix Log
              </span>
            </div>

            {/* DYNAMIC LOG STATE INTERFACES CONTAINER */}
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono space-y-4">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600">Firing AI Agent Engines...</span>
                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">Querying spatial telemetry and modeling alternative risk pathways.</p>
                </div>
              ) : simResult ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* SCOUT ASSESSMENT OUTCOME BOX */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">1. Scout Assessment</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-bold">
                        RISK: {simResult.scout_assessment?.risk_score ?? "85"}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                      {simResult.scout_assessment?.assessment || "Critical chokepoint friction observed. Alternative paths mandatory."}
                    </p>
                  </div>

                  {/* LOGISTICS AGENT MITIGATION DECISION BOX */}
                  <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">2. Logistics Mitigation</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                        simResult.logistics_mitigation?.reroute_triggered 
                          ? "bg-amber-50 text-amber-700 border-amber-200" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {simResult.logistics_mitigation?.reroute_triggered ? "Reroute Triggered" : "Maintain Course"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                      {simResult.logistics_mitigation?.recommendation || "All fleet operations reassessed against variable metrics."}
                    </p>
                  </div>

                  {/* AUTOMATED CONSOLIDATED SUMMARY BAR */}
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] font-sans">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Mitigation model deployed instantly to core global fleet variables.</span>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                  <HelpCircle className="h-5 w-5 mb-1.5 text-slate-300" />
                  <span className="uppercase text-[10px] tracking-wider block font-bold text-slate-400">System Standing By</span>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-tight">Select an anomaly vector card to test real-time network resilience paths.</p>
                </div>
              )}
            </div>

            {/* BASE FRAME PROTOCOL METRIC BANNER */}
            <div className="bg-slate-900 text-[10px] text-slate-400 font-mono p-3 px-4 border-t border-slate-800 shrink-0">
              Automated Response Ready
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}