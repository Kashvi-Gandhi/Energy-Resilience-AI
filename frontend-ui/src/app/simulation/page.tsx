"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { Play, RotateCcw, AlertOctagon, Flame, Activity, ShieldAlert, Cpu } from "lucide-react";

export default function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    { id: "weather", name: "Category 5 Typhoon Array", zone: "South China Sea", icon: Activity, color: "text-blue-500 bg-blue-50" },
    { id: "blockade", name: "Chokepoint Kinetic Blockade", zone: "Strait of Hormuz", icon: Flame, color: "text-rose-500 bg-rose-50" },
    { id: "cyber", name: "Port AIS Sat-Spoofing Wave", zone: "Rotterdam Terminals", icon: AlertOctagon, color: "text-amber-500 bg-amber-50" }
  ];

  const handleTriggerSim = (name: string) => {
    setIsRunning(true);
    setActivePreset(name);
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Simulation" />
      
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        
        {/* Header Title Section */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Crisis Simulation Laboratory</h1>
          <p className="text-xs text-slate-500 font-medium">Execute predictive what-if threat modeling matrices and calculate global logistics delta outcomes</p>
        </div>

        {/* Sandbox Content Layout Split Grid */}
        <div className="grid grid-cols-3 gap-6 items-start">
          
          {/* LEFT PANELS: Simulation Configuration Buttons */}
          <div className="col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Select Anomaly Vectors</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presets.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleTriggerSim(p.name)}
                    disabled={isRunning}
                    className="panel-card p-4 bg-white hover:border-blue-400 text-left transition-all flex flex-col justify-between h-36 group relative disabled:opacity-50 shadow-sm"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={`p-2 rounded-xl border ${p.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Play className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase font-mono tracking-tight leading-tight">{p.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.zone}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Manual Sandbox Overlap Control */}
            <div className="panel-card p-5 bg-white space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-700 font-mono tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-slate-600" /> Manual Variable Manipulation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Simulated Insurance Premium Surge Scale</span>
                  <span className="font-bold text-slate-800">+25%</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="25" className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Simulation Status Outcome Ticker */}
          <div className="col-span-1 panel-card p-4 bg-white flex flex-col space-y-4 shadow-sm h-full min-h-[300px]">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-700" /> Simulation Matrix Log
              </span>
              {activePreset && (
                <button onClick={() => setActivePreset(null)} className="text-slate-400 hover:text-slate-600">
                  <RotateCcw className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              {isRunning ? (
                <div className="space-y-3">
                  <div className="h-5 w-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="font-mono text-[11px] text-blue-600 uppercase font-bold tracking-wider">Compiling Logistics Reroutes...</p>
                </div>
              ) : activePreset ? (
                <div className="space-y-2 text-left w-full font-mono text-[11px]">
                  <div className="text-slate-400 uppercase font-bold text-[9px] tracking-wider">Active Array Node:</div>
                  <div className="bg-rose-50 text-rose-700 font-bold p-2.5 rounded-lg border border-rose-100 text-center uppercase tracking-wide">
                    {activePreset} ACTIVE
                  </div>
                  <div className="text-slate-500 text-[11px] leading-relaxed pt-2">
                    Predictive recalculations yield an estimated macro freight delay matrix delta of <span className="font-bold text-slate-800">+14 Days</span> across associated logistics pathways.
                  </div>
                </div>
              ) : (
                <span className="font-mono text-[11px] text-slate-400 tracking-wider uppercase">
                  Select a variable card to fire up calculations.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}