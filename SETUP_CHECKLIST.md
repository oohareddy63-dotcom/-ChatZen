# ✅ ChatZen Setup Checklist

## Step 1: Install Dependencies
- [ ] `cd -ChatZen/Backend && npm install`
- [ ] `cd -ChatZen/Frontend && npm install`

## Step 2: MongoDB Atlas Setup
- [ ] Create account at https://cloud.mongodb.com
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Whitelist IP (0.0.0.0/0 for development)
- [ ] Copy connection string
- [ ] Update `MONGODB_URI` in `-ChatZen/Backend/.env`

## Step 3: AI Service Setup (Choose ONE)

### Option A: Ollama (Recommended - Free)
- [ ] Download from https://ollama.com
- [ ] Install Ollama
- [ ] Run: `ollama run llama3.2`
- [ ] Verify: `curl http://localhost:11434/api/tags`
- [ ] `.env` already configured for Ollama

### Option B: OpenAI (Paid)
- [ ] Get API key from https://platform.openai.com/api-keys
- [ ] Add `OPENAI_API_KEY=sk-proj-...` to `.env`

## Step 4: Start Application
- [ ] Terminal 1: `cd -ChatZen/Backend && npm run dev`
- [ ] Terminal 2: `cd -ChatZen/Frontend && npm run dev`
- [ ] Open http://localhost:5173

## Step 5: Test
- [ ] Send a message in the chat
- [ ] Receive AI response
- [ ] Create new conversation
- [ ] Check backend logs for errors

## ✅ Success!
If all steps are checked, your ChatZen is ready to use!
