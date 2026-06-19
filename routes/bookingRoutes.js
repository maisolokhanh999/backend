import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controller/bookingController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
