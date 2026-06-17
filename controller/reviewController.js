import Review from "../Moder/review.js";
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId")
      .populate("productId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; 
