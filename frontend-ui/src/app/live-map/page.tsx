"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import DashboardSidebar from "../../components/DashboardSidebar";
import { SlidersHorizontal, Eye, Globe, Anchor, Layers, Ship } from "lucide-react";

// Safe CSR dynamic import for full-bleed map instance
const InteractiveMap = dynamic(() => import("../../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="h-5 w-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
      <span className="font-mono text-[10px] tracking-widest uppercase">Streaming Global GIS Canvas...</span>
    </div>
  ),
});

export default function LiveMapPage() {
  // Client filters for map layout toggles
  const [showHeatmaps, setShowHeatmaps] = useState(true);
  const [showPipelines, setShowPipelines] = useState(false);
  const [mapType, setMapType] = useState("Satellite Base");

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      
      {/* COLUMN 1: Master Control Navigation Wing */}
      <DashboardSidebar currentRoute="Live Map" />

      {/* COLUMN 2: Full-Bleed Map Canvas Layer */}
      <div className="flex-1 h-full relative z-0">
        
        {/* Full-screen absolute map grid wrapper */}
        <div className="absolute inset-0 w-full h-full">
          <InteractiveMap rerouteTriggered={false} />
        </div>

        {/* TOP LEFT OVERLAY: Mission Telemetry Title HUD Banner */}
        <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200/80 px-4 py-3 rounded-xl shadow-xl max-w-sm select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs font-black tracking-wider text-slate-900 uppercase font-mono">
              Geospatial Operations Theatre
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5 font-sans">
            Real-time multi-source AIS position streaming and corridor anomaly validation tracking node.
          </p>
        </div>

        {/* RIGHT SIDE FLOATING OVERLAY: ArcGIS Layer Control HUD Deck */}
        <div className="absolute top-6 right-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200/80 w-[280px] rounded-xl shadow-2xl p-4 select-none flex flex-col space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          
          {/* Header Controls */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">
              Layer Controls & Filters
            </span>
          </div>

          {/* Telemetry Layer Selection Toggles */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              Active Map Overlays
            </span>
            
            <button 
              onClick={() => setShowHeatmaps(!showHeatmaps)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                showHeatmaps 
                  ? "bg-blue-50 border-blue-200 text-blue-700" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                <span>Geopolitical Heatmaps</span>
              </div>
              <Eye className={`h-3.5 w-3.5 ${showHeatmaps ? "opacity-100" : "opacity-40"}`} />
            </button>

            <button 
              onClick={() => setShowPipelines(!showPipelines)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                showPipelines 
                  ? "bg-blue-50 border-blue-200 text-blue-700" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span>Chokepoint Radii Buffers</span>
              </div>
              <Eye className={`h-3.5 w-3.5 ${showPipelines ? "opacity-100" : "opacity-40"}`} />
            </button>
          </div>

          {/* Base Map Skin Selector Matrix */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              Base Map Render Type
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {["GIS Gray", "Satellite Base", "Topographic"].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapType(type)}
                  className={`px-2 py-1.5 border rounded-md text-[10px] font-mono font-bold tracking-tight transition-all ${
                    mapType === type 
                      ? "bg-slate-900 border-slate-900 text-white" 
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Live Feed Totals Module */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 font-mono">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Screen Targets
            </span>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5"><Ship className="h-3 w-3 text-slate-400" /> Tankers</span>
              <span className="font-bold">412</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5"><Anchor className="h-3 w-3 text-slate-400" /> Deep Ports</span>
              <span className="font-bold">14</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}