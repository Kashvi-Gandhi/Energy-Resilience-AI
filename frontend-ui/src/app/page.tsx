"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import DashboardSidebar from "../components/DashboardSidebar";
import OperationalMetrics from "../components/OperationalMetrics";
import ThreatAlertFeed from "../components/ThreatAlertFeed";
import VesselsTable from "../components/VesselsTable";
import InsightCard from "../components/InsightCard";

const InteractiveMap = dynamic(() => import("../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="h-4 w-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
      <span className="font-mono text-[10px] tracking-wider uppercase">Loading GIS Tracking Array...</span>
    </div>
  ),
});

export default function GlobalDashboard() {
  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  const handleRunSimulation = async (scenario: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/simulate-crisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setSimulationData(data);
      }
    } catch (error) {
      console.error("Simulation connection failure:", error);
    } finally {
      setLoading(false);
    }
  };

  const rerouteActive = simulationData?.logistics_mitigation?.reroute_triggered || false;

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden antialiased text-slate-900 font-sans">
      
      {/* COLUMN 1: Fixed Navigation Bar */}
      <DashboardSidebar currentRoute="Overview" />

      {/* COLUMN 2: Scrollable Data Desk Workspace */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto p-6 space-y-6">
        
        {/* Top Control Bar Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 shrink-0">
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono">
              Maritime Geopolitical Risk Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              AI-Powered Threat Intelligence & Supply Chain Resilience
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${rerouteActive ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
            <div className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-600 uppercase tracking-wider">
              System Matrix: {rerouteActive ? "TACTICAL_DIVERSION" : "NOMINAL_MONITORING"}
            </div>
          </div>
        </div>

        {/* Five-Grid Metrics Component */}
        <OperationalMetrics data={simulationData} />

        {/* 🛠️ FIX HERE: Changed from grid items-stretch to a clean flexible workspace array */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          
          {/* Main Map Box - Explicitly sized to avoid vertical stretch conflicts */}
          <div className="w-full lg:w-2/3 panel-card flex flex-col overflow-hidden h-[540px] shrink-0">
            <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600">
                Live Shipping Lane Analysis Arena
              </span>
              {rerouteActive && (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                  ⚠️ Alternate Corridor Active
                </span>
              )}
            </div>
            <div className="flex-1 w-full relative z-0">
              <InteractiveMap rerouteTriggered={rerouteActive} />
            </div>
          </div>

          {/* Right Threat Interactive Feed - Inherits identical height constraints perfectly */}
          <div className="w-full lg:w-1/3 h-[540px] shrink-0">
            <ThreatAlertFeed onSimulate={handleRunSimulation} isLoading={loading} />
          </div>

        </div>

        {/* Dynamic Generative AI Intercept Card Layout */}
        {simulationData && (
          <div className="w-full transition-all duration-300">
            <InsightCard 
              scout={simulationData.scout_assessment}
              logistics={simulationData.logistics_mitigation}
            />
          </div>
        )}

        {/* Bottom Matrix Ledger Table - Completely separated from the column layout elements above */}
        <div className="w-full pt-2">
          <VesselsTable data={simulationData} />
        </div>

      </div>
    </div>
  );
}