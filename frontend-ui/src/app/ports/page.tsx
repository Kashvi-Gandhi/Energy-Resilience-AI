// "use client";

// import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { Anchor, Search, Clock, Filter, Loader2 } from "lucide-react";

// export default function PortsPage() {
//   const [search, setSearch] = useState("");
//   const [ports, setPorts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchPorts() {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/ports");
//         const data = await res.json();
//         setPorts(data);
//       } catch (err) {
//         console.error("❌ Refineries database pull broken:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPorts();
//   }, []);

//   const filteredPorts = ports.filter(p => 
//     p.refinery_name?.toLowerCase().includes(search.toLowerCase()) || 
//     p.location?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Ports" />
      
//       <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
//         <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
//           <div>
//             <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Terminal & Port Hub Ledger</h1>
//             <p className="text-xs text-slate-500 font-medium">Global transshipment capacity tracking and product matrix matching</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search destination node..." 
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="panel-card bg-white overflow-hidden flex-1 flex flex-col justify-start">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
//               <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//               <span className="font-mono text-[10px] uppercase tracking-wider">Syncing Terminal Infrastructure...</span>
//             </div>
//           ) : (
//             <div className="overflow-x-auto w-full">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 font-mono">
//                     <th className="px-6 py-3">Terminal Complex</th>
//                     <th className="px-6 py-3">Geographic Tracking Location</th>
//                     <th className="px-6 py-3">Capacity (MPDA)</th>
//                     <th className="px-6 py-3 text-right">Crude Array Stream Compatibility</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
//                   {filteredPorts.map((p, i) => (
//                     <tr key={p.id || i} className="hover:bg-slate-50/60 transition-colors">
//                       <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
//                         <Anchor className="h-3.5 w-3.5 text-slate-400" /> {p.refinery_name}
//                       </td>
//                       <td className="px-6 py-3.5 font-mono text-slate-500 text-[11px]">{p.location}</td>
//                       <td className="px-6 py-3.5 text-slate-900 font-bold font-mono">{p.capacity_mpda} MT</td>
//                       <td className="px-6 py-3.5 text-right font-mono text-xs text-blue-600 font-semibold">
//                         {Array.isArray(p.crude_compatibility) ? p.crude_compatibility.join(" | ") : String(p.crude_compatibility)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






// "use client";

// import React, { useState, useEffect } from "react";
// import { Loader2, Search, Anchor, ServerCrash } from "lucide-react";
// import DashboardSidebar from "../../components/DashboardSidebar";

// export default function PortsLedgerDashboard() {
//   const [ports, setPorts] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchPortTelemetry() {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/api/ports");
//         if (response.ok) {
//           const data = await response.json();
//           setPorts(data);
//         }
//       } catch (err) {
//         console.error("Global node port synchronization fault:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPortTelemetry();
//   }, []);

//   const filteredPorts = (Array.isArray(ports) ? ports : []).filter((p: any) =>
//     p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.location?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen w-screen bg-[#020617] overflow-hidden antialiased text-slate-100 font-sans">
      
//       {/* CONTROL DESK LEFT BAR NAVIGATION */}
//       <DashboardSidebar currentRoute="Ports" />

//       {/* MAIN DATA SHEET INTERFACE FIELD */}
//       <div className="flex-1 h-full flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
//         {/* LEDGER MANIFEST FILTER CONTROL BAR */}
//         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800/60 pb-5 shrink-0">
//           <div>
//             <div className="text-[10px] uppercase tracking-widest text-cyan-500 font-mono font-bold mb-1">
//               INFRASTRUCTURE CAPACITIES MATRIX
//             </div>
//             <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
//               Terminal & Destination Hubs
//             </h1>
//           </div>
          
//           {/* TACTICAL INPUT SEARCH FIELD ANCHOR */}
//           <div className="relative w-full sm:w-80">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search destination node identifier..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-slate-900 border border-slate-800/80 rounded-lg pl-9 pr-4 py-2 text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all"
//             />
//           </div>
//         </div>

//         {/* GRID SHEET TABLE AREA FRAME */}
//         <div className="w-full bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-lg p-5 flex flex-col flex-1 overflow-hidden">
//           {loading ? (
//             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 font-mono text-xs uppercase tracking-widest">
//               <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
//               <span>SYNCING PORTS INTEL SYSTEM ARRAYS...</span>
//             </div>
//           ) : (
//             <div className="overflow-y-auto w-full h-full custom-scrollbar border border-slate-800/60 rounded">
//               <table className="w-full text-left border-collapse">
//                 <thead className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800">
//                   <tr className="text-slate-400 font-sans text-[11px] uppercase tracking-wider">
//                     <th className="px-6 py-4 font-semibold">Terminal Location Complex</th>
//                     <th className="px-6 py-4 font-semibold">Geographic Domain Area</th>
//                     <th className="px-6 py-4 font-mono text-center tracking-normal">Throughput Capacity</th>
//                     <th className="px-6 py-4 font-mono text-right tracking-normal">Crude Stream Compatibility Matrix</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-900/60 font-sans text-sm text-slate-300">
//                   {filteredPorts.length > 0 ? (
//                     filteredPorts.map((p: any, i: number) => (
//                       <tr key={p.id || i} className="hover:bg-slate-900/40 transition-colors">
//                         <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
//                           <Anchor className="h-4 w-4 text-slate-500 shrink-0" />
//                           <span>{p.name || "UNREGISTERED HUB"}</span>
//                         </td>
//                         <td className="px-6 py-4 text-slate-400 text-xs font-medium">{p.location || "International Vector Zone"}</td>
//                         <td className="px-6 py-4 text-center font-mono text-xs text-white font-black tracking-tight">
//                           {p.capacity || "0.0"} <span className="text-[10px] text-slate-500 font-normal">MTPA</span>
//                         </td>
//                         <td className="px-6 py-4 text-right font-mono text-xs text-cyan-400 font-bold tracking-wide">
//                           {Array.isArray(p.crude_compatibility) 
//                             ? p.crude_compatibility.join(" // ") 
//                             : String(p.crude_compatibility ?? "N/A")}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="px-6 py-12 text-center font-mono text-xs text-slate-500 uppercase tracking-widest bg-slate-950/20">
//                         <ServerCrash className="h-5 w-5 mx-auto mb-2 text-slate-600" />
//                         NO NODES FOUND WITHIN LOGISTICS RANGE PARAMS
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }









"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Search, Anchor, ServerCrash } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function PortsLedgerDashboard() {
  const [ports, setPorts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortTelemetry() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ports");
        if (response.ok) {
          const data = await response.json();
          setPorts(data);
        }
      } catch (err) {
        console.error("Global node port synchronization fault:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortTelemetry();
  }, []);

  // UPDATED FILTER: Check against name and country parameters matching the schema fields
  const filteredPorts = (Array.isArray(ports) ? ports : []).filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden antialiased text-slate-100 font-sans">
      
      <DashboardSidebar currentRoute="Ports" />

      <div className="flex-1 h-full flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800/60 pb-5 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-500 font-mono font-bold mb-1">
              INFRASTRUCTURE CAPACITIES MATRIX
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Terminal & Destination Hubs
            </h1>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search destination node identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 rounded-lg pl-9 pr-4 py-2 text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all"
            />
          </div>
        </div>

        <div className="w-full bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-lg p-5 flex flex-col flex-1 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 font-mono text-xs uppercase tracking-widest">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
              <span>SYNCING PORTS INTEL SYSTEM ARRAYS...</span>
            </div>
          ) : (
            <div className="overflow-y-auto w-full h-full custom-scrollbar border border-slate-800/60 rounded">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800">
                  <tr className="text-slate-400 font-sans text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Terminal Location Complex</th>
                    <th className="px-6 py-4 font-semibold">Geographic Domain Area</th>
                    <th className="px-6 py-4 font-mono text-center tracking-normal">Throughput Capacity</th>
                    <th className="px-6 py-4 font-mono text-right tracking-normal">Crude Stream Compatibility Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-sans text-sm text-slate-300">
                  {filteredPorts.length > 0 ? (
                    filteredPorts.map((p: any, i: number) => (
                      <tr key={p.id || i} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                          <Anchor className="h-4 w-4 text-slate-500 shrink-0" />
                          <span>{p.name || "UNREGISTERED HUB"}</span>
                        </td>
                        {/* FIXED: Using country column parameter */}
                        <td className="px-6 py-4 text-slate-400 text-xs font-medium">{p.country || "International Vector Zone"}</td>
                        
                        {/* FIXED: Using throughput_capacity_mtpa column parameter */}
                        <td className="px-6 py-4 text-center font-mono text-xs text-white font-black tracking-tight">
                          {(p.throughput_capacity_mtpa ?? 0.0).toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">MTPA</span>
                        </td>
                        
                        {/* FIXED: Using crude_stream_compatibility column array parameter */}
                        <td className="px-6 py-4 text-right font-mono text-xs text-cyan-400 font-bold tracking-wide">
                          {Array.isArray(p.crude_stream_compatibility) && p.crude_stream_compatibility.length > 0
                            ? p.crude_stream_compatibility.join(" // ") 
                            : "General Crude Blend"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center font-mono text-xs text-slate-500 uppercase tracking-widest bg-slate-950/20">
                        <ServerCrash className="h-5 w-5 mx-auto mb-2 text-slate-600" />
                        NO NODES FOUND WITHIN LOGISTICS RANGE PARAMS
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}