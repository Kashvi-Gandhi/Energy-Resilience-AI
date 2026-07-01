"use client";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function ReportsPage() {
  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased">
      <DashboardSidebar currentRoute="Reports" />
      <div className="flex-1 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">Reports Command Desk</h1>
          <p className="text-xs text-slate-500 font-medium">Resilience-AI Subsystem Monitoring Node</p>
        </div>
        <div className="panel-card bg-white p-6 flex-1 flex items-center justify-center border-dashed border-2 border-slate-200">
          <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">Initializing Reports telemetry matrices...</span>
        </div>
      </div>
    </div>
  );
}
