import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: String,

    price: Number,

    duration: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);