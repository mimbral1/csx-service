process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '3022';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'sqlserver://localhost:1433;database=csx_service;user=sa;password=YourStrongPassword123;trustServerCertificate=true';
process.env.API_KEY = process.env.API_KEY || 'mimbral-csx-api-key';
process.env.API_SECRET = process.env.API_SECRET || 'mimbral-csx-api-secret';
process.env.KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'csx-service';
process.env.KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'localhost:9092';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'silent';
process.env.DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE || '60';
process.env.MAX_PAGE_SIZE = process.env.MAX_PAGE_SIZE || '100';
process.env.SLA_JOB_INTERVAL_SECONDS = process.env.SLA_JOB_INTERVAL_SECONDS || '60';
process.env.OUTBOX_JOB_INTERVAL_SECONDS = process.env.OUTBOX_JOB_INTERVAL_SECONDS || '10';
process.env.INTEGRATIONS_MODE = process.env.INTEGRATIONS_MODE || 'mock';
process.env.INTEGRATION_TIMEOUT_MS = process.env.INTEGRATION_TIMEOUT_MS || '5000';
