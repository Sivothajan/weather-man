import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseTable = process.env.SUPABASE_TABLE;

const supabase = createClient(supabaseUrl, supabasePublicAnonKey);

const addToDb = async (data, preTimestamp) => {
    const { temperature, humidity, soil_moisture, rain } = data;
    const { error } = await supabase
        .from(supabaseTable)
        .insert([
            { 
                temperature,
                humidity,
                soil_moisture,
                rain,
                timestamp: preTimestamp
            }
        ]);

    if (error) {
        console.error('Error inserting data:', error);
        return { success: false, error };
    } else {
        console.log('Data inserted successfully!');
        return { success: true };
    }
};

export { addToDb as addDataToDb };