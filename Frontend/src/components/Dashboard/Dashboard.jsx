import { useState, useEffect } from "react";
import "./Dashboard.css";
import API_URL from "../../config";

function Dashboard({ onBackToChat }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/analytics/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            } else {
                setError("Failed to load analytics");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return "#10a37f";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    const getScoreLabel = (score) => {
        if (score >= 70) return "High";
        if (score >= 40) return "Moderate";
        return "Low";
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Loading your insights...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-error">
                    <p>{error}</p>
                    <button onClick={fetchDashboardData}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="dashboard-icon">📊</span>
                    <div>
                        <h1>Conversation Intelligence</h1>
                        <p>Insights into your learning journey</p>
                    </div>
                </div>
                <button className="back-to-chat" onClick={onBackToChat}>
                    ← Back to Chat
                </button>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === "overview" ? "active" : ""}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button 
                    className={activeTab === "conversations" ? "active" : ""}
                    onClick={() => setActiveTab("conversations")}
                >
                    Conversations
                </button>
                <button 
                    className={activeTab === "growth" ? "active" : ""}
                    onClick={() => setActiveTab("growth")}
                >
                    Growth
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === "overview" && (
                    <div className="overview-tab">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💬</div>
                                <div className="stat-info">
                                    <h3>{analytics?.overview?.totalConversations || 0}</h3>
                                    <p>Total Conversations</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📝</div>
                                <div className="stat-info">
                                    <h3>{analytics?.overview?.totalMessages || 0}</h3>
                                    <p>Total Messages</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🔥</div>
                                <div className="stat-info">
                                    <h3>{analytics?.learningStreak || 0}</h3>
                                    <p>Day Streak</p>
                                </div>
                            </div>
                        </div>

                        {/* Score Cards */}
                        <div className="scores-grid">
                            <div className="score-card">
                                <h4>Curiosity Score</h4>
                                <div className="score-circle" style={{
                                    background: `conic-gradient(${getScoreColor(analytics?.overview?.curiosityScore || 0)} ${(analytics?.overview?.curiosityScore || 0) * 3.6}deg, #333 0deg)`
                                }}>
                                    <span>{analytics?.overview?.curiosityScore || 0}</span>
                                </div>
                                <p className="score-label" style={{ color: getScoreColor(analytics?.overview?.curiosityScore || 0) }}>
                                    {getScoreLabel(analytics?.overview?.curiosityScore || 0)}
                                </p>
                                <small>How exploratory your questions are</small>
                            </div>

                            <div className="score-card">
                                <h4>Focus Level</h4>
                                <div className="score-circle" style={{
                                    background: `conic-gradient(${getScoreColor(analytics?.overview?.averageFocusLevel || 0)} ${(analytics?.overview?.averageFocusLevel || 0) * 3.6}deg, #333 0deg)`
                                }}>
                                    <span>{analytics?.overview?.averageFocusLevel || 0}</span>
                                </div>
                                <p className="score-label" style={{ color: getScoreColor(analytics?.overview?.averageFocusLevel || 0) }}>
                                    {getScoreLabel(analytics?.overview?.averageFocusLevel || 0)}
                                </p>
                                <small>Topic consistency vs drift</small>
                            </div>

                            <div className="score-card">
                                <h4>Confidence</h4>
                                <div className="score-circle" style={{
                                    background: `conic-gradient(${getScoreColor(analytics?.overallAnalytics?.confidencePattern || 0)} ${(analytics?.overallAnalytics?.confidencePattern || 0) * 3.6}deg, #333 0deg)`
                                }}>
                                    <span>{analytics?.overallAnalytics?.confidencePattern || 0}</span>
                                </div>
                                <p className="score-label" style={{ color: getScoreColor(analytics?.overallAnalytics?.confidencePattern || 0) }}>
                                    {getScoreLabel(analytics?.overallAnalytics?.confidencePattern || 0)}
                                </p>
                                <small>Understanding indicators</small>
                            </div>
                        </div>

                        {/* Topic Distribution */}
                        {analytics?.topicDistribution?.length > 0 && (
                            <div className="topic-distribution">
                                <h3>Topic Distribution</h3>
                                <div className="topic-bars">
                                    {analytics.topicDistribution.map((topic, idx) => (
                                        <div key={idx} className="topic-bar-item">
                                            <div className="topic-bar-header">
                                                <span className="topic-name">{topic.topic}</span>
                                                <span className="topic-percent">{topic.percentage}%</span>
                                            </div>
                                            <div className="topic-bar-bg">
                                                <div 
                                                    className="topic-bar-fill"
                                                    style={{ width: `${topic.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "conversations" && (
                    <div className="conversations-tab">
                        <h3>Recent Conversations</h3>
                        <div className="conversations-list">
                            {analytics?.recentConversations?.map((conv, idx) => (
                                <div key={idx} className="conversation-item">
                                    <div className="conv-header">
                                        <h4>{conv.title}</h4>
                                        <span className="conv-date">
                                            {new Date(conv.lastUpdated).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="conv-stats">
                                        <span>{conv.messageCount} messages</span>
                                        <span className="conv-score">
                                            Curiosity: {conv.analytics.curiosityScore}
                                        </span>
                                        <span className="conv-score">
                                            Focus: {conv.analytics.topicDrift.focusLevel}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "growth" && (
                    <div className="growth-tab">
                        <h3>Knowledge Growth</h3>
                        {analytics?.knowledgeGrowth?.length > 0 ? (
                            <div className="growth-chart">
                                <div className="growth-line">
                                    {analytics.knowledgeGrowth.map((point, idx) => (
                                        <div 
                                            key={idx}
                                            className="growth-point"
                                            style={{ 
                                                left: `${(idx / (analytics.knowledgeGrowth.length - 1)) * 100}%`,
                                                bottom: `${Math.max(0, Math.min(100, point.score))}%`
                                            }}
                                            title={`${new Date(point.date).toLocaleDateString()}: ${point.score}`}
                                        />
                                    ))}
                                </div>
                                <div className="growth-labels">
                                    <span>Start</span>
                                    <span>Now</span>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">Not enough data yet. Keep chatting to see your growth!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
