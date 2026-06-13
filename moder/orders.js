import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: Number,

        price: Number,
      },
    ],

    totalPrice: Number,

    status: {
      type: String,
      default: "pending",
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);