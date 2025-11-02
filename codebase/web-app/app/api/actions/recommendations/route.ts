import { NextResponse } from 'next/server';
import { getDataFromDb } from '@/app/lib/supabase/getDataFromDb';
import { getCropRecommendation } from '@/app/lib/claude/getCropRecommendation';

export async function GET() {
  const location = process.env.LOCATION || 'Unknown Location';
  const dbData = await getDataFromDb(1);

  if (!dbData.success || !dbData.data || dbData.data.length === 0) {
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
    const farmingAdvice = await getCropRecommendation(data);
    return NextResponse.json(farmingAdvice);
  } catch (error) {
    console.error('Error in farming advice handler:', error);
    return NextResponse.json(
      { message: 'Error generating advice' },
      { status: 500 }
    );
  }
}
