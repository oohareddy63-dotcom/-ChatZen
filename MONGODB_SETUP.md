# 🗄️ MongoDB Setup Guide

## Option 1: Use Without MongoDB (Recommended for Testing)

Your app works perfectly without MongoDB! It uses in-memory storage.

**Pros:**
- No setup required
- Works immediately
- Perfect for testing

**Cons:**
- Data is lost when server restarts
- Not suitable for production

**To use:** Just leave `MONGODB_URI` empty in `Backend/.env`

---

## Option 2: Setup MongoDB Atlas (Free Cloud Database)

### Step 1: Create MongoDB Atlas Account (5 minutes)

1. Go to https://cloud.mongodb.com
2. Click "Try Free"
3. Sign up with email or Google account
4. Verify your email

### Step 2: Create a Free Cluster (5 minutes)

1. After login, click "Build a Database"
2. Choose **FREE** M0 tier (512MB storage)
3. Select cloud provider: **AWS** (recommended)
4. Select region: Choose closest to you
5. Cluster Name: `chatzen-cluster` (or any name)
6. Click "Create"
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User (2 minutes)

1. You'll see "Security Quickstart"
2. Choose "Username and Password"
3. Username: `chatzen_user`
4. Password: Click "Autogenerate Secure Password" and SAVE IT!
   - Example: `xK9mP2nQ7vL4sR8t`
5. Click "Create User"

### Step 4: Setup Network Access (1 minute)

1. Click "Add entries to your IP Access List"
2. Click "Add My Current IP Address"
3. Also click "Add a Different IP Address"
4. Enter: `0.0.0.0/0` (allows access from anywhere)
5. Description: "Allow all"
6. Click "Finish and Close"

### Step 5: Get Connection String (2 minutes)

1. Click "Go to Databases"
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string

It looks like:
```
mongodb+srv://chatzen_user:<password>@chatzen-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Your .env File (1 minute)

1. Open `Backend/.env` file
2. Find the line: `MONGODB_URI=`
3. Paste your connection string
4. **IMPORTANT:** Replace `<password>` with your actual password!

Example:
```env
MONGODB_URI=mongodb+srv://chatzen_user:xK9mP2nQ7vL4sR8t@chatzen-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 7: Test Connection (1 minute)

1. Restart your backend server
2. Look for this message:
   ```
   ✅ MongoDB Atlas Connected Successfully!
   📊 Database: test
   ```

If you see this, you're connected!

---

## Troubleshooting

### Error: "MongoServerError: bad auth"
**Problem:** Wrong password in connection string  
**Solution:** 
1. Go to MongoDB Atlas → Database Access
2. Edit user → Reset password
3. Update password in `.env` file

### Error: "MongooseServerSelectionError"
**Problem:** Network access not configured  
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add IP address: `0.0.0.0/0`
3. Wait 2-3 minutes for changes to apply

### Error: "ECONNREFUSED"
**Problem:** Wrong connection string  
**Solution:**
1. Go to MongoDB Atlas → Connect
2. Copy connection string again
3. Make sure to replace `<password>`

### Connection Timeout
**Problem:** Firewall blocking connection  
**Solution:**
1. Check Windows Firewall
2. Allow Node.js through firewall
3. Try different network (mobile hotspot)

---

## Verify MongoDB is Working

### Test 1: Check Health Endpoint
Open browser: http://localhost:8080/health

Should show:
```json
{
  "status": "ok",
  "database": "MongoDB"
}
```

### Test 2: Register a User
1. Go to http://localhost:5173
2. Sign up with new account
3. Restart backend server
4. Login with same account

If login works after restart, MongoDB is working!

### Test 3: Check MongoDB Atlas
1. Go to MongoDB Atlas → Database
2. Click "Browse Collections"
3. You should see:
   - Database: `test`
   - Collections: `users`, `threads`
4. Click on collections to see your data

---

## MongoDB Atlas Dashboard

### View Your Data
1. Go to https://cloud.mongodb.com
2. Click "Database" → "Browse Collections"
3. Select database: `test`
4. View collections:
   - `users` - All registered users
   - `threads` - All chat conversations

### Monitor Usage
1. Go to "Metrics" tab
2. See:
   - Connections
   - Operations per second
   - Storage usage

### Free Tier Limits
- Storage: 512 MB
- RAM: Shared
- Connections: 500 max
- Perfect for development and small apps!

---

## Switching Between Modes

### Use In-Memory (No MongoDB)
In `Backend/.env`:
```env
MONGODB_URI=
```

### Use MongoDB
In `Backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

The server automatically detects and uses the right mode!

---

## Benefits of Using MongoDB

✅ Data persists across server restarts  
✅ Can handle thousands of users  
✅ Professional database solution  
✅ Free tier available  
✅ Automatic backups  
✅ Scalable for production  

---

## Quick Reference

**MongoDB Atlas:** https://cloud.mongodb.com  
**Documentation:** https://docs.atlas.mongodb.com  
**Support:** https://support.mongodb.com  

**Your Cluster Name:** `chatzen-cluster`  
**Your Database:** `test`  
**Your Collections:** `users`, `threads`  

---

## Need Help?

1. Check backend terminal for error messages
2. Verify connection string has no spaces
3. Make sure password is correct (no `<` or `>`)
4. Wait 2-3 minutes after changing network access
5. Try connection string in MongoDB Compass first

---

**Estimated Setup Time: 15-20 minutes**

You can always start without MongoDB and add it later!
