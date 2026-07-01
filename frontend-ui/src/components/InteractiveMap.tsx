"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker asset URLs so they load natively in Next.js
const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface InteractiveMapProps {
  rerouteTriggered: boolean;
}

// Sub-component to handle automatic viewport panning when anomalies occur
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function InteractiveMap({
  rerouteTriggered,
}: InteractiveMapProps) {
  // Baseline static coordinate array matching our primary Gulf transit corridors
  const standardRoute: [number, number][] = [
    [26.1, 50.6], // Persian Gulf (Origin)
    [26.2, 56.5], // Strait of Hormuz
    [18.5, 60.2], // Arabian Sea Transit Grid
    [22.4, 69.7], // Jamnagar, India (Refinery Hub Terminal)
  ];

  // Dynamic alternate route drawn to bypass maritime conflict entries (+10 Days alteration)
  const alternateRoute: [number, number][] = [
    [26.1, 50.6], // Persian Gulf
    [26.2, 56.5], // Strait of Hormuz
    [10.0, 62.0], // Defensive Southerly Shift (Bypassing Arabian Sea threat parameters)
    [15.0, 72.0], // West Coast Approach Line
    [22.4, 69.7], // Jamnagar, India Terminal Destination
  ];

  // Active focal coordinates depending on system threat evaluation layout
  const activeRoute = rerouteTriggered ? alternateRoute : standardRoute;
  const mapCenter = rerouteTriggered
    ? ([15.0, 65.0] as [number, number])
    : ([22.0, 59.0] as [number, number]);

  return (
    <div className="w-full h-full relative bg-slate-950 min-h-screen">
      <MapContainer
        center={mapCenter}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }} // Forces full operational screen dimensions
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController center={mapCenter} />

        <Polyline
          positions={activeRoute}
          color={rerouteTriggered ? "#f59e0b" : "#3b82f6"}
          weight={4}
          opacity={0.8}
          dashArray={rerouteTriggered ? "10, 10" : undefined}
        />

        <Marker position={activeRoute[2]} icon={customIcon}>
          <Popup>
            <div className="text-slate-900 p-1 font-sans">
              <p className="font-bold text-xs">MT Swarna Kamal</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Status:{" "}
                {rerouteTriggered
                  ? "Executing Diversion Route"
                  : "Standard Transit Corridor"}
              </p>
              <p className="text-[10px] font-mono mt-1 font-bold text-blue-600">
                {rerouteTriggered
                  ? "ETA: +10 Days Extended"
                  : "ETA: On Schedule"}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
