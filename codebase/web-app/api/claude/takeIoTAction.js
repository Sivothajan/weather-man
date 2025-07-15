import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import process from "node:process";
import {
  sendNotificationToChanel,
  sendNotificationToChanelWithAction,
} from "../ntfy/ntfy.js";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const fetchWeather = async (location) => {
  // TODO: Replace with actual weather API call
  return {
    summary: `Normal weather expected in ${location}`,
  };
};

const fetchNews = async (location) => {
  // TODO: Replace with actual news API call
  if (!location) {
    throw new Error("Location is required for fetching news");
  }
  return {
    headlines: [
      "Local farmers report good harvests",
      "New irrigation techniques being adopted",
      "Weather patterns changing in the region",
    ],
  };
};

export const takeIoTAction = async (data) => {
  try {
    const weather = await fetchWeather(data.location);
    const news = await fetchNews(data.location);

    const prompt = `
You are an expert agricultural assistant. A farmer provides the following data:

- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil moisture: ${data.soil_moisture}
- Rain: ${data.rain} mm
- Timestamp: ${data.timestamp}
- Location: ${data.location}

Additional context:
- Current Weather: ${weather.summary}
- Local News Headlines: ${news.headlines.join(" | ")}

Based on all this, reply with only one word — one of: "watering", "call", or "null".
Don't add any explanation. Just the action word.
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    sendNotificationToChanel(
      "Claude Action Decision",
      `Claude's decision: ${response.content}`,
      "weather-man",
    );

    const contentItem = response.content.find((c) => c.type === "text");
    const advice = contentItem?.text?.trim().toLowerCase();

    if (["watering", "call", "null"].includes(advice)) {
      sendNotificationToChanelWithAction(
        "Action Required",
        `Action: ${advice}`,
        "weather-man",
        `https://${process.env.API_URL}/action/${advice}`,
      );
      return advice;
    }

    console.warn("Unexpected response from Claude:", advice);
    return "null"; // Fallback if unclear
  } catch (error) {
    console.error("Error during Claude action decision:", error);
    throw new Error("Failed to get farming advice");
  }
};

export default takeIoTAction;
