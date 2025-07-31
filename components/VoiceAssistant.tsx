"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle, X } from "lucide-react"

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

interface VoiceAssistantProps {
  weatherData: WeatherData | null
  onLocationRequest: (location: string) => void
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string
        confidence: number
      }
    }
    length: number
  }
}

export default function VoiceAssistant({ weatherData, onLocationRequest }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 0,
    rate: 1,
    volume: 1,
    pitch: 1,
  })
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }
    }

    // Check for speech synthesis support
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis

      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || []
        setAvailableVoices(voices)
      }

      loadVoices()
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && text) {
      synthRef.current.cancel() // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text)

      if (availableVoices[voiceSettings.voice]) {
        utterance.voice = availableVoices[voiceSettings.voice]
      }

      utterance.rate = voiceSettings.rate
      utterance.volume = voiceSettings.volume
      utterance.pitch = voiceSettings.pitch

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    setCommandHistory((prev) => [command, ...prev.slice(0, 4)])

    let responseText = ""

    if (lowerCommand.includes("weather") && !lowerCommand.includes(" in ")) {
      if (weatherData) {
        responseText = `The current weather in ${weatherData.location} is ${weatherData.condition} with a temperature of ${Math.round(weatherData.temperature)} degrees Celsius. It feels like ${Math.round(weatherData.feelsLike)} degrees. The humidity is ${weatherData.humidity}% and wind speed is ${Math.round(weatherData.windSpeed)} kilometers per hour.`
      } else {
        responseText = "I don't have weather data available right now. Please try searching for a location first."
      }
    } else if (lowerCommand.includes("weather in ")) {
      const locationMatch = lowerCommand.match(/weather in (.+)/)
      if (locationMatch) {
        const location = locationMatch[1].trim()
        responseText = `Getting weather information for ${location}...`
        onLocationRequest(location)
      }
    } else if (lowerCommand.includes("temperature")) {
      if (weatherData) {
        responseText = `The temperature in ${weatherData.location} is ${Math.round(weatherData.temperature)} degrees Celsius, feeling like ${Math.round(weatherData.feelsLike)} degrees.`
      } else {
        responseText = "Temperature information is not available."
      }
    } else if (lowerCommand.includes("humidity")) {
      if (weatherData) {
        responseText = `The humidity in ${weatherData.location} is ${weatherData.humidity}%.`
      } else {
        responseText = "Humidity information is not available."
      }
    } else if (lowerCommand.includes("wind")) {
      if (weatherData) {
        responseText = `The wind speed in ${weatherData.location} is ${Math.round(weatherData.windSpeed)} kilometers per hour.`
      } else {
        responseText = "Wind information is not available."
      }
    } else if (lowerCommand.includes("pressure")) {
      if (weatherData) {
        responseText = `The atmospheric pressure in ${weatherData.location} is ${weatherData.pressure} hectopascals.`
      } else {
        responseText = "Pressure information is not available."
      }
    } else if (lowerCommand.includes("umbrella") || lowerCommand.includes("rain")) {
      if (weatherData) {
        const hasRain =
          weatherData.condition.toLowerCase().includes("rain") || weatherData.description.toLowerCase().includes("rain")
        responseText = hasRain
          ? `Yes, it's raining in ${weatherData.location}. I recommend bringing an umbrella.`
          : `No rain expected in ${weatherData.location} right now. You probably don't need an umbrella.`
      } else {
        responseText = "I can't check the rain conditions without weather data."
      }
    } else if (lowerCommand.includes("sunrise") || lowerCommand.includes("sunset")) {
      if (weatherData) {
        responseText = `In ${weatherData.location}, sunrise is at ${weatherData.sunTimes.sunrise} and sunset is at ${weatherData.sunTimes.sunset}.`
      } else {
        responseText = "Sunrise and sunset times are not available."
      }
    } else if (lowerCommand.includes("help")) {
      responseText =
        "I can help you with weather information. Try asking: What's the weather? Weather in London. What's the temperature? Should I bring an umbrella? What's the humidity? Or ask about wind, pressure, sunrise and sunset times."
    } else {
      responseText =
        "I didn't understand that command. Try asking about the weather, temperature, humidity, wind, or say 'help' for more options."
    }

    setResponse(responseText)
    speak(responseText)
  }

  const quickCommands = [
    "What's the weather?",
    "What's the temperature?",
    "Should I bring an umbrella?",
    "What's the humidity?",
    "Help",
  ]

  if (!isSupported) {
    return (
      <div
        className={`fixed bottom-4 right-4 p-4 rounded-xl backdrop-blur-md border ${
          theme === "dark" ? "bg-red-900/30 border-red-500/30" : "bg-red-500/20 border-red-500/30"
        }`}
      >
        <p className="text-white text-sm">Voice assistant not supported in this browser</p>
      </div>
    )
  }

  return (
    <>
      {/* Main Voice Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full backdrop-blur-md border-2 flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "bg-red-500/30 border-red-500/50 shadow-lg shadow-red-500/25"
              : "bg-blue-500/30 border-blue-500/50 hover:bg-blue-500/40"
          }`}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isListening ? Number.POSITIVE_INFINITY : 0 }}
          >
            {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </motion.div>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className={`w-12 h-12 rounded-full backdrop-blur-md border mt-2 flex items-center justify-center transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-white/20 hover:bg-white/20"
              : "bg-white/20 border-white/30 hover:bg-white/30"
          }`}
        >
          <Settings className="w-4 h-4 text-white" />
        </motion.button>
      </motion.div>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {(transcript || response || isListening) && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed bottom-24 right-4 w-80 max-h-96 backdrop-blur-md border rounded-2xl p-4 z-40 ${
              theme === "dark" ? "bg-black/30 border-white/20" : "bg-white/20 border-white/30"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Voice Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={stopSpeaking}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    <VolumeX className="w-4 h-4 text-white" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setTranscript("")
                    setResponse("")
                  }}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Status */}
            <div className="mb-3">
              {isListening && (
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                  Listening...
                </div>
              )}
              {isSpeaking && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  Speaking...
                </div>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-3 p-3 bg-white/10 rounded-lg">
                <div className="text-xs text-white/70 mb-1">You said:</div>
                <div className="text-white text-sm">{transcript}</div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="mb-3 p-3 bg-blue-500/20 rounded-lg">
                <div className="text-xs text-blue-300 mb-1">Assistant:</div>
                <div className="text-white text-sm">{response}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(response)}
                  className="mt-2 px-2 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20"
                >
                  <Volume2 className="w-3 h-3 inline mr-1" />
                  Repeat
                </motion.button>
              </div>
            )}

            {/* Quick Commands */}
            <div>
              <div className="text-xs text-white/70 mb-2">Quick Commands:</div>
              <div className="space-y-1">
                {quickCommands.map((command, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVoiceCommand(command)}
                    className="w-full text-left px-2 py-1 text-xs text-white/80 hover:bg-white/10 rounded"
                  >
                    "{command}"
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-white/70 mb-2">Recent Commands:</div>
                <div className="space-y-1">
                  {commandHistory.slice(0, 3).map((cmd, index) => (
                    <div key={index} className="text-xs text-white/60 truncate">
                      "{cmd}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed bottom-24 right-20 w-72 backdrop-blur-md border rounded-2xl p-4 z-40 ${
              theme === "dark" ? "bg-black/30 border-white/20" : "bg-white/20 border-white/30"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Voice Settings</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {/* Voice Selection */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">Voice</label>
                <select
                  value={voiceSettings.voice}
                  onChange={(e) => setVoiceSettings((prev) => ({ ...prev, voice: Number.parseInt(e.target.value) }))}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  {availableVoices.map((voice, index) => (
                    <option key={index} value={index} className="bg-gray-800">
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Speech Rate */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">
                  Speech Rate: {voiceSettings.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings((prev) => ({ ...prev, rate: Number.parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Volume */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">
                  Volume: {Math.round(voiceSettings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings((prev) => ({ ...prev, volume: Number.parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Pitch */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">Pitch: {voiceSettings.pitch.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings((prev) => ({ ...prev, pitch: Number.parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Test Voice */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => speak("Hello! This is a test of the voice assistant settings.")}
                className="w-full p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-white text-sm transition-all duration-300"
              >
                <Volume2 className="w-4 h-4 inline mr-2" />
                Test Voice
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
