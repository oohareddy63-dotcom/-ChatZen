import express from "express";
import User from "../models/User.js";
import { generateToken, verifyToken } from "../middleware/auth.js";
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        // Create user
        const user = new User({ username, email, password });
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                totalConversations: user.totalConversations,
                totalMessages: user.totalMessages,
                curiosityScore: user.curiosityScore
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" });
    }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const { username, profilePicture } = req.body;
        const user = await User.findById(req.userId);
        
        if (username) user.username = username;
        if (profilePicture) user.profilePicture = profilePicture;
        
        await user.save();
        res.json({ message: "Profile updated", user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
