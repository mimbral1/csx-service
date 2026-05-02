const { env } = require('../../config/env');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { ForbiddenError } = require('../errors/ForbiddenError');

function authMiddleware(req, res, next) {
  const apiKey = req.headers['mimbral-api-key'] || req.headers['janis-api-key'];
  const apiSecret = req.headers['mimbral-api-secret'] || req.headers['janis-api-secret'];
  const client = req.headers['mimbral-client'] || req.headers['janis-client'];

  if (!apiKey || !apiSecret) {
    return next(new UnauthorizedError('API key and API secret are required'));
  }

  if (apiKey !== env.API_KEY || apiSecret !== env.API_SECRET) {
    return next(new ForbiddenError('Invalid API credentials'));
  }

  req.auth = {
    client: client || 'mimbral',
    apiKey
  };

  next();
}

module.exports = { authMiddleware };
