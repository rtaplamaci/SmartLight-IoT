package com.rtaplamaci.bilgisayarlikontrol.bilgisayarlikontrol;

import android.content.Intent;
import android.speech.RecognizerIntent;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class webProject extends AppCompatActivity {
    private static final int REQUEST_CODE_SPEECH_INPUT = 1000;
    Button btnAc;
    Button btnKapat;
    Button btnSensor;
    Button btnSes;
    TextView txtMesaj;
    String ip;
    WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_project);
        btnAc = findViewById(R.id.btnAc);
        btnKapat = findViewById(R.id.btnKapat);
        btnSensor = findViewById(R.id.btnSensor);
        btnSes = findViewById(R.id.btnSes);
        txtMesaj = findViewById(R.id.txtMesaj);
        ip = getIntent().getExtras().getString("veri");

        webView = (WebView) findViewById(R.id.webView);
        webView.loadUrl("http://" + ip + "/");
        webView.getSettings().setLoadsImagesAutomatically(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());

        btnAc.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                OkHttpClient client = new OkHttpClient();
                Request request = new Request.Builder().url("http://" + ip + "/ac").build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {

                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful()) {

                        }
                    }
                });
                txtMesaj.setText("Açılıyor, Lütfen bekleyin.");
                webView.reload();
            }
        });

        btnKapat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                OkHttpClient client = new OkHttpClient();
                Request request = new Request.Builder().url("http://" + ip + "/kapat").build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {

                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful()) {

                        }
                    }
                });
                txtMesaj.setText("Kapatılıyor, Lütfen bekleyin.");
                webView.reload();
            }
        });
        btnSensor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                OkHttpClient client = new OkHttpClient();
                Request request = new Request.Builder().url("http://" + ip + "/LdrAcKapat").build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {

                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful()) {

                        }
                    }
                });
                txtMesaj.setText("İşlem yapılıyor, Lütfen bekleyin.");
                webView.reload();
            }
        });

        btnSes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                speak();
            }
        });
    }

    private void speak() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Aç/Kapat");

        try {
            startActivityForResult(intent, REQUEST_CODE_SPEECH_INPUT);
        } catch (Exception e) {
            Toast.makeText(this, "" + e.getMessage(), Toast.LENGTH_SHORT).show();
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {
            case REQUEST_CODE_SPEECH_INPUT: {
                if (resultCode == RESULT_OK && null != data) {
                    ArrayList<String> result = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    String command = result.get(0);
                    if (command.toLowerCase().contains("aç")) {
                        if (command.toLowerCase().contains("lamba")) {
                            btnAc.performClick();
                            txtMesaj.setText("Açılıyor, Lütfen Bekleyin");
                        } else if (command.toLowerCase().contains("sensör")) {
                            btnSensor.performClick();
                            txtMesaj.setText("Açılıyor, Lütfen Bekleyin");
                        } else {
                            txtMesaj.setText("Komutun içerisinde Lamba veya Sensör komutu olmalı");
                        }
                    } else if (command.toLowerCase().contains("kapat")) {
                        if (command.toLowerCase().contains("lamba")) {
                            btnKapat.performClick();
                            txtMesaj.setText("Kapatılıyor, Lütfen Bekleyin");
                        } else if (command.toLowerCase().contains("sensör")) {
                            btnSensor.performClick();
                            txtMesaj.setText("Kapatılıyor, Lütfen Bekleyin");
                        } else {
                            txtMesaj.setText("Komutun içerisinde Lamba veya Sensör komutu olmalı");
                        }
                    } else {
                        txtMesaj.setText("Komutun içerisinde Aç veya Kapat komutu olmalı");
                    }
                }
                break;
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {//eğer varsa bir önceki sayfaya gidecek
            webView.goBack();
        } else {//Sayfa yoksa uygulamadan çıkacak yada önceki activity'e dönecek
            super.onBackPressed();
        }
    }
}
