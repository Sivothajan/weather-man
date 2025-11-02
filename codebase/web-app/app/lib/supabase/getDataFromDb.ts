import { createClient } from '@supabase/supabase-js';
import config from '@/app/env/env.config';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

const getDataFromDb = async (limit = 10) => {
  const { data, error } = await supabase
    .from(config.SUPABASE_TABLE_NAME)
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
