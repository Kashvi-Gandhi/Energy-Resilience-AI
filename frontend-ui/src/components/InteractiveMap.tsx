"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMapEvents, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Tile layer URLs for each map type ---
const TILE_LAYERS: Record<string, { url: string; attribution: string }> = {
  "GIS Gray": {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  "Satellite Base": {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  "Topographic": {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
};

// --- Prop types ---
interface InteractiveMapProps {
  rerouteTriggered: boolean;
  /** Whether to show threat heatmap markers/circles */
  showHeatmaps?: boolean;
  /** Whether to show chokepoint radius buffers */
  showPipelines?: boolean;
  /** Base map tile style: "GIS Gray" | "Satellite Base" | "Topographic" */
  mapType?: string;
}

/**
 * MapCoordinateTracker
 * Listens to Leaflet mousemove events and forwards lat/lng + pixel position
 * to the parent for the floating HUD readout.
 */
function MapCoordinateTracker({
  onMouseMove,
}: {
  onMouseMove: (coords: L.LatLng, point: L.Point) => void;
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
 *
 * Features:
 * - Geo-anchored port markers fetched from /api/ports (CircleMarker — always stays on map coordinates)
 * - No default route polyline shown unless rerouteTriggered === true
 * - Right-panel layer controls (heatmaps, chokepoint buffers, map type) wired via props
 * - Dark CartoDB basemap by default with optional tile layer switching
 * - Floating HUD cursor coordinate readout
 */
export default function InteractiveMap({
  rerouteTriggered,
  showHeatmaps = false,
  showPipelines = false,
  mapType = "Satellite Base",
}: InteractiveMapProps) {
  // Live ports fetched from /api/ports
  const [livePorts, setLivePorts] = useState<any[]>([]);

  // Floating HUD state
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [hudPosition, setHudPosition] = useState<{ x: number; y: number } | null>(null);

  /**
   * Fetch all ports from the backend on mount.
   * CircleMarker renders each port as a native Leaflet vector (geo-anchored),
   * so they follow the map when panning/zooming — unlike screen-overlay divs.
   */
  useEffect(() => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    async function fetchPorts() {
      let loaded = false;
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ports");
        if (res.ok) {
          const data = await res.json();
          const clean = Array.isArray(data) ? data : [];
          if (clean.length > 0) { setLivePorts(clean); loaded = true; }
        }
      } catch (e) {
        console.warn("⚠️ Backend ports unreachable, using Supabase direct.");
      }

      if (!loaded && SUPABASE_URL && SUPABASE_KEY) {
        try {
          const res = await fetch(
            `${SUPABASE_URL}/rest/v1/ports?select=id,name,country,latitude,longitude,throughput_capacity_mtpa`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
          );
          if (res.ok) {
            const data = await res.json();
            setLivePorts(Array.isArray(data) ? data : []);
          }
        } catch (e) { console.error("❌ Supabase ports fallback failed:", e); }
      }
    }
    fetchPorts();
  }, []);

  /** Update the floating HUD display with current cursor position */
  const handleMapMouseMove = (latlng: L.LatLng, point: L.Point) => {
    const latDeg = Math.abs(latlng.lat).toFixed(4);
    const latDir = latlng.lat >= 0 ? "N" : "S";
    const lonDeg = Math.abs(latlng.lng).toFixed(4);
    const lonDir = latlng.lng >= 0 ? "E" : "W";
    setCursorCoords({ lat: `${latDeg}° ${latDir}`, lon: `${lonDeg}° ${lonDir}` });
    setHudPosition({ x: point.x + 20, y: point.y + 20 });
  };

  /**
   * Crisis reroute corridor — only shown when rerouteTriggered === true.
   * Cape of Good Hope bypass (+10 days transit time).
   */
  const crisisRerouteCoordinates: [number, number][] = [
    [30.0, 32.0],   // Suez Canal
    [-34.4, 18.5],  // Cape of Good Hope Bypass (South Africa)
    [-20.0, 45.0],  // Open Indian Ocean Southern Arc
    [1.3, 103.8],   // Singapore Terminal Hub
  ];

  /**
   * Chokepoint threat circles — shown when showPipelines === true.
   * Renders semi-transparent red radius buffers around key maritime chokepoints.
   */
  const chokepoints: { pos: [number, number]; name: string }[] = [
    { pos: [26.5, 56.3], name: "Strait of Hormuz" },
    { pos: [11.6, 43.3], name: "Bab-el-Mandeb" },
    { pos: [2.0, 102.5], name: "Strait of Malacca" },
    { pos: [30.5, 32.3], name: "Suez Canal" },
  ];

  /**
   * Heatmap risk zones — shown when showHeatmaps === true.
   * Larger orange circles representing geopolitical risk heat areas.
   */
  const heatmapZones: { pos: [number, number]; name: string; intensity: number }[] = [
    { pos: [26.0, 55.0], name: "Persian Gulf Conflict Zone", intensity: 0.7 },
    { pos: [13.0, 43.0], name: "Red Sea Disruption Zone", intensity: 0.6 },
    { pos: [15.0, 42.5], name: "Yemen Maritime Threat Zone", intensity: 0.8 },
    { pos: [1.5, 104.0], name: "South China Sea Tension", intensity: 0.5 },
  ];

  // Resolve the active tile layer config (fallback to dark if key is unknown)
  const activeTile = TILE_LAYERS[mapType] || TILE_LAYERS["Satellite Base"];

  return (
    <div className="w-full h-full relative bg-[#020617] overflow-hidden">
      <MapContainer
        center={[15.0, 65.0]}
        zoom={4}
        className="w-full h-full z-10"
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#020617" }}
      >
        {/* --- BASE MAP TILE LAYER --- */}
        <TileLayer
          url={activeTile.url}
          attribution={activeTile.attribution}
          subdomains="abcd"
          maxZoom={20}
          minZoom={2}
        />

        {/* Coordinate HUD event listener */}
        <MapCoordinateTracker onMouseMove={handleMapMouseMove} />

        {/* --------------------------------------------------------------- */}
        {/* CRISIS REROUTE POLYLINE                                          */}
        {/* Only rendered when rerouteTriggered is true — NO default route   */}
        {/* --------------------------------------------------------------- */}
        {rerouteTriggered && (
          <Polyline
            positions={crisisRerouteCoordinates}
            pathOptions={{
              color: "#f43f5e",
              weight: 3,
              opacity: 0.9,
              dashArray: "10, 15",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* --------------------------------------------------------------- */}
        {/* CHOKEPOINT RADIUS BUFFERS (Right panel: Chokepoint Radii toggle) */}
        {/* --------------------------------------------------------------- */}
        {showPipelines &&
          chokepoints.map((cp, i) => (
            <CircleMarker
              key={`cp-${i}`}
              center={cp.pos}
              radius={40}
              pathOptions={{
                color: "#f43f5e",
                fillColor: "#f43f5e",
                fillOpacity: 0.08,
                weight: 1.5,
                opacity: 0.5,
                dashArray: "6, 4",
              }}
            >
              <Tooltip
                permanent
                direction="top"
                className="bg-transparent border-0 shadow-none"
              >
                <span
                  style={{
                    color: "#f87171",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "0.1em",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  {cp.name.toUpperCase()}
                </span>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* --------------------------------------------------------------- */}
        {/* GEOPOLITICAL HEATMAP ZONES (Right panel: Heatmaps toggle)        */}
        {/* --------------------------------------------------------------- */}
        {showHeatmaps &&
          heatmapZones.map((zone, i) => (
            <CircleMarker
              key={`heat-${i}`}
              center={zone.pos}
              radius={60}
              pathOptions={{
                color: "#f97316",
                fillColor: "#f97316",
                fillOpacity: zone.intensity * 0.15,
                weight: 1,
                opacity: 0.4,
              }}
            >
              <Tooltip direction="top" className="bg-transparent border-0 shadow-none">
                <span
                  style={{
                    color: "#fb923c",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  {zone.name}
                </span>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* --------------------------------------------------------------- */}
        {/* PORT MARKERS — fetched from /api/ports                           */}
        {/*                                                                   */}
        {/* Using CircleMarker instead of Marker+divIcon:                    */}
        {/* - CircleMarker is a native Leaflet SVG vector drawn at geo coords */}
        {/* - It moves with the map when panning/zooming (geo-anchored)      */}
        {/* - No dependency on Tailwind CSS classes inside Leaflet's canvas  */}
        {/* --------------------------------------------------------------- */}
        {livePorts.map((port, index) => {
          const lat = port.latitude ?? port.coordinates?.[0];
          const lng = port.longitude ?? port.coordinates?.[1];

          // Skip ports with missing or invalid coordinates
          if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;

          return (
            <CircleMarker
              key={`port-${port.id ?? index}`}
              center={[lat, lng]}
              radius={6}
              pathOptions={{
                color: "#ef4444",       // Red border ring
                fillColor: "#ef4444",   // Solid red fill
                fillOpacity: 0.9,
                weight: 2,
                opacity: 1,
              }}
            >
              <Popup>
                <div
                  style={{
                    background: "#020617",
                    color: "#e2e8f0",
                    padding: "10px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    borderRadius: "4px",
                    border: "1px solid #7f1d1d",
                    minWidth: "180px",
                  }}
                >
                  <p style={{ color: "#f87171", fontWeight: "bold", marginBottom: "4px" }}>
                    ⚓ {port.name ?? "UNNAMED PORT"}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                    Country: {port.country ?? "—"}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                    Capacity: {port.throughput_capacity_mtpa ?? "—"} MTPA
                  </p>
                  <p
                    style={{
                      color: "#34d399",
                      fontWeight: "bold",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    Status: OPERATIONAL
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* --------------------------------------------------------------- */}
      {/* FLOATING CURSOR COORDINATE HUD                                    */}
      {/* Rendered outside the MapContainer to avoid Leaflet z-index issues */}
      {/* --------------------------------------------------------------- */}
      {cursorCoords && hudPosition && (
        <div
          className="absolute z-[999] pointer-events-none"
          style={{
            left: `${Math.min(hudPosition.x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 210)}px`,
            top: `${Math.min(hudPosition.y, (typeof window !== "undefined" ? window.innerHeight : 800) - 140)}px`,
            background: "rgba(6, 11, 19, 0.95)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "6px",
            padding: "10px 14px",
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(103, 232, 249, 0.9)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
              paddingBottom: "5px",
              borderBottom: "1px solid rgba(51,65,85,0.6)",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "9px", letterSpacing: "0.1em" }}>
              TARGET VECTOR
            </span>
            <span style={{ color: "#34d399", fontSize: "9px" }}>● LIVE</span>
          </div>
          <div style={{ lineHeight: "1.8" }}>
            <div>
              <span style={{ color: "#64748b", width: "36px", display: "inline-block" }}>LAT:</span>
              <span style={{ color: "#a5f3fc" }}>{cursorCoords.lat}</span>
            </div>
            <div>
              <span style={{ color: "#64748b", width: "36px", display: "inline-block" }}>LON:</span>
              <span style={{ color: "#a5f3fc" }}>{cursorCoords.lon}</span>
            </div>
          </div>
        </div>
      )}

      {/* GIS metadata footer */}
      <div
        className="absolute bottom-3 left-3 z-[500] pointer-events-none"
        style={{
          background: "rgba(2, 6, 23, 0.8)",
          border: "1px solid rgba(51,65,85,0.8)",
          color: "#64748b",
          fontFamily: "monospace",
          fontSize: "10px",
          padding: "6px 10px",
          borderRadius: "4px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        GRID RASTER RANGE: 1000 NM • PROJECTION: WGS84
      </div>
    </div>
  );
}
