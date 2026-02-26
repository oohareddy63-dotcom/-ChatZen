# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🔴 MongoDB Connection Issues

#### Error: "MongoServerError: bad auth"
**Cause**: Incorrect username or password

**Solutions**:
1. Check your MongoDB Atlas credentials
2. Ensure password doesn't contain special characters (@, #, %, etc.)
3. If it does, URL-encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

**Example**:
```env
# If password is: MyP@ss#123
MONGODB_URI=mongodb+srv://user:MyP%40ss%23123@cluster.mongodb.net/chatzen
```

#### Error: "MongooseServerSelectionError: connect ETIMEDOUT"
**Cause**: IP address not whitelisted

**Solutions**:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 2-3 minutes for changes to apply

#### Error: "Authentication failed"
**Cause**: Database user doesn't exist

**Solutions**:
1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Create user with username and password
4. Grant "Read and write to any database" permission

---

### 🔴 Ollama Issues

#### Error: "Failed to get response from AI: fetch failed"
**Cause**: Ollama is not running

**Solutions**:
1. Check if Ollama is installed: `ollama --version`
2. Start Ollama: `ollama run llama3.2`
3. Verify it's running: `curl http://localhost:11434/api/tags`

#### Error: "model 'llama3.2' not found"
**Cause**: Model not downloaded

**Solutions**:
```bash
ollama pull llama3.2
ollama run llama3.2
```

#### Ollama is slow or unresponsive
**Cause**: Insufficient system resources

**Solutions**:
1. Close other applications
2. Use a smaller model: `ollama run llama3.2:1b`
3. Check system requirements (8GB RAM minimum)

---

### 🔴 Backend Issues

#### Error: "EADDRINUSE: address already in use :::8080"
**Cause**: Port 8080 is already in use

**Solutions**:

**Windows**:
```bash
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux**:
```bash
lsof -ti:8080 | xargs kill -9
```

**Or change port in .env**:
```env
PORT=3000
```

#### Error: "Cannot find module 'express'"
**Cause**: Dependencies not installed

**Solutions**:
```bash
cd -ChatZen/Backend
rm -rf node_modules package-lock.json
npm install
```

#### Backend starts but crashes immediately
**Cause**: Syntax error or missing dependencies

**Solutions**:
1. Check terminal for error messages
2. Verify Node.js version: `node --version` (need v18+)
3. Reinstall dependencies: `npm install`

---

### 🔴 Frontend Issues

#### Error: "Failed to fetch" in browser console
**Cause**: Backend not running or wrong URL

**Solutions**:
1. Ensure backend is running on port 8080
2. Check backend terminal for errors
3. Verify URL in ChatWindow.jsx: `http://localhost:8080/api/chat`

#### Error: "CORS policy" in browser console
**Cause**: CORS not configured properly

**Solutions**:
1. Check backend server.js has:
```javascript
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
```
2. Restart backend server

#### Frontend shows blank page
**Cause**: Build error or missing dependencies

**Solutions**:
```bash
cd -ChatZen/Frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Messages not displaying
**Cause**: React state issue

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors

---

### 🔴 OpenAI Issues

#### Error: "Incorrect API key provided"
**Cause**: Invalid or expired API key

**Solutions**:
1. Verify API key at https://platform.openai.com/api-keys
2. Ensure key starts with `sk-proj-`
3. Check for extra spaces in .env file
4. Regenerate API key if needed

#### Error: "You exceeded your current quota"
**Cause**: No credits in OpenAI account

**Solutions**:
1. Add payment method at https://platform.openai.com/account/billing
2. Purchase credits
3. Or switch to Ollama (free alternative)

---

### 🔴 Installation Issues

#### npm install fails
**Cause**: Network issues or corrupted cache

**Solutions**:
```bash
npm cache clean --force
npm install
```

#### Node version too old
**Cause**: Node.js < v18

**Solutions**:
1. Check version: `node --version`
2. Update Node.js from https://nodejs.org
3. Or use nvm: `nvm install 18`

---

### 🔴 General Debugging

#### Check if services are running

**Backend**:
```bash
curl http://localhost:8080/api/thread
# Should return: [] or list of threads
```

**Ollama**:
```bash
curl http://localhost:11434/api/tags
# Should return: list of models
```

**MongoDB**:
```bash
# Check connection in backend terminal
# Should see: "✅ MongoDB Atlas Connected Successfully!"
```

#### Enable debug logging

Add to backend server.js:
```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
```

#### Check environment variables

Add to backend server.js:
```javascript
console.log("Environment check:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
console.log("OLLAMA_URL:", process.env.OLLAMA_URL);
```

---

### 🔴 Data Issues

#### Threads not saving
**Cause**: MongoDB connection failed

**Solutions**:
1. Check MongoDB connection in terminal
2. Verify MONGODB_URI in .env
3. App will use in-memory storage as fallback (data lost on restart)

#### Old messages not loading
**Cause**: Thread ID mismatch

**Solutions**:
1. Check browser console for errors
2. Clear browser localStorage: `localStorage.clear()`
3. Restart both servers

---

### 🔴 Performance Issues

#### Slow AI responses
**Causes & Solutions**:

**If using Ollama**:
- Use smaller model: `ollama run llama3.2:1b`
- Close other applications
- Upgrade RAM (8GB minimum)

**If using OpenAI**:
- Check internet connection
- Verify API endpoint is correct
- Check OpenAI status: https://status.openai.com

#### High memory usage
**Solutions**:
1. Restart Ollama
2. Use smaller AI model
3. Clear browser cache
4. Restart backend server

---

## 🆘 Still Having Issues?

### Checklist:
- [ ] Node.js v18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] .env file exists in Backend folder
- [ ] MONGODB_URI is correct
- [ ] MongoDB IP is whitelisted
- [ ] Ollama is running OR OpenAI key is valid
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] No errors in terminal
- [ ] No errors in browser console

### Get Help:
1. Check terminal output for specific errors
2. Check browser console (F12) for frontend errors
3. Review SETUP_GUIDE.md for detailed instructions
4. Verify all environment variables in .env
5. Try restarting all services

---

**Most issues are solved by checking .env configuration and ensuring all services are running! 🎯**
