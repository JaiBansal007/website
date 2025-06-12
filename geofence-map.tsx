"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Shield, TrendingUp } from "lucide-react"

// Enhanced geofence data with city-level disease tracking
const geofenceData = [
  {
    id: 1,
    city: "New York",
    lat: 40.7128,
    lng: -74.006,
    radius: 50000, // 50km radius
    cases: 1250,
    disease: "COVID-19",
    severity: "high",
    trend: "+15%",
    population: 8400000,
    incidenceRate: 14.9,
    lastUpdated: "2 mins ago",
    alerts: ["High transmission rate", "Hospital capacity at 85%"],
  },
  {
    id: 2,
    city: "Los Angeles",
    lat: 34.0522,
    lng: -118.2437,
    radius: 60000,
    cases: 890,
    disease: "Influenza",
    severity: "medium",
    trend: "+8%",
    population: 3900000,
    incidenceRate: 22.8,
    lastUpdated: "5 mins ago",
    alerts: ["Seasonal peak approaching"],
  },
  {
    id: 3,
    city: "Miami",
    lat: 25.7617,
    lng: -80.1918,
    radius: 40000,
    cases: 450,
    disease: "Dengue",
    severity: "high",
    trend: "+22%",
    population: 470000,
    incidenceRate: 95.7,
    lastUpdated: "1 min ago",
    alerts: ["Vector breeding season", "Increased mosquito activity"],
  },
  {
    id: 4,
    city: "Chicago",
    lat: 41.8781,
    lng: -87.6298,
    radius: 45000,
    cases: 670,
    disease: "COVID-19",
    severity: "medium",
    trend: "+5%",
    population: 2700000,
    incidenceRate: 24.8,
    lastUpdated: "3 mins ago",
    alerts: ["Stable transmission"],
  },
  {
    id: 5,
    city: "Houston",
    lat: 29.7604,
    lng: -95.3698,
    radius: 55000,
    cases: 320,
    disease: "Malaria",
    severity: "low",
    trend: "+3%",
    population: 2300000,
    incidenceRate: 13.9,
    lastUpdated: "7 mins ago",
    alerts: ["Travel-related cases"],
  },
  {
    id: 6,
    city: "Phoenix",
    lat: 33.4484,
    lng: -112.074,
    radius: 50000,
    cases: 540,
    disease: "Influenza",
    severity: "medium",
    trend: "+12%",
    population: 1600000,
    incidenceRate: 33.8,
    lastUpdated: "4 mins ago",
    alerts: ["School outbreaks reported"],
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "#ef4444"
    case "medium":
      return "#f97316"
    case "low":
      return "#22c55e"
    default:
      return "#6b7280"
  }
}

const getDiseaseColor = (disease: string) => {
  switch (disease) {
    case "COVID-19":
      return "#ef4444"
    case "Influenza":
      return "#3b82f6"
    case "Dengue":
      return "#eab308"
    case "Malaria":
      return "#22c55e"
    default:
      return "#6b7280"
  }
}

export default function GeofenceMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null)

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        // Import Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        if (mapRef.current) {
          // Initialize map centered on US
          const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map)

          // Add geofences and markers
          geofenceData.forEach((geofence) => {
            const color = getSeverityColor(geofence.severity)
            const diseaseColor = getDiseaseColor(geofence.disease)

            // Create geofence circle
            const circle = L.circle([geofence.lat, geofence.lng], {
              color: color,
              fillColor: color,
              fillOpacity: 0.1,
              radius: geofence.radius,
              weight: 3,
            }).addTo(map)

            // Create custom marker
            const customIcon = L.divIcon({
              className: "custom-geofence-marker",
              html: `
                <div style="
                  background: linear-gradient(135deg, ${diseaseColor}, ${color});
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 12px;
                  position: relative;
                ">
                  ${geofence.cases > 1000 ? "1K+" : geofence.cases}
                  <div style="
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 12px;
                    height: 12px;
                    background: ${geofence.severity === "high" ? "#ef4444" : geofence.severity === "medium" ? "#f97316" : "#22c55e"};
                    border-radius: 50%;
                    border: 2px solid white;
                    animation: pulse 2s infinite;
                  "></div>
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })

            const marker = L.marker([geofence.lat, geofence.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 250px; font-family: system-ui;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h3 style="margin: 0; color: ${diseaseColor}; font-size: 16px; font-weight: bold;">${geofence.city}</h3>
                    <span style="
                      background: ${color}; 
                      color: white; 
                      padding: 2px 8px; 
                      border-radius: 12px; 
                      font-size: 10px; 
                      text-transform: uppercase;
                    ">${geofence.severity}</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Disease:</strong> ${geofence.disease}<br>
                    <strong>Cases:</strong> ${geofence.cases.toLocaleString()}<br>
                    <strong>Trend:</strong> <span style="color: ${geofence.trend.startsWith("+") ? "#ef4444" : "#22c55e"}">${geofence.trend}</span><br>
                    <strong>Incidence Rate:</strong> ${geofence.incidenceRate} per 100k<br>
                    <strong>Population:</strong> ${geofence.population.toLocaleString()}
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    <strong>Alerts:</strong><br>
                    ${geofence.alerts.map((alert) => `• ${alert}`).join("<br>")}
                  </div>
                  <div style="margin-top: 8px; font-size: 11px; color: #999;">
                    Last updated: ${geofence.lastUpdated}
                  </div>
                </div>
              `)

            // Add click event to show details
            marker.on("click", () => {
              setSelectedGeofence(geofence)
            })

            circle.on("click", () => {
              setSelectedGeofence(geofence)
            })
          })

          // Add CSS for pulse animation
          const style = document.createElement("style")
          style.textContent = `
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.7; }
              100% { transform: scale(1); opacity: 1; }
            }
          `
          document.head.appendChild(style)

          // Add legend
          const legend = L.control({ position: "bottomright" })
          legend.onAdd = () => {
            const div = L.DomUtil.create("div", "legend")
            div.innerHTML = `
              <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-family: system-ui;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px;">Geofence Legend</h4>
                <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 50%;"></div>
                    <span>High Risk (>20 cases/100k)</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #f97316; border-radius: 50%;"></div>
                    <span>Medium Risk (10-20/100k)</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 50%;"></div>
                    <span>Low Risk (<10/100k)</span>
                  </div>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                  Circle radius = monitoring area<br>
                  Marker size = case count
                </div>
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Geofenced Disease Monitoring
              </CardTitle>
              <CardDescription>Real-time city-level disease tracking with intelligent geofencing</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="h-[500px] w-full rounded-lg border" />
            </CardContent>
          </Card>
        </div>

        {/* Geofence Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Geofences</CardTitle>
              <CardDescription>Click on map markers for details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geofenceData.slice(0, 3).map((geofence) => (
                  <div
                    key={geofence.id}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedGeofence(geofence)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{geofence.city}</h4>
                      <Badge
                        variant={
                          geofence.severity === "high"
                            ? "destructive"
                            : geofence.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {geofence.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>
                        {geofence.disease}: {geofence.cases} cases
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className={geofence.trend.startsWith("+") ? "text-red-500" : "text-green-500"}>
                          {geofence.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Geofence Details */}
          {selectedGeofence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {selectedGeofence.city} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Cases</div>
                    <div className="text-2xl font-bold">{selectedGeofence.cases.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Trend</div>
                    <div
                      className={`text-2xl font-bold ${selectedGeofence.trend.startsWith("+") ? "text-red-500" : "text-green-500"}`}
                    >
                      {selectedGeofence.trend}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Disease Type</div>
                  <Badge style={{ backgroundColor: getDiseaseColor(selectedGeofence.disease) }} className="text-white">
                    {selectedGeofence.disease}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Incidence Rate</div>
                  <div className="text-lg font-semibold">{selectedGeofence.incidenceRate} per 100k</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Active Alerts</div>
                  <div className="space-y-1">
                    {selectedGeofence.alerts.map((alert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Population: {selectedGeofence.population.toLocaleString()} • Updated: {selectedGeofence.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
