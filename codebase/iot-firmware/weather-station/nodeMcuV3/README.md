# ESP8266 (NodeMCU) — Serial → HTTPS JSON Forwarder

**Purpose**
Listen for newline-terminated JSON over a software serial link from the Mega and POST each JSON payload to your HTTPS API. Reply to the Mega with `ACK` or `NACK` so the Mega can decide whether to queue the payload.

---

## Files & libs used

- Sketch: your ESP code (uses `SoftwareSerial`).
- Required libs (Arduino ESP8266 core):
  - `ESP8266HTTPClient.h`
  - `ESP8266WiFi.h`
  - `SoftwareSerial.h`

- `config.h` (must be in the same folder; contains Wi-Fi and API settings).

`config.h` example:

```cpp
const char* ssid     = "yourSSID";
const char* password = "yourPASS";
const char* apiHost  = "your.api.host"; // no protocol prefix
const char* apiPath  = "/api/data/add"; // leading slash
```

---

## Behavior (exact)

- Uses `SoftwareSerial megaSerial(D6, D5)` where:
  - `D6` (GPIO12) = RX (listens from Mega TX)
  - `D5` (GPIO14) = TX (can send ACK/NACK to Mega)

- Serial speeds: `Serial` (USB) 9600 for debug, `megaSerial` 9600 for device comms.
- In `loop()` it reads bytes from `megaSerial` until `\n`, trims the string, checks that it `startsWith("{") && endsWith("}")`. If valid, calls `sendToServer(json)`. If invalid, prints and sends `NACK` back to Mega.
- `sendToServer(json)`:
  - Verifies Wi-Fi connected (`WiFi.status()`).
  - Builds URL: `https://<apiHost><apiPath>` and posts JSON with `Content-Type: application/json`.
  - Uses `WiFiClientSecure` with `client.setInsecure()` (certificate validation is disabled).
  - Reads server response body (`http.getString()`) and prints it to Serial.
  - On HTTP 2xx → `megaSerial.println("ACK");` else `megaSerial.println("NACK");`
  - Returns `true` for success, `false` otherwise.

---

## Wire it (ESP side)

- `D6` (GPIO12) — connect to **Mega TX1 (D18)** via a **level shifter** (Mega is 5V).
- `D5` (GPIO14) — connect to **Mega RX1 (D19)** via level shifter if you want Mega to receive ACKs (recommended).
- Common ground required between Mega and NodeMCU.
- Power NodeMCU from USB or a stable 3.3V regulator. Do **not** feed 5V logic into ESP pins.

---

## How the ACK/NACK protocol works (current code)

- On successful POST (HTTP 2xx) NodeMCU sends `ACK\n` to Mega.
- On failure or malformed JSON it sends `NACK\n`.
- No local IDs are used in ACK; ACK corresponds to the most recent JSON forwarded (Mega treats ACK as confirmation for the item it just sent or resent).

---

## Quick debug checklist

1. Serial monitor (ESP) should show:
   `ESP Ready. Listening for data...` then `WiFi Connected`.
2. When Mega sends JSON, ESP prints `Received raw: {...}` then `HTTP Response: 200` etc.
3. If ESP cannot reach server it sends `NACK` to Mega (Mega will queue).

---

## Important notes (read)

- `client.setInsecure()` — TLS **certificate validation is disabled**. That secures the channel but does not verify the server. Keep for dev only.
- `SoftwareSerial` on ESP8266 is fragile at higher throughput. At 9600 it mostly works but can be flakey under load.
- The code does **not** include `local_id` tracking in the JSON. ACK is a generic `ACK`/`NACK`. See TODOs below if you want idempotent tracking.

---

## TODO / Future implementation (kept separate)

- Return `ACK:<local_id>` in server reply handling so Mega can remove specific queued entries.
- Use ArduinoJson to parse server response robustly.
- Replace `setInsecure()` with certificate pinning or CA root.
- Consider hardware serial instead of SoftwareSerial for reliability.

---
