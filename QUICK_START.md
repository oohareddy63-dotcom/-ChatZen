# ChatZen - Quick Start Guide

## ✅ Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org)
2. **Ollama** (optional, for AI features) - [Download](https://ollama.com)

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Setup
```bash
test-setup.bat
```
This will check all requirements and install dependencies if needed.

### Step 2: Start ChatZen
```bash
start-chatzen.bat
```
This will start both backend and frontend servers.

### Step 3: Open Browser
Open [http://localhost:5173](http://localhost:5173)

## 📝 Default Credentials

For testing, you can create any account. The app uses in-memory storage by default.

Example:
- Username: `demo`
- Email: `demo@test.com`
- Password: `demo123`

## 🤖 AI Features

### Option 1: Ollama (Recommended - Free & Local)
```bash
# Install Ollama from https://ollama.com
# Then run:
ollama pull llama3.2
```

### Option 2: OpenAI (Paid)
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Edit `Backend/.env`
3. Add: `OPENAI_API_KEY=your-key-here`
4. Restart backend

## 🔧 Configuration

### In-Memory Mode (Default)
- No database required
- Data resets on server restart
- Perfect for testing

### MongoDB Mode (Optional)
1. Create free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Edit `Backend/.env`
4. Set `MONGODB_URI=your-connection-string`
5. Change `Backend/package.json` start script to `server-mongodb.js`

## 📂 Project Structure

```
-ChatZen/
├── Backend/          # Express.js API server
│   ├── server.js     # In-memory mode (default)
│   └── .env          # Configuration
├── Frontend/         # React + Vite app
└── start-chatzen.bat # Startup script
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8080 is available
- Run: `netstat -ano | findstr :8080`
- Kill process if needed

### Frontend won't start
- Check if port 5173 is available
- Run: `netstat -ano | findstr :5173`

### AI not responding
- Make sure Ollama is running: `ollama serve`
- Check model is installed: `ollama list`
- Or add OpenAI API key to `.env`

### "Cannot connect to server" error
- Make sure backend is running on port 8080
- Check backend terminal for errors
- Verify `.env` file exists

## 📊 Features

- ✅ User authentication (register/login)
- ✅ Multiple chat threads
- ✅ Conversation history
- ✅ Analytics dashboard
- ✅ Markdown support in responses
- ✅ Code syntax highlighting
- ✅ Mobile responsive design

## 🔄 Development Mode

### Backend (with auto-reload)
```bash
cd Backend
npm run dev
```

### Frontend (with hot-reload)
```bash
cd Frontend
npm run dev
```

## 📝 Notes

- First time setup may take 2-3 minutes to install dependencies
- Ollama model download is ~2GB (one-time)
- In-memory mode is perfect for development and testing
- MongoDB is only needed if you want persistent data

## 🆘 Need Help?

Check these files:
- `TROUBLESHOOTING.md` - Common issues and solutions
- `ENV_VARIABLES_EXPLAINED.md` - Configuration details
- `ARCHITECTURE.md` - Technical overview

## 🎉 You're Ready!

Run `start-chatzen.bat` and start chatting!
