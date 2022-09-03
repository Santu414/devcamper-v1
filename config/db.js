const mongoose = require("mongoose");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
