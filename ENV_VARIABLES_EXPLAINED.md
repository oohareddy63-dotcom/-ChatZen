# 🔐 Environment Variables Explained

## What Goes in Your .env File

The `.env` file is located at: `-ChatZen/Backend/.env`

---

## 1️⃣ PORT (Optional)
```env
PORT=8080
```
- **What it is**: The port your backend server runs on
- **Default**: 8080
- **When to change**: If port 8080 is already in use
- **Example**: `PORT=3000`

---

## 2️⃣ MONGODB_URI (REQUIRED)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatzen?retryWrites=true&w=majority
```
- **What it is**: Connection string to your MongoDB database
- **Where to get it**: https://cloud.mongodb.com
- **Steps**:
  1. Create free account
  2. Create cluster (takes 3-5 min)
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your database password
  6. Replace `<database>` with `chatzen`

**Example**:
```env
MONGODB_URI=mongodb+srv://john:MyPass123@cluster0.abc123.mongodb.net/chatzen?retryWrites=true&w=majority
```

---

## 3️⃣ OLLAMA_URL (Required if using Ollama)
```env
OLLAMA_URL=http://localhost:11434
```
- **What it is**: URL where Ollama AI service is running
- **Default**: http://localhost:11434
- **Where to get it**: Install from https://ollama.com
- **Setup**: Run `ollama run llama3.2` after installation

---

## 4️⃣ OLLAMA_MODEL (Required if using Ollama)
```env
OLLAMA_MODEL=llama3.2
```
- **What it is**: Which AI model to use
- **Options**: llama3.2, llama3.1, mistral, codellama
- **Recommended**: llama3.2 (fast and accurate)
- **Change model**: `ollama pull <model-name>`

---

## 5️⃣ OPENAI_API_KEY (Alternative to Ollama)
```env
OPENAI_API_KEY=sk-proj-abc123xyz...
```
- **What it is**: API key for OpenAI's GPT models
- **Where to get it**: https://platform.openai.com/api-keys
- **Cost**: Pay per use (~$0.002 per 1K tokens)
- **When to use**: If you prefer OpenAI over local Ollama

---

## 6️⃣ GEMINI_API_KEY (Alternative to Ollama)
```env
GEMINI_API_KEY=AIzaSy...
```
- **What it is**: API key for Google's Gemini AI
- **Where to get it**: https://makersuite.google.com/app/apikey
- **Cost**: Free tier available
- **When to use**: If you prefer Google's AI

---

## 🎯 Which AI Service Should I Use?

### Ollama (Recommended for Beginners)
✅ Free forever  
✅ Runs locally (no internet needed)  
✅ Fast responses  
✅ Privacy (data stays on your computer)  
❌ Requires installation  
❌ Uses computer resources  

### OpenAI
✅ High quality responses  
✅ No installation needed  
✅ Doesn't use your computer resources  
❌ Costs money  
❌ Requires internet  
❌ Data sent to OpenAI servers  

### Google Gemini
✅ Free tier available  
✅ Good quality responses  
✅ No installation needed  
❌ Requires internet  
❌ Data sent to Google servers  

---

## 📋 Complete .env Example

```env
# Server Configuration
PORT=8080

# Database (REQUIRED)
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc.mongodb.net/chatzen?retryWrites=true&w=majority

# AI Service - Choose ONE option below:

# Option 1: Ollama (Local AI - Recommended)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Option 2: OpenAI (Uncomment to use)
# OPENAI_API_KEY=sk-proj-your-key-here

# Option 3: Google Gemini (Uncomment to use)
# GEMINI_API_KEY=AIzaSy-your-key-here
```

---

## 🔒 Security Tips

1. **Never share your .env file** - It contains sensitive credentials
2. **Never commit .env to Git** - Already in .gitignore
3. **Use strong passwords** - For MongoDB users
4. **Rotate API keys** - Change them periodically
5. **Use different .env for production** - Don't use dev credentials in production

---

## ❓ FAQ

**Q: Do I need all these variables?**  
A: No! You only need `MONGODB_URI` + ONE AI service (Ollama OR OpenAI OR Gemini)

**Q: Can I use multiple AI services?**  
A: Yes, but the app will use Ollama by default if configured

**Q: What if I don't want to use MongoDB?**  
A: The app will fall back to in-memory storage (data lost on restart)

**Q: Where do I put the .env file?**  
A: In the Backend folder: `-ChatZen/Backend/.env`

---

**Need help? Check SETUP_GUIDE.md for detailed instructions!**
