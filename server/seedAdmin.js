// ============================================================
// SEED SCRIPT - creates the admin account (and sample services)
//
// HOW TO RUN (in your terminal, from the /server folder):
//   1. Make sure MONGO_URI is set in your .env file
//   2. Change the 3 values below to your own name, email and password
//   3. Run:  node seedAdmin.js
//   4. Log in at /admin/login with that email and password
//
// To create another admin, change the email below and run it again.
// ============================================================

const ADMIN_NAME = "your name";
const ADMIN_EMAIL = "your email";
const ADMIN_PASSWORD = "your password";

// ------------------------------------------------------------

import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Service from "./models/Service.js";

const sampleServices = [
  { name: "Haircut", description: "Wash, cut and style.", price: 500, duration: 45 },
  { name: "Hair Coloring", description: "Full color with premium products.", price: 2500, duration: 120 },
  { name: "Facial", description: "Deep cleansing facial for glowing skin.", price: 1200, duration: 60 },
  { name: "Manicure", description: "Nail shaping, cuticle care and polish.", price: 600, duration: 40 },
  { name: "Pedicure", description: "Foot soak, scrub, nail care and polish.", price: 800, duration: 50 },
];

const seedAdmin = async () => {
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Admin.create({ name: ADMIN_NAME, email, password: hashedPassword });
  console.log(`Admin created: ${email}`);
};

const seedServices = async () => {
  const count = await Service.countDocuments();

  if (count > 0) {
    console.log(`Services already exist (${count}), skipping`);
    return;
  }

  await Service.insertMany(sampleServices);
  console.log(`Inserted ${sampleServices.length} sample services`);
};

const run = async () => {
  await connectDB();
  try {
    await seedAdmin();
    await seedServices();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();