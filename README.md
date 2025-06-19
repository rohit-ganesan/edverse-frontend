# EdVerse

A modern React + TypeScript learning platform built with Firebase.

## Features

- 🔐 **Authentication**: Email/password and Google sign-in with Firebase Auth
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔧 **TypeScript**: Fully typed with strict TypeScript configuration
- 🧪 **Testing**: Jest testing setup with coverage
- 🚀 **CI/CD**: GitHub Actions pipeline for linting and building
- 📦 **Code Quality**: ESLint + Prettier with pre-commit hooks

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd edverse
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `yarn start` - Runs the app in development mode
- `yarn test` - Launches the test runner
- `yarn build` - Builds the app for production
- `yarn lint` - Runs ESLint to check for linting errors
- `yarn lint:fix` - Fixes auto-fixable linting errors
- `yarn format` - Formats code with Prettier

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   └── ProtectedRoute.tsx
├── features/           # Feature-based modules
│   └── auth/          # Authentication feature
│       ├── components/ # Auth-specific components
│       └── AuthContext.tsx
├── lib/               # External library configurations
│   └── firebase.ts
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── App.tsx
└── index.tsx
```

## Firebase Configuration

The Firebase configuration is already set up in `src/lib/firebase.ts`. The following services are initialized:

- **Authentication**: For user management
- **Firestore**: For database operations (ready for Phase 2)
- **Storage**: For file uploads (ready for Phase 2)
- **Analytics**: For usage tracking

## Authentication

The app includes a complete authentication system with:

- Email/password signup and login
- Google OAuth integration
- Protected routes for authenticated users
- Automatic redirect handling
- Loading states and error handling

## Code Style

The project enforces strict code quality standards:

- **TypeScript**: Strict mode enabled with no implicit any
- **ESLint**: Airbnb configuration with TypeScript support
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks to enforce quality

## Testing

Tests are written using Jest and React Testing Library. Run tests with:

```bash
yarn test
```

## CI/CD

The project includes a GitHub Actions workflow that:

1. Installs dependencies
2. Runs ESLint (fails on warnings)
3. Checks Prettier formatting
4. Runs tests with coverage
5. Builds the application

### 📦 **Ready to Run:**
```bash
yarn install  # Install dependencies
yarn start    # Start development server
yarn test     # Run tests
yarn build    # Build for production
```

The project is now ready for development with Yarn! The Firebase configuration is already set up with your provided credentials, and all authentication features are implemented and working.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.