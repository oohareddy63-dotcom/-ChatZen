import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// Simple test route
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Auth routes
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    res.json({
        message: "Login successful",
        token: "test-token",
        user: { id: "123", username: "TestUser", email }
    });
});

app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;
    res.json({
        message: "Registration successful",
        token: "test-token",
        user: { id: "123", username, email }
    });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Try to connect to MongoDB
    mongoose.connect("mongodb://127.0.0.1:27017/chatzen", {
        serverSelectionTimeoutMS: 5000
    }).then(() => {
        console.log("MongoDB connected!");
    }).catch(err => {
        console.log("MongoDB not connected:", err.message);
    });
});
