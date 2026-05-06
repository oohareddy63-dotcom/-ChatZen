import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import {v1 as uuidv1} from "uuid";
function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Auth state
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login", "signup", "chat", "dashboard"
  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setAuthView("chat");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthView("chat");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setAuthView("chat");
  };

  const handleLogout = () => {
    // Clear all localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Reset all state
    setUser(null);
    setAuthView("login");
    setPrevChats([]);
    setAllThreads([]);
    setCurrThreadId(uuidv1());
    setPrompt("");
    setReply(null);
    setNewChat(true);
    
    // Force page reload to ensure clean state
    window.location.reload();
  };

  const handleShowDashboard = () => {
    setAuthView("dashboard");
  };

  const handleBackToChat = () => {
    setAuthView("chat");
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, setUser,
    onLogout: handleLogout,
    onShowDashboard: handleShowDashboard
  }; 

  // Render auth views
  if (authView === "login") {
    return (
      <Login 
        onLogin={handleLogin} 
        onSwitchToSignup={() => setAuthView("signup")} 
      />
    );
  }

  if (authView === "signup") {
    return (
      <Signup 
        onSignup={handleSignup} 
        onSwitchToLogin={() => setAuthView("login")} 
      />
    );
  }

  if (authView === "dashboard") {
    return (
      <Dashboard onBackToChat={handleBackToChat} />
    );
  }

  // Main chat view
  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
      </MyContext.Provider>
    </div>
  )
}

export default App
