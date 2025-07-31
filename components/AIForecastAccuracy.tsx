"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Brain, Target, Zap, Activity, Thermometer, Droplets, Wind, Eye, Sun } from "lucide-react"

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
  pressure: number
  visibility: number
  cloudCover: number
  uvIndex: number
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

interface AIForecastAccuracyProps {
  weatherData: WeatherData
}

interface AIModel {
  id: string
  name: string
  type: string
  accuracy: number
  confidence: number
  isLearning: boolean
  specialization: string[]
  lastUpdated: string
  trend: "improving" | "stable" | "declining"
}

interface AccuracyMetric {
  name: string
  icon: any
  accuracy: number
  confidence: number
  trend: "up" | "down" | "stable"
}

export default function AIForecastAccuracy({ weatherData }: AIForecastAccuracyProps) {
  const [selectedModel, setSelectedModel] = useState("neural-weather")
  const [isLearning, setIsLearning] = useState(false)
  const { theme } = useTheme()

  // Simulate AI learning process
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLearning((prev) => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const aiModels: AIModel[] = [
    {
      id: "neural-weather",
      name: "Neural Weather Network",
      type: "Deep Learning",
      accuracy: 94.2,
      confidence: 96.8,
      isLearning: isLearning,
      specialization: ["Temperature", "Humidity", "Pressure"],
      lastUpdated: "2 minutes ago",
      trend: "improving",
    },
    {
      id: "ensemble-predictor",
      name: "Ensemble Predictor",
      type: "Machine Learning",
      accuracy: 91.8,
      confidence: 93.5,
      isLearning: false,
      specialization: ["Wind Speed", "Visibility", "Cloud Cover"],
      lastUpdated: "5 minutes ago",
      trend: "stable",
    },
    {
      id: "climate-pattern",
      name: "Climate Pattern AI",
      type: "Pattern Recognition",
      accuracy: 89.5,
      confidence: 91.2,
      isLearning: !isLearning,
      specialization: ["Long-term Trends", "Seasonal Patterns"],
      lastUpdated: "1 minute ago",
      trend: "improving",
    },
    {
      id: "hybrid-forecast",
      name: "Hybrid Forecast Model",
      type: "Hybrid AI",
      accuracy: 96.1,
      confidence: 98.3,
      isLearning: isLearning,
      specialization: ["All Weather Parameters", "Extreme Events"],
      lastUpdated: "Just now",
      trend: "stable",
    },
  ]

  const getAccuracyMetrics = (): AccuracyMetric[] => {
    const selectedModelData = aiModels.find((m) => m.id === selectedModel)
    const baseAccuracy = selectedModelData?.accuracy || 90

    return [
      {
        name: "Temperature",
        icon: Thermometer,
        accuracy: baseAccuracy + Math.random() * 4 - 2,
        confidence: 95 + Math.random() * 4,
        trend: Math.random() > 0.5 ? "up" : "stable",
      },
      {
        name: "Humidity",
        icon: Droplets,
        accuracy: baseAccuracy + Math.random() * 6 - 3,
        confidence: 92 + Math.random() * 5,
        trend: Math.random() > 0.6 ? "up" : "down",
      },
      {
        name: "Wind Speed",
        icon: Wind,
        accuracy: baseAccuracy + Math.random() * 8 - 4,
        confidence: 88 + Math.random() * 6,
        trend: Math.random() > 0.4 ? "stable" : "up",
      },
      {
        name: "Visibility",
        icon: Eye,
        accuracy: baseAccuracy + Math.random() * 5 - 2.5,
        confidence: 90 + Math.random() * 5,
        trend: Math.random() > 0.7 ? "down" : "stable",
      },
      {
        name: "UV Index",
        icon: Sun,
        accuracy: baseAccuracy + Math.random() * 3 - 1.5,
        confidence: 94 + Math.random() * 4,
        trend: Math.random() > 0.5 ? "up" : "stable",
      },
    ]
  }

  const accuracyMetrics = getAccuracyMetrics()
  const currentModel = aiModels.find((m) => m.id === selectedModel)

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
      case "up":
        return "text-green-400"
      case "declining":
      case "down":
        return "text-red-400"
      case "stable":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
      case "up":
        return "↗"
      case "declining":
      case "down":
        return "↘"
      case "stable":
        return "→"
      default:
        return "→"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-8"
    >
      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Forecast Accuracy</h3>
            <p className="text-white/70 text-sm">Machine learning powered predictions</p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">AI Models</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiModels.map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedModel === model.id
                    ? theme === "dark"
                      ? "bg-white/20 border-white/30"
                      : "bg-white/30 border-white/40"
                    : theme === "dark"
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-white" />
                    <span className="font-medium text-white text-sm">{model.name}</span>
                  </div>
                  {model.isLearning && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{model.type}</span>
                  <span className={`font-medium ${getTrendColor(model.trend)}`}>
                    {model.accuracy.toFixed(1)}% {getTrendIcon(model.trend)}
                  </span>
                </div>
                <div className="text-xs text-white/60 mt-1">Updated: {model.lastUpdated}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Current Model Details */}
        {currentModel && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">{currentModel.name}</h4>
              <div className="flex items-center gap-2">
                {currentModel.isLearning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}
                <span className="text-xs text-white/70">{currentModel.isLearning ? "Learning..." : "Ready"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-white/70">Overall Accuracy</div>
                <div className="text-lg font-bold text-white">{currentModel.accuracy.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-white/70">Confidence Level</div>
                <div className="text-lg font-bold text-white">{currentModel.confidence.toFixed(1)}%</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-white/70 mb-1">Specializations</div>
              <div className="flex flex-wrap gap-1">
                {currentModel.specialization.map((spec, index) => (
                  <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Accuracy Metrics */}
        <div>
          <h4 className="text-white font-medium mb-3">Parameter Accuracy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {accuracyMetrics.map((metric, index) => {
              const IconComponent = metric.icon

              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="w-4 h-4 text-white/70" />
                    <span className="text-sm font-medium text-white">{metric.name}</span>
                    <span className={`text-xs ${getTrendColor(metric.trend)}`}>{getTrendIcon(metric.trend)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Accuracy</span>
                      <span className="text-white font-medium">{metric.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.accuracy}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Confidence</span>
                      <span className="text-white/80">{metric.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">AI Insights</span>
          </div>
          <div className="text-xs text-white/80">
            {currentModel?.isLearning
              ? `${currentModel.name} is currently learning from new weather patterns in ${weatherData.location}. Accuracy may improve over the next few hours.`
              : `${currentModel?.name} shows ${currentModel?.trend} performance with ${currentModel?.accuracy.toFixed(1)}% accuracy for ${weatherData.location}.`}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
