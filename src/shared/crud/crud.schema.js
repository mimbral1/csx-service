const { z } = require('zod');

function createBaseCrudSchemas({ createBodySchema, updateBodySchema }) {
  const createSchema = z.object({
    body: createBodySchema,
    query: z.any(),
    params: z.any(),
    headers: z.any()
  });

  const updateSchema = z.object({
    body: updateBodySchema,
    query: z.any(),
    params: z.object({
      id: z.string().min(1)
    }),
    headers: z.any()
  });

  const getSchema = z.object({
    body: z.any(),
    query: z.any(),
    params: z.object({
      id: z.string().min(1)
    }),
    headers: z.any()
  });

  const listSchema = z.object({
    body: z.any(),
    query: z.object({
      sortBy: z.string().optional(),
      sortDirection: z.enum(['asc', 'desc']).optional(),
      filters: z.any().optional()
    }),
    params: z.any(),
    headers: z.any()
  });

  return {
    createSchema,
    updateSchema,
    getSchema,
    listSchema
  };
}

module.exports = { createBaseCrudSchemas };
