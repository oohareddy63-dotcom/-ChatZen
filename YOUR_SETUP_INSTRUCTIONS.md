# 🎯 Your Personal Setup Instructions

## ✅ MongoDB Configuration - DONE!

Your MongoDB connection string has been added to the .env file!

**What you need to do:**
1. Replace `<db_password>` in the .env file with your actual MongoDB password
2. Make sure your IP is whitelisted in MongoDB Atlas

---

## 📝 Step 1: Update Your Password

Open: `-ChatZen/Backend/.env`

Find this line:
```env
MONGODB_URI=mongodb+srv://oohareddy6362_db_user:<db_password>@gpt.j0xqbvw.mongodb.net/chatzen?retryWrites=true&w=majority&appName=gpt
```

Replace `<db_password>` with your actual password:
```env
MONGODB_URI=mongodb+srv://oohareddy6362_db_user:YourActualPassword@gpt.j0xqbvw.mongodb.net/chatzen?retryWrites=true&w=majority&appName=gpt
```

**Important**: If your password contains special characters like @, #, %, you need to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

Example: If password is `MyP@ss#123`, use `MyP%40ss%23123`

---

## 🔐 Step 2: Whitelist Your IP in MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click on "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"
7. Wait 2-3 minutes for changes to apply

---

## 🤖 Step 3: Setup AI Service (Choose ONE)

### Option A: Ollama (Recommended - Free & Local)

**Already configured in your .env!**

Just install and run:
```bash
# Download from: https://ollama.com
# After installation, run:
ollama run llama3.2
```

Keep this terminal open while using ChatZen!

### Option B: OpenAI (Alternative - Paid)

If you prefer OpenAI:
1. Get API key from: https://platform.openai.com/api-keys
2. Open `-ChatZen/Backend/.env`
3. Add this line:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

---

## 🚀 Step 4: Install Dependencies

Open terminal and run:

```bash
# Install backend dependencies
cd -ChatZen/Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

---

## ▶️ Step 5: Start the Application

**Terminal 1 - Start Backend:**
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

**Terminal 2 - Start Frontend:**
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

## 🌐 Step 6: Open and Test

1. Open your browser
2. Go to: http://localhost:5173
3. Type a message in the chat
4. You should receive an AI response!

---

## ✅ Success Checklist

- [ ] Replaced `<db_password>` with actual password in .env
- [ ] Whitelisted IP (0.0.0.0/0) in MongoDB Atlas
- [ ] Ollama installed and running OR OpenAI API key added
- [ ] Ran `npm install` in Backend folder
- [ ] Ran `npm install` in Frontend folder
- [ ] Backend started successfully (port 8080)
- [ ] Frontend started successfully (port 5173)
- [ ] Can send messages and receive AI responses

---

## 🔧 Troubleshooting

### ❌ "MongoServerError: bad auth"
**Fix**: Check your password in the .env file. Make sure special characters are URL-encoded.

### ❌ "MongooseServerSelectionError"
**Fix**: Whitelist your IP in MongoDB Atlas Network Access (0.0.0.0/0)

### ❌ "Failed to get response from AI"
**Fix**: 
- If using Ollama: Run `ollama run llama3.2`
- If using OpenAI: Check your API key is correct

### ❌ "Port 8080 already in use"
**Fix**: 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change PORT in .env to 3000
```

---

## 📋 Your Configuration Summary

**Database**: MongoDB Atlas
- Cluster: gpt.j0xqbvw.mongodb.net
- Database: chatzen
- User: oohareddy6362_db_user

**AI Service**: Ollama (llama3.2) - Already configured
- URL: http://localhost:11434
- Model: llama3.2

**Ports**:
- Backend: 8080
- Frontend: 5173

---

## 🎯 Quick Commands Reference

```bash
# Start everything (use 2 terminals)
cd -ChatZen/Backend && npm run dev
cd -ChatZen/Frontend && npm run dev

# If using Ollama (keep running in background)
ollama run llama3.2

# Test backend is working
curl http://localhost:8080/api/thread

# Test Ollama is working
curl http://localhost:11434/api/tags
```

---

## 📞 Need More Help?

Check these files:
- **TROUBLESHOOTING.md** - Common issues and solutions
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_REFERENCE.md** - All commands and links

---

**You're almost there! Just replace the password and you're ready to go! 🚀**
