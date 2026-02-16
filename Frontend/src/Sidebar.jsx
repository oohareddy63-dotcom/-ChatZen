import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar({ isOpen, onClose }) {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, prevChats, user, onLogout, onShowDashboard} = useContext(MyContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, refreshTrigger]);
    
    // Refresh thread list when prevChats changes (new message sent)
    useEffect(() => {
        if (prevChats.length > 0) {
            getAllThreads();
        }
    }, [prevChats.length]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        if (isMobile && onClose) onClose();
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            if (isMobile && onClose) onClose();
        } catch(err) {
            console.log(err);
        }
    };

    const deleteThread = async (e, threadId) => {
        e.stopPropagation();
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    };

    const formatTitle = (title) => {
        if (!title) return "New Chat";
        return title.length > 25 ? title.substring(0, 25) + "..." : title;
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div className="sidebarOverlay" onClick={onClose}></div>
            )}
            
            <section className={`sidebar ${isMobile ? (isOpen ? 'mobileOpen' : 'mobileClosed') : ''}`}>
                <div className="sidebarHeader">
                    <button onClick={createNewChat} className="newChatBtn">
                        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                        <span>New Chat</span>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    
                    {isMobile && (
                        <button className="closeSidebarBtn" onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                <ul className="history">
                    {allThreads?.map((thread, idx) => (
                        <li 
                            key={idx} 
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                            title={thread.title}
                        >
                            <i className="fa-regular fa-message"></i>
                            <span className="threadTitle">{formatTitle(thread.title)}</span>
                            <i 
                                className="fa-solid fa-trash deleteBtn"
                                onClick={(e) => deleteThread(e, thread.threadId)}
                                title="Delete chat"
                            ></i>
                        </li>
                    ))}
                </ul>
 
                <div className="sidebarFooter">
                    <button className="dashboardBtn" onClick={onShowDashboard}>
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Analytics</span>
                    </button>
                    <div className="userProfile">
                        <div className="userAvatar">
                            <span className="userInitial">{user?.username?.[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div className="userInfo">
                            <span className="userName">{user?.username || "User"}</span>
                            <button className="logoutBtn" onClick={onLogout}>
                                <i className="fa-solid fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Sidebar;