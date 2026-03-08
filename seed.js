require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Product = require("./api/models/Product");

const productsData = [
  {
    category: "men",
    image: "/product-placeholder.jpg",
    name: { en: "Town Team cotton boxers (2 pack)", ar: "بوكسر قطن (طقم ٢ قطعة)" },
    description: {
      en: "Soft cotton boxers with a flexible waistband for all‑day comfort.",
      ar: "بوكسر قطن ناعم بوسط مرن لراحة طول اليوم."
    },
    price: 190,
    hasSizeNumbers: true,
    sizes: [
      { name: "M", stock: 5, sizeNumber: 3 },
      { name: "L", stock: 0, sizeNumber: 4 }, // out of stock showcase
      { name: "XL", stock: 5, sizeNumber: 5 }
    ],
    stock: 10,
    isOffer: false
  },
  {
    category: "men",
    image: "/product-placeholder.jpg",
    name: { en: "Everyday stretch trunks", ar: "شورت سترتش يومي" },
    description: {
      en: "Sleek stretch trunks that stay in place under any outfit.",
      ar: "شورت سترتش أنيق يثبت تحت أي لبس."
    },
    price: 255,
    hasSizeNumbers: false,
    sizes: [
      { name: "M", stock: 0 },
      { name: "L", stock: 0 }
    ],
    stock: 0,
    isOffer: false
  },
  {
    category: "women",
    image: "/download.jpg",
    name: { en: "Essential bikini briefs (3 pack)", ar: "سليبات بيكيني أساسية (٣ قطع)" },
    description: {
      en: "Ultra‑soft bikini briefs in everyday neutral tones.",
      ar: "سليبات بيكيني ناعمة بألوان أساسية لليوم كله."
    },
    price: 190,
    oldPrice: 260,
    hasSizeNumbers: false,
    sizes: [
      { name: "S", stock: 2 },
      { name: "M", stock: 3 }
    ],
    stock: 5,
    isOffer: true
  },
  {
    category: "kids",
    image: "/download (1).jpg",
    name: { en: "Dino adventures briefs (3 pack)", ar: "سليبات ديناصورات (٣ قطع)" },
    description: {
      en: "Fun dinosaur prints in soft cotton for kids.",
      ar: "طباعة ديناصورات لطيفة من قطن ناعم للأطفال."
    },
    price: 210,
    hasSizeNumbers: false,
    sizes: [
      { name: "S", stock: 0 },
      { name: "M", stock: 2 }
    ],
    stock: 2,
    isOffer: false
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared old products");

    await Product.insertMany(productsData);
    console.log("Inserted new products successfully!");
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
