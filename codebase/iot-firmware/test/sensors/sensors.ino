#include <DHT.h>

#include <LiquidCrystal_I2C.h>

// ----- Pins -----
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
#define RAIN_PIN A1
#define FIRE_PIN 6

// ----- Objects -----
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2); // LCD: 16 columns, 2 rows

void printSerialHeader() {
  Serial.println(
    "Temp(C),Humidity(%),SoilRaw,SoilStatus,RainRaw,RainStatus,FireStatus");
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.backlight();

  pinMode(FIRE_PIN, INPUT);

  lcd.print("Sensor Test");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(2000);
  lcd.clear();

  printSerialHeader();
}

void loop() {
  // --- DHT11 Sensor ---
  float temp = dht.readTemperature();
  float humid = dht.readHumidity();
  String tempStr = isnan(temp) ? "Err" : String(temp, 1);
  String humidStr = isnan(humid) ? "Err" : String(humid, 1);

  // --- Soil Moisture Sensor ---
  int soilRaw = analogRead(SOIL_PIN);
  int soilMoisture = map(soilRaw, 1023, 0, 0, 100);
  String soilStatus = "Normal";
  if (soilRaw < 500)
    soilStatus = "Wet";
  else if (soilRaw > 700)
    soilStatus = "Dry";

  // --- Rain Sensor ---
  int rainRaw = analogRead(RAIN_PIN);
  String rainStatus = (rainRaw < 500) ? "Rain" : "Dry";

  // --- Fire Sensor ---
  bool fireDetected = digitalRead(FIRE_PIN) == LOW;
  String fireStatus = fireDetected ? "FIRE!" : "NoFire";

  // --- LCD Table-like Display ---
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(tempStr);
  lcd.print("C H:");
  lcd.print(humidStr);

  lcd.setCursor(0, 1);
  lcd.print("S:");
  lcd.print(soilMoisture);
  lcd.print("% ");
  lcd.print("R:");
  lcd.print(rainStatus == "Rain" ? "Y" : "N");

  delay(2000);

  // Show fire status briefly
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fire:");
  lcd.print(fireStatus);
  lcd.setCursor(0, 1);
  lcd.print("Soil:");
  lcd.print(soilStatus);
  delay(1500);

  // --- Serial Output (CSV) ---
  Serial.print(tempStr);
  Serial.print(",");
  Serial.print(humidStr);
  Serial.print(",");
  Serial.print(soilRaw);
  Serial.print(",");
  Serial.print(soilStatus);
  Serial.print(",");
  Serial.print(rainRaw);
  Serial.print(",");
  Serial.print(rainStatus);
  Serial.print(",");
  Serial.println(fireStatus);
}