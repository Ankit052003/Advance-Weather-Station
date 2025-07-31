"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { TrendingUp, Thermometer, CloudRain } from "lucide-react"

interface TrendData {
  date: string
  temperature: number
  rainfall: number
  humidity: number
}

interface WeatherTrendsChartProps {
  cityName: string
}

export default function WeatherTrendsChart({ cityName }: WeatherTrendsChartProps) {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [activeMetric, setActiveMetric] = useState<"temperature" | "rainfall">("temperature")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d")
  const { theme } = useTheme()

  useEffect(() => {
    generateTrendData()
  }, [timeRange, cityName])

  const generateTrendData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data: TrendData[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Generate realistic weather trends
      const baseTemp = 20 + Math.sin((i / days) * Math.PI * 2) * 10
      const seasonalVariation = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 15
      const dailyVariation = Math.random() * 8 - 4

      data.push({
        date: date.toISOString().split("T")[0],
        temperature: Math.round(baseTemp + seasonalVariation + dailyVariation),
        rainfall: Math.random() * 20,
        humidity: 40 + Math.random() * 40,
      })
    }

    setTrendData(data)
  }

  const getMaxValue = (metric: "temperature" | "rainfall") => {
    return Math.max(...trendData.map((d) => d[metric]))
  }

  const getMinValue = (metric: "temperature" | "rainfall") => {
    return Math.min(...trendData.map((d) => d[metric]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return timeRange === "7d"
      ? date.toLocaleDateString("en-US", { weekday: "short" })
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getChartPath = (metric: "temperature" | "rainfall") => {
    const max = getMaxValue(metric)
    const min = getMinValue(metric)
    const range = max - min || 1
    const width = 100
    const height = 60

    const points = trendData.map((data, index) => {
      const x = (index / (trendData.length - 1)) * width
      const y = height - ((data[metric] - min) / range) * height
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  const getGradientId = (metric: "temperature" | "rainfall") => {
    return `gradient-${metric}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-white" />
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
          Weather Trends
        </h3>
      </div>

      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Metric Selection */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMetric("temperature")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeMetric === "temperature"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                  : theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/80"
                    : "bg-white/20 hover:bg-white/30 text-white/80"
              }`}
            >
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-medium">Temperature</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMetric("rainfall")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeMetric === "rainfall"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/80"
                    : "bg-white/20 hover:bg-white/30 text-white/80"
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span className="text-sm font-medium">Rainfall</span>
            </motion.button>
          </div>

          {/* Time Range Selection */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                  timeRange === range
                    ? "bg-white/20 text-white font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-64 mb-6">
          <motion.div
            key={`${activeMetric}-${timeRange}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <defs>
                <linearGradient id={getGradientId(activeMetric)} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={activeMetric === "temperature" ? "#f97316" : "#3b82f6"}
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor={activeMetric === "temperature" ? "#dc2626" : "#1e40af"}
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[...Array(5)].map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 15}
                  x2="100"
                  y2={i * 15}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Area Fill */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={`${getChartPath(activeMetric)} L 100,60 L 0,60 Z`}
                fill={`url(#${getGradientId(activeMetric)})`}
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={getChartPath(activeMetric)}
                fill="none"
                stroke={activeMetric === "temperature" ? "#f97316" : "#3b82f6"}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {trendData.map((data, index) => {
                const max = getMaxValue(activeMetric)
                const min = getMinValue(activeMetric)
                const range = max - min || 1
                const x = (index / (trendData.length - 1)) * 100
                const y = 60 - ((data[activeMetric] - min) / range) * 60

                return (
                  <motion.circle
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={activeMetric === "temperature" ? "#f97316" : "#3b82f6"}
                    className="cursor-pointer hover:r-2 transition-all duration-200"
                  />
                )
              })}
            </svg>
          </motion.div>

          {/* Y-axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-white/60 text-xs -ml-8">
            <span>
              {getMaxValue(activeMetric).toFixed(0)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </span>
            <span>
              {((getMaxValue(activeMetric) + getMinValue(activeMetric)) / 2).toFixed(0)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </span>
            <span>
              {getMinValue(activeMetric).toFixed(0)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </span>
          </div>
        </div>

        {/* X-axis Labels */}
        <div className="flex justify-between text-white/60 text-xs mb-4">
          {trendData
            .filter((_, i) => i % Math.ceil(trendData.length / 7) === 0)
            .map((data, index) => (
              <span key={index}>{formatDate(data.date)}</span>
            ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">Average</div>
            <div className="text-white font-bold">
              {(trendData.reduce((sum, d) => sum + d[activeMetric], 0) / trendData.length).toFixed(1)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">Maximum</div>
            <div className="text-white font-bold">
              {getMaxValue(activeMetric).toFixed(1)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">Minimum</div>
            <div className="text-white font-bold">
              {getMinValue(activeMetric).toFixed(1)}
              {activeMetric === "temperature" ? "°C" : "mm"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/60 text-xs mb-1">Trend</div>
            <div className="text-white font-bold flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Rising</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
