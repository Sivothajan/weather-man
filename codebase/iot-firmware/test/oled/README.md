# OLED Display Test

This is a test program for the SSD1306 OLED display using an Arduino board. The program demonstrates basic initialization and text display functionality.

## Hardware Requirements

- Arduino board (e.g., Arduino Mega)
- SSD1306 OLED Display (128x64 pixels)
- I2C connection wires

## Dependencies

The following Arduino libraries are required:

- Wire.h (included with Arduino IDE)
- Adafruit_GFX
- Adafruit_SSD1306

## Pin Connections

The SSD1306 OLED display uses I2C communication:

- SDA -> Arduino SDA pin
- SCL -> Arduino SCL pin
- VCC -> 5V or 3.3V (check your display's specifications)
- GND -> GND

## Configuration

- Display Resolution: 128x64 pixels
- I2C Address: 0x3C (default)
- No reset pin used (OLED_RESET set to -1)

## Functionality

The program performs the following:

1. Initializes serial communication at 9600 baud
2. Initializes the OLED display
3. Clears the display
4. Sets text size to 2
5. Displays "Hello Mega!" on the screen

## Testing

1. Connect the OLED display to your Arduino board
2. Upload the code to your Arduino
3. The display should show "Hello Mega!" in large text
4. If initialization fails, check the serial monitor for error messages

## Troubleshooting

- If the display doesn't initialize, verify:
  - Correct I2C address (default is 0x3C)
  - Proper wiring connections
  - Library installation
  - Power supply voltage
