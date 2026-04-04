import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
                req.userId = user._id;
            }
        }
        
        next();
    } catch (error) {
        next();
    }
};
