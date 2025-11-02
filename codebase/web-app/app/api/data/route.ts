import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Welcome to the Weather Man API Data 📄',
      available_endpoints: {
        'GET /api/data/get/:number':
          'Fetch latest :number entries from the database',
        'POST /api/data/add': 'Add new weather and sensor data to the database',
      },
    },
    {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    }
  );
}
