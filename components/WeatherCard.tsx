"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

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

interface WeatherCardProps {
  forecast: ForecastData
  index?: number
}

export default function WeatherCard({ forecast, index = 0 }: WeatherCardProps) {
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
  }

  const gradients = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-red-600",
    "from-red-500 to-orange-600",
    "from-orange-500 to-yellow-600",
    "from-yellow-500 to-green-600",
    "from-green-500 to-blue-600",
  ]

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -8,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`backdrop-blur-md border rounded-2xl p-4 text-center cursor-pointer transition-all duration-500 relative overflow-hidden group ${
        theme === "dark"
          ? "bg-black/20 border-white/10 hover:bg-black/30"
          : "bg-white/10 border-white/20 hover:bg-white/20"
      }`}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.2 }}
      />

      <div className="relative z-10">
        <motion.div
          className="text-white/80 font-medium mb-2"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {formatDate(forecast.date)}
        </motion.div>

        <motion.img
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ duration: 0.3 }}
          src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
          alt={forecast.condition}
          className="w-16 h-16 mx-auto mb-2 drop-shadow-lg"
        />

        <motion.div
          className="text-white font-bold text-lg mb-1"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(forecast.temperature.max)}°
        </motion.div>

        <div className="text-white/60 text-sm mb-2">{Math.round(forecast.temperature.min)}°</div>

        <div className="text-white/70 text-xs capitalize font-medium">{forecast.condition}</div>

        <motion.div
          className="text-white/50 text-xs mt-1"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          {forecast.humidity}% humidity
        </motion.div>
      </div>
    </motion.div>
  )
}
