

# 💈 Barber Shop Backend (Express + PostgreSQL)

This is the backend for a full-stack **Barber Shop Appointment Management System**.  
It provides RESTful APIs for authentication, appointment booking, and admin management.



## 🏗️ Tech Stack

- Node.js
- Express.js
- PostgreSQL (via `pg`)
- dotenv
- cors
- morgan



## 🚀 Getting Started

## 1️⃣ Install dependencies
```
cd final-barber-server
npm install
```
## 2️⃣ Create PostgreSQL database
```
Create a database.
```
## 3️⃣ Run database schema
```
psql -d barber_db -f schema.sql
```

## 4️⃣ Configure environment variables

Create a `.env` file:

```env
Port=5000
DATABASE_URL=postgresql://user:password@localhost:5432/barber_db
```

## 5️⃣ Start the server

node server.js

The API will run on:
```text
http://localhost:5000
```

## 🗂️ Project Structure
```

final-barber-server/
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User booking & appointment routes
│   └── adminRoutes.js       # Admin management routes
├── middleware/
│   └── adminAuth.js         # Role-based admin authorization
├── schema.sql               # Database schema
├── db.js                    # PostgreSQL connection
├── server.js                # App entry point
└── .env                     # Environment variables (not committed)


```
## 📡 API Endpoints

**Base URL**

```text
http://localhost:5000/api
```

---

## 🔐 Auth Routes

**Base URL:** `/api/auth`

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| POST   | `/signup` | Register new user    |
| POST   | `/login`  | Log in existing user |

### 🔸 POST `/api/auth/signup`

Registers a new user.

```json
{
  "full_name": "John Doe",
  "email": "admin@example.com",
  "password": "123456"
}
```

### 🔸 POST `/api/auth/login`

Logs in an existing user.

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

---

## 👤 User Routes

**Base URL:** `/api/users`

### 📌 Public Data

| Method | Endpoint | Description |
|------|----------|------------|
| GET | `/services` | Get all services |
| GET | `/barbers` | Get all barbers |

### 👥 Users

| Method | Endpoint | Description |
|------|----------|------------|
| GET | `/` | Get all users |
| GET | `/:id` | Get user by ID |

### 📅 Appointments (User)

| Method | Endpoint | Description |
|------|----------|------------|
| GET | `/:id/appointments` | Get appointments for a user |
| POST | `/:id/appointments` | Create a new appointment |
| PUT | `/:userId/appointments/:appointmentId/cancel` | Cancel appointment (status becomes `Cancelled`) |
| DELETE | `/:userId/appointments/:appointmentId/Delete` | Delete appointment permanently |

#### 🔸 POST `/api/users/:id/appointments`
```json
{
  "service_id": 1,
  "barber_id": 2,
  "appt_date": "2026-01-20",
  "appt_time": "15:00"
}
```

## 🛠️ Admin Routes

**Base URL:** `/api/admin`

### 🔐 Required Header

```json
{ "x-role": "admin" }
```

---

### 📊 Dashboard Stats (Admin)

| Method | Endpoint | Description |
|------|----------|------------|
| GET | `/dashboard/stats` | Get dashboard statistics |
---
### 📅 Appointment Management (Admin)

| Method | Endpoint | Description |
|------|----------|------------|
| GET    | `/appointments`              | View all appointments      |
| PUT    | `/appointments/:id/approve`  | Approve appointment        |
| PUT    | `/appointments/:id/reject`   | Reject appointment         |
| PUT    | `/appointments/:id/complete` | Mark appointment completed |
| DELETE | `/appointments/:id`          | Delete appointment         |

---

### ✂️ Services Management

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/services`     | Get all services |
| POST   | `/services`     | Add new service  |
| PUT    | `/services/:id` | Update service   |
| DELETE | `/services/:id` | Delete service   |

---

### 💇 Barbers Management

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/barbers`     | Get all barbers |
| POST   | `/barbers`     | Add new barber  |
| PUT    | `/barbers/:id` | Update barber   |
| DELETE | `/barbers/:id` | Delete barber   |

---

### 👥 Users Management

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/users`     | View all users |
| DELETE | `/users/:id` | Delete user    |

---

## 🔐 Authorization & Security

* Role-based authorization using request headers
* Admin-only routes protected by middleware
* Unauthorized access returns HTTP `403 Forbidden`
* Environment variables excluded from version control

---

## ✅ Key Features

* RESTful API design
* Role-based access control
* Appointment booking workflow
* Appointment cancel (**PUT**) vs appointment delete (**DELETE**)
* Admin management for appointments, services, barbers, and users
* PostgreSQL relational data persistence
* Clean and modular backend architecture

---



