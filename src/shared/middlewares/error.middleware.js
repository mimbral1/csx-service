const { Prisma } = require('@prisma/client');
const { logger } = require('../../config/logger');

function errorMiddleware(error, req, res, next) {
  logger.error(
    {
      err: error,
      requestId: req.requestId,
      path: req.path,
      method: req.method
    },
    'Request failed'
  );

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Duplicate record',
        code: 'DUPLICATE_RECORD',
        requestId: req.requestId
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        message: 'Record not found',
        code: 'NOT_FOUND',
        requestId: req.requestId
      });
    }
  }

  if (error.isIntegrationError) {
    return res.status(502).json({
      message: error.message,
      code: 'EXTERNAL_SERVICE_ERROR',
      details: error.details,
      requestId: req.requestId
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
      requestId: req.requestId
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    requestId: req.requestId
  });
}

module.exports = { errorMiddleware };
