import "./Chat.css";
import React, { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {newChat, prevChats} = useContext(MyContext);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats]);

    // Welcome screen suggestions
    const suggestions = [
        "Explain quantum computing in simple terms",
        "Write a Python function to sort a list",
        "Help me write a professional email",
        "What are the benefits of meditation?"
    ];

    return (
        <div className="chats">
            {newChat && prevChats.length === 0 && (
                <div className="welcomeScreen">
                    <h1>What can I help you with?</h1>
                    <div className="suggestions">
                        {suggestions.map((suggestion, idx) => (
                            <div key={idx} className="suggestionCard">
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {prevChats.map((chat, idx) => (
                <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                    {chat.role === "user" ? (
                        <p className="userMessage">{chat.content}</p>
                    ) : (
                        <div className="assistantMessage">
                            <div className="assistantAvatar">
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <div className="messageContent">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {chat.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default Chat;