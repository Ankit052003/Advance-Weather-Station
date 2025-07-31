"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Layers, Thermometer, Droplets, Wind, Eye, RotateCcw } from "lucide-react"

interface WeatherMapProps {
  lat?: number
  lon?: number
  cityName?: string
}

type MapLayer = "precipitation" | "temperature" | "wind" | "pressure" | "clouds"

export default function InteractiveWeatherMap({
  lat = 40.7128,
  lon = -74.006,
  cityName = "New York",
}: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("precipitation")
  const [isLoading, setIsLoading] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  const API_KEY = "247592d65a75014f0e04cb815197dea4"

  useEffect(() => {
    setMapKey((prev) => prev + 1)
  }, [lat, lon, activeLayer])

  const mapLayers = [
    {
      id: "precipitation" as MapLayer,
      name: "Precipitation",
      icon: Droplets,
      color: "from-blue-500 to-cyan-500",
      description: "Rain and snow intensity",
    },
    {
      id: "temperature" as MapLayer,
      name: "Temperature",
      icon: Thermometer,
      color: "from-red-500 to-orange-500",
      description: "Temperature distribution",
    },
    {
      id: "wind" as MapLayer,
      name: "Wind Speed",
      icon: Wind,
      color: "from-green-500 to-teal-500",
      description: "Wind patterns and speed",
    },
    {
      id: "pressure" as MapLayer,
      name: "Pressure",
      icon: Eye,
      color: "from-purple-500 to-indigo-500",
      description: "Atmospheric pressure",
    },
    {
      id: "clouds" as MapLayer,
      name: "Cloud Cover",
      icon: Layers,
      color: "from-gray-500 to-slate-500",
      description: "Cloud coverage",
    },
  ]

  const getMapUrl = () => {
    const zoom = 6
    const layerMap = {
      precipitation: "precipitation_new",
      temperature: "temp_new",
      wind: "wind_new",
      pressure: "pressure_new",
      clouds: "clouds_new",
    }

    return `https://tile.openweathermap.org/map/${layerMap[activeLayer]}/${zoom}/${Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))}/${Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom))}.png?appid=${API_KEY}`
  }

  const refreshMap = () => {
    setIsLoading(true)
    setMapKey((prev) => prev + 1)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-white" />
          <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Interactive Weather Map
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshMap}
          disabled={isLoading}
          className="p-2 rounded-lg transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      <div className="backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-500 bg-black/20 border-white/10">
        {/* Layer Selection */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {mapLayers.map((layer) => (
              <motion.button
                key={layer.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeLayer === layer.id
                    ? `bg-gradient-to-r ${layer.color} text-white shadow-lg`
                    : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
              >
                <layer.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{layer.name}</span>
              </motion.button>
            ))}
          </div>

          <motion.p
            key={activeLayer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/70 text-sm mt-2"
          >
            {mapLayers.find((l) => l.id === activeLayer)?.description}
          </motion.p>
        </div>

        {/* Map Display */}
        <div className="relative h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeLayer}-${mapKey}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
                  />
                  <p className="text-white/70">Loading {mapLayers.find((l) => l.id === activeLayer)?.name} data...</p>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {/* Simulated Map Display */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
                    {/* Map Grid */}
                    <div className="absolute inset-0 opacity-20">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute border-white/10"
                          style={{
                            left: `${i * 12.5}%`,
                            top: 0,
                            bottom: 0,
                            borderLeft: "1px solid",
                          }}
                        />
                      ))}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute border-white/10"
                          style={{
                            top: `${i * 16.67}%`,
                            left: 0,
                            right: 0,
                            borderTop: "1px solid",
                          }}
                        />
                      ))}
                    </div>

                    {/* Weather Data Visualization */}
                    <div className="absolute inset-0 p-4">
                      {/* Center Point (Current Location) */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="w-4 h-4 bg-red-500 rounded-full shadow-lg"
                        />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium whitespace-nowrap">
                          {cityName}
                        </div>
                      </motion.div>

                      {/* Weather Pattern Visualization */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className={`absolute w-8 h-8 rounded-full bg-gradient-to-r ${
                            mapLayers.find((l) => l.id === activeLayer)?.color
                          } opacity-60`}
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            transform: `scale(${0.5 + Math.random() * 0.8})`,
                          }}
                        />
                      ))}

                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3">
                        <div className="text-white text-xs font-medium mb-2">
                          {mapLayers.find((l) => l.id === activeLayer)?.name} Intensity
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70 text-xs">Low</span>
                          <div
                            className={`w-16 h-2 rounded-full bg-gradient-to-r ${
                              mapLayers.find((l) => l.id === activeLayer)?.color
                            }`}
                          />
                          <span className="text-white/70 text-xs">High</span>
                        </div>
                      </div>

                      {/* Coordinates */}
                      <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2">
                        <div className="text-white/70 text-xs">
                          {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Map Controls */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/70">
              Showing {mapLayers.find((l) => l.id === activeLayer)?.name.toLowerCase()} data for {cityName}
            </div>
            <div className="text-white/50">Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
