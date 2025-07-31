"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Shield } from "lucide-react"

interface UVIndexProps {
  uvIndex: number
  sunriseTime?: string
  sunsetTime?: string
}

export default function UVIndex({ uvIndex, sunriseTime, sunsetTime }: UVIndexProps) {
  const { theme } = useTheme()

  const getUVLevel = (uv: number) => {
    if (uv <= 2)
      return {
        level: "Low",
        color: "from-green-500 to-emerald-600",
        textColor: "text-green-400",
        protection: "No protection needed",
      }
    if (uv <= 5)
      return {
        level: "Moderate",
        color: "from-yellow-500 to-orange-500",
        textColor: "text-yellow-400",
        protection: "Some protection required",
      }
    if (uv <= 7)
      return {
        level: "High",
        color: "from-orange-500 to-red-500",
        textColor: "text-orange-400",
        protection: "Protection essential",
      }
    if (uv <= 10)
      return {
        level: "Very High",
        color: "from-red-500 to-red-700",
        textColor: "text-red-400",
        protection: "Extra protection needed",
      }
    return {
      level: "Extreme",
      color: "from-purple-600 to-red-800",
      textColor: "text-purple-400",
      protection: "Avoid sun exposure",
    }
  }

  const getSPFRecommendation = (uv: number) => {
    if (uv <= 2) return "SPF 15+"
    if (uv <= 5) return "SPF 30+"
    if (uv <= 7) return "SPF 30-50+"
    return "SPF 50+"
  }

  const getProtectionTips = (uv: number) => {
    if (uv <= 2) return ["Wear sunglasses on bright days"]
    if (uv <= 5) return ["Wear sunglasses", "Use sunscreen", "Seek shade during midday"]
    if (uv <= 7)
      return ["Wear sunglasses and hat", "Use sunscreen SPF 30+", "Seek shade 10am-4pm", "Wear protective clothing"]
    if (uv <= 10)
      return [
        "Wear sunglasses and wide-brim hat",
        "Use sunscreen SPF 50+",
        "Avoid sun 10am-4pm",
        "Wear long sleeves and pants",
      ]
    return ["Avoid outdoor activities", "Stay in shade", "Wear full protection", "Use sunscreen SPF 50+"]
  }

  const uvInfo = getUVLevel(uvIndex)
  const protectionTips = getProtectionTips(uvIndex)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-6 h-6 text-white" />
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
          UV Index & Sun Protection
        </h3>
      </div>

      <div
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/10 border-white/20"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UV Index Display */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <motion.div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${uvInfo.color} flex items-center justify-center relative overflow-hidden`}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <span className="text-2xl font-bold text-white relative z-10">{uvIndex}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </motion.div>
              <div>
                <div className={`text-xl font-bold ${uvInfo.textColor}`}>{uvInfo.level}</div>
                <div className="text-white/70 text-sm">UV Index</div>
                <div className="text-white/60 text-xs mt-1">{uvInfo.protection}</div>
              </div>
            </div>

            {/* Sun Times */}
            {(sunriseTime || sunsetTime) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {sunriseTime && (
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <div className="text-yellow-400 text-sm font-medium">Sunrise</div>
                    <div className="text-white font-bold">{sunriseTime}</div>
                  </div>
                )}
                {sunsetTime && (
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <div className="text-orange-400 text-sm font-medium">Sunset</div>
                    <div className="text-white font-bold">{sunsetTime}</div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-semibold">Recommended SPF</span>
              </div>
              <div className="text-white text-xl font-bold">{getSPFRecommendation(uvIndex)}</div>
            </div>
          </div>

          {/* Protection Tips */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Protection Tips
            </h4>
            <div className="space-y-3">
              {protectionTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex-shrink-0" />
                  <span className="text-white/80 text-sm">{tip}</span>
                </motion.div>
              ))}
            </div>

            {/* UV Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-white/70 text-xs mb-2">
                <span>0</span>
                <span>11+</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 via-red-500 to-purple-600 rounded-full" />
                <motion.div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg rounded-full"
                  initial={{ left: "0%" }}
                  animate={{ left: `${Math.min((uvIndex / 11) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
