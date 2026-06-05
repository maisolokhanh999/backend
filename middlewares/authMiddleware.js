import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers.apikey;

    if (!apiKey) {
      return res.status(401).json({
        message: "Thiếu apiKey",
      });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({
        message: "apiKey không hợp lệ",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default authMiddleware;
