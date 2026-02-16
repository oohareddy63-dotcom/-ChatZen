import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";

function ChatWindow({ onMenuClick }) {
    const {currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
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

    const getReply = async () => {
        if (!localPrompt.trim() || loading) return;
        
        const userMessage = localPrompt.trim();
        setLocalPrompt("");
        setLoading(true);
        
        // Add user message immediately
        setPrevChats(prev => [...prev, { role: "user", content: userMessage }]);

        try {
            const response = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, threadId: currThreadId })
            });
            
            const data = await response.json();
            
            if (data.reply) {
                setPrevChats(prev => [...prev, { role: "assistant", content: data.reply }]);
                setNewChat(false);
            } else {
                throw new Error("No reply");
            }
        } catch(err) {
            console.error("Error:", err);
            setPrevChats(prev => [...prev, { 
                role: "assistant", 
                content: "Error: " + err.message
            }]);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    }

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

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
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
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
    )
}

export default ChatWindow;