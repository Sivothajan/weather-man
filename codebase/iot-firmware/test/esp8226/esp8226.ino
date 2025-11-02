/**
 * @file esp8226.ino
 * @brief ESP8266 Weather Station Test Firmware
 *
 * This firmware implements a basic test for the Weather Station project.
 * It connects to WiFi and makes HTTPS requests to the Weather Man API.
 *
 * Features:
 * - WiFi connectivity with retry mechanism
 * - Secure HTTPS connection (certificate verification disabled for testing)
 * - Basic GET request to test API connectivity
 *
 * @note This is a test implementation. Production code should implement proper
 *       security measures and certificate verification.
 */

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#include "config.test.h"

// Replace with your network credentials if config.test.h is not used
/*
const char* ssid = "SSID";
const char* password = "PASSWORD";

const char* host = "api.sivothajan.me";
const int httpsPort = 443;
const char* path = "/api/check";
*/

WiFiClientSecure client;

/**
 * @brief Initial setup function that runs once at startup
 *
 * This function:
 * 1. Initializes serial communication
 * 2. Connects to WiFi network
 * 3. Establishes HTTPS connection to the API
 * 4. Sends a test GET request
 * 5. Prints the response
 */
void setup() {
  Serial.begin(9600);
  delay(1000);

  Serial.println("Booting...");
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retries++;
    if (retries > 20) {
      Serial.println("\n[ERROR] Failed to connect to WiFi.");
      return;
    }
  }

  Serial.println("\nWiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  client.setInsecure();  // Skip cert check
  Serial.println("Connecting to host...");

  if (!client.connect(host, httpsPort)) {
    Serial.println("[ERROR] Connection to host failed!");
    return;
  }

  Serial.println("Connected. Sending GET request...");
  client.print(String("GET ") + path + " HTTP/1.1\r\n" + "Host: " + host +
               "\r\n" + "User-Agent: ESP8266\r\n" +
               "Connection: close\r\n\r\n");

  // Read headers
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
    Serial.println("[Header] " + line);
  }

  // Read body
  String response = client.readString();
  Serial.println("Response:");
  Serial.println(response);
}

/**
 * @brief Main program loop
 *
 * Currently empty as this is a test implementation that only
 * performs a single request at startup.
 */
void loop() {
  // nada
}
