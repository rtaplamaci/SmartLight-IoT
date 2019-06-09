
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266HTTPClient.h>

#ifndef STASSID
#define STASSID "Ag Adi"//----------------------------------------------------Wifi AG ADI
#define STAPSK  "Ag Sifresi"//--------------------------------------------Wifi AG SIFRESI
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

ESP8266WebServer server(80);

int Led = 2;
int ldrDurumu = 0;
int roleDurum = 0;
int ldrRoleActiMi = 0;


//----------------------------------------------------------------------------- bosIstek() -----------------------------------------------------------------------------
void bosIstek() {
  char temp[500];

  snprintf(temp, 500,

   "<html>\
   <head>\
    <meta charset='utf-8'>\
   <title>ESP8266 Demo</title>\
   <style>\
   body { background-color: #000; font-family: Arial, Helvetica, Sans-Serif; Color: #fff; text-align: center; }\
   </style>\
   </head>\
   <body>\
        <br>\
        <br>\
        <br>\
        <br>\
        <br>\
        <h1>Bilgisayarlı Kontrol</h1>\
        <h4>Bilgi için: Ramazan Taplmacı <br> ramazantaplamaci81@gmail.com <br> rtaplamaci.com</h4>\
   </body>\
   </html>"
   );
  server.send(200, "text/html", temp);
}

//----------------------------------------------------------------------------- notFound() -----------------------------------------------------------------------------
void notFound() {
  char temp[500];

  snprintf(temp, 500,

   "<html>\
   <head>\
   <meta charset='utf-8'>\
   <title>ESP8266 Demo</title>\
   <style>\
   body { background-color: #000; font-family: Arial, Helvetica, Sans-Serif; Color: #fff; text-align: center; }\
   </style>\
   </head>\
   <body>\
        <br>\
        <br>\
        <br>\
        <h1>Üzgünüz :(</h1>\
        <h4>Böyle bir sayfa bulunamadı!</h4>\
        <h4>Bilgi için: Ramazan Taplmacı</h4>\
        <h4>ramazantaplamaci81@gmail.com</h4>\
        <h4>rtaplamaci.com</h4>\
   </body>\
   </html>"
   );
  server.send(200, "text/html", temp);
}
//----------------------------------------------------------------------------- roleAcKapat() -----------------------------------------------------------------------------
void roleAcKapat(){
 if (roleDurum == 0)
  {
    roleDurum = 1;
    digitalWrite(Led, LOW);
  }else{
    roleDurum = 0;
    digitalWrite(Led, HIGH);
  }
  server.send(200,"text-plain","Basarili");
}
//----------------------------------------------------------------------------- ldrDevreDisiAktif() -----------------------------------------------------------------------------
void ldrDevreDisiAktif(){
  if( ldrDurumu == 0 ){
    ldrDurumu = 1;
    }else{
    ldrDurumu = 0;
    }
      server.send(200,"text-plain","Basarili");
}
//----------------------------------------------------------------------------- setup() -----------------------------------------------------------------------------
void setup(void) {
  pinMode(Led, OUTPUT);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", bosIstek);
  server.on("/roleAcKapat", roleAcKapat);
  server.on("/ldrDevreDisiAktif", ldrDevreDisiAktif);
 
  server.onNotFound(notFound);
  server.begin();
  Serial.println("HTTP server started");
  
  //Hazır İşareti
  digitalWrite(Led, 0);
  delay(50);
  digitalWrite(Led, 1);
}
//----------------------------------------------------------------------------- loop() -----------------------------------------------------------------------------
void loop(void) {
  server.handleClient();
  MDNS.update();
  if(ldrDurumu == 1){
    delay(50);
    int gelen = analogRead(A0);
    Serial.print(gelen);
    Serial.print(ldrRoleActiMi);
  
    if (gelen <= 100 && ldrRoleActiMi == 0)
    {
      roleDurum = 1;
      ldrRoleActiMi = 1;
      digitalWrite(Led, LOW);
      HTTPClient http;  //Declare an object of class HTTPClient
      http.begin("http://[{NodeJs Server Kurulu Makinenin Ip Adresi ve Protu}]/acNodemcudan");  //Specify request destination
      int httpCode = http.GET(); 
      http.end();   //Close connection  
    }else if (gelen > 100 && ldrRoleActiMi == 1){
      roleDurum = 0;
      ldrRoleActiMi = 0;
      digitalWrite(Led, HIGH);
      HTTPClient http;  //Declare an object of class HTTPClient
      http.begin("http://[{NodeJs Server Kurulu Makinenin Ip Adresi ve Protu}]/kapatNodemcudan");  //Specify request destination
      int httpCode = http.GET(); 
      http.end();   //Close connection  
    }
  }
 
}
