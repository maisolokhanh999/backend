import express from "express";
import {
  updateReview,
  deleteReview,
} from "../controller/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
