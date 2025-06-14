import express from 'express';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware to verify JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Save workout session
router.post('/', auth, async (req, res) => {
  const { exercise, feedback, accuracy } = req.body;
  try {
    const session = new Session({
      userID: req.user.userId,
      exercise,
      feedback,
      accuracy
    });
    await session.save();
    res.status(201).json({ message: 'Session saved', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const sessions = await Session.find({ userID: req.params.userId }).sort({ timestamp: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 