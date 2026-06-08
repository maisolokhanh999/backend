import User from "../Moder/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existUser = await User.findOne({ username });

    if (existUser) {
      return res.status(400).json({
        message: "Username đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }

    const apiKey = crypto.randomUUID();

    user.apiKey = apiKey;

    await user.save();

    res.json({
      message: "Đăng nhập thành công",
      apiKey,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};