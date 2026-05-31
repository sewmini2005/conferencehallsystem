const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-secret-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

const refreshTokens = new Set();

const users = [
  {
    id: 1,
    email: '200561903346',
    password: 'Itmd@#4321',
    name: 'Hall Booking User',
    role: 'admin',
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signning.html'));
});

const validateJWSToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Missing or invalid authorization header.',
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token is invalid or expired.',
    });
  }
};

const handleSignin = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
    });
  }

  const user = users.find(
    (item) => item.email.toLowerCase() === String(email).toLowerCase() && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    });
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  refreshTokens.add(refreshToken);

  return res.json({
    message: 'Authenticated successfully.',
    tokenType: 'Bearer',
    accessToken,
    refreshToken,
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

app.post('/auth/signin', handleSignin);
app.post('/api/auth/login', handleSignin);

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required.',
    });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({
      message: 'Invalid refresh token.',
    });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = users.find((u) => u.id === payload.sub);

    if (!user) {
      return res.status(401).json({
        message: 'User not found.',
      });
    }

    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Token refreshed successfully.',
      accessToken: newAccessToken,
      expiresIn: 3600,
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Refresh token is invalid or expired.',
    });
  }
});

app.post('/auth/logout', (req, res) => {
  const { refreshToken } = req.body || {};

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  return res.json({
    message: 'Logged out successfully.',
  });
});

app.get('/api/me', validateJWSToken, (req, res) => {
  return res.json({
    message: 'Token is valid.',
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${8080}`);
});
