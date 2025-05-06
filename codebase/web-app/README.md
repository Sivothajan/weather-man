## Running, Building, and Linting the Project

This section explains how to run, build, and lint the project, as well as the main website URLs.

### Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production**:

   ```bash
   npm run build
   ```

   The production-ready files will be output to the `dist/` directory.

4. **Lint the codebase**:
   ```bash
   npm run lint
   ```
   This uses ESLint to check for code quality and style issues.

### Environment Variables

Create a `.env` file in the root directory of this project with the following variables:

#### Web App Environment Variables

- `VITE_API_URL` — Base URL for the weather-man cloud API
- `VITE_DATA_SIZE` — Number of data points to fetch from the API (default: 10)
- `VITE_WEATHER_REFRESH_INTERVAL` — Interval in milliseconds for refreshing weather data (default: 6000 milliseconds)
- `VITE_WEATHER_REFRESH_ENABLED` — Enable or disable automatic weather data refresh (default: true)

### Main Website URLs

- `/` or `/about` &mdash; About page
- `/weather` &mdash; Weather page
- `/dashboard` &mdash; Dashboard page
- Any other path &mdash; Error 404 page

All routes are managed using React Router and are wrapped in a `BrowserRouter` for client-side navigation.
