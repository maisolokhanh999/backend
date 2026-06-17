import Category from "../moder/categories.js";

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            message: "Thêm danh mục thành công",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};