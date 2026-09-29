# Loom Mobile App — Real APK/iOS Build Guide

Ye guide aapko batayega ki `loom-v2` website ko real **installable Android APK** aur **iPhone app** mein kaise convert karein — **Capacitor** tool use karke (Ionic team ka open-source tool, industry-standard hai).

## Ye kaise kaam karta hai (samajhna zaroori hai)

Aapka phone app khud koi server ya database nahi chalata. Wo ek **native shell** hai jo aapki live website (jo aap already deploy kar chuke ho — Render/Railway) ko andar load karta hai, jaise ek app-jaisa dikhne wala browser. Isliye:

**Pehle aapko `loom-v2` backend ko internet par live/deploy karna hoga** (loom-v2 ke README mein "Live Server par Deploy karna" section follow karo — Render.com sabse aasan hai, free tier available).

Deploy hone ke baad aapko ek URL milega jaisa: `https://loom-abc123.onrender.com`

---

## Kya chahiye (Prerequisites)

### Android APK banane ke liye:
1. **Node.js** (18+) — [nodejs.org](https://nodejs.org)
2. **Android Studio** — [developer.android.com/studio](https://developer.android.com/studio) (free, ~1GB download)
3. Windows, Mac, ya Linux — koi bhi chalega

### iPhone app banane ke liye:
1. **Mac computer** (compulsory — Apple ka rule hai, Windows par iOS app nahi ban sakti)
2. **Xcode** (free, Mac App Store se)
3. Apple Developer account (App Store par publish karne ke liye $99/year — sirf testing ke liye free bhi chal jaata hai apne phone par)

---

## Step-by-Step: Android APK banana

### Step 1 — `mobile-app` folder mein jao
```
cd loom-v2/mobile-app
```

### Step 2 — Dependencies install karo
```
npm install
```

### Step 3 — Apna live URL set karo
`capacitor.config.json` file kholo aur ye line edit karo:
```json
"url": "https://REPLACE-WITH-YOUR-DEPLOYED-URL.onrender.com",
```
Apne actual deployed URL se replace karo.

### Step 4 — Android project generate karo
```
npx cap add android
npx cap sync
```
Ye ek `android/` folder banayega jisme poora native Android project hoga.

### Step 5 — Android Studio mein kholo
```
npx cap open android
```
(Ya manually Android Studio khol kar `mobile-app/android` folder open karo)

### Step 6 — APK build karo
Android Studio mein:
1. Top menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Kuch minute wait karo (pehli baar thoda time lagta hai)
3. Build complete hone par "locate" link click karo — aapki APK file milegi:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Step 7 — Phone par install karo
1. Ye `.apk` file apne Android phone par transfer karo (USB, email, Google Drive, WhatsApp — koi bhi tarika)
2. Phone par file kholo → "Install" par tap karo
3. Agar warning aaye "Unknown source" — Settings mein allow karo (ye normal hai, kyunki Play Store se nahi hai)

**Bas — ab aapki app phone par real icon ke saath install hai, bina Play Store ke!**

### Play Store par publish karna ho to:
- Ek "release" build banani hogi (signed APK/AAB) — Android Studio ka **Build → Generate Signed Bundle/APK** use karo
- [play.google.com/console](https://play.google.com/console) par $25 one-time developer fee dekar account banao
- App submit karo (review mein kuch din lagte hain)

---

## Step-by-Step: iPhone App banana (sirf Mac par)

### Step 1-3: Same as Android (npm install, URL set karo)

### Step 4 — iOS project generate karo
```
npx cap add ios
npx cap sync
```

### Step 5 — Xcode mein kholo
```
npx cap open ios
```

### Step 6 — Apne phone par test karo
1. iPhone ko Mac se USB se connect karo
2. Xcode mein top-left dropdown se apna iPhone select karo
3. Play button (▶) dabao — app seedha aapke phone par install ho jayegi (aapko phone par Settings → General → VPN & Device Management mein developer ko "trust" karna padega pehli baar)

### App Store par publish karna ho to:
- Apple Developer Program join karo ($99/year) — [developer.apple.com](https://developer.apple.com)
- Xcode se **Archive** banao aur **App Store Connect** par upload karo
- Apple review karega (1-3 din lagte hain), phir live ho jayegi

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npx cap add android` fail | Node.js version check karo (`node -v`, 18+ chahiye) |
| Android Studio build fail | Android Studio ke andar "SDK Manager" se latest SDK install karo (pehli baar prompt aata hai) |
| App mein "This site can't be reached" | `capacitor.config.json` ka URL galat hai, ya backend live nahi hai — pehle Render/Railway par deploy check karo |
| iOS build option missing | Ye sirf Mac par kaam karega, Windows/Linux par nahi |

---

## Alternative (agar Android Studio install nahi karna)

Agar aapko turant kuch chahiye bina Android Studio ke, to **PWA already isi zip mein hai** — website ko mobile browser mein kholo aur "Add to Home Screen" karo. Wo turant app-jaisa install ho jaata hai, koi build process nahi chahiye — sirf real `.apk` file nahi milegi.
