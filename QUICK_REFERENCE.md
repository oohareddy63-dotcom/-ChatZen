# ⚡ ChatZen Quick Reference

## 🔗 Links You Need

### 1. MongoDB Atlas (Database)
- **Sign Up**: https://cloud.mongodb.com
- **What you need**: Connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/chatzen`

### 2. Ollama (Local AI - Recommended)
- **Download**: https://ollama.com
- **Install Model**: `ollama run llama3.2`
- **Check Status**: `curl http://localhost:11434/api/tags`

### 3. OpenAI (Alternative AI - Paid)
- **API Keys**: https://platform.openai.com/api-keys
- **What you need**: API key starting with `sk-proj-`
- **Pricing**: https://openai.com/pricing

### 4. Google Gemini (Alternative AI)
- **API Keys**: https://makersuite.google.com/app/apikey
- **What you need**: API key starting with `AIzaSy`

---

## 📝 Your .env File Template

```env
# Server
PORT=8080

# Database (REQUIRED)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/chatzen?retryWrites=true&w=majority

# AI Service (Choose ONE)
# Option 1: Ollama (Free, Local)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Option 2: OpenAI (Paid)
# OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# Option 3: Google Gemini (Paid)
# GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
```

---

## 🚀 Start Commands

```bash
# Terminal 1 - Backend
cd -ChatZen/Backend
npm run dev

# Terminal 2 - Frontend  
cd -ChatZen/Frontend
npm run dev
```

---

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Test Endpoint**: http://localhost:8080/api/thread

---

## ✅ Success Indicators

### Backend Started Successfully:
```
🚀 ChatZen Server running on port 8080
✅ MongoDB Atlas Connected Successfully!
📊 Database: chatzen
```

### Frontend Started Successfully:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Ollama Running:
```bash
ollama list
# Should show llama3.2 in the list
```

---

## 🔧 Common Fixes

### MongoDB Not Connecting
1. Check username/password in connection string
2. Whitelist IP: 0.0.0.0/0 in Network Access
3. Ensure database user exists

### Ollama Not Working
1. Install: Download from https://ollama.com
2. Run model: `ollama run llama3.2`
3. Verify: `curl http://localhost:11434/api/tags`

### Port 8080 Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

---

## 📦 Installation Commands

```bash
# Install Node.js dependencies
cd -ChatZen/Backend && npm install
cd -ChatZen/Frontend && npm install

# Install Ollama (after downloading from ollama.com)
ollama pull llama3.2
ollama run llama3.2
```

---

## 🎯 Minimum Requirements

- ✅ Node.js v18+
- ✅ MongoDB Atlas account (free)
- ✅ Ollama installed OR OpenAI API key
- ✅ Ports 8080 and 5173 available

---

**That's it! You're ready to go! 🎉**
