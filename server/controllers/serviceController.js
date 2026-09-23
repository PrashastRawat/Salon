import Service from "../models/Service.js";

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ success: false, error: "Please provide name, price and duration" });
    }

    const service = await Service.create({ name, description, price, duration });

    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, service: updatedService });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};