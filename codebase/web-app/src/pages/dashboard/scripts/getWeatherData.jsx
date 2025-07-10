const DATA_SIZE = import.meta.env.VITE_DATA_SIZE || 10; // Default to 10 if not set

export const getWeatherData = async () => {
  try {
    const response = await fetch(`/api/get/${DATA_SIZE}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.data; // Only return the data array
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export default getWeatherData;
