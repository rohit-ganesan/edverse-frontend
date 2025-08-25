# Environment Variables

This document describes all environment variables used in the EdVerse frontend application.

## 📋 Overview

Environment variables are used to configure the application for different environments (development, staging, production) and to securely store sensitive information like API keys.

## 🔧 Configuration Files

### `.env.local` (Development)
Used for local development. This file should not be committed to version control.

### `.env.production` (Production)
Used for production builds. This file should not be committed to version control.

### `.env.example`
Template file showing all required environment variables. This file should be committed to version control.

## 🌍 Environment Variables

### Supabase Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | ✅ | `https://your-project.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Development Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_ENVIRONMENT` | Current environment | ❌ | `development` |
| `REACT_APP_API_BASE_URL` | Base URL for API calls | ❌ | `http://localhost:54321/functions/v1` |
| `REACT_APP_DEBUG_MODE` | Enable debug logging | ❌ | `false` |

### Testing Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_SUPABASE_TEST_URL` | Test Supabase project URL | ❌ | `http://localhost:54321` |
| `REACT_APP_SUPABASE_TEST_ANON_KEY` | Test Supabase anonymous key | ❌ | `your-test-anon-key` |

### Feature Flags

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics tracking | ❌ | `false` |
| `REACT_APP_ENABLE_DEBUG_TOOLS` | Enable debug tools in UI | ❌ | `false` |
| `REACT_APP_ENABLE_EXPERIMENTAL_FEATURES` | Enable experimental features | ❌ | `false` |

### External Services (Optional)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | ❌ | `G-XXXXXXXXXX` |
| `REACT_APP_SENTRY_DSN` | Sentry error tracking DSN | ❌ | `https://...@sentry.io/...` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ❌ | `pk_test_...` |

## 🚀 Setup Instructions

### 1. Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the variables with your values:
   ```env
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Development Configuration
   REACT_APP_ENVIRONMENT=development
   REACT_APP_API_BASE_URL=http://localhost:54321/functions/v1
   REACT_APP_DEBUG_MODE=true
   ```

### 2. Production Setup

1. Create a `.env.production` file:
   ```env
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Production Configuration
   REACT_APP_ENVIRONMENT=production
   REACT_APP_DEBUG_MODE=false
   ```

### 3. Vercel Deployment

Set the following environment variables in your Vercel project:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_ENVIRONMENT=production
```

## 🔒 Security Considerations

### Never Commit Sensitive Data

- ❌ Never commit `.env.local` or `.env.production`
- ❌ Never commit API keys or secrets
- ✅ Always commit `.env.example` as a template

### Environment Variable Best Practices

1. **Use REACT_APP_ prefix**: Only variables prefixed with `REACT_APP_` are accessible in the browser
2. **Validate at runtime**: Check for required variables on app startup
3. **Use TypeScript**: Define environment variable types for better development experience
4. **Document changes**: Update this file when adding new variables

## 🧪 Testing Environment

For testing, create a `.env.test` file:

```env
REACT_APP_SUPABASE_URL=http://localhost:54321
REACT_APP_SUPABASE_ANON_KEY=your_test_anon_key
REACT_APP_ENVIRONMENT=test
REACT_APP_DEBUG_MODE=true
```

## 🔍 Validation

The application validates required environment variables on startup:

```typescript
// src/lib/env.ts
const requiredEnvVars = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## 📝 Example Files

### `.env.example`
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_API_BASE_URL=http://localhost:54321/functions/v1
REACT_APP_DEBUG_MODE=false

# Testing Configuration
REACT_APP_SUPABASE_TEST_URL=http://localhost:54321
REACT_APP_SUPABASE_TEST_ANON_KEY=your_test_anon_key

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_TOOLS=false
REACT_APP_ENABLE_EXPERIMENTAL_FEATURES=false

# External Services (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
```

### `.env.local` (Development)
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://fqyzfpbrlkenhrnnlalb.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_API_BASE_URL=http://localhost:54321/functions/v1
REACT_APP_DEBUG_MODE=true

# Testing Configuration
REACT_APP_SUPABASE_TEST_URL=http://localhost:54321
REACT_APP_SUPABASE_TEST_ANON_KEY=your_test_anon_key

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_TOOLS=true
REACT_APP_ENABLE_EXPERIMENTAL_FEATURES=true
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Restart the development server after adding new variables
   - Ensure variables are prefixed with `REACT_APP_`

2. **Build errors**
   - Check that all required variables are set
   - Verify variable names are correct

3. **Runtime errors**
   - Check browser console for missing variable errors
   - Validate environment variable values

### Debug Mode

Enable debug mode to see environment variable validation:

```env
REACT_APP_DEBUG_MODE=true
```

This will log environment variable status to the console on app startup.

## 📚 Related Documentation

- [Supabase Configuration](../lib/supabase.ts)
- [API Configuration](../lib/supabase-api.ts)
- [Testing Setup](../lib/supabase-test.ts)
- [Deployment Guide](./DEPLOYMENT.md)
