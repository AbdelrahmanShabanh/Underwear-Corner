require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const usersRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Underwear Corner API" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

module.exports = app;
