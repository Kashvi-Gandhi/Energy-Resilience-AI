// "use client";

// import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { Search, MapPin, Calendar, TrendingUp, ShieldCheck, FileText, Radio, Loader2 } from "lucide-react";

// export default function ThreatsPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [threatDatabase, setThreatDatabase] = useState<any[]>([]);
//   const [selectedThreat, setSelectedThreat] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchThreats() {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/threats");
//         const data = await res.json();
//         setThreatDatabase(data);
//       } catch (err) {
//         console.error("❌ Failed to pull live threat briefs:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchThreats();
//   }, []);

//   const filteredThreats = threatDatabase.filter(t => 
//     t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     t.supply_routes?.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const activeDossier = filteredThreats[selectedThreat];

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Threats" />

//       <div className="flex-1 h-full flex flex-col p-6 space-y-5 overflow-hidden">
//         <div className="border-b border-slate-200 pb-4 shrink-0">
//           <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Geopolitical Threat Registry</h1>
//           <p className="text-xs text-slate-500 font-medium">Real-time vector intelligence streamed straight from database intelligence logging</p>
//         </div>

//         <div className="flex items-center gap-3 shrink-0">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input 
//               type="text" 
//               placeholder="Filter threat parameters or corridors..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
//             <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//             <span className="font-mono text-[10px] uppercase tracking-wider">Syncing Geopolitical Dossiers...</span>
//           </div>
//         ) : filteredThreats.length === 0 ? (
//           <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs uppercase">
//             No Active Strategic Threat Warnings Found
//           </div>
//         ) : (
//           <div className="flex-1 flex gap-5 items-stretch overflow-hidden w-full">
            
//             {/* LEFT STREAM FEED */}
//             <div className="w-2/5 overflow-y-auto space-y-3 pr-1">
//               {filteredThreats.map((threat, idx) => (
//                 <button
//                   key={threat.id || idx}
//                   onClick={() => setSelectedThreat(idx)}
//                   className={`w-full text-left p-4 border rounded-xl transition-all flex flex-col gap-2 relative bg-white shadow-sm ${
//                     selectedThreat === idx ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start w-full gap-2">
//                     <span className="font-bold text-xs text-slate-900 font-mono leading-tight uppercase">{threat.title}</span>
//                     <span className="text-[9px] font-extrabold px-2 py-0.5 border rounded font-mono bg-rose-50 text-rose-700 border-rose-200">
//                       SCORE: {threat.supply_routes?.risk_score || 50}
//                     </span>
//                   </div>
//                   <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{threat.content}</p>
//                   <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
//                     <span className="flex items-center gap-1">
//                       <MapPin className="h-3 w-3" /> {threat.supply_routes?.route_name || "Global Transit"}
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {/* RIGHT DOSSIER EXPLODER */}
//             {activeDossier && (
//               <div className="w-3/5 panel-card bg-white p-5 flex flex-col space-y-5 overflow-y-auto">
//                 <div className="border-b border-slate-100 pb-4 flex flex-col gap-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[10px] font-bold text-blue-600 tracking-widest font-mono uppercase flex items-center gap-1.5">
//                       <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Intercept Dossier
//                     </span>
//                   </div>
//                   <h2 className="text-base font-black text-slate-900 uppercase font-mono tracking-tight">{activeDossier.title}</h2>
//                   <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
//                     <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activeDossier.supply_routes?.route_name}</span>
//                     <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Intel: {activeDossier.source}</span>
//                   </div>
//                 </div>

//                 <div className="space-y-4 flex-1 text-xs">
//                   <div className="space-y-1.5">
//                     <h4 className="font-bold text-slate-400 font-mono text-[10px] uppercase tracking-wider">Intercept Breakdown</h4>
//                     <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">{activeDossier.content}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Search, ShieldAlert, Radio, Compass, Activity, ServerCrash } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function GeopoliticalThreatRegistry() {
  const [threats, setThreats] = useState<any[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreatIntel() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/threats");
        if (response.ok) {
          const data = await response.json();
          const cleanData = Array.isArray(data) ? data : [];
          setThreats(cleanData);
          if (cleanData.length > 0) {
            setSelectedThreat(cleanData[0]);
          }
        }
      } catch (err) {
        console.error("Critical failure sync with threat registry matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchThreatIntel();
  }, []);

  const filteredThreats = threats.filter((t: any) =>
    t.event_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.supply_routes?.route_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden antialiased text-slate-900 font-sans">
      
      {/* LEFT PANEL NAVIGATION */}
      <DashboardSidebar currentRoute="Threats" />

      {/* CORE FRAME LAYOUT AREA */}
      <div className="flex-1 h-full flex flex-col overflow-hidden p-6 space-y-6">
        
        {/* HEADER SECTION PANEL */}
        <div className="border-b border-slate-200 pb-5 shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-rose-600 font-mono font-bold mb-1">
            REAL-TIME THREAT VECTOR REGISTRY
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
            Geopolitical Threat Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time vector intelligence streamed straight from active database logging.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-between items-start gap-4">
            <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
            <span>SYNCING HOSTILE INTERCEPT FEED MATRIX...</span>
          </div>
        ) : (
          <div className="flex flex-1 w-full gap-6 overflow-hidden pb-4">
            
            {/* 🛠️ FIXED: CHANGED FROM 1/2 TO 1/3 COLUMN FRAME LAYOUT */}
            <div className="w-1/3 h-[calc(100vh-210px)] flex flex-col space-y-4 overflow-y-auto pr-3 custom-scrollbar">
              
              {/* TACTICAL SEARCH SUB BAR */}
              <div className="relative w-full shrink-0 sticky top-0 bg-white pb-2 z-10">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter threat parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all shadow-sm"
                />
              </div>

              {/* THREAT CARD MANIFEST */}
              <div className="space-y-4"> {/* Increased vertical space between blocks */}
                {filteredThreats.length > 0 ? (
                  filteredThreats.map((threat: any) => {
                    const isSelected = selectedThreat?.id === threat.id;
                    return (
                      <div
                        key={threat.id}
                        onClick={() => setSelectedThreat(threat)}
                        // 🛠️ FIXED: Increased card padding to py-6 and px-5 to make the threat block thicker
                        className={`py-6 px-5 rounded-xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden shadow-sm ${
                          isSelected 
                            ? "bg-slate-50 border-rose-500 shadow-md scale-[1.01]" 
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="space-y-2"> {/* Thicker vertical rhythm */}
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug">
                              {threat.event_type}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono flex flex-wrap items-center gap-1">
                              <Compass className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="font-semibold">{threat.region}</span>
                              {threat.supply_routes?.route_name && (
                                <span className="text-slate-400 font-sans block w-full sm:inline sm:w-auto mt-0.5 sm:mt-0">
                                  — {threat.supply_routes.route_name}
                                </span>
                              )}
                            </p>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                            threat.severity === 'HIGH' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            SCORE: {threat.supply_routes?.risk_score ?? "N/A"}
                          </span>
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          threat.severity === 'HIGH' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono text-xs uppercase tracking-widest">
                    <ServerCrash className="h-5 w-5 mx-auto mb-2 text-slate-300" />
                    NO INCIDENTS MATCH SEARCH PARAMETERS
                  </div>
                )}
              </div>
            </div>

            {/* 🛠️ FIXED: CHANGED FROM 1/2 TO 2/3 COLUMN EXPANDED DOSSIER PANEL */}
            <div className="w-2/3 h-[calc(100vh-210px)] bg-slate-50/50 border border-slate-200 rounded-xl p-6 flex flex-col overflow-y-auto custom-scrollbar">
              {selectedThreat ? (
                <div className="space-y-6">
                  
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                    <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-widest">
                      (( LIVE INTERCEPT DOSSIER ))
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
                      CLASSIFIED THREAT VECTOR SIGNATURE
                    </span>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                      {selectedThreat.event_type}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 font-mono text-xs shadow-sm">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase mb-1">GEOGRAPHIC SECTOR</span>
                      <span className="text-slate-800 font-bold uppercase">{selectedThreat.region}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase mb-1">COORDINATE ANCHOR</span>
                      <span className="text-cyan-600 font-bold">
                        {selectedThreat.latitude?.toFixed(4)}°N, {selectedThreat.longitude?.toFixed(4)}°E
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase mb-1">VECTOR STATUS</span>
                      <span className={`font-bold uppercase ${
                        selectedThreat.status === 'Active' ? 'text-rose-600 animate-pulse' : 'text-emerald-600'
                      }`}>{selectedThreat.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase mb-1">SEVERITY VALUE</span>
                      <span className={`font-bold uppercase ${
                        selectedThreat.severity === 'HIGH' ? 'text-rose-600' : 'text-amber-600'
                      }`}>{selectedThreat.severity}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      INTERCEPT BREAKDOWN & CRITICAL ANALYST EVIDENCE
                    </span>
                    <div className="bg-white border border-slate-200 rounded-lg p-5 text-sm font-sans text-slate-700 leading-relaxed font-medium whitespace-pre-wrap shadow-sm">
                      {selectedThreat.description || "No tactical narrative summary exists inside current ledger dataset arrays."}
                    </div>
                  </div>

                  {selectedThreat.supply_routes && (
                    <div className="border border-slate-200 bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block uppercase">IMPACTED TRANSIT AXIS</span>
                          <span className="text-sm font-bold text-slate-800 uppercase">
                            {selectedThreat.supply_routes.route_name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase">ZONE RISK</span>
                        <span className="text-sm font-mono font-black text-rose-600">
                          {selectedThreat.supply_routes.risk_score}/100
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Additional analytics card helper since the expanded window has more horizontal room */}
                  <div className="pt-2">
                    <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold">AUTOMATED RESPONSE PROTOCOL</div>
                        <div className="text-xs text-slate-300 mt-1">Rerouting evaluation models are prepared for active fleets intersecting this grid space.</div>
                      </div>
                      <button className="bg-white text-slate-950 font-sans text-xs font-black uppercase tracking-tight px-4 py-2 rounded hover:bg-slate-100 transition-colors shrink-0">
                        Initiate Simulation
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs uppercase tracking-widest text-center py-20">
                  <Activity className="h-5 w-5 mb-2 text-slate-300 animate-pulse" />
                  SELECT INTEL CARD FROM LEFT FEED TO DISPLAY VECTOR OVERVIEW
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}