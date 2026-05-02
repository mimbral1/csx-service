const { env } = require('./config/env');
const { logger } = require('./config/logger');
const { prisma } = require('./shared/prisma/prisma-client');
const { app } = require('./app');

const server = app.listen(env.PORT, () => {
  logger.info(`csx-service listening on port ${env.PORT}`);
});

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down server');

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', error => {
  logger.error({ err: error }, 'Unhandled rejection');
});

process.on('uncaughtException', error => {
  logger.error({ err: error }, 'Uncaught exception');
  process.exit(1);
});
