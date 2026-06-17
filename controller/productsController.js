
import Product from "../moder/products.js";

import mongoose from "mongoose";
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};