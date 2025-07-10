import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import process from 'node:process';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseTable = process.env.SUPABASE_TABLE;

const supabase = createClient(supabaseUrl, supabasePublicAnonKey);

const addToDb = async (data) => {
  // Insert the entire data object as separate columns
  // Each key in 'data' will be mapped to a column in the table
  const { error } = await supabase.from(supabaseTable).insert([data]);

  if (error) {
    console.error("Error inserting data:", error);
    return { success: false, error };
  } else {
    console.log("Data inserted successfully!");
    return { success: true };
  }
};

export { addToDb as addDataToDb };
