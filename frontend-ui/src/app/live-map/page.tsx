"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardSidebar from "../../components/DashboardSidebar";
import { SlidersHorizontal, Eye, EyeOff, Globe, Anchor, Layers, Ship } from "lucide-react";

/**
 * Safe CSR dynamic import for the Leaflet map.
 * SSR must be disabled — Leaflet references window/document on import.
 */
const InteractiveMap = dynamic(() => import("../../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="h-5 w-5 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin" />
      <span className="font-mono text-[10px] tracking-widest uppercase">
        Streaming Global GIS Canvas...
      </span>
    </div>
  ),
});

export default function LiveMapPage() {
  // ── Right panel layer toggle states ──
  // These are passed as props to InteractiveMap so the panel actually controls the map.
  const [showHeatmaps, setShowHeatmaps] = useState(false);
  const [showPipelines, setShowPipelines] = useState(false);
  const [mapType, setMapType] = useState("Satellite Base");

  // ── Live counts for the asset readout panel ──
  const [portCount, setPortCount] = useState<number | null>(null);
  const [vesselCount, setVesselCount] = useState<number | null>(null);

  /**
   * Fetch live port and vessel counts from the backend to populate
   * the "Active Screen Targets" section in the right panel.
   */
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [portsRes, vesselsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/ports"),
          fetch("http://127.0.0.1:8000/api/vessels"),
        ]);

        if (portsRes.ok) {
          const ports = await portsRes.json();
          setPortCount(Array.isArray(ports) ? ports.length : 0);
        }
        if (vesselsRes.ok) {
          const vessels = await vesselsRes.json();
          setVesselCount(Array.isArray(vessels) ? vessels.length : 0);
        }
      } catch (err) {
        console.error("❌ Failed to fetch asset counts:", err);
      }
    }
    fetchCounts();
  }, []);

  const MAP_TYPES = ["GIS Gray", "Satellite Base", "Topographic"];

  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden antialiased">
      {/* COLUMN 1: Navigation Sidebar */}
      <DashboardSidebar currentRoute="Live Map" />

      {/* COLUMN 2: Full-bleed map canvas + floating overlays */}
      <div className="flex-1 h-full relative z-0">

        {/* ── Full-screen map ── */}
        <div className="absolute inset-0 w-full h-full">
          {/*
            Pass all right-panel states as props so the toggles actually control
            what is rendered on the map.
          */}
          <InteractiveMap
            rerouteTriggered={false}
            showHeatmaps={showHeatmaps}
            showPipelines={showPipelines}
            mapType={mapType}
          />
        </div>

        {/* ── TOP LEFT: Mission title banner ── */}
        <div className="absolute top-6 left-6 z-10 bg-[#060b13]/90 backdrop-blur-md border border-slate-700/60 px-4 py-3 rounded-xl shadow-xl max-w-sm select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs font-black tracking-wider text-white uppercase font-mono">
              Geospatial Operations Theatre
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-sans">
            Real-time multi-source AIS position streaming and corridor anomaly validation.
          </p>
        </div>

        {/* ── RIGHT PANEL: Layer Controls ── */}
        <div className="absolute top-6 right-6 z-10 bg-[#060b13]/90 backdrop-blur-md border border-slate-700/60 w-[280px] rounded-xl shadow-2xl p-4 select-none flex flex-col space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">

          {/* Panel header */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
              Layer Controls & Filters
            </span>
          </div>

          {/* ── Map Overlay Toggles ── */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
              Active Map Overlays
            </span>

            {/* Heatmaps toggle */}
            <button
              onClick={() => setShowHeatmaps((prev) => !prev)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                showHeatmaps
                  ? "bg-orange-500/10 border-orange-500/40 text-orange-300"
                  : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                <span>Geopolitical Heatmaps</span>
              </div>
              {showHeatmaps ? (
                <Eye className="h-3.5 w-3.5 text-orange-400" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 opacity-40" />
              )}
            </button>

            {/* Chokepoint radius buffers toggle */}
            <button
              onClick={() => setShowPipelines((prev) => !prev)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                showPipelines
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                  : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span>Chokepoint Radii Buffers</span>
              </div>
              {showPipelines ? (
                <Eye className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 opacity-40" />
              )}
            </button>
          </div>

          {/* ── Base Map Selector ── */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
              Base Map Render Type
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {MAP_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setMapType(type)}
                  className={`px-2 py-1.5 border rounded-md text-[10px] font-mono font-bold tracking-tight transition-all ${
                    mapType === type
                      ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300"
                      : "bg-slate-900/60 border-slate-700/40 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* ── Live Asset Counts ── */}
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 flex flex-col gap-2 font-mono">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Screen Targets
            </span>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Ship className="h-3 w-3 text-slate-500" /> Tankers
              </span>
              <span className="font-bold text-cyan-400">
                {vesselCount !== null ? vesselCount : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Anchor className="h-3 w-3 text-slate-500" /> Deep Ports
              </span>
              <span className="font-bold text-rose-400">
                {portCount !== null ? portCount : "—"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
