"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { AlertTriangle, Cloud, Sun, Wind, Droplets, X } from "lucide-react"
import { useState, useEffect } from "react"

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory"
  severity: "minor" | "moderate" | "severe" | "extreme"
  title: string
  description: string
  icon: any
  color: string
}

interface WeatherAlertsProps {
  weatherCondition: string
  temperature: number
  uvIndex?: number
  airQuality?: number
}

export default function WeatherAlerts({
  weatherCondition,
  temperature,
  uvIndex = 0,
  airQuality = 50,
}: WeatherAlertsProps) {
  const { theme } = useTheme()
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  useEffect(() => {
    const newAlerts: WeatherAlert[] = []

    // Temperature alerts
    if (temperature > 30) {
      newAlerts.push({
        id: "heat-warning",
        type: "warning",
        severity: temperature > 35 ? "severe" : "moderate",
        title: "Heat Wave Alert",
        description: `Temperature is ${Math.round(temperature)}°C. Stay hydrated and avoid prolonged sun exposure.`,
        icon: Sun,
        color: "from-orange-500 to-red-600",
      })
    }

    if (temperature < 0) {
      newAlerts.push({
        id: "cold-warning",
        type: "warning",
        severity: temperature < -10 ? "severe" : "moderate",
        title: "Extreme Cold Alert",
        description: `Temperature is ${Math.round(temperature)}°C. Dress warmly and limit outdoor exposure.`,
        icon: Wind,
        color: "from-blue-600 to-indigo-700",
      })
    }

    // Weather condition alerts
    if (weatherCondition === "Thunderstorm") {
      newAlerts.push({
        id: "storm-warning",
        type: "warning",
        severity: "severe",
        title: "Thunderstorm Warning",
        description: "Severe thunderstorms expected. Seek shelter and avoid outdoor activities.",
        icon: AlertTriangle,
        color: "from-purple-600 to-indigo-700",
      })
    }

    if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
      newAlerts.push({
        id: "rain-advisory",
        type: "advisory",
        severity: "minor",
        title: "Rain Advisory",
        description: "Rain expected. Carry an umbrella and drive carefully.",
        icon: Droplets,
        color: "from-blue-500 to-cyan-600",
      })
    }

    // UV Index alerts
    if (uvIndex > 7) {
      newAlerts.push({
        id: "uv-warning",
        type: "warning",
        severity: uvIndex > 10 ? "extreme" : "severe",
        title: "High UV Index Alert",
        description: `UV Index is ${uvIndex}. Use sunscreen SPF 30+, wear protective clothing, and seek shade.`,
        icon: Sun,
        color: "from-yellow-500 to-orange-600",
      })
    }

    // Air Quality alerts
    if (airQuality > 100) {
      newAlerts.push({
        id: "air-quality-warning",
        type: "warning",
        severity: airQuality > 150 ? "severe" : "moderate",
        title: "Poor Air Quality Alert",
        description: `AQI is ${airQuality}. Limit outdoor activities, especially for sensitive individuals.`,
        icon: Cloud,
        color: "from-gray-600 to-red-600",
      })
    }

    // Filter out dismissed alerts
    const filteredAlerts = newAlerts.filter((alert) => !dismissedAlerts.includes(alert.id))
    setAlerts(filteredAlerts)
  }, [weatherCondition, temperature, uvIndex, airQuality, dismissedAlerts])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId])
  }

  if (alerts.length === 0) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "border-red-500/50 bg-red-900/30"
      case "severe":
        return "border-orange-500/50 bg-orange-900/30"
      case "moderate":
        return "border-yellow-500/50 bg-yellow-900/30"
      default:
        return "border-blue-500/50 bg-blue-900/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mb-6"
    >
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md border rounded-2xl p-4 mb-3 transition-all duration-500 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className={`p-2 rounded-full bg-gradient-to-r ${alert.color}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <alert.icon className="w-5 h-5 text-white" />
              </motion.div>

              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-1">{alert.title}</h4>
                <p className="text-white/80 text-sm">{alert.description}</p>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
