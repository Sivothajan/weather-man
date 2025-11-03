import { useEffect, useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import styles from '@/app/components/recommendations/Recommendations.module.css';

interface CacheData {
  data: string;
  timestamp: number;
  isError: boolean;
}

interface RetryData {
  count: number;
  lastAttempt: number;
  lastReset: number;
}

const Recommendations = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ADVICE_CACHE_KEY = 'farming_recommendation_cache';
  const RETRY_CACHE_KEY = 'farming_recommendation_retry';
  const RATE_LIMIT_MAX = 5;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  const getCache = useCallback((): CacheData | null => {
    try {
      const cacheData = localStorage.getItem(ADVICE_CACHE_KEY);
      if (!cacheData) return null;
      return JSON.parse(cacheData);
    } catch (err) {
      console.error('Error reading recommendation cache:', err);
      localStorage.removeItem(ADVICE_CACHE_KEY);
      return null;
    }
  }, []);

  const setCache = useCallback((data: string, isError = false): void => {
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
  }, []);

  const isCacheValid = useCallback(
    (cache: CacheData | null): boolean => {
      if (!cache || !cache.data || !cache.timestamp) return false;
      return Date.now() - cache.timestamp < CACHE_TTL_MS;
    },
    [CACHE_TTL_MS]
  );

  const getRetryData = useCallback((): RetryData => {
    try {
      const retryData = localStorage.getItem(RETRY_CACHE_KEY);
      if (!retryData)
        return { count: 0, lastAttempt: 0, lastReset: Date.now() };
      return JSON.parse(retryData);
    } catch (err) {
      console.error('Error reading retry data from cache:', err);
      localStorage.removeItem(RETRY_CACHE_KEY);
      return { count: 0, lastAttempt: 0, lastReset: Date.now() };
    }
  }, []);

  const updateRetryData = useCallback(
    (count: number, reset = false): void => {
      try {
        const now = Date.now();
        const existing = getRetryData();
        const retryData: RetryData = {
          count: reset ? 0 : count,
          lastAttempt: now,
          lastReset: reset ? now : existing.lastReset,
        };
        localStorage.setItem(RETRY_CACHE_KEY, JSON.stringify(retryData));
      } catch (err) {
        console.error('Error updating retry data in cache:', err);
      }
    },
    [getRetryData]
  );

  const isRateLimited = useCallback(
    (retryData: RetryData): boolean => {
      const now = Date.now();
      const resetNeeded = now - retryData.lastReset > ONE_DAY_MS;
      if (resetNeeded) {
        updateRetryData(0, true);
        return false;
      }
      return retryData.count >= RATE_LIMIT_MAX;
    },
    [updateRetryData, ONE_DAY_MS]
  );

  useEffect(() => {
    async function fetchRecommendation() {
      setLoading(true);
      setError('');

      const cache = getCache();
      const retryData = getRetryData();

      if (cache && isCacheValid(cache) && !cache.isError) {
        setRecommendation(cache.data);
        setLoading(false);
        return;
      }

      if (isRateLimited(retryData)) {
        if (cache?.data) {
          setRecommendation(cache.data);
          setError(`Daily limit reached. Showing last known recommendation.`);
        } else {
          setError(
            `Exceeded ${RATE_LIMIT_MAX} attempts today. Please try again tomorrow.`
          );
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/actions/recommendations`);
        if (!res.ok) throw new Error('Failed to fetch recommendation');
        const data = await res.json();

        if (data.type === 'message' && data.content) {
          const sanitized = DOMPurify.sanitize(data.content);
          setRecommendation(sanitized);
          setCache(sanitized, false);
          updateRetryData(0, true); // success → reset retry count
        } else {
          const msg =
            data.error?.message || 'Error getting farming recommendation.';
          throw new Error(msg);
        }
      } catch (err: unknown) {
        console.error('Error fetching recommendation:', err);
        const errorMsg =
          err instanceof Error ? err.message : 'Could not load recommendation.';
        setError(errorMsg);
        setCache(errorMsg, true);
        updateRetryData(retryData.count + 1);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [
    getCache,
    getRetryData,
    isCacheValid,
    isRateLimited,
    setCache,
    updateRetryData,
  ]);

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
