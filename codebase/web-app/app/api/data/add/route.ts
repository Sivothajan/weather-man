import { NextResponse } from 'next/server';
import utils from '@/app/lib/utils/utils';
import { addDataToDb } from '@/app/lib/supabase/addDataToDb';
import { sendNotification } from '@/app/lib/ntfy/ntfy';

export async function POST(req: Request) {
  const body = await req.json();
  const {
    temperature,
    humidity,
    soil_moisture,
    soil_raw,
    rain,
    rain_raw,
    fire,
  } = body;
  const timestamp = utils.getTime();

  const data = {
    temperature,
    humidity,
    soil_moisture,
    soil_raw,
    rain,
    rain_raw,
    fire,
    timestamp,
  };

  try {
    const result = await addDataToDb(data);

    if (data.rain)
      await sendNotification(
        'Rain Alert!',
        `Rain detected: ${data.rain_raw} raw at ${data.timestamp}`
      );
    if (data.fire)
      await sendNotification(
        'Fire Alert!',
        `Fire detected at ${data.timestamp}. Immediate action required!`
      );

    return NextResponse.json(
      {
        status: result.success ? 'ok' : 'error',
        message: result.success
          ? 'Data successfully added'
          : 'Database insert failed',
      },
      { status: result.success ? 201 : 500 }
    );
  } catch (error) {
    console.error('Error in add handler:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error processing request' },
      { status: 500 }
    );
  }
}
