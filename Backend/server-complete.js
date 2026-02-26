import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "./models/User.js";
import Thread from "./models/Thread.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// CORS configuration - Allow all origins in production, specific origins in development
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? '*' 
    : ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Database connection status
let isMongoConnected = false;

// In-memory fallback storage
const memoryUsers = new Map();
const memoryThreads = new Map();

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "ChatZen Backend is running",
        database: isMongoConnected ? "MongoDB" : "In-Memory",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.json({ 
        message: "ChatZen API Server",
        version: "1.0.0",
        database: isMongoConnected ? "MongoDB Connected" : "In-Memory Mode",
        endpoints: {
            health: "GET /health",
            register: "POST /api/auth/register",
            login: "POST /api/auth/login",
            chat: "POST /api/chat",
            threads: "GET /api/thread",
            thread: "GET /api/thread/:threadId",
            deleteThread: "DELETE /api/thread/:threadId",
            analytics: "GET /api/analytics/dashboard"
        }
    });
});

// ===== AUTH ROUTES =====
app.post("/api/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    
    console.log("Registration attempt:", { username, email });
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide all fields" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    try {
        if (isMongoConnected) {
            // MongoDB mode
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }
            
            const user = new User({ username, email, password });
            await user.save();
            
            const token = `token-${user._id}`;
            console.log("✅ User registered in MongoDB:", username);
            
            return res.status(201).json({
                message: "User registered successfully",
                token,
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                }
            });
        } else {
            // In-memory mode
            for (const user of memoryUsers.values()) {
                if (user.email === email || user.username === username) {
                    return res.status(400).json({ error: "User already exists" });
                }
            }
            
            const userId = Date.now().toString();
            const user = {
                id: userId,
                username,
                email,
                password,
                createdAt: new Date()
            };
            
            memoryUsers.set(userId, user);
            console.log("✅ User registered in memory:", username);
            
            return res.status(201).json({
                message: "User registered successfully",
                token: `token-${userId}`,
                user: { id: userId, username, email }
            });
        }
    } catch (error) {
        console.error("❌ Registration error:", error);
        return res.status(500).json({ 
            error: "Registration failed", 
            details: error.message 
        });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    console.log("Login attempt:", email);
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    
    try {
        if (isMongoConnected) {
            // MongoDB mode
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            user.lastLogin = new Date();
            await user.save();
            
            const token = `token-${user._id}`;
            console.log("✅ User logged in (MongoDB):", email);
            
            return res.json({
                message: "Login successful",
                token,
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                }
            });
        } else {
            // In-memory mode
            let user = null;
            for (const u of memoryUsers.values()) {
                if (u.email === email) {
                    user = u;
                    break;
                }
            }
            
            if (!user || user.password !== password) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            console.log("✅ User logged in (memory):", email);
            
            return res.json({
                message: "Login successful",
                token: `token-${user.id}`,
                user: { id: user.id, username: user.username, email: user.email }
            });
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({ 
            error: "Login failed", 
            details: error.message 
        });
    }
});

// ===== CHAT ROUTES =====
app.post("/api/chat", async (req, res) => {
    const { message, threadId } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    console.log("Chat request:", { threadId, messageLength: message.length });
    
    try {
        // Get AI response from Ollama
        const ollamaUrl = (process.env.OLLAMA_URL || "http://localhost:11434") + "/api/chat";
        
        let history = [];
        if (isMongoConnected && threadId) {
            const thread = await Thread.findOne({ threadId });
            if (thread) {
                history = thread.messages.slice(-6);
            }
        } else if (threadId && memoryThreads.has(threadId)) {
            history = memoryThreads.get(threadId).messages.slice(-6);
        }
        
        const messages = [
            { role: "system", content: "You are a helpful AI assistant." },
            ...history,
            { role: "user", content: message }
        ];
        
        const response = await fetch(ollamaUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || "llama3.2:1b",
                messages: messages,
                stream: false
            })
        });
        
        const data = await response.json();
        const reply = data.message?.content || data.response || "Sorry, I couldn't process that.";
        
        // Save to database or memory
        if (isMongoConnected) {
            let thread = await Thread.findOne({ threadId });
            if (!thread) {
                thread = new Thread({
                    threadId,
                    userId: new mongoose.Types.ObjectId(),
                    title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                    messages: []
                });
            }
            
            thread.messages.push({ role: "user", content: message });
            thread.messages.push({ role: "assistant", content: reply });
            thread.updatedAt = new Date();
            await thread.save();
            
            console.log("✅ Chat saved to MongoDB");
        } else {
            if (!memoryThreads.has(threadId)) {
                memoryThreads.set(threadId, {
                    threadId,
                    title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                    messages: []
                });
            }
            
            const thread = memoryThreads.get(threadId);
            thread.messages.push({ role: "user", content: message });
            thread.messages.push({ role: "assistant", content: reply });
            
            console.log("✅ Chat saved to memory");
        }
        
        res.json({ reply });
    } catch (error) {
        console.error("❌ Chat error:", error);
        
        let errorMessage = "Failed to get response from AI";
        let helpText = "";
        
        if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
            errorMessage = "Cannot connect to Ollama";
            helpText = "Make sure Ollama is running. Run: ollama serve";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            help: helpText,
            details: error.message 
        });
    }
});

app.get("/api/thread", async (req, res) => {
    try {
        if (isMongoConnected) {
            const threads = await Thread.find().sort({ updatedAt: -1 }).select("threadId title updatedAt");
            console.log(`✅ Retrieved ${threads.length} threads from MongoDB`);
            return res.json(threads.map(t => ({
                threadId: t.threadId,
                title: t.title,
                updatedAt: t.updatedAt
            })));
        } else {
            const threads = Array.from(memoryThreads.values()).map(t => ({
                threadId: t.threadId,
                title: t.title
            }));
            console.log(`✅ Retrieved ${threads.length} threads from memory`);
            return res.json(threads);
        }
    } catch (error) {
        console.error("❌ Get threads error:", error);
        return res.status(500).json({ error: "Failed to retrieve threads" });
    }
});

app.get("/api/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    
    try {
        if (isMongoConnected) {
            const thread = await Thread.findOne({ threadId });
            if (!thread) {
                return res.status(404).json({ error: "Thread not found" });
            }
            return res.json(thread.messages || []);
        } else {
            const thread = memoryThreads.get(threadId);
            if (!thread) {
                return res.status(404).json({ error: "Thread not found" });
            }
            return res.json(thread.messages || []);
        }
    } catch (error) {
        console.error("❌ Get thread error:", error);
        return res.status(500).json({ error: "Failed to retrieve thread" });
    }
});

app.delete("/api/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    
    try {
        if (isMongoConnected) {
            await Thread.deleteOne({ threadId });
            console.log("✅ Thread deleted from MongoDB:", threadId);
        } else {
            memoryThreads.delete(threadId);
            console.log("✅ Thread deleted from memory:", threadId);
        }
        return res.json({ message: "Thread deleted" });
    } catch (error) {
        console.error("❌ Delete thread error:", error);
        return res.status(500).json({ error: "Failed to delete thread" });
    }
});

// ===== ANALYTICS ROUTES =====
app.get("/api/analytics/dashboard", async (req, res) => {
    try {
        let totalConversations = 0;
        let totalMessages = 0;
        let recentConversations = [];
        
        if (isMongoConnected) {
            totalConversations = await Thread.countDocuments();
            const threads = await Thread.find().sort({ updatedAt: -1 }).limit(5);
            totalMessages = threads.reduce((sum, t) => sum + t.messages.length, 0);
            recentConversations = threads.map(t => ({
                threadId: t.threadId,
                title: t.title,
                messageCount: t.messages.length,
                analytics: {
                    curiosityScore: t.curiosityScore || Math.floor(Math.random() * 40) + 60,
                    topicDrift: { focusLevel: Math.floor(Math.random() * 30) + 70 }
                }
            }));
        } else {
            totalConversations = memoryThreads.size;
            totalMessages = Array.from(memoryThreads.values()).reduce((sum, t) => sum + (t.messages?.length || 0), 0);
            recentConversations = Array.from(memoryThreads.values()).slice(-5).map(t => ({
                threadId: t.threadId,
                title: t.title,
                messageCount: t.messages?.length || 0,
                analytics: {
                    curiosityScore: Math.floor(Math.random() * 40) + 60,
                    topicDrift: { focusLevel: Math.floor(Math.random() * 30) + 70 }
                }
            }));
        }
        
        res.json({
            overview: {
                totalConversations,
                totalMessages,
                curiosityScore: 75,
                averageFocusLevel: 82
            },
            overallAnalytics: {
                curiosityScore: 75,
                topicDrift: { score: 18, focusLevel: 82 },
                confidencePattern: 68,
                knowledgeGrowth: 45
            },
            recentConversations,
            knowledgeGrowth: [],
            learningStreak: 3,
            topicDistribution: [
                { topic: "general", count: totalConversations, percentage: 100 }
            ]
        });
    } catch (error) {
        console.error("❌ Analytics error:", error);
        return res.status(500).json({ error: "Failed to retrieve analytics" });
    }
});

// ===== DATABASE CONNECTION =====
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI || mongoURI.trim() === "") {
            console.log("⚠️  No MONGODB_URI found in .env file");
            console.log("📝 Using in-memory storage (data will be lost on restart)");
            console.log("💡 To use MongoDB, add MONGODB_URI to Backend/.env file");
            isMongoConnected = false;
            return;
        }
        
        console.log("🔄 Connecting to MongoDB Atlas...");
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });
        
        isMongoConnected = true;
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📊 Database:", mongoose.connection.name);
        console.log("🌍 Host:", mongoose.connection.host);
        
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        console.log("🔄 Falling back to in-memory storage");
        console.log("💡 Check your MONGODB_URI in Backend/.env file");
        isMongoConnected = false;
    }
};

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    isMongoConnected = false;
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
    isMongoConnected = false;
});

// ===== START SERVER =====
app.listen(PORT, async () => {
    console.log("=".repeat(50));
    console.log("🚀 ChatZen Backend Server");
    console.log("=".repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🤖 AI Model: ${process.env.OLLAMA_MODEL || "llama3.2:1b"}`);
    console.log("=".repeat(50));
    
    // Connect to MongoDB
    await connectDB();
    
    console.log("=".repeat(50));
    console.log("✅ Server is ready to accept requests!");
    console.log("=".repeat(50));
});
