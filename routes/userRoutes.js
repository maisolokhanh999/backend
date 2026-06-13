import express from "express";
import {
  register,
  login,
  updatePermissions,
} from "../Controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/permissions/:id", updatePermissions);


export default router;