const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();
const authRoutes = require("./routes/authRoutes");

mongoose.connect(process.env.DB_URL, () => {
    console.log("Database Connected!");
})

app.use(cookieParser());
app.use(express.json());
// Routes
app.use("/api/user", authRoutes);

app.listen(4000, () => {
    console.log("Server Running...");
})