import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherBackground from './components/WeatherBackground';
import weatherService from './services/weatherService';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (cityName) => {
    console.log('Searching for:', cityName);
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await weatherService.getWeatherByCity(cityName);
      console.log('Weather data received:', weatherData);
      setWeather(weatherData);
    } catch (err) {
      console.error('Weather error:', err);
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { lat, lon } = await weatherService.getCurrentLocation();
      const weatherData = await weatherService.getWeatherByCoordinates(lat, lon);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Load default weather on first load
  useEffect(() => {
    console.log('App mounted, loading default weather...');
    handleSearch('New York');
  }, []);

  return (
    <div className="app">
      <WeatherBackground weatherData={weather} />
      
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          style={{
            color: 'white', 
            textAlign: 'center', 
            marginBottom: '2rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '2.5rem',
            fontWeight: '300',
            letterSpacing: '2px'
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          ☀️ Weather App
        </motion.h1>
        
        <SearchBar 
          onSearch={handleSearch}
          onGetLocation={handleGetLocation}
          loading={loading}
        />

        <div className="content">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: 'white', 
                  textAlign: 'center', 
                  fontSize: '1.2rem',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌤️</div>
                Loading weather data...
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: '#ff6b6b', 
                  textAlign: 'center', 
                  fontSize: '1.2rem',
                  background: 'rgba(255,107,107,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,107,107,0.3)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
                {error}
                <br />
                <motion.button 
                  onClick={() => handleSearch('New York')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem 1.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {weather && !loading && !error && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <WeatherCard weather={weather} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.footer 
          className="app-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '15px',
            color: 'rgba(255,255,255,0.8)'
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            🌍 Powered by OpenWeatherMap API | Made with ❤️ and React
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default App;
