"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import WeatherGauges from "@/components/WeatherGauges"

export default function WeatherMetricsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Mode Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-slate-900 via-orange-900/20 to-amber-900/30" />

        {/* Subtle animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-yellow-600/10"
          style={{
            backgroundSize: "400% 400%",
            animation: "gradient 18s ease infinite",
          }}
        />

        {/* Hexagon pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 bg-white"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="backdrop-blur-md rounded-2xl p-6 mb-8 border transition-all duration-500 bg-gradient-to-r from-slate-800/40 via-orange-900/30 to-amber-900/40 border-white/10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-5xl font-bold mb-4 text-white"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Weather Metrics Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-white/80"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
            >
              Monitor real-time weather metrics with precision gauges and detailed atmospheric measurements
            </motion.p>
          </div>
        </motion.div>

        {/* Metrics Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="container mx-auto px-4 pb-8"
        >
          <WeatherGauges humidity={65} windSpeed={12} pressure={1013} visibility={10} />
        </motion.div>
      </div>
    </div>
  )
}
