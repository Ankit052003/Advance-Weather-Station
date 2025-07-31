"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Umbrella, Sun, Wind, Thermometer, Eye, AlertTriangle, ChevronDown, Shirt, Car, Home } from "lucide-react"

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

interface WeatherRecommendationsProps {
  weatherData: WeatherData
}

interface Recommendation {
  id: string
  category: "clothing" | "safety" | "travel" | "comfort" | "activity"
  priority: "high" | "medium" | "low"
  icon: any
  title: string
  description: string
  details: string[]
}

export default function WeatherRecommendations({ weatherData }: WeatherRecommendationsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const { theme } = useTheme()

  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = []
    const { temperature, condition, description, humidity, windSpeed, visibility, uvIndex } = weatherData

    // Temperature-based clothing recommendations
    if (temperature < 0) {
      recommendations.push({
        id: "winter-gear",
        category: "clothing",
        priority: "high",
        icon: Thermometer,
        title: "Bundle Up - Freezing Weather",
        description: "Wear heavy winter clothing and protect exposed skin",
        details: [
          "Heavy winter coat or parka",
          "Insulated gloves and warm hat",
          "Thermal underwear and warm socks",
          "Waterproof boots with good traction",
          "Scarf to protect neck and face",
        ],
      })
    } else if (temperature < 10) {
      recommendations.push({
        id: "cold-weather",
        category: "clothing",
        priority: "medium",
        icon: Shirt,
        title: "Layer Up - Cold Weather",
        description: "Dress in layers to stay warm and comfortable",
        details: [
          "Warm jacket or heavy sweater",
          "Long pants and closed shoes",
          "Light gloves and beanie",
          "Consider thermal layers",
          "Bring a warm scarf",
        ],
      })
    } else if (temperature > 30) {
      recommendations.push({
        id: "hot-weather",
        category: "clothing",
        priority: "medium",
        icon: Sun,
        title: "Stay Cool - Hot Weather",
        description: "Wear light, breathable clothing and stay hydrated",
        details: [
          "Light-colored, loose-fitting clothes",
          "Breathable fabrics like cotton or linen",
          "Wide-brimmed hat for sun protection",
          "Comfortable sandals or breathable shoes",
          "Carry a water bottle",
        ],
      })
    }

    // Weather condition-based recommendations
    if (condition.toLowerCase().includes("rain") || description.toLowerCase().includes("rain")) {
      recommendations.push({
        id: "rain-gear",
        category: "safety",
        priority: "high",
        icon: Umbrella,
        title: "It's Raining - Carry an Umbrella",
        description: "Stay dry and be cautious of wet surfaces",
        details: [
          "Bring a sturdy umbrella",
          "Wear waterproof jacket or raincoat",
          "Non-slip shoes with good grip",
          "Be extra careful on wet surfaces",
          "Allow extra travel time",
        ],
      })
    }

    // UV Index recommendations
    if (uvIndex > 6) {
      recommendations.push({
        id: "uv-protection",
        category: "safety",
        priority: "high",
        icon: Sun,
        title: "High UV - Sun Protection Required",
        description: "Protect your skin from harmful UV radiation",
        details: [
          "Apply SPF 30+ sunscreen generously",
          "Wear sunglasses with UV protection",
          "Use a wide-brimmed hat",
          "Seek shade during peak hours (10am-4pm)",
          "Wear long sleeves if possible",
        ],
      })
    }

    // Wind recommendations
    if (windSpeed > 20) {
      recommendations.push({
        id: "windy-conditions",
        category: "safety",
        priority: "medium",
        icon: Wind,
        title: "Windy Conditions - Take Precautions",
        description: "Strong winds may affect outdoor activities",
        details: [
          "Secure loose items and clothing",
          "Be cautious with umbrellas",
          "Avoid parking under trees",
          "Consider postponing outdoor activities",
          "Drive carefully and watch for debris",
        ],
      })
    }

    // Visibility recommendations
    if (visibility < 5) {
      recommendations.push({
        id: "low-visibility",
        category: "travel",
        priority: "high",
        icon: Eye,
        title: "Low Visibility - Drive Carefully",
        description: "Reduced visibility affects travel safety",
        details: [
          "Use headlights even during daytime",
          "Reduce driving speed significantly",
          "Increase following distance",
          "Use fog lights if available",
          "Consider delaying non-essential travel",
        ],
      })
    }

    // Humidity recommendations
    if (humidity > 80) {
      recommendations.push({
        id: "high-humidity",
        category: "comfort",
        priority: "low",
        icon: Home,
        title: "High Humidity - Stay Comfortable",
        description: "Muggy conditions may feel uncomfortable",
        details: [
          "Stay hydrated with water",
          "Use air conditioning or fans",
          "Wear moisture-wicking fabrics",
          "Take frequent breaks if outdoors",
          "Avoid strenuous outdoor activities",
        ],
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const recommendations = getRecommendations()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500/20 to-orange-500/20 border-red-500/30"
      case "medium":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
      case "low":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      default:
        return "from-gray-500/20 to-slate-500/20 border-gray-500/30"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clothing":
        return Shirt
      case "safety":
        return AlertTriangle
      case "travel":
        return Car
      case "comfort":
        return Home
      case "activity":
        return Sun
      default:
        return AlertTriangle
    }
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Smart Recommendations</h3>
            <p className="text-white/70 text-sm">Weather-based suggestions for your day</p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const IconComponent = rec.icon
            const CategoryIcon = getCategoryIcon(rec.category)
            const isExpanded = expandedCard === rec.id

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getPriorityColor(rec.priority)} backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
                onClick={() => setExpandedCard(isExpanded ? null : rec.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        rec.priority === "high"
                          ? "bg-red-500/20"
                          : rec.priority === "medium"
                            ? "bg-yellow-500/20"
                            : "bg-blue-500/20"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                        <CategoryIcon className="w-3 h-3 text-white/60" />
                      </div>
                      <p className="text-white/80 text-xs">{rec.description}</p>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <ul className="space-y-1">
                        {rec.details.map((detail, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="text-white/70 text-xs flex items-center gap-2"
                          >
                            <div className="w-1 h-1 bg-white/50 rounded-full" />
                            {detail}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
