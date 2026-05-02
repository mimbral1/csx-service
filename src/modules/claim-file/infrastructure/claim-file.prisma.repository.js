const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimFileRepository {
  async create(data) {
    return prisma.claimFile.create({
      data
    });
  }

  async findById({ claimId, fileId }) {
    return prisma.claimFile.findFirst({
      where: {
        id: fileId,
        claimId
      }
    });
  }

  async findManyByClaimId({
    claimId,
    filters = {},
    sortBy,
    sortDirection,
    pagination
  }) {
    const where = { claimId };

    if (filters.id) {
      where.id = filters.id;
    }

    if (filters.name) {
      where.name = {
        contains: filters.name
      };
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimFile.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.claimFile.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  async delete({ claimId, fileId }) {
    return prisma.claimFile.delete({
      where: {
        id: fileId
      }
    });
  }
}

module.exports = { PrismaClaimFileRepository };
