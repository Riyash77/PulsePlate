# 🚌 PULSE PLATE — Smart Vehicle Identification System
## KPRIET College, Coimbatore

---

## Quick Start (One-Click)

Simply double-click **`START-SBAMS.bat`** in the root directory!
It will automatically launch:
- 🚀 **Backend API** (port 5000)
- 🖥️ **Admin Portal** (port 3001)
- 📱 **Student Portal** (port 3002)
- 🌐 **ngrok Cloud Tunnel** (if configured)
- 🌐 Automatically opens the portals in your default browser.

To stop all services cleanly, double-click **`STOP-SBAMS.bat`**.

---

## Manual Start

### 1. Prerequisites
- Node.js v18+
- PostgreSQL 14+ (running on localhost:5432)
- Python 3.8+ (for AI simulator)

### 2. Setup Database
```powershell
cd backend
npm run setup-db
```

### 3. Start Backend
```powershell
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 4. Start Admin Portal (UI 1)
```powershell
cd admin-portal
npm run dev
# Runs on http://localhost:3001
```

### 5. Start Student Portal (UI 2)
```powershell
cd student-portal
npm run dev
# Runs on http://localhost:3002
```

### 6. Run AI Demo Simulator
```powershell
cd ai-module
python demo_simulator.py
```

---

## Demo Credentials

| Role    | Email                       | Password   |
|---------|-----------------------------|------------|
| AO      | riyashmoorthy@gmail.com     | AO@KPRIET  |
| Admin 1 | 23ec094@kpriet.ac.in        | 23EC094    |
| Admin 2 | 23ec115@kpriet.ac.in        | 23EC115    |
| Admin 3 | 23ecl03@kpriet.ac.in        | 23ECL03    |
| Driver  | driver1@kpriet.ac.in        | Driver1    |
| Student | student1@kpriet.ac.in       | Student1   |

---

## System Architecture

```
Edge Device (Camera) ──► Backend API (Node.js) ──► PostgreSQL
                                │
                    ┌───────────┴────────────┐
                    │                        │
              Admin Portal            Student Portal
           (localhost:3001)         (localhost:3002)
              AO / Admin                Students
               / Driver
```

## Features

### UI 1 – Admin Portal
- 🔐 Role-based login (AO, Admin, Driver)
- 📊 Live dashboard with bus/driver statistics
- ⏰ Bus timing panel (🟢 On Time / 🔴 Late) — window: 08:00–08:45
- 🏆 Daily bus ranking by punctuality score
- 🚌 Bus details with route & stops
- 👤 Driver details with presence status
- 📋 Gate pass request/approval workflow (AO only)
- 🗺️ Route change request/approval (AO only)
- 📝 Attendance logs with ANPR confidence scores
- 🔍 AI safety logs (face match, drowsiness, seatbelt)
- ⚡ Real-time updates via WebSocket

### UI 2 – Student Portal (PWA)
- 📱 Mobile-first design with bottom navigation
- 🚌 My bus status (Green = inside, Red = left campus)
- ⏱️ ETA prediction for each stop when bus exits
- 🗺️ Complete route with all stops
- 🔔 Real-time notifications on bus events
- 📋 Notification history
- ⚙️ Bus & stop selection in profile

### AI Module (Demo Simulator)
- 🔢 ANPR (number plate recognition)
- 👤 Face verification (driver identity check)
- 😴 Drowsiness detection
- 🪑 Seatbelt detection
- 4 simulation scenarios (Morning, Evening, Continuous, Single)

---

## Folder Structure
```
SBAMS/
├── backend/           # Node.js + Express API (port 5000)
├── admin-portal/      # React Admin UI (port 3001)
├── student-portal/    # React Student PWA (port 3002)
├── ai-module/         # Python AI simulator
└── database/          # schema.sql + seed.sql
```

## Tech Stack
- **Backend**: Node.js, Express, Socket.IO, JWT, bcrypt
- **Database**: PostgreSQL
- **Admin UI**: React (Vite), React Router, Axios
- **Student UI**: React (Vite, PWA), Socket.IO client
- **AI Simulator**: Python, requests
- **Styling**: Custom CSS (glassmorphic dark theme)
