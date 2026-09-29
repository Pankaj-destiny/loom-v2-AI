# Render.com par FREE Deploy karna — Step by Step

Ye guide `loom-v2` project (OpenRouter API wala) ko Render.com ke **free tier** par live karne ke liye hai.

## ⚠️ Free tier ki limitations (jaan lo pehle)
- Free web service **15 min inactivity ke baad "sleep" ho jaata hai** — agla request aane par 30-60 second start hone mein lagta hai (phir normal speed)
- Ye sirf **server hosting free hai** — OpenRouter API calls ka apna alag (chhota sa) per-use cost hota hai, jo aapki Anthropic account billing se katega
- SQLite database file restart/redeploy hone par **reset ho sakti hai** (free tier mein persistent disk nahi milti) — credits/history production ke liye isliye ideal nahi, testing ke liye theek hai

## Step 1 — GitHub par code push karo
Agar pehle se nahi kiya:
```
cd loom-v2
git init
git add .
git commit -m "Loom V2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/loom-v2.git
git push -u origin main
```

## Step 2 — Render account banao
[render.com](https://render.com) par jao → GitHub se sign up karo (free)

## Step 3 — Naya Web Service banao
1. Dashboard mein **"New +" → "Web Service"** click karo
2. Apna GitHub repo (`loom-v2`) select karo → **Connect**
3. Settings:
   - **Name:** loom-v2 (ya kuch bhi)
   - **Region:** jo sabse paas ho (Singapore India ke liye best)
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free**

## Step 4 — Environment Variables add karo
"Environment" section mein ye sab add karo (jo `.env` mein the):
| Key | Value |
|---|---|
| `OPENROUTER_API_KEY` | apni actual key |
| `MODEL` | openrouter/free |
| `ADMIN_KEY` | apna koi bhi secret password |
| `TAVILY_API_KEY` | (optional, fact-check ke liye) |
| `STRIPE_SECRET_KEY` | (optional, payments ke liye) |
| `STRIPE_PRICE_ID` | (optional) |

## Step 5 — Deploy karo
**"Create Web Service"** click karo. 2-5 minute mein build hoga aur ek live URL milega, jaisa:
```
https://loom-v2-xxxx.onrender.com
```

## Step 6 — Test karo
Us URL ko browser mein kholo — aapki poori website live hai! Mobile browser se bhi khul jayegi, aur "Add to Home Screen" se app-jaisa install ho jayegi.

## Auto-redeploy
Ab jab bhi aap GitHub par naya code push karoge, Render automatically redeploy kar dega.

## Free tier se upgrade (agar zaroorat pade)
Agar app "sleep" hona problem lage ya database permanently save karni ho, Render ka **Starter plan ($7/month)** persistent disk aur no-sleep deta hai — lekin free tier testing ke liye kaafi hai.
