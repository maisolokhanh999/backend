import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.productId");
  }

  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find(
      (item) => item.productId._id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (i) => i.productId._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
