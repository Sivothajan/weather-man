#include <Adafruit_GFX.h>

#include <Adafruit_SSD1306.h>

#include <DHT.h>

#include <SD.h>

#include <SPI.h>

#include <Wire.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN A1
#define FIRE_PIN 6
#define SD_CS 10

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET - 1

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, & Wire, OLED_RESET);

File logFile;

void setContrast(uint8_t contrast_value); // prototype

// --- Resend queue / ACK helpers
const unsigned long ACK_TIMEOUT_MS = 2000; // 2 seconds

bool waitForAck(unsigned long timeout_ms) {
  unsigned long start = millis();
  String reply = "";
  while (millis() - start < timeout_ms) {
    if (Serial1.available()) {
      reply = Serial1.readStringUntil('\n');
      reply.trim();
      if (reply.length() > 0) {
        Serial.print("Reply from ESP: ");
        Serial.println(reply);
        if (reply == "ACK") return true;
        else return false; // NACK or other
      }
    }
    delay(10);
  }
  // timeout
  return false;
}

// Resend queued unsent.txt entries on boot
void resendUnsent() {
  if (!SD.exists("unsent.txt")) {
    Serial.println("No unsent queue found.");
    return;
  }

  Serial.println("Processing unsent queue...");

  // remove tmp if exists
  if (SD.exists("unsent_tmp.txt")) {
    SD.remove("unsent_tmp.txt");
  }

  File inFile = SD.open("unsent.txt", FILE_READ);
  if (!inFile) {
    Serial.println("Failed to open unsent.txt for reading");
    return;
  }

  File tmpFile = SD.open("unsent_tmp.txt", FILE_WRITE); // will append; we removed it above, so this creates it
  if (!tmpFile) {
    Serial.println("Failed to create unsent_tmp.txt");
    inFile.close();
    return;
  }

  while (inFile.available()) {
    String line = inFile.readStringUntil('\n');
    line.trim();
    if (line.length() == 0) continue;

    Serial.println("Resending queued JSON: " + line);
    Serial1.println(line);

    bool ok = waitForAck(ACK_TIMEOUT_MS);
    if (ok) {
      Serial.println("Resend ACK received; skipping requeue");
    } else {
      Serial.println("No ACK for queued item; keeping in queue");
      tmpFile.println(line); // append to temp queue
    }
    delay(50); // gentle gap
  }

  inFile.close();
  tmpFile.close();

  // Replace unsent.txt with unsent_tmp.txt content:
  // delete original, then if tmp has contents, copy tmp -> unsent, then remove tmp.
  SD.remove("unsent.txt");

  File checkTmp = SD.open("unsent_tmp.txt", FILE_READ);
  if (!checkTmp) {
    Serial.println("No tmp queue file present after processing.");
    return;
  }

  if (checkTmp.size() == 0) {
    // nothing to requeue
    checkTmp.close();
    SD.remove("unsent_tmp.txt");
    Serial.println("Unsent queue cleared.");
    return;
  }

  // copy tmp back to unsent.txt
  File newUnsent = SD.open("unsent.txt", FILE_WRITE);
  if (!newUnsent) {
    Serial.println("Failed to recreate unsent.txt");
    checkTmp.close();
    return;
  }

  while (checkTmp.available()) {
    String l = checkTmp.readStringUntil('\n');
    newUnsent.println(l);
  }

  checkTmp.close();
  newUnsent.close();
  SD.remove("unsent_tmp.txt");
  Serial.println("Unsent queue updated.");
}

// --- End resend helpers

void setup() {
  Serial1.begin(9600); // NodeMCU
  Serial.begin(9600); // Debug
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

  // Set contrast to half (value between 0 and 255)
  setContrast(128); // Half contrast (you can adjust this to any value between 0 and 255)

  display.clearDisplay();
  display.setTextSize(3);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Mega\nStarted");
  display.display();

  delay(2000);

  // Attempt to resend any previously queued unsent JSONs
  resendUnsent();
}

void loop() {
  float temp = dht.readTemperature();
  float humid = dht.readHumidity();

  // Fix NaN values with default readings
  if (isnan(temp)) {
    temp = 25.0; // default temperature
  }
  if (isnan(humid)) {
    humid = 50.0; // default humidity
  }

  int soilRaw = analogRead(SOIL_PIN);
  int rainRaw = analogRead(RAIN_PIN);
  bool fireDetected = digitalRead(FIRE_PIN) == LOW;

  int soil = map(soilRaw, 1023, 0, 0, 100);
  bool rain = rainRaw < 500;

  logData(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);
  displayData(temp, humid, soil, rain, fireDetected);

  String json =
    buildJson(temp, humid, soil, soilRaw, rain, rainRaw, fireDetected);

  // send JSON to NodeMCU and wait for ACK
  Serial1.println(json);
  Serial.println("Sent JSON to ESP: " + json); // Debug print to USB

  bool gotAck = waitForAck(ACK_TIMEOUT_MS);

  if (gotAck) {
    Serial.println("ACK received from ESP");
  } else {
    Serial.println("No ACK received — queuing JSON to unsent.txt");

    // Append JSON to unsent queue on SD for retry
    File unsentFile = SD.open("unsent.txt", FILE_WRITE);
    if (unsentFile) {
      unsentFile.println(json);
      unsentFile.close();
      Serial.println("Queued unsent JSON to unsent.txt");
    } else {
      Serial.println("Failed to open unsent.txt — SD write failed");
    }
  }

  delay(10000);
}

void logData(float temp, float humid, int soil, int soilRaw, bool rain,
  int rainRaw, bool fire) {
  logFile = SD.open("datalog.txt", FILE_WRITE);
  if (logFile) {
    logFile.print("T:");
    logFile.print(temp);
    logFile.print(", H:");
    logFile.print(humid);
    logFile.print(", Soil:");
    logFile.print(soil);
    logFile.print(", SoilRaw:");
    logFile.print(soilRaw);
    logFile.print(", Rain:");
    logFile.print(rain ? "1" : "0");
    logFile.print(", RainRaw:");
    logFile.print(rainRaw);
    logFile.print(", Fire:");
    logFile.println(fire ? "1" : "0");
    logFile.close();
  } else {
    Serial.println("SD log failed");
  }
}

void displayData(float temp, float humid, int soil, bool rain, bool fire) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.print("Temp: ");
  display.print(temp);
  display.println(" C");
  display.print("Hum: ");
  display.print(humid);
  display.println(" %");
  display.print("Soil: ");
  display.print(soil);
  display.println(" %");
  display.print("Rain: ");
  display.println(rain ? "YES" : "NO");
  display.print("Fire: ");
  display.println(fire ? "YES" : "NO");
  display.display();
}

String buildJson(float temp, float humid, int soil, int soilRaw, bool rain,
  int rainRaw, bool fire) {
  String json = "{";
  json += "\"temperature\":" + String(temp, 2) + ",";
  json += "\"humidity\":" + String(humid, 2) + ",";
  json += "\"soil_moisture\":" + String(soil) + ",";
  json += "\"soil_raw\":" + String(soilRaw) + ",";
  json += "\"rain\":" + String(rain ? "true" : "false") + ",";
  json += "\"rain_raw\":" + String(rainRaw) + ",";
  json += "\"fire\":" + String(fire ? "true" : "false");
  json += "}";
  return json;
}

// Function to set the contrast of the OLED display
void setContrast(uint8_t contrast_value) {
  // Send the contrast command (0x81) followed by the contrast value (0-255)
  display.ssd1306_command(0x81); // Contrast control command
  display.ssd1306_command(contrast_value); // Set contrast value
}