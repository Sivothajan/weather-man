#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <SPI.h>
#include <SD.h>
#include "config.h"

#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN A1
#define FIRE_PIN 6
#define SD_CS 10

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
SoftwareSerial espSerial(3, 4);

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.backlight();
  pinMode(FIRE_PIN, INPUT);

  lcd.print("Weather Man");
  delay(2000);
  lcd.clear();

  if (!SD.begin(SD_CS)) {
    Serial.println("SD init failed!");
  }

  connectWiFi();
}

/**
 * @brief Main loop for weather station firmware.
 * 
 * Reads sensor data (temperature, humidity, soil moisture, rain, fire detection),
 * processes and displays the results on an LCD, prints to Serial for debugging,
 * logs to SD card, and sends data to an API.
 * 
 * Operation steps:
 * 1. Read temperature and humidity from DHT sensor.
 * 2. Read raw soil moisture and rain sensor values.
 * 3. Detect fire using digital input.
 * 4. Map raw soil sensor value to percentage (0-100%).
 * 5. Determine rain status based on rain sensor threshold.
 * 6. Display processed sensor values (temperature, humidity, soil %, rain status) on LCD.
 * 7. Display raw soil and rain sensor values on LCD.
 * 8. Display fire detection status on LCD.
 * 9. Print both processed and raw sensor values to Serial for debugging.
 * 10. Log all sensor data (processed and raw) to SD card.
 * 11. Send all sensor data (processed and raw) to remote API.
 * 
 * Timing:
 * - Each LCD display step is shown for 2 seconds.
 * - After all displays and data operations, an additional 4-second delay is added.
 * - Total loop cycle time: 10 seconds.
 * 
 * @note
 * - Ensure DHT, LCD, and pin objects are initialized in setup().
 * - logToSD() and sendToAPI() must be implemented elsewhere.
 * - Adjust sensor thresholds as needed for your hardware.
 */

void loop() {
  float temp = dht.readTemperature();
  float humid = dht.readHumidity();
  int soilRaw = analogRead(SOIL_PIN);
  int rainRaw = analogRead(RAIN_PIN);
  bool fireDetected = digitalRead(FIRE_PIN) == LOW;

  int soil = map(soilRaw, 1023, 0, 0, 100);
  bool rain = rainRaw < 500;

  // LCD Output: processed values
  lcd.setCursor(0, 0);
  lcd.print("T:"); lcd.print(temp); lcd.print("C H:"); lcd.print(humid);
  lcd.setCursor(0, 1);
  lcd.print("S:"); lcd.print(soil); lcd.print("% ");
  lcd.print(rain ? "Rain" : "Dry");
  delay(2000);

  // LCD Output: raw values
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SoilRaw:"); lcd.print(soilRaw);
  lcd.setCursor(0, 1);
  lcd.print("RainRaw:"); lcd.print(rainRaw);
  delay(2000);

  // LCD Output: fire
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fire:");
  lcd.setCursor(6, 0);
  lcd.print(fireDetected ? "FIRE!" : "NoFire");
  delay(2000);

  // Serial Debug: print both processed and raw
  Serial.print("T: "); Serial.print(temp);
  Serial.print(" H: "); Serial.print(humid);
  Serial.print(" Soil: "); Serial.print(soil);
  Serial.print(" (Raw: "); Serial.print(soilRaw); Serial.print(")");
  Serial.print(" Rain: "); Serial.print(rain);
  Serial.print(" (Raw: "); Serial.print(rainRaw); Serial.print(")");
  Serial.print(" Fire: "); Serial.println(fireDetected ? "FIRE!" : "No fire");

  logToSD(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);
  sendToAPI(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);

  delay(4000); // total delay = 2s + 2s + 2s + 4s = 10s
}

// ----- SD Logging -----
void logToSD(float temp, float humid, int soil, int soilRaw, bool rain, int rainRaw, bool fire) {
  File file = SD.open("datalog.txt", FILE_WRITE);
  if (file) {
    file.print("T:"); file.print(temp);
    file.print(", H:"); file.print(humid);
    file.print(", Soil:"); file.print(soil);
    file.print(", SoilRaw:"); file.print(soilRaw);
    file.print(", Rain:"); file.print(rain ? "1" : "0");
    file.print(", RainRaw:"); file.print(rainRaw);
    file.print(", Fire:"); file.println(fire ? "1" : "0");
    file.close();
  } else {
    Serial.println("SD log failed.");
  }
}

// ----- WiFi Connect -----
void connectWiFi() {
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  espSerial.print("AT+CWJAP=\""); espSerial.print(ssid);
  espSerial.print("\",\""); espSerial.print(password); espSerial.println("\"");
  delay(8000);
}

// ----- API Call (JSON POST) -----
void sendToAPI(float temp, float humid, int soil, int soilRaw, bool rain, int rainRaw, bool fire) {
  String json = "{";
  json += "\"temperature\":" + String(temp, 2) + ",";
  json += "\"humidity\":" + String(humid, 2) + ",";
  json += "\"soil_moisture\":" + String(soil) + ",";
  json += "\"soil_raw\":" + String(soilRaw) + ",";
  json += "\"rain\":" + String(rain ? 1 : 0) + ",";
  json += "\"rain_raw\":" + String(rainRaw) + ",";
  json += "\"fire\":" + String(fire ? 1 : 0);
  json += "}";

  int len = json.length();

  espSerial.println("AT+CIPSTART=\"TCP\",\"" + String(apiHost) + "\",80");
  delay(3000);

  String req = "POST " + String(apiPath) + " HTTP/1.1\r\n";
  req += "Host: " + String(apiHost) + "\r\n";
  req += "Content-Type: application/json\r\n";
  req += "Content-Length: " + String(len) + "\r\n";
  req += "Connection: close\r\n\r\n";
  req += json;

  espSerial.print("AT+CIPSEND=");
  espSerial.println(req.length());
  delay(1000);

  espSerial.print(req);
  delay(2000);
  espSerial.println("AT+CIPCLOSE");
}
