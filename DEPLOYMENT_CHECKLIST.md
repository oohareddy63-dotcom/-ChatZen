# ✅ Render Deployment Checklist

Quick checklist to deploy ChatZen to Render.

## Before You Start

- [ ] GitHub account created
- [ ] Render account created (https://render.com)
- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas account created

## Step 1: MongoDB Atlas Setup (15 minutes)

- [ ] Create free M0 cluster at https://cloud.mongodb.com
- [ ] Create database user with password
- [ ] Allow network access from anywhere (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string

**Your MongoDB URI:**
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## Step 2: Get AI API Key (5 minutes)

Choose ONE option:

### Option A: OpenAI (Recommended)
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Create new API key
- [ ] Copy and save the key (starts with `sk-`)
- [ ] Add $5-10 credit to your account

### Option B: Google Gemini (Free Tier Available)
- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Create new API key
- [ ] Copy and save the key

## Step 3: Update Code for Production (10 minutes)

### Backend Changes

- [ ] Option 1: Replace `server.js` with `server-production.js`
  ```bash
  cd Backend
  cp server-production.js server.js
  ```

- [ ] Option 2: Update `package.json` start script:
  ```json
  "start": "node server-production.js"
  ```

### Frontend Changes

- [ ] Update API URL in your code OR use environment variable
- [ ] If using env var, create `Frontend/.env.production`:
  ```env
  VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com
  ```

### Update CORS

- [ ] In `Backend/server.js` or `server-production.js`, add your frontend URL:
  ```javascript
  origin: [
      "http://localhost:5173",
      "https://YOUR-FRONTEND-NAME.onrender.com"
  ]
  ```

### Commit and Push

- [ ] Commit all changes:
  ```bash
  git add .
  git commit -m "Prepare for Render deployment"
  git push origin main
  ```

## Step 4: Deploy Backend (10 minutes)

- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `chatzen-backend`
  - Root Directory: `Backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: Free

- [ ] Add Environment Variables:
  - `PORT` = `8080`
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = Your MongoDB connection string
  - `OPENAI_API_KEY` = Your OpenAI key (if using OpenAI)
  - `GEMINI_API_KEY` = Your Gemini key (if using Gemini)

- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Copy your backend URL: `https://chatzen-backend.onrender.com`
- [ ] Test health endpoint: `https://chatzen-backend.onrender.com/health`

## Step 5: Deploy Frontend (10 minutes)

- [ ] Update frontend code with backend URL (if not done in Step 3)
- [ ] Commit and push changes
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "Static Site"
- [ ] Select your repository
- [ ] Configure:
  - Name: `chatzen-frontend`
  - Root Directory: `Frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

- [ ] Add Environment Variable (if using):
  - `VITE_API_URL` = Your backend URL

- [ ] Click "Create Static Site"
- [ ] Wait for deployment
- [ ] Copy your frontend URL: `https://chatzen-frontend.onrender.com`

## Step 6: Final Configuration (5 minutes)

- [ ] Update backend CORS with actual frontend URL
- [ ] Commit and push (Render auto-deploys)
- [ ] Wait for backend to redeploy

## Step 7: Test Everything (5 minutes)

- [ ] Open frontend URL in browser
- [ ] Sign up for new account
- [ ] Send a test message
- [ ] Verify AI responds correctly
- [ ] Check that threads save properly
- [ ] Test on mobile device

## Troubleshooting

### Backend Issues
- [ ] Check Render logs: Dashboard → Service → Logs
- [ ] Verify all environment variables are set
- [ ] Test MongoDB connection string separately
- [ ] Verify API key is valid

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify API URL is correct
- [ ] Check CORS settings in backend
- [ ] Clear browser cache

### AI Not Responding
- [ ] Check backend logs for API errors
- [ ] Verify API key is valid and has credits
- [ ] Test API key separately
- [ ] Check rate limits

## Post-Deployment

- [ ] Share your app URL with friends
- [ ] Monitor Render dashboard for errors
- [ ] Check OpenAI/Gemini usage and costs
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on Render)

## Costs

### Free Tier
- Render Backend: Free (sleeps after 15 min)
- Render Frontend: Free
- MongoDB Atlas: Free (M0, 512MB)
- **Total: $0/month** (+ AI API usage)

### Paid Tier (Recommended)
- Render Backend: $7/month (always-on)
- OpenAI API: ~$5-20/month (usage-based)
- **Total: ~$12-27/month**

## Important Notes

1. **Free tier services sleep** - First request takes 30-60 seconds
2. **Keep API keys secret** - Never commit to GitHub
3. **Monitor AI usage** - Can get expensive if abused
4. **Backup data** - MongoDB Atlas has automatic backups
5. **Update dependencies** - Run `npm update` regularly

## Need Help?

Read the full guide: `RENDER_DEPLOYMENT_GUIDE.md`

---

**Estimated Total Time: 60 minutes**

Good luck with your deployment! 🚀
