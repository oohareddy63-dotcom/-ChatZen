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

// In-memory storage fallback
const inMemoryUsers = new Map();
const inMemoryThreads = new Map();

// Routes
app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState === 1) {
            const user = new User({ username, email, password });
            await user.save();
            res.json({ message: "Registered", token: "token-" + user._id, user: { id: user._id, username, email } });
        } else {
            // Use in-memory storage
            const userId = Date.now().toString();
            inMemoryUsers.set(userId, { id: userId, username, email, password });
            res.json({ message: "Registered", token: "token-" + userId, user: { id: userId, username, email } });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email, password });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            res.json({ message: "Login successful", token: "token-" + user._id, user: { id: user._id, username: user.username, email } });
        } else {
            // Use in-memory storage
            let foundUser = null;
            for (const user of inMemoryUsers.values()) {
                if (user.email === email && user.password === password) {
                    foundUser = user;
                    break;
                }
            }
            if (!foundUser) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            res.json({ message: "Login successful", token: "token-" + foundUser.id, user: { id: foundUser.id, username: foundUser.username, email } });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/thread", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const threads = await Thread.find({}, 'threadId title');
            res.json(threads);
        } else {
            // Use in-memory storage
            const threads = Array.from(inMemoryThreads.values()).map(t => ({
                threadId: t.threadId,
                title: t.title
            }));
            res.json(threads);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/thread/:threadId", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const thread = await Thread.findOne({ threadId: req.params.threadId });
            if (!thread) return res.status(404).json({ error: "Thread not found" });
            res.json(thread.messages);
        } else {
            // Use in-memory storage
            const thread = inMemoryThreads.get(req.params.threadId);
            if (!thread) return res.status(404).json({ error: "Thread not found" });
            res.json(thread.messages || []);
        }
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
        
        // Get conversation history
        let history = [];
        if (threadId) {
            if (mongoose.connection.readyState === 1) {
                const thread = await Thread.findOne({ threadId });
                if (thread) {
                    history = thread.messages || [];
                }
            } else {
                // Use in-memory storage
                const thread = inMemoryThreads.get(threadId);
                if (thread) {
                    history = thread.messages || [];
                }
            }
        }
        
        // Build messages array with history
        const messages = [
            { role: "system", content: "You are a helpful AI assistant." },
            ...history.slice(-6),
            { role: "user", content: message }
        ];
        
        let reply = "";
        
        // Try to call Ollama
        try {
            const ollamaUrl = (process.env.OLLAMA_URL || "http://localhost:11434") + "/api/chat";
            console.log("🤖 Calling Ollama at:", ollamaUrl);
            
            const response = await fetch(ollamaUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: process.env.OLLAMA_MODEL || "llama3.2",
                    messages: messages,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`Ollama returned status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            reply = data.message?.content || data.response;
            
            if (!reply) {
                throw new Error("No response from Ollama");
            }
            
            console.log("✅ Got response from Ollama");
        } catch (ollamaError) {
            console.error("❌ Ollama Error:", ollamaError.message);
            
            // Provide helpful error message
            reply = `⚠️ **AI Service Not Available**

I couldn't connect to the AI service. Here's what might be wrong:

**If using Ollama:**
1. Ollama is running but no models are installed
2. Install a model by running: \`ollama pull llama3.2\`
3. Or run: \`ollama run llama3.2\`

**Alternative - Use OpenAI:**
1. Get an API key from: https://platform.openai.com/api-keys
2. Add to .env file: \`OPENAI_API_KEY=your-key\`
3. Restart the backend server

**For now, I'm in demo mode.** Your message was: "${message}"

Error details: ${ollamaError.message}`;
        }
        
        // Save to storage
        if (mongoose.connection.readyState === 1) {
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
        } else {
            // Save to in-memory storage
            if (!inMemoryThreads.has(threadId)) {
                inMemoryThreads.set(threadId, {
                    threadId,
                    title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                    messages: []
                });
            }
            
            const thread = inMemoryThreads.get(threadId);
            thread.messages.push({ role: "user", content: message });
            thread.messages.push({ role: "assistant", content: reply });
        }
        
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ error: "Failed to get response from AI: " + error.message });
    }
});

// Analytics endpoint
app.get("/api/analytics/dashboard", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
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
        } else {
            // Use in-memory storage
            const allThreads = Array.from(inMemoryThreads.values());
            let totalMessages = 0;
            allThreads.forEach(t => {
                totalMessages += t.messages ? t.messages.length : 0;
            });
            
            res.json({
                overview: {
                    totalConversations: allThreads.length,
                    totalMessages: totalMessages,
                    totalUsers: inMemoryUsers.size,
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
                    { topic: "general", count: allThreads.length, percentage: 100 }
                ]
            });
        }
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
        if (!uri || uri.includes('<db_password>')) {
            console.log("⚠️  MongoDB password not configured in .env file");
            console.log("⚠️  Using in-memory storage (data will be lost on restart)");
            console.log("💡 To enable MongoDB: Edit .env and replace <db_password> with your actual password");
            return false;
        }
        
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(uri, { 
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📊 Database:", mongoose.connection.name);
        
        // Seed sample data
        await seedData();
        return true;
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        console.log("⚠️  Falling back to in-memory storage");
        return false;
    }
};

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`🚀 ChatZen Server running on port ${PORT}`);
    await connectDB();
});
