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
int angle;

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

  int joystick1 = analogRead(JOYSTICK1);
  int joystick2_x = analogRead(JOYSTICK2X);
  int joystick2_y = analogRead(JOYSTICK2Y);
  
  // ↓ Joystick conditions:
  if (joystick2_y > 800 && joystick2_x < 800 && joystick2_x > 200) { angle = 0; }
  if (joystick2_y > 800 && joystick2_x > 800) { angle = 45; }
  if (joystick2_y < 800 && joystick2_y > 200 && joystick2_x > 800) { angle = 90; }
  if (joystick2_y < 200 && joystick2_x > 800) { angle = 135; }
  if (joystick2_y < 200 && joystick2_x < 800 && joystick2_x > 200) { angle = 180; }
  if (joystick2_y < 200 && joystick2_x < 200) { angle = 225; }
  if (joystick2_y > 200 && joystick2_y < 800 && joystick2_x < 200) { angle = 270; }
  if (joystick2_y > 800 && joystick2_x < 200) { angle = 315; }

  if(angle != 0) {
    String message = "reqr" + String(angle);
    mqttClient.beginMessage(MQTT_TOPIC);
    mqttClient.print(message);
    mqttClient.endMessage();
    Serial.print("Sent message: ");
    Serial.println(message);
  }

  if(joystick1 > 800) {
    String message = "reqp" + String(1);
    mqttClient.beginMessage(MQTT_TOPIC);
    mqttClient.print(message);
    mqttClient.endMessage();
    Serial.print("Sent message: ");
    Serial.println(message);
  }

  if(joystick1 < 200) {
    String message = "reqp" + String(0);
    mqttClient.beginMessage(MQTT_TOPIC);
    mqttClient.print(message);
    mqttClient.endMessage();
    Serial.print("Sent message: ");
    Serial.println(message);
  }
  
  delay(300);

  angle = 0;
}
