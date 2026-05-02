const express = require('express');

const { env } = require('./config/env');
const routes = require('./routes');
const { requestIdMiddleware } = require('./shared/middlewares/request-id.middleware');
const { errorMiddleware } = require('./shared/middlewares/error.middleware');
const { AppError } = require('./shared/errors/AppError');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);

  app.get('/health', (req, res) => {
    res.status(200).json({
      service: 'csx-service',
      status: 'ok',
      environment: env.NODE_ENV
    });
  });

  app.use('/api', routes);

  app.use((req, res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND'));
  });

  app.use(errorMiddleware);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
