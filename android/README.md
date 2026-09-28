# RunFam Android Native Application

This directory contains the production-ready Android native wrapper for **RunFam** (`com.runfam.app`), powered by Capacitor.

---

## Architecture Overview

```
                      RunFam Unified Core
                 (React 19 + TypeScript + Tailwind)
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
     RunFam Web App                       RunFam Android App
  (Vite / Responsive SPA)             (Capacitor + Android 14)
            |                                     |
            +------------------+------------------+
                               |
               Unified Business Logic & Database
             (Auth, GPS, Clubs, Leaderboards, City)
```

Both Web and Android share:
- The exact same user accounts and authentication sessions.
- The exact same Run Clubs, city leaderboards, and activity feeds.
- The same GPS calculation engine with haversine distance filtering and noise reduction.

---

## Android App Identity

- **Application ID / Package**: `com.runfam.app`
- **App Name**: `RunFam`
- **Tagline**: *Your Run. Your Crew. Your City.*
- **Min SDK**: Android 6.0 (API 23)
- **Target SDK**: Android 14 (API 34)

---

## Configured Android Permissions

Declared in `AndroidManifest.xml` with runtime permission handling:
- `ACCESS_FINE_LOCATION`: High-precision GPS tracking during active runs.
- `ACCESS_COARSE_LOCATION`: Approximate location for club discovery and city verification.
- `ACCESS_BACKGROUND_LOCATION`: Continuous tracking when runner locks phone or switches apps.
- `FOREGROUND_SERVICE` & `FOREGROUND_SERVICE_LOCATION`: Android 14 compliant foreground run tracking service.
- `POST_NOTIFICATIONS`: Real-time tracking notifications showing distance and pace on lock screen.
- `WAKE_LOCK`: Keeps device active during timed run sessions.

---

## Building the Android APK

### Prerequisites
- Node.js 18+
- Java Development Kit (JDK 17 or higher)
- Android SDK (installed via Android Studio or command-line tools)

### 1. Build Web Assets
```bash
npm run build
```

### 2. Sync with Android Project
```bash
npx cap sync android
```

### 3. Build Debug APK
Using Gradle wrapper:
```bash
cd android
./gradlew assembleDebug
```
The generated APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Open in Android Studio
```bash
npx cap open android
```
From Android Studio, click **Run 'app'** or **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## Active Run Background Tracking

When a run is initiated in RunFam:
1. High-accuracy GPS begins watching device coordinates via native location providers.
2. The Screen Wake Lock API is engaged to prevent unintended sleep.
3. System notifications display live distance, duration, and pace.
4. Active run state is continuously backed up to local storage so runs are never lost if the app process is restarted.
5. Android hardware back button is protected by confirmation dialogs to prevent accidental cancellation.
