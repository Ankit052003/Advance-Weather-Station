# Advanced Weather Station

A comprehensive and professional weather forecasting application built with modern web technologies. This application provides real-time weather data, interactive maps, detailed forecasts, and advanced meteorological insights.

![Advanced Weather Station](https://github.com/user-attachments/assets/78cf801d-f05c-467b-aa16-c57f77a5e5cd)

## Features

### Core Weather Features
- 🌤️ **Real-time Weather Data** - Current conditions and live updates
- 📅 **Extended Forecasts** - 7-day detailed weather predictions
- 🗺️ **Interactive Weather Maps** - Visual weather patterns and radar
- 📊 **Weather Trends** - Historical data analysis and charts
- 📍 **Multiple Locations** - Support for worldwide weather data

### Advanced Features
- 🎯 **AI-Powered Accuracy** - Enhanced forecast precision with machine learning
- 🌬️ **Air Quality Index** - Real-time air pollution monitoring
- ☀️ **UV Index Tracking** - Sun exposure and safety recommendations
- 🚨 **Weather Alerts** - Severe weather notifications and warnings
- 🎤 **Voice Assistant** - Voice-controlled weather queries
- ⭐ **Favorites System** - Save and manage favorite locations
- 🌡️ **Weather Gauges** - Visual temperature, humidity, and pressure displays
- 🏃 **Activity Suggestions** - Weather-based activity recommendations

### User Experience
- 🌙 **Dark/Light Theme** - Customizable interface themes
- 📱 **Responsive Design** - Optimized for all device sizes
- 🔍 **Smart Search** - Intelligent location search with suggestions
- 📊 **Data Visualization** - Interactive charts and graphs
- 🎨 **Modern UI** - Clean, intuitive, and professional interface

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart library
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ankit052003/advanced-weather-station.git
cd advanced-weather-station
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your API keys:
# NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

4. Get your OpenWeather API key:
   - Visit [OpenWeather API](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key
   - Add it to your `.env.local` file

5. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**Important**: Never commit your `.env.local` file to version control. It contains sensitive information.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
advanced-weather-station/
├── app/                    # Next.js App Router pages
│   ├── weather-map/       # Interactive weather maps
│   ├── weather-metrics/   # Detailed metrics and gauges
│   ├── weather-stations/  # Weather station data
│   └── weather-trends/    # Trends and analytics
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── weather/          # Weather-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── utils/                # Helper functions and API integrations
└── public/               # Static assets
```

## API Integration

This application integrates with various weather APIs to provide comprehensive meteorological data:
- Real-time weather conditions
- Extended forecasts
- Historical weather data
- Air quality information
- Weather alerts and warnings


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by various meteorological services
- Icons by Lucide React
- UI components powered by Radix UI
- Built with Next.js and modern web technologies

---

**Author**: Ankit Kumar
**Version**: 1.0.0  
**Last Updated**: July 2025

