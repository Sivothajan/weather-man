import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Welcome to the Weather Man API 🌦️',
      available_endpoints: {
        'GET /api/check': 'Check if the API is running',
        'GET /api/data/get/:number':
          'Fetch latest :number entries from the database',
        'GET /api/actions/recommendations':
          'Get AI-powered crop recommendations based on latest data',
        'GET /api/actions/dynamic':
          'Take IoT action based on current conditions',
        'POST /api/data/add': 'Add new weather and sensor data to the database',
      },
    },
    {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    }
  );
}
