"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Heart, HeartOff } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface FavoriteButtonProps {
  cityName: string
  country: string
  lat?: number
  lon?: number
  onFavoriteChange?: (isFavorite: boolean) => void
}

export default function FavoriteButton({ cityName, country, lat, lon, onFavoriteChange }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { theme } = useTheme()

  const cityId = lat && lon ? `${lat}-${lon}` : `${cityName}-${country}`

  useEffect(() => {
    checkIfFavorite()
  }, [cityName, country, lat, lon])

  const checkIfFavorite = () => {
    try {
      const saved = localStorage.getItem("weatherApp_savedCities")
      if (saved) {
        const savedCities = JSON.parse(saved)
        const city = savedCities.find((c: any) => c.id === cityId)
        setIsFavorite(city?.isFavorite || false)
      }
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const toggleFavorite = async () => {
    setIsAnimating(true)

    try {
      const saved = localStorage.getItem("weatherApp_savedCities")
      const savedCities = saved ? JSON.parse(saved) : []

      const existingCityIndex = savedCities.findIndex((c: any) => c.id === cityId)

      if (existingCityIndex >= 0) {
        // Update existing city
        savedCities[existingCityIndex].isFavorite = !isFavorite
        savedCities[existingCityIndex].lastUpdated = new Date().toISOString()
      } else {
        // Add new city as favorite
        let coordinates = { lat, lon }

        // If no coordinates provided, try to geocode
        if (!lat || !lon) {
          coordinates = await geocodeCity(`${cityName}, ${country}`)
        }

        if (coordinates.lat && coordinates.lon) {
          const newCity = {
            id: `${coordinates.lat}-${coordinates.lon}`,
            name: cityName,
            country: country,
            lat: coordinates.lat,
            lon: coordinates.lon,
            isFavorite: true,
            lastUpdated: new Date().toISOString(),
          }
          savedCities.unshift(newCity)
        }
      }

      localStorage.setItem("weatherApp_savedCities", JSON.stringify(savedCities))
      setIsFavorite(!isFavorite)
      onFavoriteChange?.(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }

    setTimeout(() => setIsAnimating(false), 600)
  }

  const geocodeCity = async (cityName: string): Promise<{ lat?: number; lon?: number }> => {
    try {
      const API_KEY = "247592d65a75014f0e04cb815197dea4"
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon }
      }
    } catch (error) {
      console.error("Geocoding error:", error)
    }
    return {}
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      disabled={isAnimating}
      className={`fixed top-6 right-20 z-50 p-3 backdrop-blur-md border rounded-full text-white transition-all duration-300 shadow-lg ${
        theme === "dark"
          ? "bg-black/20 border-white/10 hover:bg-black/30"
          : "bg-white/10 border-white/20 hover:bg-white/20"
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <AnimatePresence mode="wait">
        {isFavorite ? (
          <motion.div
            key="favorited"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </motion.div>
        ) : (
          <motion.div
            key="not-favorited"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.3 }}
          >
            <HeartOff className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated hearts on favorite */}
      <AnimatePresence>
        {isAnimating && isFavorite && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -Math.random() * 100],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
