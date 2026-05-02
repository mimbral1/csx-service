const { Kafka } = require('kafkajs');
const { env } = require('../../config/env');
const { logger } = require('../../config/logger');

const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(',').map(broker => broker.trim())
});

const producer = kafka.producer();

let isConnected = false;

async function connectProducer() {
  if (isConnected) return;

  await producer.connect();
  isConnected = true;

  logger.info('Kafka producer connected');
}

async function publishKafkaMessage({ topic, key, payload, headers }) {
  await connectProducer();

  await producer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(payload),
        headers: headers || {}
      }
    ]
  });
}

module.exports = {
  connectProducer,
  publishKafkaMessage
};
