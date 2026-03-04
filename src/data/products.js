export const categories = [
  {
    id: "men",
    label: { en: "Men", ar: "رجالي" }
  },
  {
    id: "women",
    label: { en: "Women", ar: "حريمي" }
  },
  {
    id: "kids",
    label: { en: "Kids", ar: "أطفالي" }
  }
];

export const products = [
  {
    id: "men-1",
    category: "men",
    image: "/product-placeholder.jpg",
    name: { en: "Town Team cotton boxers (2 pack)", ar: "بوكسر قطن (طقم ٢ قطعة)" },
    description: {
      en: "Soft cotton boxers with a flexible waistband for all‑day comfort.",
      ar: "بوكسر قطن ناعم بوسط مرن لراحة طول اليوم."
    },
    price: "LE 190.00"
  },
  {
    id: "men-2",
    category: "men",
    image: "/product-placeholder.jpg",
    name: { en: "Everyday stretch trunks", ar: "شورت سترتش يومي" },
    description: {
      en: "Sleek stretch trunks that stay in place under any outfit.",
      ar: "شورت سترتش أنيق يثبت تحت أي لبس."
    },
    price: "LE 255.00",
    isSoldOut: true
  },
  {
    id: "men-3",
    category: "men",
    image: "/product-placeholder.jpg",
    name: { en: "Premium ribbed briefs", ar: "سليپ قطن مضلع بريميوم" },
    description: {
      en: "Classic ribbed briefs with breathable cotton fabric.",
      ar: "سليپ كلاسيك مضلع من قطن مريح."
    },
    price: "LE 175.00"
  },
  {
    id: "women-1",
    category: "women",
    image: "/download.jpg",
    name: { en: "Essential bikini briefs (3 pack)", ar: "سليبات بيكيني أساسية (٣ قطع)" },
    description: {
      en: "Ultra‑soft bikini briefs in everyday neutral tones.",
      ar: "سليبات بيكيني ناعمة بألوان أساسية لليوم كله."
    },
    price: "LE 190.00",
    oldPrice: "LE 260.00",
    isOffer: true
  },
  {
    id: "women-2",
    category: "women",
    image: "/download.jpg",
    name: { en: "Seamless comfort briefs", ar: "سليبات بدون خياطات للراحة" },
    description: {
      en: "Seamless finish that disappears under clothes.",
      ar: "بدون خياطات لتختفي تحت الملابس."
    },
    price: "LE 255.00",
    oldPrice: "LE 320.00",
    isOffer: true
  },
  {
    id: "women-3",
    category: "women",
    image: "/download.jpg",
    name: { en: "Soft touch hipster set", ar: "سليبات هيبستر سوفت تاتش" },
    description: {
      en: "Soft touch hipster cut for a modern feminine look.",
      ar: "موديل هيبستر ناعم لإطلالة عصرية."
    },
    price: "LE 275.00",
    oldPrice: "LE 350.00",
    isOffer: true,
    isSoldOut: true
  },
  {
    id: "kids-1",
    category: "kids",
    image: "/download (1).jpg",
    name: { en: "Dino adventures briefs (3 pack)", ar: "سليبات恐 ديناصورات (٣ قطع)" },
    description: {
      en: "Fun dinosaur prints in soft cotton for kids.",
      ar: "طباعة ديناصورات لطيفة من قطن ناعم للأطفال."
    },
    price: "LE 210.00"
  },
  {
    id: "kids-2",
    category: "kids",
    image: "/download (1).jpg",
    name: { en: "Stripe & dino combo set", ar: "مجموعة مخططة وديناصورات" },
    description: {
      en: "Mix of stripes and dino prints kids will love.",
      ar: "مزيج من المخطط والديناصورات اللي الأطفال هتحبها."
    },
    price: "LE 225.00"
  },
  {
    id: "kids-3",
    category: "kids",
    image: "/download (1).jpg",
    name: { en: "Everyday kids briefs", ar: "سليبات أطفال يومية" },
    description: {
      en: "Everyday briefs with a gentle elastic waistband.",
      ar: "سليبات يومية بوسط مريح ولين."
    },
    price: "LE 180.00"
  }
];

export const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

