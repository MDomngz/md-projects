# TeacherAI Backend API Documentation

Base URL: `http://localhost:5000` (local) or `https://your-backend-url.com` (production)

---

## Authentication Endpoints

### 1. Register New User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "Jane Teacher",
  "email": "jane@school.edu",
  "password": "secure_password_here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Jane Teacher",
    "email": "jane@school.edu"
  }
}
```

**Error Responses:**
- `400` - Missing fields: `{ "error": "All fields required" }`
- `409` - User exists: `{ "error": "User already exists" }`

**Notes:**
- Password is hashed with bcryptjs before storage
- Token expires in 7 days
- Store token in localStorage for authenticated requests

---

### 2. Login User

**POST** `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "jane@school.edu",
  "password": "secure_password_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Jane Teacher",
    "email": "jane@school.edu"
  }
}
```

**Error Responses:**
- `400` - Missing fields: `{ "error": "Email and password required" }`
- `401` - Invalid credentials: `{ "error": "Invalid credentials" }`

**Notes:**
- Token valid for 7 days
- Include token in Authorization header for protected routes

---

## Profile Endpoints

All profile endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_token_here>
```

### 3. Get User Profile

**GET** `/api/profile`

Get current authenticated user's profile and saved prompts.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "name": "Jane Teacher",
  "email": "jane@school.edu",
  "savedPrompts": [1, 5, 12, 27],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - No token: `{ "error": "No token provided" }`
- `401` - Invalid token: `{ "error": "Invalid token" }`
- `404` - User not found: `{ "error": "User not found" }`

---

### 4. Save a Prompt

**POST** `/api/profile/save-prompt`

Add a prompt ID to user's saved list.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "promptId": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "savedPrompts": [1, 5, 12, 27]
}
```

**Error Responses:**
- `401` - Unauthorized: `{ "error": "Invalid token" }`
- `404` - User not found: `{ "error": "User not found" }`

**Notes:**
- Duplicate saves are ignored (won't add same prompt twice)
- promptId must be an integer matching an existing prompt

---

### 5. Remove a Prompt

**POST** `/api/profile/remove-prompt`

Remove a prompt from user's saved list.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "promptId": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "savedPrompts": [1, 12, 27]
}
```

**Error Responses:**
- `401` - Unauthorized: `{ "error": "Invalid token" }`
- `404` - User not found: `{ "error": "User not found" }`

---

## Feedback Endpoints

### 6. Submit Feedback

**POST** `/api/feedback`

Submit feedback (emailed to admin, not stored in database).

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Teacher",
  "email": "jane@school.edu",
  "message": "Feature request: ability to export all saved prompts as a PDF!\n\nAlso loving the multilingual support resources. Thanks!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Feedback sent successfully"
}
```

**Error Responses:**
- `400` - Missing message: `{ "error": "Message required" }`
- `500` - Email failed: `{ "error": "Failed to send feedback" }`

**Notes:**
- `name` and `email` are optional (can be anonymous)
- `message` is required
- Email is sent to ADMIN_EMAIL from .env
- Does not store feedback in database (only emailed)
- Email includes timestamp of submission
- Feedback format uses HTML email for readability

---

## Utility Endpoints

### 7. Health Check

**GET** `/api/health`

Check if backend is running.

**Success Response (200):**
```json
{
  "status": "TeacherAI Backend is running"
}
```

**Notes:**
- No authentication required
- Use this to verify backend availability

---

## Authentication Flow Example (Frontend)

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Teacher',
    email: 'jane@school.edu',
    password: 'securepassword'
  })
});

const { token } = await registerResponse.json();
localStorage.setItem('token', token);

// 2. Make authenticated request
const profileResponse = await fetch('http://localhost:5000/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const profile = await profileResponse.json();
console.log(profile.savedPrompts); // [1, 5, 12]

// 3. Save a prompt
const saveResponse = await fetch('http://localhost:5000/api/profile/save-prompt', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ promptId: 27 })
});

const { savedPrompts } = await saveResponse.json();
console.log(savedPrompts); // [1, 5, 12, 27]

// 4. Submit feedback
const feedbackResponse = await fetch('http://localhost:5000/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Teacher',
    email: 'jane@school.edu',
    message: 'Love this tool!'
  })
});

const feedbackResult = await feedbackResponse.json();
console.log(feedbackResult.message); // "Feedback sent successfully"
```

---

## Rate Limiting (Recommended for Production)

Consider implementing rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // max 3 feedback submissions per 15 min
  message: 'Too many feedback submissions, please try again later'
});

app.post('/api/feedback', feedbackLimiter, (req, res) => {
  // ... existing feedback code
});
```

---

## Error Handling Best Practices

When making requests:

```javascript
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Error ${response.status}:`, data.error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

---

## CORS Configuration

Frontend must make requests to backend. Configure CORS:

**Development:**
```javascript
app.use(cors()); // Allow all origins
```

**Production:**
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## Database Schema (When Moving to PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved prompts (junction table)
CREATE TABLE saved_prompts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  prompt_id INTEGER NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback logs
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_saved_prompts_user ON saved_prompts(user_id);
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing or invalid token | Include valid JWT in Authorization header |
| 409 Conflict | User already exists | Use different email address or login |
| 500 Server Error | Email failed to send | Check EMAIL_USER, EMAIL_PASSWORD in .env |
| CORS error | Frontend domain not allowed | Update CORS config in backend |
| "Invalid token" | Token expired (7 days) | User must login again |

---

## Support

Issues? Contact: marisa.dominguez@oddball.io

For detailed setup instructions, see DEPLOYMENT_GUIDE.md
