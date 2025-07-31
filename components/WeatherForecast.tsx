"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import WeatherCard from "./WeatherCard"

interface ForecastData {
  date: string
  temperature: {
    min: number
    max: number
  }
  condition: string
  icon: string
  humidity: number
}

interface WeatherForecastProps {
  forecastData: ForecastData[]
}

export default function WeatherForecast({ forecastData }: WeatherForecastProps) {
  const { theme } = useTheme()

  if (!forecastData || forecastData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-6xl mx-auto text-center"
      >
        <div
          className={`backdrop-blur-md border rounded-3xl p-8 transition-all duration-500 ${
            theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
          }`}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            7-Day Forecast
          </h3>
          <p className="text-white/70">Forecast data temporarily unavailable</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="max-w-6xl mx-auto"
    >
      <motion.h3
        className="text-2xl md:text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        7-Day Forecast
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {forecastData.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * index,
              ease: "easeOut",
            }}
          >
            <WeatherCard forecast={day} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
