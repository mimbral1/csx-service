const { z } = require('zod');
const { createBaseCrudSchemas } = require('../../../shared/crud/crud.schema');

const createBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),

  claimMotiveId: z.string().min(1),
  parentId: z.string().nullable().optional(),
  areaInChargeId: z.string().nullable().optional(),

  sla: z.number().int().positive().optional(),
  slaMeasuredIn: z.enum(['hours', 'days', 'weeks']).optional(),

  priority: z.enum([
    'noPriority',
    'low',
    'medium',
    'high',
    'urgent'
  ]).optional(),

  affectedProcessesJson: z.string().optional(),
  compensationsJson: z.string().optional(),

  status: z.enum(['active', 'inactive']).optional()
});

const updateBodySchema = createBodySchema.partial();

module.exports = createBaseCrudSchemas({
  createBodySchema,
  updateBodySchema
});
