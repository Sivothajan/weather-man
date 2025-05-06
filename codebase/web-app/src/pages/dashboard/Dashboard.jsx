import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Graph from "../../components/graph/Graph";
import Advice from "../../components/advice/Advice";
import { getWeatherData } from "./scripts/getWeatherData";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const data = await getWeatherData();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Read and normalize the refresh enabled flag
    const refreshEnabled =
      import.meta.env.VITE_WEATHER_REFRESH_ENABLED === undefined ||
      import.meta.env.VITE_WEATHER_REFRESH_ENABLED === "true";

    if (refreshEnabled) {
      const refreshInterval =
        Number(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL) || 60000;
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Dashboard</h1>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div
                className={styles.skeleton}
                style={{ width: "50%", height: "1.5em" }}
              ></div>
            </div>
            <div className={styles.cardContent}>
              <div
                className={styles.skeleton}
                style={{ width: "100%", height: "300px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>
          Error: {error?.message || "Failed to load dashboard data."}
        </p>
      </div>
    );
  }

  // Helper to format refresh interval nicely
  function formatRefreshInterval(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""}`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return (
        `${minutes} minute${minutes !== 1 ? "s" : ""}` +
        (seconds > 0 ? ` ${seconds} second${seconds !== 1 ? "s" : ""}` : "")
      );
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      let result = `${hours} hour${hours !== 1 ? "s" : ""}`;
      if (minutes > 0)
        result += ` ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      if (seconds > 0)
        result += ` ${seconds} second${seconds !== 1 ? "s" : ""}`;
      return result;
    }
  }

  const refreshMs =
    Number(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL) || 60000;

  return (
    <div className={styles.container}>
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        Home
      </button>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles.overview}>
        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h2>Overview</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.overviewText}>
              Welcome to the Weather Man Dashboard! Here you can monitor
              real-time weather data from the Weather-Man IoT Device. The graphs
              below provide a visual representation of the sensor readings.
            </p>
            <p className={styles.overviewText}>
              The data is updated every {formatRefreshInterval(refreshMs)}.
            </p>
          </div>
        </div>
      </div>
      <Advice />
      <div className={styles.graphSection}>
        <div className={styles.graphCard}>
          <div className={styles.cardHeader}>
            <h2>Sensor Data</h2>
          </div>
          <div className={styles.cardContent}>
            {weatherData && <Graph jsonData={weatherData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
