# 🏠 Synology NAS Deployment Guide

Deploy External Brain on your Synology NAS for 24/7 availability!

---

## 📋 Prerequisites

- Synology NAS with DSM 7.0+
- Container Manager (formerly Docker) installed
- SSH access enabled (optional, but recommended)
- At least 2GB RAM available
- ~500MB storage space

---

## 🚀 Method 1: Container Manager GUI (Easiest)

### Step 1: Prepare Files on NAS

**Option A: Via File Station**
1. Open **File Station**
2. Create folder: `/docker/external-brain`
3. Upload all project files to this folder

**Option B: Via Git (if you have Git Server package)**
1. SSH into NAS: `ssh admin@your-nas-ip`
2. Clone repo:
   ```bash
   cd /volume1/docker
   sudo git clone https://github.com/ilovemicrowaves/external-brain.git
   ```

### Step 2: Open Container Manager

1. Open **Container Manager** from DSM
2. Go to **Project** tab
3. Click **Create**

### Step 3: Create Project

1. **Project Name**: `external-brain`
2. **Path**: Select `/docker/external-brain`
3. **Source**: Choose `docker-compose.yml` from the folder
4. Click **Next**

### Step 4: Configure Services

The wizard will show all services:
- ✅ **app** (port 3000) - Main application
- ✅ **db** (internal) - PostgreSQL database
- ✅ **grafana** (port 3001) - Analytics dashboard
- ⚠️ **pgadmin** (port 5050) - Optional, can disable

**Web Portal Settings** (optional):
- Enable for `app` service on port 3000
- This creates a shortcut in DSM

Click **Done**

### Step 5: Build & Start

Container Manager will:
1. Pull required images
2. Build the app container (takes 2-5 minutes)
3. Start all services

**Monitor the build:**
- Go to **Container** tab
- Watch `external-brain-app` status
- Wait for "Running" status

---

## 🚀 Method 2: SSH + Docker Compose (Advanced)

### Step 1: SSH into NAS

```bash
ssh admin@your-nas-ip
```

### Step 2: Set Up Project

```bash
# Navigate to docker directory
cd /volume1/docker

# Clone your repo
sudo git clone https://github.com/ilovemicrowaves/external-brain.git
cd external-brain

# Set permissions
sudo chown -R $(whoami):users .
```

### Step 3: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit environment (optional)
nano .env
```

**Recommended changes in `.env`:**
```bash
DATABASE_URL=postgresql://brain:YOUR_SECURE_PASSWORD@db:5432/external_brain
```

### Step 4: Build & Deploy

```bash
# Build and start all services
sudo docker-compose up -d --build

# Check status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f app
```

**Expected output:**
```
[+] Running 4/4
 ✔ Network external-brain_brain-network  Created
 ✔ Container external-brain-db           Started
 ✔ Container external-brain-app          Started
 ✔ Container external-brain-grafana      Started
```

---

## 🌐 Access Your App

After deployment, access via:

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | `http://nas-ip:3000` | External Brain PWA |
| **Grafana** | `http://nas-ip:3001` | Analytics dashboard |
| **pgAdmin** | `http://nas-ip:5050` | Database admin (optional) |

**Replace `nas-ip` with your NAS IP address** (e.g., `192.168.1.100`)

### From Your Devices:

**Phone/Tablet:**
1. Open browser
2. Go to `http://your-nas-ip:3000`
3. Tap "Add to Home Screen"
4. Done! You have an app.

**Laptop/Desktop:**
- Just bookmark `http://your-nas-ip:3000`

---

## 🔒 Setting Up Reverse Proxy (Optional)

Make your app accessible via a friendly URL like `http://nas/brain`

### Step 1: DSM Login Portal

1. Open **DSM Control Panel**
2. Go to **Login Portal** > **Advanced** tab
3. Click **Reverse Proxy**

### Step 2: Create Reverse Proxy Rule

1. Click **Create**
2. Configure:
   ```
   Description: External Brain
   Source:
     Protocol: HTTP
     Hostname: nas (or your-nas-hostname)
     Port: 80

   Destination:
     Protocol: HTTP
     Hostname: localhost
     Port: 3000
   ```
3. Click **Save**

Now access via: `http://nas/` (no port needed!)

### Custom Path (Optional)

To use `http://nas/brain`:

1. In Reverse Proxy settings
2. Source path: `/brain`
3. Destination path: `/`
4. Enable **WebSocket**

---

## 🔐 Security Recommendations

### 1. Change Default Passwords

Edit `docker-compose.yml`:

```yaml
environment:
  POSTGRES_PASSWORD: your_strong_password_here  # Change this!
  GF_SECURITY_ADMIN_PASSWORD: grafana_password  # And this!
  PGADMIN_DEFAULT_PASSWORD: pgadmin_password    # And this!
```

Then restart:
```bash
sudo docker-compose down
sudo docker-compose up -d
```

### 2. Firewall Rules (If Exposing Externally)

**DSM Control Panel** > **Security** > **Firewall**

Create rule:
- Ports: 3000, 3001 (only if needed externally)
- Source IP: Your trusted IPs only
- Action: Allow

### 3. HTTPS with Let's Encrypt

**Via DSM:**
1. **Control Panel** > **Security** > **Certificate**
2. Add Let's Encrypt certificate
3. Assign to reverse proxy rules

**Or use Traefik** (advanced):
- Add Traefik service to docker-compose.yml
- Auto SSL certificate management

---

## 📊 Monitoring & Maintenance

### Check Container Status

**Via Container Manager GUI:**
- Go to **Container** tab
- Check status of all containers

**Via SSH:**
```bash
sudo docker-compose ps
```

### View Logs

**Via Container Manager:**
- Click on container name
- Go to **Logs** tab

**Via SSH:**
```bash
# All services
sudo docker-compose logs -f

# Specific service
sudo docker-compose logs -f app
```

### Restart Services

**Via Container Manager:**
- Select project → Click **Stop**
- Then click **Start**

**Via SSH:**
```bash
sudo docker-compose restart
```

### Update App

```bash
cd /volume1/docker/external-brain

# Pull latest code
sudo git pull

# Rebuild and restart
sudo docker-compose up -d --build
```

---

## 💾 Backup & Restore

### Backup Database

**Manual backup:**
```bash
# Export database
sudo docker exec external-brain-db pg_dump -U brain external_brain > backup.sql

# Copy to safe location
sudo cp backup.sql /volume1/Backups/external-brain/
```

**Automated backup (via DSM):**
1. Use **Hyper Backup** package
2. Add `/volume1/docker/external-brain/` to backup task
3. Schedule daily backups

### Restore Database

```bash
# Stop app
sudo docker-compose stop app

# Restore
sudo docker exec -i external-brain-db psql -U brain external_brain < backup.sql

# Restart
sudo docker-compose start app
```

---

## 🐛 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
sudo docker-compose logs app
```

**Common issues:**
- Port conflict (3000 already used)
- Insufficient memory
- Build failed

**Solutions:**
```bash
# Change port in docker-compose.yml
ports:
  - "3100:3000"  # Use different external port

# Check memory
free -h

# Rebuild from scratch
sudo docker-compose down -v
sudo docker-compose up -d --build
```

### Can't Access from Other Devices

**Checks:**
1. Firewall allows port 3000
2. Devices on same network
3. Container is actually running
4. NAS IP is correct

**Test:**
```bash
# From NAS itself
curl http://localhost:3000

# Check if port is open
sudo netstat -tulpn | grep 3000
```

### Database Connection Issues

**Check database status:**
```bash
sudo docker-compose exec db pg_isready -U brain
```

**Reset database:**
```bash
sudo docker-compose down
sudo docker volume rm external-brain_pgdata
sudo docker-compose up -d
```

### Out of Space

**Check disk usage:**
```bash
sudo docker system df
```

**Clean up:**
```bash
# Remove unused images
sudo docker image prune -a

# Remove unused volumes
sudo docker volume prune
```

---

## 🎯 Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

### Enable Caching

The app already has service worker caching, but you can add:

**Nginx reverse proxy caching** (advanced)

### Database Tuning

For better performance:

```bash
# Edit docker-compose.yml
services:
  db:
    environment:
      POSTGRES_SHARED_BUFFERS: 256MB
      POSTGRES_MAX_CONNECTIONS: 50
```

---

## 📱 Recommended Setup

### For Home Network Only:

```yaml
# Minimal setup - just app + db
docker-compose up -d app db
```

Access: `http://nas-ip:3000`

### For Multiple Users:

```yaml
# Full stack with Grafana
docker-compose up -d
```

Set up reverse proxy with SSL

### For Public Access (Advanced):

1. Enable DDNS on Synology
2. Port forward 443 → NAS
3. Use Let's Encrypt SSL
4. Add authentication middleware

---

## 🔄 Auto-Start on Boot

**Via Container Manager:**
- Services set to `restart: unless-stopped` already auto-start

**Verify:**
1. Reboot NAS
2. Wait 2 minutes
3. Check if containers are running

**Via Task Scheduler (backup method):**
1. **Control Panel** > **Task Scheduler**
2. Create → Triggered Task → Boot-up
3. Script:
   ```bash
   cd /volume1/docker/external-brain
   docker-compose up -d
   ```

---

## 📈 Next Steps After Deployment

1. ✅ **Test PWA install** on phone
2. ✅ **Log some data** in Spoons
3. ✅ **Set up Grafana** dashboards
4. ⏭️ **Add database integration** (when ready)
5. ⏭️ **Mount tablets** around your home
6. ⏭️ **Connect Home Assistant** (optional)

---

## 🆘 Need Help?

**Check logs first:**
```bash
sudo docker-compose logs --tail=100 app
```

**Common commands:**
```bash
# Status
sudo docker-compose ps

# Restart
sudo docker-compose restart

# Stop
sudo docker-compose stop

# Start
sudo docker-compose start

# Rebuild
sudo docker-compose up -d --build

# Nuclear option (fresh start)
sudo docker-compose down -v
sudo docker-compose up -d --build
```

---

## 🎉 You're Done!

Your External Brain is now:
- ✅ Running 24/7 on your NAS
- ✅ Accessible from all devices
- ✅ Auto-starting on boot
- ✅ Backed up regularly
- ✅ Ready to track your life!

**Access it now:** `http://your-nas-ip:3000`

Happy tracking! 🧠✨
