#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// ======================================================
// GPS
// ======================================================

TinyGPSPlus gps;
HardwareSerial gpsSerial(1);

// ======================================================
// SIM A7680C
// ======================================================

HardwareSerial simSerial(2);

// ======================================================
// TFT ST7789
// ======================================================

#define TFT_CS   5
#define TFT_DC   2
#define TFT_RST  4

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

// ======================================================
// ThingSpeak
// ======================================================

String apiKey = "37HU9UXSRTV929ME";

// ======================================================
// Variables
// ======================================================

unsigned long lastScreenUpdate = 0;
unsigned long lastThingSpeak = 0;

// ======================================================
// Reset TFT
// ======================================================

void resetTFT() {
  pinMode(TFT_RST, OUTPUT);

  digitalWrite(TFT_RST, LOW);
  delay(50);

  digitalWrite(TFT_RST, HIGH);
  delay(150);
}

// ======================================================
// Send AT Command
// ======================================================

void sendAT(String cmd, int waitTime = 1000)
{
  simSerial.println(cmd);

  delay(waitTime);

  while (simSerial.available()) {
    Serial.write(simSerial.read());
  }
}

// ======================================================
// Setup SIM
// ======================================================

void setupSIM()
{
  Serial.println("===== SIM START =====");

  sendAT("AT");
  sendAT("AT+CPIN?");
  sendAT("AT+CSQ");

  // Attach network
  sendAT("AT+CGATT=1", 3000);

  // Vinaphone APN
  sendAT("AT+CGDCONT=1,\"IP\",\"m3-world\"", 3000);

  Serial.println("===== SIM READY =====");
}

// ======================================================
// Send GPS to ThingSpeak
// ======================================================

void sendThingSpeak(float lat, float lng, float speed, int sat)
{
  Serial.println("===== SEND THINGSPEAK =====");

  String url =
    "http://api.thingspeak.com/update?api_key=" +
    apiKey +
    "&field1=" + String(lat, 6) +
    "&field2=" + String(lng, 6) +
    "&field3=" + String(speed, 2) +
    "&field4=" + String(sat);

  Serial.println(url);

  // HTTP Init
  sendAT("AT+HTTPINIT", 2000);

  // URL
  simSerial.print("AT+HTTPPARA=\"URL\",\"");
  simSerial.print(url);
  simSerial.println("\"");

  delay(2000);

  while (simSerial.available()) {
    Serial.write(simSerial.read());
  }

  // HTTP GET
  sendAT("AT+HTTPACTION=0", 7000);

  // Read response
  sendAT("AT+HTTPREAD", 3000);

  // End HTTP
  sendAT("AT+HTTPTERM", 2000);

  Serial.println("===== DONE =====");
}

void setup()
{
  Serial.begin(115200);

  // ======================================================
  // GPS UART
  // RX = 16
  // TX = 17
  // ======================================================

  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);

  // ======================================================
  // SIM UART
  // RX = 26
  // TX = 27
  // ======================================================

  simSerial.begin(115200, SERIAL_8N1, 26, 27);

  // ======================================================
  // TFT
  // ======================================================

  resetTFT();

  tft.init(170, 320);

  tft.setRotation(1);

  tft.fillScreen(ST77XX_BLACK);

  tft.setTextColor(ST77XX_WHITE);

  tft.setTextSize(2);

  tft.setCursor(10, 10);

  tft.println("SYSTEM START");

  delay(3000);

  // ======================================================
  // Setup SIM
  // ======================================================

  setupSIM();
}

void loop()
{
  // ======================================================
  // Read GPS
  // ======================================================

  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  // ======================================================
  // Update screen every 1 second
  // ======================================================

  if (millis() - lastScreenUpdate > 1000)
  {
    lastScreenUpdate = millis();

    int sat = gps.satellites.value();

    String status;

    if (!gps.location.isValid() || sat == 0) {
      status = "NO SIGNAL";
    }
    else if (sat < 4) {
      status = "WEAK GPS";
    }
    else {
      status = "GPS OK";
    }

    // ======================================================
    // Clear screen
    // ======================================================

    tft.fillScreen(ST77XX_BLACK);

    tft.setTextSize(2);

    // ======================================================
    // Title
    // ======================================================

    tft.setCursor(10, 5);
    tft.println("GPS TRACKER");

    // ======================================================
    // Satellites
    // ======================================================

    tft.setCursor(10, 35);
    tft.print("Sat: ");
    tft.println(sat);

    // ======================================================
    // Status
    // ======================================================

    tft.setCursor(10, 60);
    tft.println(status);

    // ======================================================
    // GPS Valid
    // ======================================================

    if (gps.location.isValid())
    {
      float lat = gps.location.lat();
      float lng = gps.location.lng();
      float speed = gps.speed.kmph();
      int sat = gps.satellites.value();

      tft.setCursor(10, 90);
      tft.print("Lat:");

      tft.setCursor(10, 110);
      tft.println(lat, 6);

      tft.setCursor(10, 135);
      tft.print("Lng:");

      tft.setCursor(10, 155);
      tft.println(lng, 6);

      tft.setCursor(10, 180);
      tft.print("Speed:");

      tft.setCursor(10, 200);
      tft.print(speed, 2);
      tft.println(" km/h");

      tft.setCursor(10, 225);
      tft.print("SAT:");

      tft.setCursor(10, 245);
      tft.println(sat);

      // ======================================================
      // Serial Debug
      // ======================================================

      Serial.print("Lat: ");
      Serial.println(lat, 6);

      Serial.print("Lng: ");
      Serial.println(lng, 6);

      // ======================================================
      // Send ThingSpeak every 20 sec
      // ======================================================

      if (millis() - lastThingSpeak > 20000)
      {
        lastThingSpeak = millis();

        sendThingSpeak(lat, lng, speed, sat);
      }
    }
    else
    {
      tft.setCursor(10, 100);
      tft.println("Waiting GPS...");

      Serial.println("No GPS...");
    }
  }
}