import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Advanced Weather Station",
  description: "Professional weather forecasting with interactive maps, trends analysis, and real-time metrics",
  keywords: ["weather", "forecast", "climate", "meteorology", "weather station"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
