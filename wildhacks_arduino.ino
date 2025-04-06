#include <LiquidCrystal.h>

// KEYBOARD CONFIG
const int button_enter = 7,button_1 = A0, button_2 = A1, button_3 = A2, button_4 = A3, button_5 = A4, button_6 = A5;
unsigned long lastPressTime = 0;
bool waitingForSecondPress = false;
const unsigned long backspaceThreshold = 300;
const int debounce_delay = 50;

struct ButtonState {
  uint8_t btn1 : 1;
  uint8_t btn2 : 1;
  uint8_t btn3 : 1;
  uint8_t btn4 : 1;
  uint8_t btn5 : 1;
  uint8_t btn6 : 1;
  uint8_t reserved : 2;
};
ButtonState state = {0};

// DISPLAY CONFIG
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
String incoming = "";

/*
bit representation = 0 0 btn_6 btn_5 btn_4 btn_3 btn_2 btn_1
*/
char serialize_output(ButtonState state) {
  uint8_t raw = *(uint8_t*)&state;

  // Clear bits 7..6 and then set bit 6.
  // This ensures bits [7..6] == 01, giving a final range of 0x40..0x5F
  raw &= 0x3F;   // 0b00111111
  raw |= 0x40;   // 0b01000000

  return (char)raw;
  // raw &= 0x3F;   // 0b00111111
  // raw |= 0x40;   // 0b01000000
  // return *(char*)&state;
}

void brailleByteToPattern(uint8_t brailleByte, byte pattern[8]) {
  // Row 0: dots 1 and 4
  pattern[0] = ((brailleByte & B1) ? B01000 : 0) | ((brailleByte & B10) ? B00010 : 0);
  // Row 1: dots 2 and 5
  pattern[2] = ((brailleByte & B100) ? B01000 : 0) | ((brailleByte & B1000) ? B00010 : 0);
  // Row 2: dots 3 and 6
  pattern[4] = ((brailleByte & B10000) ? B01000 : 0) | ((brailleByte & B100000) ? B00010 : 0);
  // Remaining rows are blank
  pattern[1] = 0;
  pattern[3] = 0;
  pattern[5] = 0;
  pattern[6] = 0;
  pattern[7] = 0;
}

void displayBrailleString(String brailleStr) {
  lcd.clear();
  lcd.setCursor(0, 0);
  for (int i = 0; i < brailleStr.length(); i++) {
    uint8_t brailleByte = brailleStr[i];
    byte pattern[8];
    brailleByteToPattern(brailleByte, pattern);
    // Update custom character slot 0 with this braille pattern
    lcd.createChar(i, pattern);
    // Write the custom character (index 0) to the LCD.
    lcd.setCursor(i, 0);
    lcd.write(byte(i));
  }
}

void setup() {
  Serial.begin(9600);

  lcd.begin(16, 2);
  lcd.clear();

  // HELLO WORLD
  lcd.setCursor(0, 0);
  lcd.print("HELLO");
  lcd.setCursor(0, 1);
  lcd.print("WORLD!");

  pinMode(button_1, INPUT_PULLUP);
  pinMode(button_2, INPUT_PULLUP);
  pinMode(button_3, INPUT_PULLUP);
  pinMode(button_4, INPUT_PULLUP);
  pinMode(button_5, INPUT_PULLUP);
  pinMode(button_6, INPUT_PULLUP);
  pinMode(button_enter, INPUT_PULLUP);
}

void loop() {
  /*
  INTERFACE:
  - pass 16 character long string excluding \n (terminating character)
  - each character encoded in its braille "encoding" "0 0 button6, button5, button4, button3, button2, button1"
  */
  
  //
  // DISPLAY 
  //
  while (Serial.available() > 0) {
    char c = Serial.read();
    // End the string on newline or after a set number of characters (e.g., 12)
    Serial.println(c);
    if (c == '\n') {
      displayBrailleString(incoming);
      incoming = "";
    } else {
      incoming += c;
    }
  }

  //
  // KEYBOARD
  //
  static bool lastButtonState = HIGH;
  bool currentButtonState = digitalRead(button_enter);

  if (lastButtonState == HIGH && currentButtonState == LOW) { // enter button pressed
    unsigned long now = millis();

    if (waitingForSecondPress && (now - lastPressTime <= backspaceThreshold)) {
      Serial.println("Backspace");

      state = {0}; // reset state
      waitingForSecondPress = false;

    } else {
      waitingForSecondPress = true; 
      lastPressTime = now;
    }

    delay(debounce_delay);
  }

  if (waitingForSecondPress && millis() - lastPressTime > backspaceThreshold) { // normal "Enter"
    // Serial.println("Space");
    
    //
    // flush output to chris
    //
    Serial.println(serialize_output(state));
    state = {0};
    waitingForSecondPress = false;
  }

  lastButtonState = currentButtonState;

  if (digitalRead(button_1) == LOW) {
    // Serial.println("button 1");
    state.btn1 = 1;
    delay(debounce_delay);
  }
  if (digitalRead(button_2) == LOW) {
    // Serial.println("button 2");
    state.btn2 = 1;
    delay(debounce_delay);
  }
  if (digitalRead(button_3) == LOW) {
    // Serial.println("button 3");
    state.btn3 = 1;
    delay(debounce_delay);
  }
  if (digitalRead(button_4) == LOW) {
    // Serial.println("button 4");
    state.btn4 = 1;
    delay(debounce_delay);
  }
  if (digitalRead(button_5) == LOW) {
    // Serial.println("button 5");
    state.btn5 = 1;
    delay(debounce_delay);
  }
  if (digitalRead(button_6) == LOW) {
    // Serial.println("button 6");
    state.btn6 = 1;
    delay(debounce_delay);
  }
}