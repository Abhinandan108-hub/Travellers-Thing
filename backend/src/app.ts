import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes';
import destinationRoutes from './routes/destinationRoutes';
import packageRoutes from './routes/packageRoutes';
import blogRoutes from './routes/blogRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import bookingRoutes from './routes/bookingRoutes';

// Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app: Application = express();

// Core middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - Properly configured for development and production
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000']; // Vite default + fallback

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Travellers Thing API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route (optional welcome/redirect)
// This prevents a 404 when hitting http://localhost:5000 directly.
app.get('/', (_req, res) => {
  // either send a simple message or redirect to health
  // return res.redirect('/api/health');
  res.status(200).json({
    success: true,
    message: 'Welcome to Travellers Thing API. Visit /api/health for status.',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;