## The Weather Man – IoT-Based Smart Weather Monitoring System

![Scratch](./assets/System-Architecture-Diagram.png)
Figure 1: Weather Man System Overview

---

### Description

**The Weather Man** is an IoT-based smart weather monitoring system available in two implementations:

#### 1. NodeMCU V3 Version

- All-in-one solution with built-in WiFi
- SPIFFS-based local data logging
- 3.3V logic level throughout
- Compact and power-efficient design

#### 2. Arduino Mega 2560 Version

- Robust solution with external WiFi module
- **Display**: OLED 128x64 for detailed visualization
- SD card-based data logging
- 5V logic level with level shifting
- Extensive I/O capabilities

Both versions collect:

- Temperature and humidity (DHT11)
- Soil moisture (capacitive sensor)
- Rainfall detection
- Fire detection
- Real-time data visualization
- Cloud API integration

The system's modular architecture makes it ideal for:

- **Educational**: Learning about IoT, sensors, and data collection
- **Agricultural**: Monitoring soil conditions and environmental factors
- **Research**: Long-term environmental data collection and analysis

#### Technical Specifications

##### NodeMCU V3 Implementation

- **Controller**: ESP8266 with built-in WiFi
- **Storage**: SPIFFS file system
- **Power**: 3.3V logic, USB powered (500mA)
- **Measurement Interval**: 10-second cycle
- **Data Format**: JSON over HTTP POST

##### Arduino Mega 2560 Implementation

- **Controller**: ATmega2560 + ESP8266 WiFi
- **Display**: OLED 128x64 (I2C interface)
- **Storage**: SD card logging
- **Power**: 5V logic, 12V input
- **Measurement Interval**: 10-second cycle
- **Data Format**: JSON over HTTP POST

---

### Project Links

- [Project Web-App](https://wm.sivothajan.me/)
- [Project API](https://wm.api.sivothajan.me/)
- [Project Documentation](https://gh.sivothajan.me/weather-man/)
- [Project Update Post on TheCN ePortfolio](https://www.thecn.com/SS4922/section/showcase/681252d15bc51c0abd08d563)

---

### Team Members <sub>(Ordered by ascending Student IDs)</sub>

| Name        | Student ID |
| ----------- | ---------- |
| Afra        | S/21/005   |
| Hana        | S/21/063   |
| Mundhira    | S/21/102   |
| Anshaf      | S/21/315   |
| Arani       | S/21/317   |
| Danshika    | S/21/340   |
| Premasalini | S/21/466   |
| Romesh      | S/21/489   |
| Shahama     | S/21/490   |
| Sivothayan  | S/21/513   |

---

### Current Progress

#### PS: For earlier versions, check the [April 30, 2025 GitHub Repo](https://github.com/Sivothajan/weather-man/tree/31057a6575f7ccb06b0e44e5aa5a5fb1c9c69691)

#### 🔧 Hardware Setup

##### NodeMCU V3 Version Components

| Component             | Description            | Purpose                     |
| --------------------- | ---------------------- | --------------------------- |
| NodeMCU V3 (ESP8266)  | Main controller + WiFi | Processing and connectivity |
| DHT11 Sensor          | Temperature & humidity | Environmental monitoring    |
| Soil Moisture Sensor  | Analog type            | Soil condition monitoring   |
| Rain Sensor (Analog)  | Analog output          | Rainfall detection          |
| Fire Sensor/Module    | Digital output         | Fire/flame detection        |
| USB Power Supply (5V) | Via USB or external    | Power delivery              |

##### Arduino Mega 2560 Version Components

| Component             | Description            | Purpose                   |
| --------------------- | ---------------------- | ------------------------- |
| Arduino Mega 2560     | Main controller        | Core processing           |
| NodeMCU V3 (ESP8266)  | WiFi module            | Wireless connectivity     |
| DHT11 Sensor          | Temperature & humidity | Environmental monitoring  |
| Soil Moisture Sensor  | Analog type            | Soil condition monitoring |
| Rain Sensor           | Analog output          | Rainfall detection        |
| Fire Sensor/Module    | Digital output         | Fire/flame detection      |
| OLED Display (128x64) | I2C interface          | Data visualization        |
| SD Card Module        | SPI interface          | Data logging              |
| Power Supply (12V)    | External adapter       | System power              |

> **Note:**
>
> - Both versions use similar sensors but different display and storage solutions
> - NodeMCU version operates at 3.3V logic level
> - Arduino Mega version operates at 5V logic level
> - Components should be matched to the appropriate voltage level

#### Pin Configuration

##### NodeMCU V3 Version

| Component     | NodeMCU Pin | GPIO   | Type    | Description                 |
| ------------- | ----------- | ------ | ------- | --------------------------- |
| DHT11         | D2          | GPIO4  | Digital | Temperature & Humidity Data |
| Soil Moisture | A0          | ADC    | Analog  | Soil Moisture Reading       |
| Rain Sensor   | D5          | GPIO14 | Digital | Rain Detection              |
| Fire Sensor   | D6          | GPIO12 | Digital | Fire/Flame Detection        |

##### Arduino Mega 2560 Version

| Component     | Arduino Pin | Type    | Description                 |
| ------------- | ----------- | ------- | --------------------------- |
| DHT11         | 2           | Digital | Temperature & Humidity Data |
| ESP8266 RX    | 3           | Digital | WiFi Module Serial RX       |
| ESP8266 TX    | 4           | Digital | WiFi Module Serial TX       |
| Fire Sensor   | 6           | Digital | Fire/Flame Detection        |
| SD Card CS    | 10          | Digital | SD Card Chip Select         |
| SD Card MOSI  | 51          | Digital | SPI MOSI                    |
| SD Card MISO  | 50          | Digital | SPI MISO                    |
| SD Card SCK   | 52          | Digital | SPI Clock                   |
| OLED SDA      | 20          | Digital | I2C Data (Hardware)         |
| OLED SCL      | 21          | Digital | I2C Clock (Hardware)        |
| Soil Moisture | A0          | Analog  | Soil Moisture Reading       |
| Rain Sensor   | A1          | Analog  | Rain Detection              |

#### Implementation-Specific Details

##### NodeMCU V3 Version

- **Storage**: SPIFFS file system for local logging
- **WiFi**: Built-in ESP8266 WiFi module
- **Power**: Single 5V USB supply sufficient
- **ADC**: Single analog input (A0) available
- **Logic**: 3.3V throughout, no level shifting needed

##### Arduino Mega Version

- **Storage**: SD card for robust data logging
- **WiFi**: External ESP8266 module via UART
- **Display**: OLED 128x64 for detailed visualization
- **Power**: Separate supplies for Arduino and WiFi
- **ADC**: Multiple analog inputs available
- **Logic**: 5V system with level shifting for WiFi

#### Common Data Processing

- **Soil Moisture**: Raw values (1023-0) mapped to percentage (0-100%)
- **Rain Detection**: Threshold-based (< 500 indicates rain)
- **Fire Detection**: Digital LOW indicates fire presence
- **Data Sampling**: Every 10 seconds with comprehensive logging

#### Sensor Limitations

- **DHT11**: Temperature accuracy ±2°C, Humidity accuracy ±5% RH
- **Soil Moisture**: Requires periodic recalibration for accurate readings
- **Rain Sensor**: Binary detection only (not rainfall amount)
- **Fire Sensor**: Line-of-sight detection, limited range

#### Configuration

All customizable parameters are stored in `config.h`:

- WiFi credentials (SSID and password)
- API server host and path
- Sensor thresholds and calibration values

#### Troubleshooting

The system provides multiple diagnostic channels:

1. **OLED Display**: Real-time sensor readings and status
2. **Serial Console**: Detailed debugging output (9600 baud)
3. **SD Card Log**: Historical data in CSV format
4. **API Response**: Monitored via serial console

---

#### 🧠 Software Implementation

##### Operation Sequence

1. **Initialization**

   - Serial communication (9600 baud)
   - ESP8266 WiFi module setup
   - DHT sensor initialization
   - OLED display configuration
   - SD card module setup
   - WiFi network connection

2. **Main Loop (10-second cycle)**
   - Sensor data collection
   - Data processing and conversion
   - OLED display updates (3 screens, 2s each)
   - Serial debug output
   - SD card logging
   - API data transmission
   - 4-second processing delay

##### Data Formats

1. **SD Card Log Format**

```
T:23.50, H:45.20, Soil:78, SoilRaw:225, Rain:1, RainRaw:320, Fire:0
```

2. **API JSON Format**

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

##### Data Formats and Storage

1. **SD Card Logging Format**

```
T:23.50, H:45.20, Soil:78, SoilRaw:225, Rain:1, RainRaw:320, Fire:0
```

2. **API JSON Format**

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

##### OLED Display Sequence (10s cycle)

1. **Primary Display** (2s)

   - Line 1: Temperature and Humidity
   - Line 2: Soil Moisture % and Rain Status

2. **Raw Values** (2s)

   - Line 1: Raw Soil Moisture
   - Line 2: Raw Rain Sensor

3. **Status Display** (2s)

   - Line 1: Fire Detection Status
   - Line 2: System Status

4. **Processing Time** (4s)
   - Data logging
   - API transmission
   - Sensor refresh

##### Implementation Status

| Feature                     | Status    | Notes                                       |
| --------------------------- | --------- | ------------------------------------------- |
| Sensor Reading              | Completed | All sensors tested and operational          |
| API Data Transmission       | Completed | All APIs tested and operational             |
| Database Integration        | Completed | Database set up and tested                  |
| Web App Integration         | Completed | Web app tested and operational              |
| AI Integration (Claude API) | Completed | AI integration tested and operational       |
| SD Card Data Logging        | Completed | SD Card Data Logging tested and operational |
| Documentation               | Completed | User manual and technical documentation     |

---

### 🔍 Component Details

#### Cloud API (`/codebase/cloud-api`)

- **Claude AI Integration**: Smart analysis of weather data for farming advice and automated actions
- **Notification System**: Real-time alerts via ntfy for critical weather conditions
- **Database Operations**: Supabase integration for data storage and retrieval
- **API Testing**: Comprehensive test suite for API endpoints

#### IoT Firmware (`/codebase/iot-firmware`)

- **Hardware Testing**: Individual component test suites for reliability
- **Weather Station Variants**:
  - Arduino Mega 2560: Robust implementation with external modules
  - NodeMCU V3: Compact, single-board solution
- **Data Collection**: 10-second sampling cycle with error handling
- **Local Storage**: SD card and SPIFFS implementations

#### Web Application (`/codebase/web-app`)

- **React + Vite**: Modern, fast web application
- **Real-time Updates**: Live weather data visualization
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Robust error boundaries and fallbacks

---

### 📂 Explore the Codebase

You can browse the project source code in the following directories:

- [API Backend](./codebase/cloud-api/) – Handles data processing and cloud integration.
- [IoT Firmware](./codebase/iot-firmware/) – Microcontroller and sensor code.
- [Web Application](./codebase/web-app/) – User interface for monitoring and analytics.

[**View Full Codebase on GitHub**](./codebase/)

---

### 📁 Project Structure

```
weather-man/
├── assets/                      # Project images and diagrams
├── codebase/
│   ├── cloud-api/              # Backend API implementation
│   │   ├── api/
│   │   │   ├── claude/        # AI integration with Claude
│   │   │   ├── ntfy/          # Notification system
│   │   │   ├── supabase/      # Database operations
│   │   │   └── utils/         # Utility functions
│   │   └── test/              # API tests
│   ├── iot-firmware/          # Hardware firmware code
│   │   ├── test/             # Hardware component tests
│   │   └── weather-station/   # Main station implementations
│   │       ├── arduinoMega2560/
│   │       └── nodeMcuV3/
│   └── web-app/               # Frontend React application
│       ├── public/
│       └── src/
│           ├── components/    # Reusable UI components
│           ├── errors/        # Error handling
│           └── pages/         # Application pages
```

---

### 📸 Project Gallery

#### Components Overview

|             Scratch              |              Top View              |              Side View               |
| :------------------------------: | :--------------------------------: | :----------------------------------: |
| ![Scratch](./assets/scratch.jpg) | ![Top View](./assets/top-view.jpg) | ![Side View](./assets/side-view.jpg) |

#### Testing the Components (Overview)

|                  Top View                  |                  Side View                   |
| :----------------------------------------: | :------------------------------------------: |
| ![Top View](./assets/testing-top-view.jpg) | ![Side View](./assets/testing-side-view.jpg) |
