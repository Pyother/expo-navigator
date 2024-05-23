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

void setup() {

  Serial.begin(9600);
  
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

  if(!mqttClient.connect(MQTT_SERVER, MQTT_PORT))
  { // → connection attempts failure handling.
    Serial.print("MQTT connection failed, error code = ");
    Serial.println(mqttClient.connectError());
    while(1);
  }
  
  Serial.println("✓ Connected to MQTT broker.");
  Serial.println();
  mqttClient.subscribe(MQTT_TOPIC);
  // =======================================================
} 

void loop() {

  // =======================================================
  // ↓ Message handling loop.
  int messageSize = mqttClient.parseMessage();

  if (messageSize) 
  { // → New message handling.

    Serial.print("Received a message: ");

    char message [mqttClient.available()];
    int counter = 0;

    while (mqttClient.available()) 
    { // → Encrypting message.
      char value = mqttClient.read();
      message[counter] = value;
      Serial.print(value);
      counter++;
    }
    Serial.println();

    if(strncmp(message, "reqp", 4) == 0)
    { // → If message contains 'reqp', it's a position change request.
      int coords [2] = { atoi(&message[5]), 2 };
      change_position(coords);
    }
  }
}

void change_position(int coords[]) {
  Serial.println("Position change request.");
}
