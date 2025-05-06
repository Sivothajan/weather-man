import { useEffect, useState } from "react";
import styles from "./Advice.module.css";

function Advice() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Cache keys
  const ADVICE_CACHE_KEY = "farming_advice_cache";
  const RETRY_CACHE_KEY = "farming_advice_retry";

  // Helper functions for cache management
  const getCache = () => {
    try {
      const cacheData = localStorage.getItem(ADVICE_CACHE_KEY);
      if (!cacheData) return null;
      return JSON.parse(cacheData);
    } catch (err) {
      console.error("Error reading advice from cache:", err);
      return null;
    }
  };

  const setCache = (data, isError = false) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        isError,
      };
      localStorage.setItem(ADVICE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error("Error storing advice in cache:", err);
    }
  };

  const getRetryData = () => {
    try {
      const retryData = localStorage.getItem(RETRY_CACHE_KEY);
      if (!retryData) return { count: 0, lastAttempt: null };
      return JSON.parse(retryData);
    } catch (err) {
      console.error("Error reading retry data from cache:", err);
      return { count: 0, lastAttempt: null };
    }
  };

  const updateRetryData = (count) => {
    try {
      const retryData = {
        count,
        lastAttempt: Date.now(),
      };
      localStorage.setItem(RETRY_CACHE_KEY, JSON.stringify(retryData));
    } catch (err) {
      console.error("Error updating retry data in cache:", err);
    }
  };

  const isCacheValid = (cache) => {
    if (!cache || !cache.timestamp) return false;

    // Check if cache is less than 1 day old (24 hours * 60 minutes * 60 seconds * 1000 ms)
    const oneDayMs = 24 * 60 * 60 * 1000;
    return Date.now() - cache.timestamp < oneDayMs;
  };

  const shouldResetRetryCount = (lastAttemptTime) => {
    if (!lastAttemptTime) return true;

    // Get date parts to compare dates without time
    const lastAttemptDate = new Date(lastAttemptTime);
    const currentDate = new Date();

    // Reset if it's a new day
    return (
      lastAttemptDate.getDate() !== currentDate.getDate() ||
      lastAttemptDate.getMonth() !== currentDate.getMonth() ||
      lastAttemptDate.getFullYear() !== currentDate.getFullYear()
    );
  };

  useEffect(() => {
    async function fetchAdvice() {
      // Check cache first
      const cache = getCache();

      // Get retry data and reset count if it's a new day
      const retryData = getRetryData();
      const resetRetry = shouldResetRetryCount(retryData.lastAttempt);
      const currentRetryCount = resetRetry ? 0 : retryData.count;

      // Use cache if valid and not an error
      if (isCacheValid(cache) && !cache.isError) {
        setAdvice(cache.data);
        setLoading(false);
        return;
      }

      // If we've exceeded retry limit on the same day, show message and use cached error
      if (!resetRetry && currentRetryCount >= 5 && cache?.isError) {
        setAdvice("");
        setError(
          `Exceeded 5 attempts to get advice. Please try again tomorrow. (${currentRetryCount} attempts)`,
        );
        setLoading(false);
        return;
      }

      // Fetch new data
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/farming-advice`,
        );
        if (!res.ok) throw new Error("Failed to fetch advice");
        const data = await res.json();

        // Handle success response
        if (data.type === "message" && data.content) {
          setAdvice(data.content);
          setCache(data.content, false);
          // Reset retry count on success
          updateRetryData(0);
        }
        // Handle error response from the API
        else if (data.type === "error" && data.error) {
          const errorMsg =
            data.error.message || "Error getting farming advice.";
          setError(errorMsg);
          setCache(errorMsg, true);

          // Update retry count
          const newRetryCount = currentRetryCount + 1;
          setRetryCount(newRetryCount);
          updateRetryData(newRetryCount);

          // Check if exceeded retry limit
          if (newRetryCount >= 5) {
            setError(
              `Exceeded 5 attempts to get advice. Please try again tomorrow. (${newRetryCount} attempts)`,
            );
          }
        }
        // Handle unexpected response format
        else {
          console.warn("Unexpected response format:", data);
          const errorMsg = "Received unexpected data format from server.";
          setError(errorMsg);
          setCache(errorMsg, true);

          // Update retry count
          const newRetryCount = currentRetryCount + 1;
          setRetryCount(newRetryCount);
          updateRetryData(newRetryCount);

          // Check if exceeded retry limit
          if (newRetryCount >= 5) {
            setError(
              `Exceeded 5 attempts to get advice. Please try again tomorrow. (${newRetryCount} attempts)`,
            );
          }
        }
      } catch (err) {
        console.error("Error fetching farming advice:", err);
        const errorMsg = "Could not load advice. Please try again later.";
        setError(errorMsg);
        setCache(errorMsg, true);

        // Update retry count
        const newRetryCount = currentRetryCount + 1;
        setRetryCount(newRetryCount);
        updateRetryData(newRetryCount);

        // Check if exceeded retry limit
        if (newRetryCount >= 5) {
          setError(
            `Exceeded 5 attempts to get advice. Please try again tomorrow. (${newRetryCount} attempts)`,
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAdvice();
  }, []);

  return (
    <div className={styles.overviewCard}>
      <div className={styles.cardHeader}>
        <h2>Farming Advice</h2>
      </div>
      <div className={styles.cardContent}>
        {loading && <p>Loading advice...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <div
            className={styles.adviceText}
            dangerouslySetInnerHTML={{ __html: advice }}
          />
        )}
      </div>
    </div>
  );
}

export default Advice;
