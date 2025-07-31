"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { MapPin, Plus, X, Navigation, Wifi, Star, StarOff, Clock, Trash2, Edit3 } from "lucide-react"

interface SavedCity {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  isFavorite: boolean
  lastUpdated: string
  temperature?: number
  condition?: string
  icon?: string
}

interface LocationManagerProps {
  onCitySelect: (lat: number, lon: number, cityName: string) => void
  currentLocation?: string
  currentWeatherData?: any
}

export default function LocationManager({ onCitySelect, currentLocation, currentWeatherData }: LocationManagerProps) {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [editingCity, setEditingCity] = useState<string | null>(null)
  const [newCityName, setNewCityName] = useState("")
  const { theme } = useTheme()

  // Load saved cities from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("weatherApp_savedCities")
    if (saved) {
      try {
        setSavedCities(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved cities:", error)
      }
    }
  }, [])

  // Save cities to localStorage whenever savedCities changes
  useEffect(() => {
    localStorage.setItem("weatherApp_savedCities", JSON.stringify(savedCities))
  }, [savedCities])

  // Update current city weather data
  useEffect(() => {
    if (currentWeatherData && currentLocation) {
      updateCityWeatherData(currentLocation, currentWeatherData)
    }
  }, [currentWeatherData, currentLocation])

  const updateCityWeatherData = (cityName: string, weatherData: any) => {
    setSavedCities((prev) =>
      prev.map((city) =>
        city.name === cityName.split(",")[0]
          ? {
              ...city,
              temperature: weatherData.temperature,
              condition: weatherData.condition,
              icon: weatherData.icon,
              lastUpdated: new Date().toISOString(),
            }
          : city,
      ),
    )
  }

  const addCurrentCity = async (cityName: string, lat?: number, lon?: number) => {
    if (!cityName) return

    // If no coordinates provided, try to geocode the city name
    let coordinates = { lat, lon }
    if (!lat || !lon) {
      coordinates = await geocodeCity(cityName)
    }

    if (!coordinates.lat || !coordinates.lon) {
      console.error("Could not get coordinates for city:", cityName)
      return
    }

    const cityId = `${coordinates.lat}-${coordinates.lon}`
    const existingCity = savedCities.find((city) => city.id === cityId)

    if (existingCity) {
      // Update existing city
      setSavedCities((prev) =>
        prev.map((city) =>
          city.id === cityId
            ? {
                ...city,
                lastUpdated: new Date().toISOString(),
                temperature: currentWeatherData?.temperature,
                condition: currentWeatherData?.condition,
                icon: currentWeatherData?.icon,
              }
            : city,
        ),
      )
    } else {
      // Add new city
      const newCity: SavedCity = {
        id: cityId,
        name: cityName.split(",")[0], // Remove country from name
        country: cityName.includes(",") ? cityName.split(",")[1]?.trim() || "" : "",
        lat: coordinates.lat,
        lon: coordinates.lon,
        isFavorite: false,
        lastUpdated: new Date().toISOString(),
        temperature: currentWeatherData?.temperature,
        condition: currentWeatherData?.condition,
        icon: currentWeatherData?.icon,
      }

      setSavedCities((prev) => [newCity, ...prev.slice(0, 9)]) // Keep max 10 cities
    }
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

  const removeCity = (cityId: string) => {
    setSavedCities((prev) => prev.filter((city) => city.id !== cityId))
  }

  const toggleFavorite = (cityId: string) => {
    setSavedCities((prev) =>
      prev.map((city) => (city.id === cityId ? { ...city, isFavorite: !city.isFavorite } : city)),
    )
  }

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onCitySelect(latitude, longitude, "Current Location")
          setIsDetectingLocation(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsDetectingLocation(false)
          alert("Unable to detect your location. Please check your browser permissions.")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setIsDetectingLocation(false)
      alert("Geolocation is not supported by this browser.")
    }
  }

  const selectCity = (city: SavedCity) => {
    onCitySelect(city.lat, city.lon, `${city.name}, ${city.country}`)
    setIsOpen(false)
  }

  const startEditing = (cityId: string, currentName: string) => {
    setEditingCity(cityId)
    setNewCityName(currentName)
  }

  const saveEdit = (cityId: string) => {
    if (newCityName.trim()) {
      setSavedCities((prev) => prev.map((city) => (city.id === cityId ? { ...city, name: newCityName.trim() } : city)))
    }
    setEditingCity(null)
    setNewCityName("")
  }

  const cancelEdit = () => {
    setEditingCity(null)
    setNewCityName("")
  }

  const clearAllCities = () => {
    if (confirm("Are you sure you want to remove all saved cities?")) {
      setSavedCities([])
    }
  }

  // Sort cities: favorites first, then by last updated
  const sortedCities = [...savedCities].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  })

  const formatTemperature = (temp?: number) => {
    return temp ? `${Math.round(temp)}°` : "--°"
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
    <div className="relative">
      {/* Location Manager Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 left-6 z-50 p-3 backdrop-blur-md border rounded-full text-white transition-all duration-300 shadow-lg ${
          theme === "dark"
            ? "bg-black/20 border-white/10 hover:bg-black/30"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }`}
        title={`Manage Cities (${savedCities.length} saved)`}
      >
        <div className="relative">
          <MapPin className="w-5 h-5" />
          {savedCities.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {savedCities.length}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Location Manager Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-20 left-6 z-40 w-96 max-h-[80vh] overflow-hidden backdrop-blur-md border rounded-2xl transition-all duration-300 ${
              theme === "dark" ? "bg-black/30 border-white/10" : "bg-white/20 border-white/30"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg">My Locations</h3>
                  <div className="text-white/60 text-sm">({savedCities.length}/10)</div>
                </div>
                <div className="flex items-center gap-2">
                  {savedCities.length > 0 && (
                    <button
                      onClick={clearAllCities}
                      className="text-white/60 hover:text-red-400 transition-colors p-1"
                      title="Clear all cities"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Current Location Detection */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={detectCurrentLocation}
                disabled={isDetectingLocation}
                className={`w-full p-3 rounded-xl mb-4 flex items-center gap-3 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30"
                    : "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30"
                }`}
              >
                <motion.div
                  animate={isDetectingLocation ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isDetectingLocation ? Number.POSITIVE_INFINITY : 0 }}
                >
                  <Navigation className="w-5 h-5 text-blue-400" />
                </motion.div>
                <div className="text-left flex-1">
                  <div className="text-white font-medium">
                    {isDetectingLocation ? "Detecting..." : "Use Current Location"}
                  </div>
                  <div className="text-white/60 text-sm">Auto-detect your position</div>
                </div>
                {isDetectingLocation && (
                  <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                )}
              </motion.button>

              {/* Add Current City Button */}
              {currentLocation && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addCurrentCity(currentLocation)}
                  className={`w-full p-3 rounded-xl mb-4 flex items-center gap-3 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-green-600/20 hover:bg-green-600/30 border border-green-500/30"
                      : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/30"
                  }`}
                >
                  <Plus className="w-5 h-5 text-green-400" />
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">Save Current City</div>
                    <div className="text-white/60 text-sm truncate">{currentLocation}</div>
                  </div>
                  {currentWeatherData && (
                    <div className="text-right">
                      <div className="text-white font-bold">{formatTemperature(currentWeatherData.temperature)}</div>
                      {currentWeatherData.icon && (
                        <img
                          src={`https://openweathermap.org/img/wn/${currentWeatherData.icon}.png`}
                          alt="weather"
                          className="w-6 h-6"
                        />
                      )}
                    </div>
                  )}
                </motion.button>
              )}

              {/* Saved Cities List */}
              <div className="max-h-80 overflow-y-auto">
                {sortedCities.length === 0 ? (
                  <div className="text-center py-8">
                    <Wifi className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">No saved cities yet</p>
                    <p className="text-white/40 text-xs">Search for cities to save them</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-white/60 text-xs mb-2 px-2">
                      <span>City</span>
                      <span>Weather</span>
                    </div>
                    {sortedCities.map((city) => (
                      <motion.div
                        key={city.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                          theme === "dark"
                            ? "bg-white/5 hover:bg-white/10 border border-white/10"
                            : "bg-white/10 hover:bg-white/20 border border-white/20"
                        }`}
                        onClick={() => !editingCity && selectCity(city)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {city.isFavorite && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                              )}
                              {editingCity === city.id ? (
                                <input
                                  type="text"
                                  value={newCityName}
                                  onChange={(e) => setNewCityName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit(city.id)
                                    if (e.key === "Escape") cancelEdit()
                                  }}
                                  className="bg-white/20 text-white px-2 py-1 rounded text-sm flex-1 min-w-0"
                                  autoFocus
                                />
                              ) : (
                                <span className="text-white font-medium truncate">{city.name}</span>
                              )}
                            </div>
                            {city.country && !editingCity && (
                              <div className="text-white/60 text-sm truncate">{city.country}</div>
                            )}
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>{formatLastUpdated(city.lastUpdated)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-3">
                            {/* Weather Info */}
                            {city.temperature && !editingCity && (
                              <div className="text-right">
                                <div className="text-white font-bold text-lg">
                                  {formatTemperature(city.temperature)}
                                </div>
                                {city.icon && (
                                  <img
                                    src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                                    alt={city.condition}
                                    className="w-8 h-8 mx-auto"
                                  />
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div
                              className={`flex flex-col gap-1 transition-opacity ${
                                editingCity === city.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              {editingCity === city.id ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      saveEdit(city.id)
                                    }}
                                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                    title="Save"
                                  >
                                    <X className="w-3 h-3 rotate-45" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      cancelEdit()
                                    }}
                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(city.id)
                                    }}
                                    className="p-1 text-white/60 hover:text-yellow-400 transition-colors"
                                    title={city.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    {city.isFavorite ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      startEditing(city.id, city.name)
                                    }}
                                    className="p-1 text-white/60 hover:text-blue-400 transition-colors"
                                    title="Edit name"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeCity(city.id)
                                    }}
                                    className="p-1 text-white/60 hover:text-red-400 transition-colors"
                                    title="Remove city"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {savedCities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-white font-bold text-lg">{savedCities.length}</div>
                      <div className="text-white/60 text-xs">Total Cities</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {savedCities.filter((c) => c.isFavorite).length}
                      </div>
                      <div className="text-white/60 text-xs">Favorites</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {savedCities.filter((c) => c.temperature).length}
                      </div>
                      <div className="text-white/60 text-xs">With Data</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
