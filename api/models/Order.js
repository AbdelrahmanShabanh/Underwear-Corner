const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    fullName: { type: String, required: function() { return this.status !== 'draft'; } },
    email: { type: String, required: function() { return this.status !== 'draft'; } },
    phone: { type: String, required: function() { return this.status !== 'draft'; } },
    governorate: { type: String, required: function() { return this.status !== 'draft'; } },
    address: { type: String, required: function() { return this.status !== 'draft'; } },
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
    enum: ["pending", "confirmed", "delivered", "cancelled", "draft"],
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
