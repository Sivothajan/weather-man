const getTime = () => {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    hour12: false,
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
  };

  const formatter = new Intl.DateTimeFormat('sv-SE', options); // 'sv-SE' = Swedish = ISO style YYYY-MM-DD
  const lankaTime = formatter.format(now);

  return lankaTime;
};

const utils = {
  getTime,
};

export default utils;
