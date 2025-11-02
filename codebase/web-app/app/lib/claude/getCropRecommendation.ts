import Anthropic from '@anthropic-ai/sdk';
import prompts from './prompts';
import config from '@/app/env/env.config';

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

export const getCropRecommendation = async (data: {
  location: string;
  temperature: number;
  humidity: number;
  soil_moisture: boolean | number;
  rain: boolean | number;
  timestamp: string | Date | number;
}) => {
  try {
    const response = await anthropic.messages.create({
      model: config.ANTHIROPIC_MODEL,
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompts.cropRecommendationPrompt(data),
        },
      ],
    });

    const responseContent = {
      content:
        response.content[0].type === 'text' ? response.content[0].text : '',
      type: response.content[0].type === 'text' ? 'message' : 'error',
      success: response.content[0].type === 'text',
    };

    // Return only content and type for successful responses
    return responseContent;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    // Return only error object and type for error responses
    return {
      content: error instanceof Error ? error.message : 'Internal Server Error',
      type: 'error',
      success: false,
    };
  }
};

export default getCropRecommendation;
