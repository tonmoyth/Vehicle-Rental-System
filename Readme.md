# 🚗 Vehicle Rental System

**Live URL:** _Add your deployed URL here_

A complete backend system for managing users, vehicles, and rental bookings. Includes authentication, authorization, booking logic, and admin functionalities.

---

## ✨ Features

### 🔐 Authentication & User Management

- Register new user account
- Login and receive JWT token
- Admin can update any user's role or details
- Customer can update their own profile only
- Delete user (only if no active bookings exist)

### 🚘 Vehicle Management

- Add new vehicle (name, type, registration, daily rent price, availability status)
- Update vehicle details, daily rent price or status
- Delete vehicle (only if no active bookings exist)

### 📅 Booking System

- Create booking with start and end dates
  - Validates vehicle availability
  - Calculates total price (daily rent × duration)
  - Updates vehicle status to **"booked"**
- Admin: View all bookings
- Customer: View own bookings only
- Customer: Cancel booking (only before start date)
- Admin: Mark booking as **"returned"** (vehicle becomes available)
- System: Auto-mark as **"returned"** when rental period ends

---

## 🛠️ Technology Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- TypeScript
- Vercel

---

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/tonmoyth/Vehicle-Rental-System.git
cd vehicle rental system
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
npm install
npm run dev
```
