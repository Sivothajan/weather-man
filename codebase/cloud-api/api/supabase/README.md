# Supabase Integration for Weather Station

This folder contains the core components for integrating the Weather Station system with Supabase, a PostgreSQL-based serverless database service.

## Table of Contents

- [Database Schema](#database-schema)
- [API Modules](#api-modules)
- [Environment Setup](#environment-setup)
- [Usage Examples](#usage-examples)

## Database Schema

### weather_data Table

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
```

## API Modules

### addToDb.js

This module provides functionality to add new weather data records to the Supabase database.

**Main Export:**

- `addDataToDb(data)`: Asynchronous function that inserts a new weather data record.
  - Parameters:
    - `data` (Object): An object containing weather station measurements
  - Returns:
    - Promise that resolves to `{ success: true }` on success or `{ success: false, error }` on failure

**Example:**

```javascript
import { addDataToDb } from "./supabase/addToDb.js";

// Insert weather data
const result = await addDataToDb({
  temperature: 25.4,
  humidity: 65.2,
  soil_moisture: 42.1,
  soil_raw: 580,
  rain: false,
  rain_raw: 120,
  fire: false,
});

if (result.success) {
  console.log("Weather data added successfully");
} else {
  console.error("Failed to add weather data:", result.error);
}
```

### getDataFromDb.js

This module provides functionality to retrieve weather data records from the Supabase database.

**Main Export:**

- `getDataFromDb(limit)`: Asynchronous function that fetches weather data records.
  - Parameters:
    - `limit` (Number, optional): Maximum number of records to return (default: 10)
  - Returns:
    - Promise that resolves to `{ success: true, data }` on success or `{ success: false, error }` on failure

**Example:**

```javascript
import { getDataFromDb } from "./supabase/getDataFromDb.js";

// Get the latest 20 weather records
const result = await getDataFromDb(20);

if (result.success) {
  console.log("Weather data records:", result.data);
} else {
  console.error("Failed to retrieve weather data:", result.error);
}
```

## Environment Setup

The Supabase integration requires the following environment variables:

| Variable                        | Description                                     |
| ------------------------------- | ----------------------------------------------- |
| `SUPABASE_URL`                  | The URL of your Supabase project                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anonymous key for your Supabase project     |
| `SUPABASE_TABLE`                | The name of the table (default: "weather_data") |

Create a `.env` file in the project root with these variables:

```
SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_TABLE=weather_data
```

## Manual Creation Steps

To manually create the `weather_data` table in your Supabase database:

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
