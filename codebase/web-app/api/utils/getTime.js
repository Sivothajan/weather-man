export const getTime = () => {
  const now = new Date();

  const options = {
    timeZone: "Asia/Colombo",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("sv-SE", options); // 'sv-SE' = Swedish = ISO style YYYY-MM-DD
  const lankaTime = formatter.format(now);

  return lankaTime;
};

export default getTime;
