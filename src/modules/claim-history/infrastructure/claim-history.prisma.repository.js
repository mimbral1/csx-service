const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimHistoryRepository {
  async create(data) {
    return prisma.claimHistory.create({
      data
    });
  }

  async createMany(items) {
    const created = [];

    for (const item of items) {
      const history = await prisma.claimHistory.create({
        data: item
      });

      created.push(history);
    }

    return created;
  }

  async findMany({ filters = {}, sortBy, sortDirection, pagination }) {
    const where = {};

    if (filters.claimId || filters.claim) {
      where.claimId = filters.claimId || filters.claim;
    }

    if (filters.changeType) {
      where.changeType = filters.changeType;
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimHistory.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.claimHistory.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }
}

module.exports = { PrismaClaimHistoryRepository };
