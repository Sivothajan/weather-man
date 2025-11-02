import utils from '@/app/lib/utils/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: { 'API Status Response': 'Weather Man API is Working!' },
      is_down: false,
      available_endpoints: {
        'GET /api/check': 'Check if the API is running',
        'POST /api/data/add': 'Add new weather and sensor data to the database',
        'GET /api/data/get/:number':
          'Fetch latest :number entries from the database',
        'GET /api/actions/recommendations':
          'Get AI-powered crop recommendation based on latest data',
        'GET /api/actions/dynamic':
          'Take IoT action based on current conditions',
      },
      timestamp: utils.getTime(),
    },
    {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    }
  );
}
