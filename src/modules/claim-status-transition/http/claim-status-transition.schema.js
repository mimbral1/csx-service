const { z } = require('zod');
const { createBaseCrudSchemas } = require('../../../shared/crud/crud.schema');

const createBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),

  claimMotiveId: z.string().optional(),
  statusFromId: z.string().min(1),
  statusToId: z.string().min(1),

  color: z.string().optional(),
  requiresPermissions: z.boolean().optional(),
  updatesDateSolve: z.boolean().optional(),

  status: z.enum(['active', 'inactive']).optional()
});

const updateBodySchema = createBodySchema.partial();

module.exports = createBaseCrudSchemas({
  createBodySchema,
  updateBodySchema
});
