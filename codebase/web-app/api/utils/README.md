# Utils - Helper Functions

This directory contains utility functions that are used across the Weather Man cloud API.

## getTime.js

### Overview

The `getTime.js` file provides a utility function for getting the current date and time formatted to Sri Lanka time zone (Asia/Colombo) in ISO format (YYYY-MM-DD HH:MM:SS).

### Functions

#### `getTime()`

Returns the current date and time in Sri Lanka time zone (UTC+5:30) formatted as an ISO string.

**Returns:**

- `string`: A formatted date-time string in the format "YYYY-MM-DD HH:MM:SS" (24-hour format)

**Example Usage:**

```javascript
import { getTime } from "./utils/getTime.js";

// Get the current time in Sri Lanka time zone
const currentLankaTime = getTime();
console.log(currentLankaTime); // Output example: "2025-05-08 15:30:45"
```

**Implementation Details:**

- Uses the `Intl.DateTimeFormat` API to handle time zone conversion
- Uses the Swedish locale ('sv-SE') to ensure output in ISO format (YYYY-MM-DD)
- Time is returned in 24-hour format (hour12: false)
