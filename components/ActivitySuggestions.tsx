"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Activity, Bike, Mountain, Camera, Book, Gamepad2, ChefHat, Palette, Sun, Cloud, Filter } from "lucide-react"

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

interface ActivitySuggestionsProps {
  weatherData: WeatherData
}

interface ActivitySuggestion {
  id: string
  name: string
  type: "outdoor" | "indoor"
  icon: any
  suitability: "excellent" | "good" | "fair" | "poor"
  score: number
  bestTime: string
  duration: string
  difficulty: "easy" | "medium" | "hard"
  tips: string[]
  requirements: string[]
}

export default function ActivitySuggestions({ weatherData }: ActivitySuggestionsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "outdoor" | "indoor">("all")
  const { theme } = useTheme()

  const calculateActivityScore = (activity: string): number => {
    const { temperature, condition, windSpeed, visibility, uvIndex, humidity } = weatherData
    let score = 50 // Base score

    // Temperature adjustments
    if (activity === "running" || activity === "cycling") {
      if (temperature >= 15 && temperature <= 25) score += 30
      else if (temperature >= 10 && temperature <= 30) score += 15
      else if (temperature < 5 || temperature > 35) score -= 30
    }

    if (activity === "hiking") {
      if (temperature >= 10 && temperature <= 28) score += 25
      else if (temperature < 0 || temperature > 35) score -= 25
    }

    if (activity === "photography") {
      if (temperature >= 5 && temperature <= 30) score += 20
      if (condition.includes("clear") || condition.includes("partly")) score += 20
    }

    // Weather condition adjustments
    if (condition.toLowerCase().includes("rain")) {
      if (activity === "running" || activity === "cycling" || activity === "hiking") score -= 40
      if (activity === "photography") score -= 20
      if (activity === "reading" || activity === "gaming" || activity === "cooking") score += 15
    }

    if (condition.toLowerCase().includes("snow")) {
      if (activity === "hiking") score += 10 // Winter hiking
      if (activity === "photography") score += 15 // Snow photography
      if (activity === "running" || activity === "cycling") score -= 30
    }

    // Wind adjustments
    if (windSpeed > 15) {
      if (activity === "cycling") score -= 25
      if (activity === "photography") score -= 15
    }

    // UV adjustments
    if (uvIndex > 7) {
      if (activity === "hiking" || activity === "cycling") score -= 15
    }

    // Visibility adjustments
    if (visibility < 5) {
      if (activity === "hiking" || activity === "photography") score -= 20
    }

    // Humidity adjustments
    if (humidity > 80) {
      if (activity === "running" || activity === "cycling") score -= 15
    }

    return Math.max(0, Math.min(100, score))
  }

  const getActivitySuggestions = (): ActivitySuggestion[] => {
    const activities = [
      {
        id: "running",
        name: "Running",
        type: "outdoor" as const,
        icon: Activity,
        bestTime: weatherData.temperature > 25 ? "Early morning or evening" : "Anytime",
        duration: "30-60 minutes",
        difficulty: "medium" as const,
        tips: ["Stay hydrated", "Wear appropriate running shoes", "Start with a warm-up"],
        requirements: ["Running shoes", "Comfortable clothes", "Water bottle"],
      },
      {
        id: "cycling",
        name: "Cycling",
        type: "outdoor" as const,
        icon: Bike,
        bestTime: weatherData.windSpeed > 15 ? "When wind is calmer" : "Anytime",
        duration: "45-90 minutes",
        difficulty: "medium" as const,
        tips: ["Check tire pressure", "Wear a helmet", "Follow traffic rules"],
        requirements: ["Bicycle", "Helmet", "Reflective gear"],
      },
      {
        id: "hiking",
        name: "Hiking",
        type: "outdoor" as const,
        icon: Mountain,
        bestTime: weatherData.temperature > 30 ? "Early morning" : "Daytime",
        duration: "2-4 hours",
        difficulty: "hard" as const,
        tips: ["Bring plenty of water", "Inform someone of your route", "Check weather conditions"],
        requirements: ["Hiking boots", "Backpack", "First aid kit", "Map/GPS"],
      },
      {
        id: "photography",
        name: "Photography",
        type: "outdoor" as const,
        icon: Camera,
        bestTime: "Golden hour (sunrise/sunset)",
        duration: "1-3 hours",
        difficulty: "easy" as const,
        tips: ["Use natural lighting", "Protect equipment from weather", "Experiment with angles"],
        requirements: ["Camera", "Extra batteries", "Memory cards"],
      },
      {
        id: "reading",
        name: "Reading",
        type: "indoor" as const,
        icon: Book,
        bestTime: "Anytime",
        duration: "1-2 hours",
        difficulty: "easy" as const,
        tips: ["Find a comfortable spot", "Good lighting is important", "Take breaks for your eyes"],
        requirements: ["Book or e-reader", "Comfortable seating", "Good lighting"],
      },
      {
        id: "gaming",
        name: "Gaming",
        type: "indoor" as const,
        icon: Gamepad2,
        bestTime: "Anytime",
        duration: "1-3 hours",
        difficulty: "easy" as const,
        tips: ["Take regular breaks", "Maintain good posture", "Stay hydrated"],
        requirements: ["Gaming device", "Comfortable seating", "Good internet"],
      },
      {
        id: "cooking",
        name: "Cooking",
        type: "indoor" as const,
        icon: ChefHat,
        bestTime: "Meal times",
        duration: "30-90 minutes",
        difficulty: "medium" as const,
        tips: ["Read recipe thoroughly first", "Prep ingredients beforehand", "Keep kitchen clean"],
        requirements: ["Ingredients", "Cooking utensils", "Recipe"],
      },
      {
        id: "art",
        name: "Art & Crafts",
        type: "indoor" as const,
        icon: Palette,
        bestTime: "When you feel creative",
        duration: "1-4 hours",
        difficulty: "easy" as const,
        tips: ["Set up proper workspace", "Have good lighting", "Experiment freely"],
        requirements: ["Art supplies", "Workspace", "Inspiration"],
      },
    ]

    return activities
      .map((activity) => {
        const score = calculateActivityScore(activity.id)
        let suitability: "excellent" | "good" | "fair" | "poor"

        if (score >= 80) suitability = "excellent"
        else if (score >= 65) suitability = "good"
        else if (score >= 45) suitability = "fair"
        else suitability = "poor"

        return {
          ...activity,
          score,
          suitability,
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  const activities = getActivitySuggestions()
  const filteredActivities = activities.filter((activity) => activeFilter === "all" || activity.type === activeFilter)

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "excellent":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30"
      case "good":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      case "fair":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
      case "poor":
        return "from-red-500/20 to-orange-500/20 border-red-500/30"
      default:
        return "from-gray-500/20 to-slate-500/20 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "hard":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Activity Suggestions</h3>
            <p className="text-white/70 text-sm">Perfect activities for current weather</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All Activities", icon: Filter },
            { key: "outdoor", label: "Outdoor", icon: Sun },
            { key: "indoor", label: "Indoor", icon: Cloud },
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeFilter === key
                  ? theme === "dark"
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/30 text-white border border-white/40"
                  : theme === "dark"
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((activity, index) => {
            const IconComponent = activity.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getSuitabilityColor(activity.suitability)} backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{activity.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}
                        >
                          {activity.difficulty}
                        </span>
                        <span className="text-white/60 text-xs">{activity.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{activity.score}%</div>
                    <div
                      className={`text-xs font-medium ${
                        activity.suitability === "excellent"
                          ? "text-green-300"
                          : activity.suitability === "good"
                            ? "text-blue-300"
                            : activity.suitability === "fair"
                              ? "text-yellow-300"
                              : "text-red-300"
                      }`}
                    >
                      {activity.suitability}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Best Time:</span>
                    <span className="text-white">{activity.bestTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">{activity.duration}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-white/70 mb-1">Quick Tips:</div>
                  <div className="text-xs text-white/80">{activity.tips.slice(0, 2).join(" • ")}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
