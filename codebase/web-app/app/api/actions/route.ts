import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Welcome to the Weather Man API Actions 🤖',
      available_endpoints: {
        'GET /api/actions/recommendations':
          'Get AI-powered crop recommendations based on latest data',
        'GET /api/actions/dynamic':
          'Take IoT action based on current conditions',
      },
    },
    {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    }
  );
}
