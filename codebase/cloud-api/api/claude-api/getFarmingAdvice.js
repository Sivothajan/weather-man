import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const getFarmingAdvice = async (data) => {
  const prompt = `
You are an expert agricultural assistant. A farmer provides the following data:

- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil moisture: ${data.soil_moisture}
- Rain: ${data.rain} mm
- Timestamp: ${data.timestamp}
- Location: ${data.location}

Based on this data, provide clear, actionable farming advice for that region. Mention any crop recommendations, irrigation needs, pest risks, or planting guidance.
`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error("Failed to get farming advice from Claude");
  }
};

export default getFarmingAdvice;
