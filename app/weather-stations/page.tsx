"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import NearbyStations from "@/components/NearbyStations"
import { fetchEnhancedWeatherData } from "@/utils/weatherApi"
import { getBackgroundForWeather, getGradientForWeather } from "@/utils/backgroundManager"
import Navbar from "@/components/Navbar"
import LocationManager from "@/components/LocationManager"

export default function WeatherStationsPage() {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [cityName, setCityName] = useState("New York")
  const [searchCity, setSearchCity] = useState("")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentCoords({ lat: latitude, lon: longitude })
          fetchWeatherData(latitude, longitude, "Current Location")
        },
        () => {
          // Default to New York if geolocation fails
          setCurrentCoords({ lat: 40.7128, lon: -74.006 })
          fetchWeatherData(40.7128, -74.006, "New York")
        },
      )
    } else {
      setCurrentCoords({ lat: 40.7128, lon: -74.006 })
      fetchWeatherData(40.7128, -74.006, "New York")
    }
  }

  const fetchWeatherData = async (lat: number, lon: number, name: string) => {
    setLoading(true)
    try {
      const weather = await fetchEnhancedWeatherData(`lat=${lat}&lon=${lon}`)
      setWeatherData(weather)
      setCityName(name)
    } catch (error) {
      console.error("Error fetching weather:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchCity.trim()) return

    setLoading(true)
    try {
      const weather = await fetchEnhancedWeatherData(`q=${searchCity}`)
      // Get coordinates from weather data if available
      const lat = 40.7128 // Default coordinates - in real app, get from geocoding
      const lon = -74.006
      setCurrentCoords({ lat, lon })
      setWeatherData(weather)
      setCityName(searchCity)
      setSearchCity("")
    } catch (error) {
      console.error("Error searching city:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStationSelect = (lat: number, lon: number, stationName: string) => {
    setCurrentCoords({ lat, lon })
    fetchWeatherData(lat, lon, stationName)
  }

  const backgroundConfig = weatherData
    ? {
        backgroundImage: getBackgroundForWeather(weatherData.condition, weatherData.description),
        gradient: getGradientForWeather(weatherData.condition, theme || "light", weatherData.description),
      }
    : {
        backgroundImage: "/images/cloudy_weather.jpg",
        gradient: theme === "dark" ? "from-slate-900/50 to-purple-900/40" : "from-blue-400/30 to-purple-500/20",
      }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Minimalist Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 via-cyan-900/20 to-blue-900/30"
              : "bg-gradient-to-br from-cyan-50 via-blue-50/50 to-sky-50/30"
          }`}
        />

        {/* Subtle animated gradient overlay */}
        <div
          className={`absolute inset-0 opacity-20 ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-sky-600/10"
              : "bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-sky-400/10"
          }`}
          style={{
            backgroundSize: "400% 400%",
            animation: "gradient 22s ease infinite",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className={`absolute inset-0 opacity-5 ${theme === "dark" ? "bg-white" : "bg-slate-900"}`}
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                             linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <div
            className={`backdrop-blur-md rounded-2xl p-6 mb-8 border transition-all duration-500 ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-800/40 via-cyan-900/30 to-blue-900/40 border-white/10"
                : "bg-gradient-to-r from-white/60 via-cyan-50/70 to-blue-50/60 border-white/30"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`text-4xl lg:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-800"}`}
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Weather Stations Network
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-lg ${theme === "dark" ? "text-white/80" : "text-slate-600"}`}
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
            >
              Manage your favorite locations and discover nearby weather monitoring stations
            </motion.p>
          </div>
        </motion.div>

        {/* Stations Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="container mx-auto px-4 pb-8 space-y-8"
        >
          <LocationManager />
          <NearbyStations
            currentLat={currentCoords?.lat}
            currentLon={currentCoords?.lon}
            onStationSelect={handleStationSelect}
          />
        </motion.div>
      </div>
    </div>
  )
}
