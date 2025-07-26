"use client";
import { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  HeatmapLayer,
} from "@react-google-maps/api";

export default function HomePage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization"],
  });

  const [yearsAhead, setYearsAhead] = useState(1);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const center = { lat: -3.4653, lng: -62.2159 };

  // Dummy prediction data by year
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

  // ✅ Only run on client when Maps API is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && isLoaded) {
      const points = (heatmapDataByYear[yearsAhead] || []).map(
        (coord) => new window.google.maps.LatLng(coord.lat, coord.lng)
      );
      setHeatmapPoints(points);
    }
  }, [yearsAhead, isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white shadow z-10">
        <h2 className="text-xl font-bold mb-4">Prediction Settings</h2>

        <label htmlFor="yearSelect" className="block mb-2 font-medium">
          Years into the future:
        </label>
        <select
          id="yearSelect"
          value={yearsAhead}
          onChange={(e) => setYearsAhead(parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {[1, 2, 3, 4, 5].map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? "year" : "years"}
            </option>
          ))}
        </select>

        <p className="mt-4 text-sm text-gray-600">
          Showing predictions for: <strong>{2025 + yearsAhead}</strong>
        </p>
      </div>

      {/* Map */}
      <div className="flex-1">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={5}
          mapTypeId="satellite"
        >
          {heatmapPoints.length > 0 && (
            <HeatmapLayer
              data={heatmapPoints}
              options={{ radius: 30, opacity: 0.6 }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
