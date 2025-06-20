# Authentication Feature

This module handles all authentication-related functionality for the EdVerse application.

## 🏗️ Architecture

The authentication system is built around Firebase Auth with custom user profiles stored in Firestore.

### Key Components

- **AuthContext**: Provides authentication state and methods throughout the app
- **LoginForm**: Email/password login with validation
- **SignUpForm**: User registration with role selection and profile creation
- **ProtectedRoute**: HOC that guards authenticated routes

## 🔄 Authentication Flow

### Sign Up Flow

1. User fills out signup form with personal details and role selection
2. `signUp()` function creates Firebase Auth account
3. User profile is saved to Firestore `users/{uid}` collection
4. Backend trigger `onUserCreate` processes the new user:
   - Sets custom claims based on role
   - Creates role-specific documents (Student/Instructor)
5. User is automatically signed in and redirected

### Sign In Flow

1. User provides email/password credentials
2. `signIn()` function authenticates with Firebase Auth
3. User data is fetched from Firestore
4. Authentication state is updated in context
5. User is redirected to intended destination

### Protected Routes

- `ProtectedRoute` component wraps authenticated pages
- Checks `user` from `useAuth()` hook
- Redirects to `/login` if unauthenticated
- Preserves original requested path for post-login redirect

## 🪝 Available Hooks

### `useAuth()`

Primary hook for accessing authentication state and methods.

```typescript
const {
  user, // Current user object or null
  loading, // Authentication loading state
  signIn, // (email, password) => Promise<void>
  signUp, // (formData, profile) => Promise<void>
  signOut, // () => Promise<void>
  updateProfile, // (updates) => Promise<void>
} = useAuth();
```

### Usage Examples

#### Check Authentication Status

```typescript
function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.displayName}!</div>;
}
```

#### Sign In

```typescript
function LoginForm() {
  const { signIn } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // User is automatically redirected
    } catch (error) {
      // Handle error
    }
  };
}
```

#### Sign Up

```typescript
function SignUpForm() {
  const { signUp } = useAuth();

  const handleSubmit = async (formData: AuthFormData) => {
    const profile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      displayName: `${formData.firstName} ${formData.lastName}`,
    };

    try {
      await signUp(formData, profile);
      // User is automatically signed in and redirected
    } catch (error) {
      // Handle error
    }
  };
}
```

## 🎯 User Roles

The system supports three user roles:

- **Student**: Can enroll in courses, view materials, submit assignments
- **Instructor**: Can create courses, manage students, grade assignments
- **Administrator**: Full system access, user management, system configuration

Role-based access is enforced through:

- Firebase Auth custom claims
- Firestore security rules
- Frontend route protection

## 🔒 Security Features

- **Input Validation**: All forms use Zod schemas for validation
- **XSS Prevention**: User inputs are sanitized
- **HTTPS Enforcement**: All API calls use HTTPS
- **Custom Claims**: Role-based permissions via Firebase Auth
- **Protected Routes**: Authentication required for sensitive pages

## 🧪 Testing

Authentication components are tested with Jest and React Testing Library:

```bash
# Run auth tests
npm test src/features/auth

# Run with coverage
npm test src/features/auth -- --coverage
```

### Test Coverage

- AuthContext provider behavior
- Sign in/out functionality
- Form validation and submission
- Protected route redirects
- Error handling scenarios

## 🔧 Configuration

### Firebase Setup

Authentication is configured in `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Environment Variables

Required environment variables (add to `.env.local`):

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🚀 Development

### Adding New Auth Features

1. Add new methods to `AuthContext`
2. Update the `AuthContextType` interface
3. Implement the logic in the provider
4. Add corresponding UI components
5. Write tests for new functionality

### Debugging

- Check browser console for Firebase errors
- Use Firebase Auth emulator for local testing
- Monitor Firestore security rule denials
- Verify custom claims are set correctly
