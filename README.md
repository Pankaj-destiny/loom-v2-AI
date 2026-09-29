# Loom V2 — Multi-Language AI Chat + News Fact-Check Agent + Image Tool

Ye V1 ka upgraded version hai. Isme hai:
- 🗨️ Multi-language chat (Hindi, Hinglish, Marathi, English) — fast streaming replies
- 🔍 **News Fact-Check Agent** — real sources check karke authentic verdict deta hai (galat info kabhi confirm nahi karta)
- 🖼️ Basic image editor (text overlay, filters — Canva-type)
- 💳 Credits/token system (SQLite database)
- 📊 Admin dashboard (usage stats)
- 💰 Subscription pricing page (Stripe-ready, aapki apni key se activate hoga)
- 🔗 Referral system
- 📱 PWA — mobile browser se "Add to Home Screen" karke app jaisa install hota hai

## ⚠️ Important — pehle ye samjho

1. **Native Android APK / iPhone App Store app nahi hai.** Ye ek **PWA** (Progressive Web App) hai — matlab website hai jo mobile par app jaisa dikhti/chalti hai (home screen icon, full-screen). Real APK/IPA banane ke liye alag tools (Android Studio / Xcode) aur developer accounts chahiye jo separate process hai.
2. **Fact-check agent ko live web search ke liye TAVILY_API_KEY chahiye.** Bina us key ke, agent kabhi bhi kisi claim ko "confirmed true" nahi bolega — hamesha "UNVERIFIED" bolega, kyunki wo bina real source ke kuch bhi guess nahi karta. Ye intentional hai (safety ke liye).
3. **Payment/subscription real money tab lega jab aap apni Stripe key add karoge.** Bina key ke, upgrade button sirf ek message dikhayega.

## Kya chahiye (Prerequisites)

1. **Node.js** version 18+ — [nodejs.org](https://nodejs.org)
2. **OpenRouter API key** — [console.anthropic.com/settings/keys](https://openrouter.ai/keys)
3. *(Optional, fact-check ke liye)* **Tavily API key** (free tier) — [tavily.com](https://tavily.com)
4. *(Optional, payments ke liye)* **Stripe account** — [dashboard.stripe.com](https://dashboard.stripe.com)

## Step-by-Step: Local par install aur run karna

### Step 1 — Node.js install karo
```
node -v
```
Version 18 ya usse zyada dikhna chahiye.

### Step 2 — Zip extract karo aur folder mein jao
```
cd path/to/loom-v2
```

### Step 3 — Dependencies install karo
```
npm install
```
Isme `better-sqlite3` bhi install hoga (database ke liye) — thoda time lagega.

### Step 4 — `.env` file banao
```
cp .env.example .env
```
(Windows par: `copy .env.example .env`)

`.env` file kholo aur fill karo:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
ADMIN_KEY=apna-koi-bhi-secret-password
TAVILY_API_KEY=tvly-xxxxxxxxxxxxx        (optional — fact-check ke liye)
```

### Step 5 — Server start karo
```
npm start
```
Ye dikhega:
```
Loom V2 running at http://localhost:3000
Admin dashboard: http://localhost:3000/admin.html?key=your-admin-key
```

### Step 6 — Browser mein kholo
**http://localhost:3000**

Mobile par "app jaisa" install karne ke liye: Chrome/Safari mein site kholo → menu → **"Add to Home Screen"**.

## Project Structure

```
loom-v2/
├── public/
│   ├── index.html         → Main chat + tools UI
│   ├── pricing.html         → Subscription plans page
│   ├── admin.html            → Usage dashboard
│   ├── style.css               → Styling
│   ├── app.js                    → Frontend logic (streaming chat, fact-check, image editor)
│   ├── manifest.json               → PWA config
│   ├── sw.js                         → Service worker (offline shell + installability)
│   └── icons/                          → App icons
├── routes/
│   ├── chat.js             → Streaming chat agent (multi-language)
│   ├── factcheck.js         → News fact-check agent (source-verified)
│   └── admin.js               → Admin stats + Stripe checkout + referrals
├── db.js                        → SQLite: users, credits, usage logs, fact-check history
├── server.js                      → Main Express server
├── package.json
├── .env.example
└── README.md
```

## Fact-Check Agent kaise kaam karta hai

1. User ek claim/headline paste karta hai
2. Agent Tavily search API se live web results laata hai (agar key set hai)
3. Un results ko Claude ko diya jaata hai ek strict instruction ke saath: **"sirf wahi bolo jo sources confirm karte hain, kuch bhi guess mat karo"**
4. Output mein verdict milta hai: **TRUE / FALSE / PARTIALLY TRUE / UNVERIFIED** + saare sources ke links
5. Agar koi search key configured nahi hai, agent hamesha UNVERIFIED bolega — kabhi galat confidence nahi dikhayega

## Credits System

- Har naya visitor 50 free credits ke saath start hota hai (anonymous cookie-based, koi login nahi is version mein)
- 1 chat message = 1 credit
- 1 fact-check = 3 credits
- Credits khatam hone par "upgrade karo" message milta hai (Pricing page)

## Admin Dashboard dekhna

```
http://localhost:3000/admin.html?key=YOUR_ADMIN_KEY
```
(`.env` mein jo `ADMIN_KEY` set kiya hai wahi yahan use karo)

Yahan dikhega: total users, total requests, credits spent, aur recent fact-checks with verdicts.

## Subscriptions/Payments activate karna

1. [dashboard.stripe.com](https://dashboard.stripe.com) par account banao
2. Ek Product + recurring Price banao (jaise ₹499/month)
3. `.env` mein daalo:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_PRICE_ID=price_xxxxx
   ```
4. Server restart karo — ab Pricing page ka "Upgrade" button real Stripe checkout kholega

## GitHub par push karna

```
cd loom-v2
git init
git add .
git commit -m "Loom V2 initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/loom-v2.git
git push -u origin main
```
(`.env` aur `*.db` files `.gitignore` mein already excluded hain — apni keys kabhi GitHub par push mat karna)

## Live Server par Deploy karna (taaki mobile/anywhere se chale)

Kisi bhi Node.js hosting par deploy ho sakta hai:
- **Render.com** — free tier available, GitHub se directly connect ho jaata hai
- **Railway.app** — easy Node.js deploy
- Apna VPS (DigitalOcean, AWS EC2, etc.)

Deploy steps (Render ka example):
1. GitHub par code push karo (upar wala step)
2. Render.com par "New Web Service" banao, apna GitHub repo select karo
3. Build command: `npm install` | Start command: `npm start`
4. Environment Variables section mein `.env` ki saari keys add karo
5. Deploy — kuch minutes mein live URL milega jo mobile/desktop kahin se bhi khulega

⚠️ Note: `better-sqlite3` file-based database use karta hai — free hosting tiers par restart hone par data reset ho sakta hai. Production ke liye Postgres jaisa hosted database better hoga (bade scale ke liye alag se bata sakta hoon).

## Common Problems

| Problem | Solution |
|---|---|
| `npm install` fail ho raha (better-sqlite3) | Build tools chahiye — Windows par "windows-build-tools" ya Node 18+ ka prebuilt binary try karo |
| Fact-check hamesha "UNVERIFIED" deta hai | `.env` mein `TAVILY_API_KEY` missing hai — add karo |
| "Payments are not configured" | Stripe keys `.env` mein nahi daali — upar wala section dekho |
| Admin dashboard "Invalid admin key" | URL mein `?key=` wahi hona chahiye jo `.env` ke `ADMIN_KEY` mein hai |
| Credits khatam ho gaye | Naya browser/incognito try karo (naya cookie = naya user, 50 credits), ya Pricing page se upgrade karo |

---

Made with Node.js + Express + SQLite + OpenRouter API.
