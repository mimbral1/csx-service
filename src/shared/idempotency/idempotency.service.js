const crypto = require('crypto');
const { prisma } = require('../prisma/prisma-client');
const { AppError } = require('../errors/AppError');

class IdempotencyService {
  buildRequestHash(body) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(body || {}))
      .digest('hex');
  }

  async start({ key, scope, body }) {
    if (!key) {
      return {
        mode: 'no-idempotency'
      };
    }

    const requestHash = this.buildRequestHash(body);

    const existing = await prisma.idempotencyKey.findUnique({
      where: { key }
    });

    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new AppError(
          'Idempotency key was already used with a different payload',
          409,
          'IDEMPOTENCY_CONFLICT'
        );
      }

      if (existing.status === 'completed' && existing.responseJson) {
        return {
          mode: 'replay',
          response: JSON.parse(existing.responseJson)
        };
      }

      if (existing.status === 'processing') {
        throw new AppError(
          'Request is already being processed',
          409,
          'REQUEST_IN_PROGRESS'
        );
      }

      await prisma.idempotencyKey.update({
        where: { key },
        data: {
          scope,
          status: 'processing',
          errorMessage: null
        }
      });

      return {
        mode: 'new'
      };
    }

    await prisma.idempotencyKey.create({
      data: {
        key,
        scope,
        requestHash,
        status: 'processing'
      }
    });

    return {
      mode: 'new'
    };
  }

  async complete({ key, response }) {
    if (!key) return;

    await prisma.idempotencyKey.update({
      where: { key },
      data: {
        status: 'completed',
        responseJson: JSON.stringify(response)
      }
    });
  }

  async fail({ key, errorMessage }) {
    if (!key) return;

    await prisma.idempotencyKey.update({
      where: { key },
      data: {
        status: 'failed',
        errorMessage: String(errorMessage).slice(0, 4000)
      }
    });
  }
}

module.exports = { IdempotencyService };
