# Supabase Migration - Phase 1 Setup Guide

This guide walks you through setting up the foundation for migrating from Firebase to Supabase.

## 📋 Prerequisites

- Supabase project created ✅
- Node.js v18+ installed
- Access to your Supabase dashboard

## 🚀 Phase 1 Setup Instructions

### Step 1: Install Supabase Client

```bash
cd /path/to/edverse-frontend
npm install @supabase/supabase-js
```

### Step 2: Get Supabase Configuration

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your EdVerse project
3. Go to **Settings > API**
4. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon (public) key**: `eyJ...` (long string)

### Step 3: Configure Environment Variables

1. Copy the template from `supabase-env-template.txt`
2. Create/update your `.env.local` file with the Supabase values:

```bash
# Add these to your .env.local file
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Keep your Firebase config for now (we'll remove later)
REACT_APP_USE_SUPABASE=false  # Set to true when ready to test
```

### Step 4: Set Up Database Schema

1. Go to your Supabase Dashboard
2. Click on **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to create all tables and indexes

### Step 5: Apply Row Level Security Policies

1. In the same SQL Editor
2. Create another new query
3. Copy and paste the contents of `supabase-rls-policies.sql`
4. Click **Run** to apply all security policies

### Step 6: Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see all the following tables:
   - users
   - instructors
   - students
   - courses
   - notifications
   - grades
   - attendance
   - assignments
   - submissions
   - messages
   - events

## 🔧 Configuration Files Created

- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `supabase-schema.sql` - PostgreSQL database schema
- ✅ `supabase-rls-policies.sql` - Row Level Security policies
- ✅ `supabase-env-template.txt` - Environment variables template

## 🎯 Next Steps

Once Phase 1 is complete, you can:

1. Test the Supabase connection by setting `REACT_APP_USE_SUPABASE=true`
2. Move to Phase 2: Authentication Migration
3. Begin replacing Firebase Auth with Supabase Auth

## 🔍 Verification

To verify everything is working:

```javascript
// Test in browser console after setting up
import { supabase } from './src/lib/supabase'
console.log('Supabase client:', supabase)
```

## 📚 Key Differences from Firebase

| Firebase | Supabase |
|----------|----------|
| Firestore Collections | PostgreSQL Tables |
| Document IDs | UUIDs |
| Firestore Rules | Row Level Security (RLS) |
| Timestamps | ISO 8601 strings |
| Subcollections | Foreign Key relationships |

## ⚠️ Important Notes

- Keep Firebase running until migration is complete
- Use feature flags to test Supabase gradually
- All existing Firebase functionality remains intact
- Database schema mirrors your current Firestore structure

## 🆘 Troubleshooting

**Connection Issues:**
- Verify your Supabase URL and key in `.env.local`
- Check if RLS policies are enabled
- Ensure your project is not paused

**Schema Issues:**
- Verify all SQL scripts ran without errors
- Check table permissions in Supabase dashboard
- Ensure UUIDs extension is enabled

Ready for Phase 2? Let's migrate the authentication system! 🚀
