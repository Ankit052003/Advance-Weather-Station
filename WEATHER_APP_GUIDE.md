# Weather App - Complete Setup Guide

## Project Overview
A modern, responsive weather application built with React, Vite, and Framer Motion. Features dynamic weather-based backgrounds, smooth animations, and real-time weather data from OpenWeatherMap API.

## Project Structure
```
weatherapp/
├── public/
│   ├── vite.svg
│   └── images/
│       └── weather/               # Add your weather images here
│           ├── clear-day.jpg
│           ├── clear-night.jpg
│           ├── partly-cloudy-day.jpg
│           ├── partly-cloudy-night.jpg
│           ├── cloudy.jpg
│           ├── rain.jpg
│           ├── light-rain.jpg
│           ├── heavy-rain.jpg
│           ├── drizzle.jpg
│           ├── thunderstorm.jpg
│           ├── snow.jpg
│           ├── mist.jpg
│           └── default.jpg
├── src/
│   ├── components/
│   │   ├── WeatherBackground.jsx  # Dynamic background system
│   │   ├── WeatherBackground.css
│   │   ├── WeatherCard.jsx        # Main weather display
│   │   ├── WeatherCard.css
│   │   ├── SearchBar.jsx          # Location search input
│   │   └── SearchBar.css
│   ├── services/
│   │   └── weatherService.js      # OpenWeatherMap API integration
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   ├── index.css                  # Base styles
│   └── main.jsx                   # React app entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
├── index.html                     # HTML template
└── README.md                      # Project documentation
```

## Technologies Used
- **React 19.1.0**: Frontend framework
- **Vite 7.0.6**: Build tool and development server
- **Framer Motion 12.23.11**: Animation library
- **Lucide React**: Modern icon library
- **OpenWeatherMap API**: Weather data source

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key

### Installation
1. Navigate to the project directory:
   ```powershell
   cd "c:\Users\KIIT\Desktop\weather-app2\weatherapp"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and go to: `http://localhost:5173`

## Weather Background System

### Current Setup
The app currently uses beautiful gradient backgrounds that change based on weather conditions. The `WeatherBackground.jsx` component is configured to support both gradients and custom images.

### Adding Custom Weather Images

#### Step 1: Create Image Directory
Create the following folder structure in your `public` directory:
```
public/
└── images/
    └── weather/
```

#### Step 2: Add Weather Images
Place your weather images in `public/images/weather/` with these exact filenames:

- `clear-day.jpg` - Sunny/clear weather during day
- `clear-night.jpg` - Clear weather at night
- `partly-cloudy-day.jpg` - Partly cloudy during day
- `partly-cloudy-night.jpg` - Partly cloudy at night
- `cloudy.jpg` - Overcast/cloudy weather
- `rain.jpg` - Regular rain
- `light-rain.jpg` - Light rain/showers
- `heavy-rain.jpg` - Heavy rain/downpour
- `drizzle.jpg` - Light drizzle
- `thunderstorm.jpg` - Thunderstorms/storms
- `snow.jpg` - Snow/winter weather
- `mist.jpg` - Mist/fog/haze
- `default.jpg` - Fallback image

#### Step 3: Image Requirements
- **Format**: JPG, PNG, or WebP
- **Resolution**: 1920x1080 or higher recommended
- **Aspect Ratio**: 16:9 works best
- **File Size**: Keep under 2MB each for optimal loading

#### Step 4: Enable Custom Images
The custom image system is already enabled in `WeatherBackground.jsx`. If you want to disable it and use only gradients, change this line:
```javascript
const useCustomImages = false; // Change to false to use only gradients
```

### Weather Condition Mapping
The app automatically maps OpenWeatherMap conditions to backgrounds:

| OpenWeatherMap Condition | Background Used |
|-------------------------|----------------|
| Clear (day) | clear-day |
| Clear (night) | clear-night |
| Few/Scattered clouds (day) | partly-cloudy-day |
| Few/Scattered clouds (night) | partly-cloudy-night |
| Cloudy/Overcast | cloudy |
| Light rain | light-rain |
| Regular rain | rain |
| Heavy rain | heavy-rain |
| Drizzle | drizzle |
| Thunderstorm | thunderstorm |
| Snow | snow |
| Mist/Fog/Haze | mist |
| Unknown/Error | default |

## API Configuration

### OpenWeatherMap API
The app uses OpenWeatherMap API for weather data. The API key is already configured:
- API Key: `247592d65a75014f0e04cb815197dea4`
- Base URL: `https://api.openweathermap.org/data/2.5/weather`

### Changing API Key
To use your own API key, edit `src/services/weatherService.js`:
```javascript
const API_KEY = 'your-new-api-key-here';
```

## Features

### 🌤️ Weather Display
- Current temperature and conditions
- Location name and country
- Weather description
- Real-time data updates

### 🎨 Dynamic Backgrounds
- Weather-based background changes
- Smooth transitions between conditions
- Support for custom images or gradients
- Day/night variations

### 🔍 Location Search
- Search weather by city name
- Auto-suggestion and validation
- Error handling for invalid locations

### ✨ Animations
- Smooth page transitions
- Loading animations
- Weather particle effects
- Glassmorphism UI effects

## Available Scripts

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **Blank page on load**
   - Ensure development server is running on `http://localhost:5173`
   - Check browser console for JavaScript errors
   - Verify all dependencies are installed

2. **Weather data not loading**
   - Check internet connection
   - Verify OpenWeatherMap API key is valid
   - Check browser network tab for API request errors

3. **Custom images not showing**
   - Verify images are in correct `public/images/weather/` directory
   - Check image filenames match exactly (case-sensitive)
   - Ensure `useCustomImages` is set to `true`

4. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for any missing dependencies in package.json

### Development Tips

1. **Hot Reload**: Changes to code will automatically refresh the browser
2. **Console Logs**: Check browser console for weather data and errors
3. **Network Tab**: Monitor API requests in browser dev tools
4. **Mobile Testing**: Test responsiveness on different screen sizes

## Customization

### Styling
- Edit CSS files in `src/components/` for component-specific styles
- Modify `src/App.css` for global styles
- Update `src/index.css` for base styling

### Adding Features
- Extend `weatherService.js` for additional API endpoints
- Add new components in `src/components/`
- Modify `App.jsx` to integrate new features

### Background Gradients
If not using custom images, you can modify the gradient colors in `WeatherBackground.jsx`:
```javascript
const weatherGradients = {
  'clear-day': 'your-custom-gradient-here',
  // ... other gradients
};
```

## Support
For issues or questions:
1. Check the troubleshooting section above
2. Verify all file paths and configurations
3. Test with the development server running
4. Check browser console for error messages

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**License**: MIT
