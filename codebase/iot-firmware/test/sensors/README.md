# sensors.ino

This Arduino sketch is a **testing code for sensors**. It reads data from multiple environmental sensors and displays the results on an I2C LCD as well as outputs them in CSV format over the serial port. The sensors monitored include:

- **DHT11 Temperature and Humidity Sensor**: Measures ambient temperature (°C) and relative humidity (%).
- **Soil Moisture Sensor**: Reads analog soil moisture levels, maps them to a percentage, and classifies the soil as "Wet", "Normal", or "Dry".
- **Rain Sensor**: Detects the presence of rain based on analog readings and reports "Rain" or "Dry".
- **Fire Sensor**: Detects the presence of fire and reports "FIRE!" or "NoFire".

## Features

- **LCD Display**: Shows temperature, humidity, soil moisture, rain status, fire status, and soil status in a user-friendly format.
- **Serial Output**: Prints a CSV header and sensor readings for easy data logging and analysis.
- **Status Classification**: Provides human-readable status for soil, rain, and fire conditions.

## Pin Configuration

- `DHTPIN` (2): Digital pin for DHT11 sensor data.
- `SOIL_PIN` (A0): Analog pin for soil moisture sensor.
- `RAIN_PIN` (A1): Analog pin for rain sensor.
- `FIRE_PIN` (6): Digital pin for fire sensor.

## Usage

1. Connect the sensors to the specified pins.
2. Upload the sketch to your Arduino board.
3. Open the Serial Monitor at 9600 baud to view CSV output.
4. Observe real-time sensor data and status on the LCD.

## Dependencies

- [DHT sensor library](https://github.com/adafruit/DHT-sensor-library)
- [LiquidCrystal_I2C library](https://github.com/johnrickman/LiquidCrystal_I2C)

## Output Format

Serial output columns:

| Temp(C) | Humidity(%) | SoilRaw | SoilStatus | RainRaw | RainStatus | FireStatus |
|---------|-------------|---------|------------|---------|------------|------------|
| 23.1    | 45.2        | 650     | Normal     | 300     | Rain       | NoFire     |

- **Temp(C)**: Temperature in Celsius from the DHT11 sensor.
- **Humidity(%)**: Relative humidity percentage from the DHT11 sensor.
- **SoilRaw**: Raw analog value from the soil moisture sensor (0–1023).
- **SoilStatus**: Interpreted soil condition ("Wet", "Normal", "Dry").
- **RainRaw**: Raw analog value from the rain sensor (0–1023).
- **RainStatus**: Interpreted rain condition ("Rain", "Dry").
- **FireStatus**: Fire detection status ("FIRE!", "NoFire").

Each row represents a single reading from all sensors, output in CSV format for easy logging and analysis.