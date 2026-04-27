import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import API_URL from "./config";

function ChatWindow({ onMenuClick }) {
    const { currThreadId, prevChats, setPrevChats, setNewChat, setAllThreads } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [localPrompt, setLocalPrompt] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [prevChats, loading]);

    // Refresh sidebar thread list from server
    const refreshThreads = async () => {
        try {
            const res = await fetch(`${API_URL}/api/thread`);
            const data = await res.json();
            setAllThreads(data.map(t => ({ threadId: t.threadId, title: t.title })));
        } catch (e) {
            console.error("Failed to refresh threads:", e);
        }
    };

    const getReply = async () => {
        if (!localPrompt.trim() || loading) return;

        const userMessage = localPrompt.trim();
        setLocalPrompt("");
        setLoading(true);
        setNewChat(false);

        // Show user message immediately
        setPrevChats(prev => [...prev, { role: "user", content: userMessage }]);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, threadId: currThreadId })
            });

            const data = await response.json();

            if (data.reply) {
                setPrevChats(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                throw new Error(data.error || "No reply received");
            }
        } catch (err) {
            console.error("Chat error:", err);
            let msg = "Something went wrong. Please try again.";
            if (err.message === "Failed to fetch") {
                msg = "Cannot connect to server. Make sure the backend is running.";
            } else if (err.message.includes("Ollama") || err.message.includes("ECONNREFUSED")) {
                msg = "AI service is unavailable. Make sure Ollama is running.";
            }
            setPrevChats(prev => [...prev, {
                role: "assistant",
                content: "⚠️ " + msg
            }]);
        } finally {
            setLoading(false);
            // Always refresh sidebar after a message is sent
            await refreshThreads();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <button className="mobileMenuBtn" onClick={onMenuClick}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <span>ChatZen <i className="fa-solid fa-chevron-down"></i></span>
                </div>
                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }

            <div className="chatContainer" ref={chatContainerRef}>
                <Chat />
            </div>

            {loading && (
                <div className="loadingIndicator">
                    <span>Thinking...</span>
                </div>
            )}

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={localPrompt}
                        onChange={(e) => setLocalPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <div
                        id="submit"
                        onClick={getReply}
                        className={localPrompt.trim() ? "active" : ""}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    ChatZen can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;