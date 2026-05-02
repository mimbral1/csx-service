const { z } = require('zod');
const { createBaseCrudSchemas } = require('../../../shared/crud/crud.schema');

const createBodySchema = z.object({
  name: z.string().min(1),
  rangeLow: z.number(),
  rangeHigh: z.number(),
  color: z.string().min(1),
  alerts: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional()
});

const updateBodySchema = createBodySchema.partial();

module.exports = createBaseCrudSchemas({
  createBodySchema,
  updateBodySchema
});
