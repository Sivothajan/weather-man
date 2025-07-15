import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { weatherCache } from "../../utils/weatherCache";
import styles from "./Widget.module.css";

function Widget({ isFullscreen }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Check cache first
      if (weatherCache.isValid()) {
        const cachedData = weatherCache.get();
        setWeatherData(cachedData.current);
        setLoading(false);
        return;
      }

      // Fetch current data
      const currentResponse = await fetch("/api/get/1");
      const currentData = await currentResponse.json();

      if (currentData.success && currentData.data.length > 0) {
        const current = currentData.data[0];

        // Update state
        setWeatherData(current);

        // Cache the data
        weatherCache.set({
          current,
        });
      } else {
        throw new Error("No data available");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className={styles.widgetContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.widgetContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  const getWeatherClass = () => {
    if (!weatherData) return "";
    if (weatherData.rain) return styles.rainyWeather;
    if (weatherData.temperature > 30) return styles.hotWeather;
    if (weatherData.temperature < 15) return styles.coldWeather;
    return styles.normalWeather;
  };

  const getFullscreenStyles = () => {
    if (!isFullscreen) return {};

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate optimal scaling based on screen dimensions
    const scale = Math.min(
      screenWidth / 1200, // Base width
      screenHeight / 800, // Base height
    );

    return {
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      margin: "auto",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  return (
    <div
      className={`${styles.widgetContainer} ${getWeatherClass()} ${isFullscreen ? styles.fullscreenMode : ""}`}
      style={getFullscreenStyles()}
    >
      <div className={styles.currentWeather}>
        <h1>Current Weather</h1>
        <div className={styles.weatherGrid}>
          <div className={styles.weatherCard}>
            <i className={styles.temperatureIcon}></i>
            <h2>{weatherData.temperature}°C</h2>
            <p>Temperature</p>
          </div>
          <div className={styles.weatherCard}>
            <i className={styles.humidityIcon}></i>
            <h2>{weatherData.humidity}%</h2>
            <p>Humidity</p>
          </div>
          <div className={styles.weatherCard}>
            <i className={styles.soilIcon}></i>
            <h2>{weatherData.soil_moisture}%</h2>
            <p>Soil Moisture</p>
          </div>
          <div className={styles.weatherCard}>
            <i className={styles.rainIcon}></i>
            <h2>{weatherData.rain ? "Yes" : "No"}</h2>
            <p>Rain</p>
          </div>
        </div>
      </div>

      <div className={styles.footerSection}>
        <div className={styles.timestamp}>
          Last updated: {new Date(weatherData.timestamp).toLocaleString()}
        </div>
        <Link to="/dashboard" className={styles.dashboardButton}>
          <span className={styles.dashboardIcon}>📊</span>
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Widget;
