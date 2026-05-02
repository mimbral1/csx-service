const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimTypeRepository {
  async create(data) {
    return prisma.claimType.create({
      data
    });
  }

  async update(id, data) {
    return prisma.claimType.update({
      where: { id },
      data
    });
  }

  async findById(id) {
    return prisma.claimType.findUnique({
      where: { id },
      include: {
        motive: true,
        parent: true,
        children: true,
        areaInCharge: true
      }
    });
  }

  async findMany({ filters = {}, sortBy, sortDirection, pagination }) {
    const where = {};

    if (filters.id) where.id = filters.id;

    if (filters.name) {
      where.name = {
        contains: filters.name
      };
    }

    if (filters.claimMotiveId) where.claimMotiveId = filters.claimMotiveId;
    if (filters.parentId) where.parentId = filters.parentId;
    if (filters.areaInChargeId) where.areaInChargeId = filters.areaInChargeId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimType.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
        include: {
          motive: true,
          parent: true,
          areaInCharge: true
        }
      }),
      prisma.claimType.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }
}

module.exports = { PrismaClaimTypeRepository };
