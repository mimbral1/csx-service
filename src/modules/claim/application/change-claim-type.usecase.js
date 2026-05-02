const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { addSlaToDate } = require('../../../shared/utils/date');
const { prisma } = require('../../../shared/prisma/prisma-client');

class ChangeClaimTypeUseCase {
  async execute({ id, typeIds, userId }) {
    if (!Array.isArray(typeIds) || typeIds.length === 0) {
      throw new ValidationError('typeIds is required');
    }

    return prisma.$transaction(async tx => {
      const claim = await tx.claim.findUnique({
        where: { id }
      });

      if (!claim) {
        throw new NotFoundError('Claim not found');
      }

      const claimTypes = await tx.claimType.findMany({
        where: {
          id: {
            in: typeIds
          },
          status: 'active'
        }
      });

      if (claimTypes.length !== typeIds.length) {
        throw new ValidationError('One or more claim types are invalid');
      }

      const { slaDueDate, priority } = this.resolveSlaAndPriority(claimTypes);
      const oldTypeJson = claim.typeJson || null;
      const newTypeJson = JSON.stringify(typeIds);

      if (
        oldTypeJson === newTypeJson &&
        this.normalizeValue(claim.slaDueDate) === this.normalizeValue(slaDueDate) &&
        claim.priority === priority
      ) {
        return claim;
      }

      const updatedClaim = await tx.claim.update({
        where: { id },
        data: {
          typeJson: newTypeJson,
          slaDueDate,
          priority,
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
          claimId: id,
          changeType: 'claim.type.changed',
          oldValue: oldTypeJson,
          newValue: newTypeJson,
          metadataJson: JSON.stringify({
            source: 'claim.change-type',
            oldPriority: claim.priority,
            newPriority: priority,
            oldSlaDueDate: claim.slaDueDate,
            newSlaDueDate: slaDueDate
          }),
          userCreated: userId || null
        }
      });

      await tx.outboxEvent.create({
        data: {
          topic: 'csx.claim.type.changed',
          eventName: 'claim.type.changed',
          aggregateType: 'claim',
          aggregateId: id,
          payloadJson: JSON.stringify({
            id,
            displayId: claim.displayId,
            typeIds,
            priority,
            slaDueDate,
            userModified: userId || null
          }),
          status: 'pending'
        }
      });

      return updatedClaim;
    });
  }

  resolveSlaAndPriority(claimTypes) {
    let slaDueDate = null;
    let priority = 'noPriority';

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

    priority = this.resolveHighestPriority(claimTypes);

    return {
      slaDueDate,
      priority
    };
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

  normalizeValue(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  }
}

module.exports = { ChangeClaimTypeUseCase };
