"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"
import WeatherDisplay from "@/components/WeatherDisplay"
import HourlyForecast from "@/components/HourlyForecast"
import WeatherForecast from "@/components/WeatherForecast"
import WeatherAlerts from "@/components/WeatherAlerts"
import AirQualityIndex from "@/components/AirQualityIndex"
import UVIndex from "@/components/UVIndex"
import FavoritesPanel from "@/components/FavoritesPanel"
import WeatherRecommendations from "@/components/WeatherRecommendations"
import ActivitySuggestions from "@/components/ActivitySuggestions"
import AIForecastAccuracy from "@/components/AIForecastAccuracy"
import VoiceAssistant from "@/components/VoiceAssistant"
import { getWeatherData, getCurrentLocation, fetchForecastData } from "@/utils/weatherApi"
import { getBackgroundImage } from "@/utils/backgroundManager"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
  feelsLike: number
  cloudCover: number
  icon: string
  country: string
  airQuality: {
    aqi: number
    pollutants: {
      pm25: number
      pm10: number
      o3: number
      no2: number
      co: number
    }
  }
  sunTimes: {
    sunrise: string
    sunset: string
  }
}

interface ForecastData {
  hourly: Array<{
    time: string
    temperature: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
    feelsLike: number
  }>
  daily: Array<{
    date: string
    temperature: {
      min: number
      max: number
    }
    condition: string
    icon: string
    humidity: number
  }>
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>("")

  const handleSearch = async (location: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(location)
      setWeatherData(data)

      // Fetch forecast data
      const forecast = await fetchForecastData(`q=${encodeURIComponent(location)}`)
      setForecastData(forecast)

      const bgImage = getBackgroundImage(data.condition, data.description)
      setBackgroundImage(bgImage)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationUpdate = async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(`${lat},${lon}`)
      setWeatherData(data)

      // Fetch forecast data
      const forecast = await fetchForecastData(`lat=${lat}&lon=${lon}`)
      setForecastData(forecast)

      const bgImage = getBackgroundImage(data.condition, data.description)
      setBackgroundImage(bgImage)
    } catch (err) {
      setError("Failed to fetch weather data for your location.")
      console.error("Location weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = async (lat: number, lon: number, cityName: string) => {
    await handleLocationUpdate(lat, lon)
  }

  const handleVoiceLocationRequest = async (location: string) => {
    await handleSearch(location)
  }

  useEffect(() => {
    const initializeWeather = async () => {
      try {
        const location = await getCurrentLocation()
        await handleSearch(location)
      } catch (err) {
        await handleSearch("New York")
      }
    }
    initializeWeather()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Mode Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/30" />

        {/* Weather-based background image with enhanced overlay */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-black/60 via-slate-900/50 to-blue-900/40" />
          </div>
        )}

        {/* Subtle animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"
          style={{
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Header Section with Enhanced Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="backdrop-blur-md rounded-2xl p-6 mb-8 border transition-all duration-500 bg-gradient-to-r from-slate-800/40 via-blue-900/30 to-indigo-900/40 border-white/10">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl lg:text-5xl font-bold mb-2 text-white"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
              >
                Advanced Weather Station
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-white/80"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
              >
                Professional weather forecasting with AI-powered insights
              </motion.p>
            </div>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-8"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Favorites Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8"
          >
            <FavoritesPanel onCitySelect={handleCitySelect} />
          </motion.div>
        </motion.div>

        {/* Weather Content */}
        <div className="container mx-auto px-4 pb-8">
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-lg text-white">Loading weather data...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-md rounded-xl p-6 mb-8 border text-center bg-red-900/30 border-red-500/30 text-red-200"
            >
              <p className="text-lg font-medium">{error}</p>
            </motion.div>
          )}

          {weatherData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-8"
            >
              {/* Weather Alerts */}
              <WeatherAlerts
                weatherCondition={weatherData.condition}
                temperature={weatherData.temperature}
                uvIndex={weatherData.uvIndex}
                airQuality={weatherData.airQuality.aqi}
              />

              {/* Main Weather Display */}
              <WeatherDisplay weatherData={weatherData} />

              {/* Forecasts - Now stacked vertically */}
              <div className="space-y-8">
                {/* 24-Hour Forecast */}
                {forecastData?.hourly && (
                  <div className="w-full">
                    <HourlyForecast hourlyData={forecastData.hourly} />
                  </div>
                )}

                {/* 7-Day Forecast */}
                {forecastData?.daily && (
                  <div className="w-full">
                    <WeatherForecast forecastData={forecastData.daily} />
                  </div>
                )}
              </div>

              {/* Smart Features Section */}
              <div className="space-y-8">
                <WeatherRecommendations weatherData={weatherData} />
                <ActivitySuggestions weatherData={weatherData} />
                <AIForecastAccuracy weatherData={weatherData} />
              </div>

              {/* Additional Weather Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UVIndex
                  uvIndex={weatherData.uvIndex}
                  sunriseTime={weatherData.sunTimes.sunrise}
                  sunsetTime={weatherData.sunTimes.sunset}
                />
                <AirQualityIndex aqi={weatherData.airQuality.aqi} pollutants={weatherData.airQuality.pollutants} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Voice Assistant */}
        <VoiceAssistant weatherData={weatherData} onLocationRequest={handleVoiceLocationRequest} />
      </div>
    </div>
  )
}
