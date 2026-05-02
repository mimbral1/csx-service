const { prisma } = require('../prisma/prisma-client');

class OutboxRepository {
  async create(data) {
    return prisma.outboxEvent.create({
      data: {
        topic: data.topic,
        eventName: data.eventName,
        aggregateType: data.aggregateType,
        aggregateId: data.aggregateId,
        payloadJson: JSON.stringify(data.payload),
        headersJson: data.headers ? JSON.stringify(data.headers) : null,
        status: 'pending'
      }
    });
  }

  async findPending({ take = 50 }) {
    return prisma.outboxEvent.findMany({
      where: {
        status: 'pending'
      },
      orderBy: {
        dateCreated: 'asc'
      },
      take
    });
  }

  async markProcessing(id) {
    return prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'processing'
      }
    });
  }

  async markPublished(id) {
    return prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });
  }

  async markFailed(id, errorMessage) {
    const current = await prisma.outboxEvent.findUnique({
      where: { id }
    });

    return prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'failed',
        retryCount: Number(current?.retryCount || 0) + 1,
        errorMessage: String(errorMessage).slice(0, 4000)
      }
    });
  }

  async resetFailedToPending({ maxRetries = 5 }) {
    return prisma.outboxEvent.updateMany({
      where: {
        status: 'failed',
        retryCount: {
          lt: maxRetries
        }
      },
      data: {
        status: 'pending'
      }
    });
  }
}

module.exports = { OutboxRepository };
