const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'android');
const dirs = [
  'app/src/main/java/in/kaliapanjika/pro',
  'app/src/main/assets/public',
  'app/src/main/res/values',
  'app/src/main/res/mipmap-hdpi',
  'app/src/main/res/xml'
];

dirs.forEach(d => fs.mkdirSync(path.join(base, d), { recursive: true }));

// AndroidManifest.xml
const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="in.kaliapanjika.pro"
    android:versionCode="300"
    android:versionName="3.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@android:style/Theme.Black.NoTitleBar.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
fs.writeFileSync(path.join(base, 'app/src/main/AndroidManifest.xml'), manifest);

// MainActivity.java
const mainActivity = `package in.kaliapanjika.pro;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);

        webView.loadUrl("file:///android_asset/public/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;
fs.writeFileSync(path.join(base, 'app/src/main/java/in/kaliapanjika/pro/MainActivity.java'), mainActivity);

// strings.xml
const strings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">DivyaJyoti Kalia Panjika 2050</string>
</resources>`;
fs.writeFileSync(path.join(base, 'app/src/main/res/values/strings.xml'), strings);

// build.gradle (project level)
const rootGradle = `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`;
fs.writeFileSync(path.join(base, 'build.gradle'), rootGradle);

// build.gradle (app level)
const appGradle = `plugins {
    id 'com.android.application'
}
android {
    namespace 'in.kaliapanjika.pro'
    compileSdk 34
    defaultConfig {
        applicationId "in.kaliapanjika.pro"
        minSdk 24
        targetSdk 34
        versionCode 300
        versionName "3.0.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`;
fs.writeFileSync(path.join(base, 'app/build.gradle'), appGradle);

// Copy dist into assets/public
const distDir = path.join(__dirname, 'dist');
const assetsPublicDir = path.join(base, 'app/src/main/assets/public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyRecursive(distDir, assetsPublicDir);

console.log('Android project setup complete and bundled with latest production dist!');
