const { env } = require('../../config/env');
const { logger } = require('../../config/logger');
const { OutboxRepository } = require('./outbox.repository');
const { publishKafkaMessage } = require('../kafka/kafka-producer');

const outboxRepository = new OutboxRepository();

let isRunning = false;

async function processOutbox() {
  if (isRunning) return;

  isRunning = true;

  try {
    await outboxRepository.resetFailedToPending({ maxRetries: 5 });

    const events = await outboxRepository.findPending({ take: 50 });

    for (const event of events) {
      try {
        await outboxRepository.markProcessing(event.id);

        await publishKafkaMessage({
          topic: event.topic,
          key: event.aggregateId,
          payload: JSON.parse(event.payloadJson),
          headers: event.headersJson ? JSON.parse(event.headersJson) : {}
        });

        await outboxRepository.markPublished(event.id);
      } catch (error) {
        logger.error({ err: error, eventId: event.id }, 'Outbox publish failed');

        await outboxRepository.markFailed(event.id, error.message);
      }
    }
  } catch (error) {
    logger.error({ err: error }, 'Outbox job failed');
  } finally {
    isRunning = false;
  }
}

function startOutboxPublisherJob() {
  const intervalMs = env.OUTBOX_JOB_INTERVAL_SECONDS * 1000;

  setInterval(processOutbox, intervalMs);

  logger.info(`Outbox publisher job started every ${intervalMs}ms`);
}

module.exports = {
  startOutboxPublisherJob,
  processOutbox
};
