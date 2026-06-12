import express from "express";
import {
    createProduct
} from "../Controller/authController.js";

const router = express.Router();

router.post("/product", createProduct);
export default router;