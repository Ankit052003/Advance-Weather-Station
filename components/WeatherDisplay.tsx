"use client"

import { motion } from "framer-motion"
import { Thermometer, Droplets, Wind, Eye } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
  country: string
}

interface WeatherDisplayProps {
  weatherData: WeatherData
}

export default function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="backdrop-blur-md border rounded-3xl p-8 mb-8 max-w-4xl mx-auto transition-all duration-500 hover:scale-[1.02] bg-black/30 border-white/20 hover:bg-black/40 shadow-2xl"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Main Weather Info */}
        <div className="text-center lg:text-left">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            style={{
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          >
            {weatherData.location}, {weatherData.country}
          </motion.h2>

          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start mb-4">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
              alt={weatherData.condition}
              className="w-24 h-24 drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))",
              }}
            />
            <div className="ml-4">
              <motion.div
                className="text-6xl md:text-7xl font-bold text-white"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  textShadow: "0 6px 12px rgba(0, 0, 0, 0.6)",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))",
                }}
              >
                {Math.round(weatherData.temperature)}°
              </motion.div>
              <div
                className="text-xl text-white/90 capitalize font-medium"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {weatherData.description}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weather Details */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          {[
            {
              icon: Thermometer,
              value: `${Math.round(weatherData.feelsLike)}°`,
              label: "Feels like",
              color: "from-orange-400 to-red-500",
            },
            {
              icon: Droplets,
              value: `${weatherData.humidity}%`,
              label: "Humidity",
              color: "from-blue-400 to-cyan-500",
            },
            {
              icon: Wind,
              value: Math.round(weatherData.windSpeed),
              label: "km/h",
              color: "from-green-400 to-teal-500",
            },
            { icon: Eye, value: "Good", label: "Visibility", color: "from-purple-400 to-pink-500" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-sm rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 bg-white/10 hover:bg-white/15 border border-white/15 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <motion.div
                className={`w-8 h-8 mx-auto mb-2 p-1 rounded-full bg-gradient-to-r ${item.color}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <item.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div
                className="text-2xl font-bold text-white"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {item.value}
              </div>
              <div
                className="text-sm text-white/80 font-medium"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
