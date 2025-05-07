# Claude Integration - Weather-Man Project

This directory contains the Claude AI integration components for the Weather-Man project. These modules use the Anthropic Claude API to provide smart agricultural insights and decision support based on environmental sensor data.

## Overview

The Claude integration provides two main functionalities:

1. **Farming Advice Generation** - Detailed agricultural recommendations based on environmental conditions
2. **Automated Decision Support** - Simple action recommendations for IoT automation

## Files

- **getFarmingAdvice.js** - Generates detailed HTML-formatted farming advice
- **takeIoTAction.js** - Makes simple action decisions for automated systems

## Setup Requirements

1. An Anthropic API key is required and should be set in the environment variables
2. Install dependencies: `@anthropic-ai/sdk` and `dotenv`
3. Configure location in environment variables (optional, defaults to "Sri Lanka")

## Environment Variables

| Variable            | Description                            | Default                         |
| ------------------- | -------------------------------------- | ------------------------------- |
| `ANTHROPIC_API_KEY` | Your Anthropic API key                 | Required                        |
| `LOCATION`          | Default location for contextual advice | "Sri Lanka"                     |
| `API_URL`           | Base URL for action endpoints          | Required for `takeIoTAction.js` |

## API Functions

### getFarmingAdvice(data)

Generates detailed farming advice based on environmental data.

#### Parameters

`data` object with the following properties:

- `temperature` (Number): Temperature in °C
- `humidity` (Number): Relative humidity percentage
- `soil_moisture` (Number): Soil moisture reading
- `rainfall` (Boolean/Number): 0/false = not raining, 1/true = raining
- `timestamp` (String): Time of data collection
- `location` (String, optional): Location override

#### Returns

```js
{
  content: String,  // HTML-formatted advice content
  type: "message"
}
```

Or on error:

```js
{
  error: {
    message: String,
    type: String
  },
  type: "error"
}
```

#### Example Usage

```javascript
import { getFarmingAdvice } from "./claude/getFarmingAdvice.js";

const data = {
  temperature: 28.5,
  humidity: 65,
  soil_moisture: 0.42,
  rainfall: false,
  timestamp: new Date().toISOString(),
};

const advice = await getFarmingAdvice(data);
```

### takeIoTAction(data)

Analyzes environmental data and returns a simple action recommendation.

#### Parameters

`data` object with the following properties:

- `temperature` (Number): Temperature in °C
- `humidity` (Number): Relative humidity percentage
- `soil_moisture` (Number): Soil moisture reading
- `rain` (Number): Rain measurement in mm
- `timestamp` (String): Time of data collection
- `location` (String): Location of the sensor

#### Returns

A string with one of these values:

- `"watering"` - Soil needs irrigation
- `"call"` - Farmer attention needed
- `"null"` - No action needed

#### Example Usage

```javascript
import { takeIoTAction } from "./claude/takeIoTAction.js";

const data = {
  temperature: 32,
  humidity: 45,
  soil_moisture: 0.2,
  rain: 0,
  timestamp: new Date().toISOString(),
  location: "Central Province",
};

const action = await takeIoTAction(data);
```

## Implementation Details

### Farming Advice Format

The farming advice output is formatted as HTML organized into four sections:

1. **Crop Recommendations** - Suitable crops for current conditions
2. **Irrigation Needs** - Watering guidance based on conditions
3. **Pest Risks** - Potential pest threats and mitigation
4. **Planting Guidance** - Timing and technique recommendations

### Action Determination Process

The action recommendation process:

1. Fetches additional context (weather & news)
2. Combines sensor data with context
3. Uses Claude AI to determine appropriate action
4. Sends notifications through the ntfy service
5. Returns the action decision for automation

## Claude Models

- `getFarmingAdvice.js` uses: `claude-3-haiku-20240307`
- `takeIoTAction.js` uses: `claude-3-haiku-20240307`

## External Dependencies

- **@anthropic-ai/sdk** - Claude API client
- **dotenv** - Environment variable management
- **ntfy.js** - Notification service integration
