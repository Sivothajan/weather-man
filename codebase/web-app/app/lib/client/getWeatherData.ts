import config from '@/app/env/env.config';

const DATA_SIZE = config.NEXT_PUBLIC_DATA_SIZE || 10;

export const getWeatherData = async () => {
  try {
    const response = await fetch(`/api/data/get/${DATA_SIZE}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export default getWeatherData;
