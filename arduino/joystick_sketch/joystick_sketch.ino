// MQTT JOYSTICK CONTROLLER

#define XPIN  A0
#define YPIN  A1

void setup() {
  Serial.begin(9600);
  pinMode(XPIN, INPUT);
  pinMode(YPIN, INPUT);
}

void loop() {
  Serial.println(analogRead(XPIN));
  delay(100);
}
