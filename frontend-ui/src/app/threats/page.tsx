"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Search, MapPin, Calendar, TrendingUp, ShieldCheck, FileText, Radio, Loader2 } from "lucide-react";

export default function ThreatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [threatDatabase, setThreatDatabase] = useState<any[]>([]);
  const [selectedThreat, setSelectedThreat] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/threats");
        const data = await res.json();
        setThreatDatabase(data);
      } catch (err) {
        console.error("❌ Failed to pull live threat briefs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchThreats();
  }, []);

  const filteredThreats = threatDatabase.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.supply_routes?.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDossier = filteredThreats[selectedThreat];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Threats" />

      <div className="flex-1 h-full flex flex-col p-6 space-y-5 overflow-hidden">
        <div className="border-b border-slate-200 pb-4 shrink-0">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Geopolitical Threat Registry</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time vector intelligence streamed straight from database intelligence logging</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter threat parameters or corridors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Syncing Geopolitical Dossiers...</span>
          </div>
        ) : filteredThreats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs uppercase">
            No Active Strategic Threat Warnings Found
          </div>
        ) : (
          <div className="flex-1 flex gap-5 items-stretch overflow-hidden w-full">
            
            {/* LEFT STREAM FEED */}
            <div className="w-2/5 overflow-y-auto space-y-3 pr-1">
              {filteredThreats.map((threat, idx) => (
                <button
                  key={threat.id || idx}
                  onClick={() => setSelectedThreat(idx)}
                  className={`w-full text-left p-4 border rounded-xl transition-all flex flex-col gap-2 relative bg-white shadow-sm ${
                    selectedThreat === idx ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-bold text-xs text-slate-900 font-mono leading-tight uppercase">{threat.title}</span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 border rounded font-mono bg-rose-50 text-rose-700 border-rose-200">
                      SCORE: {threat.supply_routes?.risk_score || 50}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{threat.content}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {threat.supply_routes?.route_name || "Global Transit"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* RIGHT DOSSIER EXPLODER */}
            {activeDossier && (
              <div className="w-3/5 panel-card bg-white p-5 flex flex-col space-y-5 overflow-y-auto">
                <div className="border-b border-slate-100 pb-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600 tracking-widest font-mono uppercase flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Intercept Dossier
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900 uppercase font-mono tracking-tight">{activeDossier.title}</h2>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activeDossier.supply_routes?.route_name}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Intel: {activeDossier.source}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1 text-xs">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-400 font-mono text-[10px] uppercase tracking-wider">Intercept Breakdown</h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">{activeDossier.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}