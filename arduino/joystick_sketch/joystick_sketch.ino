// MQTT JOYSTICK CONTROLLER
#include <WiFiS3.h>
#include <ArduinoMqttClient.h>
#include "arduino_secrets.h"

// ↓ MQTT variables:
#define MQTT_SERVER "test.mosquitto.org"
#define MQTT_PORT 1883
#define MQTT_TOPIC "RTLSSystems"

// ↓ WiFi and MQTT clients:
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// ↓ Input/Output:
#define JOYSTICK1 A0
#define JOYSTICK2X A1
#define JOYSTICK2Y A2

// ↓ Global variables:
int status = WL_IDLE_STATUS; // → status of connection.

void setup() {

  Serial.begin(9600);

  // ↓ Setting up input/output pins.
  pinMode(JOYSTICK1, INPUT);
  pinMode(JOYSTICK2X, INPUT);
  pinMode(JOYSTICK2Y, INPUT);

  // =======================================================
  // ↓ Connection loop.
  if (WiFi.status() == WL_NO_MODULE)
  { // → no WiFi module found.
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  while (status != WL_CONNECTED)
  { // → connection attempts.
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    status = WiFi.begin(SECRET_SSID, SECRET_PASS);
    delay(10000);
  }

  if (!mqttClient.connect(MQTT_SERVER, MQTT_PORT))
  { // → connection attempts failure handling.
    Serial.print("MQTT connection failed, error code = ");
    Serial.println(mqttClient.connectError());
    while (1);
  }

  Serial.println("✓ Connected to MQTT broker.");
  Serial.println();
  mqttClient.subscribe(MQTT_TOPIC);
  // =======================================================
}

void loop() {

  int value = analogRead(JOYSTICK2Y);
  
  Serial.println(value);

  delay(50);

}
