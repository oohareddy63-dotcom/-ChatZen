import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

// Ensure data directory exists
const DATA_DIR = join(__dirname, "data");
const ensureDataDir = async () => {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }
};

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// In-memory storage for users and threads
const users = new Map();
const threads = new Map();

// ===== AUTH ROUTES =====
app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide all fields" });
    }
    
    // Check if user exists
    for (const user of users.values()) {
        if (user.email === email || user.username === username) {
            return res.status(400).json({ error: "User already exists" });
        }
    }
    
    const userId = Date.now().toString();
    const user = {
        id: userId,
        username,
        email,
        password, // In production, hash this!
        createdAt: new Date()
    };
    
    users.set(userId, user);
    
    res.status(201).json({
        message: "User registered successfully",
        token: `token-${userId}`,
        user: { id: userId, username, email }
    });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    let user = null;
    for (const u of users.values()) {
        if (u.email === email) {
            user = u;
            break;
        }
    }
    
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({
        message: "Login successful",
        token: `token-${user.id}`,
        user: { id: user.id, username: user.username, email: user.email }
    });
});

// ===== CHAT ROUTES =====
app.post("/api/chat", async (req, res) => {
    const { message, threadId } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    try {
        // Get conversation history
        let history = [];
        if (threadId && threads.has(threadId)) {
            history = threads.get(threadId).messages || [];
        }
        
        // Build messages array with history
        const messages = [
            { role: "system", content: "You are a helpful AI assistant." },
            ...history.slice(-6), // Last 3 exchanges
            { role: "user", content: message }
        ];
        
        // Call Ollama
        const ollamaUrl = (process.env.OLLAMA_URL || "http://localhost:11434") + "/api/chat";
        console.log("Calling Ollama at:", ollamaUrl);
        
        const response = await fetch(ollamaUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || "llama3.2",
                messages: messages,
                stream: false
            })
        });
        
        const responseText = await response.text();
        console.log("Ollama response:", responseText.substring(0, 200));
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.error("Response was:", responseText);
            throw new Error("Invalid JSON from Ollama");
        }
        
        const reply = data.message?.content || data.response || "Sorry, I couldn't process that.";
        
        // Save to thread
        if (!threads.has(threadId)) {
            threads.set(threadId, { 
                threadId, 
                title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                messages: [] 
            });
        }
        
        const thread = threads.get(threadId);
        thread.messages.push({ role: "user", content: message });
        thread.messages.push({ role: "assistant", content: reply });
        
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        console.error("Full error:", error);
        res.status(500).json({ error: "Failed to get response from AI: " + error.message });
    }
});

app.get("/api/thread", (req, res) => {
    const allThreads = Array.from(threads.values()).map(t => ({
        threadId: t.threadId,
        title: t.title
    }));
    res.json(allThreads);
});

app.get("/api/thread/:threadId", (req, res) => {
    const { threadId } = req.params;
    const thread = threads.get(threadId);
    
    if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
    }
    
    res.json(thread.messages || []);
});

app.delete("/api/thread/:threadId", (req, res) => {
    const { threadId } = req.params;
    threads.delete(threadId);
    res.json({ message: "Thread deleted" });
});

// ===== ANALYTICS ROUTES =====
app.get("/api/analytics/dashboard", (req, res) => {
    // Mock analytics data
    res.json({
        overview: {
            totalConversations: threads.size,
            totalMessages: Array.from(threads.values()).reduce((sum, t) => sum + (t.messages?.length || 0), 0),
            curiosityScore: 75,
            averageFocusLevel: 82
        },
        overallAnalytics: {
            curiosityScore: 75,
            topicDrift: { score: 18, focusLevel: 82 },
            confidencePattern: 68,
            knowledgeGrowth: 45
        },
        recentConversations: Array.from(threads.values()).slice(-5).map(t => ({
            threadId: t.threadId,
            title: t.title,
            messageCount: t.messages?.length || 0,
            analytics: {
                curiosityScore: Math.floor(Math.random() * 40) + 60,
                topicDrift: { focusLevel: Math.floor(Math.random() * 30) + 70 }
            }
        })),
        knowledgeGrowth: [],
        learningStreak: 3,
        topicDistribution: [
            { topic: "general", count: threads.size, percentage: 100 }
        ]
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.log("⚠️  No MONGODB_URI found, using in-memory storage");
            return;
        }
        
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(mongoURI, { 
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📊 Database:", mongoose.connection.name);
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        console.log("🔄 Falling back to in-memory storage");
    }
};

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 ChatZen Backend Server running on port ${PORT}`);
    // Ensure data directory exists
    await ensureDataDir();
    // Connect to DB in background (don't block server startup)
    setTimeout(connectDB, 100);
});


// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });

