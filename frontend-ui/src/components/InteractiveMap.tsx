// "use client";

// import React, { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix Leaflet's default marker asset URLs so they load natively in Next.js
// const customIcon = L.icon({
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// interface InteractiveMapProps {
//   rerouteTriggered: boolean;
// }

// // Sub-component to handle automatic viewport panning when anomalies occur
// function MapController({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom());
//   }, [center, map]);
//   return null;
// }

// export default function InteractiveMap({
//   rerouteTriggered,
// }: InteractiveMapProps) {
//   // Baseline static coordinate array matching our primary Gulf transit corridors
//   const standardRoute: [number, number][] = [
//     [26.1, 50.6], // Persian Gulf (Origin)
//     [26.2, 56.5], // Strait of Hormuz
//     [18.5, 60.2], // Arabian Sea Transit Grid
//     [22.4, 69.7], // Jamnagar, India (Refinery Hub Terminal)
//   ];

//   // Dynamic alternate route drawn to bypass maritime conflict entries (+10 Days alteration)
//   const alternateRoute: [number, number][] = [
//     [26.1, 50.6], // Persian Gulf
//     [26.2, 56.5], // Strait of Hormuz
//     [10.0, 62.0], // Defensive Southerly Shift (Bypassing Arabian Sea threat parameters)
//     [15.0, 72.0], // West Coast Approach Line
//     [22.4, 69.7], // Jamnagar, India Terminal Destination
//   ];

//   // Active focal coordinates depending on system threat evaluation layout
//   const activeRoute = rerouteTriggered ? alternateRoute : standardRoute;
//   const mapCenter = rerouteTriggered
//     ? ([15.0, 65.0] as [number, number])
//     : ([22.0, 59.0] as [number, number]);

//   return (
//     <div className="w-full h-full relative bg-slate-950 min-h-screen">
//       <MapContainer
//         center={mapCenter}
//         zoom={5}
//         scrollWheelZoom={true}
//         style={{ height: "100vh", width: "100%" }} // Forces full operational screen dimensions
//         className="z-0"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
//           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//         />

//         <MapController center={mapCenter} />

//         <Polyline
//           positions={activeRoute}
//           color={rerouteTriggered ? "#f59e0b" : "#3b82f6"}
//           weight={4}
//           opacity={0.8}
//           dashArray={rerouteTriggered ? "10, 10" : undefined}
//         />

//         <Marker position={activeRoute[2]} icon={customIcon}>
//           <Popup>
//             <div className="text-slate-900 p-1 font-sans">
//               <p className="font-bold text-xs">MT Swarna Kamal</p>
//               <p className="text-[10px] text-slate-600 mt-0.5">
//                 Status:{" "}
//                 {rerouteTriggered
//                   ? "Executing Diversion Route"
//                   : "Standard Transit Corridor"}
//               </p>
//               <p className="text-[10px] font-mono mt-1 font-bold text-blue-600">
//                 {rerouteTriggered
//                   ? "ETA: +10 Days Extended"
//                   : "ETA: On Schedule"}
//               </p>
//             </div>
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// }











"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  rerouteTriggered: boolean;
}

/**
 * MapCoordinateTracker Component
 * Captures live mousemove events from the Leaflet canvas and passes
 * precise geographic coordinates and pixel offsets back to the parent HUD display
 */
function MapCoordinateTracker({ 
  onMouseMove 
}: { 
  onMouseMove: (coords: L.LatLng, point: L.Point) => void 
}) {
  useMapEvents({
    mousemove(e) {
      onMouseMove(e.latlng, e.containerPoint);
    },
  });
  return null;
}

/**
 * InteractiveMap Component
 * Premium dark-themed Leaflet mapping interface featuring:
 * - CartoDB Dark Matter server-side rendered tile layer (zero white artifacts)
 * - Dynamic HUD overlay tracking real-time cursor coordinates (LAT, LON, SOG, COG, ELEV)
 * - Animated maritime corridor polylines using CSS stroke-dasharray flow effect
 * - Live port rendering from database endpoints with tactical styling
 */
export default function InteractiveMap({ rerouteTriggered }: InteractiveMapProps) {
  // State: Live database port telemetry
  const [livePorts, setLivePorts] = useState<any[]>([]);
  
  // State: Dynamic cursor coordinate readout
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lon: string } | null>(null);
  
  // State: HUD pixel position tracking relative to map container
  const [hudPosition, setHudPosition] = useState<{ x: number; y: number } | null>(null);

  /**
   * Database Synchronization Hook
   * Fetches live port asset locations from the FastAPI backend
   * Validates response structure and applies safe array fallback guards
   */
  useEffect(() => {
    async function syncPorts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ports");
        if (res.ok) {
          const data = await res.json();
          setLivePorts(Array.isArray(data) ? data : (data.data || []));
        }
      } catch (e) {
        console.error("❌ Port telemetry synchronization failure:", e);
        setLivePorts([]);
      }
    }
    syncPorts();
  }, []);

  /**
   * Map Mouse Movement Handler
   * Converts Leaflet LatLng coordinates into clean formatted strings
   * Updates floating HUD position with smart offset from crosshair target
   */
  const handleMapMouseMove = (latlng: L.LatLng, point: L.Point) => {
    const latDeg = Math.abs(latlng.lat).toFixed(4);
    const latDir = latlng.lat >= 0 ? "N" : "S";
    const lonDeg = Math.abs(latlng.lng).toFixed(4);
    const lonDir = latlng.lng >= 0 ? "E" : "W";

    setCursorCoords({
      lat: `${latDeg}° ${latDir}`,
      lon: `${lonDeg}° ${lonDir}`,
    });
    
    // Offset HUD 20px right and down from cursor to prevent occlusion
    setHudPosition({ x: point.x + 20, y: point.y + 20 });
  };

  /**
   * Custom Port Icon Generator
   * Creates tactical-styled circular node markers with CSS-based styling
   */
  const createPortIcon = () => {
    return L.divIcon({
      className: "tactical-port-node",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      html: '<div class="w-3 h-3 bg-rose-500/80 border-2 border-rose-300/60 rounded-full shadow-lg"></div>'
    });
  };

  /**
   * Standard Maritime Corridor Route Coordinates
   * Primary shipping lane through Suez, Hormuz, and Malacca Straits
   */
  const standardCorridorCoordinates: [number, number][] = [
    [30.0, 32.0],   // Suez Canal Entry
    [12.5, 43.5],   // Bab-el-Mandeb Strategic Chokepoint
    [11.8, 51.5],   // Gulf of Aden Transit
    [26.2, 56.5],   // Strait of Hormuz Critical Passage
    [6.0, 95.0],    // Malacca Approach Vector
    [1.3, 103.8]    // Singapore Terminal Hub
  ];

  /**
   * Crisis Reroute Alternate Corridor Coordinates
   * Emergency bypass route via Cape of Good Hope (+10 days transit time)
   */
  const crisisRerouteCoordinates: [number, number][] = [
    [30.0, 32.0],   // Suez Canal
    [-34.4, 18.5],  // Cape of Good Hope Bypass (South Africa)
    [-20.0, 45.0],  // Open Indian Ocean Southern Arc
    [1.3, 103.8]    // Singapore Terminal Hub
  ];

  // Dynamic route selection based on simulation state
  const currentRoutePath = rerouteTriggered ? crisisRerouteCoordinates : standardCorridorCoordinates;

  return (
    <div className="w-full h-full relative bg-[#020617] overflow-hidden">
      <MapContainer 
        center={[15.0, 65.0]} 
        zoom={4} 
        className="w-full h-full z-10"
        zoomControl={false}
        attributionControl={false}
        style={{ background: '#020617' }}
      >
        {/* 
          TILE LAYER: CartoDB Dark Matter
          Server-side rendered dark basemap eliminating blown-out white regions
          No client-side CSS filters required - native dark cartography
        */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
          minZoom={2}
        />

        {/* Inject coordinate tracking event listener */}
        <MapCoordinateTracker onMouseMove={handleMapMouseMove} />

        {/* 
          ANIMATED SHIPPING CORRIDOR POLYLINES
          Uses CSS class with keyframe animations for flowing dash effect
          Color shifts from cyan (nominal) to rose (crisis reroute)
        */}
        <Polyline 
          positions={currentRoutePath}
          className="vector-animated-path"
          pathOptions={{
            color: rerouteTriggered ? "#f43f5e" : "#06b6d4",
            weight: 3,
            opacity: 0.9,
            dashArray: "10, 15",
            lineCap: "round",
            lineJoin: "round"
          }}
        />

        {/* GEOGRAPHIC REGION LABELS */}
        <Marker position={[27.5, 56.5]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip 
            permanent 
            direction="top" 
            className="map-geo-label bg-transparent border-0 text-cyan-400/70 font-mono text-[10px] font-bold tracking-wider"
          >
            STRAIT OF HORMUZ
          </Tooltip>
        </Marker>
        
        <Marker position={[11.2, 43.1]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip 
            permanent 
            direction="bottom" 
            className="map-geo-label bg-transparent border-0 text-cyan-400/70 font-mono text-[10px] font-bold tracking-wider"
          >
            BAB-EL-MANDEB
          </Tooltip>
        </Marker>
        
        <Marker position={[2.5, 101.5]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip 
            permanent 
            direction="left" 
            className="map-geo-label bg-transparent border-0 text-cyan-400/70 font-mono text-[10px] font-bold tracking-wider"
          >
            MALACCA STRAIT
          </Tooltip>
        </Marker>

        {/* 
          LIVE DATABASE PORT MARKERS
          Renders port locations fetched from /api/ports with fallback coordinate handling
          Each marker includes tactical popup with operational status
        */}
        {(livePorts || []).map((port, index) => {
          const lat = port.latitude || (port.coordinates && port.coordinates[0]);
          const lng = port.longitude || (port.coordinates && port.coordinates[1]);
          
          // Skip rendering if coordinate data is invalid or missing
          if (!lat || !lng) return null;

          return (
            <Marker 
              key={`port-${port.id || index}`} 
              position={[lat, lng]} 
              icon={createPortIcon()}
            >
              <Popup className="tactical-popup">
                <div className="bg-slate-950 text-slate-200 p-2.5 font-mono text-xs rounded border border-rose-900/50 shadow-xl">
                  <p className="text-rose-400 font-bold uppercase tracking-wide text-[11px]">
                    PORT // {port.name || "UNNAMED HUB"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Country: {port.country || "International Zone"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                    Status: OPERATIONAL
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 
        FLOATING CROSSHAIR TRACKING HUD
        Displays live geographic coordinates, speed over ground (SOG), course over ground (COG)
        Follows cursor with smart boundary detection to prevent overflow
      */}
      {cursorCoords && hudPosition && (
        <div 
          className="absolute z-[999] bg-[#060b13]/95 border border-cyan-500/30 font-mono text-[10px] text-cyan-400/90 p-3 rounded-md space-y-1 pointer-events-none shadow-2xl backdrop-blur-sm"
          style={{ 
            left: `${Math.min(hudPosition.x, window.innerWidth - 200)}px`, 
            top: `${Math.min(hudPosition.y, window.innerHeight - 180)}px` 
          }}
        >
          <div className="flex justify-between gap-6 border-b border-slate-800 pb-1 mb-1.5">
            <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">
              TARGET VECTOR
            </span>
            <span className="text-emerald-400 animate-pulse text-[9px]">● LIVE</span>
          </div>
          <div className="space-y-0.5">
            <div><span className="text-slate-500 w-12 inline-block">LAT:</span> <span className="text-cyan-300">{cursorCoords.lat}</span></div>
            <div><span className="text-slate-500 w-12 inline-block">LON:</span> <span className="text-cyan-300">{cursorCoords.lon}</span></div>
            <div><span className="text-slate-500 w-12 inline-block">ELEV:</span> <span className="text-slate-400">0m MSL</span></div>
            <div><span className="text-slate-500 w-12 inline-block">SOG:</span> <span className="text-emerald-400">{rerouteTriggered ? "14.8" : "12.4"} kn</span></div>
            <div><span className="text-slate-500 w-12 inline-block">COG:</span> <span className="text-amber-400">128°</span></div>
          </div>
        </div>
      )}

      {/* STATIC GIS METADATA PANEL */}
      <div className="absolute bottom-3 left-3 z-[500] bg-slate-950/80 border border-slate-800/80 text-slate-400 font-mono text-[10px] p-2.5 rounded tracking-wider pointer-events-none uppercase shadow-lg">
        <span>GRID RASTER RANGE: 1000 NM • PROJECTION: WGS84</span>
      </div>
    </div>
  );
}