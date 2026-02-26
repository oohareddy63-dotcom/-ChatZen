# 🚀 Deploy ChatZen to Render

Complete guide to deploy your ChatZen application on Render.com

## 📋 Prerequisites

- GitHub account
- Render account (free tier available at https://render.com)
- Your code pushed to a GitHub repository
- MongoDB Atlas account (for production database)

## ⚠️ Important: Ollama Limitation

**Ollama cannot run on Render** because:
- Render doesn't support running Ollama service
- AI models require significant resources not available in free tier
- You need to use a cloud AI service instead

### AI Service Options for Production

1. **OpenAI (Recommended)** - Best quality, paid service
2. **Google Gemini** - Good quality, has free tier
3. **MongoDB Atlas + Vector Search** - Alternative approach

---

## 🎯 Deployment Strategy

We'll deploy:
1. **Backend** - As a Web Service on Render
2. **Frontend** - As a Static Site on Render
3. **Database** - MongoDB Atlas (cloud database)

---

## 📦 Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - ChatZen app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/chatzen.git
git branch -M main
git push -u origin main
```

### 1.2 Update Backend for Production

Your backend needs to support OpenAI or Gemini instead of Ollama.

**Option A: Use OpenAI**
- Get API key from: https://platform.openai.com/api-keys
- Cost: ~$0.002 per 1K tokens (very affordable)

**Option B: Use Google Gemini**
- Get API key from: https://makersuite.google.com/app/apikey
- Has free tier available

---

## 🗄️ Step 2: Setup MongoDB Atlas

### 2.1 Create Database

1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **FREE** M0 tier
5. Select a cloud provider and region (closest to you)
6. Name your cluster: `chatzen-cluster`
7. Click "Create"

### 2.2 Create Database User

1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `chatzen_user`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 2.3 Allow Network Access

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.4 Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Save this connection string - you'll need it!

Example:
```
mongodb+srv://chatzen_user:YOUR_PASSWORD@chatzen-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🔧 Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your `chatzen` repository

### 3.2 Configure Backend Service

Fill in these settings:

- **Name**: `chatzen-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `Backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3.3 Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `MONGODB_URI` | Your MongoDB connection string from Step 2.4 |
| `OPENAI_API_KEY` | Your OpenAI API key (if using OpenAI) |
| `GEMINI_API_KEY` | Your Gemini API key (if using Gemini) |
| `NODE_ENV` | `production` |

### 3.4 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL
   - Example: `https://chatzen-backend.onrender.com`

---

## 🎨 Step 4: Deploy Frontend to Render

### 4.1 Update Frontend API URL

Before deploying frontend, update the API endpoint:

1. Open `Frontend/src/App.jsx` (or wherever API calls are made)
2. Find all `http://localhost:8080` references
3. Replace with your Render backend URL

Or better, use environment variable:
- Create `Frontend/.env.production`:
```env
VITE_API_URL=https://chatzen-backend.onrender.com
```

- Update API calls to use: `import.meta.env.VITE_API_URL`

### 4.2 Create Static Site

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Select your `chatzen` repository

### 4.3 Configure Frontend Service

Fill in these settings:

- **Name**: `chatzen-frontend`
- **Branch**: `main`
- **Root Directory**: `Frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4.4 Add Environment Variables (if using .env)

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your backend URL from Step 3.4 |

### 4.5 Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get your frontend URL
   - Example: `https://chatzen-frontend.onrender.com`

---

## 🔐 Step 5: Update CORS Settings

Update your backend CORS to allow your frontend domain:

In `Backend/server.js`, update the CORS configuration:

```javascript
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://chatzen-frontend.onrender.com"  // Add your Render frontend URL
    ],
    credentials: true
}));
```

Commit and push this change - Render will auto-deploy.

---

## ✅ Step 6: Test Your Deployment

1. Open your frontend URL: `https://chatzen-frontend.onrender.com`
2. Sign up for a new account
3. Try sending a message
4. Verify AI responses work

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Frontend Can't Connect to Backend
- Check CORS settings in backend
- Verify API URL in frontend is correct
- Check browser console for errors

### AI Responses Not Working
- Verify OpenAI/Gemini API key is valid
- Check backend logs for API errors
- Ensure you have credits/quota available

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on service

---

## 💰 Cost Breakdown

### Free Tier (Render)
- Backend: Free (with sleep)
- Frontend: Free
- MongoDB Atlas: Free (M0 tier, 512MB)
- **Total: $0/month**

### Paid Tier (Recommended for Production)
- Backend: $7/month (always-on)
- Frontend: Free
- MongoDB Atlas: Free or $9/month (M2 tier)
- OpenAI API: ~$5-20/month (usage-based)
- **Total: ~$12-36/month**

---

## 🔄 Auto-Deploy Setup

Render automatically deploys when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub
3. Render detects changes and deploys automatically
4. Check deployment status in Render dashboard

---

## 📝 Important Notes

1. **Ollama won't work on Render** - Use OpenAI or Gemini instead
2. **Free tier services sleep** - First request takes longer
3. **Keep API keys secret** - Never commit them to GitHub
4. **Monitor usage** - Check OpenAI/Gemini usage to avoid surprises
5. **Backup your data** - MongoDB Atlas has automatic backups

---

## 🎉 You're Done!

Your ChatZen application is now live on the internet!

Share your frontend URL with others to let them use your AI chat app.

---

## 📚 Additional Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- OpenAI API Docs: https://platform.openai.com/docs
- Gemini API Docs: https://ai.google.dev/docs

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render service logs
2. Review MongoDB Atlas connection
3. Verify all environment variables
4. Test API endpoints directly
5. Check browser console for frontend errors
