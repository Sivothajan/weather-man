import { useState, useEffect } from 'react';
import Link from 'next/link';
import Graph from '@/app/components/graph/Graph';
import { getWeatherData } from '@/app/lib/client/getWeatherData';
import styles from '@/app/components/dashboard/Dashboard.module.css';
import config from '@/app/env/env.config';
import Recommendations from '@/app/components/recommendations/Recommendations';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const fetchData = async () => {
      try {
        const data = await getWeatherData();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('An unknown error occurred')
        );
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (config.NEXT_PUBLIC_WEATHER_REFRESH_ENABLED) {
      const refreshInterval =
        config.NEXT_PUBLIC_WEATHER_REFRESH_INTERVAL || 60000;
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
                style={{ width: '50%', height: '1.5em' }}
              ></div>
            </div>
            <div className={styles.cardContent}>
              <div
                className={styles.skeleton}
                style={{ width: '100%', height: '300px' }}
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
          Error: {error?.message || 'Failed to load dashboard data.'}
        </p>
      </div>
    );
  }

  function formatRefreshInterval(ms: number): string {
    const totalSeconds: number = Math.floor(ms / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`;
    } else if (totalSeconds < 3600) {
      const minutes: number = Math.floor(totalSeconds / 60);
      const seconds: number = totalSeconds % 60;
      return (
        `${minutes} minute${minutes !== 1 ? 's' : ''}` +
        (seconds > 0 ? ` ${seconds} second${seconds !== 1 ? 's' : ''}` : '')
      );
    } else {
      const hours: number = Math.floor(totalSeconds / 3600);
      const minutes: number = Math.floor((totalSeconds % 3600) / 60);
      const seconds: number = totalSeconds % 60;
      let result: string = `${hours} hour${hours !== 1 ? 's' : ''}`;
      if (minutes > 0)
        result += ` ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      if (seconds > 0)
        result += ` ${seconds} second${seconds !== 1 ? 's' : ''}`;
      return result;
    }
  }

  const refreshMs = config.NEXT_PUBLIC_WEATHER_REFRESH_INTERVAL || 60000;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeButton}>
        Home
      </Link>
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
      <Recommendations />
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
};

export default Dashboard;
