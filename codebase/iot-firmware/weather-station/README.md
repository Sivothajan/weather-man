# 🌦️ Arduino Weather Station with SD Logging & API Upload

This project is a simple yet functional **Weather Monitoring System** built using an **Arduino Mega 2560**. It measures **temperature**, **humidity**, **soil moisture**, and **rain presence**, logs data to an SD card, and sends it to a remote server via **ESP8266 WiFi**.

---

## 📋 Features

- 🌡️ **Temperature & Humidity** via DHT11 sensor  
- 🌱 **Soil Moisture** in percentage  
- ☔ **Rain Detection** using analog rain sensor  
- 📟 **Live display** on I2C 16x2 LCD  
- 💾 **Data logging** to SD card (`datalog.txt`)  
- 📡 **HTTP POST** JSON data to a remote API over WiFi (ESP-01)

---

## 🧰 Hardware Required

| Component             | Quantity | Notes                            |
|----------------------|----------|----------------------------------|
| Arduino Mega 2560    | 1        | Main microcontroller             |
| DHT11 Sensor         | 1        | For temperature & humidity       |
| Soil Moisture Sensor | 1        | Analog type                      |
| Rain Sensor (Analog) | 1        | Outputs analog value             |
| I2C LCD (16x2)       | 1        | Uses I2C (0x27 address)          |
| ESP-01 (ESP8266)     | 1        | For WiFi connection              |
| SD Card Module       | 1        | SPI-based SD logging             |
| Breadboard + Wires   | As needed|                                  |
| 3.3V Regulator/Logic Level Shifter | 1 | For ESP-01 TX/RX safety     |
| Power Supply (5V)    | 1        | USB or external                  |

---

## 🔌 Hardware Connections

### DHT11 Sensor
| DHT11 Pin | Arduino Mega Pin |
|-----------|------------------|
| VCC       | 5V               |
| GND       | GND              |
| DATA      | D2               |

### Soil Moisture Sensor
| Sensor Pin | Arduino Mega Pin |
|------------|------------------|
| VCC        | 5V               |
| GND        | GND              |
| A0         | A0               |

### Rain Sensor (Analog)
| Sensor Pin | Arduino Mega Pin |
|------------|------------------|
| VCC        | 5V               |
| GND        | GND              |
| A0         | A1               |

### I2C LCD (16x2)
| LCD Pin | Arduino Mega Pin |
|---------|------------------|
| SDA     | 20 (SDA)         |
| SCL     | 21 (SCL)         |
| VCC     | 5V               |
| GND     | GND              |

### ESP-01 (ESP8266) via SoftwareSerial (⚠️ 3.3V logic only!)
| ESP-01 Pin | Arduino Mega Pin | Notes                 |
|------------|------------------|-----------------------|
| TX         | D3 (RX)          | Via voltage divider   |
| RX         | D4 (TX)          | Must use voltage div. |
| VCC        | 3.3V             | Stable 3.3V required  |
| CH_PD      | 3.3V             | Pull HIGH             |
| GND        | GND              |                       |

> **Note:** On Arduino Mega, SoftwareSerial works best on pins 10–53. Pins 3 and 4 may not work reliably. Use, for example, pins 50 (RX) and 51 (TX) for `SoftwareSerial espSerial(50, 51);` and connect ESP-01 TX to Mega RX (50), ESP-01 RX to Mega TX (51) via voltage divider.

### SD Card Module (SPI)
| SD Module Pin | Arduino Mega Pin |
|---------------|------------------|
| CS            | 10               |
| MOSI          | 51               |
| MISO          | 50               |
| SCK           | 52               |
| VCC           | 5V               |
| GND           | GND              |

---

## 🧠 How It Works

1. **Startup**: LCD displays "Weather Man", WiFi connects.
2. **Sensor Readings**: Every 10 seconds:
  - Temperature (°C), Humidity (%)
  - Soil Moisture (0–100%)
  - Rain detected (0 or 1)
3. **Display**: Updates live values on the LCD.
4. **Logging**: Writes data to `datalog.txt` on SD.
5. **API POST**: Sends JSON to specified HTTP endpoint.

---

## 📤 Example JSON Payload

```json
{
  "temperature": 26.45,
  "humidity": 65.12,
  "soil_moisture": 42,
  "rain": 1
}
```

---

**⚠️ Arduino Mega Pin Notes:**  
- For `SoftwareSerial`, use pins 10–53 only.  
- For I2C LCD, use pins 20 (SDA) and 21 (SCL).  
- For SD card, use SPI pins: 50 (MISO), 51 (MOSI), 52 (SCK), 53 (SS/CS, but you can use 10 as CS if you set it in code).

**If you use the provided code, update the `SoftwareSerial` pins and hardware wiring accordingly for Arduino Mega 2560.**

---

## 📄 Example `config.h`

To use a separate configuration file, create a `config.h` in the same folder as `weather-station.ino` and include it with `#include "config.h"` in your code.

```cpp
// config.h
#ifndef CONFIG_H
#define CONFIG_H

const char *ssid = "Your_SSID";
const char *password = "Your_PASSWORD";
const char *apiHost = "yourapi.com";
const char *apiPath = "/add";

#endif
```
