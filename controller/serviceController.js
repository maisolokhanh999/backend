import Service from "../models/Service.js";
import Category from "../models/Category.js";

export const getServices = async (req, res) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const services = await Service.find(filter)
      .populate("categoryId", "name description")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "categoryId",
      "name description"
    );

    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, price, duration, categoryId } = req.body;

    if (!name || price == null || duration == null || !categoryId) {
      return res.status(400).json({ message: "Thiếu thông tin dịch vụ bắt buộc" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    const service = await Service.create({ name, price, duration, categoryId });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);

      if (!category) {
        return res.status(400).json({ message: "Danh mục không tồn tại" });
      }
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }

    res.json({ message: "Xóa dịch vụ thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
