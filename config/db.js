const mongoose = require("mongoose");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: false,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
