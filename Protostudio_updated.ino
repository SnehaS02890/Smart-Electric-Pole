#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int gasPin = A0;
const int trigPin = 3;
const int echoPin = 4;

long duration;
int distance;

int vehicleCount = 0;
bool objectDetected = false;

int gasThreshold = 350;

void setup()
{
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  lcd.init();
  lcd.backlight();

  Serial.begin(9600);

  lcd.setCursor(0, 0);
  lcd.print("System Ready");
  delay(2000);
  lcd.clear();
}

void loop()
{
  // Gas sensor reading
  int gasValue = analogRead(gasPin);

  // Ultrasonic distance measurement
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);

  if (duration > 0)
    distance = duration * 0.034 / 2;
  else
    distance = 999;

  // Vehicle counting
  if (distance > 0 && distance < 10 && !objectDetected)
  {
    vehicleCount++;
    objectDetected = true;
  }

  if (distance > 15)
  {
    objectDetected = false;
  }

  // Serial Monitor
  Serial.print(vehicleCount);
  Serial.print(",");
  Serial.println(gasValue);

  // LCD Display
  lcd.setCursor(0, 0);

  if (gasValue > gasThreshold)
  {
    lcd.print("WEAR MASK!    ");
  }
  else
  {
    lcd.print("Gas:");
    lcd.print(gasValue);
    lcd.print("     ");
  }

  lcd.setCursor(0, 1);
  lcd.print("Count:");
  lcd.print(vehicleCount);
  lcd.print("     ");

  delay(500);
}