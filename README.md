# Shaurya Food Counter 2026

A full-stack mobile-first web application for managing food distribution at the **Shaurya Sports Meet 2026**. Volunteers use it to scan student QR codes and verify meal eligibility in real time.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure volunteer login
- 📷 **QR Code Scanner** — Real-time camera-based student verification (Breakfast / Lunch / Dinner)
- 📊 **Live Dashboard** — Stats for total scans, successful & failed meals served
- 📜 **Scan History** — Searchable & filterable log of all scan events
- 👤 **Profile Page** — Volunteer info and logout
- 🛡️ **Duplicate Prevention** — Prevents the same student from scanning twice for the same meal on the same day

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| **Frontend** | React 19, React Router v7, Vite 6, Tailwind CSS v4 |
| **Backend**  | Node.js, Express 5, MongoDB (Mongoose 9) |
| **Auth**     | JWT (jsonwebtoken), bcryptjs |
| **Scanner**  | html5-qrcode |
| **Security** | Helmet, express-rate-limit, CORS |

---

## 📁 Project Structure

```
Shaurya-Food-counter-2026/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login logic
│   │   └── scanController.js     # Scan verify / history / stats
│   ├── middleware/authMiddleware.js  # JWT protection
│   ├── models/
│   │   ├── User.js               # Volunteer schema
│   │   └── Scan.js               # Scan record schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── scanRoutes.js
│   ├── seed.js                   # Creates a test volunteer user
│   └── server.js                 # Express entry point
│
└── frontend/
    ├── public/                   # Static assets (logo, images)
    ├── src/
    │   ├── api/client.js         # Centralised API fetch wrapper
    │   ├── components/
    │   │   ├── Layout.jsx        # TopAppBar + BottomNavBar shell
    │   │   ├── TopAppBar.jsx
    │   │   └── BottomNavBar.jsx
    │   ├── pages/
    │   │   ├── SplashPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ScannerPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── App.jsx               # Routes + ProtectedRoute guard
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Tailwind v4 + design tokens
    ├── index.html
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- A **MongoDB** database (MongoDB Atlas free tier works)

---

### Backend Setup

```bash
cd backend
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/food_counter
JWT_SECRET=your_super_secret_key_here
```

Seed the database with a test volunteer account:
```bash
node seed.js
# Login: volunteer@campuseats.com / password123
```

Start the backend:
```bash
npm run dev     # Development (auto-restarts with nodemon)
npm start       # Production
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server at http://localhost:5173
```

The frontend connects to the backend via `VITE_API_URL` in `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `POST` | `/api/scan/verify` | 🔒 | Verify a QR code scan |
| `GET`  | `/api/scan/history` | 🔒 | Fetch all scan records |
| `GET`  | `/api/scan/stats` | 🔒 | Get today's stats |

---

## ⚙️ Production Deployment

1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Serve `frontend/dist/` via your Express backend (add `express.static` to `server.js`) or deploy separately to Vercel/Netlify.
3. Deploy `backend/` to Railway, Render, or your VPS.
4. Set `VITE_API_URL` to your production backend URL before building.

---

## 🔒 Security Notice

- `.env` files are **excluded from version control** via `.gitignore`. Never commit secrets.
- JWT tokens expire after 30 days.
- Rate limiting is applied: 200 requests per IP per 15 minutes.
