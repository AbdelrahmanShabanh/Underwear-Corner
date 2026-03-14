const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, default: ""  },
    ar: { type: String, default: ""  },
  },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["men", "women", "kids"],
    required: true,
  },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  hasSizeNumbers: { type: Boolean, default: false },
  sizes: [
    {
      name: { type: String, required: true },
      sizeNumber: { type: Number },
      stock: { type: Number, default: 0 },
    }
  ],
  isOffer: { type: Boolean, default: false },
  oldPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
