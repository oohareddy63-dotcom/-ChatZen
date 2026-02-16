/**
 * Conversation Intelligence Analytics
 * Analyzes user conversations to provide insights
 */

// Calculate curiosity score based on question patterns
export const calculateCuriosityScore = (messages) => {
    if (!messages || messages.length === 0) return 0;
    
    const userMessages = messages.filter(m => m.role === "user");
    if (userMessages.length === 0) return 0;
    
    let score = 0;
    const curiosityIndicators = [
        "why", "how", "what if", "explain", "elaborate",
        "compare", "difference", "similarities", "example",
        "pros and cons", "advantages", "disadvantages"
    ];
    
    userMessages.forEach(msg => {
        const content = msg.content.toLowerCase();
        
        // Check for curiosity indicators
        curiosityIndicators.forEach(indicator => {
            if (content.includes(indicator)) score += 2;
        });
        
        // Follow-up questions (shorter messages often indicate follow-ups)
        if (content.length < 50 && content.includes("?")) score += 1;
        
        // Deep dive indicators
        if (content.includes("?") && content.split("?").length > 1) score += 3;
    });
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.round((score / (userMessages.length * 5)) * 100));
};

// Analyze topic drift (focus vs distraction)
export const analyzeTopicDrift = (messages) => {
    if (!messages || messages.length < 3) return { driftScore: 0, topics: [] };
    
    const topics = [];
    const topicKeywords = {
        "programming": ["code", "programming", "function", "variable", "algorithm", "debug"],
        "science": ["science", "physics", "chemistry", "biology", "experiment"],
        "math": ["math", "equation", "calculate", "formula", "number"],
        "writing": ["write", "essay", "paragraph", "grammar", "sentence"],
        "business": ["business", "market", "strategy", "revenue", "customer"],
        "general": ["help", "explain", "tell me", "what is", "how to"]
    };
    
    messages.forEach((msg, index) => {
        if (msg.role !== "user") return;
        
        const content = msg.content.toLowerCase();
        let detectedTopic = "general";
        let maxMatches = 0;
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            const matches = keywords.filter(kw => content.includes(kw)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedTopic = topic;
            }
        }
        
        topics.push({
            timestamp: msg.timestamp || new Date(),
            topic: detectedTopic,
            messageIndex: index
        });
    });
    
    // Calculate drift score
    let driftCount = 0;
    for (let i = 1; i < topics.length; i++) {
        if (topics[i].topic !== topics[i-1].topic) {
            driftCount++;
        }
    }
    
    const driftScore = topics.length > 1 
        ? Math.round((driftCount / (topics.length - 1)) * 100)
        : 0;
    
    return { driftScore, topics };
};

// Calculate confidence pattern
export const calculateConfidencePattern = (messages) => {
    if (!messages || messages.length === 0) return 0;
    
    const userMessages = messages.filter(m => m.role === "user");
    if (userMessages.length === 0) return 0;
    
    let confidenceIndicators = 0;
    const confidentPhrases = [
        "i understand", "that makes sense", "got it", "clear",
        "i see", "makes sense", "understood", "thanks, that helps"
    ];
    
    const uncertainPhrases = [
        "i don't understand", "confused", "not clear", "difficult",
        "complicated", "hard to understand", "can you repeat"
    ];
    
    userMessages.forEach(msg => {
        const content = msg.content.toLowerCase();
        
        confidentPhrases.forEach(phrase => {
            if (content.includes(phrase)) confidenceIndicators += 2;
        });
        
        uncertainPhrases.forEach(phrase => {
            if (content.includes(phrase)) confidenceIndicators -= 2;
        });
    });
    
    // Normalize to 0-100
    const score = 50 + (confidenceIndicators * 5);
    return Math.min(100, Math.max(0, score));
};

// Calculate knowledge growth
export const calculateKnowledgeGrowth = (messages) => {
    if (!messages || messages.length < 4) return 0;
    
    // Simple heuristic: conversation length and complexity increase
    const earlyMessages = messages.slice(0, Math.floor(messages.length / 2));
    const laterMessages = messages.slice(Math.floor(messages.length / 2));
    
    const earlyComplexity = earlyMessages.reduce((sum, m) => 
        sum + (m.content?.length || 0), 0) / earlyMessages.length;
    
    const laterComplexity = laterMessages.reduce((sum, m) => 
        sum + (m.content?.length || 0), 0) / laterMessages.length;
    
    const growth = earlyComplexity > 0 
        ? ((laterComplexity - earlyComplexity) / earlyComplexity) * 100
        : 0;
    
    return Math.round(Math.max(0, growth));
};

// Generate complete analytics report
export const generateAnalyticsReport = (messages, userHistory = []) => {
    const curiosityScore = calculateCuriosityScore(messages);
    const { driftScore, topics } = analyzeTopicDrift(messages);
    const confidencePattern = calculateConfidencePattern(messages);
    const knowledgeGrowth = calculateKnowledgeGrowth(messages);
    
    return {
        curiosityScore,
        topicDrift: {
            score: driftScore,
            topics: topics,
            focusLevel: Math.max(0, 100 - driftScore)
        },
        confidencePattern,
        knowledgeGrowth,
        summary: {
            totalMessages: messages.length,
            userMessages: messages.filter(m => m.role === "user").length,
            assistantMessages: messages.filter(m => m.role === "assistant").length,
            averageMessageLength: Math.round(
                messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) / messages.length
            )
        }
    };
};

// Update user analytics
export const updateUserAnalytics = async (user, threadMessages) => {
    const report = generateAnalyticsReport(threadMessages);
    
    // Update user stats
    user.totalMessages += threadMessages.length;
    user.totalConversations += 1;
    
    // Update curiosity score (rolling average)
    const totalScore = (user.curiosityScore * (user.totalConversations - 1)) + report.curiosityScore;
    user.curiosityScore = Math.round(totalScore / user.totalConversations);
    
    // Add knowledge growth point
    user.knowledgeGrowth.push({
        date: new Date(),
        score: report.knowledgeGrowth
    });
    
    // Keep only last 30 days of growth data
    if (user.knowledgeGrowth.length > 30) {
        user.knowledgeGrowth = user.knowledgeGrowth.slice(-30);
    }
    
    await user.save();
    return report;
};
