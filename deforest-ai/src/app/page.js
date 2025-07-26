'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  HeatmapLayer,
} from "@react-google-maps/api";

export default function HomePage() {
  const [yearsAhead, setYearsAhead] = useState(1);
  const modalRef = useRef(null);
  const pos = useRef({ x: 50, y: 100 }); // initial top-left position
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const center = { lat: -3.4653, lng: -62.2159 };
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(5);

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.current.x,
      y: e.clientY - pos.current.y,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    pos.current = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };
    if (modalRef.current) {
      modalRef.current.style.left = `${pos.current.x}px`;
      modalRef.current.style.top = `${pos.current.y}px`;
    }
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization"],
  });

  // 🔥 Dummy prediction data (replace with ML model output)
  const heatmapDataByYear = {
    1: [
      { lat: -3.2, lng: -60.0 },
      { lat: -3.5, lng: -61.5 },
      { lat: -4.0, lng: -62.2 },
    ],
    2: [
      { lat: -3.1, lng: -60.2 },
      { lat: -3.6, lng: -61.0 },
      { lat: -4.2, lng: -62.5 },
      { lat: -3.9, lng: -63.1 },
    ],
    3: [
      { lat: -3.0, lng: -60.1 },
      { lat: -3.7, lng: -61.8 },
      { lat: -4.3, lng: -63.0 },
      { lat: -4.1, lng: -62.7 },
    ],
    4: [
      { lat: -2.8, lng: -60.5 },
      { lat: -3.9, lng: -62.4 },
      { lat: -4.5, lng: -63.2 },
      { lat: -3.6, lng: -61.1 },
    ],
    5: [
      { lat: -2.9, lng: -60.3 },
      { lat: -4.0, lng: -62.9 },
      { lat: -4.4, lng: -63.5 },
      { lat: -3.8, lng: -61.3 },
    ],
  };

  useEffect(() => {
    const fetchSeverity = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/calculations/severity", {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            years_ahead: yearsAhead,
            location: {
              latitude: -3.5,
              longitude: -62.1,
            },
          }),
        });

        const data = await response.json();
        const severity = data.severity || 0.1;

        const basePoints = [
          { lat: -3.2, lng: -60.0 },
          { lat: -3.5, lng: -61.5 },
          { lat: -4.0, lng: -62.2 },
          { lat: -4.2, lng: -63.1 },
        ];

        const weightedPoints = basePoints.map((coord) => ({
          location: new window.google.maps.LatLng(coord.lat, coord.lng),
          weight: severity * 10,
        }));

        setHeatmapPoints(weightedPoints);
      } catch (error) {
        console.error(error);
      }
    };

    if (isLoaded && typeof window !== "undefined" && window.google) {
      fetchSeverity();
    }
  }, [yearsAhead, isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="w-screen h-screen relative">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"/>
      {/* Fullscreen Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        mapTypeId="satellite"
        onLoad={(mapInstance) => {
          setMap(mapInstance);
          setZoom(mapInstance.getZoom());
        }}
        onZoomChanged={() => {
          if (map) {
            setZoom(map.getZoom());
          }
        }}
      >
      <HeatmapLayer
        data={heatmapPoints}
        options={{
          dissipating: false,
          radius: 5000,
          opacity: 0.6,
        }}
      />
      </GoogleMap>

      {/* Floating Sidebar Modal */}
      <div
        ref={modalRef}
        className="absolute bg-white p-5 rounded-2xl shadow-2xl w-80 z-50 font-[Inter] text-gray-800 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100"
        style={{ top: pos.current.y, left: pos.current.x }}
      >
        <div
          className="cursor-move bg-green-50 px-4 py-3 rounded-t-2xl font-bold text-green-700 shadow-sm text-center"
          onMouseDown={onMouseDown}
        >
          <div className="text-sm tracking-wide uppercase text-green-600">DeforestAI</div>
          <div className="text-lg mt-1">Prediction Settings</div>
        </div>

        <label htmlFor="yearSlider" className="block mt-6 mb-2 text-base font-medium">
          Years into the future: <span className="text-green-600 font-semibold">{yearsAhead}</span>
        </label>
        <input
          id="yearSlider"
          type="range"
          min="1"
          max="5"
          value={yearsAhead}
          onChange={(e) => setYearsAhead(parseInt(e.target.value))}
          className="w-full accent-green-500"
        />

        <p className="mt-4 text-sm text-gray-600">
          Showing predictions for: <strong className="text-green-700">{2025 + yearsAhead}</strong>
        </p>
      </div>
    </div>
  );
}
