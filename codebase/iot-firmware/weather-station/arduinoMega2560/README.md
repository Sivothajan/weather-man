# Arduino Mega — Sensor Gatherer, Logger, Queue & Sender

**Purpose**
Read sensors, display values on an OLED, log each sample to `datalog.txt` on SD card, build JSON and send to ESP via `Serial1`. If ESP does not ACK, queue JSON lines to `unsent.txt` for later retry. On boot the Mega attempts to resend the queued items.

---

## Files & libs used

- Libraries:
  - `Adafruit_GFX`, `Adafruit_SSD1306`
  - `DHT`
  - `SD`, `SPI`, `Wire`

- Sketch runs on **Arduino Mega 2560**.

---

## Pin map (exact from sketch)

- DHT11 data → `D2`
- Soil analog → `A0`
- Rain analog → `A1`
- Fire digital → `D6` (code treats `LOW` as fire detected)
- SD CS → `D10` (SPI pins MOSI/MISO/SCK are Mega default: 51/50/52)
- OLED (SSD1306 I2C) → `SDA` (D20), `SCL` (D21)
- Serial to NodeMCU → `Serial1` (`TX1 = D18`, `RX1 = D19`)

---

## What the code does (step-by-step)

- **setup()**
  - Start `Serial1` @9600 for NodeMCU comms.
  - Start `Serial` @9600 for debug.
  - Initialize DHT, SD, and OLED.
  - Set OLED contrast, show splash.
  - Call `resendUnsent()` to attempt resending previously queued JSON lines.

- **loop()** (every 10s)
  - Read sensors (DHT11, analog soil/rain, digital fire).
  - If DHT gives `NaN`, fallback to `temp = 25.0`, `humid = 50.0`.
  - Convert `soilRaw` (0..1023) into `soil` percent using `map(1023->0 -> 0->100)` — higher percent = wetter.
  - `rain` boolean = `rainRaw < 500`.
  - `fireDetected` boolean = `digitalRead(FIRE_PIN) == LOW`.
  - `logData(...)` appends a line to `datalog.txt` (immediate write + close).
  - `displayData(...)` updates the OLED.
  - `buildJson(...)` builds a JSON string (temperature, humidity, soil_moisture, soil_raw, rain, rain_raw, fire).
  - `Serial1.println(json)` sends JSON to ESP.
  - Wait up to `ACK_TIMEOUT_MS` (2000 ms) for `ACK` on `Serial1` via `waitForAck()`.
    - If `ACK` received → success (do nothing else).
    - If no ACK → append the JSON line to `unsent.txt` on SD for retry.

  - Delay 10,000 ms and repeat.

---

## JSON format (exact)

The `buildJson(...)` function creates JSON like:

```json
{
  "temperature": 25.0,
  "humidity": 50.0,
  "soil_moisture": 42,
  "soil_raw": 600,
  "rain": true,
  "rain_raw": 700,
  "fire": false
}
```

Types:

- `temperature`, `humidity` — floats printed with 2 decimals.
- `soil_moisture`, `soil_raw`, `rain_raw` — integers.
- `rain`, `fire` — booleans (`true` / `false`).

---

## Files written to SD

- `datalog.txt` — every sample appended as a CSV-style line:

  ```json
  T:25.00, H:50.00, Soil:42, SoilRaw:600, Rain:1, RainRaw:450, Fire:0
  ```

  (Rain & Fire logged as `1`/`0`.)

- `unsent.txt` — when ESP fails to ACK, the full JSON string is appended here (one JSON per line). On boot `resendUnsent()` tries to resend each line and rebuilds `unsent.txt` with only the lines that still failed.

Implementation detail:

- `resendUnsent()` reads `unsent.txt`, writes successes to nothing and failures into `unsent_tmp.txt`, then replaces the original `unsent.txt` with the tmp file. That avoids corrupting the queue mid-process.

---

## How ACK handling works (exact)

- `waitForAck(timeout_ms)` reads `Serial1` until `\n` or timeout. If it receives `ACK` → returns true. If receives `NACK` or timeout → returns false.
- On resend during boot, the same `waitForAck()` is used; items without ACK are kept in the queue.

**Important:** ACK is not tied to a `local_id` in this version. ACK confirms “the item I just sent was accepted” — if you send multiple items concurrently this would be ambiguous. Current flow sends items serially so it's OK.

---

## How to inspect SD contents from the board

(Optional helper snippet you can add to sketch to print file contents over Serial)

```cpp
void dumpFileToSerial(const char* fname) {
  if (!SD.exists(fname)) { Serial.println("No file"); return; }
  File f = SD.open(fname, FILE_READ);
  while (f.available()) Serial.write(f.read());
  f.close();
}
```

Call `dumpFileToSerial("datalog.txt");` from `loop()` or triggered by a button/serial command if you add one.

---

## Quick test steps

1. Wire Mega ↔ NodeMCU (level shifter on Mega TX → NodeMCU RX), common ground.
2. Plug SD card (FAT32) into module.
3. Upload Mega sketch to Mega and ESP sketch to NodeMCU.
4. Open Serial Monitor for Mega at 9600 — you should see `SD init success` and `Mega Started` splash.
5. Confirm `datalog.txt` has lines after a few cycles (or inspect over Serial).
6. On first boot NodeMCU should print `ESP Ready...` and `WiFi Connected`. When Mega sends JSON you should see `Received raw: {...}` on the ESP Serial.
7. If NodeMCU posts successfully, Mega gets `ACK`. If NodeMCU fails (no Wi-Fi or bad API), Mega writes JSON into `unsent.txt`.

---

## Troubleshooting (quick hits)

- **No ESP reply / Mega queues every payload**: check level shifter and common ground. If Mega TX is 5V into ESP RX without shifting, ESP may be dead or unreliable.
- **ESP prints `WiFi not connected!`**: wrong credentials in `config.h` or out-of-range AP.
- **SD init failed**: wrong CS pin wiring (must be D10), card not FAT32, or poor power to SD module.
- **DHT NaN**: sensor wiring or delay issues; DHT11 is slow — your code already has fallbacks.
- **OLED blank**: wrong I2C wiring or address; ensure `0x3C` matches your module.

---

## TODO / Future implementation (explicit, separate)

- Add `local_id` and `local_ts` to each JSON and make NodeMCU reply with `ACK:<local_id>` so Mega can delete specific queued entries.
- Use `ArduinoJson` for robust JSON building/parsing.
- Consider grouping SD writes or limiting frequency to reduce wear.
- Optional: add a serial command interface to inspect/flush `unsent.txt` from Serial Monitor.

---
