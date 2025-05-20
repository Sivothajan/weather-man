# 🌦️ Weather Station - Arduino Mega 2560 Version (OLED Only)

This project uses the **Arduino Mega 2560** as the primary controller for a weather monitoring system. It reads sensor data, logs it to an SD card, displays it on an **I2C OLED**, and sends the data over serial to a **NodeMCU** (ESP8266), which forwards it via HTTP to a remote server.

---

## 📋 Features

- 🌡️ **Temperature & Humidity** via DHT11 sensor
- 🌱 **Soil Moisture** (percentage + raw value)
- ☔ **Rain Detection** (digital + raw analog value)
- 🔥 **Fire Detection** (digital input)
- 🖥️ **Live display** on OLED (128x64 I2C)
- 💾 **Data logging** to SD card (`datalog.txt`)
- 📡 **HTTP POST** via NodeMCU (ESP8266) using serial communication

---

## 🧰 Hardware Required

| Component                         | Quantity | Notes                      |
| --------------------------------- | -------- | -------------------------- |
| Arduino Mega 2560                 | 1        | Main controller            |
| DHT11 Sensor                      | 1        | Temp & humidity            |
| Soil Moisture Sensor              | 1        | Analog type                |
| Rain Sensor (Analog)              | 1        | Analog output              |
| Fire Sensor/Module                | 1        | Digital output to pin 6    |
| I2C OLED Display (SSD1306 128x64) | 1        | For real-time data display |
| NodeMCU (ESP8266)                 | 1        | Sends data to the server   |
| SD Card Module                    | 1        | SPI-based SD logging       |
| External Power Supply (12V)       | 1        | NodeMCU needs it stable    |
| Power Supply (12V)                | 1        | For Arduino Mega           |

---

## 🔌 Pin Connections

### DHT11 Sensor

- VCC → 5V
- GND → GND
- DATA → D2

### Soil Moisture Sensor

- VCC → 5V
- GND → GND
- A0 → A0

### Rain Sensor

- VCC → 5V
- GND → GND
- A0 → A1

### Fire Sensor

- VCC → 5V
- GND → GND
- DO → D6

### I2C OLED (SSD1306)

- SDA → 20 (SDA)
- SCL → 21 (SCL)
- VCC → 5V
- GND → GND

### SD Card Module

- CS → 10
- MOSI → 51
- MISO → 50
- SCK → 52
- VCC → 5V
- GND → GND

### NodeMCU (ESP8266)

- Mega TX1 (Pin 18) → NodeMCU RX (D7/GPIO13)
- Mega RX1 (Pin 19) ← NodeMCU TX (D8/GPIO15)
- GND ↔ GND (Common Ground)
- VCC → External 3.3V Regulator or 12V to VIN (NOT direct from Mega 5V!)

---

## 📤 Data Format (Sent from Mega → NodeMCU)

```json
{
  "temperature": 26.45,
  "humidity": 65.12,
  "soil_moisture": 42,
  "soil_raw": 512,
  "rain": 1,
  "rain_raw": 320,
  "fire": false
}
```

---

## ⚙️ Configuration

Create a `config.h` file (for the **NodeMCU**) like:

```cpp
#ifndef CONFIG_H
#define CONFIG_H

const char *ssid = "Your_SSID";
const char *password = "Your_PASSWORD";
const char *apiHost = "yourapi.com";
const char *apiPath = "/add";

#endif
```

---

## ⚠️ Important Notes

1. NodeMCU should **not share power** with the Mega — use external 3.3V or regulator module.
2. SD card module must use **SPI pins** on Mega (50-53).
3. OLED must connect to **I2C hardware pins** (20-SDA, 21-SCL).
4. Serial1 (Mega TX1/RX1) used to communicate with NodeMCU. Avoid Serial (USB debug) for data.
5. Ensure **common ground** between Mega and NodeMCU.
6. **Keep logs compact** to extend SD card life and avoid buffer issues.
7. JSON strings sent should be terminated properly (`\n`) for parsing by NodeMCU.
