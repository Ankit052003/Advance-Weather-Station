const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ""
const BASE_URL = "https://api.openweathermap.org/data/2.5"

if (!API_KEY) {
  console.error("OpenWeather API key not found. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file")
}

console.log("Using OpenWeather API with key:", API_KEY.substring(0, 8) + "...")

export const fetchWeatherData = async (query: string) => {
  try {
    const url = `${BASE_URL}/weather?${query}&appid=${API_KEY}&units=metric`
    console.log("Fetching weather from:", url.replace(API_KEY, "***"))

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Weather API Error:", response.status, errorData)
      throw new Error(`Weather data not found: ${response.status} ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("Weather data received for:", data.name)
    console.log("Weather condition:", data.weather[0].main)
    console.log("Weather description:", data.weather[0].description)

    return {
      location: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed ? data.wind.speed * 3.6 : 0,
      feelsLike: data.main.feels_like,
      icon: data.weather[0].icon,
      country: data.sys.country,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      cloudCover: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export const fetchForecastData = async (query: string) => {
  try {
    const url = `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric`
    console.log("Fetching forecast from:", url.replace(API_KEY, "***"))

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Forecast API Error:", response.status, errorData)
      return getMockForecastData()
    }

    const data = await response.json()
    console.log("Forecast data received, items:", data.list?.length)

    if (!data.list || data.list.length === 0) {
      console.warn("No forecast data in response, returning mock data")
      return getMockForecastData()
    }

    // Process hourly data (next 24 hours)
    const hourlyData = data.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      condition: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind?.speed ? item.wind.speed * 3.6 : 0,
      feelsLike: item.main.feels_like,
    }))

    // Process daily data (next 7 days)
    const dailyForecasts = []
    const processedDates = new Set()

    for (const item of data.list) {
      const date = new Date(item.dt * 1000).toDateString()

      if (!processedDates.has(date) && dailyForecasts.length < 7) {
        processedDates.add(date)

        const dayItems = data.list.filter((forecast: any) => new Date(forecast.dt * 1000).toDateString() === date)

        const temperatures = dayItems.map((item: any) => item.main.temp)
        const minTemp = Math.min(...temperatures)
        const maxTemp = Math.max(...temperatures)

        dailyForecasts.push({
          date: new Date(item.dt * 1000).toISOString(),
          temperature: {
            min: minTemp,
            max: maxTemp,
          },
          condition: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
        })
      }
    }

    while (dailyForecasts.length < 7) {
      const mockDay = getMockForecastDay(dailyForecasts.length)
      dailyForecasts.push(mockDay)
    }

    return { hourly: hourlyData, daily: dailyForecasts }
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    console.warn("Returning mock forecast data due to error")
    return { hourly: getMockHourlyData(), daily: getMockForecastData() }
  }
}

// Enhanced weather data with UV and Air Quality simulation
export const fetchEnhancedWeatherData = async (query: string) => {
  const basicWeather = await fetchWeatherData(query)

  // Simulate UV Index based on conditions and time
  const uvIndex = simulateUVIndex(basicWeather.condition, basicWeather.cloudCover, basicWeather.description)

  // Simulate Air Quality Index based on location and weather
  const airQuality = simulateAirQuality(basicWeather.location, basicWeather.condition)

  console.log("Enhanced weather data for", basicWeather.location, ":", {
    condition: basicWeather.condition,
    description: basicWeather.description,
    uvIndex,
    aqi: airQuality.aqi,
  })

  return {
    ...basicWeather,
    uvIndex,
    airQuality: {
      aqi: airQuality.aqi,
      pollutants: airQuality.pollutants,
    },
    sunTimes: {
      sunrise: new Date(basicWeather.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      sunset: new Date(basicWeather.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    },
  }
}

// Helper function to get weather data by city name
export const getWeatherData = async (cityName: string) => {
  return await fetchEnhancedWeatherData(`q=${encodeURIComponent(cityName)}`)
}

// Helper function to get current location weather
export const getCurrentLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const weather = await fetchWeatherData(`lat=${latitude}&lon=${longitude}`)
            resolve(`${weather.location}, ${weather.country}`)
          } catch (error) {
            resolve("New York, US") // Fallback
          }
        },
        () => {
          resolve("New York, US") // Fallback if geolocation fails
        },
      )
    } else {
      resolve("New York, US") // Fallback if geolocation not supported
    }
  })
}

const simulateUVIndex = (condition: string, cloudCover: number, description: string) => {
  const hour = new Date().getHours()
  let baseUV = 0

  // Base UV based on time of day
  if (hour >= 6 && hour <= 18) {
    const midday = 12
    const hoursFromMidday = Math.abs(hour - midday)
    baseUV = Math.max(0, 10 - hoursFromMidday * 1.5)
  }

  // Adjust for weather conditions
  switch (condition) {
    case "Clear":
      baseUV *= 1.0
      break
    case "Clouds":
      if (description.includes("few")) baseUV *= 0.9
      else if (description.includes("scattered")) baseUV *= 0.7
      else if (description.includes("broken")) baseUV *= 0.5
      else baseUV *= 0.3
      break
    case "Rain":
    case "Drizzle":
      baseUV *= 0.2
      break
    case "Thunderstorm":
      baseUV *= 0.1
      break
    case "Snow":
      baseUV *= 1.3 // Snow reflects UV
      break
    case "Mist":
    case "Fog":
      baseUV *= 0.4
      break
    default:
      baseUV *= 0.6
  }

  // Adjust for cloud cover
  baseUV *= (100 - cloudCover) / 100

  return Math.round(Math.max(0, baseUV))
}

const simulateAirQuality = (location: string, condition: string) => {
  // Base AQI varies by city type and weather
  let baseAQI = 50

  // City-specific adjustments
  const cityLower = location.toLowerCase()
  if (cityLower.includes("beijing") || cityLower.includes("delhi") || cityLower.includes("mumbai")) {
    baseAQI = 120 + Math.random() * 80 // High pollution cities
  } else if (cityLower.includes("los angeles") || cityLower.includes("mexico")) {
    baseAQI = 80 + Math.random() * 60 // Moderate pollution cities
  } else if (cityLower.includes("reykjavik") || cityLower.includes("zurich") || cityLower.includes("stockholm")) {
    baseAQI = 20 + Math.random() * 30 // Clean cities
  } else {
    baseAQI = 40 + Math.random() * 60 // Average cities
  }

  // Weather condition adjustments
  switch (condition) {
    case "Clear":
      baseAQI *= 1.1 // Clear weather can trap pollutants
      break
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      baseAQI *= 0.7 // Rain cleans the air
      break
    case "Snow":
      baseAQI *= 0.8 // Snow helps clean air
      break
    case "Mist":
    case "Fog":
      baseAQI *= 1.3 // Poor visibility often means more pollution
      break
    case "Dust":
    case "Sand":
      baseAQI *= 1.8 // Dust storms increase particulates
      break
  }

  const finalAQI = Math.round(Math.max(10, Math.min(300, baseAQI)))

  return {
    aqi: finalAQI,
    pollutants: {
      pm25: Math.random() * 50 + finalAQI * 0.3,
      pm10: Math.random() * 100 + finalAQI * 0.5,
      o3: Math.random() * 80 + finalAQI * 0.2,
      no2: Math.random() * 60 + finalAQI * 0.25,
      co: Math.random() * 2 + finalAQI * 0.01,
    },
  }
}

const getMockHourlyData = () => {
  const mockData = []
  const now = new Date()

  for (let i = 0; i < 12; i++) {
    const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000)
    mockData.push({
      time: time.toISOString(),
      temperature: Math.round(20 + Math.random() * 10),
      condition: "partly cloudy",
      icon: "02d",
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 15),
      feelsLike: Math.round(20 + Math.random() * 10),
    })
  }

  return mockData
}

const getMockForecastData = () => {
  const mockData = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    mockData.push(getMockForecastDay(i, date))
  }

  return mockData
}

const getMockForecastDay = (index: number, date?: Date) => {
  const mockDate = date || new Date()
  if (!date) {
    mockDate.setDate(mockDate.getDate() + index)
  }

  const conditions = ["clear sky", "few clouds", "scattered clouds", "light rain", "light snow"]
  const icons = ["01d", "02d", "03d", "10d", "13d"]

  const conditionIndex = index % conditions.length

  return {
    date: mockDate.toISOString(),
    temperature: {
      min: Math.round(15 + Math.random() * 10),
      max: Math.round(20 + Math.random() * 15),
    },
    condition: conditions[conditionIndex],
    icon: icons[conditionIndex],
    humidity: Math.round(40 + Math.random() * 40),
  }
}
