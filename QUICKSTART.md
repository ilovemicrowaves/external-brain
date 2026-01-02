# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
cd external-brain
npm install
```

### Step 2: Start the App (No Database Yet)

```bash
npm run dev
```

Open `http://localhost:3000` in your browser!

### Step 3: Test on Your Phone

1. Find your laptop's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

2. On your phone (same WiFi):
   - Open browser
   - Go to `http://YOUR-LAPTOP-IP:3000`
   - Tap menu → "Add to Home Screen"
   - Done! It's now an app.

### Step 4: Try the Spoons Tracker

1. Click the "Spoons" icon
2. Move the sliders to rate your energy
3. Hit "Log Spoons"
4. Check the Feed for achievements!

---

## What Works Right Now (Without Database)

✅ **Home Dashboard** - App launcher, quick actions
✅ **Spoons Tracker** - Full UI, all 5 spoon types
✅ **Feed** - TikTok-style scroll (mock data)
✅ **Progress** - Gamification UI (mock data)
✅ **PWA** - Install on phone, offline support
✅ **Bottom Nav** - Smooth navigation

## What Needs Database (Coming Next)

⏳ **Data Persistence** - Currently logs to console only
⏳ **Real Feed** - Generate from actual data
⏳ **Gamification** - Real XP, streaks, achievements
⏳ **History** - View past entries
⏳ **Insights** - Correlation detection

---

## Next Steps

### Option A: Keep Testing (No DB)

Just play with the UI, get familiar with it. Everything works except data saving.

### Option B: Add Database

```bash
# Start PostgreSQL
docker-compose up -d db

# Copy environment file
cp .env.example .env

# TODO: Run migrations (we'll add this next)
# npm run db:migrate

# Restart app
npm run dev
```

### Option C: Add More Apps

Create a new app in `src/apps/`:

```typescript
// src/apps/myapp/index.ts
export default {
  id: 'myapp',
  name: 'My App',
  icon: '🎯',
  route: '/myapp',
  color: '#9B59B6'
};
```

It'll auto-appear on the home screen!

---

## Troubleshooting

### "Cannot find module '@sveltejs/kit'"

```bash
npm install
```

### "Port 3000 already in use"

```bash
# Change port in vite.config.ts
port: 3001
```

### "Can't access from phone"

1. Make sure both devices are on same WiFi
2. Check firewall allows port 3000
3. Use `--host` flag (already in `package.json`)

### "Service worker not registering"

Only works on `localhost` or HTTPS. Use your laptop's IP instead of `127.0.0.1`.

---

## What to Build Next?

1. **Database Integration** - Make data persist
2. **Feed Generator** - Auto-create achievement cards
3. **Supplements Tracker** - Second app
4. **Habits Tracker** - Third app
5. **Grafana Dashboards** - TV display
6. **Home Assistant** - Automations

---

**Ready to code? Check `README.md` for architecture details!**
