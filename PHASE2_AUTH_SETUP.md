# Phase 2: Authentication Migration Guide

This guide walks you through migrating from Firebase Auth to Supabase Auth while maintaining all current functionality.

## 🎯 Phase 2 Overview

**Goals:**
- Configure Supabase Auth with email/password and Google OAuth
- Create a new Supabase AuthContext alongside Firebase
- Implement feature flags for gradual migration
- Maintain backward compatibility during transition

## 📋 Step-by-Step Setup

### Step 1: Configure Supabase Auth in Dashboard

1. **Go to Authentication Settings**
   - Open your [Supabase Dashboard](https://app.supabase.com)
   - Navigate to **Authentication > Settings**

2. **Configure Site URL**
   - Set **Site URL**: `http://localhost:3000` (for development)
   - Add **Redirect URLs**: 
     - `http://localhost:3000`
     - `http://localhost:3000/auth/callback`
     - `https://your-production-domain.com` (when ready)

3. **Enable Email Authentication**
   - Go to **Authentication > Settings > Auth Providers**
   - **Email** should be enabled by default
   - Configure **Email Templates** if needed

4. **Enable Google OAuth (Optional)**
   - In **Auth Providers**, find **Google**
   - Enable the toggle
   - Add your Google OAuth credentials:
     - **Client ID**: From Google Cloud Console
     - **Client Secret**: From Google Cloud Console
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

### Step 2: Update Environment Variables

Add your Supabase credentials to `.env.local`:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://fqyzfpbrlkenhrnnlalb.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeXpmcGJybGtlbmhybm5sYWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTU4NTksImV4cCI6MjA2NjczMTg1OX0.tpOY1H_KAfXTZ9xtUu9vkBuzl7nZMbu9yMvRVcu782I

# Feature flag for gradual migration
REACT_APP_USE_SUPABASE=false
```

### Step 3: Install Required Dependencies

```bash
npm install @supabase/supabase-js
```

## 🔧 What We'll Build

1. **Supabase AuthContext** - New context alongside Firebase
2. **Feature Flag System** - Toggle between Firebase and Supabase
3. **Migration Utilities** - Helper functions for auth migration
4. **Unified Auth Hook** - Single interface that works with both systems

## 🚀 Implementation Strategy

### **Gradual Migration Approach**
- Keep Firebase Auth running in production
- Develop Supabase Auth in parallel
- Use feature flags to test Supabase gradually
- Switch over when confident everything works

### **Rollback Safety**
- Firebase remains fully functional
- Environment variable controls which system is active
- Easy rollback if issues arise

## ⚠️ Important Notes

- **Don't disable Firebase Auth yet** - we'll run both systems in parallel
- **Test thoroughly** before switching the feature flag
- **User sessions** will need to be re-established when switching
- **Custom claims** (roles) will be handled differently in Supabase

## 📚 Key Differences: Firebase vs Supabase Auth

| Feature | Firebase Auth | Supabase Auth |
|---------|---------------|---------------|
| User Object | `firebase.User` | `supabase.User` |
| Sign In | `signInWithEmailAndPassword` | `signInWithPassword` |
| Sign Up | `createUserWithEmailAndPassword` | `signUp` |
| OAuth | `signInWithPopup` | `signInWithOAuth` |
| User Metadata | Custom claims | `user_metadata` / `app_metadata` |
| Role Storage | Firestore + Custom Claims | PostgreSQL users table |

Ready to start the implementation? Let's build the Supabase AuthContext! 🎯
