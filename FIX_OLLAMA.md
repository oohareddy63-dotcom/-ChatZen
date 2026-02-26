# 🔧 Fix Ollama - Get AI Working!

## 🎯 The Problem

Ollama is running but **no AI models are installed**. That's why you're getting "Sorry, I couldn't process that."

## ✅ Quick Fix (2 Minutes)

### Option 1: Install Ollama Model (Recommended)

Open a **new terminal** (Command Prompt or PowerShell) and run:

```bash
ollama pull llama3.2
```

This will download the AI model (takes 2-3 minutes, ~2GB download).

After it finishes, try sending a message in ChatZen again!

---

### Option 2: Run Ollama with Model

If the above doesn't work, try:

```bash
ollama run llama3.2
```

This will download AND run the model. Keep this terminal open!

---

### Option 3: Use a Smaller Model (Faster)

If llama3.2 is too large, use a smaller model:

```bash
ollama pull llama3.2:1b
```

Then update your `.env` file:
```env
OLLAMA_MODEL=llama3.2:1b
```

Restart the backend server.

---

## 🔍 Check if Ollama is Working

### Test 1: Check if Ollama is Running
```bash
curl http://localhost:11434/api/tags
```

Should show: `{"models":[]}` (empty) or list of models

### Test 2: List Installed Models
```bash
ollama list
```

Should show installed models. If empty, you need to install one!

### Test 3: Test a Model
```bash
ollama run llama3.2
```

Type a message and see if it responds.

---

## 🚨 Troubleshooting

### "ollama: command not found"

**Problem**: Ollama CLI not in PATH

**Solution**:
1. Close all terminals
2. Restart your computer
3. Try again

OR

Find Ollama installation:
- Windows: Usually in `C:\Users\YourName\AppData\Local\Programs\Ollama`
- Add to PATH or use full path

### "Error: model not found"

**Problem**: Model not installed

**Solution**:
```bash
ollama pull llama3.2
```

### Ollama Service Not Running

**Problem**: Ollama service stopped

**Solution**:
- Windows: Check system tray for Ollama icon
- Right-click → Start
- Or restart Ollama application

### Download is Slow

**Problem**: Large model download

**Solutions**:
1. Use smaller model: `ollama pull llama3.2:1b`
2. Wait for download to complete
3. Check internet connection

---

## 🎯 Alternative: Use OpenAI Instead

If Ollama is too complicated, use OpenAI:

### Step 1: Get API Key
Go to: https://platform.openai.com/api-keys
- Sign up / Login
- Create new API key
- Copy the key (starts with `sk-proj-`)

### Step 2: Add to .env
Edit `-ChatZen/Backend/.env`:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Step 3: Update Server Code
The server needs to be modified to use OpenAI. Let me know if you want this option!

---

## 📋 Step-by-Step: Install Ollama Model

### Windows:

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Install Model**
   ```bash
   ollama pull llama3.2
   ```

3. **Wait for Download**
   - Shows progress bar
   - Takes 2-3 minutes
   - ~2GB download

4. **Verify Installation**
   ```bash
   ollama list
   ```
   Should show `llama3.2`

5. **Test It**
   ```bash
   ollama run llama3.2
   ```
   Type: "Hello"
   Should get a response!

6. **Go Back to ChatZen**
   - Refresh browser: http://localhost:5173
   - Send a message
   - Should work now! 🎉

---

## 🎮 Quick Commands

```bash
# Install model
ollama pull llama3.2

# List installed models
ollama list

# Run model (interactive)
ollama run llama3.2

# Check Ollama status
curl http://localhost:11434/api/tags

# Remove a model (if needed)
ollama rm llama3.2
```

---

## ✅ Success Indicators

### Ollama Working:
```bash
ollama list
# Shows: llama3.2
```

### ChatZen Working:
- Send message in http://localhost:5173
- Get actual AI response (not error message)
- Response makes sense

---

## 🆘 Still Not Working?

### Check Backend Logs

Look at the backend terminal for errors:
- `🤖 Calling Ollama at: http://localhost:11434/api/chat`
- `✅ Got response from Ollama` (good!)
- `❌ Ollama Error:` (shows what's wrong)

### Common Issues:

1. **No models installed**
   - Run: `ollama pull llama3.2`

2. **Wrong model name**
   - Check: `ollama list`
   - Update `.env` with correct name

3. **Ollama not running**
   - Check system tray
   - Restart Ollama app

4. **Port conflict**
   - Ollama should be on port 11434
   - Check: `curl http://localhost:11434/api/tags`

---

## 💡 Recommended Setup

**Best Option**: Ollama with llama3.2
- Free
- Fast
- Private (runs locally)
- No API costs

**Steps**:
1. `ollama pull llama3.2`
2. Refresh ChatZen
3. Start chatting!

---

## 📞 Need Help?

If you're still stuck:
1. Check backend terminal for error messages
2. Run: `ollama list` and share output
3. Try: `ollama run llama3.2` and see if it works
4. Check if Ollama app is running in system tray

---

**Once you run `ollama pull llama3.2`, your ChatZen will work perfectly! 🚀**
