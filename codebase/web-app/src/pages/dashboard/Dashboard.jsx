import React, { useState, useEffect } from "react";
import Graph from "../../components/graph/Graph";
import Advice from "../../components/advice/Advice";
import styles from "./Dashboard.module.css";

const fetchData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const dummyData = [
    {
      temperature: 28,
      humidity: 75,
      soil_moisture: 40,
      soil_raw: 600,
      rain: 0,
      rain_raw: 300,
      fire: 0,
      timestamp: "2024-07-24T00:00:00Z",
    },
    {
      temperature: 29,
      humidity: 78,
      soil_moisture: 42,
      soil_raw: 610,
      rain: 0,
      rain_raw: 295,
      fire: 0,
      timestamp: "2024-07-24T01:00:00Z",
    },
    {
      temperature: 27,
      humidity: 80,
      soil_moisture: 45,
      soil_raw: 620,
      rain: 1,
      rain_raw: 200,
      fire: 0,
      timestamp: "2024-07-24T02:00:00Z",
    },
    {
      temperature: 26,
      humidity: 82,
      soil_moisture: 48,
      soil_raw: 630,
      rain: 1,
      rain_raw: 180,
      fire: 1,
      timestamp: "2024-07-24T03:00:00Z",
    },
    {
      temperature: 25,
      humidity: 85,
      soil_moisture: 50,
      soil_raw: 640,
      rain: 1,
      rain_raw: 170,
      fire: 0,
      timestamp: "2024-07-24T04:00:00Z",
    },
    {
      temperature: 27,
      humidity: 83,
      soil_moisture: 47,
      soil_raw: 625,
      rain: 0,
      rain_raw: 290,
      fire: 0,
      timestamp: "2024-07-24T05:00:00Z",
    },
    {
      temperature: 28,
      humidity: 80,
      soil_moisture: 44,
      soil_raw: 615,
      rain: 0,
      rain_raw: 310,
      fire: 0,
      timestamp: "2024-07-24T06:00:00Z",
    },
    {
      temperature: 30,
      humidity: 78,
      soil_moisture: 42,
      soil_raw: 610,
      rain: 0,
      rain_raw: 320,
      fire: 0,
      timestamp: "2024-07-24T07:00:00Z",
    },
    {
      temperature: 31,
      humidity: 75,
      soil_moisture: 40,
      soil_raw: 605,
      rain: 0,
      rain_raw: 325,
      fire: 0,
      timestamp: "2024-07-24T08:00:00Z",
    },
    {
      temperature: 32,
      humidity: 72,
      soil_moisture: 38,
      soil_raw: 600,
      rain: 0,
      rain_raw: 330,
      fire: 0,
      timestamp: "2024-07-24T09:00:00Z",
    },
    {
      temperature: 33,
      humidity: 70,
      soil_moisture: 35,
      soil_raw: 595,
      rain: 0,
      rain_raw: 335,
      fire: 0,
      timestamp: "2024-07-24T10:00:00Z",
    },
    {
      temperature: 32,
      humidity: 72,
      soil_moisture: 37,
      soil_raw: 598,
      rain: 0,
      rain_raw: 332,
      fire: 0,
      timestamp: "2024-07-24T11:00:00Z",
    },
    {
      temperature: 30,
      humidity: 74,
      soil_moisture: 39,
      soil_raw: 602,
      rain: 0,
      rain_raw: 328,
      fire: 0,
      timestamp: "2024-07-24T12:00:00Z",
    },
  ];
  return dummyData;
};

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await fetchData();
        setWeatherData(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.overview}>
        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h2>Overview</h2>
          </div>
          <div className={styles.cardContent}>
            <p>
              Welcome to the Weather Man Dashboard! Here you can monitor
              real-time weather data from the Weather-Man IoT Device. The graphs
              below provide a visual representation of the sensor readings.
            </p>
          </div>
        </div>
        <Advice />
      </div>

      <div className={styles.graphSection}>
        <div className={styles.graphCard}>
          <div className={styles.cardHeader}>
            <h2>Sensor Data</h2>
          </div>
          <div className={styles.cardContent}>
            {weatherData && <Graph csvData={weatherData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
