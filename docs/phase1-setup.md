# Phase 1 Setup Guide - EdVerse

This guide covers the complete setup process for Phase 1 of the EdVerse learning management system, including both frontend and backend components.

## 🎯 Phase 1 Overview

Phase 1 establishes the foundation with:
- **Frontend**: React + TypeScript application with authentication
- **Backend**: Firebase services (Auth, Firestore, Cloud Functions)
- **Features**: User registration, login, role-based access, basic dashboard

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v18 or higher
- **Yarn** package manager
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control
- **VS Code** (recommended) with TypeScript extension

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repositories
git clone <frontend-repo-url> edverse-frontend
git clone <backend-repo-url> edverse-backend

# Install frontend dependencies
cd edverse-frontend
yarn install

# Install backend dependencies
cd ../edverse-backend/functions
npm install
```

### 2. Firebase Setup

```bash
# Login to Firebase
firebase login

# Set up Firebase project
firebase projects:list
firebase use <your-project-id>

# Start emulators for development
cd edverse-backend
firebase emulators:start
```

### 3. Environment Configuration

Create `.env.local` in the frontend directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Optional: Analytics
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Start Development

```bash
# Terminal 1: Start backend emulators
cd edverse-backend
firebase emulators:start

# Terminal 2: Start frontend dev server
cd edverse-frontend
yarn start
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Architecture Overview

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI wrappers
│   ├── layout/         # Layout components
│   └── dashboard/      # Dashboard-specific components
├── features/           # Feature-based modules
│   └── auth/          # Authentication feature
├── pages/             # Page components
├── lib/               # External configurations
├── types/             # TypeScript definitions
└── router/            # Routing configuration
```

### Backend Structure
```
functions/
├── src/
│   ├── auth/          # Authentication functions
│   ├── lib/           # Shared utilities
│   └── index.ts       # Functions entry point
├── firestore.rules    # Security rules
└── firestore.indexes.json # Database indexes
```

## 🔧 Development Workflow

### Code Quality Standards

The project enforces strict quality standards:

```bash
# Frontend linting and formatting
yarn lint          # Check for linting errors
yarn lint:fix      # Auto-fix linting issues
yarn format        # Format with Prettier

# Backend linting
cd functions
npm run lint       # Check functions code
npm run build      # Compile TypeScript
```

### Testing

```bash
# Frontend tests
yarn test                    # Run all tests
yarn test --coverage        # Run with coverage report
yarn test src/features/auth  # Test specific feature

# Backend tests
cd functions
npm test                    # Run function tests
```

### Git Workflow

Follow these conventions:

```bash
# Commit message format (Conventional Commits)
git commit -m "feat(auth): add role-based signup"
git commit -m "fix(ui): resolve button styling issue"
git commit -m "docs(setup): update environment variables"

# Branch naming
feature/auth-improvements
bugfix/login-validation
docs/api-documentation
```

## 🔐 Authentication System

### User Roles
- **Student**: Basic user with course enrollment capabilities
- **Instructor**: Can create and manage courses
- **Administrator**: Full system access

### Authentication Flow
1. User registers with personal details and role selection
2. Firebase Auth creates the account
3. User profile saved to Firestore
4. Backend trigger creates role-specific documents
5. Custom claims set for role-based access

### Key Components
- `AuthContext`: Global authentication state
- `ProtectedRoute`: Route protection wrapper
- `LoginForm` / `SignUpForm`: Authentication forms

## 🗄️ Database Schema

### Collections

#### `users/{uid}`
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Administrator';
  displayName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `students/{uid}` (for Student role)
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  enrolledCourses: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `instructors/{uid}` (for Instructor role)
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  courses: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🚀 Deployment

### Development Deployment

```bash
# Deploy backend to development
cd edverse-backend
firebase deploy --project dev

# Build and deploy frontend
cd edverse-frontend
yarn build
# Deploy to your hosting service
```

### Production Deployment

```bash
# Backend production deployment
firebase deploy --project production

# Frontend production build
yarn build
# Deploy build/ directory to production hosting
```

## 🧪 Firebase Emulator Usage

### Starting Emulators

```bash
# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only auth,firestore,functions

# Start with UI
firebase emulators:start --import=./emulator-data
```

### Emulator Ports
- **Auth**: http://localhost:9099
- **Firestore**: http://localhost:8080
- **Functions**: http://localhost:5001
- **Emulator UI**: http://localhost:4000

### Working with Test Data

```bash
# Export emulator data
firebase emulators:export ./test-data

# Import test data
firebase emulators:start --import=./test-data

# Clear emulator data
firebase emulators:start --import=./test-data --export-on-exit=./test-data
```

## 🔍 Debugging Tips

### Common Issues

1. **Firebase Config Errors**
   - Verify `.env.local` variables
   - Check Firebase project settings
   - Ensure emulators are running

2. **Authentication Issues**
   - Check browser console for Firebase errors
   - Verify Firestore security rules
   - Confirm custom claims are set

3. **Build Errors**
   - Run `yarn install` to update dependencies
   - Clear cache: `yarn start --reset-cache`
   - Check TypeScript errors: `yarn tsc --noEmit`

### Development Tools

- **React DevTools**: Browser extension for React debugging
- **Firebase DevTools**: Browser extension for Firebase debugging
- **Redux DevTools**: For state management debugging (if using Redux)

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project-Specific Docs
- [Authentication Feature Guide](../src/features/auth/README.md)
- [Backend Functions Documentation](../../edverse-backend/docs/functions.md)
- [UI Components Guide](../src/components/ui/README.md)

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Firebase emulators are running
4. Review the authentication flow documentation
5. Check Firebase project configuration

For additional support, refer to the project's issue tracker or team documentation. 