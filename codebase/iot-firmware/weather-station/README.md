# Weather Station Implementation

This folder contains the main implementation of the IoT weather station using Arduino Mega 2560 and NodeMCU V3 working together.

## System Overview

The weather station is implemented using a dual-microcontroller architecture:

- **Arduino Mega 2560**: Handles sensor data collection, local display, and SD card logging
- **NodeMCU V3**: Manages WiFi connectivity and cloud API communication

### Hardware Components

| Component              | Connected To | Purpose                        |
| ---------------------- | ------------ | ------------------------------ |
| DHT11                  | Mega Pin 2   | Temperature & Humidity sensing |
| Soil Moisture Sensor   | Mega Pin A0  | Soil moisture measurement      |
| Rain Sensor            | Mega Pin A1  | Rain detection                 |
| Fire Sensor            | Mega Pin 6   | Fire/flame detection           |
| SD Card Module         | Mega Pin 10  | Data logging                   |
| OLED Display (Mega)    | Mega I2C     | Local data display             |
| OLED Display (NodeMCU) | NodeMCU I2C  | Network status display         |

### Detailed Pin Configuration

#### Arduino Mega 2560

- **DHT11**

  - Data → Pin 2
  - VCC → 5V
  - GND → GND

- **Soil Moisture Sensor**

  - Analog Out → A0
  - VCC → 5V
  - GND → GND

- **Rain Sensor**

  - Analog Out → A1
  - VCC → 5V
  - GND → GND

- **Fire Sensor**

  - Digital Out → Pin 6
  - VCC → 5V
  - GND → GND

- **SD Card Module**

  - MOSI → Pin 51
  - MISO → Pin 50
  - SCK → Pin 52
  - CS → Pin 10
  - VCC → 5V
  - GND → GND

- **OLED Display (Mega)**

  - SDA → Pin 20 (SDA)
  - SCL → Pin 21 (SCL)
  - VCC → 5V
  - GND → GND

- **Serial Connection to NodeMCU**
  - TX1 → NodeMCU RX
  - RX1 → NodeMCU TX

#### NodeMCU V3

- **OLED Display**

  - SDA → D2 (GPIO4)
  - SCL → D1 (GPIO5)
  - VCC → 3.3V
  - GND → GND

- **Serial Connection to Mega**
  - RX → Mega TX1
  - TX → Mega RX1
  - GND → Mega GND

### Display Specifications

#### OLED Display (Both)

- Type: SSD1306
- Resolution: 128x64 pixels
- I2C Address: 0x3C
- Interface: I2C
- Power: 3.3V-5V compatible

### Display Content

#### Arduino Mega OLED

Shows sensor data in real-time:

```
Temp: 23.5 C
Hum: 45.2 %
Soil: 78 %
Rain: YES/NO
Fire: YES/NO
```

#### NodeMCU OLED

Shows network status:

```
WiFi: Connected
API: Sending...
Last: Success/Fail
```

## Implementation Details

### Arduino Mega 2560 (`arduinoMega2560/`)

- Handles all sensor interactions
- Displays data on OLED screen
- Logs data to SD card
- Sends formatted JSON data to NodeMCU via Serial1
- Sampling interval: 10 seconds

Features:

- Temperature and humidity monitoring
- Soil moisture percentage calculation
- Rain detection with analog threshold
- Fire detection (digital)
- SD card data logging
- OLED status display

### NodeMCU V3 (`nodeMcuV3/`)

- Manages WiFi connectivity
- Receives JSON data from Arduino Mega
- Sends data to cloud API
- Displays connection status on OLED

Features:

- WiFi connection management
- HTTP POST requests to API
- Error handling and status display
- Configurable through `config.h`

## Communication Flow

1. Arduino Mega reads sensors every 10 seconds
2. Data is displayed on Mega's OLED and logged to SD
3. JSON formatted data sent to NodeMCU via Serial
4. NodeMCU receives and forwards data to cloud API
5. Status of transmission shown on NodeMCU's OLED

## Data Formats

### JSON Format

```json
{
  "temperature": 23.5,
  "humidity": 45.2,
  "soil_moisture": 78,
  "soil_raw": 225,
  "rain": 1,
  "rain_raw": 320,
  "fire": true
}
```

### SD Card Log Format

```
T:23.50, H:45.20, Soil:78, SoilRaw:225, Rain:1, RainRaw:320, Fire:1
```

## Configuration

### NodeMCU (`config.h`)

- WiFi SSID and password
- API host and endpoint
- Default values can be modified in `config.h`

## Installation & Setup

1. Flash Arduino Mega with `arduinoMega2560.ino`
2. Flash NodeMCU with `nodeMcuV3.ino`
3. Connect components according to pin configuration
4. Update `config.h` with WiFi and API details
5. Power up both controllers

## Dependencies

### Arduino Mega Libraries

- DHT sensor library
- Adafruit GFX
- Adafruit SSD1306
- SPI (built-in)
- SD (built-in)
- Wire (built-in)

### NodeMCU Libraries

- ESP8266WiFi
- ESP8266HTTPClient
- Adafruit GFX
- Adafruit SSD1306
- Wire (built-in)

## Troubleshooting

### Common Issues

1. **No OLED Display**

   - Check I2C connections
   - Verify display address (default 0x3C)

2. **WiFi Connection Fails**

   - Verify credentials in `config.h`
   - Check WiFi signal strength
   - Reset NodeMCU

3. **No Sensor Data**
   - Check sensor pin connections
   - Verify power supply
   - Check Serial connection between Mega and NodeMCU

### LED Indicators

- NodeMCU LED flashing: Attempting WiFi connection
- NodeMCU LED steady: WiFi connected
- Mega LED (13): Flashes on data transmission

## Testing and Verification

### Hardware Testing Sequence

1. **Power-Up Test**

   - Power on Arduino Mega
   - Verify OLED displays initialization message
   - Check if SD card is initialized
   - Power on NodeMCU
   - Verify NodeMCU OLED shows WiFi connection status

2. **Sensor Verification**

   - DHT11: Values should be within realistic range (15-35°C, 20-90% humidity)
   - Soil Sensor:
     - Dry soil: ~800-1023 raw (0-20%)
     - Wet soil: ~0-300 raw (70-100%)
   - Rain Sensor:
     - Dry: >800 raw
     - Wet: <500 raw
   - Fire Sensor:
     - Normal: HIGH
     - Fire detected: LOW

3. **Communication Test**
   ```bash
   # Monitor Serial output on Mega
   Speed: 9600 baud
   Expected: JSON data every 10 seconds
   ```

```

### Verification Checklist

- [ ] Both OLED displays working
- [ ] All sensors reporting valid data
- [ ] SD card logging data correctly
- [ ] WiFi connecting successfully
- [ ] API receiving and storing data
- [ ] System running stably for >24 hours

### Performance Metrics

- Sampling Rate: Every 10 seconds
- Data Upload Success Rate: >95%
- Temperature Accuracy: ±2°C
- Humidity Accuracy: ±5%
- Power Consumption: ~200mA average

### Error Codes

#### Arduino Mega
- E01: SD card initialization failed
- E02: DHT sensor not responding
- E03: Serial communication error
- E04: OLED display error

#### NodeMCU
- E11: WiFi connection failed
- E12: API connection timeout
- E13: Data parsing error
- E14: OLED display error

## Future Improvements
1. Implement data buffering on NodeMCU for offline operation
2. Add battery monitoring
3. Implement deep sleep for power saving
4. Add error recovery mechanisms
5. Implement OTA updates
```
