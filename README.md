# 🏏 Shaurya Food Counter

Smart QR-based food distribution system for the Shaurya Sports Fest.

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 19 · Vite 6 · Tailwind CSS v4          |
| Backend   | Express 5 · Prisma 5 ORM                     |
| Database  | PostgreSQL (Docker)                           |
| Runtime   | Bun                                           |

## Quick Start

### 1. Database (Docker)
```bash
docker run -d --name shaurya-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=sh2026 \
  -e POSTGRES_DB=shaurya-db \
  -p 5432:5432 postgres:17-alpine
```

### 2. Backend
```bash
cd backend
cp .env.example .env    # Edit credentials
bun install
bunx prisma db push     # Create tables
bunx prisma generate    # Generate client
bun run dev             # Starts on :5000
```

### 3. Frontend
```bash
cd frontend
bun install
bun run dev             # Starts on :3000
```

## Project Structure

```
├── backend/
│   ├── server.js                 # Express entry point
│   ├── lib/prisma.js             # Shared Prisma client
│   ├── controllers/
│   │   ├── authController.js     # Volunteer login (JWT)
│   │   ├── scanController.js     # QR scan verify + history
│   │   └── dashboardController.js # Live stats API
│   ├── middleware/authMiddleware.js
│   ├── routes/
│   └── prisma/schema.prisma      # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── pages/                # Splash, Login, Dashboard, Scanner, History, Profile
│   │   ├── components/           # Layout, TopAppBar, BottomNavBar
│   │   └── api/client.js         # Fetch wrapper with auth
│   └── public/                   # Static assets (logo, profile pic)
│
└── .gitignore
```

## Database Architecture

4 tables with a unique constraint that **mathematically prevents duplicate meal scans**:

- `QrCard` → Physical pre-printed QR passes (SHR-001 to SHR-500)
- `Guest` → Registered students (name, college, contact)
- `FoodSlot` → Time windows (Day 1 Lunch: 12:30–2:30 PM)
- `FoodEntry` → Scan log with `@@unique([guestId, slotId])`

## Default Credentials

| Field    | Value                      |
|----------|----------------------------|
| Email    | volunteer@campuseats.com   |
| Password | password123                |
