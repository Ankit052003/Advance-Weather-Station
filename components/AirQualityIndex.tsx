"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Leaf, AlertCircle } from "lucide-react"

interface AirQualityProps {
  aqi: number
  pollutants?: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    co: number
  }
}

export default function AirQualityIndex({ aqi, pollutants }: AirQualityProps) {
  const { theme } = useTheme()

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { level: "Good", color: "from-green-500 to-emerald-600", textColor: "text-green-400" }
    if (aqi <= 100) return { level: "Moderate", color: "from-yellow-500 to-orange-500", textColor: "text-yellow-400" }
    if (aqi <= 150)
      return { level: "Unhealthy for Sensitive", color: "from-orange-500 to-red-500", textColor: "text-orange-400" }
    if (aqi <= 200) return { level: "Unhealthy", color: "from-red-500 to-red-700", textColor: "text-red-400" }
    if (aqi <= 300)
      return { level: "Very Unhealthy", color: "from-purple-500 to-purple-700", textColor: "text-purple-400" }
    return { level: "Hazardous", color: "from-red-800 to-black", textColor: "text-red-500" }
  }

  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) return "Air quality is good. Perfect for outdoor activities!"
    if (aqi <= 100) return "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion."
    if (aqi <= 150)
      return "Sensitive groups should reduce outdoor activities. Others should limit prolonged outdoor exertion."
    if (aqi <= 200) return "Everyone should limit outdoor activities. Wear a mask when outside."
    if (aqi <= 300) return "Avoid outdoor activities. Keep windows closed and use air purifiers."
    return "Emergency conditions. Avoid all outdoor activities. Stay indoors with air purifiers."
  }

  const aqiInfo = getAQILevel(aqi)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-6 h-6 text-white" />
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
          Air Quality Index
        </h3>
      </div>

      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AQI Display */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <motion.div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${aqiInfo.color} flex items-center justify-center`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-2xl font-bold text-white">{aqi}</span>
              </motion.div>
              <div>
                <div className={`text-xl font-bold ${aqiInfo.textColor}`}>{aqiInfo.level}</div>
                <div className="text-white/70 text-sm">Air Quality Index</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-4 bg-white/5 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">{getHealthAdvice(aqi)}</p>
            </div>
          </div>

          {/* Pollutants Breakdown */}
          {pollutants && (
            <div>
              <h4 className="text-white font-semibold mb-4">Pollutant Levels (μg/m³)</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "PM2.5", value: pollutants.pm25, max: 35 },
                  { name: "PM10", value: pollutants.pm10, max: 150 },
                  { name: "Ozone", value: pollutants.o3, max: 100 },
                  { name: "NO₂", value: pollutants.no2, max: 40 },
                ].map((pollutant) => (
                  <div key={pollutant.name} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm font-medium">{pollutant.name}</span>
                      <span className="text-white font-semibold">{pollutant.value.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          pollutant.value > pollutant.max ? "from-red-500 to-red-600" : "from-green-500 to-blue-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
