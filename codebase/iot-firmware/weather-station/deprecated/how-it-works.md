# Weather Station: How It Works

This document provides a detailed step-by-step explanation of how the Arduino Weather Station system operates, from sensor data acquisition to cloud API integration.

## System Overview

The weather station is an Arduino-based IoT device that:

- Collects environmental data (temperature, humidity, soil moisture, rain, fire detection)
- Displays information on an LCD screen
- Logs data to an SD card
- Transmits data to a cloud API

## Hardware Architecture

![System Architecture](../../../assets/System-Architecture-Diagram.png)

_Note: If the image above doesn't display correctly, please check the assets folder for the System Architecture Diagram._

## Firmware Operation Sequence

### 1. Initialization Phase

When the Arduino is powered on or reset, the following initialization sequence occurs:

```
setup() {
  1. Initialize Serial communication (9600 baud)
  2. Initialize ESP8266 Serial communication (9600 baud)
  3. Initialize DHT temperature/humidity sensor
  4. Initialize LCD display (16x2 I2C)
  5. Configure Fire sensor pin as INPUT
  6. Display "Weather Man" welcome message for 2 seconds
  7. Initialize SD card module (CS on pin 10)
  8. Connect to WiFi network using credentials from config.h
}
```

### 2. Main Operation Loop

Once initialization is complete, the system enters an endless loop that executes the following steps every 10 seconds:

#### 2.1. Sensor Data Collection

- Read temperature (°C) from DHT11 sensor
- Read humidity (%) from DHT11 sensor
- Read raw soil moisture value from analog pin A0
- Read raw rain sensor value from analog pin A1
- Read fire detection status from digital pin 6

#### 2.2. Data Processing

- Convert raw soil moisture reading (1023-0) to percentage (0-100%)
- Determine rain status based on threshold (rainRaw < 500 = rain detected)

#### 2.3. LCD Display Sequence

The LCD cycles through three different information screens, each displayed for 2 seconds:

1. **Processed Values Screen**
   - Temperature and humidity on the top row
   - Soil moisture percentage and rain status on the bottom row

2. **Raw Values Screen**
   - Raw soil moisture reading on the top row
   - Raw rain sensor reading on the bottom row

3. **Fire Detection Screen**
   - Fire status ("FIRE!" or "NoFire") on the top row

#### 2.4. Serial Console Reporting

- Output all sensor values (both processed and raw) to Serial monitor
- Format: `T: [temp] H: [humid] Soil: [soil] (Raw: [soilRaw]) Rain: [rain] (Raw: [rainRaw]) Fire: [fire status]`

#### 2.5. Data Logging to SD Card

- Open "datalog.txt" file in append mode
- Write all sensor values in a comma-separated format
- Close file to save changes

#### 2.6. Data Transmission to Cloud API

- Format sensor data as a JSON object
- Set up a TCP connection to the API server (defined in config.h)
- Create an HTTP POST request with the JSON payload
- Send the request to the API server
- Close the connection

#### 2.7. Cycle Delay

- Wait an additional 4 seconds before starting the next cycle
- Total cycle time: 10 seconds (2s + 2s + 2s + 4s)

## Data Formats

### SD Card Log Format

```
T:23.50, H:45.20, Soil:78, SoilRaw:225, Rain:1, RainRaw:320, Fire:0
```

### API JSON Format

```json
{
  "temperature": 23.5,
  "humidity": 45.2,
  "soil_moisture": 78,
  "soil_raw": 225,
  "rain": 1,
  "rain_raw": 320,
  "fire": 0
}
```

## WiFi Connection Process

### Initial Connection

1. Set ESP8266 to station mode with `AT+CWMODE=1`
2. Connect to WiFi network using `AT+CWJAP="SSID","PASSWORD"`
3. Wait 8 seconds for connection to establish

### API Transmission Process

1. Establish TCP connection to API server: `AT+CIPSTART="TCP","[apiHost]",80`
2. Prepare HTTP POST request with JSON payload
3. Send data length with `AT+CIPSEND=[length]`
4. Send the actual HTTP request and JSON data
5. Close connection with `AT+CIPCLOSE`

## Data Processing Details

### Soil Moisture Calculation

```
soil = map(soilRaw, 1023, 0, 0, 100)
```

- The raw analog value is inversely proportional to moisture
- 1023 (dry) maps to 0%
- 0 (wet) maps to 100%

### Rain Detection Logic

```
bool rain = rainRaw < 500
```

- The rain sensor returns lower values when water is detected
- Values below 500 indicate rain presence

### Fire Detection

```
bool fireDetected = digitalRead(FIRE_PIN) == LOW
```

- The fire sensor module outputs LOW when fire/flame is detected
- Normal state (no fire) is HIGH

## Troubleshooting and Diagnostics

The system provides multiple feedback channels to help diagnose issues:

1. **LCD Display**: Shows real-time sensor readings and status
2. **Serial Console**: Outputs all data for debugging
3. **SD Card Log**: Maintains historical data records
4. **API Response**: Can be monitored via serial monitor

## Configuration

All customizable parameters are stored in `config.h`:

- WiFi credentials (SSID and password)
- API server host and path
- Sensor thresholds and calibration values (if applicable)

## Sensor Limitations

- DHT11 temperature accuracy: ±2°C
- DHT11 humidity accuracy: ±5% RH
- Soil moisture sensor: Requires occasional recalibration
- Rain sensor: Binary detection, not rainfall amount
- Fire sensor: Line-of-sight detection only

## Power Requirements

The system requires a stable 5V power source, with at least 500mA current capacity to power all components reliably, especially when the WiFi module is transmitting data.
