"use client"

import { useEffect, useRef } from "react"

// Mock disease hotspot data
const diseaseHotspots = [
  { lat: 40.7128, lng: -74.006, city: "New York", cases: 1250, disease: "COVID-19" },
  { lat: 51.5074, lng: -0.1278, city: "London", cases: 890, disease: "Influenza" },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", cases: 1100, disease: "COVID-19" },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", cases: 450, disease: "Dengue" },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo", cases: 670, disease: "COVID-19" },
  { lat: 19.076, lng: 72.8777, city: "Mumbai", cases: 980, disease: "Dengue" },
  { lat: -1.2921, lng: 36.8219, city: "Nairobi", cases: 320, disease: "Malaria" },
  { lat: 52.52, lng: 13.405, city: "Berlin", cases: 540, disease: "Influenza" },
  { lat: 37.7749, lng: -122.4194, city: "San Francisco", cases: 780, disease: "COVID-19" },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", cases: 420, disease: "Influenza" },
]

export default function DiseaseMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        // Import Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        if (mapRef.current) {
          // Initialize map
          const map = L.map(mapRef.current).setView([20, 0], 2)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map)

          // Custom icon function based on disease type
          const getMarkerColor = (disease: string) => {
            switch (disease) {
              case "COVID-19":
                return "#ef4444"
              case "Influenza":
                return "#f97316"
              case "Dengue":
                return "#eab308"
              case "Malaria":
                return "#22c55e"
              default:
                return "#6b7280"
            }
          }

          // Add markers for each hotspot
          diseaseHotspots.forEach((hotspot) => {
            const color = getMarkerColor(hotspot.disease)

            // Create custom icon
            const customIcon = L.divIcon({
              className: "custom-marker",
              html: `<div style="
                background-color: ${color};
                width: ${Math.max(20, hotspot.cases / 50)}px;
                height: ${Math.max(20, hotspot.cases / 50)}px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 10px;
              ">${hotspot.cases > 1000 ? "1K+" : hotspot.cases}</div>`,
              iconSize: [Math.max(20, hotspot.cases / 50), Math.max(20, hotspot.cases / 50)],
              iconAnchor: [Math.max(10, hotspot.cases / 100), Math.max(10, hotspot.cases / 100)],
            })

            const marker = L.marker([hotspot.lat, hotspot.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`
                <div style="text-align: center;">
                  <h3 style="margin: 0 0 8px 0; color: ${color};">${hotspot.city}</h3>
                  <p style="margin: 0;"><strong>Disease:</strong> ${hotspot.disease}</p>
                  <p style="margin: 0;"><strong>Cases:</strong> ${hotspot.cases.toLocaleString()}</p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                    Click for detailed analysis
                  </p>
                </div>
              `)

            // Add hover effects
            marker.on("mouseover", function () {
              this.openPopup()
            })
          })

          // Add legend
          const legend = L.control({ position: "bottomright" })
          legend.onAdd = () => {
            const div = L.DomUtil.create("div", "legend")
            div.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <h4 style="margin: 0 0 8px 0;">Disease Types</h4>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div><span style="display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></span>COVID-19</div>
                  <div><span style="display: inline-block; width: 12px; height: 12px; background: #f97316; border-radius: 50%; margin-right: 8px;"></span>Influenza</div>
                  <div><span style="display: inline-block; width: 12px; height: 12px; background: #eab308; border-radius: 50%; margin-right: 8px;"></span>Dengue</div>
                  <div><span style="display: inline-block; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; margin-right: 8px;"></span>Malaria</div>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">
                  Marker size indicates case count
                </p>
              </div>
            `
            return div
          }
          legend.addTo(map)
        }
      }
    }

    initMap()
  }, [])

  return <div ref={mapRef} className="h-[400px] w-full rounded-lg border" style={{ minHeight: "400px" }} />
}
