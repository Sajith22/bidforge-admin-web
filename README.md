
---

## 2. `bidforge-admin-web` (React Admin Dashboard) README

```markdown
# BidForge — Admin Dashboard (React)

A dark‑themed admin dashboard for managing products, auctions, and notifications in the BidForge auction platform. Built with React, TypeScript, and Tailwind CSS.

---

## 🚀 Live Demo

- **Admin Dashboard:** [https://bidforge-admin-web.vercel.app](https://bidforge-admin-web.vercel.app)
- **Backend API:** [https://bidforge-admin-api-production.up.railway.app](https://bidforge-admin-api-production.up.railway.app)

---

## 📸 Screenshots / Demo

| Dashboard | Add Product | Login |
|-----------|-------------|-------|
| ![Dashboard](screenshots/dashboard.png) | ![Add](screenshots/add-product.png) | ![Login](screenshots/login.png) |

*Add your own screenshots/GIF inside `screenshots/`.*

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture

This dashboard talks only to the **NestJS backend** — never directly to Firestore. Every write request carries a Firebase ID token verified server‑side.


React Admin Dashboard (this repo)
│
▼ HTTP (ID token)
NestJS Backend
│ firebase-admin SDK (trusted)
▼
Firebase Project


---

## Features

- **Secure login** — Firebase Auth, gated by custom `admin` claim
- **Product management** — create, edit, publish/unpublish, delete
- **Real‑time stats** — live, upcoming, ended counts
- **Dark theme** — matches BidForge’s signature navy/dark look
- **Responsive design** — works on desktop and tablet
- **Auto‑attached ID tokens** — Axios interceptor adds fresh tokens to every request

---

## Tech Stack

- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Firebase Auth** (client SDK, for login only)
- **Vercel** for hosting

---

## Project Structure
src/
├── main.tsx # Entry point
├── App.tsx # Routes
├── context/
│ └── AuthContext.tsx # Auth state
├── lib/
│ ├── api.ts # Axios instance
│ ├── firebase.ts # Firebase init
│ └── types.ts # TypeScript interfaces
├── pages/
│ ├── Dashboard.tsx # Product grid, stats
│ ├── Login.tsx # Admin login
│ └── AddProduct.tsx # Create product form
└── ...


---

## Setup

### Prerequisites

- Node.js >= 18
- Firebase project (same as customer app)
- Backend API running (local or Railway)

### 1. Clone & install

```bash
git clone https://github.com/Sajith22/bidforge-admin-web.git
cd bidforge-admin-web
npm install
```

### 2. Configure Firebase

Edit src/lib/firebase.ts with your Firebase web config (never commit real keys).

### 3. Set API URL

Create a .env file:

``bash
VITE_API_URL=http://localhost:3000
```

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:5173.

### Deployment 

Deployed on Vercel with the VITE_API_URL environment variable set to the production backend URL.
Vercel auto‑deploys on every push to main.

### CI/CD
Vercel connects to the GitHub repo and automatically builds and deploys on every push. No extra configuration required.

### Contributing
Use Tailwind CSS for styling.

Keep components small and reusable.

Use meaningful commit messages.

### License

MIT

### Contact
GitHub: @Sajith22

Built with React & NestJS — part of the BidForge project family.
