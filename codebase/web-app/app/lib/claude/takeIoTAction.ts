import Anthropic from '@anthropic-ai/sdk';
import fetchWeather from './fetchWeather';
import fetchNews from './fetchNews';
import prompts from './prompts';
import config from '@/app/env/env.config';
import { sendNotificationToChannel } from '@/app/lib/ntfy/ntfy';

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

export const takeIoTAction = async (data: {
  location: string;
  temperature: number;
  humidity: number;
  soil_moisture: boolean | number;
  rain: boolean | number;
  timestamp: string | Date | number;
}) => {
  try {
    const weather = await fetchWeather(data.location);
    const news = await fetchNews(data.location);

    const response = await anthropic.messages.create({
      model: config.ANTHIROPIC_MODEL,
      max_tokens: 10,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: prompts.actionsPrompt(data, weather, news),
        },
      ],
    });

    sendNotificationToChannel(
      'Claude Action Decision',
      `Claude's decision: ${response.content}`,
      'weather-man'
    );

    const contentItem = response.content.find((c) => c.type === 'text');
    const action = JSON.parse(contentItem?.text || '{"action": "null"}').action;

    if (['dry', 'wet', 'fire', 'fire_alert', 'none', 'null'].includes(action)) {
      sendNotificationToChannel(
        'Action Required',
        `Action: ${action}`,
        'weather-man'
      );
      return action;
    }

    console.warn('Unexpected response from Claude:', action);
    return 'null';
  } catch (error) {
    console.error('Error during Claude action decision:', error);
    throw new Error('Failed to get farming advice');
  }
};

export default takeIoTAction;
