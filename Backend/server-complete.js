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
                if (existingUser.email === email) {
                    return res.status(400).json({ error: "This email is already registered. Please login instead." });
                }
                return res.status(400).json({ error: "This username is already taken. Please choose another." });
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
                if (user.email === email) {
                    return res.status(400).json({ error: "This email is already registered. Please login instead." });
                }
                if (user.username === username) {
                    return res.status(400).json({ error: "This username is already taken. Please choose another." });
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
            // Update title to latest user message
            thread.title = message.substring(0, 40) + (message.length > 40 ? "..." : "");
            await thread.save();
            
            console.log("✅ Chat saved to MongoDB");
        } else {
            if (!memoryThreads.has(threadId)) {
                memoryThreads.set(threadId, {
                    threadId,
                    title: message.substring(0, 40) + (message.length > 40 ? "..." : ""),
                    messages: [],
                    updatedAt: new Date()
                });
            }
            
            const thread = memoryThreads.get(threadId);
            thread.messages.push({ role: "user", content: message });
            thread.messages.push({ role: "assistant", content: reply });
            thread.updatedAt = new Date();
            // Update title to latest user message
            thread.title = message.substring(0, 40) + (message.length > 40 ? "..." : "");
            
            console.log("✅ Chat saved to memory, thread:", thread.title);
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
            const threads = Array.from(memoryThreads.values())
                .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
                .map(t => ({ threadId: t.threadId, title: t.title }));
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

// Helper: calculate real scores from actual messages
function calcAnalytics(threads) {
    const allUserMessages = [];
    threads.forEach(t => {
        (t.messages || []).forEach(m => {
            if (m.role === "user") allUserMessages.push(m.content || "");
        });
    });

    if (allUserMessages.length === 0) {
        return { curiosityScore: 0, focusLevel: 0, confidencePattern: 0 };
    }

    // Curiosity: messages that are questions or start with question words
    const questionCount = allUserMessages.filter(m =>
        m.includes("?") ||
        /^(what|how|why|when|where|who|which|can|could|would|is|are|do|does|explain|tell me|describe)/i.test(m.trim())
    ).length;
    const curiosityScore = Math.min(100, Math.round((questionCount / allUserMessages.length) * 100));

    // Focus: messages with 3+ words are considered focused (lowered threshold)
    const focusedMessages = allUserMessages.filter(m => m.trim().split(/\s+/).length >= 3).length;
    const focusLevel = Math.min(100, Math.round((focusedMessages / allUserMessages.length) * 100));

    // Confidence: penalise hedging words
    const hedgeWords = ["maybe", "i think", "i guess", "not sure", "i don't know", "perhaps", "possibly", "idk", "not certain"];
    const confidentMessages = allUserMessages.filter(m =>
        !hedgeWords.some(h => m.toLowerCase().includes(h))
    ).length;
    const confidencePattern = Math.min(100, Math.round((confidentMessages / allUserMessages.length) * 100));

    return { curiosityScore, focusLevel, confidencePattern };
}

app.get("/api/analytics/dashboard", async (req, res) => {
    try {
        let allThreads = [];

        if (isMongoConnected) {
            allThreads = await Thread.find().sort({ updatedAt: -1 });
        } else {
            allThreads = Array.from(memoryThreads.values());
        }

        const totalConversations = allThreads.length;
        const totalMessages = allThreads.reduce((sum, t) => sum + (t.messages?.length || 0), 0);

        const { curiosityScore, focusLevel, confidencePattern } = calcAnalytics(allThreads);

        // Topic distribution based on first user message keywords
        const topicMap = {};
        allThreads.forEach(t => {
            const firstMsg = (t.messages || []).find(m => m.role === "user");
            if (!firstMsg) return;
            const text = (firstMsg.content || "").toLowerCase();
            let topic = "General";
            if (/code|program|function|bug|error|javascript|python|react|node|sort|algorithm|array|loop|class|object/i.test(text)) topic = "Coding";
            else if (/math|calcul|equation|number|algebra|geometry|integral|derivative/i.test(text)) topic = "Math";
            else if (/science|physics|chemistry|biology|nature|atom|molecule/i.test(text)) topic = "Science";
            else if (/history|war|country|politics|government|president|king/i.test(text)) topic = "History";
            else if (/write|essay|story|poem|creative|novel|blog/i.test(text)) topic = "Writing";
            else if (/what|how|why|when|where|who|explain|tell|describe/i.test(text)) topic = "Learning";
            topicMap[topic] = (topicMap[topic] || 0) + 1;
        });

        const topicDistribution = Object.entries(topicMap).map(([topic, count]) => ({
            topic,
            count,
            percentage: totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0
        }));

        const recentConversations = allThreads.slice(0, 5).map(t => {
            const msgs = t.messages || [];
            const userMsgs = msgs.filter(m => m.role === "user");
            const qCount = userMsgs.filter(m => (m.content || "").includes("?") || /^(what|how|why|when|where|who|explain)/i.test((m.content || "").trim())).length;
            const convCuriosity = userMsgs.length > 0 ? Math.round((qCount / userMsgs.length) * 100) : 0;
            const convFocus = userMsgs.length > 0 ? Math.min(100, Math.round((userMsgs.filter(m => (m.content || "").split(/\s+/).length >= 3).length / userMsgs.length) * 100)) : 0;
            return {
                threadId: t.threadId,
                title: t.title || "New Chat",
                messageCount: msgs.length,
                lastUpdated: t.updatedAt || new Date(),
                analytics: {
                    curiosityScore: convCuriosity,
                    topicDrift: { focusLevel: convFocus }
                }
            };
        });

        res.json({
            overview: {
                totalConversations,
                totalMessages,
                curiosityScore,
                averageFocusLevel: focusLevel
            },
            overallAnalytics: {
                curiosityScore,
                topicDrift: { score: 100 - focusLevel, focusLevel },
                confidencePattern,
                knowledgeGrowth: totalMessages
            },
            recentConversations,
            knowledgeGrowth: allThreads.map((t, i) => ({
                date: t.updatedAt || new Date(),
                score: Math.min(100, (t.messages?.length || 0) * 10)
            })),
            learningStreak: Math.min(totalConversations, 7),
            topicDistribution: topicDistribution.length > 0 ? topicDistribution : [{ topic: "general", count: 0, percentage: 0 }]
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
