# 🚀 ChatZen Complete Setup Guide

## 📋 Prerequisites Checklist

- [ ] Node.js (v18 or higher) installed
- [ ] npm (v9 or higher) installed
- [ ] Git installed
- [ ] MongoDB Atlas account (free tier available)
- [ ] Ollama installed (for local AI) OR OpenAI API key

---

## 🔧 Step-by-Step Setup

### 1️⃣ Install Dependencies

**Backend:**
```bash
cd -ChatZen/Backend
npm install
```

**Frontend:**
```bash
cd -ChatZen/Frontend
npm install
```

---

### 2️⃣ Configure Environment Variables

The `.env` file is already created in `-ChatZen/Backend/.env`. You need to add your credentials:

#### **Required: MongoDB Atlas Setup**

1. **Create MongoDB Atlas Account**
   - Go to: https://cloud.mongodb.com
   - Click "Try Free" and sign up
   - Create a free M0 cluster (takes 3-5 minutes)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `chatzen`

3. **Whitelist Your IP**
   - Go to "Network Access" in MongoDB Atlas
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development

4. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/chatzen?retryWrites=true&w=majority
   ```

#### **Required: AI Service Setup (Choose ONE)**

**Option A: Ollama (Recommended - Free & Local)**

1. **Download Ollama**
   - Visit: https://ollama.com
   - Download for your OS (Windows/Mac/Linux)
   - Install the application

2. **Install AI Model**
   ```bash
   ollama run llama3.2
   ```
   This will download and start the model (first time takes a few minutes)

3. **Verify Ollama is Running**
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **Your .env is already configured for Ollama:**
   ```env
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```

**Option B: OpenAI (Paid - Requires API Key)**

1. **Get API Key**
   - Go to: https://platform.openai.com/api-keys
   - Sign up/Login
   - Create new API key
   - Copy the key (starts with `sk-proj-...`)

2. **Update .env file**
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. **Modify server.js** to use OpenAI instead of Ollama (if needed)

---

### 3️⃣ Start the Application

**Terminal 1 - Backend:**
```bash
cd -ChatZen/Backend
npm run dev
```

You should see:
```
🚀 ChatZen Server running on port 8080
✅ MongoDB Atlas Connected Successfully!
📊 Database: chatzen
```

**Terminal 2 - Frontend:**
```bash
cd -ChatZen/Frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

### 4️⃣ Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

---

## 🔍 Troubleshooting

### ❌ MongoDB Connection Failed

**Error:** `MongoServerError: bad auth`
- **Fix:** Check username/password in connection string
- Ensure database user is created in MongoDB Atlas
- Password should not contain special characters like `@`, `#`, `%`

**Error:** `MongooseServerSelectionError`
- **Fix:** Whitelist your IP address in MongoDB Atlas Network Access
- Try "Allow Access from Anywhere" (0.0.0.0/0)

### ❌ Ollama Not Responding

**Error:** `Failed to get response from AI: fetch failed`
- **Fix:** Make sure Ollama is running
- Run: `ollama run llama3.2`
- Check if Ollama is accessible: `curl http://localhost:11434/api/tags`

**Error:** `model 'llama3.2' not found`
- **Fix:** Download the model: `ollama pull llama3.2`

### ❌ Frontend Can't Connect to Backend

**Error:** `Failed to fetch` or CORS errors
- **Fix:** Ensure backend is running on port 8080
- Check backend terminal for errors
- Verify CORS is configured for `http://localhost:5173`

### ❌ Port Already in Use

**Error:** `EADDRINUSE: address already in use :::8080`
- **Fix:** Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:8080 | xargs kill -9
  ```

---

## 🧪 Testing the Setup

### Test Backend API

```bash
# Test server is running
curl http://localhost:8080/api/thread

# Test chat endpoint
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello", "threadId":"test-123"}'
```

### Test Frontend

1. Open http://localhost:5173
2. You should see the ChatZen interface
3. Type a message and press Enter
4. You should receive an AI response

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Backend server port | `8080` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/chatzen` |
| `OLLAMA_URL` | No* | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | No* | Ollama model name | `llama3.2` |
| `OPENAI_API_KEY` | No* | OpenAI API key | `sk-proj-...` |

*At least one AI service (Ollama or OpenAI) is required

---

## 🎯 Quick Start Commands

```bash
# Complete setup from scratch
cd -ChatZen/Backend && npm install
cd ../Frontend && npm install

# Start both servers (use 2 terminals)
cd -ChatZen/Backend && npm run dev
cd -ChatZen/Frontend && npm run dev
```

---

## 🔐 Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Use strong passwords for MongoDB
- Rotate API keys regularly
- Use environment-specific configurations for production

---

## 📞 Need Help?

If you're still having issues:
1. Check all environment variables are set correctly
2. Ensure all services (MongoDB, Ollama) are running
3. Check terminal logs for specific error messages
4. Verify Node.js and npm versions

---

**You're all set! Happy coding! 🎉**
