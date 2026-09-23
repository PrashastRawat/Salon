# Salon Service Booking Application

A full-stack salon booking app. Customers browse services and book an appointment; an admin logs in to manage the bookings.

- **Live demo (frontend):** https://salonwebpr.vercel.app/
- **Live API (backend):** https://salon-2w4s.onrender.com
- **Technical document:** [TECHNICAL.md](./TECHNICAL.md)

> The backend is on Render's free tier and may sleep when idle. The first request can take up to about a minute to respond; please wait and refresh.

## Admin demo credentials

| Field    | Value                        |
| -------- | ---------------------------- |
| URL      | `/admin/login`               |
| Email    | `admin@salon.com`    |
| Password | `Admin@123` |

## Features

**Customer:** landing page, services list (name, price, duration), booking form (name, phone, email, service, date, time, optional notes) with validation, confirmation page, and duplicate-slot prevention.

**Admin:** secure login, dashboard listing all bookings, booking details, status updates (Pending / Confirmed / Completed / Cancelled), and service management (add / edit / delete).

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (Mongoose)
- **Auth/Security:** bcryptjs, JWT in an httpOnly cookie, Helmet, CORS, express-rate-limit
- **Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project structure

```
Salon/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Navbar, Footer
│       ├── context/        # AuthContext
│       └── pages/          # Home, Services, Booking, Confirmation, admin/*
└── server/                 # Express API
    ├── config/db.js        # MongoDB connection
    ├── controllers/        # auth, service, booking logic
    ├── middleware/         # auth (protect), error handler
    ├── models/             # Admin, Service, Booking
    ├── routes/             # auth, services, bookings
    ├── utils/              # token generation
    ├── seedAdmin.js        # creates the first admin + sample services
    ├── app.js
    └── server.js
```

## Setup and run locally

**Requirements:** Node.js 18+ and a MongoDB database (a free MongoDB Atlas cluster works).

### 1. Clone

```bash
git clone https://github.com/PrashastRawat/Salon.git
cd Salon
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env      # then fill in the values below
```

`server/.env`:

| Variable     | Description                                        |
| ------------ | -------------------------------------------------- |
| `PORT`       | Port for the API, e.g. `5000`                      |
| `MONGO_URI`  | MongoDB connection string                          |
| `JWT_SECRET` | Long random string used to sign tokens             |
| `CLIENT_URL` | Frontend origin for CORS, e.g. `http://localhost:5173` |
| `NODE_ENV`   | `development` or `production`                      |

### 3. Database setup

No migrations are needed. Mongoose creates the collections and the booking index automatically when the server starts.

Create the admin account and sample services:

1. Open `server/seedAdmin.js` and set your own `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` at the top.
2. Run from the `server` folder:

```bash
node seedAdmin.js
```

The password is hashed with bcrypt before it is stored. Sample services are only added if the services collection is empty.

### 4. Start the backend

```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 5. Frontend

```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

`client/.env`:

| Variable       | Description                                     |
| -------------- | ----------------------------------------------- |
| `VITE_API_URL` | Backend URL, e.g. `http://localhost:5000`       |

Open http://localhost:5173.

## API documentation

Base URL: `http://localhost:5000` locally, or `https://salon-2w4s.onrender.com` live.

All responses are JSON with a `success` flag. Errors look like `{ "success": false, "error": "message" }`.

**Auth column:** "Admin" means a valid JWT is required (httpOnly cookie, or `Authorization: Bearer <token>`).

### Auth

| Method | Endpoint            | Auth  | Body                  | Description                              |
| ------ | ------------------- | ----- | --------------------- | ---------------------------------------- |
| POST   | `/api/auth/login`   | No    | `{ email, password }` | Log in; sets the token cookie            |
| POST   | `/api/auth/logout`  | No    | -                     | Clears the token cookie                  |
| GET    | `/api/auth/profile` | Admin | -                     | Returns the logged-in admin              |

### Services

| Method | Endpoint             | Auth  | Body                                     | Description               |
| ------ | -------------------- | ----- | ---------------------------------------- | ------------------------- |
| GET    | `/api/services`      | No    | -                                        | List active services      |
| GET    | `/api/services/:id`  | No    | -                                        | Get one service           |
| POST   | `/api/services`      | Admin | `{ name, description?, price, duration }` | Create a service         |
| PUT    | `/api/services/:id`  | Admin | fields to update                         | Update a service          |
| DELETE | `/api/services/:id`  | Admin | -                                        | Delete a service          |

`price` is in rupees; `duration` is in minutes.

### Bookings

| Method | Endpoint                     | Auth  | Body / Query                                          | Description                                  |
| ------ | ---------------------------- | ----- | ----------------------------------------------------- | -------------------------------------------- |
| POST   | `/api/bookings`              | No    | `{ name, phone, email, service, date, time, notes? }` | Create a booking                             |
| GET    | `/api/bookings/availability` | No    | `?date=YYYY-MM-DD&time=HH:mm`                         | Returns `{ available: true/false }`          |
| GET    | `/api/bookings`              | Admin | -                                                     | List all bookings (newest first)             |
| GET    | `/api/bookings/:id`          | Admin | -                                                     | Get one booking with service details         |
| PUT    | `/api/bookings/:id/status`   | Admin | `{ status }`                                          | Update status                                |

`status` is one of `Pending`, `Confirmed`, `Completed`, `Cancelled`.

**Common responses**

| Code | Meaning                                                         |
| ---- | --------------------------------------------------------------- |
| 201  | Booking or service created                                      |
| 400  | Missing or invalid fields                                       |
| 401  | Not logged in or invalid token                                  |
| 404  | Service or booking not found                                    |
| 409  | Slot already booked (`This slot is already booked, ...`)        |

**Example: create a booking**

```http
POST /api/bookings
Content-Type: application/json

{
  "name": "Asha Rawat",
  "phone": "9876543210",
  "email": "asha@example.com",
  "service": "<service _id>",
  "date": "2026-10-05",
  "time": "11:00",
  "notes": "First visit"
}
```

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- The JWT is stored in an httpOnly cookie, so client-side JavaScript cannot read it.
- Admin routes are protected by backend middleware, not just hidden in the UI.
- Secrets live in `.env`, which is git-ignored. Only `.env.example` files are committed.