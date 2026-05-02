const { z } = require('zod');
const { createBaseCrudSchemas } = require('../../../shared/crud/crud.schema');

const createBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),

  shouldCreateOrder: z.boolean().optional(),
  shouldPickItem: z.boolean().optional(),
  shouldInvoicedItem: z.boolean().optional(),
  shouldGenerateCreditNote: z.boolean().optional(),

  status: z.enum(['active', 'inactive']).optional()
});

const updateBodySchema = createBodySchema.partial();

module.exports = createBaseCrudSchemas({
  createBodySchema,
  updateBodySchema
});
