const { prisma } = require('../../../shared/prisma/prisma-client');

class PrismaClaimRepository {
  async create(data) {
    return prisma.claim.create({
      data,
      include: {
        channel: true,
        motive: true,
        status: true
      }
    });
  }

  async update(id, data) {
    return prisma.claim.update({
      where: { id },
      data,
      include: {
        channel: true,
        motive: true,
        status: true,
        items: true,
        files: true
      }
    });
  }

  async findById(id) {
    return prisma.claim.findUnique({
      where: { id },
      include: {
        channel: true,
        motive: true,
        status: true,
        items: {
          include: {
            resolution: true,
            claimType: true,
            areaInCharge: true
          }
        },
        files: true,
        managements: {
          include: {
            management: true,
            managementStatus: true
          }
        },
        compensations: {
          include: {
            compensation: true
          }
        }
      }
    });
  }

  async findMany({ filters = {}, sortBy, sortDirection, pagination }) {
    const where = {};

    if (filters.id) where.id = filters.id;
    if (filters.displayId) where.displayId = filters.displayId;
    if (filters.channelId) where.channelId = filters.channelId;
    if (filters.motiveId) where.motiveId = filters.motiveId;
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.statusId) where.statusId = filters.statusId;
    if (filters.priority) where.priority = filters.priority;

    if (filters.escalated !== undefined) {
      where.escalated = filters.escalated === true || filters.escalated === 'true';
    }

    if (filters.dateCreatedRange) {
      where.dateCreated = {};

      if (filters.dateCreatedRange.from) {
        where.dateCreated.gte = new Date(filters.dateCreatedRange.from);
      }

      if (filters.dateCreatedRange.to) {
        where.dateCreated.lte = new Date(filters.dateCreatedRange.to);
      }
    }

    if (filters.slaDueDateRange) {
      where.slaDueDate = {};

      if (filters.slaDueDateRange.from) {
        where.slaDueDate.gte = new Date(filters.slaDueDateRange.from);
      }

      if (filters.slaDueDateRange.to) {
        where.slaDueDate.lte = new Date(filters.slaDueDateRange.to);
      }
    }

    const orderBy = sortBy
      ? { [sortBy]: sortDirection || 'asc' }
      : { dateCreated: 'desc' };

    const [data, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
        include: {
          channel: true,
          motive: true,
          status: true
        }
      }),
      prisma.claim.count({ where })
    ]);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  async findInitialStatus() {
    return prisma.claimStatus.findFirst({
      where: {
        isInitial: true,
        status: 'active'
      }
    });
  }

  async findExpiredOpenClaims() {
    return prisma.claim.findMany({
      where: {
        slaDueDate: {
          lt: new Date()
        },
        status: {
          isFinal: false
        }
      },
      include: {
        status: true
      }
    });
  }
}

module.exports = { PrismaClaimRepository };
