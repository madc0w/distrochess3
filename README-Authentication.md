# Authentication System

This application uses JWT (JSON Web Tokens) for authentication with persistent sessions.

## Features

- **Sign Up**: New users can create an account with name, email, and password
- **Sign In**: Existing users can log in with email and password
- **Persistent Sessions**: Once signed in, users stay signed in forever (or until they sign out)
- **No Session Expiration**: JWT tokens are generated without expiration dates
- **Client-Side State**: Auth state is stored in localStorage for persistence across page reloads

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=distrochess3
JWT_SECRET=your-secret-key-here-change-this-in-production
```

**Important**: Generate a secure `JWT_SECRET` for production:

```bash
openssl rand -base64 32
```

## API Endpoints

### POST `/api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "securepassword123"
}
```

**Response:**

```json
{
	"user": {
		"_id": "...",
		"email": "john@example.com",
		"name": "John Doe"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/api/auth/signin`

Authenticate an existing user.

**Request Body:**

```json
{
	"email": "john@example.com",
	"password": "securepassword123"
}
```

**Response:**

```json
{
	"user": {
		"_id": "...",
		"email": "john@example.com",
		"name": "John Doe"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Usage in Components

The `useAuth` composable provides authentication functionality:

```typescript
import { useAuth } from '~/composables/useAuth';

const { user, isAuthenticated, signup, signin, signout, getAuthHeader } =
	useAuth();

// Check if user is authenticated
if (isAuthenticated.value) {
	console.log('User is signed in:', user.value);
}

// Sign up
await signup('John Doe', 'john@example.com', 'password123');

// Sign in
await signin('john@example.com', 'password123');

// Sign out
signout();

// Make authenticated API calls
const headers = getAuthHeader();
await $fetch('/api/some-protected-endpoint', { headers });
```

## Security Notes

1. **Passwords**: Passwords are hashed using scrypt with random salts before storage
2. **JWT Secret**: Keep your `JWT_SECRET` secure and never commit it to version control
3. **HTTPS**: Always use HTTPS in production to protect tokens in transit
4. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
5. **No Expiration**: Tokens never expire - users must explicitly sign out

## Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  email: string,        // lowercase, unique
  name: string,         // user's full name
  passwordHash: string, // format: "salt:hash"
  createdAt: Date
}
```
