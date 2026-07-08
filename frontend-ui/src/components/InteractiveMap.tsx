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

// Coordinate tracking sub-component
function MapCoordinateTracker({ onMouseMove }: { onMouseMove: (coords: L.LatLng, point: L.Point) => void }) {
  useMapEvents({
    mousemove(e) {
      onMouseMove(e.latlng, e.containerPoint);
    },
  });
  return null;
}

export default function InteractiveMap({ rerouteTriggered }: InteractiveMapProps) {
  const [livePorts, setLivePorts] = useState<any[]>([]);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [hudPosition, setHudPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    async function syncPorts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ports");
        if (res.ok) {
          const data = await res.json();
          setLivePorts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch live database port paths:", e);
      }
    }
    syncPorts();
  }, []);

  const handleMapMouseMove = (latlng: L.LatLng, point: L.Point) => {
    const latDeg = Math.abs(latlng.lat).toFixed(4);
    const latDir = latlng.lat >= 0 ? "N" : "S";
    const lonDeg = Math.abs(latlng.lng).toFixed(4);
    const lonDir = latlng.lng >= 0 ? "E" : "W";

    setCursorCoords({
      lat: `${latDeg}° ${latDir}`,
      lon: `${lonDeg}° ${lonDir}`,
    });
    
    setHudPosition({ x: point.x + 20, y: point.y + 20 });
  };

  const createPortIcon = () => {
    return L.divIcon({
      className: "tactical-port-node",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  const standardCorridorCoordinates: [number, number][] = [
    [30.0, 32.0],  // Suez Canal
    [12.5, 43.5],  // Bab-el-Mandeb
    [11.8, 51.5],  // Gulf of Aden
    [26.2, 56.5],  // Strait of Hormuz
    [6.0, 95.0],   // Entry to Malacca
    [1.3, 103.8]   // Singapore Terminus
  ];

  const crisisRerouteCoordinates: [number, number][] = [
    [30.0, 32.0],   // Suez Canal
    [-34.4, 18.5],  // Cape of Good Hope Bypass
    [-20.0, 45.0],  // Open Indian Ocean Transit
    [1.3, 103.8]    // Singapore Terminus
  ];

  const currentRoutePath = rerouteTriggered ? crisisRerouteCoordinates : standardCorridorCoordinates;

  return (
    <div className="w-full h-full relative bg-[#020617] tactical-crosshair-cursor group">
      <MapContainer 
        center={[15.0, 65.0]} 
        zoom={4} 
        className="w-full h-full z-10"
        zoomControl={false}
        attributionControl={false}
      >
        {/* FIXED LAYER: Premium server-side Dark Matter base tiles that never blow out or glitch */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapCoordinateTracker onMouseMove={handleMapMouseMove} />

        {/* CYAN SHIPPING TRACKING LINES WITH FLOW ANIMATIONS */}
        <Polyline 
          positions={currentRoutePath}
          className="vector-animated-path"
          pathOptions={{
            color: rerouteTriggered ? "#f43f5e" : "#0ea5e9",
            weight: 2.5,
            opacity: 0.85
          }}
        />

        {/* REGIONAL TEXT LABELS */}
        <Marker position={[27.5, 56.5]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip permanent direction="top" className="map-geo-label">Strait of Hormuz</Tooltip>
        </Marker>
        <Marker position={[11.2, 43.1]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip permanent direction="bottom" className="map-geo-label">Bab-el-Mandeb</Tooltip>
        </Marker>
        <Marker position={[2.5, 101.5]} icon={L.divIcon({ className: 'hidden' })}>
          <Tooltip permanent direction="left" className="map-geo-label">Malacca Strait</Tooltip>
        </Marker>

        {/* LIVE PORTS FROM DATABASE */}
        {livePorts.map((port, index) => {
          const lat = port.latitude || (port.coordinates && port.coordinates[0]);
          const lng = port.longitude || (port.coordinates && port.coordinates[1]);
          if (!lat || !lng) return null;

          return (
            <Marker 
              key={`port-${port.id || index}`} 
              position={[lat, lng]} 
              icon={createPortIcon()}
            >
              <Popup>
                <div className="bg-slate-950 text-slate-200 p-2 font-mono text-xs rounded border border-red-900/50">
                  <p className="text-red-400 font-bold uppercase tracking-wide">PORT // {port.name || "UNNAMED HUB"}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Country: {port.country || "International Zone"}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">Status: OPERATIONAL</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* FLOATING TARGET INTERCEPT COORDINATES HUD */}
      {cursorCoords && hudPosition && (
        <div 
          className="absolute z-[999] bg-[#060b13]/95 border border-cyan-500/30 font-mono text-[10px] text-cyan-400/90 p-3 rounded space-y-1 pointer-events-none shadow-2xl backdrop-blur-sm"
          style={{ left: `${hudPosition.x}px`, top: `${hudPosition.y}px` }}
        >
          <div className="flex justify-between gap-6 border-b border-slate-800 pb-1 mb-1">
            <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">Vector Matrix Target</span>
            <span className="text-emerald-400 animate-pulse">SYS_LIVE</span>
          </div>
          <div><span className="text-slate-500">LAT:</span> {cursorCoords.lat}</div>
          <div><span className="text-slate-500">LON:</span> {cursorCoords.lon}</div>
          <div><span className="text-slate-500">ELEV:</span> 0m</div>
          <div><span className="text-slate-500">SOG:</span> {rerouteTriggered ? "14.8 kn" : "12.4 kn"}</div>
          <div><span className="text-slate-500">COG:</span> 128°</div>
        </div>
      )}

      {/* STATIC GIS DETAIL PANEL */}
      <div className="absolute bottom-3 left-3 z-[500] bg-slate-950/80 border border-slate-800/80 text-slate-400 font-mono text-[10px] p-2.5 rounded tracking-wider pointer-events-none uppercase">
        <span>GRID RASTER RANGE: 1000 km</span>
      </div>
    </div>
  );
}