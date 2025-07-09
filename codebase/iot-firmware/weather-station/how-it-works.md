# Weather Station: How It Works

This document provides a detailed explanation of how the Arduino Weather Station system operates, from sensor data acquisition to cloud API integration.

## System Overview

The weather station is a sophisticated IoT device built using an Arduino Mega 2560 and NodeMCU that:

- Collects environmental data (temperature, humidity, soil moisture, rain, fire detection)
- Displays information on an OLED display
- Logs data to an SD card
- Transmits data to a cloud API via WiFi

## Hardware Components

- Arduino Mega 2560 (Main controller)
- NodeMCU V3 (WiFi communication)
- DHT11 Temperature & Humidity Sensor
- Soil Moisture Sensor
- Rain Sensor
- Fire Detection Sensor
- SSD1306 OLED Display
- SD Card Module

## Pin Configuration

- DHT11: Pin 2
- Soil Moisture: Pin A0
- Rain Sensor: Pin A1
- Fire Sensor: Pin 6
- SD Card CS: Pin 10
- OLED Display: I2C (SDA/SCL)
- NodeMCU Communication: Serial1 (Mega) to D6/D5 (NodeMCU)

## Hardware Architecture

![System Architecture](../../../assets/System-Architecture-Diagram.png)

_Note: If the image above doesn't display correctly, please check the assets folder for the System Architecture Diagram._

## Firmware Operation

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

## Sensor Processing

- Soil Moisture: Converted to 0-100% (0% dry, 100% wet)
- Rain: Binary detection below 500 threshold
- Fire: Active-low digital signal

## Communication Protocol

### Arduino to NodeMCU

- Serial communication at 9600 baud
- JSON string format
- Newline termination

### NodeMCU to Cloud

- HTTPS POST requests
- JSON content type
- Secure connection (SSL/TLS)

## Error Handling & Display

- Sensor errors default to safe values (25°C, 50% RH)
- Failed operations logged to Serial
- System continues with degraded functionality
- OLED shows all sensor readings in real-time

## Timing Example

Here's a detailed breakdown of a typical 10-second operation cycle:

```
0.0s - 0.5s:  Sensor Data Collection
               - DHT11 read (0.25s)
               - Soil moisture read (0.05s)
               - Rain sensor read (0.05s)
               - Fire sensor read (0.05s)

0.5s - 1.0s:  Data Processing
               - Convert raw values
               - Apply thresholds
               - Format data

1.0s - 3.0s:  Display Sequence
               - Screen 1: Temperature & Humidity (0.7s)
               - Screen 2: Soil & Rain Data (0.7s)
               - Screen 3: Fire Status (0.6s)

3.0s - 4.0s:  SD Card Operations
               - Open file (0.3s)
               - Write data (0.4s)
               - Close file (0.3s)

4.0s - 5.5s:  WiFi Communication
               - Format JSON (0.2s)
               - Establish connection (0.5s)
               - Send data (0.5s)
               - Receive response (0.3s)

5.5s - 10.0s: Idle/Wait Period
               - System delay (4.5s)
               - Allows for timing variations
               - Ensures consistent 10s cycle
```

This timing may vary slightly based on:

- Network conditions
- SD card write speed
- Sensor response times
- System load

Total Cycle: 10 seconds (5.5s active operations + 4.5s delay)

## System Requirements & Configuration

### Power & Performance

- 5V DC power supply (500mA minimum)
- 10-second update cycle
- Real-time display updates

### Configuration

System configured via `config.h`:

```cpp
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const char* apiHost = "your.api.host";
const char* apiPath = "/api/endpoint";
```

### Diagnostics

Monitor system via:

- OLED display
- Serial console
- SD card logs
- API responses

## Sensor Limitations

- DHT11 temperature accuracy: ±2°C
- DHT11 humidity accuracy: ±5% RH
- Soil moisture sensor: Requires occasional recalibration
- Rain sensor: Binary detection, not rainfall amount
- Fire sensor: Line-of-sight detection only

## Power Requirements

The system requires a stable 5V power source, with at least 500mA current capacity to power all components reliably, especially when the WiFi module is transmitting data.
