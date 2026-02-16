import express from "express";
import Thread from "../models/Thread.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import { generateAnalyticsReport } from "../utils/analytics.js";

const router = express.Router();

// Get user dashboard analytics
router.get("/dashboard", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const threads = await Thread.find({ userId: req.userId });
        
        // Calculate overall stats
        const allMessages = threads.flatMap(t => t.messages);
        const overallAnalytics = generateAnalyticsReport(allMessages);
        
        // Get recent conversations analytics
        const recentThreads = threads.slice(-5);
        const conversationBreakdown = recentThreads.map(thread => ({
            threadId: thread.threadId,
            title: thread.title,
            analytics: generateAnalyticsReport(thread.messages),
            messageCount: thread.messages.length,
            lastUpdated: thread.updatedAt
        }));
        
        // Knowledge growth over time
        const knowledgeGrowthData = user.knowledgeGrowth.map(kg => ({
            date: kg.date,
            score: kg.score
        }));
        
        res.json({
            overview: {
                totalConversations: user.totalConversations,
                totalMessages: user.totalMessages,
                curiosityScore: user.curiosityScore,
                averageFocusLevel: Math.round(
                    conversationBreakdown.reduce((sum, c) => 
                        sum + c.analytics.topicDrift.focusLevel, 0) / conversationBreakdown.length || 0
                )
            },
            overallAnalytics,
            recentConversations: conversationBreakdown,
            knowledgeGrowth: knowledgeGrowthData,
            learningStreak: calculateLearningStreak(threads),
            topicDistribution: calculateTopicDistribution(threads)
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: "Failed to get analytics" });
    }
});

// Get specific thread analytics
router.get("/thread/:threadId", verifyToken, async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId, userId: req.userId });
        
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        
        const analytics = generateAnalyticsReport(thread.messages);
        
        res.json({
            threadId: thread.threadId,
            title: thread.title,
            analytics,
            messages: thread.messages.length,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get thread analytics" });
    }
});

// Get user insights and recommendations
router.get("/insights", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const threads = await Thread.find({ userId: req.userId });
        
        const insights = generateInsights(user, threads);
        
        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: "Failed to get insights" });
    }
});

// Helper functions
function calculateLearningStreak(threads) {
    if (threads.length === 0) return 0;
    
    const today = new Date();
    const dates = [...new Set(threads.map(t => 
        new Date(t.updatedAt).toDateString()
    ))].map(d => new Date(d));
    
    dates.sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = today;
    
    for (const date of dates) {
        const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
            streak++;
            currentDate = date;
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateTopicDistribution(threads) {
    const topics = {};
    
    threads.forEach(thread => {
        const topic = thread.topicCategory || "general";
        topics[topic] = (topics[topic] || 0) + 1;
    });
    
    return Object.entries(topics).map(([topic, count]) => ({
        topic,
        count,
        percentage: Math.round((count / threads.length) * 100)
    }));
}

function generateInsights(user, threads) {
    const insights = [];
    
    // Curiosity insight
    if (user.curiosityScore > 70) {
        insights.push({
            type: "strength",
            title: "High Curiosity",
            description: "You ask great exploratory questions! Keep diving deep into topics."
        });
    } else if (user.curiosityScore < 40) {
        insights.push({
            type: "improvement",
            title: "Ask More Questions",
            description: "Try asking 'why' and 'how' questions to deepen your understanding."
        });
    }
    
    // Activity insight
    if (user.totalConversations > 10) {
        insights.push({
            type: "achievement",
            title: "Active Learner",
            description: `You've had ${user.totalConversations} conversations. Great consistency!`
        });
    }
    
    // Topic diversity
    const uniqueTopics = new Set(threads.map(t => t.topicCategory)).size;
    if (uniqueTopics > 3) {
        insights.push({
            type: "strength",
            title: "Diverse Interests",
            description: `You've explored ${uniqueTopics} different topics. Keep broadening your horizons!`
        });
    }
    
    return insights;
}

export default router;
