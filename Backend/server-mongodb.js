import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const threadSchema = new mongoose.Schema({
    threadId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    messages: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Explicitly set collection names
const User = mongoose.model('User', userSchema, 'users');
const Thread = mongoose.model('Thread', threadSchema, 'threads');

// Sample data
const sampleUsers = [
    { username: "demo_user", email: "demo@chatzen.ai", password: "demo123" },
    { username: "test_user", email: "test@test.com", password: "test123" }
];

const sampleThreads = [
    {
        threadId: "thread-001",
        title: "Introduction to AI",
        messages: [
            { role: "user", content: "What is artificial intelligence?" },
            { role: "assistant", content: "Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems." }
        ]
    },
    {
        threadId: "thread-002",
        title: "JavaScript Help",
        messages: [
            { role: "user", content: "How do I create an array in JavaScript?" },
            { role: "assistant", content: "You can create an array using square brackets: const arr = [1, 2, 3];" }
        ]
    }
];

// Seed sample data
const seedData = async () => {
    try {
        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log("🌱 Seeding sample data...");
            
            // Create sample users
            const createdUsers = await User.insertMany(sampleUsers);
            console.log(`✅ Created ${createdUsers.length} sample users`);
            
            // Create sample threads
            for (let i = 0; i < sampleThreads.length; i++) {
                const thread = new Thread({
                    ...sampleThreads[i],
                    userId: createdUsers[i % createdUsers.length]._id
                });
                await thread.save();
            }
            console.log(`✅ Created ${sampleThreads.length} sample threads`);
            console.log("✅ Sample data seeded successfully!");
        } else {
            console.log("ℹ️  Database already has data, skipping seed");
        }
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📁 Collections in database:");
        collections.forEach(col => console.log(`   - ${col.name}`));
        
    } catch (error) {
        console.error("❌ Error seeding data:", error.message);
    }
};

// Routes
app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.json({ message: "Registered", token: "token-" + user._id, user: { id: user._id, username, email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ message: "Login successful", token: "token-" + user._id, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}, 'threadId title');
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/thread/:threadId", async (req, res) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.threadId });
        if (!thread) return res.status(404).json({ error: "Thread not found" });
        res.json(thread.messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Chat endpoint - send message to Ollama
app.post("/api/chat", async (req, res) => {
    try {
        const { message, threadId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        // Get conversation history from MongoDB
        let history = [];
        if (threadId) {
            const thread = await Thread.findOne({ threadId });
            if (thread) {
                history = thread.messages || [];
            }
        }
        
        // Build messages array with history
        const messages = [
            { role: "system", content: "You are a helpful AI assistant." },
            ...history.slice(-6),
            { role: "user", content: message }
        ];
        
        // Call Ollama
        const ollamaUrl = (process.env.OLLAMA_URL || "http://localhost:11434") + "/api/chat";
        const response = await fetch(ollamaUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || "llama3.2",
                messages: messages,
                stream: false
            })
        });
        
        const data = await response.json();
        const reply = data.message?.content || data.response || "Sorry, I couldn't process that.";
        
        // Save to MongoDB
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                messages: [],
                userId: null
            });
        }
        
        thread.messages.push({ role: "user", content: message });
        thread.messages.push({ role: "assistant", content: reply });
        thread.updatedAt = new Date();
        await thread.save();
        
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ error: "Failed to get response from AI: " + error.message });
    }
});

// Analytics endpoint
app.get("/api/analytics/dashboard", async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const threadCount = await Thread.countDocuments();
        const allThreads = await Thread.find({});
        
        // Calculate total messages
        let totalMessages = 0;
        allThreads.forEach(t => {
            totalMessages += t.messages ? t.messages.length : 0;
        });
        
        res.json({
            overview: {
                totalConversations: threadCount,
                totalMessages: totalMessages,
                totalUsers: userCount,
                curiosityScore: 75,
                averageFocusLevel: 82
            },
            recentConversations: allThreads.slice(-5).map(t => ({
                threadId: t.threadId,
                title: t.title,
                messageCount: t.messages ? t.messages.length : 0,
                analytics: {
                    curiosityScore: Math.floor(Math.random() * 40) + 60,
                    topicDrift: { focusLevel: Math.floor(Math.random() * 30) + 70 }
                }
            })),
            knowledgeGrowth: [],
            learningStreak: 3,
            topicDistribution: [
                { topic: "general", count: threadCount, percentage: 100 }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Debug endpoint to see collections
app.get("/api/debug/collections", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        // Get document counts
        const stats = {};
        for (const name of collectionNames) {
            const count = await mongoose.connection.db.collection(name).countDocuments();
            stats[name] = count;
        }
        
        res.json({
            collections: collectionNames,
            documentCounts: stats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log("⚠️  No MONGODB_URI found in .env file");
            return false;
        }
        
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(uri, { 
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📊 Database:", mongoose.connection.name);
        
        // Seed sample data
        await seedData();
        return true;
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        return false;
    }
};

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`🚀 ChatZen Server running on port ${PORT}`);
    await connectDB();
});
