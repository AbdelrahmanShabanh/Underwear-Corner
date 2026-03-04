const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const conn = await mongoose.connect(uri, {
    bufferCommands: false,
  });

  cachedConnection = conn.connection;
  return cachedConnection;
}

module.exports = connectDB;
