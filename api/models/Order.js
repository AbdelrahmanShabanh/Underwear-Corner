const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    governorate: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [
    {
      productId: String,
      name: String,
      size: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "instapay"],
    default: "cash",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
