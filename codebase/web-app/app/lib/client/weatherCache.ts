const CACHE_KEY = 'weather_man_cache';
const CACHE_DURATION = 500;

interface CacheData<T> {
  timestamp: number;
  data: T;
}

export const weatherCache = {
  set: <T>(data: T): void => {
    const cacheData: CacheData<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  },

  get: <T>(): T | null => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached) as CacheData<T>;
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  },

  clear: (): void => {
    localStorage.removeItem(CACHE_KEY);
  },

  isValid: (): boolean => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached) as CacheData<unknown>;
    return Date.now() - timestamp <= CACHE_DURATION;
  },
};
