#include <SoftwareSerial.h>

SoftwareSerial espSerial(3, 4);  // RX, TX

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);
  Serial.println("ESP-01 Test: Type AT commands below.");
  delay(2000);

  // Send basic AT command to check communication
  espSerial.println("AT");
}

void loop() {
  // Forward data from Serial Monitor to ESP-01
  if (Serial.available()) {
    char c = Serial.read();
    espSerial.write(c);
  }

  // Forward data from ESP-01 to Serial Monitor
  if (espSerial.available()) {
    char c = espSerial.read();
    Serial.write(c);
  }
}
