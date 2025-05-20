# 🌦️ Weather Station - NodeMCU V3 Version (No Display)

This implementation uses the **NodeMCU V3 (ESP8266)** as a secondary controller in a modular weather monitoring system. The **Arduino Mega 2560** handles all sensor readings, data logging, and transmits readings to the **NodeMCU** over serial. The NodeMCU then forwards this data to a remote API via built-in WiFi.

---

## 📋 Features

- 🔌 Receives weather data from Arduino Mega 2560 via Serial
- 📡 Forwards the JSON data to remote server via HTTP POST
- 💾 Optional local SPIFFS logging (in case of failure to send)

---

## 🧰 Hardware Required

| Component                | Quantity | Notes                          |
| ------------------------ | -------- | ------------------------------ |
| NodeMCU V3 (ESP8266)     | 1        | WiFi controller + server comm  |
| Arduino Mega 2560        | 1        | Sensor reader + logger         |
| Power Supply (5V)        | 1        | USB or external for NodeMCU    |
| Level Shifter (Optional) | 1        | For safe UART voltage matching |

---

## 🔌 Serial Communication

| Mega Pin     | NodeMCU Pin      | Purpose                    |
| ------------ | ---------------- | -------------------------- |
| TX1 (Pin 18) | RX (D7 / GPIO13) | Mega sends JSON to NodeMCU |
| RX1 (Pin 19) | TX (D8 / GPIO15) | (Optional - debug return)  |
| GND          | GND              | Common ground              |

> ⚠️ **Important:** Use a **logic level shifter** or resistor divider for Mega TX → NodeMCU RX to avoid damaging ESP8266.

---

## 📤 Data Format (Mega → NodeMCU)

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

Create a `config.h` file with your WiFi and API details:

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

## 🧠 Logic Flow (NodeMCU)

1. Connect to WiFi
2. Listen to Serial1 for JSON input from Mega
3. When JSON received:

   - Validate format
   - Optionally log to SPIFFS
   - Send HTTP POST to remote server

4. Retry on failure (optional)

---

## ⚠️ Important Notes

1. Ensure **voltage safety** when connecting Mega TX to NodeMCU RX.
2. ESP8266 is **3.3V only** — no 5V logic.
3. Use **Serial1** or SoftwareSerial (if needed) for Mega<->ESP comm.
4. Keep JSON lines **single-line terminated by `\n`** for clean parsing.
5. NodeMCU can handle basic JSON parsing and HTTP POST directly using `ESP8266HTTPClient`.

---

## 💬 Example Mega Output

From Mega, you’d `Serial1.println()` the following:

```json
{
  "temperature": 24.5,
  "humidity": 58.1,
  "soil_moisture": 47,
  "soil_raw": 523,
  "rain": 0,
  "rain_raw": 410,
  "fire": false
}
```

---

## ✅ NodeMCU Libraries Required

- `ESP8266WiFi.h`
- `ESP8266HTTPClient.h`
- `ArduinoJson.h` (v6+ recommended)
- `FS.h` and `SPIFFS.h` _(optional logging)_
