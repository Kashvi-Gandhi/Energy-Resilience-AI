"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Ship, 
  GitFork, 
  Anchor, 
  BrainCircuit, 
  FileText, 
  Play, 
  Settings,
  User
} from "lucide-react";

interface SidebarProps {
  currentRoute?: string;
}

export default function DashboardSidebar({ currentRoute = "Overview" }: SidebarProps) {
  // Navigation categories mimicking an enterprise maritime operations command center
  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Live Map", icon: Map },
    { name: "Threats", icon: AlertTriangle },
    { name: "Vessels", icon: Ship },
    { name: "Routes", icon: GitFork },
    { name: "Ports", icon: Anchor },
    { name: "Risk Intelligence", icon: BrainCircuit },
    { name: "Reports", icon: FileText },
    { name: "Simulation", icon: Play },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-[#0B1329] border-r border-slate-800 flex flex-col h-screen text-slate-400 shrink-0 select-none font-sans">
      
      {/* 🚢 Top Brand Element */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="h-7 w-7 rounded-md border border-amber-500/30 flex items-center justify-center bg-amber-500/10">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xs font-black text-slate-100 tracking-wider uppercase font-mono">Resilience-AI</h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">Risk Intelligence Core</p>
        </div>
      </div>

      {/* 🧭 Main Navigation Link Stream */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === currentRoute;
          
          return (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all group relative ${
                isActive 
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20" 
                  : "hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span>{item.name}</span>
              
              {/* Optional UI Active indicators */}
              {isActive && (
                <div className="absolute right-2 h-1.5 w-1.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 🟢 Bottom Analyst Desk Anchor Card */}
      <div className="p-4 border-t border-slate-800 bg-[#070d1c] flex flex-col gap-3">
        {/* Network Status Node */}
        <div className="flex items-center gap-2 px-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-emerald-500 font-bold uppercase">System Online</span>
        </div>

        {/* User Identity Matrix */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[11px] font-bold text-slate-300 truncate leading-tight">Analyst Desk</h4>
            <p className="text-[9px] text-slate-500 truncate font-mono uppercase mt-0.5">Maritime Ops Center</p>
          </div>
        </div>
      </div>

    </aside>
  );
}

// Temporary quick inline dependency fix for build safety
function ShieldAlert({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  );
}