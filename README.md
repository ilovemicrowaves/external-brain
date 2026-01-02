# 🧠 External Brain

> Your personal life management system - A neurodivergent-friendly dashboard for tracking energy, habits, and well-being.

## ✨ What is This?

**External Brain** is a self-hosted Progressive Web App (PWA) designed to externalize cognitive load. It's like social media, but for celebrating your own progress instead of doom-scrolling.

### Core Features

- **🥄 Spoon Drawer** - Track 5 types of energy (physical, focus, initiation, sensory, masking)
- **📊 Feed** - TikTok-style vertical scroll of your achievements, insights, and milestones
- **🏆 Gamification** - XP, levels, streaks, and achievements for staying consistent
- **📱 PWA** - Install on your phone like a native app, works offline
- **🔌 Modular** - Easy to add new tracking apps without breaking existing ones
- **🎯 Always-On Displays** - Built for tablets mounted around your home

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose (for database)
- Or: Just Node.js if using SQLite

### Installation

```bash
# Clone or navigate to the project
cd external-brain

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start database (PostgreSQL via Docker)
docker-compose up -d db

# Run database migrations (when implemented)
# npm run db:migrate

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`

### Access from Other Devices (Tablets, Phone)

```bash
# Start with --host flag (already in package.json)
npm run dev

# Find your laptop's local IP (e.g., 192.168.1.100)
# On tablets/phone, navigate to:
http://192.168.1.100:3000

# On Android: Tap menu → "Add to Home Screen"
# Now it's an app!
```

---

## 📱 PWA Installation

### On Android (Tab E, Phone)

1. Open Chrome/Firefox on your device
2. Navigate to `http://your-laptop-ip:3000`
3. Tap the menu (⋮) → **"Add to Home Screen"**
4. Tap the new icon on your home screen
5. Enjoy full-screen, app-like experience!

### Features You Get:

✅ **Offline support** - Works without internet
✅ **App icon** - Looks like a real app
✅ **Full screen** - No browser UI
✅ **Auto-updates** - Just refresh to get new features
✅ **Push notifications** (coming soon)

---

## 🏗️ Project Structure

```
external-brain/
├── src/
│   ├── apps/                    # Modular apps
│   │   └── spoons/              # Spoon tracking app
│   │       ├── index.ts         # App manifest
│   │       ├── components/      # App-specific components
│   │       └── db/              # App schema (future)
│   │
│   ├── lib/
│   │   ├── components/          # Shared UI components
│   │   │   ├── Card.svelte
│   │   │   ├── Button.svelte
│   │   │   └── AppIcon.svelte
│   │   ├── registry.ts          # Auto-discovers apps
│   │   └── types.ts             # TypeScript types
│   │
│   ├── routes/
│   │   ├── +layout.svelte       # Bottom nav layout
│   │   ├── +page.svelte         # Home dashboard
│   │   ├── feed/                # TikTok-style feed
│   │   ├── spoons/              # Spoons app routes
│   │   └── api/                 # API endpoints
│   │
│   ├── app.html                 # PWA manifest + SW
│   └── app.css                  # Global styles
│
├── static/
│   ├── manifest.json            # PWA manifest
│   ├── service-worker.js        # Offline support
│   └── icons/                   # App icons
│
├── docker-compose.yml           # PostgreSQL + Grafana
└── package.json
```

---

## 🔧 Adding a New App

Apps are **auto-discovered** by the registry system. Just drop in a folder!

### 1. Create App Folder

```
src/apps/myapp/
├── index.ts           # App manifest (required)
├── components/        # App components
└── db/                # App schema
```

### 2. Create Manifest

```typescript
// src/apps/myapp/index.ts
import type { App } from '$lib/types';

export default {
  id: 'myapp',
  name: 'My Cool App',
  icon: '🎯',
  route: '/myapp',
  color: '#9B59B6',
  category: 'other',
  description: 'What this app does',
} satisfies App;
```

### 3. Create Route

```svelte
<!-- src/routes/myapp/+page.svelte -->
<script lang="ts">
  // Your app logic
</script>

<h1>My Cool App</h1>
<p>It works!</p>
```

**That's it!** The app will automatically:
- Appear in the home screen app grid
- Be accessible via the bottom nav
- Register in the app registry

---

## 🎮 Gamification System

(Coming soon - foundation is in place)

### XP System

- **Log spoons** → +10 XP
- **Take supplements** → +10 XP
- **Complete habit** → +15 XP
- **7-day streak** → +100 XP

### Levels

- Level 1: 0-100 XP
- Level 2: 100-300 XP
- Level 3: 300-700 XP
- (XP doubles each level)

### Achievements

- "First Steps" - Log your first entry
- "Week Warrior" - Maintain 7-day streak
- "Data Collector" - 100 total logs
- "Pattern Finder" - Discover your first correlation

---

## 📊 Feed System

The **Feed** is where magic happens. It's an infinite-scroll, TikTok-style view of:

### Card Types

1. **🔥 Achievements** - Streaks, milestones
2. **💡 Insights** - Data correlations (e.g., "Your focus is higher on days you take L-theanine")
3. **📅 Throwbacks** - "3 months ago vs today"
4. **🎉 Milestones** - "100 logs tracked!"
5. **🎯 Challenges** - Gentle nudges (e.g., "You haven't logged today")

### How It Works

```typescript
// Automatically generates from your data
generateFeed() {
  - Check for new achievements
  - Find patterns in data
  - Generate throwbacks
  - Add gentle challenges
  - Shuffle with weighted randomness
}
```

**Pull to refresh** for new cards. Swipe vertically to browse.

---

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended)

```bash
# Start via Docker Compose
docker-compose up -d db

# Database will be at:
postgresql://brain:changeme@localhost:5432/external_brain
```

**Why PostgreSQL?**
- Multi-app support with schemas
- Grafana integration
- Better for long-term data growth

### Option 2: SQLite (Simpler)

```bash
# Just works, no Docker needed
# Database file: ./data/brain.db
```

**Why SQLite?**
- Zero setup
- Perfect for single-user
- Easier to backup (just copy the file)

---

## 📈 Grafana Dashboard (TV Display)

### Setup

1. Start Grafana:
   ```bash
   docker-compose up -d grafana
   ```

2. Open `http://localhost:3001`
   - Username: `admin`
   - Password: `changeme_in_production`

3. Add PostgreSQL data source:
   - Host: `db:5432`
   - Database: `external_brain`
   - User: `brain`

4. Create dashboard with:
   - Spoon levels (line graph, last 7 days)
   - Supplement compliance (percentage)
   - Habit streaks (stat panels)
   - Correlation charts

5. Set kiosk mode:
   - Settings → Preferences → Home Dashboard
   - URL: `http://localhost:3001/d/overview?kiosk`

### Display on TV

**Option A: Raspberry Pi**
```bash
# Install Chromium in kiosk mode
chromium-browser --kiosk --noerrdialogs --disable-infobars http://grafana:3001/d/overview?kiosk
```

**Option B: Fire TV Stick**
- Install Silk Browser
- Navigate to Grafana URL
- Pin to home screen

---

## 🏠 Tablet Kiosk Setup

### Tab E (After flashing to Android 7+)

1. **Install Fully Kiosk Browser** (€7, worth it)
   - Or free: "Kiosk Browser Lockdown"

2. **Configure**:
   ```
   Start URL: http://your-laptop-ip:3000
   Screensaver: Off (or dim after 5 min)
   Prevent screen lock: Yes
   Autostart on boot: Yes
   Hide navigation bar: Yes
   Battery charge limit: 80% (optional)
   ```

3. **Mount on wall** (3D print holder or buy cheap mount)

---

## 🔐 Security Notes

- **Local network only** by default
- No cloud dependencies
- All data stays on your laptop/server

### Optional: Remote Access

**Via Tailscale (recommended)**:
```bash
# Install Tailscale on laptop + phone
# Access from anywhere: http://100.x.x.x:3000
```

**Via Reverse Proxy** (advanced):
- Use Nginx Proxy Manager
- Add authentication
- Expose via HTTPS

---

## 🛠️ Development

### Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type-check
```

### Tech Stack

- **Frontend**: SvelteKit 2 + TypeScript
- **Styling**: Custom CSS (mobile-first)
- **Database**: PostgreSQL (or SQLite)
- **ORM**: Drizzle (coming soon)
- **Visualization**: Grafana
- **Deployment**: Docker Compose

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] SvelteKit project setup
- [x] PWA configuration
- [x] Modular app architecture
- [x] Bottom navigation
- [x] Home dashboard
- [x] Feed system (TikTok-style)
- [x] Spoons app (MVP)

### Phase 2: Core Features (Next)
- [ ] Database integration (Drizzle + PostgreSQL)
- [ ] Gamification system (XP, levels, achievements)
- [ ] Feed generation engine
- [ ] Correlation analyzer
- [ ] Supplements tracker
- [ ] Habits tracker

### Phase 3: Insights (Future)
- [ ] Pattern detection
- [ ] Grafana dashboards
- [ ] Home Assistant integration
- [ ] Calendar widget
- [ ] Food logger

### Phase 4: Polish (Later)
- [ ] Customizable themes
- [ ] Export data (CSV, JSON)
- [ ] Import from other apps
- [ ] Multi-user support (maybe?)

---

## 📝 Notes

### For Joel

- Your existing `Spoons/spoon-drawer` code has been migrated into the new architecture
- The 5 spoon types (physical, focus, initiation, sensory, **masking**) are preserved
- Baseline system is integrated
- Everything is now mobile-first and touch-optimized
- PWA works out of the box - just add to home screen!

### Differences from Old Version

| Old | New |
|-----|-----|
| Express + vanilla JS | SvelteKit + TypeScript |
| SQLite directly | Abstracted DB layer (easy to switch) |
| Single app | Modular architecture |
| Basic UI | Mobile-first, PWA, gamified |

---

## 🤝 Contributing

This is a personal project, but feel free to:
- Fork it for your own use
- Submit bugs/suggestions via issues
- Adapt it to your needs

---

## 📄 License

MIT - Use it however you want!

---

## 🎉 Credits

Built for managing neurodivergent life in 2025+

Inspired by:
- Spoon Theory
- Duolingo's streaks
- TikTok's addictive UX
- Grafana's data visualization
- The need for external brains

---

**Questions? Check the code - it's well-commented!**

**Issues? The logs will tell you what's wrong.**

**Want to help? Start by using it and telling me what sucks.**
