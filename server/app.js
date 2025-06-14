import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/session.js';
import videoRoutes from './routes/video.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes);
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/videos', videoRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

export default app; 