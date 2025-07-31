"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Navigation, MapPin, Wifi, WifiOff, AlertCircle } from "lucide-react"

interface GeolocationStatusProps {
  onLocationUpdate: (lat: number, lon: number, accuracy: number) => void
}

export default function GeolocationStatus({ onLocationUpdate }: GeolocationStatusProps) {
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "unavailable">(
    "idle",
  )
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    checkGeolocationSupport()
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const checkGeolocationSupport = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable")
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable")
      return
    }

    setLocationStatus("requesting")

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocationStatus("granted")
        setAccuracy(accuracy)
        setLastUpdate(new Date())
        onLocationUpdate(latitude, longitude, accuracy)

        // Start watching position for updates
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords
            setAccuracy(accuracy)
            setLastUpdate(new Date())
            onLocationUpdate(latitude, longitude, accuracy)
          },
          (error) => {
            console.error("Geolocation watch error:", error)
          },
          options,
        )
        setWatchId(id)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setLocationStatus("denied")
      },
      options,
    )
  }

  const getStatusIcon = () => {
    switch (locationStatus) {
      case "requesting":
        return <Navigation className="w-4 h-4 animate-spin" />
      case "granted":
        return <MapPin className="w-4 h-4 text-green-400" />
      case "denied":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case "unavailable":
        return <WifiOff className="w-4 h-4 text-gray-400" />
      default:
        return <Wifi className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (locationStatus) {
      case "requesting":
        return "Detecting location..."
      case "granted":
        return `Location active (±${Math.round(accuracy || 0)}m)`
      case "denied":
        return "Location access denied"
      case "unavailable":
        return "Location not supported"
      default:
        return "Enable location services"
    }
  }

  const getStatusColor = () => {
    switch (locationStatus) {
      case "granted":
        return "text-green-400"
      case "denied":
        return "text-red-400"
      case "unavailable":
        return "text-gray-400"
      case "requesting":
        return "text-blue-400"
      default:
        return "text-white/70"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mb-6"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={locationStatus === "idle" || locationStatus === "denied" ? requestLocation : undefined}
        className={`backdrop-blur-md border rounded-2xl p-4 transition-all duration-500 ${
          locationStatus === "idle" || locationStatus === "denied" ? "cursor-pointer" : ""
        } ${
          theme === "dark"
            ? "bg-black/20 border-white/10 hover:bg-black/30"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={locationStatus === "requesting" ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: locationStatus === "requesting" ? Number.POSITIVE_INFINITY : 0 }}
            >
              {getStatusIcon()}
            </motion.div>
            <div>
              <div className={`font-medium ${getStatusColor()}`}>{getStatusText()}</div>
              {lastUpdate && (
                <div className="text-white/50 text-xs">Last updated: {lastUpdate.toLocaleTimeString()}</div>
              )}
            </div>
          </div>

          {locationStatus === "granted" && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white/60 text-xs">Accuracy</div>
                <div className="text-white font-medium">{accuracy ? `±${Math.round(accuracy)}m` : "Unknown"}</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}

          {(locationStatus === "idle" || locationStatus === "denied") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={requestLocation}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30"
              }`}
            >
              Enable Location
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
