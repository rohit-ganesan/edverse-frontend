#!/bin/bash

# Deploy Supabase Edge Functions
echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Deploy all Edge Functions
echo "📦 Deploying Edge Functions..."
supabase functions deploy create-user-profile
supabase functions deploy update-user-profile
supabase functions deploy create-course
supabase functions deploy get-user-courses
supabase functions deploy get-dashboard-stats
supabase functions deploy health-check
supabase functions deploy get-users
supabase functions deploy get-students
supabase functions deploy get-instructors
supabase functions deploy get-notifications
supabase functions deploy test-connection

echo "✅ Edge Functions deployed successfully!"

# List deployed functions
echo "📋 Deployed Functions:"
supabase functions list

echo "🎉 Deployment complete!"
