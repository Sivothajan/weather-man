const fetchWeather = async (location: string) => {
  // TODO: Replace with actual weather API call
  if (!location) {
    throw new Error('Location is required for fetching weather');
  }
  return {
    summary: `Normal weather expected in ${location}`,
  };
};

export default fetchWeather;
