var express = require('express');
var app = express();

//Veri Tabanı işlemleri için mongodb modülünü kullanacağız
var mongodb = require('mongodb');
//MongoDb bağlantısı ve sorgular için client oluşturuyoruz
var mongoclient = mongodb.MongoClient;

//Session işlemleri için Express-Session modülünü kullanıyoruz
var session = require('express-session');
//express modülü ile entegre çalışması için ayarlarını yapıyoruz
app.use(session({ 'secret': 'gizliSession' }))

//Cron Job işlemleri için node-cron modülünü kullanıyoruz
var cron = require('node-cron');

//Farklı servise http isteğinde bulunmak için http modülünü kullanacağız
var http = require("http");

//Bot için request modülünü ekliyoruz
var request = require('request');
//Bot ile getirilen veriyi parçalamak için kullanılacak paket.
var cheerio = require('cheerio'); 

// Express modülü dosyalara erişimi kapattığından klasorlere erişim için express static metudunu kullanmalıyız.
app.use("/img", express.static(__dirname + "/arayuz/img"));
app.use("/content", express.static(__dirname + "/arayuz/content"));


//Boş gelen isteğe verilecek cevap
app.get("", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Panel.html");
});

//Panele Yönlendirme
app.get("/panel", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Panel.html");
});

//Günün Kayıtları Yönlendirme
app.get("/BuGun", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Bugun.html");
});

//Günün Kayıtlarını Çekme Tabloda Olan Butun Kayıtlar
app.get("/kayitGetirBugun", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Gün bilgisini alıyoruz
            var gun = new Date().getDate();

            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tablodaki butun kayıtları alıyoruz
            kayitlar.find({ "Gun": gun.toString() }).toArray(function (err, result) {
            	res.send(result);
            });
        }
    });
});

//Günlük Kayıtları Yönlendirme
app.get("/Gunluk", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Gunluk.html");
});

//Günlük Kayıtlarını Çekme Tabloda Olan Butun Kayıtlar
app.get("/kayitGetirGunluk", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var gunlukKayitlar = db.collection("gunlukKayitlar");
            //İlgili tablodaki son 31 kayıdı alıyoruz _id zaman içerir ve buna göre desc(-1 / 1 asc yapar) yapıyoruz
            gunlukKayitlar.find().sort({ _id: -1 }).limit(31).toArray(function (err, result) {
            	res.send(result);
            });
        }
    });
});

//Aylık Kayıtları Yönlendirme
app.get("/Aylik", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Aylik.html");
});

//Aylık Kayıtlarını Çekme Tabloda Olan Butun Kayıtlar
app.get("/kayitGetirAylik", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var aylikKayitlar = db.collection("aylikKayitlar");

            //İlgili tablodaki son 12 kayıdı alıyoruz _id zaman içerir ve buna göre desc(-1 / 1 asc yapar) yapıyoruz
            aylikKayitlar.find().sort({ _id: -1 }).limit(12).toArray(function (err, result) {
            	res.send(result);
            });

        }
    });
});

//Yıllık Kayıtları Yönlendirme
app.get("/Yillik", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Yillik.html");
});

//Yıllık Kayıtlarını Çekme Tabloda Olan Butun Kayıtlar
app.get("/kayitGetirYillik", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var yillikKayitlar = db.collection("yillikKayitlar");
            //İlgili tablodaki son 10 kayıdı alıyoruz _id zaman içerir ve buna göre desc(-1 / 1 asc yapar) yapıyoruz
            yillikKayitlar.find().sort({ _id: -1 }).limit(10).toArray(function (err, result) {
            	res.send(result);
            });
        }
    });
});

//Geliştirici Yönlendirme
app.get("/Gelistirici", function (req, res) {
    //Bu kod bloğu html dosya dönmek için kullanılır
    res.sendfile(__dirname + "/arayuz/Gelistirici.html");
});

//ldr Aç Kapat Yönlendirme
app.get("/LdrAcKapat", function (req, res) {
	try {
		http.get('http://192.168.1.36/ldrDevreDisiAktif', (resp) => {

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}
	catch (err) {
		console.log("Hata: " + err.message);
	}
	res.send("Basarili");
});

//-------------------- Veri Tabanı Kayıt Girme İşlemleri --------------------------


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! En son aç için nodemcu tetikleme yapıyordum------------------------ 

//Kayıt Ekleme
app.get("/ac", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tabloya kayıt giriyoruz
            kayitlar.insert({ "Gun": new Date().getDate().toString(), "Ay": (new Date().getMonth() + 1).toString(), "Yil": new Date().getFullYear().toString(), "Saat": Date.now().toString(), "Durum": "1" }, function (err, result) {
            	if (err) {
            		res.send("Kayıt işleminde hata oluştu");
            	} else {
                    //Nodemcu roleAcKapat metodunu tetikliyoruz satır: 222
                    res.send(roleAcKapat());
                }

            });

        }

    });

});

app.get("/kapat", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tabloya kayıt giriyoruz
            kayitlar.insert({ "Gun": new Date().getDate().toString(), "Ay": (new Date().getMonth() + 1).toString(), "Yil": new Date().getFullYear().toString(), "Saat": Date.now().toString(), "Durum": "0" }, function (err, result) {
            	if (err) {
            		res.send("Kayıt işleminde hata oluştu");
            	}else {
                    //Nodemcu roleAcKapat metodunu tetikliyoruz satır: 222
                    
                    res.send(roleAcKapat());
                }

            });
        }

    });
});

//Nodemcu roleAcKapat metodunu tetikliyoruz
function roleAcKapat() {
	try {
		http.get('http://192.168.1.36/roleAcKapat', (resp) => {
			return"Basarili";
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}
	catch (err) {
		console.log("Hata: " + err.message);
		return"Basarisiz";
	}
}

//Nodemcudan Gelen İstek İle Kayıt Ekleme
app.get("/acNodemcudan", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tabloya kayıt giriyoruz
            kayitlar.insert({ "Gun": new Date().getDate().toString(), "Ay": (new Date().getMonth() + 1).toString(), "Yil": new Date().getFullYear().toString(), "Saat": Date.now().toString(), "Durum": "1" }, function (err, result) {
            	if (err) {
            		res.send("Kayıt işleminde hata oluştu");
            	} else {
            		res.send("Basarili");
            	}

            });

        }

    });

});

app.get("/kapatNodemcudan", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tabloya kayıt giriyoruz
            kayitlar.insert({ "Gun": new Date().getDate().toString(), "Ay": (new Date().getMonth() + 1).toString(), "Yil": new Date().getFullYear().toString(), "Saat": Date.now().toString(), "Durum": "0" }, function (err, result) {
            	if (err) {
            		res.send("Kayıt işleminde hata oluştu");
            	}else {
            		res.send("Basarili");
            	}

            });
        }

    });
});

global.gunlukWatBiriFiyat = "1234";
//Bot ile veri çekme
app.get("/bot", function (req, res) {
	console.log(gunlukWatBiriFiyat);
	res.send(gunlukWatBiriFiyat);
});


//---------------------------------------Cron Joblar-------------------------------------------------------

//Her gün 08:00 da Günlük Wat ücreti alınıyor
var gunlukWatUcreti = cron.schedule('00 08 * * *', () => {
	console.log("Cron çalişti");
	request('https://gazelektrik.com/tedarikciler/sepas-enerji/birim-fiyat', function (error, response, html) {
		if ( ! error && response.statusCode == 200) {
			var $ = cheerio.load(html);

			$('table.table').each( async function(i, element){
				gunlukWatBiriFiyat = await $(this).find('strong span').text().substring(16,20);
				console.log(gunlukWatBiriFiyat);
			});
		}else
		{
			console.log("olmadı");
		}
	});

}, {
	scheduled: false,
	timezone: "Europe/Istanbul"
});

//Her gün 23:59 da kayıtlar tablosunda olan günün verilerini günlük tablosuna kaydediyor
var gunluk = cron.schedule('59 23 * * *', () => {
	console.log("Cron çalişti");
    //Bu günün verisi için veri kontrolü yapıyoruz

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Tarih verilerini oluşturuyoruz
            var gun = new Date().getDate().toString();
            var ay = (new Date().getMonth() + 1).toString();
            var yil = new Date().getFullYear().toString();
            //Gün içindeki Kayıtları Günlük Kayıtlara Çeviriyoruz
            //Kullanacağımız Tabloyu Seçiyoruz
            var kayitlar = db.collection("kayitlar");
            //İlgili tablodaki butun kayıtları alıyoruz

            kayitlar.find({ Gun: gun, Ay: ay, Yil: yil }).toArray(function (err, result) {
            	var total1 = 0;
            	var total0 = 0;
            	var totalSure = 0;
            	for (i = 0; i < result.length; i++) {
            		if ((result.length) != 1) {
            			if (result[i].Durum == "1" && i != (result.length - 1)) {
            				total1 += parseInt(result[i].Saat);
            			} else if (result[i].Durum == "0" && i != 0) {
            				total0 += parseInt(result[i].Saat);
            			}
            		}
            		totalSure = total0 - total1;
            	}

                //Kayıt için kullanacağımız tabloyu seçiyoruz
                var gunlukKayitlar = db.collection("gunlukKayitlar");
                gunlukKayitlar.insert({ "Gun": gun, "Ay": ay, "Yil": yil, "ToplamSaat": totalSure });
            });
        }
    });
}, {
	scheduled: false,
	timezone: "Europe/Istanbul"
});

//Her Ayın 30'u  23:59 da gunlukKayıtlar tablosunda olan ayın verilerini aylikKayıtlar tablosuna kaydediyor
var aylik = cron.schedule('59 23 30 * *', () => {
    //Bu ayın verisi için veri kontrolü yapıyoruz

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Tarih verilerini oluşturuyoruz
            var ay = (new Date().getMonth() + 1).toString();
            var yil = new Date().getFullYear().toString();
            //Günlük Kayıtları Aylık Kayıtlara Çeviriyoruz
            //Kullanacağımız Tabloyu Seçiyoruz
            var gunlukKayitlar = db.collection("gunlukKayitlar");
            //İlgili tablodaki butun kayıtları alıyoruz
            var totalSure = 0;
            gunlukKayitlar.find({ Ay: ay, Yil: yil }).toArray(function (err, result) {
            	for (i = 0; i < result.length; i++) {
            		totalSure += parseInt(result[i].ToplamSaat);
            	}

                //Kayıt için kullanacağımız tabloyu seçiyoruz
                var aylikKayitlar = db.collection("aylikKayitlar");
                aylikKayitlar.insert({ "Ay": ay, "Yil": yil, "ToplamSaat": totalSure });
            });
        }
    });
}, {
	scheduled: false,
	timezone: "Europe/Istanbul"
});

//Her Yıl 12. Ayın 31'i  23:59 da aylikKayıtlar tablosunda olan yılın verilerini yillikKayıtlar tablosuna kaydediyor
var yillik = cron.schedule('59 23 31 12 *', () => {
    //Bu yılın verisi için veri kontrolü yapıyoruz

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    	if (err) {
    		res.send("Veri Tabanı Bağlantısı Yapılamadı");
    	} else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("bilgisayarliKontrol");
            //Tarih verilerini oluşturuyoruz
            var yil = new Date().getFullYear().toString();

            //Aylık Kayıtları Yıllık Kayıtlara Çeviriyoruz
            //Kullanacağımız Tabloyu Seçiyoruz
            var aylikKayitlar = db.collection("aylikKayitlar");
            //İlgili tablodaki butun kayıtları alıyoruz
            var totalSure = 0;
            aylikKayitlar.find({ Yil: yil }).toArray(function (err, result) {
            	for (i = 0; i < result.length; i++) {
            		totalSure += parseInt(result[i].ToplamSaat);
            	}

                //Kayıt için kullanacağımız tabloyu seçiyoruz
                var yillikKayitlar = db.collection("yillikKayitlar");
                yillikKayitlar.insert({ "Yil": yil, "ToplamSaat": totalSure });
            });
        }
    });
}, {
	scheduled: false,
	timezone: "Europe/Istanbul"
});

//Cron Jobu başlatıyoruz
gunlukWatUcreti.start();
gunluk.start();
aylik.start();
yillik.start();











//Dosya İndirme İşlemi
app.get("/dosyaIndir", function (req, res) {

	res.download(__dirname + "/arayuz/img/rtaplamaci.png");
});

//404 için yazlan blok
app.use(function (req, res) {
    //Bazı tarayıcılarda status code 404 olunca varsayılan 404 sayfası görüntülenmediğinden alttaki kod satırı yorumlandı
    //res.status(404);
    res.sendFile(__dirname + "/arayuz/404.html");
});

//Servera harici bir cihazdan erişilebilmesi için aşağıdaki kod yazılır
app.listen(8020, "0.0.0.0");