const { z } = require('zod');

const claimItemTypeEnum = z.enum(['item', 'order', 'package']);

const createClaimItemsSchema = z.object({
  body: z.object({
    type: claimItemTypeEnum.optional(),
    typeId: z.string().optional(),
    orderId: z.string().optional(),

    claimTypeId: z.string().min(1),
    claimItemResolutionId: z.string().min(1),
    areaInChargeId: z.string().optional(),

    comment: z.string().optional(),
    quantity: z.number().optional(),
    price: z.number().optional(),

    items: z.array(
      z.object({
        itemId: z.string().min(1),
        claimTypeId: z.string().optional(),
        claimItemResolutionId: z.string().optional(),
        areaInChargeId: z.string().optional(),
        comment: z.string().optional(),
        quantity: z.number().optional(),
        price: z.number().optional()
      })
    ).optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const updateClaimItemSchema = z.object({
  body: z.object({
    claimTypeId: z.string().optional(),
    areaInChargeId: z.string().nullable().optional(),
    claimItemResolutionId: z.string().optional(),
    comment: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    price: z.number().nullable().optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1),
    claimItemId: z.string().min(1)
  }),
  headers: z.any()
});

const getClaimItemSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1),
    claimItemId: z.string().min(1)
  }),
  headers: z.any()
});

const listClaimItemsSchema = z.object({
  body: z.any(),
  query: z.object({
    sortBy: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    filters: z.any().optional()
  }),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

module.exports = {
  createClaimItemsSchema,
  updateClaimItemSchema,
  getClaimItemSchema,
  listClaimItemsSchema
};
