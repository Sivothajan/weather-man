#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SPI.h>
#include <SD.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN A1
#define FIRE_PIN 6
#define SD_CS 10

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

File logFile;

void setup() {
  Serial1.begin(9600);  // NodeMCU
  Serial.begin(9600);   // Debug
  dht.begin();

  if (!SD.begin(SD_CS)) {
    Serial.println("SD init failed");
  } else {
    Serial.println("SD init success");
  }

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED init failed");
    while (1);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Mega Started");
  display.display();

  delay(2000);
}

void loop() {
  float temp = dht.readTemperature();
  float humid = dht.readHumidity();

  // Fix NaN values with default readings
  if (isnan(temp)) {
    temp = 25.0;      // default temperature
  }
  if (isnan(humid)) {
    humid = 50.0;     // default humidity
  }

  int soilRaw = analogRead(SOIL_PIN);
  int rainRaw = analogRead(RAIN_PIN);
  bool fireDetected = digitalRead(FIRE_PIN) == LOW;

  int soil = map(soilRaw, 1023, 0, 0, 100);
  bool rain = rainRaw < 500;

  logData(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);
  displayData(temp, humid, soil, rain, fireDetected);

  String json = buildJson(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);
  Serial1.println(json);
  Serial.println(json);  // Debug

  delay(10000);
}

void logData(float temp, float humid, int soil, int soilRaw, bool rain, int rainRaw, bool fire) {
  logFile = SD.open("datalog.txt", FILE_WRITE);
  if (logFile) {
    logFile.print("T:"); logFile.print(temp);
    logFile.print(", H:"); logFile.print(humid);
    logFile.print(", Soil:"); logFile.print(soil);
    logFile.print(", SoilRaw:"); logFile.print(soilRaw);
    logFile.print(", Rain:"); logFile.print(rain ? "1" : "0");
    logFile.print(", RainRaw:"); logFile.print(rainRaw);
    logFile.print(", Fire:"); logFile.println(fire ? "1" : "0");
    logFile.close();
  } else {
    Serial.println("SD log failed");
  }
}

void displayData(float temp, float humid, int soil, bool rain, bool fire) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.print("Temp: "); display.print(temp); display.println(" C");
  display.print("Hum: "); display.print(humid); display.println(" %");
  display.print("Soil: "); display.print(soil); display.println(" %");
  display.print("Rain: "); display.println(rain ? "YES" : "NO");
  display.print("Fire: "); display.println(fire ? "YES" : "NO");
  display.display();
}

String buildJson(float temp, float humid, int soil, int soilRaw, bool rain, int rainRaw, bool fire) {
  String json = "{";
  json += "\"temperature\":" + String(temp, 2) + ",";
  json += "\"humidity\":" + String(humid, 2) + ",";
  json += "\"soil_moisture\":" + String(soil) + ",";
  json += "\"soil_raw\":" + String(soilRaw) + ",";
  json += "\"rain\":" + String(rain ? 1 : 0) + ",";
  json += "\"rain_raw\":" + String(rainRaw) + ",";
  json += "\"fire\":" + String(fire ? "true" : "false");
  json += "}";
  return json;
}
