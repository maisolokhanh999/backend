import Cart from "../moder/cart.js";
import mongoose from "mongoose";
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId,
        }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({
                message: "Giỏ hàng không tồn tại",
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId, "items.productId": productId });

        if (cart) {
            // Sản phẩm đã có trong giỏ -> tăng quantity atomically
            cart = await Cart.findOneAndUpdate(
                { userId, "items.productId": productId },
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            );
        } else {
            // Chưa có cart hoặc chưa có sản phẩm này -> thêm mới
            cart = await Cart.findOneAndUpdate(
                { userId },
                { $push: { items: { productId, quantity } } },
                { new: true, upsert: true }
            );
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const { userId, quantity } = req.body;
        const { productId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { userId, "items.productId": productId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng hoặc sản phẩm" });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const removeCartItem = async (req, res) => {
    try {
        const { userId } = req.body;
        const { productId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }

        res.json({ message: "Xóa sản phẩm thành công", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }

        res.json({ message: "Đã xóa toàn bộ giỏ hàng", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};