const fetchNews = async (location: string) => {
  // TODO: Replace with actual news API call
  if (!location) {
    throw new Error('Location is required for fetching news');
  }
  return {
    headlines: [
      'Local farmers report good harvests',
      'New irrigation techniques being adopted',
      'Weather patterns changing in the region',
    ],
  };
};

export default fetchNews;
