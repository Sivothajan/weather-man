# API Test Documentation for Weather Man API

## Overview

This document provides detailed documentation for the test suite in `api.test.js` which validates the functionality of the Weather Man API endpoints. The test suite uses Mocha as the test framework with Chai for assertions and Supertest for making HTTP requests. Sinon is used for mocking and stubbing dependencies.

## Test Setup

The test suite imports the following libraries and modules:

- **supertest**: For making HTTP requests to the API endpoints
- **sinon**: For creating stubs and mocks of functions
- **chai**: For assertions (using the `expect` interface)
- **app** (from "../api/router.js"): The Express application under test
- Various utility and service modules that the API depends on:
  - `getTime.js`: Utilities for timestamp handling
  - `addToDb.js`: Database insertion functions
  - `getDataFromDb.js`: Database retrieval functions
  - `getFarmingAdvice.js`: AI advice generation functions
  - `takeIoTAction.js`: IoT control functions

After each test, Sinon restores all stubs to avoid interference between tests.

## Test Groups

### 1. GET /api/check

**Purpose**: Tests the health/status endpoint of the API.

**Test Cases**:

- Verifies that the endpoint returns HTTP 200 status
- Confirms the response includes the correct message indicating the API is working
- Checks that the proper `x-robots-tag` header is set to prevent search engine indexing

### 2. GET /api/get/:number

**Purpose**: Tests the endpoint that retrieves a specified number of records from the database.

**Test Cases**:

- Validates that non-numeric parameters return HTTP 400 status
- Ensures that request for zero or negative numbers returns HTTP 400 status
- Confirms that valid requests return the correct data structure with HTTP 200 status

### 3. GET /farming-advice

**Purpose**: Tests the AI-powered farming advice endpoint.

**Test Cases**:

- Verifies that database errors result in HTTP 500 status
- Confirms that empty datasets lead to appropriate HTTP 500 status
- Ensures successful requests return AI-generated farming advice with HTTP 200 status
- Validates error handling when the AI advice generation fails

### 4. GET /take-action

**Purpose**: Tests the IoT action recommendation endpoint.

**Test Cases**:

- Verifies database query failures return appropriate HTTP 500 status with error message
- Ensures empty datasets are properly handled with HTTP 500 status
- Confirms successful action recommendations return HTTP 200 status with proper message
- Validates error handling for null/undefined action data
- Ensures exceptions in the IoT action module are properly caught and reported

### 5. POST /data/add

**Purpose**: Tests the data ingestion endpoint used by IoT devices to submit sensor data.

**Test Cases**:

- Confirms successful data addition returns HTTP 201 status with confirmation message
- Verifies database insertion failures are properly reported with HTTP 500 status
- Ensures exception handling works correctly for unexpected errors

### 6. OPTIONS /

**Purpose**: Tests the CORS preflight response handling.

**Test Cases**:

- Confirms OPTIONS requests get appropriate status code (200 or 204)
- Verifies CORS headers are correctly set with `access-control-allow-origin: *`

## Mock Strategy

The tests extensively use Sinon to isolate the API routes from their dependencies:

1. Database functions are stubbed to return predictable responses
2. AI functions are stubbed to avoid actual API calls during testing
3. Time functions are stubbed for consistent timestamps

## Running the Tests

To run these tests:

```bash
# Navigate to the cloud-api directory
cd path/to/weather-man/codebase/cloud-api

# Install dependencies if not already installed
npm install

# Run the tests
npm test
```

## Adding New Tests

When adding functionality to the API:

1. Create new test cases following the existing pattern
2. Stub any new dependencies
3. Test both success and error conditions
4. Ensure existing tests still pass

## Note on Test Coverage

These tests cover:

- Input validation
- Error handling
- Success paths
- HTTP status codes
- Response format validation

For comprehensive testing, consider adding:

- More edge cases
- Performance tests
- Integration tests with actual services
