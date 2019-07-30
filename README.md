## Bilgilendirme
SmartLigt projesi benim(Ramazna Taplamacı) tarafımdan Bilgisayarlı Kontrol dersi final projesi olarak hazırlanmış olup, ilk NodeJS, AngularJs ve Android uygulama çalışmamı içermektedir.

Projeyi Ayağa Kaldırabilmeniz için;

 SmartLight/SmartLight-NodeJs/server.js  dosyasında bulunan [{*Nodemcu Cihazınızın Ip Adresi*}] taglarını Nodemcu Cihazınızın Ip Adresi ile değiştirmeniz gerekir.
 Örn: 192.168.1.10

 Ayrıca SmartLight/NodemcuServer/NodemcuServer.ino dosyasında bulunan [{NodeJs Server Kurulu Makinenin Ip Adresi ve Protu}] taglarını NodeJs Server Kurulu Makinenin Ip Adresi ve Protu ile değiştirmeniz gerekir.
 Örn: 192.168.1.10:8020

 Ayrıca SmartLight/NodemcuServer/NodemcuServer.ino dosyasında Kullanacağınız Ağ Adını ve Şifresini belirtmeniz gerekir.

 İyi Çalışmalar...
 Ramazan Taplamacı
 www.rtaplamaci.com


# SmartLight
Belirli bir aydınlatma aygıtının günlük durumunun takip edilebileceği, günlük, aylık, yıllık bazda veri analizi yapılabileceği, sensör ve uygulama vasıtası ile aygıta komut gönderilebileceği; IoT, Mobil ve Web Teknolojilerinin kullanıldığı Akıllı Aydınlatma sistemi. 

Kullanıcıların uzaktan erişim sağlaması amaçlanarak bu doğrultuda hibrit mobil uygulama üzerine entegre edilen IoT projesidir.

![Uygulama Görselleri](https://github.com/rtaplamaci/SmartLight-IoT/blob/master/Uygulama%20G%C3%B6rselleri.png)
## Kullanılan Teknolojiler
Akıllı Aydınlatma projesini geliştirirken genel itibari ile web teknolojilerini kullanarak web uygulaması oluşturma, ardından hibrit uygulamaya çevirerek Web ve Android platformlarını desteklemek amaçlanmıştır.

Web Teknolojileri olarak;

Front-End tarafında: HTML5, Css3, JavaScript, ChartJs ve AngularJs teknolojilerini kullanılmış olup, Back-End tarafında ise: NodeJs kullanılmıştır.

Veri Tabanı olarak MongoDB kullanılmıştır.   

Android uygulaması için Java ve BuiltIn Google Ses Tanımlama Servisi kullanılmıştır.

IoT tarafında ise Nodemcu Lolin, Ldr Işık Sensörü ve Tek Kanallı Röle kullanılarak uzaktan ve sensörlü kontrol için düzenek hazırlanmıştır. Programlama için C++ programa dili kullanılmıştır.  

## Çalışma Yöntemleri

Sensor Aktif Durumda İken:

Sensor aktif ise Nodemcu sensörden gelen komutu baz alarak çalışır. Bu doğrultuda önceden belirlenen bir eşik değeri baz alınarak Röleye aç veya kapat isteğinde bulunur. Bu doğrultuda otomize olarak aydınlatma sistemi çalışır.

Sensor Pasif Durumda İken:

Sensör pasif ise cihaz kullanıcıdan gelen komutları baz alarak çalışır. Bu doğrultuda kullanıcı mobil veya web uygulaması üzerinden Nodemcu’ya göndereceği isteğe istinaden Röleye aç veya kapat komutu gönderilir.
Bu her iki durumda da NodeJs Api’ye MongoDb’ye kayıt girmesi için istekte bulunulur ve ilgili hareketler kayıt altına alınır.
Alınan kayıtlar doğrultusunda her gün saat 23:59’da çalışmak üzere hazırlanan cron-job vasıtası ile gununKayitlari koleksiyonunda olan verilerin ortalamasını gunlukKayitlar tablosuna ilgili gün bilgileri ile kaydedilir ve bu veriler Günlük İstatistikler için kullanılır.

“gunlukKayitlar” koleksiyonuna eklenen veriler ise her ayın 30’u saat 23:59’da çalışmak üzere hazırlanan cron-job vasıtası ile günlükKayitlar koleksiyonunda bulunan ilgili ayın verilerinin ortalamasını aylikKayitlar koleksiyonuna ekler ve bu veriler Aylık İstatistikler için kullanılır.

“aylikKayitlar” koleksiyonuna eklenen veriler ise her yılın Aralık ayının 30’u saat 23:59’da çalışmak üzere hazırlanan cron-job vasıtası ile aylıkKayitlar koleksiyonunda bulunan ilgili ayın verilerinin ortalamasını yıllıkKayitlar koleksiyonuna ekler ve bu veriler Aylık İstatistikler için kullanılır.

Sesli Komutlar ise projede kullanılan ve Android uygulama üzerinde çalışan BuiltIn Google ses servisini kullanmaktadır. Bu doğrultuda alınan ses kaydı Google Servisine gönderilip gelen cevaba göre işlem yapılmaktadır.
