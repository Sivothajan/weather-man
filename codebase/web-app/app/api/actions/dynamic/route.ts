import { NextResponse } from 'next/server';
import { getDataFromDb } from '@/app/lib/supabase/getDataFromDb';
import { takeIoTAction } from '@/app/lib/claude/takeIoTAction';
import config from '@/app/env/env.config';

export async function GET() {
  const location = config.LOCATION || 'Unknown Location';
  const dbData = await getDataFromDb(1);

  if (!dbData.success || !dbData.data || !dbData.data[0]) {
    return NextResponse.json(
      { message: 'Error fetching data from the database.' },
      { status: 500 }
    );
  }

  const data = {
    location,
    temperature: dbData.data[0].temperature,
    humidity: dbData.data[0].humidity,
    soil_moisture: dbData.data[0].soil_moisture,
    rain: dbData.data[0].rain,
    timestamp: dbData.data[0].timestamp,
  };

  try {
    const action = await takeIoTAction(data);
    return NextResponse.json({
      message: 'Action taken successfully!',
      action,
    });
  } catch (error) {
    console.error('Error in take-action handler:', error);
    return NextResponse.json(
      { message: 'Error processing request.' },
      { status: 500 }
    );
  }
}
