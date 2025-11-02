#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>

#define D6 12
#define D5 14

SoftwareSerial megaSerial(D6, D5);  // RX, TX

// Put the WiFi and server details in config.h or define here
#include "config.h"
// Example:
// const char* ssid = "yourSSID";
// const char* password = "yourPASS";
// const char* apiHost = "your.api.host";
// const char* apiPath = "/api/data/add";

String inputString = "";
bool stringComplete = false;

void setup() {
  Serial.begin(9600);
  megaSerial.begin(9600);

  Serial.println("ESP Ready. Listening for data...");

  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
}

void loop() {
  while (megaSerial.available()) {
    char inChar = (char)megaSerial.read();
    if (inChar == '\n') {
      stringComplete = true;
      break;
    } else {
      inputString += inChar;
    }
  }
  if (stringComplete) {
    Serial.println("Received raw: " + inputString);

    // Trim any whitespace, newlines or carriage returns
    inputString.trim();

    if (inputString.startsWith("{") && inputString.endsWith("}")) {
      Serial.println("Valid JSON received");

      // Optional: display JSON or parse it here

      if (sendToServer(inputString)) {
        Serial.println("Data sent successfully.");
      } else {
        Serial.println("Failed to send data.");
      }
    } else {
      Serial.println("Invalid or partial JSON.");
    }

    inputString = "";
    stringComplete = false;
  }
}

bool sendToServer(String json) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();  // Skip SSL cert validation (for dev only)

  HTTPClient http;

  String url = "https://" + String(apiHost) + String(apiPath);
  Serial.println("Posting to: " + url);
  Serial.println("Payload: " + json);

  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(json);

  Serial.print("HTTP Response: ");
  Serial.println(httpResponseCode);

  String payload = http.getString();
  Serial.println("Response payload:");
  Serial.println(payload);

  http.end();

  return (httpResponseCode > 0 && httpResponseCode < 300);
}
