const { z } = require('zod');

const priorityEnum = z.enum([
  'noPriority',
  'low',
  'medium',
  'high',
  'urgent'
]);

const createClaimSchema = z.object({
  body: z.object({
    channelId: z.string().min(1),
    motiveId: z.string().min(1),
    type: z.array(z.string()).optional(),
    orderId: z.string().min(1),
    storeId: z.string().min(1),
    customerId: z.string().min(1),
    assigneeId: z.string().optional(),
    priority: priorityEnum.optional()
  }),
  query: z.any(),
  params: z.any(),
  headers: z.any()
});

const updateClaimSchema = z.object({
  body: z.object({
    channelId: z.string().optional(),
    motiveId: z.string().optional(),
    orderId: z.string().optional(),
    storeId: z.string().optional(),
    customerId: z.string().optional(),
    escalated: z.boolean().optional(),
    assigneeId: z.string().nullable().optional(),
    slaDueDate: z.string().datetime().optional(),
    priority: priorityEnum.optional(),
    statusId: z.string().optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const getClaimSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const listClaimsSchema = z.object({
  body: z.any(),
  query: z.object({
    sortBy: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    filters: z.any().optional()
  }),
  params: z.any(),
  headers: z.any()
});

const assignClaimSchema = z.object({
  body: z.object({
    assigneeId: z.string().min(1)
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const transitionClaimSchema = z.object({
  body: z.object({
    transitionId: z.string().min(1)
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const changeClaimTypeSchema = z.object({
  body: z.object({
    typeIds: z.array(z.string().min(1)).min(1)
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const idParamSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

module.exports = {
  createClaimSchema,
  updateClaimSchema,
  getClaimSchema,
  listClaimsSchema,
  assignClaimSchema,
  transitionClaimSchema,
  changeClaimTypeSchema,
  idParamSchema
};
