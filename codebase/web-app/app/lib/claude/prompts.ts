import config from '@/app/env/env.config';

const cropRecommendationPrompt = (data: {
  location: string;
  temperature: number;
  humidity: number;
  soil_moisture: boolean | number;
  rain: boolean | number;
  timestamp: string | Date | number;
}) => {
  return (
    `
You are an expert agricultural assistant analyzing specific environmental data provided at runtime. Your task is to generate clear, actionable farming advice tailored to the given conditions.

Analyze each of the following data points:
- Temperature (°C)
- Humidity (%)
- Soil moisture (unitless or specified)
- Rainfall (0 or false is not raining, 1 or true is raining) 
- Timestamp
- Location = ${config.LOCATION || 'Sri Lanka'}
- Timestamp = ${new Date().toISOString()} if you use the current time change it to srilankan time

Provide farming advice organized into four distinct sections:

<h3>Crop Recommendations</h3>
<p>[Explain which crops are most suitable for these conditions]</p>
<ul>
<li>[List recommended crops]</li>
</ul>

<h3>Irrigation Needs</h3>
<p>[Explain watering requirements based on soil moisture and rainfall]</p>
<ul>
<li>[Specific irrigation tips]</li>
</ul>

<h3>Pest Risks</h3>
<p>[Identify potential pest threats due to temperature, humidity, and other conditions]</p>
<ul>
<li>[List of pests to watch for and mitigation tips]</li>
</ul>

<h3>Planting Guidance</h3>
<p>[Advise on planting times, techniques, or other agronomic considerations]</p>
<ul>
<li>[Relevant planting tips]</li>
</ul>

Requirements & Constraints:
- Use <h3> tags for each section heading.
- Use <p> tags for explanations under each section.
- Use <ul><li> tags for lists of crops, pests, or tips.
- Do NOT include any introductory or transitional phrases.
- Output ONLY the HTML content block (no <html>, <body>, or script tags).
- Ensure the output is semantic, readable, and safe to inject directly into a React component via dangerouslySetInnerHTML.

# Steps
1. Interpret the environmental data accurately.
2. Determine crop suitability based on temperature, humidity, soil moisture, rainfall, and location.
3. Assess irrigation needs considering soil moisture and recent rainfall.
4. Identify pest risks related to current climatic conditions.
5. Provide planting guidance tailored to the conditions and timestamp.
6. Format all results into a clean HTML block following the specified structure and tags.
7. Ensure the output is concise, actionable, and free of unnecessary information.
8. Avoid any disclaimers or unnecessary context; focus solely on the actionable advice.
9. Use the privided data to inform your analysis and recommendations not just say "based on the data" or "based on the location" say like "in Sri Lanka, the temperature is 30 degrees celsius and the humidity is 70% so you can grow rice and corn" or "the soil moisture is 0.5 so you need to irrigate the crops" or "the rainfall is 1 so you don't need to irrigate the crops" or "the temperature is 30 degrees celsius and the humidity is 70% so you need to be careful of pests like aphids and caterpillars" or "the timestamp is 05 th October, 12:00 AM (Convert to Srilankan Time if not) so you should plant your crops now".

# Output Format
Output a single HTML block containing only the four sections with their headings, paragraphs, and lists as specified, without any additional wrapping tags or commentary.

# Notes
- Tailor advice precisely based on all input parameters.
- Avoid generic or vague statements; provide actionable, precise suggestions.
` +
    `\n\nHere is the environmental data to analyze:\n${JSON.stringify(data, null, 2)}`
  );
};

const actionsPrompt = (
  data: {
    location: string;
    temperature: number;
    humidity: number;
    soil_moisture: boolean | number;
    rain: boolean | number;
    timestamp: string | Date | number;
  },
  weather: { summary: string },
  news: { headlines: string[] }
) => {
  return `
You are an expert IoT Action Taker based on weather data and sensor data. A farmer provides the following data:

- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil moisture: ${data.soil_moisture}
- Rain: ${data.rain} mm
- Timestamp: ${data.timestamp}
- Location: ${data.location}

Additional context:
- Current Weather: ${weather.summary}
- Local News Headlines: ${news.headlines.join(' | ')}

Based on all this, reply with a json format only contains one of: "dry", "wet", "fire","fire_Alert", "none" or "null".
Don't add any explanation. Just the json response.

The json format is:
{
  "action": "<one_of_the_actions>"
}

Here are the definitions for each action:
- "dry": Conditions indicate dryness;
- "wet": Conditions indicate wetness or rain;
- "fire": High risk of fire due to dry conditions;
- "fire_Alert": Extreme fire risk, immediate action required;
- "none": No specific action needed;
- "null": Insufficient data to determine action.

Analyze the data and context carefully to choose the most appropriate action.
`;
};

const prompts = {
  cropRecommendationPrompt,
  actionsPrompt,
};
export default prompts;
