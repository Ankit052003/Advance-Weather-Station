"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Radio, MapPin, Thermometer, Droplets, Wind, Activity, Wifi, RefreshCw } from "lucide-react"

interface WeatherStation {
  id: string
  name: string
  lat: number
  lon: number
  distance: number
  temperature?: number
  humidity?: number
  windSpeed?: number
  pressure?: number
  lastUpdate?: string
  accuracy: "high" | "medium" | "low"
  type: "official" | "community" | "airport" | "marine"
}

interface NearbyStationsProps {
  currentLat: number
  currentLon: number
  onStationSelect: (lat: number, lon: number, stationName: string) => void
}

export default function NearbyStations({ currentLat, currentLon, onStationSelect }: NearbyStationsProps) {
  const [stations, setStations] = useState<WeatherStation[]>([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"distance" | "accuracy" | "updated">("distance")
  const { theme } = useTheme()

  useEffect(() => {
    if (currentLat && currentLon) {
      fetchNearbyStations()
    }
  }, [currentLat, currentLon])

  const fetchNearbyStations = async () => {
    setLoading(true)
    try {
      // Simulate nearby weather stations with more realistic data
      const mockStations = generateEnhancedMockStations(currentLat, currentLon)
      setStations(mockStations)
    } catch (error) {
      console.error("Error fetching nearby stations:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateEnhancedMockStations = (lat: number, lon: number): WeatherStation[] => {
    const stations: WeatherStation[] = []
    const stationTypes = [
      { name: "Central Weather Station", type: "official" as const, accuracy: "high" as const },
      { name: "International Airport", type: "airport" as const, accuracy: "high" as const },
      { name: "University Observatory", type: "official" as const, accuracy: "high" as const },
      { name: "Harbor Weather Station", type: "marine" as const, accuracy: "medium" as const },
      { name: "Community Weather Hub", type: "community" as const, accuracy: "medium" as const },
      { name: "Industrial Monitor", type: "community" as const, accuracy: "low" as const },
      { name: "Agricultural Station", type: "official" as const, accuracy: "medium" as const },
      { name: "Mountain Observatory", type: "official" as const, accuracy: "high" as const },
    ]

    for (let i = 0; i < 8; i++) {
      // Generate stations within ~100km radius
      const offsetLat = (Math.random() - 0.5) * 1.0 // ~110km at equator
      const offsetLon = (Math.random() - 0.5) * 1.0
      const stationLat = lat + offsetLat
      const stationLon = lon + offsetLon
      const distance = calculateDistance(lat, lon, stationLat, stationLon)

      const stationType = stationTypes[i]
      const baseTemp = 15 + Math.random() * 20 // 15-35°C
      const tempVariation = stationType.accuracy === "high" ? 2 : stationType.accuracy === "medium" ? 5 : 8

      stations.push({
        id: `station-${i}`,
        name: stationType.name,
        lat: stationLat,
        lon: stationLon,
        distance: Math.round(distance),
        temperature: Math.round(baseTemp + (Math.random() - 0.5) * tempVariation),
        humidity: Math.round(30 + Math.random() * 50), // 30-80%
        windSpeed: Math.round(Math.random() * 25), // 0-25 km/h
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
        accuracy: stationType.accuracy,
        type: stationType.type,
      })
    }

    return stations.sort((a, b) => a.distance - b.distance)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const formatLastUpdate = (timestamp: string) => {
    const now = new Date()
    const updateTime = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h ago`
  }

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case "high":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "official":
        return "🏛️"
      case "airport":
        return "✈️"
      case "marine":
        return "⚓"
      case "community":
        return "🏘️"
      default:
        return "📡"
    }
  }

  const sortedStations = [...stations].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance
      case "accuracy":
        const accuracyOrder = { high: 3, medium: 2, low: 1 }
        return accuracyOrder[b.accuracy] - accuracyOrder[a.accuracy]
      case "updated":
        return new Date(b.lastUpdate!).getTime() - new Date(a.lastUpdate!).getTime()
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-6 h-6 text-white animate-pulse" />
          <h3 className="text-xl md:text-2xl font-bold text-white">Finding Nearby Stations...</h3>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-6 h-6 text-white" />
          <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Nearby Weather Stations
          </h3>
          <div className="text-white/60 text-sm">({stations.length} found)</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 text-white text-sm px-3 py-1 rounded-lg border border-white/20"
          >
            <option value="distance">Sort by Distance</option>
            <option value="accuracy">Sort by Accuracy</option>
            <option value="updated">Sort by Updated</option>
          </select>
          <button
            onClick={fetchNearbyStations}
            className="text-white/70 hover:text-white text-sm transition-colors p-2"
            title="Refresh stations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`backdrop-blur-md border rounded-2xl p-4 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        {/* Station Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
          <div className="text-center">
            <div className="text-white font-bold text-lg">{stations.filter((s) => s.accuracy === "high").length}</div>
            <div className="text-green-400 text-xs">High Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">{stations.filter((s) => s.type === "official").length}</div>
            <div className="text-blue-400 text-xs">Official Stations</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">
              {Math.round(stations.reduce((sum, s) => sum + s.distance, 0) / stations.length)}km
            </div>
            <div className="text-yellow-400 text-xs">Avg Distance</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">
              {stations.filter((s) => new Date(s.lastUpdate!).getTime() > Date.now() - 1800000).length}
            </div>
            <div className="text-purple-400 text-xs">Recent Updates</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedStations.slice(0, isExpanded ? stations.length : 6).map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => {
                setSelectedStation(selectedStation === station.id ? null : station.id)
                onStationSelect(station.lat, station.lon, station.name)
              }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                selectedStation === station.id
                  ? theme === "dark"
                    ? "bg-blue-600/30 border-2 border-blue-500/50"
                    : "bg-blue-500/30 border-2 border-blue-400/50"
                  : theme === "dark"
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white/10 hover:bg-white/20 border border-white/20"
              }`}
            >
              {/* Station Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTypeIcon(station.type)}</span>
                    <h4 className="text-white font-semibold text-sm">{station.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-white/60">
                      <MapPin className="w-3 h-3" />
                      <span>{station.distance} km</span>
                    </div>
                    <div className={`flex items-center gap-1 ${getAccuracyColor(station.accuracy)}`}>
                      <Activity className="w-3 h-3" />
                      <span>{station.accuracy}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs">{formatLastUpdate(station.lastUpdate!)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Wifi className="w-3 h-3 text-green-400" />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Weather Data */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-bold text-sm">{station.temperature}°</div>
                  <div className="text-white/60 text-xs">Temp</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold text-sm">{station.humidity}%</div>
                  <div className="text-white/60 text-xs">Humidity</div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedStation === station.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Wind className="w-3 h-3 text-green-400" />
                        <span className="text-white/80">{station.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-purple-400" />
                        <span className="text-white/80">{station.pressure} hPa</span>
                      </div>
                      <div className="col-span-2 text-white/60 text-center mt-2">Click for detailed weather data</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection Indicator */}
              {selectedStation === station.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </div>

        {stations.length > 6 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/70 hover:text-white text-sm transition-colors px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              {isExpanded ? "Show Less" : `Show All ${stations.length} Stations`}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
