"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import InteractiveWeatherMap from "@/components/InteractiveWeatherMap"

export default function WeatherMapPage() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lon: -74.006,
    cityName: "New York",
  })

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            cityName: "Current Location",
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
          // Keep default location
        },
      )
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Mode Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-teal-900/30" />

        {/* Subtle animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10"
          style={{
            backgroundSize: "400% 400%",
            animation: "gradient 20s ease infinite",
          }}
        />

        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 bg-white"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
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
          <div className="backdrop-blur-md rounded-2xl p-6 mb-8 border transition-all duration-500 bg-gradient-to-r from-slate-800/40 via-emerald-900/30 to-teal-900/40 border-white/10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-5xl font-bold mb-4 text-white"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Interactive Weather Map
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-white/80"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
            >
              Explore real-time weather patterns across the globe with interactive layers and detailed forecasts
            </motion.p>
          </div>
        </motion.div>

        {/* Map Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="container mx-auto px-4 pb-8"
        >
          <InteractiveWeatherMap
            lat={currentLocation.lat}
            lon={currentLocation.lon}
            cityName={currentLocation.cityName}
          />
        </motion.div>
      </div>
    </div>
  )
}
