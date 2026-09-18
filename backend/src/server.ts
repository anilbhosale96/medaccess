import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { auditLoggerMiddleware } from './middleware/audit.middleware';
import apiRouter from './routes/api.routes';

const app = express();

// Security & Parsing Middlewares
app.use(cors({
  origin: '*', // Allows Vercel frontend or local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-staff-id']
}));
// Body parsing middleware with Vercel serverless compatibility
app.use((req, res, next) => {
  if (req.body !== undefined && req.body !== null && (typeof req.body === 'object' || typeof req.body === 'string')) {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch {
        // keep as is
      }
    }
    return next();
  }
  express.json({ limit: '10mb' })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

app.use(auditLoggerMiddleware);

// Base Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MedAccess Emergency API',
    timestamp: new Date().toISOString(),
    env: ENV.NODE_ENV
  });
});

// Mount Main API Routes
app.use('/api/v1', apiRouter);

// Fallback 404
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Only listen to port when running standalone (not inside Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(ENV.PORT, () => {
    console.log(`
===========================================================
  🏥 MEDACCESS EMERGENCY SERVER ONLINE
  📡 Port: ${ENV.PORT}
  🌍 Mode: ${ENV.NODE_ENV}
  🔗 API:  http://localhost:${ENV.PORT}/api/v1
  🩺 Health: http://localhost:${ENV.PORT}/health
===========================================================
    `);
  });
}

export default app;


