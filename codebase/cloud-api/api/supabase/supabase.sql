-- Table: weather_data
-- Purpose: Stores weather data collected from sensors.
-- Fields:
--   id            : Auto-incremented primary key.
--   temperature   : Measured temperature (float, required).
--   humidity      : Measured humidity (float, required).
--   soil_moisture : Measured soil moisture (float, required).
--   rain          : Rain status (boolean, required).
--   timestamp     : Time when data was collected (defaults to current time).
-- Notes:
--   - Compatible with Supabase.
--   - Table is created only if it does not already exist.

CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    soil_moisture FLOAT NOT NULL,
    rain BOOLEAN NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);