# Supabase Integration for Weather Man

This folder contains the sql definition for the Supabase database used by Weather Man, a PostgreSQL-based serverless database service.

## Table of Contents

- [Database Schema](#database-schema)
- [Manual Creation Steps](#manual-creation-steps)
- [Notes](#notes)

## Database Schema

### `weather_man_weather_data` Table

This table stores weather data collected from sensors, designed for use with Supabase.

#### Table Structure

| Field           | Type      | Description                  | Constraints              |
| --------------- | --------- | ---------------------------- | ------------------------ |
| `id`            | SERIAL    | Auto-incremented primary key | Primary Key              |
| `temperature`   | FLOAT     | Measured temperature         | Required                 |
| `humidity`      | FLOAT     | Measured humidity            | Required                 |
| `soil_moisture` | FLOAT     | Measured soil moisture       | Required                 |
| `soil_raw`      | FLOAT     | Raw soil sensor value        | Optional                 |
| `rain`          | BOOLEAN   | Rain status                  | Required                 |
| `rain_raw`      | FLOAT     | Raw rain sensor value        | Optional                 |
| `fire`          | BOOLEAN   | Fire detection status        | Required                 |
| `timestamp`     | TIMESTAMP | Time when data was collected | Defaults to current time |

#### SQL Definition

```sql
CREATE TABLE IF NOT EXISTS weather_man_weather_data (
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
```

## Manual Creation Steps

To manually create the `weather_man_weather_data` table in your Supabase database:

1. Open the Supabase dashboard and navigate to your project.
2. Go to the SQL editor.
3. Copy and paste the SQL definition from `supabase.sql` into the editor.
4. Click "Run" to execute the statement and create the table.

## Notes

- The implementation is compatible with the latest version of Supabase.
- Table is created only if it does not already exist.
- All measurement fields except `soil_raw` and `rain_raw` are required.
- `timestamp` defaults to the current time when a record is inserted.
- The SQL file contains detailed comments for each field in the database schema.
