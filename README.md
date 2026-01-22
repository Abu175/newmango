# Codilore - AI-Powered Code Assistant

A secure authentication system and AI-powered code assistance platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Secure Authentication**: User registration and login with bcrypt password hashing and JWT tokens
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **API-First**: RESTful API endpoints for authentication
- **Extensible**: Designed for easy integration with external authentication servers

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: bcryptjs for password hashing, jsonwebtoken for tokens
- **Database**: In-memory storage (replace with real database for production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd apps/codilore
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your JWT secret:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

## Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Input Validation**: Server-side validation for all inputs
- **Password Strength**: Minimum 8 characters required
- **HTTPS Ready**: Designed for secure deployment

## Project Structure

```
apps/codilore/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/auth/        # Authentication API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   └── Dashboard.tsx   # Main dashboard
│   └── lib/                # Utility libraries
│       └── auth.ts         # Authentication service
├── .env.local              # Environment variables
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Future Enhancements

- **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
- **Email Verification**: Add email confirmation for new registrations
- **Password Reset**: Implement forgot password functionality
- **OAuth Integration**: Add Google, GitHub login options
- **Role-Based Access**: User roles and permissions
- **API Rate Limiting**: Prevent abuse with rate limiting
- **Audit Logging**: Track authentication events

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | Development fallback |
| `NEXTAUTH_URL` | Next.js authentication URL | http://localhost:3000 |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Development fallback |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Kilo Code ecosystem. See the main LICENSE file for details.

## Firebase Realtime Database (optional)

1. Create a Firebase project and generate a service account JSON (Project Settings → Service Accounts → Generate new private key).
2. Add the file path to `.env.local` using `FIREBASE_SERVICE_ACCOUNT_PATH` or paste the JSON into `FIREBASE_SERVICE_ACCOUNT_JSON`.
3. Set the Realtime Database URL with `FIREBASE_DATABASE_URL`.
4. Start the dev server:
```powershell
npm run dev
```
5. Test the server-side connectivity by visiting:
```
http://localhost:3000/api/firebase-test
```

The endpoint writes to `/test/healthcheck` and returns the stored object on success.