const { z } = require('zod');

const createClaimManagementInstanceSchema = z.object({
  body: z.object({
    claimManagementId: z.string().min(1),
    claimManagementStatusId: z.string().min(1),
    comment: z.string().optional(),
    assignedAreaId: z.string().optional(),
    assignedUserId: z.string().optional()
  }),
  query: z.any(),
  params: z.object({
    claimId: z.string().min(1)
  }),
  headers: z.any()
});

const updateClaimManagementInstanceSchema = z.object({
  body: z.object({
    claimManagementStatusId: z.string().optional(),
    comment: z.string().nullable().optional(),
    assignedAreaId: z.string().nullable().optional(),
    assignedUserId: z.string().nullable().optional()
  }),
  query: z.any(),
  params: z.object({
    claimManagementInstanceId: z.string().min(1)
  }),
  headers: z.any()
});

const listClaimManagementInstancesSchema = z.object({
  body: z.any(),
  query: z.object({
    sortBy: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    filters: z.any().optional()
  }),
  params: z.object({
    claimId: z.string().min(1)
  }),
  headers: z.any()
});

module.exports = {
  createClaimManagementInstanceSchema,
  updateClaimManagementInstanceSchema,
  listClaimManagementInstancesSchema
};
