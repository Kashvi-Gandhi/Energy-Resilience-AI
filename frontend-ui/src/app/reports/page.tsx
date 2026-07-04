"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { FileText, Download, Eye, Search, Filter, Calendar, FileSpreadsheet, ShieldCheck } from "lucide-react";

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  const reports = [
    { title: "Weekly Chokepoint Congestion Log", type: "PDF Report", size: "4.2 MB", date: "2026-06-28", author: "Risk Engine Core", classification: "CONFIDENTIAL", class: "bg-amber-50 text-amber-700 border-amber-200" },
    { title: "Suez Canal Routing Diversion Impact Analysis", type: "Excel Ledger", size: "12.8 MB", date: "2026-06-25", author: "Logistics Desk", classification: "RESTRICTED", class: "bg-blue-50 text-blue-700 border-blue-200" },
    { title: "Malacca Strait Electronic Warfare Incident Docket", type: "PDF Brief", size: "2.1 MB", date: "2026-06-20", author: "Intel Branch", classification: "SECRET", class: "bg-rose-50 text-rose-700 border-rose-200" },
    { title: "Quarterly Global Fleet Fuel & Transit Burn Matrix", type: "Excel Ledger", size: "34.5 MB", date: "2026-06-15", author: "Operations Center", classification: "UNCLASSIFIED", class: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  ];

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Reports" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        
        {/* Header Node Row */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Intelligence Export & Report Registry</h1>
            <p className="text-xs text-slate-500 font-medium">Downloadable analytical dossiers, compliance logs, and ledger audit streams</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search audit files..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm"
              />
            </div>
            <button className="panel-card bg-white px-3 py-1.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:bg-slate-50">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Master Reports Inventory Rows */}
        <div className="space-y-3 flex-1">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Available Strategic Documents</span>
          
          {filteredReports.map((report, idx) => (
            <div key={idx} className="panel-card p-4 bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${
                  report.type.includes("Excel") ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-blue-600 bg-blue-50 border-blue-100"
                }`}>
                  {report.type.includes("Excel") ? <FileSpreadsheet className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-tight">{report.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
                    <span>•</span>
                    <span>Origin: {report.author}</span>
                    <span>•</span>
                    <span>Size: {report.size}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Hub & Clearance Tags */}
              <div className="flex items-center gap-4">
                <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded-md font-mono ${report.class}`}>
                  {report.classification}
                </span>
                
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                  <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors" title="Preview Dossier">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors" title="Download File Payload">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Secure Footer Compliance Ribbon */}
        <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between border border-slate-800 shrink-0 font-mono text-[10px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Export Verification Subsystem
          </span>
          <span className="text-slate-500">All dossier downloads are cryptographic-stamped & logged under active session protocols.</span>
        </div>

      </div>
    </div>
  );
}