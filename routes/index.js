import express from "express";
import { register, login, updatePermissions } from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";
import { createProduct } from "../controller/productsController.js";
import { createCategory } from "../controller/categoriesController.js";
import { getOrders } from "../controller/ordersController.js";
import { getBookings } from "../controller/bookingController.js";
import { getReviews } from "../controller/reviewController.js";
import { getCart, addToCart, clearCart, removeCartItem, updateCartItem } from "../controller/cartController.js";
const router = express.Router();

// Auth - không cần middleware
router.post("/register", register);
router.post("/login", login);
router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeCartItem);
router.delete("/clear/:userId", clearCart);
// Cần đăng nhập + quyền admin
router.post("/products", authMiddleware, isAdmin, createProduct);
router.post("/categories", authMiddleware, isAdmin, createCategory);
router.patch("/User/:id/permissions", authMiddleware, isAdmin, updatePermissions);
router.get("/orders", authMiddleware, isAdmin, getOrders);
router.get("/bookings", authMiddleware, isAdmin, getBookings);
router.get("/reviews", authMiddleware, isAdmin, getReviews);

export default router;