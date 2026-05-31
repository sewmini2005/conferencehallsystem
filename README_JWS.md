# Hall Booking JWT/JWS Authentication Demo

This workspace includes a JWT/JWS authentication API and sign-in page with token refresh capability.

## Features
- JWT access tokens (1 hour expiration)
- JWS refresh tokens (7 days expiration)
- Token refresh endpoint
- Token validation middleware
- Sign-in page with refresh and logout buttons

## API Endpoints

### POST /auth/signin
**Headers:**
- Content-Type: application/json

**Request body:**
```json
{
  "email": "200561903346",
  "password": "Itmd@#4321"
}
```

**Response:**
```json
{
  "message": "Authenticated successfully.",
  "tokenType": "Bearer",
  "accessToken": "<jws-token>",
  "refreshToken": "<refresh-token>",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "email": "200561903346",
    "name": "Hall Booking User",
    "role": "admin"
  }
}
```

### POST /auth/refresh
**Request body:**
```json
{
  "refreshToken": "<refresh-token>"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully.",
  "accessToken": "<new-jws-token>",
  "expiresIn": 3600
}
```

### POST /auth/logout
**Request body:**
```json
{
  "refreshToken": "<refresh-token>"
}
```

**Response:**
```json
{
  "message": "Logged out successfully."
}
```

### GET /api/me
**Headers:**
- Authorization: Bearer <accessToken>

**Response:**
```json
{
  "message": "Token is valid.",
  "user": {
    "sub": 1,
    "email": "200561903346",
    "name": "Hall Booking User",
    "role": "admin",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

## Compatibility
- The old endpoint `POST /api/auth/login` is still accepted.

## Run
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open http://localhost:3000 in a browser
