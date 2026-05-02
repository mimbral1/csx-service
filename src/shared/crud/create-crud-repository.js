const { prisma } = require('../prisma/prisma-client');

function createCrudRepository({ modelName, searchableFields = [] }) {
  return {
    async create(data) {
      return prisma[modelName].create({ data });
    },

    async update(id, data) {
      return prisma[modelName].update({
        where: { id },
        data
      });
    },

    async findById(id) {
      return prisma[modelName].findUnique({
        where: { id }
      });
    },

    async findMany({ filters = {}, sortBy, sortDirection, pagination }) {
      const where = {};

      for (const [key, value] of Object.entries(filters || {})) {
        if (value === undefined || value === null || value === '') continue;

        if (searchableFields.includes(key)) {
          where[key] = {
            contains: value
          };
        } else {
          where[key] = value;
        }
      }

      const orderBy = sortBy
        ? { [sortBy]: sortDirection || 'asc' }
        : { dateCreated: 'desc' };

      const [data, total] = await Promise.all([
        prisma[modelName].findMany({
          where,
          orderBy,
          skip: pagination.skip,
          take: pagination.take
        }),
        prisma[modelName].count({ where })
      ]);

      return {
        data,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
    }
  };
}

module.exports = { createCrudRepository };
