import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

export const getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("serviceId", "name price duration")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate("serviceId", "name price duration");

    if (!booking) {
      return res.status(404).json({ message: "Lịch đặt không tồn tại" });
    }

    if (
      req.user.role !== "admin" &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Không có quyền xem lịch đặt này" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date } = req.body;

    if (!serviceId || !date) {
      return res.status(400).json({ message: "Thiếu serviceId hoặc date" });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }

    const bookingDate = new Date(date);

    if (bookingDate < new Date()) {
      return res.status(400).json({ message: "Ngày đặt phải ở tương lai" });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      date: bookingDate,
      status: "pending",
    });

    const populated = await Booking.findById(booking._id)
      .populate("serviceId", "name price duration");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Lịch đặt không tồn tại" });
    }

    if (
      req.user.role !== "admin" &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Không có quyền cập nhật lịch đặt này" });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("serviceId", "name price duration");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Lịch đặt không tồn tại" });
    }

    if (
      req.user.role !== "admin" &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Không có quyền xóa lịch đặt này" });
    }

    await booking.deleteOne();
    res.json({ message: "Xóa lịch đặt thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
