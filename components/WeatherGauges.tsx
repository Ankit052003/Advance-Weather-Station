"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Gauge, Droplets, Wind, BarChart3 } from "lucide-react"

interface WeatherGaugesProps {
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
}

interface GaugeProps {
  value: number
  max: number
  min?: number
  label: string
  unit: string
  color: string
  icon: React.ComponentType<any>
  description: string
}

function CircularGauge({ value, max, min = 0, label, unit, color, icon: Icon, description }: GaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  const percentage = ((animatedValue - min) / (max - min)) * 100
  const strokeDasharray = 2 * Math.PI * 45 // circumference
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  const getValueColor = () => {
    if (percentage < 33) return "text-green-400"
    if (percentage < 66) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-white/5 hover:bg-white/10 border border-white/10"
          : "bg-white/10 hover:bg-white/20 border border-white/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-white font-semibold">{label}</h4>
          <p className="text-white/60 text-xs">{description}</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background Circle */}
          <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />

          {/* Progress Circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={`url(#gradient-${label.replace(/\s+/g, "-").toLowerCase()})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient
              id={`gradient-${label.replace(/\s+/g, "-").toLowerCase()}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={
                  color.includes("blue")
                    ? "#3b82f6"
                    : color.includes("green")
                      ? "#10b981"
                      : color.includes("purple")
                        ? "#8b5cf6"
                        : "#f59e0b"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  color.includes("blue")
                    ? "#1e40af"
                    : color.includes("green")
                      ? "#059669"
                      : color.includes("purple")
                        ? "#7c3aed"
                        : "#d97706"
                }
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`text-2xl font-bold ${getValueColor()}`}
          >
            {animatedValue.toFixed(0)}
          </motion.div>
          <div className="text-white/60 text-sm">{unit}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-white/60 text-xs mb-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function WeatherGauges({ humidity, windSpeed, pressure, visibility }: WeatherGaugesProps) {
  const { theme } = useTheme()

  const gauges = [
    {
      value: humidity,
      max: 100,
      min: 0,
      label: "Humidity",
      unit: "%",
      color: "from-blue-500 to-cyan-500",
      icon: Droplets,
      description: "Moisture in the air",
    },
    {
      value: windSpeed,
      max: 50,
      min: 0,
      label: "Wind Speed",
      unit: "km/h",
      color: "from-green-500 to-teal-500",
      icon: Wind,
      description: "Current wind velocity",
    },
    {
      value: pressure,
      max: 1050,
      min: 950,
      label: "Pressure",
      unit: "hPa",
      color: "from-purple-500 to-indigo-500",
      icon: BarChart3,
      description: "Atmospheric pressure",
    },
    {
      value: visibility,
      max: 20,
      min: 0,
      label: "Visibility",
      unit: "km",
      color: "from-orange-500 to-yellow-500",
      icon: Gauge,
      description: "Visual range distance",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="w-6 h-6 text-white" />
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Weather Metrics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gauges.map((gauge, index) => (
          <motion.div
            key={gauge.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
          >
            <CircularGauge {...gauge} />
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className={`mt-6 p-4 rounded-2xl backdrop-blur-md border transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-white/60 text-xs mb-1">Comfort Level</div>
            <div className="text-white font-bold">{humidity > 70 ? "High" : humidity > 40 ? "Moderate" : "Low"}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Wind Condition</div>
            <div className="text-white font-bold">
              {windSpeed > 25 ? "Strong" : windSpeed > 10 ? "Moderate" : "Light"}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Pressure Trend</div>
            <div className="text-white font-bold">{pressure > 1020 ? "High" : pressure > 1000 ? "Normal" : "Low"}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Visibility</div>
            <div className="text-white font-bold">
              {visibility > 15 ? "Excellent" : visibility > 10 ? "Good" : "Poor"}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
