console.log("Starting server...");

import express from "express";
console.log("Express imported");

import mongoose from "mongoose";
console.log("Mongoose imported");

import dotenv from "dotenv";
console.log("Dotenv imported");

dotenv.config();
console.log("Env loaded");

const app = express();
app.use(express.json());

// Routes
app.post("/api/auth/register", (req, res) => {
    res.json({ message: "Registered", token: "token123", user: req.body });
});

app.post("/api/auth/login", (req, res) => {
    res.json({ message: "Login successful", token: "token123", user: req.body });
});

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (uri) {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
            console.log("✅ MongoDB Atlas Connected!");
        } else {
            console.log("⚠️  No MongoDB URI, using memory storage");
        }
    } catch (err) {
        console.log("❌ MongoDB Error:", err.message);
    }
};

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    connectDB();
});
