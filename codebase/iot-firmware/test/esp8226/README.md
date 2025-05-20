# ESP8266 Weather Station Test Firmware

This directory contains test firmware for the Weather Man project's ESP8266-based weather station.

## Overview

This test firmware implements basic WiFi connectivity and HTTPS API communication for the Weather Man project. It serves as a proof-of-concept for connecting the ESP8266 to our cloud API.

## Hardware Requirements

- ESP8266 board (NodeMCU or similar)
- USB cable for programming
- Power supply

## Software Requirements

- Arduino IDE
- ESP8266 board support package
- Required libraries:
  - ESP8266WiFi
  - WiFiClientSecure

## Configuration

Network and API settings are configured in `config.test.h`. Update the following variables as needed:

- `ssid`: Your WiFi network name
- `password`: Your WiFi password
- `host`: API host domain
- `path`: API endpoint path
- `httpsPort`: HTTPS port (default: 443)

## Setup Instructions

1. Install Arduino IDE and ESP8266 board package
2. Install required libraries through Arduino Library Manager
3. Configure your network settings in `config.test.h`
4. Connect your ESP8266 board
5. Upload the firmware
6. Monitor the serial output at 9600 baud

## Expected Operation

On startup, the device will:

1. Connect to the configured WiFi network
2. Establish a secure connection to the API server
3. Send a test GET request
4. Print the response to the serial monitor

## Security Note

This test firmware uses `setInsecure()` to skip certificate verification. Production firmware should implement proper certificate validation.
