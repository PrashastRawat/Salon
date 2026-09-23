# Technical Document

## 1. Technology Stack

| Layer     | Choice                          | Why                                                                                  |
| --------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| Frontend  | React + Vite + Tailwind CSS     | Component-based UI, fast dev server, and utility classes make responsive design quick |
| Routing   | React Router                    | Client-side routing for the customer flow and admin pages                            |
| Backend   | Node.js + Express               | Small, familiar, and easy to structure into routes/controllers/middleware            |
| Database  | MongoDB + Mongoose              | Flexible documents suit bookings and services; Mongoose gives schemas and indexes    |
| Auth      | bcryptjs + JWT (httpOnly cookie) | Standard, stateless admin authentication without storing sessions on the server      |
| Security  | Helmet, CORS, express-rate-limit | Secure headers, restricted origin, and request throttling                            |
| Hosting   | Vercel, Render, MongoDB Atlas   | Free tiers that are simple to deploy                                                 |

## 2. Architecture

```
Browser (React SPA on Vercel)
        |  HTTPS + JSON (Axios, withCredentials)
        v
Express API (Render)
  routes -> middleware (auth) -> controllers -> Mongoose models
        |
        v
MongoDB Atlas
```

- The React app never touches the database. It only calls the REST API.
- **Routes** map URLs to controllers. **Controllers** hold business logic. **Middleware** handles authentication and errors. **Models** define the data and indexes.
- CORS only allows the configured `CLIENT_URL`, and cookies are sent with `withCredentials`.

## 3. Database Design

**Admin** - `name`, `email` (unique, lowercase), `password` (bcrypt hash), timestamps.

**Service** - `name`, `description`, `price`, `duration` (minutes), `isActive`, timestamps.

**Booking** - `name`, `phone`, `email`, `service` (ObjectId reference to Service), `date` (string, `YYYY-MM-DD`), `time` (string, `HH:mm`), `notes`, `status` (Pending / Confirmed / Completed / Cancelled, default Pending), timestamps.

**Relationship:** each Booking references one Service (many bookings to one service). The admin dashboard uses `populate` to load the service name, price and duration.

**Key index:** a unique partial index on `{ date, time }` that only applies while `status` is `Pending` or `Confirmed`. See Booking Logic below.

## 4. Authentication

1. The admin submits email and password to `POST /api/auth/login`.
2. The server looks up the admin and compares the password with `bcrypt.compare`. The same "Invalid credentials" message is returned for a wrong email or a wrong password, so it does not reveal which one failed.
3. On success the server signs a JWT (7-day expiry) containing the admin id and sets it in an **httpOnly, secure, sameSite=none** cookie, because the frontend and backend are on different domains.
4. Protected routes use the `protect` middleware. It reads the token from the cookie (or a Bearer header), verifies it with `JWT_SECRET`, loads the admin from the database, and returns `401` if anything fails.
5. Logout clears the cookie.

Protected endpoints: `GET /api/bookings`, `GET /api/bookings/:id`, `PUT /api/bookings/:id/status`, `POST/PUT/DELETE /api/services`, `GET /api/auth/profile`. Protection is enforced on the server, so hiding a link in the UI is not what secures it.

There is no public registration route. The first admin is created with `seedAdmin.js`.

## 5. Booking Logic

- The customer submits the form. The frontend validates it first, then calls `POST /api/bookings`.
- The server checks the required fields and that the chosen service exists.
- **Duplicate prevention is enforced by the database, not by a check-then-insert in code.** The unique partial index on `{ date, time }` (active bookings only) means that if two people submit the same slot at the same moment, exactly one insert succeeds. The other raises a duplicate-key error (code 11000), which the controller turns into a `409` with a clear message.
- Because the index only covers `Pending` and `Confirmed` bookings, cancelling or completing a booking frees that slot for someone else.
- `GET /api/bookings/availability` lets the client check a slot without creating anything.

**Current scope:** a slot is a single date and time for the whole salon (one booking at a time), and service duration is not used to block neighbouring times.

## 6. Technical Decisions

- **Unique index instead of a manual check.** A "find then create" check has a race condition. The index makes the database the single source of truth.
- **httpOnly cookie instead of localStorage.** JavaScript cannot read the token, which reduces the impact of XSS.
- **Date and time stored as strings.** They are simple to compare, index and display, and avoid timezone shifts for a salon that works in one local time.
- **Routes / controllers / middleware structure.** Keeps each file small and lets someone new find things quickly.
- **No admin registration endpoint.** An open register route would let anyone become an admin, so the admin is seeded instead.
- **Small feature set.** I focused on the required flow being correct rather than adding extra features.
- **Server-side validation in its own module.** `validateBooking.js` checks and cleans booking input (required fields, formats, lengths, no past dates) before it reaches the database. The frontend validates for user experience, but the server can't trust it because the API can be called directly.

## 7. Challenges

- **Preventing double bookings under concurrency.** Solved with the unique partial index and handling error 11000.
- **Cross-domain authentication.** The frontend (Vercel) and backend (Render) are on different domains, so the cookie needs `secure` and `sameSite: none`, CORS needs `credentials: true` with an exact origin, and `trust proxy` is set behind Render's proxy.
- **Freeing slots after cancellation.** A plain unique index would block rebooking a cancelled slot, so the index is partial and only applies to active statuses.
- **Connecting to MongoDB Atlas.** DNS resolution for the connection string needed explicit DNS servers in `config/db.js`.

## 8. Future Improvements

- Fixed time slots and business hours (currently any time can be requested).
- Duration-aware conflicts, and per-staff availability so multiple bookings can run in parallel.
- Email or SMS confirmation and reminders.
- Route guards on the admin pages, and refresh-safe login using `/api/auth/profile`.
- Tighter login rate limit, account lockout, and refresh tokens.
- Soft delete for services instead of hard delete.
- Automated tests (API and UI) and a CI pipeline.
- Pagination, filtering and search on the bookings dashboard.