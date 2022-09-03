const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//Router files
const bootcamps = require("./routes/bootcamps");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to databases
connectDB();

const app = express();

// Mount routers
app.use("./api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
