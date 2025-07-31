"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Clock } from "lucide-react"

interface HourlyData {
  time: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
}

interface HourlyForecastProps {
  hourlyData: HourlyData[]
}

export default function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  const { theme } = useTheme()

  if (!hourlyData || hourlyData.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-white" />
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          24-Hour Forecast
        </h3>
      </div>

      <div
        className={`backdrop-blur-md border rounded-2xl p-4 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="flex overflow-x-auto gap-4 pb-2">
          {hourlyData.slice(0, 12).map((hour, index) => (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`flex-shrink-0 text-center p-3 rounded-xl transition-all duration-300 min-w-[80px] ${
                theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <div className="text-white/70 text-xs font-medium mb-2">
                {new Date(hour.time).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                })}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                alt={hour.condition}
                className="w-8 h-8 mx-auto mb-2"
              />
              <div className="text-white font-bold text-sm">{Math.round(hour.temperature)}°</div>
              <div className="text-white/60 text-xs mt-1">Feels {Math.round(hour.feelsLike)}°</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
