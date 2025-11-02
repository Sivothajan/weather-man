import { createClient } from '@supabase/supabase-js';
import config from '@/app/env/env.config';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

const addToDb = async (data: {
  temperature: number;
  humidity: number;
  soil_moisture: boolean | number;
  soil_raw: number;
  rain: boolean | number;
  rain_raw: number;
  fire: boolean | number;
  timestamp: string | Date | number;
}) => {
  // Insert the entire data object as separate columns
  // Each key in 'data' will be mapped to a column in the table
  const { error } = await supabase
    .from(config.SUPABASE_TABLE_NAME)
    .insert([data]);

  if (error) {
    console.error('Error inserting data:', error);
    return { success: false, error };
  } else {
    console.log('Data inserted successfully!');
    return { success: true };
  }
};

export { addToDb as addDataToDb };
