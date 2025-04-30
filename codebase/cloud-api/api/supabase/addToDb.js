
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseTable = process.env.SUPABASE_TABLE;

const supabase = createClient(supabaseUrl, supabasePublicAnonKey);

const addToDb = async (preData, preTimestamp) => {
    const { error } = await supabase
        .from(supabaseTable)
        .insert([
            { 
                timestamp: preTimestamp,
                data: preData
            }
        ]);

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Data inserted successfully!');
    }
};

export default addToDb;