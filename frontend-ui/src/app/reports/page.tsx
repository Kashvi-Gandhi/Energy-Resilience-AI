// "use client";

// import React, { useState } from "react";
// import DashboardSidebar from "../../components/DashboardSidebar";
// import { FileText, Download, Eye, Search, Filter, Calendar, FileSpreadsheet, ShieldCheck } from "lucide-react";

// export default function ReportsPage() {
//   const [search, setSearch] = useState("");

//   const reports = [
//     { title: "Weekly Chokepoint Congestion Log", type: "PDF Report", size: "4.2 MB", date: "2026-06-28", author: "Risk Engine Core", classification: "CONFIDENTIAL", class: "bg-amber-50 text-amber-700 border-amber-200" },
//     { title: "Suez Canal Routing Diversion Impact Analysis", type: "Excel Ledger", size: "12.8 MB", date: "2026-06-25", author: "Logistics Desk", classification: "RESTRICTED", class: "bg-blue-50 text-blue-700 border-blue-200" },
//     { title: "Malacca Strait Electronic Warfare Incident Docket", type: "PDF Brief", size: "2.1 MB", date: "2026-06-20", author: "Intel Branch", classification: "SECRET", class: "bg-rose-50 text-rose-700 border-rose-200" },
//     { title: "Quarterly Global Fleet Fuel & Transit Burn Matrix", type: "Excel Ledger", size: "34.5 MB", date: "2026-06-15", author: "Operations Center", classification: "UNCLASSIFIED", class: "bg-emerald-50 text-emerald-700 border-emerald-200" }
//   ];

//   const filteredReports = reports.filter(r => 
//     r.title.toLowerCase().includes(search.toLowerCase()) ||
//     r.author.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
//       <DashboardSidebar currentRoute="Reports" />
      
//       <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        
//         {/* Header Node Row */}
//         <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
//           <div>
//             <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Intelligence Export & Report Registry</h1>
//             <p className="text-xs text-slate-500 font-medium">Downloadable analytical dossiers, compliance logs, and ledger audit streams</p>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search audit files..." 
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
//               />
//             </div>
//             <button className="panel-card bg-white px-3 py-1.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:bg-slate-50">
//               <Filter className="h-3.5 w-3.5" /> Filter
//             </button>
//           </div>
//         </div>

//         {/* Master Reports Inventory Rows */}
//         <div className="space-y-3 flex-1">
//           <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Available Strategic Documents</span>
          
//           {filteredReports.map((report, idx) => (
//             <div key={idx} className="panel-card p-4 bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-sm">
//               <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${
//                   report.type.includes("Excel") ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-blue-600 bg-blue-50 border-blue-100"
//                 }`}>
//                   {report.type.includes("Excel") ? <FileSpreadsheet className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
//                 </div>
                
//                 <div className="space-y-0.5">
//                   <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-tight">{report.title}</h3>
//                   <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
//                     <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
//                     <span>•</span>
//                     <span>Origin: {report.author}</span>
//                     <span>•</span>
//                     <span>Size: {report.size}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons Hub & Clearance Tags */}
//               <div className="flex items-center gap-4">
//                 <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded-md font-mono ${report.class}`}>
//                   {report.classification}
//                 </span>
                
//                 <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
//                   <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors" title="Preview Dossier">
//                     <Eye className="h-4 w-4" />
//                   </button>
//                   <button className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors" title="Download File Payload">
//                     <Download className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Audit Secure Footer Compliance Ribbon */}
//         <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between border border-slate-800 shrink-0 font-mono text-[10px]">
//           <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
//             <ShieldCheck className="h-4 w-4 text-emerald-500" /> Export Verification Subsystem
//           </span>
//           <span className="text-slate-500">All dossier downloads are cryptographic-stamped & logged under active session protocols.</span>
//         </div>

//       </div>
//     </div>
//   );
// }













"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { FileText, Search, Filter, Download, Loader2, FileCheck, ServerCrash, X } from "lucide-react";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  useEffect(() => {
    async function fetchDatabaseDossiers() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/reports");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        }
      } catch (err) {
        console.error("❌ Intelligence Registry ledger sync failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDatabaseDossiers();
  }, []);

  // REAL FILE DOWNLOAD ENGINE (Generates a local blob file from database row values)
  const handleDownloadDossier = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the modal window at the same time
    
    // Formatting the document text content layout
    const fileContent = `==================================================
ENERGY RESILIENCE AI - SECURE INTELLIGENCE BRIEF
==================================================
DOSSIER REFERENCE ID : ${doc.id}
SECURITY RATING      : ${doc.security_classification}
DOCUMENT TITLE       : ${doc.title}
GENERATION TIMESTAMP  : ${doc.created_at ? new Date(doc.created_at).toUTCString() : new Date().toUTCString()}
TACTICAL MONITOR NODE: ${doc.origin_branch}
--------------------------------------------------
INCIDENT INTEL BREAKDOWN & THREAT SUMMARY:
${doc.description || "No analyst field logs annotated."}
--------------------------------------------------
[SECURITY PROTOCOL LOGGED // SESSION CRYPTO STAMPED]
==================================================`;

    // Create a client-side text download stream
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Sanitize filename structure
    const fileName = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_dossier.txt`;
    
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up temporary DOM reference object elements
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = (Array.isArray(documents) ? documents : []).filter(doc => 
    doc.title?.toLowerCase().includes(search.toLowerCase()) || 
    doc.origin_branch?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      <DashboardSidebar currentRoute="Reports" />
      
      <div className="flex-1 h-full flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto">
        
        {/* RESPONSIVE HEADER GRID */}
        <div className="border-b border-slate-200 pb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between shrink-0">
          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
              Intelligence Export & Report Registry
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time dossiers compiled dynamically from underlying threat arrays
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search database registries..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* DATA CARD METRICS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
          <div className="border border-slate-200 p-4 bg-white rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Active Threats Monitored</span>
              <span className="text-lg md:text-xl font-bold font-mono text-slate-900">{documents.length} Dossiers</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="border border-slate-200 p-4 bg-white rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Data Feed Status</span>
              <span className="text-lg md:text-xl font-bold font-mono text-emerald-600">Sync Complete</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* LEDGER GRID DISPLAY VIEW */}
        <div className="border border-slate-200 bg-white rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-12">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Compiling relational files...</span>
            </div>
          ) : (
            <div className="overflow-x-auto w-full h-full">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 font-mono">
                      <th className="px-4 md:px-6 py-3">Document Identification / Origin</th>
                      <th className="px-4 md:px-6 py-3 hidden md:table-cell">File Size</th>
                      <th className="px-4 md:px-6 py-3 text-center">Security Rating</th>
                      <th className="px-4 md:px-6 py-3 text-right">Action Vectors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc, i) => (
                        <tr key={doc.id || i} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                          
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hidden sm:block">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-950 tracking-tight text-xs md:text-[13px] uppercase max-w-[240px] sm:max-w-md lg:max-w-2xl truncate">
                                  {doc.title}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2">
                                  <span>{doc.created_at ? new Date(doc.created_at).toISOString().split('T')[0] : "LIVE RUNTIME"}</span>
                                  <span className="text-slate-200">|</span>
                                  <span>{doc.origin_branch}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-4 font-mono text-slate-500 text-[11px] hidden md:table-cell">
                            {doc.file_size}
                          </td>

                          <td className="px-4 md:px-6 py-4 text-center">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded-md font-mono inline-block tracking-wide ${
                              doc.security_classification === "SECRET" ? "bg-rose-50 text-rose-700 border-rose-200" :
                              doc.security_classification === "RESTRICTED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-cyan-50 text-cyan-700 border-cyan-200"
                            }`}>
                              {doc.security_classification}
                            </span>
                          </td>

                          {/* ACTION BUTTON WITH LIVE TRIGGER LOGIC */}
                          <td className="px-4 md:px-6 py-4 text-right">
                            <button 
                              onClick={(e) => handleDownloadDossier(doc, e)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 transition-all"
                            >
                              <span className="hidden sm:inline">Dossier</span>
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center font-mono text-xs text-slate-400 uppercase tracking-widest bg-slate-50/10">
                          <ServerCrash className="h-5 w-5 mx-auto mb-2 text-slate-300" />
                          No intelligence registries mapped within this operational frame.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYSTEM FOOTER STAMP */}
          <div className="bg-slate-900 text-slate-300 p-3 px-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-tight gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ACTIVE DATABASE INTERACTION ENGINE</span>
            </div>
            <div className="text-slate-500 text-center sm:text-right">
              All dossier summaries dynamically mapped from core geopolitical vector telemetry tables.
            </div>
          </div>
        </div>
      </div>

      {/* INSPECTOR MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] font-mono font-bold text-blue-600 tracking-wider">LIVE INTERCEPT DOSSIER</span>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 border rounded-md font-mono inline-block tracking-wide bg-slate-900 text-white mb-2">
                  {selectedDoc.security_classification}
                </span>
                <h3 className="text-sm font-black text-slate-900 tracking-tight font-sans uppercase">
                  {selectedDoc.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{selectedDoc.origin_branch}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block mb-1">Incident Intel Breakdown</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedDoc.description}
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 flex justify-between border-t border-slate-100">
                <span>Dossier Weight: {selectedDoc.file_size}</span>
                <button 
                  onClick={(e) => { setSelectedDoc(null); handleDownloadDossier(selectedDoc, e); }}
                  className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                >
                  Download File <Download className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}