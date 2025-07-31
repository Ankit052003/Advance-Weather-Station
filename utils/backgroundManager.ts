// Enhanced background images mapping for different weather conditions
export const weatherBackgrounds = {
  // Clear/Sunny Weather
  Clear: "/images/sunny_weather.jpg",

  // Cloudy Weather
  Clouds: "/images/cloudy_weather.jpg",
  "few clouds": "/images/sunny_weather.jpg", // Mostly sunny with some clouds
  "scattered clouds": "/images/cloudy_weather.jpg",
  "broken clouds": "/images/cloudy_weather.jpg",
  "overcast clouds": "/images/cloudy_weather.jpg",

  // Rainy Weather
  Rain: "/images/rainy_weather.jpg",
  Drizzle: "/images/rainy_weather.jpg",
  "light rain": "/images/rainy_weather.jpg",
  "moderate rain": "/images/rainy_weather.jpg",
  "heavy intensity rain": "/images/rainy_weather.jpg",
  "very heavy rain": "/images/rainy_weather.jpg",
  "extreme rain": "/images/rainy_weather.jpg",
  "freezing rain": "/images/rainy_weather.jpg",
  "light intensity drizzle": "/images/rainy_weather.jpg",
  drizzle: "/images/rainy_weather.jpg",
  "heavy intensity drizzle": "/images/rainy_weather.jpg",
  "light intensity drizzle rain": "/images/rainy_weather.jpg",
  "drizzle rain": "/images/rainy_weather.jpg",
  "heavy intensity drizzle rain": "/images/rainy_weather.jpg",
  "shower rain": "/images/rainy_weather.jpg",
  "heavy intensity shower rain": "/images/rainy_weather.jpg",
  "ragged shower rain": "/images/rainy_weather.jpg",

  // Thunderstorm Weather
  Thunderstorm: "/images/stormy_weather.jpg",
  "thunderstorm with light rain": "/images/stormy_weather.jpg",
  "thunderstorm with rain": "/images/stormy_weather.jpg",
  "thunderstorm with heavy rain": "/images/stormy_weather.jpg",
  "light thunderstorm": "/images/stormy_weather.jpg",
  thunderstorm: "/images/stormy_weather.jpg",
  "heavy thunderstorm": "/images/stormy_weather.jpg",
  "ragged thunderstorm": "/images/stormy_weather.jpg",
  "thunderstorm with light drizzle": "/images/stormy_weather.jpg",
  "thunderstorm with drizzle": "/images/stormy_weather.jpg",
  "thunderstorm with heavy drizzle": "/images/stormy_weather.jpg",

  // Snow Weather
  Snow: "/images/snowy_weather.jpg",
  "light snow": "/images/snowy_weather.jpg",
  snow: "/images/snowy_weather.jpg",
  "heavy snow": "/images/snowy_weather.jpg",
  sleet: "/images/snowy_weather.jpg",
  "light shower sleet": "/images/snowy_weather.jpg",
  "shower sleet": "/images/snowy_weather.jpg",
  "light rain and snow": "/images/snowy_weather.jpg",
  "rain and snow": "/images/snowy_weather.jpg",
  "light shower snow": "/images/snowy_weather.jpg",
  "shower snow": "/images/snowy_weather.jpg",
  "heavy shower snow": "/images/snowy_weather.jpg",

  // Atmospheric conditions (Fog, Mist, etc.)
  Mist: "/images/foggy_weather.jpg",
  Smoke: "/images/foggy_weather.jpg",
  Haze: "/images/foggy_weather.jpg",
  Dust: "/images/foggy_weather.jpg",
  Fog: "/images/foggy_weather.jpg",
  Sand: "/images/windy_weather.jpg",
  Ash: "/images/foggy_weather.jpg",
  Squall: "/images/windy_weather.jpg",
  Tornado: "/images/stormy_weather.jpg",

  // Additional specific conditions
  "dust whirls": "/images/windy_weather.jpg",
  "sand/dust whirls": "/images/windy_weather.jpg",
  "volcanic ash": "/images/foggy_weather.jpg",
  "widespread dust": "/images/foggy_weather.jpg",
}

// Create a stable background key to prevent unnecessary changes
export const createBackgroundKey = (condition: string, description?: string): string => {
  const key = description ? `${condition}-${description}` : condition
  return key.toLowerCase().replace(/\s+/g, "-")
}

export const getBackgroundForWeather = (condition: string, description?: string): string => {
  console.log("=== BACKGROUND SELECTION ===")
  console.log("Input condition:", condition)
  console.log("Input description:", description)

  // First try to match by description (more specific)
  if (description) {
    const descriptionLower = description.toLowerCase()
    console.log("Checking description:", descriptionLower)

    const backgroundByDescription = weatherBackgrounds[descriptionLower as keyof typeof weatherBackgrounds]
    if (backgroundByDescription) {
      console.log("✅ Found background by description:", backgroundByDescription)
      console.log("============================")
      return backgroundByDescription
    } else {
      console.log("❌ No background found for description:", descriptionLower)
    }
  }

  // Then try to match by main condition
  console.log("Checking main condition:", condition)
  const backgroundByCondition = weatherBackgrounds[condition as keyof typeof weatherBackgrounds]
  if (backgroundByCondition) {
    console.log("✅ Found background by condition:", backgroundByCondition)
    console.log("============================")
    return backgroundByCondition
  } else {
    console.log("❌ No background found for condition:", condition)
  }

  // Default fallback
  console.log("🔄 Using default sunny background")
  console.log("============================")
  return weatherBackgrounds.Clear
}

// Helper function to get background image
export const getBackgroundImage = (condition: string, description?: string): string => {
  return getBackgroundForWeather(condition, description)
}

// Enhanced gradients - only dark mode now
export const getGradientForWeather = (condition: string, theme: string, description?: string): string => {
  const darkGradients = {
    Clear: "from-blue-900/40 via-purple-800/30 to-pink-800/40",
    Clouds: "from-slate-800/60 via-gray-700/50 to-black/60",
    Rain: "from-slate-900/70 via-blue-800/60 to-indigo-900/70",
    Drizzle: "from-slate-800/65 via-blue-700/55 to-cyan-800/65",
    Thunderstorm: "from-black/80 via-gray-900/70 to-purple-900/80",
    Snow: "from-slate-700/55 via-blue-600/45 to-indigo-700/55",
    Mist: "from-slate-800/65 via-gray-700/55 to-blue-800/65",
    Smoke: "from-gray-900/75 via-red-700/55 to-black/75",
    Haze: "from-slate-700/65 via-yellow-700/45 to-orange-800/65",
    Dust: "from-yellow-800/65 via-orange-700/55 to-red-800/65",
    Fog: "from-slate-800/70 via-blue-700/55 to-indigo-800/70",
    Sand: "from-yellow-800/65 via-orange-700/55 to-red-800/65",
    Ash: "from-gray-900/80 via-red-800/65 to-black/80",
    Squall: "from-slate-800/70 via-teal-700/55 to-green-800/70",
    Tornado: "from-black/85 via-green-800/65 to-gray-900/85",
  }

  // Check for specific weather descriptions first
  if (description) {
    const descLower = description.toLowerCase()
    if (descLower.includes("light")) {
      // Lighter overlay for light conditions
      const baseGradient = darkGradients[condition as keyof typeof darkGradients]
      if (baseGradient) {
        // Reduce opacity for light conditions
        return baseGradient.replace(/\/\d+/g, (match) => {
          const opacity = Number.parseInt(match.slice(1))
          return `/${Math.max(15, opacity - 10)}`
        })
      }
    } else if (descLower.includes("heavy") || descLower.includes("extreme")) {
      // Darker overlay for heavy conditions
      const baseGradient = darkGradients[condition as keyof typeof darkGradients]
      if (baseGradient) {
        // Increase opacity for heavy conditions
        return baseGradient.replace(/\/\d+/g, (match) => {
          const opacity = Number.parseInt(match.slice(1))
          return `/${Math.min(85, opacity + 15)}`
        })
      }
    }
  }

  const selectedGradient = darkGradients[condition as keyof typeof darkGradients] || darkGradients.Clear

  console.log("Selected gradient for", condition, "in dark mode:", selectedGradient)
  return selectedGradient
}

// Function to get weather-specific particle effects
export const getWeatherParticles = (condition: string, description?: string) => {
  const particleConfigs = {
    Clear: { count: 8, color: "bg-yellow-300/15", speed: 15 },
    Clouds: { count: 12, color: "bg-gray-300/20", speed: 12 },
    Rain: { count: 20, color: "bg-blue-400/25", speed: 8 },
    Drizzle: { count: 15, color: "bg-blue-300/20", speed: 10 },
    Thunderstorm: { count: 25, color: "bg-purple-400/30", speed: 6 },
    Snow: { count: 30, color: "bg-white/35", speed: 14 },
    Mist: { count: 18, color: "bg-gray-200/25", speed: 16 },
    Fog: { count: 22, color: "bg-gray-100/30", speed: 18 },
    Dust: { count: 16, color: "bg-yellow-400/25", speed: 10 },
    Sand: { count: 14, color: "bg-orange-300/25", speed: 8 },
  }

  return particleConfigs[condition as keyof typeof particleConfigs] || particleConfigs.Clear
}

// City-specific weather tendency (for better background prediction)
export const getCityWeatherTendency = (cityName: string) => {
  const cityTendencies: { [key: string]: string[] } = {
    // Sunny cities
    Phoenix: ["Clear", "sunny"],
    "Las Vegas": ["Clear", "sunny"],
    Miami: ["Clear", "sunny"],
    "Los Angeles": ["Clear", "sunny"],
    "San Diego": ["Clear", "sunny"],
    Dubai: ["Clear", "sunny"],
    Cairo: ["Clear", "sunny"],

    // Rainy cities
    Seattle: ["Rain", "Drizzle"],
    London: ["Rain", "Clouds"],
    Mumbai: ["Rain", "Thunderstorm"],
    Singapore: ["Rain", "Thunderstorm"],
    Vancouver: ["Rain", "Drizzle"],

    // Snowy cities
    Moscow: ["Snow", "Clouds"],
    Toronto: ["Snow", "Clouds"],
    Stockholm: ["Snow", "Clouds"],
    Helsinki: ["Snow", "Clouds"],

    // Foggy cities
    "San Francisco": ["Mist", "Fog"],
    Portland: ["Mist", "Drizzle"],

    // Stormy cities
    "New Orleans": ["Thunderstorm", "Rain"],
    Houston: ["Thunderstorm", "Rain"],
  }

  return cityTendencies[cityName] || ["Clear"]
}
