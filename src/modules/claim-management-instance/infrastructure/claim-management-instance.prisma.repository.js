const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimManagementInstanceRepository {
  async create(data) {
    return prisma.claimManagementInstance.create({
      data,
      include: {
        management: true,
        managementStatus: true
      }
    });
  }

  async update(id, data) {
    return prisma.claimManagementInstance.update({
      where: { id },
      data,
      include: {
        management: true,
        managementStatus: true
      }
    });
  }

  async findById(id) {
    return prisma.claimManagementInstance.findUnique({
      where: { id },
      include: {
        claim: true,
        management: true,
        managementStatus: true
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
    const where = {
      claimId
    };

    if (filters.claimManagementId) {
      where.claimManagementId = filters.claimManagementId;
    }

    if (filters.claimManagementStatusId) {
      where.claimManagementStatusId = filters.claimManagementStatusId;
    }

    if (filters.assignedAreaId) {
      where.assignedAreaId = filters.assignedAreaId;
    }

    if (filters.assignedUserId) {
      where.assignedUserId = filters.assignedUserId;
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimManagementInstance.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
        include: {
          management: true,
          managementStatus: true
        }
      }),
      prisma.claimManagementInstance.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }
}

module.exports = { PrismaClaimManagementInstanceRepository };
