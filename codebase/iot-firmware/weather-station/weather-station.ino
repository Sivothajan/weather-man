#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <SPI.h>
#include <SD.h>

// ----- Constants & Pins -----
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN A1
#define SD_CS 10

// ----- Objects -----
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C LCD
SoftwareSerial espSerial(3, 4);     // ESP-01 TX/RX

// ----- WiFi & API -----
const char *ssid = "Your_SSID";
const char *password = "Your_PASSWORD";
const char *apiHost = "yourapi.com";
const char *apiPath = "/weather/upload";

// ----- Setup -----
void setup()
{
    Serial.begin(9600);
    espSerial.begin(9600);

    dht.begin();
    lcd.begin(16, 2);

    lcd.backlight();

    lcd.print("Weather Man");
    delay(2000);
    lcd.clear();

    if (!SD.begin(SD_CS))
    {
        Serial.println("SD init failed!");
    }

    connectWiFi();
}

// ----- Main Loop -----
void loop()
{
    float temp = dht.readTemperature();
    float humid = dht.readHumidity();
    int soilRaw = analogRead(SOIL_PIN);
    int rainRaw = analogRead(RAIN_PIN);

    int soil = map(soilRaw, 1023, 0, 0, 100);
    bool rain = rainRaw < 500;

    // LCD Output
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(temp);
    lcd.print("C H:");
    lcd.print(humid);
    lcd.setCursor(0, 1);
    lcd.print("S:");
    lcd.print(soil);
    lcd.print("% ");
    lcd.print(rain ? "Rain" : "Dry ");

    // Serial Debug
    Serial.print("T: ");
    Serial.print(temp);
    Serial.print(" H: ");
    Serial.print(humid);
    Serial.print(" Soil: ");
    Serial.print(soil);
    Serial.print(" Rain: ");
    Serial.println(rain);

    logToSD(temp, humid, soil, rain);
    sendToAPI(temp, humid, soil, rain);

    delay(10000); // 10 seconds
}

// ----- SD Logging -----
void logToSD(float temp, float humid, int soil, bool rain)
{
    File file = SD.open("datalog.txt", FILE_WRITE);
    if (file)
    {
        file.print("T:");
        file.print(temp);
        file.print(", H:");
        file.print(humid);
        file.print(", Soil:");
        file.print(soil);
        file.print(", Rain:");
        file.println(rain ? "1" : "0");
        file.close();
    }
    else
    {
        Serial.println("SD log failed.");
    }
}

// ----- WiFi Connect -----
void connectWiFi()
{
    espSerial.println("AT+CWMODE=1");
    delay(2000);
    espSerial.print("AT+CWJAP=\"");
    espSerial.print(ssid);
    espSerial.print("\",\"");
    espSerial.print(password);
    espSerial.println("\"");
    delay(8000);
}

// ----- API Call (JSON POST) -----
void sendToAPI(float temp, float humid, int soil, bool rain)
{
    String json = "{";
    json += "\"temperature\":" + String(temp, 2) + ",";
    json += "\"humidity\":" + String(humid, 2) + ",";
    json += "\"soil_moisture\":" + String(soil) + ",";
    json += "\"rain\":" + String(rain ? 1 : 0);
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
