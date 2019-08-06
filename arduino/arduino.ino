//////////////////// LIBRARIES /////////////////////
#include <Arduino.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>

//////////////////// GLOBAL DEFINE /////////////////////
WiFiClient client;
SocketIoClient webSocket;



const char* ssid     = "test";
const char* password = "12345678";
char path[] = "/";
char host[] = "192.168.137.1";//WLAN IP (SERVER)
int port = 3000;




////////////////// LOOP AND SETUP ///////////////////////
void setup() {
    #if defined(ESP8266)
      Serial.begin(115200);
    #else
      Serial.begin(38400);
    #endif

    Serial.setDebugOutput(true);
    for(uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
        Serial.flush();
        delay(500);
    }
    wifi_connection();
    webSocket.on("connect", connection);
    webSocket.begin(host, port);
}





void loop() {
    webSocket.loop();

    webSocket.on("add_point", add_point);

    broadcast_test();

    delay(1000);
    
}




//////////////// BINDING CONNECTION /////////////////////
void wifi_connection(){
    Serial.print("\n");
    Serial.printf("WiFi Connecting to :: ");
    Serial.printf(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500); Serial.printf(".");
    }

    Serial.print("\n"); Serial.printf("WiFi connected");
    Serial.printf("IP address: ");
    Serial.print(WiFi.localIP());

    app_connection();
}





void app_connection(){
    Serial.print("\n");
    Serial.printf("App Connecting to :: ");
    Serial.printf(host);

    if (client.connect(host, port)) {
        Serial.printf("\nApp Server Connected\n");
    } else {
        Serial.printf("\nApp Server Connection failed\n");
    }

    Serial.print("");
}


void connection(const char * payload, size_t length) {

    webSocket.emit("connection", "ESP Connected");

}


//////////////// TRIGGER AND PARSE DATA /////////////////////
void add_point(const char * payload, size_t length) {

    parse_data(payload);//parse data

}

void parse_data(String msg){
    StaticJsonBuffer<2048> JSONBuffer;//Memory pool
    JsonObject& parsed = JSONBuffer.parseObject(msg);

    if (parsed.success()) {
         StaticJsonBuffer<200> jsonBuffer;
         JsonObject& dt = jsonBuffer.createObject();
         String name = parsed["name"];
         float point = parsed["point"];

         Serial.println(name);
         Serial.println(point);
    }
}





void broadcast_test(){
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dt = jsonBuffer.createObject();
    dt["name"]  = "WEMOS";
    dt["point"]  = 50;

    char jsondt[100];
    dt.printTo(jsondt);
    
    webSocket.emit("add_point_wemos", jsondt);//here replying
}
