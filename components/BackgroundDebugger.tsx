"use client"

import { useEffect, useState } from "react"

interface BackgroundDebuggerProps {
  weatherData: any
  backgroundImage: string
}

export default function BackgroundDebugger({ weatherData, backgroundImage }: BackgroundDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (weatherData) {
      setDebugInfo({
        location: weatherData.location,
        condition: weatherData.condition,
        description: weatherData.description,
        backgroundImage,
        timestamp: new Date().toLocaleTimeString(),
      })
    }
  }, [weatherData, backgroundImage])

  if (!weatherData) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">🐛 Background Debug</h4>
      <div className="space-y-1">
        <div>
          <strong>Location:</strong> {debugInfo.location}
        </div>
        <div>
          <strong>Condition:</strong> {debugInfo.condition}
        </div>
        <div>
          <strong>Description:</strong> {debugInfo.description}
        </div>
        <div>
          <strong>Background:</strong> {debugInfo.backgroundImage?.split("/").pop()}
        </div>
        <div>
          <strong>Updated:</strong> {debugInfo.timestamp}
        </div>
      </div>
    </div>
  )
}
