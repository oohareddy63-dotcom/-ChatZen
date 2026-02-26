# 🏗️ ChatZen Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                    (Web Browser)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ http://localhost:5173
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • ChatWindow.jsx  - Main chat interface             │  │
│  │  • Sidebar.jsx     - Thread management               │  │
│  │  • Chat.jsx        - Message display                 │  │
│  │  • Dashboard.jsx   - Analytics view                  │  │
│  │  • Auth components - Login/Signup                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                    Port: 5173 (Vite)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ http://localhost:8080/api
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes:                                          │  │
│  │  • POST /api/auth/register  - User registration      │  │
│  │  • POST /api/auth/login     - User login             │  │
│  │  • POST /api/chat           - Send message           │  │
│  │  • GET  /api/thread         - Get all threads        │  │
│  │  • GET  /api/thread/:id     - Get thread messages    │  │
│  │  • DELETE /api/thread/:id   - Delete thread          │  │
│  │  • GET  /api/analytics      - Get analytics data     │  │
│  └──────────────────────────────────────────────────────┘  │
│                    Port: 8080 (Express)                      │
└────────┬───────────────────────────────────┬────────────────┘
         │                                   │
         │ Store/Retrieve Data               │ Get AI Response
         ▼                                   ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│   DATABASE              │    │   AI SERVICE                  │
│   (MongoDB Atlas)       │    │                               │
│                         │    │  Option 1: Ollama (Local)     │
│  Collections:           │    │  • http://localhost:11434     │
│  • users                │    │  • Model: llama3.2            │
│  • threads              │    │  • Free & Private             │
│                         │    │                               │
│  Connection:            │    │  Option 2: OpenAI (Cloud)     │
│  mongodb+srv://...      │    │  • api.openai.com             │
│                         │    │  • Model: gpt-4o-mini         │
│  Stores:                │    │  • Paid API                   │
│  • User accounts        │    │                               │
│  • Chat threads         │    │  Option 3: Google Gemini      │
│  • Message history      │    │  • generativelanguage.google  │
│  • Analytics data       │    │  • Free tier available        │
└─────────────────────────┘    └──────────────────────────────┘
```

## Data Flow

### 1. User Sends Message
```
User types message
    ↓
ChatWindow.jsx captures input
    ↓
POST /api/chat { message, threadId }
    ↓
Backend receives request
    ↓
Fetch conversation history from MongoDB
    ↓
Send to AI service (Ollama/OpenAI)
    ↓
Receive AI response
    ↓
Save to MongoDB
    ↓
Return response to frontend
    ↓
Display in Chat.jsx
```

### 2. User Authentication
```
User enters credentials
    ↓
Login.jsx/Signup.jsx
    ↓
POST /api/auth/login or /api/auth/register
    ↓
Backend validates credentials
    ↓
Check/Create user in MongoDB
    ↓
Generate token
    ↓
Return token + user data
    ↓
Store in React Context
    ↓
Redirect to Dashboard
```

### 3. Thread Management
```
User clicks "New Chat"
    ↓
Generate unique threadId (UUID)
    ↓
Create new thread in state
    ↓
First message creates thread in MongoDB
    ↓
Thread appears in Sidebar
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Context** - State management
- **React Markdown** - Message formatting
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment config
- **CORS** - Cross-origin requests

### Database
- **MongoDB Atlas** - Cloud database
- **Collections**: users, threads
- **Indexes**: threadId, userId

### AI Services
- **Ollama** - Local AI (recommended)
- **OpenAI** - Cloud AI (alternative)
- **Google Gemini** - Cloud AI (alternative)

## Environment Configuration

```
.env file location: -ChatZen/Backend/.env

Required Variables:
├── MONGODB_URI      → Database connection
└── AI Service (one of):
    ├── OLLAMA_URL + OLLAMA_MODEL
    ├── OPENAI_API_KEY
    └── GEMINI_API_KEY

Optional Variables:
└── PORT             → Backend port (default: 8080)
```

## File Structure

```
-ChatZen/
├── Backend/
│   ├── models/
│   │   ├── User.js          → User schema
│   │   └── Thread.js        → Thread schema
│   ├── middleware/
│   │   └── auth.js          → Authentication
│   ├── utils/
│   │   ├── openai.js        → AI integration
│   │   ├── fileDB.js        → Fallback storage
│   │   └── analytics.js     → Analytics logic
│   ├── .env                 → Environment config
│   ├── server.js            → Main server (in-memory)
│   ├── server-mongodb.js    → MongoDB version
│   └── package.json         → Dependencies
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   └── Dashboard/
│   │   │       └── Dashboard.jsx
│   │   ├── ChatWindow.jsx   → Main interface
│   │   ├── Sidebar.jsx      → Thread list
│   │   ├── Chat.jsx         → Messages
│   │   ├── MyContext.jsx    → State management
│   │   └── main.jsx         → Entry point
│   ├── vite.config.js       → Vite config
│   └── package.json         → Dependencies
│
└── Documentation/
    ├── START_HERE.md
    ├── SETUP_GUIDE.md
    ├── QUICK_REFERENCE.md
    └── This file (ARCHITECTURE.md)
```

## API Endpoints Reference

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account | {username, email, password} |
| POST | /api/auth/login | Login | {email, password} |
| POST | /api/chat | Send message | {message, threadId} |
| GET | /api/thread | List threads | - |
| GET | /api/thread/:id | Get messages | - |
| DELETE | /api/thread/:id | Delete thread | - |
| GET | /api/analytics/dashboard | Get stats | - |

## Security Considerations

1. **Passwords**: Currently stored in plain text (use bcrypt in production)
2. **Authentication**: Simple token-based (use JWT in production)
3. **CORS**: Configured for localhost (restrict in production)
4. **Environment**: Sensitive data in .env (never commit)
5. **API Keys**: Stored server-side only (never expose to frontend)

## Deployment Considerations

### Frontend (Vercel/Netlify)
- Build: `npm run build`
- Output: `dist/` folder
- Environment: Update API URL

### Backend (Heroku/Railway/Render)
- Set environment variables
- Use production MongoDB cluster
- Enable HTTPS
- Configure CORS for production domain

---

**This architecture provides a scalable, maintainable chat application! 🚀**
