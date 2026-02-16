import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// Simple test route
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Simple auth route
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    // For testing - accept any credentials
    res.json({
        message: "Login successful",
        token: "test-token-123",
        user: {
            id: "123",
            username: "TestUser",
            email: email
        }
    });
});

app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;
    
    res.json({
        message: "Registration successful",
        token: "test-token-123",
        user: {
            id: "123",
            username: username,
            email: email
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
