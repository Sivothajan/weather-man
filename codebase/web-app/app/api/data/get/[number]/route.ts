import { NextRequest, NextResponse } from 'next/server';
import { getDataFromDb } from '@/app/lib/supabase/getDataFromDb';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  if (isNaN(Number(number)) || Number(number) < 1) {
    return NextResponse.json(
      { message: 'Invalid number parameter. Must be greater than 0.' },
      { status: 400 }
    );
  }

  const data = await getDataFromDb(Number(number));
  return NextResponse.json(data, {
    headers: { 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
