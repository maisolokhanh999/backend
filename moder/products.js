import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Giá không được nhỏ hơn 0"],
    },

    quantity: {
      type: Number,
      default: 0,
      min: [0, "Số lượng không được nhỏ hơn 0"],
    },

    brand: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);