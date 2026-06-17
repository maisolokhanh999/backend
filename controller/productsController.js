import Product from "../Moder/products.js";
import Category from "../Moder/categories.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
    try {
        const { code, name, price, category, brand, quantity, description, image } = req.body;

        if (!code || !name || !category || price == null || !brand) {
            return res.status(400).json({
                message: "Thiếu thông tin bắt buộc (code, name, category, price, brand)",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                message: "Category không hợp lệ",
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                message: "Category không tồn tại",
            });
        }

        const product = await Product.create({
            code,
            name,
            price,
            categoryId: category,
            brand,
            quantity,
            description,
            image,
        });

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Mã sản phẩm (code) đã tồn tại",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: error.message,
        });
    }
};