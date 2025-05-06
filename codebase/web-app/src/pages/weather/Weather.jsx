import React, { useState, useEffect } from "react";
import styles from "./Weather.module.css";

const API_URL = "https://API_URL";

function Weather() {
  const [sensorReadings, setSensorReadings] = useState([]);
  const [farmingAdvice, setFarmingAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adviceError, setAdviceError] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/get`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSensorReadings(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch sensor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  useEffect(() => {
    const fetchFarmingAdvice = async () => {
      setAdviceError(null);
      try {
        const response = await fetch(`${API_URL}/farming-advice`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setFarmingAdvice(text);
      } catch (err) {
        setAdviceError(err);
        console.error("Failed to fetch farming advice:", err);
      }
    };

    fetchFarmingAdvice();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading sensor data and farming advice...</p>
      </div>
    );
  }

  if (error || adviceError) {
    return (
      <div className={styles.container}>
        {error && (
          <p className={styles.error}>
            Error loading sensor data: {error.message}
          </p>
        )}
        {adviceError && (
          <p className={styles.error}>
            Error loading farming advice: {adviceError.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Recent Sensor Readings</h2>
      {sensorReadings.length > 0 ? (
        <div className={styles.sensorReadings}>
          {sensorReadings.map((reading, index) => (
            <div key={index} className={styles.reading}>
              <p>Timestamp: {new Date(reading.timestamp).toLocaleString()}</p>
              <p>Temperature: {reading.temperature}°C</p>
              <p>Humidity: {reading.humidity}%</p>
              <p>Soil Moisture: {reading.soil_moisture}</p>
              <p>Rain: {reading.rain}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No sensor data available.</p>
      )}

      {farmingAdvice && (
        <div className={styles.farmingAdvice}>
          <h3>Farming Advice</h3>
          <p>{farmingAdvice}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
