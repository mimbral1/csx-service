const { z } = require('zod');

const assignCompensationToClaimSchema = z.object({
  body: z.object({
    compensationId: z.string().min(1),
    comment: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional()
  }),
  query: z.any(),
  params: z.object({
    claimId: z.string().min(1)
  }),
  headers: z.any()
});

module.exports = {
  assignCompensationToClaimSchema
};
