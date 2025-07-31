"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Heart, X, MapPin, Clock, Star } from "lucide-react"

interface SavedCity {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  isFavorite: boolean
  lastUpdated: string
}

interface FavoritesPanelProps {
  onCitySelect: (lat: number, lon: number, cityName: string) => void
}

export default function FavoritesPanel({ onCitySelect }: FavoritesPanelProps) {
  const [favorites, setFavorites] = useState<SavedCity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    loadFavorites()

    // Listen for storage changes to update favorites in real-time
    const handleStorageChange = () => {
      loadFavorites()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events when favorites are updated
    const handleFavoritesUpdate = () => {
      loadFavorites()
    }

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
    }
  }, [])

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem("weatherApp_savedCities")
      if (saved) {
        const savedCities = JSON.parse(saved)
        const favoriteCities = savedCities.filter((city: SavedCity) => city.isFavorite)
        setFavorites(
          favoriteCities.sort(
            (a: SavedCity, b: SavedCity) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
          ),
        )
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const removeFavorite = (cityId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    try {
      const saved = localStorage.getItem("weatherApp_savedCities")
      if (saved) {
        const savedCities = JSON.parse(saved)
        const updatedCities = savedCities.map((city: SavedCity) =>
          city.id === cityId ? { ...city, isFavorite: false } : city,
        )
        localStorage.setItem("weatherApp_savedCities", JSON.stringify(updatedCities))
        loadFavorites()

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent("favoritesUpdated"))
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const selectFavorite = (city: SavedCity) => {
    onCitySelect(city.lat, city.lon, `${city.name}, ${city.country}`)
    setIsOpen(false)
  }

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date()
    const updateTime = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <>
      {/* Favorites Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 right-6 z-50 p-3 backdrop-blur-md border rounded-full text-white transition-all duration-300 shadow-lg ${
          theme === "dark"
            ? "bg-black/20 border-white/10 hover:bg-black/30"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }`}
        title="View Favorites"
      >
        <div className="relative">
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          {favorites.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {favorites.length}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Favorites Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-36 right-6 z-40 w-80 max-h-96 overflow-hidden backdrop-blur-md border rounded-2xl transition-all duration-300 ${
              theme === "dark" ? "bg-black/30 border-white/10" : "bg-white/20 border-white/30"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  <h3 className="text-white font-bold text-lg">Favorite Cities</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60 text-sm mb-2">No favorite cities yet</p>
                    <p className="text-white/40 text-xs">
                      Search for a city and click the ❤️ button to add it to favorites
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((city, index) => (
                      <motion.div
                        key={city.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        onClick={() => selectFavorite(city)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-red-900/20 to-pink-900/20 hover:from-red-900/30 hover:to-pink-900/30 border border-red-500/20"
                            : "bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30"
                        }`}
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <h4 className="text-white font-semibold">{city.name}</h4>
                              </div>
                              {city.country && (
                                <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{city.country}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-white/50 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>Updated {formatLastUpdated(city.lastUpdated)}</span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => removeFavorite(city.id, e)}
                              className="p-2 text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove from favorites"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <div className="text-white/60 text-xs">Click to view weather details</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {favorites.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-xs text-center">
                    {favorites.length} favorite {favorites.length === 1 ? "city" : "cities"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
