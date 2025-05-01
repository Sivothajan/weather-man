import React, { useState, useEffect } from 'react';
import Graph from '../../components/graph/Graph'; 
import styles from './Dashboard.module.css';

const fetchData = async () => {
  

  await new Promise((resolve) => setTimeout(resolve, 1500));
  const dummyData = [
    { temperature: 28, humidity: 75, soil_moisture: 40, rain: 0, timestamp: '2024-07-24T00:00:00Z' },
    { temperature: 29, humidity: 78, soil_moisture: 42, rain: 0, timestamp: '2024-07-24T01:00:00Z' },
    { temperature: 27, humidity: 80, soil_moisture: 45, rain: 1, timestamp: '2024-07-24T02:00:00Z' },
    { temperature: 26, humidity: 82, soil_moisture: 48, rain: 5, timestamp: '2024-07-24T03:00:00Z' },
    { temperature: 25, humidity: 85, soil_moisture: 50, rain: 2, timestamp: '2024-07-24T04:00:00Z' },
    { temperature: 27, humidity: 83, soil_moisture: 47, rain: 0, timestamp: '2024-07-24T05:00:00Z' },
    { temperature: 28, humidity: 80, soil_moisture: 44, rain: 0, timestamp: '2024-07-24T06:00:00Z' },
    { temperature: 30, humidity: 78, soil_moisture: 42, rain: 0, timestamp: '2024-07-24T07:00:00Z' },
    { temperature: 31, humidity: 75, soil_moisture: 40, rain: 0, timestamp: '2024-07-24T08:00:00Z' },
    { temperature: 32, humidity: 72, soil_moisture: 38, rain: 0, timestamp: '2024-07-24T09:00:00Z' },
    { temperature: 33, humidity: 70, soil_moisture: 35, rain: 0, timestamp: '2024-07-24T10:00:00Z' },
    { temperature: 32, humidity: 72, soil_moisture: 37, rain: 0, timestamp: '2024-07-24T11:00:00Z' },
    { temperature: 30, humidity: 74, soil_moisture: 39, rain: 0, timestamp: '2024-07-24T12:00:00Z' },
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
              <div className={styles.skeleton} style={{ width: '50%', height: '1.5em' }}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.skeleton} style={{ width: '100%', height: '300px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Error: {error?.message || 'Failed to load dashboard data.'}</p>
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
              Welcome to your Weather Man Dashboard! Here you can monitor real-time
              weather data from the Weather-Man IoT Device. The graph below provides
              a visual representation of the sensor readings.
            </p>
          </div>
        </div>
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