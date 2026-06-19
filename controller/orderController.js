import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };

    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    if (
      req.user.role !== "admin" &&
      order.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          message: `Sản phẩm ${item.productId} không tồn tại`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ số lượng`,
        });
      }

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
      product.quantity -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderProducts,
      totalPrice,
      status: "pending",
      paymentStatus: "unpaid",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
