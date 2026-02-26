# 🎯 START HERE - ChatZen Setup

## 📚 Documentation Overview

I've created everything you need to get ChatZen running 100% error-free:

1. **START_HERE.md** (this file) - Quick overview
2. **QUICK_REFERENCE.md** - All links and commands in one place
3. **SETUP_GUIDE.md** - Detailed step-by-step instructions
4. **SETUP_CHECKLIST.md** - Simple checklist to follow
5. **ENV_VARIABLES_EXPLAINED.md** - What each variable means
6. **Backend/.env** - Your environment configuration file (EDIT THIS!)
7. **Backend/.env.example** - Template for reference

---

## ⚡ Quick Start (3 Steps)

### Step 1: Get Your Links Ready

Open these in your browser:

1. **MongoDB Atlas** (Database): https://cloud.mongodb.com
   - Sign up → Create free cluster → Get connection string

2. **Ollama** (AI - Recommended): https://ollama.com
   - Download → Install → Run: `ollama run llama3.2`

   OR

   **OpenAI** (AI - Alternative): https://platform.openai.com/api-keys
   - Sign up → Create API key

### Step 2: Edit Your .env File

Open: `-ChatZen/Backend/.env`

Replace these values:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/chatzen

# If using Ollama (already configured):
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# If using OpenAI (uncomment and add your key):
# OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

### Step 3: Install & Run

```bash
# Install dependencies
cd -ChatZen/Backend && npm install
cd ../Frontend && npm install

# Start backend (Terminal 1)
cd -ChatZen/Backend && npm run dev

# Start frontend (Terminal 2)
cd -ChatZen/Frontend && npm run dev
```

Open: http://localhost:5173

---

## 🎯 What You Need

### Required:
- ✅ MongoDB Atlas connection string
- ✅ Ollama installed OR OpenAI API key
- ✅ Node.js v18+

### Optional:
- Port configuration (default: 8080)
- Different AI model

---

## 📖 Need More Help?

- **Quick commands & links**: Read `QUICK_REFERENCE.md`
- **Detailed instructions**: Read `SETUP_GUIDE.md`
- **Step-by-step checklist**: Read `SETUP_CHECKLIST.md`
- **Understanding .env**: Read `ENV_VARIABLES_EXPLAINED.md`

---

## 🔗 Essential Links

| Service | Link | What You Get |
|---------|------|--------------|
| MongoDB Atlas | https://cloud.mongodb.com | Connection string |
| Ollama | https://ollama.com | Local AI (free) |
| OpenAI | https://platform.openai.com/api-keys | API key (paid) |

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Connection string copied
- [ ] Ollama installed OR OpenAI key obtained
- [ ] `.env` file updated with your credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running (port 8080)
- [ ] Frontend running (port 5173)
- [ ] Can send messages and get AI responses

---

## 🚨 Common Issues

**"MongoDB connection failed"**
→ Check username/password in connection string
→ Whitelist IP: 0.0.0.0/0 in MongoDB Network Access

**"Failed to get AI response"**
→ If using Ollama: Run `ollama run llama3.2`
→ If using OpenAI: Check API key is correct

**"Port already in use"**
→ Change PORT in .env file
→ Or kill process using the port

---

**Ready? Start with QUICK_REFERENCE.md for all the links! 🚀**
