# EdVerse Frontend

A modern, comprehensive learning management system built with React, TypeScript, and Supabase.

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs/) folder:

- **[Documentation Index](./docs/README.md)** - Complete documentation navigation
- **[Access Control Guide](./docs/ACCESS_CONTROL_ANALYSIS_README.md)** - Access control implementation
- **[JWT Onboarding](./docs/JWT_ONBOARDING_VISUAL_SUMMARY.md)** - User onboarding flow
- **[Environment Setup](./docs/ENVIRONMENT_VARIABLES.md)** - Configuration guide
- **[Access Control Matrix](./docs/ACCESS_CONTROL_MATRIX.md)** - Role and plan permissions

## 🚀 Features

- **Modern React Architecture** - Built with React 18, TypeScript, and functional components
- **Supabase Backend** - Real-time database, authentication, and storage
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Role-Based Access** - Administrator, Instructor, and Student roles
- **File Management** - Secure file uploads with Supabase Storage
- **Real-time Updates** - Live notifications and data synchronization
- **Dark Mode Support** - Complete theme switching functionality
- **Type Safety** - Full TypeScript implementation with strict mode

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Context + Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edverse-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_API_BASE_URL=http://localhost:54321/functions/v1
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix wrappers)
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── dashboard/      # Dashboard-specific components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication system
│   ├── courses/        # Course management
│   ├── students/       # Student management
│   └── instructors/    # Instructor management
├── pages/              # Page components
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client configuration
│   ├── supabase-api.ts # API functions for Edge Functions
│   └── supabase-storage.ts # Storage utilities
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
└── router/             # Routing configuration
```

## 🔐 Authentication

The application uses Supabase Authentication with the following features:

- **Email/Password Authentication**
- **Password Reset Flow**
- **Role-Based Access Control**
- **Session Management**
- **Protected Routes**

### User Roles

- **Administrator**: Full system access
- **Instructor**: Course and student management
- **Student**: Course enrollment and materials access

## 📁 File Management

Supabase Storage is used for secure file management:

- **Profile Avatars**: User profile pictures
- **Course Materials**: Educational content and resources
- **Notice Attachments**: Document attachments for announcements
- **Student Documents**: Academic records and certificates
- **Instructor Documents**: Teaching materials and credentials

### Storage Buckets

- `profile-avatars` - Public access for profile pictures
- `course-materials` - Public access for educational content
- `notice-attachments` - Public access for announcements
- `student-documents` - Private access for student records
- `instructor-documents` - Private access for instructor files

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Configuration

Tests use a separate Supabase test instance:

```env
REACT_APP_SUPABASE_TEST_URL=http://localhost:54321
REACT_APP_SUPABASE_TEST_ANON_KEY=your_test_anon_key
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set the following in Vercel:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. **Deploy**: Push to main branch for automatic deployment

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔧 Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run type-check # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the component naming convention
- Use Radix UI primitives for base components
- Apply Tailwind CSS for styling

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **JWT Authentication** for API access
- **CORS** properly configured
- **Input Validation** on all forms
- **File Type Validation** for uploads
- **Rate Limiting** on API endpoints

## 📊 Performance

- **Code Splitting** with React.lazy
- **Image Optimization** with proper sizing
- **Bundle Analysis** with webpack-bundle-analyzer
- **Caching** strategies for static assets
- **Lazy Loading** for non-critical components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Documentation**: Check the [comprehensive documentation](./docs/README.md) in `/docs/`
- **Issues**: Create an issue in the repository
- **Supabase**: Review the [Supabase documentation](https://supabase.com/docs)
- **Access Control**: See [Access Control guides](./docs/ACCESS_CONTROL_ANALYSIS_README.md)

## 🔄 Backend Integration

This project uses Supabase for backend services:

- **Backend Repository**: See [edverse-backend](../edverse-backend/README.md) for Edge Functions and database schema
- **Access Control**: Implemented with JWT + Simplified RLS (see [documentation](./docs/ACCESS_CONTROL_DECISION_SUMMARY.md))
- **Multi-tenant**: Full multi-tenant support with plan-based feature gating