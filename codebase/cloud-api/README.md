### Cloud API Environment Variables

The Cloud API component of the project uses the following environment variables in its `.env` file:

#### Supabase Configuration

- `SUPABASE_URL` — URL of your Supabase instance
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key for public access
- `SUPABASE_TABLE` — Name of the Supabase table storing weather data

#### Notifications (ntfy)

- `NTFY_USERNAME` — Username for ntfy service authentication
- `NTFY_PASSWORD` — Password for ntfy service authentication
- `NTFY_SERVER_DOMAIN` — Domain of the ntfy server (default: "ntfy.sivothajan.me")
- `NTFY_CHANEL_NAME` — Name of the notification channel (default: value of NTFY_USERNAME)

#### AI Services

- `ANTHROPIC_API_KEY` — API key for Claude AI services (used for farming advice and IoT actions)

#### Location Configuration

- `LOCATION` — Physical location of the weather station (used for farming advice and IoT actions)

### API Endpoints

The Cloud API provides the following endpoints:

#### Health Check

- `GET /api/check` — Verifies if the API is running properly
  - Response: `{ "message": { "API Status Response": "Weather Man API is Working!" } }`

#### Weather Data

- `GET /api/get/:number` — Retrieves the latest weather data entries
  - Parameters: `number` (path parameter) - Number of entries to retrieve (must be > 0)
  - Response: Array of weather data entries
- `POST /data/add` — Adds new weather data to the database
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

- `GET /farming-advice` — Get AI-generated farming advice based on latest weather conditions

  - Response: Farming recommendations based on current conditions

- `GET /take-action` — Trigger automated actions based on weather conditions
  - Response: Details of the action taken

### System Requirements

- Node.js 18.x or higher
- npm 8.x or higher
- Access to Supabase database
- Anthropic API access for Claude AI features
- ntfy account for notifications (optional)
