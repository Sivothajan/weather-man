-- ============================================================================
-- Table: weather_data
-- ----------------------------------------------------------------------------
-- Stores weather sensor readings and related environmental data.
--
-- Columns:
--   id            : Unique identifier for each record (auto-incremented).
--   temperature   : Measured temperature value (in degrees, floating point).
--   humidity      : Measured humidity percentage (floating point).
--   soil_moisture : Measured soil moisture value (floating point).
--   soil_raw      : Raw sensor value for soil moisture (optional, floating point).
--   rain          : Indicates if rain was detected (boolean, required).
--   rain_raw      : Raw sensor value for rain detection (optional, floating point).
--   fire          : Indicates if fire was detected (boolean, required).
--   timestamp     : Date and time when the data was recorded (defaults to current time).
-- ============================================================================
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    soil_moisture FLOAT NOT NULL,
    soil_raw FLOAT,
    rain BOOLEAN NOT NULL,
    rain_raw FLOAT,
    fire BOOLEAN NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
