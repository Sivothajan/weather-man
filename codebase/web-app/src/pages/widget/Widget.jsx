import { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { weatherCache } from "../../utils/weatherCache";
import { Line } from "react-chartjs-2";
import styles from "./Widget.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

function Widget({ isFullscreen }) {
  const [weatherData, setWeatherData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [farmingAdvice, setFarmingAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter data to get entries 5 minutes apart
  const filterDataByInterval = (data, minutesInterval) => {
    if (!data || data.length === 0) return [];

    const filtered = [];
    let lastTimestamp = null;

    for (const entry of data.reverse()) {
      const currentTime = new Date(entry.timestamp);

      if (
        !lastTimestamp ||
        currentTime - lastTimestamp >= minutesInterval * 60 * 1000
      ) {
        filtered.push(entry);
        lastTimestamp = currentTime;
      }
    }

    return filtered.slice(0, 24).reverse(); // Keep only last 24 entries
  };

  const fetchData = useCallback(async () => {
    try {
      // Check cache first
      if (weatherCache.isValid()) {
        const cachedData = weatherCache.get();
        setWeatherData(cachedData.current);
        setHistoricalData(filterDataByInterval(cachedData.historical, 5));
        setFarmingAdvice(cachedData.advice);
        setLoading(false);
        return;
      }

      // Fetch current data
      const currentResponse = await fetch("/api/get/1");
      const currentData = await currentResponse.json();

      // Fetch more data than needed to ensure we have enough after filtering
      const historicalResponse = await fetch("/api/get/100"); // Fetch more to ensure we have enough after filtering
      const historicalData = await historicalResponse.json();

      // Fetch farming advice
      const adviceResponse = await fetch("/api/farming-advice");
      const adviceData = await adviceResponse.json();

      if (currentData.success && currentData.data.length > 0) {
        const current = currentData.data[0];
        const historical = filterDataByInterval(historicalData.data, 5);
        const advice = adviceData.advice;

        // Update state
        setWeatherData(current);
        setHistoricalData(historical);
        setFarmingAdvice(advice);

        // Cache the data
        weatherCache.set({
          current,
          historical,
          advice,
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

  const chartData = {
    labels: historicalData
      .map((entry) => {
        const date = new Date(entry.timestamp);
        return date.toLocaleTimeString();
      })
      .reverse(),
    datasets: [
      {
        fill: true,
        label: "Temperature (°C)",
        data: historicalData.map((entry) => entry.temperature).reverse(),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        fill: true,
        label: "Humidity (%)",
        data: historicalData.map((entry) => entry.humidity).reverse(),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weather Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

      <div className={styles.chartSection}>
        <Line options={chartOptions} data={chartData} />
      </div>

      <div className={styles.adviceSection}>
        <h2>Farming Insights</h2>
        <p>{farmingAdvice}</p>
      </div>

      <div className={styles.timestamp}>
        Last updated: {new Date(weatherData.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export default Widget;
