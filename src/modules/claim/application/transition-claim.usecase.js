const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { prisma } = require('../../../shared/prisma/prisma-client');

class TransitionClaimUseCase {
  async execute({ id, transitionId, userId }) {
    if (!transitionId) {
      throw new ValidationError('transitionId is required');
    }

    return prisma.$transaction(async tx => {
      const claim = await tx.claim.findUnique({
        where: { id },
        include: {
          status: true
        }
      });

      if (!claim) {
        throw new NotFoundError('Claim not found');
      }

      const transition = await tx.claimStatusTransition.findUnique({
        where: { id: transitionId },
        include: {
          statusTo: true,
          statusFrom: true
        }
      });

      if (!transition) {
        throw new NotFoundError('Claim status transition not found');
      }

      if (transition.status !== 'active') {
        throw new ValidationError('Transition is inactive');
      }

      if (transition.statusFromId !== claim.statusId) {
        throw new ValidationError(
          'Transition is not allowed from current claim status'
        );
      }

      if (
        transition.claimMotiveId &&
        transition.claimMotiveId !== claim.motiveId
      ) {
        throw new ValidationError(
          'Transition is not allowed for this claim motive'
        );
      }

      const updatedClaim = await tx.claim.update({
        where: { id },
        data: {
          statusId: transition.statusToId,
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
          changeType: 'status',
          oldValue: claim.statusId,
          newValue: transition.statusToId,
          metadataJson: JSON.stringify({
            source: 'claim.transition',
            transitionId: transition.id,
            transitionName: transition.name,
            statusFromId: transition.statusFromId,
            statusToId: transition.statusToId,
            statusToName: transition.statusTo.name,
            updatesDateSolve: transition.updatesDateSolve
          }),
          userCreated: userId || null
        }
      });

      await tx.outboxEvent.create({
        data: {
          topic: 'csx.claim.transitioned',
          eventName: 'claim.transitioned',
          aggregateType: 'claim',
          aggregateId: id,
          payloadJson: JSON.stringify({
            service: 'csx',
            entity: 'claim',
            eventName: 'transition',
            metadata: {
              id,
              transitionId: transition.id,
              statusId: transition.statusToId,
              statusName: transition.statusTo.name
            },
            previousStatusId: claim.statusId,
            userModified: userId || null
          }),
          status: 'pending'
        }
      });

      return updatedClaim;
    });
  }
}

module.exports = { TransitionClaimUseCase };
