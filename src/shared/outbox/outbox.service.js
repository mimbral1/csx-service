class OutboxService {
  constructor({ outboxRepository }) {
    this.outboxRepository = outboxRepository;
  }

  async publish({ topic, eventName, aggregateType, aggregateId, payload, headers }) {
    return this.outboxRepository.create({
      topic,
      eventName,
      aggregateType,
      aggregateId,
      payload,
      headers
    });
  }
}

module.exports = { OutboxService };
