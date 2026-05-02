const { z } = require('zod');

const attachClaimFileSchema = z.object({
  body: z.object({
    fileName: z.string().optional(),
    name: z.string().optional(),
    fileSource: z.string().optional(),
    url: z.string().optional(),
    mimeType: z.string().optional(),
    type: z.string().optional(),
    size: z.number().optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

const listClaimFilesSchema = z.object({
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

const getClaimFileSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1),
    fileId: z.string().min(1)
  }),
  headers: z.any()
});

module.exports = {
  attachClaimFileSchema,
  listClaimFilesSchema,
  getClaimFileSchema
};
