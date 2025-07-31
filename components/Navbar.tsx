"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Home, Map, TrendingUp, Gauge, Radio, Menu, X, Cloud } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Weather Map", href: "/weather-map", icon: Map },
  { name: "Weather Trends", href: "/weather-trends", icon: TrendingUp },
  { name: "Weather Metrics", href: "/weather-metrics", icon: Gauge },
  { name: "Weather Stations", href: "/weather-stations", icon: Radio },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-500 bg-black/20 border-white/10"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Cloud className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Weather Station
                </h1>
                <p className="text-xs text-white/70">Advanced Forecasting</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 relative ${
                      isActive
                        ? "bg-white/20 text-white border border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      boxShadow: isActive ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "none",
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t overflow-hidden border-white/10 bg-black/30"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white border border-white/30"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                        boxShadow: isActive ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "none",
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16" />
    </>
  )
}
