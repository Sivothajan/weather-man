# Web App of Weather Man

This section explains how to run, build, and lint the project, as well as the main website URLs and required environment variables.

## Getting Started

**Install dependencies**:

```bash
npm install
```

or

```bash
bun install
```

**Run the development server**:

```bash
npm run dev
```

or

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) by default.

**Build for production**:

```bash
npm run build
```

or

```bash
bun run build
```

The production-ready files will be output to the `dist/` directory.

**Lint the codebase**:

```bash
npm run lint
```

or

```bash
bun run lint
```

This uses ESLint to check for code quality and style issues.

### Environment Variables

Create a `.env` file in the root directory of this project with the following variables:

#### Web App Environment Variables

- `NEXT_PUBLIC_DATA_SIZE` — Number of data points to fetch from the API (default: 10)
- `NEXT_PUBLIC_WEATHER_REFRESH_INTERVAL` — Interval in milliseconds for refreshing weather data (default: 5000 milliseconds)
- `NEXT_PUBLIC_WEATHER_REFRESH_ENABLED` — Enable or disable automatic weather data refresh (default: true)
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` — URL of the Supabase instance
- `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anonymous key for accessing Supabase
- `SUPABASE_TABLE` — Name of the Supabase table to store weather data (default: `weather_man_weather_data`)
- `NTFY_SERVER_DOMAIN` — Domain of the NTFY serve`
- `NTFY_USERNAME` — Username for NTFY notifications
- `NTFY_PASSWORD` — Password for NTFY notifications
- `NTFY_CHANNEL_NAME` — Channel name for NTFY notifications
- `ANTHROPIC_API_KEY` — API key for Anthropic services
- `ANTHROPIC_MODEL` — Anthropic Claude model to use (default: `claude-3-haiku-20240307`)
- `LOCATION` — Default location for contextual advice (default: `Sri Lanka`)

##### Sample .env File

```env
NEXT_PUBLIC_DATA_SIZE=10
NEXT_PUBLIC_WEATHER_REFRESH_INTERVAL=5000
NEXT_PUBLIC_WEATHER_REFRESH_ENABLED=true
SUPABASE_URL=https://your-supabase-random-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_TABLE=weather_man_weather_data
NTFY_SERVER_DOMAIN=ntfy.yourdomain.com
NTFY_USERNAME=your-ntfy-username
NTFY_PASSWORD=your-ntfy-password
NTFY_CHANNEL_NAME=your-ntfy-channel
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-haiku-20240307
LOCATION=Sri Lanka
```

### Main Website URLs

- `/` &mdash; Home page
- `/dashboard` &mdash; Dashboard page
- Any other path &mdash; Error 404 page
