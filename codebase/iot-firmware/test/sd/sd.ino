#include <SPI.h>
#include <SD.h>

#define SD_CS 10

File testFile;

void setup() {
    Serial.begin(9600);
    while (!Serial) {
        ; // Wait for Serial
    }

    Serial.println("Initializing SD card...");

    if (!SD.begin(SD_CS)) {
        Serial.println("SD card initialization failed!");
        return;
    }
    Serial.println("SD card initialized.");

    // Test writing to SD
    testFile = SD.open("test.txt", FILE_WRITE);
    if (testFile) {
        Serial.println("Writing to test.txt...");
        testFile.println("SD card test successful!");
        testFile.close();
        Serial.println("Write done.");
    } else {
        Serial.println("Error opening test.txt for writing.");
    }

    // Test reading from SD
    testFile = SD.open("test.txt");
    if (testFile) {
        Serial.println("Reading from test.txt:");
        while (testFile.available()) {
            Serial.write(testFile.read());
        }
        testFile.close();
    } else {
        Serial.println("Error opening test.txt for reading.");
    }
}

void loop() {
    // Nothing to do here
}