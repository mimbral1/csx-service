const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().positive().default(3022),

  DATABASE_URL: z.string().min(1),

  API_KEY: z.string().min(1),
  API_SECRET: z.string().min(1),

  KAFKA_CLIENT_ID: z.string().default('csx-service'),
  KAFKA_BROKERS: z.string().default('localhost:9092'),

  LOG_LEVEL: z.string().default('info'),

  DEFAULT_PAGE_SIZE: z.coerce.number().positive().default(60),
  MAX_PAGE_SIZE: z.coerce.number().positive().default(100),

  SLA_JOB_INTERVAL_SECONDS: z.coerce.number().positive().default(60),
  OUTBOX_JOB_INTERVAL_SECONDS: z.coerce.number().positive().default(10),

  INTEGRATIONS_MODE: z.enum(['mock', 'http']).default('mock'),

  OMS_SERVICE_URL: z.string().optional(),
  INVENTORY_SERVICE_URL: z.string().optional(),
  PACKING_SERVICE_URL: z.string().optional(),
  DELIVERY_SERVICE_URL: z.string().optional(),
  FINANCE_SERVICE_URL: z.string().optional(),
  NOTIFICATION_SERVICE_URL: z.string().optional(),

  INTEGRATION_TIMEOUT_MS: z.coerce.number().positive().default(5000)
}).superRefine((value, ctx) => {
  if (value.INTEGRATIONS_MODE !== 'http') {
    return;
  }

  const requiredUrls = [
    'OMS_SERVICE_URL',
    'INVENTORY_SERVICE_URL',
    'PACKING_SERVICE_URL',
    'DELIVERY_SERVICE_URL',
    'FINANCE_SERVICE_URL',
    'NOTIFICATION_SERVICE_URL'
  ];

  for (const key of requiredUrls) {
    if (!value[key]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [key],
        message: `${key} is required when INTEGRATIONS_MODE=http`
      });
    }
  }
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables', result.error.flatten());
  process.exit(1);
}

const env = result.data;

module.exports = { env };
