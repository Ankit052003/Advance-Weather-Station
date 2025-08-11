import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SimpleWeatherBackground = ({ weatherData }) => {
  const [currentBg, setCurrentBg] = useState('default');

  // Simple gradients for testing
  const weatherGradients = {
    'clear': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #fdcb6e 70%, #e17055 100%)',
    'clouds': 'linear-gradient(135deg, #ddd 0%, #636e72 50%, #b2bec3 100%)',
    'rain': 'linear-gradient(135deg, #636e72 0%, #2d3436 30%, #74b9ff 70%, #0984e3 100%)',
    'snow': 'linear-gradient(135deg, #ddd 0%, #fff 30%, #f8f9fa 70%, #ddd 100%)',
    'default': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #fdcb6e 70%, #e17055 100%)'
  };

  useEffect(() => {
    if (weatherData && weatherData.weather && weatherData.weather[0]) {
      const condition = weatherData.weather[0].main.toLowerCase();
      setCurrentBg(condition);
    } else {
      setCurrentBg('default');
    }
  }, [weatherData]);

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
    background: weatherGradients[currentBg] || weatherGradients.default
  };

  return (
    <motion.div
      style={backgroundStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default SimpleWeatherBackground;
