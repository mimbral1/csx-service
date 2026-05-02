const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimStatusTransitionRepository {
  async create(data) {
    return prisma.claimStatusTransition.create({
      data
    });
  }

  async update(id, data) {
    return prisma.claimStatusTransition.update({
      where: { id },
      data
    });
  }

  async findById(id) {
    return prisma.claimStatusTransition.findUnique({
      where: { id },
      include: {
        motive: true,
        statusFrom: true,
        statusTo: true
      }
    });
  }

  async findMany({ filters = {}, sortBy, sortDirection, pagination }) {
    const where = {};

    if (filters.id) {
      where.id = filters.id;
    }

    if (filters.name) {
      where.name = {
        contains: filters.name
      };
    }

    if (filters.claimMotiveId) {
      where.claimMotiveId = filters.claimMotiveId;
    }

    if (filters.statusFromId) {
      where.statusFromId = filters.statusFromId;
    }

    if (filters.statusToId) {
      where.statusToId = filters.statusToId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claimStatusTransition.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
        include: {
          motive: true,
          statusFrom: true,
          statusTo: true
        }
      }),
      prisma.claimStatusTransition.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  async findPossibleTransitions({ currentStatusId, motiveId }) {
    return prisma.claimStatusTransition.findMany({
      where: {
        status: 'active',
        statusFromId: currentStatusId,
        OR: [
          {
            claimMotiveId: null
          },
          {
            claimMotiveId: motiveId
          }
        ]
      },
      include: {
        statusFrom: true,
        statusTo: true,
        motive: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }
}

module.exports = { PrismaClaimStatusTransitionRepository };
