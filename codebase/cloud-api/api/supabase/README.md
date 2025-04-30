# weather_data Table

This table stores weather data collected from sensors, designed for use with Supabase.

## Table Structure

| Field          | Type      | Description                                 | Constraints                  |
|----------------|-----------|---------------------------------------------|------------------------------|
| `id`           | SERIAL    | Auto-incremented primary key                | Primary Key                  |
| `temperature`  | FLOAT     | Measured temperature                        | Required                     |
| `humidity`     | FLOAT     | Measured humidity                           | Required                     |
| `soil_moisture`| FLOAT     | Measured soil moisture                      | Required                     |
| `rain`         | BOOLEAN   | Rain status                                 | Required                     |
| `timestamp`    | TIMESTAMP | Time when data was collected                | Defaults to current time     |

## SQL Definition

```sql
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    soil_moisture FLOAT NOT NULL,
    rain BOOLEAN NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Manual Creation Steps

To manually create the `weather_data` table in your Supabase database:

1. Open the Supabase dashboard and navigate to your project.
2. Go to the SQL editor.
3. Copy and paste the SQL definition above into the editor.
4. Click "Run" to execute the statement and create the table.

## Notes

- Compatible with Supabase.
- Table is created only if it does not already exist.
- All measurement fields are required.
- `timestamp` defaults to the current time when a record is inserted.