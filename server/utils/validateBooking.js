// Server-side validation helpers for bookings.
// Pure functions (no database), so they are easy to test.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// Salon works in Indian Standard Time, whatever timezone the server is in.
const TIMEZONE = "Asia/Kolkata";

const getNowInSalonTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString("en-CA", { timeZone: TIMEZONE }); // YYYY-MM-DD
  const time = now.toLocaleTimeString("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // HH:mm
  return { date, time };
};

const isRealDate = (value) => {
  if (!DATE_REGEX.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() === m - 1 &&
    parsed.getUTCDate() === d
  );
};

export const validateDateTime = (date, time, now = getNowInSalonTime()) => {
  if (typeof date !== "string" || !isRealDate(date)) {
    return "Date must be a valid date in YYYY-MM-DD format";
  }
  if (typeof time !== "string" || !TIME_REGEX.test(time)) {
    return "Time must be in HH:mm (24-hour) format";
  }
  if (date < now.date) {
    return "Date cannot be in the past";
  }
  if (date === now.date && time <= now.time) {
    return "Time has already passed for today";
  }
  return null;
};

// Returns { error } or { data } with trimmed, safe values.
export const validateBookingInput = (body, now) => {
  const { name, phone, email, service, date, time, notes } = body || {};

  for (const [field, value] of Object.entries({ name, phone, email, service, date, time })) {
    if (typeof value !== "string" || !value.trim()) {
      return { error: "Please fill all required fields" };
    }
  }
  if (notes !== undefined && typeof notes !== "string") {
    return { error: "Notes must be text" };
  }

  const clean = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    service: service.trim(),
    date: date.trim(),
    time: time.trim(),
    notes: (notes || "").trim(),
  };

  if (clean.name.length < 2 || clean.name.length > 100) {
    return { error: "Name must be between 2 and 100 characters" };
  }
  if (!PHONE_REGEX.test(clean.phone)) {
    return { error: "Phone must be a valid 10-digit number" };
  }
  if (clean.email.length > 254 || !EMAIL_REGEX.test(clean.email)) {
    return { error: "Please provide a valid email address" };
  }
  if (clean.notes.length > 500) {
    return { error: "Notes cannot be longer than 500 characters" };
  }

  const dateTimeError = validateDateTime(clean.date, clean.time, now);
  if (dateTimeError) return { error: dateTimeError };

  return { data: clean };
};