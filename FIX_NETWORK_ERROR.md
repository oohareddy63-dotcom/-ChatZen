# 🔧 Fix "Network Error" on Signup/Login

## Problem
You see "Network error. Please try again." when trying to sign up or log in.

## Quick Fixes

### Fix 1: Check if Backend is Running

Open a new terminal and run:
```bash
curl http://localhost:8080/health
```

You should see:
```json
{"status":"ok","message":"ChatZen Backend is running"}
```

If you get an error, the backend is not running. Start it with:
```bash
cd Backend
node server.js
```

### Fix 2: Check Browser Console

1. Open your browser (where ChatZen is running)
2. Press `F12` to open Developer Tools
3. Click on the "Console" tab
4. Try to sign up again
5. Look for error messages

Common errors and solutions:

#### Error: "Failed to fetch" or "net::ERR_CONNECTION_REFUSED"
**Solution:** Backend is not running
```bash
cd Backend
node server.js
```

#### Error: "CORS policy" or "Access-Control-Allow-Origin"
**Solution:** CORS issue - backend needs to allow your frontend URL

Check `Backend/server.js` has:
```javascript
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
```

#### Error: "NetworkError" or "TypeError: Failed to fetch"
**Solution:** Firewall or antivirus blocking the connection

### Fix 3: Test Backend Directly

Open this URL in your browser:
```
http://localhost:8080/health
```

You should see:
```json
{"status":"ok","message":"ChatZen Backend is running"}
```

If this works but signup doesn't, it's a CORS or frontend issue.

### Fix 4: Clear Browser Cache

1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (`Ctrl + F5`)

### Fix 5: Try Different Browser

Sometimes browser extensions block requests. Try:
- Chrome/Edge in Incognito mode
- Firefox in Private mode
- Different browser entirely

### Fix 6: Check Firewall/Antivirus

Your firewall or antivirus might be blocking localhost connections.

**Windows Firewall:**
1. Search for "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Find "Node.js" and make sure both Private and Public are checked
4. If not listed, click "Allow another app" and add Node.js

**Antivirus:**
- Temporarily disable antivirus
- Try signup again
- If it works, add Node.js to antivirus exceptions

### Fix 7: Check Port 8080

Make sure nothing else is using port 8080:

```bash
netstat -ano | findstr :8080
```

If something else is using it, either:
- Stop that application
- Change ChatZen backend port in `Backend/.env`:
  ```env
  PORT=8081
  ```
  Then update frontend to use `http://localhost:8081`

### Fix 8: Restart Everything

1. Stop both servers (Ctrl + C in terminals)
2. Close all browser tabs
3. Start backend:
   ```bash
   cd Backend
   node server.js
   ```
4. Start frontend:
   ```bash
   cd Frontend
   node node_modules/vite/bin/vite.js
   ```
5. Open fresh browser tab: http://localhost:5173

## Test Connection

I've created a test page for you. Copy `test-connection.html` to `Frontend/public/` folder, then visit:
```
http://localhost:5173/test-connection.html
```

This will test:
- Backend connection
- Registration endpoint
- CORS configuration

## Still Not Working?

### Check Backend Logs

Look at the terminal where backend is running. When you try to sign up, you should see:
```
2026-02-26T... - POST /api/auth/register
```

If you don't see this, the request isn't reaching the backend.

### Manual Test

Open browser console (F12) and run:
```javascript
fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123456'
    })
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e));
```

If this works, the issue is in the frontend code.
If this fails, the issue is with backend connection.

## Common Causes

1. **Backend not running** (90% of cases)
   - Solution: Start backend with `node server.js`

2. **Wrong port** (5% of cases)
   - Solution: Check backend is on 8080, frontend on 5173

3. **Firewall blocking** (3% of cases)
   - Solution: Allow Node.js through firewall

4. **Browser extension blocking** (2% of cases)
   - Solution: Try incognito mode

## Need More Help?

1. Check backend terminal for errors
2. Check browser console (F12) for errors
3. Run the test page: `test-connection.html`
4. Make sure both servers show "running" status

---

**Quick Checklist:**
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] http://localhost:8080/health returns OK
- [ ] Browser console shows no CORS errors
- [ ] Firewall allows Node.js
- [ ] No antivirus blocking connections
