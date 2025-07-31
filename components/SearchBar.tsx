"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Clock, Star, Globe } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
}

interface CitySuggestion {
  name: string
  country: string
  type: "popular" | "recent" | "search"
  icon?: React.ComponentType<any>
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Popular cities suggestions
  const popularCities: CitySuggestion[] = [
    { name: "New York", country: "United States", type: "popular", icon: Star },
    { name: "London", country: "United Kingdom", type: "popular", icon: Star },
    { name: "Tokyo", country: "Japan", type: "popular", icon: Star },
    { name: "Paris", country: "France", type: "popular", icon: Star },
    { name: "Sydney", country: "Australia", type: "popular", icon: Star },
    { name: "Dubai", country: "United Arab Emirates", type: "popular", icon: Star },
    { name: "Singapore", country: "Singapore", type: "popular", icon: Star },
    { name: "Los Angeles", country: "United States", type: "popular", icon: Star },
    { name: "Mumbai", country: "India", type: "popular", icon: Star },
    { name: "Berlin", country: "Germany", type: "popular", icon: Star },
    { name: "Toronto", country: "Canada", type: "popular", icon: Star },
    { name: "Moscow", country: "Russia", type: "popular", icon: Star },
    { name: "Beijing", country: "China", type: "popular", icon: Star },
    { name: "São Paulo", country: "Brazil", type: "popular", icon: Star },
    { name: "Cairo", country: "Egypt", type: "popular", icon: Star },
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weatherApp_recentSearches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  // Update suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show recent searches and popular cities when no search term
      const recentSuggestions: CitySuggestion[] = recentSearches.slice(0, 5).map((city) => ({
        name: city.split(",")[0],
        country: city.split(",")[1]?.trim() || "",
        type: "recent",
        icon: Clock,
      }))

      setSuggestions([...recentSuggestions, ...popularCities.slice(0, 10 - recentSuggestions.length)])
    } else {
      // Filter cities based on search term
      const filtered = popularCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.country.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 8)

      // Add search suggestion
      const searchSuggestion: CitySuggestion = {
        name: searchTerm,
        country: "Search for this location",
        type: "search",
        icon: Search,
      }

      setSuggestions([searchSuggestion, ...filtered])
    }
  }, [searchTerm, recentSearches])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim())
    }
  }

  const handleSearch = (city: string) => {
    // Add to recent searches
    const cityName = city.includes(",") ? city : city
    const updatedRecent = [cityName, ...recentSearches.filter((item) => item !== cityName)].slice(0, 10)
    setRecentSearches(updatedRecent)
    localStorage.setItem("weatherApp_recentSearches", JSON.stringify(updatedRecent))

    onSearch(city)
    setSearchTerm("")
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    const cityName =
      suggestion.country && suggestion.country !== "Search for this location"
        ? `${suggestion.name}, ${suggestion.country}`
        : suggestion.name
    handleSearch(cityName)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowSuggestions(true)
  }

  const getSuggestionIcon = (suggestion: CitySuggestion) => {
    const IconComponent = suggestion.icon || MapPin
    return <IconComponent className="w-4 h-4" />
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "recent":
        return "text-blue-400"
      case "popular":
        return "text-yellow-400"
      case "search":
        return "text-green-400"
      default:
        return "text-white/70"
    }
  }

  return (
    <motion.div
      ref={searchRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="max-w-md mx-auto mb-8 relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div className="relative" animate={{ scale: isFocused ? 1.02 : 1 }} transition={{ duration: 0.2 }}>
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            animate={{
              color: isFocused ? "#60a5fa" : "#ffffff99",
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <MapPin className="w-5 h-5" />
          </motion.div>

          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30"
            autoComplete="off"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20"
          >
            <Search className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md border rounded-2xl overflow-hidden z-50 bg-black/30 border-white/10 shadow-2xl"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="max-h-80 overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-white/70" />
                    <span className="text-sm font-medium text-white/80">
                      {searchTerm ? "Search Results" : "Popular Cities & Recent Searches"}
                    </span>
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={`${suggestion.name}-${suggestion.country}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <div
                        className={`${getSuggestionColor(suggestion.type)} group-hover:scale-110 transition-transform duration-200`}
                      >
                        {getSuggestionIcon(suggestion)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white group-hover:text-blue-200 transition-colors duration-200">
                          {suggestion.name}
                        </div>
                        {suggestion.country && suggestion.country !== "Search for this location" && (
                          <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-200">
                            {suggestion.country}
                          </div>
                        )}
                        {suggestion.country === "Search for this location" && (
                          <div className="text-sm text-green-400/80 group-hover:text-green-300 transition-colors duration-200">
                            {suggestion.country}
                          </div>
                        )}
                      </div>

                      {/* Type indicator */}
                      <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60 group-hover:bg-white/20 transition-all duration-200">
                        {suggestion.type === "recent" && "Recent"}
                        {suggestion.type === "popular" && "Popular"}
                        {suggestion.type === "search" && "Search"}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-white/10 bg-white/5">
                  <div className="text-xs text-white/50 text-center">
                    {searchTerm ? `${suggestions.length} results found` : "Type to search for more cities"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}
