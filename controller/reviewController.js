import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const existingReview = await Review.findOne({
      userId: req.user._id,
      productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này" });
    }

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id).populate("userId", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền sửa đánh giá này" });
    }

    const { rating, comment } = req.body;

    if (rating != null) review.rating = rating;
    if (comment != null) review.comment = comment;

    await review.save();

    const populated = await Review.findById(review._id).populate("userId", "name");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });
    }

    await review.deleteOne();
    res.json({ message: "Xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
