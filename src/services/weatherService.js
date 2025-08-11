// Note: You'll need to get a free API key from OpenWeatherMap
// Visit: https://openweathermap.org/api and sign up for a free account
const API_KEY = '247592d65a75014f0e04cb815197dea4'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getWeatherByCity(cityName) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid. Please check your configuration.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key is invalid. Please check your configuration.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location access denied. Please enable location services.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information unavailable.'));
              break;
            case error.TIMEOUT:
              reject(new Error('Location request timed out.'));
              break;
            default:
              reject(new Error('An unknown error occurred while getting location.'));
              break;
          }
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    });
  }
}

export default new WeatherService();
