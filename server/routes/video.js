import express from 'express';
import jwt from 'jsonwebtoken';
import Video from '../models/Video.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// GET all videos for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

export default router;
