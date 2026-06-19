import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controller/serviceController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", authMiddleware, adminMiddleware, createService);
router.put("/:id", authMiddleware, adminMiddleware, updateService);
router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

export default router;
