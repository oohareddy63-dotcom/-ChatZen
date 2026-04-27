# ChatZen 🧘

An AI-powered chat application built with React, Node.js, and Ollama. Chat with a local AI assistant, manage multiple conversations, and track your learning patterns through analytics.

![ChatZen](https://img.shields.io/badge/ChatZen-AI%20Chat-green) ![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Ollama](https://img.shields.io/badge/AI-Ollama-orange)

---

## Features

- **User Authentication** — Sign up, log in, session persistence
- **AI Chat** — Powered by Ollama (llama3.2:1b) running locally
- **Conversation History** — Multiple threads saved in sidebar
- **Analytics Dashboard** — Real-time curiosity, focus, and confidence scores based on your messages
- **Responsive Design** — Works on desktop and mobile
- **Deployment Ready** — Configured for Render

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, React Markdown |
| Backend | Node.js, Express 5 |
| AI | Ollama (llama3.2:1b) |
| Database | In-Memory / MongoDB Atlas (optional) |
| Deployment | Render |

---

## Project Structure

```
-ChatZen/
├── Backend/
│   ├── models/
│   │   ├── User.js          # Mongoose user schema
│   │   └── Thread.js        # Mongoose thread schema
│   ├── server-complete.js   # Main server (in-memory + MongoDB)
│   ├── .env                 # Environment variables
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   └── Dashboard/
    │   │       └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── ChatWindow.jsx
    │   ├── Sidebar.jsx
    │   ├── Chat.jsx
    │   └── config.js        # API URL configuration
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com/) installed and running

### 1. Clone the repository

```bash
git clone https://github.com/oohareddy63-dotcom/-ChatZen.git
cd -ChatZen
```

### 2. Install dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 3. Pull the AI model

```bash
ollama pull llama3.2:1b
```

### 4. Configure environment

The `Backend/.env` file is already configured for local development:

```env
PORT=8080
MONGODB_URI=          # leave empty for in-memory storage
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
```

### 5. Run the application

**Terminal 1 — Backend:**
```bash
cd Backend
node server-complete.js
```

**Terminal 2 — Frontend:**
```bash
cd Frontend
node node_modules/vite/bin/vite.js
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/chat` | Send message to AI |
| GET | `/api/thread` | Get all threads |
| GET | `/api/thread/:id` | Get thread messages |
| DELETE | `/api/thread/:id` | Delete thread |
| GET | `/api/analytics/dashboard` | Get analytics data |
| GET | `/health` | Server health check |

---

## Analytics

The dashboard calculates real scores from your actual conversations:

- **Curiosity Score** — % of messages that are questions or exploratory prompts
- **Focus Level** — % of messages with 3+ words (detailed vs one-word queries)
- **Confidence** — % of messages without hedging words like "maybe", "I think", "not sure"
- **Topic Distribution** — Auto-detects Coding, Math, Science, History, Writing, Learning

---

## Deployment on Render

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `Backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

**Environment Variables:**
```
PORT=8080
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri   # optional
```

### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| Root Directory | `Frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## MongoDB (Optional)

By default the app uses in-memory storage. To persist data across restarts, add your MongoDB Atlas connection string to `Backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatzen?retryWrites=true&w=majority
```

---

## Notes

- In-memory storage means data is lost when the server restarts — sign up again after each restart
- Ollama must be running locally for AI responses to work
- The `llama3.2:1b` model (1.3 GB) is used for lower RAM usage — switch to `llama3.2` for better quality if you have 2.3+ GB free RAM

---

## License

MIT
