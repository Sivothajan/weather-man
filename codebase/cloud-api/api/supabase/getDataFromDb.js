import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseTable = process.env.SUPABASE_TABLE;

const supabase = createClient(supabaseUrl, supabasePublicAnonKey);

const getDataFromDb = async (limit = 10) => {
    const { data, error } = await supabase
        .from(supabaseTable)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching data:', error);
        return { success: false, error };
    } else {
        return { success: true, data };
    }
};

export { getDataFromDb };