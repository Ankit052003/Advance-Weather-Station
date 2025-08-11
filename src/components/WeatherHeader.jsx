import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import './WeatherHeader.css';

const WeatherHeader = ({ weather }) => {
  const getWeatherIcon = () => {
    if (!weather || !weather.weather || !weather.weather[0]) {
      return <Cloud size={32} />;
    }

    const condition = weather.weather[0].main.toLowerCase();
    
    switch (condition) {
      case 'clear':
        return <Sun size={32} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={32} />;
      case 'snow':
        return <CloudSnow size={32} />;
      default:
        return <Cloud size={32} />;
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.header 
      className="weather-header"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="header-content">
        <motion.div 
          className="app-logo"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {getWeatherIcon()}
          <h1>WeatherLux</h1>
        </motion.div>
        
        <motion.div 
          className="current-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {getCurrentTime()}
        </motion.div>
      </div>
      
      <motion.div 
        className="header-decoration"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.header>
  );
};

export default WeatherHeader;
