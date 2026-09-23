import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { validateBookingInput, validateDateTime } from "../utils/validateBooking.js";

const VALID_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const ACTIVE_STATUSES = ["Pending", "Confirmed"];
const SLOT_TAKEN_MESSAGE = "This slot is already booked, please choose another time";

export const createBooking = async (req, res, next) => {
  try {
    const { error, data } = validateBookingInput(req.body);

    if (error) {
      return res.status(400).json({ success: false, error });
    }

    if (!mongoose.isValidObjectId(data.service)) {
      return res.status(400).json({ success: false, error: "Invalid service" });
    }

    const serviceExists = await Service.findById(data.service);

    if (!serviceExists || !serviceExists.isActive) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    const booking = await Booking.create(data);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: SLOT_TAKEN_MESSAGE });
    }
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("service", "name price duration").sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid booking id" });
    }

    const booking = await Booking.findById(req.params.id).populate("service", "name price duration");

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid booking id" });
    }

    if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: "Please provide a valid status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    // Re-activating a cancelled booking whose slot was taken meanwhile
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Another active booking already uses this date and time, so this status cannot be set",
      });
    }
    next(error);
  }
};

export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ success: false, error: "Please provide date and time" });
    }

    const formatError = validateDateTime(date, time);

    if (formatError) {
      return res.status(400).json({ success: false, error: formatError });
    }

    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $in: ACTIVE_STATUSES },
    });

    res.status(200).json({ success: true, available: !existingBooking });
  } catch (error) {
    next(error);
  }
};