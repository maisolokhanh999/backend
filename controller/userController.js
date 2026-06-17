import User from "../moder/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Booking from "../moder/bookings.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

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
      apiKey: crypto.randomUUID(),
      password: hashedPassword,
      role: "user"
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Đăng ký thành công",
      user: userObj,
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

    res.json({
      message: "Đăng nhập thành công",
      apiKey: user.apiKey,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePermissions = async (req, res) => {
  try {
    const { role } = req.body;
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.status(200).json({
      message: "Cập nhật role thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



