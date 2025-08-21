# 🧪 Local Testing Guide

## 🚀 Quick Start Testing

### Step 1: Update Environment Variables

Copy your Supabase credentials to `.env.local`:

```bash
# Firebase Configuration (Current)
REACT_APP_FIREBASE_API_KEY=AIzaSyDNKy9_3rm8vm6zPoOWYu_K4oebdeV6k9Y
REACT_APP_FIREBASE_AUTH_DOMAIN=edverse-f1640.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=edverse-f1640
REACT_APP_FIREBASE_STORAGE_BUCKET=edverse-f1640.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=392040621349
REACT_APP_FIREBASE_APP_ID=1:392040621349:web:5e73db9b52a538cc1966cc
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XBWQNHQKXD

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://fqyzfpbrlkenhrnnlalb.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeXpmcGJybGtlbmhybm5sYWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTU4NTksImV4cCI6MjA2NjczMTg1OX0.tpOY1H_KAfXTZ9xtUu9vkBuzl7nZMbu9yMvRVcu782I

# Environment
NODE_ENV=development

# Feature flag for testing
REACT_APP_USE_SUPABASE=false  # Start with Firebase (known working)
```

### Step 2: Start Testing

#### 🔥 Test Firebase Auth (Current System)
```bash
# In .env.local
REACT_APP_USE_SUPABASE=false
```

1. **Navigate to**: http://localhost:3000/login
2. **Look for**: "Using Firebase Auth" indicator
3. **Test login** with existing credentials
4. **Verify**: Dashboard access and user profile

#### ⚡ Test Supabase Auth (New System)
```bash
# In .env.local  
REACT_APP_USE_SUPABASE=true
```

1. **Restart the dev server** (Ctrl+C, then `npm start`)
2. **Navigate to**: http://localhost:3000/login
3. **Look for**: "Using Supabase Auth" indicator
4. **Create new account** (Supabase will be empty initially)
5. **Test registration** and login

## 🧪 Test Scenarios

### ✅ Scenario 1: Firebase Auth (Baseline)
- [ ] Login page loads with "Firebase Auth" indicator
- [ ] Email/password login works
- [ ] Google OAuth works (if configured)
- [ ] Dashboard loads after successful login
- [ ] User profile displays correctly
- [ ] Protected routes work
- [ ] Logout works

### ✅ Scenario 2: Supabase Auth (New)
- [ ] Login page loads with "Supabase Auth" indicator  
- [ ] New user registration works
- [ ] Email/password login works
- [ ] User profile gets created automatically
- [ ] Dashboard loads after successful login
- [ ] Protected routes work
- [ ] Logout works

### ✅ Scenario 3: Feature Flag Switching
- [ ] Can switch between systems via environment variable
- [ ] No errors when switching
- [ ] UI updates to show correct auth system
- [ ] Both systems maintain separate user bases

## 🔍 What to Look For

### **Success Indicators**
- ✅ Login form shows correct auth system name
- ✅ No console errors in browser dev tools
- ✅ Successful authentication redirects to dashboard
- ✅ User profile data loads correctly
- ✅ Protected routes redirect unauthenticated users

### **Debug Information**
- 🔍 Check browser console for auth state changes
- 🔍 Network tab shows requests to correct backend
- 🔍 Local storage/session storage for auth tokens
- 🔍 Supabase dashboard shows new users (when testing Supabase)

## ⚠️ Expected Differences

| Firebase | Supabase |
|----------|----------|
| Existing user data | Empty database initially |
| Firebase console logs | Supabase console logs |
| Firebase tokens in storage | Supabase tokens in storage |
| Firestore user profiles | PostgreSQL user profiles |

## 🐛 Common Issues & Solutions

### **Issue**: "Missing Supabase environment variables"
**Solution**: Ensure `.env.local` has correct Supabase URL and key

### **Issue**: "Permission denied for schema auth"
**Solution**: RLS policies might need adjustment, check Supabase dashboard

### **Issue**: Console errors about missing auth context
**Solution**: Make sure all auth providers are properly nested in App.tsx

### **Issue**: Redirect loop on login
**Solution**: Check protected route logic and auth state management

## 📊 Testing Checklist

- [ ] Environment variables set correctly
- [ ] Database schema applied in Supabase
- [ ] RLS policies applied in Supabase
- [ ] Firebase auth working (baseline)
- [ ] Supabase auth working (new)
- [ ] Feature flag switching works
- [ ] No console errors
- [ ] User profiles created correctly
- [ ] Session persistence works

## 🆘 Need Help?

If you encounter issues:
1. **Check browser console** for detailed error messages
2. **Verify environment variables** are loaded correctly
3. **Check Supabase dashboard** for database connectivity
4. **Test Firebase first** to ensure baseline works

Ready to test! 🚀
