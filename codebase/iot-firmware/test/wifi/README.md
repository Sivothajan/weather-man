# WiFi.ion Test Code

This test code demonstrates basic serial communication between an Arduino and an ESP-01 WiFi module using the `SoftwareSerial` library. It allows you to send AT commands to the ESP-01 and view responses via the Serial Monitor.

## Features

- Uses `SoftwareSerial` on pins 3 (RX) and 4 (TX) for ESP-01 communication.
- Forwards data between the Serial Monitor and ESP-01 in both directions.
- Sends an initial `AT` command to verify communication.
