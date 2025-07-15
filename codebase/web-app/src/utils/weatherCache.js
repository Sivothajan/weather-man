const CACHE_KEY = "weatherman_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const weatherCache = {
  set: (data) => {
    const cacheData = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  },

  get: () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  },

  clear: () => {
    localStorage.removeItem(CACHE_KEY);
  },

  isValid: () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp <= CACHE_DURATION;
  },
};
