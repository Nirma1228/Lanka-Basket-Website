# Security Enhancement Dependencies

## Install these additional packages for enhanced security:

```bash
cd server
npm install express-rate-limit rate-limit-mongo validator isomorphic-dompurify
```

## Package Explanations:

1. **express-rate-limit**: Rate limiting middleware for Express applications
2. **rate-limit-mongo**: MongoDB store for express-rate-limit
3. **validator**: String validation and sanitization library
4. **isomorphic-dompurify**: Cross-platform HTML sanitization library

## Optional Advanced Security Packages (for future implementation):

```bash
npm install redis express-session connect-redis express-validator joi
```

1. **redis**: For session storage and caching
2. **express-session**: Advanced session management
3. **connect-redis**: Redis session store
4. **express-validator**: Advanced input validation
5. **joi**: Object schema validation

## Environment Variables to Add:

Add these to your `.env` file:

```env
# CSRF Protection
CSRF_SECRET=your-csrf-secret-key-here

# Rate Limiting
MONGODB_URI=your-mongodb-connection-string

# API Keys (optional)
VALID_API_KEYS=api-key-1,api-key-2

# Session Security
SESSION_SECRET=your-session-secret-key

# Redis Configuration (if using Redis)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```
