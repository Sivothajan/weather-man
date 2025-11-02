import { useEffect, useState } from 'react';
import styles from '@/app/components/recommendations/Recommendations.module.css';

const Recommendations = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const ADVICE_CACHE_KEY = 'farming_recommendation_cache';
  const RETRY_CACHE_KEY = 'farming_recommendation_retry';

  const getCache = () => {
    try {
      const cacheData = localStorage.getItem(ADVICE_CACHE_KEY);
      if (!cacheData) return null;
      return JSON.parse(cacheData);
    } catch (err) {
      console.error('Error reading recommendation from cache:', err);
      return null;
    }
  };

  interface CacheData {
    data: string;
    timestamp: number;
    isError: boolean;
  }

  const setCache = (data: string, isError: boolean = false): void => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        isError,
      };
      localStorage.setItem(ADVICE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Error storing recommendation in cache:', err);
    }
  };

  const getRetryData = () => {
    try {
      const retryData = localStorage.getItem(RETRY_CACHE_KEY);
      if (!retryData) return { count: 0, lastAttempt: null };
      return JSON.parse(retryData);
    } catch (err) {
      console.error('Error reading retry data from cache:', err);
      return { count: 0, lastAttempt: null };
    }
  };

  interface RetryData {
    count: number;
    lastAttempt: number;
  }

  const updateRetryData = (count: number): void => {
    try {
      const retryData: RetryData = {
        count,
        lastAttempt: Date.now(),
      };
      localStorage.setItem(RETRY_CACHE_KEY, JSON.stringify(retryData));
    } catch (err) {
      console.error('Error updating retry data in cache:', err);
    }
  };

  interface CacheValidation {
    timestamp?: number;
    data?: string;
    isError?: boolean;
  }

  const isCacheValid = (cache: CacheValidation | null): boolean => {
    if (!cache || !cache.timestamp) return false;
    const oneDayMs: number = 24 * 60 * 60 * 1000;
    return Date.now() - cache.timestamp < oneDayMs;
  };

  interface DateComparison {
    lastAttemptTime: number | null;
  }

  const shouldResetRetryCount = (
    lastAttemptTime: DateComparison['lastAttemptTime']
  ): boolean => {
    if (!lastAttemptTime) return true;

    const lastAttemptDate = new Date(lastAttemptTime);
    const currentDate = new Date();

    return (
      lastAttemptDate.getDate() !== currentDate.getDate() ||
      lastAttemptDate.getMonth() !== currentDate.getMonth() ||
      lastAttemptDate.getFullYear() !== currentDate.getFullYear()
    );
  };

  useEffect(() => {
    async function fetchRecommendation() {
      const cache = getCache();
      const retryData = getRetryData();
      const resetRetry = shouldResetRetryCount(retryData.lastAttempt);
      const currentRetryCount = resetRetry ? 0 : retryData.count;

      if (isCacheValid(cache) && !cache.isError) {
        setRecommendation(cache.data);
        setLoading(false);
        return;
      }

      if (!resetRetry && currentRetryCount >= 5 && cache?.isError) {
        setRecommendation('');
        setError(
          `Exceeded 5 attempts to get recommendation. Please try again tomorrow. (${currentRetryCount} attempts)`
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/actions/recommendations`);
        if (!res.ok) throw new Error('Failed to fetch recommendation');
        const data = await res.json();

        if (data.type === 'message' && data.content) {
          setRecommendation(data.content);
          setCache(data.content, false);
          updateRetryData(0);
        } else if (data.type === 'error' && data.error) {
          const errorMsg =
            data.error.message || 'Error getting farming recommendation.';
          setError(errorMsg);
          setCache(errorMsg, true);
          const newRetryCount = currentRetryCount + 1;
          setRetryCount(newRetryCount);
          updateRetryData(newRetryCount);

          if (retryCount >= 5) {
            setError(
              `Exceeded 5 attempts to get recommendation. Please try again tomorrow. (${retryCount} attempts)`
            );
          }
        } else {
          console.warn('Unexpected response format:', data);
          const errorMsg = 'Received unexpected data format from server.';
          setError(errorMsg);
          setCache(errorMsg, true);
          const newRetryCount = currentRetryCount + 1;
          setRetryCount(newRetryCount);
          updateRetryData(newRetryCount);

          if (newRetryCount >= 5) {
            setError(
              `Exceeded 5 attempts to get recommendation. Please try again tomorrow. (${newRetryCount} attempts)`
            );
          }
        }
      } catch (err) {
        console.error('Error fetching farming recommendation:', err);
        const errorMsg =
          'Could not load recommendation. Please try again later.';
        setError(errorMsg);
        setCache(errorMsg, true);
        const newRetryCount = currentRetryCount + 1;
        setRetryCount(newRetryCount);
        updateRetryData(newRetryCount);

        if (newRetryCount >= 5) {
          setError(
            `Exceeded 5 attempts to get recommendation. Please try again tomorrow. (${newRetryCount} attempts)`
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendation();
  }, []);

  return (
    <div className={styles.overviewCard}>
      <div className={styles.cardHeader}>
        <h2>Farming Recommendation</h2>
      </div>
      <div className={styles.cardContent}>
        {loading && <p>Loading recommendation...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <div
            className={styles.recommendationText}
            dangerouslySetInnerHTML={{ __html: recommendation }}
          />
        )}
      </div>
    </div>
  );
};

export default Recommendations;
