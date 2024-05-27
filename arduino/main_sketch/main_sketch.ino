#include <WiFiS3.h>
#include <ArduinoMqttClient.h>
#include <cstring>
#include <cstdlib>
#include "arduino_secrets.h"

// ↓ MQTT variables:
#define MQTT_SERVER "test.mosquitto.org"
#define MQTT_PORT 1883
#define MQTT_TOPIC "RTLSSystems"

// ↓ WiFi and MQTT clients:
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// ↓ Global variables:
int status = WL_IDLE_STATUS; // → status of connection.

// ↓ Input/Output:
#define ENGINE1_BACKWARD A0
#define ENGINE1_FORWARD A1
#define ENGINE2_BACKWARD A2
#define ENGINE2_FORWARD A3

void setup()
{

  Serial.begin(9600);

  // ↓ Setting up input/output pins.
  pinMode(ENGINE1_FORWARD, OUTPUT);
  pinMode(ENGINE1_BACKWARD, OUTPUT);
  pinMode(ENGINE2_FORWARD, OUTPUT);
  pinMode(ENGINE2_BACKWARD, OUTPUT);

  // =======================================================
  // ↓ Connection loop.
  if (WiFi.status() == WL_NO_MODULE)
  { // → no WiFi module found.
    Serial.println("Communication with WiFi module failed!");
    while (true)
      ;
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
    while (1)
      ;
  }

  Serial.println("✓ Connected to MQTT broker.");
  Serial.println();
  mqttClient.subscribe(MQTT_TOPIC);
  // =======================================================
}

void loop()
{

  // =======================================================
  // ↓ Message handling loop.
  int messageSize = mqttClient.parseMessage();

  if (messageSize)
  { // → New message handling.

    Serial.print("Received a message: ");

    char message[mqttClient.available()];
    int counter = 0;

    while (mqttClient.available())
    { // → Encrypting message.
      char value = mqttClient.read();
      message[counter] = value;
      Serial.print(value);
      counter++;
    }
    Serial.println();

    if (strncmp(message, "reqp", 4) == 0)
    { // → If message contains 'reqp', it's a position change request.
      change_position(atoi(&message[4]));
    }

    if (strncmp(message, "reqr", 4) == 0)
    { // → If message contains 'reqr', it's a rotation request.
      char angleStr[4] = {message[4], message[5], message[6], '\0'};  // → Extracting angle from message.
      int angle = atoi(angleStr);
      rotate(angle);
    }
  }
}

void change_position(int position)
{
  Serial.println("Position change request.");
  if (position)
  {
    Serial.println("Positive");
    digitalWrite(ENGINE1_FORWARD, HIGH);
    digitalWrite(ENGINE1_BACKWARD, LOW);
    digitalWrite(ENGINE2_FORWARD, HIGH);
    digitalWrite(ENGINE2_BACKWARD, LOW);

    delay(1000);

    digitalWrite(ENGINE1_FORWARD, LOW);
    digitalWrite(ENGINE1_BACKWARD, LOW);
    digitalWrite(ENGINE2_FORWARD, LOW);
    digitalWrite(ENGINE2_BACKWARD, LOW);
  }
  else
  {
    Serial.println("Negative");
  }
}

void rotate(int angle)
{
  Serial.println("Rotation change request.");
  Serial.print("Angle: ");
  Serial.println(angle);
}
