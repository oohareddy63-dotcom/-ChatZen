import { useState } from "react";
import "./Auth.css";
import API_URL from "../../config";

function Login({ onLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.message === "Failed to fetch") {
                setError("Cannot connect to server. Please make sure the backend is running on port 8080.");
            } else {
                setError("Network error: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-logo">
                    <span className="logo-icon">🧘</span>
                    <h1>ChatZen</h1>
                    <p>Your AI Conversation Companion</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Welcome Back</h2>
                    
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account?</p>
                    <button onClick={onSwitchToSignup} className="auth-link">
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
