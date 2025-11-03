#include <SD.h>

#include <SPI.h>

void deleteAll(File dir);

void setup() {
  Serial.begin(9600);
  while (!Serial); // Wait for Serial on Leonardo

  if (!SD.begin(10)) { // 10 is CS pin for most Arduino boards (like Uno)
    Serial.println("SD init failed!");
    return;
  }

  Serial.println("SD card initialized.");

  File root = SD.open("/");
  deleteAll(root);
  root.close();

  Serial.println("All files deleted.");
}

void loop() {
  // Nothing to do here
}

void deleteAll(File dir) {
  while (true) {
    File entry = dir.openNextFile();
    if (!entry) break;

    String name = entry.name();
    if (entry.isDirectory()) {
      Serial.print("Deleting folder: ");
      Serial.println(name);
      deleteAll(entry); // Recursively delete contents
      SD.rmdir(name.c_str()); // Then remove empty dir
    } else {
      Serial.print("Deleting file: ");
      Serial.println(name);
      SD.remove(name.c_str());
    }
    entry.close();
  }
}