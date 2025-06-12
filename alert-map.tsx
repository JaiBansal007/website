"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Trash2 } from "lucide-react"

interface AlertMapProps {
  onLocationSelect: (location: { lat: number; lng: number; radius: number }) => void
}

export default function AlertMap({ onLocationSelect }: AlertMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [circle, setCircle] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [radius, setRadius] = useState(1000) // Default radius in meters
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        // Import Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        if (mapRef.current && !map) {
          // Initialize map centered on US
          const newMap = L.map(mapRef.current).setView([39.8283, -98.5795], 4)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(newMap)

          // Add click handler to map
          newMap.on("click", (e: any) => {
            const { lat, lng } = e.latlng
            setSelectedLocation({ lat, lng })
            updateMarkerAndCircle(newMap, lat, lng, radius, L)
            onLocationSelect({ lat, lng, radius })
          })

          setMap(newMap)
        }
      }
    }

    initMap()

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Update marker and circle when radius changes
  useEffect(() => {
    if (map && selectedLocation) {
      const updateMap = async () => {
        const L = (await import("leaflet")).default
        updateMarkerAndCircle(map, selectedLocation.lat, selectedLocation.lng, radius, L)
        onLocationSelect({ ...selectedLocation, radius })
      }
      updateMap()
    }
  }, [radius, map, selectedLocation])

  const updateMarkerAndCircle = async (map: any, lat: number, lng: number, radius: number, L: any) => {
    // Remove existing marker and circle
    if (marker) {
      map.removeLayer(marker)
    }
    if (circle) {
      map.removeLayer(circle)
    }

    // Create custom icon
    const customIcon = L.divIcon({
      className: "custom-alert-marker",
      html: `
        <div style="
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          position: relative;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    // Add new marker
    const newMarker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map)

    // Add drag event to update circle and location
    newMarker.on("dragend", (e: any) => {
      const position = newMarker.getLatLng()
      if (circle) {
        circle.setLatLng(position)
      }
      setSelectedLocation({ lat: position.lat, lng: position.lng })
      onLocationSelect({ lat: position.lat, lng: position.lng, radius })
    })

    setMarker(newMarker)

    // Add new circle
    const newCircle = L.circle([lat, lng], {
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.2,
      radius: radius,
    }).addTo(map)
    setCircle(newCircle)

    // Center map on the new marker
    map.setView([lat, lng], map.getZoom())
  }

  const handleSearch = async () => {
    if (!searchQuery || !map) return

    try {
      // Use Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const latitude = Number.parseFloat(lat)
        const longitude = Number.parseFloat(lon)

        setSelectedLocation({ lat: latitude, lng: longitude })

        const L = (await import("leaflet")).default
        updateMarkerAndCircle(map, latitude, longitude, radius, L)
        onLocationSelect({ lat: latitude, lng: longitude, radius })

        map.setView([latitude, longitude], 13)
      } else {
        alert("Location not found. Please try a different search term.")
      }
    } catch (error) {
      console.error("Error searching for location:", error)
      alert("Error searching for location. Please try again.")
    }
  }

  const clearSelection = () => {
    if (map) {
      if (marker) map.removeLayer(marker)
      if (circle) map.removeLayer(circle)
      setMarker(null)
      setCircle(null)
      setSelectedLocation(null)
      onLocationSelect({ lat: 0, lng: 0, radius: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button onClick={clearSelection} variant="outline" className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <div ref={mapRef} className="h-[400px] w-full rounded-lg border" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="radius">Alert Radius: {(radius / 1000).toFixed(1)} km</Label>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {selectedLocation
              ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
              : "No location selected"}
          </div>
        </div>
        <Slider
          id="radius"
          min={100}
          max={50000}
          step={100}
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
          disabled={!selectedLocation}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100m</span>
          <span>10km</span>
          <span>25km</span>
          <span>50km</span>
        </div>
      </div>
    </div>
  )
}
