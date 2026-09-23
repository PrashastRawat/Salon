import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  checkAvailability,
} from "../controllers/bookingController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/availability", checkAvailability);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, updateBookingStatus);

export default router;