const { z } = require('zod');
const { createBaseCrudSchemas } = require('../../../shared/crud/crud.schema');

const createBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),

  isInitial: z.boolean().default(false),
  isFinal: z.boolean().default(false),
  isNotifiable: z.boolean().default(false),

  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),

  status: z.enum(['active', 'inactive']).optional()
});

const updateBodySchema = createBodySchema.partial();

module.exports = createBaseCrudSchemas({
  createBodySchema,
  updateBodySchema
});
