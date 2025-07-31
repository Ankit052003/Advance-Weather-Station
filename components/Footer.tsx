"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Cloud, Heart } from "lucide-react"

export default function Footer() {
  const { theme } = useTheme()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative z-10 mt-8 mb-4"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content - Reduced padding and size */}
        <motion.div
          className={`backdrop-blur-md border rounded-2xl p-4 transition-all duration-500 relative overflow-hidden ${
            theme === "dark" ? "bg-black/40 border-white/30" : "bg-white/30 border-white/40"
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated Background Elements - Smaller */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full"
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            {/* Tagline - Reduced size */}
            <motion.div
              className="mb-3"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <motion.h2
                className="text-lg md:text-xl font-bold mb-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                "Bringing you sunshine and forecasts"
              </motion.h2>

              {/* Decorative Icons - Smaller */}
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sun className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                </motion.div>

                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Cloud className="w-4 h-4 text-blue-300 drop-shadow-lg" />
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Heart className="w-3 h-3 text-pink-400 drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>

            {/* Creator Name - Reduced size */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              <motion.div
                className={`inline-block px-4 py-2 rounded-xl transition-all duration-500 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/40"
                    : "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/40"
                }`}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.p
                  className="text-white/80 text-xs font-medium mb-0.5 tracking-wide"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Created with passion by
                </motion.p>

                <motion.h3
                  className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Ankit Kumar Singh
                </motion.h3>

                {/* Sparkle Effects - Smaller */}
                <div className="absolute -top-1 -right-1">
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0,
                    }}
                  />
                </div>

                <div className="absolute -bottom-1 -left-1">
                  <motion.div
                    className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.7,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Additional Info - More compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-3 pt-3 border-t border-white/30"
            >
              <p className="text-white/70 text-xs font-medium">
                Advanced Weather Station • Real-time Forecasts • Air Quality Monitoring
              </p>

              <motion.div
                className="flex items-center justify-center gap-1.5 mt-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-white/60 text-xs">Live Weather Data</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright - Smaller */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center mt-3"
        >
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Weather Station. Made with ❤️ for weather enthusiasts.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
