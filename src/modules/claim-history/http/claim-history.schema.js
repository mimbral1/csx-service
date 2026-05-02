const { z } = require('zod');

const listClaimHistorySchema = z.object({
  body: z.any(),
  query: z.object({
    sortBy: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    filters: z.any().optional()
  }),
  params: z.any(),
  headers: z.any()
});

module.exports = { listClaimHistorySchema };
