"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Radio 
} from "lucide-react";

export default function ThreatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThreat, setSelectedThreat] = useState(0);

  // Deep-dive intelligence logs mimicking a Palantir-style threat dossier
  const threatDatabase = [
    {
      id: 0,
      title: "Hormuz Naval Drill Activity",
      zone: "Strait of Hormuz",
      severity: "CRITICAL",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      date: "2026-07-01",
      source: "COMFIFTHFLT Intel",
      summary: "Unannounced naval military exercises have closed down two major commercial shipping lanes inside the Strait of Hormuz.",
      impactAnalysis: "Immediate bottleneck risk for crude tankers departing the Persian Gulf. Insurance war-risk premiums expected to climb 15-20% globally within 48 hours.",
      vesselsAffected: 14,
      mitigationAction: "Reroute deep-draft VLCC transits through alternative holding anchorages outside the Gulf of Oman."
    },
    {
      id: 1,
      title: "Bab-el-Mandeb Drone Threat",
      zone: "Southern Red Sea / Yemen Shelf",
      severity: "HIGH",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      date: "2026-07-01",
      source: "UKMTO Broadcast",
      summary: "Security operations confirm regional military factions have deployed sea-drones and anti-ship missile cells along the coastal shelf.",
      impactAnalysis: "Suez Canal transit volume directly choked. Carriers are factoring standard Cape of Good Hope diversions into baseline operational routes.",
      vesselsAffected: 9,
      mitigationAction: "Enforce mandatory dark-transit parameters (AIS silencing) and establish direct coordination vectors with regional naval escorts."
    },
    {
      id: 2,
      title: "Malacca Strait Spoofing Array",
      zone: "Singapore Strait Outer Limits",
      severity: "MEDIUM",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      date: "2026-06-30",
      source: "ReCAAP Alert Matrix",
      summary: "Electronic warfare monitors have confirmed massive, systematic GPS signal spoofing and AIS manipulation targeting commercial corridors.",
      impactAnalysis: "High risk of localized collisions due to false position reporting. Automatic collision avoidance systems (ARPA) throwing noise anomalies.",
      vesselsAffected: 22,
      mitigationAction: "Instruct bridge crews to transition to manual radar plotting and secondary dead reckoning navigation arrays."
    }
  ];

  const filteredThreats = threatDatabase.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDossier = threatDatabase[selectedThreat];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      {/* COLUMN 1: Master Navigation Sidebar */}
      <DashboardSidebar currentRoute="Threats" />

      {/* COLUMN 2: Threat Matrix Content Hub */}
      <div className="flex-1 h-full flex flex-col p-6 space-y-5 overflow-hidden">
        
        {/* Title Node Header */}
        <div className="border-b border-slate-200 pb-4 shrink-0">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Geopolitical Threat Registry</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time situational intelligence and strategic intercept dossier logging</p>
        </div>

        {/* Search and Control Strip */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter threat parameters or operational zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button className="panel-card bg-white px-3 py-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5" /> Filter Feed
          </button>
        </div>

        {/* Master-Detail Split Arena */}
        <div className="flex-1 flex gap-5 items-stretch overflow-hidden w-full">
          
          {/* LEFT SUB-PANE: Threat Brief Stream List */}
          <div className="w-2/5 overflow-y-auto space-y-3 pr-1">
            {filteredThreats.map((threat) => (
              <button
                key={threat.id}
                onClick={() => setSelectedThreat(threat.id)}
                className={`w-full text-left p-4 border rounded-xl transition-all flex flex-col gap-2 relative bg-white shadow-sm ${
                  selectedThreat === threat.id 
                    ? "border-blue-500 ring-1 ring-blue-500" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <span className="font-bold text-xs text-slate-900 font-mono leading-tight uppercase">
                    {threat.title}
                  </span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded font-mono ${threat.badgeClass}`}>
                    {threat.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{threat.summary}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {threat.zone}</span>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT SUB-PANE: Interactive Intel Dossier Exploder */}
          <div className="w-3/5 panel-card bg-white p-5 flex flex-col space-y-5 overflow-y-auto">
            
            {/* Dossier Header Info */}
            <div className="border-b border-slate-100 pb-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-600 tracking-widest font-mono uppercase flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 animate-pulse" /> Active Intelligence Docket
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 border rounded-md font-mono ${activeDossier.badgeClass}`}>
                  {activeDossier.severity} LEVEL RISK
                </span>
              </div>
              <h2 className="text-base font-black text-slate-900 uppercase font-mono tracking-tight">{activeDossier.title}</h2>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-300" /> {activeDossier.zone}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-300" /> {activeDossier.date}</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-slate-300" /> {activeDossier.source}</span>
              </div>
            </div>

            {/* Assessment Narrative Sections */}
            <div className="space-y-4 flex-1 text-xs">
              
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-400 font-mono text-[10px] uppercase tracking-wider">Incident Overview</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">{activeDossier.summary}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-rose-500" /> Strategic Supply Chain Impact Analysis
                </h4>
                <p className="text-slate-700 leading-relaxed pl-1">{activeDossier.impactAnalysis}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Directed Tactical Mitigations
                </h4>
                <p className="text-slate-700 leading-relaxed pl-1">{activeDossier.mitigationAction}</p>
              </div>

            </div>

            {/* Operational Impact Footer Stat Banner */}
            <div className="bg-slate-900 text-white rounded-xl p-3.5 flex justify-between items-center font-mono shrink-0 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Assets Inside Danger Radius:</span>
              <span className="text-sm font-bold text-amber-400">{activeDossier.vesselsAffected} Monitored Vessels</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}