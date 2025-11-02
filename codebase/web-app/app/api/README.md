# API Documentation

This document provides an overview of the Cloud API for the Weather Man application. The API allows interaction with weather data, AI-generated crop recommendation, and AI-automated actions based on weather conditions.

## Client Configuration (Next.js)

- `NEXT_PUBLIC_WEATHER_REFRESH_INTERVAL` — Interval (in milliseconds) for refreshing weather data on the client side (default: 5000 ms)`
- `NEXT_PUBLIC_DATA_SIZE` — Number of weather data entries to fetch and display on the client side (default: 10)
- `NEXT_PUBLIC_WEATHER_REFRESH_ENABLED` — Enable or disable automatic weather data refresh on the client side (default: true)

## Supabase Configuration

- `SUPABASE_URL` — URL of the Supabase instance
- `SUPABASE_ANON_KEY` — Anonymous API key for Supabase access
- `SUPABASE_TABLE_NAME` — Name of the table storing weather data (default: 'weather_man_weather_data')

## Notifications & IoT Actions (ntfy)

- `NTFY_USERNAME` — Username for ntfy service authentication
- `NTFY_PASSWORD` — Password for ntfy service authentication
- `NTFY_SERVER_DOMAIN` — Domain of the ntfy server (default: "ntfy.sh")
- `NTFY_CHANEL_NAME` — Name of the notification channel (default: value of NTFY_USERNAME)

## AI Services (Anthropic)

- `ANTHROPIC_API_KEY` — API key for Claude AI services (used for farming advice and IoT actions)
- `ANTHROPIC_MODEL` — Model name for Claude AI (default: "claude-3-haiku-20240307")

## Location Configuration

- `LOCATION` — Physical location of the weather station (used for crop recommendation and IoT actions)

### API Endpoints

The Cloud API provides the following endpoints:

#### Health Check

- `GET /api/check` — Verifies if the API is running properly
  - Response: Status message indicating API health and available endpoints

#### Weather Data

- `GET /api/data/get/:number` — Retrieves the latest weather data entries
  - Parameters: `number` (path parameter) - Number of entries to retrieve (must be > 0)
  - Response: Array of weather data entries
- `GET /api/data/get` — Retrieves the latest weather data entry
  - Response: 10 latest weather data entries (must be > 0 and <=10>)
- `POST /api/data/add` — Adds new weather data to the database
  - Request Body:

    ```json
    {
      "temperature": number,
      "humidity": number,
      "soil_moisture": number,
      "soil_raw": number,
      "rain": number,
      "rain_raw": number,
      "fire": boolean
    }
    ```

  - Response: Confirmation message with status

#### AI Features

- `GET /api/actions/recommendations` — Get AI-generated crop recommendations based on weather data
  - Response: Suggested crops and farming advice

- `GET /api/actions/dynamic` — Get AI-generated dynamic actions for IoT devices based on weather data
  - Response: Suggested actions for IoT devices

### System Requirements

- Node.js v18 or higher
- Supabase account and database
- Anthropic account for AI services
- ntfy account for notifications
- Environment variables configured as per the above sections
