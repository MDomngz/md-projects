/**
 * TeacherAI Backend Server
 * Express.js backend with user authentication and email feedback forwarding
 *
 * Setup:
 * npm install express cors dotenv jsonwebtoken bcryptjs nodemailer
 * Create .env file with:
 *   PORT=5000
 *   JWT_SECRET=your_secret_key_here
 *   EMAIL_USER=your_email@gmail.com
 *   EMAIL_PASSWORD=your_app_password
 *   ADMIN_EMAIL=marisa.dominguez@oddball.io
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = new Map();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// ==================== AUTHENTICATION ROUTES ====================

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    if (users.has(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user
    users.set(email, {
      name,
      email,
      password: hashedPassword,
      savedPrompts: [],
      createdAt: new Date()
    });

    // Create JWT token
    const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { name, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { name: user.name, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== PROFILE ROUTES ====================

/**
 * Middleware: Verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * GET /api/profile
 * Get current user profile
 */
app.get('/api/profile', verifyToken, (req, res) => {
  const user = users.get(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    name: user.name,
    email: user.email,
    savedPrompts: user.savedPrompts,
    createdAt: user.createdAt
  });
});

/**
 * POST /api/profile/save-prompt
 * Save a prompt to user profile
 */
app.post('/api/profile/save-prompt', verifyToken, (req, res) => {
  const { promptId } = req.body;
  const user = users.get(req.user.email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.savedPrompts.includes(promptId)) {
    user.savedPrompts.push(promptId);
  }

  res.json({ success: true, savedPrompts: user.savedPrompts });
});

/**
 * POST /api/profile/remove-prompt
 * Remove a prompt from user profile
 */
app.post('/api/profile/remove-prompt', verifyToken, (req, res) => {
  const { promptId } = req.body;
  const user = users.get(req.user.email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.savedPrompts = user.savedPrompts.filter(id => id !== promptId);

  res.json({ success: true, savedPrompts: user.savedPrompts });
});

// ==================== FEEDBACK ROUTES ====================

/**
 * POST /api/feedback
 * Submit user feedback (emails to admin, does not store in DB)
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `TeacherAI Feedback from ${name || 'Anonymous'}`,
      html: `
        <h2>New TeacherAI Feedback</h2>
        <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Feedback sent successfully'
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

// ==================== UTILITY ROUTES ====================

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'TeacherAI Backend is running' });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TeacherAI Backend running on port ${PORT}`);
});

module.exports = app;