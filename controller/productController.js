import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name description")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name description"
    );

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, image, description, categoryId } = req.body;

    if (!name || price == null || !categoryId) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm bắt buộc" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    const product = await Product.create({
      name,
      price,
      quantity: quantity ?? 0,
      image,
      description,
      categoryId,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);

      if (!category) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
