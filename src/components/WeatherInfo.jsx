import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import './WeatherInfo.css';

const WeatherInfo = ({ weather }) => {
  if (!weather || !weather.weather || !weather.weather[0]) {
    return null;
  }

  const weatherCondition = weather.weather[0].main;
  const description = weather.weather[0].description;
  const icon = weather.weather[0].icon;
  const isNight = icon.includes('n');

  const getWeatherTheme = () => {
    const condition = weatherCondition.toLowerCase();
    
    switch (condition) {
      case 'clear':
        return isNight ? 'Clear Night Sky' : 'Sunny Day';
      case 'clouds':
        return 'Cloudy Atmosphere';
      case 'rain':
        return 'Rainy Weather';
      case 'drizzle':
        return 'Light Drizzle';
      case 'thunderstorm':
        return 'Thunderstorm';
      case 'snow':
        return 'Snowy Weather';
      case 'mist':
      case 'fog':
        return 'Misty Conditions';
      default:
        return 'Current Weather';
    }
  };

  return (
    <motion.div 
      className="weather-info-badge"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="weather-theme-indicator">
        <Palette size={16} />
        <span>{getWeatherTheme()}</span>
      </div>
      <div className="weather-description">
        {description}
      </div>
    </motion.div>
  );
};

export default WeatherInfo;
