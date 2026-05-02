const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimItemRepository {
  async createMany(items) {
    const created = [];

    for (const item of items) {
      const claimItem = await prisma.claimItem.create({
        data: item,
        include: this.defaultInclude()
      });

      created.push(claimItem);
    }

    return created;
  }

  async findById({ claimId, claimItemId }) {
    return prisma.claimItem.findFirst({
      where: {
        id: claimItemId,
        claimId
      },
      include: this.defaultInclude()
    });
  }

  async update({ claimId, claimItemId, data }) {
    await this.findById({ claimId, claimItemId });

    return prisma.claimItem.update({
      where: {
        id: claimItemId
      },
      data,
      include: this.defaultInclude()
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

    if (filters.id) where.id = filters.id;
    if (filters.type) where.type = filters.type;
    if (filters.typeId) where.typeId = filters.typeId;
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.claimTypeId) where.claimTypeId = filters.claimTypeId;
    if (filters.claimItemResolutionId) {
      where.claimItemResolutionId = filters.claimItemResolutionId;
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimItem.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
        include: this.defaultInclude()
      }),
      prisma.claimItem.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  defaultInclude() {
    return {
      resolution: true,
      claimType: true,
      areaInCharge: true
    };
  }
}

module.exports = { PrismaClaimItemRepository };
