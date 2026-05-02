const { env } = require('../../../config/env');
const { logger } = require('../../../config/logger');

const { CheckExpiredClaimsUseCase } = require('../application/check-expired-claims.usecase');

const { claimRepository } = require('../../claim');

const {
  PrismaClaimHistoryRepository
} = require('../../claim-history/infrastructure/claim-history.prisma.repository');

const { OutboxRepository } = require('../../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../../shared/outbox/outbox.service');

const claimHistoryRepository = new PrismaClaimHistoryRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const checkExpiredClaimsUseCase = new CheckExpiredClaimsUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

let isRunning = false;

async function processSlaMonitor() {
  if (isRunning) return [];

  isRunning = true;

  try {
    const expiredClaims = await checkExpiredClaimsUseCase.execute();

    if (expiredClaims.length > 0) {
      logger.warn(
        {
          total: expiredClaims.length
        },
        'Expired claims detected'
      );
    }

    return expiredClaims;
  } catch (error) {
    logger.error({ err: error }, 'SLA monitor failed');
    return [];
  } finally {
    isRunning = false;
  }
}

function startSlaMonitorJob() {
  const intervalMs = env.SLA_JOB_INTERVAL_SECONDS * 1000;

  setInterval(processSlaMonitor, intervalMs);

  logger.info(`SLA monitor job started every ${intervalMs}ms`);
}

module.exports = {
  startSlaMonitorJob,
  processSlaMonitor
};
