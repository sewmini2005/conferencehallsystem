# Hall Booking Authentication Demo

This workspace now includes a simple JWT authentication API and a sign-in page.

## What it does
- Accepts JSON requests with `Content-Type: application/json`
- Authenticates a user
- Returns a JWT token
- Stores the token in the browser for later use

## API
### POST /auth/signin
Headers:
- Content-Type: application/json

Request body:
```json
{
  "email": "200561903346",
  "password": "Itmd@#4321"
}
```

Response:
```json
{
  "message": "Authenticated successfully.",
  "tokenType": "Bearer",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "200561903346",
    "name": "Hall Booking User",
    "role": "admin"
  }
}
```

## Compatibility
- The old endpoint `POST /api/auth/login` is still accepted.

## Run
1. Install dependencies.
2. Start the server.
3. Open the root page in a browser.
