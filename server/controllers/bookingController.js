import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
export const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, service, date, time, notes } = req.body;

    if (!name || !phone || !email || !service || !date || !time) {
      return res.status(400).json({ success: false, error: "Please fill all required fields" });
    }

    const serviceExists = await Service.findById(service);

    if (!serviceExists) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    const booking = await Booking.create({ name, phone, email, service, date, time, notes });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "This slot is already booked, please choose another time" });
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
    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (!status || !validStatuses.includes(status)) {
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
    next(error);
  }
};

export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ success: false, error: "Please provide date and time" });
    }

    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $in: ["Pending", "Confirmed"] },
    });

    res.status(200).json({ success: true, available: !existingBooking });
  } catch (error) {
    next(error);
  }
};