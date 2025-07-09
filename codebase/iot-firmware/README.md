# IoT Environmental Monitor – Arduino Mega + ESP8266 (NodeMCU)

This project monitors environmental conditions using an Arduino Mega and sends sensor data to a remote API using an ESP8266 (NodeMCU). Data is displayed on OLED screens and logged locally to an SD card.

---

## 🚀 System Architecture

### 🧠 Arduino Mega 2560

- **Sensors**:
  - DHT11 – Temperature & Humidity
  - Soil Moisture Sensor – Analog
  - Rain Sensor – Analog
  - Fire Sensor – Digital
- **Display**: 128x64 OLED (I2C)
- **Storage**: microSD card (via SPI)
- **Output**: JSON via Serial1 → ESP8266

### 📡 ESP8266 (NodeMCU)

- **Receives JSON** over Serial
- **Sends POST** requests to remote HTTP API
- **Displays WiFi/Send status** on OLED

---

## 📦 Components Used

| Component         | Interface  | Board          |
| ----------------- | ---------- | -------------- |
| DHT11             | Digital    | Mega           |
| Soil Moisture     | Analog     | Mega (A0)      |
| Rain Sensor       | Analog     | Mega (A1)      |
| Fire Sensor       | Digital    | Mega (D6)      |
| OLED Display      | I2C (0x3C) | Both           |
| SD Card Module    | SPI        | Mega (CS = 10) |
| ESP8266 (NodeMCU) | Serial     | NodeMCU        |

---

## 🔄 Data Flow

### 1. Mega reads all sensors every 10 seconds

### 2. Builds a JSON payload like

```json
{
  "temperature": 24.5,
  "humidity": 55.2,
  "soil_moisture": 72,
  "soil_raw": 843,
  "rain": 0,
  "rain_raw": 345,
  "fire": false
}
```

### 3. Sends this JSON via `Serial1.println(...)` to NodeMCU

### 4. NodeMCU sends HTTP POST to `http://<apiHost><apiPath>`

### 5. OLED displays connection and status messages

---

## ⚙️ Setup

### 🔌 Wiring

- Connect sensors to Mega analog/digital pins.
- OLED on Mega uses `Wire.begin()` (default SDA/SCL).
- NodeMCU receives from Mega `TX1 → RX`, `GND ↔ GND`.
- NodeMCU OLED uses `Wire.begin(D2, D1)`.

### 🧾 Config

In `config.h` (for ESP8266):

```cpp
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* apiHost = "your.api.host";
const char* apiPath = "/your/api/path";
```

---

## 🧪 Build & Upload

- Mega: Upload with Arduino IDE or PlatformIO.
- NodeMCU: Flash ESP sketch using Arduino IDE.
- Use 9600 baud for both Serial and Serial1.

---

## 📁 Files

- `esp8266_post.ino`: WiFi + OLED + HTTP code (NodeMCU)
- `mega_sensors.ino`: Sensor read + SD logging + Serial JSON (Mega)
- `config.h`: WiFi + API config

---

## 🧠 Future Improvements

- Add timestamp via RTC or NTP
- Add HTTP response logging
- Add retry/backoff logic for network errors
- Use circular buffer or file rotation for SD logging
- OTA updates for ESP8266
-
