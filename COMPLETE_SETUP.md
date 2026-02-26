# 🚀 ChatZen Complete Setup Guide

## ⚠️ CRITICAL: Fix These 2 Things First!

### 1️⃣ Fix MongoDB Password

Your `.env` file has `<db_password>` placeholder. You need to replace it with your actual password!

**Steps:**
1. Open `-ChatZen/Backend/.env`
2. Find this line:
   ```
   MONGODB_URI=mongodb+srv://oohareddy6362_db_user:<db_password>@gpt.j0xqbvw.mongodb.net/chatzen?retryWrites=true&w=majority&appName=gpt
   ```
3. Replace `<db_password>` with your actual MongoDB password
4. Save the file

**Example:**
```env
# Before (WRONG):
MONGODB_URI=mongodb+srv://oohareddy6362_db_user:<db_password>@gpt.j0xqbvw.mongodb.net/chatzen?retryWrites=true&w=majority&appName=gpt

# After (CORRECT):
MONGODB_URI=mongodb+srv://oohareddy6362_db_user:MyActualPassword123@gpt.j0xqbvw.mongodb.net/chatzen?retryWrites=true&w=majority&appName=gpt
```

### 2️⃣ Install Ollama Model

**Option A: Double-click the batch file (Easiest)**
- Double-click: `-ChatZen/install-ollama-model.bat`
- Wait 2-3 minutes for download
- Done!

**Option B: Manual command**
```bash
ollama pull llama3.2
```

---

## ✅ Complete Setup Checklist

### Step 1: Fix MongoDB Connection
- [ ] Open `-ChatZen/Backend/.env`
- [ ] Replace `<db_password>` with your actual password
- [ ] Save the file

### Step 2: Install Ollama Model
- [ ] Run `install-ollama-model.bat` OR
- [ ] Run `ollama pull llama3.2` in terminal
- [ ] Wait for download to complete

### Step 3: Start Backend Server
```bash
cd Backend
npm start
```

Should see:
```
🚀 ChatZen Backend Server running on port 8080
✅ MongoDB Atlas Connected Successfully!
```

### Step 4: Start Frontend
Open new terminal:
```bash
cd Frontend
npm run dev
```

Should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 5: Test Everything
1. Open http://localhost:5173
2. Sign up / Login
3. Send a message
4. Get AI response! 🎉

---

## 🔍 Verify Everything is Working

### Check Ollama
Run: `-ChatZen/check-ollama.bat`

Should show:
```
{"models":[{"name":"llama3.2",...}]}
```

### Check Backend
Backend terminal should show:
```
✅ MongoDB Atlas Connected Successfully!
```

If you see:
```
❌ MongoDB Connection Error: Authentication failed
```
→ Your password is wrong! Fix it in `.env`

### Check Frontend
Open http://localhost:5173 - should load without errors

---

## 🚨 Common Issues & Fixes

### Issue 1: "Authentication failed" (MongoDB)
**Problem**: Wrong password in `.env`

**Fix**:
1. Go to https://cloud.mongodb.com
2. Database Access → Find your user
3. Edit User → Reset Password
4. Copy new password
5. Update `.env` file
6. Restart backend

### Issue 2: "Sorry, I couldn't process that" (Ollama)
**Problem**: No model installed

**Fix**:
```bash
ollama pull llama3.2
```

### Issue 3: Backend won't start
**Problem**: Port 8080 already in use

**Fix**:
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=8081
```

### Issue 4: Frontend won't start
**Problem**: Port 5173 already in use

**Fix**:
```bash
# Kill the process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📋 Quick Reference

### Important Files
- **Backend .env**: `-ChatZen/Backend/.env` (MongoDB password here!)
- **Backend server**: `-ChatZen/Backend/server.js`
- **Frontend**: `-ChatZen/Frontend/src/`

### Important URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Ollama**: http://localhost:11434
- **MongoDB**: https://cloud.mongodb.com

### Quick Commands
```bash
# Check Ollama models
ollama list

# Install Ollama model
ollama pull llama3.2

# Test Ollama
ollama run llama3.2

# Start backend
cd Backend && npm start

# Start frontend
cd Frontend && npm run dev
```

---

## 🎯 What Each Component Does

### Backend (Port 8080)
- Handles authentication (login/signup)
- Manages chat threads
- Connects to MongoDB for data storage
- Calls Ollama for AI responses

### Frontend (Port 5173)
- User interface
- Chat window
- Sidebar with threads
- Dashboard

### MongoDB Atlas
- Stores users
- Stores chat threads
- Stores messages

### Ollama (Port 11434)
- Local AI model
- Processes chat messages
- Generates responses

---

## ✅ Success Indicators

### Everything Working:
1. Backend shows: `✅ MongoDB Atlas Connected Successfully!`
2. Frontend loads at http://localhost:5173
3. Can sign up / login
4. Can send messages
5. Get AI responses (not error messages)

### Ollama Working:
```bash
ollama list
# Shows: llama3.2
```

### MongoDB Working:
Backend terminal shows:
```
✅ MongoDB Atlas Connected Successfully!
📊 Database: chatzen
```

---

## 🆘 Still Not Working?

### Step-by-Step Debug:

1. **Check Ollama**
   ```bash
   ollama list
   ```
   If empty → Run `ollama pull llama3.2`

2. **Check MongoDB Password**
   - Open `.env`
   - Make sure `<db_password>` is replaced
   - No spaces, no quotes

3. **Check Backend**
   - Look at terminal output
   - Any red error messages?
   - Share them for help

4. **Check Frontend**
   - Open browser console (F12)
   - Any errors?
   - Share them for help

---

## 🎉 Final Steps

Once everything is working:

1. **Test the chat**
   - Send: "Hello, how are you?"
   - Should get a real AI response

2. **Create multiple threads**
   - Click "New Chat" in sidebar
   - Each thread saves separately

3. **Check dashboard**
   - View analytics
   - See conversation stats

---

## 📞 Need More Help?

If you're still stuck, provide:
1. Backend terminal output
2. Frontend browser console errors
3. Result of `ollama list`
4. MongoDB connection error (if any)

---

**Remember: The two most common issues are:**
1. **MongoDB password not replaced in .env** → Fix it!
2. **Ollama model not installed** → Run `ollama pull llama3.2`

**Once these are fixed, ChatZen will work perfectly! 🚀**
