import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getFarmingAdvice = async (data) => {
  const prompt = `
You are an expert agricultural assistant analyzing specific environmental data provided at runtime. Your task is to generate clear, actionable farming advice tailored to the given conditions.

Analyze each of the following data points:
- Temperature (°C)
- Humidity (%)
- Soil moisture (unitless or specified)
- Rainfall (0 or false is not raining, 1 or true is raining) 
- Timestamp
- Location

Provide farming advice organized into four distinct sections:

<h2>Crop Recommendations</h2>
<p>[Explain which crops are most suitable for these conditions]</p>
<ul>
<li>[List recommended crops]</li>
</ul>

<h2>Irrigation Needs</h2>
<p>[Explain watering requirements based on soil moisture and rainfall]</p>
<ul>
<li>[Specific irrigation tips]</li>
</ul>

<h2>Pest Risks</h2>
<p>[Identify potential pest threats due to temperature, humidity, and other conditions]</p>
<ul>
<li>[List of pests to watch for and mitigation tips]</li>
</ul>

<h2>Planting Guidance</h2>
<p>[Advise on planting times, techniques, or other agronomic considerations]</p>
<ul>
<li>[Relevant planting tips]</li>
</ul>

Requirements & Constraints:
- Use <h2> tags for each section heading.
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

# Output Format
Output a single HTML block containing only the four sections with their headings, paragraphs, and lists as specified, without any additional wrapping tags or commentary.

# Notes
- Tailor advice precisely based on all input parameters.
- Avoid generic or vague statements; provide actionable, precise suggestions.
`;

  try {
    // Modify the prompt to include the data values
    const dataPrompt =
      prompt +
      `\n\nHere is the environmental data to analyze:\n${JSON.stringify(data, null, 2)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: dataPrompt,
        },
      ],
    });

    // Return only content and type for successful responses
    return {
      content: response.content[0].text,
      type: "message",
    };
  } catch (error) {
    console.error("Error calling Claude API:", error);
    // Return only error object and type for error responses
    return {
      error: {
        message: error.message || "Invalid request",
        type: error.type || "invalid_request_error",
      },
      type: "error",
    };
  }
};

export default getFarmingAdvice;
