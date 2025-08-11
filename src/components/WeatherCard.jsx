import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';
import './WeatherCard.css';

const WeatherCard = ({ weather }) => {
  const {
    name,
    main,
    weather: weatherData,
    wind,
    visibility,
    sys,
    timezone
  } = weather;

  const weatherInfo = weatherData[0];
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  
  // Convert sunrise/sunset times to local time
  const sunriseTime = new Date((sys.sunrise + timezone) * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
  
  const sunsetTime = new Date((sys.sunset + timezone) * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="weather-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="weather-header" variants={itemVariants}>
        <div className="location">
          <MapPin size={20} />
          <h2>{name}, {sys.country}</h2>
        </div>
        <div className="current-time">
          {new Date().toLocaleDateString()}
        </div>
      </motion.div>

      <motion.div className="weather-main" variants={itemVariants}>
        <div className="temperature-section">
          <img 
            src={getWeatherIcon(weatherInfo.icon)} 
            alt={weatherInfo.description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-main">{temperature}°</span>
            <div className="temp-details">
              <p className="weather-description">{weatherInfo.description}</p>
              <p className="feels-like">Feels like {feelsLike}°C</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="weather-details" variants={itemVariants}>
        <div className="detail-grid">
          <motion.div className="detail-item" variants={itemVariants}>
            <Thermometer size={20} />
            <div>
              <span className="detail-label">Min / Max</span>
              <span className="detail-value">
                {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
              </span>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <Droplets size={20} />
            <div>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{main.humidity}%</span>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <Wind size={20} />
            <div>
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{wind.speed} m/s</span>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <Eye size={20} />
            <div>
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <Sunrise size={20} />
            <div>
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{sunriseTime}</span>
            </div>
          </motion.div>

          <motion.div className="detail-item" variants={itemVariants}>
            <Sunset size={20} />
            <div>
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{sunsetTime}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherCard;
