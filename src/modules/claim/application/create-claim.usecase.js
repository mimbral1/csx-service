const { ValidationError } = require('../../../shared/errors/ValidationError');
const { generateDisplayId } = require('../../../shared/utils/generate-display-id');
const { addSlaToDate } = require('../../../shared/utils/date');
const { prisma } = require('../../../shared/prisma/prisma-client');

class CreateClaimUseCase {
  constructor({ claimRepository }) {
    this.claimRepository = claimRepository;
  }

  async execute({ data, userId }) {
    return prisma.$transaction(async tx => {
      const initialStatus = await tx.claimStatus.findFirst({
        where: {
          isInitial: true,
          status: 'active'
        }
      });

      if (!initialStatus) {
        throw new ValidationError('Initial claim status is not configured');
      }

      const claimTypeIds = Array.isArray(data.type) ? data.type : [];

      const { slaDueDate, priority } = await this.resolveSlaAndPriority({
        tx,
        claimTypeIds,
        requestedPriority: data.priority
      });

      const claim = await tx.claim.create({
        data: {
          displayId: generateDisplayId(),
          channelId: data.channelId,
          motiveId: data.motiveId,
          typeJson: JSON.stringify(claimTypeIds),
          orderId: data.orderId,
          storeId: data.storeId,
          customerId: data.customerId,
          assigneeId: data.assigneeId || null,
          escalated: false,
          repetitions: 0,
          priority,
          slaDueDate,
          statusId: initialStatus.id,
          userCreated: userId || null,
          userModified: userId || null
        },
        include: {
          channel: true,
          motive: true,
          status: true
        }
      });

      await tx.claimHistory.create({
        data: {
          claimId: claim.id,
          changeType: 'claim.created',
          oldValue: null,
          newValue: claim.id,
          metadataJson: JSON.stringify({
            source: 'claim.create',
            displayId: claim.displayId,
            initialStatusId: initialStatus.id,
            claimTypeIds,
            slaDueDate,
            priority
          }),
          userCreated: userId || null
        }
      });

      await tx.outboxEvent.create({
        data: {
          topic: 'csx.claim.created',
          eventName: 'claim.created',
          aggregateType: 'claim',
          aggregateId: claim.id,
          payloadJson: JSON.stringify({
            id: claim.id,
            displayId: claim.displayId,
            channelId: claim.channelId,
            motiveId: claim.motiveId,
            orderId: claim.orderId,
            storeId: claim.storeId,
            customerId: claim.customerId,
            statusId: claim.statusId,
            assigneeId: claim.assigneeId,
            priority: claim.priority,
            slaDueDate: claim.slaDueDate,
            userCreated: userId || null
          }),
          status: 'pending'
        }
      });

      return claim;
    });
  }

  async resolveSlaAndPriority({ tx, claimTypeIds, requestedPriority }) {
    let slaDueDate = null;
    let priority = requestedPriority || 'noPriority';

    if (!claimTypeIds.length) {
      return { slaDueDate, priority };
    }

    const claimTypes = await tx.claimType.findMany({
      where: {
        id: {
          in: claimTypeIds
        }
      }
    });

    const claimTypeWithShortestSla = claimTypes
      .filter(type => type.sla && type.slaMeasuredIn)
      .sort((a, b) => {
        return this.toHours(a.sla, a.slaMeasuredIn) - this.toHours(b.sla, b.slaMeasuredIn);
      })[0];

    if (claimTypeWithShortestSla) {
      slaDueDate = addSlaToDate(
        new Date(),
        claimTypeWithShortestSla.sla,
        claimTypeWithShortestSla.slaMeasuredIn
      );
    }

    if (!requestedPriority && claimTypes.length > 0) {
      priority = this.resolveHighestPriority(claimTypes);
    }

    return { slaDueDate, priority };
  }

  toHours(amount, measuredIn) {
    if (measuredIn === 'hours') return amount;
    if (measuredIn === 'days') return amount * 24;
    if (measuredIn === 'weeks') return amount * 24 * 7;
    return 999999;
  }

  resolveHighestPriority(claimTypes) {
    const priorityWeight = {
      noPriority: 0,
      low: 1,
      medium: 2,
      high: 3,
      urgent: 4
    };

    const sorted = [...claimTypes].sort((a, b) => {
      return (
        priorityWeight[b.priority || 'noPriority'] -
        priorityWeight[a.priority || 'noPriority']
      );
    });

    return sorted[0]?.priority || 'noPriority';
  }
}

module.exports = { CreateClaimUseCase };
