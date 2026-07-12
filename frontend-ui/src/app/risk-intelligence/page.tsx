// "use client";

// import React from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { BrainCircuit, ShieldAlert, Zap, TrendingUp, BarChart2, ShieldCheck } from "lucide-react";

// export default function RiskIntelligencePage() {
//   const riskVectors = [
//     { name: "Electronic GPS Spoofing Matrix", factor: "Navigation Anomaly Vectors", score: "74/100", status: "ELEVATED", text: "Localized spoofing fields tracking actively in shipping bottlenecks. High risk of precision telemetry displacement." },
//     { name: "Asymmetric Kinetic Threats", factor: "Drone & Coastal Missile Cells", score: "89/100", status: "CRITICAL", text: "Active threat configurations verified near littoral shipping choke points. Rerouting rules enforced." },
//     { name: "Macro Port Labor Constraints", factor: "Global Logistics Friction Index", score: "42/100", status: "STABLE", text: "Congestion parameters stable across domestic container terminals. Secondary supply vectors performing at par." }
//   ];

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Risk Intelligence" />
      
//       <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
//         <div className="border-b border-slate-200 pb-4">
//           <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Risk Intelligence Analytics Core</h1>
//           <p className="text-xs text-slate-500 font-medium">Predictive machine-learning risk indexing and algorithmic threat assessments</p>
//         </div>

//         {/* Main Grid Interface Layout split */}
//         <div className="grid grid-cols-3 gap-6 items-start">
          
//           {/* Left Side: Risk Vectors Stack */}
//           <div className="col-span-2 space-y-4">
//             <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Evaluated Intelligence Threat Arrays</span>
            
//             {riskVectors.map((vector, i) => (
//               <div key={i} className="panel-card p-5 bg-white flex flex-col space-y-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xs font-black uppercase text-slate-900 font-mono tracking-tight">{vector.name}</h3>
//                     <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vector.factor}</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-xs font-black font-mono text-slate-900">{vector.score}</div>
//                     <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 border rounded-md inline-block mt-1 ${
//                       vector.status === "CRITICAL" ? "bg-rose-50 text-rose-700 border-rose-200" :
//                       vector.status === "ELEVATED" ? "bg-amber-50 text-amber-700 border-amber-200" :
//                       "bg-emerald-50 text-emerald-700 border-emerald-200"
//                     }`}>{vector.status}</span>
//                   </div>
//                 </div>
//                 <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl font-sans">{vector.text}</p>
//               </div>
//             ))}
//           </div>

//           {/* Right Side: Analytical AI Threshold Dashboard Cards */}
//           <div className="col-span-1 space-y-4">
//             <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Neural Engine Status</span>
            
//             <div className="panel-card p-4 bg-white flex flex-col space-y-4">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//                 <BrainCircuit className="h-4 w-4 text-slate-700" />
//                 <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">Predictive Directives</span>
//               </div>

//               <div className="space-y-3 text-xs">
//                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
//                   <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
//                   <div>
//                     <span className="font-bold font-mono text-[11px] block text-slate-800">Dynamic Risk Level</span>
//                     <span className="text-slate-500 text-[11px] mt-0.5 block leading-relaxed">System confidence score currently rating at <span className="font-bold font-mono text-slate-700">94.2%</span> accuracy matrix.</span>
//                   </div>
//                 </div>

//                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
//                   <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
//                   <div>
//                     <span className="font-bold font-mono text-[11px] block text-slate-800">Model Configuration</span>
//                     <span className="text-slate-500 text-[11px] mt-0.5 block leading-relaxed">Adaptive routing neural rules are synchronized live with active maritime transits.</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }













"use client";

import React from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { BrainCircuit, ShieldAlert, Zap, ShieldCheck } from "lucide-react";

export default function RiskIntelligencePage() {
  const riskVectors = [
    { name: "Electronic GPS Spoofing Matrix", factor: "Navigation Anomaly Vectors", score: "74/100", status: "ELEVATED", text: "Localized spoofing fields tracking actively in shipping bottlenecks. High risk of precision telemetry displacement." },
    { name: "Asymmetric Kinetic Threats", factor: "Drone & Coastal Missile Cells", score: "89/100", status: "CRITICAL", text: "Active threat configurations verified near littoral shipping choke points. Rerouting rules enforced." },
    { name: "Macro Port Labor Constraints", factor: "Global Logistics Friction Index", score: "42/100", status: "STABLE", text: "Congestion parameters stable across domestic container terminals. Secondary supply vectors performing at par." }
  ];

  return (
    // MATCHED: Standardized clean white frame background and font handling matching the routes page
    <div className="flex h-screen w-screen bg-white overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Risk Intelligence" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        
        {/* MATCHED: Standardized Page Header Section */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Risk Intelligence Analytics Core</h1>
          <p className="text-xs text-slate-500 font-medium">Predictive machine-learning risk indexing and algorithmic threat assessments</p>
        </div>

        {/* MATCHED: 3-Column Responsive Grid Layout matching Routes panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-6">
          
          {/* Left Side: Risk Vectors Stack (Occupies 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Evaluated Intelligence Threat Arrays</span>
            
            <div className="space-y-4">
              {riskVectors.map((vector, i) => (
                // MATCHED: Replaced unstyled panel-cards with standard slate border cards
                <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col space-y-4 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xs font-black uppercase text-slate-900 font-mono tracking-tight">{vector.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vector.factor}</p>
                    </div>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md font-mono ${
                      vector.status === "CRITICAL" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      vector.status === "ELEVATED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      RISK FACTOR: {vector.score}
                    </span>
                  </div>

                  {/* MATCHED: Exactly mirrors the two-column inner information breakdown grid from the routes view */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs">
                    <div className="p-1 flex flex-col justify-center">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1">
                        <ShieldAlert className="h-3 w-3 text-slate-400" /> System Evaluation
                      </div>
                      <div className={`font-bold mt-1 ${
                        vector.status === "CRITICAL" ? "text-rose-600" : vector.status === "ELEVATED" ? "text-amber-600" : "text-emerald-600"
                      }`}>{vector.status} PROFILE</div>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-slate-200 p-1 flex flex-col justify-center">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3 text-slate-400" /> Diagnostic Stream
                      </div>
                      <div className="font-bold text-slate-500 mt-1 uppercase text-[10px] tracking-tight">Active Evaluation</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">
                    {vector.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Analytical AI Threshold Dashboard Side Controls (Occupies 1 column) */}
          <div className="col-span-1 border border-slate-200 p-4 bg-white rounded-xl flex flex-col space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">Neural Engine Status</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-mono text-[11px] block text-slate-800 uppercase">Dynamic Risk Level</span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block leading-relaxed font-medium">
                    System confidence score currently rating at <span className="font-bold font-mono text-slate-700">94.2%</span> accuracy matrix.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-mono text-[11px] block text-slate-800 uppercase">Model Configuration</span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block leading-relaxed font-medium">
                    Adaptive routing neural rules are synchronized live with active maritime transits.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}